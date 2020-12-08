angular.module("glassRUNProduct").controller('WorkflowRuleMappingController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {

    $scope.ActivityFormMappingList = {};
    $rootScope.EditedWorkflowRuleId = 0;
    $rootScope.ShowWorkFlowStep = false;
    $rootScope.AddWorkFlowStep = {
        StatusCode: 0,
        IsAutomated: false,
        ActivityFormMappingId: 0,
        FormName: "",
        Selected: false
    }

    $rootScope.LoadAllSelectedWorkflowSteps = function () {
        debugger;


        $rootScope.SelectedActivityList = $rootScope.ActivityList.filter(function (el) { return el.Selected === true; });

        var selectedactivity = $rootScope.SelectedActivityList.filter(function (el) { return parseInt(el.StatusCode) === parseInt($rootScope.AddWorkFlowStep.StatusCode) });
        if (selectedactivity.length > 0) {
            var ActivityRuleList = [];
            if ($rootScope.WorkflowRuleId != "") {
                var array = $rootScope.WorkflowRuleId.split(",");
                $.each(array, function (i) {
                    var activityrule = {
                        IsActive: true,
                        StatusCode: selectedactivity[0].StatusCode,
                        WorkFlowCode: $rootScope.WorkflowListData.WorkFlowCode,
                        WorkFlowRulesId: array[i],
                    }
                    ActivityRuleList.push(activityrule);
                });

                selectedactivity[0].WorkFlowStepRulesList = ActivityRuleList;
            }

        }

        $rootScope.uniqueHeader = [];
        var uniqueNames = [];
        for (i = 0; i < $rootScope.SelectedActivityList.length; i++) {
            if (uniqueNames.indexOf($rootScope.SelectedActivityList[i].Header.replace(/ /g, '')) === -1) {
                uniqueNames.push($rootScope.SelectedActivityList[i].Header.replace(/ /g, ''));
                var header = {
                    Header: $rootScope.SelectedActivityList[i].Header,
                    RowNumber: 1
                };
                $rootScope.uniqueHeader.push(header);
            }
        }

        for (var i = 0; i < uniqueNames.length; i++) {
            var selectedlist = $rootScope.SelectedActivityList.filter(function (el) { return el.Header.replace(/ /g, '') === uniqueNames[i].replace(/ /g, ''); });
            if (selectedlist.length > 0) {
                for (var j = 0; j < selectedlist.length; j++) {
                    if (j === 0) {
                        selectedlist[j].isLast = false;
                        selectedlist[j].isFirst = true;
                    } else if (j === selectedlist.length - 1) {
                        selectedlist[j].isLast = true;
                        selectedlist[j].isFirst = false;
                    } else {
                        selectedlist[j].isFirst = false;
                        selectedlist[j].isLast = false;
                    }
                    selectedlist[j].SequenceNo = j + 1;
                }
                if (selectedlist.length === 1) {
                    selectedlist[0].isLast = true;
                    selectedlist[0].isFirst = true;
                }

            }
        }
    }


    $scope.SetIsAutomated = function (status) {
        $rootScope.AddWorkFlowStep.IsAutomated = status;
    }


    $scope.SaveWorkFlowStepProperty = function () {



        if ($rootScope.AddWorkFlowStep.StatusCode != 0) {

            var checkActivitySelected = $rootScope.SelectedActivityList.filter(function (el) { return parseInt(el.StatusCode) === $rootScope.AddWorkFlowStep.StatusCode });
            if (checkActivitySelected.length > 0) {

                checkActivitySelected[0].IsAutomated = $rootScope.AddWorkFlowStep.IsAutomated;
                checkActivitySelected[0].ActivityFormMappingId = $rootScope.AddWorkFlowStep.ActivityFormMappingId;

                if ($scope.ActivityFormMappingList.length > 0) {
                    var formSelected = $scope.ActivityFormMappingList.filter(function (e2) { return e2.ActivityFormMappingId === $rootScope.AddWorkFlowStep.ActivityFormMappingId; });
                    if (formSelected.length > 0) {
                        checkActivitySelected[0].FormName = formSelected[0].FormName;
                    }
                    else {
                        checkActivitySelected[0].FormName = "";
                    }
                }


                //$rootScope.ValidationErrorAlert('Data Saved Successfully.', 'warning', 10000);

            }
        }


    }

    $scope.GetValue = function () {
        try {

            debugger;

            var message = "";
            var WorkflowStepList = [];


            var uniqueNames = [];
            for (i = 0; i < $rootScope.SelectedActivityList.length; i++) {
                if (uniqueNames.indexOf($rootScope.SelectedActivityList[i].Header.replace(/ /g, '')) === -1) {
                    uniqueNames.push($rootScope.SelectedActivityList[i].Header.replace(/ /g, ''));
                }
            }

            var k = 1;
            for (var j = 0; j < uniqueNames.length; j++) {
                var selectedlist = $rootScope.SelectedActivityList.filter(function (el) { return el.Header.replace(/ /g, '') === uniqueNames[j].replace(/ /g, ''); });
                if (selectedlist.length > 0) {

                    selectedlist = selectedlist.sort(function (a, b) { return a.SequenceNo - b.SequenceNo });
                    if (selectedlist.length > 0) {

                        for (var i = 0; i < selectedlist.length; i++) {

                            if (selectedlist[i].Selected) {

                                var ActivityId = selectedlist[i].ActivityId;
                                var StatusCode = selectedlist[i].StatusCode;
                                var ActivityName = selectedlist[i].ActivityName;
                                var IsAutomated = selectedlist[i].IsAutomated;
                                var ActivityFormMappingId = selectedlist[i].ActivityFormMappingId;

                                var FormName = selectedlist[i].FormName;

                                var ruleList = {
                                    StatusCode: StatusCode,
                                    ActivityName: ActivityName,
                                }

                                //var dd = selectedlist[i].WorkFlowStepRulesList;

                                var dd = [];
                                if (selectedlist[i].WorkFlowStepRulesList) {
                                    dd = selectedlist[i].WorkFlowStepRulesList;
                                }

                                var workflowStepObj = {
                                    StatusCode: StatusCode,
                                    ActivityName: ActivityName,
                                    WorkFlowCode: $rootScope.WorkflowListData.WorkFlowCode,
                                    IsAutomated: IsAutomated,
                                    ActivityFormMappingId: ActivityFormMappingId,
                                    FormName: FormName,
                                    SequenceNo: k,
                                    IsActive: true,
                                    WorkFlowStepRulesList: dd,
                                };
                                k = k + 1;
                                WorkflowStepList.push(workflowStepObj);

                            }
                        }

                    }

                }
            }


            for (var i = 0; i < WorkflowStepList.length; i++) {
                if (parseInt(WorkflowStepList[i].ActivityFormMappingId) === 0) {
                    $rootScope.ValidationErrorAlert($rootScope.resData.res_WorkflowPage_MissingFormValidation + " " + WorkflowStepList[i].ActivityName + '.', 'warning', 10000);
                    return false;
                }

            }



            var requestData =
            {

                ServicesAction: "InsertWorkFlowStep",
                WorkflowStepList: WorkflowStepList,
            };



            var consolidateApiParamater =
            {
                Json: requestData,
            };
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                $rootScope.WorkFinalValue.WorkflowRuleId = 0;
                $rootScope.ValidationErrorAlert('Data Saved Successfully.', 'warning', 10000);

                $rootScope.RedirectToRulePage = false;
                $rootScope.FirstTab = true;
                $rootScope.SecondTab = false;
                $rootScope.ThirdTab = false;
                $rootScope.FourthTab = false;


            });

        } catch (e) {

        }
    }


    $scope.BackFourthView = function () {


        $rootScope.FirstTab = false;
        $rootScope.SecondTab = false;
        $rootScope.ThirdTab = true;
        $rootScope.FourthTab = false;

    }




    $scope.CheckSelectedActivityClick = function (event, statuscode) {
        debugger;
        $rootScope.AddWorkFlowStep.StatusCode = statuscode;
        $rootScope.ShowWorkFlowStep = true;
        var checkActivitySelected = $rootScope.ActivityList.filter(function (el) { return parseInt(el.StatusCode) === statuscode; });

        if (checkActivitySelected.length > 0) {
            $rootScope.ActivityName = checkActivitySelected[0].ActivityName;
            checkActivitySelected[0].Selected = true;
            if (checkActivitySelected[0].Selected === true) {
                var WorkFlowStepRulesId = '0'
                if (checkActivitySelected[0].WorkFlowStepRulesList) {

                    for (var i = 0; i < checkActivitySelected[0].WorkFlowStepRulesList.length; i++) {
                        if (WorkFlowStepRulesId === '') {
                            WorkFlowStepRulesId = checkActivitySelected[0].WorkFlowStepRulesList[i].WorkFlowRulesId;
                        }
                        else {
                            WorkFlowStepRulesId = WorkFlowStepRulesId + ',' + checkActivitySelected[0].WorkFlowStepRulesList[i].WorkFlowRulesId;
                        }
                    }

                    $rootScope.EditedWorkflowRuleId = WorkFlowStepRulesId;
                }



                var requestData =
                {
                    ServicesAction: 'ActivityFormMappingByStatusCode',
                    StatusCode: statuscode
                };
                var consolidateApiParamater =
                {
                    Json: requestData,
                };
                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                    var selectedactivity = $rootScope.SelectedActivityList.filter(function (el) { return parseInt(el.StatusCode) === parseInt(statuscode) });
                    $rootScope.AddWorkFlowStep.IsAutomated = (selectedactivity[0].IsAutomated == '1');
                    if (response.data.Json != undefined && response.data.Json != null) {

                        $scope.ActivityFormMappingList = response.data.Json.ActivityFormMappingList;


                        if (selectedactivity.length > 0) {
                            $rootScope.AddWorkFlowStep.ActivityFormMappingId = selectedactivity[0].ActivityFormMappingId;

                            if ($scope.ActivityFormMappingList.length === 1 && (selectedactivity[0].ActivityFormMappingId == undefined || selectedactivity[0].ActivityFormMappingId == '0' || selectedactivity[0].ActivityFormMappingId == 0)) {
                                $rootScope.AddWorkFlowStep.ActivityFormMappingId = $scope.ActivityFormMappingList[0].ActivityFormMappingId;
                                $scope.SaveWorkFlowStepProperty();
                            }
                        }
                        else if ($scope.ActivityFormMappingList.length === 1) {
                            $rootScope.AddWorkFlowStep.ActivityFormMappingId = $scope.ActivityFormMappingList[0].ActivityFormMappingId;
                            $scope.SaveWorkFlowStepProperty();
                        }

                    }
                    else {
                        $scope.ActivityFormMappingList = {};
                        //$rootScope.AddWorkFlowStep.IsAutomated = false;
                    }



                });

            }
            else {
                $scope.ActivityFormMappingList = {};
                $rootScope.AddWorkFlowStep.IsAutomated = false;

            }
            $("div.checked").removeClass('shadow');
            $(event.currentTarget).addClass('shadow');
        }
    }


    $scope.AddRuleInWorkflow = function () {

        var checkActivitySelected = $rootScope.ActivityList.filter(function (el) { return parseInt(el.StatusCode) === parseInt($rootScope.AddWorkFlowStep.StatusCode); });
        var breadCrumb = "";
        if (checkActivitySelected.length > 0) {

            breadCrumb = $rootScope.WorkflowListData.WorkFlowName + " > " + checkActivitySelected[0].Header + " > " + checkActivitySelected[0].ActivityName + " > Rules ";

        }

        $rootScope.WorkflowBreadCrumb = breadCrumb;
        $rootScope.RedirectFrom = 'FinalRule';
        $rootScope.RedirectToRulePage = true;
        $rootScope.WorkFlowCode1 = $rootScope.WorkflowListData.WorkFlowCode;
        $rootScope.EditWorkFlowId = $rootScope.WorkflowListData.EditWorkFlowId;
        $rootScope.WorkflowRuleId = $rootScope.EditedWorkflowRuleId;

        $state.go("BusinessRulesEnginePage");

    }

    $scope.SetActivityProcessUp = function (headerName, statusCode, sequenceno) {


        var PreviousRow = $rootScope.SelectedActivityList.filter(function (el) { return el.Header.replace(/ /g, '') === headerName.replace(/ /g, '') && parseInt(el.SequenceNo) === parseInt(sequenceno) - 1 });
        if (PreviousRow.length > 0) {
            PreviousRow[0].SequenceNo = parseInt(PreviousRow[0].SequenceNo) + 1;
        }

        var selectedlist = $rootScope.SelectedActivityList.filter(function (el) { return el.Header.replace(/ /g, '') === headerName.replace(/ /g, '') && el.StatusCode === statusCode });
        if (selectedlist.length > 0) {
            selectedlist[0].SequenceNo = sequenceno - 1;
        }
        $scope.ResetFirstLastSequence(headerName);
    }

    $scope.SetActivityProcessDown = function (headerName, statusCode, sequenceno) {

		debugger;
        var PreviousRow = $rootScope.SelectedActivityList.filter(function (el) { return el.Header.replace(/ /g, '') === headerName.replace(/ /g, '') && parseInt(el.SequenceNo) === parseInt(sequenceno) + 1 });
        if (PreviousRow.length > 0) {
            PreviousRow[0].SequenceNo = parseInt(PreviousRow[0].SequenceNo) - 1;
        }

        var selectedlist = $rootScope.SelectedActivityList.filter(function (el) { return el.Header.replace(/ /g, '') === headerName.replace(/ /g, '') && el.StatusCode === statusCode });
        if (selectedlist.length > 0) {
            selectedlist[0].SequenceNo = sequenceno + 1;
        }
        $scope.ResetFirstLastSequence(headerName);
    }

    $scope.ResetFirstLastSequence = function (headerName) {

        var selectedlist = $rootScope.SelectedActivityList.filter(function (el) { return el.Header.replace(/ /g, '') === headerName.replace(/ /g, '') });
        if (selectedlist.length > 0) {
            for (var j = 0; j < selectedlist.length; j++) {
                if (selectedlist[j].SequenceNo === 1) {
                    selectedlist[j].isLast = false;
                    selectedlist[j].isFirst = true;
                } else if (selectedlist[j].SequenceNo === selectedlist.length) {
                    selectedlist[j].isLast = true;
                    selectedlist[j].isFirst = false;
                } else {
                    selectedlist[j].isFirst = false;
                    selectedlist[j].isLast = false;
                }
            }

        }

    }


});