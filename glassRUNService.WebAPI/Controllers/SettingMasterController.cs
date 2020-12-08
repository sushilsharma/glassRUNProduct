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

namespace glassRUNRequest.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]
    public class SettingMasterController : ApiController
    {
        [HttpPost]
        public IHttpActionResult LoadAllSettingMaster(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);

            string output = SettingMasterDataAccessManager.GetAllSettingMasterList(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }


        [HttpPost]
        public IHttpActionResult LoadAllCultureMaster(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);

            string output = SettingMasterDataAccessManager.LoadAllCultureMaster(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }


        [HttpPost]
        public IHttpActionResult LoadLookUpByList(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);

            string output = SettingMasterDataAccessManager.LoadLookUpByList(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);
        }


        [HttpPost]
        public IHttpActionResult LoadLookupForApp(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);

            string output = SettingMasterDataAccessManager.LoadLookupForApp(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);
        }


        [HttpPost]
        public IHttpActionResult ResourceDataForApp(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);

            string output = SettingMasterDataAccessManager.ResourceDataForApp(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);
        }


        [HttpPost]
        public IHttpActionResult SaveSettingMaster(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            JObject obj = (JObject)JsonConvert.DeserializeObject(Input);
            var SettingMasterId = obj["Json"]["SettingMasterList"][0]["SettingMasterId"].ToString();
            if (SettingMasterId == "0")
            {
                string output = SettingMasterDataAccessManager.InsertSettingMaster(Input);
            }
            else
            {
                string output = SettingMasterDataAccessManager.UpdateSettingMaster(Input);
            }
            JObject returnObject = new JObject();
            if (Input != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(Input);
            }
            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult LoadSettingMasterById(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = SettingMasterDataAccessManager.LoadSettingMasterById(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult GetAllSettingMasterPaging(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = SettingMasterDataAccessManager.GetAllSettingMasterPaging(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult SoftDeleteSettingMaster(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = SettingMasterDataAccessManager.SoftDeleteSettingMaster(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }
    }
}