/**
 *  @fileOverview Definition of InvalidDataDescriptorHeaderError class
 */

import { ERROR_CODES, ZipError } from './ZipError';

const message = 'Invalid Data Descriptor header';
const name = 'INVALID_DATA_DESCRIPTOR_HEADER';
const code = ERROR_CODES.INVALID_DATA_DESCRIPTOR_HEADER;

/**
 * Class representing a InvalidDataDescriptorHeaderError
 * @extends ZipError
 */
export class InvalidDataDescriptorHeaderError extends ZipError {
  constructor() {
    super(message, code, name);
  }
}
