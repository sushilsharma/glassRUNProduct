using Blankchq.Framework;
using Blankchq.Framework.PasswordUtility;
using Blankchq.Framework.Service.Helper;
using glassRUNProduct.DataAccess;
using glassRUNProduct.Portal.Helper;
using Login.DTO;
using Login.Interfaces;
using Login.Mail.DTO;
using Login.Mail.Interface;
using Login.Portal.Helper;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;


namespace glassRUNProduct.WebAPI.Controllers
{
	[EnableCors("*", "*", "PUT,POST")]
	public class LoginServiceController : ApiController
	{
		public string AccesKey = "AIzaSyD9I7yVwNbw86m1F1";

		private RSASecurity sec = new RSASecurity();

		/// <summary>
		/// Function to get the public key information. This key is stored on the client side which is then used to encrypt the data
		/// </summary>
		/// <returns></returns>
		[HttpPost]
		public IHttpActionResult InitializationBeforeLogin()
		{
			string path = System.AppDomain.CurrentDomain.BaseDirectory + "/" + ConfigurationManager.AppSettings["rsaPrivateKeyFilePath"].ToString();
			sec.createParam(path);

			string e = sec.GetRSA_E();
			string m = sec.GetRSA_M();

			dynamic obj = new ExpandoObject();
			obj.Exponent = e;
			obj.Modulus = m;
			obj.Challenge = GetChallenge();

			dynamic orderJson = new ExpandoObject();
			orderJson.Json = obj;

			return Ok(orderJson);
		}

		//User Login Authontication
		[HttpPost]
		[AllowAnonymous]
		public List<string> ValidateLogin(string userName, string userPassword, string apiAccessKey)
		{
			List<string> returnstring = new List<string>();


			#region ValidateLogin

			string path = System.AppDomain.CurrentDomain.BaseDirectory + "/" + ConfigurationManager.AppSettings["rsaPrivateKeyFilePath"].ToString();
			sec.createParam(path);

			//loggedinUsertDTO.UserName = inputUserName.Text;
			string password = sec.GetDecryptedPassword(userPassword, this.GetChallenge());

			userPassword = password;

			string returnValue = "";
			string returnToken = "";

			

			try
			{
				LogWsData("userName :" + userName + "userPassword : " + userPassword);
				var objLoginDto = new LoginDTO { UserName = userName };
				if(AccesKey == apiAccessKey)
				{
					LoginDTO loggedinUsertDto;
					using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
					{
						loggedinUsertDto = client.Instance.ValidateUser(objLoginDto);
					}
					if(loggedinUsertDto.LoginList.Count > 0)
					{
						for(int i = 0; i < loggedinUsertDto.LoginList.Count; i++)
						{
							string hashPassword = Password.HashPassword(userPassword, Convert.ToInt32(loggedinUsertDto.LoginList[i].PasswordSalt));
							if(loggedinUsertDto.LoginList[i].HashedPassword == hashPassword)
							{
								var loginDto = loggedinUsertDto.LoginList[0];

								var tokenHandler = new JwtSecurityTokenHandler();
								var key = Encoding.ASCII.GetBytes("GQDstcKsx0NHjPOuXOYg5MbeJ1XT0uFiwDVvVBrk");
								var tokenDescriptor = new SecurityTokenDescriptor
								{
									Subject = new ClaimsIdentity(new Claim[]
									{
										new Claim(ClaimTypes.Name, loginDto.LoginId.ToString())
									}),
									Expires = DateTime.UtcNow.AddDays(7),
									SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
								};
								var token = tokenHandler.CreateToken(tokenDescriptor);
								var tokenString = tokenHandler.WriteToken(token);

								//string token = Convert.ToString(Guid.NewGuid());
								//var profileDto = loggedinUsertDto.LoginList[0].ProfileList[0];
								var objUserInfo = new UserInfo
								{
									ProfileId = loginDto.ProfileId,
									UserName = loginDto.UserName,
									Name = loginDto.Name,
									LoginId = loginDto.LoginId,
									RoleMasterId = loginDto.RoleMasterId,
									RoleName = loginDto.RoleName,
									PageUrl = loginDto.PageUrl,
									PageName = loginDto.PageName,
									UserTypeCode = loginDto.UserTypeCode,
									ActivationCode = loginDto.ActivationCode,
									ReferenceId = loginDto.ReferenceId,
									ReferenceType = loginDto.ReferenceType,
									CompanyMnemonic = loginDto.CompanyMnemonic,
									CompanyZone = loginDto.CompanyZone,
									ParentCompanyId = loginDto.ParentCompanyId,
									SelfCollectValue = loginDto.SelfCollectValue,
									ChangePasswordonFirstLoginRequired = loginDto.ChangePasswordonFirstLoginRequired,
									CompanyType = loginDto.CompanyType,
									Token = tokenString,
									UserProfilePicture = loginDto.UserProfilePicture,
									DefaultLanguage = loginDto.DefaultLanguage,
									StockLocationCode = loginDto.StockLocationCode,
									UserPersonaMasterId = loginDto.UserPersonaMasterId,
									UserPersona = loginDto.UserPersona,
									PasswordWarningDays =loginDto.PasswordWarningDays,
									NumberOfDaysRemainingForChangePassword=loginDto.NumberOfDaysRemainingForChangePassword,
									ExpityDate=Convert.ToDateTime(loginDto.ExpiryDate),
                                    //CreditLimit= loginDto.CreditLimit,
                                    //AvailableCreditLimit = loginDto.AvailableCreditLimit
                                };

								LoginHistoryDTO loginHistoryDto = new LoginHistoryDTO();
								using(var client = ServiceClient<ILoginHistoryManager>.Create(ObjectConstants.LoginHistoryManager))
								{
									loginHistoryDto.LoginId = objUserInfo.LoginId;
									loginHistoryDto.LoggingInTime = DateTime.Now;
									loginHistoryDto.IsActive = true;
									loginHistoryDto.CreatedBy = objUserInfo.LoginId;
									loginHistoryDto.Token = tokenString;
									objUserInfo.LoginHistoryId = client.Instance.Save(loginHistoryDto);
								}

								HttpContext.Current.Session["UserInfo"] = objUserInfo;



								if(CheckLicense(userName, apiAccessKey))
								{
								}
								else
								{
									returnstring.Add("InvalidLicense");

								}



								returnValue = "YES";

								returnToken = tokenString;
							}
							else
							{
								returnValue = "NO";
							}
						}
					}
					else
					{
						returnValue = "NO";
					}
				}

				returnstring.Add(returnValue);
				returnstring.Add(returnToken);
			}
			catch(Exception ex)
			{
				LogWsData("Exception ValidateLogin: " + ex);
			}

			#endregion ValidateLogin


			return returnstring;
		}

