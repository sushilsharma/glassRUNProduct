angular.module("glassRUNProduct").controller('PaymentRequestConfirmationController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {

    $scope.IsControlEnabled = false;
    $scope.ActionType = "Clear";
    //#region Load Variables And Default Values
    $scope.IsRefreshGrid = false;
    $scope.CurrentOpenMasterDetailsObject = "";
    $scope.selectedRow = -1;
    $scope.PreviousEnterProductQuantity = 0;
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
    $scope.CellCheckboxControl = false;
    $scope.HeaderCheckBoxAction = false;
    $scope.SalesAdminApprovalList = [];
    $scope.IsChecked = false;
    $scope.IsFiltered = true;
    console.log("-0" + new Date());
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.RoleName = $rootScope.RoleName;
    $scope.PreviousExpandedRow = "";
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

    var AccountType = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'AccountType'; });
    if (AccountType.length > 0) {

        //alert(JSON.stringify(AccountType));
        $scope.AccountTypeList = AccountType;

        $rootScope.Throbber.Visible = false;
    }

    //  $rootScope.res_PageHeaderTitle = $rootScope.resData.res_PaymentRequestConfirmationPage_Title;
    console.log("-1" + new Date());
    var StatusList = $rootScope.StatusResourcesList.filter(function (el) { return el.CultureId === $rootScope.CultureId && (el.StatusId == 2201 || el.StatusId == 2202 || el.StatusId == 2203) });
    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;


    $scope.SelectedBankAccount = {
        TransporterAccountDetailId: '',
        BankName: '',
        AccountNumber: '',
        AccountType: ''
    }


    //#endregion

    //#region Load Setting Values 
    $scope.LoadDefaultSettingsValue = function () {



        $scope.LoadSettingInfoByName = function (settingName, returnValueDataType) {

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

    }
    $scope.LoadDefaultSettingsValue();

    //#endregion

    //#region Grid Configuration
    $scope.LoadGridConfigurationData = function () {
alert('1');
        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                //ObjectId: 14,
                ObjectId: 19,
                ObjectName: 'Order',
                PageName: $rootScope.PageName,
                ControllerName: page
            };

        //var stringfyjson = JSON.stringify(requestData);
        var gridconsolidateApiParamater =
            {
                Json: gridrequestData,
            };

        console.log("-2" + new Date());
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
    $scope.LoadGridConfigurationData();

    //#endregion

    //#region Load Sales Admin Approval Grid
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


                var OrderNumber = "";
                var OrderNumberCriteria = "";


                var SoldToName = "";
                var SoldToNameCriteria = "";


                var RequestDate = "";
                var RequestDateCriteria = "";



                var SlabName = "";
                var SlabNameCriteria = "";


                var CarrierName = "";
                var CarrierNameCriteria = "";

                var BankName = "";
                var BankNameCriteria = "";


                var AccountNumber = "";
                var AccountNumberCriteria = "";



                var Status = "";
                var StatusCriteria = "";



                var CollectedDate = "";
                var CollectedDateCriteria = "";



                var DeliveredDate = "";
                var DeliveredDateCriteria = "";


                var DriverName = "";
                var DriverNameCriteria = "";


                var TruckPlateNumber = "";
                var TruckPlateNumberCriteria = "";





                $scope.ProductCodes = "";
                $scope.ProductSelectedList = [];



                if (filterOptions != "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "RequestDate") {
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
                                    DeliveredDateCriteria = "=";
                                } else {
                                    DeliveredDateCriteria = columnsList[1];
                                }
                                DeliveredDate = columnsList[2];
                                DeliveredDate = new Date(DeliveredDate);
                                DeliveredDate = $filter('date')(DeliveredDate, "dd/MM/yyyy");
                            }
                        }







                        if (columnsList[0] === "OrderNumber") {
                            OrderNumberCriteria = columnsList[1];
                            OrderNumber = columnsList[2];
                        }

                        if (columnsList[0] === "SoldToName") {
                            SoldToNameCriteria = columnsList[1];
                            SoldToName = columnsList[2];
                        }

                        if (columnsList[0] === "SlabName") {
                            SlabNameCriteria = columnsList[1];
                            SlabName = columnsList[2];
                        }

                        if (columnsList[0] === "CarrierName") {
                            CarrierNameCriteria = columnsList[1];
                            CarrierName = columnsList[2];
                        }

                        if (columnsList[0] === "BankName") {
                            BankNameCriteria = columnsList[1];
                            BankName = columnsList[2];
                        }


                        if (columnsList[0] === "AccountNumber") {
                            AccountNumberCriteria = columnsList[1];
                            AccountNumber = columnsList[2];
                        }

                        if (columnsList[0] === "BranchPlant") {
                            BranchPlantCriteria = columnsList[1];
                            BranchPlant = columnsList[2];
                        }

                        if (columnsList[0] === "DriverName") {
                            DriverNameCriteria = columnsList[1];
                            DriverName = columnsList[2];
                        }


                        if (columnsList[0] === "TruckPlateNumber") {
                            TruckPlateNumberCriteria = columnsList[1];
                            TruckPlateNumber = columnsList[2];
                        }


                        if (columnsList[0] === "StatusDescription") {
                            StatusCriteria = columnsList[1];
                            Status = columnsList[2];
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
                    if (loadOptions.sort[0].selector === "RequestDate") {
                        OrderBy = "RequestDate";
                    }
                    else {
                        OrderBy = loadOptions.sort[0].selector;
                    }

                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));


                var requestData =
                    {
                        ServicesAction: 'LoadPaymentRequestList',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: OrderBy,
                        OrderByCriteria: OrderByCriteria,
                        OrderNumber: OrderNumber,
                        OrderNumberCriteria: OrderNumberCriteria,
                        SoldToName: SoldToName,
                        SoldToNameCriteria: SoldToNameCriteria,
                        RequestDate: RequestDate,
                        RequestDateCriteria: RequestDateCriteria,
                        SlabName: SlabName,
                        SlabNameCriteria: SlabNameCriteria,
                        CarrierName: CarrierName,
                        CarrierNameCriteria: CarrierNameCriteria,
                        BankName: BankName,
                        BankNameCriteria: BankNameCriteria,
                        AccountNumber: AccountNumber,
                        AccountNumberCriteria: AccountNumberCriteria,
                        IsExportToExcel: '0',
                        RoleMasterId: $rootScope.RoleId,
                        LoginId: $rootScope.UserId,
                        CultureId: $rootScope.CultureId,
                        CollectedDate: CollectedDate,
                        CollectedDateCriteria: CollectedDateCriteria,
                        DeliveredDate: DeliveredDate,
                        DeliveredDateCriteria: DeliveredDateCriteria,
                        DriverName: DriverName,
                        DriverNameCriteria: DriverNameCriteria,
                        TruckPlateNumber: TruckPlateNumber,
                        TruckPlateNumberCriteria: TruckPlateNumberCriteria,
                        StatusCriteria: StatusCriteria,
                        Status: Status

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
                            if (resoponsedata.Json.PaymentRequestList.length !== undefined) {
                                if (resoponsedata.Json.PaymentRequestList.length > 0) {
                                    totalcount = resoponsedata.Json.PaymentRequestList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.PaymentRequestList.TotalCount;
                            }

                            ListData = resoponsedata.Json.PaymentRequestList;
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
                    if ($scope.GridConfigurationLoaded === false) {
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
                debugger;
                $scope.IsColumnDetailView = false;
                if ($scope.CellCheckboxControl === true || $scope.HeaderCheckboxControl === true) {

                    $scope.IsColumnDetailView = true;
                    debugger;
                    if ($scope.CellCheckboxControl === true) {

                        var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.rownumber === e.data.rownumber; });
                        if (data.length > 0) {
                            data[0].CheckedEnquiry = !data[0].CheckedEnquiry;
                        }
                    }
                    else if ($scope.HeaderCheckboxControl === true) {
                        for (var i = 0; i < $scope.SalesAdminApprovalList.length; i++) {
                            alert($scope.SalesAdminApprovalList[i].CheckedEnquiry + 'header text' + $scope.HeaderCheckBoxAction);
                            $scope.SalesAdminApprovalList[i].CheckedEnquiry = $scope.HeaderCheckBoxAction;
                        }
                    }

                    $scope.HeaderCheckboxControl = false;
                    $scope.CellCheckboxControl = false;

                }
                debugger;
                if (e.rowType !== "filter" && e.rowType != "header" && e.rowType != "detail") {

                    var detailViewAvailable = $scope.GridColumnList.filter(function (el) { return el.ResourceValue === e.column.caption; });
                    if (detailViewAvailable.length > 0) {
                        if (detailViewAvailable[0].IsDetailsViewAvailable === "1") {

                            $scope.CurrentOpenMasterDetailsObject = e;
                            $scope.IsColumnDetailView = true;

                            if (e.column.caption === $rootScope.resData.res_GridColumn_EnquiryAutoNumber) {
                                $scope.ProductInfoSection = true;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = false;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadEnquiryProductByEnquiryId(e.data.EnquiryId, e);


                                }
                            } else if (e.column.caption === $rootScope.resData.res_GridColumn_Stock && e.data.IsAvailableStock !== "1") {
                                $scope.ProductInfoSection = false;
                                $scope.StockCheckSection = true;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = false;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadEnquiryProductByEnquiryId(e.data.EnquiryId, e);
                                }

                            }
                            else if (e.column.caption === $rootScope.resData.res_GridColumn_Status) {
                                $scope.ProductInfoSection = false;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = true;
                                $scope.CustomerCreditCheckSection = false;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadEnquiryProductByEnquiryId(e.data.EnquiryId, e);
                                }

                            } else if (e.column.caption === $rootScope.resData.res_ViewInquiryForOM_CreditLimit) {
                                $scope.ProductInfoSection = false;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = true;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadCreditCheckByEnquiryId(e.data.EnquiryId, e);
                                }

                            }
                            else if (e.column.caption === "Trip ID") {
                                $scope.ProductInfoSection = false;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = false;
                                $scope.PaymentRequestInfoSection = true;

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
                        } else {
                            //$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApprovalGrid_DetailView), 'error', 3000);
                        }
                    }


                } else {
                    $scope.IsColumnDetailView = true;
                }

            },
            //onRowClick: function (e) {
            //    if ($scope.IsColumnDetailView === false) {
            //        $state.go("TrackerPage");
            //    }
            //},

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
            columns: [
                {
                    dataField: "CheckedEnquiry",
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: "left",
                    width: 37,
                    dataType: 'boolean',
                    allowEditing: true,
                    cellTemplate: function (container, options) {

                        $("<div />").dxCheckBox({
                            value: JSON.parse(options.data.CheckedEnquiry),
                            visible: options.data.Status == '2201' ? true : false,
                            onValueChanged: function (data) {
                                debugger;
                                $scope.HeaderCheckboxControl = false;
                                $scope.CellCheckboxControl = true;
                            }
                        }).appendTo(container);
                    },
                    headerCellTemplate: function (container, options) {


                        $("<div />").dxCheckBox({
                            value: false,
                            onValueChanged: function (data) {
                                debugger;
                                $scope.HeaderCheckBoxAction = data.value;
                                $scope.HeaderCheckboxControl = true;
                                $scope.CellCheckboxControl = false;
                            }
                        }).appendTo(container);
                    }
                },
                {
                    dataField: "RequestDate",
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    filterOperations: ['=', '>', '<'],
                    alignment: "right",


                }, {
                    dataField: "CarrierName",
                    alignment: "left"
                },
                {
                    dataField: "SalesOrderNumber",
                    alignment: "left",
                },
                {
                    dataField: "PurchaseOrderNumber",
                    alignment: "left",
                },
                {
                    dataField: "OrderNumber",
                    alignment: "left",
                }, {
                    dataField: "SoldToName",
                    allowSorting: false,
                    alignment: "left",
                }, {
                    dataField: "SlabName",
                    alignment: "left",
                }, {
                    dataField: "Amount",
                    alignment: "right",
                    cellTemplate: "AmountTemplate"
                }, {
                    dataField: "BankName",
                    alignment: "left",
                }, {
                    dataField: "AccountNumber",
                    alignment: "right",
                }, {
                    dataField: "TripCost",
                    alignment: "right",
                    cellTemplate: "TripCostTemplate"
                }, {
                    dataField: "TripRevenue",
                    alignment: "right",
                    cellTemplate: "TripRevenueTemplate"
                }, {
                    dataField: "TruckPlateNumber",
                    alignment: "right"

                },
                {
                    dataField: "CollectedDate",
                    dataType: "date",
                    format: "dd/MM/yyyy hh:mm",
                    filterOperations: ['=', '>', '<'],
                    alignment: "right",


                },
                {
                    dataField: "DeliveredDate",
                    dataType: "date",
                    format: "dd/MM/yyyy hh:mm",
                    filterOperations: ['=', '>', '<'],
                    alignment: "right",


                },
                {
                    dataField: "DriverName",
                    alignment: "right"

                },
                {
                    dataField: "StatusDescription",
                    cssClass: "ClickkableCell",
                    lookup: {
                        dataSource: StatusList,
                        displayExpr: "ResourceValue",
                        valueExpr: "ResourceValue"
                    },
                    cellTemplate: "StatusTemplate",
                    alignment: "left",
                    allowFiltering: true,
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

                }],
        };
    }
    //#endregion


    $scope.ApproveSelectedPaymentRequest = function () {

        var bankDetailsList = [];
        if ($scope.SalesAdminApprovalList !== undefined) {
            var paymentRequestList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.Status === "2201"; });
            if (paymentRequestList.length > 0) {

                if ($scope.ActionType === "Add") {
                    var bankDetails = {};
                    bankDetails.AccountName = $scope.SelectedBankAccount.AccountName;
                    bankDetails.BankName = $scope.SelectedBankAccount.BankName;
                    bankDetails.AccountNumber = $scope.SelectedBankAccount.AccountNumber;
                    bankDetails.AccountType = $scope.SelectedBankAccount.AccountType;
                    bankDetails.IsActive = 1;
                    bankDetailsList.push(bankDetails);
                }


                for (var i = 0; i < paymentRequestList.length; i++) {

                    paymentRequestList[i].TransporterAccountDetailId = $scope.SelectedBankAccount.TransporterAccountDetailId;
                    paymentRequestList[i].IsTransporterAccountDetailIdSpecified = true;
                    paymentRequestList[i].Status = "2202";
                    paymentRequestList[i].IsStatusSpecified = true;
                    paymentRequestList[i].PaidAmount = $scope.SelectedBankAccount.Amount;
                    paymentRequestList[i].ActionType = $scope.ActionType;
                    paymentRequestList[i].BankDetailListy = bankDetailsList;


                }

                $scope.UpdatePaymentRequest(paymentRequestList);
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequestConfirmationPage_SelectPaymentRequest), 'error', 3000);
            }
        }
    }



    $scope.ApproveEnquiryByEnquiryNumber = function (enquiryNumber) {

        $scope.UpdatePaymentRequest(enquiryNumber);
    }
    //#endregion

    //#region Reject Enquiry Event and Function

    $scope.RejectEnquiryByEnquiryNumber = function (enquiryNumber) {

        var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryAutoNumber === enquiryNumber; });
        if (enquiryList.length > 0) {
            $rootScope.ReasonCodeEnquiryId = enquiryList[0].EnquiryId;
            $rootScope.OpenReasoncodepopup(enquiryList, "RejectEnquiry");
        }
    }

    $scope.RejectSelectedPaymentRequest = function () {

        debugger;
        if ($scope.SalesAdminApprovalList !== undefined) {
            var paymentRequestList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.Status === "2201"; });
            if (paymentRequestList.length > 0) {


                var objectList = [];


                for (var i = 0; i < paymentRequestList.length; i++) {



                    //$rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId + "," + enquiryList[i].EnquiryId;
                    //$rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId.replace(/^,/, '');

                    paymentRequestList[i].Status = "2203";
                    paymentRequestList[i].IsStatusSpecified = true;


                    var object = {};
                    object.ObjectId = paymentRequestList[i].PaymentRequestId;

                    objectList.push(object);


                }

                var mainObject = {};
                mainObject.ObjectList = objectList;
                mainObject.ObjectType = "PaymentRequest";
                mainObject.ReasonCodeEventName = "RejectSelectedPaymentRequest";
                mainObject.FunctionName = "UpdatePaymentRequest";
                mainObject.FunctionParameter = paymentRequestList;
                $rootScope.LoadReasonCode("ReasonCode");
                $rootScope.OpenReasoncodepopup(mainObject);
                //   $scope.UpdatePaymentRequest(paymentRequestList);
                //  $scope.SalesAdminApprovalList = [];


            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequestConfirmationPage_SelectPaymentRequest), 'error', 3000);

            }
        }

    }

    $scope.UpdatePaymentRequest = function (paymentRequestList) {

        var requestData =
            {
                ServicesAction: 'UpdatePaymentRequest',
                PaymentRequestList: paymentRequestList,
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

			$scope.RefreshDataGrid();

			debugger;

            var eventNotificationList = [];

            var eventnotification = {};

            if (paymentRequestList[0].Status == "2202") {


				if (paymentRequestList[0].SlabName == "Advance") {


					eventnotification.EventCode = "AdvancedPaymentRequestApproved";

				} else if (paymentRequestList[0].SlabName == "Final") {

					eventnotification.EventCode = "FinalPaymentRequestApproved";

				} else if (paymentRequestList[0].SlabName == "MiscellaneousPayment") {

					eventnotification.EventCode = "MiscellaneousPaymentRequestApproved";

				}
				
               // eventnotification.EventCode = "PaymentRequestApproved";
                eventnotification.ObjectId = paymentRequestList[0].PaymentRequestId;
                eventnotification.ObjectType = "PaymentRequest";
                eventnotification.IsActive = 1;
                eventNotificationList.push(eventnotification);


                $rootScope.InsertInEventNotification(eventNotificationList);



                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequestConfirmationPage_PaymentRequestApproved), '', 3000);


            } else if (paymentRequestList[0].Status == "2203") {




				if (paymentRequestList[0].SlabName == "Advance") {


					eventnotification.EventCode = "AdvancedPaymentRequestRejected";

				} else if (paymentRequestList[0].SlabName == "Final") {

					eventnotification.EventCode = "FinalPaymentRequestRejected";

				} else if (paymentRequestList[0].SlabName == "MiscellaneousPayment") {

					eventnotification.EventCode = "MiscellaneousPaymentRequestRejected";

				}


              //  eventnotification.EventCode = "PaymentRequestRejected";
                eventnotification.ObjectId = paymentRequestList[0].PaymentRequestId;
                eventnotification.ObjectType = "PaymentRequest";
                eventnotification.IsActive = 1;
                eventNotificationList.push(eventnotification);


                $rootScope.InsertInEventNotification(eventNotificationList);

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequestConfirmationPage_PaymentRequestRejected), '', 3000);

            }

            $scope.IsControlEnabled = false;
            $scope.ActionType = "Clear"
            $scope.SelectedBankAccount = {
                TransporterAccountDetailId: '',
                TransporterAccountDetailBankAccountId: '',
                BankName: '',
                AccountNumber: '',
                AccountType: '',
                Amount: ''
            }



        });
    }

    //#endregion

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {

        $scope.SalesAdminApprovalList = [];
        $scope.IsEnquiryEdit = false;
        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#SalesAdminApprovalGrid").dxDataGrid("instance");
        dataGrid.refresh();

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
            $scope.RequestDataFilter.ServicesAction = "ExportToExcelPaymentRequestGrid";
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
                        var filName = "PaymentRequestGrid" + getDate() + ".xlsx";
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
    $ionicModal.fromTemplateUrl('templates/SelectBankAccount.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.SelectBankAccountPopup = modal;
    });


    $scope.bindAllBankAccountList = [];

    $scope.OpenSelectBankAccountPopupPopup = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        $scope.IsControlEnabled = false;
        $scope.ActionType = "Clear"
        $scope.SelectedBankAccount.AccountName = "";
        $scope.SelectedBankAccount.BankName = "";
        $scope.SelectedBankAccount.AccountNumber = "";
        $scope.SelectedBankAccount.AccountType = "";

        var paymentRequestList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
        if (paymentRequestList.length > 0) {

            $scope.SelectedBankAccount.Amount = paymentRequestList[0].Amount;
            var requestData =
                {
                    ServicesAction: 'TransporterAccountDetailListbyCompanyId',
                    CompanyId: paymentRequestList[0].CompanyId,
                };


            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {



                $scope.bindAllBankAccountList = [];

                if (typeof response.data.Json !== 'undefined') {

                    if (response.data.Json.TransporterAccountDetailList.length != 0) {

                        $scope.bindAllBankAccountList = response.data.Json.TransporterAccountDetailList;

                    }

                }

                $scope.SelectBankAccountPopup.show();

            });






        }
        else {

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequestConfirmationPage_SelectPaymentRequest), 'error', 3000);

        }
        $rootScope.Throbber.Visible = false;



    }





    $scope.OpenSelectPayeeNamePopupPopup = function (accountName) {

        $rootScope.Throbber.Visible = true;
        $scope.ClearControlPopup();

        var paymentRequestList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
        if (paymentRequestList.length > 0) {


            var requestData =
                {
                    ServicesAction: 'TransporterAccountDetailListbyAccountName',
                    AccountName: accountName,
                    CompanyId: paymentRequestList[0].CompanyId
                };


            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {



                $scope.bindAllBankAccountDetailList = [];

                if (typeof response.data.Json !== 'undefined') {

                    if (response.data.Json.TransporterAccountDetailList.length > 1) {

                        $scope.bindAllBankAccountDetailList = response.data.Json.TransporterAccountDetailList;

                    }
                    else {
                        $scope.bindAllBankAccountDetailList = response.data.Json.TransporterAccountDetailList;
                        var transportDetailIdList = $scope.bindAllBankAccountList.filter(function (el) { return el.AccountName === response.data.Json.TransporterAccountDetailList[0].AccountName });
                        $scope.SelectedBankAccount.TransporterAccountDetailBankAccountId = transportDetailIdList[0].TransporterAccountDetailId;
                        $scope.OnChangeBankAccountDropDown(transportDetailIdList[0].TransporterAccountDetailId);
                    }

                }



            });






        }
        else {

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequestConfirmationPage_SelectPaymentRequest), 'error', 3000);

        }
        $rootScope.Throbber.Visible = false;



    }





    $scope.CloseSelectBankAccountPopupPopup = function () {
        $scope.SelectedBankAccount = {
            TransporterAccountDetailId: '',
            TransporterAccountDetailBankAccountId: '',
            BankName: '',
            AccountNumber: '',
            AccountType: '',
            Amount: '',


        }

        $scope.SelectBankAccountPopup.hide();
        $scope.bindAllBankAccountDetailList = [];
    }



    $scope.SaveSelectBankAccountPopupPopup = function () {

        if ($scope.ActionType === "Add") {
            $scope.ApproveSelectedPaymentRequest();
            $scope.CloseSelectBankAccountPopupPopup();
        }
        else {

            if ($scope.SelectedBankAccount.TransporterAccountDetailId != "") {


                $scope.ApproveSelectedPaymentRequest();
                $scope.CloseSelectBankAccountPopupPopup();
            } else {

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequestConfirmationPage_SelectBankAccount), 'error', 3000);

            }
        }







    }

    $scope.ClearControlPopup = function () {
        $scope.SelectedBankAccount.BankName = '';
        $scope.SelectedBankAccount.AccountNumber = '';
        $scope.SelectedBankAccount.AccountType = '';

    }


    $scope.OnChangeBankAccountDropDown = function (TransporterAccountDetailId) {




        if (TransporterAccountDetailId != null) {

            var BankAccount = $scope.bindAllBankAccountList.filter(function (el) { return el.TransporterAccountDetailId === TransporterAccountDetailId; });


            if (BankAccount.length != 0) {
                $scope.SelectedBankAccount.TransporterAccountDetailBankAccountId = TransporterAccountDetailId;
                $scope.SelectedBankAccount.BankName = BankAccount[0].BankName;
                $scope.SelectedBankAccount.AccountNumber = BankAccount[0].AccountNumber;
                $scope.SelectedBankAccount.AccountType = BankAccount[0].AccountType;


            }



        } else {

            $scope.SelectedBankAccount = {
                TransporterAccountDetailId: '',
                TransporterAccountDetailBankAccountId: '',
                BankName: '',
                AccountNumber: '',
                AccountType: '',
                Amount: ''
            }


        }




        //$scope.ApproveSelectedEnquiry();
        //$scope.SelectBankAccountPopup.hide();
    }



    //#endregion

    //#region On Load Grid Configuration 
    $scope.GridConfigurationLoaded = false;
    $scope.LoadGridByConfiguration = function (e) {


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

    $scope.AddBankDetails = function () {
        $scope.SelectedBankAccount.BankName = "";
        $scope.SelectedBankAccount.AccountNumber = "";
        $scope.SelectedBankAccount.AccountType = "";
        $scope.bindAllBankAccountDetailList = [];
        $scope.SelectedBankAccount.TransporterAccountDetailId = "";
        $scope.ActionType = "Add";
        $scope.IsControlEnabled = true;
    }
    $scope.ClearBankDetailsAddButton = function () {
        $scope.ActionType = "Clear";
        $scope.IsControlEnabled = false;
        $scope.SelectedBankAccount.BankName = "";
        $scope.SelectedBankAccount.AccountNumber = "";
        $scope.SelectedBankAccount.AccountType = "";
        $scope.bindAllBankAccountDetailList = [];
    }


}).filter('unique', function () {

    return function (items, filterOn) {


        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});;