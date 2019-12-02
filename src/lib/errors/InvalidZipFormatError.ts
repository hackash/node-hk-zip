/**
 *  @fileOverview Definition of InvalidZipFormatError class
 */

import { ERROR_CODES, ZipError } from './ZipError';

const message = 'Invalid Zip format';
const name = 'INVALID_ZIP_FORMAT';
const code = ERROR_CODES.INVALID_ZIP_FORMAT;

/**
 * Class representing a InvalidZipFormatError
 * @extends ZipError
 */
export class InvalidZipFormatError extends ZipError {
  constructor() {
    super(message, code, name);
  }
}
