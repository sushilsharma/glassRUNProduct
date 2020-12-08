app.controller('EnquiryController', function ($scope, $location, EnquiryService) {
    $('#form').hide();
    $scope.EnquiryAddForm = function () {
        $('#grid').hide();
        $("#form").show('slide', { direction: 'right' }, 500);
        $("#AddButton").css("display", "none");
    };

    $scope.title = "Add Enquiry ";

    var where = "";
    $scope.EnquirymainGridOptions =
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

                            if (options.data.sort) {
                                if (options.data.sort.length > 0) {
                                    var sortField = options.data.sort[0].field;
                                    if (options.data.sort[0].dir == 'asc') {
                                        var sortOrder = ' asc';
                                    }
                                    else if (options.data.sort[0].dir == 'desc') {
                                        var sortOrder = ' desc';
                                    };
                                    orderby = sortField + sortOrder;
                                }
                            }
                            if (options.data && options.data.filter && options.data.filter.filters) {
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

                            EnquiryService.EnquiryGridLoad(requestData).then(function (requestData) {

                                $scope.GridData = response.data.d;
                                options.success(response.data.d);
                                $scope.values = options;
                            });
                            EnquiryService.getForms(requestData, options);
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
        columns: [
               { field: EnquiryAutoNumber, type: "string", filterable: { mode: "row" }, },
               { field: DeliveryLocationId, type: "string", filterable: { mode: "row" }, },
               { field: PrimaryAddress, type: "string", filterable: { mode: "row" }, },
               { field: SecondaryAddress, type: "string", filterable: { mode: "row" }, },
        { "template": "<button class=\"k-button\" ng-click=\"EnquiryEdit(#=EnquiryId#)\">Edit</button>", "title": "Edit", "width": "250px" },
        { "template": "<button class=\"k-button\" ng-click=\"Enquirydelete(#=EnquiryId#)\">Delete</button>", "title": "Delete", "width": "250px" }
        ],
    }

    //Function to edit Enquiry records
    $scope.EnquiryEdit = function (id) {
        //TODO call remote service to delete item....
        var jsonobject = {};
        jsonobject.EnquiryId = id;
        EnquiryService.getById(jsonobject).then(function (response) {
            var Enquirydata = response.data.d;
            $scope.EnquiryId = Enquirydata.EnquiryList[0].EnquiryId;
            $scope.EnquiryAutoNumber = Enquirydata.EnquiryList[0].EnquiryAutoNumber;
            $scope.CompanyId = Enquirydata.EnquiryList[0].CompanyId;
            $scope.RequestDate = Enquirydata.EnquiryList[0].RequestDate;
            $scope.DeliveryLocationId = Enquirydata.EnquiryList[0].DeliveryLocationId;
            $scope.PrimaryAddress = Enquirydata.EnquiryList[0].PrimaryAddress;
            $scope.SecondaryAddress = Enquirydata.EnquiryList[0].SecondaryAddress;
            $scope.OrderProposedEtd = Enquirydata.EnquiryList[0].OrderProposedEtd;
            $scope.Remarks = Enquirydata.EnquiryList[0].Remarks;
            $scope.PreviousState = Enquirydata.EnquiryList[0].PreviousState;
            $scope.CurrentState = Enquirydata.EnquiryList[0].CurrentState;
            $scope.CreatedBy = Enquirydata.EnquiryList[0].CreatedBy;
            $scope.CreatedDate = Enquirydata.EnquiryList[0].CreatedDate;
            $scope.ModifiedBy = Enquirydata.EnquiryList[0].ModifiedBy;
            $scope.ModifiedDate = Enquirydata.EnquiryList[0].ModifiedDate;
            $scope.IsActive = Enquirydata.EnquiryList[0].IsActive;
            $scope.SequenceNo = Enquirydata.EnquiryList[0].SequenceNo;          
            $scope.AddForm();
        });
    };

    //Function to call out pop up to delete Enquiry records
    $scope.Enquirydelete = function (id) {
        $scope.PK_Enquiry = id;
        $scope.modal.center().open();
    };

    //Function to delete Enquiry records
    $scope.EnquirydeleteRecord = function (id) {
        var jsonobject = {};
        jsonobject.EnquiryId = id;
        EnquiryService.deleteById(jsonobject).then(function (response) {

        });
        gridCallBack();
        $scope.modal.close();
    };
    //PLACE CODE HERE TO POPULATE DROP DOWN LISTS
    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.mainGridOptions.dataSource.transport.read($scope.values);
        }
    };

    $scope.Enquiryvalidatefield = function (id, type) {
        return CheckControlValue(id, type);
    };

    $scope.Enquirysave = function () {
        var istrue = allValidation('form', 0);
        if (istrue == true) {
            var EnquiryData = {
                EnquiryId: $scope.EnquiryId,
                EnquiryAutoNumber: $scope.EnquiryAutoNumber,
                CompanyId: $scope.CompanyId,
                RequestDate: $scope.RequestDate,
                DeliveryLocationId: $scope.DeliveryLocationId,
                PrimaryAddress: $scope.PrimaryAddress,
                SecondaryAddress: $scope.SecondaryAddress,
                OrderProposedEtd: $scope.OrderProposedEtd,
                Remarks: $scope.Remarks,
                PreviousState: $scope.PreviousState,
                CurrentState: $scope.CurrentState,
                CreatedBy: $scope.CreatedBy,
                CreatedDate: $scope.CreatedDate,
                ModifiedBy: $scope.ModifiedBy,
                ModifiedDate: $scope.ModifiedDate,
                IsActive: $scope.IsActive,
                SequenceNo: $scope.SequenceNo,
               
            };
            EnquiryService.Save(EnquiryData).then(function (response) {
                $scope.reset();
            });

            $('#form').hide();
            $("#grid").show('slide', { direction: 'right' }, 500);
            $("#AddButton").css("display", "block");
        }
        else {

        }
    };

    $scope.reset = function () {
        $scope.EnquiryId = "";
        $scope.EnquiryAutoNumber = "";
        $scope.CompanyId = "";
        $scope.RequestDate = "";
        $scope.DeliveryLocationId = "";
        $scope.PrimaryAddress = "";
        $scope.SecondaryAddress = "";
        $scope.OrderProposedEtd = "";
        $scope.Remarks = "";
        $scope.PreviousState = "";
        $scope.CurrentState = "";
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

