/**
 *  @fileOverview Definition of HeaderMap<T> generic class
 */

import { IBaseByteMap } from '../interfaces/BaseByteMap';

/**
 * Class representing a HeaderMap<T>
 */
export class HeaderMap<T extends IBaseByteMap> {
  protected readonly data: Buffer;
  protected readonly map: T;

  /**
   * Creates a LocalFileHeader object
   * @param {IBaseByteMap} map - ByteMap object
   * @param {Buffer} input - ZipFile data in binary
   * @param {number} offset - Offset of the header
   * @return {HeaderMap<IBaseByteMap>} - HeaderMap object
   */
  constructor(map: T, input: Buffer, offset: number) {
    this.map = map;
    this.data = input.slice(offset, offset + this.map.SIZE);
  }

  /**
   * Validates header data by checking length and signature
   * @return {boolean} isValid - True whether the data slice is correct
   */
  protected isValidHeaderData(): boolean {
    const signature = this.data.readUInt32LE(0);
    return (
      this.data.length === this.map.SIZE && signature === this.map.SIGNATURE
    );
  }
}
