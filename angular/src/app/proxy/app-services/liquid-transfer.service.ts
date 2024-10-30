import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LiquidTransferHistoryDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class LiquidTransferService {
  apiName = 'Default';
  

  create = (input: LiquidTransferHistoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidTransferHistoryDto>({
      method: 'POST',
      url: '/api/app/liquid-transfer',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/liquid-transfer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidTransferHistoryDto>({
      method: 'GET',
      url: `/api/app/liquid-transfer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LiquidTransferHistoryDto>>({
      method: 'GET',
      url: '/api/app/liquid-transfer',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListWithFilter = (srPlateName: string, dsPlateName: string, srLiquidName: string, dsLiquidName: string, fnLiquidName: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LiquidTransferHistoryDto>>({
      method: 'GET',
      url: '/api/app/liquid-transfer/with-filter',
      params: { srPlateName, dsPlateName, srLiquidName, dsLiquidName, fnLiquidName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: LiquidTransferHistoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidTransferHistoryDto>({
      method: 'PUT',
      url: `/api/app/liquid-transfer/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
