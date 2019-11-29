import { ERROR_CODES, ZipError } from './ZipError';

const message = 'Invalid Central Dir header';
const name = 'INVALID_CENTRAL_DIR_HEADER';
const code = ERROR_CODES.INVALID_CENTRAL_DIR_HEADER;

export class InvalidCentralDirHeaderError extends ZipError {
  constructor() {
    super(message, code, name);
  }
}
