import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CsvHeaderDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class CsvHeaderService {
  apiName = 'Default';
  

  create = (input: CsvHeaderDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CsvHeaderDto>({
      method: 'POST',
      url: '/api/app/csv-header',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/csv-header/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CsvHeaderDto>({
      method: 'GET',
      url: `/api/app/csv-header/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllCsvFileName = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, string[]>({
      method: 'GET',
      url: '/api/app/csv-header/csv-file-name',
    },
    { apiName: this.apiName,...config });
  

  getCsvHeadersByCsvFileName = (csvFileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CsvHeaderDto[]>({
      method: 'GET',
      url: '/api/app/csv-header/csv-headers',
      params: { csvFileName },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CsvHeaderDto>>({
      method: 'GET',
      url: '/api/app/csv-header',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListWithFilter = (csvName: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CsvHeaderDto>>({
      method: 'GET',
      url: '/api/app/csv-header/with-filter',
      params: { csvName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CsvHeaderDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CsvHeaderDto>({
      method: 'PUT',
      url: `/api/app/csv-header/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
