/**
 *  @fileOverview Definition of IZipEntry interface
 */

import { ZipEntryDescription } from './ZipEntryDescription';

/**
 * @interface IZipEntry - Specifies public methods of ZipEntry class
 */
export interface IZipEntry {

  describe(): ZipEntryDescription;

  decompress(): Promise<Buffer>;

  getLocalHeaderSize(): number;

  isDirectory(): boolean;

  getName(): string;

  getPath(): string;
}
