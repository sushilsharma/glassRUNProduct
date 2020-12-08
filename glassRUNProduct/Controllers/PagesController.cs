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
using glassRUNProduct.WebAPI;

namespace Campus.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]

    public class PagesController : ApiController
    {
        //All static variables defined in this region
        #region staticVariables
        //private PageDTO _pageDTO = new PageDTO();   
        List<PagesDTO> _pageDtos = new List<PagesDTO>();
        #endregion


        //[HttpPost]
        //public IHttpActionResult GetAllPageList()
        //{
        //    List<PagesDTO> dsPageList = new List<PagesDTO>();
        //    using (var client = ServiceClient<IPagesManager>.Create(ObjectConstants.PagesManager))
        //    {
        //        dsPageList = client.Instance.GetAllPagesList();
        //    }
        //    return Ok(dsPageList);
        //}


        //[HttpPost]
        //public IHttpActionResult LoadPageMenuList(long roleId)
        //{

        //    using (var client = ServiceClient<IPagesManager>.Create(ObjectConstants.PagesManager))
        //    {
        //        _pageDtos = client.Instance.LoadPageMenuList(roleId);
        //    }


        //    return Ok(_pageDtos);
        //}

    }
}
        