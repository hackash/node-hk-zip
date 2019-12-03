/**
 *  @fileOverview Definition of ZipEntry class
 */

import path from 'path';

import CRC32 from './CRC32';
import { InvalidCRC32Error } from './errors/InvalidCRC32Error';
import { UnsupportedCompressionError } from './errors/UnsupportedCompressionError';
import { CentralDirectory } from './headers/CentralDirectory';
import { DataDescriptor } from './headers/DataDescriptor';
import { LocalFileHeader } from './headers/LocalFileHeader';
import { IZipEntry } from './interfaces/ZipEntry';
import { IZipEntryDescription } from './interfaces/ZipEntryDescription';
import { MethodInflate } from './methods/MethodInflate';
import { MethodStored } from './methods/MethodStored';

/**
 * Class representing a ZipEntry
 * @implements IZipEntry
 */
export class ZipEntry implements IZipEntry {
  private readonly data: Buffer;
  private CDH: CentralDirectory;
  private LFH: LocalFileHeader;

  private methods: any = {
    DEFLATED: 8,
    STORED: 0
  };

  private name: Buffer;

  /**
   * Creates a Zip Entry
   * @param {Buffer} data - Zip binary data
   * @param {number} centralDirOffset - Offset of central dir header
   * @return {ZipEntry} - ZipEntry object
   */
  constructor(data: Buffer, centralDirOffset: number) {
    this.data = data;
    this.setCentralDirOffset(centralDirOffset);
  }

  /**
   * Decompresses the ZipEntry
   * @return {Promise<Buffer>} decompressed - decompressed data slice
   */
  public async decompress(): Promise<Buffer> {
    const compressed = this.fetchRawCompressedData();
    const method = this.CDH.getCompressionMethod();
    switch (method) {
      case this.methods.DEFLATED:
        if (!this.isDirectory()) {
          const inflate = new MethodInflate(compressed);
          return inflate.decompress();
        }
        break;
      case this.methods.STORED:
        if (!this.isDirectory()) {
          const stored = new MethodStored(compressed);
          return stored.decompress();
        }
        break;
      default:
        throw new UnsupportedCompressionError();
    }
    return compressed;
  }

  /**
   * Delivers LocalFile Header size
   * @return {number} size - LocalFileHeader size
   */
  public getLocalHeaderSize(): number {
    return this.CDH.getLocalHeaderSize();
  }

  /**
   * Checks whether the entry is directory by looking for a slash at the end of the file name
   * @return {boolean} isDirectory - true when the entry name contains slash at the end
   */
  public isDirectory(): boolean {
    const last = this.name[this.name.length - 1];
    return last === 47 || last === 92;
  }

  /**
   * Delivers entry name
   * @return {string} name - Entry name
   */
  public getName(): string {
    return path.basename(this.name.toString());
  }

  /**
   * Delivers entry full path
   * @return {string} path - Entry path
   */
  public getPath(): string {
    return this.name.toString();
  }

  /**
   * Describes entry without decompression
   * @return {IZipEntryDescription} description - Description of ZipEntry without data
   */
  public describe(): IZipEntryDescription {
    return {
      isDirectory: this.isDirectory(),
      name: path.basename(this.name.toString()),
      path: this.name.toString()
    };
  }

  /**
   * Initiates name of the ZipEntry
   * @param {number} offset - Name offset
   */
  private initName(offset: number): void {
    this.name = this.data.slice(offset, offset + this.CDH.getFilenameLength());
  }

  /**
   * Verifies CRC-32 checksum
   * @param {Buffer} data - Compressed data
   * @param {number} ext - DataDescriptor Header offset
   * @return {boolean} isValidCRC32 - true when checksum matches, otherwise false
   */
  private verifyChecksum(data: Buffer, ext: number): boolean {
    if ((this.CDH.getFlags() & 0x8) !== 0x8) {
      /* TODO calculate and compare CRC */
      // CRC32.calculate(data) === this.LFH.getCRC32();
    } else {
      const DDH = new DataDescriptor(this.data, ext);
      DDH.getCRC32();
      // console.log('DDH', DDH);
      /* TODO calculate and compare CRC */
      // CRC32.calculate(data) === this.DDH.getCRC32();
    }
    /* Mocking this now, TODO implement proper CRC calculation later */
    return CRC32.calculate(data) === 0;
  }

  /**
   * Sets CentralDirectory offset
   * @param {number} offset - CentralDirectory Header offset
   * @return {ZipEntry} Zip entry - class reference for chain call
   */
  private setCentralDirOffset(offset: number): ZipEntry {
    this.CDH = new CentralDirectory(this.data, offset);
    const fieldsOffset = this.CDH.getSize() + offset;
    this.initName(fieldsOffset);
    return this;
  }

  /**
   * Fetches raw compressed data of the ZipEntry
   * @return {Buffer} compressed - compressed data slice
   */
  private fetchRawCompressedData(): Buffer {
    const offset = this.CDH.getLocalHeaderOffset();
    this.LFH = new LocalFileHeader(this.data, offset);
    const start = this.LFH.getCompressedSliceOffset(offset);
    const end = this.CDH.getCompressedSize();
    const compressed = this.data.slice(start, start + end);
    if (this.verifyChecksum(compressed, start + end)) {
      return compressed;
    }
    throw new InvalidCRC32Error();
  }

}
