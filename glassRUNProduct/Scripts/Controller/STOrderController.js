angular.module("glassRUNProduct").controller('STOrderController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {
    

    $scope.OrderType = "SO";

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

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



    $scope.FeedbackVariable = {
        OverAll: true,
        Specific: false
    }
    $scope.STOrderViewId
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
                            }

                        }

                        
                        var requestData =
                            {
                                ServicesAction: 'LoadSTOrderDetails',
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
                                UserId: $rootScope.CompanyId

                            };


                        // var stringfyjson = JSON.stringify(requestData);
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

                { field: "AssociatedOrder", "title": $rootScope.resData.res_GridColumn_AssociatedOrder, type: "string", filterable: { mode: "row", extra: false }, width: "200px" },

                {
                    field: "CompanyNameValue", title: $rootScope.resData.res_GridColumn_CompanyNameValue, type: "string", filterable: { mode: "row", extra: false }, width: "150px" },
                
                { field: "BranchPlantName", title: $rootScope.resData.res_GridColumn_BranchPlantName, type: "string", filterable: { mode: "row", extra: false }, width: "100px" },
                { field: "DeliveryLocation", title: $rootScope.resData.res_GridColumn_DeliveryLocation, type: "string", filterable: { mode: "row", extra: false }, width: "100px" },

                { field: "TruckSize", title: $rootScope.resData.res_GridColumn_TruckSize, type: "string", filterable: { mode: "row", extra: false }, width: "100px" },
                

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


    $scope.onCheckBoxClick = function (ev, item) {
        
        var data = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === item.SalesOrderNumber; });
        if (data.length > 0) {
            data[0].selected = ev.target.checked;

        }
        item.selected = ev.target.checked;
    }


    function gridDataBound(e) {
        var grid = e.sender;
        pluginsService.init();

        setTimeout(function () {
            var data = $scope.GridData.data;
            for (var i = 0; i < data.length; i++) {
                var Id = data[i].OrderId;
                $scope.GetScheduleDate(Id, "", "");
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
            $scope.STOrderViewId.dataSource.transport.read($scope.values);
        }
    };

    $rootScope.GridRecallForStatus = function () {
        
        $rootScope.Throbber.Visible = true;
        ChangeGridHeaderTitleByLanguage($scope.STOrderViewId, "STOrderViewId", $rootScope.resData);
        gridCallBack();
        $scope.statusFilter($scope.StatusFilterEelement);
    }



    $scope.ClickToUpdateStatusAndPlateNumber = function (soNumber, plateNumber, currentState) {
        
        var IsCheckPlateNumber = true;
        var plateDetails = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === soNumber; });
        //if (plateNumber != undefined) {
        var gridDataArray = $('#CarrierGridId').data('kendoGrid')._data;
        var columnDataVector = [];
        var columnName = 'PlateNumber';
        for (var index = 0; index < gridDataArray.length; index++) {
            var columnValue = gridDataArray[index][columnName];
            var plateNumberGrid = plateDetails.filter(function (el) { return el.SalesOrderNumber === gridDataArray[index]["SalesOrderNumber"]; });
            if (plateNumberGrid.length > 0) {
                plateNumberGrid[0].PlateNumber = columnValue;
                plateNumberGrid[0].LocationType = 1;
                plateNumberGrid[0].UserId = $rootScope.UserId;
                if (columnValue === "" || columnValue === null) {
                    IsCheckPlateNumber = false;
                }
            }
        };


        if (plateDetails[0].PlateNumber === "" || plateDetails[0].PlateNumber === undefined) {
            $rootScope.Throbber.Visible = false;
            //$rootScope.ValidationErrorAlert('Plate number cannot be blank.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_PlateNumberCannotBlank), '', 3000);


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
        $scope.OrderType = ordertype;
        gridCallBack();

    }

    $scope.GetSTDetails = function (ordertype) {
        $scope.OrderType = ordertype;
        gridCallBack();

    }

    $scope.ViewUserDetails = function () {
        
        $state.go("UserPageDetails");
    }


});