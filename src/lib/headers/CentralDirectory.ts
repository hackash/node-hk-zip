/**
 *  @fileOverview Definition of CentralDirectory class
 */

import { ICentralDirByteMap, IParsedCentralDir } from '../interfaces/CentralDirByteMap';
import { InvalidCentralDirHeaderError } from '../errors/InvalidCentralDirHeaderError';
import { CENTRAL_DIR_MAP } from '../ZipByteMap';
import { HeaderMap } from './HeaderMap';

/**
 * Class representing a CentralDirectory
 * @extends HeaderMap<ICentralDirByteMap>
 */
export class CentralDirectory extends HeaderMap<ICentralDirByteMap> {
  private parsed: IParsedCentralDir;

  /**
   * Creates a CentralDirectory object
   * @param {Buffer} input - ZipFile data in binary
   * @param {number} offset - Offset of the header
   * @return {CentralDirectory} - CentralDirectory header object
   */
  constructor(input: Buffer, offset: number) {
    super(CENTRAL_DIR_MAP, input, offset);
    this.parsed = this.loadBinaryHeader();
  }

  /**
   * Parses central directory header using ByteMap
   * @return {IParsedDataDescriptor} - IParsedCentralDir object
   */
  private loadBinaryHeader(): IParsedCentralDir {
    if (!this.isValidHeaderData()) {
      throw new InvalidCentralDirHeaderError();
    }
    return {
      VERSION_MADE: this.data.readUInt16LE(this.map.VERSION_MADE),
      VERSION_EXTRACT: this.data.readUInt16LE(this.map.VERSION_EXTRACT),
      FLAGS: this.data.readUInt16LE(this.map.FLAGS),
      METHOD: this.data.readUInt16LE(this.map.METHOD),
      TIME: this.data.readUInt16LE(this.map.TIME),
      DATE: this.data.readUInt16LE(this.map.DATE),
      CRC: this.data.readUInt32LE(this.map.CRC),
      COMPRESSED_SIZE: this.data.readUInt32LE(this.map.COMPRESSED_SIZE),
      DECOMPRESSED_SIZE: this.data.readUInt32LE(this.map.DECOMPRESSED_SIZE),
      FILENAME_LENGTH: this.data.readUInt16LE(this.map.FILENAME_LENGTH),
      EXTRA_FIELD_LENGTH: this.data.readUInt16LE(this.map.EXTRA_FIELD_LENGTH),
      COMMENT_LENGTH: this.data.readUInt16LE(this.map.COMMENT_LENGTH),
      DISK_START: this.data.readUInt16LE(this.map.DISK_START),
      INTERNAL_ATTRIBUTES: this.data.readUInt16LE(this.map.INTERNAL_ATTRIBUTES),
      EXTERNAL_ATTRIBUTES: this.data.readUInt32LE(this.map.EXTERNAL_ATTRIBUTES),
      OFFSET: this.data.readUInt32LE(this.map.OFFSET)
    };
  }

  /**
   * Getter method local file header size
   * @return {number} num - local file header size
   */
  public getLocalHeaderSize(): number {
    return this.map.SIZE + this.parsed.FILENAME_LENGTH + this.parsed.EXTRA_FIELD_LENGTH;
  }

  /**
   * Getter method filename length
   * @return {number} num - FILENAME_LENGTH
   */
  public getFilenameLength(): number {
    return this.parsed.FILENAME_LENGTH;
  }

  /**
   * Getter method for local file header offset
   * @return {number} num - local file header offset
   */
  public getLocalHeaderOffset(): number {
    return this.parsed.OFFSET;
  }

  /**
   * Getter method for compressed data size
   * @return {number} num - COMPRESSED_SIZE
   */
  public getCompressedSize(): number {
    return this.parsed.COMPRESSED_SIZE;
  }

  /**
   * Getter method for compression method
   * @return {number} num - METHOD
   */
  public getCompressionMethod(): number {
    return this.parsed.METHOD;
  }

  /**
   * Getter method for General purpose bit flag
   * @return {number} num - General purpose bit flag
   */
  public getFlags(): number {
    return this.parsed.FLAGS;
  }

  /**
   * Getter method for central directory header size
   * @return {number} num - Central directory header size
   */
  public getSize(): number {
    return this.map.SIZE;
  }
}
