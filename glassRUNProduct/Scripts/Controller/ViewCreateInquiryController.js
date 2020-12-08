angular.module("glassRUNProduct").controller('ViewCreateInquiryController', function ($scope, $rootScope, $filter, $location, $sessionStorage, $ionicModal, $state, focus, pluginsService, GrRequestService) {

    // 0 Load Active Session Variable If Session Of Application Is InActive Then Funcation Automatically Redirect On Login Page.
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $rootScope.IsDisabledSubmit = false;
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

        
        $rootScope.ValidationErrorReceivingLocation = "";
        if ($rootScope.IsEnquiryEditedByCustomerService == true) {
            $scope.ActiveCompanyId = $rootScope.TempCompanyId;
            $scope.ActiveCompanyMnemonic = $rootScope.TempCompanyMnemonic;
            $scope.ActiveCompanyType = $rootScope.TempCompanyType;
        }
        else {
            $scope.ActiveCompanyId = $rootScope.CompanyId;
            $scope.ActiveCompanyMnemonic = $rootScope.CompanyMnemonic;
            $scope.ActiveCompanyType = $rootScope.CompanyType;

        }

        if ($rootScope.SavedEditEnquiry === undefined || $rootScope.SavedEditEnquiry === false) {
            $rootScope.SavedEditEnquiry = false;
        } else {
            $rootScope.SavedEditEnquiry = true;
        }

        $rootScope.PromotionItemList = [];
        $rootScope.totalorderamount = 0;

        $scope.ItemDepositeAmount = 0;
        $scope.NumberOfExtraPalettes = 0;
        $scope.IsItemLayerAllow = false;

        $scope.EmptiesLimitValidationColorCode = true;
        $scope.WoodenPalletCode = '0';
        $scope.AreaPalettesCount = 0;
        $scope.SelectedAssociatedOrder = [];
        $scope.IsPromotion = false;
        $scope.tempDeliveryUsedCapacity = 0;
        $scope.DeliveryUsedCapacity = 0;
        $rootScope.DeliveryLocationCapacity = 0;
        $rootScope.TruckCapacityFullInPercentage = 0;
        $rootScope.TruckCapacityInTone = 0;
        $rootScope.TruckCapacityFullInTone = 0;
        $rootScope.TruckSizeId = 0;
        $rootScope.DeliveryLocationId = 0;
        $rootScope.DeliveryLocationCode = '0';
        $scope.ItemPrices = 0;
        $scope.defaultValueForNumberOfProducts = 7;
        $scope.NumberOfProductAdd = $scope.defaultValueForNumberOfProducts;
        $scope.CurrentOrderGuid = '';
        $rootScope.buindingPalettes = []; //replace// $scope.BuildPaletteSpace = [];
        $scope.OrderData = [];
        $scope.bindallproduct = [];
        $scope.AssociatedOrderList = [];
        $scope.PalettesCorrectWeight = 0;
        $scope.PalettesBufferWeight = 0;
        $scope.ItemTaxInPec = 0;
        $scope.EmptiesAmount = 0;
        $scope.IsItemEdit = false;
        $rootScope.IsPalettesRequired = false;
        $scope.EmptiesLimitMessage = '';
        $scope.EnquiryId = 0;
        $scope.Allocation = 'NA';
        $scope.ActualAllocation = 'NA';
        $scope.UOM = '-';
        $scope.MaxPermissibleQuantity = '-';
        $scope.ReceivingLocationCapacityField = {
            BySelectedDate: ""
        };
        $scope.ItemField =
            {
                itemId: 0,
                inputItemsQty: 0
            };
        $rootScope.DateField =
            {
                RequestDate: "",
                OrderDate: new Date()
            };

        
        $rootScope.PalettesWidth = {
            width: "0%"

        };

        

        $rootScope.IsSelfCollect = false;

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
        
        $scope.WoodenPalletCode = $scope.LoadSettingInfoByName('WoodenPalletCode', 'string');
        $scope.NumberOfProductAdd = $scope.LoadSettingInfoByName('NumberOfProductAdd', 'int');
        if ($scope.NumberOfProductAdd === "") {
            $scope.NumberOfProductAdd = $scope.defaultValueForNumberOfProducts;
        }
        $scope.EmptiesAmount = $scope.LoadSettingInfoByName('EmptiesAmount', 'float');
        if ($scope.EmptiesAmount === "") {
            $scope.EmptiesAmount = 0;
        }
        $scope.ItemTaxInPec = $scope.LoadSettingInfoByName('ItemTaxInPec', 'float');
        if ($scope.ItemTaxInPec === "") {
            $scope.ItemTaxInPec = 0;
        }
        $scope.PalettesBufferWeight = $scope.LoadSettingInfoByName('PalettesBufferWeight', 'float');
        if ($scope.PalettesBufferWeight === "") {
            $scope.PalettesBufferWeight = 0;
        }
        $scope.TruckExceedBufferWeight = $scope.LoadSettingInfoByName('TruckExceedBufferWeight', 'float');
        if ($scope.TruckExceedBufferWeight === "") {
            $scope.TruckExceedBufferWeight = 0;
        }
        $scope.PalettesExceedBufferWeight = $scope.LoadSettingInfoByName('PalettesExceedBufferWeight', 'float');
        if ($scope.PalettesExceedBufferWeight === "") {
            $scope.PalettesExceedBufferWeight = 0;
        }

    }
    $scope.LoadDefaultSettingsValue();



    // 5.a) Calculate Delivery Location Used Capacity.
    $scope.CalculateDeliveryUsedCapacity = function () {
        
        console.log('CalculateDeliveryUsedCapacity');
        var tempNumberOfPalettes = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            tempNumberOfPalettes += $scope.OrderData[i].NumberOfPalettes;
        }
        $scope.tempDeliveryUsedCapacity = tempNumberOfPalettes;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity) > $rootScope.DeliveryLocationCapacity) {
            var usedPalettesCapacity = parseInt($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity);
            if (currentOrder.length > 0) {
                currentOrder[0].IsRecievingLocationCapacityExceed = true;
                if (currentOrder[0].OrderProductList.length === 0) {
                    //$rootScope.ValidationErrorAlert('The receiving location capacity has been fully consumed.', 'warning', 10000);
                    //$rootScope.ValidationErrorReceivingLocation = 'The receiving capacity has been fully consumed.';
                    $rootScope.ValidationErrorReceivingLocation = String.format($rootScope.res_CreateInquiryPage_CapacityFullyConsumed);
                }
                else {
                    //$rootScope.ValidationErrorAlert('The receiving location capacity for the delivery location is only ' + parseInt($rootScope.DeliveryLocationCapacity) + ' pallets while you are trying order ' + usedPalettesCapacity + ' paletts. Please modify you order and try again.', 'warning', 10000);
                    $rootScope.ValidationErrorReceivingLocation = 'The receiving capacity for the delivery location is only ' + parseInt($rootScope.DeliveryLocationCapacity) + ' pallets while you are trying order ' + usedPalettesCapacity + ' paletts. Please modify you order and try again.';
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

    // 5.b) Sum Total Price,Tax And Deposite Amount and Substract From Available Credit Amount and Rebind Gratis Order In Gratis Order List On Modal Popup.
    $scope.RemoveSelectedAssociatedOrder = function () {
        
        console.log('RemoveSelectedAssociatedOrder');
        var getSelectedAssociatedOrder = [];
        var totalorderamount = 0;
        var totaltaxamount = 0;
        var TotalDepositeAmount = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
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
                    
                    var dd = getSelectedAssociatedOrder.indexOf(parseInt(getAssociatedCount[i].OrderId));
                    if (getSelectedAssociatedOrder.indexOf(parseInt(getAssociatedCount[i].OrderId)) > -1) {
                        getAssociatedCount[i].IsSelected = true;
                    }
                    else {
                        getAssociatedCount[i].IsSelected = false;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < getAssociatedCount.length; i++) {
                getAssociatedCount[i].IsSelected = false;
            }
        }

        totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);
        

        // Save On Item Selection Item Total Amount Calculation.
        var requestDataforItemAllocation =
            {
                UserId: $rootScope.UserId,
                ObjectId: 0,
                ObjectType: "Item Total Amount Calculation  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                ServicesAction: 'CreateLog',
                LogDescription: 'Item Total Amount Calculation. OrderTotalAmount : ' + parseFloat(totalorderamount) + ' And Totaltax : ' + parseFloat(totaltaxamount) + 'and Total Deposite ' + parseFloat(TotalDepositeAmount) + '.',
                LogDate: GetCurrentdate(),
                Source: 'Portal',
            };
        var consolidateApiParamaterItemAllocation =
            {
                Json: requestDataforItemAllocation,
            };

        GrRequestService.ProcessRequest(consolidateApiParamaterItemAllocation).then(function (responseLogItemAllocationValidation) {

        });


        $rootScope.totalorderamount = parseFloat(totalorderamount) + parseFloat(totaltaxamount) + parseFloat(TotalDepositeAmount);
    }

    // 5.c) Relod Progress Bar Graph Of Pallets and Weight.
    $scope.ReloadGraph = function (currentOrder, removeKegPalettes) {
        
        if (!$rootScope.IsSelfCollect) {
            console.log('Reload Graph');

            var totalWeightWithPalettes = 0;
            var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
            var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');
            var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
            var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, '', 0, 0, '');
            var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
            if (weightPerPalettes !== "") {
                if ($rootScope.IsPalettesRequired) {
                    totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes - removeKegPalettes));
                }
                totalWeight = totalWeight + totalWeightWithPalettes
            }

            var truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);
            $scope.PalettesCorrectWeight = truckTotalPalettes;
            currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(totalNumberOfPalettes));
            currentOrder[0].TruckWeight = (totalWeight / 1000);
            currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
            $rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
            $rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);
            angular.forEach($rootScope.buindingPalettes, function (item, key) {
                item.PalettesWidth = 0;
            });


            
            if ($rootScope.IsPalettesRequired) {
                for (var i = 0; i < Math.ceil(truckTotalPalettes) ; i++) {
                    if (i < parseInt($rootScope.buindingPalettes.length)) {
                        $rootScope.buindingPalettes[i].PalettesWidth = 100;
                    }
                }
            }
            $scope.CalculateDeliveryUsedCapacity();
            if ($rootScope.IsPalettesRequired) {

                var otherItem = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode });
                if (otherItem.length > 0) {
                    $scope.AddWoodenPallet();
                }
            }
        }
    }

    // 5.c.1) Clear Graph Data.
    $scope.ClearGraph = function () {
        angular.forEach($rootScope.buindingPalettes, function (item, key) {
            item.PalettesWidth = 0;
        });
        $rootScope.TruckCapacityFullInTone = 0;
        $rootScope.TruckCapacityFullInPercentage = 0;
    }

    // 12 Load Item List By Active User.
    $scope.LoadItemListByUser = function () {
        
        var requestData =
            {
                ServicesAction: 'LoadAllProducts',
                CompanyId: $scope.ActiveCompanyId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data;
            $scope.bindallproduct = resoponsedata.Item.ItemList;
            console.log('Item List');
        });
    }
    $scope.LoadItemListByUser();

    // 10 Load Receiving Location Balance Capacity By Delivery Location Code And By Proposed Delivery Date.
    $scope.GetReceivingLocationBalanceCapacity = function (deliverylocationId, proposedDeliveryDate) {
        
        var requestData =
            {
                ServicesAction: 'GetReceivingLocationBalanceCapacity',
                CompanyId: $scope.ActiveCompanyId,
                ShipTo: deliverylocationId,
                ProposedDeliveryDate: proposedDeliveryDate,
                EnquiryId: $scope.EnquiryId,
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data.Json.BalanceCapacity;
            $scope.DeliveryUsedCapacity = resoponsedata;

        });
    }


    // 13 Search Functionality And Select Index Change Event Of Item List (Search Control).
    $scope.ItemSearchInputDefaultSetting = function () {
        $scope.SearchControl = {
            InputItem: '',
            FilterAutoCompletebox: ''
        };
        $scope.selectedRow = -1;
        $scope.showItembox = false;
        $rootScope.foundResult = false;
    }
    $scope.ItemSearchInputDefaultSetting();
    $scope.ItemInputSelecteChangeEvent = function (input) {
        
        if (input.length > 0) {
            $scope.showItembox = true;
            $scope.selectedRow = 0;
        } else {
            $scope.showItembox = false;
            $scope.selectedRow = -1;
        }
        $scope.SearchControl.FilterAutoCompletebox = input;
    }
    $scope.ClearItemInputSearchbox = function () {
        
        $scope.Allocation = 'NA';
        $scope.showItembox = false;
        $scope.ClearItemRecord();
    }

    // 14.a) Get Item Pending Allocation

    $scope.GetPendingAllocation = function (Allocation, quantity, currentOrder, itemId, ItemList) {
        
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
            
            if (productNameStrupdate.length > 0) {
                for (var j = 0; j < productNameStrupdate.length; j++) {
                    total += parseFloat(productNameStrupdate[j].ProductQuantity);
                }
            }
        }

        return total;
    }

    $scope.CheckForNewQty = function (itemId, ItemType, qty, productNameStr, numberOfExtraPallets) {
        
        var QtyArraynew = [];
        var truckfullintonr = $rootScope.TruckCapacityFullInTone;
        var palletsCorrcerwght = $scope.PalettesCorrectWeight;
        var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
        var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();
        var palettesWeight = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        var editedItemQuantity = 0;

        if ($scope.IsItemEdit) {
            var item = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemId) === parseInt(itemId); });
            editedItemQuantity = item[0].ProductQuantity;
        }

        var avlPalletQty = 0;
        var pendingweight = 0;
        if (numberOfExtraPallets > 0) {
            //avlPalletQty = (((parseFloat(numbersofpalettes) * $scope.NumberOfExtraPalettes) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor)));
            avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor))) * numberOfExtraPallets;

        }
        else {
            avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * parseFloat(productNameStr[0].ConversionFactor));

        }

        var avlPallet = parseInt($scope.TruckCapacityPalettes) - (Math.ceil(palletsCorrcerwght));
        
        //var checkKegQtyOnePallets = parseFloat(productNameStr[0].ConversionFactor) * 2;
        //var checkKegWeightPerPallet = (parseFloat(checkKegQtyOnePallets) * parseFloat(productNameStr[0].WeightPerUnit)) + (palettesWeight * 2);

        

        var avlPalletWeight = (palettesWeight * (Math.ceil(avlPallet)));


        //var avlPalletBufferWeight = (palettesWeight * parseFloat(extraPaletteBufferWeight));
        //avlPalletWeight = avlPalletWeight - avlPalletBufferWeight;
        if (numberOfExtraPallets > 0) {
            //only for Keg
            pendingweight = ((parseFloat($scope.TruckCapacity)) - (parseFloat(truckfullintonr * 1000) + parseFloat(avlPalletWeight * numberOfExtraPallets)));
        }
        else {
            pendingweight = ((parseFloat($scope.TruckCapacity)) - (parseFloat(truckfullintonr * 1000) + parseFloat(avlPalletWeight)));

        }

        var avlWeightQty = parseFloat(parseFloat(pendingweight) + parseFloat(extraTruckBufferWeight)) / parseFloat(productNameStr[0].WeightPerUnit);
        QtyArraynew.push(parseInt(avlWeightQty));
        QtyArraynew.push(parseInt(avlPalletQty));
        
        var min = Math.min.apply(Math, QtyArraynew);

        min = parseInt(min) + parseInt(editedItemQuantity);


        if (parseInt(productNameStr[0].QtyPerLayer) > 0) {
            var g = parseInt((parseInt(min) / parseInt(productNameStr[0].QtyPerLayer)));
            $scope.IsItemLayerCheckQty = parseInt(g) * parseInt(productNameStr[0].QtyPerLayer);
            if ($scope.IsItemLayerCheckQty > $scope.CheckAllocatonPresent) {
                var validQty = $scope.Allocation;
            }
            else {
                var validQty = $scope.IsItemLayerCheckQty;
            }

        }
        else {
            if ($scope.CheckAllocatonPresent != 'NA') {
                if (min > $scope.Allocation) {
                    var validQty = $scope.Allocation;
                }
                else {
                    var validQty = min;
                }
            }
            else {
                var validQty = min;
            }
        }

        return validQty;
    }



    $scope.CheckForQty = function (itemId, ItemType, qty, productNameStr, numberOfExtraPalletse) {



        //$scope.CheckForNewQty(itemId, ItemType, qty, productNameStr);
        
        var QtyArray = [];
        //QtyArray.push(qty);
        if (qty == "") {
            qty = 1;
        }


        var totalWeight = parseFloat(productNameStr[0].WeightPerUnit) * parseFloat(qty);
        var truckTotalPalettes = parseFloat(qty) / parseFloat(productNameStr[0].ConversionFactor);

        var truckTotalExtraPalettes = 0;
        var numbersofpalettes = 0
        if ($scope.NumberOfExtraPalettes > 0) {
            truckTotalExtraPalettes = (truckTotalPalettes / numberOfExtraPalletse);
        }
        var totalNumberOfPalettes = 0;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {

            var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');
            var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
            var truckTotalPalettes1 = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);
            var numbersofpalettes = truckTotalPalettes1;

            numbersofpalettes = parseInt($scope.TruckCapacityPalettes) - numbersofpalettes;

            var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemId) === parseInt(itemId) & parseInt(el.ItemType) === parseInt(ItemType) & parseInt(el.GratisOrderId) === 0; });
            
            var enquiryProductGuid = '';
            if (productNameStrupdate.length > 0) {
                enquiryProductGuid = productNameStrupdate[0].EnquiryProductGUID;
            }
            totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);


        }

        var palettesWeight = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
        if (palettesWeight !== "") {
            var totalWeightWithPalettes = 0;
            var weightPerPalettes = parseFloat(palettesWeight);
            if ($scope.IsPalettesRequired) {
                totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(numbersofpalettes)));
            }
            
            totalWeight = totalWeightWithPalettes
        }

        truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);


        var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
        var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

        var truckCapacity = $scope.TruckCapacity;
        var truckCapacityPalettes = $scope.TruckCapacityPalettes;

        var consumepalettes = $scope.PalettesCorrectWeight;
        var consumeWeigth = $scope.TruckCapacityFullInTone;

        var avlPalletQty = 0;

        if (numberOfExtraPalletse > 0) {
            //avlPalletQty = (((parseFloat(numbersofpalettes) * $scope.NumberOfExtraPalettes) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor)));
            avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes)) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor))) * numberOfExtraPalletse;
        }
        else {
            avlPalletQty = ((parseFloat($scope.TruckCapacityPalettes) - parseFloat($scope.PalettesCorrectWeight)) * parseFloat(productNameStr[0].ConversionFactor));
        }


        var avlPalletWeight = parseFloat(parseFloat(avlPalletQty) + parseFloat(extraPaletteBufferWeight)) / parseFloat(productNameStr[0].ConversionFactor);
        if (palettesWeight !== "") {
            var totalWeightWithPalettes = 0;
            var weightPerPalettes = parseFloat(palettesWeight);
            if ($scope.IsPalettesRequired) {

                if ($scope.NumberOfExtraPalettes > 0) {
                    totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(numbersofpalettes * numberOfExtraPalletse)));
                }
                else {

                    totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(numberOfExtraPalletse)));
                }
            }
            


            avlPalletWeight = totalWeightWithPalettes;


        }


        
        var pendingweight = (parseFloat($scope.TruckCapacity) - (parseFloat(consumeWeigth * 1000) + parseFloat(avlPalletWeight)));

        var avlWeightQty = parseFloat(parseFloat(pendingweight) + parseFloat(extraTruckBufferWeight)) / parseFloat(productNameStr[0].WeightPerUnit);
        QtyArray.push(parseInt(avlWeightQty));
        QtyArray.push(parseInt(avlPalletQty));
        
        var min = Math.min.apply(Math, QtyArray);
        var validQty = min;
        return validQty;

    }

    // 14 Load Selected Item Information and Applicable Rules For Selected Item.
    $scope.getItemPrice = function (itemId, associatedCount) {
        try {
            
            $rootScope.Throbber.Visible = true;
            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
            if (productNameStr.length > 0) {
                $scope.ItemPrices = productNameStr[0].Amount;
                if (associatedCount === 0) {
                    $scope.ItemDepositeAmount = productNameStr[0].CurrentDeposit;
                } else {
                    $scope.ItemDepositeAmount = 0;
                }
                $scope.UOM = productNameStr[0].UOM;
                $scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
                $scope.SearchControl.InputItem = productNameStr[0].ItemNameCode;
                $scope.ItemField.itemId = productNameStr[0].ItemId;
                $scope.showItembox = false;
                focus('inputItemsQty');
            }
            else {
                $scope.ItemPrices = 0;
                $scope.ItemCodeForDeposite = '';
            }

            // Save On Item Selection Item Deposite Amount.
            var requestDataforItemDeposite =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: itemId,
                    ObjectType: "Item Deposite  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'On Item Selection In Enquiry Page For Item Deposite Amount. Item : ' + itemId + ' And Amount : ' + $scope.ItemDepositeAmount + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var consolidateApiParamaterItemDeposite =
                {
                    Json: requestDataforItemDeposite,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterItemDeposite).then(function (responseLogItemDepositeValidation) {

            });


            $scope.ItemCurrentStockPosition = 0;
            var requestData =
                {
                    ServicesAction: 'GetProductCurrenttStockPosition',
                    ProductCode: productNameStr[0].ItemCode,
                    DeliveryLocationCode: $rootScope.BranchPlantCodeEdit
                };

            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (responseItemStock) {
                
                if (responseItemStock.data.ItemStock !== undefined) {
                    $scope.ItemCurrentStockPosition = responseItemStock.data.ItemStock.CurrentStockPosition;
                } else {
                    $scope.ItemCurrentStockPosition = 0;
                }

                //GetAllocation..
                var requestData =
                    {
                        ServicesAction: 'GetItemAllocation',
                        DeliveryLocation: {
                            LocationId: $rootScope.DeliveryLocationId,
                            DeliveryLocationCode: $rootScope.DeliveryLocationCode
                        },
                        CompanyId: $scope.ActiveCompanyId,
                        CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                        Company: {
                            CompanyId: $scope.ActiveCompanyId,
                            CompanyMnemonic: $scope.ActiveCompanyMnemonic
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
                var jsonobject = {};
                jsonobject.Json = requestData;
                GrRequestService.ProcessRequest(jsonobject).then(function (responseAllocation) {
                    
                    if (responseAllocation.data !== null) {
                        var responseStr = responseAllocation.data.Json;
                        var currentOrder = $scope.OrderData;
                        $scope.CheckAllocatonPresent = responseStr.Allocation;
                        if (responseStr.Allocation != 'NA') {
                            if ($scope.IsItemEdit) {

                                var UsedAllocationQty = $scope.GetPendingAllocation('NA', 0, currentOrder, itemId, responseStr.ItemList);
                                $scope.Allocation = parseInt(responseStr.Allocation) - parseInt(UsedAllocationQty);
                                $scope.ActualAllocation = parseInt(responseStr.Allocation);
                            }
                            else {

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

                    // Save On Item Selection Item Allocation.
                    var requestDataforItemAllocation =
                        {
                            UserId: $rootScope.UserId,
                            ObjectId: itemId,
                            ObjectType: "Item Allocation  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                            ServicesAction: 'CreateLog',
                            LogDescription: 'On Item Selection In Enquiry Page For Item Allocation. Item : ' + itemId + ' And Allocation : ' + $scope.Allocation + 'and ' + $scope.ActualAllocation + '.',
                            LogDate: GetCurrentdate(),
                            Source: 'Portal',
                        };
                    var consolidateApiParamaterItemAllocation =
                        {
                            Json: requestDataforItemAllocation,
                        };

                    GrRequestService.ProcessRequest(consolidateApiParamaterItemAllocation).then(function (responseLogItemAllocationValidation) {

                    });



                    //Get DepositeAmount
                    //Checking For Deposite Amount Available For Selected Product
                    if (associatedCount == 0) {

                        //var requestData =
                        //    {
                        //        ServicesAction: 'GetRuleValue',
                        //        LocationId: $rootScope.DeliveryLocationId,
                        //        DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                        //        CompanyId: $scope.ActiveCompanyId,
                        //        CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                        //        RuleType: 7,
                        //        SKUCode: $scope.ItemCodeForDeposite
                        //    };
                        //var jsonobject = {};
                        //jsonobject.Json = requestData;
                        //GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                        //    
                        //    var responseStr = response.data.Json;

                        //    if (responseStr.RuleValue != '' && responseStr.RuleValue != undefined) {
                        //        $scope.ItemDepositeAmount = parseFloat(responseStr.RuleValue);

                        //    } else {
                        //        $scope.ItemDepositeAmount = 0;
                        //    }

                        //Get ExtraPalettes
                        //Checking For Number Of ExtraPalettes
                        //$scope.NumberOfExtraPalettes = 0;

                        //var requestData =
                        //    {
                        //        ServicesAction: 'GetRuleValue',
                        //        LocationId: $rootScope.DeliveryLocationId,
                        //        DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                        //        CompanyId: $scope.ActiveCompanyId,
                        //        CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                        //        RuleType: 3,
                        //        UOM: $scope.UOM
                        //    };
                        //var jsonobject = {};
                        //jsonobject.Json = requestData;
                        //GrRequestService.ProcessRequest(jsonobject).then(function (responseExtraPalettes) {
                        //    
                        //    var responseExtraPalettesStr = responseExtraPalettes.data.Json;

                        //    if (responseExtraPalettesStr.RuleValue != '' && responseExtraPalettesStr.RuleValue != undefined) {
                        //        $scope.NumberOfExtraPalettes = parseInt(responseExtraPalettesStr.RuleValue);
                        //        if ($scope.NumberOfExtraPalettes > 0) {
                        //            $scope.NumberOfExtraPalettes = $scope.NumberOfExtraPalettes;
                        //        }
                        //    }


                        // Save On Item Selection Extra Pallets.
                        //var requestDataforExtraPallets =
                        //    {
                        //        UserId: $rootScope.UserId,
                        //        ObjectId: itemId,
                        //        ObjectType: "Extra Pallets  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                        //        ServicesAction: 'CreateLog',
                        //        LogDescription: 'On Item Selection In Enquiry Page For Extra Pallets. Item : ' + itemId + ' And Extra Pallets : ' + $scope.NumberOfExtraPalettes + '.',
                        //        LogDate: GetCurrentdate(),
                        //        Source: 'Portal',
                        //    };
                        //var consolidateApiParamaterExtraPallets =
                        //    {
                        //        Json: requestDataforExtraPallets,
                        //    };

                        //GrRequestService.ProcessRequest(consolidateApiParamaterExtraPallets).then(function (responseLogItemAllocationValidation) {

                        //});


                        // Check Is ItemLayer Allow for selected item using rule
                        var requestLayerData =
                            {
                                ServicesAction: 'GetRuleValue',
                                CompanyId: $scope.ActiveCompanyId,
                                CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                                DeliveryLocation: {
                                    LocationId: $rootScope.DeliveryLocationId,
                                    DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                                },
                                Company: {
                                    CompanyId: $scope.ActiveCompanyId,
                                    CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                                },
                                RuleType: 4,
                                Item: {
                                    SKUCode: productNameStr[0].ItemCode
                                }

                            };

                        $scope.IsItemLayerAllow = false;
                        var jsonLayerobject = {};
                        jsonLayerobject.Json = requestLayerData;
                        GrRequestService.ProcessRequest(jsonLayerobject).then(function (responseItemLayer) {
                            
                            var responseItemLayerStr = responseItemLayer.data.Json;
                            if (responseItemLayerStr.RuleValue != '' && responseItemLayerStr.RuleValue != undefined) {

                                if (responseItemLayerStr.RuleValue === '1') {
                                    $scope.IsItemLayerAllow = true;
                                }
                                else {
                                    $scope.IsItemLayerAllow = false;
                                }


                            }


                            var noOfExtraPalettes = 0;
                            
                            var requestData =
                                {
                                    ServicesAction: 'GetRuleValue',
                                    CompanyId: $scope.ActiveCompanyId,
                                    CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                                    DeliveryLocation: {
                                        LocationId: $rootScope.DeliveryLocationId,
                                        DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                                    },
                                    Company: {
                                        CompanyId: $scope.ActiveCompanyId,
                                        CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                                    },
                                    RuleType: 3,
                                    Item: {
                                        UOM: $scope.UOM
                                    }

                                };
                            var jsonobject = {};
                            jsonobject.Json = requestData;
                            GrRequestService.ProcessRequest(jsonobject).then(function (responseExtraPalettes) {
                                

                                $rootScope.Throbber.Visible = false;

                                var responseExtraPalettesStr = responseExtraPalettes.data.Json;

                                if (responseExtraPalettesStr.RuleValue != '' && responseExtraPalettesStr.RuleValue != undefined) {
                                    noOfExtraPalettes = parseInt(responseExtraPalettesStr.RuleValue);
                                    if (noOfExtraPalettes > 0) {
                                        noOfExtraPalettes = noOfExtraPalettes;
                                    }
                                }
                                var validQty = $scope.CheckForNewQty(itemId, productNameStr[0].ItemType, $scope.ItemField.inputItemsQty, productNameStr, noOfExtraPalettes);
                                $scope.MaxPermissibleQuantity = validQty;
                            })
                        });

                        //});

                        //  });
                    }
                });

            })
        } catch (e) {
            $rootScope.Throbber.Visible = false;
        }
    }




    // 15 Add Default First Row of Blank Order With Required Properties.
    $scope.AddDefaultTruck = function () {
        
        $scope.CurrentOrderGuid = generateGUID();
        $scope.PalettesCorrectWeight = 0;
        var orders = {
            OrderGUID: $scope.CurrentOrderGuid,
            TruckName: '',
            DeliveryLocation: '',
            TruckSize: '',
            ProposedETDStr: '',
            EnquiryId: 0,
            RequestDate: $rootScope.DateField.RequestDate,
            TotalWeight: 0,
            TruckCapacity: 0,
            TruckPallets: 0,
            TotalProductPallets: 0,
            IsTruckFull: false,
            TruckSizeId: $rootScope.TruckSizeId,
            ShipTo: 0,
            SoldTo: $scope.ActiveCompanyId,
            IsActive: true,
            OrderProductList: []
        }
        $scope.OrderData.push(orders);

    }


    //16.a) Calculate Total Weight.
    $scope.getTotalAmount = function (weight, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {
        
        var total = 0;
        if (currentOrder.length > 0) {
            for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {

                if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
                    total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
                }
            }
            total += parseFloat(weight) * parseFloat(quantity);
        }
        return total;
    }

    //16.b) Calculate Total Pallets.
    $scope.getTotalPalettes = function (palettes, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {
        
        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
                total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            }
        }
        if (parseFloat(quantity) > 0) {
            total += parseFloat(quantity) / parseFloat(palettes);
        }
        if ($rootScope.TruckCapacityPalettes == 0) {
            total = 0;
        }
        if (!$rootScope.IsPalettesRequired) {
            total = 0;
        }
        return total;
    }

    //16.c) Calculate Extra Pallets.
    $scope.getTotalExtraPalettes = function (palettes, quantity, currentOrder, itemId, NumberOfExtraPalettes, ItemType, enquiryProductGuid) {
        
        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode && currentOrder[0].OrderProductList[i].NumberOfExtraPalettes > 0) {
                var totalPalets = parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
                total += (totalPalets / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
            }
        }
        if (NumberOfExtraPalettes > 0) {
            if (parseFloat(quantity) > 0) {
                var totalPalets = parseFloat(quantity) / parseFloat(palettes);
                total += (totalPalets / NumberOfExtraPalettes);
            }
        }
        if ($rootScope.TruckCapacityPalettes == 0) {
            total = -1;
        }
        if (!$rootScope.IsPalettesRequired) {
            total = 0;
        }
        return total;
    }

    //16.d) Add Extra Pallets.
    $scope.AddExtraPalleter = function (currentOrder, enquiryProductGuid, ConversionFactor, qty, PrimaryUnitOfMeasure) {
        
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
                
                var value = newArr[name];
                newArr[name] = Math.ceil(value);
                TotalPalettes += Math.ceil(value);
            }
        }
        return TotalPalettes;
    }






    // 16 Add selected product with price and quantity by all required validation.
    $scope.addProducts = function (itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode, noOfExtraPalettes) {
        

        if (qty === "" || qty === undefined || qty === null) {
            // $rootScope.ValidationErrorAlert('Please enter a valid quantity.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnterValidQuantity), 'error', 3000);
            return false;
        }

        if (parseInt(qty) < 1) {
            //$rootScope.ValidationErrorAlert('Please enter a valid quantity.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnterValidQuantity), 'error', 3000);
            return false;
        }

        var addPromotionQty = qty;

        if ($rootScope.DeliveryLocationId > 0 && ($rootScope.TruckSizeId > 0 || $rootScope.IsSelfCollect === true)) {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
            if (currentOrder.length > 0) {

                var totalWeightWithPalettes = 0;
                var totalWeightWithBuffer = 0;
                var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });

                // Check Validation Of Max Number Of Item Allow To Add In OrderProduct.
                if (!$scope.IsItemEdit) {
                    var numberOfProductAdded = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 32 && el.ProductCode !== $scope.WoodenPalletCode; });
                    if (numberOfProductAdded.length > (parseInt($scope.NumberOfProductAdd) - 1)) {
                        //$rootScope.ValidationErrorAlert('You can not add more the ' + $scope.NumberOfProductAdd + ' products.', 'error', 3000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_NumberOfProducts, $scope.NumberOfProductAdd), 'error', 3000);
                        return false;
                    }
                }
