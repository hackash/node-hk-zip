/**
 *  @fileOverview definition of MethodInflate
 */

import zlb from 'zlib';

import { CompressionMethod } from './CompressionMethod';

/**
 * Class representing a MethodInflate
 * @extends CompressionMethod
 */
export class MethodInflate extends CompressionMethod {
  /**
   * Decompresses the data, compressed by method deflate
   * @return {Promise<Buffer>} decompressed - Decompressed data
   */
  public decompress(): Promise<Buffer> {
    const inflate = zlb.createInflateRaw();
    const data = [];
    return new Promise((resolve, reject) => {
      inflate.on('data', chunk => {
        data.push(chunk);
      });

      inflate.on('error', e => {
        reject(e);
      });

      inflate.on('end', () => {
        resolve(Buffer.concat(data));
      });

      inflate.end(this.data);
    });
  }
}
