    app.controller('CultureMasterController', function ($scope, $location, CultureMasterService) {
    $('#form').hide();
    $scope.CultureMasterAddForm = function () 
    {
        $('#grid').hide();
        $("#form").show('slide', { direction: 'right' }, 500);
        $("#AddButton").css("display", "none");
    };

    $scope.title = "Add CultureMaster ";

    var where = "";
    $scope.CultureMastermainGridOptions = 
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
                    
                        CultureMasterService.CultureMasterGridLoad(requestData).then(function (requestData)
                        {

                            $scope.GridData = response.data.d;
                            options.success(response.data.d);
                            $scope.values = options;
                        });
                        CultureMasterService.getForms(requestData, options);
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
                   
                   { field: CultureName, type: "string", filterable: { mode: "row" }, },
                   { field: CultureCode, type: "string", filterable: { mode: "row" }, },
                   { field: Description, type: "string", filterable: { mode: "row" }, },
                   
                   
                   
                   
                   
            { "template": "<button class=\"k-button\" ng-click=\"CultureMasterEdit(#=CultureMasterId#)\">Edit</button>", "title": "Edit", "width": "250px" },
            { "template": "<button class=\"k-button\" ng-click=\"CultureMasterdelete(#=CultureMasterId#)\">Delete</button>", "title": "Delete",  "width": "250px" }
            ],
        }
    
        //Function to edit CultureMaster records
        $scope.CultureMasterEdit = function (id) 
        {
            //TODO call remote service to delete item....
            var jsonobject = {};
            jsonobject.CultureMasterId = id;
            CultureMasterService.getById(jsonobject).then(function (response) 
            {
                var CultureMasterdata = response.data.d;
                $scope.CultureMasterId = CultureMasterdata.CultureMasterList[0].CultureMasterId;
                $scope.CultureName = CultureMasterdata.CultureMasterList[0].CultureName;
                $scope.CultureCode = CultureMasterdata.CultureMasterList[0].CultureCode;
                $scope.Description = CultureMasterdata.CultureMasterList[0].Description;
                $scope.Active = CultureMasterdata.CultureMasterList[0].Active;
                $scope.CreatedBy = CultureMasterdata.CultureMasterList[0].CreatedBy;
                $scope.CreatedDate = CultureMasterdata.CultureMasterList[0].CreatedDate;
                $scope.UpdatedBy = CultureMasterdata.CultureMasterList[0].UpdatedBy;
                $scope.UpdatedDate = CultureMasterdata.CultureMasterList[0].UpdatedDate;
                $scope.AddForm();
            });
        };
    
        //Function to call out pop up to delete CultureMaster records
        $scope.CultureMasterdelete = function (id) 
        {
            $scope.PK_CultureMaster = id;
            $scope.modal.center().open();
        };

        //Function to delete CultureMaster records
        $scope.CultureMasterdeleteRecord = function (id) 
        {       
            var jsonobject = {};
            jsonobject.CultureMasterId = id;
            CultureMasterService.deleteById(jsonobject).then(function (response) 
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

        $scope.CultureMastervalidatefield = function (id, type) 
        {
            return CheckControlValue(id, type);
        };
        
        $scope.CultureMastersave = function () 
        {
            var istrue = allValidation('form', 0);
            if (istrue == true) 
            {
                var CultureMasterData = {
                    CultureMasterId : $scope.CultureMasterId,
                    CultureName : $scope.CultureName,
                    CultureCode : $scope.CultureCode,
                    Description : $scope.Description,
                    Active : $scope.Active,
                    CreatedBy : $scope.CreatedBy,
                    CreatedDate : $scope.CreatedDate,
                    UpdatedBy : $scope.UpdatedBy,
                    UpdatedDate : $scope.UpdatedDate,
            };
            CultureMasterService.Save(CultureMasterData).then(function (response) 
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
                $scope.CultureMasterId = "";
                $scope.CultureName = "";
                $scope.CultureCode = "";
                $scope.Description = "";
                $scope.Active = "";
                $scope.CreatedBy = "";
                $scope.CreatedDate = "";
                $scope.UpdatedBy = "";
                $scope.UpdatedDate = "";
    }
    FormComponents.init();
});

