/**
 *  @fileOverview Definition of ZipError class
 */

/**
 * Class representing a ZipError
 * @extends Error
 */
export class ZipError extends Error {
  public code: number;
  public name: string;

  /**
   * Creates a CentralDirectory object
   * @param {string} message - Error message
   * @param {number} code - Error code
   * @param {string} name - Error name
   * @return {ZipError} - ZipError object
   */
  constructor(message: string, code: number, name: string) {
    super(message);
    this.code = code;
    this.name = name;
  }
}

/**
 * Enum for Error Codes
 * @readonly
 * @enum {number}
 */
export enum ERROR_CODES {
  INVALID_CENTRAL_DIR_HEADER = 4000,
  INVALID_DATA_DESCRIPTOR_HEADER,
  INVALID_END_OF_CENTRAL_DIR_HEADER,
  INVALID_LOCAL_FILE_HEADER,
  UNSUPPORTED_COMPRESSION,
  INVALID_ZIP_FORMAT,
  INVALID_CRC_32
}