debugger;
                // Item Layer validation according to quantity.
                if (parseInt(productNameStr[0].QtyPerLayer) > 0) {
                    if ($scope.IsItemLayerAllow) {
                        var g = (parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer));
                        if ((parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer)) > 0) {
                            if ((parseInt(ItemType) == 31)) {
                                $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                            }



                            // Save Item Layer Validation Log.
                            var requestDataforItemLayer =
                                {
                                    UserId: $rootScope.UserId,
                                    ObjectId: itemId,
                                    ObjectType: "Item Layer  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                                    ServicesAction: 'CreateLog',
                                    LogDescription: 'Click On Add Product Button In Enquiry Page For Item Layer Validation. Item : ' + itemId + ' And Quantity : ' + qty + ' Layer Validation Allow : ' + $scope.IsItemLayerAllow + ' Quantity Per Layer ' + parseInt(productNameStr[0].QtyPerLayer) + '.',
                                    LogDate: GetCurrentdate(),
                                    Source: 'Portal',
                                };
                            var consolidateApiParamaterItemLayer =
                                {
                                    Json: requestDataforItemLayer,
                                };

                            GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

                            });

                            //$rootScope.ValidationErrorAlert('This item can be ordered in complete layers, please adjust ordered quantity.', 'error', 3000);

                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_CompleteLayer), 'error', 3000);
                            return false;
                        }
                    }
                }

                


                // Save Item Layer Validation Log.
                var requestDataforItemLayer =
                    {
                        UserId: $rootScope.UserId,
                        ObjectId: itemId,
                        ObjectType: "Item Layer  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                        ServicesAction: 'CreateLog',
                        LogDescription: 'Click On Add Product Button In Enquiry Page For Item Layer Validation. Item : ' + itemId + ' And Quantity : ' + qty + ' Layer Validation Allow : ' + $scope.IsItemLayerAllow + ' Quantity Per Layer ' + parseInt(productNameStr[0].QtyPerLayer) + '.',
                        LogDate: GetCurrentdate(),
                        Source: 'Portal',
                    };
                var consolidateApiParamaterItemLayer =
                    {
                        Json: requestDataforItemLayer,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

                });


                
                var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return el.ItemId === itemId & parseInt(el.ItemType) === parseInt(ItemType) & parseInt(el.GratisOrderId) === 0; });
                var enquiryProductGuid = '';
                if (productNameStrupdate.length > 0) {
                    enquiryProductGuid = productNameStrupdate[0].EnquiryProductGUID;
                }

                
                var checkPromotionItemPresent = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === parseInt(31) && el.ProductCode === productNameStr[0].ItemCode; });
                if (checkPromotionItemPresent.length == 0) {
                    var chkVlaue = $scope.CheckBeforeAddingPromationItem(productNameStr[0].ItemCode, itemId, parseInt(qty), ItemType, productNameStr, enquiryProductGuid, GratisOrderId, noOfExtraPalettes);
                    if (!chkVlaue && !$rootScope.IsSelfCollect) {
                        return false;
                    }
                }

                // Check Item Allocation 

                if (parseInt(GratisOrderId) == 0) {

                    var checkAllocationValue = $scope.CheckAllocation($scope.Allocation, qty, $scope.OrderData, itemId);
                    if (!checkAllocationValue) {
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }

                        
                        //$rootScope.ValidationErrorAlert('It seems like you are tyring to order the item more than the allocated quantity. You cannot order this item more than ' + $scope.Allocation + ' ' + productNameStr[0].UOM + '', 'error', 10000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_MorethanAllocationQty, $scope.Allocation, productNameStr[0].UOM), 'error', 3000);
                        return false;
                    }
                }


                var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
                var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
                //var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, $scope.NumberOfExtraPalettes, ItemType, enquiryProductGuid);
                var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, noOfExtraPalettes, ItemType, enquiryProductGuid);


                var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
                if (bufferWeight !== "") {
                    totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
                }
                var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);

                var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
                if (weightPerPalettes !== "") {
                    if ($rootScope.IsPalettesRequired) {
                        totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
                    }
                    totalWeight = totalWeight + totalWeightWithPalettes
                }
                truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);

                var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
                var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

                if (productNameStrupdate.length > 0) {
                    if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect) {
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;

                    } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect) {

                        var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
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

                                addPromotionQty = productNameStrupdate[0].ProductQuantity;
                            }
                            productNameStrupdate[0].ItemPrices = ((parseInt(ItemType) == 31 ? 0 : parseFloat(productNameStrupdate[0].ItemPricesPerUnit)) * parseInt(productNameStrupdate[0].ProductQuantity));
                            productNameStrupdate[0].ItemTotalDepositeAmount = parseFloat(parseFloat(productNameStrupdate[0].DepositeAmountPerUnit) * parseInt(productNameStrupdate[0].ProductQuantity));
                        }
                        
                        $scope.ReloadGraph(currentOrder, 0);
                        $scope.ClearItemRecord();
                    }
                }
                else {
                    
                    if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect) {
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;

                    } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect) {
                        var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' pallets. Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;
                    }

                    else {

                        if (currentOrder.length > 0) {
                            $rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
                            $rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);
                            angular.forEach($rootScope.buindingPalettes, function (item, key) {
                                item.PalettesWidth = 0;
                            });

                            if ($rootScope.IsPalettesRequired) {
                                for (var i = 0; i < Math.ceil(truckTotalPalettes) ; i++) {
                                    if (i < parseInt($rootScope.buindingPalettes.length)) {
                                        $rootScope.buindingPalettes[i].PalettesWidth = 100;
                                    }
                                }
                            }
                            currentOrder[0].TruckName = $rootScope.TruckSize;
                            currentOrder[0].TruckCapacity = $rootScope.TruckCapacityInTone;
                            currentOrder[0].TruckSizeId = $rootScope.TruckSizeId;
                            currentOrder[0].ShipTo = $rootScope.DeliveryLocationId;
                            currentOrder[0].DeliveryLocationName = $rootScope.DeliveryLocationName;
                            currentOrder[0].RequestDate = $rootScope.DateField.RequestDate;
                            currentOrder[0].OrderProposedETD = $rootScope.ProposedDate;
                            currentOrder[0].NoOfDays = $rootScope.NoOfDays;
                            currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes) + parseFloat(truckTotalExtraPalettes));
                            currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
                            currentOrder[0].TruckWeight = $rootScope.TruckCapacityFullInTone;
                            if (parseInt(currentOrder[0].EnquiryId) === 0) {
                                currentOrder[0].CurrentState = 1;
                            }

                            if (productNameStr[0].Amount == undefined) {
                                productNameStr[0].Amount = 0;
                            }

                            if (parseInt(GratisOrderId) !== 0) {
                                var gratisorder = currentOrder[0].OrderProductList.filter(function (el) { return el.GratisOrderId === GratisOrderId && el.ItemId === itemId; });

                                if (gratisorder.length > 0) {
                                    return false;
                                }
                            }

                            
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
                                NumberOfExtraPalettes: noOfExtraPalettes,
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
                        
                        $scope.ClearItemRecord();
                    }

                }


                if ($rootScope.IsPalettesRequired) {
                    
                    $scope.AddWoodenPallet();
                }

                var chkaddpro = $scope.AddPromationItem(productNameStr[0].ItemCode, itemId, parseInt(addPromotionQty), ItemType);

                if (!chkaddpro && !$rootScope.IsSelfCollect) {

                    var dd = $scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $rootScope.TruckCapacity, $rootScope.TruckCapacityPalettes, totalWeightWithPalettes);
                    if (dd) {
                        var dd = $scope.AddTruckControl;
                        if (!dd._isShown) {
                            $scope.CloseViewGratisOrderControl();
                            currentOrder[0].IsTruckFull = true;
                            $scope.AddTruckHeaderMessage = String.format($rootScope.resData.res_CreateInquiryPage_TruckFullConfirmationHeaderMessage);
                            $scope.AddTruckBodymessage = String.format($rootScope.resData.res_CreateInquiryPage_TruckFullConfirmationMessage);
                            $scope.OpenAddTruckControl();
                        }
                    }
                    else {
                        currentOrder[0].IsTruckFull = false;
                    }
                } else if ($rootScope.IsSelfCollect) {
                    currentOrder[0].IsTruckFull = true;
                }
            }
        }
        else {
            if ($rootScope.TruckSizeId == 0) {
                if ($rootScope.DeliveryLocationId == 0 && $rootScope.IsSelfCollect === true) {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectDeliveryLocation), 'error', 8000);
                }
                else {
                    //$rootScope.ValidationErrorAlert('Please seletect one of the truck sizes before you proceed further with your order.', 'error', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectTruckSize), 'error', 8000);
                }
            }
            else if ($rootScope.DeliveryLocationId == 0) {
                //$rootScope.ValidationErrorAlert('Please seletect one of the delivery locations before you proceed further with your order.', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectDeliveryLocation), 'error', 8000);
            }
            else {
                //$rootScope.ValidationErrorAlert('Please select delivery location or truck.', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectTruckAndDeliveryLocation), 'error', 8000);
            }
        }
    }


    ///Check For Extra Pallet Added
    $scope.CheckingExtraPalettesBeforeAddingItem = function (itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode) {
        
        if (itemId != 0 && itemId != "") {
            $rootScope.Throbber.Visible = true;
            $scope.ItemField.inputItemsQty = 0;
            var noOfExtraPalettes = 0;
            var requestData =
                {
                    ServicesAction: 'GetRuleValue',
                    CompanyId: $scope.ActiveCompanyId,
                    CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                    DeliveryLocation: {
                        LocationId: $rootScope.DeliveryLocationId,
                        DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                    },
                    Company: {
                        CompanyId: $scope.ActiveCompanyId,
                        CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                    },
                    RuleType: 3,
                    Item: {
                        UOM: $scope.UOM
                    }


                };
            var jsonobject = {};
            jsonobject.Json = requestData;

            var requestDataforExtraPalettes =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: itemId,
                    ObjectType: "Extra Palettes Rules  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'Extra Palettes Rules ' + JSON.stringify(jsonobject) + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var consolidateApiParamaterExtraPalettes =
                {
                    Json: requestDataforExtraPalettes,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterExtraPalettes).then(function (responseLogItemDepositeValidation) {

            });





            GrRequestService.ProcessRequest(jsonobject).then(function (responseExtraPalettes) {
                
                var responseExtraPalettesStr = responseExtraPalettes.data.Json;

                if (responseExtraPalettesStr.RuleValue != '' && responseExtraPalettesStr.RuleValue != undefined) {
                    noOfExtraPalettes = parseInt(responseExtraPalettesStr.RuleValue);
                    if (noOfExtraPalettes > 0) {
                        noOfExtraPalettes = noOfExtraPalettes;
                    }
                }


                // Save On Item Selection Extra Pallets.
                var requestDataforExtraPalletsOutput =
                    {
                        UserId: $rootScope.UserId,
                        ObjectId: itemId,
                        ObjectType: "Extra Pallets Output : EnquiryId " + $rootScope.EditedEnquiryId + "",
                        ServicesAction: 'CreateLog',
                        LogDescription: 'On Item Selection In Enquiry Page For Extra Pallets. Item : ' + itemId + ' And Extra Pallets : ' + $scope.NumberOfExtraPalettes + '.',
                        LogDate: GetCurrentdate(),
                        Source: 'Portal',
                    };
                var consolidateApiParamaterExtraPalletsoutput =
                    {
                        Json: requestDataforExtraPalletsOutput,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamaterExtraPalletsoutput).then(function (responseLogItemAllocationValidation) {

                });




                $rootScope.Throbber.Visible = false;
                $scope.addProducts(itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode, noOfExtraPalettes);

            });
        }
        else {
            $rootScope.IsProductValidation = true;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectProduct), 'error', 8000);
        }

    }



    // 17 Add Wooden Pallet as a item in OrderProduct.
    $scope.AddWoodenPallet = function () {

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {

            var qty = currentOrder[0].NumberOfPalettes;

            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemCode === $scope.WoodenPalletCode; });
            var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode & parseInt(el.GratisOrderId) === 0; });
            
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

    // 18 Filter wooden pallet item from Item List.
    $scope.RemoveWoodenPalletItem = function (item) {
        return item.ProductCode !== $scope.WoodenPalletCode;
    };

    // 19 Clear Selected Item and Item Details Field.
    $scope.ClearItemRecord = function () {
        $scope.ItemField.itemsName = "";
        $scope.ItemField.inputItemsQty = "";
        $scope.ItemField.itemId = "";
        $scope.selectedRow = -1;
        $scope.SearchControl.InputItem = "";
        $scope.SearchControl.FilterAutoCompletebox = "";
        $scope.EnquiryProductGUID = "";
        $scope.disableInput = false;
        $scope.ItemPrices = 0;
        $scope.ItemDepositeAmount = 0;
        $scope.UOM = '-';
        $scope.MaxPermissibleQuantity = '-';
        $scope.IsItemEdit = false;
        $scope.IsItemLayerAllow = false;
        $scope.CalculateDeliveryUsedCapacity();
        focus('ItemListAutoCompleteBox_value');
    }

    // 20 Total all items Price, Tax And Deposite Amount.
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

    // 21 Edit Item From Order Product List By Item Id.
    $scope.EditProduct = function (OrderGUID, itemId, EnquiryProductGUID) {
        

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });

        if (currentOrder.length > 0) {
            if (currentOrder[0].OrderProductList.length > 0) {
                var productNameStr = currentOrder[0].OrderProductList.filter(function (el) { return el.EnquiryProductGUID === EnquiryProductGUID & parseInt(el.GratisOrderId) === 0; });
                $scope.IsItemEdit = true;
                $scope.ItemPrices = productNameStr[0].ItemPricesPerUnit;
                $scope.ItemId = productNameStr[0].ItemId;
                $scope.EnquiryProductGUID = EnquiryProductGUID;
                $scope.SearchControl.InputItem = productNameStr[0].ItemName;
                $scope.disableInput = true;
                $scope.ItemField.itemId = itemId;
                $scope.ItemField.inputItemsQty = parseInt(productNameStr[0].ProductQuantity);
                $scope.Allocation = productNameStr[0].Allocation;
                $scope.IsItemLayerAllow = productNameStr[0].IsItemLayerAllow;
                //$scope.MaxPermissibleQuantity = parseInt(productNameStr[0].ProductQuantity);
                $scope.getItemPrice(itemId, 0);


                // Save Item Layer Validation Log.
                var requestDataforItemLayer =
                    {
                        UserId: $rootScope.UserId,
                        ObjectId: 0,
                        ObjectType: "Edit Product  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                        ServicesAction: 'CreateLog',
                        LogDescription: 'Click On Edit Product In Enquiry Page. Item ' + itemId + ' and quantity ' + parseInt(productNameStr[0].ProductQuantity) + ' and Enquiry List JSON ' + JSON.stringify(currentOrder) + '.',
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


    }

    // 22 Delete Item From Order Product List By Item Id.
    $scope.RemoveProduct = function (OrderGUID, ItemId, GratisOrderId) {
        

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

            //$scope.RemoveGratisOrderHeaderMessage = "Message";
            //$scope.RemoveGratisOrderBodymessage = "This is a Gratis order item. If you wish to remove this item from the order, entire Gratis order will be removed. Do you wish to proceed ?";
            //$scope.OpenRemoveGratisOrderControl();

            $scope.RemoveGratisOrderEvent();

        }
        else {
            //$scope.findAndRemove(currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) !== 31; }), 'ItemId', ItemId, 'EnquiryProductId');
            currentOrder[0].OrderProductList = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 30 || parseInt(el.ItemId) !== parseInt(ItemId) });
            $scope.RemovePromotionItem(currentOrder, ItemId);

            if (currentOrder[0].OrderProductList.length === 1) {
                if (currentOrder[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                    currentOrder[0].OrderProductList = [];
                }
            }
        }


        // Save Item Layer Validation Log.
        var requestDataforItemLayer =
            {
                UserId: $rootScope.UserId,
                ObjectId: ItemId,
                ObjectType: "Delete Product  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                ServicesAction: 'CreateLog',
                LogDescription: 'Click On delete Item . Item Id ' + ItemId + ' IsGratisItem ' + parseInt(GratisOrderId) + ' ',
                LogDate: GetCurrentdate(),
                Source: 'Portal',
            };
        var consolidateApiParamaterItemLayer =
            {
                Json: requestDataforItemLayer,
            };

        GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

        });



        $scope.ReloadGraph(currentOrder, 0);
    }

    // 23 Common Function To remove row from array using index.
    $scope.findAndRemove = function (array, property, value, primaryId) {
        for (i = 0; i < array.length; ++i) {
            if (array[i][property] === value) {
                if (array[i][primaryId] === 0) {
                    array.splice(i--, 1);
                }
                else {
                    array.splice(i--, 1);
                }
            }
        }

    };

    // 24 Function To remove Promotion Item.
    $scope.RemovePromotionItem = function (currentOrder, ParentItemId) {
        
        if (currentOrder.length > 0) {
            $scope.findAndRemove(currentOrder[0].OrderProductList, 'ParentItemId', ParentItemId, 'EnquiryProductId');
            if (currentOrder[0].OrderProductList.length === 1) {
                if (currentOrder[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                    currentOrder[0].OrderProductList = [];
                }
            }
        }
    }

    // 25 Initialize Gratis Modal Popup With Open and Close Events.
    $ionicModal.fromTemplateUrl('ViewGratisOrder.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.ViewGratisOrderControl = modal;
    });
    $scope.CloseViewGratisOrderControl = function () {
        $scope.ViewGratisOrderControl.hide();
    };
    $scope.OpenViewGratisOrderControl = function () {
        
        if ($scope.AssociatedOrderList.length > 0) {
            $scope.ViewGratisOrderControl.show();
        }
        else {
            //$rootScope.ValidationErrorAlert('No gratis order found.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_NoGratisFound), 'error', 8000);
        }
    };

    // 26 Load Gratis Order List By Delivery Location Code.
    $scope.LoadGratisOrderList = function (deliveryLocationId) {
        
        var requestData =
            {
                ServicesAction: 'LoadGratisOrderBySoldToId',
                CompanyId: $scope.ActiveCompanyId,
                ShipTo: deliveryLocationId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var responseStr = response.data;

            if (responseStr.Order != undefined) {
                if (responseStr.Order.OrderList != '') {
                    $scope.AssociatedOrderList = responseStr.Order.OrderList;
                    $scope.RemoveSelectedAssociatedOrder();
                }
            }

        });
    }






    // 27 Add Gratis Order Item In Order.
    $scope.AddAssociatedOrder = function (orderId) {
        
        var associatedOrder = $scope.AssociatedOrderList.filter(function (el) { return el.OrderId === orderId; });
        if (associatedOrder.length > 0) {
            for (var i = 0; i < associatedOrder[0].OrderProductsList.length; i++) {
                $scope.getItemPrice(associatedOrder[0].OrderProductsList[i].ItemId, associatedOrder.length);

                //$scope.addProducts(String(associatedOrder[0].OrderProductsList[i].ItemId), associatedOrder[0].OrderProductsList[i].ProductQuantity, associatedOrder[0].OrderId, 30, 0, '', 0);
                $scope.CheckingExtraPalettesBeforeAddingItem(String(associatedOrder[0].OrderProductsList[i].ItemId), associatedOrder[0].OrderProductsList[i].ProductQuantity, associatedOrder[0].OrderId, 30, 0, '');
            }
            $scope.RemoveSelectedAssociatedOrder();
        }

        var associatedOrderAvl = $scope.AssociatedOrderList.filter(function (el) { return el.IsSelected === false; });
        if (associatedOrderAvl.length == 0) {
            $scope.CloseViewGratisOrderControl();
        }

    }

    // 28 Remove Gratis Order Item Confirmation Popup.
    $ionicModal.fromTemplateUrl('RemoveGratisOrder.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.RemoveGratisOrderControl = modal;
    });
    $scope.CloseRemoveGratisOrderControl = function () {
        $scope.RemoveGratisOrderControl.hide();
    };
    $scope.OpenRemoveGratisOrderControl = function () {
        $scope.RemoveGratisOrderControl.show();
    };
    // 28.a) Remove Gratis Order Event.
    $scope.RemoveGratisOrderEvent = function () {
        
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.RemoveGratisOrderOrderGUID; });
        $scope.findAndRemove(currentOrder[0].OrderProductList, 'GratisOrderId', $scope.RemoveGratisOrderGratisOrderId, 'EnquiryProductId');

        if (currentOrder[0].OrderProductList.length === 1) {
            if (currentOrder[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                currentOrder[0].OrderProductList = [];
            }
        }
        $scope.RemoveSelectedAssociatedOrder();
        $scope.RemoveGratisOrderOrderGUID = '';
        $scope.RemoveGratisOrderGratisOrderId = '';
        $scope.ReloadGraph(currentOrder, 0);
        $scope.RemoveSelectedAssociatedOrder();
        $scope.CloseRemoveGratisOrderControl();
    }


    // 29 Truck Full Message Modal Popup.
    $ionicModal.fromTemplateUrl('AddTruck.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
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

    $scope.ClearItem = function () {
        $scope.Allocation = 'NA';
        $scope.ClearItemRecord();
    }

    // 30 Clear All Added Item.
    $scope.ClearAllItem = function () {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {
            currentOrder[0].IsTruckFull = false;
            currentOrder[0].OrderProductList = [];
            $scope.ReloadGraph(currentOrder, 0);
            $scope.ClearItemRecord();
        }
    }

    // 31 Check Validation For Promotion Item.
    $scope.CheckBeforeAddingPromationItem = function (itemCode, itemId, qty, ItemType, productNameStr, enquiryProductGuid, GratisOrderId, noOfExtraPalettes) {
        
        var totalWeightWithPalettes = 0;
        var chkvalid = true;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {

            if (!$scope.IsItemEdit) {
                enquiryProductGuid = '';
            }

            var promotionItem = $rootScope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
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
            var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, noOfExtraPalettes, ItemType, enquiryProductGuid);
            var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
            if (bufferWeight !== "") {
                totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
            }
            var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);
            var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
            if (weightPerPalettes !== "") {
                if ($rootScope.IsPalettesRequired) {
                    totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
                }
                totalWeight = totalWeight + totalWeightWithPalettes
            }
            truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);


            var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
            var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

            if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect) {
                //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                chkvalid = false;
            } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect) {

                var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
                chkvalid = false;
            }

        }
        return chkvalid;
    }

    // 32 Check Item Allocation Validation.
    $scope.CheckAllocation = function (Allocation, quantity, currentOrder, itemId) {
        
        var allowAllocatio = false;
        var total = 0;
        total += parseFloat(quantity);
        if (Allocation >= total) {
            allowAllocatio = true;
        }

        if (Allocation == 'NA') {
            allowAllocatio = true;
        }

        return allowAllocatio;
    }

    // 33 Check Truck Full Or Not.
    $scope.CheckWetherTruckIsFull = function (currentOrder, totalWeightWithBuffer, truckSize, palettesWeight, totalWeightWithPalettes, ItemType) {
        
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
        var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'string');
        if (weightPerPalettes !== "") {
            if ($rootScope.IsPalettesRequired) {
                totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes));
            }
            totaltruckWeight = totaltruckWeight + totalWeightWithPalettes;
        }

        var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
        var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

        $scope.ReloadGraph(currentOrder, 0);
        if ($rootScope.IsPalettesRequired) {
            
            var pallet = between(parseFloat($scope.PalettesCorrectWeight), (parseFloat(palettesWeight) - parseFloat($scope.PalettesBufferWeight)), parseFloat(parseFloat(palettesWeight) + parseFloat(extraPaletteBufferWeight)));
            if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight)) || pallet) {
                isFull = true;
            }
        }
        else {
            if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight))) {
                isFull = true;
            }
        }

        return isFull;
    }

    // 34 Add Promotional Item To Item List.
    $scope.AddPromationItem = function (itemCode, ItemId, qty, ItemType) {
        
        var addPromation = false;
        if (parseInt(ItemType) !== 31 && parseInt(ItemType) !== 30) {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
            if (currentOrder.length > 0) {

                var promotionItem = $rootScope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
                if (promotionItem.length === 0) {
                    $scope.Allocation = 'NA';
                    $scope.ActualAllocation = 'NA';
                }
                for (var i = 0; i < promotionItem.length; i++) {
                    var ItemQuanity = promotionItem[i].ItemQuanity;
                    var FocItemId = promotionItem[i].FocItemId;
                    var FocItemQuantity = promotionItem[i].FocItemQuantity;
                    if ((parseInt(qty) % parseFloat(ItemQuanity)) === 0) {
                        addPromation = true;
                        var totalNumberCanOrderFocItem = (parseInt(qty) / parseFloat(ItemQuanity));
                        var totalAmountOfQty = parseInt(FocItemQuantity) * totalNumberCanOrderFocItem;

                        //$scope.addProducts(FocItemId, totalAmountOfQty, 0, 31, ItemId, itemCode, 0);
                        $scope.CheckingExtraPalettesBeforeAddingItem(FocItemId, totalAmountOfQty, 0, 31, ItemId, itemCode);
                        if ($scope.ActiveCompanyType == 26) {
                            $scope.IsPromotion = true;
                        }
                        else {
                            $scope.IsPromotion = false;
                        }
                        $scope.Allocation = 'NA';
                        $scope.ActualAllocation = 'NA';
                        break;
                    }
                    else {
                        $scope.RemovePromotionItem(currentOrder, ItemId);
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

    // 35 Add New Truck.
    $scope.AddTruck = function () {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {
            currentOrder[0].IsTruckFull = true;
        }
        $scope.ClearGraph();
        $scope.AddTruckControl.hide();
        $scope.AddDefaultTruck();
        $scope.trmpProductId = 0;
    }

    // 36 Shorcut Key Event To Open, Close Truck Full And Add New Truck.
    $scope.AddNewTruckFunction = function (e) {
        
        if (e.charCode === 13) {
            $scope.AddTruck();
            focus('RemoveEnterEvent');
        }
    }
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

    // 37 Finalise Event To Move View Enquiry Page .
    $scope.CloseAddFinalize = function () {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {
            currentOrder[0].IsTruckFull = true;
        }
        $scope.AddTruckControl.hide();
        $scope.ViewInquiry();
    }
    $scope.ViewInquiry = function () {
        
        var concatOrder = false;
        var isTrue = true;
        if ($rootScope.IsSelfCollect === true) {
            if ($rootScope.DateField.RequestDate === "") {
                isTrue = false;
            }
            else {
                isTrue = true;
            }
        }
        if (isTrue === true) {
            if ($rootScope.TemOrderData != undefined) {
                if ($rootScope.TemOrderData.length > 0) {
                    $rootScope.TemOrderData = $rootScope.TemOrderData.concat($scope.OrderData)
                    $rootScope.TemOrderData = UniqueArraybyId($rootScope.TemOrderData, 'OrderGUID');
                    concatOrder = true;
                }
                else {
                    $rootScope.TemOrderData = $scope.OrderData;
                    concatOrder = false;
                }
            }
            else {
                $rootScope.TemOrderData = $scope.OrderData;
                concatOrder = false;
            }
            for (var i = 0; i < $rootScope.TemOrderData.length; i++) {
                if ($scope.CurrentOrderGuid === $rootScope.TemOrderData[i].OrderGUID) {
                    $rootScope.TemOrderData[i].RequestDate = $rootScope.DateField.RequestDate;
                }
                $rootScope.TemOrderData[i].OrderProposedETD = $rootScope.ProposedDate;
            }
            var fullTruckCount = $rootScope.TemOrderData.filter(function (el) { return el.IsTruckFull == true; });
            if (fullTruckCount.length > 0) {
                $rootScope.isEnquiryEdit = false;
                $rootScope.SavedEditEnquiry = false;
                $rootScope.EnquiryDetailId = 0;
                $scope.CurrentOrderGuid = '';
                $state.go("ViewCreateInquiry");
            }
            else {

            }

            // Save Item Layer Validation Log.
            var requestDataforItemLayer =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: 0,
                    ObjectType: "View Enquiry : EnquiryId " + $rootScope.EditedEnquiryId + "",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'Press On View Enquiry Button Enquiry List JSON ' + JSON.stringify($rootScope.TemOrderData) + '. and Enquiry is self collect or not :' + $rootScope.IsSelfCollect + '. and Is Order Concat :' + concatOrder + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var consolidateApiParamaterItemLayer =
                {
                    Json: requestDataforItemLayer,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

            });


        } else {
            //$rootScope.ValidationErrorAlert('Please Select Scheduling Date.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectScheduledDate), 'error', 8000);
        }
    };

    // 38 Filter Arrray By Unique Id.
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


    // 39 Load Edited Enquiry Function.
    $scope.LoadEditEnquiry = function () {
        
        if ($rootScope.isEnquiryEdit === true) {
            
            if ($rootScope.TemOrderData.length > 0) {
                $scope.OrderData = $rootScope.TemOrderData;
                var currentOrder = [];
                if ($rootScope.CurrentOrderGuid == '' || $rootScope.CurrentOrderGuid == undefined) {
                    currentOrder = $scope.OrderData.filter(function (el) { return el.IsTruckFull === false; });
                }
                else {
                    currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $rootScope.CurrentOrderGuid; });
                }
                if (currentOrder.length > 0) {
                    $scope.CurrentOrderGuid = currentOrder[0].OrderGUID;
                    $scope.EnquiryId = parseInt(currentOrder[0].EnquiryId);
                    $rootScope.DateField.RequestDate = $filter('date')(currentOrder[0].RequestDate, "MM/dd/yyyy");
                    $scope.EditedEnquiryDeliveryLocationId = currentOrder[0].ShipTo;
                    // $scope.LoadDeliveryLocationListByUser(); remove function bcs of views.

                } else {
                    $scope.AddDefaultTruck();
                    //$scope.LoadDeliveryLocationListByUser(); remove function bcs of views.
                }
            } else {
                $scope.AddDefaultTruck();
            }

        } else {
            $scope.AddDefaultTruck();
            //$scope.LoadDeliveryLocationListByUser(); remove function bcs of views.
        }

    }
    $scope.LoadEditEnquiry();

    // 40 Add Inquiry On Promotion button Click.
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
                        var truckcapcityintons = parseFloat(parseFloat($rootScope.TruckCapacity) / 1000);

                        if (parseFloat($rootScope.TruckCapacity) < totalWeight) {
                            currentOrder[0].IsTruckFull = false;
                            //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + truckcapcityintons + 'T . Please modify your order and try again.', 'error', 8000);
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), truckcapcityintons), 'error', 8000);

                        } else if (parseFloat($rootScope.TruckCapacityPalettes) < (truckTotalPalettes - TotalExtraPalettes)) {
                            currentOrder[0].IsTruckFull = false;
                            //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' pallets. Please modify your order and try again.', 'error', 8000);
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
                        }
                        else {
                            currentOrder[0].IsTruckFull = true;
                            currentOrder[0].RequestDate = $rootScope.DateField.RequestDate;
                            $scope.ViewInquiry();
                        }

                    }
                }
            }

        }
    }



    $scope.myFilter = function (item) {
        
        if (!$rootScope.IsSelfCollect) {

            return item.ProductCode !== $scope.WoodenPalletCode;
        }
        else {
            if ($rootScope.RoleId == 3) {
                return item.ProductCode !== $scope.WoodenPalletCode || item.ProductCode === $scope.WoodenPalletCode;
            }
            else {
                return item.ProductCode !== $scope.WoodenPalletCode;
            }
        }
    };


    // 41 Load Weight Of Truck Capacity And Palettes.
    $rootScope.TruckExtraBufferWeight = function () {
        
        var extraTruckBufferWeight = 0;
        if ($scope.TruckExceedBufferWeight != 0 && $scope.TruckExceedBufferWeight != "0") {
            extraTruckBufferWeight = parseFloat($rootScope.TruckCapacity * (parseFloat($scope.TruckExceedBufferWeight) / 100));
        }
        return extraTruckBufferWeight;
    }

    $rootScope.TruckExtraBufferPallet = function () {
        

        var extraPaletteBufferWeight = 0;
        if ($scope.PalettesExceedBufferWeight != 0 && $scope.PalettesExceedBufferWeight != "0") {
            extraPaletteBufferWeight = parseFloat($scope.PalettesExceedBufferWeight);
        }
        return extraPaletteBufferWeight;
    }


    // 42 Delivery Location Change Confirmation Popup if truck is alredy fill.
    $ionicModal.fromTemplateUrl('DeliveryLocationChangeModalPopup.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $rootScope.DeliveryLocationChangeControl = modal;
    });
    $rootScope.CloseDeliveryLocationChangeConfirmationPopup = function () {
        $rootScope.DeliveryLocationChangeControl.hide();
    };
    $rootScope.OpenDeliveryLocationChangeConfirmationPopup = function () {
        $rootScope.DeliveryLocationChangeControl.show();
    };




});