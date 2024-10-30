using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace PASS.Domain.Entities
{
    public class CsvHeader : Entity<Guid>
    {
        public string? CsvName { get; set; }
        public string? HeaderName { get; set; }
        public string? ActualValue { get; set; }
        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
