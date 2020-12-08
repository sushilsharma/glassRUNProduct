angular.module("glassRUNProduct").controller('ProcessConfigurationController', function ($scope, $location, ProcessConfigurationService) {
    

    $scope.CompanyType = "";
    $scope.OrderType = "34";
    $scope.ProcessName = "hii";
    $('#form').hide();
    $scope.ProcessConfigurationAddForm = function () 
    {
        $('#grid').hide();
        $("#form").show('slide', { direction: 'right' }, 500);
        $("#AddButton").css("display", "none");
    };

    $scope.title = "Add ProcessConfiguration ";

    var where = "";
    //$scope.ProcessConfigurationmainGridOptions = 
    //{

    //    dataSource: {
    //        schema: {
    //            data: "data",
    //            total: "totalRecords"
    //        },
    //        transport: 
    //                {
    //                    read: function (options) {//You can get the current page, pageSize etc off `e`.
    //                    var orderby = "";
    //                    var config = "";
    
    //                    if (options.data.sort) 
    //                    {
    //                        if (options.data.sort.length > 0) 
    //                        {
    //                            var sortField = options.data.sort[0].field;
    //                            if (options.data.sort[0].dir == 'asc') 
    //                            {
    //                                var sortOrder = ' asc';
    //                            }
    //                            else if (options.data.sort[0].dir == 'desc') 
    //                            {
    //                                var sortOrder = ' desc';
    //                            };
    //                            orderby = sortField + sortOrder;
    //                        }
    //                    }
    //                    if (options.data && options.data.filter && options.data.filter.filters) 
    //                    {
    //                        config =
    //                        {
    //                            value: options.data.filter.filters[0].value,
    //                            field: options.data.filter.filters[0].field,
    //                            operator: options.data.filter.filters[0].operator,
    //                        };
    //                        where = options.data.filter.filters[0].field + " Like '%" + options.data.filter.filters[0].value + "%'";
    
    //                        console.log("input: ", options.data.filter.filters[0])
    //                    }
    //                    else {
    //                        where = "";
    //                    };


    //                    var requestData = 
    //                    {
    //                        pageIndex: options.data.page,
    //                        pageSize: options.data.pageSize,
    //                        orderBy: orderby,
    //                        where: where
    //                    };
                    
    //                    ProcessConfigurationService.ProcessConfigurationGridLoad(requestData).then(function (requestData)
    //                    {

    //                        $scope.GridData = response.data.d;
    //                        options.success(response.data.d);
    //                        $scope.values = options;
    //                    });
    //                    ProcessConfigurationService.getForms(requestData, options);
    //                }
    //            },
    //            pageSize: 10,
    //            serverPaging: true,
    //            serverSorting: true,
    //            serverFiltering: true
    //        },
    //        filterable: 
    //        {
    //            mode: "row"
    //        },
    //        selectable: "row",
    //        pageable: 
    //        {
    //            pageSizes: [10,50,100]
    //        },
    //        sortable: true,
    //        groupable: true,
    //        columnMenu: true,
    //        columns: [
                   
    //               { field: CompanyType, type: "string", filterable: { mode: "row" }, },
    //               { field: OrderType, type: "string", filterable: { mode: "row" }, },
    //               { field: CompanyId, type: "string", filterable: { mode: "row" }, },
    //               { field: ModeOfDelivery, type: "string", filterable: { mode: "row" }, },
    //               { field: ProcessCategory, type: "string", filterable: { mode: "row" }, },
    //               { field: LastStageId, type: "string", filterable: { mode: "row" }, },
    //               { field: ProcessName, type: "string", filterable: { mode: "row" }, },
    //               { field: NextStageId, type: "string", filterable: { mode: "row" }, },
    //               { field: RuleId, type: "string", filterable: { mode: "row" }, },
    //               { field: NotificationId, type: "string", filterable: { mode: "row" }, },
    //               { field: Remarks, type: "string", filterable: { mode: "row" }, },
                   
                   
    //               { field: ModifiedBy, type: "string", filterable: { mode: "row" }, },
    //               { field: ModifiedDate, type: "date", filterable: { mode: "row", ui: "datetimepicker", extra: true, "messages": { "info": "Show items between dates:" }, "operators": { "date": { "gte": "Begin Date", "lte": "End Date" } } }, format: "{0:dd/MM/yyyy HH:mm tt}" },
                   
    //               { field: SequenceNo, type: "string", filterable: { mode: "row" }, },
    //               { field: Field1, type: "string", filterable: { mode: "row" }, },
    //               { field: Field2, type: "string", filterable: { mode: "row" }, },
    //               { field: Field3, type: "string", filterable: { mode: "row" }, },
    //               { field: Field4, type: "string", filterable: { mode: "row" }, },
    //               { field: Field5, type: "string", filterable: { mode: "row" }, },
    //               { field: Field6, type: "string", filterable: { mode: "row" }, },
    //               { field: Field7, type: "string", filterable: { mode: "row" }, },
    //               { field: Field8, type: "string", filterable: { mode: "row" }, },
    //               { field: Field9, type: "string", filterable: { mode: "row" }, },
    //               { field: Field10, type: "string", filterable: { mode: "row" }, },
    //        { "template": "<button class=\"k-button\" ng-click=\"ProcessConfigurationEdit(#=ProcessConfigurationId#)\">Edit</button>", "title": "Edit", "width": "250px" },
    //        { "template": "<button class=\"k-button\" ng-click=\"ProcessConfigurationdelete(#=ProcessConfigurationId#)\">Delete</button>", "title": "Delete",  "width": "250px" }
    //        ],
    //    }
    
        //Function to edit ProcessConfiguration records
        $scope.ProcessConfigurationEdit = function (id) 
        {
            //TODO call remote service to delete item....
            var jsonobject = {};
            jsonobject.ProcessConfigurationId = id;
            ProcessConfigurationService.getById(jsonobject).then(function (response) 
            {
                var ProcessConfigurationdata = response.data.d;
                $scope.ProcessConfigurationId = ProcessConfigurationdata.ProcessConfigurationList[0].ProcessConfigurationId;
                $scope.CompanyType = ProcessConfigurationdata.ProcessConfigurationList[0].CompanyType;
                $scope.OrderType = ProcessConfigurationdata.ProcessConfigurationList[0].OrderType;
                $scope.CompanyId = ProcessConfigurationdata.ProcessConfigurationList[0].CompanyId;
                $scope.ModeOfDelivery = ProcessConfigurationdata.ProcessConfigurationList[0].ModeOfDelivery;
                $scope.ProcessCategory = ProcessConfigurationdata.ProcessConfigurationList[0].ProcessCategory;
                $scope.LastStageId = ProcessConfigurationdata.ProcessConfigurationList[0].LastStageId;
                $scope.ProcessName = ProcessConfigurationdata.ProcessConfigurationList[0].ProcessName;
                $scope.NextStageId = ProcessConfigurationdata.ProcessConfigurationList[0].NextStageId;
                $scope.RuleId = ProcessConfigurationdata.ProcessConfigurationList[0].RuleId;
                $scope.NotificationId = ProcessConfigurationdata.ProcessConfigurationList[0].NotificationId;
                $scope.Remarks = ProcessConfigurationdata.ProcessConfigurationList[0].Remarks;
                $scope.CreatedBy = ProcessConfigurationdata.ProcessConfigurationList[0].CreatedBy;
                $scope.CreatedDate = ProcessConfigurationdata.ProcessConfigurationList[0].CreatedDate;
                $scope.ModifiedBy = ProcessConfigurationdata.ProcessConfigurationList[0].ModifiedBy;
                $scope.ModifiedDate = ProcessConfigurationdata.ProcessConfigurationList[0].ModifiedDate;
                $scope.IsActive = ProcessConfigurationdata.ProcessConfigurationList[0].IsActive;
                $scope.SequenceNo = ProcessConfigurationdata.ProcessConfigurationList[0].SequenceNo;
                $scope.Field1 = ProcessConfigurationdata.ProcessConfigurationList[0].Field1;
                $scope.Field2 = ProcessConfigurationdata.ProcessConfigurationList[0].Field2;
                $scope.Field3 = ProcessConfigurationdata.ProcessConfigurationList[0].Field3;
                $scope.Field4 = ProcessConfigurationdata.ProcessConfigurationList[0].Field4;
                $scope.Field5 = ProcessConfigurationdata.ProcessConfigurationList[0].Field5;
                $scope.Field6 = ProcessConfigurationdata.ProcessConfigurationList[0].Field6;
                $scope.Field7 = ProcessConfigurationdata.ProcessConfigurationList[0].Field7;
                $scope.Field8 = ProcessConfigurationdata.ProcessConfigurationList[0].Field8;
                $scope.Field9 = ProcessConfigurationdata.ProcessConfigurationList[0].Field9;
                $scope.Field10 = ProcessConfigurationdata.ProcessConfigurationList[0].Field10;
                $scope.AddForm();
            });
        };
    
        //Function to call out pop up to delete ProcessConfiguration records
        $scope.ProcessConfigurationdelete = function (id) 
        {
            $scope.PK_ProcessConfiguration = id;
            $scope.modal.center().open();
        };

        //Function to delete ProcessConfiguration records
        $scope.ProcessConfigurationdeleteRecord = function (id) 
        {       
            var jsonobject = {};
            jsonobject.ProcessConfigurationId = id;
            ProcessConfigurationService.deleteById(jsonobject).then(function (response) 
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

        $scope.ProcessConfigurationvalidatefield = function (id, type) 
        {
            return CheckControlValue(id, type);
        };
        
        $scope.ProcessConfigurationsave = function () 
        {
            
            var ProcessConfigurationData = {
                ProcessConfigurationId: $scope.ProcessConfigurationId,
                CompanyType: $scope.CompanyType,
                OrderType: $scope.OrderType,
                CompanyId: $scope.CompanyId,
                ModeOfDelivery: $scope.ModeOfDelivery,
                ProcessCategory: $scope.ProcessCategory,
                LastStageId: $scope.LastStageId,
                ProcessName: $scope.ProcessName,
                NextStageId: $scope.NextStageId,
                RuleId: $scope.RuleId,
                NotificationId: $scope.NotificationId,
                Remarks: $scope.Remarks,
                CreatedBy: $scope.CreatedBy,
                CreatedDate: $scope.CreatedDate,
                ModifiedBy: $scope.ModifiedBy,
                ModifiedDate: $scope.ModifiedDate,
                IsActive: $scope.IsActive,
                SequenceNo: $scope.SequenceNo,
                Field1: $scope.Field1,
                Field2: $scope.Field2,
                Field3: $scope.Field3,
                Field4: $scope.Field4,
                Field5: $scope.Field5,
                Field6: $scope.Field6,
                Field7: $scope.Field7,
                Field8: $scope.Field8,
                Field9: $scope.Field9,
                Field10: $scope.Field10,
            };

            
            var requestObject = {};
            requestObject.Json = JSON.stringify(ProcessConfigurationData);
            requestObject.ControllerName = "ProcessConfiguration";
            requestObject.ActionName = "SaveProcessConfiguration";
            
            
            //var jsonobject = {};
            //jsonobject.requestInput = JSON.stringify(requestObject);


            ProcessConfigurationService.ProcessConfigurationsave(requestObject).then(function (response) {
                $scope.reset();
            });

            $('#form').hide();
            $("#grid").show('slide', { direction: 'right' }, 500);
            $("#AddButton").css("display", "block");
        };

        $scope.reset = function () 
        {
                $scope.ProcessConfigurationId = "";
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
    //FormComponents.init();
});

