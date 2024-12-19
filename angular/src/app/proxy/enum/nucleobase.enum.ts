import { mapEnumToOptions } from '@abp/ng.core';

export enum Nucleobase {
  None = 0,
  A = 1,
  T = 2,
  G = 3,
  C = 4,
}

export const nucleobaseOptions = mapEnumToOptions(Nucleobase);
