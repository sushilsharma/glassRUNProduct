angular.module("glassRUNProduct").controller('PrinterBranchplantMappingController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, GrRequestService) {
    


    //if ($rootScope.Throbber !== undefined) {
    //    $rootScope.Throbber.Visible = true;
    //} else {
    //    $rootScope.Throbber = {
    //        Visible: true,
    //    }
    //}

    LoadActiveVariables($sessionStorage, $state, $rootScope);


    $scope.PrinterBranchPlantMappingId = 0;
    
    var requestData =
        {
            ServicesAction: 'LoadAllBranchPlantList',
            CompanyId: $rootScope.CompanyId
        };


    var jsonobject = {};
    jsonobject.Json = requestData;
    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        
        var resoponsedata = response.data;
        $scope.bindAllBranchPlant = resoponsedata.DeliveryLocation.DeliveryLocationList;
    });




    $scope.ViewPrinterBranchPlantMappingGrid =
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
                        var BranchPlantCode = "";
                        var PrinterName = "";
                        var NumberOfCopies = "";
                        var BranchPlantCodeCriteria = "";
                        var PrinterNameCriteria = "";
                        var NumberOfCopiesCriteria = "";

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

                            if (options.data.filter.filters[0].field === "PrinterName") {
                                PrinterName = options.data.filter.filters[0].value;
                                PrinterNameCriteria = options.data.filter.filters[0].operator;
                            }


                            if (options.data.filter.filters[0].field === "BranchPlantCode") {
                                BranchPlantCode = options.data.filter.filters[0].value;
                                BranchPlantCodeCriteria = options.data.filter.filters[0].operator;
                            }



                        }
                        var requestData =
                            {
                                ServicesAction: 'LoadPrinterBranchPlantMapping',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                PrinterName: PrinterName,
                                PrinterNameCriteria: PrinterNameCriteria,
                                BranchPlantCode: BranchPlantCode,
                                BranchPlantCodeCriteria: BranchPlantCodeCriteria

                            };


                        var consolidateApiParamater =
                            {
                                Json: requestData,

                            };


                        

                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            

                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;
                            totalcount = resoponsedata.Json.PrinterBranchPlantMappingList[0].TotalCount
                            ListData = resoponsedata.Json.PrinterBranchPlantMappingList;

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
                { field: "BranchPlantCode", title: "Branch Plant Code", type: "string", filterable: { mode: "row", extra: false } },
                { field: "PrinterName", title: "Printer Name", type: "string", filterable: { mode: "row", extra: false } },
                { field: "NumberOfCopies", title: "Number Of Copies", type: "string", filterable: false },
                //{ field: "TruckCapacityPalettes", title: "Palettes", type: "string", filterable: { mode: "row", extra: false } },
                //{ field: "TruckCapacityWeight", title: "Weight", type: "string", filterable: { mode: "row", extra: false } },
                { "template": "<button class=\"k-button\" ng-click=\"EditPrinterBranchPlantMapping(#=PrinterBranchPlantMappingId#)\"><i class='fa fa-pencil'></i></a>", "title": "Edit", "width": "6%" },
                { "template": "<button class=\"k-button\" ng-click=\"DeletePrinterBranchPlantMapping(#=PrinterBranchPlantMappingId#)\"><i class='fa fa-trash'></i></a>", "title": "Delete", "width": "6%" }
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
            $scope.ViewPrinterBranchPlantMappingGrid.dataSource.transport.read($scope.values);
        }
    };



    $scope.PrinterBranchPlantJson = {
        BranchPlant: '',
        PrinterName: '',
        PrinterPath: '',
        NumberOfCopies: ''
    }

    $scope.Clear = function () {
        $scope.PrinterBranchPlantJson.BranchPlant = "";
        $scope.PrinterBranchPlantJson.PrinterName = "";
        $scope.PrinterBranchPlantJson.PrinterPath = "";
        $scope.PrinterBranchPlantJson.NumberOfCopies = "";
        $scope.PrinterBranchPlantMappingId = 0;

    }


    $scope.SavePrinterBranchPlantMapping = function () {
        

        var printerbranchplantmapping = {
            PrinterBranchPlantMappingId: $scope.PrinterBranchPlantMappingId,
            BranchPlantCode: $scope.BranchPlantCode,
            PrinterName: $scope.PrinterBranchPlantJson.PrinterName,
            PrinterPath: $scope.PrinterBranchPlantJson.PrinterPath,
            NumberOfCopies: $scope.PrinterBranchPlantJson.NumberOfCopies,
            CreatedBy: $rootScope.UserId
        }

        var printerbranchplantmappingList = [];
        printerbranchplantmappingList.push(printerbranchplantmapping);

        var requestData =
            {
                ServicesAction: 'InsertPrinterBranchPlantMapping',
                PrinterBranchPlantMappingList: printerbranchplantmappingList
            };

        var consolidateApiParamater =
            {
                Json: requestData,
            };
        
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if ($scope.PrinterBranchPlantMappingId != 0) {
                $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
            }
            $scope.Clear();
            $scope.ViewForm();
            gridCallBack();
        });
    }

    $scope.GetBranchPlantCode = function (e) {
        
        var bracnhplantcodeList = $scope.bindAllBranchPlant.filter(function (el) { return parseInt(el.DeliveryLocationId) === parseInt(e) });
        if (bracnhplantcodeList.length != 0) {
            $scope.BranchPlantCode = bracnhplantcodeList[0].DeliveryLocationCode;
        }
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
        //$scope.Clear();
        gridCallBack();
    }
    $scope.ViewForm();


    $scope.EditPrinterBranchPlantMapping = function (id) {
        
        var requestData =
            {
                ServicesAction: 'GetPrinterBranchPlantDetailsById',
                PrinterBranchPlantMappingId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data.Json.PrinterBranchPlantMappingList;
            $scope.PrinterBranchPlantMappingId = id;
            $scope.PrinterBranchPlantJson.BranchPlant = resoponsedata[0].DeliveryLocationId;
            $scope.BranchPlantCode = resoponsedata[0].BranchPlantCode;
            $scope.PrinterBranchPlantJson.PrinterName = resoponsedata[0].PrinterName;
            $scope.PrinterBranchPlantJson.PrinterPath = resoponsedata[0].PrinterPath;
            $scope.PrinterBranchPlantJson.NumberOfCopies = resoponsedata[0].NumberOfCopies;
            $scope.AddForm();
        });
    }


    $scope.DeletePrinterBranchPlantMapping = function (id) {
        var requestData =
            {
                ServicesAction: 'DeletePrinterBranchPlantDetails',
                PrinterBranchPlantMappingId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            gridCallBack();
        });
    }

});