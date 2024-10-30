using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PASS.MqMessage
{
    public class BaseMsg
    {
        public int ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public string? MsgSender { get; set; }
    }
}
