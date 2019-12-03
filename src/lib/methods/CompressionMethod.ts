/**
 *  @fileOverview Definition of CompressionMethod class
 */

/**
 * Class representing a ZipEntry
 */
export abstract class CompressionMethod {
  protected readonly data: Buffer;

  /**
   * Creates a CompressionMethod
   * @param {Buffer} data - Compressed data
   */
  constructor(data: Buffer) {
    this.data = data;
  }

  /**
   * Decompresses the data, based on compression method
   * @return {Promise<Buffer>} decompressed - Decompressed data
   */
  public abstract decompress(): Promise<Buffer>;
}
