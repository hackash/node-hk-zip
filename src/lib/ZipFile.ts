import { EndOfCentralDirectory } from './headers/EndOfCentralDirectory';
import { InvalidZipFormatError } from './errors/InvalidZipFormatError';
import { END_OF_CENTRAL_DIR_MAP } from './ZipByteMap';
import { IZipFile } from './interfaces/ZipFile';
import { ZipEntry } from './ZipEntry';

export class ZipFile implements IZipFile {

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
      const signature = this.data.readUInt32LE(i);
      if (signature === END_OF_CENTRAL_DIR_MAP.SIGNATURE) {
        end = i;
        break;
      }
    }
    return end;
  }

  private listEntries(paths: Array<string> = []): Array<ZipEntry> {
    const offset = this.findCentralDirOffset();
    if (offset === -1) {
      throw new InvalidZipFormatError();
    }
    this.EOCDH = new EndOfCentralDirectory(this.data, offset);
    let index = this.EOCDH.getOffset();
    let count = this.EOCDH.getNumberOfEntries();
    const list = [];
    for (let i = 0; i < count; i++) {
      const entry = new ZipEntry(this.data).setCentralDirOffset(index);
      if (paths.length > 0) {
        if (paths.includes(entry.getPath())) {
          list.push(entry);
        }
        index += entry.getLocalHeaderSize();
        continue;
      }
      list.push(entry);
      index += entry.getLocalHeaderSize();
    }
    return list;
  }

  public findEntries(paths: Array<string>): Array<ZipEntry> {
    return this.listEntries(paths);
  }

  public listAllEntries(): Array<ZipEntry> {
    return this.listEntries();
  }
}
