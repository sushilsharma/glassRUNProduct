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

    public class OrderActivityController : ApiController
    {
        //All static variables defined in this region
        #region staticVariables
        private OrderActivityDTO _orderActivityDTO = new OrderActivityDTO();            
        #endregion
        
        
        [HttpPost]
        public IHttpActionResult GetAllOrderActivity()
        {
            DataSet dsOrderActivity = new DataSet();
            using (var client = ServiceClient<IOrderActivityManager>.Create(ObjectConstants.OrderActivityManager))
            {
                dsOrderActivity = client.Instance.GetAllOrderActivity();
            }
            return Ok(dsOrderActivity);
        }
        
        //[HttpPost]
        //public IHttpActionResult GetPaging(int PazeSize, int PageIndex, OrderActivityDTO orderActivity)
        //{
        //    DataSet dsOrderActivity = new DataSet();
        //    using (var client = ServiceClient<IOrderActivityManager>.Create(ObjectConstants.OrderActivityManager))
        //    {
        //        dsOrderActivity = client.Instance.GetPaging(PazeSize, PageIndex, orderActivity);
        //    }
            
        //    ReturnData<OrderActivityDTO> returnData = new ReturnData<OrderActivityDTO>();
        //    returnData.data = dsOrderActivity.Tables[0].DataTableToList<OrderActivityDTO>();;
        //    returnData.totalRecords = dsOrderActivity.Tables[1].Rows[0][0].ToString();
            
        //    return Ok(returnData);
        //}

        [HttpPost]
        public IHttpActionResult GetOrderActivityById(long orderActivityId)
        {
            
            using (var client = ServiceClient<IOrderActivityManager>.Create(ObjectConstants.OrderActivityManager))
            {
                _orderActivityDTO = client.Instance.GetOrderActivityById(orderActivityId);
            }
            
            
            return Ok(_orderActivityDTO);
        }

        [HttpPost]
        public IHttpActionResult SaveOrderActivity(OrderActivityDTO orderActivity)
        {
            long orderActivityId;
            using (var client = ServiceClient<IOrderActivityManager>.Create(ObjectConstants.OrderActivityManager))
            {
                 orderActivityId  = client.Instance.Save(orderActivity);
            }
            
            return Ok(orderActivityId);
        }
        
        [HttpPost]
        public IHttpActionResult UpdateOrderActivity(OrderActivityDTO orderActivity)
        {
            long orderActivityId;
            using (var client = ServiceClient<IOrderActivityManager>.Create(ObjectConstants.OrderActivityManager))
            {
                 orderActivityId  = client.Instance.Update(orderActivity);
            }
            
            return Ok(orderActivityId);
        }

      }     
  }
        