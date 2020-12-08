using glassRUNProduct.DataAccess;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Web.Http;
using glassRUN.Portal.Helper;
using System.Web.Http.Cors;
using System.Linq;
using System.Collections.Generic;
using System.Dynamic;

namespace glassRUNRequest.WebAPI.Controllers
{
	[EnableCors("*", "*", "PUT,POST")]
	public class PageController : ApiController
	{
		private static ICacheManager _cacheManager = new CacheManager();
		public void LogData(string value)
		{
			try
			{
				string servicesPath = System.AppDomain.CurrentDomain.BaseDirectory;
				if(!String.IsNullOrEmpty(value))
				{
					servicesPath += "/ErrorLog";
					if(!Directory.Exists(servicesPath))
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
			catch(Exception)
			{
			}
		}

		[HttpPost]
		public IHttpActionResult LoadAllMenus(dynamic Json)
		{
			JObject returnObject = new JObject();

			try
			{

				string Input = JsonConvert.SerializeObject(Json);

				string output = PageDataAccessManager.LoadPageMenuList(Input);

				if(output != null)
				{

					returnObject = (JObject)JsonConvert.DeserializeObject(output);
				}

			}
			catch(Exception ex)
			{
				LogData("Exception" + ex.Message);
				return Ok(ex.Message);


			}

			return Ok(returnObject);



		}


		[HttpPost]
		public IHttpActionResult GetAllResourcesList(dynamic Json)
		{
			dynamic mainObject = new ExpandoObject();
			try
			{



				LogData("Start Time" + DateTime.Now);
				var expConverter = new ExpandoObjectConverter();
				string Input = JsonConvert.SerializeObject(Json);

				string output = _cacheManager.GetAllResourceListFromCache();
				dynamic resourceListJson = new ExpandoObject();
				var values = Json.Json.CultureId;
				resourceListJson = JsonConvert.DeserializeObject<ExpandoObject>(output, expConverter);


				List<dynamic> resourceAllList = new List<dynamic>();

				resourceAllList = resourceListJson.Resources.ResourcesList;

				resourceAllList = resourceAllList.Where(x => (x.CultureId == Convert.ToString(values) || Convert.ToString(values) == "0")).ToList();

				dynamic returnObject = new ExpandoObject();
				returnObject.ResourcesList = resourceAllList;


				mainObject.Resources = returnObject;


				LogData("End Time" + DateTime.Now);
			}
			catch(Exception ex)
			{

				LogData("Exception Resource Cache" + ex.Message);
				return Ok(ex.Message);
			}
			return Ok(mainObject);


		}


		[HttpPost]
		public IHttpActionResult ClearPageControlAccessCache(dynamic Json)
		{
			dynamic mainObject = new ExpandoObject();
			try
			{
				LogData("Start Clearing resource Time" + DateTime.Now);

				_cacheManager.ClearPageControlAccessCache();


				LogData("End Time" + DateTime.Now);
			}
			catch(Exception ex)
			{

				LogData("Exception Resource Cache" + ex.Message);
				return Ok(ex.Message);
			}
			return Ok(mainObject);


		}


		[HttpPost]
		public IHttpActionResult ClearAllResourceList(dynamic Json)
		{
			dynamic mainObject = new ExpandoObject();
			try
			{
				LogData("Start Clearing resource Time" + DateTime.Now);

				_cacheManager.ClearAllResourceListFromCache();


				LogData("End Time" + DateTime.Now);
			}
			catch(Exception ex)
			{

				LogData("Exception Resource Cache" + ex.Message);
				return Ok(ex.Message);
			}
			return Ok(mainObject);


		}



		[HttpPost]
		public IHttpActionResult ClearAllServiceConfigurationList(dynamic Json)
		{
			dynamic mainObject = new ExpandoObject();
			try
			{
				LogData("Start Clearing serviceconfiguration Time" + DateTime.Now);

				_cacheManager.ClearAllServiceConfigurationListFromCache();


				LogData("End Time" + DateTime.Now);
			}
			catch(Exception ex)
			{

				LogData("Exception serviceconfiguration Cache" + ex.Message);
				return Ok(ex.Message);
			}
			return Ok(mainObject);


		}











		[HttpPost]
		public IHttpActionResult ClearAllGridColumnConfigurationList(dynamic Json)
		{
			dynamic mainObject = new ExpandoObject();
			try
			{
				LogData("Start Clearing gridcolum Time" + DateTime.Now);

				_cacheManager.ClearAllGridColumnConfigurationListFromCache();


				LogData("End Time" + DateTime.Now);
			}
			catch(Exception ex)
			{

				LogData("Exception gridcolum Cache" + ex.Message);
				return Ok(ex.Message);
			}
			return Ok(mainObject);


		}





		[HttpPost]
		public IHttpActionResult GetAllPageControlList(dynamic Json)
		{

			string Input = JsonConvert.SerializeObject(Json);

			string output = CommonDataAccessManager.LoadAllPageControlList(Input);


			JObject returnObject = new JObject();

			if(output != null)
			{

				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}




			return Ok(returnObject);


		}

		[HttpPost]
		public IHttpActionResult GetAllPagePropertyList(dynamic Json)
		{

			string Input = JsonConvert.SerializeObject(Json);

			string output = CommonDataAccessManager.GetAllPagePropertyList(Input);


			JObject returnObject = new JObject();

			if(output != null)
			{

				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}




			return Ok(returnObject);


		}


		[HttpPost]
		public IHttpActionResult LoadPagesList(dynamic Json)
		{

			string Input = JsonConvert.SerializeObject(Json);

			string output = CommonDataAccessManager.LoadPagesList(Input);


			JObject returnObject = new JObject();

			if(output != null)
			{

				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}




			return Ok(returnObject);


		}

		[HttpPost]
		public IHttpActionResult LoadAllPagesList(dynamic Json)
		{

			string Input = JsonConvert.SerializeObject(Json);

			string output = CommonDataAccessManager.LoadAllPagesList(Input);


			JObject returnObject = new JObject();

			if(output != null)
			{

				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}




			return Ok(returnObject);


		}


		[HttpPost]
		public IHttpActionResult GetAllPageList(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);
			string output = PageDataAccessManager.GetAllPagesList(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);

		}



		[HttpPost]
		public IHttpActionResult GetAllPageControlsWithRoleWiseFieldAcessByPageIdOrRoleIdOrUserId(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);
			string output = PageDataAccessManager.GetAllPageControlsWithRoleWiseFieldAcessByPageIdOrRoleIdOrUserId(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);

		}


