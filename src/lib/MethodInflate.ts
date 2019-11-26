import zlb from 'zlib';

export class MethodInflate {
  private readonly data: Buffer;

  constructor(data: Buffer) {
    this.data = data;
  }

  public start(): Promise<Buffer> {
    const inflate = zlb.createInflateRaw();
    return new Promise((resolve, reject) => {
      inflate.on('data', (data) => {
        resolve(data);
      });

      inflate.on('error', (e) => {
        reject(e);
      });

      inflate.end(this.data);
    });
  }
}
