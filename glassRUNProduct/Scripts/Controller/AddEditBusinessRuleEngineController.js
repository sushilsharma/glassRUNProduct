angular.module("glassRUNProduct").controller('AddEditBusinessRuleEngineController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {


    $scope.RuleObjectsList = [];
    $rootScope.ActivityListForFunction = [];
    $scope.companyType = "";
    //$scope.addnewrulediv = $rootScope.addnewrulediv;
    pluginsService.init();

    $rootScope.selectedValue = {
        Id: 2
    }



    $scope.radii = [{
        Id: 1,
        checked: false,
        name: "Yes"
    }, {
        Id: 2,
        checked: true,
        name: "No"
    }];

    $rootScope.ShowTimePeriod = false;
    $scope.handleRadioClick = function (radius) {


        if (radius.Id == 1) {
            $rootScope.ShowTimePeriod = true;
            $rootScope.selectedValue.Id = 1;
            setTimeout(function () {
                pluginsService.init();
            }, 500);

        } else {
            $rootScope.FinalValue.RuleStartDate = "";
            $rootScope.FinalValue.RuleEndDate = "";
            $rootScope.ShowTimePeriod = false;
            $rootScope.selectedValue.Id = 2;
        }


    };


    $scope.dotvalue = "";
    $scope.RuleFunctionFilterList = [];

    $rootScope.SelectedRuleType = 0;

    $rootScope.RuleListData = [];


    function generateGUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    $rootScope.AddDefaultRule = function (count) {


        var ruleId = generateGUID();
        $scope.NewConditionForRuleId = ruleId;
        var ruleObj = {
            RuleId: ruleId,
            ConditionNumber: count,
            ConditionType: "",
            ConditionList: [],
            ThenOutPutValue: ""
        };
        $rootScope.RuleListData.push(ruleObj);

        //$rootScope.RuleListData.EditRuleId = 0;

        if ($rootScope.RuleListData.length > 1) {

            var ruleData = $rootScope.RuleListData.filter(function (el) { return el.RuleId === ruleId; });
            $scope.AddDefaultCondition(ruleData[0].ConditionList, "", ruleData[0].ConditionList.length);

        } else {
            $scope.AddDefaultCondition($rootScope.RuleListData[0].ConditionList, "", $rootScope.RuleListData[0].ConditionList.length);
        }

    }



    $scope.AddDefaultCondition = function (ConditionList, conditionType, count) {
        var condition =
            {
                ConditionId: generateGUID(),
                ConditionCriteria: "",
                ConditionNumber: count,
                ObjectName: "",
                PropertyName: "",
                ComparisonValue: "",
                OutPutValue: "",
                ConditionType: conditionType,
                ObjectPropertiesList: []
            }
        ConditionList.push(condition);
    }


    $rootScope.AddDefaultRule(1);


    $rootScope.LoadAllActivityListForFunction = function () {

        debugger;
        $rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'ActivityPossibleSteps',
                StatusCode: $rootScope.AddWorkFlowStep.StatusCode
            };
        var consolidateApiParamater =
            {
                Json: requestData,

            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data !== undefined) {
                if (response.data.Json !== undefined) {
                    ListData = response.data.Json.ActivityList;

                    $rootScope.ActivityListForFunction = ListData;
                    //StatusCode
                } else {

                    $rootScope.ActivityListForFunction = [];

                }
            }

            $scope.Throbber.Visible = false;
        });
    };

    if ($rootScope.RedirectToRulePage) {
        $rootScope.LoadAllActivityListForFunction();
    }

    $rootScope.ComparisonDataList =
        [{ Id: 1, Value: "==" }, { Id: 2, Value: "!=" },
        { Id: 3, Value: "<" }, { Id: 4, Value: ">" }, { Id: 5, Value: ">=" }, { Id: 6, Value: "<=" }, { Id: 7, Value: "in" }];



    $scope.setClientData = function (item) {
        if (item) {
            $rootScope.LoadPropertiesByObject(item.Name, $scope.SelectedObjectRuleId, $scope.SelectedObjectConditionId);
        }
    }

    $scope.SelectedObjectIndex = 0;

    $scope.SelectObjectForProperties = function (event, parentIndex, index, ruleId, conditionId) {

        $scope.SelectedObjectRuleId = ruleId;
        $scope.SelectedObjectConditionId = conditionId;
        var keyCode = event.which || event.keyCode;
        if (keyCode === 13) {

        }

        $scope.SelectedObjectIndex = parentIndex + "" + index;
    }

    $scope.LoadSelectedObjectProperties = function (event, parentIndex, index, objectName, ruleId, conditionId) {

        $scope.SelectedObjectRuleId = ruleId;
        $scope.SelectedObjectConditionId = conditionId;
        var keyCode = event.which || event.keyCode;


        if (keyCode === 9) {

            $scope.SelectedObjectIndex = parentIndex + "" + index;
            $rootScope.LoadPropertiesByObject(objectName, $scope.SelectedObjectRuleId, $scope.SelectedObjectConditionId);
        }
    }


    $rootScope.onChangeRuleType = function () {



        $scope.ResetRuleControlOnChange();
        $rootScope.OutputObjectNameIsDisable = false;
        $rootScope.OutputPropertyNameIsDisable = false;

        var ruletype = $rootScope.FinalValue.Id;
        if (ruletype !== 0) {
            $rootScope.addnewrulediv = true;
            $rootScope.LoadRuleTypeToCreateNewRule(ruletype, '');

        }
    };


    $rootScope.LoadRuleTypeToCreateNewRule = function (ruleId, ruleType) {

        $rootScope.Throbber.Visible = true;
        $scope.RuleTypeId = ruleId;
        $scope.RuleTypeName = ruleType;
        var requestData =
            {
                ServicesAction: 'LoadObjectByRuleType',
                RuleType: ruleId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {


            $scope.SelectedRuleName = ruleType;
            $rootScope.SelectedRuleType = ruleId;
            if (response.data.Json != undefined) {
                $scope.RuleObjectsList = response.data.Json.ObjectRuleTypeMappingList;
                $rootScope.RuleObjectDataList = $scope.RuleObjectsList;


                ///Binding Function and resutl drop down


                var autobindvalue = $rootScope.RulesEngineType.filter(function (el) { return el.Code === ruleId; });
                if (autobindvalue.length > 0) {

                    if (autobindvalue[0].Field1 !== '-') {
                        $rootScope.FinalValue.OutputObjectName = autobindvalue[0].Field1;
                        $rootScope.OutputObjectNameIsDisable = true;

                        $rootScope.Throbber.Visible = true;
                        var requestData =
                            {
                                ServicesAction: 'LoadObjectPropertiesByObject',
                                ObjectName: autobindvalue[0].Field1,
                            }


                        var jsonobject = {};
                        jsonobject.Json = requestData;
                        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

                            if (response.data.Json != undefined) {
                                $rootScope.ThenRuleObjectsPropertiesList = response.data.Json.ObjectPropertiesList;
                                if (autobindvalue[0].Field2 !== '-') {
                                    $rootScope.FinalValue.OutputPropertyName = autobindvalue[0].Field2;

                                    $rootScope.OutputPropertyNameIsDisable = true;
                                }
                            }

                            $rootScope.Throbber.Visible = false;
                        });

                    }



                    $rootScope.RuleFunctionList = $rootScope.MasterRuleFunctionList

                    if ($rootScope.RuleTypeFunctionMappingList.length > 0) {

                        var mappingList = $rootScope.RuleTypeFunctionMappingList.filter(function (el) { return el.RuleTypeId == $rootScope.FinalValue.Id; });

                        var funname = mappingList.map(a => a.RuleFunctionId);

                        $rootScope.RuleFunctionList = $rootScope.RuleFunctionList.filter(function (el) { return funname.indexOf(el.RuleFunctionId) >= 0; });
                    }

                    if ($rootScope.ActivityListForFunction.length === 0) {

                        $rootScope.RuleFunctionList = $rootScope.RuleFunctionList.filter(function (el) { return el.FunctionText !== 'GoToStep' && el.FunctionText !== 'StatusCode'; });
                    }



                }








            }
            $('#RuleStartDate').each(function () {
                $(this).datepicker({
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
            });
            $rootScope.Throbber.Visible = false;

        });
    }


    if ($rootScope.RuleTypeDefault == 'Wave') {
        $rootScope.LoadRuleTypeToCreateNewRule(8, 'Wave');
    }

    $scope.SelectedObjectIndex = -1;

    $rootScope.LoadPropertiesByObject = function (objectName, ruleId, conditionId) {

        $rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'LoadObjectPropertiesByObject',
                ObjectName: objectName,
            }


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (response.data.Json != undefined) {

                $rootScope.RuleObjectsPropertiesList = response.data.Json.ObjectPropertiesList;

                var ruleData = $rootScope.RuleListData.filter(function (el) { return el.RuleId === ruleId; });
                if (ruleData.length > 0) {
                    var conditionList = ruleData[0].ConditionList.filter(function (el) { return el.ConditionId === conditionId; });
                    if (conditionList.length > 0) {

                        conditionList[0].ObjectPropertiesList = $rootScope.RuleObjectsPropertiesList;

                    }
                }
            }

            var x = "showProperties" + $scope.SelectedObjectIndex;
            $scope[x] = true;

            $rootScope.Throbber.Visible = false;
        });
    }

    $scope.SelectPropertiesValue = function (ruleId, conditionId, propertiesName) {

        // $scope.searchProperties = propertiesName;
        $scope.propertiesName = propertiesName;


        var ruleData = $rootScope.RuleListData.filter(function (el) { return el.RuleId === ruleId; });
        if (ruleData.length > 0) {
            var conditionList = ruleData[0].ConditionList.filter(function (el) { return el.ConditionId === conditionId; });
            if (conditionList.length > 0) {

                conditionList[0].PropertyName = propertiesName;

            }
        }

        $scope.showObjectProperties = false;
        var x = "showProperties" + $scope.SelectedObjectIndex;
        $scope[x] = false;

        $scope.SelectedObjectIndex = -1;
    }

    $scope.LoadObjectPropertiesUIBox = function (parentIndex, index) {

        delete $scope["showProperties" + $scope.SelectedObjectIndex];
        $scope.SelectedObjectIndex = parentIndex + "" + index;
        var x = "showProperties" + $scope.SelectedObjectIndex;
        $scope[x] = true;

    }


    $scope.CloseObjectPropertiesUI = function () {
        $scope.showObjectProperties = false;
    }

    $scope.focusIn = function () {

    }
    $scope.focusOut = function () {

    }

    $scope.SelectedObjectProperties = function (e) {

        $scope.SelectedObjectProperties = e.originalObject.Name;
    }

    $scope.SelectComparisonValue = function () {


    }

    $scope.AddCondition = function (ruleId, action, conditionId, index, parentIndex) {

        var ruleData = $rootScope.RuleListData.filter(function (el) { return el.RuleId === ruleId; });
        if (ruleData.length > 0) {

            if (ruleData[0].ConditionList.length === (index + 1)) {

                var conditionList = ruleData[0].ConditionList.filter(function (el) { return el.ConditionId === conditionId; });
                if (conditionList[0].ObjectName !== "" && conditionList[0].PropertyName !== "" && conditionList[0].ComparisonValue != "" && conditionList[0].OutPutValue != "") {
                    conditionList[0].SelectedButton = action;
                    $scope.AddDefaultCondition(ruleData[0].ConditionList, action, ruleData[0].ConditionList.length);

                    var controlId = "HideControl" + parentIndex + "" + index;
                    $rootScope[controlId] = true;
                }
                else {

                    $rootScope.ValidationErrorAlert('All fields are mandatory.', 'warning', 10000);
                }

            } else {


            }


        }

    }

    $scope.AddAndConditionInExistingCondtion = function (ruleId, conditionId, index, parentIndex) {


        $scope.AddCondition(ruleId, "&", conditionId, index, parentIndex);

    }

    $scope.AddOrConditionInExistingCondtion = function (ruleId, conditionId, index, parentIndex) {

        $scope.AddCondition(ruleId, "||", conditionId, index, parentIndex);

    }

    $scope.AddNewCondtion = function (ruleId, event, conditionId, index, parentIndex) {

        var ruleData = $rootScope.RuleListData.filter(function (el) { return el.RuleId === ruleId; });
        if (ruleData.length > 0) {

            if (ruleData[0].ConditionList.length === (index + 1)) {

                var conditionList = ruleData[0].ConditionList.filter(function (el) { return el.ConditionId === conditionId; });
                if (conditionList[0].ObjectName !== "" && conditionList[0].PropertyName !== "" && conditionList[0].ComparisonValue != "" && conditionList[0].OutPutValue != "") {

                    conditionList[0].SelectedButton = "+";

                    $scope.AddNewConditionPopoverOption(ruleId, event, index, parentIndex);

                } else {
                    $rootScope.ValidationErrorAlert('All fields are mandatory.', 'warning', 10000);

                }

            } else {


            }
        }

    }

    $rootScope.ShowFinalOutputCondition = false;

    $scope.AddOutputValue = function (ruleId, conditionId, index, parentIndex) {

        var ruleData = $rootScope.RuleListData.filter(function (el) { return el.RuleId === ruleId; });
        if (ruleData.length > 0) {

            var conditionList = ruleData[0].ConditionList.filter(function (el) { return el.ConditionId === conditionId; });
            if (conditionList[0].ObjectName !== "" && conditionList[0].PropertyName !== "" && conditionList[0].ComparisonValue != "" && conditionList[0].OutPutValue != "") {

                conditionList[0].SelectedButton = "Then";

                var controlId = "HideControl" + parentIndex + "" + index;
                $rootScope[controlId] = true;

                $rootScope.ShowFinalOutputCondition = true;

            } else {
                $rootScope.ValidationErrorAlert('All fields are mandatory.', 'warning', 10000);

            }

        }


    }


    $scope.AddNewConditionPopoverOption = function (item, event, index, parentIndex) {

        $rootScope.SelectedIndex = index;
        $rootScope.ParentSelectedIndex = parentIndex;

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        if ($scope.popover) {
            $scope.popover.show(event);
        }
        else {
            $ionicPopover.fromTemplateUrl('templates/contact-popover.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
                $scope.$on('$destroy', function () {
                    $scope.popover.remove().then(
                        function () {
                            delete $scope.popover;
                        });
                });
                $scope.popover.show(event);
            });
        }

    }


    $scope.AddNewConditionCriteria = function (value, ruleId, ConditionId, event, index, parentIndex) {

        var ruleData = $rootScope.RuleListData.filter(function (el) { return el.RuleId === ruleId; });
        if (ruleData.length > 0) {
            var conditionList = ruleData[0].ConditionList.filter(function (el) { return el.ConditionId === ConditionId; });
            conditionList[0].SelectedButton = value;
            if (conditionList[0].ObjectName !== "" && conditionList[0].PropertyName !== "" && conditionList[0].ComparisonValue != "" && conditionList[0].OutPutValue != "") {

                $rootScope.AddDefaultRule($rootScope.RuleListData.length + 1);

                var ruleData = $rootScope.RuleListData.filter(function (el) { return el.RuleId === $scope.NewConditionForRuleId; });
                if (ruleData.length > 0) {
                    ruleData[0].ConditionType = value;
                }

                var controlId = "HideControl" + $rootScope.ParentSelectedIndex + "" + $rootScope.SelectedIndex;
                $rootScope[controlId] = true;


                var newcontrolId = "HideControl" + parentIndex + "" + index;
                $rootScope[newcontrolId] = true;

            } else {
                $rootScope.ValidationErrorAlert('All fields are mandatory.', 'warning', 10000);

            }
        }




    }







    $scope.SetResponseRequired = function (status) {
        $rootScope.FinalValue.IsResponseRequired = status;
    }

    $scope.SetEnable = function (status) {
        $rootScope.FinalValue.Enable = status;
    }


    $scope.UpdateRuleConditions = function (ruleId, conditionId, index, parentIndex, condititonType) {


        var rulesList = $rootScope.RuleListData.filter(function (el) { return el.RuleId === ruleId; });

        for (var i = 0; i < rulesList.length; i++) {
            for (var j = 0; j < rulesList[i].ConditionList.length; j++) {
                if (rulesList[i].ConditionList[j].ConditionId === conditionId) {
                    rulesList[i].ConditionList[j].SelectedButton = condititonType;
                    rulesList[i].ConditionList[j + 1].ConditionType = condititonType;
                }
            }
        }

    }


    $scope.UpdateNewRuleConditions = function (ruleId, condititonType) {


        var rulesList = $rootScope.RuleListData.filter(function (el) { return el.RuleId === ruleId; });


    }

    $scope.RemoveRuleConditions = function (ruleId, conditionId, index, parentIndex) {


        var rulesList = $rootScope.RuleListData.filter(function (el) { return el.RuleId === ruleId; });
        if (rulesList.length > 0) {

            if (rulesList[0].ConditionList.length === 1) {
                if ($rootScope.RuleListData.length === 1) {

                } else {
                    $rootScope.RuleListData = $rootScope.RuleListData.filter(function (el) { return el.RuleId !== ruleId; });
                }
            }
            else {
                rulesList[0].ConditionList = rulesList[0].ConditionList.filter(function (el) { return el.ConditionId !== conditionId; });
            }
        }


        for (var i = 0; i < $rootScope.RuleListData.length; i++) {
            for (var j = 0; j < $rootScope.RuleListData[i].ConditionList.length; j++) {

                var i_length = $rootScope.RuleListData.length - 1;
                var j_length = $rootScope.RuleListData[i].ConditionList.length - 1;



                var controlId = "HideControl" + i + "" + j;

                if (i_length === i && j_length === j) {
                    $rootScope[controlId] = false;
                }
                else {

                    $rootScope[controlId] = true;
                }
            }
        }

    }

    $rootScope.RuleStringGenerator = function (onSave) {


        var RuleString = "If ";

        for (var i = 0; i < $rootScope.RuleListData.length; i++) {


            var findindex = [];

            if (i !== 0) {
                RuleString += " " + $rootScope.RuleListData[i].ConditionType + " ";
            }
            var isMultipleConditionApply = false;
            if ($rootScope.RuleListData[i].ConditionList.length > 1) {

                if ($rootScope.RuleListData.length > 1) {
                    RuleString += "(";
                }

                var checkAndCondition = $rootScope.RuleListData[i].ConditionList.filter(function (el) { return el.SelectedButton === '&'; });
                var checkOrCondition = $rootScope.RuleListData[i].ConditionList.filter(function (el) { return el.SelectedButton === '||'; });

                if (checkAndCondition.length > 0 && checkOrCondition.length > 0) {
                    isMultipleConditionApply = true;
                }
                else {
                    isMultipleConditionApply = false;
                }

            }

            if (isMultipleConditionApply === true) {
                var previousValue = "";

                for (var j = 0; j < $rootScope.RuleListData[i].ConditionList.length; j++) {
                    if (j !== 0) {

                        if ($rootScope.RuleListData[i].ConditionList[j].SelectedButton !== "Then") {
                            if ($rootScope.RuleListData[i].ConditionList[j].SelectedButton === previousValue) {

                            } else {
                                findindex.push(j);
                            }
                        }


                    }
                    previousValue = $rootScope.RuleListData[i].ConditionList[j].SelectedButton;
                }

            }

            if (findindex.length > 0) {

                RuleString += "(";

            }

            for (var j = 0; j < $rootScope.RuleListData[i].ConditionList.length; j++) {



                if (j === 0) {
                }
                else {
                    RuleString += " " + $rootScope.RuleListData[i].ConditionList[j].ConditionType;
                }

                var options = ['<', '>', '>=', '<=', 'in'];

                var ObjectName = $rootScope.RuleListData[i].ConditionList[j].ObjectName == "" ? null : $rootScope.RuleListData[i].ConditionList[j].ObjectName;
                var PropertyName = $rootScope.RuleListData[i].ConditionList[j].PropertyName == "" ? null : $rootScope.RuleListData[i].ConditionList[j].PropertyName;
                var ComparisonValue = $rootScope.RuleListData[i].ConditionList[j].ComparisonValue == "" ? null : $rootScope.RuleListData[i].ConditionList[j].ComparisonValue;
                var OutPutValue = $rootScope.RuleListData[i].ConditionList[j].OutPutValue == "" ? null : $rootScope.RuleListData[i].ConditionList[j].OutPutValue;



                if ($rootScope.RuleListData.length !== 1 || $rootScope.RuleListData[i].ConditionList.length !== 1 || onSave) {
                    if (ObjectName === null) {
                        $rootScope.RuleListData[i].ConditionList[j].ObjectNameValid = true;
                    }
                    else {
                        $rootScope.RuleListData[i].ConditionList[j].ObjectNameValid = false;
                    }

                    if (PropertyName === null) {
                        $rootScope.RuleListData[i].ConditionList[j].PropertyNameValid = true;
                    }
                    else {
                        $rootScope.RuleListData[i].ConditionList[j].PropertyNameValid = false;
                    }

                    if (ComparisonValue === null) {
                        $rootScope.RuleListData[i].ConditionList[j].ComparisonValueValid = true;
                    }
                    else {
                        $rootScope.RuleListData[i].ConditionList[j].ComparisonValueValid = false;
                    }

                    if (OutPutValue === null) {
                        $rootScope.RuleListData[i].ConditionList[j].OutPutValueValid = true;
                    }
                    else {
                        $rootScope.RuleListData[i].ConditionList[j].OutPutValueValid = false;
                    }
                }


                if (options.indexOf($rootScope.RuleListData[i].ConditionList[j].ComparisonValue) !== -1) {

                    if (ComparisonValue == 'in') {
                        RuleString += "{" + ObjectName + "." + PropertyName + "} " + ComparisonValue + " (" + OutPutValue + ")";
                    }
                    else {
                        RuleString += "{" + ObjectName + "." + PropertyName + "} " + ComparisonValue + " " + OutPutValue;
                    }
                }
                else {

                    RuleString += " '{" + ObjectName + "." + PropertyName + "}' " + ComparisonValue + " '" + OutPutValue + "'";
                }




                if ($rootScope.RuleListData[i].ConditionList[j].ObjectName === "Company" && $rootScope.RuleListData[i].ConditionList[j].PropertyName === "CompanyMnemonic") {
                    $scope.companyType = $rootScope.RuleListData[i].ConditionList[j].OutPutValue;
                }

                if (findindex.length > 0) {

                    var conditionclosed = findindex.filter(function (el) { return el === j; });
                    if (conditionclosed.length > 0) {

                        findindex = findindex.filter(function (el) { return el !== j; });

                        RuleString += " ) ";


                        if (findindex.length > 0) {

                            RuleString += "(";

                        }


                    }



                }


            }

            if ($rootScope.RuleListData[i].ConditionList.length > 1) {
                if ($rootScope.RuleListData.length > 1) {
                    RuleString += " ) ";
                }
            }
        }

        RuleString += " Then " + $rootScope.FinalValue.FinalOutputValue;

        return RuleString;

    }

    $scope.DynamicGeneratedThenString = function () {

        var thenvalue = '';
        if ($rootScope.FinalValue.OutputObjectName !== "" && $rootScope.FinalValue.OutputPropertyName !== "" && $rootScope.FinalValue.FinalThenValue !== "") {
            thenvalue = "{" + $rootScope.FinalValue.OutputObjectName + "." + $rootScope.FinalValue.OutputPropertyName + "} = " + $rootScope.FinalValue.FunctionType + "(" + $rootScope.FinalValue.FinalThenValue + ")";
        }
        return thenvalue;
    }


    $scope.DynamicGeneratedRuleString = function () {
        var finalvalue = '';
        var thenvalue = '';
        if ($rootScope.FinalValue.OutputObjectName !== "" && $rootScope.FinalValue.OutputPropertyName !== "" && $rootScope.FinalValue.FinalThenValue !== "") {
            thenvalue = "{" + $rootScope.FinalValue.OutputObjectName + "." + $rootScope.FinalValue.OutputPropertyName + "} = " + $rootScope.FinalValue.FunctionType + "(" + $rootScope.FinalValue.FinalThenValue + ")";
        }

        finalvalue = $rootScope.RuleStringGenerator(false);

        var maiRuleSplit = finalvalue.split('Then');


        finalvalue = maiRuleSplit[0] + " Then " + thenvalue;

        return finalvalue;
    }


    function checkdate(input) {
        var validformat = /^\d{2}\/\d{2}\/\d{4}$/ //Basic check for format validity
        var returnval = false
        if (!validformat.test(input))
            var returnval = false
        else { //Detailed check for valid date ranges
            var monthfield = input.split("/")[0]
            var dayfield = input.split("/")[1]
            var yearfield = input.split("/")[2]
            var dayobj = new Date(yearfield, monthfield - 1, dayfield)
            if ((dayobj.getMonth() + 1 != monthfield) || (dayobj.getDate() != dayfield) || (dayobj.getFullYear() != yearfield))
                var returnval = false
            else
                returnval = true
        }
        return returnval
    }


    $scope.SaveRule = function () {

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

        if ($rootScope.FinalValue.Id === "" || $rootScope.FinalValue.Id === 0 || $rootScope.FinalValue.Id === null || $rootScope.FinalValue.Id === undefined) {
            $rootScope.ValidationErrorAlert($rootScope.resData.res_AddEditBusinessRuleEngine_RuleTypeValid, 'warning', 10000);
            return false;
        }

        if ($rootScope.FinalValue.DetailsRuleName === "" || $rootScope.FinalValue.DetailsRuleName === undefined || $rootScope.FinalValue.DetailsRuleName === null) {
            $rootScope.ValidationErrorAlert($rootScope.resData.res_AddEditBusinessRuleEngine_RuleNameValid, 'warning', 10000);
            return false;
        }

        if ($rootScope.FinalValue.RuleStartDate === "" || $rootScope.FinalValue.RuleStartDate === undefined || $rootScope.FinalValue.RuleStartDate === null) {

            $rootScope.ValidationErrorAlert($rootScope.resData.res_AddEditBusinessRuleEngine_StartDateValid, 'warning', 10000);
            return false;

        }

        if ($rootScope.FinalValue.RuleEndDate === "" || $rootScope.FinalValue.RuleEndDate === undefined || $rootScope.FinalValue.RuleEndDate === null) {

            $rootScope.ValidationErrorAlert($rootScope.resData.res_AddEditBusinessRuleEngine_ToDateValid, 'warning', 10000);
            return false;

        }



        if ($rootScope.FinalValue.DetailsRuleName !== "" && $rootScope.FinalValue.DetailsRuleName !== undefined && $rootScope.FinalValue.DetailsRuleName !== null) {

            $scope.SaveThenRuleFunctionOutput();

            if ($scope.FinalValue.FinalOutputValue != "") {

                $scope.FinalRuleString = $rootScope.RuleStringGenerator(true);


                var chkvalue = "null";
                var chkvaluoutput = $scope.FinalRuleString.indexOf(chkvalue);

                if (chkvaluoutput !== -1) {
                    $rootScope.ValidationErrorAlert("Invalid rule format.", 'warning', 10000);
                    return false;
                }

                chkvalue = ".}";
                chkvaluoutput = $scope.FinalRuleString.indexOf(chkvalue);

                if (chkvaluoutput !== -1) {
                    $rootScope.ValidationErrorAlert("Invalid rule format.", 'warning', 10000);
                    return false;
                }


//Changed for date swaping by nimesh on 15-10-2019
                var companyType = $scope.companyType;
				var selectedStartDate='';
				var selectedEndDate='';
                if ($rootScope.FinalValue.RuleStartDate !== "" && $rootScope.FinalValue.RuleStartDate !== undefined) {
                    var fromdate = $rootScope.FinalValue.RuleStartDate.split('/');
                     selectedStartDate = fromdate[1] + "/" + fromdate[0] + "/" + fromdate[2];

                    var checkRuleStartDate = checkdate(selectedStartDate);
                    if (!checkRuleStartDate) {
                        $rootScope.ValidationErrorAlert("Invalid Date format.", 'warning', 10000);
                        return false;
                    }
                    else {
                        //$rootScope.FinalValue.RuleStartDate = selectedStartDate;
                    }
                }

                if ($rootScope.FinalValue.RuleEndDate !== "" && $rootScope.FinalValue.RuleEndDate !== undefined) {
                    var enddate = $rootScope.FinalValue.RuleEndDate.split('/');
                    selectedEndDate = enddate[1] + "/" + enddate[0] + "/" + enddate[2];

                    var checkRuleEndDate = checkdate(selectedEndDate);
                    if (!checkRuleEndDate) {
                        $rootScope.ValidationErrorAlert("Invalid Date format.", 'warning', 10000);
                        return false;
                    }
                    else {
                        //$rootScope.FinalValue.RuleEndDate = selectedEndDate;
                    }
                }







                var serviceaction = "";
                if ($rootScope.RuleListData.EditRuleId !== undefined && $rootScope.RuleListData.EditRuleId !== 0) {
                    serviceaction = "UpdateRule";
                } else {
                    serviceaction = "InsertRule";
                }
                var requestData =
                    {
                        RuleId: $rootScope.RuleListData.EditRuleId,
                        ServicesAction: serviceaction,
                        RuleType: $rootScope.FinalValue.Id,
                        RuleName: $rootScope.FinalValue.DetailsRuleName,
                        RuleText: $scope.FinalRuleString,
                        CompanyType: companyType,
                        Remarks: $rootScope.FinalValue.DetailsDescription,
                        ShipTo: "",
                        SequenceNumber: 1,
                        //FromDate: $rootScope.FinalValue.RuleStartDate,
                        //ToDate: $rootScope.FinalValue.RuleEndDate,
						FromDate: selectedStartDate,
                        ToDate: selectedEndDate,
                        CreatedBy: $rootScope.UserId,
                        ModifiedBy: $rootScope.UserId,
                        IsActive: $rootScope.FinalValue.IsActive,
                        Enable: $rootScope.FinalValue.Enable,
                        IsResponseRequired: $rootScope.FinalValue.IsResponseRequired
                    };



                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


                    if (response.data.Json.RuleId === "-1") {
                        $rootScope.ValidationErrorAlert('Duplicate Record.', 'warning', 10000);
                    } else {
                        $rootScope.ClearRule();
                        //if ($rootScope.RedirectToRulePage === true) {
                        //    $rootScope.FinalWorkFlowRuleText = $scope.FinalRuleString;
                        //    $rootScope.FinalWorkFlowRuleId = response.data.Json.RuleId;
                        //    $state.go("Workflow");
                        //} else {
                        $rootScope.WorkflowRuleId = $rootScope.WorkflowRuleId + ',' + response.data.Json.RuleId;
                        $rootScope.RuleListData.EditRuleId = 0;
                        $rootScope.RuleGridCallBack();
                        if (serviceaction === "UpdateRule") {
                            $rootScope.ValidationErrorAlert('Rule Updated Successfully.', 'warning', 10000);
                        } else if (serviceaction === "InsertRule") {
                            $rootScope.ValidationErrorAlert('Rule Saved Successfully.', 'warning', 10000);
                        }
                        //}


                    }


                });
            }
            else {
                $rootScope.ValidationErrorAlert($rootScope.resData.res_AddEditBusinessRuleEngine_FinalOutputValueValid, 'warning', 10000);
            }
        } else {
            $rootScope.ValidationErrorAlert($rootScope.resData.res_AddEditBusinessRuleEngine_RuleNameValid, 'warning', 10000);
        }



    }

    $rootScope.ClearRule = function () {

        for (var i = 0; i < $rootScope.RuleListData.length; i++) {
            for (var j = 0; j < $rootScope.RuleListData[i].ConditionList.length; j++) {
                var controlId = "HideControl" + i + "" + j;
                delete $rootScope[controlId];
            }
        }

        $rootScope.EditMultiOutPutListData = [];
        $rootScope.MultiOutPutListData = [];
        $rootScope.RuleListData = [];
        $rootScope.FinalValue.FinalOutputValue = "";
        $rootScope.AddDefaultRule(1);
        $rootScope.ParentSelectedIndex = "";
        $rootScope.SelectedIndex = "";
        $rootScope.ShowFinalOutputCondition = false;
        $rootScope.FinalValue.RuleStartDate = "";
        $rootScope.FinalValue.RuleEndDate = "";
        $rootScope.FinalValue.OutputObjectName = "";
        $rootScope.FinalValue.OutputPropertyName = "";
        $rootScope.FinalValue.FinalThenValue = "";
        $rootScope.FinalValue.Id = 0;
        $rootScope.FinalValue.DetailsDescription = "";
        $rootScope.FinalValue.RuleName = "";
        $rootScope.FinalValue.DetailsRuleName = "";
        $rootScope.FinalValue.Enable = true;
        $rootScope.FinalValue.IsActive = true;
        $rootScope.FinalValue.IsResponseRequired = true;
        $rootScope.RuleListData.IsEdit = false;

        $rootScope.OutputObjectNameIsDisable = false;
        $rootScope.OutputPropertyNameIsDisable = false;

        $rootScope.selectedValue.Id = 2;
        $rootScope.ShowEditPanel = false;
        $rootScope.SelectedRuleId = 0;
        $rootScope.ShowTimePeriod = false;
        var controlId = "HideControl00";
        $rootScope[controlId] = false;

    }


    $rootScope.ResetRuleControl = function () {


        for (var i = 0; i < $rootScope.RuleListData.length; i++) {
            for (var j = 0; j < $rootScope.RuleListData[i].ConditionList.length; j++) {
                var controlId = "HideControl" + i + "" + j;
                delete $rootScope[controlId];
            }
        }
        //$rootScope.addnewrulediv = false;
        $scope.RuleObjectsList = [];
        $rootScope.EditMultiOutPutListData = [];
        $rootScope.MultiOutPutListData = [];
        //$rootScope.RuleListData = [];
        $rootScope.FinalValue.FinalOutputValue = "";

        $rootScope.ParentSelectedIndex = "";
        $rootScope.SelectedIndex = "";
        $rootScope.ShowFinalOutputCondition = false;
        $rootScope.FinalValue.RuleStartDate = "";
        $rootScope.FinalValue.RuleEndDate = "";
        $rootScope.FinalValue.OutputObjectName = "";
        $rootScope.FinalValue.OutputPropertyName = "";
        $rootScope.FinalValue.FinalThenValue = "";
        $rootScope.FinalValue.Id = 0;
        $rootScope.FinalValue.DetailsDescription = "";
        $rootScope.FinalValue.RuleName = "";
        $rootScope.FinalValue.DetailsRuleName = "";
        $rootScope.FinalValue.Enable = true;
        $rootScope.FinalValue.IsActive = true;
        $rootScope.FinalValue.IsResponseRequired = true;
        //$rootScope.RuleListData.IsEdit = false;

        $rootScope.OutputObjectNameIsDisable = false;
        $rootScope.OutputPropertyNameIsDisable = false;

        $rootScope.selectedValue.Id = 2;
        $rootScope.ShowEditPanel = false;
        $rootScope.SelectedRuleId = 0;
        $rootScope.ShowTimePeriod = false;
        var controlId = "HideControl00";
        $rootScope[controlId] = false;

        if ($rootScope.RuleListData.IsEdit) {
            $rootScope.EditRule($rootScope.RuleListData.EditRuleId, 1);
        }
        else {
            $rootScope.RuleListData = [];
            $rootScope.AddDefaultRule(1);
        }
    }

    $rootScope.ResetRuleControlOnChange = function () {


        for (var i = 0; i < $rootScope.RuleListData.length; i++) {
            for (var j = 0; j < $rootScope.RuleListData[i].ConditionList.length; j++) {
                var controlId = "HideControl" + i + "" + j;
                delete $rootScope[controlId];
            }
        }
        //$rootScope.addnewrulediv = false;
        $scope.RuleObjectsList = [];
        $rootScope.EditMultiOutPutListData = [];
        $rootScope.MultiOutPutListData = [];
        $rootScope.RuleListData = [];
        $rootScope.FinalValue.FinalOutputValue = "";
        $rootScope.AddDefaultRule(1);
        $rootScope.ParentSelectedIndex = "";
        $rootScope.SelectedIndex = "";
        $rootScope.ShowFinalOutputCondition = false;
        $rootScope.FinalValue.RuleStartDate = "";
        $rootScope.FinalValue.RuleEndDate = "";
        $rootScope.FinalValue.OutputObjectName = "";
        $rootScope.FinalValue.OutputPropertyName = "";
        $rootScope.FinalValue.FinalThenValue = "";
        $rootScope.FinalValue.FunctionType = "";
        $rootScope.FinalValue.DetailsDescription = "";
        $rootScope.FinalValue.RuleName = "";
        $rootScope.FinalValue.DetailsRuleName = "";
        $rootScope.FinalValue.Enable = true;
        $rootScope.FinalValue.IsActive = true;
        $rootScope.FinalValue.IsResponseRequired = true;


        $rootScope.OutputObjectNameIsDisable = false;
        $rootScope.OutputPropertyNameIsDisable = false;

        $rootScope.selectedValue.Id = 2;
        $rootScope.ShowEditPanel = false;
        $rootScope.SelectedRuleId = 0;
        $rootScope.ShowTimePeriod = false;
        var controlId = "HideControl00";
        $rootScope[controlId] = false;


    }


    $scope.BackView = function () {


        $rootScope.FirstTab = true;
        $rootScope.SecondTab = false;
        $rootScope.ClearRule();
    }


    $scope.LoadRuleFunction = function () {


        var requestData =
            {
                ServicesAction: 'LoadRuleFunctions',
                CompanyId: $scope.UserId
            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


            if (response.data !== undefined) {
                $rootScope.RuleFunctionList = response.data.Json.RuleFunctionList;
                $rootScope.MasterRuleFunctionList = response.data.Json.RuleFunctionList;
                //Loading Ruletype and Function mapping list..

                var requestMappingData =
                    {
                        ServicesAction: 'LoadRuleTypeFunctionMapping',
                        RuleType: 0
                    };
                var consolidateMappingApiParamater =
                    {
                        Json: requestMappingData,
                    };
                GrRequestService.ProcessRequest(consolidateMappingApiParamater).then(function (mappingResponse) {
                    if (mappingResponse.data !== undefined) {

                        if (mappingResponse.data.Json !== undefined) {
                            $rootScope.RuleTypeFunctionMappingList = mappingResponse.data.Json.RuleTypeFunctionMappingList;
                        }
                        else {
                            $rootScope.RuleTypeFunctionMappingList = [];
                        }
                    }
                    else {
                        $rootScope.RuleTypeFunctionMappingList = [];
                    }
                });



            } else {
                $rootScope.RuleFunctionList = [];
            }



        });

    }


    $scope.LoadRuleFunction();



    $rootScope.EditRuleStringGenerator = function (RuleList) {


        $rootScope.RuleListData = [];



        for (var i = 0; i < RuleList.length; i++) {

            var ruleId = generateGUID();
            var ruleObj = {
                RuleId: ruleId,
                ConditionNumber: i,
                ConditionType: RuleList[i].ConditionType,
                ConditionList: [],
                ThenOutPutValue: ""
            };

            for (var j = 0; j < RuleList[i].conditionList[0].length; j++) {
                var ConditionCreateria = "";
                var SelectedButton = "";

                if (j !== 0) {
                    ConditionCreateria = RuleList[i].conditionList[0][j].ConditionCreateria;
                }
                if (i === (RuleList.length - 1) && j === (RuleList[i].conditionList[0].length - 1)) {
                    SelectedButton = "Then";
                } else {
                    SelectedButton = RuleList[i].conditionList[0][j].ConditionCreateria;
                }


                var condition =
                    {
                        ConditionId: generateGUID(),
                        ConditionCriteria: "",
                        ConditionNumber: j,
                        ObjectName: RuleList[i].conditionList[0][j].Object,
                        PropertyName: RuleList[i].conditionList[0][j].Property,
                        ComparisonValue: RuleList[i].conditionList[0][j].ConditionExpression,
                        OutPutValue: RuleList[i].conditionList[0][j].PropertyValue,
                        ConditionType: ConditionCreateria,
                        SelectedButton: SelectedButton,

                    }

                ruleObj.ConditionList.push(condition);


                var i_length = RuleList.length - 1;
                var j_length = RuleList[i].conditionList[0].length - 1;



                var controlId = "HideControl" + i + "" + j;

                if (i_length === i && j_length === j) {
                    $rootScope[controlId] = false;
                }
                else {

                    $rootScope[controlId] = true;
                }


            }

            $rootScope.RuleListData.push(ruleObj);
        }


        for (var i = 0; i < $rootScope.RuleListData.length; i++) {
            for (var j = 0; j < $rootScope.RuleListData[i].ConditionList.length; j++) {

                $rootScope.LoadPropertiesByObject($rootScope.RuleListData[i].ConditionList[j].ObjectName, $rootScope.RuleListData[i].RuleId, $rootScope.RuleListData[i].ConditionList[j].ConditionId);
            }
        }



        $rootScope.ShowFinalOutputCondition = true;


        if (RuleList.ThenValue.includes('AddDays')) {
            $rootScope.FinalValue.FunctionType = "AddDays";
        }
        else if (RuleList.ThenValue.includes('RemoveDays')) {
            $rootScope.FinalValue.FunctionType = "RemoveDays";
        }
        else if (RuleList.ThenValue.includes('GoToStep')) {
            $rootScope.FinalValue.FunctionType = "GoToStep";
        }
        else if (RuleList.ThenValue.includes('StatusCode')) {
            $rootScope.FinalValue.FunctionType = "StatusCode";
        }
        else if (RuleList.ThenValue.includes('AddPalettes')) {
            $rootScope.FinalValue.FunctionType = "AddPalettes";
        }
        else {
            $rootScope.FinalValue.FunctionType = "literal";
        }


        $rootScope.ThenValueText(RuleList.ThenValue, '=');
        $rootScope.FinalValue.FinalOutputValue = "{" + $rootScope.FinalValue.OutputObjectName + "." + $rootScope.FinalValue.OutputPropertyName + "} = " + $rootScope.FinalValue.FunctionType + "(" + $rootScope.FinalValue.FinalThenValue + ")";

        $scope.showPropertiesfirrulefunction = false;
        //} else {
        //    $rootScope.FinalValue.FunctionType = "literal";
        //    $rootScope.FinalValue.FinalThenValue = RuleList.ThenValue;
        //    $rootScope.FinalValue.FinalOutputValue = RuleList.ThenValue;
        //}


    }

    $rootScope.RuleTextValue = function (RuleData) {

        var RuleList = [];


        var conditionList = [];

        if (RuleData.RuleText.includes("If")) {
            RuleData = RuleData.RuleText.split('If');
        } else {
            RuleData = RuleData.RuleText.split('if');
        }

        RuleData = RuleData[1].split('Then');

        var conditionString = RuleData[0];
        var thenString = RuleData[1];




        if (conditionString.includes('(') && !conditionString.includes('in')) {

            conditionString = conditionString.split('(');

            var conditionType = "";

            if (conditionString[0].includes('&')) {

                conditionType = "&";
            }

            if (conditionString[0].includes('||')) {

                conditionType = "||";
            }



            for (var i = 0; i < conditionString.length; i++) {
                if (conditionString[i] !== "" && conditionString[i] !== " ") {
                    if (conditionString[i].includes(')')) {
                        var anotherCondition = conditionString[i].split(')');

                        RuleList = $rootScope.JsonOfSingleCondition(RuleList, anotherCondition[0], conditionType);

                    } else {

                        RuleList = $rootScope.JsonOfSingleCondition(RuleList, conditionString[i], "");

                    }
                }



            }

        } else {

            RuleList = $rootScope.JsonOfSingleCondition(RuleList, conditionString, "");

        }

        RuleList.ThenValue = thenString;

        return RuleList;
    }

    $rootScope.JsonOfSingleCondition = function (RuleList, conditionString, ruleConditionType) {


        var Rules = {
            RuleId: 0,
            conditionCreateria: "",
            ConditionType: ruleConditionType,
            conditionList: []
        }

        if (conditionString.includes('&')) {

            var conditionCreateria = '&';
            conditionString = conditionString.split('&');

            var conditionValue = $rootScope.SplitObjectPropertyAndValue(conditionCreateria, conditionString);
            Rules.conditionList.push(conditionValue);

            RuleList.push(Rules);
        }
        else if (conditionString.includes('||')) {

            var conditionCreateria = '||';
            conditionString = conditionString.split('||');

            var conditionValue = $rootScope.SplitObjectPropertyAndValue(conditionCreateria, conditionString);
            Rules.conditionList.push(conditionValue);
            RuleList.push(Rules);
        } else {

            var conditionCreateria = '';
            conditionString = conditionString.split('NO');
            var conditionValue = $rootScope.SplitObjectPropertyAndValue(conditionCreateria, conditionString);
            Rules.conditionList.push(conditionValue);
            RuleList.push(Rules);

        }

        return RuleList;
    }

    $rootScope.SplitObjectPropertyAndValue = function (conditionCreateria, conditionString) {

        var SplitConditions = [];


        var my_array = my_array
        conditionString = conditionString.filter(function (x) { return (x !== (undefined || null || " ")); });


        for (var i = 0; i < conditionString.length; i++) {

            var conditionExpression = "";
            if (conditionString[i].includes('<=')) {
                conditionExpression = "<="
            } else if (conditionString[i].includes('>=')) {
                conditionExpression = ">="
            }
            else if (conditionString[i].includes('!=')) {
                conditionExpression = "!="
            }
            else if (conditionString[i].includes('>')) {
                conditionExpression = ">"
            }
            else if (conditionString[i].includes('<')) {
                conditionExpression = "<"
            }
            else if (conditionString[i].includes('=')) {
                conditionExpression = "=="
            }
            else if (conditionString[i].includes('in')) {
                conditionExpression = "in"
            }


            var PropertyAndValue = conditionString[i].split(conditionExpression);

            if (PropertyAndValue[0].length > 0) {

                var editoptions = ['<', '>', '>=', '<=', 'in'];
                if (editoptions.indexOf(conditionExpression) !== -1) {
                    PropertyAndValue[0] = PropertyAndValue[0].replace("{", "");
                    PropertyAndValue[0] = PropertyAndValue[0].replace("}", "");
                }
                else {
                    PropertyAndValue[0] = PropertyAndValue[0].replace("'{", "");
                    PropertyAndValue[0] = PropertyAndValue[0].replace("}'", "");
                }

                var objectAndProperty = PropertyAndValue[0].split('.');


                var object = objectAndProperty[0].replace(/\s/g, '');
                var property = objectAndProperty[1].replace(/\s/g, '');

                PropertyAndValue[1] = PropertyAndValue[1].replace("'", "");
                PropertyAndValue[1] = PropertyAndValue[1].replace("'", "");
                var propertyValue = PropertyAndValue[1].replace(/\s/g, '').replace("(", '').replace(")", '');

                var condition = {
                    Object: object,
                    Property: property,
                    PropertyValue: propertyValue,
                    ConditionExpression: conditionExpression,
                    ConditionCreateria: conditionCreateria
                }
                SplitConditions.push(condition);
            }


        }
        return SplitConditions;

    }

    $rootScope.ThenValueText = function (ThenText, sign) {

        var firstParseValue = "";
        if (ThenText.includes(sign)) {
            var thenconditionString = ThenText.split(sign);
            for (var i = 0; i < thenconditionString.length; i++) {
                firstParseValue = thenconditionString[i];
                if (thenconditionString[i].includes('{')) {
                    var outputpropertyName = thenconditionString[i].split('{')[1];
                    if (outputpropertyName.includes('}')) {
                        outputpropertyName = outputpropertyName.split('}')[0];

                        outputpropertyName = outputpropertyName.split('.');

                        $rootScope.FinalValue.OutputObjectName = outputpropertyName[0];

                        $rootScope.OutputObjectNameIsDisable = false;
                        $rootScope.OutputPropertyNameIsDisable = false;


                        $rootScope.LoadObjectPropertiesByObject($rootScope.FinalValue.OutputObjectName, 0);
                        $rootScope.FinalValue.OutputPropertyName = outputpropertyName[1];

                        var autobindvalue = $rootScope.RulesEngineType.filter(function (el) { return el.Code === $rootScope.FinalValue.Id; });
                        if (autobindvalue.length > 0) {

                            if (autobindvalue[0].Field1 !== '-') {
                                $rootScope.OutputObjectNameIsDisable = true;
                            }

                            if (autobindvalue[0].Field2 !== '-') {
                                $rootScope.OutputPropertyNameIsDisable = true;
                            }
                        }


                    }
                    break;
                }

            }


            ThenText = ThenText.replace(firstParseValue, "");
            ThenText = ThenText.replace($rootScope.FinalValue.FunctionType, "");
            ThenText = ThenText.replace("(", "");
            ThenText = ThenText.replace(")", "");
            ThenText = ThenText.replace(/^\=/, "");

            $rootScope.FinalValue.FinalThenValue = ThenText;


        }
    }


    $rootScope.FinalThenValueSplite = function (thenvalue) {

        debugger;
        $rootScope.EditMultiOutPutListData = [];
        //thenvalue = "'{Company.CompanyMnemonic}'+ '{DeliveryLocation.DeliveryLocationCode}'+ '{90}'";

        //Sushil Sharma 9-9-2019
        //Handel the Add Day issues on Producation...
        thenvalue = thenvalue.replace(/\s/g, '');
        thenvalue = thenvalue.replace("}'-'{", "}'+'{-");


        var thenvalueArray = thenvalue.split('+');
        for (var i = 0; i < thenvalueArray.length; i++) {

            var object = '';
            var property = '';
            var SingleValue = '';


            thenvalueArray[i] = thenvalueArray[i].replace("'{", "");
            thenvalueArray[i] = thenvalueArray[i].replace("}'", "");
            var objectAndProperty = thenvalueArray[i].split('.');

            if (objectAndProperty.length > 1) {
                object = objectAndProperty[0].replace(/\s/g, '');
                property = objectAndProperty[1].replace(/\s/g, '');
            }
            else {
                SingleValue = objectAndProperty[0].replace(/\s/g, '');
            }


            var ruleObj = {
                ObjectName: object,
                PropertyName: property,
                SingleValue: SingleValue
            };

            $rootScope.EditMultiOutPutListData.push(ruleObj);
        }

        $rootScope.LoadEditOutputModalPopup();
    }


    $scope.SelectedObject = function (item) {
        if (item) {
            $rootScope.FinalValue.OutputObjectName = item.Name;
            $scope.LoadObjectPropertiesByObject(item.Name, 1);
        }
    }


    $scope.showPropertiesfirrulefunction = false;
    $rootScope.LoadObjectPropertiesByObject = function (objectName, way) {

        $rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'LoadObjectPropertiesByObject',
                ObjectName: objectName,
            }


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (response.data.Json != undefined) {
                $rootScope.ThenRuleObjectsPropertiesList = response.data.Json.ObjectPropertiesList;
            }
            if (way === 1) {
                $scope.showPropertiesfirrulefunction = true;
            } else {
                $scope.showPropertiesfirrulefunction = false;
            }
            $rootScope.Throbber.Visible = false;
        });
    }

    $scope.SelectPropertiesValueOfRuleFunction = function (propertiesName) {

        $rootScope.FinalValue.OutputPropertyName = propertiesName;
        $scope.propertiesName = propertiesName;
        $scope.showPropertiesfirrulefunction = false;
    }

    $scope.SaveThenRuleFunctionOutput = function () {


        //if ($rootScope.FinalValue.FunctionType === "AddDays") {
        if ($rootScope.FinalValue.OutputObjectName !== "" && $rootScope.FinalValue.OutputPropertyName !== "" && $rootScope.FinalValue.FinalThenValue !== "") {
            $rootScope.FinalValue.FinalOutputValue = "{" + $rootScope.FinalValue.OutputObjectName + "." + $rootScope.FinalValue.OutputPropertyName + "} = " + $rootScope.FinalValue.FunctionType + "(" + $rootScope.FinalValue.FinalThenValue + ")";

        } else {
            if ($rootScope.FinalValue.OutputObjectName === "") {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_RuleEnginePage_PleaseObjectName), 'error', 3000);
            }
            else if ($rootScope.FinalValue.OutputPropertyName === "") {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_RuleEnginePage_PleasePropertyName), 'error', 3000);
            }
            else if ($rootScope.FinalValue.FinalThenValue === "") {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_RuleEnginePage_PleaseEnterValue), 'error', 3000);
            }
        }
        //} else if ($rootScope.FinalValue.FunctionType === "literal") {
        //    if ($rootScope.FinalValue.FinalThenValue !== "") {
        //        $rootScope.FinalValue.FinalOutputValue = $rootScope.FinalValue.FinalThenValue;

        //    } else {
        //        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_RuleEnginePage_PleaseEnterValue), 'error', 3000);
        //    }
        //}
    }








    $scope.GetScheduleDate = function (date) {

        $('#RuleEndDate').each(function () {

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






}).directive('clientAutoComplete', ['$filter', function ($filter) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.autocomplete({
                source: function (request, response, index) {

                    //term has the data typed by the user
                    var params = request.term;

                    //simulates api call with odata $filter
                    var data = scope.RuleObjectsList;
                    if (data) {
                        var result = $filter('filter')(data, { Name: params });
                        angular.forEach(result, function (item) {
                            item['value'] = item['Name'];
                        });
                    }
                    response(result);

                },
                minLength: 1,
                select: function (event, ui, index) {

                    //force a digest cycle to update the views
                    scope.$apply(function () {
                        scope.setClientData(ui.item);
                    });
                },

            });
        }

    };

}]).directive('thenTextAutoComplete', ['$filter', function ($filter) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.autocomplete({
                source: function (request, response, index) {

                    //term has the data typed by the user
                    var params = request.term;

                    //simulates api call with odata $filter
                    var data = scope.RuleObjectsList;
                    if (data) {
                        var result = $filter('filter')(data, { Name: params });
                        angular.forEach(result, function (item) {
                            item['value'] = item['Name'];
                        });
                    }
                    response(result);

                },
                minLength: 1,
                select: function (event, ui, index) {

                    //force a digest cycle to update the views
                    scope.$apply(function () {
                        scope.SelectedObject(ui.item);
                    });
                },

            });
        }

    };

}]);