angular.module("glassRUNProduct").controller('ViewDeliveryLocationForOrderController', function ($scope, $rootScope, $filter, $location, $sessionStorage, $ionicModal, $state, focus, pluginsService, GrRequestService) {
    

    // 5 Load All Delivery Location Of Active User.
    $scope.LoadDeliveryLocationListByUser = function () {
        
        var requestData =
            {
                ServicesAction: 'LoadAllDeliveryLocation',
                CompanyId: $scope.ActiveCompanyId
            };
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
           
            
            var resoponsedata = response.data;
            if (resoponsedata != null) {
                if (resoponsedata.DeliveryLocation !== undefined) {
                    $rootScope.bindDeliverylocation = resoponsedata.DeliveryLocation.DeliveryLocationList;
                    if ($rootScope.bindDeliverylocation.length === 1) {
                        $scope.GetDeliveryLocationDetailsByDeliveryLocationId($rootScope.bindDeliverylocation[0].DeliveryLocationId);
                    } else {
                        if ($scope.EditOrder === true) {
                            $rootScope.DeliveryLocationId = $scope.EditedOrderDeliveryLocationId;
                            $scope.GetDeliveryLocationDetailsByDeliveryLocationId($scope.EditedOrderDeliveryLocationId);
                        } else {
                            $rootScope.Throbber.Visible = false;
                        }
                    }
                }
                else {
                    $rootScope.bindDeliverylocation = [];
                    $rootScope.Throbber.Visible = false;
                    //$rootScope.ValidationErrorAlert('There is no shipping location set up for your login. Please contact the system administrator for further assistance.', 'error', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UpdateOrder_noShippingLocationContactSystemAdminstrator), 'error', 8000);

                }
            }
            else {

                $rootScope.bindDeliverylocation = [];
                $rootScope.Throbber.Visible = false;
                //$rootScope.ValidationErrorAlert('There is no shipping location set up for your login. Please contact the system administrator for further assistance.', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UpdateOrder_noShippingLocationContactSystemAdminstrator), 'error', 8000);

            }
        });
    }

    // 6 Load DeliveryLocation Details By delivery location Id.
    $scope.GetDeliveryLocationDetailsByDeliveryLocationId = function (deliverylocationId) {
        
        var isTrue = true;
        if ($scope.OrderData.length > 0) {
            var currentOrderData = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
            if (currentOrderData[0].ShipTo !== deliverylocationId) {
                if (currentOrderData[0].OrderProductList.length > 0) {
                    
                    isTrue = false;
                }
            }
        }

        if (isTrue) {
            $rootScope.PromotionItemList = [];
            $scope.DeliveryArea = '0';
            $rootScope.TruckSizeId = 0;
            $rootScope.DeliveryLocationCapacity = 0;
            
            var deliveryObjDetailsSelected = $rootScope.bindDeliverylocation.filter(function (el) { return el.IsDeliveryLocationSelected === true });
            if (deliveryObjDetailsSelected.length > 0) {
                deliveryObjDetailsSelected[0].IsDeliveryLocationSelected = false;
            }

            var deliveryObjDetails = $rootScope.bindDeliverylocation.filter(function (el) { return el.DeliveryLocationId === deliverylocationId });
            if (deliveryObjDetails.length > 0) {

                if (deliveryObjDetails[0].Field1 === "SCO") {
                    $rootScope.IsSelfCollect = true;
                }
                else {
                    $rootScope.IsSelfCollect = false;
                }

                $rootScope.DeliveryLocationId = deliveryObjDetails[0].DeliveryLocationId;

                $scope.LoadGratisOrderList($rootScope.DeliveryLocationId);

                $rootScope.DeliveryLocationCode = deliveryObjDetails[0].DeliveryLocationCode;
                $scope.DeliveryArea = deliveryObjDetails[0].Area;
                $rootScope.DeliveryArea = $scope.DeliveryArea;
                var requestPromotionData =
                    {
                        ServicesAction: 'GetPromotionFocItemList',
                        CompanyId: $scope.ActiveCompanyId,
                        Region: $scope.DeliveryArea
                    };
                var jsonPromotionobject = {};
                jsonPromotionobject.Json = requestPromotionData;
                GrRequestService.ProcessRequest(jsonPromotionobject).then(function (Promotionresponse) {
                    
                    var resoponsedata = Promotionresponse.data;
                    if (resoponsedata.PromotionFocItemDetail !== undefined) {
                        $rootScope.PromotionItemList = resoponsedata.PromotionFocItemDetail.PromotionFocItemDetailList;
                    }

                });
                $rootScope.DeliveryLocationName = deliveryObjDetails[0].DeliveryLocationName;
                $rootScope.DeliveryLocationCapacity = deliveryObjDetails[0].Capacity;
                deliveryObjDetails[0].IsDeliveryLocationSelected = true;

                $rootScope.LoadTruckSizeByDeliveryLocation(deliverylocationId);
                $rootScope.GetProposedDeliveryDate(deliverylocationId);

            }
        } else {

            $scope.ChangedDeliveryLocationId = deliverylocationId;
            $rootScope.OpenDeliveryLocationChangeConfirmationPopup();
        }

    }
    $scope.LoadDeliveryLocationListByUser();


    $rootScope.SaveDeliveryLocationChange = function () {
        
        if ($scope.OrderData.length > 0) {
            
            $scope.OrderData[0].OrderProductList = [];
            $scope.GetDeliveryLocationDetailsByDeliveryLocationId($scope.ChangedDeliveryLocationId);
            $rootScope.CloseDeliveryLocationChangeConfirmationPopup();
        }
    }
});