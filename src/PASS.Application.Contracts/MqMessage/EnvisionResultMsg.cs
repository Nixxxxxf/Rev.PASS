using PASS.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PASS.MqMessage
{
    public class EnvisionResultMsg : BaseMsg
    {
        public ImportResultFileDto? EnvisionResult { get; set; }
    }
}
