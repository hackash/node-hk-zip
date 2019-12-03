/**
 *  @fileOverview Definition of IParsedDataDescriptor and IDataDescriptorByteMap interfaces
 */

import { IBaseByteMap } from './BaseByteMap';

/**
 * @interface IParsedDataDescriptor - Specifies Fields for ParsedDataDescriptor
 */
export interface IParsedDataDescriptor {
  CRC: number;
  COMPRESSED_SIZE: number;
  UNCOMPRESSED_SIZE: number;
}

/**
 * @interface IDataDescriptorByteMap - Specifies Fields for DataDescriptorByteMap
 */
export interface IDataDescriptorByteMap
  extends IParsedDataDescriptor,
    IBaseByteMap {}
