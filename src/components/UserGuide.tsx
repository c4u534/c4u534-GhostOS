import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Download, Shield, Cpu, Layers, Zap, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const guideContent = `
# Ghost0S User Guide & Architecture Specification

## 1. Introduction
Ghost0S is a self-coherent, constraint-bound architecture designed for high-fidelity discovery and state preservation. It utilizes the SPIFCS (Shadow Pattern Image Fast Cache Slices) system to ensure continuity across context boundaries.

## 2. Core Architectural Features
### 2.1. Kernel Orchestrator
The central processing unit of the Ghost0S. It manages the flow from sensory input to validated state, coordinating all modular tools.

### 2.2. SPIFCS (Shadow Pattern Image Fast Cache Slices)
A context-preservation method that converts live sessions into flattened but recoverable topographic artifacts.
- **Shadow Slice**: A structural snapshot of the system.
- **Fast Cache**: Immediate structural re-entry without full parsing.

### 2.4. VERM (Validation & Error Response)
Classifies and routes deviations (E1–E7) with specific recovery actions.
- **E1 Logic**: Halt and review logic.
- **E2 Software**: Inspect and reproduce code path.
- **E3 Numeric**: Rerun with numeric controls.
- **E4 Hardware**: Rerun with execution constraints.
- **E5 Runtime**: Classify as environment signal.
- **E6 Carryover**: Run carryover purge.
- **E7 Interpretation**: Rollback to frozen state.

## 3. Modular Toolset
- **Residue Detector**: Extracts invariants across transformations.
- **Carryover Check**: Filters residual influence from prior states.
- **SAL (Self-Awareness Layer)**: Monitors system state, drift risk, and boundary events.
- **Sensory Dynamics**: Maps raw signals to modality-specific vectors.

## 4. Advanced Protocols
### 4.1. A2A (Agent-to-Agent)
Enables cross-agent synchronization and context exchange. Handshake protocols ensure that modality sync is maintained across distributed kernels.
- **Command**: \`a2a [agent_id]\` to initiate sync.
- **Feature**: Image Slice Transfer via Shadow Pattern sharing.

### 4.2. MCP (Model Context Protocol)
A standardized interface for model context sharing. It maps leaf-to-root interconnections, allowing models to navigate complex state hierarchies efficiently.
- **Command**: \`mcp [model_id]\` to initialize protocol.
- **Dynamic Mapping**: Automatically populates \`leaf_to_root_map\` based on active tool hierarchy.

## 5. Modalities
Ghost0S supports multiple data streams:
- **Text**: Linguistic vector processing.
- **Image**: Visual pattern recognition and slice sharing.
- **Audio**: Vibronic frequency analysis.
- **Video**: Temporal sequence mapping.
- **Sensor**: Thermal flux and vibronic stability monitoring.
1. **Initialize**: Sign in with Google to ground your identity in the underlayment.
2. **Input Signal**: Enter raw data into the 00_SIM input field.
3. **Run Cycle**: Execute the process to generate a new state slice.
4. **Monitor**: Use the Master Module Monitor to track real-time metrics and logs.
5. **Terminal**: Use the development terminal for advanced system commands.
6. **Export/Load**: Save your entire system state as a ZIP file for later recovery using the Export and Load buttons.

## 6. Expandability & Connectivity
Ghost0S is built for modularity. New tools can be registered via the MCAT (Meta Catalogger) and integrated into the Kernel's cycle. The architecture supports full modalities, including text, image, audio, video, and custom sensor data.
`;

export const UserGuide: React.FC = () => {
  const handleDownload = () => {
    const blob = new Blob([guideContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ghost0s_user_guide.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <BookOpen className="text-blue-500" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">System Documentation</h1>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Ghost0S v1.1.0 // Specification</p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all text-sm shadow-xl shadow-white/5"
        >
          <Download size={16} />
          DOWNLOAD GUIDE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 widget-container p-8 prose prose-invert prose-emerald max-w-none">
          <ReactMarkdown>{guideContent}</ReactMarkdown>
        </div>
        
        <div className="space-y-6">
          <div className="widget-container p-6 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Info size={14} /> Quick Start
            </h3>
            <div className="space-y-4">
              {[
                { icon: Shield, title: "Identity", desc: "Ground your session with Google Auth." },
                { icon: Cpu, title: "Kernel", desc: "Run cycles to process signals." },
                { icon: Layers, title: "Slices", desc: "Track state in the underlayment." },
                { icon: Zap, title: "Monitor", desc: "Watch real-time system health." }
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1 p-1.5 bg-white/5 rounded border border-white/5">
                    <item.icon size={12} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase text-zinc-300">{item.title}</h4>
                    <p className="text-[10px] text-zinc-500 leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="widget-container p-6 bg-blue-500/5 border-blue-500/20">
            <h4 className="text-xs font-bold uppercase tracking-tighter mb-2 text-blue-400">Expansion Protocol</h4>
            <p className="text-[10px] font-mono text-zinc-400 leading-relaxed">
              Ghost0S supports dynamic tool registration. Developers can extend the kernel by implementing the 
              Tool interface and registering via the Terminal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
