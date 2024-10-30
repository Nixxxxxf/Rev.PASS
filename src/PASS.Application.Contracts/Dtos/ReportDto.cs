using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class ReportDto : CreationAuditedEntityDto<Guid>
    {

        public string? ReportType { get; set; }
        public string? ReportName { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<ReportItemDto>? ReportItemsList { get; set; }
    }
}
