export type StateStatus = 'C' | 'T' | '0' | 'P' | 'TABLED';

export interface ModalSignature {
  seed_chain: string;
  calibration: string;
  validation: string;
  organization: string;
  mode: string;
}

export interface A2AProtocol {
  agent_id: string;
  handshake: string;
  context_exchange: any;
  modality_sync: string[];
}

export interface MCPState {
  model_id: string;
  context_window: number;
  active_tokens: number;
  protocol_version: string;
  leaf_to_root_map: Record<string, string>;
}

export interface ModalityDefinition {
  id: string;
  name: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'sensor' | 'custom';
  schema: any;
  status: 'active' | 'inactive';
}

export type ThemeMode = 'dark' | 'light' | 'mid';

export interface ModuleConfig {
  id: string;
  sensitivity: number;
  threshold: number;
  enabled: boolean;
}

export interface AdvancedGhostMetrics {
  atomic_clock_sync: number;
  vibronic_bit_freeze: number;
  anchor_weight: number;
  bridge_weight: number;
  offset_dispersal: number;
  coherence: number;
  integrity: number;
  entropy: number;
  coherence_history: number[];
  integrity_history: number[];
  entropy_history: number[];
}

export interface ShadowSliceData {
  ref_hash: string;
  timestamp: number;
  active_object: string;
  tools: Array<{ name: string; status: string }>;
  rules: string[];
  boundaries: string[];
  findings: any[];
  tabled_tools: any[];
  vectors: any[];
  signature: Partial<ModalSignature>;
  inherited_from?: string;
  underlayment?: {
    prior_active_object?: string;
    prior_signature?: Partial<ModalSignature>;
    prior_boundaries?: string[];
  };
  a2a?: A2AProtocol;
  mcp?: MCPState;
  modalities?: ModalityDefinition[];
  advanced_metrics?: AdvancedGhostMetrics;
}

export interface FastCacheData {
  ref_hash: string;
  active_object: string;
  tools: Array<{ name: string; status: string }>;
  boundary: string | null;
  vectors: any[];
  signature: Partial<ModalSignature>;
}

export interface EventRecord {
  timestamp: number;
  type: string;
  payload: any;
  module?: string;
}

export interface SelfAwarenessState {
  active_object: string;
  active_tools: string[];
  active_rules: string[];
  current_boundary: string | null;
  pressure_proxy: number | null;
  notification_status: string;
  excitation_status: string;
  drift_status: string;
  carryover_risk: boolean;
  confidence_mode: string;
}

export interface ModuleMetrics {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  load: number;
  uptime: number;
  lastEvent?: string;
  integrity: number;
  history: number[];
  config: ModuleConfig;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  timestamp: number;
}
