import { IBaseByteMap } from './BaseByteMap';

export interface IParsedEndOfCentralDir {
  NUMBER_OF_ENTRIES: number,
  TOTAL_NUMBER_OF_ENTRIES: number,
  CENTRAL_DIR_SIZE: number,
  CENTRAL_DIR_OFFSET: number,
  COMMENT_LENGTH: number
}

export interface IEndOfCentralDirByteMap extends IParsedEndOfCentralDir, IBaseByteMap {}
