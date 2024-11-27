using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace PASS.Domain.Entities
{
    /// <summary>
    /// The object of Liquid Category Class
    /// Be used to trace
    /// </summary>
    public class Liquid : Entity<Guid>
    {
        public Guid LiquidCategoryId { get; set; }
        [ForeignKey(nameof(LiquidCategoryId))]
        public LiquidCategory? LiquidCategoryFk { get; set; }
        public float? Volume { get; set; }
        public float? Concentration { get; set; }
        public float? Result { get; set; }
        public float? FAM { get; set; }
        public float? HEX { get; set; }
        public float? ROX { get; set; }
        public Liquid(Guid id)
            : base(id)
        {
            Id = id;
        }

        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
