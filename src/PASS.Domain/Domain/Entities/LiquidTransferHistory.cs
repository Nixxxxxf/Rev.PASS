using PASS.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace PASS.Domain.Entities
{
    /// <summary>
    /// 1. source liquid + dest liquid(can be null)  ===> final liquid;
    /// 2. source well ===> dest well;
    /// 3. duration equipment;
    /// </summary>
    public class LiquidTransferHistory : CreationAuditedEntity<Guid>
    {
        public TransferType TransferType { get; set; }

        public Guid SourceLiquidId { get; set; }
        //[ForeignKey(nameof(SourceLiquidId))]
        //public Liquid? SourceLiquidFk { get; set; }

        public Guid? DestinationLiquidId { get; set; }
        //[ForeignKey(nameof(DestinationLiquidId))]
        //public Liquid? DestinationLiquidFk { get; set; }

        public Guid? FinalLiquidId { get; set; }
        //[ForeignKey(nameof(FinalLiquidId))]
        //public Liquid? FinalLiquidFk { get; set; }

        public Guid SourcePlateChildId { get; set; }
        //[ForeignKey(nameof(SourcePlateChildId))]
        //public PlateChild? SourcePlateChildFk { get; set; }

        public Guid DestinationPlateChildId { get; set; }
        //[ForeignKey(nameof(DestinationPlateChildId))]
        //public PlateChild? DestinationPlateChildFk { get; set; }

        public float? TransferVolume { get; set; }

        public Guid InstrumentId { get; set; }
        [ForeignKey(nameof(InstrumentId))]
        public Instrument? InstrumentFk { get; set; }
        public float? Result { get; set; }

        public string? Comments { get; set; }
        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
