export class LocalFileHeader {
  public offset: number = 0;
  private readonly data: Buffer;
  private parsed: any = {}; // TODO create an interface for this

  private readonly specs = {
    SIZE: 30,
    SIGNATURE: 0x04034b50,
    COMPRESSION_METHOD: 8,
    VERSION: 4,
    MODIFICATION_TIME: 10,
    GENERAL_BIT_FLAG: 6,
    CRC_32: 14,
    COMPRESSED_SIZE: 18,
    UNCOMPRESSED_SIZE: 22,
    FILENAME_LENGTH: 26,
    EXTRA_FIELD: 28,
    CENTRAL_DIR_HEADER_SIZE: 46
  };

  constructor(input: Buffer, offset: number) {
    this.offset = offset;
    this.data = input.slice(offset, offset + this.specs.SIZE);
    this.parsed = this.loadBinaryHeader();
  }

  public getCompressedSliceOffset(offset: number): number {
    return offset + this.specs.SIZE + this.parsed.FILENAME_LENGTH + this.parsed.EXTRA_FIELD_LENGTH;
  }

  public loadBinaryHeader() {
    if (this.data.readUInt32LE(0) !== this.specs.SIGNATURE) {
      throw new Error('Wrong local file header');
    }

    return {
      // version needed to extract
      VERSION: this.data.readUInt16LE(this.specs.VERSION),
      // general purpose bit flag
      FLAGS: this.data.readUInt16LE(this.specs.GENERAL_BIT_FLAG),
      // compression method
      METHOD: this.data.readUInt16LE(this.specs.COMPRESSION_METHOD),
      // modification time (2 bytes time, 2 bytes date)
      TIME: this.data.readUInt32LE(this.specs.MODIFICATION_TIME),
      // uncompressed file crc-32 value
      CRC: this.data.readUInt32LE(this.specs.CRC_32),
      // compressed size
      COMPRESSED_SIZE: this.data.readUInt32LE(this.specs.COMPRESSED_SIZE),
      // uncompressed size
      SIZE: this.data.readUInt32LE(this.specs.UNCOMPRESSED_SIZE),
      // filename length
      FILENAME_LENGTH: this.data.readUInt16LE(this.specs.FILENAME_LENGTH),
      // extra field length
      EXTRA_FIELD_LENGTH: this.data.readUInt16LE(this.specs.EXTRA_FIELD)
    };
  }

  public getCRC32(): number {
    return this.parsed.CRC;
  }
}
