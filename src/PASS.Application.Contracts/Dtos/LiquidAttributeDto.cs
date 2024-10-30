using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class LiquidAttributeDto : EntityDto<Guid>
    {
        public Guid LiquidCategoryId { get; set; }
        public LiquidCategoryDto? LiquidCategoryFk { get; set; }
        public string? AttributeName { get; set; }
        public string? AttributeValue { get; set; }
    }
}
