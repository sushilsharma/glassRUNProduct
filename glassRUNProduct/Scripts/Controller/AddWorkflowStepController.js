angular.module("glassRUNProduct").controller('AddWorkflowStepController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {


    $scope.LoadGrid = false;
    //alert('5');
    //$rootScope.ActivityList = {};

    //#region Declare variable
    $scope.ClearControls = function () {
        $rootScope.WorkFinalValue.WorkFlowCode = '';
        $rootScope.WorkFinalValue.WorkFlowName = '';
        $scope.WorkFinalValue.FromDate = '';
        $scope.WorkFinalValue.ToDate = '';
        $rootScope.WorkFinalValue.ProcessType = '0';
        $rootScope.LoadAllActivityList();
    }


    $scope.ProcessTypeList = [];
    var typeList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ProcessType'; });
    if (typeList.length > 0) {

        $scope.ProcessTypeList = typeList;

    }

    $scope.Reset = function () {
        debugger;

        if ($rootScope.WorkflowListData.EditWorkFlowId !== undefined && $rootScope.WorkflowListData.EditWorkFlowId !== 0) {

            $rootScope.LoadAllActivityList();
            $scope.EditWorkFlow($rootScope.WorkflowListData.EditWorkFlowId)
        } else {

            $scope.ClearControls();
        }
    }
    $scope.CheckClick = function (statuscode) {




        $scope.ProcessflowSelection(statuscode, "false");
        //var checkActivitySelected = $rootScope.ActivityList.filter(function (el) { return parseInt(el.StatusCode) === statuscode; });

        //if (checkActivitySelected.length > 0) {

        //    if (checkActivitySelected[0].Selected === true) {
        //        var requestData =
        //            {
        //                ServicesAction: 'ActivityFormMappingByStatusCode',
        //                StatusCode: statuscode
        //            };
        //        var consolidateApiParamater =
        //            {
        //                Json: requestData,
        //            };
        //        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
        //            
        //            if (response.data.Json != undefined && response.data.Json != null) {

        //                $scope.ActivityFormMappingList = response.data.Json.ActivityFormMappingList;
        //            }
        //            else {
        //                $scope.ActivityFormMappingList = {};
        //            }



        //        });

        //        $scope.ProcessflowSelection(statuscode);

        //    }
        //    else {
        //        $scope.ActivityFormMappingList = {};
        //        $scope.ProcessflowSelection(statuscode);
        //    }
        //}

    }

    $rootScope.LoadStartDatePicker = function () {
        debugger;
        var control = document.getElementById("FromDate");
        $(control).datepicker({
            onSelect: function (dateText, inst) {

                if (inst.id != undefined) {
                    angular.element($('#' + inst.id)).triggerHandler('input');
                    $scope.GetScheduleDate(dateText);
                }

            },
            minDate: new Date(),
            dateFormat: 'dd/mm/yy',
            numberOfMonths: 1,
            isRTL: $('body').hasClass('rtl') ? true : false,
            prevText: '<i class="fa fa-angle-left"></i>',
            nextText: '<i class="fa fa-angle-right"></i>',
            showButtonPanel: false,


        });

        if ($rootScope.WorkFinalValue.FromDate !== "" && $rootScope.WorkFinalValue.FromDate !== undefined) {
            var fromdate = $rootScope.WorkFinalValue.FromDate.split('/');
            var fromdatevalue = fromdate[1] + "/" + fromdate[0] + "/" + fromdate[2];
            $scope.GetScheduleDate(fromdatevalue);
        }
    }


    $rootScope.ClearRule = function () {
    }


    $rootScope.SaveThenRuleFunctionOutput = function () {



        //if ($rootScope.FinalValue.FunctionType === "AddDays") {
        if (($rootScope.WorkFinalValue.WorkFlowCode !== "" && $rootScope.WorkFinalValue.WorkFlowCode != undefined) &&
            //($rootScope.WorkFinalValue.WorkFlowRule !== "" && $rootScope.WorkFinalValue.WorkFlowRule != undefined) &&
            ($rootScope.WorkFinalValue.WorkFlowName !== "" && $rootScope.WorkFinalValue.WorkFlowName != undefined)) {
            $rootScope.WorkFinalValue.FinalOutputValue = "True";

        } else {
            if ($rootScope.WorkFinalValue.WorkFlowCode === "" || $rootScope.WorkFinalValue.WorkFlowCode == undefined) {
                $rootScope.ValidationErrorAlert(String.format("Please enter Workflow Code"), 'error', 3000);
                $rootScope.WorkFinalValue.FinalOutputValue = "";
            }
            //else if ($rootScope.WorkFinalValue.WorkFlowRule === "" || $rootScope.WorkFinalValue.WorkFlowRule == undefined) {
            //    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_WorkflowPage_WorkFlowRule), 'error', 3000);
            //}
            else if ($rootScope.WorkFinalValue.WorkFlowName === "" || $rootScope.WorkFinalValue.WorkFlowName == undefined) {
                $rootScope.ValidationErrorAlert(String.format("Please enter Workflow Name"), 'error', 3000);
                $rootScope.WorkFinalValue.FinalOutputValue = "";
            }
        }

        var selectedWorkflowActivity = $rootScope.ActivityList.filter(function (el) { return el.Selected === true; });
        if (selectedWorkflowActivity.length === 0) {

            $rootScope.ValidationErrorAlert(String.format("Please select Workflow Steps"), 'error', 3000);
            $rootScope.WorkFinalValue.FinalOutputValue = "";
        }

        //} else if ($rootScope.FinalValue.FunctionType === "literal") {
        //    if ($rootScope.FinalValue.FinalThenValue !== "") {
        //        $rootScope.WorkFinalValue.FinalOutputValue = $rootScope.WorkFinalValue.FinalThenValue;

        //    } else {
        //        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_RuleEnginePage_PleaseEnterValue), 'error', 3000);
        //    }
        //}
    }


    $scope.CreateMainRule = function () {

        $scope.SaveThenRuleFunctionOutput();

        if ($scope.WorkFinalValue.FinalOutputValue != "") {


            var breadCrumb = "";

            breadCrumb = $rootScope.WorkFinalValue.WorkFlowName + " > Rules ";

            $rootScope.WorkflowBreadCrumb = breadCrumb;

            $rootScope.RedirectFrom = 'MainRule';
            $rootScope.RedirectToRulePage = true;
            if ($rootScope.WorkFinalValue.WorkflowRuleId === undefined || $rootScope.WorkFinalValue.WorkflowRuleId === '0' || $rootScope.WorkFinalValue.WorkflowRuleId === 0) {
                $rootScope.WorkflowRuleId = 0;
            }
            else {
                $rootScope.WorkflowRuleId = $rootScope.WorkFinalValue.WorkflowRuleId;
            }

            $state.go("BusinessRulesEnginePage");
        }
    }



    $rootScope.GetScheduleDate = function (date) {
        debugger;
        $('#ToDate').each(function () {

            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');

                    }

                },
                minDate: date,
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });
    }



    $scope.onChangeWorkflowCode = function () {


        var workflowcode = $rootScope.WorkFinalValue.WorkFlowCode;
        var requestData =
        {
            ServicesAction: 'CheckWorkflowExist',
            WorkFlowCode: workflowcode
        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined && response.data.Json != null) {

                if ($rootScope.WorkflowListData.EditWorkFlowId !== undefined && $rootScope.WorkflowListData.EditWorkFlowId !== 0) {

                    if ($rootScope.WorkflowListData.EditWorkFlowId != response.data.Json.WorkFlowId) {

                        $rootScope.ValidationErrorAlert('WorkFlow Code "' + $rootScope.WorkFinalValue.WorkFlowCode + '" already exists. Please try new Code.', 'warning', 10000);
                        $rootScope.WorkFinalValue.WorkFlowCode = "";

                    }

                }
                else {

                    $rootScope.ValidationErrorAlert('WorkFlow Code "' + $rootScope.WorkFinalValue.WorkFlowCode + '" already exists. Please try new Code.', 'warning', 10000);
                    $rootScope.WorkFinalValue.WorkFlowCode = "";

                }


            }
            else {

            }



        });

    };


    $scope.ProcessflowSelection = function (statuscode, OnLoad) {

        debugger;
        var possiblesteps = [];
        var dependentsteps = [];
        var checkActivitySelected = $rootScope.ActivityList.filter(function (el) { return parseInt(el.StatusCode) === statuscode; });

        if (checkActivitySelected.length > 0) {
            if (checkActivitySelected[0].ActivityPossibleStepsList !== undefined) {
                if (checkActivitySelected[0].ActivityPossibleStepsList.length > 0) {
                    possiblesteps = checkActivitySelected[0].ActivityPossibleStepsList;
                }
            }
            if (checkActivitySelected[0].Selected === true) {
                for (var i = 0; i < possiblesteps.length; i++) {
                    var checkActivitySetSelected = $rootScope.ActivityList.filter(function (el) { return parseInt(el.StatusCode) === parseInt(possiblesteps[i].PossibleStatusCode); });
                    if (checkActivitySetSelected.length > 0) {
                        checkActivitySetSelected[0].IsPossibleStep = "true";
                    }
                }
            } else {
                if (OnLoad === 'false') {
                    $scope.RemovePossibleSteps(statuscode, OnLoad);
                }
            }
        }
    }

    $scope.RemovePossibleSteps = function (statuscode, OnLoad) {


        var checkpossiblestepofanyotheractivity = $scope.AllPossibleSteps.filter(function (el) { return parseInt(el.CurrentStatusCode) === parseInt(statuscode); });
        if (checkpossiblestepofanyotheractivity.length > 0) {

            var isTrue = "false";

            for (var j = 0; j < checkpossiblestepofanyotheractivity.length; j++) {

                var otherStepExits = false;
                var checkOtherPossibleExits = $scope.AllPossibleSteps.filter(function (el) { return parseInt(el.PossibleStatusCode) === parseInt(checkpossiblestepofanyotheractivity[j].PossibleStatusCode) && parseInt(el.CurrentStatusCode) != parseInt(statuscode); });
                for (var k = 0; k < checkOtherPossibleExits.length; k++) {
                    var checkActivitySetSelected = $rootScope.ActivityList.filter(function (el) { return parseInt(el.StatusCode) === parseInt(checkOtherPossibleExits[k].CurrentStatusCode); });
                    if (checkActivitySetSelected.length > 0) {
                        if (checkActivitySetSelected[0].Selected == true || checkActivitySetSelected[0].Selected == 'true') {
                            otherStepExits = true;
                            break;
                        }
                    }
                }

                if (!otherStepExits) {
                    var checkActivitySetSelected = $rootScope.ActivityList.filter(function (el) { return parseInt(el.StatusCode) === parseInt(checkpossiblestepofanyotheractivity[j].PossibleStatusCode); });
                    if (checkActivitySetSelected.length > 0) {
                        checkActivitySetSelected[0].IsPossibleStep = "false";
                        if (OnLoad !== "true") {
                            checkActivitySetSelected[0].Selected = "false";
                        }
                    }
                    $scope.RemovePossibleSteps(checkpossiblestepofanyotheractivity[j].PossibleStatusCode, OnLoad)
                }



            }



        } else {

        }




    }



    $rootScope.LoadAllActivityList = function () {


        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllActivity',
            WorkFlowCode: $rootScope.WorkflowListData.WorkFlowCode
        };
        var consolidateApiParamater =
        {
            Json: requestData,

        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data !== undefined) {
                if (response.data.Json !== undefined) {
                    ListData = response.data.Json.ActivityList;

                    $rootScope.ActivityList = ListData;

                    if ($rootScope.ActivityList.length > 0) {

                        if ($rootScope.ActivityList.length > 0) {


                            for (var i = 0; i < $rootScope.ActivityList.length; i++) {

                                if ($rootScope.ActivityList[i]["IsPossibleStep"] == "true") {
                                    $rootScope.ActivityList[i]["Selected"] = true;
                                }
                                else {
                                    $rootScope.ActivityList[i]["Selected"] = false;
                                }

                            }

                            if ($rootScope.SelectedRuleId !== 0) {
                                $rootScope.WorkFinalValue.WorkFlowCodeIsEnable = true;
                                $rootScope.WorkFinalValue.WorkFlowNameIsEnable = true;
                            }


                            $scope.AllPossibleSteps = $rootScope.ActivityList.map(function (p) { return p.ActivityPossibleStepsList; }).reduce(function (a, b) { return a.concat(b); });
                            $scope.AllPossibleSteps = $scope.AllPossibleSteps.filter(function (element) { return element !== undefined; });

                            for (var j = 0; j < $rootScope.ActivityList.length; j++) {
                                $scope.ProcessflowSelection(parseInt($rootScope.ActivityList[j]["StatusCode"]), "true");
                            }

                        } else {
                            $scope.AllPossibleSteps = [];
                        }


                        $rootScope.Throbber.Visible = false;
                    } else {

                        $rootScope.ActivityList = [];
                        $rootScope.Throbber.Visible = false;
                    }
                } else {

                    $rootScope.ActivityList = [];
                    $rootScope.Throbber.Visible = false;
                }
            }
        });
    };


    $rootScope.SaveWorkFlow = function () {

        debugger;
        var isTrue = true;
        //if ($scope.ShowTimePeriod === true) {
        //    if ($scope.FinalValue.RuleStartDate !== "" && $scope.FinalValue.RuleStartDate !== "") {
        //        isTrue = true;
        //    } else {
        //        isTrue = false;
        //    }
        //}
        //else {
        //    isTrue = true;
        //}

        if (isTrue === true) {

            $scope.SaveThenRuleFunctionOutput();

            if ($scope.WorkFinalValue.FinalOutputValue != "") {




                if ($rootScope.WorkFinalValue.FromDate !== "" && $rootScope.WorkFinalValue.FromDate !== undefined) {
                    var fromdate = $rootScope.WorkFinalValue.FromDate.split('/');
                    $scope.WorkFinalValue.StartDate = fromdate[1] + "/" + fromdate[0] + "/" + fromdate[2];
                }

                if ($rootScope.WorkFinalValue.ToDate !== "" && $rootScope.WorkFinalValue.ToDate !== undefined) {
                    var enddate = $rootScope.WorkFinalValue.ToDate.split('/');
                    $scope.WorkFinalValue.EndDate = enddate[1] + "/" + enddate[0] + "/" + enddate[2];
                }




                var serviceaction = "";
                if ($rootScope.WorkflowListData.EditWorkFlowId !== undefined && $rootScope.WorkflowListData.EditWorkFlowId !== 0) {
                    serviceaction = "UpdateWorkflow";
                } else {
                    serviceaction = "InsertWorkflow";
                }

                $rootScope.WorkFinalValue.WorkflowRuleId = $rootScope.WorkflowRuleId;


                if ($rootScope.WorkflowRuleId != undefined && $rootScope.WorkflowRuleId != 0) {

                    var WorkFlowRulesList = [];

                    if ($rootScope.WorkflowRuleId != "") {
                        var array = $rootScope.WorkflowRuleId.split(",");
                        $.each(array, function (i) {
                            var workFlowRule = {
                                WorkFlowCode: $rootScope.WorkFinalValue.WorkFlowCode,
                                RulesId: array[i],
                                IsActive: true,
                            }
                            WorkFlowRulesList.push(workFlowRule);
                        });

                    }
                }


                var requestData =
                {
                    WorkFlowId: $rootScope.WorkflowListData.EditWorkFlowId,
                    ServicesAction: serviceaction,
                    WorkFlowCode: $rootScope.WorkFinalValue.WorkFlowCode,
                    ProcessType: $rootScope.WorkFinalValue.ProcessType,
                    WorkFlowName: $rootScope.WorkFinalValue.WorkFlowName,
                    WorkFlowRule: $rootScope.WorkFinalValue.WorkFlowRule,
                    FromDate: $scope.WorkFinalValue.StartDate,
                    ToDate: $scope.WorkFinalValue.EndDate,
                    CreatedBy: $rootScope.UserId,
                    ModifiedBy: $rootScope.UserId,
                    IsActive: $rootScope.WorkFinalValue.IsActive,
                    //WorkFlowRulesList: WorkFlowRulesList,
                    WorkFlowRulesList: []
                };


                var consolidateApiParamater =
                {
                    Json: requestData,
                };

                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


                    if (response.data.Json.WorkFlowId === "-1") {
                        $rootScope.ValidationErrorAlert('Duplicate Record.', 'warning', 10000);
                    } else {

                        $rootScope.ClearRule();
                        $scope.RuleGridCallBack();
                        //if (serviceaction === "UpdateWorkflow") {
                        //    $rootScope.ValidationErrorAlert('WorkFlow Updated Successfully.', 'warning', 10000);
                        //} else if (serviceaction === "InsertWorkflow") {
                        //    $rootScope.ValidationErrorAlert('WorkFlow Saved Successfully.', 'warning', 10000);
                        //}
                        $rootScope.WorkflowListData.EditWorkFlowId = response.data.Json.WorkFlowId;
                        $rootScope.WorkflowListData.WorkFlowName = response.data.Json.WorkFlowName;
                        $rootScope.WorkflowListData.WorkFlowCode = response.data.Json.WorkFlowCode;
                        $rootScope.ShowWorkFlowStep = false;
                        $("div.checked").removeClass('shadow');
                        $rootScope.RedirectFrom = '';
                        $rootScope.RedirectToRulePage = false;
                        $rootScope.WorkflowRuleId = 0;


                        $rootScope.addnewrulediv = false;
                        $rootScope.FirstTab = false;
                        $rootScope.SecondTab = false;
                        $rootScope.ThirdTab = false;
                        $rootScope.FourthTab = true;
                        $rootScope.LoadAllSelectedWorkflowSteps();
                    }


                });
            }
            //else {
            //    $rootScope.ValidationErrorAlert('All fields are mandatory.', 'warning', 10000);
            //}




        } else {
            $rootScope.ValidationErrorAlert('Please Select From Date And End Date.', 'warning', 10000);
        }



    }


    $rootScope.BackThirdView = function () {


        $rootScope.FirstTab = true;
        $rootScope.SecondTab = false;
        $rootScope.ThirdTab = false;
        $rootScope.FourthTab = false;
        $scope.CloseDeleteConfirmationModalPopup();
    }


    $scope.DeleteConfirmationModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/DeleteConfirmation.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {

            $scope.DeleteConfirmationPopup = modal;
        });
    }
    $scope.DeleteConfirmationModalPopup();
    $scope.OpenDeleteConfirmationModalPopup = function () {

        $scope.DeleteConfirmationPopup.show();
    }

    $scope.CloseDeleteConfirmationModalPopup = function () {

        $scope.DeleteConfirmationPopup.hide();
    }


    $rootScope.CancelWorkflowStepController = function () {


        $scope.OpenDeleteConfirmationModalPopup();

    }

    $scope.LoadActivity = function () {

        $rootScope.LoadAllActivityList();
    }

});