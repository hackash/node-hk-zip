/**
 *  @fileOverview Definition of IParsedLocalFile and ILocalFileByteMap interfaces
 */

import { IBaseByteMap } from './BaseByteMap';

/**
 * @interface IParsedLocalFile - Specifies Fields for ParsedLocalFileHeader
 */
export interface IParsedLocalFile {
  COMPRESSION_METHOD: number;
  VERSION: number;
  MODIFICATION_TIME: number;
  MODIFICATION_DATE: number;
  GENERAL_BIT_FLAG: number;
  CRC: number;
  COMPRESSED_SIZE: number;
  UNCOMPRESSED_SIZE: number;
  FILENAME_LENGTH: number;
  EXTRA_FIELD_LENGTH: number;
}

/**
 * @interface ILocalFileByteMap - Specifies Fields for LocalFileByteMap
 */
export interface ILocalFileByteMap extends IParsedLocalFile, IBaseByteMap {}
