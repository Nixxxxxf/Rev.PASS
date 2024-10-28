using PASS.Localization;
using Volo.Abp.Application.Services;

namespace PASS;

/* Inherit your application services from this class.
 */
public abstract class PASSAppService : ApplicationService
{
    protected PASSAppService()
    {
        LocalizationResource = typeof(PASSResource);
    }
}
