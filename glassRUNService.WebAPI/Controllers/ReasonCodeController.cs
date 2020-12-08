using glassRUN.Portal.Helper;
using glassRUNProduct.DataAccess;
using glassRUNProduct.Portal.Helper;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;


namespace glassRUNRequest.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]
    public class ReasonCodeController : ApiController
    {
		private static ICacheManager _cacheManager = new CacheManager();
		[HttpPost]
        public IHttpActionResult GetAllReasoncodeList(dynamic Json)
        {

			//Logger.GRLogData("GetAllReasoncodeList");
			//Logger.GRLogData("Start Time" + DateTime.Now);
			//string deliveryLocationList = "";
			//var expConverter = new ExpandoObjectConverter();
			//string Input = JsonConvert.SerializeObject(Json);
			//var values = Json.Json.LookupCategory;
			//string output = _cacheManager.GetAllReasonCodeListFromCache();
			//dynamic locationListJson = new ExpandoObject();

			//locationListJson = JsonConvert.DeserializeObject<ExpandoObject>(output, expConverter);
			//List<dynamic> DeliveryLocationaAllList = new List<dynamic>();
			//DeliveryLocationaAllList = locationListJson.ReasonCode.ReasonCodeList;
			//DeliveryLocationaAllList = DeliveryLocationaAllList.Where(x => x.CategoryName == Convert.ToString(values)).ToList();
			//dynamic returnObject = new ExpandoObject();
			//returnObject.ReasonCodeList = DeliveryLocationaAllList;
			//dynamic mainObject = new ExpandoObject();
			//mainObject.ReasonCode = returnObject;


			//Logger.GRLogData("end Time" + DateTime.Now);

			//return Ok(mainObject);


			string Input = JsonConvert.SerializeObject(Json);

			string output = ReasonCodeDataAccessManager.GetAllReasoncodeList(Input);


			JObject returnObject = new JObject();

			if (output != null)
			{

				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}




			return Ok(returnObject);





		}


        [HttpPost]
        public IHttpActionResult SaveReasonCode(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);          
            string output = ReasonCodeDataAccessManager.Insert(Input);

            JObject returnObject = new JObject();
            if (Input != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(Input);
            }


            return Ok(returnObject);
        }
    }
}