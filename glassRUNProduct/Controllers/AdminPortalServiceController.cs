using Blankchq.Framework;
using Blankchq.Framework.PasswordUtility;
using Blankchq.Framework.Service.Helper;
using Login.DTO;
using Login.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using System.Web.Http.Cors;

namespace PortOptimization.WebAPI.Controllers
{
    [EnableCors("*", "*", "PUT,POST")]
    public class AdminPortalServiceController : ApiController
    {
        //#region RoleMaster


        //public string SaveRoleMaster(RoleMasterClass RoleMasterClass)
        //{
        //    string strMsg = "";
        //    long returnValue = 0;
        //    using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
        //    {
        //        var objRoleMasterDto = new RoleMasterDTO
        //        {
        //            RoleName = RoleMasterClass.RoleName,
        //            IsActive = true,
        //            IPAddress = RoleMasterClass.CreatedFromIPAddress,
        //            CreatedBy = 4,
        //            CreatedDate = DateTime.Now,
        //        };
        //        returnValue = client.Instance.Save(objRoleMasterDto);
        //    }
        //    if (returnValue != 0)
        //    {
        //        strMsg = "Record inserted";
        //    }
        //    else
        //    {
        //        strMsg = "Record not inserted";
        //    }

        //    return strMsg;
        //}

    
        //public ResponseData<RoleMasterDTO> LoadRoleMaster(string pageIndex, string pageSize, string where, string orderBy)
        //{

        //    ResponseData<RoleMasterDTO> roleMasterList;
        //    DataSet roleMasterDataSet;
        //    using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
        //    {
        //        roleMasterDataSet = client.Instance.GetAllRoleMaster(Convert.ToInt32(pageIndex), Convert.ToInt32(pageSize), where, orderBy);
        //    }


        //    ResponseData<RoleMasterDTO> responseData = new ResponseData<RoleMasterDTO>();

        //    responseData.Data = ConvertDataTableToList.DataTableToList<RoleMasterDTO>(roleMasterDataSet.Tables[0]);
        //    responseData.Total = Convert.ToString(roleMasterDataSet.Tables[1].Rows[0]["TotalRowCount"]);


        //    return responseData;
        //}

  
        //public int DeleteRole(string roleMasterId)
        //{
        //    int returnValue = 0;
        //    using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
        //    {
        //        returnValue = client.Instance.SoftDelete(Convert.ToInt64(roleMasterId));
        //    }
        //    return returnValue;
        //}


        //public Login.DTO.RoleMasterDTO GetRoleByRoleMasterId(string roleMasterId)
        //{
        //    RoleMasterDTO roleMasterdto = new RoleMasterDTO();
        //    using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
        //    {
        //        var objRoleMasterDto = new RoleMasterDTO
        //        {
        //            RoleMasterId = Convert.ToInt64(roleMasterId)
        //        };
        //        roleMasterdto.RoleMasterList = client.Instance.GetRoleMasterById(objRoleMasterDto).RoleMasterList;
        //    }
        //    return roleMasterdto;
        //}


        //public string UpdateRoleMaster(RoleMasterDTO RoleMasterClass)
        //{
        //    string strMsg = "";
        //    long returnValue = 0;
        //    using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
        //    {
        //        var objRoleMasterDto = new RoleMasterDTO
        //        {
        //            RoleName = RoleMasterClass.RoleName,
        //            RoleMasterId = RoleMasterClass.RoleMasterId,
        //            IsActive = true,
        //            UpdatedFromIPAddress = RoleMasterClass.UpdatedFromIPAddress,
        //            UpdatedBy = 4,

        //        };
        //        returnValue = client.Instance.Update(objRoleMasterDto);
        //    }
        //    if (returnValue != 0)
        //    {
        //        strMsg = "Record Updated";
        //    }
        //    else
        //    {
        //        strMsg = "Record not Updated";
        //    }

        //    return strMsg;
        //}

        //#endregion

        //#region SecurityQuestion
   
