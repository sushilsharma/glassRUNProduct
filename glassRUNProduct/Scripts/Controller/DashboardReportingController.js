angular.module("glassRUNProduct").controller('DashboardReportingController', function ($scope, $rootScope, $location, $sessionStorage, $state, $filter, pluginsService, GrRequestService) {
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    //$scope.FromDate = "23/03/2017";
    //$scope.ToDate = "29/03/2018";
    $scope.bindallShipTo = [];
    $scope.ShipToSelectedList = [];

    $scope.MultiSelectDropdownSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }

    $scope.DashboarReportJson = {
        FromDate: '',
        ToDate: ''
    }

    $scope.LoadAllShipToList = function () {
        debugger;
        var requestData =
            {
                ServicesAction: 'GetAllShipTOList',
                CompanyId: $rootScope.CompanyId

            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data;
            $scope.bindallShipToList = resoponsedata.Json.DeliveryLocationList;

        });
    }
    //$scope.LoadAllShipToList();
    //$scope.LoadItemListByUser();
    pluginsService.init();



    $scope.DashboarReportingGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) {
                        debugger;
                        var SalesOrderNumber = "";
                        var SalesOrderNumberCriteria = "";

                        var Carrier = "";
                        var CarrierCriteria = "";

                        var Customer = "";
                        var CustomerCriteria = "";

                        var BranchPlant = "";
                        var BranchPlantCriteria = "";

                        var Area = "";
                        var AreaCriteria = "";

                        var ItemName = "";
                        var ItemNameCriteria = "";

                        var Driver = "";
                        var DriverCriteria = "";

                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };


                            for (var i = 0; i < options.data.filter.filters.length; i++) {
                                if (options.data.filter.filters[i].field === "SalesOrderNumber" || options.data.filter.filters[i].field === "SOGratisNumber") {
                                    SalesOrderNumber = options.data.filter.filters[i].value;
                                    SalesOrderNumberCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "Carrier") {
                                    Carrier = options.data.filter.filters[i].value;
                                    CarrierCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "Customer") {
                                    Customer = options.data.filter.filters[i].value;
                                    CustomerCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "BranchPlant") {
                                    BranchPlant = options.data.filter.filters[i].value;
                                    BranchPlantCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "Area") {
                                    Area = options.data.filter.filters[i].value;
                                    AreaCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "ItemName") {
                                    ItemName = options.data.filter.filters[i].value;
                                    ItemNameCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "DriverName") {
                                    Driver = options.data.filter.filters[i].value;
                                    DriverCriteria = options.data.filter.filters[i].operator;

                                }
                            }

                            debugger;


                        }

                        debugger;
                        var requestData =
                            {
                                ServicesAction: 'GetAllCFRDashboarReportingDetails',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                FromDate: $scope.DashboarReportJson.FromDate,
                                ToDate: $scope.DashboarReportJson.ToDate,
                                ShipTo: $scope.ShipToId,
                                SalesOrderNumber: SalesOrderNumber,
                                SalesOrderNumberCriteria: SalesOrderNumberCriteria,
                                Carrier: Carrier,
                                CarrierCriteria: CarrierCriteria,
                                Customer: Customer,
                                CustomerCriteria: CustomerCriteria,
                                BranchPlant: BranchPlant,
                                BranchPlantCriteria: BranchPlantCriteria,
                                Area: Area,
                                AreaCriteria: AreaCriteria,
                                ItemName: ItemName,
                                ItemNameCriteria: ItemNameCriteria,
                                Driver: Driver,
                                DriverCriteria: DriverCriteria
                            };

                        // var stringfyjson = JSON.stringify(requestData);
                        var consolidateApiParamater =
                            {
                                Json: requestData

                            };

                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            debugger;


                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;
                            if (resoponsedata !== null) {
                                debugger;
                                if (resoponsedata.Json != undefined) {
                                    if (resoponsedata.Json.OrderList.length !== undefined) {
                                        if (resoponsedata.Json.OrderList.length > 0) {

                                            totalcount = resoponsedata.Json.OrderList[0].TotalCount
                                        }

                                    } else {

                                        totalcount = resoponsedata.Json.OrderList.TotalCount;
                                    }

                                    ListData = resoponsedata.Json.OrderList;
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
                { field: "BranchPlant", title: $rootScope.resData.res_CustomerFeedbackReport_BranchPlant, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },
                { field: "Area", title: $rootScope.resData.res_CustomerFeedbackReport_Area, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },
                { field: "Customer", title: $rootScope.resData.res_CustomerFeedbackReport_Customer, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },
                { field: "Carrier", title: $rootScope.resData.res_CustomerFeedbackReport_Carrier, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },
                { field: "DriverName", title: $rootScope.resData.res_CustomerFeedbackReport_DriverName, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },
                { field: "SalesOrderNumber", title: $rootScope.resData.res_CustomerFeedbackReport_SalesOrderNumber, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },
                { field: "ItemName", title: $rootScope.resData.res_CustomerFeedbackReport_ItemName, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },
                //{ field: "ProductCode", title: 'ProductCode', type: "string", filterable: { mode: "row", extra: false } },
                //{ field: "ProductQuantity", title: 'Order Quantity', type: "string", filterable: { mode: "row", extra: false }, width: "120px" },
                //{ field: "RevisedQuantity", title: 'Revised Quantity', type: "string", filterable: { mode: "row", extra: false }, width: "120px" },
                //{ field: "CasesnotAvailable", title: 'Cases Not Available', type: "string", filterable: { mode: "row", extra: false }, width: "120px" },
                {
                    field: "OrderDate", "title": $rootScope.resData.res_GridColumn_OrderDate, type: "date",
                    filterable: false
                    , parseFormats: "{0:dd/MM/yyyy HH:mm}", format: "{0:dd/MM/yyyy HH:mm}", width: "175px"
                },
                { field: "Feedback", title: $rootScope.resData.res_CustomerFeedbackReport_Feedback, type: "string", filterable: { mode: "row", extra: false } },
                {
                    field: "RequestDate", "title": $rootScope.resData.res_GridColumn_RequestDate, type: "date",
                    filterable: false
                    , parseFormats: "{0:dd/MM/yyyy}", format: "{0:dd/MM/yyyy}", width: "175px"
                },
                {
                    field: "PromisedDate", "title": $rootScope.resData.res_CustomerFeedbackReport_PromisedDate, type: "date",
                    filterable: false
                    , parseFormats: "{0:dd/MM/yyyy}", format: "{0:dd/MM/yyyy}", width: "175px"
                },
                {
                    field: "ETD", "title": $rootScope.resData.res_CustomerFeedbackReport_ETD, type: "date",
                    filterable: false
                    , parseFormats: "{0:dd/MM/yyyy}", format: "{0:dd/MM/yyyy}", width: "175px"
                },
                {
                    field: "ActualDeliveryDate", "title": $rootScope.resData.res_CustomerFeedbackReport_ActualDeliveryDate, type: "date",
                    filterable: false
                    , parseFormats: "{0:dd/MM/yyyy}", format: "{0:dd/MM/yyyy}", width: "175px"
                },

            ],
        }


    function gridDataBound(e) {
        debugger;
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
            $scope.DashboarReportingGrid.dataSource.transport.read($scope.values);
        }
    };


    $scope.DownloadDashboardReportInExcel = function () {
        debugger;


        var requestData =
            {
                ServicesAction: 'DownloadDashboardReportInCsv',
                FromDate: $scope.DashboarReportJson.FromDate,
                ToDate: $scope.DashboarReportJson.ToDate,
                ShipTo: $scope.ShipTo

            };

        var jsonobject = {};
        jsonobject.Json = requestData;

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
                    $scope.ddMMyyyy = $filter('date')(new Date(), 'ddMMyyyyhhmm');
                    var filName = "CFR_" + $scope.ddMMyyyy + ".csv";
                    saveAs(blob, filName);
                } else {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CustomerFeedbackReport_DocumentNotGenerated), '', 3000);
                }
            }
            else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CustomerFeedbackReport_DocumentNotGenerated), '', 3000);
            }
        });
    }




    $scope.SearchEnquiryByShipTo = function () {
        debugger;
        //$rootScope.Throbber.Visible = true;
        $scope.ShipToId = '';
        if ($scope.ShipToSelectedList.length > 0) {
            for (var i = 0; i < $scope.ShipToSelectedList.length; i++) {
                $scope.ShipToId = $scope.ShipToId + "," + $scope.ShipToSelectedList[i].Id;
            }
            $scope.ShipToId = $scope.ShipToId.substr(1);

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

}).filter('multipleTags', function ($filter, $rootScope) {
    return function multipleTags(items, predicates) {


        predicates = predicates.split(' ')

        angular.forEach(predicates, function (predicate) {
            items = $filter('filter')(items, { DeliveryLocationName: predicate.trim() });
        })

        if (items != undefined) {
            if (items.length === 0) {
                $rootScope.foundResult = true;
            }
            else {
                $rootScope.foundResult = false;
            }
        } else {
            $rootScope.foundResult = false;
        }

        return items;
    }

});