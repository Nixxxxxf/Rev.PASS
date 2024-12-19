using AutoMapper;
using PASS.Domain.Entities;
using PASS.Dtos;

namespace PASS;

public class PASSApplicationAutoMapperProfile : Profile
{
    public PASSApplicationAutoMapperProfile()
    {
        /* You can configure your AutoMapper mapping configuration here.
         * Alternatively, you can split your mapping configurations
         * into multiple profile classes for a better organization. */
        CreateMap<Liquid, LiquidDto>().ReverseMap();
        CreateMap<LiquidAttribute, LiquidAttributeDto>().ReverseMap();
        CreateMap<LiquidCategory, LiquidCategoryDto>().ReverseMap();
        CreateMap<Instrument, InstrumentDto>().ReverseMap();
        CreateMap<Plate, PlateDto>().ReverseMap();
        CreateMap<PlateChild, PlateChildDto>().ReverseMap();
        CreateMap<LiquidPositionInPlate, LiquidPositionInPlateDto>().ReverseMap();
        CreateMap<LiquidTransferHistory, LiquidTransferHistoryDto>().ReverseMap();
        CreateMap<CsvHeader, CsvHeaderDto>().ReverseMap();
        CreateMap<PlateTransferHistory, PlateTransferHistoryDto>().ReverseMap();
        CreateMap<Report, ReportDto>().ReverseMap();
        CreateMap<ReportItem, ReportItemDto>().ReverseMap();
        CreateMap<ImportLiquidPlateDto, LiquidCategoryDto>().ReverseMap();
    }
}
