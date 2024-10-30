using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class PlateDto : EntityDto<Guid>
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? PlateType { get; set; }
        public int PlateSize { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<PlateChildDto>? PlateChildrenList { get; set; }
    }
}
