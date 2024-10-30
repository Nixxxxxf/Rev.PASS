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
    public class PlateAppService :
        CrudAppService<Plate,
            PlateDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        IPlateAppService
    {
        public readonly IRepository<Plate, Guid> _plateRepository;

        public PlateAppService(IRepository<Plate, Guid> repository)
            : base(repository)
        {
            _plateRepository = repository;
        }

        public async Task<PagedResultDto<PlateDto>> GetListWithFilterAsync(string? plateName, PagedAndSortedResultRequestDto input)
        {
            IQueryable<Plate> queryP = (await _plateRepository.GetQueryableAsync()).WhereIf(!string.IsNullOrEmpty(plateName), x => x.Name == plateName);

            int totalCount = await base.AsyncExecuter.CountAsync(queryP).ConfigureAwait(continueOnCapturedContext: false);
            if (totalCount > 0)
            {
                if (!input.Sorting.IsNullOrWhiteSpace())
                {
                    queryP = queryP.OrderBy(new ParsingConfig(), input.Sorting);
                }
                queryP = queryP.Skip(input.SkipCount).Take(input.MaxResultCount);
            }

            List<PlateDto> items = new List<PlateDto>();
            items = ObjectMapper.Map<List<Plate>, List<PlateDto>>(queryP.ToList());

            return new PagedResultDto<PlateDto>(totalCount, items);

        }


    }



}
