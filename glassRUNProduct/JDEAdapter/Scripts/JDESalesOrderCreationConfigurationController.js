angular.module("glassRUNProduct").controller('JDESalesOrderCreationConfigurationController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
	LoadActiveVariables($sessionStorage, $state, $rootScope);


	//$rootScope.res_PageHeaderTitle = $rootScope.resData.res_AddRoleAccess_RoleAccess;
	$rootScope.res_PageHeaderTitle = " JDE SO Creation Configuration";

	if ($rootScope.Throbber !== undefined) {
		$rootScope.Throbber.Visible = true;
	} else {
		$rootScope.Throbber = {
			Visible: true,
		}
	}

	$scope.JDETableList = [];


	$scope.LoadJDETableForCreateSalesOrder = function () {

	


		var requestData =
		{
			ServicesAction: 'LoadJDETableForCreateSalesOrder'
			
		};
		var jsonobject = {};
		jsonobject.Json = requestData;

		GrRequestService.ProcessRequest(jsonobject).then(function (response) {

			
			debugger;


			$scope.JDETableList = response.data.Json.JDETableList;

			var sdfdf;

			$rootScope.Throbber.Visible = false;

			
		});

	}


	$scope.LoadJDETableForCreateSalesOrder();




	//Save Role Access Information RoleWiseFieldAccessList
	$scope.Save = function () {



		debugger;

		var requestData =
		{
			ServicesAction: 'SaveJDETableConfiguration',
			JDETableList: $scope.JDETableList  

		};
		var jsonobject = {};
		jsonobject.Json = requestData;

		GrRequestService.ProcessRequest(jsonobject).then(function (response) {


			debugger;


			$rootScope.ValidationErrorAlert('Record Saved Successfully.', 'error', 3000);

			$rootScope.Throbber.Visible = false;


		});











	}

	$scope.Clear = function () {

		
	}


	$scope.minlengthValidation = function (tableColumn) {

		debugger;

		if (typeof tableColumn.glassRUNFieldName !== "undefined" ) {

			if (tableColumn.glassRUNFieldName.length > tableColumn.Length) {


				return false;
			}




		}

		

		return true;

	}


	$scope.filterJson = function (tableColumn) {
		return tableColumn.IsGeneratedbyGlassRUN === "0";
	};

	

});