export type ErrorClass = 'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6' | 'E7' | 'UNKNOWN';

export interface VERMResponse {
  class: ErrorClass;
  action: string;
  message: string;
  recovery: string;
}

export class VERM {
  classify(issue: { kind: string }): ErrorClass {
    const mapping: Record<string, ErrorClass> = {
      "logic": "E1",
      "software": "E2",
      "numeric": "E3",
      "hardware": "E4",
      "runtime": "E5",
      "carryover": "E6",
      "interpretation": "E7",
      "health_check": "E1",
    };
    return mapping[issue.kind] || "UNKNOWN";
  }

  respond(errorClass: ErrorClass, module?: string): VERMResponse {
    const responses: Record<ErrorClass, Omit<VERMResponse, 'class'>> = {
      "E1": {
        action: "halt_and_review_logic",
        message: "Logical inconsistency detected in state transition.",
        recovery: module === 'MCO' 
          ? "MCO Logic Breach: Re-calibrate congruent observer. Check physical plausibility thresholds in state transition logic. Verify that the 'null before certainty' rule is not being violated by premature admission." 
          : "Review seed chain and calibration parameters. Reset kernel if persistent. Inspect the logic flow for recursive loops."
      },
      "E2": {
        action: "inspect_and_reproduce_code_path",
        message: "Software execution error or unexpected module behavior.",
        recovery: module === 'MASL' 
          ? "MASL Integrity Failure: Check log integrity. Verify storage write permissions. Ensure the event buffer is not overflowing. Re-index log pointers." 
          : "Check module logs for specific tracebacks. Re-initialize affected module. Verify dependency injection chain."
      },
      "E3": {
        action: "rerun_with_numeric_controls",
        message: "Numeric instability or precision loss in vector calculation.",
        recovery: module === 'MCAT' 
          ? "MCAT Indexing Error: Clear catalog cache. Re-index topographic artifacts. Check for NaN values in vector embeddings. Verify coordinate system alignment." 
          : "Increase floating-point precision or apply normalization filters. Check for division by zero in vector normalization."
      },
      "E4": {
        action: "rerun_with_execution_constraints",
        message: "Hardware resource constraint or execution timeout.",
        recovery: module === 'SAL' 
          ? "SAL Inspection Timeout: Reduce SAL inspection frequency. Optimize self-awareness state polling. Increase the timeout threshold for boundary validation." 
          : "Optimize resource allocation. Check for memory leaks in active tools. Throttle non-critical background processes."
      },
      "E5": {
        action: "classify_as_environment_signal",
        message: "Runtime environment signal interference.",
        recovery: "Apply noise reduction filters to sensory input. Check environment stability. Re-synchronize atomic clock if jitter exceeds 5ms."
      },
      "E6": {
        action: "run_carryover_purge",
        message: "Carryover risk detected from prior slice state.",
        recovery: "Execute carryover purge protocol. Re-validate current boundary markers. Clear residue from the fast cache to prevent ghosting."
      },
      "E7": {
        action: "rollback_to_frozen_state",
        message: "Interpretation drift exceeding confidence threshold.",
        recovery: "Rollback to last known stable slice. Re-calibrate uncertainty typing. Adjust the confidence governor's sensitivity to interpretation variance."
      },
      "UNKNOWN": {
        action: "observe_only",
        message: "Unclassified anomaly detected.",
        recovery: "Monitor system metrics for further drift. Log all associated vectors. Initiate a full system diagnostic if the anomaly persists for >3 cycles."
      }
    };
    const res = responses[errorClass];
    return { class: errorClass, ...res };
  }

  processIssue(issue: { kind: string; module?: string }): VERMResponse {
    const errorClass = this.classify(issue);
    return this.respond(errorClass, issue.module);
  }
}
