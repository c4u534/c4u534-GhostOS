import React from 'react';
import { motion } from 'motion/react';
import { Command, Terminal, Cpu, Shield, Zap, Layers, Activity } from 'lucide-react';

export const AgencySkills: React.FC = () => {
  const skills = [
    {
      category: "Kernel Commands",
      icon: Terminal,
      items: [
        { cmd: "help", desc: "Display available system commands." },
        { cmd: "status", desc: "Show current kernel uptime and slice count." },
        { cmd: "clear", desc: "Clear the development terminal." },
        { cmd: "reset", desc: "Re-initialize kernel state to defaults." },
        { cmd: "export", desc: "Generate a full system state ZIP archive." }
      ]
    },
    {
      category: "A2A Protocol (Agent-to-Agent)",
      icon: Activity,
      items: [
        { cmd: "a2a [agent_id]", desc: "Establish handshake and sync modalities." },
        { cmd: "share_image [id] [data]", desc: "Transfer image slice via Shadow Pattern." },
        { cmd: "sync_context", desc: "Force synchronization of active modality streams." }
      ]
    },
    {
      category: "MCP Protocol (Model Context)",
      icon: Cpu,
      items: [
        { cmd: "mcp [model_id]", desc: "Initialize model context protocol." },
        { cmd: "map_hierarchy", desc: "Re-calculate dynamic leaf-to-root tool mapping." },
        { cmd: "token_count", desc: "Display current active token window usage." }
      ]
    },
    {
      category: "Architectural Capabilities",
      icon: Shield,
      items: [
        { skill: "SPIFCS Recovery", desc: "Recover state from topographic artifacts." },
        { skill: "Vibronic Isolation", desc: "Isolate signals from environmental noise." },
        { skill: "VERM Recovery", desc: "Automated recovery from E1-E7 error classes." },
        { skill: "Modal Synthesis", desc: "Synthesize text, image, and sensor data." }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
          <Command className="text-emerald-500" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Agency Skills & Capabilities</h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Ghost0S // Agent Command Registry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="widget-container p-6 space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <section.icon className="text-emerald-500" size={20} />
              <h3 className="text-lg font-bold tracking-tight">{section.category}</h3>
            </div>
            <div className="space-y-4">
              {section.items.map((item: any, i) => (
                <div key={i} className="group p-3 rounded-xl bg-black/20 border border-white/5 hover:border-emerald-500/30 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono text-emerald-400">
                      {item.cmd ? `> ${item.cmd}` : item.skill}
                    </span>
                    <Zap size={10} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="widget-container p-8 bg-emerald-500/5 border-emerald-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-4 bg-emerald-500 rounded-2xl shadow-2xl shadow-emerald-500/20">
            <Layers className="text-black" size={48} />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold tracking-tighter">Self-Awareness Layer (SAL)</h3>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              The SAL continuously monitors these capabilities, ensuring that every command execution maintains 
              architectural coherence. Drift detection and carryover risk analysis are performed in parallel 
              with all A2A and MCP operations.
            </p>
          </div>
        </div>
        <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};
