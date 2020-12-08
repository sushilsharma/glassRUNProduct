angular.module("glassRUNProduct").controller('DriverController', function ($scope, $q, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {

    //$scope.LoginId = 0

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = false;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    };



    $scope.TransporterId = "";
    $scope.TransporterType = "";
    $scope.TransporterName = "";

    $scope.contactOptions = {};
    $scope.documentOptions = {};

    $rootScope.ContactPersonRecordEditedTrue = false;

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.CompanySearchInputDefaultSetting = function () {
        $scope.SearchCompanyControl = {
            Input: '',
            FilterAutoCompletebox: '',
            selectedRow: -1,
            showbox: false,
            foundResult: false,
            IsSearchInputFilled: false
        };

        //$scope.UserDetailObject.ReferenceId = "";
        //$scope.UserDetailObject.ReferenceType = "";
    }
    $scope.CompanySearchInputDefaultSetting();


    //#region Variable created

    $scope.CompanyTypeList = [];
    $scope.ContactTypeList = [];
    $scope.LicenseTypeList = [];
    $scope.DocumentTypeList = [];


    $scope.DocumentRequiredList = [];

    $scope.LoadDirective = false;

    $scope.LoadPageAcessComponent = false;


    $scope.LoadDirectiveForLoginGrid = false;



    $scope.LoadDefaultSettingsValue = function () {


        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'LoadLoginCreation',
            UserId: $rootScope.UserId,
            PageName: "CreateUser"
        };

        var consolidateApiParamater =
        {
            Json: requestData,
        };



        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;

            if (response.data != undefined) {

                if (response.data.CompanyTypeList != undefined) {
                    $scope.CompanyTypeList = response.data.CompanyTypeList;
                    $scope.CompanyTypeList = $scope.CompanyTypeList.filter(function (el) { return el.Name === 'Transporter'; });
                    if ($scope.CompanyTypeList.length > 0) {
                        $scope.UserDetailObject.ReferenceType = $scope.CompanyTypeList[0].LookUpId;
                        $scope.ClickOnCompanyTypeRadioButton($scope.CompanyTypeList[0].LookUpId);
                    }


                }

                if (response.data.ContactTypeList != undefined) {
                    $scope.ContactTypeList = response.data.ContactTypeList;
                }

                if (response.data.LicenseTypeList != undefined) {
                    $scope.LicenseTypeList = response.data.LicenseTypeList;
                }

                if (response.data.DocumentTypeList != undefined) {
                    $scope.DocumentTypeList = response.data.DocumentTypeList;
                }

                if (response.data.LanguageTypeList !== undefined) {
                    $scope.UserDetailObject.DefaultLanguage = response.data.LanguageTypeList[0].LookUpId;

                    $scope.LanguageList = response.data.LanguageTypeList;
                }

                if (response.data.DocumentRequiredList != undefined) {

                    $scope.DocumentRequiredList = response.data.DocumentRequiredList;

                }



                $scope.LoadDirective = true;

                $rootScope.Throbber.Visible = false;




            }
        });

        //var LoginDocumentType = $rootScope.AllLookUpData.filter(function(el) { return el.LookupCategoryName === 'LoginDocumentType'; });
        //if (LoginDocumentType.length > 0) {
        //    $scope.LoginDocumentTypeList = LoginDocumentType;
        //}
    }
    $scope.LoadDefaultSettingsValue();

    //#endregion


    $rootScope.ClearUploadProfileImage = function () {
        debugger;
        $scope.UserDetailObject.UserProfilePicture = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHQAdAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgYBBQcEA//EADsQAAIBAwEFAwcJCQAAAAAAAAABAgMEEQUGEiExUUGBoRUiYXKRweETFDI1UnOxstEjJCUzNEJidPD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO4gAAAAB5ri/tbZ4rVop/ZTy/YajV9WjPeo2zbS4Oalhd2OZo2wLT5dsuK3p98Xg8k9o0m922bXY3P4FfZFsC02OvUK81CtF0ZN4TbzF95tznzNtYa9UtbZUalJ1d1+bJzxw6cgLWDXaZq9DUG4RjKFRLLjLp6GbEAAAAAAAAAavaCvOjZKMHj5SW636DaGk2oeKFD13+AFeZFhsi2Blsi2GyLYBsi2GyIHv0SqqWqUJOagm93jyeeGP+9BeDnC+ksdTo6AAAAAAAAAGl2oj+6UZdKmPB/obor+0l7SlF2ai3UjJScuyPD4gV/JhsMi2AbIthsiwBhsNkWyj6UFvXFKPWcV4nRjnFvVVC5pVpR3lTnGbj1w8l+0+8pX1rG4o5UZZTT5prsIPSAAAAAAAAUrWc+VLnPPf9xdSvbR6ZVqVPndvBzysVIxWXw5MCutkWyVSM6cnGpGUJLmpLDR8wDMNhsi2UGyLYbItgGy47H58lzzy+WePYiq2tjdXkoxt6E5qTwpY83vfIvumWcbCypW0XncXGXV9rIPUAAAAAAAAAAKrtXauFzTuYrzai3Zesvh+BoWzoF/aQvbWdCpykuD6PsZQrqjO1uKlCrjfg8PAHybIthsi2UGzCy2lFNt8FgwywbKaZ8vV+fVuNOnLEI9Zde4CyaTafMtPo0H9KMfO9Z8WewAgAAAAAAB8q9zQt1mvWp0/WkkB9Qae42jsaWVTc6z/wAI4XtZq7nai4nwt6FOmusnvMC2FC19/wAZuvWX5UfO51S+uf5t1Ua+zF7q9iPE2AbIsMw2UGy6bH/VD+9l7ilNinWqUZb9GpOnLrCTTCOpA5/bbSanb4TrRqx6VY58VxNta7ZU3hXdrKPWVOWfBkVagay117TLnChd04yf9tTzH4myjJSSlFpp8mgMgADWa9fysbPNJpVaj3YN9nVlLqTlUm5zk5SfNyeWzf7YT/b20OxRk/FfoV1gGRbMtkGyg2RBhgGYYZFsINkGw2YbANkQYYBmy0HV6umXdPM27aUkqkOzHVelGrbIvkB17PQHm0yo62m2lWT4zowk++KBFV3a/wDraH3XvZoGABFkWAUYZFgBEWRYAEWRYAGGYZgARZFgAdT0P6msf9eH5UZAIr//2Q==";
        angular.element("input[type='file']").val(null);
    }

    //#region Variable created

    $scope.InitalizeUserDetail = function () {
        debugger;

        $scope.UserDetailObject = {
            Name: '',
            EmailAddress: '',
            ContactNumber: '',
            FileFormat: '',
            UserProfilePicture: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHQAdAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgYBBQcEA//EADsQAAIBAwEFAwcJCQAAAAAAAAABAgMEEQUGEiExUUGBoRUiYXKRweETFDI1UnOxstEjJCUzNEJidPD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO4gAAAAB5ri/tbZ4rVop/ZTy/YajV9WjPeo2zbS4Oalhd2OZo2wLT5dsuK3p98Xg8k9o0m922bXY3P4FfZFsC02OvUK81CtF0ZN4TbzF95tznzNtYa9UtbZUalJ1d1+bJzxw6cgLWDXaZq9DUG4RjKFRLLjLp6GbEAAAAAAAAAavaCvOjZKMHj5SW636DaGk2oeKFD13+AFeZFhsi2Blsi2GyLYBsi2GyIHv0SqqWqUJOagm93jyeeGP+9BeDnC+ksdTo6AAAAAAAAAGl2oj+6UZdKmPB/obor+0l7SlF2ai3UjJScuyPD4gV/JhsMi2AbIthsiwBhsNkWyj6UFvXFKPWcV4nRjnFvVVC5pVpR3lTnGbj1w8l+0+8pX1rG4o5UZZTT5prsIPSAAAAAAAAUrWc+VLnPPf9xdSvbR6ZVqVPndvBzysVIxWXw5MCutkWyVSM6cnGpGUJLmpLDR8wDMNhsi2UGyLYbItgGy47H58lzzy+WePYiq2tjdXkoxt6E5qTwpY83vfIvumWcbCypW0XncXGXV9rIPUAAAAAAAAAAKrtXauFzTuYrzai3Zesvh+BoWzoF/aQvbWdCpykuD6PsZQrqjO1uKlCrjfg8PAHybIthsi2UGzCy2lFNt8FgwywbKaZ8vV+fVuNOnLEI9Zde4CyaTafMtPo0H9KMfO9Z8WewAgAAAAAAB8q9zQt1mvWp0/WkkB9Qae42jsaWVTc6z/wAI4XtZq7nai4nwt6FOmusnvMC2FC19/wAZuvWX5UfO51S+uf5t1Ua+zF7q9iPE2AbIsMw2UGy6bH/VD+9l7ilNinWqUZb9GpOnLrCTTCOpA5/bbSanb4TrRqx6VY58VxNta7ZU3hXdrKPWVOWfBkVagay117TLnChd04yf9tTzH4myjJSSlFpp8mgMgADWa9fysbPNJpVaj3YN9nVlLqTlUm5zk5SfNyeWzf7YT/b20OxRk/FfoV1gGRbMtkGyg2RBhgGYYZFsINkGw2YbANkQYYBmy0HV6umXdPM27aUkqkOzHVelGrbIvkB17PQHm0yo62m2lWT4zowk++KBFV3a/wDraH3XvZoGABFkWAUYZFgBEWRYAEWRYAGGYZgARZFgAdT0P6msf9eH5UZAIr//2Q==",
            AllowFileFormat: 'jpg,png,jpeg',
            AllowFileSize: 10,
            CompanyName: '',
            UserName: '',
            Password: '',
            IsActive: '',
            CreatedDate: '',
            CreatedBy: '',
            LicenseType: '',
            DefaultLanguage: '1101',
            ContactInformationList: [],
            DocumentInformationList: [],
            LoginId: 0,
            LicenseNumber: '',
            GlobalRoleName: $rootScope.RoleName,
            PageName: 'Create Driver',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId

        }


        angular.element("input[type='file']").val(null);

        $scope.UserDetailObject.RoleMasterId = "8";

        $scope.UserDetailObject.RoleName = "Driver";

        $scope.UserDetailObject.ReferenceId = $scope.TransporterId;
        $scope.UserDetailObject.ReferenceType = $scope.TransporterType;
        $scope.SearchCompanyControl.Input = $scope.TransporterName;

    }

    $scope.InitalizeUserDetail();

    //#endregion





    $scope.ClearInitalizeUserDetail = function () {
        debugger;
        $scope.SearchCompanyControl = {
            Input: '',
            FilterAutoCompletebox: '',
            selectedRow: -1,
            showbox: false,
            foundResult: false,
            IsSearchInputFilled: false
        };
        $scope.InitalizeUserDetail();
        $rootScope.ClearDocumentInformation();
        $rootScope.ClearInitalizeContactInformation();
    }



    //#region Save created

    $scope.SaveForLogin = function () {


        $rootScope.Throbber.Visible = true;
        debugger;


        if ($scope.ValidationForLogin()) {


            var requestData =
            {
                ServicesAction: 'CheckDuplicateUser',
                LoginId: $scope.UserDetailObject.LoginId,
                UserName: $scope.UserDetailObject.UserName
            };

            var consolidateApiParamater =
            {
                Json: requestData,
            };



            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                var isValid = '0';

                if (response.data !== undefined) {
                    if (response.data.Json !== undefined) {
                        isValid = response.data.Json.IsValid;
                    }
                }

                if (isValid === '1') {
					
                    var requestData =
                    {
                        ServicesAction: 'CreateLogin',
                        Login: $scope.UserDetailObject
                    };

                    var consolidateApiParamater =
                    {
                        Json: requestData,
                    };



                    GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                        debugger;
                        if (response.data.Json != undefined) {
                            if (response.data.Json.LoginId == "-1") {
                                //$rootScope.ValidationErrorAlert(String.format("License Number Already Exist"), '', 3000);
                                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_LicenseNumberAlreadyexist), '', 3000);
                                $rootScope.Throbber.Visible = false;
                                return;

                            } else if (response.data.Json.Message == "error") {
                                //$rootScope.ValidationErrorAlert(String.format("UserName Already Exist"), '', 3000);
                                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_UserNameAlreadyexist), '', 3000);
                                $rootScope.Throbber.Visible = false;
                                return;

                            } else if (response.data.Json.LoginId == "-2") {
                                //$rootScope.ValidationErrorAlert(String.format("UserName Already Exist"), '', 3000);
                                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_UserNameAlreadyexist), '', 3000);
                                $rootScope.Throbber.Visible = false;
                                return;

                            }
                            else if ($scope.UserDetailObject.LoginId == 0) {
                                $scope.InitalizeUserDetail();
                                $scope.CompanySearchInputDefaultSetting();

                                $rootScope.ValidationErrorAlert(String.format("Record saved successfully"), '', 3000);

                            }
                            else {

                                if ($rootScope.UserId === parseInt($scope.UserDetailObject.LoginId)) {
                                    $sessionStorage.userProfilePhoto = $scope.UserDetailObject.UserProfilePicture;
                                    $rootScope.userProfilePhoto = $sessionStorage.userProfilePhoto;
                                }
                                $rootScope.ValidationErrorAlert(String.format("Record updated successfully"), '', 3000);
                            }
                            $scope.ClearControls();
                            $scope.ViewForm();
                            $rootScope.DocumentAction = "Clear";

                            $rootScope.Throbber.Visible = false;
                        }
                        else {
                            $rootScope.ValidationErrorAlert(response.data.ErrorValidationMessage +  String.format($rootScope.resData.res_ServerSideVlaidationMsg_View), '', 3000);
                            $rootScope.Throbber.Visible = false;
                        }
                    });

                }
                else {
                    $rootScope.Throbber.Visible = false;
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserPage_DuplicateRecordOfUserName), 'error', 3000);
                }



            });
        }





        //var photo = $scope.UserDetailObject.UserProfilePicture.Blob;
    }
    //#endregion

    //#region Update created

    $scope.UpdateForLogin = function () {


        var asdasd = $scope.UserDetailObject;

        var photo = $scope.UserDetailObject.UserProfilePicture.Blob;
    }
    //#endregion


    //#region validation

    $scope.ValidationForLogin = function () {
debugger;

        if ($rootScope.ContactPersonRecordEditedTrue === true && $rootScope.pageContrlAcessData.ContactTypeDropDown !== "0") {


            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ContactInformationInEditMode), '', 3000);
            $rootScope.Throbber.Visible = false;
            return false;
        }


        if ($scope.UserDetailObject.Name == "") {


            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_TypeName), '', 3000);
            $rootScope.Throbber.Visible = false;
            return false;
        }

