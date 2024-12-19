import type { CreationAuditedEntityDto, EntityDto } from '@abp/ng.core';
import type { Nucleobase } from '../enum/nucleobase.enum';
import type { LiquidType } from '../enum/liquid-type.enum';
import type { TransferType } from '../enum/transfer-type.enum';

export interface CsvHeaderDto extends EntityDto<string> {
  csvName?: string;
  headerName?: string;
  actualValue?: string;
}

export interface ImportLiquidPlateDto {
  plateName?: string;
  plateType?: string;
  row?: string;
  column: number;
  name?: string;
  volume?: number;
  concentration?: number;
  smiles?: string;
  geneFunction?: string;
  geneCDS?: string;
  geneDonors?: string;
  geneSequence?: string;
  geneStrand?: boolean;
  geneLocation?: number;
  markerID?: string;
  markerDescription?: string;
  primerList: string[];
  alleleOfFAM?: Nucleobase;
  alleleOfHEX?: Nucleobase;
}

export interface ImportPlateCopyDto {
  sourcePlateName?: string;
  destPlateName?: string;
}

export interface ImportResultFileDto {
  plateName?: string;
  row?: string;
  column: number;
  result?: number;
  liquidId?: string;
}

export interface InstrumentDto extends EntityDto<string> {
  name?: string;
  component?: number;
  isUsed?: boolean;
  description?: string;
}

export interface LiquidAttributeDto extends EntityDto<string> {
  liquidCategoryId?: string;
  liquidCategoryFk: LiquidCategoryDto;
  attributeName?: string;
  attributeValue?: string;
}

export interface LiquidCategoryDto extends EntityDto<string> {
  name?: string;
  smiles?: string;
  geneFunction?: string;
  geneCDS?: string;
  geneDonors?: string;
  geneSequence?: string;
  geneStrand?: boolean;
  geneLocation?: number;
  markerID?: string;
  markerDescription?: string;
  primerList: string[];
  alleleOfFAM: Nucleobase;
  alleleOfHEX: Nucleobase;
  liquidType: LiquidType;
  liquidAttributeList: LiquidAttributeDto[];
  liquidList: LiquidDto[];
}

export interface LiquidDto extends EntityDto<string> {
  liquidCategoryId?: string;
  liquidCategoryFk: LiquidCategoryDto;
  volume?: number;
  concentration?: number;
  result?: number;
  isUsed: boolean;
  count: number;
}

export interface LiquidPositionInPlateDto extends EntityDto<string> {
  liquidId?: string;
  liquidFk: LiquidDto;
  plateChildId?: string;
  plateChildFk: PlateChildDto;
}

export interface LiquidTransferHistoryDto extends CreationAuditedEntityDto<string> {
  transferType: TransferType;
  sourceLiquidId?: string;
  sourceLiquidFk: LiquidDto;
  destinationLiquidId?: string;
  destinationLiquidFk: LiquidDto;
  finalLiquidId?: string;
  finalLiquidFk: LiquidDto;
  sourcePlateChildId?: string;
  sourcePlateChildFk: PlateChildDto;
  destinationPlateChildId?: string;
  destinationPlateChildFk: PlateChildDto;
  transferVolume?: number;
  instrumentId?: string;
  instrumentFk: InstrumentDto;
  result?: number;
  comments?: string;
}

export interface PlateChildDto extends EntityDto<string> {
  plateId?: string;
  plateFk: PlateDto;
  row?: string;
  column: number;
}

export interface PlateDto extends EntityDto<string> {
  name?: string;
  description?: string;
  plateType?: string;
  plateSize: number;
  plateChildrenList: PlateChildDto[];
}

export interface PlateTransferHistoryDto extends CreationAuditedEntityDto<string> {
  plateId?: string;
  plateFk: PlateDto;
  instrumentId?: string;
  instrumentFk: InstrumentDto;
  direction?: string;
  assayTime?: string;
  transferTime?: string;
  comments?: string;
}

export interface ReportDto extends CreationAuditedEntityDto<string> {
  reportType?: string;
  reportName?: string;
  reportItemsList: ReportItemDto[];
}

export interface ReportItemDto extends CreationAuditedEntityDto<string> {
  reportId?: string;
  reportFk: ReportDto;
  dateTimePoint?: string;
  sourcePlateName?: string;
  sourcePlateBarcode?: string;
  sourcePlateType?: string;
  sourceWell?: string;
  destinationPlateName?: string;
  destinationPlateBarcode?: string;
  destinationPlateType?: string;
  destinationWell?: string;
  transferVolumeNL?: number;
  actualVolumeNL?: number;
  sampleID?: string;
  sampleName?: string;
  surveyFluidVolumeUL?: number;
  currentFluidVolumeUL?: number;
  fluidComposition?: number;
  fluidUnits?: string;
  fluidType?: string;
  transferStatus?: string;
}
