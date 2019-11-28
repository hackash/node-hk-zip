import { IEndOfCentralDirByteMap, IParsedEndOfCentralDir } from './interfaces/EndOfCentralDirByteMap';
import { END_OF_CENTRAL_DIR_MAP } from './ZipByteMap';

export class EndOfCentralDirectory {
  private byteMap: IEndOfCentralDirByteMap = END_OF_CENTRAL_DIR_MAP;
  private parsed: IParsedEndOfCentralDir;
  private readonly offset: number;
  private readonly data: Buffer;

  constructor(input: Buffer) {
    this.offset = this.findSelfOffset(input);
    this.data = input.slice(this.offset, this.offset + this.byteMap.SIZE);
    this.parsed = this.loadBinaryHeader();
  }

  private findSelfOffset(data: Buffer): number {
    let i = data.length - this.byteMap.SIZE;
    let n = Math.max(0, i - 0XFFF);
    let end = -1;
    for (i; i >= n; i--) {
      if (data[i] !== 0x50) continue; // quick check that the byte is 'P'
      if (data.readUInt32LE(i) === this.byteMap.SIGNATURE) { // "PK\005\006"
        end = i;
        break;
      }
    }
    if (end === -1) {
      throw new Error('Invalid format');
    }
    return end;
  }

  public loadBinaryHeader(): IParsedEndOfCentralDir {
    // data should be 22 bytes and start with "PK 05 06"
    if (this.data.length !== this.byteMap.SIZE || this.data.readUInt32LE(0) !== this.byteMap.SIGNATURE) {
      throw new Error('Invalid main header end');
    }
    return {
      NUMBER_OF_ENTRIES: this.data.readUInt16LE(this.byteMap.NUMBER_OF_ENTRIES),
      TOTAL_NUMBER_OF_ENTRIES: this.data.readUInt16LE(this.byteMap.TOTAL_NUMBER_OF_ENTRIES),
      CENTRAL_DIR_SIZE: this.data.readUInt32LE(this.byteMap.CENTRAL_DIR_SIZE),
      CENTRAL_DIR_OFFSET: this.data.readUInt32LE(this.byteMap.CENTRAL_DIR_OFFSET),
      COMMENT_LENGTH: this.data.readUInt16LE(this.byteMap.COMMENT_LENGTH)
    };
  }

  public getNumberOfEntries(): number {
    return this.parsed.NUMBER_OF_ENTRIES;
  }

  public getOffset(): number {
    return this.parsed.CENTRAL_DIR_OFFSET;
  }

  public getSize() {
    return this.byteMap.CENTRAL_DIR_SIZE;
  }
}
