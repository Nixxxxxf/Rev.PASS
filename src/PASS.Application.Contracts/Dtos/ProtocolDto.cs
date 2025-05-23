﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class ProtocolDto : EntityDto<Guid>
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
    }
}