		//public void LogWsData(string value)
		//{
		//	if(!String.IsNullOrEmpty(value))
		//	{
		//		//string filepath = WebConfigurationManager.AppSettings["LogFilePath"];
		//		//string fileName = DateTime.Now.Year + DateTime.Now.Month.ToString() + DateTime.Now.Day;
		//		//fileName = filepath + fileName + ".txt";
		//		//StreamWriter objwriter = new StreamWriter(fileName, true);
		//		//objwriter.Write(Environment.NewLine + "[" + DateTime.Now + "] : " + value);
		//		//objwriter.Close();
		//	}
		//}


		public void LogWsData(string value)
		{
			try
			{
				string servicesPath = System.AppDomain.CurrentDomain.BaseDirectory;
				if(!String.IsNullOrEmpty(value))
				{
					servicesPath += "/LoginErrorLog";
					if(!Directory.Exists(servicesPath))
					{
						Directory.CreateDirectory(servicesPath);
					}
					string filepath = servicesPath + "/";
					string fileName = DateTime.Now.Year + DateTime.Now.Month.ToString() + DateTime.Now.Day;
					fileName = filepath + fileName + ".txt";
					StreamWriter objwriter = new StreamWriter(fileName, true);
					objwriter.Write(Environment.NewLine + "[" + DateTime.Now + "] : " + value);
					objwriter.Close();
				}
			}
			catch(Exception)
			{
			}
		}

