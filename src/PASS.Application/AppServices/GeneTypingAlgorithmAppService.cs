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

    public class GeneTypingAlgorithmAppService :
        CrudAppService<GeneTypingAlgorithm,
            GeneTypingAlgorithmDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        IGeneTypingAlgorithmAppService
    {
        public readonly IRepository<GeneTypingAlgorithm, Guid> _geneTypingAlgorithmRepository;

        public GeneTypingAlgorithmAppService(IRepository<GeneTypingAlgorithm, Guid> repository)
            : base(repository)
        {
            _geneTypingAlgorithmRepository = repository;
        }

        public async Task<PagedResultDto<GeneTypingAlgorithmDto>> GetListWithFilterAsync(string? filter, PagedAndSortedResultRequestDto input)
        {
            IQueryable<GeneTypingAlgorithm> queryP = (await _geneTypingAlgorithmRepository.GetQueryableAsync()).WhereIf(!string.IsNullOrEmpty(filter), x => x.Name == filter);

            int totalCount = await base.AsyncExecuter.CountAsync(queryP).ConfigureAwait(continueOnCapturedContext: false);
            if (totalCount > 0)
            {
                if (!input.Sorting.IsNullOrWhiteSpace())
                {
                    queryP = queryP.OrderBy(new ParsingConfig(), input.Sorting);
                }
                queryP = queryP.Skip(input.SkipCount).Take(input.MaxResultCount);
            }

            List<GeneTypingAlgorithmDto> items = new List<GeneTypingAlgorithmDto>();
            items = ObjectMapper.Map<List<GeneTypingAlgorithm>, List<GeneTypingAlgorithmDto>>(queryP.ToList());

            return new PagedResultDto<GeneTypingAlgorithmDto>(totalCount, items);

        }


    }
}
