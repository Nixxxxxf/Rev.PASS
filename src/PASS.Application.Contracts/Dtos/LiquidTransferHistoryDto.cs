using PASS.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace PASS.Dtos
{
    /// <summary>
    /// 1. 吸 板里的 (化合物/细胞)A，排 空板
    /// 2. 吸 板里的 (化合物/细胞)A，排 板里的 (化合物/细胞)B
    /// 3. 吸 水，排 板里的 (化合物/细胞)A
    /// 4. 吸 水，排 空板 
    /// </summary>
    public class LiquidTransferHistoryDto : CreationAuditedEntityDto<Guid>
    {
        public TransferType TransferType { get; set; }
        public Guid SourceLiquidId { get; set; }
        public LiquidDto? SourceLiquidFk { get; set; }//not in db


        public Guid? DestinationLiquidId { get; set; }//can be null
        public LiquidDto? DestinationLiquidFk { get; set; }//not in db


        public Guid? FinalLiquidId { get; set; }//can be null
        public LiquidDto? FinalLiquidFk { get; set; }//not in db


        public Guid? SourcePlateChildId { get; set; }//can be null
        public PlateChildDto? SourcePlateChildFk { get; set; }//not in db


        public Guid DestinationPlateChildId { get; set; }
        public PlateChildDto? DestinationPlateChildFk { get; set; }//not in db


        public float TransferVolume { get; set; } //nL

        public Guid? InstrumentId { get; set; }
        public InstrumentDto? InstrumentFk { get; set; }//not in db

        public float? Result { get; set; }

        public string? Comments { get; set; }
    }
}
