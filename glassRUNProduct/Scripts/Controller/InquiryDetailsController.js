angular.module("glassRUNProduct").controller('InquiryDetailsController', function ($scope, $rootScope, $sessionStorage, $state, $location, $ionicModal, $filter, GrRequestService) {
    
    $scope.ProductCodes = '';
    $rootScope.EnquiryRejected = false;
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }


    LoadActiveVariables($sessionStorage, $state, $rootScope);
    

    // Product Multiselect Autocomplete box.
    $scope.ProductSelectedList = [];
    $scope.ProductList = [];
    $scope.MultiSelectDropdownSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }

    $scope.LoadProducts = function () {
        var requestData =
            {
                ServicesAction: 'LoadAllProducts',
                CompanyId: $rootScope.CompanyId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data;
            $scope.ProductList = resoponsedata.Item.ItemList;
        });
    }
    $scope.LoadProducts();


    $scope.SearchEnquiryByProductName = function () {
        
        $rootScope.Throbber.Visible = true;
        $scope.ProductCodes = '';
        if ($scope.ProductSelectedList.length > 0) {
            for (var i = 0; i < $scope.ProductSelectedList.length; i++) {
                $scope.ProductCodes = $scope.ProductCodes + "," + $scope.ProductSelectedList[i].Id;
            }
            $scope.ProductCodes = $scope.ProductCodes.substr(1);

            gridCallBack();

        } else {

            gridCallBack();
        }

    }

    $scope.ProductSearchCriteria = "";
    $scope.SearchEnquiryIncludeByProductName = function () {
        
        $scope.ProductSearchCriteria = "Include";
        $scope.SearchEnquiryByProductName();
    }

    $scope.SearchEnquiryExcludeByProductName = function () {
        
        $scope.ProductSearchCriteria = "Exclude";
        $scope.SearchEnquiryByProductName();
    }

    $scope.ClearProductSearch = function () {
        
        $scope.ProductSearchCriteria = "";
        $scope.ProductCodes = "";
        $scope.ProductSelectedList = [];
        gridCallBack();
    }





    $scope.FeedbackVariable = {
        OverAll: true,
        Specific: false
    }

    $scope.statusFilter = function (element) {
        $scope.StatusFilterEelement = element;
        var lookuplist = $rootScope.StatusResourcesList.filter(function (el) { return el.CultureId === $rootScope.CultureId });
        var lookuplistName = [];
        if (lookuplist.length > 0) {
            for (var i = 0; i < lookuplist.length; i++) {
                lookuplistName.push(lookuplist[i].ResourceValue);
            }
        }
        element.kendoDropDownList({
            dataSource: lookuplistName,
            optionLabel: "Status",
            valuePrimitive: true,
        });
    }


    $scope.datepickerfilter = function (element) {
        
        element.kendoDatePicker({ format: "dd/MM/yyyy", parseFormats: "{0:dd/MM/yyyy}", valuePrimitive: true });
    }


    $scope.InquiryDetailsGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) {


                        var EnquiryAutoNumber = "";
                        var EnquiryAutoNumberCriteria = "";

                        var SONumber = "";
                        var SONumberCriteria = "";

                        var PurchaseOrderNumber = "";
                        var PurchaseOrderNumberCriteria = "";

                        var DeliveryLocation = "";
                        var DeliveryLocationCriteria = "";

                        var Status = "";
                        var StatusCriteria = "";

                        var TruckSize = "";
                        var TruckSizeCriteria = "";

                        var Gratis = "";
                        var GratisCriteria = "";

                        var Empties = "";
                        var EmptiesCriteria = "";

                        var CreatedDate = "";
                        var CreatedDateCriteria = "";

                        var OrderProposedETD = "";
                        var OrderProposedETDCriteria = "";

                        var RequestDate = "";
                        var RequestDateCriteria = "";


                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };
                            //todo : identify column and oprator in search grid functionality is hard coded, we have to remove hard coded part.

                            for (var i = 0; i < options.data.filter.filters.length; i++) {

                                if (options.data.filter.filters[i].field === "EnquiryAutoNumber") {
                                    EnquiryAutoNumber = options.data.filter.filters[i].value;
                                    EnquiryAutoNumberCriteria = options.data.filter.filters[i].operator;

                                }
                                if (options.data.filter.filters[i].field === "SalesOrderNumber") {
                                    SONumber = options.data.filter.filters[i].value;
                                    SONumberCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "PurchaseOrderNumber") {
                                    PurchaseOrderNumber = options.data.filter.filters[i].value;
                                    PurchaseOrderNumberCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "DeliveryLocation") {
                                    DeliveryLocation = options.data.filter.filters[i].value;
                                    DeliveryLocationCriteria = options.data.filter.filters[i].operator;

                                }
                                if (options.data.filter.filters[i].field === "Status") {
                                    Status = options.data.filter.filters[i].value;
                                    StatusCriteria = options.data.filter.filters[i].operator;

                                }
                                if (options.data.filter.filters[i].field === "TruckSize") {
                                    TruckSize = options.data.filter.filters[i].value;
                                    TruckSizeCriteria = options.data.filter.filters[i].operator;

                                }
                                if (options.data.filter.filters[0].field === "AssociatedOrder") {
                                    Gratis = options.data.filter.filters[0].value;
                                    GratisCriteria = options.data.filter.filters[0].operator;

                                }

                                if (options.data.filter.filters[i].field === "Empties") {
                                    if (options.data.filter.filters[i].value === 'Ok') {
                                        Empties = 'C';
                                    }
                                    else if (options.data.filter.filters[i].value === 'Not Ok') {
                                        Empties = 'W';
                                    }

                                    EmptiesCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "CreatedDate") {
                                    
                                    CreatedDate = options.data.filter.filters[i].value;
                                    CreatedDate = new Date(CreatedDate);
                                    CreatedDate = $filter('date')(CreatedDate, "dd/MM/yyyy");
                                    CreatedDateCriteria = options.data.filter.filters[i].operator;

                                }
                                if (options.data.filter.filters[i].field === "OrderProposedETD") {
                                    OrderProposedETD = options.data.filter.filters[i].value;
                                    OrderProposedETD = new Date(OrderProposedETD);
                                    OrderProposedETD = $filter('date')(OrderProposedETD, "dd/MM/yyyy");
                                    OrderProposedETDCriteria = options.data.filter.filters[i].operator;

                                }
                                if (options.data.filter.filters[i].field === "RequestDate") {
                                    RequestDate = options.data.filter.filters[0].value;
                                    RequestDate = new Date(RequestDate);
                                    RequestDate = $filter('date')(RequestDate, "dd/MM/yyyy");
                                    RequestDateCriteria = options.data.filter.filters[i].operator;

                                }



                            }

                            

                        }

                        
                        var page = $location.absUrl().split('#/')[1];
                        $scope.ViewControllerName = page;

                        $scope.pageIndex = options.data.page - 1;
                        $scope.pageSize = options.data.pageSize;
                        var requestData =
                            {
                                ServicesAction: 'LoadEnquiryDetails',
                                UserId: $rootScope.UserId,
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                EnquiryAutoNumber: EnquiryAutoNumber,
                                EnquiryAutoNumberCriteria: EnquiryAutoNumberCriteria,
                                PurchaseOrderNumber: PurchaseOrderNumber,
                                PurchaseOrderNumberCriteria: PurchaseOrderNumberCriteria,
                                SONumber: SONumber,
                                SONumberCriteria: SONumberCriteria,
                                DeliveryLocation: DeliveryLocation,
                                DeliveryLocationCriteria: DeliveryLocationCriteria,
                                Status: Status,
                                StatusCriteria: StatusCriteria,
                                TruckSize: TruckSize,
                                TruckSizeCriteria: TruckSizeCriteria,
                                Gratis: Gratis,
                                GratisCriteria: GratisCriteria,
                                CreatedDate: CreatedDate,
                                CreatedDateCriteria: CreatedDateCriteria,
                                OrderProposedETD: OrderProposedETD,
                                OrderProposedETDCriteria: OrderProposedETDCriteria,
                                RequestDate: RequestDate,
                                RequestDateCriteria: RequestDateCriteria,
                                CultureId: $rootScope.CultureId,
                                RoleMasterId: $rootScope.RoleId,
                                Empties: Empties,
                                EmptiesCriteria: EmptiesCriteria,
                                ProductCode: $scope.ProductCodes,
                                ProductSearchCriteria: $scope.ProductSearchCriteria
                            };
                        $scope.RequestDataFilter = requestData;

                        var consolidateApiParamater =
                            {
                                Json: requestData,
                            };

                        
                        var gridrequestData =
                            {
                                ServicesAction: 'LoadGridConfiguration',
                                RoleId: $rootScope.RoleId,
                                UserId: $rootScope.UserId,
                                PageName: $rootScope.PageName,
                                ControllerName: page
                            };

                        //var stringfyjson = JSON.stringify(requestData);
                        var gridconsolidateApiParamater =
                            {
                                Json: gridrequestData,
                            };


                        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {

                            $scope.GridColumnList = [];

                            if (response.data.Json != undefined) {
                                $scope.GridColumnList = response.data.Json.GridColumnList;
                            } else {

                            }



                            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                                

                                var totalcount = null;
                                var ListData = null;
                                var resoponsedata = response.data;

                                if (resoponsedata !== null) {

                                    if (resoponsedata.Json !== undefined) {
                                        if (resoponsedata.Json.EnquiryList.length > 0) {
                                            totalcount = resoponsedata.Json.EnquiryList[0].TotalCount;
                                            ListData = resoponsedata.Json.EnquiryList;
                                        }

                                    } else {
                                        totalcount = 0;
                                        ListData = [];
                                    }


                                }
                                var inquiryList = {
                                    data: ListData,
                                    totalRecords: totalcount
                                }


                                $scope.GridData = inquiryList;
                                options.success(inquiryList);
                                $scope.values = options;
                                $rootScope.Throbber.Visible = false;
                                //LoadPageFieldAccessByRoleOrUserWise(GrRequestService, options, inquiryList, $rootScope, 'InquiryListGrid', $rootScope.RoleId, $rootScope.UserId);


                            });
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
                    field: "CreatedDate", title: $rootScope.resData.res_GridColumn_CreatedDate, type: "date",
                    filterable:
                    {
                        cell:
                        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy" },
                        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy"
                    }, parseFormats: "{0:dd/MM/yyyy}", format: "{0:dd/MM/yyyy}", width: "175px"
                },
                {
                    field: "EnquiryAutoNumber", title: "Enquiry #", tooltip: $rootScope.resData.res_GridColumn_EnquiryAutoNumber,
                    template: '<a ng-click=\"LoadEnquiryView(#=EnquiryId#)\" class="graybgfont" ng-class=\'{greenbgfont: #:ReturnableItemCheck# === 1 , "redbgfont": #:ReturnableItemCheck# === 0 }\'>#:EnquiryAutoNumber#</a>', type: "string", filterable: { mode: "row", extra: false }, width: "120px"
                },

                {
                    field: "SalesOrderNumber", template: '<a  class="graybgfont">#:SalesOrderNumber#</a>',
                    title: $rootScope.resData.res_GridColumn_SalesOrderNumber, type: "string", filterable: { mode: "row", extra: false }, width: "120px"
                },
                //{
                //    field: "PurchaseOrderNumber", template: '<a  class="graybgfont">#:PurchaseOrderNumber#</a>',
                //    title: $rootScope.resData.res_GridColumn_PurchaseOrderNumber, type: "string", filterable: { mode: "row", extra: false },
                //    width: "120px"
                //},
                {
                    field: "DeliveryLocation",
                    title: $rootScope.resData.res_GridColumn_DeliveryLocation,
                    type: "string", filterable: { mode: "row", extra: false }, width: "100px"
                },
                {
                    field: "TruckCapacityWeight", template: '#:TruckSize#',
                    title: $rootScope.resData.res_GridColumn_TruckCapacityWeight,
                    type: "string", filterable: { mode: "row", extra: false }, width: "100px"
                },
                {
                    field: "AssociatedOrder", title: $rootScope.resData.res_GridColumn_AssociatedOrder, type: "string", filterable: { mode: "row", extra: false }, width: "120px"
                },

                //{
                //    field: "OrderProposedETD", title: $rootScope.resData.res_GridColumn_OrderProposedETD, type: "date", filterable:
                //    {
                //        cell:
                //        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy" },
                //        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy"
                //    }, parseFormats: "{0:dd/MM/yyyy}", format: "{0:dd/MM/yyyy}", width: "175px"
                //},

                {
                    field: "RequestDate", title: $rootScope.resData.res_CustomerGridColumn_RequestedDate, type: "date", filterable:
                    {
                        cell:
                        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy" },
                        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy"
                    }, parseFormats: "{0:dd/MM/yyyy}", format: "{0:dd/MM/yyyy}", width: "175px"
                },
                //{ field: "Empties", title: $rootScope.resData.res_GridColumn_Empties, template: "#if(Empties == '1') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else{#<span class='orangebgfont'><i class=\"fa fa-exclamation-triangle\"></i></span>#}#", "text-align": "center", type: "string", filterable: false, width: "4%" },


                {
                    field: "Empties",
                    template: "#if(Empties==='C') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else{#<span class='orangebgfont'><i class='fa fa-exclamation-triangle'></i></span>#}#",
                    "title": $rootScope.resData.res_GridColumn_Empties,
                    type: "string",
                    filterable: {
                        cell: { showOperators: false, template: $scope.EmptiesListFilter },
                        ui: $scope.EmptiesListFilter, mode: "row", extra: false, operators: {
                            string: {
                                eq: "Is equal to",
                            }
                        }
                    }, width: "75px"
                },


                {
                    field: "Note",
                    template: "<a  ng-hide=\"dataItem.CurrentState === '7'\" ng-click=\"OpenModelPoppupNote(#=EnquiryId#,#=CurrentState#)\"><i class=\"fa fa-sticky-note stickynotecolor\"></i></a>",
                    "title": $rootScope.resData.res_GridColumn_Note,
                    type: "string",
                    filterable: false, width: "75px"
                },


                //{ field: "Capacity", title: "Truck Load", template: "#if(Capacity == '1') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else{#<span class='redbgfont'><i class='fa fa-times'></i></span>#}#", "text-align": "center", "width": "10%", type: "string", filterable: { mode: "row", extra: false } },
                //{ field: "SpecialRequest", title: "Credit Limit", template: "#if(Capacity == '1') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else{#<span class='redbgfont'><i class='fa fa-times'></i></span>#}#", "text-align": "center", "width": "10%", type: "string", filterable: { mode: "row", extra: false } },
                {
                    field: "Status", template: '<a class=\"{{dataItem.Class}}\">#:Status#</a>',
                    title: $rootScope.resData.res_GridColumn_Status, type: "string", filterable: {
                        cell: { showOperators: false, template: $scope.statusFilter },
                        ui: $scope.statusFilter, mode: "row", extra: false, operators: {
                            string: {
                                eq: "Is equal to",
                            }
                        }
                    },
                    width: "175px"
                },

                {
                    field: "Delete",
                    title: $rootScope.resData.res_GridColumn_Delete,
                    template: "#if(CurrentState == 8) {#<button class=\"k-button\" ng-click=\"DeleteEnquiry(#=EnquiryId#)\"><i class='fa fa-trash'></i></a>#}#",
                    type: "string",
                    filterable: false, width: "120px"
                },



            ],
        }
    function gridDataBound(e) {
        
        var grid = e.sender;
        // $scope.values = $rootScope.GridData;

        //hideGridColumnByConfiguration(grid, $rootScope.GridObjectPropertiesAccess);

        setTimeout(function () {
            
            $scope.AddAttributeToKendoDatePikcer();
        }, 500);
        if (grid.dataSource.total() === 0) {
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
            $scope.InquiryDetailsGrid.dataSource.transport.read($scope.values);
        }
    };


    $rootScope.GridRecallForStatus = function () {
        
        $rootScope.Throbber.Visible = true;
        ChangeGridHeaderTitleByLanguage($scope.InquiryDetailsGrid, "InquiryDetailsGrid", $rootScope.resData);

        gridCallBack();
        $scope.statusFilter($scope.StatusFilterEelement);
    }


    $ionicModal.fromTemplateUrl('templates/AddFeedback.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.AddFeedbackpopup = modal;
    });

    $scope.OpenAddFeedbackpopup = function () {
        

        $scope.AddFeedbackpopup.show();
    }

    $scope.CloseAddFeedbackpopup = function () {
        
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

    $scope.LoadEnquiryView = function (Id) {

        

        $rootScope.EnquiryDetailId = Id;
        var enquiry = $scope.GridData.data.filter(function (el) { return parseInt(el.EnquiryId) === Id; });
        if (enquiry.length > 0) {
            
            $rootScope.SaleOrderNumber = enquiry[0].SalesOrderNumber;
            $rootScope.OrderId = enquiry[0].OrderId;
        } else {
            $rootScope.SaleOrderNumber = 0;
            $rootScope.OrderId = 0;
        }



        $state.go("ViewCreateInquiry");
    }




    $scope.DeleteEnquiry = function (id) {
        var requestData =
            {
                ServicesAction: 'DeleteEnquiry',
                EnquiryId: id,
                UserId: $rootScope.UserId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            gridCallBack();
        });
    }



    $scope.ExportToExcel = function () {
        

        $scope.RequestDataFilter.ServicesAction = 'ExportToExcelInquiryGrid';
        $scope.RequestDataFilter.ColumnList = $scope.GridColumnList;
        var jsonobject = {};
        jsonobject.Json = $scope.RequestDataFilter;
        jsonobject.Json.IsExportToExcel = true;

        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
            
            var byteCharacters1 = response.data;
            if (response.data !== undefined) {
                var byteCharacters = response.data;
                var blob = new Blob([byteCharacters], {
                    type: "application/Pdf"
                });
                
                if (blob.size > 0) {
                    var filName = "InquiryDetails" + getDate() + ".xlsx";
                    saveAs(blob, filName);
                } else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                }
            }
            else {
                $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
            }
        });
    }



    $scope.NoteVariable = {
        NoteText: ''
    }
    $scope.AddNotesModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/AddNotesForObject.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {
            
            $scope.AddNotesPopup = modal;
        });
    }
    $scope.AddNotesModalPopup();
    $scope.OpenAddNotesModalPopup = function () {
        
        $scope.AddNotesPopup.show();
    }
    $scope.CloseAddNotesModalPopup = function () {
        
        $scope.AddNotesPopup.hide();
    }

    $scope.NotesEnquiryId = 0;
    $scope.OpenModelPoppupNote = function (enquiryId, enquiryState) {
        
        $scope.NotesEnquiryId = enquiryId;
        $scope.EnquiryCurrentState = enquiryState;
        var requestData =
            {
                ServicesAction: 'GetNoteByObjectId',
                ObjectId: enquiryId,
                RoleId: $rootScope.RoleId,
                ObjectType: 1220,
                UserId: $rootScope.UserId

            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (NotesResponse) {
            
            var NotesResponsedata = NotesResponse.data;

            $scope.OpenAddNotesModalPopup();

            if (NotesResponsedata.Json !== undefined) {
                var notesData = NotesResponsedata.Json.NotesList;

                if (notesData.length > 0) {
                    $scope.NoteVariable.NoteText = notesData[0].Note;
                } else {
                    $scope.NoteVariable.NoteText = "";
                }

            }
            else {
                $scope.NoteVariable.NoteText = "";
            }
        });
    }


    $scope.UpdateNote = function () {
        

        var Notes = [];
        var noteJson = {
            RoleId: $rootScope.RoleId,
            ObjectId: $scope.NotesEnquiryId,
            ObjectType: 1220,
            Note: $scope.NoteVariable.NoteText,
            CreatedBy: $rootScope.UserId
        }

        Notes.push(noteJson);

        if (Notes.length > 0) {
            
            var Note =
                {
                    ServicesAction: "SaveNotes",
                    NoteList: Notes
                }

            var jsonobject = {};
            jsonobject.Json = Note;

            

            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                $scope.CloseAddNotesModalPopup();
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryPage_NotesUpdated), 'error', 3000);
                $scope.NotesEnquiryId = 0;

            });

        }

    }



});