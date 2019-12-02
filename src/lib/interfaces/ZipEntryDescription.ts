/**
 *  @fileOverview Definition of ZipEntryDescription interface
 */


/**
 * @interface ZipEntryDescription - Specifies fields for method describe in ZipEntry class
 */
export interface ZipEntryDescription {
  isDirectory: boolean;
  name: string;
  path: string;
}
