import React from 'react';
import { ModalityDefinition } from '../core/types';
import { Eye, Type, Music, Video, Cpu, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface ModalityVisualizerProps {
  modalities: ModalityDefinition[];
}

export const ModalityVisualizer: React.FC<ModalityVisualizerProps> = ({ modalities }) => {
  const activeModalities = modalities.filter(m => m.status === 'active');

  if (activeModalities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 opacity-50">
        <Activity className="w-12 h-12 mb-2" />
        <p className="text-sm font-mono uppercase tracking-widest">No Active Modalities</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto p-4">
      {activeModalities.map((mod) => (
        <motion.div
          key={mod.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              {mod.type === 'text' && <Type className="w-4 h-4 text-blue-400" />}
              {mod.type === 'image' && <Eye className="w-4 h-4 text-emerald-400" />}
              {mod.type === 'audio' && <Music className="w-4 h-4 text-purple-400" />}
              {mod.type === 'video' && <Video className="w-4 h-4 text-red-400" />}
              {mod.type === 'sensor' && <Cpu className="w-4 h-4 text-amber-400" />}
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase">{mod.name}</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
              {mod.status}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center bg-black/30 rounded border border-zinc-800/50 min-h-[120px]">
            {mod.type === 'text' && (
              <div className="p-4 text-zinc-400 font-mono text-xs leading-relaxed italic">
                "System processing linguistic vectors... Seed chain alignment in progress."
              </div>
            )}
            {mod.type === 'image' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                <img 
                  src="https://picsum.photos/seed/ghostos/400/300" 
                  alt="Modality Visual" 
                  className="max-w-[80%] max-h-[80%] rounded shadow-2xl border border-zinc-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            {mod.type === 'sensor' && (
              <div className="w-full p-4 flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
                  <span>Thermal Flux</span>
                  <span>{Math.floor(Math.random() * 100)}%</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-amber-500"
                    animate={{ width: `${Math.floor(Math.random() * 100)}%` }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase mt-2">
                  <span>Vibronic Stability</span>
                  <span>{Math.floor(Math.random() * 100)}%</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    animate={{ width: `${Math.floor(Math.random() * 100)}%` }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                  />
                </div>
              </div>
            )}
            {mod.type === 'audio' && (
              <div className="flex gap-1 items-end h-12">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-purple-500 rounded-full"
                    animate={{ height: [10, 40, 15, 30, 10] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            )}
            {mod.type === 'video' && (
              <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent" />
                <div className="text-[10px] font-mono text-red-500 animate-pulse">LIVE STREAMING...</div>
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-zinc-500 flex flex-col gap-1">
            <div className="flex justify-between">
              <span>Schema ID:</span>
              <span className="text-zinc-400">{mod.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="text-zinc-400 uppercase">{mod.type}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
