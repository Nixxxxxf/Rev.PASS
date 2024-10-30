import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LiquidDto, LiquidPositionInPlateDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class LiquidService {
  apiName = 'Default';
  

  create = (input: LiquidDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidDto>({
      method: 'POST',
      url: '/api/app/liquid',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/liquid/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidDto>({
      method: 'GET',
      url: `/api/app/liquid/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getLiquidPositionInPlate = (plateName: string, liquidCategoryName: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LiquidPositionInPlateDto>>({
      method: 'GET',
      url: '/api/app/liquid/liquid-position-in-plate',
      params: { plateName, liquidCategoryName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LiquidDto>>({
      method: 'GET',
      url: '/api/app/liquid',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: LiquidDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidDto>({
      method: 'PUT',
      url: `/api/app/liquid/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
