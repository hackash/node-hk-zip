import zlb from 'zlib';

import { CompressionMethod } from './CompressionMethod';

export class MethodInflate extends CompressionMethod {

  public decompress(): Promise<Buffer> {
    const inflate = zlb.createInflateRaw();
    return new Promise((resolve, reject) => {
      inflate.on('data', (data) => {
        resolve(data);
      });

      inflate.on('error', (e) => {
        reject(e);
      });

      inflate.end(this.data);
    });
  }
}
