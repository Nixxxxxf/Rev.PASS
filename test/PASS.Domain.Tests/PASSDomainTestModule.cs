using Volo.Abp.Modularity;

namespace PASS;

[DependsOn(
    typeof(PASSDomainModule),
    typeof(PASSTestBaseModule)
)]
public class PASSDomainTestModule : AbpModule
{

}
