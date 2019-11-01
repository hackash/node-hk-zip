import zlb from 'zlib';

export class MethodInflate {
  private readonly data: Buffer;

  constructor(data: Buffer) {
    this.data = data;
  }

  public inflate(callback: Function) {
    const inflate = zlb.createInflateRaw();

    inflate.on('data', (data) => {
      callback(data);
    });

    inflate.on('end', () => {
      console.log('end');
    });

    inflate.on('error', (e) => {
      console.log('error', e);
    });

    inflate.end(this.data);
  }
}
