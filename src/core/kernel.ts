import { ShadowSlice } from './shadow_slice';
import { FastCache } from './fast_cache';
import { MCO } from './mco';
import { MCAT } from './mcat';
import { SAL } from './sal';
import { VERM } from './verm';
import { MASL } from './masl';
import { ShadowSliceData, ModuleMetrics, TerminalLine, ModuleConfig, AdvancedGhostMetrics } from './types';
import { 
  ResidueDetector, 
  CarryoverCheck, 
  ResimplificationEngine, 
  ConfidenceGovernor, 
  UncertaintyTyping, 
  WorkDynamics, 
  SensoryDynamics 
} from './tools';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export class Kernel {
  public slice: ShadowSlice;
  public mco: MCO;
  public mcat: MCAT;
  public sal: SAL;
  public verm: VERM;
  public masl: MASL;
  public fastCache: FastCache;
  public chain: ShadowSliceData[] = [];
  public terminalLines: TerminalLine[] = [];
  public startTime: number;
  private _moduleConfigs: Record<string, ModuleConfig> = {};
  private advancedMetrics: AdvancedGhostMetrics = {
    atomic_clock_sync: 1.0,
    vibronic_bit_freeze: 0.0,
    anchor_weight: 0.5,
    bridge_weight: 0.5,
    offset_dispersal: 0.0,
    coherence: 1.0,
    integrity: 1.0,
    entropy: 0.0,
    coherence_history: [],
    integrity_history: [],
    entropy_history: []
  };
  private notifications: any[] = [];
  private moduleHistory: Record<string, number[]> = {};

  // Tools
  public residueDetector = new ResidueDetector();
  public carryoverCheck = new CarryoverCheck();
  public resimplify = new ResimplificationEngine();
  public confidence = new ConfidenceGovernor();
  public uncertainty = new UncertaintyTyping();
  public work = new WorkDynamics();
  public sensory = new SensoryDynamics();
  public buildLog: string[] = [
    "Kernel initialization sequence started.",
    "VERM module enhanced with context-specific recovery actions.",
    "MCP leaf_to_root_map visualization component integrated.",
    "Audio modality defined and integrated into ShadowSlice.",
    "A2A synchronization dynamically handles active modalities.",
    "Image slice sharing via A2A Shadow Pattern implemented.",
    "System capabilities made modal for cross-sensory incorporation.",
    "UI default theme set to 'mid' for balanced visual density.",
    "Build chat log incorporated for system self-understanding."
  ];

  constructor(ref_hash: string = "SPIFCS-127-CORE", active_object: string = "00_SIM") {
    this.startTime = Date.now();
    this.slice = new ShadowSlice(ref_hash, Date.now(), active_object);
    this.mco = new MCO();
    this.mcat = new MCAT();
    this.sal = new SAL();
    this.verm = new VERM();
    this.masl = new MASL();
    this.fastCache = new FastCache();
    
    // Initialize with core tools
    this.slice.addTool("MCO");
    this.slice.addTool("MCAT");
    this.slice.addTool("SAL");
    this.slice.addTool("VERM");
    this.slice.addTool("MASL");
    
    // Initialize modalities
    this.slice.modalities = [
      { id: 'mod-text', name: 'Text Modality', type: 'text', status: 'active', schema: {} },
      { id: 'mod-sensor', name: 'Sensor Modality', type: 'sensor', status: 'active', schema: { type: 'thermal', range: [0, 100] } },
      { id: 'mod-audio', name: 'Audio Modality', type: 'audio', status: 'active', schema: { sample_rate: 44100, channels: 2 } }
    ];
    
    // Initialize module configs and history
    ['MCO', 'MCAT', 'SAL', 'VERM', 'MASL'].forEach(id => {
      this._moduleConfigs[id] = { id, sensitivity: 0.5, threshold: 0.8, enabled: true };
      this.moduleHistory[id] = [];
    });
    
    this.slice.addRule("null before certainty");
    this.slice.addRule("equivalence before admission");
    this.slice.addBoundary("127");
    
    this.slice.setSignature({
      seed_chain: "0>00>Δ>□>⊗>∅>↻>⟳>✧>[]",
      calibration: "LIGHT",
      validation: "MCO",
      organization: "MCAT",
      mode: "ACTIVE+TABLED"
    });

    this.masl.log("kernel_initialized", { ref_hash, active_object });
    this.addToTerminal("system", "Ghost0S Kernel Initialized. System status: COHERENT.");
  }

  addToTerminal(type: TerminalLine['type'], content: string) {
    const line: TerminalLine = {
      id: `TERM-${Date.now()}-${Math.random()}`,
      type,
      content,
      timestamp: Date.now()
    };
    this.terminalLines.push(line);
    if (this.terminalLines.length > 100) this.terminalLines.shift();
  }

  executeCommand(cmd: string) {
    this.addToTerminal("input", cmd);
    const parts = cmd.trim().split(' ');
    const action = parts[0].toLowerCase();

    switch (action) {
      case 'help':
        this.addToTerminal("output", "Available commands: help, status, clear, export, import, reset, tools, rules, a2a, mcp, modalities");
        break;
      case 'status':
        this.addToTerminal("output", `Kernel: ${this.slice.ref_hash} | Uptime: ${Math.floor((Date.now() - this.startTime) / 1000)}s | Slices: ${this.chain.length}`);
        break;
      case 'clear':
        this.terminalLines = [];
        this.addToTerminal("system", "Terminal cleared.");
        break;
      case 'tools':
        this.addToTerminal("output", `Active Tools: ${this.slice.active_tools.map(t => t.name).join(', ')}`);
        break;
      case 'rules':
        this.addToTerminal("output", `Active Rules: ${this.slice.active_rules.join(', ')}`);
        break;
      case 'export':
        this.exportSystemState();
        break;
      case 'import':
        this.addToTerminal("system", "Use the 'Load' button in the UI to import a state ZIP.");
        break;
      case 'a2a':
        if (parts[1]) {
          this.syncA2A(parts[1]);
        } else {
          this.addToTerminal("output", `A2A Status: ${this.slice.a2a ? `CONNECTED (${this.slice.a2a.agent_id})` : 'DISCONNECTED'}`);
        }
        break;
      case 'mcp':
        if (parts[1]) {
          this.initMCP(parts[1]);
        } else {
          this.addToTerminal("output", `MCP Status: ${this.slice.mcp ? `ACTIVE (${this.slice.mcp.model_id})` : 'INACTIVE'}`);
        }
        break;
      case 'modalities':
        this.addToTerminal("output", `Active Modalities: ${this.slice.modalities.map(m => m.name).join(', ') || 'None'}`);
        break;
      case 'share_image':
        if (parts[1] && parts[2]) {
          this.shareImageSlice(parts[1], parts[2]);
        } else {
          this.addToTerminal("error", "Usage: share_image [agent_id] [data]");
        }
        break;
      default:
        this.addToTerminal("error", `Unknown command: ${action}`);
    }
  }

  async exportSystemState() {
    this.addToTerminal("system", "Preparing system state export...");
    const zip = new JSZip();
    
    const state = {
      kernel: {
        ref_hash: this.slice.ref_hash,
        active_object: this.slice.active_object,
        timestamp: Date.now(),
        startTime: this.startTime
      },
      slice: this.slice.export(),
      chain: this.chain,
      catalog: this.mcat.getRecords(),
      logs: this.masl.all(),
      terminal: this.terminalLines
    };

    zip.file("system_state.json", JSON.stringify(state, null, 2));
    
    // Add slices as individual files
    const slicesFolder = zip.folder("slices");
    this.chain.forEach((s, i) => {
      slicesFolder?.file(`slice_${i}_${s.ref_hash}.json`, JSON.stringify(s, null, 2));
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `ghost0s_state_${Date.now()}.zip`);
    this.addToTerminal("output", "System state exported to ZIP.");
  }

  async importSystemState(file: File) {
    this.addToTerminal("system", "Importing system state from ZIP...");
    try {
      const zip = await JSZip.loadAsync(file);
      const stateFile = zip.file("system_state.json");
      if (!stateFile) throw new Error("Invalid state file: system_state.json not found.");
      
      const state = JSON.parse(await stateFile.async("string"));
      
      // Restore Kernel properties
      this.startTime = state.kernel.startTime;
      this.slice = new ShadowSlice(state.kernel.ref_hash, state.kernel.timestamp, state.kernel.active_object);
      this.slice.import(state.slice);
      this.chain = state.chain;
      this.terminalLines = state.terminal;
      
      this.addToTerminal("output", "System state recovered successfully.");
      this.masl.log("system_recovered", { ref_hash: this.slice.ref_hash });
    } catch (error) {
      this.addToTerminal("error", `Import failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  syncA2A(agentId: string) {
    const activeModalityTypes = this.slice.modalities
      .filter(m => m.status === 'active')
      .map(m => m.type);

    this.slice.a2a = {
      agent_id: agentId,
      handshake: "GHOST-SYNC-OK",
      context_exchange: { 
        status: "ready",
        last_sync: Date.now(),
        agent_id: agentId,
        active_modalities: activeModalityTypes
      },
      modality_sync: activeModalityTypes
    };
    this.masl.log("a2a_synced", { agentId, modality_sync: activeModalityTypes });
    this.addToTerminal("system", `A2A Protocol established with ${agentId}. Modalities synced: ${activeModalityTypes.join(', ')}`);
  }

  shareImageSlice(targetAgentId: string, imageData: string) {
    if (!this.slice.a2a) {
      this.addToTerminal("error", "A2A not established. Cannot share image slice.");
      return;
    }
    
    this.masl.log("image_slice_shared", { targetAgentId, size: imageData.length });
    this.addToTerminal("system", `Image slice shared with ${targetAgentId} via A2A Shadow Pattern.`);
    
    // Simulate transfer
    this.slice.a2a.context_exchange.last_transfer = {
      type: "image_slice",
      timestamp: Date.now(),
      target: targetAgentId,
      data_summary: imageData.substring(0, 20) + "..."
    };
  }

  initMCP(modelId: string) {
    this.slice.mcp = {
      model_id: modelId,
      context_window: 128000,
      active_tokens: 0,
      protocol_version: "1.0.0",
      leaf_to_root_map: {}
    };
    this.masl.log("mcp_initialized", { modelId });
    this.addToTerminal("system", `MCP Protocol initialized for ${modelId}`);
  }

  getAdvancedMetrics() {
    return this.advancedMetrics;
  }

  getNotifications() {
    return this.notifications;
  }

  clearNotifications() {
    this.notifications = [];
  }

  updateModuleConfig(id: string, config: Partial<ModuleConfig>) {
    if (this._moduleConfigs[id]) {
      this._moduleConfigs[id] = { ...this._moduleConfigs[id], ...config };
      this.masl.log("module_config_updated", { id, config });
    }
  }

  exportLogsToCSV() {
    const logs = this.masl.all();
    const headers = "Timestamp,Type,Payload\n";
    const rows = logs.map(l => `${new Date(l.timestamp).toISOString()},${l.type},"${JSON.stringify(l.payload).replace(/"/g, '""')}"`).join("\n");
    return headers + rows;
  }

  exportMetricsToJSON() {
    return JSON.stringify({
      modules: this.getModuleMetrics(),
      advanced: this.advancedMetrics,
      timestamp: Date.now()
    }, null, 2);
  }

  get moduleConfigs() {
    return this._moduleConfigs;
  }

  getModuleMetrics(): ModuleMetrics[] {
    const tools = this.slice.active_tools;
    return tools.map(t => {
      const id = t.name;
      const config = this.moduleConfigs[id] || { id, sensitivity: 0.5, threshold: 0.8, enabled: true };
      return {
        id,
        name: t.name,
        status: config.enabled ? 'active' : 'idle',
        load: Math.random() * 100,
        uptime: Date.now() - this.startTime,
        integrity: 0.9 + (Math.random() * 0.1),
        lastEvent: this.masl.byType('cycle_complete').pop()?.type || 'idle',
        history: this.moduleHistory[id] || [],
        config
      };
    });
  }

  runCycle(signal: any) {
    this.masl.log("cycle_start", { signal });
    this.addToTerminal("system", `Processing signal: ${signal.substring(0, 20)}...`);
    
    // Update MCP leaf_to_root_map dynamically
    if (this.slice.mcp) {
      const map: Record<string, string> = {};
      this.slice.active_tools.forEach((tool, index) => {
        const parent = index === 0 ? "root" : this.slice.active_tools[index - 1].name;
        map[tool.name] = parent;
      });
      this.slice.mcp.leaf_to_root_map = map;
    }

    // Update Advanced Metrics
    this.advancedMetrics = {
      ...this.advancedMetrics,
      atomic_clock_sync: Math.max(0, Math.min(1, this.advancedMetrics.atomic_clock_sync + (Math.random() * 0.02 - 0.01))),
      vibronic_bit_freeze: Math.random(),
      anchor_weight: Math.random(),
      bridge_weight: Math.random(),
      offset_dispersal: Math.random() * 0.1,
      coherence: 0.8 + (Math.random() * 0.2),
      integrity: 0.9 + (Math.random() * 0.1),
      entropy: Math.random() * 0.3
    };

    // Update Advanced Metrics History
    this.advancedMetrics.coherence_history.push(this.advancedMetrics.coherence);
    this.advancedMetrics.integrity_history.push(this.advancedMetrics.integrity);
    this.advancedMetrics.entropy_history.push(this.advancedMetrics.entropy);
    if (this.advancedMetrics.coherence_history.length > 20) this.advancedMetrics.coherence_history.shift();
    if (this.advancedMetrics.integrity_history.length > 20) this.advancedMetrics.integrity_history.shift();
    if (this.advancedMetrics.entropy_history.length > 20) this.advancedMetrics.entropy_history.shift();

    // Update Module History
    Object.keys(this.moduleHistory).forEach(id => {
      this.moduleHistory[id].push(Math.random() * 100);
      if (this.moduleHistory[id].length > 20) this.moduleHistory[id].shift();
    });

    // VERM Critical Check
    const vermResponse = this.processIssue('health_check', 'VERM');
    const integrity = this.advancedMetrics.integrity;
    const entropy = this.advancedMetrics.entropy;
    
    if (integrity < 0.92 || entropy > 0.25) {
      const reason = integrity < 0.92 ? "Integrity Breach" : "Entropy Overflow";
      const value = integrity < 0.92 ? (integrity * 100).toFixed(2) + "%" : (entropy * 100).toFixed(2) + "%";
      const errorMsg = `CRITICAL: ${vermResponse.message} (${value})`;
      
      // Only push if not already notified recently
      if (!this.notifications.some(n => n.message.includes(reason))) {
        this.notifications.push({
          id: `NOTIF-${Date.now()}`,
          type: 'error',
          message: errorMsg,
          recovery: vermResponse.recovery,
          timestamp: Date.now()
        });
        this.addToTerminal("error", errorMsg);
        this.addToTerminal("system", `Recovery Action: ${vermResponse.recovery}`);
      }
    }

    const sensoryData = this.sensory.map(signal);
    const validated = this.mco.validate(signal);
    const residue = this.residueDetector.detect(validated);
    const carryover = this.carryoverCheck.detect(validated, this.chain[this.chain.length - 1]);
    
    const selfState = this.sal.inspect(
      this.slice.active_object,
      this.slice.active_tools.map(t => t.name),
      this.slice.active_rules,
      this.slice.boundary_markers
    );

    this.slice.addVector({ validated, residue, carryover, selfState, sensoryData });
    this.mcat.register("cycle_event", { signal, validated, selfState });
    
    this.masl.log("cycle_complete", { validated });
    this.addToTerminal("output", `Cycle complete. Congruence: ${validated.congruence.toFixed(2)}`);
    return validated;
  }

  commitSlice() {
    const data = this.slice.export();
    this.chain.push(data);
    this.masl.log("slice_committed", { ref_hash: data.ref_hash });
    return data;
  }

  buildCache() {
    this.fastCache.buildFromSlice(this.slice.export());
    this.masl.log("cache_built");
    return this.fastCache.load();
  }

  processIssue(kind: string, module?: string) {
    const result = this.verm.processIssue({ kind, module });
    this.masl.log("issue_processed", result);
    return result;
  }

  reset() {
    const ref = this.slice.ref_hash;
    const obj = this.slice.active_object;
    this.slice = new ShadowSlice(ref, Date.now(), obj);
    this.masl.log("kernel_reset");
    this.addToTerminal("system", "Kernel reset initiated.");
    
    this.slice.addTool("MCO");
    this.slice.addTool("MCAT");
    this.slice.addTool("SAL");
    this.slice.addTool("VERM");
    this.slice.addTool("MASL");
  }
}
