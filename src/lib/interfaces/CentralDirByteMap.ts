/**
 *  @fileOverview Definition of IParsedCentralDir and ICentralDirByteMap interfaces
 */

import { IBaseByteMap } from './BaseByteMap';

/**
 * @interface IParsedCentralDir - Specifies Fields for ParsedCentralDir
 */
export interface IParsedCentralDir {
  VERSION_MADE: number,
  VERSION_EXTRACT: number,
  FLAGS: number,
  METHOD: number,
  TIME: number,
  DATE: number,
  CRC: number,
  COMPRESSED_SIZE: number,
  DECOMPRESSED_SIZE: number,
  FILENAME_LENGTH: number,
  EXTRA_FIELD_LENGTH: number,
  COMMENT_LENGTH: number,
  DISK_START: number,
  INTERNAL_ATTRIBUTES: number,
  EXTERNAL_ATTRIBUTES: number,
  OFFSET: number
}

/**
 * @interface ICentralDirByteMap - Specifies Fields for CentralDirByteMap
 */
export interface ICentralDirByteMap extends IParsedCentralDir, IBaseByteMap {}
