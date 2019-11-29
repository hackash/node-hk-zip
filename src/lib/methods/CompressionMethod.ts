export abstract class CompressionMethod {
  protected readonly data: Buffer;

  constructor(data: Buffer) {
    this.data = data;
  }

  abstract decompress(): Promise<Buffer>;
}
