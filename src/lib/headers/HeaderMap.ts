import { BaseByteMap } from '../interfaces/BaseByteMap';

export class HeaderMap<T extends BaseByteMap> {
  protected readonly data: Buffer;
  protected readonly map: T;

  constructor(map: T, data: Buffer) {
    this.map = map;
    this.data = data;
  }

  protected isValidHeaderData(): boolean {
    const signature = this.data.readUInt32LE(0);
    return this.data.length === this.map.SIZE && signature === this.map.SIGNATURE;
  }
}
