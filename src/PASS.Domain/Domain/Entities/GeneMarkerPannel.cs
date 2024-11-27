using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace PASS.Domain.Entities
{
    public class GeneMarkerPannel : Entity<Guid>
    {
        public required string Name { get; set; }
        public List<LiquidCategory>? MarkerList { get; set; }
        public string? Description { get; set; }
        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
