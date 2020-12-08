"use strict";
angular.module("glassRUNProduct").controller('LoadOrderInTruckController', function ($scope, $rootScope, $location, $ionicModal, $ionicNavBarDelegate, GrRequestService, $sessionStorage, pluginsService, $state) {

    if ($rootScope.StockLocationCode === undefined || $rootScope.StockLocationCode === "") {
        $location.path('/loginContent');
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.BinAsnInfos = [];
    $scope.IsAllowOtherOrder = false;
    $scope.Selectctionvalue = true;
    $scope.lblValue = 'Select All';
    $scope.IsShowAllbutton = false

    $scope.GetPendingOrderList = function () {
        $scope.throbber = true;
        debugger;
		var SelectedOrder = [];



		var localCarrierID = 0;

		if (parseInt($rootScope.RoleId) == 2) {
			localCarrierID = $rootScope.CompanyId;
		}
		else {
			localCarrierID = $rootScope.CarrierId;
		}
		
        var requestData = {
            ServicesAction: 'GetPendingOrderList',
            PlateNumber: $rootScope.PlateNumber,
            StockLocationCode: $rootScope.SelectedStockLocationCode,
            DriverId: $rootScope.DriverId,
            TruckInDeatilsId: $rootScope.TruckInDeatilsId,
			CarrierId: localCarrierID
        };

        var consolidateApiParamater =
            {
                Json: requestData,
            };

        $scope.process = true;
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            

            //$scope.throbber = false;
            var orderResponse = response.data;
            if (orderResponse.Json !== "" || orderResponse.Json !== undefined) {

                if (orderResponse.Json.OrderList != undefined) {

                    $scope.BinAsnInfos = orderResponse.Json.OrderList;

                    angular.forEach($scope.BinAsnInfos, function (item) {

                        if (item.IsLoadedInTruck === "1") {
                            item.IsSelected = true;
                        }
                        else if (item.IsLoadedInTruck === "0") {
                            item.IsSelected = false;
                        }
                        if (item.PlateNumber === $rootScope.PlateNumber) {
                            item.IsSelectedPlateNumber = true;
                        }
                    });

                    $scope.throbber = false;

                    //$location.path('/OrderList');
                }
            }

        });

    }


    $scope.GetPendingOrderList();


    $scope.OrderSelected = function (OrderNumber, value) {
        debugger;
        var singleOrderCollection = $scope.LoadSettingInfoByName('SingleOrderCollection', 'int');

        if (singleOrderCollection === 0 && OrderNumber !== "-1") {
            var orderList = $scope.BinAsnInfos.filter(function (el) { return el.OrderNumber === OrderNumber; });

			if (orderList.length > 0) {

				//below code add by Sonu (26-09-2109)- for filtering  order by load number

				var orderListForLoadNumber = [];

				if (orderList[0].LoadNumber != ""  && orderList[0].LoadNumber != null) {

					orderListForLoadNumber = $scope.BinAsnInfos.filter(function (el) { return el.LoadNumber === orderList[0].LoadNumber ; });

				}

			




                if (orderList[0].IsSelected) {
					orderList[0].IsSelected = false;

				//below code add by Sonu (26-09-2109)- for selecting order by loadnumber
					angular.forEach(orderListForLoadNumber, function (item) {

						item.IsSelected = false;

					});

				

                }
                else {
					orderList[0].IsSelected = true;

					//below code add by Sonu (26-09-2109)- for selecting order by loadnumber
					angular.forEach(orderListForLoadNumber, function (item) {

						item.IsSelected = true;

					});
                }
            }
        }
        else if (OrderNumber === '-1') {
            if (value) {
                $scope.lblValue = 'Deselect All'
            }
            else {

                $scope.lblValue = 'Select All'
            }
            $scope.Selectctionvalue = !value;
            var orderList = $scope.BinAsnInfos.filter(function (el) { return el.IsSelectedPlateNumber === true; });
            if (orderList.length > 0) {
                for (var i = 0; i < orderList.length; i++) {
                    orderList[i].IsSelected = value;
                }
            }
        }
        else {

            angular.forEach($scope.BinAsnInfos, function (item) {

                if (OrderNumber === item.OrderNumber) {
                    item.IsSelected = true;
                }
                else {
                    item.IsSelected = false;
                }

            });

        }
        if (value === 'Deselect All') {
            $scope.Selectctionvalue = true;
            $scope.lblValue = 'Select All'
        }
        else {

            // $scope.lblValue = 'Select All'
        }

    }


    $scope.LoadSettingInfoByName = function (settingName, returnValueDataType) {

        var settingValue = "";
        var allSettingMasterData = $sessionStorage.AllSettingMasterData//angular.copy($rootScope.SettingMasterInfoList);
        if (allSettingMasterData != undefined) {
            var settingMaster = allSettingMasterData.filter(function (el) { return el.SettingParameter === settingName; });
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
    };


    $scope.SaveLoadedOrder = function () {
        $scope.throbber = true;
        debugger;
        var SelectedOrder = []

        var orderList = $scope.BinAsnInfos.filter(function (el) { return el.IsSelected === true; });

        if (orderList.length > 0) {

            for (var i = 0; i < orderList.length; i++) {
                var order = {
                    TruckInDeatilsId: $rootScope.TruckInDeatilsId,
                    OrderNumber: orderList[i].OrderNumber,
                    PlateNumber: $rootScope.PlateNumber,
                    StockLocationCode: $rootScope.SelectedStockLocationCode,
                    IsLoadedInTruck: true
                }
                SelectedOrder.push(order);
            }

            var requestData = {
                ServicesAction: 'SaveLoadedOrderInTruck',
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
                $location.path('/TruckInTruckOutHomePage');
            });
        }
        else {
            $scope.throbber = false;
           $scope.OpenAlertMessagesPopUp('Please Select Order.');
            //$rootScope.ValidationErrorAlert('Please Select Order.', '', 3000);
            return false;
            //alert('Please Select Order.');
        }
    };

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

	 //Sonu Singh(30/08/2019) : Skip Button  for skipping the order confirmation.
	$scope.SkipAlertMessagesPopUp  = function () {

		$scope.CloseAlertMessagesPopUp();
		$location.path('/TruckInTruckOutHomePage');


	}


    $scope.BackScreenView = function () {

        $location.path('/TruckInList');


    }

    $scope.EnabelotherorderList = function () {
        debugger;
        var settingValue = "";
        if ($sessionStorage.AllSettingMasterData != undefined) {
            var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === "IsShowOtherOrder"; });
            if (settingMaster.length > 0) {
                settingValue = settingMaster[0].SettingValue;
            }
        }
        if (settingValue === "1") {
            $scope.IsAllowOtherOrder = true;
        }
        else {
            $scope.IsAllowOtherOrder = false;
        }
        console.log('$scope.IsAllowOtherOrder  ' + $scope.IsAllowOtherOrder);


        var varsingleSelection = $scope.LoadSettingInfoByName('SingleOrderCollection', 'int');

        if (varsingleSelection === 0) {
            $scope.IsShowAllbutton = true
        }
        else {
            $scope.IsShowAllbutton = false

        }
    }
	$scope.EnabelotherorderList();


	


});