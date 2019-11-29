import { CompressionMethod } from './CompressionMethod';

export class MethodStored extends CompressionMethod {

  public decompress(): Promise<Buffer> {
    return Promise.resolve(this.data);
  }
}
