using Newtonsoft.Json;
using PASS.Domain.Entities;
using PASS.Dtos;
using PASS.Management;
using PASS.MqMessage;
using PASS.RabbitMQ;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.ObjectMapping;

namespace PASS.MQService
{
    public class MQResponderService : ISingletonDependency
    {
        private readonly InterProcessRabbitMq _rabbitMq;
        private readonly CsvManagement _csvManagement;
        private readonly InstrumentManagement _instrumentManagement;
        private readonly IObjectMapper _objectMapper;
        private readonly ILogger<MQResponderService> Logger;

        public MQResponderService(InterProcessRabbitMq rabbitMq,
            CsvManagement csvManagement,
            InstrumentManagement instrumentManagement,
            IObjectMapper objectMapper,
            ILogger<MQResponderService> logger
            )
        {
            _rabbitMq = rabbitMq;
            _csvManagement = csvManagement;
            _instrumentManagement = instrumentManagement;
            _objectMapper = objectMapper;
            Logger = logger;

            MQStart();
        }

        public void MQStart()
        {
            Logger.LogDebug("MQResponderService start..");

            _rabbitMq.Respond<CsvHeaderRequestMsg, CsvHeaderRespondMsg>(HandleCsvHeader, $"EAP.All.RequestCsvHeaders");
            _rabbitMq.Respond<InstrumentRequestMsg, InstrumentRespondMsg>(HandleInstrument, $"EAP.All.RequestInstrument");

        }

        public CsvHeaderRespondMsg HandleCsvHeader(CsvHeaderRequestMsg msg)
        {
            CsvHeaderRespondMsg respond = new CsvHeaderRespondMsg();
            try
            {
                if (msg == null || string.IsNullOrEmpty(msg.CsvName))
                    throw new Exception("No CsvName in the message.");

                var result = _csvManagement.GetCsvHeadersList(msg.CsvName);
                Logger.LogInformation($"result: {JsonConvert.SerializeObject(result)}");

                if (result == null || result.Count == 0)
                    throw new Exception($"No CsvHeader with the name '{msg.CsvName}' in DB.");

                var a = _objectMapper.Map<List<CsvHeader>, List<CsvHeaderDto>>(result);

                respond = new CsvHeaderRespondMsg()
                {
                    ErrorCode = 0,
                    ErrorMessage = "",
                    CsvHeaders = _objectMapper.Map<List<CsvHeader>, List<CsvHeaderDto>>(result)
                };
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                respond = new CsvHeaderRespondMsg()
                {
                    ErrorCode = -1,
                    ErrorMessage = ex.Message,
                    CsvHeaders = null,
                };
            }

            return respond;
        }


        public InstrumentRespondMsg HandleInstrument(InstrumentRequestMsg msg)
        {
            InstrumentRespondMsg respond = new InstrumentRespondMsg();
            try
            {
                if (msg == null || string.IsNullOrEmpty(msg.InstrumentName))
                    throw new Exception("No InstrumentName in the message.");

                var result = _instrumentManagement.GetInstrument(msg.InstrumentName);
                Logger.LogInformation($"result: {JsonConvert.SerializeObject(result)}");

                if (result == null)
                    throw new Exception($"No Instrument with the name '{msg.InstrumentName}' in DB.");

                var a = _objectMapper.Map<Instrument, InstrumentDto>(result);

                respond = new InstrumentRespondMsg()
                {
                    ErrorCode = 0,
                    ErrorMessage = "",
                    Instrument = a
                };
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                respond = new InstrumentRespondMsg()
                {
                    ErrorCode = -1,
                    ErrorMessage = ex.Message,
                    Instrument = null,
                };
            }

            return respond;
        }
    }
}
