import { EndOfCentralDirectory } from './EndOfCentralDirectory';
import { ZipEntry } from './ZipEntry';

export class ZipFile {

  private EOCDH: EndOfCentralDirectory;
  private readonly data: Buffer;

  constructor(data: Buffer) {
    this.data = data;
  }

  public listEntries(): Array<ZipEntry> {
    this.EOCDH = new EndOfCentralDirectory(this.data);
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
