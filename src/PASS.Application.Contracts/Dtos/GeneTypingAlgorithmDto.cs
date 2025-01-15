using PASS.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;

namespace PASS.Dtos
{
    public class GeneTypingAlgorithmDto : EntityDto<Guid>
    {
        public string? Name { get; set; }
        public AlgorithmType Type { get; set; }
        public string? Content { get; set; }
    }
}