        //public List<Login.DTO.RoleMasterDTO> GetRoleMaster()
        //{
        //    RoleMasterDTO roleMasterDto = new RoleMasterDTO();
        //    List<RoleMasterDTO> roleMasterList;
        //    //DataSet roleMasterDataSet;
        //    using (var client = ServiceClient<IRoleMasterManager>.Create(ObjectConstants.RoleMasterManager))
        //    {
        //        roleMasterList = client.Instance.GetRoleMaster(roleMasterDto);
        //    }


        //    return roleMasterList;
        //}

      
        //public string SaveSecurityQuestion(SecurityQuestionDTO QuestionData)
        //{
        //    string strMsg = "";
        //    long returnValue = 0;
        //    using (var client = ServiceClient<ISecurityQuestionManager>.Create(ObjectConstants.SecurityQuestionManager))
        //    {
        //        var objRoleMasterDto = new SecurityQuestionDTO
        //        {
        //            Question = QuestionData.Question,
        //            IsUpperCaseAllowed = QuestionData.IsUpperCaseAllowed,
        //            IsLowerCaseAllowed = QuestionData.IsLowerCaseAllowed,
        //            IsNumberAllowed = QuestionData.IsNumberAllowed,
        //            IsSpecialCharacterAllowed = QuestionData.IsSpecialCharacterAllowed,
        //            SpecialCharactersToBeExcluded = QuestionData.SpecialCharactersToBeExcluded,
        //            MinimumLowercaseCharactersRequired = QuestionData.MinimumLowercaseCharactersRequired,
        //            MinimumNumericsRequired = QuestionData.MinimumNumericsRequired,
        //            MinimumSpecialCharactersRequired = QuestionData.MinimumSpecialCharactersRequired,
        //            MinimumUppercaseCharactersRequired = QuestionData.MinimumSpecialCharactersRequired,
        //            IsActive = true,
        //            CreatedFromIPAddress = QuestionData.CreatedFromIPAddress,
        //            CreatedBy = QuestionData.ProfileId,
        //            CreatedDate = DateTime.Now,
        //        };
        //        returnValue = client.Instance.Save(objRoleMasterDto);


        //    }
        //    using (var client = ServiceClient<IRoleSecurityQuestionMappingManager>.Create(ObjectConstants.RoleSecurityQuestionMappingManager))
        //    {
        //        var roleSecurityQuestionMappingDto = new RoleSecurityQuestionMappingDTO
        //        {
        //            SecurityQuestionId = returnValue,
        //            RoleMasterId = QuestionData.RoleMasterId,
        //            IsActive = true,
        //            CreatedFromIPAddress = QuestionData.CreatedFromIPAddress,
        //            CreatedBy = 4,
        //            CreatedDate = DateTime.Now,
        //        };
        //        returnValue = client.Instance.Save(roleSecurityQuestionMappingDto);
        //    }
        //    if (returnValue != 0)
        //    {
        //        strMsg = "Record inserted";
        //    }
        //    else
        //    {
        //        strMsg = "Record not inserted";
        //    }

        //    return strMsg;
        //}

       
        //public ResponseData<SecurityQuestionDTO> LoadSecurityQuestion(string pageIndex, string pageSize, string where, string orderBy)
        //{

        //    ResponseData<SecurityQuestionDTO> roleMasterList;
        //    DataSet securityQuestionDtoDataSet;
        //    using (var client = ServiceClient<ISecurityQuestionManager>.Create(ObjectConstants.SecurityQuestionManager))
        //    {
        //        securityQuestionDtoDataSet = client.Instance.GetAllSecurityQuestion(Convert.ToInt32(pageIndex), Convert.ToInt32(pageSize), where, orderBy);
        //    }


        //    ResponseData<SecurityQuestionDTO> responseData = new ResponseData<SecurityQuestionDTO>();

        //    responseData.Data = ConvertDataTableToList.DataTableToList<SecurityQuestionDTO>(securityQuestionDtoDataSet.Tables[0]);
        //    responseData.Total = Convert.ToString(securityQuestionDtoDataSet.Tables[1].Rows[0]["TotalRowCount"]);


