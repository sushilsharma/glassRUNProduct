angular.module("glassRUNProduct").controller('EntityRelationshipController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {


    //#region Declare Throbber

    $scope.selectedRow = -1;
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }
    //#endregion


    $rootScope.IsEditEntityRelationship = false;



    //#region Loading Active Session
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_RuleEnginePage_Rule_Configuration;
    //#endregion

    //#region Declare variable

    $rootScope.ReturnRuleIdToWorkflow = '';
    $rootScope.RuleFunctionList = [];
    $rootScope.MasterRuleFunctionList = [];
    $rootScope.RuleTypeFunctionMappingList = [];
    $rootScope.EditMultiOutPutListData = [];
    //Filter Variable..
    $scope.FilterRuleTypeId = 0;
    $scope.FilterRuleText = '';
    $scope.FilterRuleEnable = '1';

    $scope.Filter = {
        FilterByRuleType: '',
        SortByObject: '',
        GroupByProperty: ''
    }




    $rootScope.SelectedRuleId = 0;
    $rootScope.FinalValue = {
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
    $scope.FilterEnable = true;
    $rootScope.MultipleFinalValue = {
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


    $rootScope.MultiOutPutListData = [];

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



    $scope.AddNewEntityRelationship = function () {
        $rootScope.ExitsRuleId = '0';
        $rootScope.SelectedPrimaryEntity = 0;
        $rootScope.addnewrulediv = false;
        $rootScope.EntityRelationshipFirstTab = false;
        $rootScope.EntityRelationshipSecondTab = true;
        $rootScope.ShowEditPanel = false;
    }


    $rootScope.EntityRelationshipFirstTab = true;
    $rootScope.EntityRelationshipSecondTab = false;
    //#endregion



    //#region Load Rule Grid
    $rootScope.LoadEntityRelationshipGridGrid = function () {



        console.log("1" + new Date());

        var EntityRelationshipGridData = new DevExpress.data.CustomStore({

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

                var FilterRuleId = "";
                var ruleTypeNot = "";


                ruleTypeNot = '6';

                if ($rootScope.RedirectToRulePage) {
                    ruleTypeNot = '6';

                    if ($rootScope.RedirectNotificationToRulepage) {
                        ruleTypeNot = '7';
                        //alert($rootScope.WorkflowRuleId);
                        if ($rootScope.WorkflowRuleId != undefined) {
                            FilterRuleId = $rootScope.WorkflowRuleId;
                            $scope.FilterRuleTypeId = 7;
                            ruleTypeNot = '0';
                        }
                    }
                    else {
                        if ($rootScope.WorkflowRuleId != undefined) {
                            FilterRuleId = $rootScope.WorkflowRuleId;
                            $scope.FilterRuleTypeId = 6;
                            ruleTypeNot = '0';
                        }
                    }

                }


                var index = parameters.skip / parameters.take;


                var requestData =
                {
                    ServicesAction: 'LoadEntityRelationship',
                    PageIndex: index,
                    PageSize: parameters.take,
                    RuleTypeNot: ruleTypeNot,
                    OrderBy: "",
                    RuleId: FilterRuleId,
                    RuleType: $scope.FilterRuleTypeId,
                    RuleText: $scope.FilterRuleText,
                    RuleTextCriteria: 'contains',
                    Enable: $scope.FilterRuleEnable,
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


                    var totalcount = null;
                    var ListData = null;
                    var inquiryList = {};
                    var resoponsedata = response.data;
                    if (resoponsedata.Json !== undefined) {

                        totalcount = resoponsedata.Json.EntityRelationshipList[0].TotalCount
                        ListData = resoponsedata.Json.EntityRelationshipList;

                        var retunRuleId = '';
                        for (var i = 0; i < ListData.length; i++) {
                            if (ListData[i].FromDate === "01/01/1900") {
                                ListData[i].FromDate = "";
                            }
                            if (ListData[i].ToDate === "01/01/1900") {
                                ListData[i].ToDate = "";
                            }

                            if ($rootScope.RedirectToRulePage) {
                                if (retunRuleId !== '') {
                                    retunRuleId = retunRuleId + ',' + ListData[i].RuleId;
                                } else {
                                    retunRuleId = ListData[i].RuleId;
                                }

                            }

                        }

                        $rootScope.WorkflowRuleId = retunRuleId;

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

        $scope.EntityRelationshipGrid = {
            dataSource: {
                store: EntityRelationshipGridData,
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
            keyExpr: "RuleId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                var primaryEntity = e.data.PrimaryEntity;
                $rootScope.SelectedPrimaryEntity = primaryEntity;
                debugger;
                $scope.EditEntityRelationship(primaryEntity, 0);
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
                    dataField: "RuleId",

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
                    cellTemplate: "EntityRelationshipTemplate",
                }],
        };
    }

    $rootScope.LoadEntityRelationshipGridGrid();

    $rootScope.EntityRelationshipGridCallBack = function () {

        var dataGrid = $("#EntityRelationshipGrid").dxDataGrid("instance");
        dataGrid.refresh();

    }
    //#endregion





    //#region Popup Delete Confirmation

    $scope.DeleteEntityRelationshipConfirmationModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/EntityRelationshipDeleteConfirmation.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {

            $scope.DeleteEntityRelationshipConfirmationPopup = modal;
        });
    }
    $scope.DeleteEntityRelationshipConfirmationModalPopup();
    $scope.OpenEntityRelationshipDeleteConfirmationModalPopup = function (PrimaryId) {


        $scope.ConfirmEntityRelationshipDeletePrimaryId = PrimaryId;
        $scope.DeleteEntityRelationshipConfirmationPopup.show();
    }

    $scope.CloseEntityRelationshipDeleteConfirmationModalPopup = function () {

        $scope.DeleteEntityRelationshipConfirmationPopup.hide();
    }

    //#endregion



    //#region Delete Rule



    $scope.DeleteEntityRelationship = function (PrimaryEntity) {

        var requestData =
        {
            ServicesAction: 'DeleteEntityRelationship',
            PrimaryEntity: PrimaryEntity


        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            $scope.CloseEntityRelationshipDeleteConfirmationModalPopup();

            $rootScope.ShowEditPanel = false;
            $rootScope.EntityRelationshipGridCallBack();
            $rootScope.ValidationErrorAlert('Relationship Delete Successfully..', 'warning', 10000);

        });

    }


    $scope.DeleteEntityOnConfirm = function () {


        $scope.DeleteEntityRelationship($scope.ConfirmEntityRelationshipDeletePrimaryId);
    }

    $rootScope.CompanyMnemonic = "";
    //#endregion

    //#region Edit Rule
    $scope.LoadEditEntityRecord = function () {
        debugger;
        $rootScope.addnewrulediv = true;
        $rootScope.EntityRelationshipFirstTab = false;
        $rootScope.EntityRelationshipSecondTab = true;

    }


    $rootScope.EditEntityRelationship = function (primaryEntity, EditFrom) {
        $rootScope.IsEditEntityRelationship = false;
        var requestData =
        {
            ServicesAction: 'GetEntityRelationshipByPrimaryEntity',
            PrimaryEntity: primaryEntity
        };


        var consolidateApiParamater =
        {
            Json: requestData,
        };


        $rootScope.Throbber.Visible = true;
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {



            if (response.data.Json !== undefined) {
                $rootScope.EntityRelationshipData = response.data.Json.EntityRelationshipList;
                $rootScope.Throbber.Visible = false;

                if ($rootScope.EntityRelationshipData.length > 0) {

                    $rootScope.IsEditEntityRelationship = true;
                    $rootScope.PrimaryEntity = primaryEntity;
                    $rootScope.PrimaryEntityCompanyTypeId = $rootScope.EntityRelationshipData[0].CompanyTypeId;

                    $rootScope.PrimaryComapnyName = $rootScope.EntityRelationshipData[0].PrimaryComapnyName;
                    $rootScope.PrimaryCompanyMnemonic = $rootScope.EntityRelationshipData[0].PrimaryCompanyMnemonic;
                    $rootScope.ReloadEditSection();

                    $rootScope.ShowTimePeriod = true;
                    $rootScope.ShowEditPanel = true;
                }


            }
            else {
                $rootScope.Throbber.Visible = false;
            }



        });

    }
    //#endregion



});