using PASS.Enum;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace PASS.Domain.Entities
{
    public class GeneTypingAlgorithm : Entity<Guid>
    {
        public required string Name { get; set; }
        public AlgorithmType Type { get; set; }
        public string? Content { get; set; }
    }
}
