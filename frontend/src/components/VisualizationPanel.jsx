import React from 'react';

import LLMProcessFlow from './LLMProcessFlow';
import TopKTokenProbabilities from './TopKTokenProbabilities';
import FFNActivations from './FFNActivations';
import AttentionExplorer from './AttentionExplorer';
import FirstTokenGeneration from './FirstTokenGeneration';
import EmbeddingInspector from './EmbeddingInspector';
import SemanticSimilarityPlot from './SemanticSimilarityPlot';
import LayerRefinementPlot from './LayerRefinementPlot';
import ResidualConnectionDiagram from './ResidualConnectionDiagram';
import AttentionCalculationExplained from './AttentionCalculationExplained';
import FirstTokenPipeline from './FirstTokenPipeline';
import TokenizationDisplay from './TokenizationDisplay';

const Section = ({ title, subtitle, children }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
    {children}
  </div>
);



const VisualizationPanel = ({ data }) => {
  // Initial state when no data has been received yet.
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z" /></svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">LLM Visualization</h3>
          <p className="mt-2 text-sm text-gray-500">Send a message to see the LLM's inner workings.</p>
        </div>
      </div>
    );
  }

  // Destructure all potential visualization data points from the data object.
  const {
    input_tokens,
    first_token_generation,
    all_attention_heads,
    ffn_activations,
    embeddings,
    top_k_tokens
  } = data;

  return (
    <div className="h-full bg-gray-50 overflow-y-auto p-4 space-y-4">
      {/* Each section now renders independently and dynamically as its data becomes available. */}

      {first_token_generation && (
        <Section title="First Token Generation" subtitle="Visualizing the final steps of generating the first new token.">
          <FirstTokenGeneration data={first_token_generation} />
        </Section>
      )}

      {input_tokens && (
        <Section title="Tokenization" subtitle="Your input text is broken down into tokens the model can understand.">
          <TokenizationDisplay tokens={input_tokens} />
        </Section>
      )}

      <Section title="How Attention Works" subtitle="A breakdown of the famous attention formula that powers transformers.">
        <AttentionCalculationExplained />
      </Section>

      {all_attention_heads && (
        <Section title="Attention Heatmap Explorer" subtitle="Each heatmap shows what a single attention head is focusing on.">
          <AttentionExplorer tokens={input_tokens} attentionHeads={all_attention_heads} />
        </Section>
      )}

      <ResidualConnectionDiagram />

      {ffn_activations && (
        <Section title="Feed-Forward Network Activations" subtitle="Neuron activations in the final transformer layer.">
          <FFNActivations tokens={input_tokens} ffnActivations={ffn_activations} />
        </Section>
      )}

      {embeddings && (
        <Section title="Embedding Analysis" subtitle="Visualizing the meaning of your input tokens.">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EmbeddingInspector tokens={input_tokens} embeddings={embeddings} />
            <SemanticSimilarityPlot tokens={input_tokens} embeddings={embeddings} />
          </div>
        </Section>
      )}

      {top_k_tokens && (
        <Section title="Next Token Prediction" subtitle="The model's top 5 choices for the next word.">
          <TopKTokenProbabilities topK={top_k_tokens} />
        </Section>
      )}
    </div>
  );
};

export default VisualizationPanel;
