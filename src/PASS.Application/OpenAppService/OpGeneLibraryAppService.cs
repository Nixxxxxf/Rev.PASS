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
using Volo.Abp.Uow;

namespace PASS.OpenAppService
{
    public class OpGeneLibraryAppService :
       CrudAppService<Liquid,
           LiquidDto,
           Guid,
           PagedAndSortedResultRequestDto>,
       ILiquidAppService, IOpGeneLibraryAppService
    {
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

        public OpGeneLibraryAppService(
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
            IRepository<ReportItem, Guid> reportItemRepository)
            : base(liquidRepository)
        {
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
        }















    }
}
