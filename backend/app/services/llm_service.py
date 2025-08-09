import torch
import sys
import os
from pathlib import Path
from transformers import AutoModelForCausalLM, AutoTokenizer
from sentence_transformers import SentenceTransformer
from typing import Dict, List, Any
import numpy as np
import time

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).parent.parent.parent))
from app.config import settings

class LLMService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.tokenizer = None
        self.embedding_model = None
        self._is_loading = False
        self.ffn_activations = [] # To store FFN activations
        self._loading_progress = {
            'tokenizer': 0,
            'model': 0,
            'embedding_model': 0
        }
    
    def get_loading_progress(self) -> float:
        """Get the current loading progress as a percentage."""
        total = sum(self._loading_progress.values())
        max_possible = len(self._loading_progress) * 100
        return (total / max_possible) * 100 if max_possible > 0 else 0

    async def _load_models(self):
        """Load all necessary models and tokenizers asynchronously."""
        if self._is_loading:
            return
        self._is_loading = True
        
        try:
            print(f"[1/3] Loading tokenizer: {settings.MODEL_NAME}")
            self.tokenizer = AutoTokenizer.from_pretrained(settings.MODEL_NAME)
            if self.tokenizer.pad_token is None:
                print("Tokenizer does not have a pad token, setting it to eos_token.")
                self.tokenizer.pad_token = self.tokenizer.eos_token
            self._loading_progress['tokenizer'] = 100
            
            print(f"[2/3] Loading model: {settings.MODEL_NAME}")
            self.model = AutoModelForCausalLM.from_pretrained(
                settings.MODEL_NAME
            ).to(self.device)

            # Add a hook to the last FFN layer to capture activations
            def get_ffn_activations_hook(module, input, output):
                # The output of the activation function (e.g., GELU) in the FFN
                self.ffn_activations.append(output.detach().cpu())

            # Register the hook on the second linear layer of the FFN in the last layer
            last_layer_ffn_output = self.model.transformer.h[-1].mlp.c_proj
            last_layer_ffn_output.register_forward_hook(get_ffn_activations_hook)

            self._loading_progress['model'] = 100
            
            print(f"[3/3] Loading embedding model: {settings.EMBEDDING_MODEL}")
            self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL, device=self.device)
            self._loading_progress['embedding_model'] = 100
            print("All models loaded successfully.")
            
        except Exception as e:
            print(f"Error loading models: {e}")
            # Reset progress on failure
            self._loading_progress = {k: 0 for k in self._loading_progress}
            raise
        finally:
            self._is_loading = False
            
    def is_ready(self) -> bool:
        """Check if all models are loaded and ready."""
        return all(v == 100 for v in self._loading_progress.values())
    
    async def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate a response and extract visualization data."""
        if not self.is_ready():
            await self._load_models()

        # 1. Clear previous activations and tokenize the input prompt.
        self.ffn_activations.clear()
        inputs = self.tokenizer(prompt, return_tensors="pt", padding=True, truncation=True, max_length=512).to(self.device)
        input_seq_len = inputs['input_ids'].shape[1]

        # 2. Run the generation process with all necessary outputs enabled.
        # 2. Run the generation process with all necessary outputs enabled.
        generation_params = {
            "max_new_tokens": 150,
            "num_return_sequences": 1,
            "pad_token_id": self.tokenizer.eos_token_id,
            "eos_token_id": self.tokenizer.eos_token_id,
            "output_scores": True,
            "return_dict_in_generate": True,
            "output_attentions": True,
            "output_hidden_states": True,
            "temperature": 0.8,
            "repetition_penalty": 1.2,
            "top_k": 50,
            "do_sample": True,
        }
        with torch.no_grad():
            generation_outputs = self.model.generate(
                **inputs,
                **generation_params,
            )

        # 3. Decode the full response text.
        response_text = self.tokenizer.decode(generation_outputs.sequences[0], skip_special_tokens=True)

        # 4. Extract data for the first-token-generation visualization.
        first_token_logits = generation_outputs.scores[0][0] # Logits for the first generated token
        first_token_probs = torch.softmax(first_token_logits, dim=-1)
        top_k_probs, top_k_indices = torch.topk(first_token_probs, 5)
        top_k_tokens = [self.tokenizer.decode(i) for i in top_k_indices]
        chosen_token_id = generation_outputs.sequences[0][input_seq_len]

        # The final hidden state for the last input token, which is used to predict the next token.
        # The structure is: (token_idx, layer_idx, batch_idx, token_in_seq_idx, hidden_dim)
        # We want the hidden state for the first generated token, from the last layer.
        final_hidden_state = generation_outputs.hidden_states[0][-1][0, -1, :].cpu().numpy().tolist()

        first_token_generation_data = {
            "top_k_tokens": top_k_tokens,
            "top_k_probabilities": top_k_probs.tolist(),
            "chosen_token": self.tokenizer.decode(chosen_token_id),
            "output_vector": final_hidden_state,
        }

        # 5. Extract other visualization data from the generation output.
        tokens = [self.tokenizer.decode(i) for i in inputs.input_ids[0]]
        
        # Attention from the last layer of the input prompt
        attention_data = generation_outputs.attentions[0][-1][0, :, :, :].mean(dim=0).cpu().numpy().tolist()
        
        # Embeddings from the first layer of the input prompt
        initial_embeddings = generation_outputs.hidden_states[0][0][0, :, :].cpu().numpy().tolist()
        
        # FFN activations captured by the hook (for the input prompt)
        ffn_activations_data = self.ffn_activations[0][0, :, :].cpu().numpy().tolist() if self.ffn_activations else None

        visualization_data = {
            "input_tokens": tokens,
            "attention": attention_data,
            "embeddings": initial_embeddings,
            "ffn_activations": ffn_activations_data,
            "first_token_generation": first_token_generation_data,
        }

        return {
            "response": response_text,
            "visualization_data": visualization_data
        }
    
    def get_embeddings(self, text: str) -> List[float]:
        """Generate embeddings for a given text."""
        if not self.is_ready():
            raise RuntimeError("Embedding model is not loaded.")
        return self.embedding_model.encode(text).tolist()

# Singleton instance of the service
llm_service = LLMService()
