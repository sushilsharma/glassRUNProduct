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


namespace glassRUNProduct.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]

    public class ObjectPropertiesController : ApiController
    {
        //All static variables defined in this region
        #region staticVariables
        private ObjectPropertiesDTO _objectPropertyDTO = new ObjectPropertiesDTO();
        private ObjectDTO _objectDTO = new ObjectDTO();

        private List<ObjectDTO> _objectDTOs = new List<ObjectDTO>();
        #endregion


        [HttpPost]
        public IHttpActionResult GetAllObjectProperty()
        {
            DataSet dsObjectProperty = new DataSet();
            using (var client = ServiceClient<IObjectPropertiesManager>.Create(ObjectConstants.ObjectPropertiesManager))
            {
                dsObjectProperty = client.Instance.GetAllObjectProperties();
            }
            
            //ReturnData<ObjectPropertyDTO> returnData = new ReturnData<ObjectPropertyDTO>();
            //returnData.data = dsObjectProperty.Tables[0].DataTableToList<ObjectPropertyDTO>();;
            //returnData.totalRecords = dsObjectProperty.Tables[1].Rows[0][0].ToString();
            
            return Ok(dsObjectProperty);
        }
        
        //[HttpPost]
        //public IHttpActionResult GetPaging(int PazeSize, int PageIndex, ObjectPropertiesDTO objectProperties)
        //{
        //    DataSet dsObjectProperty = new DataSet();
        //    using (var client = ServiceClient<IObjectPropertiesManager>.Create(ObjectConstants.ObjectPropertiesManager))
        //    {
        //        dsObjectProperty = client.Instance.GetPaging(PazeSize, PageIndex, objectProperties);
        //    }
            
        //    ReturnData<ObjectPropertyDTO> returnData = new ReturnData<ObjectPropertyDTO>();
        //    returnData.data = dsObjectProperty.Tables[0].DataTableToList<ObjectPropertyDTO>();;
        //    returnData.totalRecords = dsObjectProperty.Tables[1].Rows[0][0].ToString();
            
        //    return Ok(returnData);
        //}

        [HttpPost]
        public IHttpActionResult GetObjectPropertiesById(long objectPropertyId)
        {
            
            using (var client = ServiceClient<IObjectPropertiesManager>.Create(ObjectConstants.ObjectPropertiesManager))
            {
                _objectPropertyDTO = client.Instance.GetObjectPropertiesById(objectPropertyId);
            }
            
            
            return Ok(_objectPropertyDTO);
        }

        [HttpPost]
        public IHttpActionResult SaveObjectProperty(ObjectPropertiesDTO objectProperty)
        {
            long objectPropertyId;
            using (var client = ServiceClient<IObjectPropertiesManager>.Create(ObjectConstants.ObjectPropertiesManager))
            {
                 objectPropertyId  = client.Instance.Save(objectProperty);
            }
            
            return Ok(objectPropertyId);
        }
        
        [HttpPost]
        public IHttpActionResult UpdateObjectProperty(ObjectPropertiesDTO objectProperty)
        {
            long objectPropertyId;
            using (var client = ServiceClient<IObjectPropertiesManager>.Create(ObjectConstants.ObjectPropertiesManager))
            {
                 objectPropertyId  = client.Instance.Update(objectProperty);
            }
            
            return Ok(objectPropertyId);
        }

        [HttpPost]
        public IHttpActionResult GetPageControlsByPageId(long pageId)
        {

            using (var client = ServiceClient<IObjectManager>.Create(ObjectConstants.ObjectManager))
            {
                _objectDTOs = client.Instance.GetPageControlsByPageId(pageId);
            }


            return Ok(_objectDTOs);
        }

        [HttpPost]
        public IHttpActionResult GetPageControlsByPageName(string pageName, long roleId)
        {

            using (var client = ServiceClient<IObjectManager>.Create(ObjectConstants.ObjectManager))
            {
                _objectDTOs = client.Instance.GetPageControlsByPageName(pageName, roleId);
            }


            return Ok(_objectDTOs);
        }

    }     
  }
        