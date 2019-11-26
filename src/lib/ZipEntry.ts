import path from 'path';

import { CentralDirectory } from './CentralDirectory';
import { LocalFileHeader } from './LocalFileHeader';
import { MethodInflate } from './MethodInflate';
import { DataDescriptor } from './DataDescriptor';
import CRC32 from './CRC32';

export class ZipEntry {
  private readonly data: Buffer;
  private CDH: CentralDirectory;
  private LFH: LocalFileHeader;
  private methods: any = {
    DEFLATED: 8,
    STORED: 0
  };

  public name: Buffer;

  constructor(data: Buffer) {
    this.data = data;
  }

  public setCentralDirOffset(offset: number): ZipEntry {
    this.CDH = new CentralDirectory(this.data, offset);
    const fieldOffset = this.CDH.getSize() + offset;
    this.initiateFields(fieldOffset);
    return this;
  }

  private initiateFields(offset: number): void {
    this.name = this.data.slice(offset, offset + this.CDH.getFilenameLength());
  }

  private verifyChecksum(data, ext): boolean {
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

  public async getData(): Promise<any> { /* TODO change return type */
    const compressed = this.fetchRawCompressedData();
    switch (this.CDH.getCompressionMethod()) {
      case this.methods.DEFLATED:
        if (!this.isDirectory()) {
          const inflate = new MethodInflate(compressed);
          return inflate.start();
        } else {
          console.log('No method to inflate dirs');
        }
        break;
      case this.methods.STORED:
        /*console.log('Stored');*/
        break;
      default:
        throw new Error('Unsupported compression');
    }
  }

  public getEntryHeaderSize(): number {
    return this.CDH.getSize() + this.CDH.getFilenameLength() + this.CDH.getExtraFieldLength();
  }

  private isDirectory(): boolean {
    const last = this.name[this.name.length - 1];
    return last === 47 || last === 92;
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
    throw new Error('Unable to verify CRC32');
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
