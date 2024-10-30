import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LiquidTransferHistoryDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class OpTransferService {
  apiName = 'Default';
  

  create = (input: LiquidTransferHistoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidTransferHistoryDto>({
      method: 'POST',
      url: '/api/app/op-transfer',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/op-transfer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  findInstrumentByInstrumentName = (instrumentName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-transfer/find-instrument',
      params: { instrumentName },
    },
    { apiName: this.apiName,...config });
  

  findLiquidByLiquidName = (liquidName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-transfer/find-liquid',
      params: { liquidName },
    },
    { apiName: this.apiName,...config });
  

  findPlateChildByPlateNameAndWellName = (plateName: string, wellName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-transfer/find-plate-child',
      params: { plateName, wellName },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidTransferHistoryDto>({
      method: 'GET',
      url: `/api/app/op-transfer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LiquidTransferHistoryDto>>({
      method: 'GET',
      url: '/api/app/op-transfer',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  test = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/op-transfer/test',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: LiquidTransferHistoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidTransferHistoryDto>({
      method: 'PUT',
      url: `/api/app/op-transfer/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
