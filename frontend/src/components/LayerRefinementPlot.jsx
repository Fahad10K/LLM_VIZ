import React, { useState } from 'react';
import { PCA } from 'ml-pca';

const LayerRefinementPlot = ({ tokens, allLayerEmbeddings }) => {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);

  if (!allLayerEmbeddings || allLayerEmbeddings.length === 0) {
    return <p className="text-sm text-gray-500">Layer-wise embedding data not available.</p>;
  }

  // Get the embedding for the selected token across all layers
  const tokenJourney = allLayerEmbeddings.map(layerEmbeddings => layerEmbeddings[selectedTokenIndex]);

  // Use PCA to reduce the dimensionality of the token's journey to 2D
  let reducedJourney;
  try {
    const pca = new PCA(tokenJourney);
    reducedJourney = pca.predict(tokenJourney, { nComponents: 2 }).to2DArray();
  } catch (error) {
    console.error("PCA failed for layer refinement plot:", error);
    return <p className="text-red-500">Could not compute PCA for the plot.</p>;
  }

  const xMin = Math.min(...reducedJourney.map(p => p[0]));
  const xMax = Math.max(...reducedJourney.map(p => p[0]));
  const yMin = Math.min(...reducedJourney.map(p => p[1]));
  const yMax = Math.max(...reducedJourney.map(p => p[1]));

  const scaleX = (val) => (xMax === xMin) ? 50 : (val - xMin) / (xMax - xMin) * 100;
  const scaleY = (val) => (yMax === yMin) ? 50 : (val - yMin) / (yMax - yMin) * 100;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Layer-by-Layer Embedding Refinement</h3>
        <div className="flex items-center space-x-2">
          <label htmlFor="token-journey-selector" className="text-sm font-medium text-gray-700">Select Token:</label>
          <select
            id="token-journey-selector"
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
        This plot shows how the meaning (embedding) of the token '{tokens[selectedTokenIndex]}' is refined as it passes through each of the {allLayerEmbeddings.length} transformer layers.
      </p>

      <div className="relative w-full h-72 bg-gray-50 rounded-lg border border-gray-200">
        {/* Path connecting the points */}
        <svg className="absolute top-0 left-0 w-full h-full" style={{ overflow: 'visible' }}>
          <polyline
            points={reducedJourney.map(p => `${scaleX(p[0])}%,${scaleY(p[1])}%`).join(' ')}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray="4"
          />
        </svg>

        {/* Points for each layer */}
        {reducedJourney.map((pos, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${scaleX(pos[0])}%`, top: `${scaleY(pos[1])}%`, opacity: (i + 1) / reducedJourney.length }}
            title={`Layer ${i}`}
          >
            <span className="absolute bottom-full mb-2 w-max px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              Layer {i}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerRefinementPlot;
