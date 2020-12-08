    app.controller('TransporterController', function ($scope, $location, TransporterService) {
    $('#form').hide();
    $scope.TransporterAddForm = function () 
    {
        $('#grid').hide();
        $("#form").show('slide', { direction: 'right' }, 500);
        $("#AddButton").css("display", "none");
    };

    $scope.title = "Add Transporter ";

    var where = "";
    $scope.TransportermainGridOptions = 
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
                    
                        TransporterService.TransporterGridLoad(requestData).then(function (requestData)
                        {

                            $scope.GridData = response.data.d;
                            options.success(response.data.d);
                            $scope.values = options;
                        });
                        TransporterService.getForms(requestData, options);
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
                   
                   { field: TransporterName, type: "string", filterable: { mode: "row" }, },
                   { field: TransporterCode, type: "string", filterable: { mode: "row" }, },
                   { field: TypeOfCarrier, type: "string", filterable: { mode: "row" }, },
                   { field: AddressLine1, type: "string", filterable: { mode: "row" }, },
                   { field: AddressLine2, type: "string", filterable: { mode: "row" }, },
                   { field: AddressLine3, type: "string", filterable: { mode: "row" }, },
                   { field: City, type: "string", filterable: { mode: "row" }, },
                   { field: State, type: "string", filterable: { mode: "row" }, },
                   { field: CountryId, type: "string", filterable: { mode: "row" }, },
                   { field: Postcode, type: "string", filterable: { mode: "row" }, },
                   { field: Region, type: "string", filterable: { mode: "row" }, },
                   { field: RouteCode, type: "string", filterable: { mode: "row" }, },
                   { field: BranchPlant, type: "string", filterable: { mode: "row" }, },
                   { field: Email, type: "string", filterable: { mode: "row" }, },
                   { field: SiteUrl, type: "string", filterable: { mode: "row" }, },
                   { field: ContactPersonNumber, type: "string", filterable: { mode: "row" }, },
                   { field: ContactPersonName, type: "string", filterable: { mode: "row" }, },
                   { field: Logo, type: "string", filterable: { mode: "row" }, },
                   
                   
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
            { "template": "<button class=\"k-button\" ng-click=\"TransporterEdit(#=TransporterId#)\">Edit</button>", "title": "Edit", "width": "250px" },
            { "template": "<button class=\"k-button\" ng-click=\"Transporterdelete(#=TransporterId#)\">Delete</button>", "title": "Delete",  "width": "250px" }
            ],
        }
    
        //Function to edit Transporter records
        $scope.TransporterEdit = function (id) 
        {
            //TODO call remote service to delete item....
            var jsonobject = {};
            jsonobject.TransporterId = id;
            TransporterService.getById(jsonobject).then(function (response) 
            {
                var Transporterdata = response.data.d;
                $scope.TransporterId = Transporterdata.TransporterList[0].TransporterId;
                $scope.TransporterName = Transporterdata.TransporterList[0].TransporterName;
                $scope.TransporterCode = Transporterdata.TransporterList[0].TransporterCode;
                $scope.TypeOfCarrier = Transporterdata.TransporterList[0].TypeOfCarrier;
                $scope.AddressLine1 = Transporterdata.TransporterList[0].AddressLine1;
                $scope.AddressLine2 = Transporterdata.TransporterList[0].AddressLine2;
                $scope.AddressLine3 = Transporterdata.TransporterList[0].AddressLine3;
                $scope.City = Transporterdata.TransporterList[0].City;
                $scope.State = Transporterdata.TransporterList[0].State;
                $scope.CountryId = Transporterdata.TransporterList[0].CountryId;
                $scope.Postcode = Transporterdata.TransporterList[0].Postcode;
                $scope.Region = Transporterdata.TransporterList[0].Region;
                $scope.RouteCode = Transporterdata.TransporterList[0].RouteCode;
                $scope.BranchPlant = Transporterdata.TransporterList[0].BranchPlant;
                $scope.Email = Transporterdata.TransporterList[0].Email;
                $scope.SiteUrl = Transporterdata.TransporterList[0].SiteUrl;
                $scope.ContactPersonNumber = Transporterdata.TransporterList[0].ContactPersonNumber;
                $scope.ContactPersonName = Transporterdata.TransporterList[0].ContactPersonName;
                $scope.Logo = Transporterdata.TransporterList[0].Logo;
                $scope.CreatedBy = Transporterdata.TransporterList[0].CreatedBy;
                $scope.CreatedDate = Transporterdata.TransporterList[0].CreatedDate;
                $scope.ModifiedBy = Transporterdata.TransporterList[0].ModifiedBy;
                $scope.ModifiedDate = Transporterdata.TransporterList[0].ModifiedDate;
                $scope.IsActive = Transporterdata.TransporterList[0].IsActive;
                $scope.SequenceNo = Transporterdata.TransporterList[0].SequenceNo;
                $scope.Field1 = Transporterdata.TransporterList[0].Field1;
                $scope.Field2 = Transporterdata.TransporterList[0].Field2;
                $scope.Field3 = Transporterdata.TransporterList[0].Field3;
                $scope.Field4 = Transporterdata.TransporterList[0].Field4;
                $scope.Field5 = Transporterdata.TransporterList[0].Field5;
                $scope.Field6 = Transporterdata.TransporterList[0].Field6;
                $scope.Field7 = Transporterdata.TransporterList[0].Field7;
                $scope.Field8 = Transporterdata.TransporterList[0].Field8;
                $scope.Field9 = Transporterdata.TransporterList[0].Field9;
                $scope.Field10 = Transporterdata.TransporterList[0].Field10;
                $scope.AddForm();
            });
        };
    
        //Function to call out pop up to delete Transporter records
        $scope.Transporterdelete = function (id) 
        {
            $scope.PK_Transporter = id;
            $scope.modal.center().open();
        };

        //Function to delete Transporter records
        $scope.TransporterdeleteRecord = function (id) 
        {       
            var jsonobject = {};
            jsonobject.TransporterId = id;
            TransporterService.deleteById(jsonobject).then(function (response) 
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

        $scope.Transportervalidatefield = function (id, type) 
        {
            return CheckControlValue(id, type);
        };
        
        $scope.Transportersave = function () 
        {
            var istrue = allValidation('form', 0);
            if (istrue == true) 
            {
                var TransporterData = {
                    TransporterId : $scope.TransporterId,
                    TransporterName : $scope.TransporterName,
                    TransporterCode : $scope.TransporterCode,
                    TypeOfCarrier : $scope.TypeOfCarrier,
                    AddressLine1 : $scope.AddressLine1,
                    AddressLine2 : $scope.AddressLine2,
                    AddressLine3 : $scope.AddressLine3,
                    City : $scope.City,
                    State : $scope.State,
                    CountryId : $scope.CountryId,
                    Postcode : $scope.Postcode,
                    Region : $scope.Region,
                    RouteCode : $scope.RouteCode,
                    BranchPlant : $scope.BranchPlant,
                    Email : $scope.Email,
                    SiteUrl : $scope.SiteUrl,
                    ContactPersonNumber : $scope.ContactPersonNumber,
                    ContactPersonName : $scope.ContactPersonName,
                    Logo : $scope.Logo,
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
            TransporterService.Save(TransporterData).then(function (response) 
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
                $scope.TransporterId = "";
                $scope.TransporterName = "";
                $scope.TransporterCode = "";
                $scope.TypeOfCarrier = "";
                $scope.AddressLine1 = "";
                $scope.AddressLine2 = "";
                $scope.AddressLine3 = "";
                $scope.City = "";
                $scope.State = "";
                $scope.CountryId = "";
                $scope.Postcode = "";
                $scope.Region = "";
                $scope.RouteCode = "";
                $scope.BranchPlant = "";
                $scope.Email = "";
                $scope.SiteUrl = "";
                $scope.ContactPersonNumber = "";
                $scope.ContactPersonName = "";
                $scope.Logo = "";
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

