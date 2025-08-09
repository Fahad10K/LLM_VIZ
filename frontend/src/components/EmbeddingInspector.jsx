import React, { useState } from 'react';
import { scaleSequential } from 'd3-scale';
import { interpolateGreys } from 'd3-scale-chromatic';

const EmbeddingInspector = ({ tokens, embeddings }) => {

  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);

  if (!embeddings || embeddings.length === 0) {
    return <p className="text-sm text-gray-500">Embedding data not available.</p>;
  }

  const selectedEmbedding = embeddings[selectedTokenIndex];
  const colorScale = scaleSequential(interpolateGreys).domain([Math.min(...selectedEmbedding), Math.max(...selectedEmbedding)]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Embedding Vector Inspector</h3>
        <div className="flex items-center space-x-2">
          <label htmlFor="token-selector" className="text-sm font-medium text-gray-700">Select Token:</label>
          <select
            id="token-selector"
            value={selectedTokenIndex}
            onChange={(e) => setSelectedTokenIndex(parseInt(e.target.value, 10))}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {tokens.map((token, index) => (
              <option key={index} value={index}>
                {token}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        The visualization below shows the embedding for the selected token, <strong>'{tokens[selectedTokenIndex]}'</strong>. An embedding is a high-dimensional vector (a list of numbers) that captures the token's meaning in the model's 'semantic space'. Each colored square represents one of the <strong>{selectedEmbedding.length}</strong> dimensions in the vector. The color intensity indicates the value, allowing you to see the unique 'fingerprint' the model has learned for this specific token.
      </p>

      <div className="flex flex-wrap gap-1 bg-gray-100 p-2 rounded-lg">
        {selectedEmbedding.map((value, i) => (
          <div
            key={i}
            className="w-4 h-4 border border-white"
            style={{ backgroundColor: colorScale(value) }}
            title={`Dimension ${i + 1}: ${value.toFixed(4)}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default EmbeddingInspector;
