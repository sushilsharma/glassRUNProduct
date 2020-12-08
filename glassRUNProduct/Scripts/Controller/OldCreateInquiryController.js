angular.module("glassRUNProduct").controller('CreateInquiryController', function ($scope, $rootScope, $filter, $location, $sessionStorage, $ionicModal, $state, focus, pluginsService, EnquiryService, GrRequestService) {
    debugger;
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $rootScope.GridRecallForStatus = function () {
        debugger;
        $rootScope.Throbber.Visible = false;
    }

    if ($rootScope.IsEnquiryEditedByCustomerService == true) {
        $scope.TempCompanyId = $rootScope.TempCompanyId;
        $scope.TempCompanyMnemonic = $rootScope.TempCompanyMnemonic;


    }
    else {
        $scope.TempCompanyId = $rootScope.CompanyId;
        $scope.TempCompanyMnemonic = $rootScope.CompanyMnemonic;
    }



    $scope.AddNewTruckFunction = function (e) {
        debugger;
        if (e.charCode === 13) {
            $scope.AddTruck();
            focus('RemoveEnterEvent');
        }
    }
    $scope.ValidationErrorReceivingLocation = "";
    $scope.IsSelfCollect = true;
    $scope.PromotionItemList = [];
    $scope.NumberOfProductAdd = 7;
    $scope.WoodenPalletCode = '0';
    $scope.AreaPalettesCount = 0;
    $scope.EnquiryId = 0;
    $rootScope.totalorderamount = 0;
    $scope.SelectedAssociatedOrder = [];
    $scope.AssociatedOrderList = [];
    $scope.IsPromotion = false;
    $scope.tempDeliveryUsedCapacity = 0;
    $scope.DeliveryUsedCapacity = 0;
    $scope.DeliveryLocationCapacity = 0;
    $scope.TruckCapacityFullInPercentage = 0;
    $scope.TruckCapacityInTone = 0;
    $scope.TruckCapacityFullInTone = 0;
    $scope.buindingPalettes = [];
    $scope.bindAllSettingMaster = [];
    $scope.TruckSizeId = 0;
    $scope.DeliveryLocationId = 0;
    $scope.DeliveryLocationCode = '0';
    $scope.ItemPrices = 0;
    $scope.Allocation = 'NA';
    $scope.ActualAllocation = 'NA';
    $scope.UOM = '-';
    $scope.IsItemEdit = false;
    $scope.IsPalettesRequired = false;
    $scope.PalettesBufferWeight = 0;
    $scope.PalettesCorrectWeight = 0;
    $scope.EmptiesLimitMessage = '';
    $scope.EmptiesCss = true;
    $scope.bindAllSettingMaster = $sessionStorage.AllSettingMasterData;
    $scope.EmptiesAmount = 0;
    $scope.ItemTaxInPec = 0;


    $scope.TruckSizeId = 0;
    $scope.TruckSize = 0;
    $scope.TruckCapacity = 0;
    $scope.TruckCapacityInTone = 0;
    $scope.TruckCapacityFullInTone = 0;
    $scope.TruckCapacityFullInPercentage = 0;

    $scope.TruckExceedBufferWeight = 0;
    $scope.PalettesExceedBufferWeight = 0;

    //$rootScope.CreditLimit = 1000000000;
    //$rootScope.AvailableCreditLimit = 1000000000;
    //$rootScope.EmptiesLimit = 0;
    //$rootScope.ActualEmpties = 0;

    ///////1

    var EmptiesAmountLength = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'EmptiesAmount'; });
    if (EmptiesAmountLength.length > 0) {
        $scope.EmptiesAmount = parseFloat(EmptiesAmountLength[0].SettingValue);
    }


    var itemTaxInPec = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ItemTaxInPec'; });
    if (itemTaxInPec.length > 0) {
        $scope.ItemTaxInPec = parseFloat(itemTaxInPec[0].SettingValue);
    }

    debugger;

    if ($rootScope.TempEnquiryDetailId === undefined) {
        $rootScope.TempEnquiryDetailId = 0;
    }


    if ($rootScope.TempEnquiryDetailId === 0) {

        var requestData =
            {

                ServicesAction: 'GetCreditLimitFromThirthParty',

                CompanyId: $scope.TempCompanyId,
                CompanyMnemonic: $scope.TempCompanyMnemonic
            };
        // var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            // var resoponsedata = JSON.parse(JSON.parse(response.data));


            if (response.data !== null) {
                if (response.data.Json != undefined || response.data.Json != null) {
                    var resoponsedata = response.data.Json;

                    $rootScope.CreditLimit = resoponsedata.CreditLimit;
                    $rootScope.AvailableCreditLimit = resoponsedata.AvailableCreditLimit;
                    $rootScope.EmptiesLimit = 0;
                    $rootScope.ActualEmpties = 0;
                } else {
                    $rootScope.AvailableCreditLimit = 0;
                }
            } else { $rootScope.AvailableCreditLimit = 0; }



            requestData =
                {
                    ServicesAction: 'LoadAvailableCreditLimitOfCustomer',
                    CompanyId: $scope.TempCompanyId,
                    EnquiryId: 0
                };



            jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                debugger;
                // var resoponsedata = JSON.parse(JSON.parse(response.data));

                $rootScope.EnquiryDetailId = 0;
                var resoponsedata = response.data.Json;
                $rootScope.EmptiesLimit = resoponsedata.EmptiesLimit;
                $rootScope.ActualEmpties = resoponsedata.ActualEmpties;

                debugger;
                $rootScope.AvailableCreditLimit = Number($rootScope.AvailableCreditLimit) - Number(resoponsedata.TotalEnquiryCreated);

                $rootScope.AvailableCreditLimit = Number($rootScope.AvailableCreditLimit) - Number(resoponsedata.EnquiryTotalDepositAmount);

                //alert($rootScope.EnquiryDetailId);
                //alert($rootScope.AvailableCreditLimit);
                //alert(resoponsedata.TotalEnquiryCreated);
                //alert(resoponsedata.EnquiryTotalDepositAmount);

                if (Number($rootScope.ActualEmpties) > 0) {

                    var emptiesNum = $rootScope.ActualEmpties.toString().replace("-", "");
                    var emptiesValue = (Number($rootScope.ActualEmpties) * $scope.EmptiesAmount).toString().replace("-", "");

                    $scope.EmptiesCss = false;
                    $scope.EmptiesLimitMessage = 'You have ' + emptiesNum + ' empties overdue for returns. Please arrange to return the empties or deposit ( ₫ ' + emptiesValue + ' ) to ensure your order gets processed.';

                }
                else {

                    $scope.EmptiesLimitMessage = 'You can order for ' + $rootScope.ActualEmpties + ' more crate/keg before you exhaust your empties limit.';
                    $scope.EmptiesCss = true;

                }



            });


        });
    }
    else {
        $rootScope.EnquiryDetailId = 0;
    }




    ///2
    debugger;
    var requestData =
        {
            ServicesAction: 'LoadAllDeliveryLocation',
            CompanyId: $scope.TempCompanyId
        };

    // var stringfyjson = JSON.stringify(requestData);
    var jsonobject = {};
    jsonobject.Json = requestData;
    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        debugger;
        $scope.PromotionItemList = [];
        // var resoponsedata = JSON.parse(JSON.parse(response.data));
        var resoponsedata = response.data;


        if (resoponsedata != null) {
            if (resoponsedata.DeliveryLocation !== undefined) {

                $scope.bindDeliverylocation = resoponsedata.DeliveryLocation.DeliveryLocationList;

                if ($scope.bindDeliverylocation.length == 1) {
                    $scope.DeliveryLocationCapacity = 0;
                    $scope.DeliveryArea = '';
                    debugger;
                    $scope.DeliveryLocationId = $scope.bindDeliverylocation[0].DeliveryLocationId;
                    $scope.DeliveryLocationCode = $scope.bindDeliverylocation[0].DeliveryLocationCode;
                    $scope.LoadAssociatedOrder($scope.DeliveryLocationId);
                    //var deliveryObjDetailsSelected = $scope.bindDeliverylocation.filter(function (el) { return el.IsDeliveryLocationSelected === true });
                    //if (deliveryObjDetailsSelected.length > 0) {
                    //    deliveryObjDetailsSelected[0].IsDeliveryLocationSelected = false;
                    //}

                    var deliveryObjDetails = $scope.bindDeliverylocation.filter(function (el) { return el.DeliveryLocationId === $scope.DeliveryLocationId });
                    if (deliveryObjDetails.length > 0) {

                        $scope.DeliveryArea = deliveryObjDetails[0].Area;

                        debugger;

                        var requestPromotionData =
                            {
                                ServicesAction: 'GetPromotionFocItemList',
                                CompanyId: $scope.TempCompanyId,
                                Region: $scope.DeliveryArea
                            };

                        //var stringfyjson = JSON.stringify(requestData);
                        var jsonPromotionobject = {};
                        jsonPromotionobject.Json = requestPromotionData;
                        GrRequestService.ProcessRequest(jsonPromotionobject).then(function (Promotionresponse) {
                            debugger;

                            var resoponsedata = Promotionresponse.data;
                            if (resoponsedata.PromotionFocItemDetail !== undefined) {
                                $scope.PromotionItemList = resoponsedata.PromotionFocItemDetail.PromotionFocItemDetailList;
                            }


                        });



                        $scope.DeliveryLocationName = deliveryObjDetails[0].DeliveryLocationName;
                        $scope.DeliveryLocationCapacity = deliveryObjDetails[0].Capacity;
                        //if (deliveryObjDetails[0].IsDeliveryLocationSelected) {
                        //    deliveryObjDetails[0].IsDeliveryLocationSelected = false;
                        //}
                        //else {
                        deliveryObjDetails[0].IsDeliveryLocationSelected = true;
                        //}
                    }

                    $scope.LoadTruckSizeBelongsToLoactionIdAndCompanyId($scope.DeliveryLocationId);




                } else {
                    $rootScope.Throbber.Visible = false;
                }
            }
            else {
                $rootScope.Throbber.Visible = false;
                //$rootScope.ValidationErrorAlert('There is no shipping location set up for your login. Please contact the system administrator for further assistance.', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_noShippingLocationContactSystemAdminstrator), 'error', 8000);

            }
        }
        else {
            $rootScope.Throbber.Visible = false;
            //$rootScope.ValidationErrorAlert('There is no shipping location set up for your login. Please contact the system administrator for further assistance.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_noShippingLocationContactSystemAdminstrator), 'error', 8000);

        }

    });





    //3

    var requestData =
        {
            ServicesAction: 'LoadAllProducts',
            CompanyId: $scope.TempCompanyId
        };

    //var stringfyjson = JSON.stringify(requestData);
    var jsonobject = {};
    jsonobject.Json = requestData;
    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        debugger;
        var resoponsedata = response.data;
        $scope.bindallproduct = resoponsedata.Item.ItemList;
    });

    debugger;
    if ($rootScope.SelfCollectValue === "SCO") {
        $scope.IsSelfCollect = true;
    }
    else {
        $scope.IsSelfCollect = false;
    }
    //var requestData =
    //    {
    //        ServicesAction: 'GetAllCompanyListById',
    //        CompanyId: $scope.TempCompanyId
    //    };

    ////var stringfyjson = JSON.stringify(requestData);
    //var jsonobject = {};
    //jsonobject.Json = requestData;
    //GrRequestService.ProcessRequest(jsonobject).then(function (response) {
    //    debugger;
    //    var resoponsedata = response.data;
    //    var companyListData = resoponsedata.Json.CompanyList;
    //    if (companyListData != undefined) {
    //        $scope.SelfCollectValue = companyListData[0].Field1;

    //        if ($scope.SelfCollectValue === "SCO") {
    //            $scope.IsSelfCollect = true;
    //        }
    //        else {
    //            $scope.IsSelfCollect = false;
    //        }
    //    }
    //});






    var PalettesBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesBufferWeight'; });
    if (PalettesBufferWeight.length > 0) {
        $scope.PalettesBufferWeight = parseFloat(PalettesBufferWeight[0].SettingValue);
    }


    var TruckExceedBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'TruckExceedBufferWeight'; });
    if (TruckExceedBufferWeight.length > 0) {
        $scope.TruckExceedBufferWeight = parseFloat(TruckExceedBufferWeight[0].SettingValue);
    }


    var PalettesExceedBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesExceedBufferWeight'; });
    if (PalettesExceedBufferWeight.length > 0) {
        $scope.PalettesExceedBufferWeight = parseFloat(PalettesExceedBufferWeight[0].SettingValue);
    }




    function AllowNumber(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    $scope.RemoveSelectedAssociatedOrder = function () {

        debugger;
        var getSelectedAssociatedOrder = [];
        var totalorderamount = 0;
        var totaltaxamount = 0;
        var TotalDepositeAmount = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            //var listOfProduct = $scope.OrderData[i].OrderProductList.filter(function (el) { return parseInt(el.EnquiryProductId) === 0; });
            var listOfProduct = $scope.OrderData[i].OrderProductList;
            for (var j = 0; j < listOfProduct.length; j++) {
                if (parseInt($scope.OrderData[i].OrderProductList[j].EnquiryProductId) === 0) {
                    totalorderamount += parseFloat($scope.OrderData[i].OrderProductList[j].ItemPricesPerUnit) * parseFloat($scope.OrderData[i].OrderProductList[j].ProductQuantity);

                    TotalDepositeAmount += parseFloat($scope.OrderData[i].OrderProductList[j].ItemTotalDepositeAmount);
                }
                else {

                    if (parseInt($scope.OrderData[i].OrderProductList[j].EnquiryProductId) !== 0 && ($scope.OrderData[i].OrderProductList[j].IsActive === true || $scope.OrderData[i].OrderProductList[j].IsActive === 1 || $scope.OrderData[i].OrderProductList[j].IsActive === "1")) {
                        totalorderamount += parseFloat($scope.OrderData[i].OrderProductList[j].ItemPricesPerUnit) * parseFloat($scope.OrderData[i].OrderProductList[j].ProductQuantity);
                        TotalDepositeAmount += parseFloat($scope.OrderData[i].OrderProductList[j].ItemTotalDepositeAmount);
                    }
                }
                getSelectedAssociatedOrder.push(parseInt($scope.OrderData[i].OrderProductList[j].GratisOrderId));
            }
        }


        var getAssociatedCount = $scope.AssociatedOrderList;
        if (getSelectedAssociatedOrder.length > 0) {
            if (getAssociatedCount.length > 0) {
                for (var i = 0; i < getAssociatedCount.length; i++) {
                    debugger;
                    //var isOrderIdAvailable = getSelectedAssociatedOrder.filter(function (el) { return parseInt(el.OrderId) === parseInt(getAssociatedCount[i].OrderId); });

                    var dd = getSelectedAssociatedOrder.indexOf(parseInt(getAssociatedCount[i].OrderId));
                    if (getSelectedAssociatedOrder.indexOf(parseInt(getAssociatedCount[i].OrderId)) > -1) {
                        getAssociatedCount[i].IsSelected = true;
                    }
                    else {
                        getAssociatedCount[i].IsSelected = false;
                    }

                    //if (isOrderIdAvailable.length > 0) {
                    //    getAssociatedCount[i].IsSelected = true;
                    //}
                    //else {
                    //    getAssociatedCount[i].IsSelected = false;
                    //}
                }
            }
        }
        else {
            for (var i = 0; i < getAssociatedCount.length; i++) {

                getAssociatedCount[i].IsSelected = false;
            }
        }

        totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);

        debugger;
        $rootScope.totalorderamount = parseFloat(totalorderamount) + parseFloat(totaltaxamount) + parseFloat(TotalDepositeAmount);

    }



    $scope.LoadAssociatedOrder = function (deliveryLocationId) {
        debugger;
        var requestData =
            {
                ServicesAction: 'LoadGratisOrderBySoldToId',
                CompanyId: $scope.TempCompanyId,
                ShipTo: deliveryLocationId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var responseStr = response.data;
            if (responseStr.Order != undefined) {
                if (responseStr.Order.OrderList != '') {
                    $scope.AssociatedOrderList = responseStr.Order.OrderList;
                    $scope.RemoveSelectedAssociatedOrder();
                }
            }

        });

    }

    function UniqueArraybyId(collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };


    $scope.PrintingDocument = function () {
        debugger;
        var requestData =
            {
                ServicesAction: 'GetLoadPrinterByBranchPlantCode',
                BranchPlantCode: '1022'
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        });
    }



    $scope.GetCreditLimitOfCustomer = function () {
        debugger;

        var requestData =
            {
                ServicesAction: 'ProcessCreditLimit',
                CustomerCode: $rootScope.CustomerCode
            };

        // var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var creditLimitStr = response.data.Json.TotalCreditLimit;
            var creditAvaibleLimit = response.data.Json.AvailableCreditLimit;
            if ($scope.TotalCreditPrice != null) {
                $scope.CreditLimit = creditLimitStr;
                $scope.AvaibleLimit = parseInt($scope.CreditLimit) - parseInt(creditAvaibleLimit) - parseInt($scope.TotalCreditPrice);
            }
            else {
                $scope.CreditLimit = creditLimitStr;
                $scope.AvaibleLimit = parseInt($scope.CreditLimit) - parseInt(creditAvaibleLimit);
            }
        });
    };


    $scope.ClearGraph = function () {
        angular.forEach($scope.buindingPalettes, function (item, key) {

            item.PalettesWidth = 0;

        });
        $scope.TruckCapacityFullInTone = 0;
        $scope.TruckCapacityFullInPercentage = 0;
    }

    $scope.ViewInquiry = function () {
        debugger;
        var isTrue = true;
        if ($scope.IsSelfCollect === true) {
            if ($scope.ordermanagement.RequestDate === "") {
                isTrue = false;
            }
            else {
                isTrue = true;
            }
        }
        if (isTrue === true) {

            if ($rootScope.TemOrderData != undefined) {
                if ($rootScope.TemOrderData.length > 0) {
                    //$rootScope.TemSelectedAssociatedOrder = $scope.SelectedAssociatedOrder;
                    $rootScope.TemOrderData = $rootScope.TemOrderData.concat($scope.OrderData)
                    $rootScope.TemOrderData = UniqueArraybyId($rootScope.TemOrderData, 'OrderGUID')
                }
                else {
                    $rootScope.TemOrderData = $scope.OrderData;
                }
            }
            else {
                $rootScope.TemOrderData = $scope.OrderData;
            }
            debugger;
            for (var i = 0; i < $rootScope.TemOrderData.length; i++) {
                if ($scope.CurrentOrderGuid === $rootScope.TemOrderData[i].OrderGUID) {
                    $rootScope.TemOrderData[i].RequestDate = $scope.ordermanagement.RequestDate;
                    $rootScope.TemOrderData[i].EnquiryProductList = $rootScope.TemOrderData[i].OrderProductList;
                    $rootScope.TemOrderData[i].OrderProductsList = $rootScope.TemOrderData[i].OrderProductList;
                }

                $rootScope.TemOrderData[i].OrderProposedETD = $scope.ProposedDate;
            }



            var fullTruckCount = $rootScope.TemOrderData.filter(function (el) { return el.IsTruckFull == true; });

            if (fullTruckCount.length > 0) {
                $scope.CurrentOrderGuid = '';
                $state.go("ViewCreateInquiry");
            }
            else {

            }

        } else {
            //$rootScope.ValidationErrorAlert('Please Select Scheduling Date.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectScheduledDate), 'error', 8000);

        }


        //$location.path('/ViewCreateInquiry');
    };


    $scope.FeedbackVariable = {
        OverAll: true,
        Specific: false
    }


    setTimeout(function () {
        debugger;
        pluginsService.init();
    }, 200);


    $scope.CurrentOrderGuid = '';

    $scope.ordermanagement =
        {
            RequestDate: "",
            itemsName: 0,
            RequestDate: "",
            OrderDate: new Date()
        };

    $scope.ordermanagement.OrderDate = new Date();



    $ionicModal.fromTemplateUrl('ViewGratisOrder.html', {
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
        if ($scope.AssociatedOrderList.length > 0) {
            $scope.ViewGratisOrderControl.show();
        }
        else {
            //$rootScope.ValidationErrorAlert('No gratis order found.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_NoGratisFound), 'error', 8000);

        }

    };





    $ionicModal.fromTemplateUrl('AddTruck.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.AddTruckControl = modal;
    });



    $scope.CloseAddTruckControl = function () {
        focus('RemoveEnterEvent');
        $scope.AddTruckControl.hide();
    };

    $scope.OpenAddTruckControl = function () {
        focus('AddEnterEvent');
        var dd = $scope.AddTruckControl;
        if (!dd._isShown) {
            $scope.AddTruckControl.show();
        }
    };


    $ionicModal.fromTemplateUrl('RemoveGratisOrder.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.RemoveGratisOrderControl = modal;
    });


    $scope.CloseRemoveGratisOrderControl = function () {
        $scope.RemoveGratisOrderControl.hide();
    };

    $scope.OpenRemoveGratisOrderControl = function () {

        $scope.RemoveGratisOrderControl.show();
    };



    $ionicModal.fromTemplateUrl('WarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.WarningMessageControl = modal;
    });


    $scope.CloseWarningMessageControl = function () {
        $scope.WarningMessageControl.hide();
    };

    $scope.OpenWarningMessageControl = function () {

        $scope.WarningMessageControl.show();
    };



    // generate GUID
    function generateGUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };


    $scope.AddDefaultTruck = function () {
        debugger;

        $scope.CurrentOrderGuid = generateGUID();
        $scope.PalettesCorrectWeight = 0;
        var orders = {
            OrderGUID: $scope.CurrentOrderGuid,
            TruckName: '',
            DeliveryLocation: $scope.ordermanagement.shiptoList,
            TruckSize: $scope.ordermanagement.truckSize,
            ProposedETDStr: $scope.ProposedETDStr,
            EnquiryId: 0,
            RequestDate: $scope.ordermanagement.RequestDate,
            TotalWeight: 0,
            TruckCapacity: 0,
            TruckPallets: 0,
            TotalProductPallets: 0,
            IsTruckFull: false,
            TruckSizeId: $scope.TruckSizeId,
            ShipTo: 0,
            SoldTo: $scope.TempCompanyId,
            IsActive: true,
            EnquiryProductList: [],
            OrderProductList: []
        }
        $scope.OrderData.push(orders);

    }








    $scope.CountAddedEnquiry = function () {
        debugger;
        if ($rootScope.TemOrderData != undefined) {
            $scope.OrderCount = $rootScope.TemOrderData.length;
        }
        else {
            $scope.OrderCount = $scope.OrderData.length;
        }
    }


    var woodenPalletCode = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'WoodenPalletCode'; });
    if (woodenPalletCode.length > 0) {
        $scope.WoodenPalletCode = woodenPalletCode[0].SettingValue;
    }

    var NumberOfProductAdd = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'NumberOfProductAdd'; });
    if (NumberOfProductAdd.length > 0) {
        $scope.NumberOfProductAdd = parseInt(NumberOfProductAdd[0].SettingValue);
    }


    $scope.CloseAddFinalize = function () {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {
            currentOrder[0].IsTruckFull = true;
        }
        $scope.AddTruckControl.hide();
        $scope.ViewInquiry();
    }


    $scope.AddTruck = function () {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {
            currentOrder[0].IsTruckFull = true;
        }
        $scope.ClearGraph();
        $scope.AddTruckControl.hide();
        $scope.AddDefaultTruck();
        //$scope.addProducts($scope.trmpProductId);
        $scope.trmpProductId = 0;
    }




    $ionicModal.fromTemplateUrl('templates/SaveRecord.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.SaveSucessfulpopup = modal;
    });



    $scope.OpenSuccessfulSavepopup = function () {
        debugger;

        $scope.SaveSucessfulpopup.show();
    }

    $scope.CloseSuccessfulSavePopup = function () {
        debugger;
        $scope.SaveSucessfulpopup.hide();
    }

    //debugger;
    //var requestData =
    //            {
    //                ServicesAction: 'GetAllTruckSizeList',
    //            };

    //var stringfyjson = JSON.stringify(requestData);
    //var jsonobject = {};
    //jsonobject.Json = stringfyjson;
    //GrRequestService.ProcessRequest(jsonobject).then(function (response) {
    //    debugger;

    //    var resoponsedata = JSON.parse(JSON.parse(response.data));
    //    $scope.bindTruckSize = resoponsedata.TruckSize.TruckSizeList;
    //});

    //$scope.getTruckCapacity = function (truckId) {
    //    debugger;
    //    var truckSizeDetails = $scope.bindTruckSize.filter(function (el) { return el.TruckSizeId === truckId });
    //    if (truckSizeDetails.length > 0) {
    //        $scope.TruckCapacity = truckSizeDetails[0].TruckCapacityWeight;

    //    }
    //}

    $scope.GetReceivingLocationBalanceCapacity = function (deliverylocationId, proposedDeliveryDate) {
        debugger;
        var requestData =
            {
                ServicesAction: 'GetReceivingLocationBalanceCapacity',
                CompanyId: $scope.TempCompanyId,
                ShipTo: deliverylocationId,
                ProposedDeliveryDate: proposedDeliveryDate,
                EnquiryId: $scope.EnquiryId,
            };

        // var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            // var resoponsedata = JSON.parse(JSON.parse(response.data));
            var resoponsedata = response.data.Json.BalanceCapacity;

            $scope.DeliveryUsedCapacity = resoponsedata;

        });
    }


    $scope.GetRuleSelectedValue = function (requestData) {
        $scope.AreaPalettesCount = 0
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var responseStr = response.data.Json;

            if (responseStr.RuleValue != '' || responseStr.RuleValue != undefined) {
                var rulevalue = parseInt(responseStr.RuleValue);
                $scope.AreaPalettesCount = rulevalue;

                var truckObjDetails = $scope.bindTruckSize.filter(function (el) { return el.TruckSizeId === $scope.TruckSizeId });

                if (truckObjDetails.length > 0) {

                    if ($scope.AreaPalettesCount > 0) {

                        $scope.TruckCapacityPalettes = $scope.AreaPalettesCount;
                        truckObjDetails[0].TruckCapacityPalettes = $scope.AreaPalettesCount;
                    }
                }
            }
        });

    }






    $scope.getDeliverylocationSelectValue = function (deliverylocationId) {

        //if ($scope.bindDeliverylocation.length > 1) {
        debugger;
        $scope.PromotionItemList = [];
        $scope.DeliveryArea = '0';
        $scope.DeliveryLocationCapacity = 0;
        $scope.TruckSizeId = 0;
        $scope.DeliveryLocationId = deliverylocationId;

        $scope.LoadAssociatedOrder(deliverylocationId);

        debugger;
        var deliveryObjDetailsSelected = $scope.bindDeliverylocation.filter(function (el) { return el.IsDeliveryLocationSelected === true });
        if (deliveryObjDetailsSelected.length > 0) {

            deliveryObjDetailsSelected[0].IsDeliveryLocationSelected = false;
        }

        var deliveryObjDetails = $scope.bindDeliverylocation.filter(function (el) { return el.DeliveryLocationId === deliverylocationId });
        if (deliveryObjDetails.length > 0) {

            $scope.DeliveryArea = deliveryObjDetails[0].Area;
            $scope.DeliveryLocationCode = deliveryObjDetails[0].DeliveryLocationCode;


            var requestPromotionData =
                {
                    ServicesAction: 'GetPromotionFocItemList',
                    CompanyId: $scope.TempCompanyId,
                    Region: $scope.DeliveryArea
                };

            //var stringfyjson = JSON.stringify(requestData);
            var jsonPromotionobject = {};
            jsonPromotionobject.Json = requestPromotionData;
            GrRequestService.ProcessRequest(jsonPromotionobject).then(function (Promotionresponse) {
                debugger;


                var resoponsedata = Promotionresponse.data;
                if (resoponsedata.PromotionFocItemDetail !== undefined) {
                    $scope.PromotionItemList = resoponsedata.PromotionFocItemDetail.PromotionFocItemDetailList;
                }

            });




            $scope.DeliveryLocationName = deliveryObjDetails[0].DeliveryLocationName;
            $scope.DeliveryLocationCapacity = deliveryObjDetails[0].Capacity;

            //if (deliveryObjDetails[0].IsDeliveryLocationSelected) {
            //    deliveryObjDetails[0].IsDeliveryLocationSelected = false;
            //}
            //else {
            deliveryObjDetails[0].IsDeliveryLocationSelected = true;

            $scope.LoadTruckSizeBelongsToLoactionIdAndCompanyId(deliverylocationId);


            $scope.CalculateDeliveryUsedCapacity();

            //}
            //}



        }
    }



    //debugger;

    //var requestSettingData =
    //      {
    //          ServicesAction: 'LoadAllSettingMaster',
    //          CompanyId: $scope.TempCompanyId
    //      };

    ////var stringfyjson = JSON.stringify(requestData);
    //var jsonSettingobject = {};
    //jsonSettingobject.Json = requestSettingData;
    //GrRequestService.ProcessRequest(jsonSettingobject).then(function (response) {
    //    debugger;
    //    var resoponsedata = response.data;
    //    $scope.bindAllSettingMaster = resoponsedata.SettingMaster.SettingMasterList;


    //});










    $scope.getTotalAmount = function (weight, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {
        debugger;

        var total = 0;
        if (currentOrder.length > 0) {
            for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {

                if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
                    total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
                }

                //if (currentOrder[0].OrderProductList[i].ItemId !== itemId) {
                //    total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
                //}
                //else if (currentOrder[0].OrderProductList[i].ItemId === itemId && parseInt(currentOrder[0].OrderProductList[i].ItemType) !== parseInt(ItemType)) {
                //    total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
                //}
                //else if (parseInt(currentOrder[0].OrderProductList[i].GratisOrderId) !== 0) {
                //    if (parseInt(currentOrder[0].OrderProductList[i].GratisOrderId) !== parseInt(GratisOrderId)) {
                //        total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
                //    }
                //}
            }

            total += parseFloat(weight) * parseFloat(quantity);
        }
        return total;
    }




    $scope.CheckAllocation = function (Allocation, quantity, currentOrder, itemId) {
        debugger;
        var allowAllocatio = false;
        var total = 0;


        //for (var i = 0; i < currentOrder.length; i++) {

        //    var productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return el.ItemId === itemId; });
        //    debugger;
        //    if (productNameStrupdate.length > 0) {

        //        for (var j = 0; j < productNameStrupdate.length; j++) {
        //            total += parseFloat(productNameStrupdate[j].ProductQuantity);
        //        }

        //    }

        //}



        //if (!$scope.IsItemEdit) {
        total += parseFloat(quantity);
        //}


        if (Allocation >= total) {
            allowAllocatio = true;
        }

        if (Allocation == 'NA') {
            allowAllocatio = true;
        }

        return allowAllocatio;
    }



    $scope.RemoveKegePalleter = function (currentOrder) {
        var ProductArray = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode; });

        //var grouped = _.groupBy(ProductArray, 'ItemId');

        var result = _.pluck(ProductArray, 'PrimaryUnitOfMeasure');
        var uniques = _.uniq(result);


        if (uniques.length === 1) {

            var productUMO = uniques[0];

            var requestData =
                {
                    ServicesAction: 'GetRuleValue',
                    CompanyId: $scope.TempCompanyId,
                    CompanyMnemonic: $scope.TempCompanyMnemonic,
                    RuleType: 6,
                    UOM: productUMO
                };


            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                debugger;
                var responseStr = response.data.Json;

                if (responseStr.RuleValue != '' || responseStr.RuleValue != undefined) {
                    if (responseStr.RuleValue.length > 0) {

                        var val = parseInt(responseStr.RuleValue);
                        var ProductArray = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode == $scope.WoodenPalletCode; });

                        if (ProductArray.length > 0) {
                            ProductArray[0].ProductQuantity = parseInt(ProductArray[0].ProductQuantity) - val;
                            currentOrder[0].NumberOfPalettes = ProductArray[0].ProductQuantity;
                        }

                        $scope.ReloadGraph(currentOrder, val);
                    }

                }

            });
        }

    }


    $scope.AddExtraPalleter = function (currentOrder, enquiryProductGuid, ConversionFactor, qty, PrimaryUnitOfMeasure) {

        debugger;
        var TotalPalettes = 0;
        if (currentOrder.length > 0) {
            var newArr = [];
            var productList = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode && el.EnquiryProductGUID !== enquiryProductGuid; });
            $.each(productList, function (index, element) {
                if (newArr[element.PrimaryUnitOfMeasure] == undefined) {
                    newArr[element.PrimaryUnitOfMeasure] = 0;
                }
                newArr[element.PrimaryUnitOfMeasure] += parseFloat(element.ProductQuantity) / parseFloat(element.ConversionFactor);
            });


            if (PrimaryUnitOfMeasure !== '' && PrimaryUnitOfMeasure !== undefined) {

                if (newArr[PrimaryUnitOfMeasure] == undefined) {
                    newArr[PrimaryUnitOfMeasure] = 0;
                }

                newArr[PrimaryUnitOfMeasure] += parseFloat(qty) / parseFloat(ConversionFactor);
            }


            for (var name in newArr) {
                debugger;
                var value = newArr[name];
                newArr[name] = Math.ceil(value);
                TotalPalettes += Math.ceil(value);
            }

        }
        return TotalPalettes;
        //var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, '');

        //var totalWeightWithPalettes = 0;
        //var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
        //if (palettesWeight.length > 0) {
        //    var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
        //    if ($scope.IsPalettesRequired) {
        //        totalWeightWithPalettes = (weightPerPalettes * (TotalPalettes));
        //    }
        //    totalWeight = totalWeight + totalWeightWithPalettes
        //}


        //currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(TotalPalettes) + parseFloat(TotalExtraPalettes));
        //currentOrder[0].TruckWeight = (totalWeight / 1000);


        //$scope.TruckCapacityFullInTone = (totalWeight / 1000);
        //$scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);


        //if ($scope.IsPalettesRequired) {

        //    var otherItem = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode });
        //    if (otherItem.length > 0) {
        //        $scope.AddWoodenPallet();
        //    }
        //}


    }




    $scope.getTotalExtraPalettes = function (palettes, quantity, currentOrder, itemId, NumberOfExtraPalettes, ItemType, enquiryProductGuid) {
        debugger;




        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {

            if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode && currentOrder[0].OrderProductList[i].NumberOfExtraPalettes > 0) {
                var totalPalets = parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
                //total += (Math.ceil(totalPalets) / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
                total += (totalPalets / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
            }

            //if (currentOrder[0].OrderProductList[i].ItemId !== itemId && parseInt(currentOrder[0].OrderProductList[i].ItemType) !== parseInt(ItemType) && currentOrder[0].OrderProductList[i].NumberOfExtraPalettes > 0) {
            //    var totalPalets = parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);

            //    total += (Math.ceil(totalPalets) / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
            //}
            //else {
            //    if (parseInt(ItemType) === 32) {
            //        if (currentOrder[0].OrderProductList[i].ItemId !== itemId && currentOrder[0].OrderProductList[i].NumberOfExtraPalettes > 0) {
            //            var totalPalets = parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);

            //            total += (Math.ceil(totalPalets) / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
            //        }
            //    }
            //}
        }

        //if (!$scope.IsItemEdit) {
        if (NumberOfExtraPalettes > 0) {
            if (parseFloat(quantity) > 0) {
                var totalPalets = parseFloat(quantity) / parseFloat(palettes);

                //total += (Math.ceil(totalPalets) / NumberOfExtraPalettes);
                total += (totalPalets / NumberOfExtraPalettes);
            }
        }

        //}







        //total = total > 1 ? total : 0;



        if ($scope.TruckCapacityPalettes == 0) {
            total = -1;
        }


        if (!$scope.IsPalettesRequired) {
            total = 0;
        }


        return total;
    }


    $scope.getTotalPalettes = function (palettes, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {
        debugger;

        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {


            if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
                total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            }

            //if (currentOrder[0].OrderProductList[i].ItemId !== itemId && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
            //    total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            //}
            //else if (currentOrder[0].OrderProductList[i].ItemId === itemId && parseInt(currentOrder[0].OrderProductList[i].ItemType) !== parseInt(ItemType) && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
            //    total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            //}
            //else if (parseInt(currentOrder[0].OrderProductList[i].GratisOrderId) !== 0 && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
            //    if (parseInt(currentOrder[0].OrderProductList[i].GratisOrderId) !== parseInt(GratisOrderId)) {
            //        total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            //    }
            //}
        }

        //if (!$scope.IsItemEdit) {
        if (parseFloat(quantity) > 0) {
            total += parseFloat(quantity) / parseFloat(palettes);
        }
        //}

        debugger;




        if ($scope.TruckCapacityPalettes == 0) {
            total = 0;
        }

        if (!$scope.IsPalettesRequired) {
            total = 0;
        }


        return total;
    }


    function my_rounded_number(number, decimal_places) {
        x = number * window.Math.pow(10, decimal_places)
        x = window.Math.round(x)
        return x * window.Math.pow(10, -decimal_places)
    }

    function between(x, min, max) {
        return x >= min && x <= max;
    }


    $scope.CheckWetherTruckIsFull = function (currentOrder, totalWeightWithBuffer, truckSize, palettesWeight, totalWeightWithPalettes, ItemType) {
        debugger;


        var isFull = false;

        var totalpalettesWeight = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            if (currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
                totalpalettesWeight += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            }
        }

        var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');


        $scope.PalettesCorrectWeight = parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes);

        totalpalettesWeight = Math.ceil(parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes));



        var totaltruckWeight = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            totaltruckWeight += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
        }


        var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, '', 0, 0, '');
        var totalWeightWithPalettes = 0;
        var palettesWeight1 = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
        if (palettesWeight1.length > 0) {
            var weightPerPalettes = parseFloat(palettesWeight1[0].SettingValue);
            if ($scope.IsPalettesRequired) {
                totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes));
            }
            totaltruckWeight = totaltruckWeight + totalWeightWithPalettes
        }

        var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
        var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();

        $scope.ReloadGraph(currentOrder, 0);

        if ($scope.IsPalettesRequired) {
            debugger;
            //if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= truckSize) || parseInt(palettesWeight) === Math.ceil(totalpalettesWeight)) {
            var pallet = between(parseFloat($scope.PalettesCorrectWeight), (parseFloat(palettesWeight) - parseFloat($scope.PalettesBufferWeight)), parseFloat(parseFloat(palettesWeight) + parseFloat(extraPaletteBufferWeight)));
            if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight)) || pallet) {
                //$scope.RemoveKegePalleter(currentOrder);

                isFull = true;
            }

        }
        else {
            if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight))) {
                //$scope.RemoveKegePalleter(currentOrder);

                isFull = true;
            }
        }

        return isFull;
    }

    $scope.AddInquiry = function () {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {
            if (currentOrder[0].OrderProductList.length > 0) {


                var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
                if (currentOrder.length > 0) {
                    if (currentOrder[0].OrderProductList.length > 0) {

                        var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, '');
                        var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');
                        var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');


                        var truckcapcityintons = parseFloat(parseFloat($scope.TruckCapacity) / 1000);

                        if (parseFloat($scope.TruckCapacity) < totalWeight) {

                            currentOrder[0].IsTruckFull = false;
                            //$rootScope.ValidationErrorAlert('Truck capacity exceeded.', 'error', 3000);
                            //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + truckcapcityintons + 'T . Please modify your order and try again.', 'error', 8000);
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), truckcapcityintons), 'error', 8000);

                        } else if (parseFloat($scope.TruckCapacityPalettes) < (truckTotalPalettes - TotalExtraPalettes)) {

                            currentOrder[0].IsTruckFull = false;
                            //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $scope.TruckCapacityPalettes + ' pallets. Please modify your order and try again.', 'error', 8000);

                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $scope.TruckCapacityPalettes), 'error', 8000);


                        }
                        else {
                            currentOrder[0].IsTruckFull = true;
                            currentOrder[0].RequestDate = $scope.ordermanagement.RequestDate;
                            $scope.ViewInquiry();
                        }

                    }
                }



            }

        }
    }

    $scope.OrderProductList = [];


    $scope.AddWoodenPallet = function () {

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {

            var qty = currentOrder[0].NumberOfPalettes;

            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemCode === $scope.WoodenPalletCode; });
            var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode & parseInt(el.GratisOrderId) === 0; });
            debugger;
            if (productNameStrupdate.length > 0) {
                productNameStrupdate[0].ProductQuantity = parseInt(qty);
            }
            else {

                var products = {
                    EnquiryProductGUID: generateGUID(),
                    OrderGUID: $scope.CurrentOrderGuid,
                    EnquiryProductId: 0,
                    Allocation: 0,
                    ItemId: productNameStr[0].ItemId,
                    ParentItemId: 0,
                    ParentProductCode: '',
                    GratisOrderId: 0,
                    ItemName: productNameStr[0].ItemName,
                    ProductCode: productNameStr[0].ItemCode,
                    NumberOfExtraPalettes: 0,
                    PrimaryUnitOfMeasure: productNameStr[0].UOM,
                    ProductQuantity: qty,
                    ItemPricesPerUnit: 0,
                    DepositeAmountPerUnit: 0,
                    ItemTotalDepositeAmount: 0,
                    ItemPrices: 0,
                    ConversionFactor: 0,
                    ProductType: productNameStr[0].ProductType,
                    ActualAllocation: 'NA',
                    WeightPerUnit: 0,
                    ItemType: 0,
                    ItemTaxPerUnit: 0,
                    IsItemLayerAllow: false,
                    IsActive: true
                }
                currentOrder[0].OrderProductList.push(products);
            }

        }

    }


    $scope.AddPromationItem = function (itemCode, ItemId, qty, ItemType) {
        debugger;
        var addPromation = false;
        if (parseInt(ItemType) !== 31) {

            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
            if (currentOrder.length > 0) {

                var promotionItem = $scope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
                if (promotionItem.length === 0) {
                    $scope.Allocation = 'NA';
                    $scope.ActualAllocation = 'NA';
                }
                for (var i = 0; i < promotionItem.length; i++) {
                    var ItemQuanity = promotionItem[i].ItemQuanity;
                    var FocItemId = promotionItem[i].FocItemId;
                    var FocItemQuantity = promotionItem[i].FocItemQuantity;


                    if ((parseInt(qty) % parseFloat(ItemQuanity)) === 0) {
                        //if (parseFloat(qty) === parseFloat(ItemQuanity)) {
                        addPromation = true;
                        //$scope.CloseAddTruckControl();
                        var totalNumberCanOrderFocItem = (parseInt(qty) / parseFloat(ItemQuanity));
                        var totalAmountOfQty = parseInt(FocItemQuantity) * totalNumberCanOrderFocItem;

                        $scope.addProducts(FocItemId, totalAmountOfQty, 0, 31, ItemId, itemCode);
                        $scope.IsPromotion = true;
                        $scope.Allocation = 'NA';
                        $scope.ActualAllocation = 'NA';
                        break;
                        //}
                    }
                    else {
                        $scope.YesRemoveFocItems(currentOrder, ItemId);
                        $scope.Allocation = 'NA';
                        $scope.ActualAllocation = 'NA';
                    }


                }

            }
            else {
                $scope.Allocation = 'NA';
                $scope.ActualAllocation = 'NA';
            }
        }
        return addPromation;
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

    $scope.calcTotalAmount = function (OrderGuid) {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGuid; });
        var total = 0;

        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            total += parseFloat(currentOrder[0].OrderProductList[i].ItemPrices);
        }

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



    $scope.myFilter = function (item) {

        return item.ProductCode !== $scope.WoodenPalletCode;
    };


    $scope.CheckBeforeAddingPromationItem = function (itemCode, itemId, qty, ItemType, productNameStr, enquiryProductGuid, GratisOrderId) {
        debugger;
        var chkvalid = true;
        var totalWeightWithPalettes = 0;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {

            if (!$scope.IsItemEdit) {
                enquiryProductGuid = '';
            }

            var promotionItem = $scope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
            //if (promotionItem.length === 0) {
            //    $scope.Allocation = 'NA';
            //    $scope.ActualAllocation = 'NA';
            //}
            for (var i = 0; i < promotionItem.length; i++) {
                var ItemQuanity = promotionItem[i].ItemQuanity;
                var FocItemId = promotionItem[i].FocItemId;
                var FocItemQuantity = promotionItem[i].FocItemQuantity;


                if ((parseInt(qty) % parseFloat(ItemQuanity)) === 0) {

                    var totalNumberCanOrderFocItem = (parseInt(qty) / parseFloat(ItemQuanity));
                    var totalAmountOfQty = parseInt(FocItemQuantity) * totalNumberCanOrderFocItem;
                    qty = qty + totalAmountOfQty;



                }

            }





            var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
            var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);

            var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, $scope.NumberOfExtraPalettes, ItemType, enquiryProductGuid);


            var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'TruckBufferWeight'; });
            if (truckBufferWeight.length > 0) {
                var bufferWeight = parseFloat(truckBufferWeight[0].SettingValue);

                totalWeightWithBuffer = (parseFloat($scope.TruckCapacity) - (bufferWeight * 1000));
            }


            var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);

            var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
            if (palettesWeight.length > 0) {
                var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
                if ($scope.IsPalettesRequired) {
                    totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
                }
                totalWeight = totalWeight + totalWeightWithPalettes
            }


            truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);


            var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
            var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();

            if (parseFloat(parseFloat($scope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$scope.IsSelfCollect) {
                //$rootScope.resData.res_CreateInquiryPage_TruckSizeValidation = "You are trying to order for {0}T while the truck size of {1}T . Please modify your order and try again.";
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($scope.TruckCapacity) / 1000)), 'error', 8000);
                chkvalid = false;
            } else if (parseFloat(parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $scope.IsPalettesRequired === true && !$scope.IsSelfCollect) {

                var truckcapcityintons = parseInt(parseInt($scope.TruckCapacity) / 1000);
                //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $scope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $scope.TruckCapacityPalettes), 'error', 8000);
                chkvalid = false;
            }

        }
        return chkvalid;
    }



    $scope.addProducts = function (itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode) {
        debugger;

        // $scope.ordermanagement.inputItemsQty

        //$rootScope.resData.res_CreateInquiryPage_EnterValidQuantity = "Please enter a valid quantity.";
        if (qty === "" || qty === undefined || qty === null) {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnterValidQuantity), 'error', 3000);
            return false;
        }

        if (parseInt(qty) < 1) {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnterValidQuantity), 'error', 3000);
            return false;
        }

        //if ($scope.TruckSizeId > 0 && $scope.DeliveryLocationId > 0) {

        if ($scope.DeliveryLocationId > 0 && ($scope.TruckSizeId > 0 || $scope.IsSelfCollect === true)) {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
            if (currentOrder.length > 0) {

                // IsItemEdit   Check for Edit
                if (!$scope.IsItemEdit) {
                    var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 32 && el.ProductCode !== $scope.WoodenPalletCode; });
                    if (productNameStrupdate.length > (parseInt($scope.NumberOfProductAdd) - 1)) {
                        //$rootScope.ValidationErrorAlert('You can not add more the ' + $scope.NumberOfProductAdd + ' products.', 'error', 3000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_NumberOfProducts), 'error', 3000);
                        return false;
                    }
                }


                var totalWeightWithPalettes = 0;
                var totalWeightWithBuffer = 0;

                var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });


                if (parseInt(productNameStr[0].QtyPerLayer) > 0) {

                    if ($scope.IsItemLayerAllow) {
                        var g = (parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer));
                        if ((parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer)) > 0) {
                            if ((parseInt(ItemType) == 31)) {
                                $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                            }
                            //$rootScope.ValidationErrorAlert('This item can be ordered in complete layers, please adjust ordered quantity.', 'error', 3000);                            
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_CompleteLayer), 'error', 3000);
                            return false;
                        }
                    }

                }

                var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return el.ItemId === itemId & parseInt(el.ItemType) === parseInt(ItemType) & parseInt(el.GratisOrderId) === 0; });
                debugger;
                var enquiryProductGuid = '';
                if (productNameStrupdate.length > 0) {
                    enquiryProductGuid = productNameStrupdate[0].EnquiryProductGUID;

                }
                debugger;
                var chkVlaue = $scope.CheckBeforeAddingPromationItem(productNameStr[0].ItemCode, itemId, parseInt(qty), ItemType, productNameStr, enquiryProductGuid, GratisOrderId);

                if (!chkVlaue && !$scope.IsSelfCollect) {
                    return false;
                }

                var checkAllocationValue = $scope.CheckAllocation($scope.Allocation, qty, $scope.OrderData, itemId);
                if (!checkAllocationValue) {
                    if ((parseInt(ItemType) == 31)) {
                        $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                    }
                    //$rootScope.ValidationErrorAlert('It seems like you are tyring to order the item more than the allocated quantity. You cannot order this item more than ' + $scope.Allocation + ' ' + productNameStr[0].UOM + '', 'error', 10000);


                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_MorethanAllocationQty, $scope.Allocation, productNameStr[0].UOM), 'error', 3000);

                    return false;
                }


                var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
                var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);

                var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, $scope.NumberOfExtraPalettes, ItemType, enquiryProductGuid);


                var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'TruckBufferWeight'; });
                if (truckBufferWeight.length > 0) {
                    var bufferWeight = parseFloat(truckBufferWeight[0].SettingValue);

                    totalWeightWithBuffer = (parseFloat($scope.TruckCapacity) - (bufferWeight * 1000));
                }


                var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);

                var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
                if (palettesWeight.length > 0) {
                    var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
                    if ($scope.IsPalettesRequired) {
                        totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
                    }
                    totalWeight = totalWeight + totalWeightWithPalettes
                }


                truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);

                //var actualTotalWeight = totalWeight - (parseFloat(productNameStr[0].WeightPerUnit) * parseFloat($scope.ordermanagement.inputItemsQty));
                //var actualTruckTotalPalettes = truckTotalPalettes - (parseFloat(productNameStr[0].ConversionFactor) / parseFloat($scope.ordermanagement.inputItemsQty));

                var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
                var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();

                if (productNameStrupdate.length > 0) {


                    if (parseFloat(parseFloat($scope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$scope.IsSelfCollect) {

                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        // $rootScope.ValidationErrorAlert('Truck capacity exceeded.', 'error', 3000);
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($scope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($scope.TruckCapacity) / 1000)), 'error', 8000);

                        $scope.CloseAddTruckControl();
                        return false;

                    } else if (parseFloat(parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $scope.IsPalettesRequired === true && !$scope.IsSelfCollect) {

                        var truckcapcityintons = parseInt(parseInt($scope.TruckCapacity) / 1000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $scope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $scope.TruckCapacityPalettes), 'error', 8000);

                        $scope.CloseAddTruckControl();
                        return false;
                    }
                    else {

                        currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes) + parseFloat(truckTotalExtraPalettes));
                        currentOrder[0].TruckWeight = (totalWeight / 1000);
                        currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;

                        if ($scope.IsItemEdit) {

                            productNameStrupdate[0].ProductQuantity = parseInt(qty);
                            productNameStrupdate[0].ItemPrices = ((parseInt(ItemType) == 31 ? 0 : parseFloat(productNameStrupdate[0].ItemPricesPerUnit)) * parseInt(productNameStrupdate[0].ProductQuantity));
                            productNameStrupdate[0].ItemTotalDepositeAmount = parseFloat(parseFloat(productNameStrupdate[0].DepositeAmountPerUnit) * parseInt(productNameStrupdate[0].ProductQuantity));
                        }
                        else {

                            if (parseInt(ItemType) === 31) {
                                productNameStrupdate[0].ProductQuantity = parseInt(qty);
                            }
                            else {
                                productNameStrupdate[0].ProductQuantity = parseInt(productNameStrupdate[0].ProductQuantity) + parseInt(qty);
                            }
                            productNameStrupdate[0].ItemPrices = ((parseInt(ItemType) == 31 ? 0 : parseFloat(productNameStrupdate[0].ItemPricesPerUnit)) * parseInt(productNameStrupdate[0].ProductQuantity));
                            productNameStrupdate[0].ItemTotalDepositeAmount = parseFloat(parseFloat(productNameStrupdate[0].DepositeAmountPerUnit) * parseInt(productNameStrupdate[0].ProductQuantity));
                        }


                        debugger;
                        $scope.ReloadGraph(currentOrder, 0);

                        $scope.ClearItemRecord();
                    }




                }
                else {
                    debugger;



                    if (parseFloat(parseFloat($scope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$scope.IsSelfCollect) {

                        //$scope.trmpProductId = itemId
                        // $rootScope.ValidationErrorAlert('Truck capacity exceeded.', 'error', 3000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($scope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($scope.TruckCapacity) / 1000)), 'error', 8000);



                        $scope.CloseAddTruckControl();

                        return false;

                    } else if (parseFloat(parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $scope.IsPalettesRequired === true && !$scope.IsSelfCollect) {
                        //$scope.trmpProductId = itemId;
                        var truckcapcityintons = parseInt(parseInt($scope.TruckCapacity) / 1000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $scope.TruckCapacityPalettes + ' pallets. Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $scope.TruckCapacityPalettes), 'error', 8000);

                        $scope.CloseAddTruckControl();
                        return false;
                    }

                    else {

                        if (currentOrder.length > 0) {


                            $scope.TruckCapacityFullInTone = (totalWeight / 1000);
                            $scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);


                            angular.forEach($scope.buindingPalettes, function (item, key) {

                                item.PalettesWidth = 0;


                            });

                            if ($scope.IsPalettesRequired) {
                                for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                                    if (i < parseInt($scope.buindingPalettes.length)) {
                                        $scope.buindingPalettes[i].PalettesWidth = 100;
                                    }
                                }
                            }

                            currentOrder[0].TruckName = $scope.TruckSize;
                            currentOrder[0].TruckCapacity = $scope.TruckCapacityInTone;
                            currentOrder[0].TruckSizeId = $scope.TruckSizeId;
                            currentOrder[0].ShipTo = $scope.DeliveryLocationId;
                            currentOrder[0].DeliveryLocationName = $scope.DeliveryLocationName;
                            currentOrder[0].RequestDate = $scope.ordermanagement.RequestDate;

                            currentOrder[0].OrderProposedETD = $scope.ProposedDate;


                            currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes) + parseFloat(truckTotalExtraPalettes));
                            currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
                            currentOrder[0].TruckWeight = $scope.TruckCapacityFullInTone;

                            if (parseInt(currentOrder[0].EnquiryId) === 0) {

                                currentOrder[0].CurrentState = 1;
                            }

                            if (productNameStr[0].Amount == undefined) {
                                productNameStr[0].Amount = 0;
                            }


                            debugger;
                            var products = {
                                EnquiryProductGUID: generateGUID(),
                                OrderGUID: $scope.CurrentOrderGuid,
                                EnquiryProductId: 0,
                                Allocation: $scope.Allocation,
                                ItemId: itemId,
                                ParentItemId: ParentItemId,
                                ParentProductCode: ParentProductCode,
                                GratisOrderId: GratisOrderId,
                                ItemName: productNameStr[0].ItemName,
                                ProductCode: productNameStr[0].ItemCode,
                                NumberOfExtraPalettes: $scope.NumberOfExtraPalettes,
                                PrimaryUnitOfMeasure: productNameStr[0].UOM,
                                ProductQuantity: qty,
                                ActualAllocation: $scope.ActualAllocation,
                                ItemShortCode: productNameStr[0].ItemShortCode,
                                DepositeAmount: $scope.ItemDepositeAmount,
                                UnitPrice: parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount),
                                ItemPricesPerUnit: parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount),
                                ItemTaxPerUnit: percentage(parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount), $scope.ItemTaxInPec),
                                ItemPrices: (parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount) * parseInt(qty)),
                                DepositeAmountPerUnit: $scope.ItemDepositeAmount,
                                ItemTotalDepositeAmount: parseFloat(parseFloat($scope.ItemDepositeAmount) * parseInt(qty)),
                                ConversionFactor: productNameStr[0].ConversionFactor,
                                ProductType: productNameStr[0].ProductType,
                                WeightPerUnit: productNameStr[0].WeightPerUnit,
                                IsItemLayerAllow: $scope.IsItemLayerAllow,
                                ItemType: ItemType,
                                IsActive: true
                            }

                            if (parseInt(currentOrder[0].EnquiryId) !== 0) {
                                products.CurrentStockPosition = $scope.ItemCurrentStockPosition;
                            }


                            currentOrder[0].OrderProductList.push(products);
                        }
                        debugger;
                        $scope.ClearItemRecord();
                    }

                }


                if ($scope.IsPalettesRequired) {
                    debugger;
                    $scope.AddWoodenPallet();
                }

                debugger;


                var chkaddpro = $scope.AddPromationItem(productNameStr[0].ItemCode, itemId, parseInt(qty), ItemType);

                if (!chkaddpro && !$scope.IsSelfCollect) {

                    var dd = $scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $scope.TruckCapacity, $scope.TruckCapacityPalettes, totalWeightWithPalettes);
                    if (dd) {
                        var dd = $scope.AddTruckControl;
                        if (!dd._isShown) {
                            $scope.CloseWarningMessageControl();
                            $scope.CloseViewGratisOrderControl();
                            currentOrder[0].IsTruckFull = true;
                            $scope.AddTruckHeaderMessage = "Message";
                            $scope.AddTruckBodymessage = "Minimum truck fill capacity reached. Choose from below options to continue.";
                            $scope.OpenAddTruckControl();
                        }
                    }
                    else {
                        currentOrder[0].IsTruckFull = false;
                    }
                }
                else if ($scope.IsSelfCollect) {
                    currentOrder[0].IsTruckFull = true;
                }

            }



        }
        else {
            if ($scope.TruckSizeId == 0) {
                //$rootScope.ValidationErrorAlert('Please seletect one of the truck sizes before you proceed further with your order.', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectTruckSize), 'error', 8000);

            }
            else if ($scope.DeliveryLocationId == 0) {
                //$rootScope.ValidationErrorAlert('Please seletect one of the delivery locations before you proceed further with your order.', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectDeliveryLocation), 'error', 8000);


            }
            else {
                //$rootScope.ValidationErrorAlert('Please select delivery location or truck.', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectTruckAndDeliveryLocation), 'error', 8000);

            }


        }
        debugger;
        $scope.RemoveSelectedAssociatedOrder();
    }







    $scope.EditProduct = function (OrderGUID, itemId, EnquiryProductGUID) {
        debugger;

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });

        if (currentOrder.length > 0) {
            if (currentOrder[0].OrderProductList.length > 0) {
                var productNameStr = currentOrder[0].OrderProductList.filter(function (el) { return el.EnquiryProductGUID === EnquiryProductGUID & parseInt(el.GratisOrderId) === 0; });
                $scope.IsItemEdit = true;
                $scope.ItemPrices = productNameStr[0].ItemPricesPerUnit;
                $scope.ItemId = productNameStr[0].ItemId;
                $scope.EnquiryProductGUID = EnquiryProductGUID;
                //$scope.$broadcast('angucomplete-alt:changeInput', 'ItemListAutoCompleteBox', productNameStr[0].ItemName);
                $scope.predicates.InputItem = productNameStr[0].ItemName;
                $scope.disableInput = true;
                $scope.ordermanagement.itemsName = itemId;
                $scope.ordermanagement.inputItemsQty = parseInt(productNameStr[0].ProductQuantity);
                $scope.Allocation = productNameStr[0].Allocation;
                $scope.IsItemLayerAllow = productNameStr[0].IsItemLayerAllow;

                var e = {
                    e: [{
                        description: {
                            ItemId: itemId,
                            Amount: productNameStr[0].ItemPricesPerUnit
                        }
                    }]
                }

                $scope.getItemPrice1(itemId, productNameStr[0].ItemPricesPerUnit, 0);
            }
        }


    }


    $scope.GetPendingAllocation = function (Allocation, quantity, currentOrder, itemId, ItemList) {
        debugger;
        var total = 0;
        var productNameStrupdate = [];
        for (var i = 0; i < currentOrder.length; i++) {

            if (ItemList != undefined) {
                if ($scope.IsItemEdit) {
                    productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return el.ItemId !== itemId && ItemList.indexOf(el.ProductCode) > -1 && el.ItemType == 32; });
                }
                else {
                    productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return ItemList.indexOf(el.ProductCode) > -1 && el.ItemType == 32; });
                }
            }
            else {
                productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return el.ItemId === itemId && el.ItemType == 32; });
            }
            debugger;
            if (productNameStrupdate.length > 0) {
                for (var j = 0; j < productNameStrupdate.length; j++) {
                    total += parseFloat(productNameStrupdate[j].ProductQuantity);
                }
            }
        }

        return total;
    }



    $scope.getItemPrice2 = function (itemId, ItemPrices, associatedCount) {
        debugger;
        //var itemId = e.description.ItemId;
        //var ItemPrices = e.description.Amount;


        $scope.ordermanagement.itemsName = itemId;

        var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
        if (productNameStr.length > 0) {
            $scope.ItemPrices = productNameStr[0].Amount;
            $scope.UOM = productNameStr[0].UOM;
            $scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
        }
        else {
            $scope.ItemPrices = 0;
        }


        var requestData =
            {
                ServicesAction: 'GetItemAllocation',
                DeliveryLocation: {
                    LocationId: $scope.DeliveryLocationId,
                    DeliveryLocationCode: $scope.DeliveryLocationCode
                },
                CompanyId: $scope.TempCompanyId,
                CompanyMnemonic: $scope.TempCompanyMnemonic,
                Company: {
                    CompanyId: $scope.TempCompanyId,
                    CompanyMnemonic: $scope.TempCompanyMnemonic
                },
                RuleType: 2,
                Item: {
                    ItemId: parseInt(itemId),
                    SKUCode: $scope.ItemCodeForDeposite,
                },
                EnquiryId: $scope.EnquiryId
            };
        $scope.Allocation = 'NA';
        $scope.ActualAllocation = 'NA';
        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var responseStr = response.data.Json;
            var currentOrder = $scope.OrderData;
            if (responseStr.Allocation != 'NA') {
                if ($scope.IsItemEdit) {
                    //$scope.Allocation = parseInt(responseStr.Allocation);
                    //$scope.ActualAllocation = parseInt(responseStr.Allocation);
                    var UsedAllocationQty = $scope.GetPendingAllocation('NA', 0, currentOrder, itemId, responseStr.ItemList);
                    $scope.Allocation = parseInt(responseStr.Allocation) - parseInt(UsedAllocationQty);
                    $scope.ActualAllocation = parseInt(responseStr.Allocation);

                }
                else {

                    //var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });

                    var UsedAllocationQty = $scope.GetPendingAllocation('NA', 0, currentOrder, itemId, responseStr.ItemList);
                    $scope.ActualAllocation = parseInt(responseStr.Allocation);
                    $scope.Allocation = parseInt(responseStr.Allocation) - parseInt(UsedAllocationQty);
                }
            }
            else {
                $scope.Allocation = responseStr.Allocation;
                $scope.ActualAllocation = responseStr.Allocation;
            }
        });



        ///3
        // Checking For Number Of ExtraPalettes
        var requestData =
            {
                ServicesAction: 'GetRuleValue',
                LocationId: $scope.DeliveryLocationId,
                DeliveryLocationCode: $scope.DeliveryLocationCode,
                CompanyId: $scope.TempCompanyId,
                CompanyMnemonic: $scope.TempCompanyMnemonic,
                RuleType: 3,
                UOM: $scope.UOM
            };
        $scope.NumberOfExtraPalettes = 0;
        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var responseStr = response.data.Json;

            if (responseStr.RuleValue != '' || responseStr.RuleValue != undefined) {
                $scope.NumberOfExtraPalettes = parseInt(responseStr.RuleValue);
                if ($scope.NumberOfExtraPalettes > 0) {
                    $scope.NumberOfExtraPalettes = $scope.NumberOfExtraPalettes;
                }
            }
        });


        //Get DepositeAmount
        // Checking For Deposite Amount Available For Selected Product
        if (associatedCount == 0) {
            var requestData =
                {
                    ServicesAction: 'GetRuleValue',
                    LocationId: $scope.DeliveryLocationId,
                    DeliveryLocationCode: $scope.DeliveryLocationCode,
                    CompanyId: $scope.TempCompanyId,
                    CompanyMnemonic: $scope.TempCompanyMnemonic,
                    RuleType: 7,
                    SKUCode: $scope.ItemCodeForDeposite
                };
            $scope.NumberOfExtraPalettes = 0;
            //var stringfyjson = JSON.stringify(requestData);
            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                debugger;
                var responseStr = response.data.Json;

                if (responseStr.RuleValue != '' && responseStr.RuleValue != undefined) {
                    $scope.ItemDepositeAmount = parseFloat(responseStr.RuleValue);

                } else {
                    $scope.ItemDepositeAmount = 0;
                }

            });
        }



        ///4
        // Checking For Is Item Layer Allow

        var requestLayerData =
            {
                ServicesAction: 'GetRuleValue',
                LocationId: $scope.DeliveryLocationId,
                DeliveryLocationCode: $scope.DeliveryLocationCode,
                CompanyId: $scope.TempCompanyId,
                CompanyMnemonic: $scope.TempCompanyMnemonic,
                RuleType: 4,
                ItemCode: $scope.ItemCodeForDeposite
            };
        $scope.IsItemLayerAllow = false;
        //var stringfyjson = JSON.stringify(requestData);
        var jsonLayerobject = {};
        jsonLayerobject.Json = requestLayerData;
        GrRequestService.ProcessRequest(jsonLayerobject).then(function (response) {
            debugger;
            var responseStr = response.data.Json;

            if (responseStr.RuleValue != '' || responseStr.RuleValue != undefined) {
                if (responseStr.RuleValue === '1') {
                    $scope.IsItemLayerAllow = true;
                }
                else {
                    $scope.IsItemLayerAllow = false;
                }

            }
        });

    }


    $scope.getItemPrice1 = function (itemId, ItemPrices, associatedCount) {


        var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
        if (productNameStr.length > 0) {
            $scope.ItemPrices = productNameStr[0].Amount;
            $scope.UOM = productNameStr[0].UOM;
            $scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
        }
        else {
            $scope.ItemPrices = 0;
        }


        var e1 = {
            ItemId: itemId,
            Amount: $scope.ItemPrices,
            ItemNameCode: $scope.ItemCodeForDeposite,
        }

        $scope.getItemPrice(e1);
    }

    $scope.getItemPrice = function (e) {
        try {


            debugger;
            var itemId = e.ItemId;
            var ItemPrices = e.Amount;

            $scope.predicates.InputItem = e.ItemNameCode;
            $scope.ordermanagement.itemsName = itemId;

            $scope.showItembox = false;

            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
            if (productNameStr.length > 0) {
                $scope.ItemPrices = productNameStr[0].Amount;
                $scope.UOM = productNameStr[0].UOM;
                $scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
            }
            else {
                $scope.ItemPrices = 0;
                $scope.ItemCodeForDeposite = '';
            }


            $scope.ItemCurrentStockPosition = 0;


            var requestData =
                {
                    ServicesAction: 'GetProductCurrenttStockPosition',
                    ProductCode: productNameStr[0].ItemCode,
                    DeliveryLocationCode: $rootScope.BranchPlantCodeEdit
                };

            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                debugger;
                if (response.data.ItemStock != undefined) {
                    $scope.ItemCurrentStockPosition = response.data.ItemStock.CurrentStockPosition;
                }



                //GetAllocation..
                var requestData =
                    {
                        ServicesAction: 'GetItemAllocation',
                        DeliveryLocation: {
                            LocationId: $scope.DeliveryLocationId,
                            DeliveryLocationCode: $scope.DeliveryLocationCode
                        },
                        CompanyId: $scope.TempCompanyId,
                        CompanyMnemonic: $scope.TempCompanyMnemonic,
                        Company: {
                            CompanyId: $scope.TempCompanyId,
                            CompanyMnemonic: $scope.TempCompanyMnemonic
                        },
                        RuleType: 2,
                        Item: {
                            ItemId: parseInt(itemId),
                            SKUCode: $scope.ItemCodeForDeposite,
                        },
                        EnquiryId: $scope.EnquiryId
                    };
                $scope.Allocation = 'NA';
                $scope.ActualAllocation = 'NA';
                //var stringfyjson = JSON.stringify(requestData);
                var jsonobject = {};
                jsonobject.Json = requestData;
                GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    debugger;
                    if (response.data != null) {
                        var responseStr = response.data.Json;
                        var currentOrder = $scope.OrderData;
                        if (responseStr.Allocation != 'NA') {
                            if ($scope.IsItemEdit) {
                                //$scope.Allocation = parseInt(responseStr.Allocation);
                                //$scope.ActualAllocation = parseInt(responseStr.Allocation);
                                var UsedAllocationQty = $scope.GetPendingAllocation('NA', 0, currentOrder, itemId, responseStr.ItemList);
                                $scope.Allocation = parseInt(responseStr.Allocation) - parseInt(UsedAllocationQty);
                                $scope.ActualAllocation = parseInt(responseStr.Allocation);
                            }
                            else {
                                //var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });

                                var UsedAllocationQty = $scope.GetPendingAllocation('NA', 0, currentOrder, itemId, responseStr.ItemList);
                                $scope.Allocation = parseInt(responseStr.Allocation) - parseInt(UsedAllocationQty);
                                $scope.ActualAllocation = parseInt(responseStr.Allocation);
                            }
                        }
                        else {

                            $scope.Allocation = responseStr.Allocation;
                            $scope.ActualAllocation = responseStr.Allocation;
                        }
                    }

                });



                //Get DepositeAmount
                // Checking For Deposite Amount Available For Selected Product
                var requestData =
                    {
                        ServicesAction: 'GetRuleValue',
                        LocationId: $scope.DeliveryLocationId,
                        DeliveryLocationCode: $scope.DeliveryLocationCode,
                        CompanyId: $scope.TempCompanyId,
                        CompanyMnemonic: $scope.TempCompanyMnemonic,
                        RuleType: 7,
                        SKUCode: $scope.ItemCodeForDeposite
                    };
                $scope.NumberOfExtraPalettes = 0;
                //var stringfyjson = JSON.stringify(requestData);
                var jsonobject = {};
                jsonobject.Json = requestData;
                GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    debugger;
                    var responseStr = response.data.Json;

                    if (responseStr.RuleValue != '' && responseStr.RuleValue != undefined) {
                        $scope.ItemDepositeAmount = parseFloat(responseStr.RuleValue);

                    } else {
                        $scope.ItemDepositeAmount = 0;
                    }
                });




                //Get ExtraPalettes
                // Checking For Number Of ExtraPalettes
                var requestData =
                    {
                        ServicesAction: 'GetRuleValue',
                        LocationId: $scope.DeliveryLocationId,
                        DeliveryLocationCode: $scope.DeliveryLocationCode,
                        CompanyId: $scope.TempCompanyId,
                        CompanyMnemonic: $scope.TempCompanyMnemonic,
                        RuleType: 3,
                        UOM: $scope.UOM
                    };
                $scope.NumberOfExtraPalettes = 0;
                //var stringfyjson = JSON.stringify(requestData);
                var jsonobject = {};
                jsonobject.Json = requestData;
                GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    debugger;
                    var responseStr = response.data.Json;

                    if (responseStr.RuleValue != '' && responseStr.RuleValue != undefined) {
                        $scope.NumberOfExtraPalettes = parseInt(responseStr.RuleValue);
                        if ($scope.NumberOfExtraPalettes > 0) {
                            $scope.NumberOfExtraPalettes = $scope.NumberOfExtraPalettes;
                        }
                    }
                });


                //Get Item Layer Allow
                // Checking For Is Item Layer Allow
                var requestLayerData =
                    {
                        ServicesAction: 'GetRuleValue',
                        LocationId: $scope.DeliveryLocationId,
                        DeliveryLocationCode: $scope.DeliveryLocationCode,
                        CompanyId: $scope.TempCompanyId,
                        CompanyMnemonic: $scope.TempCompanyMnemonic,
                        RuleType: 4,
                        SKUCode: productNameStr[0].ItemCode
                    };
                $scope.IsItemLayerAllow = false;
                //var stringfyjson = JSON.stringify(requestData);
                var jsonLayerobject = {};
                jsonLayerobject.Json = requestLayerData;
                GrRequestService.ProcessRequest(jsonLayerobject).then(function (response) {
                    debugger;
                    var responseStr = response.data.Json;

                    if (responseStr.RuleValue != '' && responseStr.RuleValue != undefined) {
                        if (responseStr.RuleValue === '1') {
                            $scope.IsItemLayerAllow = true;
                        }
                        else {
                            $scope.IsItemLayerAllow = false;
                        }

                    }
                });

            })



        } catch (e) {

        }
    }

    $scope.EditEnquiry = function (enquiryId) {
        debugger;
        var jsonobject = {};
        jsonobject.enquiryId = 10;
        EnquiryService.EnquirygetById(jsonobject).then(function (response) {
            debugger;
            var responseData = response.data[0];
            $scope.EnquiryId = responseData.EnquiryId;
            $scope.ordermanagement.shiptoList = responseData.DeliveryLocationId;
            $scope.ordermanagement.TruckSize = responseData.TruckSizeId;
            $scope.OrderProductList = responseData.EnquiryProductList;
        });
    }



    $scope.CalculateDeliveryUsedCapacity = function () {
        debugger;
        var tempNumberOfPalettes = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            tempNumberOfPalettes += $scope.OrderData[i].NumberOfPalettes;
        }
        $scope.tempDeliveryUsedCapacity = tempNumberOfPalettes;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity) > $scope.DeliveryLocationCapacity) {

            var usedPalettesCapacity = parseInt($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity);


            if (currentOrder.length > 0) {
                currentOrder[0].IsRecievingLocationCapacityExceed = true;

                if (currentOrder[0].OrderProductList.length === 0) {

                    //$rootScope.ValidationErrorAlert('The receiving location capacity has been fully consumed.', 'warning', 10000);

                    $scope.ValidationErrorReceivingLocation = 'The receiving capacity has been fully consumed.';

                }
                else {
                    //$rootScope.ValidationErrorAlert('The receiving location capacity for the delivery location is only ' + parseInt($scope.DeliveryLocationCapacity) + ' pallets while you are trying order ' + usedPalettesCapacity + ' paletts. Please modify you order and try again.', 'warning', 10000);
                    $scope.ValidationErrorReceivingLocation = 'The receiving capacity for the delivery location is only ' + parseInt($scope.DeliveryLocationCapacity) + ' pallets while you are trying order ' + usedPalettesCapacity + ' paletts. Please modify you order and try again.';
                }

            }

        }
        else {
            if (currentOrder.length > 0) {
                currentOrder[0].IsRecievingLocationCapacityExceed = false;
            }
        }

        $scope.RemoveSelectedAssociatedOrder();
    }

    //$scope.EditEnquiry(10);
    $scope.ClearItemRecord = function () {
        $scope.ordermanagement.itemsName = "";
        $scope.ordermanagement.inputItemsQty = "";
        //$scope.$broadcast('angucomplete-alt:clearInput');
        $scope.selectedRow = -1;
        $scope.predicates.InputItem = "";
        $scope.predicates.FilterAutoCompletebox = "";
        $scope.EnquiryProductGUID = "";
        $scope.disableInput = false;
        $scope.ItemPrices = 0;
        $scope.ItemDepositeAmount = 0;
        //$scope.Allocation = 0;
        $scope.UOM = '-';
        $scope.IsItemEdit = false;
        $scope.IsItemLayerAllow = false;
        $scope.CalculateDeliveryUsedCapacity();
        focus('ItemListAutoCompleteBox_value');
    }


    $scope.ClearItem = function () {
        $scope.Allocation = 'NA';
        $scope.ClearItemRecord();
    }

    $scope.ClearControl = function () {
        $scope.ordermanagement.shiptoList = "";
        $scope.ordermanagement.RequestDate = "";
        $scope.ordermanagement.TruckSize = "";
        $scope.OrderProductList = [];
        $rootScope.TempCompanyId = 0;
        $rootScope.IsEnquiryEditedByCustomerService = false;
    }


    $scope.ClearAutoSearchbox = function () {

        debugger;
        $scope.Allocation = 'NA';
        $scope.showItembox = false;
        $scope.ClearItemRecord();
    }



    $scope.setoverall = function () {
        $scope.FeedbackVariable.OverAll = true;
        $scope.FeedbackVariable.Specific = false;
    }

    $scope.setspecific = function () {
        $scope.FeedbackVariable.Specific = true;
        $scope.FeedbackVariable.OverAll = false;
    }

    $scope.shiptodata = "";
    $scope.ReceivingLocationCapacity = '-';
    $scope.setreceivingcapacity = function () {
        debugger;
        $scope.ReceivingLocationCapacity = 60;
    }


    $ionicModal.fromTemplateUrl('templates/ShowRPMQuantity.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.ViewRPMQuantitypopup = modal;
    });

    $scope.ShowRPMItemCollection = function () {
        debugger;

        $scope.ViewRPMQuantitypopup.show();
    }








    $scope.ReloadGraph = function (currentOrder, removeKegPalettes) {


        debugger;
        if (!$scope.IsSelfCollect) {
            var totalWeightWithPalettes = 0;
            var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
            var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');

            var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');

            var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, '', 0, 0, '');

            var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
            if (palettesWeight.length > 0) {
                var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
                if ($scope.IsPalettesRequired) {
                    totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes - removeKegPalettes));
                }
                totalWeight = totalWeight + totalWeightWithPalettes
            }

            var truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);
            $scope.PalettesCorrectWeight = truckTotalPalettes;




            //currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes - removeKegPalettes) + parseFloat(TotalExtraPalettes));
            //currentOrder[0].TruckWeight = (totalWeight / 1000);
            //$scope.TruckCapacityFullInTone = (totalWeight / 1000);
            //$scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);





            currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(totalNumberOfPalettes));
            currentOrder[0].TruckWeight = (totalWeight / 1000);
            currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
            $scope.TruckCapacityFullInTone = (totalWeight / 1000);
            $scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);


            angular.forEach($scope.buindingPalettes, function (item, key) {

                item.PalettesWidth = 0;

            });

            if ($scope.IsPalettesRequired) {


                for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                    if (i < parseInt($scope.buindingPalettes.length)) {
                        $scope.buindingPalettes[i].PalettesWidth = 100;
                    }
                }

            }

            $scope.CalculateDeliveryUsedCapacity();
            $scope.RemoveSelectedAssociatedOrder();

            if ($scope.IsPalettesRequired) {

                var otherItem = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode });
                if (otherItem.length > 0) {
                    $scope.AddWoodenPallet();
                }
            }
        }
    }

    $scope.CloseViewRPMQuantitypopup = function () {
        debugger;
        $scope.ViewRPMQuantitypopup.hide();
    }

    $scope.PalettesWidth = {
        width: "0%"
    };

    $scope.getSelectValue = function (id) {
        debugger;
        var truckObjDetailsSelected = $scope.bindTruckSize.filter(function (el) { return el.Selected === true });
        if (truckObjDetailsSelected.length > 0) {
            debugger;
            if ($scope.bindTruckSize.length == 1) {
                return false;
            }


            truckObjDetailsSelected[0].Selected = false;
        }
        var truckObjDetails = $scope.bindTruckSize.filter(function (el) { return el.TruckSizeId === id });
        if (truckObjDetails.length > 0) {
            $scope.TruckSizeId = id;
            $scope.TruckSize = truckObjDetails[0].TruckSize;
            $scope.TruckCapacity = (parseFloat(truckObjDetails[0].TruckCapacityWeight) * 1000);
            $scope.TruckCapacityInTone = $scope.TruckCapacity / 1000;
            $scope.TruckCapacityFullInTone = 0;
            $scope.TruckCapacityFullInPercentage = 0;

            var requestAreaData =
                {
                    ServicesAction: 'GetRuleValue',
                    LocationId: $scope.DeliveryLocationId,
                    DeliveryLocationCode: $scope.DeliveryLocationCode,
                    CompanyId: $scope.TempCompanyId,
                    CompanyMnemonic: $scope.TempCompanyMnemonic,
                    RuleType: 5,
                    Area: $scope.DeliveryArea,
                    TruckSize: parseFloat($scope.TruckCapacityInTone)
                };

            //var value = $scope.GetRuleSelectedValue(requestData);



            $scope.AreaPalettesCount = 0
            var jsonobjectArea = {};
            jsonobjectArea.Json = requestAreaData;
            GrRequestService.ProcessRequest(jsonobjectArea).then(function (arearesponse) {
                debugger;


                $rootScope.Throbber.Visible = false;

                var arearesponseStr = arearesponse.data.Json;

                if (arearesponseStr.RuleValue != '' || arearesponseStr.RuleValue != undefined) {
                    var rulevalue = parseInt(arearesponseStr.RuleValue);
                    $scope.AreaPalettesCount = rulevalue;
                }



                if ($scope.AreaPalettesCount > 0) {

                    $scope.TruckCapacityPalettes = $scope.AreaPalettesCount;
                    truckObjDetails[0].TruckCapacityPalettes = $scope.AreaPalettesCount;
                }
                else {
                    $scope.TruckCapacityPalettes = truckObjDetails[0].TruckCapacityPalettes;
                }



                debugger;

                $scope.buindingPalettes = []
                for (var i = 0; i < $scope.TruckCapacityPalettes; i++) {
                    var palettes = {
                        PalettesWidth: 0
                    }
                    $scope.buindingPalettes.push(palettes);
                }

                if ($scope.buindingPalettes.length > 0) {
                    $scope.IsPalettesRequired = true;
                } else {
                    $scope.IsPalettesRequired = false;
                }

                var space = 100 - ($scope.buindingPalettes.length - 1);
                var width = space / $scope.buindingPalettes.length;
                $scope.PalettesWidth.width = width + "%";

                var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
                if (currentOrder.length > 0) {
                    if (currentOrder[0].OrderProductList.length > 0) {


                        currentOrder[0].TruckCapacity = $scope.TruckCapacityInTone;
                        currentOrder[0].TruckSizeId = $scope.TruckSizeId;
                        currentOrder[0].ShipTo = $scope.DeliveryLocationId;
                        currentOrder[0].TruckName = $scope.TruckSize;
                        currentOrder[0].DeliveryLocationName = $scope.DeliveryLocationName;

                        var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
                        var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');

                        var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
                        truckTotalPalettes = parseInt(Math.ceil(truckTotalPalettes)) - parseInt(Math.ceil(TotalExtraPalettes));


                        $scope.TruckCapacityFullInTone = (totalWeight / 1000);
                        $scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);

                        for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                            if (i < parseInt($scope.buindingPalettes.length)) {
                                $scope.buindingPalettes[i].PalettesWidth = 100;
                            }
                        }


                        var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
                        var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();

                        if (parseFloat(parseFloat($scope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight) {

                            //$scope.trmpProductId = itemId
                            // $rootScope.ValidationErrorAlert('Truck capacity exceeded.', 'error', 3000);
                            //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($scope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($scope.TruckCapacity) / 1000)), 'error', 8000);


                            return false;

                        } else if (parseFloat(parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < truckTotalPalettes) {
                            //$scope.trmpProductId = itemId;
                            var truckcapcityintons = parseInt(parseInt($scope.TruckCapacity) / 1000);
                            // $rootScope.ValidationErrorAlert('You are trying to order for ' + truckTotalPalettes + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $scope.TruckCapacityPalettes + ' pallets. Please modify your order and try again.', 'error', 8000);
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $scope.TruckCapacityPalettes), 'error', 8000);


                            return false;
                        }


                    }
                }


                var totalWeightWithPalettes = 0;
                var totalWeightWithBuffer = 0;

                var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'TruckBufferWeight'; });
                if (truckBufferWeight.length > 0) {
                    var bufferWeight = parseFloat(truckBufferWeight[0].SettingValue);

                    totalWeightWithBuffer = (parseFloat($scope.TruckCapacity) - (bufferWeight * 1000));
                }


                var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
                if (palettesWeight.length > 0) {
                    var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
                    if ($scope.IsPalettesRequired) {
                        totalWeightWithPalettes = (weightPerPalettes * (truckTotalPalettes));
                    }

                }


                var dd = $scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $scope.TruckCapacity, $scope.TruckCapacityPalettes, totalWeightWithPalettes);
                if (!dd) {
                    $scope.ReloadGraph(currentOrder, 0);
                }

                //if (truckObjDetails[0].Selected) {
                //    truckObjDetails[0].Selected = false;
                //}
                //else {
                truckObjDetails[0].Selected = true;
                //}
            });
        }

    }



    $scope.LoadTruckSizeBelongsToLoactionIdAndCompanyId = function (locationId) {
        debugger;
        var requestData =
            {
                ServicesAction: 'GetTruckDetailByLocationIdAndCompanyId',
                LocationId: locationId,
                CompanyId: $scope.TempCompanyId
            };

        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;

            var resoponsedata = response.data;



            if (resoponsedata != null) {
                if (resoponsedata.Json !== undefined) {

                    //$scope.IsSelfCollect = false;

                    $scope.GetProposedDeliveryDate(locationId);

                    $scope.bindTruckSize = resoponsedata.Json.TruckSizeList;

                    debugger;

                    if ($rootScope.TemOrderData != undefined) {
                        if ($rootScope.TemOrderData.length > 0) {




                            if ($rootScope.CurrentOrderGuid == '' || $rootScope.CurrentOrderGuid == undefined) {
                                currentOrder = $scope.OrderData.filter(function (el) { return el.IsTruckFull === false; });
                            }
                            else {
                                currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $rootScope.CurrentOrderGuid; });
                            }



                            if (currentOrder.length > 0) {

                                currentOrder[0].OrderProductsList = currentOrder[0].EnquiryProductList;

                                $scope.EnquiryId = parseInt(currentOrder[0].EnquiryId);

                                var product = currentOrder[0].OrderProductList.length;

                                if (product === 0) {
                                    $scope.getSelectValue($scope.bindTruckSize[0].TruckSizeId);
                                }
                                else {
                                    $scope.getSelectValue(currentOrder[0].TruckSizeId);
                                }



                                var deliveryObjDetailsSelected = $scope.bindDeliverylocation.filter(function (el) { return el.DeliveryLocationId === currentOrder[0].ShipTo });
                                if (deliveryObjDetailsSelected.length > 0) {
                                    deliveryObjDetailsSelected[0].IsDeliveryLocationSelected = true;
                                }


                                debugger;
                            }

                        }
                        else {
                            if ($scope.bindTruckSize.length == 1) {
                                $scope.getSelectValue($scope.bindTruckSize[0].TruckSizeId);
                            }
                        }
                    }
                    else {
                        if ($scope.bindTruckSize.length == 1) {
                            $scope.getSelectValue($scope.bindTruckSize[0].TruckSizeId);
                        }
                    }
                }
                else {
                    $scope.bindTruckSize = [];
                    //$scope.IsSelfCollect = true;
                    $scope.GetProposedDeliveryDate(locationId);
                }
                $rootScope.Throbber.Visible = false;
            }
            else {
                $scope.bindTruckSize = [];
                //$scope.IsSelfCollect = true;
                $scope.GetProposedDeliveryDate(locationId);
            }
            $rootScope.Throbber.Visible = false;

        });
    };
    $scope.ReceivingLocationCapacityDate = "";
    $scope.GetScheduleDate = function (startDate, endDate) {
        debugger;
        if ($scope.IsSelfCollect === true) {
            startDate = new Date();
            endDate = '';
        }

        $('.customdate-picker').each(function () {
            debugger;
            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    debugger;
                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                    }
                    $scope.$apply(function () {
                        $scope.ReceivingLocationCapacityDate = dateText;

                        $scope.GetReceivingLocationBalanceCapacity($scope.DeliveryLocationId, $scope.ReceivingLocationCapacityDate);
                    });

                },
                minDate: startDate,
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

    $scope.GetProposedDeliveryDate = function (locationId) {
        debugger;
        var requestData =
            {
                ServicesAction: 'GetProposedDeliveryDate',
                LocationId: locationId,
                DeliveryLocationCode: $scope.DeliveryLocationCode,
                CompanyId: $scope.TempCompanyId,
                CompanyMnemonic: $scope.TempCompanyMnemonic,
                RuleType: 1
            };

        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var responseStr = response.data.Json;

            if (responseStr.ProposedDate === '' || responseStr.ProposedDate === undefined) {
                var getDefaultSettingValue = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ProposedDeliveryDate'; });
                if (getDefaultSettingValue.length > 0) {
                    var someDate = new Date();
                    var numberOfDaysToAdd = parseInt(getDefaultSettingValue[0].SettingValue);
                    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                    var dd = someDate.getDate();
                    var mm = someDate.getMonth() + 1;
                    var y = someDate.getFullYear();
                    var someFormattedDate = dd + '/' + mm + '/' + y;

                    debugger;

                    $scope.ProposedDate = someFormattedDate;

                }
                else {
                    $scope.ProposedDate = 'N/A'
                }
            }
            else {

                $scope.ProposedDate = responseStr.ProposedDate;
            }
            debugger;

            $scope.ReceivingLocationCapacityDate = $scope.ProposedDate;

            var frozenpraposeddate = $filter('date')($scope.ProposedDate, 'dd/MM/yyyy');
            frozenpraposeddate = frozenpraposeddate.split('/');
            frozenpraposeddate = frozenpraposeddate[1] + "/" + frozenpraposeddate[0] + "/" + frozenpraposeddate[2];
            frozenpraposeddate = new Date(frozenpraposeddate);
            frozenpraposeddate.setDate(frozenpraposeddate.getDate() + 1);
            var dd = frozenpraposeddate.getDate();
            var mm = frozenpraposeddate.getMonth() + 1;
            var y = frozenpraposeddate.getFullYear();
            frozenpraposeddate = dd + '/' + mm + '/' + y;

            $scope.GetReceivingLocationBalanceCapacity(locationId, $scope.ProposedDate);


            var GetScheduleDateNumber = 6;
            var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ScheduleDateNumber'; });
            if (truckBufferWeight.length > 0) {
                GetScheduleDateNumber = parseFloat(truckBufferWeight[0].SettingValue);
            }

            debugger;
            $scope.date = $filter('date')($scope.ordermanagement.OrderDate, 'dd/MM/yyyy');


            var date = $scope.date;

            var proposedetd = date.split(' ');
            var etd = proposedetd[0].split('/');
            var etddate = etd[1] + "/" + etd[0] + "/" + etd[2];

            var enddate = new Date(etddate);
            enddate.setDate(enddate.getDate() + GetScheduleDateNumber);

            var dd = enddate.getDate();
            var mm = enddate.getMonth() + 1;
            var y = enddate.getFullYear();
            var SchedulingDate = dd + '/' + mm + '/' + y;

            $scope.GetScheduleDate(frozenpraposeddate, SchedulingDate);

        });
    };



    $scope.OrderCount = 0
    debugger;
    $scope.OrderData = [];
    if ($rootScope.TemOrderData != undefined) {
        if ($rootScope.TemOrderData.length > 0) {

            //$scope.SelectedAssociatedOrder = $rootScope.TemSelectedAssociatedOrder;
            $scope.OrderData = $rootScope.TemOrderData;


            var currentOrder = [];

            if ($rootScope.CurrentOrderGuid == '' || $rootScope.CurrentOrderGuid == undefined) {
                currentOrder = $scope.OrderData.filter(function (el) { return el.IsTruckFull === false; });
            }
            else {
                currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $rootScope.CurrentOrderGuid; });
            }


            if (currentOrder.length > 0) {
                debugger;
                $scope.CurrentOrderGuid = currentOrder[0].OrderGUID;
                currentOrder[0].OrderProductList = currentOrder[0].EnquiryProductList;

                $scope.ordermanagement.RequestDate = $filter('date')(currentOrder[0].RequestDate, "MM/dd/yyyy");

                var requestData =
                    {
                        ServicesAction: 'LoadAllDeliveryLocation',
                        CompanyId: $scope.TempCompanyId
                    };


                var jsonobject = {};
                jsonobject.Json = requestData;
                GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    debugger;
                    var responseData = response.data;
                    if (responseData !== '') {
                        $scope.bindDeliverylocation = responseData.DeliveryLocation.DeliveryLocationList;
                    }



                    debugger;
                    $scope.getDeliverylocationSelectValue(currentOrder[0].ShipTo);
                    //var requestData =
                    //            {
                    //                ServicesAction: 'GetAllTruckSizeList',
                    //            };


                    //var jsonobject = {};
                    //jsonobject.Json = requestData;
                    //GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    //    debugger;

                    //    var resoponsedata = response.data;
                    //    $scope.bindTruckSize = resoponsedata.TruckSize.TruckSizeList;

                    //});



                });



            }
            else {

                $scope.AddDefaultTruck();
            }

        }
        else {

            $scope.AddDefaultTruck();
        }
    }
    else {

        $scope.AddDefaultTruck();
    }



    $scope.YesRemoveFocItems = function (currentOrder, ParentItemId) {
        debugger;
        if (currentOrder.length > 0) {
            $scope.findAndRemove(currentOrder[0].OrderProductList, 'ParentItemId', ParentItemId, 'EnquiryProductId');
            if (currentOrder[0].OrderProductList.length === 1) {
                if (currentOrder[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                    currentOrder[0].OrderProductList = [];
                }
            }
        }
    }





    $scope.YesRemoveGratisOrderControl = function () {
        debugger;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.RemoveGratisOrderOrderGUID; });
        $scope.findAndRemove(currentOrder[0].OrderProductList, 'GratisOrderId', $scope.RemoveGratisOrderGratisOrderId, 'EnquiryProductId');

        if (currentOrder[0].OrderProductList.length === 1) {
            if (currentOrder[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                currentOrder[0].OrderProductList = [];
            }

        }

        //$scope.SelectedAssociatedOrder = $scope.SelectedAssociatedOrder.filter(item => item !== $scope.RemoveGratisOrderGratisOrderId)
        $scope.RemoveSelectedAssociatedOrder();
        $scope.RemoveGratisOrderOrderGUID = '';
        $scope.RemoveGratisOrderGratisOrderId = '';
        $scope.ReloadGraph(currentOrder, 0);
        $scope.RemoveSelectedAssociatedOrder();
        $scope.CloseRemoveGratisOrderControl();
    }


    $scope.RemoveInquiryItem = function (OrderGUID, ItemId, GratisOrderId) {
        debugger;


        if ($scope.IsItemEdit === true & $scope.ItemId === ItemId) {
            //$rootScope.ValidationErrorAlert('You cannot delete this item in edit mode.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_CannotDeleteItemInEditMode), 'error', 8000);

            return false;
        }

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
        currentOrder[0].IsTruckFull = false;
        if (parseInt(GratisOrderId) > 0) {

            $scope.RemoveGratisOrderOrderGUID = OrderGUID;
            $scope.RemoveGratisOrderGratisOrderId = GratisOrderId;

            $scope.RemoveGratisOrderHeaderMessage = "Message";
            $scope.RemoveGratisOrderBodymessage = "This is a Gratis order item. If you wish to remove this item from the order, entire Gratis order will be removed. Do you wish to proceed ?";
            $scope.OpenRemoveGratisOrderControl();


        }
        else {
            $scope.findAndRemove(currentOrder[0].OrderProductList, 'ItemId', ItemId, 'EnquiryProductId');

            $scope.YesRemoveFocItems(currentOrder, ItemId);

            if (currentOrder[0].OrderProductList.length === 1) {
                if (currentOrder[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                    currentOrder[0].OrderProductList = [];
                }

            }
        }


        $scope.ReloadGraph(currentOrder, 0);
        $scope.CalculateDeliveryUsedCapacity();
        $scope.RemoveSelectedAssociatedOrder();
    }

    $scope.ClearAllItem = function () {

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {
            currentOrder[0].IsTruckFull = false;
            currentOrder[0].OrderProductList = [];
            $scope.ReloadGraph(currentOrder, 0);
            $scope.CalculateDeliveryUsedCapacity();
            $scope.RemoveSelectedAssociatedOrder();
            $scope.ClearItemRecord();
        }
    }







    $scope.findAndRemove = function (array, property, value, primaryId) {
        for (i = 0; i < array.length; ++i) {
            if (array[i][property] === value) {
                if (array[i][primaryId] === 0) {
                    array.splice(i--, 1);
                }
                else {
                    array.splice(i--, 1);
                    //array[i].IsActive = false;
                }
            }
        }

    };


    $scope.AddAssociatedOrder = function (orderId) {
        debugger;
        var associatedOrder = $scope.AssociatedOrderList.filter(function (el) { return el.OrderId === orderId; });
        if (associatedOrder.length > 0) {

            //$scope.SelectedAssociatedOrder.push(orderId);

            for (var i = 0; i < associatedOrder[0].OrderProductsList.length; i++) {

                var e = {
                    e: [{
                        description: {
                            ItemId: associatedOrder[0].OrderProductsList[i].ItemId,
                            Amount: 0
                        }
                    }]
                }

                $scope.getItemPrice1(associatedOrder[0].OrderProductsList[i].ItemId, 0, associatedOrder.length);
                $scope.addProducts(String(associatedOrder[0].OrderProductsList[i].ItemId), associatedOrder[0].OrderProductsList[i].ProductQuantity, associatedOrder[0].OrderId, 30, 0, '');
            }
            $scope.RemoveSelectedAssociatedOrder();
        }

        var associatedOrderAvl = $scope.AssociatedOrderList.filter(function (el) { return el.IsSelected === false; });
        if (associatedOrderAvl.length == 0) {
            $scope.CloseViewGratisOrderControl();
        }

    }


    $scope.TruckExtraBufferWeight = function () {
        debugger;
        var extraTruckBufferWeight = 0;
        if ($scope.TruckExceedBufferWeight != 0 && $scope.TruckExceedBufferWeight != "0") {
            extraTruckBufferWeight = parseFloat($scope.TruckCapacity * (parseFloat($scope.TruckExceedBufferWeight) / 100));
        }
        return extraTruckBufferWeight;
    }

    $scope.TruckExtraBufferPallet = function () {
        debugger;

        var extraPaletteBufferWeight = 0;
        if ($scope.PalettesExceedBufferWeight != 0 && $scope.PalettesExceedBufferWeight != "0") {
            extraPaletteBufferWeight = parseFloat($scope.PalettesExceedBufferWeight);
        }
        return extraPaletteBufferWeight;
    }


    $ionicModal.fromTemplateUrl('templates/reasoncodepopup.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.reasoncodepopup = modal;

    });



    $scope.ReasonCodeList = [];
    $scope.LoadReasonCode = function () {
        debugger;
        var requestData =
            {
                ServicesAction: 'LoadReasonCodeList'

            };



        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            if (response != undefined) {
                $scope.ReasonCodeList = response.data.ReasonCode.ReasonCodeList;
                //$scope.LoadReasonCodePopup();
            }


        });

    };
    debugger;
    $scope.LoadReasonCode();



    $scope.OpenReasoncodepopup = function (enquiryId) {
        debugger;
        $rootScope.ReasonCodeEnquiryId = enquiryId;
        $scope.reasoncodepopup.show();
    }

    $scope.ClosReasoncodepopup = function () {
        debugger;
        $scope.ReasonCodeJson.ReasonCode = "";
        $scope.ReasonCodeJson.ReasonDescription = "";
        $scope.reasoncodepopup.hide();

        $state.go("ViewCreateInquiry");
    }


    $scope.ClosReasoncode = function () {
        debugger;
        $scope.ReasonCodeJson.ReasonCode = "";
        $scope.ReasonCodeJson.ReasonDescription = "";
        $scope.reasoncodepopup.hide();
    }


    $scope.ReasonCodeJson = {
        ReasonCode: '',
        ReasonDescription: ''
    }

    $scope.SaveReasonCode = function () {
        debugger;
        if ($scope.ReasonCodeJson.ReasonCode !== "") {
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
            debugger;
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                debugger;
                $scope.ReasonCodeJson.ReasonCode = "";
                $scope.ReasonCodeJson.ReasonDescription = "";
                $scope.ClosReasoncode();
            });

        }
        else {

            //$rootScope.ValidationErrorAlert('Please select reason code.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectReasonCode), 'error', 8000);

        }

    }

    $scope.LoadReasonCodePopup = function () {
        debugger;
        if ($scope.OrderData != undefined) {
            if ($scope.OrderData.length > 0) {
                if (parseInt($scope.OrderData[0].EnquiryId) > 0) {
                    debugger;
                    $scope.OpenReasoncodepopup($scope.OrderData[0].EnquiryId);
                }
            }
        }


    }
    $scope.predicates = {
        InputItem: '',
        FilterAutoCompletebox: ''
    };

    $scope.selectedRow = -1;
    $scope.showItembox = false;
    $rootScope.foundResult = false;



    $scope.inputChangeHandler = function (input) {
        debugger;
        if (input.length > 0) {
            $scope.showItembox = true;
            $scope.selectedRow = 0;
        } else {
            $scope.showItembox = false;
            $scope.selectedRow = -1;
        }
        $scope.predicates.FilterAutoCompletebox = input;
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

}).directive('ngEnter', function () {

    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            debugger;
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
}).directive('ngEsc', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress keyup", function (event) {
            if (event.which === 27) {
                debugger;
                scope.$apply(function () {
                    scope.$eval(attrs.ngEsc);
                });

                event.preventDefault();
            }
        });
    };
}).directive('arrowSelector', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            var elemFocus = false;
            elem.on('mouseenter', function () {
                elemFocus = true;
            });
            elem.on('mouseleave', function () {
                elemFocus = true;
            });

            $document.bind('keydown', function (e) {
                debugger;

                var ul = document.querySelector('div.angucomplete-dropdown');
                var nodes = document.querySelectorAll('.angucomplete-dropdown > .angucomplete-row');

                var elHeight = $(nodes).height();

                var scrollTop = $(ul).scrollTop();
                var viewport = scrollTop + $(ul).height();
                var elOffset = 0;


                if (elemFocus) {
                    if (e.keyCode == 38) {

                        if (scope.selectedRow == 0) {
                            scope.predicates.InputItem = scope.predicates.FilterAutoCompletebox;
                            scope.$apply();
                            e.preventDefault();
                            return;
                        }
                        scope.selectedRow--;

                        scope.predicates.InputItem = scope.filteredItems[scope.selectedRow].ItemNameCode;

                        scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (scope.selectedRow == scope.filteredItems.length - 1) {
                            return;
                        }
                        scope.selectedRow++;

                        scope.predicates.InputItem = scope.filteredItems[scope.selectedRow].ItemNameCode;

                        scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 13) {
                        for (var i = 0; i < scope.filteredItems.length; i++) {
                            if (scope.selectedRow >= 0) {
                                if (i == scope.selectedRow) {
                                    scope.selectedRow = -1;
                                    scope.getItemPrice(scope.filteredItems[i]);
                                }
                            }
                        }
                    }

                    elOffset = elHeight * scope.selectedRow;
                    if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                        $(ul).scrollTop(elOffset);
                    }

                }
            });


            $document.bind('keyup', function (e) {
                debugger;

                if (elemFocus) {

                    if (scope.filteredItems.length <= scope.selectedRow) {
                        scope.selectedRow = 0;
                        scope.$apply();
                    }
                }
            });
        }
    };
}]);