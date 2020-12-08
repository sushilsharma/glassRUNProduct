using glassRUNProduct.DataAccess;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.IO;
using System.Data;

using System.Dynamic;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.Configuration;
using ClosedXML.Excel;
using System.Net.Http.Headers;
using glassRUNProduct.Portal.Helper;

namespace glassRUNRequest.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]

    public class ResourcesKeyController : ApiController
    {

        public void LogData(string value)
        {
            try
            {
                string servicesPath = System.AppDomain.CurrentDomain.BaseDirectory;
                if (!String.IsNullOrEmpty(value))
                {
                    servicesPath += "/ErrorLog";
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

        [HttpPost]
        public IHttpActionResult UploadResourcesKey(dynamic Json)
        {

            dynamic rspjsonobj = new ExpandoObject();
            rspjsonobj.IsValidExcel = false;
            rspjsonobj.IsError = false;
            string sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/ResourcesKey/");

            if (sPath != null && !Directory.Exists(sPath))
            {
                Directory.CreateDirectory(sPath);
            }
            string FileName = Guid.NewGuid().ToString() + Json.Json.FileName.Value;

            if (!File.Exists(Path.Combine(sPath, FileName)))
            {
                try
                {
                    File.WriteAllBytes(Path.Combine(sPath, FileName), Convert.FromBase64String(Json.Json.File.Value));
                    DataSet dsFileData = new DataSet();
                    ReadFile objreadFile = new ReadFile();
                    dsFileData = objreadFile.ReadExcel(Path.Combine(sPath, FileName));

                    if (dsFileData.Tables.Count > 0)
                    {
                        // DataTableToJSON(dsFileData.Tables[0]);
                        if (dsFileData.Tables[0].Columns.Count >= 8)
                        {
                            dsFileData.Tables[0].Columns[0].ColumnName = "ResourceId";
                            dsFileData.Tables[0].Columns[1].ColumnName = "CultureId";
                            dsFileData.Tables[0].Columns[2].ColumnName = "PageName";
                            dsFileData.Tables[0].Columns[3].ColumnName = "ResourceType";
                            dsFileData.Tables[0].Columns[4].ColumnName = "ResourceKey";
                            dsFileData.Tables[0].Columns[5].ColumnName = "ResourceValue";
                            dsFileData.Tables[0].Columns[6].ColumnName = "VersionNo";
                            dsFileData.Tables[0].Columns[7].ColumnName = "IsActive";

                            rspjsonobj.IsValidExcel = true;

                          
                            var ResourceList = ToDynamic(dsFileData.Tables[0]);
                       
                            foreach (dynamic resource in ResourceList)
                            {
                                dynamic orderJson1 = new ExpandoObject();
                                orderJson1.Resource = resource;

                                string InputStr = JsonConvert.SerializeObject(orderJson1);
                                var dd = ResourcesKeyDataAccessManager.UpdateResourcesKey(InputStr);
                            }

                        }

                        else
                        {
                            rspjsonobj.IsValidExcel = false;
                        }
                    }
                    else
                    {
                        rspjsonobj.IsValidExcel = false;
                    }
                }
                catch (Exception ex)
                {
                    rspjsonobj.IsValidExcel = false;
                    LogData("Error Gratis Code Update" + ex.Message);
                }
                File.Delete(Path.Combine(sPath, FileName));
            }

            return Ok(rspjsonobj);
        }


        public static List<dynamic> ToDynamic(DataTable dt)
        {
            var dynamicDt = new List<dynamic>();
            foreach (DataRow row in dt.Rows)
            {
                dynamic dyn = new ExpandoObject();
                dynamicDt.Add(dyn);
                foreach (DataColumn column in dt.Columns)
                {
                    var dic = (IDictionary<string, object>)dyn;
                    dic[column.ColumnName] = row[column];
                }
            }
            return dynamicDt;
        }

        [HttpPost]
        public IHttpActionResult DownloadResourcesKey(dynamic Json)
        {

            dynamic orderDocument = new ExpandoObject();
            dynamic DocumentList = new ExpandoObject();

            DataSet dsSalesSummaryReportList = new DataSet();
            string input = JsonConvert.SerializeObject(Json);
            dsSalesSummaryReportList = ResourcesKeyDataAccessManager.GetAllResourcesKey<DataSet>(input);
            JObject returnObject = new JObject();
            dynamic filterJson = new ExpandoObject();
            DataSet ds = dsSalesSummaryReportList;

            HttpResponseMessage result = new HttpResponseMessage();
            if (ds != null)
            {
                string filePath = "";
                using (XLWorkbook wb = new XLWorkbook())
                {


                    foreach (DataTable dts in ds.Tables)
                    {
                        wb.Worksheets.Add(dts);
                    }

                    string sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/SalesSummaryReport/");

                    if (sPath != null && !Directory.Exists(sPath))
                    {
                        Directory.CreateDirectory(sPath);
                    }

                    using (MemoryStream myMemoryStream = new MemoryStream())
                    {
                        wb.SaveAs(myMemoryStream);
                        string fileName = DateTime.Now.ToString();
                        fileName = "Resources" + DateTime.Now.ToString("MMddyyyy-hhmm") + ".xlsx";
                        filePath = sPath + fileName;
                        FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write);
                        myMemoryStream.WriteTo(file);
                        file.Close();
                        myMemoryStream.Close();
                    }
                    List<dynamic> orderList = new List<dynamic>();
                    byte[] byt = File.ReadAllBytes(filePath);
                    try
                    {
                        orderDocument.DocumentBlob = byt;
                        orderDocument.DocumentFormat = "xlsx";
                      

                        filterJson.Json = orderDocument;
                        string Input1 = JsonConvert.SerializeObject(filterJson);


                        returnObject = (JObject)JsonConvert.DeserializeObject(Input1);
                    }
                    catch (Exception ex)
                    {
                        var dd = ex.Message;
                    }


                }

            }
            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult GetAllResourceForStatus(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);

            string output = ResourcesKeyDataAccessManager.GetAllResourceForStatus(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);


        }
    }
}