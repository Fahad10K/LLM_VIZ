import React from 'react';

const MathSymbol = ({ children, className }) => (
  <span className={`font-serif italic text-lg mx-1 ${className}`}>{children}</span>
);

const Matrix = ({ name, dims, color }) => (
  <div className={`border-2 ${color} p-2 rounded-md text-center bg-opacity-20 bg-gray-700`}>
    <div className="font-bold text-lg">{name}</div>
    <div className="text-xs font-mono">({dims})</div>
  </div>
);

const Operator = ({ children }) => (
  <div className="flex items-center justify-center text-2xl font-bold text-gray-500 mx-2">{children}</div>
);

const AttentionCalculationExplained = () => {
  const explanation = `
    The attention mechanism allows the model to weigh the importance of different tokens when processing a specific token. It works by calculating a set of 'attention scores' for each token in the input. This is done using three matrices learned by the model: Query (Q), Key (K), and Value (V). These are generated from the input embeddings.
  `;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">How is Attention Calculated?</h3>
      <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{explanation.trim()}</p>
      
      <div className="bg-gray-800 text-white font-mono p-4 rounded-lg mb-4 text-center">
        <span className="font-bold">Attention(</span>
        <MathSymbol className="text-blue-300">Q</MathSymbol>,
        <MathSymbol className="text-red-300">K</MathSymbol>,
        <MathSymbol className="text-green-300">V</MathSymbol>
        <span className="font-bold">) = softmax(</span>
        <frac>
          <div className="inline-block text-center">
            <span className="border-b border-gray-400">
              <MathSymbol className="text-blue-300">Q</MathSymbol>
              <span className="font-bold"> &#183; </span>
              <MathSymbol className="text-red-300">K</MathSymbol>
              <sup>T</sup>
            </span>
            <br />
            <span>
              &#8730;(<MathSymbol>d</MathSymbol>
              <sub>k</sub>)
            </span>
          </div>
        </frac>
        <span className="font-bold">) &#183; </span>
        <MathSymbol className="text-green-300">V</MathSymbol>
      </div>

      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
        <li>
          <strong>Calculate Scores:</strong> The dot product is taken between the <strong className="text-blue-500">Query</strong> matrix and the transpose of the <strong className="text-red-500">Key</strong> matrix. This measures how much each token should 'attend' to every other token.
        </li>
        <li>
          <strong>Scale:</strong> The scores are scaled down by dividing by the square root of the dimension of the key vectors (<MathSymbol>d</MathSymbol><sub>k</sub>). This helps stabilize the gradients during training.
        </li>
        <li>
          <strong>Softmax:</strong> A softmax function is applied to the scaled scores. This turns the scores into probabilities that sum to 1, making them interpretable as attention weights.
        </li>
        <li>
          <strong>Multiply by Value:</strong> The resulting weights are multiplied by the <strong className="text-green-500">Value</strong> matrix. This gives a weighted representation of each token, emphasizing the parts of the input that are most relevant.
        </li>
      </ol>
    </div>
  );
};

export default AttentionCalculationExplained;
