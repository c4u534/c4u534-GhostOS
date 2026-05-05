import { ShadowSliceData, FastCacheData } from './types';

export class FastCache {
  public state: Partial<FastCacheData> = {};

  buildFromSlice(sliceData: ShadowSliceData) {
    this.state = {
      ref_hash: sliceData.ref_hash,
      active_object: sliceData.active_object,
      tools: sliceData.tools,
      boundary: sliceData.boundaries.length > 0 ? sliceData.boundaries[sliceData.boundaries.length - 1] : null,
      vectors: sliceData.vectors,
      signature: sliceData.signature
    };
  }

  load(): Partial<FastCacheData> {
    return this.state;
  }
}
