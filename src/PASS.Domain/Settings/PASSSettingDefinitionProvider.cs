using Volo.Abp.Settings;

namespace PASS.Settings;

public class PASSSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(PASSSettings.MySetting1));
    }
}
