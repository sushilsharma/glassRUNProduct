angular.module("glassRUNProduct").controller('ViewInquiryController', function ($scope, $rootScope, $location, $sessionStorage, $ionicModal, $state, pluginsService, GrRequestService) {
    
    // 0 Load Active Session Variable If Session Of Application Is InActive Then Funcation Automatically Redirect On Login Page.
    $scope.ReasonCodeEventName = "";
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $rootScope.IsDisabledSubmit = false;
    $scope.bindAllSettingMaster = $sessionStorage.AllSettingMasterData;


    // 1 Load Throbber to wait for response.
    $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        };
    }
    $scope.LoadThrobberForPage();

    $rootScope.GridRecallForStatus = function () {
        
        $rootScope.Throbber.Visible = false;
    }

    // 2 Load Global Variable Of Page.
    $scope.LoadPageCommonVariable = function () {
        
        $rootScope.SavedEditEnquiry = false;
        $scope.OrderData = [];
        $rootScope.totalorderamount = 0;
        $rootScope.ReasonCodeEnquiryList = [];
        $scope.ActionButton = "";
        $scope.WoodenPalletCode = '0';
        $scope.EmptiesLimitMessage = '';
        $scope.EmptiesCss = true;
        $scope.EmptiesAmount = 0;
        $scope.ItemTaxInPec = 0;
        $scope.OldData = {
            StockLocationId: 0,
            RequestedDate: ''
        }
        $scope.Location = {
            StockLocationId: 0
        }

        $scope.ShowBackButton = true;
        $scope.Page = {
            EnquiryCheckData: false,
            EnquiryBranchPlant: false,
            EnquirySchedulingDateControl: false,
            EnquirySchedulingDateView: false,
            EnquiryLoadNumber: false,
            Enquirybtn: false,
            EnquiryApprovebtn: false,
            BranchPlant: false,
            CustomerBackButton: false

        }
        
        if ($rootScope.RoleName === "CustomerService") {
            $scope.Page.EnquiryCheckData = true;
            $scope.Page.EnquiryBranchPlant = true;
            $scope.Page.EnquirySchedulingDateControl = true;
            $scope.Page.EnquiryCheckData = true;
            $scope.Page.EnquiryApprovebtn = true;
            $scope.Page.BranchPlant = true;
            $scope.Page.CustomerBackButton = false;

        } else {
            $scope.Page.EnquirySchedulingDateView = true;
            $scope.Page.Enquirybtn = true;
            $scope.Page.CustomerBackButton = true;
        }
    }
    $scope.LoadPageCommonVariable();

    // 3 Load Setting Master Information By Setting Name.
    $scope.LoadSettingInfoByName = function (settingName, returnValueDataType) {
        
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
    $scope.LoadDefaultSettingsValue = function () {
        
        $scope.ItemTaxInPec = $scope.LoadSettingInfoByName('ItemTaxInPec', 'float');
        if ($scope.ItemTaxInPec === "") {
            $scope.ItemTaxInPec = 0;
        }

        $scope.EmptiesAmount = $scope.LoadSettingInfoByName('EmptiesAmount', 'float');
        if ($scope.EmptiesAmount === "") {
            $scope.EmptiesAmount = 0;
        }

        $scope.WoodenPalletCode = $scope.LoadSettingInfoByName('WoodenPalletCode', 'string');

    }
    $scope.LoadDefaultSettingsValue();

    $scope.GetScheduleDate = function (startDate, endDate) {
        
        $('.customdate-picker').each(function () {
            
            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    
                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                        $scope.UpdateSchedulingDateOnChange(0, dateText);
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
    $scope.RemoveWoodenPalletItem = function (item) {
        return item.ProductCode !== $scope.WoodenPalletCode;
    };
    $scope.CalculateTotalAmountOfProductWithTaxAndDeposite = function () {
        
        var totalorderamount = 0;
        var totalDepositeamount = 0;
        var totaltaxamount = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            for (var j = 0; j < $scope.OrderData[i].OrderProductList.length; j++) {
                if (parseInt($scope.OrderData[i].OrderProductList[j].EnquiryProductId) === 0) {
                    totalorderamount += parseFloat($scope.OrderData[i].OrderProductList[j].ItemPricesPerUnit) * parseFloat($scope.OrderData[i].OrderProductList[j].ProductQuantity);
                    totalDepositeamount += parseFloat($scope.OrderData[i].OrderProductList[j].DepositeAmountPerUnit) * parseFloat($scope.OrderData[i].OrderProductList[j].ProductQuantity);
                }
                else {

                    if (parseInt($scope.OrderData[i].OrderProductList[j].EnquiryProductId) !== 0 && ($scope.OrderData[i].OrderProductList[j].IsActive === true || $scope.OrderData[i].OrderProductList[j].IsActive === 1 || $scope.OrderData[i].OrderProductList[j].IsActive === "1")) {
                        totalorderamount += parseFloat($scope.OrderData[i].OrderProductList[j].ItemPricesPerUnit) * parseFloat($scope.OrderData[i].OrderProductList[j].ProductQuantity);
                        totalDepositeamount += parseFloat($scope.OrderData[i].OrderProductList[j].DepositeAmountPerUnit) * parseFloat($scope.OrderData[i].OrderProductList[j].ProductQuantity);
                    }
                }

            }
        }
        totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);
        $rootScope.totalorderamount = parseFloat(totalorderamount) + parseFloat(totaltaxamount) + parseFloat(totalDepositeamount);
    }
    $scope.ConvertDateFormat = function (date) {
        

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
    $scope.LoadEnquiryData = function () {
        
        if ($rootScope.TemOrderData !== undefined) {
            if ($rootScope.TemOrderData.length > 0) {

                $scope.OrderData = $rootScope.TemOrderData.filter(function (el) { return el.OrderProductList.length > 0 && el.IsTruckFull == true; });
                if ($scope.OrderData.length > 0) {

                    if ($scope.OrderData[0].OrderProposedETD !== "" && $scope.OrderData[0].OrderProposedETD !== undefined) {
                        $scope.SchedulingDateValue = $scope.ConvertDateFormat($scope.OrderData[0].OrderProposedETD);
                        $scope.GetScheduleDate("", $scope.SchedulingDateValue);
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
    $scope.GetReceivingLocationBalanceCapacity = function (deliverylocationId, proposedDeliveryDate, TempCompanyId, deliverylocationCapacity, EnquiryId) {
        
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
            
            var resoponsedata = response.data.Json.BalanceCapacity;
            $scope.DeliveryUsedCapacity = resoponsedata;
            $scope.DeliveryLocationCapacity = deliverylocationCapacity;
            $scope.LoadEnquiryData();

        });
    }
    $scope.calcTotalTax = function (OrderGuid) {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGuid; });
        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            total += parseFloat(currentOrder[0].OrderProductList[i].ItemPrices);
        }
        total = percentage(total, $scope.ItemTaxInPec);
        return total;
    }
    $scope.calcTotalDepositeAmount = function (OrderGuid) {

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGuid; });
        var total = 0;

        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            total += parseFloat(currentOrder[0].OrderProductList[i].ItemTotalDepositeAmount);
        }

        return total;
    }
    $scope.calcTotalAmount = function (OrderGuid) {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGuid; });
        var total = 0;

        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            total += parseFloat(currentOrder[0].OrderProductList[i].ItemPrices);
        }

        return total;
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
    $scope.CalculateDeliveryUsedCapacity = function () {
        
        var tempNumberOfPalettes = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            tempNumberOfPalettes += $scope.OrderData[i].NumberOfPalettes;
        }
        $scope.tempDeliveryUsedCapacity = tempNumberOfPalettes;
    }
    $scope.LoadNumberOfExtraPalat = function (UOM) {

        var NumberOfExtraPalettes = 0;

        var requestData =
            {
                ServicesAction: 'GetRuleValue',
                CompanyId: $scope.TempCompanyId,
                CompanyMnemonic: $scope.TempCompanyMnemonic,
                Company: {
                    CompanyId: $scope.TempCompanyId,
                    CompanyMnemonic: $scope.TempCompanyMnemonic,
                },
                RuleType: 3,
                Item: {
                    UOM: UOM
                }
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var responseStr = response.data.Json;

            if (responseStr.RuleValue != '' || responseStr.RuleValue != undefined) {
                NumberOfExtraPalettes = parseInt(responseStr.RuleValue);
                if (NumberOfExtraPalettes > 0) {
                    NumberOfExtraPalettes = NumberOfExtraPalettes;
                }
            }
        });

        return NumberOfExtraPalettes;
    }

    $scope.bindAllCarrierList = [];

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
            // var bindAllCarrier = "bindAllCarrier" + enquiryId;

            if (resoponsedata.Json !== undefined) {
                $scope.bindAllCarrierList = resoponsedata.Json.CarrierList;
            }
            else {
                $scope.bindAllCarrierList = [];
            }
        });
    }

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

    $scope.SaveNoteText = "";
    $scope.NoteId = 0;
    $scope.LoadData = function () {
        
        if ($rootScope.EnquiryDetailId !== undefined && $rootScope.EnquiryDetailId !== null && $rootScope.EnquiryDetailId !== 0) {
            

            var totalorderamount = 0;
            var TotalDepositeAmount = 0;
            $scope.PromotionItemList = [];
            $rootScope.Throbber.Visible = true;
            $scope.ShowBackButton = false;
            $scope.OrderData = [];
            var requestData =
                {
                    ServicesAction: 'LoadEnquiryByEnquiryId',
                    EnquiryId: $rootScope.EnquiryDetailId,
                    RoleId: $rootScope.RoleId,
                    CultureId: $rootScope.CultureId

                };
            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                var enquiryDetails = response.data.Json.EnquiryList;

                $scope.CurrentOrderGuid = generateGUID();
                $rootScope.TempCompanyId = enquiryDetails.CompanyID;
                $rootScope.TempCompanyMnemonic = enquiryDetails.CompanyMnemonic;
                $rootScope.TempCompanyType = enquiryDetails.CompanyType;
                


                $rootScope.EditSelfCollectValue = enquiryDetails.IsSelfCollectEnquiry;


                if ($rootScope.EnquiryDetailId > 0) {
                    $scope.LoadCustomerCreditLimit(enquiryDetails.CompanyID, enquiryDetails.CompanyMnemonic);
                }

                
                var resoponsedata = response.data;
                $scope.bindAllBranchPlant = $rootScope.bindAllBranchPlant;
                $rootScope.LoadedAllBranchPlant = $scope.bindAllBranchPlant;


                var requestData =
                    {
                        ServicesAction: 'GetNoteByObjectId',
                        ObjectId: $rootScope.EnquiryDetailId,
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
                            branchPlantId: enquiryDetails.StockLocationId,
                            ShipTo: enquiryDetails.ShipTo,
                            TruckSizeId: enquiryDetails.TruckSizeId
                        };

                    // var stringfyjson = JSON.stringify(requestData);
                    var jsonobject = {};
                    jsonobject.Json = requestData;
                    GrRequestService.ProcessRequest(jsonobject).then(function (response) {

                        
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


                        $scope.Location.StockLocationId = enquiryDetails.StockLocationId;
                        var orders = {
                            OrderGUID: $scope.CurrentOrderGuid,
                            TruckName: enquiryDetails.TruckSize,
                            DeliveryLocation: enquiryDetails.ShipTo,
                            TruckSize: enquiryDetails.TruckSizeId,
                            ProposedETDStr: '',
                            EnquiryId: enquiryDetails.EnquiryId,
                            RequestDate: enquiryDetails.RequestDate,
                            OrderRequestDate: enquiryDetails.RequestDate,
                            OrderProposedETD: enquiryDetails.OrderProposedETD,
                            TotalWeight: 0,
                            TruckCapacity: enquiryDetails.TruckCapacityWeight,
                            TruckPallets: 0,
                            TotalProductPallets: 0,
                            NumberOfPalettes: enquiryDetails.NumberOfPalettes,
                            PalletSpace: enquiryDetails.PalletSpace,
                            TruckWeight: enquiryDetails.TruckWeight,
                            TruckCapacityPalettes: enquiryDetails.TruckCapacityPalettes,
                            TruckCapacityWeight: enquiryDetails.TruckCapacityWeight,
                            Capacity: enquiryDetails.Capacity,
                            Status: enquiryDetails.Status,
                            Class: enquiryDetails.Class,
                            IsTruckFull: true,
                            TruckSizeId: enquiryDetails.TruckSizeId,
                            ShipTo: enquiryDetails.ShipTo,
                            SoldTo: enquiryDetails.SoldTo,
                            CustomerId: enquiryDetails.CompanyID,
                            CurrentState: enquiryDetails.CurrentState,
                            EnquiryNumber: enquiryDetails.EnquiryAutoNumber,
                            branchPlant: enquiryDetails.StockLocationId,
                            IsRecievingLocationCapacityExceed: enquiryDetails.IsRecievingLocationCapacityExceed,
                            ReceivedCapacityPalettesCheck: enquiryDetails.ReceivedCapacityPalettesCheck,
                            ReceivedCapacityPalettes: enquiryDetails.ReceivedCapacityPalettes,
                            TruckCapacity: enquiryDetails.TruckCapacity,
                            IsActive: true,
                            Field1: enquiryDetails.Field1,
                            Field2: enquiryDetails.Field2,
                            Field3: enquiryDetails.Field3,
                            Field4: enquiryDetails.Field4,
                            Field5: enquiryDetails.Field5,
                            Field6: enquiryDetails.Field6,
                            Field7: enquiryDetails.Field7,
                            Field8: enquiryDetails.Field8,
                            Field9: enquiryDetails.Field9,
                            Field10: enquiryDetails.Field10,
                            carrier: carrierId,
                            CarrierCode: carrierCode,
                            DeliveryLocationName: enquiryDetails.DeliveryLocationName,
                            EnquiryProductList: enquiryDetails.EnquiryProductList,
                            OrderProductList: enquiryDetails.EnquiryProductList,
                            ShipToCode: enquiryDetails.ShipToCode,
                            SoldToCode: enquiryDetails.SoldToCode,
                            BranchPlantCode: enquiryDetails.BranchPlantCode,
                            DepositeAmount: enquiryDetails.DepositeAmount,
                            DepositeAmountPerUnit: enquiryDetails.DepositeAmountPerUnit,
                            ItemTotalDepositeAmount: enquiryDetails.ItemTotalDepositeAmount,
                            ReturnPakageMaterialList: enquiryDetails.ReturnPakageMaterialList,
                            EnquiryDate: enquiryDetails.EnquiryDate,
                            EnquiryAutoNumber: enquiryDetails.EnquiryAutoNumber,
                            DeliveryLocationCode: enquiryDetails.ShipToCode,
                            CompanyMnemonic: enquiryDetails.SoldToCode,
                            IsSelfCollectEnquiry: enquiryDetails.IsSelfCollectEnquiry
                        }
                        


                        orders.OrderTime = orders.EnquiryDate.split('T')[1].split(':')[0];
                        orders.OrderDate = orders.EnquiryDate.split('T')[0];


                        $scope.OldData.StockLocationId = enquiryDetails.branchPlant;
                        $scope.OldData.RequestedDate = enquiryDetails.OrderRequestDate;

                        var OutOfStockItem = [];
                        for (var i = 0; i < orders.OrderProductList.length; i++) {

                            orders.OrderProductList[i].EnquiryProductGUID = generateGUID();
                            orders.OrderProductList[i].OrderGUID = $scope.CurrentOrderGuid;
                            orders.OrderProductList[i].GratisOrderId = parseInt(orders.OrderProductList[i].GratisOrderId);
                            totalorderamount += parseFloat(orders.OrderProductList[i].ItemPricesPerUnit) * parseFloat(orders.OrderProductList[i].ProductQuantity);
                            TotalDepositeAmount += parseFloat(orders.OrderProductList[i].DepositeAmount);
                            var availableProductStock = orders.OrderProductList[i].CurrentStockPosition;
                            var totalUsedQuantity = parseFloat(parseFloat(orders.OrderProductList[i].UsedQuantityInEnquiry) + parseFloat(orders.OrderProductList[i].UsedQuantityInOrder));
                            var remainingProductStock = parseFloat(parseFloat(availableProductStock) - parseFloat(totalUsedQuantity));
                            if (parseFloat(orders.OrderProductList[i].ProductQuantity) < remainingProductStock) {
                                orders.OrderProductList[i].IsItemAvailableInStock = true;
                            } else {
                                orders.OrderProductList[i].IsItemAvailableInStock = false;
                            }

                            if (orders.OrderProductList[i].IsItemAvailableInStock === false) {
                                OutOfStockItem.push(orders.OrderProductList[i].EnquiryProductId);
                            }
                            $rootScope.OutofStockItemsList = OutOfStockItem;
                        }

                        totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);
                        var totalamount = parseFloat(totalorderamount) + parseFloat(totaltaxamount) + parseFloat(TotalDepositeAmount);
                        $rootScope.AvailableCreditLimit = $rootScope.AvailableCreditLimit;


                        
                        // Change Enquiry Date, Praposed Date And Requested Date For Draft Enquiry Only.
                        if (orders.CurrentState === '8') {

                            

                            var requestData =
                                {
                                    ServicesAction: 'GetProposedDeliveryDate',
                                    CompanyId: enquiryDetails.CompanyID,
                                    CompanyMnemonic: enquiryDetails.SoldToCode,
                                    DeliveryLocation: {
                                        LocationId: enquiryDetails.ShipTo,
                                        DeliveryLocationCode: enquiryDetails.StockLocationId,
                                    },
                                    Company: {
                                        CompanyId: enquiryDetails.CompanyID,
                                        CompanyMnemonic: enquiryDetails.SoldToCode,
                                    },
                                    RuleType: 1,
                                    Order: {
                                        OrderTime: "",
                                        OrderDate: ""
                                    }

                                };


                            var jsonobject = {};
                            jsonobject.Json = requestData;
                            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                                
                                var responseStr = response.data.Json;

                                
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

                                    

                                });


                                $scope.OrderData.push(orders);
                                $rootScope.TemOrderData = $scope.OrderData;

                                
                                $scope.GetReceivingLocationBalanceCapacity($scope.OrderData[0].ShipTo, $scope.OrderData[0].OrderProposedETD, $scope.OrderData[0].CustomerId, enquiryDetails.Capacity, enquiryDetails.EnquiryId);


                            });




                        }
                        else {

                            $scope.OrderData.push(orders);
                            $rootScope.TemOrderData = $scope.OrderData;

                            
                            $scope.GetReceivingLocationBalanceCapacity($scope.OrderData[0].ShipTo, $scope.OrderData[0].OrderProposedETD, $scope.OrderData[0].CustomerId, enquiryDetails.Capacity, enquiryDetails.EnquiryId);

                        }


                    });





                });





            });
        } else {
            

            $scope.ActualEmptiesValidation();
            $scope.GetReceivingLocationBalanceCapacity($rootScope.TemOrderData[0].ShipTo, $rootScope.TemOrderData[0].OrderProposedETD, $rootScope.TemOrderData[0].CustomerId, $rootScope.TemOrderData[0].Capacity, $rootScope.TemOrderData[0].EnquiryId);
            if ($rootScope.LoadedAllBranchPlant !== undefined) {
                $scope.bindAllBranchPlant = $rootScope.LoadedAllBranchPlant;
            }


            // Save Item Layer Validation Log.
            var requestDataforItemLayer =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: 0,
                    ObjectType: "Credit Limit Of New Enquiry In view Enquiry Page",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'Load CreditLimit Of New Enquiry In view Enquiry Page. Credit Limit ' + Number($rootScope.AvailableCreditLimit) + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var consolidateApiParamaterItemLayer =
                {
                    Json: requestDataforItemLayer,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

            });



        }

    }
    $scope.LoadData();

    $scope.SaveInquiry = function (status) {
        
        $rootScope.Throbber.Visible = true;
        $rootScope.IsDisabledSubmit = true;
        $scope.EnquiryList = [];
        $scope.AllocationValidationEnquiryList = [];

        for (var i = 0; i < $scope.OrderData.length; i++) {
            var equirydata = {};
            equirydata.OrderGUID = $scope.OrderData[i].OrderGUID;
            equirydata.EnquiryId = $scope.OrderData[i].EnquiryId;
            equirydata.EnquiryType = "SO";
            equirydata.RequestDate = $scope.OrderData[i].RequestDate;
            equirydata.CompanyMnemonic = $rootScope.CompanyMnemonic;
            equirydata.ShipTo = $scope.OrderData[i].ShipTo;
            equirydata.SoldTo = $scope.OrderData[i].SoldTo;
            equirydata.IsRecievingLocationCapacityExceed = $scope.OrderData[i].IsRecievingLocationCapacityExceed;
            equirydata.NoOfDays = $rootScope.NoOfDays;
            equirydata.TruckSizeId = $scope.OrderData[i].TruckSizeId;
            equirydata.IsActive = $scope.OrderData[i].IsActive;
            if ($scope.OrderData[i].OrderProposedETD !== 'N/A') {
                equirydata.OrderProposedETD = $scope.OrderData[i].OrderProposedETD;
            }

            equirydata.NumberOfPalettes = $scope.OrderData[i].NumberOfPalettes;
            equirydata.PalletSpace = $scope.OrderData[i].PalletSpace;
            equirydata.TruckWeight = $scope.OrderData[i].TruckWeight;

            equirydata.PreviousState = 0;
            equirydata.CurrentState = status;
            equirydata.CreatedBy = $rootScope.UserId;
            equirydata.OrderProductList = [];
            equirydata.NoteList = [];

            for (var j = 0; j < $scope.OrderData[i].OrderProductList.length; j++) {
                var equiryProductdata = {};
                equiryProductdata.OrderGUID = $scope.OrderData[i].OrderProductList[j].OrderGUID;
                equiryProductdata.EnquiryProductId = $scope.OrderData[i].OrderProductList[j].EnquiryProductId;
                equiryProductdata.ItemId = $scope.OrderData[i].OrderProductList[j].ItemId;
                equiryProductdata.ParentItemId = $scope.OrderData[i].OrderProductList[j].ParentItemId;
                equiryProductdata.ParentProductCode = $scope.OrderData[i].OrderProductList[j].ParentProductCode;
                equiryProductdata.ItemName = $scope.OrderData[i].OrderProductList[j].ItemName;
                equiryProductdata.AssociatedOrder = $scope.OrderData[i].OrderProductList[j].GratisOrderId;
                equiryProductdata.ItemPricesPerUnit = $scope.OrderData[i].OrderProductList[j].ItemPricesPerUnit;
                equiryProductdata.ProductCode = $scope.OrderData[i].OrderProductList[j].ProductCode;
                equiryProductdata.PrimaryUnitOfMeasure = $scope.OrderData[i].OrderProductList[j].PrimaryUnitOfMeasure;
                equiryProductdata.ProductQuantity = $scope.OrderData[i].OrderProductList[j].ProductQuantity;
                equiryProductdata.ProductType = $scope.OrderData[i].OrderProductList[j].ProductType;
                equiryProductdata.WeightPerUnit = $scope.OrderData[i].OrderProductList[j].WeightPerUnit;
                equiryProductdata.IsActive = $scope.OrderData[i].OrderProductList[j].IsActive;
                equiryProductdata.ItemType = $scope.OrderData[i].OrderProductList[j].ItemType;
                equiryProductdata.DepositeAmountPerUnit = $scope.OrderData[i].OrderProductList[j].DepositeAmountPerUnit;
                equirydata.OrderProductList.push(equiryProductdata);
            }

            equirydata.NoteList = $scope.OrderData[i].NoteList;

            $scope.EnquiryList.push(equirydata);

            equirydata.OrderProductList = equirydata.OrderProductList.filter(function (el) { return el.ItemType !== '31'; });

            $scope.AllocationValidationEnquiryList.push(equirydata);
        }







        var Enquiry =
            {
                ServicesAction: "SaveEnquiryValidation",
                EnquiryList: $scope.AllocationValidationEnquiryList
            }


        var jsonobject = {};
        jsonobject.Json = Enquiry;

        
        $scope.AllocationError = [];
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            

            var resoponsedata = response.data.ProductList;

            if (resoponsedata.length > 0) {
                $scope.AllocationError = resoponsedata.filter(function (el) { return el.AllocationExcited === true; });

                if ($scope.AllocationError.length > 0) {
                    $rootScope.Throbber.Visible = false;
                    $rootScope.IsDisabledSubmit = false;
                    $scope.OpenEnquiryValidationpopup();
                    return false;
                }
                else {


                    // Save Item Layer Validation Log.
                    var requestDataforItemLayer =
                        {
                            UserId: $rootScope.UserId,
                            ObjectId: 0,
                            ObjectType: "Save Enquiry",
                            ServicesAction: 'CreateLog',
                            LogDescription: 'Click On Submit Enquiry. Enquiry List JSON ' + JSON.stringify($scope.EnquiryList) + '.',
                            LogDate: GetCurrentdate(),
                            Source: 'Portal',
                        };
                    var consolidateApiParamaterItemLayer =
                        {
                            Json: requestDataforItemLayer,
                        };

                    GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

                    });



                    var Enquiry =
                        {
                            ServicesAction: 'SaveEnquiry',
                            EnquiryList: $scope.EnquiryList

                        }
                    
                    var requestData =
                        {
                            ServicesAction: 'GetAllTruckSizeList',
                        };
                    
                    var jsonobject = {};
                    jsonobject.Json = Enquiry;
                    
                    if (status == 1) {

                        if (($rootScope.AvailableCreditLimit - $rootScope.totalorderamount) < 0) {
                            //$rootScope.ValidationErrorAlert('You do not have enough credits left in your account.Please mark as draft', 'error', 3000);
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_TotalCreditLimitValidation), 'error', 3000);
                            $rootScope.Throbber.Visible = false;
                            $rootScope.IsDisabledSubmit = false;
                            return false;
                        }
                    }


                    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                        
                        if (status == 1) {
                            $rootScope.AvailableCreditLimit = $rootScope.AvailableCreditLimit - $rootScope.totalorderamount;
                            $rootScope.totalorderamount = 0;
                        }


                        var Notes = [];
                        var enquiryListData = response.data.Json.EnquiryList;
                        for (var i = 0; i < enquiryListData.length; i++) {
                            if (enquiryListData[i].NoteList != undefined) {
                                if (enquiryListData[i].NoteList.length > 0) {

                                    for (var j = 0; j < enquiryListData[i].NoteList.length; j++) {
                                        var noteJson = {
                                            RoleId: enquiryListData[i].NoteList[j].RoleId,
                                            ObjectId: enquiryListData[i].EnquiryId,
                                            ObjectType: enquiryListData[i].NoteList[j].ObjectType,
                                            Note: enquiryListData[i].NoteList[j].Note,
                                            CreatedBy: enquiryListData[i].NoteList[j].CreatedBy
                                        }

                                        Notes.push(noteJson);
                                    }
                                }
                            }

                        }

                        if (Notes.length > 0) {
                            
                            var Note =
                                {
                                    ServicesAction: "SaveNotes",
                                    NoteList: Notes
                                }

                            var jsonobject = {};
                            jsonobject.Json = Note;

                            

                            GrRequestService.ProcessRequest(jsonobject).then(function (response) {


                            });

                        }




                        $rootScope.Throbber.Visible = false;

                        var resoponsedata = response.data;
                        $scope.OrderData = [];
                        $rootScope.TemOrderData = [];
                        $rootScope.CurrentOrderGuid = '';
                        $rootScope.TempEnquiryDetailId = 0;

                        $state.go("CreateInquiry");
                    });



                }
            }

        });

    }

    $scope.CheckDraftSingleInquiry = function (status, EnquiryData, OrderGUID) {
        
        //var IsProposedDateIsnotSame = true;
        


        $scope.EnquiryList = [];
        $scope.AllocationValidationEnquiryList = [];

        for (var i = 0; i < EnquiryData.length; i++) {
            
            //if (EnquiryData[i].CurrentState == 8) {
            //    $rootScope.GetProposedDeliveryDate(EnquiryData[i].ShipTo);
            //    if ($rootScope.DateField.RequestDate != EnquiryData[i].OrderProposedETD) {
            //        //validation popup
            //        //$rootScope.ValidationErrorAlert('No', 'error', 3000);
            //        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_LeadTimeChanged), 'error', 3000);
            //        IsProposedDateIsnotSame = false;
            //    }
            //}
            var equirydata = {};
            equirydata.OrderGUID = EnquiryData[i].OrderGUID;
            equirydata.EnquiryId = EnquiryData[i].EnquiryId;
            equirydata.RequestDate = EnquiryData[i].RequestDate;
            equirydata.ShipTo = EnquiryData[i].ShipTo;
            equirydata.SoldTo = EnquiryData[i].SoldTo;
            equirydata.CompanyMnemonic = $rootScope.CompanyMnemonic;
            equirydata.NoOfDays = $rootScope.NoOfDays;
            equirydata.TruckSizeId = EnquiryData[i].TruckSizeId;
            equirydata.IsActive = EnquiryData[i].IsActive;
            equirydata.IsRecievingLocationCapacityExceed = EnquiryData[i].IsRecievingLocationCapacityExceed;
            equirydata.NumberOfPalettes = EnquiryData[i].NumberOfPalettes;
            equirydata.PalletSpace = EnquiryData[i].PalletSpace;
            equirydata.TruckWeight = EnquiryData[i].TruckWeight;


            if (EnquiryData[i].OrderProposedETD !== 'N/A') {
                equirydata.OrderProposedETD = EnquiryData[i].OrderProposedETD;
            }

            equirydata.PreviousState = 0;
            equirydata.CurrentState = status;
            equirydata.CurrentStateDraft = EnquiryData[i].CurrentState;
            equirydata.CreatedBy = $rootScope.UserId;
            equirydata.OrderProductList = [];

            var totalorderamount = 0;
            var totalDepositeamount = 0;

            for (var j = 0; j < EnquiryData[i].OrderProductList.length; j++) {
                var equiryProductdata = {};

                totalorderamount += parseFloat(EnquiryData[i].OrderProductList[j].ItemPricesPerUnit) * parseFloat(EnquiryData[i].OrderProductList[j].ProductQuantity);

                totalDepositeamount += parseFloat(EnquiryData[i].OrderProductList[j].DepositeAmountPerUnit) * parseFloat(EnquiryData[i].OrderProductList[j].ProductQuantity);

                equiryProductdata.OrderGUID = EnquiryData[i].OrderProductList[j].OrderGUID;
                equiryProductdata.EnquiryProductId = EnquiryData[i].OrderProductList[j].EnquiryProductId;
                equiryProductdata.ItemId = EnquiryData[i].OrderProductList[j].ItemId;

                var ParentItemId = EnquiryData[i].OrderProductList[j];


                equiryProductdata.ParentItemId = EnquiryData[i].OrderProductList[j].ParentItemId;
                equiryProductdata.ParentProductCode = EnquiryData[i].OrderProductList[j].ParentProductCode;

                equiryProductdata.AssociatedOrder = EnquiryData[i].OrderProductList[j].GratisOrderId;
                equiryProductdata.ItemName = EnquiryData[i].OrderProductList[j].ItemName;
                equiryProductdata.ItemPricesPerUnit = EnquiryData[i].OrderProductList[j].ItemPricesPerUnit;
                equiryProductdata.ProductCode = EnquiryData[i].OrderProductList[j].ProductCode;
                equiryProductdata.PrimaryUnitOfMeasure = EnquiryData[i].OrderProductList[j].PrimaryUnitOfMeasure;
                equiryProductdata.ProductQuantity = EnquiryData[i].OrderProductList[j].ProductQuantity;
                equiryProductdata.ProductType = EnquiryData[i].OrderProductList[j].ProductType;
                equiryProductdata.WeightPerUnit = EnquiryData[i].OrderProductList[j].WeightPerUnit;
                equiryProductdata.IsActive = EnquiryData[i].OrderProductList[j].IsActive;
                equiryProductdata.ItemType = EnquiryData[i].OrderProductList[j].ItemType;
                equiryProductdata.AllocationExcited = false;
                equiryProductdata.AllocationQty = 0;
                equiryProductdata.DepositeAmountPerUnit = EnquiryData[i].OrderProductList[j].DepositeAmountPerUnit;

                equirydata.OrderProductList.push(equiryProductdata);
            }

            equirydata.ReturnPakageMaterialList = EnquiryData[i].ReturnPakageMaterialList;


            $scope.EnquiryList.push(equirydata);

            equirydata.OrderProductList = equirydata.OrderProductList.filter(function (el) { return el.ItemType !== '31'; });

            $scope.AllocationValidationEnquiryList.push(equirydata);

        }

        if ($scope.EnquiryList.length > 0) {
            if (status == 1) {
                var totaltaxamount = 0;
                totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);
                totalorderamount = totalorderamount + totaltaxamount + totalDepositeamount;



                if (($rootScope.AvailableCreditLimit - (totalorderamount)) < 0) {
                    //$rootScope.ValidationErrorAlert('You do not have enough credits left in your account.Please mark as draft', 'error', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_TotalCreditLimitValidation), 'error', 3000);
                    $rootScope.IsDisabledSubmit = false;
                    return false;
                }
            }

            Action = "SaveEnquiryValidation";

            var Enquiry =
                {
                    ServicesAction: Action,
                    EnquiryList: $scope.AllocationValidationEnquiryList
                }



            
            var requestData =
                {
                    ServicesAction: 'GetAllTruckSizeList',
                };

            

            var jsonobject = {};
            jsonobject.Json = Enquiry;

            
            $scope.AllocationError = [];
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                

                var resoponsedata = response.data.ProductList;

                if (resoponsedata.length > 0) {
                    $scope.AllocationError = resoponsedata.filter(function (el) { return el.AllocationExcited === true; });

                    if ($scope.AllocationError.length > 0) {
                        if (parseInt($scope.AllocationError[0].ItemType) == 30) {
                            $scope.SaveSingleInquiry(1, EnquiryData, OrderGUID);
                        }
                        else {
                            $rootScope.Throbber.Visible = false;
                            $scope.OpenEnquiryValidationpopup();
                            $rootScope.IsDisabledSubmit = false;
                            return false;
                        }

                    }
                    else {
                        $scope.SaveSingleInquiry(1, EnquiryData, OrderGUID);
                    }
                }

            });
        }


    }

    $scope.SaveSingleInquiry = function (status, EnquiryData, OrderGUID) {

        
        $rootScope.Throbber.Visible = true;
        $rootScope.IsDisabledSubmit = true;
        $scope.EnquiryList = [];

        for (var i = 0; i < EnquiryData.length; i++) {
            var equirydata = {};
            equirydata.OrderGUID = EnquiryData[i].OrderGUID;
            equirydata.EnquiryId = EnquiryData[i].EnquiryId;
            equirydata.RequestDate = EnquiryData[i].RequestDate;
            equirydata.NoOfDays = EnquiryData[i].NoOfDays;
            equirydata.ShipTo = EnquiryData[i].ShipTo;
            equirydata.SoldTo = EnquiryData[i].SoldTo;
            equirydata.TruckSizeId = EnquiryData[i].TruckSizeId;
            equirydata.IsActive = EnquiryData[i].IsActive;
            equirydata.IsRecievingLocationCapacityExceed = EnquiryData[i].IsRecievingLocationCapacityExceed;
            equirydata.NumberOfPalettes = EnquiryData[i].NumberOfPalettes;
            equirydata.PalletSpace = EnquiryData[i].PalletSpace;
            equirydata.TruckWeight = EnquiryData[i].TruckWeight;


            if (EnquiryData[i].OrderProposedETD !== 'N/A') {
                equirydata.OrderProposedETD = EnquiryData[i].OrderProposedETD;
            }

            equirydata.PreviousState = 0;
            equirydata.CurrentState = status;
            equirydata.CurrentStateDraft = EnquiryData[i].CurrentState;
            equirydata.CreatedBy = $rootScope.UserId;
            equirydata.OrderProductList = [];
            equirydata.NoteList = [];

            var totalorderamount = 0;
            var totalDepositeamount = 0;

            for (var j = 0; j < EnquiryData[i].OrderProductList.length; j++) {
                var equiryProductdata = {};

                totalorderamount += parseFloat(EnquiryData[i].OrderProductList[j].ItemPricesPerUnit) * parseFloat(EnquiryData[i].OrderProductList[j].ProductQuantity);
                totalDepositeamount += parseFloat(EnquiryData[i].OrderProductList[j].DepositeAmountPerUnit) * parseFloat(EnquiryData[i].OrderProductList[j].ProductQuantity);

                equiryProductdata.OrderGUID = EnquiryData[i].OrderProductList[j].OrderGUID;
                equiryProductdata.EnquiryProductId = EnquiryData[i].OrderProductList[j].EnquiryProductId;
                equiryProductdata.ItemId = EnquiryData[i].OrderProductList[j].ItemId;

                var ParentItemId = EnquiryData[i].OrderProductList[j];
                equiryProductdata.ParentItemId = EnquiryData[i].OrderProductList[j].ParentItemId;
                equiryProductdata.ParentProductCode = EnquiryData[i].OrderProductList[j].ParentProductCode;
                equiryProductdata.AssociatedOrder = EnquiryData[i].OrderProductList[j].GratisOrderId;
                equiryProductdata.ItemName = EnquiryData[i].OrderProductList[j].ItemName;
                equiryProductdata.ItemPricesPerUnit = EnquiryData[i].OrderProductList[j].ItemPricesPerUnit;
                equiryProductdata.ProductCode = EnquiryData[i].OrderProductList[j].ProductCode;
                equiryProductdata.PrimaryUnitOfMeasure = EnquiryData[i].OrderProductList[j].PrimaryUnitOfMeasure;
                equiryProductdata.ProductQuantity = EnquiryData[i].OrderProductList[j].ProductQuantity;
                equiryProductdata.ProductType = EnquiryData[i].OrderProductList[j].ProductType;
                equiryProductdata.WeightPerUnit = EnquiryData[i].OrderProductList[j].WeightPerUnit;
                equiryProductdata.IsActive = EnquiryData[i].OrderProductList[j].IsActive;
                equiryProductdata.ItemType = EnquiryData[i].OrderProductList[j].ItemType;
                equiryProductdata.ReasonCodeId = $rootScope.ReasonCodeId;
                equiryProductdata.DepositeAmountPerUnit = EnquiryData[i].OrderProductList[j].DepositeAmountPerUnit;

                equirydata.OrderProductList.push(equiryProductdata);
            }

            equirydata.ReturnPakageMaterialList = EnquiryData[i].ReturnPakageMaterialList;
            equirydata.NoteList = EnquiryData[i].NoteList;
            $scope.EnquiryList.push(equirydata);
        }




        var Action = "";
        if ($scope.EnquiryList[0].EnquiryId !== undefined && $scope.EnquiryList[0].EnquiryId !== 0 && $scope.EnquiryList[0].EnquiryId !== null) {
            Action = "UpdateEnquiry";
        } else {
            Action = "SaveEnquiry";
        }


        // Save Item Layer Validation Log.
        var requestDataforItemLayer =
            {
                UserId: $rootScope.UserId,
                ObjectId: 0,
                ObjectType: Action,
                ServicesAction: 'CreateLog',
                LogDescription: 'Click On Submit Enquiry. Enquiry List JSON ' + JSON.stringify($scope.EnquiryList) + '.',
                LogDate: GetCurrentdate(),
                Source: 'Portal',
            };
        var consolidateApiParamaterItemLayer =
            {
                Json: requestDataforItemLayer,
            };

        GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

        });


        if (status == 1) {
            var totaltaxamount = 0;
            totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);
            totalorderamount = totalorderamount + totaltaxamount + totalDepositeamount;



            if (($rootScope.AvailableCreditLimit - (totalorderamount)) < 0) {
                //$rootScope.ValidationErrorAlert('You do not have enough credits left in your account.Please mark as draft', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_TotalCreditLimitValidation), 'error', 3000);
                $rootScope.Throbber.Visible = false;
                $rootScope.IsDisabledSubmit = false;
                return false;
            }
        }

        var Enquiry =
            {
                ServicesAction: Action,
                EnquiryList: $scope.EnquiryList
            }
        
        var requestData =
            {
                ServicesAction: 'GetAllTruckSizeList',
            };
        

        var jsonobject = {};
        jsonobject.Json = Enquiry;

        

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            

            if ($rootScope.RoleName === "CustomerService") {
                if ($scope.EnquiryList[0].EnquiryId !== undefined && $scope.EnquiryList[0].EnquiryId !== 0 && $scope.EnquiryList[0].EnquiryId !== null) {
                    $scope.ApproveEnquiryByEnquiryId(EnquiryData);
                }
            } else if ($rootScope.RoleName === "Customer") {
                if (status == 1) {
                    $rootScope.AvailableCreditLimit = $rootScope.AvailableCreditLimit - totalorderamount;
                    $rootScope.totalorderamount = 0;
                }


                var Notes = [];
                var enquiryListData = response.data.Json.EnquiryList;
                for (var i = 0; i < enquiryListData.length; i++) {
                    if (enquiryListData[i].NoteList != undefined) {
                        if (enquiryListData[i].NoteList.length > 0) {

                            for (var j = 0; j < enquiryListData[i].NoteList.length; j++) {
                                var noteJson = {
                                    RoleId: enquiryListData[i].NoteList[j].RoleId,
                                    ObjectId: enquiryListData[i].EnquiryId,
                                    ObjectType: enquiryListData[i].NoteList[j].ObjectType,
                                    Note: enquiryListData[i].NoteList[j].Note,
                                    CreatedBy: enquiryListData[i].NoteList[j].CreatedBy
                                }

                                Notes.push(noteJson);
                            }
                        }
                    }

                }

                if (Notes.length > 0) {
                    
                    var Note =
                        {
                            ServicesAction: "SaveNotes",
                            NoteList: Notes
                        }

                    var jsonobject = {};
                    jsonobject.Json = Note;

                    

                    GrRequestService.ProcessRequest(jsonobject).then(function (response) {


                    });

                }


            }

            var resoponsedata = response.data;
            $scope.RemoveInquiry(OrderGUID);
            $rootScope.Throbber.Visible = false;
            $rootScope.IsDisabledSubmit = false;
            if ($scope.OrderData.length === 0) {
                if ($rootScope.EditEnquiry === true) {
                    $rootScope.EditEnquiry = false;
                }
                if ($rootScope.RoleName === "CustomerService") {
                    $rootScope.TempEnquiryDetailId = 0;
                    $state.go("OMInquiry");
                } else if ($rootScope.RoleName === "Customer") {
                    $rootScope.TempEnquiryDetailId = 0;
                    $state.go("InquiryDetails");
                }

            }


        });


    }

    $scope.RemoveInquiry = function (OrderGUID) {
        
        $scope.findAndRemove($scope.OrderData, 'OrderGUID', OrderGUID, 'EnquiryId');
        $rootScope.TemOrderData = $scope.OrderData;
        $scope.CalculateTotalAmountOfProductWithTaxAndDeposite();
    }


    $scope.findAndRemove = function (array, property, value, primaryId) {
        array.forEach(function (result, index) {
            
            if (result[property] === value) {
                array.splice(index, 1);
            }
        });


    };

    $scope.SaveAllInquiry = function () {
        var checkValue = $scope.CopyInquiryValidation();
        if (checkValue) {

            $scope.SaveInquiry(1);
        }
    }
    $scope.SaveAllAsDraftInquiry = function () {
        $scope.SaveInquiry(8);
    }
    $scope.SingleInquiry = function (orderGUID) {
        

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === orderGUID; });
        if (currentOrder.length > 0) {
            $rootScope.IsDisabledSubmit = true;
            if ($rootScope.RoleName === "CustomerService") {
                $scope.SaveSingleInquiry(currentOrder[0].CurrentState, currentOrder, orderGUID);

            } else {

                if (currentOrder[0].CurrentState === 8 || currentOrder[0].CurrentState === '8') {
                    $scope.CheckDraftSingleInquiry(1, currentOrder, orderGUID);
                }
                else {
                    //$scope.SaveSingleInquiry(1, currentOrder, orderGUID);
                    $scope.CheckDraftSingleInquiry(1, currentOrder, orderGUID);

                }
            }
        }

    }

    // Load Item List For Feedback Functionality.
    $scope.LoadAllItem = function () {
        var requestData =
            {
                ServicesAction: 'LoadAllProducts',
                CompanyId: $scope.TempCompanyId
            };
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data;
            $scope.bindallproduct = resoponsedata.Item.ItemList;
        });
    }
    $scope.LoadAllItem();

    // Hide Copy Button If Any Gratis Item
    $scope.GetGratisOrderCount = function (productList) {
        var IsGratisContain = false;
        if (productList.length > 0) {
            for (var i = 0; i < productList.length; i++) {
                if (parseInt(productList[i].GratisOrderId) != 0) {
                    IsGratisContain = true;
                    break;
                }
            }
        }
        return IsGratisContain
    }

    // Edit Enquiry By EnquiryId.
    $scope.EditInquiry = function (OrderGUID) {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
        if (currentOrder.length > 0) {

            if (currentOrder[0].EnquiryId != undefined && currentOrder[0].EnquiryId != 0 && $rootScope.RoleName === "CustomerService") {

                $rootScope.EditedEnquiryId = currentOrder[0].EnquiryId;

                $scope.ActionButton = "Edit";
                $scope.OpenReasoncodepopup($scope.OrderData, OrderGUID, "EditEnquiry");
            }
            else {
                $rootScope.EditedEnquiryId = 0;
                $scope.EditEnquiryToUpdateData(currentOrder, OrderGUID);
            }



            // Save Item Layer Validation Log.
            var requestDataforItemLayer =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: 0,
                    ObjectType: "Edit Enquiry",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'Click On Edit Enquiry. Enquiry List JSON ' + JSON.stringify(currentOrder) + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var consolidateApiParamaterItemLayer =
                {
                    Json: requestDataforItemLayer,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

            });

        }
    }
    $scope.EditEnquiryToUpdateData = function (enquiryList, OrderGUID) {
        
        if (!$scope.ShowBackButton) {
            $rootScope.EditEnquiry = true;
        }
        else {
            $rootScope.EditEnquiry = false;
        }
        if ($rootScope.RoleName === "CustomerService") {
            $rootScope.IsEnquiryEditedByCustomerService = true;

            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
            if (currentOrder.length > 0) {
                $rootScope.TempCompanyId = currentOrder[0].CustomerId;
                $rootScope.TempCompanyId = currentOrder[0].CustomerId;
                $rootScope.BranchPlantCodeEdit = currentOrder[0].BranchPlantCode;
            }
        } else {
            $rootScope.IsEnquiryEditedByCustomerService = false;
        }


        if ($scope.OrderData[0].EnquiryId != undefined && $scope.OrderData[0].EnquiryId != 0 && $scope.OrderData[0].EnquiryId != "0") {
            $rootScope.SavedEditEnquiry = true;
        } else {
            $rootScope.SavedEditEnquiry = false;
        }

        $rootScope.isEnquiryEdit = true;
        $rootScope.CurrentOrderGuid = OrderGUID;
        $rootScope.TemOrderData = $scope.OrderData;
        $state.go("CreateInquiryOld");
    }

    // Back Button For Back To Create Inquiry Page.
    $scope.BackToCreateInquiry = function () {
        
        $rootScope.CurrentOrderGuid = '';
        $rootScope.TemOrderData = $scope.OrderData;
        $state.go("CreateInquiryOld");
    }

    // Approve Enquiry By Enquiry Id.
    $scope.ApproveEnquiry = function (orderguid) {
        
        $rootScope.IsDisabledSubmit = true;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === orderguid; });
        if (currentOrder.length > 0) {

            currentOrder[0].EnquiryProductList = currentOrder[0].OrderProductList;

            $scope.ActionButton = "Approve";
            var orderdata = angular.copy($scope.OrderData);

            var enquiryDetails = orderdata;
            enquiryDetails[0].RequestDate = enquiryDetails[0].OrderRequestDate;
            enquiryDetails[0].CarrierNumber = enquiryDetails[0].carrier;

            $rootScope.ObjectType = 'Enquiry';

            if (enquiryDetails[0].branchPlant === "0" || enquiryDetails[0].branchPlant === undefined || enquiryDetails[0].branchPlant === "") {
                $rootScope.Throbber.Visible = false;
                $rootScope.IsDisabledSubmit = false;
                //$rootScope.ValidationErrorAlert('Please Select Branch Plant Code.', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_SelectBranchPlantCode), '', 3000);
            }
            else if ((enquiryDetails[0].CarrierNumber === "0" || enquiryDetails[0].CarrierNumber === undefined || enquiryDetails[0].CarrierNumber === "" || enquiryDetails[0].CarrierNumber === null) && enquiryDetails[0].IsSelfCollectEnquiry !== "SCO") {
                $rootScope.Throbber.Visible = false;
                $rootScope.IsDisabledSubmit = false;
                //$rootScope.ValidationErrorAlert('Please Select Carrier.', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_SelectCarrier), '', 3000);

            }
            else {
                $scope.ApproveEnquiryByCustomerService(enquiryDetails, orderguid);
                $rootScope.Throbber.Visible = false;
            }
        }

    }
    $scope.ApproveEnquiryByCustomerService = function (enquiryList, orderguid) {
        
        $rootScope.Throbber.Visible = true;

        if ($rootScope.EditEnquiry === true) {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === orderguid; });
            if (currentOrder.length > 0) {
                if ($rootScope.RoleName === "CustomerService") {
                    $scope.SaveSingleInquiry(1, currentOrder, orderguid);
                    $rootScope.Throbber.Visible = false;
                }
            }

        } else {
            $scope.ApproveEnquiryByEnquiryId(enquiryList);
        }

    }
    $scope.ApproveEnquiryByEnquiryId = function (enquiryList) {
        
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
                EnquiryDetailList: enquiryList,
                UserName: $rootScope.UserName,
                UserId: $rootScope.UserId,
                DefaultLeadTime: settingValue
            };
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
                    ObjectType: "Approve",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'Click On Approve Enquiry. Enquiry List JSON ' + JSON.stringify(enquiryList) + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var consolidateApiParamaterItemLayer =
                {
                    Json: requestDataforItemLayer,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

            });


            $rootScope.Throbber.Visible = false;
            //$rootScope.ValidationErrorAlert('Order/s sent for approval. Awaiting SO Number.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_AwaitingSONumber), '', 3000);
            $rootScope.EditEnquiry = false;
            $state.go("OMInquiry");

            if ($scope.OrderData !== undefined && $scope.OrderData !== null && $scope.OrderData !== "") {
                $scope.OrderData[0].CurrentState = "4";
            }

        });
    }

    // Reject Enquiry By Enquiry Id.
    $scope.RejectEnquiryByEnquiryId = function (enquiryList, enquiryId) {
        
        $rootScope.Throbber.Visible = true;

        var enquiryNumberList = [];

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === enquiryId; });
        if (currentOrder.length > 0) {
            var enquiryJson = {
                EnquiryId: currentOrder[0].EnquiryId
            }
            enquiryNumberList.push(enquiryJson);
        }


        var requestData =
            {
                ServicesAction: 'RejectEnquiry',
                EnquiryList: enquiryNumberList,
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            //$rootScope.ValidationErrorAlert('Enquiry rejected successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_EnquiryRejected), '', 3000);

            $rootScope.EnquiryRejected = true;
            $rootScope.Throbber.Visible = false;



        });
    }
    $scope.RejectEnquiry = function (orderGUID) {
        
        $scope.ActionButton = "Reject";
        $scope.OpenReasoncodepopup($scope.OrderData, orderGUID, "RejectEnquiry");

    }

    // Filter Wooden Pallet Item.
    $scope.myFilter = function (item) {
        return item.ProductCode !== $scope.WoodenPalletCode;
    };

    // Copy Inquiry Modal Popup.
    $scope.LoadCapyInquiryModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/CopyInquiry.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {
            
            $scope.CopyInquiryPopup = modal;
        });
    }
    $scope.LoadCapyInquiryModalPopup();
    $scope.CloseCopyInquirypopup = function () {
        
        $scope.CopyTruckJson.NumberOfTruck = 0;
        $scope.CopyTruckJson.CopyOrderGuid = '';
        $scope.CopyInquiryPopup.hide();
    }
    $scope.OpenCopyInquirypopup = function (orderGuid) {
        
        $scope.records = [];
        $scope.CopyTruckJson.CopyOrderGuid = orderGuid;
        $scope.CopyInquiryPopup.show();
    }
    $scope.CopyInquiryValidation = function () {
        

        var isValidRecord = true;

        var orderList = $scope.OrderData;
        var ItemWithAllocation = [];

        for (var i = 0; i < orderList.length; i++) {
            for (var j = 0; j < orderList[i].OrderProductList.length; j++) {
                var allocationItem = {};
                if (orderList[i].OrderProductList[j].ActualAllocation !== 'NA' && orderList[i].OrderProductList[j].ItemType === 32) {
                    allocationItem.ActualAllocation = orderList[i].OrderProductList[j].ActualAllocation;
                    allocationItem.ItemName = orderList[i].OrderProductList[j].ItemName;
                    allocationItem.ProductCode = orderList[i].OrderProductList[j].ProductCode;
                    allocationItem.ItemType = orderList[i].OrderProductList[j].ItemType;
                    if ($scope.CopyTruckJson.CopyOrderGuid === orderList[i].OrderProductList[j].OrderGUID) {
                        allocationItem.ProductQuantity = (parseInt($scope.CopyTruckJson.NumberOfTruck) * orderList[i].OrderProductList[j].ProductQuantity) + orderList[i].OrderProductList[j].ProductQuantity;
                    }
                    else {
                        allocationItem.ProductQuantity = orderList[i].OrderProductList[j].ProductQuantity;
                    }
                    ItemWithAllocation.push(allocationItem);
                }
            }
        }
        $scope.records = [];
        var keys = [];
        var key = -1;

        $.each(ItemWithAllocation, function (index, value) {
            //Add each unique Id to the records collection 
            key = value['ProductCode'];

            var filterItem = $scope.records.filter(function (el) { return el.ProductCode === key; });


            if (filterItem.length === 0) {
                
                var record = new Object;
                record.ActualAllocation = parseInt(value["ActualAllocation"]);
                record.ItemName = value["ItemName"];
                record.ProductCode = value["ProductCode"];
                record.ItemType = value["ItemType"];
                record.ProductQuantity = parseInt(value["ProductQuantity"]);
                $scope.records.push(record);
                keys.push(key);
            }
                //Not a unique Id, keep a running sum
            else {
                
                filterItem[0].ProductQuantity += parseInt(value["ProductQuantity"]);

            }
        });
        
        $scope.records = $scope.records.filter(function (el) { return el.ProductQuantity > el.ActualAllocation; });

        if ($scope.records.length > 0) {
            isValidRecord = false;
        }

        return isValidRecord;
    }
    $scope.SaveCopyInquiry = function () {
        
        var checkValue = $scope.CopyInquiryValidation();
        if (checkValue) {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CopyTruckJson.CopyOrderGuid; });
            for (var i = 0; i < $scope.CopyTruckJson.NumberOfTruck; i++) {
                var order = angular.copy(currentOrder[0]);
                order.OrderGUID = generateGUID();
                for (var j = 0; j < order.OrderProductList.length; j++) {
                    order.OrderProductList[j].OrderGUID = order.OrderGUID;
                }
                $scope.OrderData.push(order);
            }

            // Save Copy Log.
            var requestDataforItemLayer =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: 0,
                    ObjectType: "Copy Enquiry",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'Press Save Copy button IN View Enquiry . ENquiry List JSON ' + JSON.stringify($scope.OrderData) + ' number of copy ' + $scope.CopyTruckJson.NumberOfTruck + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var consolidateApiParamaterItemLayer =
                {
                    Json: requestDataforItemLayer,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

            });



            $scope.CopyTruckJson.NumberOfTruck = 0;
            $scope.CopyTruckJson.CopyOrderGuid = '';
            $scope.CalculateTotalAmountOfProductWithTaxAndDeposite();
            $scope.CloseCopyInquirypopup();
        }
    }
    $scope.SingleAsDraftInquiry = function (orderGUID) {
        
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === orderGUID; });
        $scope.SaveSingleInquiry(8, currentOrder, orderGUID);
    }


    // Check Allocation Excited Validation Modal Popup.
    $scope.LoadAllocationValidationModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/EnquiryValidation.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {
            
            $scope.EnquiryValidationPopup = modal;
        });
    }
    $scope.LoadAllocationValidationModalPopup();
    $scope.CloseEnquiryValidationpopup = function () {
        
        $scope.EnquiryValidationPopup.hide();
    }
    $scope.OpenEnquiryValidationpopup = function () {
        
        $scope.EnquiryValidationPopup.show();
    }

    // Open Reason Code Modal Popup and Save reason Code.
    $scope.ReasonCodeList = [];
    $scope.ReasonCodeModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/reasoncodepopup.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {
            
            $scope.reasoncodepopup = modal;
        });
    }
    $scope.ReasonCodeModalPopup();
    $scope.OpenReasoncodepopup = function (enquiryList, orderGuId, eventName) {
        
        $rootScope.ReasonCodeEnquiryList = enquiryList;
        $scope.ReasonCodeEventName = eventName;
        $rootScope.orderGuId = orderGuId;
        $scope.reasoncodepopup.show();
    }
    $scope.ClosReasoncodepopup = function () {
        
        $scope.ReasonCodeJson.ReasonCode = "";
        $scope.ReasonCodeJson.ReasonDescription = "";
        $scope.ReasonCodeEventName = "";
        $scope.reasoncodepopup.hide();
    }
    $scope.CopyTruckJson = {
        NumberOfTruck: 0,
        CopyOrderGuid: ''

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
                ObjectId: $rootScope.ReasonCodeEnquiryList[0].EnquiryId,
                ObjectType: 'Enquiry',
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
                
                if ($scope.ActionButton === "Reject") {
                    $scope.RejectEnquiryByEnquiryId($rootScope.ReasonCodeEnquiryList, $rootScope.orderGuId);
                }
                else if ($scope.UpdateName === "BranchPlant") {
                    $scope.UpdateBranchPlantCode();
                }
                else if ($scope.UpdateName === "SchedulingDate") {
                    $scope.UpdateSchedulingDateInOrder();
                } else {
                    $scope.EditEnquiryToUpdateData($rootScope.ReasonCodeEnquiryList, $rootScope.orderGuId);
                }
                if (response.data != null) {
                    if (response.data.Json != undefined) {
                        if (response.data.Json.ReasonCodeList.length > 0) {
                            $rootScope.ReasonCodeId = response.data.Json.ReasonCodeList[0].ReasonCodeId;
                        }
                    }
                }

                $scope.ActionButton = "";
                $rootScope.ReasonCodeEnquiryList = [];
                $scope.ReasonCodeJson.ReasonCode = "";
                $scope.ReasonCodeJson.ReasonDescription = "";
                $scope.UpdateName = "";
                $scope.ClosReasoncodepopup();
            });

        } else {
            $rootScope.ValidationErrorAlert('Please select reason code.', 'error', 3000);
        }


    }


    // Add RPM Functionality
    $scope.LoadRPMModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/RPMQuantity.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {
            
            $scope.RPMQuantitypopup = modal;
        });
    }
    $scope.LoadRPMModalPopup();
    $scope.RPMOrderId = 0;
    $scope.ReturnPakageMaterialListData = [];
    $scope.OpenRPMQuantitypopup = function (guid) {
        
        $scope.RPMOrderId = guid;

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.RPMOrderId; });
        if (currentOrder.length > 0) {
            $scope.ReturnPakageMaterialListData = currentOrder[0].ReturnPakageMaterialList;
        }
        $scope.RPMQuantitypopup.show();
    }
    $scope.CloseRPMQuantitypopup = function () {
        
        $scope.RPMOrderId = 0;

        $scope.RPMQuantitypopup.hide();
    }
    $scope.inputChangeHandler = function (input) {
        
        if (input.length > 0) {
            $scope.showItembox = true;
        } else {
            $scope.showItembox = false;
        }
    }
    $scope.predicates = {
        InputItem: '',
    };
    $scope.ReturnItemList = {
        Quantity: 0,
        ItemId: 0,
        ItemCode: '',
        ItemName: '',
        UnitOfMeasure: '',
    };
    $scope.ReturnPakageMaterialItemList = [];
    $scope.AddReturnPakageMaterialItem = function () {
        

        var returnpakageitem = $scope.ReturnPakageMaterialItemList.filter(function (el) { return el.ProductId === $scope.ReturnItemList.ItemId; });
        if (returnpakageitem.length > 0) {
            
            returnpakageitem[0].ProductQuantity = parseInt(returnpakageitem[0].ProductQuantity) + parseInt($scope.ReturnItemList.Quantity);
        } else {
            var returnpakagematerialitem = {
                ProductId: $scope.ReturnItemList.ItemId,
                ProductName: $scope.ReturnItemList.ItemName,
                ProductCode: $scope.ReturnItemList.ItemCode,
                ParentProductCode: '',
                ProductType: 33,
                PrimaryUnitOfMeasure: $scope.ReturnItemList.UnitOfMeasure,
                ProductQuantity: $scope.ReturnItemList.Quantity,
                IsActive: true
            }

            $scope.ReturnPakageMaterialItemList.push(returnpakagematerialitem);
        }



        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.RPMOrderId; });
        if (currentOrder.length > 0) {
            currentOrder[0].ReturnPakageMaterialList = $scope.ReturnPakageMaterialItemList;
            $scope.ReturnPakageMaterialListData = currentOrder[0].ReturnPakageMaterialList;
        }

        $scope.ClearProductItem();
    }
    $scope.RemoveRPMItem = function (productId) {
        

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.RPMOrderId; });
        if (currentOrder.length > 0) {

            currentOrder[0].ReturnPakageMaterialList = currentOrder[0].ReturnPakageMaterialList.filter(function (el) { return el.ProductId !== productId; });
            $scope.ReturnPakageMaterialItemList = $scope.ReturnPakageMaterialItemList.filter(function (el) { return el.ProductId !== productId; });
            if ($scope.ReturnPakageMaterialItemList.length > 0) {
                
                $scope.ReturnPakageMaterialListData = $scope.ReturnPakageMaterialItemList;
            } else {
                $scope.ReturnPakageMaterialListData = [];
            }
        }

    }
    $scope.SelectedProduct = function (e) {
        
        var itemId = e.ItemId;

        $scope.predicates.InputItem = e.ItemNameCode;
        $scope.ReturnItemList.ItemId = e.ItemId;
        $scope.ReturnItemList.ItemCode = e.ItemCode;
        $scope.ReturnItemList.ItemName = e.ItemName;
        $scope.ReturnItemList.UnitOfMeasure = e.UOM;
        $scope.showItembox = false;
    }
    $scope.ClearProductItem = function () {
        
        $scope.ReturnItemList.Quantity = 0;
        $scope.predicates.InputItem = "";
        $scope.ReturnItemList.ItemId = "";
        $scope.ReturnItemList.UnitOfMeasure = "";
        $scope.showItembox = false;
    }
    $scope.ClearAutoSearchbox = function () {
        
        $scope.ClearProductItem();
    }
    $scope.ResetProductItem = function () {
        
        $scope.ReturnItemList.Quantity = 0;
        $scope.predicates.InputItem = "";
        $scope.ReturnItemList.ItemId = "";
        $scope.showItembox = false;
        $scope.ReturnPakageMaterialItemList = [];
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.RPMOrderId; });
        if (currentOrder.length > 0) {
            currentOrder[0].ReturnPakageMaterialList = [];
        }
        $scope.CloseRPMQuantitypopup();
    }


    // View RPM Functionality
    $scope.ViewReturnPakageMaterialListData = [];
    $ionicModal.fromTemplateUrl('templates/ShowRPMQuantity.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.ViewRPMQuantitypopup = modal;
    });
    $scope.ShowRPMItemCollection = function (OrderGUID) {
        
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
        if (currentOrder.length > 0) {

            $scope.ViewReturnPakageMaterialListData = currentOrder[0].ReturnPakageMaterialList;
        }
        $scope.ViewRPMQuantitypopup.show();
    }
    $scope.CloseViewRPMQuantitypopup = function () {
        
        $scope.ViewRPMQuantitypopup.hide();
    }


    // Update Branch Plant Code In Enquiry.
    $scope.OnSelectChangeBranchPlant = function (e, orderGUID) {
        
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === orderGUID; });

        var deliveryLocationCurrent = $scope.bindAllBranchPlant.filter(function (el) { return el.DeliveryLocationId === e; });
        if (deliveryLocationCurrent.length > 0) {
            currentOrder[0].BranchPlantCode = deliveryLocationCurrent[0].DeliveryLocationCode;
        }
        $scope.UpdateBranchPlantOnChange(currentOrder[0].EnquiryId, e);
        $scope.LoadAllCarrier(currentOrder[0].EnquiryId, currentOrder[0].branchPlant, currentOrder[0].ShipTo, currentOrder[0].TruckSizeId);
    }
    $scope.UpdateBranchPlantOnChange = function (enquiryId, branchPlant) {
        
        $scope.UpdateName = "BranchPlant";
        $scope.UpdateEnquiryId = enquiryId;
        $scope.UpdateBranchPlantId = branchPlant;
        var enquiryDetails = $scope.OrderData.filter(function (el) { return parseInt(el.EnquiryId) === parseInt(enquiryId); });
        $scope.UpdateBranchPlantCode(enquiryDetails);

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

        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            $scope.UpdateName = "";
            $scope.LoadData();
            //$rootScope.ValidationErrorAlert('Branch Plant updated successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_BranchPlantUpdated), '', 3000);
        });
    }

    // Update Scheduling Date In Enquiry.
    $scope.UpdateSchedulingDateOnChange = function (orderId, SchedulingDate) {
        
        $scope.UpdateName = "SchedulingDate";
        $scope.UpdateEnquiryId = $scope.OrderData[0].EnquiryId;
        $scope.UpdateSchedulingDate = SchedulingDate;
        var enquiryDetails = $scope.OrderData.filter(function (el) { return parseInt(el.EnquiryId) === parseInt($scope.OrderData[0].EnquiryId); });
        $scope.OpenReasoncodepopup(enquiryDetails, "", "RequestedDate");

    }
    $scope.UpdateSchedulingDateInOrder = function () {
        
        var enquiryList = {
            SchedulingDate: $scope.UpdateSchedulingDate,
            EnquiryId: $scope.UpdateEnquiryId,
        }
        var requestData =
            {
                ServicesAction: 'UpdateSchedulingDate',
                EnquiryDetailList: enquiryList
            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            //$rootScope.ValidationErrorAlert('Scheduling date updated successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_SchedulingUpdated), '', 3000);
        });
    }

    // Add Feedback Functionality.
    $scope.OrderItemFeedback = [];
    $scope.fileupload = {
        File: '',
        ItemFile: '',
    }
    $scope.FeedbackVariable = {
        OverAll: true,
        Specific: false,
        Quantity: '',
        ProductCode: '',
        Name: '',
        ItemName: '',
        myFile: '',
        fileupload: '',
        ItemFeedbackName: '',
        ItemComment: '',
        Comment: '',
        UOM: "",
        Quantity: "",
        labelItemFilename: "",
        labelFilename: ""

    }
    $scope.savefeedback = function () {

        
        $scope.SaveFeedBackJson();

    }
    $scope.ItemFileNameChanged = function (element) {
        
        $scope.$apply(function () {
            
            $scope.FeedbackVariable.labelItemFilename = element.files[0].name;;
        });
    }
    $scope.FileNameChanged = function (element) {
        
        $scope.$apply(function () {
            
            $scope.FeedbackVariable.labelFilename = element.files[0].name;;
        });
    }
    $scope.SelectedItem = function (itemId) {
        
        var itemCode = $scope.bindallproduct.filter(function (el) { return el.OrderProductId === itemId });
        if (itemCode.length > 0) {
            $scope.FeedbackVariable.UOM = itemCode[0].UOM;
            $scope.FeedbackVariable.Quantity = itemCode[0].ProductQuantity;
        }

    }
    $scope.AddItemFeedback = function () {
        
        if ($scope.FeedbackVariable.ItemName != "") {
            if ($scope.FeedbackVariable.ItemFeedbackName != "") {


                var itemCode = $scope.bindallproduct.filter(function (el) { return el.OrderProductId === $scope.FeedbackVariable.ItemName });
                var feedbackName = $scope.bindallFeedbak.filter(function (el) { return el.LookUpId === $scope.FeedbackVariable.ItemFeedbackName });
                var documentName = "";
                var documentBase64 = "";
                var documentExtension = "";
                if ($scope.fileupload.ItemFile != "") {
                    documentName = $scope.fileupload.ItemFile.dataFile.name;
                    documentBase64 = $scope.fileupload.ItemFile.dataBase64;
                    documentExtension = $scope.fileupload.ItemFile.dataFile.name.split('.')[1];
                } else {
                    documentName = "";
                    documentBase64 = "";
                    documentExtension = "";
                }


                var itemFeedback = {
                    OrderItemFeedbackGUID: generateGUID(),
                    OrderId: $scope.labelOrderId,
                    OrderProductId: $scope.FeedbackVariable.ItemName,
                    ProductCode: itemCode[0].ProductCode,
                    ItemName: itemCode[0].ItemName,
                    feedbackId: $scope.FeedbackVariable.ItemFeedbackName,
                    FeedbackValue: feedbackName[0].Name,
                    Attachment: "",
                    Comment: $scope.FeedbackVariable.ItemComment,
                    UOM: itemCode[0].UOM,
                    HVBLComment: "",
                    Quantity: itemCode[0].ProductQuantity,
                    CreatedBy: $rootScope.UserId,
                    DocumentName: documentName,
                    DocumentsList: []
                }

                var itemDocument = {
                    DocumentName: documentName,
                    DocumentExtension: documentExtension,
                    DocumentBase64: documentBase64,
                    ObjectType: "Feedback",
                    SequenceNo: 0,
                    CreatedBy: $rootScope.UserId,
                    IsActive: 1
                }

                itemFeedback.DocumentsList.push(itemDocument);
                $scope.OrderItemFeedback.push(itemFeedback);
                $scope.ClearItemFeedback();
            } else {
                //$rootScope.ValidationErrorAlert('Please select item feedback type.', 'warning', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_SelectItemFeedback), 'warning', 3000);
            }
        } else {
            //$rootScope.ValidationErrorAlert('Please select item.', 'warning', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_SelectItem), 'warning', 3000);
        }
    }
    $ionicModal.fromTemplateUrl('templates/AddFeedback.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.AddFeedbackpopup = modal;
    });


    $scope.FeedbackPopupControl = false;

    $scope.OpenAddFeedbackpopup = function (OrderGUID) {
        

        $scope.labelOrderNumber = $rootScope.SaleOrderNumber;
        $scope.labelOrderId = $rootScope.OrderId;

        var requestData =
            {
                ServicesAction: 'LoadOrderProductById',
                OrderId: $scope.labelOrderId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data;
            if (resoponsedata.Json != null) {
                $scope.bindallproduct = resoponsedata.Json.OrderProductList;
            }

            var requestDatajson =
                {
                    ServicesAction: 'LoadFeedbackByOrderId',
                    OrderId: $scope.labelOrderId
                };

            var jsonobjectdata = {};
            jsonobjectdata.Json = requestDatajson;
            GrRequestService.ProcessRequest(jsonobjectdata).then(function (response) {
                
                var resoponsedata = response.data;

                if (resoponsedata.Json != undefined) {
                    $scope.OrderFeedbackListJson = resoponsedata.Json.OrderFeedbackList;
                } else {
                    $scope.OrderFeedbackListJson = [];
                }

                $scope.FeedbackPopupControl = true;
                //$scope.AddFeedbackpopup.show();
            });
        });

        $scope.bindallFeedbak = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'CustomerFeedback'; });
    }
    $scope.CloseAddFeedbackpopup = function () {
        
        //$scope.AddFeedbackpopup.hide();
        $scope.FeedbackPopupControl = false;
    }
    $scope.setoverall = function () {
        $scope.FeedbackVariable.OverAll = true;
        $scope.FeedbackVariable.Specific = false;
    }
    $scope.setspecific = function () {
        $scope.FeedbackVariable.Specific = true;
        $scope.FeedbackVariable.OverAll = false;
    }
    $scope.RemoveFeedbackForItem = function (orderItemFeedbackGUID) {
        
        $scope.OrderItemFeedback = $scope.OrderItemFeedback.filter(function (el) { return el.OrderItemFeedbackGUID !== orderItemFeedbackGUID; });
    }
    $scope.DownloadDocument = function (DocumentsId, OrderFeedbackId, documentName, extension) {
        

        
        var orderRequestData =
            {

                ServicesAction: 'LoadOrderFeedbackByOrderId',
                OrderFeedbackId: OrderFeedbackId

            }
        var jsonobject = {};
        jsonobject.Json = orderRequestData;
        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
            
            var byteCharacters1 = response.data;
            if (response.data != undefined) {


                var byteCharacters = response.data;


                var blob = new Blob([byteCharacters], {
                    type: "application/" + extension
                });
                if (blob.size > 0) {

                    
                    var filName = documentName;
                    saveAs(blob, filName);
                } else {
                    //$rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_DocumentNotGenerated), '', 3000);
                }
            } else {
                //$rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_DocumentNotGenerated), '', 3000);
            }


        });




    }
    $scope.FileSize = false;
    $scope.FileType = false;
    $scope.SaveFeedBackJson = function () {
        
        if ($scope.FeedbackVariable.Name != "") {

            var documentName = "";
            var documentBase64 = "";
            var documentExtension = "";
            if ($scope.fileupload.File != "") {
                if ($scope.fileupload.File.dataFile.size > 2048000) {
                    $scope.FileSize = true;
                    documentName = $scope.fileupload.File.dataFile.name;
                    documentBase64 = $scope.fileupload.File.dataBase64;
                    documentExtension = $scope.fileupload.File.dataFile.name.split('.')[1];
                }
                else {
                    if ($scope.fileupload.File.dataFile.type == "application/pdf" || $scope.fileupload.File.dataFile.type == "application/docx" || $scope.fileupload.File.dataFile.type == "application/doc" || $scope.fileupload.File.dataFile.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || $scope.fileupload.File.dataFile.type == "image/png") {
                        $scope.FileType = true;
                    }
                    else {
                        $scope.FileType = false;
                    }
                    $scope.FileSize = false;
                    documentName = $scope.fileupload.File.dataFile.name;
                    documentBase64 = $scope.fileupload.File.dataBase64;
                    documentExtension = $scope.fileupload.File.dataFile.name.split('.')[1];
                }
            } else {
                documentName = "";
                documentBase64 = "";
                documentExtension = "";
            }

            var itemFeedback = {
                OrderId: $scope.labelOrderId,
                OrderProductId: 0,
                feedbackId: $scope.FeedbackVariable.Name,
                Attachment: "",
                Comment: $scope.FeedbackVariable.Comment,
                HVBLComment: "",
                Quantity: 0,
                CreatedBy: $rootScope.UserId,
                DocumentsList: []
            }

            var itemDocument = {
                DocumentName: documentName,
                DocumentExtension: documentExtension,
                DocumentBase64: documentBase64,
                ObjectType: "Feedback",
                SequenceNo: 0,
                CreatedBy: $rootScope.UserId,
                IsActive: 1
            }
            itemFeedback.DocumentsList.push(itemDocument);
            $scope.OrderItemFeedback.push(itemFeedback);
        } else {

        }
        if ($scope.FileSize == false) {
            if ($scope.FileType == true) {
                if ($scope.OrderItemFeedback.length > 0) {
                    var Product =
                        {
                            ServicesAction: 'Savefeedback',
                            OrderFeedbackList: $scope.OrderItemFeedback

                        }
                    
                    var jsonobject = {};
                    jsonobject.Json = Product;
                    
                    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                        
                        var resoponsedata = response.data;
                        $scope.AddFeedbackpopup.hide();
                        $scope.reset();
                        //$rootScope.ValidationErrorAlert('Feedback saved successfully.', 'success', 3000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_SaveFeedback), 'success', 3000);
                    });
                } else {
                    //$rootScope.ValidationErrorAlert('Please Add Feedback.', 'success', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_AddFeedback), 'success', 3000);
                }
            }
            else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_FileType), 'success', 3000);
            }
        }
        else {
            $scope.OrderItemFeedback = [];
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_FileSize), 'success', 3000);
        }
    }
    $scope.ClearItemFeedback = function () {
        
        $scope.FeedbackVariable.ItemName = "";
        $scope.FeedbackVariable.Quantity = "";
        $scope.FeedbackVariable.UOM = "";
        $scope.FeedbackVariable.ItemFeedbackName = "";
        $scope.FeedbackVariable.labelItemFilename = "";
        $scope.FeedbackVariable.ItemComment = "";
        $scope.fileupload.ItemFile = "";
        $scope.FeedbackVariable.labelItemFilename = "";
        angular.element("input[type='file']").val(null);
    }
    $scope.reset = function () {
        $scope.FeedbackVariable.Quantity = "";
        $scope.FeedbackVariable.Comment = "";
        $scope.FeedbackVariable.HVBLComment = "";
        $scope.FeedbackVariable.Name = "";
        $scope.FeedbackVariable.ProductCode = "";
        $scope.labelOrderId = "";
        $scope.labelFilename = "";
        $scope.fileupload.File = "";
        $scope.fileupload.ItemFile = "";
        $scope.OrderItemFeedback = [];
        $scope.FeedbackVariable.OverAll = true;
        $scope.FeedbackVariable.Specific = false;
        $scope.FeedbackVariable.labelFilename = "";
        angular.element("input[type='file']").val(null);
        $scope.ClearItemFeedback();

    }

    $scope.LoadEmptiesMessage = function (message, param1, param2) {
        return String.format(message, param1, param2);
    }

    $scope.NoteVariable = {
        NoteText: ''
    }

    $scope.AddNotesModalPopup = function () {
        $scope.NotesModalPopupControl = false;
    }
    $scope.AddNotesModalPopup();
    $scope.OpenAddNotesModalPopup = function (orderGuId) {
        
        $scope.NotesOrderGuId = orderGuId;
        if ($scope.SaveNoteText !== "" && $scope.SaveNoteText !== undefined) {
            $scope.NoteVariable.NoteText = $scope.SaveNoteText;
        } else {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === orderGuId; });
            if (currentOrder.length > 0) {
                if (currentOrder[0].NoteList != undefined) {
                    if (currentOrder[0].NoteList.length > 0) {
                        $scope.NoteVariable.NoteText = currentOrder[0].NoteList[0].Note;
                    } else {
                        $scope.NoteVariable.NoteText = "";
                    }
                } else { $scope.NoteVariable.NoteText = ""; }
            } else {
                $scope.NoteVariable.NoteText = "";
            }
        }
        $scope.NotesModalPopupControl = true;
    }
    $scope.CloseAddNotesModalPopup = function () {
        
        $scope.NotesOrderGuId = 0;

        $scope.NotesModalPopupControl = false;
    }



    $scope.SaveNote = function () {
        
        if ($scope.NoteVariable.NoteText !== "") {

            $scope.NotesListData = [];
            $scope.NoteId === 0

            if ($rootScope.EnquiryDetailId !== undefined && $rootScope.EnquiryDetailId !== null && $rootScope.EnquiryDetailId !== 0) {

                var NoteJson = {
                    RoleId: $rootScope.RoleId,
                    ObjectId: $rootScope.EnquiryDetailId,
                    ObjectType: 1220,
                    Note: $scope.NoteVariable.NoteText,
                    CreatedBy: $rootScope.UserId
                }

                $scope.NotesListData.push(NoteJson);

                $scope.SaveNoteText = $scope.NoteVariable.NoteText;

                var Note =
                    {
                        ServicesAction: "SaveNotes",
                        NoteList: $scope.NotesListData
                    }

                var jsonobject = {};
                jsonobject.Json = Note;

                

                GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryPage_NotesUpdated), 'error', 3000);
                });

            } else {
                var NoteJson = {
                    RoleId: $rootScope.RoleId,
                    ObjectId: 0,
                    ObjectType: 1220,
                    Note: $scope.NoteVariable.NoteText,
                    CreatedBy: $rootScope.UserId
                }

                $scope.NotesListData.push(NoteJson);

                var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.NotesOrderGuId; });
                if (currentOrder.length > 0) {
                    currentOrder[0].NoteList = $scope.NotesListData;
                }
            }

            $scope.NotesModalPopupControl = false;
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_NoteEnterValidation), 'error', 3000);
        }
    }







}).filter('multipleTags', function ($filter, $rootScope) {
    return function multipleTags(items, predicates) {


        predicates = predicates.split(' ')

        angular.forEach(predicates, function (predicate) {
            items = $filter('filter')(items, { ItemNameCode: predicate.trim() });
        })

        if (items != undefined) {
            if (items.length === 0) {
                $rootScope.foundResult = true;
            }
            else {
                $rootScope.foundResult = false;
            }
        } else {
            $rootScope.foundResult = false;
        }

        return items;
    }





});
