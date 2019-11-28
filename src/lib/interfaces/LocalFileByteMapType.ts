export interface IParsedLocalFile {
  COMPRESSION_METHOD: number,
  VERSION: number,
  MODIFICATION_TIME: number,
  MODIFICATION_DATE: number,
  GENERAL_BIT_FLAG: number,
  CRC: number,
  COMPRESSED_SIZE: number,
  UNCOMPRESSED_SIZE: number,
  FILENAME_LENGTH: number,
  EXTRA_FIELD_LENGTH: number
}

export interface ILocalFileByteMap extends IParsedLocalFile {
  SIZE: number,
  SIGNATURE: number
}
