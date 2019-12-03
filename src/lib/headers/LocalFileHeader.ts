/**
 *  @fileOverview Definition of LocalFileHeader class
 */

import { InvalidLocalFileHeaderError } from '../errors/InvalidLocalFileHeaderError';
import { ILocalFileByteMap, IParsedLocalFile } from '../interfaces/LocalFileByteMap';
import { LOCAL_FILE_HEADER_MAP } from '../ZipByteMap';
import { HeaderMap } from './HeaderMap';

/**
 * Class representing a LocalFileHeader
 * @extends HeaderMap<ILocalFileByteMap>
 */
export class LocalFileHeader extends HeaderMap<ILocalFileByteMap> {
  private parsed: IParsedLocalFile;

  /**
   * Creates a LocalFileHeader object
   * @param {Buffer} input - Zip binary data
   * @param {number} offset - Offset of the header
   * @return {LocalFileHeader} - LocalFileHeader object
   */
  constructor(input: Buffer, offset: number) {
    super(LOCAL_FILE_HEADER_MAP, input, offset);
    this.parsed = this.loadBinaryHeader();
  }

  /**
   * Combines compressed data offset
   * @param {number} offset - LocalFileHeader offset
   * @return {number} offset - Compressed data offset
   */
  public getCompressedSliceOffset(offset: number): number {
    return offset + this.map.SIZE + this.parsed.FILENAME_LENGTH + this.parsed.EXTRA_FIELD_LENGTH;
  }

  /**
   * Parses local file header using ByteMap
   * @return {IParsedLocalFile} - ParsedLocalFile object
   */
  public loadBinaryHeader(): IParsedLocalFile {
    if (!this.isValidHeaderData()) {
      throw new InvalidLocalFileHeaderError();
    }
    return {
      VERSION: this.data.readUInt16LE(this.map.VERSION),
      GENERAL_BIT_FLAG: this.data.readUInt16LE(this.map.GENERAL_BIT_FLAG),
      COMPRESSION_METHOD: this.data.readUInt16LE(this.map.COMPRESSION_METHOD),
      MODIFICATION_TIME: this.data.readUInt16LE(this.map.MODIFICATION_TIME),
      MODIFICATION_DATE: this.data.readUInt16LE(this.map.MODIFICATION_DATE),
      CRC: this.data.readUInt32LE(this.map.CRC),
      COMPRESSED_SIZE: this.data.readUInt32LE(this.map.COMPRESSED_SIZE),
      UNCOMPRESSED_SIZE: this.data.readUInt32LE(this.map.UNCOMPRESSED_SIZE),
      FILENAME_LENGTH: this.data.readUInt16LE(this.map.FILENAME_LENGTH),
      EXTRA_FIELD_LENGTH: this.data.readUInt16LE(this.map.EXTRA_FIELD_LENGTH)
    };
  }

  /**
   * Getter for parsed CRC value
   * @return {number} - CRC-32 value
   */
  public getCRC32(): number {
    return this.parsed.CRC;
  }
}
