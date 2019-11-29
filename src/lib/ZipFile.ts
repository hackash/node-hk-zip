import { EndOfCentralDirectory } from './headers/EndOfCentralDirectory';
import { END_OF_CENTRAL_DIR_MAP } from './ZipByteMap';
import { ZipEntry } from './ZipEntry';

export class ZipFile {

  private EOCDH: EndOfCentralDirectory;
  private readonly data: Buffer;

  constructor(data: Buffer) {
    this.data = data;
  }

  private findCentralDirOffset(): number {
    let i = this.data.length - END_OF_CENTRAL_DIR_MAP.SIZE;
    let n = Math.max(0, i - 0XFFF);
    let end = -1;
    for (i; i >= n; i--) {
      if (this.data[i] !== 0x50) continue;
      if (this.data.readUInt32LE(i) === END_OF_CENTRAL_DIR_MAP.SIGNATURE) {
        end = i;
        break;
      }
    }
    return end;
  }

  public listEntries(): Array<ZipEntry> {
    const offset = this.findCentralDirOffset();
    if (offset === -1) {
      throw new Error('Invalid format');
    }
    this.EOCDH = new EndOfCentralDirectory(this.data, offset);
    let index = this.EOCDH.getOffset();
    let count = this.EOCDH.getNumberOfEntries();
    const list = [];
    for (let i = 0; i < count; i++) {
      const entry = new ZipEntry(this.data).setCentralDirOffset(index);
      index += entry.getLocalHeaderSize();
      list.push(entry);
    }
    return list;
  }
}
