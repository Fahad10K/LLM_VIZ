import React from 'react';

import { scaleSequential } from 'd3-scale';
import { interpolateGreys } from 'd3-scale-chromatic';
import { ArrowRight } from 'lucide-react';

const VectorHeatmap = ({ vector }) => {
  if (!vector) return null;
  const colorScale = scaleSequential(interpolateGreys).domain([Math.min(...vector), Math.max(...vector)]);
  return (
    <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-md">
      {vector.map((value, i) => (
        <div
          key={i}
          className="w-2 h-2 border border-white"
          style={{ backgroundColor: colorScale(value) }}
          title={`Dimension ${i + 1}: ${value.toFixed(4)}`}
        ></div>
      ))}
    </div>
  );
};

const FirstTokenGeneration = ({ data }) => {
  if (!data) {
    return <p className="text-sm text-gray-500">First token generation data not available.</p>;
  }

  const { top_k_tokens, top_k_probabilities, chosen_token, output_vector } = data;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center space-x-4">
        {/* Step 1: Output Vector */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-center mb-2">1. Final Output Vector</h4>
          <p className="text-xs text-gray-500 text-center mb-2">The model produces a final vector after processing the input.</p>
          <VectorHeatmap vector={output_vector} />
        </div>

        <ArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />

        {/* Step 2: Logits to Probabilities */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-center mb-2">2. Softmax</h4>
          <p className="text-xs text-gray-500 text-center mb-2">This vector is converted into probabilities for every word in the vocabulary.</p>
          <div className="bg-gray-800 text-white font-mono p-3 rounded-lg text-center text-sm">
            P(token) = softmax(vector)
          </div>
        </div>

        <ArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />

        {/* Step 3: Top Predictions */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-center mb-2">3. Top 5 Predictions</h4>
          <p className="text-xs text-gray-500 text-center mb-2">The most likely tokens are selected. The chosen one is green.</p>
          <div className="space-y-1">
            {top_k_tokens.map((token, i) => {
              const probability = top_k_probabilities[i];
              const isChosen = token.trim() === chosen_token.trim();
              return (
                <div key={i} className="flex items-center text-xs">
                  <div className="w-16 font-mono truncate pr-2">{token}</div>
                  <div className="flex-grow bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${isChosen ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${probability * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right font-mono">{(probability * 100).toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstTokenGeneration;
