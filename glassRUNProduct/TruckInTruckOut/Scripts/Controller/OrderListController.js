"use strict";
angular.module("glassRUNProduct").controller('OrderListCtrl', function ($scope, $rootScope, $location, $ionicNavBarDelegate, $ionicHistory, GrRequestService, $sessionStorage, pluginsService, $state) {

    if($rootScope.StockLocationCode === undefined || $rootScope.StockLocationCode === "")
    {
        $location.path('/loginContent');
    }    

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.BinAsnInfos = $rootScope.OrderList;


    $scope.BackScreenView = function () {
        $ionicHistory.goBack();
    }


    $scope.SaveCollectedOrder = function () {
        $scope.throbber = true;
        debugger;
        var SelectedOrder = []

        var orderList = $scope.BinAsnInfos.filter(function (el) { return el.IsSelected === true; });

        if (orderList.length > 0) {

            for (var i = 0; i < orderList.length; i++) {
                var order = {
                    TruckInDeatilsId: orderList[i].TruckInDeatilsId,
                    OrderNumber: orderList[i].OrderNumber,
                    PlateNumber: orderList[i].PlateNumber
                }
                SelectedOrder.push(order);
            }

            var requestData = {
                ServicesAction: 'SaveOrderInTruck',
                OrderList: SelectedOrder

            };

            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            $scope.process = true;
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                debugger;
                $scope.throbber = false;
                $location.path('/HomePage');
            });
        }
        else {
            $scope.throbber = false;
            alert('Please Select Order.');
        }
    }



    $scope.OrderSelected = function (OrderNumber) {
        debugger;
        var orderList = $scope.BinAsnInfos.filter(function (el) { return el.OrderNumber === OrderNumber; });

        if (orderList.length > 0) {
            if (orderList[0].IsSelected) {
                orderList[0].IsSelected = false;
            }
            else {
                orderList[0].IsSelected = true;
            }
        }

    }

});