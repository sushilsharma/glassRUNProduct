using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Security.Principal;
using System.Net.Http;
using System.Net;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.IdentityModel.Tokens;
using System.Web.Http.Filters;
using Login.DTO;
using Blankchq.Framework.Service.Helper;
using Login.Interfaces;
using System.IO;

namespace glassRUNProduct.WebAPI.Controllers
{
    public class GRAuthorize : ActionFilterAttribute
    {
        public GRAuthorize()
        {

        }

        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            LogWsData(actionContext.Request.Headers.ToString());
            //base.OnAuthorization(actionContext);
            if (actionContext.Request.Headers.Authorization != null)
            {
                // get value from header

                string tokenString = Convert.ToString(actionContext.Request.Headers.GetValues("Authorization").FirstOrDefault());
                var key = Encoding.ASCII.GetBytes("GQDstcKsx0NHjPOuXOYg5MbeJ1XT0uFiwDVvVBrk");
                var handler = new JwtSecurityTokenHandler();

                var jwtOutput = string.Empty;

                if (!handler.CanReadToken(tokenString))
                    throw new Exception("The token doesn't seem to be in a proper JWT format.");

                var token1 = handler.ReadJwtToken(tokenString);

                var jwtHeader = JsonConvert.SerializeObject(token1.Header.Select(h => new { h.Key, h.Value }));
                var jwtPayload = JsonConvert.SerializeObject(token1.Claims.Select(c => new { c.Type, c.Value }));
                
                JArray jArray = (JArray)JsonConvert.DeserializeObject(jwtPayload);

                Dictionary<string, string> a = new Dictionary<string, string>(); 
                foreach (JObject parsedObject in jArray.Children<JObject>())
                {
                    string type ="",value="";
                    foreach (JProperty parsedProperty in parsedObject.Properties())
                    {
                        string propertyName = parsedProperty.Name;
                        if (propertyName.ToLower().Equals("type"))
                        {
                            type = (string)parsedProperty.Value;
                        }
                        if (propertyName.ToLower().Equals("value"))
                        {
                            value = (string)parsedProperty.Value;
                        }
                    }
                    a.Add(type, value);
                }
                long userId = Convert.ToInt64(a["unique_name"]);
                DateTime expirationTime = DateTimeOffset.FromUnixTimeSeconds(long.Parse(a["exp"])).DateTime;
                if (expirationTime > DateTime.Now)
                {
                    LoginDTO loginDto = new LoginDTO();
                    using (var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
                    {
                        loginDto.LoginId = userId;
                        loginDto = client.Instance.GetLoginById(loginDto);
                        if (loginDto.LoginList.Count > 0)
                        {
                            loginDto = loginDto.LoginList[0];
                        }
                    }
                    if (loginDto != null && !string.IsNullOrEmpty(loginDto.AccessKey))
                    {
                        if (tokenString != loginDto.AccessKey)
                        {
                            actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                        }
                        if (!loginDto.IsActive)
                        {
                            actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                        }
                    }
                    else
                    {
                        actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                    }
                }
                else
                {
                    actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                    return;
                }
            }
        }

        public void LogWsData(string value)
        {
            try
            {
                string servicesPath = System.AppDomain.CurrentDomain.BaseDirectory;
                if (!String.IsNullOrEmpty(value))
                {
                    servicesPath += "/LoginErrorLog";
                    if (!Directory.Exists(servicesPath))
                    {
                        Directory.CreateDirectory(servicesPath);
                    }
                    string filepath = servicesPath + "/";
                    string fileName = DateTime.Now.Year + DateTime.Now.Month.ToString() + DateTime.Now.Day;
                    fileName = filepath + fileName + ".txt";
                    StreamWriter objwriter = new StreamWriter(fileName, true);
                    objwriter.Write(Environment.NewLine + "[" + DateTime.Now + "] : " + value);
                    objwriter.Close();
                }
            }
            catch (Exception)
            {
            }
        }
    }
}