using PASS.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class LiquidCategoryDto : EntityDto<Guid>
    {
        public string? Name { get; set; }
        public string? SMILES { get; set; }
        public LiquidType LiquidType { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<LiquidAttributeDto>? LiquidAttributeList { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<LiquidDto>? LiquidList { get; set; }

    }
}
