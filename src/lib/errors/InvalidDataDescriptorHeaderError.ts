import { ERROR_CODES, ZipError } from './ZipError';

const message = 'Invalid Data Descriptor header';
const name = 'INVALID_DATA_DESCRIPTOR_HEADER';
const code = ERROR_CODES.INVALID_DATA_DESCRIPTOR_HEADER;

export class InvalidDataDescriptorHeaderError extends ZipError {
  constructor() {
    super(message, code, name);
  }
}
