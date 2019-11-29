import { ERROR_CODES, ZipError } from './ZipError';

const message = 'Invalid Zip format';
const name = 'INVALID_ZIP_FORMAT';
const code = ERROR_CODES.INVALID_ZIP_FORMAT;

export class InvalidZipFormatError extends ZipError {
  constructor() {
    super(message, code, name);
  }
}