		[HttpPost]
		public IHttpActionResult GetAllPageControlListByPageId(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.GetAllPageControlListByPageId(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);

		}


		[HttpPost]
		public IHttpActionResult LoadRoleMasterList(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.LoadRoleMasterList(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);

		}

		[HttpPost]
		public IHttpActionResult EditRoleByRoleId(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.EditRoleByRoleId(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);

		}


		[HttpPost]
		public IHttpActionResult GetPageRoleWiseAccessDetailByRoleORUserID(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.GetPageRoleWiseAccessDetailByRoleORUserID(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);

		}



		[HttpPost]
		public IHttpActionResult GetPageDetailListByRoleORUserID(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.GetPageDetailListByRoleORUserID(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);

		}



		[HttpPost]
		public IHttpActionResult GetPageControlAccessByPageIdAndRoleAndUserID(dynamic Json)
		{

			dynamic returnObject = new ExpandoObject();
			try
			{
				LogData("Start PageAccessControl" + DateTime.Now);

				string Input = JsonConvert.SerializeObject(Json);
				JObject obj = (JObject)JsonConvert.DeserializeObject(Input);
				var PageName = Convert.ToString(obj["Json"]["PageName"]);
				var UserId = Convert.ToString(obj["Json"]["UserId"]);
				var RoleId = Convert.ToString(obj["Json"]["RoleId"]);


				string customApi = "";

				customApi = _cacheManager.GetPageControlAccessByPageIdAndRoleAndUserID(Json);

				if(!string.IsNullOrEmpty(customApi))
				{

					var expConverter = new ExpandoObjectConverter();


					List<dynamic> outPutList = new List<dynamic>();

					JObject jObject = (JObject)JsonConvert.DeserializeObject(customApi);
					outPutList = ((IEnumerable<dynamic>)jObject["Json"]["PageControlList"]).Where(x => x.LoginId == UserId && x.PageName == PageName).ToList();

					if(outPutList.Count() == 0)
					{
						UserId = "0";
						outPutList = ((IEnumerable<dynamic>)jObject["Json"]["PageControlList"]).Where(x => x.RoleId == RoleId && x.LoginId == UserId && x.PageName == PageName).ToList();
					}


					dynamic columnList = new ExpandoObject();
					columnList.PageControlList = outPutList;

					returnObject.Json = columnList;
				}

				//string output = PageDataAccessManager.GetPageControlAccessByPageIdAndRoleAndUserID(Input);
				//JObject returnObject = new JObject();
				//if (output != null)
				//{
				//    returnObject = (JObject)JsonConvert.DeserializeObject(output);
				//}

				LogData("End PageAccessControl" + DateTime.Now);

			}
			catch(Exception)
			{

				throw;
			}



			return Ok(returnObject);

		}


