import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ProtocolDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class ProtocolService {
  apiName = 'Default';
  

  addNewProtocolByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/protocol/new-protocol',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  create = (input: ProtocolDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProtocolDto>({
      method: 'POST',
      url: '/api/app/protocol',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdateProtocolByPro = (pro: ProtocolDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/protocol/or-update-protocol',
      body: pro,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/protocol/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteProtocolByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/protocol/protocol',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProtocolDto>({
      method: 'GET',
      url: `/api/app/protocol/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllProtocolsForSelect = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProtocolDto[]>({
      method: 'GET',
      url: '/api/app/protocol/protocols-for-select',
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProtocolDto>>({
      method: 'GET',
      url: '/api/app/protocol',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListWithFilter = (proName: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProtocolDto>>({
      method: 'GET',
      url: '/api/app/protocol/with-filter',
      params: { proName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getProtocolByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProtocolDto[]>({
      method: 'GET',
      url: '/api/app/protocol/protocol',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: ProtocolDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProtocolDto>({
      method: 'PUT',
      url: `/api/app/protocol/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
