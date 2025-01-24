using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Newtonsoft.Json;
using Polly;
using System.Linq.Expressions;
using System.Numerics;
using Volo.Abp.ObjectMapping;
using AutoMapper.Internal;
using Scriban;
using System.Diagnostics;
using Microsoft.Extensions.Logging;
using PASS.Domain.Entities;
using PASS.Dtos;
using PASS.Interfaces;
using PASS.Enum;
using Volo.Payment.Plans;
using System.IO;
using EasyNetQ.Internals;
using Volo.Abp.Settings;
using Scriban.Syntax;
using Polly.Caching;
using System.Collections;

namespace PASS.OpenAppService
{
    public class OpCompoundLibraryAppService :
        CrudAppService<Liquid,
            LiquidDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        ILiquidAppService, IOpCompoundLibraryAppService
    {
        private readonly ISettingProvider _settingProvider;
        public readonly IUnitOfWorkManager _unitOfWorkManager;
        public readonly IRepository<Liquid, Guid> _liquidRepository;
        public readonly IRepository<LiquidCategory, Guid> _liquidCategoryRepository;
        public readonly IRepository<LiquidAttribute, Guid> _liquidAttributeRepository;
        public readonly IRepository<LiquidPositionInPlate, Guid> _liquidPositionInPlateRepository;
        public readonly IRepository<Plate, Guid> _plateRepository;
        public readonly IRepository<PlateChild, Guid> _plateChildRepository;
        public readonly IRepository<Instrument, Guid> _instrumentRepository;
        public readonly IRepository<LiquidTransferHistory, Guid> _transferHistoryRepository;
        public readonly IRepository<PlateTransferHistory, Guid> _plateTransferHistoryRepository;
        public readonly IRepository<Report, Guid> _reportRepository;
        public readonly IRepository<ReportItem, Guid> _reportItemRepository;
        public readonly IRepository<GeneTypingAlgorithm, Guid> _geneTypingAlgorithmRepository;

        public OpCompoundLibraryAppService(
            ISettingProvider settingProvider,
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<Liquid, Guid> liquidRepository,
            IRepository<LiquidCategory, Guid> liquidCategoryRepository,
            IRepository<LiquidAttribute, Guid> liquidAttributeRepository,
            IRepository<LiquidPositionInPlate, Guid> liquidPositionInPlateRepository,
            IRepository<Plate, Guid> plateRepository,
            IRepository<PlateChild, Guid> plateChildRepository,
            IRepository<Instrument, Guid> instrumentRepository,
            IRepository<LiquidTransferHistory, Guid> transferHistoryRepository,
            IRepository<PlateTransferHistory, Guid> plateTransferHistoryRepository,
            IRepository<Report, Guid> reportRepository,
            IRepository<ReportItem, Guid> reportItemRepository,
            IRepository<GeneTypingAlgorithm, Guid> geneTypingAlgorithmRepository
            )
            : base(liquidRepository)
        {
            _settingProvider = settingProvider;
            _unitOfWorkManager = unitOfWorkManager;
            _liquidRepository = liquidRepository;
            _liquidCategoryRepository = liquidCategoryRepository;
            _liquidAttributeRepository = liquidAttributeRepository;
            _liquidPositionInPlateRepository = liquidPositionInPlateRepository;
            _plateRepository = plateRepository;
            _plateChildRepository = plateChildRepository;
            _instrumentRepository = instrumentRepository;
            _transferHistoryRepository = transferHistoryRepository;
            _plateTransferHistoryRepository = plateTransferHistoryRepository;
            _reportRepository = reportRepository;
            _reportItemRepository = reportItemRepository;
            _geneTypingAlgorithmRepository = geneTypingAlgorithmRepository;
        }


        #region Insert Functions


        /// <summary>
        /// Insert or get single LiquidCategory 
        /// If it exist, return the existing entity
        /// 
        /// Input:
        /// 1. LiquidCategoryDto
        ///     Name
        ///     SMILES
        ///     LiquidType
        ///     
        /// OutPut:
        /// 1. LiquidCategoryDto
        /// 
        /// </summary>
        /// <param name="liquidCategoryDto"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> InsertLiquidCategory(LiquidCategoryDto liquidCategoryDto)
        {
            var response = new ResponseDto();

            try
            {

                var dbliquidCategory = await _liquidCategoryRepository.FirstOrDefaultAsync(x => x.Name == liquidCategoryDto.Name);

                if (dbliquidCategory == null)
                {
                    dbliquidCategory = ObjectMapper.Map<LiquidCategoryDto, LiquidCategory>(liquidCategoryDto);
                    dbliquidCategory.SetId(GuidGenerator.Create());
                    liquidCategoryDto.Id = dbliquidCategory.Id;
                    await _liquidCategoryRepository.InsertAsync(dbliquidCategory);
                }
                else
                {
                    liquidCategoryDto.Id = dbliquidCategory.Id;
                    throw new Exception($"liquidCategory: ({dbliquidCategory.Name}) exist");
                }

                response.ErrorCode = 0;
                response.EntityDto = ObjectMapper.Map<LiquidCategory, LiquidCategoryDto>(dbliquidCategory);

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = liquidCategoryDto;

            }

            return JsonConvert.SerializeObject(response);

        }




        /// <summary>
        /// Insert LiquidCategory List
        /// </summary>
        /// <param name="liquidCategoryDtoList"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> InsertLiquidCategoryList(List<LiquidCategoryDto> liquidCategoryDtoList)
        {
            using (var unitOfWork = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: false))
            {

                var response = new ResponseDto();

                try
                {
                    var dbLst = await _liquidCategoryRepository.GetListAsync();
                    foreach (var liquidCategoryDto in liquidCategoryDtoList)
                    {

                        var dbEntity = dbLst.Find(x => x.Name == liquidCategoryDto.Name);
                        if (dbEntity == null)
                        {
                            await _liquidCategoryRepository.InsertAsync(ObjectMapper.Map<LiquidCategoryDto, LiquidCategory>(liquidCategoryDto));
                        }
                        else
                        {
                            if (string.IsNullOrEmpty(response.ErrorMessage))
                            {
                                response.ErrorMessage = "Existed: ";
                            }
                            response.ErrorMessage += (dbEntity.Name + ", ");
                            //throw new Exception($"LiquidCategory: ({dbEntity.Name}) exist");
                        }

                    }

                    response.ErrorCode = 0;

                }
                catch (Exception ex)
                {
                    response.ErrorCode = -1;
                    response.ErrorMessage = ex.Message + " exist;";

                }


                await unitOfWork.SaveChangesAsync();
                await unitOfWork.CompleteAsync();

                return JsonConvert.SerializeObject(response);


            }

        }



        [UnitOfWork]
        public async Task<string> InsertLiquidCategoryListNew(List<LiquidCategoryDto> liquidCategoryDtoLst)
        {
            var response = new ResponseDto();

            try
            {
                var newDbLst = new List<LiquidCategory>();

                List<LiquidCategory> requestLst = ObjectMapper.Map<List<LiquidCategoryDto>, List<LiquidCategory>>(liquidCategoryDtoLst);
                List<LiquidCategory> oldDbLst = await _liquidCategoryRepository.GetListAsync();

                var existLst = oldDbLst.IntersectBy(requestLst.Select(x => x.Name), x => x.Name);

                var newLst = requestLst.ExceptBy(oldDbLst.Select(x => x.Name), x => x.Name);


                foreach (var dbliquidCategory in newLst)
                {
                    dbliquidCategory.SetId(GuidGenerator.Create());
                    newDbLst.Add(dbliquidCategory);
                }

                await _liquidCategoryRepository.InsertManyAsync(newDbLst);

                if (existLst.Count() > 0)
                {
                    response.ErrorCode = 1;
                    response.ErrorMessage = $"Existed: {JsonConvert.SerializeObject(existLst.Select(x => x.Name).ToList())}";
                }
                else
                {
                    response.ErrorCode = 0;

                }
                //response.EntityDto = ObjectMapper.Map<LiquidCategory, LiquidCategoryDto>(dbliquidCategory);

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                //response.EntityDto = liquidCategoryDto;

            }

            return JsonConvert.SerializeObject(response);

        }



