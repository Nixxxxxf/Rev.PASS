using PASS.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace PASS.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class PASSController : AbpControllerBase
{
    protected PASSController()
    {
        LocalizationResource = typeof(PASSResource);
    }
}
