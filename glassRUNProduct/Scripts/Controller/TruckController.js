angular.module("glassRUNProduct").controller('TruckController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, GrRequestService) {
    
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.TruckSizeId = 0;
    var requestData =
        {
            ServicesAction: 'LoadTruck',
            CompanyId: $rootScope.CompanyId
        };

    // var stringfyjson = JSON.stringify(requestData);
    var jsonobject = {};
    jsonobject.Json = requestData;
    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        
        // var resoponsedata = JSON.parse(JSON.parse(response.data));
        var resoponsedata = response.data.Json.TruckList;
        $scope.bindAllTuck = resoponsedata;
        //$scope.GetCreditLimitOfCustomer();
    });



    $scope.ViewTuckGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) { //You can get the current page, pageSize etc off `e`.
                        
                        var orderby = "";
                        var config = "";
                        var viewRoleAccessDto = "";

                        var TruckSize = "";
                        var Description = "";

                        var TruckSizeCriteria = "";
                        var DescriptionCriteria = "";

                        if (options.data.sort) {
                            if (options.data.sort.length > 0) {
                                var sortField = options.data.sort[0].field;
                                if (options.data.sort[0].dir === "asc") {
                                    sortOrder = ' asc';
                                } else if (options.data.sort[0].dir === "desc") {
                                    sortOrder = ' desc';
                                };
                                orderby = sortField + sortOrder;
                            }
                        }
                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };

                            //if (options.data.filter.filters[0].field === "TruckType") {
                            //    TruckType = options.data.filter.filters[0].value;
                            //    TruckTypeCriteria = options.data.filter.filters[0].operator;
                            //}

                            if (options.data.filter.filters[0].field === "TruckSize") {
                                TruckSize = options.data.filter.filters[0].value;
                                TruckSizeCriteria = options.data.filter.filters[0].operator;
                            }
                        }
                        var requestData =
                            {
                                ServicesAction: 'LoadTruckDetails',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                TruckSize: TruckSize,
                                TruckSizeCriteria: TruckSizeCriteria

                            };


                        var consolidateApiParamater =
                            {
                                Json: requestData,

                            };


                        

                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            

                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;
                            totalcount = resoponsedata.Json.TruckList[0].TotalCount
                            ListData = resoponsedata.Json.TruckList;

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

                { field: "TruckType", title: "Vehicle Type", type: "string", filterable: { mode: "row", extra: false } },
                { field: "TruckSize", title: "Truck Size", type: "string", filterable: { mode: "row", extra: false } },
                { field: "TruckCapacityPalettes", title: "Palettes", type: "string", filterable: { mode: "row", extra: false } },
                { field: "TruckCapacityWeight", title: "Weight", type: "string", filterable: { mode: "row", extra: false } },
                { "template": "<button class=\"k-button\" ng-click=\"EditTruck(#=TruckSizeId#)\"><i class='fa fa-pencil'></i></a>", "title": "Edit", "width": "6%" },
                { "template": "<button class=\"k-button\" ng-click=\"DeleteTruck(#=TruckSizeId#)\"><i class='fa fa-trash'></i></a>", "title": "Delete", "width": "6%" }
            ],
        }
    function gridDataBound(e) {

        var grid = e.sender;
        if (grid.dataSource.total() == 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.ViewTuckGrid.dataSource.transport.read($scope.values);
        }
    };



    $scope.TruckJson = {
        TruckType: '',
        Name: '',
        Palletes: '',
        Capacity: ''
    }



    $scope.SaveTruck = function () {
        

        var truck = {
            TruckSizeId: $scope.TruckSizeId,
            VehicleType: $scope.TruckJson.TruckType,
            TruckSize: $scope.TruckJson.Name,
            TruckCapacityPalettes: $scope.TruckJson.Palletes,
            TruckCapacityWeight: $scope.TruckJson.Capacity


        }

        var truckList = [];
        truckList.push(truck);

        var requestData =
            {
                ServicesAction: 'InsertTruck',
                TruckList: truckList
            };



        var consolidateApiParamater =
            {
                Json: requestData,
            };
        
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if ($scope.TruckSizeId != 0) {
                $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
            }
            $scope.Clear();
            $scope.ViewForm();
        });
    }


    $scope.Clear = function () {
        $scope.TruckJson.TruckType = "";
        $scope.TruckJson.Name = "";
        $scope.TruckJson.Palletes = "";
        $scope.TruckJson.Capacity = "";
        $scope.TruckSizeId = 0;
    }

    $scope.AddForm = function () {
        
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
    }
    $scope.ViewForm = function () {
        
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.Clear();
        gridCallBack();
    }
    $scope.ViewForm();



    $scope.EditTruck = function (id) {
        
        var requestData =
            {
                ServicesAction: 'GetTruckDetailsById',
                TruckSizeId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data.Json.TruckList;
            $scope.TruckSizeId = id;
            $scope.TruckJson.TruckType = resoponsedata[0].LookupId;
            $scope.TruckJson.Name = resoponsedata[0].TruckSize;
            $scope.TruckJson.Palletes = resoponsedata[0].TruckCapacityPalettes;
            $scope.TruckJson.Capacity = resoponsedata[0].TruckCapacityWeight;
            $scope.AddForm();
        });
    }


    $scope.DeleteTruck = function (id) {
        var requestData =
            {
                ServicesAction: 'DeleteTruck',
                TruckSizeId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            gridCallBack();
        });
    }




});