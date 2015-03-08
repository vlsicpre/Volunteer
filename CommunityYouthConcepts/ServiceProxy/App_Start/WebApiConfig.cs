using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace ServiceProxy
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            //// Web API routes
            config.MapHttpAttributeRoutes();

           // config.Routes.MapHttpRoute(
           //    name: "DefaultApi3",
           //    routeTemplate: "api/post/getcategories/{id}",
           //    defaults: new { id = RouteParameter.Optional,  controller="post", action ="getcategories" }
           //);



            config.Routes.MapHttpRoute(
               name: "DefaultApi2",
               routeTemplate: "api/{controller}/{action}/{categoryId}",
               defaults: new { categoryId = RouteParameter.Optional }
           );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
