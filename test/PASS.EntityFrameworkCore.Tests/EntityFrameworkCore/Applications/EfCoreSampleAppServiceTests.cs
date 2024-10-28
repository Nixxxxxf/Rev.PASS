using PASS.Samples;
using Xunit;

namespace PASS.EntityFrameworkCore.Applications;

[Collection(PASSTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<PASSEntityFrameworkCoreTestModule>
{

}
