using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace PASS.EntityFrameworkCore;

/* This class is needed for EF Core console commands
 * (like Add-Migration and Update-Database commands) */
public class PASSDbContextFactory : IDesignTimeDbContextFactory<PASSDbContext>
{
    public PASSDbContext CreateDbContext(string[] args)
    {
        var configuration = BuildConfiguration();
        
        PASSEfCoreEntityExtensionMappings.Configure();

        var builder = new DbContextOptionsBuilder<PASSDbContext>()
            .UseSqlServer(configuration.GetConnectionString("Default"));
        
        return new PASSDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../PASS.DbMigrator/"))
            .AddJsonFile("appsettings.json", optional: false);

        return builder.Build();
    }
}
