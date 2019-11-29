export class ZipError extends Error {
  public code: number;
  public name: string;

  constructor(message: string, code: number, name) {
    super(message);
    this.code = code;
    this.name = name;
  }
}

export enum ERROR_CODES {
  INVALID_CENTRAL_DIR_HEADER = 4000,
  INVALID_DATA_DESCRIPTOR_HEADER,
  INVALID_END_OF_CENTRAL_DIR_HEADER,
  INVALID_LOCAL_FILE_HEADER
}
