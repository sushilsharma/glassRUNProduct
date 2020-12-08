angular.module("glassRUNProduct").controller('OMOrderDetailsController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {
    debugger;
    $scope.ProductCodes = '';

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    $scope.bindAllBranchPlant = [];
    $scope.IsSelectedRow = 0;
    $scope.OrderTypeFilterJson = ['Gratis Order', 'Regular Order'];


    LoadActiveVariables($sessionStorage, $state, $rootScope);
    debugger;

    // Product Multiselect Autocomplete box.
    $scope.ProductSelectedList = [];
    $scope.ProductList = [];
    $scope.MultiSelectDropdownSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }

    $scope.LoadShiftList = function () {
        debugger;

        var lookuplist = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ShiftCategory'; });
        if (lookuplist.length > 0) {
            $scope.ShiftList = lookuplist;
        }
    }
    $scope.LoadShiftList();


    $scope.LoadProducts = function () {
        var requestData =
            {
                ServicesAction: 'LoadAllProducts',
                CompanyId: $rootScope.CompanyId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data;
            $scope.ProductList = resoponsedata.Item.ItemList;
        });
    }
    $scope.LoadProducts();


    $scope.ReceivedCapacityPalettesListFilter = function (element) {
        var ReceivedCapacityList = [];
        ReceivedCapacityList = ['Ok', 'Not Ok'];

        element.kendoDropDownList({
            dataSource: ReceivedCapacityList,
            optionLabel: "ReceivedCapacity",
            valuePrimitive: true,
        });
    }


    $scope.EmptiesListFilter = function (element) {


        var EmptiesList = [];
        EmptiesList = ['Ok', 'Not Ok'];



        element.kendoDropDownList({
            dataSource: EmptiesList,
            optionLabel: "Empties",
            valuePrimitive: true,
        });
    }


    $scope.SearchEnquiryByProductName = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        $scope.ProductCodes = '';
        if ($scope.ProductSelectedList.length > 0) {
            for (var i = 0; i < $scope.ProductSelectedList.length; i++) {
                $scope.ProductCodes = $scope.ProductCodes + "," + $scope.ProductSelectedList[i].Id;
            }
            $scope.ProductCodes = $scope.ProductCodes.substr(1);

            gridCallBack();

        } else {

            gridCallBack();
        }

    }

    $scope.ProductSearchCriteria = "";
    $scope.SearchEnquiryIncludeByProductName = function () {
        debugger;
        $scope.ProductSearchCriteria = "Include";
        $scope.SearchEnquiryByProductName();
    }

    $scope.SearchEnquiryExcludeByProductName = function () {
        debugger;
        $scope.ProductSearchCriteria = "Exclude";
        $scope.SearchEnquiryByProductName();
    }

    $scope.ClearProductSearch = function () {
        debugger;
        $scope.ProductSearchCriteria = "";
        $scope.ProductCodes = "";
        $scope.ProductSelectedList = [];
        gridCallBack();
    }


    debugger;
    $scope.bindAllBranchPlant = $rootScope.bindAllBranchPlant;

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.OrderDetailsGrid.dataSource.transport.read($scope.values);
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
        ChangeGridHeaderTitleByLanguage($scope.OrderDetailsGrid, "InquiryDetailsGrid", $rootScope.resData);

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

    $scope.GetPickUpDate = function () {
        debugger;
        $('.PickupDate').each(function () {
            debugger;
            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    debugger;
                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');

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


    //debugger;
    //var requestData =
    //    {
    //        ServicesAction: 'LoadAllBranchPlantList',
    //        CompanyId: $rootScope.CompanyId
    //    };

    //// var stringfyjson = JSON.stringify(requestData);
    //var jsonobject = {};
    //jsonobject.Json = requestData;
    //GrRequestService.ProcessRequest(jsonobject).then(function (response) {
    //    debugger;
    //    // var resoponsedata = JSON.parse(JSON.parse(response.data));
    //    var resoponsedata = response.data;
    //    $scope.bindAllBranchPlant = resoponsedata.DeliveryLocation.DeliveryLocationList;

    //});


    $rootScope.TemOrderData = "";


    $scope.OrderDetailsGrid =
        {
            //rowTemplate: '<tr data-uid="#: uid #" ng-class="{gridSelected : #:IsSelectedRow# ==\'1\'></tr>',
            //rowTemplate: '<tr data-uid="#: uid #" ng-class="{approved : #:ApprovalStatus# ==\'Approved\', unapporved: #:ApprovalStatus# !=\'Approved\'></tr>'
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

                        var Empties = "";
                        var EmptiesCriteria = "";


                        var ReceivedCapacityPalates = "";
                        var ReceivedCapacityPalatesCriteria = "";

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

                        var OrderType = "";

                        var OrderDate = "";
                        var OrderDateCriteria = "";

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

                                if (options.data.filter.filters[i].field === "PurchaseOrderNumber") {
                                    PurchaseOrderNumber = options.data.filter.filters[i].value;
                                    PurchaseOrderNumberCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "StockLocationId") {
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

                                if (options.data.filter.filters[i].field === "OrderDate") {
                                    OrderDate = options.data.filter.filters[i].value;
                                    OrderDate = new Date(OrderDate);
                                    OrderDate = $filter('date')(OrderDate, "dd/MM/yyyy");
                                    OrderDateCriteria = options.data.filter.filters[i].operator;
                                }




                                if (options.data.filter.filters[i].field === "Empties") {
                                    if (options.data.filter.filters[i].value === 'Ok') {
                                        Empties = 'C';
                                    }
                                    else if (options.data.filter.filters[i].value === 'Not Ok') {
                                        Empties = 'W';
                                    }
                                    EmptiesCriteria = options.data.filter.filters[i].operator;
                                }



                                if (options.data.filter.filters[i].field === "ReceivedCapacityPalettes") {

                                    if (options.data.filter.filters[i].value === 'Ok') {
                                        ReceivedCapacityPalates = '1';
                                    }
                                    else if (options.data.filter.filters[i].value === 'Not Ok') {
                                        ReceivedCapacityPalates = '0';
                                    }

                                    ReceivedCapacityPalatesCriteria = options.data.filter.filters[i].operator;
                                }



                                if (options.data.filter.filters[i].field === "CompanyName") {
                                    CompanyNameValue = options.data.filter.filters[i].value;
                                    CompanyNameValueCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "UserName") {
                                    UserName = options.data.filter.filters[i].value;
                                    UserNameCriteria = options.data.filter.filters[i].operator;
                                }
                            }

                        }
                        var requestData =
                            {
                                ServicesAction: 'LoadCustomerServiceOrderDetails',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                SalesOrderNumber: SalesOrderNumber,
                                SalesOrderNumberCriteria: SalesOrderNumberCriteria,
                                CompanyNameValue: CompanyNameValue,
                                CompanyNameValueCriteria: CompanyNameValueCriteria,
                                PurchaseOrderNumber: PurchaseOrderNumber,
                                PurchaseOrderNumberCriteria: PurchaseOrderNumberCriteria,
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
                                Status: Status,
                                StatusCriteria: StatusCriteria,
                                OrderType: OrderType,
                                OrderDate: OrderDate,
                                OrderDateCriteria: OrderDateCriteria,
                                Empties: Empties,
                                EmptiesCriteria: EmptiesCriteria,
                                ReceivedCapacityPalates: ReceivedCapacityPalates,
                                ReceivedCapacityPalatesCriteria: ReceivedCapacityPalatesCriteria,
                                UserName: UserName,
                                UserNameCriteria: UserNameCriteria,
                                RoleMasterId: $rootScope.RoleId,
                                CultureId: $rootScope.CultureId,
                                ProductCode: $scope.ProductCodes,
                                ProductSearchCriteria: $scope.ProductSearchCriteria,
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

                                            orderList[0].OrderTime = orderList[0].OrderDate.split('T')[1].split(':')[0];
                                            orderList[0].OrderDate = orderList[0].OrderDate.split('T')[0];

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

                                                for (var j = 0; j < orderProduct.length; j++) {

                                                    var availableProductStock = orderProduct[j].ProductAvailableQuantity;

                                                    var totalUsedQuantity = parseFloat(orderProduct[j].UsedQuantityInOrder);


                                                    var remainingProductStock = parseFloat(parseFloat(availableProductStock) - parseFloat(totalUsedQuantity));

                                                    if (parseFloat(orderProduct[j].ProductQuantity) < remainingProductStock) {
                                                        orderProduct[j].IsItemAvailableInStock = true;
                                                        // orderList[0].IsAvailableStock = true;
                                                    } else {
                                                        orderProduct[j].IsItemAvailableInStock = false;
                                                        // orderList[0].IsAvailableStock = false;
                                                        // break;
                                                    }
                                                }

                                                var IsAnyProductOutOfStock = orderProduct.filter(function (el) { return el.IsItemAvailableInStock === false });
                                                if (IsAnyProductOutOfStock.length > 0) {
                                                    orderList[0].IsAvailableStock = false;
                                                } else {
                                                    orderList[0].IsAvailableStock = true;
                                                }


                                                var IsGratisItem = orderProduct.filter(function (el) { return parseInt(el.AssociatedOrder) !== 0 });
                                                if (IsGratisItem.length > 0) {
                                                    orderList[0].IsGratisItemAvailable = true;
                                                } else {
                                                    orderList[0].IsGratisItemAvailable = false;
                                                }

                                            } else {
                                                orderList[0].IsAvailableStock = false;
                                                orderList[0].IsGratisItemAvailable = false;
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
                {
                    template: "<input type='checkbox' class='checkbox' ng-model=\"dataItem.selected\" ng-click='onCheckBoxClick($event, dataItem)' />",
                    title: "<input type='checkbox' title='Select all'   ng-click='toggleSelectAll($event)' />",
                    width: "30px"
                },
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
                    field: "EnquiryAutoNumber", template: '<a ng-click=\"LoadOrderViewOnEnquiryClick(\'#=SalesOrderNumber#\',#=IsAvailableStock#)\"  class="graybgfont">#:EnquiryAutoNumber#</a>',
                    title: $rootScope.resData.res_GridColumn_EnquiryAutoNumber, type: "string", filterable: { mode: "row", extra: false },
                    width: "120px"
                },
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
                {
                    field: "PurchaseOrderNumber", template: '<a  class="graybgfont">#:PurchaseOrderNumber#</a>',
                    title: $rootScope.resData.res_GridColumn_PurchaseOrderNumber, type: "string", filterable: { mode: "row", extra: false },
                    width: "120px"
                },
                //{ title: "SalesOrderNumber", template: '<div class="graybgfont">#:SalesOrderNumber#</div>', type: "string", filterable: { mode: "row", extra: false }, "width": "12%" },
                {
                    field: "SalesOrderNumber", template: '<a ng-click=\"LoadOrderView(\'#=SalesOrderNumber#\',#=IsAvailableStock#)\" class="graybgfont">#:SalesOrderNumber#</a>',
                    title: $rootScope.resData.res_GridColumn_SalesOrderNumber, type: "string", filterable: { mode: "row", extra: false },
                    width: "120px"
                },
                {
                    field: "TotalPrice", title: $rootScope.resData.res_GridColumn_TotalPrice, template: "{{dataItem.TotalPrice | currency : 'EUR'}}", "text-align": "center", type: "string", filterable: false,

                    width: "100px"
                },
                {
                    field: "AssociatedOrder", "title": $rootScope.resData.res_GridColumn_AssociatedOrder, type: "string", filterable: { mode: "row", extra: false }, width: "200px"
                },

                {
                    field: "CompanyName", title: $rootScope.resData.res_GridColumn_CompanyName, type: "string", filterable: { mode: "row", extra: false }, width: "150px"
                },
                // { field: "CompanyName", title: "SoldTo", type: "string", filterable: { mode: "row", extra: false } },
                {
                    field: "DeliveryLocation", title: $rootScope.resData.res_GridColumn_DeliveryLocation, type: "string", filterable: { mode: "row", extra: false }, width: "100px"
                },
                {
                    field: "StockLocationId",
                    template: "<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.StockLocationId\" ng-change=\"getSelectedBranchPlantvalue(dataItem.StockLocationId,#=OrderId#)\" ng-options=\"obj.DeliveryLocationId as obj.DeliveryLocationCode for obj in bindAllBranchPlant\"><option value=\"\">Select</option></select>",
                    title: $rootScope.resData.res_GridColumn_StockLocationId,
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



                //{ field: "TruckSize", title: "TruckSize", type: "string", filterable: { mode: "row", extra: false }, "width": "8%" },
                //{ field: "Empties", title: "E", template: "#if(EmptiesLimit > ActualEmpties) {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else{#<span class='orangebgfont'><i class='fa fa-exclamation-triangle'></i></span>#}#", "text-align": "center", type: "string", filterable: false, width: "75px" },
                //{ field: "ReceivedCapacityPalettes", title: "C", template: "<div ng-class=\"{'fontred' : dataItem.ReceivedCapacityPalettes < 0 }\">#=ReceivedCapacityPalettes# / #=Capacity#</div>", "text-align": "center", type: "string", filterable: false, width: "75px" },




                {
                    field: "Empties",
                    template: "#if(Empties==='C') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else{#<span class='orangebgfont'><i class='fa fa-exclamation-triangle'></i></span>#}#",
                    "title": $rootScope.resData.res_GridColumn_Empties,
                    type: "string",
                    filterable: {
                        cell: { showOperators: false, template: $scope.EmptiesListFilter },
                        ui: $scope.EmptiesListFilter, mode: "row", extra: false, operators: {
                            string: {
                                eq: "Is equal to",
                            }
                        }
                    }, width: "75px"
                },




                {
                    field: "ReceivedCapacityPalettes",
                    template: "#if(ReceivedCapacityPalettesCheck==='1') {#<span class=''>#=ReceivedCapacityPalettes# / #=Capacity#</i></span> #} else{#<span class='fontred'>#=ReceivedCapacityPalettes# / #=Capacity#</span>#}#",
                    "title": $rootScope.resData.res_GridColumn_ReceivedCapacityPalettes,
                    type: "string",
                    filterable: {
                        cell: { showOperators: false, template: $scope.ReceivedCapacityPalettesListFilter },
                        ui: $scope.ReceivedCapacityPalettesListFilter, mode: "row", extra: false, operators: {
                            string: {
                                eq: "Is equal to",
                            }
                        }
                    }, width: "75px"
                },






                //{ field: "Capacity", title: "C", template: "#if(Capacity == '1') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else{#<span class='redbgfont'><i class='fa fa-times'></i></span>#}#", "text-align": "center", type: "string", filterable: false, width: "4%" },
                //{ field: "Stock", title: "S", template: "#if(IsAvailableStock === true) {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else if(IsAvailableStock === false) {#<span class='redbgfont'><i class='fa fa-times'></i></span>#}#", "text-align": "center", type: "string", filterable: false, width: "4%" },
                {
                    field: "RequestDate",
                    template: "<div class=\"prepend-icon\"><input type=\"text\" Id=\"{{dataItem.OrderId}}\" ng-model='dataItem.ExpectedTimeOfDelivery' name=\"datepicker\" class=\"customdatertryeytpicker form-control\"  placeholder=\"Select a date...\"><i class=\"icon-calendar\"></i></div>",
                    "title": $rootScope.resData.res_GridColumn_RequestedDate,
                    filterable: false,
                    width: "175px", format: "{0:dd/MM/yyyy}",
                },

                {
                    field: "PraposedTimeOfAction",
                    template: "<div class=\"prepend-icon\"><input type=\"text\" Id=\"Pickup{{dataItem.OrderId}}\" ng-model='dataItem.PraposedTimeOfAction' name=\"datepicker\" class=\"PickupDate form-control\"  placeholder=\"Select a date...\"><i class=\"icon-calendar\"></i></div>", "title": "Pick-up Date",
                    width: "175px", format: "{0:dd/MM/yyyy}",
                },

                {
                    field: "PraposedShift",
                    template: "<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.PraposedShift\"  ng-options=\"obj.LookUpId as obj.Name for obj in ShiftList\"><option value=\"\">Select</option></select>",
                    title: "Pick Shift",
                    width: "175px",
                },


                { field: "ExpectedTimeOfAction", format: "{0:dd/MM/yyyy}", title: $rootScope.resData.res_GridColumn_ExpectedTimeOfAction, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },

                { field: "ExpectedShift", title: $rootScope.resData.res_GridColumn_ExpectedShift, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },


                { field: "UserName", title: $rootScope.resData.res_GridColumn_UserName, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },



                {
                    field: "Status", template: '<a class=\"{{dataItem.Class}}\">#:Status#</a>',
                    title: $rootScope.resData.res_GridColumn_Status, type: "string", filterable: {
                        cell: { showOperators: false, template: $scope.statusFilter },
                        ui: $scope.statusFilter, mode: "row", extra: false, operators: {
                            string: {
                                eq: "Is equal to",
                            }
                        }
                    },
                    width: "175px"
                },
                {
                    field: "Action",
                    title: $rootScope.resData.res_GridColumn_Action, template: "#if(HoldStatus !='-' ) {# Hold on  #=HoldStatus# #} else if(CurrentState == 3) {#<a class=\"greenbgfont approvebtn\" ng-click=\"PrintPickSlipByOrderId(#=OrderId#)\">  Print Pickslip </a>#} else if(CurrentState == 4 || CurrentState == 6 || CurrentState == 35) {#<a class=\"greenbgfont approvebtn\" ng-click=\"RePrintPickSlipByOrderId(#=OrderId#,#=BranchPlantName#)\">   RePrint Pickslip</a>#} else {#-#}#", type: "string",
                    filterable: false,
                    width: "150px"
                }
                ,
                {
                    field: "Document",
                    title: $rootScope.resData.res_GridColumn_Document, template: "#if(HoldStatus !='-' ) {# - #} else if(CurrentState == 4 || CurrentState == 6 || CurrentState == 35) {#<a class=\"greenbgfont approvebtn\" ng-click=\"DownloadDocumentByMultipleOrderId('#=MultipleOrderId#')\">  <i class='fa fa-file-pdf-o' style='font-size: 25px; color: red;' aria-hidden='true'></i> </a>#} else  {#-#}#", type: "string",
                    filterable: false,
                    width: "150px"
                },
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


    function selectKendoGridRow() {
        alert('dfg');
        var checked = this.checked,
            row = $(this).closest("tr"),
            grid = $('#grid').data("kendoGrid"),
            dataItem = grid.dataItem(row);

        if (checked) {
            //-select the row
            kendoCheckedIds[dataItem.uid] = checked;
            grid.select(row); // select the item  
            //row.addClass("k-state-selected");
        } else {
            //-remove selection
            delete kendoCheckedIds[dataItem.uid];
            //row.removeClass("k-state-selected");
            grid.clearSelection(row);
        }
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

            var element = $(ev.currentTarget);
            var row = element.closest("tr");
            if (item.selected) {
                row.addClass("k-state-selected");
            } else {
                row.removeClass("k-state-selected");
            }
        });
    };

    $scope.onCheckBoxClick = function (e, item) {

        var data = $scope.GridData.data.filter(function (el) { return el.OrderId === item.OrderId; });
        if (data.length > 0) {
            data[0].selected = e.target.checked;
        }
        item.selected = e.target.checked;
        var element = $(e.currentTarget);
        var row = element.closest("tr");
        if (item.selected) {

            row.addClass("k-state-selected");
        } else {
            row.removeClass("k-state-selected");
        }
    }

    $scope.AddAttributeToKendoDatePikcer = function () {
        debugger;
        var elems = angular.element(document.getElementsByClassName("k-picker-wrap"));

        for (var i = 0; i < elems.length; i++) {
            elems[i].setAttribute('data-tap-disabled', true);
        }


    }

    function gridDataBound(e) {
        var grid = $("#grid").data("kendoGrid");

        var grid = e.sender;
        //$scope.values = $rootScope.GridData;

        //hideGridColumnByConfiguration(grid, $rootScope.GridObjectPropertiesAccess);
        setTimeout(function () {
            debugger;
            $scope.AddAttributeToKendoDatePikcer();
            $scope.GetScheduleDate();
            $scope.GetPickUpDate();
        }, 500);


        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
        debugger;
        var data = grid.dataSource.data;

        $.each(data, function (i, row) {
            if (row.IsSelectedRow == 1) {
                var element = $('tr[data-uid="' + row.uid + '"] ');
                $(element).addClass("change-background");
            }
        });


    };

    $scope.UpdateOrder = function (orderId) {
        debugger;
        var orderDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.OrderId) === parseInt(orderId); });

        var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;

        var columnName = 'ExpectedTimeOfDelivery';
        var columnNameBranchPlant = 'StockLocationId';
        for (var index = 0; index < gridDataArray.length; index++) {
            var columnValue = gridDataArray[index][columnName];
            var columnValueBranchPlant = gridDataArray[index][columnNameBranchPlant];
            var enquiryRequestDate = orderDetails.filter(function (el) { return el.OrderId === gridDataArray[index]["OrderId"]; });
            if (enquiryRequestDate.length > 0) {
                enquiryRequestDate[0].ExpectedTimeOfDelivery = columnValue;
                enquiryRequestDate[0].StockLocationId = columnValueBranchPlant;
            }
        };

        var requestData =
            {
                ServicesAction: 'UpdateOrder',
                OrderDetailList: orderDetails

            };


        // var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            //$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SavedData), '', 3000);

            gridCallBack();
        });


    }

    $scope.GetAllRecordUpdated = function () {
        debugger;
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (enquiryDetails.length > 0) {

            var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;

            var columnName = 'ExpectedTimeOfDelivery';
            var columnNameBranchPlant = 'StockLocationId';
            for (var index = 0; index < gridDataArray.length; index++) {
                var columnValue = gridDataArray[index][columnName];
                var columnValueBranchPlant = gridDataArray[index][columnNameBranchPlant];
                var enquiryRequestDate = enquiryDetails.filter(function (el) { return el.OrderId === gridDataArray[index]["OrderId"]; });
                if (enquiryRequestDate.length > 0) {
                    enquiryRequestDate[0].ExpectedTimeOfDelivery = columnValue;
                    enquiryRequestDate[0].BranchPlant = columnValueBranchPlant;
                }
            };

            var requestData =
                {
                    ServicesAction: 'UpdateOrder',
                    OrderDetailList: enquiryDetails

                };
            // var stringfyjson = JSON.stringify(requestData);
            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                debugger;
                //$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SavedData), '', 3000);
                gridCallBack();
            });
        }
        else {
            //$rootScope.ValidationErrorAlert('Please select enquiry.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectEnquiry), 'error', 3000);
        }
    }

    $scope.getSelectedBranchPlantvalue = function (id, orderId) {
        debugger;
        $scope.UpdateName = "BranchPlant";
        $scope.UpdateOrderId = orderId;
        $scope.UpdateBranchPlantId = id;
        $scope.OpenReasoncodepopup(orderId);

    }

    $scope.UpdateBranchPlantCode = function () {
        debugger;
        var orderList = {
            BranchPlantName: $scope.UpdateBranchPlantId,
            OrderId: $scope.UpdateOrderId,
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
            debugger;
            // $rootScope.ValidationErrorAlert('Branch Plant updated successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_BranchPlantUpdated), '', 3000);
            gridCallBack();
        });
    }

    $scope.UpdateSchedulingDateOnChange = function (orderId, SchedulingDate) {
        debugger;
        $scope.UpdateName = "SchedulingDate";
        $scope.UpdateOrderId = orderId;
        $scope.UpdateSchedulingDate = SchedulingDate;

        $scope.OpenReasoncodepopup(orderId);

    }

    $scope.UpdateSchedulingDateInOrder = function () {
        debugger;
        var orderList = {
            SchedulingDate: $scope.UpdateSchedulingDate,
            OrderId: $scope.UpdateOrderId,
        }

        var requestData =
            {
                ServicesAction: 'UpdateOrderSchedulingDate',
                OrderDetailList: orderList

            };


        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            //$rootScope.ValidationErrorAlert('Scheduling date updated successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SchedulingUpdated), '', 3000);


            gridCallBack();
        });
    }


    $scope.UpdatePraposedDateInOrderMovement = function () {
        debugger;
        var orderList = $scope.GridData.data.filter(function (el) { return el.OrderId === $scope.UpdateOrderId });


        //var orderList = {
        //    SchedulingDate: $scope.UpdateSchedulingDate,
        //    OrderId: $scope.UpdateOrderId,
        //}

        var requestData =
            {
                ServicesAction: 'GetLeadTimeAndUpdateInOrderMovement',
                OrderDetailList: orderList

            };


        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            //$rootScope.ValidationErrorAlert('Scheduling date updated successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SchedulingUpdated), '', 3000);


            gridCallBack();
        });
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

    $scope.LoadOrderViewOnEnquiryClick = function (salesOrderNumber, stockStatus) {
        debugger;
        if (salesOrderNumber !== "-") {
            $scope.LoadOrderView(salesOrderNumber, stockStatus);
        }
    }

    $ionicModal.fromTemplateUrl('templates/reasoncodepopup.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.reasoncodepopup = modal;
    });

    $scope.ReasonCodeList = [];
    $scope.LoadReasonCode = function () {
        debugger;
        var requestData =
            {
                ServicesAction: 'LoadReasonCodeList'

            };



        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            if (response != undefined) {
                $scope.ReasonCodeList = response.data.ReasonCode.ReasonCodeList;
            }


        });

    };
    debugger;
    $scope.LoadReasonCode();



    $scope.OpenReasoncodepopup = function (orderId) {
        debugger;
        $rootScope.ReasonCodeOrderId = orderId;
        $scope.reasoncodepopup.show();
    }

    $scope.ClosReasoncodepopup = function () {
        debugger;
        $rootScope.ReasonCodeOrderId = 0;
        $scope.ReasonCodeJson.ReasonCode = "";
        $scope.ReasonCodeJson.ReasonDescription = "";
        $scope.reasoncodepopup.hide();
    }


    $scope.ReasonCodeJson = {
        ReasonCode: '',
        ReasonDescription: ''
    }

    $scope.SaveReasonCode = function () {
        debugger;
        if ($scope.ReasonCodeJson.ReasonCode !== "") {
            var reasonCode = {
                ReasonCodeId: $scope.ReasonCodeJson.ReasonCode,
                ReasonDescription: $scope.ReasonCodeJson.ReasonDescription,
                ObjectId: $rootScope.ReasonCodeOrderId,
                ObjectType: 'Order'

            }

            var reasonCodeList = [];
            reasonCodeList.push(reasonCode);

            var requestData =
                {
                    ServicesAction: 'InsertReasonMappingCode',
                    ReasonCodeList: reasonCodeList
                };



            var consolidateApiParamater =
                {
                    Json: requestData,
                };
            debugger;
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                debugger;

                if ($scope.UpdateName === "BranchPlant") {
                    $scope.UpdateBranchPlantCode();
                }
                else if ($scope.UpdateName === "SchedulingDate") {
                    $scope.UpdateSchedulingDateInOrder();
                    $scope.UpdatePraposedDateInOrderMovement();
                }

                //$scope.UpdateOrder($rootScope.ReasonCodeOrderId);

                $scope.UpdateName = "";
                $scope.ReasonCodeJson.ReasonCode = "";
                $scope.ReasonCodeJson.ReasonDescription = "";
                $scope.ClosReasoncodepopup();
            });

        }
        else {

            //$rootScope.ValidationErrorAlert('Please select reason code.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectReasonCode), 'error', 3000);

        }

    }


    $scope.PrintPickSlipByOrderId = function (orderId) {


        debugger;

        debugger;
        var orderDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.OrderId) === parseInt(orderId); });


        var requestData =
            {
                ServicesAction: 'PickSlipConfirmation',
                OrderDetailList: orderDetails

            };


        // var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            //$rootScope.ValidationErrorAlert('Print Pick Slip request placed successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_PrintPickSlip), '', 3000);

            gridCallBack();
        });



    }

    $scope.GetAllRecordToPrintPrintSlip = function () {
        debugger;


        var orderDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (orderDetails.length > 0) {



            var requestData =
                {
                    ServicesAction: 'PickSlipConfirmation',
                    OrderDetailList: orderDetails

                };
            // var stringfyjson = JSON.stringify(requestData);
            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                debugger;
                //$rootScope.ValidationErrorAlert('Print Pick Slip request placed successfully.', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_PrintPickSlip), '', 3000);

                gridCallBack();
            });
        }
        else {
            //$rootScope.ValidationErrorAlert('Please select Order.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectOrder), 'error', 3000);

        }
    }

    $scope.RePrintPickSlipByOrderId = function (orderId, branchPlantCode) {
        debugger;

        var PrinterDetailsData =
            {

                ServicesAction: 'GetLoadPrinterByBranchPlantCode',
                BranchPlantCode: branchPlantCode,
                OrderId: orderId
            }
        var printerjsonobject = {};
        printerjsonobject.Json = PrinterDetailsData;

        GrRequestService.ProcessRequest(printerjsonobject).then(function (response) {
            debugger;
            //Pdf Printing Code
            //$rootScope.ValidationErrorAlert('Print Pick Slip request placed successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_PrintPickSlip), '', 3000);


        });
    }

    $scope.DownloadDocumentByOrderId = function (orderId) {
        debugger;

        var orderRequestData =
            {

                ServicesAction: 'LoadOrderDocumentByOrderId',
                OrderId: orderId

            }
        var jsonobject = {};
        jsonobject.Json = orderRequestData;
        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
            debugger;
            var byteCharacters1 = response.data;
            if (response.data != undefined) {

                var byteCharacters = response.data;

                var blob = new Blob([byteCharacters], {
                    type: "application/Pdf"
                });
                debugger;
                if (blob.size > 0) {
                    var filName = "PickSlipReport" + orderId + ".Pdf";
                    saveAs(blob, filName);
                } else {
                    //$rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                   // $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_DocumentNotGenerated), '', 3000);

                }
            } else {
                //$rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
               // $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_DocumentNotGenerated), '', 3000);

            }


        });
    }


    $scope.DownloadDocumentByMultipleOrderId = function (orderIds) {
        debugger;
       
        var arrayOrderId = orderIds.split(',');


        if (arrayOrderId.length != 0)
        {

            for (var i = 0; i < arrayOrderId.length; i++) {


                if (arrayOrderId[i] != "")
                {
                    $scope.DownloadDocumentByOrderId(arrayOrderId[i]);

                }

               
                
            }

        } 


      
    }


    $scope.RefreshGrid = function () {
        debugger;
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        }
        gridCallBack();
    }

    $scope.UpdatePickUpDateAndShift = function (isBulk) {
        debugger;

        $rootScope.Throbber.Visible = true;
        var orderDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });

        var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;
        var PraposedShift = 'PraposedShift';
        var PraposedTimeOfAction = 'PraposedTimeOfAction';
        for (var index = 0; index < gridDataArray.length; index++) {

            var ExpectedShiftValue = "";
            var PraposedTimeOfActionValue = "";

            if (isBulk === true) {

                ExpectedShiftValue = $scope.PickupInformation.PickupShift;
                PraposedTimeOfActionValue = $scope.PickupInformation.PickupDate;

            } else {

                ExpectedShiftValue = gridDataArray[index][PraposedShift];
                PraposedTimeOfActionValue = gridDataArray[index][PraposedTimeOfAction];
            }

            var ordersData = orderDetails.filter(function (el) { return el.OrderId === gridDataArray[index]["OrderId"]; });
            if (ordersData.length > 0) {

                ordersData[0].PraposedShift = ExpectedShiftValue;
                ordersData[0].PraposedTimeOfAction = PraposedTimeOfActionValue;
                ordersData[0].LocationType = 1;
                ordersData[0].UserId = $rootScope.UserId;
            }

        }

        if (orderDetails.length > 0) {

            var requestData =
                {
                    ServicesAction: 'SavePickupInformationForSelectedOrder',
                    OrderList: orderDetails
                };
            var consolidateApiParamater =
                {
                    Json: requestData,
                };
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                $rootScope.Throbber.Visible = false;

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_PickupInformationUpdated), '', 3000);

                $scope.PickupInformation.PickupShift = "";
                $scope.PickupInformation.PickupDate = "";

                gridCallBack();
            });

        } else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectOrderForUpdatePickUpInformation), 'error', 3000);

        }

    }


    $ionicModal.fromTemplateUrl('templates/ChangePickupDateAndShift.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.ChangePickupDateAndShift = modal;
    });



    $scope.OpenChangePickUpCodePopup = function () {
        debugger;
        $scope.ShowBulkChangePickupDateAndShift = true;
    }

    $scope.CloseChangePickUpCodePopup = function () {
        debugger;
        $scope.ShowBulkChangePickupDateAndShift = false;
    }


    $scope.PickupInformation = {
        PickupShift: "",
        PickupDate: ""
    }

    $scope.PickupDateForBulkOrders = function () {
        debugger;
        setTimeout(function () {
            debugger;
            $('.PickupDateControl').each(function () {
                debugger;
                $(this).datepicker({
                    onSelect: function (dateText, inst) {
                        debugger;
                        if (inst.id != undefined) {
                            angular.element($('#' + inst.id)).triggerHandler('input');

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
        }, 200);
    }


    $scope.UpdateBulkPickUpDateAndShift = function () {
        debugger;
        var orderDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (orderDetails.length > 0) {

            $scope.OpenChangePickUpCodePopup();
            $scope.PickupDateForBulkOrders();

        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectOrder), 'error', 3000);
        }

    }


    $scope.SavePickUpInfoForSelectedEnquiry = function () {
        debugger;
        if ($scope.PickupInformation.PickupShift != "") {
            if ($scope.PickupInformation.PickupDate != "") {
                $scope.UpdatePickUpDateAndShift(true);
                $scope.CloseChangePickUpCodePopup();
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectPickupDateForBulkOrder), 'error', 3000);
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectPickupShiftForBulkOrder), 'error', 3000);
        }
    }



    $scope.onSelection = function (kendoEvent) {
        debugger;
        var grid = kendoEvent.sender;
        
        var selectedData = grid.dataItem(grid.select());

        var items = $('#InquiryDetailsGrid').data('kendoGrid')._data;

        var data = $scope.GridData.data.filter(function (el) { return el.OrderId === selectedData.OrderId; });

        var item = items.filter(function (el) { return el.OrderId === selectedData.OrderId; });

        if (data.length > 0) {
            if (data[0].selected === true) {
                data[0].selected = false;
                item[0].selected = false;
            } else {
                data[0].selected = true;
                item[0].selected = true;
            }

        }
    }

});