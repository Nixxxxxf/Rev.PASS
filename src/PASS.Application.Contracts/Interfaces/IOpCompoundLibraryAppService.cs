using PASS.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace PASS.Interfaces
{
    public interface IOpCompoundLibraryAppService :
        ICrudAppService<LiquidDto,
            Guid,
            PagedAndSortedResultRequestDto>
    {
        Task<string> ImportCherryPickMix(List<LiquidTransferHistoryDto> pickLst);
        Task<string> ImportPlateTransfer(PlateTransferHistoryDto plateTrans);
        Task<string> ImportEchoReportItemList(string reportName, string reportType, List<ReportItemDto> reportItemList);
    }
}
