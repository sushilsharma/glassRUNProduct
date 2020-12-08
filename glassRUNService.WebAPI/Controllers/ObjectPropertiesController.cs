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

    public class ObjectPropertiesController : ApiController
    {
        [CustomActionFilterAttribute]
        [HttpPost]
        public IHttpActionResult GetPageControlsByPageName(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = ObjectPropertyDataAccessManager.GetPageControlsAccessList(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);

          
        }

        
        [HttpPost]
        public IHttpActionResult LoadObjectPropertiesByEmailEventId(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = ObjectPropertyDataAccessManager.LoadObjectPropertiesByEmailEventId(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }


        [HttpPost]
        public IHttpActionResult LoadObjectList(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = ObjectPropertyDataAccessManager.LoadObjectList(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }

    }
}