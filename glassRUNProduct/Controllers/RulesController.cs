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

    public class RulesController : ApiController
    {
        //All static variables defined in this region
        #region staticVariables
        private RulesDTO _ruleDTO = new RulesDTO();            
        #endregion
        
        
        [HttpPost]
        public IHttpActionResult GetAllRule()
        {
            DataSet dsRule = new DataSet();
            using (var client = ServiceClient<IRulesManager>.Create(ObjectConstants.RulesManager))
            {
                dsRule = client.Instance.GetAllRules();
            }
            return Ok(dsRule);
        }
        
        //[HttpPost]
        //public IHttpActionResult GetPaging(int PazeSize, int PageIndex, RulesDTO rules)
        //{
        //    DataSet dsRule = new DataSet();
        //    using (var client = ServiceClient<IRulesManager>.Create(ObjectConstants.RulesManager))
        //    {
        //        dsRule = client.Instance.GetPaging(PazeSize, PageIndex, rules);
        //    }
            
        //    ReturnData<RuleDTO> returnData = new ReturnData<RuleDTO>();
        //    returnData.data = dsRule.Tables[0].DataTableToList<RuleDTO>();;
        //    returnData.totalRecords = dsRule.Tables[1].Rows[0][0].ToString();
            
        //    return Ok(returnData);
        //}

        [HttpPost]
        public IHttpActionResult GetRulesById(long ruleId)
        {
            
            using (var client = ServiceClient<IRulesManager>.Create(ObjectConstants.RulesManager))
            {
                _ruleDTO = client.Instance.GetRulesById(ruleId);
            }
            
            
            return Ok(_ruleDTO);
        }

        [HttpPost]
        public IHttpActionResult SaveRule(RulesDTO rule)
        {
            long ruleId;
            using (var client = ServiceClient<IRulesManager>.Create(ObjectConstants.RulesManager))
            {
                 ruleId  = client.Instance.Save(rule);
            }
            
            return Ok(ruleId);
        }
        
        [HttpPost]
        public IHttpActionResult UpdateRule(RulesDTO rule)
        {
            long ruleId;
            using (var client = ServiceClient<IRulesManager>.Create(ObjectConstants.RulesManager))
            {
                 ruleId  = client.Instance.Update(rule);
            }
            
            return Ok(ruleId);
        }

      }     
  }
        