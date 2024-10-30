using PASS.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace PASS.Domain.Entities
{
    public class LiquidCategory : Entity<Guid>
    {
        public string? Name { get; set; }
        public string? SMILES { get; set; }
        public LiquidType LiquidType { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<LiquidAttribute>? LiquidAttributeList { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Liquid>? LiquidList { get; set; }
        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