        //    return responseData;
        //}

    
        //public int DeleteSecurityQuestion(string securityQuestionId, string userRoleSecurityQuestionId)
        //{
        //    int returnValue = 0;
        //    using (var client = ServiceClient<ISecurityQuestionManager>.Create(ObjectConstants.SecurityQuestionManager))
        //    {
        //        returnValue = client.Instance.SoftDelete(Convert.ToInt64(securityQuestionId), Convert.ToInt64(userRoleSecurityQuestionId));
        //    }
        //    return returnValue;
        //}

   
        //public SecurityQuestionDTO GetSecurityQuestionBySecurityQuestionId(string securityQuestionId)
        //{
        //    SecurityQuestionDTO securityQuestionDto = new SecurityQuestionDTO();
        //    using (var client = ServiceClient<ISecurityQuestionManager>.Create(ObjectConstants.SecurityQuestionManager))
        //    {
        //        var objsecurityQuestionDto = new SecurityQuestionDTO
        //        {
        //            SecurityQuestionId = Convert.ToInt64(securityQuestionId)
        //        };
        //        securityQuestionDto.SecurityQuestionList = client.Instance.GetSecurityQuestionById(objsecurityQuestionDto).SecurityQuestionList;
        //    }
        //    return securityQuestionDto;
        //}

  
        //public string UpdateSecurityQuestion(SecurityQuestionDTO QuestionData)
        //{
        //    string strMsg = "";
        //    long returnValue = 0;
        //    using (var client = ServiceClient<ISecurityQuestionManager>.Create(ObjectConstants.SecurityQuestionManager))
        //    {
        //        var objsecurityQuestionDto = new SecurityQuestionDTO
        //        {
        //            Question = QuestionData.Question,
        //            SecurityQuestionId = QuestionData.SecurityQuestionId,
        //            IsUpperCaseAllowed = QuestionData.IsUpperCaseAllowed,
        //            IsLowerCaseAllowed = QuestionData.IsLowerCaseAllowed,
        //            IsNumberAllowed = QuestionData.IsNumberAllowed,
        //            IsSpecialCharacterAllowed = QuestionData.IsSpecialCharacterAllowed,
        //            SpecialCharactersToBeExcluded = QuestionData.SpecialCharactersToBeExcluded,
        //            MinimumLowercaseCharactersRequired = QuestionData.MinimumLowercaseCharactersRequired,
        //            MinimumNumericsRequired = QuestionData.MinimumNumericsRequired,
        //            MinimumSpecialCharactersRequired = QuestionData.MinimumSpecialCharactersRequired,
        //            MinimumUppercaseCharactersRequired = QuestionData.MinimumSpecialCharactersRequired,
        //            IsActive = true,
        //            UpdatedFromIPAddress = QuestionData.UpdatedFromIPAddress,
        //            UpdatedBy = 4,

        //        };
        //        returnValue = client.Instance.Update(objsecurityQuestionDto);
        //    }
        //    if (returnValue != 0)
        //    {
        //        strMsg = "Record Updated";
        //    }
        //    else
        //    {
        //        strMsg = "Record not Updated";
        //    }

        //    return strMsg;
        //}
        //#endregion

        //#region PasswordRecoveryFlowSettings
     
        //public string SavePasswordRecoveryFlowSettings(PasswordRecoveryFlowManagmentDTO PasswordRecoveryFlowManagment)
        //{
        //    string strMsg = "";
        //    long returnValue = 0;
        //    using (var client = ServiceClient<IPasswordRecoveryFlowManagmentManager>.Create(ObjectConstants.PasswordRecoveryFlowManagmentManager))
        //    {
        //        var passwordRecoveryFlowManagmentDto = new PasswordRecoveryFlowManagmentDTO
        //        {
        //            //PasswordRecoveryFlowManagmentId = PasswordRecoveryFlowManagment.PasswordRecoveryFlowManagmentId,
        //            IsOtpRequired = PasswordRecoveryFlowManagment.IsOtpRequired,
        //            IsSecurityQuestionMandatory = PasswordRecoveryFlowManagment.IsSecurityQuestionMandatory,
        //            RecoveryThroughPrimaryEmail = PasswordRecoveryFlowManagment.RecoveryThroughPrimaryEmail,
        //            RecoveryThroughAlternateEmail = PasswordRecoveryFlowManagment.RecoveryThroughAlternateEmail,
        //            RecoveryThroughRegisteredMobile = PasswordRecoveryFlowManagment.RecoveryThroughRegisteredMobile,
        //            RecoveryThroughSecurityQuestion = PasswordRecoveryFlowManagment.RecoveryThroughSecurityQuestion,
        //            CanAdminResetPassword = PasswordRecoveryFlowManagment.CanAdminResetPassword,
        //            IsActive = true,
        //            CreatedFromIPAddress = PasswordRecoveryFlowManagment.CreatedFromIPAddress,
        //            CreatedBy = 4,
        //        };
        //        returnValue = client.Instance.Save(passwordRecoveryFlowManagmentDto);
        //    }
        //    if (returnValue != 0)
        //    {
        //        strMsg = "Record inserted";
        //    }
        //    else
        //    {
        //        strMsg = "Record not inserted";
        //    }