        /// <summary>
        /// Insert Liquid
        /// 
        /// Input:
        /// 1. LiquidDto
        ///     LiquidCategoryFk
        ///         Name
        ///     Volume
        ///     Concentration
        ///     Result
        ///     IsUsed
        ///     Count
        ///     
        /// </summary>
        /// <param name="liquidDto"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> InsertLiquid(LiquidDto liquidDto)
        {
            var response = new ResponseDto();

            try
            {
                if (liquidDto.LiquidCategoryFk == null)
                {
                    throw new Exception($"LiquidCategoryFk cannot be null");
                }

                var dbLiquidCategory = new LiquidCategory();
                if (liquidDto.LiquidCategoryId != default)
                {
                    liquidDto.LiquidCategoryId = liquidDto.LiquidCategoryId;
                }
                else if (liquidDto.LiquidCategoryFk.Id != default)
                {
                    liquidDto.LiquidCategoryId = liquidDto.LiquidCategoryFk.Id;
                }
                else
                {
                    dbLiquidCategory = await _liquidCategoryRepository.FirstOrDefaultAsync(x => x.Name == liquidDto.LiquidCategoryFk!.Name);
                    if (dbLiquidCategory == default(LiquidCategory))
                    {
                        throw new Exception($"LiquidCategory: ({liquidDto.LiquidCategoryFk!.Name}) not exist");
                    }
                    liquidDto.LiquidCategoryId = dbLiquidCategory.Id;
                }

                if (liquidDto.LiquidCategoryId == default)
                {
                    throw new Exception($"LiquidCategory: ({liquidDto.LiquidCategoryFk!.Name}) not exist");
                }

                //liquidDto.LiquidCategoryId = dbLiquidCategory.Id;

                var dbLiquid = ObjectMapper.Map<LiquidDto, Liquid>(liquidDto);
                dbLiquid.LiquidCategoryFk = null;
                dbLiquid.SetId(GuidGenerator.Create());

                await _liquidRepository.InsertAsync(dbLiquid);

                response.ErrorCode = 0;
                response.EntityDto = ObjectMapper.Map<Liquid, LiquidDto>(dbLiquid);

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = liquidDto;

            }
            return JsonConvert.SerializeObject(response);

        }



