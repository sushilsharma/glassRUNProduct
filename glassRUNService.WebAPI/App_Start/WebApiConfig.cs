using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.ValueProviders;
using System.Web.Http.ValueProviders.Providers;

namespace glassRUNRequest
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            //config.SuppressDefaultHostAuthentication();
            //config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            //// Web API routes

            //var enableCorsAttribute = new EnableCorsAttribute("*",
            //                                 "Origin, Content-Type, Accept",
            //                                 "GET, PUT, POST, DELETE, OPTIONS");
            //config.EnableCors(enableCorsAttribute);

            //config.EnableCors(new EnableCorsAttribute("http://localhost:4200", headers: "*", methods: "*"));

            //var cors = new EnableCorsAttribute("", "", "GET,PUT,POST,PATCH,DELETE,OPTIONS");
            //config.EnableCors(cors);

            config.MapHttpAttributeRoutes();

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);

            //config.Formatters.JsonFormatter.SerializerSettings.ContractResolver =   
            //    new Newtonsoft.Json.Serialization.DefaultContractResolver { IgnoreSerializableAttribute = true }; 
        }
    }
}
