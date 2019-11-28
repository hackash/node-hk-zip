import { LocalFileByteMapType } from './types/LocalFileByteMapType';
import { LOCAL_FILE_HEADER_MAP } from './ZipByteMap';

export class LocalFileHeader {
  public offset: number = 0;
  private readonly data: Buffer;
  private byteMap: LocalFileByteMapType = LOCAL_FILE_HEADER_MAP;
  private parsed: any = {}; // TODO create an interface for this

  constructor(input: Buffer, offset: number) {
    this.offset = offset;
    this.data = input.slice(offset, offset + this.byteMap.SIZE);
    this.parsed = this.loadBinaryHeader();
  }

  public getCompressedSliceOffset(offset: number): number {
    return offset + this.byteMap.SIZE + this.parsed.FILENAME_LENGTH + this.parsed.EXTRA_FIELD_LENGTH;
  }

  public loadBinaryHeader() {
    if (this.data.readUInt32LE(0) !== this.byteMap.SIGNATURE) {
      throw new Error('Wrong local file header');
    }

    return {
      // version needed to extract
      VERSION: this.data.readUInt16LE(this.byteMap.VERSION),
      // general purpose bit flag
      FLAGS: this.data.readUInt16LE(this.byteMap.GENERAL_BIT_FLAG),
      // compression method
      METHOD: this.data.readUInt16LE(this.byteMap.COMPRESSION_METHOD),
      // modification time (2 bytes time, 2 bytes date)
      TIME: this.data.readUInt32LE(this.byteMap.MODIFICATION_TIME),
      // uncompressed file crc-32 value
      CRC: this.data.readUInt32LE(this.byteMap.CRC_32),
      // compressed size
      COMPRESSED_SIZE: this.data.readUInt32LE(this.byteMap.COMPRESSED_SIZE),
      // uncompressed size
      SIZE: this.data.readUInt32LE(this.byteMap.UNCOMPRESSED_SIZE),
      // filename length
      FILENAME_LENGTH: this.data.readUInt16LE(this.byteMap.FILENAME_LENGTH),
      // extra field length
      EXTRA_FIELD_LENGTH: this.data.readUInt16LE(this.byteMap.EXTRA_FIELD)
    };
  }

  public getCRC32(): number {
    return this.parsed.CRC;
  }
}
