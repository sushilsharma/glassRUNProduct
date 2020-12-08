    app.controller('OrderActivityController', function ($scope, $location, OrderActivityService) {
    $('#form').hide();
    $scope.OrderActivityAddForm = function () 
    {
        $('#grid').hide();
        $("#form").show('slide', { direction: 'right' }, 500);
        $("#AddButton").css("display", "none");
    };

    $scope.title = "Add OrderActivity ";

    var where = "";
    $scope.OrderActivitymainGridOptions = 
    {

        dataSource: {
            schema: {
                data: "data",
                total: "totalRecords"
            },
            transport: 
                    {
                        read: function (options) {//You can get the current page, pageSize etc off `e`.
                        var orderby = "";
                        var config = "";
    
                        if (options.data.sort) 
                        {
                            if (options.data.sort.length > 0) 
                            {
                                var sortField = options.data.sort[0].field;
                                if (options.data.sort[0].dir == 'asc') 
                                {
                                    var sortOrder = ' asc';
                                }
                                else if (options.data.sort[0].dir == 'desc') 
                                {
                                    var sortOrder = ' desc';
                                };
                                orderby = sortField + sortOrder;
                            }
                        }
                        if (options.data && options.data.filter && options.data.filter.filters) 
                        {
                            config =
                            {
                                value: options.data.filter.filters[0].value,
                                field: options.data.filter.filters[0].field,
                                operator: options.data.filter.filters[0].operator,
                            };
                            where = options.data.filter.filters[0].field + " Like '%" + options.data.filter.filters[0].value + "%'";
    
                            console.log("input: ", options.data.filter.filters[0])
                        }
                        else {
                            where = "";
                        };


                        var requestData = 
                        {
                            pageIndex: options.data.page,
                            pageSize: options.data.pageSize,
                            orderBy: orderby,
                            where: where
                        };
                    
                        OrderActivityService.OrderActivityGridLoad(requestData).then(function (requestData)
                        {

                            $scope.GridData = response.data.d;
                            options.success(response.data.d);
                            $scope.values = options;
                        });
                        OrderActivityService.getForms(requestData, options);
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
                pageSizes: [10,50,100]
            },
            sortable: true,
            groupable: true,
            columnMenu: true,
            columns: [
                   
                   { field: CompanyType, type: "string", filterable: { mode: "row" }, },
                   { field: OrderType, type: "string", filterable: { mode: "row" }, },
                   { field: CompanyId, type: "string", filterable: { mode: "row" }, },
                   { field: ModeOfDelivery, type: "string", filterable: { mode: "row" }, },
                   { field: ProcessCategory, type: "string", filterable: { mode: "row" }, },
                   { field: LastStageId, type: "string", filterable: { mode: "row" }, },
                   { field: ProcessName, type: "string", filterable: { mode: "row" }, },
                   { field: NextStageId, type: "string", filterable: { mode: "row" }, },
                   { field: RuleId, type: "string", filterable: { mode: "row" }, },
                   { field: NotificationId, type: "string", filterable: { mode: "row" }, },
                   { field: Remarks, type: "string", filterable: { mode: "row" }, },
                   
                   
                   { field: ModifiedBy, type: "string", filterable: { mode: "row" }, },
                   { field: ModifiedDate, type: "date", filterable: { mode: "row", ui: "datetimepicker", extra: true, "messages": { "info": "Show items between dates:" }, "operators": { "date": { "gte": "Begin Date", "lte": "End Date" } } }, format: "{0:dd/MM/yyyy HH:mm tt}" },
                   
                   { field: SequenceNo, type: "string", filterable: { mode: "row" }, },
                   { field: Field1, type: "string", filterable: { mode: "row" }, },
                   { field: Field2, type: "string", filterable: { mode: "row" }, },
                   { field: Field3, type: "string", filterable: { mode: "row" }, },
                   { field: Field4, type: "string", filterable: { mode: "row" }, },
                   { field: Field5, type: "string", filterable: { mode: "row" }, },
                   { field: Field6, type: "string", filterable: { mode: "row" }, },
                   { field: Field7, type: "string", filterable: { mode: "row" }, },
                   { field: Field8, type: "string", filterable: { mode: "row" }, },
                   { field: Field9, type: "string", filterable: { mode: "row" }, },
                   { field: Field10, type: "string", filterable: { mode: "row" }, },
            { "template": "<button class=\"k-button\" ng-click=\"OrderActivityEdit(#=OrderActivityId#)\">Edit</button>", "title": "Edit", "width": "250px" },
            { "template": "<button class=\"k-button\" ng-click=\"OrderActivitydelete(#=OrderActivityId#)\">Delete</button>", "title": "Delete",  "width": "250px" }
            ],
        }
    
        //Function to edit OrderActivity records
        $scope.OrderActivityEdit = function (id) 
        {
            //TODO call remote service to delete item....
            var jsonobject = {};
            jsonobject.OrderActivityId = id;
            OrderActivityService.getById(jsonobject).then(function (response) 
            {
                var OrderActivitydata = response.data.d;
                $scope.OrderActivityId = OrderActivitydata.OrderActivityList[0].OrderActivityId;
                $scope.CompanyType = OrderActivitydata.OrderActivityList[0].CompanyType;
                $scope.OrderType = OrderActivitydata.OrderActivityList[0].OrderType;
                $scope.CompanyId = OrderActivitydata.OrderActivityList[0].CompanyId;
                $scope.ModeOfDelivery = OrderActivitydata.OrderActivityList[0].ModeOfDelivery;
                $scope.ProcessCategory = OrderActivitydata.OrderActivityList[0].ProcessCategory;
                $scope.LastStageId = OrderActivitydata.OrderActivityList[0].LastStageId;
                $scope.ProcessName = OrderActivitydata.OrderActivityList[0].ProcessName;
                $scope.NextStageId = OrderActivitydata.OrderActivityList[0].NextStageId;
                $scope.RuleId = OrderActivitydata.OrderActivityList[0].RuleId;
                $scope.NotificationId = OrderActivitydata.OrderActivityList[0].NotificationId;
                $scope.Remarks = OrderActivitydata.OrderActivityList[0].Remarks;
                $scope.CreatedBy = OrderActivitydata.OrderActivityList[0].CreatedBy;
                $scope.CreatedDate = OrderActivitydata.OrderActivityList[0].CreatedDate;
                $scope.ModifiedBy = OrderActivitydata.OrderActivityList[0].ModifiedBy;
                $scope.ModifiedDate = OrderActivitydata.OrderActivityList[0].ModifiedDate;
                $scope.IsActive = OrderActivitydata.OrderActivityList[0].IsActive;
                $scope.SequenceNo = OrderActivitydata.OrderActivityList[0].SequenceNo;
                $scope.Field1 = OrderActivitydata.OrderActivityList[0].Field1;
                $scope.Field2 = OrderActivitydata.OrderActivityList[0].Field2;
                $scope.Field3 = OrderActivitydata.OrderActivityList[0].Field3;
                $scope.Field4 = OrderActivitydata.OrderActivityList[0].Field4;
                $scope.Field5 = OrderActivitydata.OrderActivityList[0].Field5;
                $scope.Field6 = OrderActivitydata.OrderActivityList[0].Field6;
                $scope.Field7 = OrderActivitydata.OrderActivityList[0].Field7;
                $scope.Field8 = OrderActivitydata.OrderActivityList[0].Field8;
                $scope.Field9 = OrderActivitydata.OrderActivityList[0].Field9;
                $scope.Field10 = OrderActivitydata.OrderActivityList[0].Field10;
                $scope.AddForm();
            });
        };
    
        //Function to call out pop up to delete OrderActivity records
        $scope.OrderActivitydelete = function (id) 
        {
            $scope.PK_OrderActivity = id;
            $scope.modal.center().open();
        };

        //Function to delete OrderActivity records
        $scope.OrderActivitydeleteRecord = function (id) 
        {       
            var jsonobject = {};
            jsonobject.OrderActivityId = id;
            OrderActivityService.deleteById(jsonobject).then(function (response) 
            {
                       
            });
            gridCallBack();
            $scope.modal.close();
         };
         //PLACE CODE HERE TO POPULATE DROP DOWN LISTS
        var gridCallBack = function () 
        {
            if ($scope.values !== undefined) 
            {
                $scope.mainGridOptions.dataSource.transport.read($scope.values);
            }
        };

        $scope.OrderActivityvalidatefield = function (id, type) 
        {
            return CheckControlValue(id, type);
        };
        
        $scope.OrderActivitysave = function () 
        {
            var istrue = allValidation('form', 0);
            if (istrue == true) 
            {
                var OrderActivityData = {
                    OrderActivityId : $scope.OrderActivityId,
                    CompanyType : $scope.CompanyType,
                    OrderType : $scope.OrderType,
                    CompanyId : $scope.CompanyId,
                    ModeOfDelivery : $scope.ModeOfDelivery,
                    ProcessCategory : $scope.ProcessCategory,
                    LastStageId : $scope.LastStageId,
                    ProcessName : $scope.ProcessName,
                    NextStageId : $scope.NextStageId,
                    RuleId : $scope.RuleId,
                    NotificationId : $scope.NotificationId,
                    Remarks : $scope.Remarks,
                    CreatedBy : $scope.CreatedBy,
                    CreatedDate : $scope.CreatedDate,
                    ModifiedBy : $scope.ModifiedBy,
                    ModifiedDate : $scope.ModifiedDate,
                    IsActive : $scope.IsActive,
                    SequenceNo : $scope.SequenceNo,
                    Field1 : $scope.Field1,
                    Field2 : $scope.Field2,
                    Field3 : $scope.Field3,
                    Field4 : $scope.Field4,
                    Field5 : $scope.Field5,
                    Field6 : $scope.Field6,
                    Field7 : $scope.Field7,
                    Field8 : $scope.Field8,
                    Field9 : $scope.Field9,
                    Field10 : $scope.Field10,
            };
            OrderActivityService.Save(OrderActivityData).then(function (response) 
            {
                $scope.reset();
            });
            
            $('#form').hide();
                $("#grid").show('slide', { direction: 'right' }, 500);
                $("#AddButton").css("display", "block");
            }
            else 
            {

            }
        };

        $scope.reset = function () 
        {
                $scope.OrderActivityId = "";
                $scope.CompanyType = "";
                $scope.OrderType = "";
                $scope.CompanyId = "";
                $scope.ModeOfDelivery = "";
                $scope.ProcessCategory = "";
                $scope.LastStageId = "";
                $scope.ProcessName = "";
                $scope.NextStageId = "";
                $scope.RuleId = "";
                $scope.NotificationId = "";
                $scope.Remarks = "";
                $scope.CreatedBy = "";
                $scope.CreatedDate = "";
                $scope.ModifiedBy = "";
                $scope.ModifiedDate = "";
                $scope.IsActive = "";
                $scope.SequenceNo = "";
                $scope.Field1 = "";
                $scope.Field2 = "";
                $scope.Field3 = "";
                $scope.Field4 = "";
                $scope.Field5 = "";
                $scope.Field6 = "";
                $scope.Field7 = "";
                $scope.Field8 = "";
                $scope.Field9 = "";
                $scope.Field10 = "";
    }
    FormComponents.init();
});

