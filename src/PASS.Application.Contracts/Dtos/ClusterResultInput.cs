using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PASS.Dtos
{
    public class ClusterResultInput
    {
        public string? PlateName { get; set; }
        public string? WellName { get; set; }
        public int? Cluster { get; set; }
    }
}
