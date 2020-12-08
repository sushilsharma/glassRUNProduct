angular.module("glassRUNProduct").controller('OrderGridGKController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {
    debugger;
    $scope.ReasonCodeEventName = "";
    $scope.OrderType = "SO";
    $scope.ProductCodes = '';
    $scope.ViewControllerName = "";
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    $scope.Location = {
        StockLocationId: 0
    }

    $scope.OldData = {
        StockLocationId: 0,
        RequestedDate: ''
    }


    $scope.bindAllBranchPlant = [];
    $scope.IsSelectedRow = 0;
    $scope.OrderTypeFilterJson = ['Gratis Order', 'Regular Order'];


    LoadActiveVariables($sessionStorage, $state, $rootScope);


    // Product Multiselect Autocomplete box.
    $scope.ProductSelectedList = [];
    $scope.ProductList = [];
    $scope.MultiSelectDropdownSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }





    $scope.LoadShiftList = function () {


        var lookuplist = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ShiftCategory'; });
        if (lookuplist.length > 0) {
            $scope.ShiftList = lookuplist;
        }
    }
    $scope.LoadShiftList();
    $scope.LoadSettingInfoByName = function (settingName, returnValueDataType) {
        debugger;
        var settingValue = "";
        if ($sessionStorage.AllSettingMasterData != undefined) {
            var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === settingName; });
            if (settingMaster.length > 0) {
                settingValue = settingMaster[0].SettingValue;
            }
        }
        if (returnValueDataType === "int") {
            if (settingValue !== "") {
                settingValue = parseInt(settingValue);
            }
        } else if (returnValueDataType === "float") {
            if (settingValue !== "") {
                settingValue = parseFloat(settingValue);
            }
        } else {
            settingValue = settingValue;
        }
        return settingValue;
    }
    $scope.LoadOrderData = function () {
        debugger;
        if ($rootScope.TemOrderData !== undefined) {
            if ($rootScope.TemOrderData.length > 0) {

                $scope.OrderData = $rootScope.TemOrderData.filter(function (el) { return el.OrderProductsList.length > 0 && el.IsTruckFull == true; });
                if ($scope.OrderData.length > 0) {

                    if ($scope.OrderData[0].OrderProposedETD !== "" && $scope.OrderData[0].OrderProposedETD !== undefined) {
                        $scope.SchedulingDateValue = $scope.ConvertDateFormat($scope.OrderData[0].OrderProposedETD);
                        //$scope.GetScheduleDate("", $scope.SchedulingDateValue);
                    }
                    $scope.CalculateTotalAmountOfProductWithTaxAndDeposite();

                    $scope.LoadReasonCode();

                    $rootScope.Throbber.Visible = false;
                    $scope.OldData.StockLocationId = $scope.OrderData[0].branchPlant;
                    $scope.OldData.RequestedDate = $scope.OrderData[0].OrderRequestDate;
                }
            }
            else {
                $scope.OrderData = [];

            }
        }
        else {
            $scope.OrderData = [];
        }
    }

    $scope.LoadCustomerCreditLimit = function (TempCompanyId, TempCompanyMnemonic) {
        var requestData =
            {

                ServicesAction: 'GetCreditLimitFromThirthParty',

                CompanyId: $scope.TempCompanyId,
                CompanyMnemonic: $scope.TempCompanyMnemonic
            };



        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            if (response.data !== null) {
                if (response.data.Json != undefined || response.data.Json != null) {
                    var resoponsedata = response.data.Json;

                    $rootScope.CreditLimit = resoponsedata.CreditLimit;
                    $rootScope.AvailableCreditLimit = resoponsedata.AvailableCreditLimit;

                    $rootScope.EmptiesLimit = 0;
                    $rootScope.ActualEmpties = 0;
                }
            }

            requestData =
                {
                    ServicesAction: 'LoadAvailableCreditLimitOfCustomer',
                    CompanyId: $scope.TempCompanyId,
                    EnquiryId: $rootScope.TempEnquiryDetailId
                };


            jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                debugger;

                var resoponsedata = response.data.Json;
                $rootScope.EmptiesLimit = resoponsedata.EmptiesLimit;
                $rootScope.ActualEmpties = resoponsedata.ActualEmpties;


                // Save Item Layer Validation Log.
                var requestDataforItemLayer =
                    {
                        UserId: $rootScope.UserId,
                        ObjectId: $scope.TempCompanyId,
                        ObjectType: "Credit Limit Of Customer Edit Enquiry " + $rootScope.TempEnquiryDetailId + "",
                        ServicesAction: 'CreateLog',
                        LogDescription: 'Load Available Credit Limit ' + Number($rootScope.AvailableCreditLimit) + ' UsedInEnquiryLimit ' + Number(resoponsedata.TotalEnquiryCreated) + ' and depositusedinenquiry ' + Number(resoponsedata.EnquiryTotalDepositAmount) + ' ',
                        LogDate: GetCurrentdate(),
                        Source: 'Portal',
                    };
                var consolidateApiParamaterItemLayer =
                    {
                        Json: requestDataforItemLayer,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

                });


                $rootScope.AvailableCreditLimit = Number($rootScope.AvailableCreditLimit) - Number(resoponsedata.TotalEnquiryCreated);

                $rootScope.AvailableCreditLimit = Number($rootScope.AvailableCreditLimit) - Number(resoponsedata.EnquiryTotalDepositAmount);

                $scope.ActualEmptiesValidation();

            });


        });

    }
    $scope.ConvertDateFormat = function (date) {
        debugger;

        var GetScheduleDateNumber = 6;
        if ($rootScope.AllSettingMasterData != undefined) {
            var truckBufferWeight = $rootScope.AllSettingMasterData.filter(function (el) { return el.SettingParameter === 'ScheduleDateNumber'; });
            if (truckBufferWeight.length > 0) {
                GetScheduleDateNumber = parseFloat(truckBufferWeight[0].SettingValue);
            }
        }

        var proposedetd = date.split(' ');
        var etd = proposedetd[0].split('/');
        var etddate = etd[1] + "/" + etd[0] + "/" + etd[2];

        var enddate = new Date(etddate);
        enddate.setDate(enddate.getDate() + GetScheduleDateNumber);

        var dd = enddate.getDate();
        var mm = enddate.getMonth() + 1;
        var y = enddate.getFullYear();
        var SchedulingDate = dd + '/' + mm + '/' + y;

        return SchedulingDate;
    }

    $scope.ActualEmptiesValidation = function () {
        if ($rootScope.ActualEmpties !== undefined) {
            if (Number($rootScope.ActualEmpties) > 0) {
                var emptiesNum = $rootScope.ActualEmpties.toString().replace("-", "");
                var emptiesValue = (Number($rootScope.ActualEmpties) * $scope.EmptiesAmount).toString().replace("-", "");
                $scope.EmptiesCss = false;
                //$scope.EmptiesLimitMessage = 'You have ' + emptiesNum + ' empties overdue for returns. Please arrange to return the empties or deposit ( ₫ ' + emptiesValue + ' ) to ensure your order gets processed.';
                $scope.EmptiesLimitMessage = String.format($rootScope.resData.res_CreateInquiryPage_EmptiesOverdue, emptiesNum, emptiesValue);
            }
            else {

                $scope.EmptiesLimitMessage = String.format($rootScope.resData.res_CreateInquiryPage_EmptiesLimit, $rootScope.ActualEmpties);
                //$scope.EmptiesLimitMessage = 'You can order for ' + $rootScope.ActualEmpties + ' more empties before you exhaust your empties limit.';
                $scope.EmptiesCss = true;
            }
        }
    }

    $scope.CalculateTotalAmountOfProductWithTaxAndDeposite = function () {
        debugger;
        var totalorderamount = 0;
        var totalDepositeamount = 0;
        var totaltaxamount = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            for (var j = 0; j < $scope.OrderData[i].OrderProductsList.length; j++) {
                if (parseInt($scope.OrderData[i].OrderProductsList[j].OrderProductId) === 0) {
                    totalorderamount += parseFloat($scope.OrderData[i].OrderProductsList[j].ItemPricesPerUnit) * parseFloat($scope.OrderData[i].OrderProductsList[j].ProductQuantity);
                    totalDepositeamount += parseFloat($scope.OrderData[i].OrderProductsList[j].DepositeAmountPerUnit) * parseFloat($scope.OrderData[i].OrderProductsList[j].ProductQuantity);
                }
                else {

                    if (parseInt($scope.OrderData[i].OrderProductsList[j].OrderProductId) !== 0 && ($scope.OrderData[i].OrderProductsList[j].IsActive === true || $scope.OrderData[i].OrderProductsList[j].IsActive === 1 || $scope.OrderData[i].OrderProductsList[j].IsActive === "1")) {
                        totalorderamount += parseFloat($scope.OrderData[i].OrderProductsList[j].ItemPricesPerUnit) * parseFloat($scope.OrderData[i].OrderProductsList[j].ProductQuantity);
                        totalDepositeamount += parseFloat($scope.OrderData[i].OrderProductsList[j].DepositeAmountPerUnit) * parseFloat($scope.OrderData[i].OrderProductsList[j].ProductQuantity);
                    }
                }

            }
        }
        totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);
        $rootScope.totalorderamount = parseFloat(totalorderamount) + parseFloat(totaltaxamount) + parseFloat(totalDepositeamount);
    }
    $scope.GetReceivingLocationBalanceCapacity = function (deliverylocationId, proposedDeliveryDate, TempCompanyId, deliverylocationCapacity, EnquiryId) {
        debugger;
        var requestData =
            {
                ServicesAction: 'GetReceivingLocationBalanceCapacity',
                CompanyId: TempCompanyId,
                ShipTo: deliverylocationId,
                ProposedDeliveryDate: proposedDeliveryDate,
                EnquiryId: 0
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data.Json.BalanceCapacity;
            $scope.DeliveryUsedCapacity = resoponsedata;
            $scope.DeliveryLocationCapacity = deliverylocationCapacity;
            $scope.LoadOrderData();

        });
    }

    $scope.IsRPMPresentFilter = function (element) {


        var EmptiesList = [];
        EmptiesList = ['Ok', 'Not Ok'];



        element.kendoDropDownList({
            dataSource: EmptiesList,
            optionLabel: "All",
            valuePrimitive: true,
        });
    }

    $scope.GetSoDetails = function (ordertype) {
        $rootScope.Throbber.Visible = true;
        $scope.OrderType = ordertype;
        gridCallBack();

    }

    $scope.GetSTDetails = function (ordertype) {
        $rootScope.Throbber.Visible = true;
        $scope.OrderType = ordertype;
        gridCallBack();

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



    $scope.StatusForChangeInPickShiftListFilter = function (element) {


        var StatusForChangeInPickShiftList = [];
        StatusForChangeInPickShiftList = ['Ok', 'Not Ok'];



        element.kendoDropDownList({
            dataSource: StatusForChangeInPickShiftList,
            optionLabel: "Status",
            valuePrimitive: true,
        });
    }


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



    $scope.bindAllBranchPlant = $rootScope.bindAllBranchPlant;

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.OrderDetailsGrid.dataSource.transport.read($scope.values);
        }
    };

    $scope.statusFilter = function (element) {
        debugger;
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


    $scope.ConfirmedPickupShiftFilter = function (element) {
        debugger;

        $scope.ConfirmedPickupShiftFilterEelement = element;
        var lookuplist = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ShiftCategory'; });
        var lookuplistName = [];
        if (lookuplist.length > 0) {
            for (var i = 0; i < lookuplist.length; i++) {
                lookuplistName.push(lookuplist[i].Name);
            }
        }
        element.kendoDropDownList({
            dataSource: lookuplistName,
            optionLabel: "Pick Shift",
            valuePrimitive: true,
        });
    }


    $rootScope.GridRecallForStatus = function () {

        $rootScope.Throbber.Visible = true;
        ChangeGridHeaderTitleByLanguage($scope.OrderDetailsGrid, "InquiryDetailsGrid", $rootScope.resData);

        gridCallBack();
        $scope.statusFilter($scope.StatusFilterEelement);
        $scope.ConfirmedPickupShiftFilter($scope.ConfirmedPickupShiftFilterEelement);
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


    $scope.OrderTypeFilter = function (element) {

        element.kendoDropDownList({
            dataSource: $scope.OrderTypeFilterJson,
            optionLabel: "OrderType",
            valuePrimitive: true,
        });
    }


    $scope.datepickerfilter = function (element) {

        element.kendoDatePicker({ format: "dd/MM/yyyy", parseFormats: "{0:dd/MM/yyyy}", valuePrimitive: true });
    }

    $scope.GetScheduleDate = function () {

        $('.customdatertryeytpicker').each(function () {

            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                        $scope.UpdateSchedulingDateOnChange(inst.id, dateText);
                    }

                },
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });
    }

    $scope.GetPickUpDate = function () {

        $('.PickupDate').each(function () {

            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');


                    }

                },
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });

        $('.ConfirmPickupDate').each(function () {

            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                        var orderId = inst.id.replace(/[A-Za-z$-]/g, "");

                        $scope.UpdateCondirmedPickDateOnChange(orderId, dateText);
                    }

                },
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });


    }

    $rootScope.TemOrderData = "";

    $scope.LoadDriverAndPlateNumber = function () {

        var requestDataForCarrier = {};

        if ($rootScope.RoleName === 'Carrier') {
            requestDataForCarrier =
                {
                    ServicesAction: 'LoadDriverByCarrier',
                    CarrierId: $rootScope.CompanyId,
                }
        }
        else {
            requestDataForCarrier =
                {
                    ServicesAction: 'LoadAllDriverList'
                }
        }



        var consolidateApiParamaterForCarrier =
            {
                Json: requestDataForCarrier,
            };

        GrRequestService.ProcessRequest(consolidateApiParamaterForCarrier).then(function (response) {

            if (response.data != undefined) {
                if (response.data.Json != undefined) {

                    $scope.DriverList = response.data.Json.ProfileList;
                } else {
                    $scope.DriverList = [];
                }
            } else {
                $scope.DriverList = [];
            }


            var requestDataForPlateNumber =
                {
                    ServicesAction: 'GetPlateNumberByCarrierId',
                    CarrierId: $rootScope.CompanyId,
                }

            var consolidateApiParamaterForPlateNumber =
                {
                    Json: requestDataForPlateNumber,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterForPlateNumber).then(function (response) {

                if (response.data != undefined) {
                    if (response.data.Json != undefined) {

                        $scope.PlateNumberList = response.data.Json.TransporterVehicleList;
                    } else {
                        $scope.PlateNumberList = [];
                    }
                } else {
                    $scope.PlateNumberList = [];
                }
            });

        });
    }


    $scope.OrderDetailsGrid =
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

                        var BranchPlantCode = "";
                        var BranchPlantCodeCriteria = "";

                        var BranchPlantName = "";
                        var BranchPlantNameCriteria = "";

                        var DeliveryLocation = "";
                        var DeliveryLocationCriteria = "";

                        var Status = "";
                        var StatusCriteria = "";

                        var PickShift = "";
                        var PickShiftCriteria = "";

                        var RequestDate = "";
                        var RequestDateCriteria = "";

                        var Gratis = "";
                        var GratisCriteria = "";

                        var OrderType = "";

                        var OrderDate = "";
                        var OrderDateCriteria = "";

                        var PickUpDate = "";
                        var PickUpDateCriteria = "";

                        var TruckSize = "";
                        var TruckSizeCriteria = "";

                        var UserName = "";
                        var UserNameCriteria = "";

                        var ProductCodeData = "";
                        var ProductCodeCriteria = "";

                        var ProductName = "";
                        var ProductNameCriteria = "";

                        var ProductQuantity = "";
                        var ProductQuantityCriteria = "";

                        var Description1 = "";
                        var Description1Criteria = "";

                        var Description2 = "";
                        var Description2Criteria = "";


                        var CarrierNumber = "";
                        var CarrierNumberCriteria = "";

                        var ConfirmedPickUpDate = "";
                        var ConfirmedPickUpDateCriteria = "";

                        var Province = "";
                        var ProvinceCriteria = "";

                        var OrderedBy = "";
                        var OrderedByCriteria = "";


                        var IsRPMPresent = "";
                        var IsRPMPresentCriteria = "";

                        var Empties = "";
                        var EmptiesCriteria = "";


                        var ReceivedCapacityPalates = "";
                        var ReceivedCapacityPalatesCriteria = "";


                        var StatusForChangeInPickShift = "";
                        var StatusForChangeInPickShiftCriteria = "";

                        var LoadNumber = "";
                        var LoadNumberCriteria = "";







                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };



                            for (var i = 0; i < options.data.filter.filters.length; i++) {
                                if (options.data.filter.filters[i].field === "SalesOrderNumber" || options.data.filter.filters[i].field === "SOGratisNumber") {
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

                                if (options.data.filter.filters[i].field === "BranchPlantName") {
                                    BranchPlantCode = options.data.filter.filters[i].value;
                                    BranchPlantCodeCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "DeliveryLocationBranchName") {
                                    BranchPlantName = options.data.filter.filters[i].value;
                                    BranchPlantNameCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "DeliveryLocation") {
                                    DeliveryLocation = options.data.filter.filters[i].value;
                                    DeliveryLocationCriteria = options.data.filter.filters[i].operator;

                                }
                                if (options.data.filter.filters[i].field === "AssociatedOrder") {
                                    Gratis = options.data.filter.filters[i].value;
                                    GratisCriteria = options.data.filter.filters[i].operator;

                                }
                                debugger;
                                if (options.data.filter.filters[i].field === "Status") {
                                    Status = options.data.filter.filters[i].value;
                                    StatusCriteria = options.data.filter.filters[i].operator;

                                }
                                debugger;
                                if (options.data.filter.filters[i].field === "ExpectedShift") {
                                    PickShift = options.data.filter.filters[i].value;
                                    PickShiftCriteria = options.data.filter.filters[i].operator;

                                }
                                if (options.data.filter.filters[i].field === "ExpectedTimeOfDelivery") {

                                    RequestDate = options.data.filter.filters[i].value;
                                    RequestDate = new Date(RequestDate);
                                    RequestDate = $filter('date')(RequestDate, "dd/MM/yyyy");
                                    RequestDateCriteria = options.data.filter.filters[i].operator;


                                }

                                //if (options.data.filter.filters[i].field === "OrderType") {
                                //    OrderType = options.data.filter.filters[i].value;
                                //}

                                if (options.data.filter.filters[i].field === "OrderDate") {
                                    OrderDate = options.data.filter.filters[i].value;
                                    OrderDate = new Date(OrderDate);
                                    OrderDate = $filter('date')(OrderDate, "dd/MM/yyyy");
                                    OrderDateCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "ProposedTimeOfAction") {
                                    PickUpDate = options.data.filter.filters[i].value;
                                    PickUpDate = new Date(PickUpDate);
                                    PickUpDate = $filter('date')(PickUpDate, "dd/MM/yyyy");
                                    PickUpDateCriteria = options.data.filter.filters[i].operator;

                                }



                                if (options.data.filter.filters[i].field === "ExpectedTimeOfAction") {
                                    ConfirmedPickUpDate = options.data.filter.filters[i].value;
                                    ConfirmedPickUpDate = new Date(ConfirmedPickUpDate);
                                    ConfirmedPickUpDate = $filter('date')(ConfirmedPickUpDate, "dd/MM/yyyy");
                                    ConfirmedPickUpDateCriteria = options.data.filter.filters[i].operator;

                                }


                                if (options.data.filter.filters[i].field === "CompanyNameValue" || options.data.filter.filters[i].field === "CompanyName") {
                                    CompanyNameValue = options.data.filter.filters[i].value;
                                    CompanyNameValueCriteria = options.data.filter.filters[i].operator;

                                }
                                if (options.data.filter.filters[i].field === "UserName") {
                                    UserName = options.data.filter.filters[i].value;
                                    UserNameCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "TruckSize") {
                                    TruckSize = options.data.filter.filters[i].value;
                                    TruckSizeCriteria = options.data.filter.filters[i].operator;


                                }

                                if (options.data.filter.filters[i].field === "ProductCode") {
                                    ProductCodeData = options.data.filter.filters[i].value;
                                    ProductCodeCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "ProductName") {
                                    ProductName = options.data.filter.filters[i].value;
                                    ProductNameCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "ProductQuantity") {
                                    ProductQuantity = options.data.filter.filters[i].value;
                                    ProductQuantityCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "Description1") {
                                    Description1 = options.data.filter.filters[i].value;
                                    Description1Criteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "Description2") {
                                    Description2 = options.data.filter.filters[i].value;
                                    Description2Criteria = options.data.filter.filters[i].operator;

                                }



                                if (options.data.filter.filters[i].field === "LoadNumber") {
                                    LoadNumber = options.data.filter.filters[i].value;
                                    LoadNumberCriteria = options.data.filter.filters[i].operator;

                                }


                                if (options.data.filter.filters[i].field === "CarrierNumberValue") {
                                    CarrierNumber = options.data.filter.filters[i].value;
                                    CarrierNumberCriteria = options.data.filter.filters[i].operator;

                                }

                                if (options.data.filter.filters[i].field === "Province") {
                                    Province = options.data.filter.filters[i].value;
                                    ProvinceCriteria = options.data.filter.filters[i].operator;

                                }


                                if (options.data.filter.filters[i].field === "OrderedBy") {
                                    OrderedBy = options.data.filter.filters[i].value;
                                    OrderedByCriteria = options.data.filter.filters[i].operator;

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



                                if (options.data.filter.filters[i].field === "ReceivedCapacityPalettes") {

                                    if (options.data.filter.filters[i].value === 'Ok') {
                                        ReceivedCapacityPalates = '1';
                                    }
                                    else if (options.data.filter.filters[i].value === 'Not Ok') {
                                        ReceivedCapacityPalates = '0';
                                    }

                                    ReceivedCapacityPalatesCriteria = options.data.filter.filters[i].operator;

                                }



                                if (options.data.filter.filters[i].field === "StatusForChangeInPickShift") {

                                    if (options.data.filter.filters[i].value === 'Ok') {
                                        StatusForChangeInPickShift = '1';
                                    }
                                    else if (options.data.filter.filters[i].value === 'Not Ok') {
                                        StatusForChangeInPickShift = '0';
                                    }

                                    StatusForChangeInPickShiftCriteria = options.data.filter.filters[i].operator;

                                }


                                if (options.data.filter.filters[i].field === "IsRPMPresent") {

                                    if (options.data.filter.filters[i].value === 'Ok') {
                                        IsRPMPresent = '1';
                                    }
                                    else if (options.data.filter.filters[i].value === 'Not Ok') {
                                        IsRPMPresent = '0';
                                    }

                                    IsRPMPresentCriteria = options.data.filter.filters[i].operator;


                                }
                            }

                        }

                        var page = $location.absUrl().split('#/')[1];
                        $scope.ViewControllerName = page;
                        if (page === "GratisOrderGrid") {
                            $scope.OrderType = "Gratis Order";
                        }
                        $scope.pageIndex = options.data.page - 1;
                        $scope.pageSize = options.data.pageSize;
                        var requestData =
                            {
                                ServicesAction: 'LoadOrderNewGrid',
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
                                BranchPlantCode: BranchPlantCode,
                                BranchPlantCodeCriteria: BranchPlantCodeCriteria,
                                BranchPlantName: BranchPlantName,
                                BranchPlantNameCriteria: BranchPlantNameCriteria,
                                DeliveryLocation: DeliveryLocation,
                                DeliveryLocationCriteria: DeliveryLocationCriteria,
                                Gratis: Gratis,
                                GratisCriteria: GratisCriteria,
                                RequestDate: RequestDate,
                                RequestDateCriteria: RequestDateCriteria,
                                Status: Status,
                                StatusCriteria: StatusCriteria,
                                PickShift: PickShift,
                                PickShiftCriteria: PickShiftCriteria,
                                OrderType: $scope.OrderType,
                                OrderDate: OrderDate,
                                OrderDateCriteria: OrderDateCriteria,
                                PickUpDate: PickUpDate,
                                PickUpDateCriteria: PickUpDateCriteria,
                                LoadNumber: LoadNumber,
                                LoadNumberCriteria: LoadNumberCriteria,
                                ConfirmedPickUpDate: ConfirmedPickUpDate,
                                ConfirmedPickUpDateCriteria: ConfirmedPickUpDateCriteria,
                                Empties: Empties,
                                EmptiesCriteria: EmptiesCriteria,
                                ReceivedCapacityPalates: ReceivedCapacityPalates,
                                ReceivedCapacityPalatesCriteria: ReceivedCapacityPalatesCriteria,
                                StatusForChangeInPickShift: StatusForChangeInPickShift,
                                StatusForChangeInPickShiftCriteria: StatusForChangeInPickShiftCriteria,
                                RoleMasterId: $rootScope.RoleId,
                                CultureId: $rootScope.CultureId,
                                ProductCodeData: ProductCodeData,
                                ProductCodeCriteria: ProductCodeCriteria,
                                ProductName: ProductName,
                                ProductNameCriteria: ProductNameCriteria,
                                ProductQuantity: ProductQuantity,
                                ProductQuantityCriteria: ProductQuantityCriteria,
                                ProductCode: $scope.ProductCodes,
                                ProductSearchCriteria: $scope.ProductSearchCriteria,
                                Description1: Description1,
                                Description1Criteria: Description1Criteria,
                                Description2: Description2,
                                Description2Criteria: Description2Criteria,
                                Province: Province,
                                ProvinceCriteria: ProvinceCriteria,
                                OrderedBy: OrderedBy,
                                OrderedByCriteria: OrderedByCriteria,
                                IsRPMPresent: IsRPMPresent,
                                IsRPMPresentCriteria: IsRPMPresentCriteria,
                                CarrierNumber: CarrierNumber,
                                CarrierNumberCriteria: CarrierNumberCriteria,
                                UserId: $rootScope.CompanyId,
                                LoginId: $rootScope.UserId
                            };
                        $scope.RequestDataFilter = requestData;
                        //var stringfyjson = JSON.stringify(requestData);
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
                                if (resoponsedata != null) {


                                    if (resoponsedata.Json !== undefined) {

                                        if (resoponsedata.Json.OrderList.length != undefined) {
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
                                        var editOrderstatus = "";
                                        var editOrdertillstatusList = $rootScope.AllSettingMasterData.filter(function (el) { return el.SettingParameter === 'OrderEditTillStatus'; });
                                        if (editOrdertillstatusList.length > 0) {
                                            editOrderstatus = editOrdertillstatusList[0].SettingValue;
                                        }


                                        debugger;
                                        for (var i = 0; i < ListData.length; i++) {
                                            var orderList = ListData.filter(function (el) { return el.OrderId === ListData[i].OrderId });

                                            if (orderList.length > 0) {

                                                if (editOrderstatus !== "") {
                                                    var tempstate = editOrderstatus.split(',');
                                                    if (tempstate !== null && tempstate !== undefined) {
                                                        debugger;
                                                        orderList[0].IsEditOrderStatusConfiguration = false;
                                                        for (var k = 0; k < tempstate.length; k++) {
                                                            if (orderList[0].CurrentState == tempstate[k]) {
                                                                orderList[0].IsEditOrderStatusConfiguration = true;
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    orderList[0].IsEditOrderStatusConfiguration = false;
                                                }


                                                orderList[0].OrderGUID = generateGUID();

                                                //orderList[0].OrderTime = orderList[0].OrderDate.split('T')[1].split(':')[0];
                                                //orderList[0].OrderDate = orderList[0].OrderDate.split('T')[0];

                                                if (orderList[0].TruckInDateTime == "1900-01-01T00:00:00") {
                                                    orderList[0].IsTruckInDisabled = false;
                                                    orderList[0].TruckInDateTime = "";
                                                } else {
                                                    orderList[0].IsTruckInDisabled = true;
                                                }

                                                if (orderList[0].TruckOutDateTime == "1900-01-01T00:00:00") {
                                                    orderList[0].IsTruckOutDisabled = false;
                                                    orderList[0].TruckOutDateTime = "";
                                                } else {
                                                    orderList[0].IsTruckOutDisabled = true;
                                                }

                                                if (orderList[0].TruckInPlateNumber == "" || orderList[0].TruckInPlateNumber == undefined) {
                                                    orderList[0].TruckInPlateNumber = orderList[0].PreviousPlateNumber;
                                                }

                                                if (orderList[0].TruckOutPlateNumber == "" || orderList[0].TruckOutPlateNumber == undefined || orderList[0].TruckOutPlateNumber == null) {
                                                    orderList[0].TruckOutPlateNumber = orderList[0].PreviousPlateNumber;
                                                }

                                                if (orderList[0].TruckOutDateTime == "1900-01-01T00:00:00" || orderList[0].TruckOutDateTime == "") {
                                                    if (orderList[0].TruckInPlateNumber != "") {
                                                        orderList[0].TruckOutPlateNumber = orderList[0].TruckInPlateNumber;
                                                    }
                                                }

                                                if (orderList[0].TruckOutPlateNumber != "" && orderList[0].TruckOutPlateNumber != null) {
                                                    orderList[0].TruckOutPlateNumber = orderList[0].TruckOutPlateNumber;
                                                }


                                                if (orderList[0].OrderProductList != undefined) {
                                                    var orderProduct = orderList[0].OrderProductList.filter(function (el) { return el.ProductCode !== WoodenPalletCode });
                                                    if (orderProduct.length > 0) {
                                                        for (var j = 0; j < orderProduct.length; j++) {
                                                            var availableProductStock = orderProduct[j].ProductAvailableQuantity;
                                                            var totalUsedQuantity = parseFloat(orderProduct[j].UsedQuantityInOrder);
                                                            var remainingProductStock = parseFloat(parseFloat(availableProductStock) - parseFloat(totalUsedQuantity));
                                                            if (parseFloat(orderProduct[j].ProductQuantity) < remainingProductStock) {
                                                                orderProduct[j].IsItemAvailableInStock = true;

                                                            } else {
                                                                orderProduct[j].IsItemAvailableInStock = false;
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

                                                    } else {
                                                        orderList[0].IsAvailableStock = false;
                                                        orderList[0].IsGratisItemAvailable = false;
                                                    }
                                                } else {
                                                    orderList[0].IsAvailableStock = false;
                                                    orderList[0].IsGratisItemAvailable = false;
                                                }
                                            } else {
                                                orderList[0].IsAvailableStock = false;
                                                orderList[0].IsGratisItemAvailable = false;
                                            }
                                        }

                                    } else {
                                        ListData = [];
                                        totalcount = 0;
                                    }
                                }

                                $scope.LoadDriverAndPlateNumber();

                                var inquiryList = {
                                    data: ListData,
                                    totalRecords: totalcount
                                }
                                $scope.GridData = inquiryList;
                                options.success(inquiryList);
                                $scope.values = options;

                                $rootScope.Throbber.Visible = false;
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
            reorderable: true,
            pageable:
            {
                pageSizes: [10, 50, 100]
            },
            sortable: true,
            groupable: false,
            columnMenu: true,
            mobile: true,
            dataBound: gridDataBound,

            columns: [
                {
                    field: "CheckBox",
                    template: "<input type='checkbox' class='checkbox' ng-model=\"dataItem.selected\" ng-click='onCheckBoxClick($event, dataItem)' />",
                    filterable: false,
                    title: "",
                    width: "50px"
                },
                {
                    field: "OrderDate", "title": $rootScope.resData.res_GridColumn_OrderDate, type: "date",
                    filterable:
                    {
                        cell:
                        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy HH:mm" },
                        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy HH:mm"
                    }, parseFormats: "{0:dd/MM/yyyy HH:mm}", format: "{0:dd/MM/yyyy HH:mm}", width: "175px"
                },
                {
                    field: "EnquiryAutoNumber", template: '<a ng-click=\"LoadOrderView(\'#=SalesOrderNumber#\',#=OrderId#)\"  class="graybgfont">#:EnquiryAutoNumber#</a>',
                    title: $rootScope.resData.res_GridColumn_EnquiryAutoNumber, type: "string", filterable: { mode: "row", extra: false },
                    width: "120px"
                },

                {
                    field: "SalesOrderNumber", template: '<a ng-click=\"LoadOrderView(\'#=SalesOrderNumber#\',#=OrderId#)\" class="graybgfont">#:SalesOrderNumber#</a>',
                    title: $rootScope.resData.res_GridColumn_SalesOrderNumber, type: "string", filterable: { mode: "row", extra: false },
                    width: "120px"
                },

                //{
                //    field: "SOGratisNumber", template: '<a ng-click=\"LoadOrderView(\'#=SalesOrderNumber#\',#=IsAvailableStock#)\" class="graybgfont">#:SalesOrderNumber#</a>',
                //    title: $rootScope.resData.res_GridColumn_SOGratisNumber, type: "string", filterable: { mode: "row", extra: false },
                //    width: "120px"
                //},

                //{
                //    field: "PurchaseOrderNumber", template: '<a  class="graybgfont">#:PurchaseOrderNumber#</a>',
                //    title: $rootScope.resData.res_GridColumn_PurchaseOrderNumber, type: "string", filterable: { mode: "row", extra: false },
                //    width: "120px"
                //},



                //{
                //    field: "TotalPrice", title: $rootScope.resData.res_GridColumn_TotalPrice, template: "{{dataItem.TotalPrice | currency : 'EUR'}}", "text-align": "center", type: "string", filterable: false,

                //    width: "100px"
                //},
                { field: "AssociatedOrder", "title": $rootScope.resData.res_GridColumn_AssociatedOrder, type: "string", filterable: { mode: "row", extra: false }, width: "200px" },

                {
                    field: "BranchPlantName", title: $rootScope.resData.res_GridColumn_BranchPlantName, type: "string", filterable: { mode: "row", extra: false }, width: "100px"
                },

                //{
                //    field: "DeliveryLocationBranchName", title: $rootScope.resData.res_GridColumn_DeliveryLocationBranchName, type: "string", filterable: { mode: "row", extra: false }, width: "250px"
                //},


                {
                    field: "CompanyName", title: $rootScope.resData.res_GridColumn_CompanyName, type: "string", filterable: { mode: "row", extra: false }, width: "150px"
                },

                { field: "DeliveryLocation", title: $rootScope.resData.res_GridColumn_DeliveryLocation, type: "string", filterable: { mode: "row", extra: false }, width: "100px" },


                //{ field: "LoadNumber", title: $rootScope.resData.res_GridColumnLoadNumber, type: "string", filterable: { mode: "row", extra: false }, width: "100px" },


                //{
                //    field: "StockLocationId",
                //    template: "<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.DeliveryLocationId\" ng-change=\"getSelectedBranchPlantvalue(dataItem.DeliveryLocationId,#=OrderId#)\" ng-options=\"obj.DeliveryLocationId as obj.DeliveryLocationCode for obj in bindAllBranchPlant\"><option value=\"\">Select</option></select>",
                //    title: $rootScope.resData.res_GridColumn_StockLocationId,
                //    width: "175px",
                //    filterable: {
                //        cell: { showOperators: false, template: $scope.BranchPlantFilter },
                //        ui: $scope.BranchPlantFilter, mode: "row", extra: false, operators: {
                //            string: {
                //                eq: "Is equal to",
                //            }
                //        }
                //    },
                //    width: "175px"
                //},



                //{
                //    field: "TruckSize", title: $rootScope.resData.res_GridColumn_TruckSize, type: "string", filterable: { mode: "row", extra: false }, width: "100px"
                //},

                //{
                //    field: "Note",
                //    template: "<a ng-hide=\"dataItem.Note === '' || dataItem.Note === null || dataItem.Note === undefined\" ng-click=\"OpenModelPoppupNote(#=OrderId#)\"><i class=\"fa fa-sticky-note stickynotecolor\"></i></a>",
                //    "title": $rootScope.resData.res_GridColumn_Note,
                //    type: "string",
                //    filterable: false, width: "75px"
                //},

                //{
                //    field: "Empties",
                //    template: "#if(Empties==='C') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else{#<span class='orangebgfont'><i class='fa fa-exclamation-triangle'></i></span>#}#",
                //    "title": $rootScope.resData.res_GridColumn_Empties,
                //    type: "string",
                //    filterable: {
                //        cell: { showOperators: false, template: $scope.EmptiesListFilter },
                //        ui: $scope.EmptiesListFilter, mode: "row", extra: false, operators: {
                //            string: {
                //                eq: "Is equal to",
                //            }
                //        }
                //    }, width: "75px"
                //},




                //{
                //    field: "StatusForChangeInPickShift",
                //    template: "#if(StatusForChangeInPickShift==='1') {# <span class='orangebgfont'><i class='fa fa-exclamation-triangle'></i></span> #} else{# <span class='greenbgfont'><i class='fa fa-check'></i></span> #}#",
                //    "title": $rootScope.resData.res_GridColumn_ChangeInPickShift,
                //    type: "string",
                //    filterable: {
                //        cell: { showOperators: false, template: $scope.StatusForChangeInPickShiftListFilter },
                //        ui: $scope.StatusForChangeInPickShiftListFilter, mode: "row", extra: false, operators: {
                //            string: {
                //                eq: "Is equal to",
                //            }
                //        }
                //    }, width: "75px"
                //},




                //{
                //    field: "IsRPMPresent",
                //    template: "#if(IsRPMPresent === '1') {#<span class='greenbgfont'><i class='fa fa-check'></i></span> #} else if(IsRPMPresent === '0') {#<span class='redbgfont'><i class='fa fa-times'></i></span>#}#",
                //    "title": "RPM",
                //    type: "string",
                //    filterable: {
                //        cell: { showOperators: false, template: $scope.IsRPMPresentFilter },
                //        ui: $scope.IsRPMPresentFilter, mode: "row", extra: false, operators: {
                //            string: {
                //                eq: "Is equal to",
                //            }
                //        }
                //    }, width: "100px"
                //},


                //{
                //    field: "ReceivedCapacityPalettes",
                //    template: "#if(ReceivedCapacityPalettesCheck==='1') {#<span class=''>#=ReceivedCapacityPalettes# / #=Capacity#</i></span> #} else{#<span class='fontred'>#=ReceivedCapacityPalettes# / #=Capacity#</span>#}#",
                //    "title": $rootScope.resData.res_GridColumn_ReceivedCapacityPalettes,
                //    type: "string",
                //    filterable: {
                //        cell: { showOperators: false, template: $scope.ReceivedCapacityPalettesListFilter },
                //        ui: $scope.ReceivedCapacityPalettesListFilter, mode: "row", extra: false, operators: {
                //            string: {
                //                eq: "Is equal to",
                //            }
                //        }
                //    }, width: "75px"
                //},



                //{
                //    field: "RequestDate", title: $rootScope.resData.res_GridColumn_RequestedDate, type: "string", filterable: false, width: "175px"
                //},






                {
                    field: "DeliveryPersonnelId",
                    //template: "<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.DeliveryPersonnelId\"   ng-options=\"obj.DeliveryPersonnelId as obj.Name for obj in DriverList\"><option value=\"\">Select</option></select>",
                    template: "#if(Field1=='SCO') {#<input type=\"text\"  ng-model=\"dataItem.DeliveryPersonName\"/>#} else {#<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.DeliveryPersonnelId\"   ng-options=\"obj.DeliveryPersonnelId as obj.Name for obj in DriverList\"><option value=\"\">Select</option></select>#}#",
                    "title": "Driver",
                    filterable: { mode: "row", extra: false },
                    type: "string",
                    width: "175px"
                },


                { field: "CarrierNumberValue", title: $rootScope.resData.res_GridColumn_CarrierNumberValue, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },



                //{
                //    field: "PlateNumber",
                //    template: "<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.PlateNumber\"   ng-options=\"obj.TransporterVehicleRegistrationNumber as obj.TransporterVehicleRegistrationNumber for obj in PlateNumberList\"><option value=\"\">Select</option></select>",
                //    "title": $rootScope.resData.res_GridColumn_PlateNumber,
                //    filterable: { mode: "row", extra: false },
                //    type: "string",
                //    width: "175px"
                //},






                //{
                //    field: "ProposedTimeOfAction",
                //    template: "<div class=\"prepend-icon\"><input type=\"text\" Id=\"Pickup{{dataItem.OrderId}}\" ng-model='dataItem.ProposedTimeOfAction' ng-disabled=\"RoleId === 7 || RoleId === 6\" name=\"datepicker\" class=\"PickupDate form-control\"  placeholder=\"Select a date...\"><i class=\"icon-calendar\"></i></div>", type: "date",
                //    filterable:
                //    {
                //        cell:
                //        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy HH:mm" },
                //        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy HH:mm"
                //    }, parseFormats: "{0:dd/MM/yyyy HH:mm}", format: "{0:dd/MM/yyyy HH:mm}",
                //    "title": "Pick-up Date", width: "175px", format: "{0:dd/MM/yyyy}",
                //},

                //{
                //    field: "ProposedShift",
                //    template: "<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.ProposedShift\" ng-disabled=\"RoleId === 7 || RoleId === 6\" ng-options=\"obj.LookUpId as obj.Name for obj in ShiftList\"><option value=\"\">Select</option></select>",
                //    title: "Pick Shift",
                //    width: "175px",
                //},

                //{
                //    field: "ExpectedTimeOfDelivery", title: "SoldTo", width: "175px", format: "{0:dd/MM/yyyy}", "title":
                //    $rootScope.resData.res_CustomerOrderColumn_ExpectedTimeOfDelivery, type: "string", filterable: { mode: "row", extra: false }
                //},

                {
                    field: "ExpectedTimeOfAction",
                    template: "<div class=\"prepend-icon\"><input type=\"text\" Id=\"ConfirmPickup{{dataItem.OrderId}}\" ng-model='dataItem.ExpectedTimeOfAction' ng-disabled=\"RoleId === 3 || RoleId === 6\" name=\"datepicker\" class=\"ConfirmPickupDate form-control\"  placeholder=\"Select a date...\"><i class=\"icon-calendar\"></i></div>",
                    "title": "Confirmed Pickup Date",

                    filterable:
                    {
                        cell:
                        { showOperators: false, template: $scope.datepickerfilter, format: "dd/MM/yyyy" },
                        ui: $scope.datepickerfilter, mode: "row", extra: false, format: "dd/MM/yyyy"
                    }, parseFormats: "{0:dd/MM/yyyy}", width: "175px"
                },



                //{
                //    field: "ExpectedShift", template: '<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.ExpectedShift\" ng-change=\"getSelectedPickShiftvalue(dataItem.ExpectedShift,#=OrderId#)\" ng-disabled=\"RoleId === 3 || RoleId === 6\" ng-options=\"obj.LookUpId as obj.Name for obj in ShiftList\"><option value=\"\">Select</option></select>',
                //    title: 'Confirmed Pick Shift', type: "string", filterable: {
                //        cell: { showOperators: false, template: $scope.ConfirmedPickupShiftFilter },
                //        ui: $scope.ConfirmedPickupShiftFilter, mode: "row", extra: false, operators: {
                //            string: {
                //                eq: "Is equal to",
                //            }
                //        }
                //    },
                //    width: "175px"
                //},



                //{ field: "UserName", title: $rootScope.resData.res_GridColumn_UserName, type: "string", filterable: { mode: "row", extra: false }, width: "120px" },


                {
                    field: "DriverName", template: '<a ng-click=\"DriverDetails(#=ProfileId#)\" class="graybgfont">#:DriverName#</a>',
                    title: 'Assigned Driver', type: "string", filterable: { mode: "row", extra: false },
                    width: "200px"
                },

                { field: "PreviousPlateNumber", title: $rootScope.resData.res_GridColumn_PreviousPlateNumber, type: "string", filterable: { mode: "row", extra: false }, width: "175px" },


                //{
                //    field: "TruckInPlateNumber",
                //    template: "<input type=\"text\" ng-model=\"dataItem.TruckInPlateNumber\" ng-readonly=\"dataItem.IsTruckInDisabled\"  />",
                //    "title": $rootScope.resData.res_GridColumn_TruckInPlateNumber, width: "175px"
                //},


                {
                    field: "TruckInPlateNumber",
                    template: "#if(Field1=='SCO') {#<input type=\"text\"  ng-model=\"dataItem.TruckInPlateNumber\" ng-readonly=\"dataItem.IsTruckInDisabled\"  />#} else {#<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.TruckInPlateNumber\"  ng-readonly=\"dataItem.IsTruckInDisabled\"  ng-options=\"obj.TransporterVehicleRegistrationNumber as obj.TransporterVehicleRegistrationNumber for obj in PlateNumberList\"><option value=\"\">Select</option></select>#}#",
                    "title": $rootScope.resData.res_GridColumn_TruckInPlateNumber,
                    filterable: { mode: "row", extra: false },
                    type: "string",
                    width: "175px"
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

                //{
                //    field: "TruckOutPlateNumber",
                //    template: "<input type=\"text\" ng-model=\"dataItem.TruckOutPlateNumber\" ng-readonly=\"dataItem.IsTruckOutDisabled || !dataItem.IsTruckInDisabled\" />",
                //    "title": $rootScope.resData.res_GridColumn_TruckOutPlateNumber, width: "175px"
                //},

                {
                    field: "TruckOutPlateNumber",
                    template: "#if(Field1=='SCO') {#<input type=\"text\"  ng-model=\"dataItem.TruckOutPlateNumber\" ng-readonly=\"dataItem.IsTruckOutDisabled || !dataItem.IsTruckInDisabled\"   />#} else {#<select class=\"form-control\" style=\"margin:0px !important\"  ng-model=\"dataItem.TruckOutPlateNumber\"  ng-readonly=\"dataItem.IsTruckOutDisabled || !dataItem.IsTruckInDisabled\"   ng-options=\"obj.TransporterVehicleRegistrationNumber as obj.TransporterVehicleRegistrationNumber for obj in PlateNumberList\"><option value=\"\">Select</option></select>#}#",
                    "title": $rootScope.resData.res_GridColumn_TruckOutPlateNumber,
                    filterable: { mode: "row", extra: false },
                    type: "string",
                    width: "175px"
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

                { field: "TruckRemark", template: "<input type=\"text\" ng-model=\"dataItem.TruckRemark\" />", "title": "Remarks", width: "250px" },

                //{ field: "ProductCode", title: $rootScope.resData.res_GridColumn_ProductCode, type: "string", filterable: { mode: "row", extra: false }, "width": "200px" },

                //{ field: "ProductName", title: $rootScope.resData.res_GridColumn_ProductName, type: "string", filterable: { mode: "row", extra: false }, "width": "200px" },

                //{ field: "ProductQuantity", title: $rootScope.resData.res_GridColumn_ProductQuantity, type: "string", filterable: { mode: "row", extra: false }, "width": "200px" },

                //{ field: "UsedGratisOrder", title: 'Gratis Status', type: "string", filterable: false, width: "120px" },


                //{ field: "GratisCode", title: $rootScope.resData.res_GridColumn_GratisCode, type: "string", filterable: { mode: "row", extra: false }, width: "150px" },
                //{ field: "Province", title: $rootScope.resData.res_GridColumn_Province, type: "string", filterable: { mode: "row", extra: false }, "width": "150px" },
                //{ field: "OrderedBy", title: $rootScope.resData.res_GridColumn_OrderedBy, type: "string", filterable: { mode: "row", extra: false }, "width": "150px" },
                //{ field: "Description1", title: $rootScope.resData.res_GridColumn_Description1, type: "string", filterable: { mode: "row", extra: false }, "width": "200px" },
                //{ field: "Description2", title: $rootScope.resData.res_GridColumn_Description2, type: "string", filterable: { mode: "row", extra: false }, "width": "250px" },

                //{ field: "PlateNumberData", "title": "Plate #", type: "string", filterable: { mode: "row", extra: false }, width: "200px" },
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

                //{
                //    field: "ViewRPM",
                //    title: $rootScope.resData.res_GridColumn_ViewRPM, template: "##<a class=\"greenbgfont approvebtn\" ng-click=\"ShowRPMItemCollection('#=OrderGUID#')\">RPM</a>", type: "string",
                //    filterable: false,
                //    width: "150px"
                //},

                //{
                //    field: "Action",
                //    title: $rootScope.resData.res_GridColumn_Action, template: "#if(HoldStatus !='-' ) {# Hold on  #=HoldStatus# #} else if(CurrentState == 3) {#<a class=\"greenbgfont approvebtn\" ng-click=\"PrintPickSlipByOrderId(#=OrderId#)\">  Print Pickslip </a>#} else if(CurrentState == 4 || CurrentState == 6 || CurrentState == 35) {#<a class=\"greenbgfont approvebtn\" ng-click=\"RePrintPickSlipByOrderId(#=OrderId#,#=BranchPlantName#)\">   RePrint Pickslip</a>#} else {#-#}#", type: "string",
                //    filterable: false,
                //    width: "150px"
                //}
                //,




                //{
                //    field: "Document",
                //    title: $rootScope.resData.res_GridColumn_Document, template: "#if(HoldStatus !='-' ) {# - #} else if(CurrentState == 4 || CurrentState == 6 || CurrentState == 35) {#<a class=\"greenbgfont approvebtn\" ng-click=\"DownloadDocumentByOrderId(#=OrderId#)\">  <i class='fa fa-file-pdf-o' style='font-size: 25px; color: red;' aria-hidden='true'></i> </a>#} else  {#-#}#", type: "string",
                //    filterable: false,
                //    width: "150px"
                //},

                //{
                //    field: "Update",
                //    title: $rootScope.resData.res_GridColumn_Edit, template: "#if(IsEditOrderStatusConfiguration == true ) {#<a class=\"greenbgfont approvebtn\" ng-click=\"EditOrder('#=OrderGUID#')\">Edit</a>#} else {#-#}#", type: "string",
                //    filterable: false,
                //    width: "150px"
                //},

                //{
                //    field: "Cancel",
                //    template: "##<a class=\"greenbgfont approvebtn\">Cancel</a>", type: "string",
                //    filterable: false,
                //    width: "150px"
                //},


                //{ field: "PlateNumberUpdate", title: "Plate Number Update", template: "<a class=\"greenbgfont approvebtn\" ng-if=\"dataItem.CurrentState !== '1104' && dataItem.CurrentState !== '1105'\" ng-click=\"ClickToUpdateStatusAndPlateNumber('#=SalesOrderNumber#',dataItem.PlateNumber,#=CurrentState#)\">  Update </a>", type: "string", filterable: false, width: "150px" },

                {
                    field: "TruckAction",
                    title: $rootScope.resData.res_GridColumn_Action,
                    template: "#if((TruckInDateTime !=null && TruckInDateTime != '') && (TruckOutDateTime == null || TruckOutDateTime == '')) {#<a class=\"greenbgfont approvebtn\" ng-click=\"ShipConfirmation('#=SalesOrderNumber#',#=CurrentState#)\"> Truck Out </a>#} else if((TruckInDateTime == null || TruckInDateTime == '') && CurrentState!=34) {#<a class=\"greenbgfont approvebtn\" ng-click=\"ShipConfirmation('#=SalesOrderNumber#',#=CurrentState#)\">  Truck In</a>#}#", type: "string", filterable: false, width: "150px"
                },

                //{ field: "Save", title: "Save", template: "#if(CurrentState == 3) {#<a class=\"greenbgfont approvebtn\" ng-click=\"UpdatePickingDate('#=SalesOrderNumber#',dataItem.PickingDate)\"> Save </a>#} else {#<a class=\"greenbgfont approvebtn\" ng-click=\"UpdatePickingDate('#=SalesOrderNumber#',dataItem.PickingDate)\">  Update </a>#}#", type: "string", filterable: false, width: "120px" },
            ],

        }


    function selectKendoGridRow() {

        var checked = this.checked,
            row = $(this).closest("tr"),
            grid = $('#grid').data("kendoGrid"),
            dataItem = grid.dataItem(row);

        if (checked) {
            //-select the row
            kendoCheckedIds[dataItem.uid] = checked;
            grid.select(row); // select the item  
            //row.addClass("k-state-selected");
        } else {
            //-remove selection
            delete kendoCheckedIds[dataItem.uid];
            //row.removeClass("k-state-selected");
            grid.clearSelection(row);
        }
    }


    $scope.toggleSelectAll = function (ev) {
        debugger;
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();
        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.OrderId === item.OrderId; });
            if (data.length > 0) {
                data[0].selected = ev.target.checked;
            }
            item.selected = ev.target.checked;

            var element = $(ev.currentTarget);
            var row = element.closest("tr");
            if (item.selected) {
                row.addClass("k-state-selected");
            } else {
                row.removeClass("k-state-selected");
            }
        });
    };

    $scope.onCheckBoxClick = function (e, item) {

        var data = $scope.GridData.data.filter(function (el) { return el.OrderId === item.OrderId; });
        if (data.length > 0) {
            data[0].selected = e.target.checked;
        }
        item.selected = e.target.checked;
        var element = $(e.currentTarget);
        var row = element.closest("tr");
        if (item.selected) {

            row.addClass("k-state-selected");
        } else {
            row.removeClass("k-state-selected");
        }
    }

    $scope.AddAttributeToKendoDatePikcer = function () {

        var elems = angular.element(document.getElementsByClassName("k-picker-wrap"));

        for (var i = 0; i < elems.length; i++) {
            elems[i].setAttribute('data-tap-disabled', true);
        }


    }

    function gridDataBound(e) {
        debugger;
        var grid = $("#grid").data("kendoGrid");

        var grid = e.sender;

        if ($scope.GridColumnList.length > 0) {
            hideGridColumnByConfigurationData(grid, $scope.GridColumnList);
        }




        setTimeout(function () {

            $scope.AddAttributeToKendoDatePikcer();
            $scope.GetScheduleDate();
            $scope.GetPickUpDate();
        }, 500);


        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }

        //debugger;
        //var grid = $("#InquiryDetailsGrid").data("kendoGrid");
        //var data = grid.dataSource.view();
        //for (var i = 0; i < data.length; i++) {

        //    if (data[i].IsSelectedRow == 1) {
        //        var element = $('tr[data-uid="' + data[i].uid + '"] ');
        //        $(element).addClass("change-background");
        //    }

        //    //if (data[i].PraposedTimeOfAction !== data[i].ExpectedTimeOfAction) {
        //    //    var element = $('tr[data-uid="' + data[i].uid + '"] ');
        //    //    $(element).addClass("highlight-background");
        //    //}

        //}
    };


    // View RPM Functionality
    $scope.ViewReturnPakageMaterialListData = [];
    $ionicModal.fromTemplateUrl('templates/ShowRPMQuantity.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.ViewRPMQuantitypopup = modal;
    });
    $scope.ShowRPMItemCollection = function (OrderGUID) {
        debugger;
        var currentOrder = $scope.GridData.data.filter(function (el) { return el.OrderGUID === OrderGUID; });
        if (currentOrder.length > 0) {

            $scope.ViewReturnPakageMaterialListData = currentOrder[0].ReturnPakageMaterialList;
        }
        $scope.ViewRPMQuantitypopup.show();
    }
    $scope.CloseViewRPMQuantitypopup = function () {
        debugger;
        $scope.ViewRPMQuantitypopup.hide();
    }




    $scope.UpdateOrder = function (orderId) {
        debugger;
        var orderDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.OrderId) === parseInt(orderId); });

        var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;

        //var columnName = 'ExpectedTimeOfDelivery';
        var columnNameBranchPlant = 'StockLocationId';
        for (var index = 0; index < gridDataArray.length; index++) {
            //var columnValue = gridDataArray[index][columnName];
            var columnValueBranchPlant = gridDataArray[index][columnNameBranchPlant];
            var enquiryRequestDate = orderDetails.filter(function (el) { return el.OrderId === gridDataArray[index]["OrderId"]; });
            if (enquiryRequestDate.length > 0) {
                //enquiryRequestDate[0].ExpectedTimeOfDelivery = columnValue;
                enquiryRequestDate[0].StockLocationId = columnValueBranchPlant;
            }
        };

        var requestData =
            {
                ServicesAction: 'UpdateOrder',
                OrderDetailList: orderDetails

            };


        // var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
            gridCallBack();
        });


    }

    $scope.GetAllRecordUpdated = function () {
        debugger;
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (enquiryDetails.length > 0) {

            var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;

            //var columnName = 'ExpectedTimeOfDelivery';
            var columnNameBranchPlant = 'StockLocationId';
            for (var index = 0; index < gridDataArray.length; index++) {
                //var columnValue = gridDataArray[index][columnName];
                var columnValueBranchPlant = gridDataArray[index][columnNameBranchPlant];
                var enquiryRequestDate = enquiryDetails.filter(function (el) { return el.OrderId === gridDataArray[index]["OrderId"]; });
                if (enquiryRequestDate.length > 0) {
                    //enquiryRequestDate[0].ExpectedTimeOfDelivery = columnValue;
                    enquiryRequestDate[0].BranchPlant = columnValueBranchPlant;
                }
            };

            var requestData =
                {
                    ServicesAction: 'UpdateOrder',
                    OrderDetailList: enquiryDetails

                };
            // var stringfyjson = JSON.stringify(requestData);
            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                gridCallBack();
            });
        }
        else {
            $rootScope.ValidationErrorAlert('Please select enquiry.', 'error', 3000);
        }
    }

    $scope.getSelectedBranchPlantvalue = function (id, orderId) {

        $scope.UpdateName = "BranchPlant";
        $scope.UpdateOrderId = orderId;
        $scope.UpdateBranchPlantId = id;
        $scope.OpenReasoncodepopup(orderId, "BranchPlant");

    }

    $scope.UpdateBranchPlantCode = function () {

        var orderList = {
            BranchPlantName: $scope.UpdateBranchPlantId,
            OrderId: $scope.UpdateOrderId,
        }

        var requestData =
            {
                ServicesAction: 'UpdateOrderBranchPlant',
                OrderDetailList: orderList

            };


        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            $rootScope.ValidationErrorAlert('Branch Plant updated successfully.', '', 3000);

            gridCallBack();
        });
    }

    $scope.UpdateSchedulingDateOnChange = function (orderId, SchedulingDate) {

        $scope.UpdateName = "SchedulingDate";
        $scope.UpdateOrderId = orderId;
        $scope.UpdateSchedulingDate = SchedulingDate;

        $scope.OpenReasoncodepopup(orderId, "RequestedDate");

    }

    $scope.UpdateSchedulingDateInOrder = function () {

        var orderList = {
            SchedulingDate: $scope.UpdateSchedulingDate,
            OrderId: $scope.UpdateOrderId,
        }

        var requestData =
            {
                ServicesAction: 'UpdateOrderSchedulingDate',
                OrderDetailList: orderList

            };


        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            $rootScope.ValidationErrorAlert('Scheduling date updated successfully.', '', 3000);

            gridCallBack();
        });
    }


    $scope.UpdatePraposedDateInOrderMovement = function () {
        debugger;
        var orderList = $scope.GridData.data.filter(function (el) { return el.OrderId === $scope.UpdateOrderId });
        if (orderList.length > 0) {
            orderList[0].ExpectedTimeOfDelivery = $scope.UpdateSchedulingDate;
        }
        //var orderList = {
        //    SchedulingDate: $scope.UpdateSchedulingDate,
        //    OrderId: $scope.UpdateOrderId,
        //}

        var requestData =
            {
                ServicesAction: 'GetLeadTimeAndUpdateInOrderMovement',
                OrderDetailList: orderList

            };


        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            gridCallBack();
        });
    }

    $scope.LoadOrderView = function (salesOrderNumber, OrderId) {
        debugger;
        if (salesOrderNumber != "-") {
            $rootScope.SalesOrderNumber = salesOrderNumber;
            $rootScope.OrderDetailId = OrderId;
            $state.go("CreateInquiryForSLM");
        }
    }

    $scope.LoadOrderViewOnEnquiryClick = function (salesOrderNumber) {

        if (salesOrderNumber !== "-") {
            $scope.LoadOrderView(salesOrderNumber);
        }
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



    $scope.OpenReasoncodepopup = function (orderId, eventName) {
        $scope.ReasonCodeEventName = eventName;
        $rootScope.ReasonCodeOrderId = orderId;
        $scope.reasoncodepopup.show();
    }

    $scope.ClosReasoncodepopup = function () {

        $rootScope.ReasonCodeOrderId = 0;
        $scope.ReasonCodeJson.ReasonCode = "";
        $scope.ReasonCodeJson.ReasonDescription = "";
        $scope.ReasonCodeEventName = "";
        $scope.reasoncodepopup.hide();
    }


    $scope.ReasonCodeJson = {
        ReasonCode: '',
        ReasonDescription: ''
    }

    $scope.SaveReasonCode = function () {

        if ($scope.ReasonCodeJson.ReasonCode !== "") {
            var reasonCode = {
                ReasonCodeId: $scope.ReasonCodeJson.ReasonCode,
                ReasonDescription: $scope.ReasonCodeJson.ReasonDescription,
                ObjectId: $rootScope.ReasonCodeOrderId,
                ObjectType: 'Order',
                EventName: $scope.ReasonCodeEventName

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
                    $scope.UpdateSchedulingDateInOrder();
                    $scope.UpdatePraposedDateInOrderMovement();
                }
                else if ($scope.UpdateName === "ConfirmedPickDate") {
                    $scope.UpdateConfirmedPickupDate();
                }
                else if ($scope.UpdateName === "PickShift") {
                    $scope.UpdateConfirmedPickupShift();
                }
                else {
                    $scope.EditOrderToUpdateData($scope.CurrentOrderGuid);
                }
                //$scope.UpdateOrder($rootScope.ReasonCodeOrderId);

                $scope.UpdateName = "";
                $scope.ReasonCodeJson.ReasonCode = "";
                $scope.ReasonCodeJson.ReasonDescription = "";
                $scope.ClosReasoncodepopup();
            });

        }
        else {

            $rootScope.ValidationErrorAlert('Please select reason code.', 'error', 3000);
        }

    }


    $scope.PrintPickSlipByOrderId = function (orderId) {





        var orderDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.OrderId) === parseInt(orderId); });


        var requestData =
            {
                ServicesAction: 'PickSlipConfirmation',
                OrderDetailList: orderDetails

            };


        // var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_PrintPickSlip), '', 3000);
            gridCallBack();
        });



    }

    $scope.GetAllRecordToPrintPrintSlip = function () {


        var orderDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (orderDetails.length > 0) {

            var requestData =
                {
                    ServicesAction: 'PickSlipConfirmation',
                    OrderDetailList: orderDetails

                };
            // var stringfyjson = JSON.stringify(requestData);
            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                $rootScope.ValidationErrorAlert('Print Pick Slip request placed successfully.', '', 3000);
                gridCallBack();
            });
        }
        else {
            $rootScope.ValidationErrorAlert('Please select Order.', 'error', 3000);
        }
    }

    $scope.RePrintPickSlipByOrderId = function (orderId, branchPlantCode) {


        var PrinterDetailsData =
            {

                ServicesAction: 'GetLoadPrinterByBranchPlantCode',
                BranchPlantCode: branchPlantCode,
                OrderId: orderId
            }
        var printerjsonobject = {};
        printerjsonobject.Json = PrinterDetailsData;

        GrRequestService.ProcessRequest(printerjsonobject).then(function (response) {

            //Pdf Printing Code
            $rootScope.ValidationErrorAlert('Print Pick Slip request placed successfully.', '', 3000);

        });
    }

    $scope.DownloadDocumentByOrderId = function (orderId) {


        var orderRequestData =
            {

                ServicesAction: 'LoadOrderDocumentByOrderId',
                OrderId: orderId

            }
        var jsonobject = {};
        jsonobject.Json = orderRequestData;
        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {

            var byteCharacters1 = response.data;
            if (response.data != undefined) {


                var byteCharacters = response.data;




                var blob = new Blob([byteCharacters], {
                    type: "application/Pdf"
                });

                if (blob.size > 0) {
                    var filName = "PickSlipReport" + orderId + ".Pdf";
                    saveAs(blob, filName);
                } else {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_DocumentNotGenerated), '', 3000);
                }
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_DocumentNotGenerated), '', 3000);
            }


        });
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


    // OM Order

    $scope.ShowBulkChangePickupDateAndShift = false;

    $scope.OpenChangePickUpCodePopup = function () {

        $scope.ShowBulkChangePickupDateAndShift = true;
    }

    $scope.CloseChangePickUpCodePopup = function () {

        $scope.ShowBulkChangePickupDateAndShift = false;
    }


    $scope.PickupInformation = {
        PickupShift: "",
        PickupDate: ""
    }

    $scope.PickupDateForBulkOrders = function () {

        setTimeout(function () {

            $('.PickupDateControl').each(function () {

                $(this).datepicker({
                    onSelect: function (dateText, inst) {

                        if (inst.id != undefined) {
                            angular.element($('#' + inst.id)).triggerHandler('input');

                        }

                    },
                    dateFormat: 'dd/mm/yy',
                    numberOfMonths: 1,
                    isRTL: $('body').hasClass('rtl') ? true : false,
                    prevText: '<i class="fa fa-angle-left"></i>',
                    nextText: '<i class="fa fa-angle-right"></i>',
                    showButtonPanel: false,


                });
            });
        }, 200);
    }

    $scope.DriverPickupDateForBulkOrders = function () {

        setTimeout(function () {

            $('.DriverPickupDateControl').each(function () {

                $(this).datepicker({
                    onSelect: function (dateText, inst) {

                        if (inst.id != undefined) {
                            angular.element($('#' + inst.id)).triggerHandler('input');

                        }

                    },
                    dateFormat: 'dd/mm/yy',
                    numberOfMonths: 1,
                    isRTL: $('body').hasClass('rtl') ? true : false,
                    prevText: '<i class="fa fa-angle-left"></i>',
                    nextText: '<i class="fa fa-angle-right"></i>',
                    showButtonPanel: false,


                });
            });
        }, 200);
    }


    $scope.UpdatePickUpDateAndShift = function (isBulk) {

        debugger;
        $rootScope.Throbber.Visible = true;
        var orderDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });

        var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;
        var PraposedShift = 'ProposedShift';
        var PraposedTimeOfAction = 'ProposedTimeOfAction';
        for (var index = 0; index < gridDataArray.length; index++) {

            var ExpectedShiftValue = "";
            var PraposedTimeOfActionValue = "";

            if (isBulk === true) {

                ExpectedShiftValue = $scope.PickupInformation.PickupShift;
                PraposedTimeOfActionValue = $scope.PickupInformation.PickupDate;

            } else {

                ExpectedShiftValue = gridDataArray[index][PraposedShift];
                PraposedTimeOfActionValue = gridDataArray[index][PraposedTimeOfAction];
            }

            var ordersData = orderDetails.filter(function (el) { return el.OrderId === gridDataArray[index]["OrderId"]; });
            if (ordersData.length > 0) {

                ordersData[0].PraposedShift = ExpectedShiftValue;
                ordersData[0].PraposedTimeOfAction = PraposedTimeOfActionValue;
                ordersData[0].LocationType = 1;
                ordersData[0].UserId = $rootScope.UserId;
            }

        }

        if (orderDetails.length > 0) {

            var requestData =
                {
                    ServicesAction: 'SavePickupInformationForSelectedOrder',
                    OrderList: orderDetails
                };
            var consolidateApiParamater =
                {
                    Json: requestData,
                };
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                $rootScope.Throbber.Visible = false;

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_PickupInformationUpdated), '', 3000);

                $scope.PickupInformation.PickupShift = "";
                $scope.PickupInformation.PickupDate = "";

                gridCallBack();
            });

        } else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectOrderForUpdatePickUpInformation), 'error', 3000);

        }

    }

    $scope.UpdateBulkPickUpDateAndShift = function () {

        var orderDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (orderDetails.length > 0) {

            $scope.OpenChangePickUpCodePopup();
            $scope.PickupDateForBulkOrders();

        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectOrder), 'error', 3000);
        }

    }

    $scope.ClearTruckIn = function () {
        debugger;
        var orderTruckInDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (orderTruckInDetails.length > 0) {
            if (orderTruckInDetails[0].CurrentState == "1104") {
                var truckInList = {
                    OrderId: orderTruckInDetails[0].OrderId,
                }
                var requestData =
                    {
                        ServicesAction: 'ClearTruckInTime',
                        OrderDetailList: truckInList

                    };

                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };
                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GateKeeperListPage_SavedData), '', 3000);
                    gridCallBack();
                });
            }

        }
        else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectOrder), 'error', 3000);

        }
    }



    $scope.SavePickUpInfoForSelectedEnquiry = function () {

        if ($scope.PickupInformation.PickupShift != "") {
            if ($scope.PickupInformation.PickupDate != "") {
                $scope.UpdatePickUpDateAndShift(true);
                $scope.CloseChangePickUpCodePopup();
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectPickupDateForBulkOrder), 'error', 3000);
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectPickupShiftForBulkOrder), 'error', 3000);
        }
    }


    // Carrier Grid 

    $scope.SelectedDriver = {
        DriverForSelectedOrder: ''
    }


    $scope.UpdateConfirmedPickupDate = function () {
        var enquiryList = {
            PickupDate: $scope.UpdateConfirmedPickDate,
            OrderId: $scope.UpdateOrderId,
        }
        var requestData =
            {
                ServicesAction: 'UpdateConfirmedPickupDate',
                OrderDetailList: enquiryList

            };

        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_PromisedDateUpdated), '', 3000);
            gridCallBack();
        });
    }



    $scope.UpdateConfirmedPickupShift = function () {
        var enquiryList = {
            PickupShift: $scope.UpdatePickShiftId,
            OrderId: $scope.UpdateOrderId,
        }
        var requestData =
            {
                ServicesAction: 'UpdateConfirmedPickupShift',
                OrderDetailList: enquiryList

            };

        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_ConfirmedPickupShift), '', 3000);
            gridCallBack();
        });
    }



    $scope.UpdateCondirmedPickDateOnChange = function (orderId, ConfirmedPickDate) {
        debugger;
        $scope.UpdateName = "ConfirmedPickDate";
        $scope.UpdateOrderId = orderId;
        $scope.UpdateConfirmedPickDate = ConfirmedPickDate;
        var orderDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.OrderId) === parseInt(orderId); });
        $scope.OpenReasoncodepopup(orderDetails, "ConfirmPickDate");

    }

    $scope.getSelectedPickShiftvalue = function (pickShiftId, orderId) {
        debugger;
        $scope.UpdateName = "PickShift";
        $scope.UpdateOrderId = orderId;
        $scope.UpdatePickShiftId = pickShiftId;
        //$scope.OpenReasoncodepopup(orderId, "ConfirmPickShift");
        $scope.UpdateConfirmedPickupShift();

    }

    $scope.ClearPopupControls = function () {
        $scope.SelectedDriver.DriverForSelectedOrder = "";
        $scope.SelectedDriver.PlateNumberForSelectedOrder = "";
        $scope.SelectedDriver.PickShiftForSelectedOrder = "";
        $scope.SelectedDriver.ExpectedTimeOfAction = "";
    }

    $scope.OpenChangeDriverPopup = function () {
        debugger;
        $scope.ShowBulkChangeDriverPickupDateAndShift = true;
        $rootScope.Throbber.Visible = false;
    }
    $scope.ClosChangeDriverPopup = function () {
        debugger;
        $scope.ShowBulkChangeDriverPickupDateAndShift = false;
    }

    $scope.ChangeAllOrderDriver = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (enquiryDetails.length > 0) {
            $rootScope.Throbber.Visible = false;
            $scope.OpenChangeDriverPopup();
            $scope.DriverPickupDateForBulkOrders();
            $scope.ClearPopupControls();
        } else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);

        }
    }

    $scope.SaveDriverForSelectedEnquiry = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        var SelectedOrderId = "";
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (enquiryDetails.length > 0) {
            for (var i = 0; i < enquiryDetails.length; i++) {
                enquiryDetails[i].DriverId = $scope.SelectedDriver.DriverForSelectedOrder;
                enquiryDetails[i].PlateNumber = $scope.SelectedDriver.PlateNumberForSelectedOrder;
                enquiryDetails[i].pickingShift = $scope.SelectedDriver.PickShiftForSelectedOrder;
                enquiryDetails[i].PickingDate = $scope.SelectedDriver.ExpectedTimeOfAction;
            }

            var requestData =
                {
                    ServicesAction: 'UpdateDriverForSelectedOrder',
                    OrderDetailList: enquiryDetails


                };
            var consolidateApiParamater =
                {
                    Json: requestData,
                };
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                $scope.ClosChangeDriverPopup();
                $rootScope.Throbber.Visible = false;

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_RecordSaved), '', 3000);

                gridCallBack();
            });

        }
    }




    $scope.ClickToUpdateStatusAndPlateNumber = function (soNumber, plateNumber, currentState) {
        debugger;
        var IsCheckPlateNumber = true;
        var plateDetails = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === soNumber; });

        var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;
        var columnDataVector = [];
        var columnName = 'PlateNumber'; var ExpectedTimeOfAction = 'ExpectedTimeOfAction';
        var ExpectedShift = 'ExpectedShift';

        var DeliveryPersonnelId = 'DeliveryPersonnelId';

        for (var index = 0; index < gridDataArray.length; index++) {

            var columnValue = gridDataArray[index][columnName];
            var ExpectedTimeOfActionValue = gridDataArray[index][ExpectedTimeOfAction];
            var ExpectedShiftValue = gridDataArray[index][ExpectedShift];

            var DeliveryPersonnelIdValue = gridDataArray[index][DeliveryPersonnelId];


            var plateNumberGrid = plateDetails.filter(function (el) { return el.SalesOrderNumber === gridDataArray[index]["SalesOrderNumber"]; });
            if (plateNumberGrid.length > 0) {
                plateNumberGrid[0].PlateNumber = columnValue;
                plateNumberGrid[0].PickingDate = ExpectedTimeOfActionValue;
                plateNumberGrid[0].pickingShift = ExpectedShiftValue;
                plateNumberGrid[0].DeliveryPersonnelId = DeliveryPersonnelIdValue;
                plateNumberGrid[0].CarrierId = $rootScope.UserId;
                plateNumberGrid[0].LocationType = 1;
                plateNumberGrid[0].UserId = $rootScope.UserId;
                plateNumberGrid[0].PlateNumberBy = "Carrier";

                if (columnValue === "" || columnValue === null) {
                    IsCheckPlateNumber = false;
                }
            }
        };


        if (plateDetails[0].PlateNumber === "" || plateDetails[0].PlateNumber === undefined || plateDetails[0].PlateNumber === null) {
            $rootScope.Throbber.Visible = false;

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_PlateNumberCannotBlank), '', 3000);


        }
        else if (plateDetails[0].DeliveryPersonnelId === "" || plateDetails[0].DeliveryPersonnelId === "0" || plateDetails[0].DeliveryPersonnelId === undefined || plateDetails[0].DeliveryPersonnelId === null) {
            $rootScope.Throbber.Visible = false;
            //$rootScope.ValidationErrorAlert('Plate number cannot be blank.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_PleaseSelectDriver), '', 3000);


        }
        else {

            var requestData =
                {
                    ServicesAction: 'UpdatePickingDate',
                    PlateDetailsList: plateDetails

                };

            var jsonobject = {};
            jsonobject.Json = requestData;

            GrRequestService.ProcessRequest(jsonobject).then(function (response) {

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CarrierPage_RecordSaved), '', 3000);

                gridCallBack();
            });
        }


    }

    // GateKeeper Grid

    $scope.UserImage = {
        UserPhoto: "Images/download.jpg",
        Photo: "Images/download.jpg"
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


    $scope.ShipConfirmation = function (soNumber, currentStatus) {
        debugger;
        var emailId = "";
        var Field1 = "";
        var IsDeliveryPerssonnelcheck = false;
        var IsPlateNumbercheck = false;
        var soNumberLists = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === soNumber; });
        if (soNumberLists.length > 0) {
            emailId = soNumberLists[0].Email;
            Field1 = soNumberLists[0].Field1;
        }
        //if (pickingDate != undefined) {
        var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;
        var columnDataVector = [];
        var columnName = 'TruckRemark';
        if (Field1 == 'SCO') {
            var DeliveryPersonnelId = 'DeliveryPersonName';
        }
        else {
            var DeliveryPersonnelId = 'DeliveryPersonnelId';
        }
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
                if (columnValuecolumnNameRevisedPlateNumber == 0 || columnValuecolumnNameRevisedPlateNumber == null || columnValuecolumnNameRevisedPlateNumber == '') {
                    IsPlateNumbercheck = true;
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
            if (IsPlateNumbercheck == false) {
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
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GateKeeperListPage_EnterPlateNumber), '', 3000);
            }
        }
        else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GateKeeperListPage_SelectDeliveryPersonnel), '', 3000);
        }

    }

    // Warehouse Grid 

    $scope.UpdatePickingDate = function (soNumber, pickingDate, currentState) {

        var wareHouseDetails = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === soNumber; });

        var gridDataArray = $('#OrderDetailsGridId').data('kendoGrid')._data;
        var columnDataVector = [];
        var columnName = 'PickingDate';
        for (var index = 0; index < gridDataArray.length; index++) {
            var columnValue = gridDataArray[index][columnName];
            var plateNumberGrid = wareHouseDetails.filter(function (el) { return el.SalesOrderNumber === gridDataArray[index]["SalesOrderNumber"]; });
            if (plateNumberGrid.length > 0) {
                plateNumberGrid[0].PickingDate = columnValue;
                plateNumberGrid[0].LocationType = 1;
            }
        };
        var requestData =
            {
                ServicesAction: 'InsertPickingDate',
                WareHouseDetailList: wareHouseDetails

            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
            gridCallBack();
        });

    }

    $scope.GetAllRecordUpdate = function () {


        var plateDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (plateDetails.length > 0) {
            var gridDataArray = $('#OrderDetailsGridId').data('kendoGrid')._data;
            var columnDataVector = [];
            var columnName = 'PickingDate';
            for (var index = 0; index < gridDataArray.length; index++) {
                var columnValue = gridDataArray[index][columnName];
                var plateNumberGrid = plateDetails.filter(function (el) { return el.SalesOrderNumber === gridDataArray[index]["SalesOrderNumber"]; });
                if (plateNumberGrid.length > 0) {
                    plateNumberGrid[0].PickingDate = columnValue;
                    plateNumberGrid[0].LocationType = 1;
                }
            };
            var requestData =
                {
                    ServicesAction: 'InsertPickingDate',
                    WareHouseDetailList: plateDetails
                };
            var jsonobject = {};
            jsonobject.Json = requestData;

            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                gridCallBack();
            });

        }
        else {
            $rootScope.ValidationErrorAlert('Please select sonumber.', 'error', 3000);
        }
    }


    $scope.ExportToExcel = function () {
        debugger;

        $scope.RequestDataFilter.ServicesAction = 'ExportToExcelGrid';
        $scope.RequestDataFilter.ColumnList = $scope.GridColumnList;

        var jsonobject = {};
        jsonobject.Json = $scope.RequestDataFilter;
        jsonobject.Json.IsExportToExcel = true;

        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
            debugger;
            var byteCharacters1 = response.data;
            if (response.data !== undefined) {
                var byteCharacters = response.data;
                var blob = new Blob([byteCharacters], {
                    type: "application/Pdf"
                });
                debugger;
                if (blob.size > 0) {
                    var filName = "OrderDetail" + getDate() + ".xlsx";
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


    $scope.onSelection = function (kendoEvent) {

        var grid = kendoEvent.sender;

        var selectedData = grid.dataItem(grid.select());

        var items = $('#InquiryDetailsGrid').data('kendoGrid')._data;

        var data = $scope.GridData.data.filter(function (el) { return el.OrderId === selectedData.OrderId; });

        var item = items.filter(function (el) { return el.OrderId === selectedData.OrderId; });

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

    $scope.NoteVariable = {
        NoteText: '',
        CustomerServiceNoteText: ''
    }
    $scope.AddNotesModalPopup = function () {
        $scope.NotesModalPopupControl = false;
    }
    $scope.AddNotesModalPopup();
    $scope.OpenAddNotesModalPopup = function () {
        debugger;
        $scope.NotesModalPopupControl = true;
    }
    $scope.CloseAddNotesModalPopup = function () {
        debugger;
        $scope.NotesModalPopupControl = false;
    }

    $scope.NotesOrderId = 0;
    $scope.OpenModelPoppupNote = function (orderId) {
        debugger;
        $scope.NotesOrderId = orderId;
        var requestData =
            {
                ServicesAction: 'GetNoteByObjectId',
                ObjectId: orderId,
                RoleId: $rootScope.RoleId,
                ObjectType: 1221,
                UserId: $rootScope.UserId

            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (NotesResponse) {
            debugger;
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
        debugger;

        var Notes = [];
        if ($scope.NoteVariable.CustomerServiceNoteText !== "") {
            var noteText = $scope.NoteVariable.NoteText + " " + $scope.NoteVariable.CustomerServiceNoteText;
            var noteJson = {
                RoleId: $rootScope.RoleId,
                ObjectId: $scope.NotesOrderId,
                ObjectType: 1221,
                Note: noteText,
                CreatedBy: $rootScope.UserId
            }

            Notes.push(noteJson);

            if (Notes.length > 0) {
                debugger;
                var Note =
                    {
                        ServicesAction: "SaveNotes",
                        NoteList: Notes
                    }

                var jsonobject = {};
                jsonobject.Json = Note;

                debugger;

                GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    $scope.NoteVariable.CustomerServiceNoteText = "";
                    $scope.CloseAddNotesModalPopup();
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryPage_NotesUpdated), 'error', 3000);
                    $scope.NotesOrderId = 0;

                });
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_NoteEnterValidation), 'error', 3000);
        }

    }


    $scope.EditOrder = false;
    $scope.EditOrder = function (OrderGUID) {
        debugger;




        $rootScope.orderGuId = OrderGUID;
        var currentOrder = $scope.GridData.data.filter(function (el) { return el.OrderGUID === OrderGUID; });
        if (currentOrder.length > 0) {

            if (currentOrder[0].SalesOrderNumber != undefined && currentOrder[0].SalesOrderNumber != 0 && $rootScope.RoleName === "CustomerService") {
                $rootScope.OrderDetailId = currentOrder[0].OrderId;
                $rootScope.EditedOrderId = currentOrder[0].OrderId;
                $scope.LoadData();
                $scope.ActionButton = "Edit";
                $scope.OpenReasoncodepopup($scope.OrderData, "EditOrder");
            }
            else {
                $rootScope.EditedEnquiryId = 0;
                $scope.EditOrderToUpdateData(currentOrder, OrderGUID);
            }
        }
    }


    $scope.EditOrderToUpdateData = function (OrderGUID) {
        debugger;
        if ($rootScope.RoleName === "CustomerService") {
            $rootScope.IsOrderEditedByCustomerService = true;

            var currentOrder = $rootScope.TemOrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
            if (currentOrder.length > 0) {
                $rootScope.TempCompanyId = currentOrder[0].CustomerId;
                $rootScope.TempCompanyId = currentOrder[0].CustomerId;
                $rootScope.BranchPlantCodeEdit = currentOrder[0].BranchPlantCode;
            }
        } else {
            $rootScope.IsOrderEditedByCustomerService = false;
        }



        if ($rootScope.TemOrderData[0].OrderId != undefined && $rootScope.TemOrderData[0].OrderId != 0 && $rootScope.TemOrderData[0].OrderId != "0") {
            $rootScope.SavedEditOrder = true;
        } else {
            $rootScope.SavedEditOrder = false;
        }


        $rootScope.EditOrder = true;
        var currentOrder = $rootScope.TemOrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
        if (currentOrder.length > 0) {
            $rootScope.OrderCompanyId = currentOrder[0].CompanyId;

        }
        $rootScope.CurrentsalesOrderNumber = $rootScope.SalesOrderNumber;
        $rootScope.CurrentOrderGuid = OrderGUID;
        $rootScope.UpdateOrderData = $rootScope.TemOrderData;
        $state.go("UpdateOrder");
    }


    $scope.LoadData = function () {
        debugger;
        if ($rootScope.OrderDetailId !== undefined && $rootScope.OrderDetailId !== null && $rootScope.OrderDetailId !== 0) {
            debugger;

            var totalorderamount = 0;
            var TotalDepositeAmount = 0;
            $scope.PromotionItemList = [];
            $rootScope.Throbber.Visible = true;
            $scope.ShowBackButton = false;
            $scope.OrderData = [];
            var requestData =
                {
                    ServicesAction: 'LoadOrderByOrderId',
                    OrderId: $rootScope.OrderDetailId,
                    RoleId: $rootScope.RoleId,
                    CultureId: $rootScope.CultureId

                };
            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                debugger;
                var orderDetails = response.data.Json.OrderList;
                debugger;

                var currentStateInEditOrder = $scope.LoadSettingInfoByName('OrderEditTillStatus', 'string');
                if (currentStateInEditOrder !== "") {
                    var tempstate = currentStateInEditOrder.split(',');
                    if (tempstate !== null && tempstate !== undefined) {
                        debugger;
                        $scope.IsEditOrderConfiguration = false;
                        for (var i = 0; i < tempstate.length; i++) {
                            if (orderDetails.CurrentState == tempstate[i]) {
                                $scope.IsEditOrderConfiguration = true;
                            }
                        }
                    }
                }

                $scope.CurrentOrderGuid = generateGUID();
                $rootScope.TempCompanyId = orderDetails.CompanyID;
                $rootScope.TempCompanyMnemonic = orderDetails.CompanyMnemonic;
                $rootScope.TempCompanyType = orderDetails.CompanyType;
                debugger;


                //$rootScope.EditSelfCollectValue = orderDetails.IsSelfCollectEnquiry;


                if ($rootScope.OrderDetailId > 0) {
                    $scope.LoadCustomerCreditLimit(orderDetails.CompanyID, orderDetails.CompanyMnemonic);
                }

                debugger;
                var resoponsedata = response.data;
                $scope.bindAllBranchPlant = $rootScope.bindAllBranchPlant;
                $rootScope.LoadedAllBranchPlant = $scope.bindAllBranchPlant;


                var requestData =
                    {
                        ServicesAction: 'GetNoteByObjectId',
                        ObjectId: orderDetails.OrderId,
                        RoleId: $rootScope.RoleId,
                        ObjectType: 1221,
                        UserId: $rootScope.UserId

                    };
                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (NotesResponse) {

                    var NotesResponsedata = NotesResponse.data;
                    // var bindAllCarrier = "bindAllCarrier" + enquiryId;
                    if (NotesResponsedata.Json !== undefined) {
                        var notesData = NotesResponsedata.Json.NotesList;

                        if (notesData.length > 0) {
                            $scope.SaveNoteText = notesData[0].Note;
                            $scope.NoteId = notesData[0].NotesId;
                        } else {
                            $scope.SaveNoteText = "";
                            $scope.NoteId = 0;
                        }

                    }
                    else {
                        $scope.SaveNoteText = "";
                        $scope.NoteId = 0;
                    }


                    var requestData =
                        {
                            ServicesAction: 'LoadAllCarrierByBranchPlant',
                            branchPlantId: orderDetails.StockLocationId,
                            ShipTo: orderDetails.ShipTo,
                            TruckSizeId: orderDetails.TruckSizeId
                        };

                    // var stringfyjson = JSON.stringify(requestData);
                    var jsonobject = {};
                    jsonobject.Json = requestData;
                    GrRequestService.ProcessRequest(jsonobject).then(function (response) {

                        debugger;
                        var resoponsedata = response.data;
                        // var bindAllCarrier = "bindAllCarrier" + enquiryId;
                        if (resoponsedata.Json !== undefined) {
                            $scope.bindAllCarrierList = resoponsedata.Json.CarrierList;
                        }
                        else {
                            $scope.bindAllCarrierList = [];
                        }


                        var carrierId = '';
                        var carrierCode = '';
                        if ($scope.bindAllCarrierList.length == 1) {
                            carrierId = $scope.bindAllCarrierList[0].CompanyId;
                            carrierCode = $scope.bindAllCarrierList[0].CompanyMnemonic;
                        }


                        $scope.Location.StockLocationId = orderDetails.StockLocationId;
                        var orders = {
                            OrderGUID: $scope.CurrentOrderGuid,
                            TruckName: orderDetails.TruckSize,
                            DeliveryLocation: orderDetails.ShipTo,
                            TruckSize: orderDetails.TruckSizeId,
                            ProposedETDStr: '',
                            OrderId: orderDetails.OrderId,
                            RequestDate: orderDetails.ExpectedTimeOfDelivery,
                            OrderRequestDate: orderDetails.ExpectedTimeOfDelivery,
                            OrderProposedETD: orderDetails.OrderProposedETD,
                            GratisCode: orderDetails.GratisCode,
                            TotalWeight: 0,
                            TruckCapacity: orderDetails.TruckCapacityWeight,
                            TruckPallets: 0,
                            TotalProductPallets: 0,
                            NumberOfPalettes: orderDetails.NumberOfPalettes,
                            PalletSpace: orderDetails.PalletSpace,
                            TruckWeight: orderDetails.TruckWeight,
                            TruckCapacityPalettes: orderDetails.TruckCapacityPalettes,
                            TruckCapacityWeight: orderDetails.TruckCapacityWeight,
                            Capacity: orderDetails.Capacity,
                            Status: orderDetails.Status,
                            Class: orderDetails.Class,
                            IsTruckFull: true,
                            TruckSizeId: orderDetails.TruckSizeId,
                            ShipTo: orderDetails.ShipTo,
                            SoldTo: orderDetails.SoldTo,
                            CustomerId: orderDetails.CompanyID,
                            CompanyId: orderDetails.CompanyID,
                            CurrentState: orderDetails.CurrentState,
                            SalesOrderNumber: orderDetails.SalesOrderNumber,
                            branchPlant: orderDetails.StockLocationId,
                            IsRecievingLocationCapacityExceed: orderDetails.IsRecievingLocationCapacityExceed,
                            IsActive: true,
                            Field1: orderDetails.Field1,
                            Field2: orderDetails.Field2,
                            Field3: orderDetails.Field3,
                            Field4: orderDetails.Field4,
                            Field5: orderDetails.Field5,
                            Field6: orderDetails.Field6,
                            Field7: orderDetails.Field7,
                            Field8: orderDetails.Field8,
                            Field9: orderDetails.Field9,
                            Field10: orderDetails.Field10,
                            carrier: carrierId,
                            CarrierCode: carrierCode,
                            DeliveryLocationName: orderDetails.DeliveryLocationName,
                            EnquiryProductList: orderDetails.OrderProductsList,
                            OrderProductsList: orderDetails.OrderProductsList,
                            ShipToCode: orderDetails.ShipToCode,
                            SoldToCode: orderDetails.SoldToCode,
                            BranchPlantCode: orderDetails.BranchPlantCode,
                            DepositeAmount: orderDetails.DepositeAmount,
                            DepositeAmountPerUnit: orderDetails.DepositeAmountPerUnit,
                            ItemTotalDepositeAmount: orderDetails.ItemTotalDepositeAmount,
                            ReturnPakageMaterialList: orderDetails.ReturnPakageMaterialList,
                            OrderDate: orderDetails.OrderDate,
                            OrderNumber: orderDetails.OrderNumber,
                            DeliveryLocationCode: orderDetails.ShipToCode,
                            CompanyMnemonic: orderDetails.SoldToCode,
                            IsSelfCollectEnquiry: orderDetails.IsSelfCollectEnquiry
                        }
                        debugger;


                        orders.OrderTime = orders.OrderDate.split('T')[1].split(':')[0];
                        orders.OrderDate = orders.OrderDate.split('T')[0];


                        //$scope.OldData.StockLocationId = orderDetails.branchPlant;
                        //$scope.OldData.RequestedDate = orderDetails.OrderRequestDate;

                        var OutOfStockItem = [];
                        for (var i = 0; i < orders.OrderProductsList.length; i++) {

                            orders.OrderProductsList[i].OrderProductGUID = generateGUID();
                            orders.OrderProductsList[i].OrderGUID = $scope.CurrentOrderGuid;
                            orders.OrderProductsList[i].GratisOrderId = parseInt(orders.OrderProductsList[i].GratisOrderId);
                            totalorderamount += parseFloat(orders.OrderProductsList[i].ItemPricesPerUnit) * parseFloat(orders.OrderProductsList[i].ProductQuantity);
                            TotalDepositeAmount += parseFloat(orders.OrderProductsList[i].DepositeAmount);
                            //var availableProductStock = orders.OrderProductList[i].CurrentStockPosition;
                            //var totalUsedQuantity = parseFloat(parseFloat(orders.OrderProductList[i].UsedQuantityInEnquiry) + parseFloat(orders.OrderProductList[i].UsedQuantityInOrder));
                            //var remainingProductStock = parseFloat(parseFloat(availableProductStock) - parseFloat(totalUsedQuantity));
                            //if (parseFloat(orders.OrderProductList[i].ProductQuantity) < remainingProductStock) {
                            //    orders.OrderProductList[i].IsItemAvailableInStock = true;
                            //} else {
                            //    orders.OrderProductList[i].IsItemAvailableInStock = false;
                            //}

                            //if (orders.OrderProductList[i].IsItemAvailableInStock === false) {
                            //    OutOfStockItem.push(orders.OrderProductList[i].EnquiryProductId);
                            //}
                            //$rootScope.OutofStockItemsList = OutOfStockItem;
                        }

                        totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);
                        var totalamount = parseFloat(totalorderamount) + parseFloat(totaltaxamount) + parseFloat(TotalDepositeAmount);
                        $rootScope.AvailableCreditLimit = $rootScope.AvailableCreditLimit;


                        debugger;
                        // Change Enquiry Date, Praposed Date And Requested Date For Draft Enquiry Only.
                        if (orders.CurrentState === '8') {

                            debugger;

                            var requestData =
                                {
                                    ServicesAction: 'GetProposedDeliveryDate',
                                    LocationId: enquiryDetails.ShipTo,
                                    DeliveryLocationCode: enquiryDetails.StockLocationId,
                                    CompanyId: enquiryDetails.CompanyID,
                                    CompanyMnemonic: enquiryDetails.SoldToCode,
                                    RuleType: 1
                                };


                            var jsonobject = {};
                            jsonobject.Json = requestData;
                            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                                debugger;
                                var responseStr = response.data.Json;

                                debugger;
                                if (responseStr.ProposedDate === '' || responseStr.ProposedDate === undefined) {

                                    var getDefaultSettingValue = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ProposedDeliveryDate'; });
                                    if (getDefaultSettingValue.length > 0) {

                                        var numberOfDaysToAdd = parseInt(getDefaultSettingValue[0].SettingValue);

                                        var someDate = new Date();
                                        someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                                        var dd = someDate.getDate();
                                        var mm = someDate.getMonth() + 1;
                                        var y = someDate.getFullYear();
                                        var someFormattedDate = dd + '/' + mm + '/' + y;
                                        $scope.ChangeProposedDate = someFormattedDate;
                                    }
                                    else {
                                        $scope.ChangeProposedDate = 'N/A'
                                    }
                                }
                                else {
                                    $scope.ChangeProposedDate = responseStr.ProposedDate;
                                }



                                orders.RequestDate = $scope.ChangeProposedDate;
                                orders.OrderProposedETD = $scope.ChangeProposedDate;

                                debugger;
                                var requestDataforupdateEnquiry =
                                    {
                                        ServicesAction: 'UpdateEnquiryProposedAndRequestedDate',
                                        EnquiryId: $rootScope.EnquiryDetailId,
                                        RequestDate: $scope.ChangeProposedDate,
                                        OrderProposedETD: $scope.ChangeProposedDate,
                                    };
                                var consolidateApiParamaterUpdateEnquiry =
                                    {
                                        Json: requestDataforupdateEnquiry,
                                    };

                                GrRequestService.ProcessRequest(consolidateApiParamaterUpdateEnquiry).then(function (responseUpdateEnquiry) {

                                    debugger;

                                });


                                $scope.OrderData.push(orders);
                                $rootScope.TemOrderData = $scope.OrderData;

                                debugger;
                                $rootScope.Throbber.Visible = false;
                                $scope.GetReceivingLocationBalanceCapacity($scope.OrderData[0].ShipTo, $scope.OrderData[0].OrderProposedETD, $scope.OrderData[0].CustomerId, orderDetails.Capacity, orderDetails.OrderId);


                            });




                        }
                        else {

                            $scope.OrderData.push(orders);
                            $rootScope.TemOrderData = $scope.OrderData;

                            debugger;
                            $rootScope.Throbber.Visible = false;
                            $scope.GetReceivingLocationBalanceCapacity($scope.OrderData[0].ShipTo, $scope.OrderData[0].OrderProposedETD, $scope.OrderData[0].CustomerId, orderDetails.Capacity, orderDetails.OrderId);

                        }


                    });





                });





            });
        } else {
            debugger;

            $scope.ActualEmptiesValidation();
            $rootScope.Throbber.Visible = false;
            $scope.GetReceivingLocationBalanceCapacity($rootScope.TemOrderData[0].ShipTo, $rootScope.TemOrderData[0].OrderProposedETD, $rootScope.TemOrderData[0].CustomerId, $rootScope.TemOrderData[0].Capacity, $rootScope.TemOrderData[0].OrderId);
            if ($rootScope.LoadedAllBranchPlant !== undefined) {
                $scope.bindAllBranchPlant = $rootScope.LoadedAllBranchPlant;
            }

            var currentStateInEditOrder = $scope.LoadSettingInfoByName('OrderEditTillStatus', 'string');
            if (currentStateInEditOrder !== "") {
                var tempstate = currentStateInEditOrder.split(',');
                if (tempstate !== null && tempstate !== undefined) {
                    debugger;
                    $scope.IsEditOrderConfiguration = false;
                    for (var i = 0; i < tempstate.length; i++) {
                        if ($rootScope.TemOrderData[0].CurrentState == tempstate[i]) {
                            $scope.IsEditOrderConfiguration = true;
                        }
                    }
                }
            }
        }

    }




});