using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class KMeansInputDto : EntityDto<Guid>
    {
        public int? Clusters { get; set; }
        public List<LiquidPositionInPlateDto>? Data { get; set; }
        public string? ControlWell { get; set; }
    }
}
