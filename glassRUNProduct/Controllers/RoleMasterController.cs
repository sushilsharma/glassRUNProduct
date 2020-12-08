using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using glassRUNProduct.DTO;
using glassRUNProduct.Interfaces;
using glassRUNProduct.Portal.Helper;
using System.Web.Http.Cors;
using Blankchq.Framework.Service.Helper;

namespace Campus.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]

    public class RoleMasterController : ApiController
    {
        //All static variables defined in this region
        #region staticVariables
        private RoleMasterDTO _roleMasterDTO = new RoleMasterDTO();            
        #endregion
        
        
       
        
       

        [HttpPost]
        public IHttpActionResult GetRoleMasterById(long roleMasterId)
        {
            
            using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
            {
                _roleMasterDTO = client.Instance.GetRoleMasterById(roleMasterId);
            }
            
            
            return Ok(_roleMasterDTO);
        }

        [HttpPost]
        public IHttpActionResult DeleteRoleMasterById(long roleMasterId)
        {
            int status;
            using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
            {
                status = client.Instance.DeleteRoleMasterById(roleMasterId);
            }


            return Ok(status);
        }

        [HttpPost]
        public IHttpActionResult SaveRoleMaster(RoleMasterDTO roleMaster)
        {
            long roleMasterId;
            using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
            {
                 roleMasterId  = client.Instance.Save(roleMaster);
            }
            
            return Ok(roleMasterId);
        }


        [HttpPost]
        public IHttpActionResult SaveRoleMaster1(string roleMaster)
        {
            long roleMasterId;
            using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
            {
                roleMasterId = client.Instance.Save1(roleMaster);
            }

            return Ok(roleMasterId);
        }


        [HttpPost]
        public IHttpActionResult SaveRoleAccessMaster(RoleMasterDTO roleMaster)
        {
            long roleMasterId;
            using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
            {

                roleMasterId = roleMaster.RoleMasterId == 0 ? client.Instance.Save(roleMaster) : client.Instance.UpdateRoleAccess(roleMaster);
            }

            return Ok(roleMasterId);
        }



        [HttpPost]
        public IHttpActionResult UpdateRoleMaster(RoleMasterDTO roleMaster)
        {
            long roleMasterId;
            using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
            {
                 roleMasterId  = client.Instance.Update(roleMaster);
            }
            
            return Ok(roleMasterId);
        }

      }     
  }
        