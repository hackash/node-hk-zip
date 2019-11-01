export class EndOfCentralDirectory {
  private readonly offset: number;
  private readonly data: Buffer;

  private readonly specs = {
    SIZE: 22, // END header size
    SIGNATURE: 0x06054b50, // "PK\005\006"
    NUMBER_OF_ENTRIES: 8, // number of entries on this disk
    TOTAL_NUMBER_OF_ENTRIES: 10, // total number of entries
    CENTRAL_DIR_SIZE: 12, // central directory size in bytes
    CENTRAL_DIR_OFFSET: 16, // offset of first CEN header
    COMMENT_LENGTH: 20 // zip file comment length
  };

  constructor(input: Buffer) {
    this.offset = this.findSelfOffset(input);
    this.data = input.slice(this.offset, this.offset + this.specs.SIZE);
  }

  private findSelfOffset(data: Buffer): number {
    let i = data.length - this.specs.SIZE;
    /* The combined length of any directory record and these three fields SHOULD NOT generally exceed 65,535 bytes. */
    let n = Math.max(0, 0XFFF);
    let end = -1;
    for (i; i >= n; i--) {
      if (data[i] !== 0x50) continue; // quick check that the byte is 'P'
      if (data.readUInt32LE(i) === this.specs.SIGNATURE) { // "PK\005\006"
        end = i;
        break;
      }
    }
    if (end === -1) {
      throw new Error('Invalid format');
    }
    return end;
  }

  public loadBinaryHeader() {
    // data should be 22 bytes and start with "PK 05 06"
    if (this.data.length !== this.specs.SIZE || this.data.readUInt32LE(0) !== this.specs.SIGNATURE) {
      throw new Error('Invalid main header end');
    }
    return {
      // number of entries on this volume
      numberOfEntries: this.data.readUInt16LE(this.specs.NUMBER_OF_ENTRIES),
      // total number of entries
      totalEntries: this.data.readUInt16LE(this.specs.TOTAL_NUMBER_OF_ENTRIES),
      // central directory size in bytes
      size: this.data.readUInt32LE(this.specs.CENTRAL_DIR_SIZE),
      // offset of first CEN header
      offset: this.data.readUInt32LE(this.specs.CENTRAL_DIR_OFFSET),
      // zip file comment length
      commentLength: this.data.readUInt16LE(this.specs.COMMENT_LENGTH)
    };
  }

  public getSize() {
    return this.specs.SIZE;
  }
}
