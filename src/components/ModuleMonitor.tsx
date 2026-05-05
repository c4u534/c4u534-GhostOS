import React, { useState, useMemo } from 'react';
import { ModuleMetrics, EventRecord, AdvancedGhostMetrics, ModuleConfig } from '../core/types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Shield, Zap, Clock, AlertTriangle, CheckCircle2, Circle, 
  Filter, Download, Settings, Sliders, Database, Cpu, Network, Globe 
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';

interface ModuleMonitorProps {
  metrics: ModuleMetrics[];
  logs: EventRecord[];
  advancedMetrics: AdvancedGhostMetrics;
  selectedMiniMonitors: string[];
  onToggleMiniMonitor: (id: string) => void;
  onUpdateConfig: (id: string, config: Partial<ModuleConfig>) => void;
  onExportLogs: (format: 'csv' | 'json') => void;
  onExportMetrics: () => void;
}

export const ModuleMonitor: React.FC<ModuleMonitorProps> = ({ 
  metrics, 
  logs, 
  advancedMetrics,
  selectedMiniMonitors, 
  onToggleMiniMonitor,
  onUpdateConfig,
  onExportLogs,
  onExportMetrics
}) => {
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(metrics.map(m => m.id));
  const [logFilterType, setLogFilterType] = useState<string>('all');
  const [logTimeRange, setLogTimeRange] = useState<number>(3600000); // Default 1 hour
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    setSelectedModuleIds(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const logTypes = useMemo(() => {
    const types = new Set(logs.map(l => l.type));
    return ['all', ...Array.from(types)];
  }, [logs]);

  const filteredMetrics = metrics.filter(m => selectedModuleIds.includes(m.id));
  
  const filteredLogs = useMemo(() => {
    const now = Date.now();
    return logs.filter(l => {
      const matchesModule = !l.module || selectedModuleIds.includes(l.module);
      const matchesType = logFilterType === 'all' || l.type === logFilterType;
      const matchesTime = (now - l.timestamp) <= logTimeRange;
      return matchesModule && matchesType && matchesTime;
    });
  }, [logs, selectedModuleIds, logFilterType, logTimeRange]);

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { label: 'Coherence', value: advancedMetrics.coherence, icon: Activity, color: '#06b6d4', history: advancedMetrics.coherence_history, desc: 'System-wide state alignment' },
          { label: 'Integrity', value: advancedMetrics.integrity, icon: Shield, color: '#6366f1', history: advancedMetrics.integrity_history, desc: 'Constraint boundary stability' },
          { label: 'Entropy', value: advancedMetrics.entropy, icon: Zap, color: '#f97316', history: advancedMetrics.entropy_history, desc: 'Information decay rate' },
        ].map((stat, i) => (
          <div key={i} className="widget-container p-6 space-y-4 relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <stat.icon size={20} style={{ color: stat.color }} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{stat.label}</h3>
                  <p className="text-[10px] text-zinc-500 font-mono">{stat.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono font-bold text-zinc-100">{(stat.value * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="h-24 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stat.history.map((v, i) => ({ v, i }))}>
                  <defs>
                    <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={stat.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={stat.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                    itemStyle={{ color: stat.color }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="v" 
                    stroke={stat.color} 
                    strokeWidth={3} 
                    dot={false} 
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-20" style={{ backgroundColor: stat.color }} />
          </div>
        ))}
      </div>

      {/* Advanced Ghost0S Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Atomic Sync', value: advancedMetrics.atomic_clock_sync, icon: Clock, color: 'text-blue-500' },
          { label: 'Bit Freeze', value: advancedMetrics.vibronic_bit_freeze, icon: Cpu, color: 'text-emerald-500' },
          { label: 'Anchor Wt', value: advancedMetrics.anchor_weight, icon: Database, color: 'text-amber-500' },
          { label: 'Bridge Wt', value: advancedMetrics.bridge_weight, icon: Network, color: 'text-purple-500' },
          { label: 'Offset Disp', value: advancedMetrics.offset_dispersal, icon: Globe, color: 'text-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="widget-container p-4 flex flex-col items-center justify-center space-y-2 group hover:border-white/20 transition-all">
            <stat.icon size={18} className={`${stat.color} transition-transform group-hover:scale-110`} />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest text-center">{stat.label}</span>
            <span className="text-sm font-mono font-bold text-zinc-200">{(stat.value * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {/* Module Selection & Export Bar */}
      <div className="widget-container p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mr-2">Module Filter:</span>
          {metrics.map(m => (
            <button
              key={m.id}
              onClick={() => toggleModule(m.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 ${
                selectedModuleIds.includes(m.id)
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
              }`}
            >
              {selectedModuleIds.includes(m.id) ? <CheckCircle2 size={12} /> : <Circle size={12} />}
              <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">{m.name}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onExportLogs('csv')} className="btn-secondary flex items-center gap-2 text-[10px]">
            <Download size={12} /> LOGS (CSV)
          </button>
          <button onClick={() => onExportLogs('json')} className="btn-secondary flex items-center gap-2 text-[10px]">
            <Download size={12} /> LOGS (JSON)
          </button>
          <button onClick={onExportMetrics} className="btn-secondary flex items-center gap-2 text-[10px]">
            <Download size={12} /> METRICS (JSON)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredMetrics.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="widget-container p-4 space-y-4 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Activity size={16} className={m.status === 'active' ? 'text-emerald-500' : 'text-zinc-500'} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-tight">{m.name}</h4>
                    <p className="text-[10px] font-mono text-zinc-500">ID: {m.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingModuleId(editingModuleId === m.id ? null : m.id)}
                    className={`p-1.5 rounded border transition-colors ${
                      editingModuleId === m.id ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                    }`}
                  >
                    <Settings size={14} />
                  </button>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full h-fit ${
                    m.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {m.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {editingModuleId === m.id ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Sensitivity</span>
                    <input 
                      type="range" min="0" max="1" step="0.1" 
                      value={m.config.sensitivity} 
                      onChange={(e) => onUpdateConfig(m.id, { sensitivity: parseFloat(e.target.value) })}
                      className="w-24 accent-emerald-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Threshold</span>
                    <input 
                      type="range" min="0" max="1" step="0.05" 
                      value={m.config.threshold} 
                      onChange={(e) => onUpdateConfig(m.id, { threshold: parseFloat(e.target.value) })}
                      className="w-24 accent-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Status</span>
                    <button 
                      onClick={() => onUpdateConfig(m.id, { enabled: !m.config.enabled })}
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                        m.config.enabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
                      }`}
                    >
                      {m.config.enabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={m.history.map((v, i) => ({ v, i }))}>
                        <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                        <YAxis hide domain={[0, 100]} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-500">LOAD</span>
                        <span className="text-[10px] font-mono text-emerald-500">{m.load.toFixed(1)}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${m.load}%` }} className="h-full bg-emerald-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-500">INTEGRITY</span>
                        <span className="text-[10px] font-mono text-blue-500">{(m.integrity * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${m.integrity * 100}%` }} className="h-full bg-blue-500" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-500">
                  <Clock size={10} /> {Math.floor(m.uptime / 1000)}s
                </div>
                <button 
                  onClick={() => onToggleMiniMonitor(m.id)}
                  className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors ${
                    selectedMiniMonitors.includes(m.id)
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                      : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                  }`}
                >
                  {selectedMiniMonitors.includes(m.id) ? 'MINI-MON: ON' : 'MINI-MON: OFF'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="widget-container p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 gap-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Activity size={14} /> Global Monitor Logs
          </h3>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
              <Filter size={12} className="text-zinc-500" />
              <select 
                value={logFilterType} 
                onChange={(e) => setLogFilterType(e.target.value)}
                className="bg-transparent text-[10px] font-mono text-zinc-300 outline-none"
              >
                {logTypes.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
              <Clock size={12} className="text-zinc-500" />
              <select 
                value={logTimeRange} 
                onChange={(e) => setLogTimeRange(parseInt(e.target.value))}
                className="bg-transparent text-[10px] font-mono text-zinc-300 outline-none"
              >
                <option value={300000}>5 MIN</option>
                <option value={1800000}>30 MIN</option>
                <option value={3600000}>1 HOUR</option>
                <option value={86400000}>24 HOURS</option>
              </select>
            </div>
            <span className="status-label">Events: {filteredLogs.length}</span>
          </div>
        </div>
        
        <div className="h-96 overflow-y-auto custom-scrollbar space-y-2 pr-2">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-700">
              <AlertTriangle size={32} strokeWidth={1} />
              <p className="text-xs font-mono mt-2 uppercase tracking-tighter">No active telemetry detected</p>
            </div>
          ) : (
            filteredLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-colors">
                <div className={`mt-1 p-1.5 rounded border ${
                  log.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                }`}>
                  <Zap size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold font-mono uppercase tracking-tighter ${
                      log.type === 'error' ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      {log.type} {log.module ? `[${log.module}]` : ''}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-[10px] font-mono text-zinc-400 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
