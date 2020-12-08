using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using System.Web.Helpers;
using glassRUNProduct.DTO;
using Blankchq.Framework.Service.Helper;
using glassRUNProduct.Interfaces;
using glassRUNProduct.Portal.Helper;
using System.Web.Http.Cors;
using System.Web.Script.Serialization;
using System.Collections;
using System.Dynamic;
using System.Text;
using System.Collections.ObjectModel;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;
using Blankchq.Framework;

namespace glassRUNProduct.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]

    public class ObjectController : ApiController
    {
        //All static variables defined in this region
        #region staticVariables
        private ObjectDTO _objectDTO = new ObjectDTO();
        #endregion


        [HttpPost]
        public IHttpActionResult GetAllObject()
        {
            DataSet dsObject = new DataSet();
            using (var client = ServiceClient<IObjectManager>.Create(ObjectConstants.ObjectManager))
            {
                dsObject = client.Instance.GetAllObject();
            }

            //ReturnData<ObjectDTO> returnData = new ReturnData<ObjectDTO>();
            //returnData.data = dsObject.Tables[0].DataTableToList<ObjectDTO>();;
            //returnData.totalRecords = dsObject.Tables[1].Rows[0][0].ToString();

            return Ok(dsObject);
        }


        [HttpPost]
        public IHttpActionResult GetAllObjectList()
        {
            List<ObjectDTO> objectList = new List<ObjectDTO>();
            using (var client = ServiceClient<IObjectManager>.Create(ObjectConstants.ObjectManager))
            {
                objectList = client.Instance.GetAllObjectList();
            }

            //ReturnData<ObjectDTO> returnData = new ReturnData<ObjectDTO>();
            //returnData.data = dsObject.Tables[0].DataTableToList<ObjectDTO>();;
            //returnData.totalRecords = dsObject.Tables[1].Rows[0][0].ToString();

            return Ok(objectList);
        }

        [HttpPost]
        public IHttpActionResult GetAllObjectPropertiesListByObjectId(long objectId)
        {
            List<ObjectPropertiesDTO> objectList = new List<ObjectPropertiesDTO>();
            using (var client = ServiceClient<IObjectPropertiesManager>.Create(ObjectConstants.ObjectPropertiesManager))
            {
                objectList = client.Instance.GetAllObjectPropertiesByObjectId(objectId);
            }

            //ReturnData<ObjectDTO> returnData = new ReturnData<ObjectDTO>();
            //returnData.data = dsObject.Tables[0].DataTableToList<ObjectDTO>();;
            //returnData.totalRecords = dsObject.Tables[1].Rows[0][0].ToString();

            return Ok(objectList);
        }

        //[HttpPost]
        //public IHttpActionResult GetPaging(int PazeSize, int PageIndex, ObjectDTO object)
        //{
        //    DataSet dsObject = new DataSet();
        //    using (var client = ServiceClient<IObjectManager>.Create(ObjectConstants.ObjectManager))
        //    {
        //        dsObject = client.Instance.GetPaging(PazeSize, PageIndex, object);
        //    }

        //    ReturnData<ObjectDTO> returnData = new ReturnData<ObjectDTO>();
        //    returnData.data = dsObject.Tables[0].DataTableToList<ObjectDTO>();;
        //    returnData.totalRecords = dsObject.Tables[1].Rows[0][0].ToString();

        //    return Ok(returnData);
        //}

        [HttpPost]
        public IHttpActionResult GetObjectById(long objectId)
        {

            using (var client = ServiceClient<IObjectManager>.Create(ObjectConstants.ObjectManager))
            {
                _objectDTO = client.Instance.GetObjectById(objectId);
            }


            return Ok(_objectDTO);
        }

        [HttpPost]
        public IHttpActionResult SaveObject(ObjectVersionDTO objectsVerdionDto)
        {
            long objectId;
            using (var client = ServiceClient<IObjectVersionManager>.Create(ObjectConstants.ObjectVersionManager))
            {
                objectsVerdionDto.CreatedBy = 1;
                objectId = client.Instance.Save(objectsVerdionDto);
            }

            return Ok(objectId);
        }

        [HttpPost]
        public IHttpActionResult UpdateObject(ObjectDTO objects)
        {
            long objectId;
            using (var client = ServiceClient<IObjectManager>.Create(ObjectConstants.ObjectManager))
            {
                objectId = client.Instance.Update(objects);
            }

            return Ok(objectId);
        }




        [HttpPost]
        public IHttpActionResult GetObjectVersionData(int pageSize, int pageIndex, string orderBy, string viewObjectVersionDto)
        {
            List<ObjectVersionDTO> objectversionmaster = new List<ObjectVersionDTO>();

            JavaScriptSerializer json_serializer = new JavaScriptSerializer();

            dynamic item = json_serializer.Deserialize<ObjectVersionDTO>(viewObjectVersionDto);

            if (orderBy == null)
            {
                orderBy = "";
            }

            using (var client = ServiceClient<IObjectVersionManager>.Create(ObjectConstants.ObjectVersionManager))
            {
                objectversionmaster = client.Instance.GetPaging(pageSize, pageIndex, item, orderBy);
            }

            ReturnData<ObjectVersionDTO> returnData = new ReturnData<ObjectVersionDTO>();

            if (objectversionmaster.Count > 0)
            {
                returnData.data = objectversionmaster;
                returnData.totalRecords = Convert.ToString(objectversionmaster[0].TotalCount);
            }

            return Ok(returnData);

        }



        [HttpPost]
        public IHttpActionResult GetObjectVersionDetailsById(long objectVersionId)
        {
            ObjectVersionDTO objectversionDto = new ObjectVersionDTO();
            using (var client = ServiceClient<IObjectVersionManager>.Create(ObjectConstants.ObjectVersionManager))
            {
                objectversionDto = client.Instance.GetObjectVersionById(objectVersionId);
            }

            return Ok(objectversionDto);
        }

        [HttpPost]
        public IHttpActionResult DeleteObjectVersion(long objectVersionId)
        {
            int status;
            using (var client = ServiceClient<IObjectVersionManager>.Create(ObjectConstants.ObjectVersionManager))
            {
                status = client.Instance.DeleteObjectVersionById(objectVersionId);
            }


            return Ok(status);
        }

        public string GetObjectVaue(List<ObjectVersionDTO> objectVersionDTO, string objectname, string propertName)
        {
            string returnvalue = "";
            if (objectVersionDTO.Count > 0)
            {
                var varversiondto = objectVersionDTO.Where(e => e.ObjectName == objectname).ToList();

                if (varversiondto.Count > 0)
                {
                    var objProperty = varversiondto[0].ObjectVersionDefaultsList.Where(e => e.PropertName == propertName).ToList();
                    if (objProperty.Count > 0)
                    {
                        returnvalue = objProperty[0].DefaultValue;
                    }
                }
            }

            return returnvalue;
        }

        public object PrintProperties(object obj, int indent, List<ObjectVersionDTO> objectVersionDTO)
        {
            if (obj == null)
            {
                return false;
            }
            string indentString = new string(' ', indent);
            Type objType = obj.GetType();
            PropertyInfo[] properties = objType.GetProperties();
            foreach (PropertyInfo property in properties)
            {
                object propValue = property.GetValue(obj, null);
                if (propValue != null)
                {
                    if (IsSimpleType(property.PropertyType))
                    {
                        string ObjectName = property.DeclaringType.Name;
                        if (string.IsNullOrEmpty(propValue.ToString()))
                        {
                            string defaultvalue = GetObjectVaue(objectVersionDTO, ObjectName, property.Name);
                            property.SetValue(obj, defaultvalue, null);
                        }

                        Console.WriteLine("{0}{1}: {2}", indentString, property.Name, propValue);
                    }
                    else if (typeof(IEnumerable).IsAssignableFrom(property.PropertyType))
                    {
                        if (property.PropertyType == typeof(string[]))
                        {
                            Console.WriteLine("{0}{1}: {2}", indentString, property.Name, string.Join(",", (string[])propValue));
                        }
                        else
                        {
                            Console.WriteLine("{0}{1}:", indentString, property.Name);
                            IEnumerable enumerable = (IEnumerable)propValue;
                            foreach (object child in enumerable)
                            {
                                PrintProperties(child, indent + 2, objectVersionDTO);
                            }
                        }
                    }
                    else
                    {
                        Console.WriteLine("{0}{1}:", indentString, property.Name);
                        PrintProperties(propValue, indent + 2, objectVersionDTO);
                    }
                }
            }
            return obj;
        }



        public static bool IsSimpleType(Type type)
        {
            return
                type.IsValueType ||
                type.IsPrimitive ||
                new Type[]
                {
            typeof(String),
            typeof(Decimal),
            typeof(DateTime),
            typeof(DateTimeOffset),
            typeof(TimeSpan),
            typeof(Guid)
                }.Contains(type) ||
                Convert.GetTypeCode(type) != TypeCode.Object;
        }


        [HttpPost]
        public IHttpActionResult DemoObjectVersion(Order objectsVerdionDto)
        {
            long objectId = 0;
            try
            {
                Order o = new Order();
                List<ObjectVersionDTO> objeList = GetDefaultPropertiesByPageName("Order");
                var finalvalue = PrintProperties(objectsVerdionDto, 1, objeList);
                string conditionString = "If {e1type} == '09' then 7 & If {e1type} == '01' then 9";
                //BusinessRuleEngine.BusinessRuleEvaluator.Condition(conditionString, finalvalue);
            }
            catch (Exception ex)
            {

            }
            return Ok(objectId);
        }
        

        protected static string ParseNotificationMessage(string msg, object mailProofOfDelivery)
        {
            string resultMsg = msg;
            //object objEntity = DTOObject;
            //int sendingMailProperty = DTOObject.ToString().IndexOf('.');
            //string propsend = DTOObject.ToString().Substring(sendingMailProperty + 1);
            MatchCollection mc = Regex.Matches(msg, @"\#\w.*?\#", RegexOptions.Compiled | RegexOptions.Multiline | RegexOptions.IgnoreCase | RegexOptions.IgnorePatternWhitespace);
            foreach (Match m in mc)
            {
                //string propertyName = objEntity.ObjectType + "." + m.Value.Replace("{", "").Replace("}", "");
                string propertyName = m.Value.Replace("#", "").Replace("#", "");
                //resultMsg = resultMsg.Replace(m.Value, ReflectionUtility.PrintReturnedProperties(mailProofOfDelivery, propertyName).ToString());
            }

            return resultMsg;
        }        


        public List<ObjectVersionDTO> GetDefaultPropertiesByPageName(string pageName)
        {
            List<ObjectVersionDTO> objecPtopertirsList = new List<ObjectVersionDTO>();
            using (var client = ServiceClient<IObjectVersionManager>.Create(ObjectConstants.ObjectVersionManager))
            {
                objecPtopertirsList = client.Instance.GetDefaultPropertiesByPageName(pageName);
            }

            return objecPtopertirsList;
        }


    }



    public class Order
    {
        public long OrderId { get; set; }
        public string OrderNumber { get; set; }

        public string CustomerId { get; set; }

        public string CustomerType { get; set; }

        public string PurchaseOrderNumber { get; set; }

        public string TransportId { get; set; }

        public OrderProduct OrderProduct;

        public List<OrderProduct> OrderProductList { get; set; }

        public List<Order> OrderList { get; set; }

        public Order order { get; set; }

        public Order()
        {
            OrderProduct = new OrderProduct();
        }

    }

    public class OrderProduct
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; }

        public string UnitSize { get; set; }

        public string UnitOfMeasure { get; set; }

        public string ProductType { get; set; }


        public List<OrderProduct> OrderProductList;

        public OrderProduct()
        {
            OrderProductList = new List<OrderProduct>();
        }


    }


    public static class DemoClass
    {
        public static Dictionary<string, object> deserializeJson(this string json)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Dictionary<string, object> dictionary =
             serializer.Deserialize<Dictionary<string, object>>(json);
            return dictionary;
        }

        public static void GetObject(string jSonobj)
        {
            Dictionary<string, object> dic = jSonobj.deserializeJson();
            resolveEntry(dic, "Base");
            Console.ReadKey();
        }
        static void resolveEntry(Dictionary<string, object> dic, string SupKey)
        {
            // Each entry in the main dictionary is [Table-Key , Table-Value]
            foreach (KeyValuePair<string, object> entry in dic)
            {
                if (entry.Value is Dictionary<string, object>)  // for Meta and Data
                    resolveEntry((Dictionary<string, object>)entry.Value, entry.Key);
                else
                    if (entry.Value is ICollection)

                // Checks whether the current Table-Value in Table is Sub-Dictionary|Collection|Flat Object
                {
                    foreach (var item in (ICollection)entry.Value)

                    // If the table base value is a collection of items then loop through them
                    {
                        if (item is Dictionary<string, object>)

                            // If the Collection-Item is a Dictionary then submit it for resolving
                            resolveEntry((Dictionary<string, object>)item, SupKey + " : " + entry.Key);
                        else
                            Console.WriteLine(item.ToString());

                        // If the Collection-Item is a Flat Object then output
                    }
                }
                else
                    Console.WriteLine(SupKey + " : " +
                     entry.Key.ToString() + "--->" + entry.Value.ToString());

                // The Current Table-Value is Flat Object
            }
        }


        public static bool IsGenericList(this object Value)
        {
            var t = Value.GetType();
            return t.IsGenericType && t.GetGenericTypeDefinition() == typeof(List<>);
        }

    }
}
