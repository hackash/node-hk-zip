import { ICentralDirByteMap, IParsedCentralDir } from '../interfaces/CentralDirByteMapType';
import { InvalidCentralDirHeaderError } from '../errors/InvalidCentralDirHeaderError';
import { CENTRAL_DIR_MAP } from '../ZipByteMap';
import { HeaderMap } from './HeaderMap';

export class CentralDirectory extends HeaderMap<ICentralDirByteMap> {
  private parsed: IParsedCentralDir;

  constructor(input: Buffer, offset: number) {
    super(CENTRAL_DIR_MAP, input, offset);
    this.parsed = this.loadBinaryHeader();
  }

  private loadBinaryHeader(): IParsedCentralDir {
    if (!this.isValidHeaderData()) {
      throw new InvalidCentralDirHeaderError();
    }
    return {
      VERSION_MADE: this.data.readUInt16LE(this.map.VERSION_MADE),
      VERSION_EXTRACT: this.data.readUInt16LE(this.map.VERSION_EXTRACT),
      FLAGS: this.data.readUInt16LE(this.map.FLAGS),
      METHOD: this.data.readUInt16LE(this.map.METHOD),
      TIME: this.data.readUInt16LE(this.map.TIME),
      DATE: this.data.readUInt16LE(this.map.DATE),
      CRC: this.data.readUInt32LE(this.map.CRC),
      COMPRESSED_SIZE: this.data.readUInt32LE(this.map.COMPRESSED_SIZE),
      DECOMPRESSED_SIZE: this.data.readUInt32LE(this.map.DECOMPRESSED_SIZE),
      FILENAME_LENGTH: this.data.readUInt16LE(this.map.FILENAME_LENGTH),
      EXTRA_FIELD_LENGTH: this.data.readUInt16LE(this.map.EXTRA_FIELD_LENGTH),
      COMMENT_LENGTH: this.data.readUInt16LE(this.map.COMMENT_LENGTH),
      DISK_START: this.data.readUInt16LE(this.map.DISK_START),
      INTERNAL_ATTRIBUTES: this.data.readUInt16LE(this.map.INTERNAL_ATTRIBUTES),
      EXTERNAL_ATTRIBUTES: this.data.readUInt32LE(this.map.EXTERNAL_ATTRIBUTES),
      OFFSET: this.data.readUInt32LE(this.map.OFFSET)
    };
  }

  public getLocalHeaderSize(): number {
    return this.map.SIZE + this.parsed.FILENAME_LENGTH + this.parsed.EXTRA_FIELD_LENGTH;
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
    return this.map.SIZE;
  }
}
