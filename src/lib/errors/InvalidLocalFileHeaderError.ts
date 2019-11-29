import { ERROR_CODES, ZipError } from './ZipError';

const message = 'Invalid Local File header';
const name = 'INVALID_LOCAL_FILE_HEADER';
const code = ERROR_CODES.INVALID_LOCAL_FILE_HEADER;

export class InvalidLocalFileHeaderError extends ZipError {
  constructor() {
    super(message, code, name);
  }
}
