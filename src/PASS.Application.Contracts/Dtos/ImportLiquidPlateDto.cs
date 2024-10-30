using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PASS.Dtos
{
    public class ImportLiquidPlateDto
    {
        public string? PlateName { get; set; }
        public string? PlateType { get; set; }
        public string? Row { get; set; }
        public int Column { get; set; }
        public string? LiquidName { get; set; }
        public float? Volume { get; set; }
        public float? Concentration { get; set; }
        public string? SMILES { get; set; }

    }
}
