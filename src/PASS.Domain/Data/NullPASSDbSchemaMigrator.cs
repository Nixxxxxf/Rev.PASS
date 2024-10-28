using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace PASS.Data;

/* This is used if database provider does't define
 * IPASSDbSchemaMigrator implementation.
 */
public class NullPASSDbSchemaMigrator : IPASSDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
