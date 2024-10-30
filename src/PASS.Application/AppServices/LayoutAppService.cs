using AutoMapper.Internal.Mappers;
using PASS.Domain.Entities;
using PASS.Dtos;
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
    public class LayoutAppService :
            CrudAppService<LiquidPositionInPlate,
            LiquidPositionInPlateDto,
            Guid,
            PagedAndSortedResultRequestDto>
    //ILiquidPositionInPlateAppService
    {
        public readonly IRepository<Liquid, Guid> _liquidRepository;
        public readonly IRepository<LiquidCategory, Guid> _liquidCategoryRepository;
        public readonly IRepository<LiquidAttribute, Guid> _liquidAttributeRepository;
        public readonly IRepository<LiquidPositionInPlate, Guid> _liquidPositionInPlateRepository;
        public readonly IRepository<Plate, Guid> _plateRepository;
        public readonly IRepository<PlateChild, Guid> _plateChildRepository;
        public readonly IRepository<Instrument, Guid> _instrumentRepository;
        public readonly IRepository<LiquidTransferHistory, Guid> _transferHistoryRepository;


        public LayoutAppService(
            IRepository<Liquid, Guid> liquidRepository,
            IRepository<LiquidCategory, Guid> liquidCategoryRepository,
            IRepository<LiquidAttribute, Guid> liquidAttributeRepository,
            IRepository<LiquidPositionInPlate, Guid> liquidPositionInPlateRepository,
            IRepository<Plate, Guid> plateRepository,
            IRepository<PlateChild, Guid> plateChildRepository,
            IRepository<Instrument, Guid> instrumentRepository,
            IRepository<LiquidTransferHistory, Guid> transferHistoryRepository)
            : base(liquidPositionInPlateRepository)
        {
            _liquidRepository = liquidRepository;
            _liquidCategoryRepository = liquidCategoryRepository;
            _liquidAttributeRepository = liquidAttributeRepository;
            _liquidPositionInPlateRepository = liquidPositionInPlateRepository;
            _plateRepository = plateRepository;
            _plateChildRepository = plateChildRepository;
            _instrumentRepository = instrumentRepository;
            _transferHistoryRepository = transferHistoryRepository;
        }

        public async Task<PagedResultDto<LiquidPositionInPlateDto>> GetPlateDetailsForTableAsync(string plateName, PagedAndSortedResultRequestDto input)
        {

            IQueryable<Liquid> queryLi = await _liquidRepository.WithDetailsAsync(x => x.LiquidCategoryFk);
            IQueryable<PlateChild> queryPc = await _plateChildRepository.WithDetailsAsync(x => x.PlateFk);
            IQueryable<LiquidPositionInPlate> queryLp = (await _liquidPositionInPlateRepository.WithDetailsAsync(x => x.LiquidFk, x => x.PlateChildFk));

            var liquidPositionQuery = from lp in queryLp
                                      join li in queryLi on lp.LiquidId equals li.Id
                                      join pc in queryPc on lp.PlateChildId equals pc.Id
                                      where pc.PlateFk!.Name == plateName
                                      select new LiquidPositionInPlate()
                                      {
                                          PlateChildFk = pc,
                                          LiquidFk = li,
                                          PlateChildId = pc.Id,
                                          LiquidId = li.Id

                                      };


            int totalCount = await base.AsyncExecuter.CountAsync(liquidPositionQuery).ConfigureAwait(continueOnCapturedContext: false);

            if (totalCount > 0)
            {
                //liquidPositionQuery = base.ApplySorting(liquidPositionQuery, input);
                if (!input.Sorting.IsNullOrWhiteSpace())
                {
                    liquidPositionQuery = liquidPositionQuery.OrderBy(new ParsingConfig(), input.Sorting);
                }
                //liquidPositionQuery = base.ApplyPaging(liquidPositionQuery, input);
                liquidPositionQuery = liquidPositionQuery.Skip(input.SkipCount).Take(input.MaxResultCount);
            }


            List<LiquidPositionInPlateDto> result = new List<LiquidPositionInPlateDto>();
            result = ObjectMapper.Map<List<LiquidPositionInPlate>, List<LiquidPositionInPlateDto>>(liquidPositionQuery.ToList());

            return new PagedResultDto<LiquidPositionInPlateDto>(totalCount, result);

        }


        public async Task<List<LiquidPositionInPlateDto>> GetPlateDetailsForChartAsync(string plateName)
        {

            IQueryable<Liquid> queryLi = await _liquidRepository.WithDetailsAsync(x => x.LiquidCategoryFk);
            IQueryable<PlateChild> queryPc = await _plateChildRepository.WithDetailsAsync(x => x.PlateFk);
            IQueryable<LiquidPositionInPlate> queryLp = (await _liquidPositionInPlateRepository.WithDetailsAsync(x => x.LiquidFk, x => x.PlateChildFk));

            var liquidPositionQuery = from lp in queryLp
                                      join li in queryLi on lp.LiquidId equals li.Id
                                      join pc in queryPc on lp.PlateChildId equals pc.Id
                                      where pc.PlateFk!.Name == plateName
                                      select new LiquidPositionInPlate()
                                      {
                                          PlateChildFk = pc,
                                          LiquidFk = li,
                                          PlateChildId = pc.Id,
                                          LiquidId = li.Id

                                      };



            List<LiquidPositionInPlateDto> result = new List<LiquidPositionInPlateDto>();
            result = ObjectMapper.Map<List<LiquidPositionInPlate>, List<LiquidPositionInPlateDto>>(liquidPositionQuery.ToList());

            return result;

        }
    }
}
