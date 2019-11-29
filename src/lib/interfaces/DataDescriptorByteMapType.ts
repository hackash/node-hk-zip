import { BaseByteMap } from './BaseByteMap';

export interface IParsedDataDescriptor {
  CRC: number
  COMPRESSED_SIZE: number
  UNCOMPRESSED_SIZE: number
}

export interface IDataDescriptorByteMap extends IParsedDataDescriptor, BaseByteMap {}
