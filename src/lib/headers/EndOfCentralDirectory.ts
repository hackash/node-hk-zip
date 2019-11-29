import { IEndOfCentralDirByteMap, IParsedEndOfCentralDir } from '../interfaces/EndOfCentralDirByteMap';
import { END_OF_CENTRAL_DIR_MAP } from '../ZipByteMap';
import { HeaderMap } from './HeaderMap';

export class EndOfCentralDirectory extends HeaderMap<IEndOfCentralDirByteMap> {
  private parsed: IParsedEndOfCentralDir;

  constructor(input: Buffer, offset: number) {
    super(END_OF_CENTRAL_DIR_MAP, input.slice(offset, offset + END_OF_CENTRAL_DIR_MAP.SIZE));
    this.parsed = this.loadBinaryHeader();
  }

  public loadBinaryHeader(): IParsedEndOfCentralDir {
    if (!this.isValidHeaderData()) {
      throw new Error('Wrong End Of central dir header');
    }
    return {
      NUMBER_OF_ENTRIES: this.data.readUInt16LE(this.map.NUMBER_OF_ENTRIES),
      TOTAL_NUMBER_OF_ENTRIES: this.data.readUInt16LE(this.map.TOTAL_NUMBER_OF_ENTRIES),
      CENTRAL_DIR_SIZE: this.data.readUInt32LE(this.map.CENTRAL_DIR_SIZE),
      CENTRAL_DIR_OFFSET: this.data.readUInt32LE(this.map.CENTRAL_DIR_OFFSET),
      COMMENT_LENGTH: this.data.readUInt16LE(this.map.COMMENT_LENGTH)
    };
  }

  public getNumberOfEntries(): number {
    return this.parsed.NUMBER_OF_ENTRIES;
  }

  public getOffset(): number {
    return this.parsed.CENTRAL_DIR_OFFSET;
  }

  public getSize() {
    return this.map.CENTRAL_DIR_SIZE;
  }
}
