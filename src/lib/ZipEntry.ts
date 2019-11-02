import path from 'path';

import { CentralDirectory } from './CentralDirectory';
import { LocalFileHeader } from './LocalFileHeader';
import { MethodInflate } from './MethodInflate';

export class ZipEntry {
  private readonly data: Buffer;
  private centralDir: CentralDirectory;
  private methods: any = {
    DEFLATED: 8,
    STORED: 0
  };

  public name: Buffer;
  public extra: Buffer;
  public comment: Buffer;

  constructor(data: Buffer) {
    this.data = data;
  }

  public setCentralDirOffset(offset: number): ZipEntry {
    this.centralDir = new CentralDirectory(this.data, offset);
    const fieldOffset = this.centralDir.getSize() + offset;
    this.initiateFields(fieldOffset);
    return this;
  }

  private initiateFields(offset: number): void {
    const parsedCentralDir = this.centralDir.loadBinaryHeader();
    console.log('CENTRAL DIR', parsedCentralDir);
    this.name = this.data.slice(offset, offset + parsedCentralDir.filenameLength);
    if (parsedCentralDir.extraFieldLength) {
      this.extra = this.data.slice(offset, offset + parsedCentralDir.extraFieldLength);
    }
    if (parsedCentralDir.commentLength) {
      this.comment = this.data.slice(offset, offset + parsedCentralDir.commentLength);
    }
  }

  public getData(): any {
    const compressed = this.fetchRawCompressedData();
    /*if (compressed.length === 0) {
      throw new Error('No data compressed');
    }*/
    /* Parsing twice not a good idea, TODO: move to constructor */
    const parsedCentralDir = this.centralDir.loadBinaryHeader();
    switch (parsedCentralDir.method) {
      case this.methods.DEFLATED:
        console.log(this.name.toString(), 'Deflated');
        if (!this.isDirectory()) {
          const inflate = new MethodInflate(compressed);
          inflate.inflate((data) => {
            console.log('Inflated', data);
          });
        } else {
          console.log('No method to inflate dirs');
        }
        break;
      case this.methods.STORED:
        console.log('Stored');
        break;
      default:
        throw new Error('Unsupported compression');
    }
  }

  public getHeader() {
    return this.centralDir.loadBinaryHeader();
  }

  public getEntryHeaderSize(): number {
    /* Parsing twice not a good idea, TODO: remove duplicates */
    const parsedCentralDir = this.centralDir.loadBinaryHeader();
    return this.centralDir.getSize() + parsedCentralDir.filenameLength + parsedCentralDir.extraFieldLength;
  }

  private isDirectory(): boolean {
    const last = this.name[this.name.length - 1];
    return last === 47 || last === 92;
  }

  /* TODO: call this on entry to get row compression, decompress should use this */
  private fetchRawCompressedData(): Buffer {
    const parsedCentralDir = this.centralDir.loadBinaryHeader();
    /* TODO pass offset to constructor only*/
    const localFileHeader = new LocalFileHeader(this.data, parsedCentralDir.offset);
    const start = localFileHeader.getCompressedSliceOffset(parsedCentralDir.offset);
    const end = parsedCentralDir.compressedSize;
    return this.data.slice(start, start + end);
  }

  public getInfo(): any {
    return {
      path: this.name.toString(),
      isDirectory: this.isDirectory(),
      size: this.fetchRawCompressedData().length,
      name: path.basename(this.name.toString())
    };
  }

}