		[HttpPost]
		public IHttpActionResult GetPageLevelConfiguration(dynamic Json)
		{
			dynamic returnObject = new ExpandoObject();

			try
			{

				LogData("Start PageLevelConfiguration" + DateTime.Now);

				string Input = JsonConvert.SerializeObject(Json);
				JObject obj = (JObject)JsonConvert.DeserializeObject(Input);
				var CompanyId = Convert.ToString(obj["Json"]["CompanyId"]);
				var UserId = Convert.ToString(obj["Json"]["UserId"]);
				var RoleId = Convert.ToString(obj["Json"]["RoleId"]);
				var PageName = Convert.ToString(obj["Json"]["PageName"]);



				string customApi = "";

				customApi = _cacheManager.GetPageLevelConfiguration(Json);

				if(!string.IsNullOrEmpty(customApi))
				{

					var expConverter = new ExpandoObjectConverter();


					List<dynamic> outPutList = new List<dynamic>();

					JObject jObject = (JObject)JsonConvert.DeserializeObject(customApi);
					outPutList = ((IEnumerable<dynamic>)jObject["Json"]["PageWiseConfigurationList"]).Where(x => x.UserId == UserId && x.PageName == PageName).ToList();

					if(outPutList.Count() == 0)
					{
						UserId = "0";
						outPutList = ((IEnumerable<dynamic>)jObject["Json"]["PageWiseConfigurationList"]).Where(x => x.RoleId == RoleId && x.UserId == UserId && x.PageName == PageName).ToList();
					}


					dynamic columnList = new ExpandoObject();
					columnList.PageWiseConfigurationList = outPutList;

					returnObject.Json = columnList;
				}

				LogData("End PageLevelConfiguration" + DateTime.Now);
				//string output = PageDataAccessManager.GetPageLevelConfiguration(Input);
				//JObject returnObject = new JObject();
				//if (output != null)
				//{
				//    returnObject = (JObject)JsonConvert.DeserializeObject(output);
				//}

			}
			catch(Exception)
			{

				throw;
			}


			return Ok(returnObject);

		}



		[HttpPost]
		public IHttpActionResult DeleteRoleByRoleId(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.DeleteRoleByRoleId(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);

		}

