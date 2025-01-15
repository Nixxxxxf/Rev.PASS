using PASS.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    public class LiquidCategoryDto : EntityDto<Guid>
    {
        public string? Name { get; set; }
        public string? SMILES { get; set; }

        #region for gene
        //public string? GeneFunction { get; set; } //功能
        //public string? GeneCDS { get; set; } //蛋白编码区
        //public string? GeneDonors { get; set; } //供体
        //public string? GeneSequence { get; set; } //序列
        //public bool? GeneStrand { get; set; } //正反链; true:+, false:-
        //public int? GeneLocation { get; set; } //位置
        #endregion

        #region for sample
        public string? SampleID { get; set; } //样品编号
        #endregion

        #region for marker
        public string? MarkerID { get; set; } //标记编号
        public string? MarkerDescription { get; set; } //标记描述
        public List<string?>? PrimerList { get; set; } //引物
        public Nucleobase AlleleOfFAM { get; set; } //FAM对应的等位基因
        public Nucleobase AlleleOfHEX { get; set; } //HEX对应的等位基因
        #endregion


        public LiquidType LiquidType { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<LiquidAttributeDto>? LiquidAttributeList { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<LiquidDto>? LiquidList { get; set; }


    }
}
