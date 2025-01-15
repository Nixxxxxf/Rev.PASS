import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { GeneTypingAlgorithmDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class GeneTypingAlgorithmService {
  apiName = 'Default';
  

  create = (input: GeneTypingAlgorithmDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GeneTypingAlgorithmDto>({
      method: 'POST',
      url: '/api/app/gene-typing-algorithm',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/gene-typing-algorithm/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GeneTypingAlgorithmDto>({
      method: 'GET',
      url: `/api/app/gene-typing-algorithm/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<GeneTypingAlgorithmDto>>({
      method: 'GET',
      url: '/api/app/gene-typing-algorithm',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListWithFilter = (filter: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<GeneTypingAlgorithmDto>>({
      method: 'GET',
      url: '/api/app/gene-typing-algorithm/with-filter',
      params: { filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: GeneTypingAlgorithmDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GeneTypingAlgorithmDto>({
      method: 'PUT',
      url: `/api/app/gene-typing-algorithm/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