		[HttpPost]
		public IHttpActionResult SaveRoleMaster(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.SaveRoleMaster(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}

		[HttpPost]
		public IHttpActionResult GetAppPageControlAccessByPageIdAndRoleAndUserID(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.GetAppPageControlAccessByPageIdAndRoleAndUserID(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}


		[HttpPost]
		public IHttpActionResult PageLevelConfigurationForApp(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.PageLevelConfigurationForApp(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}




		[HttpPost]
		public IHttpActionResult UpdateRoleMaster(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.UpdateRoleMaster(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}


		[HttpPost]
		public IHttpActionResult InsertAndUpdateRoleMaster(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.InsertAndUpdateRoleMaster(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}




		[HttpPost]
		public IHttpActionResult InsertAndUpdateRoleWisePageMappingAndRoleWiseFieldAccess(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.InsertAndUpdateRoleWisePageMappingAndRoleWiseFieldAccess(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}




		[HttpPost]
		public IHttpActionResult LoadPageAccessByRoleOrUser(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.LoadPageAccessByRoleOrUser(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);

		}



		[HttpPost]
		public IHttpActionResult AGGridFeaturesAndPerformance(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);

			string output = PageDataAccessManager.AGGridFeaturesAndPerformance(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);

		}

		#region pagewiseconfiguration Created by vinod yadav


		[HttpPost]
		public IHttpActionResult SavePagewiseconfiguration(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);
			string output = PageDataAccessManager.SavePagewiseconfiguration(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}



		[HttpPost]
		public IHttpActionResult UpdatePagewiseconfiguration(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);
			string output = PageDataAccessManager.UpdatePagewiseconfiguration(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}


		[HttpPost]
		public IHttpActionResult UserPagewiseconfiguration(dynamic Json)
		{
			LogData("UserPagewiseconfiguration");
			string Input = JsonConvert.SerializeObject(Json);
			string output = PageDataAccessManager.UserPagewiseconfigurationPaging(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}



		[HttpPost]
		public IHttpActionResult LoadPageWiseConfigurationById(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);
			string output = PageDataAccessManager.LoadPageWiseConfigurationById(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}





		[HttpPost]
		public IHttpActionResult DeletePageWiseConfigurationById(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);
			string output = PageDataAccessManager.DeletePageWiseConfigurationById(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}


		[HttpPost]
		public IHttpActionResult LoadAllPageEventByPageId(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);
			string output = PageDataAccessManager.LoadAllPageEventByPageId(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}



		[HttpPost]
		public IHttpActionResult LoadAllRuleTypeEventByPageId(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);
			string output = PageDataAccessManager.LoadAllRuleTypeEventByPageId(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}



		[HttpPost]
		public IHttpActionResult GetAllRuleTypeEvent_Paging(dynamic json)
		{
			string Input = JsonConvert.SerializeObject(json);
			string output = PageDataAccessManager.GetAllRuleTypeEvent_Paging(Input);
			JObject returnObject = new JObject();
			if(output != null)
			{
				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}
			return Ok(returnObject);
		}



		[HttpPost]
		public IHttpActionResult SavePageRuleEvent(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);
			dynamic returnObject = new ExpandoObject();

			string notValidFields = "";	


			JObject obj = (JObject)JsonConvert.DeserializeObject(Input);
			var lookupIdList = obj["Json"]["PageRuleEventList"]["PageRuleEventId"].ToString();
			if(lookupIdList == "0")
			{
				string output = PageDataAccessManager.Insert(Input);
			}
			else
			{
				string output = PageDataAccessManager.Update(Input);
			}

			// JObject returnObject = new JObject();
			if(Input != null)
			{

				returnObject = (JObject)JsonConvert.DeserializeObject(Input);
			}



			return Ok(returnObject);
		}





		[HttpPost]
		public IHttpActionResult GetPageRuleEventById(dynamic Json)
		{
			string Input = JsonConvert.SerializeObject(Json);
			string output = PageDataAccessManager.GetPageRuleEventById(Input);

			JObject returnObject = new JObject();

			if(output != null)
			{

				returnObject = (JObject)JsonConvert.DeserializeObject(output);
			}




			return Ok(returnObject);


		}


		#endregion

	}
}