import React from 'react';

const TokenizationDisplay = ({ tokens }) => {
  if (!tokens || tokens.length === 0) {
    return <p className="text-sm text-gray-500">No token data available.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token, index) => (
        <div key={index} className="bg-blue-100 text-blue-800 font-mono text-sm px-2 py-1 rounded-md border border-blue-200">
          {token}
        </div>
      ))}
    </div>
  );
};

export default TokenizationDisplay;
