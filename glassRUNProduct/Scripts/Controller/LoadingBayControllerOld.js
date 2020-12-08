angular.module("glassRUNProduct").controller('LoadingBayController', function ($scope, $q, $timeout, $rootScope, $document, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageOrderService) {


	LoadActiveVariables($sessionStorage, $state, $rootScope);
	//$scope.BranchPlantCode = $rootScope.StockLocationCode;
	$scope.BranchPlantCode = '6410';
	$scope.ClickOnHorizontalQueueCart = false;

	$scope.LoadThrobberForPage = function () {
		if ($rootScope.Throbber !== undefined) {
			$rootScope.Throbber.Visible = false;
		} else {
			$rootScope.Throbber = {
				Visible: false,
			}
		};
	}
	$scope.LoadThrobberForPage();
	$scope.hours = 00;
	$scope.minutes = 00;
	$scope.seconds = 00;

	setTimeout(function () {

		pluginsService.init();
	}, 500);

	var StatusList = $rootScope.StatusResourcesList.filter(function (el) { return el.CultureId === $rootScope.CultureId });
	var page = $location.absUrl().split('#/')[1];

	$scope.ViewControllerName = page;







	$scope.GetDetailFronCart = function () {
		debugger;
		$scope.ShowCartDetailpopup();
	}

	$scope.JsonBay = {
		BayId: 0,
	}

	$scope.star1 = false;
	$scope.star2 = false;
	$scope.star3 = false;


	$ionicModal.fromTemplateUrl('templates/CartDetail.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.CartDetailpopup = modal;
	});
	$scope.ShowCartDetailpopup = function () {
		//$scope.OrderIdConfirmCount = OrderId;

		$scope.CartDetailpopup.show();
	}
	$scope.CloseCartDetailpopup = function () {

		$scope.CartDetailpopup.hide();
	}



	$ionicModal.fromTemplateUrl('templates/BayDetail.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.BayDetailpopup = modal;
	});
	$scope.ShowBayDetailpopup = function () {
		//$scope.OrderIdConfirmCount = OrderId;
		debugger;
		$scope.BayDetailpopup.show();

		$scope.JsonBay.BayId = "" + $scope.BayId;


	}
	$scope.CloseBayDetailpopup = function () {

		$scope.BayDetailpopup.hide();
	}




	$ionicModal.fromTemplateUrl('templates/PriorityDetails.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.PriorityDetailpopup = modal;
	});
	$scope.ShowPriorityDetailpopup = function () {
		//$scope.OrderIdConfirmCount = OrderId;
		debugger;
		$scope.PriorityDetailpopup.show();
		$scope.SelectPriorityCheck($scope.Priority);


	}
	$scope.ClosePriorityDetailpopup = function () {

		$scope.PriorityDetailpopup.hide();
	}


	$scope.LoadCapsuleDetails = function () {
		debugger;
		var orderType = 'SO';
		$rootScope.Throbber.Visible = true;
		if ($rootScope.RoleId == 19) {
			orderType = 'SO';
		} else {
			orderType = 'RPM';
		}


		var orderDTO = {
			OrderType: orderType,
			LocationCode: $scope.BranchPlantCode


		};

		var filterSearchDTO =
		{
			Json: orderDTO,
		};
		ManageOrderService.LoadCapsuleDetails(filterSearchDTO).then(function (response) {
			debugger;
			if (response.data != null && response.data != "") {
				if (response.data.Json != undefined) {
					$scope.LoadCapsuleList = response.data.Json.OrderLoadingDetailList;


				}
			}
			$rootScope.Throbber.Visible = false;



		});
	}



	$scope.LoadQueueDetails = function () {
		debugger;
		var orderType = 'SO';
		$rootScope.Throbber.Visible = true;
		if ($rootScope.RoleId == 19) {
			orderType = 'SO';
		} else {
			orderType = 'RPM';
		}


		var orderDTO = {
			OrderType: orderType


		};

		var filterSearchDTO =
		{
			Json: orderDTO,
		};
		ManageOrderService.LoadQueueDetails(filterSearchDTO).then(function (response) {
			debugger;
			if (response.data != null && response.data != "") {
				if (response.data.Json != undefined) {
					$scope.QueueList = response.data.Json.TruckQueueMappingList;

				}
			}
			$rootScope.Throbber.Visible = false;



		});
	}



	$scope.LoadBayDetailsOnPopup = function (orderNumber, locationCode, truckNumber) {
		debugger;
		$rootScope.Throbber.Visible = true;

		$scope.ShowCartDetailpopup();

		var orderDTO = {
			OrderNumber: orderNumber,
			LocationCode: locationCode,
			TruckNumber: truckNumber


		};

		var filterSearchDTO =
		{
			Json: orderDTO,
		};
		ManageOrderService.LoadBayDetailsOnPopup(filterSearchDTO).then(function (response) {
			debugger;
			//$scope.QueueList= response.data.Json.OrderLoadingDetailList;
			if (response.data != null && response.data != "") {
				if (response.data.Json != undefined) {
					if (response.data.Json.OrderLoadingDetailList.length > 0) {
						var bayDetails = response.data.Json.OrderLoadingDetailList;
						$scope.OrderId = bayDetails[0].OrderId;
						$scope.TruckNumber = bayDetails[0].TruckNumber;
						//$scope.AssignedTime = bayDetails[0].AssignedTime;
						$scope.TruckSize = bayDetails[0].TruckSize;
						$scope.TruckTonnage = parseInt(bayDetails[0].TruckTonnage);
						$scope.OrderNumber = bayDetails[0].OrderNumber;
						$scope.Priority = bayDetails[0].Priority;
						$scope.BayId = bayDetails[0].BayId;
						$scope.LocationCode = locationCode;
						//var baynamevalue = "";
						//for (var i = 0; i < bayDetails[0].BayList.length; i++) {
						//	baynamevalue = baynamevalue + "," + bayDetails[0].BayList[i].BayName;

						//}
						//baynamevalue = baynamevalue.trim();
						//$scope.BayNameCommaSeperatedValue = baynamevalue;

						if (bayDetails[0].BayList !== undefined) {
							var bayListValue = bayDetails[0].BayList.filter(function (el) { return el.IsAssignedBay === "1" });
							if (bayListValue.length == 1) {
								$scope.BayId = parseInt(bayListValue[0].BayId);
								$scope.BayNameCommaSeperatedValue = bayListValue[0].BayName;
								$scope.AssignedTime = bayListValue[0].AssignedTime;
							}
							if (bayDetails[0].BayList.length > 0) {
								$scope.BayListBind = bayDetails[0].BayList;
							}
							var baynamevalue = "";
							for (var i = 0; i < bayDetails[0].BayList.length; i++) {
								baynamevalue = baynamevalue + "," + bayDetails[0].BayList[i].BayName;

							}
							baynamevalue = baynamevalue.trim();
						}
						//$scope.BayNameCommaSeperatedValue = bayListValue[0].BayName;


						//if (bayDetails[0].BayList.length > 0) {
						//	$scope.BayListBind = bayDetails[0].BayList;
						//}
						//var baynamevalue = "";
						//for (var i = 0; i < bayDetails[0].BayList.length; i++) {
						//	baynamevalue = baynamevalue + "," + bayDetails[0].BayList[i].BayName;

						//}
						//baynamevalue = baynamevalue.trim();
						//$scope.BayNameCommaSeperatedValue = baynamevalue;
						$scope.ClickOnHorizontalQueueCart = false;

					}
				} else {
					$scope.Clear();
				}
			} else {
				$scope.Clear();
			}


			$rootScope.Throbber.Visible = false;


		});
	}

	$scope.CancelOrder = function () {
		$scope.CancelOrderAndReQueueSequenceNumber($scope.OrderNumber, $scope.OrderId);
	}


	$scope.CancelOrderAndReQueueSequenceNumber = function (orderNumber, OrderId) {
		debugger;
		$rootScope.Throbber.Visible = true;

		var orderDTO = {
			OrderNumber: orderNumber,
			OrderId: OrderId
		};

		var filterSearchDTO =
		{
			Json: orderDTO,
		};
		ManageOrderService.CancelOrderAndReQueueSequenceNumber(filterSearchDTO).then(function (response) {
			debugger;

			if (response.data != null && response.data != "") {
				if (response.data.Json != undefined) {
					$scope.ClosePriorityDetailpopup();
					$scope.CloseCartDetailpopup();
					$scope.LoadQueueDetails();
					$scope.LoadCapsuleDetails();
				} else {

				}
			}

			$rootScope.Throbber.Visible = false;
		});
	}

	$scope.LoadHorizontalQueueOnPopup = function (orderNumber, locationCode, truckNumber) {
		debugger;
		$rootScope.Throbber.Visible = true;

		$scope.ShowCartDetailpopup();

		var orderDTO = {
			OrderNumber: orderNumber,
			LocationCode: locationCode,
			TruckNumber: truckNumber


		};

		var filterSearchDTO =
		{
			Json: orderDTO,
		};
		ManageOrderService.LoadHorizontalQueueOnPopup(filterSearchDTO).then(function (response) {
			debugger;
			//$scope.QueueList= response.data.Json.OrderLoadingDetailList;
			if (response.data != null && response.data != "") {
				if (response.data.Json != undefined) {
					if (response.data.Json.OrderLoadingDetailList.length > 0) {
						var bayDetails = response.data.Json.OrderLoadingDetailList;
						$scope.OrderId = bayDetails[0].OrderId;
						$scope.TruckNumber = bayDetails[0].TruckNumber;

						$scope.TruckSize = bayDetails[0].TruckSize;
						$scope.TruckTonnage = parseInt(bayDetails[0].TruckTonnage);
						$scope.OrderNumber = bayDetails[0].OrderNumber;
						$scope.Priority = bayDetails[0].Priority;
						$scope.BayId = bayDetails[0].BayId;
						$scope.LocationCode = locationCode;
						if (bayDetails[0].BayList !== undefined) {
							var bayListValue = bayDetails[0].BayList.filter(function (el) { return el.IsAssignedBay === "1" });
							if (bayListValue.length == 1) {
								$scope.BayId = parseInt(bayListValue[0].BayId);
								$scope.BayNameCommaSeperatedValue = bayListValue[0].BayName;
								$scope.AssignedTime = bayListValue[0].AssignedTime;
							}
							if (bayDetails[0].BayList.length > 0) {
								$scope.BayListBind = bayDetails[0].BayList;
							}
							var baynamevalue = "";
							for (var i = 0; i < bayDetails[0].BayList.length; i++) {
								baynamevalue = baynamevalue + "," + bayDetails[0].BayList[i].BayName;

							}
							baynamevalue = baynamevalue.trim();
						}
						//$scope.BayNameCommaSeperatedValue = bayListValue[0].BayName;

						$scope.ClickOnHorizontalQueueCart = true;

					}
				} else {
					$scope.Clear();
				}
			} else {
				$scope.Clear();
			}


			$rootScope.Throbber.Visible = false;


		});
	}


	$scope.Clear = function () {
		$scope.OrderId = "";
		$scope.TruckNumber = "";
		$scope.AssignedTime = "";
		$scope.TruckSize = "";
		$scope.TruckTonnage = "";
		$scope.OrderNumber = "";
		$scope.Priority = "";
		$scope.BayId = "";
		$scope.LocationCode = "";
	}



	$scope.UpdateBayDetails = function () {
		$rootScope.Throbber.Visible = true;

		debugger;
		var orderDTO = {
			OrderId: $scope.OrderId,
			OrderNumber: $scope.OrderNumber,
			LocationCode: $scope.LocationCode,
			BayId: $scope.JsonBay.BayId,
			IsQueueHorizontal: $scope.ClickOnHorizontalQueueCart

		};
		ManageOrderService.UpdateBayDetails(orderDTO).then(function (response) {
			$rootScope.Throbber.Visible = false;
			$scope.CloseBayDetailpopup();
			$scope.CloseCartDetailpopup();
			$scope.LoadQueueDetails();
			//$scope.LoadBayDetailsOnPopup($scope.OrderNumber, $scope.LocationCode, $scope.TruckNumber);
			//$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderGridCust_RecordSaved), '', 3000);
			//$scope.RefreshDataGrid();

		});
	}


	$scope.UpdatePriorityDetails = function () {
		$rootScope.Throbber.Visible = true;

		debugger;
		var orderDTO = {
			OrderId: $scope.OrderId,
			OrderNumber: $scope.OrderNumber,
			TruckNumber: $scope.TruckNumber,
			Priority: $scope.PriorityValue

		};
		ManageOrderService.UpdatePriorityDetails(orderDTO).then(function (response) {
			debugger;
			$rootScope.Throbber.Visible = false;
			$scope.Priority = response.data.Priority;

			$scope.ClosePriorityDetailpopup();
			$scope.CloseCartDetailpopup();
			$scope.LoadQueueDetails();
			$scope.LoadCapsuleDetails();
			//$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderGridCust_RecordSaved), '', 3000);
			//$scope.RefreshDataGrid();

		});
	}



	$scope.GetAllBayList = function () {
		$rootScope.Throbber.Visible = true;


		var orderDTO = {
			RoleId: 17

		};
		ManageOrderService.GetAllBayList(orderDTO).then(function (response) {
			debugger;
			$scope.BayList = response.data;
			$rootScope.Throbber.Visible = false;
			//$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderGridCust_RecordSaved), '', 3000);
			//$scope.RefreshDataGrid();

		});
	}


	$scope.SelectPriorityCheck = function (value) {
		debugger;
		$scope.star1 = false;
		$scope.star2 = false;;
		$scope.star3 = false;
		if (value == "1") {
			$scope.star1 = true;

		}
		else if (value == "2") {
			$scope.star1 = true;
			$scope.star2 = true;

		} else if (value == "3") {
			$scope.star1 = true;
			$scope.star2 = true;
			$scope.star3 = true;
		}
		$scope.PriorityValue = value;

	}

	$scope.DeselctPriorityCheck = function (value) {
		debugger;
		if (value == "1") {
			$scope.star1 = false;
			$scope.star2 = false;
			$scope.star3 = false;

		} else if (value == "2") {
			$scope.star2 = false;
			$scope.star3 = false;

		} else if (value == "3") {
			$scope.star3 = false;
		}
		$scope.PriorityValue = parseInt(value) - parseInt(1);

	}


	$scope.SelectedBay = function (id) {
		debugger;
		var baySelectedList = $scope.LoadCapsuleList.filter(function (el) { return el.IsSelected === true; });
		if (baySelectedList.length > 0) {
			baySelectedList[0].IsSelected = false;
		}

		$scope.SelectedBayId = id;

		var bayList = $scope.LoadCapsuleList.filter(function (el) { return el.BayId === $scope.SelectedBayId; });
		if (bayList.length > 0) {
			$scope.SelecetdOrder = bayList[0].OrderNumber
			bayList[0].IsSelected = true;
			$scope.SelectedBayName = bayList[0].BayName;
			if (bayList[0].IsDeActivated == "0") {
				$scope.ActivatedEnabled = false;
			} else {
				$scope.ActivatedEnabled = true;
			}


		}
		var bayList = $scope.LoadCapsuleList.filter(function (el) { return el.IsSelected === $scope.SelectedBayId; });






	}

	$scope.ActivatedOrDeActivated = function (value) {
		$scope.ActivatedValue = value;
		var bayList = $scope.LoadCapsuleList.filter(function (el) { return el.BayId === $scope.SelectedBayId; });
		if (bayList.length > 0) {
			if (bayList[0].StartTime !== undefined) {
				$rootScope.ValidationErrorAlert("You cannot deactivate the bay beacause loading of the truck is still in progress.After completion of loading you can deactivate this bay", 3000);
			}
			else if (bayList[0].AssignedTime !== undefined) {
				$scope.OpenBayConfirmation();
			} else {
				$scope.BayDeactivatedYes();
			}
		} else {
			$rootScope.ValidationErrorAlert("Please select the bay", 3000);
		}
	}



	//#region Delete Add Grid Data with Confirmation
	$ionicModal.fromTemplateUrl('WarningMessage.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.BayWarningMessageControl = modal;
	});



	$scope.OpenBayConfirmation = function () {

		$scope.BayWarningMessageControl.show();
	};
	$scope.CloseBayConfirmation = function () {
		$scope.BayWarningMessageControl.hide();
	};

	$scope.BayDeactivatedYes = function () {
		$rootScope.Throbber.Visible = true;

		debugger;
		var orderDTO = {
			BayId: $scope.SelectedBayId,
			IsDeActivated: $scope.ActivatedValue

		};
		ManageOrderService.DeactivatedAndActivatedBay(orderDTO).then(function (response) {
			$scope.ActivatedEnabled = $scope.ActivatedValue;
			$scope.CloseBayConfirmation();
			$scope.LoadQueueDetails();
			$scope.LoadCapsuleDetails();
			$rootScope.Throbber.Visible = false;
			if ($scope.ActivatedEnabled == false) {
				$rootScope.ValidationErrorAlert("Bay is Activated", 3000);
			} else {
				$rootScope.ValidationErrorAlert("Bay is DeActivated", 3000);
			}

			//$scope.RefreshDataGrid();

		});
	}


	$scope.UpdateTruckSequenceAfterLoadingEnd = function () {
		$rootScope.Throbber.Visible = true;

		debugger;
		var orderDTO = {
			//OrderId: $scope.OrderId,
			OrderNumber: $scope.SelecetdOrder,
			LocationCode: $scope.LocationCode,
			BayId: $scope.SelectedBayId

		};
		ManageOrderService.UpdateTruckSequenceAfterLoadingEnd(orderDTO).then(function (response) {
			$rootScope.Throbber.Visible = false;


			//$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderGridCust_RecordSaved), '', 3000);
			//$scope.RefreshDataGrid();

		});
	}

	$scope.ProceedToQueue = function () {
		$rootScope.Throbber.Visible = true;

		debugger;
		var orderDTO = {
			OrderId: $scope.OrderId,
			OrderNumber: $scope.OrderNumber,
			TruckNumber: $scope.TruckNumber


		};
		ManageOrderService.ProceedToQueue(orderDTO).then(function (response) {
			$rootScope.Throbber.Visible = false;
			$scope.LoadQueueDetails();
			$scope.LoadCapsuleDetails();
			$scope.CloseCartDetailpopup();

			//$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderGridCust_RecordSaved), '', 3000);
			//$scope.RefreshDataGrid();

		});
	}

	$scope.ChangeTruckOutTimeAcctoBay = function (obj) {
		debugger;
		var bayListValue = $scope.BayListBind.filter(function (el) { return parseInt(el.BayId) === parseInt(obj) });
		$scope.AssignedTime = bayListValue[0].AssignedTime;
	}



	$scope.LoadQueueDetails();
	$scope.LoadCapsuleDetails();
	//$scope.LoadBayDetailsOnPopup();
	$scope.GetAllBayList();


});
