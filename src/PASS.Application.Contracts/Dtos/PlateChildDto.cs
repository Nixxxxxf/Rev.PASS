using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class PlateChildDto : EntityDto<Guid>
    {
        public Guid PlateId { get; set; }
        public PlateDto? PlateFk { get; set; }
        public string? Row { get; set; }
        public int Column { get; set; }
    }
}
