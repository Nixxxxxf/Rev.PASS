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
using Volo.Abp.ObjectMapping;

namespace PASS.AppServices
{
    public class InstrumentAppService :
        CrudAppService<Instrument,
            InstrumentDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        IInstrumentAppService
    {

        public readonly IRepository<Instrument, Guid> _instrumentRepository;

        public InstrumentAppService(IRepository<Instrument, Guid> repository)
            : base(repository)
        {
            _instrumentRepository = repository;
        }

        public async Task<PagedResultDto<InstrumentDto>> GetListWithFilterAsync(string? instName, PagedAndSortedResultRequestDto input)
        {
            IQueryable<Instrument> queryIns = (await _instrumentRepository.GetQueryableAsync()).WhereIf(!string.IsNullOrEmpty(instName), x => x.Name == instName);

            int totalCount = await base.AsyncExecuter.CountAsync(queryIns).ConfigureAwait(continueOnCapturedContext: false);
            if (totalCount > 0)
            {
                if (!input.Sorting.IsNullOrWhiteSpace())
                {
                    queryIns = queryIns.OrderBy(new ParsingConfig(), input.Sorting);
                }
                queryIns = queryIns.Skip(input.SkipCount).Take(input.MaxResultCount);
            }

            List<InstrumentDto> items = new List<InstrumentDto>();
            items = ObjectMapper.Map<List<Instrument>, List<InstrumentDto>>(queryIns.ToList());

            return new PagedResultDto<InstrumentDto>(totalCount, items);

        }
    }
}
