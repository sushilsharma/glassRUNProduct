using glassRUNProduct.Portal.Helper;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Web;

namespace glassRUNProduct.WebAPI
{
    /// <summary>
    /// Summary description for SNSNotificationHandler
    /// </summary>
    public class SNSNotificationHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (!Directory.Exists(context.Server.MapPath("ReceivedData")))
                {
                    Directory.CreateDirectory(context.Server.MapPath("ReceivedData"));
                }

                

                byte[] MyByteArray = new byte[context.Request.InputStream.Length];
                context.Request.InputStream.Read(MyByteArray, 0, Convert.ToInt32(context.Request.InputStream.Length));

                String InputStreamContents;
                InputStreamContents = System.Text.Encoding.UTF8.GetString(MyByteArray);
                // Used for testing the message parsing
               InputStreamContents = "{  \"Type\" : \"Notification\",  \"MessageId\" : \"01020168031ce96d-0639810c-3cb4-4ef0-9af0-9264d7b0942b-000000\",  \"TopicArn\" : \"arn:aws:sns:eu-west-1:923101421764:Disrptiv_Bounce_Email\",  \"Message\" : \"{\\\"notificationType\\\":\\\"Bounce\\\",\\\"bounce\\\":{\\\"bounceSubType\\\":\\\"General\\\",\\\"bounceType\\\":\\\"Permanent\\\",\\\"reportingMTA\\\":\\\"dns;SINPR04MB345.apcprd04.prod.outlook.com\\\",\\\"bouncedRecipients\\\":[{\\\"emailAddress\\\":\\\"sonus@disrptiv.com\\\",\\\"status\\\":\\\"5.1.10\\\",\\\"diagnosticCode\\\":\\\"smtp;550 5.1.10 RESOLVER.ADR.RecipientNotFound; Recipient not found by SMTP address lookup\\\",\\\"action\\\":\\\"failed\\\"}],\\\"timestamp\\\":\\\"2015-11-22T03:36:00.000Z\\\",\\\"feedbackId\\\":\\\"000001511ff9a06f-1a8b1f2c-8ec3-11e5-81f9-d525d534e8c8-000000\\\"},\\\"mail\\\":{\\\"timestamp\\\":\\\"2015-11-19T13:39:36.000Z\\\",\\\"source\\\":\\\"bp@glassrun.biz\\\",\\\"messageId\\\":\\\"000001511ff8c67e-064bf17f-be82-40bd-80f9-bf631ac50fc2-000000\\\",\\\"destination\\\":[\\\"sonus@disrptiv.com\\\"],\\\"sourceArn\\\":\\\"arn:aws:ses:eu-west-1:923101421764:identity/glassrun.biz\\\",\\\"sendingAccountId\\\":\\\"923101421764\\\"}}\",  \"Timestamp\" : \"2015-11-19T13:40:32.138Z\",  \"SignatureVersion\" : \"1\",  \"Signature\" : \"Ecjuyb3wKT/k3NyoxwpNfoT/BM8LhCsikwMKm/sxLvdH/OSMJCbGO7xLuhn6O9ovkg2MsByDNeJNt+zfckeUXje11QEbnWTV2dHNGwRRDBSIPuklrxJ9h6V/1QFSAnZeDu6AJRpndb4qvp/vsRO1dwQshIn/l7r91Y6RVUJ+443+mRaBLO2v0JNAZv5YIQ3KG9iNi6wMxhVq/i9jA1N5BT0FnK54WWtgkgqVb5ipWRJH/ua+Csw4VaOUKAgllaH00e3lO3mePoYBr9bUulrn/DX83NEhStwLfdgNFEKH4kD+Y/73ylo/lbigvJHXR1YaUFlgkmr0fOmeQKc/INIzXg==\",  \"SigningCertURL\" : \"https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-bb750dd426d95ee9390147a5624348ee.pem\",  \"UnsubscribeURL\" : \"https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:923101421764:Disrptiv_Bounce_Email:95e9ee00-bc70-4593-bcb6-2d362824436c\"}";

