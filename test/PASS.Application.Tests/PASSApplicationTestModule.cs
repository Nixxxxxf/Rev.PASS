using Volo.Abp.Modularity;

namespace PASS;

[DependsOn(
    typeof(PASSApplicationModule),
    typeof(PASSDomainTestModule)
)]
public class PASSApplicationTestModule : AbpModule
{

}
