using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace PASS.Domain.Entities
{
    public class GenePlateResult : CreationAuditedEntity<Guid>
    {
        public required string Name { get; set; }
        public Guid? AlgorithmID { get; set; }
        [ForeignKey(nameof(AlgorithmID))]
        public GeneTypingAlgorithm? AlgorithmFk { get; set; }
        public Guid LiquidID { get; set; }
        [ForeignKey(nameof(LiquidID))]
        public Liquid? LiquidFk { get; set; }
        public string? PlateName { get; set; }
        public string? WellName { get; set; }
        public string? GeneName { get; set; }
        public string? MarkerName { get; set; }
        public string? GeneMarkerResult { get; set; }

    }
}
