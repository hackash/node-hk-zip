import { ERROR_CODES, ZipError } from './ZipError';

const message = 'Unsupported Compression';
const name = 'UNSUPPORTED_COMPRESSION';
const code = ERROR_CODES.UNSUPPORTED_COMPRESSION;

export class UnsupportedCompressionError extends ZipError {
  constructor() {
    super(message, code, name);
  }
}
