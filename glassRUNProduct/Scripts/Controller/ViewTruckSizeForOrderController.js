angular.module("glassRUNProduct").controller('ViewTruckSizeForOrderController', function ($scope, $rootScope, $filter, $location, $sessionStorage, $ionicModal, $state, focus, pluginsService, GrRequestService) {
    


    // 7 Load All Truck Size Or By Delivery Location Code Of Active User.
    $rootScope.LoadTruckSizeByDeliveryLocation = function (locationId) {
        
        $rootScope.DeliveryLocationId = locationId;
        var requestData =
            {
                ServicesAction: 'GetTruckDetailByLocationIdAndCompanyId',
                LocationId: locationId,
                CompanyId: $scope.ActiveCompanyId
            };
        var jsonobject = {};
        jsonobject.Json = requestData;


        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            

            var resoponsedata = response.data;
            if (resoponsedata != null) {
                if (resoponsedata.Json !== undefined) {
                    //$rootScope.IsSelfCollect = false;
                    $scope.bindTruckSize = resoponsedata.Json.TruckSizeList;


                    
                    if ($rootScope.TemOrderData != undefined) {
                        if ($rootScope.TemOrderData.length > 0) {
                            if ($rootScope.CurrentOrderGuid == '' || $rootScope.CurrentOrderGuid == undefined) {
                                currentOrder = $scope.OrderData.filter(function (el) { return el.IsTruckFull === false; });
                            }
                            else {
                                currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $rootScope.CurrentOrderGuid; });
                            }
                            if (currentOrder.length > 0) {
                                var product = currentOrder[0].OrderProductsList.length;
                                if (product === 0) {
                                    $scope.getDetailTruckSizeByTruckSizeId($scope.bindTruckSize[0].TruckSizeId);
                                }
                                else {
                                    $scope.getDetailTruckSizeByTruckSizeId(currentOrder[0].TruckSizeId);
                                }
                                var deliveryObjDetailsSelected = $rootScope.bindDeliverylocation.filter(function (el) { return el.DeliveryLocationId === locationId });
                                if (deliveryObjDetailsSelected.length > 0) {
                                    deliveryObjDetailsSelected[0].IsDeliveryLocationSelected = true;
                                }
                                
                            }

                        }
                        else {
                            if ($scope.bindTruckSize.length == 1) {
                                $scope.getDetailTruckSizeByTruckSizeId($scope.bindTruckSize[0].TruckSizeId);
                            }
                        }
                    } else {
                        if ($scope.bindTruckSize.length == 1) {
                            $scope.getDetailTruckSizeByTruckSizeId($scope.bindTruckSize[0].TruckSizeId);
                        }
                    }
                }
                else {
                    $scope.bindTruckSize = [];
                    //$rootScope.IsSelfCollect = true;
                }
                $rootScope.Throbber.Visible = false;
            }
            else {
                $scope.bindTruckSize = [];
                //$rootScope.IsSelfCollect = true;
            }
            $rootScope.Throbber.Visible = false;

        });
    }

    // 8 Load Truck Size Detail By Truck Size Id.
    $scope.getDetailTruckSizeByTruckSizeId = function (id) {
        
        var truckObjDetailsSelected = $scope.bindTruckSize.filter(function (el) { return el.Selected === true });
        if (truckObjDetailsSelected.length > 0) {
            
            if ($scope.bindTruckSize.length == 1) {
                return false;
            }
            truckObjDetailsSelected[0].Selected = false;
        }
        var truckObjDetails = $scope.bindTruckSize.filter(function (el) { return el.TruckSizeId === id });
        if (truckObjDetails.length > 0) {
            $rootScope.TruckSizeId = id;
            $rootScope.TruckSize = truckObjDetails[0].TruckSize;
            $rootScope.TruckCapacity = (parseFloat(truckObjDetails[0].TruckCapacityWeight) * 1000);
            $rootScope.TruckCapacityInTone = $rootScope.TruckCapacity / 1000;
            $rootScope.TruckCapacityFullInTone = 0;
            $rootScope.TruckCapacityFullInPercentage = 0;

            var requestAreaData =
                {
                    ServicesAction: 'GetRuleValue',
                    CompanyId: $scope.ActiveCompanyId,
                    CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                    DeliveryLocation: {
                        LocationId: $rootScope.DeliveryLocationId,
                        DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                        Area: $rootScope.DeliveryArea,
                    },
                    Company: {
                        CompanyId: $scope.ActiveCompanyId,
                        CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                    },
                    RuleType: 5,
                    TruckSize: {
                        TruckSize: parseFloat($rootScope.TruckCapacityInTone)
                    }
                };

            $scope.AreaPalettesCount = 0
            var jsonobjectArea = {};
            jsonobjectArea.Json = requestAreaData;
            GrRequestService.ProcessRequest(jsonobjectArea).then(function (arearesponse) {
                

                var arearesponseStr = arearesponse.data.Json;
                if (arearesponseStr.RuleValue != '' || arearesponseStr.RuleValue != undefined) {
                    var rulevalue = parseInt(arearesponseStr.RuleValue);
                    $scope.AreaPalettesCount = rulevalue;
                }
                if ($scope.AreaPalettesCount > 0) {
                    $rootScope.TruckCapacityPalettes = $scope.AreaPalettesCount;
                    truckObjDetails[0].TruckCapacityPalettes = $scope.AreaPalettesCount;
                }
                else {
                    $rootScope.TruckCapacityPalettes = truckObjDetails[0].TruckCapacityPalettes;
                }
                
                $rootScope.buindingPalettes = []
                for (var i = 0; i < $rootScope.TruckCapacityPalettes; i++) {
                    var palettes = {
                        PalettesWidth: 0
                    }
                    $rootScope.buindingPalettes.push(palettes);
                }

                if ($rootScope.buindingPalettes.length > 0) {
                    $rootScope.IsPalettesRequired = true;
                } else {
                    $rootScope.IsPalettesRequired = false;
                }

                var space = 100 - ($rootScope.buindingPalettes.length - 1);
                var width = space / $rootScope.buindingPalettes.length;
                $rootScope.PalettesWidth.width = width + "%";

                var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
                if (currentOrder.length > 0) {
                    if (currentOrder[0].OrderProductsList.length > 0) {
                        currentOrder[0].TruckCapacity = $rootScope.TruckCapacityInTone;
                        currentOrder[0].TruckSizeId = $rootScope.TruckSizeId;
                        currentOrder[0].ShipTo = $rootScope.DeliveryLocationId;
                        currentOrder[0].TruckName = $rootScope.TruckSize;
                        currentOrder[0].DeliveryLocationName = $rootScope.DeliveryLocationName;

                        var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
                        var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');

                        var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
                        truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);


                        $rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
                        $rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);

                        for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                            if (i < parseInt($rootScope.buindingPalettes.length)) {
                                $rootScope.buindingPalettes[i].PalettesWidth = 100;
                            }
                        }

                        var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
                        var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

                        if ($rootScope.IsSelfCollect === false) {
                            if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight) {
                                //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UpdateOrder_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                                return false;

                            } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < truckTotalPalettes) {
                                var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                                //$rootScope.ValidationErrorAlert('You are trying to order for ' + truckTotalPalettes + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' pallets. Please modify your order and try again.', 'error', 8000);
                                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UpdateOrder_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
                                return false;
                            }
                        }

                    }
                }
                var totalWeightWithPalettes = 0;
                var totalWeightWithBuffer = 0;

                var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
                if (bufferWeight !== "") {
                    totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
                }
                var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
                if ($rootScope.IsPalettesRequired) {
                    if (weightPerPalettes !== "") {
                        totalWeightWithPalettes = (weightPerPalettes * (truckTotalPalettes));
                    }
                }
                //$scope.LoadGratisOrderList($rootScope.DeliveryLocationId, currentOrder, totalWeightWithBuffer, $rootScope.TruckCapacity, $rootScope.TruckCapacityPalettes, totalWeightWithPalettes);

                $scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $rootScope.TruckCapacity, $rootScope.TruckCapacityPalettes, totalWeightWithPalettes);

                truckObjDetails[0].Selected = true;
            });
        }

    }


});