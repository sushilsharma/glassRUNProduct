angular.module("glassRUNProduct").controller('LocationDropdownController', function ($scope, $http, $state, $sessionStorage, $rootScope, $filter, focus, $location, $ionicModal, GrRequestService, pluginsService) {


	$scope.selectedCollectionRow = 0;
	$scope.LoadedCollectionList = [];
	$scope.SearchControl.FilterCollectionAutoCompletebox = "";

	$scope.LoadCollectionLocationList = function () {

		debugger;
		$rootScope.Throbber.Visible = true;
		$scope.LoadedCollectionList = [];

		var requestData =
		{
			ServicesAction: 'GetAllCollectionLocationList',
			CompanyId: 1,
			IsCollectionLocationOnKeyPress: $scope.GetAllCollectionLocations,
			CollectionLocationValue: $scope.SearchControl.InputCollection,
		};

		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {

			if (typeof response.data.Json !== "undefined") {
				$scope.LoadedCollectionList = response.data.Json.CollectionLocationList;
				$rootScope.bindAllBranchPlant = response.data.Json.CollectionLocationList;
				$rootScope.foundResult = false;
			}
			else {
				$rootScope.foundResult = true;
			}

			$rootScope.Throbber.Visible = false;
		});
	}

	$rootScope.LoadCollectionLocationByConfiguration = function () {


		var settingList = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === "GetAllCollectionLocations"; });
		debugger;
		if (settingList.length > 0) {
			if (settingList[0].SettingValue === "" || parseInt(settingList[0].SettingValue) === 0) {
				$scope.GetAllCollectionLocations = false;
			} else {
				$scope.GetAllCollectionLocations = true;
			}
		}



		var settingList = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === "IsCustomerSelectionRequiredForCollectionLocation"; });
		debugger;
		if (settingList.length > 0) {
			if (settingList[0].SettingValue === "" || parseInt(settingList[0].SettingValue) === 0) {
				$scope.IsCustomerSelectionRequiredForCollectionLocation = false;
			} else {
				$scope.IsCustomerSelectionRequiredForCollectionLocation = true;
			}
		}



		if ($scope.GetAllCollectionLocations === true && $scope.IsCustomerSelectionRequiredForCollectionLocation === false) {
			$scope.LoadCollectionLocationList();
		}
	}

	$scope.IsCollectionSearchInputFilled = false;
	$scope.CollectionInputSelecteChangeEvent = function (input) {
		debugger;
		if (input.length > 0) {
			$scope.IsCollectionSearchInputFilled = true;
			$scope.showCollectionbox = true;
			$scope.selectedCollectionRow = -1;

			if ($scope.GetAllCollectionLocations === false && $scope.IsCustomerSelectionRequiredForCollectionLocation === false) {
				if (input.length >= 4) {
					$rootScope.Throbber.Visible = true;
					$scope.LoadCollectionLocationList();
				} else {
					$scope.LoadedCollectionList = [];
				}
			} else if ($scope.GetAllCollectionLocations === false && $scope.IsCustomerSelectionRequiredForCollectionLocation === true) {
				if (input.length >= 4) {
					if ((parseInt($scope.ActiveCompanyId) > 0 && $scope.SearchControl.InputCompany !== "" && $scope.SearchControl.InputCompany !== null)) {
						$rootScope.Throbber.Visible = true;
						$scope.LoadCollectionLocationList();

					} else {
						$rootScope.Throbber.Visible = false;
						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectCustomer), 'error', 8000);
					}
				} else {
					$scope.LoadedCollectionList = [];
				}
			}

		} else {
			$scope.IsCollectionSearchInputFilled = false;
			$scope.showCollectionbox = false;
			$scope.selectedCollectionRow = -1;
		}
		$scope.SearchControl.FilterCollectionAutoCompletebox = input;
	}

	$scope.ShowCollectionListBox = function () {

		$scope.showCollectionbox = !$scope.showCollectionbox;
	}

	$scope.ClearCollectionInputSearchbox = function () {

		$scope.IsCollectionSearchInputFilled = false;
		$scope.showCollectionbox = false;
		$scope.SearchControl.InputCollection = "";
		$scope.SOPOInformation.InputSONumber = "";
		$scope.SearchControl.FilterCollectionAutoCompletebox = "";
	}

	$scope.SelectedCollection = function (collectionId, collectionCode, CollectionName, selectedCollection) {

		if ($rootScope.pageContrlAcessData !== undefined) {
			if ($rootScope.pageContrlAcessData.ShipToLocationCodeSection !== "0") {
				$scope.SearchControl.InputCollection = selectedCollection;
			} else {
				$scope.SearchControl.InputCollection = CollectionName;
			}
		}
		else {
			$scope.SearchControl.InputCollection = selectedCollection;
		}

		$scope.CollectionId = collectionId;
		$scope.CollectionCode = collectionCode;
		$scope.CollectionName = CollectionName;
		$scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry = collectionId;
		$scope.showCollectionbox = false;
		$scope.selectedCollectionRow = -1;


	}
	var page = $location.absUrl().split('#/')[1];

	if (page !== 'SalesAdminApproval' && page !== 'OrderList') {
		$rootScope.LoadCollectionLocationByConfiguration();
	}

});