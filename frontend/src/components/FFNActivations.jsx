import React from 'react';
import { scaleSequential } from 'd3-scale';
import { interpolateViridis } from 'd3-scale-chromatic';

const FFNActivations = ({ tokens, ffnActivations }) => {
  if (!ffnActivations || ffnActivations.length === 0) {
    return <p className="text-sm text-gray-500">FFN activation data not available.</p>;
  }

  // The FFN layer is large (e.g., 3072 neurons for GPT-2). We'll visualize a subset.
  const neuronsToShow = 128;
  const truncatedActivations = ffnActivations.map(tokenActivations => 
    tokenActivations.slice(0, neuronsToShow)
  );

  // Find the min and max activation values for the color scale domain
  const allValues = truncatedActivations.flat();
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const colorScale = scaleSequential(interpolateViridis).domain([minVal, maxVal]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">Feed-Forward Network (FFN) Activations</h3>
      <p className="text-sm text-gray-600 mb-4">
        This heatmap shows the activation values of the first {neuronsToShow} neurons in the final FFN layer for each input token. Bright colors indicate high activation.
      </p>
      <div className="flex overflow-x-auto">
        {/* Token Labels (Y-axis) */}
        <div className="flex-shrink-0 w-24 pr-2 text-right">
          {tokens.map((token, i) => (
            <div key={`token-label-${i}`} className="h-4 flex items-center justify-end text-xs font-mono whitespace-nowrap">
              {token}
            </div>
          ))}
        </div>
        {/* Heatmap Grid */}
        <div className="flex flex-col">
          {truncatedActivations.map((neuronValues, tokenIndex) => (
            <div key={`token-row-${tokenIndex}`} className="flex">
              {neuronValues.map((value, neuronIndex) => (
                <div
                  key={`neuron-${neuronIndex}`}
                  className="w-2 h-4"
                  style={{ backgroundColor: colorScale(value) }}
                  title={`Token: ${tokens[tokenIndex]}, Neuron: ${neuronIndex}, Activation: ${value.toFixed(4)}`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FFNActivations;
