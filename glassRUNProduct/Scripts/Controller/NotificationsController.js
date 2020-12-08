    app.controller('NotificationsController', function ($scope, $location, NotificationsService) {
    $('#form').hide();
    $scope.NotificationsAddForm = function () 
    {
        $('#grid').hide();
        $("#form").show('slide', { direction: 'right' }, 500);
        $("#AddButton").css("display", "none");
    };

    $scope.title = "Add Notifications ";

    var where = "";
    $scope.NotificationsmainGridOptions = 
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
                    
                        NotificationsService.NotificationsGridLoad(requestData).then(function (requestData)
                        {

                            $scope.GridData = response.data.d;
                            options.success(response.data.d);
                            $scope.values = options;
                        });
                        NotificationsService.getForms(requestData, options);
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
                   
                   { field: NotificationType, type: "string", filterable: { mode: "row" }, },
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
            { "template": "<button class=\"k-button\" ng-click=\"NotificationsEdit(#=NotificationsId#)\">Edit</button>", "title": "Edit", "width": "250px" },
            { "template": "<button class=\"k-button\" ng-click=\"Notificationsdelete(#=NotificationsId#)\">Delete</button>", "title": "Delete",  "width": "250px" }
            ],
        }
    
        //Function to edit Notifications records
        $scope.NotificationsEdit = function (id) 
        {
            //TODO call remote service to delete item....
            var jsonobject = {};
            jsonobject.NotificationsId = id;
            NotificationsService.getById(jsonobject).then(function (response) 
            {
                var Notificationsdata = response.data.d;
                $scope.NotificationId = Notificationsdata.NotificationsList[0].NotificationId;
                $scope.NotificationType = Notificationsdata.NotificationsList[0].NotificationType;
                $scope.Remarks = Notificationsdata.NotificationsList[0].Remarks;
                $scope.CreatedBy = Notificationsdata.NotificationsList[0].CreatedBy;
                $scope.CreatedDate = Notificationsdata.NotificationsList[0].CreatedDate;
                $scope.ModifiedBy = Notificationsdata.NotificationsList[0].ModifiedBy;
                $scope.ModifiedDate = Notificationsdata.NotificationsList[0].ModifiedDate;
                $scope.IsActive = Notificationsdata.NotificationsList[0].IsActive;
                $scope.SequenceNo = Notificationsdata.NotificationsList[0].SequenceNo;
                $scope.Field1 = Notificationsdata.NotificationsList[0].Field1;
                $scope.Field2 = Notificationsdata.NotificationsList[0].Field2;
                $scope.Field3 = Notificationsdata.NotificationsList[0].Field3;
                $scope.Field4 = Notificationsdata.NotificationsList[0].Field4;
                $scope.Field5 = Notificationsdata.NotificationsList[0].Field5;
                $scope.Field6 = Notificationsdata.NotificationsList[0].Field6;
                $scope.Field7 = Notificationsdata.NotificationsList[0].Field7;
                $scope.Field8 = Notificationsdata.NotificationsList[0].Field8;
                $scope.Field9 = Notificationsdata.NotificationsList[0].Field9;
                $scope.Field10 = Notificationsdata.NotificationsList[0].Field10;
                $scope.AddForm();
            });
        };
    
        //Function to call out pop up to delete Notifications records
        $scope.Notificationsdelete = function (id) 
        {
            $scope.PK_Notifications = id;
            $scope.modal.center().open();
        };

        //Function to delete Notifications records
        $scope.NotificationsdeleteRecord = function (id) 
        {       
            var jsonobject = {};
            jsonobject.NotificationsId = id;
            NotificationsService.deleteById(jsonobject).then(function (response) 
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

        $scope.Notificationsvalidatefield = function (id, type) 
        {
            return CheckControlValue(id, type);
        };
        
        $scope.Notificationssave = function () 
        {
            var istrue = allValidation('form', 0);
            if (istrue == true) 
            {
                var NotificationsData = {
                    NotificationId : $scope.NotificationId,
                    NotificationType : $scope.NotificationType,
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
            NotificationsService.Save(NotificationsData).then(function (response) 
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
                $scope.NotificationId = "";
                $scope.NotificationType = "";
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

