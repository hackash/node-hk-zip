import { ZipEntry } from '../ZipEntry';

export interface IZipFile {
  listAllEntries(): Array<ZipEntry>;
  findEntries(paths: Array<string>): Array<ZipEntry>;
}
