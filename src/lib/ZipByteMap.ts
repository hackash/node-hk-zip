import { IDataDescriptorByteMap } from './interfaces/DataDescriptorByteMapType';
import { IEndOfCentralDirByteMap } from './interfaces/EndOfCentralDirByteMap';
import { ICentralDirByteMap } from './interfaces/CentralDirByteMapType';
import { ILocalFileByteMap } from './interfaces/LocalFileByteMapType';

export const LOCAL_FILE_HEADER_MAP: ILocalFileByteMap = {
  SIZE: 30, // Local file header size
  SIGNATURE: 0x04034b50, // Local file header signature
  VERSION: 4, // Version needed to extract
  GENERAL_BIT_FLAG: 6, // General purpose bit flag
  COMPRESSION_METHOD: 8, // Compression method
  MODIFICATION_TIME: 10, // Last mod file time
  MODIFICATION_DATE: 12, // Last mod file date
  CRC: 14, // CRC-32 value
  COMPRESSED_SIZE: 18, // Compressed size
  UNCOMPRESSED_SIZE: 22, // Uncompressed size
  FILENAME_LENGTH: 26, // Filename length
  EXTRA_FIELD_LENGTH: 28 // Extra field length
};

export const DATA_DESCRIPTOR_MAP: IDataDescriptorByteMap = {
  SIZE: 16, // Extended Local file header size
  SIGNATURE: 0x08074b50, // Extended Local file header signature (0x08074b50)
  CRC: 4, // CRC-32
  COMPRESSED_SIZE: 8, // Compressed size
  UNCOMPRESSED_SIZE: 12 // Uncompressed size
};

export const CENTRAL_DIR_MAP: ICentralDirByteMap = {
  SIZE: 46, // Central dir header size
  SIGNATURE: 0x02014b50, // Central file header signature
  VERSION_MADE: 4, // Version made by
  VERSION_EXTRACT: 6, // Version needed to extract
  FLAGS: 8, // General purpose bit flag
  METHOD: 10, // Compression method
  TIME: 12, // Modification time
  DATE: 14, // Modification date
  CRC: 16, // CRC-32 value
  COMPRESSED_SIZE: 20, // Compressed size
  DECOMPRESSED_SIZE: 24, // Uncompressed size
  FILENAME_LENGTH: 28, // Filename length
  EXTRA_FIELD_LENGTH: 30, // Extra field length
  COMMENT_LENGTH: 32, // File comment length
  DISK_START: 34, // Disk number start
  INTERNAL_ATTRIBUTES: 36, // Internal file attributes
  EXTERNAL_ATTRIBUTES: 38, // External file attributes (host system dependent)
  OFFSET: 42 // Relative offset of local header
};

export const END_OF_CENTRAL_DIR_MAP: IEndOfCentralDirByteMap = {
  SIZE: 22, // End of central dir header size
  SIGNATURE: 0x06054b50, // End of central dir signature
  NUMBER_OF_ENTRIES: 8, // Total number of entries in the central dir on this disk
  TOTAL_NUMBER_OF_ENTRIES: 10, // Total number of entries in the central dir
  CENTRAL_DIR_SIZE: 12, // Size of the central directory
  CENTRAL_DIR_OFFSET: 16, // Offset of start of central directory with respect to the starting disk number
  COMMENT_LENGTH: 20 // Zip file comment length
};
