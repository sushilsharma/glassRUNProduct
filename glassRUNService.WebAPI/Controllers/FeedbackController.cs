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

namespace glassRUNRequest.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]
    public class FeedbackController : ApiController
    {
        [HttpPost]
        public IHttpActionResult LoadFeedbackList(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = FeedbackDataAccessManager.LoadFeedbackList(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }


        [HttpPost]
        public IHttpActionResult LoadFeedbackList_Paging(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = FeedbackDataAccessManager.LoadFeedbackList_Paging(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }


       

        [HttpPost]
        public IHttpActionResult UpdateEmailNotification(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            JObject obj = (JObject)JsonConvert.DeserializeObject(Input);
            string output = FeedbackDataAccessManager.UpdateEmailNotification(Input);
            JObject returnObject = new JObject();
            if (Input != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(Input);
            }


            return Ok(returnObject);
        }




        [HttpPost]
        public IHttpActionResult GetAllFeedbackDetailsForExport(dynamic Json)
        {
            JObject returnObject2 = new JObject();
            try
            {
                DataSet dsExportToExcelInquiryGridforOMList = new DataSet();
                string input = JsonConvert.SerializeObject(Json);
                dsExportToExcelInquiryGridforOMList = FeedbackDataAccessManager.ExportToExcelFeedbackGrid<DataSet>(input);

                returnObject2 = CommonController.ExportToExcelInquiryGridDetails(dsExportToExcelInquiryGridforOMList, Json);
            }
            catch (Exception ex)
            {


            }

            return Ok(returnObject2);

        }



    }
}