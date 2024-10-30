import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ReportDto, ReportItemDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  apiName = 'Default';
  

  create = (input: ReportItemDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ReportItemDto>({
      method: 'POST',
      url: '/api/app/report',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/report/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ReportItemDto>({
      method: 'GET',
      url: `/api/app/report/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllReports = (reportType: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ReportDto[]>({
      method: 'GET',
      url: '/api/app/report/reports',
      params: { reportType },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ReportItemDto>>({
      method: 'GET',
      url: '/api/app/report',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getReportList = (reportType: string, reportName: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ReportItemDto>>({
      method: 'GET',
      url: '/api/app/report/report-list',
      params: { reportType, reportName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: ReportItemDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ReportItemDto>({
      method: 'PUT',
      url: `/api/app/report/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
