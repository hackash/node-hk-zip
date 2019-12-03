/**
 *  @fileOverview Definition of ZipFile class
 */

import { InvalidZipFormatError } from './errors/InvalidZipFormatError';
import { EndOfCentralDirectory } from './headers/EndOfCentralDirectory';
import { IZipFile } from './interfaces/ZipFile';
import { END_OF_CENTRAL_DIR_MAP } from './ZipByteMap';
import { ZipEntry } from './ZipEntry';

/**
 * Class representing a ZipFile
 * @implements IZipFile
 */
export class ZipFile implements IZipFile {

  private EOCDH: EndOfCentralDirectory;
  private readonly data: Buffer;
  private readonly EOCDHoffset: number;

  /**
   * Creates a Zip File
   * @param {Buffer} data - Zip binary data
   * @return {ZipFile} - ZipFile object
   */
  constructor(data: Buffer) {
    this.data = data;
    this.EOCDHoffset = this.findEndOfCentralDirOffset();
    if (this.EOCDHoffset === -1) {
      throw new InvalidZipFormatError();
    }
  }

  /**
   * Searches a ZIP entry by given path
   * @param {Array<string>} paths - List of paths to search
   * @return {Array<ZipEntry>} list - The list of entries found
   */
  public findEntries(paths: string[]): ZipEntry[] {
    return this.listEntries(paths);
  }

  /**
   * Lists all entries in the ZIP file
   * @return {Array<ZipEntry>} list - The list of entries
   */
  public listAllEntries(): ZipEntry[] {
    return this.listEntries();
  }

  /**
   * Finds End of Central Directory offset
   * @return {number} offset - Offset of EndOfCentralDirectory header
   */
  private findEndOfCentralDirOffset(): number {
    let i = this.data.length - END_OF_CENTRAL_DIR_MAP.SIZE;
    const n = Math.max(0, i - 0XFFF);
    let end = -1;
    for (i; i >= n; i--) {
      if (this.data[i] !== 0x50) {
        continue;
      }
      const signature = this.data.readUInt32LE(i);
      if (signature === END_OF_CENTRAL_DIR_MAP.SIGNATURE) {
        end = i;
        break;
      }
    }
    return end;
  }

  /**
   * Lists all entries in the ZIP file if param paths is empty, otherwise filters the list by given paths
   * @param {Array<string>} paths - List of paths to search
   * @return {Array<ZipEntry>} list - The list of entries found
   */
  private listEntries(paths: string[] = []): ZipEntry[] {
    this.EOCDH = new EndOfCentralDirectory(this.data, this.EOCDHoffset);
    let index = this.EOCDH.getOffset();
    const count = this.EOCDH.getNumberOfEntries();
    const list = [];
    for (let i = 0; i < count; i++) {
      const entry = new ZipEntry(this.data, index);
      if (paths.length > 0) {
        if (paths.includes(entry.getPath())) {
          list.push(entry);
        }
        index += entry.getLocalHeaderSize();
        continue;
      }
      list.push(entry);
      index += entry.getLocalHeaderSize();
    }
    return list;
  }
}
