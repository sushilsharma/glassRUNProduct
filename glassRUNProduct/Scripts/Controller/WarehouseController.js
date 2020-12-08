angular.module("glassRUNProduct").controller('WarehouseController', function ($scope, $rootScope, $sessionStorage, $state, $location, $ionicModal, pluginsService, GrRequestService) {
    

    LoadActiveVariables($sessionStorage, $state, $rootScope);


    $scope.FeedbackVariable = {
        OverAll: true,
        Specific: false
    }
    $scope.OrderDetailsGrid =
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
                        var SoldTo = "";
                        var SoldToCriteria = "";
                        var ShipTo = "";
                        var ShipToCriteria = "";
                        var TruckSize = "";
                        var TruckSizeCriteria = "";
                        var Carrier = "";
                        var CarrierCriteria = "";
                        var BranchPlant = "";
                        var BranchPlantCriteria = "";

                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };

                            if (options.data.filter.filters[0].field === "SalesOrderNumber") {
                                SalesOrderNumber = options.data.filter.filters[0].value;
                                SalesOrderNumberCriteria = options.data.filter.filters[0].operator;
                            }
                            if (options.data.filter.filters[0].field === "SoldTo") {
                                SoldTo = options.data.filter.filters[0].value;
                                SoldToCriteria = options.data.filter.filters[0].operator;
                            }
                            if (options.data.filter.filters[0].field === "ShipTo") {
                                ShipTo = options.data.filter.filters[0].value;
                                ShipToCriteria = options.data.filter.filters[0].operator;
                            }
                            if (options.data.filter.filters[0].field === "TruckSize") {
                                TruckSize = options.data.filter.filters[0].value;
                                TruckSizeCriteria = options.data.filter.filters[0].operator;
                            }
                            if (options.data.filter.filters[0].field === "CarrierNumber") {
                                Carrier = options.data.filter.filters[0].value;
                                CarrierCriteria = options.data.filter.filters[0].operator;
                            }
                            if (options.data.filter.filters[0].field === "BranchPlant") {
                                BranchPlant = options.data.filter.filters[0].value;
                                BranchPlantCriteria = options.data.filter.filters[0].operator;
                            }

                        }

                        
                        var requestData =
                            {
                                ServicesAction: 'LoadSoNumberWiseDetails',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                SalesOrderNumber: SalesOrderNumber,
                                SalesOrderNumberCriteria: SalesOrderNumberCriteria,
                                SoldTo: SoldTo,
                                SoldToCriteria: SoldToCriteria,
                                ShipTo: ShipTo,
                                ShipToCriteria: ShipToCriteria,
                                TruckSize: TruckSize,
                                TruckSizeCriteria: TruckSizeCriteria,
                                Carrier: Carrier,
                                CarrierCriteria: CarrierCriteria,
                                BranchPlant: BranchPlant,
                                BranchPlantCriteria: BranchPlantCriteria,
                                LoginId: $rootScope.UserId

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
                                            angular.forEach(resoponsedata.Json.OrderList, function (item) {
                                                
                                                if (item.PickingDate !== undefined) {
                                                    var tempdate = item.PickingDate.split('T');
                                                    if (tempdate.length > 1) {
                                                        
                                                        var date = tempdate[0].split('-');
                                                        var time = tempdate[1].split(':');
                                                        var sec = time[2].split('.');
                                                        date = date[2] + '/' + date[1] + '/' + date[0] + " " + time[0] + ":" + time[1];
                                                        item.PickingDate = date;
                                                    }
                                                }

                                                if (item.OrderDate !== undefined) {
                                                    var tempdateOrderDate = item.OrderDate.split('T');
                                                    if (tempdateOrderDate.length > 1) {
                                                        
                                                        var dateOrderDate = tempdateOrderDate[0].split('-');
                                                        var timedateOrderDate = tempdateOrderDate[1].split(':');
                                                        var sec1 = timedateOrderDate[2].split('.');
                                                        dateOrderDate = dateOrderDate[2] + '/' + dateOrderDate[1] + '/' + dateOrderDate[0] + " " + timedateOrderDate[0] + ":" + timedateOrderDate[1];
                                                        item.OrderDate = dateOrderDate;
                                                    }
                                                }

                                            });
                                            totalcount = resoponsedata.Json.OrderList[0].TotalCount
                                        }

                                    } else {
                                        if (resoponsedata.Json.OrderList.PickingDate !== undefined) {
                                            var tempdate = resoponsedata.Json.OrderList.PickingDate.split('T');
                                            if (tempdate !== null && tempdate !== undefined) {
                                                
                                                var date = tempdate[0].split('-');
                                                var time = tempdate[1].split(':');
                                                var sec = time[2].split('.');
                                                date = date[2] + '/' + date[1] + '/' + date[0] + " " + time[0] + ":" + time[1];
                                                tempdate.PickingDate = date;
                                            }
                                        }

                                        totalcount = resoponsedata.Json.OrderList.TotalCount;
                                    }

                                    ListData = resoponsedata.Json.OrderList;

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
                    title: "<input type='checkbox' title='Select all'  ng-click='toggleSelectAll($event)' />",
                    width: "30px"
                },

                {
                    field: "SalesOrderNumber", title: "SO #", template: '<a ng-click=\"LoadOrderView(\'#=SalesOrderNumber#\')\" class="graybgfont">#:SalesOrderNumber#</a>', type: "string",
                    filterable: { mode: "row" }, width: "120px"
                },

                { field: "CarrierNumber", title: "Carrier", type: "string", filterable: { mode: "row", extra: false }, width: "120px"},
                { field: "BranchPlant", title: "Branch Plant", type: "string", filterable: { mode: "row", extra: false }, width: "120px"},
                { field: "DeliveryLocation", title: "ShipTo", type: "string", filterable: { mode: "row", extra: false }, width: "180px" },
                { field: "TruckSizeValue", title: "TruckSize", type: "string", filterable: { mode: "row", extra: false }, width: "120px" }, 
                {
                    field: "ReceivedCapacityPalettes", title: "C", template: "<div ng-class=\"{'fontred' : dataItem.ReceivedCapacityPalettes < 0 }\">#=ReceivedCapacityPalettes#</div>", "text-align": "center", type: "string",
                    filterable: false, width: "75px"
                },
              //  { field: "Capacity", title: "C", template: "#if(Capacity == '1') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else{#<span class='redbgfont'><i class='fa fa-times'></i></span>#}#", "text-align": "center", type: "string", filterable: false, width: "4%" },
                //{ field: "ExpectedTimeOfDelivery", title: "ETD", type: "string", filterable: { mode: "row", extra: false } },
                { field: "OrderDate", title: "Order Date", type: "string", filterable: { mode: "row", extra: false }, width: "175px"},



                { field: "PraposedTimeOfAction", title: "Pick-up Date", type: "string", filterable: { mode: "row", extra: false }, width: "175px" },

                { field: "PraposedShift", title: "Pick Shift", type: "string", filterable: { mode: "row", extra: false }, width: "175px" },

                { field: "ExpectedTimeOfAction", title: "Expected Time Of Action", type: "string", filterable: { mode: "row", extra: false }, width: "175px" },

                { field: "ExpectedShift", title: "Expected Shift", type: "string", filterable: { mode: "row", extra: false }, width: "175px" },

             
                { field: "AssociatedOrder", "title": "Gratis #", type: "string", filterable: { mode: "row", extra: false }, width: "200px" },
                { field: "PlateNumber", "title": "Plate #", type: "string", filterable: { mode: "row", extra: false }, width: "200px"},
                { field: "Status", "title": "Status", type: "string", filterable: { mode: "row", extra: false }, width: "175px"},
                //{ "template": "<a class=\"greenbgfont approvebtn\" ng-click=\"UpdatePickingDate('#=SalesOrderNumber#',dataItem.PickingDate)\"> Save </a>", "title": "Confirm Picking" },
                //{ title: "Save", template: "#if(CurrentState == 3) {#<a class=\"greenbgfont approvebtn\" ng-click=\"UpdatePickingDate('#=SalesOrderNumber#',dataItem.PickingDate)\"> Save </a>#} else {#<a class=\"greenbgfont approvebtn\" ng-click=\"UpdatePickingDate('#=SalesOrderNumber#',dataItem.PickingDate)\">  Update </a>#}#", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } }, width: "120px" },

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
        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td class="no-data">No records to display</td></tr><table></div>');
        }
    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.OrderDetailsGrid.dataSource.transport.read($scope.values);
        }
    };


    $scope.UpdatePickingDate = function (soNumber, pickingDate, currentState) {
        
        var wareHouseDetails = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === soNumber; });

        //if (pickingDate != undefined) {
        var gridDataArray = $('#OrderDetailsGridId').data('kendoGrid')._data;
        var columnDataVector = [];
        var columnName = 'PickingDate';
        for (var index = 0; index < gridDataArray.length; index++) {
            var columnValue = gridDataArray[index][columnName];
            var plateNumberGrid = wareHouseDetails.filter(function (el) { return el.SalesOrderNumber === gridDataArray[index]["SalesOrderNumber"]; });
            if (plateNumberGrid.length > 0) {
                plateNumberGrid[0].PickingDate = columnValue;
                plateNumberGrid[0].LocationType = 1;
            }
        };
        var requestData =
            {
                ServicesAction: 'InsertPickingDate',
                //SalesOrderNumber: soNumber,
                //PickingDate: pickingDate,
                WareHouseDetailList: wareHouseDetails

            };
        // var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
            gridCallBack();
        });


        //}
        //else {
        //    $rootScope.ValidationErrorAlert('Please select pick up date.', 'error', 3000);
        //}
    }



    $scope.GetAllRecordUpdate = function () {
        

        var plateDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (plateDetails.length > 0) {
            var gridDataArray = $('#OrderDetailsGridId').data('kendoGrid')._data;
            var columnDataVector = [];
            var columnName = 'PickingDate';
            for (var index = 0; index < gridDataArray.length; index++) {
                var columnValue = gridDataArray[index][columnName];
                var plateNumberGrid = plateDetails.filter(function (el) { return el.SalesOrderNumber === gridDataArray[index]["SalesOrderNumber"]; });
                if (plateNumberGrid.length > 0) {
                    plateNumberGrid[0].PickingDate = columnValue;
                    plateNumberGrid[0].LocationType = 1;
                }
            };
            var requestData =
                {
                    ServicesAction: 'InsertPickingDate',
                    //SalesOrderNumber: soNumber,
                    //PlateNumber: plateNumber,
                    //LocationType: 2,
                    WareHouseDetailList: plateDetails
                };
            // var stringfyjson = JSON.stringify(requestData);
            var jsonobject = {};
            jsonobject.Json = requestData;

            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                gridCallBack();
            });

        }
        else {
            $rootScope.ValidationErrorAlert('Please select sonumber.', 'error', 3000);
        }
    }




});