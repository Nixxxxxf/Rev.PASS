using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class PlateTransferHistoryDto : CreationAuditedEntityDto<Guid>
    {
        public Guid PlateId { get; set; }
        public PlateDto? PlateFk { get; set; }

        public Guid InstrumentId { get; set; }
        public InstrumentDto? InstrumentFk { get; set; }

        public string? Direction { get; set; }

        public TimeSpan? AssayTime { get; set; }
        public DateTime? TransferTime { get; set; }
        public string? Comments { get; set; }
    }
}
