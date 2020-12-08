using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using glassRUNProduct.DTO;
using Blankchq.Framework.Service.Helper;
using glassRUNProduct.Interfaces;
using System.Web.Http.Cors;
using System.Web.Script.Serialization;
using glassRUNProduct.WebAPI;

namespace glassRUNProduct.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]
    
    public class ViewRoleAccessController : ApiController
    {
        //All static variables defined in this region
        #region staticVariables
        private RoleMasterDTO _taxDTO = new RoleMasterDTO();
        #endregion

        [HttpPost]
        public IHttpActionResult GetRoleAccessData(int pageSize, int pageIndex, string orderBy, string viewRoleAccessDto)
        {
            List<RoleMasterDTO> rolemaster = new List<RoleMasterDTO>();

            JavaScriptSerializer json_serializer = new JavaScriptSerializer();

            dynamic item = json_serializer.Deserialize<RoleMasterDTO>(viewRoleAccessDto);

            if (orderBy == null)
            {
                orderBy = "";
            }

            using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
            {
                rolemaster = client.Instance.GetPaging(pageSize, pageIndex, item, orderBy);
            }

            ReturnData<RoleMasterDTO> returnData = new ReturnData<RoleMasterDTO>();

            if (rolemaster.Count > 0)
            {
                returnData.data = rolemaster;
                returnData.totalRecords = Convert.ToString(rolemaster[0].TotalCount);
            }

            return Ok(returnData);
            
        }

        [HttpPost]
        public IHttpActionResult LoadAllParentRoles()
        {
            List<RoleMasterDTO> rolemaster = new List<RoleMasterDTO>();



            using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
            {
                rolemaster = client.Instance.LoadAllParentRoles();
            }



            return Ok(rolemaster);

        }



    }
}