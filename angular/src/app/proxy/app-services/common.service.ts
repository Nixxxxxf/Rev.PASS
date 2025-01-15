import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { GeneTypingAlgorithmDto, InstrumentDto, LiquidCategoryDto, LiquidDto, PlateDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  apiName = 'Default';
  

  create = (input: LiquidDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidDto>({
      method: 'POST',
      url: '/api/app/common',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/common/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidDto>({
      method: 'GET',
      url: `/api/app/common/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllAlgorithms = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, GeneTypingAlgorithmDto[]>({
      method: 'GET',
      url: '/api/app/common/algorithms',
    },
    { apiName: this.apiName,...config });
  

  getAllCompounds = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, string[]>({
      method: 'GET',
      url: '/api/app/common/compounds',
    },
    { apiName: this.apiName,...config });
  

  getAllInstruments = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, InstrumentDto[]>({
      method: 'GET',
      url: '/api/app/common/instruments',
    },
    { apiName: this.apiName,...config });
  

  getAllLiquidCategories = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidCategoryDto[]>({
      method: 'GET',
      url: '/api/app/common/liquid-categories',
    },
    { apiName: this.apiName,...config });
  

  getAllMarkers = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, string[]>({
      method: 'GET',
      url: '/api/app/common/markers',
    },
    { apiName: this.apiName,...config });
  

  getAllPlates = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PlateDto[]>({
      method: 'GET',
      url: '/api/app/common/plates',
    },
    { apiName: this.apiName,...config });
  

  getAllSMILES = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, string[]>({
      method: 'GET',
      url: '/api/app/common/s-mILES',
    },
    { apiName: this.apiName,...config });
  

  getAllSamples = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, string[]>({
      method: 'GET',
      url: '/api/app/common/samples',
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LiquidDto>>({
      method: 'GET',
      url: '/api/app/common',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: LiquidDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LiquidDto>({
      method: 'PUT',
      url: `/api/app/common/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
