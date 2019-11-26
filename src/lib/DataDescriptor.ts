export class DataDescriptor {
  private readonly data: Buffer;
  private parsed: any = {};

  private readonly specs = {
    SIGNATURE: 0x08074b50, // "PK\007\008"
    SIZE: 16, // EXT header size
    CRC_32_VALUE: 4, // uncompressed file crc-32 value
    COMPRESSED_SIZE: 8, // compressed size
    UNCOMPRESSED_SIZE: 12 // uncompressed size
  };

  constructor(input: Buffer, offset: number) {
    this.data = input.slice(offset, offset + this.specs.SIZE);
    this.parsed = this.loadBinaryHeader();
  }

  public loadBinaryHeader() {
    if (this.data.length !== this.specs.SIZE || this.data.readUInt32LE(0) !== this.specs.SIGNATURE) {
      throw new Error('Wrong data descriptor');
    }
    return {
      crc: this.data.readUInt32LE(this.specs.CRC_32_VALUE),
      size: this.data.readUInt16BE(this.specs.COMPRESSED_SIZE),
      uncomressedSize: this.data.readUInt16BE(this.specs.UNCOMPRESSED_SIZE)
    };
  }

  public getCRC32(): number {
    return this.parsed.crc;
  }
}
