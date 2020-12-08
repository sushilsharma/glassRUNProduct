
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;

using System.Web.Http.Cors;
using glassRUNProduct.DataAccess;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using glassRUNProduct.Portal.Helper;

namespace glassRUNRequest.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]

    public class ProcessConfigurationController : ApiController
    {


        //[HttpPost]
        //public IHttpActionResult SaveProcessConfiguration([FromBody]string Json)
        //{



        //    string output = ProcessConfigurationDataAccessManager.Insert(Json);


        //    return Ok(output);
        //}

        [CustomActionFilterAttribute]
        [HttpPost]
        public IHttpActionResult SaveProcessConfiguration(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = ProcessConfigurationDataAccessManager.Insert(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);



           
        }


        //[HttpPost]
        //public IHttpActionResult GetProcessConfigurationById(long processConfigurationId)
        //{

        //    using (var client = ServiceClient<IProcessConfigurationManager>.Create(ObjectConstants.ProcessConfigurationManager))
        //    {
        //        _processConfigurationDTO = client.Instance.GetProcessConfigurationById(processConfigurationId);
        //    }


        //    return Ok(_processConfigurationDTO);
        //}

        //[HttpPost]
        //public IHttpActionResult SaveProcessConfiguration(ProcessConfigurationDTO processConfiguration)
        //{
        //    long processConfigurationId;
        //    using (var client = ServiceClient<IProcessConfigurationManager>.Create(ObjectConstants.ProcessConfigurationManager))
        //    {
        //         processConfigurationId  = client.Instance.Save(processConfiguration);
        //    }

        //    return Ok(processConfigurationId);
        //}

        //[HttpPost]
        //public IHttpActionResult UpdateProcessConfiguration(ProcessConfigurationDTO processConfiguration)
        //{
        //    long processConfigurationId;
        //    using (var client = ServiceClient<IProcessConfigurationManager>.Create(ObjectConstants.ProcessConfigurationManager))
        //    {
        //         processConfigurationId  = client.Instance.Update(processConfiguration);
        //    }

        //    return Ok(processConfigurationId);
        //}

    }
}
