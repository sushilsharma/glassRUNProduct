angular.module("glassRUNProduct").controller('ViewComplaintController', function ($scope, $q, $filter, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, GrRequestService) {
    
    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $rootScope.Throbber = {
        Visible: false
    };

    $scope.ViewFeedBack = function (OrderGUID, SalesOrderNumber) {
        $rootScope.OrderGUID = OrderGUID;

        $rootScope.OrderDetailId = OrderGUID;
        $rootScope.SalesOrderNumber = SalesOrderNumber;
        $state.go("OverallFeedback");
    }


    $scope.ViewComplaintGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) { //You can get the current page, pageSize etc off `e`.
                        
                        $scope.GridData = [];
                        var orderby = "";
                        var config = "";
                        var viewRoleAccessDto = "";

                        var Comment = "";
                        var CommentCriteria = "";
                        var EnquiryNumber = "";
                        var EnquiryNumberCriteria = "";
                        var OrderNumber = "";
                        var OrderNumberCriteria = "";

                        var PostDate = "";
                        var PostDateCriteria = "";

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


                            if (options.data.filter.filters[0].field === "OrderNumber") {
                                OrderNumber = options.data.filter.filters[0].value;
                                OrderNumberCriteria = options.data.filter.filters[0].operator;
                            }
                            if (options.data.filter.filters[0].field === "EnquiryAutoNumber") {
                                EnquiryNumber = options.data.filter.filters[0].value;
                                EnquiryNumberCriteria = options.data.filter.filters[0].operator;
                            }
                            if (options.data.filter.filters[0].field === "Comment") {
                                Comment = options.data.filter.filters[0].value;
                                CommentCriteria = options.data.filter.filters[0].operator;
                            }
                            if (options.data.filter.filters[0].field === "PostDate") {
                                PostDate = options.data.filter.filters[0].value;
                                PostDate = new Date(PostDate);
                                PostDate = $filter('date')(PostDate, "dd/MM/yyyy");
                                PostDateCriteria = options.data.filter.filters[0].operator;


                            }
                        }
                        var page = $location.absUrl().split('#/')[1];
                        $scope.ViewControllerName = page;
                        $scope.pageIndex = options.data.page - 1;
                        $scope.pageSize = options.data.pageSize;
                        var requestData =
                            {
                                ServicesAction: 'LoadComplaintDetails',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: orderby,
                                //OrderId: $rootScope.OrderId,
                                Comment: Comment,
                                CommentCriteria: CommentCriteria,
                                PostDate: PostDate,
                                PostDateCriteria: PostDateCriteria,
                                EnquiryNumber: EnquiryNumber,
                                EnquiryNumberCriteria: EnquiryNumberCriteria,
                                OrderNumber: OrderNumber,
                                OrderNumberCriteria: OrderNumberCriteria,
                                CompanyId: $rootScope.CompanyId,
                                RoleMasterId: $rootScope.RoleId

                            };

                        $scope.RequestDataFilter = requestData;
                        var consolidateApiParamater =
                            {
                                Json: requestData,

                            };


                        
                        var gridrequestData =
                            {
                                ServicesAction: 'LoadGridConfiguration',
                                RoleId: $rootScope.RoleId,
                                UserId: $rootScope.UserId,
                                PageName: $rootScope.PageName,
                                ControllerName: page
                            };

                        //var stringfyjson = JSON.stringify(requestData);
                        var gridconsolidateApiParamater =
                            {
                                Json: gridrequestData,
                            };


                        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {

                            $scope.GridColumnList = [];

                            if (response.data.Json != undefined) {
                                $scope.GridColumnList = response.data.Json.GridColumnList;
                            } else {

                            }


                            

                            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                                

                                var totalcount = null;
                                var ListData = null;
                                var resoponsedata = response.data;
                                if (resoponsedata != null) {
                                    if (resoponsedata.Json !== undefined) {
                                        totalcount = resoponsedata.Json.OrderFeedbackList[0].TotalCount
                                        ListData = resoponsedata.Json.OrderFeedbackList;

                                    }
                                    else {
                                        ListData = [];
                                        totalcount = 0;
                                    }
                                }
                                else {
                                    ListData = [];
                                    totalcount = 0;
                                }



                                var complaintList = {
                                    data: ListData,
                                    totalRecords: totalcount
                                }
                                $scope.GridData = complaintList;
                                options.success(complaintList);
                                $scope.values = options;

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

                { field: "OrderNumber", title: "SO", type: "string", filterable: { mode: "row", extra: false } },
                { field: "EnquiryAutoNumber", title: "Enquiry Number", type: "string", filterable: { mode: "row", extra: false } },
                { field: "Comment", title: "Comment", type: "string", filterable: { mode: "row", extra: false } },
                //{ field: "SalesOrderNumber", title: "SO", type: "string", filterable: { mode: "row", extra: false } },
                { field: "DeliveryLocation", title: "Ship to", type: "string", filterable: { mode: "row", extra: false } },
                { field: "CompanyName", title: "Sold to", type: "string", filterable: { mode: "row", extra: false } },
                {
                    field: "PostDate", "title": "Post Date", type: "date",
                    filterable:
                    {
                        cell:
                        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy HH:mm" },
                        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy HH:mm"
                    }, parseFormats: "{0:dd/MM/yyyy HH:mm}", format: "{0:dd/MM/yyyy HH:mm}", width: "175px"
                },

                { field: "Area", title: "Area", type: "string", filterable: { mode: "row", extra: false } },
                { field: "TruckOutPlateNumber", title: "TruckOutPlateNumber", type: "string", filterable: { mode: "row", extra: false } },
                { field: "TruckOutDriver", title: "TruckOutDriver", type: "string", filterable: { mode: "row", extra: false } },
                { field: "Deployement1", title: "Deployement1", type: "string", filterable: { mode: "row", extra: false } },
                { field: "Deployement2", title: "Deployement2", type: "string", filterable: { mode: "row", extra: false } },
                //{ field: "Quantity", title: "Quantity", type: "string", filterable: { mode: "row", extra: false } },
                { "template": "<button class=\"k-button\" ng-click=\"ViewFeedBack(#=OrderId#,#=SalesOrderNumber#)\">View</button>", "title": "View", "width": "6%" },
                //{ "template": "<button class=\"k-button\" ng-click=\"DeleteComaplaint(#=OrderFeedbackId#)\"><i class='fa fa-trash'></i></a>", "title": "Delete", "width": "6%" }
            ],
        };
    function gridDataBound(e) {

        var grid = e.sender;
        if (grid.dataSource.total() == 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }


        setTimeout(function () {

            $scope.AddAttributeToKendoDatePikcer();

        }, 500);

    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.ViewTuckGrid.dataSource.transport.read($scope.values);
        }
    };



    $scope.AddAttributeToKendoDatePikcer = function () {

        var elems = angular.element(document.getElementsByClassName("k-picker-wrap"));

        for (var i = 0; i < elems.length; i++) {
            elems[i].setAttribute('data-tap-disabled', true);
        }


    }




    $scope.ExportToExcel = function () {
        

        $scope.RequestDataFilter.ServicesAction = "GetAllFeedbaclkDetailsForExport";
        $scope.RequestDataFilter.ColumnList = $scope.GridColumnList;

        var jsonobject = {};
        jsonobject.Json = $scope.RequestDataFilter;
        jsonobject.Json.IsExportToExcel = true;

        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
            
            var byteCharacters1 = response.data;
            if (response.data !== undefined) {
                var byteCharacters = response.data;
                var blob = new Blob([byteCharacters], {
                    type: "application/Pdf"
                });
                
                if (blob.size > 0) {
                    var filName = "ViewFeedbackGrid_" + getDate() + ".xlsx";
                    saveAs(blob, filName);
                } else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                }
            }
            else {
                $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
            }
        });
    }



});