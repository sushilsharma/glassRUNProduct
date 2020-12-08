angular.module("glassRUNProduct").controller('UpdateOrderController', function ($scope, $rootScope, $filter, $location, $sessionStorage, $ionicModal, $state, pluginsService, GrRequestService) {
    


    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.IsPromotion = false;
    $scope.DeliveryLocationCapacity = 0;
    $scope.TruckCapacityFullInPercentage = 0;
    $scope.TruckCapacityInTone = 0;
    $scope.TruckCapacityFullInTone = 0;
    $scope.buindingPalettes = [];
    $scope.bindAllSettingMaster = [];
    $scope.TruckSizeId = 0;
    $scope.DeliveryLocationId = 0;
    $scope.ItemPrices = 0;
    $scope.Allocation = 0;
    $scope.UOM = '-';
    $scope.IsItemEdit = false;

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



    var requestData =
        {
            ServicesAction: 'LoadAllProducts',
            CompanyId: $rootScope.OrderCompanyId
        };

    //var stringfyjson = JSON.stringify(requestData);
    var jsonobject = {};
    jsonobject.Json = requestData;
    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        
        var resoponsedata = response.data;
        $scope.bindallproduct = resoponsedata.Item.ItemList;
    });



    setTimeout(function () {
        


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





    $scope.ReloadGraph = function (currentOrder) {
        
        var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0);
        var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0);

        


        $scope.TruckCapacityFullInTone = (totalWeight / 1000);
        $scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);



        angular.forEach($scope.buindingPalettes, function (item, key) {

            item.PalettesWidth = 0;

        });

        for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
            $scope.buindingPalettes[i].PalettesWidth = 100;
        }
    }








    $scope.getDeliverylocationSelectValue = function (deliverylocationId) {
        
        $scope.DeliveryLocationCapacity = 0;
        $scope.DeliveryLocationId = deliverylocationId;
        var deliveryObjDetailsSelected = $scope.bindDeliverylocation.filter(function (el) { return el.IsDeliveryLocationSelected === true });
        if (deliveryObjDetailsSelected.length > 0) {

            
            if ($scope.bindDeliverylocation.length == 1) {
                return false;
            }

            deliveryObjDetailsSelected[0].IsDeliveryLocationSelected = false;
        }

        var deliveryObjDetails = $scope.bindDeliverylocation.filter(function (el) { return el.DeliveryLocationId === deliverylocationId });
        if (deliveryObjDetails.length > 0) {

            $scope.DeliveryLocationName = deliveryObjDetails[0].DeliveryLocationName;
            $scope.DeliveryLocationCapacity = deliveryObjDetails[0].Capacity;

            if (deliveryObjDetails[0].IsDeliveryLocationSelected) {
                deliveryObjDetails[0].IsDeliveryLocationSelected = false;
            }
            else {
                deliveryObjDetails[0].IsDeliveryLocationSelected = true;
            }
        }
        $scope.LoadTruckSizeBelongsToLoactionIdAndCompanyId(deliverylocationId);

        $scope.GetProposedDeliveryDate(deliverylocationId);
    }





    

    var requestSettingData =
        {
            ServicesAction: 'LoadAllSettingMaster',
            CompanyId: 0
        };

    //var stringfyjson = JSON.stringify(requestData);
    var jsonSettingobject = {};
    jsonSettingobject.Json = requestSettingData;
    GrRequestService.ProcessRequest(jsonSettingobject).then(function (response) {
        
        var resoponsedata = response.data;
        $scope.bindAllSettingMaster = resoponsedata.SettingMaster.SettingMasterList;


    });




    $scope.GetProposedDeliveryDate = function (locationId) {
        
        var requestData =
            {
                ServicesAction: 'GetProposedDeliveryDate',
                CompanyId: $scope.TempCompanyId,
                DeliveryLocation: {
                    LocationId: locationId,
                },
                Company: {
                    CompanyId: $scope.TempCompanyId,
                },
                RuleType: 1,
                Order: {
                    OrderTime: "",
                    OrderDate: ""
                }
            };

        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
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



                    

                    $scope.ProposedDate = someFormattedDate;




                }
                else {
                    $scope.ProposedDate = 'N/A'
                }


            }
            else {

                $scope.ProposedDate = responseStr.ProposedDate;
            }
            



            $scope.GetReceivingLocationBalanceCapacity(locationId, $scope.ProposedDate);


            var GetScheduleDateNumber = 6;
            var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ScheduleDateNumber'; });
            if (truckBufferWeight.length > 0) {
                GetScheduleDateNumber = parseFloat(truckBufferWeight[0].SettingValue);
            }

            var date = $scope.ProposedDate;

            var proposedetd = date.split(' ');
            var etd = proposedetd[0].split('/');
            var etddate = etd[1] + "/" + etd[0] + "/" + etd[2];

            var enddate = new Date(etddate);
            enddate.setDate(enddate.getDate() + GetScheduleDateNumber);

            var dd = enddate.getDate();
            var mm = enddate.getMonth() + 1;
            var y = enddate.getFullYear();
            var SchedulingDate = dd + '/' + mm + '/' + y;

            $scope.GetScheduleDate($scope.ProposedDate, SchedulingDate);

        });
    };



    $scope.LoadTruckSizeBelongsToLoactionIdAndCompanyId = function (locationId) {
        
        var requestData =
            {
                ServicesAction: 'GetTruckDetailByLocationIdAndCompanyId',
                LocationId: locationId,
                CompanyId: $rootScope.OrderCompanyId
            };

        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            

            var resoponsedata = response.data;
            if (resoponsedata != null) {

                $scope.bindTruckSize = resoponsedata.Json.EnquiryList;

                
                if ($scope.bindTruckSize.length == 1) {
                    $scope.getSelectValue($scope.bindTruckSize[0].TruckSizeId);
                }

                if ($rootScope.CurrentsalesOrderNumber == '' || $rootScope.CurrentsalesOrderNumber == undefined) {

                }
                else {
                    currentOrder = $scope.OrderData.filter(function (el) { return el.SalesOrderNumber === $rootScope.CurrentsalesOrderNumber; });
                }


                var requestSettingData =
                    {
                        ServicesAction: 'LoadAllSettingMaster',
                        CompanyId: 0
                    };

                //var stringfyjson = JSON.stringify(requestData);
                var jsonSettingobject = {};
                jsonSettingobject.Json = requestSettingData;
                GrRequestService.ProcessRequest(jsonSettingobject).then(function (response) {
                    
                    var resoponsedata = response.data;
                    $scope.bindAllSettingMaster = resoponsedata.SettingMaster.SettingMasterList;

                    if (currentOrder.length > 0) {
                        $scope.getSelectValue(currentOrder[0].TruckSizeId);
                        $scope.ReloadGraph(currentOrder);
                    }

                });

            }
            else {
                $scope.bindTruckSize = [];

            }


        });
    };
    $scope.PalettesWidth = {
        width: "0%"
    };


    $scope.getTotalAmount = function (weight, quantity, currentOrder, itemId) {
        

        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductsList.length; i++) {
            if (currentOrder[0].OrderProductsList[i].ItemId !== itemId) {
                total += parseFloat(currentOrder[0].OrderProductsList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductsList[i].ProductQuantity);
            }
        }


        total += parseFloat(weight) * parseFloat(quantity);







        return total;
    }



    $scope.getTotalPalettes = function (palettes, quantity, currentOrder, itemId) {
        

        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductsList.length; i++) {
            if (currentOrder[0].OrderProductsList[i].ItemId !== itemId) {
                total += parseFloat(currentOrder[0].OrderProductsList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductsList[i].ConversionFactor);
            }
        }

        //if (!$scope.IsItemEdit) {
        if (parseFloat(quantity) > 0) {
            total += parseFloat(quantity) / parseFloat(palettes);
        }
        //}


        if ($scope.TruckCapacityPalettes == 0) {
            total = -1;
        }

        return total;
    }


    $scope.EditProduct = function (itemId) {
        

        var currentOrder = $scope.OrderData.filter(function (el) { return el.SalesOrderNumber === $rootScope.CurrentsalesOrderNumber; });

        if (currentOrder.length > 0) {
            if (currentOrder[0].OrderProductsList.length > 0) {
                var productNameStr = currentOrder[0].OrderProductsList.filter(function (el) { return el.ItemId === itemId; });
                $scope.IsItemEdit = true;

                $scope.ItemId = productNameStr[0].ItemId;
                $scope.ordermanagement.itemsName = itemId;
                $scope.$broadcast('angucomplete-alt:changeInput', 'ItemListAutoCompleteBox', productNameStr[0].ItemName);
                $scope.disableInput = true;
                $scope.ordermanagement.inputItemsQty = productNameStr[0].ProductQuantity;
                $scope.UOM = productNameStr[0].UOM;
                $scope.UnitPrice = productNameStr[0].UnitPrice;
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

                $scope.getItemPrice1(itemId, productNameStr[0].ItemPricesPerUnit);
                //$scope.Allocation = productNameStr[0].Allocation;
                //$scope.getItemPrice(itemId, productNameStr[0].ItemPricesPerUnit);
            }
        }


    }


    $scope.getItemPrice1 = function (itemId, ItemPrices) {
        
        //var itemId = e.description.ItemId;
        //var ItemPrices = e.description.Amount;


        $scope.ordermanagement.itemsName = itemId;
        var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
        if (productNameStr.length > 0) {
            $scope.ItemPrices = productNameStr[0].Amount;
            $scope.UOM = productNameStr[0].UOM;
        }
        else {
            $scope.ItemPrices = 0;
        }
    }


    $scope.getItemPrice = function (e) {
        

        var itemId = e.description.ItemId;
        var ItemPrices = e.description.Amount;
        $scope.ordermanagement.itemsName = itemId;
        var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === $scope.ordermanagement.itemsName; });
        if (productNameStr.length > 0) {
            $scope.ItemPrices = productNameStr[0].Amount;
            $scope.UOM = productNameStr[0].UOM;
        }
        else {
            $scope.ItemPrices = 0;
        }



        var requestData =
            {
                ServicesAction: 'GetItemAllocation',
                LocationId: $scope.DeliveryLocationId,
                CompanyId: $rootScope.OrderCompanyId,
                RuleType: 2,
                ItemId: parseInt($scope.ordermanagement.itemsName)
            };
        $scope.Allocation = 0;
        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var responseStr = response.data.Json;

            if (responseStr.Allocation != '') {
                $scope.Allocation = parseInt(responseStr.Allocation);
            }
        });

    }


    $scope.getSelectValue = function (id) {
        
        var truckObjDetailsSelected = $scope.bindTruckSize.filter(function (el) { return el.Selected === true });
        if (truckObjDetailsSelected.length > 0) {
            
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
            $scope.TruckCapacityPalettes = truckObjDetails[0].TruckCapacityPalettes;



            

            $scope.buindingPalettes = []
            for (var i = 0; i < $scope.TruckCapacityPalettes; i++) {
                var palettes = {
                    PalettesWidth: 0
                }
                $scope.buindingPalettes.push(palettes);
            }

            var space = 100 - ($scope.buindingPalettes.length - 1);
            var width = space / $scope.buindingPalettes.length;
            $scope.PalettesWidth.width = width + "%";

            var currentOrder = $scope.OrderData.filter(function (el) { return el.SalesOrderNumber === $rootScope.CurrentsalesOrderNumber; });
            if (currentOrder.length > 0) {
                if (currentOrder[0].OrderProductsList.length > 0) {


                    currentOrder[0].TruckCapacity = $scope.TruckCapacity;
                    currentOrder[0].TruckSizeId = $scope.TruckSizeId;
                    currentOrder[0].ShipTo = $scope.DeliveryLocationId;
                    currentOrder[0].TruckName = $scope.TruckSize;
                    currentOrder[0].DeliveryLocationName = $scope.DeliveryLocationName;

                    var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0);
                    var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0);


                    $scope.TruckCapacityFullInTone = (totalWeight / 1000);
                    $scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);

                    for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                        $scope.buindingPalettes[i].PalettesWidth = 100;
                    }

                    if (parseFloat($scope.TruckCapacity) <= totalWeight || parseFloat($scope.TruckCapacityPalettes) <= truckTotalPalettes) {
                        $rootScope.ValidationErrorAlert('Truck capacity exceeded, please reduce ordered quantity.', 'error', 3000);
                    }

                }
            }


            

            if (truckObjDetails[0].Selected) {
                truckObjDetails[0].Selected = false;
            }
            else {
                truckObjDetails[0].Selected = true;
            }
        }

    }



    $scope.OrderCount = 0
    
    $scope.OrderData = [];
    $scope.OrderData = $rootScope.UpdateOrderData;
    var currentOrder = [];

    if ($rootScope.CurrentsalesOrderNumber == '' || $rootScope.CurrentsalesOrderNumber == undefined) {

    }
    else {
        currentOrder = $scope.OrderData.filter(function (el) { return el.SalesOrderNumber === $rootScope.CurrentsalesOrderNumber; });
    }



    $scope.CurrentSalesOrderNumber = currentOrder[0].SalesOrderNumber;


    $scope.ordermanagement.RequestDate = $filter('date')(currentOrder[0].RequestDate, "MM/dd/yyyy");

    var requestData =
        {
            ServicesAction: 'LoadAllDeliveryLocation',
            CompanyId: $rootScope.OrderCompanyId
        };


    var jsonobject = {};
    jsonobject.Json = requestData;
    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        
        var resoponsedata = response.data;
        $scope.bindDeliverylocation = resoponsedata.DeliveryLocation.DeliveryLocationList;


        
        $scope.getDeliverylocationSelectValue(currentOrder[0].ShipTo);
        $scope.OrderProductList = currentOrder[0].OrderProductsList;

    });

    $scope.CheckAllocation = function (Allocation, quantity, currentOrder, itemId) {
        
        var allowAllocatio = false;
        var total = 0;



        total += parseFloat(quantity);



        if (Allocation >= total) {
            allowAllocatio = true;
        }

        if (Allocation == 0) {
            allowAllocatio = true;
        }

        return allowAllocatio;
    }


    $scope.ClearItemRecord = function () {
        $scope.ordermanagement.itemsName = "";
        $scope.ordermanagement.inputItemsQty = "";
        $scope.UnitPrice = 0;
        $scope.Allocation = 0;
        $scope.$broadcast('angucomplete-alt:clearInput');
        $scope.UOM = '-';
        $scope.IsItemEdit = false;
        $scope.disableInput = false;
        $scope.CalculateDeliveryUsedCapacity();
    }

    $scope.ClearAutoSearchbox = function () {
        
        $scope.ClearItemRecord();
    }

    $scope.CheckWetherTruckIsFull = function (currentOrder, totalWeightWithBuffer, truckSize, palettesWeight) {
        
        var isFull = false;

        var totalpalettesWeight = 0;
        for (var i = 0; i < currentOrder[0].OrderProductsList.length; i++) {
            totalpalettesWeight += parseFloat(currentOrder[0].OrderProductsList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductsList[i].ConversionFactor);
        }


        var totaltruckSize = 0;
        for (var i = 0; i < currentOrder[0].OrderProductsList.length; i++) {
            totaltruckSize += parseFloat(currentOrder[0].OrderProductsList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductsList[i].ProductQuantity);
        }

        if ((totaltruckSize >= totalWeightWithBuffer && totaltruckSize <= truckSize) || palettesWeight === totalpalettesWeight) {
            isFull = true;
        }


        return isFull;
    }



    $scope.OrderProductList = [];
    $scope.addProducts = function (itemId) {
        

        if (parseInt($scope.ordermanagement.inputItemsQty) < 1) {
            $rootScope.ValidationErrorAlert('Please enter a valid quantity.', 'error', 3000);
            return false;
        }

        if ($scope.TruckSizeId > 0 && $scope.DeliveryLocationId > 0) {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.SalesOrderNumber === $rootScope.CurrentsalesOrderNumber; });
            if (currentOrder.length > 0) {
                $scope.IsPromotion = true;

                var totalWeightWithPalettes = 0;
                var totalWeightWithBuffer = 0;

                var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });

                var checkAllocationValue = $scope.CheckAllocation($scope.Allocation, $scope.ordermanagement.inputItemsQty, $scope.OrderData, itemId);
                if (!checkAllocationValue) {


                    $rootScope.ValidationErrorAlert('It seems like you are tyring to order the item more than the allocated quantity. You cannot order this item more than ' + $scope.Allocation + ' ' + productNameStr[0].UOM + '', 'error', 10000);
                    return false;
                }


                var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, $scope.ordermanagement.inputItemsQty, currentOrder, itemId);
                var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, $scope.ordermanagement.inputItemsQty, currentOrder, itemId);


                var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'TruckBufferWeight'; });
                if (truckBufferWeight.length > 0) {
                    var bufferWeight = parseFloat(truckBufferWeight[0].SettingValue);

                    totalWeightWithBuffer = (parseFloat($scope.TruckCapacity) - (bufferWeight * 1000));
                }



                var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
                if (palettesWeight.length > 0) {
                    var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
                    totalWeightWithPalettes = (weightPerPalettes * truckTotalPalettes);
                    totalWeight = totalWeight + totalWeightWithPalettes
                }




                //var actualTotalWeight = totalWeight - (parseFloat(productNameStr[0].WeightPerUnit) * parseFloat($scope.ordermanagement.inputItemsQty));
                //var actualTruckTotalPalettes = truckTotalPalettes - (parseFloat(productNameStr[0].ConversionFactor) / parseFloat($scope.ordermanagement.inputItemsQty));

                var productNameStrupdate = currentOrder[0].OrderProductsList.filter(function (el) { return el.ItemId === itemId; });
                
                if (productNameStrupdate.length > 0) {



                    if ($scope.TruckCapacity < totalWeight || $scope.TruckCapacityPalettes < truckTotalPalettes) {

                        $rootScope.ValidationErrorAlert('Truck capacity exceeded.', 'error', 3000);
                        return false;
                        //actualTotalWeight

                        //currentOrder[0].IsTruckFull = true;
                        //$scope.AddTruckHeaderMessage = "Message";
                        //$scope.AddTruckBodymessage = "Do you want to add new truck.";
                        //$scope.OpenAddTruckControl();
                    }
                    else {

                        currentOrder[0].NumberOfPalettes = Math.ceil(truckTotalPalettes);
                        currentOrder[0].TruckWeight = (totalWeight / 1000);

                        if ($scope.IsItemEdit) {
                            productNameStrupdate[0].ProductQuantity = parseInt($scope.ordermanagement.inputItemsQty);
                        }
                        else {
                            productNameStrupdate[0].ProductQuantity = parseInt(productNameStrupdate[0].ProductQuantity) + parseInt($scope.ordermanagement.inputItemsQty);
                        }



                        $scope.ReloadGraph(currentOrder);

                        $scope.ClearItemRecord();
                    }




                }
                else {
                    

                    if ($scope.TruckCapacity < totalWeight || $scope.TruckCapacityPalettes < truckTotalPalettes) {

                        $scope.trmpProductId = itemId

                        $rootScope.ValidationErrorAlert('Truck capacity exceeded.', 'error', 3000);
                        return false;

                    }
                    else {

                        if (currentOrder.length > 0) {


                            $scope.TruckCapacityFullInTone = (totalWeight / 1000);
                            $scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);


                            angular.forEach($scope.buindingPalettes, function (item, key) {

                                item.PalettesWidth = 0;


                            });

                            for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                                $scope.buindingPalettes[i].PalettesWidth = 100;
                            }

                            currentOrder[0].TruckName = $scope.TruckSize;
                            currentOrder[0].TruckCapacity = $scope.TruckCapacity;
                            currentOrder[0].TruckSizeId = $scope.TruckSizeId;
                            currentOrder[0].ShipTo = $scope.DeliveryLocationId;
                            currentOrder[0].DeliveryLocationName = $scope.DeliveryLocationName;
                            currentOrder[0].RequestDate = $scope.ordermanagement.RequestDate;
                            currentOrder[0].OrderProposedETD = $scope.ProposedDate;

                            currentOrder[0].NumberOfPalettes = Math.ceil(truckTotalPalettes);
                            currentOrder[0].TruckWeight = $scope.TruckCapacityFullInTone;


                            var products = {
                                OrderGUID: $scope.CurrentOrderGuid,
                                OrderProductId: 0,
                                Allocation: $scope.Allocation,
                                ItemId: itemId,
                                GratisOrderId: 0,
                                ItemName: productNameStr[0].ItemName,
                                ProductCode: productNameStr[0].ItemCode,
                                UOM: productNameStr[0].UOM,
                                ProductQuantity: $scope.ordermanagement.inputItemsQty,
                                ItemPricesPerUnit: parseFloat(productNameStr[0].Amount),
                                UnitPrice: (parseFloat(productNameStr[0].Amount) * parseInt($scope.ordermanagement.inputItemsQty)),
                                ConversionFactor: productNameStr[0].ConversionFactor,
                                ProductType: productNameStr[0].ProductType,
                                WeightPerUnit: productNameStr[0].WeightPerUnit,
                                IsActive: true
                            }
                            currentOrder[0].OrderProductsList.push(products);
                        }
                        $scope.ClearItemRecord();
                    }

                }


                var dd = $scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $scope.TruckCapacity, $scope.TruckCapacityPalettes, totalWeightWithPalettes);
                if (dd) {
                    currentOrder[0].IsTruckFull = true;
                    $scope.AddTruckHeaderMessage = "Message";
                    $scope.AddTruckBodymessage = "Do you want to add new truck.";
                    $scope.OpenAddTruckControl();
                }


            }



        }
        else {
            if ($scope.TruckSizeId == 0) {
                $rootScope.ValidationErrorAlert('Please seletect one of the truck sizes before you proceed further with your order.', 'error', 3000);
            }
            else if ($scope.DeliveryLocationId == 0) {
                $rootScope.ValidationErrorAlert('Please seletect one of the delivery locations before you proceed further with your order.', 'error', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert('Please select delivery location or truck.', 'error', 3000);
            }


        }

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

    $scope.ViewInquiry = function () {

        if ($rootScope.TemOrderData != undefined) {
            if ($rootScope.TemOrderData.length > 0) {

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
        
        for (var i = 0; i < $rootScope.TemOrderData.length; i++) {
            $rootScope.TemOrderData[i].ExpectedTimeOfDelivery = $scope.ordermanagement.RequestDate;
        }


        var fullTruckCount = $rootScope.TemOrderData.filter(function (el) { return el.IsTruckFull == true; });

        if (fullTruckCount.length > 0) {
            $scope.CurrentsalesOrderNumber = '';
            $state.go("CreateInquiryForSLM");
        }
        else {

        }





        //$location.path('/ViewCreateInquiry');
    };


    $scope.AddInquiry = function () {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.SalesOrderNumber === $scope.CurrentsalesOrderNumber; });
        if (currentOrder.length > 0) {
            if (currentOrder[0].OrderProductList.length > 0) {


                var currentOrder = $scope.OrderData.filter(function (el) { return el.SalesOrderNumber === $scope.CurrentsalesOrderNumber; });
                if (currentOrder.length > 0) {
                    if (currentOrder[0].OrderProductList.length > 0) {

                        var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0);
                        var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0);

                        if (parseFloat($scope.TruckCapacity) <= totalWeight || parseFloat($scope.TruckCapacityPalettes) <= truckTotalPalettes) {
                            $rootScope.ValidationErrorAlert('Truck capacity exceeded, please reduce ordered quantity.', 'error', 3000);
                            currentOrder[0].IsTruckFull = false;
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



    $scope.RemoveInquiryItem = function (ItemId) {
        


        if ($scope.IsItemEdit === true & $scope.ItemId === ItemId) {
            $rootScope.ValidationErrorAlert('You can delete its in edit mode.', 'error', 3000);
            return false;
        }

        var currentOrder = $scope.OrderData.filter(function (el) { return el.SalesOrderNumber === $rootScope.CurrentsalesOrderNumber; });
        $scope.findAndRemove(currentOrder[0].OrderProductsList, 'ItemId', ItemId, 'OrderProductId');

        $scope.ReloadGraph(currentOrder);
        $scope.CalculateDeliveryUsedCapacity();
    }




    $scope.CalculateDeliveryUsedCapacity = function () {
        var tempNumberOfPalettes = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            tempNumberOfPalettes += $scope.OrderData[i].NumberOfPalettes;
        }
        $scope.tempDeliveryUsedCapacity = tempNumberOfPalettes;

        if (($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity) > $scope.DeliveryLocationCapacity) {

            var usedPalettesCapacity = parseInt($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity);

            $rootScope.ValidationErrorAlert('The receiving capacity for the delivery location is only ' + parseInt($scope.DeliveryLocationCapacity) + ' pallets while you are trying order ' + usedPalettesCapacity + ' paletts. Please modify you order and try again.', 'warning', 8000);

        }


    }

    $scope.findAndRemove = function (array, property, value, primaryId) {
        array.forEach(function (result, index) {
            
            if (result[property] === value) {
                if (result[primaryId] === 0) {
                    array.splice(index, 1);
                }
                else {
                    array[index].IsActive = false;
                }
            }
        });
    };

    $scope.GetReceivingLocationBalanceCapacity = function (deliverylocationId, proposedDeliveryDate) {
        
        var requestData =
            {
                ServicesAction: 'GetReceivingLocationBalanceCapacity',
                CompanyId: $scope.TempCompanyId,
                ShipTo: deliverylocationId,
                ProposedDeliveryDate: proposedDeliveryDate
            };

        // var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            // var resoponsedata = JSON.parse(JSON.parse(response.data));
            var resoponsedata = response.data.Json.BalanceCapacity;

            $scope.DeliveryUsedCapacity = resoponsedata;

        });
    }

});