using Volo.Abp.Modularity;

namespace PASS;

/* Inherit from this class for your domain layer tests. */
public abstract class PASSDomainTestBase<TStartupModule> : PASSTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
