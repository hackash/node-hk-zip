/**
 *  @fileOverview Definition of DataDescriptor class
 */

import { InvalidDataDescriptorHeaderError } from '../errors/InvalidDataDescriptorHeaderError';
import { IDataDescriptorByteMap, IParsedDataDescriptor } from '../interfaces/DataDescriptorByteMap';
import { DATA_DESCRIPTOR_MAP } from '../ZipByteMap';
import { HeaderMap } from './HeaderMap';

/**
 * Class representing a DataDescriptor
 * @extends HeaderMap<IDataDescriptorByteMap>
 */
export class DataDescriptor extends HeaderMap<IDataDescriptorByteMap> {
  private parsed: IParsedDataDescriptor;

  /**
   * Creates a DataDescriptor object
   * @param {Buffer} input - ZipFile data in binary
   * @param {number} offset - Offset of the header
   * @return {DataDescriptor} - DataDescriptor header object
   */
  constructor(input: Buffer, offset: number) {
    super(DATA_DESCRIPTOR_MAP, input, offset);
    this.parsed = this.loadBinaryHeader();
  }

  /**
   * Getter method for CRC-32
   * @return {number} num - CRC value
   */
  public getCRC32(): number {
    return this.parsed.CRC;
  }

  /**
   * Parses data descriptor header using ByteMap
   * @return {IParsedDataDescriptor} - IParsedDataDescriptor object
   */
  private loadBinaryHeader(): IParsedDataDescriptor {
    if (!this.isValidHeaderData()) {
      throw new InvalidDataDescriptorHeaderError();
    }
    return {
      CRC: this.data.readUInt32LE(this.map.CRC),
      COMPRESSED_SIZE: this.data.readUInt32LE(this.map.COMPRESSED_SIZE),
      UNCOMPRESSED_SIZE: this.data.readUInt32LE(this.map.UNCOMPRESSED_SIZE)
    };
  }
}
