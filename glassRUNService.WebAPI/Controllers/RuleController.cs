using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using System.Web.Http.Cors;
using glassRUNProduct.DataAccess;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using glassRUNProduct.BusinessRuleEngine;
using System.Web.Script.Serialization;
using System.Xml;

using System.Dynamic;
using System.Text.RegularExpressions;
using glassRUNProduct.Portal.Helper;

namespace glassRUNRequest.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]
    public class RuleController : ApiController
    {
        /// <summary>
        /// Loading Object according to ruletype
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult LoadObjectPoolProperties(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.LoadObjectPoolProperties(Input);



            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }


        [HttpPost]
        public IHttpActionResult LoadPageEvents(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.LoadPageEvents(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }


        [HttpPost]
        public IHttpActionResult LoadPageEventsProperties(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.LoadPageEventsProperties(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }

        /// <summary>
        /// Loading the function list mapped according to ruletype
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult LoadRuleTypeFunctionMapping(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.RuleTypeFunctionMapping(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }



        /// <summary>
        /// Loading rule type for dropdown
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>

        [HttpPost]
        public IHttpActionResult LoadEventRuleType(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.LoadEventRuleType(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }



        /// <summary>
        /// Loading the mapping object from ObjectRuleTypeMapping Table
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult LoadObjectRuleTypeMapping(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.LoadObjectRuleTypeMapping(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }


        /// <summary>
        /// Loading All rules
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>


        [HttpPost]
        public IHttpActionResult LoadRulesList(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.LoadRulesList(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }

        /// <summary>
        /// Sushil Sharma 04-10-2019
        /// Geting all rules related to app
        /// </summary>

        [HttpPost]
        public IHttpActionResult LoadAppRulesList(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.LoadAppRulesList(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }




        /// <summary>
        /// Getting list of Rule according to rule type by passing rule type id
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult LoadObjectByRuleType(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.LoadObjectByRuleType(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }

        [HttpPost]
        public IHttpActionResult LoadObjectPropertiesByObject(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.LoadObjectPropertiesByObject(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }


        /// <summary>
        /// Insert new rule to database
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>

        [HttpPost]
        public IHttpActionResult InsertRule(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.InsertRule(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }



        /// <summary>
        /// Update existing  rule and also can deactive the using this funcation while editing 
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult UpdateRule(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.UpdateRule(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }


        /// <summary>
        ///  Delete existing rule which is active 
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult DeleteRule(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.DeleteRule(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }



        /// <summary>
        /// Load rule from id it is using from edit funcation
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult LoadRuleByRuleId(dynamic Json)
        {
            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.LoadRuleByRuleId(Input);

            JObject returnObject = new JObject();

            if (output != null)
            {
                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }
            return Ok(returnObject);
        }



        /// <summary>
        /// Loading the function ling which is using for then value
        /// </summary>
        /// <param name="Json"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult LoadRuleFunctionList(dynamic Json)
        {

            string Input = JsonConvert.SerializeObject(Json);

            string output = RuleDataAccessManager.LoadRuleFunctionList(Input);


            JObject returnObject = new JObject();

            if (output != null)
            {

                returnObject = (JObject)JsonConvert.DeserializeObject(output);
            }




            return Ok(returnObject);


        }



        [HttpPost]
        public IHttpActionResult GetRuleValueForPackingItem(dynamic Json)
        {


            JObject objresponse1 = new JObject();
            var jsonResponse = JObject.Parse(JsonConvert.SerializeObject(Json));
            jsonResponse["Json"]["OrderTime"] = DateTime.Now.ToString("HH");
            jsonResponse["Json"]["OrderDate"] = DateTime.Now.ToString("dd/MM/yyyy");
            Json["Json"]["RuleValue"] = "";
            Json["Json"]["PackingItemSpaceConsumption"] = "0";

            string Input = JsonConvert.SerializeObject(Json);
            string output = RuleDataAccessManager.GetRuleValueForPackingItem(Input);
            if (!string.IsNullOrEmpty(Convert.ToString(output)))
            {
                JObject obj = (JObject)JsonConvert.DeserializeObject(output);
                string inputJson = JsonConvert.SerializeObject(jsonResponse);
                JObject obj11 = (JObject)JsonConvert.DeserializeObject(inputJson);
                //string finalResponse = BusinessRuleEvaluator.Condition(ruleText, obj11.ToString());

                var OrderProductList = obj11["Json"]["OrderProductList"].ToList();

                var RuleList = obj["Json"]["RuleList"].ToList();

                for (int i = 0; i < RuleList.Count; i++)
                {

                    if (!string.IsNullOrEmpty(obj["Json"]["RuleList"][i]["RuleText"].ToString()))
                    {
                        string ruleText = obj["Json"]["RuleList"][i]["RuleText"].ToString();
                        string IsJsonRequiredFromServer = obj["Json"]["RuleList"][i]["IsJsonRequiredFromServer"].ToString();
                        string ServicesAction = obj["Json"]["RuleList"][i]["ServicesAction"].ToString();





                        decimal totalPackingItemCount = 0;
                        string ruleresultvalue = "";
                        try
                        {
                            //string responseData = BusinessRuleEvaluator.ParseNotificationMessage(ruleText, obj11.ToString());
                            string responseData = ruleText;
                            int charLocation = responseData.ToLower().IndexOf("then", 0);
                            string datavalue = responseData.Substring(3, charLocation - 4);
                            string finalValue = responseData.Substring(charLocation + 4).Trim();

                            if (ruleText.Contains("'{Item.SKUCode}' in"))
                            {


                                if (charLocation > 0)
                                {

                                    string thenValue = BusinessRuleEvaluator.GetThenValue(finalValue);


                                    string[] array = datavalue.Split('&');

                                    string productIn = "";
                                    for (int k = 0; k < array.Count(); k++)
                                    {
                                        if (array[k].Contains(" in "))
                                        {
                                            productIn = array[k];
                                            string[] skuList = productIn.Split(new string[] { "in" }, StringSplitOptions.None);
                                            string productCode = skuList[1].Replace(" ", "").Replace("(", "").Replace(")", "");
                                            string[] SKUCodeList = productCode.Split(',');


                                            for (int op = 0; op < OrderProductList.Count; op++)
                                            {
                                                string poductSku = Convert.ToString(obj11["Json"]["OrderProductList"][op]["ProductCode"]);
                                                if (Array.IndexOf(SKUCodeList, poductSku) >= 0)
                                                {
                                                    totalPackingItemCount += Convert.ToDecimal(obj11["Json"]["OrderProductList"][op]["PackingItemCount"]);
                                                }

                                            }
                                        }
                                    }


                                    obj11["Json"]["Item"]["PackingItemSpace"] = Convert.ToString(totalPackingItemCount);



                                    string condationToValidate = datavalue.Replace(productIn, "");

                                    condationToValidate = condationToValidate.TrimStart('&');
                                    condationToValidate = condationToValidate.TrimEnd('&');
                                    string responseData1 = BusinessRuleEvaluator.ParseNotificationMessage(condationToValidate, obj11.ToString());


                                    bool EvalValue = BusinessRuleEvaluator.CondationEval(responseData1);
                                    if (EvalValue)
                                    {
                                        string[] PackingItemArray = datavalue.Split('&');
                                        string toBeSearched = "{Item.PackingItemSpace}";

                                        for (int pi = 0; pi < PackingItemArray.Count(); pi++)
                                        {
                                            if (PackingItemArray[pi].Contains(toBeSearched))
                                            {


                                                Regex digits = new Regex(@"^\D*?((-?(\d+(\.\d+)?))|(-?\.\d+)).*");
                                                Match mx = digits.Match(PackingItemArray[pi]);
                                                //Console.WriteLine("Input {0} - Digits {1} {2}", str, mx.Success, mx.Groups);

                                                var resultString = mx.Success ? Convert.ToDecimal(mx.Groups[1].Value) : 0;
                                                Json["Json"]["PackingItemSpaceConsumption"] = Convert.ToString(resultString);
                                                break;
                                            }
                                        }

                                        Json["Json"]["RuleValue"] = thenValue.Replace("{", "").Replace("}", "");

                                        string[] skuList = PackingItemArray[0].Split(new string[] { "in" }, StringSplitOptions.None);
                                        string productCode = skuList[1].Replace(" ", "").Replace("(", "").Replace(")", "");

                                        Json["Json"]["AllProductCode"] = productCode;

                                        //Json["Json"]["PackingItemSpaceConsumption"] = thenValue.Replace("{", "").Replace("}", "");
                                        break;
                                    }




                                }
                            }
                            else
                            {

                                string[] array = datavalue.Split('&');

                                string productIn = "";
                                for (int k = 0; k < array.Count(); k++)
                                {
                                    if (array[k].Contains("=="))
                                    {
                                        productIn = array[k];
                                        string[] skuProductList = productIn.Split(new string[] { "==" }, StringSplitOptions.None);
                                        string productCodeData = skuProductList[1].Replace(" ", "").Replace("'", "");
                                        string[] SKUCodeList = productCodeData.Split(',');


                                        for (int op = 0; op < OrderProductList.Count; op++)
                                        {
                                            string poductSku = Convert.ToString(obj11["Json"]["OrderProductList"][op]["ProductCode"]);
                                            if (Array.IndexOf(SKUCodeList, poductSku) >= 0)
                                            {
                                                totalPackingItemCount += Convert.ToDecimal(obj11["Json"]["OrderProductList"][op]["PackingItemCount"]);
                                            }

                                        }
                                    }
                                }

                                obj11["Json"]["Item"]["PackingItemSpace"] = Convert.ToString(totalPackingItemCount);


                                string condationToValidate = datavalue.Replace(productIn, "");

                                condationToValidate = condationToValidate.TrimStart('&');
                                condationToValidate = condationToValidate.TrimEnd('&');
                                string responseData1 = BusinessRuleEvaluator.ParseNotificationMessage(condationToValidate, obj11.ToString());


                                bool EvalValue = BusinessRuleEvaluator.CondationEval(responseData1);
                                if (EvalValue)
                                {

                                    string[] PackingItemArray = datavalue.Split('&');
                                    string toBeSearched = "{Item.PackingItemSpace}";

                                    for (int pi = 0; pi < PackingItemArray.Count(); pi++)
                                    {
                                        if (PackingItemArray[pi].Contains(toBeSearched))
                                        {


                                            Regex digits = new Regex(@"^\D*?((-?(\d+(\.\d+)?))|(-?\.\d+)).*");
                                            Match mx = digits.Match(PackingItemArray[pi]);
                                            //Console.WriteLine("Input {0} - Digits {1} {2}", str, mx.Success, mx.Groups);

                                            var resultString = mx.Success ? Convert.ToDecimal(mx.Groups[1].Value) : 0;
                                            Json["Json"]["PackingItemSpaceConsumption"] = Convert.ToString(resultString);
                                            break;
                                        }
                                    }

                                    JObject ruleResponseOutput = BusinessRuleEvaluator.BusinessRuleCondition(ruleText, obj11.ToString());
                                    ruleresultvalue = ruleResponseOutput["Json"]["Rule"]["Result"].ToString();

                                    string[] skuList = PackingItemArray[0].Split(new string[] { "==" }, StringSplitOptions.None);
                                    string productCode = skuList[1].Replace(" ", "").Replace("'", "");

                                    Json["Json"]["AllProductCode"] = productCode;

                                }


                            }

                        }
                        catch (Exception)
                        {
                            ruleresultvalue = "";
                        }

                        Json["Json"]["RuleValue"] = ruleresultvalue;


                        if (!string.IsNullOrEmpty(ruleresultvalue))
                        {
                            break;
                        }
                    }
                    else
                    {
                        Json["Json"]["RuleValue"] = "";
                    }

                }



            }
            else
            {
                Json["Json"]["RuleValue"] = "";
            }




            return Ok(Json);
        }











    }
}