angular.module("glassRUNProduct").controller('GratisOrderViewController', function ($scope, $rootScope, $sessionStorage, $state, $ionicModal, $location, pluginsService, GrRequestService) {

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    $scope.bindAllBranchPlant = [];

    $scope.OrderTypeFilterJson = ['Gratis Order', 'Regular Order'];






    LoadActiveVariables($sessionStorage, $state, $rootScope);


    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.GratisOrderViewGrid.dataSource.transport.read($scope.values);
        }
    };

    $scope.statusFilter = function (element) {
        debugger;
        $scope.StatusFilterEelement = element;
        var lookuplist = $rootScope.StatusResourcesList.filter(function (el) { return el.CultureId === $rootScope.CultureId });
        var lookuplistName = [];
        if (lookuplist.length > 0) {
            for (var i = 0; i < lookuplist.length; i++) {
                lookuplistName.push(lookuplist[i].ResourceValue);
            }
        }
        element.kendoDropDownList({
            dataSource: lookuplistName,
            optionLabel: "Status",
            valuePrimitive: true,
        });
    }

    $scope.BranchPlantFilter = function (element) {


        debugger;
        var requestData =
            {
                ServicesAction: 'LoadAllBranchPlantList',
                CompanyId: $rootScope.CompanyId
            };

        // var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            // var resoponsedata = JSON.parse(JSON.parse(response.data));
            var resoponsedata = response.data;
            $scope.bindAllBranchPlant = resoponsedata.DeliveryLocation.DeliveryLocationList;



            var BranchPlantList = [];
            if ($scope.bindAllBranchPlant.length > 0) {
                for (var i = 0; i < $scope.bindAllBranchPlant.length; i++) {
                    BranchPlantList.push($scope.bindAllBranchPlant[i].DeliveryLocationCode);
                }
            }
            element.kendoDropDownList({
                dataSource: BranchPlantList,
                optionLabel: "BranchPlant",
                valuePrimitive: true,
            });
        });
    }


    $scope.OrderTypeFilter = function (element) {
        debugger;
        element.kendoDropDownList({
            dataSource: $scope.OrderTypeFilterJson,
            optionLabel: "OrderType",
            valuePrimitive: true,
        });
    }


    $scope.datepickerfilter = function (element) {
        debugger;
        element.kendoDatePicker({ format: "dd/MM/yyyy", parseFormats: "{0:dd/MM/yyyy}", valuePrimitive: true });
    }


    $rootScope.GridRecallForStatus = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        ChangeGridHeaderTitleByLanguage($scope.GratisOrderViewGrid, "GratisOrderViewGrid", $rootScope.resData);

        gridCallBack();
        $scope.statusFilter($scope.StatusFilterEelement);
    }


    $scope.GetScheduleDate = function () {
        debugger;
        $('.customdatertryeytpicker').each(function () {
            debugger;
            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    debugger;
                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                        $scope.UpdateSchedulingDateOnChange(inst.id, dateText);
                    }

                },
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });
    }





    $rootScope.TemOrderData = "";


    $scope.GratisOrderViewGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) {


                        var SalesOrderNumber = "";
                        var SalesOrderNumberCriteria = "";

                        var EnquiryAutoNumber = "";
                        var EnquiryAutoNumberCriteria = "";

                        var PurchaseOrderNumber = "";
                        var PurchaseOrderNumberCriteria = "";


                        var CompanyNameValue = "";
                        var CompanyNameValueCriteria = "";


                        var ShipTo = "";
                        var ShipToCriteria = "";
                        var InquiryNumber = "";
                        var InquiryNumberCriteria = "";
                        var InquiryNumber = "";
                        var InquiryNumberCriteria = "";

                        var BranchPlant = "";
                        var BranchPlantCriteria = "";

                        var DeliveryLocation = "";
                        var DeliveryLocationCriteria = "";

                        var Status = "";
                        var StatusCriteria = "";

                        var RequestDate = "";
                        var RequestDateCriteria = "";

                        var Gratis = "";
                        var GratisCriteria = "";

                        var Description1 = "";
                        var Description1Criteria = "";

                        var Description2 = "";
                        var Description2Criteria = "";

                        var Province = "";
                        var ProvinceCriteria = "";

                        var OrderedBy = "";
                        var OrderedByCriteria = "";

                        var OrderType = "";
                        var TruckSize = "";
                        var TruckSizeCriteria = "";

                        var ProductCode = "";
                        var ProductCodeCriteria = "";

                        var ProductQuantity = "";
                        var ProductQuantityCriteria = "";

                        var AssociatedOrder = "";
                        var AssociatedOrderCriteria = "";

                        var UserName = "";
                        var UserNameCriteria = "";

                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };

                            debugger;

                            for (var i = 0; i < options.data.filter.filters.length; i++) {


                                if (options.data.filter.filters[i].field === "SalesOrderNumber") {
                                    SalesOrderNumber = options.data.filter.filters[i].value;
                                    SalesOrderNumberCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "EnquiryAutoNumber") {
                                    EnquiryAutoNumber = options.data.filter.filters[i].value;
                                    EnquiryAutoNumberCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "BranchPlantName") {
                                    BranchPlant = options.data.filter.filters[i].value;
                                    BranchPlantCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "DeliveryLocation") {
                                    DeliveryLocation = options.data.filter.filters[i].value;
                                    DeliveryLocationCriteria = options.data.filter.filters[i].operator;
                                }
                                if (options.data.filter.filters[i].field === "AssociatedOrder") {
                                    Gratis = options.data.filter.filters[i].value;
                                    GratisCriteria = options.data.filter.filters[i].operator;
                                }
                                debugger;
                                if (options.data.filter.filters[i].field === "Description1") {
                                    Description1 = options.data.filter.filters[i].value;
                                    Description1Criteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "Description2") {
                                    Description2 = options.data.filter.filters[i].value;
                                    Description2Criteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "Province") {
                                    Province = options.data.filter.filters[i].value;
                                    ProvinceCriteria = options.data.filter.filters[i].operator;
                                }


                                if (options.data.filter.filters[i].field === "OrderedBy") {
                                    OrderedBy = options.data.filter.filters[i].value;
                                    OrderedByCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "Status") {
                                    Status = options.data.filter.filters[i].value;
                                    StatusCriteria = options.data.filter.filters[i].operator;
                                }
                                if (options.data.filter.filters[i].field === "ExpectedTimeOfDelivery") {
                                    debugger;
                                    RequestDate = options.data.filter.filters[i].value;
                                    RequestDate = new Date(RequestDate);
                                    RequestDate = $filter('date')(RequestDate, "dd/MM/yyyy");
                                    RequestDateCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "OrderType") {
                                    OrderType = options.data.filter.filters[i].value;

                                }

                                if (options.data.filter.filters[i].field === "CompanyName") {
                                    CompanyNameValue = options.data.filter.filters[i].value;
                                    CompanyNameValueCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "PurchaseOrderNumber") {
                                    PurchaseOrderNumber = options.data.filter.filters[i].value;
                                    PurchaseOrderNumberCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "TruckSize") {
                                    TruckSize = options.data.filter.filters[i].value;
                                    TruckSizeCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "ProductCode") {
                                    ProductCode = options.data.filter.filters[i].value;
                                    ProductCodeCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "ProductQuantity") {
                                    ProductQuantity = options.data.filter.filters[i].value;
                                    ProductQuantityCriteria = options.data.filter.filters[i].operator;
                                }
                                if (options.data.filter.filters[i].field === "AssociatedOrder") {
                                    AssociatedOrder = options.data.filter.filters[i].value;
                                    AssociatedOrderCriteria = options.data.filter.filters[i].operator;
                                }
                                if (options.data.filter.filters[i].field === "UserName") {
                                    UserName = options.data.filter.filters[i].value;
                                    UserNameCriteria = options.data.filter.filters[i].operator;
                                }

                            }
                        }
                        var requestData =
                            {
                                ServicesAction: 'LoadCustomerServiceGratisOrderDetails',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                SalesOrderNumber: SalesOrderNumber,
                                SalesOrderNumberCriteria: SalesOrderNumberCriteria,
                                EnquiryAutoNumber: EnquiryAutoNumber,
                                EnquiryAutoNumberCriteria: EnquiryAutoNumberCriteria,
                                BranchPlant: BranchPlant,
                                BranchPlantCriteria: BranchPlantCriteria,
                                DeliveryLocation: DeliveryLocation,
                                DeliveryLocationCriteria: DeliveryLocationCriteria,
                                Gratis: Gratis,
                                GratisCriteria: GratisCriteria,
                                RequestDate: RequestDate,
                                RequestDateCriteria: RequestDateCriteria,
                                Description1: Description1,
                                Description1Criteria: Description1Criteria,
                                Description2: Description2,
                                Description2Criteria: Description2Criteria,
                                Province: Province,
                                ProvinceCriteria: ProvinceCriteria,
                                OrderedBy: OrderedBy,
                                OrderedByCriteria: OrderedByCriteria,
                                Status: Status,
                                StatusCriteria: StatusCriteria,
                                OrderType: OrderType,
                                CompanyNameValue: CompanyNameValue,
                                CompanyNameValueCriteria: CompanyNameValueCriteria,
                                PurchaseOrderNumber: PurchaseOrderNumber,
                                PurchaseOrderNumberCriteria: PurchaseOrderNumberCriteria,
                                TruckSize: TruckSize,
                                TruckSizeCriteria: TruckSizeCriteria,
                                ProductCode: ProductCode,
                                ProductCodeCriteria: ProductCodeCriteria,
                                ProductQuantity: ProductQuantity,
                                ProductQuantityCriteria: ProductQuantityCriteria,
                                AssociatedOrder: AssociatedOrder,
                                AssociatedOrderCriteria: AssociatedOrderCriteria,
                                RoleMasterId: $rootScope.RoleId,
                                CultureId: $rootScope.CultureId,
                                UserName: UserName,
                                UserNameCriteria: UserNameCriteria,
                                UserId: $rootScope.CompanyId
                            };

                        //var stringfyjson = JSON.stringify(requestData);
                        var consolidateApiParamater =
                            {
                                Json: requestData,
                            };


                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            debugger;

                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;
                            if (resoponsedata != null) {
                                debugger;

                                if (resoponsedata.Json !== undefined) {

                                    if (resoponsedata.Json.OrderList.length != undefined) {
                                        if (resoponsedata.Json.OrderList.length > 0) {
                                            totalcount = resoponsedata.Json.OrderList[0].TotalCount
                                        }

                                    } else {
                                        debugger;
                                        totalcount = resoponsedata.Json.OrderList.TotalCount;
                                    }
                                    ListData = resoponsedata.Json.OrderList;


                                    var WoodenPalletCode = "";
                                    var WoodenPalletCodeList = $rootScope.AllSettingMasterData.filter(function (el) { return el.SettingParameter === 'WoodenPalletCode'; });
                                    if (WoodenPalletCodeList.length > 0) {
                                        WoodenPalletCode = WoodenPalletCodeList[0].SettingValue;
                                    }

                                    for (var i = 0; i < ListData.length; i++) {
                                        var orderList = ListData.filter(function (el) { return el.OrderId === ListData[i].OrderId });

                                        if (orderList.length > 0) {

                                            //if (orderList[0].CompanyName != undefined) {
                                            //    if (orderList[0].CompanyName.indexOf('-') >= 0) {
                                            //        orderList[0].CompanyNameValue = orderList[0].CompanyName.split('-')[0];
                                            //    } else {
                                            //        orderList[0].CompanyNameValue = orderList[0].CompanyName.substring(0, 5);
                                            //    }
                                            //} else {
                                            //    orderList[0].CompanyNameValue = "";
                                            //}

                                            var orderProduct = orderList[0].OrderProductList.filter(function (el) { return el.ProductCode !== WoodenPalletCode });
                                            if (orderProduct.length > 0) {

                                                var IsAnyProductOutOfStock = orderProduct.filter(function (el) { return el.IsItemAvailableInStock === false });
                                                if (IsAnyProductOutOfStock.length > 0) {
                                                    orderList[0].IsAvailableStock = false;
                                                } else {
                                                    orderList[0].IsAvailableStock = true;
                                                }
                                            }
                                        }
                                    }

                                } else {
                                    ListData = [];
                                    totalcount = 0;
                                }
                            }
                            var inquiryList = {
                                data: ListData,
                                totalRecords: totalcount
                            }
                            $scope.GridData = inquiryList;
                            options.success(inquiryList);
                            $scope.values = options;

                            $rootScope.Throbber.Visible = false;
                        });
                    }
                },
                pageSize: 50,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true
            },
            filterable:
            {
                mode: "row"
            },
            selectable: "row",
            pageable:
            {
                pageSizes: [10, 50, 100]
            },
            sortable: true,
            groupable: true,
            columnMenu: true,
            mobile: true,
            dataBound: gridDataBound,
            columns: [

                //{
                //    template: "<input type='checkbox' class='checkbox' ng-model=\"dataItem.selected\" ng-click='onCheckBoxClick($event, dataItem)' />",
                //    title: "<input type='checkbox' title='Select all'  ng-click='toggleSelectAll($event)' />",
                //    width: "30px"
                //},
                //{ title: "SalesOrderNumber", template: '<div class="graybgfont">#:SalesOrderNumber#</div>', type: "string", filterable: { mode: "row", extra: false }, "width": "12%" },

                {
                    field: "OrderDate", "title": $rootScope.resData.res_GridColumn_OrderDate, type: "date",
                    filterable:
                    {
                        cell:
                        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy HH:mm" },
                        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy HH:mm"
                    }, parseFormats: "{0:dd/MM/yyyy HH:mm}", format: "{0:dd/MM/yyyy HH:mm}", width: "175px"
                },
                {
                    field: "SalesOrderNumber", template: '<a ng-click=\"LoadOrderView(\'#=SalesOrderNumber#\',#=IsAvailableStock#)\" class="graybgfont">#:SalesOrderNumber#</a>',
                    title: $rootScope.resData.res_GridColumn_AssociatedOrder, type: "string", filterable: { mode: "row", extra: false },
                    width: "120px"
                },
                //{ field: "AssociatedOrder", title: $rootScope.resData.res_GridColumn_AssociatedOrder, type: "string", filterable: { mode: "row", extra: false }, "width": "150px" },
                //{
                //    field: "PurchaseOrderNumber",
                //    title: $rootScope.resData.res_GridColumn_PurchaseOrderNumber, type: "string", filterable: { mode: "row", extra: false },
                //    width: "120px"
                //},
                {
                    field: "BranchPlantName",
                    title: $rootScope.resData.res_GridColumn_BranchPlantName,
                    width: "175px",
                    filterable: {
                        cell: { showOperators: false, template: $scope.BranchPlantFilter },
                        ui: $scope.BranchPlantFilter, mode: "row", extra: false, operators: {
                            string: {
                                eq: "Is equal to",
                            }
                        }
                    },
                    width: "175px"
                },

                { field: "ProductCode", title: $rootScope.resData.res_GridColumn_ProductCode, type: "string", filterable: { mode: "row", extra: false }, "width": "200px" },
                { field: "ProductQuantity", title: $rootScope.resData.res_GridColumn_ProductQuantity, type: "string", filterable: { mode: "row", extra: false }, "width": "200px" },

                //{
                //    field: "OrderType", title: "OrderType", type: "string", filterable: {
                //        cell: { showOperators: false, template: $scope.OrderTypeFilter },
                //        ui: $scope.OrderTypeFilter, mode: "row", extra: false, operators: {
                //            string: {
                //                eq: "Is equal to",
                //            }
                //        }
                //    },
                //    width: "150px"
                //},

                { field: "UsedGratisOrder", title: 'Gratis Status', type: "string", filterable: false, width: "120px" },

                { field: "CompanyName", title: $rootScope.resData.res_GridColumn_CompanyName, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },
                { field: "DeliveryLocation", title: $rootScope.resData.res_GridColumn_DeliveryLocation, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },

                //{ field: "OrderType", title: $rootScope.resData.res_GridColumn_OrderType, type: "string", filterable: { mode: "row", extra: false }, width: "150px" },

                { field: "GratisCode", title: $rootScope.resData.res_GridColumn_GratisCode, type: "string", filterable: { mode: "row", extra: false }, width: "150px" },
                //{ field: "Capacity", title: "C", template: "#if(Capacity == '1') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else{#<span class='redbgfont'><i class='fa fa-times'></i></span>#}#", "text-align": "center", type: "string", filterable: false, width: "4%" },
                //{ field: "Stock", title: "S", template: "#if(IsAvailableStock === true) {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else if(IsAvailableStock === false) {#<span class='redbgfont'><i class='fa fa-times'></i></span>#}#", "text-align": "center", type: "string", filterable: false, width: "4%" },

                { field: "TruckSize", title: $rootScope.resData.res_GridColumn_TruckSize, type: "string", filterable: { mode: "row", extra: false }, width: "150px" },
                // { field: "RequestDate", title: "Scheduling Date", template: "#if(RequestDate !== '') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else{#<span class=''><i class='fa fa-times'></i></span>#}#", "text-align": "center", "width": "7%", type: "string", filterable: { mode: "row", extra: false } },
                //{ template: "<div class=\"prepend-icon\"><input type=\"text\" Id=\"{{dataItem.OrderId}}\" ng-model='dataItem.ExpectedTimeOfDelivery' name=\"datepicker\" class=\"customdatertryeytpicker form-control\"  placeholder=\"Select a date...\"><i class=\"icon-calendar\"></i></div>", "title": "Scheduling Date", width: "175px", format: "{0:dd/MM/yyyy}", },
                //{ field: "AssociatedOrder", "title": "Gratis #", type: "string", filterable: { mode: "row", extra: false }, width: "200px" },

                { field: "Province", title: $rootScope.resData.res_GridColumn_Province, type: "string", filterable: { mode: "row", extra: false }, "width": "150px" },
                { field: "OrderedBy", title: $rootScope.resData.res_GridColumn_OrderedBy, type: "string", filterable: { mode: "row", extra: false }, "width": "150px" },
                { field: "Description1", title: $rootScope.resData.res_GridColumn_Description1, type: "string", filterable: { mode: "row", extra: false }, "width": "200px" },
                { field: "Description2", title: $rootScope.resData.res_GridColumn_Description2, type: "string", filterable: { mode: "row", extra: false }, "width": "250px" },


                {
                    field: "UserName", title: $rootScope.resData.res_GridColumn_UserName, type: "string", filterable: { mode: "row", extra: false }, width: "120px"
                },
                {
                    field: "Status", template: '<a class=\"{{dataItem.Class}}\">#:Status#</a>',
                    "title": $rootScope.resData.res_GridColumn_Status, type: "string", filterable: {
                        cell: { showOperators: false, template: $scope.statusFilter },
                        ui: $scope.statusFilter, mode: "row", extra: false, operators: {
                            string: {
                                eq: "Is equal to",
                            }
                        }
                    },
                    width: "175px"
                },








                //{
                //    title: "Action", template: "#if(CurrentState == 1) {#<a class=\"greenbgfont approvebtn\" ng-click=\"UpdateOrder(#=OrderId#)\"> Approve </a>#} else {#<a class=\"greenbgfont approvebtn\" ng-click=\"UpdateOrder(#=OrderId#)\">  Update Order</a>#}#", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } },
                //    width: "150px"
                //},

                //{
                //    title: "Print", template: "<a class=\"greenbgfont approvebtn\" ng-click=\"PrintPickSlipByOrderId(#=OrderId#)\">  Print Pickslip</a>", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } },
                //    width: "150px"
                //},
                //{
                //    title: "Print", template: "<a class=\"greenbgfont approvebtn\" ng-click=\"RePrintPickSlipByOrderId(#=OrderId#,#=SalesOrderNumber#,#=BranchPlantName#)\">  RePrint Pickslip</a>", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } },
                //    width: "150px"
                //},

            ],
        }





    $scope.LoadOrderView = function (salesOrderNumber, stockStatus) {
        debugger;
        $rootScope.SalesOrderNumber = salesOrderNumber;

        var orderList = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === salesOrderNumber });
        if (orderList.length > 0) {
            var OutOfStockItem = [];
            for (var j = 0; j < orderList[0].OrderProductList.length; j++) {
                if (orderList[0].OrderProductList[j].IsItemAvailableInStock === false) {
                    OutOfStockItem.push(orderList[0].OrderProductList[j].OrderProductId);
                }
            }
            $rootScope.OutofStockItemsList = OutOfStockItem;
        }

        $rootScope.IsStockAvilable = stockStatus;
        $state.go("CreateInquiryForSLM");
    }




    $scope.toggleSelectAll = function (ev) {
        debugger;
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();
        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.OrderId === item.OrderId; });
            if (data.length > 0) {
                data[0].selected = ev.target.checked;
            }
            item.selected = ev.target.checked;
        });
    };





    $scope.onCheckBoxClick = function (ev, item) {
        debugger;

        var data = $scope.GridData.data.filter(function (el) { return el.OrderId === item.OrderId; });
        if (data.length > 0) {
            data[0].selected = ev.target.checked;
        }

        item.selected = ev.target.checked;
    }

    $scope.AddAttributeToKendoDatePikcer = function () {
        debugger;
        var elems = angular.element(document.getElementsByClassName("k-picker-wrap"));

        for (var i = 0; i < elems.length; i++) {
            elems[i].setAttribute('data-tap-disabled', true);
        }

    }

    function gridDataBound(e) {

        var grid = e.sender;
        //$scope.values = $rootScope.GridData;

        //hideGridColumnByConfiguration(grid, $rootScope.GridObjectPropertiesAccess);
        setTimeout(function () {
            debugger;
            $scope.AddAttributeToKendoDatePikcer();
            $scope.GetScheduleDate();
        }, 500);


        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };





});