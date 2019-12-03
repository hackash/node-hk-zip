/**
 *  @fileOverview MethodStored of CompressionMethod class
 */

import { CompressionMethod } from './CompressionMethod';

/**
 * Class representing a MethodStored
 * @extends CompressionMethod
 */
export class MethodStored extends CompressionMethod {
  /**
   * Wraps data into promise as there is no compression applied
   * @return {Promise<Buffer>} data - data
   */
  public decompress(): Promise<Buffer> {
    return Promise.resolve(this.data);
  }
}
