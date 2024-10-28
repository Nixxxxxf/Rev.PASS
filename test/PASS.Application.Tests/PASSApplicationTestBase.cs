using Volo.Abp.Modularity;

namespace PASS;

public abstract class PASSApplicationTestBase<TStartupModule> : PASSTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
