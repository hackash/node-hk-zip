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
