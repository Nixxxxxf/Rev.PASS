using PASS.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace PASS.Domain.Entities
{
    public class LiquidCategory : Entity<Guid>
    {
        public string? Name { get; set; }


        #region for compound
        public string? SMILES { get; set; } //化合物式
        #endregion


        #region for gene
        public string? GeneFunction { get; set; } //功能
        public string? GeneCDS { get; set; } //蛋白编码区
        public string? GeneDonors { get; set; } //供体
        public string? GeneSequence { get; set; } //序列
        public bool? GeneStrand { get; set; } //正反链; true:+, false:-
        public int? GeneLocation { get; set; } //位置
        #endregion

        #region for marker
        public string? MarkerID { get; set; } //标记编号
        public string? MarkerDescription { get; set; } //标记描述
        public List<string?>? PrimerList { get; set; } //引物
        public Nucleobase? AlleleOfFAM { get; set; } //FAM对应的等位基因
        public Nucleobase? AlleleOfHEX { get; set; } //HEX对应的等位基因
        #endregion


        public LiquidType LiquidType { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<LiquidAttribute>? LiquidAttributeList { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Liquid>? LiquidList { get; set; }
        public void SetId(Guid id)
        {
            Id = id;
        }
    }
}
