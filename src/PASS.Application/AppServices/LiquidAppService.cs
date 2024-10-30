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
    public class LiquidAppService :
        CrudAppService<Liquid,
            LiquidDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        ILiquidAppService
    {

        public readonly IRepository<Liquid, Guid> _liquidRepository;
        public readonly IRepository<LiquidCategory, Guid> _liquidCategoryRepository;
        public readonly IRepository<Plate, Guid> _plateRepository;
        public readonly IRepository<PlateChild, Guid> _plateChildRepository;
        public readonly IRepository<LiquidPositionInPlate, Guid> _liquidPositionInPlateRepository;


        public LiquidAppService(
            IRepository<Liquid, Guid> liquidRepository,
            IRepository<LiquidCategory, Guid> liquidCategoryRepository,
            IRepository<Plate, Guid> plateRepository,
            IRepository<LiquidPositionInPlate, Guid> liquidPositionInPlateRepository,
            IRepository<PlateChild, Guid> plateChildRepository)
            : base(liquidRepository)
        {
            _liquidRepository = liquidRepository;
            _liquidCategoryRepository = liquidCategoryRepository;
            _plateRepository = plateRepository;
            _plateChildRepository = plateChildRepository;
            _liquidPositionInPlateRepository = liquidPositionInPlateRepository;
        }

        public override async Task<PagedResultDto<LiquidDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            IQueryable<Liquid> query3 = _liquidRepository.WithDetailsAsync(x => x.LiquidCategoryFk).Result;
            int totalCount = await base.AsyncExecuter.CountAsync(query3).ConfigureAwait(continueOnCapturedContext: false);
            List<LiquidDto> items = new List<LiquidDto>();
            if (totalCount > 0)
            {
                query3 = base.ApplySorting(query3, input);
                query3 = base.ApplyPaging(query3, input);
                items = ObjectMapper.Map<List<Liquid>, List<LiquidDto>>(query3.ToList());
            }
            return new PagedResultDto<LiquidDto>(totalCount, items);

        }


        public async Task<PagedResultDto<LiquidPositionInPlateDto>> GetLiquidPositionInPlateAsync(string? plateName, string? liquidCategoryName, PagedAndSortedResultRequestDto input)
        {

            IQueryable<Liquid> queryLi = await _liquidRepository.WithDetailsAsync(x => x.LiquidCategoryFk);
            IQueryable<PlateChild> queryPc = await _plateChildRepository.WithDetailsAsync(x => x.PlateFk);
            IQueryable<LiquidPositionInPlate> queryLp = (await _liquidPositionInPlateRepository.WithDetailsAsync(x => x.LiquidFk, x => x.PlateChildFk));

            var liquidPositionQuery = (from lp in queryLp
                                       join li in queryLi on lp.LiquidId equals li.Id
                                       join pc in queryPc on lp.PlateChildId equals pc.Id
                                       //where pc.PlateFk!.Name == plateName
                                       select new LiquidPositionInPlate()
                                       {
                                           PlateChildFk = pc,
                                           LiquidFk = li,
                                           PlateChildId = pc.Id,
                                           LiquidId = li.Id

                                       }).WhereIf(!string.IsNullOrEmpty(plateName), x => x.PlateChildFk!.PlateFk!.Name == plateName)
                                       .WhereIf(!string.IsNullOrEmpty(liquidCategoryName), x => x.LiquidFk!.LiquidCategoryFk!.Name == liquidCategoryName);


            int totalCount = await base.AsyncExecuter.CountAsync(liquidPositionQuery).ConfigureAwait(continueOnCapturedContext: false);

            if (totalCount > 0)
            {
                //liquidPositionQuery = base.ApplySorting(liquidPositionQuery, input);
                if (!input.Sorting.IsNullOrWhiteSpace())
                {
                    liquidPositionQuery = liquidPositionQuery.OrderBy(new ParsingConfig(), input.Sorting);
                }
                else
                {
                    liquidPositionQuery = liquidPositionQuery.OrderBy(x => x.PlateChildFk!.PlateId).ThenBy(x => x.PlateChildFk!.Row).ThenBy(x => x.PlateChildFk!.Column);
                }
                //liquidPositionQuery = base.ApplyPaging(liquidPositionQuery, input);
                liquidPositionQuery = liquidPositionQuery.Skip(input.SkipCount).Take(input.MaxResultCount);
            }


            List<LiquidPositionInPlateDto> result = new List<LiquidPositionInPlateDto>();
            result = ObjectMapper.Map<List<LiquidPositionInPlate>, List<LiquidPositionInPlateDto>>(liquidPositionQuery.ToList());

            return new PagedResultDto<LiquidPositionInPlateDto>(totalCount, result);

        }


    }
}
