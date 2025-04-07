using PASS.Domain.Entities;
using PASS.Dtos;
using PASS.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.ObjectMapping;

namespace PASS.AppServices
{

    public class ProtocolAppService :
        CrudAppService<Protocol,
            ProtocolDto,
            Guid,
            PagedAndSortedResultRequestDto>,
        IProtocolAppService
    {

        public readonly IRepository<Protocol, Guid> _protocolRepository;

        public ProtocolAppService(IRepository<Protocol, Guid> repository)
            : base(repository)
        {
            _protocolRepository = repository;
        }

        public async Task<PagedResultDto<ProtocolDto>> GetListWithFilterAsync(string? proName, PagedAndSortedResultRequestDto input)
        {
            IQueryable<Protocol> queryPro = (await _protocolRepository.GetQueryableAsync()).WhereIf(!string.IsNullOrEmpty(proName), x => x.Name == proName);

            int totalCount = await base.AsyncExecuter.CountAsync(queryPro).ConfigureAwait(continueOnCapturedContext: false);
            if (totalCount > 0)
            {
                if (!input.Sorting.IsNullOrWhiteSpace())
                {
                    queryPro = queryPro.OrderBy(new ParsingConfig(), input.Sorting);
                }
                queryPro = queryPro.Skip(input.SkipCount).Take(input.MaxResultCount);
            }

            List<ProtocolDto> items = new List<ProtocolDto>();
            items = ObjectMapper.Map<List<Protocol>, List<ProtocolDto>>(queryPro.ToList());

            return new PagedResultDto<ProtocolDto>(totalCount, items);

        }


        public List<ProtocolDto> GetProtocol(string name)
        {
            List<Protocol> protocols = _protocolRepository.GetQueryableAsync().Result.Where(x => x.Name == name).ToList();

            return ObjectMapper.Map<List<Protocol>, List<ProtocolDto>>(protocols);
        }

        public void AddNewProtocol(string name)
        {
            var existPro = _protocolRepository.GetQueryableAsync().Result.Where(x => x.Name == name).FirstOrDefault();
            if (existPro == default(Protocol))
            {
                Protocol newPro = new Protocol() { Name = name };
                newPro.SetId(GuidGenerator.Create());
                _protocolRepository.InsertAsync(newPro);
            }
        }

        public void DeleteProtocol(string name)
        {
            _protocolRepository.DeleteAsync(x=>x.Name==name);
        }

        public void CreateOrUpdateProtocol(ProtocolDto pro)
        {
            var existPro = _protocolRepository.GetQueryableAsync().Result.Where(x => x.Name == pro.Name).FirstOrDefault();
            if (existPro == default(Protocol))
            {
                Protocol newPro = ObjectMapper.Map<ProtocolDto, Protocol>(pro);
                newPro.SetId(GuidGenerator.Create());
                _protocolRepository.InsertAsync(newPro);
            }
            else 
            {
                //contains id
                existPro.Content = pro.Content;
                _protocolRepository.UpdateAsync(existPro);
            }
        }

        public List<ProtocolDto> GetAllProtocolsForSelect()
        {
            List<Protocol> protocols = _protocolRepository.GetQueryableAsync().Result.ToList();

            return ObjectMapper.Map<List<Protocol>, List<ProtocolDto>>(protocols);
        }
    }
}