		[HttpPost]
		public IHttpActionResult GetDataFromUserDetailProfile(string userName, string apiAccessKey)
		{
			var objLoginDto = new LoginDTO();
			var userProfileDto = new ProfileDTO();
			try
			{
				LogWsData("userName :" + userName);
				if(AccesKey == apiAccessKey)
				{
					objLoginDto.UserName = userName.Replace("'", "''").Trim();
					LoginDTO loggedinUsertDto;
					using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
					{
						loggedinUsertDto = client.Instance.ValidateUser(objLoginDto);
					}
					//if (loggedinUsertDto.LoginList.Count == 0)
					//{
					using(var client = ServiceClient<IUserProfileManager>.Create(ObjectConstants.UserProfileManager))
					{
						var objuserProfileDto = new ProfileDTO
						{
							EmailId = userName.Replace("'", "''").Trim(),
							ContactNumber = userName.Replace("'", "''").Trim(),
							UserName = userName.Replace("'", "''").Trim()
						};
						userProfileDto = client.Instance.ValidateUserProfile(objuserProfileDto);
					}
					//}
					if(userProfileDto.ProfileList.Count > 0)
					{
						using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
						{
							Guid g;
							g = Guid.NewGuid();
							var objLoginDtos = new LoginDTO
							{
								ProfileId = userProfileDto.ProfileList[0].ProfileId,
								GUID = Convert.ToString(g),
								UserName = userName.Replace("'", "''").Trim()
							};
							client.Instance.UpdateLoginByGUID(objLoginDtos);
						}
						EmailNotificationDTO emailNotificationDto = new EmailNotificationDTO();
						using(var client = ServiceClient<IEmailNotificationManager>.Create(ObjectConstants.EmailNotificationManager))
						{
							emailNotificationDto.ObjectId = Convert.ToInt64(userProfileDto.ProfileList[0].ProfileId);
							emailNotificationDto.SenderEmailAddress = userProfileDto.ProfileList[0].EmailId;
							emailNotificationDto.IsActive = true;
							emailNotificationDto.IsSent = false;
							emailNotificationDto.EventType = "PasswordRecover";
							emailNotificationDto.CreatedBy = Convert.ToInt64(userProfileDto.ProfileList[0].ProfileId);
							emailNotificationDto.CreatedDate = DateTime.Now;
							client.Instance.Save(emailNotificationDto);
						}
					}
				}
			}
			catch(Exception ex)
			{
				LogWsData("Exception ForgotPassword: " + ex);
			}
			return Ok(userProfileDto.ProfileList);
		}



