import { EndOfCentralDirectory } from './EndOfCentralDirectory';
import { ZipEntry } from './ZipEntry';

export class ZipFile {

  private readonly data: Buffer;

  constructor(data: Buffer) {
    this.data = data;
  }

  public listEntries() {
    const centralDirEnd = new EndOfCentralDirectory(this.data);
    const parsed = centralDirEnd.loadBinaryHeader();
    let index = parsed.offset;
    const list = [];
    for (let i = 0; i < parsed.numberOfEntries; i++) {
      const entry = new ZipEntry(this.data).setCentralDirOffset(index);
      index += entry.getEntryHeaderSize();
      list.push(entry);
    }
    return list;
  }
}
