import { ZipEntry } from '../ZipEntry';

export interface IZipFile {
  listEntries(): Array<ZipEntry>;
}
