import { BaseByteMap } from '../interfaces/BaseByteMap';

export class HeaderMap<T extends BaseByteMap> {
  protected readonly data: Buffer;
  protected readonly map: T;

  constructor(map: T, input: Buffer, offset) {
    this.data = input.slice(offset, offset + this.map.SIZE);
    this.map = map;
  }

  protected isValidHeaderData(): boolean {
    const signature = this.data.readUInt32LE(0);
    return this.data.length === this.map.SIZE && signature === this.map.SIGNATURE;
  }
}
