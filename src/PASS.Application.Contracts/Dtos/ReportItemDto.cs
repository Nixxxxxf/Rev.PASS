using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class ReportItemDto : CreationAuditedEntityDto<Guid>
    {
        public Guid ReportId { get; set; }
        [ForeignKey(nameof(ReportId))]
        public ReportDto? ReportFk { get; set; }

        #region for echo
        public DateTime? DateTimePoint { get; set; }
        public string? SourcePlateName { get; set; }
        public string? SourcePlateBarcode { get; set; }
        public string? SourcePlateType { get; set; }
        public string? SourceWell { get; set; }
        public string? DestinationPlateName { get; set; }
        public string? DestinationPlateBarcode { get; set; }
        public string? DestinationPlateType { get; set; }
        public string? DestinationWell { get; set; }
        public float? TransferVolumeNL { get; set; }
        public float? ActualVolumeNL { get; set; }
        public string? SampleID { get; set; }
        public string? SampleName { get; set; }
        public float? SurveyFluidVolumeUL { get; set; }
        public float? CurrentFluidVolumeUL { get; set; }
        public float? FluidComposition { get; set; }
        public string? FluidUnits { get; set; }
        public string? FluidType { get; set; }
        public string? TransferStatus { get; set; }
        #endregion
    }
}
