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
using Newtonsoft.Json.Converters;
using glassRUN.Portal.Helper;

namespace glassRUNRequest.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]
    public class GridConfigurationController : ApiController
    {

        private static ICacheManager _cacheManager = new CacheManager();
        //[HttpPost]

        //public IHttpActionResult LoadGridConfiguration(dynamic Json)
        //{


        //	var expConverter = new ExpandoObjectConverter();
        //	string Input = JsonConvert.SerializeObject(Json);

        //	string output = _cacheManager.GetAllGridColumnDetailList();


        //	dynamic gridColumnListJson = new ExpandoObject();

        //	gridColumnListJson = JsonConvert.DeserializeObject<ExpandoObject>(output, expConverter);
        //	List<dynamic> GridColumnList = new List<dynamic>();
        //	GridColumnList = gridColumnListJson.Json.GridColumnList;

        //	if (GridColumnList.Count > 0)
        //	{

        //		string pageName = Json.Json.PageName;
        //		string controllerName = Json.Json.ControllerName;
        //		string RoleId = Json.Json.RoleId;
        //		string UserId = Json.Json.UserId;
        //		string CultureId = Json.Json.CultureId;
        //		string ObjectId = Json.Json.ObjectId;

        //		var GridColumnListForUserCheck = GridColumnList.Where(x => x.LoginId == UserId && x.PageName == pageName && x.CultureId == CultureId && x.ObjectId == ObjectId).ToList();

        //		if (GridColumnListForUserCheck.Count == 0)
        //		{

        //			GridColumnList = GridColumnList.Where(x => x.RoleId == RoleId && x.PageName == pageName && x.CultureId == CultureId && x.ObjectId == ObjectId).ToList();

        //		}
        //		else
        //		{

        //			GridColumnList = GridColumnListForUserCheck;

        //		}


        //	}


        //	dynamic returnObject = new ExpandoObject();
        //	returnObject.GridColumnList = GridColumnList;

        //	dynamic mainObject = new ExpandoObject();
        //	mainObject.Json = returnObject;
        //	return Ok(mainObject);
        //}




        //[HttpPost]
        //public IHttpActionResult LoadGridConfiguration(dynamic Json)
        //{
        //	string Input = JsonConvert.SerializeObject(Json);
        //	string output = GridConfigurationDataAccessManager.LoadGridConfiguration(Input);
        //	JObject returnObject = new JObject();
        //	if (output != null)
        //	{
        //		returnObject = (JObject)JsonConvert.DeserializeObject(output);
        //	}
        //	return Ok(returnObject);
        //}


        [HttpPost]
        public IHttpActionResult ClearAllGridColumnList(dynamic Json)
        {
            dynamic returnObject = new ExpandoObject();
            _cacheManager.ClearAllGridColumnList();
            return Ok(returnObject);
        }


        [HttpPost]
        public IHttpActionResult LoadGridConfiguration(dynamic Json)
        {
            dynamic returnObject = new ExpandoObject();

            //JObject returnObject = new JObject();
            try
            {


                string Input = JsonConvert.SerializeObject(Json);
                JObject obj = (JObject)JsonConvert.DeserializeObject(Input);
                var RoleId = Convert.ToString(obj["Json"]["RoleId"]);
                var UserId = Convert.ToString(obj["Json"]["UserId"]);
                var CultureId = Convert.ToString(obj["Json"]["CultureId"]);
                var ObjectName = Convert.ToString(obj["Json"]["ObjectName"]);
                var PageName = Convert.ToString(obj["Json"]["PageName"]);
                var ControllerName = Convert.ToString(obj["Json"]["ControllerName"]);






                string customApi = "";

                customApi = _cacheManager.GetAllGridColumnConfigurationList(Json);




                if (!string.IsNullOrEmpty(customApi))
                {

                    if (customApi != null)
                    {

                        var expConverter = new ExpandoObjectConverter();


                        List<dynamic> GridColumnList = new List<dynamic>();

                        JObject jObject = (JObject)JsonConvert.DeserializeObject(customApi);
                        GridColumnList = ((IEnumerable<dynamic>)jObject["Json"]["GridColumnList"]).Where(x => x.RoleId == RoleId && x.LoginId == UserId && x.ControlName == ObjectName && x.PageName == PageName && x.ControllerName == ControllerName).ToList();

                        if (GridColumnList.Count() == 0)
                        {
                            UserId = "0";
                            GridColumnList = ((IEnumerable<dynamic>)jObject["Json"]["GridColumnList"]).Where(x => x.RoleId == RoleId && x.LoginId == UserId && x.ControlName == ObjectName && x.PageName == PageName && x.ControllerName == ControllerName).ToList();
                        }

                        // Resources Section.....
                        string resourceOutput = _cacheManager.GetAllResourceListFromCache();
                        if (!string.IsNullOrEmpty(resourceOutput))
                        {
                            JObject resourcejObject = (JObject)JsonConvert.DeserializeObject(resourceOutput);
                            List<dynamic> resourceList = new List<dynamic>();


                            foreach (var item in GridColumnList)
                            {
                                var resourceKey = item["ResourceKey"];
                                resourceList = ((IEnumerable<dynamic>)resourcejObject["Resources"]["ResourcesList"]).Where(x => x.CultureId == CultureId && x.ResourceKey == resourceKey).ToList();
                                if (resourceList.Count() > 0)
                                {
                                    string resourceValue = resourceList[0]["ResourceValue"];
                                    item["caption"] = resourceValue;
                                    item["ResourceValue"] = resourceValue;
                                }

                            }
                        }



                        //resourceAllList = resourceAllList.Where(x => x.RoleId == RoleId && x.LoginId == UserId && x.ControlName == ObjectName && x.PageName == PageName && x.ControllerName == ControllerName).ToList();

                        dynamic columnList = new ExpandoObject();
                        columnList.GridColumnList = GridColumnList;

                        returnObject.Json = columnList;


                    }
                }

            }
            catch (Exception ex)
            {

                return Ok(ex.Message);
            }
            return Ok(returnObject);


        }






        /// <summary>
        /// Binding the grid column list according to page and object. It will also load the Existing matching record.
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult LoadGridColumnPagingList(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.LoadGridColumnPagingList(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }

        /// <summary>
        /// Loading the Existing record from database. Using for binding tree.
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult LoadGridColumnConfigurationList(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.LoadGridColumnConfigurationList(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }

        /// <summary>
        /// Getting record for dummy data while preview the grid on gridconfiguration.
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult LoadGridColumnPreviewDummyData(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.LoadGridColumnPreviewDummyData(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }

        /// <summary>
        /// This is use for inserting and updating the record of gridconfiguration
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult SaveGridColumnConfiguration(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.SaveGridColumnConfiguration(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }

        /// <summary>
        /// It will only mark as isactive false for record.
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult SoftDeleteGridColumnConfiguration(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.SoftDeleteGridColumnConfiguration(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult LoadGridPage(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);

            string output = GridConfigurationDataAccessManager.LoadGridPage(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult SaveGridColumn(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            JObject obj = (JObject)JsonConvert.DeserializeObject(Input);
            var gridColumnId = obj["Json"]["GridColumnList"][0]["GridColumnId"].ToString();
            if (gridColumnId == "0")
            {
                string output = GridConfigurationDataAccessManager.InsertGridColumn(Input);
            }
            else
            {
                string output = GridConfigurationDataAccessManager.UpdateGridColumn(Input);
            }
            JObject returnObject = new JObject();
            if (Input != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(Input);
            }
            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult LoadGridColumnById(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.LoadGridColumnById(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }


        [HttpPost]
        public IHttpActionResult SaveDimensionMapping(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.SaveDimensionMapping(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }



        [HttpPost]
        public IHttpActionResult UpdateDimensionMapping(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.UpdateDimensionMapping(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }


        [HttpPost]
        public IHttpActionResult UserDimensionPaging(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.UserDimensionPaging(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }



        [HttpPost]
        public IHttpActionResult GetAllGridColumnPaging(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.GetAllGridColumnPaging(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult SoftDeleteGridColumn(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.SoftDeleteGridColumn(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }

        [HttpPost]
        public IHttpActionResult DeleteUserDimensionById(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.DeleteUserDimensionById(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }



        [HttpPost]
        public IHttpActionResult LoadUserDimensionByUserDimensionId(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);
            string output = GridConfigurationDataAccessManager.LoadUserDimensionByUserDimensionId(Input);
            JObject returnObject = new JObject();
            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }

            return Ok(returnObject);

        }


    }
}