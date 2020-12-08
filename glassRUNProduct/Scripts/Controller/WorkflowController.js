angular.module("glassRUNProduct").controller('WorkflowController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {

    //#region Declare Throbber
    
    $rootScope.SelectedRuleId = 0;
    $scope.selectedRow = -1;
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }
    //#endregion

    //#region Loading Active Session
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $rootScope.res_PageHeaderTitle = "Workflow";
    //#endregion

    //#region Declare variable

    $rootScope.SelectedRuleType = 0;

    if (!$rootScope.RedirectToRulePage) {
        $rootScope.WorkflowListData = [];
    }


    if (!$rootScope.RedirectToRulePage) {
        $rootScope.WorkFinalValue = {
            WorkFlowCode: "",
            WorkFlowId: 0,
            WorkFlowName: "",
            WorkFlowRule: "",
            FinalOutputValue: "",
            RuleStartDate: "",
            RuleEndDate: "",
            FunctionType: "",
            OutputObjectName: "",
            OutputPropertyName: "",
            FinalThenValue: "",
            Id: 0,
            DetailsRuleName: '',
            DetailsDescription: '',
            Enable: true,
            IsResponseRequired: true,
            IsActive: true
        }
    }
    $rootScope.addnewrulediv = false;
    $scope.FilterByListSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }
    $scope.FilterByListSelectedList = [];

    $scope.SortByListSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }
    $scope.SortBySelectedList = [];
    $scope.GroupByListSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }
    $scope.GroupBySelectedList = [];
    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_BusinessRuleEnginePage_HeaderPageName;
    $rootScope.RuleTypeDefault = "RuleEngine";
    $rootScope.IsControlVisible = true;
    $rootScope.ShowEditPanel = false;
    //#endregion



    //#region Loading value on page load



    $scope.AddNewWorkflow = function () {
        
        //alert('AddNewWorkflowWorkFlowCode');
        //$rootScope.LoadRuleTypeToCreateNewRule(0,'');
        $rootScope.WorkflowListData.EditWorkFlowId = 0
        $rootScope.WorkflowListData.WorkFlowCode = '';
        $rootScope.WorkFinalValue = {
            FinalOutputValue: "",
            RuleStartDate: "",
            RuleEndDate: "",
            FunctionType: "",
            OutputObjectName: "",
            OutputPropertyName: "",
            FinalThenValue: "",
            Id: 0,
            DetailsRuleName: '',
            DetailsDescription: '',
            Enable: true,
            IsResponseRequired: true,
            IsActive: true
        }

        $rootScope.addnewrulediv = false;
        $rootScope.FirstTab = false;
        $rootScope.SecondTab = false;
        $rootScope.ThirdTab = true;
        $rootScope.FourthTab = false;
        $rootScope.ShowEditPanel = false;
        $rootScope.SelectedRuleId = 0;
        $rootScope.LoadAllActivityList();

    }
    $rootScope.FirstTab = true;
    $rootScope.SecondTab = false;
    $rootScope.ThirdTab = false;
    $rootScope.FourthTab = false;
    //#endregion

    //#region Loading Grid
    $scope.AddAttributeToKendoDatePikcer = function () {

        var elems = angular.element(document.getElementsByClassName("k-picker-wrap"));
        for (var i = 0; i < elems.length; i++) {
            elems[i].setAttribute('data-tap-disabled', true);
        }

    }

    $scope.datepickerfilter = function (element) {
        
        element.kendoDatePicker({ format: "dd/MM/yyyy", parseFormats: "{0:dd/MM/yyyy}", valuePrimitive: true });
    }




    $rootScope.LoadRuleGridGrid = function () {

        

        console.log("1" + new Date());

        var RuleGridData = new DevExpress.data.CustomStore({

            load: function (loadOptions) {
                var parameters = {};

                if (loadOptions.sort) {
                    parameters.orderby = loadOptions.sort[0].selector;
                    if (loadOptions.sort[0].desc)
                        parameters.orderby += " desc";
                }

                parameters.skip = loadOptions.skip || 0;
                parameters.take = loadOptions.take || 100;

                var filterOptions = loadOptions.filter ? loadOptions.filter.join(",") : "";
                var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";


                var orderby = "";
                var config = "";

                var CompanyType = "";
                var CompanyTypeCriteria = "";

                var RuleText = "";
                var RuleTextCriteria = "";

                var FromDate = "";
                var FromDateCriteria = "";

                var ToDate = "";
                var ToDateCriteria = "";

                









                var index = parameters.skip / parameters.take;

                
                var requestData =
                {
                    ServicesAction: 'LoadWorklfowPagesList',
                    PageIndex: index,
                    PageSize: parameters.take,
                    OrderBy: "",
                    RuleType: 0,
                    RuleText: RuleText,
                    RuleTextCriteria: RuleTextCriteria,
                    FromDate: FromDate,
                    FromDateCriteria: FromDateCriteria,
                    ToDate: ToDate,
                    ToDateCriteria: ToDateCriteria,
                    CompanyType: CompanyType,
                    CompanyTypeCriteria: CompanyTypeCriteria
                };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                {
                    Json: requestData,

                };
                $rootScope.Throbber.Visible = true;

                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    
                    $rootScope.SelectedRuleId = 0;
                    var totalcount = null;
                    var ListData = null;
                    var inquiryList = {};
                    var resoponsedata = response.data;
                    if (resoponsedata.Workflow !== undefined) {

                        //totalcount = resoponsedata.Json.RuleList[0].TotalCount
                        //ListData = resoponsedata.Json.RuleList;

                        totalcount = resoponsedata.Workflow.WorkflowList.length;
                        ListData = resoponsedata.Workflow.WorkflowList;

                        $rootScope.WorkflowList = ListData;

                        inquiryList = {
                            data: ListData,
                            totalRecords: totalcount
                        }


                    } else {
                        inquiryList = {
                            data: [],
                            totalRecords: 0
                        }
                    }



                    var inquiryList = {
                        data: ListData,
                        totalRecords: totalcount
                    }


                    var data = ListData;
                    $scope.GridData = data;
                    $rootScope.Throbber.Visible = false;
                    return data;
                });
            }
        });

        $scope.RuleGrid = {
            dataSource: {
                store: RuleGridData,
            },
            bindingOptions: {

            },
            showBorders: true,
            allowColumnReordering: false,
            allowColumnResizing: false,
            columnAutoWidth: false,
            loadPanel: {
                enabled: false
            },
            scrolling: {
                mode: "infinite",
                showScrollbar: "always", // or "onClick" | "always" | "never"
                scrollByThumb: true
            },
            showColumnLines: true,
            showRowLines: true,
            showColumnHeaders: false,
            columnChooser: {
                enabled: false,
                mode: "select"
            },
            columnFixing: {
                enabled: true
            },
            groupPanel: {
                visible: false
            },
            keyExpr: "WorkFlowId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                var WorkFlowId = e.data.WorkFlowId;
                $rootScope.SelectedRuleId = WorkFlowId;
                $scope.EditWorkFlow(WorkFlowId);

            },


            columnsAutoWidth: true,
            rowAlternationEnabled: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            headerFilter: {
                visible: true,
                allowSearch: true
            },
            remoteOperations: {
                sorting: true,
                filtering: true,
                paging: true
            },
            paging: {
                pageSize: 20
            },

            loadPanel: {
                Type: Number,
                width: 200
            },

            columns: [
                {
                    dataField: "WorkFlowId",

                    allowSorting: false,
                    allowFiltering: false,
                    filterRow: {
                        visible: false,
                        applyFilter: "auto"
                    },

                    headerFilter: {
                        visible: false,
                        allowSearch: false
                    },
                    cellTemplate: "RuleTemplate",
                }],
        };
    }

    $rootScope.LoadRuleGridGrid();

    $rootScope.RuleGridCallBack = function () {
        
        var dataGrid = $("#RuleGrid").dxDataGrid("instance");
        dataGrid.refresh();

    }


    //#endregion

    //#region  DeleteWorkFlow
    $scope.DeleteWorkFlow = function () {
        
        var requestData =
        {
            ServicesAction: 'DeleteWorkFlow',
            WorkFlowId: $rootScope.SelectedRuleId


        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };


        

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            
            $rootScope.SelectedRuleId = 0;
            $rootScope.RuleGridCallBack();
            $rootScope.ShowEditPanel = false;
            $rootScope.WorkFinalValue = {
                WorkFlowCode: "",
                WorkFlowId: 0,
                WorkFlowName: "",
                WorkFlowRule: "",
                FinalOutputValue: "",
                RuleStartDate: "",
                RuleEndDate: "",
                FunctionType: "",
                OutputObjectName: "",
                OutputPropertyName: "",
                FinalThenValue: "",
                Id: 0,
                DetailsRuleName: '',
                DetailsDescription: '',
                Enable: true,
                IsResponseRequired: true,
                IsActive: true
            }
            $scope.CloseDeleteConfirmationMessageModalPopup();
            $rootScope.ValidationErrorAlert('Workflow Deleted Successfully..', 'warning', 10000);

        });

    }

    $rootScope.CompanyMnemonic = "";
    //#endregion

    //#region Edit Rule
    $scope.LoadEditRecord = function () {

        $rootScope.addnewrulediv = true;
        $rootScope.FirstTab = false;
        $rootScope.FourthTab = false;
        $rootScope.SecondTab = false;
        $rootScope.ThirdTab = true;
        $rootScope.LoadStartDatePicker();

        $rootScope.LoadAllActivityList();

    }
    $rootScope.LoadWorkflowStep = function () {
        
        $rootScope.addnewrulediv = false;
        $rootScope.FirstTab = false;
        $rootScope.FourthTab = false;
        $rootScope.SecondTab = false;
        $rootScope.ThirdTab = true;

        if (!$rootScope.RedirectToRulePage) {
            $rootScope.LoadAllActivityList();
        }
        

    }


    $rootScope.LoadWorkflowRuleMapping = function () {
        
        $rootScope.addnewrulediv = false;
        $rootScope.FirstTab = false;
        $rootScope.SecondTab = false;
        $rootScope.ThirdTab = false;
        $rootScope.FourthTab = true;
        $rootScope.LoadAllSelectedWorkflowSteps();
        

    }


    if ($rootScope.RedirectToRulePage === true) {
        if ($rootScope.RedirectFrom === 'MainRule') {
            $rootScope.WorkFinalValue.WorkflowRuleId = $rootScope.WorkflowRuleId;
            $rootScope.LoadWorkflowStep();
            $rootScope.RedirectFrom = '';
        }
        else {
            $rootScope.LoadWorkflowRuleMapping();
        }
        $rootScope.RedirectToRulePage = false;
    } else {
        $rootScope.RedirectToRulePage = false;
        $rootScope.FinalWorkFlowRuleText = "";
        $rootScope.FinalWorkFlowRuleId = 0;
    }


    $scope.EditWorkFlow = function (workflowId) {
        debugger;
        var requestData =
        {
            ServicesAction: 'GetWorkFlowById',
            WorkFlowId: workflowId
        };


        var consolidateApiParamater =
        {
            Json: requestData,
        };

        
        $rootScope.Throbber.Visible = true;
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            

            if (response.data !== undefined) {
                var WorkFlowData = response.data.Json.WorkFlowList;
                

                if (response.data.Json.WorkFlowList.WorkFlowId != 0) {



                    $rootScope.WorkflowListData.EditWorkFlowId = WorkFlowData.WorkFlowId;
                    $rootScope.ShowEditPanel = true;
                    $rootScope.WorkFinalValue.Id = WorkFlowData.WorkFlowId;
                    $rootScope.WorkFinalValue.WorkFlowCode = WorkFlowData.WorkFlowCode;
                    $rootScope.WorkFinalValue.ProcessType = WorkFlowData.ProcessType;
                    $rootScope.WorkFinalValue.ProcessTypeValue = WorkFlowData.ProcessTypeValue;
                    $rootScope.WorkflowListData.WorkFlowCode = WorkFlowData.WorkFlowCode;


                    $rootScope.WorkFinalValue.WorkFlowName = WorkFlowData.WorkFlowName;
                    $rootScope.WorkFinalValue.WorkFlowRule = WorkFlowData.WorkFlowRule;
                    $rootScope.WorkFinalValue.FromDate = WorkFlowData.FromDate;
                    $rootScope.WorkFinalValue.ToDate = WorkFlowData.ToDate;
                    $rootScope.WorkFinalValue.WorkflowRuleId = WorkFlowData.WorkflowRuleId;

                    $rootScope.Throbber.Visible = false;
                    // $rootScope.LoadRuleTypeToCreateNewRule($rootScope.FinalValue.Id, '');


                } else {

                }


            }



        });

    }
    //#endregion

    $scope.DeleteConfirmationMessageModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/DeleteConfirmationMessage.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {
            
            $scope.DeleteConfirmationMessagePopup = modal;
        });
    }
    $scope.DeleteConfirmationMessageModalPopup();
    $scope.OpenDeleteConfirmationMessageModalPopup = function () {
        
        $scope.DeleteConfirmationMessagePopup.show();
    }

    $scope.CloseDeleteConfirmationMessageModalPopup = function () {
        
        $scope.DeleteConfirmationMessagePopup.hide();
    }


});