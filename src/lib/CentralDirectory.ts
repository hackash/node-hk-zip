import { CentralDirByteMapType } from './types/CentralDirByteMapType';
import { CENTRAL_DIR_MAP } from './ZipByteMap';

export class CentralDirectory {
  public readonly offset: number = 0;
  private readonly data: Buffer;
  private byteMap: CentralDirByteMapType = CENTRAL_DIR_MAP;
  private parsed: any = {}; // todo add interface for this

  constructor(input: Buffer, offset: number) {
    this.data = input.slice(offset, offset + this.byteMap.SIZE);
    this.parsed = this.loadBinaryHeader();
  }

  private loadBinaryHeader() {
    if (this.data.length !== this.byteMap.SIZE || this.data.readUInt32LE(0) !== this.byteMap.SIGNATURE) {
      throw new Error('Wrong local file header');
    }

    return {
      // version made by
      VERSION_MADE: this.data.readUInt16LE(this.byteMap.VERSION_MADE),
      // version needed to extract
      VERSION_EXTRACT: this.data.readUInt16LE(this.byteMap.VERSION_EXTRACT),
      // encrypt, decrypt flags
      FLAGS: this.data.readUInt16LE(this.byteMap.FLAGS),
      // compression method
      METHOD: this.data.readUInt16LE(this.byteMap.METHOD),
      // modification time (2 bytes time, 2 bytes date)
      TIME: this.data.readUInt32LE(this.byteMap.TIME),
      // uncompressed file crc-32 value
      CRC: this.data.readUInt32LE(this.byteMap.CRC_32),
      // compressed size
      COMPRESSED_SIZE: this.data.readUInt32LE(this.byteMap.COMPRESSED_SIZE),
      // uncompressed size
      DECOMPRESSED_SIZE: this.data.readUInt32LE(this.byteMap.DECOMPRESSED_SIZE),
      // filename length
      FILENAME_LENGTH: this.data.readUInt16LE(this.byteMap.FILENAME_LENGTH),
      // extra field length
      EXTRA_FIELD_LENGTH: this.data.readUInt16LE(this.byteMap.EXTRA_FIELD),
      // file comment length
      COMMENT_LENGTH: this.data.readUInt16LE(this.byteMap.COMMENT_LENGTH),
      // volume number start
      DISK_START: this.data.readUInt16LE(this.byteMap.DISK_START),
      // internal file attributes
      INTERNAL_ATTRIBUTES: this.data.readUInt16LE(this.byteMap.INTERNAL_ATTRIBUTES),
      // external file attributes
      EXTERNAL_ATTRIBUTES: this.data.readUInt32LE(this.byteMap.EXTERNAL_ATTRIBUTES),
      // LOC header offset
      OFFSET: this.data.readUInt32LE(this.byteMap.OFFSET)
    };
  }

  public getLocalHeaderSize(): number {
    return this.byteMap.SIZE + this.parsed.FILENAME_LENGTH + this.parsed.EXTRA_FIELD_LENGTH;
  }

  public getFilenameLength(): number {
    return this.parsed.FILENAME_LENGTH;
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
    return this.byteMap.SIZE;
  }
}
