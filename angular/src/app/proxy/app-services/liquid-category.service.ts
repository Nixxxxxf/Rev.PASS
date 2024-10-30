import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LiquidCategoryDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class LiquidCategoryService {
  apiName = 'Default';
  

  create = (input: LiquidCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidCategoryDto>({
      method: 'POST',
      url: '/api/app/liquid-category',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/liquid-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidCategoryDto>({
      method: 'GET',
      url: `/api/app/liquid-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCompoundList = (compoundName: string, smiles: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LiquidCategoryDto>>({
      method: 'GET',
      url: '/api/app/liquid-category/compound-list',
      params: { compoundName, smiles, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LiquidCategoryDto>>({
      method: 'GET',
      url: '/api/app/liquid-category',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: LiquidCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidCategoryDto>({
      method: 'PUT',
      url: `/api/app/liquid-category/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
