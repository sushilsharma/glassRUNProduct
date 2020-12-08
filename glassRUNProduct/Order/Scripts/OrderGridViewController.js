angular.module("glassRUNProduct").controller('OrderGridViewController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    //#region Load Variables And Default Values
    $scope.IsRefreshGrid = false;
    $scope.CurrentOpenMasterDetailsObject = "";
    $scope.selectedRow = -1;
    $scope.PreviousEnterProductQuantity = 0;
    $scope.PaymentRequestInfoSection = false;
    $scope.OrderInfoSection = false;
    $scope.ProductInfoSection = false;
    $scope.IsColumnDetailView = false;
    $scope.StockCheckSection = false;
    $scope.StatusTimelineSection = false;
    $scope.CustomerCreditCheckSection = false;
    $scope.ItemCurrentStockPosition = 0;
    $scope.HeaderCheckboxControl = false;
    $rootScope.IsPalettesRequired = false;
    $rootScope.PalettesWidth = {
        width: "0%"
    };

    $scope.Cost = {
        TripCost: "",
        Revenue: "",
        TransporterId: 0
    };

    $scope.CellCheckboxControl = false;
    $scope.HeaderCheckBoxAction = false;
    $scope.SalesAdminApprovalList = [];
    $scope.IsChecked = false;
    $scope.IsFiltered = true;
    console.log("-0" + new Date());
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.RoleName = $rootScope.RoleName;
    $rootScope.PreviousExpandedRow = "";
    $scope.GridColumnList = [];
    $scope.bindallproduct = [];
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

    console.log("-1" + new Date());
    var StatusList = $rootScope.StatusResourcesList.filter(function (el) { return el.CultureId === $rootScope.CultureId });
    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;

    $scope.bindAllBranchPlant = [];
    $scope.bindAllBranchPlant = $rootScope.bindAllBranchPlant;

    $scope.SelectedBranchPlant = {
        BranchPlantForSelectedEnquiry: ''
    }

    //#endregion
    // #region Grid Configuration
    $rootScope.LoadGridViewConfigurationData = function () {


        //if (page === "ControlTower") {
        //    objectId = 158;
        //}
        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                ObjectId: 159,
                ObjectName: 'TransporterId',
                PageName: $rootScope.PageName,
                ControllerName: page
            };
        var gridconsolidateApiParamater =
            {
                Json: gridrequestData,
            };

        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
            if (response.data.Json != undefined) {
                $scope.GridColumnList = response.data.Json.GridColumnList;
                console.log("0" + new Date());
                $scope.LoadSalesAdminApprovalGrid();

                if ($scope.IsRefreshGrid === true) {
                    $scope.RefreshDataGrid();
                }
            } else {
            }
        });
    }
    // #endregion
    // #region On Load Grid Configuration
    $rootScope.GridConfigurationLoadedView = false;

    $scope.LoadGridByConfiguration = function (e) {


        var dataGrid = $("#SalesOrderGrid").dxDataGrid("instance");

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
        $rootScope.GridConfigurationLoadedView = true;
        console.log("10" + new Date());
    }

    // #endregion
    // #region Load Sales Admin Approval Grid
    $scope.LoadSalesAdminApprovalGrid = function () {


        console.log("1" + new Date());

        var SalesAdminApprovalData = new DevExpress.data.CustomStore({
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

                var EnquiryAutoNumber = "";
                var EnquiryAutoNumberCriteria = "";

                var SoldToCode = "";
                var SoldToCodeCriteria = "";

                var CompanyNameValue = "";
                var CompanyNameValueCriteria = "";

                var DeliveryLocationName = "";
                var DeliveryLocationNameCriteria = "";

                var EnquiryDate = "";
                var EnquiryDateCriteria = "";

                var RequestDate = "";
                var RequestDateCriteria = "";

                var PromisedDate = "";
                var PromisedDateCriteria = "";

                var Area = "";
                var AreaCriteria = "";

                var Gratis = "";
                var GratisCriteria = "";

                var DeliveryLocation = "";
                var DeliveryLocationCriteria = "";

                var Empties = "";
                var EmptiesCriteria = "";

                var ReceivedCapacityPalates = "";
                var ReceivedCapacityPalatesCriteria = "";

                var TotalPrice = "";
                var TotalPriceCriteria = "";

                var Status = "";
                var StatusCriteria = "";

                var AvailableStock = "";
                var AvailableStockCriteria = "";

                var AvailableCredit = "";
                var AvailableCreditCriteria = "";

                var BranchPlant = "";
                var BranchPlantCriteria = "";

                var TruckSize = "";
                var TruckSizeCriteria = "";

                var OrderNumber = "";
                var OrderNumberCriteria = "";

                var BranchPlantNameCriteria = "";
                var BranchPlantName = "";

                var OrderDateCriteria = "";
                var OrderDate = "";

                var CollectedDateCriteria = "";
                var CollectedDate = "";

                var DeliveredCriteria = "";
                var DeliveredDate = "";

                var PurchaseOrderNumberCriteria = "";
                var PurchaseOrderNumber = "";

                var CarrierNumberValue = "";
                var CarrierNumberValueCriteria = "";

                var TripCost = "";
                var TripCostCriteria = "";

                var TripRevenue = "";
                var TripRevenueCriteria = "";

                var SalesOrderNumberCriteria = "=";
                var SalesOrderNumber = $rootScope.SalesOrderNumber;

                var DriverNameCriteria = "";
                var DriverName = "";

                var PlateNumberCriteria = "";
                var PlateNumber = "";

                $scope.ProductCodes = "";
                $scope.ProductSelectedList = [];



                if (filterOptions != "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "EnquiryDate") {
                            if (EnquiryDate === "") {
                                if (fields.length > 1) {
                                    EnquiryDateCriteria = "=";
                                } else {
                                    EnquiryDateCriteria = columnsList[1];
                                }
                                EnquiryDate = columnsList[2];
                                EnquiryDate = new Date(EnquiryDate);
                                EnquiryDate = $filter('date')(EnquiryDate, "dd/MM/yyyy");
                            }
                        }

                        if (columnsList[0] === "OrderDate") {
                            if (OrderDate === "") {
                                if (fields.length > 1) {
                                    OrderDateCriteria = "=";
                                } else {
                                    OrderDateCriteria = columnsList[1];
                                }
                                OrderDate = columnsList[2];
                                OrderDate = new Date(OrderDate);
                                OrderDate = $filter('date')(OrderDate, "dd/MM/yyyy");
                            }
                        }

                        if (columnsList[0] === "CollectedDate") {
                            if (CollectedDate === "") {
                                if (fields.length > 1) {
                                    CollectedDateCriteria = "=";
                                } else {
                                    CollectedDateCriteria = columnsList[1];
                                }
                                CollectedDate = columnsList[2];
                                CollectedDate = new Date(CollectedDate);
                                CollectedDate = $filter('date')(CollectedDate, "dd/MM/yyyy");
                            }
                        }

                        if (columnsList[0] === "DeliveredDate") {
                            if (DeliveredDate === "") {
                                if (fields.length > 1) {
                                    DeliveredCriteria = "=";
                                } else {
                                    DeliveredCriteria = columnsList[1];
                                }
                                DeliveredDate = columnsList[2];
                                DeliveredDate = new Date(DeliveredDate);
                                DeliveredDate = $filter('date')(DeliveredDate, "dd/MM/yyyy");
                            }
                        }

                        if (columnsList[0] === "RequestDateField") {
                            if (RequestDate === "") {
                                if (fields.length > 1) {
                                    RequestDateCriteria = "=";
                                } else {
                                    RequestDateCriteria = columnsList[1];
                                }
                                RequestDate = columnsList[2];
                                RequestDate = new Date(RequestDate);
                                RequestDate = $filter('date')(RequestDate, "dd/MM/yyyy");
                            }
                        }

                        if (columnsList[0] === "PromisedDateField") {
                            if (PromisedDate === "") {
                                if (fields.length > 1) {
                                    PromisedDateCriteria = "=";
                                } else {
                                    PromisedDateCriteria = columnsList[1];
                                }
                                PromisedDate = columnsList[2];
                                PromisedDate = new Date(PromisedDate);
                                PromisedDate = $filter('date')(PromisedDate, "dd/MM/yyyy");
                            }
                        }

                        if (columnsList[0] === "SalesOrderNumber") {
                            SalesOrderNumberCriteria = columnsList[1];
                            SalesOrderNumber = columnsList[2];
                        }

                        if (columnsList[0] === "EnquiryAutoNumber") {
                            EnquiryAutoNumberCriteria = columnsList[1];
                            EnquiryAutoNumber = columnsList[2];
                        }

                        if (columnsList[0] === "Area") {
                            AreaCriteria = columnsList[1];
                            Area = columnsList[2];
                        }

                        if (columnsList[0] === "AssociatedOrder") {
                            GratisCriteria = columnsList[1];
                            Gratis = columnsList[2];
                        }

                        if (columnsList[0] === "CompanyName") {
                            CompanyNameValueCriteria = columnsList[1];
                            CompanyNameValue = columnsList[2];
                        }

                        if (columnsList[0] === "OrderNumber") {
                            OrderNumberCriteria = columnsList[1];
                            OrderNumber = columnsList[2];
                        }

                        if (columnsList[0] === "DeliveryLocationName") {
                            DeliveryLocationNameCriteria = columnsList[1];
                            DeliveryLocationName = columnsList[2];
                        }

                        if (columnsList[0] === "ShipToCode") {
                            DeliveryLocationCriteria = columnsList[1];
                            DeliveryLocation = columnsList[2];
                        }

                        if (columnsList[0] === "BranchPlant") {
                            BranchPlantCriteria = columnsList[1];
                            BranchPlant = columnsList[2];
                        }

                        if (columnsList[0] === "BranchPlantName") {
                            BranchPlantNameCriteria = columnsList[1];
                            BranchPlantName = columnsList[2];
                        }

                        if (columnsList[0] === "TotalPrice") {
                            if (TotalPrice === "") {
                                if (fields.length > 1) {
                                    TotalPriceCriteria = "=";
                                } else {
                                    TotalPriceCriteria = columnsList[1];
                                }
                                TotalPriceCriteria = columnsList[1];
                                TotalPrice = columnsList[2];
                            }
                        }

                        if (columnsList[0] === "IsAvailableStock") {
                            AvailableStockCriteria = columnsList[1];
                            if (columnsList[2] === 'Ok') {
                                AvailableStock = '1';
                            }
                            else if (columnsList[2] === 'Not Ok') {
                                AvailableStock = '0';
                            }
                        }

                        if (columnsList[0] === "IsAvailableCredit") {
                            AvailableCreditCriteria = columnsList[1];
                            if (columnsList[2] === 'Ok') {
                                AvailableCredit = '1';
                            }
                            else if (columnsList[2] === 'Not Ok') {
                                AvailableCredit = '0';
                            }
                        }

                        if (columnsList[0] === "ReceivedCapacityPalettesCheck") {
                            ReceivedCapacityPalatesCriteria = columnsList[1];
                            if (columnsList[2] === 'Ok') {
                                ReceivedCapacityPalates = '1';
                            }
                            else if (columnsList[2] === 'Not Ok') {
                                ReceivedCapacityPalates = '0';
                            }
                        }

                        if (columnsList[0] === "Empties") {
                            EmptiesCriteria = columnsList[1];
                            if (columnsList[2] === 'Ok') {
                                Empties = 'C';
                            }
                            else if (columnsList[2] === 'Not Ok') {
                                Empties = 'W';
                            }
                        }

                        if (columnsList[0] === "Status") {
                            StatusCriteria = columnsList[1];
                            Status = columnsList[2];
                        }

                        if (columnsList[0] === "TruckSize") {
                            TruckSizeCriteria = columnsList[1];
                            TruckSize = columnsList[2];
                        }

                        if (columnsList[0] === "PurchaseOrderNumber") {
                            PurchaseOrderNumberCriteria = columnsList[1];
                            PurchaseOrderNumber = columnsList[2];
                        }

                        if (columnsList[0] === "CarrierNumberValue") {
                            CarrierNumberValueCriteria = columnsList[1];
                            CarrierNumberValue = columnsList[2];
                        }

                        if (columnsList[0] === "TripCost") {
                            TripCostCriteria = columnsList[1];
                            TripCost = columnsList[2];
                        }

                        if (columnsList[0] === "TripRevenue") {
                            TripRevenueCriteria = columnsList[1];
                            TripRevenue = columnsList[2];
                        }

                        if (columnsList[0] === "EnquiryAutoNumber") {
                            EnquiryAutoNumberCriteria = columnsList[1];
                            EnquiryAutoNumber = columnsList[2];
                        }

                        if (columnsList[0] === "DriverName") {
                            DriverNameCriteria = columnsList[1];
                            DriverName = columnsList[2];
                        }

                        if (columnsList[0] === "PlateNumber") {
                            PlateNumberCriteria = columnsList[1];
                            PlateNumber = columnsList[2];
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
                    if (loadOptions.sort[0].selector === "RequestDateField") {
                        OrderBy = "RequestDate";
                    } else if (loadOptions.sort[0].selector === "PromisedDateField") {
                        OrderBy = "PromisedDate";
                    } else if (loadOptions.sort[0].selector === "BranchPlant") {
                        OrderBy = "StockLocationId"
                    }
                    else {
                        OrderBy = loadOptions.sort[0].selector;
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));


                var requestData =
                    {
                        ServicesAction: 'LoadOrderGrid',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: OrderBy,
                        OrderByCriteria: OrderByCriteria,
                        PurchaseOrderNumberCriteria: PurchaseOrderNumberCriteria,
                        PurchaseOrderNumber: PurchaseOrderNumber,
                        PlateNumberCriteria: PlateNumberCriteria,
                        PlateNumber: PlateNumber,
                        DriverName: DriverName,
                        DriverNameCriteria: DriverNameCriteria,
                        TripCostCriteria: TripCostCriteria,
                        TripCost: TripCost,
                        TripRevenueCriteria: TripRevenueCriteria,
                        SalesOrderNumberCriteria: SalesOrderNumberCriteria,
                        SalesOrderNumber: SalesOrderNumber,
                        TripRevenue: TripRevenue,
                        CarrierNumberValueCriteria: CarrierNumberValueCriteria,
                        CarrierNumberValue: CarrierNumberValue,
                        EnquiryAutoNumber: EnquiryAutoNumber,
                        EnquiryAutoNumberCriteria: EnquiryAutoNumberCriteria,
                        OrderNumberCriteria: OrderNumberCriteria,
                        OrderNumber: OrderNumber,
                        BranchPlantName: BranchPlantName,
                        BranchPlantNameCriteria: BranchPlantNameCriteria,
                        OrderDate: OrderDate,
                        OrderDateCriteria: OrderDateCriteria,
                        CompanyNameValue: CompanyNameValue,
                        CompanyNameValueCriteria: CompanyNameValueCriteria,
                        DeliveryLocationNameCriteria: DeliveryLocationNameCriteria,
                        DeliveryLocationName: DeliveryLocationName,
                        SoldToCode: SoldToCode,
                        SoldToCodeCriteria: SoldToCodeCriteria,
                        BranchPlant: BranchPlant,
                        BranchPlantCriteria: BranchPlantCriteria,
                        Area: Area,
                        AreaCriteria: AreaCriteria,
                        DeliveryLocation: DeliveryLocation,
                        DeliveryLocationCriteria: DeliveryLocationCriteria,
                        Gratis: Gratis,
                        GratisCriteria: GratisCriteria,
                        EnquiryDate: EnquiryDate,
                        EnquiryDateCriteria: EnquiryDateCriteria,
                        RequestDate: RequestDate,
                        RequestDateCriteria: RequestDateCriteria,
                        PromisedDate: PromisedDate,
                        PromisedDateCriteria: PromisedDateCriteria,
                        Status: Status,
                        StatusCriteria: StatusCriteria,
                        TotalPriceCriteria: TotalPriceCriteria,
                        TotalPrice: TotalPrice,
                        Empties: Empties,
                        EmptiesCriteria: EmptiesCriteria,
                        IsAvailableStock: AvailableStock,
                        AvailableStockCriteria: AvailableStockCriteria,
                        AvailableCredit: AvailableCredit,
                        AvailableCreditCriteria: AvailableCreditCriteria,
                        ReceivedCapacityPalates: ReceivedCapacityPalates,
                        ReceivedCapacityPalatesCriteria: ReceivedCapacityPalatesCriteria,
                        TruckSize: TruckSize,
                        TruckSizeCriteria: TruckSizeCriteria,
                        CurrentState: '',
                        IsExportToExcel: '0',
                        RoleMasterId: $rootScope.RoleId,
                        UserId: $rootScope.UserId,
                        LoginId: $rootScope.UserId,
                        CultureId: $rootScope.CultureId,
                        ProductCode: $scope.ProductCodes,
                        ProductSearchCriteria: $scope.ProductSearchCriteria,
                        CollectedDate: CollectedDate,
                        CollectedDateCriteria: CollectedDateCriteria,
                        DeliveredCriteria: DeliveredCriteria,
                        DeliveredDate: DeliveredDate
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
                            if (resoponsedata.Json.OrderList.length !== undefined) {
                                if (resoponsedata.Json.OrderList.length > 0) {
                                    totalcount = resoponsedata.Json.OrderList[0].TotalCount;
                                }
                            } else {
                                totalcount = resoponsedata.Json.OrderList.TotalCount;
                            }

                            ListData = resoponsedata.Json.OrderList;
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
                    console.log("3" + new Date());

                    if ($rootScope.GridConfigurationLoadedView === false) {
                        $scope.LoadGridByConfiguration();
                    }
                    return data;
                });
            }
        });

        $scope.SalesAdminApprovalGrid = {
            dataSource: {
                store: SalesAdminApprovalData,
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
                        var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === e.data.OrderId; });
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
                    var detailViewAvailable = $scope.GridColumnList.filter(function (el) { return el.PropertyName === e.column.dataField; });
                    if (detailViewAvailable.length > 0) {
                        if (detailViewAvailable[0].IsDetailsViewAvailable === "1") {
                            $scope.CurrentOpenMasterDetailsObject = e;
                            $scope.IsColumnDetailView = true;

                            if (e.column.caption === $rootScope.resData.res_GridColumn_OrderNumber) {
                                if (page === "ControlTower") {

                                    debugger;
                                    $rootScope.SalesOrderNumber = e.data.SalesOrderNumber;
                                    $rootScope.OrderNumber = e.data.OrderNumber;
                                    $rootScope.LoadWorkFlowActivityLog(e.data);

                                    //if ($rootScope.GridConfigurationLoadedView === true) {
                                    //    $rootScope.RefreshDataGridView();
                                    //} else {
                                    //    $rootScope.LoadGridViewConfigurationData();
                                    //}
                                } else {
                                    $scope.ProductInfoSection = true;
                                    $scope.PaymentRequestInfoSection = false;
                                    $scope.StockCheckSection = false;
                                    $scope.StatusTimelineSection = false;
                                    $scope.CustomerCreditCheckSection = false;
                                    var expanded = e.component.isRowExpanded(e.data);
                                    if (expanded) {
                                        e.component.collapseRow(e.data);
                                    } else {
                                        if ($rootScope.PreviousExpandedRow !== "") {
                                            if (e.data !== $rootScope.PreviousExpandedRow) {
                                                e.component.collapseRow($rootScope.PreviousExpandedRow);
                                            }
                                        }
                                        $scope.LoadOrderProductByOrderId(e.data.OrderId, e);

                                    }
                                }
                            } else if (e.column.caption === $rootScope.resData.res_GridColumn_Stock && e.data.IsAvailableStock !== "1") {
                                $scope.ProductInfoSection = false;
                                $scope.PaymentRequestInfoSection = false;
                                $scope.StockCheckSection = true;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = false;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($rootScope.PreviousExpandedRow !== "") {
                                        if (e.data !== $rootScope.PreviousExpandedRow) {
                                            e.component.collapseRow($rootScope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadEnquiryProductByEnquiryId(e.data.EnquiryId, e);
                                }
                            }
                            else if (e.column.caption === $rootScope.resData.res_GridColumn_Status) {
                                $scope.ProductInfoSection = false;
                                $scope.PaymentRequestInfoSection = false;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = true;
                                $scope.CustomerCreditCheckSection = false;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($rootScope.PreviousExpandedRow !== "") {
                                        if (e.data !== $rootScope.PreviousExpandedRow) {
                                            e.component.collapseRow($rootScope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadEnquiryProductByEnquiryId(e.data.EnquiryId, e);
                                }
                            } else if (e.column.caption === $rootScope.resData.res_ViewInquiryForOM_CreditLimit) {
                                $scope.ProductInfoSection = false;
                                $scope.PaymentRequestInfoSection = false;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = true;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($rootScope.PreviousExpandedRow !== "") {
                                        if (e.data !== $rootScope.PreviousExpandedRow) {
                                            e.component.collapseRow($rootScope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadCreditCheckByEnquiryId(e.data.EnquiryId, e);
                                }
                            }
                            else if (e.column.caption === $rootScope.resData.res_Menu_PaymentRequest) {
                                $scope.ProductInfoSection = false;
                                $scope.PaymentRequestInfoSection = true;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = false;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($rootScope.PreviousExpandedRow !== "") {
                                        if (e.data !== $rootScope.PreviousExpandedRow) {
                                            e.component.collapseRow($rootScope.PreviousExpandedRow);
                                        }
                                    }
                                    $rootScope.PaymentRequestByOrder(e.data.CarrierNumber, e.data.OrderId, e.data.SalesOrderNumber, e);
                                }
                            }
                            else if (e.column.caption === $rootScope.resData.res_GridColumn_Product) {
                                $scope.ProductInfoSection = false;
                                $scope.OrderInfoSection = true;
                                $scope.PaymentRequestInfoSection = false;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = false;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($rootScope.PreviousExpandedRow !== "") {
                                        if (e.data !== $rootScope.PreviousExpandedRow) {
                                            e.component.collapseRow($rootScope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadOrderProductByOrderId(e.data.OrderId, e);
                                }
                            }
                        } else {
                            //$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApprovalGrid_DetailView), 'error', 3000);
                        }
                    }
                } else {
                    $scope.IsColumnDetailView = true;
                }
            },

            onRowClick: function (e) {
                //if ($scope.IsColumnDetailView === false) {
                //    $state.go("TrackerPage");
                //}
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
                template: "EnquiryProductInfo"
            },

            columns: [
                {
                    dataField: "CheckedEnquiry",
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: "left",
                    width: 37,
                    dataType: 'boolean',
                    allowEditing: false,
                    cellTemplate: function (container, options) {
                        $("<div />").dxCheckBox({
                            value: JSON.parse(options.data.CheckedEnquiry),
                            visible: options.data.CurrentState == '999' ? false : true,
                            onValueChanged: function (data) {

                                $scope.HeaderCheckboxControl = false;
                                $scope.CellCheckboxControl = true;
                            }
                        }).appendTo(container);
                    },
                    headerCellTemplate: function (container, options) {


                        $("<div />").dxCheckBox({
                            value: false,
                            onValueChanged: function (data) {

                                $scope.HeaderCheckBoxAction = data.value;
                                $scope.HeaderCheckboxControl = true;
                                $scope.CellCheckboxControl = false;
                            }
                        }).appendTo(container);
                    }
                },
                {
                    dataField: "OrderDate",
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    filterOperations: ['=', '>', '<'],
                    alignment: "right",
                }, {
                    dataField: "EnquiryAutoNumber",
                    cssClass: "EnquiryNumberUI",
                    alignment: "left",
                    width: 150
                }, {
                    dataField: "OrderNumber",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left",
                    width: 150
                },
                {
                    dataField: "SalesOrderNumber",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left",
                    width: 150
                },
                {
                    dataField: "PurchaseOrderNumber",
                    alignment: "left",
                    width: 150
                },
                {
                    dataField: "Area",
                    alignment: "left",
                }, {
                    dataField: "AssociatedOrder",
                    allowSorting: false,
                    alignment: "left",
                }, {
                    dataField: "CompanyName",
                    alignment: "left",
                }, {
                    dataField: "CompanyMnemonic",
                    alignment: "left",
                }, {
                    dataField: "DeliveryLocation",
                    alignment: "right"
                }, {
                    dataField: "DeliveryLocationName",
                    alignment: "left"
                }, {
                    dataField: "TotalPrice",
                    alignment: "right",
                    filterOperations: ['=', '>', '<'],
                }, {
                    dataField: "TripCost",
                    alignment: "right",
                    filterOperations: ['=', '>', '<'],
                    cellTemplate: "TripCostTemplate"
                }, {
                    dataField: "TripRevenue",
                    alignment: "right",
                    filterOperations: ['=', '>', '<'],
                    cellTemplate: "TripRevenueTemplate"
                }, {
                    dataField: "BranchPlantName",
                    alignment: "left",
                }, {
                    dataField: "BranchPlantCode",
                    alignment: "right",
                }, {
                    dataField: "CarrierNumberValue",
                    alignment: "left",
                }, {
                    dataField: "TruckSize",
                    alignment: "left",
                }, {
                    dataField: "DeliveryPersonnelId",
                    allowSorting: false,
                    alignment: "center",
                    allowFiltering: false,
                    filterRow: {
                        visible: false,
                        applyFilter: "auto"
                    },

                    headerFilter: false,
                    cellTemplate: "DriverTemplate"
                }, {
                    dataField: "DriverName",
                    alignment: "left",
                }, {
                    dataField: "PlateNumber",
                    allowSorting: false,
                    alignment: "center",
                    allowFiltering: false,
                    filterRow: {
                        visible: false,
                        applyFilter: "auto"
                    },

                    headerFilter: false,
                    cellTemplate: "PlateNumberTemplate"
                },
                {
                    dataField: "DeliveredDate",
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    filterOperations: ['=', '>', '<'],
                    alignment: "right",
                },
                {
                    dataField: "CollectedDate",
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    filterOperations: ['=', '>', '<'],
                    alignment: "right",
                },

                {
                    dataField: "Status",
                    cssClass: "ClickkableCell",
                    lookup: {
                        dataSource: StatusList,
                        displayExpr: "ResourceValue",
                        valueExpr: "ResourceValue"
                    },
                    cellTemplate: "StatusTemplate",
                    alignment: "left",
                    allowFiltering: false,
                    allowSorting: false,
                    filterRow: {
                        visible: true,
                        applyFilter: "auto"
                    },
                    width: 200,
                    headerFilter: {
                        visible: true,
                        allowSearch: true
                    },
                },{
                    dataField: "PaymentRequest",
                    alignment: "left",
                    cellTemplate: "PaymentRequest",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                }, {
                    dataField: "Product",
                    alignment: "left",
                    cellTemplate: "List",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                }],
        };
    }

    // #endregion
    // #region Change language
    $rootScope.GridRecallForStatus = function () {

        $scope.IsRefreshGrid = true;
        $rootScope.GridConfigurationLoadedView = false;
        $scope.LoadGridConfigurationData();
    }
    // #endregion
    //#region Refresh DataGrid
    $rootScope.RefreshDataGridView = function () {

        $scope.SalesAdminApprovalList = [];
        $rootScope.GridConfigurationLoadedView = false;
        $scope.IsEnquiryEdit = false;
        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#SalesOrderGrid").dxDataGrid("instance");
        dataGrid.refresh();

        //dataGrid = dataGrid.option("dataSource");
        //if (dataGrid != undefined) {
        //    dataGrid.store.load();
        //}
    }
    //#endregion    
    // #region LoadOrderProductByOrderId
    $scope.LoadOrderProductByOrderId = function (Id, e) {
        var requestData =
            {
                ServicesAction: 'LoadOrderByOrderId',
                OrderId: Id,
                RoleId: $rootScope.RoleId,
                CultureId: $rootScope.CultureId
            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            //$scope.EnquiryTotalAmount = 0;
            //$scope.EnquiryCashDiscount = 0;
            //$scope.EnquiryTotalTax = 0;
            //$scope.EnquiryNetAmount = 0;
            //$scope.EnquiryGrandTotalAmount = 0;
            //$scope.EnquiryDepositeAmount = 0;

            if (response.data !== undefined) {

                $scope.OrderProductList = [];
                if (response.data.Json.OrderList.OrderProductsList !== undefined) {
                    $scope.OrderProductList = response.data.Json.OrderList.OrderProductsList;

                    //for (var i = 0; i < $scope.OrderProductList.length; i++) {
                    //    $scope.OrderProductList[i].ProductQuantity = parseInt($scope.OrderProductList[i].ProductQuantity);
                    //    $scope.OrderProductList[i].PreviousProductQuantity = parseInt($scope.OrderProductList[i].ProductQuantity);
                    //    $scope.OrderProductList[i].EnquiryProductGUID = generateGUID();
                    //    $scope.OrderProductList[i].OrderGUID = $scope.CurrentOrderGuid;
                    //    var remainingProductStock = parseFloat(parseFloat($scope.OrderProductList[i].CurrentStockPosition) - parseFloat($scope.OrderProductList[i].UsedQuantityInOrder));
                    //    if (parseFloat($scope.OrderProductList[i].ProductQuantity) < remainingProductStock) {
                    //        $scope.OrderProductList[i].IsItemAvailableInStock = true;
                    //    } else {
                    //        $scope.OrderProductList[i].IsItemAvailableInStock = false;
                    //    }
                    //}

                    //$scope.EnquiryUnavailableStockProductList = $scope.OrderProductList.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode });

                    //$scope.LoadEnquiryAmountDetails($scope.OrderProductList);
                }

                var outerContainerWidth = document.getElementById("SalesAdminApprovalGrid").clientWidth;
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
            } else {
                //$rootScope.Throbber.Visible = false;
            }
        });
    }
    // #endregion
});