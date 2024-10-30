using Newtonsoft.Json;
using PASS.Domain.Entities;
using PASS.Dtos;
using PASS.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Liquid = PASS.Domain.Entities.Liquid;
using Instrument = PASS.Domain.Entities.Instrument;
//using GraphMolWrap;

namespace PASS.OpenAppService
{
    public class OpTransferAppService :
        CrudAppService<LiquidTransferHistory,
            LiquidTransferHistoryDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        ILiquidTransferAppService
    {

        public readonly IRepository<LiquidTransferHistory, Guid> _transferHistoryRepository;
        public readonly IRepository<Liquid, Guid> _liquidRepository;
        public readonly IRepository<Plate, Guid> _plateRepository;
        public readonly IRepository<PlateChild, Guid> _plateChildRepository;
        public readonly IRepository<Instrument, Guid> _instrumentRepository;



        public OpTransferAppService(
           IRepository<LiquidTransferHistory, Guid> transferHistoryRepository,
           IRepository<Liquid, Guid> liquidRepository,
           IRepository<Plate, Guid> plateRepository,
           IRepository<PlateChild, Guid> plateChildRepository,
           IRepository<Instrument, Guid> instrumentRepository
            )
           : base(transferHistoryRepository)
        {
            _transferHistoryRepository = transferHistoryRepository;
            _liquidRepository = liquidRepository;
            _plateRepository = plateRepository;
            _plateChildRepository = plateChildRepository;
            _instrumentRepository = instrumentRepository;
        }

        [UnitOfWork]
        public Guid Test()
        {
            Guid plateId = GuidGenerator.Create();





            return plateId;
        }


        //[UnitOfWork]
        //public async Task<string> Transfer(TransferHistoryDto transferHistoryDto)
        //{
        //    var response = new ResponseDto();

        //    try
        //    {
        //        // exclude null
        //        if (transferHistoryDto == null 
        //            || string.IsNullOrEmpty(transferHistoryDto.SourceLiquidName)
        //            || string.IsNullOrEmpty(transferHistoryDto.DestinationLiquidName)
        //            || string.IsNullOrEmpty(transferHistoryDto.SourcePlateName)
        //            || string.IsNullOrEmpty(transferHistoryDto.SourceWellName)
        //            || string.IsNullOrEmpty(transferHistoryDto.DestinationPlateName)
        //            || string.IsNullOrEmpty(transferHistoryDto.DestinationWellName) 
        //            || string.IsNullOrEmpty(transferHistoryDto.InstrumentName))
        //        {
        //            return JsonConvert.SerializeObject(response);
        //        }

        //        if (transferHistoryDto.TransferType!=Enum.TransferType.Transfer)
        //        {
        //            response = new ResponseDto() { ErrorCode = -1, ErrorMessage = "Not transfer request, please use 'Mix' API." };
        //            return JsonConvert.SerializeObject(response);

        //        }

        //        // find source liquid
        //        transferHistoryDto.SourceLiquidId = FindLiquid(transferHistoryDto.SourceLiquidName);

        //        // find dest liquid
        //        transferHistoryDto.DestinationLiquidId = FindLiquid(transferHistoryDto.DestinationLiquidName);

        //        // find source plate child
        //        transferHistoryDto.SourcePlateChildId = FindPlateChild(transferHistoryDto.SourcePlateName, transferHistoryDto.SourceWellName);

        //        // find dest plate child
        //        transferHistoryDto.DestinationPlateChildId = FindPlateChild(transferHistoryDto.DestinationPlateName, transferHistoryDto.DestinationWellName);

        //        // find instrument
        //        transferHistoryDto.InstrumentId = FindInstrument(transferHistoryDto.InstrumentName);



        //        //var dbEntity = await _liquidCategoryRepository.FirstOrDefaultAsync(x => x.Name == liquidCategoryDto.Name);
        //        //if (dbEntity == null)
        //        //{
        //        //    await _liquidCategoryRepository.InsertAsync(ObjectMapper.Map<LiquidCategoryDto, LiquidCategory>(liquidCategoryDto));
        //        //}
        //        //else
        //        //{
        //        //    throw new Exception($"Exist {dbEntity.Name}");
        //        //}

        //        //response.ErrorCode = 0;
        //        //response.EntityDto = liquidCategoryDto;

        //        //return JsonConvert.SerializeObject(response);
        //    }
        //    catch (Exception ex)
        //    {
        //        //response.ErrorCode = -1;
        //        //response.ErrorMessage = ex.Message;
        //        //response.EntityDto = liquidCategoryDto;

        //        //return JsonConvert.SerializeObject(response);
        //    }
        //    return JsonConvert.SerializeObject(response);
        //}





        //public async Task<string> Mix(TransferHistoryDto transferHistoryDto)
        //{
        //    var response = new ResponseDto();

        //    try
        //    {
        //        // exclude null
        //        if (transferHistoryDto == null
        //            || string.IsNullOrEmpty(transferHistoryDto.SourceLiquidName)
        //            || string.IsNullOrEmpty(transferHistoryDto.DestinationLiquidName)
        //            || string.IsNullOrEmpty(transferHistoryDto.SourcePlateName)
        //            || string.IsNullOrEmpty(transferHistoryDto.SourceWellName)
        //            || string.IsNullOrEmpty(transferHistoryDto.DestinationPlateName)
        //            || string.IsNullOrEmpty(transferHistoryDto.DestinationWellName))
        //        {
        //            return JsonConvert.SerializeObject(response);
        //        }


        //        // find source liquid


        //        // find dest liquid


        //        // find source plate child


        //        // find dest plate child


        //    }
        //    catch (Exception ex)
        //    {
        //        //response.ErrorCode = -1;
        //        //response.ErrorMessage = ex.Message;
        //        //response.EntityDto = liquidCategoryDto;

        //        //return JsonConvert.SerializeObject(response);
        //    }
        //}















        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///  Sub
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        [UnitOfWork]
        public Guid FindLiquid(string liquidName)
        {
            Guid liquidId = GuidGenerator.Create();
            //liquidId = _liquidRepository.FirstOrDefaultAsync(x=>x.name)




            return liquidId;
        }


        [UnitOfWork]
        public Guid FindPlateChild(string plateName, string wellName)
        {
            Guid plateId = GuidGenerator.Create();





            return plateId;
        }


        [UnitOfWork]
        public Guid FindInstrument(string instrumentName)
        {
            Guid instrumentId = GuidGenerator.Create();





            return instrumentId;
        }
    }
}
