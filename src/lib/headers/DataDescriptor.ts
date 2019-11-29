import { IDataDescriptorByteMap, IParsedDataDescriptor } from '../interfaces/DataDescriptorByteMapType';
import { InvalidDataDescriptorHeaderError } from '../errors/InvalidDataDescriptorHeaderError';
import { DATA_DESCRIPTOR_MAP } from '../ZipByteMap';
import { HeaderMap } from './HeaderMap';

export class DataDescriptor extends HeaderMap<IDataDescriptorByteMap> {
  private parsed: IParsedDataDescriptor;

  constructor(input: Buffer, offset: number) {
    super(DATA_DESCRIPTOR_MAP, input, offset);
    this.parsed = this.loadBinaryHeader();
  }

  private loadBinaryHeader(): IParsedDataDescriptor {
    if (!this.isValidHeaderData()) {
      throw new InvalidDataDescriptorHeaderError();
    }
    return {
      CRC: this.data.readUInt32LE(this.map.CRC),
      COMPRESSED_SIZE: this.data.readUInt32LE(this.map.COMPRESSED_SIZE),
      UNCOMPRESSED_SIZE: this.data.readUInt32LE(this.map.UNCOMPRESSED_SIZE)
    };
  }

  public getCRC32(): number {
    return this.parsed.CRC;
  }
}