        //    return strMsg;
        //}

    
        //public string UpdatePasswordRecoveryFlowSetting(PasswordRecoveryFlowManagmentDTO PasswordRecoveryFlowManagment)
        //{
        //    string strMsg = "";
        //    long returnValue = 0;
        //    using (var client = ServiceClient<IPasswordRecoveryFlowManagmentManager>.Create(ObjectConstants.PasswordRecoveryFlowManagmentManager))
        //    {
        //        var passwordRecoveryFlowManagmentDto = new PasswordRecoveryFlowManagmentDTO
        //        {
        //            PasswordRecoveryFlowManagmentId = PasswordRecoveryFlowManagment.PasswordRecoveryFlowManagmentId,
        //            IsOtpRequired = PasswordRecoveryFlowManagment.IsOtpRequired,
        //            IsSecurityQuestionMandatory = PasswordRecoveryFlowManagment.IsSecurityQuestionMandatory,
        //            RecoveryThroughPrimaryEmail = PasswordRecoveryFlowManagment.RecoveryThroughPrimaryEmail,
        //            RecoveryThroughAlternateEmail = PasswordRecoveryFlowManagment.RecoveryThroughAlternateEmail,
        //            RecoveryThroughRegisteredMobile = PasswordRecoveryFlowManagment.RecoveryThroughRegisteredMobile,
        //            RecoveryThroughSecurityQuestion = PasswordRecoveryFlowManagment.RecoveryThroughSecurityQuestion,
        //            CanAdminResetPassword = PasswordRecoveryFlowManagment.CanAdminResetPassword,
        //            IsActive = true,
        //            UpdatedFromIPAddress = PasswordRecoveryFlowManagment.UpdatedFromIPAddress,
        //            UpdatedBy = 4,

        //        };
        //        returnValue = client.Instance.Update(passwordRecoveryFlowManagmentDto);
        //    }
        //    if (returnValue != 0)
        //    {
        //        strMsg = "Record Updated";
        //    }
        //    else
        //    {
        //        strMsg = "Record not Updated";
        //    }

        //    return strMsg;
        //}

    
        //public List<PasswordRecoveryFlowManagmentDTO> LoadPasswordFlow()
        //{

        //    PasswordRecoveryFlowManagmentDTO passwordRecoveryFlowManagmentDto = new PasswordRecoveryFlowManagmentDTO();

        //    using (var client = ServiceClient<IPasswordRecoveryFlowManagmentManager>.Create(ObjectConstants.PasswordRecoveryFlowManagmentManager))
        //    {
        //        passwordRecoveryFlowManagmentDto = client.Instance.GetPasswordRecoveryFlowManagment(passwordRecoveryFlowManagmentDto);
        //    }

        //    return passwordRecoveryFlowManagmentDto.PasswordRecoveryFlowManagmentList;
        //}
        //#endregion

        //#region PasswordPolicy

