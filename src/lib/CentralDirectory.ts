export class CentralDirectory {
  public readonly offset: number = 0;
  private readonly data: Buffer;
  private parsed: any = {}; // todo add interface for this

  private readonly specs = {
    SIZE: 46, // CEN header size
    SIGNATURE: 0x02014b50, // "PK\001\002"
    VERSION_MADE: 4, // version made by
    VERSION_EXTRACT: 6, // version needed to extract
    FLAGS: 8, // encrypt, decrypt flags
    METHOD: 10, // compression method
    TIME: 12, // modification time (2 bytes time, 2 bytes date)
    CRC_32: 16, // uncompressed file crc-32 value
    COMPRESSED_SIZE: 20, // compressed size
    DECOMPRESSED_SIZE: 24, // uncompressed size
    FILENAME_LENGTH: 28, // filename length
    EXTRA_FIELD: 30, // extra field length
    COMMENT_LENGTH: 32, // file comment length
    DISK_START: 34, // volume number start
    INTERNAL_ATTRIBUTES: 36, // internal file attributes
    EXTERNAL_ATTRIBUTES: 38, // external file attributes (host system dependent)
    OFFSET: 42 // LOC header offset
  };

  constructor(input: Buffer, offset: number) {
    this.data = input.slice(offset, offset + this.specs.SIZE);
    this.parsed = this.loadBinaryHeader();
  }

  private loadBinaryHeader() {
    if (this.data.length !== this.specs.SIZE || this.data.readUInt32LE(0) !== this.specs.SIGNATURE) {
      throw new Error('Wrong local file header');
    }

    return {
      // version made by
      versionMade: this.data.readUInt16LE(this.specs.VERSION_MADE),
      // version needed to extract
      versionExtract: this.data.readUInt16LE(this.specs.VERSION_EXTRACT),
      // encrypt, decrypt flags
      flags: this.data.readUInt16LE(this.specs.FLAGS),
      // compression method
      method: this.data.readUInt16LE(this.specs.METHOD),
      // modification time (2 bytes time, 2 bytes date)
      time: this.data.readUInt32LE(this.specs.TIME),
      // uncompressed file crc-32 value
      crc: this.data.readUInt32LE(this.specs.CRC_32),
      // compressed size
      compressedSize: this.data.readUInt32LE(this.specs.COMPRESSED_SIZE),
      // uncompressed size
      decompressedSize: this.data.readUInt32LE(this.specs.DECOMPRESSED_SIZE),
      // filename length
      filenameLength: this.data.readUInt16LE(this.specs.FILENAME_LENGTH),
      // extra field length
      extraFieldLength: this.data.readUInt16LE(this.specs.EXTRA_FIELD),
      // file comment length
      commentLength: this.data.readUInt16LE(this.specs.COMMENT_LENGTH),
      // volume number start
      diskStart: this.data.readUInt16LE(this.specs.DISK_START),
      // internal file attributes
      internalAttributes: this.data.readUInt16LE(this.specs.INTERNAL_ATTRIBUTES),
      // external file attributes
      externalAttributes: this.data.readUInt32LE(this.specs.EXTERNAL_ATTRIBUTES),
      // LOC header offset
      offset: this.data.readUInt32LE(this.specs.OFFSET)
    };
  }

  public getFilenameLength(): number {
    return this.parsed.filenameLength;
  }

  public getExtraFieldLength(): number {
    return this.parsed.extraFieldLength;
  }

  public getLocalHeaderOffset(): number {
    return this.parsed.offset;
  }

  public getCompressedSize(): number {
    return this.parsed.compressedSize;
  }

  public getCompressionMethod(): number {
    return this.parsed.method;
  }

  public getFlags(): number {
    return this.parsed.flags;
  }

  public getSize(): number {
    return this.specs.SIZE;
  }
}
