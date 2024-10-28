using PASS.Samples;
using Xunit;

namespace PASS.EntityFrameworkCore.Domains;

[Collection(PASSTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<PASSEntityFrameworkCoreTestModule>
{

}
