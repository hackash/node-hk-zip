import path from 'path';

import { UnsupportedCompressionError } from './errors/UnsupportedCompressionError';
import { InvalidCRC32Error } from './errors/InvalidCRC32Error';
import { CentralDirectory } from './headers/CentralDirectory';
import { LocalFileHeader } from './headers/LocalFileHeader';
import { DataDescriptor } from './headers/DataDescriptor';
import { MethodInflate } from './methods/MethodInflate';
import { MethodStored } from './methods/MethodStored';
import { IZipEntry } from './interfaces/ZipEntry';
import CRC32 from './CRC32';

export class ZipEntry implements IZipEntry {
  private readonly data: Buffer;
  private CDH: CentralDirectory;
  private LFH: LocalFileHeader;

  private methods: any = {
    DEFLATED: 8,
    STORED: 0
  };

  private name: Buffer;

  constructor(data: Buffer) {
    this.data = data;
  }

  private initiateFields(offset: number): void {
    this.name = this.data.slice(offset, offset + this.CDH.getFilenameLength());
  }

  private verifyChecksum(data: Buffer, ext: number): boolean {
    if ((this.CDH.getFlags() & 0x8) !== 0x8) {
      /* TODO calculate and compare CRC */
      // CRC32.calculate(data) === this.LFH.getCRC32();
    } else {
      const DDH = new DataDescriptor(this.data, ext);
      console.log('DDH', DDH);
      /* TODO calculate and compare CRC */
      // CRC32.calculate(data) === this.DDH.getCRC32();
    }
    /* Mocking this now, TODO implement proper CRC calculation later */
    return CRC32.calculate(data) === 0;
  }

  public setCentralDirOffset(offset: number): ZipEntry {
    this.CDH = new CentralDirectory(this.data, offset);
    const fieldOffset = this.CDH.getSize() + offset;
    this.initiateFields(fieldOffset);
    return this;
  }

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

  public async decompress(): Promise<Buffer> {
    const compressed = this.fetchRawCompressedData();
    const method = this.CDH.getCompressionMethod();
    switch (method) {
      case this.methods.DEFLATED:
        if (!this.isDirectory()) {
          const inflate = new MethodInflate(compressed);
          return await inflate.decompress();
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

  public getLocalHeaderSize(): number {
    return this.CDH.getLocalHeaderSize();
  }

  public isDirectory(): boolean {
    const last = this.name[this.name.length - 1];
    return last === 47 || last === 92;
  }

  public describe(): any {
    return {
      path: this.name.toString(),
      isDirectory: this.isDirectory(),
      size: this.data.length,
      name: path.basename(this.name.toString())
    };
  }

}
