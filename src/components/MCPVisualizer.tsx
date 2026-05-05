import React from 'react';
import { motion } from 'motion/react';
import { Binary, ChevronRight, Box } from 'lucide-react';

interface MCPVisualizerProps {
  map: Record<string, string>;
}

export const MCPVisualizer: React.FC<MCPVisualizerProps> = ({ map }) => {
  const nodes = Object.keys(map);
  
  // Build a tree structure for visualization
  const buildTree = () => {
    const tree: any = { name: 'root', children: [] };
    const nodeMap: Record<string, any> = { root: tree };

    nodes.forEach(node => {
      nodeMap[node] = { name: node, children: [] };
    });

    nodes.forEach(node => {
      const parent = map[node];
      if (nodeMap[parent]) {
        nodeMap[parent].children.push(nodeMap[node]);
      } else {
        tree.children.push(nodeMap[node]);
      }
    });

    return tree;
  };

  const tree = buildTree();

  const renderNode = (node: any, depth: number = 0) => (
    <div key={node.name} className="ml-4 border-l border-zinc-800 pl-4 py-1">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 group"
      >
        <div className={`p-1 rounded ${node.name === 'root' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}>
          {node.name === 'root' ? <Binary className="w-3 h-3" /> : <Box className="w-3 h-3" />}
        </div>
        <span className={`text-[10px] font-mono uppercase tracking-wider ${node.name === 'root' ? 'text-emerald-500 font-bold' : 'text-zinc-300'}`}>
          {node.name}
        </span>
        {node.children.length > 0 && <ChevronRight className="w-3 h-3 text-zinc-600" />}
      </motion.div>
      {node.children.map((child: any) => renderNode(child, depth + 1))}
    </div>
  );

  return (
    <div className="bg-zinc-950/50 border border-zinc-900 rounded-lg p-4 h-full overflow-auto">
      <div className="flex items-center gap-2 mb-4 border-b border-zinc-900 pb-2">
        <Binary className="w-4 h-4 text-emerald-500" />
        <h3 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">MCP Contextual Hierarchy</h3>
      </div>
      <div className="space-y-1">
        {renderNode(tree)}
      </div>
      {nodes.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-zinc-600">
          <Binary className="w-8 h-8 mb-2 opacity-20" />
          <span className="text-[10px] font-mono uppercase">Map Empty</span>
        </div>
      )}
    </div>
  );
};
