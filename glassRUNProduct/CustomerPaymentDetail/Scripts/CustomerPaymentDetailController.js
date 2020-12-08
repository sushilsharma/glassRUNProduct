angular.module("glassRUNProduct").controller('CustomerPaymentDetailController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    
   
    //#region Load Variables And Default Values
    $scope.IsRefreshGrid = false;
    $scope.CurrentOpenMasterDetailsObject = "";
    $scope.selectedRow = -1;

    $scope.BillViewInfoSection = false;
    $scope.PaidViewInfoSection = false;
    $scope.OrderViewInfoSection = false;
    $scope.IsColumnDetailView = false;



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

    var list = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === "CurrencyFormat"; });
    if (list.length > 0) {
        if (list[0].SettingValue === "") {
            $scope.CurrencyFormatCode = "EUR";
        } else {
            $scope.CurrencyFormatCode = list[0].SettingValue;
        }
    }


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


    setTimeout(function () {
        pluginsService.init();
    }, 500);


    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_CustomerPaymentDetailPage_Title;
    console.log("-1" + new Date());
    var StatusList = $rootScope.StatusResourcesList.filter(function (el) { return el.CultureId === $rootScope.CultureId });
    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;


    $scope.filterLookupData = function () {
        

        var ModeOfPayment = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ModeOfPayment'; });
        if (ModeOfPayment.length > 0) {
            
            $scope.ModeOfPaymentList = ModeOfPayment;

        }


    }

    $scope.filterLookupData();




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
        
        var gridrequestData =
        {
            ServicesAction: 'LoadGridConfiguration',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            CultureId: $rootScope.CultureId,
            ObjectId: 34,
            ObjectName: 'Order',
            //ObjectId: 19,
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


                var SalesOrderNumber = "";
                var SalesOrderNumberCriteria = "";


                var SoldToName = "";
                var SoldToNameCriteria = "";


                var SoldToCode = "";
                var SoldToCodeCriteria = "";



                var ShipToCode = "";
                var ShipToCodeCriteria = "";


                var ShipToName = "";
                var ShipToNameCriteria = "";





                

                if (filterOptions != "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');




                        if (columnsList[0] === "SalesOrderNumber") {
                            SalesOrderNumberCriteria = columnsList[1];
                            SalesOrderNumber = columnsList[2];
                        }





                        if (columnsList[0] === "SoldToName") {
                            SoldToNameCriteria = columnsList[1];
                            SoldToName = columnsList[2];
                        }

                        if (columnsList[0] === "SoldToCode") {
                            SoldToCodeCriteria = columnsList[1];
                            SoldToCode = columnsList[2];
                        }

                        if (columnsList[0] === "SoldToName") {
                            SoldToNameCriteria = columnsList[1];
                            SoldToName = columnsList[2];
                        }

                        if (columnsList[0] === "ShipToCode") {
                            ShipToCodeCriteria = columnsList[1];
                            ShipToCode = columnsList[2];
                        }


                        if (columnsList[0] === "ShipToName") {
                            ShipToNameCriteria = columnsList[1];
                            ShipToName = columnsList[2];
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
                    ServicesAction: 'OrderGridByCustomerPaymentDetail',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: OrderBy,
                    OrderByCriteria: OrderByCriteria,
                    SalesOrderNumber: SalesOrderNumber,
                    SalesOrderNumberCriteria: SalesOrderNumberCriteria,
                    SoldToCode: SoldToCode,
                    SoldToCodeCriteria: SoldToCodeCriteria,
                    SoldToName: SoldToName,
                    SoldToNameCriteria: SoldToNameCriteria,
                    ShipToCode: ShipToCode,
                    ShipToCodeCriteria: ShipToCodeCriteria,
                    ShipToName: ShipToName,
                    ShipToNameCriteria: ShipToNameCriteria,
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



                            if (e.column.caption === $rootScope.resData.res_GridColumn_BillInfo && e.data.IsDeliveredALL === "1") {



                                $scope.CurrentOpenMasterDetailsObject = e;
                                $scope.IsColumnDetailView = true;

                                $scope.BillViewInfoSection = false;
                                $scope.PaidViewInfoSection = false;
                                $scope.OrderViewInfoSection = false;



                                $scope.BillViewInfoSection = true;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.OpenBilledDetailView(e.data.SalesOrderNumber, e);
                                    

                                }
                            } else if (e.column.caption === $rootScope.resData.res_GridColumn_PaymentInfo && e.data.IsBilled === "1" && e.data.IsDeliveredALL === "1") {



                                $scope.CurrentOpenMasterDetailsObject = e;
                                $scope.IsColumnDetailView = true;

                                $scope.BillViewInfoSection = false;
                                $scope.PaidViewInfoSection = false;
                                $scope.OrderViewInfoSection = false;



                                $scope.PaidViewInfoSection = true;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.OpenPaidDetailView(e.data.SalesOrderNumber, e);
                                }

                            } else if (e.column.caption === $rootScope.resData.res_GridColumn_SalesOrderNumber) {



                                $scope.CurrentOpenMasterDetailsObject = e;
                                $scope.IsColumnDetailView = true;

                                $scope.BillViewInfoSection = false;
                                $scope.PaidViewInfoSection = false;
                                $scope.OrderViewInfoSection = false;


                                $scope.OrderViewInfoSection = true;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.GetAllOrderBySalesOrderNumber(e.data.SalesOrderNumber, e);
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
                template: "GridDetail",


            },
            columns: [

                //{
                //    dataField: "CheckedEnquiry",
                //    allowFiltering: false,
                //    allowSorting: false,
                //    alignment: "left",
                //    width: 37,
                //    dataType: 'boolean',
                //    allowEditing: true,
                //    cellTemplate: function (container, options) {
                //        $("<div />").dxCheckBox({
                //            value: JSON.parse(options.data.CheckedEnquiry),
                //            visible: options.data.Status == '2201' ? true : false,
                //            onValueChanged: function (data) {
                //                
                //                $scope.HeaderCheckboxControl = false;
                //                $scope.CellCheckboxControl = true;
                //            }
                //        }).appendTo(container);
                //    },
                //    headerCellTemplate: function (container, options) {
                //        
                //        $("<div />").dxCheckBox({
                //            value: false,
                //            onValueChanged: function (data) {
                //                
                //                $scope.HeaderCheckBoxAction = data.value;
                //                $scope.HeaderCheckboxControl = true;
                //                $scope.CellCheckboxControl = false;
                //            }
                //        }).appendTo(container);
                //    }
                //},

                {
                    dataField: "SalesOrderNumber",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left",
                }, {
                    dataField: "SoldToCode",
                    allowSorting: false,
                    alignment: "left",
                }, {
                    dataField: "SoldToName",
                    allowSorting: false,
                    alignment: "left",
                }, {
                    dataField: "ShipToCode",
                    allowSorting: false,
                    alignment: "left",
                }, {
                    dataField: "ShipToName",
                    allowSorting: false,
                    alignment: "left",
                },
                {
                    dataField: "Billed",
                    allowSorting: false,
                    alignment: "center",
                    allowFiltering: false,
                    filterRow: {
                        visible: false,
                        applyFilter: "auto"
                    },

                    headerFilter: false,
                    cellTemplate: "BilledTemplate"
                }, {
                    dataField: "Paid",
                    allowSorting: false,
                    alignment: "center",
                    allowFiltering: false,
                    filterRow: {
                        visible: false,
                        applyFilter: "auto"
                    },

                    headerFilter: false,
                    cellTemplate: "PaidTemplate"
                }, {
                    dataField: "PurchaseOrderNumber",
                    allowSorting: false,
                    alignment: "left",
                }, {
                    dataField: "StockLocationName",
                    allowSorting: false,
                    alignment: "left",
                }, {
                    dataField: "TotalTripCost",
                    alignment: "right",
allowFiltering: false,
                    cellTemplate: "TripCostTemplate"
                }, {
                    dataField: "TotalTripRevenue",
                    alignment: "right",
allowFiltering: false,
                    cellTemplate: "TripRevenueTemplate"
                }],
        };
    }
    //#endregion



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
			$scope.RequestDataFilter.ServicesAction = "ExportToExcelCustomerPaymentDetailGrid";
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
						var filName = "CustomerPaymentDetail" + getDate() + ".xlsx";
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

    //Bill method


    $scope.SendBillRequest = function (data) {
        

        if (data.InvoiceAmount != "" && data.BillingDate != "" && data.InvoiceNumber != "" && data.Remarks != "" && data.InvoiceAmount != null && data.BillingDate != null && data.InvoiceNumber != null && data.Remarks != null) {




            var billingDate = data.BillingDate.split(' ');


            var dateSplit = billingDate[0].split('/');


            var newdate = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0] + ' ' + billingDate[1];



            var requestData =
            {
                ServicesAction: "InsertBillingBySalesOrderNumber",
                SalesOrderNumber: data.SalesOrderNumber,
                InvoiceAmount: data.InvoiceAmount,
                BillingDate: newdate,
                Remarks: data.Remarks,
                InvoiceNumber: data.InvoiceNumber

            };
            var consolidateApiParamater =
            {
                Json: requestData,
            };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                if (response.data !== undefined) {
                    //paymentRequestSlab[0].Status = "2201";

                    data.IsBilled = "1";



                    var Rowdata = $scope.currentRowdata;
                    Rowdata.IsBilled = "1";

                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CustomerPaymentDetailPage_SendBillingRequest), 'error', 8000);
                }
            });


        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CustomerPaymentDetailPage_Fieldsarecompulsory), 'error', 8000);
           // $rootScope.ValidationErrorAlert(String.format("All fields are compulsory"), 'error', 8000);

        }







    }



    $scope.SendPayRequest = function (data) {
        

        var validCheck = true;


        if (data.PaymentDate == "" || data.ModeOfPaymentType == "" || data.PaymentAmount == "" || data.Remarks == "" || data.PaymentDate == null || data.ModeOfPaymentType == null || data.PaymentAmount == null || data.Remarks == null) {


            validCheck = false;


        } else {

            if (data.ModeOfPaymentType == "2301" || data.ModeOfPaymentType == "2302" || data.ModeOfPaymentType == "2303") {

                if (data.ReferenceNumber == "" || data.ReferenceNumber == null ||data.BankName == "" || data.BankName == null) {


                    validCheck = false;


                }



            }
        }



        if (validCheck) {


            var paymentdat = data.PaymentDate.split(' ');


            var dateSplit = paymentdat[0].split('/');


            var newdate = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0] + ' ' + paymentdat[1];


            var requestData =
            {
                ServicesAction: "InsertPaymentBySalesOrderNumber",
                SalesOrderNumber: data.SalesOrderNumber,
                PaymentDate: newdate,
                ModeOfPaymentType: data.ModeOfPaymentType,
                Remarks: data.Remarks,
                PaymentAmount: data.PaymentAmount,
                ReferenceNumber: data.ReferenceNumber,
                BankName: data.BankName

            };
            var consolidateApiParamater =
            {
                Json: requestData,
            };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                if (response.data !== undefined) {
                    //paymentRequestSlab[0].Status = "2201";

                    

                    var data = $scope.ModeOfPaymentList.filter(function (el) { return el.LookUpId === $scope.SalesOrderPaymentObject.ModeOfPaymentType; });


                    $scope.SalesOrderPaymentObject.ModeOfPaymentTypeText = data[0].Code;




                    $scope.SalesOrderPaymentList.push($scope.SalesOrderPaymentObject);



                    $scope.SalesOrderPaymentObject = {

                        SalesOrderNumber: data.SalesOrderNumber,
                        ModeOfPaymentType: "",
                        ModeOfPaymentTypeText: "",
                        ReferenceNumber: "",
                        PaymentAmount: "",
                        PaymentDate: "",
                        Remarks: "",
                        BankName :""

                    };



                    var Rowdata = $scope.currentRowdata;
                    Rowdata.IsPiad = "1";

                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CustomerPaymentDetailPage_SendPaymentRequest), 'error', 8000);
                }
            });


        } else {
            $rootScope.ValidationErrorAlert(String.format("All fields are compulsory"), 'error', 8000);


        }



    }



    $scope.SalesOrderBillingObject = {};

    $scope.SalesOrderPaymentObject = {};





    $scope.OpenBilledDetailView = function (salesOrderNumber, e) {
        

        $rootScope.Throbber.Visible = true;


        $scope.currentRowdata = e.data; 

        


        $scope.SalesOrderBillingObject = {

            SalesOrderNumber: salesOrderNumber,
            InvoiceAmount: "",
            BillingDate: "",
            InvoiceNumber: "",
            Remarks: "",
            IsBilled: "0"

        }


        var requestData =
        {
            ServicesAction: "GetBillingDetailBySalesOrderNumber",
            SalesOrderNumber: salesOrderNumber



        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };



        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data !== undefined) {
                //paymentRequestSlab[0].Status = "2201";

                if (typeof response.data.Json !== "undefined") {
                    $scope.SalesOrderBillingObject = response.data.Json;
                }

                var outerContainerWidth = document.getElementById("SalesAdminApprovalGrid").clientWidth;
                outerContainerWidth = outerContainerWidth - 10;


                e.component.expandRow(e.data);
                $scope.PreviousExpandedRow = e.data;


                var elements = document.getElementsByClassName("EnquiryProductInfoClass");
                var elementId = "";
                for (var i = 0; i < elements.length; i++) {
                    elementId = elements[i].id;
                    elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
                }




            }

            $rootScope.Throbber.Visible = false;
        });






    }

    $scope.SalesOrderPaymentList = [];

    $scope.OpenPaidDetailView = function (salesOrderNumber, e) {
        


        $rootScope.Throbber.Visible = true;


        $scope.currentRowdata = e.data; 

        $scope.SalesOrderPaymentObject = {

            SalesOrderNumber: salesOrderNumber,
            ModeOfPaymentType: "",
            ModeOfPaymentTypeText: "",
            ReferenceNumber: "",
            PaymentAmount: "",
            PaymentDate: "",
            Remarks: "",


        };


        var requestData =
        {
            ServicesAction: "GetPaymentDetailBySalesOrderNumber",
            SalesOrderNumber: salesOrderNumber



        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };



        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data !== undefined) {
                //paymentRequestSlab[0].Status = "2201";

                if (typeof response.data.Json !== "undefined") {
                    $scope.SalesOrderPaymentList = response.data.Json.SalesOrderPaymentList;
                }

                var outerContainerWidth = document.getElementById("SalesAdminApprovalGrid").clientWidth;
                outerContainerWidth = outerContainerWidth - 10;


                e.component.expandRow(e.data);
                $scope.PreviousExpandedRow = e.data;


                var elements = document.getElementsByClassName("EnquiryProductInfoClass");
                var elementId = "";
                for (var i = 0; i < elements.length; i++) {
                    elementId = elements[i].id;
                    elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
                }





            }

            $rootScope.Throbber.Visible = false;
        });



    }





    $scope.GetAllOrderBySalesOrderNumber = function (salesOrderNumber, e) {
        
        $rootScope.Throbber.Visible = true;

        var requestData =
        {
            ServicesAction: "GetAllOrderBySalesOrderNumber",
            SalesOrderNumber: salesOrderNumber,
            RoleId: $rootScope.RoleId,
            CultureId: $rootScope.CultureId


        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data !== undefined) {
                //paymentRequestSlab[0].Status = "2201";

                $scope.ChildOrderList = response.data.Json.OrderList;


                var outerContainerWidth = document.getElementById("SalesAdminApprovalGrid").clientWidth;
                outerContainerWidth = outerContainerWidth - 10;


                e.component.expandRow(e.data);
                $scope.PreviousExpandedRow = e.data;


                var elements = document.getElementsByClassName("EnquiryProductInfoClass");
                var elementId = "";
                for (var i = 0; i < elements.length; i++) {
                    elementId = elements[i].id;
                    elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
                }




            }

            $rootScope.Throbber.Visible = false;
        });


    }



    $scope.InitializeDatePicker = function (item) {
        


        $('.paymentDate').each(function () {


            $(this).datetimepicker({

                onSelect: function (dateText, inst) {


                    
                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                    } else {
                        angular.element($('#' + inst.inst.id)).triggerHandler('input');
                    }


                },
                dateFormat: 'dd/mm/yy',
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>'
            });
        });


    }

});