              //  InputStreamContents = "{ \"Type\" : \"Notification\", \"MessageId\" : \"01020167f52a6a9a-535b7eb6-ee3a-4328-9e31-6cd7a708acba-000000\", \"TopicArn\" : \"arn:aws:sns:eu-west-1:631422535324:glassRUN_Ireland_Delivery_Notification\", \"Message\" : \" {\\\"notificationType\\\":\\\"Delivery\\\",\\\"mail\\\":{\\\"timestamp\\\":\\\"2017-04-11T09:21:46.260Z\\\",\\\"source\\\":\\\"bp - auto - aus@glassrun.biz\\\",\\\"sourceArn\\\":\\\"arn: aws: ses: eu - west - 1:631422535324:identity / glassrun.biz\\\",\\\"sourceIp\\\":\\\"34.248.65.243\\\",\\\"sendingAccountId\\\":\\\"631422535324\\\",\\\"messageId\\\":\\\"01020167f52a6a9a-535b7eb6-ee3a-4328-9e31-6cd7a708acba-000000\\\",\\\"destination\\\":[\\\"sonus@disrptiv.com\\\"]},\\\"delivery\\\":{\\\"timestamp\\\":\\\"2017 - 12 - 08T01: 14:32.375Z\\\",\\\"processingTimeMillis\\\":2481,\\\"recipients\\\":[\\\"sonus@disrptiv.com\\\"],\\\"smtpResponse\\\":\\\"250 ok 1512695672 qp 17381 server - 14.tower - 201.messagelabs.com!1512695670!38116510!1\\\",\\\"remoteMtaIp\\\":\\\"216.82.242.45\\\",\\\"reportingMTA\\\":\\\"a7 - 28.smtp -out.eu - west - 1.amazonses.com\\\"}}\", \"Timestamp\" : \"2017-12-08T01:14:32.436Z\", \"SignatureVersion\" : \"1\", \"Signature\" : \"J3X6NRl7GQqwwthRFmauxchh9LCKrHxCam1BJSglmyD5mBVwe4mqdv+hEpijc2zJVwXPbJDYiT+UdM/brFNqrcOTt8COS0Dkc3FizKo1PWqv8WwCZGHVIOQJPWlV3M/fVcfawFZaXj06uNfEXPhpUNgMq2jeDi2zOR9SDHmXkE5p1EFcXnQY9Bwdch+JQPgRs+KMQXBPSQTN0UNhgC/sD90hkvrG3iVHrwlMfVidcdvxUet5ihQ+xSJ/7r/C1dSvet02e9jepszmGw7v5AH1WpG9HhUhdEjXktpZtmYEccflqCkBmT75yhhU4rag9RDA8PJ4qNe4cMjxrAK/618Q5A==\", \"SigningCertURL\" : \"https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-433026a4050d206028891664da859041.pem\", \"UnsubscribeURL\" : \"https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:631422535324:glassRUN_Ireland_Delivery_Notification:0aa263ff-71ca-4a12-86da-000604433479\" }";
                System.Web.Script.Serialization.JavaScriptSerializer MyJavaScriptSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
               
                using (System.IO.StreamWriter file = new System.IO.StreamWriter(context.Server.MapPath("ReceivedData") + "/info.txt", true))
                {
                    file.WriteLine("JSON :" + InputStreamContents);
                }

              

                if (!string.IsNullOrEmpty(InputStreamContents))
                {


                    var expConverter = new ExpandoObjectConverter();
                    dynamic SNSObject = JsonConvert.DeserializeObject<ExpandoObject>(InputStreamContents, expConverter);

                    


                    dynamic JsonObject = new ExpandoObject();
                    JsonObject.SNSObject = SNSObject;
                    
                    dynamic mainObject = new ExpandoObject();
                    mainObject.Json = JsonObject;


                    GRApi.GRApiCall("GetSNSNotification", JsonConvert.SerializeObject(mainObject));
                }


            }
            catch (Exception ex)
            {
                using (System.IO.StreamWriter file = new System.IO.StreamWriter(context.Server.MapPath("ReceivedData") + "/info.txt", true))
                {
                    file.WriteLine("Exception :" + ex.Message);
                }
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}