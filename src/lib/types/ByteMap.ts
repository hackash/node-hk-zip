import { ICentralDirByteMap } from '../interfaces/CentralDirByteMapType';
import { IEndOfCentralDirByteMap } from '../interfaces/EndOfCentralDirByteMap';
import { ILocalFileByteMap } from '../interfaces/LocalFileByteMapType';
import { IDataDescriptorByteMap } from '../interfaces/DataDescriptorByteMapType';

export type TByteMap = ICentralDirByteMap | IEndOfCentralDirByteMap | ILocalFileByteMap | IDataDescriptorByteMap;
