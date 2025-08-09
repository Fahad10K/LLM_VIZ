import React from 'react';
import { ArrowRight } from 'lucide-react';

const PipelineBlock = ({ title, subtitle, children, color }) => (
  <div className={`p-3 rounded-lg border-2 ${color || 'border-gray-300'} bg-white`}>
    <h4 className="font-bold text-gray-800">{title}</h4>
    <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
    <div className="text-xs font-mono bg-gray-100 p-2 rounded">
      {children}
    </div>
  </div>
);

const Arrow = () => (
  <div className="flex items-center justify-center">
    <ArrowRight className="w-6 h-6 text-gray-400" />
  </div>
);

const FirstTokenPipeline = ({ data }) => {
  if (!data) {
    return <p className="text-sm text-gray-500">Pipeline data not available.</p>;
  }

  const { input_tokens, first_token_generation } = data;
  const { chosen_token } = first_token_generation;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">First Token Generation Pipeline</h3>
      <p className="text-sm text-gray-600 mb-4">
        This shows how the model processes your input to generate the very first token of its response, <strong>'{chosen_token}'</strong>.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-9 gap-2 items-center">
        {/* Input Embeddings */}
        <div className="md:col-span-2">
          <PipelineBlock title="1. Input Embeddings" subtitle="Input tokens are converted to vectors.">
            Input: [{input_tokens.map(t => `"${t}"`).join(', ')}]
          </PipelineBlock>
        </div>
        <Arrow />
        {/* Attention */}
        <div className="md:col-span-2">
          <PipelineBlock title="2. Attention" subtitle="Model weighs token importance.">
            Attn(Q, K, V)
          </PipelineBlock>
        </div>
        <Arrow />
        {/* FFN */}
        <div className="md:col-span-2">
          <PipelineBlock title="3. Feed-Forward Net" subtitle="Further processing of information.">
            FFN(x)
          </PipelineBlock>
        </div>
        <Arrow />
        {/* Output */}
        <div className="md:col-span-1">
          <PipelineBlock title="4. Output" subtitle="The result is the first new token." color="border-green-500">
            Token: "{chosen_token}"
          </PipelineBlock>
        </div>
      </div>
    </div>
  );
};

export default FirstTokenPipeline;
