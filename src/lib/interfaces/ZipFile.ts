/**
 *  @fileOverview Definition of IZipFile interface
 */

import { ZipEntry } from '../ZipEntry';

/**
 * @interface IZipFile - Specifies public methods of ZipFile class
 */
export interface IZipFile {
  listAllEntries(): Array<ZipEntry>;
  findEntries(paths: Array<string>): Array<ZipEntry>;
}
