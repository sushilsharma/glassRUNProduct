angular.module("glassRUNProduct").controller('GateKeeperListPageController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {
    debugger;

    $scope.defaultDateTime = "1900-01-01T00:00:00";

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }


    LoadActiveVariables($sessionStorage, $state, $rootScope);


    $scope.UserImage = {
        UserPhoto: "Images/download.jpg",
        Photo: "Images/download.jpg"
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


    $ionicModal.fromTemplateUrl('ViewGateKeeper.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.ViewGratisOrderControl = modal;
    });
    $scope.CloseViewGratisOrderControl = function () {
        $scope.ViewGratisOrderControl.hide();
    };
    $scope.OpenViewGratisOrderControl = function () {
        debugger;
        $scope.ViewGratisOrderControl.show();
    };



    debugger;
    var requestDataForCarrier =
        {
            ServicesAction: 'LoadAllDriverList'

        }

    var consolidateApiParamaterForCarrier =
        {
            Json: requestDataForCarrier,
        };

    GrRequestService.ProcessRequest(consolidateApiParamaterForCarrier).then(function (response) {
        debugger;
        if (response.data != undefined) {
            if (response.data.Json != undefined) {

                $scope.DriverAllList = response.data.Json.ProfileList;
            } else {
                $scope.DriverAllList = [];
            }
        } else {
            $scope.DriverAllList = [];
        }
    });


    $scope.GateKeeperConfirmationGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) {


                        var SalesOrderNumber = "";
                        var SalesOrderNumberCriteria = "";

                        var EnquiryAutoNumber = "";
                        var EnquiryAutoNumberCriteria = "";

                        var PurchaseOrderNumber = "";
                        var PurchaseOrderNumberCriteria = "";

                        var CompanyNameValue = "";
                        var CompanyNameValueCriteria = "";


                        var ShipTo = "";
                        var ShipToCriteria = "";

                        var InquiryNumber = "";
                        var InquiryNumberCriteria = "";

                        var InquiryNumber = "";
                        var InquiryNumberCriteria = "";

                        var BranchPlant = "";
                        var BranchPlantCriteria = "";

                        var DeliveryLocation = "";
                        var DeliveryLocationCriteria = "";

                        var Status = "";
                        var StatusCriteria = "";

                        var RequestDate = "";
                        var RequestDateCriteria = "";

                        var Gratis = "";
                        var GratisCriteria = "";

                        var OrderType = "";

                        var OrderDate = "";
                        var OrderDateCriteria = "";

                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };

                            for (var i = 0; i < options.data.filter.filters.length; i++) {
                                if (options.data.filter.filters[i].field === "SalesOrderNumber") {
                                    SalesOrderNumber = options.data.filter.filters[i].value;
                                    SalesOrderNumberCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "EnquiryAutoNumber") {
                                    EnquiryAutoNumber = options.data.filter.filters[i].value;
                                    EnquiryAutoNumberCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "PurchaseOrderNumber") {
                                    PurchaseOrderNumber = options.data.filter.filters[i].value;
                                    PurchaseOrderNumberCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "StockLocationId") {
                                    BranchPlant = options.data.filter.filters[i].value;
                                    BranchPlantCriteria = options.data.filter.filters[i].operator;
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
                                if (options.data.filter.filters[i].field === "ExpectedTimeOfDelivery") {
                                    debugger;
                                    RequestDate = options.data.filter.filters[i].value;
                                    RequestDate = new Date(RequestDate);
                                    RequestDate = $filter('date')(RequestDate, "dd/MM/yyyy");
                                    RequestDateCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "OrderType") {
                                    OrderType = options.data.filter.filters[i].value;
                                }

                                if (options.data.filter.filters[i].field === "OrderDate") {
                                    OrderDate = options.data.filter.filters[i].value;
                                    OrderDate = new Date(OrderDate);
                                    OrderDate = $filter('date')(OrderDate, "dd/MM/yyyy");
                                    OrderDateCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "CompanyNameValue") {
                                    CompanyNameValue = options.data.filter.filters[i].value;
                                    CompanyNameValueCriteria = options.data.filter.filters[i].operator;
                                }
                            }

                        }

                        debugger;
                        var requestData =
                            {
                                ServicesAction: 'LoadCarrierDetails',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                SalesOrderNumber: SalesOrderNumber,
                                SalesOrderNumberCriteria: SalesOrderNumberCriteria,
                                CompanyNameValue: CompanyNameValue,
                                CompanyNameValueCriteria: CompanyNameValueCriteria,
                                PurchaseOrderNumber: PurchaseOrderNumber,
                                PurchaseOrderNumberCriteria: PurchaseOrderNumberCriteria,
                                EnquiryAutoNumber: EnquiryAutoNumber,
                                EnquiryAutoNumberCriteria: EnquiryAutoNumberCriteria,
                                BranchPlant: BranchPlant,
                                BranchPlantCriteria: BranchPlantCriteria,
                                DeliveryLocation: DeliveryLocation,
                                DeliveryLocationCriteria: DeliveryLocationCriteria,
                                Gratis: Gratis,
                                GratisCriteria: GratisCriteria,
                                RequestDate: RequestDate,
                                RequestDateCriteria: RequestDateCriteria,
                                Status: Status,
                                StatusCriteria: StatusCriteria,
                                OrderType: OrderType,
                                OrderDate: OrderDate,
                                OrderDateCriteria: OrderDateCriteria,
                                RoleMasterId: $rootScope.RoleId,
                                CultureId: $rootScope.CultureId,
                                UserId: $rootScope.CompanyId,
                                LoginId: $rootScope.UserId
                            };


                        // var stringfyjson = JSON.stringify(requestData);
                        var consolidateApiParamater =
                            {
                                Json: requestData,

                            };

                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            debugger;

                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;

                            if (resoponsedata !== null) {
                                debugger;

                                if (resoponsedata.Json !== undefined) {

                                    if (resoponsedata.Json.OrderList.length !== undefined) {
                                        if (resoponsedata.Json.OrderList.length > 0) {

                                            totalcount = resoponsedata.Json.OrderList[0].TotalCount
                                        }

                                    } else {

                                        totalcount = resoponsedata.Json.OrderList.TotalCount;
                                    }

                                    ListData = resoponsedata.Json.OrderList;

                                    var WoodenPalletCode = "";
                                    var WoodenPalletCodeList = $rootScope.AllSettingMasterData.filter(function (el) { return el.SettingParameter === 'WoodenPalletCode'; });
                                    if (WoodenPalletCodeList.length > 0) {
                                        WoodenPalletCode = WoodenPalletCodeList[0].SettingValue;
                                    }

                                    for (var i = 0; i < ListData.length; i++) {
                                        var orderList = ListData.filter(function (el) { return el.OrderId === ListData[i].OrderId });

                                        if (orderList.length > 0) {

                                            if (orderList[0].CompanyName != undefined) {
                                                if (orderList[0].CompanyName.indexOf('-') >= 0) {
                                                    orderList[0].CompanyNameValue = orderList[0].CompanyName.split('-')[0];
                                                } else {
                                                    orderList[0].CompanyNameValue = orderList[0].CompanyName.substring(0, 5);
                                                }
                                            } else {
                                                orderList[0].CompanyNameValue = "";
                                            }

                                            debugger;
                                            if (orderList[0].TruckInDateTime == "1900-01-01T00:00:00") {
                                                orderList[0].IsTruckInDisabled = false;
                                                orderList[0].TruckInDateTime = "";
                                            } else {
                                                orderList[0].IsTruckInDisabled = true;
                                            }

                                            //orderList[0].IsTruckOutDisabled = true;
                                            if (orderList[0].TruckOutDateTime == "1900-01-01T00:00:00") {
                                                orderList[0].IsTruckOutDisabled = false;
                                                orderList[0].TruckOutDateTime = "";
                                            } else {
                                                orderList[0].IsTruckOutDisabled = true;
                                            }

                                            if (orderList[0].TruckInPlateNumber == "" || orderList[0].TruckInPlateNumber == undefined) {
                                                orderList[0].TruckInPlateNumber = orderList[0].PreviousPlateNumber;
                                            }

                                            if (orderList[0].PreviousPlateNumber == "" || orderList[0].PreviousPlateNumber == undefined ) {
                                                orderList[0].PreviousPlateNumber = orderList[0].TruckInPlateNumber;
                                            }
                                            //debugger;
                                            //if (orderList[0].TruckOutPlateNumber == "" || orderList[0].TruckOutPlateNumber == undefined || orderList[0].TruckOutPlateNumber == null) {
                                            //    orderList[0].TruckOutPlateNumber = orderList[0].PreviousPlateNumber;
                                            //}
                                            debugger;
                                            if (orderList[0].TruckInPlateNumber != "" && (orderList[0].TruckOutPlateNumber == "" || orderList[0].TruckOutPlateNumber == null)) {
                                                orderList[0].TruckOutPlateNumber = orderList[0].TruckInPlateNumber;
                                            }


                                            //if (orderList[0].DeliveryPersonnelId == "" || orderList[0].DeliveryPersonnelId == undefined || orderList[0].DeliveryPersonnelId == "0") {
                                            //    orderList[0].DeliveryPersonnelId = orderList[0].DriverName;
                                            //}





                                            //if (orderList[0].TruckInDateTime == "1900-01-01T00:00:00" && orderList[0].TruckOutDateTime == "1900-01-01T00:00:00") {
                                            //    orderList[0].IsAllTruckOutDisabled = false;
                                            //}
                                            //else {
                                            //    orderList[0].IsAllTruckOutDisabled = true;
                                            //}

                                            if (orderList[0].OrderProductList != undefined) {
                                                var orderProduct = orderList[0].OrderProductList.filter(function (el) { return el.ProductCode !== WoodenPalletCode });
                                                if (orderProduct.length > 0) {

                                                    for (var j = 0; j < orderProduct.length; j++) {

                                                        var availableProductStock = orderProduct[j].ProductAvailableQuantity;

                                                        var totalUsedQuantity = parseFloat(orderProduct[j].UsedQuantityInOrder);


                                                        var remainingProductStock = parseFloat(parseFloat(availableProductStock) - parseFloat(totalUsedQuantity));

                                                        if (parseFloat(orderProduct[j].ProductQuantity) < remainingProductStock) {
                                                            orderProduct[j].IsItemAvailableInStock = true;
                                                            // orderList[0].IsAvailableStock = true;
                                                        } else {
                                                            orderProduct[j].IsItemAvailableInStock = false;
                                                            // orderList[0].IsAvailableStock = false;
                                                            // break;
                                                        }
                                                    }

                                                    var IsAnyProductOutOfStock = orderProduct.filter(function (el) { return el.IsItemAvailableInStock === false });
                                                    if (IsAnyProductOutOfStock.length > 0) {
                                                        orderList[0].IsAvailableStock = false;
                                                    } else {
                                                        orderList[0].IsAvailableStock = true;
                                                    }


                                                    var IsGratisItem = orderProduct.filter(function (el) { return parseInt(el.AssociatedOrder) !== 0 });
                                                    if (IsGratisItem.length > 0) {
                                                        orderList[0].IsGratisItemAvailable = true;
                                                    } else {
                                                        orderList[0].IsGratisItemAvailable = false;
                                                    }



                                                }
                                                else {
                                                    orderList[0].IsAvailableStock = false;
                                                    orderList[0].IsGratisItemAvailable = false;
                                                }
                                            }
                                            else {
                                                orderList[0].IsAvailableStock = false;
                                                orderList[0].IsGratisItemAvailable = false;
                                            }
                                        }
                                    }

                                }
                                else {
                                    ListData = [];
                                    totalcount = 0;
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

                //{

                //    template: "<input type='checkbox' class='checkbox' ng-model=\"dataItem.selected\" ng-click='onCheckBoxClick($event, dataItem)' />",
                //    title: "<input type='checkbox' title='Select all'   ng-click='toggleSelectAll($event)' />",
                //    width: "30px"


                //},



                {
                    field: "OrderDate", "title": $rootScope.resData.res_GridColumn_OrderDate, type: "date",
                    filterable:
                    {
                        cell:
                        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy HH:mm" },
                        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy HH:mm"
                    }, parseFormats: "{0:dd/MM/yyyy HH:mm}", format: "{0:dd/MM/yyyy HH:mm}", width: "175px"
                },


                //{
                //    field: "EnquiryAutoNumber", template: '<a ng-click=\"LoadOrderViewOnEnquiryClick(\'#=SalesOrderNumber#\',#=IsAvailableStock#)\"  class="graybgfont">#:EnquiryAutoNumber#</a>', title: "Enquiry #", type: "string", filterable: { mode: "row", extra: false },
                //    width: "120px"
                //},
                //{
                //    field: "OrderType", title: "OrderType", type: "string", filterable: {
                //        cell: { showOperators: false, template: $scope.OrderTypeFilter },
                //        ui: $scope.OrderTypeFilter, mode: "row", extra: false, operators: {
                //            string: {
                //                eq: "Is equal to",
                //            }
                //        }
                //    },
                //    width: "150px"
                //},
                //{
                //    field: "PurchaseOrderNumber", template: '<a  class="graybgfont">#:PurchaseOrderNumber#</a>', title: "PO #", type: "string", filterable: { mode: "row", extra: false },
                //    width: "120px"
                //},

                {
                    field: "SalesOrderNumber", template: '<a ng-click=\"LoadOrderView(\'#=SalesOrderNumber#\')\" class="graybgfont">#:SalesOrderNumber#</a>',
                    title: $rootScope.resData.res_GridColumn_SalesOrderNumber, type: "string", filterable: { mode: "row", extra: false },
                    width: "120px"
                },


                { field: "AssociatedOrder", "title": $rootScope.resData.res_GridColumn_AssociatedOrder, type: "string", filterable: { mode: "row", extra: false }, width: "200px" },

                { field: "CompanyNameValue", title: $rootScope.resData.res_GridColumn_CompanyNameValue, type: "string", filterable: { mode: "row", extra: false }, width: "150px" },


                { field: "DeliveryLocation", title: $rootScope.resData.res_GridColumn_DeliveryLocation, type: "string", filterable: { mode: "row", extra: false }, width: "100px" },


                { field: "BranchPlantName", title: $rootScope.resData.res_GridColumn_BranchPlantName, type: "string", filterable: { mode: "row", extra: false }, width: "100px" },



                {
                    field: "DriverName", template: '<a ng-click=\"DriverDetails(#=ProfileId#)\" class="graybgfont">#:DriverName#</a>',
                    title: 'Assigned Driver', type: "string", filterable: { mode: "row", extra: false },
                    width: "200px"
                },


                {
                    field: "DeliveryPersonnelId",
                    template: "<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.DeliveryPersonnelId\"   ng-options=\"obj.DeliveryPersonnelId as obj.Name for obj in DriverAllList\"><option value=\"\">Select</option></select>", "title": "Driver",
                    filterable: { mode: "row", extra: false },
                    type: "string",
                    width: "175px"
                },


                { field: "PreviousPlateNumber", title: $rootScope.resData.res_GridColumn_PreviousPlateNumber, type: "string", filterable: { mode: "row", extra: false }, width: "175px" },


                {
                    field: "TruckInPlateNumber",
                    template: "<input type=\"text\" ng-model=\"dataItem.TruckInPlateNumber\" ng-readonly=\"dataItem.IsTruckInDisabled\"  />",
                    "title": $rootScope.resData.res_GridColumn_TruckInPlateNumber, width: "175px"
                },

                {
                    field: "TruckInDateTime",
                    "title": $rootScope.resData.res_GridColumn_TruckInDateTime, type: "date", width: "175px",
                    filterable:
                    {
                        cell:
                        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy HH:mm" },
                        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy HH:mm"
                    }, parseFormats: "{0:dd/MM/yyyy HH:mm}", format: "{0:dd/MM/yyyy HH:mm}", width: "175px"


                },

                {
                    field: "TruckOutPlateNumber",
                    template: "<input type=\"text\" ng-model=\"dataItem.TruckOutPlateNumber\" ng-readonly=\"dataItem.IsTruckOutDisabled || !dataItem.IsTruckInDisabled\" />",
                    "title": $rootScope.resData.res_GridColumn_TruckOutPlateNumber, width: "175px"
                },



                {
                    field: "TruckOutDateTime",
                    "title": $rootScope.resData.res_GridColumn_TruckOutDateTime,
                    type: "date", width: "175px",
                    filterable:
                    {
                        cell:
                        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy HH:mm" },
                        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy HH:mm"
                    }, parseFormats: "{0:dd/MM/yyyy HH:mm}", format: "{0:dd/MM/yyyy HH:mm}", width: "175px"


                },

                //{ template: "<input type=\"text\" ng-model=\"dataItem.PlateNumber\" />", "title": "Revised Plate Number", width: "175px" },
                { field: "TruckRemark", template: "<input type=\"text\" ng-model=\"dataItem.TruckRemark\" />", "title": "Remarks", width: "250px" },
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
                    field: "Action",
                    title: $rootScope.resData.res_GridColumn_Action,
                    template: "#if((TruckInDateTime !=null && TruckInDateTime != '') && (TruckOutDateTime == null || TruckOutDateTime == '')) {#<a class=\"greenbgfont approvebtn\" ng-click=\"ShipConfirmation('#=SalesOrderNumber#',#=CurrentState#)\"> Truck Out </a>#} else if(TruckInDateTime == null || TruckInDateTime == '') {#<a class=\"greenbgfont approvebtn\" ng-click=\"ShipConfirmation('#=SalesOrderNumber#',#=CurrentState#)\">  Truck In</a>#}#", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } }, width: "150px"
                },
                //{ title: "Save Order", template: "<a class=\"greenbgfont approvebtn\" ng-click=\"ClickToUpdateStatusAndPlateNumber('#=SalesOrderNumber#',dataItem.PlateNumber,#=CurrentState#)\"> Save Order </a>", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } }, width: "150px" },





            ],
        }




    $scope.toggleSelectAll = function (ev) {
        debugger;
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();


        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === item.SalesOrderNumber; });
            if (data.length > 0) {
                data[0].selected = ev.target.checked;

            }
            item.selected = ev.target.checked;
        });
    };


    $scope.onCheckBoxClick = function (ev, item) {
        debugger;
        var data = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === item.SalesOrderNumber; });
        if (data.length > 0) {
            data[0].selected = ev.target.checked;

        }
        item.selected = ev.target.checked;
    }


    function gridDataBound(e) {

        var grid = e.sender;
        if (grid.dataSource.total() == 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.GateKeeperConfirmationGrid.dataSource.transport.read($scope.values);
        }
    };

    $rootScope.GridRecallForStatus = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        ChangeGridHeaderTitleByLanguage($scope.GateKeeperConfirmationGrid, "GateKeeperConfirmationGrid", $rootScope.resData);
        gridCallBack();
        $scope.statusFilter($scope.StatusFilterEelement);
    }



    $scope.DriverDetails = function (id) {
        debugger;
        if (id != 0) {
            $scope.ClearDriverDetails();
            $scope.OpenViewGratisOrderControl();
            debugger;
            var requestDataForDriver =
                {
                    ServicesAction: 'LoadDriverDetailsByProfileId',
                    ProfileId: id

                }

            var consolidateApiParamaterForLoadDriverDetailsByProfileId =
                {
                    Json: requestDataForDriver,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterForLoadDriverDetailsByProfileId).then(function (response) {
                debugger;
                if (response.data != undefined) {
                    if (response.data.Profile != undefined) {


                        $scope.DriverName = response.data.Profile.ProfileList.Name;
                        $scope.DriverId = response.data.Profile.ProfileList.DriverId;
                        $scope.MobileNumber = response.data.Profile.ProfileList.ContactNumber;
                        $scope.Email = response.data.Profile.ProfileList.EmailId;
                        $scope.LicenseNumber = response.data.Profile.ProfileList.LicenseNumber;
                        $scope.UserImage.UserPhoto = response.data.Profile.ProfileList.UserProfilePicture;
                    } else {

                    }
                } else {

                }
            });
        }

    }

    $scope.ClearDriverDetails = function () {
        $scope.DriverName = "";
        $scope.DriverId = "";
        $scope.MobileNumber = "";
        $scope.Email = "";
        $scope.LicenseNumber = "";
        $scope.UserImage.UserPhoto = "Images/download.jpg";
    }


    $scope.UpdateAllShipConfirm = function () {
        debugger;


        var soNumberList = [];
        var orderListData = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (orderListData.length > 0) {







            for (var i = 0; i < orderListData.length; i++) {

                var soNumberJson = {
                    SoNumber: orderListData[i].SalesOrderNumber
                }
                soNumberList.push(soNumberJson);
            }
            var requestData =
                {
                    ServicesAction: 'ShipConfirm',
                    OrderList: soNumberList
                };
            // var stringfyjson = JSON.stringify(requestData);
            var jsonobject = {};
            jsonobject.Json = requestData;

            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                //$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GateKeeperListPage_SavedData), '', 3000);



                gridCallBack();
            });




        } else {
            //$rootScope.ValidationErrorAlert('Please Select SO Number.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GateKeeperListPage_SelectSONumber), '', 3000);

        }



    }


    $scope.ShipConfirmation = function (soNumber, currentStatus) {
        debugger;
        var emailId = "";
        var Field1 = "";
        var IsDeliveryPerssonnelcheck = false;
        var soNumberLists = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === soNumber; });
        if (soNumberLists.length > 0) {
            emailId = soNumberLists[0].Email;
            Field1 = soNumberLists[0].Field1;
        }
        //if (pickingDate != undefined) {
        var gridDataArray = $('#GateKeeperConfirmationGrid').data('kendoGrid')._data;
        var columnDataVector = [];
        var columnName = 'TruckRemark';
        var DeliveryPersonnelId = 'DeliveryPersonnelId';
        if (((soNumberLists[0].TruckInDateTime != null && soNumberLists[0].TruckInDateTime != '') && (soNumberLists[0].TruckOutDateTime == null || soNumberLists[0].TruckOutDateTime == ''))) {
            var columnNameRevisedPlateNumber = 'TruckOutPlateNumber';
        }
        else if (soNumberLists[0].TruckInDateTime == null || soNumberLists[0].TruckInDateTime == '') {
            var columnNameRevisedPlateNumber = 'TruckInPlateNumber';
        }
        for (var index = 0; index < gridDataArray.length; index++) {
            var columnValue = gridDataArray[index][columnName];
            var DeliveryPersonnelIdValue = gridDataArray[index][DeliveryPersonnelId];
            var columnValuecolumnNameRevisedPlateNumber = gridDataArray[index][columnNameRevisedPlateNumber];
            var sonumberGrid = soNumberLists.filter(function (el) { return el.SalesOrderNumber === gridDataArray[index]["SalesOrderNumber"]; });
            if (sonumberGrid.length > 0) {
                if (DeliveryPersonnelIdValue == 0 || DeliveryPersonnelIdValue == null) {
                    IsDeliveryPerssonnelcheck = true;
                }
                sonumberGrid[0].Remarks = columnValue;
                sonumberGrid[0].DeliveryPersonnelId = DeliveryPersonnelIdValue;
                sonumberGrid[0].LocationType = 1;
                sonumberGrid[0].UserId = $rootScope.UserId;
                if (soNumberLists[0].TruckInDateTime == null || soNumberLists[0].TruckInDateTime == '') {
                    sonumberGrid[0].TruckOutPlateNumberCheck = false;
                    sonumberGrid[0].TruckInPlateNumberCheck = true;
                    sonumberGrid[0].PlateNumberBy = "TruckIn";
                }
                else if (((soNumberLists[0].TruckInDateTime != null && soNumberLists[0].TruckInDateTime != '') && (soNumberLists[0].TruckOutDateTime == null || soNumberLists[0].TruckOutDateTime == ''))) {
                    sonumberGrid[0].TruckInPlateNumberCheck = false;
                    sonumberGrid[0].TruckOutPlateNumberCheck = false;
                    sonumberGrid[0].PlateNumberBy = "TruckOut";
                }


                if (columnValuecolumnNameRevisedPlateNumber !== undefined) {
                    sonumberGrid[0].PlateNumber = columnValuecolumnNameRevisedPlateNumber;
                }
            }
        };

        if (IsDeliveryPerssonnelcheck == false) {

            var requestData =
                {
                    ServicesAction: 'GateKeeperConfirmation',
                    OrderList: soNumberLists,
                };

            //  var stringfyjson = JSON.stringify(requestData);
            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                debugger;
                if (response.data.Json != null && response.data.Json != undefined) {
                    debugger;
                    if (Field1 == 'SCO') {
                        var requestData =
                            {
                                ServicesAction: 'InsertEmailNotification',
                                OrderList: soNumberLists,
                                SupplierId: 0,
                                ObjectType: 'Order',
                                ObjectId: soNumber,
                                EventType: 'CNESC',
                                Password: '',
                                SenderEmailAddress: emailId,
                                IsSent: 0,
                                SenderId: '',
                                IsActive: 1,
                                CreatedBy: $rootScope.UserId
                            };
                    }
                    else {
                        var requestData =
                            {
                                ServicesAction: 'InsertEmailNotification',
                                OrderList: soNumberLists,
                                SupplierId: 0,
                                ObjectType: 'Order',
                                ObjectId: soNumber,
                                EventType: 'CNE',
                                Password: '',
                                SenderEmailAddress: emailId,
                                IsSent: 0,
                                SenderId: '',
                                IsActive: 1,
                                CreatedBy: $rootScope.UserId
                            };

                    }
                   

                    //  var stringfyjson = JSON.stringify(requestData);
                    var jsonobject = {};
                    jsonobject.Json = requestData;
                    GrRequestService.ProcessRequest(jsonobject).then(function (response) {

                        //$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GateKeeperListPage_SavedData), '', 3000);

                        gridCallBack();

                    });

                } else {
                    debugger;
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GateKeeperListPage_SavedData), '', 3000);

                    gridCallBack();
                }




            });
        }
        else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GateKeeperListPage_SelectDeliveryPersonnel), '', 3000);
        }

    }


    $scope.LoadOrderView = function (salesOrderNumber) {
        debugger;
        $rootScope.SalesOrderNumber = salesOrderNumber;

        $state.go("CreateInquiryForSLM");
    }



});