angular.module("glassRUNProduct").controller('DeliveryLocationDropdownController', function ($scope, $http, $state, $sessionStorage, $rootScope, $filter, focus, $location, $ionicModal, GrRequestService, pluginsService) {


	$scope.selectedShipToLocationRow = 0;
	$scope.bindDeliverylocation = [];
	$scope.SearchControl.FilterShipToLocationAutoCompletebox = "";

	$rootScope.LoadDeliveryLocationListByUser = function () {
		debugger;
		$rootScope.Throbber.Visible = true;
		var requestData =
		{
			ServicesAction: 'LoadAllDeliveryLocation',
			CompanyId: 0,
			IsDeliveryLocationOnKeyPress: $scope.GetAllDeliveryLocations,
			DeliveryLocationValue: $scope.SearchControl.InputShipToLocation,
		};
		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {


			var resoponsedata = response.data;
			if (resoponsedata != null) {
				if (resoponsedata.DeliveryLocation !== undefined) {
					$scope.bindDeliverylocation = resoponsedata.DeliveryLocation.DeliveryLocationList;
					$rootScope.bindAllDeliveryLocation = resoponsedata.DeliveryLocation.DeliveryLocationList;

					$rootScope.ShipToFoundResult = false;
				}
				else {
					$rootScope.ShipToFoundResult = true;
				}
			}
			$rootScope.Throbber.Visible = false;
		});
	}

	$scope.LoadDeliveryLocationLocationByConfiguration = function () {
		debugger;

		var settingList = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === "GetAllDeliveryLocations"; });
		if (settingList.length > 0) {
			if (settingList[0].SettingValue === "" || parseInt(settingList[0].SettingValue) === 0) {
				$scope.GetAllDeliveryLocations = false;
			} else {
				$scope.GetAllDeliveryLocations = true;
			}
		}



		var settingList = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === "IsCustomerSelectionRequiredForDeliveryLocation"; });
		debugger;
		if (settingList.length > 0) {
			if (settingList[0].SettingValue === "" || parseInt(settingList[0].SettingValue) === 0) {
				$scope.IsCustomerSelectionRequiredForDeliveryLocation = false;
			} else {
				$scope.IsCustomerSelectionRequiredForDeliveryLocation = true;
			}
		}



		if ($scope.GetAllDeliveryLocations === true && $scope.IsCustomerSelectionRequiredForDeliveryLocation === false) {
			$scope.LoadDeliveryLocationListByUser();
		}
	}

	$scope.IsShipToLocationSearchInputFilled = false;
	$scope.ShipToLocationInputSelecteChangeEvent = function (input) {
		debugger;
		if (input.length > 0) {
			$scope.IsShipToLocationSearchInputFilled = true;
			$scope.showShipToLocationbox = true;
			$scope.selectedShipToLocationRow = -1;

			if ($scope.GetAllDeliveryLocations === false && $scope.IsCustomerSelectionRequiredForDeliveryLocation === false) {
				if (input.length >= 3) {
					$rootScope.Throbber.Visible = true;
					$rootScope.LoadDeliveryLocationListByUser();
					//$rootScope.Throbber.Visible = false;
				} else {
					$rootScope.bindDeliverylocation = [];
				}
			} else if ($scope.GetAllDeliveryLocations === false && $scope.IsCustomerSelectionRequiredForDeliveryLocation === true) {
				if (input.length >= 3) {
					if ((parseInt($scope.ActiveCompanyId) > 0 && $scope.SearchControl.InputCompany !== "" && $scope.SearchControl.InputCompany !== null)) {
						$rootScope.Throbber.Visible = true;
						$rootScope.LoadDeliveryLocationListByUser();
						//$rootScope.Throbber.Visible = false;

					} else {
						$rootScope.Throbber.Visible = false;
						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectCustomer), 'error', 8000);

					}
				} else {
					$rootScope.bindDeliverylocation = [];
				}
			}

		} else {
			$scope.IsShipToLocationSearchInputFilled = false;
			$scope.showShipToLocationbox = false;
			$scope.selectedShipToLocationRow = -1;
		}
		$scope.SearchControl.FilterShipToLocationAutoCompletebox = input;
	}



	$scope.ShowShipToLocationListBox = function () {
		$scope.showShipToLocationbox = !$scope.showShipToLocationbox;
	}




	$scope.ClearShipToLocationInputSearchbox = function () {
		$scope.IsShipToLocationSearchInputFilled = false;
		$scope.showShipToLocationbox = false;
		$scope.SearchControl.InputShipToLocation = '';
		$scope.SearchControl.FilterShipToLocationAutoCompletebox = '';
	}

	$scope.SelectedCollection = function (collectionId, collectionCode, CollectionName, selectedCollection) {
		debugger;

		if ($rootScope.pageContrlAcessData.ShipToLocationCodeSection !== "0") {
			$scope.SearchControl.InputCollection = selectedCollection;
		} else {
			$scope.SearchControl.InputCollection = CollectionName;
		}

		$scope.CollectionId = collectionId;
		$scope.CollectionCode = collectionCode;
		$scope.CollectionName = CollectionName;
		$scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry = collectionId;
		$scope.showCollectionbox = false;
		$scope.selectedCollectionRow = -1;


	}

	$scope.GetDeliveryLocationDetailsByDeliveryLocationId = function (deliverylocationId) {
		$rootScope.Throbber.Visible = true;
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
					$scope.IsTruckSelectionApplicable = $scope.PageLevelConfigurationByConfigurationName('IsTruckSelectionApplicable');
					if ($scope.IsTruckSelectionApplicable === false) {
						$rootScope.IsSelfCollect = true;
					} else {
						$rootScope.IsSelfCollect = false;
					}

				}

				$rootScope.DeliveryLocationId = deliveryObjDetails[0].DeliveryLocationId;
				$rootScope.DeliveryLocationCode = deliveryObjDetails[0].DeliveryLocationCode;

				//var changedatadeliverylocation = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
				//if (changedatadeliverylocation.length > 0) {
				//    changedatadeliverylocation[0].RequestDate = $rootScope.DateField.RequestDate;
				//    changedatadeliverylocation[0].ShipToCode = $rootScope.DeliveryLocationCode;
				//}

				if ($rootScope.pageContrlAcessData.ShipToLocationCodeSection !== "0") {
					$scope.SearchControl.InputShipToLocation = deliveryObjDetails[0].DeliveryLocationCode;
				} else {
					$scope.SearchControl.InputShipToLocation = deliveryObjDetails[0].DeliveryName;
				}

				$scope.SearchControl.InputTransportVehicle = "";

				$scope.LoadGratisOrderList($rootScope.DeliveryLocationId);

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
				$scope.LoadPickUpDateSelection();

			}
		} else {

			$rootScope.Throbber.Visible = false;
			$scope.ChangedDeliveryLocationId = deliverylocationId;
			$scope.OpenDeliveryLocationChangeConfirmationPopup();
		}

	}


	$scope.SelectedShipToLocation = function (ShipToLocationId, ShipToLocationCode, ShipToLocationName, selectedShipToLocation) {

		debugger;
		if ($rootScope.pageContrlAcessData !== undefined) {
			if ($rootScope.pageContrlAcessData.ShipToLocationCodeSection !== "0") {
				$scope.SearchControl.InputShipToLocation = selectedShipToLocation;
			} else {
				$scope.SearchControl.InputShipToLocation = ShipToLocationName;
			}
		}
		else {
			$scope.SearchControl.InputShipToLocation = selectedShipToLocation;
		}

		$scope.ShipToLocationId = ShipToLocationId;
		$scope.ShipToLocationCode = ShipToLocationCode;
		$scope.ShipToLocationName = ShipToLocationName;
		$scope.showShipToLocationbox = false;
		$scope.selectedShipToLocationRow = -1;
		$scope.SelectedDeliveryLocation.DeliveryLocationForSelectedEnquiry = ShipToLocationId;
		//$scope.GetDeliveryLocationDetailsByDeliveryLocationId(ShipToLocationId)
	}

	var page = $location.absUrl().split('#/')[1];

	if (page !== 'OrderList') {
		$rootScope.LoadDeliveryLocationLocationByConfiguration();
	}


});