import { IParsedLocalFile, ILocalFileByteMap } from './interfaces/LocalFileByteMapType';
import { LOCAL_FILE_HEADER_MAP } from './ZipByteMap';

export class LocalFileHeader {
  private byteMap: ILocalFileByteMap = LOCAL_FILE_HEADER_MAP;
  private parsed: IParsedLocalFile;
  private readonly data: Buffer;
  public offset: number = 0;

  constructor(input: Buffer, offset: number) {
    this.offset = offset;
    this.data = input.slice(offset, offset + this.byteMap.SIZE);
    this.parsed = this.loadBinaryHeader();
  }

  public getCompressedSliceOffset(offset: number): number {
    return offset + this.byteMap.SIZE + this.parsed.FILENAME_LENGTH + this.parsed.EXTRA_FIELD_LENGTH;
  }

  public loadBinaryHeader(): IParsedLocalFile {
    if (this.data.readUInt32LE(0) !== this.byteMap.SIGNATURE) {
      throw new Error('Wrong local file header');
    }

    return {
      VERSION: this.data.readUInt16LE(this.byteMap.VERSION),
      GENERAL_BIT_FLAG: this.data.readUInt16LE(this.byteMap.GENERAL_BIT_FLAG),
      COMPRESSION_METHOD: this.data.readUInt16LE(this.byteMap.COMPRESSION_METHOD),
      MODIFICATION_TIME: this.data.readUInt16LE(this.byteMap.MODIFICATION_TIME),
      MODIFICATION_DATE: this.data.readUInt16LE(this.byteMap.MODIFICATION_DATE),
      CRC: this.data.readUInt32LE(this.byteMap.CRC),
      COMPRESSED_SIZE: this.data.readUInt32LE(this.byteMap.COMPRESSED_SIZE),
      UNCOMPRESSED_SIZE: this.data.readUInt32LE(this.byteMap.UNCOMPRESSED_SIZE),
      FILENAME_LENGTH: this.data.readUInt16LE(this.byteMap.FILENAME_LENGTH),
      EXTRA_FIELD_LENGTH: this.data.readUInt16LE(this.byteMap.EXTRA_FIELD_LENGTH)
    };
  }

  public getCRC32(): number {
    return this.parsed.CRC;
  }
}
