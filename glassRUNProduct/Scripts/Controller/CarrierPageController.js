angular.module("glassRUNProduct").controller('CarrierController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {
    

    $scope.OrderType = "SO";

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);


    $scope.ReasonCodeList = [];
    $scope.LoadReasonCode = function () {

        var requestData =
            {
                ServicesAction: 'LoadReasonCodeList'

            };



        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response != undefined) {
                $scope.ReasonCodeList = response.data.ReasonCode.ReasonCodeList;
            }


        });

    };

    $scope.LoadReasonCode();

    $scope.statusFilter = function (element) {
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


    $scope.LoadShiftList = function () {
        

        var lookuplist = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ShiftCategory'; });
        if (lookuplist.length > 0) {
            $scope.ShiftList = lookuplist;
        }
    }
    $scope.LoadShiftList();


    $scope.GetPickUpDate = function () {
        
        $('.PickupDate').each(function () {
            
            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    
                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');

                        var orderId = inst.id.replace(/[A-Za-z$-]/g, "");

                        $scope.UpdateCondirmedPickDateOnChange(orderId, dateText);

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



    $scope.GetScheduleDate = function (id, startDate, endDate) {

        $('#' + id).each(function () {

            $(this).datepicker({
                onSelect: function (dateText, inst) {

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

    $scope.IsRPMPresentFilter = function (element) {


        var EmptiesList = [];
        EmptiesList = ['Ok', 'Not Ok'];



        element.kendoDropDownList({
            dataSource: EmptiesList,
            optionLabel: "All",
            valuePrimitive: true,
        });
    }

    $scope.FeedbackVariable = {
        OverAll: true,
        Specific: false
    }
    $scope.CarrierGridId
        =
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

                        var OrderType = "";

                        var OrderDate = "";
                        var OrderDateCriteria = "";

                        var IsRPMPresent = "";
                        var IsRPMPresentCriteria = "";

                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };

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

                                if (options.data.filter.filters[i].field === "CompanyNameValue") {
                                    CompanyNameValue = options.data.filter.filters[i].value;
                                    CompanyNameValueCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "IsRPMPresent") {

                                    if (options.data.filter.filters[i].value === 'Ok') {
                                        IsRPMPresent = '1';
                                    }
                                    else if (options.data.filter.filters[i].value === 'Not Ok') {
                                        IsRPMPresent = '0';
                                    }

                                    IsRPMPresentCriteria = options.data.filter.filters[i].operator;
                                }
                            }

                        }

                        
                        var requestData =
                            {
                                ServicesAction: 'LoadCarrierDetails',
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
                                OrderType: $scope.OrderType,
                                OrderDate: OrderDate,
                                OrderDateCriteria: OrderDateCriteria,
                                RoleMasterId: $rootScope.RoleId,
                                CultureId: $rootScope.CultureId,
                                UserId: $rootScope.CompanyId,
                                IsRPMPresent: IsRPMPresent,
                                IsRPMPresentCriteria: IsRPMPresentCriteria,

                            };

                        $scope.ServiceActionParameter = requestData;

                        // var stringfyjson = JSON.stringify(requestData);
                        
                        var requestDataForCarrier =
                            {
                                ServicesAction: 'LoadDriverByCarrier',
                                CarrierId: $rootScope.UserId,
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
                                    CarrierId: $rootScope.UserId,
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





                                var consolidateApiParamater =
                                    {
                                        Json: requestData,

                                    };

                                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                                    

                                    var totalcount = null;
                                    var ListData = null;
                                    var resoponsedata = response.data;

                                    if (resoponsedata !== null) {
                                        

                                        if (resoponsedata.Json !== undefined) {

                                            if (resoponsedata.Json.OrderList.length !== undefined) {
                                                if (resoponsedata.Json.OrderList.length > 0) {

                                                    totalcount = resoponsedata.Json.OrderList[0].TotalCount
                                                }

                                            } else {

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

                                                    if (orderList[0].CompanyName != undefined) {
                                                        if (orderList[0].CompanyName.indexOf('-') >= 0) {
                                                            orderList[0].CompanyNameValue = orderList[0].CompanyName.split('-')[0];
                                                        } else {
                                                            orderList[0].CompanyNameValue = orderList[0].CompanyName.substring(0, 5);
                                                        }
                                                    } else {
                                                        orderList[0].CompanyNameValue = "";
                                                    }

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



                                                    }
                                                }
                                            }

                                        }
                                        else {
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


                            });


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
                    template: "<input type='checkbox' class='checkbox' ng-model=\"dataItem.selected\" ng-click='onCheckBoxClick($event, dataItem)'/>",
                    title: "<input type='checkbox' title='Select all'  ng-click='toggleSelectAll($event)' />",
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
                    field: "SalesOrderNumber", template: '<a ng-click=\"LoadOrderView(\'#=SalesOrderNumber#\')\" class="graybgfont">#:SalesOrderNumber#</a>',
                    title: $rootScope.resData.res_GridColumn_SalesOrderNumber, type: "string", filterable: { mode: "row", extra: false },
                    width: "120px"
                },

                {
                    field: "IsRPMPresent",
                    template: "#if(IsRPMPresent === '1') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else if(IsRPMPresent === '0') {#<span class='redbgfont'><i class='fa fa-times'></i></span>#}#",
                    "title": "RPM",
                    type: "string",
                    filterable: {
                        cell: { showOperators: false, template: $scope.IsRPMPresentFilter },
                        ui: $scope.IsRPMPresentFilter, mode: "row", extra: false, operators: {
                            string: {
                                eq: "Is equal to",
                            }
                        }
                    }, width: "100px"
                },

                { field: "AssociatedOrder", "title": $rootScope.resData.res_GridColumn_AssociatedOrder, type: "string", filterable: { mode: "row", extra: false }, width: "200px" },


                {
                    field: "BranchPlantName", title: $rootScope.resData.res_GridColumn_BranchPlantName, type: "string", filterable: { mode: "row", extra: false }, width: "200px"
                },

                { field: "CompanyNameValue", title: $rootScope.resData.res_GridColumn_CompanyNameValue, type: "string", filterable: { mode: "row", extra: false }, width: "150px" },


                {
                    field: "DeliveryLocation", title: $rootScope.resData.res_GridColumn_DeliveryLocation, type: "string", filterable: { mode: "row", extra: false }, width: "100px"
                },




                //{
                //    field: "PlateNumber", template: "<input type=\"text\" ng-model=\"dataItem.PlateNumber\" />", width: "175px",
                //    "title": $rootScope.resData.res_GridColumn_PlateNumber
                //},





                {
                    field: "DeliveryPersonnelId",
                    template: "<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.DeliveryPersonnelId\"   ng-options=\"obj.DeliveryPersonnelId as obj.Name for obj in DriverList\"><option value=\"\">Select</option></select>", "title": "Driver",
                    filterable: { mode: "row", extra: false },
                    type: "string",
                    width: "175px"
                },


                {
                    field: "PlateNumber",
                    template: "<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.PlateNumber\"   ng-options=\"obj.TransporterVehicleRegistrationNumber as obj.TransporterVehicleRegistrationNumber for obj in PlateNumberList\"><option value=\"\">Select</option></select>",
                    "title": $rootScope.resData.res_GridColumn_PlateNumber,
                    filterable: { mode: "row", extra: false },
                    type: "string",
                    width: "175px"
                },

                {
                    field: "PraposedTimeOfAction",
                    template: "<div class=\"prepend-icon\"><input type=\"text\" Id=\"{{dataItem.OrderId}}\" readonly=\"readonly\" ng-model='dataItem.PraposedTimeOfAction'   name=\"datepicker\" class=\"form-control\"  placeholder=\"Select a date...\"><i class=\"icon-calendar\"></i></div>",
                    "title": "Pickup Date",
                    format: "{0:dd/MM/yyyy}", width: "175px"
                },

                {
                    field: "PraposedShift",
                    template: "<select class=\"form-control\" style=\"margin:0px !important\" ng-disabled=\"true\"  ng-model=\"dataItem.PraposedShift\"  ng-options=\"obj.LookUpId as obj.Name for obj in ShiftList\"><option value=\"\">Select</option></select>",
                    title: "Pick Shift",
                    width: "175px",
                },


                {
                    field: "ExpectedTimeOfAction",
                    template: "<div class=\"prepend-icon\"><input type=\"text\" Id=\"Pickup{{dataItem.OrderId}}\" ng-model='dataItem.ExpectedTimeOfAction' name=\"datepicker\" class=\"PickupDate form-control\"  placeholder=\"Select a date...\"><i class=\"icon-calendar\"></i></div>",
                    "title": "Confirmed Pickup Date",
                    format: "{0:dd/MM/yyyy}", width: "175px"
                },

                {
                    field: "ExpectedShift",
                    template: "<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.ExpectedShift\" ng-change=\"getSelectedPickShiftvalue(dataItem.ExpectedShift,#=OrderId#)\"  ng-options=\"obj.LookUpId as obj.Name for obj in ShiftList\"><option value=\"\">Select</option></select>",
                    title: "Confirmed Pick Shift",
                    width: "175px",
                },


                {
                    field: "TruckSize", title: $rootScope.resData.res_GridColumn_TruckSize, type: "string", filterable: { mode: "row", extra: false }, width: "100px"
                },
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

                { title: "Plate Number Update", template: "<a class=\"greenbgfont approvebtn\" ng-if=\"dataItem.CurrentState !== '1104' && dataItem.CurrentState !== '1105'\" ng-click=\"ClickToUpdateStatusAndPlateNumber('#=SalesOrderNumber#',dataItem.PlateNumber,#=CurrentState#)\">  Update </a>", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } }, width: "150px" },



            ],
        }


    $scope.toggleSelectAll = function (ev) {
        
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();


        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === item.SalesOrderNumber; });
            if (data.length > 0) {
                data[0].selected = ev.target.checked;

            }
            item.selected = ev.target.checked;
        });
    };


    $scope.LoadOrderView = function (salesOrderNumber) {
        
        $rootScope.SalesOrderNumber = salesOrderNumber;

        $state.go("CreateInquiryForSLM");
    }


    //$scope.onCheckBoxClick = function (ev, item) {
    //    
    //    var data = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === item.SalesOrderNumber; });
    //    if (data.length > 0) {
    //        data[0].selected = ev.target.checked;

    //    }
    //    item.selected = ev.target.checked;
    //}



    $scope.toggleSelectAll = function (ev) {
        
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();
        items.forEach(function (item) {

            var data = $scope.GridData.data.filter(function (el) { return el.OrderId === item.OrderId });
            if (data.length > 0) {
                data[0].selected = ev.target.checked;
                item.selected = ev.target.checked;
            }

            var element = $(ev.currentTarget);
            var row = element.closest("tr");
            if (item.selected) {
                row.addClass("k-state-selected");
            } else {
                row.removeClass("k-state-selected");
            }
        });
    };

    $scope.onCheckBoxClick = function (ev, item) {

        
        var data = $scope.GridData.data.filter(function (el) { return el.OrderId === item.OrderId; });
        if (data.length > 0) {
            data[0].selected = ev.target.checked;
        }

        //$rootScope.ObjectId = item.EnquiryId;
        //$rootScope.ObjectType = 'Enquiry';

        item.selected = ev.target.checked;

        var element = $(ev.currentTarget);
        var row = element.closest("tr");
        if (item.selected) {
            row.addClass("k-state-selected");
        } else {
            row.removeClass("k-state-selected");
        }
    }

    function gridDataBound(e) {
        var grid = e.sender;
        pluginsService.init();

        setTimeout(function () {
            var data = $scope.GridData.data;
            for (var i = 0; i < data.length; i++) {
                var Id = data[i].OrderId;
                $scope.GetScheduleDate(Id, "", "");
                $scope.GetPickUpDate();
            }
        }, 200);


        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td class="no-data">No records to display</td></tr><table></div>');
        }
    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.CarrierGridId.dataSource.transport.read($scope.values);
        }
    };

    $rootScope.GridRecallForStatus = function () {
        
        $rootScope.Throbber.Visible = true;
        ChangeGridHeaderTitleByLanguage($scope.CarrierGridId, "CarrierGridId", $rootScope.resData);
        gridCallBack();
        $scope.statusFilter($scope.StatusFilterEelement);
    }



    $scope.ClickToUpdateStatusAndPlateNumber = function (soNumber, plateNumber, currentState) {
        
        var IsCheckPlateNumber = true;
        var plateDetails = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === soNumber; });
        //if (plateNumber != undefined) {
        var gridDataArray = $('#CarrierGridId').data('kendoGrid')._data;
        var columnDataVector = [];
        var columnName = 'PlateNumber'; var ExpectedTimeOfAction = 'ExpectedTimeOfAction';
        var ExpectedShift = 'ExpectedShift';

        var DeliveryPersonnelId = 'DeliveryPersonnelId';

        for (var index = 0; index < gridDataArray.length; index++) {

            var columnValue = gridDataArray[index][columnName];
            var ExpectedTimeOfActionValue = gridDataArray[index][ExpectedTimeOfAction];
            var ExpectedShiftValue = gridDataArray[index][ExpectedShift];

            var DeliveryPersonnelIdValue = gridDataArray[index][DeliveryPersonnelId];


            var plateNumberGrid = plateDetails.filter(function (el) { return el.SalesOrderNumber === gridDataArray[index]["SalesOrderNumber"]; });
            if (plateNumberGrid.length > 0) {
                plateNumberGrid[0].PlateNumber = columnValue;
                plateNumberGrid[0].PickingDate = ExpectedTimeOfActionValue;
                plateNumberGrid[0].pickingShift = ExpectedShiftValue;
                plateNumberGrid[0].DeliveryPersonnelId = DeliveryPersonnelIdValue;
                plateNumberGrid[0].CarrierId = $rootScope.UserId;
                plateNumberGrid[0].LocationType = 1;
                plateNumberGrid[0].UserId = $rootScope.UserId;
                plateNumberGrid[0].PlateNumberBy = "Carrier";

                if (columnValue === "" || columnValue === null) {
                    IsCheckPlateNumber = false;
                }
            }
        };


        if (plateDetails[0].PlateNumber === "" || plateDetails[0].PlateNumber === undefined || plateDetails[0].PlateNumber === null) {
            $rootScope.Throbber.Visible = false;
            //$rootScope.ValidationErrorAlert('Plate number cannot be blank.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_PlateNumberCannotBlank), '', 3000);


        }
        else if (plateDetails[0].DeliveryPersonnelId === "" || plateDetails[0].DeliveryPersonnelId === "0" || plateDetails[0].DeliveryPersonnelId === undefined || plateDetails[0].DeliveryPersonnelId === null) {
            $rootScope.Throbber.Visible = false;
            //$rootScope.ValidationErrorAlert('Plate number cannot be blank.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_PleaseSelectDriver), '', 3000);


        }
        else {

            var requestData =
                {
                    ServicesAction: 'UpdatePickingDate',
                    //SalesOrderNumber: soNumber,
                    //PlateNumber: plateNumber,
                    //LocationType: 2,
                    PlateDetailsList: plateDetails

                };
            //var stringfyjson = JSON.stringify(requestData);
            var jsonobject = {};
            jsonobject.Json = requestData;

            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                //$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_RecordSaved), '', 3000);

                gridCallBack();
            });
        }


    }


    $scope.GetSoDetails = function (ordertype) {
        $rootScope.Throbber.Visible = true;
        $scope.OrderType = ordertype;
        gridCallBack();

    }

    $scope.GetSTDetails = function (ordertype) {
        $rootScope.Throbber.Visible = true;
        $scope.OrderType = ordertype;
        gridCallBack();

    }

    $scope.ViewUserDetails = function () {
        
        $state.go("UserPageDetails");
    }



    $scope.GridDataExportToExcel = function () {
        
        ExportDataInExcel($scope.ServiceActionParameter, GrRequestService, $rootScope, $scope);
    }

    $scope.SelectedDriver = {
        DriverForSelectedOrder: ''
    }

    $ionicModal.fromTemplateUrl('templates/ChangeDriver.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        $scope.ChangeDriverCodePopup = modal;
    });
    $scope.OpenChangeDriverPopup = function () {
        
        $scope.ShowBulkChangePickupDateAndShift = true;
        $rootScope.Throbber.Visible = false;
    }
    $scope.ClosChangeDriverPopup = function () {
        
        $scope.ShowBulkChangePickupDateAndShift = false;
        //$scope.ChangeDriverCodePopup.hide();
    }
    $scope.ChangeAllOrderDriver = function () {
        
        $rootScope.Throbber.Visible = true;
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (enquiryDetails.length > 0) {
            $rootScope.Throbber.Visible = false;
            $scope.OpenChangeDriverPopup();
            $scope.PickupDateForBulkOrders();
            $scope.ClearPopupControls();
        } else {
            $rootScope.Throbber.Visible = false;
            //$rootScope.ValidationErrorAlert('Please select enquiry.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_SelectOrder), 'error', 3000);

        }
    }



    $scope.SaveDriverForSelectedEnquiry = function () {
        
        $rootScope.Throbber.Visible = true;
        var SelectedOrderId = "";
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (enquiryDetails.length > 0) {
            for (var i = 0; i < enquiryDetails.length; i++) {
                enquiryDetails[i].DriverId = $scope.SelectedDriver.DriverForSelectedOrder;
                enquiryDetails[i].PlateNumber = $scope.SelectedDriver.PlateNumberForSelectedOrder;
                enquiryDetails[i].pickingShift = $scope.SelectedDriver.PickShiftForSelectedOrder;
                enquiryDetails[i].PickingDate = $scope.SelectedDriver.ExpectedTimeOfAction;
            }
            //SelectedOrderId = SelectedOrderId.substr(1);
            //if (SelectedOrderId !== "") {
            
            //var enquiryList = {
            //    DriverId: $scope.SelectedDriver.DriverForSelectedOrder,
            //    OrderId: SelectedOrderId,
            //}
            var requestData =
                {
                    ServicesAction: 'UpdateDriverForSelectedOrder',
                    OrderDetailList: enquiryDetails


                };
            var consolidateApiParamater =
                {
                    Json: requestData,
                };
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                $scope.ClosChangeDriverPopup();
                $rootScope.Throbber.Visible = false;
                // $rootScope.ValidationErrorAlert('Branch Plant updated successfully.', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_RecordSaved), '', 3000);

                gridCallBack();
            });
            // }
        }
    }



    $scope.ClearPopupControls = function () {
        $scope.SelectedDriver.DriverForSelectedOrder = "";
        $scope.SelectedDriver.PlateNumberForSelectedOrder = "";
        $scope.SelectedDriver.PickShiftForSelectedOrder = "";
        $scope.SelectedDriver.ExpectedTimeOfAction = "";
    }


    $ionicModal.fromTemplateUrl('templates/reasoncodepopup.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.reasoncodepopup = modal;
    });



    $scope.UpdateCondirmedPickDateOnChange = function (orderId, ConfirmedPickDate) {
        
        $scope.UpdateName = "ConfirmedPickDate";
        $scope.UpdateOrderId = orderId;
        $scope.UpdateConfirmedPickDate = ConfirmedPickDate;
        var orderDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.OrderId) === parseInt(orderId); });
        $scope.OpenReasoncodepopup(orderDetails);

    }


    $scope.getSelectedPickShiftvalue = function (pickShiftId, orderId) {
        
        $scope.UpdateName = "PickShift";
        $scope.UpdateOrderId = orderId;
        $scope.UpdatePickShiftId = pickShiftId;
        $scope.OpenReasoncodepopup(orderId);

    }


    $scope.OpenReasoncodepopup = function (orderDetails) {

        $rootScope.ReasonCodeOrderDetails = orderDetails;
        $scope.reasoncodepopup.show();
        $rootScope.Throbber.Visible = false;
    }

    $scope.ClosReasoncodepopup = function () {

        $rootScope.ReasonCodeEnquiryId = 0;
        $scope.ReasonCodeJson.ReasonCode = "";
        $scope.ReasonCodeJson.ReasonDescription = "";
        $scope.reasoncodepopup.hide();
    }


    $scope.ReasonCodeJson = {
        ReasonCode: '',
        ReasonDescription: ''
    }

    $scope.SaveReasonCode = function () {

        if ($scope.ReasonCodeJson.ReasonCode !== "") {
            $rootScope.Throbber.Visible = true;
            $scope.SaveReasonCodeList();
        }
        else {
            //$rootScope.ValidationErrorAlert('Please select reason code.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectReasonCode), 'error', 3000);

        }

    }



    $scope.SaveReasonCodeList = function () {


        var reasonCode = {
            ReasonCodeId: $scope.ReasonCodeJson.ReasonCode,
            ReasonDescription: $scope.ReasonCodeJson.ReasonDescription,
            ObjectId: $rootScope.ReasonCodeEnquiryId,
            ObjectType: 'Enquiry'

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

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


            if ($scope.UpdateName === "ConfirmedPickDate") {
                $scope.UpdateConfirmedPickupDate();
            }
            else if ($scope.UpdateName === "PickShift") {
                $scope.UpdateConfirmedPickupShift();
            }
            $rootScope.Throbber.Visible = false;
            $scope.UpdateName = "";
            $scope.ReasonCodeJson.ReasonCode = "";
            $scope.ReasonCodeJson.ReasonDescription = "";
            $scope.ClosReasoncodepopup();
        });
    }


    $scope.UpdateConfirmedPickupDate = function () {
        var enquiryList = {
            PickupDate: $scope.UpdateConfirmedPickDate,
            OrderId: $scope.UpdateOrderId,
        }
        var requestData =
            {
                ServicesAction: 'UpdateConfirmedPickupDate',
                OrderDetailList: enquiryList

            };
        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            // $rootScope.ValidationErrorAlert('Promised date updated successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_ConfirmedPickupDate), '', 3000);
            gridCallBack();
        });
    }



    $scope.UpdateConfirmedPickupShift = function () {
        var enquiryList = {
            PickupShift: $scope.UpdatePickShiftId,
            OrderId: $scope.UpdateOrderId,
        }
        var requestData =
            {
                ServicesAction: 'UpdateConfirmedPickupShift',
                OrderDetailList: enquiryList

            };
        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            // $rootScope.ValidationErrorAlert('Promised date updated successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_ConfirmedPickupShift), '', 3000);
            gridCallBack();
        });
    }



    $scope.PickupDateForBulkOrders = function () {
        
        setTimeout(function () {
            
            $('.PickupDateControl').each(function () {
                
                $(this).datepicker({
                    onSelect: function (dateText, inst) {
                        
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


});