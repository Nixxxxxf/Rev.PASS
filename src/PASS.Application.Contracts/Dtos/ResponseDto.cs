using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class ResponseDto
    {
        public int ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public EntityDto? EntityDto { get; set; }

    }




    public class ResponseForLiquidCategoryDto
    {
        public int ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public LiquidCategoryDto? EntityDto { get; set; }
    }

    public class ResponseForLiquidDto
    {
        public int ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public LiquidDto? EntityDto { get; set; }
    }

    public class ResponseForPlateDto
    {
        public int ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public PlateDto? EntityDto { get; set; }
    }

    public class ResponseForPlateChildDto
    {
        public int ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public PlateChildDto? EntityDto { get; set; }
    }


    public class ResponseForLiquidPositionInPlateDto
    {
        public int ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public LiquidPositionInPlateDto? EntityDto { get; set; }
    }


    public class ResponseForInstrumentDto
    {
        public int ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public InstrumentDto? EntityDto { get; set; }
    }

    public class ResponseForTransferHistoryDto
    {
        public int ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public LiquidTransferHistoryDto? EntityDto { get; set; }
    }

    public class ResponseForReportDto
    {
        public int ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public ReportDto? EntityDto { get; set; }
    }
}
