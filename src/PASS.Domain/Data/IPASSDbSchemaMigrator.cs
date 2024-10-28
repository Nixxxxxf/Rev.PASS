using System.Threading.Tasks;

namespace PASS.Data;

public interface IPASSDbSchemaMigrator
{
    Task MigrateAsync();
}
