using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class InstrumentDto : EntityDto<Guid>
    {
        public string? Name { get; set; }
        public float? Component { get; set; }
        public bool? IsUsed { get; set; }
        public string? Description { get; set; }
    }
}
