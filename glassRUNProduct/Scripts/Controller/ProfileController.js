    app.controller('ProfileController', function ($scope, $location, ProfileService) {
    $('#form').hide();
    $scope.ProfileAddForm = function () 
    {
        $('#grid').hide();
        $("#form").show('slide', { direction: 'right' }, 500);
        $("#AddButton").css("display", "none");
    };

    $scope.title = "Add Profile ";

    var where = "";
    $scope.ProfilemainGridOptions = 
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
                    
                        ProfileService.ProfileGridLoad(requestData).then(function (requestData)
                        {

                            $scope.GridData = response.data.d;
                            options.success(response.data.d);
                            $scope.values = options;
                        });
                        ProfileService.getForms(requestData, options);
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
                   
                   { field: Name, type: "string", filterable: { mode: "row" }, },
                   { field: EmailId, type: "string", filterable: { mode: "row" }, },
                   { field: ContactNumber, type: "string", filterable: { mode: "row" }, },
                   { field: UserProfilePicture, type: "string", filterable: { mode: "row" }, },
                   
                   
                   
                   { field: CreatedFromIpAddress, type: "string", filterable: { mode: "row" }, },
                   
                   
                   { field: UpdatedFromIpAddress, type: "string", filterable: { mode: "row" }, },
            { "template": "<button class=\"k-button\" ng-click=\"ProfileEdit(#=ProfileId#)\">Edit</button>", "title": "Edit", "width": "250px" },
            { "template": "<button class=\"k-button\" ng-click=\"Profiledelete(#=ProfileId#)\">Delete</button>", "title": "Delete",  "width": "250px" }
            ],
        }
    
        //Function to edit Profile records
        $scope.ProfileEdit = function (id) 
        {
            //TODO call remote service to delete item....
            var jsonobject = {};
            jsonobject.ProfileId = id;
            ProfileService.getById(jsonobject).then(function (response) 
            {
                var Profiledata = response.data.d;
                $scope.ProfileId = Profiledata.ProfileList[0].ProfileId;
                $scope.Name = Profiledata.ProfileList[0].Name;
                $scope.EmailId = Profiledata.ProfileList[0].EmailId;
                $scope.ContactNumber = Profiledata.ProfileList[0].ContactNumber;
                $scope.UserProfilePicture = Profiledata.ProfileList[0].UserProfilePicture;
                $scope.IsActive = Profiledata.ProfileList[0].IsActive;
                $scope.CreatedDate = Profiledata.ProfileList[0].CreatedDate;
                $scope.CreatedBy = Profiledata.ProfileList[0].CreatedBy;
                $scope.CreatedFromIpAddress = Profiledata.ProfileList[0].CreatedFromIpAddress;
                $scope.UpdatedDate = Profiledata.ProfileList[0].UpdatedDate;
                $scope.UpdatedBy = Profiledata.ProfileList[0].UpdatedBy;
                $scope.UpdatedFromIpAddress = Profiledata.ProfileList[0].UpdatedFromIpAddress;
                $scope.AddForm();
            });
        };
    
        //Function to call out pop up to delete Profile records
        $scope.Profiledelete = function (id) 
        {
            $scope.PK_UserDetail_1 = id;
            $scope.modal.center().open();
        };

        //Function to delete Profile records
        $scope.ProfiledeleteRecord = function (id) 
        {       
            var jsonobject = {};
            jsonobject.ProfileId = id;
            ProfileService.deleteById(jsonobject).then(function (response) 
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

        $scope.Profilevalidatefield = function (id, type) 
        {
            return CheckControlValue(id, type);
        };
        
        $scope.Profilesave = function () 
        {
            var istrue = allValidation('form', 0);
            if (istrue == true) 
            {
                var ProfileData = {
                    ProfileId : $scope.ProfileId,
                    Name : $scope.Name,
                    EmailId : $scope.EmailId,
                    ContactNumber : $scope.ContactNumber,
                    UserProfilePicture : $scope.UserProfilePicture,
                    IsActive : $scope.IsActive,
                    CreatedDate : $scope.CreatedDate,
                    CreatedBy : $scope.CreatedBy,
                    CreatedFromIpAddress : $scope.CreatedFromIpAddress,
                    UpdatedDate : $scope.UpdatedDate,
                    UpdatedBy : $scope.UpdatedBy,
                    UpdatedFromIpAddress : $scope.UpdatedFromIpAddress,
            };
            ProfileService.Save(ProfileData).then(function (response) 
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
                $scope.ProfileId = "";
                $scope.Name = "";
                $scope.EmailId = "";
                $scope.ContactNumber = "";
                $scope.UserProfilePicture = "";
                $scope.IsActive = "";
                $scope.CreatedDate = "";
                $scope.CreatedBy = "";
                $scope.CreatedFromIpAddress = "";
                $scope.UpdatedDate = "";
                $scope.UpdatedBy = "";
                $scope.UpdatedFromIpAddress = "";
    }
    FormComponents.init();
});

