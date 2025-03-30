using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace PASS.Domain.Entities
{
    public class Protocol : Entity<Guid>
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