        [HttpPost]
        [AllowAnonymous]
        public List<string> ValidateLogin_V2(string userName, string userPassword, string apiAccessKey)
        {
            List<string> returnstring = new List<string>();




            #region ValidateLogin
            string path = System.AppDomain.CurrentDomain.BaseDirectory + "/" + ConfigurationManager.AppSettings["rsaPrivateKeyFilePath"].ToString();
            sec.createParam(path);

            //loggedinUsertDTO.UserName = inputUserName.Text;
            string password = sec.GetDecryptedPassword(userPassword, this.GetChallenge());

            userPassword = password;

            string returnValue = "";

            string returnToken = "";


            string objUserInfoInString = "";

            try
            {



                Logger.WriteToFileThreadSafe("userName :" + userName + "userPassword : " + userPassword, "LoginLog");

                var objLoginDto = new LoginDTO { UserName = userName };
                if (AccesKey == apiAccessKey)
                {
                    LoginDTO loggedinUsertDto;
                    using (var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
                    {
                        loggedinUsertDto = client.Instance.ValidateUser(objLoginDto);
                    }
                    if (loggedinUsertDto.LoginList.Count > 0)
                    {
                        for (int i = 0; i < loggedinUsertDto.LoginList.Count; i++)
                        {
                            string hashPassword = Password.HashPassword(userPassword, Convert.ToInt32(loggedinUsertDto.LoginList[i].PasswordSalt));
                            if (loggedinUsertDto.LoginList[i].HashedPassword == hashPassword)
                            {
                                Logger.WriteToFileThreadSafe("userName :" + userName + "Passowrd correct", "LoginLog");
                                var loginDto = loggedinUsertDto.LoginList[0];

                                var tokenHandler = new JwtSecurityTokenHandler();
                                var key = Encoding.ASCII.GetBytes("GQDstcKsx0NHjPOuXOYg5MbeJ1XT0uFiwDVvVBrk");
                                var tokenDescriptor = new SecurityTokenDescriptor
                                {
                                    Subject = new ClaimsIdentity(new Claim[]
                                    {
                                        new Claim(ClaimTypes.Name, loginDto.LoginId.ToString())
                                    }),
                                    Expires = DateTime.UtcNow.AddDays(7),
                                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                                };
                                var token = tokenHandler.CreateToken(tokenDescriptor);
                                var tokenString = tokenHandler.WriteToken(token);
                                //var profileDto = loggedinUsertDto.LoginList[0].ProfileList[0];
                                var objUserInfo = new UserInfo
                                {
                                    ProfileId = loginDto.ProfileId,
                                    UserName = loginDto.UserName,
                                    Name = loginDto.Name,
                                    LoginId = loginDto.LoginId,
                                    RoleMasterId = loginDto.RoleMasterId,
                                    RoleName = loginDto.RoleName,
                                    PageUrl = loginDto.PageUrl,
                                    PageName = loginDto.PageName,
                                    UserTypeCode = loginDto.UserTypeCode,
                                    ActivationCode = loginDto.ActivationCode,
                                    ReferenceId = loginDto.ReferenceId,
                                    ReferenceType = loginDto.ReferenceType,
                                    CompanyMnemonic = loginDto.CompanyMnemonic,
                                    CompanyZone = loginDto.CompanyZone,
                                    ParentCompanyId = loginDto.ParentCompanyId,
                                    SelfCollectValue = loginDto.SelfCollectValue,
                                    ChangePasswordonFirstLoginRequired = loginDto.ChangePasswordonFirstLoginRequired,
                                    CompanyType = loginDto.CompanyType,
                                    Token = tokenString,
                                    UserProfilePicture = loginDto.UserProfilePicture,
                                    DefaultLanguage = loginDto.DefaultLanguage,
                                    StockLocationCode = loginDto.StockLocationCode,
                                    PasswordWarningDays = loginDto.PasswordWarningDays,
                                    NumberOfDaysRemainingForChangePassword = loginDto.NumberOfDaysRemainingForChangePassword,
                                    ExpityDate = Convert.ToDateTime(loginDto.ExpiryDate),
                                    //CreditLimit= loginDto.CreditLimit,
                                    //AvailableCreditLimit = loginDto.AvailableCreditLimit
                                };

                                Logger.WriteToFileThreadSafe("objUserInfo  LoginId:" + objUserInfo.LoginId, "LoginLog");


                                LoginHistoryDTO loginHistoryDto = new LoginHistoryDTO();
                                using (var client = ServiceClient<ILoginHistoryManager>.Create(ObjectConstants.LoginHistoryManager))
                                {
                                    loginHistoryDto.LoginId = objUserInfo.LoginId;
                                    loginHistoryDto.LoggingInTime = DateTime.Now;
                                    loginHistoryDto.IsActive = true;
                                    loginHistoryDto.CreatedBy = objUserInfo.LoginId;
                                    loginHistoryDto.Token = tokenString;
                                    objUserInfo.LoginHistoryId = client.Instance.Save(loginHistoryDto);
                                }

                                HttpContext.Current.Session["UserInfo"] = objUserInfo;


                                objUserInfoInString = JsonConvert.SerializeObject(objUserInfo);


                                if (CheckLicense(userName, apiAccessKey))
                                {
                                }
                                else
                                {
                                    returnstring.Add("InvalidLicense");

                                }



                                returnValue = "YES";

                                returnToken = tokenString;
                            }
                            else
                            {
                                returnValue = "NO";
                            }
                        }
                    }
                    else
                    {
                        returnValue = "NO";
                    }
                }

                returnstring.Add(returnValue);
                returnstring.Add(returnToken);
                returnstring.Add(objUserInfoInString);
            }
            catch (Exception ex)
            {
                Logger.WriteToFileThreadSafe("Exception ValidateLogin: " + ex.StackTrace, "LoginLog");


            }



            #endregion ValidateLogin

            return returnstring;
        }




        [HttpPost]
		public string ResetPassword(string guid, string userPassword, string userIpAddress, string oneTimePassword, string passwordReceivedVia, string apiAccessKey)
		{
			LogWsData("GUID :" + guid);

			//var loginHistoryDto = new PasswordHistoryDTO();
			var loginDto = new LoginDTO();
			var userProfileDto = new ProfileDTO();
			long retVal = 0;
			try
			{
				int salt = Password.CreateRandomSalt();
				string haspassword = Password.HashPassword(userPassword, salt);

				if(AccesKey == apiAccessKey)
				{
					LogWsData("GUID :" + guid);
					if(AccesKey == apiAccessKey)
					{
						using(var client = ServiceClient<IUserProfileManager>.Create(ObjectConstants.UserProfileManager))
						{
							var objuserProfileDto = new ProfileDTO { GUID = guid };
							userProfileDto = client.Instance.GetUserProfileById(objuserProfileDto);
						}
						using(var client = ServiceClient<IPasswordHistoryManager>.Create(ObjectConstants.PasswordHistoryManager))
						{
							var objLoginHistoryDto = new PasswordHistoryDTO
							{
								GUID = guid,
								ProfileId = Convert.ToInt64(userProfileDto.ProfileList[0].ProfileId),
								PasswordSalt = salt,
								HashedPassword = haspassword,
								PasswordReceivedVia = passwordReceivedVia,
								OneTimePassword = oneTimePassword,
								CreatedFromIPAddress = userIpAddress,
								IsActive = true,
								CreatedBy = Convert.ToInt64(userProfileDto.ProfileList[0].ProfileId),
								CreatedDate = DateTime.Now,
							};
							retVal = client.Instance.Save(objLoginHistoryDto);
						}

						if(retVal != 0)
						{
							using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
							{
								var objloginDto = new LoginDTO
								{
									GUID = guid,
								};
								loginDto = client.Instance.GetLoginByUserProfileId(objloginDto);
							}
							using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
							{
								loginDto.LoginList[0].PasswordSalt = salt;
								loginDto.LoginList[0].HashedPassword = haspassword;
								loginDto.LoginList[0].CreatedFromIPAddress = userIpAddress;
								loginDto.LoginList[0].UpdatedBy = Convert.ToInt64(loginDto.ProfileId);
								loginDto.LoginList[0].UpdatedDate = DateTime.Now;

								retVal = client.Instance.UpdateLoginPassword(loginDto.LoginList[0]);
							}
						}
					}
				}
			}
			catch(Exception ex)
			{
				LogWsData("Exception CheckQuestionsAnswer: " + ex);
			}

			return retVal.ToString();
		}

		[HttpPost]
		public IHttpActionResult CheckPasswordHistory(string ResetPasswordCode, string apiAccessKey)
		{
			int count = 0;
			int retVal = 0;

			var securityQuestionData = new PasswordHistoryDTO();
			var userProfileDto = new ProfileDTO();
			LogWsData("ResetPasswordCode :" + ResetPasswordCode);
			var objsecurityQuestionDto = new PasswordHistoryDTO();
			try
			{
				if(AccesKey == apiAccessKey)
				{
					using(var client = ServiceClient<IPasswordHistoryManager>.Create(ObjectConstants.PasswordHistoryManager))
					{
						objsecurityQuestionDto.ResetPasswordCode = ResetPasswordCode;
						securityQuestionData = client.Instance.GetPasswordResetCode(ResetPasswordCode);
					}
				}
			}
			catch(Exception ex)
			{
				LogWsData("Exception CheckQuestionsAnswer: " + ex);
			}
			return Ok(securityQuestionData.PasswordHistoryList);
		}

		public long ResetPasswordBySelf(string currentPassword, string userPassword, string userIpAddress, string apiAccessKey, string userId, bool ChangePasswordonFirstLoginRequired)
		{
			//var loginHistoryDto = new PasswordHistoryDTO();
			var loginDto = new LoginDTO();
			//var loginDto1 = new LoginDTO();
			long retVal = 0;
			try
			{
				int currentPasswordsalt = Password.CreateRandomSalt();

				int salt = Password.CreateRandomSalt();
				string haspassword = Password.HashPassword(userPassword, salt);
				byte[] toEncodeAsBytes = System.Text.ASCIIEncoding.ASCII.GetBytes(userPassword);
				string returnValue = System.Convert.ToBase64String(toEncodeAsBytes);

				if(AccesKey == apiAccessKey)
				{
					using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
					{
						var objloginDto1 = new LoginDTO
						{
							LoginId = Convert.ToInt64(userId)
						};
						loginDto = client.Instance.GetLoginUserProfileByUserLoginId(objloginDto1);
					}
					string currentPasswordHaspassword = Password.HashPassword(currentPassword, int.Parse(Convert.ToString(loginDto.LoginList[0].PasswordSalt)));
					if(currentPasswordHaspassword == loginDto.LoginList[0].HashedPassword)
					{
						bool IsAllowSameaslastpassword = false;
						PasswordPolicyDTO passwordPolicyDto = new PasswordPolicyDTO();

						using(var client = ServiceClient<IPasswordPolicyManager>.Create(ObjectConstants.PasswordPolicyManager))
						{
							var objPasswordPolicyDto = new PasswordPolicyDTO
							{
								RoleMasterId = Convert.ToInt64(loginDto.LoginList[0].RoleMasterId)
							};
							passwordPolicyDto.PasswordPolicyList = client.Instance.GetPasswordPolicyByRoleMasterId(objPasswordPolicyDto).PasswordPolicyList;
							if(passwordPolicyDto.PasswordPolicyList.Count > 0)
							{
								IsAllowSameaslastpassword = passwordPolicyDto.PasswordPolicyList.FirstOrDefault().NewPasswordShouldNotMatchNoOfLastPassword ?? false;
							}

						}


						if(IsAllowSameaslastpassword)
						{
							if(currentPassword != userPassword)
							{
								bool ststus=GetpasswordPolicybyRoleMasterid(Convert.ToString(loginDto.LoginList[0].RoleMasterId),userPassword) ;
								if(ststus)
								{


									using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
									{
										var objloginDto = new LoginDTO
										{
											ProfileId = Convert.ToInt64(userId),
										};
										loginDto = client.Instance.GetLoginByUserProfileId(objloginDto);
									}
									using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
									{
										loginDto.LoginList[0].PasswordSalt = salt;
										loginDto.LoginList[0].HashedPassword = haspassword;
										loginDto.LoginList[0].IPAddress = userIpAddress;
										loginDto.LoginList[0].ChangePasswordonFirstLoginRequired = ChangePasswordonFirstLoginRequired;

										//loginDto.LoginList[0].Base64Password = returnValue;
										loginDto.LoginList[0].UpdatedBy = Convert.ToInt64(userId);
										loginDto.LoginList[0].UpdatedDate = DateTime.Now;

										retVal = client.Instance.UpdateLoginPassword(loginDto.LoginList[0]);
									}
								}
								else
								{
									return retVal = 3;
								}
							}
							else
							{
								return retVal = 2;
							}

						}
						else
						{
							using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
							{
								var objloginDto = new LoginDTO
								{
									ProfileId = Convert.ToInt64(userId),
								};
								loginDto = client.Instance.GetLoginByUserProfileId(objloginDto);
							}
							using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
							{
								loginDto.LoginList[0].PasswordSalt = salt;
								loginDto.LoginList[0].HashedPassword = haspassword;
								loginDto.LoginList[0].IPAddress = userIpAddress;
								loginDto.LoginList[0].ChangePasswordonFirstLoginRequired = ChangePasswordonFirstLoginRequired;

								loginDto.LoginList[0].UpdatedBy = Convert.ToInt64(userId);
								loginDto.LoginList[0].UpdatedDate = DateTime.Now;

								retVal = client.Instance.UpdateLoginPassword(loginDto.LoginList[0]);
							}
						}
					}
					else
					{
						return retVal = 2;
					}

					if(haspassword != loginDto.LoginList[0].HashedPassword)
					{
						//using (var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
						//{
						//    var objloginDto = new LoginDTO
						//    {
						//        ProfileId = Convert.ToInt64(userId),
						//    };
						//    loginDto = client.Instance.GetLoginByUserProfileId(objloginDto);
						//}
						using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
						{
							loginDto.LoginList[0].PasswordSalt = salt;
							loginDto.LoginList[0].HashedPassword = haspassword;
							loginDto.LoginList[0].IPAddress = userIpAddress;
							loginDto.LoginList[0].ChangePasswordonFirstLoginRequired = ChangePasswordonFirstLoginRequired;
							//loginDto.LoginList[0].Base64Password = returnValue;
							loginDto.LoginList[0].UpdatedBy = Convert.ToInt64(userId);
							loginDto.LoginList[0].UpdatedDate = DateTime.Now;

							retVal = client.Instance.UpdateLoginPassword(loginDto.LoginList[0]);
						}
					}
				}
			}
			catch(Exception ex)
			{
				LogWsData("Exception CheckQuestionsAnswer: " + ex);
			}
			return retVal;
		}

		protected string GetChallenge()
		{
			//string challenge = Request.Params["challenge"];
			string challenge = "";
			return sec.GetChallenge(challenge);
		}


		public bool GetpasswordPolicybyRoleMasterid(string RoleMasterid, string Password)
		{
			bool Ismatched = false;

			PasswordPolicyDTO passwordPolicyDto = new PasswordPolicyDTO();
			using(var client = ServiceClient<IPasswordPolicyManager>.Create(ObjectConstants.PasswordPolicyManager))
			{
				var objPasswordPolicyDto = new PasswordPolicyDTO
				{
					RoleMasterId = Convert.ToInt64(RoleMasterid)
				};
				passwordPolicyDto.PasswordPolicyList = client.Instance.GetPasswordPolicyByRoleMasterId(objPasswordPolicyDto).PasswordPolicyList;
				if(passwordPolicyDto.PasswordPolicyList.Count > 0)
				{
					// "^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$"

					// "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]{2,})[A-Za-z\d@$!%*?&]{8,}$"
					var Passpolicy = passwordPolicyDto.PasswordPolicyList[0];

					bool IsLowerCaseAllowed = Passpolicy.IsLowerCaseAllowed ?? false;
					bool IsNumberAllowed = Passpolicy.IsNumberAllowed ?? false;
					bool IsSpecialCharacterAllowed = Passpolicy.IsSpecialCharacterAllowed ?? false;
					bool IsUpperCaseAllowed = Passpolicy.IsUpperCaseAllowed ?? false;
					string pattern = "^";
					string pattern12 = "[";
					if(IsUpperCaseAllowed)
					{
						pattern = pattern + "(?=(.*[A-Z]){" + Passpolicy.MinimumUppercaseCharactersRequired + ",})";
						pattern12 = pattern12 + "A-Z";
					}
					if(IsLowerCaseAllowed)
					{
						pattern = pattern + "(?=(.*[a-z]){" + Passpolicy.MinimumLowercaseCharactersRequired + ",})";
						pattern12 = pattern12 + "a-z";
					}
					if(IsNumberAllowed)
					{
						pattern = pattern + @"(?=(.*[\d]){" + Passpolicy.MinimumNumericsRequired + ",})";
						pattern12 = pattern12 + @"\d";
					}
					if(IsSpecialCharacterAllowed)
					{
						string SpecialChar = "@$!%*?&:;.#+-";
						if(Passpolicy.SpecialCharactersToBeExcluded != null)
						{
							var splitChar = (Passpolicy.SpecialCharactersToBeExcluded).Split(',');
							foreach(var item in splitChar)
							{
								SpecialChar = SpecialChar.Replace(item, "");
							}

						}
						pattern = pattern + @"(?=(.*[" + SpecialChar + "]){" + Passpolicy.MinimumSpecialCharactersRequired + ",})" + @"(?!.*\s)";
						pattern12 = pattern12 + SpecialChar;
					}
					pattern12 = pattern12 + "]";
					pattern = pattern + pattern12 + "{" + Passpolicy.MinimumPasswordLength + "," + Passpolicy.MaximumPasswordLength + "}$";

					if(!string.IsNullOrEmpty(Password))
					{
						if(!Regex.IsMatch(Password, pattern))
						{
							Ismatched = false;
						}
						else
						{
							Ismatched = true;
						}

					}


				}
				else
				{
					Ismatched = true;

				}
			}

			return Ismatched;
		}

		#region License

		protected bool CheckLicense(string userName, string apiAccessKey)
		{
			bool IsValid = false;
			try
			{
				var objLoginDto = new LoginDTO { UserName = userName };
				if(AccesKey == apiAccessKey)
				{
					LogWsData("AccesKey: " + AccesKey);
					LoginDTO loggedinUsertDto;
					using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
					{
						loggedinUsertDto = client.Instance.ValidateUser(objLoginDto);
					}
					if(loggedinUsertDto.LoginList.Count > 0)
					{
						LogWsData("loggedinUsertDtoCount: " + loggedinUsertDto.LoginList.Count);
						var loginDto = loggedinUsertDto.LoginList[0];
						IsValid = ValidateLicense(loginDto);
					}
				}
				return IsValid;
			}
			catch(Exception ex)
			{
				LogWsData("Exception CheckLicense: " + ex);
			}
			return IsValid;
		}

		protected bool ValidateLicense(LoginDTO loginDto)
		{
			bool IsValid = false;
			try
			{
				
				JObject jsonObj = new JObject();

				var newObj = new JObject
				{
					["Json"] = jsonObj,
				};
				string newJsonString = Convert.ToString(newObj);
				LogWsData("newJsonString: " + newJsonString);
				string servicesAction = "GetLicenseInfoList";
				string servicesURL = ServiceConfigurationDataAccessManager.GetServicesConfiguartionURL(servicesAction);
				LogWsData("servicesURL: " + servicesURL);
				// Convert json string to custom .Net object
				JObject jObjectServicesConfiguartionURL = (JObject)JsonConvert.DeserializeObject(servicesURL);
				string customApi = jObjectServicesConfiguartionURL["Json"]["ServicesURL"].ToString();
				LogWsData("customApi: " + customApi);
				GRClientRequest myRequest = new GRClientRequest(customApi, "POST", newJsonString);
				LogWsData("myRequest: " + myRequest);
				string outputResponse = myRequest.GetResponse();
				LogWsData("outputResponse: " + outputResponse);
				if(!string.IsNullOrEmpty(outputResponse))
				{
					
					JObject obj = new JObject();
					JObject obj1 = new JObject();

					obj = (JObject)JsonConvert.DeserializeObject(outputResponse);

					// Create a dynamic output object
					dynamic output = new ExpandoObject();

					output.LicenseInfoList = obj["LicenseInfo"]["LicenseInfoList"];
					output.UserTypeCode = loginDto.UserTypeCode;
					output.UserName = loginDto.UserName;
					output.ActivationCode = loginDto.ActivationCode;

					dynamic orderJson = new ExpandoObject();
					orderJson.Json = output;

					// Serialize the dynamic output object to a string
					string outputJson = JsonConvert.SerializeObject(orderJson);

					// Convert json object to JOSN string format
					string jsonData = JsonConvert.SerializeObject(obj1);

					string servicesAction1 = "ValidateLicense";
					string servicesURL1 = ServiceConfigurationDataAccessManager.GetServicesConfiguartionURL(servicesAction1);

					// Convert json string to custom .Net object
					JObject jObjectServicesConfiguartionURL1 = (JObject)JsonConvert.DeserializeObject(servicesURL1);
					string customApi1 = jObjectServicesConfiguartionURL1["Json"]["ServicesURL"].ToString();

					GRClientRequest myRequest1 = new GRClientRequest(customApi1, "POST", outputJson);

					string outputResponse1 = myRequest1.GetResponse();

					if(!string.IsNullOrEmpty(outputResponse1))
					{
						JObject objoutputResponse = new JObject();

						objoutputResponse = (JObject)JsonConvert.DeserializeObject(outputResponse1);
						IsValid = Convert.ToBoolean(objoutputResponse["Json"]["IsLicenseValid"]);
					}
				}
			}
			catch(Exception ex)
			{

				LogWsData("ValidateLicense: " + ex);
				LogWsData("ValidateLicenseMessage: " + ex.Message);
				LogWsData("ValidateLicenseInnerException: " + ex.InnerException);
			}
			
			return IsValid;
		}

		#endregion License

		#region login as
		[HttpPost]
		public List<string> ValidateLoginforloginas(string userName, string apiAccessKey)
		{
			List<string> returnstring = new List<string>();


			#region ValidateLoginAs

			//string path = System.AppDomain.CurrentDomain.BaseDirectory + "/" + ConfigurationManager.AppSettings["rsaPrivateKeyFilePath"].ToString();
			//sec.createParam(path);

			string returnValue = "";

			string returnToken = "";

			try
			{
				LogWsData("userName :" + userName);
				var objLoginDto = new LoginDTO { UserName = userName };
				if(AccesKey == apiAccessKey)
				{
					LoginDTO loggedinUsertDto;
					using(var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
					{
						loggedinUsertDto = client.Instance.ValidateUser(objLoginDto);
					}
					if(loggedinUsertDto.LoginList.Count > 0)
					{
						for(int i = 0; i < loggedinUsertDto.LoginList.Count; i++)
						{
							//if (loggedinUsertDto.LoginList[i].HashedPassword == hashPassword)
							//{
							var loginDto = loggedinUsertDto.LoginList[0];

							string token = Convert.ToString(Guid.NewGuid());
							//var profileDto = loggedinUsertDto.LoginList[0].ProfileList[0];
							var objUserInfo = new UserInfo
							{
								ProfileId = loginDto.ProfileId,
								UserName = loginDto.UserName,
								Name = loginDto.Name,
								LoginId = loginDto.LoginId,
								RoleMasterId = loginDto.RoleMasterId,
								RoleName = loginDto.RoleName,
								PageUrl = loginDto.PageUrl,
								PageName = loginDto.PageName,
								UserTypeCode = loginDto.UserTypeCode,
								ActivationCode = loginDto.ActivationCode,
								ReferenceId = loginDto.ReferenceId,
								ReferenceType = loginDto.ReferenceType,
								CompanyMnemonic = loginDto.CompanyMnemonic,
								SelfCollectValue = loginDto.SelfCollectValue,
								ChangePasswordonFirstLoginRequired = loginDto.ChangePasswordonFirstLoginRequired,
								CompanyType = loginDto.CompanyType,
								Token = token,
								UserProfilePicture = loginDto.UserProfilePicture,
                                //CreditLimit= loginDto.CreditLimit,
                                //AvailableCreditLimit = loginDto.AvailableCreditLimit
                            };

							LoginHistoryDTO loginHistoryDto = new LoginHistoryDTO();
							using(var client = ServiceClient<ILoginHistoryManager>.Create(ObjectConstants.LoginHistoryManager))
							{
								loginHistoryDto.LoginId = objUserInfo.LoginId;
								loginHistoryDto.LoggingInTime = DateTime.Now;
								loginHistoryDto.IsActive = true;
								loginHistoryDto.CreatedBy = objUserInfo.LoginId;
								loginHistoryDto.Token = token;
								objUserInfo.LoginHistoryId = client.Instance.Save(loginHistoryDto);
							}

							HttpContext.Current.Session["UserInfo"] = objUserInfo;

							returnValue = "YES";

							returnToken = token;
							//}
							//else
							//{
							//    returnValue = "NO";
							//}
						}
					}
					else
					{
						returnValue = "NO";
					}
				}

				returnstring.Add(returnValue);
				returnstring.Add(returnToken);
			}
			catch(Exception ex)
			{
				LogWsData("Exception ValidateLoginAs: " + ex);
			}

			#endregion ValidateLoginAs

			return returnstring;
		}

		//[HttpPost]
		//public IHttpActionResult GetAllUserProfileLoginAsData()
		//{
		//    List<string> returnstring = new List<string>();
		//    using (var client = ServiceClient<ILoginManager>.Create(ObjectConstants.LoginManager))
		//    {
		//        loggedinUsertDto = client.Instance.ValidateUser();
		//    }

		//    //ReturnData<ObjectDTO> returnData = new ReturnData<ObjectDTO>();
		//    //returnData.data = dsObject.Tables[0].DataTableToList<ObjectDTO>();;
		//    //returnData.totalRecords = dsObject.Tables[1].Rows[0][0].ToString();

		//    return Ok(objectList);
		//}
		#endregion
	}
}