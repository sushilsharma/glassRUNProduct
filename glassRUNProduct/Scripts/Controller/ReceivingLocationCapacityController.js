angular.module("glassRUNProduct").controller('ReceivingLocationCapacityController', function ($scope, $rootScope, $location, $sessionStorage, $state, pluginsService, GrRequestService) {
    

    LoadActiveVariables($sessionStorage, $state, $rootScope);


    $scope.RecievingLocationCapacityGrid =
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
                        var DeliveryLocationName = "";
                        var DeliveryLocationNameCriteria = "";
                        var ShipTo = "";
                        var ShipToCriteria = "";
                        var TruckSize = "";
                        var TruckSizeCriteria = "";
                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };
                            
                            if (options.data.filter.filters[0].field === "DeliveryLocationCode") {
                                ShipTo = options.data.filter.filters[0].value;
                                ShipToCriteria = options.data.filter.filters[0].operator;
                            }

                            if (options.data.filter.filters[0].field === "DeliveryLocationName") {
                                DeliveryLocationName = options.data.filter.filters[0].value;
                                DeliveryLocationNameCriteria = options.data.filter.filters[0].operator;
                            }

                        }

                        
                        var requestData =
                            {
                                ServicesAction: 'GetAllDeliveryLocationListPagging',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                CompanyId: $rootScope.CompanyId,
                                OrderBy: "",
                                ShipTo: ShipTo,
                                ShipToCriteria: ShipToCriteria,
                                DeliveryLocationName: DeliveryLocationName,
                                DeliveryLocationNameCriteria: DeliveryLocationNameCriteria


                            };

                        // var stringfyjson = JSON.stringify(requestData);
                        var consolidateApiParamater =
                            {
                                Json: requestData

                            };

                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            


                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;
                            if (resoponsedata !== null) {
                                
                                if (resoponsedata.Json != undefined) {
                                    if (resoponsedata.Json.DeliveryLocationList.length !== undefined) {
                                        if (resoponsedata.Json.DeliveryLocationList.length > 0) {

                                            totalcount = resoponsedata.Json.DeliveryLocationList[0].TotalCount
                                        }

                                    } else {

                                        totalcount = resoponsedata.Json.DeliveryLocationList.TotalCount;
                                    }

                                    ListData = resoponsedata.Json.DeliveryLocationList;
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
                    width: "3%"
                },
                { field: "DeliveryLocationCode", title: $rootScope.resData.res_RecievingCapacityGridColumn_DeliveryLocationCode, type: "string", filterable: { mode: "row", extra: false } },
                { field: "DeliveryLocationName", title: $rootScope.resData.res_RecievingCapacityGridColumn_DeliveryLocationName, type: "string", filterable: { mode: "row", extra: false } },
                {
                    field: "Capacity",
                    template: "<input type=\"text\" onkeypress='return event.charCode >= 48 && event.charCode <= 57' type=\"number\" ng-model=\"dataItem.Capacity\" />",
                    "title": $rootScope.resData.res_RecievingCapacityGridColumn_Capacity,
                    filterable: false
                },
                {
                    field: "Action",
                    title: $rootScope.resData.res_RecievingCapacityGridColumn_Action,
                    template: "<a class=\"greenbgfont approvebtn\" ng-click=\"ClickToUpdateCapacity('#=DeliveryLocationId#')\"> Update </a>", type: "string",
                    filterable: false,
                    width: "8%"

                },




            ],
        }

    $scope.toggleSelectAll = function (ev) {
        
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();


        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.DeliveryLocationId === item.DeliveryLocationId; });
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
        
        var data = $scope.GridData.data.filter(function (el) { return el.DeliveryLocationId === item.DeliveryLocationId; });
        if (data.length > 0) {
            data[0].selected = ev.target.checked;

        }
        item.selected = ev.target.checked;
    }

    function gridDataBound(e) {

        var grid = e.sender;
        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.RecievingLocationCapacityGrid.dataSource.transport.read($scope.values);
        }
    };


    $rootScope.GridRecallForStatus = function () {
        
        $rootScope.Throbber.Visible = true;
        ChangeGridHeaderTitleByLanguage($scope.RecievingLocationCapacityGrid, "RecievingLocationCapacityGrid", $rootScope.resData);
        gridCallBack();

    }


    $scope.ClickToUpdateCapacity = function (deliverylocationId) {
        
        var IsCheckPlateNumber = true;
        var deliverylocations = $scope.GridData.data.filter(function (el) { return parseInt(el.DeliveryLocationId) === parseInt(deliverylocationId); });
        //if (plateNumber != undefined) {
        var gridDataArray = $('#RecievingLocationCapacityGrid').data('kendoGrid')._data;
        var columnDataVector = [];
        var columnName = 'Capacity';
        for (var index = 0; index < gridDataArray.length; index++) {
            var columnValue = gridDataArray[index][columnName];
            var deliverylocationsGrid = deliverylocations.filter(function (el) { return el.DeliveryLocationId === gridDataArray[index]["DeliveryLocationId"]; });
            if (deliverylocationsGrid.length > 0) {
                deliverylocationsGrid[0].Capacity = columnValue;
                if (columnValue === "" || columnValue === null) {
                    IsCheckPlateNumber = false;
                }
            }
        };
        var requestData =
            {
                ServicesAction: 'UpdateReceivingLocationCapacity',
                //SalesOrderNumber: soNumber,
                //PlateNumber: plateNumber,
                //LocationType: 2,
                ReceivingLocationList: deliverylocations
            };
        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
            gridCallBack();
        });


    }


    $scope.GetAllRecordUpdate = function () {
        
        var IsCheckAllPlateNumber = true;
        var deliverylocations = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (deliverylocations.length > 0) {
            var gridDataArray = $('#RecievingLocationCapacityGrid').data('kendoGrid')._data;
            var columnDataVector = [];
            var columnName = 'Capacity';
            for (var index = 0; index < gridDataArray.length; index++) {
                var columnValue = gridDataArray[index][columnName];
                var deliverylocationsGrid = deliverylocations.filter(function (el) { return el.DeliveryLocationId === gridDataArray[index]["DeliveryLocationId"]; });
                if (deliverylocationsGrid.length > 0) {
                    deliverylocationsGrid[0].Capacity = columnValue;

                    if (columnValue === "" || columnValue === null) {
                        IsCheckAllPlateNumber = false;
                    }
                }
            };

            var requestData =
                {
                    ServicesAction: 'UpdateReceivingLocationCapacity',
                    //SalesOrderNumber: soNumber,
                    //PlateNumber: plateNumber,
                    //LocationType: 2,
                    ReceivingLocationList: deliverylocations
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






    $scope.ClearControls = function () {
        $scope.plateNumber = "";
    }


});