        [UnitOfWork]
        public async Task<string> InsertPlate(PlateDto plateDto)
        {
            using (var unitOfWork = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: false))
            {
                var response = new ResponseForPlateDto();

                try
                {

                    var dbPlate = await _plateRepository.FirstOrDefaultAsync(x => x.Name == plateDto.Name);
                    if (dbPlate == null)
                    {
                        dbPlate = ObjectMapper.Map<PlateDto, Plate>(plateDto);
                        dbPlate.SetId(GuidGenerator.Create());
                        plateDto.Id = dbPlate.Id;
                        await _plateRepository.InsertAsync(dbPlate);
                    }
                    else
                    {
                        plateDto.Id = dbPlate.Id;
                        throw new Exception($"Plate: ({dbPlate.Name}) exist");
                    }

                    await InsertPlateChildren(ObjectMapper.Map<Plate, PlateDto>(dbPlate));

                    response.ErrorCode = 0;
                    response.EntityDto = plateDto;

                }
                catch (Exception ex)
                {
                    response.ErrorCode = -1;
                    response.ErrorMessage = ex.Message;
                    response.EntityDto = plateDto;

                }
                await unitOfWork.SaveChangesAsync();
                await unitOfWork.CompleteAsync();
                return JsonConvert.SerializeObject(response);
            }
        }




        [UnitOfWork]
        public async Task<string> InsertPlateList(List<PlateDto> plateDtoLst)
        {
            using (var unitOfWork = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: false))
            {
                var response = new ResponseDto();

                try
                {
                    var dbAllPlate = await _plateRepository.GetListAsync();
                    var dbAllPlateNames = dbAllPlate.Select(x => x.Name).ToList();

                    // Exception 1: plate exist
                    foreach (var plate in plateDtoLst)
                    {
                        if (dbAllPlateNames.Contains(plate.Name))
                        {
                            throw new Exception($"Plate: ({plate.Name}) exist");
                        }
                    }

                    foreach (var plateDto in plateDtoLst)
                    {
                        var newPlate = ObjectMapper.Map<PlateDto, Plate>(plateDto);
                        newPlate.SetId(GuidGenerator.Create());
                        await _plateRepository.InsertAsync(newPlate);
                        await InsertPlateChildren(ObjectMapper.Map<Plate, PlateDto>(newPlate));
                    }

                    response.ErrorCode = 0;
                    //response.EntityDto = plateDto;

                }
                catch (Exception ex)
                {
                    response.ErrorCode = -1;
                    response.ErrorMessage = ex.Message;
                    //response.EntityDto = plateDto;

                }
                await unitOfWork.SaveChangesAsync();
                await unitOfWork.CompleteAsync();
                return JsonConvert.SerializeObject(response);

            }

        }





        /// <summary>
        /// Insert plate children based on the size of plate
        /// </summary>
        /// <param name="plateDto"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> InsertPlateChildren(PlateDto plateDto)
        {
            var response = new ResponseDto();

            try
            {
                if (plateDto.Id != default)
                {
                    plateDto.Id = plateDto.Id;
                }
                else
                {
                    var dbPlate = await _plateRepository.FirstOrDefaultAsync(x => x.Name == plateDto.Name);
                    if (dbPlate == null)
                        throw new Exception($"Plate: ({plateDto.Name}) not exist");
                    plateDto.Id = dbPlate.Id;
                }

                var dbPlateChildren = await _plateChildRepository.GetListAsync(x => x.PlateId == plateDto.Id);
                if (dbPlateChildren.Count > 0)
                {
                    throw new Exception($"\"Plate: ({plateDto.Name}) has plate children");
                }

                int row = 0;
                int col = 0;
                List<PlateChild> plateChildren = new List<PlateChild>();
                List<string> rowLst = new List<string>() { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF" };

                switch (plateDto.PlateSize)
                {
                    case 24:
                        row = 4; col = 6; break;
                    case 96:
                        row = 8; col = 12; break;
                    case 384:
                        row = 16; col = 24; break;
                    case 1536:
                        row = 32; col = 48; break;
                    default:
                        break;
                }

                for (int r = 0; r < row; r++)
                {
                    for (int c = 0; c < col; c++)
                    {
                        var rowStr = rowLst[r];
                        var colInt = c + 1;
                        plateChildren.Add(new PlateChild(GuidGenerator.Create())
                        {
                            Row = rowStr,
                            Column = colInt,
                            PlateId = plateDto.Id,
                        });
                    }
                }

                await _plateChildRepository.InsertManyAsync(plateChildren);

                response.ErrorCode = 0;
                response.EntityDto = plateDto;

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = plateDto;

            }


            return JsonConvert.SerializeObject(response);
        }


        [UnitOfWork]
        public async Task<string> InsertLiquidPositionInPlate(LiquidPositionInPlateDto liquidPositionInPlateDto)
        {
            var response = new ResponseDto();

            try
            {
                var oldCombine = await _liquidPositionInPlateRepository.FirstOrDefaultAsync(x => x.PlateChildId == liquidPositionInPlateDto.PlateChildId);
                if (oldCombine != null)
                {
                    oldCombine.LiquidId = liquidPositionInPlateDto.LiquidId;
                    await _liquidPositionInPlateRepository.UpdateAsync(oldCombine);
                    response.ErrorCode = 1;
                }
                else
                {
                    await _liquidPositionInPlateRepository.InsertAsync(ObjectMapper.Map<LiquidPositionInPlateDto, LiquidPositionInPlate>(liquidPositionInPlateDto));
                    response.ErrorCode = 0;
                }

                response.EntityDto = liquidPositionInPlateDto;

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = liquidPositionInPlateDto;

            }

            return JsonConvert.SerializeObject(response);

        }


        [UnitOfWork]
        public async Task<string> InsertInstrument(InstrumentDto instrumentDto)
        {
            var response = new ResponseDto();

            try
            {

                var dbInstrument = await _instrumentRepository.FirstOrDefaultAsync(x => x.Name == instrumentDto.Name);
                if (dbInstrument == null)
                {
                    dbInstrument = ObjectMapper.Map<InstrumentDto, Instrument>(instrumentDto);
                    dbInstrument.SetId(GuidGenerator.Create());
                    instrumentDto.Id = dbInstrument.Id;
                    await _instrumentRepository.InsertAsync(dbInstrument);
                }
                else
                {
                    instrumentDto.Id = dbInstrument.Id;
                    throw new Exception($"Instrument: ({dbInstrument.Name}) exist");
                }

                response.ErrorCode = 0;
                response.EntityDto = instrumentDto;

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = instrumentDto;

            }

            return JsonConvert.SerializeObject(response);

        }



        [UnitOfWork]
        public async Task<string> InsertEchoReport(string reportName, string reportType)
        {
            using (var unitOfWork = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: false))
            {
                var response = new ResponseDto();

                try
                {

                    var dbRep = await _reportRepository.FirstOrDefaultAsync(x => x.ReportName == reportName);
                    if (dbRep == null)
                    {
                        dbRep = new Report()
                        {
                            ReportName = reportName,
                            ReportType = reportType,
                        };
                        dbRep.SetId(GuidGenerator.Create());
                        await _reportRepository.InsertAsync(dbRep);
                    }

                    response.ErrorCode = 0;
                    response.EntityDto = new ReportDto() { Id = dbRep.Id };

                }
                catch (Exception ex)
                {
                    response.ErrorCode = -1;
                    response.ErrorMessage = ex.Message;
                    response.EntityDto = null;

                }
                await unitOfWork.SaveChangesAsync();
                await unitOfWork.CompleteAsync();
                return JsonConvert.SerializeObject(response);
            }
        }


        [UnitOfWork]
        public async Task<string> InsertEchoReportItem(string reportName, string reportType, List<ReportItemDto> reportItemList)
        {
            var response = new ResponseDto();
            try
            {
                var reportId = new Guid();
                var dbRep = await _reportRepository.FirstOrDefaultAsync(x => x.ReportName == reportName);
                if (dbRep == null)
                {
                    var r1 = JsonConvert.DeserializeObject<ResponseForReportDto>(await InsertEchoReport(reportName, reportType));
                    if (r1.ErrorCode < 0)
                        throw new Exception(r1.ErrorMessage);
                    reportId = r1.EntityDto!.Id;
                }
                else
                {
                    reportId = dbRep.Id;
                }


                if (reportItemList == null || reportItemList.Count == 0)
                    throw new Exception("There are no report item in Echo Report.");

                foreach (var reportItem in reportItemList)
                    reportItem.ReportId = reportId;

                await _reportItemRepository.InsertManyAsync(ObjectMapper.Map<List<ReportItemDto>, List<ReportItem>>(reportItemList.ToList()));

                response.ErrorCode = 0;
                response.EntityDto = null;

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = null;

            }

            return JsonConvert.SerializeObject(response);

        }


        #endregion End Insert Functions



        #region Result Update

        /// <summary>
        /// 1. Find Liquid by plate+row+col
        /// 2. Update Liquid result
        /// </summary>
        /// <param name="resultFileDto"></param>
        /// <returns></returns>
        public async Task<string> UpdateLiquidResult(List<ImportResultFileDto> resultFileDtoLst)
        {
            var response = new ResponseDto();

            try
            {
                IQueryable<Liquid> queryLi = await _liquidRepository.WithDetailsAsync(x => x.LiquidCategoryFk);
                IQueryable<PlateChild> queryPc = await _plateChildRepository.WithDetailsAsync(x => x.PlateFk);
                IQueryable<Plate> queryP = await _plateRepository.GetQueryableAsync();
                IQueryable<LiquidPositionInPlate> queryLp = (await _liquidPositionInPlateRepository.WithDetailsAsync(x => x.LiquidFk, x => x.PlateChildFk));
                var liquidQuery = from li in queryLi
                                  join lp in queryLp on li.Id equals lp.LiquidId
                                  join pc in queryPc on lp.PlateChildId equals pc.Id
                                  join p in queryP on pc.PlateId equals p.Id
                                  where p.Name == resultFileDtoLst[0].PlateName
                                  select new ImportResultFileDto()
                                  {
                                      LiquidId = li.Id,
                                      Column = pc.Column,
                                      Row = pc.Row,
                                      PlateName = p.Name,
                                  };
                List<ImportResultFileDto> dbLiquidLst = liquidQuery.ToList();
                if (dbLiquidLst.Count == 0)
                {
                    throw new Exception($"There are no liquid in {resultFileDtoLst[0].PlateName}");
                }
                foreach (var fr in resultFileDtoLst)
                {
                    var dbLiquid = dbLiquidLst.Where(x => x.PlateName == fr.PlateName && x.Row == fr.Row && x.Column == fr.Column).FirstOrDefault();
                    if (dbLiquid == null)
                        continue;
                    var liquidDb = await _liquidRepository.FindAsync(x => x.Id == dbLiquid.LiquidId)!;
                    liquidDb.Result = fr.Result;
                    if (fr.ROX != null && fr.ROX != 0)
                        liquidDb.ROX = fr.ROX;
                    if (fr.FAM != null && fr.FAM != 0)
                        liquidDb.FAM = fr.FAM;
                    if (fr.HEX != null && fr.HEX != 0)
                        liquidDb.HEX = fr.HEX;

                    await _liquidRepository.UpdateAsync(liquidDb);
                }
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
            }

            return JsonConvert.SerializeObject(response);
        }
        #endregion



        #region Find Functions

        [UnitOfWork]
        public async Task<string> FindInstrument(InstrumentDto instrumentDto)
        {
            var response = new ResponseForInstrumentDto();

            try
            {
                var dbEntity = await _instrumentRepository.FirstOrDefaultAsync(x => x.Name == instrumentDto.Name);

                if (dbEntity == null)
                {
                    throw new Exception($"Instrument {instrumentDto.Name} not exist.");
                }

                response.ErrorCode = 0;
                response.EntityDto = ObjectMapper.Map<Instrument, InstrumentDto>(dbEntity);
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = instrumentDto;

            }

            return JsonConvert.SerializeObject(response);
        }


        /// <summary>
        /// Input:
        ///     plateDto.Name
        /// </summary>
        /// <param name="plateDto"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> FindPlate(PlateDto plateDto)
        {
            var response = new ResponseForPlateDto();

            try
            {
                var dbEntity = await _plateRepository.FirstOrDefaultAsync(x => x.Name == plateDto.Name);

                if (dbEntity == null)
                {
                    throw new Exception($"Plate {plateDto.Name} not exist.");
                }

                response.ErrorCode = 0;
                response.EntityDto = ObjectMapper.Map<Plate, PlateDto>(dbEntity);
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = plateDto;

            }

            return JsonConvert.SerializeObject(response);
        }


        /// <summary>
        /// Input: 
        /// 1. plateChildDto.PlateFk.Name
        /// 2. plateChildDto.Row
        /// 3. plateChildDto.Column
        /// 
        /// Output:
        /// 1. plateChild.Id
        /// 
        /// </summary>
        /// <param name="plateChildDto"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> FindPlateChild(PlateChildDto plateChildDto)
        {
            var response = new ResponseDto();

            try
            {
                if (plateChildDto.PlateFk == null || string.IsNullOrEmpty(plateChildDto.PlateFk.Name))
                {
                    throw new Exception("Plate name is null.");
                }

                var dbPlate = await _plateRepository.FirstOrDefaultAsync(x => x.Name == plateChildDto.PlateFk!.Name);

                if (dbPlate == default(Plate))
                {
                    throw new Exception($"Plate name ({plateChildDto.PlateFk.Name}) not exist.");
                }

                var dbPlateChild = await _plateChildRepository.FirstOrDefaultAsync(x => x.PlateId == dbPlate.Id && x.Row == plateChildDto.Row && x.Column == plateChildDto.Column);

                if (dbPlateChild == default(PlateChild))
                {
                    throw new Exception($"Plate child ({dbPlate.Name}, row:{plateChildDto.Row}, col:{plateChildDto.Column}) not exist.");
                }

                response.ErrorCode = 0;
                response.EntityDto = ObjectMapper.Map<PlateChild, PlateChildDto>(dbPlateChild);
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = plateChildDto;

            }

            return JsonConvert.SerializeObject(response);
        }



        /// <summary>
        /// Find Liquid by PlateChild
        /// Table: LiquidPositionInPlate
        /// 
        /// Input: 
        ///     1. Plate Name
        ///     2. Row
        ///     3. Col
        /// 
        /// </summary>
        /// <param name="plateChildDto"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> FindLiquid(PlateChildDto plateChildDto)
        {
            var response = new ResponseDto();

            try
            {
                if (plateChildDto.PlateFk == null || string.IsNullOrEmpty(plateChildDto.PlateFk.Name))
                    throw new Exception("Plate name is null.");

                var dbPlate = await _plateRepository.FirstOrDefaultAsync(x => x.Name == plateChildDto.PlateFk!.Name);
                if (dbPlate == default(Plate))
                    throw new Exception($"Plate: ({plateChildDto.PlateFk.Name}) not exist.");

                var dbPlateChild = await _plateChildRepository.FirstOrDefaultAsync(x => x.PlateId == dbPlate.Id && x.Row == plateChildDto.Row && x.Column == plateChildDto.Column);
                if (dbPlateChild == default(PlateChild))
                    throw new Exception($"Plate child: ({dbPlate.Name}, row:{plateChildDto.Row}, col:{plateChildDto.Column}) not exist.");

                var dbLiquidPosition = await _liquidPositionInPlateRepository.FirstOrDefaultAsync(x => x.PlateChildId == dbPlateChild.Id);
                if (dbLiquidPosition == default(LiquidPositionInPlate))
                    throw new Exception($"Liquid position: (PlateChild Id: {dbPlateChild.Id}, row:{dbPlateChild.Row}, col:{dbPlateChild.Column}) not exist.");

                var dbLiquid = (await _liquidRepository.WithDetailsAsync(x => x.LiquidCategoryFk)).FirstOrDefault(x => x.Id == dbLiquidPosition.LiquidId);

                if (dbLiquidPosition == default(LiquidPositionInPlate))
                    throw new Exception($"Liquid: (PlateChild Id: {dbPlateChild.Id}, row:{dbPlateChild.Row}, col:{dbPlateChild.Column}) not exist.");

                response.ErrorCode = 0;
                response.EntityDto = ObjectMapper.Map<Liquid, LiquidDto>(dbLiquid);

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = plateChildDto;

            }


            return JsonConvert.SerializeObject(response);
        }




        #endregion End Find Functions



        #region Transfer process

        /// <summary>
        /// Input:
        ///     1. Liquid Category Name
        ///     2. Plate Child Dto
        ///         a. Plate Name
        ///         b. Row
        ///         c. Column
        /// </summary>
        /// <param name="liquidPositionInPlateDto"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> InsertLiquidAndCombineWithPlate(LiquidPositionInPlateDto liquidPositionInPlateDto)
        {
            var response = new ResponseForLiquidPositionInPlateDto();

            try
            {
                //Insert Liquid
                if (liquidPositionInPlateDto == null || liquidPositionInPlateDto.LiquidFk == null ||
                    liquidPositionInPlateDto.LiquidFk.LiquidCategoryFk == null ||
                    liquidPositionInPlateDto.LiquidFk.LiquidCategoryFk.Name == null ||
                    liquidPositionInPlateDto.PlateChildFk == null ||
                    liquidPositionInPlateDto.PlateChildFk.PlateFk == null ||
                    liquidPositionInPlateDto.PlateChildFk.PlateFk.Name == null
                    )
                {
                    throw new Exception("Required parameters: LiquidCategoryName, PlateName, PlateRow/Column");
                }

                string rs1 = await InsertLiquid(liquidPositionInPlateDto.LiquidFk!);
                var r1 = JsonConvert.DeserializeObject<ResponseForLiquidDto>(rs1)!;
                if (r1.ErrorCode < 0)
                    throw new Exception(r1.ErrorMessage);
                LiquidDto liquid = r1.EntityDto!;


                //Find PlateChild
                string rs2 = await FindPlateChild(liquidPositionInPlateDto.PlateChildFk!);
                var r2 = JsonConvert.DeserializeObject<ResponseForPlateChildDto>(rs2)!;
                if (r2.ErrorCode < 0)
                    throw new Exception(r2.ErrorMessage);
                PlateChildDto plateChild = r2.EntityDto!;


                //Combine
                string rs3 = await InsertLiquidPositionInPlate(new LiquidPositionInPlateDto() { LiquidId = liquid!.Id, PlateChildId = plateChild!.Id });
                var r3 = JsonConvert.DeserializeObject<ResponseForLiquidPositionInPlateDto>(rs3)!;
                if (r3.ErrorCode < 0)
                    throw new Exception(r3.ErrorMessage);

                response.ErrorCode = r3.ErrorCode;
                response.EntityDto = new LiquidPositionInPlateDto() { LiquidFk = liquid, PlateChildFk = plateChild };

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = liquidPositionInPlateDto;

            }

            return JsonConvert.SerializeObject(response);

        }



        [UnitOfWork]
        public async Task<string> InsertLiquidAndCombineWithPlateList(List<LiquidPositionInPlateDto> liquidPositionInPlateDtoLst)
        {
            var response = new ResponseForLiquidPositionInPlateDto();

            try
            {
                for (int i = 0; i < liquidPositionInPlateDtoLst.Count; i++)
                {
                    var liquidPositionInPlateDto = liquidPositionInPlateDtoLst[i];
                    //Insert Liquid
                    if (liquidPositionInPlateDto == null || liquidPositionInPlateDto.LiquidFk == null ||
                        liquidPositionInPlateDto.LiquidFk.LiquidCategoryFk == null ||
                        liquidPositionInPlateDto.LiquidFk.LiquidCategoryFk.Name == null ||
                        liquidPositionInPlateDto.PlateChildFk == null ||
                        liquidPositionInPlateDto.PlateChildFk.PlateFk == null ||
                        liquidPositionInPlateDto.PlateChildFk.PlateFk.Name == null
                        )
                    {
                        throw new Exception("Required parameters: LiquidCategoryName, PlateName, PlateRow/Column");
                    }

                    string rs1 = await InsertLiquid(liquidPositionInPlateDto.LiquidFk!);
                    var r1 = JsonConvert.DeserializeObject<ResponseForLiquidDto>(rs1)!;
                    if (r1.ErrorCode < 0)
                        throw new Exception(r1.ErrorMessage);
                    LiquidDto liquid = r1.EntityDto!;


                    //Find PlateChild
                    string rs2 = await FindPlateChild(liquidPositionInPlateDto.PlateChildFk!);
                    var r2 = JsonConvert.DeserializeObject<ResponseForPlateChildDto>(rs2)!;
                    if (r2.ErrorCode < 0)
                        throw new Exception(r2.ErrorMessage);
                    PlateChildDto plateChild = r2.EntityDto!;


                    //Combine
                    string rs3 = await InsertLiquidPositionInPlate(new LiquidPositionInPlateDto() { LiquidId = liquid!.Id, PlateChildId = plateChild!.Id });
                    var r3 = JsonConvert.DeserializeObject<ResponseForLiquidPositionInPlateDto>(rs3)!;
                    if (r3.ErrorCode < 0)
                        throw new Exception(r3.ErrorMessage);

                    response.ErrorCode = r3.ErrorCode;
                    response.EntityDto = new LiquidPositionInPlateDto() { LiquidFk = liquid, PlateChildFk = plateChild };

                }

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                //response.EntityDto = liquidPositionInPlateDto;

            }

            return JsonConvert.SerializeObject(response);

        }






        /// <summary>
        /// Input:
        ///     1. Liquid Id
        ///     2. Plate Child Dto
        ///         a. Plate Name
        ///         b. Row
        ///         c. Column
        /// </summary>
        /// <param name="liquidAndPlateCombineDto"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> DeleteLiquidPlateCombineById(LiquidPositionInPlateDto liquidPositionInPlateDto)
        {
            var response = new ResponseDto();

            try
            {
                // Insert Liquid
                if (liquidPositionInPlateDto.LiquidId == default(Guid) || liquidPositionInPlateDto.PlateChildId == default(Guid))
                {
                    throw new Exception("Required parameters: LiquidId, PlateChildId");
                }

                // Delete Combine
                await _liquidPositionInPlateRepository.DeleteAsync(ObjectMapper.Map<LiquidPositionInPlateDto, LiquidPositionInPlate>(liquidPositionInPlateDto));

                response.ErrorCode = 0;
                response.EntityDto = liquidPositionInPlateDto;

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = liquidPositionInPlateDto;

            }

            return JsonConvert.SerializeObject(response);

        }

        /// <summary>
        /// 1. 吸 板里的(化合物/细胞)A，排 空板/(化合物/细胞)AA
        /// 
        /// Input:
        ///     1. SourcePlateChildFk
        ///         PlateFk.Name, Row, Col
        ///     2. DestinationPlateChildFk
        ///         PlateFk.Name, Row, Col
        ///     3. TransferVolume
        ///     4. InstrumentFk
        ///         Name
        ///     5. Comments
        /// </summary>
        /// <param name="transferHistoryDto"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> CherryPickToEmpty(LiquidTransferHistoryDto transferHistoryDto)
        {
            var response = new ResponseDto();

            try
            {
                var trans = new LiquidTransferHistory();

                // Exception
                if (transferHistoryDto == null
                    || transferHistoryDto.SourcePlateChildFk == null
                    || transferHistoryDto.DestinationPlateChildFk == null
                    || transferHistoryDto.InstrumentFk == null)
                {
                    throw new Exception("Request is not complete");
                }
                else if (transferHistoryDto.TransferType != Enum.TransferType.Transfer)
                {
                    throw new Exception("TransferType error, only accept '0'");
                }

                // Find Source Liquid Id by PlateChild
                var r1 = JsonConvert.DeserializeObject<ResponseForLiquidDto>(await FindLiquid(transferHistoryDto.SourcePlateChildFk!));
                if (r1.ErrorCode < 0)
                    throw new Exception(r1.ErrorMessage);
                LiquidDto srcliquid = r1.EntityDto!;
                if (srcliquid == null || srcliquid.Id == default(Guid))
                    throw new Exception($"Cannot find source liquid by plate child: ({JsonConvert.SerializeObject(transferHistoryDto.SourcePlateChildFk)}) ");

                // Dest Liquid is empty
                LiquidDto dstLiquid = new LiquidDto();


                // Final Liquid is the same as Source Liquid
                LiquidDto fnlLiquid = srcliquid;


                // Find Source PlateChild Id
                var r2 = JsonConvert.DeserializeObject<ResponseForPlateChildDto>(await FindPlateChild(transferHistoryDto.SourcePlateChildFk!));
                if (r2.ErrorCode < 0)
                    throw new Exception(r2.ErrorMessage);
                PlateChildDto srcPlateChild = r2.EntityDto!;
                if (srcPlateChild == null || srcPlateChild.Id == default(Guid))
                    throw new Exception($"Cannot find source plate child: ({JsonConvert.SerializeObject(transferHistoryDto.SourcePlateChildFk)}) ");


                // Find Destination PlateChild Id
                var r3 = JsonConvert.DeserializeObject<ResponseForPlateChildDto>(await FindPlateChild(transferHistoryDto.DestinationPlateChildFk!));
                if (r3.ErrorCode < 0)
                    throw new Exception(r3.ErrorMessage);
                PlateChildDto dstPlateChild = r3.EntityDto!;
                if (dstPlateChild == null || dstPlateChild.Id == default(Guid))
                    throw new Exception($"Cannot find destination plate child: ({JsonConvert.SerializeObject(transferHistoryDto.DestinationPlateChildFk)}) ");


                // Combine Destination PlateChild with Final Liquid
                var r4 = JsonConvert.DeserializeObject<ResponseForLiquidPositionInPlateDto>(await InsertLiquidPositionInPlate(new LiquidPositionInPlateDto() { LiquidId = fnlLiquid.Id, PlateChildId = dstPlateChild.Id }));
                if (r4.ErrorCode < 0)
                    throw new Exception(r4.ErrorMessage);


                // Find Instrument Id
                var r5 = JsonConvert.DeserializeObject<ResponseForInstrumentDto>(await FindInstrument(transferHistoryDto.InstrumentFk!));
                if (r5.ErrorCode < 0)
                    throw new Exception(r5.ErrorMessage);
                InstrumentDto instrument = r5.EntityDto!;
                if (instrument == null || instrument.Id == default(Guid))
                    throw new Exception($"Cannot find instrument: ({JsonConvert.SerializeObject(transferHistoryDto.InstrumentFk)}) ");


                // Insert to DB
                trans.SetId(GuidGenerator.Create());
                trans.TransferType = Enum.TransferType.Transfer;
                trans.SourceLiquidId = srcliquid.Id;
                trans.DestinationLiquidId = dstLiquid.Id;
                trans.FinalLiquidId = fnlLiquid.Id;
                trans.SourcePlateChildId = srcPlateChild.Id;
                trans.DestinationPlateChildId = dstPlateChild.Id;
                trans.TransferVolume = transferHistoryDto.TransferVolume;
                trans.InstrumentId = instrument.Id;
                trans.Comments = transferHistoryDto.Comments;

                await _transferHistoryRepository.InsertAsync(trans);

                // Response
                response.ErrorCode = 0;
                response.EntityDto = ObjectMapper.Map<LiquidTransferHistory, LiquidTransferHistoryDto>(trans);
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = transferHistoryDto;

            }

            return JsonConvert.SerializeObject(response);

        }



        /// <summary>
        /// 1. 吸 板里的(化合物/细胞)A，排 板里的(化合物/细胞)B
        /// 
        /// Input:
        ///     1. SourcePlateChildFk
        ///         PlateFk.Name, Row, Col
        ///     2. DestinationPlateChildFk
        ///         PlateFk.Name, Row, Col
        ///     3. TransferVolume
        ///     4. InstrumentFk.Name
        ///     5. Comments
        /// </summary>
        /// <param name="transferHistoryDto"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> CherryPickMix(LiquidTransferHistoryDto transferHistoryDto, LiquidType fnLiquidType)
        {
            var response = new ResponseForTransferHistoryDto();

            try
            {
                var trans = new LiquidTransferHistory();

                // Exception
                if (transferHistoryDto == null
                    || transferHistoryDto.SourcePlateChildFk == null
                    || transferHistoryDto.DestinationPlateChildFk == null
                    || transferHistoryDto.InstrumentFk == null)
                {
                    throw new Exception("Request is not complete");
                }
                else if (transferHistoryDto.TransferType != Enum.TransferType.Mix)
                {
                    throw new Exception("TransferType error, only accept '1'");
                }

                // Find Source Liquid Id by Plate, row, col
                var r1 = JsonConvert.DeserializeObject<ResponseForLiquidDto>(await FindLiquid(transferHistoryDto.SourcePlateChildFk!));
                if (r1.ErrorCode < 0)
                    throw new Exception(r1.ErrorMessage);
                LiquidDto srcliquid = r1.EntityDto!;
                if (srcliquid == null || srcliquid.Id == default(Guid))
                    throw new Exception($"Cannot find source liquid by plate child: ({JsonConvert.SerializeObject(transferHistoryDto.SourcePlateChildFk)}) ");

                // Find Dest Liquid Id by Plate, row, col
                var r2 = JsonConvert.DeserializeObject<ResponseForLiquidDto>(await FindLiquid(transferHistoryDto.DestinationPlateChildFk!));
                if (r2.ErrorCode < 0)
                    throw new Exception(r2.ErrorMessage);
                LiquidDto dstLiquid = r2.EntityDto!;
                if (dstLiquid == null || dstLiquid.Id == default(Guid))
                    throw new Exception($"Cannot find liquid by plate child: ({JsonConvert.SerializeObject(transferHistoryDto.SourcePlateChildFk)}) ");


                // Find Source PlateChild Id
                var r6 = JsonConvert.DeserializeObject<ResponseForPlateChildDto>(await FindPlateChild(transferHistoryDto.SourcePlateChildFk!));
                if (r6.ErrorCode < 0)
                    throw new Exception(r6.ErrorMessage);
                PlateChildDto srcPlateChild = r6.EntityDto!;
                if (srcPlateChild == null || srcPlateChild.Id == default(Guid))
                    throw new Exception($"Cannot find source plate child: ({JsonConvert.SerializeObject(transferHistoryDto.SourcePlateChildFk)}) ");


                // Find Destination PlateChild Id
                var r7 = JsonConvert.DeserializeObject<ResponseForPlateChildDto>(await FindPlateChild(transferHistoryDto.DestinationPlateChildFk!));
                if (r7.ErrorCode < 0)
                    throw new Exception(r7.ErrorMessage);
                PlateChildDto dstPlateChild = r7.EntityDto!;
                if (dstPlateChild == null || dstPlateChild.Id == default(Guid))
                    throw new Exception($"Cannot find destination plate child: ({JsonConvert.SerializeObject(transferHistoryDto.DestinationPlateChildFk)}) ");



                // Final Liquid is the new liquid
                // 1. Insert new LiquidCategory
                // 2. Recombine (dest plate child, dest liquid) => (dest plate child, final liquid)
                var r3 = JsonConvert.DeserializeObject<ResponseForLiquidCategoryDto>(await InsertLiquidCategory(new LiquidCategoryDto() { Name = $"{srcliquid.LiquidCategoryFk!.Name}>>{dstLiquid.LiquidCategoryFk!.Name}", LiquidType = fnLiquidType }));//Enum.LiquidType.CompoundCellMix
                if (r3.ErrorCode < 0)
                    throw new Exception(r3.ErrorMessage);
                LiquidCategoryDto lc = r3.EntityDto!;

                // Volume calculation, result in final liquid
                var r5 = JsonConvert.DeserializeObject<ResponseForLiquidPositionInPlateDto>(
                    await InsertLiquidAndCombineWithPlate(
                        new LiquidPositionInPlateDto()
                        {
                            LiquidFk = new LiquidDto()
                            {
                                LiquidCategoryFk = lc,
                                Volume = transferHistoryDto.TransferVolume + dstLiquid.Volume,
                                Concentration = srcliquid.Concentration //compound concentration
                            },
                            PlateChildFk = dstPlateChild
                        }));
                if (r5.ErrorCode < 0)
                    throw new Exception(r5.ErrorMessage);
                LiquidDto fnlLiquid = r5.EntityDto!.LiquidFk!;


                // Find Instrument Id
                var r8 = JsonConvert.DeserializeObject<ResponseForInstrumentDto>(await FindInstrument(transferHistoryDto.InstrumentFk!));
                if (r8.ErrorCode < 0)
                    throw new Exception(r8.ErrorMessage);
                InstrumentDto instrument = r8.EntityDto!;
                if (instrument == null || instrument.Id == default(Guid))
                    throw new Exception($"Cannot find instrument: ({JsonConvert.SerializeObject(transferHistoryDto.InstrumentFk)}) ");


                // Insert to DB
                trans.SetId(GuidGenerator.Create());
                trans.TransferType = Enum.TransferType.Mix;
                trans.SourceLiquidId = srcliquid.Id;
                trans.DestinationLiquidId = dstLiquid.Id;
                trans.FinalLiquidId = fnlLiquid.Id;
                trans.SourcePlateChildId = srcPlateChild.Id;
                trans.DestinationPlateChildId = dstPlateChild.Id;
                trans.TransferVolume = transferHistoryDto.TransferVolume;
                trans.InstrumentId = instrument.Id;
                trans.Comments = transferHistoryDto.Comments;
                trans.Result = transferHistoryDto.Result;

                await _transferHistoryRepository.InsertAsync(trans);

                // Response
                response.ErrorCode = 0;
                response.EntityDto = ObjectMapper.Map<LiquidTransferHistory, LiquidTransferHistoryDto>(trans);
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = transferHistoryDto;

            }

            return JsonConvert.SerializeObject(response);

        }




        /// <summary>
        /// Insert Or Update LiquidAttribute
        /// 1. check liquid category exist or not
        /// 2. check liquid attribute exist or not
        /// </summary>
        /// <param name="liquidAttributeDto"></param>
        /// <returns></returns>
        [UnitOfWork]
        public async Task<string> InsertOrUpdateLiquidAttribute(LiquidAttributeDto liquidAttributeDto)
        {
            var response = new ResponseDto();

            try
            {
                if (liquidAttributeDto.LiquidCategoryFk == null || string.IsNullOrEmpty(liquidAttributeDto.LiquidCategoryFk.Name))
                {
                    response.ErrorCode = -2;
                    response.ErrorMessage = "LiquidCategory is empty";
                    throw new Exception();
                }

                var liquidCategory = await _liquidCategoryRepository.FirstOrDefaultAsync(x => x.Name == liquidAttributeDto.LiquidCategoryFk.Name);
                if (liquidCategory == null)
                {
                    response.ErrorCode = -3;
                    response.ErrorMessage = "LiquidCategory not exist";
                    throw new Exception();
                }

                var attrList = await _liquidAttributeRepository.GetListAsync(x => x.LiquidCategoryId == liquidCategory.Id);
                bool isExist = false;
                foreach (var attr in attrList)
                {
                    if (attr.AttributeName == liquidAttributeDto.AttributeName)
                    {
                        if (attr.AttributeValue != liquidAttributeDto.AttributeValue)
                        {
                            isExist = true;
                            liquidAttributeDto.Id = attr.Id;
                            await _liquidAttributeRepository.UpdateAsync(ObjectMapper.Map<LiquidAttributeDto, LiquidAttribute>(liquidAttributeDto));

                            response.ErrorCode = 1;
                            break;
                        }
                    }
                }

                if (!isExist)
                {
                    await _liquidAttributeRepository.InsertAsync(ObjectMapper.Map<LiquidAttributeDto, LiquidAttribute>(liquidAttributeDto));
                    response.ErrorCode = 0;

                }

                return JsonConvert.SerializeObject(response);
            }
            catch (Exception)
            {

                return JsonConvert.SerializeObject(response);


            }
        }


        #endregion End Transfer process



        #region Import csv/excel


        public async Task<string> ImportCompoundLibrary(List<ImportLiquidPlateDto> liquidPlateLst)
        {
            return await this.ImportLiquidPlate(liquidPlateLst, LiquidType.Compound);
        }



        public async Task<string> ImportCellPlate(List<ImportLiquidPlateDto> liquidPlateLst)
        {
            return await this.ImportLiquidPlate(liquidPlateLst, LiquidType.Cell);
        }


        public async Task<string> ImportDMSOPlate(List<ImportLiquidPlateDto> liquidPlateLst)
        {
            return await this.ImportLiquidPlate(liquidPlateLst, LiquidType.DMSO);
        }

        public async Task<string> ImportSamplePlate(List<ImportLiquidPlateDto> liquidPlateLst)
        {
            return await this.ImportLiquidPlate(liquidPlateLst, LiquidType.Sample);
        }

        public async Task<string> ImportMarkerPlate(List<ImportLiquidPlateDto> liquidPlateLst)
        {
            return await this.ImportLiquidPlate(liquidPlateLst, LiquidType.Marker);
        }


        /// <summary>
        /// three steps
        /// 1. insert plate </summary>
        /// 2. insert liquid category<param name="liquidPlateLst"></param>
        /// 3. insert liquid and combine with plate<param name="liquidType"></param>
        /// <returns></returns>
        private async Task<string> ImportLiquidPlate(List<ImportLiquidPlateDto> liquidPlateLst, LiquidType liquidType)
        {
            var response = new ResponseDto();

            try
            {
                var plateLst = new List<PlateDto>();
                var liquidCgLst = new List<LiquidCategoryDto>();
                var liquidPositionLst = new List<LiquidPositionInPlateDto>();

                // plate list
                var plateNames = liquidPlateLst.Select(x => x.PlateName).Distinct().ToList();
                foreach (var plateName in plateNames)
                {
                    var rows = liquidPlateLst.Where(x => x.PlateName == plateName).Select(x => x.Row).ToList();
                    var size = CalculatePlateSize(rows!);
                    plateLst.Add(new PlateDto() { Name = plateName, PlateSize = size });
                }

                // category list
                var existCategoryNameList = new List<string?>();
                foreach (var c in liquidPlateLst)
                {
                    if (existCategoryNameList.Contains(c.Name))
                        continue;

                    var category = ObjectMapper.Map<ImportLiquidPlateDto, LiquidCategoryDto>(c);
                    category.LiquidType = liquidType;//new LiquidCategoryDto() { Name = c.LiquidName, LiquidType = liquidType, SMILES = c.SMILES, };
                    liquidCgLst.Add(category);
                    existCategoryNameList.Add(c.Name);
                }

                // liquid position
                foreach (var c in liquidPlateLst)
                {
                    var category = ObjectMapper.Map<ImportLiquidPlateDto, LiquidCategoryDto>(c);
                    category.LiquidType = liquidType;//new LiquidCategoryDto() { Name = c.LiquidName, LiquidType = liquidType, SMILES = c.SMILES, };
                    var liquid = new LiquidDto() { LiquidCategoryFk = category, Volume = c.Volume, Concentration = c.Concentration };
                    var plate = new PlateDto() { Name = c.PlateName };
                    var plateChild = new PlateChildDto() { PlateFk = plate, Column = c.Column, Row = c.Row };
                    var liquidPosition = new LiquidPositionInPlateDto() { LiquidFk = liquid, PlateChildFk = plateChild };

                    liquidPositionLst.Add(liquidPosition);
                }

                // insert
                var r1 = JsonConvert.DeserializeObject<ResponseDto>(await InsertPlateList(plateLst));
                if (r1.ErrorCode < 0)
                    throw new Exception(r1.ErrorMessage);

                var r2 = JsonConvert.DeserializeObject<ResponseDto>(await InsertLiquidCategoryList(liquidCgLst));
                if (r2.ErrorCode < 0)
                    throw new Exception(r2.ErrorMessage);

                var r3 = JsonConvert.DeserializeObject<ResponseForLiquidPositionInPlateDto>(await InsertLiquidAndCombineWithPlateList(liquidPositionLst));
                if (r3.ErrorCode < 0)
                    throw new Exception(r3.ErrorMessage);

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
            }

            return JsonConvert.SerializeObject(response);
        }



        /// <summary>
        /// 1. insert destPlate
        /// 2. find plate child which contains liquid
        /// 3. cherry pick to empty
        /// </summary>
        /// <param name="pltLst"></param>
        /// <returns></returns>
        public async Task<string> ImportPlateCopy(List<ImportPlateCopyDto> pltLst)
        {
            var response = new ResponseDto();

            try
            {
                foreach (var plate in pltLst)
                {

                    // find sourcePlate
                    var r1 = JsonConvert.DeserializeObject<ResponseForPlateDto>(await FindPlate(new PlateDto() { Name = plate.SourcePlateName }));
                    if (r1.ErrorCode < 0)
                        throw new Exception(r1.ErrorMessage);
                    PlateDto sourcePlate = r1.EntityDto!;

                    // find plate child which contains liquid
                    IQueryable<PlateChild> queryPc = await _plateChildRepository.WithDetailsAsync(x => x.PlateFk);
                    IQueryable<LiquidPositionInPlate> queryLp = (await _liquidPositionInPlateRepository.WithDetailsAsync(x => x.LiquidFk, x => x.PlateChildFk));
                    var plateChildQuery = from pc in queryPc
                                          join lp in queryLp on pc.Id equals lp.PlateChildId
                                          where pc.PlateFk!.Name == plate.SourcePlateName
                                          select pc;
                    List<PlateChildDto> sourcePlateChildLst = ObjectMapper.Map<List<PlateChild>, List<PlateChildDto>>(plateChildQuery.ToList());

                    // insert destPlate
                    var r2 = JsonConvert.DeserializeObject<ResponseForPlateDto>(await InsertPlate(new PlateDto() { Name = plate.DestPlateName, PlateSize = sourcePlate.PlateSize, PlateType = sourcePlate.PlateType }));
                    if (r2.ErrorCode < 0)
                        throw new Exception(r2.ErrorMessage);
                    var destPlate = r2.EntityDto;


                    List<LiquidTransferHistoryDto> transLst = new List<LiquidTransferHistoryDto>();

                    foreach (var spc in sourcePlateChildLst)
                    {
                        var trans = new LiquidTransferHistoryDto()
                        {
                            SourcePlateChildFk = spc,
                            DestinationPlateChildFk = new PlateChildDto() { PlateFk = destPlate, Row = spc.Row, Column = spc.Column },
                            TransferVolume = -1, //to do
                            InstrumentFk = new InstrumentDto() { Name = "VirtualInstrument" },
                            Comments = "ImportPlateCopy"
                        };
                        transLst.Add(trans);
                    }

                    // cherry pick to empty
                    foreach (var trans in transLst)
                    {
                        var r3 = JsonConvert.DeserializeObject<ResponseForPlateDto>(await CherryPickToEmpty(trans));
                        if (r3.ErrorCode < 0)
                            throw new Exception(r3.ErrorMessage);
                    }
                }
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
            }

            return JsonConvert.SerializeObject(response);
        }



        public async Task<string> ImportCompoundCellMix(List<LiquidTransferHistoryDto> pickLst)
        {
            var response = new ResponseForTransferHistoryDto();

            try
            {
                foreach (var pick in pickLst)
                {
                    var r1 = JsonConvert.DeserializeObject<ResponseForTransferHistoryDto>(await CherryPickMix(pick, Enum.LiquidType.CompoundCellMix));
                    if (r1.ErrorCode < 0)
                        throw new Exception(r1.ErrorMessage);
                    response = r1;
                }
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
            }

            return JsonConvert.SerializeObject(response);
        }


        public async Task<string> ImportSampleMarkerMix(List<LiquidTransferHistoryDto> pickLst)
        {
            var response = new ResponseForTransferHistoryDto();

            try
            {
                foreach (var pick in pickLst)
                {
                    var r1 = JsonConvert.DeserializeObject<ResponseForTransferHistoryDto>(await CherryPickMix(pick, Enum.LiquidType.SampleMarkerMix));
                    if (r1.ErrorCode < 0)
                        throw new Exception(r1.ErrorMessage);
                    response = r1;
                }
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
            }

            return JsonConvert.SerializeObject(response);
        }



        public async Task<string> ImportResultFile(List<ImportResultFileDto> pltLst)
        {
            var response = new ResponseDto();

            try
            {
                var r1 = JsonConvert.DeserializeObject<ResponseDto>(await UpdateLiquidResult(pltLst));
                if (r1.ErrorCode < 0)
                    throw new Exception(r1.ErrorMessage);
                response = r1;
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
            }

            return JsonConvert.SerializeObject(response);
        }


        //public async Task<string> ImportEchoReport(ReportDto reportDto)
        //{
        //    var response = new ResponseDto();
        //    try
        //    {
        //        var r1 = JsonConvert.DeserializeObject<ResponseForReportDto>(await InsertEchoReport(reportDto));
        //        if (r1.ErrorCode < 0)
        //            throw new Exception(r1.ErrorMessage);

        //        var r2 = JsonConvert.DeserializeObject<ResponseForReportDto>(await InsertEchoReportItem(reportDto));
        //        if (r2.ErrorCode < 0)
        //            throw new Exception(r2.ErrorMessage);
        //    }
        //    catch (Exception ex)
        //    {
        //        response.ErrorCode = -1;
        //        response.ErrorMessage = ex.Message;
        //    }

        //    return JsonConvert.SerializeObject(response);

        //}

        public async Task<string> ImportEchoReportItemList(string reportName, string reportType, List<ReportItemDto> reportItemList)
        {
            var response = new ResponseDto();
            try
            {
                var r1 = JsonConvert.DeserializeObject<ResponseForReportDto>(await InsertEchoReport(reportName, reportType));
                if (r1.ErrorCode < 0)
                    throw new Exception(r1.ErrorMessage);

                var r2 = JsonConvert.DeserializeObject<ResponseForReportDto>(await InsertEchoReportItem(reportName, reportType, reportItemList));
                if (r2.ErrorCode < 0)
                    throw new Exception(r2.ErrorMessage);
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
            }

            return JsonConvert.SerializeObject(response);

        }


        #endregion



        #region Plate transfer

        public async Task<string> ImportPlateTransfer(PlateTransferHistoryDto plateTrans)
        {
            var response = new ResponseDto();

            try
            {
                var inst = (await _instrumentRepository.GetListAsync()).Where(x => x.Component == plateTrans.InstrumentFk!.Component).FirstOrDefault();
                var plate = (await _plateRepository.GetListAsync()).Where(x => x.Name == plateTrans.PlateFk!.Name).FirstOrDefault();

                if (inst == default(Instrument))
                    throw new Exception($"No instrument with Component ID: {plateTrans.InstrumentFk!.Component}");

                if (plate == default(Plate))
                    throw new Exception($"No Plate with Name: {plateTrans.PlateFk!.Name}");

                var dbEntity = new PlateTransferHistory()
                {
                    PlateId = plate.Id,
                    InstrumentId = inst.Id,
                    Direction = plateTrans.Direction,
                    AssayTime = plateTrans.AssayTime,
                    TransferTime = plateTrans.TransferTime,
                    Comments = plateTrans.Comments,
                };

                await _plateTransferHistoryRepository.InsertAsync(dbEntity);

                response.ErrorCode = 0;
                response.EntityDto = plateTrans;

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
                response.EntityDto = plateTrans;

            }

            return JsonConvert.SerializeObject(response);
        }


        #endregion



        #region sample marker transfer
        public async Task<string> ImportNivoResult(List<ImportResultFileDto> pltLst)
        {
            var response = new ResponseDto();

            try
            {
                var r1 = JsonConvert.DeserializeObject<ResponseDto>(await UpdateLiquidResult(pltLst));
                if (r1.ErrorCode < 0)
                    throw new Exception(r1.ErrorMessage);
                response = r1;
            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
            }

            return JsonConvert.SerializeObject(response);
        }



        #endregion



        #region typing algorithm, k-means

        public async Task<string> CallPythonAlgorithmKMean(string plateName)
        {
            var response = new ResponseDto();
            // get all data
            try
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

                List<LiquidPositionInPlateDto> dataLst = new List<LiquidPositionInPlateDto>();
                dataLst = ObjectMapper.Map<List<LiquidPositionInPlate>, List<LiquidPositionInPlateDto>>(liquidPositionQuery.ToList());
                KMeansInputDto input = new KMeansInputDto()
                {
                    Clusters = 4,
                    ControlWell = "A1",//to do
                    Data = dataLst
                };
                string jsonData = JsonConvert.SerializeObject(input);

                // start python
                //string scriptName = "C:\\PASS\\PythonScript\\08_PASS_K-Mean_Algorithm.py"; 
                var alg = (await _geneTypingAlgorithmRepository.GetListAsync()).Where(x => x.Name!.ToLower() == "k-means").FirstOrDefault();
                if (alg == default(GeneTypingAlgorithm) || string.IsNullOrEmpty(alg.Content))
                {
                    response.ErrorCode = -2;
                    response.ErrorMessage = "K-Means setting error. No python script file path.";
                    return JsonConvert.SerializeObject(response);
                }

                var scriptName = alg.Content;

                ProcessStartInfo startInfo = new ProcessStartInfo
                {
                    FileName = "python",
                    Arguments = $"\"{scriptName}\"",
                    UseShellExecute = false,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true
                };
                string pythonResponse;

                using (Process process = Process.Start(startInfo))
                {
                    using (StreamWriter sw = process.StandardInput)
                    {
                        if (sw.BaseStream.CanWrite)
                        {
                            sw.Write(jsonData);
                        }
                    }

                    pythonResponse = process.StandardOutput.ReadToEnd();

                    process.WaitForExit(60 * 1000);

                    Console.WriteLine("Result from Python: " + pythonResponse);
                }

                // parse output
                if (string.IsNullOrEmpty(pythonResponse))
                {
                    throw new Exception("No python response");
                }
                KMeansOutputDto output = JsonConvert.DeserializeObject<KMeansOutputDto>(pythonResponse);

                response.ErrorCode = 1;
                response.ErrorMessage = pythonResponse;

            }
            catch (Exception ex)
            {
                response.ErrorCode = -1;
                response.ErrorMessage = ex.Message;
            }

            return JsonConvert.SerializeObject(response);
        }



        #endregion






        #region Utility

        private int CalculatePlateSize(List<string> rowLst)
        {
            int size = 96;// default=96

            List<string> rows = new List<string>() { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF" };

            if (rowLst.Contains("AF"))
            {
                size = 1536; //32*48
                return size;
            }

            if (rowLst.Contains("P"))
            {
                size = 384; //16*24
                return size;
            }

            if (rowLst.Contains("H"))
            {
                size = 96; //8*12
                return size;
            }

            if (rowLst.Contains("D"))
            {
                size = 24; //4*6
                return size;
            }

            return size;
        }





        #endregion
    }
}
