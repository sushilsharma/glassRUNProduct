angular.module("glassRUNProduct").controller('OrderListControllerForTest', function ($scope, $q, $timeout, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    debugger;

    //#region Load Variables And Default Values


    $scope.bindallproduct = [];
    $rootScope.ActionType = "OrderList";
    $scope.IsRefreshGrid = false;
    $scope.CurrentOpenMasterDetailsObject = "";
    $scope.selectedRow = -1;
    $scope.PreviousEnterProductQuantity = 0;
    $scope.UnitOfMeasureList = [];
    $scope.PaymentRequestInfoSection = false;
    $rootScope.ItemAddedModalPopupControl = false;
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

    $scope.DriverAssigment = {
        DriverName: "",
        TruckPlateNumber: ""

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

    //$scope.bindAllBranchPlant = [];
    //$scope.bindAllBranchPlant = $rootScope.bindAllBranchPlant;

    $scope.SelectedBranchPlant = {
        BranchPlantForSelectedEnquiry: ''
    }

    $scope.SelectedDeliveryLocation = {
        DeliveryLocationForSelectedEnquiry: ''
    }

    var unitOfMeasureList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'UnitOfMeasure'; });
    if (unitOfMeasureList.length > 0) {
        $scope.UnitOfMeasureList = unitOfMeasureList;
    }
    //#endregion

    $scope.Gridrepaint = function () {
        debugger;
        var grid = $("#SalesAdminApprovalGrid").dxDataGrid("instance");
        var colCount = grid.columnCount();
        for (var i = 0; i < colCount; i++) {
            debugger;
            var DataField = grid.columnOption(i, 'dataField');

            if (grid.columnOption(i, 'visible')) {
                if (DataField === 'DeliveryPersonnelId' || DataField === 'PlateNumber') {
                    grid.columnOption(i, 'width', '150');
                }
                else {
                    grid.columnOption(i, 'width', 'auto');
                }
            }
        }
        grid.repaint();
    }

    $scope.PageLevelConfigurationByConfigurationName = function (configurationName) {
        debugger;
        var isTrue = false;
        var configInfo = $rootScope.PageLevelConfigList.filter(function (el) { return el.SettingName === configurationName; });
        if (configInfo.length > 0) {
            if (configInfo[0].SettingValue === "1") {
                isTrue = true;
            }
        }
        return isTrue
    }




    $ionicModal.fromTemplateUrl('WarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.DeleteWarningMessageControl = modal;
    });




    $scope.LoadDriverAndPlateNumber = function (e) {
        var requestDataForCarrier = {};

        requestDataForCarrier =
            {
                ServicesAction: 'LoadAllDriverList',
            }

        var consolidateApiParamaterForCarrier =
            {
                Json: requestDataForCarrier,
            };

        GrRequestService.ProcessRequest(consolidateApiParamaterForCarrier).then(function (response) {
            if (response.data != undefined) {
                if (response.data.Json != undefined) {
                    $scope.DriverList = response.data.Json.ProfileList;
                } else {
                    $scope.DriverList = [];
                }
            } else {
                $scope.DriverList = [];
            }

            var requestDataForPlateNumber =
                {
                    ServicesAction: 'GetPlateNumberByCarrierId',
                    CarrierId: 0,
                    RoleId: 0
                }

            var consolidateApiParamaterForPlateNumber =
                {
                    Json: requestDataForPlateNumber,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterForPlateNumber).then(function (response) {
                if (response.data != undefined) {
                    if (response.data.Json != undefined) {
                        $scope.PlateNumberList = response.data.Json.TransporterVehicleList;
                    } else {
                        $scope.PlateNumberList = [];
                    }
                } else {
                    $scope.PlateNumberList = [];
                }
                $scope.DriverAssigment.TruckPlateNumber = e.data.PlateNumber;
                $scope.DriverAssigment.DeliveryPersonnelId = e.data.DeliveryPersonnelId;

            });

        });
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
    }

    //$scope.LoadDriverAndPlateNumber();

    $scope.OpenModalPopupToAddNewItem = function () {
debugger;
        $scope.showItembox = false;
        $scope.OpenAddItemInMasterPopup();
    }

    $scope.OpenAddItemInMasterPopup = function () {
        $rootScope.ItemAddedModalPopupControl = true;
    }

    //#region Load Setting Values
    $scope.LoadDefaultSettingsValue = function () {
        debugger;

        $scope.LoadSettingInfoByName = function (settingName, returnValueDataType) {
            debugger;
            var settingValue = "";
            if ($sessionStorage.AllSettingMasterData != undefined) {
                var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === settingName; });
                if (settingMaster.length > 0) {
                    settingValue = settingMaster[0].SettingValue;
                }
            }
            if (returnValueDataType === "int") {
                if (settingValue !== "") {
                    settingValue = parseInt(settingValue);
                }
            } else if (returnValueDataType === "float") {
                if (settingValue !== "") {
                    settingValue = parseFloat(settingValue);
                }
            } else {
                settingValue = settingValue;
            }
            return settingValue;
        }

        $scope.ItemTaxInPec = $scope.LoadSettingInfoByName('ItemTaxInPec', 'float');
        if ($scope.ItemTaxInPec === "") {
            $scope.ItemTaxInPec = 0;
        }
        $scope.WoodenPalletCode = $scope.LoadSettingInfoByName('WoodenPalletCode', 'string');

        $scope.NumberOfProductAdd = $scope.LoadSettingInfoByName('NumberOfProductAdd', 'int');
        if ($scope.NumberOfProductAdd === "") {
            $scope.NumberOfProductAdd = $scope.defaultValueForNumberOfProducts;
        }
        $scope.EmptiesAmount = $scope.LoadSettingInfoByName('EmptiesAmount', 'float');
        if ($scope.EmptiesAmount === "") {
            $scope.EmptiesAmount = 0;
        }

        $scope.PalettesBufferWeight = $scope.LoadSettingInfoByName('PalettesBufferWeight', 'float');
        if ($scope.PalettesBufferWeight === "") {
            $scope.PalettesBufferWeight = 0;
        }
        $scope.TruckExceedBufferWeight = $scope.LoadSettingInfoByName('TruckExceedBufferWeight', 'float');
        if ($scope.TruckExceedBufferWeight === "") {
            $scope.TruckExceedBufferWeight = 0;
        }
        $scope.PalettesExceedBufferWeight = $scope.LoadSettingInfoByName('PalettesExceedBufferWeight', 'float');
        if ($scope.PalettesExceedBufferWeight === "") {
            $scope.PalettesExceedBufferWeight = 0;
        }

        $scope.CurrencyFormatCode = $scope.LoadSettingInfoByName('CurrencyFormat', 'string');
        if ($scope.CurrencyFormatCode === "") {
            $scope.CurrencyFormatCode = "EUR";
        }

        $scope.TruckValidationEnable = $scope.LoadSettingInfoByName('IsTruckFullValidationEnabled', 'string');
        if ($scope.TruckValidationEnable !== "") {
            $scope.TruckValidationEnable = 0;
        }
        $scope.TruckSizeValidationEnable = $scope.LoadSettingInfoByName('IsTruckSizeValidationEnabled', 'string');
        if ($scope.TruckSizeValidationEnable !== "") {
            $scope.TruckSizeValidationEnable = 0;
        }
    }
    $scope.LoadDefaultSettingsValue();

    $scope.LoadPageLevelConfiguration = function () {
        debugger;

        if ($rootScope.PageLevelConfigList !== undefined) {
            if ($rootScope.PageLevelConfigList.length > 0) {

                $scope.IsCreditLimitCheck = $scope.PageLevelConfigurationByConfigurationName('IsCreditLimitCheck');
                $scope.IsMTBalanceCheck = $scope.PageLevelConfigurationByConfigurationName('IsMTBalanceCheck');
                $scope.IsReceivingCapacityCheck = $scope.PageLevelConfigurationByConfigurationName('IsReceivingCapacityCheck');
                $scope.IsReceivingCapacityWarning = $scope.PageLevelConfigurationByConfigurationName('IsReceivingCapacityWarning');
                $scope.IsWeightLoadCheckValidation = $scope.PageLevelConfigurationByConfigurationName('IsWeightLoadCheckValidation');
                $scope.IsPalletLoadCheckValidation = $scope.PageLevelConfigurationByConfigurationName('IsPalletLoadCheckValidation');
                $scope.IsPriceEditable = $scope.PageLevelConfigurationByConfigurationName('IsPriceEditable');
                $scope.IsAllocationApplicable = $scope.PageLevelConfigurationByConfigurationName('IsAllocationApplicable');
                $scope.AddItemInTruckApplicable = $scope.PageLevelConfigurationByConfigurationName('AddItemInTruckApplicable');
                $scope.IsPONumberApplicable = $scope.PageLevelConfigurationByConfigurationName('IsPONumberApplicable');
                $scope.IsSONumberApplicable = $scope.PageLevelConfigurationByConfigurationName('IsSONumberApplicable');
                $scope.IsCollectionLocationSelectionApplicable = $scope.PageLevelConfigurationByConfigurationName('IsCollectionLocationSelectionApplicable');
                $scope.IsPickUpDateApplicable = $scope.PageLevelConfigurationByConfigurationName('IsPickUpDateApplicable');

            }
        }
    }

    $scope.LoadPageLevelConfiguration();

    //#endregion



    //#region load page wise configuration.

    $scope.PageLevelConfigurationByConfigurationName = function (configurationName) {
        var isTrue = false;
        if ($rootScope.PageLevelConfigList !== undefined) {
            if ($rootScope.PageLevelConfigList.length > 0) {
                var configInfo = $rootScope.PageLevelConfigList.filter(function (el) { return el.SettingName === configurationName; });
                if (configInfo.length > 0) {
                    if (configInfo[0].SettingValue === "1") {
                        isTrue = true;
                    }
                }
            }
        }

        return isTrue
    }

    $scope.LoadPageLevelConfiguration = function () {
        debugger;
        $scope.IsMultipleCustomerUpdateBranchPlantApplicable = $scope.PageLevelConfigurationByConfigurationName('IsMultipleCustomerUpdateBranchPlantApplicable');

        $scope.IsShowAllTransporterForUpdate = $scope.PageLevelConfigurationByConfigurationName('IsShowAllTransporterForUpdate');
    };
    $scope.LoadPageLevelConfiguration();

    //#endregion

    //#region Load Sales Admin Approval Grid
    $scope.LoadSalesAdminApprovalGrid = function () {
        debugger;

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

                var PlateNumberData = "";
                var PlateNumberDataCriteria = "";

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


                var PlanCollectionDateCriteria = "";
                var PlanCollectionDate = "";

                var PlanDeliveryDateCriteria = "";
                var PlanDeliveryDate = "";



                var PurchaseOrderNumberCriteria = "";
                var PurchaseOrderNumber = "";

                var CarrierNumberValue = "";
                var CarrierNumberValueCriteria = "";

                var TripCost = "";
                var TripCostCriteria = "";

                var TripRevenue = "";
                var TripRevenueCriteria = "";

                var SalesOrderNumberCriteria = "";
                var SalesOrderNumber = "";

                var DriverNameCriteria = "";
                var DriverName = "";

                var PlateNumberCriteria = "";
                var PlateNumber = "";

                $scope.ProductCodes = "";
                $scope.ProductSelectedList = [];

                debugger;

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



                        if (columnsList[0] === "PlanCollectionDate") {
                            if (PlanCollectionDate === "") {
                                if (fields.length > 1) {
                                    PlanCollectionDateCriteria = "=";
                                } else {
                                    PlanCollectionDateCriteria = columnsList[1];
                                }
                                PlanCollectionDate = columnsList[2];
                                PlanCollectionDate = new Date(PlanCollectionDate);
                                PlanCollectionDate = $filter('date')(PlanCollectionDate, "dd/MM/yyyy HH:mm");
                            }
                        }

                        if (columnsList[0] === "PlanDeliveryDate") {
                            if (PlanDeliveryDate === "") {
                                if (fields.length > 1) {
                                    PlanDeliveryDateCriteria = "=";
                                } else {
                                    PlanDeliveryDateCriteria = columnsList[1];
                                }
                                PlanDeliveryDate = columnsList[2];
                                PlanDeliveryDate = new Date(PlanDeliveryDate);
                                PlanDeliveryDate = $filter('date')(PlanDeliveryDate, "dd/MM/yyyy HH:mm");
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
                                CollectedDate = $filter('date')(CollectedDate, "dd/MM/yyyy HH:mm");
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
                                DeliveredDate = $filter('date')(DeliveredDate, "dd/MM/yyyy HH:mm");
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

                        if (columnsList[0] === "PlateNumberData") {
                            PlateNumberDataCriteria = columnsList[1];
                            PlateNumberData = columnsList[2];
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

                debugger;
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
                        DeliveredDate: DeliveredDate,

                        PlanCollectionDate: PlanCollectionDate,
                        PlanCollectionDateCriteria: PlanCollectionDateCriteria,
                        PlanDeliveryDateCriteria: PlanDeliveryDateCriteria,
                        PlanDeliveryDate: PlanDeliveryDate,

                        PlateNumberDataCriteria: PlateNumberDataCriteria,
                        PlateNumberData: PlateNumberData
                    };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                console.log("2" + new Date());
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    debugger;
                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {
                        debugger;
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

                    $rootScope.TotalOrderCount = totalcount;

                    var data = ListData;

                    $scope.SalesAdminApprovalList = $scope.SalesAdminApprovalList.concat(data);


                    var LateOrderCount = $scope.SalesAdminApprovalList.filter(function (el) { return el.IsLate === '-1'; });

                    $rootScope.TotalAttentionOrderCount = LateOrderCount.length;

                    console.log("3" + new Date());

                    //setTimeout(function () {
                    //    $scope.LoadItemListByCompany();
                    //    $scope.LoadPramotionItem();
                    //}, 200);



                    if (page === "ControlTower") {
                        $("#SalesAdminApprovalGrid").dxDataGrid("instance").option("height", (($(window).height()) - 205));
                    }

                    debugger;

                    //if ($scope.GridConfigurationLoaded === false) {
                    //    $scope.LoadGridByConfiguration();
                    //}
                    //$scope.Gridrepaint();
                    return data;
                });
            }
        });

        $scope.GetAllDriverPlateNumberUpdated = function () {
            debugger;
            var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === $scope.OrderIdForDriverAssigned; });
            if (enquiryDetails.length > 0) {
                for (var i = 0; i < enquiryDetails.length; i++) {
                    enquiryDetails[i].UserId = $rootScope.UserId;
                    enquiryDetails[i].CreatedBy = $rootScope.UserId;
                }

                var requestData =
                    {
                        //ServicesAction: 'UpdatePickingDate',
                        ServicesAction: 'UpdatePickingDateWithWorkflow',
                        PlateDetailsList: enquiryDetails
                    };
                // var stringfyjson = JSON.stringify(requestData);
                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    var eventNotificationList = [];

                    for (var i = 0; i < enquiryDetails.length; i++) {
                        var eventnotification = {};
                        eventnotification.EventCode = "DriverAndPlateNumberAllocation";
                        eventnotification.ObjectId = enquiryDetails[i].OrderId;
                        eventnotification.ObjectType = "Order";
                        eventnotification.IsActive = 1;
                        eventNotificationList.push(eventnotification);
                    }

                    $rootScope.InsertInEventNotification(eventNotificationList);

                    $scope.RefreshDataGrid();
                    $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                });
            }
            else {
                $rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
            }
        }

        $scope.GetAssignTransporterUpdated = function () {
            debugger;
            var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
            if (enquiryDetails.length > 0) {
                var Tripcost = [];
                for (var i = 0; i < enquiryDetails.length; i++) {
                    var cost = {};
                    cost.OrderId = enquiryDetails[i].OrderId;
                    cost.OrderNumber = enquiryDetails[i].OrderNumber;
                    cost.TripCost = 0;
                    cost.TripRevenue = 0;
                    cost.TransporterId = $scope.Cost.TransporterId;
                    cost.Action = 'AssignTransporter';
                    cost.IsActive = 1;

                    Tripcost.push(cost);
                }

                var requestData =
                    {
                        ServicesAction: 'SaveOrderTripCost',
                        OrderTripCostList: Tripcost
                    };
                // var stringfyjson = JSON.stringify(requestData);
                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    $scope.CloseAssignTransporterPopup();
                    $scope.Cost.TripCost = 0;
                    $scope.Cost.Revenue = 0;
                    $scope.Cost.TransporterId = 0;
                    $scope.RefreshDataGrid();
                    $rootScope.ValidationErrorAlert('Transporter assigned successfully', '', 3000);

                    //$rootScope.ValidationErrorAlert(String.Format($rootScope.), '', 3000);
                    //var dataGrid = $("#SalesAdminApprovalGrid").dxDataGrid("instance");
                    //dataGrid.refresh();
                });
            }
            else {
                $rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
            }
        }

        $scope.GetTripCostUpdated = function () {
            if (parseInt($scope.Cost.TripCost) <= 0) {
                $rootScope.ValidationErrorAlert($rootScope.resData.res_TripCostinputFieldValidationAlert, 'error', 3000);
                return
            }
            if (parseInt($scope.Cost.Revenue) <= 0) {
                $rootScope.ValidationErrorAlert($rootScope.resData.res_TripCostRevenueFieldValidationAlert, 'error', 3000);
                return;
            }
            debugger;
            var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
            if (enquiryDetails.length > 0) {
                var Tripcost = [];
                for (var i = 0; i < enquiryDetails.length; i++) {
                    var cost = {};
                    cost.OrderId = enquiryDetails[i].OrderId;
                    cost.OrderNumber = enquiryDetails[i].OrderNumber;
                    enquiryDetails[i].TripCost = "" + $scope.Cost.TripCost;
                    enquiryDetails[i].TripRevenue = "" + $scope.Cost.Revenue;
                    cost.TripCost = $scope.Cost.TripCost;
                    cost.TripRevenue = $scope.Cost.Revenue;
                    cost.TransporterId = 0;
                    cost.Action = 'TripCost';
                    cost.IsActive = 1;
                    Tripcost.push(cost);
                }

                var requestData =
                    {
                        ServicesAction: 'SaveOrderTripCost',
                        OrderTripCostList: Tripcost
                    };
                // var stringfyjson = JSON.stringify(requestData);
                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    $scope.CloseAssignTripCostPopup();
                    $scope.Cost.TripCost = 0;
                    $scope.Cost.Revenue = 0;
                    $rootScope.ValidationErrorAlert('Trip cost saved successfully.', '', 3000);

                    //var dataGrid = $("#SalesAdminApprovalGrid").dxDataGrid("instance");
                    //dataGrid.refresh();

                    $scope.RefreshDataGrid();
                });
            }
            else {
                $rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
            }
        }

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
                            debugger;
                            if (e.column.caption === $rootScope.resData.res_GridColumn_SalesOrderNumber) {
                                //if (page === "ControlTower") {
                                //    $rootScope.SalesOrderNumber = e.data.SalesOrderNumber;
                                //    $scope.toggleConsole_sidebar();

                                //    if ($rootScope.GridConfigurationLoadedView === true) {
                                //        $rootScope.RefreshDataGridView();
                                //    } else {
                                //        $rootScope.LoadGridViewConfigurationData();
                                //    }
                                //}
                            }
                            else if (e.column.caption === $rootScope.resData.res_GridColumn_OrderNumber) {
                                if (page === "ControlTower") {
                                    $rootScope.SalesOrderNumber = e.data.SalesOrderNumber;
                                    $rootScope.OrderNumber = e.data.OrderNumber;
                                    //$scope.toggleConsole_sidebar();

                                    debugger;
                                    $rootScope.LoadWorkFlowActivityLog(e.data);

                                    //if ($rootScope.GridConfigurationLoadedView === true) {
                                    //    $rootScope.RefreshDataGridView();
                                    //} else {
                                    //    $rootScope.LoadGridViewConfigurationData();
                                    //}
                                } else {
                                    $scope.ProductInfoSection = true;
                                    $scope.PaymentRequestInfoSection = false;
                                    $scope.DriverAssignedInfo = false;
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
                                        debugger;
                                    }
                                }
                            } else if (e.column.caption === $rootScope.resData.res_GridColumn_Stock && e.data.IsAvailableStock !== "1") {
                                $scope.ProductInfoSection = false;
                                $scope.PaymentRequestInfoSection = false;
                                $scope.DriverAssignedInfo = false;
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
                                $scope.DriverAssignedInfo = false;
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
                                $scope.DriverAssignedInfo = false;
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
                                debugger;
                                var PlateNumberData = e.data.PlateNumberData;
                                var TripCost = parseFloat(e.data.TripCost);
                                var TripRevenue = parseFloat(e.data.TripRevenue);
                                var DriverName = e.data.DriverName;

                                if (PlateNumberData === undefined || TripCost === 0 || TripRevenue === 0 || DriverName === '-') {
                                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderGrid_DetailsOfPayment), 'error', 3000);
                                }
                                else {
                                    $scope.ProductInfoSection = false;
                                    $scope.PaymentRequestInfoSection = true;
                                    $scope.DriverAssignedInfo = false;
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
                                        $scope.DeleteMiscCarrierNumber = e.data.CarrierNumber;
                                        $scope.DeleteMiscOrderId = e.data.OrderId;
                                        $scope.DeleteMiscSalesOrderNumber = e.data.SalesOrderNumber;

                                    }
                                }
                            }
                            else if (e.column.caption === $rootScope.resData.res_Menu_LorryReceipt) {

                                debugger; $rootScope.OrderId = e.data.OrderId;
                                //$sessionStorage.OrderId = $rootScope.OrderId;
                                //$state.go("LorryReceiptView");
                                $rootScope.RedirectPage("LorryReceiptView", "LorryReceiptView");
                            }
                            else if (e.column.caption === $rootScope.resData.res_GridColumn_AssignedDriver) {
                                debugger;
                                $scope.ProductInfoSection = false;
                                $scope.DriverAssignedInfo = true;
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
                                    $scope.OrderIdForDriverAssigned = e.data.OrderId;
                                    $scope.LoadDriverAndPlateNumber(e);

                                    //$rootScope.PaymentRequestByOrder(e.data.CarrierNumber, e.data.OrderId, e.data.SalesOrderNumber, e);
                                    //$scope.DeleteMiscCarrierNumber = e.data.CarrierNumber;
                                    //$scope.DeleteMiscOrderId = e.data.OrderId;
                                    //$scope.DeleteMiscSalesOrderNumber = e.data.SalesOrderNumber;

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
                template: "EnquiryProductInfo"
            },

            columns: $scope.DynamicColumnList,
        };
    }

    //#endregion

    //#region Grid Configuration
    $scope.LoadGridConfigurationData = function () {
        debugger;
        var objectId = 16;
        if (page === "PaymentRequest") {
            objectId = 17;
        } else if (page === "DriverAssignment") {
            objectId = 18;
        } else if (page === "ControlTower") {
            objectId = 223;
        }
        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                ObjectName: 'Order',
                ObjectId: objectId,
                PageName: "Order List",
                ControllerName: "OrderList"
            };


        var gridconsolidateApiParamater =
            {
                Json: gridrequestData,
            };

    

        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
            debugger;
            $scope.GridColumnList = response.data.Json.GridColumnList;

            var ld = JSON.stringify(response.data);
            var ColumnlistinJson = JSON.parse(ld);

            $scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList;

            debugger;


            var checkedEnquiryData = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'CheckedEnquiry' });

            if (checkedEnquiryData.length > 0) {


                checkedEnquiryData[0].allowFiltering = false;
                checkedEnquiryData[0].allowSorting = false;
                checkedEnquiryData[0].allowEditing = false;


                checkedEnquiryData[0].cellTemplate = function (container, options) {
                    $("<div />").dxCheckBox({
                        value: JSON.parse(options.data.CheckedEnquiry),
                        visible: options.data.CurrentState == '999' ? false : options.data.IsCompleted == '1' ? false : true,
                        onValueChanged: function (data) {
                            debugger;
                            $scope.HeaderCheckboxControl = false;
                            $scope.CellCheckboxControl = true;
                        }
                    }).appendTo(container);
                };


                checkedEnquiryData[0].headerCellTemplate = function (container, options) {
                    debugger;

                    $("<div />").dxCheckBox({
                        value: false,
                        onValueChanged: function (data) {
                            debugger;
                            $scope.HeaderCheckBoxAction = data.value;
                            $scope.HeaderCheckboxControl = true;
                            $scope.CellCheckboxControl = false;
                        }
                    }).appendTo(container);
                };
            }


            var statusData = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Status' });

            if (statusData.length > 0) {

                statusData[0].lookup = {
                    dataSource: StatusList,
                    displayExpr: "ResourceValue",
                    valueExpr: "ResourceValue"
                };

            }







            $scope.LoadSalesAdminApprovalGrid();

            if ($scope.IsRefreshGrid === true) {
                $scope.RefreshDataGrid();
            }
        });
    }
    $scope.LoadGridConfigurationData();

    //#endregion


    //#region Load Enquiry Product Information By Enquiry Id
    $scope.LoadOrderProductByOrderId = function (Id, e) {
        $rootScope.Throbber.Visible = true;
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
            debugger;

            $scope.EnquiryTotalAmount = 0;
            $scope.EnquiryCashDiscount = 0;
            $scope.EnquiryTotalTax = 0;
            $scope.EnquiryNetAmount = 0;
            $scope.EnquiryGrandTotalAmount = 0;
            $scope.EnquiryDepositeAmount = 0;
            $scope.bindallproduct = [];

            if (response.data !== undefined) {
                $scope.IsEnquiryEdit = false;
                $scope.EnableAddItem = false;
                $scope.ClearItemData();
                $scope.CreditLimit = response.data.Json.OrderList.CreditLimit;
                $scope.AvailableCreditLimit = response.data.Json.OrderList.AvailableCreditLimit;

                var totalEnquiryAmount = parseFloat(response.data.Json.OrderList.TotalEnquiryCreated) + ((parseFloat(response.data.Json.OrderList.TotalEnquiryCreated) * parseFloat($scope.ItemTaxInPec)) / 100);
                $scope.AvailableCreditLimit = Number($scope.AvailableCreditLimit) - Number(totalEnquiryAmount);
                $scope.AvailableCreditLimit = Number($scope.AvailableCreditLimit) - Number(response.data.Json.OrderList.EnquiryTotalDepositAmount);

                $scope.SelectedSalesOrderNumber = response.data.Json.OrderList.SalesOrderNumber;
                $rootScope.CompanyId = response.data.Json.OrderList.SoldTo;
                $rootScope.BranchPlantCodeEdit = response.data.Json.OrderList.StockLocationId;
                $rootScope.CompanyMnemonic = response.data.Json.OrderList.CompanyMnemonic;
                $scope.DiscountAmount = response.data.Json.OrderList.DiscountAmount;
                $rootScope.DeliveryLocationId = response.data.Json.OrderList.ShipTo;
                $rootScope.DeliveryLocationCode = response.data.Json.OrderList.LocationCode;
                $rootScope.DeliveryArea = response.data.Json.OrderList.Area;
                $rootScope.TruckSizeId = response.data.Json.OrderList.TruckSizeId;
                $rootScope.TruckSize = response.data.Json.OrderList.TruckSize;
                $rootScope.TruckCapacity = (parseFloat(response.data.Json.OrderList.TruckCapacityWeight) * 1000);
                $rootScope.TruckCapacityInTone = $rootScope.TruckCapacity / 1000;
                $rootScope.TruckCapacityFullInTone = 0;
                $rootScope.TruckCapacityFullInPercentage = 0;

                //if (response.data.Json.OrderLidt.IsSelfCollectEnquiry === "SCO") {
                //    $rootScope.IsSelfCollect = true;
                //} else {
                //    $rootScope.IsSelfCollect = false;
                //}

                $scope.CurrentOrderGuid = generateGUID();

                $scope.OrderProductList = [];
                if (response.data.Json.OrderList.OrderProductsList !== undefined) {
                    $scope.OrderProductList = response.data.Json.OrderList.OrderProductsList;

                    for (var i = 0; i < $scope.OrderProductList.length; i++) {
                        $scope.OrderProductList[i].ProductQuantity = parseInt($scope.OrderProductList[i].ProductQuantity);
                        $scope.OrderProductList[i].PreviousProductQuantity = parseInt($scope.OrderProductList[i].ProductQuantity);
                        $scope.OrderProductList[i].EnquiryProductGUID = generateGUID();
                        $scope.OrderProductList[i].OrderGUID = $scope.CurrentOrderGuid;
                        var remainingProductStock = parseFloat(parseFloat($scope.OrderProductList[i].CurrentStockPosition) - parseFloat($scope.OrderProductList[i].UsedQuantityInOrder));
                        if (parseFloat($scope.OrderProductList[i].ProductQuantity) < remainingProductStock) {
                            $scope.OrderProductList[i].IsItemAvailableInStock = true;
                        } else {
                            $scope.OrderProductList[i].IsItemAvailableInStock = false;
                        }
                    }

                    $scope.EnquiryUnavailableStockProductList = $scope.OrderProductList.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode });

                    $scope.LoadEnquiryAmountDetails($scope.OrderProductList);
                }

                $scope.OrderData = [];
                $scope.EditEnquiryId = response.data.Json.OrderList.OrderId;
                $rootScope.EditedEnquiryId = response.data.Json.OrderList.OrderId;
                $rootScope.TruckCapacityPalettes = response.data.Json.OrderList.TruckCapacityPalettes;

                var orders = {
                    OrderGUID: $scope.CurrentOrderGuid,
                    OrderId: response.data.Json.OrderList.OrderId,
                    TotalWeight: 0,
                    TruckCapacity: response.data.Json.OrderList.TruckCapacityWeight,
                    TruckPallets: 0,
                    TotalProductPallets: 0,
                    NumberOfPalettes: response.data.Json.OrderList.NumberOfPalettes,
                    PalletSpace: response.data.Json.OrderList.PalletSpace,
                    TruckWeight: response.data.Json.OrderList.TruckWeight,
                    SoldTo: response.data.Json.OrderList.CompanyId,
                    TruckCapacityPalettes: response.data.Json.OrderList.TruckCapacityPalettes,
                    TruckCapacityWeight: response.data.Json.OrderList.TruckCapacityWeight,
                    Capacity: response.data.Json.OrderList.Capacity,
                    IsRecievingLocationCapacityExceed: response.data.Json.OrderList.IsRecievingLocationCapacityExceed,
                    ReceivedCapacityPalettesCheck: 0,
                    ReceivedCapacityPalettes: 0,
                    CustomerId: response.data.Json.OrderList.CompanyId,
                    BranchPlantCode: response.data.Json.OrderList.StockLocationId,
                    TruckCapacity: response.data.Json.OrderList.Capacity,
                    CurrentState: response.data.Json.OrderList.CurrentState,
                    NoOfDays: response.data.Json.OrderList.Field8,
                    IsTruckFull: true,
                    IsActive: true,
                    TruckSizeId: response.data.Json.OrderList.TruckSizeId,
                    OrderProductList: $scope.OrderProductList,
                };
                $scope.OrderData.push(orders);
                $scope.LoadTruckSizeInformation(e);
            } else {
                $rootScope.Throbber.Visible = false;
            }
        });
    }

    $scope.LoadCreditCheckByEnquiryId = function (Id, e) {
        var requestData =
            {
                ServicesAction: 'LoadCreditCheckByEnquiryId',
                EnquiryId: Id,
                RoleId: $rootScope.RoleId,
                CultureId: $rootScope.CultureId
            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            if (response.data !== undefined) {
                $scope.EnquiryCreditLimit = response.data.Json.EnquiryList.CreditLimit;
                $scope.EnquiryAvailableCreditLimit = response.data.Json.EnquiryList.AvailableCreditLimit;
                $scope.EnquiryCalculatedCreditLimit = response.data.Json.EnquiryList.CalculatedCredit;

                var outerContainerWidth = document.getElementById("SalesAdminApprovalGrid").clientWidth;
                outerContainerWidth = outerContainerWidth - 10;

                e.component.expandRow(e.data);
                $rootScope.PreviousExpandedRow = e.data;

                var elements = document.getElementsByClassName("EnquiryProductInfoClass");
                var elementId = "";
                for (var i = 0; i < elements.length; i++) {
                    elementId = elements[i].id;
                    elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
                }
            }
        });
    }
    //#endregion

    //#region Load Truck And Pallet Information By Rule
    $scope.LoadTruckSizeInformation = function (e) {
        var requestAreaData =
            {
                ServicesAction: 'GetRuleValue',
                CompanyId: $rootScope.CompanyId,
                CompanyMnemonic: $rootScope.CompanyMnemonic,
                DeliveryLocation: {
                    LocationId: $rootScope.DeliveryLocationId,
                    DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                    Area: $rootScope.DeliveryArea,
                },
                Company: {
                    CompanyId: $rootScope.CompanyId,
                    CompanyMnemonic: $rootScope.CompanyMnemonic,
                },
                RuleType: 5,
                TruckSize: {
                    TruckSize: parseFloat($rootScope.TruckCapacityInTone)
                }
            };

        $scope.AreaPalettesCount = 0
        var jsonobjectArea = {};
        jsonobjectArea.Json = requestAreaData;
        GrRequestService.ProcessRequest(jsonobjectArea).then(function (arearesponse) {
            debugger;

            var arearesponseStr = arearesponse.data.Json;
            if (arearesponseStr.RuleValue != '' && arearesponseStr.RuleValue != undefined) {
                var rulevalue = parseInt(arearesponseStr.RuleValue);
                $scope.AreaPalettesCount = rulevalue;
            }
            if ($scope.AreaPalettesCount > 0) {
                $rootScope.TruckCapacityPalettes = $scope.AreaPalettesCount;
            }
            debugger;
            $rootScope.buindingPalettes = []
            for (var i = 0; i < $rootScope.TruckCapacityPalettes; i++) {
                var palettes = {
                    PalettesWidth: 0
                }
                $rootScope.buindingPalettes.push(palettes);
            }

            if ($rootScope.buindingPalettes.length > 0) {
                $rootScope.IsPalettesRequired = true;
            } else {
                $rootScope.IsPalettesRequired = false;
            }

            var space = 100 - ($rootScope.buindingPalettes.length - 1);
            var width = space / $rootScope.buindingPalettes.length;
            $rootScope.PalettesWidth.width = width + "%";
            debugger;
            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === $rootScope.EditedEnquiryId; });
            if (currentOrder.length > 0) {
                if (currentOrder[0].OrderProductList.length > 0) {
                    currentOrder[0].TruckCapacity = $rootScope.TruckCapacityInTone;
                    currentOrder[0].TruckSizeId = $rootScope.TruckSizeId;
                    currentOrder[0].ShipTo = $rootScope.DeliveryLocationId;
                    currentOrder[0].TruckName = $rootScope.TruckSize;
                    currentOrder[0].DeliveryLocationName = $rootScope.DeliveryLocationName;

                    var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
                    var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');

                    var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
                    truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);

                    $rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
                    $rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);

                    for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                        if (i < parseInt($rootScope.buindingPalettes.length)) {
                            $rootScope.buindingPalettes[i].PalettesWidth = 100;
                        }
                    }

                    var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
                    var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

                    //if ($rootScope.IsSelfCollect === false) {
                    //    if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight) {
                    //        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                    //        return false;

                    //    } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < truckTotalPalettes) {
                    //        var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                    //        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
                    //        return false;
                    //    }
                    //}
                }
            }
            var totalWeightWithPalettes = 0;
            var totalWeightWithBuffer = 0;

            var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
            if (bufferWeight !== "") {
                totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
            }
            var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
            if ($rootScope.IsPalettesRequired) {
                if (weightPerPalettes !== "") {
                    totalWeightWithPalettes = (weightPerPalettes * (truckTotalPalettes));
                }
            }
            $scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $rootScope.TruckCapacity, $rootScope.TruckCapacityPalettes, totalWeightWithPalettes);

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

            debugger;
            //var rowHeight = 35.2;
            //var scrolltotop = Math.ceil(rowHeight * parseFloat(e.rowIndex));
            //var scrollContainer = $("#SalesAdminApprovalGrid").find(".dx-scrollable").first().dxScrollable("instance");
            //scrollContainer.scrollTo({ top: scrolltotop });
        });
    }
    //#endregion

    //#region Load Enquiry Amount Information
    $scope.LoadEnquiryAmountDetails = function (enquiryProduct) {
        debugger;
        if (enquiryProduct.length > 0) {
            enquiryProduct = enquiryProduct.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode; });
            if (enquiryProduct.length > 0) {
                $scope.EnquiryTotalAmount = 0;
                $scope.EnquiryCashDiscount = 0;
                $scope.EnquiryTotalTax = 0;
                $scope.EnquiryNetAmount = 0;
                $scope.EnquiryGrandTotalAmount = 0;
                $scope.EnquiryDepositeAmount = 0;
                $scope.AvailableCreditLimitAmount = 0;

                $scope.GetTotalAmountOfOrder(enquiryProduct);
                $scope.GetCashDiscountOnProducts(enquiryProduct);
                $scope.GetTotalNetAmountOfEnquiry(enquiryProduct);
                $scope.GetTotalTaxOfEnquiry(enquiryProduct);
                $scope.LoadEnquiryTotalDepositeAmount(enquiryProduct);
                $scope.GetGrandTotalAmountOfEnquiry(enquiryProduct);

                $scope.AvailableCreditLimitAmount = Number($scope.AvailableCreditLimit) - Number($scope.EnquiryGrandTotalAmount);
            }
        }
    }
    //#endregion

    //#region Load Enquiry Deposite Amount

    $scope.LoadEnquiryTotalDepositeAmount = function (enquiryProductList) {
        debugger;
        for (var i = 0; i < enquiryProductList.length; i++) {
            $scope.EnquiryDepositeAmount = $scope.EnquiryDepositeAmount + parseFloat(enquiryProductList[i].ItemTotalDepositeAmount);
        }
        return $scope.EnquiryDepositeAmount;
    }

    //#endregion

    //#region Load Enquiry Total Amount

    $scope.GetTotalAmountOfOrder = function (enquiryProductList) {
        for (var i = 0; i < enquiryProductList.length; i++) {
            $scope.EnquiryTotalAmount = $scope.EnquiryTotalAmount + parseFloat(enquiryProductList[i].ItemPrices);
        }
        return $scope.EnquiryTotalAmount;
    }
    //#endregion

    //#region Load Enquiry Product Cash Discount

    $scope.GetCashDiscountOnProducts = function (enquiryProductList) {
        debugger;
        for (var i = 0; i < enquiryProductList.length; i++) {
            $scope.EnquiryCashDiscount = $scope.EnquiryCashDiscount + parseFloat(enquiryProductList[i].DiscountAmount);
        }
        return $scope.EnquiryCashDiscount;
    }
    //#endregion

    //#region Load Enquiry Total Tax

    $scope.GetTotalTaxOfEnquiry = function () {
        debugger;
        $scope.EnquiryTotalTax = percentage(parseFloat($scope.EnquiryNetAmount), $scope.ItemTaxInPec);
        return $scope.EnquiryTotalTax;
    }
    //#endregion

    //#region Load Enquiry Net Amount

    $scope.GetTotalNetAmountOfEnquiry = function () {
        debugger;
        $scope.EnquiryNetAmount = parseFloat($scope.EnquiryTotalAmount) - (parseFloat($scope.DiscountAmount) + parseFloat($scope.EnquiryCashDiscount));
        return $scope.EnquiryNetAmount;
    }
    //#endregion

    //#region Load Enquiry Grand Total Amount

    $scope.GetGrandTotalAmountOfEnquiry = function (enquiryProductList) {
        debugger;
        $scope.EnquiryGrandTotalAmount = parseFloat($scope.EnquiryNetAmount) + parseFloat($scope.EnquiryTotalTax) + parseFloat($scope.EnquiryDepositeAmount);

        return $scope.EnquiryGrandTotalAmount;
    }
    //#endregion

    //#region Approve Enquiry Event and Functions

    $scope.ApproveSelectedEnquiry = function () {
        debugger;
        if ($scope.SalesAdminApprovalList !== undefined) {
            var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
            if (enquiryList.length > 0) {
                var enquiryAutoNumberList = "";
                for (var i = 0; i < enquiryList.length; i++) {
                    debugger;
                    enquiryAutoNumberList = enquiryAutoNumberList + "," + enquiryList[i].EnquiryAutoNumber;
                    enquiryAutoNumberList = enquiryAutoNumberList.replace(/^,/, '');
                }
                $scope.ApproveEnquiry(enquiryAutoNumberList);
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
            }
        }
    }

    $scope.ApproveEnquiry = function (enquiryAutoNumberList) {
        debugger;
        var settingValue = 0;
        if ($sessionStorage.AllSettingMasterData != undefined) {
            var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === "DefaultLeadTime"; });
            if (settingMaster.length > 0) {
                settingValue = settingMaster[0].SettingValue;
            }
        }

        debugger;

        var requestData =
            {
                ServicesAction: 'ApproveEnquiry',
                EnquiryAutoNumber: enquiryAutoNumberList,
                UserName: $rootScope.UserName,
                UserId: $rootScope.UserId,
                DefaultLeadTime: settingValue
            };

        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            $scope.RefreshDataGrid();
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_AwaitingSONumber), '', 3000);
        });
    }

    $scope.ApproveEnquiryByEnquiryNumber = function (enquiryNumber) {
        debugger;
        $scope.ApproveEnquiry(enquiryNumber);
    }
    //#endregion

    //#region Reject Enquiry Event and Function

    $scope.RejectEnquiryByEnquiryNumber = function (enquiryNumber) {
        debugger;
        var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryAutoNumber === enquiryNumber; });
        if (enquiryList.length > 0) {
            var objectList = [];

            for (var i = 0; i < enquiryList.length; i++) {
                debugger;

                var object = {};
                object.ObjectId = enquiryList[i].OrderId;

                objectList.push(object);
            }

            var mainObject = {};
            mainObject.ObjectList = objectList;
            mainObject.ObjectType = "Enquiry";
            mainObject.ReasonCodeEventName = "RejectEnquiry";
            mainObject.FunctionName = "RejectEnquiry";
            mainObject.FunctionParameter = enquiryList;

            $rootScope.OpenReasoncodepopup(mainObject);
        }
    }

    $scope.RejectSelectedEnquiry = function () {
        debugger;
        if ($scope.SalesAdminApprovalList !== undefined) {
            var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
            if (enquiryList.length > 0) {
                //for (var i = 0; i < enquiryList.length; i++) {
                //    debugger;
                //    $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId + "," + enquiryList[i].EnquiryId;
                //    $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId.replace(/^,/, '');
                //}

                var objectList = [];

                for (var i = 0; i < enquiryList.length; i++) {
                    debugger;

                    var object = {};
                    object.ObjectId = enquiryList[i].OrderId;

                    objectList.push(object);
                }

                var mainObject = {};
                mainObject.ObjectList = objectList;
                mainObject.ObjectType = "Enquiry";
                mainObject.ReasonCodeEventName = "RejectEnquiry";
                mainObject.FunctionName = "RejectEnquiry";
                mainObject.FunctionParameter = enquiryList;
                $rootScope.LoadReasonCode("ReasonCode");
                $rootScope.OpenReasoncodepopup(mainObject);

                // $rootScope.OpenReasoncodepopup(enquiryList, "RejectEnquiry");
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
            }
        }
    }



    $scope.CancelSelectedOrder = function () {
        debugger;
        if ($scope.SalesAdminApprovalList !== undefined) {
            var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
            if (enquiryList.length > 0) {
                var objectList = [];

                for (var i = 0; i < enquiryList.length; i++) {
                    debugger;
                    var object = {};
                    object.ObjectId = enquiryList[i].OrderId;
                    object.UserId = $rootScope.UserId;
                    objectList.push(object);
                }

                var mainObject = {};
                mainObject.ObjectList = objectList;
                mainObject.ObjectType = "Order";
                mainObject.ReasonCodeEventName = "CancelOrder";
                mainObject.FunctionName = "CancelOrder";
                mainObject.ReasonCategory = "CancelOrder";
                $rootScope.Action = "Clear";
                mainObject.FunctionParameter = enquiryList;
                $rootScope.LoadReasonCode("OrderCancelReason");
                $rootScope.OpenReasoncodepopup(mainObject);

                // $rootScope.OpenReasoncodepopup(enquiryList, "RejectEnquiry");
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_SelectOrderCancelReson), 'error', 3000);
            }
        }
    }


    $scope.CancelOrder = function (enquiryList) {
        debugger;

        for (var i = 0; i < enquiryList.length; i++) {
            enquiryList[i].UserId = $rootScope.UserId;

        }


        var requestData =
            {
                ServicesAction: 'CancelOrderDetail',
                EnquiryList: enquiryList,
                UserId: $rootScope.UserId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            $scope.RefreshDataGrid();
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_EnquiryCancel), '', 3000);
        });
    }






    $scope.RejectEnquiry = function (enquiryList) {
        var requestData =
            {
                ServicesAction: 'RejectEnquiry',
                EnquiryList: enquiryList,
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            $scope.RefreshDataGrid();
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_EnquiryRejected), '', 3000);
        });
    }

    //#endregion

    //#region Refresh DataGrid
    $scope.RefreshDataGrid = function () {
        debugger;
        $scope.SalesAdminApprovalList = [];
        //$scope.GridConfigurationLoaded = false;
        $scope.IsEnquiryEdit = false;
        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#SalesAdminApprovalGrid").dxDataGrid("instance");
        dataGrid.refresh();
        //debugger;
        //dataGrid = dataGrid.option("dataSource");
        //if (dataGrid != undefined) {
        //    dataGrid.store.load();
        //}
    }
    //#endregion

    //#region Export To Excel
    $scope.ExportToExcelSalesAdminApprovalData = function () {
        debugger;
        if ($scope.GridColumnList.length > 0) {
            $rootScope.Throbber.Visible = true;
            $scope.RequestDataFilter.ServicesAction = "ExportToExcelGrid";
            $scope.RequestDataFilter.ColumnList = $scope.GridColumnList.filter(function (el) { return el.IsExportAvailable === '1' && el.PropertyName !== 'CheckedEnquiry'; });

            var jsonobject = {};
            jsonobject.Json = $scope.RequestDataFilter;
            jsonobject.Json.IsExportToExcel = '1';

            GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
                debugger;
                var byteCharacters1 = response.data;
                if (response.data !== undefined) {
                    var byteCharacters = response.data;
                    var blob = new Blob([byteCharacters], {
                        type: "application/Pdf"
                    });
                    debugger;
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

    //#region Update Bulk Branch Plant
    $ionicModal.fromTemplateUrl('templates/ChangeBranchPlantCode.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        $scope.ChangeBranchPlantCodePopup = modal;
    });

    $scope.OpenChangeBranchPlantCodePopup = function (enquiryDetails, eventName) {
        $rootScope.EnquiryDetailsForAction = enquiryDetails;
        $rootScope.ReasonCodeEventName = eventName;
        $scope.ChangeBranchPlantCodePopup.show();
        $rootScope.Throbber.Visible = false;
    }


    $scope.CloseChangeBranchPlantCodePopup = function () {
        debugger;
        $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry = "";
        if ($scope.SearchControl.InputCollection !== undefined) {
            $scope.SearchControl.InputCollection = "";
        }
        $scope.ChangeBranchPlantCodePopup.hide();
        $rootScope.CloseReasoncodepopup();
    }
    //$scope.OpenChangeDeliveryLocationCodePopup = function (enquiryDetails, eventName) {
    //    $rootScope.EnquiryDetailsForAction = enquiryDetails;
    //    $rootScope.ReasonCodeEventName = eventName;
    //     $scope.ChangeBranchPlantCodePopup.show();
    //     $rootScope.Throbber.Visible = false;
    // }



    $ionicModal.fromTemplateUrl('templates/ChangeDeliveryLocationCode.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        $scope.ChangeDeliveryLocationCodePopup = modal;
    });
    $scope.OpenChangeDeliveryLocationCodePopup = function (enquiryDetails, eventName) {
        $rootScope.EnquiryDetailsForAction = enquiryDetails;
        $rootScope.ReasonCodeEventName = eventName;
        $scope.ChangeDeliveryLocationCodePopup.show();
        $rootScope.Throbber.Visible = false;
    }

    $scope.CloseChangeDeliveryLocationCodePopup = function () {
        debugger;
        $scope.SelectedDeliveryLocation.DeliveryLocationForSelectedEnquiry = "";
        if ($scope.SearchControl.InputShipToLocation !== undefined) {
            $scope.SearchControl.InputShipToLocation = "";
        }
        $scope.ChangeDeliveryLocationCodePopup.hide();
        $rootScope.CloseReasoncodepopup();
    }


    $scope.ChangeSelectedEnquiryBranchPlant = function () {
        debugger;
        $scope.BindAllBranchPlantByCompany = [];
        $rootScope.Action = "Clear";
        $rootScope.Throbber.Visible = true;
        var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
        if (enquiryDetails.length > 0) {
            if ($scope.IsMultipleCustomerUpdateBranchPlantApplicable === false) {
                var companyName = enquiryDetails[0].CompanyName;
                var CheckDifferentCompany = enquiryDetails.filter(function (el) { return el.CompanyName !== companyName; });
                if (CheckDifferentCompany.length > 0) {
                    $rootScope.Throbber.Visible = false;
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_DifferentCompany), 'error', 3000);
                    return false;
                } else {
                    if ($rootScope.bindAllBranchPlant !== undefined && $rootScope.bindAllBranchPlant !== null) {
                        $scope.BindAllBranchPlantByCompany = $rootScope.bindAllBranchPlant.filter(function (el) { return el.CompanyID === enquiryDetails[0].SoldTo });
                    }
                }
            } else {
                $scope.BindAllBranchPlantByCompany = $rootScope.bindAllBranchPlant;
            }

            for (var i = 0; i < enquiryDetails.length; i++) {
                debugger;
                $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId + "," + enquiryDetails[i].EnquiryId;
                $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId.replace(/^,/, '');
            }
            $rootScope.LoadReasonCode("ChangeBranchPlantReason");
            $scope.OpenChangeBranchPlantCodePopup(enquiryDetails, "UpdateBranchPlant");
            $rootScope.Throbber.Visible = false;
        } else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
        }
    }




    $scope.ChangeSelectedEnquiryDeliveryLocation = function () {
        debugger;
        $scope.BindAllDeliveryLocationByCompany = [];
        $rootScope.Action = "Clear";
        $rootScope.Throbber.Visible = true;
        var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
        if (enquiryDetails.length > 0) {
            if ($scope.IsMultipleCustomerUpdateBranchPlantApplicable === false) {
                var companyName = enquiryDetails[0].CompanyName;
                var CheckDifferentCompany = enquiryDetails.filter(function (el) { return el.CompanyName !== companyName; });
                if (CheckDifferentCompany.length > 0) {
                    $rootScope.Throbber.Visible = false;
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_DifferentCompany), 'error', 3000);
                    return false;
                } else {
                    if ($rootScope.bindAllDeliveryLocation !== undefined && $rootScope.bindAllDeliveryLocation !== null) {
                        $scope.BindAllDeliveryLocationByCompany = $rootScope.bindAllDeliveryLocation.filter(function (el) { return el.CompanyID === enquiryDetails[0].SoldTo });
                    }
                }
            } else {
                $scope.BindAllDeliveryLocationbyCompany = $rootScope.bindAllBranchPlant;
            }

            for (var i = 0; i < enquiryDetails.length; i++) {
                debugger;
                $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId + "," + enquiryDetails[i].EnquiryId;
                $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId.replace(/^,/, '');
            }
            $rootScope.LoadReasonCode("ChangeDeliveryLocationReason");
            $scope.OpenChangeDeliveryLocationCodePopup(enquiryDetails, "UpdateDeliveryLocation");
            $rootScope.Throbber.Visible = false;
        } else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
        }
    }



    $scope.SaveBranchPlantForSelectedEnquiry = function () {
        debugger;
        if ($scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry !== "") {
            $rootScope.Throbber.Visible = true;
            $scope.SelectedEnquiryId = "";
            var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
            if (orderDetails.length > 0) {
                var objectList = [];

                for (var i = 0; i < orderDetails.length; i++) {
                    debugger;

                    var object = {};
                    object.ObjectId = orderDetails[i].OrderId;

                    objectList.push(object);
                }

                var mainObject = {};
                mainObject.ObjectList = objectList;
                mainObject.ObjectType = "Order";
                mainObject.ReasonCodeEventName = "UpdateBranchPlant";
                mainObject.FunctionName = "UpdateBranchPlantForSelectorder";
                mainObject.FunctionParameter = orderDetails;
                $rootScope.SaveReasonCode(mainObject);
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);
        }
    }

    $scope.UpdateBranchPlantForSelectorder = function (orderDetails) {
        var selectedOrderId = "";

        for (var i = 0; i < orderDetails.length; i++) {
            selectedOrderId = selectedOrderId + ',' + orderDetails[i].OrderId;
        }
        selectedOrderId = selectedOrderId.substr(1);

        var orderList = {
            BranchPlantName: $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry,
            OrderId: selectedOrderId,
        }

        var requestData =
            {
                ServicesAction: 'UpdateOrderBranchPlant',
                OrderDetailList: orderList
            };

        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            $scope.CloseChangeBranchPlantCodePopup();

            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_BranchPlantUpdated), '', 3000);
            $scope.RefreshDataGrid();
            //var dataGrid = $("#SalesAdminApprovalGrid").dxDataGrid("instance");
            //dataGrid.refresh();
        });
    }

    //#endregion




    $scope.SaveDeliveryLocationForSelectedEnquiry = function () {
        debugger;
        if ($scope.SelectedDeliveryLocation.DeliveryLocationForSelectedEnquiry !== "") {
            $rootScope.Throbber.Visible = true;
            $scope.SelectedEnquiryId = "";
            var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
            if (orderDetails.length > 0) {
                var objectList = [];

                for (var i = 0; i < orderDetails.length; i++) {
                    debugger;

                    var object = {};
                    object.ObjectId = orderDetails[i].OrderId;

                    objectList.push(object);
                }

                var mainObject = {};
                mainObject.ObjectList = objectList;
                mainObject.ObjectType = "Order";
                mainObject.ReasonCodeEventName = "UpdateDeliveryLocation";
                mainObject.FunctionName = "UpdateDeliveryLocationForSelectorder";
                mainObject.FunctionParameter = orderDetails;
                $rootScope.SaveReasonCode(mainObject);
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);
        }
    }

    $scope.UpdateDeliveryLocationForSelectorder = function (orderDetails) {
        var selectedOrderId = "";

        for (var i = 0; i < orderDetails.length; i++) {
            selectedOrderId = selectedOrderId + ',' + orderDetails[i].OrderId;
        }
        selectedOrderId = selectedOrderId.substr(1);

        var orderList = {
            DeliveryLocationName: $scope.SelectedDeliveryLocation.DeliveryLocationForSelectedEnquiry,
            OrderId: selectedOrderId,
        }

        var requestData =
            {
                ServicesAction: 'UpdateOrderDeliveryLocation',
                OrderDetailList: orderList
            };

        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            $scope.CloseChangeDeliveryLocationCodePopup();

            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_DeliveryLocationUpdated), '', 3000);
            $scope.RefreshDataGrid();
            //var dataGrid = $("#SalesAdminApprovalGrid").dxDataGrid("instance");
            //dataGrid.refresh();
        });
    }

    //#region On Load Grid Configuration
    $scope.GridConfigurationLoaded = false;
    $scope.LoadGridByConfiguration = function (e) {
        debugger;

        console.log("9" + new Date());

        var dataGrid = $("#SalesAdminApprovalGrid").dxDataGrid("instance");

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

    //#endregion

    //#region Note Popup Intialization And Load Note Infomation.

    $scope.NoteVariable = {
        NoteText: ''
    }

    $scope.AddNotesModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/AddNotesForObject.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {
            debugger;
            $scope.AddNotesPopup = modal;
        });
    }
    $scope.AddNotesModalPopup();
    $scope.OpenAddNotesModalPopup = function () {
        debugger;
        $scope.AddNotesPopup.show();
    }
    $scope.CloseAddNotesModalPopup = function () {
        debugger;
        $scope.AddNotesPopup.hide();
    }

    $scope.OpenModelPoppupNote = function (enquiryId) {
        debugger;

        var requestData =
            {
                ServicesAction: 'GetNoteByObjectId',
                ObjectId: enquiryId,
                RoleId: $rootScope.RoleId,
                ObjectType: 1220,
                UserId: $rootScope.UserId
            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (NotesResponse) {
            debugger;
            var NotesResponsedata = NotesResponse.data;

            $scope.OpenAddNotesModalPopup();

            if (NotesResponsedata.Json !== undefined) {
                var notesData = NotesResponsedata.Json.NotesList;

                if (notesData.length > 0) {
                    $scope.NoteVariable.NoteText = notesData[0].Note;
                } else {
                    $scope.NoteVariable.NoteText = "";
                }
            }
            else {
                $scope.NoteVariable.NoteText = "";
            }
        });
    }

    //#endregion

    //#region change language
    $rootScope.GridRecallForStatus = function () {
        debugger;
        $scope.IsRefreshGrid = true;
        $scope.GridConfigurationLoaded = false;
        $scope.LoadGridConfigurationData();
    }
    //#endregion

    //#region Edit and Remove Enquiry Products
    $scope.IsEnquiryEdit = false;
    $scope.RemoveEnquiryProductId = 0;

    $scope.ConfirmationMessageModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/ConfirmationMessageModalPopup.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {
            debugger;
            $scope.ConfirmationMessageModal = modal;
        });
    }
    $scope.ConfirmationMessageModalPopup();
    $scope.OpenConfirmationMessageModalPopup = function () {
        debugger;
        $scope.ConfirmationMessageModal.show();
    }
    $scope.CloseConfirmationMessageModalPopup = function () {
        debugger;
        $scope.ConfirmationMessageModal.hide();
    }

    $scope.EditEnquiryByEnquiry = function (enquiryId) {
        debugger;
        if ($scope.IsEnquiryEdit === true) {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === enquiryId; });
            if (currentOrder.length > 0) {
                if (currentOrder[0].OrderProductList !== undefined) {
                    for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
                        currentOrder[0].OrderProductList[i].ProductQuantity = parseInt(currentOrder[0].OrderProductList[i].PreviousProductQuantity);
                    }
                }
            }
            $scope.ReloadGraph($scope.OrderData, 0);
            $scope.IsEnquiryEdit = false;
        }
        else {
            $scope.IsEnquiryEdit = true;
        }
    }

    $scope.getSelectedDriverValue = function (driverId, orderid) {
        debugger;

        var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderid; });

        if (enquiryDetails.length > 0) {
            enquiryDetails[0].DeliveryPersonnelId = driverId;
        }
    }

    $scope.getSelectedPlateNumberValue = function (PlateNumber, orderid) {
        debugger;

        var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderid; });

        if (enquiryDetails.length > 0) {
            enquiryDetails[0].PlateNumber = PlateNumber;
        }
    }

    $scope.RemoveProductFromEnquiry = function (orderid, orderProductId) {
        debugger;
        var enquiryProducts = $scope.OrderData[0].OrderProductList.filter(function (el) { return el.OrderId === orderid && el.EnquiryProductGUID === orderProductId });
        if (enquiryProducts.length > 0) {
            $scope.RemoveEnquiryProductId = orderProductId;
            $scope.OpenConfirmationMessageModalPopup();
        } else {
        }
    }

    $scope.RemoveEnquiryProduct = function () {
        debugger;
        var productList = $scope.OrderData[0].OrderProductList.filter(function (el) { return el.EnquiryProductGUID === $scope.RemoveEnquiryProductId });
        if (productList.length > 0) {
            var ItemId = productList[0].ItemId;
            $scope.OrderData[0].OrderProductList = $scope.OrderData[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 30 || el.EnquiryProductGUID !== $scope.RemoveEnquiryProductId });
            if ($scope.IsPalletLoadCheckValidation === true || $scope.IsWeightLoadCheckValidation === true) {
                $scope.OrderData[0].IsTruckFull = false;
            }
            $scope.RemovePromotionItem($scope.OrderData, ItemId);

            if ($scope.OrderData[0].OrderProductList.length === 1) {
                if ($scope.OrderData[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                    $scope.OrderData[0].OrderProductList = [];
                }
            }

            $scope.ReloadGraph($scope.OrderData, 0);
            $scope.LoadEnquiryAmountDetails($scope.OrderData[0].OrderProductList);
            $scope.CloseConfirmationMessageModalPopup();
        }
    }

    //#endregion

    //#region Update Enquiry Products
    $scope.UpdateOrderByOrder = function (enquiryId) {
        debugger;
        if ($scope.IsEnquiryEdit === true) {
            $rootScope.Throbber.Visible = true;
            //if (($scope.AvailableCreditLimit - ($scope.EnquiryGrandTotalAmount)) < 0) {
            //    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_TotalOMCreditLimitValidation), 'error', 3000);
            //    $rootScope.Throbber.Visible = false;
            //    return false;
            //}

            $scope.EnquiryList = [];
            if ($scope.OrderData[0].IsTruckFull === true) {
                if ($scope.OrderData[0].OrderProductList.length > 0) {
                    var equirydata = {};
                    equirydata.OrderId = $scope.OrderData[0].OrderProductList[0].OrderId;
                    equirydata.UpdatedBy = $rootScope.UserId;
                    equirydata.OrderProductList = [];
                    for (var i = 0; i < $scope.OrderData[0].OrderProductList.length; i++) {
                        var equiryProductdata = {};
                        equiryProductdata.OrderProductId = $scope.OrderData[0].OrderProductList[i].OrderProductId;
                        equiryProductdata.ProductQuantity = $scope.OrderData[0].OrderProductList[i].ProductQuantity;
                        equiryProductdata.IsActive = $scope.OrderData[0].OrderProductList[i].IsActive;
                        equiryProductdata.EnquiryId = $scope.OrderData[0].OrderProductList[i].EnquiryId;
                        equiryProductdata.ProductCode = $scope.OrderData[0].OrderProductList[i].ProductCode;
                        equiryProductdata.ProductType = $scope.OrderData[0].OrderProductList[i].ProductType;
                        equiryProductdata.UnitPrice = $scope.OrderData[0].OrderProductList[i].UnitPrice;
                        equiryProductdata.ItemType = $scope.OrderData[0].OrderProductList[i].ItemType;
                        equiryProductdata.ProductQuantity = $scope.OrderData[0].OrderProductList[i].ProductQuantity;
                        equiryProductdata.CreatedBy = $rootScope.UserId;
                        equiryProductdata.UpdatedBy = $rootScope.UserId;
                        equiryProductdata.Remarks = "";
                        equiryProductdata.SequenceNo = 0;
                        equiryProductdata.AssociatedOrder = 0;
                        if ($scope.OrderData[0].OrderProductList[i].DepositeAmount !== undefined) {
                            equiryProductdata.DepositeAmount = $scope.OrderData[0].OrderProductList[i].DepositeAmount;
                        } else {
                            equiryProductdata.DepositeAmount = 0;
                        }
                        equirydata.OrderProductList.push(equiryProductdata);
                    }
                    $scope.EnquiryList.push(equirydata);
                    debugger;
                    var Enquiry =
                        {
                            ServicesAction: "UpdateOrderProduct",
                            OrderList: $scope.EnquiryList
                        }

                    var jsonobject = {};
                    jsonobject.Json = Enquiry;
                    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                        debugger;
                        $rootScope.Throbber.Visible = false;
                        $scope.IsEnquiryEdit = false;
                        $scope.EnableAddItem = false;
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApproval_UpdateEnquiry), 'error', 3000);
                    });
                }
                else {
                    $rootScope.Throbber.Visible = false;
                }
            } else {
                $rootScope.Throbber.Visible = false;
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApproval_TruckNotFull), 'error', 3000);
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApproval_EditModeNotEnable), 'error', 3000);
        }
    }
    //#endregion

    //#region Get Item Information

    $rootScope.PromotionItemList = [];

    $scope.LoadItemListByCompany = function () {
        debugger;
        var requestData =
            {
                ServicesAction: 'LoadAllProducts',
                CompanyId: $rootScope.CompanyId,
                ItemValue: $scope.SearchControl.InputItem,
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data;
            $scope.bindallproduct = resoponsedata.Item.ItemList;

            $rootScope.Throbber.Visible = false;


        });
    }

    //$scope.LoadItemListByCompany();

    //#endregion

    //#region Load Pramotion Item List
    $scope.LoadPramotionItem = function () {
        debugger;
        var requestPromotionData =
            {
                ServicesAction: 'GetPromotionFocItemList',
                CompanyId: $rootScope.CompanyId,
                Region: $scope.DeliveryArea
            };
        var jsonPromotionobject = {};
        jsonPromotionobject.Json = requestPromotionData;
        GrRequestService.ProcessRequest(jsonPromotionobject).then(function (Promotionresponse) {
            debugger;
            var resoponsedata = Promotionresponse.data;
            if (resoponsedata.PromotionFocItemDetail !== undefined) {
                $rootScope.PromotionItemList = resoponsedata.PromotionFocItemDetail.PromotionFocItemDetailList;
            }
        });
    }

    //$scope.LoadPramotionItem();

    //#endregion

    //#region Get Item Details Event

    $scope.GetItemDetails = function (itemId, enquiryId, productQuantity, uom) {
        debugger;
        $scope.IsItemEdit = true;
        $rootScope.IsSelfCollect = false;
        $rootScope.IsPalettesRequired = true;
        $scope.UOM = uom;
        $scope.getItemPrice(itemId, 0);
    }

    $scope.selectedItemEvent = function (itemId) {

        debugger;

        var requestData =
            {
                ServicesAction: 'LoadItemDetaiByItemId',
                CompanyId: $scope.ActiveCompanyId,
                ItemId: itemId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;

            $scope.bindallproduct = [];

            $scope.bindallproduct = resoponsedata.Json.ItemList;


            $scope.getItemPrice(itemId, 0);
        });



    }

    $scope.getItemPrice = function (itemId, associatedCount) {
        try {
            debugger;
            $rootScope.Throbber.Visible = true;
            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
            if (productNameStr.length > 0) {
                $scope.ItemPrices = productNameStr[0].Amount;
                if (associatedCount === 0) {
                    $scope.ItemDepositeAmount = productNameStr[0].CurrentDeposit;
                } else {
                    $scope.ItemDepositeAmount = 0;
                }
                $scope.UOM = productNameStr[0].UOM;
                $scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
                $scope.SearchControl.InputItem = productNameStr[0].ItemNameCode;
                $scope.ItemField.itemId = productNameStr[0].ItemId;
                $scope.showItembox = false;
                focus('inputItemsQty');
            }
            else {
                $scope.ItemPrices = 0;
                $scope.ItemCodeForDeposite = '';
            }





            ///request for item deposite log

            var requestDataforItemDepositeLog =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: itemId,
                    ObjectType: "Item Deposite  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'On Item Selection In Enquiry Page For Item Deposite Amount. Item : ' + itemId + ' And Amount : ' + $scope.ItemDepositeAmount + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var consolidateApiParamaterItemDeposite =
                {
                    Json: requestDataforItemDepositeLog,
                };




            var GetResponseForItemDepositeLog = GrRequestService.ProcessRequest(consolidateApiParamaterItemDeposite);



            ///request for current stock position

            $scope.ItemCurrentStockPosition = 0;
            var requestDataForCurrenttStockPosition =
                {
                    ServicesAction: 'GetProductCurrenttStockPosition',
                    ProductCode: productNameStr[0].ItemCode,
                    DeliveryLocationCode: $rootScope.BranchPlantCodeEdit
                };

            var jsonobjectForCurrenttStockPosition = {};
            jsonobjectForCurrenttStockPosition.Json = requestDataForCurrenttStockPosition;

            var GetResponsedataForProductCurrenttStockPosition = GrRequestService.ProcessRequest(jsonobjectForCurrenttStockPosition);


            ///request for   item allocation

            var requestDataItemAllocation =
                {
                    ServicesAction: 'GetItemAllocation',
                    DeliveryLocation: {
                        LocationId: $rootScope.DeliveryLocationId,
                        DeliveryLocationCode: $rootScope.DeliveryLocationCode
                    },
                    CompanyId: $scope.ActiveCompanyId,
                    CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                    Company: {
                        CompanyId: $scope.ActiveCompanyId,
                        CompanyMnemonic: $scope.ActiveCompanyMnemonic
                    },
                    RuleType: 2,
                    Item: {
                        ItemId: parseInt(itemId),
                        SKUCode: $scope.ItemCodeForDeposite,
                    },
                    EnquiryId: 0
                };
            $scope.Allocation = 'NA';
            $scope.ActualAllocation = 'NA';
            var jsonobjectForItemAllocation = {};
            jsonobjectForItemAllocation.Json = requestDataItemAllocation;

            var GetResponsedataForItemAllocation = GrRequestService.ProcessRequest(jsonobjectForItemAllocation);




            ///request for   item allocation   log

            var requestDataLogforItemAllocationLog =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: itemId,
                    ObjectType: "Item Allocation  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'On Item Selection In Enquiry Page For Item Allocation. Item : ' + itemId + ' And Allocation : ' + $scope.Allocation + 'and ' + $scope.ActualAllocation + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var jsonobjectForItemAllocationLog =
                {
                    Json: requestDataLogforItemAllocationLog,
                };

            var GetResponsedataForItemAllocationLog = GrRequestService.ProcessRequest(jsonobjectForItemAllocationLog);



            if (associatedCount == 0) {


                ///request for  requestLayerData


                var requestLayerData =
                    {
                        ServicesAction: 'GetRuleValue',
                        CompanyId: $scope.ActiveCompanyId,
                        CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                        DeliveryLocation: {
                            LocationId: $rootScope.DeliveryLocationId,
                            DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                        },
                        Company: {
                            CompanyId: $scope.ActiveCompanyId,
                            CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                        },
                        RuleType: 4,
                        Item: {
                            SKUCode: productNameStr[0].ItemCode
                        }

                    };

                $scope.IsItemLayerAllow = false;
                var jsonLayerobject = {};
                jsonLayerobject.Json = requestLayerData;

                var GetResponsedataForLayerData = GrRequestService.ProcessRequest(jsonLayerobject);




                ///request for  requestKegRule

                var noOfExtraPalettes = 0;

                var requestDataForKegRule =
                    {
                        ServicesAction: 'GetRuleValue',
                        CompanyId: $scope.ActiveCompanyId,
                        CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                        DeliveryLocation: {
                            LocationId: $rootScope.DeliveryLocationId,
                            DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                        },
                        Company: {
                            CompanyId: $scope.ActiveCompanyId,
                            CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                        },
                        RuleType: 3,
                        Item: {
                            UOM: $scope.UOM
                        }

                    };
                var jsonobjectForKegRule = {};
                jsonobjectForKegRule.Json = requestDataForKegRule;



                var GetResponsedataForKegRule = GrRequestService.ProcessRequest(jsonobjectForKegRule);


                debugger;

                $q.all([
                    GetResponseForItemDepositeLog,
                    GetResponsedataForProductCurrenttStockPosition,
                    GetResponsedataForItemAllocation,
                    GetResponsedataForItemAllocationLog,
                    GetResponsedataForLayerData,
                    GetResponsedataForKegRule
                ]).then(function (resp) {


                    debugger;
                    var responseForItemDepositeLog = resp[0];
                    var responseForProductCurrenttStockPosition = resp[1];
                    var responseForItemAllocation = resp[2];
                    var responseForItemAllocationLog = resp[3];
                    var responseForLayerData = resp[4];
                    var GetResponsedataForKegRule = resp[5];



                    if (responseForProductCurrenttStockPosition.data.ItemStock !== undefined) {
                        $scope.ItemCurrentStockPosition = responseForProductCurrenttStockPosition.data.ItemStock.CurrentStockPosition;
                    } else {
                        $scope.ItemCurrentStockPosition = 0;
                    }



                    if (responseForItemAllocation.data !== null) {
                        var responseStr = responseForItemAllocation.data.Json;
                        var currentOrder = $scope.OrderData;
                        $scope.CheckAllocatonPresent = responseStr.Allocation;
                        if (responseStr.Allocation != 'NA') {
                            if ($scope.IsItemEdit) {

                                var UsedAllocationQty = $scope.GetPendingAllocation('NA', 0, currentOrder, itemId, responseStr.ItemList);
                                $scope.Allocation = parseInt(responseStr.Allocation) - parseInt(UsedAllocationQty);
                                $scope.ActualAllocation = parseInt(responseStr.Allocation);
                            }
                            else {

                                var UsedAllocationQty = $scope.GetPendingAllocation('NA', 0, currentOrder, itemId, responseStr.ItemList);
                                $scope.Allocation = parseInt(responseStr.Allocation) - parseInt(UsedAllocationQty);
                                $scope.ActualAllocation = parseInt(responseStr.Allocation);
                            }
                        }
                        else {
                            $scope.Allocation = responseStr.Allocation;
                            $scope.ActualAllocation = responseStr.Allocation;
                        }
                    }



                    var responseItemLayerStr = responseForLayerData.data.Json;
                    if (responseItemLayerStr.RuleValue != '' && responseItemLayerStr.RuleValue != undefined) {

                        if (responseItemLayerStr.RuleValue === '1') {
                            $scope.IsItemLayerAllow = true;
                        }
                        else {
                            $scope.IsItemLayerAllow = false;
                        }


                    }



                    var responseExtraPalettesStr = GetResponsedataForKegRule.data.Json;

                    if (responseExtraPalettesStr.RuleValue != '' && responseExtraPalettesStr.RuleValue != undefined) {
                        noOfExtraPalettes = parseInt(responseExtraPalettesStr.RuleValue);
                        if (noOfExtraPalettes > 0) {
                            noOfExtraPalettes = noOfExtraPalettes;
                        }
                    }
                    var validQty = $scope.CheckForNewQty(itemId, productNameStr[0].ItemType, $scope.ItemField.inputItemsQty, productNameStr, noOfExtraPalettes);
                    $scope.MaxPermissibleQuantity = validQty;





                    $rootScope.Throbber.Visible = false;


                });





            }




        } catch (e) {
            $rootScope.Throbber.Visible = false;
        }
    }

    $scope.CheckingExtraPalettesBeforeAddingItem = function (itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode) {
        debugger;

        if (itemId != 0 && itemId != "") {
            $rootScope.Throbber.Visible = true;

            var noOfExtraPalettes = 0;
            var requestData =
                {
                    ServicesAction: 'GetRuleValue',
                    CompanyId: $scope.CompanyId,
                    CompanyMnemonic: $scope.CompanyMnemonic,
                    DeliveryLocation: {
                        LocationId: $rootScope.DeliveryLocationId,
                        DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                    },
                    Company: {
                        CompanyId: $scope.CompanyId,
                        CompanyMnemonic: $scope.CompanyMnemonic,
                    },
                    RuleType: 3,
                    Item: {
                        UOM: $scope.UOM
                    }
                };
            var jsonobject = {};
            jsonobject.Json = requestData;

            var requestDataforExtraPalettes =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: itemId,
                    ObjectType: "Extra Palettes Rules  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'Extra Palettes Rules ' + JSON.stringify(jsonobject) + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var consolidateApiParamaterExtraPalettes =
                {
                    Json: requestDataforExtraPalettes,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterExtraPalettes).then(function (responseLogItemDepositeValidation) {
            });

            GrRequestService.ProcessRequest(jsonobject).then(function (responseExtraPalettes) {
                debugger;
                var responseExtraPalettesStr = responseExtraPalettes.data.Json;

                if (responseExtraPalettesStr.RuleValue != '' && responseExtraPalettesStr.RuleValue != undefined) {
                    noOfExtraPalettes = parseInt(responseExtraPalettesStr.RuleValue);
                    if (noOfExtraPalettes > 0) {
                        noOfExtraPalettes = noOfExtraPalettes;
                    }
                }

                // Save On Item Selection Extra Pallets.
                var requestDataforExtraPalletsOutput =
                    {
                        UserId: $rootScope.UserId,
                        ObjectId: itemId,
                        ObjectType: "Extra Pallets Output : EnquiryId " + $rootScope.EditedEnquiryId + "",
                        ServicesAction: 'CreateLog',
                        LogDescription: 'On Item Selection In Enquiry Page For Extra Pallets. Item : ' + itemId + ' And Extra Pallets : ' + $scope.NumberOfExtraPalettes + '.',
                        LogDate: GetCurrentdate(),
                        Source: 'Portal',
                    };
                var consolidateApiParamaterExtraPalletsoutput =
                    {
                        Json: requestDataforExtraPalletsOutput,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamaterExtraPalletsoutput).then(function (responseLogItemAllocationValidation) {
                });

                $rootScope.Throbber.Visible = false;
                $scope.addProducts(itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode, noOfExtraPalettes);
            });
        }
        else {
            $rootScope.IsProductValidation = true;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectProduct), 'error', 8000);
        }
    }

    $scope.addProducts = function (itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode, noOfExtraPalettes) {
        debugger;
        if (qty === "" || qty === undefined || qty === null) {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnterValidQuantity), 'error', 3000);
            return false;
        }

        if (parseInt(qty) < 1) {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnterValidQuantity), 'error', 3000);
            return false;
        }

        var addPromotionQty = qty;

        if ($rootScope.DeliveryLocationId > 0 && ($rootScope.TruckSizeId > 0 || $rootScope.IsSelfCollect === true)) {
            var currentOrder = $scope.OrderData.filter(function (el) { return parseInt(el.OrderId) === parseInt($scope.EditEnquiryId); });
            if (currentOrder.length > 0) {
                var totalWeightWithPalettes = 0;
                var totalWeightWithBuffer = 0;
                var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });

                // Check Validation Of Max Number Of Item Allow To Add In OrderProduct.
                if (!$scope.IsItemEdit) {
                    var numberOfProductAdded = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 32 && el.ProductCode !== $scope.WoodenPalletCode; });
                    if (numberOfProductAdded.length > (parseInt($scope.NumberOfProductAdd) - 1)) {
                        //$rootScope.ValidationErrorAlert('You can not add more the ' + $scope.NumberOfProductAdd + ' products.', 'error', 3000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_NumberOfProducts, $scope.NumberOfProductAdd), 'error', 3000);
                        return false;
                    }
                }

                // Item Layer validation according to quantity.
                if (parseInt(productNameStr[0].QtyPerLayer) > 0) {
                    if ($scope.IsItemLayerAllow) {
                        var g = (parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer));
                        if ((parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer)) > 0) {
                            if ((parseInt(ItemType) == 31)) {
                                $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                            }

                            // Save Item Layer Validation Log.
                            var requestDataforItemLayer =
                                {
                                    UserId: $rootScope.UserId,
                                    ObjectId: itemId,
                                    ObjectType: "Item Layer  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                                    ServicesAction: 'CreateLog',
                                    LogDescription: 'Click On Add Product Button In Enquiry Page For Item Layer Validation. Item : ' + itemId + ' And Quantity : ' + qty + ' Layer Validation Allow : ' + $scope.IsItemLayerAllow + ' Quantity Per Layer ' + parseInt(productNameStr[0].QtyPerLayer) + '.',
                                    LogDate: GetCurrentdate(),
                                    Source: 'Portal',
                                };
                            var consolidateApiParamaterItemLayer =
                                {
                                    Json: requestDataforItemLayer,
                                };

                            GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {
                            });

                            //$rootScope.ValidationErrorAlert('This item can be ordered in complete layers, please adjust ordered quantity.', 'error', 3000);

                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_CompleteLayer), 'error', 3000);
                            return false;
                        }
                    }
                }

                debugger;

                // Save Item Layer Validation Log.
                var requestDataforItemLayer =
                    {
                        UserId: $rootScope.UserId,
                        ObjectId: itemId,
                        ObjectType: "Item Layer  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                        ServicesAction: 'CreateLog',
                        LogDescription: 'Click On Add Product Button In Enquiry Page For Item Layer Validation. Item : ' + itemId + ' And Quantity : ' + qty + ' Layer Validation Allow : ' + $scope.IsItemLayerAllow + ' Quantity Per Layer ' + parseInt(productNameStr[0].QtyPerLayer) + '.',
                        LogDate: GetCurrentdate(),
                        Source: 'Portal',
                    };
                var consolidateApiParamaterItemLayer =
                    {
                        Json: requestDataforItemLayer,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {
                });

                debugger;
                var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return el.ItemId === itemId & parseInt(el.ItemType) === parseInt(ItemType) & parseInt(el.GratisOrderId) === 0; });
                var enquiryProductGuid = '';
                if (productNameStrupdate.length > 0) {
                    enquiryProductGuid = productNameStrupdate[0].EnquiryProductGUID;
                } else {
                    productNameStrupdate = [];
                }

                debugger;
                var checkPromotionItemPresent = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === parseInt(31) && el.ProductCode === productNameStr[0].ItemCode; });
                if (checkPromotionItemPresent.length == 0) {
                    var chkVlaue = $scope.CheckBeforeAddingPromationItem(productNameStr[0].ItemCode, itemId, parseInt(qty), ItemType, productNameStr, enquiryProductGuid, GratisOrderId, noOfExtraPalettes, productNameStrupdate);
                    if (!chkVlaue && !$rootScope.IsSelfCollect) {
                        return false;
                    }
                }

                // Check Item Allocation

                if (parseInt(GratisOrderId) == 0) {
                    var checkAllocationValue = $scope.CheckAllocation($scope.Allocation, qty, $scope.OrderData, itemId);
                    if (!checkAllocationValue) {
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }

                        debugger;
                        //$rootScope.ValidationErrorAlert('It seems like you are tyring to order the item more than the allocated quantity. You cannot order this item more than ' + $scope.Allocation + ' ' + productNameStr[0].UOM + '', 'error', 10000);
                        if (productNameStrupdate.length > 0) {
                            productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
                        }

                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_MorethanAllocationQty, $scope.Allocation, productNameStr[0].UOM), 'error', 3000);
                        return false;
                    }
                }

                var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
                var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
                //var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, $scope.NumberOfExtraPalettes, ItemType, enquiryProductGuid);
                var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, noOfExtraPalettes, ItemType, enquiryProductGuid);

                var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
                if (bufferWeight !== "") {
                    totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
                }
                var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);

                var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
                if (weightPerPalettes !== "") {
                    if ($rootScope.IsPalettesRequired) {
                        totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
                    }
                    totalWeight = totalWeight + totalWeightWithPalettes
                }
                truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);

                var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
                var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();
                debugger;
                if (productNameStrupdate.length > 0) {
                    if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect && $scope.IsWeightLoadCheckValidation === true) {
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                        if (productNameStrupdate.length > 0) {
                            productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
                        }
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;
                    } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect && $scope.IsPalletLoadCheckValidation === true) {
                        var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);
                        if (productNameStrupdate.length > 0) {
                            productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
                        }
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;
                    }
                    else {
                        currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes) + parseFloat(truckTotalExtraPalettes));
                        currentOrder[0].TruckWeight = (totalWeight / 1000);
                        currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
                        if ($scope.IsItemEdit) {
                            productNameStrupdate[0].ProductQuantity = parseInt(qty);
                            productNameStrupdate[0].PreviousProductQuantity = productNameStrupdate[0].ProductQuantity;
                            productNameStrupdate[0].ItemPrices = ((parseInt(ItemType) == 31 ? 0 : parseFloat(productNameStrupdate[0].ItemPricesPerUnit)) * parseInt(productNameStrupdate[0].ProductQuantity));
                            productNameStrupdate[0].ItemTotalDepositeAmount = parseFloat(parseFloat(productNameStrupdate[0].DepositeAmountPerUnit) * parseInt(productNameStrupdate[0].ProductQuantity));

                            if (productNameStrupdate[0].UsedQuantityInEnquiry !== undefined && productNameStrupdate[0].UsedQuantityInEnquiry !== null) {
                                var remainingProductStock = parseFloat(parseFloat(productNameStrupdate[0].CurrentStockPosition) - parseFloat(productNameStrupdate[0].UsedQuantityInEnquiry));
                                if (parseFloat(productNameStrupdate[0].ProductQuantity) < remainingProductStock) {
                                    productNameStrupdate[0].IsItemAvailableInStock = true;
                                } else {
                                    productNameStrupdate[0].IsItemAvailableInStock = false;
                                }
                            }
                        }
                        else {
                            if (parseInt(ItemType) === 31) {
                                productNameStrupdate[0].ProductQuantity = parseInt(qty);
                                productNameStrupdate[0].PreviousProductQuantity = productNameStrupdate[0].ProductQuantity;
                            }
                            else {
                                productNameStrupdate[0].ProductQuantity = parseInt(productNameStrupdate[0].ProductQuantity) + parseInt(qty);
                                productNameStrupdate[0].PreviousProductQuantity = productNameStrupdate[0].ProductQuantity;
                                addPromotionQty = productNameStrupdate[0].ProductQuantity;
                            }
                            productNameStrupdate[0].ItemPrices = ((parseInt(ItemType) == 31 ? 0 : parseFloat(productNameStrupdate[0].ItemPricesPerUnit)) * parseInt(productNameStrupdate[0].ProductQuantity));
                            productNameStrupdate[0].ItemTotalDepositeAmount = parseFloat(parseFloat(productNameStrupdate[0].DepositeAmountPerUnit) * parseInt(productNameStrupdate[0].ProductQuantity));
                        }
                        debugger;
                        $scope.ReloadGraph(currentOrder, 0);
                        $scope.ClearItemRecord();
                    }
                }
                else {
                    debugger;
                    if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect && $scope.IsWeightLoadCheckValidation === true) {
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;
                    } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect && $scope.IsPalletLoadCheckValidation === true) {
                        var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' pallets. Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;
                    }

                    else {
                        if (currentOrder.length > 0) {
                            $rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
                            $rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);
                            angular.forEach($rootScope.buindingPalettes, function (item, key) {
                                item.PalettesWidth = 0;
                            });

                            if ($rootScope.IsPalettesRequired) {
                                for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                                    if (i < parseInt($rootScope.buindingPalettes.length)) {
                                        $rootScope.buindingPalettes[i].PalettesWidth = 100;
                                    }
                                }
                            }
                            currentOrder[0].TruckName = $rootScope.TruckSize;
                            currentOrder[0].TruckCapacity = $rootScope.TruckCapacityInTone;
                            currentOrder[0].TruckSizeId = $rootScope.TruckSizeId;
                            currentOrder[0].ShipTo = $rootScope.DeliveryLocationId;
                            currentOrder[0].DeliveryLocationName = $rootScope.DeliveryLocationName;
                            currentOrder[0].NoOfDays = $rootScope.NoOfDays;
                            currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes) + parseFloat(truckTotalExtraPalettes));
                            currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
                            currentOrder[0].TruckWeight = $rootScope.TruckCapacityFullInTone;
                            if (parseInt(currentOrder[0].EnquiryId) === 0) {
                                currentOrder[0].CurrentState = 1;
                            }

                            if (productNameStr[0].Amount == undefined) {
                                productNameStr[0].Amount = 0;
                            }

                            if (parseInt(GratisOrderId) !== 0) {
                                var gratisorder = currentOrder[0].OrderProductList.filter(function (el) { return el.GratisOrderId === GratisOrderId && el.ItemId === itemId; });

                                if (gratisorder.length > 0) {
                                    return false;
                                }
                            }

                            debugger;
                            var products = {
                                EnquiryProductGUID: generateGUID(),
                                OrderId: $rootScope.EditedEnquiryId,
                                OrderProductId: 0,
                                Allocation: $scope.Allocation,
                                ItemId: itemId,
                                ParentItemId: ParentItemId,
                                ParentProductCode: ParentProductCode,
                                GratisOrderId: GratisOrderId,
                                ItemName: productNameStr[0].ItemName,
                                ProductCode: productNameStr[0].ItemCode,
                                NumberOfExtraPalettes: noOfExtraPalettes,
                                PrimaryUnitOfMeasure: productNameStr[0].UOM,
                                ProductQuantity: qty,
                                PreviousProductQuantity: qty,
                                ActualAllocation: $scope.ActualAllocation,
                                ItemShortCode: productNameStr[0].ItemShortCode,
                                DepositeAmount: $scope.ItemDepositeAmount,
                                UnitPrice: parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount),
                                ItemPricesPerUnit: parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount),
                                ItemTaxPerUnit: percentage(parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount), $scope.ItemTaxInPec),
                                ItemPrices: (parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount) * parseInt(qty)),
                                DepositeAmountPerUnit: $scope.ItemDepositeAmount,
                                DiscountAmount: 0,
                                ItemTotalDepositeAmount: parseFloat(parseFloat($scope.ItemDepositeAmount) * parseInt(qty)),
                                ConversionFactor: productNameStr[0].ConversionFactor,
                                ProductType: productNameStr[0].ProductType,
                                WeightPerUnit: productNameStr[0].WeightPerUnit,
                                IsItemLayerAllow: $scope.IsItemLayerAllow,
                                ItemType: ItemType,
                                IsActive: "1"
                            }

                            if (parseInt(currentOrder[0].EnquiryId) !== 0) {
                                products.CurrentStockPosition = $scope.ItemCurrentStockPosition;
                            }
                            currentOrder[0].OrderProductList.push(products);
                            var x = $scope.OrderData;
                        }
                        debugger;
                        $scope.ClearItemRecord();
                    }
                }

                if ($rootScope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                    debugger;
                    $scope.AddWoodenPallet();
                }

                var chkaddpro = $scope.AddPromationItem(productNameStr[0].ItemCode, itemId, parseInt(addPromotionQty), ItemType);
                debugger;
                if ($scope.IsPalletLoadCheckValidation === true || $scope.IsWeightLoadCheckValidation === true) {
                    if (!chkaddpro && !$rootScope.IsSelfCollect) {
                        var dd = $scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $rootScope.TruckCapacity, $rootScope.TruckCapacityPalettes, totalWeightWithPalettes);
                        if (dd) {
                            var dd = $scope.AddTruckControl;
                            if (!dd._isShown) {
                                currentOrder[0].IsTruckFull = true;
                                $scope.AddTruckHeaderMessage = String.format($rootScope.resData.res_CreateInquiryPage_TruckFullConfirmationHeaderMessage);
                                $scope.AddTruckBodymessage = String.format($rootScope.resData.res_CreateInquiryPage_TruckFullConfirmationMessageInEdit);
                                $scope.OpenAddTruckControl();
                            }
                        }
                        else {
                            currentOrder[0].IsTruckFull = false;
                        }
                    } else if ($rootScope.IsSelfCollect) {
                        currentOrder[0].IsTruckFull = true;
                    }
                }
                else {
                    currentOrder[0].IsTruckFull = true;
                }
            }
        }
        else {
            if ($rootScope.TruckSizeId == 0) {
                if ($rootScope.DeliveryLocationId == 0 && $rootScope.IsSelfCollect === true) {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectDeliveryLocation), 'error', 8000);
                }
                else {
                    //$rootScope.ValidationErrorAlert('Please seletect one of the truck sizes before you proceed further with your order.', 'error', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectTruckSize), 'error', 8000);
                }
            }
            else if ($rootScope.DeliveryLocationId == 0) {
                //$rootScope.ValidationErrorAlert('Please seletect one of the delivery locations before you proceed further with your order.', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectDeliveryLocation), 'error', 8000);
            }
            else {
                //$rootScope.ValidationErrorAlert('Please select delivery location or truck.', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectTruckAndDeliveryLocation), 'error', 8000);
            }
        }
    }

    $scope.AddWoodenPallet = function () {
        var currentOrder = $scope.OrderData.filter(function (el) { return parseInt(el.OrderId) === parseInt($scope.EditEnquiryId); });
        if (currentOrder.length > 0) {
            var qty = currentOrder[0].NumberOfPalettes;

            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemCode === $scope.WoodenPalletCode; });
            var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode & parseInt(el.GratisOrderId) === 0; });
            debugger;
            if (productNameStrupdate.length > 0) {
                productNameStrupdate[0].ProductQuantity = parseInt(qty);
            }
            else {
                var products = {
                    EnquiryProductGUID: generateGUID(),
                    OrderGUID: $scope.CurrentOrderGuid,
                    OrderProductId: 0,
                    Allocation: 0,
                    ItemId: productNameStr[0].ItemId,
                    ParentItemId: 0,
                    ParentProductCode: '',
                    GratisOrderId: 0,
                    ItemName: productNameStr[0].ItemName,
                    ProductCode: productNameStr[0].ItemCode,
                    NumberOfExtraPalettes: 0,
                    PrimaryUnitOfMeasure: productNameStr[0].UOM,
                    ProductQuantity: qty,
                    ItemPricesPerUnit: 0,
                    DepositeAmountPerUnit: 0,
                    ItemTotalDepositeAmount: 0,
                    ItemPrices: 0,
                    ConversionFactor: 0,
                    ProductType: productNameStr[0].ProductType,
                    ActualAllocation: 'NA',
                    WeightPerUnit: 0,
                    ItemType: 0,
                    ItemTaxPerUnit: 0,
                    IsItemLayerAllow: false,
                    IsActive: "1"
                }
                currentOrder[0].OrderProductList.push(products);
            }
        }
    }

    $scope.CheckBeforeAddingPromationItem = function (itemCode, itemId, qty, ItemType, productNameStr, enquiryProductGuid, GratisOrderId, noOfExtraPalettes, productNameStrupdate) {
        debugger;
        var totalWeightWithPalettes = 0;
        var chkvalid = true;
        var currentOrder = $scope.OrderData.filter(function (el) { return parseInt(el.OrderId) === parseInt($scope.EditEnquiryId); });
        if (currentOrder.length > 0) {
            if (!$scope.IsItemEdit) {
                enquiryProductGuid = '';
            }

            var promotionItem = $rootScope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
            for (var i = 0; i < promotionItem.length; i++) {
                var ItemQuanity = promotionItem[i].ItemQuanity;
                var FocItemId = promotionItem[i].FocItemId;
                var FocItemQuantity = promotionItem[i].FocItemQuantity;
                if ((parseInt(qty) % parseFloat(ItemQuanity)) === 0) {
                    var totalNumberCanOrderFocItem = (parseInt(qty) / parseFloat(ItemQuanity));
                    var totalAmountOfQty = parseInt(FocItemQuantity) * totalNumberCanOrderFocItem;
                    qty = qty + totalAmountOfQty;
                }
            }

            var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
            var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
            var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, noOfExtraPalettes, ItemType, enquiryProductGuid);
            var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
            if (bufferWeight !== "") {
                totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
            }
            var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);
            var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
            if (weightPerPalettes !== "") {
                if ($rootScope.IsPalettesRequired) {
                    totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
                }
                totalWeight = totalWeight + totalWeightWithPalettes
            }
            truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);

            var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
            var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

            if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect && $scope.IsWeightLoadCheckValidation === true) {
                //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                if (productNameStrupdate.length > 0) {
                    productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
                }
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);

                chkvalid = false;
            } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect && $scope.IsPalletLoadCheckValidation === true) {
                var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);
                if (productNameStrupdate.length > 0) {
                    productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
                }
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);

                chkvalid = false;
            }
        }
        return chkvalid;
    }

    //16.a) Calculate Total Weight.
    $scope.getTotalAmount = function (weight, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {
        debugger;
        var total = 0;
        if (currentOrder.length > 0) {
            for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
                if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
                    total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
                }
            }
            total += parseFloat(weight) * parseFloat(quantity);
        }
        return total;
    }

    //16.b) Calculate Total Pallets.
    $scope.getTotalPalettes = function (palettes, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {
        debugger;
        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
                total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            }
        }
        if (parseFloat(quantity) > 0) {
            total += parseFloat(quantity) / parseFloat(palettes);
        }
        if ($rootScope.TruckCapacityPalettes == 0) {
            total = 0;
        }
        if (!$rootScope.IsPalettesRequired) {
            total = 0;
        }
        return total;
    }

    //16.c) Calculate Extra Pallets.
    $scope.getTotalExtraPalettes = function (palettes, quantity, currentOrder, itemId, NumberOfExtraPalettes, ItemType, enquiryProductGuid) {
        debugger;
        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode && currentOrder[0].OrderProductList[i].NumberOfExtraPalettes > 0) {
                var totalPalets = parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
                total += (totalPalets / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
            }
        }
        if (NumberOfExtraPalettes > 0) {
            if (parseFloat(quantity) > 0) {
                var totalPalets = parseFloat(quantity) / parseFloat(palettes);
                total += (totalPalets / NumberOfExtraPalettes);
            }
        }
        if ($rootScope.TruckCapacityPalettes == 0) {
            total = -1;
        }
        if (!$rootScope.IsPalettesRequired) {
            total = 0;
        }
        return total;
    }

    //16.d) Add Extra Pallets.
    $scope.AddExtraPalleter = function (currentOrder, enquiryProductGuid, ConversionFactor, qty, PrimaryUnitOfMeasure) {
        debugger;
        var TotalPalettes = 0;
        if (currentOrder.length > 0) {
            var newArr = [];
            var productList = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode && el.EnquiryProductGUID !== enquiryProductGuid; });
            $.each(productList, function (index, element) {
                if (newArr[element.PrimaryUnitOfMeasure] == undefined) {
                    newArr[element.PrimaryUnitOfMeasure] = 0;
                }
                newArr[element.PrimaryUnitOfMeasure] += parseFloat(element.ProductQuantity) / parseFloat(element.ConversionFactor);
            });
            if (PrimaryUnitOfMeasure !== '' && PrimaryUnitOfMeasure !== undefined) {
                if (newArr[PrimaryUnitOfMeasure] == undefined) {
                    newArr[PrimaryUnitOfMeasure] = 0;
                }
                newArr[PrimaryUnitOfMeasure] += parseFloat(qty) / parseFloat(ConversionFactor);
            }
            for (var name in newArr) {
                debugger;
                var value = newArr[name];
                newArr[name] = Math.ceil(value);
                TotalPalettes += Math.ceil(value);
            }
        }
        return TotalPalettes;
    }

    $scope.GetPendingAllocation = function (Allocation, quantity, currentOrder, itemId, ItemList) {
        debugger;
        var total = 0;
        var productNameStrupdate = [];
        for (var i = 0; i < currentOrder.length; i++) {
            if (ItemList != undefined) {
                if ($scope.IsItemEdit) {
                    productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return el.ItemId !== itemId && ItemList.indexOf(el.ProductCode) > -1 && el.ItemType == 32; });
                }
                else {
                    productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return ItemList.indexOf(el.ProductCode) > -1 && el.ItemType == 32; });
                }
            }
            else {
                productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return el.ItemId === itemId && el.ItemType == 32; });
            }
            debugger;
            if (productNameStrupdate.length > 0) {
                for (var j = 0; j < productNameStrupdate.length; j++) {
                    total += parseFloat(productNameStrupdate[j].ProductQuantity);
                }
            }
        }

        return total;
    }

    $rootScope.TruckExtraBufferWeight = function () {
        debugger;
        var extraTruckBufferWeight = 0;
        if ($scope.TruckExceedBufferWeight != 0 && $scope.TruckExceedBufferWeight != "0") {
            extraTruckBufferWeight = parseFloat($rootScope.TruckCapacity * (parseFloat($scope.TruckExceedBufferWeight) / 100));
        }
        return extraTruckBufferWeight;
    }

    $rootScope.TruckExtraBufferPallet = function () {
        debugger;

        var extraPaletteBufferWeight = 0;
        if ($scope.PalettesExceedBufferWeight != 0 && $scope.PalettesExceedBufferWeight != "0") {
            extraPaletteBufferWeight = parseFloat($scope.PalettesExceedBufferWeight);
        }
        return extraPaletteBufferWeight;
    }
    $scope.CheckAllocation = function (Allocation, quantity, currentOrder, itemId) {
        debugger;
        var allowAllocatio = false;
        var total = 0;
        total += parseFloat(quantity);
        if (Allocation >= total) {
            allowAllocatio = true;
        }

        if (Allocation == 'NA') {
            allowAllocatio = true;
        }

        return allowAllocatio;
    }

    $scope.ReloadGraph = function (currentOrder, removeKegPalettes) {
        debugger;
        if (!$rootScope.IsSelfCollect) {
            console.log('Reload Graph');

            var totalWeightWithPalettes = 0;
            var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
            var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');
            var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
            var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, '', 0, 0, '');
            var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
            if (weightPerPalettes !== "") {
                if ($rootScope.IsPalettesRequired) {
                    totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes - removeKegPalettes));
                }
                totalWeight = totalWeight + totalWeightWithPalettes
            }

            var truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);
            $scope.PalettesCorrectWeight = truckTotalPalettes;
            currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(totalNumberOfPalettes));
            currentOrder[0].TruckWeight = (totalWeight / 1000);
            currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
            $rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
            $rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);
            angular.forEach($rootScope.buindingPalettes, function (item, key) {
                item.PalettesWidth = 0;
            });

            debugger;
            if ($rootScope.IsPalettesRequired) {
                for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                    if (i < parseInt($rootScope.buindingPalettes.length)) {
                        $rootScope.buindingPalettes[i].PalettesWidth = 100;
                    }
                }
            }
            $scope.CalculateDeliveryUsedCapacity();
            if ($rootScope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                var otherItem = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode });
                if (otherItem.length > 0) {
                    $scope.AddWoodenPallet();
                }
            }
        }
        $scope.LoadEnquiryAmountDetails(currentOrder[0].OrderProductList);
    }

    $scope.CalculateDeliveryUsedCapacity = function () {
        debugger;
        console.log('CalculateDeliveryUsedCapacity');
        var tempNumberOfPalettes = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            tempNumberOfPalettes += $scope.OrderData[i].NumberOfPalettes;
        }
        $scope.tempDeliveryUsedCapacity = tempNumberOfPalettes;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === $scope.EditEnquiryId; });
        if (($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity) > $rootScope.DeliveryLocationCapacity) {
            var usedPalettesCapacity = parseInt($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity);
            if (currentOrder.length > 0) {
                currentOrder[0].IsRecievingLocationCapacityExceed = true;
                if (currentOrder[0].OrderProductList.length === 0) {
                    $rootScope.ValidationErrorReceivingLocation = String.format($rootScope.res_CreateInquiryPage_CapacityFullyConsumed);
                }
                else {
                    $rootScope.ValidationErrorReceivingLocation = 'The receiving capacity for the delivery location is only ' + parseInt($rootScope.DeliveryLocationCapacity) + ' pallets while you are trying order ' + usedPalettesCapacity + ' paletts. Please modify you order and try again.';
                }
            }
        }
        else {
            if (currentOrder.length > 0) {
                currentOrder[0].IsRecievingLocationCapacityExceed = false;
            }
        }
    }

    $scope.AddPromationItem = function (itemCode, ItemId, qty, ItemType) {
        debugger;
        var addPromation = false;
        if (parseInt(ItemType) !== 31 && parseInt(ItemType) !== 30) {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === $scope.EditEnquiryId; });
            if (currentOrder.length > 0) {
                var promotionItem = $rootScope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
                if (promotionItem.length === 0) {
                    $scope.Allocation = 'NA';
                    $scope.ActualAllocation = 'NA';
                }
                for (var i = 0; i < promotionItem.length; i++) {
                    var ItemQuanity = promotionItem[i].ItemQuanity;
                    var FocItemId = promotionItem[i].FocItemId;
                    var FocItemQuantity = promotionItem[i].FocItemQuantity;
                    if ((parseInt(qty) % parseFloat(ItemQuanity)) === 0) {
                        addPromation = true;
                        var totalNumberCanOrderFocItem = (parseInt(qty) / parseFloat(ItemQuanity));
                        var totalAmountOfQty = parseInt(FocItemQuantity) * totalNumberCanOrderFocItem;

                        //$scope.addProducts(FocItemId, totalAmountOfQty, 0, 31, ItemId, itemCode, 0);
                        $scope.CheckingExtraPalettesBeforeAddingItem(FocItemId, totalAmountOfQty, 0, 31, ItemId, itemCode);
                        if ($scope.ActiveCompanyType == 26) {
                            $scope.IsPromotion = true;
                        }
                        else {
                            $scope.IsPromotion = false;
                        }
                        $scope.Allocation = 'NA';
                        $scope.ActualAllocation = 'NA';
                        break;
                    }
                    else {
                        $scope.RemovePromotionItem(currentOrder, ItemId);
                        $scope.Allocation = 'NA';
                        $scope.ActualAllocation = 'NA';
                    }
                }
            }
            else {
                $scope.Allocation = 'NA';
                $scope.ActualAllocation = 'NA';
            }
        }
        return addPromation;
    }

    $scope.CheckWetherTruckIsFull = function (currentOrder, totalWeightWithBuffer, truckSize, palettesWeight, totalWeightWithPalettes, ItemType) {
        debugger;
        var isFull = false;
        if ($scope.IsPalletLoadCheckValidation === true || $scope.IsWeightLoadCheckValidation === true) {
            var totalpalettesWeight = 0;
            for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
                if (currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
                    totalpalettesWeight += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
                }
            }
            var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
            $scope.PalettesCorrectWeight = parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes);
            totalpalettesWeight = Math.ceil(parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes));
            var totaltruckWeight = 0;
            for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
                totaltruckWeight += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
            }
            var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, '', 0, 0, '');
            var totalWeightWithPalettes = 0;
            var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'string');
            if (weightPerPalettes !== "") {
                if ($rootScope.IsPalettesRequired) {
                    totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes));
                }
                totaltruckWeight = totaltruckWeight + totalWeightWithPalettes;
            }

            var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
            var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

            $scope.ReloadGraph(currentOrder, 0);
            if ($rootScope.IsPalettesRequired) {
                debugger;
                var pallet = between(parseFloat($scope.PalettesCorrectWeight), (parseFloat(palettesWeight) - parseFloat($scope.PalettesBufferWeight)), parseFloat(parseFloat(palettesWeight) + parseFloat(extraPaletteBufferWeight)));
                if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight)) || pallet) {
                    isFull = true;
                }
            }
            else {
                if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight))) {
                    isFull = true;
                }
            }
        } else {
            isFull = true;
        }

        return isFull;
    }

    $scope.RemovePromotionItem = function (currentOrder, ParentItemId) {
        debugger;
        if (currentOrder.length > 0) {
            $scope.findAndRemove(currentOrder[0].OrderProductList, 'ParentItemId', ParentItemId, 'EnquiryProductId');
            if (currentOrder[0].OrderProductList.length === 1) {
                if (currentOrder[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                    currentOrder[0].OrderProductList = [];
                }
            }
        }
    }

    $scope.findAndRemove = function (array, property, value, primaryId) {
        for (i = 0; i < array.length; ++i) {
            if (array[i][property] === value) {
                if (array[i][primaryId] === 0) {
                    array.splice(i--, 1);
                }
                else {
                    array.splice(i--, 1);
                }
            }
        }
    };

    $scope.CheckForNewQty = function (itemId, ItemType, qty, productNameStr, numberOfExtraPallets) {
        debugger;
        var QtyArraynew = [];
        var truckfullintonr = $rootScope.TruckCapacityFullInTone;
        var palletsCorrcerwght = $scope.PalettesCorrectWeight;
        var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
        var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();
        var palettesWeight = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === $rootScope.EditedEnquiryId; });
        var editedItemQuantity = 0;

        if ($scope.IsItemEdit) {
            var item = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemId) === parseInt(itemId); });
            if (item.length > 0) {
                editedItemQuantity = item[0].ProductQuantity;
            } else {
                editedItemQuantity = 0;
            }
        }

        var avlPalletQty = 0;
        var pendingweight = 0;
        if (numberOfExtraPallets > 0) {
            //avlPalletQty = (((parseFloat(numbersofpalettes) * $scope.NumberOfExtraPalettes) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor)));
            avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor))) * numberOfExtraPallets;
        }
        else {
            avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * parseFloat(productNameStr[0].ConversionFactor));
        }

        var avlPallet = parseInt($scope.TruckCapacityPalettes) - (Math.ceil(palletsCorrcerwght));
        debugger;
        //var checkKegQtyOnePallets = parseFloat(productNameStr[0].ConversionFactor) * 2;
        //var checkKegWeightPerPallet = (parseFloat(checkKegQtyOnePallets) * parseFloat(productNameStr[0].WeightPerUnit)) + (palettesWeight * 2);

        debugger;

        var avlPalletWeight = (palettesWeight * (Math.ceil(avlPallet)));

        //var avlPalletBufferWeight = (palettesWeight * parseFloat(extraPaletteBufferWeight));
        //avlPalletWeight = avlPalletWeight - avlPalletBufferWeight;
        if (numberOfExtraPallets > 0) {
            //only for Keg
            pendingweight = ((parseFloat($scope.TruckCapacity)) - (parseFloat(truckfullintonr * 1000) + parseFloat(avlPalletWeight * numberOfExtraPallets)));
        }
        else {
            pendingweight = ((parseFloat($scope.TruckCapacity)) - (parseFloat(truckfullintonr * 1000) + parseFloat(avlPalletWeight)));
        }

        var avlWeightQty = parseFloat(parseFloat(pendingweight) + parseFloat(extraTruckBufferWeight)) / parseFloat(productNameStr[0].WeightPerUnit);
        QtyArraynew.push(parseInt(avlWeightQty));
        QtyArraynew.push(parseInt(avlPalletQty));
        debugger;
        var min = Math.min.apply(Math, QtyArraynew);

        min = parseInt(min) + parseInt(editedItemQuantity);

        if (parseInt(productNameStr[0].QtyPerLayer) > 0) {
            var g = parseInt((parseInt(min) / parseInt(productNameStr[0].QtyPerLayer)));
            $scope.IsItemLayerCheckQty = parseInt(g) * parseInt(productNameStr[0].QtyPerLayer);
            if ($scope.IsItemLayerCheckQty > $scope.CheckAllocatonPresent) {
                var validQty = $scope.Allocation;
            }
            else {
                var validQty = $scope.IsItemLayerCheckQty;
            }
        }
        else {
            if ($scope.CheckAllocatonPresent != 'NA') {
                if (min > $scope.Allocation) {
                    var validQty = $scope.Allocation;
                }
                else {
                    var validQty = min;
                }
            }
            else {
                var validQty = min;
            }
        }

        return validQty;
    }

    //#endregion

    //#region Add Product

    $scope.EnableAddItem = false;
    $scope.ItemField =
        {
            itemId: 0,
            inputItemsQty: 0
        };

    $scope.EnableAddItemSection = function () {
        debugger;
        $scope.ClearItemData();
        $scope.EnableAddItem = true;
    }

    $scope.predicates = {
        InputItem: '',
        FilterAutoCompletebox: ''
    };
    $scope.MaxPermissibleQuantity = 0;
    $scope.selectedRow = -1;
    $scope.showItembox = false;
    $rootScope.foundResult = false;

    $scope.ItemSearchInputDefaultSetting = function () {
        $scope.SearchControl = {
            InputItem: '',
            FilterAutoCompletebox: ''
        };
        $scope.selectedRow = -1;
        $scope.showItembox = false;
        $rootScope.foundResult = false;
    }
    $scope.ItemSearchInputDefaultSetting();
    $scope.ItemInputSelecteChangeEvent = function (input) {
        debugger;
        if (input.length > 0) {



            if (input.length >= 4) {
                $rootScope.Throbber.Visible = true;


                $scope.LoadItemListByCompany();
            } else {
                $scope.bindallproduct = [];
            }
            $scope.showItembox = true;
            $scope.selectedRow = 0;
        } else {
            $scope.showItembox = false;
            $scope.selectedRow = -1;
        }
        $scope.SearchControl.FilterAutoCompletebox = input;
    }
    $scope.ClearItemInputSearchbox = function () {
        debugger;
        $scope.Allocation = 'NA';
        $scope.showItembox = false;
        $scope.ClearItemRecord();
    }

    $scope.ClearItemData = function () {
        $scope.showItembox = false;
        $scope.Allocation = 'NA';
        $scope.ItemField.itemsName = "";
        $scope.ItemField.inputItemsQty = "";
        $scope.ItemField.itemId = "";
        $scope.selectedRow = -1;
        $scope.SearchControl.InputItem = "";
        $scope.SearchControl.FilterAutoCompletebox = "";
        $scope.EnquiryProductGUID = "";
        $scope.disableInput = false;
        $scope.ItemPrices = 0;
        $scope.ItemDepositeAmount = 0;
        $scope.UOM = '-';
        $scope.MaxPermissibleQuantity = '-';
        $scope.IsItemEdit = false;
        $scope.IsItemLayerAllow = false;
    }

    $scope.ClearItemRecord = function () {
        $scope.EnableAddItem = false;
        $scope.ClearItemData();
        $scope.CalculateDeliveryUsedCapacity();
        focus('ItemListAutoCompleteBox_value');
    }

    $scope.RemoveInputFocus = function () {
        debugger;
        focus('setfocusoninput');
    }
    //#endregion

    //#region Cost

    $ionicModal.fromTemplateUrl('AssignTransporter.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.AssignTransporterPopup = modal;
    });

    $scope.CloseAssignTransporterPopup = function () {
        $scope.AssignTransporterPopup.hide();
    };

    $scope.OpenAssignTransporterPopup = function () {
        $scope.AssignTransporterPopup.show();
    };

    $scope.LoadAllTransporter = function () {
        debugger;

        $rootScope.Throbber.Visible = true;
        var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
        if (enquiryDetails.length > 0) {
            if ($scope.IsShowAllTransporterForUpdate === false) {
                var companyName = enquiryDetails[0].CompanyName;
                var CheckDifferentCompany = enquiryDetails.filter(function (el) { return el.CompanyName !== companyName; });
                if (CheckDifferentCompany.length > 0) {
                    $rootScope.Throbber.Visible = false;
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_DifferentCompany), 'error', 3000);
                    return false;
                } else {
                    $scope.LoadTransporterByCompanyId(enquiryDetails[0].SoldTo);
                }
            } else {
                $scope.LoadTransporterByCompanyId(0);
            }
        } else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
        }
    }

    $scope.LoadTransporterByCompanyId = function (companyId) {
        var requestData =
            {
                ServicesAction: 'GetAllTransporterListByCompanyId',
                CompanyId: companyId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            var resoponsedata = response.data;
            $scope.TransporterList = resoponsedata.Transporter.TransporterList;

            $scope.OpenAssignTransporterPopup();
            $rootScope.Throbber.Visible = false;
        });
    }

    $ionicModal.fromTemplateUrl('TripCostConfirm.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.TripCostConfirmPopup = modal;
    });

    $scope.CloseTripCostConfirmPopup = function () {
        $scope.TripCostConfirmPopup.hide();
    };

    $scope.OpenTripCostConfirmPopup = function () {
        $scope.TripCostConfirmPopup.show();
    };

    $scope.ConfirmTripCost = function () {
        $scope.CloseTripCostConfirmPopup();
        $scope.AssignTripCostPopup.show();
    };

    $ionicModal.fromTemplateUrl('AssignTripCost.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.AssignTripCostPopup = modal;
    });

    $scope.CloseAssignTripCostPopup = function () {

        $scope.AssignTripCostPopup.hide();
        $scope.Cost.Revenue = 0;
        $scope.Cost.TripCost = 0;
    };

    $scope.OpenAssignTripCostPopup = function () {
        $scope.TripCostAssingOrders = []
        debugger;
        var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
        if (enquiryDetails.length > 0) {
            $scope.TripCostAssingOrders = enquiryDetails.filter(function (el) { return parseFloat(el.TripCost) > 0 || parseFloat(el.TripRevenue) > 0; });

            if ($scope.TripCostAssingOrders.length > 0) {
                $scope.OpenTripCostConfirmPopup();
            }
            else {
                $scope.AssignTripCostPopup.show();
            }
        }
        else {
            $rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
        }
    };

    //#endregion

    //#region truck full message

    $ionicModal.fromTemplateUrl('AddTruck.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.AddTruckControl = modal;
    });
    $scope.CloseAddTruckControl = function () {
        focus('RemoveEnterEvent');
        $scope.AddTruckControl.hide();
    };
    $scope.OpenAddTruckControl = function () {
        focus('AddEnterEvent');
        var dd = $scope.AddTruckControl;
        if (!dd._isShown) {
            $scope.AddTruckControl.show();
        }
    };

    $scope.CloseAddFinalize = function () {
        debugger;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === $rootScope.EditedEnquiryId; });
        if (currentOrder.length > 0) {
            currentOrder[0].IsTruckFull = true;
        }
        $scope.AddTruckControl.hide();
    }

    $scope.ClearItem = function () {
        debugger;
        $scope.ClearItemRecord();
    }

    //#endregion

    $scope.CloseEnquiryDetailAccordion = function () {
        debugger;
        if ($scope.CurrentOpenMasterDetailsObject !== "") {
            $scope.CurrentOpenMasterDetailsObject.component.collapseRow($rootScope.PreviousExpandedRow);
            $scope.IsEnquiryEdit = false;
            $scope.EnableAddItem = false;
            $scope.ClearItemData();
        }
    }

    $scope.AdvanceEdit = function (OrderGUID) {
        debugger;
        $rootScope.EditEnquiry = true;

        if ($rootScope.RoleName === "CustomerService") {
            $rootScope.IsEnquiryEditedByCustomerService = true;

            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
            if (currentOrder.length > 0) {
                $rootScope.TempCompanyId = currentOrder[0].CustomerId;
                $rootScope.TempCompanyMnemonic = $rootScope.CompanyMnemonic;
                $rootScope.BranchPlantCodeEdit = currentOrder[0].BranchPlantCode;
            }
        } else {
            $rootScope.IsEnquiryEditedByCustomerService = false;
        }

        if ($scope.OrderData[0].EnquiryId != undefined && $scope.OrderData[0].EnquiryId != 0 && $scope.OrderData[0].EnquiryId != "0") {
            $rootScope.SavedEditEnquiry = true;
        } else {
            $rootScope.SavedEditEnquiry = false;
        }

        $rootScope.isEnquiryEdit = true;
        $rootScope.CurrentOrderGuid = OrderGUID;
        $rootScope.TemOrderData = $scope.OrderData;
        $state.go("CreateInquiryPage");
    }



    $rootScope.CloseMiscDeleteConfirmation = function () {
        $scope.DeleteWarningMessageControl.hide();
    };


    $scope.Delete_DeleteMisc = function (paymentRequestId, slabId, slabName) {
        debugger;
        $scope.SelectedId_paymentRequestId = paymentRequestId;
        $scope.SelectedId_slabId = slabId;
        $scope.SelectedId_slabName = slabName;
        $scope.DeleteWarningMessageControl.show();
    }

    $rootScope.DeleteMiscYes = function () {
        debugger;
        var requestData =
            {
                ServicesAction: 'DeleteMiscellaneousByPaymentRequestId',
                PaymentRequestId: $scope.SelectedId_paymentRequestId,
                SlabId: $scope.SelectedId_slabId,
                SlabName: $scope.SelectedId_slabName,
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $rootScope.CloseMiscDeleteConfirmation();
            $rootScope.PaymentRequestByOrder($scope.DeleteMiscCarrierNumber, $scope.DeleteMiscOrderId, $scope.DeleteMiscSalesOrderNumber, "");
        });
    };




    $scope.UpdateOrderCollected = function () {
        debugger;
        var orderlist = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.IsCompleted !== '1'; });
        if (orderlist.length > 0) {


            var requestData =
                {
                    ServicesAction: 'UpdateOrderCollected',
                    OrderList: orderlist
                };
            // var stringfyjson = JSON.stringify(requestData);
            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {



                if (response.data.Json.IsUpdated == "1") {

                    $scope.RefreshDataGrid();
                    $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                } else {


                    $rootScope.ValidationErrorAlert('Please assgin transport.', '', 3000);
                }


            });
        }
        else {
            $rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
        }
    }




    $scope.UpdateOrderDelivered = function () {
        debugger;
        var orderlist = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.IsCompleted !== '1'; });
        if (orderlist.length > 0) {


            var requestData =
                {
                    ServicesAction: 'UpdateOrderDelivered',
                    OrderList: orderlist
                };
            // var stringfyjson = JSON.stringify(requestData);
            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {




                if (response.data.Json.IsUpdated == "1") {

                    $scope.RefreshDataGrid();
                    $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                } else {


                    $rootScope.ValidationErrorAlert('Please assgin transport.', '', 3000);
                }
            });
        }
        else {
            $rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
        }
    }

    $scope.UpdateOrderDeployed = function () {
        debugger;
        var orderlist = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.IsCompleted !== '1'; });
        if (orderlist.length > 0) {


            var requestData =
                {
                    ServicesAction: 'UpdateOrderDeployed',
                    OrderList: orderlist
                };
            // var stringfyjson = JSON.stringify(requestData);
            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {




                if (response.data.Json.IsUpdated == "1") {

                    $scope.RefreshDataGrid();
                    $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                } else {


                    $rootScope.ValidationErrorAlert('Please assgin transport.', '', 3000);
                }
            });
        }
        else {
            $rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
        }
    }


});