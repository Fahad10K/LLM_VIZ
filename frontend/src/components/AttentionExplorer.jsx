import React, { useState } from 'react';
import { scaleSequential } from 'd3-scale';
import { interpolateInferno } from 'd3-scale-chromatic';

// A single cell in the heatmap
const HeatmapCell = ({ value, color }) => (
  <div
    className="w-6 h-6 border-r border-b border-gray-200"
    style={{ backgroundColor: color }}
    title={`Attention: ${value.toFixed(4)}`}
  ></div>
);

// The main attention explorer component
const AttentionExplorer = ({ tokens, attentionHeads }) => {
  const [selectedHead, setSelectedHead] = useState(0);

  if (!attentionHeads || attentionHeads.length === 0) {
    return <p className="text-sm text-gray-500">Attention data not available.</p>;
  }

  const numHeads = attentionHeads.length;
  const attentionForSelectedHead = attentionHeads[selectedHead];

  // Create a color scale for the heatmap
  const colorScale = scaleSequential(interpolateInferno).domain([0, 1]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Multi-Head Attention Explorer</h3>
        <div className="flex items-center space-x-2">
          <label htmlFor="head-selector" className="text-sm font-medium text-gray-700">Select Head:</label>
          <select
            id="head-selector"
            value={selectedHead}
            onChange={(e) => setSelectedHead(parseInt(e.target.value, 10))}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {[...Array(numHeads).keys()].map(headIndex => (
              <option key={headIndex} value={headIndex}>
                Head {headIndex + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        This visualization shows the attention scores from one of the {numHeads} attention heads in the final transformer layer. Each head learns to focus on different relationships between tokens.
      </p>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="flex">
            {/* Top Header Tokens */}
            <div className="w-24 flex-shrink-0"></div> {/* Corner spacer */}
            <div className="flex">
              {tokens.map((token, i) => (
                <div key={`top-header-${i}`} className="w-6 text-center text-xs font-mono transform -rotate-45">
                  <span className="inline-block py-1">{token}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            {/* Side Header Tokens */}
            <div className="w-24 flex-shrink-0">
              {tokens.map((token, i) => (
                <div key={`side-header-${i}`} className="h-6 flex items-center justify-end pr-2 text-xs font-mono">
                  {token}
                </div>
              ))}
            </div>
            {/* Heatmap Grid */}
            <div className="flex flex-col">
              {attentionForSelectedHead.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((value, colIndex) => (
                    <HeatmapCell key={colIndex} value={value} color={colorScale(value)} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttentionExplorer;
