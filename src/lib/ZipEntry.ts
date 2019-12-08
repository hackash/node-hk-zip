/**
 *  @fileOverview Definition of ZipEntry class
 */

import path from 'path';

import { UnsupportedCompressionError } from './errors/UnsupportedCompressionError';
import { IZipEntryDescription } from './interfaces/ZipEntryDescription';
import { InvalidCRC32Error } from './errors/InvalidCRC32Error';
import { CentralDirectory } from './headers/CentralDirectory';
import { LocalFileHeader } from './headers/LocalFileHeader';
import { DataDescriptor } from './headers/DataDescriptor';
import { MethodInflate } from './methods/MethodInflate';
import { MethodStored } from './methods/MethodStored';
import { IZipEntry } from './interfaces/ZipEntry';
import CRC32 from './CRC32';

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
    this.initLocalFileHeader();
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
          const decompressed = await inflate.decompress();
          if (!this.verifyChecksum(decompressed)) {
            throw new InvalidCRC32Error();
          }
          return decompressed;
        }
        break;
      case this.methods.STORED:
        if (!this.isDirectory()) {
          const stored = new MethodStored(compressed);
          const decompressed = await stored.decompress();
          if (!this.verifyChecksum(decompressed)) {
            throw new InvalidCRC32Error();
          }
          return decompressed;
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
   * Getter for stored CRC-32 value
   * @return {number} crc - stored CRC-32 value
   */
  public getCRC32(): number {
    if ((this.CDH.getFlags() & 0x8) !== 0x8) {
      return this.LFH.getCRC32();
    } else {
      const offset = this.CDH.getLocalHeaderOffset();
      const start = this.LFH.getCompressedSliceOffset(offset);
      const end = this.CDH.getCompressedSize();
      const DDH = new DataDescriptor(this.data, start + end);
      return DDH.getCRC32();
    }
  }

  /**
   * Initiates LocalFileHeader
   */
  private initLocalFileHeader(): void {
    const offset = this.CDH.getLocalHeaderOffset();
    this.LFH = new LocalFileHeader(this.data, offset);
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
   * @return {boolean} isValidCRC32 - true when checksum matches, otherwise false
   */
  private verifyChecksum(data: Buffer): boolean {
    const crc = this.getCRC32();
    return crc === CRC32.calculate(data);
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
    const start = this.LFH.getCompressedSliceOffset(offset);
    const end = this.CDH.getCompressedSize();
    return this.data.slice(start, start + end);
  }
}
