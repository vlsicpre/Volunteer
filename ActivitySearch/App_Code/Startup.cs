using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ActivitySearch.Startup))]
namespace ActivitySearch
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
