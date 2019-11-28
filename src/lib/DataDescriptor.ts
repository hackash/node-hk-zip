import { DataDescriptorByteMapType } from './types/DataDescriptorByteMapType';
import { DATA_DESCRIPTOR_MAP } from './ZipByteMap';

export class DataDescriptor {
  private readonly data: Buffer;
  private readonly byteMap: DataDescriptorByteMapType = DATA_DESCRIPTOR_MAP;

  private parsed: any = {};

  constructor(input: Buffer, offset: number) {
    this.data = input.slice(offset, offset + this.byteMap.SIZE);
    this.parsed = this.loadBinaryHeader();
  }

  public loadBinaryHeader() {
    if (this.data.length !== this.byteMap.SIZE || this.data.readUInt32LE(0) !== this.byteMap.SIGNATURE) {
      throw new Error('Wrong data descriptor');
    }
    return {
      CRC: this.data.readUInt32LE(this.byteMap.CRC),
      SIZE: this.data.readUInt32LE(this.byteMap.COMPRESSED_SIZE),
      UNCOMPRESSED_SIZE: this.data.readUInt32LE(this.byteMap.UNCOMPRESSED_SIZE)
    };
  }

  public getCRC32(): number {
    return this.parsed.CRC;
  }
}
