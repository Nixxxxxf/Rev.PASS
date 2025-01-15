using PASS.Enum;
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
        public string? Name { get; set; }
        public float? Volume { get; set; }
        public float? Concentration { get; set; }
        public string? SMILES { get; set; }

        #region for sample
        public string? SampleID { get; set; } //样品编号
        #endregion

        #region for marker
        public string? MarkerID { get; set; } //标记编号
        public string? MarkerDescription { get; set; } //标记描述
        public List<string?>? PrimerList { get; set; } //引物
        public Nucleobase? AlleleOfFAM { get; set; } //FAM对应的等位基因
        public Nucleobase? AlleleOfHEX { get; set; } //HEX对应的等位基因
        #endregion

    }
}
