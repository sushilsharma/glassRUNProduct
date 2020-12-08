"use strict";
angular.module("glassRUNProduct").controller('TruckInListCtrl', function ($scope, $rootScope, $location, $ionicNavBarDelegate, $ionicHistory, GrRequestService, $sessionStorage, pluginsService, $state) {
    
    if($rootScope.StockLocationCode === undefined || $rootScope.StockLocationCode === "")
    {
        $location.path('/loginContent');
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.TruckInDeatilsList = [];


    if (parseInt($rootScope.RoleId) == 2) {
        $scope.truckListTittle = $rootScope.resData.res_TruckDetails_TitleTruckin;
        $scope.orderByIsLoaded = "IsLoaded";
    }
    else {
        $scope.truckListTittle = $rootScope.resData.res_TruckOut;
        $scope.orderByIsLoaded = "-IsLoaded";
    }

    $scope.BackScreenView = function () {

        $location.path('/TruckInTruckOutHomePage');


    }

    $scope.GetTruckInList = function () {
        $scope.throbber = true;
        debugger;
        var requestData = {
            ServicesAction: 'GetTruckInList',
            StockLocationCode: $rootScope.StockLocationCode,
            CarrierId: $rootScope.CompanyId
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
            if (orderResponse.Json !== "" && orderResponse.Json !== undefined) {

                if (orderResponse.Json.TruckInDeatilsList != undefined) {

                    $scope.TruckInDeatilsList = orderResponse.Json.TruckInDeatilsList;

                    angular.forEach($scope.TruckInDeatilsList, function (item) {

                        if (item.IsLoaded === "1") {
                            item.IsLoadedInTruck = true;
                        }
                        else if (item.IsLoaded === "0") {
                            item.IsLoadedInTruck = false;
                        }

                    });

                }
            }
        });
    }


    $scope.GetTruckInList();



    $scope.GetOrderListInTruck = function (TruckInDeatilsId) {



        var truckDetails = $scope.TruckInDeatilsList.filter(function (el) { return el.TruckInDeatilsId === TruckInDeatilsId; });

        if (truckDetails.length > 0) {

            $rootScope.TruckInDeatilsId = truckDetails[0].TruckInDeatilsId;
            $rootScope.PlateNumber = truckDetails[0].PlateNumber;
            $rootScope.SelectedStockLocationCode = $rootScope.StockLocationCode;
            $rootScope.DriverName = truckDetails[0].DriverName;
            $rootScope.TruckInDataTime = truckDetails[0].TruckInDataTime;
            $rootScope.TruckInDataTime = new Date($rootScope.TruckInDataTime);
            $rootScope.DriverId = truckDetails[0].DriverId;
            $rootScope.CarrierName = truckDetails[0].CarrierName;
            $rootScope.LicenseNumber = truckDetails[0].LicenseNumber;

            if (parseInt($rootScope.RoleId) == 2) {
                $location.path('/LoadOrderInTruck');
            }
            else {
                $location.path('/TruckDetails');
            }

        }
    }

});