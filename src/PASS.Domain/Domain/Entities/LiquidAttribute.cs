using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace PASS.Domain.Entities
{
    public class LiquidAttribute : Entity<Guid>
    {
        public Guid LiquidCategoryId { get; set; }
        [ForeignKey(nameof(LiquidCategoryId))]
        public LiquidCategory? LiquidCategoryFk { get; set; }
        public string? AttributeName { get; set; }
        public string? AttributeValue { get; set; }

        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
