using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PASS.Interfaces;
using PASS.Management;
using PASS.MqMessage;
using PASS.OpenAppService;
using PASS.RabbitMQ;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.ObjectMapping;

namespace PASS.MQService
{
    public class MQSubscriberService : ITransientDependency //ISingletonDependency //ITransientDependency//;
    {
        private readonly InterProcessRabbitMq _rabbitMq;
        private readonly CsvManagement _csvManagement;
        private readonly InstrumentManagement _instrumentManagement;
        private readonly IObjectMapper _objectMapper;
        private readonly ILogger<MQResponderService> Logger;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ICachedServiceProvider _serviceProvider;
        private readonly OpCompoundLibraryAppService _opCompoundLibraryAppService;



        public MQSubscriberService(InterProcessRabbitMq rabbitMq,
            CsvManagement csvManagement,
            InstrumentManagement instrumentManagement,
            IObjectMapper objectMapper,
        ILogger<MQResponderService> logger,
            IServiceScopeFactory serviceScopeFactory,
            ICachedServiceProvider serviceProvider,
            OpCompoundLibraryAppService opCompoundLibraryAppService
            )
        {
            _rabbitMq = rabbitMq;
            _csvManagement = csvManagement;
            _instrumentManagement = instrumentManagement;
            _objectMapper = objectMapper;
            Logger = logger;
            _serviceScopeFactory = serviceScopeFactory;
            _serviceProvider = serviceProvider;
            _opCompoundLibraryAppService = opCompoundLibraryAppService;

            MQStart();
        }


        public void MQStart()
        {
            Logger.LogDebug("MQSubscriberService start..");

            _rabbitMq.Subscribe<PickListMsg>($"{nameof(PickListMsg)}.PASS.Server", HandlePickList, $"EAP.*.PickList");

            _rabbitMq.Subscribe<PlateTransferMsg>($"{nameof(PlateTransferMsg)}.PASS.Server", HandlePlateTransfer, $"EAP.*.PlateTransfer");

            _rabbitMq.Subscribe<EchoReportMsg>($"{nameof(EchoReportMsg)}.PASS.Server", HandleEchoReport, $"EAP.*.EchoReport");

        }


        public void HandlePickList(PickListMsg msg)
        {
            try
            {
                Logger.LogDebug($"received: {JsonConvert.SerializeObject(msg)}");
                if (msg == null || msg.PickList == null || msg.PickList.Count == 0)
                {
                    Logger.LogInformation("No pick list in the message.");
                    return;
                }

                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var appService = scope.ServiceProvider.GetRequiredService<IOpCompoundLibraryAppService>();

                    var result = appService.ImportCompoundCellMix(msg.PickList!).Result;

                    Logger.LogInformation($"result: {result}");
                }

            }
            catch (Exception ex)
            {

                Logger.LogError(ex.Message, ex);
            }
        }


        public void HandlePlateTransfer(PlateTransferMsg msg)
        {
            try
            {
                Logger.LogDebug($"received: {JsonConvert.SerializeObject(msg)}");
                if (msg == null || msg.PlateTransferHistory == null)
                {
                    Logger.LogInformation("No Plate TransferHistory in the message.");
                    return;
                }

                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var appService = scope.ServiceProvider.GetRequiredService<IOpCompoundLibraryAppService>();

                    var result = appService.ImportPlateTransfer(msg.PlateTransferHistory!).Result;

                    Logger.LogInformation($"result: {result}");
                }

            }
            catch (Exception ex)
            {

                Logger.LogError(ex.Message, ex);
            }
        }


        public void HandleEchoReport(EchoReportMsg msg)
        {
            try
            {
                Logger.LogDebug($"received: {JsonConvert.SerializeObject(msg)}");
                if (msg == null || string.IsNullOrEmpty(msg.ReportName) || msg.ReportItemsList?.Count == 0)
                {
                    Logger.LogInformation("No Echo Report in the message.");
                    return;
                }

                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var appService = scope.ServiceProvider.GetRequiredService<IOpCompoundLibraryAppService>();

                    var result = appService.ImportEchoReportItemList(msg.ReportName, msg.ReportType!, msg.ReportItemsList!.ToList()).Result;

                    Logger.LogInformation($"result: {result}");
                }

            }
            catch (Exception ex)
            {

                Logger.LogError(ex.Message, ex);
            }
        }



    }
}
