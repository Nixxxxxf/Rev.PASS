using PASS.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace PASS.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(PASSEntityFrameworkCoreModule),
    typeof(PASSApplicationContractsModule)
)]
public class PASSDbMigratorModule : AbpModule
{
}
