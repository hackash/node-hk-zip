import { ZipEntry } from '../ZipEntry';

export interface IZipEntry {
  setCentralDirOffset(offset: number): ZipEntry;

  decompress(): Promise<Buffer>;

  getLocalHeaderSize(): number;

  isDirectory(): boolean;

  describe(): any;
}
