using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace PASS.Domain.Entities
{

    public class PlateTransferHistory : CreationAuditedEntity<Guid>
    {
        public Guid PlateId { get; set; }
        [ForeignKey(nameof(PlateId))]
        public Plate? PlateFk { get; set; }

        public Guid InstrumentId { get; set; }
        [ForeignKey(nameof(InstrumentId))]
        public Instrument? InstrumentFk { get; set; }

        public string? Direction { get; set; }

        public TimeSpan? AssayTime { get; set; }
        public DateTime? TransferTime { get; set; }

        public string? Comments { get; set; }
        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
