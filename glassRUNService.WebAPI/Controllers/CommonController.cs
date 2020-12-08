using ClosedXML.Excel;
using glassRUNProduct.DataAccess;
using glassRUNProduct.Portal.Helper;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Script.Services;
using System.Web.Services;

namespace glassRUNRequest.WebAPI.Controllers
{
    public class CommonController : ApiController
    {

        public static void LogData(string value)
        {
            try
            {
                string servicesPath = System.AppDomain.CurrentDomain.BaseDirectory;
                if (!String.IsNullOrEmpty(value))
                {
                    servicesPath += "/ColumnGridErrorLog";
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
        public void InsertInFilePath(string filepathWithFileName, string fileType)
        {
            List<dynamic> rulesList = new List<dynamic>();
            dynamic rules = new ExpandoObject();
            rules.FilePathName = filepathWithFileName;
            rules.FileType = fileType;
            rules.IsActive = true;
            rulesList.Add(rules);

            dynamic orderJson = new ExpandoObject();
            orderJson.Json = rulesList;

            //Call CreateOrder mehod in CreateOrderController
            string InputStr = JsonConvert.SerializeObject(orderJson);

            //JObject objresponse1 = new JObject();
            //var jsonResponse = JObject.Parse(JsonConvert.SerializeObject(rulesList));
            //string Input = JsonConvert.SerializeObject(jsonResponse);
            CommonDataAccessManager.InsertInFilePath(InputStr);
        }

        public string CheckPresentOrNot(string filepathWithFileName, string fileType)
        {
            List<dynamic> rulesList = new List<dynamic>();
            dynamic rules = new ExpandoObject();
            rules.FilePathName = filepathWithFileName;
            rules.FileType = fileType;
            rules.IsActive = true;
            rulesList.Add(rules);

            dynamic orderJson = new ExpandoObject();
            orderJson.Json = rulesList;

            //Call CreateOrder mehod in CreateOrderController
            string InputStr = JsonConvert.SerializeObject(orderJson);

            //JObject objresponse1 = new JObject();
            //var jsonResponse = JObject.Parse(JsonConvert.SerializeObject(rulesList));
            //string Input = JsonConvert.SerializeObject(jsonResponse);
            string output = CommonDataAccessManager.CheckFilePathPresentOrNot(InputStr);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            //dynamic order = new ExpandoObject();
            //if (!string.IsNullOrEmpty(Convert.ToString(returnObject["Json"]["FilePathList"])))
            //{
            //    order = ((JObject)returnObject["Json"]["FilePathList"]).ToObject<dynamic>();
            //}

            return output;
        }

        [HttpPost]
        public IHttpActionResult GetLicenseInfoList(dynamic json)
        {
            string Input = JsonConvert.SerializeObject(json);

            string output = CommonDataAccessManager.GetLicenseInfoList(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult GetNoteByObjectId(dynamic json)
        {
            string Input = JsonConvert.SerializeObject(json);

            string output = CommonDataAccessManager.GetNoteByObjectId(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);
        }

        public static JObject ExportToExcelInquiryGridDetails(DataSet dsList, dynamic Json)
        {
            JObject returnObject = new JObject();
            try
            {
                dynamic orderDocument = new ExpandoObject();
                dynamic DocumentList = new ExpandoObject();
                DataSet dsSalesSummaryReportList = new DataSet();
                string input = JsonConvert.SerializeObject(Json);
                JObject obj = (JObject)JsonConvert.DeserializeObject(input);
                var columnList = obj["Json"]["ColumnList"].ToList();
                dsSalesSummaryReportList = dsList;
                for (var i = dsSalesSummaryReportList.Tables[0].Columns.Count - 1; i >= 0; i--)
                {
                    var exclusionKeys = true;
                    if (dsSalesSummaryReportList.Tables[0].Columns[i].Unique == false)
                    {
                        exclusionKeys = columnList.Any(m => m["PropertyName"].ToString() == dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
                    }
                    if (exclusionKeys)
                    {
                        var columnname = dsSalesSummaryReportList.Tables[0].Columns[i].ToString();
                        var propertySequence = columnList.FirstOrDefault(m => m["PropertyName"].ToString() == dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
                        if (propertySequence != null)
                        {
                            if (!String.IsNullOrEmpty(propertySequence["ResourceValue"].ToString()))
                            {
                                DataColumnCollection columns = dsSalesSummaryReportList.Tables[0].Columns;
                                if (!columns.Contains(Convert.ToString(propertySequence["ResourceValue"])))
                                {
                                    dsSalesSummaryReportList.Tables[0].Columns[i].ColumnName = Convert.ToString(propertySequence["ResourceValue"]);
                                }
                            }
                        }
                    }
                    else
                    {
                        dsSalesSummaryReportList.Tables[0].Columns.Remove(dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
                    }
                }

                dynamic filterJson = new ExpandoObject();
                DataSet ds = dsSalesSummaryReportList;
                HttpResponseMessage result = new HttpResponseMessage();
                if (ds != null)
                {
                    string filePath = "";
                    using (XLWorkbook wb = new XLWorkbook())
                    {
                        wb.Worksheets.Add(ds.Tables[0]);
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
                            Logger.GRLogData("InquiryException" + ex.Message);
                            Logger.GRLogData("InquiryInnerException" + ex.InnerException);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.GRLogData("InquiryException" + ex.Message);
                Logger.GRLogData("InquiryInnerException" + ex.InnerException);
            }
            return returnObject;
        }


        //public static JObject ExportToExcelInquiryGridDetails(DataSet dsList, dynamic Json)
        //{
        //	JObject returnObject = new JObject();
        //	DataTable ds1=new DataTable();
        //	try
        //	{
        //		dynamic orderDocument = new ExpandoObject();
        //		dynamic DocumentList = new ExpandoObject();
        //		DataSet dsSalesSummaryReportList = new DataSet();
        //		string input = JsonConvert.SerializeObject(Json);
        //		JObject obj = (JObject)JsonConvert.DeserializeObject(input);
        //		var columnList = obj["Json"]["ColumnList"].ToList();

        //		dsSalesSummaryReportList = dsList;
        //		for(var i = dsSalesSummaryReportList.Tables[0].Columns.Count - 1; i >= 0; i--)
        //		{
        //			var exclusionKeys = true;
        //			if(dsSalesSummaryReportList.Tables[0].Columns[i].Unique == false)
        //			{
        //				exclusionKeys = columnList.Any(m => m["PropertyName"].ToString() == dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
        //			}
        //			if(!exclusionKeys)
        //			{
        //				dsSalesSummaryReportList.Tables[0].Columns.Remove(dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
        //			}

        //		}
        //		//dsSalesSummaryReportList.Tables[0].Columns.Remove(dsSalesSummaryReportList.Tables[0].Columns["rownumber"]);


        //		for(var i = dsSalesSummaryReportList.Tables[0].Columns.Count - 1; i >= 0; i--)
        //		{
        //			var exclusionKeys = true;
        //			if(dsSalesSummaryReportList.Tables[0].Columns[i].Unique == false)
        //			{
        //				exclusionKeys = columnList.Any(m => m["PropertyName"].ToString() == dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
        //			}
        //			if(exclusionKeys)
        //			{

        //				var propertySequence = columnList.FirstOrDefault(m => m["PropertyName"].ToString() == dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
        //				dsSalesSummaryReportList.Tables[0].Columns[i].SetOrdinal(Convert.ToInt32(propertySequence["SequenceNumber"]));
        //				//if(propertySequence != null && !String.IsNullOrEmpty(propertySequence["ResourceValue"].ToString()))
        //				//{
        //				//	DataColumnCollection columns = dsSalesSummaryReportList.Tables[0].Columns;
        //				//	if(!columns.Contains(Convert.ToString(propertySequence["ResourceValue"])))
        //				//	{
        //				//		dsSalesSummaryReportList.Tables[0].Columns[Convert.ToInt32(propertySequence["SequenceNumber"])].ColumnName = Convert.ToString(propertySequence["ResourceValue"]);
        //				//	}

        //				//}


        //			}

        //		}



        //		dynamic filterJson = new ExpandoObject();
        //		DataSet ds = dsSalesSummaryReportList;

        //		HttpResponseMessage result = new HttpResponseMessage();
        //		if(ds != null)
        //		{
        //			string filePath = "";
        //			using(XLWorkbook wb = new XLWorkbook())
        //			{
        //				//foreach (DataTable dts in ds.Tables)
        //				//{
        //				wb.Worksheets.Add(ds.Tables[0]);
        //				//}

        //				string sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/SalesSummaryReport/");

        //				if(sPath != null && !Directory.Exists(sPath))
        //				{
        //					Directory.CreateDirectory(sPath);
        //				}

        //				using(MemoryStream myMemoryStream = new MemoryStream())
        //				{
        //					wb.SaveAs(myMemoryStream);
        //					string fileName = DateTime.Now.ToString();
        //					fileName = "Resources" + DateTime.Now.ToString("MMddyyyy-hhmm") + ".xlsx";
        //					filePath = sPath + fileName;
        //					FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write);
        //					myMemoryStream.WriteTo(file);
        //					file.Close();
        //					myMemoryStream.Close();
        //				}
        //				List<dynamic> orderList = new List<dynamic>();
        //				byte[] byt = File.ReadAllBytes(filePath);
        //				try
        //				{
        //					orderDocument.DocumentBlob = byt;
        //					orderDocument.DocumentFormat = "xlsx";

        //					filterJson.Json = orderDocument;
        //					string Input1 = JsonConvert.SerializeObject(filterJson);

        //					returnObject = (JObject)JsonConvert.DeserializeObject(Input1);
        //				}
        //				catch(Exception ex)
        //				{
        //					var dd = ex.Message;
        //				}
        //			}
        //		}
        //	}
        //	catch(Exception ex)
        //	{
        //	}
        //	return returnObject;
        //}


        [HttpPost]
        public IHttpActionResult GetSalesOrderNumberGenerator(dynamic json)
        {


            Logger.GRLogData("GetSalesOrderNumberGenerator");
            Logger.GRLogData("Start Time" + DateTime.Now);
            string Input = JsonConvert.SerializeObject(json);

            string output = CommonDataAccessManager.GetSalesOrderNumberGenerator(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            Logger.GRLogData("end Time" + DateTime.Now);
            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult LoadDocumentList(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = CommonDataAccessManager.LoadDocumentList(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult LoadLookUpListByCritiera(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = CommonDataAccessManager.LoadLookUpListByCritiera(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);
        }



        [HttpPost]
        public IHttpActionResult LoadLogin(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = CommonDataAccessManager.LoadLookUpListByCritiera(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);
        }

        [HttpPost]
        public static string ServerSideMethod(string paraml)
        {
            return "Message from Server" + paraml;
        }

        [HttpPost]
        public IHttpActionResult CheckOtherUserActive(dynamic Json)
        {
            Logger.GRLogData("LogoutOnSesstionTimeOut");

            string Input = JsonConvert.SerializeObject(Json);
            string output = CommonDataAccessManager.CheckOtherUserActive(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);
        }

        //Created By Vinod Yadav on 26-07-2019 
        //This function use to Export to excel in csv file
        public static StringBuilder ConvertDataTableToCsvFileNew(DataTable dtData)
        {
            StringBuilder data = new StringBuilder();

            //Taking the column names.
            for (int column = 0; column < dtData.Columns.Count; column++)
            {
                //Making sure that end of the line, shoould not have comma delimiter.
                if (column == dtData.Columns.Count - 1)
                    data.Append(dtData.Columns[column].ColumnName.ToString().Replace(",", ";"));
                else
                    data.Append(dtData.Columns[column].ColumnName.ToString().Replace(",", ";") + ',');
            }

            data.Append(Environment.NewLine);//New line after appending columns.

            for (int row = 0; row < dtData.Rows.Count; row++)
            {
                for (int column = 0; column < dtData.Columns.Count; column++)
                {
                    ////Making sure that end of the line, shoould not have comma delimiter.
                    if (column == dtData.Columns.Count - 1)
                        data.Append(dtData.Rows[row][column].ToString().Replace(",", ";"));
                    else
                        data.Append(dtData.Rows[row][column].ToString().Replace(",", ";") + ',');
                }

                //Making sure that end of the file, should not have a new line.
                if (row != dtData.Rows.Count - 1)
                    data.Append(Environment.NewLine);
            }
            return data;
        }





        public static DataTable SetColumnsOrder(DataTable table, string columnNames)
        {
            string[] value = columnNames.Split(',');
            int columnIndex = 0;
            foreach (var columnName in value)
            {
                LogData("Column Enquiry Grid :" + columnName);
                table.Columns[columnName].SetOrdinal(columnIndex);
                columnIndex++;
            }

            return table;
        }


        public static JObject ExportToExcelEnquiryGridDetailsIncsv(DataSet dsList, dynamic Json)
        {
            Logger.GRLogData("ExportToExcelEnquiryGridDetailsIncsv");

            JObject returnObject = new JObject();
            try
            {
                dynamic orderDocument = new ExpandoObject();
                dynamic DocumentList = new ExpandoObject();

                DataSet dsSalesSummaryReportList = new DataSet();
                string input = JsonConvert.SerializeObject(Json);
                JObject obj = (JObject)JsonConvert.DeserializeObject(input);
                var columnList = obj["Json"]["ColumnList"].ToList();
                dsSalesSummaryReportList = dsList;
                for (var i = dsSalesSummaryReportList.Tables[0].Columns.Count - 1; i >= 0; i--)
                {
                    var exclusionKeys = true;
                    if (dsSalesSummaryReportList.Tables[0].Columns[i].Unique == false)
                    {
                        exclusionKeys = columnList.Any(m => m["PropertyName"].ToString() == dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
                    }
                    var columnname = dsSalesSummaryReportList.Tables[0].Columns[i].ToString();
                    if (columnname == "EnquiryId")
                    {
                        var hh = "1";
                    }
                    if (columnname != "OrderList_Id")
                    {
                        if (exclusionKeys)
                        {

                            var propertySequence = columnList.FirstOrDefault(m => m["PropertyName"].ToString() == dsSalesSummaryReportList.Tables[0].Columns[i].ToString());


                            if (propertySequence != null)
                            {
                                //if(!String.IsNullOrEmpty(propertySequence["ResourceValue"].ToString()))
                                //{
                                //	DataColumnCollection columns = dsSalesSummaryReportList.Tables[0].Columns;
                                //	if(!columns.Contains(Convert.ToString(propertySequence["ResourceValue"])))
                                //	{
                                //		dsSalesSummaryReportList.Tables[0].Columns[i].ColumnName = Convert.ToString(propertySequence["ResourceValue"]);
                                //	}
                                //}
                            }
                        }
                        else
                        {
                            dsSalesSummaryReportList.Tables[0].Columns.Remove(dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
                        }
                    }

                }

                dynamic filterJson = new ExpandoObject();

                DataTable dt = new DataTable();
                string columnslist = "";
                for (int i = 0; i < columnList.Count; i++)
                {
                    if (columnslist != "")
                    {
                        columnslist = columnslist + "," + Convert.ToString(columnList[i]["PropertyName"]);
                    }
                    else
                    {
                        columnslist = Convert.ToString(columnList[i]["PropertyName"]);
                    }

                }
                dt = dsSalesSummaryReportList.Tables[0];
                DataTable dt1 = SetColumnsOrder(dt, columnslist);







                for (var i = dt1.Columns.Count - 1; i >= 0; i--)
                {
                    var exclusionKeys = true;
                    if (dt1.Columns[i].Unique == false)
                    {
                        exclusionKeys = columnList.Any(m => m["PropertyName"].ToString() == dt1.Columns[i].ToString());
                    }

                    if (exclusionKeys)
                    {

                        var propertySequence1 = columnList.FirstOrDefault(m => m["PropertyName"].ToString() == dt1.Columns[i].ToString());

                        if (propertySequence1 != null)
                        {
                            if (!String.IsNullOrEmpty(propertySequence1["ResourceValue"].ToString()))
                            {
                                DataColumnCollection columns = dt1.Columns;
                                if (!columns.Contains(Convert.ToString(propertySequence1["ResourceValue"])))
                                {
                                    dt1.Columns[i].ColumnName = Convert.ToString(propertySequence1["ResourceValue"]);
                                }
                            }
                        }


                    }

                }





                DataTable ds = dt1;
                HttpResponseMessage result = new HttpResponseMessage();
                if (ds != null)
                {
                    string sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/SalesSummaryReport/");

                    if (sPath != null && !Directory.Exists(sPath))
                    {
                        Directory.CreateDirectory(sPath);
                    }

                    string strFilePath = sPath + "Resources" + DateTime.Now.ToString("MMddyyyy-hhmm") + ".csv";

                    DataTable dtDataTable = ds;

                    StringBuilder data = ConvertDataTableToCsvFileNew(dtDataTable);

                    //File.WriteAllText(strFilePath, data.ToString());

                    //using(var sw = new StreamWriter(File.Open(strFilePath, FileMode.CreateNew), Encoding.GetEncoding("iso-8859-1")))
                    //{
                    //	sw.WriteLine(data.ToString());
                    //}

                    using (StreamWriter sw = new StreamWriter(new FileStream(strFilePath, FileMode.Create), Encoding.UTF8))
                    {
                        sw.WriteLine(string.Join(",", data.ToString()));
                    }

                    //using(var sw = new StreamWriter(strFilePath, false, Encoding.Unicode))
                    //{
                    //	sw.WriteLine(data.ToString());
                    //}

                    List<dynamic> orderList = new List<dynamic>();
                    byte[] byt = File.ReadAllBytes(strFilePath);
                    try
                    {
                        orderDocument.DocumentBlob = byt;
                        orderDocument.DocumentFormat = "csv";


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
            catch (Exception ex)
            {
                Logger.GRLogData("Enquiry Grid Exception" + ex.Message);
                Logger.GRLogData("Enquiry Grid InnerException" + ex.InnerException);
            }
            return returnObject;
        }


        //Changed by nimesh on 06-01-2020
        //Changed by nimesh on 17-12-2019
        //Created By Vinod Yadav on 26-07-2019 
        //This function use to Export to excel in Pass the parameter Data set and json in dataset send data in datatable and in json send the column name in json
        public static JObject ExportToExcelinGridDetailsIncsv(DataSet dsList, dynamic Json)
        {
            Logger.GRLogData("ExportToExcelinGridDetailsIncsv");

            JObject returnObject = new JObject();
            try
            {
                dynamic orderDocument = new ExpandoObject();
                dynamic DocumentList = new ExpandoObject();

                DataSet dsSalesSummaryReportList = new DataSet();
                string input = JsonConvert.SerializeObject(Json);
                JObject obj = (JObject)JsonConvert.DeserializeObject(input);
                var columnList = obj["Json"]["ColumnList"].ToList();
                dsSalesSummaryReportList = dsList;
                for (var i = dsSalesSummaryReportList.Tables[0].Columns.Count - 1; i >= 0; i--)
                {
                    var exclusionKeys = true;
                    if (dsSalesSummaryReportList.Tables[0].Columns[i].Unique == false)
                    {
                        exclusionKeys = columnList.Any(m => m["PropertyName"].ToString() == dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
                    }
                    var columnname = dsSalesSummaryReportList.Tables[0].Columns[i].ToString();
                    if (columnname != "OrderList_Id")
                    {
                        if (exclusionKeys)
                        {

                            var propertySequence = columnList.FirstOrDefault(m => m["PropertyName"].ToString() == dsSalesSummaryReportList.Tables[0].Columns[i].ToString());


                            if (propertySequence != null)
                            {
                                //if(!String.IsNullOrEmpty(propertySequence["ResourceValue"].ToString()))
                                //{
                                //	DataColumnCollection columns = dsSalesSummaryReportList.Tables[0].Columns;
                                //	if(!columns.Contains(Convert.ToString(propertySequence["ResourceValue"])))
                                //	{
                                //		dsSalesSummaryReportList.Tables[0].Columns[i].ColumnName = Convert.ToString(propertySequence["ResourceValue"]);
                                //	}
                                //}
                            }
                        }
                        else
                        {
                            dsSalesSummaryReportList.Tables[0].Columns.Remove(dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
                        }
                    }

                }

                dynamic filterJson = new ExpandoObject();

                DataTable dt = new DataTable();
                string columnslist = "";
                for (int i = 0; i < columnList.Count; i++)
                {
                    if (columnslist != "")
                    {
                        columnslist = columnslist + "," + Convert.ToString(columnList[i]["PropertyName"]);
                    }
                    else
                    {
                        columnslist = Convert.ToString(columnList[i]["PropertyName"]);
                    }

                }
                dt = dsSalesSummaryReportList.Tables[0];
                DataTable dt1 = SetColumnsOrder(dt, columnslist);







                for (var i = dt1.Columns.Count - 1; i >= 0; i--)
                {
                    var exclusionKeys = true;
                    if (dt1.Columns[i].Unique == false)
                    {
                        exclusionKeys = columnList.Any(m => m["PropertyName"].ToString() == dt1.Columns[i].ToString());
                    }

                    if (exclusionKeys)
                    {

                        var propertySequence1 = columnList.FirstOrDefault(m => m["PropertyName"].ToString() == dt1.Columns[i].ToString());

                        if (propertySequence1 != null)
                        {
                            if (!String.IsNullOrEmpty(propertySequence1["ResourceValue"].ToString()))
                            {
                                DataColumnCollection columns = dt1.Columns;
                                if (!columns.Contains(Convert.ToString(propertySequence1["ResourceValue"])))
                                {
                                    dt1.Columns[i].ColumnName = Convert.ToString(propertySequence1["ResourceValue"]);
                                }
                            }
                        }


                    }

                }





                DataTable ds = dt1;
                HttpResponseMessage result = new HttpResponseMessage();
                if (ds != null)
                {
                    string sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/SalesSummaryReport/");

                    if (sPath != null && !Directory.Exists(sPath))
                    {
                        Directory.CreateDirectory(sPath);
                    }

                    string strFilePath = sPath + "Resources" + DateTime.Now.ToString("MMddyyyy-hhmm") + ".csv";

                    DataTable dtDataTable = ds;

                    StringBuilder data = ConvertDataTableToCsvFileNew(dtDataTable);

                    //File.WriteAllText(strFilePath, data.ToString());

                    //using(var sw = new StreamWriter(File.Open(strFilePath, FileMode.CreateNew), Encoding.GetEncoding("iso-8859-1")))
                    //{
                    //	sw.WriteLine(data.ToString());
                    //}

                    using (StreamWriter sw = new StreamWriter(new FileStream(strFilePath, FileMode.Create), Encoding.UTF8))
                    {
                        sw.WriteLine(string.Join(",", data.ToString()));
                    }

                    //using(var sw = new StreamWriter(strFilePath, false, Encoding.Unicode))
                    //{
                    //	sw.WriteLine(data.ToString());
                    //}

                    List<dynamic> orderList = new List<dynamic>();
                    byte[] byt = File.ReadAllBytes(strFilePath);
                    try
                    {
                        orderDocument.DocumentBlob = byt;
                        orderDocument.DocumentFormat = "csv";


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
            catch (Exception ex)
            {
                Logger.GRLogData("Exception" + ex.Message);
                Logger.GRLogData("InnerException" + ex.InnerException);
            }
            return returnObject;
        }



        public static JObject ExportToExcelinGridDetailsIncsvV2(DataSet dsList, dynamic Json)
        {
            Logger.GRLogData("ExportToExcelinGridDetailsIncsv");

            JObject returnObject = new JObject();
            try
            {
                dynamic orderDocument = new ExpandoObject();
                dynamic DocumentList = new ExpandoObject();

                DataSet dsSalesSummaryReportList = new DataSet();
                string input = JsonConvert.SerializeObject(Json);
                JObject obj = (JObject)JsonConvert.DeserializeObject(input);
                var columnList = obj["Json"]["ColumnList"].ToList();
                dsSalesSummaryReportList = dsList;







                //for(var i = dsSalesSummaryReportList.Tables[0].Columns.Count - 1; i >= 0; i--)
                //{
                //	var exclusionKeys = true;
                //	if(dsSalesSummaryReportList.Tables[0].Columns[i].Unique == false)
                //	{
                //		exclusionKeys = columnList.Any(m => m["PropertyName"].ToString() == dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
                //	}
                //	var columnname = dsSalesSummaryReportList.Tables[0].Columns[i].ToString();
                //	if(columnname != "OrderList_Id")
                //	{
                //		if(exclusionKeys)
                //		{

                //			var propertySequence = columnList.FirstOrDefault(m => m["PropertyName"].ToString() == dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
                //			//if(propertySequence != null)
                //			//{
                //			dsSalesSummaryReportList.Tables[0].Columns[i].SetOrdinal(Convert.ToInt32(propertySequence["SequenceNumber"]));
                //			//}

                //			if(propertySequence != null)
                //			{
                //				if(!String.IsNullOrEmpty(propertySequence["ResourceValue"].ToString()))
                //				{
                //					DataColumnCollection columns = dsSalesSummaryReportList.Tables[0].Columns;
                //					if(!columns.Contains(Convert.ToString(propertySequence["ResourceValue"])))
                //					{
                //						dsSalesSummaryReportList.Tables[0].Columns[i].ColumnName = Convert.ToString(propertySequence["ResourceValue"]);
                //					}
                //				}
                //			}
                //		}
                //		else
                //		{
                //			dsSalesSummaryReportList.Tables[0].Columns.Remove(dsSalesSummaryReportList.Tables[0].Columns[i].ToString());
                //		}
                //	}
                //}

                dynamic filterJson = new ExpandoObject();
                DataSet ds = dsSalesSummaryReportList;

                HttpResponseMessage result = new HttpResponseMessage();
                if (ds != null)
                {
                    string sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/SalesSummaryReport/");

                    if (sPath != null && !Directory.Exists(sPath))
                    {
                        Directory.CreateDirectory(sPath);
                    }

                    string strFilePath = sPath + "Resources" + DateTime.Now.ToString("MMddyyyy-hhmm") + ".csv";

                    DataTable dtDataTable = ds.Tables[0];

                    StringBuilder data = ConvertDataTableToCsvFileNew(dtDataTable);

                    //File.WriteAllText(strFilePath, data.ToString());

                    //using(var sw = new StreamWriter(File.Open(strFilePath, FileMode.CreateNew), Encoding.GetEncoding("iso-8859-1")))
                    //{
                    //	sw.WriteLine(data.ToString());
                    //}

                    using (StreamWriter sw = new StreamWriter(new FileStream(strFilePath, FileMode.Create), Encoding.UTF8))
                    {
                        sw.WriteLine(string.Join(",", data.ToString()));
                    }

                    //using(var sw = new StreamWriter(strFilePath, false, Encoding.Unicode))
                    //{
                    //	sw.WriteLine(data.ToString());
                    //}

                    List<dynamic> orderList = new List<dynamic>();
                    byte[] byt = File.ReadAllBytes(strFilePath);
                    try
                    {
                        orderDocument.DocumentBlob = byt;
                        orderDocument.DocumentFormat = "csv";


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
            catch (Exception ex)
            {
            }
            return returnObject;
        }



    }
}