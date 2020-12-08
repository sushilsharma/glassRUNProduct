angular.module("glassRUNProduct").controller('SalesOrderFeedbackController', function ($scope, $rootScope, $sessionStorage, $state, $location, $ionicModal, GrRequestService) {
    debugger;

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.fileupload = {
        File: '',
        ItemFile: '',
    }
    $scope.FeedbackVariable = {
        OverAll: true,
        Specific: false,
        Quantity: '',
        ProductCode: '',
        Name: '',
        ItemName: '',
        myFile: '',
        fileupload: '',
        ItemFeedbackName: '',
        ItemComment: '',
        Comment: '',
        UOM: "",
        Quantity: "",
        labelItemFilename: "",
        labelFilename: ""

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


                        var OrderNumber = "";
                        var OrderNumberCriteria = "";

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

                        }

                        debugger;
                        var requestData =
                            {
                                ServicesAction: "LoadOrderDetails",
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                OrderNumber: OrderNumber,
                                OrderNumberCriteria: OrderNumberCriteria
                            };

                        // var stringfyjson = JSON.stringify(requestData);
                        var consolidateApiParamater =
                            {
                                Json: requestData,

                            };

                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            debugger;

                            var resoponsedata = response.data;

                            var orderList = {
                                data: resoponsedata.Json.OrderList,
                                totalRecords: resoponsedata.Json.OrderList[0].TotalCount
                            }

                            $scope.GridData = orderList;
                            options.success(orderList);
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

                { field: "OrderNumber", title: "Order No.", type: "string", filterable: { mode: "row", extra: false }, "width": "8%" },

                { field: "SoldTo", title: "SoldTo", type: "string", filterable: { mode: "row", extra: false } },
                { field: "ShipTo", title: "ShipTo", type: "string", filterable: { mode: "row", extra: false } },
                { field: "TruckSize", title: "TruckSize", type: "string", filterable: { mode: "row", extra: false }, },
                { field: "CarrierETD", title: "ETD", type: "string", filterable: { mode: "row", extra: false }, },

                { "template": "<a class=\"greenbgfont approvebtn\" ng-click=\"OpenAddFeedbackpopup(#=OrderId#,'#=OrderNumber#')\">  Add Feedback</a>", "title": "Feedback", "width": "10%" }

                //{ "template": "<a class=\"greenbgfont approvebtn\"> Confirm Picking </a>", "title": "Confirm Picking", "width": "15%" }



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
            $scope.OrderDetailsGrid.dataSource.transport.read($scope.values);
        }
    };


    $scope.UploadFile = function (value) {
        debugger;

        var requestData = {
            ServicesAction: 'FeedBackFileSave',
            File: $scope.fileupload.File.dataBase64,
            FileName: $scope.fileupload.File.dataFile.name,
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        debugger;
        $scope.loading = true;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var readData = response.data;

            $scope.labelFilename = readData.PathValue + $scope.fileupload.File.dataFile.name;

            $scope.SaveFeedBackJson($scope.labelFilename);

            $scope.loading = false;

        });

    };

    $scope.savefeedback = function () {

        debugger;
        $scope.SaveFeedBackJson();

    }

    $scope.ItemFileNameChanged = function (element) {
        debugger;
        $scope.$apply(function () {
            debugger;
            $scope.FeedbackVariable.labelItemFilename = element.files[0].name;;
        });
    }

    $scope.FileNameChanged = function (element) {
        debugger;
        $scope.$apply(function () {
            debugger;
            $scope.FeedbackVariable.labelFilename = element.files[0].name;;
        });
    }

    $scope.SelectedItem = function (itemId) {
        debugger;
        var itemCode = $scope.bindallproduct.filter(function (el) { return el.OrderProductId === itemId });
        if (itemCode.length > 0) {
            $scope.FeedbackVariable.UOM = itemCode[0].UOM;
            $scope.FeedbackVariable.Quantity = itemCode[0].ProductQuantity;
        }

    }

    $scope.OrderItemFeedback = [];
    $scope.AddItemFeedback = function () {
        debugger;

        var itemCode = $scope.bindallproduct.filter(function (el) { return el.OrderProductId === $scope.FeedbackVariable.ItemName });
        var feedbackName = $scope.bindallFeedbak.filter(function (el) { return el.LookUpId === $scope.FeedbackVariable.ItemFeedbackName });

        var itemFeedback = {
            OrderId: $scope.labelOrderId,
            OrderProductId: $scope.FeedbackVariable.ItemName,
            ProductCode: itemCode[0].ProductCode,
            ItemName: itemCode[0].ItemName,
            feedbackId: $scope.FeedbackVariable.ItemFeedbackName,
            FeedbackValue: feedbackName[0].Name,
            Attachment: "",
            Comment: $scope.FeedbackVariable.ItemComment,
            UOM: itemCode[0].UOM,
            HVBLComment: "",
            Quantity: 0,
            CreatedBy: $rootScope.UserId,
            DocumentName: $scope.fileupload.ItemFile.dataFile.name,
            DocumentsList: []
        }

        var itemDocument = {
            DocumentName: $scope.fileupload.ItemFile.dataFile.name,
            DocumentExtension: $scope.fileupload.ItemFile.dataFile.name.split('.')[1],
            DocumentBase64: $scope.fileupload.ItemFile.dataBase64,
            ObjectType: "Feedback",
            SequenceNo: 0,
            CreatedBy: $rootScope.UserId,
            IsActive: 1
        }

        itemFeedback.DocumentsList.push(itemDocument);

        $scope.OrderItemFeedback.push(itemFeedback);

        $scope.ClearItemFeedback();
    }


    $scope.SaveFeedBackJson = function () {
        debugger;
        var itemFeedback = {
            OrderId: $scope.labelOrderId,
            OrderProductId: 0,
            feedbackId: $scope.FeedbackVariable.Name,
            Attachment: "",
            Comment: $scope.FeedbackVariable.Comment,
            HVBLComment: "",
            Quantity: 0,
            CreatedBy: $rootScope.UserId,
            DocumentsList: []
        }

        var itemDocument = {
            DocumentName: $scope.fileupload.File.dataFile.name,
            DocumentExtension: $scope.fileupload.File.dataFile.name.split('.')[1],
            DocumentBase64: $scope.fileupload.File.dataBase64,
            ObjectType: "Feedback",
            SequenceNo: 0,
            CreatedBy: $rootScope.UserId,
            IsActive: 1
        }

        itemFeedback.DocumentsList.push(itemDocument);

        $scope.OrderItemFeedback.push(itemFeedback);

        var Product =
            {
                ServicesAction: 'Savefeedback',
                OrderFeedbackList: $scope.OrderItemFeedback

            }


        debugger;

        var jsonobject = {};
        jsonobject.Json = Product;


        debugger;

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data;
            $scope.AddFeedbackpopup.hide();
            $scope.reset();
        });

    }

    $scope.ClearItemFeedback = function () {
        debugger;
        $scope.FeedbackVariable.ItemName = "";
        $scope.FeedbackVariable.Quantity = "";
        $scope.FeedbackVariable.UOM = "";
        $scope.FeedbackVariable.ItemFeedbackName = "";
        $scope.FeedbackVariable.labelItemFilename = "";
        $scope.FeedbackVariable.ItemComment = "";
        $scope.fileupload.ItemFile.dataFile.name = "";
        $scope.fileupload.ItemFile.dataBase64 = "";
        angular.element("input[type='file']").val(null);
    }

    $scope.reset = function () {
        $scope.FeedbackVariable.Quantity = "";
        $scope.FeedbackVariable.Comment = "";
        $scope.FeedbackVariable.HVBLComment = "";
        $scope.FeedbackVariable.Name = "";
        $scope.FeedbackVariable.ProductCode = "";
        $scope.labelOrderId = "";
        $scope.labelFilename = "";
        $scope.fileupload.File.dataFile.name = "";
        $scope.fileupload.File.dataBase64 = "";
        $scope.OrderItemFeedback = [];
        $scope.FeedbackVariable.OverAll = true;
        $scope.FeedbackVariable.Specific = false;
        angular.element("input[type='file']").val(null);
        $scope.ClearItemFeedback();

    }

    $ionicModal.fromTemplateUrl('templates/AddFeedback.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.AddFeedbackpopup = modal;
    });

    $scope.OpenAddFeedbackpopup = function (id, number) {
        debugger;


        $scope.labelOrderNumber = number;
        $scope.labelOrderId = id;
        var requestData =
            {
                ServicesAction: 'LoadOrderProductById',
                OrderId: id
            };

        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data;
            $scope.bindallproduct = resoponsedata.Json.OrderProductList;
        });


        var requestDatas =
            {
                ServicesAction: 'LoadAllOrderFeedback'
            };

        // var stringfyjsons = JSON.stringify(requestDatas);
        var jsonobjects = {};
        jsonobjects.Json = requestDatas;
        GrRequestService.ProcessRequest(jsonobjects).then(function (response) {
            debugger;
            var resoponsedatas = response.data;
            $scope.bindallFeedbak = resoponsedatas.Json.LookUpList;
        });

        $scope.AddFeedbackpopup.show();

    }

    $scope.CloseAddFeedbackpopup = function () {
        debugger;
        $scope.AddFeedbackpopup.hide();
    }

    $scope.setoverall = function () {
        $scope.FeedbackVariable.OverAll = true;
        $scope.FeedbackVariable.Specific = false;
    }

    $scope.setspecific = function () {
        $scope.FeedbackVariable.Specific = true;
        $scope.FeedbackVariable.OverAll = false;
    }


});