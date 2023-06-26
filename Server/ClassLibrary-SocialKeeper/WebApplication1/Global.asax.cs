using ClassLibrary_SocialKeeper;
using Hangfire;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using WebApplication1;


namespace WebApplication1
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        igroup192_prodEntities _db;

        public WebApiApplication()
        {
            _db = dbcontext._db;
        }


        private IEnumerable<IDisposable> GetHangfireServers()
        {
            Hangfire.GlobalConfiguration.Configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage("data source=media.ruppin.ac.il;initial catalog=igroup192_prod;user id=igroup192;password=igroup192_88856;MultipleActiveResultSets=True;App=EntityFramework;TrustServerCertificate=True"
);

            

            yield return new BackgroundJobServer();
        }
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            System.Web.Http.GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters); 
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            HangfireAspNet.Use(GetHangfireServers);

            RecurringJob.AddOrUpdate("notificationschecker",()=> HelloWorld(),Cron.Minutely);
        }

        public void HelloWorld()
        {
            System.Diagnostics.Debug.WriteLine("Hello world from Hangfire!");
        }
    }
}
