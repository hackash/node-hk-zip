/**
 *  @fileOverview Definition of ZipEntryDescription interface
 */


/**
 * @interface IZipEntryDescription - Specifies fields for method describe in ZipEntry class
 */
export interface IZipEntryDescription {
  isDirectory: boolean;
  name: string;
  path: string;
}
