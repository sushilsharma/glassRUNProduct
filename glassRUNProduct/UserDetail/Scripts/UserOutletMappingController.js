angular.module("glassRUNProduct").controller('UserOutletMappingController', function ($scope, $timeout, $q, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService, ManageOrderService) {

	//$scope.LoginId = 0

	if ($rootScope.Throbber !== undefined) {
		$rootScope.Throbber.Visible = false;
	} else {
		$rootScope.Throbber = {
			Visible: true
		};
	}

	LoadActiveVariables($sessionStorage, $state, $rootScope);

	$ionicModal.fromTemplateUrl('templates/UserOutletMappingModal.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.UserOutletMappingModalPopup = modal;
	});

	$scope.UserOutletMappingObject = {
		UserId: '',
		CompanyId: '',
		RoleId: ''
	};

	$scope.UserOutletMappingSaveObject = {
		UserOutletMappingId: 0,
		UserId: '',
		CompanyId: '',
		CompanyCode: '',
		RoleId: '',
		IsSuperUser: '',
		IsActive: '',
		NewAddedItem: 0
	};

	$scope.LoadedCompanyList = [];
	$scope.SuperUserList = [];
	$scope.UserOutletMappingList = [];

	$scope.LoadAllCompanyListByParentType = function (companyType) {

		debugger;
		$rootScope.Throbber.Visible = true;

		$scope.LoadedCompanyList = [];

		var requestData =
		{
			ServicesAction: 'LoadAllCompanyDetailListByDropDown',
			CompanyType: companyType,
			CompanyId: $rootScope.CompanyId
		};

		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {

			$rootScope.Throbber.Visible = false;
			var resoponsedata = response.data;

			if (typeof resoponsedata.Json !== 'undefined') {
				// Your variable is undefined
				$scope.LoadedCompanyList = resoponsedata.Json.CompanyList;

				angular.forEach($scope.LoadedCompanyList, function (item) {

					item.Id = parseInt(item.Id);

				});

				angular.forEach($scope.SuperUserList, function (item) {

					$scope.LoadedCompanyList = $scope.LoadedCompanyList.filter(function (el) { return el.Id !== item.CompanyId; });

				});

				angular.forEach($scope.UserOutletMappingList, function (item) {

					$scope.LoadedCompanyList = $scope.LoadedCompanyList.filter(function (el) { return el.Id !== item.CompanyId; });

				});

			}
		});
	};

	$scope.GetSuperUserList = function () {

		$rootScope.Throbber.Visible = true;
		$scope.SuperUserList = [];

		var requestData =
		{
			UserId: $rootScope.CompanyId
		};

		ManageOrderService.GetSuperUserList(requestData).then(function (response) {

			debugger;
			$rootScope.Throbber.Visible = false;
			var resoponsedata = response.data;

			if (resoponsedata !== undefined && resoponsedata !== null) {
				// Your variable is undefined
				$scope.SuperUserList = resoponsedata;

			}
		});
	};

	$scope.GetSuperUserList();

	$scope.LoadOutletList = function () {

		var SuperUserList = angular.copy($scope.SuperUserList);

		$scope.UserOutletMappingList = SuperUserList.filter(function (el) { return el.UserId === $scope.UserOutletMappingObject.UserId && el.IsSuperUser === false; });

		angular.forEach($scope.UserOutletMappingList, function (item) {

			item.NewAddedItem = 0;

		});

		var SuperUserListNew = angular.copy($scope.SuperUserList);

		SuperUserListNew = SuperUserListNew.filter(function (el) { return el.UserId === $scope.UserOutletMappingObject.UserId && el.IsSuperUser === true; });

		if (SuperUserListNew !== undefined) {
			if (SuperUserListNew.length > 0) {

				$scope.UserOutletMappingObject.RoleId = SuperUserListNew[0].RoleId;

				$scope.LoadAllCompanyListByParentType(SuperUserListNew[0].CompanyType);

			} else {
				$scope.LoadedCompanyList = [];
			}
		} else {
			$scope.LoadedCompanyList = [];
		}

	};

	$scope.AddOutlets = function () {

		var LoadedCompanyList = angular.copy($scope.LoadedCompanyList);
		LoadedCompanyList = LoadedCompanyList.filter(function (el) { return el.Id === parseInt($scope.UserOutletMappingObject.CompanyId); });

		if (LoadedCompanyList !== undefined) {

			if (LoadedCompanyList.length > 0) {

				$scope.UserOutletMappingSaveObject = {
					UserOutletMappingId: 0,
					UserId: parseInt($scope.UserOutletMappingObject.UserId),
					CompanyId: parseInt(LoadedCompanyList[0].Id),
					CompanyCode: LoadedCompanyList[0].CompanyMnemonic,
					CompanyName: LoadedCompanyList[0].CompanyName,
					RoleId: parseInt($scope.UserOutletMappingObject.RoleId),
					IsSuperUser: false,
					IsActive: true,
					NewAddedItem: 1
				};

				$scope.UserOutletMappingList.push($scope.UserOutletMappingSaveObject);

				angular.forEach($scope.UserOutletMappingList, function (item) {

					$scope.LoadedCompanyList = $scope.LoadedCompanyList.filter(function (el) { return el.Id !== item.CompanyId; });

				});

			}

		}

	};

	$scope.Clear = function () {

		$scope.UserOutletMappingObject = {
			UserId: '',
			CompanyId: '',
			RoleId: ''
		};

		$scope.UserOutletMappingSaveObject = {
			UserOutletMappingId: 0,
			UserId: '',
			CompanyId: '',
			CompanyCode: '',
			RoleId: '',
			IsSuperUser: '',
			IsActive: '',
			NewAddedItem: 0
		};

		$scope.LoadedCompanyList = [];
		$scope.UserOutletMappingList = [];

		$scope.GetSuperUserList();

	};

	$scope.Save = function () {

		$rootScope.Throbber.Visible = true;

		angular.forEach($scope.UserOutletMappingList, function (item) {

			item.NewAddedItem = 1;

		});

		var requestData =
		{
			UserOutletMappingList: $scope.UserOutletMappingList
		};

		ManageOrderService.SaveUserOutletMapping(requestData).then(function (response) {

			debugger;
			$rootScope.Throbber.Visible = false;
			var resoponsedata = response.data;

			if (resoponsedata !== undefined && resoponsedata !== null) {
				// Your variable is undefined

				$scope.Clear();
				if (resoponsedata.UserId !== 0 && resoponsedata.UserId !== null && resoponsedata.UserId !== undefined) {
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserOutletMapping_UpdateMsg), '', 3000);
				}
				else if (resoponsedata.UserOutletMappingId !== 0 && resoponsedata.UserOutletMappingId !== null && resoponsedata.UserOutletMappingId !== undefined) {
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_UserOutletMapping_InsertMsg), '', 3000);
				}	

			}
		});

	};

	$scope.DeleteCompanyId = "";
	$scope.OpenDeleteUserOutletMappingModalPopup = function (companyId) {

		$scope.DeleteCompanyId = companyId;
		$scope.UserOutletMappingModalPopup.show();

	};

	$scope.CloseUserOutletMappingModalpopup = function () {

		$scope.DeleteCompanyId = "";
		$scope.UserOutletMappingModalPopup.hide();

	};

	$scope.DeleteUserOutletMapping = function () {

		$scope.UserOutletMappingList = $scope.UserOutletMappingList.filter(function (el) { return el.CompanyId !== $scope.DeleteCompanyId; });
		$scope.CloseUserOutletMappingModalpopup();

	};

});