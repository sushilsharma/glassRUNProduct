using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;


using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;
using System.Web.Routing;
using Newtonsoft.Json;
using System.ServiceModel;
using System.ServiceModel.Description;

using System.Configuration;
using System.Diagnostics;
using glassRUNRequest;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Linq;
using System.Xml;

namespace glassRUNRequest.WebAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {

        List<ServiceHost> serviceHosts = new List<ServiceHost>();
        protected void Application_Start()
        {
            //GlobalConfiguration.Configure(WebApiConfig.Register);
            //RouteConfig.RegisterRoutes(RouteTable.Routes);
            //JsonSerializerSettings jSettings = new Newtonsoft.Json.JsonSerializerSettings();
            //GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings = jSettings;
        }

        protected void Application_PostAuthorizeRequest()
        {
            System.Web.HttpContext.Current.SetSessionStateBehavior(System.Web.SessionState.SessionStateBehavior.Required);
        }


        protected void Application_Start(object sender, EventArgs e)
        {
		 

                GlobalConfiguration.Configure(WebApiConfig.Register);
                RouteConfig.RegisterRoutes(RouteTable.Routes);
                JsonSerializerSettings jSettings = new Newtonsoft.Json.JsonSerializerSettings();
                GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings = jSettings;

		
        }


        protected void Application_End(object sender, EventArgs e)
        {

           
        }


    }


    public static class Extensions
    {
        public static void ProcessUnhandledException(this Exception ex, string appName)
        {
            //log to Windows EventLog
            try
            {
                string sSource = System.Reflection.Assembly.GetEntryAssembly().FullName;
                string sLog = "Application";
                string sEvent = string.Format("Unhandled exception in {0}: {1}", appName, ex.ToString());
                if (!EventLog.SourceExists(sSource))
                    EventLog.CreateEventSource(sSource, sLog);

                EventLog.WriteEntry(sSource, sEvent);
                EventLog.WriteEntry(sSource, sEvent, EventLogEntryType.Error, 999);
            }
            catch
            {
                //do nothing if this one fails
            }
        }
    }
}
