import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { InstrumentDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class InstrumentService {
  apiName = 'Default';
  

  create = (input: InstrumentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, InstrumentDto>({
      method: 'POST',
      url: '/api/app/instrument',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/instrument/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, InstrumentDto>({
      method: 'GET',
      url: `/api/app/instrument/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<InstrumentDto>>({
      method: 'GET',
      url: '/api/app/instrument',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListWithFilter = (instName: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<InstrumentDto>>({
      method: 'GET',
      url: '/api/app/instrument/with-filter',
      params: { instName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: InstrumentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, InstrumentDto>({
      method: 'PUT',
      url: `/api/app/instrument/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
