using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PASS.MqMessage
{
    public class InstrumentRequestMsg : BaseMsg
    {
        public string? InstrumentName { get; set; }
    }
}
