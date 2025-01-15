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
        public float? FAM { get; set; }
        public float? HEX { get; set; }
        public float? ROX { get; set; }
        public bool IsUsed { get; set; }
        public int Count { get; set; }

        // K-mean, python return
        public int Cluster { get; set; }
        public float X { get; set; }
        public float Y { get; set; }


    }
}
