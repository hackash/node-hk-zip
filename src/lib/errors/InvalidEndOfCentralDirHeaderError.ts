/**
 *  @fileOverview Definition of InvalidEndOfCentralDirHeaderError class
 */

import { ERROR_CODES, ZipError } from './ZipError';

const message = 'Invalid End Of Central Dir header';
const name = 'INVALID_END_OF_CENTRAL_DIR_HEADER';
const code = ERROR_CODES.INVALID_END_OF_CENTRAL_DIR_HEADER;

/**
 * Class representing a InvalidEndOfCentralDirHeaderError
 * @extends ZipError
 */
export class InvalidEndOfCentralDirHeaderError extends ZipError {
  constructor() {
    super(message, code, name);
  }
}
