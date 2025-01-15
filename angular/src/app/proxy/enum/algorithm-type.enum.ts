import { mapEnumToOptions } from '@abp/ng.core';

export enum AlgorithmType {
  None = 0,
  Generic = 1,
  MachineLearning = 2,
  DeepLearning = 3,
}

export const algorithmTypeOptions = mapEnumToOptions(AlgorithmType);
