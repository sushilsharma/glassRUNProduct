"use strict";
angular.module("glassRUNProduct").controller('TruckDetailsController', function ($scope, $rootScope, $location, $ionicModal, $ionicNavBarDelegate, $ionicHistory, GrRequestService, $sessionStorage, pluginsService, $state) {

    if ($rootScope.StockLocationCode === undefined || $rootScope.StockLocationCode === "") {
        $location.path('/loginContent');
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.OrderList = [];
    $scope.OrderProductList = [];
    $scope.TruckDetails = {
        TotalNumberOfProduct: 0,
        PlateNumber: '',
        DeliveryPersonName: ''
    };

    $scope.CurrentTime = GetCurrentdate();

    $scope.CurrentTime = new Date($scope.CurrentTime);

    $scope.BackScreenView = function () {
        $ionicHistory.goBack();
    }

    $scope.GetOrderInTruck = function () {
        $scope.throbber = true;
        debugger;
        var requestData = {
            ServicesAction: 'GetOrderInTruck',
            StockLocationCode: $rootScope.StockLocationCode,
            TruckInDeatilsId: $rootScope.TruckInDeatilsId,

        };

        var consolidateApiParamater =
            {
                Json: requestData,
            };

        $scope.process = true;
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            $scope.throbber = false;
            var orderResponse = response.data;
            if (orderResponse.Json !== "" || orderResponse.Json !== undefined) {

                if (orderResponse.Json.OrderList != undefined) {

                    $scope.OrderList = orderResponse.Json.OrderList;
                    if ($scope.OrderList.length > 0) {
                        $scope.TruckDetails.PlateNumber = $scope.OrderList[0].PlateNumber;
                        $scope.TruckDetails.DeliveryPersonName = $scope.OrderList[0].DeliveryPersonName;
                    }
                }
            }
        });
    }

    $scope.GetOrderInTruck();

    $scope.showproductlist = false;
    $scope.LoadProduct = function (OrderId) {
        if ($scope.OrderList.length > 0) {
            debugger;
            $scope.OrderProductList = [];

            var loadedProductList = $scope.OrderList.filter(function (el) { return el.OrderId === OrderId; });
            if (loadedProductList.length > 0) {
                $scope.SelectOrderNumber = loadedProductList[0].OrderNumber;
                $scope.OrderProductList = loadedProductList[0].ProductInfo;

                $scope.showproductlist = true;
            }
        }

    }

    $scope.CloseProductPopupList = function () {
        $scope.showproductlist = false;
    }




    $scope.ConfirmTruckOutDetails = function () {

        debugger;
        var SelectedOrder = []

        var orderList = $scope.OrderList;

        if (orderList.length > 0) {

            $scope.SaveTruckOutDetails();


        }
        else {
            $scope.OpenAlertMessagesPopUp(String.format($rootScope.resData.res_TruckDetails_NoOrderassignedProceedwithTruckOut));
            return false;
        }
    }

    $scope.SaveTruckOutDetails = function () {
        $scope.throbber = true;
        debugger;
        var SelectedOrder = []

        var orderList = $scope.OrderList;

        //if (orderList.length > 0) {

        for (var i = 0; i < orderList.length; i++) {
            var order = {
                TruckInDeatilsId: $rootScope.TruckInDeatilsId,
                OrderNumber: orderList[i].OrderNumber,
                PlateNumber: $rootScope.PlateNumber,
                StockLocationCode: $rootScope.SelectedStockLocationCode,
                IsLoadedInTruck: true,
                UserId: $rootScope.UserId
            }
            SelectedOrder.push(order);
        }


        var requestData = {
            ServicesAction: 'SaveTruckOutDetails',
            ModifiedBy: $rootScope.UserId,
            TruckInDeatilsId: $rootScope.TruckInDeatilsId,
            PlateNumber: $rootScope.PlateNumber,
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
            $scope.CloseAlertMessagesPopUp();
            $location.path('/TruckInTruckOutHomePage');
        });
        //}
        //else {
        //    $scope.throbber = false;
        //    alert('Please Select Order.');
        //}
    }


    $scope.ErrorMessage = "";

    $ionicModal.fromTemplateUrl('AlertMessagesPopUp.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false,
        focusFirstInput: true
    }).then(function (modal) {
        $scope.AlertMessagesPopUp = modal;
    });
    $scope.CloseAlertMessagesPopUp = function () {
        $scope.AlertMessagesPopUp.hide();
    };

    $scope.OpenAlertMessagesPopUp = function (errorMsg) {

        $scope.ErrorMessage = errorMsg;
        $scope.AlertMessagesPopUp.show();

    };

    $scope.backtoTrucklist = function () {
        $location.path('/TruckInList');
    }
});