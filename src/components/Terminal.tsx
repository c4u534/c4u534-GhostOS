import React, { useState, useRef, useEffect } from 'react';
import { TerminalLine } from '../core/types';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface TerminalProps {
  lines: TerminalLine[];
  onCommand: (cmd: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ lines, onCommand }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/80 font-mono text-xs border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-white/5 p-2 border-b border-white/10 flex items-center justify-between">
        <span className="text-zinc-500 uppercase tracking-widest text-[10px]">Ghost0S Development Terminal</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-amber-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {lines.map((line) => (
          <div key={line.id} className="flex space-x-2">
            <span className={line.type === 'input' ? 'text-emerald-500' : 
                            line.type === 'error' ? 'text-red-500' : 
                            line.type === 'system' ? 'text-blue-500' : 'text-zinc-300'}>
              {line.type === 'input' ? '>' : 
               line.type === 'error' ? '!' : 
               line.type === 'system' ? '#' : ' '}
            </span>
            <span className="break-all whitespace-pre-wrap">{line.content}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-2 bg-white/5 border-t border-white/10 flex items-center">
        <ChevronRight size={14} className="text-emerald-500 mr-2" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-emerald-400 placeholder-zinc-700"
          placeholder="Enter command..."
          autoFocus
        />
      </form>
    </div>
  );
};
