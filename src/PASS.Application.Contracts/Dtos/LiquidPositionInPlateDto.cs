using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class LiquidPositionInPlateDto : EntityDto<Guid>
    {
        public Guid LiquidId { get; set; }

        public LiquidDto? LiquidFk { get; set; }

        public Guid PlateChildId { get; set; }

        public PlateChildDto? PlateChildFk { get; set; }
    }
}
