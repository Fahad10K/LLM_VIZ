import React from 'react';

const TopKTokenProbabilities = ({ topK }) => {
  if (!topK || topK.length === 0) return null;

  return (
    <div className="space-y-2">
      {topK.map(([token, prob], i) => (
        <div key={i} className="flex items-center">
          <span className="w-24 font-mono text-sm text-gray-700 truncate">'{token}'</span>
          <div className="flex-1 bg-gray-200 rounded-full h-5">
            <div 
              className="bg-blue-500 h-5 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none"
              style={{ width: `${prob * 100}%` }}
            >
              {(prob * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopKTokenProbabilities;