//if ($rootScope.RoleName !== 'Carrier' && $rootScope.RoleName !== 'TransportManager') {
        if ($scope.UserDetailObject.UserName == "") {


            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_TypeUserName), '', 3000);
            $rootScope.Throbber.Visible = false;
            return false;
        }
//}


        if ($scope.UserDetailObject.RoleMasterId == "" || $scope.UserDetailObject.RoleMasterId == null) {

            //$rootScope.ValidationErrorAlert(String.format("Please select the role"), '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_SelectRole), '', 3000);
            $rootScope.Throbber.Visible = false;
            return false;
        }

        if ($scope.UserDetailObject.RoleMasterId == 8) {
            if (($scope.UserDetailObject.LicenseNumber === '' || $scope.UserDetailObject.LicenseNumber === undefined || $scope.UserDetailObject.LicenseNumber === null) && $rootScope.pageContrlAcessData.LicenseNumber !== '0') {
                //$rootScope.ValidationErrorAlert(String.format("Enter License Number"), '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_EnterLicenseNumber), '', 3000);
                $rootScope.Throbber.Visible = false;
                return false;
            }

        }
//if ($rootScope.RoleName !== 'Carrier' && $rootScope.RoleName !== 'TransportManager') {
        if (($scope.UserDetailObject.Password === '' || $scope.UserDetailObject.Password === undefined || $scope.UserDetailObject.Password === null) && $scope.UserDetailObject.LoginId === 0) {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_EnterPassword), '', 3000);
            $rootScope.Throbber.Visible = false;
            return false;
        } else {
            if (($scope.UserDetailObject.Password.length < 8 || $scope.UserDetailObject.Password.length > 20) && $scope.UserDetailObject.LoginId === 0) {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_AtleastEightcharacterneed), 'error', 3000);
                $rootScope.Throbber.Visible = false;
                return false;
            }
        }
