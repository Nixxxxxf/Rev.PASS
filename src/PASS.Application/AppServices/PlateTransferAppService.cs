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
    public class PlateTransferAppService :
        CrudAppService<PlateTransferHistory,
            PlateTransferHistoryDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        IPlateTransferAppService
    {
        public readonly IRepository<PlateTransferHistory, Guid> _pltTransferHistoryRepository;
        public readonly IRepository<Plate, Guid> _plateRepository;
        public readonly IRepository<Liquid, Guid> _liquidRepository;
        public readonly IRepository<PlateChild, Guid> _plateChildRepository;
        public readonly IRepository<Instrument, Guid> _instrumentRepository;

        public PlateTransferAppService(IRepository<PlateTransferHistory, Guid> pltTransferHistoryRepository,
            IRepository<Plate, Guid> plateRepository,
            IRepository<Liquid, Guid> liquidRepository,
            IRepository<PlateChild, Guid> plateChildRepository,
            IRepository<Instrument, Guid> instrumentRepository
            )
            : base(pltTransferHistoryRepository)
        {
            _pltTransferHistoryRepository = pltTransferHistoryRepository;
            _plateRepository = plateRepository;
            _liquidRepository = liquidRepository;
            _plateChildRepository = plateChildRepository;
            _instrumentRepository = instrumentRepository;
        }

        public override async Task<PagedResultDto<PlateTransferHistoryDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            IQueryable<PlateTransferHistory> queryTr = (await _pltTransferHistoryRepository.GetQueryableAsync());
            IQueryable<Plate> queryPl = await _plateRepository.GetQueryableAsync();
            IQueryable<Instrument> queryIn = await _instrumentRepository.GetQueryableAsync();

            int totalCount = await base.AsyncExecuter.CountAsync(queryTr).ConfigureAwait(continueOnCapturedContext: false);




            var trans = from t in queryTr
                        join fi in queryIn on t.InstrumentId equals fi.Id
                        join p in queryPl on t.PlateId equals p.Id
                        select new PlateTransferHistory()
                        {
                            InstrumentFk = fi,
                            PlateFk = p,
                            Comments = t.Comments,
                            AssayTime = t.AssayTime,
                            Direction = t.Direction,
                            TransferTime = t.TransferTime,
                        };

            if (totalCount > 0)
            {
                queryTr = base.ApplySorting(queryTr, input);
                //queryTr.OrderBy(x => x.TransferTime);
                queryTr = base.ApplyPaging(queryTr, input);
            }
            //if (totalCount > 0)
            //{
            //    if (!input.Sorting.IsNullOrWhiteSpace())
            //    {
            //        trans = trans.OrderBy(new ParsingConfig(), input.Sorting);
            //    }
            //    trans = trans.Skip(input.SkipCount).Take(input.MaxResultCount);
            //}
            //trans.OrderBy(x => x.CreationTime);

            List<PlateTransferHistoryDto> items = new List<PlateTransferHistoryDto>();
            items = ObjectMapper.Map<List<PlateTransferHistory>, List<PlateTransferHistoryDto>>(trans.ToList());

            return new PagedResultDto<PlateTransferHistoryDto>(totalCount, items);

        }



        public async Task<PagedResultDto<PlateTransferHistoryDto>> GetListWithFilterAsync(string? plateName, string? intrumentName, PagedAndSortedResultRequestDto input)
        {

            IQueryable<PlateTransferHistory> queryTr = (await _pltTransferHistoryRepository.GetQueryableAsync());
            IQueryable<Plate> queryPl = (await _plateRepository.GetQueryableAsync()).WhereIf(!string.IsNullOrEmpty(plateName), x => x.Name == plateName);
            IQueryable<Instrument> queryIn = (await _instrumentRepository.GetQueryableAsync()).WhereIf(!string.IsNullOrEmpty(intrumentName), x => x.Name == intrumentName);


            var trans = from t in queryTr
                        join fi in queryIn on t.InstrumentId equals fi.Id
                        join p in queryPl on t.PlateId equals p.Id
                        select new PlateTransferHistory()
                        {
                            InstrumentFk = fi,
                            PlateFk = p,
                            Comments = t.Comments,
                            AssayTime = t.AssayTime,
                            Direction = t.Direction,
                            TransferTime = t.TransferTime,
                            //CreationTime = t.CreationTime,
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

            //trans.OrderBy(x => x.CreationTime);

            List<PlateTransferHistoryDto> items = new List<PlateTransferHistoryDto>();
            items = ObjectMapper.Map<List<PlateTransferHistory>, List<PlateTransferHistoryDto>>(trans.ToList());

            return new PagedResultDto<PlateTransferHistoryDto>(totalCount, items);

        }






    }
}
