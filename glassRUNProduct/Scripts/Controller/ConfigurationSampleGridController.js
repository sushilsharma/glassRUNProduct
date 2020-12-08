angular.module("glassRUNProduct").controller('ConfigurationSampleGridController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, GrRequestService) {
    
    $rootScope.EditSelfCollectValue = "";
    $scope.ProductCodes = '';

    $rootScope.EnquiryRejected = false;
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }



    
    if ($rootScope.IsSelfCollect === undefined) {
        $rootScope.IsSelfCollect = $sessionStorage.IsSelfCollect;
        //$scope.OrderId = $rootScope.TrackerOrderId;
    } else {
        //$scope.OrderId = $rootScope.IsSelfCollect;
        $sessionStorage.OrderId = $rootScope.IsSelfCollect;

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


    $scope.bindAllBranchPlant = [];
    $scope.bindAllCarrier = [];
    $rootScope.EnquiryDetailId = 0;
    $rootScope.TempEnquiryDetailId = 0;
    $scope.bindAllBranchPlant = $rootScope.bindAllBranchPlant;
    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.InquiryDetailsGrid.dataSource.transport.read($scope.values);

            //$rootScope.Throbber.Visible = false;
        }
    };



    $rootScope.GridRecallForStatus = function () {
        
        $rootScope.Throbber.Visible = true;

        ChangeGridHeaderTitleByLanguage($scope.InquiryDetailsGrid, "InquiryDetailsGrid", $rootScope.resData);

        gridCallBack();
        $scope.statusFilter($scope.StatusFilterEelement);

    }


    $scope.LoadAllCarrier = function (enquiryId, branchPlantId, shipto, truckSizeId) {
        

        var requestData =
            {
                ServicesAction: 'LoadAllCarrierByBranchPlant',
                branchPlantId: branchPlantId,
                ShipTo: shipto,
                TruckSizeId: truckSizeId
            };

        // var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data;
            var bindAllCarrier = "bindAllCarrier" + enquiryId;
            if (resoponsedata.Json != undefined) {
                $scope[bindAllCarrier] = resoponsedata.Json.CarrierList;
            }
            else {
                $scope[bindAllCarrier] = [];
            }
        });
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


    $scope.ReceivedCapacityPalettesListFilter = function (element) {


        var ReceivedCapacityList = [];
        ReceivedCapacityList = ['Ok', 'Not Ok'];



        element.kendoDropDownList({
            dataSource: ReceivedCapacityList,
            optionLabel: "ReceivedCapacity",
            valuePrimitive: true,
        });
    }

    $scope.EmptiesListFilter = function (element) {

        var EmptiesList = [];
        EmptiesList = ['Ok', 'Not Ok'];



        element.kendoDropDownList({
            dataSource: EmptiesList,
            optionLabel: "Empties",
            valuePrimitive: true,
        });
    }

    $scope.StockFilter = function (element) {


        var EmptiesList = [];
        EmptiesList = ['Ok', 'Not Ok'];



        element.kendoDropDownList({
            dataSource: EmptiesList,
            optionLabel: "Stock",
            valuePrimitive: true,
        });
    }


    $scope.BranchPlantFilter = function (element) {


        var BranchPlantList = [];
        if ($scope.bindAllBranchPlant.length > 0) {
            for (var i = 0; i < $scope.bindAllBranchPlant.length; i++) {
                BranchPlantList.push($scope.bindAllBranchPlant[i].DeliveryLocationCode);
            }
        }
        element.kendoDropDownList({
            dataSource: BranchPlantList,
            optionLabel: "BranchPlant",
            valuePrimitive: true,
        });
    }

    $scope.datepickerfilter = function (element) {

        element.kendoDatePicker({ format: "dd/MM/yyyy", parseFormats: "{0:dd/MM/yyyy}", valuePrimitive: true });
    }

    $scope.GetScheduleDate = function (id, startDate, endDate) {

        $('#' + id).each(function () {

            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                        $scope.UpdateSchedulingDateOnChange(inst.id, dateText);
                    }

                },
                minDate: new Date(),
                maxDate: endDate,
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });
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

                        var BranchPlant = "";
                        var BranchPlantCriteria = "";

                        var CompanyNameValue = "";
                        var CompanyNameValueCriteria = "";

                        var SoldToCode = "";
                        var SoldToCodeCriteria = "";

                        var SoldToCode = "";
                        var SoldToCodeCriteria = "";

                        var Area = "";
                        var AreaCriteria = "";

                        var Empties = "";
                        var EmptiesCriteria = "";

                        var ReceivedCapacityPalates = "";
                        var ReceivedCapacityPalatesCriteria = "";

                        var DeliveryLocation = "";
                        var DeliveryLocationCriteria = "";

                        var Status = "";
                        var StatusCriteria = "";

                        var AvailableStock = "";
                        var AvailableStockCriteria = "";

                        var ShipTo = "";
                        var ShipToCriteria = "";

                        var Gratis = "";
                        var GratisCriteria = "";

                        var InquiryNumber = "";
                        var InquiryNumberCriteria = "";

                        var EnquiryDate = "";
                        var EnquiryDateCriteria = "";

                        var RequestDate = "";
                        var RequestDateCriteria = "";


                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };

                            for (var i = 0; i < options.data.filter.filters.length; i++) {

                                if (options.data.filter.filters[i].field === "EnquiryAutoNumber") {
                                    EnquiryAutoNumber = options.data.filter.filters[i].value;
                                    EnquiryAutoNumberCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "branchPlant") {
                                    BranchPlant = options.data.filter.filters[i].value;
                                    BranchPlantCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "CompanyName") {
                                    CompanyNameValue = options.data.filter.filters[i].value;
                                    CompanyNameValueCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "SoldToCode") {
                                    SoldToCode = options.data.filter.filters[i].value;
                                    SoldToCodeCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "Area") {
                                    Area = options.data.filter.filters[i].value;
                                    AreaCriteria = options.data.filter.filters[i].operator;
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

                                if (options.data.filter.filters[i].field === "Stock") {

                                    if (options.data.filter.filters[i].value === 'Ok') {
                                        AvailableStock = '1';
                                    }
                                    else if (options.data.filter.filters[i].value === 'Not Ok') {
                                        AvailableStock = '0';
                                    }

                                    AvailableStockCriteria = options.data.filter.filters[i].operator;
                                }



                                if (options.data.filter.filters[i].field === "ReceivedCapacityPalettes") {

                                    if (options.data.filter.filters[i].value === 'Ok') {
                                        ReceivedCapacityPalates = '1';
                                    }
                                    else if (options.data.filter.filters[i].value === 'Not Ok') {
                                        ReceivedCapacityPalates = '0';
                                    }

                                    ReceivedCapacityPalatesCriteria = options.data.filter.filters[i].operator;
                                }



                                if (options.data.filter.filters[i].field === "Stock") {

                                    if (options.data.filter.filters[i].value === 'Ok') {
                                        AvailableStock = '1';
                                    }
                                    else if (options.data.filter.filters[i].value === 'Not Ok') {
                                        AvailableStock = '0';
                                    }

                                    AvailableStockCriteria = options.data.filter.filters[i].operator;
                                }







                                if (options.data.filter.filters[i].field === "DeliveryLocation") {
                                    DeliveryLocation = options.data.filter.filters[i].value;
                                    DeliveryLocationCriteria = options.data.filter.filters[i].operator;
                                }
                                if (options.data.filter.filters[i].field === "AssociatedOrder") {
                                    Gratis = options.data.filter.filters[i].value;
                                    GratisCriteria = options.data.filter.filters[i].operator;
                                }
                                if (options.data.filter.filters[i].field === "Status") {
                                    Status = options.data.filter.filters[i].value;
                                    StatusCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "EnquiryDate") {

                                    EnquiryDate = options.data.filter.filters[i].value;
                                    EnquiryDate = new Date(EnquiryDate);
                                    EnquiryDate = $filter('date')(EnquiryDate, "dd/MM/yyyy");
                                    EnquiryDateCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "OrderProposedETD") {

                                    RequestDate = options.data.filter.filters[i].value;
                                    RequestDate = new Date(RequestDate);
                                    RequestDate = $filter('date')(RequestDate, "dd/MM/yyyy");
                                    RequestDateCriteria = options.data.filter.filters[i].operator;
                                }
                            }



                        }
                        var requestData =
                            {
                                ServicesAction: 'LoadCustomerServiceEnquiryDetails',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                EnquiryAutoNumber: EnquiryAutoNumber,
                                EnquiryAutoNumberCriteria: EnquiryAutoNumberCriteria,
                                CompanyNameValue: CompanyNameValue,
                                CompanyNameValueCriteria: CompanyNameValueCriteria,
                                SoldToCode: SoldToCode,
                                SoldToCodeCriteria: SoldToCodeCriteria,
                                BranchPlant: BranchPlant,
                                BranchPlantCriteria: BranchPlantCriteria,
                                Area: Area,
                                AreaCriteria: AreaCriteria,
                                DeliveryLocation: DeliveryLocation,
                                DeliveryLocationCriteria: DeliveryLocationCriteria,
                                Gratis: Gratis,
                                GratisCriteria: GratisCriteria,
                                EnquiryDate: EnquiryDate,
                                EnquiryDateCriteria: EnquiryDateCriteria,
                                SchedulingDate: RequestDate,
                                SchedulingDateCriteria: RequestDateCriteria,
                                Status: Status,
                                StatusCriteria: StatusCriteria,
                                Empties: Empties,
                                EmptiesCriteria: EmptiesCriteria,
                                IsAvailableStock: AvailableStock,
                                AvailableStockCriteria: AvailableStockCriteria,
                                ReceivedCapacityPalates: ReceivedCapacityPalates,
                                ReceivedCapacityPalatesCriteria: ReceivedCapacityPalatesCriteria,
                                CurrentState: '1,7',
                                RoleMasterId: $rootScope.RoleId,
                                CultureId: $rootScope.CultureId,
                                ProductCode: $scope.ProductCodes,
                                ProductSearchCriteria: $scope.ProductSearchCriteria
                            };


                        var consolidateApiParamater =
                            {
                                Json: requestData,
                            };


                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                            
                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;
                            if (resoponsedata !== null) {



                                if (resoponsedata.Json !== undefined) {

                                    if (resoponsedata.Json.EnquiryList.length !== undefined) {
                                        if (resoponsedata.Json.EnquiryList.length > 0) {

                                            totalcount = resoponsedata.Json.EnquiryList[0].TotalCount;

                                        }

                                    } else {


                                        totalcount = resoponsedata.Json.EnquiryList.TotalCount;
                                    }

                                    ListData = resoponsedata.Json.EnquiryList;

                                    var WoodenPalletCode = "";
                                    var WoodenPalletCodeList = $rootScope.AllSettingMasterData.filter(function (el) { return el.SettingParameter === 'WoodenPalletCode'; });
                                    if (WoodenPalletCodeList.length > 0) {
                                        WoodenPalletCode = WoodenPalletCodeList[0].SettingValue;
                                    }

                                    for (var i = 0; i < ListData.length; i++) {
                                        var enquiryList = ListData.filter(function (el) { return el.EnquiryId === ListData[i].EnquiryId });

                                        if (enquiryList.length > 0) {

                                            enquiryList[0].OrderTime = enquiryList[0].EnquiryDate.split('T')[1].split(':')[0];
                                            enquiryList[0].OrderDate = enquiryList[0].EnquiryDate.split('T')[0];


                                            var bindAllCarrier = "bindAllCarrier" + enquiryList[0].EnquiryId;
                                            if (enquiryList[0].CarrierList != undefined) {
                                                if (enquiryList[0].CarrierList.length > 0) {
                                                    $scope[bindAllCarrier] = enquiryList[0].CarrierList;

                                                    if (enquiryList[0].CarrierList.length === 1) {
                                                        enquiryList[0].carrier = enquiryList[0].CarrierList[0].CompanyId;
                                                    } else {
                                                        enquiryList[0].carrier = "";
                                                    }
                                                } else {
                                                    $scope[bindAllCarrier] = [];
                                                }
                                            } else { $scope[bindAllCarrier] = []; }

                                            //if (enquiryList[0].CompanyName != undefined) {
                                            //    if (enquiryList[0].CompanyName.indexOf('-') >= 0) {
                                            //        enquiryList[0].CompanyNameValue = enquiryList[0].CompanyName.split('-')[0];
                                            //    } else {
                                            //        enquiryList[0].CompanyNameValue = enquiryList[0].CompanyName.substring(0, 5);
                                            //    }
                                            //} else {
                                            //    enquiryList[0].CompanyNameValue = "";
                                            //}
                                        }

                                    }

                                } else {
                                    ListData = [];
                                    totalcount = 0;
                                }




                            }
                            var inquiryList = {
                                data: ListData,
                                totalRecords: totalcount
                            }


                            console.log("grid load");
                            $scope.GridData = inquiryList;
                            options.success(inquiryList);
                            $scope.values = options;
                            $rootScope.Throbber.Visible = false;
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
            scrollable: true,
            columnMenu: true,
            mobile: true,
            dataBound: gridDataBound,
            columns: [


                {
                    field: "selected",
                    template: "<input type='checkbox' class='checkbox' ng-model=\"dataItem.selected\" ng-click='onCheckBoxClick($event, dataItem)' ng-if='dataItem.CurrentState == 1'/>",
                    title: "<input type='checkbox' title='Select all'  ng-click='toggleSelectAll($event)' />",
                    width: "50px",
                    filterable: false

                },

                {
                    field: "EnquiryDate", "title": "EnquiryDate", type: "date", width: "175px",
                    filterable:
                    {
                        cell:
                        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy HH:mm" },

                        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy HH:mm"
                    }, parseFormats: "{0:dd/MM/yyyy HH:mm}", format: "{0:dd/MM/yyyy HH:mm}", width: "175px"

                },


                {
                    field: "EnquiryAutoNumber", title: "EnquiryAutoNumber",
                    template: '<div class="graybgfont" ng-click=\"LoadEnquiryView(#=EnquiryId#, #=IsAvailableStock#)\">#:EnquiryAutoNumber#</div>',
                    type: "string", filterable: { mode: "row", extra: false },
                    width: "200px"

                },
                {
                    field: "Area", title: "Aea", type: "string", filterable: { mode: "row", extra: false }, width: "100px"
                },
                { field: "CompanyName", title: $rootScope.resData.res_GridColumn_CompanyName, type: "string", filterable: { mode: "row", extra: false }, width: "150px" },
                { field: "DeliveryLocation", title: $rootScope.resData.res_GridColumn_DeliveryLocation, type: "string", filterable: { mode: "row", extra: false }, width: "200px" },
                {
                    field: "PromisedDate",
                    template: "<div class=\"prepend-icon\"><input type=\"text\" Id=\"{{dataItem.EnquiryId}}PromisedDate\"   ng-model='dataItem.PromisedDate'  name=\"datepicker\" class=\"form-control currentdatepicker\"  placeholder=\"Select a date...\"><i class=\"icon-calendar\"></i></div>",
                    "title": "PromisedDate",
                    filterable: false,
                    format: "{0:dd/MM/yyyy}", width: "175px"
                },


                {
                    field: "Status", template: '<a class=\"{{dataItem.Class}}\">#:Status#</a>',
                    title: "Status", type: "string", filterable: {
                        cell: { showOperators: false, template: $scope.statusFilter },
                        ui: $scope.statusFilter, mode: "row", extra: false, operators: {
                            string: {
                                eq: "Is equal to",
                            }
                        }
                    }, width: "175px"
                },
                {
                    field: "Action",
                    title: "Action", template: "#if(CurrentState == 1) {#<a class=\"greenbgfont approvebtn\" ng-click=\"ApproveEnquiryByEnquiryId(#=EnquiryId#)\"> Approve </a>#}#", type: "string",
                    filterable: false,
                    width: "100px"

                },
            ],
        }


    // Change branch plant for multiple enquiry.


    $ionicModal.fromTemplateUrl('templates/ChangeBranchPlantCode.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ChangeBranchPlantCodePopup = modal;
    });

    $scope.OpenChangeBranchPlantCodePopup = function (enquiryDetails) {
        $scope.ChangeBranchPlantCodePopup.show();
        $rootScope.Throbber.Visible = false;
    }

    $scope.ClosChangeBranchPlantCodePopup = function () {
        $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry = '';
        $scope.ChangeBranchPlantCodePopup.hide();
    }

    $scope.SelectedBranchPlant = {
        BranchPlantForSelectedEnquiry: ''
    }

    $scope.ChangeAllEnquiryBranchPlant = function () {
        
        $rootScope.Throbber.Visible = true;
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (enquiryDetails.length > 0) {
            $rootScope.Throbber.Visible = false;
            $scope.OpenChangeBranchPlantCodePopup();
        } else {
            $rootScope.Throbber.Visible = false;
            //$rootScope.ValidationErrorAlert('Please select enquiry.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);

        }
    }

    $scope.SaveBranchPlantForSelectedEnquiry = function () {
        
        $rootScope.Throbber.Visible = true;
        var SelectedEnquiryId = "";
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (enquiryDetails.length > 0) {
            for (var i = 0; i < enquiryDetails.length; i++) {
                SelectedEnquiryId = SelectedEnquiryId + ',' + enquiryDetails[i].EnquiryId;
            }
            SelectedEnquiryId = SelectedEnquiryId.substr(1);
            if (SelectedEnquiryId !== "") {
                
                var enquiryList = {
                    BranchPlantName: $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry,
                    EnquiryId: SelectedEnquiryId,
                }
                var requestData =
                    {
                        ServicesAction: 'UpdateBranchPlantForSelectedEnquiry',
                        EnquiryDetailList: enquiryList
                    };
                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };
                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    $scope.ClosChangeBranchPlantCodePopup();
                    $rootScope.Throbber.Visible = false;
                    // $rootScope.ValidationErrorAlert('Branch Plant updated successfully.', '', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_BranchPlantUpdated), '', 3000);

                    gridCallBack();
                });
            }
        }
    }


    $scope.AddAttributeToKendoDatePikcer = function () {

        var elems = angular.element(document.getElementsByClassName("k-picker-wrap"));
        for (var i = 0; i < elems.length; i++) {
            elems[i].setAttribute('data-tap-disabled', true);
        }

    }

    $scope.toggleSelectAll = function (ev) {
        
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();
        items.forEach(function (item) {

            var data = $scope.GridData.data.filter(function (el) { return el.EnquiryId === item.EnquiryId && (el.CurrentState === '1' || el.CurrentState === 1); });
            if (data.length > 0) {
                data[0].selected = ev.target.checked;
                item.selected = ev.target.checked;
            }

            var element = $(ev.currentTarget);
            var row = element.closest("tr");
            if (item.selected) {
                row.addClass("k-state-selected");
            } else {
                row.removeClass("k-state-selected");
            }
        });
    };

    $scope.onCheckBoxClick = function (ev, item) {

        
        var data = $scope.GridData.data.filter(function (el) { return el.EnquiryId === item.EnquiryId; });
        if (data.length > 0) {
            data[0].selected = ev.target.checked;
        }

        //$rootScope.ObjectId = item.EnquiryId;
        //$rootScope.ObjectType = 'Enquiry';

        item.selected = ev.target.checked;

        var element = $(ev.currentTarget);
        var row = element.closest("tr");
        if (item.selected) {
            row.addClass("k-state-selected");
        } else {
            row.removeClass("k-state-selected");
        }
    }



    $scope.GridColumnList = function () {
        
        var role1 = false;
        var role2 = false;

        if ($rootScope.RoleId === 3) {
            role1 = true;
        } else if ($rootScope.RoleId === 7) {
            role2 = true;
        }
        $scope.GridColumns = [{
            ColumnId: 0,
            ColumnName: "selected",
            Visiable: true,
            RoleId: 3,
            Default: true
        }, {
            ColumnId: 1,
            ColumnName: "EnquiryDate",
            Visiable: role1,
            RoleId: 3,
            Default: true
        }, {
            ColumnId: 2,
            ColumnName: "EnquiryAutoNumber",
            Visiable: role1,
            RoleId: 3,
            Default: true
        }, {
            ColumnId: 5,
            ColumnName: "Status",
            Visiable: role1,
            RoleId: 3,
            Default: false
        }, {
            ColumnId: 6,
            ColumnName: "Action",
            Visiable: role1,
            RoleId: 3,
            Default: false
        }, {
            ColumnId: 3,
            ColumnName: "Area",
            Visiable: role2,
            RoleId: 7,
            Default: true
        }, {
            ColumnId: 4,
            ColumnName: "PromisedDate",
            Visiable: role2,
            RoleId: 7,
            Default: true
        }, {
            ColumnId: 7,
            ColumnName: "CompanyName",
            Visiable: role2,
            RoleId: 7,
            Default: false
        }, {
            ColumnId: 8,
            ColumnName: "DeliveryLocation",
            Visiable: role2,
            RoleId: 7,
            Default: false
        }]

    }


    function hideGridColumnByConfigurationData(grid, configurationList) {
        
        for (var i = 0; i < configurationList.length; i++) {
            if (configurationList[i].Visiable === false) {
                grid.hideColumn(configurationList[i].ColumnName);
            } else {

            }
        }

        for (var i = 0; i < grid.columns.length; i++) {
            var column = configurationList.filter(function (el) { return el.ColumnName === grid.columns[i].field && el.RoleId === $rootScope.RoleId });
            if (column.length > 0) {
                if (column[0].Visiable === false) {
                    grid.columns[i].menu = false;
                } else {
                    if (column[0].Default === false) {
                        grid.columns[i].lock = false;
                    } else {
                        grid.columns[i].lock = true;
                    }
                }
            }
            else {
                grid.columns[i].menu = false;
            }
        }
    }



    function gridDataBound(e) {

        

        var grid = e.sender;

        $scope.GridColumnList();

        hideGridColumnByConfigurationData(grid, $scope.GridColumns);

        setTimeout(function () {

            $scope.AddAttributeToKendoDatePikcer();
        }, 500);

        var GetScheduleDateNumber = 6;
        if ($rootScope.AllSettingMasterData != undefined) {
            var truckBufferWeight = $rootScope.AllSettingMasterData.filter(function (el) { return el.SettingParameter === 'ScheduleDateNumber'; });
            if (truckBufferWeight.length > 0) {
                GetScheduleDateNumber = parseFloat(truckBufferWeight[0].SettingValue);
            }
        }

        setTimeout(function () {

            var data = $scope.GridData.data;
            for (var i = 0; i < data.length; i++) {
                var SchedulingDate = "";
                if (data[i].OrderProposedETDDate != undefined) {

                    var date = data[i].OrderProposedETDDate;
                    date = $filter('date')(date, "dd/MM/yyyy");
                    var proposedetd = date.split(' ');
                    var etd = proposedetd[0].split('/');
                    var etddate = etd[1] + "/" + etd[0] + "/" + etd[2];

                    var enddate = new Date(etddate);
                    enddate.setDate(enddate.getDate() + GetScheduleDateNumber);

                    var dd = enddate.getDate();
                    var mm = enddate.getMonth() + 1;
                    var y = enddate.getFullYear();
                    SchedulingDate = dd + '/' + mm + '/' + y;
                } else {
                    SchedulingDate = "";
                }
                var Id = data[i].EnquiryId;

                $scope.GetScheduleDate(Id, "", SchedulingDate);


                var PromisedDate = "";
                if (data[i].PromisedDate != undefined) {

                    var date = data[i].PromisedDate;
                    date = $filter('date')(date, "dd/MM/yyyy");
                    var proposedetd = date.split(' ');
                    var etd = proposedetd[0].split('/');
                    var etddate = etd[1] + "/" + etd[0] + "/" + etd[2];


                    PromisedDate = etddate;
                }


                $scope.GetPromisedDate(Id + "PromisedDate", PromisedDate);
            }
        }, 200);

        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };

    $scope.GetPromisedDate = function (id, PromisedDate) {

        $('#' + id).each(function () {

            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');

                        var enqiuryId = inst.id.replace(/[A-Za-z$-]/g, "");

                        $scope.UpdatePromisedDateOnChange(enqiuryId, dateText);
                    }

                },
                minDate: new Date(),
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });
    }

    $scope.UpdateBranchPlantOnChange = function (enquiryId, branchPlant) {
        
        $scope.UpdateName = "BranchPlant";
        $scope.UpdateEnquiryId = enquiryId;
        $scope.UpdateBranchPlantId = branchPlant;
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.EnquiryId) === parseInt(enquiryId); });
        //$scope.OpenReasoncodepopup(enquiryDetails);
        $scope.UpdateBranchPlantCode();
    }

    $scope.UpdateBranchPlantCode = function () {
        var enquiryList = {
            BranchPlantName: $scope.UpdateBranchPlantId,
            EnquiryId: $scope.UpdateEnquiryId,
        }

        var requestData =
            {
                ServicesAction: 'UpdateBranchPlant',
                EnquiryDetailList: enquiryList

            };


        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            //$rootScope.ValidationErrorAlert('Branch Plant updated successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_BranchPlantUpdated), '', 3000);


            gridCallBack();
        });
    }


    $scope.UpdateSchedulingDateOnChange = function (enquiryId, SchedulingDate) {

        $scope.UpdateName = "SchedulingDate";
        $scope.UpdateEnquiryId = enquiryId;
        $scope.UpdateSchedulingDate = SchedulingDate;
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.EnquiryId) === parseInt(enquiryId); });
        $scope.OpenReasoncodepopup(enquiryDetails);

    }


    $scope.UpdateSchedulingDateInEnquiry = function () {

        var enquiryList = {
            SchedulingDate: $scope.UpdateSchedulingDate,
            EnquiryId: $scope.UpdateEnquiryId,
        }

        var requestData =
            {
                ServicesAction: 'UpdateSchedulingDate',
                EnquiryDetailList: enquiryList

            };


        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            // $rootScope.ValidationErrorAlert('Scheduling date updated successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SchedulingUpdated), '', 3000);
            gridCallBack();
        });
    }


    $scope.UpdatePromisedDateOnChange = function (enquiryId, PromisedDate) {

        $scope.UpdateName = "PromisedDate";
        $scope.UpdateEnquiryId = enquiryId;
        $scope.UpdatePromisedDate = PromisedDate;
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.EnquiryId) === parseInt(enquiryId); });
        $scope.OpenReasoncodepopup(enquiryDetails);

    }


    $scope.UpdatePromisedDateInEnquiry = function () {

        var enquiryList = {
            PromisedDate: $scope.UpdatePromisedDate,
            EnquiryId: $scope.UpdateEnquiryId,
        }

        var requestData =
            {
                ServicesAction: 'UpdatePromisedDate',
                EnquiryDetailList: enquiryList

            };


        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            // $rootScope.ValidationErrorAlert('Promised date updated successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_PromisedDateUpdated), '', 3000);

            gridCallBack();
        });
    }

    $scope.ApproveEnquiry = function (enquiryId) {
        

        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        }
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.EnquiryId) === parseInt(enquiryId); });
        var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;
        var columnName = 'RequestDate';
        var columnNameBranchPlant = 'branchPlant';
        var columnNamePromisedDate = 'PromisedDate';
        var columnNameCarrier = 'carrier';
        //$rootScope.ObjectId = parseInt(enquiryId);
        //$rootScope.ObjectType = 'Enquiry';

        for (var index = 0; index < gridDataArray.length; index++) {
            var columnValue = gridDataArray[index][columnName];
            var columnValueBranchPlant = gridDataArray[index][columnNameBranchPlant];
            var columnValuePromisedDate = gridDataArray[index][columnNamePromisedDate];
            var columnValueCarrier = gridDataArray[index][columnNameCarrier];

            var enquiryRequestDate = enquiryDetails.filter(function (el) { return el.EnquiryId === gridDataArray[index]["EnquiryId"]; });
            if (enquiryRequestDate.length > 0) {
                if (enquiryRequestDate[0].RequestDate === columnValue && enquiryRequestDate[0].branchPlant === columnValueBranchPlant) {

                    enquiryRequestDate[0].RequestDate = columnValue;
                    enquiryRequestDate[0].branchPlant = columnValueBranchPlant;
                    enquiryRequestDate[0].PromisedDate = columnValuePromisedDate;
                    enquiryRequestDate[0].CarrierNumber = columnValueCarrier;


                    if (columnValueCarrier != null) {

                        var bindAllCarrier = "bindAllCarrier" + enquiryId;
                        var carrierdata = $scope[bindAllCarrier].filter(function (el) { return parseInt(el.CompanyId) === parseInt(columnValueCarrier); });

                        if (carrierdata.length != 0) {

                            enquiryRequestDate[0].CarrierCode = carrierdata[0].CompanyMnemonic;
                        }

                    }

                    $scope.ApproveEnquiryServices(enquiryDetails);
                } else {

                    enquiryRequestDate[0].RequestDate = columnValue;
                    enquiryRequestDate[0].branchPlant = columnValueBranchPlant;
                    enquiryRequestDate[0].CarrierNumber = columnValueCarrier;
                    $rootScope.ReasonCodeEnquiryId = enquiryRequestDate[0].EnquiryId;
                    $scope.OpenReasoncodepopup(enquiryDetails);
                }
            }
        };

    }

    $scope.ApproveEnquiryServices = function (enquiryDetails) {
        

        var settingValue = 0;
        if ($sessionStorage.AllSettingMasterData != undefined) {
            var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === "DefaultLeadTime"; });
            if (settingMaster.length > 0) {
                settingValue = settingMaster[0].SettingValue;
            }
        }


        var requestData =
            {
                ServicesAction: 'ApproveEnquiry',
                EnquiryDetailList: enquiryDetails,
                UserName: $rootScope.UserName,
                UserId: $rootScope.UserId,
                DefaultLeadTime: settingValue

            };


        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {



            // Save Item Layer Validation Log.
            var requestDataforItemLayer =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: 0,
                    ObjectType: "Approve Enquiry From Grid",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'Click On Approve Enquiry. Enquiry List JSON ' + JSON.stringify(enquiryDetails) + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var consolidateApiParamaterItemLayer =
                {
                    Json: requestDataforItemLayer,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

            });


            //$rootScope.ValidationErrorAlert('Order/s sent for approval. Awaiting SO Number.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_AwaitingSONumber), '', 3000);
            $rootScope.Throbber.Visible = false;
            gridCallBack();
        });

    }

    $scope.ApproveEnquiryByEnquiryId = function (enquiryId) {
        
        $rootScope.Throbber.Visible = true;
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.EnquiryId) === parseInt(enquiryId); });
        var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;
        var columnNameCarrier = 'carrier';
        for (var index = 0; index < gridDataArray.length; index++) {
            var columnValueCarrier = gridDataArray[index][columnNameCarrier];
            var enquiryRequestDate = enquiryDetails.filter(function (el) { return el.EnquiryId === gridDataArray[index]["EnquiryId"]; });
            if (enquiryRequestDate.length > 0) {
                enquiryRequestDate[0].CarrierNumber = columnValueCarrier;
                enquiryRequestDate[0].CreatedBy = $rootScope.UserId;

                if (columnValueCarrier != null) {

                    var bindAllCarrier = "bindAllCarrier" + enquiryId;
                    var carrierdata = $scope[bindAllCarrier].filter(function (el) { return parseInt(el.CompanyId) === parseInt(columnValueCarrier); });

                    if (carrierdata.length != 0) {

                        enquiryRequestDate[0].CarrierCode = carrierdata[0].CompanyMnemonic;
                    }

                }
            }

        }


        //$rootScope.ObjectId = parseInt(enquiryId);
        //$rootScope.ObjectType = 'Enquiry';

        if (enquiryDetails.length > 0) {




            //if (enquiryDetails[0].carrier !== "0" && enquiryDetails[0].carrier !== undefined) {
            //    $scope.ApproveEnquiryServices(enquiryDetails);
            //} else {
            //    $rootScope.Throbber.Visible = false;
            //    $rootScope.ValidationErrorAlert('Please Select Branch Plant Code.', '', 3000);
            //}



            

            if (enquiryDetails[0].branchPlant === "0" || enquiryDetails[0].branchPlant === undefined) {
                $rootScope.Throbber.Visible = false;
                //$rootScope.ValidationErrorAlert('Please Select Branch Plant Code.', '', 3000);

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), '', 3000);


            }
            else if (enquiryDetails[0].TruckSizeId !== "" && enquiryDetails[0].TruckSizeId !== "0" && enquiryDetails[0].TruckSizeId !== 0 && enquiryDetails[0].TruckSizeId !== undefined) {
                //else if ($rootScope.IsSelfCollect === false) {
                if ((enquiryDetails[0].CarrierNumber === "0" || enquiryDetails[0].CarrierNumber === undefined || enquiryDetails[0].CarrierNumber === null || enquiryDetails[0].CarrierNumber === "") && enquiryDetails[0].IsSelfCollectEnquiry !== "SCO") {
                    $rootScope.Throbber.Visible = false;
                    //$rootScope.ValidationErrorAlert('Please Select carrier.', '', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectCarrier), '', 3000);

                } else {

                    $scope.ApproveEnquiryServices(enquiryDetails);
                }
            }
            else {
                $scope.ApproveEnquiryServices(enquiryDetails);
            }
        } else {

        }
    }

    $scope.ReasonCodeEnquiryList = [];

    $scope.GetAllRecordApproved = function () {
        
        $scope.ReasonCodeEnquiryList = [];
        var IsVariableChange = false;
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (enquiryDetails.length > 0) {

            $rootScope.Throbber.Visible = true;
            var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;

            var columnName = 'RequestDate';
            var columnNameBranchPlant = 'branchPlant';
            var columnNamePromisedDate = 'PromisedDate';
            var columnNameCarrier = 'carrier';
            for (var index = 0; index < gridDataArray.length; index++) {
                var columnValue = gridDataArray[index][columnName];
                var columnValueBranchPlant = gridDataArray[index][columnNameBranchPlant];

                var columnValuePromisedDate = gridDataArray[index][columnNamePromisedDate];
                var columnValueCarrier = gridDataArray[index][columnNameCarrier];
                var enquiryRequestDate = enquiryDetails.filter(function (el) { return el.EnquiryId === gridDataArray[index]["EnquiryId"]; });

                if (enquiryRequestDate.length > 0) {

                    enquiryRequestDate[0].RequestDate = columnValue;
                    enquiryRequestDate[0].branchPlant = columnValueBranchPlant;
                    enquiryRequestDate[0].PromisedDate = columnValuePromisedDate;
                    enquiryRequestDate[0].CarrierNumber = columnValueCarrier;


                    if (columnValueCarrier != null) {

                        var bindAllCarrier = "bindAllCarrier" + enquiryRequestDate[0].EnquiryId;
                        var carrierdata = $scope[bindAllCarrier].filter(function (el) { return parseInt(el.CompanyId) === parseInt(columnValueCarrier); });

                        if (carrierdata.length != 0) {

                            enquiryRequestDate[0].CarrierCode = carrierdata[0].CompanyMnemonic;
                        }

                    }

                }
            };

            var isBranchPlantCodeSelected = true;
            var isCarrierNumberSelected = true;

            for (var i = 0; i < enquiryDetails.length; i++) {

                if (enquiryDetails[i].branchPlant !== "0" && enquiryDetails[i].branchPlant !== undefined) {

                    if (enquiryDetails[i].TruckSizeId !== "" && enquiryDetails[i].TruckSizeId !== "0" && enquiryDetails[i].TruckSizeId !== 0 && enquiryDetails[i].TruckSizeId !== undefined) {

                        if ((enquiryDetails[i].CarrierNumber === "0" || enquiryDetails[i].CarrierNumber === undefined || enquiryDetails[i].CarrierNumber === null || enquiryDetails[i].CarrierNumber === "") && enquiryDetails[i].IsSelfCollectEnquiry !== "SCO") {
                            isCarrierNumberSelected = false;
                            break;
                        } else {
                            isCarrierNumberSelected = true;
                        }
                    } else {
                        isCarrierNumberSelected = true;
                    }
                    isBranchPlantCodeSelected = true;
                }
                else {
                    isBranchPlantCodeSelected = false;
                    break;
                }
            }





            if (isBranchPlantCodeSelected === true && isCarrierNumberSelected === true) {
                $scope.ApproveEnquiryServices(enquiryDetails);
            } else {

                if (isBranchPlantCodeSelected === false) {

                    $rootScope.Throbber.Visible = false;
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);

                }
                else if (isCarrierNumberSelected === false) {

                    $rootScope.Throbber.Visible = false;
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectCarrier), 'error', 3000);


                }



            }



        }
        else {
            $rootScope.Throbber.Visible = false;
            //$rootScope.ValidationErrorAlert('Please select enquiry.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);

        }
    }

    $scope.RejectAllSelectedEnquiry = function () {


        var enquiryDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (enquiryDetails.length > 0) {
            $scope.UpdateName = "RejectEnquiry"
            $scope.OpenReasoncodepopup(enquiryDetails);

        }
        else {
            //$rootScope.ValidationErrorAlert('Please select enquiry.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);

        }
    }


    $scope.RejectSelectedEnquiry = function () {

        var requestData =
            {
                ServicesAction: 'RejectEnquiry',
                EnquiryList: $rootScope.ReasonCodeEnquiryDetails,
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            //$rootScope.ValidationErrorAlert('Enquiry rejected successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_EnquiryRejected), '', 3000);


            gridCallBack();

        });
    }



    $scope.LoadEnquiryView = function (Id, stockStatus) {

        $rootScope.EnquiryDetailId = Id;
        $rootScope.TempEnquiryDetailId = Id;
        //var enquiryList = $scope.GridData.data.filter(function (el) { return parseInt(el.EnquiryId) === Id });
        //if (enquiryList.length > 0) {
        //    var OutOfStockItem = [];
        //    for (var j = 0; j < enquiryList[0].EnquiryProductList.length; j++) {
        //        if (enquiryList[0].EnquiryProductList[j].IsItemAvailableInStock === false) {
        //            OutOfStockItem.push(enquiryList[0].EnquiryProductList[j].EnquiryProductId);
        //        }
        //    }
        //    $rootScope.OutofStockItemsList = OutOfStockItem;
        //}

        //$rootScope.ObjectId = Id;
        //$rootScope.ObjectType = 'Enquiry';

        $rootScope.IsStockAvilable = stockStatus;
        $state.go("ViewCreateInquiry");
    }



    $ionicModal.fromTemplateUrl('templates/reasoncodepopup.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.reasoncodepopup = modal;
    });



    $scope.ReasonCodeList = [];
    $scope.LoadReasonCode = function () {

        var requestData =
            {
                ServicesAction: 'LoadReasonCodeList'

            };



        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response != undefined) {
                $scope.ReasonCodeList = response.data.ReasonCode.ReasonCodeList;
            }


        });

    };

    $scope.LoadReasonCode();



    $scope.OpenReasoncodepopup = function (enquiryDetails) {

        $rootScope.ReasonCodeEnquiryDetails = enquiryDetails;
        $scope.reasoncodepopup.show();
        $rootScope.Throbber.Visible = false;
    }

    $scope.ClosReasoncodepopup = function () {

        $rootScope.ReasonCodeEnquiryId = 0;
        $scope.ReasonCodeJson.ReasonCode = "";
        $scope.ReasonCodeJson.ReasonDescription = "";
        $scope.reasoncodepopup.hide();
    }


    $scope.ReasonCodeJson = {
        ReasonCode: '',
        ReasonDescription: ''
    }

    $scope.SaveReasonCode = function () {

        if ($scope.ReasonCodeJson.ReasonCode !== "") {
            $rootScope.Throbber.Visible = true;
            $scope.SaveReasonCodeList();
        }
        else {
            //$rootScope.ValidationErrorAlert('Please select reason code.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectReasonCode), 'error', 3000);

        }

    }

    $scope.SaveReasonCodeList = function () {


        var reasonCode = {
            ReasonCodeId: $scope.ReasonCodeJson.ReasonCode,
            ReasonDescription: $scope.ReasonCodeJson.ReasonDescription,
            ObjectId: $rootScope.ReasonCodeEnquiryId,
            ObjectType: 'Enquiry'

        }

        var reasonCodeList = [];
        reasonCodeList.push(reasonCode);

        var requestData =
            {
                ServicesAction: 'InsertReasonMappingCode',
                ReasonCodeList: reasonCodeList
            };



        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


            if ($scope.UpdateName === "BranchPlant") {
                $scope.UpdateBranchPlantCode();
            }
            else if ($scope.UpdateName === "SchedulingDate") {
                $scope.UpdateSchedulingDateInEnquiry();
            } else if ($scope.UpdateName === "RejectEnquiry") {
                $scope.RejectSelectedEnquiry();
            }
            else if ($scope.UpdateName === "PromisedDate") {
                $scope.UpdatePromisedDateInEnquiry();
            }
            $rootScope.Throbber.Visible = false;
            $scope.UpdateName = "";
            $scope.ReasonCodeJson.ReasonCode = "";
            $scope.ReasonCodeJson.ReasonDescription = "";
            $scope.ClosReasoncodepopup();
        });
    }

    $scope.OnCarrierChangeEvent = function (enquiryId, carrierNumber) {
        
        if (carrierNumber === null) {
            carrierNumber = "";
        }
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.EnquiryId) === parseInt(enquiryId); });
        if (enquiryDetails.length > 0) {
            enquiryDetails[0].CarrierNumber = carrierNumber;
        }

    }


    $scope.RefreshGrid = function () {

        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        }
        gridCallBack();
    }


    $scope.onSelection = function (kendoEvent) {
        
        var grid = kendoEvent.sender;
        var selectedData = grid.dataItem(grid.select());

        var items = $('#InquiryDetailsGrid').data('kendoGrid')._data;

        var data = $scope.GridData.data.filter(function (el) { return el.EnquiryId === selectedData.EnquiryId && (el.CurrentState === '1' || el.CurrentState === 1); });

        var item = items.filter(function (el) { return el.EnquiryId === selectedData.EnquiryId && (el.CurrentState === '1' || el.CurrentState === 1); });

        if (data.length > 0) {
            if (data[0].selected === true) {
                data[0].selected = false;
                item[0].selected = false;
            } else {
                data[0].selected = true;
                item[0].selected = true;
            }

        }





    }


});