        //public string SavePolicy(PasswordPolicyDTO PasswordPolicyClass)
        //{
        //    string strMsg = "";
        //    long returnValue = 0;
        //    using (var client = ServiceClient<IPasswordPolicyManager>.Create(ObjectConstants.PasswordPolicyManager))
        //    {
        //        var objPasswordPolicyDto = new PasswordPolicyDTO
        //        {
        //            PasswordPolicyName = PasswordPolicyClass.PasswordPolicyName,
        //            //PasswordPolicyId = PasswordPolicyClass.PasswordPolicyId,
        //            IsUpperCaseAllowed = PasswordPolicyClass.IsUpperCaseAllowed,
        //            IsLowerCaseAllowed = PasswordPolicyClass.IsLowerCaseAllowed,
        //            IsNumberAllowed = PasswordPolicyClass.IsNumberAllowed,
        //            IsSpecialCharacterAllowed = PasswordPolicyClass.IsSpecialCharacterAllowed,
        //            SpecialCharactersToBeExcluded = PasswordPolicyClass.SpecialCharactersToBeExcluded,
        //            MinimumUppercaseCharactersRequired = PasswordPolicyClass.MinimumUppercaseCharactersRequired,
        //            MinimumLowercaseCharactersRequired = PasswordPolicyClass.MinimumLowercaseCharactersRequired,
        //            MinimumSpecialCharactersRequired = PasswordPolicyClass.MinimumSpecialCharactersRequired,
        //            PasswordExpiryPeriod = PasswordPolicyClass.PasswordExpiryPeriod,
        //            NewPasswordShouldNotMatchNoOfLastPassword = PasswordPolicyClass.NewPasswordShouldNotMatchNoOfLastPassword,
        //            MinimumPasswordLength = PasswordPolicyClass.MinimumPasswordLength,
        //            MaximumPasswordLength = PasswordPolicyClass.MaximumPasswordLength,
        //            CanPasswordBeSameAsUserName = PasswordPolicyClass.CanPasswordBeSameAsUserName,
        //            NumberOfSecurityQuestionsForRecovery = PasswordPolicyClass.NumberOfSecurityQuestionsForRecovery,
        //            NumberOfSecurityQuestionsForRegistration = PasswordPolicyClass.NumberOfSecurityQuestionsForRecovery,
        //            OneTimePasswordExpireTime = PasswordPolicyClass.OneTimePasswordExpireTime,
        //            IsActive = true,
        //            CreatedFromIPAddress = PasswordPolicyClass.CreatedFromIPAddress,
        //            CreatedBy = 4,
        //            CreatedDate = DateTime.Now,
        //        };
        //        returnValue = client.Instance.Save(objPasswordPolicyDto);
        //    }

        //    if (returnValue != 0)
        //    {
        //        using (var client = ServiceClient<IRolePasswordPolicyMappingManager>.Create(ObjectConstants.RolePasswordPolicyMappingManager))
        //        {
        //            var objRolePasswordPolicyMappingDto = new RolePasswordPolicyMappingDTO
        //            {
        //                PasswordPolicyId = returnValue,
        //                RoleMasterId = PasswordPolicyClass.RoleMasterId,
        //                IsActive = true,
        //                CreatedFromIPAddress = PasswordPolicyClass.CreatedFromIPAddress,
        //                CreatedBy = 4,
        //                CreatedDate = DateTime.Now,
        //            };
        //            returnValue = client.Instance.Save(objRolePasswordPolicyMappingDto);
        //        }
        //        strMsg = returnValue != 0 ? "Record inserted" : "Record not inserted";
        //    }
        //    else
        //    {
        //        strMsg = "Record not inserted";
        //    }

        //    return strMsg;
        //}


        //public ResponseData<PasswordPolicyDTO> LoadPolicy(string pageIndex, string pageSize, string where, string orderBy)
        //{

        //    ResponseData<PasswordPolicyDTO> roleMasterList;
        //    DataSet roleMasterDataSet;
        //    using (var client = ServiceClient<IPasswordPolicyManager>.Create(ObjectConstants.PasswordPolicyManager))
        //    {
        //        roleMasterDataSet = client.Instance.GetAllPasswordPolicy(Convert.ToInt32(pageIndex), Convert.ToInt32(pageSize), where, orderBy);
        //    }


        //    ResponseData<PasswordPolicyDTO> responseData = new ResponseData<PasswordPolicyDTO>();

