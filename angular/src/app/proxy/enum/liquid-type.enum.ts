import { mapEnumToOptions } from '@abp/ng.core';

export enum LiquidType {
  None = 0,
  Compound = 1,
  Cell = 2,
  CompoundCellMix = 3,
  DMSO = 4,
}

export const liquidTypeOptions = mapEnumToOptions(LiquidType);
