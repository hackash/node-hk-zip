import { IBaseByteMap } from '../interfaces/BaseByteMap';

export class HeaderMap<T extends IBaseByteMap> {
  protected readonly data: Buffer;
  protected readonly map: T;

  constructor(map: T, input: Buffer, offset) {
    this.map = map;
    this.data = input.slice(offset, offset + this.map.SIZE);
  }

  protected isValidHeaderData(): boolean {
    const signature = this.data.readUInt32LE(0);
    return this.data.length === this.map.SIZE && signature === this.map.SIGNATURE;
  }
}