        //    responseData.Data = ConvertDataTableToList.DataTableToList<PasswordPolicyDTO>(roleMasterDataSet.Tables[0]);
        //    responseData.Total = Convert.ToString(roleMasterDataSet.Tables[1].Rows[0]["TotalRowCount"]);


        //    return responseData;
        //}

   
        //public int DeletePolicy(string passwordPolicyId, string rolePasswordPolicyMappingId)
        //{
        //    int returnValue = 0;
        //    using (var client = ServiceClient<IPasswordPolicyManager>.Create(ObjectConstants.PasswordPolicyManager))
        //    {
        //        returnValue = client.Instance.SoftDelete(Convert.ToInt64(passwordPolicyId), Convert.ToInt64(rolePasswordPolicyMappingId));
        //    }
        //    return returnValue;
        //}

    
        //public PasswordPolicyDTO GetPolicyByPasswordPolicyId(string passwordPolicyId)
        //{
        //    PasswordPolicyDTO passwordPolicyDto = new PasswordPolicyDTO();
        //    using (var client = ServiceClient<IPasswordPolicyManager>.Create(ObjectConstants.PasswordPolicyManager))
        //    {
        //        var objPasswordPolicyDto = new PasswordPolicyDTO
        //        {
        //            PasswordPolicyId = Convert.ToInt64(passwordPolicyId)
        //        };
        //        passwordPolicyDto.PasswordPolicyList = client.Instance.GetPasswordPolicyById(objPasswordPolicyDto).PasswordPolicyList;
        //    }
        //    return passwordPolicyDto;
        //}

    
        //public string UpdatePolicy(PasswordPolicyDTO PasswordPolicyClass)
        //{
        //    string strMsg = "";
        //    long returnValue = 0;
        //    using (var client = ServiceClient<IPasswordPolicyManager>.Create(ObjectConstants.PasswordPolicyManager))
        //    {
        //        var objPasswordPolicyDto = new PasswordPolicyDTO
        //        {
        //            PasswordPolicyName = PasswordPolicyClass.PasswordPolicyName,
        //            PasswordPolicyId = PasswordPolicyClass.PasswordPolicyId,
        //            IsUpperCaseAllowed = PasswordPolicyClass.IsUpperCaseAllowed,
        //            IsLowerCaseAllowed = PasswordPolicyClass.IsLowerCaseAllowed,
        //            IsNumberAllowed = PasswordPolicyClass.IsNumberAllowed,
        //            IsSpecialCharacterAllowed = PasswordPolicyClass.IsSpecialCharacterAllowed,
        //            SpecialCharactersToBeExcluded = PasswordPolicyClass.SpecialCharactersToBeExcluded,
        //            MinimumUppercaseCharactersRequired = PasswordPolicyClass.MinimumUppercaseCharactersRequired,
        //            MinimumLowercaseCharactersRequired = PasswordPolicyClass.MinimumLowercaseCharactersRequired,
        //            MinimumSpecialCharactersRequired = PasswordPolicyClass.MinimumSpecialCharactersRequired,
        //            PasswordExpiryPeriod = PasswordPolicyClass.PasswordExpiryPeriod,
        //            NewPasswordShouldNotMatchNoOfLastPassword = PasswordPolicyClass.NewPasswordShouldNotMatchNoOfLastPassword,
        //            MinimumPasswordLength = PasswordPolicyClass.MinimumPasswordLength,
        //            MaximumPasswordLength = PasswordPolicyClass.MaximumPasswordLength,
        //            CanPasswordBeSameAsUserName = PasswordPolicyClass.CanPasswordBeSameAsUserName,
        //            NumberOfSecurityQuestionsForRecovery = PasswordPolicyClass.NumberOfSecurityQuestionsForRecovery,
        //            NumberOfSecurityQuestionsForRegistration = PasswordPolicyClass.NumberOfSecurityQuestionsForRecovery,
        //            OneTimePasswordExpireTime = PasswordPolicyClass.OneTimePasswordExpireTime,
        //            IsActive = true,
        //            CreatedFromIPAddress = PasswordPolicyClass.CreatedFromIPAddress,
        //            UpdatedBy = 4,
        //            UpdatedDate = DateTime.Now,

