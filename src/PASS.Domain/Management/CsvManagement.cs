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
    public class CsvManagement : ISingletonDependency//ITransientDependency
    {
        private readonly IRepository<CsvHeader, Guid> _csvHeaderRepository;

        public CsvManagement(IRepository<CsvHeader, Guid> csvHeaderRepository)
        {
            _csvHeaderRepository = csvHeaderRepository;
        }


        public List<CsvHeader> GetCsvHeadersList(string csvFileName)
        {
            var lst = _csvHeaderRepository.GetListAsync().Result.Where(x => x.CsvName == csvFileName).ToList();
            return lst;
        }



    }
}
