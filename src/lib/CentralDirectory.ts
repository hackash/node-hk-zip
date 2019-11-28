import { ICentralDirByteMap, IParsedCentralDir } from './interfaces/CentralDirByteMapType';
import { CENTRAL_DIR_MAP } from './ZipByteMap';

export class CentralDirectory {
  private byteMap: ICentralDirByteMap = CENTRAL_DIR_MAP;
  public readonly offset: number = 0;
  private parsed: IParsedCentralDir;
  private readonly data: Buffer;

  constructor(input: Buffer, offset: number) {
    this.data = input.slice(offset, offset + this.byteMap.SIZE);
    this.parsed = this.loadBinaryHeader();
  }

  private loadBinaryHeader(): IParsedCentralDir {
    if (this.data.length !== this.byteMap.SIZE || this.data.readUInt32LE(0) !== this.byteMap.SIGNATURE) {
      throw new Error('Wrong local file header');
    }

    return {
      VERSION_MADE: this.data.readUInt16LE(this.byteMap.VERSION_MADE),
      VERSION_EXTRACT: this.data.readUInt16LE(this.byteMap.VERSION_EXTRACT),
      FLAGS: this.data.readUInt16LE(this.byteMap.FLAGS),
      METHOD: this.data.readUInt16LE(this.byteMap.METHOD),
      TIME: this.data.readUInt16LE(this.byteMap.TIME),
      DATE: this.data.readUInt16LE(this.byteMap.DATE),
      CRC: this.data.readUInt32LE(this.byteMap.CRC),
      COMPRESSED_SIZE: this.data.readUInt32LE(this.byteMap.COMPRESSED_SIZE),
      DECOMPRESSED_SIZE: this.data.readUInt32LE(this.byteMap.DECOMPRESSED_SIZE),
      FILENAME_LENGTH: this.data.readUInt16LE(this.byteMap.FILENAME_LENGTH),
      EXTRA_FIELD_LENGTH: this.data.readUInt16LE(this.byteMap.EXTRA_FIELD_LENGTH),
      COMMENT_LENGTH: this.data.readUInt16LE(this.byteMap.COMMENT_LENGTH),
      DISK_START: this.data.readUInt16LE(this.byteMap.DISK_START),
      INTERNAL_ATTRIBUTES: this.data.readUInt16LE(this.byteMap.INTERNAL_ATTRIBUTES),
      EXTERNAL_ATTRIBUTES: this.data.readUInt32LE(this.byteMap.EXTERNAL_ATTRIBUTES),
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
    return this.parsed.OFFSET;
  }

  public getCompressedSize(): number {
    return this.parsed.COMPRESSED_SIZE;
  }

  public getCompressionMethod(): number {
    return this.parsed.METHOD;
  }

  public getFlags(): number {
    return this.parsed.FLAGS;
  }

  public getSize(): number {
    return this.byteMap.SIZE;
  }
}
