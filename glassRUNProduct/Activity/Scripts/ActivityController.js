angular.module("glassRUNProduct").controller('ActivityController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {

    LoadActiveVariables($sessionStorage, $state, $rootScope);
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true
        };
    }

    $scope.PageUrlName = $location.absUrl().split('#/')[1];

    $scope.ActivityId = 0;

    $scope.SalesAdminApprovalList = [];
    $scope.ServicesActionList = [];
    $scope.PreviousSubActivityList = [];
    $scope.NextSubActivityList = [];
    $scope.PrerequisiteSubActivityList = [];

    $scope.ClearControl = function () {

        $scope.IsActivityHeaderSearchInputFilled = false;
        $scope.IsServiceActionSearchInputFilled = false;
        $scope.IsParentActivityInputFilled = false;

        $scope.SearchControl = {

            InputHeaderName: "",
            FilterActivityHeaderAutoCompletebox: "",
            InputServiceAction: "",
            FilterServiceActionAutoCompletebox: "",
            InputParentActivity: "",
            FilterParentActivityAutoCompletebox: ""

        };

        $scope.ActivityJSON = {
            HeaderName: "",
            ActivityName: "",
            StatusCode: "",
            ServiceAction: "",
            Sequence: "",
            ParentActivity: "",
            IconName: "",
            IsAPP: "",
            IsResponseRequired: "",
            IsSystemDefined: ""
        };

    };
    $scope.ClearControl();
    // Load Header Name 

    $scope.LoadActivityHeaderList = function () {

        $rootScope.Throbber.Visible = true;

        var requestData =
            {
                ServicesAction: 'ActivityHeaderList',
                CompanyId: $rootScope.CompanyId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $rootScope.Throbber.Visible = false;
            var resoponsedata = response.data;
            if (response.data.Json !== undefined) {
                $scope.ActivityHeaderList = resoponsedata.Json.ActivityList;
            }
            $scope.showCompanybox = false;
            $scope.selectedCompanyRow = -1;
        });
    };
    $scope.LoadActivityHeaderList();

    $scope.LoadActivityHeaderList = function () {

        $rootScope.Throbber.Visible = true;

        var requestData =
            {
                ServicesAction: 'ServiceActionList',
                CompanyId: $rootScope.CompanyId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $rootScope.Throbber.Visible = false;
            var resoponsedata = response.data;
            if (response.data.Json !== undefined) {
                $scope.ServicesActionList = resoponsedata.Json.ServicesActionList;
            }
        });

    };

    $scope.LoadActivityHeaderList();

    $scope.LoadParentActivityList = function () {

        $rootScope.Throbber.Visible = true;

        var requestData =
            {
                ServicesAction: 'ParentActivityList',
                CompanyId: $rootScope.CompanyId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $rootScope.Throbber.Visible = false;
            var resoponsedata = response.data;
            if (response.data.Json !== undefined) {
                $scope.ParentActivityList = resoponsedata.Json.ParentActivityList;
            }
        });
    };
    $scope.LoadParentActivityList();

    $scope.LoadSubActivityList = function () {

        $rootScope.Throbber.Visible = true;

        var requestData =
            {
                ServicesAction: 'SubActivityList',
                CompanyId: $rootScope.CompanyId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $rootScope.Throbber.Visible = false;
            var resoponsedata = response.data;
            if (response.data.Json !== undefined) {

                var subActivity = resoponsedata.Json.SubActivityList;
                $scope.PreviousSubActivityList = subActivity;

                var previousSubActivity = angular.copy(subActivity);
                $scope.NextSubActivityList = previousSubActivity;

                var prerequisiteSubActivity = angular.copy(previousSubActivity);
                $scope.PrerequisiteSubActivityList = prerequisiteSubActivity;
            }
        });
    };
    $scope.LoadSubActivityList();

    $scope.LoadPagesList = function () {

        $rootScope.Throbber.Visible = true;

        var requestData =
            {
                ServicesAction: 'LoadAllPagesList',
                ObjectId: 0,
                RoleId: 0
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $rootScope.Throbber.Visible = false;
            var resoponsedata = response.data;
            if (response.data.Json !== undefined) {
                $scope.PagesList = resoponsedata.Json.PagesList;
            }
        });
    };
    $scope.LoadPagesList();


    $scope.DefaultSettingActivityHeaderSearchControl = function () {

        $scope.selectedActivityHeaderRow = -1;
        $scope.showActivityHeaderbox = false;
        $scope.ActivityHeaderfoundResult = false;
    };
    $scope.DefaultSettingActivityHeaderSearchControl();

    $scope.IsActivityHeaderSearchInputFilled = false;
    $scope.ActivityHeaderfoundResult = false;

    $scope.SelectedActivityHeader = function (activityName) {


        $scope.showActivityHeaderbox = true;
        $scope.IsActivityHeaderSearchInputFilled = true;
        $scope.SearchControl.FilterActivityHeaderAutoCompletebox = activityName;
    };

    $scope.ShowActivityHeaderListBox = function () {


        $scope.showActivityHeaderbox = !$scope.showActivityHeaderbox;
    };

    $scope.ClearActivityHeaderInputSearchbox = function () {


        $scope.IsActivityHeaderSearchInputFilled = false;
        $scope.showActivityHeaderbox = false;
        $scope.SearchControl.InputHeaderName = '';
        $scope.SearchControl.FilterActivityHeaderAutoCompletebox = '';
    };

    $scope.SelectActivityHeader = function (name) {

        $scope.SearchControl.InputHeaderName = name;
        $scope.showActivityHeaderbox = false;
        $scope.selectedActivityHeaderRow = -1;
        $scope.IsActivityHeaderSearchInputFilled = true;
    };

    // Grid Configuration And Activity Grid.
    $scope.LoadGridConfigurationData = function () {

        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                ObjectId: 178,
                PageName: $rootScope.PageName,
                ControllerName: $scope.PageUrlName
            };

        //var stringfyjson = JSON.stringify(requestData);
        var gridconsolidateApiParamater =
            {
                Json: gridrequestData
            };


        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
            if (response.data !== undefined) {
                if (response.data.Json !== undefined) {
                    $scope.GridColumnList = response.data.Json.GridColumnList;
                }
            }
            //else {
            //
            //}
            $scope.LoadActivityGrid();
        });
    };
    $scope.LoadGridConfigurationData();


    //#region Load Sales Admin Approval Grid
    $scope.LoadActivityGrid = function () {


        var ActivityGridData = new DevExpress.data.CustomStore({

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

                var StatusCode = "";
                var StatusCodeCriteria = "";

                var Header = "";
                var HeaderCriteria = "";

                var ActivityName = "";
                var ActivityNameCriteria = "";

                //var ControlName = "";
                //var ControlNameCriteria = "";



                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "StatusCode") {
                            if (StatusCode === "") {
                                if (fields.length > 1) {
                                    StatusCodeCriteria = "=";
                                } else {
                                    StatusCodeCriteria = columnsList[1];
                                }
                                StatusCodeCriteria = columnsList[1];
                                StatusCode = columnsList[2];
                            }
                        }
                        if (columnsList[0] === "Header") {
                            HeaderCriteria = columnsList[1];
                            Header = columnsList[2];
                        }
                        if (columnsList[0] === "ActivityName") {
                            ActivityNameCriteria = columnsList[1];
                            ActivityName = columnsList[2];
                        }
                        //if (columnsList[0] === "ControlName") {
                        //    ControlNameCriteria = columnsList[1];
                        //    ControlName = columnsList[2];
                        //}
                    }
                }

                var OrderBy = "";
                var OrderByCriteria = "";
                if (loadOptions.sort !== null && loadOptions.sort !== undefined) {
                    if (loadOptions.sort[0].desc === true) {
                        OrderByCriteria = "desc";
                    } else {
                        OrderByCriteria = "asc";
                    }
                    if (loadOptions.sort[0].selector === "Carrier") {
                        OrderBy = "Carrier";
                    }
                    else {
                        OrderBy = loadOptions.sort[0].selector;
                    }

                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));


                var requestData =
                    {
                        ServicesAction: 'LoadActivityGrid',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: OrderBy,
                        OrderByCriteria: OrderByCriteria,
                        FinancerId: $rootScope.CompanyId,
                        IsExportToExcel: '0',
                        RoleMasterId: $rootScope.RoleId,
                        LoginId: $rootScope.UserId,
                        CultureId: $rootScope.CultureId,
                        StatusCode: StatusCode,
                        StatusCodeCriteria: StatusCodeCriteria,
                        Header: Header,
                        HeaderCriteria: HeaderCriteria,
                        ActivityName: ActivityName,
                        ActivityNameCriteria: ActivityNameCriteria
                        //ControlName: ControlName,
                        //ControlNameCriteria: ControlNameCriteria

                    };

                $scope.RequestDataFilter = requestData;


                var consolidateApiParamater =
                    {
                        Json: requestData
                    };

                console.log("2" + new Date());
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {

                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.ActivityList.length !== undefined) {
                                if (resoponsedata.Json.ActivityList.length > 0) {
                                    totalcount = resoponsedata.Json.ActivityList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.ActivityList.TotalCount;
                            }

                            ListData = resoponsedata.Json.ActivityList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }
                    //var inquiryList = {
                    //    data: ListData,
                    //    totalRecords: totalcount
                    //}
                    for (var i = 0; i < ListData.length; i++) {
                        ListData[i].CheckedEnquiry = false;
                    }

                    var data = ListData;
                    $scope.SalesAdminApprovalList = $scope.SalesAdminApprovalList.concat(data);

                    if ($scope.GridConfigurationLoaded === false) {
                        //$scope.LoadGridByConfiguration();
                    }

                    return data;
                });
            }
        });

        $scope.ActivityGrid = {
            dataSource: {
                store: ActivityGridData
            },
            bindingOptions: {

            },
            showBorders: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            loadPanel: {
                enabled: false,
                Type: Number,
                width: 200
            },
            scrolling: {
                mode: "infinite",
                showScrollbar: "always", // or "onClick" | "always" | "never"
                scrollByThumb: true
            },
            showColumnLines: true,
            showRowLines: true,

            columnChooser: {
                enabled: true,
                mode: "select"
            },
            columnFixing: {
                enabled: true
            },
            groupPanel: {
                visible: true
            },
            keyExpr: "ActivityName",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {



                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        if (data.IsActivityUsedInWorkflow === "0") {
                            $scope.EditActivity(data.ActivityId);
                        } else {
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_ActivityAlreadyUsed), 'error', 8000);
                        }

                    }
                    if (e.column.cellTemplate === "Delete") {
                        if (data.IsActivityUsedInWorkflow === "0") {
                            $scope.OpenDeleteConfirmation(data.ActivityId, data.StatusCode);
                        } else {
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_ActivityAlreadyUsed), 'error', 8000);
                        }
                    }
                }

            },

            columnsAutoWidth: true,
            rowAlternationEnabled: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            headerFilter: {
                visible: false,
                allowSearch: false
            },
            remoteOperations: {
                sorting: true,
                filtering: true,
                paging: true
            },
            paging: {
                pageSize: 20
            },

            //loadPanel: {
            //    Type: Number,
            //    width: 200
            //},

            columns: [{
                dataField: "Header",
                alignment: "left"
            }, {
                dataField: "ActivityName",
                alignment: "left"
            }, {
                dataField: "StatusCode",
                alignment: "left",
                filterOperations: ['=', '>', '<']
            },
            {
                caption: "Edit",
                dataField: "ActivityId",
                cssClass: "ClickkableCell EnquiryNumberUI",
                cellTemplate: "Edit",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 150
            },

            {
                caption: "Delete",
                dataField: "ActivityId",
                cssClass: "ClickkableCell EnquiryNumberUI",
                cellTemplate: "Delete",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 150
            }]
        };
    };
    //#endregion

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {

        $scope.SalesAdminApprovalList = [];
        $scope.IsEnquiryEdit = false;
        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#ActivityGrid").dxDataGrid("instance");
        dataGrid.refresh();

    };

    $scope.AddForm = function () {

        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        //$scope.ClearControls();
    };



    $scope.ViewForm = function () {

        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        //$scope.ClearControls();
    };
    $scope.ViewForm();

    $scope.DefaultSettingServiceActionSearchControl = function () {


        $scope.selectedServiceActionHeaderRow = -1;
        $scope.showActivityHeaderbox = false;
        $scope.ServiceActionfoundResult = false;

    };
    $scope.DefaultSettingServiceActionSearchControl();

    $scope.IsActivityHeaderSearchInputFilled = false;
    $scope.ServiceActionfoundResult = false;

    $scope.SelectedServiceAction = function (activityName) {


        $scope.showServiceActionHeaderbox = true;
        $scope.IsServiceActionSearchInputFilled = true;
        $scope.SearchControl.FilterServiceActionAutoCompletebox = activityName;
    };

    $scope.ShowServiceActionHeaderListBox = function () {


        $scope.showServiceActionHeaderbox = !$scope.showServiceActionHeaderbox;
    };

    $scope.ClearServiceActionHeaderInputSearchbox = function () {


        $scope.IsServiceActionSearchInputFilled = false;
        $scope.showServiceActionHeaderbox = false;
        $scope.SearchControl.InputServiceAction = '';
        $scope.SearchControl.FilterServiceActionAutoCompletebox = '';

    };

    $scope.SelectServiceAction = function (name) {

        $scope.SearchControl.InputServiceAction = name;
        $scope.showServiceActionHeaderbox = false;
        $scope.selectedServiceActionHeaderRow = -1;
        $scope.IsServiceActionSearchInputFilled = true;
    };




    $scope.DefaultSettingServiceActionSearchControl = function () {


        $scope.selectParentActivityRow = -1;
        $scope.showActivityHeaderbox = false;
        $scope.ParentActivityfoundResult = false;

    };
    $scope.DefaultSettingServiceActionSearchControl();

    $scope.IsActivityHeaderSearchInputFilled = false;
    $scope.ParentActivityfoundResult = false;

    $scope.SelectedParentActivity = function (activityName) {


        $scope.showParentActivitybox = true;
        $scope.IsParentActivityInputFilled = true;
        $scope.SearchControl.FilterParentActivityAutoCompletebox = activityName;
    };

    $scope.ShowParentActivityListBox = function () {


        $scope.showParentActivitybox = !$scope.showParentActivitybox;
    };

    $scope.ClearParentActivityInputSearchbox = function () {


        $scope.IsParentActivityInputFilled = false;
        $scope.showParentActivitybox = false;
        $scope.SearchControl.InputParentActivity = '';
        $scope.SearchControl.FilterParentActivityAutoCompletebox = '';

    };

    $scope.SelectParentActivity = function (name) {

        $scope.SearchControl.InputParentActivity = name;
        $scope.showParentActivitybox = false;
        $scope.selectParentActivityRow = -1;
        $scope.IsParentActivityInputFilled = true;
    };


    //#region Disable SubActivity Checkboxes if it is selected earlier
    $scope.DisableActivityListCheckbox = function (listName, activityId) {

        if (listName === "Previous") {
            //alert(listName);

            var nextSubActivityList = $scope.NextSubActivityList.filter(function (el) { return el.ActivityId === activityId; });
            var prerequisiteSubActivitySelectedList = $scope.PrerequisiteSubActivityList.filter(function (el) { return el.ActivityId === activityId && el.IsPossiblePrerequisiteSelected === true; });

            if (prerequisiteSubActivitySelectedList.length <= 0) {
                if (nextSubActivityList.length > 0) {
                    if (nextSubActivityList[0].IsDisabled === true) {
                        nextSubActivityList[0].IsDisabled = false;
                    }
                    else {
                        nextSubActivityList[0].IsDisabled = true;
                    }
                }
            }
            else {
                nextSubActivityList[0].IsDisabled = true;
            }
        }
        else if (listName === "Next") {
            //alert(listName);

            var previousSubActivityList = $scope.PreviousSubActivityList.filter(function (el) { return el.ActivityId === activityId; });
            if (previousSubActivityList.length > 0) {
                if (previousSubActivityList[0].IsDisabled === true) {
                    previousSubActivityList[0].IsDisabled = false;
                }
                else {
                    previousSubActivityList[0].IsDisabled = true;
                }
            }


            var prerequisiteSubActivityList = $scope.PrerequisiteSubActivityList.filter(function (el) { return el.ActivityId === activityId; });
            if (prerequisiteSubActivityList.length > 0) {
                if (prerequisiteSubActivityList[0].IsDisabled === true) {
                    prerequisiteSubActivityList[0].IsDisabled = false;
                }
                else {
                    prerequisiteSubActivityList[0].IsDisabled = true;
                }
            }
        }
        else if (listName === "Prerequisite") {
            //alert(listName);

            var nextSubActivityList = $scope.NextSubActivityList.filter(function (el) { return el.ActivityId === activityId; });
            var previousSubActivitySelectedList = $scope.PreviousSubActivityList.filter(function (el) { return el.ActivityId === activityId && el.IsPossiblePreviousSelected === true; });

            if (previousSubActivitySelectedList.length <= 0) {
                if (nextSubActivityList.length > 0) {
                    if (nextSubActivityList[0].IsDisabled === true) {
                        nextSubActivityList[0].IsDisabled = false;
                    }
                    else {
                        nextSubActivityList[0].IsDisabled = true;
                    }
                }
            }
            else {
                nextSubActivityList[0].IsDisabled = true;
            }
        }
    };
    //#endregion


    $scope.Save = function () {
        debugger;


        if ($scope.SearchControl.InputHeaderName !== "") {
            if ($scope.ActivityJSON.ActivityName !== "") {
                if ($scope.ActivityJSON.StatusCode !== "") {


                    var serviceActionMethod = "";

                    if (parseInt($scope.ActivityId) > 0) {
                        serviceActionMethod = "UpdateActivity";
                    }
                    else {
                        serviceActionMethod = "InsertActivity";
                    }

                    var parentActivity = $scope.ParentActivityList.filter(function (el) { return el.Name === $scope.SearchControl.InputParentActivity });
                    var parentId = 0;
                    if (parentActivity.length > 0) {
                        parentId = parentActivity[0].ActivityId;
                    }

                    var previousSubActivityList = $scope.PreviousSubActivityList.filter(function (el) { return el.IsPossiblePreviousSelected === true; });
                    var nextSubActivityList = $scope.NextSubActivityList.filter(function (el) { return el.IsPossibleNextSelected === true; });
                    var prerequisiteSubActivityList = $scope.PrerequisiteSubActivityList.filter(function (el) { return el.IsPossiblePrerequisiteSelected === true; });

                    var pagesList = $scope.PagesList.filter(function (el) { return el.IsPageSelected === true; });

                    var SelectedPages = [];
                    if (pagesList.length > 0) {
                        for (var i = 0; i < pagesList.length; i++) {
                            var pages = {
                                StatusCode: $scope.ActivityJSON.StatusCode,
                                FormName: pagesList[i].PageName,
                                FormURL: pagesList[i].ControllerName,
                                FormType: 2401
                            };
                            SelectedPages.push(pages);
                        }
                    }

                    var requestData =
                        {
                            ServicesAction: serviceActionMethod,
                            ActivityId: $scope.ActivityId,
                            StatusCode: $scope.ActivityJSON.StatusCode,
                            Header: $scope.SearchControl.InputHeaderName,
                            ActivityName: $scope.ActivityJSON.ActivityName,
                            ServiceAction: $scope.SearchControl.InputServiceAction,
                            Sequence: $scope.ActivityJSON.Sequence,
                            IsResponseRequired: $scope.ActivityJSON.IsResponseRequired,
                            ResponsePropertyName: "",
                            RejectedStatus: "",
                            IsApp: $scope.ActivityJSON.IsAPP,
                            ParentId: parentId,
                            IconName: $scope.ActivityJSON.IconName,
                            ActivityPreviousStepsList: previousSubActivityList,
                            ActivityPossibleStepsList: nextSubActivityList,
                            ActivityPrerequisiteStepsList: prerequisiteSubActivityList,
                            ActivityFormMappingList: SelectedPages,
                            PageName: 'Activity',
                            RoleId: $rootScope.RoleId,
                            UserId: $rootScope.UserId
                        };


                    var jsonobject = {};
                    jsonobject.Json = requestData;
                    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                        debugger;
                        if (response.data.Json !== undefined) {
                            if (response.data.Json.ActivityId === "-1") {
                                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ActivityPage_DuplicateStatusCode), 'error', 8000);
                            } else {
                                $scope.Clear();
                                $scope.ViewForm();
                                $scope.RefreshDataGrid();
                                if (serviceActionMethod == "InsertActivity") {
                                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_RecordSaved), 'error', 8000);
                                }
                                else {
                                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CustomerPaymentDetailPage_SendPaymentRequest), 'error', 8000);
                                }
                            }
                        }
                        else if (response.data.ErrorValidationMessage != undefined) {
                            $rootScope.ValidationErrorAlert(response.data.ErrorValidationMessage +  String.format($rootScope.resData.res_ServerSideVlaidationMsg_View), '', 3000);
                            $rootScope.Throbber.Visible = false;
                        }
                    });

                } else {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_Activity_StatusCode), 'error', 8000);
                }
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_Activity_ActivityName), 'error', 8000);
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_Activity_HeaderName), 'error', 8000);
        }



    };


    $scope.Clear = function () {

        $scope.ClearControl();

        $scope.ActivityId = 0;

        var previousSubActivityList = $scope.PreviousSubActivityList.filter(function (el) { return el.IsPossiblePreviousSelected === true; });
        for (var i = 0; i < previousSubActivityList.length; i++) {
            previousSubActivityList[i].IsPossiblePreviousSelected = false;
        }
        var nextSubActivityList = $scope.NextSubActivityList.filter(function (el) { return el.IsPossibleNextSelected === true; });
        for (var j = 0; j < nextSubActivityList.length; j++) {
            nextSubActivityList[j].IsPossibleNextSelected = false;
        }
        var prerequisiteSubActivityList = $scope.PrerequisiteSubActivityList.filter(function (el) { return el.IsPossiblePrerequisiteSelected === true; });
        for (var k = 0; k < prerequisiteSubActivityList.length; k++) {
            prerequisiteSubActivityList[k].IsPossiblePrerequisiteSelected = false;
        }
        var pagesList = $scope.PagesList.filter(function (el) { return el.IsPageSelected === true; });
        for (var l = 0; l < pagesList.length; l++) {
            pagesList[l].IsPageSelected = false;
        }

    };


    $scope.EditActivity = function (activityId) {


        var requestData =
            {
                ServicesAction: "ActivityByActivityId",
                ActivityId: activityId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (response.data !== undefined) {
                if (response.data.Json !== undefined) {

                    $scope.LoadEditActivityForm(response.data.Json.Activity);
                }
            }
        });
    };

    $scope.LoadEditActivityForm = function (activityJson) {
        debugger;

        //alert(activityJson.IsSystemDefined);
        $scope.ActivityId = activityJson.ActivityId;

        $scope.SearchControl.InputHeaderName = activityJson.Header;

        //$scope.IsServiceActionSearchInputFilled = true;

        $scope.SearchControl.InputServiceAction = activityJson.ServiceAction;

        var parentActivity = $scope.ParentActivityList.filter(function (el) { return el.ActivityId === activityJson.ParentId; });
        var parentIdActivityName = "";
        if (parentActivity.length > 0) {
            parentIdActivityName = parentActivity[0].ActivityName;
        }

        $scope.SearchControl.InputParentActivity = parentIdActivityName;

        //$scope.IsParentActivityInputFilled = true;


        $scope.ActivityJSON.ActivityName = activityJson.ActivityName;
        $scope.ActivityJSON.StatusCode = parseInt(activityJson.StatusCode);
        $scope.ActivityJSON.Sequence = activityJson.Sequence;

        if (activityJson.IsApp === "1") {
            $scope.ActivityJSON.IsAPP = true;
        }

        if (activityJson.IsResponseRequired === "1") {
            $scope.ActivityJSON.IsResponseRequired = true;
        }

        if (activityJson.IsSystemDefined === "1") {
            $scope.ActivityJSON.IsSystemDefined = true;
        } else {
            $scope.ActivityJSON.IsSystemDefined = false;
        }

        $scope.ActivityJSON.IconName = activityJson.IconName;




        if (activityJson.ActivityPreviousSteps !== undefined) {
            var activityPreviousSteps = activityJson.ActivityPreviousSteps;
            for (var i = 0; i < activityPreviousSteps.length; i++) {
                var step = $scope.PreviousSubActivityList.filter(function (el) { return el.StatusCode === activityPreviousSteps[i].PreviousStatusCode; });
                if (step.length > 0) {
                    step[0].IsPossiblePreviousSelected = true;
                    $scope.DisableActivityListCheckbox('Previous', step[0].ActivityId);
                } else {
                    activityPreviousSteps[i].IsPossiblePreviousSelected = false;
                    $scope.DisableActivityListCheckbox('Previous', activityPreviousSteps[0].ActivityId);
                }
            }
        }

        if (activityJson.ActivityPossibleSteps !== undefined) {
            var activityPossibleSteps = activityJson.ActivityPossibleSteps;
            for (var i = 0; i < activityPossibleSteps.length; i++) {
                var step = $scope.NextSubActivityList.filter(function (el) { return el.StatusCode === activityPossibleSteps[i].PossibleStatusCode; });
                if (step.length > 0) {
                    step[0].IsPossibleNextSelected = true;
                    $scope.DisableActivityListCheckbox('Next', step[0].ActivityId);
                } else {
                    activityPossibleSteps[i].IsPossibleNextSelected = false;
                    $scope.DisableActivityListCheckbox('Next', activityPossibleSteps[0].ActivityId);
                }
            }
        }

        if (activityJson.ActivityPrerequisiteSteps !== undefined) {
            var activityPrerequisiteSteps = activityJson.ActivityPrerequisiteSteps;
            for (var i = 0; i < activityPrerequisiteSteps.length; i++) {
                var step = $scope.PrerequisiteSubActivityList.filter(function (el) { return el.StatusCode === activityPrerequisiteSteps[i].PrerequisiteStatusCode; });
                if (step.length > 0) {
                    step[0].IsPossiblePrerequisiteSelected = true;
                    $scope.DisableActivityListCheckbox('Prerequisite', step[0].ActivityId);
                } else {
                    activityPrerequisiteSteps[i].IsPossiblePrerequisiteSelected = false;
                    $scope.DisableActivityListCheckbox('Prerequisite', activityPrerequisiteSteps[0].ActivityId);
                }
            }
        }

        if (activityJson.ActivityFormMapping !== undefined) {
            var activityFormMapping = activityJson.ActivityFormMapping;
            for (var i = 0; i < activityFormMapping.length; i++) {
                var step = $scope.PagesList.filter(function (el) { return el.ControllerName === activityFormMapping[i].FormURL; });
                if (step.length > 0) {
                    step[0].IsPageSelected = true;
                } else {
                    activityFormMapping[i].IsPageSelected = false;
                }
            }
        }





        $scope.AddForm();


    };


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

    $scope.DeleteActivityId = 0;
    $scope.DeleteStatusCode = 0;

    $scope.OpenDeleteConfirmation = function (DeleteActivityId, DeleteStatusCode) {


        $scope.DeleteActivityId = DeleteActivityId;
        $scope.DeleteStatusCode = DeleteStatusCode;

        $scope.DeleteWarningMessageControl.show();
    };

    $scope.DeleteActivity = function () {


        var requestData =
            {
                ServicesAction: "DeleteActivityByActivityId",
                ActivityId: $scope.DeleteActivityId,
                StatusCode: $scope.DeleteStatusCode,
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $scope.CloseDeleteConfirmation();
            $scope.RefreshDataGrid();
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_DeletedSuccess), 'error', 8000);
        });


    };


    //$('.selected-items-box').bind('click', function (e) {
    //    $('.wrapper .list').slideToggle('fast');
    //});

});