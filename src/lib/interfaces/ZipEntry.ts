/**
 *  @fileOverview Definition of IZipEntry interface
 */

import { IZipEntryDescription } from './ZipEntryDescription';

/**
 * @interface IZipEntry - Specifies public methods of ZipEntry class
 */
export interface IZipEntry {
  describe(): IZipEntryDescription;

  decompress(): Promise<Buffer>;

  getLocalHeaderSize(): number;

  isDirectory(): boolean;

  getName(): string;

  getPath(): string;
}
