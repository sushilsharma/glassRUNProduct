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
using glassRUNProduct.Portal.Helper;
using System.Web.Http.Cors;


namespace Campus.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]

    public class CultureMasterController : ApiController
    {
        //All static variables defined in this region
        #region staticVariables
        private CultureMasterDTO _cultureMasterDTO = new CultureMasterDTO();            
        #endregion
        
        
     

        [HttpPost]
        public IHttpActionResult GetCultureMasterById(long cultureMasterId)
        {
            
            using (var client = ServiceClient<ICultureMasterManager>.Create(ObjectConstants.CultureMasterManager))
            {
                _cultureMasterDTO = client.Instance.GetCultureMasterById(cultureMasterId);
            }
            
            
            return Ok(_cultureMasterDTO);
        }

        [HttpPost]
        public IHttpActionResult SaveCultureMaster(CultureMasterDTO cultureMaster)
        {
            long cultureMasterId;
            using (var client = ServiceClient<ICultureMasterManager>.Create(ObjectConstants.CultureMasterManager))
            {
                 cultureMasterId  = client.Instance.Save(cultureMaster);
            }
            
            return Ok(cultureMasterId);
        }
        
        [HttpPost]
        public IHttpActionResult UpdateCultureMaster(CultureMasterDTO cultureMaster)
        {
            long cultureMasterId;
            using (var client = ServiceClient<ICultureMasterManager>.Create(ObjectConstants.CultureMasterManager))
            {
                 cultureMasterId  = client.Instance.Update(cultureMaster);
            }
            
            return Ok(cultureMasterId);
        }

      }     
  }
        