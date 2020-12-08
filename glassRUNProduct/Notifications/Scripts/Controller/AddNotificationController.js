angular.module("glassRUNProduct").controller('AddNotificationController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {


    // $scope.RuleObjectsList = [];
    $scope.LoginDetailsList = [];

    $scope.DocumentTypeList = [];


    $scope.EventDocumentList = [];
    $rootScope.NotificationHeader = $rootScope.resData.res_AddNotificationPage_Header;

    //$scope.NotificationHeader=$rootScope.resData.res_AddNotificationPage_Header;

    $scope.LoadDefaultSettingsValue = function () {


        var documentTypeList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'DocumentType'; });
        if (documentTypeList.length > 0) {
            $scope.DocumentTypeList = documentTypeList;
        }



    }
    $scope.LoadDefaultSettingsValue();





    $scope.companyType = "";
    $scope.disableControl = false;
    $scope.EmailToType = [
        {
            Id: 'BCC',
            Name: 'BCC'
        }, {
            Id: 'CC',
            Name: 'CC'
        }, {
            Id: 'To',
            Name: 'To'
        }];
    $scope.hideEmailtextbox = false;
    $scope.hideRecipientType = false;
    $scope.hidesubjectcolumn = false;
    $scope.txtHeaderName = "Enter Email ID";
    $scope.txtHeaderName = true;
    $scope.hideEmailidtextboxes = false;

    //$rootScope.RedirectNotificationToRulepage = false;
    //$rootScope.backToNotificationPage = false;



    $scope.SelectRoleMasterList = [];
    $scope.SelectLoginDetailsList = [];
    $scope.SortByListSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false
        //multiple:false

    }


    $ionicModal.fromTemplateUrl('WarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {


        $scope.DeleteWarningMessageControl = modal;
    });


    $scope.CloseDeleteConfirmation = function () {
        $scope.DeleteWarningMessageControl.hide();
    };

    $scope.OpenDeleteConfirmation = function () {

        $scope.DeleteWarningMessageControl.show();
    };


    $scope.changeobjectName = function () {

        var data = $scope.SelectRoleMasterList
        var result = 0;
        if ($scope.SelectRoleMasterList.length > 0) {
            $scope.GetAllLoginDetails($scope.SelectRoleMasterList[0].Id)
        }
        else {
            $scope.GetAllLoginDetails('-1')
        }
    }
    $scope.ObjectRoleMasterEvent = {

        onItemSelect: function (item) {
            debugger;

            var selectedId = item.Id
            $scope.SelectRoleMasterList = $scope.SelectRoleMasterList.filter(function (el) { return el.Id === selectedId });
            $scope.changeobjectName();
            $scope.SelectLoginDetailsList = [];
            $scope.hideEmailidtextboxes = true;
        },
        onItemDeselect: function (item) {
            //var selectedId = item.Id
            //$scope.SelectRoleMasterList = $scope.SelectRoleMasterList.filter(function (el) { return el.Id === selectedId });

            //alert("hi");
            $scope.SelectLoginDetailsList = [];
            $scope.changeobjectName();
            $scope.hideEmailidtextboxes = false;
        }
    }



    $scope.GetAllNotificationDetail = function () {
        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllContentNotificationsList'

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.NotificationsList.length > 0) {

                    $scope.NotificationsList = response.data.Json.NotificationsList;
                    console.log(JSON.stringify($scope.NotificationsList));
                    $rootScope.Throbber.Visible = false;
                }


            }
        });
    }
    $scope.GetAllNotificationDetail();
    $scope.ObjectUserSelectEvent = {
        onItemSelect: function (item) {


            var selectedId = item.Id
            $scope.SelectLoginDetailsList = $scope.LoginDetailsList.filter(function (el) { return el.Id === selectedId });
            // $scope.changeobjectName();
        },
        onItemDeselect: function (item) {
            //var selectedId = item.Id
            //$scope.SelectRoleMasterList = $scope.SelectRoleMasterList.filter(function (el) { return el.Id === selectedId });

            //alert("hi");
            //$scope.changeobjectName();
        }
    }

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    $scope.NotificationtypeChang = function (NotificationID) {

        $scope.UserEmailInfo = [];
        $scope.SelectRoleMasterList = [];
        $scope.SelectLoginDetailsList = [];
        $scope.hideEmailtextbox = false;
        var NotificationCode = "";
        var NotificationTypeCode = $rootScope.NotificationTypeMasterList.filter(function (el) { return el.Id === NotificationID });

        if (NotificationTypeCode.length > 0) {

            NotificationCode = NotificationTypeCode[0].Name;
        }
        else {
            $scope.NotificationTypeMasterinfo.NotificationTypeMasterId = "";
        }



        if (NotificationCode.toUpperCase() === "EMAIL") {
            $scope.hideEmailtextbox = false;
            $scope.txtHeaderName = false;
            $scope.hideRecipientType = false;
            $scope.hidesubjectcolumn = false;
            $scope.hideEmailbodytextbox = false;
            $scope.hideEmailidtextboxes = false;
        } else if (NotificationCode.toUpperCase() === "SMS") {
            $scope.hidesubjectcolumn = true;
            $scope.hideEmailtextbox = false;
            $scope.txtHeaderName = true;
            $scope.hideEmailbodytextbox = false;
            $scope.NotificationTypeMasterinfo.BodyContent = "";
            $scope.hideRecipientType = true;
        } else if (NotificationCode.toUpperCase() === "DEVICE" || NotificationCode.toUpperCase() === "PORTAL") {
            $scope.hideEmailtextbox = true;
            $scope.hideEmailbodytextbox = true;
            $scope.hidesubjectcolumn = false;
            $scope.NotificationTypeMasterinfo.BodyContent = "";
        }
        else {
            $scope.hideEmailbodytextbox = false;
            $scope.hideEmailtextbox = false;
            $scope.hideRecipientType = false;
            $scope.hidesubjectcolumn = false;
            $scope.txtHeaderName = true;
        }

    }



    $scope.GetAllGetAllRoleMasterDetails = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllRoleMasterDetails'

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.RoleMasterList.length > 0) {

                    $scope.RoleMasterList = response.data.Json.RoleMasterList;
                    console.log(JSON.stringify($scope.RoleMasterList));
                    $rootScope.Throbber.Visible = false;
                }


            }
        });

    }

    $scope.GetAllLoginDetails = function (RoleMasterID) {

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllLoginDetails',
            RoleMasterId: RoleMasterID

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.LoginDetailsList.length > 0) {

                    $scope.LoginDetailsList = response.data.Json.LoginDetailsList;
                    $rootScope.Throbber.Visible = false;
                }


            }
            else {
                $rootScope.Throbber.Visible = false;
                $scope.LoginDetailsList = [];
            }
        });

    }

    $scope.OnEventchange = function (EventMasterId) {
        $scope.UserEmailInfo = [];
        $scope.GetEventMapingvariablesbyEventmasterId(EventMasterId);
    }
    $scope.GetEventMapingvariablesbyEventmasterId = function (EventMasterId) {
        debugger;
        $scope.ItemList = [];




        var requestData =
        {
            ServicesAction: 'GetEventMapingvariablesbyEventmasterId',
            EventMasterId: EventMasterId


        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.ItemList.length > 0) {

                    $scope.ItemList = response.data.Json.ItemList;
                    $rootScope.Throbber.Visible = false;
                }
                else {
                    $scope.GetAllEventMapingvariables();
                }


            }
            else {
                $scope.GetAllEventMapingvariables();
            }

        });

    }



    $scope.GetAllEventMapingvariables = function () {
        $scope.ItemList = [];




        var requestData =
        {
            ServicesAction: 'GetAllEventMapingvariables'



        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.ItemList.length > 0) {

                    $scope.ItemList = response.data.Json.ItemList;
                    $rootScope.Throbber.Visible = false;
                }


            }

        });

    }



    $scope.NotificationTypeMasterinfo = {
        EventContentId: "",
        EventMasterId: "",
        NotificationTypeMasterId: "",
        RoleMasterId: "",
        IsSpecific: "",
        LoginUserId: "",
        RecipientType: "",
        NotificationTitle: "",
        BodyContent: "",
        CustomEmailID: "",
    }

    $rootScope.LoadAllEventMasternDetails();
    $rootScope.GetAllNotificationTypeMasterDetails();
    $scope.GetAllGetAllRoleMasterDetails();
    //$scope.GetAllLoginDetails(RoleMasterID);

    $scope.EventContentId = 0;


    $rootScope.Clear = function () {
        debugger;
        $scope.EventContentId = 0;
        $scope.NotificationTypeMasterinfo.EventContentId = "";
        $scope.NotificationTypeMasterinfo.EventMasterId = "";
        $scope.NotificationTypeMasterinfo.NotificationTypeMasterId = "";
        $scope.NotificationTypeMasterinfo.RoleMasterId = "";
        $scope.NotificationTypeMasterinfo.IsSpecific = false;
        $scope.NotificationTypeMasterinfo.LoginUserId = "";
        $scope.NotificationTypeMasterinfo.RecipientType = "";
        $scope.NotificationTypeMasterinfo.NotificationTitle = "";
        $scope.NotificationTypeMasterinfo.BodyContent = "";
        $scope.NotificationTypeMasterinfo.CustomEmailID
        $scope.UserEmailInfo = [];
        $rootScope.EditNotificationTemplate = false;
        $scope.hideEmailtextbox = false;
        $scope.disableControl = false;
        $scope.SelectRoleMasterList = [];
        $scope.SelectLoginDetailsList = [];
        $scope.LoginDetailsList = [];
        $rootScope.EventContentIdEditmode = 0;
        $rootScope.backToNotificationPage = false;
        $rootScope.RedirectNotificationToRulepage = false;
        $rootScope.WorkFinalValue.WorkflowRuleId = 0;
        $rootScope.WorkflowRuleId = 0;
        $scope.ItemList = [];
        $scope.eventDocumentList = [];
        $scope.EventDocumentList = [];
        $rootScope.NotificationHeader = $rootScope.resData.res_AddNotificationPage_Header;
    }


    $scope.Save = function (IsRuleCreation) {

        debugger;
        if ($scope.NotificationTypeMasterinfo.EventMasterId !== "" && $scope.NotificationTypeMasterinfo.NotificationTypeMasterId !== "" && $scope.UserEmailInfo.length > 0) {

            if ($scope.NotificationTypeMasterinfo.NotificationTitle != "") {

                var Str = $rootScope.NotificationTypeMasterList.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.NotificationTypeMasterId; });

                var NotificationType = Str[0].Name;
                if (NotificationType !== 'DEVICE' && NotificationType !== 'PORTAL' && NotificationType !== 'SMS' && ($scope.NotificationTypeMasterinfo.NotificationTitle === "" || $scope.NotificationTypeMasterinfo.NotificationTitle === undefined)) {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateNotification_EnterSubject), '', 3000);
                    return false;
                }

                if (NotificationType !== 'DEVICE' && NotificationType !== 'PORTAL' && ($scope.NotificationTypeMasterinfo.BodyContent === "" || $scope.NotificationTypeMasterinfo.BodyContent === undefined)) {
                    //$rootScope.ValidationErrorAlert('Please Enter Body Content ', '', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateNotification_EnterBodyContent), '', 3000);
                    return false;

                }
                //if ($scope.NotificationTypeMasterinfo.BodyContent != "") {
                if ($rootScope.EditNotificationTemplate === true) {

                    serviceaction = 'UpdateEventContent';
                }
                else {
                    serviceaction = 'SaveEventContent';
                }


                if ($rootScope.WorkflowRuleId != undefined && $rootScope.WorkflowRuleId != 0) {
                    var EventContentRulesList = [];
                    if ($rootScope.WorkflowRuleId != "") {
                        var array = $rootScope.WorkflowRuleId.split(",");
                        $.each(array, function (i) {
                            var EventContentRule = {
                                EventContentId: $scope.EventContentId,//$rootScope.WorkFinalValue.WorkFlowCode,
                                RuleId: array[i],
                                IsActive: true,
                                CreatedBy: $rootScope.UserId
                            }
                            EventContentRulesList.push(EventContentRule);
                        });

                    }
                }

                var requestData =
                {
                    ServicesAction: serviceaction,
                    EventContentId: $scope.EventContentId,
                    EventMasterId: $scope.NotificationTypeMasterinfo.EventMasterId,
                    NotificationTypeMasterId: $scope.NotificationTypeMasterinfo.NotificationTypeMasterId,
                    Title: $scope.NotificationTypeMasterinfo.NotificationTitle,
                    BodyContent: $scope.NotificationTypeMasterinfo.BodyContent,
                    // RecipientType: $scope.NotificationTypeMasterinfo.RecipientType,
                    // Recipient: $scope.NotificationTypeMasterinfo.CustomEmailID,
                    // RoleMasterId: $scope.NotificationTypeMasterinfo.RoleMasterId,
                    EventRecipientList: $scope.UserEmailInfo,
                    EventContentRulesList: EventContentRulesList,
                    EventDocumentList: $scope.EventDocumentList,
                    PriorityTypeMasterId: 0,
                    IsActive: 1,
                    CreatedBy: $rootScope.UserId,
                    PageName: 'Create NotificationTemplate',
                    RoleId: $rootScope.RoleId,
                    UserId: $rootScope.UserId
                };
                var consolidateApiParamater =
                {
                    Json: requestData,
                };

                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                    if (response.data.Json != undefined) {
                        if (response.data.Json.EventContentId === "-1") {
                            $rootScope.ValidationErrorAlert('This Record Already Exist.', 'error', 3000);
                        }
                        else {

                            if (IsRuleCreation === true) {
                                $rootScope.EventContentIdEditmode = response.data.Json.EventContentId;
                                $rootScope.WorkFinalValue.WorkflowRuleId = response.data.Json.EventContentId;
                                $rootScope.AddWorkFlowStep.StatusCode = response.data.Json.EventContentId;
                                $rootScope.RedirectNotificationToRulepage = true;
                                $rootScope.backToNotificationPage = false;


                                var requestData =
                                {
                                    ServicesAction: 'EventContentRuleByEventContentId',
                                    EventContentId: $rootScope.EventContentIdEditmode,
                                };
                                var consolidateApiParamater =
                                {
                                    Json: requestData,
                                };

                                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                                    console.log(JSON.stringify(response.data.Json));
                                    if (response.data.Json !== undefined) {

                                        $rootScope.WorkflowRuleId = response.data.Json.EventContentRuleIdList[0].RuleIdes;
                                    }
                                    else {
                                        $rootScope.WorkflowRuleId = 0;
                                    }
                                });
                                $rootScope.WorkflowBreadCrumb = "Notification Rule Engine" + " > Rules ";
                                $rootScope.RedirectFrom = 'MainRule';
                                $rootScope.RedirectToRulePage = true;
                                $state.go("BusinessRulesEnginePage");

                            } else {
                                $rootScope.Clear();
                                $rootScope.gridCallBack();
                                $rootScope.BackView();
                                $rootScope.ValidationErrorAlert('Record Saved Successfully.', 'error', 3000);
                            }

                        }
                    }
                    else if (response.data.ErrorValidationMessage != undefined) {
                        $rootScope.ValidationErrorAlert(response.data.ErrorValidationMessage + String.format($rootScope.resData.res_ServerSideVlaidationMsg_View), '', 3000);
                        $rootScope.Throbber.Visible = false;
                    }

                });
                //} else {
                //    $rootScope.ValidationErrorAlert('Please Enter Body Content ', '', 3000);
                //}

            } else {
                //$rootScope.ValidationErrorAlert('Please Enter Subject ', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateNotification_EnterSubject), '', 3000);
            }
        }
        else {
            if ($scope.NotificationTypeMasterinfo.NotificationTypeMasterId === "") {
                //$rootScope.ValidationErrorAlert('Select Notification Type ', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateNotification_SelectNotificationType), '', 3000);
            }
            else {
                if ($scope.UserEmailInfo.length <= 0) {
                    //$rootScope.ValidationErrorAlert('Please All Fields ', '', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateNotification_EnterUserDetail), '', 3000);
                }
                else {
                    //$rootScope.ValidationErrorAlert('Please Select Event Type ', '', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateNotification_SelectEventType), '', 3000);
                }

            }


        }
    }

    $scope.UserEmailInfo = [];

    $scope.AddUserEmailToType = function () {
        debugger;


        var LoginDetails = $scope.SelectLoginDetailsList;
        var SelectRoleMasterId = $scope.SelectRoleMasterList;
        if ($scope.SelectRoleMasterList.length > 0) {
            $scope.NotificationTypeMasterinfo.RoleMasterId = $scope.SelectRoleMasterList[0].Id
            $scope.NotificationTypeMasterinfo.IsSpecific = $scope.NotificationTypeMasterinfo.IsSpecific;
        }
        else {
            $scope.NotificationTypeMasterinfo.RoleMasterId = "";
            $scope.NotificationTypeMasterinfo.IsSpecific = null;
        }

        if ($scope.SelectLoginDetailsList.length > 0) {
            $scope.NotificationTypeMasterinfo.LoginUserId = $scope.SelectLoginDetailsList[0].Id
        } else {
            $scope.NotificationTypeMasterinfo.LoginUserId = "";
        }



        if ($scope.NotificationTypeMasterinfo.EventMasterId !== "") {
            if ($scope.NotificationTypeMasterinfo.NotificationTypeMasterId !== "") {
                if ($scope.NotificationTypeMasterinfo.RoleMasterId !== "" || $scope.NotificationTypeMasterinfo.LoginUserId !== "" || $scope.NotificationTypeMasterinfo.CustomEmailID !== "") {
                    // if () {
                    if ($scope.validateEmailSemicolon($scope.NotificationTypeMasterinfo.CustomEmailID).length <= 0) {

                        var Str = $rootScope.NotificationTypeMasterList.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.NotificationTypeMasterId; });

                        var NotificationType = Str[0].Name;

                        if (NotificationType !== 'DEVICE' && NotificationType !== 'PORTAL' && NotificationType !== 'SMS' && ($scope.NotificationTypeMasterinfo.RecipientType === "" || $scope.NotificationTypeMasterinfo.RecipientType === undefined)) {
                            $rootScope.ValidationErrorAlert('Please Select Email To Type.', 'error', 3000);

                            return false;

                        }

                        //if ($scope.NotificationTypeMasterinfo.RecipientType !== "") {

                        if ($scope.NotificationTypeMasterinfo.CustomEmailID !== "") {
                            $scope.NotificationTypeMasterinfo.LoginUserId = "";
                            $scope.NotificationTypeMasterinfo.RoleMasterId = "";

                        }
                        else if ($scope.NotificationTypeMasterinfo.LoginUserId !== "") {
                            $scope.NotificationTypeMasterinfo.CustomEmailID = "";
                            $scope.NotificationTypeMasterinfo.RoleMasterId = "";
                        }
                        else {
                            $scope.NotificationTypeMasterinfo.LoginUserId = "";
                            $scope.NotificationTypeMasterinfo.CustomEmailID = ""
                        }
                        if ($scope.NotificationTypeMasterinfo.LoginUserId !== "") {
                            var userEmailInfoInDB = $scope.NotificationsList.filter(function (el) { return el.UserId === $scope.NotificationTypeMasterinfo.LoginUserId && el.EmailType === "To" && el.NotificationTypeMasterId === Str[0].NotificationTypeMasterId && el.EventMasterId === $scope.NotificationTypeMasterinfo.EventMasterId; });

                        }
                        else {
                            var userEmailInfoInDB = $scope.NotificationsList.filter(function (el) { return el.RoleMasterId === $scope.NotificationTypeMasterinfo.RoleMasterId && el.EmailType === "To" && el.NotificationTypeMasterId === Str[0].NotificationTypeMasterId && el.EventMasterId === $scope.NotificationTypeMasterinfo.EventMasterId; });
                        }
                        //if ($scope.NotificationTypeMasterinfo.RecipientType !== "" && $scope.UserEmailInfo.length > 0) {

                        var userEmailInfo = $scope.UserEmailInfo.filter(function (el) { return el.Role === $scope.NotificationTypeMasterinfo.RoleMasterId && el.UserId === $scope.NotificationTypeMasterinfo.LoginUserId && el.Email === $scope.NotificationTypeMasterinfo.CustomEmailID && el.EmailType === $scope.NotificationTypeMasterinfo.RecipientType; });
                        //}
                        if (userEmailInfoInDB.length == 0) {
                            if (userEmailInfo.length === 0) {
                                var rolename = "";
                                var username = "";
                                var UserName = [];
                                var EmailType = "";

                                var roleName = $scope.RoleMasterList.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.RoleMasterId; });
                                if ($scope.LoginDetailsList.length > 0) {
                                    UserName = $scope.LoginDetailsList.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.LoginUserId; });
                                } else {
                                    username = "";
                                }

                                var EmailTypeName = $scope.EmailToType.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.RecipientType; });



                                if (roleName.length > 0) {
                                    rolename = roleName[0].Name;
                                }
                                if (UserName.length > 0) {
                                    username = UserName[0].Name;
                                }

                                if (EmailTypeName.length > 0) {
                                    EmailType = EmailTypeName[0].Name
                                }

                                $scope.UserEmailType = {
                                    CurrentGuid: generateGUID(),
                                    EventRecipientId: 0,
                                    EventMasterId: $scope.NotificationTypeMasterinfo.EventMasterId,
                                    NotificationTypeMasterId: $scope.NotificationTypeMasterinfo.NotificationTypeMasterId,
                                    Role: $scope.NotificationTypeMasterinfo.RoleMasterId,
                                    RoleName: rolename,
                                    IsSpecific: $scope.NotificationTypeMasterinfo.IsSpecific,
                                    UserId: $scope.NotificationTypeMasterinfo.LoginUserId,
                                    UserName: username,
                                    Email: $scope.NotificationTypeMasterinfo.CustomEmailID,
                                    EmailType: $scope.NotificationTypeMasterinfo.RecipientType,
                                    EmailTypeName: EmailType,
                                    IsActive: 1,
                                    CreatedBy: $rootScope.UserId,
                                }
                                $scope.UserEmailInfo.push($scope.UserEmailType);
                                $scope.NotificationTypeMasterinfo.RoleMasterId = "";
                                $scope.NotificationTypeMasterinfo.IsSpecific = false;
                                $scope.NotificationTypeMasterinfo.LoginUserId = "";
                                $scope.NotificationTypeMasterinfo.CustomEmailID = "";
                                $scope.NotificationTypeMasterinfo.RecipientType = "";
                                $scope.SelectLoginDetailsList = [];
                                $scope.SelectRoleMasterList = [];
                                $scope.hideEmailidtextboxes = false;

                            } else {
                                $rootScope.ValidationErrorAlert('Record Already Exist.', 'error', 3000);
                            }
                        }
                        else {
                            $scope.OpenDeleteConfirmation();
                        }
                        //} else {
                        //    $rootScope.ValidationErrorAlert('Please Select Email To Type.', 'error', 3000);
                        //}
                    } else {
                        var NotificationCode = "";
                        var NotificationTypeCode = $rootScope.NotificationTypeMasterList.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.NotificationTypeMasterId; });

                        if (NotificationTypeCode.length > 0) {
                            NotificationCode = NotificationTypeCode[0].Name;
                        }
                        if (NotificationCode.toUpperCase() === "EMAIL") {
                            $rootScope.ValidationErrorAlert('Please Enter Valid Email ID.', 'error', 3000);
                        }
                        else if (NotificationCode.toUpperCase() === "SMS") {
                            $rootScope.ValidationErrorAlert('Please Enter Valid Mobile No.', 'error', 3000);
                        }

                    }
                    //} else {
                    //    $rootScope.ValidationErrorAlert('Please Select User.', 'error', 3000);
                    //}
                } else {
                    $rootScope.ValidationErrorAlert('Please Select Role.', 'error', 3000);
                }
            } else {
                $rootScope.ValidationErrorAlert('Please Select Notification Type.', 'error', 3000);
            }
        } else {
            $rootScope.ValidationErrorAlert('Please Select Event.', 'error', 3000);
        }
    }

    $scope.RemoveAddedEmailRecipient = function (id) {

        $scope.UserEmailInfo = $scope.UserEmailInfo.filter(function (el) { return el.CurrentGuid !== id; });
    }


    $scope.AddYesNotification = function () {
        debugger;
        var LoginDetails = $scope.SelectLoginDetailsList;
        var SelectRoleMasterId = $scope.SelectRoleMasterList;
        if ($scope.SelectRoleMasterList.length > 0) {
            $scope.NotificationTypeMasterinfo.RoleMasterId = $scope.SelectRoleMasterList[0].Id
            $scope.NotificationTypeMasterinfo.IsSpecific = $scope.NotificationTypeMasterinfo.IsSpecific;
        }
        else {
            $scope.NotificationTypeMasterinfo.RoleMasterId = "";
            $scope.NotificationTypeMasterinfo.IsSpecific = null;
        }

        if ($scope.SelectLoginDetailsList.length > 0) {
            $scope.NotificationTypeMasterinfo.LoginUserId = $scope.SelectLoginDetailsList[0].Id
        } else {
            $scope.NotificationTypeMasterinfo.LoginUserId = "";
        }






        // if () {
        if ($scope.validateEmailSemicolon($scope.NotificationTypeMasterinfo.CustomEmailID).length <= 0) {

            var Str = $rootScope.NotificationTypeMasterList.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.NotificationTypeMasterId; });

            var NotificationType = Str[0].Name;

            if (NotificationType !== 'DEVICE' && NotificationType !== 'PORTAL' && NotificationType !== 'SMS' && ($scope.NotificationTypeMasterinfo.RecipientType === "" || $scope.NotificationTypeMasterinfo.RecipientType === undefined)) {
                $rootScope.ValidationErrorAlert('Please Select Email To Type.', 'error', 3000);
                return false;

            }

            //if ($scope.NotificationTypeMasterinfo.RecipientType !== "") {

            if ($scope.NotificationTypeMasterinfo.CustomEmailID !== "") {
                $scope.NotificationTypeMasterinfo.LoginUserId = "";
                $scope.NotificationTypeMasterinfo.RoleMasterId = "";

            }
            else if ($scope.NotificationTypeMasterinfo.LoginUserId !== "") {
                $scope.NotificationTypeMasterinfo.CustomEmailID = "";
                $scope.NotificationTypeMasterinfo.RoleMasterId = "";
            }
            else {
                $scope.NotificationTypeMasterinfo.LoginUserId = "";
                $scope.NotificationTypeMasterinfo.CustomEmailID = ""
            }

            //}


            var rolename = "";
            var username = "";
            var UserName = [];
            var EmailType = "";

            var roleName = $scope.RoleMasterList.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.RoleMasterId; });
            if ($scope.LoginDetailsList.length > 0) {
                UserName = $scope.LoginDetailsList.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.LoginUserId; });
            } else {
                username = "";
            }

            var EmailTypeName = $scope.EmailToType.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.RecipientType; });



            if (roleName.length > 0) {
                rolename = roleName[0].Name;
            }
            if (UserName.length > 0) {
                username = UserName[0].Name;
            }

            if (EmailTypeName.length > 0) {
                EmailType = EmailTypeName[0].Name
            }

            $scope.UserEmailType = {
                CurrentGuid: generateGUID(),
                EventRecipientId: 0,
                EventMasterId: $scope.NotificationTypeMasterinfo.EventMasterId,
                NotificationTypeMasterId: $scope.NotificationTypeMasterinfo.NotificationTypeMasterId,
                Role: $scope.NotificationTypeMasterinfo.RoleMasterId,
                RoleName: rolename,
                IsSpecific: $scope.NotificationTypeMasterinfo.IsSpecific,
                UserId: $scope.NotificationTypeMasterinfo.LoginUserId,
                UserName: username,
                Email: $scope.NotificationTypeMasterinfo.CustomEmailID,
                EmailType: $scope.NotificationTypeMasterinfo.RecipientType,
                EmailTypeName: EmailType,
                IsActive: 1,
                CreatedBy: $rootScope.UserId,
            }
            $scope.UserEmailInfo.push($scope.UserEmailType);
            $scope.NotificationTypeMasterinfo.RoleMasterId = "";
            $scope.NotificationTypeMasterinfo.IsSpecific = false;
            $scope.NotificationTypeMasterinfo.LoginUserId = "";
            $scope.NotificationTypeMasterinfo.CustomEmailID = "";
            $scope.NotificationTypeMasterinfo.RecipientType = "";
            $scope.SelectLoginDetailsList = [];
            $scope.SelectRoleMasterList = [];
            $scope.hideEmailidtextboxes = false;
            $scope.CloseDeleteConfirmation();

        } else {
            var NotificationCode = "";
            var NotificationTypeCode = $rootScope.NotificationTypeMasterList.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.NotificationTypeMasterId; });

            if (NotificationTypeCode.length > 0) {
                NotificationCode = NotificationTypeCode[0].Name;
            }


        }
        //} else {
        //    $rootScope.ValidationErrorAlert('Please Select User.', 'error', 3000);
        //}



    }

    $rootScope.EventContentByEventmasterId = function (EventContentId) {

        if ($rootScope.EditNotificationTemplate === true) {

            $rootScope.NotificationHeader = $rootScope.resData.res_EditNotificationPage_Header;
        }
        else {
            $rootScope.NotificationHeader = $rootScope.resData.res_AddNotificationPage_Header;
        }

        $scope.UserEmailInfo = [];
        $scope.disableControl = true;
        debugger;
        var requestData =
        {
            ServicesAction: 'EventContentByEventmasterId',
            EventContentId: EventContentId,
        };


        var consolidateApiParamater =
        {
            Json: requestData,
        };


        $rootScope.Throbber.Visible = true;
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {



            if (response.data !== undefined) {
                var EventContentList = response.data.Json.EventContentList;

                $scope.EventContentId = EventContentList.EventContentId;
                $rootScope.EventContentIdEditmode = EventContentList.EventContentId;
                $scope.NotificationTypeMasterinfo.NotificationTitle = EventContentList.Title;
                $scope.NotificationTypeMasterinfo.BodyContent = EventContentList.BodyContent;
                $scope.NotificationTypeMasterinfo.EventMasterId = EventContentList.EventMasterId;
                $scope.NotificationTypeMasterinfo.NotificationTypeMasterId = EventContentList.NotificationTypeMasterId;
                var Str = $rootScope.NotificationTypeMasterList.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.NotificationTypeMasterId; });

                var NotificationType = Str[0].Name;

                if (NotificationType !== 'DEVICE' && NotificationType !== 'PORTAL') {
                    $scope.hideEmailtextbox = false;
                }
                else {
                    $scope.hideEmailtextbox = true;
                }
                if (EventContentList !== 0) {

                    $rootScope.FirstTab = false;
                    $rootScope.ThirdTab = true;
                    for (var i = 0; i < EventContentList.EventRecipientList.length; i++) {
                        var IsSpecific = false
                        if (EventContentList.EventRecipientList[i].IsSpecific === '1') {
                            IsSpecific = true;
                        }
                        else {
                            IsSpecific = false;
                        }
                        $scope.UserEmailType = {
                            CurrentGuid: generateGUID(),
                            EventRecipientId: EventContentList.EventRecipientList[i].EventRecipientId,
                            EventMasterId: $scope.NotificationTypeMasterinfo.EventMasterId,
                            NotificationTypeMasterId: $scope.NotificationTypeMasterinfo.NotificationTypeMasterId,
                            Role: EventContentList.EventRecipientList[i].Role,
                            RoleName: EventContentList.EventRecipientList[i].RoleName,

                            IsSpecific: IsSpecific,
                            UserId: EventContentList.EventRecipientList[i].UserId,
                            UserName: EventContentList.EventRecipientList[i].UserName,
                            Email: EventContentList.EventRecipientList[i].Email,
                            EmailType: EventContentList.EventRecipientList[i].EmailType,
                            EmailTypeName: EventContentList.EventRecipientList[i].EmailTypeName,
                            IsActive: 1,
                            CreatedBy: $rootScope.UserId,
                        }
                        $scope.UserEmailInfo.push($scope.UserEmailType);
                    }
                    $scope.GetEventMapingvariablesbyEventmasterId($scope.NotificationTypeMasterinfo.EventMasterId);

                    //load event document  lsit




                    if (EventContentList.EventDocumentList != undefined) {

                        $scope.EventDocumentList = EventContentList.EventDocumentList;

                    }



                    $rootScope.Throbber.Visible = false;




                } else {

                }


            }



        });

    }

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    function validateMobileNo(MobileNo) {
        var re = /[0-9 -()+{10}]+$/;
        return re.test(MobileNo);
        //  var status = re.test(MobileNo);
        //if ((MobileNo.length >= 10) && (status === true));
        //{
        //    return true;
        //}
    }

    $scope.validateEmailSemicolon = function (str) {

        // var str = "abc@abc.com;abc@abc.com; abc@a@bc.com ; abc@abc.com ;abc@abc.com;"
        var invalidEmails = [];
        if (str !== "" && str !== null && str !== undefined) {
            var NotificationCode = "";
            var NotificationTypeCode = $rootScope.NotificationTypeMasterList.filter(function (el) { return el.Id === $scope.NotificationTypeMasterinfo.NotificationTypeMasterId; });

            if (NotificationTypeCode.length > 0) {
                NotificationCode = NotificationTypeCode[0].Name;
            }
            if (NotificationCode.toUpperCase() === 'SMS') {
                var MObileNO = str.split(';');

                for (i = 0; i < MObileNO.length; i++) {
                    if (!validateMobileNo(MObileNO[i].trim())) {
                        invalidEmails.push(MObileNO[i].trim())
                    }
                }
            }
            else if (NotificationCode.toUpperCase() === 'EMAIL') {
                var emails = str.split(';');

                for (i = 0; i < emails.length; i++) {
                    if (!validateEmail(emails[i].trim())) {
                        invalidEmails.push(emails[i].trim())
                    }
                }
            }

            //else if (NotificationCode.toUpperCase() === 'DEVICE' || NotificationCode.toUpperCase() === 'PORTAL') {

            //}


        }
        return invalidEmails;

    }

    ValidateEmailToType = function () {

    }

    $scope.isNumberKey = function ($event) {

        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }

    $scope.filterValue = function ($event) {

        var regex = new RegExp("^[a-zA-Z0-9.;@]*$");

        var key = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);
        if (!regex.test(key)) {
            $event.preventDefault();
        }
    };

    $rootScope.AddWorkFlowStep = {
        StatusCode: 0,
        IsAutomated: false,
        ActivityFormMappingId: 0,
        FormName: "",
        Selected: false
    }
    $rootScope.WorkFinalValue = {
        WorkFlowId: 0,
        WorkflowRuleId: 0,
    }
    $scope.bindTemplate = function () {

        if ($rootScope.backToNotificationPage) {
            $rootScope.EditNotificationTemplate = true;
            $rootScope.RedirectNotificationToRulepage = false;
            $rootScope.EventContentByEventmasterId($rootScope.EventContentIdEditmode);
        }
    }
    $scope.bindTemplate();

});