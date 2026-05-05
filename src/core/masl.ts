import { EventRecord } from './types';

export class MASL {
  private records: EventRecord[] = [];

  log(type: string, payload: any = {}) {
    const record: EventRecord = {
      timestamp: Date.now(),
      type,
      payload
    };
    this.records.push(record);
    return record;
  }

  all() {
    return this.records;
  }

  byType(type: string) {
    return this.records.filter(r => r.type === type);
  }

  inspect(kernel: any) {
    const latestSlice = kernel.slice.export();
    return {
      integrity: {
        has_ref_hash: !!latestSlice.ref_hash,
        has_tools: latestSlice.tools.length > 0,
        overall: true
      },
      analysis: {
        event_total: this.records.length,
        last_event: this.records[this.records.length - 1]
      }
    };
  }
}
