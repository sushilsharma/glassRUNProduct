using Newtonsoft.Json.Linq;
using System;
using System.Configuration;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.ServiceModel;
using System.Web.Http;
using System.Web.Http.Cors;
using glassRUNProduct.DataAccess;
using Newtonsoft.Json;
using System.Xml.Serialization;
using System.Collections.Generic;
using System.Net.Http;
using Microsoft.Reporting.WebForms;
using System.Data;
using System.Net.Http.Headers;
using System.Web;
using System.IO;
using ClosedXML.Excel;
using System.Web.Script.Serialization;
using System.Text.RegularExpressions;
using System.Linq;
using glassRUNProduct.Portal.Helper;
using Newtonsoft.Json.Converters;
using System.Dynamic;
using glassRUN.Portal.Helper;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace glassRUNProduct.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]
    public class grRequestController : ApiController
    {
        private List<PageValidation> pageValidation = new List<PageValidation>();

        private string customApiUrl = ConfigurationManager.AppSettings["CustomApiUrl"];


        private static ICacheManager _cacheManager = new CacheManager();

        public string LoadServicesConfigDetails(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = ServiceConfigurationDataAccessManager.GetServicesConfigURL(Input);
            return output;
        }

        public List<PageValidation> Readproperty(JObject JObject, string JsonServerValidation)
        {
            PageValidation pagevalidation;
            bool isValid = true;

            bool isValidation = true;

            foreach (JProperty jProperty in JObject.Properties())
            {
                if (jProperty.Value is JArray)
                {
                    foreach (JObject item in (JArray)jProperty.Value)
                    {
                        if (!isValidation)
                        {
                            isValid = false;

                            break;
                        }
                        else
                        {
                            Readproperty(item, JsonServerValidation);
                        }
                    }
                }
                else if (jProperty.Value is JObject)
                {
                    if (!isValidation)
                    {
                        isValid = false;

                        break;
                    }
                    else
                    {
                        Readproperty((JObject)jProperty.Value, JsonServerValidation);
                    }
                }
                else if (jProperty.Value is JValue)
                {
                    dynamic objServerValidation = (JObject)JsonConvert.DeserializeObject(JsonServerValidation);
                    List<dynamic> objServervalidationList = ((JArray)objServerValidation.Json.ServerValidation.ServerValidationList).ToObject<List<dynamic>>();

                    var inputFieldvalidation = objServervalidationList.Where(temp => temp.PropertyName == jProperty.Name).Select(t => t).ToList();

                    if (inputFieldvalidation.Count > 0)
                    {
                        if (Convert.ToString(inputFieldvalidation[0]["IsActive"]) == "1")
                        {
                            pagevalidation = new PageValidation();
                            string validationExpression = Convert.ToString(inputFieldvalidation[0]["ValidationExpression"]);

                            isValid = Regex.IsMatch((string)jProperty.Value, validationExpression);

                            pagevalidation.ControlName = jProperty.Name.ToString();
                            pagevalidation.IsValidate = isValid;

                            if (!isValid)
                            {
                                var Errmsg = Convert.ToString(inputFieldvalidation[0]["ResourceValue"]);
                                pagevalidation.Message = Errmsg;
                                isValidation = false;
                                // return Errmsg;
                                //break;
                            }
                            else
                            {
                                isValidation = true;
                                pagevalidation.Message = "Success";
                            }

                            pageValidation.Add(pagevalidation);
                        }
                    }
                }

                Console.WriteLine(jProperty.Name + " - " + jProperty.Value);
                //  var NewjsonObj =(NewjsonObj1);
                // var objServervalidation = objServerValidation["Json"]["ServerValidation"]["ServerValidationList"];
            }

            return pageValidation;
        }

        public void LogData(string value)
        {
            try
            {
                string servicesPath = System.AppDomain.CurrentDomain.BaseDirectory;
                if (!String.IsNullOrEmpty(value))
                {
                    servicesPath += "/ErrorLogForCustomerApp";
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

        //[AuthenticationActionFilterAttribute]
       [GRAuthorize]
        [System.Web.Http.HttpPost]
        public IHttpActionResult ProcessRequest(RequestData request)
        {
            //HttpClient client = new HttpClient();
            //Request.Headers.Authorization

            JObject obj = new JObject();
            try
            {


                JObject jsonObj = request.Json;
                var newObj = new JObject
                {
                    ["Json"] = jsonObj,
                };

                string newJsonString = Convert.ToString(newObj);


                dynamic inputObject = new ExpandoObject();

                var expConverter = new ExpandoObjectConverter();
                inputObject = JsonConvert.DeserializeObject<ExpandoObject>(newJsonString, expConverter);
                string customApi = "";
                string processServicesConfiguartionURL = ServiceConfigurationDataAccessManager.GetServicesConfiguartionURL(inputObject.Json.ServicesAction);
                // Convert json string to custom .Net object
                JObject ObjProcessServicesConfiguartionURL = (JObject)JsonConvert.DeserializeObject(processServicesConfiguartionURL);
                customApi = ObjProcessServicesConfiguartionURL["Json"]["ServicesURL"].ToString();


                //customApi = _cacheManager.GetServiceConfiguartionUrlFromCache(inputObject.Json.ServicesAction);
                LogData("ProcessRequest customApi" + customApi);


                if (!string.IsNullOrEmpty(customApi))
                {
                    //create the constructor with post type and few data
                    GRClientRequest myRequest = new GRClientRequest(customApi, "POST", newJsonString);
                    //show the response string on the console screen.
                    string outputResponse = myRequest.GetResponse();
                    LogData("outputResponse customApi" + outputResponse);
                    if (outputResponse != null)
                    {
                        obj = (JObject)JsonConvert.DeserializeObject(outputResponse);
                    }
                }

            }
            catch (Exception ex)
            {

                LogData("ProcessRequest Error" + ex.Message);
            }

            return Ok(obj);
        }


        //[AuthenticationActionFilterAttribute]
        //[System.Web.Http.HttpPost]
        //public IHttpActionResult ProcessRequest(RequestData request)
        //{
        //    //string authHeader = this.httpContext.Request.Headers["Authorization"];
        //    List<PageValidation> isvalid = new List<PageValidation>();
        //    JObject obj = new JObject();
        //    bool inputFieldvalidation = true;
        //    JObject jsonObj = request.Json;
        //    var newObj = new JObject
        //    {
        //        ["Json"] = jsonObj,
        //    };

        //    string newJsonString = Convert.ToString(newObj);

        //    #region ServerValidation

        //    string JsonServerValidation = CommonDataAccessManager.JSONValidation(newJsonString);
        //    if (!string.IsNullOrEmpty(JsonServerValidation))
        //    {
        //        dynamic objServerValidation = new ExpandoObject();

        //        var expConverter = new ExpandoObjectConverter();
        //        objServerValidation = JsonConvert.DeserializeObject<ExpandoObject>(JsonServerValidation, expConverter);

        //        List<dynamic> serverValidationList = new List<dynamic>();



        //        if (IsPropertyExist(objServerValidation.Json, "ServerValidationList"))
        //        {
        //            serverValidationList = objServerValidation.Json.ServerValidationList;

        //        }


        //        //if (jsonObj["IsServerValidationRequired"] != null)
        //        //{
        //        if (serverValidationList.Count > 0)
        //        {
        //            JObject json = JObject.Parse(newJsonString);
        //            isvalid = Readproperty(json, JsonServerValidation);
        //        }

        //        if (isvalid.Count > 0)
        //        {
        //            List<PageValidation> validateList = isvalid.Where(temp => temp.IsValidate == false).Select(t => t).ToList();
        //            if (validateList.Count > 0)
        //            {
        //                inputFieldvalidation = false;
        //            }
        //        }
        //        else
        //        {
        //            inputFieldvalidation = true;
        //        }

        //        #endregion ServerValidation

        //        if (inputFieldvalidation)
        //        {
        //            string customApi = "";


        //            customApi = objServerValidation.Json.ServicesURL;


        //            if (!string.IsNullOrEmpty(customApi))
        //            {
        //                //create the constructor with post type and few data
        //                GRClientRequest myRequest = new GRClientRequest(customApi, "POST", newJsonString);
        //                //show the response string on the console screen.
        //                string outputResponse = myRequest.GetResponse();

        //                if (outputResponse != null)
        //                {
        //                    obj = (JObject)JsonConvert.DeserializeObject(outputResponse);
        //                }
        //            }
        //        }


        //    }


        //    if (inputFieldvalidation)
        //    {
        //        return Ok(obj);
        //    }
        //    else
        //    {
        //        return Ok(isvalid);
        //    }
        //}

        [System.Web.Http.HttpPost]
        public HttpResponseMessage ProcessRequestForExcelExport(RequestData request)
        {
            HttpResponseMessage result = new HttpResponseMessage();
            try
            {
                JObject jsonObj = request.Json;

                var newObj = new JObject
                {
                    ["Json"] = jsonObj,
                };
                string newJsonString = Convert.ToString(newObj);

                string customApi = LoadServicesConfigDetails(JObject.Parse(newJsonString));

                JObject obj = new JObject();
                if (!string.IsNullOrEmpty(customApi))
                {
                    //create the constructor with post type and few data
                    GRClientRequest myRequest = new GRClientRequest(customApi, "POST", newJsonString);
                    //show the response string on the console screen.

                    string outputResponse = myRequest.GetResponse();

                    if (outputResponse != null)
                    {
                        obj = (JObject)JsonConvert.DeserializeObject(outputResponse);
                        string jsonstring = obj["Json"]["OrderList"].ToString();

                        DataTable dt = (DataTable)JsonConvert.DeserializeObject(jsonstring, (typeof(DataTable)));
                        result = ExportReportDownloading(dt);
                    }
                }
            }
            catch (Exception e)
            {
            }

            return result;
        }

        [HttpPost]
        public HttpResponseMessage ExportReportDownloading(DataTable dt)
        {
            DataSet dsSalesSummaryReportList = new DataSet();

            DataTable ds = dt;

            HttpResponseMessage result = new HttpResponseMessage();
            if (ds != null)
            {
                string filePath = "";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    ds.TableName = "All Sales Details";

                    wb.Worksheets.Add(dt);

                    string sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/GridExcelReport/");

                    if (sPath != null && !Directory.Exists(sPath))
                    {
                        Directory.CreateDirectory(sPath);
                    }

                    using (MemoryStream myMemoryStream = new MemoryStream())
                    {
                        wb.SaveAs(myMemoryStream);
                        string fileName = DateTime.Now.ToString();
                        fileName = "GridExcelReport" + DateTime.Now.ToString("MMddyyyy-hhmm") + ".xls";
                        filePath = sPath + fileName;
                        FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write);
                        myMemoryStream.WriteTo(file);
                        file.Close();
                        myMemoryStream.Close();

                        byte[] byt = File.ReadAllBytes(filePath);

                        if (!File.Exists(filePath))
                        {
                            result = Request.CreateResponse(HttpStatusCode.Gone);
                        }
                        else
                        {
                            result = Request.CreateResponse(HttpStatusCode.OK);
                            result.Content = new ByteArrayContent(byt);
                            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                            result.Content.Headers.ContentDisposition.FileName = fileName;
                        }
                    }
                }
            }

            return result;
        }

        [System.Web.Http.HttpPost]
        public HttpResponseMessage ProcessRequestForBuffer(RequestData request)
        {
            JObject jsonObj = request.Json;

            HttpResponseMessage result = new HttpResponseMessage();

            var newObj = new JObject
            {
                ["Json"] = jsonObj,
            };
            string newJsonString = Convert.ToString(newObj);

            string customApi = LoadServicesConfigDetails(JObject.Parse(newJsonString));

            JObject obj = new JObject();
            if (!string.IsNullOrEmpty(customApi))
            {
                //create the constructor with post type and few data
                GRClientRequest myRequest = new GRClientRequest(customApi, "POST", newJsonString);
                //show the response string on the console screen.

                string outputResponse = myRequest.GetResponse();

                if (!string.IsNullOrEmpty(outputResponse) && outputResponse != "{}")
                {
                    JObject response = (JObject)JsonConvert.DeserializeObject(outputResponse);
                    List<dynamic> orderList = new List<dynamic>();

                    string blob = "";
                    string documenttype = "";

                    if (!string.IsNullOrEmpty(Convert.ToString(response["Json"]["OrderDocumentList"])))
                    {
                        orderList = ((JArray)response["Json"]["OrderDocumentList"]).ToObject<List<dynamic>>();

                        foreach (dynamic order in orderList)
                        {
                            blob = order.DocumentBlob;
                            documenttype = order.DocumentFormat;
                        }
                    }
                    else if (!string.IsNullOrEmpty(Convert.ToString(response["Json"]["TransportVehicleList"])))
                    {
                        orderList = ((JArray)response["Json"]["TransportVehicleList"]).ToObject<List<dynamic>>();

                        foreach (dynamic order in orderList)
                        {
                            blob = order.DocumentBlob;
                            documenttype = order.DocumentFormat;
                        }
                    }
                    else
                    {
                        blob = Convert.ToString(response["Json"]["DocumentBlob"]);
                        documenttype = Convert.ToString(response["Json"]["DocumentFormat"]);
                    }

                    byte[] byt = Convert.FromBase64String(blob);

                    if (byt == null)
                    {
                        result = Request.CreateResponse(HttpStatusCode.Gone);
                    }
                    else
                    {
                        result.Content = new ByteArrayContent(byt);
                        result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                        result.Content.Headers.ContentDisposition.FileName = "OrderPickSlip." + documenttype;
                        result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/" + documenttype);
                    }
                }
                else
                {
                }
            }

            return result;
        }

        public byte[] GenerateReportByte(string type, DataSet _dataTableToDisplay, string reportPath, string dataSetName)
        {
            const long recordStatus = 0;
            byte[] bytes1 = new byte[0];
            try
            {
                ReportViewer newViewer1 = new ReportViewer();
                Warning[] warnings;
                string[] streamids;
                string mimeType;
                string encoding;
                string extension;

                // newViewer1.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(LocalReport_SubreportProcessing);

                newViewer1.ProcessingMode = ProcessingMode.Local;
                newViewer1.LocalReport.ReportPath = reportPath;
                //if (_dataTableToDisplay.Rows.Count > 0)
                //{
                DataTable dt = _dataTableToDisplay.Tables[0];
                ReportDataSource datasource = new ReportDataSource(dataSetName, dt);
                newViewer1.LocalReport.DataSources.Clear();
                newViewer1.LocalReport.DataSources.Add(datasource);
                newViewer1.LocalReport.Refresh();
                bytes1 = newViewer1.LocalReport.Render(type, null);

                ////Generate File In Folder

                // Type should check in small letter always Sushil Sharma 17/3/2017
                //string fileName = "";
                //if (type == "PDF")
                //{
                //    fileName = "Confirmation" + DateTime.Now.ToString("MMddyyyy-hhmm") + ".pdf";
                //}
                //else if (type == "Excel")
                //{
                //    fileName = "Confirmation" + DateTime.Now.ToString("MMddyyyy-hhmm") + ".xls";
                //}
            }
            catch (Exception ex)
            {
                //LogData("Error in generating report :- " + ex.Message);
            }
            return bytes1;
        }

        //public IHttpActionResult ProcessRequest(RequestData request,"JDE", xml)

        [HttpPost]
        public IHttpActionResult LogOut(RequestData request)
        {
            HttpContext.Current.Session["UserInfo"] = null;

            return Ok("");
        }


        public static bool IsPropertyExist(dynamic settings, string name)
        {
            if (settings is ExpandoObject)
                return ((IDictionary<string, object>)settings).ContainsKey(name);

            return settings.GetType().GetProperty(name) != null;
        }
    }

    public class RequestData

    {
        public dynamic Json { get; set; }

        public RequestData()
        {
        }
    }

    public class PageValidation
    {
        public string ControlName { get; set; }
        public bool IsValidate { get; set; }
        public string Message { get; set; }

        public PageValidation()
        {
        }
    }
}