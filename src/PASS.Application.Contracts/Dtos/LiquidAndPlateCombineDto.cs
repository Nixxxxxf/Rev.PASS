using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class LiquidAndPlateCombineDto : EntityDto<Guid>
    {

        public string? SourcePlate { get; set; }
        public string? SourceRow { get; set; }
        public int? SourceColumn { get; set; }

        public string? DestPlate { get; set; }
        public string? DestRow { get; set; }
        public int? DestColumn { get; set; }

        public float? TransVolume { get; set; }


        public PlateChildDto? SourcePlateChild { get; set; }
        public PlateChildDto? DestPlateChild { get; set; }
    }
}
