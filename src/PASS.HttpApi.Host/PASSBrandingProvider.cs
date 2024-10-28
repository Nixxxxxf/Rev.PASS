using Microsoft.Extensions.Localization;
using PASS.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace PASS;

[Dependency(ReplaceServices = true)]
public class PASSBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<PASSResource> _localizer;

    public PASSBrandingProvider(IStringLocalizer<PASSResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
