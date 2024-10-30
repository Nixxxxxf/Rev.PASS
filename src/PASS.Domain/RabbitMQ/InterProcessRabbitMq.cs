using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp;
using EasyNetQ;

namespace PASS.RabbitMQ
{
    public class InterProcessRabbitMq : ISingletonDependency
    {
        private readonly IBus _bus = null;
        private readonly ILogger<InterProcessRabbitMq> _logger;
        //private readonly ISettingProvider _settingProvider;


        //public InterProcessRabbitMq(ISettingProvider settingProvider)
        public InterProcessRabbitMq(ILogger<InterProcessRabbitMq> logger)
        {
            //_settingProvider = settingProvider;
            _logger = logger;
            //_logger = IocManager.Instance.Resolve<ILogger>();
            //var conn = _settingProvider.GetOrNullAsync(PassSettings.RabbitMQConnectionString).Result;
            var conn = "host=127.0.0.1; username=guest; password=guest; persistentMessages=false";

            try
            {
                _bus = RabbitHutch.CreateBus(conn);
            }
            catch (Exception ex)
            {
                _logger.LogError("Can't connect RabbitMQ!", ex);
                throw new UserFriendlyException("Can't create RabbitMQ!");
            }
        }


        public void Publish<T>(T message, string topic) where T : class
        {
            Publish(_logger, message, topic);
        }

        //
        // Summary:
        //     写日志版本
        //
        // Parameters:
        //   logger:
        //
        //   message:
        //
        //   topic:
        //
        // Type parameters:
        //   T:
        public void Publish<T>(ILogger logger, T message, string topic) where T : class
        {
            _bus.PubSub.Publish(message, topic);
            logger.LogInformation("[Out " + topic + "]publish " + typeof(T).Name + ": " + JsonConvert.SerializeObject(message));
        }

        //
        // Summary:
        //     T class=exchange， subscriptionId=queue name， topic=routing key subscriptionId是不会形成exchange的，只有消息Class类型才会形成exchange；
        //     topic由publisher来定义，描述的是消息最初的来源
        //
        // Parameters:
        //   subscriptionId:
        //
        //   onMessage:
        //
        //   topic:
        //
        // Type parameters:
        //   T:
        public void Subscribe<T>(string subscriptionId, Action<T> onMessage, string topic) where T : class
        {
            _bus.PubSub.Subscribe(subscriptionId, onMessage, delegate (ISubscriptionConfiguration x)
            {
                x.WithTopic(topic);
            });
        }

        public void Subscribe<T>(ILogger logger, string subscriptionId, Action<T> onMessage, string topic) where T : class
        {
            _bus.PubSub.Subscribe(subscriptionId, delegate (T x)
            {
                logger.LogInformation("[In " + topic + "]subscribe " + typeof(T).Name + ": " + JsonConvert.SerializeObject(x));
                onMessage(x);
            }, delegate (ISubscriptionConfiguration x)
            {
                x.WithTopic(topic);
            });
        }

        public TResponse Request<TRequest, TResponse>(TRequest request) where TRequest : class where TResponse : class
        {
            return _bus.Rpc.Request<TRequest, TResponse>(request);
        }

        public TResponse Request<TRequest, TResponse>(TRequest request, string queueName, int waitSeconds = 10) where TRequest : class where TResponse : class
        {
            return Request<TRequest, TResponse>(_logger, request, queueName, waitSeconds);
        }

        //
        // Summary:
        //     写日志版本
        //
        // Parameters:
        //   logger:
        //
        //   request:
        //
        //   queueName:
        //
        //   waitSeconds:
        //
        // Type parameters:
        //   TRequest:
        //
        //   TResponse:
        public TResponse Request<TRequest, TResponse>(ILogger logger, TRequest request, string queueName, int waitSeconds = 10) where TRequest : class where TResponse : class
        {
            logger.LogInformation("[Out " + queueName + "]request " + typeof(TRequest).Name + ": \r\n" + JsonConvert.SerializeObject(request));
            TResponse val = _bus.Rpc.Request<TRequest, TResponse>(request, delegate (IRequestConfiguration x)
            {
                x.WithQueueName(queueName).WithExpiration(TimeSpan.FromSeconds(waitSeconds));
            });
            logger.LogInformation("[In " + queueName + "]response " + typeof(TResponse).Name + ": \r\n" + JsonConvert.SerializeObject(val));
            return val;
        }

        //
        // Summary:
        //     写日志版本, queuename自动补全typeof(TRequest).Name
        //
        // Parameters:
        //   logger:
        //
        //   request:
        //
        //   queuePrefix:
        //     do NOT contain "typeof(TRequest).Name"
        //
        //   waitSeconds:
        //
        // Type parameters:
        //   TRequest:
        //
        //   TResponse:
        public TResponse RequestEx<TRequest, TResponse>(ILogger logger, TRequest request, string queuePrefix, int waitSeconds = 10) where TRequest : class where TResponse : class
        {
            return Request<TRequest, TResponse>(logger, request, queuePrefix + "." + typeof(TRequest).Name, waitSeconds);
        }

        public IDisposable Respond<TRequest, TResponse>(Func<TRequest, TResponse> responder, string queueName) where TRequest : class where TResponse : class
        {
            return Respond(_logger, responder, queueName);
        }

        //
        // Summary:
        //     写日志版本
        //
        // Parameters:
        //   logger:
        //
        //   responder:
        //
        //   queueName:
        //     MUST contain "typeof(TRequest).Name"
        //
        // Type parameters:
        //   TRequest:
        //
        //   TResponse:
        public IDisposable Respond<TRequest, TResponse>(ILogger logger, Func<TRequest, TResponse> responder, string queueName) where TRequest : class where TResponse : class
        {
            return _bus.Rpc.Respond(delegate (TRequest x)
            {
                logger.LogInformation("[In " + queueName + "]request   " + typeof(TRequest).Name + ": " + JsonConvert.SerializeObject(x));
                TResponse val = responder(x);
                logger.LogInformation("[Out " + queueName + "]response " + typeof(TRequest).Name + ": " + JsonConvert.SerializeObject(val));
                return Task.FromResult(val);
            }, delegate (IResponderConfiguration x)
            {
                x.WithQueueName(queueName);
            });
        }

        //
        // Summary:
        //     写日志版本, queuename自动补全typeof(TRequest).Name
        //
        // Parameters:
        //   logger:
        //
        //   responder:
        //
        //   queuePrefix:
        //     do NOT contain "typeof(TRequest).Name"
        //
        // Type parameters:
        //   TRequest:
        //
        //   TResponse:
        public IDisposable RespondEx<TRequest, TResponse>(ILogger logger, Func<TRequest, TResponse> responder, string queuePrefix) where TRequest : class where TResponse : class
        {
            return Respond(logger, responder, queuePrefix + "." + typeof(TRequest).Name);
        }

    }
}
