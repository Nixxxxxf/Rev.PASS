import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PlateDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class PlateService {
  apiName = 'Default';
  

  create = (input: PlateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlateDto>({
      method: 'POST',
      url: '/api/app/plate',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/plate/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlateDto>({
      method: 'GET',
      url: `/api/app/plate/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PlateDto>>({
      method: 'GET',
      url: '/api/app/plate',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListWithFilter = (plateName: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PlateDto>>({
      method: 'GET',
      url: '/api/app/plate/with-filter',
      params: { plateName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: PlateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlateDto>({
      method: 'PUT',
      url: `/api/app/plate/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
