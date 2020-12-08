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

    public class ProfileController : ApiController
    {
        //All static variables defined in this region
        #region staticVariables
        private ProfileDTO _profileDTO = new ProfileDTO();            
        #endregion
        
        
       

        [HttpPost]
        public IHttpActionResult GetProfileById(long profileId)
        {
            
            using (var client = ServiceClient<IProfileManager>.Create(ObjectConstants.ProfileManager))
            {
                _profileDTO = client.Instance.GetProfileById(profileId);
            }
            
            
            return Ok(_profileDTO);
        }

        [HttpPost]
        public IHttpActionResult SaveProfile(ProfileDTO profile)
        {
            long profileId;
            using (var client = ServiceClient<IProfileManager>.Create(ObjectConstants.ProfileManager))
            {
                 profileId  = client.Instance.Save(profile);
            }
            
            return Ok(profileId);
        }
        
        [HttpPost]
        public IHttpActionResult UpdateProfile(ProfileDTO profile)
        {
            long profileId;
            using (var client = ServiceClient<IProfileManager>.Create(ObjectConstants.ProfileManager))
            {
                 profileId  = client.Instance.Update(profile);
            }
            
            return Ok(profileId);
        }

      }     
  }
        