using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PASS.Dtos
{
    public class ImportResultFileDto
    {
        public string? PlateName { get; set; }
        public string? Row { get; set; }
        public int Column { get; set; }
        public float? Result { get; set; }
        public Guid? LiquidId { get; set; }
    }
}
