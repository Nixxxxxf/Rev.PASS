using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PASS.MqMessage
{
    public class CsvHeaderRequestMsg : BaseMsg
    {
        public string? CsvName { get; set; }
    }
}
