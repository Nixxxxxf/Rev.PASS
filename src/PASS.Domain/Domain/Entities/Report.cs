using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace PASS.Domain.Entities
{
    public class Report : CreationAuditedEntity<Guid>
    {
        public string? ReportType { get; set; }
        public string? ReportName { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<ReportItem>? ReportItemsList { get; set; }
        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
