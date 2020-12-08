angular.module("glassRUNProduct").controller('FinanceDashboardController', function ($scope, $q, $state, $timeout, $ionicModal, $location, pluginsService, $rootScope, $sessionStorage, GrRequestService) {
    // #region Session
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    // #endregion
    $scope.SalesAdminApprovalList = [];

    $scope.FinanceDetailDashboard = [];

    var page = $location.absUrl().split('#/')[1];


    $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = false;
        } else {
            $rootScope.Throbber = {
                Visible: false,
            }
        };
    }
    $scope.LoadThrobberForPage();
    

    //#region Grid Configuration
    $scope.LoadGridConfigurationData = function () {
        
        var gridrequestData =
        {
            ServicesAction: 'LoadGridConfiguration',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            CultureId: $rootScope.CultureId,
            ObjectId: 178,
            ObjectName: 'FinanceDashboardController',
            PageName: $rootScope.PageName,
            ControllerName: page
        };

        //var stringfyjson = JSON.stringify(requestData);
        var gridconsolidateApiParamater =
        {
            Json: gridrequestData,
        };


        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
            if (response.data.Json != undefined) {
                $scope.GridColumnList = response.data.Json.GridColumnList;
                $scope.LoadFinanceDashboardGrid();

            } else {

            }
        });
    }
    $scope.LoadGridConfigurationData();
    //#endregion

    //#region Grid Configuration
    $scope.LoadDetailGridConfigurationData = function () {
        
        var gridrequestData =
        {
            ServicesAction: 'LoadGridConfiguration',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            CultureId: $rootScope.CultureId,
            ObjectId: 179,
            ObjectName: 'FinanceDashboardController',
            PageName: $rootScope.PageName,
            ControllerName: page
        };

        //var stringfyjson = JSON.stringify(requestData);
        var gridconsolidateApiParamater =
        {
            Json: gridrequestData,
        };


        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
            if (response.data.Json != undefined) {
                $scope.DetailGridColumnList = response.data.Json.GridColumnList;


            } else {

            }
        });
    }
    $scope.LoadDetailGridConfigurationData();
    //#endregion

    //#region Load Sales Admin Approval Grid
    $scope.LoadFinanceDashboardGrid = function () {

        
        var FinanceDashboardData = new DevExpress.data.CustomStore({

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

                var CarrierName = "";
                var CarrierNameCriteria = "";

                

                if (filterOptions != "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "Carrier") {
                            CarrierNameCriteria = columnsList[1];
                            CarrierName = columnsList[2];
                        }
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
                    ServicesAction: 'LoadFinanceDashboardDetails',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: OrderBy,
                    OrderByCriteria: OrderByCriteria,
                    FinancerId: $rootScope.CompanyId,
                    IsExportToExcel: '0',
                    RoleMasterId: $rootScope.RoleId,
                    LoginId: $rootScope.UserId,
                    CultureId: $rootScope.CultureId,
                    CarrierName: CarrierName,
                    CarrierNameCriteria: CarrierNameCriteria

                };

                $scope.RequestDataFilter = requestData;


                var consolidateApiParamater =
                {
                    Json: requestData,
                };

                console.log("2" + new Date());
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    
                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {
                        
                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.FinanceDashboardList.length !== undefined) {
                                if (resoponsedata.Json.FinanceDashboardList.length > 0) {
                                    totalcount = resoponsedata.Json.FinanceDashboardList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.FinanceDashboardList.TotalCount;
                            }

                            ListData = resoponsedata.Json.FinanceDashboardList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    } var inquiryList = {
                        data: ListData,
                        totalRecords: totalcount
                    }
                    for (var i = 0; i < ListData.length; i++) {
                        ListData[i].CheckedEnquiry = false;
                    }

                    var data = ListData;
                    $scope.SalesAdminApprovalList = $scope.SalesAdminApprovalList.concat(data);

                    if ($scope.GridConfigurationLoaded === false) {
                        $scope.LoadGridByConfiguration();
                    }

                    return data;
                });
            }
        });
        $scope.FinanceDashboardGrid = {
            dataSource: {
                store: FinanceDashboardData,
            },
            bindingOptions: {

            },
            showBorders: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
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
            keyExpr: "EnquiryAutoNumber",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                
                $scope.IsColumnDetailView = false;
                if ($scope.CellCheckboxControl === true || $scope.HeaderCheckboxControl === true) {

                    $scope.IsColumnDetailView = true;

                    if ($scope.CellCheckboxControl === true) {

                        var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.PaymentRequestId === e.data.OrderId; });
                        if (data.length > 0) {
                            data[0].CheckedEnquiry = !data[0].CheckedEnquiry;
                        }
                    }
                    else if ($scope.HeaderCheckboxControl === true) {
                        for (var i = 0; i < $scope.SalesAdminApprovalList.length; i++) {
                            $scope.SalesAdminApprovalList[i].CheckedEnquiry = $scope.HeaderCheckBoxAction;
                        }
                    }

                    $scope.HeaderCheckboxControl = false;
                    $scope.CellCheckboxControl = false;

                }
                if (e.rowType !== "filter" && e.rowType != "header" && e.rowType != "detail") {

                    var detailViewAvailable = $scope.GridColumnList.filter(function (el) { return el.ResourceValue === e.column.caption; });
                    if (detailViewAvailable.length > 0) {
                        if (detailViewAvailable[0].IsDetailsViewAvailable === "1") {

                            $scope.CurrentOpenMasterDetailsObject = e;

                            if (e.column.caption === $rootScope.resData.res_Carrier) {
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($rootScope.PreviousExpandedRow !== "") {
                                        if (e.data !== $rootScope.PreviousExpandedRow) {
                                            e.component.collapseRow($rootScope.PreviousExpandedRow);
                                        }
                                    }
                                    var outerContainerWidth = document.getElementById("FinanceDashboardGrid").clientWidth;
                                    outerContainerWidth = outerContainerWidth - 10;
                                    e.component.expandRow(e.data);
                                    $rootScope.PreviousExpandedRow = e.data;
                                    $rootScope.Throbber.Visible = false;

                                    var elements = document.getElementsByClassName("EnquiryProductInfoClass");
                                    var elementId = "";
                                    for (var i = 0; i < elements.length; i++) {
                                        elementId = elements[i].id;
                                        elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
                                    }
                                    $scope.LoadFinanceDashboardDetails(e.data.CarrierNumber);

                                    
                                }
                            }

                        } else {

                        }
                    }
                } else {
                    $scope.IsColumnDetailView = true;
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

            loadPanel: {
                Type: Number,
                width: 200
            },
            masterDetail: {
                scrolling:
                {
                    enabled: false,
                    visible: false
                },
                enabled: false,
                template: "FinanceDashboardInfo",


            },
            columns: [{
                dataField: "Carrier",
                cssClass: "ClickkableCell EnquiryNumberUI",
                alignment: "left",
            }, {
                dataField: "LoanLimit",
                alignment: "right",
            }, {
                dataField: "DisbursementAmount",
                alignment: "right",
            }, {
                dataField: "CostToRecover",
                alignment: "right",
            }, {
                dataField: "RevenueToRecover",
                alignment: "right",
            }],
        };
    }
    //#endregion

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {
        
        $scope.SalesAdminApprovalList = [];
        $scope.IsEnquiryEdit = false;
        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#FinanceDashboardGrid").dxDataGrid("instance");
        dataGrid.refresh();

    }
    //#endregion

    //#region Export To Excel
    $scope.ExportToExcelSalesAdminApprovalData = function () {
        
        if ($scope.GridColumnList.length > 0) {
            $rootScope.Throbber.Visible = true;
            $scope.RequestDataFilter.ServicesAction = "GetAllEnquiryDetailsForExportforOM";
            $scope.RequestDataFilter.ColumnList = $scope.GridColumnList.filter(function (el) { return el.IsExportAvailable === '1' && el.PropertyName !== 'CheckedEnquiry'; });


            var jsonobject = {};
            jsonobject.Json = $scope.RequestDataFilter;
            jsonobject.Json.IsExportToExcel = '1';

            GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
                
                var byteCharacters1 = response.data;
                if (response.data !== undefined) {
                    var byteCharacters = response.data;
                    var blob = new Blob([byteCharacters], {
                        type: "application/Pdf"
                    });
                    
                    if (blob.size > 0) {
                        var filName = "SalesAdminApproval_" + getDate() + ".xlsx";
                        saveAs(blob, filName);
                        $rootScope.Throbber.Visible = false;
                    } else {
                        $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                        $rootScope.Throbber.Visible = false;
                    }
                }
                else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                    $rootScope.Throbber.Visible = false;
                }
            });
        }
    }
    //#endregion



    //#region On Load Grid Configuration 
    $scope.GridConfigurationLoaded = false;
    $scope.LoadGridByConfiguration = function (e) {
        

        console.log("9" + new Date());

        var dataGrid = $("#FinanceDashboardGrid").dxDataGrid("instance");

        for (var i = 0; i < $scope.GridColumnList.length; i++) {
            if ($scope.GridColumnList[i].IsAvailable === "0" || $scope.GridColumnList[i].IsAvailable === "false" || $scope.GridColumnList[i].IsAvailable === false) {
                dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visible", false);
                dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", false);
            }
            else {

                dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visibleIndex", parseInt($scope.GridColumnList[i].SequenceNumber));
                if ($scope.GridColumnList[i].IsMandatory === "1" || $scope.GridColumnList[i].IsSystemMandatory === "1") {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", false);
                } else {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", true);
                }
                if ($scope.GridColumnList[i].IsPinned === "1" || $scope.GridColumnList[i].IsPinned === "true" || $scope.GridColumnList[i].IsPinned === true) {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "fixed", true);
                }

                if ($scope.GridColumnList[i].IsDefault === "0" || $scope.GridColumnList[i].IsDefault === "false" || $scope.GridColumnList[i].IsDefault === false) {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visible", false);
                }

                if ($scope.GridColumnList[i].IsGrouped === "1") {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "groupIndex", parseInt($scope.GridColumnList[i].GroupSequence));
                }

                if ($scope.GridColumnList[i].IsDetailsViewAvailable === "1" || $scope.GridColumnList[i].IsDetailsViewAvailable === "true" || $scope.GridColumnList[i].IsDetailsViewAvailable === true) {
                    if ($scope.GridColumnList[i].PropertyName === "EnquiryAutoNumber") {
                        dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "cssClass", "ClickkableCell EnquiryNumberUI UnderlineTextUI");
                    }
                } else {
                    if ($scope.GridColumnList[i].PropertyName === "EnquiryAutoNumber") {
                        dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "cssClass", "ClickkableCell EnquiryNumberUI");
                    }
                }


            }

            if ($scope.GridColumnList[i].PropertyName !== "CheckedEnquiry") {
                dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "caption", $scope.GridColumnList[i].ResourceValue);
            }


        }
        $scope.GridConfigurationLoaded = true;
        console.log("10" + new Date());
    }


    $scope.LoadDetailGridByConfiguration = function (e) {
        

        console.log("9" + new Date());

        var dataGrid = $("#FinanceDashboardDetailsGrid").dxDataGrid("instance");

        for (var i = 0; i < $scope.DetailGridColumnList.length; i++) {
            if ($scope.DetailGridColumnList[i].IsAvailable === "0" || $scope.DetailGridColumnList[i].IsAvailable === "false" || $scope.DetailGridColumnList[i].IsAvailable === false) {
                dataGrid.columnOption($scope.DetailGridColumnList[i].PropertyName, "visible", false);
                dataGrid.columnOption($scope.DetailGridColumnList[i].PropertyName, "allowHiding", false);
            }
            else {

                dataGrid.columnOption($scope.DetailGridColumnList[i].PropertyName, "visibleIndex", parseInt($scope.DetailGridColumnList[i].SequenceNumber));
                if ($scope.DetailGridColumnList[i].IsMandatory === "1" || $scope.DetailGridColumnList[i].IsSystemMandatory === "1") {
                    dataGrid.columnOption($scope.DetailGridColumnList[i].PropertyName, "allowHiding", false);
                } else {
                    dataGrid.columnOption($scope.DetailGridColumnList[i].PropertyName, "allowHiding", true);
                }
                if ($scope.DetailGridColumnList[i].IsPinned === "1" || $scope.DetailGridColumnList[i].IsPinned === "true" || $scope.DetailGridColumnList[i].IsPinned === true) {
                    dataGrid.columnOption($scope.DetailGridColumnList[i].PropertyName, "fixed", true);
                }

                if ($scope.DetailGridColumnList[i].IsDefault === "0" || $scope.DetailGridColumnList[i].IsDefault === "false" || $scope.DetailGridColumnList[i].IsDefault === false) {
                    dataGrid.columnOption($scope.DetailGridColumnList[i].PropertyName, "visible", false);
                }

                if ($scope.DetailGridColumnList[i].IsGrouped === "1") {
                    dataGrid.columnOption($scope.DetailGridColumnList[i].PropertyName, "groupIndex", parseInt($scope.DetailGridColumnList[i].GroupSequence));
                }

                if ($scope.DetailGridColumnList[i].IsDetailsViewAvailable === "1" || $scope.DetailGridColumnList[i].IsDetailsViewAvailable === "true" || $scope.DetailGridColumnList[i].IsDetailsViewAvailable === true) {
                    if ($scope.DetailGridColumnList[i].PropertyName === "EnquiryAutoNumber") {
                        dataGrid.columnOption($scope.DetailGridColumnList[i].PropertyName, "cssClass", "ClickkableCell EnquiryNumberUI UnderlineTextUI");
                    }
                } else {
                    if ($scope.DetailGridColumnList[i].PropertyName === "EnquiryAutoNumber") {
                        dataGrid.columnOption($scope.DetailGridColumnList[i].PropertyName, "cssClass", "ClickkableCell EnquiryNumberUI");
                    }
                }


            }

            if ($scope.DetailGridColumnList[i].PropertyName !== "CheckedEnquiry") {
                dataGrid.columnOption($scope.DetailGridColumnList[i].PropertyName, "caption", $scope.DetailGridColumnList[i].ResourceValue);
            }


        }

    }


    $scope.LoadFinanceDashboardDetails = function (carrierId) {
        

        var FinanceDashboardDetailsData = new DevExpress.data.CustomStore({

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


                var SalesOrderNumber = "";
                var SalesOrderNumberCriteria = "";

                var OrderNumber = "";
                var OrderNumberCriteria = "";

                var Vehicle = "";
                var VehicleCriteria = "";

                

                if (filterOptions != "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "SalesOrderNumber") {
                            SalesOrderNumberCriteria = columnsList[1];
                            SalesOrderNumber = columnsList[2];
                        }

                        if (columnsList[0] === "OrderNumber") {
                            OrderNumberCriteria = columnsList[1];
                            OrderNumber = columnsList[2];
                        }

                        if (columnsList[0] === "Vehicle") {
                            VehicleCriteria = columnsList[1];
                            Vehicle = columnsList[2];
                        }
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
                    if (loadOptions.sort[0].selector === "SalesOrderNumber") {
                        OrderBy = "SalesOrderNumber";
                    }
                    else {
                        OrderBy = loadOptions.sort[0].selector;
                    }

                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                
                var requestData =
                {
                    ServicesAction: 'LoadFinanceDashboardByCarrier',
                    PageIndex: parameters.skip,
                    SalesOrderNumberCriteria: SalesOrderNumberCriteria,
                    SalesOrderNumber: SalesOrderNumber,
                    OrderNumberCriteria: OrderNumberCriteria,
                    OrderNumber: OrderNumber,
                    VehicleCriteria: VehicleCriteria,
                    Vehicle: Vehicle,
                    PageSize: index,
                    OrderBy: OrderBy,
                    OrderByCriteria: OrderByCriteria,
                    FinancerId: $rootScope.CompanyId,
                    CarrierId: carrierId,
                    IsExportToExcel: '0',
                    RoleMasterId: $rootScope.RoleId,
                    LoginId: $rootScope.UserId,
                    CultureId: $rootScope.CultureId

                };

                $scope.RequestDataFilter = requestData;


                var consolidateApiParamater =
                {
                    Json: requestData,
                };

                console.log("2" + new Date());
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    
                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {
                        
                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.FinanceDashboardList.length !== undefined) {
                                if (resoponsedata.Json.FinanceDashboardList.length > 0) {
                                    totalcount = resoponsedata.Json.FinanceDashboardList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.FinanceDashboardList.TotalCount;
                            }

                            ListData = resoponsedata.Json.FinanceDashboardList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    } var inquiryList = {
                        data: ListData,
                        totalRecords: totalcount
                    }
                    for (var i = 0; i < ListData.length; i++) {
                        ListData[i].CheckedEnquiry = false;
                    }

                    var data = ListData;
                    $scope.FinanceDetailDashboard = $scope.FinanceDetailDashboard.concat(data);

                    $scope.LoadDetailGridByConfiguration();

                    //if ($scope.GridConfigurationLoaded === false) {
                    //    $scope.LoadGridByConfiguration();
                    //}

                    return data;
                });

            }
        });

        $scope.FinanceDashboardDetailsGrid = {
            dataSource: {
                store: FinanceDashboardDetailsData,
            },
            bindingOptions: {

            },
            showBorders: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
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
            keyExpr: "EnquiryAutoNumber",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                
                $scope.IsColumnDetailView = false;
                if ($scope.CellCheckboxControl === true || $scope.HeaderCheckboxControl === true) {

                    $scope.IsColumnDetailView = true;

                    if ($scope.CellCheckboxControl === true) {

                        var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.PaymentRequestId === e.data.OrderId; });
                        if (data.length > 0) {
                            data[0].CheckedEnquiry = !data[0].CheckedEnquiry;
                        }
                    }
                    else if ($scope.HeaderCheckboxControl === true) {
                        for (var i = 0; i < $scope.SalesAdminApprovalList.length; i++) {
                            $scope.SalesAdminApprovalList[i].CheckedEnquiry = $scope.HeaderCheckBoxAction;
                        }
                    }

                    $scope.HeaderCheckboxControl = false;
                    $scope.CellCheckboxControl = false;

                }
                if (e.rowType !== "filter" && e.rowType != "header" && e.rowType != "detail") {

                    var detailViewAvailable = $scope.GridColumnList.filter(function (el) { return el.ResourceValue === e.column.caption; });
                    if (detailViewAvailable.length > 0) {
                        if (detailViewAvailable[0].IsDetailsViewAvailable === "1") {

                            $scope.CurrentOpenMasterDetailsObject = e;

                        } else {

                        }
                    }
                } else {
                    $scope.IsColumnDetailView = true;
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

            loadPanel: {
                Type: Number,
                width: 200
            },
            masterDetail: {
                scrolling:
                {
                    enabled: false,
                    visible: false
                },
                enabled: false,

            },
            columns: [{
                dataField: "Vehicle",
                alignment: "left",
            }, {
                dataField: "OrderNumber",
                alignment: "left",
            }, {
                dataField: "SalesOrderNumber",
                alignment: "left",
            }, {
                dataField: "LRNo",
                alignment: "left",
            }, {
                dataField: "Customer",
                alignment: "left",
            }, {
                dataField: "TripCost",
                alignment: "right",
            }, {
                dataField: "TripRevenue",
                alignment: "right",
            }, {
                dataField: "PaidToCarrier",
                alignment: "right",
            }, {
                dataField: "RevenueToRecover",
                alignment: "right",
            }, {
                dataField: "CostToRecover",
                alignment: "right",
            }],
        };
    }

    //#endregion 

});