import React from 'react';
import { PCA } from 'ml-pca';

const EmbeddingsPlot = ({ tokens, embeddings }) => {
  if (!embeddings || embeddings.length === 0) return null;

  let reducedEmbeddings;
  try {
    const pca = new PCA(embeddings);
    reducedEmbeddings = pca.predict(embeddings, { nComponents: 2 }).to2DArray();
  } catch (error) {
    console.error("PCA failed:", error);
    return <p className="text-red-500">Could not compute PCA for embeddings.</p>;
  }

  const xMin = Math.min(...reducedEmbeddings.map(e => e[0]));
  const xMax = Math.max(...reducedEmbeddings.map(e => e[0]));
  const yMin = Math.min(...reducedEmbeddings.map(e => e[1]));
  const yMax = Math.max(...reducedEmbeddings.map(e => e[1]));

  const scaleX = (val) => (xMax === xMin) ? 50 : (val - xMin) / (xMax - xMin) * 100;
  const scaleY = (val) => (yMax === yMin) ? 50 : (val - yMin) / (yMax - yMin) * 100;

  return (
    <div className="relative w-full h-64 bg-gray-50 rounded-lg border border-gray-200">
      {reducedEmbeddings.map((pos, i) => (
        <div 
          key={i} 
          className="absolute w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 group"
          style={{ left: `${scaleX(pos[0])}%`, top: `${scaleY(pos[1])}%` }}
        >
          <span className="absolute bottom-full mb-2 w-max px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            {tokens[i]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default EmbeddingsPlot;
