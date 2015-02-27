using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CommunityYouthConcepts.Startup))]
namespace CommunityYouthConcepts
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
