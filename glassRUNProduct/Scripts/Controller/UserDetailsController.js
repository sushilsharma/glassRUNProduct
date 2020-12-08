angular.module("glassRUNProduct").controller('UserDetailsController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {


    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = false;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    };
    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_UserDetailPage;


    $scope.IsSaveAccessControl = false;


    $rootScope.FileUploadJSON = {
        FileName: '',
        FileSrc: '',
        FileFormat: ''

    }


    $rootScope.ngFileAllowextension = 'pdf,jpg,png';
    $rootScope.ngFileAllowsize = '3';




    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }
    $rootScope.EditUserId = 0;

    $scope.UserImage = {
        UserPhoto: "Images/download.jpg",
        Photo: "Images/download.jpg"
    }

    $scope.fileupload = {
        File: ''
    }

    $scope.EditFileupload = {
        Name: '',
        Base64Data: ''
    }

    $scope.UserInfo = {
        Name: "",
        IDCard: "",
        MobileNumber: "",
        Email: "",
        DocumentName: "",
        RoleMasterId: 0
    }

    $scope.AddForm = function () {

        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.FirstTab = true;
        $scope.SecondTab = false;
    }



    $scope.LoadRoleMaster = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'LoadAllRoleMaster'

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data != undefined) {
                if (response.data.Json.RoleMasterList.length > 0) {

                    $scope.RoleMasterList = response.data.Json.RoleMasterList;
                    $rootScope.Throbber.Visible = false;
                }


            }
        });

    }


    $scope.LoadAllUserLoginDetails = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'LoadAllUserLoginDetails'

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.ProfileList.length > 0) {

                    $scope.UserDetailsList = response.data.Json.ProfileList;
                    $rootScope.Throbber.Visible = false;
                }


            }
        });

    }

    $scope.LoadRoleMaster();
    $scope.LoadAllUserLoginDetails();
    $scope.ViewUserGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) { //You can get the current page, pageSize etc off `e`.

                        var orderby = "";
                        var config = "";

                        var UserName = "";
                        var UserNameCriteria = "";

                        var EmailId = "";
                        var EmailIdCriteria = "";

                        var LicenseNumber = "";
                        var LicenseNumberCriteria = "";


                        var ContactNumber = "";
                        var ContactNumberCriteria = "";



                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };
                            for (var i = 0; i < options.data.filter.filters.length; i++) {
                                if (options.data.filter.filters[i].field === "UserName") {
                                    UserName = options.data.filter.filters[i].value;
                                    UserNameCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "EmailId") {
                                    EmailId = options.data.filter.filters[i].value;
                                    EmailIdCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "LicenseNumber") {
                                    LicenseNumber = options.data.filter.filters[i].value;
                                    LicenseNumberCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "ContactNumber") {
                                    ContactNumber = options.data.filter.filters[i].value;
                                    ContactNumberCriteria = options.data.filter.filters[i].operator;
                                }
                            }


                        }
                        var requestData =
                        {
                            ServicesAction: 'LoadUserProfile',
                            PageIndex: options.data.page - 1,
                            PageSize: 50,
                            OrderBy: "",
                            UserName: UserName,
                            UserNameCriteria: UserNameCriteria,
                            EmailId: EmailId,
                            EmailIdCriteria: EmailIdCriteria,
                            LicenseNumber: LicenseNumber,
                            LicenseNumberCriteria: LicenseNumberCriteria,
                            ContactNumber: ContactNumber,
                            ContactNumberCriteria: ContactNumberCriteria,
                            CarrierId: $rootScope.UserId,

                        };


                        var consolidateApiParamater =
                        {
                            Json: requestData,

                        };




                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;

                            if (resoponsedata.Json !== undefined) {
                                totalcount = resoponsedata.Json.ProfileList[0].TotalCount
                                ListData = resoponsedata.Json.ProfileList;

                                var inquiryList = {
                                    data: ListData,
                                    totalRecords: totalcount
                                }
                                $scope.GridData = inquiryList;
                                options.success(inquiryList);
                                $scope.values = options;
                            }
                            else {
                                var inquiryList = {
                                    data: [],
                                    totalRecords: 0
                                }
                                options.success(inquiryList);
                                $scope.values = options;
                            }




                            $rootScope.Throbber.Visible = false;
                        });

                    }
                },
                pageSize: 50,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true
            },
            filterable:
            {
                mode: "row"
            },
            selectable: "row",
            pageable:
            {
                pageSizes: [10, 50, 100]
            },
            sortable: true,
            groupable: true,
            columnMenu: true,
            mobile: true,
            dataBound: gridDataBound,
            columns: [


                { field: "UserName", title: "User Name", type: "string", filterable: { mode: "row", extra: false } },
                { field: "EmailId", title: "Email Address", type: "string", filterable: { mode: "row", extra: false } },
                { field: "ContactNumber", title: "ContactNumber", type: "string", filterable: { mode: "row", extra: false } },
                { field: "Name", title: "Driver Name", type: "string", filterable: { mode: "row", extra: false } },
                { field: "LicenseNumber", title: "License Number", type: "string", filterable: { mode: "row", extra: false } },
                { "template": "<button class=\"k-button\" ng-click=\"EditUser(#=ProfileId#)\"><i class='fa fa-pencil'></i></a>", "title": "Edit", "width": "6%" },
                { "template": "<button class=\"k-button\" ng-click=\"DeleteUser(#=ProfileId#)\"><i class='fa fa-trash'></i></a>", "title": "Delete", "width": "6%" },


            ],
        }
    function gridDataBound(e) {

        var grid = e.sender;
        if (grid.dataSource.total() == 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.ViewUserGrid.dataSource.transport.read($scope.values);
        }
    };


    $scope.ProfileId = 0;

    $scope.EditUser = function (profileId) {


        var requestData =
        {
            ServicesAction: 'LoadUserProfileByProfileId',
            ProfileId: profileId
        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data != undefined) {
                if (response.data.Json != undefined) {

                    $rootScope.EditUserId = response.data.Json.ItemList[0].LoginId;
                    $scope.IsDisabled = true;
                    $scope.ProfileId = response.data.Json.ItemList[0].ProfileId;
                    $scope.UserInfo.RoleMasterId = response.data.Json.ItemList[0].RoleMasterId;
                    $scope.UserInfo.Name = response.data.Json.ItemList[0].Name;
                    $scope.UserInfo.IDCard = response.data.Json.ItemList[0].UserName;
                    $scope.UserInfo.MobileNumber = response.data.Json.ItemList[0].ContactNumber;
                    $scope.UserInfo.Email = response.data.Json.ItemList[0].EmailId;
                    $scope.UserInfo.LicenseNumber = response.data.Json.ItemList[0].LicenseNumber;
                    $scope.UserImage.UserPhoto = response.data.Json.ItemList[0].UserProfilePicture;
                    $scope.UserImage.Photo = response.data.Json.ItemList[0].UserProfilePicture;
                    $scope.UserInfo.DocumentName = response.data.Json.ItemList[0].DocumentsList[0].DocumentName;
                    $scope.DocumentId = response.data.Json.ItemList[0].DocumentsList[0].DocumentsId;
                    $scope.EditFileupload.Name = response.data.Json.ItemList[0].DocumentsList[0].DocumentName;
                    $scope.EditFileupload.Base64Data = response.data.Json.ItemList[0].DocumentsList[0].DocumentBase64;

                    //  $scope.EditRoleWisePageMappingList = response.data.Json.ItemList[0].RoleWisePageMappingList;

                    $scope.AddForm();

                }
            }






        });

    }



    $scope.Clear = function () {


        $scope.UserInfo.Name = "";
        $scope.UserInfo.IDCard = "";
        $scope.UserInfo.MobileNumber = "";
        $scope.UserInfo.Email = "";
        $scope.UserInfo.LicenseNumber = "";
        $scope.UserImage.UserPhoto = "";
        $scope.fileupload.File = '';
        $scope.UserInfo.DocumentName = "";
        $scope.IsSaveAccessControl = false;
        $scope.EditRoleWisePageMappingList = [];
        $scope.UserInfo.RoleMasterId = 0;
        $scope.UserImage.UserPhoto = "Images/download.jpg";
        $scope.UserImage.Photo = "Images/download.jpg";
        angular.element("input[type='file']").val(null);
        angular.element('#btn2').triggerHandler('click');
        $scope.IsDisabled = false;
        $scope.ProfileId = 0;
    }


    $scope.Save = function () {


        if ($scope.UserInfo.Name !== "") {
            if ($scope.UserInfo.IDCard !== "") {

                var IsCheckPresent = false;
                if ($scope.ProfileId !== 0) {
                    IsCheckPresent = true;
                }
                else {
                    var IsUserNamePresent = $scope.UserDetailsList.filter(function (el) { return el.UserName === $scope.UserInfo.IDCard })
                    if (IsUserNamePresent.length == 0) {
                        IsCheckPresent = true;
                    }
                }

                if (IsCheckPresent) {
                    var photo;
                    if ($scope.UserImage.Photo == null) {
                        photo = $scope.UserImage.UserPhoto;
                    }
                    else {
                        photo = $scope.UserImage.Photo;
                        if (photo.base64 == undefined) {
                            photo = photo;
                        } else {
                            photo = photo.base64;
                        }
                        if (parseInt($scope.UserImage.Photo.size) > parseInt(524288)) {

                            $rootScope.toggleModelAlert('Maximum file size should be 500 kb.', "warning");

                            return false;
                        }
                    }






                    var logindata = {
                        RoleMasterId: $scope.UserInfo.RoleMasterId,
                        UserName: $scope.UserInfo.IDCard,
                        ProfileId: $scope.ProfileId,
                        Password: "123456",
                        HashedPassword: "",
                        PasswordSalt: "",
                        LoginAttempts: "",
                        AccessKey: "",
                        ChangePasswordonFirstLoginRequired: 1,
                        IsActive: 1,
                        CreatedBy: $rootScope.UserId

                    }
                    var fileName = "";
                    var fileData = "";
                    if ($scope.fileupload.File != undefined && $scope.fileupload.File != "") {
                        fileName = $scope.fileupload.File.dataFile.name;
                        fileData = $scope.fileupload.File.dataBase64;
                    } else {
                        fileName = $scope.EditFileupload.Name;
                        fileData = $scope.EditFileupload.Base64Data;
                    }

                    var document = {

                        DocumentName: fileName,
                        DocumentExtension: "Pdf",
                        DocumentBase64: fileData,
                        ObjectType: "Profile",
                        ObjectId: $scope.ProfileId,
                        IsActive: 1,
                        CreatedBy: $rootScope.UserId

                    }
                    var serviceaction = "";
                    if ($scope.ProfileId !== 0) {
                        serviceaction = 'UpdateUserProfile';
                    }
                    else {
                        serviceaction = 'SaveUserProfile';
                    }

                    var requestData =
                    {
                        ServicesAction: serviceaction,
                        Name: $scope.UserInfo.Name,
                        UserProfilePicture: photo,
                        ContactNumber: $scope.UserInfo.MobileNumber,
                        EmailId: $scope.UserInfo.Email,
                        LicenseNumber: $scope.UserInfo.LicenseNumber,
                        DriverId: $scope.UserInfo.IDCard,
                        ProfileId: $scope.ProfileId,
                        ParentUser: $rootScope.ProfileId,
                        ReferenceId: $rootScope.UserId,
                        ReferenceType: 0,
                        IsActive: 1,
                        CreatedBy: $rootScope.UserId,
                        Login: logindata,
                        Document: document

                    };


                    var consolidateApiParamater =
                    {
                        Json: requestData,

                    };




                    GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


                        var data = response.data;

                        var rolemasterid = 0;


                        if (data != null) {



                            var RoleWisePageMappingList = $rootScope.PageDetails;

                            if (RoleWisePageMappingList.length != 0) {
                                for (var i = 0; i < RoleWisePageMappingList.length; i++) {

                                    RoleWisePageMappingList[i].RoleMasterId = 0;
                                    RoleWisePageMappingList[i].LoginId = data.Json.LoginId;

                                    if (typeof RoleWisePageMappingList[i].RoleWiseFieldAccessList !== 'undefined') {
                                        for (var j = 0; j < RoleWisePageMappingList[i].RoleWiseFieldAccessList.length; j++) {

                                            RoleWisePageMappingList[i].RoleWiseFieldAccessList[j].RoleId = 0;

                                            RoleWisePageMappingList[i].RoleWiseFieldAccessList[j].LoginId = data.Json.LoginId;



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


                                $scope.Clear();
                                $scope.ViewForm();
                                $rootScope.LoadAllPages();
                                $scope.LoadAllUserLoginDetails();
                                $rootScope.ValidationErrorAlert('Record Saved Successfully.', 'error', 3000);

                            });



                        }


                    });
                }
                else {
                    //$rootScope.ValidationErrorAlert('UserName already present.', 'error', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_UserNamePresent), '', 3000);
                }
            }
            else {
                //$rootScope.ValidationErrorAlert('Please enter driver ID.', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_DriverID), '', 3000);

            }
        }
        else {
            //$rootScope.ValidationErrorAlert('Please enter driver name.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_DriverName), '', 3000);

        }

    }

    $scope.ViewForm = function () {

        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.FirstTab = true;
        $scope.SecondTab = false;
        $scope.Clear();
        gridCallBack();
    }
    $scope.ViewForm();


    $scope.DownlodDocument = function (documentId, documentType, documentName) {

        var orderRequestData =
        {

            ServicesAction: 'LoadObjectDocumentByObjectId',
            ObjectId: documentId,
            ObjectType: documentType

        }
        var jsonobject = {};
        jsonobject.Json = orderRequestData;
        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {

            var byteCharacters1 = response.data;
            if (response.data != undefined) {
                var byteCharacters = response.data;
                var blob = new Blob([byteCharacters], {
                    type: "application/Pdf"
                });

                if (blob.size > 0) {
                    var filName = documentName.split('.')[0] + ".Pdf";
                    saveAs(blob, filName);
                } else {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_DocumentNotGenerated), '', 3000);

                }
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_DocumentNotGenerated), '', 3000);
            }
        });

    }


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


    $ionicModal.fromTemplateUrl('templates/ControlLevelAccess.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ControlLevelAccessModalPopup = modal;
    });

    $scope.ClosePageControlAccessModalpopup = function () {

        $scope.SelectedPageId = 0;
        $scope.ControlLevelAccessModalPopup.hide();
    }


    $scope.SaveAndLoadUserAccess = function () {
        debugger;
        if ($scope.UserInfo.Name !== "") {
            if ($scope.UserInfo.IDCard !== "") {
                $rootScope.Throbber.Visible = true;
                $scope.LoadRoleAccess();
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_DriverID), '', 3000);
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserDetails_DriverName), '', 3000);
        }

    }

    $scope.SaveAccessControl = function () {

        $scope.IsSaveAccessControl = true;
        $scope.Save();
    }

    $scope.LoadRoleAccess = function () {

        debugger;

        var requestData =
        {
            ServicesAction: 'GetPageRoleWiseAccessDetailByRoleORUserIDFromUserPage',
            RoleId: $scope.UserInfo.RoleMasterId,
            LoginId: $scope.EditUserId
        };
        var jsonobject = {};
        jsonobject.Json = requestData;

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {




            var dataforRoleWisePageMappingList = response.data.Json.RoleWisePageMappingList;


            $rootScope.PageDetails = dataforRoleWisePageMappingList;


            for (var i = 0; i < $rootScope.PageDetails.length; i++) {

                if ($rootScope.PageDetails[i].IsActive == "1") {

                    $rootScope.PageDetails[i].IsActive = true;
                } else {
                    $rootScope.PageDetails[i].IsActive = false;

                }
            }

            $scope.EditRoleWisePageMappingList = $rootScope.PageDetails;

            //if (response.data != undefined) {

            //    if (response.data.Json != undefined) {
            //        $scope.EditRoleWisePageMappingList = response.data.Json.PageAccessList;
            //        for (var i = 0; i < $scope.EditRoleWisePageMappingList.length; i++) {
            //            $rootScope.toggleSelection($scope.EditRoleWisePageMappingList[i].PageId, true, $scope.EditRoleWisePageMappingList[i].AccessId, $scope.EditRoleWisePageMappingList[i].RoleWisePageMappingId, $scope.EditRoleWisePageMappingList[i].RoleWiseFieldAccessList);
            //        }
            //    } else {
            //        $scope.EditRoleWisePageMappingList = [];
            //    }

            //} else {
            //    $scope.EditRoleWisePageMappingList = [];
            //}

            $rootScope.Throbber.Visible = false;
            $scope.FirstTab = false;
            $scope.SecondTab = true;

        });

    }

    $scope.BackView = function () {

        $scope.FirstTab = true;
        $scope.SecondTab = false;
    }

    $scope.OpenPageControlAccessModalpopup = function (PageId) {



        var Page = $rootScope.PageDetails.filter(function (el) { return el.PageId === PageId; });
        Page[0].IsSelectedRow = true;
        if (typeof Page[0].RoleWiseFieldAccessList === "undefined") {

            $rootScope.ValidationErrorAlert("Control Level Access is not configuare for this page", 'success', 3000);

            return;
        }



        $scope.PageName = Page[0].PageName;

        $scope.SelectedPageId = PageId;


        if (Page[0].RoleWiseFieldAccessList.length != 0) {

            var PageControlList = Page[0].RoleWiseFieldAccessList;

            for (var i = 0; i < PageControlList.length; i++) {

                if (PageControlList[i].AccessId == "0") {

                    PageControlList[i].IsShowChecked = false;
                    PageControlList[i].IsEnableChecked = false;

                } else if (PageControlList[i].AccessId == "1") {

                    PageControlList[i].IsShowChecked = true;
                    PageControlList[i].IsEnableChecked = false;
                }
                else if (PageControlList[i].AccessId == "2") {

                    PageControlList[i].IsShowChecked = true;
                    PageControlList[i].IsEnableChecked = true;
                }


            }


            $scope.PageControlList = PageControlList;

            $scope.ControlLevelAccessModalPopup.show();


        }

    }

    $scope.RoleObjectPropertyMapping = [];
    $scope.SavePageControlAccess = function () {




        for (var i = 0; i < $scope.PageControlList.length; i++) {

            if ($scope.PageControlList[i].IsShowChecked == true && $scope.PageControlList[i].IsEnableChecked == true) {

                $scope.PageControlList[i].AccessId = "2";
            } else if ($scope.PageControlList[i].IsShowChecked == true && $scope.PageControlList[i].IsEnableChecked == false) {

                $scope.PageControlList[i].AccessId = "1";
            } else if ($scope.PageControlList[i].IsShowChecked == false && $scope.PageControlList[i].IsEnableChecked == false) {

                $scope.PageControlList[i].AccessId = "0";
            }



        }



        var Page = $rootScope.PageDetails.filter(function (el) { return el.PageId === $scope.SelectedPageId; })

        if (Page.length != 0) {

            Page[0].RoleWiseFieldAccessList = $scope.PageControlList;
        }

        $scope.ClosePageControlAccessModalpopup();

    }






});