/**
 *  @fileOverview Definition of IParsedEndOfCentralDir and IEndOfCentralDirByteMap interfaces
 */

import { IBaseByteMap } from './BaseByteMap';

/**
 * @interface IParsedEndOfCentralDir - Specifies Fields for ParsedEndOfCentralDir
 */
export interface IParsedEndOfCentralDir {
  NUMBER_OF_ENTRIES: number;
  TOTAL_NUMBER_OF_ENTRIES: number;
  CENTRAL_DIR_SIZE: number;
  CENTRAL_DIR_OFFSET: number;
  COMMENT_LENGTH: number;
}

/**
 * @interface IParsedEndOfCentralDir - Specifies Fields for EndOfCentralDirByteMap
 */
export interface IEndOfCentralDirByteMap
  extends IParsedEndOfCentralDir,
    IBaseByteMap {}
