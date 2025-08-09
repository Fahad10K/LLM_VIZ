import React from 'react';
import ReactFlow, { Background, Controls, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeStyles = {
  base: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '600',
    minWidth: '120px',
    textAlign: 'center',
  },
  input: { borderColor: '#f87171', background: '#fecaca' },
  transformer: { borderColor: '#c084fc', background: '#d8b4fe', height: '100%' },
  output: { borderColor: '#34d399', background: '#a7f3d0' },
};

const TokenNode = ({ data }) => (
  <div style={{ ...nodeStyles.base, ...nodeStyles.input }}>
    <Handle type="target" position={Position.Left} />
    {data.label}
    <Handle type="source" position={Position.Right} />
  </div>
);

const TransformerNode = ({ data }) => (
  <div style={{ ...nodeStyles.base, ...nodeStyles.transformer }}>
    <Handle type="target" position={Position.Top} id="a" />
    <Handle type="target" position={Position.Left} id="b" />
    {data.label}
    <Handle type="source" position={Position.Right} id="c" />
    <Handle type="source" position={Position.Bottom} id="d" />
  </div>
);

const OutputNode = ({ data }) => (
  <div style={{ ...nodeStyles.base, ...nodeStyles.output }}>
    <Handle type="target" position={Position.Left} />
    <div><strong>Token:</strong> '{data.label}'</div>
    <div className="text-xs font-normal"><strong>Prob:</strong> {(data.prob * 100).toFixed(1)}%</div>
    <Handle type="source" position={Position.Right} />
  </div>
);

const nodeTypes = {
  token: TokenNode,
  transformer: TransformerNode,
  output: OutputNode,
};

const LLMProcessFlow = ({ data }) => {
  if (!data || !data.input_tokens || !data.generation_steps) {
    return null;
  }

  const { input_tokens, generation_steps } = data;
  const nodes = [];
  const edges = [];

  // 1. Input Tokens
  input_tokens.forEach((token, i) => {
    nodes.push({
      id: `in-${i}`,
      type: 'token',
      data: { label: token },
      position: { x: 0, y: i * 50 },
    });
  });

  // 2. Transformer Node
  const transformerY = (input_tokens.length - 1) * 50 / 2;
  nodes.push({
    id: 'transformer',
    type: 'transformer',
    data: { label: 'Transformer' },
    position: { x: 250, y: transformerY },
  });

  // Edges from input to transformer
  input_tokens.forEach((_, i) => {
    edges.push({ id: `ein-${i}`, source: `in-${i}`, target: 'transformer', targetHandle: 'b', animated: true });
  });

  // 3. Generation Steps
  let lastNodeId = 'transformer';
  generation_steps.forEach((step, i) => {
    const nodeId = `gen-${i}`;
    nodes.push({
      id: nodeId,
      type: 'output',
      data: { label: step.token, prob: step.prob },
      position: { x: 500 + i * 250, y: transformerY },
    });
    edges.push({ id: `egen-${i}`, source: lastNodeId, target: nodeId, sourceHandle: 'c', animated: true });
    lastNodeId = nodeId;
  });

  // 4. Continuation Node
  nodes.push({
    id: 'continue',
    data: { label: '...' },
    position: { x: 500 + generation_steps.length * 250, y: transformerY },
    style: { ...nodeStyles.base, padding: '10px 20px' },
  });
  edges.push({ id: 'e-continue', source: lastNodeId, target: 'continue', animated: true });

  return (
    <div style={{ height: '400px' }} className="bg-gray-50 rounded-lg border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Controls showInteractive={false} />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default LLMProcessFlow;
