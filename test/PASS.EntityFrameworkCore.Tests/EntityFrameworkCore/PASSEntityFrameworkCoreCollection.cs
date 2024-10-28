using Xunit;

namespace PASS.EntityFrameworkCore;

[CollectionDefinition(PASSTestConsts.CollectionDefinitionName)]
public class PASSEntityFrameworkCoreCollection : ICollectionFixture<PASSEntityFrameworkCoreFixture>
{

}
