./build-image.ps1 -ProjectPath "../../src/PASS.DbMigrator/PASS.DbMigrator.csproj" -ImageName pass/dbmigrator
./build-image.ps1 -ProjectPath "../../src/PASS.HttpApi.Host/PASS.HttpApi.Host.csproj" -ImageName pass/httpapihost
./build-image.ps1 -ProjectPath "../../angular" -ImageName pass/angular -ProjectType "angular"
