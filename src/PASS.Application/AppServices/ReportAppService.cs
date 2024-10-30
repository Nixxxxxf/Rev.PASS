using AutoMapper.Internal.Mappers;
using PASS.Domain.Entities;
using PASS.Dtos;
using PASS.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace PASS.AppServices
{
    public class ReportAppService :
        CrudAppService<ReportItem,
            ReportItemDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        IReportItemAppService
    {
        public readonly IRepository<Report, Guid> _reportRepository;
        public readonly IRepository<ReportItem, Guid> _reportItemRepository;

        public ReportAppService(
           IRepository<Report, Guid> reportRepository,
           IRepository<ReportItem, Guid> reportItemRepository)
           : base(reportItemRepository)
        {
            _reportRepository = reportRepository;
            _reportItemRepository = reportItemRepository;
        }


        public override async Task<PagedResultDto<ReportItemDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            IQueryable<ReportItem> query3 = _reportItemRepository.WithDetailsAsync(x => x.ReportFk).Result;
            int totalCount = await base.AsyncExecuter.CountAsync(query3).ConfigureAwait(continueOnCapturedContext: false);
            List<ReportItemDto> items = new List<ReportItemDto>();
            if (totalCount > 0)
            {
                query3 = base.ApplySorting(query3, input);
                query3 = base.ApplyPaging(query3, input);
                items = ObjectMapper.Map<List<ReportItem>, List<ReportItemDto>>(query3.ToList());
            }
            return new PagedResultDto<ReportItemDto>(totalCount, items);

        }


        public async Task<PagedResultDto<ReportItemDto>> GetReportListAsync(string? reportType, string? reportName, PagedAndSortedResultRequestDto input)
        {

            IQueryable<ReportItem> query3 = (_reportItemRepository.WithDetailsAsync(x => x.ReportFk).Result)
                .WhereIf(!string.IsNullOrEmpty(reportType), x => x.ReportFk!.ReportType == reportType)
                .WhereIf(!string.IsNullOrEmpty(reportName), x => x.ReportFk!.ReportName == reportName);

            int totalCount = await base.AsyncExecuter.CountAsync(query3).ConfigureAwait(continueOnCapturedContext: false);
            List<ReportItemDto> items = new List<ReportItemDto>();
            if (totalCount > 0)
            {
                query3 = base.ApplySorting(query3, input);
                query3 = base.ApplyPaging(query3, input);
                items = ObjectMapper.Map<List<ReportItem>, List<ReportItemDto>>(query3.ToList());
            }
            return new PagedResultDto<ReportItemDto>(totalCount, items);

        }


        public async Task<List<ReportDto>> GetAllReportsAsync(string? reportType)
        {
            var lst = (await _reportRepository.GetListAsync()).WhereIf(!string.IsNullOrEmpty(reportType), x => x.ReportType == reportType).ToList();
            var result = ObjectMapper.Map<List<Report>, List<ReportDto>>(lst);
            return result;

        }
    }
}
