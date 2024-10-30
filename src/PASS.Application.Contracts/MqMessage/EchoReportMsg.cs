using PASS.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PASS.MqMessage
{
    public class EchoReportMsg : BaseMsg
    {
        public string? ReportType { get; set; }
        public string? ReportName { get; set; }
        public ICollection<ReportItemDto>? ReportItemsList { get; set; }
    }
}
