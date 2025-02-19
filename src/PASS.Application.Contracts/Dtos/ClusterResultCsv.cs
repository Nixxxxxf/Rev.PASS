using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PASS.Dtos
{
    public class ClusterResultCsv
    {
        public string? PlateName {  get; set; }
        public string? WellName {  get; set; }
        public string? SampleName {  get; set; }
        public string? MarkerName {  get; set; }
        public string? AlleleOfFAM { get; set; }
        public string? AlleleOfHEX { get; set; }
        public string? Result {  get; set; }
    }
}
