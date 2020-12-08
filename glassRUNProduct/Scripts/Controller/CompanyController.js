    app.controller('CompanyController', function ($scope, $location, CompanyService) {
    $('#form').hide();
    $scope.CompanyAddForm = function () 
    {
        $('#grid').hide();
        $("#form").show('slide', { direction: 'right' }, 500);
        $("#AddButton").css("display", "none");
    };

    $scope.title = "Add Company ";

    var where = "";
    $scope.CompanymainGridOptions = 
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
                    
                        CompanyService.CompanyGridLoad(requestData).then(function (requestData)
                        {

                            $scope.GridData = response.data.d;
                            options.success(response.data.d);
                            $scope.values = options;
                        });
                        CompanyService.getForms(requestData, options);
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
                   
                   { field: CompanyName, type: "string", filterable: { mode: "row" }, },
                   { field: CompanyMnemonic, type: "string", filterable: { mode: "row" }, },
                   { field: AddressLine1, type: "string", filterable: { mode: "row" }, },
                   { field: AddressLine2, type: "string", filterable: { mode: "row" }, },
                   { field: AddressLine3, type: "string", filterable: { mode: "row" }, },
                   { field: City, type: "string", filterable: { mode: "row" }, },
                   { field: State, type: "string", filterable: { mode: "row" }, },
                   { field: CountryId, type: "string", filterable: { mode: "row" }, },
                   { field: Postcode, type: "string", filterable: { mode: "row" }, },
                   { field: Region, type: "string", filterable: { mode: "row" }, },
                   { field: RouteCode, type: "string", filterable: { mode: "row" }, },
                   { field: ZoneCode, type: "string", filterable: { mode: "row" }, },
                   { field: CategoryCode, type: "string", filterable: { mode: "row" }, },
                   { field: BranchPlant, type: "string", filterable: { mode: "row" }, },
                   { field: Email, type: "string", filterable: { mode: "row" }, },
                   { field: TaxId, type: "string", filterable: { mode: "row" }, },
                   { field: SoldTo, type: "string", filterable: { mode: "row" }, },
                   { field: ShipTo, type: "string", filterable: { mode: "row" }, },
                   { field: BillTo, type: "string", filterable: { mode: "row" }, },
                   { field: SiteUrl, type: "string", filterable: { mode: "row" }, },
                   { field: ContactPersonNumber, type: "string", filterable: { mode: "row" }, },
                   { field: ContactPersonName, type: "string", filterable: { mode: "row" }, },
                   { field: Logo, type: "string", filterable: { mode: "row" }, },
                   { field: Header, type: "string", filterable: { mode: "row" }, },
                   { field: Footer, type: "string", filterable: { mode: "row" }, },
                   
                   
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
            { "template": "<button class=\"k-button\" ng-click=\"CompanyEdit(#=CompanyId#)\">Edit</button>", "title": "Edit", "width": "250px" },
            { "template": "<button class=\"k-button\" ng-click=\"Companydelete(#=CompanyId#)\">Delete</button>", "title": "Delete",  "width": "250px" }
            ],
        }
    
        //Function to edit Company records
        $scope.CompanyEdit = function (id) 
        {
            //TODO call remote service to delete item....
            var jsonobject = {};
            jsonobject.CompanyId = id;
            CompanyService.getById(jsonobject).then(function (response) 
            {
                var Companydata = response.data.d;
                $scope.CompanyId = Companydata.CompanyList[0].CompanyId;
                $scope.CompanyName = Companydata.CompanyList[0].CompanyName;
                $scope.CompanyMnemonic = Companydata.CompanyList[0].CompanyMnemonic;
                $scope.AddressLine1 = Companydata.CompanyList[0].AddressLine1;
                $scope.AddressLine2 = Companydata.CompanyList[0].AddressLine2;
                $scope.AddressLine3 = Companydata.CompanyList[0].AddressLine3;
                $scope.City = Companydata.CompanyList[0].City;
                $scope.State = Companydata.CompanyList[0].State;
                $scope.CountryId = Companydata.CompanyList[0].CountryId;
                $scope.Postcode = Companydata.CompanyList[0].Postcode;
                $scope.Region = Companydata.CompanyList[0].Region;
                $scope.RouteCode = Companydata.CompanyList[0].RouteCode;
                $scope.ZoneCode = Companydata.CompanyList[0].ZoneCode;
                $scope.CategoryCode = Companydata.CompanyList[0].CategoryCode;
                $scope.BranchPlant = Companydata.CompanyList[0].BranchPlant;
                $scope.Email = Companydata.CompanyList[0].Email;
                $scope.TaxId = Companydata.CompanyList[0].TaxId;
                $scope.SoldTo = Companydata.CompanyList[0].SoldTo;
                $scope.ShipTo = Companydata.CompanyList[0].ShipTo;
                $scope.BillTo = Companydata.CompanyList[0].BillTo;
                $scope.SiteUrl = Companydata.CompanyList[0].SiteUrl;
                $scope.ContactPersonNumber = Companydata.CompanyList[0].ContactPersonNumber;
                $scope.ContactPersonName = Companydata.CompanyList[0].ContactPersonName;
                $scope.Logo = Companydata.CompanyList[0].Logo;
                $scope.Header = Companydata.CompanyList[0].Header;
                $scope.Footer = Companydata.CompanyList[0].Footer;
                $scope.CreatedBy = Companydata.CompanyList[0].CreatedBy;
                $scope.CreatedDate = Companydata.CompanyList[0].CreatedDate;
                $scope.ModifiedBy = Companydata.CompanyList[0].ModifiedBy;
                $scope.ModifiedDate = Companydata.CompanyList[0].ModifiedDate;
                $scope.IsActive = Companydata.CompanyList[0].IsActive;
                $scope.SequenceNo = Companydata.CompanyList[0].SequenceNo;
                $scope.Field1 = Companydata.CompanyList[0].Field1;
                $scope.Field2 = Companydata.CompanyList[0].Field2;
                $scope.Field3 = Companydata.CompanyList[0].Field3;
                $scope.Field4 = Companydata.CompanyList[0].Field4;
                $scope.Field5 = Companydata.CompanyList[0].Field5;
                $scope.Field6 = Companydata.CompanyList[0].Field6;
                $scope.Field7 = Companydata.CompanyList[0].Field7;
                $scope.Field8 = Companydata.CompanyList[0].Field8;
                $scope.Field9 = Companydata.CompanyList[0].Field9;
                $scope.Field10 = Companydata.CompanyList[0].Field10;
                $scope.AddForm();
            });
        };
    
        //Function to call out pop up to delete Company records
        $scope.Companydelete = function (id) 
        {
            $scope.PK_Company = id;
            $scope.modal.center().open();
        };

        //Function to delete Company records
        $scope.CompanydeleteRecord = function (id) 
        {       
            var jsonobject = {};
            jsonobject.CompanyId = id;
            CompanyService.deleteById(jsonobject).then(function (response) 
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

        $scope.Companyvalidatefield = function (id, type) 
        {
            return CheckControlValue(id, type);
        };
        
        $scope.Companysave = function () 
        {
            var istrue = allValidation('form', 0);
            if (istrue == true) 
            {
                var CompanyData = {
                    CompanyId : $scope.CompanyId,
                    CompanyName : $scope.CompanyName,
                    CompanyMnemonic : $scope.CompanyMnemonic,
                    AddressLine1 : $scope.AddressLine1,
                    AddressLine2 : $scope.AddressLine2,
                    AddressLine3 : $scope.AddressLine3,
                    City : $scope.City,
                    State : $scope.State,
                    CountryId : $scope.CountryId,
                    Postcode : $scope.Postcode,
                    Region : $scope.Region,
                    RouteCode : $scope.RouteCode,
                    ZoneCode : $scope.ZoneCode,
                    CategoryCode : $scope.CategoryCode,
                    BranchPlant : $scope.BranchPlant,
                    Email : $scope.Email,
                    TaxId : $scope.TaxId,
                    SoldTo : $scope.SoldTo,
                    ShipTo : $scope.ShipTo,
                    BillTo : $scope.BillTo,
                    SiteUrl : $scope.SiteUrl,
                    ContactPersonNumber : $scope.ContactPersonNumber,
                    ContactPersonName : $scope.ContactPersonName,
                    Logo : $scope.Logo,
                    Header : $scope.Header,
                    Footer : $scope.Footer,
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
            CompanyService.Save(CompanyData).then(function (response) 
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
                $scope.CompanyId = "";
                $scope.CompanyName = "";
                $scope.CompanyMnemonic = "";
                $scope.AddressLine1 = "";
                $scope.AddressLine2 = "";
                $scope.AddressLine3 = "";
                $scope.City = "";
                $scope.State = "";
                $scope.CountryId = "";
                $scope.Postcode = "";
                $scope.Region = "";
                $scope.RouteCode = "";
                $scope.ZoneCode = "";
                $scope.CategoryCode = "";
                $scope.BranchPlant = "";
                $scope.Email = "";
                $scope.TaxId = "";
                $scope.SoldTo = "";
                $scope.ShipTo = "";
                $scope.BillTo = "";
                $scope.SiteUrl = "";
                $scope.ContactPersonNumber = "";
                $scope.ContactPersonName = "";
                $scope.Logo = "";
                $scope.Header = "";
                $scope.Footer = "";
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



        //Function to Get All DeliveryLocation By DeliveryLocationId
        $scope.GetDeliverylocationById = function (id) {            
            var requestLayerData =
                {
                    ServicesAction: 'GetAllDeliveryLocationListById',
                    DeliveryLocationId: id
                };

            //var stringfyjson = JSON.stringify(requestData);
            var jsonLayerobject = {};
            jsonLayerobject.Json = requestLayerData;
            GrRequestService.ProcessRequest(jsonLayerobject).then(function (response) {
                
                var responseStr = response.data.Json;
            });
        };




        //Function to Get Company Detail By CompanyId
        $scope.GetCompanyDetailsById = function (id) {
            var requestLayerData =
                {
                    ServicesAction: 'GetAllCompanyListById',
                    CompanyId: id
                };

            //var stringfyjson = JSON.stringify(requestData);
            var jsonLayerobject = {};
            jsonLayerobject.Json = requestLayerData;
            GrRequestService.ProcessRequest(jsonLayerobject).then(function (response) {
                
                var responseStr = response.data.Json;
            });
        };






    FormComponents.init();
});

