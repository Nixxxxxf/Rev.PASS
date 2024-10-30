using PASS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace PASS.Management
{
    public class InstrumentManagement : ISingletonDependency
    {
        private readonly IRepository<CsvHeader, Guid> _instrumentRepository;

        public InstrumentManagement(IRepository<CsvHeader, Guid> instrumentRepository)
        {
            _instrumentRepository = instrumentRepository;
        }


        public Instrument GetInstrument(string instName)
        {
            var inst = _instrumentRepository.GetListAsync().Result.Where(x => x.CsvName == instName).First();
            return new Instrument() { Name = "1" };
        }



    }
}
