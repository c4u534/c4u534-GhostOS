import React from 'react';
import { ModuleMetrics } from '../core/types';
import { Activity, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface MiniMonitorProps {
  metric: ModuleMetrics;
}

export const MiniMonitor: React.FC<MiniMonitorProps> = ({ metric }) => {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 relative overflow-hidden group">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity size={12} className={metric.status === 'active' ? 'text-emerald-500' : 'text-zinc-500'} />
          <span className="text-[10px] font-bold font-mono text-zinc-300 uppercase tracking-tighter">{metric.name}</span>
        </div>
        <span className="text-[9px] font-mono text-emerald-500">{metric.load.toFixed(0)}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${metric.load}%` }}
          className="h-full bg-emerald-500/50" 
        />
      </div>
      <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
        <Zap size={32} />
      </div>
    </div>
  );
};
