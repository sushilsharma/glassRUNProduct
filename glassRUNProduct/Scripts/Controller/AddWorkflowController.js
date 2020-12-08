angular.module("glassRUNProduct").controller('AddWorkflowController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {
    

    $scope.RuleObjectsList = [];
    $scope.companyType = "";
    //$scope.addnewrulediv = $rootScope.addnewrulediv;


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

    
    $rootScope.SelectedRuleType = 0;

    //$rootScope.WorkflowListData = [];

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
        
        
        var WorkflowId = generateGUID();
        $scope.NewConditionForWorkflowId = WorkflowId;
        var ruleObj = {
            WorkflowId: WorkflowId,
            ConditionNumber: count,
            ConditionType: "",
            ConditionList: [],
            ThenOutPutValue: ""
        };
        $rootScope.WorkflowListData.push(ruleObj);

        //$rootScope.WorkflowListData.EditWorkFlowId = 0;
        //$rootScope.WorkflowListData.WorkFlowName = "";
        //$rootScope.WorkflowListData.WorkFlowCode = "";

        if ($rootScope.WorkflowListData.length > 1) {

            var ruleData = $rootScope.WorkflowListData.filter(function (el) { return el.WorkflowId === WorkflowId; });
            $scope.AddDefaultCondition(ruleData[0].ConditionList, "", ruleData[0].ConditionList.length);

        } else {
            $scope.AddDefaultCondition($rootScope.WorkflowListData[0].ConditionList, "", $rootScope.WorkflowListData[0].ConditionList.length);
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





    $rootScope.ComparisonDataList =
        [{ Id: 1, Value: "==" }, { Id: 2, Value: "!=" },
        { Id: 3, Value: "<" }, { Id: 4, Value: ">" }, { Id: 5, Value: ">=" }, { Id: 6, Value: "<=" }];



    $scope.setClientData = function (item) {
        if (item) {
            $rootScope.LoadPropertiesByObject(item.Name, $scope.SelectedObjectWorkflowId, $scope.SelectedObjectConditionId);
        }
    }

    $scope.SelectedObjectIndex = 0;

    $scope.SelectObjectForProperties = function (event, parentIndex, index, WorkflowId, conditionId) {
        
        $scope.SelectedObjectWorkflowId = WorkflowId;
        $scope.SelectedObjectConditionId = conditionId;
        var keyCode = event.which || event.keyCode;
        if (keyCode === 13) {

        }

        $scope.SelectedObjectIndex = parentIndex + "" + index;
    }

    $scope.LoadSelectedObjectProperties = function (event, parentIndex, index, objectName, WorkflowId, conditionId) {
        
        $scope.SelectedObjectWorkflowId = WorkflowId;
        $scope.SelectedObjectConditionId = conditionId;
        var keyCode = event.which || event.keyCode;


        if (keyCode === 9) {

            $scope.SelectedObjectIndex = parentIndex + "" + index;
            $rootScope.LoadPropertiesByObject(objectName, $scope.SelectedObjectWorkflowId, $scope.SelectedObjectConditionId);
        }
    }


    $scope.onChangeRuleType = function () {
        
        $rootScope.addnewrulediv = true;
        var ruletype = $rootScope.FinalValue.Id;
        $rootScope.LoadRuleTypeToCreateNewRule(ruletype, '');
    };


    $rootScope.LoadRuleTypeToCreateNewRule = function (WorkflowId, ruleType) {
        
        $rootScope.Throbber.Visible = true;
        $scope.RuleTypeId = WorkflowId;
        $scope.RuleTypeName = ruleType;
        var requestData =
        {
            ServicesAction: 'LoadObjectByRuleType',
            RuleType: WorkflowId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            

            $scope.SelectedRuleName = ruleType;
            $rootScope.SelectedRuleType = WorkflowId;
            if (response.data.Json != undefined) {
                $scope.RuleObjectsList = response.data.Json.ObjectRuleTypeMappingList;
                $rootScope.RuleObjectDataList = $scope.RuleObjectsList;
            }
            pluginsService.init();
            //$scope.RuleGridCallBack();
            //$rootScope.FirstTab = false;
            //$rootScope.SecondTab = true;
            $rootScope.Throbber.Visible = false;

        });
    }


    if ($rootScope.RuleTypeDefault == 'Wave') {
        $rootScope.LoadRuleTypeToCreateNewRule(8, 'Wave');
    }

    $scope.SelectedObjectIndex = -1;

    $rootScope.LoadPropertiesByObject = function (objectName, WorkflowId, conditionId) {
        
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

                var ruleData = $rootScope.WorkflowListData.filter(function (el) { return el.WorkflowId === WorkflowId; });
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

    $scope.SelectPropertiesValue = function (WorkflowId, conditionId, propertiesName) {
        
        // $scope.searchProperties = propertiesName;
        $scope.propertiesName = propertiesName;


        var ruleData = $rootScope.WorkflowListData.filter(function (el) { return el.WorkflowId === WorkflowId; });
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

    $scope.AddCondition = function (WorkflowId, action, conditionId, index, parentIndex) {

        var ruleData = $rootScope.WorkflowListData.filter(function (el) { return el.WorkflowId === WorkflowId; });
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

    $scope.AddAndConditionInExistingCondtion = function (WorkflowId, conditionId, index, parentIndex) {
        

        $scope.AddCondition(WorkflowId, "&", conditionId, index, parentIndex);

    }

    $scope.AddOrConditionInExistingCondtion = function (WorkflowId, conditionId, index, parentIndex) {
        
        $scope.AddCondition(WorkflowId, "||", conditionId, index, parentIndex);

    }

    $scope.AddNewCondtion = function (WorkflowId, event, conditionId, index, parentIndex) {
        
        var ruleData = $rootScope.WorkflowListData.filter(function (el) { return el.WorkflowId === WorkflowId; });
        if (ruleData.length > 0) {

            if (ruleData[0].ConditionList.length === (index + 1)) {

                var conditionList = ruleData[0].ConditionList.filter(function (el) { return el.ConditionId === conditionId; });
                if (conditionList[0].ObjectName !== "" && conditionList[0].PropertyName !== "" && conditionList[0].ComparisonValue != "" && conditionList[0].OutPutValue != "") {

                    conditionList[0].SelectedButton = "+";

                    $scope.AddNewConditionPopoverOption(WorkflowId, event, index, parentIndex);

                } else {
                    $rootScope.ValidationErrorAlert('All fields are mandatory.', 'warning', 10000);

                }

            } else {


            }
        }

    }

    $rootScope.ShowFinalOutputCondition = false;

    $scope.AddOutputValue = function (WorkflowId, conditionId, index, parentIndex) {
        
        var ruleData = $rootScope.WorkflowListData.filter(function (el) { return el.WorkflowId === WorkflowId; });
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


    $scope.AddNewConditionCriteria = function (value, WorkflowId, ConditionId, event) {
        
        var ruleData = $rootScope.WorkflowListData.filter(function (el) { return el.WorkflowId === WorkflowId; });
        if (ruleData.length > 0) {
            var conditionList = ruleData[0].ConditionList.filter(function (el) { return el.ConditionId === ConditionId; });

            if (conditionList[0].ObjectName !== "" && conditionList[0].PropertyName !== "" && conditionList[0].ComparisonValue != "" && conditionList[0].OutPutValue != "") {

                $rootScope.AddDefaultRule($rootScope.WorkflowListData.length + 1);

                var ruleData = $rootScope.WorkflowListData.filter(function (el) { return el.WorkflowId === $scope.NewConditionForWorkflowId; });
                if (ruleData.length > 0) {
                    ruleData[0].ConditionType = value;
                }

                var controlId = "HideControl" + $rootScope.ParentSelectedIndex + "" + $rootScope.SelectedIndex;
                $rootScope[controlId] = true;

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

    $scope.RemoveRuleConditions = function (WorkflowId, conditionId, index, parentIndex) {
        

        var rulesList = $rootScope.WorkflowListData.filter(function (el) { return el.WorkflowId === WorkflowId; });
        if (rulesList.length > 0) {

            if (rulesList[0].ConditionList.length === 1) {
                if ($rootScope.WorkflowListData.length === 1) {

                } else {
                    $rootScope.WorkflowListData = $rootScope.WorkflowListData.filter(function (el) { return el.WorkflowId !== WorkflowId; });
                }
            }
            else {
                rulesList[0].ConditionList = rulesList[0].ConditionList.filter(function (el) { return el.ConditionId !== conditionId; });
            }
        }


        for (var i = 0; i < $rootScope.WorkflowListData.length; i++) {
            for (var j = 0; j < $rootScope.WorkflowListData[i].ConditionList.length; j++) {

                var i_length = $rootScope.WorkflowListData.length - 1;
                var j_length = $rootScope.WorkflowListData[i].ConditionList[0].length - 1;



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

    $rootScope.RuleStringGenerator = function () {
        

        var RuleString = "If ";

        for (var i = 0; i < $rootScope.WorkflowListData.length; i++) {
            

            var findindex = [];

            if (i !== 0) {
                RuleString += " " + $rootScope.WorkflowListData[i].ConditionType + " ";
            }
            var isMultipleConditionApply = false;
            if ($rootScope.WorkflowListData[i].ConditionList.length > 1) {

                if ($rootScope.WorkflowListData.length > 1) {
                    RuleString += "(";
                }

                var checkAndCondition = $rootScope.WorkflowListData[i].ConditionList.filter(function (el) { return el.SelectedButton === '&'; });
                var checkOrCondition = $rootScope.WorkflowListData[i].ConditionList.filter(function (el) { return el.SelectedButton === '||'; });

                if (checkAndCondition.length > 0 && checkOrCondition.length > 0) {
                    isMultipleConditionApply = true;
                }
                else {
                    isMultipleConditionApply = false;
                }

            }

            if (isMultipleConditionApply === true) {
                var previousValue = "";

                for (var j = 0; j < $rootScope.WorkflowListData[i].ConditionList.length; j++) {
                    if (j !== 0) {

                        if ($rootScope.WorkflowListData[i].ConditionList[j].SelectedButton !== "Then") {
                            if ($rootScope.WorkflowListData[i].ConditionList[j].SelectedButton === previousValue) {

                            } else {
                                findindex.push(j);
                            }
                        }


                    }
                    previousValue = $rootScope.WorkflowListData[i].ConditionList[j].SelectedButton;
                }

            }

            if (findindex.length > 0) {

                RuleString += "(";

            }

            for (var j = 0; j < $rootScope.WorkflowListData[i].ConditionList.length; j++) {



                if (j === 0) {
                }
                else {
                    RuleString += " " + $rootScope.WorkflowListData[i].ConditionList[j].ConditionType;
                }

                RuleString += " '{" + $rootScope.WorkflowListData[i].ConditionList[j].ObjectName + "." + $rootScope.WorkflowListData[i].ConditionList[j].PropertyName + "}' " + $rootScope.WorkflowListData[i].ConditionList[j].ComparisonValue + " '" + $rootScope.WorkflowListData[i].ConditionList[j].OutPutValue + "'";

                if ($rootScope.WorkflowListData[i].ConditionList[j].ObjectName === "Company" && $rootScope.WorkflowListData[i].ConditionList[j].PropertyName === "CompanyMnemonic") {
                    $scope.companyType = $rootScope.WorkflowListData[i].ConditionList[j].OutPutValue;
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

            if ($rootScope.WorkflowListData[i].ConditionList.length > 1) {
                if ($rootScope.WorkflowListData.length > 1) {
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
            thenvalue = "{" + $rootScope.FinalValue.OutputObjectName + "." + $rootScope.FinalValue.OutputPropertyName + "} + " + $rootScope.FinalValue.FunctionType + "(" + $rootScope.FinalValue.FinalThenValue + ")";
        }
        return thenvalue;
    }


    $scope.DynamicGeneratedRuleString = function () {
        var finalvalue = '';
        var thenvalue = '';
        if ($rootScope.FinalValue.OutputObjectName !== "" && $rootScope.FinalValue.OutputPropertyName !== "" && $rootScope.FinalValue.FinalThenValue !== "") {
            thenvalue = "{" + $rootScope.FinalValue.OutputObjectName + "." + $rootScope.FinalValue.OutputPropertyName + "} + " + $rootScope.FinalValue.FunctionType + "(" + $rootScope.FinalValue.FinalThenValue + ")";
        }

        finalvalue = $rootScope.RuleStringGenerator() + " " + thenvalue;
        return finalvalue;
    }


  
   


    $scope.BackView = function () {

        
        $rootScope.FirstTab = true;
        $rootScope.SecondTab = false;
        $rootScope.ClearRule();
    }





    $rootScope.EditRuleStringGenerator = function (RuleList) {
        

        $rootScope.WorkflowListData = [];

        

        for (var i = 0; i < RuleList.length; i++) {
            
            var WorkflowId = generateGUID();
            var ruleObj = {
                WorkflowId: WorkflowId,
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

            $rootScope.WorkflowListData.push(ruleObj);
        }


        for (var i = 0; i < $rootScope.WorkflowListData.length; i++) {
            for (var j = 0; j < $rootScope.WorkflowListData[i].ConditionList.length; j++) {
                
                $rootScope.LoadPropertiesByObject($rootScope.WorkflowListData[i].ConditionList[j].ObjectName, $rootScope.WorkflowListData[i].WorkflowId, $rootScope.WorkflowListData[i].ConditionList[j].ConditionId);
            }
        }



        $rootScope.ShowFinalOutputCondition = true;


        if (RuleList.ThenValue.includes('AddDays')) {
            $rootScope.FinalValue.FunctionType = "AddDays";
        }
        else {
            $rootScope.FinalValue.FunctionType = "literal";
        }
        $rootScope.ThenValueText(RuleList.ThenValue, '+');
        $rootScope.FinalValue.FinalOutputValue = "{" + $rootScope.FinalValue.OutputObjectName + "." + $rootScope.FinalValue.OutputPropertyName + "} + " + $rootScope.FinalValue.FunctionType + "(" + $rootScope.FinalValue.FinalThenValue + ")";
        
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




        if (conditionString.includes('(')) {

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
            WorkflowId: 0,
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


            var PropertyAndValue = conditionString[i].split(conditionExpression);

            if (PropertyAndValue[0].length > 0) {

                PropertyAndValue[0] = PropertyAndValue[0].replace("'{", "");
                PropertyAndValue[0] = PropertyAndValue[0].replace("}'", "");
                var objectAndProperty = PropertyAndValue[0].split('.');


                var object = objectAndProperty[0].replace(/\s/g, '');
                var property = objectAndProperty[1].replace(/\s/g, '');

                PropertyAndValue[1] = PropertyAndValue[1].replace("'", "");
                PropertyAndValue[1] = PropertyAndValue[1].replace("'", "");
                var propertyValue = PropertyAndValue[1].replace(/\s/g, '');

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
        
        if (ThenText.includes(sign)) {
            var thenconditionString = ThenText.split(sign);
            for (var i = 0; i < thenconditionString.length; i++) {
                if (thenconditionString[i].includes('{')) {
                    var outputpropertyName = thenconditionString[i].split('{')[1];
                    if (outputpropertyName.includes('}')) {
                        outputpropertyName = outputpropertyName.split('}')[0];

                        outputpropertyName = outputpropertyName.split('.');

                        $rootScope.FinalValue.OutputObjectName = outputpropertyName[0];
                        $rootScope.LoadObjectPropertiesByObject($rootScope.FinalValue.OutputObjectName, 0);
                        $rootScope.FinalValue.OutputPropertyName = outputpropertyName[1];
                    }
                } else if (thenconditionString[i].includes('(')) {
                    var finaloutputValue = thenconditionString[i].split('(')[1];
                    if (finaloutputValue.includes(')')) {
                        var outputValue = finaloutputValue.split(')');
                        $rootScope.FinalValue.FinalThenValue = outputValue[0];
                    }
                }
            }
        }
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

}]).directive('textAutoComplete', ['$filter', function ($filter) {
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