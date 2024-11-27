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
using Volo.Abp.ObjectMapping;

namespace PASS.AppServices
{
    public class LiquidTransferAppService :
        CrudAppService<LiquidTransferHistory,
            LiquidTransferHistoryDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        ILiquidTransferAppService
    {
        public readonly IRepository<LiquidTransferHistory, Guid> _transferHistoryRepository;
        public readonly IRepository<Liquid, Guid> _liquidRepository;
        public readonly IRepository<PlateChild, Guid> _plateChildRepository;
        public readonly IRepository<Instrument, Guid> _instrumentRepository;

        public LiquidTransferAppService(IRepository<LiquidTransferHistory, Guid> transferHistoryRepository,
            IRepository<Liquid, Guid> liquidRepository,
            IRepository<PlateChild, Guid> plateChildRepository,
            IRepository<Instrument, Guid> instrumentRepository
            )
            : base(transferHistoryRepository)
        {
            _transferHistoryRepository = transferHistoryRepository;
            _liquidRepository = liquidRepository;
            _plateChildRepository = plateChildRepository;
            _instrumentRepository = instrumentRepository;
        }

        public override async Task<PagedResultDto<LiquidTransferHistoryDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            IQueryable<LiquidTransferHistory> queryTr = await _transferHistoryRepository.GetQueryableAsync();
            IQueryable<Liquid> queryLi = await _liquidRepository.WithDetailsAsync(x => x.LiquidCategoryFk);
            IQueryable<PlateChild> queryPl = await _plateChildRepository.WithDetailsAsync(x => x.PlateFk);
            IQueryable<Instrument> queryIn = await _instrumentRepository.GetQueryableAsync();


            int totalCount = await base.AsyncExecuter.CountAsync(queryTr).ConfigureAwait(continueOnCapturedContext: false);

            if (totalCount > 0)
            {
                queryTr = base.ApplySorting(queryTr, input);
                queryTr = base.ApplyPaging(queryTr, input);
            }

            var trans = from t in queryTr
                        join sl in queryLi on t.SourceLiquidId equals sl.Id
                        //join dl in queryLi on t.DestinationLiquidId equals dl.Id
                        join fl in queryLi on t.FinalLiquidId equals fl.Id
                        join sp in queryPl on t.SourcePlateChildId equals sp.Id
                        join dp in queryPl on t.DestinationPlateChildId equals dp.Id
                        join ins in queryIn on t.InstrumentId equals ins.Id
                        select new LiquidTransferHistoryDto()
                        {
                            SourceLiquidFk = ObjectMapper.Map<Liquid,LiquidDto>(sl),
                            //DestinationLiquidFk = dl,
                            FinalLiquidFk = ObjectMapper.Map<Liquid, LiquidDto>(fl),
                            SourcePlateChildFk = ObjectMapper.Map<PlateChild, PlateChildDto>(sp),
                            DestinationPlateChildFk = ObjectMapper.Map<PlateChild, PlateChildDto>(dp),
                            InstrumentFk = ObjectMapper.Map<Instrument, InstrumentDto>(ins),
                            TransferVolume = t.TransferVolume,
                            TransferType = t.TransferType,
                            Comments = t.Comments,
                        };

            //List<LiquidTransferHistoryDto> items = new List<LiquidTransferHistoryDto>();
            //items = ObjectMapper.Map<List<LiquidTransferHistory>, List<LiquidTransferHistoryDto>>(trans.ToList());

            //if (totalCount > 0)
            //{
            //    //trans = base.ApplySorting(trans, input);
            //    //trans = base.ApplyPaging(trans, input);
            //}
            return new PagedResultDto<LiquidTransferHistoryDto>(totalCount, trans.ToList());

        }



        public async Task<PagedResultDto<LiquidTransferHistoryDto>> GetListWithFilterAsync(string? srPlateName, string? dsPlateName, string? srLiquidName, string? dsLiquidName, string? fnLiquidName, PagedAndSortedResultRequestDto input)
        {
            IQueryable<LiquidTransferHistory> queryTr = await _transferHistoryRepository.GetQueryableAsync();
            IQueryable<Liquid> querySLi = (await _liquidRepository.WithDetailsAsync(x => x.LiquidCategoryFk)).WhereIf(!string.IsNullOrEmpty(srLiquidName), x => x.LiquidCategoryFk!.Name == srLiquidName);
            //IQueryable<Liquid> queryDLi = (await _liquidRepository.WithDetailsAsync(x => x.LiquidCategoryFk)).WhereIf(!string.IsNullOrEmpty(dsLiquidName), x => x.LiquidCategoryFk!.Name == dsLiquidName);
            IQueryable<Liquid> queryFLi = (await _liquidRepository.WithDetailsAsync(x => x.LiquidCategoryFk)).WhereIf(!string.IsNullOrEmpty(fnLiquidName), x => x.LiquidCategoryFk!.Name == fnLiquidName);
            IQueryable<PlateChild> querySrPl = (await _plateChildRepository.WithDetailsAsync(x => x.PlateFk)).WhereIf(!string.IsNullOrEmpty(srPlateName), x => x.PlateFk!.Name == srPlateName);
            IQueryable<PlateChild> queryDsPl = (await _plateChildRepository.WithDetailsAsync(x => x.PlateFk)).WhereIf(!string.IsNullOrEmpty(dsPlateName), x => x.PlateFk!.Name == dsPlateName);
            IQueryable<Instrument> queryIn = await _instrumentRepository.GetQueryableAsync();



            var trans = from t in queryTr
                        join sl in querySLi on t.SourceLiquidId equals sl.Id
                        //join dl in queryDLi on t.DestinationLiquidId equals dl.Id
                        join fl in queryFLi on t.FinalLiquidId equals fl.Id
                        join sp in querySrPl on t.SourcePlateChildId equals sp.Id
                        join dp in queryDsPl on t.DestinationPlateChildId equals dp.Id
                        join ins in queryIn on t.InstrumentId equals ins.Id
                        select new LiquidTransferHistoryDto()
                        {
                            SourceLiquidFk = ObjectMapper.Map<Liquid, LiquidDto>(sl),
                            //DestinationLiquidFk = dl,
                            FinalLiquidFk = ObjectMapper.Map<Liquid, LiquidDto>(fl),
                            SourcePlateChildFk = ObjectMapper.Map<PlateChild, PlateChildDto>(sp),
                            DestinationPlateChildFk = ObjectMapper.Map<PlateChild, PlateChildDto>(dp),
                            InstrumentFk = ObjectMapper.Map<Instrument, InstrumentDto>(ins),
                            TransferVolume = t.TransferVolume,
                            TransferType = t.TransferType,
                            Comments = t.Comments,
                        };

            int totalCount = await base.AsyncExecuter.CountAsync(trans).ConfigureAwait(continueOnCapturedContext: false);

            if (totalCount > 0)
            {
                if (!input.Sorting.IsNullOrWhiteSpace())
                {
                    trans = trans.OrderBy(new ParsingConfig(), input.Sorting);
                }
                trans = trans.Skip(input.SkipCount).Take(input.MaxResultCount);
            }


            //List<LiquidTransferHistoryDto> items = new List<LiquidTransferHistoryDto>();
            //items = ObjectMapper.Map<List<LiquidTransferHistory>, List<LiquidTransferHistoryDto>>(trans.ToList());

            //if (totalCount > 0)
            //{
            //    //trans = base.ApplySorting(trans, input);
            //    //trans = base.ApplyPaging(trans, input);
            //}
            return new PagedResultDto<LiquidTransferHistoryDto>(totalCount, trans.ToList());

        }

    }
}
