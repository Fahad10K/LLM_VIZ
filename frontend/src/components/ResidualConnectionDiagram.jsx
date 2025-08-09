import React from 'react';

const ResidualConnectionDiagram = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">Residual Connections (Skip Connections)</h3>
      <p className="text-sm text-gray-600 mt-2 mb-4">
        Residual connections are a key architectural innovation. They allow the input of a layer (or block of layers) to be added directly to its output. This "shortcut" helps prevent the model's performance from degrading as it gets deeper, making it easier to train very large networks.
      </p>
      <div className="flex justify-center items-center p-4">
        <svg width="300" height="150" viewBox="0 0 300 150" className="max-w-full h-auto">
          {/* Main Path */}
          <path d="M20,75 L80,75" stroke="#4f46e5" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
          <rect x="80" y="50" width="140" height="50" rx="8" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="2" />
          <text x="150" y="80" textAnchor="middle" fill="#4338ca" fontSize="14" fontWeight="bold">Transformer Block</text>
          <path d="M220,75 L280,75" stroke="#4f46e5" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

          {/* Residual Path */}
          <path d="M50,75 C50,25 250,25 250,75" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4" fill="none" />
          
          {/* Addition Point */}
          <circle cx="250" cy="75" r="15" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
          <text x="250" y="80" textAnchor="middle" fill="#4f46e5" fontSize="20" fontWeight="bold">+</text>

          {/* Arrowhead Definition */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
            </marker>
          </defs>

          {/* Labels */}
          <text x="20" y="95" textAnchor="start" fill="#6b7280" fontSize="12">Input (X)</text>
          <text x="150" y="40" textAnchor="middle" fill="#6b7280" fontSize="12">F(X)</text>
          <text x="280" y="95" textAnchor="end" fill="#6b7280" fontSize="12">Output = F(X) + X</text>
        </svg>
      </div>
    </div>
  );
};

export default ResidualConnectionDiagram;
