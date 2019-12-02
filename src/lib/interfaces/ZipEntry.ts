/**
 *  @fileOverview Definition of IZipEntry interface
 */

import { ZipEntryDescription } from './ZipEntryDescription';
import { ZipEntry } from '../ZipEntry';

/**
 * @interface IZipEntry - Specifies public methods of ZipEntry class
 */
export interface IZipEntry {
  setCentralDirOffset(offset: number): ZipEntry;

  describe(): ZipEntryDescription;

  decompress(): Promise<Buffer>;

  getLocalHeaderSize(): number;

  isDirectory(): boolean;

  getName(): string;

  getPath(): string;
}
