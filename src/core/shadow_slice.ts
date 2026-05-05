import { ShadowSliceData, ModalSignature, A2AProtocol, MCPState, ModalityDefinition } from './types';

export class ShadowSlice {
  public ref_hash: string;
  public timestamp: number;
  public active_object: string;
  public active_tools: Array<{ name: string; status: string }> = [];
  public active_rules: string[] = [];
  public boundary_markers: string[] = [];
  public tabled_findings: any[] = [];
  public tabled_tools: any[] = [];
  public open_vectors: any[] = [];
  public pattern_signature: Partial<ModalSignature> = {};
  public inherited_from?: string;
  public underlayment?: any;
  public a2a?: A2AProtocol;
  public mcp?: MCPState;
  public modalities: ModalityDefinition[] = [];

  constructor(ref_hash: string, timestamp: number, active_object: string) {
    this.ref_hash = ref_hash;
    this.timestamp = timestamp;
    this.active_object = active_object;
  }

  addTool(name: string, status: string = "ACTIVE") {
    if (!this.active_tools.find(t => t.name === name)) {
      this.active_tools.push({ name, status });
    }
  }

  addRule(rule: string) {
    if (!this.active_rules.includes(rule)) {
      this.active_rules.push(rule);
    }
  }

  addBoundary(marker: string) {
    this.boundary_markers.push(marker);
  }

  addFinding(item: any) {
    this.tabled_findings.push(item);
  }

  addTabledTool(item: any) {
    this.tabled_tools.push(item);
  }

  addVector(item: any) {
    this.open_vectors.push(item);
  }

  setSignature(sig: Partial<ModalSignature>) {
    this.pattern_signature = { ...this.pattern_signature, ...sig };
  }

  import(data: ShadowSliceData) {
    this.ref_hash = data.ref_hash;
    this.timestamp = data.timestamp;
    this.active_object = data.active_object;
    this.active_tools = data.tools;
    this.active_rules = data.rules;
    this.boundary_markers = data.boundaries;
    this.tabled_findings = data.findings;
    this.tabled_tools = data.tabled_tools;
    this.open_vectors = data.vectors;
    this.pattern_signature = data.signature;
    this.inherited_from = data.inherited_from;
    this.underlayment = data.underlayment;
    this.a2a = data.a2a;
    this.mcp = data.mcp;
    this.modalities = data.modalities || [];
  }

  export(): ShadowSliceData {
    return {
      ref_hash: this.ref_hash,
      timestamp: this.timestamp,
      active_object: this.active_object,
      tools: this.active_tools,
      rules: this.active_rules,
      boundaries: this.boundary_markers,
      findings: this.tabled_findings,
      tabled_tools: this.tabled_tools,
      vectors: this.open_vectors,
      signature: this.pattern_signature,
      inherited_from: this.inherited_from,
      underlayment: this.underlayment,
      a2a: this.a2a,
      mcp: this.mcp,
      modalities: this.modalities
    };
  }
}
