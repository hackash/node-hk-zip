import { IParsedLocalFile, ILocalFileByteMap } from '../interfaces/LocalFileByteMapType';
import { LOCAL_FILE_HEADER_MAP } from '../ZipByteMap';
import { HeaderMap } from './HeaderMap';

export class LocalFileHeader extends HeaderMap<ILocalFileByteMap> {
  private parsed: IParsedLocalFile;

  constructor(input: Buffer, offset: number) {
    super(LOCAL_FILE_HEADER_MAP, input.slice(offset, offset + LOCAL_FILE_HEADER_MAP.SIZE));
    this.parsed = this.loadBinaryHeader();
  }

  public getCompressedSliceOffset(offset: number): number {
    return offset + this.map.SIZE + this.parsed.FILENAME_LENGTH + this.parsed.EXTRA_FIELD_LENGTH;
  }

  public loadBinaryHeader(): IParsedLocalFile {
    if (!this.isValidHeaderData()) {
      throw new Error('Wrong data descriptor');
    }
    return {
      VERSION: this.data.readUInt16LE(this.map.VERSION),
      GENERAL_BIT_FLAG: this.data.readUInt16LE(this.map.GENERAL_BIT_FLAG),
      COMPRESSION_METHOD: this.data.readUInt16LE(this.map.COMPRESSION_METHOD),
      MODIFICATION_TIME: this.data.readUInt16LE(this.map.MODIFICATION_TIME),
      MODIFICATION_DATE: this.data.readUInt16LE(this.map.MODIFICATION_DATE),
      CRC: this.data.readUInt32LE(this.map.CRC),
      COMPRESSED_SIZE: this.data.readUInt32LE(this.map.COMPRESSED_SIZE),
      UNCOMPRESSED_SIZE: this.data.readUInt32LE(this.map.UNCOMPRESSED_SIZE),
      FILENAME_LENGTH: this.data.readUInt16LE(this.map.FILENAME_LENGTH),
      EXTRA_FIELD_LENGTH: this.data.readUInt16LE(this.map.EXTRA_FIELD_LENGTH)
    };
  }

  public getCRC32(): number {
    return this.parsed.CRC;
  }
}
