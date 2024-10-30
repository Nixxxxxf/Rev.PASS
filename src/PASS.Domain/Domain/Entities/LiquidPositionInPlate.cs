using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace PASS.Domain.Entities
{
    public class LiquidPositionInPlate : Entity<Guid>
    {
        public Guid LiquidId { get; set; }
        [ForeignKey(nameof(LiquidId))]
        public Liquid? LiquidFk { get; set; }
        public Guid PlateChildId { get; set; }
        [ForeignKey(nameof(PlateChildId))]
        public PlateChild? PlateChildFk { get; set; }
        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
