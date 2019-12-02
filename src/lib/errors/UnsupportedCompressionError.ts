/**
 *  @fileOverview Definition of UnsupportedCompressionError class
 */

import { ERROR_CODES, ZipError } from './ZipError';

const message = 'Unsupported Compression';
const name = 'UNSUPPORTED_COMPRESSION';
const code = ERROR_CODES.UNSUPPORTED_COMPRESSION;

/**
 * Class representing a UnsupportedCompressionError
 * @extends ZipError
 */
export class UnsupportedCompressionError extends ZipError {
  constructor() {
    super(message, code, name);
  }
}