        //        };
        //        returnValue = client.Instance.Update(objPasswordPolicyDto);
        //    }
        //    strMsg = returnValue != 0 ? "Record Updated" : "Record not Updated";

        //    return strMsg;
        //}
        //#endregion

        //#region userRegistration
    
        //public string SaveUserProfile(ProfileDTO UserMasterData, List<SecurityQuestionDTO> securityQuestionDto, string password)
        //{
        //    string strMsg = "";
        //    long returnValue = 0;
        //    ProfileDTO loggedinUsertDto;

        //    int salt = Password.CreateRandomSalt();
        //    string haspassword = Password.HashPassword(password, salt);
        //    using (var client = ServiceClient<IUserProfileManager>.Create(ObjectConstants.UserProfileManager))
        //    {
        //        var objUserProfileDto = new ProfileDTO
        //        {

        //            Name = UserMasterData.Name,
        //            RoleMasterId = UserMasterData.RoleMasterId,
        //            //MiddleName = UserMasterData.MiddleName,
        //            //LastName = UserMasterData.LastName,
        //            EmailId = UserMasterData.EmailId,
        //            //AlternetEmail = UserMasterData.AlternetEmail,
        //            ContactNumber = UserMasterData.ContactNumber,
        //            UserName = UserMasterData.UserName,
        //            PasswordSalt = salt,
        //            HashedPassword = haspassword,
        //            ChangePasswordonFirstLoginRequired = UserMasterData.ChangePasswordonFirstLoginRequired,
        //            //UserProfileId = UserMasterData.UserProfileId,
        //            IsActive = true,
        //            CreatedFromIPAddress = UserMasterData.CreatedFromIPAddress,
        //            CreatedBy = UserMasterData.ProfileId,
        //            CreatedDate = DateTime.Now,
        //        };
        //        loggedinUsertDto = client.Instance.ValidateUserProfileAndLogin("UserName='" + objUserProfileDto.UserName + "' and EmailId='" + objUserProfileDto.EmailId + "' And ContactNumber='" + objUserProfileDto.ContactNumber + "'");
        //        if (loggedinUsertDto.ProfileId == 0)
        //        {
        //            returnValue = client.Instance.Save(objUserProfileDto);
        //        }
        //        else
        //        {
        //            return strMsg = "User already registed";
        //        }
        //    }

        //    List<UserSecurityQuestionDTO> userSecurityQuestionDto = new List<UserSecurityQuestionDTO>();
        //    UserSecurityQuestionDTO userQuestionDto = new UserSecurityQuestionDTO();

        //    for (int i = 0; i < securityQuestionDto.Count; i++)
        //    {
        //        UserSecurityQuestionDTO objQuestionDto = new UserSecurityQuestionDTO();
        //        objQuestionDto.SecurityQuestionId = securityQuestionDto[i].SecurityQuestionId;
        //        objQuestionDto.ProfileId = returnValue;
        //        objQuestionDto.Answer = securityQuestionDto[i].Answer;
        //        objQuestionDto.IsActive = true;
        //        objQuestionDto.CreatedFromIPAddress = UserMasterData.CreatedFromIPAddress;
        //        objQuestionDto.CreatedBy = 4;
        //        objQuestionDto.CreatedDate = DateTime.Now;
        //        userSecurityQuestionDto.Add(objQuestionDto);
        //    }
        //    using (var client = ServiceClient<IUserSecurityQuestionManager>.Create(ObjectConstants.UserSecurityQuestionManager))
        //    {
        //        userQuestionDto.UserSecurityQuestionList = userSecurityQuestionDto;
        //        returnValue = client.Instance.Save(userQuestionDto);
        //    }
        //    strMsg = returnValue != 0 ? "Record inserted" : "Record not inserted";

        //    return strMsg;
        //}

   
        //public ResponseData<ProfileDTO> LoadUser(string pageIndex, string pageSize, string where, string orderBy)
        //{

        //    ResponseData<ProfileDTO> roleMasterList;
        //    DataSet userProfileDtoDataSet;
        //    using (var client = ServiceClient<IUserProfileManager>.Create(ObjectConstants.UserProfileManager))
        //    {

