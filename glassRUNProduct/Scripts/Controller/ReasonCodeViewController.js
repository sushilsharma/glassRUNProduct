angular.module("glassRUNProduct").controller('ReasonCodeViewController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, GrRequestService) {

    //#region Reason Code Popup and Save Functionality 
    $rootScope.Action = "Clear";
    $rootScope.EnquiryDetailsForAction = [];
    $rootScope.ReasonCodeEnquiryId = "";

    $rootScope.ReasonCodeJson = {
        ReasonCode: '',
        ReasonDescription: '',
        ReasonCodeText: ''
    }

    $scope.InputObject = {};


    $rootScope.ReasonCodeList = [];
    $rootScope.LoadReasonCode = function (lookupCategory) {
        
        $scope.LookupCategoryValue = lookupCategory;
        var requestData =
            {
                ServicesAction: 'LoadReasonCodeList',
                LookupCategory: lookupCategory
            };

        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response != undefined) {
                if (response.data.ReasonCode != undefined) {
                    $rootScope.ReasonCodeList = response.data.ReasonCode.ReasonCodeList;
                }
                else {
                    $rootScope.ReasonCodeList = [];
                }
            }
            else { $rootScope.ReasonCodeList = []; }


        });

    };
    // $scope.LoadReasonCode();

    $scope.LoadReasonCodePopup = function () {

        $scope.ReasonCodeModalPopup = false;
    }
    $scope.LoadReasonCodePopup();

    $rootScope.OpenReasoncodepopup = function (object) {

        

        // $rootScope.LoadReasonCode();


        $scope.InputObject = object;

        //$rootScope.EnquiryDetailsForAction = enquiryDetails;
        //$rootScope.ReasonCodeEventName = eventName;
        $scope.ReasonCodeModalPopup = true;
        $rootScope.Throbber.Visible = false;
    }

    $rootScope.CloseReasoncodepopup = function () {
        
        $rootScope.ReasonCodeJson.ReasonCode = "";
        $rootScope.ReasonCodeJson.ReasonDescription = "";
        $scope.InputObject = {};
        $scope.ReasonCodeModalPopup = false;
        //  $state.reload();
    }



    $rootScope.AddReasonCode = function () {

        $rootScope.Action = "Add";
    }


    $rootScope.ClearReasonCodeAddButton = function () {
        debugger;
        $rootScope.Action = "Clear";
    }




    //$rootScope.SaveReasonCode = function () {
    //    

    //    if ($rootScope.ReasonCodeJson.ReasonCode !== "" && $rootScope.ReasonCodeJson.ReasonCode !== null) {
    //        $rootScope.Throbber.Visible = true;
    //        $scope.SaveReasonCodeWithAction($scope.InputObject);
    //    }
    //    else {
    //        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectReasonCode), 'error', 3000);
    //        $rootScope.Throbber.Visible = false;
    //    }

    //}

    $rootScope.SaveReasonCode = function (inputObject) {
        debugger;
        $rootScope.ReasonCodeEntered = false;
        if ($rootScope.Action === "Add") {
            $rootScope.ReasonCodeJson.ReasonCode = $scope.ReasonCodeJson.ReasonCodeText;
        }
        if ($rootScope.ReasonCodeJson.ReasonCode !== "" && $rootScope.ReasonCodeJson.ReasonCode !== null) {
            $rootScope.Throbber.Visible = true;
            $rootScope.ReasonCodeEntered = true;
            $scope.SaveReasonCodeWithAction(inputObject);
        }
        else {


            if ($rootScope.ReasonCodeJson.ReasonCode === "" || $rootScope.ReasonCodeJson.ReasonCode === null) {

                $rootScope.ReasonCodeEntered = false;
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectReasonCode), 'error', 3000);


            } else {

                //$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectReasonDescription), 'error', 3000);

            }


            $rootScope.Throbber.Visible = false;
        }

    }




    $scope.SaveReasonCodeWithAction = function (object) {
        debugger;
        var reasonCodeList = [];



        var objectlist = object.ObjectList;


        if (object.ObjectList.length != 0) {


            for (var i = 0; i < object.ObjectList.length; i++) {


                var reasonCode = {
                    ReasonCodeId: $rootScope.ReasonCodeJson.ReasonCode,
                    ReasonDescription: $rootScope.ReasonCodeJson.ReasonDescription,
                    ObjectId: object.ObjectList[i].ObjectId,
                    ObjectType: object.ObjectType,
                    EventName: object.ReasonCodeEventName,
                    LookupCategory: $scope.LookupCategoryValue,
                    Action: $rootScope.Action

                }
                reasonCodeList.push(reasonCode);
            }


            var requestData =
                {
                    ServicesAction: 'InsertReasonMappingCode',
                    ReasonCodeList: reasonCodeList
                };
            var consolidateApiParamater =
                {
                    Json: requestData,
                };
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


                //if ($rootScope.ReasonCodeEventName === "UpdateBranchPlant") {
                //    $scope.UpdateBranchPlantSelectedEnquiry();
                //} else if ($rootScope.ReasonCodeEventName === "RejectEnquiry") {
                //    $scope.RejectEnquiry(enquiryList);
                //} else {



                //}
                debugger;
                $rootScope.ReasonCodeId = $rootScope.ReasonCodeJson.ReasonCode;
                $scope[object.FunctionName](object.FunctionParameter);
                $rootScope.Throbber.Visible = false;
                $rootScope.CloseReasoncodepopup();
                $rootScope.Action = "Clear";
                $scope.ReasonCodeJson.ReasonCodeText = "";
            });

        }



    }

    //$("#cart").on('hide', function () {
    //    window.location.reload();
    //});

    //$state.reload();

    //#endregion
});