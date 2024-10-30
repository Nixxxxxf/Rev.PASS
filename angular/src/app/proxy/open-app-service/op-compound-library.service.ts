import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportLiquidPlateDto, ImportPlateCopyDto, ImportResultFileDto, InstrumentDto, LiquidAttributeDto, LiquidCategoryDto, LiquidDto, LiquidPositionInPlateDto, LiquidTransferHistoryDto, PlateChildDto, PlateDto, PlateTransferHistoryDto, ReportItemDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class OpCompoundLibraryService {
  apiName = 'Default';
  

  cherryPickMixByTransferHistoryDto = (transferHistoryDto: LiquidTransferHistoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/cherry-pick-mix',
      body: transferHistoryDto,
    },
    { apiName: this.apiName,...config });
  

  cherryPickToEmptyByTransferHistoryDto = (transferHistoryDto: LiquidTransferHistoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/cherry-pick-to-empty',
      body: transferHistoryDto,
    },
    { apiName: this.apiName,...config });
  

  create = (input: LiquidDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidDto>({
      method: 'POST',
      url: '/api/app/op-compound-library',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/op-compound-library/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteLiquidPlateCombineByIdByLiquidPositionInPlateDto = (liquidPositionInPlateDto: LiquidPositionInPlateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'DELETE',
      responseType: 'text',
      url: '/api/app/op-compound-library/liquid-plate-combine-by-id',
      params: { liquidId: liquidPositionInPlateDto.liquidId, ["LiquidFk.LiquidCategoryId"]: liquidPositionInPlateDto.liquidFk.liquidCategoryId, ["LiquidFk.LiquidCategoryFk.Name"]: liquidPositionInPlateDto.liquidFk.liquidCategoryFk.name, ["LiquidFk.LiquidCategoryFk.SMILES"]: liquidPositionInPlateDto.liquidFk.liquidCategoryFk.smiles, ["LiquidFk.LiquidCategoryFk.LiquidType"]: liquidPositionInPlateDto.liquidFk.liquidCategoryFk.liquidType, ["LiquidFk.LiquidCategoryFk.LiquidAttributeList"]: liquidPositionInPlateDto.liquidFk.liquidCategoryFk.liquidAttributeList, ["LiquidFk.LiquidCategoryFk.LiquidList"]: liquidPositionInPlateDto.liquidFk.liquidCategoryFk.liquidList, ["LiquidFk.LiquidCategoryFk.Id"]: liquidPositionInPlateDto.liquidFk.liquidCategoryFk.id, ["LiquidFk.Volume"]: liquidPositionInPlateDto.liquidFk.volume, ["LiquidFk.Concentration"]: liquidPositionInPlateDto.liquidFk.concentration, ["LiquidFk.Result"]: liquidPositionInPlateDto.liquidFk.result, ["LiquidFk.IsUsed"]: liquidPositionInPlateDto.liquidFk.isUsed, ["LiquidFk.Count"]: liquidPositionInPlateDto.liquidFk.count, ["LiquidFk.Id"]: liquidPositionInPlateDto.liquidFk.id, plateChildId: liquidPositionInPlateDto.plateChildId, ["PlateChildFk.PlateId"]: liquidPositionInPlateDto.plateChildFk.plateId, ["PlateChildFk.PlateFk.Name"]: liquidPositionInPlateDto.plateChildFk.plateFk.name, ["PlateChildFk.PlateFk.Description"]: liquidPositionInPlateDto.plateChildFk.plateFk.description, ["PlateChildFk.PlateFk.PlateType"]: liquidPositionInPlateDto.plateChildFk.plateFk.plateType, ["PlateChildFk.PlateFk.PlateSize"]: liquidPositionInPlateDto.plateChildFk.plateFk.plateSize, ["PlateChildFk.PlateFk.PlateChildrenList"]: liquidPositionInPlateDto.plateChildFk.plateFk.plateChildrenList, ["PlateChildFk.PlateFk.Id"]: liquidPositionInPlateDto.plateChildFk.plateFk.id, ["PlateChildFk.Row"]: liquidPositionInPlateDto.plateChildFk.row, ["PlateChildFk.Column"]: liquidPositionInPlateDto.plateChildFk.column, ["PlateChildFk.Id"]: liquidPositionInPlateDto.plateChildFk.id, id: liquidPositionInPlateDto.id },
    },
    { apiName: this.apiName,...config });
  

  findInstrumentByInstrumentDto = (instrumentDto: InstrumentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/find-instrument',
      body: instrumentDto,
    },
    { apiName: this.apiName,...config });
  

  findLiquidByPlateChildDto = (plateChildDto: PlateChildDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/find-liquid',
      body: plateChildDto,
    },
    { apiName: this.apiName,...config });
  

  findPlateByPlateDto = (plateDto: PlateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/find-plate',
      body: plateDto,
    },
    { apiName: this.apiName,...config });
  

  findPlateChildByPlateChildDto = (plateChildDto: PlateChildDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/find-plate-child',
      body: plateChildDto,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidDto>({
      method: 'GET',
      url: `/api/app/op-compound-library/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LiquidDto>>({
      method: 'GET',
      url: '/api/app/op-compound-library',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importCellPlateByLiquidPlateLst = (liquidPlateLst: ImportLiquidPlateDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/import-cell-plate',
      body: liquidPlateLst,
    },
    { apiName: this.apiName,...config });
  

  importCherryPickMixByPickLst = (pickLst: LiquidTransferHistoryDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/import-cherry-pick-mix',
      body: pickLst,
    },
    { apiName: this.apiName,...config });
  

  importCompoundLibraryByLiquidPlateLst = (liquidPlateLst: ImportLiquidPlateDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/import-compound-library',
      body: liquidPlateLst,
    },
    { apiName: this.apiName,...config });
  

  importDMSOPlateByLiquidPlateLst = (liquidPlateLst: ImportLiquidPlateDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/import-dMSOPlate',
      body: liquidPlateLst,
    },
    { apiName: this.apiName,...config });
  

  importEchoReportItemListByReportNameAndReportTypeAndReportItemList = (reportName: string, reportType: string, reportItemList: ReportItemDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/import-echo-report-item-list',
      params: { reportName, reportType },
      body: reportItemList,
    },
    { apiName: this.apiName,...config });
  

  importPlateCopyByPltLst = (pltLst: ImportPlateCopyDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/import-plate-copy',
      body: pltLst,
    },
    { apiName: this.apiName,...config });
  

  importPlateTransferByPlateTrans = (plateTrans: PlateTransferHistoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/import-plate-transfer',
      body: plateTrans,
    },
    { apiName: this.apiName,...config });
  

  importResultFileByPltLst = (pltLst: ImportResultFileDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/import-result-file',
      body: pltLst,
    },
    { apiName: this.apiName,...config });
  

  insertEchoReportByReportNameAndReportType = (reportName: string, reportType: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/echo-report',
      params: { reportName, reportType },
    },
    { apiName: this.apiName,...config });
  

  insertEchoReportItemByReportNameAndReportTypeAndReportItemList = (reportName: string, reportType: string, reportItemList: ReportItemDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/echo-report-item',
      params: { reportName, reportType },
      body: reportItemList,
    },
    { apiName: this.apiName,...config });
  

  insertInstrumentByInstrumentDto = (instrumentDto: InstrumentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/instrument',
      body: instrumentDto,
    },
    { apiName: this.apiName,...config });
  

  insertLiquidAndCombineWithPlateByLiquidPositionInPlateDto = (liquidPositionInPlateDto: LiquidPositionInPlateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/liquid-and-combine-with-plate',
      body: liquidPositionInPlateDto,
    },
    { apiName: this.apiName,...config });
  

  insertLiquidAndCombineWithPlateListByLiquidPositionInPlateDtoLst = (liquidPositionInPlateDtoLst: LiquidPositionInPlateDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/liquid-and-combine-with-plate-list',
      body: liquidPositionInPlateDtoLst,
    },
    { apiName: this.apiName,...config });
  

  insertLiquidByLiquidDto = (liquidDto: LiquidDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/liquid',
      body: liquidDto,
    },
    { apiName: this.apiName,...config });
  

  insertLiquidCategoryByLiquidCategoryDto = (liquidCategoryDto: LiquidCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/liquid-category',
      body: liquidCategoryDto,
    },
    { apiName: this.apiName,...config });
  

  insertLiquidCategoryListByLiquidCategoryDtoList = (liquidCategoryDtoList: LiquidCategoryDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/liquid-category-list',
      body: liquidCategoryDtoList,
    },
    { apiName: this.apiName,...config });
  

  insertLiquidCategoryListNewByLiquidCategoryDtoLst = (liquidCategoryDtoLst: LiquidCategoryDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/liquid-category-list-new',
      body: liquidCategoryDtoLst,
    },
    { apiName: this.apiName,...config });
  

  insertLiquidPositionInPlateByLiquidPositionInPlateDto = (liquidPositionInPlateDto: LiquidPositionInPlateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/liquid-position-in-plate',
      body: liquidPositionInPlateDto,
    },
    { apiName: this.apiName,...config });
  

  insertOrUpdateLiquidAttributeByLiquidAttributeDto = (liquidAttributeDto: LiquidAttributeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/or-update-liquid-attribute',
      body: liquidAttributeDto,
    },
    { apiName: this.apiName,...config });
  

  insertPlateByPlateDto = (plateDto: PlateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/plate',
      body: plateDto,
    },
    { apiName: this.apiName,...config });
  

  insertPlateChildrenByPlateDto = (plateDto: PlateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/plate-children',
      body: plateDto,
    },
    { apiName: this.apiName,...config });
  

  insertPlateListByPlateDtoLst = (plateDtoLst: PlateDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-compound-library/plate-list',
      body: plateDtoLst,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: LiquidDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidDto>({
      method: 'PUT',
      url: `/api/app/op-compound-library/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateLiquidResultByResultFileDtoLst = (resultFileDtoLst: ImportResultFileDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'PUT',
      responseType: 'text',
      url: '/api/app/op-compound-library/liquid-result',
      body: resultFileDtoLst,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
