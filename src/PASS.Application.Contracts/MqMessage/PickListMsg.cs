using PASS.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PASS.MqMessage
{
    public class PickListMsg : BaseMsg
    {
        public string? Instrument { get; set; }
        public List<LiquidTransferHistoryDto>? PickList { get; set; }
    }
}
