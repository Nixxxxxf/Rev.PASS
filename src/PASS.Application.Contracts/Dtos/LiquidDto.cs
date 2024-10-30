using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class LiquidDto : EntityDto<Guid>
    {
        public Guid LiquidCategoryId { get; set; }
        public LiquidCategoryDto? LiquidCategoryFk { get; set; }
        public float? Volume { get; set; }
        public float? Concentration { get; set; }
        public float? Result { get; set; }
        public bool IsUsed { get; set; }
        public int Count { get; set; }


    }
}
