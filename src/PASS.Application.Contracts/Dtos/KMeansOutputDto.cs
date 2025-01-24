using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class KMeansOutputDto : EntityDto<Guid>
    {
        public List<string>? WellNames { get; set; }
        public List<float>? X { get; set; }
        public List<float>? Y { get; set; }
        public List<int>? ClusterLabels { get; set; }
        public int? Clusters { get; set; }
        public string? ControlWell { get; set; }
    }
}
