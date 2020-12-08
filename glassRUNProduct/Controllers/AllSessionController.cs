using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using glassRUNProduct.DTO;
using Blankchq.Framework.Service.Helper;
using glassRUNProduct.Interfaces;
using System.Web.Http.Cors;
using Login.Interfaces;
using Login.Portal.Helper;
using System.IO;
using Login.DTO;
using glassRUNProduct.DataAccess;
using Newtonsoft.Json.Linq;

namespace glassRUNProduct.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]
    public class AllSessionController : ApiController
    {
        private List<UserInfo> _userInfo = new List<UserInfo>();

        [HttpPost]
        public IHttpActionResult GetAllMenu()
        {
            MenuMasterDTO menuMasterDto = new MenuMasterDTO();
            try
            {
                using (var client = ServiceClient<IMasterManager>.Create(ObjectConstants.MasterManager))
                {
                    menuMasterDto = client.Instance.GetAllMenuMasterByRoleMasterId(Convert.ToInt64(1));
                }
            }
            catch (Exception ex)
            {
            }

            return Ok(menuMasterDto);
        }

        public string ValidateLogin(string userName)
        {
            string returnValue = "";
            try
            {
                var objLoginDto = new LoginDTO { UserName = userName };

                LoginDTO loggedinUsertDto;
                using (var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
                {
                    loggedinUsertDto = client.Instance.ValidateUser(objLoginDto);
                }
                if (loggedinUsertDto.LoginList.Count > 0)
                {
                    for (int i = 0; i < loggedinUsertDto.LoginList.Count; i++)
                    {
                        var loginDto = loggedinUsertDto.LoginList[0];
                        //var profileDto = loggedinUsertDto.LoginList[0].ProfileList[0];
                        var objUserInfo = new UserInfo
                        {
                            ProfileId = loginDto.ProfileId,
                            UserName = loginDto.UserName,
                            Name = loginDto.Name,
                            LoginId = loginDto.LoginId,
                            RoleMasterId = loginDto.RoleMasterId,
                            RoleName = loginDto.RoleName,
                            UserTypeCode = loginDto.UserTypeCode,
                            ReferenceId = loginDto.ReferenceId,
                            ReferenceType = loginDto.ReferenceType,
                            CompanyMnemonic = loginDto.CompanyMnemonic,
                            CompanyZone = loginDto.CompanyZone,
                            UserProfilePicture = loginDto.UserProfilePicture,
                            CompanyType = loginDto.CompanyType,
                            SelfCollectValue = loginDto.SelfCollectValue,
                            ChangePasswordonFirstLoginRequired = loginDto.ChangePasswordonFirstLoginRequired,
                            PasswordWarningDays = loginDto.PasswordWarningDays,
                            NumberOfDaysRemainingForChangePassword = loginDto.NumberOfDaysRemainingForChangePassword,
                            ExpityDate = Convert.ToDateTime(loginDto.ExpiryDate),
                            //CreditLimit = loginDto.CreditLimit,
                            //AvailableCreditLimit = loginDto.AvailableCreditLimit
                        };

                        HttpContext.Current.Session["UserInfo"] = objUserInfo;
                        if (HttpContext.Current.Session["UserInfo"] != null)
                        {
                            var objUserInfo1 = (UserInfo)HttpContext.Current.Session["UserInfo"];
                        }
                        returnValue = "YES";
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return returnValue;
        }

        [HttpPost]
        public IHttpActionResult GetSessionValues()
        {
            var objUserInfo = (UserInfo)HttpContext.Current.Session["UserInfo"];

            //  ValidateLogin(objUserInfo.UserName);

            //objUserInfo = (UserInfo)HttpContext.Current.Session["UserInfo"];

            UserInfo userinfo = objUserInfo;
            _userInfo.Add(userinfo);

            return Ok(_userInfo);
        }





    }

    internal class SessionArray
    {
        public string ProfileId { get; set; }
        public string LoginId { get; set; }
        public string UserEmail { get; set; }
        public string CampusId { get; set; }
        public string FamilyCode { get; set; }
        public string RoleMasterId { get; set; }
    }
}