//}
//else
//{
//	$scope.UserDetailObject.Password="12345678";
//}




        var documentRequiredListByRole = $scope.DocumentRequiredList.filter(function (m) { return m.RoleId === $scope.UserDetailObject.RoleMasterId });


        if (documentRequiredListByRole.length != 0) {


            for (var i = 0; i < documentRequiredListByRole.length; i++) {

                var documentInformationFilter = $scope.UserDetailObject.DocumentInformationList.filter(function (m) { return m.DocumentTypeId === documentRequiredListByRole[i].DocumentTypeId });

                if (documentInformationFilter.length == 0) {

                    var DocumentDetails = $scope.DocumentTypeList.filter(function (m) { return m.LookUpId === documentRequiredListByRole[i].DocumentTypeId })
                    if (DocumentDetails.length > 0) {
                        DocumentType = DocumentDetails[0].Name
                    }

                    $rootScope.ValidationErrorAlert(String.format("This document '" + DocumentType + "'  is compulsory"), '', 3000);
                    $rootScope.Throbber.Visible = false;
                    return false;


                }




            }




        }



        return true;


    }
    //#endregion

    //#region Company Table Drop down Creation

    $scope.IsDisableTransporter = false;

    $scope.LoadedCompanyList = [];

    $scope.LoadAllCompanyListByParentType = function (parentType) {


        $scope.LoadedCompanyList = [];
        $scope.CompanySearchInputDefaultSetting();

        var requestData =
        {
            ServicesAction: 'LoadAllCompanyDetailListByDropDown',
            CompanyType: parentType,
            CompanyId: $rootScope.CompanyId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data;

            if (typeof resoponsedata.Json !== 'undefined') {
                // Your variable is undefined
                $scope.LoadedCompanyList = resoponsedata.Json.CompanyList;

                if ($scope.LoadedCompanyList.length === 1) {

                    $scope.SelectedCompanyFromDropDown($scope.SearchCompanyControl, $scope.LoadedCompanyList[0]);

                    $scope.IsDisableTransporter = true;
                }

            }
        });
    }

    
    $scope.ShowListBox = function (SearchControl) {
        SearchControl.showbox = !SearchControl.showbox;
    }

    $scope.ClearInputSearchbox = function (SearchControl) {
        SearchControl.IsSearchInputFilled = false;
        SearchControl.showbox = false;
        SearchControl.Input = '';
        SearchControl.FilterAutoCompletebox = '';
    }

    $scope.InputSelecteChangeEvent = function (SearchControl) {
        if (SearchControl.Input.length > 0) {
            SearchControl.IsSearchInputFilled = true;
            SearchControl.showbox = true;
            SearchControl.selectedRow = 0;
        } else {
            SearchControl.IsCompanySearchInputFilled = false;
            SearchControl.showbox = false;
            SearchControl.selectedRow = -1;
        }
        SearchControl.FilterAutoCompletebox = SearchControl.Input;
    }


    $scope.SelectedCompanyFromDropDown = function (SearchControl, dataResult) {


        SearchControl.Input = dataResult.Name;

        SearchControl.showbox = false;
        SearchControl.selectedRow = -1;

        $scope.UserDetailObject.ReferenceId = dataResult.CompanyId;
        $scope.UserDetailObject.ReferenceType = dataResult.CompanyType;

        $scope.TransporterId = dataResult.CompanyId;
        $scope.TransporterType = dataResult.CompanyType;
        $scope.TransporterName = dataResult.Name;
    }

    //#endregion





    //#region Clear Control
    $scope.ClearControls = function () {
        $scope.UserDetailObject.Name = '';
        $scope.UserDetailObject.EmailAddress = '';
        $scope.UserDetailObject.ContactNumber = '';
        $scope.UserDetailObject.UserProfilePicture = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHQAdAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgYBBQcEA//EADsQAAIBAwEFAwcJCQAAAAAAAAABAgMEEQUGEiExUUGBoRUiYXKRweETFDI1UnOxstEjJCUzNEJidPD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO4gAAAAB5ri/tbZ4rVop/ZTy/YajV9WjPeo2zbS4Oalhd2OZo2wLT5dsuK3p98Xg8k9o0m922bXY3P4FfZFsC02OvUK81CtF0ZN4TbzF95tznzNtYa9UtbZUalJ1d1+bJzxw6cgLWDXaZq9DUG4RjKFRLLjLp6GbEAAAAAAAAAavaCvOjZKMHj5SW636DaGk2oeKFD13+AFeZFhsi2Blsi2GyLYBsi2GyIHv0SqqWqUJOagm93jyeeGP+9BeDnC+ksdTo6AAAAAAAAAGl2oj+6UZdKmPB/obor+0l7SlF2ai3UjJScuyPD4gV/JhsMi2AbIthsiwBhsNkWyj6UFvXFKPWcV4nRjnFvVVC5pVpR3lTnGbj1w8l+0+8pX1rG4o5UZZTT5prsIPSAAAAAAAAUrWc+VLnPPf9xdSvbR6ZVqVPndvBzysVIxWXw5MCutkWyVSM6cnGpGUJLmpLDR8wDMNhsi2UGyLYbItgGy47H58lzzy+WePYiq2tjdXkoxt6E5qTwpY83vfIvumWcbCypW0XncXGXV9rIPUAAAAAAAAAAKrtXauFzTuYrzai3Zesvh+BoWzoF/aQvbWdCpykuD6PsZQrqjO1uKlCrjfg8PAHybIthsi2UGzCy2lFNt8FgwywbKaZ8vV+fVuNOnLEI9Zde4CyaTafMtPo0H9KMfO9Z8WewAgAAAAAAB8q9zQt1mvWp0/WkkB9Qae42jsaWVTc6z/wAI4XtZq7nai4nwt6FOmusnvMC2FC19/wAZuvWX5UfO51S+uf5t1Ua+zF7q9iPE2AbIsMw2UGy6bH/VD+9l7ilNinWqUZb9GpOnLrCTTCOpA5/bbSanb4TrRqx6VY58VxNta7ZU3hXdrKPWVOWfBkVagay117TLnChd04yf9tTzH4myjJSSlFpp8mgMgADWa9fysbPNJpVaj3YN9nVlLqTlUm5zk5SfNyeWzf7YT/b20OxRk/FfoV1gGRbMtkGyg2RBhgGYYZFsINkGw2YbANkQYYBmy0HV6umXdPM27aUkqkOzHVelGrbIvkB17PQHm0yo62m2lWT4zowk++KBFV3a/wDraH3XvZoGABFkWAUYZFgBEWRYAEWRYAGGYZgARZFgAdT0P6msf9eH5UZAIr//2Q==";
        $scope.UserDetailObject.ReferenceId = '';
        $scope.UserDetailObjectReferenceType = '';
        $scope.UserDetailObjectCompanyName = '';
        $scope.UserDetailObjectUserName = '';
        $scope.UserDetailObjectPassword = '';
        $scope.UserDetailObjectRoleMasterId = '';
        $scope.UserDetailObjectRoleName = '';
        $scope.UserDetailObjectIsActive = '';
        $scope.UserDetailObjectCreatedDate = '';
        $scope.UserDetailObjectCreatedBy = '';
        $scope.UserDetailObjectLicenseType = '';
        $scope.UserDetailObjectContactInformationList = [];
        $scope.UserDetailObjectDocumentInformationList = [];
        $scope.UserDetailObjectLoginId = 0;
        $scope.UserDetailObject.LicenseNumber = '';

    }
    //#endregion Clear Control





    //#region Role master Drop down Creation

    $scope.RoleMasterList = [];

    $scope.LoadRoleMasterByCompanyType = function (companyType) {


        $scope.RoleMasterList = [];

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'LoadAllRoleMaster',
            CompanyType: companyType
        };

        var consolidateApiParamater =
        {
            Json: requestData,
        };



        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            debugger;
            var resoponsedata = response.data;

            if (typeof resoponsedata.Json !== 'undefined') {
                // Your variable is undefined
                $scope.RoleMasterList = resoponsedata.Json.RoleMasterList;

                $scope.UserDetailObject.RoleMasterId = "8";

                $scope.UserDetailObject.RoleName = "Driver";


            }

            $rootScope.Throbber.Visible = false;
        });
    }
    //#endregion

    //#region Radio Button control  compay Type

    $scope.ClickOnCompanyTypeRadioButton = function (companyType) {

        $scope.UserDetailObject.ReferenceId = '';

        $scope.LoadAllCompanyListByParentType(companyType);
        $scope.LoadRoleMasterByCompanyType(companyType);
    }
    //#endregion



    //#region Edit Login

    $scope.EditLogin = function (loginId) {


        var requestData =
        {
            ServicesAction: 'LoadLoginDetailByLoginId',
            LoginId: loginId
        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };


        $rootScope.Throbber.Visible = true;

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            if (response.data != undefined) {
                if (response.data.Json != undefined) {

                    var login = response.data.Json.Login;

                    debugger

                    $scope.AddForm();




                    $scope.UserDetailObject.LoginId = login.LoginId;
                    // $scope.LoginId = login.LoginId;
                    $scope.UserDetailObject.Name = login.Name;
                    $scope.UserDetailObject.UserProfilePicture = login.UserProfilePicture;
                    $scope.UserDetailObject.ReferenceId = login.ReferenceId;
                    $scope.UserDetailObject.ReferenceType = login.ReferenceType;
                    $scope.UserDetailObject.CompanyName = login.CompanyName;
                    $scope.UserDetailObject.RoleMasterId = login.RoleMasterId;
                    $scope.UserDetailObject.DefaultLanguage = login.DefaultLanguage;
                    $scope.UserDetailObject.UserName = login.UserName;
                    $scope.UserDetailObject.LicenseType = login.LicenseType;
                    $scope.UserDetailObject.RoleName = login.RoleName;
                    $scope.LoadRoleMasterByCompanyType($scope.UserDetailObject.ReferenceType);


                    $scope.UserDetailObject.LicenseNumber = login.LicenseNumber;
                    if (login.DocumentInformationList !== undefined && login.DocumentInformationList !== null) {
                        $scope.UserDetailObject.DocumentInformationList = login.DocumentInformationList;
                    }
                    if (login.ContactInformationList !== undefined && login.ContactInformationList !== null) {
                        $scope.UserDetailObject.ContactInformationList = login.ContactInformationList;
                    }

                }
            }



            $rootScope.Throbber.Visible = false;


        });





    }
    //#endregion


    $scope.IsSaveAccessControl = false;


    $rootScope.EditUserId = 0;



    $scope.AddForm = function () {

        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.FirstTab = true;
        $scope.SecondTab = false;
        $rootScope.DocumentAction = 'Clear';
        $scope.InitalizeUserDetail();

        $scope.LoadDirectiveForLoginGrid = false;

    }








    $scope.ViewForm = function () {

        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.FirstTab = true;
        $scope.SecondTab = false;
        $scope.InitalizeUserDetail();

        $scope.LoadDirectiveForLoginGrid = true;
        //gridCallBack();
    }
    $scope.ViewForm();

    $scope.DeleteUser = function (id) {
        var requestData =
        {
            ServicesAction: 'DeleteUser',
            UserId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            gridCallBack();
        });
    }



    $scope.SaveAndLoadUserAccess = function () {

        if ($scope.UserDetailObject.Name !== "") {
            if ($scope.UserDetailObject.RoleMasterId !== "") {
                $rootScope.Throbber.Visible = true;

                $scope.LoadPageAcessComponent = true;

                //$scope.EditRoleWisePageMappingList = $rootScope.PageDetails;


                $rootScope.Throbber.Visible = false;
                $scope.FirstTab = false;
                $scope.SecondTab = true;


            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_SelectRole), '', 3000);
                //$rootScope.ValidationErrorAlert(String.format("Please select role"), '', 3000);
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_SelectUserName), '', 3000);
            //$rootScope.ValidationErrorAlert(String.format("Please select User Name"), '', 3000);

            // $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_DriverName), '', 3000);
        }
    }

    $scope.Save = function () {
        debugger;
        var requestData =
        {
            ServicesAction: 'CreateLogin',
            Login: $scope.UserDetailObject
        };

        var consolidateApiParamater =
        {
            Json: requestData,
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            var data = response.data;

            var rolemasterid = 0;
            var loginid = 0;


            if (data != null) {

                var loginid = response.data.Json.LoginId;


                var RoleWisePageMappingList = $rootScope.PageDetails.filter(function (el) { return el.IsSelectedRow === true; });

                if (RoleWisePageMappingList.length != 0) {
                    for (var i = 0; i < RoleWisePageMappingList.length; i++) {

                        RoleWisePageMappingList[i].RoleMasterId = rolemasterid;
                        RoleWisePageMappingList[i].LoginId = loginid;


                        if (typeof RoleWisePageMappingList[i].RoleWiseFieldAccessList !== 'undefined') {
                            for (var j = 0; j < RoleWisePageMappingList[i].RoleWiseFieldAccessList.length; j++) {

                                RoleWisePageMappingList[i].RoleWiseFieldAccessList[j].RoleId = rolemasterid;

                                RoleWisePageMappingList[i].RoleWiseFieldAccessList[j].LoginId = loginid;



                            }
                        }
                    }

                }



                var RoleWisePageMapping = {
                    ServicesAction: "InsertAndUpdateRoleWisePageMappingAndRoleWiseFieldAccess",
                    RoleWisePageMappingList: RoleWisePageMappingList,

                };


                var jsonobject = {};
                jsonobject.Json = RoleWisePageMapping;

                GrRequestService.ProcessRequest(jsonobject).then(function (response) {

                    var taxdata = response.data;

                    //$scope.Clear();
                    $scope.ViewForm();



                    var ClearRoleWisePageMapping = {
                        ServicesAction: "ClearPageControlAccessCache"

                    };


                    var Clearjsonobject = {};
                    Clearjsonobject.Json = ClearRoleWisePageMapping;

                    GrRequestService.ProcessRequest(Clearjsonobject).then(function (Clearresponse) {
                    });


                });



            }







        });
    }




    $scope.SaveAccessControl = function () {

        $scope.IsSaveAccessControl = true;
        $scope.Save();
    }



    $scope.BackView = function () {

        $scope.FirstTab = true;
        $scope.SecondTab = false;

        $scope.LoadPageAcessComponent = false;
    }



    $scope.Clear = function () {

        $rootScope.EditRoleMasterId = 0;
        $scope.RoleMasterId = 0;

        for (var i = 0; i < $rootScope.PageDetails.length; i++) {
            $rootScope.PageDetails[i].IsActive = false;

        }
        $rootScope.selection = [];
    }

    $scope.CheckFileUploaded = function () {

        var filenotuploaded = true;
        if ($scope.UserDetailObject.UserProfilePicture === null || $scope.UserDetailObject.UserProfilePicture === undefined || $scope.UserDetailObject.UserProfilePicture === "" || $scope.UserDetailObject.UserProfilePicture === "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHQAdAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgYBBQcEA//EADsQAAIBAwEFAwcJCQAAAAAAAAABAgMEEQUGEiExUUGBoRUiYXKRweETFDI1UnOxstEjJCUzNEJidPD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO4gAAAAB5ri/tbZ4rVop/ZTy/YajV9WjPeo2zbS4Oalhd2OZo2wLT5dsuK3p98Xg8k9o0m922bXY3P4FfZFsC02OvUK81CtF0ZN4TbzF95tznzNtYa9UtbZUalJ1d1+bJzxw6cgLWDXaZq9DUG4RjKFRLLjLp6GbEAAAAAAAAAavaCvOjZKMHj5SW636DaGk2oeKFD13+AFeZFhsi2Blsi2GyLYBsi2GyIHv0SqqWqUJOagm93jyeeGP+9BeDnC+ksdTo6AAAAAAAAAGl2oj+6UZdKmPB/obor+0l7SlF2ai3UjJScuyPD4gV/JhsMi2AbIthsiwBhsNkWyj6UFvXFKPWcV4nRjnFvVVC5pVpR3lTnGbj1w8l+0+8pX1rG4o5UZZTT5prsIPSAAAAAAAAUrWc+VLnPPf9xdSvbR6ZVqVPndvBzysVIxWXw5MCutkWyVSM6cnGpGUJLmpLDR8wDMNhsi2UGyLYbItgGy47H58lzzy+WePYiq2tjdXkoxt6E5qTwpY83vfIvumWcbCypW0XncXGXV9rIPUAAAAAAAAAAKrtXauFzTuYrzai3Zesvh+BoWzoF/aQvbWdCpykuD6PsZQrqjO1uKlCrjfg8PAHybIthsi2UGzCy2lFNt8FgwywbKaZ8vV+fVuNOnLEI9Zde4CyaTafMtPo0H9KMfO9Z8WewAgAAAAAAB8q9zQt1mvWp0/WkkB9Qae42jsaWVTc6z/wAI4XtZq7nai4nwt6FOmusnvMC2FC19/wAZuvWX5UfO51S+uf5t1Ua+zF7q9iPE2AbIsMw2UGy6bH/VD+9l7ilNinWqUZb9GpOnLrCTTCOpA5/bbSanb4TrRqx6VY58VxNta7ZU3hXdrKPWVOWfBkVagay117TLnChd04yf9tTzH4myjJSSlFpp8mgMgADWa9fysbPNJpVaj3YN9nVlLqTlUm5zk5SfNyeWzf7YT/b20OxRk/FfoV1gGRbMtkGyg2RBhgGYYZFsINkGw2YbANkQYYBmy0HV6umXdPM27aUkqkOzHVelGrbIvkB17PQHm0yo62m2lWT4zowk++KBFV3a/wDraH3XvZoGABFkWAUYZFgBEWRYAEWRYAGGYZgARZFgAdT0P6msf9eH5UZAIr//2Q==") {
            filenotuploaded = true;
        } else {
            filenotuploaded = false;
        }
        return filenotuploaded;
    }


});