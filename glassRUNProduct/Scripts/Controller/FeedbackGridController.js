angular.module("glassRUNProduct").controller('FeedbackGridController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {
    

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.datepickerfilter = function (element) {

        element.kendoDatePicker({ format: "dd/MM/yyyy", parseFormats: "{0:dd/MM/yyyy}", valuePrimitive: true });
    }

    $scope.ViewFeedbackGrid =
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

                        var OrderNumber = "";
                        var OrderNumberCondition = "";

var CustomerName="";
var CustomerNameCondition="";

var ShipToCode="";
var ShipToCodeCondition="";

var ProductName="";
var ProductNameCondition="";

var CreatedDate="";
                        var CreatedDateCriteria="";

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

                            for (var i = 0; i < options.data.filter.filters.length; i++) {

                                if (options.data.filter.filters[i].field === "OrderNumber") {
                                    OrderNumber = options.data.filter.filters[i].value;
                                    OrderNumberCondition = options.data.filter.filters[i].operator;

                                }

							if (options.data.filter.filters[i].field === "CustomerName") {
                                    CustomerName = options.data.filter.filters[i].value;
                                    CustomerNameCondition = options.data.filter.filters[i].operator;

                                }

							if (options.data.filter.filters[i].field === "ShipToCode") {
                                    ShipToCode = options.data.filter.filters[i].value;
                                    ShipToCodeCondition = options.data.filter.filters[i].operator;

                                }

								if (options.data.filter.filters[i].field === "ProductName") {
                                    ProductName = options.data.filter.filters[i].value;
                                    ProductNameCondition = options.data.filter.filters[i].operator;

                                }


			//if (options.data.filter.filters[i].field === "CreatedDate") {
   //                                 CreatedDate = options.data.filter.filters[i].value;
   //                                 CreatedDateCondition = options.data.filter.filters[i].operator;

   //                             }

                                if (options.data.filter.filters[i].field === "CreatedDate") {

                                    CreatedDate = options.data.filter.filters[i].value;
                                    CreatedDate = new Date(CreatedDate);
                                    CreatedDate = $filter('date')(CreatedDate, "dd/MM/yyyy");
                                    CreatedDateCriteria = options.data.filter.filters[i].operator;

                                }



                            }


                        }
                        var requestData =
                            {
                                ServicesAction: 'LoadFeedbackList_Paging',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                LoginId: $rootScope.UserId,
                                RoleId: $rootScope.RoleId,
                                OrderNumber: OrderNumber,
                            OrderNumberCondition: OrderNumberCondition,
                            CustomerName: CustomerName,
                            CustomerNameCondition: CustomerNameCondition,
                            ShipToCode: ShipToCode,
                            ShipToCodeCondition: ShipToCodeCondition,
                            ProductName: ProductName,
                            ProductNameCondition: ProductNameCondition,
                           
                            CreatedDate: CreatedDate,
                            CreatedDateCriteria: CreatedDateCriteria,
                            };


                        var consolidateApiParamater =
                            {
                                Json: requestData,

                            };


                        

                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            

                            var totalcount = null;
                            var ListData = null;
                            if (response.data != null && response.data != undefined) {
                                var resoponsedata = response.data;
                                if (resoponsedata.Json !== undefined) {
                                    totalcount = resoponsedata.Json.OrderFeedbackList[0].TotalCount
                                    ListData = resoponsedata.Json.OrderFeedbackList;
                                }
                                else {
                                    totalcount = 0
                                    ListData = [];
                                }
                            } else {
                                totalcount = 0
                                ListData = [];
                            }

                            $rootScope.Throbber.Visible = false;

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
                    field: "OrderNumber", template: '<a ng-click=\"ViewFeedBackDetails(#=OrderId#,#=OrderFeedbackId#)\" class="graybgfont">#:OrderNumber#</a>',
                    title: $rootScope.resData.res_GridColumn_OrderNumber, type: "string", filterable: { mode: "row", extra: false },
                    width: "120px"
                },
                { field: "CustomerName", title: $rootScope.resData.res_OrderFeedback_CustomerName, type: "string", filterable: { mode: "row", extra: false } },
                { field: "ShipToCode", title: $rootScope.resData.res_OrderFeedback_ShipToCode, type: "string", filterable: { mode: "row", extra: false } },
                { field: "ProductName", title: $rootScope.resData.res_OrderFeedback_ProductName, type: "string", filterable: { mode: "row", extra: false } },
                { field: "Quantity", title: $rootScope.resData.res_OrderFeedback_ReturnQuantity, type: "string", filterable: false },
                { field: "Comment", title: $rootScope.resData.res_OrderFeedback_Comment, type: "string", filterable: false },
                { field: "FeedbackName", title: $rootScope.resData.res_OrderFeedback_Feedback, type: "string", filterable: false },
                //{ field: "CreatedDate", title: $rootScope.resData.res_OrderFeedback_Date, type: "string", filterable: { mode: "row", extra: false, } },

                {
                    field: "CreatedDate", title: $rootScope.resData.res_OrderFeedback_Date, type: "date",
                    filterable:
                    {
                        cell:
                            { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy" },
                        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy"
                    }, parseFormats: "{0:dd/MM/yyyy}", format: "{0:dd/MM/yyyy}", width: "175px"
                },

                { "template": "<a class=\"greenbgfont approvebtn\" ng-click=\"ViewFeedBackDetails(#=OrderId#,#=OrderFeedbackId#)\">{{resData.res_GridColumn_View}}</a>", "title": $rootScope.resData.res_GridColumn_View, "width": "6%" },

            ],
        }
    function gridDataBound(e) {

        var grid = e.sender;
        setTimeout(function () {

            $scope.AddAttributeToKendoDatePikcer();
        }, 500);
        if (grid.dataSource.total() == 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };


    $scope.AddAttributeToKendoDatePikcer = function () {

        var elems = angular.element(document.getElementsByClassName("k-picker-wrap"));

        for (var i = 0; i < elems.length; i++) {
            elems[i].setAttribute('data-tap-disabled', true);
        }

    }

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.ViewFeedbackGrid.dataSource.transport.read($scope.values);
        }
    };

    $scope.ViewFeedBackDetails = function (OrderId, OrderFeedbackId) {
        
        $rootScope.FeedbackOrderId = OrderId;
        $rootScope.FeedbackOrderFeedbackId = OrderFeedbackId;
        $state.go("FeedbackDetailPage");
    };

    

});
