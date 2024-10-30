import { mapEnumToOptions } from '@abp/ng.core';

export enum TransferType {
  Transfer = 0,
  Mix = 1,
}

export const transferTypeOptions = mapEnumToOptions(TransferType);
