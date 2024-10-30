import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PlateTransferHistoryDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class PlateTransferService {
  apiName = 'Default';
  

  create = (input: PlateTransferHistoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlateTransferHistoryDto>({
      method: 'POST',
      url: '/api/app/plate-transfer',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/plate-transfer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlateTransferHistoryDto>({
      method: 'GET',
      url: `/api/app/plate-transfer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PlateTransferHistoryDto>>({
      method: 'GET',
      url: '/api/app/plate-transfer',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListWithFilter = (plateName: string, intrumentName: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PlateTransferHistoryDto>>({
      method: 'GET',
      url: '/api/app/plate-transfer/with-filter',
      params: { plateName, intrumentName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: PlateTransferHistoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlateTransferHistoryDto>({
      method: 'PUT',
      url: `/api/app/plate-transfer/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
