import React from 'react';
import { scaleSqrt } from 'd3-scale';

// Helper function to calculate cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  return dotProduct / (magnitudeA * magnitudeB);
};

const SemanticSimilarityPlot = ({ tokens, embeddings }) => {
  if (!tokens || !embeddings || tokens.length === 0 || embeddings.length === 0) {
    return <p className="text-sm text-gray-500">Semantic similarity data not available.</p>;
  }

  const similarityMatrix = embeddings.map(vecA =>
    embeddings.map(vecB => cosineSimilarity(vecA, vecB))
  );

  const sizeScale = scaleSqrt().domain([0, 1]).range([0, 10]); // radius of the dots

  const explanation = `
    This plot shows the semantic similarity between each pair of tokens in your input. Similarity is measured using the cosine distance between their embedding vectors. A larger dot indicates that the model considers the two words to be more closely related in meaning. This helps visualize how the model understands the relationships between words in context.
  `;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Semantic Similarity (Dot Product)</h3>
      <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{explanation.trim()}</p>
      <div className="overflow-x-auto">
        <svg width={tokens.length * 60 + 60} height={tokens.length * 60 + 50}>
          <g transform="translate(50, 40)">
            {/* Y-axis labels */}
            {tokens.map((token, i) => (
              <text key={`y-label-${i}`} x="-10" y={i * 50 + 25} textAnchor="end" dy=".35em" className="text-xs font-mono">
                {token}
              </text>
            ))}
            {/* X-axis labels */}
            {tokens.map((token, i) => (
              <text key={`x-label-${i}`} x={i * 50 + 25} y="-10" textAnchor="middle" className="text-xs font-mono">
                {token}
              </text>
            ))}
            {/* Dots */}
            {similarityMatrix.map((row, i) =>
              row.map((similarity, j) => (
                <circle
                  key={`${i}-${j}`}
                  cx={j * 50 + 25}
                  cy={i * 50 + 25}
                  r={sizeScale(Math.max(0, similarity))} // Ensure radius is non-negative
                  className="fill-current text-blue-500"
                  opacity={Math.max(0, similarity)}
                >
                  <title>{`Similarity('${tokens[i]}', '${tokens[j]}'): ${similarity.toFixed(4)}`}</title>
                </circle>
              ))
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default SemanticSimilarityPlot;
