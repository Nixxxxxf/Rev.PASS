using AutoMapper.Internal.Mappers;
using PASS.Domain.Entities;
using PASS.Dtos;
using PASS.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace PASS.AppServices
{
    public class CsvHeaderAppService :
        CrudAppService<CsvHeader,
            CsvHeaderDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        ICsvHeaderAppService
    {

        public readonly IRepository<CsvHeader, Guid> _csvHeaderRepository;
        public readonly IRepository<Instrument, Guid> _instrumentRepository;

        public CsvHeaderAppService(IRepository<CsvHeader, Guid> csvHeaderRepository, IRepository<Instrument, Guid> instrumentRepository)
            : base(csvHeaderRepository)
        {
            _csvHeaderRepository = csvHeaderRepository;
            _instrumentRepository = instrumentRepository;
        }


        public List<CsvHeaderDto> GetCsvHeaders(string csvFileName)
        {
            List<CsvHeader> csvHeaders = _csvHeaderRepository.GetQueryableAsync().Result.Where(x => x.CsvName == csvFileName).ToList();

            return ObjectMapper.Map<List<CsvHeader>, List<CsvHeaderDto>>(csvHeaders);
        }


        public List<string?> GetAllCsvFileName()
        {
            List<string?> result = _csvHeaderRepository.GetQueryableAsync().Result.Select(x => x.CsvName).Distinct().ToList();
            return result;
        }

        //public async Task<List<CsvHeaderDto>> GetAllCsvFileNameAsync()
        //{
        //    //var query = await _csvHeaderRepository.GetQueryableAsync();
        //    //var result = await query.Select(x => x.CsvName).Distinct().ToListAsync();

        //    var lst = await _csvHeaderRepository.GetListAsync();
        //    var result = ObjectMapper.Map<List<CsvHeader>, List<CsvHeaderDto>>(lst);
        //    return result;
        //}


        //public async Task<List<string?>> GetAllCsvFileNameXXXAsync()
        //{
        //    var query = await _csvHeaderRepository.GetQueryableAsync();
        //    var result = query.Select(x => x.CsvName).Distinct().ToList();
        //    return result;


        //}


        public async Task<PagedResultDto<CsvHeaderDto>> GetListWithFilterAsync(string? csvName, PagedAndSortedResultRequestDto input)
        {
            IQueryable<CsvHeader> queryCh = (await _csvHeaderRepository.GetQueryableAsync()).WhereIf(!string.IsNullOrEmpty(csvName), x => x.CsvName == csvName);

            int totalCount = await base.AsyncExecuter.CountAsync(queryCh).ConfigureAwait(continueOnCapturedContext: false);
            if (totalCount > 0)
            {
                if (!input.Sorting.IsNullOrWhiteSpace())
                {
                    queryCh = queryCh.OrderBy(new ParsingConfig(), input.Sorting);
                }
                queryCh = queryCh.Skip(input.SkipCount).Take(input.MaxResultCount);
            }

            List<CsvHeaderDto> items = new List<CsvHeaderDto>();
            items = ObjectMapper.Map<List<CsvHeader>, List<CsvHeaderDto>>(queryCh.ToList());

            return new PagedResultDto<CsvHeaderDto>(totalCount, items);

        }


        //public async Task<List<InstrumentDto>> GetAllInstrumentsAsync()
        //{
        //    var lst = await _instrumentRepository.GetListAsync();
        //    var result = ObjectMapper.Map<List<Instrument>, List<InstrumentDto>>(lst);
        //    return result;

        //}
    }
}
