import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LiquidPositionInPlateDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  apiName = 'Default';
  

  create = (input: LiquidPositionInPlateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidPositionInPlateDto>({
      method: 'POST',
      url: '/api/app/layout',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/layout/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidPositionInPlateDto>({
      method: 'GET',
      url: `/api/app/layout/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LiquidPositionInPlateDto>>({
      method: 'GET',
      url: '/api/app/layout',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getPlateDetailsForChart = (plateName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidPositionInPlateDto[]>({
      method: 'GET',
      url: '/api/app/layout/plate-details-for-chart',
      params: { plateName },
    },
    { apiName: this.apiName,...config });
  

  getPlateDetailsForTable = (plateName: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LiquidPositionInPlateDto>>({
      method: 'GET',
      url: '/api/app/layout/plate-details-for-table',
      params: { plateName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: LiquidPositionInPlateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidPositionInPlateDto>({
      method: 'PUT',
      url: `/api/app/layout/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
