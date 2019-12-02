/**
 *  @fileOverview Definition of InvalidCRC32Error class
 */

import { ERROR_CODES, ZipError } from './ZipError';

const message = 'Invalid CRC32 checksum';
const name = 'INVALID_CRC_32';
const code = ERROR_CODES.INVALID_CRC_32;

/**
 * Class representing a InvalidCRC32Error
 * @extends ZipError
 */
export class InvalidCRC32Error extends ZipError {
  constructor() {
    super(message, code, name);
  }
}
