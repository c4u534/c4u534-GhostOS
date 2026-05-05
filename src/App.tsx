import { useState, useEffect, useCallback } from 'react';
import { auth, signInWithGoogle, db } from './lib/firebase';
import { ModalityVisualizer } from './components/ModalityVisualizer';
import { AgencySkills } from './components/AgencySkills';
import { MCPVisualizer } from './components/MCPVisualizer';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { collection, addDoc, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { Kernel } from './core/kernel';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Shield, 
  Cpu, 
  Layers, 
  RefreshCw, 
  LogOut, 
  LogIn,
  Zap,
  Box,
  Binary,
  Eye,
  Terminal as TerminalIcon,
  LayoutDashboard,
  BookOpen,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  X,
  Sun,
  Moon,
  Monitor,
  Bell,
  Command,
  Sliders,
  Settings as SettingsIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Terminal } from './components/Terminal';
import { ModuleMonitor } from './components/ModuleMonitor';
import { UserGuide } from './components/UserGuide';
import { MiniMonitor } from './components/MiniMonitor';
import { ThemeMode } from './core/types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Page = 'sim' | 'monitor' | 'terminal' | 'guide' | 'skills' | 'settings';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [kernel] = useState(() => new Kernel());
  const [logs, setLogs] = useState<any[]>([]);
  const [activePage, setActivePage] = useState<Page>('sim');
  const [signal, setSignal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [terminalLines, setTerminalLines] = useState(kernel.terminalLines);
  const [metrics, setMetrics] = useState(kernel.getModuleMetrics());
  const [advancedMetrics, setAdvancedMetrics] = useState(kernel.getAdvancedMetrics());
  const [notifications, setNotifications] = useState(kernel.getNotifications());
  const [selectedMiniMonitors, setSelectedMiniMonitors] = useState<string[]>(['MCO', 'MCAT', 'SAL']);
  const [theme, setTheme] = useState<ThemeMode>('mid');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'slices'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLogs(newLogs);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(kernel.getModuleMetrics());
      setAdvancedMetrics(kernel.getAdvancedMetrics());
      setNotifications(kernel.getNotifications());
    }, 2000);
    return () => clearInterval(interval);
  }, [kernel]);

  const handleRunCycle = async () => {
    if (!signal.trim()) return;
    setIsProcessing(true);
    
    try {
      const result = kernel.runCycle(signal);
      setTerminalLines([...kernel.terminalLines]);
      
      if (user) {
        await addDoc(collection(db, 'slices'), {
          userId: user.uid,
          timestamp: Date.now(),
          signal,
          result,
          ref_hash: kernel.slice.ref_hash,
          active_object: kernel.slice.active_object
        });
      }
      
      setSignal('');
    } catch (error) {
      console.error("Cycle error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await kernel.importSystemState(file);
    setTerminalLines([...kernel.terminalLines]);
    setMetrics(kernel.getModuleMetrics());
    e.target.value = '';
  };

  const handleCommand = useCallback((cmd: string) => {
    kernel.executeCommand(cmd);
    setTerminalLines([...kernel.terminalLines]);
  }, [kernel]);

  const handleExportLogs = (format: 'csv' | 'json') => {
    const content = format === 'csv' ? kernel.exportLogsToCSV() : JSON.stringify(kernel.masl.all(), null, 2);
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghost0s_logs_${Date.now()}.${format}`;
    a.click();
  };

  const handleExportMetrics = () => {
    const content = kernel.exportMetricsToJSON();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghost0s_metrics_${Date.now()}.json`;
    a.click();
  };

  const themeClasses = {
    dark: "bg-black text-white",
    light: "bg-zinc-50 text-zinc-900",
    mid: "bg-zinc-200 text-zinc-950"
  };

  const widgetClasses = {
    dark: "bg-zinc-900/50 border-white/10",
    light: "bg-white border-zinc-200 shadow-sm",
    mid: "bg-zinc-100 border-zinc-300 shadow-md"
  };

  const walkthroughSteps = [
    { title: "GHOST0S Architecture", content: "Welcome to Ghost0S. This is a self-coherent, constraint-bound architecture designed for SPIFCS (Shadow Pattern Image Fast Cache Slices).", target: "nav-sim" },
    { title: "00_SIM Simulator", content: "The Simulator is your primary interface for signal injection. Input raw data here to generate new state slices.", target: "sim-input" },
    { title: "Master Monitor", content: "The Master Monitor provides real-time telemetry for all active modules. You can filter which modules to monitor for specific architectural focus.", target: "nav-monitor" },
    { title: "Dev Terminal", content: "The Terminal allows direct Kernel interaction. Use it for debugging, A2A syncing, and MCP initialization.", target: "nav-terminal" },
    { title: "System Guide", content: "The Guide contains full documentation, tool definitions, and architectural rules. You can also download the complete guide from here.", target: "nav-guide" },
    { title: "Load/Save State", content: "Use the Export and Load buttons to persist your entire system state, including all cached pattern slices and logs.", target: "sim-input" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-emerald-500 font-mono">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw size={48} />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-8 p-4 bg-black text-white">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20"
          >
            <Shield size={64} className="text-emerald-500" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase">Ghost0S</h1>
          <p className="text-zinc-500 max-w-md mx-auto">
            A self-coherent, constraint-bound architecture for discovery and state preservation.
          </p>
        </div>
        <button
          onClick={signInWithGoogle}
          className="flex items-center space-x-2 px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors shadow-2xl shadow-white/10"
        >
          <LogIn size={20} />
          <span>Initialize Kernel</span>
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-screen overflow-hidden transition-colors duration-500", themeClasses[theme])}>
      {/* Sidebar Navigation */}
      <div className="flex h-full">
        <aside className={cn("w-16 md:w-64 border-r flex flex-col transition-colors", 
          theme === 'dark' ? "bg-zinc-950/50 border-white/10" : "bg-zinc-100 border-zinc-200"
        )}>
          <div className="p-4 md:p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg shrink-0">
                <Cpu size={20} className="text-black" />
              </div>
              <h1 className="hidden md:block text-lg font-bold tracking-tighter">GHOST0S</h1>
            </div>
          </div>

          <nav className="flex-1 px-2 md:px-4 space-y-2">
            {[
              { id: 'sim', icon: LayoutDashboard, label: 'Simulator', navId: 'nav-sim' },
              { id: 'monitor', icon: Activity, label: 'Master Monitor', navId: 'nav-monitor' },
              { id: 'terminal', icon: TerminalIcon, label: 'Dev Terminal', navId: 'nav-terminal' },
              { id: 'skills', icon: Command, label: 'Agency Skills', navId: 'nav-skills' },
              { id: 'settings', icon: SettingsIcon, label: 'Settings', navId: 'nav-settings' },
              { id: 'guide', icon: BookOpen, label: 'System Guide', navId: 'nav-guide' },
            ].map((item) => (
              <button
                key={item.id}
                id={item.navId}
                onClick={() => setActivePage(item.id as Page)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                  activePage === item.id 
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                    : theme === 'dark' ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/5" : "text-zinc-600 hover:text-zinc-900 hover:bg-black/5"
                )}
              >
                <item.icon size={20} />
                <span className="hidden md:block font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-around bg-black/10 p-1 rounded-xl">
              <button onClick={() => setTheme('dark')} className={cn("p-2 rounded-lg", theme === 'dark' ? "bg-emerald-500 text-black" : "text-zinc-500")}><Moon size={16} /></button>
              <button onClick={() => setTheme('mid')} className={cn("p-2 rounded-lg", theme === 'mid' ? "bg-emerald-500 text-black" : "text-zinc-500")}><Monitor size={16} /></button>
              <button onClick={() => setTheme('light')} className={cn("p-2 rounded-lg", theme === 'light' ? "bg-emerald-500 text-black" : "text-zinc-500")}><Sun size={16} /></button>
            </div>
            <button 
              onClick={() => setShowWalkthrough(true)}
              className="w-full flex items-center gap-3 p-3 text-zinc-500 hover:text-emerald-500 transition-colors"
            >
              <HelpCircle size={20} />
              <span className="hidden md:block text-sm">Walkthrough</span>
            </button>
            <div className="hidden md:block p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Uptime</span>
                <span className="text-[10px] font-mono text-emerald-500">{Math.floor((Date.now() - kernel.startTime) / 1000)}s</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: [-20, 100] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="h-full w-1/4 bg-emerald-500/50" 
                />
              </div>
            </div>
            <button
              onClick={() => signOut(auth)}
              className="w-full flex items-center gap-3 p-3 text-zinc-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden md:block text-sm">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <header className={cn("h-16 border-b flex items-center justify-between px-6 backdrop-blur-xl z-10", 
            theme === 'dark' ? "bg-zinc-950/20 border-white/10" : "bg-white/50 border-zinc-200"
          )}>
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
                {activePage} // {kernel.slice.ref_hash}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {notifications.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full animate-bounce">
                  <Bell size={12} className="text-red-500" />
                  <span className="text-[10px] font-mono text-red-500 uppercase">Alert: {notifications.length}</span>
                </div>
              )}
              
              {/* A2A Status */}
              <div className={cn(
                "flex items-center gap-2 px-3 py-1 border rounded-full transition-all",
                notifications.some(n => n.message.toLowerCase().includes('a2a'))
                  ? "text-red-500 bg-red-500/10 border-red-500/20 animate-pulse"
                  : kernel.slice.a2a 
                    ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
                    : "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"
              )}>
                <Zap size={12} className={kernel.slice.a2a || notifications.some(n => n.message.toLowerCase().includes('a2a')) ? "animate-pulse" : ""} />
                <span className="text-[10px] font-mono uppercase tracking-tighter">
                  A2A: {notifications.some(n => n.message.toLowerCase().includes('a2a')) ? "Error" : kernel.slice.a2a ? "Synced" : "Offline"}
                </span>
              </div>

              {/* MCP Status */}
              <div className={cn(
                "flex items-center gap-2 px-3 py-1 border rounded-full transition-all",
                notifications.some(n => n.message.toLowerCase().includes('mcp'))
                  ? "text-red-500 bg-red-500/10 border-red-500/20 animate-pulse"
                  : kernel.slice.mcp 
                    ? "text-blue-500 bg-blue-500/10 border-blue-500/20" 
                    : "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"
              )}>
                <Binary size={12} className={kernel.slice.mcp || notifications.some(n => n.message.toLowerCase().includes('mcp')) ? "animate-pulse" : ""} />
                <span className="text-[10px] font-mono uppercase tracking-tighter">
                  MCP: {notifications.some(n => n.message.toLowerCase().includes('mcp')) ? "Error" : kernel.slice.mcp ? "Active" : "Idle"}
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-tighter">Coherent</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={user.photoURL || ''} className="w-6 h-6 rounded-full border border-white/20" alt="Avatar" />
                <span className="hidden sm:block text-xs font-medium text-zinc-400">{user.displayName}</span>
              </div>
            </div>
          </header>

          {/* Notifications Toast */}
          <div className="absolute top-20 right-6 z-50 space-y-2">
            <AnimatePresence>
              {notifications.map(n => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="p-4 bg-red-500 text-white rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]"
                >
                  <AlertTriangle size={20} />
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase">System Alert</p>
                    <p className="text-[10px] opacity-90">{n.message}</p>
                  </div>
                  <button onClick={() => kernel.clearNotifications()} className="p-1 hover:bg-white/20 rounded"><X size={14} /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activePage === 'sim' && (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                    <div className="xl:col-span-2 space-y-6">
                      <div id="sim-input" className={cn("widget-container p-8 space-y-6 relative overflow-hidden", widgetClasses[theme])}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <Zap size={14} /> 00_SIM Input
                          </h3>
                          <span className="status-label">A2A/MCP Protocol: Active</span>
                        </div>
                        <div className="relative">
                          <textarea
                            value={signal}
                            onChange={(e) => setSignal(e.target.value)}
                            placeholder="Enter signal for vibronic isolation..."
                            className={cn("w-full h-48 border rounded-2xl p-6 font-mono focus:outline-none transition-colors resize-none text-lg",
                              theme === 'dark' ? "bg-black/50 border-white/10 text-emerald-400 focus:border-emerald-500/50" : "bg-white border-zinc-200 text-zinc-900 focus:border-emerald-500"
                            )}
                          />
                          <div className="absolute bottom-6 right-6 flex gap-3">
                            <label className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl transition-all border border-white/5 cursor-pointer" title="Load State ZIP">
                              <RefreshCw size={20} />
                              <input type="file" accept=".zip" onChange={handleImport} className="hidden" />
                            </label>
                            <button
                              onClick={() => kernel.exportSystemState()}
                              className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl transition-all border border-white/5"
                              title="Export State ZIP"
                            >
                              <Box size={20} />
                            </button>
                            <button
                              onClick={handleRunCycle}
                              disabled={isProcessing || !signal.trim()}
                              className="px-8 py-3 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-2xl shadow-emerald-500/40"
                            >
                              {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <Binary size={20} />}
                              RUN CYCLE
                            </button>
                          </div>
                        </div>
                        {/* Background glow */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
                      </div>

                      <div className={cn("widget-container p-8 space-y-6", widgetClasses[theme])}>
                        <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                          <Layers size={14} /> Underlayment History
                        </h3>
                        <div className="space-y-4">
                          {logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-zinc-700 border-2 border-dashed border-white/5 rounded-3xl">
                              <Box size={48} strokeWidth={1} />
                              <p className="font-mono text-xs mt-4">No slices detected in current underlayment</p>
                            </div>
                          ) : (
                            logs.map((log) => (
                              <div key={log.id} className={cn("p-5 rounded-2xl border transition-all group",
                                theme === 'dark' ? "bg-white/5 border-white/5 hover:border-emerald-500/30" : "bg-white border-zinc-100 hover:border-emerald-500 shadow-sm"
                              )}>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                      <Binary size={14} className="text-emerald-500" />
                                    </div>
                                    <span className="text-xs font-mono text-emerald-500/70 tracking-tighter">SLICE::{log.ref_hash}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-zinc-600">{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-zinc-400 font-mono leading-relaxed">{log.signal}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className={cn("widget-container p-8 space-y-6", widgetClasses[theme])}>
                        <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                          <Binary size={14} /> MCP Hierarchy
                        </h3>
                        <div className="h-[300px]">
                          <MCPVisualizer map={kernel.slice.mcp?.leaf_to_root_map || {}} />
                        </div>
                      </div>

                      <div className={cn("widget-container p-8 space-y-6", widgetClasses[theme])}>
                        <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                          <BookOpen size={14} /> Build Chat Log (System Underlayment)
                        </h3>
                        <div className="space-y-2 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                          {kernel.buildLog.map((log, i) => (
                            <div key={i} className="flex gap-3 p-3 bg-black/5 rounded-lg border border-black/5">
                              <span className="text-[10px] font-mono text-emerald-500 opacity-50">[{i.toString().padStart(2, '0')}]</span>
                              <span className="text-[11px] font-mono text-zinc-600">{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={cn("widget-container p-8 space-y-6", widgetClasses[theme])}>
                        <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                          <Activity size={14} /> Active Modality Streams
                        </h3>
                        <div className="h-[400px]">
                          <ModalityVisualizer modalities={kernel.slice.modalities} />
                        </div>
                      </div>
                    </div>

                      <div className="space-y-6">
                        <div className={cn("widget-container p-6 space-y-4", widgetClasses[theme])}>
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Module Monitors</h4>
                            <button 
                              onClick={() => setActivePage('monitor')}
                              className="text-[9px] font-mono text-emerald-500 hover:underline uppercase tracking-tighter"
                            >
                              Manage Monitors
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {metrics.filter(m => selectedMiniMonitors.includes(m.id)).map(m => (
                              <MiniMonitor key={m.id} metric={m} />
                            ))}
                          </div>
                        </div>
                        <div className={cn("widget-container p-6 space-y-4", widgetClasses[theme])}>
                          <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Signature</h4>
                        <div className="space-y-2">
                          {Object.entries(kernel.slice.pattern_signature).map(([k, v]) => (
                            <div key={k} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">{k.replace('_', ' ')}</span>
                              <span className="text-[10px] font-mono text-emerald-400">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={cn("widget-container p-6 space-y-4", widgetClasses[theme])}>
                        <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Health</h4>
                        <div className="space-y-4">
                          {[
                            { label: 'Coherence', val: (advancedMetrics.atomic_clock_sync * 100).toFixed(0), color: 'bg-emerald-500' },
                            { label: 'Integrity', val: (metrics.reduce((acc, m) => acc + m.integrity, 0) / metrics.length * 100).toFixed(0), color: 'bg-blue-500' },
                            { label: 'Entropy', val: (advancedMetrics.offset_dispersal * 1000).toFixed(0), color: 'bg-amber-500' }
                          ].map(s => (
                            <div key={s.label} className="space-y-1.5">
                              <div className="flex justify-between text-[10px] font-mono uppercase">
                                <span className="text-zinc-500">{s.label}</span>
                                <span className="text-zinc-400">{s.val}%</span>
                              </div>
                              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full", s.color)} style={{ width: `${s.val}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activePage === 'monitor' && (
                  <ModuleMonitor 
                    metrics={metrics} 
                    logs={kernel.masl.all()} 
                    advancedMetrics={advancedMetrics}
                    selectedMiniMonitors={selectedMiniMonitors}
                    onToggleMiniMonitor={(id) => {
                      setSelectedMiniMonitors(prev => 
                        prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
                      );
                    }}
                    onUpdateConfig={(id, config) => kernel.updateModuleConfig(id, config)}
                    onExportLogs={handleExportLogs}
                    onExportMetrics={handleExportMetrics}
                  />
                )}
                {activePage === 'terminal' && <Terminal lines={terminalLines} onCommand={handleCommand} />}
                {activePage === 'guide' && <UserGuide />}
                {activePage === 'skills' && <AgencySkills />}
                {activePage === 'settings' && (
                  <div className="max-w-4xl mx-auto space-y-8 p-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                      <h1 className="text-3xl font-mono font-bold text-zinc-100 flex items-center gap-4">
                        <Sliders className="w-8 h-8 text-emerald-500" />
                        SYSTEM SETTINGS
                      </h1>
                      <div className="text-xs font-mono text-zinc-500 uppercase">GhostOS Kernel v2.4.0-Stable</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Module Configs */}
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
                        <h2 className="text-sm font-mono font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                          <Box className="w-4 h-4" />
                          Module Configurations
                        </h2>
                        <div className="space-y-3">
                          {Object.entries(kernel.moduleConfigs).map(([name, config]) => (
                            <div key={name} className="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-900">
                              <span className="text-xs font-mono text-zinc-300">{name}</span>
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">{(config as any).enabled ? 'Active' : 'Disabled'}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* System Capabilities */}
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
                        <h2 className="text-sm font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Active Capabilities
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                          {['A2A Sync', 'MCP Mapping', 'VERM Recovery', 'Image Sharing', 'Audio Modality', 'Sensor Stream'].map(cap => (
                            <div key={cap} className="flex items-center gap-2 p-2 bg-zinc-950 rounded border border-zinc-900">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                              <span className="text-[10px] font-mono text-zinc-400">{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Full Capability List Link */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 flex items-center justify-between group cursor-pointer hover:bg-emerald-500/10 transition-all" onClick={() => setActivePage('skills')}>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-lg">
                          <Command className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-sm font-mono font-bold text-zinc-200 uppercase">View All Skills & Commands</h3>
                          <p className="text-xs font-mono text-zinc-500">Access the full documentation of agent capabilities and terminal actions.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Walkthrough Modal */}
      <AnimatePresence>
        {showWalkthrough && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowWalkthrough(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <HelpCircle className="text-emerald-500" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tighter">System Walkthrough</h3>
                    <p className="text-zinc-500 text-sm">Step {walkthroughStep + 1} of {walkthroughSteps.length}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-emerald-400">{walkthroughSteps[walkthroughStep].title}</h4>
                  <p className="text-zinc-400 leading-relaxed">{walkthroughSteps[walkthroughStep].content}</p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex gap-1">
                    {walkthroughSteps.map((_, i) => (
                      <div key={i} className={cn("h-1 w-4 rounded-full transition-all", i === walkthroughStep ? "bg-emerald-500" : "bg-white/10")} />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {walkthroughStep > 0 && (
                      <button 
                        onClick={() => setWalkthroughStep(s => s - 1)}
                        className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white"
                      >
                        Back
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (walkthroughStep < walkthroughSteps.length - 1) {
                          setWalkthroughStep(s => s + 1);
                        } else {
                          setShowWalkthrough(false);
                          setWalkthroughStep(0);
                        }
                      }}
                      className="px-6 py-2 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center gap-2"
                    >
                      {walkthroughStep === walkthroughSteps.length - 1 ? "Finish" : "Next"}
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Decorative background */}
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
