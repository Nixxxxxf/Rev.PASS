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
    /// 1. 1 PlateChild ==> 1 Liquid
    /// 2. 1 Liquid ==> n PalteChild
    /// </summary>
    public class PlateChild : Entity<Guid>
    {
        public Guid PlateId { get; set; }
        [ForeignKey(nameof(PlateId))]
        public Plate? PlateFk { get; set; }
        public string? Row { get; set; }
        public int Column { get; set; }
        public PlateChild(Guid id)
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