        //        userProfileDtoDataSet = client.Instance.GetAllUserProfile(Convert.ToInt32(pageIndex), Convert.ToInt32(pageSize), where, orderBy);
        //    }


        //    ResponseData<ProfileDTO> responseData = new ResponseData<ProfileDTO>();

        //    responseData.Data = ConvertDataTableToList.DataTableToList<ProfileDTO>(userProfileDtoDataSet.Tables[0]);
        //    responseData.Total = Convert.ToString(userProfileDtoDataSet.Tables[1].Rows[0]["TotalRowCount"]);


        //    return responseData;
        //}

    
        //public int DeleteUserProfile(string userProfileId)
        //{
        //    int returnValue = 0;
        //    using (var client = ServiceClient<IUserProfileManager>.Create(ObjectConstants.UserProfileManager))
        //    {
        //        returnValue = client.Instance.SoftDelete(Convert.ToInt64(userProfileId));
        //    }
        //    return returnValue;
        //}


        //public ProfileDTO GetUserByUserProfileId(string userProfileId)
        //{
        //    ProfileDTO userProfileDto = new ProfileDTO();
        //    using (var client = ServiceClient<IUserProfileManager>.Create(ObjectConstants.UserProfileManager))
        //    {
        //        var objUserProfileDto = new ProfileDTO
        //        {
        //            ProfileId = Convert.ToInt64(userProfileId)
        //        };
        //        userProfileDto.ProfileList = client.Instance.GetUserProfileAndUserNameByUserProfileId(objUserProfileDto).ProfileList;
        //    }
        //    return userProfileDto;
        //}


        //public string UpdateUserProfile(ProfileDTO UserMasterData)
        //{
        //    string strMsg = "";
        //    long returnValue = 0;
        //    using (var client = ServiceClient<IUserProfileManager>.Create(ObjectConstants.UserProfileManager))
        //    {
        //        var objUserProfileDto = new ProfileDTO
        //        {
        //            Name = UserMasterData.Name,

        //            EmailId = UserMasterData.EmailId,
        //            ContactNumber = UserMasterData.ContactNumber,
        //            UserName = UserMasterData.UserName,
        //            ChangePasswordonFirstLoginRequired = UserMasterData.ChangePasswordonFirstLoginRequired,
        //            ProfileId = UserMasterData.ProfileId,
        //            RoleMasterId = UserMasterData.RoleMasterId,
        //            IsActive = true,
        //            IPAddress = UserMasterData.CreatedFromIPAddress,
        //            UpdatedBy = UserMasterData.ProfileId,
        //            UpdatedDate = DateTime.Now,
        //        };
        //        returnValue = client.Instance.Update(objUserProfileDto);


        //    }
        //    if (returnValue != 0)
        //    {
        //        strMsg = "Record Updated";
        //    }
        //    else
        //    {
        //        strMsg = "Record not Updated";
        //    }

        //    return strMsg;
        //}

        //public List<SecurityQuestionDTO> GetSecurityQuestionsByRole(string roleMasterId)
        //{
        //    var securityQuestionDto = new SecurityQuestionDTO();
        //    var securityQuestionData = new SecurityQuestionDTO();
        //    try
        //    {
        //        using (var client = ServiceClient<ISecurityQuestionManager>.Create(ObjectConstants.SecurityQuestionManager))
        //        {
        //            securityQuestionDto.RoleMasterId = Convert.ToInt64(roleMasterId);
        //            securityQuestionData = client.Instance.GetSecurityQuestionsByRoleMasterId(securityQuestionDto);
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //    }
        //    return securityQuestionData.SecurityQuestionList;
        //}
        //#endregion
    }

    public class RoleMasterClass
    {
        public string RoleName { get; set; }
        public string RoleMasterId { get; set; }
        public string CreatedFromIPAddress { get; set; }
        public string UpdateFromIPAddress { get; set; }
        public long CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }

    }

    public class ResponseData<T>
    {
        public List<T> Data { get; set; }

        public string Total { get; set; }


        public ResponseData()
        {

        }
    }
}
