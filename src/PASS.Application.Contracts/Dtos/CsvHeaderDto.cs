using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class CsvHeaderDto : EntityDto<Guid>
    {
        public string? CsvName { get; set; }
        public string? HeaderName { get; set; }
        public string? ActualValue { get; set; }
    }
}
