angular.module("glassRUNProduct").controller('loginController', function ($scope, $q, $window, $ionicModal, $state, applicationService, $sessionStorage, $timeout, $location, $rootScope, adminService, GrRequestService) {

    // $window.onbeforeunload = $rootScope.LogoutUser;


    $rootScope.DaysRemainingValidation = false;
    $rootScope.bindAllBranchPlant = [];
    $rootScope.InvisibleComponentForLoginScreen = true;
    $rootScope.IsPrimaryLoginSA = false;
    $scope.DevicePrefixStore = 0;
    $sessionStorage.SessionObjects = null;
    $rootScope.IsVisiblity = true;

    $scope.Exponent = "";
    $scope.Modulus = "";
    $scope.Challenge = "";

    $rootScope.Throbber = {
        Visible: false,
    }

    $scope.Login = {
        Username: "",
        Password: ""
    }

   

    //$scope.ResetUserSessionId = function () {
    //    $.ajax({
    //        method: 'POST',
    //        async: false,
    //        url: 'http://localhost:43595/api/AllSession/FocLogout',
    //        success: function (data) {

    //        }
    //    });
    //}

    //$scope.ResetUserSessionId();

    function InitializationBeforeLogin() {

        adminService.InitializationBeforeLogin().then(function (response) {


            var myData = response.data;

            $scope.Exponent = myData.Json.Exponent;
            $scope.Modulus = myData.Json.Modulus;
            $scope.Challenge = myData.Json.Challenge;
        });
    }

    InitializationBeforeLogin();

    $scope.LoginOnEnter = function (keyEvent) {
        if (keyEvent.which === 13) {
            $scope.btnLogin();
        }
    }

    $scope.LoadImageFromServer = function () {
        $scope.LogoImage = '';
        $scope.BackgroundImage = '';
        var requestSettingData = {
            ServicesAction: 'LoadAllSettingMaster',
            CompanyId: 0
        };

        var jsonSettingobject = {};
        jsonSettingobject.Json = requestSettingData;
        GrRequestService.ProcessRequest(jsonSettingobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.bindAllSettingMaster = resoponsedata.SettingMaster.SettingMasterList;


            $sessionStorage.AllSettingMasterData = $scope.bindAllSettingMaster;
            $rootScope.AllSettingMasterData = $scope.bindAllSettingMaster;


            var logovalue = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'LogoImage'; });
            if (logovalue.length > 0) {
                $scope.LogoImage = 'data:image/png;base64,' + logovalue[0].SettingValue;

                $rootScope.LogoBaseImage = $scope.LogoImage;
            }

            var logovalue = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'BackgroundImage'; });
            if (logovalue.length > 0) {
                $scope.BackgroundImage = 'data:image/png;base64,' + logovalue[0].SettingValue;
            }
            var LoginAsroleId = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'AllowLoginAs'; });
            if (LoginAsroleId.length > 0) {
                $rootScope.LoginAsRoleId = LoginAsroleId;
            }
        });
    }

    $scope.LoadImageFromServer();

    $scope.btnLogin = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        $rootScope.IsEnquiryEditedByCustomerService = false;
        $rootScope.TemSelectedAssociatedOrder = [];
        $rootScope.EnquiryDetailId = 0;
        $rootScope.TemOrderData = [];
        $rootScope.EditEnquiry = false;
        $rootScope.CurrentOrderGuid = '';
        $rootScope.EditedEnquiryId = 0;

        //$rootScope.ObjectId = 0;
        //$rootScope.ObjectType = '';

        $rootScope.proId = {};

        $scope.Username = $scope.Username;
        $scope.Password = $scope.Password;

        if ($scope.Login.Username !== undefined && $scope.Login.Username !== "" && $scope.Login.Password !== "" && $scope.Login.Password !== undefined) {
            console.log("0");
            $scope.LoadDataFromServer($scope.Login.Username, $scope.Login.Password);
        } else {
            $rootScope.Throbber.Visible = false;
            $scope.OpenConfirmationPopup('Validation', 'Please enter valid username & password.', 'OK');
        }
    }
    //Changed by nimesh for password policy on 24-10-2019
    $scope.LoadDataFromServer = function (userName, password) {

        $rootScope.logInAsflag = false;
        setMaxDigits(131);
        var key = new RSAKeyPair($scope.Exponent, "", $scope.Modulus);
        var encryptedPassword = encryptedString(key, $scope.Challenge + "\\" + base64encode(password));

        var jsonobject = {};
        jsonobject.userName = userName;
        jsonobject.userPassword = encryptedPassword;
        jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';
        jsonobject.loginAsId = '';
        delete $rootScope.CurrentPageName;
        $rootScope.LoginAsCheckProfileId = '';
        $scope.loading = true;
        $scope.AlertMessage = "";
        //  DefaultLanguage
        adminService.ValidateLoginService(jsonobject).then(function (response) {

            try {

                debugger;
                console.log("1");
                var myData = response.data;
                if (myData[0] === "YES") {
                    $sessionStorage.Token = myData[1];
                    var sessionObjects = getSessionobjects($sessionStorage);
                    $scope.sessionObjects = sessionObjects;
                    console.log("2");
                    if (sessionObjects.ExpityDate !== '1900-01-01T00:00:00' && sessionObjects.ExpityDate !== '0001-01-01T00:00:00') {
                        if (sessionObjects.NumberOfDaysRemainingForChangePassword <= 0) {
                            if (sessionObjects.UserProfilePicture === undefined || sessionObjects.UserProfilePicture === null) {
                                $sessionStorage.userProfilePhoto = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHQAdAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgYBBQcEA//EADsQAAIBAwEFAwcJCQAAAAAAAAABAgMEEQUGEiExUUGBoRUiYXKRweETFDI1UnOxstEjJCUzNEJidPD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO4gAAAAB5ri/tbZ4rVop/ZTy/YajV9WjPeo2zbS4Oalhd2OZo2wLT5dsuK3p98Xg8k9o0m922bXY3P4FfZFsC02OvUK81CtF0ZN4TbzF95tznzNtYa9UtbZUalJ1d1+bJzxw6cgLWDXaZq9DUG4RjKFRLLjLp6GbEAAAAAAAAAavaCvOjZKMHj5SW636DaGk2oeKFD13+AFeZFhsi2Blsi2GyLYBsi2GyIHv0SqqWqUJOagm93jyeeGP+9BeDnC+ksdTo6AAAAAAAAAGl2oj+6UZdKmPB/obor+0l7SlF2ai3UjJScuyPD4gV/JhsMi2AbIthsiwBhsNkWyj6UFvXFKPWcV4nRjnFvVVC5pVpR3lTnGbj1w8l+0+8pX1rG4o5UZZTT5prsIPSAAAAAAAAUrWc+VLnPPf9xdSvbR6ZVqVPndvBzysVIxWXw5MCutkWyVSM6cnGpGUJLmpLDR8wDMNhsi2UGyLYbItgGy47H58lzzy+WePYiq2tjdXkoxt6E5qTwpY83vfIvumWcbCypW0XncXGXV9rIPUAAAAAAAAAAKrtXauFzTuYrzai3Zesvh+BoWzoF/aQvbWdCpykuD6PsZQrqjO1uKlCrjfg8PAHybIthsi2UGzCy2lFNt8FgwywbKaZ8vV+fVuNOnLEI9Zde4CyaTafMtPo0H9KMfO9Z8WewAgAAAAAAB8q9zQt1mvWp0/WkkB9Qae42jsaWVTc6z/wAI4XtZq7nai4nwt6FOmusnvMC2FC19/wAZuvWX5UfO51S+uf5t1Ua+zF7q9iPE2AbIsMw2UGy6bH/VD+9l7ilNinWqUZb9GpOnLrCTTCOpA5/bbSanb4TrRqx6VY58VxNta7ZU3hXdrKPWVOWfBkVagay117TLnChd04yf9tTzH4myjJSSlFpp8mgMgADWa9fysbPNJpVaj3YN9nVlLqTlUm5zk5SfNyeWzf7YT/b20OxRk/FfoV1gGRbMtkGyg2RBhgGYYZFsINkGw2YbANkQYYBmy0HV6umXdPM27aUkqkOzHVelGrbIvkB17PQHm0yo62m2lWT4zowk++KBFV3a/wDraH3XvZoGABFkWAUYZFgBEWRYAEWRYAGGYZgARZFgAdT0P6msf9eH5UZAIr//2Q=="
                            }
                            else {
                                $sessionStorage.userProfilePhoto = sessionObjects.UserProfilePicture;
                            }
                            $rootScope.userProfilePhoto = $sessionStorage.userProfilePhoto

                            var roleName = sessionObjects.RoleName;

                            if ($rootScope.DefaultLanguage !== undefined && $rootScope.DefaultLanguage !== 0) {
                                $rootScope.CultureId = $rootScope.DefaultLanguage;
                            }
                            else {
                                $rootScope.CultureId = '1101'
                            }


                            var ResourcesData = {
                                ServicesAction: "GetAllResourcesList",
                                CultureId: 0,

                            };
                            var consolidateApiParamater = {
                                Json: ResourcesData,
                            };


                            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (objectResourcesResponse) {
                                debugger;

                                $sessionStorage.CultureId = $rootScope.CultureId;

                                var ResourcesResoponseData = objectResourcesResponse.data.Resources.ResourcesList;
                                $sessionStorage.ResourcesData = ResourcesResoponseData;

                                var resourcesList = ResourcesResoponseData.filter(function (el) {
                                    return el.CultureId === $rootScope.CultureId;
                                });

                                $scope.resData = {};
                                for (var j = 0, len = resourcesList.length; j < len; ++j) {
                                    var controlName = resourcesList[j].ResourceKey;
                                    $scope.resData[controlName] = '';
                                    $scope.resData[controlName] = resourcesList[j].ResourceValue;
                                }
                                $rootScope.resData = $scope.resData;
                                $sessionStorage.resData = $scope.resData;
                                var requestLookupData = {
                                    ServicesAction: 'LoadAllLookUpMaster',
                                    CompanyId: 0
                                };


                                var jsonLookupobject = {};
                                jsonLookupobject.Json = requestLookupData;
                                GrRequestService.ProcessRequest(jsonLookupobject).then(function (response) {
                                    debugger;
                                    var resoponsedata = response.data;
                                    if (resoponsedata.Json !== undefined) {
                                        $scope.LookUpListData = resoponsedata.Json.LookUpList;
                                    } else {
                                        $scope.LookUpListData = [];
                                    }

                                    $sessionStorage.AllLookUpData = $scope.LookUpListData;
                                    $rootScope.AllLookUpData = $scope.LookUpListData;
                                    $scope.OpenPasswordPolicyForcefullyChangeConfirmationPopup();
                                    $rootScope.Throbber.Visible = false;

                                });
                            });

                        }
                        else if (sessionObjects.PasswordWarningDays >= sessionObjects.NumberOfDaysRemainingForChangePassword) {
                            $scope.PasswordpolicyWarningMessage = "Your password will expire in the next " + sessionObjects.NumberOfDaysRemainingForChangePassword + " days. Do you want to change it now ?";
                            $scope.OpenPasswordPolicyChangeConfirmationPopup();
                        }
                        else {
                            debugger;
                            $rootScope.TempEnquiryDetailId = 0;
                            $rootScope.EnquiryDetailId = 0;
                            $rootScope.RoleId = sessionObjects.RoleMasterId;
                            $rootScope.UserId = sessionObjects.LoginId;
                            $rootScope.CompanyId = sessionObjects.ReferenceId;
                            $rootScope.ActiveUserName = sessionObjects.Name;
                            $rootScope.RoleName = sessionObjects.RoleName;
                            $rootScope.CompanyMnemonic = sessionObjects.CompanyMnemonic;
                            $rootScope.CompanyType = sessionObjects.CompanyType;

                            $rootScope.ParentCompanyId = sessionObjects.ParentCompanyId;
                            $rootScope.SelfCollectValue = sessionObjects.SelfCollectValue;
                            $rootScope.IsFirstLogin = sessionObjects.ChangePasswordonFirstLoginRequired;
                            $rootScope.Token = sessionObjects.Token;
                            $rootScope.DefaultLanguage = sessionObjects.DefaultLanguage;
                            $rootScope.StockLocationCode = sessionObjects.StockLocationCode;

                            $rootScope.EnquiryCompanyType = sessionObjects.CompanyType;
                            $sessionStorage.EnquiryCompanyType = sessionObjects.CompanyType;

                            $rootScope.CompanyZone = sessionObjects.CompanyZone;
                            $sessionStorage.CompanyZone = sessionObjects.CompanyZone;


                            $rootScope.LoginUserName = userName;
                            $sessionStorage.LoginUserName = userName;

                            if (sessionObjects.UserProfilePicture === undefined || sessionObjects.UserProfilePicture === null) {
                                $sessionStorage.userProfilePhoto = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHQAdAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgYBBQcEA//EADsQAAIBAwEFAwcJCQAAAAAAAAABAgMEEQUGEiExUUGBoRUiYXKRweETFDI1UnOxstEjJCUzNEJidPD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO4gAAAAB5ri/tbZ4rVop/ZTy/YajV9WjPeo2zbS4Oalhd2OZo2wLT5dsuK3p98Xg8k9o0m922bXY3P4FfZFsC02OvUK81CtF0ZN4TbzF95tznzNtYa9UtbZUalJ1d1+bJzxw6cgLWDXaZq9DUG4RjKFRLLjLp6GbEAAAAAAAAAavaCvOjZKMHj5SW636DaGk2oeKFD13+AFeZFhsi2Blsi2GyLYBsi2GyIHv0SqqWqUJOagm93jyeeGP+9BeDnC+ksdTo6AAAAAAAAAGl2oj+6UZdKmPB/obor+0l7SlF2ai3UjJScuyPD4gV/JhsMi2AbIthsiwBhsNkWyj6UFvXFKPWcV4nRjnFvVVC5pVpR3lTnGbj1w8l+0+8pX1rG4o5UZZTT5prsIPSAAAAAAAAUrWc+VLnPPf9xdSvbR6ZVqVPndvBzysVIxWXw5MCutkWyVSM6cnGpGUJLmpLDR8wDMNhsi2UGyLYbItgGy47H58lzzy+WePYiq2tjdXkoxt6E5qTwpY83vfIvumWcbCypW0XncXGXV9rIPUAAAAAAAAAAKrtXauFzTuYrzai3Zesvh+BoWzoF/aQvbWdCpykuD6PsZQrqjO1uKlCrjfg8PAHybIthsi2UGzCy2lFNt8FgwywbKaZ8vV+fVuNOnLEI9Zde4CyaTafMtPo0H9KMfO9Z8WewAgAAAAAAB8q9zQt1mvWp0/WkkB9Qae42jsaWVTc6z/wAI4XtZq7nai4nwt6FOmusnvMC2FC19/wAZuvWX5UfO51S+uf5t1Ua+zF7q9iPE2AbIsMw2UGy6bH/VD+9l7ilNinWqUZb9GpOnLrCTTCOpA5/bbSanb4TrRqx6VY58VxNta7ZU3hXdrKPWVOWfBkVagay117TLnChd04yf9tTzH4myjJSSlFpp8mgMgADWa9fysbPNJpVaj3YN9nVlLqTlUm5zk5SfNyeWzf7YT/b20OxRk/FfoV1gGRbMtkGyg2RBhgGYYZFsINkGw2YbANkQYYBmy0HV6umXdPM27aUkqkOzHVelGrbIvkB17PQHm0yo62m2lWT4zowk++KBFV3a/wDraH3XvZoGABFkWAUYZFgBEWRYAEWRYAGGYZgARZFgAdT0P6msf9eH5UZAIr//2Q=="
                            }
                            else {
                                $sessionStorage.userProfilePhoto = sessionObjects.UserProfilePicture;
                            }
                            $rootScope.userProfilePhoto = $sessionStorage.userProfilePhoto

                            var roleName = sessionObjects.RoleName;

                            if ($rootScope.DefaultLanguage !== undefined && $rootScope.DefaultLanguage !== 0) {
                                $rootScope.CultureId = $rootScope.DefaultLanguage;
                            }
                            else {
                                $rootScope.CultureId = '1101'
                            }

                            debugger;
                            // TODO: Added for Buyer and Seller Mode in Portal (14 July 2020) (Chetan Tambe) -- Start
                            $rootScope.UserPersonaMasterId = sessionObjects.UserPersonaMasterId;
                            $sessionStorage.UserPersonaMasterId = sessionObjects.UserPersonaMasterId;

                            $rootScope.UserPersonaJson = {
                                SelectedUserPersonaMasterId: sessionObjects.UserPersonaMasterId
                            };

                            $rootScope.UserPersona = sessionObjects.UserPersona;
                            $sessionStorage.UserPersona = sessionObjects.UserPersona;
                            // TODO: Added for Buyer and Seller Mode in Portal (14 July 2020) (Chetan Tambe) -- End

                            var menuRequestData = {
                                ServicesAction: 'LoadMenuList',
                                RoleMasterId: $rootScope.RoleId,
                                CultureId: $rootScope.CultureId,
                                UserId: $rootScope.UserId
                            };

                            var menuConsolidateApiParamater = {
                                Json: menuRequestData,
                            };

                            var loadResponseMenuList = GrRequestService.ProcessRequest(menuConsolidateApiParamater);



                            var requestLookupData = {
                                ServicesAction: 'LoadAllLookUpMaster',
                                CompanyId: 0
                            };

                            var jsonLookupobject = {};
                            jsonLookupobject.Json = requestLookupData;
                            var lookUpResponseList = GrRequestService.ProcessRequest(jsonLookupobject);


                            var ResourcesData = {
                                ServicesAction: "GetAllResourcesList",
                                CultureId: $rootScope.CultureId,
                            };
                            var consolidateApiParamater = {
                                Json: ResourcesData,
                            };

                            var resourceResponseResourcesList = GrRequestService.ProcessRequest(consolidateApiParamater);

                            $sessionStorage.BindAllBranchPlant = [];
                            $rootScope.StatusResourcesList = [];
                            $sessionStorage.StatusResourcesList = [];

                            var StatusResourcesData = {
                                ServicesAction: "GetAllResourceForStatus",
                                CultureId: $rootScope.CultureId,
                                CompanyId: 0,
                                RoleId: $rootScope.RoleId
                            };
                            var consolidateApiParamaterforstatus = {
                                Json: StatusResourcesData,
                            };

                            var resourceResourceForStatusList = GrRequestService.ProcessRequest(consolidateApiParamaterforstatus);

                            $q.all([
                                loadResponseMenuList,
                                lookUpResponseList,
                                resourceResponseResourcesList,
                                resourceResourceForStatusList
                            ]).then(function (resp) {
                                debugger;
                                var response = resp[0];
                                var responselookupinfo = resp[1];
                                var objectResourcesResponse = resp[2];
                                var objectResourcesStatusResponse = resp[3];




                                debugger;
                                if (response.data !== null && response.data !== undefined) {
                                    if (response.data.Json != null && response.data.Json != undefined) {
                                        var resoponsedata = response.data;
                                        $rootScope.MenuList = resoponsedata.Json.PagesList;

                                        // TODO: 14 July 2020
                                        angular.forEach($rootScope.MenuList, function (item) {
                                            item.UserPersonaMasterId = parseInt(item.UserPersonaMasterId);
                                        });

                                        $sessionStorage.MenuList = $rootScope.MenuList;
                                    } else {
                                        $rootScope.MenuList = [];
                                        $sessionStorage.MenuList = [];
                                    }
                                } else {
                                    $rootScope.MenuList = [];
                                    $sessionStorage.MenuList = [];
                                }



                                $sessionStorage.CultureId = $rootScope.CultureId;

                                var ResourcesResoponseData = objectResourcesResponse.data.Resources.ResourcesList;
                                $sessionStorage.ResourcesData = ResourcesResoponseData;

                                var resourcesList = ResourcesResoponseData.filter(function (el) {
                                    return el.CultureId === $rootScope.CultureId;
                                });

                                $scope.resData = {};
                                for (var j = 0, len = resourcesList.length; j < len; ++j) {
                                    var controlName = resourcesList[j].ResourceKey;
                                    $scope.resData[controlName] = '';
                                    $scope.resData[controlName] = resourcesList[j].ResourceValue;
                                }
                                $rootScope.resData = $scope.resData;
                                $sessionStorage.resData = $scope.resData;

                                //------



                                if (objectResourcesStatusResponse.data != undefined) {
                                    if (objectResourcesStatusResponse.data.Json != undefined) {
                                        $rootScope.StatusResourcesList = objectResourcesStatusResponse.data.Json.StatusResourcesList;
                                        $sessionStorage.StatusResourcesList = $rootScope.StatusResourcesList;
                                    } else {
                                        $rootScope.StatusResourcesList = [];
                                        $sessionStorage.StatusResourcesList = [];
                                    }
                                } else {
                                    $rootScope.StatusResourcesList = [];
                                    $sessionStorage.StatusResourcesList = [];
                                }


                                var resoponsedata = responselookupinfo.data;
                                if (resoponsedata.Json !== undefined) {
                                    $scope.LookUpListData = resoponsedata.Json.LookUpList;
                                } else {
                                    $scope.LookUpListData = [];
                                }

                                $sessionStorage.AllLookUpData = $scope.LookUpListData;
                                $rootScope.AllLookUpData = $scope.LookUpListData;

                                $scope.NotificationListData = [];
                                $sessionStorage.AllNotificationListData = $scope.NotificationListData;
                                $rootScope.AllNotificationListData = $scope.NotificationListData;

                                $sessionStorage.ParentCompanyId = $rootScope.ParentCompanyId;

                                $rootScope.LoadEventNotificationList($rootScope.UserId);

                                $rootScope.TemOrderData = [];

                                if ($rootScope.IsFirstLogin == true) {
                                    $rootScope.bindDeliverylocation = [];

                                    $rootScope.Throbber.Visible = false;

                                    $rootScope.PageName = sessionObjects.PageName;
                                    sessionStorage.PageName = sessionObjects.PageName;

                                    $rootScope.RedirectPageFromMenu(sessionObjects.PageUrl, sessionObjects.PageName, sessionObjects.PageName);

                                    $rootScope.InvisibleMenuForFirstLoginScreen = false;

                                } else {

                                    $rootScope.InvisibleMenuForFirstLoginScreen = true;
                                    $rootScope.Throbber.Visible = false;
                                    $state.go('ChangePassword');

                                }
                                $rootScope.InvisibleComponentForLoginScreen = false;
                            });

                            //} else {
                            //    $rootScope.InvisibleComponentForLoginScreen = false;
                            //    $state.go('ValidateLicense');
                            //    //alert("Invalid License");
                            //}
                            //});
                            //});
                        }

                    }
                    else {
                        $scope.LoadDataFromServerForPasswordPolicy($scope.sessionObjects);
                    }
                }
                else if (myData[0] === "UseAnotherTab") {
                    $rootScope.Throbber.Visible = false;
                    $scope.OpenConfirmationPopup('Warning', 'Hi ' + userName + ', It seems like there is another user already logged in to the system as "' + myData[1] + '" from this computer. Please log out "' + myData[1] + '" from glassRUN first and try logging in again.', 'Close');
                } else if (myData[0] === "UseAnotherTabSameUserName") {
                    $rootScope.Throbber.Visible = false;
                    $scope.OpenConfirmationPopup('Warning', 'Hi ' + userName + ', It seems like you already logged in to the system as "' + userName + '" from this computer. Please log out from glassRUN first from previous Tab and try logging in again.', 'Close');
                } else if (myData[0] === "InvalidLicense") {
                    $rootScope.Throbber.Visible = false;
                    $scope.OpenConfirmationPopup('Warning', 'Invalid License.', 'OK');
                } else {
                    $rootScope.Throbber.Visible = false;
                    $scope.OpenConfirmationPopup('Validation', 'Invalid user name or password.', 'OK');
                }

            } catch (e1) {
                $rootScope.Throbber.Visible = false;
                $scope.OpenConfirmationPopup('Validation', e1.Message, 'OK');
            }
        });
    }

    $scope.PopupVariables = {
        Title: '',
        Message: '',
        Okbtn: '',
        Cancelbtn: ''
    }

    $ionicModal.fromTemplateUrl('ConfirmationPopuScreen.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ConfirmationModalPopup = modal;
    });

    $scope.CloseConfirmationPopup = function () {
        debugger;
        //$rootScope.ObjectId = 0;
        //$rootScope.ObjectType = '';
        angular.element(document.querySelector("body")).removeClass("modal-open");
        $scope.ConfirmationModalPopup.hide();
    };

    $scope.ForgetPasswordClick = function () {
        //$rootScope.ObjectId = 0;
        //$rootScope.ObjectType = '';
        $state.go("AuthenticationUsers");
        //$state.go("AccordionInGrid");
    };

    $scope.OpenConfirmationPopup = function (title, erromsg, Okbtn) {
        $scope.PopupVariables.Title = title;
        $scope.PopupVariables.Message = erromsg;
        $scope.PopupVariables.Okbtn = Okbtn;
        //$rootScope.ObjectId = 0;
        //$rootScope.ObjectType = '';

        $scope.ConfirmationModalPopup.show();
    };


    $rootScope.LoginAsProfileDetails = function (userName) {

        $rootScope.logInAsflag = true;
        var jsonobject = {};
        jsonobject.userName = userName;
        jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';
        jsonobject.loginAsId = '';

        $rootScope.LoginAsCheckProfileId = '';
        $scope.loading = true;
        $scope.AlertMessage = "";

        adminService.ValidateLogInAsService(jsonobject).then(function (response) {

            try {


                console.log("1");
                var myData = response.data;
                if (myData[0] === "YES") {
                    var sessionObjects = getSessionobjects($sessionStorage);
                    console.log("2");

                    $rootScope.TempEnquiryDetailId = 0;
                    $rootScope.EnquiryDetailId = 0;
                    $rootScope.RoleId = sessionObjects.RoleMasterId;
                    $rootScope.UserId = sessionObjects.LoginId;
                    $rootScope.CompanyId = sessionObjects.ReferenceId;
                    $rootScope.ActiveUserName = sessionObjects.Name;
                    $rootScope.RoleName = sessionObjects.RoleName;
                    $rootScope.CompanyMnemonic = sessionObjects.CompanyMnemonic;
                    $rootScope.CompanyType = sessionObjects.CompanyType;

                    $rootScope.SelfCollectValue = sessionObjects.SelfCollectValue;
                    $rootScope.IsFirstLogin = sessionObjects.ChangePasswordonFirstLoginRequired;
                    $rootScope.Token = sessionObjects.Token;

                    $rootScope.EnquiryCompanyType = sessionObjects.CompanyType;
                    $sessionStorage.EnquiryCompanyType = sessionObjects.CompanyType;

                    if (sessionObjects.UserProfilePicture === undefined || sessionObjects.UserProfilePicture === null) {
                        $sessionStorage.userProfilePhoto = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHQAdAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgYBBQcEA//EADsQAAIBAwEFAwcJCQAAAAAAAAABAgMEEQUGEiExUUGBoRUiYXKRweETFDI1UnOxstEjJCUzNEJidPD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO4gAAAAB5ri/tbZ4rVop/ZTy/YajV9WjPeo2zbS4Oalhd2OZo2wLT5dsuK3p98Xg8k9o0m922bXY3P4FfZFsC02OvUK81CtF0ZN4TbzF95tznzNtYa9UtbZUalJ1d1+bJzxw6cgLWDXaZq9DUG4RjKFRLLjLp6GbEAAAAAAAAAavaCvOjZKMHj5SW636DaGk2oeKFD13+AFeZFhsi2Blsi2GyLYBsi2GyIHv0SqqWqUJOagm93jyeeGP+9BeDnC+ksdTo6AAAAAAAAAGl2oj+6UZdKmPB/obor+0l7SlF2ai3UjJScuyPD4gV/JhsMi2AbIthsiwBhsNkWyj6UFvXFKPWcV4nRjnFvVVC5pVpR3lTnGbj1w8l+0+8pX1rG4o5UZZTT5prsIPSAAAAAAAAUrWc+VLnPPf9xdSvbR6ZVqVPndvBzysVIxWXw5MCutkWyVSM6cnGpGUJLmpLDR8wDMNhsi2UGyLYbItgGy47H58lzzy+WePYiq2tjdXkoxt6E5qTwpY83vfIvumWcbCypW0XncXGXV9rIPUAAAAAAAAAAKrtXauFzTuYrzai3Zesvh+BoWzoF/aQvbWdCpykuD6PsZQrqjO1uKlCrjfg8PAHybIthsi2UGzCy2lFNt8FgwywbKaZ8vV+fVuNOnLEI9Zde4CyaTafMtPo0H9KMfO9Z8WewAgAAAAAAB8q9zQt1mvWp0/WkkB9Qae42jsaWVTc6z/wAI4XtZq7nai4nwt6FOmusnvMC2FC19/wAZuvWX5UfO51S+uf5t1Ua+zF7q9iPE2AbIsMw2UGy6bH/VD+9l7ilNinWqUZb9GpOnLrCTTCOpA5/bbSanb4TrRqx6VY58VxNta7ZU3hXdrKPWVOWfBkVagay117TLnChd04yf9tTzH4myjJSSlFpp8mgMgADWa9fysbPNJpVaj3YN9nVlLqTlUm5zk5SfNyeWzf7YT/b20OxRk/FfoV1gGRbMtkGyg2RBhgGYYZFsINkGw2YbANkQYYBmy0HV6umXdPM27aUkqkOzHVelGrbIvkB17PQHm0yo62m2lWT4zowk++KBFV3a/wDraH3XvZoGABFkWAUYZFgBEWRYAEWRYAGGYZgARZFgAdT0P6msf9eH5UZAIr//2Q=="
                    }
                    else {
                        $sessionStorage.userProfilePhoto = sessionObjects.UserProfilePicture;
                    }
                    $rootScope.userProfilePhoto = $sessionStorage.userProfilePhoto

                    var roleName = sessionObjects.RoleName;

                    if (roleName === "Customer") {
                        $rootScope.CultureId = '1101';
                    } else {
                        $rootScope.CultureId = '1101';
                    }



                    var menuRequestData = {
                        ServicesAction: 'LoadMenuList',
                        RoleMasterId: $rootScope.RoleId,
                        CultureId: $rootScope.CultureId,
                        UserId: $rootScope.UserId
                    };

                    var menuConsolidateApiParamater = {
                        Json: menuRequestData,
                    };

                    GrRequestService.ProcessRequest(menuConsolidateApiParamater).then(function (response) {


                        if (response.data !== null && response.data !== undefined) {
                            if (response.data.Json != null && response.data.Json != undefined) {
                                var resoponsedata = response.data;
                                $rootScope.MenuList = resoponsedata.Json.PagesList;
                                $sessionStorage.MenuList = $rootScope.MenuList;
                            } else {
                                $rootScope.MenuList = [];
                                $sessionStorage.MenuList = [];
                            }
                        } else {
                            $rootScope.MenuList = [];
                            $sessionStorage.MenuList = [];
                        }






                        var requestLookupData = {
                            ServicesAction: 'LoadAllLookUpMaster',
                            CompanyId: 0
                        };

                        var jsonLookupobject = {};
                        jsonLookupobject.Json = requestLookupData;
                        GrRequestService.ProcessRequest(jsonLookupobject).then(function (response) {

                            //var branchrequestData = {
                            //    ServicesAction: 'LoadAllBranchPlantList',
                            //    CompanyId: $rootScope.CompanyId
                            //};

                            //// var stringfyjson = JSON.stringify(requestData);
                            //var branchjsonobject = {};
                            //branchjsonobject.Json = branchrequestData;
                            //GrRequestService.ProcessRequest(branchjsonobject).then(function (branchresponse) {


                            ///Resources Start.....
                            var ResourcesData = {
                                ServicesAction: "GetAllResourcesList",
                                CultureId: 0,
                            };
                            var consolidateApiParamater = {
                                Json: ResourcesData,
                            };

                            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (objectResourcesResponse) {


                                $sessionStorage.CultureId = $rootScope.CultureId;

                                var ResourcesResoponseData = objectResourcesResponse.data.Resources.ResourcesList;
                                $sessionStorage.ResourcesData = ResourcesResoponseData;

                                var resourcesList = ResourcesResoponseData.filter(function (el) {
                                    return el.CultureId === $rootScope.CultureId;
                                });

                                $scope.resData = {};
                                for (var j = 0, len = resourcesList.length; j < len; ++j) {
                                    var controlName = resourcesList[j].ResourceKey;
                                    $scope.resData[controlName] = '';
                                    $scope.resData[controlName] = resourcesList[j].ResourceValue;
                                }
                                $rootScope.resData = $scope.resData;
                                $sessionStorage.resData = $scope.resData;
                                $sessionStorage.BindAllBranchPlant = [];
                                $rootScope.StatusResourcesList = [];
                                $sessionStorage.StatusResourcesList = [];

                                var StatusResourcesData = {
                                    ServicesAction: "GetAllResourceForStatus",
                                    CultureId: $rootScope.CultureId,
                                    CompanyId: 0,
                                    RoleId: $rootScope.RoleId
                                };
                                var consolidateApiParamaterforstatus = {
                                    Json: StatusResourcesData,
                                };

                                GrRequestService.ProcessRequest(consolidateApiParamaterforstatus).then(function (objectResourcesStatusResponse) {

                                    if (objectResourcesStatusResponse.data != undefined) {
                                        if (objectResourcesStatusResponse.data.Json != undefined) {
                                            $rootScope.StatusResourcesList = objectResourcesStatusResponse.data.Json.StatusResourcesList;
                                            $sessionStorage.StatusResourcesList = $rootScope.StatusResourcesList;
                                        } else {
                                            $rootScope.StatusResourcesList = [];
                                            $sessionStorage.StatusResourcesList = [];
                                        }
                                    } else {
                                        $rootScope.StatusResourcesList = [];
                                        $sessionStorage.StatusResourcesList = [];
                                    }


                                    var resoponsedata = response.data;
                                    if (resoponsedata.Json !== undefined) {
                                        $scope.LookUpListData = resoponsedata.Json.LookUpList;
                                    } else {
                                        $scope.LookUpListData = [];
                                    }

                                    $sessionStorage.AllLookUpData = $scope.LookUpListData;
                                    $rootScope.AllLookUpData = $scope.LookUpListData;

                                    $scope.NotificationListData = [];
                                    $sessionStorage.AllNotificationListData = $scope.NotificationListData;
                                    $rootScope.AllNotificationListData = $scope.NotificationListData;

                                    $rootScope.LoadEventNotificationList($rootScope.UserId);

                                    $rootScope.TemOrderData = [];

                                    if ($rootScope.IsFirstLogin == true) {
                                        $rootScope.bindDeliverylocation = [];

                                        $rootScope.Throbber.Visible = false;

                                        $rootScope.RedirectPage(sessionObjects.PageUrl, sessionObjects.PageName);


                                        $rootScope.InvisibleMenuForFirstLoginScreen = false;
                                        //$rootScope.InvisibleComponentForLoginScreen = false;
                                    } else {
                                        //$rootScope.InvisibleComponentForLoginScreen = true;
                                        $rootScope.InvisibleMenuForFirstLoginScreen = true;
                                        $rootScope.Throbber.Visible = false;
                                        $state.go('ChangePassword');
                                    }
                                    $rootScope.InvisibleComponentForLoginScreen = false;
                                });

                            });
                            //});
                        });

                    });
                } else if (myData[0] === "UseAnotherTab") {
                    $rootScope.Throbber.Visible = false;
                    $scope.OpenConfirmationPopup('Warning', 'Hi ' + userName + ', It seems like there is another user already logged in to the system as "' + myData[1] + '" from this computer. Please log out "' + myData[1] + '" from glassRUN first and try logging in again.', 'Close');
                } else if (myData[0] === "UseAnotherTabSameUserName") {
                    $rootScope.Throbber.Visible = false;
                    $scope.OpenConfirmationPopup('Warning', 'Hi ' + userName + ', It seems like you already logged in to the system as "' + userName + '" from this computer. Please log out from glassRUN first from previous Tab and try logging in again.', 'Close');
                } else {
                    $rootScope.Throbber.Visible = false;
                    $scope.OpenConfirmationPopup('Validation', 'Invalid user name or password.', 'OK');
                }

            } catch (e1) {
                $rootScope.Throbber.Visible = false;
                $scope.OpenConfirmationPopup('Validation', e1.Message, 'OK');
            }
        });
    }

    $rootScope.GetAllLoginAsDetails = function () {


        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllLoginDetails',
            RoleMasterId: '0'

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.LoginDetailsList.length > 0) {

                    $rootScope.LoginDetailsListForLoginAs = response.data.Json.LoginDetailsList;
                    $rootScope.Throbber.Visible = false;
                }


            }
            else {
                $rootScope.Throbber.Visible = false;
                $rootScope.LoginDetailsListForLoginAs = [];
            }
        });

    }





    $scope.LoadDataFromServerForPasswordPolicy = function (sessionObjects) {
        debugger;
        $rootScope.TempEnquiryDetailId = 0;
        $rootScope.EnquiryDetailId = 0;
        $rootScope.RoleId = sessionObjects.RoleMasterId;
        $rootScope.UserId = sessionObjects.LoginId;
        $rootScope.CompanyId = sessionObjects.ReferenceId;
        $rootScope.ActiveUserName = sessionObjects.Name;
        $rootScope.RoleName = sessionObjects.RoleName;
        $rootScope.CompanyMnemonic = sessionObjects.CompanyMnemonic;
        $rootScope.CompanyType = sessionObjects.CompanyType;

        $rootScope.ParentCompanyId = sessionObjects.ParentCompanyId;
        $rootScope.SelfCollectValue = sessionObjects.SelfCollectValue;
        $rootScope.IsFirstLogin = sessionObjects.ChangePasswordonFirstLoginRequired;
        $rootScope.Token = sessionObjects.Token;
        $rootScope.DefaultLanguage = sessionObjects.DefaultLanguage;
        $rootScope.StockLocationCode = sessionObjects.StockLocationCode;

        $rootScope.CompanyZone = sessionObjects.CompanyZone;
        $sessionStorage.CompanyZone = sessionObjects.CompanyZone;


        $rootScope.EnquiryCompanyType = sessionObjects.CompanyType;
        $sessionStorage.EnquiryCompanyType = sessionObjects.CompanyType;

        if (sessionObjects.UserProfilePicture === undefined || sessionObjects.UserProfilePicture === null) {
            $sessionStorage.userProfilePhoto = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHQAdAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgYBBQcEA//EADsQAAIBAwEFAwcJCQAAAAAAAAABAgMEEQUGEiExUUGBoRUiYXKRweETFDI1UnOxstEjJCUzNEJidPD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO4gAAAAB5ri/tbZ4rVop/ZTy/YajV9WjPeo2zbS4Oalhd2OZo2wLT5dsuK3p98Xg8k9o0m922bXY3P4FfZFsC02OvUK81CtF0ZN4TbzF95tznzNtYa9UtbZUalJ1d1+bJzxw6cgLWDXaZq9DUG4RjKFRLLjLp6GbEAAAAAAAAAavaCvOjZKMHj5SW636DaGk2oeKFD13+AFeZFhsi2Blsi2GyLYBsi2GyIHv0SqqWqUJOagm93jyeeGP+9BeDnC+ksdTo6AAAAAAAAAGl2oj+6UZdKmPB/obor+0l7SlF2ai3UjJScuyPD4gV/JhsMi2AbIthsiwBhsNkWyj6UFvXFKPWcV4nRjnFvVVC5pVpR3lTnGbj1w8l+0+8pX1rG4o5UZZTT5prsIPSAAAAAAAAUrWc+VLnPPf9xdSvbR6ZVqVPndvBzysVIxWXw5MCutkWyVSM6cnGpGUJLmpLDR8wDMNhsi2UGyLYbItgGy47H58lzzy+WePYiq2tjdXkoxt6E5qTwpY83vfIvumWcbCypW0XncXGXV9rIPUAAAAAAAAAAKrtXauFzTuYrzai3Zesvh+BoWzoF/aQvbWdCpykuD6PsZQrqjO1uKlCrjfg8PAHybIthsi2UGzCy2lFNt8FgwywbKaZ8vV+fVuNOnLEI9Zde4CyaTafMtPo0H9KMfO9Z8WewAgAAAAAAB8q9zQt1mvWp0/WkkB9Qae42jsaWVTc6z/wAI4XtZq7nai4nwt6FOmusnvMC2FC19/wAZuvWX5UfO51S+uf5t1Ua+zF7q9iPE2AbIsMw2UGy6bH/VD+9l7ilNinWqUZb9GpOnLrCTTCOpA5/bbSanb4TrRqx6VY58VxNta7ZU3hXdrKPWVOWfBkVagay117TLnChd04yf9tTzH4myjJSSlFpp8mgMgADWa9fysbPNJpVaj3YN9nVlLqTlUm5zk5SfNyeWzf7YT/b20OxRk/FfoV1gGRbMtkGyg2RBhgGYYZFsINkGw2YbANkQYYBmy0HV6umXdPM27aUkqkOzHVelGrbIvkB17PQHm0yo62m2lWT4zowk++KBFV3a/wDraH3XvZoGABFkWAUYZFgBEWRYAEWRYAGGYZgARZFgAdT0P6msf9eH5UZAIr//2Q=="
        }
        else {
            $sessionStorage.userProfilePhoto = sessionObjects.UserProfilePicture;
        }
        $rootScope.userProfilePhoto = $sessionStorage.userProfilePhoto

        var roleName = sessionObjects.RoleName;

        if ($rootScope.DefaultLanguage !== undefined && $rootScope.DefaultLanguage !== 0) {
            $rootScope.CultureId = $rootScope.DefaultLanguage;
        }
        else {
            $rootScope.CultureId = '1101'
        }



        var menuRequestData = {
            ServicesAction: 'LoadMenuList',
            RoleMasterId: $rootScope.RoleId,
            CultureId: $rootScope.CultureId,
            UserId: $rootScope.UserId
        };

        var menuConsolidateApiParamater = {
            Json: menuRequestData,
        };

        var loadResponseMenuList = GrRequestService.ProcessRequest(menuConsolidateApiParamater);



        var requestLookupData = {
            ServicesAction: 'LoadAllLookUpMaster',
            CompanyId: 0
        };

        var jsonLookupobject = {};
        jsonLookupobject.Json = requestLookupData;
        var lookUpResponseList = GrRequestService.ProcessRequest(jsonLookupobject);


        var ResourcesData = {
            ServicesAction: "GetAllResourcesList",
            CultureId: $rootScope.CultureId,
        };
        var consolidateApiParamater = {
            Json: ResourcesData,
        };

        var resourceResponseResourcesList = GrRequestService.ProcessRequest(consolidateApiParamater);

        $sessionStorage.BindAllBranchPlant = [];
        $rootScope.StatusResourcesList = [];
        $sessionStorage.StatusResourcesList = [];

        var StatusResourcesData = {
            ServicesAction: "GetAllResourceForStatus",
            CultureId: $rootScope.CultureId,
            CompanyId: 0,
            RoleId: $rootScope.RoleId
        };
        var consolidateApiParamaterforstatus = {
            Json: StatusResourcesData,
        };

        var resourceResourceForStatusList = GrRequestService.ProcessRequest(consolidateApiParamaterforstatus);


        $q.all([
            loadResponseMenuList,
            lookUpResponseList,
            resourceResponseResourcesList,
            resourceResourceForStatusList
        ]).then(function (resp) {

            var response = resp[0];
            var responselookupinfo = resp[1];
            var objectResourcesResponse = resp[2];
            var objectResourcesStatusResponse = resp[3];
            debugger;
            if (response.data !== null && response.data !== undefined) {
                if (response.data.Json != null && response.data.Json != undefined) {
                    var resoponsedata = response.data;
                    $rootScope.MenuList = resoponsedata.Json.PagesList;
                    $sessionStorage.MenuList = $rootScope.MenuList;
                } else {
                    $rootScope.MenuList = [];
                    $sessionStorage.MenuList = [];
                }
            } else {
                $rootScope.MenuList = [];
                $sessionStorage.MenuList = [];
            }



            $sessionStorage.CultureId = $rootScope.CultureId;

            var ResourcesResoponseData = objectResourcesResponse.data.Resources.ResourcesList;
            $sessionStorage.ResourcesData = ResourcesResoponseData;

            var resourcesList = ResourcesResoponseData.filter(function (el) {
                return el.CultureId === $rootScope.CultureId;
            });

            $scope.resData = {};
            for (var j = 0, len = resourcesList.length; j < len; ++j) {
                var controlName = resourcesList[j].ResourceKey;
                $scope.resData[controlName] = '';
                $scope.resData[controlName] = resourcesList[j].ResourceValue;
            }
            $rootScope.resData = $scope.resData;
            $sessionStorage.resData = $scope.resData;

            //------



            if (objectResourcesStatusResponse.data != undefined) {
                if (objectResourcesStatusResponse.data.Json != undefined) {
                    $rootScope.StatusResourcesList = objectResourcesStatusResponse.data.Json.StatusResourcesList;
                    $sessionStorage.StatusResourcesList = $rootScope.StatusResourcesList;
                } else {
                    $rootScope.StatusResourcesList = [];
                    $sessionStorage.StatusResourcesList = [];
                }
            } else {
                $rootScope.StatusResourcesList = [];
                $sessionStorage.StatusResourcesList = [];
            }


            var resoponsedata = responselookupinfo.data;
            if (resoponsedata.Json !== undefined) {
                $scope.LookUpListData = resoponsedata.Json.LookUpList;
            } else {
                $scope.LookUpListData = [];
            }

            $sessionStorage.AllLookUpData = $scope.LookUpListData;
            $rootScope.AllLookUpData = $scope.LookUpListData;

            $scope.NotificationListData = [];
            $sessionStorage.AllNotificationListData = $scope.NotificationListData;
            $rootScope.AllNotificationListData = $scope.NotificationListData;

            $sessionStorage.ParentCompanyId = $rootScope.ParentCompanyId;

            $rootScope.LoadEventNotificationList($rootScope.UserId);

            $rootScope.TemOrderData = [];

            if ($rootScope.IsFirstLogin == true) {
                $rootScope.bindDeliverylocation = [];

                $rootScope.Throbber.Visible = false;

                $rootScope.PageName = sessionObjects.PageName;
                sessionStorage.PageName = sessionObjects.PageName;

                $rootScope.RedirectPageFromMenu(sessionObjects.PageUrl, sessionObjects.PageName, sessionObjects.PageName);

                $rootScope.InvisibleMenuForFirstLoginScreen = false;

            } else {

                $rootScope.InvisibleMenuForFirstLoginScreen = true;
                $rootScope.Throbber.Visible = false;
                $state.go('ChangePassword');

            }
            $rootScope.InvisibleComponentForLoginScreen = false;
        });

    }




    // 42 Delivery Location Change Confirmation Popup if truck is alredy fill.
    $ionicModal.fromTemplateUrl('PasswordPolicyModalPopup.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $rootScope.PasswordPolicyChangeControl = modal;
    });
    $rootScope.ClosePasswordPolicyChangeConfirmationPopup = function () {
        $rootScope.PasswordPolicyChangeControl.hide();
    };
    $rootScope.OpenPasswordPolicyChangeConfirmationPopup = function () {
        $rootScope.PasswordPolicyChangeControl.show();
    };



    $ionicModal.fromTemplateUrl('PasswordPolicyForcefullyModalPopup.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $rootScope.PasswordPolicyForcefullyChangeControl = modal;
    });
    $rootScope.ClosePasswordPolicyForcefullyChangeConfirmationPopup = function () {
        $rootScope.PasswordPolicyForcefullyChangeControl.hide();
    };
    $rootScope.OpenPasswordPolicyForcefullyChangeConfirmationPopup = function () {
        $rootScope.PasswordPolicyForcefullyChangeControl.show();
    };

    //Chnaged by nimesh on 24-10-2019 for passwordpolicy
    $scope.EventYesChangePassword = function () {
        $scope.ClosePasswordPolicyChangeConfirmationPopup();
        $rootScope.DaysRemainingValidation = true;
        $rootScope.InvisibleMenuForFirstLoginScreen = false;
        $rootScope.InvisibleComponentForLoginScreen = false;
        $rootScope.IsVisiblity = false;
        if ($scope.sessionObjects.UserProfilePicture === undefined || $scope.sessionObjects.UserProfilePicture === null) {
            $sessionStorage.userProfilePhoto = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHQAdAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgYBBQcEA//EADsQAAIBAwEFAwcJCQAAAAAAAAABAgMEEQUGEiExUUGBoRUiYXKRweETFDI1UnOxstEjJCUzNEJidPD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO4gAAAAB5ri/tbZ4rVop/ZTy/YajV9WjPeo2zbS4Oalhd2OZo2wLT5dsuK3p98Xg8k9o0m922bXY3P4FfZFsC02OvUK81CtF0ZN4TbzF95tznzNtYa9UtbZUalJ1d1+bJzxw6cgLWDXaZq9DUG4RjKFRLLjLp6GbEAAAAAAAAAavaCvOjZKMHj5SW636DaGk2oeKFD13+AFeZFhsi2Blsi2GyLYBsi2GyIHv0SqqWqUJOagm93jyeeGP+9BeDnC+ksdTo6AAAAAAAAAGl2oj+6UZdKmPB/obor+0l7SlF2ai3UjJScuyPD4gV/JhsMi2AbIthsiwBhsNkWyj6UFvXFKPWcV4nRjnFvVVC5pVpR3lTnGbj1w8l+0+8pX1rG4o5UZZTT5prsIPSAAAAAAAAUrWc+VLnPPf9xdSvbR6ZVqVPndvBzysVIxWXw5MCutkWyVSM6cnGpGUJLmpLDR8wDMNhsi2UGyLYbItgGy47H58lzzy+WePYiq2tjdXkoxt6E5qTwpY83vfIvumWcbCypW0XncXGXV9rIPUAAAAAAAAAAKrtXauFzTuYrzai3Zesvh+BoWzoF/aQvbWdCpykuD6PsZQrqjO1uKlCrjfg8PAHybIthsi2UGzCy2lFNt8FgwywbKaZ8vV+fVuNOnLEI9Zde4CyaTafMtPo0H9KMfO9Z8WewAgAAAAAAB8q9zQt1mvWp0/WkkB9Qae42jsaWVTc6z/wAI4XtZq7nai4nwt6FOmusnvMC2FC19/wAZuvWX5UfO51S+uf5t1Ua+zF7q9iPE2AbIsMw2UGy6bH/VD+9l7ilNinWqUZb9GpOnLrCTTCOpA5/bbSanb4TrRqx6VY58VxNta7ZU3hXdrKPWVOWfBkVagay117TLnChd04yf9tTzH4myjJSSlFpp8mgMgADWa9fysbPNJpVaj3YN9nVlLqTlUm5zk5SfNyeWzf7YT/b20OxRk/FfoV1gGRbMtkGyg2RBhgGYYZFsINkGw2YbANkQYYBmy0HV6umXdPM27aUkqkOzHVelGrbIvkB17PQHm0yo62m2lWT4zowk++KBFV3a/wDraH3XvZoGABFkWAUYZFgBEWRYAEWRYAGGYZgARZFgAdT0P6msf9eH5UZAIr//2Q=="
        }
        else {
            $scope.sessionObjects.userProfilePhoto = $scope.sessionObjects.UserProfilePicture;
        }
        $rootScope.userProfilePhoto = $scope.sessionObjects.userProfilePhoto
        $sessionStorage.userProfilePhoto = $scope.sessionObjects.UserProfilePicture;
        var roleName = $scope.sessionObjects.RoleName;

        if (roleName === "Customer") {

            $rootScope.CultureId = '1102';
        } else {
            $rootScope.CultureId = '1101';
        }
        var ResourcesData = {
            ServicesAction: "GetAllResourcesList",
            CultureId: 0,

        };
        var consolidateApiParamater = {
            Json: ResourcesData,
        };


        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (objectResourcesResponse) {
            debugger;

            $sessionStorage.CultureId = $rootScope.CultureId;

            var ResourcesResoponseData = objectResourcesResponse.data.Resources.ResourcesList;
            $sessionStorage.ResourcesData = ResourcesResoponseData;

            var resourcesList = ResourcesResoponseData.filter(function (el) {
                return el.CultureId === $rootScope.CultureId;
            });

            $scope.resData = {};
            for (var j = 0, len = resourcesList.length; j < len; ++j) {
                var controlName = resourcesList[j].ResourceKey;
                $scope.resData[controlName] = '';
                $scope.resData[controlName] = resourcesList[j].ResourceValue;
            }
            $rootScope.resData = $scope.resData;
            $sessionStorage.resData = $scope.resData;
            var requestLookupData = {
                ServicesAction: 'LoadAllLookUpMaster',
                CompanyId: 0
            };


            var jsonLookupobject = {};
            jsonLookupobject.Json = requestLookupData;
            GrRequestService.ProcessRequest(jsonLookupobject).then(function (response) {
                debugger;
                var resoponsedata = response.data;
                if (resoponsedata.Json !== undefined) {
                    $scope.LookUpListData = resoponsedata.Json.LookUpList;
                } else {
                    $scope.LookUpListData = [];
                }

                $sessionStorage.AllLookUpData = $scope.LookUpListData;
                $rootScope.AllLookUpData = $scope.LookUpListData;
                $rootScope.Throbber.Visible = false;
                $state.go('ChangePassword');
            });
        });

    }



    //Changed by nimesh for policy password on 24-10-2019
    $scope.EventNoChangePassword = function () {
        debugger;
        $rootScope.DaysRemainingValidation = false;
        $scope.ClosePasswordPolicyChangeConfirmationPopup();
        $scope.LoadDataFromServerForPasswordPolicy($scope.sessionObjects);
    }
    //Changes by nimesh on 24- 10 - 2019
    $scope.ChangePasswordForcefully = function () {
        $rootScope.ClosePasswordPolicyForcefullyChangeConfirmationPopup();
        $rootScope.Throbber.Visible = false;
        $state.go('ChangePassword');
    }


});

