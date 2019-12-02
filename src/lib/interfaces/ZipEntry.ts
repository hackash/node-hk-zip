import { ZipEntry } from '../ZipEntry';
import { ZipEntryDescription } from './ZipEntryDescription';

export interface IZipEntry {
  setCentralDirOffset(offset: number): ZipEntry;

  describe(): ZipEntryDescription;

  decompress(): Promise<Buffer>;

  getLocalHeaderSize(): number;

  isDirectory(): boolean;

  getName(): string;

  getPath(): string;
}
