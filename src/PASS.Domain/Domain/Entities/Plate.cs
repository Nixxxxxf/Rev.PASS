using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace PASS.Domain.Entities
{
    public class Plate : Entity<Guid>
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? PlateType { get; set; }
        public int PlateSize { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<PlateChild>? PlateChildrenList { get; set; }
        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
