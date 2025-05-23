﻿using AutoMapper.Internal.Mappers;
using PASS.Domain.Entities;
using PASS.Dtos;
using PASS.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Payment.Plans;

namespace PASS.AppServices
{
    public class CommonAppService :
            CrudAppService<Liquid,
            LiquidDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        ILiquidAppService
    {
        public readonly IRepository<Liquid, Guid> _liquidRepository;
        public readonly IRepository<LiquidCategory, Guid> _liquidCategoryRepository;
        public readonly IRepository<LiquidAttribute, Guid> _liquidAttributeRepository;
        public readonly IRepository<LiquidPositionInPlate, Guid> _liquidPositionInPlateRepository;
        public readonly IRepository<Plate, Guid> _plateRepository;
        public readonly IRepository<PlateChild, Guid> _plateChildRepository;
        public readonly IRepository<Instrument, Guid> _instrumentRepository;
        public readonly IRepository<LiquidTransferHistory, Guid> _transferHistoryRepository;
        public readonly IRepository<GeneTypingAlgorithm, Guid> _geneTypingAlgorithmRepository;


        public CommonAppService(
            IRepository<Liquid, Guid> liquidRepository,
            IRepository<LiquidCategory, Guid> liquidCategoryRepository,
            IRepository<LiquidAttribute, Guid> liquidAttributeRepository,
            IRepository<LiquidPositionInPlate, Guid> liquidPositionInPlateRepository,
            IRepository<Plate, Guid> plateRepository,
            IRepository<PlateChild, Guid> plateChildRepository,
            IRepository<Instrument, Guid> instrumentRepository,
            IRepository<LiquidTransferHistory, Guid> transferHistoryRepository,
            IRepository<GeneTypingAlgorithm, Guid> geneTypingAlgorithmRepository)
            : base(liquidRepository)
        {
            _liquidRepository = liquidRepository;
            _liquidCategoryRepository = liquidCategoryRepository;
            _liquidAttributeRepository = liquidAttributeRepository;
            _liquidPositionInPlateRepository = liquidPositionInPlateRepository;
            _plateRepository = plateRepository;
            _plateChildRepository = plateChildRepository;
            _instrumentRepository = instrumentRepository;
            _transferHistoryRepository = transferHistoryRepository;
            _geneTypingAlgorithmRepository = geneTypingAlgorithmRepository;
        }

        public async Task<List<PlateDto>> GetAllPlatesAsync()
        {
            var lst = await _plateRepository.GetListAsync();
            var result = ObjectMapper.Map<List<Plate>, List<PlateDto>>(lst).OrderBy(x=>x.Name).ToList();
            return result;
        }

        public async Task<List<InstrumentDto>> GetAllInstrumentsAsync()
        {
            var lst = await _instrumentRepository.GetListAsync();
            var result = ObjectMapper.Map<List<Instrument>, List<InstrumentDto>>(lst).OrderBy(x => x.Name).ToList();
            return result;
        }

        public async Task<List<LiquidCategoryDto>> GetAllLiquidCategoriesAsync()
        {
            var lst = (await _liquidCategoryRepository.GetListAsync()).Distinct().ToList();
            var result = ObjectMapper.Map<List<LiquidCategory>, List<LiquidCategoryDto>>(lst).OrderBy(x=>x.Name).ToList();
            return result;
        }

        public async Task<List<string?>> GetAllCompoundsAsync()
        {
            var lst = (await _liquidCategoryRepository.GetListAsync()).Where(x => x.LiquidType == Enum.LiquidType.Compound).Select(x => x.Name).Distinct().Order().ToList();
            return lst;
        }


        public async Task<List<string?>> GetAllSamplesAsync()
        {
            var lst = (await _liquidCategoryRepository.GetListAsync()).Where(x => x.LiquidType == Enum.LiquidType.Sample).Select(x => x.Name).Distinct().Order().ToList();
            return lst;
        }


        public async Task<List<string?>> GetAllMarkersAsync()
        {
            var lst = (await _liquidCategoryRepository.GetListAsync()).Where(x => x.LiquidType == Enum.LiquidType.Marker).Select(x => x.Name).Distinct().Order().ToList();
            return lst;
        }


        public async Task<List<string?>> GetAllSMILESAsync()
        {
            var lst = (await _liquidCategoryRepository.GetListAsync()).Where(x => x.SMILES != null).Select(x => x.SMILES).Distinct().Order().ToList();
            return lst;
        }

        public async Task<List<GeneTypingAlgorithmDto>> GetAllAlgorithmsAsync()
        {
            var lst = await _geneTypingAlgorithmRepository.GetListAsync();
            var result = ObjectMapper.Map<List<GeneTypingAlgorithm>, List<GeneTypingAlgorithmDto>>(lst).OrderBy(x => x.Name).ToList();
            return result;
        }
    }
}
