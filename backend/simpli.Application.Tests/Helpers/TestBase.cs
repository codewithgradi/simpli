using AutoFixture;

namespace simpli.Application.Tests.Helpers;
public class TestBase
{
    protected readonly Fixture Fixture ;
    protected TestBase()
    {
        Fixture = new Fixture();
        Fixture.Behaviors.OfType<ThrowingRecursionBehavior>()
            .ToList()
            .ForEach(b => Fixture.Behaviors.Remove(b));
        Fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }
}