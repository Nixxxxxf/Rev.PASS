using PASS.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace PASS.Interfaces
{
    public interface IInstrumentAppService :
        ICrudAppService<InstrumentDto,
            Guid,
            PagedAndSortedResultRequestDto>
    {

    }
}
