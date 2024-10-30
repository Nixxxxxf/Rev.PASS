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
    public class LiquidCategoryAppService :
        CrudAppService<LiquidCategory,
            LiquidCategoryDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        ILiquidCategoryAppService
    {

        public readonly IRepository<Liquid, Guid> _liquidRepository;
        public readonly IRepository<LiquidCategory, Guid> _liquidCategoryRepository;
        public readonly IRepository<Plate, Guid> _plateRepository;
        public readonly IRepository<PlateChild, Guid> _plateChildRepository;
        public readonly IRepository<LiquidPositionInPlate, Guid> _liquidPositionInPlateRepository;

        public LiquidCategoryAppService(IRepository<Liquid, Guid> liquidRepository,
            IRepository<LiquidCategory, Guid> liquidCategoryRepository,
            IRepository<Plate, Guid> plateRepository,
            IRepository<LiquidPositionInPlate, Guid> liquidPositionInPlateRepository,
            IRepository<PlateChild, Guid> plateChildRepository)
            : base(liquidCategoryRepository)
        {
            _liquidRepository = liquidRepository;
            _liquidCategoryRepository = liquidCategoryRepository;
            _plateRepository = plateRepository;
            _plateChildRepository = plateChildRepository;
            _liquidPositionInPlateRepository = liquidPositionInPlateRepository;
        }



        public async Task<PagedResultDto<LiquidCategoryDto>> GetCompoundListAsync(string? compoundName, string? smiles, PagedAndSortedResultRequestDto input)
        {

            IQueryable<LiquidCategory> queryLc = await _liquidCategoryRepository.GetQueryableAsync();

            var liquidCategoryQuery = (from lc in queryLc

                                       select new LiquidCategory()
                                       {
                                           Name = lc.Name,
                                           SMILES = lc.SMILES,
                                           LiquidType = lc.LiquidType,
                                       })
                                       .Where(x => x.LiquidType == Enum.LiquidType.Compound)
                                       .WhereIf(!string.IsNullOrEmpty(compoundName), x => (x.Name != null && x.Name.ToUpper() == compoundName!.ToUpper()))
                                       .WhereIf(!string.IsNullOrEmpty(smiles), x => (x.SMILES != null && x.SMILES.ToUpper().Contains(smiles!.ToUpper())));


            int totalCount = await base.AsyncExecuter.CountAsync(liquidCategoryQuery).ConfigureAwait(continueOnCapturedContext: false);

            if (totalCount > 0)
            {
                if (!input.Sorting.IsNullOrWhiteSpace())
                {
                    liquidCategoryQuery = liquidCategoryQuery.OrderBy(new ParsingConfig(), input.Sorting);
                }
                liquidCategoryQuery = liquidCategoryQuery.Skip(input.SkipCount).Take(input.MaxResultCount);
            }


            List<LiquidCategoryDto> result = new List<LiquidCategoryDto>();
            result = ObjectMapper.Map<List<LiquidCategory>, List<LiquidCategoryDto>>(liquidCategoryQuery.ToList());

            return new PagedResultDto<LiquidCategoryDto>(totalCount, result);

        }
    }
}
