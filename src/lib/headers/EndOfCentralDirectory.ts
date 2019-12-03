/**
 *  @fileOverview Definition of EndOfCentralDirectory class
 */

import { InvalidEndOfCentralDirHeaderError } from '../errors/InvalidEndOfCentralDirHeaderError';
import { IEndOfCentralDirByteMap, IParsedEndOfCentralDir } from '../interfaces/EndOfCentralDirByteMap';
import { END_OF_CENTRAL_DIR_MAP } from '../ZipByteMap';
import { HeaderMap } from './HeaderMap';

/**
 * Class representing a EndOfCentralDirectory
 * @extends HeaderMap<IEndOfCentralDirByteMap>
 */
export class EndOfCentralDirectory extends HeaderMap<IEndOfCentralDirByteMap> {
  private parsed: IParsedEndOfCentralDir;

  /**
   * Creates a EndOfCentralDirectory object
   * @param {Buffer} input - ZipFile data in binary
   * @param {number} offset - Offset of the header
   * @return {EndOfCentralDirectory} - EndOfCentralDirectory header object
   */
  constructor(input: Buffer, offset: number) {
    super(END_OF_CENTRAL_DIR_MAP, input, offset);
    this.parsed = this.loadBinaryHeader();
  }

  /**
   * Parses end of central directory header using ByteMap
   * @return {IParsedEndOfCentralDir} - ParsedEndOfCentralDir object
   */
  public loadBinaryHeader(): IParsedEndOfCentralDir {
    if (!this.isValidHeaderData()) {
      throw new InvalidEndOfCentralDirHeaderError();
    }
    return {
      NUMBER_OF_ENTRIES: this.data.readUInt16LE(this.map.NUMBER_OF_ENTRIES),
      TOTAL_NUMBER_OF_ENTRIES: this.data.readUInt16LE(this.map.TOTAL_NUMBER_OF_ENTRIES),
      CENTRAL_DIR_SIZE: this.data.readUInt32LE(this.map.CENTRAL_DIR_SIZE),
      CENTRAL_DIR_OFFSET: this.data.readUInt32LE(this.map.CENTRAL_DIR_OFFSET),
      COMMENT_LENGTH: this.data.readUInt16LE(this.map.COMMENT_LENGTH)
    };
  }

  /**
   * Getter method for number of entries
   * @return {number} num - NUMBER_OF_ENTRIES
   */
  public getNumberOfEntries(): number {
    return this.parsed.NUMBER_OF_ENTRIES;
  }

  /**
   * Getter method for central dir offset
   * @return {number} num - CENTRAL_DIR_OFFSET
   */
  public getOffset(): number {
    return this.parsed.CENTRAL_DIR_OFFSET;
  }

  /**
   * Getter method for central dir size
   * @return {number} num - CENTRAL_DIR_SIZE
   */
  public getSize() {
    return this.map.CENTRAL_DIR_SIZE;
  }
}
