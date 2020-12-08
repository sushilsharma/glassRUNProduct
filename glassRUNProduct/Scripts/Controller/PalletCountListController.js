angular.module("glassRUNProduct").controller('PalletCountListController', function ($scope, $q, $timeout, $rootScope, $document, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageOrderService) {


	//#region Load Variables And Default Values

	$scope.IsGridLoadCompleted = false;

	$scope.$on('$destroy', function (evt) {

		console.log("destroy order");
		// $("#SalesAdminApprovalGrid").dxDataGrid("dispose");
		$("#OrderListGrid").remove();
	});

	setTimeout(function () {
		pluginsService.init();
	}, 500);


	$scope.IsPageLoad = true;
	$scope.ShowReasonCode = false;
	$scope.ProductCodes = "";
	$scope.Areas = "";
	$scope.AreasSearchCriteria = "";
	$scope.BranchPlantCodes = "";
	$scope.BranchPlantCodesSearchCriteria = "";
	$scope.CarrierCodes = "";
	$scope.CarrierCodesSearchCriteria = "";
	$scope.TruckSizes = "";
	$scope.TruckSizesSearchCriteria = "";
	$scope.view_tab = "";

	$scope.ProductSelectedList = [];
	$scope.AreaSelectedList = [];
	$scope.BranchPlantCodeSelectedList = [];
	$scope.CarrierCodeSelectedList = [];
	$scope.TruckSizeSelectedList = [];
	$scope.ProductTexts = { buttonDefaultText: 'Select Product' };
	$scope.AreaListTexts = { buttonDefaultText: 'Select Area' };
	$scope.BranchPlantCodeTexts = { buttonDefaultText: 'Select Branch Plant Code' };
	$scope.CarrierCodeCodeTexts = { buttonDefaultText: 'Select Carrier Code' };
	$scope.TruckSizeTexts = { buttonDefaultText: 'Select Truck Size' };

	$scope.ProductList = [];
	$scope.showPropertyController = "";
	$scope.bindallproduct = [];
	$rootScope.ActionType = "OrderList";
	$rootScope.AttentionNeeded = '0';
	$scope.IsRefreshGrid = false;
	$scope.CurrentOpenMasterDetailsObject = "";
	$scope.selectedRow = -1;
	$scope.PreviousEnterProductQuantity = 0;
	$scope.UnitOfMeasureList = [];
	$scope.PaymentRequestInfoSection = false;
	$rootScope.ItemAddedModalPopupControl = false;
	$scope.ProductInfoSection = false;
	$scope.IsColumnDetailView = false;
	$scope.StockCheckSection = false;
	$scope.StatusTimelineSection = false;
	$scope.CustomerCreditCheckSection = false;
	$scope.ItemCurrentStockPosition = 0;
	$rootScope.DiscountAmount = 0;

	$scope.HeaderCheckboxControl = false;
	$rootScope.IsPalettesRequired = false;
	$rootScope.PalettesWidth = {
		width: "0%"
	};

	$scope.Cost = {
		TripCost: "",
		Revenue: "",
		TransporterId: 0
	};

	$scope.DriverAssigment = {
		DriverName: "",
		TruckPlateNumber: "",
		PlannedCollectionDate: "",
		PlannedDeliveryDate: ""
	};



	setTimeout(function () {

		pluginsService.init();
	}, 500);


	$scope.CellCheckboxControl = false;
	$scope.HeaderCheckBoxAction = false;
	$scope.SalesAdminApprovalList = [];
	$scope.IsChecked = false;
	$scope.IsFiltered = true;
	console.log("-0" + new Date());
	LoadActiveVariables($sessionStorage, $state, $rootScope);
	$scope.RoleName = $rootScope.RoleName;
	$rootScope.PreviousExpandedRow = "";
	$scope.GridColumnList = [];

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

	console.log("-1" + new Date());

	// Change By : Arun Dubey 
	// Change Date : 11/09/2019
	// Change In Status List Filter Condition.

	var StatusList = $rootScope.StatusResourcesList.filter(function (el) { return el.CultureId === $rootScope.CultureId });
	var page = $location.absUrl().split('#/')[1];

	$scope.ViewControllerName = page;

	//$scope.bindAllBranchPlant = [];
	//$scope.bindAllBranchPlant = $rootScope.bindAllBranchPlant;

	$scope.SelectedBranchPlant = {
		BranchPlantForSelectedEnquiry: '',
		BindingDataId: ''
	}

	$scope.SelectedDeliveryLocation = {
		DeliveryLocationForSelectedEnquiry: ''
	}

	$scope.SelectedPromisedDate = {
		PromisedDateForSelected: ''

	}
	$scope.SelectedCollectionDate = {
		CollectionDateForSelected: ''

	}

	var unitOfMeasureList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'UnitOfMeasure'; });
	if (unitOfMeasureList.length > 0) {
		$scope.UnitOfMeasureList = unitOfMeasureList;
	}
	//#endregion

	//#region LoadWorkFlowSteps

	$scope.WorkFlowStepsList = [];
	$scope.WorkFlowStepsDeliveryConfirmationList = [];
	$scope.WorkFlowStepsListForPromiseDate = [];
	$scope.WorkFlowStepsListForDeliveredStatus = [];
	$scope.WorkFlowStepsForRPMOrderSchedulerList = [];






	$scope.LoadWorkFlowStepsData = function () {

		var gridrequestData =
		{
			ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
			RoleId: $rootScope.RoleId,
			UserId: $rootScope.UserId,
			SettingName: 'OrderScheduler'
		};

		//var stringfyjson = JSON.stringify(requestData);
		var gridconsolidateApiParamater =
		{
			Json: gridrequestData,
		};

		console.log("-2" + new Date());
		GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {

			if (response.data != "") {
				if (response.data.Json != undefined) {

					$scope.WorkFlowStepsList = response.data.Json.WorkFlowStepList;

				} else {
					$scope.WorkFlowStepsList = [];
				}
			} else {
				$scope.WorkFlowStepsList = [];
			}

			$scope.LoadWorkFlowStepsDataForPromiseDate();


		});
	};



	$scope.LoadWorkFlowStepsDataForPromiseDate = function () {

		var gridrequestData =
		{
			ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
			RoleId: $rootScope.RoleId,
			UserId: $rootScope.UserId,
			SettingName: 'PromiseDateScheduler'
		};

		//var stringfyjson = JSON.stringify(requestData);
		var gridconsolidateApiParamater =
		{
			Json: gridrequestData,
		};

		console.log("-2" + new Date());
		GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {

			if (response.data != "") {
				if (response.data.Json != undefined) {

					$scope.WorkFlowStepsListForPromiseDate = response.data.Json.WorkFlowStepList;

				} else {
					$scope.WorkFlowStepsListForPromiseDate = [];
				}
			} else {
				$scope.WorkFlowStepsListForPromiseDate = [];
			}

			$scope.LoadWorkFlowStepsDataForDeliveredStatus();


		});
	};

	$scope.LoadWorkFlowStepsDataForDeliveredStatus = function () {

		var gridrequestData =
		{
			ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
			RoleId: $rootScope.RoleId,
			UserId: $rootScope.UserId,
			SettingName: 'DeliveryStatusScheduler'
		};

		//var stringfyjson = JSON.stringify(requestData);
		var gridconsolidateApiParamater =
		{
			Json: gridrequestData,
		};

		console.log("-2" + new Date());
		GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {

			if (response.data != "") {
				if (response.data.Json != undefined) {

					$scope.WorkFlowStepsListForDeliveredStatus = response.data.Json.WorkFlowStepList;

				} else {
					$scope.WorkFlowStepsListForDeliveredStatus = [];
				}
			} else {
				$scope.WorkFlowStepsListForDeliveredStatus = [];
			}

			$scope.LoadWorkFlowStepsDataForDeliveryConfirmation();


		});
	};



	$scope.LoadWorkFlowStepsDataForDeliveryConfirmation = function () {

		var gridrequestData =
		{
			ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
			RoleId: $rootScope.RoleId,
			UserId: $rootScope.UserId,
			SettingName: 'DeliveryConfirmation'
		};

		//var stringfyjson = JSON.stringify(requestData);
		var gridconsolidateApiParamater =
		{
			Json: gridrequestData,
		};

		console.log("-2" + new Date());
		GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
			debugger;
			if (response.data != "") {
				if (response.data.Json != undefined) {

					$scope.WorkFlowStepsDeliveryConfirmationList = response.data.Json.WorkFlowStepList;

				} else {
					$scope.WorkFlowStepsDeliveryConfirmationList = [];
				}
			} else {
				$scope.WorkFlowStepsDeliveryConfirmationList = [];
			}
			$scope.LoadSalesAdminApprovalGrid();



		});
	};


	//#endregion

	// #region Console_sidebar

	$scope.ClearReasonCodeControle = function () {

	}

	$scope.SaveReasonCodeControle = function () {

		var filterList = $scope.AllowedPropertiesList.filter(function (el) { return el.PropertyName === $scope.view_tab; });
		if (filterList.length > 0) {
			var DataUpdateSource = filterList[0].DataUpdateSource;
			var FunctionName = filterList[0].FunctionName;
			var ReasonCodeEventName = filterList[0].ReasonCodeEventName;
			var IsReasonCode = filterList[0].IsReasonCode;

			if ($scope.BindingDataId !== "") {
				$rootScope.Throbber.Visible = true;
				$scope.SelectedEnquiryId = "";
				var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== 999; });
				if (orderDetails.length > 0) {
					var objectList = [];

					for (var i = 0; i < orderDetails.length; i++) {


						var object = {};
						object.ObjectId = orderDetails[i].OrderId;
						orderDetails[i].DataUpdateSource = DataUpdateSource;
						object.DataUpdateSource = DataUpdateSource;
						objectList.push(object);
					}

					var mainObject = {};
					mainObject.ObjectList = objectList;
					mainObject.ObjectType = "Order";
					mainObject.ReasonCodeEventName = ReasonCodeEventName;
					mainObject.FunctionName = FunctionName;
					mainObject.DataUpdateSource = DataUpdateSource;
					mainObject.FunctionParameter = orderDetails;

					if (IsReasonCode == '1') {
						$rootScope.SaveReasonCode(mainObject);
					} else {

						$scope[mainObject.FunctionName](mainObject.FunctionParameter);
						$rootScope.Throbber.Visible = false;

					}

				}
			} else {
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);
			}

		}

	}


	$scope.UpdateData = function (orderDetails) {
		var selectedOrderId = "";
		var DataUpdateSource = "";
		for (var i = 0; i < orderDetails.length; i++) {
			selectedOrderId = selectedOrderId + ',' + orderDetails[i].OrderId;
			DataUpdateSource = orderDetails[i].DataUpdateSource;
		}
		selectedOrderId = selectedOrderId.substr(1);

		var orderList = {
			BranchPlantName: $scope.SelectedBranchPlant.BindingDataId,
			CarrierNumber: $scope.SelectedBranchPlant.BindingDataId,
			OrderId: selectedOrderId,
		}

		var requestData =
		{
			ServicesAction: DataUpdateSource,
			OrderDetailList: orderList
		};

		//  var stringfyjson = JSON.stringify(requestData);
		var consolidateApiParamater =
		{
			Json: requestData,
		};
		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
			$scope.CloseChangeBranchPlantCodePopup();

			$rootScope.Throbber.Visible = false;
			if (DataUpdateSource == "UpdateOrderBranchPlant") {
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_BranchPlantUpdated), '', 3000);
			}
			else {
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_CarrierNumberUpdated), '', 3000);
			}

			$scope.RefreshDataGrid();
		});
	}

	$scope.changeTab = function (tabName) {
		$scope.view_tab = tabName;
		$scope.BindingDataList = [];



		var filterList = $scope.AllowedPropertiesList.filter(function (el) { return el.PropertyName === $scope.view_tab; });
		if (filterList.length > 0) {
			$rootScope.Throbber.Visible = true;
			$scope.showPropertyController = filterList[0].PropertyType;
			$scope.IsReasonCode = filterList[0].IsReasonCode;
			var reasonCodeCategory = filterList[0].ReasonCodeCategory;
			$scope.LookupCategoryValue = reasonCodeCategory;
			var requestData =
			{
				ServicesAction: filterList[0].DataBindingSource,
				CompanyId: 0
			};

			var jsonobject = {};
			jsonobject.Json = requestData;



			var ReasonCoderequestData =
			{
				ServicesAction: 'LoadReasonCodeList',
				LookupCategory: reasonCodeCategory
			};

			var consolidateReasonCodeApiParamater =
			{
				Json: ReasonCoderequestData,
			};


			var ReasonCoderAction = GrRequestService.ProcessRequest(consolidateReasonCodeApiParamater);
			var DataBindingSourceAction = GrRequestService.ProcessRequest(jsonobject);


			$q.all([
				ReasonCoderAction,
				DataBindingSourceAction
			]).then(function (resp) {
				var resoponsedata = resp[1];
				var response = resp[0];

				$scope.ShowReasonCode = true;
				$rootScope.Throbber.Visible = false;

				var resoponsedata = resoponsedata.data;
				if (resoponsedata.Json != undefined) {
					$scope.BindingDataList = resoponsedata.Json.BindingDataList;
				}


				if (response != undefined) {
					if (response.data.ReasonCode != undefined) {
						$rootScope.ReasonCodeList = response.data.ReasonCode.ReasonCodeList;
					}
					else {
						$rootScope.ReasonCodeList = [];
					}
				}
				else { $rootScope.ReasonCodeList = []; }

			});



		}
	}

	$scope.toggleConsole_sidebar = function () {
		debugger;
		$scope.ShowReasonCode = false;
		$scope.BindingDataList = [];
		$rootScope.ReasonCodeList = [];
		$scope.view_tab = "";
		if ($('#Console_sidebar').hasClass('open')) {
			$('#Console_sidebar').removeClass('open');

			$rootScope.Throbber.Visible = false;
			$scope.RefreshDataGrid();
		}
		else {
			$('#Console_sidebar').addClass('open');
		}
	};

	$scope.UpdateAll = function () {


		$rootScope.Throbber.Visible = true;
		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== 999; });
		if (enquiryDetails.length > 0) {

			var checkSelfCollectOrderExist = enquiryDetails.filter(function (el) { return (el.IsSelfCollect === '1' || el.IsSelfCollect === 1) });

			if (checkSelfCollectOrderExist.length > 0 && $scope.TransporterAssingForSelfCollect === 0) {

				$rootScope.Throbber.Visible = false;
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_TransporterCannotAssingForSelfCollectOrders), 'error', 3000);

			}
			else {
				var selectedOrderList = [];

				for (var i = 0; i < enquiryDetails.length; i++) {
					var orderData = {
						OrderId: enquiryDetails[i].OrderId,
						StatusCode: enquiryDetails[i].CurrentState
					}
					selectedOrderList.push(orderData);
				}

				var requestDataForPlateNumber =
				{
					ServicesAction: 'GetAllowedPropertiesChangesByStatusMapping',
					AllowedProperties: selectedOrderList,
				}

				var consolidateAllowedProperties =
				{
					Json: requestDataForPlateNumber,
				};

				GrRequestService.ProcessRequest(consolidateAllowedProperties).then(function (response) {


					$scope.AllowedPropertiesList = response.data.Json.AllowedPropertiesList;

					$rootScope.Throbber.Visible = false;
					$scope.toggleConsole_sidebar();
				});
			}
		} else {
			$rootScope.Throbber.Visible = false;
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
		}
	}





	// #endregion



	$scope.Gridrepaint = function () {

		var grid = $("#OrderListGrid").dxDataGrid("instance");
		var colCount = grid.columnCount();
		for (var i = 0; i < colCount; i++) {

			var DataField = grid.columnOption(i, 'dataField');

			if (grid.columnOption(i, 'visible')) {
				if (DataField === 'DeliveryPersonnelId' || DataField === 'PlateNumber') {
					grid.columnOption(i, 'width', '150');
				}
				else {
					grid.columnOption(i, 'width', 'auto');
				}
			}
		}
		grid.repaint();
	}

	//$scope.PageLevelConfigurationByConfigurationName = function (configurationName) {

	//    var isTrue = false;
	//    var configInfo = $rootScope.PageLevelConfigList.filter(function (el) { return el.SettingName === configurationName; });
	//    if (configInfo.length > 0) {
	//        if (configInfo[0].SettingValue === "1") {
	//            isTrue = true;
	//        }
	//    }
	//    return isTrue
	//}




	$ionicModal.fromTemplateUrl('WarningMessage.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.DeleteWarningMessageControl = modal;
	});


	$ionicModal.fromTemplateUrl('WarningMessageUpdateDeliveryStatus.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.DeleteWarningMessageUpdateDeliveryStatus = modal;
	});



	$scope.CloseWarningMessageUpdateDeliveryStatus = function () {
		$scope.DeleteWarningMessageUpdateDeliveryStatus.hide();
	};


	$scope.LoadDriverAndPlateNumber = function (e) {
		var requestDataForCarrier = {};

		if ($rootScope.RoleName === 'Carrier') {
			requestDataForCarrier =
			{
				ServicesAction: 'LoadAllDriverList',
				CarrierId: $rootScope.CompanyId,
			}
		}
		else {
			requestDataForCarrier =
			{
				ServicesAction: 'LoadAllDriverList',
				CarrierId: 0
			}
		}

		//requestDataForCarrier =
		//    {
		//        ServicesAction: 'LoadAllDriverList',
		//    }

		var consolidateApiParamaterForCarrier =
		{
			Json: requestDataForCarrier,
		};

		GrRequestService.ProcessRequest(consolidateApiParamaterForCarrier).then(function (response) {
			if (response.data != undefined) {
				if (response.data.Json != undefined) {
					$scope.DriverList = response.data.Json.ProfileList;
				} else {
					$scope.DriverList = [];
				}
			} else {
				$scope.DriverList = [];
			}

			var requestDataForPlateNumber =
			{
				ServicesAction: 'GetPlateNumberByCarrierId',
				CarrierId: $rootScope.CompanyId,
				RoleId: $rootScope.RoleId
			}

			var consolidateApiParamaterForPlateNumber =
			{
				Json: requestDataForPlateNumber,
			};

			GrRequestService.ProcessRequest(consolidateApiParamaterForPlateNumber).then(function (response) {
				if (response.data != undefined) {
					if (response.data.Json != undefined) {
						$scope.PlateNumberList = response.data.Json.TransporterVehicleList;
					} else {
						$scope.PlateNumberList = [];
					}
				} else {
					$scope.PlateNumberList = [];
				}
				$scope.DriverAssigment.TruckPlateNumber = e.data.PlateNumber;
				$scope.DriverAssigment.DeliveryPersonnelId = e.data.DeliveryPersonnelId;

			});
		});

		$scope.LoadAllShifts();

		var outerContainerWidth = document.getElementById("OrderListGrid").clientWidth;
		outerContainerWidth = outerContainerWidth - 10;
		e.component.expandRow(e.data);
		$rootScope.PreviousExpandedRow = e.data;
		$rootScope.Throbber.Visible = false;

		var elements = document.getElementsByClassName("EnquiryProductInfoClass");
		var elementId = "";
		for (var i = 0; i < elements.length; i++) {
			elementId = elements[i].id;
			elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
		}
	}

	//$scope.LoadDriverAndPlateNumber();

	$scope.LoadAllShifts = function () {
		//GET SHIFTS DATA
		var requestDataForShifts =
		{
			ServicesAction: 'LoadAllShifts',
			ShiftCode: 0
		}

		var consolidateApiParamaterForShift =
		{
			Json: requestDataForShifts,
		};

		GrRequestService.ProcessRequest(consolidateApiParamaterForShift).then(function (response) {
			if (response.data != undefined) {
				if (response.data.Json != undefined) {
					$scope.ShiftsList = response.data.Json.ShiftsList;
				} else {
					$scope.ShiftsList = [];
				}
			} else {
				$scope.ShiftsList = [];
			}
		});
	}

	$scope.OpenModalPopupToAddNewItem = function () {
		$scope.showItembox = false;
		$scope.OpenAddItemInMasterPopup();
	}

	$scope.OpenAddItemInMasterPopup = function () {
		$rootScope.ItemAddedModalPopupControl = true;
	}

	//#region Load Setting Values
	$scope.LoadDefaultSettingsValue = function () {


		$scope.LoadSettingInfoByName = function (settingName, returnValueDataType) {

			var settingValue = "";
			if ($sessionStorage.AllSettingMasterData != undefined) {
				var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === settingName; });
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
		}


		$scope.TransporterAssingForSelfCollect = $scope.LoadSettingInfoByName('TransporterAssingForSelfCollect', 'float');
		if ($scope.TransporterAssingForSelfCollect === "") {
			$scope.TransporterAssingForSelfCollect = 0;
		}

		$scope.TruckAndDriverAssingForSelfCollect = $scope.LoadSettingInfoByName('TruckAndDriverAssingForSelfCollect', 'float');
		if ($scope.TruckAndDriverAssingForSelfCollect === "") {
			$scope.TruckAndDriverAssingForSelfCollect = 0;
		}


		$scope.ItemTaxInPec = $scope.LoadSettingInfoByName('ItemTaxInPec', 'float');
		if ($scope.ItemTaxInPec === "") {
			$scope.ItemTaxInPec = 0;
		}
		$scope.WoodenPalletCode = $scope.LoadSettingInfoByName('WoodenPalletCode', 'string');

		$scope.NumberOfProductAdd = $scope.LoadSettingInfoByName('NumberOfProductAdd', 'int');
		if ($scope.NumberOfProductAdd === "") {
			$scope.NumberOfProductAdd = $scope.defaultValueForNumberOfProducts;
		}
		$scope.EmptiesAmount = $scope.LoadSettingInfoByName('EmptiesAmount', 'float');
		if ($scope.EmptiesAmount === "") {
			$scope.EmptiesAmount = 0;
		}

		$scope.PalettesBufferWeight = $scope.LoadSettingInfoByName('PalettesBufferWeight', 'float');
		if ($scope.PalettesBufferWeight === "") {
			$scope.PalettesBufferWeight = 0;
		}
		$scope.TruckExceedBufferWeight = $scope.LoadSettingInfoByName('TruckExceedBufferWeight', 'float');
		if ($scope.TruckExceedBufferWeight === "") {
			$scope.TruckExceedBufferWeight = 0;
		}
		$scope.PalettesExceedBufferWeight = $scope.LoadSettingInfoByName('PalettesExceedBufferWeight', 'float');
		if ($scope.PalettesExceedBufferWeight === "") {
			$scope.PalettesExceedBufferWeight = 0;
		}

		$scope.CurrencyFormatCode = $scope.LoadSettingInfoByName('CurrencyFormat', 'string');
		if ($scope.CurrencyFormatCode === "") {
			$scope.CurrencyFormatCode = "EUR";
		}

		$scope.TruckValidationEnable = $scope.LoadSettingInfoByName('IsTruckFullValidationEnabled', 'string');
		if ($scope.TruckValidationEnable !== "") {
			$scope.TruckValidationEnable = 0;
		}
		$scope.TruckSizeValidationEnable = $scope.LoadSettingInfoByName('IsTruckSizeValidationEnabled', 'string');
		if ($scope.TruckSizeValidationEnable !== "") {
			$scope.TruckSizeValidationEnable = 0;
		}

		$scope.PriceFromGlassRunEnable = $scope.LoadSettingInfoByName('PriceFromGlassRun', 'string');

		if ($scope.PriceFromGlassRunEnable === "") {
			$scope.PriceFromGlassRunEnable = 0;
		}


	}




	$scope.LoadDefaultSettingsValue();


	$scope.PageLevelConfigurationByConfigurationName = function (configurationName) {
		var isTrue = false;
		if ($rootScope.PageLevelConfigList !== undefined) {
			if ($rootScope.PageLevelConfigList.length > 0) {
				var configInfo = $rootScope.PageLevelConfigList.filter(function (el) { return el.SettingName === configurationName; });
				if (configInfo.length > 0) {
					if (configInfo[0].SettingValue === "1") {
						isTrue = true;
					}
				}
			}
		}

		return isTrue
	}



	$scope.GetSettingValueFromPagelevelConfiguration = function (configurationName) {
		var settingValue = "";
		if ($rootScope.PageLevelConfigList !== undefined) {
			if ($rootScope.PageLevelConfigList.length > 0) {
				var configInfo = $rootScope.PageLevelConfigList.filter(function (el) { return el.SettingName === configurationName; });
				if (configInfo.length > 0) {
					settingValue = configInfo[0].SettingValue;
				}
			}
		}

		return settingValue
	}


	$scope.LoadPageLevelConfiguration = function () {


		if ($rootScope.PageLevelConfigList !== undefined) {
			if ($rootScope.PageLevelConfigList.length > 0) {

				$scope.IsCreditLimitCheck = $scope.PageLevelConfigurationByConfigurationName('IsCreditLimitCheck');
				$scope.IsMTBalanceCheck = $scope.PageLevelConfigurationByConfigurationName('IsMTBalanceCheck');
				$scope.IsReceivingCapacityCheck = $scope.PageLevelConfigurationByConfigurationName('IsReceivingCapacityCheck');
				$scope.IsReceivingCapacityWarning = $scope.PageLevelConfigurationByConfigurationName('IsReceivingCapacityWarning');
				$scope.IsWeightLoadCheckValidation = $scope.PageLevelConfigurationByConfigurationName('IsWeightLoadCheckValidation');
				$scope.IsPalletLoadCheckValidation = $scope.PageLevelConfigurationByConfigurationName('IsPalletLoadCheckValidation');
				$scope.IsPriceEditable = $scope.PageLevelConfigurationByConfigurationName('IsPriceEditable');
				$scope.IsAllocationApplicable = $scope.PageLevelConfigurationByConfigurationName('IsAllocationApplicable');
				$scope.AddItemInTruckApplicable = $scope.PageLevelConfigurationByConfigurationName('AddItemInTruckApplicable');
				$scope.IsPONumberApplicable = $scope.PageLevelConfigurationByConfigurationName('IsPONumberApplicable');
				$scope.IsSONumberApplicable = $scope.PageLevelConfigurationByConfigurationName('IsSONumberApplicable');
				$scope.IsCollectionLocationSelectionApplicable = $scope.PageLevelConfigurationByConfigurationName('IsCollectionLocationSelectionApplicable');
				$scope.IsPickUpDateApplicable = $scope.PageLevelConfigurationByConfigurationName('IsPickUpDateApplicable');
				$scope.IsRPMOrderSchedulerOn = $scope.PageLevelConfigurationByConfigurationName('IsRPMOrderSchedulerOn');
				$scope.RPMOrderSchedulerStatus = $scope.GetSettingValueFromPagelevelConfiguration('RPMOrderSchedulerStatus');

			}
		}
	}

	$scope.LoadPageLevelConfiguration();

	//#endregion


	var PageControlName = "";

	//#region Grid Configuration
	$scope.LoadGridConfigurationData = function () {
		debugger;
		var objectId = 11113;
		PageControlName = "PalletCount";
		if (page === "PalletCountList") {
			objectId = 11113;

			PageControlName = "PalletCount"
		} 

		var gridrequestData =
		{
			ServicesAction: 'LoadGridConfiguration',
			RoleId: $rootScope.RoleId,
			UserId: $rootScope.UserId,
			CultureId: $rootScope.CultureId,
			ObjectName: PageControlName,
			ObjectId: objectId,
			PageName: $rootScope.PageName,
			ControllerName: page
		};

	
		var gridconsolidateApiParamater =
		{
			Json: gridrequestData,
		};

		console.log("-2" + new Date());



		var filterrequestData =
		{
			ServicesAction: 'LoadGridConfiguration'
		};

		var filterSearchDTO =
		{
			Json: filterrequestData,
		};

		var gridColumn = GrRequestService.ProcessRequest(gridconsolidateApiParamater);
		var filterData = ManageOrderService.GetFilterDataForGrid(filterSearchDTO);

		return $q.all([
			gridColumn,
			filterData
		]).then(function (resp) {
			debugger;
			var response = resp[0];
			var responseFilterData = resp[1];

			$scope.AreaList = [];
			$scope.BranchPlantCodeList = [];
			$scope.CarrierCodeList = [];
			$scope.TruckSizeList = [];
			if (responseFilterData.data !== undefined && responseFilterData.data !== null) {
				if (responseFilterData.data.Json !== undefined && responseFilterData.data.Json !== null) {
					if (responseFilterData.data.Json.FilterList !== undefined && responseFilterData.data.Json.FilterList !== null) {

						if (responseFilterData.data.Json.FilterList[0].AreaList !== undefined && responseFilterData.data.Json.FilterList[0].AreaList !== null) {

							$scope.AreaList = responseFilterData.data.Json.FilterList[0].AreaList;
						}

						if (responseFilterData.data.Json.FilterList[0].BranchPlantCodeList !== undefined && responseFilterData.data.Json.FilterList[0].BranchPlantCodeList !== null) {

							$scope.BranchPlantCodeList = responseFilterData.data.Json.FilterList[0].BranchPlantCodeList;
						}


						if (responseFilterData.data.Json.FilterList[0].CarrierCodeList !== undefined && responseFilterData.data.Json.FilterList[0].CarrierCodeList !== null) {

							$scope.CarrierCodeList = responseFilterData.data.Json.FilterList[0].CarrierCodeList;
						}

						if (responseFilterData.data.Json.FilterList[0].TruckSizeList !== undefined && responseFilterData.data.Json.FilterList[0].TruckSizeList !== null) {

							$scope.TruckSizeList = responseFilterData.data.Json.FilterList[0].TruckSizeList;
						}
					}

				}

			}


			$scope.GridColumnList = response.data.Json.GridColumnList;

			var ld = JSON.stringify(response.data);
			var ColumnlistinJson = JSON.parse(ld);

			$scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList;




			var checkedEnquiryData = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'CheckedEnquiry' });

			if (checkedEnquiryData.length > 0) {


				checkedEnquiryData[0].allowFiltering = false;
				checkedEnquiryData[0].allowSorting = false;
				checkedEnquiryData[0].allowEditing = false;


				checkedEnquiryData[0].cellTemplate = function (container, options) {
					$("<div />").dxCheckBox({
						value: JSON.parse(options.data.CheckedEnquiry),
						//visible: options.data.CurrentState == '999' ? false : options.data.IsCompleted == '1' ? false : true,
						visible: $scope.ViewControllerName == "RPMOrderList" ? options.data.IsShowAssignDriverBtn : options.data.IsEditPromiseDatePickUpDate,
						onValueChanged: function (data) {
							debugger;
							$scope.HeaderCheckboxControl = false;
							$scope.CellCheckboxControl = true;
						}
					}).appendTo(container);
				};


				checkedEnquiryData[0].headerCellTemplate = function (container, options) {


					$("<div />").dxCheckBox({
						value: false,
						onValueChanged: function (data) {
							debugger;
							$scope.HeaderCheckBoxAction = data.value;
							$scope.HeaderCheckboxControl = true;
							$scope.CellCheckboxControl = false;
						}
					}).appendTo(container);
				};
			}


			var statusData = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Status' });

			if (statusData.length > 0) {

				statusData[0].lookup = {
					dataSource: StatusList,
					displayExpr: "ResourceValue",
					valueExpr: "ResourceValue"
				};

			}


			var Area = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Area' });

			if (Area.length > 0) {

				Area[0].lookup = {
					dataSource: $scope.AreaList,
					displayExpr: "Name",
					valueExpr: "Name"
				};

			}

			var BranchPlantCode = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'BranchPlantCode' });

			if (BranchPlantCode.length > 0) {

				BranchPlantCode[0].lookup = {
					dataSource: $scope.BranchPlantCodeList,
					displayExpr: "Name",
					valueExpr: "Name"
				};

			}

			var CarrierCode = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'CarrierCode' });

			if (CarrierCode.length > 0) {

				CarrierCode[0].lookup = {
					dataSource: $scope.CarrierCodeList,
					displayExpr: "Name",
					valueExpr: "Name"
				};

			}

			var TruckSize = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'TruckSize' });

			if (TruckSize.length > 0) {

				TruckSize[0].lookup = {
					dataSource: $scope.TruckSizeList,
					displayExpr: "Name",
					valueExpr: "Name"
				};

			}







			var IsGroupedData = $scope.DynamicColumnList.filter(function (el) { return el.IsGrouped == '1' });


			if (IsGroupedData.length > 0) {

				IsGroupedData[0].groupIndex = 0;
			}






			$scope.LoadSalesAdminApprovalGrid();

			if ($scope.IsRefreshGrid === true) {
				$scope.RefreshDataGrid();
			}

		});


	}


	$scope.LoadGridConfigurationData();

	//#endregion

	//#region load page wise configuration.



	$scope.LoadPageLevelConfiguration = function () {

		$scope.IsMultipleCustomerUpdateBranchPlantApplicable = $scope.PageLevelConfigurationByConfigurationName('IsMultipleCustomerUpdateBranchPlantApplicable');

		$scope.IsShowAllTransporterForUpdate = $scope.PageLevelConfigurationByConfigurationName('IsShowAllTransporterForUpdate');
	};
	$scope.LoadPageLevelConfiguration();

	//#endregion

	//#region Load Sales Admin Approval Grid
	$scope.LoadSalesAdminApprovalGrid = function () {

		debugger;



		console.log("1" + new Date());

		var SalesAdminApprovalData = new DevExpress.data.CustomStore({
			load: function (loadOptions) {
				if (loadOptions.take !== undefined && loadOptions.take !== null) {

					console.log("Load Order list Call start " + new Date());


					var gridrequestDataForOrderScheduler =
					{
						ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
						RoleId: $rootScope.RoleId,
						UserId: $rootScope.UserId,
						SettingName: 'OrderScheduler'
					};

					//var stringfyjson = JSON.stringify(requestData);
					var gridconsolidateApiParamaterForOrderScheduler =
					{
						Json: gridrequestDataForOrderScheduler,
					};







					var gridrequestDataForPromiseDateScheduler =
					{
						ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
						RoleId: $rootScope.RoleId,
						UserId: $rootScope.UserId,
						SettingName: 'PromiseDateScheduler'
					};

					//var stringfyjson = JSON.stringify(requestData);
					var gridconsolidateApiParamaterForPromiseDateScheduler =
					{
						Json: gridrequestDataForPromiseDateScheduler,
					};





					var gridrequestDataForDeliveryStatusScheduler =
					{
						ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
						RoleId: $rootScope.RoleId,
						UserId: $rootScope.UserId,
						SettingName: 'DeliveryStatusScheduler'
					};

					//var stringfyjson = JSON.stringify(requestData);
					var gridconsolidateApiParamaterForDeliveryStatusScheduler =
					{
						Json: gridrequestDataForDeliveryStatusScheduler,
					};





					var gridrequestDataForDeliveryConfirmation =
					{
						ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
						RoleId: $rootScope.RoleId,
						UserId: $rootScope.UserId,
						SettingName: 'DeliveryConfirmation'
					};

					//var stringfyjson = JSON.stringify(requestData);
					var gridconsolidateApiParamaterForDeliveryConfirmation =
					{
						Json: gridrequestDataForDeliveryConfirmation,
					};


					// TODO : Added For RPM OrderList Scheduler

					var gridrequestDataForRPMOrderScheduler =
					{
						ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
						RoleId: $rootScope.RoleId,
						UserId: $rootScope.UserId,
						SettingName: 'RPMOrderScheduler'
					};

					var gridconsolidateApiParamaterForForRPMOrderScheduler =
					{
						Json: gridrequestDataForRPMOrderScheduler,
					};


					var DataResponseForOrderScheduler = {};
					var DataResponseForPromiseDateScheduler = {};
					var DataResponseForDeliveryStatusScheduler = {};
					var DataResponseForDeliveryConfirmation = {};

					// TODO : Added For RPM OrderList Scheduler
					var DataResponseForRPMOrderScheduler = {};





					if ($scope.IsPageLoad) {

						DataResponseForOrderScheduler = GrRequestService.ProcessRequest(gridconsolidateApiParamaterForOrderScheduler);
						DataResponseForPromiseDateScheduler = GrRequestService.ProcessRequest(gridconsolidateApiParamaterForPromiseDateScheduler);
						DataResponseForDeliveryStatusScheduler = GrRequestService.ProcessRequest(gridconsolidateApiParamaterForDeliveryStatusScheduler);

						DataResponseForDeliveryConfirmation = GrRequestService.ProcessRequest(gridconsolidateApiParamaterForDeliveryConfirmation);

						// TODO : Added For RPM OrderList Scheduler
						DataResponseForRPMOrderScheduler = GrRequestService.ProcessRequest(gridconsolidateApiParamaterForForRPMOrderScheduler);
					}







					var orderSearchDTO = $scope.CreateWhereExpressionForGrid(loadOptions);


					var DataResponseForLoadOrderListGrid = ManageOrderService.SearchPalettesList(orderSearchDTO);


					return $q.all([

						DataResponseForOrderScheduler,
						DataResponseForPromiseDateScheduler,
						DataResponseForDeliveryStatusScheduler,
						DataResponseForDeliveryConfirmation,
						DataResponseForLoadOrderListGrid,
						DataResponseForRPMOrderScheduler
					]).then(function (resp) {

						$scope.IsPageLoad = false;


						var ResponseForOrderScheduler = resp[0];
						var ResponseForPromiseDateScheduler = resp[1];
						var ResponseForDeliveryStatusScheduler = resp[2];
						var ResponseForDeliveryConfirmation = resp[3];


						var ResponseForLoadOrderListGrid = resp[4];

						// TODO : Added For RPM OrderList Scheduler
						var ResponseForRPMOrderScheduler = resp[5];

						console.log("Load Order list Call  get Data " + new Date());




						if (ResponseForOrderScheduler.data != undefined) {
							if (ResponseForOrderScheduler.data.Json != undefined) {

								$scope.WorkFlowStepsList = ResponseForOrderScheduler.data.Json.WorkFlowStepList;

							}
						}


						if (ResponseForPromiseDateScheduler.data != undefined) {
							if (ResponseForPromiseDateScheduler.data.Json != undefined) {

								$scope.WorkFlowStepsListForPromiseDate = ResponseForPromiseDateScheduler.data.Json.WorkFlowStepList;

							}
						}

						if (ResponseForDeliveryStatusScheduler.data != undefined) {
							if (ResponseForDeliveryStatusScheduler.data.Json != undefined) {

								$scope.WorkFlowStepsListForDeliveredStatus = ResponseForDeliveryStatusScheduler.data.Json.WorkFlowStepList;

							}
						}


						if (ResponseForDeliveryConfirmation.data != undefined) {
							if (ResponseForDeliveryConfirmation.data.Json != undefined) {

								$scope.WorkFlowStepsDeliveryConfirmationList = ResponseForDeliveryConfirmation.data.Json.WorkFlowStepList;

							}
						}


						// TODO : Added For RPM OrderList Scheduler

						if (ResponseForRPMOrderScheduler.data != undefined) {
							if (ResponseForRPMOrderScheduler.data.Json != undefined) {

								$scope.WorkFlowStepsForRPMOrderSchedulerList = ResponseForRPMOrderScheduler.data.Json.WorkFlowStepList;

							}
						}


						if (ResponseForLoadOrderListGrid.data != undefined) {
							if (ResponseForLoadOrderListGrid.data != undefined) {

								debugger;
								var totalcount = 0;
								var ListData = [];
								var resoponsedata = ResponseForLoadOrderListGrid.data;
								if (resoponsedata !== null) {

									if (resoponsedata !== undefined) {
										if (resoponsedata.length !== undefined) {
											if (resoponsedata.length > 0) {
												ListData = resoponsedata;
												totalcount = resoponsedata[0].TotalCount;
											} else {
												ListData = [];
												totalcount = 0;
											}
										} else {
											ListData = [];
											totalcount = 0;
										}


									} else {
										ListData = [];
										totalcount = 0;
									}
								} var inquiryList = {
									data: ListData,
									totalRecords: totalcount
								}
								for (var i = 0; i < ListData.length; i++) {
									ListData[i].CheckedEnquiry = false;
								}
								$scope.IsGridLoadCompleted = false;
								$rootScope.TotalOrderCount = totalcount;


								var data = ListData;

								debugger;
								$scope.SalesAdminApprovalList = data;
								angular.forEach($scope.SalesAdminApprovalList, function (item) {
									item.ProposedShiftForCheck = item.ProposedShift;
									item.ExpectedTimeOfDeliveryForCheck = item.ExpectedTimeOfDelivery;

									item.CurrentState = "" + item.CurrentState + "";

									if (item.PickDateTime === '1900-01-01T00:00:00') {
										item.PickDateTime = "";
										item.PickDateTimeForCheck = "";
									}
									else {
										item.PickDateTimeForCheck = item.PickDateTime;
									}

									if ($scope.ViewControllerName == "RPMOrderList") {

										if ($scope.RPMOrderSchedulerStatus == '0' || $scope.RPMOrderSchedulerStatus == undefined || $scope.RPMOrderSchedulerStatus == "") {
											if ($scope.WorkFlowStepsForRPMOrderSchedulerList !== undefined && $scope.WorkFlowStepsForRPMOrderSchedulerList.length != 0) {
												var workFlowStepsForRPMOrderSchedulerList = angular.copy($scope.WorkFlowStepsForRPMOrderSchedulerList);
												workFlowStepsForRPMOrderSchedulerList = workFlowStepsForRPMOrderSchedulerList.filter(function (el) { return el.StatusCode === item.CurrentState; });


												if (workFlowStepsForRPMOrderSchedulerList !== undefined) {
													if (workFlowStepsForRPMOrderSchedulerList.length > 0) {
														item.IsShowAssignDriverBtn = true;
													}
													else {
														item.IsShowAssignDriverBtn = false;
													}
												}
												else {
													item.IsShowAssignDriverBtn = false;
												}
											} else {
												var workFlowStepsList = angular.copy($scope.WorkFlowStepsList);
												workFlowStepsList = workFlowStepsList.filter(function (el) { return el.StatusCode === item.CurrentState; });

												if (workFlowStepsList !== undefined) {
													if (workFlowStepsList.length > 0) {
														item.IsShowAssignDriverBtn = false;
													}
													else {
														item.IsShowAssignDriverBtn = true;
													}
												}
												else {
													item.IsShowAssignDriverBtn = true;
												}
											}
										} else {

											var statusValue = $scope.RPMOrderSchedulerStatus.split(',');
											if (statusValue.length > 0) {

												statusValue = statusValue.filter(function (el) { return el === item.CurrentState; });
												if (statusValue !== undefined) {
													if (statusValue.length > 0) {

														item.IsShowAssignDriverBtn = true;
													}
													else {
														item.IsShowAssignDriverBtn = false;
													}
												}
												else {
													item.IsShowAssignDriverBtn = false;
												}
											}

										}



									} else {

										var workFlowStepsList = angular.copy($scope.WorkFlowStepsList);
										workFlowStepsList = workFlowStepsList.filter(function (el) { return el.StatusCode === item.CurrentState; });

										if (workFlowStepsList !== undefined) {
											if (workFlowStepsList.length > 0) {
												item.IsShowAssignDriverBtn = false;
											}
											else {
												item.IsShowAssignDriverBtn = true;
											}
										}
										else {
											item.IsShowAssignDriverBtn = true;
										}
									}

									var workFlowStepsListForPromiseDate = angular.copy($scope.WorkFlowStepsListForPromiseDate);
									workFlowStepsListForPromiseDate = workFlowStepsListForPromiseDate.filter(function (el) { return el.StatusCode === item.CurrentState; });

									if (workFlowStepsListForPromiseDate !== undefined) {
										if (workFlowStepsListForPromiseDate.length > 0) {
											item.IsEditPromiseDatePickUpDate = false;
										}
										else {
											item.IsEditPromiseDatePickUpDate = true;
										}
									}
									else {
										item.IsEditPromiseDatePickUpDate = true;
									}

									var workFlowStepsListForDeliveredStatus = angular.copy($scope.WorkFlowStepsListForDeliveredStatus);
									workFlowStepsListForDeliveredStatus = workFlowStepsListForDeliveredStatus.filter(function (el) { return el.StatusCode === item.CurrentState; });

									if (workFlowStepsListForDeliveredStatus !== undefined) {
										if (workFlowStepsListForDeliveredStatus.length > 0) {
											item.IsShowDeliveryButton = true;
										}
										else {
											item.IsShowDeliveryButton = false;
										}
									}
									else {
										item.IsShowDeliveryButton = false;
									}

									if (item.CurrentState === "103" || item.CurrentState === 103) {
										item.IsShowDeliveryButton = false;
									}



									var workFlowStepsListForDeliveryConfirmation = angular.copy($scope.WorkFlowStepsDeliveryConfirmationList);
									workFlowStepsListForDeliveryConfirmation = workFlowStepsListForDeliveryConfirmation.filter(function (el) { return parseInt(el.StatusCode) === parseInt(item.CurrentState); });

									if (workFlowStepsListForDeliveryConfirmation !== undefined) {
										if (workFlowStepsListForDeliveryConfirmation.length > 0) {
											if (item.CurrentState == '730') {
												item.IsShowDeliveryConfirmationButton = true;
											}
											else {
												item.IsShowDeliveryConfirmationButton = false;
											}
										}
										else {
											item.IsShowDeliveryConfirmationButton = false;
										}
									}
									else {
										item.IsShowDeliveryConfirmationButton = false;
									}









								});



								console.log("3" + new Date());


								if (page === "ControlTower") {

									//	$rootScope.LoadAttentionNeededOrders(consolidateApiParamater);

									$("#OrderListGrid").dxDataGrid("instance").option("height", (($(window).height()) - 205));
								}


								console.log("Load Order list Call   return Data " + new Date());

								return { data: ListData, totalCount: parseInt(totalcount) };






							}
						}





					});


				}
			}
		});

		$scope.GetAllDriverPlateNumberUpdated = function () {



			if ($scope.DriverAssigment.PlannedCollectionDate != "" && $scope.DriverAssigment.PlannedCollectionDate != "1900-01-01T00:00:00") {
				if ($scope.DriverAssigment.PlannedDeliveryDate != "" && $scope.DriverAssigment.PlannedDeliveryDate != "1900-01-01T00:00:00") {

					var pickeddate = $scope.ConvertDatetImeToUTCDateTimeFormat($scope.DriverAssigment.PlannedCollectionDate);
					var delivereddate = $scope.ConvertDatetImeToUTCDateTimeFormat($scope.DriverAssigment.PlannedDeliveryDate);

					if (delivereddate > pickeddate) {

						var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === $scope.OrderIdForDriverAssigned; });
						if (enquiryDetails[0].DeliveryPersonnelId != "0") {
							if (enquiryDetails[0].PlateNumber != undefined && enquiryDetails[0].PlateNumber != "") {
								if (enquiryDetails[0].ProposedShift != undefined && enquiryDetails[0].ProposedShift != "" && enquiryDetails[0].ProposedShift != null) {
									if (enquiryDetails.length > 0) {
										for (var i = 0; i < enquiryDetails.length; i++) {
											enquiryDetails[i].UserId = $rootScope.UserId;
											enquiryDetails[i].CreatedBy = $rootScope.UserId;
											enquiryDetails[i].ExpectedTimeOfDelivery = $scope.DriverAssigment.PlannedDeliveryDate;
											enquiryDetails[i].PickDateTime = $scope.DriverAssigment.PlannedCollectionDate;
										}

										var requestData = {};
										if (enquiryDetails[0].CurrentState === "525" || enquiryDetails[0].CurrentState === 525) {
											requestData = {
												ServicesAction: 'UpdatePickingDate',
												//ServicesAction: 'UpdatePickingDateWithWorkflow',
												PlateDetailsList: enquiryDetails
											};
										}
										else {
											requestData = {
												//ServicesAction: 'UpdatePickingDate',
												ServicesAction: 'UpdatePickingDateWithWorkflow',
												PlateDetailsList: enquiryDetails
											};
										}

										// var stringfyjson = JSON.stringify(requestData);
										var consolidateApiParamater =
										{
											Json: requestData,
										};

										GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
											var eventNotificationList = [];

											for (var i = 0; i < enquiryDetails.length; i++) {
												var eventnotification = {};
												eventnotification.EventCode = "DriverAndPlateNumberAllocation";
												eventnotification.ObjectId = enquiryDetails[i].OrderId;
												eventnotification.ObjectType = "Order";
												eventnotification.IsActive = 1;
												eventNotificationList.push(eventnotification);
											}

											$rootScope.InsertInEventNotification(eventNotificationList);

											$scope.RefreshDataGrid();
											$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
										});
									}
									else {
										$rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
									}
								} else {
									$rootScope.ValidationErrorAlert('Please select Shift.', 'error', 3000);
								}
							}
							else {
								$rootScope.ValidationErrorAlert($rootScope.resData.res_OrderListSelectPlateNumber, 'error', 3000);
							}
						}
						else {
							$rootScope.ValidationErrorAlert($rootScope.resData.res_OrderListSelectDeliveryPersonnel, 'error', 3000);
						}
					} else {
						$rootScope.ValidationErrorAlert($rootScope.resData.res_OrderListPlanCollectionAndPlanDeliveryDateCompare, 'error', 3000);
					}

				}
				else {
					$rootScope.ValidationErrorAlert($rootScope.resData.res_OrderListSelectPlannedDeliveryDate, 'error', 3000);
				}
			}
			else {
				$rootScope.ValidationErrorAlert($rootScope.resData.res_OrderListSelectPlannedCollectionDate, 'error', 3000);
			}
		}

		$scope.GetAssignTransporterUpdated = function () {

			var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
			if (enquiryDetails.length > 0) {
				var Tripcost = [];
				for (var i = 0; i < enquiryDetails.length; i++) {
					var cost = {};
					cost.OrderId = enquiryDetails[i].OrderId;
					cost.OrderNumber = enquiryDetails[i].OrderNumber;
					cost.TripCost = 0;
					cost.TripRevenue = 0;
					cost.TransporterId = $scope.Cost.TransporterId;
					cost.Action = 'AssignTransporter';
					cost.IsActive = 1;

					Tripcost.push(cost);
				}

				var requestData =
				{
					ServicesAction: 'SaveOrderTripCost',
					OrderTripCostList: Tripcost
				};
				// var stringfyjson = JSON.stringify(requestData);
				var consolidateApiParamater =
				{
					Json: requestData,
				};

				GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
					$scope.CloseAssignTransporterPopup();
					$scope.Cost.TripCost = 0;
					$scope.Cost.Revenue = 0;
					$scope.Cost.TransporterId = 0;
					$scope.RefreshDataGrid();
					//$rootScope.ValidationErrorAlert('Transporter assigned successfully', '', 3000);
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderlistPage_TranspoterAssignedSuccess), '', 3000);

					//$rootScope.ValidationErrorAlert(String.Format($rootScope.), '', 3000);
					//var dataGrid = $("#OrderListGrid").dxDataGrid("instance");
					//dataGrid.refresh();
				});
			}
			else {
				$rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
			}
		}

		$scope.GetTripCostUpdated = function () {
			if (parseInt($scope.Cost.TripCost) <= 0 || $scope.Cost.TripCost == "") {
				$rootScope.ValidationErrorAlert($rootScope.resData.res_TripCostinputFieldValidationAlert, 'error', 3000);
				return
			}
			if (parseInt($scope.Cost.Revenue) <= 0 || $scope.Cost.Revenue == "") {
				$rootScope.ValidationErrorAlert($rootScope.resData.res_TripCostRevenueFieldValidationAlert, 'error', 3000);
				return;
			}

			var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
			if (enquiryDetails.length > 0) {
				var Tripcost = [];
				for (var i = 0; i < enquiryDetails.length; i++) {
					var cost = {};
					cost.OrderId = enquiryDetails[i].OrderId;
					cost.OrderNumber = enquiryDetails[i].OrderNumber;
					enquiryDetails[i].TripCost = "" + $scope.Cost.TripCost;
					enquiryDetails[i].TripRevenue = "" + $scope.Cost.Revenue;
					cost.TripCost = $scope.Cost.TripCost;
					cost.TripRevenue = $scope.Cost.Revenue;
					cost.TransporterId = 0;
					cost.Action = 'TripCost';
					cost.IsActive = 1;
					Tripcost.push(cost);
				}

				var requestData =
				{
					ServicesAction: 'SaveOrderTripCost',
					OrderTripCostList: Tripcost
				};
				// var stringfyjson = JSON.stringify(requestData);
				var consolidateApiParamater =
				{
					Json: requestData,
				};

				GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
					$scope.CloseAssignTripCostPopup();
					$scope.Cost.TripCost = 0;
					$scope.Cost.Revenue = 0;
					$rootScope.ValidationErrorAlert('Trip cost saved successfully.', '', 3000);

					//var dataGrid = $("#OrderListGrid").dxDataGrid("instance");
					//dataGrid.refresh();

					$scope.RefreshDataGrid();
				});
			}
			else {
				$rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
			}
		}

		$scope.ConvertDatetImeToUTCDateTimeFormat = function (datetime) {

			var datetimeformat = "";

			if (datetime !== "" && datetime !== undefined && datetime !== null) {

				var date = datetime.split(' ');
				datetime = date[0].split('/');
				if (date.length > 1) {
					datetime = datetime[1] + "/" + datetime[0] + "/" + datetime[2] + " " + date[1];
				}
				else {
					datetime = datetime[1] + "/" + datetime[0] + "/" + datetime[2];
				}

				datetimeformat = new Date(datetime);
			}


			return datetimeformat;
		}


		$scope.OrderDataGrid = {
			dataSource: {
				store: SalesAdminApprovalData,
			},
			bindingOptions: {
			},
			showBorders: true,
			showColumnLines: true,
			showRowLines: true,
			allowColumnReordering: true,
			allowColumnResizing: true,
			columnAutoWidth: true,
			renderAsync: true,
			loadPanel: {
				Type: Number,
				width: 200,
				height: 90,
				indicatorSrc: "",
				shading: true,
				shadingColor: "",
				showIndicator: true,
				showPane: true
			},
			scrolling: {
				mode: "standard",
				showScrollbar: "always", // or "onClick" | "always" | "never"
				//scrollByThumb: false
				//rowRenderingMode: "virtual",

			},
			showColumnLines: true,
			showRowLines: true,

			columnChooser: {
				enabled: true,
				mode: "select"
			},



			columnFixing: {
				enabled: true
			},
			groupPanel: {
				visible: true
			},
			keyExpr: "EnquiryAutoNumber",
			selection: {
				mode: "single"
			},

			onContentReady: function () {
				if ($scope.IsGridLoadCompleted === false) {
					setTimeout(function () {
						$("#OrderListGrid").dxDataGrid("instance").updateDimensions();
						$scope.IsGridLoadCompleted = true;
					}, 200);

				}

			},


			onCellClick: function (e) {

				$scope.IsColumnDetailView = false;
				if ($scope.CellCheckboxControl === true || $scope.HeaderCheckboxControl === true) {
					$scope.IsColumnDetailView = true;

					if ($scope.CellCheckboxControl === true) {
						var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === e.data.OrderId; });
						if (data.length > 0) {
							data[0].CheckedEnquiry = !data[0].CheckedEnquiry;
						}
					}
					else if ($scope.HeaderCheckboxControl === true) {
						for (var i = 0; i < $scope.SalesAdminApprovalList.length; i++) {
							$scope.SalesAdminApprovalList[i].CheckedEnquiry = $scope.HeaderCheckBoxAction;
						}
					}


					$scope.HeaderCheckboxControl = false;
					$scope.CellCheckboxControl = false;
				}

				if (e.rowType !== "filter" && e.rowType != "header" && e.rowType != "detail") {
					var detailViewAvailable = $scope.GridColumnList.filter(function (el) { return el.PropertyName === e.column.dataField; });
					if (detailViewAvailable.length > 0) {
						if (detailViewAvailable[0].IsDetailsViewAvailable === "1") {
							$scope.CurrentOpenMasterDetailsObject = e;
							$scope.IsColumnDetailView = true;

							if (e.column.caption === $rootScope.resData.res_GridColumn_SalesOrderNumber) {
								//if (page === "ControlTower") {
								//    $rootScope.SalesOrderNumber = e.data.SalesOrderNumber;
								//    $scope.toggleConsole_sidebar();

								//    if ($rootScope.GridConfigurationLoadedView === true) {
								//        $rootScope.RefreshDataGridView();
								//    } else {
								//        $rootScope.LoadGridViewConfigurationData();
								//    }
								//}
							}
							else if (e.column.caption === $rootScope.resData.res_GridColumn_OrderNumber) {
								if (page === "ControlTower") {
									$rootScope.SalesOrderNumber = e.data.SalesOrderNumber;
									$rootScope.OrderNumber = e.data.OrderNumber;
									$rootScope.OrderId = e.data.OrderId;
									//$scope.toggleConsole_sidebar();


									$rootScope.LoadWorkFlowActivityLog(e.data);

									//if ($rootScope.GridConfigurationLoadedView === true) {
									//    $rootScope.RefreshDataGridView();
									//} else {
									//    $rootScope.LoadGridViewConfigurationData();
									//}
								} else {
									$scope.ProductInfoSection = true;
									$scope.PaymentRequestInfoSection = false;
									$scope.DriverAssignedInfo = false;
									$scope.StockCheckSection = false;
									$scope.StatusTimelineSection = false;
									$scope.CustomerCreditCheckSection = false;
									var expanded = e.component.isRowExpanded(e.data);
									if (expanded) {
										e.component.collapseRow(e.data);
									} else {
										if ($rootScope.PreviousExpandedRow !== "") {
											if (e.data !== $rootScope.PreviousExpandedRow) {
												e.component.collapseRow($rootScope.PreviousExpandedRow);
											}
										}
										$scope.LoadOrderProductByOrderId(e.data.OrderId, e);

									}
								}
							} else if (e.column.caption === $rootScope.resData.res_GridColumn_Stock && e.data.IsAvailableStock !== "1") {
								$scope.ProductInfoSection = false;
								$scope.PaymentRequestInfoSection = false;
								$scope.DriverAssignedInfo = false;
								$scope.StockCheckSection = true;
								$scope.StatusTimelineSection = false;
								$scope.CustomerCreditCheckSection = false;
								var expanded = e.component.isRowExpanded(e.data);
								if (expanded) {
									e.component.collapseRow(e.data);
								} else {
									if ($rootScope.PreviousExpandedRow !== "") {
										if (e.data !== $rootScope.PreviousExpandedRow) {
											e.component.collapseRow($rootScope.PreviousExpandedRow);
										}
									}
									$scope.LoadEnquiryProductByEnquiryId(e.data.EnquiryId, e);
								}
							}
							else if (e.column.caption === $rootScope.resData.res_GridColumn_Status) {
								$scope.ProductInfoSection = false;
								$scope.PaymentRequestInfoSection = false;
								$scope.DriverAssignedInfo = false;
								$scope.StockCheckSection = false;
								$scope.StatusTimelineSection = true;
								$scope.CustomerCreditCheckSection = false;
								var expanded = e.component.isRowExpanded(e.data);
								if (expanded) {
									e.component.collapseRow(e.data);
								} else {
									if ($rootScope.PreviousExpandedRow !== "") {
										if (e.data !== $rootScope.PreviousExpandedRow) {
											e.component.collapseRow($rootScope.PreviousExpandedRow);
										}
									}
									$scope.LoadEnquiryProductByEnquiryId(e.data.EnquiryId, e);
								}
							} else if (e.column.caption === $rootScope.resData.res_ViewInquiryForOM_CreditLimit) {
								$scope.ProductInfoSection = false;
								$scope.PaymentRequestInfoSection = false;
								$scope.DriverAssignedInfo = false;
								$scope.StockCheckSection = false;
								$scope.StatusTimelineSection = false;
								$scope.CustomerCreditCheckSection = true;
								var expanded = e.component.isRowExpanded(e.data);
								if (expanded) {
									e.component.collapseRow(e.data);
								} else {
									if ($rootScope.PreviousExpandedRow !== "") {
										if (e.data !== $rootScope.PreviousExpandedRow) {
											e.component.collapseRow($rootScope.PreviousExpandedRow);
										}
									}
									$scope.LoadCreditCheckByEnquiryId(e.data.EnquiryId, e);
								}
							}
							else if (e.column.caption === $rootScope.resData.res_Menu_PaymentRequest) {

								var PlateNumberData = e.data.PlateNumberData;
								var TripCost = parseFloat(e.data.TripCost);
								var TripRevenue = parseFloat(e.data.TripRevenue);
								var DriverName = e.data.DriverName;

								if (PlateNumberData === undefined || TripCost === 0 || TripRevenue === 0 || DriverName === '-') {
									$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderGrid_DetailsOfPayment), 'error', 3000);
								}
								else {
									$scope.ProductInfoSection = false;
									$scope.PaymentRequestInfoSection = true;
									$scope.DriverAssignedInfo = false;
									$scope.StockCheckSection = false;
									$scope.StatusTimelineSection = false;
									$scope.CustomerCreditCheckSection = false;
									var expanded = e.component.isRowExpanded(e.data);
									if (expanded) {
										e.component.collapseRow(e.data);
									} else {
										if ($rootScope.PreviousExpandedRow !== "") {
											if (e.data !== $rootScope.PreviousExpandedRow) {
												e.component.collapseRow($rootScope.PreviousExpandedRow);
											}
										}
										$rootScope.PaymentRequestByOrder(e.data.CarrierNumber, e.data.OrderId, e.data.SalesOrderNumber, e);
										$scope.DeleteMiscCarrierNumber = e.data.CarrierNumber;
										$scope.DeleteMiscOrderId = e.data.OrderId;
										$scope.DeleteMiscSalesOrderNumber = e.data.SalesOrderNumber;

									}
								}
							}
							else if (e.column.caption === $rootScope.resData.res_Menu_LorryReceipt) {

								$rootScope.OrderId = e.data.OrderId;
								//$sessionStorage.OrderId = $rootScope.OrderId;
								//$state.go("LorryReceiptView");
								$rootScope.RedirectPage("LorryReceiptView", "LorryReceiptView");
							}
							else if (e.column.caption === $rootScope.resData.res_OrderList_Delivered) {

								if (e.data.IsShowDeliveryButton) {
									var expanded = e.component.isRowExpanded(e.data);
									if (expanded) {
										e.component.collapseRow(e.data);
									} else {
										if ($rootScope.PreviousExpandedRow !== "") {
											if (e.data !== $rootScope.PreviousExpandedRow) {
												e.component.collapseRow($rootScope.PreviousExpandedRow);
											}
										}

										$scope.DeleteWarningMessageUpdateDeliveryStatus.show();
										$scope.OrderIdForDeliveryStatus = e.data.OrderId;
										$scope.CurrentStateForDeliveryStatus = e.data.CurrentState;
										//$scope.UpdateDeliveryStatus(e.data.OrderId, e.data.CurrentState);

									}
								}

							}
							else if (e.column.caption === $rootScope.resData.res_GridColumn_AssignedDriver) {

								//if (e.data.Status != "Delivered") {
								if (e.data.IsShowAssignDriverBtn) {
									$scope.ProductInfoSection = false;
									$scope.DriverAssignedInfo = true;
									$scope.PaymentRequestInfoSection = false;
									$scope.StockCheckSection = false;
									$scope.StatusTimelineSection = false;
									$scope.CustomerCreditCheckSection = false;
									var expanded = e.component.isRowExpanded(e.data);
									if (expanded) {
										e.component.collapseRow(e.data);
									} else {
										if ($rootScope.PreviousExpandedRow !== "") {
											if (e.data !== $rootScope.PreviousExpandedRow) {
												e.component.collapseRow($rootScope.PreviousExpandedRow);
											}
										}
										$scope.OrderIdForDriverAssigned = e.data.OrderId;
										if (e.data.Status == "Order Scheduled") {


											$scope.DriverAssigment.PlannedCollectionDate = $filter('date')(e.data.PickDateTimeFromOM, 'dd/MM/yyyy');

											$scope.DriverAssigment.PlannedDeliveryDate = $filter('date')(e.data.ExpectedTimeOfDeliveryFromOM, 'dd/MM/yyyy');

										}
										else {
											if (e.data.PickDateTimeValue != '1900-01-01T00:00:00') {
												$scope.DriverAssigment.PlannedCollectionDate = $filter('date')(e.data.PickDateTimeValue, 'dd/MM/yyyy');
											}
											else {
												$scope.DriverAssigment.PlannedCollectionDate = "";
											}
											$scope.DriverAssigment.PlannedDeliveryDate = $filter('date')(e.data.ExpectedTimeOfDeliveryValue, 'dd/MM/yyyy');

										}
										$scope.LoadDriverAndPlateNumber(e);

										//$rootScope.PaymentRequestByOrder(e.data.CarrierNumber, e.data.OrderId, e.data.SalesOrderNumber, e);
										//$scope.DeleteMiscCarrierNumber = e.data.CarrierNumber;
										//$scope.DeleteMiscOrderId = e.data.OrderId;
										//$scope.DeleteMiscSalesOrderNumber = e.data.SalesOrderNumber;

									}
								}
							}


						} else {
							//$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApprovalGrid_DetailView), 'error', 3000);
						}
					}
				} else {
					$scope.IsColumnDetailView = true;
				}
			},

			onRowClick: function (e) {
				//if ($scope.IsColumnDetailView === false) {
				//    $state.go("TrackerPage");
				//}
			},

			columnsAutoWidth: false,
			rowAlternationEnabled: true,
			//filterRow: {
			//	visible: true,
			//	applyFilter: "auto"
			//},
			//headerFilter: {
			//	visible: true,
			//	allowSearch: true
			//},
			remoteOperations: {
				sorting: true,
				filtering: true,
				paging: true
			},
			paging: {
				pageSize: 50
			},
			pager: {
				showPageSizeSelector: true,
				allowedPageSizes: [10, 50, 100, 500],
				showInfo: true,
				showNavigationButtons: true,
				visible: true
			},


			masterDetail: {
				scrolling:
				{
					enabled: false,
					visible: false
				},
				enabled: false,
				template: "EnquiryProductInfo"
			},
			columns: $scope.DynamicColumnList,
			onKeyDown: function (e) {
				var key = e.jQueryEvent.key;
				if (key === "ArrowRight" || key === "ArrowLeft" || key === "ArrowUp" || key === "ArrowDown")
					e.jQueryEvent.preventDefault();
			}
		};
	}







	$scope.CreateWhereExpressionForGrid = function (loadOptions) {

		var parameters = {};

		if (loadOptions.sort) {
			parameters.orderby = loadOptions.sort[0].selector;
			if (loadOptions.sort[0].desc)
				parameters.orderby += " desc";
		}

		parameters.skip = loadOptions.skip || 0;
		parameters.take = loadOptions.take || 100;

		var filterOptions = "";
		if (loadOptions.dataField === undefined) {
			filterOptions = loadOptions.filter ? loadOptions.filter.join(",") : "";
		} else {
			if (loadOptions.filter !== undefined) {
				var column = loadOptions.filter[0];
				var data = loadOptions.dataField + "," + column[1] + "," + column[2];
				filterOptions = data;
			}
		}

		var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";

		var EnquiryAutoNumber = "";
		var EnquiryAutoNumberCriteria = "";

		var SoldToCode = "";
		var SoldToCodeCriteria = "";

		var CompanyNameValue = "";
		var CompanyNameValueCriteria = "";

		var ShortCompanyName = "";
		var ShortCompanyNameCriteria = "";

		var DeliveryLocationName = "";
		var DeliveryLocationNameCriteria = "";

		var EnquiryDate = "";
		var EnquiryDateCriteria = "";
		var EnquiryEndDate = "";
		var EnquiryEndDateCriteria = "";

		var RequestCollectionDate = "";
		var RequestCollectionDateCriteria = "";

		var RequestDate = "";
		var RequestDateCriteria = "";


		var PromisedDate = "";
		var PromisedDateCriteria = "";
		var PromisedEndDate = "";
		var PromisedEndDateCriteria = "";


		var Area = "";
		var AreaCriteria = "";

		var PlateNumberData = "";
		var PlateNumberDataCriteria = "";

		var Gratis = "";
		var GratisCriteria = "";

		var DeliveryLocation = "";
		var DeliveryLocationCriteria = "";

		var Empties = "";
		var EmptiesCriteria = "";

		var ReceivedCapacityPalates = "";
		var ReceivedCapacityPalatesCriteria = "";

		var TotalPrice = "";
		var TotalPriceCriteria = "";

		var Status = "";
		var StatusCriteria = "";

		var AvailableStock = "";
		var AvailableStockCriteria = "";

		var AvailableCredit = "";
		var AvailableCreditCriteria = "";

		var BranchPlant = "";
		var BranchPlantCriteria = "";

		var BranchPlantCode = "";
		var BranchPlantCodeCriteria = "";

		var TruckSize = "";
		var TruckSizeCriteria = "";

		var OrderNumber = "";
		var OrderNumberCriteria = "";

		var BranchPlantNameCriteria = "";
		var BranchPlantName = "";

		var OrderDateCriteria = "";
		var OrderDate = "";
		var OrderEndDateCriteria = "";
		var OrderEndDate = "";

		var PickupDateCriteria = "";
		var PickupDateDate = "";
		var PickupDateEndDateCriteria = "";
		var PickupDateEndDate = "";

		var CollectedDateCriteria = "";
		var CollectedDate = "";

		var DeliveredCriteria = "";
		var DeliveredDate = "";


		var PlanCollectionDateCriteria = "";
		var PlanCollectionDate = "";
		var PlanCollectionEndDateCriteria = "";
		var PlanCollectionEndDate = "";

		var PlanDeliveryDateCriteria = "";
		var PlanDeliveryDate = "";
		var PlanDeliveryEndDateCriteria = "";
		var PlanDeliveryEndDate = "";


		var PurchaseOrderNumberCriteria = "";
		var PurchaseOrderNumber = "";

		var CarrierNumberValue = "";
		var CarrierNumberValueCriteria = "";

		var TripCost = "";
		var TripCostCriteria = "";

		var SupplierName = "";
		var SupplierNameCriteria = "";


		var TripRevenue = "";
		var TripRevenueCriteria = "";

		var SalesOrderNumberCriteria = "";
		var SalesOrderNumber = "";

		var DriverNameCriteria = "";
		var DriverName = "";

		var PlateNumberCriteria = "";
		var PlateNumber = "";

		var ShiftCriteria = "";
		var Shift = "";

		var UserNameCriteria = "";
		var UserName = "";

		var ApprovedByCriteria = "";
		var ApprovedBy = "";

		var ReceivedCapacityPalettesCriteria = "";
		var ReceivedCapacityPalettes = "";

		var LoadNumberCriteria = "";
		var LoadNumber = "";
		debugger;
		var OrderSearchParameterList = [];

		var fields = [];
		if (filterOptions != "") {
			fields = filterOptions.split('and,');
			if (fields.length === 1) {
				if (fields[0].includes(">=") && !fields[0].includes("Status")) {
					fields = filterOptions.split('or,');
				}
			}
			for (var i = 0; i < fields.length; i++) {
				var columnsList = fields[i];
				//Sushil Sharma 19-9-2019
				//Error in this code .
				if (columnsList.includes("or") && fields[i].includes("Status")) {

					var criteria = "in";
					var columnValues = "";
					var columnName = ""; i
					columnsList = columnsList.split(',or,');
					for (var k = 0; k < columnsList.length; k++) {
						var splitColumnValue = columnsList[k].split(',');
						columnValues = columnValues + "," + splitColumnValue[2];
						columnName = splitColumnValue[0];
					}
					columnValues = columnValues.substr(1);

					if (columnName === "Status") {
						Status = columnValues;
						StatusCriteria = criteria;

						var statusParam = {};
						statusParam.fieldName = "Status";
						statusParam.operatorName = StatusCriteria;
						statusParam.fieldValue = Status;
						statusParam.fieldType = "string";
						OrderSearchParameterList.push(statusParam);
					}

				}

				else if (columnsList.includes("or") && (fields[i].includes("TruckSize") || fields[i].includes("Area") || fields[i].includes("CollectionLocationCode") || fields[i].includes("BranchPlantCode") || fields[i].includes("CarrierCode"))) {

					var criteria = "in";
					var columnValues = "";
					var columnName = ""; i
					columnsList = columnsList.split(',or,');
					for (var k = 0; k < columnsList.length; k++) {
						var splitColumnValue = columnsList[k].split(',');
						columnValues = columnValues + ",'" + splitColumnValue[2]+"'";
						columnName = splitColumnValue[0];
					}
					columnValues = columnValues.substr(1);


					Status = columnValues;
					StatusCriteria = criteria;

					var statusParam = {};
					statusParam.fieldName = columnName;
					statusParam.operatorName = StatusCriteria;
					statusParam.fieldValue = Status;
					statusParam.fieldType = "string";
					OrderSearchParameterList.push(statusParam);


				}

				else {


					columnsList = columnsList.split(',');

					if (columnsList[0] === "EnquiryDate") {
						if (EnquiryDate === "") {
							EnquiryDateCriteria = columnsList[1];
							EnquiryDate = columnsList[2];
							EnquiryDate = new Date(EnquiryDate);
							EnquiryDate = $filter('date')(EnquiryDate, "dd/MM/yyyy");

							var EnquiryDateParam = {};
							EnquiryDateParam.fieldName = "EnquiryDate";
							EnquiryDateParam.operatorName = EnquiryDateCriteria;
							EnquiryDateParam.fieldValue = EnquiryDate;
							EnquiryDateParam.fieldType = "date";
							OrderSearchParameterList.push(EnquiryDateParam);

						} else {
							EnquiryEndDateCriteria = columnsList[1];
							EnquiryEndDate = columnsList[2];
							EnquiryEndDate = new Date(EnquiryEndDate);
							EnquiryEndDate = $filter('date')(EnquiryEndDate, "dd/MM/yyyy");

							var EnquiryEndDateParam = {};
							EnquiryEndDateParam.fieldName = "EnquiryDate";
							EnquiryEndDateParam.operatorName = EnquiryEndDateCriteria;
							EnquiryEndDateParam.fieldValue = EnquiryEndDate;
							EnquiryEndDateParam.fieldType = "date";
							OrderSearchParameterList.push(EnquiryEndDateParam);
						}
					}



					if (columnsList[0] === "PickDateTimeValue") {
						if (RequestCollectionDate === "") {
							if (fields.length > 1) {
								RequestCollectionDateCriteria = "=";
							} else {
								RequestCollectionDateCriteria = columnsList[1];
							}
							RequestCollectionDate = columnsList[2];
							RequestCollectionDate = new Date(RequestCollectionDate);
							RequestCollectionDate = $filter('date')(RequestCollectionDate, "dd/MM/yyyy");

							var RequestCollectionDateParam = {};
							RequestCollectionDateParam.fieldName = "PickDateTimeValue";
							RequestCollectionDateParam.operatorName = RequestCollectionDateCriteria;
							RequestCollectionDateParam.fieldValue = RequestCollectionDate;
							RequestCollectionDateParam.fieldType = "date";
							OrderSearchParameterList.push(RequestCollectionDateParam);

						}
					}

					if (columnsList[0] === "PickDateTime") {
						if (PickupDateDate === "") {
							PickupDateCriteria = columnsList[1];
							PickupDateDate = columnsList[2];
							PickupDateDate = new Date(PickupDateDate);
							PickupDateDate = $filter('date')(PickupDateDate, "dd/MM/yyyy");

							var PickDateTimeParam = {};
							PickDateTimeParam.fieldName = "PickDateTime";
							PickDateTimeParam.operatorName = PickupDateCriteria;
							PickDateTimeParam.fieldValue = PickupDateDate;
							PickDateTimeParam.fieldType = "date";
							OrderSearchParameterList.push(PickDateTimeParam);

						} else {
							PickupDateEndDateCriteria = columnsList[1];
							PickupDateEndDate = columnsList[2];
							PickupDateEndDate = new Date(PickupDateEndDate);
							PickupDateEndDate = $filter('date')(PickupDateEndDate, "dd/MM/yyyy");

							var PickEndDateTimeParam = {};
							PickEndDateTimeParam.fieldName = "PickDateTime";
							PickEndDateTimeParam.operatorName = PickupDateEndDateCriteria;
							PickEndDateTimeParam.fieldValue = PickupDateEndDate;
							PickEndDateTimeParam.fieldType = "date";
							OrderSearchParameterList.push(PickEndDateTimeParam);

						}
					}


					if (columnsList[0] === "OrderDate") {
						if (OrderDate === "") {
							OrderDateCriteria = columnsList[1];
							OrderDate = columnsList[2];
							OrderDate = new Date(OrderDate);
							OrderDate = $filter('date')(OrderDate, "dd/MM/yyyy");

							var OrderDateParam = {};
							OrderDateParam.fieldName = "OrderDate";
							OrderDateParam.operatorName = OrderDateCriteria;
							OrderDateParam.fieldValue = OrderDate;
							OrderDateParam.fieldType = "date";
							OrderSearchParameterList.push(OrderDateParam);

						} else {
							OrderEndDateCriteria = columnsList[1];
							OrderEndDate = columnsList[2];
							OrderEndDate = new Date(OrderEndDate);
							OrderEndDate = $filter('date')(OrderEndDate, "dd/MM/yyyy");

							var OrderEndDateParam = {};
							OrderEndDateParam.fieldName = "OrderDate";
							OrderEndDateParam.operatorName = OrderEndDateCriteria;
							OrderEndDateParam.fieldValue = OrderEndDate;
							OrderEndDateParam.fieldType = "date";
							OrderSearchParameterList.push(OrderEndDateParam);

						}
					}



					if (columnsList[0] === "PlanCollectionDate") {
						if (PlanCollectionDate === "") {
							PlanCollectionDateCriteria = columnsList[1];
							PlanCollectionDate = columnsList[2];
							PlanCollectionDate = new Date(PlanCollectionDate);
							PlanCollectionDate = $filter('date')(PlanCollectionDate, "dd/MM/yyyy");

							var PlanCollectionDateParam = {};
							PlanCollectionDateParam.fieldName = "PlanCollectionDate";
							PlanCollectionDateParam.operatorName = PlanCollectionDateCriteria;
							PlanCollectionDateParam.fieldValue = PlanCollectionDate;
							PlanCollectionDateParam.fieldType = "date";
							OrderSearchParameterList.push(PlanCollectionDateParam);

						} else {
							PlanCollectionEndDateCriteria = columnsList[1];
							PlanCollectionEndDate = columnsList[2];
							PlanCollectionEndDate = new Date(PlanCollectionEndDate);
							PlanCollectionEndDate = $filter('date')(PlanCollectionEndDate, "dd/MM/yyyy");

							var PlanCollectionEndDateParam = {};
							PlanCollectionEndDateParam.fieldName = "PlanCollectionDate";
							PlanCollectionEndDateParam.operatorName = PlanCollectionEndDateCriteria;
							PlanCollectionEndDateParam.fieldValue = PlanCollectionEndDate;
							PlanCollectionEndDateParam.fieldType = "date";
							OrderSearchParameterList.push(PlanCollectionEndDateParam);

						}
					}

					if (columnsList[0] === "PlanDeliveryDate") {
						if (PlanDeliveryDate === "") {
							PlanDeliveryDateCriteria = columnsList[1];
							PlanDeliveryDate = columnsList[2];
							PlanDeliveryDate = new Date(PlanDeliveryDate);
							PlanDeliveryDate = $filter('date')(PlanDeliveryDate, "dd/MM/yyyy");

							var PlanDeliveryDateParam = {};
							PlanDeliveryDateParam.fieldName = "PlanDeliveryDate";
							PlanDeliveryDateParam.operatorName = PlanDeliveryDateCriteria;
							PlanDeliveryDateParam.fieldValue = PlanDeliveryDate;
							PlanDeliveryDateParam.fieldType = "date";
							OrderSearchParameterList.push(PlanDeliveryDateParam);

						} else {
							PlanDeliveryEndDateCriteria = columnsList[1];
							PlanDeliveryEndDate = columnsList[2];
							PlanDeliveryEndDate = new Date(PlanDeliveryEndDate);
							PlanDeliveryEndDate = $filter('date')(PlanDeliveryEndDate, "dd/MM/yyyy");

							var PlanDeliveryEndDateParam = {};
							PlanDeliveryEndDateParam.fieldName = "PlanDeliveryDate";
							PlanDeliveryEndDateParam.operatorName = PlanDeliveryEndDateCriteria;
							PlanDeliveryEndDateParam.fieldValue = PlanDeliveryEndDate;
							PlanDeliveryEndDateParam.fieldType = "date";
							OrderSearchParameterList.push(PlanDeliveryEndDateParam);

						}
					}



					if (columnsList[0] === "CollectedDate") {
						if (CollectedDate === "") {
							if (fields.length > 1) {
								CollectedDateCriteria = "=";
							} else {
								CollectedDateCriteria = columnsList[1];
							}
							CollectedDate = columnsList[2];
							CollectedDate = new Date(CollectedDate);
							CollectedDate = $filter('date')(CollectedDate, "dd/MM/yyyy HH:mm");

							var CollectedDateParam = {};
							CollectedDateParam.fieldName = "CollectedDate";
							CollectedDateParam.operatorName = CollectedDateCriteria;
							CollectedDateParam.fieldValue = CollectedDate;
							CollectedDateParam.fieldType = "date";
							OrderSearchParameterList.push(CollectedDateParam);

						}
					}

					if (columnsList[0] === "DeliveredDate") {
						if (DeliveredDate === "") {
							if (fields.length > 1) {
								DeliveredCriteria = "=";
							} else {
								DeliveredCriteria = columnsList[1];
							}
							DeliveredDate = columnsList[2];
							DeliveredDate = new Date(DeliveredDate);
							DeliveredDate = $filter('date')(DeliveredDate, "dd/MM/yyyy HH:mm");

							var DeliveredDateParam = {};
							DeliveredDateParam.fieldName = "DeliveredDate";
							DeliveredDateParam.operatorName = DeliveredCriteria;
							DeliveredDateParam.fieldValue = DeliveredDate;
							DeliveredDateParam.fieldType = "date";
							OrderSearchParameterList.push(DeliveredDateParam);

						}
					}

					if (columnsList[0] === "RequestDateField") {
						if (RequestDate === "") {
							if (fields.length > 1) {
								RequestDateCriteria = "=";
							} else {
								RequestDateCriteria = columnsList[1];
							}
							RequestDate = columnsList[2];
							RequestDate = new Date(RequestDate);
							RequestDate = $filter('date')(RequestDate, "dd/MM/yyyy");

							var RequestDateParam = {};
							RequestDateParam.fieldName = "RequestDateField";
							RequestDateParam.operatorName = RequestDateCriteria;
							RequestDateParam.fieldValue = RequestDate;
							RequestDateParam.fieldType = "date";
							OrderSearchParameterList.push(RequestDateParam);

						}
					}

					if (columnsList[0] === "ExpectedTimeOfDelivery") {
						if (PromisedDate === "") {
							PromisedDateCriteria = columnsList[1];
							PromisedDate = columnsList[2];
							PromisedDate = new Date(PromisedDate);
							PromisedDate = $filter('date')(PromisedDate, "dd/MM/yyyy");

							var PromisedDateParam = {};
							PromisedDateParam.fieldName = "ExpectedTimeOfDelivery";
							PromisedDateParam.operatorName = PromisedDateCriteria;
							PromisedDateParam.fieldValue = PromisedDate;
							PromisedDateParam.fieldType = "date";
							OrderSearchParameterList.push(PromisedDateParam);

						} else {
							PromisedEndDateCriteria = columnsList[1];
							PromisedEndDate = columnsList[2];
							PromisedEndDate = new Date(PromisedEndDate);
							PromisedEndDate = $filter('date')(PromisedEndDate, "dd/MM/yyyy");

							var PromisedEndDateParam = {};
							PromisedEndDateParam.fieldName = "ExpectedTimeOfDelivery";
							PromisedEndDateParam.operatorName = PromisedEndDateCriteria;
							PromisedEndDateParam.fieldValue = PromisedEndDate;
							PromisedEndDateParam.fieldType = "date";
							OrderSearchParameterList.push(PromisedEndDateParam);

						}
					}

					if (columnsList[0] === "SalesOrderNumber") {
						SalesOrderNumberCriteria = columnsList[1];
						SalesOrderNumber = columnsList[2];

						var SalesOrderNumberParam = {};
						SalesOrderNumberParam.fieldName = "SalesOrderNumber";
						SalesOrderNumberParam.operatorName = SalesOrderNumberCriteria;
						SalesOrderNumberParam.fieldValue = SalesOrderNumber;
						SalesOrderNumberParam.fieldType = "string";
						OrderSearchParameterList.push(SalesOrderNumberParam);

					}

					if (columnsList[0] === "CarrierName") {
						SalesOrderNumberCriteria = columnsList[1];
						SalesOrderNumber = columnsList[2];

						var SalesOrderNumberParam = {};
						SalesOrderNumberParam.fieldName = "CarrierName";
						SalesOrderNumberParam.operatorName = SalesOrderNumberCriteria;
						SalesOrderNumberParam.fieldValue = SalesOrderNumber;
						SalesOrderNumberParam.fieldType = "string";
						OrderSearchParameterList.push(SalesOrderNumberParam);

					}

					


					if (columnsList[0] === "EnquiryAutoNumber") {
						EnquiryAutoNumberCriteria = columnsList[1];
						EnquiryAutoNumber = columnsList[2];

						var EnquiryAutoNumberParam = {};
						EnquiryAutoNumberParam.fieldName = "EnquiryAutoNumber";
						EnquiryAutoNumberParam.operatorName = EnquiryAutoNumberCriteria;
						EnquiryAutoNumberParam.fieldValue = EnquiryAutoNumber;
						EnquiryAutoNumberParam.fieldType = "string";
						OrderSearchParameterList.push(EnquiryAutoNumberParam);

					}

					if (columnsList[0] === "SupplierName") {
						SupplierNameCriteria = columnsList[1];
						SupplierName = columnsList[2];

						var SupplierNameParam = {};
						SupplierNameParam.fieldName = "SupplierName";
						SupplierNameParam.operatorName = SupplierNameCriteria;
						SupplierNameParam.fieldValue = SupplierName;
						SupplierNameParam.fieldType = "string";
						OrderSearchParameterList.push(SupplierNameParam);

					}

					if (columnsList[0] === "Area") {
						AreaCriteria = columnsList[1];
						Area = columnsList[2];

						var PlateNumberDataParam = {};
						PlateNumberDataParam.fieldName = "Area";
						PlateNumberDataParam.operatorName = AreaCriteria;
						PlateNumberDataParam.fieldValue = Area;
						PlateNumberDataParam.fieldType = "string";
						OrderSearchParameterList.push(PlateNumberDataParam);
					}

					if (columnsList[0] === "PlateNumberData") {
						PlateNumberDataCriteria = columnsList[1];
						PlateNumberData = columnsList[2];

						var PlateNumberDataParam = {};
						PlateNumberDataParam.fieldName = "PlateNumberData";
						PlateNumberDataParam.operatorName = PlateNumberDataCriteria;
						PlateNumberDataParam.fieldValue = PlateNumberData;
						PlateNumberDataParam.fieldType = "string";
						OrderSearchParameterList.push(PlateNumberDataParam);

					}

					if (columnsList[0] === "ApprovedBy") {
						ApprovedByCriteria = columnsList[1];
						ApprovedBy = columnsList[2];

						var ApprovedByParam = {};
						ApprovedByParam.fieldName = "ApprovedBy";
						ApprovedByParam.operatorName = ApprovedByCriteria;
						ApprovedByParam.fieldValue = ApprovedBy;
						ApprovedByParam.fieldType = "string";
						OrderSearchParameterList.push(ApprovedByParam);

					}

					if (columnsList[0] === "ReceivedCapacityPalettes") {
						ReceivedCapacityPalettesCriteria = columnsList[1];
						ReceivedCapacityPalettes = columnsList[2];
					}


					if (columnsList[0] === "AssociatedOrder") {
						GratisCriteria = columnsList[1];
						Gratis = columnsList[2];

						var AssociatedOrderParam = {};
						AssociatedOrderParam.fieldName = "AssociatedOrder";
						AssociatedOrderParam.operatorName = GratisCriteria;
						AssociatedOrderParam.fieldValue = Gratis;
						AssociatedOrderParam.fieldType = "string";
						OrderSearchParameterList.push(AssociatedOrderParam);

					}

					if (columnsList[0] === "CompanyName") {
						CompanyNameValueCriteria = columnsList[1];
						CompanyNameValue = columnsList[2];

						var CompanyNameParam = {};
						CompanyNameParam.fieldName = "CompanyName";
						CompanyNameParam.operatorName = CompanyNameValueCriteria;
						CompanyNameParam.fieldValue = CompanyNameValue;
						CompanyNameParam.fieldType = "string";
						OrderSearchParameterList.push(CompanyNameParam);

					}

					if (columnsList[0] === "ShortCompanyName") {
						ShortCompanyNameCriteria = columnsList[1];
						ShortCompanyName = columnsList[2];

						var ShortCompanyNameParam = {};
						ShortCompanyNameParam.fieldName = "ShortCompanyName";
						ShortCompanyNameParam.operatorName = ShortCompanyNameCriteria;
						ShortCompanyNameParam.fieldValue = ShortCompanyName;
						ShortCompanyNameParam.fieldType = "string";
						OrderSearchParameterList.push(ShortCompanyNameParam);

					}

					if (columnsList[0] === "OrderNumber") {
						OrderNumberCriteria = columnsList[1];
						OrderNumber = columnsList[2];

						var OrderNumberParam = {};
						OrderNumberParam.fieldName = "o.OrderNumber";
						OrderNumberParam.operatorName = OrderNumberCriteria;
						OrderNumberParam.fieldValue = OrderNumber;
						OrderNumberParam.fieldType = "string";
						OrderSearchParameterList.push(OrderNumberParam);

					}

					if (columnsList[0] === "DeliveryLocationName") {
						DeliveryLocationNameCriteria = columnsList[1];
						DeliveryLocationName = columnsList[2];

						var DeliveryLocationNameParam = {};
						DeliveryLocationNameParam.fieldName = "DeliveryLocationName";
						DeliveryLocationNameParam.operatorName = DeliveryLocationNameCriteria;
						DeliveryLocationNameParam.fieldValue = DeliveryLocationName;
						DeliveryLocationNameParam.fieldType = "string";
						OrderSearchParameterList.push(DeliveryLocationNameParam);

					}

					if (columnsList[0] === "ShipToCode") {
						DeliveryLocationCriteria = columnsList[1];
						DeliveryLocation = columnsList[2];

						var DeliveryLocationParam = {};
						DeliveryLocationParam.fieldName = "ShipToCode";
						DeliveryLocationParam.operatorName = DeliveryLocationCriteria;
						DeliveryLocationParam.fieldValue = DeliveryLocation;
						DeliveryLocationParam.fieldType = "string";
						OrderSearchParameterList.push(DeliveryLocationParam);

					}

					if (columnsList[0] === "BranchPlant") {
						BranchPlantCriteria = columnsList[1];
						BranchPlant = columnsList[2];

						var BranchPlantParam = {};
						BranchPlantParam.fieldName = "BranchPlant";
						BranchPlantParam.operatorName = BranchPlantCriteria;
						BranchPlantParam.fieldValue = BranchPlant;
						BranchPlantParam.fieldType = "string";
						OrderSearchParameterList.push(BranchPlantParam);

					}

					if (columnsList[0] === "BranchPlantName") {
						BranchPlantNameCriteria = columnsList[1];
						BranchPlantName = columnsList[2];

						var BranchPlantNameParam = {};
						BranchPlantNameParam.fieldName = "BranchPlantName";
						BranchPlantNameParam.operatorName = BranchPlantNameCriteria;
						BranchPlantNameParam.fieldValue = BranchPlantName;
						BranchPlantNameParam.fieldType = "string";
						OrderSearchParameterList.push(BranchPlantNameParam);

					}

					if (columnsList[0] === "BranchPlantCode") {
						BranchPlantCodeCriteria = columnsList[1];
						BranchPlantCode = columnsList[2];

						var BranchPlantCodeParam = {};
						BranchPlantCodeParam.fieldName = "BranchPlantCode";
						BranchPlantCodeParam.operatorName = BranchPlantCodeCriteria;
						BranchPlantCodeParam.fieldValue = BranchPlantCode;
						BranchPlantCodeParam.fieldType = "string";
						OrderSearchParameterList.push(BranchPlantCodeParam);

					}


					if (columnsList[0] === "TotalPriceWithCurrency") {
						if (TotalPrice === "") {
							if (fields.length > 1) {
								TotalPriceCriteria = "=";
							} else {
								TotalPriceCriteria = columnsList[1];
							}
							TotalPriceCriteria = columnsList[1];
							TotalPrice = columnsList[2];
						}

						var TotalPriceParam = {};
						TotalPriceParam.fieldName = "TotalPriceWithCurrency";
						TotalPriceParam.operatorName = TotalPriceCriteria;
						TotalPriceParam.fieldValue = TotalPrice;
						TotalPriceParam.fieldType = "string";
						OrderSearchParameterList.push(TotalPriceParam);

					}

					if (columnsList[0] === "IsAvailableStock") {
						AvailableStockCriteria = columnsList[1];
						if (columnsList[2] === 'Ok') {
							AvailableStock = '1';
						}
						else if (columnsList[2] === 'Not Ok') {
							AvailableStock = '0';
						}
					}

					if (columnsList[0] === "IsAvailableCredit") {
						AvailableCreditCriteria = columnsList[1];
						if (columnsList[2] === 'Ok') {
							AvailableCredit = '1';
						}
						else if (columnsList[2] === 'Not Ok') {
							AvailableCredit = '0';
						}
					}

					if (columnsList[0] === "ReceivedCapacityPalettesCheck") {
						ReceivedCapacityPalatesCriteria = columnsList[1];
						if (columnsList[2] === 'Ok') {
							ReceivedCapacityPalates = '1';
						}
						else if (columnsList[2] === 'Not Ok') {
							ReceivedCapacityPalates = '0';
						}
					}

					if (columnsList[0] === "Empties") {
						EmptiesCriteria = columnsList[1];
						if (columnsList[2] === 'Ok') {
							Empties = 'C';
						}
						else if (columnsList[2] === 'Not Ok') {
							Empties = 'W';
						}
					}

					if (columnsList[0] === "Status") {
						StatusCriteria = columnsList[1];
						Status = columnsList[2];

						var status1Param = {};
						status1Param.fieldName = "Status";
						status1Param.operatorName = StatusCriteria;
						status1Param.fieldValue = Status;
						status1Param.fieldType = "string";
						OrderSearchParameterList.push(status1Param);

					}

					if (columnsList[0] === "TruckSize") {
						TruckSizeCriteria = columnsList[1];
						TruckSize = columnsList[2];

						var TruckSizeParam = {};
						TruckSizeParam.fieldName = "TruckSize";
						TruckSizeParam.operatorName = TruckSizeCriteria;
						TruckSizeParam.fieldValue = TruckSize;
						TruckSizeParam.fieldType = "string";
						OrderSearchParameterList.push(TruckSizeParam);

					}

					if (columnsList[0] === "PurchaseOrderNumber") {
						PurchaseOrderNumberCriteria = columnsList[1];
						PurchaseOrderNumber = columnsList[2];

						var PurchaseOrderNumberParam = {};
						PurchaseOrderNumberParam.fieldName = "PurchaseOrderNumber";
						PurchaseOrderNumberParam.operatorName = PurchaseOrderNumberCriteria;
						PurchaseOrderNumberParam.fieldValue = PurchaseOrderNumber;
						PurchaseOrderNumberParam.fieldType = "string";
						OrderSearchParameterList.push(PurchaseOrderNumberParam);

					}

					if (columnsList[0] === "CarrierNumberValue") {
						CarrierNumberValueCriteria = columnsList[1];
						CarrierNumberValue = columnsList[2];

						var CarrierNumberValueParam = {};
						CarrierNumberValueParam.fieldName = "CarrierNumberValue";
						CarrierNumberValueParam.operatorName = CarrierNumberValueCriteria;
						CarrierNumberValueParam.fieldValue = CarrierNumberValue;
						CarrierNumberValueParam.fieldType = "string";
						OrderSearchParameterList.push(CarrierNumberValueParam);

					}

					if (columnsList[0] === "TripCost") {
						TripCostCriteria = columnsList[1];
						TripCost = columnsList[2];

						var TripCostParam = {};
						TripCostParam.fieldName = "TripCost";
						TripCostParam.operatorName = TripCostCriteria;
						TripCostParam.fieldValue = TripCost;
						TripCostParam.fieldType = "string";
						OrderSearchParameterList.push(TripCostParam);

					}

					if (columnsList[0] === "TripRevenue") {
						TripRevenueCriteria = columnsList[1];
						TripRevenue = columnsList[2];

						var TripRevenueParam = {};
						TripRevenueParam.fieldName = "TripRevenue";
						TripRevenueParam.operatorName = TripRevenueCriteria;
						TripRevenueParam.fieldValue = TripRevenue;
						TripRevenueParam.fieldType = "string";
						OrderSearchParameterList.push(TripRevenueParam);

					}

					if (columnsList[0] === "EnquiryAutoNumber") {
						EnquiryAutoNumberCriteria = columnsList[1];
						EnquiryAutoNumber = columnsList[2];
					}

					if (columnsList[0] === "DriverName") {
						DriverNameCriteria = columnsList[1];
						DriverName = columnsList[2];

						var DriverNameParam = {};
						DriverNameParam.fieldName = "DriverName";
						DriverNameParam.operatorName = DriverNameCriteria;
						DriverNameParam.fieldValue = DriverName;
						DriverNameParam.fieldType = "string";
						OrderSearchParameterList.push(DriverNameParam);

					}

					if (columnsList[0] === "PlateNumber") {
						PlateNumberCriteria = columnsList[1];
						PlateNumber = columnsList[2];

						var PlateNumberParam = {};
						PlateNumberParam.fieldName = "PlateNumber";
						PlateNumberParam.operatorName = PlateNumberCriteria;
						PlateNumberParam.fieldValue = PlateNumber;
						PlateNumberParam.fieldType = "string";
						OrderSearchParameterList.push(PlateNumberParam);

					}

					if (columnsList[0] === "Shift") {
						ShiftCriteria = columnsList[1];
						Shift = columnsList[2];

						var ShiftParam = {};
						ShiftParam.fieldName = "Shift";
						ShiftParam.operatorName = ShiftCriteria;
						ShiftParam.fieldValue = Shift;
						ShiftParam.fieldType = "string";
						OrderSearchParameterList.push(ShiftParam);

					}

					if (columnsList[0] === "UserName") {
						UserNameCriteria = columnsList[1];
						UserName = columnsList[2];

						var UserNameParam = {};
						UserNameParam.fieldName = "UserName";
						UserNameParam.operatorName = UserNameCriteria;
						UserNameParam.fieldValue = UserName;
						UserNameParam.fieldType = "string";
						OrderSearchParameterList.push(UserNameParam);

					}

					if (columnsList[0] === "LoadNumber") {
						LoadNumberCriteria = columnsList[1];
						LoadNumber = columnsList[2];

						var LoadNumberParam = {};
						LoadNumberParam.fieldName = "LoadNumber";
						LoadNumberParam.operatorName = LoadNumberCriteria;
						LoadNumberParam.fieldValue = LoadNumber;
						LoadNumberParam.fieldType = "string";
						OrderSearchParameterList.push(LoadNumberParam);

					}

				}


			}
		}

		var OrderBy = "";
		var OrderByCriteria = "";
		if (loadOptions.sort !== null && loadOptions.sort !== undefined) {
			if (loadOptions.sort[0].desc === true) {
				OrderByCriteria = "desc";
			} else {
				OrderByCriteria = "asc";
			}
			if (loadOptions.sort[0].selector === "RequestDateField") {
				OrderBy = "RequestDate";
			} else if (loadOptions.sort[0].selector === "PromisedDateField") {
				OrderBy = "PromisedDate";
			} else if (loadOptions.sort[0].selector === "BranchPlant") {
				OrderBy = "StockLocationId"
			}
			else {
				OrderBy = loadOptions.sort[0].selector;
			}
		}

		if ($scope.ProductCodes !== "" && $scope.ProductCodes !== null && $scope.ProductCodes !== undefined) {

			var ProductCodesParam = {};
			ProductCodesParam.fieldName = "ProductCodes";
			ProductCodesParam.operatorName = $scope.ProductSearchCriteria;
			ProductCodesParam.fieldValue = $scope.ProductCodes;
			ProductCodesParam.fieldType = "string";
			OrderSearchParameterList.push(ProductCodesParam);

		}


		if ($scope.Areas !== "" && $scope.Areas !== null && $scope.Areas !== undefined) {
			var AreaParam = {};
			AreaParam.fieldName = "Area";
			AreaParam.operatorName = $scope.AreasSearchCriteria;
			AreaParam.fieldValue = $scope.Areas;
			AreaParam.fieldType = "string";
			OrderSearchParameterList.push(AreaParam);
		}


		if ($scope.BranchPlantCodes !== "" && $scope.BranchPlantCodes !== null && $scope.BranchPlantCodes !== undefined) {
			var AreaParam = {};
			AreaParam.fieldName = "BranchPlantCode";
			AreaParam.operatorName = $scope.BranchPlantCodesSearchCriteria;
			AreaParam.fieldValue = $scope.BranchPlantCodes;
			AreaParam.fieldType = "string";
			OrderSearchParameterList.push(AreaParam);
		}


		if ($scope.CarrierCodes !== "" && $scope.CarrierCodes !== null && $scope.CarrierCodes !== undefined) {
			var AreaParam = {};
			AreaParam.fieldName = "CarrierCode";
			AreaParam.operatorName = $scope.CarrierCodesSearchCriteria;
			AreaParam.fieldValue = $scope.CarrierCodes;
			AreaParam.fieldType = "string";
			OrderSearchParameterList.push(AreaParam);
		}

		if ($scope.TruckSizes !== "" && $scope.TruckSizes !== null && $scope.TruckSizes !== undefined) {
			var AreaParam = {};
			AreaParam.fieldName = "TruckSize";
			AreaParam.operatorName = $scope.TruckSizesSearchCriteria;
			AreaParam.fieldValue = $scope.TruckSizes;
			AreaParam.fieldType = "string";
			OrderSearchParameterList.push(AreaParam);
		}


		var index = parseFloat(parseFloat(parameters.skip) / parseFloat(parameters.take));


		var requestData =
		{
			ServicesAction: 'LoadOrderGrid',
			PageIndex: parameters.skip,
			PageSize: index,
			OrderBy: OrderBy,
			OrderByCriteria: OrderByCriteria,
			PurchaseOrderNumberCriteria: PurchaseOrderNumberCriteria,
			PurchaseOrderNumber: PurchaseOrderNumber,
			PlateNumberCriteria: PlateNumberCriteria,
			PlateNumber: PlateNumber,
			DriverName: DriverName,
			DriverNameCriteria: DriverNameCriteria,
			TripCostCriteria: TripCostCriteria,
			TripCost: TripCost,
			ApprovedByCriteria: ApprovedByCriteria,
			ApprovedBy: ApprovedBy,
			TripRevenueCriteria: TripRevenueCriteria,
			SalesOrderNumberCriteria: SalesOrderNumberCriteria,
			SalesOrderNumber: SalesOrderNumber,
			TripRevenue: TripRevenue,
			CarrierNumberValueCriteria: CarrierNumberValueCriteria,
			CarrierNumberValue: CarrierNumberValue,
			EnquiryAutoNumber: EnquiryAutoNumber,
			EnquiryAutoNumberCriteria: EnquiryAutoNumberCriteria,
			SupplierName: SupplierName,
			SupplierNameCriteria: SupplierNameCriteria,
			OrderNumberCriteria: OrderNumberCriteria,
			OrderNumber: OrderNumber,
			BranchPlantName: BranchPlantName,
			BranchPlantNameCriteria: BranchPlantNameCriteria,


			BranchPlantCode: BranchPlantCode,
			BranchPlantCodeCriteria: BranchPlantCodeCriteria,

			ReceivedCapacityPalettesCriteria: ReceivedCapacityPalettesCriteria,
			ReceivedCapacityPalettes: ReceivedCapacityPalettes,

			OrderDate: OrderDate,
			OrderDateCriteria: OrderDateCriteria,
			OrderEndDate: OrderEndDate,
			OrderEndDateCriteria: OrderEndDateCriteria,

			PickupDateDate: PickupDateDate,
			PickupDateCriteria: PickupDateCriteria,
			PickupDateEndDate: PickupDateEndDate,
			PickupDateEndDateCriteria: PickupDateEndDateCriteria,


			CompanyNameValue: CompanyNameValue,
			CompanyNameValueCriteria: CompanyNameValueCriteria,

			ShortCompanyName: ShortCompanyName,
			ShortCompanyNameCriteria: ShortCompanyNameCriteria,
			DeliveryLocationNameCriteria: DeliveryLocationNameCriteria,
			DeliveryLocationName: DeliveryLocationName,
			SoldToCode: SoldToCode,
			SoldToCodeCriteria: SoldToCodeCriteria,
			BranchPlant: BranchPlant,
			BranchPlantCriteria: BranchPlantCriteria,
			Area: Area,
			AreaCriteria: AreaCriteria,
			DeliveryLocation: DeliveryLocation,
			DeliveryLocationCriteria: DeliveryLocationCriteria,
			Gratis: Gratis,
			GratisCriteria: GratisCriteria,
			EnquiryDate: EnquiryDate,
			EnquiryDateCriteria: EnquiryDateCriteria,
			EnquiryEndDate: EnquiryEndDate,
			EnquiryEndDateCriteria: EnquiryEndDateCriteria,

			RequestCollectionDate: RequestCollectionDate,
			RequestCollectionDateCriteria: RequestCollectionDateCriteria,

			RequestDate: RequestDate,
			RequestDateCriteria: RequestDateCriteria,



			PromisedDate: PromisedDate,
			PromisedDateCriteria: PromisedDateCriteria,
			PromisedEndDate: PromisedEndDate,
			PromisedEndDateCriteria: PromisedEndDateCriteria,

			Status: Status,
			StatusCriteria: StatusCriteria,
			TotalPriceCriteria: TotalPriceCriteria,
			TotalPrice: TotalPrice,
			Empties: Empties,
			EmptiesCriteria: EmptiesCriteria,
			IsAvailableStock: AvailableStock,
			AvailableStockCriteria: AvailableStockCriteria,
			AvailableCredit: AvailableCredit,
			AvailableCreditCriteria: AvailableCreditCriteria,
			ReceivedCapacityPalates: ReceivedCapacityPalates,
			ReceivedCapacityPalatesCriteria: ReceivedCapacityPalatesCriteria,
			TruckSize: TruckSize,
			TruckSizeCriteria: TruckSizeCriteria,
			CurrentState: '',
			IsExportToExcel: '0',
			RoleMasterId: $rootScope.RoleId,
			UserId: $rootScope.UserId,
			LoginId: $rootScope.UserId,
			CultureId: $rootScope.CultureId,

			ProductCode: $scope.ProductCodes,
			ProductSearchCriteria: $scope.ProductSearchCriteria,

			CollectedDate: CollectedDate,
			CollectedDateCriteria: CollectedDateCriteria,

			DeliveredCriteria: DeliveredCriteria,
			DeliveredDate: DeliveredDate,

			PlanCollectionDate: PlanCollectionDate,
			PlanCollectionDateCriteria: PlanCollectionDateCriteria,
			PlanCollectionEndDate: PlanCollectionEndDate,
			PlanCollectionEndDateCriteria: PlanCollectionEndDateCriteria,

			PlanDeliveryDateCriteria: PlanDeliveryDateCriteria,
			PlanDeliveryDate: PlanDeliveryDate,
			PlanDeliveryEndDateCriteria: PlanDeliveryEndDateCriteria,
			PlanDeliveryEndDate: PlanDeliveryEndDate,

			PlateNumberDataCriteria: PlateNumberDataCriteria,
			PlateNumberData: PlateNumberData,

			OrderAttentionNeededFilter: $rootScope.AttentionNeeded,

			PageName: page,
			PageControlName: PageControlName,

			Shift: Shift,
			ShiftCriteria: ShiftCriteria,

			LoadNumber: LoadNumber,
			LoadNumberCriteria: LoadNumberCriteria,

			UserName: UserName,
			UserNameCriteria: UserNameCriteria
		};

		$scope.RequestDataFilter = requestData;

		var consolidateApiParamater =
		{
			Json: requestData,
		};

		var orderSearchDTO = {
			"RoleId": parseInt($rootScope.RoleId),
			"CultureId": parseInt($rootScope.CultureId),
			"PageIndex": parseInt(index),
			"PageSize": parseInt(parameters.take),
			"PageName": page,
			"PageControlName": PageControlName,
			"LoginId": parseInt($rootScope.UserId),
			"OrderSearchParameterList": OrderSearchParameterList,
			"whereClause": "",
			"UserPersonaMasterId": $rootScope.UserPersonaJson.SelectedUserPersonaMasterId // TODO: 14 July 2020
		};

		return orderSearchDTO;

	};

	//#endregion

	//#region Load Enquiry Product Information By Enquiry Id
	$scope.LoadOrderProductByOrderId = function (Id, e) {
		debugger;
		$rootScope.Throbber.Visible = true;
		var requestData =
		{
			ServicesAction: 'LoadOrderByOrderId',
			OrderId: Id,
			RoleId: $rootScope.RoleId,
			CultureId: $rootScope.CultureId
		};
		var consolidateApiParamater =
		{
			Json: requestData,
		};

		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


			$scope.EnquiryTotalAmount = 0;
			$scope.EnquiryCashDiscount = 0;
			$scope.EnquiryTotalTax = 0;
			$scope.EnquiryNetAmount = 0;
			$scope.EnquiryGrandTotalAmount = 0;
			$scope.EnquiryDepositeAmount = 0;
			$scope.bindallproduct = [];

			if (response.data !== undefined) {
				$scope.IsEnquiryEdit = false;
				$scope.EnableAddItem = false;
				$scope.ClearItemData();
				$scope.CreditLimit = response.data.Json.OrderList.CreditLimit;
				$scope.AvailableCreditLimit = response.data.Json.OrderList.AvailableCreditLimit;

				var totalEnquiryAmount = parseFloat(response.data.Json.OrderList.TotalEnquiryCreated) + ((parseFloat(response.data.Json.OrderList.TotalEnquiryCreated) * parseFloat($scope.ItemTaxInPec)) / 100);
				$scope.AvailableCreditLimit = Number($scope.AvailableCreditLimit) - Number(totalEnquiryAmount);
				$scope.AvailableCreditLimit = Number($scope.AvailableCreditLimit) - Number(response.data.Json.OrderList.EnquiryTotalDepositAmount);

				$scope.SelectedSalesOrderNumber = response.data.Json.OrderList.SalesOrderNumber;
				$rootScope.SoldToCompanyId = response.data.Json.OrderList.SoldTo;
				$rootScope.BranchPlantCodeEdit = response.data.Json.OrderList.StockLocationId;
				$rootScope.CompanyMnemonic = response.data.Json.OrderList.CompanyMnemonic;
				$rootScope.DiscountAmount = response.data.Json.OrderList.DiscountAmount;
				$rootScope.DeliveryLocationId = response.data.Json.OrderList.ShipTo;
				$rootScope.DeliveryLocationCode = response.data.Json.OrderList.LocationCode;
				$rootScope.DeliveryArea = response.data.Json.OrderList.Area;
				$rootScope.TruckSizeId = response.data.Json.OrderList.TruckSizeId;
				$rootScope.TruckSize = response.data.Json.OrderList.TruckSize;
				$rootScope.TruckCapacity = (parseFloat(response.data.Json.OrderList.TruckCapacityWeight) * 1000);
				$rootScope.TruckCapacityInTone = $rootScope.TruckCapacity / 1000;
				$rootScope.TruckCapacityFullInTone = 0;
				$rootScope.TruckCapacityFullInPercentage = 0;

				$scope.PalettesCorrectWeight = response.data.Json.OrderList.PalettesCorrectWeight;

				if (response.data.Json.OrderList.IsSelfCollect !== undefined) {
					if (response.data.Json.OrderList.IsSelfCollect === "SCO") {
						$rootScope.IsSelfCollect = true;
					} else {
						$rootScope.IsSelfCollect = false;
					}
				}
				else {
					$rootScope.IsSelfCollect = false;
				}

				var requestforForPalletConsumptionAndValidation =
				{
					ServicesAction: 'GetRuleForPalletConsumptionAndValidation',
					CustomerId: response.data.Json.OrderList.SoldTo,
					DeliveryLocationId: response.data.Json.OrderList.ShipTo,
					TruckSizeId: response.data.Json.OrderList.TruckSizeId,

				};


				var jsonobjectForForPalletConsumptionAndValidation = {};
				jsonobjectForForPalletConsumptionAndValidation.Json = requestforForPalletConsumptionAndValidation;
				var responseForForPalletConsumptionAndValidation = GrRequestService.ProcessRequest(jsonobjectForForPalletConsumptionAndValidation);

				$q.all([
					responseForForPalletConsumptionAndValidation
				]).then(function (resp) {

					debugger;

					$scope.IsPalletSpaceLoadCheckVisibility = "1";
					$scope.IsWeightLoadCheckVisibility = "1";
					$scope.IsPalletLoadCheckValidation = true;
					$scope.IsWeightLoadCheckValidation = true;


					var responseFoLoadRuleForPalletConsumptionAndValidation = resp[0];


					if (responseFoLoadRuleForPalletConsumptionAndValidation !== undefined) {
						if (responseFoLoadRuleForPalletConsumptionAndValidation.data !== undefined) {

							$scope.IsPalletSpaceLoadCheckVisibility = responseFoLoadRuleForPalletConsumptionAndValidation.data.Json.IsPalletSpaceLoadCheckVisibility;
							$scope.IsWeightLoadCheckVisibility = responseFoLoadRuleForPalletConsumptionAndValidation.data.Json.IsWeightLoadCheckVisibility;
							$scope.IsPalletLoadCheckValidation = responseFoLoadRuleForPalletConsumptionAndValidation.data.Json.IsPalletLoadCheckValidation;
							$scope.IsWeightLoadCheckValidation = responseFoLoadRuleForPalletConsumptionAndValidation.data.Json.IsWeightLoadCheckValidation;

						}
					}

				});



				$scope.CurrentOrderGuid = generateGUID();

				$scope.OrderProductList = [];
				if (response.data.Json.OrderList.OrderProductsList !== undefined) {
					$scope.OrderProductList = response.data.Json.OrderList.OrderProductsList;

					for (var i = 0; i < $scope.OrderProductList.length; i++) {
						$scope.OrderProductList[i].ProductQuantity = parseInt($scope.OrderProductList[i].ProductQuantity);
						$scope.OrderProductList[i].PreviousProductQuantity = parseInt($scope.OrderProductList[i].ProductQuantity);
						$scope.OrderProductList[i].EnquiryProductGUID = generateGUID();
						$scope.OrderProductList[i].OrderGUID = $scope.CurrentOrderGuid;
						$scope.OrderProductList[i].CurrentStockPosition = parseFloat($scope.OrderProductList[i].CurrentStockPosition);
						var remainingProductStock = parseFloat(parseFloat($scope.OrderProductList[i].CurrentStockPosition) - parseFloat($scope.OrderProductList[i].UsedQuantityInOrder));
						if (parseFloat($scope.OrderProductList[i].ProductQuantity) < remainingProductStock) {
							$scope.OrderProductList[i].IsItemAvailableInStock = true;
						} else {
							$scope.OrderProductList[i].IsItemAvailableInStock = false;
						}
					}

					$scope.EnquiryUnavailableStockProductList = $scope.OrderProductList.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode });

					//$scope.LoadEnquiryAmountDetails($scope.OrderProductList);

				}

				$scope.OrderData = [];
				$scope.EditEnquiryId = response.data.Json.OrderList.OrderId;
				$rootScope.EditedEnquiryId = response.data.Json.OrderList.OrderId;
				$rootScope.TruckCapacityPalettes = response.data.Json.OrderList.TruckCapacityPalettes;

				var orders = {
					OrderGUID: $scope.CurrentOrderGuid,
					OrderId: response.data.Json.OrderList.OrderId,
					TotalWeight: 0,
					TruckCapacity: response.data.Json.OrderList.TruckCapacityWeight,
					TruckPallets: 0,
					TotalProductPallets: 0,
					DiscountAmount: 0,
					NumberOfPalettes: response.data.Json.OrderList.NumberOfPalettes,
					PalletSpace: response.data.Json.OrderList.PalletSpace,
					TruckWeight: response.data.Json.OrderList.TruckWeight,
					SoldTo: response.data.Json.OrderList.CompanyId,
					TruckCapacityPalettes: response.data.Json.OrderList.TruckCapacityPalettes,
					TruckCapacityWeight: response.data.Json.OrderList.TruckCapacityWeight,
					Capacity: response.data.Json.OrderList.Capacity,
					IsRecievingLocationCapacityExceed: response.data.Json.OrderList.IsRecievingLocationCapacityExceed,
					ReceivedCapacityPalettesCheck: 0,
					ReceivedCapacityPalettes: 0,
					CustomerId: response.data.Json.OrderList.CompanyId,
					BranchPlantCode: response.data.Json.OrderList.StockLocationId,
					TruckCapacity: response.data.Json.OrderList.Capacity,
					CurrentState: response.data.Json.OrderList.CurrentState,
					NoOfDays: response.data.Json.OrderList.Field8,
					IsTruckFull: true,
					IsActive: true,
					TruckSizeId: response.data.Json.OrderList.TruckSizeId,
					OrderProductList: $scope.OrderProductList,
				};
				$scope.OrderData.push(orders);
				$scope.LoadTruckSizeInformation(e);

				$rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);
			} else {
				$rootScope.Throbber.Visible = false;
			}
		});
	}

	$scope.LoadCreditCheckByEnquiryId = function (Id, e) {
		var requestData =
		{
			ServicesAction: 'LoadCreditCheckByEnquiryId',
			EnquiryId: Id,
			RoleId: $rootScope.RoleId,
			CultureId: $rootScope.CultureId
		};
		var consolidateApiParamater =
		{
			Json: requestData,
		};

		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

			if (response.data !== undefined) {
				$scope.EnquiryCreditLimit = response.data.Json.EnquiryList.CreditLimit;
				$scope.EnquiryAvailableCreditLimit = response.data.Json.EnquiryList.AvailableCreditLimit;
				$scope.EnquiryCalculatedCreditLimit = response.data.Json.EnquiryList.CalculatedCredit;

				var outerContainerWidth = document.getElementById("OrderListGrid").clientWidth;
				outerContainerWidth = outerContainerWidth - 10;

				e.component.expandRow(e.data);
				$rootScope.PreviousExpandedRow = e.data;

				var elements = document.getElementsByClassName("EnquiryProductInfoClass");
				var elementId = "";
				for (var i = 0; i < elements.length; i++) {
					elementId = elements[i].id;
					elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
				}
			}
		});
	}
	//#endregion

	//#region Load Truck And Pallet Information By Rule
	$scope.LoadTruckSizeInformation = function (e) {
		var requestAreaData =
		{
			ServicesAction: 'GetRuleValue',
			CompanyId: $rootScope.SoldToCompanyId,
			CompanyMnemonic: $rootScope.CompanyMnemonic,
			DeliveryLocation: {
				LocationId: $rootScope.DeliveryLocationId,
				DeliveryLocationCode: $rootScope.DeliveryLocationCode,
				Area: $rootScope.DeliveryArea,
			},
			Company: {
				CompanyId: $rootScope.SoldToCompanyId,
				CompanyMnemonic: $rootScope.CompanyMnemonic,
			},
			RuleType: 5,
			TruckSize: {
				TruckSize: parseFloat($rootScope.TruckCapacityInTone)
			}
		};

		$scope.AreaPalettesCount = 0
		var jsonobjectArea = {};
		jsonobjectArea.Json = requestAreaData;
		GrRequestService.ProcessRequest(jsonobjectArea).then(function (arearesponse) {


			var arearesponseStr = arearesponse.data.Json;
			if (arearesponseStr.RuleValue != '' && arearesponseStr.RuleValue != undefined) {
				var rulevalue = parseInt(arearesponseStr.RuleValue);
				$scope.AreaPalettesCount = rulevalue;
			}
			if ($scope.AreaPalettesCount > 0) {
				$rootScope.TruckCapacityPalettes = $scope.AreaPalettesCount;
			}

			$rootScope.buindingPalettes = []
			for (var i = 0; i < $rootScope.TruckCapacityPalettes; i++) {
				var palettes = {
					PalettesWidth: 0
				}
				$rootScope.buindingPalettes.push(palettes);
			}

			if ($rootScope.buindingPalettes.length > 0) {
				$rootScope.IsPalettesRequired = true;
			} else {
				$rootScope.IsPalettesRequired = false;
			}

			var space = 100 - ($rootScope.buindingPalettes.length - 1);
			var width = space / $rootScope.buindingPalettes.length;
			$rootScope.PalettesWidth.width = width + "%";

			var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === $rootScope.EditedEnquiryId; });
			if (currentOrder.length > 0) {
				if (currentOrder[0].OrderProductList.length > 0) {
					currentOrder[0].TruckCapacity = $rootScope.TruckCapacityInTone;
					currentOrder[0].TruckSizeId = $rootScope.TruckSizeId;
					currentOrder[0].ShipTo = $rootScope.DeliveryLocationId;
					currentOrder[0].TruckName = $rootScope.TruckSize;
					currentOrder[0].DeliveryLocationName = $rootScope.DeliveryLocationName;

					var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
					var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');

					var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
					truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);

					$rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
					$rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);

					for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
						if (i < parseInt($rootScope.buindingPalettes.length)) {
							$rootScope.buindingPalettes[i].PalettesWidth = 100;
						}
					}

					var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
					var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

					//if ($rootScope.IsSelfCollect === false) {
					//    if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight) {
					//        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
					//        return false;

					//    } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < truckTotalPalettes) {
					//        var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
					//        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
					//        return false;
					//    }
					//}
				}
			}
			var totalWeightWithPalettes = 0;
			var totalWeightWithBuffer = 0;

			var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
			if (bufferWeight !== "") {
				totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
			}
			var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
			if ($rootScope.IsPalettesRequired) {
				if (weightPerPalettes !== "") {
					totalWeightWithPalettes = (weightPerPalettes * (truckTotalPalettes));
				}
			}
			$scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $rootScope.TruckCapacity, $rootScope.TruckCapacityPalettes, totalWeightWithPalettes);

			var outerContainerWidth = document.getElementById("OrderListGrid").clientWidth;
			outerContainerWidth = outerContainerWidth - 10;
			e.component.expandRow(e.data);
			$rootScope.PreviousExpandedRow = e.data;
			$scope.CurrentExpandedRow = e;
			$rootScope.Throbber.Visible = false;

			var elements = document.getElementsByClassName("EnquiryProductInfoClass");
			var elementId = "";
			for (var i = 0; i < elements.length; i++) {
				elementId = elements[i].id;
				elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
			}


			//var rowHeight = 35.2;
			//var scrolltotop = Math.ceil(rowHeight * parseFloat(e.rowIndex));
			//var scrollContainer = $("#OrderListGrid").find(".dx-scrollable").first().dxScrollable("instance");
			//scrollContainer.scrollTo({ top: scrolltotop });
		});
	}
	//#endregion

	//#region Load Enquiry Amount Information
	$scope.LoadEnquiryAmountDetails = function (enquiryProduct) {

		if (enquiryProduct.length > 0) {
			enquiryProduct = enquiryProduct.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode; });
			if (enquiryProduct.length > 0) {
				$scope.EnquiryTotalAmount = 0;
				$scope.EnquiryCashDiscount = 0;
				$scope.EnquiryTotalTax = 0;
				$scope.EnquiryNetAmount = 0;
				$scope.EnquiryGrandTotalAmount = 0;
				$scope.EnquiryDepositeAmount = 0;
				$scope.AvailableCreditLimitAmount = 0;

				$scope.GetTotalAmountOfOrder(enquiryProduct);
				$scope.GetCashDiscountOnProducts(enquiryProduct);
				$scope.GetTotalNetAmountOfEnquiry(enquiryProduct);
				$scope.GetTotalTaxOfEnquiry(enquiryProduct);
				$scope.LoadEnquiryTotalDepositeAmount(enquiryProduct);
				$scope.GetGrandTotalAmountOfEnquiry(enquiryProduct);

				$scope.AvailableCreditLimitAmount = Number($scope.AvailableCreditLimit) - Number($scope.EnquiryGrandTotalAmount);
			}
		}
	}
	//#endregion

	//#region Load Enquiry Deposite Amount

	$scope.LoadEnquiryTotalDepositeAmount = function (enquiryProductList) {

		for (var i = 0; i < enquiryProductList.length; i++) {
			$scope.EnquiryDepositeAmount = $scope.EnquiryDepositeAmount + parseFloat(enquiryProductList[i].ItemTotalDepositeAmount);
		}
		return $scope.EnquiryDepositeAmount;
	}

	//#endregion

	//#region Load Enquiry Total Amount

	$scope.GetTotalAmountOfOrder = function (enquiryProductList) {
		for (var i = 0; i < enquiryProductList.length; i++) {
			$scope.EnquiryTotalAmount = $scope.EnquiryTotalAmount + parseFloat(enquiryProductList[i].ItemPrices);
		}
		return $scope.EnquiryTotalAmount;
	}
	//#endregion

	//#region Load Enquiry Product Cash Discount

	$scope.GetCashDiscountOnProducts = function (enquiryProductList) {

		for (var i = 0; i < enquiryProductList.length; i++) {
			$scope.EnquiryCashDiscount = $scope.EnquiryCashDiscount + parseFloat(enquiryProductList[i].DiscountAmount);
		}
		return $scope.EnquiryCashDiscount;
	}
	//#endregion

	//#region Load Enquiry Total Tax

	$scope.GetTotalTaxOfEnquiry = function () {

		$scope.EnquiryTotalTax = percentage(parseFloat($scope.EnquiryNetAmount), $scope.ItemTaxInPec);
		return $scope.EnquiryTotalTax;
	}
	//#endregion

	//#region Load Enquiry Net Amount

	$scope.GetTotalNetAmountOfEnquiry = function () {

		$scope.EnquiryNetAmount = parseFloat($scope.EnquiryTotalAmount) - (parseFloat($scope.DiscountAmount) + parseFloat($scope.EnquiryCashDiscount));
		return $scope.EnquiryNetAmount;
	}
	//#endregion

	//#region Load Enquiry Grand Total Amount

	$scope.GetGrandTotalAmountOfEnquiry = function (enquiryProductList) {

		$scope.EnquiryGrandTotalAmount = parseFloat($scope.EnquiryNetAmount) + parseFloat($scope.EnquiryTotalTax) + parseFloat($scope.EnquiryDepositeAmount);

		return $scope.EnquiryGrandTotalAmount;
	}
	//#endregion

	//#region Approve Enquiry Event and Functions

	$scope.ApproveSelectedEnquiry = function () {

		if ($scope.SalesAdminApprovalList !== undefined) {
			var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== 999; });
			if (enquiryList.length > 0) {
				var enquiryAutoNumberList = "";
				for (var i = 0; i < enquiryList.length; i++) {

					enquiryAutoNumberList = enquiryAutoNumberList + "," + enquiryList[i].EnquiryAutoNumber;
					enquiryAutoNumberList = enquiryAutoNumberList.replace(/^,/, '');
				}
				$scope.ApproveEnquiry(enquiryAutoNumberList);
			} else {
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
			}
		}
	}

	$scope.ApproveEnquiry = function (enquiryAutoNumberList) {

		var settingValue = 0;
		if ($sessionStorage.AllSettingMasterData != undefined) {
			var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === "DefaultLeadTime"; });
			if (settingMaster.length > 0) {
				settingValue = settingMaster[0].SettingValue;
			}
		}



		var requestData =
		{
			ServicesAction: 'ApproveEnquiry',
			EnquiryAutoNumber: enquiryAutoNumberList,
			UserName: $rootScope.UserName,
			UserId: $rootScope.UserId,
			DefaultLeadTime: settingValue
		};

		//  var stringfyjson = JSON.stringify(requestData);
		var consolidateApiParamater =
		{
			Json: requestData,
		};
		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

			$scope.RefreshDataGrid();
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_AwaitingSONumber), '', 3000);
		});
	}

	$scope.ApproveEnquiryByEnquiryNumber = function (enquiryNumber) {

		$scope.ApproveEnquiry(enquiryNumber);
	}
	//#endregion

	//#region Reject Enquiry Event and Function

	$scope.RejectEnquiryByEnquiryNumber = function (enquiryNumber) {

		var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryAutoNumber === enquiryNumber; });
		if (enquiryList.length > 0) {
			var objectList = [];

			for (var i = 0; i < enquiryList.length; i++) {


				var object = {};
				object.ObjectId = enquiryList[i].OrderId;

				objectList.push(object);
			}

			var mainObject = {};
			mainObject.ObjectList = objectList;
			mainObject.ObjectType = "Enquiry";
			mainObject.ReasonCodeEventName = "RejectEnquiry";
			mainObject.FunctionName = "RejectEnquiry";
			mainObject.FunctionParameter = enquiryList;

			$rootScope.OpenReasoncodepopup(mainObject);
		}
	}




	$scope.RejectSelectedOrder = function () {
		debugger;
		if ($scope.SalesAdminApprovalList !== undefined) {
			var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== 999; });
			if (enquiryList.length > 0) {

				var objectList = [];

				for (var i = 0; i < enquiryList.length; i++) {


					var object = {};
					object.OrderId = enquiryList[i].OrderId;
					object.OrderNumber = enquiryList[i].OrderNumber;
					objectList.push(object);
				}

				var mainObject = {};
				mainObject.ObjectList = objectList;
				mainObject.ObjectType = "Order";
				mainObject.ReasonCodeEventName = "RejectOrder";
				mainObject.FunctionName = "RejectOrder";
				mainObject.FunctionParameter = enquiryList;
				$rootScope.LoadReasonCode("ReasonCode");
				$rootScope.OpenReasoncodepopup(mainObject);
			} else {
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
			}
		}
	}


	$scope.RejectSelectedEnquiry = function () {

		if ($scope.SalesAdminApprovalList !== undefined) {
			var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== 999; });
			if (enquiryList.length > 0) {
				//for (var i = 0; i < enquiryList.length; i++) {
				//    
				//    $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId + "," + enquiryList[i].EnquiryId;
				//    $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId.replace(/^,/, '');
				//}

				var objectList = [];

				for (var i = 0; i < enquiryList.length; i++) {


					var object = {};
					object.ObjectId = enquiryList[i].OrderId;

					objectList.push(object);
				}

				var mainObject = {};
				mainObject.ObjectList = objectList;
				mainObject.ObjectType = "Enquiry";
				mainObject.ReasonCodeEventName = "RejectEnquiry";
				mainObject.FunctionName = "RejectEnquiry";
				mainObject.FunctionParameter = enquiryList;
				$rootScope.LoadReasonCode("ReasonCode");
				$rootScope.OpenReasoncodepopup(mainObject);

				// $rootScope.OpenReasoncodepopup(enquiryList, "RejectEnquiry");
			} else {
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
			}
		}
	}



	$scope.CancelSelectedOrder = function () {

		if ($scope.SalesAdminApprovalList !== undefined) {
			var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== 999; });
			if (enquiryList.length > 0) {
				var objectList = [];

				var workFlowCode = "";

				for (var i = 0; i < enquiryList.length; i++) {

					var object = {};
					object.ObjectId = enquiryList[i].OrderId;
					object.UserId = $rootScope.UserId;
					objectList.push(object);

					workFlowCode = enquiryList[i].WorkFlowCode;

				}

				var mainObject = {};
				mainObject.ObjectList = objectList;
				mainObject.ObjectType = "Order";
				mainObject.ReasonCodeEventName = "CancelOrder";
				mainObject.FunctionName = "CancelOrder";
				mainObject.ReasonCategory = "CancelOrder";
				$rootScope.Action = "Clear";
				mainObject.FunctionParameter = enquiryList;
				if (workFlowCode === "B2BAPPFlow") {
					$rootScope.LoadReasonCode("CancelOrderBySeller");
				} else {
					$rootScope.LoadReasonCode("OrderCancelReason");
				}
				$rootScope.OpenReasoncodepopup(mainObject);

				// $rootScope.OpenReasoncodepopup(enquiryList, "RejectEnquiry");
			} else {
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_SelectOrderCancelReson), 'error', 3000);
			}
		}
	}





	$scope.MarkedShipedOrder = function () {
		debugger;
		$scope.orgEnquiryData = {};
		if ($scope.SalesAdminApprovalList !== undefined) {
			var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
			if (enquiryList.length > 0) {
				$rootScope.Throbber.Visible = true;
				$scope.orgEnquiryData.MarkOrderAsShipped = true;

				var objectList = [];
				for (var i = 0; i < enquiryList.length; i++) {

					var object = {};
					object.OrderId = enquiryList[i].OrderId;
					object.CurrentState = 9056;
					object.MarkOrderAsShipped = true;
					object.LoginId = parseInt($rootScope.UserId);
					object.OrderNumber = enquiryList[i].OrderNumber;
					objectList.push(object);
				}

				$scope.orgEnquiryData.OrderList = objectList;
				var orderDTO = $scope.orgEnquiryData;
				ManageOrderService.MarkOrderAsShipped(orderDTO).then(function (response) {
					$rootScope.Throbber.Visible = false;
					$scope.RefreshDataGrid();
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ManageCustomerOrders_ShippedOrderSuccessMsg), '', 3000);

				});

			} else {
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_SelectOrderCancelReson), 'error', 3000);
			}
		}

	}





	$scope.CancelOrder = function (enquiryList) {


		for (var i = 0; i < enquiryList.length; i++) {
			enquiryList[i].UserId = $rootScope.UserId;

		}


		var requestData =
		{
			ServicesAction: 'CancelOrderDetail',
			EnquiryList: enquiryList,
			UserId: $rootScope.UserId
		};

		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {

			$scope.RefreshDataGrid();
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_EnquiryCancel), '', 3000);
		});
	}


	$scope.RejectOrder = function (enquiryList) {
		debugger;
		$scope.orgEnquiryData = {};
		if (enquiryList.length > 0) {
			$scope.orgEnquiryData.MarkOrderAsShipped = true;

			var objectList = [];
			for (var i = 0; i < enquiryList.length; i++) {

				var object = {};

				object = {
					RoleId: parseInt($rootScope.RoleId),
					OrderNumber: enquiryList[i].OrderNumber,
					CurrentState: 9099,
					LoginId: parseInt($rootScope.UserId),
					IsRejectDelivery: true,
					ReasonCodeList: []
				};

				objectList.push(object);
			}

			$scope.orgEnquiryData.OrderList = objectList;
			var orderDTO = $scope.orgEnquiryData;
			ManageOrderService.RejectMultipleOrder(orderDTO).then(function (response) {
				$scope.RefreshDataGrid();
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_EnquiryRejected), '', 3000);

			});

		}

	}



	$scope.RejectEnquiry = function (enquiryList) {
		var requestData =
		{
			ServicesAction: 'RejectEnquiry',
			EnquiryList: enquiryList,
		};

		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {

			$scope.RefreshDataGrid();
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_EnquiryRejected), '', 3000);
		});
	}

	//#endregion

	//#region Refresh DataGrid
	$scope.RefreshDataGrid = function () {

		$scope.IsGridLoadCompleted = false;
		$scope.SalesAdminApprovalList = [];
		//$scope.GridConfigurationLoaded = false;
		$scope.IsEnquiryEdit = false;
		$scope.HeaderCheckboxControl = false;
		$scope.CellCheckboxControl = false;
		$scope.HeaderCheckBoxAction = false;
		var dataGrid = $("#OrderListGrid").dxDataGrid("instance");
		dataGrid.refresh();
		//
		//dataGrid = dataGrid.option("dataSource");
		//if (dataGrid != undefined) {
		//    dataGrid.store.load();
		//}
	}
	//#endregion

	//#region Export To Excel
	$scope.ExportToExcelSalesAdminApprovalData = function () {

		if ($scope.GridColumnList.length > 0) {
			$rootScope.Throbber.Visible = true;
			$scope.RequestDataFilter.ServicesAction = "ExportToExcelGrid";
			$scope.RequestDataFilter.ColumnList = $scope.GridColumnList.filter(function (el) { return el.IsExportAvailable === '1' && el.PropertyName !== 'CheckedEnquiry'; });

			var jsonobject = {};
			jsonobject.Json = $scope.RequestDataFilter;
			jsonobject.Json.IsExportToExcel = '1';

			GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {

				var byteCharacters1 = response.data;
				if (response.data !== undefined) {
					var byteCharacters = response.data;
					var blob = new Blob([byteCharacters], {
						type: "application/Pdf"
					});

					if (blob.size > 0) {
						var filName = "SalesAdminApproval_" + getDate() + ".csv";
						saveAs(blob, filName);
						$rootScope.Throbber.Visible = false;
					} else {
						$rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
						$rootScope.Throbber.Visible = false;
					}
				}
				else {
					$rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
					$rootScope.Throbber.Visible = false;
				}
			});
		}
	}
	//#endregion

	//#region Update Bulk Branch Plant
	$ionicModal.fromTemplateUrl('templates/ChangeBranchPlantCode.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {
		$scope.ChangeBranchPlantCodePopup = modal;
	});

	$scope.OpenChangeBranchPlantCodePopup = function (enquiryDetails, eventName) {
		$rootScope.EnquiryDetailsForAction = enquiryDetails;
		$rootScope.ReasonCodeEventName = eventName;
		$scope.ChangeBranchPlantCodePopup.show();
		$rootScope.Throbber.Visible = false;
	}


	$scope.CloseChangeBranchPlantCodePopup = function () {

		$scope.SelectedBranchPlant.BindingDataId = "";
		if ($scope.SelectedBranchPlant.BindingDataId !== undefined) {
			$scope.SelectedBranchPlant.BindingDataId = "";
		}
		$scope.ChangeBranchPlantCodePopup.hide();
		$rootScope.CloseReasoncodepopup();
	}
	//$scope.OpenChangeDeliveryLocationCodePopup = function (enquiryDetails, eventName) {
	//    $rootScope.EnquiryDetailsForAction = enquiryDetails;
	//    $rootScope.ReasonCodeEventName = eventName;
	//     $scope.ChangeBranchPlantCodePopup.show();
	//     $rootScope.Throbber.Visible = false;
	// }



	$ionicModal.fromTemplateUrl('templates/ChangeDeliveryLocationCode.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {
		$scope.ChangeDeliveryLocationCodePopup = modal;
	});
	$scope.OpenChangeDeliveryLocationCodePopup = function (enquiryDetails, eventName) {
		$rootScope.EnquiryDetailsForAction = enquiryDetails;
		$rootScope.ReasonCodeEventName = eventName;
		$scope.ChangeDeliveryLocationCodePopup.show();
		$rootScope.Throbber.Visible = false;
	}

	$scope.CloseChangeDeliveryLocationCodePopup = function () {

		$scope.SelectedDeliveryLocation.DeliveryLocationForSelectedEnquiry = "";
		if ($scope.SearchControl.InputShipToLocation !== undefined) {
			$scope.SearchControl.InputShipToLocation = "";
		}
		$scope.ChangeDeliveryLocationCodePopup.hide();
		$rootScope.CloseReasoncodepopup();
	}

	$scope.IsBranchPlantAlreadyAssinged = true;

	$scope.ChangeSelectedEnquiryBranchPlant = function () {

		var isBranchPlantChange = false;
		$scope.BindAllBranchPlantByCompany = [];
		$rootScope.Action = "Clear";
		$rootScope.Throbber.Visible = true;
		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
		if (enquiryDetails.length > 0) {
			if ($scope.IsMultipleCustomerUpdateBranchPlantApplicable === false) {
				var companyName = enquiryDetails[0].CompanyName;
				var CheckDifferentCompany = enquiryDetails.filter(function (el) { return el.CompanyName !== companyName; });
				if (CheckDifferentCompany.length > 0) {
					$rootScope.Throbber.Visible = false;
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_DifferentCompany), 'error', 3000);
					return false;
				} else {
					if ($rootScope.bindAllBranchPlant !== undefined && $rootScope.bindAllBranchPlant !== null) {
						$scope.BindAllBranchPlantByCompany = $rootScope.bindAllBranchPlant.filter(function (el) { return el.CompanyID === enquiryDetails[0].SoldTo });
					}
				}
			} else {
				$scope.BindAllBranchPlantByCompany = $rootScope.bindAllBranchPlant;
			}

			for (var i = 0; i < enquiryDetails.length; i++) {

				$rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId + "," + enquiryDetails[i].EnquiryId;
				$rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId.replace(/^,/, '');

				if (isBranchPlantChange === false) {

					if (enquiryDetails[i].BranchPlantName === "" || enquiryDetails[i].BranchPlantName === undefined || enquiryDetails[i].BranchPlantName === null) {
						$scope.IsBranchPlantAlreadyAssinged = false;
						isBranchPlantChange = true;
					}

				}


			}



			$rootScope.LoadReasonCode("ChangeBranchPlantReason");
			$scope.OpenChangeBranchPlantCodePopup(enquiryDetails, "UpdateBranchPlant");
			$rootScope.Throbber.Visible = false;
		} else {
			$rootScope.Throbber.Visible = false;
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
		}
	}




	$scope.ChangeSelectedEnquiryDeliveryLocation = function () {

		$scope.BindAllDeliveryLocationByCompany = [];
		$rootScope.Action = "Clear";
		$rootScope.Throbber.Visible = true;
		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
		if (enquiryDetails.length > 0) {
			if ($scope.IsMultipleCustomerUpdateBranchPlantApplicable === false) {
				var companyName = enquiryDetails[0].CompanyName;
				var CheckDifferentCompany = enquiryDetails.filter(function (el) { return el.CompanyName !== companyName; });
				if (CheckDifferentCompany.length > 0) {
					$rootScope.Throbber.Visible = false;
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_DifferentCompany), 'error', 3000);
					return false;
				} else {
					if ($rootScope.bindAllDeliveryLocation !== undefined && $rootScope.bindAllDeliveryLocation !== null) {
						$scope.BindAllDeliveryLocationByCompany = $rootScope.bindAllDeliveryLocation.filter(function (el) { return el.CompanyID === enquiryDetails[0].SoldTo });
					}
				}
			} else {
				$scope.BindAllDeliveryLocationbyCompany = $rootScope.bindAllBranchPlant;
			}

			for (var i = 0; i < enquiryDetails.length; i++) {

				$rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId + "," + enquiryDetails[i].EnquiryId;
				$rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId.replace(/^,/, '');
			}
			$rootScope.LoadReasonCode("ChangeDeliveryLocationReason");
			$scope.OpenChangeDeliveryLocationCodePopup(enquiryDetails, "UpdateDeliveryLocation");
			$rootScope.Throbber.Visible = false;
		} else {
			$rootScope.Throbber.Visible = false;
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
		}
	}



	$scope.SaveBranchPlantForSelectedEnquiry = function () {

		if ($scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry !== "") {
			$rootScope.Throbber.Visible = true;
			$scope.SelectedEnquiryId = "";
			var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== 999; });
			if (orderDetails.length > 0) {
				var objectList = [];

				for (var i = 0; i < orderDetails.length; i++) {


					var object = {};
					object.ObjectId = orderDetails[i].OrderId;

					objectList.push(object);
				}

				var mainObject = {};
				mainObject.ObjectList = objectList;
				mainObject.ObjectType = "Order";
				mainObject.ReasonCodeEventName = "UpdateBranchPlant";
				mainObject.FunctionName = "UpdateBranchPlantForSelectorder";
				mainObject.FunctionParameter = orderDetails;

				if ($scope.IsBranchPlantAlreadyAssinged === true) {
					$rootScope.SaveReasonCode(mainObject);
				} else {

					$scope[mainObject.FunctionName](mainObject.FunctionParameter);

					$rootScope.Throbber.Visible = false;
					$rootScope.CloseReasoncodepopup();
				}

			}
		} else {
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);
		}
	}

	$scope.UpdateBranchPlantForSelectorder = function (orderDetails) {
		var selectedOrderId = "";

		for (var i = 0; i < orderDetails.length; i++) {
			selectedOrderId = selectedOrderId + ',' + orderDetails[i].OrderId;
		}
		selectedOrderId = selectedOrderId.substr(1);

		var orderList = {
			BranchPlantName: $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry,
			OrderId: selectedOrderId,
		}

		var requestData =
		{
			ServicesAction: 'UpdateOrderBranchPlant',
			OrderDetailList: orderList
		};

		//  var stringfyjson = JSON.stringify(requestData);
		var consolidateApiParamater =
		{
			Json: requestData,
		};
		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
			$scope.CloseChangeBranchPlantCodePopup();

			$rootScope.Throbber.Visible = false;
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_BranchPlantUpdated), '', 3000);
			$scope.RefreshDataGrid();
		});
	}


	$scope.UpdateBranchPlantForSelectorder = function (orderDetails) {
		var selectedOrderId = "";

		for (var i = 0; i < orderDetails.length; i++) {
			selectedOrderId = selectedOrderId + ',' + orderDetails[i].OrderId;
		}
		selectedOrderId = selectedOrderId.substr(1);

		var orderList = {
			BranchPlantName: $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry,
			OrderId: selectedOrderId,
		}

		var requestData =
		{
			ServicesAction: 'UpdateOrderBranchPlant',
			OrderDetailList: orderList
		};

		//  var stringfyjson = JSON.stringify(requestData);
		var consolidateApiParamater =
		{
			Json: requestData,
		};
		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
			$scope.CloseChangeBranchPlantCodePopup();

			$rootScope.Throbber.Visible = false;
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_BranchPlantUpdated), '', 3000);
			$scope.RefreshDataGrid();
		});
	}


	//#endregion




	$scope.SaveDeliveryLocationForSelectedEnquiry = function () {

		if ($scope.SelectedDeliveryLocation.DeliveryLocationForSelectedEnquiry !== "") {
			$rootScope.Throbber.Visible = true;
			$scope.SelectedEnquiryId = "";
			var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== 999; });
			if (orderDetails.length > 0) {
				var objectList = [];

				for (var i = 0; i < orderDetails.length; i++) {


					var object = {};
					object.ObjectId = orderDetails[i].OrderId;

					objectList.push(object);
				}

				var mainObject = {};
				mainObject.ObjectList = objectList;
				mainObject.ObjectType = "Order";
				mainObject.ReasonCodeEventName = "UpdateDeliveryLocation";
				mainObject.FunctionName = "UpdateDeliveryLocationForSelectorder";
				mainObject.FunctionParameter = orderDetails;

				$rootScope.SaveReasonCode(mainObject);


			}
		} else {
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);
		}
	}

	$scope.UpdateDeliveryLocationForSelectorder = function (orderDetails) {
		var selectedOrderId = "";

		for (var i = 0; i < orderDetails.length; i++) {
			selectedOrderId = selectedOrderId + ',' + orderDetails[i].OrderId;
		}
		selectedOrderId = selectedOrderId.substr(1);

		var orderList = {
			DeliveryLocationName: $scope.SelectedDeliveryLocation.DeliveryLocationForSelectedEnquiry,
			OrderId: selectedOrderId,
		}

		var requestData =
		{
			ServicesAction: 'UpdateOrderDeliveryLocation',
			OrderDetailList: orderList
		};

		//  var stringfyjson = JSON.stringify(requestData);
		var consolidateApiParamater =
		{
			Json: requestData,
		};
		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
			$scope.CloseChangeDeliveryLocationCodePopup();

			$rootScope.Throbber.Visible = false;
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_DeliveryLocationUpdated), '', 3000);
			$scope.RefreshDataGrid();
			//var dataGrid = $("#OrderListGrid").dxDataGrid("instance");
			//dataGrid.refresh();
		});
	}

	//#region On Load Grid Configuration
	$scope.GridConfigurationLoaded = false;
	$scope.LoadGridByConfiguration = function (e) {


		console.log("9" + new Date());

		var dataGrid = $("#OrderListGrid").dxDataGrid("instance");

		for (var i = 0; i < $scope.GridColumnList.length; i++) {
			if ($scope.GridColumnList[i].IsAvailable === "0" || $scope.GridColumnList[i].IsAvailable === "false" || $scope.GridColumnList[i].IsAvailable === false) {
				dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visible", false);
				dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", false);
			}
			else {
				dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visibleIndex", parseInt($scope.GridColumnList[i].SequenceNumber));
				if ($scope.GridColumnList[i].IsMandatory === "1" || $scope.GridColumnList[i].IsSystemMandatory === "1") {
					dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", false);
				} else {
					dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", true);
				}

				if ($scope.GridColumnList[i].IsPinned === "1" || $scope.GridColumnList[i].IsPinned === "true" || $scope.GridColumnList[i].IsPinned === true) {
					dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "fixed", true);
				}

				if ($scope.GridColumnList[i].IsDefault === "0" || $scope.GridColumnList[i].IsDefault === "false" || $scope.GridColumnList[i].IsDefault === false) {
					dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visible", false);
				}

				if ($scope.GridColumnList[i].IsGrouped === "1") {
					dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "groupIndex", parseInt($scope.GridColumnList[i].GroupSequence));
				}

				if ($scope.GridColumnList[i].IsDetailsViewAvailable === "1" || $scope.GridColumnList[i].IsDetailsViewAvailable === "true" || $scope.GridColumnList[i].IsDetailsViewAvailable === true) {
					if ($scope.GridColumnList[i].PropertyName === "EnquiryAutoNumber") {
						dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "cssClass", "ClickkableCell EnquiryNumberUI UnderlineTextUI");
					}
				} else {
					if ($scope.GridColumnList[i].PropertyName === "EnquiryAutoNumber") {
						dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "cssClass", "ClickkableCell EnquiryNumberUI");
					}
				}
			}

			if ($scope.GridColumnList[i].PropertyName !== "CheckedEnquiry") {
				dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "caption", $scope.GridColumnList[i].ResourceValue);
			}
		}
		$scope.GridConfigurationLoaded = true;
		console.log("10" + new Date());
	}

	//#endregion

	//#region Note Popup Intialization And Load Note Infomation.

	$scope.NoteVariable = {
		NoteText: '',
		NoteTextTemp: '',
		CustomerServiceNoteText: ''
	}

	$scope.AddNotesModalPopup = function () {
		$ionicModal.fromTemplateUrl('templates/AddNotesForObject.html', {
			scope: $scope,
			animation: 'fade-in-scale',
			backdropClickToClose: false,
			hardwareBackButtonClose: false
		}).then(function (modal) {

			$scope.AddNotesPopup = modal;
		});
	}
	$scope.AddNotesModalPopup();
	$scope.OpenAddNotesModalPopup = function () {

		$scope.AddNotesPopup.show();
	}
	$scope.CloseAddNotesModalPopup = function () {

		$scope.AddNotesPopup.hide();
	}
	$scope.NotesOrderId = 0;
	$scope.OpenModelPoppupNote = function (orderId) {

		$scope.NotesOrderId = orderId;
		var requestData =
		{
			ServicesAction: 'GetNoteByObjectId',
			ObjectId: orderId,
			RoleId: $rootScope.RoleId,
			ObjectType: 1221,
			UserId: $rootScope.UserId
		};
		var consolidateApiParamater =
		{
			Json: requestData,
		};

		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (NotesResponse) {

			var NotesResponsedata = NotesResponse.data;

			$scope.OpenAddNotesModalPopup();

			if (NotesResponsedata.Json !== undefined) {
				var notesData = NotesResponsedata.Json.NotesList;

				if (notesData.length > 0) {

					$scope.NoteVariable.NoteText = notesData[0].Note;
				} else {
					$scope.NoteVariable.NoteText = "";
				}
			}
			else {
				$scope.NoteVariable.NoteText = "";
			}
		});
	}



	$scope.UpdateNote = function () {


		var Notes = [];
		if ($scope.NoteVariable.CustomerServiceNoteText !== "") {

			var noteText = $scope.NoteVariable.NoteText + "<br>" + $scope.NoteVariable.CustomerServiceNoteText;
			var noteJson = {
				RoleId: $rootScope.RoleId,
				ObjectId: $scope.NotesOrderId,
				ObjectType: 1221,
				Note: noteText,
				CreatedBy: $rootScope.UserId
			}

			Notes.push(noteJson);

			if (Notes.length > 0) {

				var Note =
				{
					ServicesAction: "SaveNotes",
					NoteList: Notes
				}

				var jsonobject = {};
				jsonobject.Json = Note;



				GrRequestService.ProcessRequest(jsonobject).then(function (response) {


					var eventNotificationList = [];
					var eventnotification = {};
					eventnotification.EventCode = "NoteUpdated";
					eventnotification.ObjectId = $scope.NotesOrderId;
					eventnotification.ObjectType = "Order";
					eventnotification.IsActive = 1;
					eventNotificationList.push(eventnotification);


					$rootScope.InsertInEventNotification(eventNotificationList);
					$scope.NoteVariable.CustomerServiceNoteText = "";
					$scope.CloseAddNotesModalPopup();
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryPage_NotesUpdated), 'error', 3000);
					$scope.NotesOrderId = 0;
					$scope.RefreshDataGrid();

				});
			}
		} else {
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_NoteEnterValidation), 'error', 3000);
		}

	}

	//#endregion

	//#region change language
	$rootScope.GridRecallForStatus = function () {

		$scope.IsRefreshGrid = true;
		$scope.GridConfigurationLoaded = false;
		$scope.LoadGridConfigurationData();
	}
	//#endregion

	//#region Edit and Remove Enquiry Products
	$scope.IsEnquiryEdit = false;
	$scope.RemoveEnquiryProductId = 0;

	$scope.ConfirmationMessageModalPopup = function () {
		$ionicModal.fromTemplateUrl('templates/ConfirmationMessageModalPopup.html', {
			scope: $scope,
			animation: 'fade-in-scale',
			backdropClickToClose: false,
			hardwareBackButtonClose: false
		}).then(function (modal) {

			$scope.ConfirmationMessageModal = modal;
		});
	}
	$scope.ConfirmationMessageModalPopup();
	$scope.OpenConfirmationMessageModalPopup = function () {

		$scope.ConfirmationMessageModal.show();
	}
	$scope.CloseConfirmationMessageModalPopup = function () {

		$scope.ConfirmationMessageModal.hide();
	}

	$scope.EditEnquiryByEnquiry = function (enquiryId) {

		if ($scope.IsEnquiryEdit === true) {
			//var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === enquiryId; });
			//if (currentOrder.length > 0) {
			//    if (currentOrder[0].OrderProductList !== undefined) {
			//        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
			//            currentOrder[0].OrderProductList[i].ProductQuantity = parseInt(currentOrder[0].OrderProductList[i].PreviousProductQuantity);
			//        }
			//    }
			//}
			//$scope.ReloadGraph($scope.OrderData, 0);

			$scope.IsEnquiryEdit = false;
			$scope.LoadOrderProductByOrderId(enquiryId, $scope.CurrentExpandedRow);

		}
		else {
			$scope.IsEnquiryEdit = true;
			//$scope.BindAllOrdersProduct=$scope.OrderData[0].OrderProductList;
		}
	}

	$scope.getSelectedDriverValue = function (driverId, orderid) {


		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderid; });

		if (enquiryDetails.length > 0) {
			enquiryDetails[0].DeliveryPersonnelId = driverId;
		}
	}

	$scope.getSelectedPlateNumberValue = function (PlateNumber, orderid) {


		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderid; });

		if (enquiryDetails.length > 0) {
			enquiryDetails[0].PlateNumber = PlateNumber;
		}
	}

	$scope.getSelectedShiftValue = function (ShiftCode, orderid) {

		debugger;
		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderid; });

		if (enquiryDetails.length > 0) {
			enquiryDetails[0].ShiftCode = ShiftCode;
		}
	}

	$scope.RemoveProductFromEnquiry = function (orderid, orderProductId) {

		var enquiryProducts = $scope.OrderData[0].OrderProductList.filter(function (el) { return el.OrderId === orderid && el.EnquiryProductGUID === orderProductId });
		if (enquiryProducts.length > 0) {
			$scope.RemoveEnquiryProductId = orderProductId;
			$scope.OpenConfirmationMessageModalPopup();
		} else {
		}
	}

	$scope.RemoveEnquiryProduct = function () {

		var productList = $scope.OrderData[0].OrderProductList.filter(function (el) { return el.EnquiryProductGUID === $scope.RemoveEnquiryProductId });
		if (productList.length > 0) {
			var ItemId = productList[0].ItemId;
			$scope.OrderData[0].OrderProductList = $scope.OrderData[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 30 || el.EnquiryProductGUID !== $scope.RemoveEnquiryProductId });
			$scope.OrderProductList = $scope.OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 30 || el.EnquiryProductGUID !== $scope.RemoveEnquiryProductId });
			if ($scope.IsPalletLoadCheckValidation === true || $scope.IsWeightLoadCheckValidation === true) {
				$scope.OrderData[0].IsTruckFull = false;
			}
			$scope.RemovePromotionItem($scope.OrderData, ItemId);

			if ($scope.OrderData[0].OrderProductList.length === 1) {
				if ($scope.OrderData[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
					$scope.OrderData[0].OrderProductList = [];
				}
			}

			$scope.ReloadGraph($scope.OrderData, 0);
			//$scope.LoadEnquiryAmountDetails($scope.OrderData[0].OrderProductList);
			$rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);
			$scope.CloseConfirmationMessageModalPopup();
		}
	}

	//#endregion

	//#region Update Enquiry Products
	$scope.UpdateOrderByOrder = function (enquiryId) {

		if ($scope.IsEnquiryEdit === true) {
			$rootScope.Throbber.Visible = true;
			//if (($scope.AvailableCreditLimit - ($scope.EnquiryGrandTotalAmount)) < 0) {
			//    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_TotalOMCreditLimitValidation), 'error', 3000);
			//    $rootScope.Throbber.Visible = false;
			//    return false;
			//}

			$scope.EnquiryList = [];
			if ($scope.OrderData[0].IsTruckFull === true) {
				if ($scope.OrderData[0].OrderProductList.length > 0) {
					var equirydata = {};
					equirydata.OrderId = $scope.OrderData[0].OrderProductList[0].OrderId;
					equirydata.UpdatedBy = $rootScope.UserId;
					equirydata.OrderProductList = [];
					for (var i = 0; i < $scope.OrderData[0].OrderProductList.length; i++) {
						var equiryProductdata = {};
						equiryProductdata.OrderProductId = $scope.OrderData[0].OrderProductList[i].OrderProductId;
						equiryProductdata.ProductQuantity = $scope.OrderData[0].OrderProductList[i].ProductQuantity;
						equiryProductdata.IsActive = $scope.OrderData[0].OrderProductList[i].IsActive;
						equiryProductdata.EnquiryId = $scope.OrderData[0].OrderProductList[i].EnquiryId;
						equiryProductdata.ProductCode = $scope.OrderData[0].OrderProductList[i].ProductCode;
						equiryProductdata.ProductType = $scope.OrderData[0].OrderProductList[i].ProductType;
						equiryProductdata.UnitPrice = $scope.OrderData[0].OrderProductList[i].UnitPrice;
						equiryProductdata.ItemPricesPerUnit = $scope.OrderData[0].OrderProductList[i].ItemPricesPerUnit;
						equiryProductdata.ItemType = $scope.OrderData[0].OrderProductList[i].ItemType;
						equiryProductdata.ProductQuantity = $scope.OrderData[0].OrderProductList[i].ProductQuantity;
						equiryProductdata.CreatedBy = $rootScope.UserId;
						equiryProductdata.UpdatedBy = $rootScope.UserId;
						equiryProductdata.Remarks = "";
						equiryProductdata.SequenceNo = 0;
						equiryProductdata.AssociatedOrder = 0;
						if ($scope.OrderData[0].OrderProductList[i].DepositeAmountPerUnit !== undefined) {
							equiryProductdata.DepositeAmount = $scope.OrderData[0].OrderProductList[i].DepositeAmount;
							equiryProductdata.DepositeAmountPerUnit = $scope.OrderData[0].OrderProductList[i].DepositeAmountPerUnit;
						} else {
							equiryProductdata.DepositeAmount = 0;
						}
						equirydata.OrderProductList.push(equiryProductdata);

					}
					$scope.EnquiryList.push(equirydata);

					var Enquiry =
					{
						ServicesAction: "UpdateOrderProduct",
						OrderList: $scope.EnquiryList
					}

					var jsonobject = {};
					jsonobject.Json = Enquiry;
					GrRequestService.ProcessRequest(jsonobject).then(function (response) {

						$rootScope.Throbber.Visible = false;
						$scope.IsEnquiryEdit = false;
						$scope.EnableAddItem = false;
						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApproval_UpdateOrder), 'error', 3000);
					});
				}
				else {
					$rootScope.Throbber.Visible = false;
				}
			} else {
				$rootScope.Throbber.Visible = false;
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApproval_TruckNotFull), 'error', 3000);
			}
		} else {
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApproval_EditModeNotEnable), 'error', 3000);
		}
	}
	//#endregion

	//#region Get Item Information

	$rootScope.PromotionItemList = [];

	$scope.LoadItemListByCompany = function () {

		var requestData =
		{
			ServicesAction: 'LoadAllProducts',
			CompanyId: $rootScope.SoldToCompanyId,
			ItemValue: $scope.SearchControl.InputItem,
		};

		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {

			var resoponsedata = response.data;
			$scope.bindallproduct = resoponsedata.Item.ItemList;

			$rootScope.Throbber.Visible = false;


		});
	}

	//$scope.LoadItemListByCompany();

	//#endregion

	//#region Load Pramotion Item List
	$scope.LoadPramotionItem = function () {

		var requestPromotionData =
		{
			ServicesAction: 'GetPromotionFocItemList',
			CompanyId: $rootScope.SoldToCompanyId,
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
	}

	//$scope.LoadPramotionItem();

	//#endregion

	//#region Get Item Details Event

	$scope.GetItemDetails = function (itemId, enquiryId, productQuantity, uom) {

		$scope.IsItemEdit = true;
		$rootScope.IsSelfCollect = false;
		$rootScope.IsPalettesRequired = true;
		$scope.UOM = uom;
		$scope.getItemPrice(itemId, 0);
	}

	$scope.selectedItemEvent = function (itemId) {



		var requestData =
		{
			ServicesAction: 'LoadItemDetaiByItemId',
			CompanyId: $scope.ActiveCompanyId,
			ItemId: itemId
		};

		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {

			var resoponsedata = response.data;

			$scope.bindallproduct = [];

			$scope.bindallproduct = resoponsedata.Json.ItemList;


			$scope.getItemPrice(itemId, 0);
		});



	}

	$scope.getItemPrice = function (itemId, associatedCount) {
		try {


			$rootScope.Throbber.Visible = true;
			var productNameStr = $scope.OrderProductList.filter(function (el) { return el.ItemId === itemId; });
			if (productNameStr.length > 0) {
				//$scope.ItemPrices = productNameStr[0].Amount;	


				var ItemPriceGlassRun = ((parseInt(productNameStr[0].ItemType) == 31 ? 0 : parseFloat(productNameStr[0].ItemPricesPerUnit)) * parseInt(productNameStr
				[0].ProductQuantity));
				productNameStr[0].ItemPrices = ItemPriceGlassRun;
				$rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);

				if (associatedCount === 0) {
					$scope.ItemDepositeAmount = productNameStr[0].CurrentDeposit;
				} else {
					$scope.ItemDepositeAmount = 0;
				}
				$scope.UOM = productNameStr[0].UOM;
				$scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
				$scope.SearchControl.InputItem = productNameStr[0].ItemNameCode;
				$scope.ItemField.itemId = productNameStr[0].ItemId;
				$scope.showItembox = false;
				focus('inputItemsQty');
			}
			else {
				var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
				if (productNameStr.length > 0) {
					$scope.ItemPrices = productNameStr[0].Amount;


					//var ItemPriceGlassRun = ((parseInt(productNameStr[0].ItemType) == 31 ? 0 : parseFloat(productNameStr[0].ItemPricesPerUnit)) * parseInt(productNameStr[0].ProductQuantity));
					productNameStr[0].Amount = productNameStr[0].Amount;
					//$rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);

					if (associatedCount === 0) {
						$scope.ItemDepositeAmount = productNameStr[0].CurrentDeposit;
					} else {
						$scope.ItemDepositeAmount = 0;
					}
					$scope.UOM = productNameStr[0].UOM;
					$scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
					$scope.SearchControl.InputItem = productNameStr[0].ItemNameCode;
					$scope.ItemField.itemId = productNameStr[0].ItemId;
					$scope.showItembox = false;
					focus('inputItemsQty');
				}
				else {
					$scope.ItemPrices = 0;
					$scope.ItemCodeForDeposite = '';
				}
			}





			///request for item deposite log

			var requestDataforItemDepositeLog =
			{
				UserId: $rootScope.UserId,
				ObjectId: itemId,
				ObjectType: "Item Deposite  : EnquiryId " + $rootScope.EditedEnquiryId + "",
				ServicesAction: 'CreateLog',
				LogDescription: 'On Item Selection In Enquiry Page For Item Deposite Amount. Item : ' + itemId + ' And Amount : ' + $scope.ItemDepositeAmount + '.',
				LogDate: GetCurrentdate(),
				Source: 'Portal',
			};
			var consolidateApiParamaterItemDeposite =
			{
				Json: requestDataforItemDepositeLog,
			};




			var GetResponseForItemDepositeLog = GrRequestService.ProcessRequest(consolidateApiParamaterItemDeposite);



			///request for current stock position

			$scope.ItemCurrentStockPosition = 0;
			var requestDataForCurrenttStockPosition =
			{
				ServicesAction: 'GetProductCurrenttStockPosition',
				ProductCode: productNameStr[0].ItemCode,
				DeliveryLocationCode: $rootScope.BranchPlantCodeEdit
			};

			var jsonobjectForCurrenttStockPosition = {};
			jsonobjectForCurrenttStockPosition.Json = requestDataForCurrenttStockPosition;

			var GetResponsedataForProductCurrenttStockPosition = GrRequestService.ProcessRequest(jsonobjectForCurrenttStockPosition);


			///request for   item allocation

			var requestDataItemAllocation =
			{
				ServicesAction: 'GetItemAllocation',
				DeliveryLocation: {
					LocationId: $rootScope.DeliveryLocationId,
					DeliveryLocationCode: $rootScope.DeliveryLocationCode
				},
				CompanyId: $scope.ActiveCompanyId,
				CompanyMnemonic: $scope.ActiveCompanyMnemonic,
				Company: {
					CompanyId: $scope.ActiveCompanyId,
					CompanyMnemonic: $scope.ActiveCompanyMnemonic
				},
				RuleType: 2,
				Item: {
					ItemId: parseInt(itemId),
					SKUCode: $scope.ItemCodeForDeposite,
				},
				EnquiryId: 0
			};
			$scope.Allocation = 'NA';
			$scope.ActualAllocation = 'NA';
			var jsonobjectForItemAllocation = {};
			jsonobjectForItemAllocation.Json = requestDataItemAllocation;

			var GetResponsedataForItemAllocation = GrRequestService.ProcessRequest(jsonobjectForItemAllocation);




			///request for   item allocation   log

			var requestDataLogforItemAllocationLog =
			{
				UserId: $rootScope.UserId,
				ObjectId: itemId,
				ObjectType: "Item Allocation  : EnquiryId " + $rootScope.EditedEnquiryId + "",
				ServicesAction: 'CreateLog',
				LogDescription: 'On Item Selection In Enquiry Page For Item Allocation. Item : ' + itemId + ' And Allocation : ' + $scope.Allocation + 'and ' + $scope.ActualAllocation + '.',
				LogDate: GetCurrentdate(),
				Source: 'Portal',
			};
			var jsonobjectForItemAllocationLog =
			{
				Json: requestDataLogforItemAllocationLog,
			};

			var GetResponsedataForItemAllocationLog = GrRequestService.ProcessRequest(jsonobjectForItemAllocationLog);



			if (associatedCount == 0) {


				///request for  requestLayerData


				var requestLayerData =
				{
					ServicesAction: 'GetRuleValue',
					CompanyId: $scope.ActiveCompanyId,
					CompanyMnemonic: $scope.ActiveCompanyMnemonic,
					DeliveryLocation: {
						LocationId: $rootScope.DeliveryLocationId,
						DeliveryLocationCode: $rootScope.DeliveryLocationCode,
					},
					Company: {
						CompanyId: $scope.ActiveCompanyId,
						CompanyMnemonic: $scope.ActiveCompanyMnemonic,
					},
					RuleType: 4,
					Item: {
						SKUCode: productNameStr[0].ItemCode
					}

				};

				$scope.IsItemLayerAllow = false;
				var jsonLayerobject = {};
				jsonLayerobject.Json = requestLayerData;

				var GetResponsedataForLayerData = GrRequestService.ProcessRequest(jsonLayerobject);




				///request for  requestKegRule

				var noOfExtraPalettes = 0;

				var requestDataForKegRule =
				{
					ServicesAction: 'GetRuleValue',
					CompanyId: $scope.ActiveCompanyId,
					CompanyMnemonic: $scope.ActiveCompanyMnemonic,
					DeliveryLocation: {
						LocationId: $rootScope.DeliveryLocationId,
						DeliveryLocationCode: $rootScope.DeliveryLocationCode,
					},
					Company: {
						CompanyId: $scope.ActiveCompanyId,
						CompanyMnemonic: $scope.ActiveCompanyMnemonic,
					},
					RuleType: 3,
					Item: {
						UOM: $scope.UOM
					}

				};
				var jsonobjectForKegRule = {};
				jsonobjectForKegRule.Json = requestDataForKegRule;



				var GetResponsedataForKegRule = GrRequestService.ProcessRequest(jsonobjectForKegRule);




				$q.all([
					GetResponseForItemDepositeLog,
					GetResponsedataForProductCurrenttStockPosition,
					GetResponsedataForItemAllocation,
					GetResponsedataForItemAllocationLog,
					GetResponsedataForLayerData,
					GetResponsedataForKegRule
				]).then(function (resp) {



					var responseForItemDepositeLog = resp[0];
					var responseForProductCurrenttStockPosition = resp[1];
					var responseForItemAllocation = resp[2];
					var responseForItemAllocationLog = resp[3];
					var responseForLayerData = resp[4];
					var GetResponsedataForKegRule = resp[5];



					if (responseForProductCurrenttStockPosition.data.ItemStock !== undefined) {
						$scope.ItemCurrentStockPosition = responseForProductCurrenttStockPosition.data.ItemStock.CurrentStockPosition;
					} else {
						$scope.ItemCurrentStockPosition = 0;
					}



					if (responseForItemAllocation.data !== null) {
						var responseStr = responseForItemAllocation.data.Json;
						var currentOrder = $scope.OrderData;
						$scope.CheckAllocatonPresent = responseStr.Allocation;
						if (responseStr.Allocation != 'NA') {
							if ($scope.IsItemEdit) {

								var UsedAllocationQty = $scope.GetPendingAllocation('NA', 0, currentOrder, itemId, responseStr.ItemList);
								$scope.Allocation = parseInt(responseStr.Allocation) - parseInt(UsedAllocationQty);
								$scope.ActualAllocation = parseInt(responseStr.Allocation);
							}
							else {

								var UsedAllocationQty = $scope.GetPendingAllocation('NA', 0, currentOrder, itemId, responseStr.ItemList);
								$scope.Allocation = parseInt(responseStr.Allocation) - parseInt(UsedAllocationQty);
								$scope.ActualAllocation = parseInt(responseStr.Allocation);
							}
						}
						else {
							$scope.Allocation = responseStr.Allocation;
							$scope.ActualAllocation = responseStr.Allocation;
						}
					}



					var responseItemLayerStr = responseForLayerData.data.Json;
					if (responseItemLayerStr.RuleValue != '' && responseItemLayerStr.RuleValue != undefined) {

						if (responseItemLayerStr.RuleValue === '1') {
							$scope.IsItemLayerAllow = true;
						}
						else {
							$scope.IsItemLayerAllow = false;
						}


					}



					var responseExtraPalettesStr = GetResponsedataForKegRule.data.Json;

					if (responseExtraPalettesStr.RuleValue != '' && responseExtraPalettesStr.RuleValue != undefined) {
						noOfExtraPalettes = parseInt(responseExtraPalettesStr.RuleValue);
						if (noOfExtraPalettes > 0) {
							noOfExtraPalettes = noOfExtraPalettes;
						}
					}
					var validQty = $scope.CheckForNewQty(itemId, productNameStr[0].ItemType, productNameStr[0].ProductQuantity, productNameStr, noOfExtraPalettes);
					$scope.MaxPermissibleQuantity = validQty;





					$rootScope.Throbber.Visible = false;


				});





			}




		} catch (e) {
			$rootScope.Throbber.Visible = false;
		}
	}

	$scope.CheckingExtraPalettesBeforeAddingItem = function (itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode) {


		if (itemId != 0 && itemId != "") {
			$rootScope.Throbber.Visible = true;

			var noOfExtraPalettes = 0;
			var requestData =
			{
				ServicesAction: 'GetRuleValue',
				CompanyId: $scope.CompanyId,
				CompanyMnemonic: $scope.CompanyMnemonic,
				DeliveryLocation: {
					LocationId: $rootScope.DeliveryLocationId,
					DeliveryLocationCode: $rootScope.DeliveryLocationCode,
				},
				Company: {
					CompanyId: $scope.CompanyId,
					CompanyMnemonic: $scope.CompanyMnemonic,
				},
				RuleType: 3,
				Item: {
					UOM: $scope.UOM
				}
			};
			var jsonobject = {};
			jsonobject.Json = requestData;

			var requestDataforExtraPalettes =
			{
				UserId: $rootScope.UserId,
				ObjectId: itemId,
				ObjectType: "Extra Palettes Rules  : EnquiryId " + $rootScope.EditedEnquiryId + "",
				ServicesAction: 'CreateLog',
				LogDescription: 'Extra Palettes Rules ' + JSON.stringify(jsonobject) + '.',
				LogDate: GetCurrentdate(),
				Source: 'Portal',
			};
			var consolidateApiParamaterExtraPalettes =
			{
				Json: requestDataforExtraPalettes,
			};

			GrRequestService.ProcessRequest(consolidateApiParamaterExtraPalettes).then(function (responseLogItemDepositeValidation) {
			});

			GrRequestService.ProcessRequest(jsonobject).then(function (responseExtraPalettes) {

				var responseExtraPalettesStr = responseExtraPalettes.data.Json;

				if (responseExtraPalettesStr.RuleValue != '' && responseExtraPalettesStr.RuleValue != undefined) {
					noOfExtraPalettes = parseInt(responseExtraPalettesStr.RuleValue);
					if (noOfExtraPalettes > 0) {
						noOfExtraPalettes = noOfExtraPalettes;
					}
				}

				// Save On Item Selection Extra Pallets.
				var requestDataforExtraPalletsOutput =
				{
					UserId: $rootScope.UserId,
					ObjectId: itemId,
					ObjectType: "Extra Pallets Output : EnquiryId " + $rootScope.EditedEnquiryId + "",
					ServicesAction: 'CreateLog',
					LogDescription: 'On Item Selection In Enquiry Page For Extra Pallets. Item : ' + itemId + ' And Extra Pallets : ' + $scope.NumberOfExtraPalettes + '.',
					LogDate: GetCurrentdate(),
					Source: 'Portal',
				};
				var consolidateApiParamaterExtraPalletsoutput =
				{
					Json: requestDataforExtraPalletsOutput,
				};

				GrRequestService.ProcessRequest(consolidateApiParamaterExtraPalletsoutput).then(function (responseLogItemAllocationValidation) {
				});

				$rootScope.Throbber.Visible = false;
				$scope.addProducts(itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode, noOfExtraPalettes);
			});
		}
		else {
			$rootScope.IsProductValidation = true;
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectProduct), 'error', 8000);
		}
	}

	$scope.addProducts = function (itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode, noOfExtraPalettes) {

		if (qty === "" || qty === undefined || qty === null) {
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnterValidQuantity), 'error', 3000);
			return false;
		}

		if (parseInt(qty) < 1) {
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnterValidQuantity), 'error', 3000);
			return false;
		}

		var addPromotionQty = qty;

		if ($rootScope.DeliveryLocationId > 0 && ($rootScope.TruckSizeId > 0 || $rootScope.IsSelfCollect === true)) {
			var currentOrder = $scope.OrderData.filter(function (el) { return parseInt(el.OrderId) === parseInt($scope.EditEnquiryId); });
			if (currentOrder.length > 0) {
				var totalWeightWithPalettes = 0;
				var totalWeightWithBuffer = 0;
				var productNameStr = $scope.OrderProductList.filter(function (el) { return el.ItemId === itemId; });
				if (productNameStr.length == 0) {
					var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
				}
				// Check Validation Of Max Number Of Item Allow To Add In OrderProduct.
				if (!$scope.IsItemEdit) {
					var numberOfProductAdded = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 32 && el.ProductCode !== $scope.WoodenPalletCode; });
					if (numberOfProductAdded.length > (parseInt($scope.NumberOfProductAdd) - 1)) {
						//$rootScope.ValidationErrorAlert('You can not add more the ' + $scope.NumberOfProductAdd + ' products.', 'error', 3000);
						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_NumberOfProducts, $scope.NumberOfProductAdd), 'error', 3000);
						return false;
					}
				}

				// Item Layer validation according to quantity.
				if (parseInt(productNameStr[0].QtyPerLayer) > 0) {
					if ($scope.IsItemLayerAllow) {
						var g = (parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer));
						if ((parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer)) > 0) {
							if ((parseInt(ItemType) == 31)) {
								$scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
							}

							// Save Item Layer Validation Log.
							var requestDataforItemLayer =
							{
								UserId: $rootScope.UserId,
								ObjectId: itemId,
								ObjectType: "Item Layer  : EnquiryId " + $rootScope.EditedEnquiryId + "",
								ServicesAction: 'CreateLog',
								LogDescription: 'Click On Add Product Button In Enquiry Page For Item Layer Validation. Item : ' + itemId + ' And Quantity : ' + qty + ' Layer Validation Allow : ' + $scope.IsItemLayerAllow + ' Quantity Per Layer ' + parseInt(productNameStr[0].QtyPerLayer) + '.',
								LogDate: GetCurrentdate(),
								Source: 'Portal',
							};
							var consolidateApiParamaterItemLayer =
							{
								Json: requestDataforItemLayer,
							};

							GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {
							});

							//$rootScope.ValidationErrorAlert('This item can be ordered in complete layers, please adjust ordered quantity.', 'error', 3000);

							$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_CompleteLayer), 'error', 3000);
							return false;
						}
					}
				}



				// Save Item Layer Validation Log.
				var requestDataforItemLayer =
				{
					UserId: $rootScope.UserId,
					ObjectId: itemId,
					ObjectType: "Item Layer  : EnquiryId " + $rootScope.EditedEnquiryId + "",
					ServicesAction: 'CreateLog',
					LogDescription: 'Click On Add Product Button In Enquiry Page For Item Layer Validation. Item : ' + itemId + ' And Quantity : ' + qty + ' Layer Validation Allow : ' + $scope.IsItemLayerAllow + ' Quantity Per Layer ' + parseInt(productNameStr[0].QtyPerLayer) + '.',
					LogDate: GetCurrentdate(),
					Source: 'Portal',
				};
				var consolidateApiParamaterItemLayer =
				{
					Json: requestDataforItemLayer,
				};

				GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {
				});


				var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return el.ItemId === itemId & parseInt(el.ItemType) === parseInt(ItemType) & parseInt(el.GratisOrderId) === 0; });
				var enquiryProductGuid = '';
				if (productNameStrupdate.length > 0) {
					enquiryProductGuid = productNameStrupdate[0].EnquiryProductGUID;
				} else {
					productNameStrupdate = [];
				}


				var checkPromotionItemPresent = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === parseInt(31) && el.ProductCode === productNameStr[0].ItemCode; });
				if (checkPromotionItemPresent.length == 0) {
					var chkVlaue = $scope.CheckBeforeAddingPromationItem(productNameStr[0].ItemCode, itemId, parseInt(qty), ItemType, productNameStr, enquiryProductGuid, GratisOrderId, noOfExtraPalettes, productNameStrupdate);
					if (!chkVlaue && !$rootScope.IsSelfCollect) {
						return false;
					}
				}

				// Check Item Allocation

				if (parseInt(GratisOrderId) == 0) {
					var checkAllocationValue = $scope.CheckAllocation($scope.Allocation, qty, $scope.OrderData, itemId);
					if (!checkAllocationValue) {
						if ((parseInt(ItemType) == 31)) {
							$scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
						}


						//$rootScope.ValidationErrorAlert('It seems like you are tyring to order the item more than the allocated quantity. You cannot order this item more than ' + $scope.Allocation + ' ' + productNameStr[0].UOM + '', 'error', 10000);
						if (productNameStrupdate.length > 0) {
							productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
						}

						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_MorethanAllocationQty, $scope.Allocation, productNameStr[0].UOM), 'error', 3000);
						return false;
					}
				}

				var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
				var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
				//var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, $scope.NumberOfExtraPalettes, ItemType, enquiryProductGuid);
				var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, noOfExtraPalettes, ItemType, enquiryProductGuid);

				var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
				if (bufferWeight !== "") {
					totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
				}
				var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);

				var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
				if (weightPerPalettes !== "") {
					if ($rootScope.IsPalettesRequired) {
						totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
					}
					totalWeight = totalWeight + totalWeightWithPalettes
				}
				truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);

				var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
				var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

				if (productNameStrupdate.length > 0) {
					if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect && $scope.IsWeightLoadCheckValidation === true) {
						if ((parseInt(ItemType) == 31)) {
							$scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
						}
						//$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
						if (productNameStrupdate.length > 0) {
							productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
						}
						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
						$scope.CloseAddTruckControl();
						return false;
					} else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect && $scope.IsPalletLoadCheckValidation === true) {
						var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
						if ((parseInt(ItemType) == 31)) {
							$scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
						}
						//$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);
						if (productNameStrupdate.length > 0) {
							productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
						}
						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
						$scope.CloseAddTruckControl();
						return false;
					}
					else {
						currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes) + parseFloat(truckTotalExtraPalettes));
						currentOrder[0].TruckWeight = (totalWeight / 1000);
						currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
						if ($scope.IsItemEdit) {
							productNameStrupdate[0].ProductQuantity = parseInt(qty);
							productNameStrupdate[0].PreviousProductQuantity = productNameStrupdate[0].ProductQuantity;

							productNameStrupdate[0].ItemPrices = $rootScope.calcTotalAmount($scope.OrderData, $scope.CurrentOrderGuid, true);
							productNameStrupdate[0].ItemTotalDepositeAmount = $rootScope.calcTotalDepositeAmount($scope.OrderData, $scope.CurrentOrderGuid, true);

							if (productNameStrupdate[0].UsedQuantityInEnquiry !== undefined && productNameStrupdate[0].UsedQuantityInEnquiry !== null) {
								var remainingProductStock = parseFloat(parseFloat(productNameStrupdate[0].CurrentStockPosition) - parseFloat(productNameStrupdate[0].UsedQuantityInEnquiry));
								if (parseFloat(productNameStrupdate[0].ProductQuantity) < remainingProductStock) {
									productNameStrupdate[0].IsItemAvailableInStock = true;
								} else {
									productNameStrupdate[0].IsItemAvailableInStock = false;
								}
							}
						}
						else {
							if (parseInt(ItemType) === 31) {
								productNameStrupdate[0].ProductQuantity = parseInt(qty);
								productNameStrupdate[0].PreviousProductQuantity = productNameStrupdate[0].ProductQuantity;
							}
							else {
								productNameStrupdate[0].ProductQuantity = parseInt(productNameStrupdate[0].ProductQuantity) + parseInt(qty);
								productNameStrupdate[0].PreviousProductQuantity = productNameStrupdate[0].ProductQuantity;
								addPromotionQty = productNameStrupdate[0].ProductQuantity;
							}

							productNameStrupdate[0].ItemPrices = $rootScope.calcTotalAmount($scope.OrderData, $scope.CurrentOrderGuid, true);
							productNameStrupdate[0].ItemTotalDepositeAmount = $rootScope.calcTotalDepositeAmount($scope.OrderData, $scope.CurrentOrderGuid, true);
						}

						$rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);
						$scope.ReloadGraph(currentOrder, 0);

						$scope.ClearItemRecord();
					}
				}
				else {

					if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect && $scope.IsWeightLoadCheckValidation === true) {
						if ((parseInt(ItemType) == 31)) {
							$scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
						}
						//$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
						$scope.CloseAddTruckControl();
						return false;
					} else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect && $scope.IsPalletLoadCheckValidation === true) {
						var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
						if ((parseInt(ItemType) == 31)) {
							$scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
						}
						//$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' pallets. Please modify your order and try again.', 'error', 8000);
						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
						$scope.CloseAddTruckControl();
						return false;
					}

					else {
						if (currentOrder.length > 0) {
							$rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
							$rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);
							angular.forEach($rootScope.buindingPalettes, function (item, key) {
								item.PalettesWidth = 0;
							});

							if ($rootScope.IsPalettesRequired) {
								for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
									if (i < parseInt($rootScope.buindingPalettes.length)) {
										$rootScope.buindingPalettes[i].PalettesWidth = 100;
									}
								}
							}
							currentOrder[0].TruckName = $rootScope.TruckSize;
							currentOrder[0].TruckCapacity = $rootScope.TruckCapacityInTone;
							currentOrder[0].TruckSizeId = $rootScope.TruckSizeId;
							currentOrder[0].ShipTo = $rootScope.DeliveryLocationId;
							currentOrder[0].DeliveryLocationName = $rootScope.DeliveryLocationName;
							currentOrder[0].NoOfDays = $rootScope.NoOfDays;
							currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes) + parseFloat(truckTotalExtraPalettes));
							currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
							currentOrder[0].TruckWeight = $rootScope.TruckCapacityFullInTone;
							if (parseInt(currentOrder[0].EnquiryId) === 0) {
								currentOrder[0].CurrentState = 1;
							}

							if (productNameStr[0].Amount == undefined) {
								productNameStr[0].Amount = 0;
							}

							if (parseInt(GratisOrderId) !== 0) {
								var gratisorder = currentOrder[0].OrderProductList.filter(function (el) { return el.GratisOrderId === GratisOrderId && el.ItemId === itemId; });

								if (gratisorder.length > 0) {
									return false;
								}
							}


							var products = {
								EnquiryProductGUID: generateGUID(),
								OrderId: $rootScope.EditedEnquiryId,
								OrderProductId: 0,
								Allocation: $scope.Allocation,
								ItemId: itemId,
								ParentItemId: ParentItemId,
								ParentProductCode: ParentProductCode,
								GratisOrderId: GratisOrderId,
								ItemName: productNameStr[0].ItemName,
								ProductCode: productNameStr[0].ItemCode,
								NumberOfExtraPalettes: noOfExtraPalettes,
								PrimaryUnitOfMeasure: productNameStr[0].UOM,
								ProductQuantity: qty,
								PreviousProductQuantity: qty,
								ActualAllocation: $scope.ActualAllocation,
								ItemShortCode: productNameStr[0].ItemShortCode,
								DepositeAmount: $scope.ItemDepositeAmount,
								UnitPrice: parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount),
								ItemPricesPerUnit: parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount),
								ItemTaxPerUnit: percentage(parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount), $scope.ItemTaxInPec),
								ItemPrices: (parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount) * parseInt(qty)),
								DepositeAmountPerUnit: $scope.ItemDepositeAmount,
								DiscountAmount: 0,
								ItemTotalDepositeAmount: parseFloat(parseFloat($scope.ItemDepositeAmount) * parseInt(qty)),
								ConversionFactor: productNameStr[0].ConversionFactor,
								ProductType: productNameStr[0].ProductType,
								WeightPerUnit: productNameStr[0].WeightPerUnit,
								IsItemLayerAllow: $scope.IsItemLayerAllow,
								ItemType: ItemType,
								IsActive: "1"
							}

							if (parseInt(currentOrder[0].EnquiryId) !== 0) {
								products.CurrentStockPosition = $scope.ItemCurrentStockPosition;
							}
							currentOrder[0].OrderProductList.push(products);

							var x = $scope.OrderData;
							$rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);
						}

						$scope.ClearItemRecord();
					}
				}

				if ($rootScope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {

					$scope.AddWoodenPallet();
				}

				var chkaddpro = $scope.AddPromationItem(productNameStr[0].ItemCode, itemId, parseInt(addPromotionQty), ItemType);

				if ($scope.IsPalletLoadCheckValidation === true || $scope.IsWeightLoadCheckValidation === true) {
					if (!chkaddpro && !$rootScope.IsSelfCollect) {
						var dd = $scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $rootScope.TruckCapacity, $rootScope.TruckCapacityPalettes, totalWeightWithPalettes);
						if (dd) {
							var dd = $scope.AddTruckControl;
							if (!dd._isShown) {
								currentOrder[0].IsTruckFull = true;
								$scope.AddTruckHeaderMessage = String.format($rootScope.resData.res_CreateInquiryPage_TruckFullConfirmationHeaderMessage);
								$scope.AddTruckBodymessage = String.format($rootScope.resData.res_CreateInquiryPage_TruckFullConfirmationMessageInEdit);
								$scope.OpenAddTruckControl();
							}
						}
						else {
							currentOrder[0].IsTruckFull = false;
						}
					} else if ($rootScope.IsSelfCollect) {
						currentOrder[0].IsTruckFull = true;
					}
				}
				else {
					currentOrder[0].IsTruckFull = true;
				}
			}
		}
		else {
			if ($rootScope.TruckSizeId == 0) {
				if ($rootScope.DeliveryLocationId == 0 && $rootScope.IsSelfCollect === true) {
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectDeliveryLocation), 'error', 8000);
				}
				else {
					//$rootScope.ValidationErrorAlert('Please seletect one of the truck sizes before you proceed further with your order.', 'error', 3000);
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectTruckSize), 'error', 8000);
				}
			}
			else if ($rootScope.DeliveryLocationId == 0) {
				//$rootScope.ValidationErrorAlert('Please seletect one of the delivery locations before you proceed further with your order.', 'error', 3000);
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectDeliveryLocation), 'error', 8000);
			}
			else {
				//$rootScope.ValidationErrorAlert('Please select delivery location or truck.', 'error', 3000);
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectTruckAndDeliveryLocation), 'error', 8000);
			}
		}
	}

	$scope.AddWoodenPallet = function () {
		var currentOrder = $scope.OrderData.filter(function (el) { return parseInt(el.OrderId) === parseInt($scope.EditEnquiryId); });
		if (currentOrder.length > 0) {
			var qty = currentOrder[0].NumberOfPalettes;

			var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemCode === $scope.WoodenPalletCode; });
			var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode & parseInt(el.GratisOrderId) === 0; });

			if (productNameStrupdate.length > 0) {
				var qty = productNameStrupdate[0].ProductQuantity;
				productNameStrupdate[0].ProductQuantity = parseInt(qty);
			}
			else {
				var products = {
					EnquiryProductGUID: generateGUID(),
					OrderGUID: $scope.CurrentOrderGuid,
					OrderProductId: 0,
					Allocation: 0,
					ItemId: productNameStr[0].ItemId,
					ParentItemId: 0,
					ParentProductCode: '',
					GratisOrderId: 0,
					ItemName: productNameStr[0].ItemName,
					ProductCode: productNameStr[0].ItemCode,
					NumberOfExtraPalettes: 0,
					PrimaryUnitOfMeasure: productNameStr[0].UOM,
					ProductQuantity: qty,
					ItemPricesPerUnit: 0,
					DepositeAmountPerUnit: 0,
					ItemTotalDepositeAmount: 0,
					ItemPrices: 0,
					ConversionFactor: 0,
					ProductType: productNameStr[0].ProductType,
					ActualAllocation: 'NA',
					WeightPerUnit: 0,
					ItemType: 0,
					ItemTaxPerUnit: 0,
					IsItemLayerAllow: false,
					IsActive: "1"
				}
				currentOrder[0].OrderProductList.push(products);

			}
		}
	}

	$scope.CheckBeforeAddingPromationItem = function (itemCode, itemId, qty, ItemType, productNameStr, enquiryProductGuid, GratisOrderId, noOfExtraPalettes, productNameStrupdate) {

		var totalWeightWithPalettes = 0;
		var chkvalid = true;
		var currentOrder = $scope.OrderData.filter(function (el) { return parseInt(el.OrderId) === parseInt($scope.EditEnquiryId); });
		if (currentOrder.length > 0) {
			if (!$scope.IsItemEdit) {
				enquiryProductGuid = '';
			}

			var promotionItem = $rootScope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
			for (var i = 0; i < promotionItem.length; i++) {
				var ItemQuanity = promotionItem[i].ItemQuanity;
				var FocItemId = promotionItem[i].FocItemId;
				var FocItemQuantity = promotionItem[i].FocItemQuantity;
				if ((parseInt(qty) % parseFloat(ItemQuanity)) === 0) {
					var totalNumberCanOrderFocItem = (parseInt(qty) / parseFloat(ItemQuanity));
					var totalAmountOfQty = parseInt(FocItemQuantity) * totalNumberCanOrderFocItem;
					qty = qty + totalAmountOfQty;
				}
			}

			var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
			var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
			var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, noOfExtraPalettes, ItemType, enquiryProductGuid);
			var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
			if (bufferWeight !== "") {
				totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
			}
			var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);
			var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
			if (weightPerPalettes !== "") {
				if ($rootScope.IsPalettesRequired) {
					totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
				}
				totalWeight = totalWeight + totalWeightWithPalettes
			}
			truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);

			var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
			var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

			if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect && $scope.IsWeightLoadCheckValidation === true) {
				//$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
				if (productNameStrupdate.length > 0) {
					productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
				}
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);

				chkvalid = false;
			} else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect && $scope.IsPalletLoadCheckValidation === true) {
				var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
				//$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);
				if (productNameStrupdate.length > 0) {
					productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
				}
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);

				chkvalid = false;
			}
		}
		return chkvalid;
	}

	//16.a) Calculate Total Weight.
	$scope.getTotalAmount = function (weight, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {

		var total = 0;
		if (currentOrder.length > 0) {
			for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
				if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode && currentOrder[0].OrderProductList[i].IsPackingItem === "0" && currentOrder[0].OrderProductList[i].ItemType !== "37") {
					total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
				}
			}
			total += parseFloat(weight) * parseFloat(quantity);
		}
		return total;
	}

	//16.b) Calculate Total Pallets.
	$scope.getTotalPalettes = function (palettes, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {

		var total = 0;
		for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
			if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode && currentOrder[0].OrderProductList[i].IsPackingItem === "0" && currentOrder[0].OrderProductList[i].ItemType !== "37") {
				total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
			}
		}
		if (parseFloat(quantity) > 0) {
			total += parseFloat(quantity) / parseFloat(palettes);
		}
		if ($rootScope.TruckCapacityPalettes == 0) {
			total = 0;
		}
		if (!$rootScope.IsPalettesRequired) {
			total = 0;
		}
		return total;
	}

	//16.c) Calculate Extra Pallets.
	$scope.getTotalExtraPalettes = function (palettes, quantity, currentOrder, itemId, NumberOfExtraPalettes, ItemType, enquiryProductGuid) {

		var total = 0;
		for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
			if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode && currentOrder[0].OrderProductList[i].IsPackingItem === "0" && currentOrder[0].OrderProductList[i].NumberOfExtraPalettes > 0 && currentOrder[0].OrderProductList[i].ItemType !== "37") {
				var totalPalets = parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
				total += (totalPalets / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
			}
		}
		if (NumberOfExtraPalettes > 0) {
			if (parseFloat(quantity) > 0) {
				var totalPalets = parseFloat(quantity) / parseFloat(palettes);
				total += (totalPalets / NumberOfExtraPalettes);
			}
		}
		if ($rootScope.TruckCapacityPalettes == 0) {
			total = -1;
		}
		if (!$rootScope.IsPalettesRequired) {
			total = 0;
		}
		return total;
	}

	//16.d) Add Extra Pallets.
	$scope.AddExtraPalleter = function (currentOrder, enquiryProductGuid, ConversionFactor, qty, PrimaryUnitOfMeasure) {

		var TotalPalettes = 0;
		if (currentOrder.length > 0) {
			var newArr = [];
			var productList = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode && el.PrimaryUnitOfMeasure !== "Keg" && el.IsPackingItem === "0" && parseInt(el.ItemType) !== parseInt("37") && el.EnquiryProductGUID !== enquiryProductGuid; });
			$.each(productList, function (index, element) {
				if (newArr[element.PrimaryUnitOfMeasure] == undefined) {
					newArr[element.PrimaryUnitOfMeasure] = 0;
				}
				newArr[element.PrimaryUnitOfMeasure] += parseFloat(element.ProductQuantity) / parseFloat(element.ConversionFactor);
			});
			if (PrimaryUnitOfMeasure !== '' && PrimaryUnitOfMeasure !== undefined) {
				if (newArr[PrimaryUnitOfMeasure] == undefined) {
					newArr[PrimaryUnitOfMeasure] = 0;
				}
				newArr[PrimaryUnitOfMeasure] += parseFloat(qty) / parseFloat(ConversionFactor);
			}
			for (var name in newArr) {

				var value = newArr[name];
				newArr[name] = Math.ceil(value);
				TotalPalettes += Math.ceil(value);
			}
		}
		return TotalPalettes;
	}

	$scope.GetPendingAllocation = function (Allocation, quantity, currentOrder, itemId, ItemList) {

		var total = 0;
		var productNameStrupdate = [];
		for (var i = 0; i < currentOrder.length; i++) {
			if (ItemList != undefined) {
				if ($scope.IsItemEdit) {
					productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return el.ItemId !== itemId && ItemList.indexOf(el.ProductCode) > -1 && el.ItemType == 32; });
				}
				else {
					productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return ItemList.indexOf(el.ProductCode) > -1 && el.ItemType == 32; });
				}
			}
			else {
				productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return el.ItemId === itemId && el.ItemType == 32; });
			}

			if (productNameStrupdate.length > 0) {
				for (var j = 0; j < productNameStrupdate.length; j++) {
					total += parseFloat(productNameStrupdate[j].ProductQuantity);
				}
			}
		}

		return total;
	}

	$rootScope.TruckExtraBufferWeight = function () {

		var extraTruckBufferWeight = 0;
		if ($scope.TruckExceedBufferWeight != 0 && $scope.TruckExceedBufferWeight != "0") {
			extraTruckBufferWeight = parseFloat($rootScope.TruckCapacity * (parseFloat($scope.TruckExceedBufferWeight) / 100));
		}
		return extraTruckBufferWeight;
	}

	$rootScope.TruckExtraBufferPallet = function () {


		var extraPaletteBufferWeight = 0;
		if ($scope.PalettesExceedBufferWeight != 0 && $scope.PalettesExceedBufferWeight != "0") {
			extraPaletteBufferWeight = parseFloat($scope.PalettesExceedBufferWeight);
		}
		return extraPaletteBufferWeight;
	}
	$scope.CheckAllocation = function (Allocation, quantity, currentOrder, itemId) {

		var allowAllocatio = false;
		var total = 0;
		total += parseFloat(quantity);
		if (Allocation >= total) {
			allowAllocatio = true;
		}

		if (Allocation == 'NA') {
			allowAllocatio = true;
		}

		return allowAllocatio;
	}

	$scope.ReloadGraph = function (currentOrder, removeKegPalettes) {

		if (!$rootScope.IsSelfCollect) {
			console.log('Reload Graph');

			var totalWeightWithPalettes = 0;
			var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
			var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');
			var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
			var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, '', 0, 0, '');
			var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
			if (weightPerPalettes !== "") {
				if ($rootScope.IsPalettesRequired) {
					totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes - removeKegPalettes));
				}
				totalWeight = totalWeight + totalWeightWithPalettes
			}

			var truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);
			$scope.PalettesCorrectWeight = truckTotalPalettes;
			currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(totalNumberOfPalettes));
			currentOrder[0].TruckWeight = (totalWeight / 1000);
			currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
			$rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
			$rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);
			angular.forEach($rootScope.buindingPalettes, function (item, key) {
				item.PalettesWidth = 0;
			});


			if ($rootScope.IsPalettesRequired) {
				for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
					if (i < parseInt($rootScope.buindingPalettes.length)) {
						$rootScope.buindingPalettes[i].PalettesWidth = 100;
					}
				}
			}
			$scope.CalculateDeliveryUsedCapacity();
			if ($rootScope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
				var otherItem = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode });
				if (otherItem.length > 0) {
					$scope.AddWoodenPallet();
				}
			}
		}
		//$scope.LoadEnquiryAmountDetails(currentOrder[0].OrderProductList);
		$rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);
	}

	$scope.CalculateDeliveryUsedCapacity = function () {

		console.log('CalculateDeliveryUsedCapacity');
		var tempNumberOfPalettes = 0;
		for (var i = 0; i < $scope.OrderData.length; i++) {
			tempNumberOfPalettes += $scope.OrderData[i].NumberOfPalettes;
		}
		$scope.tempDeliveryUsedCapacity = tempNumberOfPalettes;
		var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === $scope.EditEnquiryId; });
		if (($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity) > $rootScope.DeliveryLocationCapacity) {
			var usedPalettesCapacity = parseInt($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity);
			if (currentOrder.length > 0) {
				currentOrder[0].IsRecievingLocationCapacityExceed = true;
				if (currentOrder[0].OrderProductList.length === 0) {
					$rootScope.ValidationErrorReceivingLocation = String.format($rootScope.res_CreateInquiryPage_CapacityFullyConsumed);
				}
				else {
					$rootScope.ValidationErrorReceivingLocation = 'The receiving capacity for the delivery location is only ' + parseInt($rootScope.DeliveryLocationCapacity) + ' pallets while you are trying order ' + usedPalettesCapacity + ' paletts. Please modify you order and try again.';
				}
			}
		}
		else {
			if (currentOrder.length > 0) {
				currentOrder[0].IsRecievingLocationCapacityExceed = false;
			}
		}
	}

	$scope.AddPromationItem = function (itemCode, ItemId, qty, ItemType) {

		var addPromation = false;
		if (parseInt(ItemType) !== 31 && parseInt(ItemType) !== 30) {
			var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === $scope.EditEnquiryId; });
			if (currentOrder.length > 0) {
				var promotionItem = $rootScope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
				if (promotionItem.length === 0) {
					$scope.Allocation = 'NA';
					$scope.ActualAllocation = 'NA';
				}
				for (var i = 0; i < promotionItem.length; i++) {
					var ItemQuanity = promotionItem[i].ItemQuanity;
					var FocItemId = promotionItem[i].FocItemId;
					var FocItemQuantity = promotionItem[i].FocItemQuantity;
					if ((parseInt(qty) % parseFloat(ItemQuanity)) === 0) {
						addPromation = true;
						var totalNumberCanOrderFocItem = (parseInt(qty) / parseFloat(ItemQuanity));
						var totalAmountOfQty = parseInt(FocItemQuantity) * totalNumberCanOrderFocItem;

						//$scope.addProducts(FocItemId, totalAmountOfQty, 0, 31, ItemId, itemCode, 0);
						$scope.CheckingExtraPalettesBeforeAddingItem(FocItemId, totalAmountOfQty, 0, 31, ItemId, itemCode);
						if ($scope.ActiveCompanyType == 26) {
							$scope.IsPromotion = true;
						}
						else {
							$scope.IsPromotion = false;
						}
						$scope.Allocation = 'NA';
						$scope.ActualAllocation = 'NA';
						break;
					}
					else {
						$scope.RemovePromotionItem(currentOrder, ItemId);
						$scope.Allocation = 'NA';
						$scope.ActualAllocation = 'NA';
					}
				}
			}
			else {
				$scope.Allocation = 'NA';
				$scope.ActualAllocation = 'NA';
			}
		}
		return addPromation;
	}

	$scope.CheckWetherTruckIsFull = function (currentOrder, totalWeightWithBuffer, truckSize, palettesWeight, totalWeightWithPalettes, ItemType) {

		var isFull = false;
		if ($scope.IsPalletLoadCheckValidation === true || $scope.IsWeightLoadCheckValidation === true) {
			var totalpalettesWeight = 0;
			for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
				if (currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
					totalpalettesWeight += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
				}
			}
			var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
			$scope.PalettesCorrectWeight = parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes);
			totalpalettesWeight = Math.ceil(parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes));
			var totaltruckWeight = 0;
			for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
				totaltruckWeight += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
			}
			var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, '', 0, 0, '');
			var totalWeightWithPalettes = 0;
			var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'string');
			if (weightPerPalettes !== "") {
				if ($rootScope.IsPalettesRequired) {
					totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes));
				}
				totaltruckWeight = totaltruckWeight + totalWeightWithPalettes;
			}

			var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
			var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

			$scope.ReloadGraph(currentOrder, 0);
			if ($rootScope.IsPalettesRequired) {

				var pallet = between(parseFloat($scope.PalettesCorrectWeight), (parseFloat(palettesWeight) - parseFloat($scope.PalettesBufferWeight)), parseFloat(parseFloat(palettesWeight) + parseFloat(extraPaletteBufferWeight)));
				if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight)) || pallet) {
					isFull = true;
				}
			}
			else {
				if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight))) {
					isFull = true;
				}
			}
		} else {
			isFull = true;
		}

		return isFull;
	}

	$scope.RemovePromotionItem = function (currentOrder, ParentItemId) {

		if (currentOrder.length > 0) {
			$scope.findAndRemove(currentOrder[0].OrderProductList, 'ItemId', ParentItemId, 'EnquiryProductId');
			if (currentOrder[0].OrderProductList.length === 1) {
				if (currentOrder[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
					currentOrder[0].OrderProductList = [];
				}
			}
		}
	}

	$scope.findAndRemove = function (array, property, value, primaryId) {
		for (i = 0; i < array.length; ++i) {
			if (array[i][property] === value) {
				if (array[i][primaryId] === 0) {
					array.splice(i--, 1);
				}
				else {
					array.splice(i--, 1);
				}
			}
		}
	};

	$scope.CheckForNewQty = function (itemId, ItemType, qty, productNameStr, numberOfExtraPallets) {

		var QtyArraynew = [];
		var truckfullintonr = $rootScope.TruckCapacityFullInTone;
		var palletsCorrcerwght = $scope.PalettesCorrectWeight;
		var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
		var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();
		var palettesWeight = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
		var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === $rootScope.EditedEnquiryId; });
		var editedItemQuantity = 0;

		if ($scope.IsItemEdit) {
			var item = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemId) === parseInt(itemId); });
			if (item.length > 0) {
				editedItemQuantity = item[0].ProductQuantity;
			} else {
				editedItemQuantity = 0;
			}
		}

		var avlPalletQty = 0;
		var pendingweight = 0;
		if (numberOfExtraPallets > 0) {
			//avlPalletQty = (((parseFloat(numbersofpalettes) * $scope.NumberOfExtraPalettes) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor)));
			avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor))) * numberOfExtraPallets;
		}
		else {
			avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * parseFloat(productNameStr[0].ConversionFactor));
		}

		var avlPallet = parseInt($scope.TruckCapacityPalettes) - (Math.ceil(palletsCorrcerwght));

		//var checkKegQtyOnePallets = parseFloat(productNameStr[0].ConversionFactor) * 2;
		//var checkKegWeightPerPallet = (parseFloat(checkKegQtyOnePallets) * parseFloat(productNameStr[0].WeightPerUnit)) + (palettesWeight * 2);



		var avlPalletWeight = (palettesWeight * (Math.ceil(avlPallet)));

		//var avlPalletBufferWeight = (palettesWeight * parseFloat(extraPaletteBufferWeight));
		//avlPalletWeight = avlPalletWeight - avlPalletBufferWeight;
		if (numberOfExtraPallets > 0) {
			//only for Keg
			pendingweight = ((parseFloat($scope.TruckCapacity)) - (parseFloat(truckfullintonr * 1000) + parseFloat(avlPalletWeight * numberOfExtraPallets)));
		}
		else {
			pendingweight = ((parseFloat($scope.TruckCapacity)) - (parseFloat(truckfullintonr * 1000) + parseFloat(avlPalletWeight)));
		}

		var avlWeightQty = parseFloat(parseFloat(pendingweight) + parseFloat(extraTruckBufferWeight)) / parseFloat(productNameStr[0].WeightPerUnit);
		QtyArraynew.push(parseInt(avlWeightQty));
		QtyArraynew.push(parseInt(avlPalletQty));

		var min = Math.min.apply(Math, QtyArraynew);

		min = parseInt(min) + parseInt(editedItemQuantity);

		if (parseInt(productNameStr[0].QtyPerLayer) > 0) {
			var g = parseInt((parseInt(min) / parseInt(productNameStr[0].QtyPerLayer)));
			$scope.IsItemLayerCheckQty = parseInt(g) * parseInt(productNameStr[0].QtyPerLayer);
			if ($scope.IsItemLayerCheckQty > $scope.CheckAllocatonPresent) {
				var validQty = $scope.Allocation;
			}
			else {
				var validQty = $scope.IsItemLayerCheckQty;
			}
		}
		else {
			if ($scope.CheckAllocatonPresent != 'NA') {
				if (min > $scope.Allocation) {
					var validQty = $scope.Allocation;
				}
				else {
					var validQty = min;
				}
			}
			else {
				var validQty = min;
			}
		}

		return validQty;
	}

	//#endregion

	//#region Add Product

	$scope.EnableAddItem = false;
	$scope.ItemField =
	{
		itemId: 0,
		inputItemsQty: 0
	};

	$scope.EnableAddItemSection = function () {

		$scope.ClearItemData();
		$scope.EnableAddItem = true;
	}

	$scope.predicates = {
		InputItem: '',
		FilterAutoCompletebox: ''
	};
	$scope.MaxPermissibleQuantity = 0;
	$scope.selectedRow = -1;
	$scope.showItembox = false;
	$rootScope.foundResult = false;

	$scope.ItemSearchInputDefaultSetting = function () {
		$scope.SearchControl = {
			InputItem: '',
			FilterAutoCompletebox: ''
		};
		$scope.selectedRow = -1;
		$scope.showItembox = false;
		$rootScope.foundResult = false;
	}
	$scope.ItemSearchInputDefaultSetting();
	$scope.ItemInputSelecteChangeEvent = function (input) {

		if (input.length > 0) {



			if (input.length >= 4) {
				$rootScope.Throbber.Visible = true;


				$scope.LoadItemListByCompany();
			} else {
				$scope.bindallproduct = [];
			}
			$scope.showItembox = true;
			$scope.selectedRow = 0;
		} else {
			$scope.showItembox = false;
			$scope.selectedRow = -1;
		}
		$scope.SearchControl.FilterAutoCompletebox = input;
	}
	$scope.ClearItemInputSearchbox = function () {

		$scope.Allocation = 'NA';
		$scope.showItembox = false;
		$scope.ClearItemRecord();
	}

	$scope.ClearItemData = function () {
		$scope.showItembox = false;
		$scope.Allocation = 'NA';
		$scope.ItemField.itemsName = "";
		$scope.ItemField.inputItemsQty = "";
		$scope.ItemField.itemId = "";
		$scope.selectedRow = -1;
		$scope.SearchControl.InputItem = "";
		$scope.SearchControl.FilterAutoCompletebox = "";
		$scope.EnquiryProductGUID = "";
		$scope.disableInput = false;
		$scope.ItemPrices = 0;
		$scope.ItemDepositeAmount = 0;
		$scope.UOM = '-';
		$scope.MaxPermissibleQuantity = '-';
		$scope.IsItemEdit = false;
		$scope.IsItemLayerAllow = false;
	}

	$scope.ClearItemRecord = function () {
		$scope.EnableAddItem = false;
		$scope.ClearItemData();
		$scope.CalculateDeliveryUsedCapacity();
		focus('ItemListAutoCompleteBox_value');
	}

	$scope.RemoveInputFocus = function () {

		focus('setfocusoninput');
	}
	//#endregion

	//#region Cost

	$ionicModal.fromTemplateUrl('AssignTransporter.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.AssignTransporterPopup = modal;
	});

	$scope.CloseAssignTransporterPopup = function () {
		$scope.AssignTransporterPopup.hide();
	};

	$scope.OpenAssignTransporterPopup = function () {
		$scope.AssignTransporterPopup.show();
	};

	$scope.LoadAllTransporter = function () {


		$rootScope.Throbber.Visible = true;
		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== 999; });
		if (enquiryDetails.length > 0) {

			var checkSelfCollectOrderExist = enquiryDetails.filter(function (el) { return el.IsSelfCollect === '1' });

			if (checkSelfCollectOrderExist.length > 0 && $scope.TransporterAssingForSelfCollect === 0) {

				$rootScope.Throbber.Visible = false;
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_TransporterCannotAssingForSelfCollectOrders), 'error', 3000);

			}
			else {
				if ($scope.IsShowAllTransporterForUpdate === false) {
					var companyName = enquiryDetails[0].CompanyName;
					var CheckDifferentCompany = enquiryDetails.filter(function (el) { return el.CompanyName !== companyName; });
					if (CheckDifferentCompany.length > 0) {
						$rootScope.Throbber.Visible = false;
						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_DifferentCompany), 'error', 3000);
						return false;
					} else {
						$scope.LoadTransporterByCompanyId(enquiryDetails[0].SoldTo);
					}
				} else {
					$scope.LoadTransporterByCompanyId(0);
				}
			}
		} else {
			$rootScope.Throbber.Visible = false;
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
		}
	}

	$scope.LoadTransporterByCompanyId = function (companyId) {
		var requestData =
		{
			ServicesAction: 'GetAllTransporterListByCompanyId',
			CompanyId: companyId
		};

		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {
			var resoponsedata = response.data;
			$scope.TransporterList = resoponsedata.Transporter.TransporterList;

			$scope.OpenAssignTransporterPopup();
			$rootScope.Throbber.Visible = false;
		});
	}

	$ionicModal.fromTemplateUrl('TripCostConfirm.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.TripCostConfirmPopup = modal;
	});

	$scope.CloseTripCostConfirmPopup = function () {
		$scope.TripCostConfirmPopup.hide();
	};

	$scope.OpenTripCostConfirmPopup = function () {
		$scope.TripCostConfirmPopup.show();
	};

	$scope.ConfirmTripCost = function () {
		$scope.CloseTripCostConfirmPopup();
		$scope.AssignTripCostPopup.show();
	};

	$ionicModal.fromTemplateUrl('AssignTripCost.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.AssignTripCostPopup = modal;
	});

	$scope.CloseAssignTripCostPopup = function () {

		$scope.AssignTripCostPopup.hide();
		$scope.Cost.Revenue = 0;
		$scope.Cost.TripCost = 0;
	};

	$scope.OpenAssignTripCostPopup = function () {
		$scope.TripCostAssingOrders = []

		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
		if (enquiryDetails.length > 0) {
			$scope.TripCostAssingOrders = enquiryDetails.filter(function (el) { return parseFloat(el.TripCost) > 0 || parseFloat(el.TripRevenue) > 0; });

			if ($scope.TripCostAssingOrders.length > 0) {
				$scope.OpenTripCostConfirmPopup();
			}
			else {
				$scope.AssignTripCostPopup.show();
			}
		}
		else {
			$rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
		}
	};

	//#endregion

	//#region truck full message

	$ionicModal.fromTemplateUrl('AddTruck.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.AddTruckControl = modal;
	});
	$scope.CloseAddTruckControl = function () {
		focus('RemoveEnterEvent');
		$scope.AddTruckControl.hide();
	};
	$scope.OpenAddTruckControl = function () {
		focus('AddEnterEvent');
		var dd = $scope.AddTruckControl;
		if (!dd._isShown) {
			$scope.AddTruckControl.show();
		}
	};

	$scope.CloseAddFinalize = function () {

		var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === $rootScope.EditedEnquiryId; });
		if (currentOrder.length > 0) {
			currentOrder[0].IsTruckFull = true;
		}
		$scope.AddTruckControl.hide();
	}

	$scope.ClearItem = function () {

		$scope.ClearItemRecord();
	}

	//#endregion

	$scope.CloseEnquiryDetailAccordion = function () {

		if ($scope.CurrentOpenMasterDetailsObject !== "") {
			$scope.CurrentOpenMasterDetailsObject.component.collapseRow($rootScope.PreviousExpandedRow);
			$scope.IsEnquiryEdit = false;
			$scope.EnableAddItem = false;
			$scope.ClearItemData();
		}
	}

	$scope.AdvanceEdit = function (OrderGUID) {

		$rootScope.EditEnquiry = true;

		if ($rootScope.RoleName === "CustomerService") {
			$rootScope.IsEnquiryEditedByCustomerService = true;

			var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
			if (currentOrder.length > 0) {
				$rootScope.TempCompanyId = currentOrder[0].CustomerId;
				$rootScope.TempCompanyMnemonic = $rootScope.CompanyMnemonic;
				$rootScope.BranchPlantCodeEdit = currentOrder[0].BranchPlantCode;
			}
		} else {
			$rootScope.IsEnquiryEditedByCustomerService = false;
		}

		if ($scope.OrderData[0].EnquiryId != undefined && $scope.OrderData[0].EnquiryId != 0 && $scope.OrderData[0].EnquiryId != "0") {
			$rootScope.SavedEditEnquiry = true;
		} else {
			$rootScope.SavedEditEnquiry = false;
		}

		$rootScope.isEnquiryEdit = true;
		$rootScope.CurrentOrderGuid = OrderGUID;
		$rootScope.TemOrderData = $scope.OrderData;
		$state.go("CreateInquiryPage");
	}



	$rootScope.CloseMiscDeleteConfirmation = function () {
		$scope.DeleteWarningMessageControl.hide();
	};


	$scope.Delete_DeleteMisc = function (paymentRequestId, slabId, slabName) {

		$scope.SelectedId_paymentRequestId = paymentRequestId;
		$scope.SelectedId_slabId = slabId;
		$scope.SelectedId_slabName = slabName;
		$scope.DeleteWarningMessageControl.show();
	}

	$rootScope.DeleteMiscYes = function () {

		var requestData =
		{
			ServicesAction: 'DeleteMiscellaneousByPaymentRequestId',
			PaymentRequestId: $scope.SelectedId_paymentRequestId,
			SlabId: $scope.SelectedId_slabId,
			SlabName: $scope.SelectedId_slabName,
		};

		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {
			$rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
			$rootScope.CloseMiscDeleteConfirmation();
			$rootScope.PaymentRequestByOrder($scope.DeleteMiscCarrierNumber, $scope.DeleteMiscOrderId, $scope.DeleteMiscSalesOrderNumber, "");
		});
	};




	$scope.UpdateOrderCollected = function () {

		var orderlist = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.IsCompleted !== '1'; });
		if (orderlist.length > 0) {


			var requestData =
			{
				ServicesAction: 'UpdateOrderCollected',
				OrderList: orderlist
			};
			// var stringfyjson = JSON.stringify(requestData);
			var consolidateApiParamater =
			{
				Json: requestData,
			};

			GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {



				if (response.data.Json.IsUpdated == "1") {

					$scope.RefreshDataGrid();
					$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
				} else {


					$rootScope.ValidationErrorAlert('Please assgin transport.', '', 3000);
				}


			});
		}
		else {
			$rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
		}
	}




	$scope.UpdateOrderDelivered = function () {

		var orderlist = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.IsCompleted !== '1'; });
		if (orderlist.length > 0) {


			var requestData =
			{
				ServicesAction: 'UpdateOrderDelivered',
				OrderList: orderlist
			};
			// var stringfyjson = JSON.stringify(requestData);
			var consolidateApiParamater =
			{
				Json: requestData,
			};

			GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {




				if (response.data.Json.IsUpdated == "1") {

					$scope.RefreshDataGrid();
					$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
				} else {


					$rootScope.ValidationErrorAlert('Please assgin transport.', '', 3000);
				}
			});
		}
		else {
			$rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
		}
	}



	// View RPM Functionality
	$scope.ViewReturnPakageMaterialListData = [];
	$ionicModal.fromTemplateUrl('templates/ShowRPMQuantity.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.ViewRPMQuantitypopup = modal;
	});
	$scope.ShowRPMItemCollection = function () {

		$scope.ViewRPMQuantitypopup.show();
	}
	$scope.CloseViewRPMQuantitypopup = function () {

		$scope.ViewRPMQuantitypopup.hide();
	}


	$scope.OpenModelPoppupRPM = function (enquiryId) {

		debugger;
		var requestData =
		{
			ServicesAction: 'GetRPMByEnquiryId',
			EnquiryId: enquiryId
		};
		var consolidateApiParamater =
		{
			Json: requestData,
		};

		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (NotesResponse) {

			var NotesResponsedata = NotesResponse.data;

			if (NotesResponsedata.Json !== undefined) {
				$scope.ShowRPMItemCollection();
				var notesData = NotesResponsedata.Json.ReturnPakageMaterialList;
				$scope.ViewReturnPakageMaterialListData = notesData;
			}
			else {
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_NoRecordFoundRPM), 'error', 3000);
			}
		});
	}



	$scope.UpdateOrderDeployed = function () {

		var orderlist = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.IsCompleted !== '1'; });
		if (orderlist.length > 0) {


			var requestData =
			{
				ServicesAction: 'UpdateOrderDeployed',
				OrderList: orderlist
			};
			// var stringfyjson = JSON.stringify(requestData);
			var consolidateApiParamater =
			{
				Json: requestData,
			};

			GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {




				if (response.data.Json.IsUpdated == "1") {

					$scope.RefreshDataGrid();
					$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
				} else {


					$rootScope.ValidationErrorAlert('Please assgin transport.', '', 3000);
				}
			});
		}
		else {
			$rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
		}
	}

	$scope.DateField = {
		PlannedCollectionDate: ''

	}

	$scope.InitializeDatePicker = function () {



		$('.paymentDate').each(function () {


			$(this).datetimepicker({

				onSelect: function (dateText, inst) {



					if (inst.id != undefined) {
						angular.element($('#' + inst.id)).triggerHandler('input');
					} else {
						angular.element($('#' + inst.inst.id)).triggerHandler('input');
					}

					$scope.DateField.PlannedCollectionDate = dateText;


				},
				dateFormat: 'dd/mm/yy',
				prevText: '<i class="fa fa-angle-left"></i>',
				nextText: '<i class="fa fa-angle-right"></i>'
			});
		});


	}

	$scope.InitializeDeliveryDatePicker = function () {

		var startDate;
		if ($scope.DateField.PlannedCollectionDate !== "" && $scope.DateField.PlannedCollectionDate !== undefined) {
			var date1 = $scope.DateField.PlannedCollectionDate.split(' ');
			startDate = date1[0].split('/');
			if (date1.length > 1) {
				startDate = startDate[1] + "/" + startDate[0] + "/" + startDate[2] + " " + date1[1];
			}
			else {
				startDate = startDate[1] + "/" + startDate[0] + "/" + startDate[2];
			}

			var date = new Date(startDate);
			startDate = date;
		} else {
			var date = new Date();
			startDate = date;
		}


		$('.paymentDeliveryDate').each(function () {


			$(this).datetimepicker({

				onSelect: function (dateText, inst) {



					if (inst.id != undefined) {
						angular.element($('#' + inst.id)).triggerHandler('input');
					} else {
						angular.element($('#' + inst.inst.id)).triggerHandler('input');
					}


				},
				dateFormat: 'dd/mm/yy',
				prevText: '<i class="fa fa-angle-left"></i>',
				nextText: '<i class="fa fa-angle-right"></i>'
			});
		});


	}

	$scope.InitializeDatePicker();

	$scope.InitializeDeliveryDatePicker();


	// Product Multiselect Autocomplete box.

	$scope.MultiSelectDropdownSetting = {
		scrollable: true,
		scrollableHeight: '400px',
		enableSearch: true
	}


	$scope.AreaMultiSelectDropdownSetting = {
		scrollable: true,
		scrollableHeight: '400px',
		enableSearch: true
	}

	$scope.LoadProducts = function () {
		var requestData =
		{
			ServicesAction: 'LoadAllProducts',
			CompanyId: $rootScope.CompanyId
		};

		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {

			var resoponsedata = response.data;
			$scope.ProductList = resoponsedata.Item.ItemList;
		});
	}

	$scope.LoadProducts();

	$scope.SearchEnquiryByProductName = function () {


		$scope.ProductCodes = '';
		if ($scope.ProductSelectedList.length > 0 || $scope.AreaSelectedList.length > 0 || $scope.BranchPlantCodeSelectedList.length > 0 || $scope.CarrierCodeSelectedList.length > 0 || $scope.TruckSizeSelectedList.length > 0) {

			$scope.ProductCodes = "";
			for (var i = 0; i < $scope.ProductSelectedList.length; i++) {
				$scope.ProductCodes = $scope.ProductCodes + "," + $scope.ProductSelectedList[i].Id;
			}

			if ($scope.ProductSelectedList.length > 0) {
				$scope.ProductCodes = $scope.ProductCodes.substr(1);
			}

			$scope.Areas = "";
			for (var i = 0; i < $scope.AreaSelectedList.length; i++) {
				$scope.Areas = $scope.Areas + "," + "'" + $scope.AreaSelectedList[i].Id + "'";
			}

			if ($scope.AreaSelectedList.length > 0) {
				$scope.Areas = $scope.Areas.substr(1);
			}

			$scope.BranchPlantCodes = "";
			for (var i = 0; i < $scope.BranchPlantCodeSelectedList.length; i++) {
				$scope.BranchPlantCodes = $scope.BranchPlantCodes + "," + "'" + $scope.BranchPlantCodeSelectedList[i].Id + "'";
			}

			if ($scope.BranchPlantCodeSelectedList.length > 0) {
				$scope.BranchPlantCodes = $scope.BranchPlantCodes.substr(1);
			}

			$scope.CarrierCodes = "";
			for (var i = 0; i < $scope.CarrierCodeSelectedList.length; i++) {
				$scope.CarrierCodes = $scope.CarrierCodes + "," + "'" + $scope.CarrierCodeSelectedList[i].Id + "'";
			}

			if ($scope.CarrierCodeSelectedList.length > 0) {
				$scope.CarrierCodes = $scope.CarrierCodes.substr(1);
			}

			$scope.TruckSizes = "";
			for (var i = 0; i < $scope.TruckSizeSelectedList.length; i++) {
				$scope.TruckSizes = $scope.TruckSizes + "," + "'" + $scope.TruckSizeSelectedList[i].Id + "'";
			}

			if ($scope.TruckSizeSelectedList.length > 0) {
				$scope.TruckSizes = $scope.TruckSizes.substr(1);
			}

			$scope.RefreshDataGrid();

		} else {

			$scope.RefreshDataGrid();
		}

	}

	$scope.ProductSearchCriteria = "";
	$scope.SearchEnquiryIncludeByProductName = function () {
		$scope.AreasSearchCriteria = "Include";
		$scope.BranchPlantCodesSearchCriteria = "Include";
		$scope.CarrierCodesSearchCriteria = "Include";
		$scope.TruckSizesSearchCriteria = "Include";
		$scope.ProductSearchCriteria = "Include";
		$scope.SearchEnquiryByProductName();
	}

	$scope.SearchEnquiryExcludeByProductName = function () {
		$scope.AreasSearchCriteria = "Exclude";
		$scope.BranchPlantCodesSearchCriteria = "Exclude";
		$scope.CarrierCodesSearchCriteria = "Exclude";
		$scope.TruckSizesSearchCriteria = "Exclude";
		$scope.ProductSearchCriteria = "Exclude";
		$scope.SearchEnquiryByProductName();
	}

	$scope.ClearProductSearch = function () {
		$scope.Areas = "";
		$scope.AreasSearchCriteria = "";
		$scope.BranchPlantCodes = "";
		$scope.BranchPlantCodesSearchCriteria = "";
		$scope.CarrierCodes = "";
		$scope.CarrierCodesSearchCriteria = "";
		$scope.TruckSizes = "";
		$scope.TruckSizesSearchCriteria = "";
		$scope.ProductSearchCriteria = "";
		$scope.ProductCodes = "";
		$scope.ProductSelectedList = [];
		$scope.AreaSelectedList = [];
		$scope.BranchPlantCodeSelectedList = [];
		$scope.CarrierCodeSelectedList = [];
		$scope.TruckSizeSelectedList = [];
		$scope.RefreshDataGrid();
	}

	$scope.TruckDriverAssingmentForSelfCollect = function (isSelfCollectOrder, orderStatus) {

		var returnVlaue = true;
		if (orderStatus === 'Delivered') {
			returnVlaue = false;
		} else {
			if ($scope.TruckAndDriverAssingForSelfCollect === 0) {
				if (isSelfCollectOrder === '1') {
					returnVlaue = false;
				}
			}
		}

		return returnVlaue;
	}

	$scope.OpenRequestedDatePicker = function () {


		focus('txtRequestedDate');

	}
	$('.customdate-picker').each(function () {

		$(this).datetimepicker({
			onSelect: function (dateText, inst) {

				angular.element($('#txtRequestedDate')).triggerHandler('input');

			},

			dateFormat: 'dd/mm/yy',
			numberofmonths: 1,
			isRTL: $('body').hasClass('rtl') ? true : false,
			prevtext: '<i class="fa fa-angle-left"></i>',
			nexttext: '<i class="fa fa-angle-right"></i>',
			showbuttonpanel: false,
			autoclose: true,

		});


	});



	$scope.LoadedOrderInTruckByOrderId = function (orderId) {
		var order = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderId; });
		if (order.length > 0) {
			var CheckOrderAssigned = $scope.SalesAdminApprovalList.filter(function (el) { return el.PlateNumber === order[0].PlateNumber && el.TruckInOrderId != 0; });
			if (CheckOrderAssigned.length == 0) {
				if (order[0].ProposedShift != null) {
					var SelectedOrder = [];
					var order = {
						TruckInDeatilsId: order[0].TruckInDeatilsId,
						OrderNumber: order[0].OrderNumber,
						PlateNumber: order[0].PlateNumber,
						StockLocationCode: "",
						IsLoadedInTruck: true
					}
					SelectedOrder.push(order);

					var requestData = {
						ServicesAction: 'SaveLoadedOrderInTruck',
						OrderList: SelectedOrder
					};

					var consolidateApiParamater =
					{
						Json: requestData,
					};

					$rootScope.Throbber.Visible = true;
					GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
						$rootScope.Throbber.Visible = false;
						$scope.RefreshDataGrid();
					});
				} else {
					$rootScope.ValidationErrorAlert(String.format("Pick Shift not Assigned!!"), '', 3000);
				}
			} else {
				$rootScope.ValidationErrorAlert(String.format("You cannot assgin this order because Plate Number " + order[0].PlateNumber + " is already assigned to other order"), '', 3000);
			}
		}
	}



	$scope.LoadedOrderInTruckByOrderIdold = function (orderId) {




		var order = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderId; });


		if (order.length > 0) {





			var CheckOrderAssigned = $scope.SalesAdminApprovalList.filter(function (el) { return el.PlateNumber === order[0].PlateNumber && el.TruckInOrderId != 0; });




			if (CheckOrderAssigned.length == 0) {


				var requestData = {
					ServicesAction: 'CallOrderWorkFlow',
					OrderList: order

				};

				var consolidateApiParamater =
				{
					Json: requestData,
				};


				$rootScope.Throbber.Visible = true;

				GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

					$rootScope.Throbber.Visible = false;

					$scope.RefreshDataGrid();

				});


			} else {



				$rootScope.ValidationErrorAlert(String.format("you can not assgin this order  beause  Plate Number " + order[0].PlateNumber + " is already assgined to other order"), '', 3000);

			}
		}



	}






	$scope.UnloadedOrderInTruckByOrderId = function (orderId) {





		var order = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderId; });


		if (order.length > 0) {


			var SelectedOrder = [];


			var order = {
				TruckInOrderId: order[0].TruckInOrderId

			}
			SelectedOrder.push(order);

			var requestData = {
				ServicesAction: 'UnloadedOrderInTruck',
				OrderList: SelectedOrder

			};

			var consolidateApiParamater =
			{
				Json: requestData,
			};


			$rootScope.Throbber.Visible = true;

			GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

				$rootScope.Throbber.Visible = false;



				$rootScope.ValidationErrorAlert(String.format("Unassign successfully"), '', 3000);

				$scope.RefreshDataGrid();

			});


		}



	}





	$scope.UpdateOrderReceived = function () {

		var orderlist = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.IsCompleted !== '1'; });
		if (orderlist.length > 0) {


			var requestData =
			{
				ServicesAction: 'CallOrderWorkFlow',
				OrderList: orderlist
			};
			// var stringfyjson = JSON.stringify(requestData);
			var consolidateApiParamater =
			{
				Json: requestData,
			};

			GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {



				$scope.RefreshDataGrid();
				$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);

			});
		}
		else {
			$rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
		}
	}



	$scope.ConfirmDelivery = function (OrderId) {
		debugger;
		//var orderId = $scope.GridData.data.filter(function (el) { return el.OrderId === OrderId; });


		var requestData =
		{
			ServicesAction: 'ConfirmDelivery',
			OrderId: OrderId,
			UserId: $rootScope.UserId
		};

		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderGridCust_RecordSaved), '', 3000);
			$scope.RefreshDataGrid();
		});

	}



	//#region Update Promised Date


	$scope.ChangePromisedDatePopupHtml = false;

	$scope.OpenChangePRomisedDatePopupList = function (enquiryDetails, eventName) {

		$rootScope.EnquiryDetailsForAction = enquiryDetails;
		$rootScope.ReasonCodeEventName = eventName;
		$scope.ChangePromisedDatePopupHtml = true;

		$scope.SelectedPromisedDate = {
			PromisedDateForSelected: ''

		}

		var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
		$scope.SelectedOrderCounts = orderDetails.length;

		$rootScope.ClearReasonCodeAddButton();

	}
	$scope.ClosExportExcelpopup = function () {


		$scope.SearchControl.InputPromisedDate = "";

		$scope.ChangePromisedDatePopupHtml = false;
		$rootScope.CloseReasoncodepopup();
	}

	$scope.CloseChangePRomisedDatePopup = function () {
		debugger;

		$scope.SearchControl.InputPromisedDate = "";

		$scope.SelectedPromisedDate = {
			PromisedDateForSelected: ''

		}

		$scope.ChangePromisedDatePopupHtml = false;

		$rootScope.ClearReasonCodeAddButton();
		$rootScope.CloseReasoncodepopup();
	}



	//#region Update Promised Date
	$ionicModal.fromTemplateUrl('templates/ChangeCollectionDate.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {
		$scope.ChangeCollectionDatePopup = modal;
	});

	$scope.OpenChangeCollectionDatePopup = function (enquiryDetails, eventName) {
		$rootScope.EnquiryDetailsForAction = enquiryDetails;
		$rootScope.ReasonCodeEventName = eventName;
		$scope.ChangeCollectionDatePopup.show();
		$rootScope.Throbber.Visible = false;
	}


	$scope.CloseChangeCollectionDatePopup = function () {

		$scope.SelectedBranchPlant.CollectionForSelectedEnquiry = "";
		if ($scope.SearchControl.InputCollectionDate !== undefined) {
			$scope.SearchControl.InputCollectionDate = "";
		}
		$scope.ChangeCollectionDatePopup.hide();
		$rootScope.CloseReasoncodepopup();
	}

	$scope.OpenChangePromisedDatePopup = function () {


		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
		if (enquiryDetails.length > 0) {
			$rootScope.LoadReasonCode("ChangePromisedDateReason");
			$scope.OpenChangePRomisedDatePopupList(enquiryDetails, "ChangedPromisedDate");
		}
		else {
			$rootScope.ValidationErrorAlert('Please select order.', 'error', 3000);
		}
	};


	//$scope.SavePromisedDateForSelectedEnquiry = function () {
	//
	//    if ($scope.SelectedPromisedDate.PromisedDateForSelected !== "") {
	//        $rootScope.Throbber.Visible = true;
	//        $scope.SelectedEnquiryId = "";
	//        var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
	//        if (orderDetails.length > 0) {
	//            var objectList = [];
	//
	//            for (var i = 0; i < orderDetails.length; i++) {
	//
	//
	//                var object = {};
	//                object.ObjectId = orderDetails[i].OrderId;
	//
	//                objectList.push(object);
	//            }
	//
	//            var mainObject = {};
	//            mainObject.ObjectList = objectList;
	//            mainObject.ObjectType = "Order";
	//            mainObject.ReasonCodeEventName = "ChangePromisedDate";
	//            mainObject.FunctionName = "UpdatePromisedDateForSelectorder";
	//            mainObject.FunctionParameter = orderDetails;
	//            $rootScope.SaveReasonCode(mainObject);
	//            $rootScope.Throbber.Visible = false;
	//            $rootScope.CloseReasoncodepopup();
	//        }
	//
	//    }
	//    else {
	//        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);
	//    }
	//}


	$scope.SavePromisedDateForSelectedEnquiry = function () {

		if ($scope.SelectedPromisedDate.PromisedDateForSelected !== "") {
			$rootScope.Throbber.Visible = true;

			var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== 999; });
			if (orderDetails.length > 0) {

				var objectList = [];

				for (var i = 0; i < orderDetails.length; i++) {


					var object = {};
					object.ObjectId = orderDetails[i].OrderId;

					objectList.push(object);
				}

				var mainObject = {};
				mainObject.ObjectList = objectList;
				mainObject.ObjectType = "Order";
				mainObject.ReasonCodeEventName = "UpdateRequestDate";
				$rootScope.SaveReasonCode(mainObject);

				if ($rootScope.ReasonCodeEntered === false) {
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectReasonCode), 'error', 3000);
					return false;
				}

				for (var j = 0; j < orderDetails.length; j++) {

					var expectedTimeOfDelivery = $filter('date')($scope.SelectedPromisedDate.PromisedDateForSelected, "dd/MM/yyyy");
					$scope.GetCollectionPickupDateForBulk(orderDetails[j], orderDetails[j].DeliveryLocation, orderDetails[j].CompanyMnemonic, expectedTimeOfDelivery);

				}

				$scope.CloseChangePRomisedDatePopup();
				$rootScope.CloseReasoncodepopup();
				$rootScope.Throbber.Visible = false;
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_RequestDateUpdated), '', 3000);
				$scope.RefreshDataGrid();

			}



		}
		else {
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectRequestDate), 'error', 3000);
		}
	}




	$scope.SaveCollectionDateForSelectedEnquiry = function () {

		if ($scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry !== "") {
			$rootScope.Throbber.Visible = true;
			$scope.SelectedEnquiryId = "";
			var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== 999; });
			if (orderDetails.length > 0) {
				var objectList = [];

				for (var i = 0; i < orderDetails.length; i++) {


					var object = {};
					object.ObjectId = orderDetails[i].OrderId;

					objectList.push(object);
				}

				var mainObject = {};
				mainObject.ObjectList = objectList;
				mainObject.ObjectType = "Order";
				mainObject.ReasonCodeEventName = "ChangeCollectionDate";
				mainObject.FunctionName = "UpdateCollectionDateForSelectorder";
				mainObject.FunctionParameter = orderDetails;
				$rootScope.SaveReasonCode(mainObject);
				$rootScope.Throbber.Visible = false;
				$rootScope.CloseReasoncodepopup();
			}

		}
		else {
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);
		}
	}



	$scope.UpdatePromisedDateForSelectorder = function (orderDetails) {
		var selectedOrderId = "";

		for (var i = 0; i < orderDetails.length; i++) {
			selectedOrderId = selectedOrderId + ',' + orderDetails[i].OrderId;
		}
		selectedOrderId = selectedOrderId.substr(1);

		var orderList = {
			PromisedDate: $scope.SelectedPromisedDate.PromisedDateForSelected,
			OrderId: selectedOrderId,
		}

		var requestData =
		{
			ServicesAction: 'UpdateOrderPromisedDate',
			OrderDetailList: orderList
		};

		//  var stringfyjson = JSON.stringify(requestData);
		var consolidateApiParamater =
		{
			Json: requestData,
		};
		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
			$scope.CloseChangePRomisedDatePopup();

			$rootScope.Throbber.Visible = false;
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_BranchPlantUpdated), '', 3000);
			$scope.RefreshDataGrid();
		});
	}




	$scope.UpdateCollectionDateForSelectorder = function (orderDetails) {
		var selectedOrderId = "";

		for (var i = 0; i < orderDetails.length; i++) {
			selectedOrderId = selectedOrderId + ',' + orderDetails[i].OrderId;
		}
		selectedOrderId = selectedOrderId.substr(1);

		var orderList = {
			CollectionDate: $scope.SelectedCollectionDate.CollectionDateForSelected,
			OrderId: selectedOrderId,
		}

		var requestData =
		{
			ServicesAction: 'UpdateOrderCollectionDate',
			OrderDetailList: orderList
		};

		//  var stringfyjson = JSON.stringify(requestData);
		var consolidateApiParamater =
		{
			Json: requestData,
		};
		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
			$scope.CloseChangePRomisedDatePopup();

			$rootScope.Throbber.Visible = false;
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_BranchPlantUpdated), '', 3000);
			$scope.RefreshDataGrid();
		});
	}



	$scope.BindPromisedDateFrom = function () {

		$('#PromisedDate').each(function () {
			$('#PromisedDate').datepicker({
				onSelect: function (dateText, inst) {

					if (inst.id !== undefined) {
						angular.element($('#' + inst.id)).triggerHandler('input');

					}
				},
				minDate: new Date(),
				dateFormat: 'dd/mm/yy',
				numberOfMonths: 1,
				isRTL: $('body').hasClass('rtl') ? true : false,
				prevText: '<i class="fa fa-angle-left"></i>',
				nextText: '<i class="fa fa-angle-right"></i>',
				showButtonPanel: false
			});
		});
	}



	$scope.BindCollectionDateFrom = function () {

		$('#FromDate').each(function () {
			$('#FromDate').datepicker({
				onSelect: function (dateText, inst) {

					if (inst.id !== undefined) {
						angular.element($('#' + inst.id)).triggerHandler('input');

					}
				},
				minDate: new Date(),
				dateFormat: 'dd/mm/yy',
				numberOfMonths: 1,
				isRTL: $('body').hasClass('rtl') ? true : false,
				prevText: '<i class="fa fa-angle-left"></i>',
				nextText: '<i class="fa fa-angle-right"></i>',
				showButtonPanel: false
			});
		});
	}

	//CODE FOR SCHEDULE ORDER SHIFT, DRIVER AND PLATENUMBER DATA SELECTION
	$scope.OnScheduleOrderShiftLinkClick = function (e, shift) {
		shift.showShiftDropDown = true;
		$scope.LoadAllShifts();
	};

	$scope.getSelectedShift = function (ShiftCode, orderid) {
		debugger;
		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderid; });
		if (enquiryDetails.length > 0) {
			enquiryDetails[0].ShiftCode = ShiftCode;
			enquiryDetails[0].ProposedShift = ShiftCode;
			enquiryDetails[0].CheckedEnquiry = true;
		}
	}



	$scope.DriverList = [];

	$scope.OnScheduleOrderDriverLinkClick = function (e, driver) {

		driver.showDriverDropDown = true;

		// Change By : Arun Dubey 
		// Change Date : 09/09/2019
		// set varible of selected row (order) false, on initial no need to show dropdown list of driver auto complete control.

		driver.ShowDriverListBox = true;

		var requestDataForCarrier = {};

		if ($rootScope.RoleName === 'Carrier' || $rootScope.RoleName === 'TransportManager') {
			requestDataForCarrier =
			{
				ServicesAction: 'LoadAllDriverList',
				CarrierId: $rootScope.CompanyId,
			}
		}
		else {
			requestDataForCarrier =
			{
				ServicesAction: 'LoadAllDriverList',
				CarrierId: 0
			}
		}

		var consolidateApiParamaterForCarrier =
		{
			Json: requestDataForCarrier,
		};

		GrRequestService.ProcessRequest(consolidateApiParamaterForCarrier).then(function (response) {
			if (response.data != undefined) {
				if (response.data.Json != undefined) {
					$scope.DriverList = response.data.Json.ProfileList;
				} else {
					$scope.DriverList = [];
				}
			} else {
				$scope.DriverList = [];
			}
		});
	};



	// Change By : Arun Dubey 
	// Change Date : 09/09/2019
	// set selected driver id as 0 if there is no driver selected.

	$scope.DriverInputBoxToSearch = function (driverNameText, rowData) {
		debugger;
		if (driverNameText !== undefined && driverNameText !== null) {
			if (driverNameText.length > 0) {
				rowData.data.ShowDriverListBox = true;
			} else {
				rowData.data.DeliveryPersonnelId = "0";

				// Change By : Arun Dubey 
				// Change Date : 10/09/2019
				// set true vale in variable of open and close driver dropdownlist, so after clearing text dropdownlist remain open as it is.

				rowData.data.ShowDriverListBox = true;
			}
		} else {
			rowData.data.DeliveryPersonnelId = "0";

			// Change By : Arun Dubey 
			// Change Date : 10/09/2019
			// set true vale in variable of open and close driver dropdownlist, so after clearing text dropdownlist remain open as it is.

			rowData.data.ShowDriverListBox = true;
		}
	}

	$scope.OpenDriverListBoxToShowAll = function (rowData) {
		debugger;

		// Change By : Arun Dubey 
		// Change Date : 09/09/2019
		// clear input box selected delivery personnel at the time of open driver list box to load all driver.

		rowData.data.DeliveryPersonnelName = "";
		rowData.data.DriverName = "";
		if (rowData.data.ShowDriverListBox === true) {
			rowData.data.ShowDriverListBox = false;
		} else {
			rowData.data.ShowDriverListBox = true;
		}

	}

	// Change By : Arun Dubey 
	// Change Date : 06/09/2019
	// this function use to clear selected driver in autocomplete box.

	$scope.ClearSelectedDriverAutoCompleteControl = function (rowData) {
		rowData.data.DeliveryPersonnelName = "";

		// Change By : Arun Dubey 
		// Change Date : 09/09/2019
		// clear selected driver name and driver id of particular order, click on clear button.

		rowData.data.DriverName = "";
		rowData.data.DeliveryPersonnelId = "0";
	}


	// Change By : Arun Dubey 
	// Change Date : 06/09/2019
	// this function use to set driver in selected order.

	$scope.getSelectedDriver = function (selectedDriver, orderid, rowData) {
		debugger;
		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderid; });

		if (enquiryDetails.length > 0) {

			rowData.data.DeliveryPersonnelName = selectedDriver.Name;

			// Change By : Arun Dubey 
			// Change Date : 09/09/2019
			// Set driver Name value.

			enquiryDetails[0].DriverName = selectedDriver.Name;
			enquiryDetails[0].DeliveryPersonnelId = selectedDriver.DeliveryPersonnelId;
			enquiryDetails[0].CheckedEnquiry = true;
			rowData.data.ShowDriverListBox = false;
		}
	}



	$scope.OnScheduleOrderPlateNumberLinkClick = function (e, plate) {
		debugger;
		plate.showPlateNumberDropDown = true;
		plate.ShowPlateNumberListBox = true;

		var requestDataForPlateNumber =
		{
			ServicesAction: 'GetPlateNumberByCarrierId',
			CarrierId: $rootScope.CompanyId,
			RoleId: $rootScope.RoleId
		}

		var consolidateApiParamaterForPlateNumber =
		{
			Json: requestDataForPlateNumber,
		};

		GrRequestService.ProcessRequest(consolidateApiParamaterForPlateNumber).then(function (response) {
			debugger;
			if (response.data != undefined) {
				if (response.data.Json != undefined) {
					$scope.PlateNumberList = response.data.Json.TransporterVehicleList;
				} else {
					$scope.PlateNumberList = [];
				}
			} else {
				$scope.PlateNumberList = [];
			}
		});

	};

	$scope.PlateNumberInputBoxToSearch = function (plateNumberText, rowData) {
		debugger;
		if (plateNumberText !== undefined && plateNumberText !== null) {
			if (plateNumberText.length > 0) {
				rowData.data.ShowPlateNumberListBox = true;
			} else {

				// Change By : Arun Dubey 
				// Change Date : 09/09/2019
				// clear plate number value.

				rowData.data.PlateNumber = "";

				// Change By : Arun Dubey 
				// Change Date : 10/09/2019
				// set true vale in variable of open and close platenumber dropdownlist, so after clearing text dropdownlist remain open as it is.

				rowData.data.ShowPlateNumberListBox = true;
			}
		} else {

			// Change By : Arun Dubey 
			// Change Date : 09/09/2019
			// clear plate number value.

			rowData.data.PlateNumber = "";

			// Change By : Arun Dubey 
			// Change Date : 10/09/2019
			// set true vale in variable of open and close platenumber dropdownlist, so after clearing text dropdownlist remain open as it is.

			rowData.data.ShowPlateNumberListBox = true;
		}
	}


	$scope.OpenPlateNumberListBoxToShowAll = function (rowData) {
		debugger;

		// Change By : Arun Dubey 
		// Change Date : 09/09/2019
		// clear input box selected plate number at the time of open platenumber list box to load all platenumbers.

		rowData.data.SelectedPlateNumber = "";
		if (rowData.data.ShowPlateNumberListBox === true) {
			rowData.data.ShowPlateNumberListBox = false;
		} else {
			rowData.data.ShowPlateNumberListBox = true;
		}

	}

	// Change By : Arun Dubey 
	// Change Date : 06/09/2019
	// this function use to clear platenumber autocomplete text box and reload driver control as well.

	$scope.ClearPlateNumberTextboxControl = function (rowData, orderid) {
		debugger;
		rowData.data.SelectedPlateNumber = "";

		// Change By : Arun Dubey 
		// Change Date : 09/09/2019
		// clear plate number value.

		rowData.data.PlateNumberData = "";
		rowData.data.PlateNumber = "";
		$scope.GetDriverByPlateNumber(rowData.data.SelectedPlateNumber, orderid, rowData);
	}


	// Change By : Arun Dubey 
	// Change Date : 06/09/2019
	// this function use to set plate number in selected order and load driver control according to plate number.

	$scope.getSelectedPlateNumber = function (e, SelectedPlateNumber, orderid, rowData) {
		debugger;
		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderid; });
		if (enquiryDetails.length > 0) {
			enquiryDetails[0].PlateNumber = SelectedPlateNumber.TransporterVehicleRegistrationNumber;
			enquiryDetails[0].PlateNumberData = SelectedPlateNumber.TransporterVehicleRegistrationNumber;

			// Change By : Arun Dubey 
			// Change Date : 06/09/2019
			// set value of selected plate number in selected order platenumber property.

			rowData.data.SelectedPlateNumber = SelectedPlateNumber.TransporterVehicleRegistrationNumber;


			enquiryDetails[0].CheckedEnquiry
			rowData.data.CheckedEnquiry = true;
			//var element = $(e.currentTarget);
			// var row = element.closest("tr");
			//  if (enquiryDetails[0].CheckedEnquiry) {
			//      row.addClass("k-state-selected");
			//  } else {
			//      row.removeClass("k-state-selected");
			//  }
			rowData.data.ShowPlateNumberListBox = false;
			//setTimeout( function () {
			$scope.GetDriverByPlateNumber(SelectedPlateNumber.TransporterVehicleRegistrationNumber, orderid, rowData);
			//}, 100);
		}
	}




	$scope.GetDriverByPlateNumber = function (PlateNumber, orderId, rowData) {
		debugger;
		var requestDataForPlateNumber =
		{
			ServicesAction: 'GetDriverByPlateNumber',
			PlateNumber: PlateNumber
		}

		var consolidateApiParamaterForPlateNumber =
		{
			Json: requestDataForPlateNumber,
		};

		$rootScope.Throbber.Visible = true;

		GrRequestService.ProcessRequest(consolidateApiParamaterForPlateNumber).then(function (response) {





			var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderId; });
			if (response.data != undefined) {
				if (response.data.Json != undefined) {
					var PlateNumberDriverList = response.data.Json.PlateNumberDriverMappingList;
					if (PlateNumberDriverList.length === 1) {
						enquiryDetails[0].DeliveryPersonnelId = PlateNumberDriverList[0].DeliveryPersonnelId;
						enquiryDetails[0].DriverName = PlateNumberDriverList[0].DriverName;
						enquiryDetails[0].DeliveryPersonnelName = PlateNumberDriverList[0].DriverName;

					}
					else {
						enquiryDetails[0].DeliveryPersonnelId = 0;
						enquiryDetails[0].DriverName = "Select";
						enquiryDetails[0].DeliveryPersonnelName = "";

					}
				}
				else {
					if (enquiryDetails.length > 0) {
						enquiryDetails[0].DeliveryPersonnelId = 0;
						enquiryDetails[0].DriverName = "Select";
						enquiryDetails[0].DeliveryPersonnelName = "";

					}
				}
			}
			rowData.data.DriverName = enquiryDetails[0].DriverName;
			$rootScope.Throbber.Visible = false;


		});
	}






	$scope.UpdateDriverShiftPlateNumber = function () {
		debugger;
		var isValid = true;
		$rootScope.Throbber.Visible = true;
		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry; });
		if (enquiryDetails.length === 0) {
			$rootScope.ValidationErrorAlert('Please select at least one order.', 'error', 3000);
			return;
		}

		var orderNumberNotHavingPickDateTime = "";



		for (var i = 0; i < enquiryDetails.length; i++) {
			var item = enquiryDetails[i];
			if (item.CheckedEnquiry) {
				if (item.DeliveryPersonnelId !== "0") {
					if (item.PlateNumber !== undefined && item.PlateNumber !== "") {
						if (item.ProposedShift !== undefined && item.ProposedShift !== "" && item.ProposedShift !== null) {

							if (item.PickDateTime !== undefined && item.PickDateTime !== "" && item.PickDateTime !== null) {

								var enquiryDetailsTemp = enquiryDetails.filter(function (el) { return el.OrderId === item.OrderId; });
								for (var j = 0; j < enquiryDetailsTemp.length; j++) {
									enquiryDetailsTemp[j].UserId = $rootScope.UserId;
									enquiryDetailsTemp[j].CreatedBy = $rootScope.UserId;
								}
								isValid = true;
							}
							else {
								isValid = false;
								orderNumberNotHavingPickDateTime = orderNumberNotHavingPickDateTime + item.OrderNumber + ",";
								break;
							}

						} else {
							isValid = false;
							$rootScope.ValidationErrorAlert('Please select Shift.', 'error', 3000);
							break;
						}
					}
					else {
						isValid = false;
						$rootScope.ValidationErrorAlert($rootScope.resData.res_OrderListSelectPlateNumber, 'error', 3000);
						break;
					}
				}
				else {
					isValid = false;
					$rootScope.ValidationErrorAlert($rootScope.resData.res_OrderListSelectDeliveryPersonnel, 'error', 3000);
					break;
				}
			}
		}




		if (orderNumberNotHavingPickDateTime !== "") {
			orderNumberNotHavingPickDateTime = orderNumberNotHavingPickDateTime.substr(0, orderNumberNotHavingPickDateTime.length - 1);
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridColumn_OrderNumber) + " " + orderNumberNotHavingPickDateTime + " " + String.format($rootScope.resData.res_OrderList_NoPickUpDateAssignedMessgae), 'error', 3000);
		}


		if (isValid) {
			debugger;

			var OrderSchedulingData = [];

			for (var i = 0; i < enquiryDetails.length; i++) {
				var orderScheduling = {
					OrderId: parseInt(enquiryDetails[i].OrderId),
					EnquiryId: parseInt(enquiryDetails[i].EnquiryId),
					EnquiryNumber: enquiryDetails[i].EnquiryAutoNumber,
					CurrentState: parseInt(enquiryDetails[i].CurrentState),
					SalesOrderNumber: enquiryDetails[i].SalesOrderNumber,
					OrderNumber: enquiryDetails[i].OrderNumber,
					PickingDate: enquiryDetails[i].PickingDate,
					pickingShift: enquiryDetails[i].ProposedShift,
					PlateNumber: enquiryDetails[i].PlateNumber,
					LocationType: parseInt(1),
					DeliveryPersonnelId: parseInt(enquiryDetails[i].DeliveryPersonnelId),
					CarrierId: parseInt(enquiryDetails[i].CarrierNumber),
					UserId: parseInt(enquiryDetails[i].UserId),
					PlateNumberBy: parseInt(enquiryDetails[i].UserId),
					ExpectedTimeOfDelivery: enquiryDetails[i].ExpectedTimeOfDelivery,
					PickDateTime: enquiryDetails[i].PickDateTime,
					OrderType: enquiryDetails[i].OrderType,
					ProposedShift: enquiryDetails[i].ProposedShift,
					//EnquiryDate: enquiryDetails[i].EnquiryDate,
					CreatedBy: parseInt(enquiryDetails[i].UserId)
				}
				OrderSchedulingData.push(orderScheduling);
			}

			var requestData = {
				OrderSchedulingList: OrderSchedulingData
			};

			GrRequestService.OrderSchedulingService(requestData).then(function (response) {

				$rootScope.Throbber.Visible = false;

				var eventNotificationList = [];

				for (var i = 0; i < enquiryDetails.length; i++) {
					var eventnotification = {};
					eventnotification.EventCode = "DriverAndPlateNumberAllocation";
					eventnotification.ObjectId = enquiryDetails[i].OrderId;
					eventnotification.ObjectType = "Order";
					eventnotification.IsActive = 1;
					eventNotificationList.push(eventnotification);
				}

				$rootScope.InsertInEventNotification(eventNotificationList);

				$scope.RefreshDataGrid();
				$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
			});

		} else {
			$rootScope.Throbber.Visible = false;
		}


	}
	//CODE FOR SCHEDULE ORDER SHIFT, DRIVER AND PLATENUMBER DATA SELECTION     END

	$scope.onShiftLinkClick = function (e, shift) {
		shift.showShiftDropDown = true;
		$scope.LoadAllShifts();
	};

	$scope.ClearShift = function (e, item) {
		item.showShiftDropDown = false;

		if (item.ProposedShiftForCheck == "" || item.ProposedShiftForCheck == undefined || item.ProposedShiftForCheck == null) {
			item.ProposedShift = undefined;
		}

		if (item.ProposedShiftForCheck !== item.ProposedShift) {
			item.ProposedShift = item.ProposedShiftForCheck;
		}
	};

	$scope.SaveShift = function (e, item) {
		//UPDATE PICKSHIFT IN ORDER MOVEMENT
		if (item.ProposedShift != "" && item.ProposedShift != undefined && item.ProposedShift != null) {

			var updatePickShift =
			{
				ServicesAction: 'UpdatePickShift',
				OrderId: item.OrderId,
				PickupShift: item.ProposedShift
			}

			var consolidateApiParamaterForShift =
			{
				Json: updatePickShift,
			};

			GrRequestService.ProcessRequest(consolidateApiParamaterForShift).then(function (response) {
				if (response.data != undefined) {
					if (response.data.Json != undefined) {
						$rootScope.ValidationErrorAlert('Shift updated successfully.', '', 3000);
						$scope.RefreshDataGrid();
					} else {
						$rootScope.ValidationErrorAlert('An error occurred when trying to update shift. Please try again', '', 3000);
					}
				} else {
					$rootScope.ValidationErrorAlert('An error occurred when trying to update shift. Please try again', '', 3000);
				}

				item.showShiftDropDown = false;
			});
		} else {
			$rootScope.ValidationErrorAlert('Please select a shift', '', 3000);
		}
	};


	$scope.onChangeClickDeliveryDate = function (e, item) {

		debugger;
		item.showDeliveryDateDropDown = true;
		item.ExpectedTimeOfDelivery = $filter('date')(item.ExpectedTimeOfDelivery, "dd/MM/yyyy");

		var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === item.OrderId; });
		if (data.length > 0) {
			if (data[0].CheckedEnquiry == "undefined") {

				data[0].CheckedEnquiry = true;

			} else {

				if (data[0].CheckedEnquiry == true) {
					data[0].CheckedEnquiry = false;
				} else {
					data[0].CheckedEnquiry = true;
				}
			}

		}

		item.CheckedEnquiry = data[0].CheckedEnquiry;
		var element = $(e.currentTarget);
		var row = element.closest("tr");
		if (item.CheckedEnquiry) {

			row.addClass("k-state-selected");
		} else {
			row.removeClass("k-state-selected");
		}

		setTimeout(function () {
			$scope.OpenDeliveryDatePicker(e, item);
		}, 100);


	};


	$scope.OpenDeliveryDatePicker = function (e, item) {

		focus('txtDeliveryDate' + item.OrderId);

		var numberOfDaysToAdd = $scope.LoadSettingInfoByName('ScheduleDateNumber', 'int');

		var someDate = new Date();
		someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
		var dd = someDate.getDate();
		var mm = someDate.getMonth() + 1;
		var y = someDate.getFullYear();
		//var hours = someDate.getHours().toString();
		//hours = (hours.length === 1) ? ("0" + hours) : hours;
		//
		//var minutes = someDate.getMinutes().toString();
		//minutes = (minutes.length === 1) ? ("0" + minutes) : minutes;

		var someFormattedDate = dd + '/' + mm + '/' + y + ' 00:00:00';
		var maxDateForDelivery = $filter('date')(someFormattedDate, "dd/MM/yyyy");

		$('#txtDeliveryDate' + item.OrderId).datepicker({
			onSelect: function (datetext, inst) {
				$scope.$apply(function () {
					item.ExpectedTimeOfDelivery = $filter('date')(datetext, "dd/MM/yyyy");
					debugger;
				});
			},
			minDate: new Date(),
			maxDate: maxDateForDelivery,
			dateFormat: 'dd/mm/yy',
			numberofmonths: 1,
			isRTL: $('body').hasClass('rtl') ? true : false,
			prevtext: '<i class="fa fa-angle-left"></i>',
			nexttext: '<i class="fa fa-angle-right"></i>',
			showbuttonpanel: false,
			autoclose: true,
		});

		$('#txtDeliveryDate' + item.OrderId).datepicker('show');

	};


	//#region Update Particular Enquiry Request Date
	$ionicModal.fromTemplateUrl('templates/ChangeDeliveryDateParticularRowCode.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.ChangeDeliveryDateParticularRowCode = modal;
	});

	$scope.OpenChangeDeliveryDateParticularRowCodePopup = function () {

		$scope.ChangeDeliveryDateParticularRowCode.show();
		$rootScope.Throbber.Visible = false;
	};

	$scope.CloseChangeDeliveryDateParticularRowPopup = function () {

		$scope.ChangeDeliveryDateParticularRowCode.hide();
	};


	$scope.SelectedDeliveryDateTemp = '';
	$scope.EnquiryDetailsTemp2 = [];
	$scope.IsDeliveryDateAlreadyAssingedForRow = false;

	$scope.CollectionPickupDate = "";

	$scope.SaveDeliveryDate = function (e, item) {

		$rootScope.LoadReasonCode("ChangePromisedDateReason");
		$rootScope.Throbber.Visible = true;

		if (item.ExpectedTimeOfDelivery !== "" && item.ExpectedTimeOfDelivery !== undefined && item.ExpectedTimeOfDelivery !== null) {

			$scope.SelectedDeliveryDateTemp = item.ExpectedTimeOfDelivery;
			$scope.EnquiryDetailsTemp2 = item;
			$scope.ScopeEvent = e;

			if (item.ExpectedTimeOfDeliveryForCheck !== "" && item.ExpectedTimeOfDeliveryForCheck !== undefined && item.ExpectedTimeOfDeliveryForCheck !== null) {

				$scope.OpenChangeDeliveryDateParticularRowCodePopup();
				$scope.IsDeliveryDateAlreadyAssingedForRow = true;
				$rootScope.Throbber.Visible = false;

			} else {

				$scope.IsDeliveryDateAlreadyAssingedForRow = false;
				item.showDeliveryDateDropDown = false;

				$scope.SaveDeliveryDateForParticularRowEnquiry();

				$rootScope.Throbber.Visible = false;


			}
		}
		else {

			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectRequestDate), 'error', 3000);

		}


	};

	$scope.SaveDeliveryDateForParticularRowEnquiry = function () {

		if ($scope.SelectedDeliveryDateTemp !== "" && $scope.SelectedDeliveryDateTemp !== undefined && $scope.SelectedDeliveryDateTemp !== null) {
			$rootScope.Throbber.Visible = true;

			var objectList = [];

			var object = {};
			object.ObjectId = $scope.EnquiryDetailsTemp2.OrderId;

			objectList.push(object);

			var mainObject = {};
			mainObject.ObjectList = objectList;
			mainObject.ObjectType = "Order";
			mainObject.ReasonCodeEventName = "UpdateRequestDate";
			mainObject.FunctionName = "UpdateDeliveryDateSelectedForParticularRowEnquiry";
			mainObject.FunctionParameter = $scope.EnquiryDetailsTemp2;

			if ($scope.IsDeliveryDateAlreadyAssingedForRow === true) {
				$rootScope.SaveReasonCode(mainObject);

				if ($rootScope.ReasonCodeEntered === false) {
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectReasonCode), 'error', 3000);
					return false;
				}

			}

			$scope[mainObject.FunctionName](mainObject.FunctionParameter);

			$rootScope.Throbber.Visible = false;
			$scope.CloseChangeDeliveryDateParticularRowPopup();
			$rootScope.CloseReasoncodepopup();

		} else {
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectRequestDate), 'error', 3000);
		}
	};

	$scope.UpdateDeliveryDateSelectedForParticularRowEnquiry = function (orderDetails) {

		$scope.GetCollectionPickupDate(orderDetails, orderDetails.DeliveryLocation, orderDetails.CompanyMnemonic, orderDetails.ExpectedTimeOfDelivery);


	};


	$scope.ClearDeliveryDate = function (e, item) {

		item.showDeliveryDateDropDown = false;

		if (item.ExpectedTimeOfDeliveryForCheck == "" || item.ExpectedTimeOfDeliveryForCheck == undefined && item.ExpectedTimeOfDeliveryForCheck == null) {
			item.ExpectedTimeOfDelivery = undefined;
		}

		if (item.ExpectedTimeOfDeliveryForCheck !== item.ExpectedTimeOfDelivery) {
			item.ExpectedTimeOfDelivery = item.ExpectedTimeOfDeliveryForCheck;
		}

		var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === item.OrderId; });
		if (data.length > 0) {


			if (data[0].CheckedEnquiry == "undefined") {

				data[0].CheckedEnquiry = true;

			} else {

				if (data[0].CheckedEnquiry == true) {



					data[0].CheckedEnquiry = false;
				} else {

					data[0].CheckedEnquiry = true;
				}



			}

		}


		item.CheckedEnquiry = data[0].CheckedEnquiry;
		var element = $(e.currentTarget);
		var row = element.closest("tr");
		if (item.CheckedEnquiry) {

			row.addClass("k-state-selected");
		} else {
			row.removeClass("k-state-selected");
		}

	};


	$scope.GetCollectionPickupDate = function (orderDetails, deliveryLocationCode, activeCompanyMnemonic, requestedDate) {

		$scope.CollectionPickupDate = "";

		debugger;
		var requestData =
		{
			ServicesAction: 'GetCollectionPickUpDateForGrid',
			DeliveryLocation: {
				LocationId: deliveryLocationCode,
				DeliveryLocationCode: deliveryLocationCode,
				LocationCode: deliveryLocationCode
			},
			Company: {
				CompanyId: activeCompanyMnemonic,
				CompanyMnemonic: activeCompanyMnemonic,
			},
			Supplier: {
				CompanyId: activeCompanyMnemonic,
				CompanyMnemonic: activeCompanyMnemonic,
			},
			RuleType: 1,
			CompanyId: activeCompanyMnemonic,
			CompanyMnemonic: activeCompanyMnemonic,
			Order: {
				OrderTime: "",
				OrderDate: "",
				RequestTime: 0,
				RequestedDate: $filter('date')(requestedDate, "dd/MM/yyyy")
			}
		};


		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {

			debugger;
			var responseStr = response.data.Json;
			$rootScope.Throbber.Visible = false;
			var someDate1 = new Date();
			var currentDateList = $filter('date')(someDate1, "dd/MM/yyyy 00:00:00");

			if (responseStr.CollectionDate === '' || responseStr.CollectionDate === undefined || responseStr.CollectionDate === null) {
				var numberOfDaysToAdd = $scope.LoadSettingInfoByName('CollectionPickupDate', 'int');

				if (numberOfDaysToAdd !== "") {

					var requestedDateTemp = $filter('date')(requestedDate, "dd/MM/yyyy 00:00:00");
					var dateTemp = "";
					dateTemp = requestedDateTemp.split(" ");
					var dateformatTemp = dateTemp[0].split('/');

					var someDate = new Date(dateformatTemp[2], dateformatTemp[1] - 1, dateformatTemp[0]);
					someDate.setDate(someDate.getDate() - numberOfDaysToAdd);
					var dd = someDate.getDate();
					var mm = someDate.getMonth() + 1;
					var y = someDate.getFullYear();
					//var hours = someDate.getHours().toString();
					//hours = (hours.length === 1) ? ("0" + hours) : hours;
					//
					//var minutes = someDate.getMinutes().toString();
					//minutes = (minutes.length === 1) ? ("0" + minutes) : minutes;

					var someFormattedDate = dd + '/' + mm + '/' + y + ' 00:00:00';

					$scope.CollectionPickupDate = someFormattedDate;
					//$rootScope.NoOfCollectionDays = numberOfDaysToAdd;

					var collectionDateList1 = $scope.ConvertDatetImeToUTCDateTimeFormat($filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy"));

					if (collectionDateList1 < $scope.ConvertDatetImeToUTCDateTimeFormat(currentDateList)) {
						$scope.CollectionPickupDate = currentDateList;
					}
					else if (collectionDateList1 > $scope.ConvertDatetImeToUTCDateTimeFormat(requestedDate)) {
						$scope.CollectionPickupDate = currentDateList;
					}

				}
				else {
					$scope.CollectionPickupDate = "";
					//$rootScope.NoOfCollectionDays = '0';
				}

			}
			else {

				debugger;
				responseStr = response.data.Json;
				$scope.CollectionPickupDate = responseStr.CollectionDate;
				var collectionDateList = $scope.ConvertDatetImeToUTCDateTimeFormat($filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy"));

				if (collectionDateList < $scope.ConvertDatetImeToUTCDateTimeFormat(currentDateList)) {
					$scope.CollectionPickupDate = currentDateList;
				}
				else if (collectionDateList > $scope.ConvertDatetImeToUTCDateTimeFormat(requestedDate)) {
					$scope.CollectionPickupDate = currentDateList;
				}

				//$rootScope.NoOfCollectionDays = responseStr.NoOfCollectionDays.replace(/\"\'/g, "");
			}

			debugger;
			var selectedOrderId = "";

			selectedOrderId = orderDetails.OrderId;

			var collectionPickupDate = $filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy 00:00:00");
			var requestedDateNew = $filter('date')(requestedDate, "dd/MM/yyyy 00:00:00");

			if (collectionPickupDate !== "" && typeof collectionPickupDate !== "undefined") {
				var date = "";
				date = collectionPickupDate.split(" ");
				var dateformat = date[0].split('/');

				collectionPickupDate = dateformat[2] + "-" + dateformat[1] + "-" + dateformat[0] + " 00:00:00";

			}

			if (requestedDateNew !== "" && typeof requestedDateNew !== "undefined") {
				var date1 = "";
				date1 = requestedDateNew.split(" ");
				var dateformat1 = date1[0].split('/');

				requestedDateNew = dateformat1[2] + "-" + dateformat1[1] + "-" + dateformat1[0] + " 00:00:00";

			}

			var enquiryList = {
				RequestedDate: requestedDateNew,
				PickDateTime: collectionPickupDate,
				OrderId: selectedOrderId
			}
			var requestData =
			{
				ServicesAction: 'UpdateRequestedDateForParticularOrder',
				OrderDetailList: enquiryList
			};
			var consolidateApiParamater =
			{
				Json: requestData,
			};
			GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response1) {
				$scope.CloseChangeDeliveryDateParticularRowPopup();
				$rootScope.Throbber.Visible = false;
				$scope.LoadData(selectedOrderId);
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_RequestDateUpdated), '', 3000);

				if ($scope.ConvertDatetImeToUTCDateTimeFormat($scope.CollectionPickupDate) === $scope.ConvertDatetImeToUTCDateTimeFormat(currentDateList)) {
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_PickUpDateWarningMsg), '', 3000);
				}
				if (orderDetails.CurrentState == "525") {
					$scope.ResequencingOrderAfterChangedPickupDate(selectedOrderId, "PromisedDate");
				}
				//$scope.RefreshDataGrid();
			});

		});
	};

	$scope.GetCollectionPickupDateForBulk = function (orderDetails, deliveryLocationCode, activeCompanyMnemonic, requestedDate) {

		$scope.CollectionPickupDate = "";

		debugger;
		var requestData =
		{
			ServicesAction: 'GetCollectionPickUpDateForGrid',
			DeliveryLocation: {
				LocationId: deliveryLocationCode,
				DeliveryLocationCode: deliveryLocationCode,
				LocationCode: deliveryLocationCode
			},
			Company: {
				CompanyId: activeCompanyMnemonic,
				CompanyMnemonic: activeCompanyMnemonic,
			},
			Supplier: {
				CompanyId: activeCompanyMnemonic,
				CompanyMnemonic: activeCompanyMnemonic,
			},
			RuleType: 1,
			CompanyId: activeCompanyMnemonic,
			CompanyMnemonic: activeCompanyMnemonic,
			Order: {
				OrderTime: "",
				OrderDate: "",
				RequestTime: 0,
				RequestedDate: $filter('date')(requestedDate, "dd/MM/yyyy")
			}
		};


		var jsonobject = {};
		jsonobject.Json = requestData;
		GrRequestService.ProcessRequest(jsonobject).then(function (response) {

			debugger;
			var responseStr = response.data.Json;
			$rootScope.Throbber.Visible = false;
			var someDate1 = new Date();
			var currentDateList = $filter('date')(someDate1, "dd/MM/yyyy 00:00:00");

			if (responseStr.CollectionDate === '' || responseStr.CollectionDate === undefined || responseStr.CollectionDate === null) {
				var numberOfDaysToAdd = $scope.LoadSettingInfoByName('CollectionPickupDate', 'int');

				if (numberOfDaysToAdd !== "") {

					var requestedDateTemp = $filter('date')(requestedDate, "dd/MM/yyyy 00:00:00");
					var dateTemp = "";
					dateTemp = requestedDateTemp.split(" ");
					var dateformatTemp = dateTemp[0].split('/');

					var someDate = new Date(dateformatTemp[2], dateformatTemp[1] - 1, dateformatTemp[0]);
					someDate.setDate(someDate.getDate() - numberOfDaysToAdd);
					var dd = someDate.getDate();
					var mm = someDate.getMonth() + 1;
					var y = someDate.getFullYear();
					//var hours = someDate.getHours().toString();
					//hours = (hours.length === 1) ? ("0" + hours) : hours;
					//
					//var minutes = someDate.getMinutes().toString();
					//minutes = (minutes.length === 1) ? ("0" + minutes) : minutes;

					var someFormattedDate = dd + '/' + mm + '/' + y + ' 00:00:00';

					$scope.CollectionPickupDate = someFormattedDate;
					//$rootScope.NoOfCollectionDays = numberOfDaysToAdd;

					var collectionDateList1 = $scope.ConvertDatetImeToUTCDateTimeFormat($filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy"));

					if (collectionDateList1 < $scope.ConvertDatetImeToUTCDateTimeFormat(currentDateList)) {
						$scope.CollectionPickupDate = currentDateList;
					}
					else if (collectionDateList1 > $scope.ConvertDatetImeToUTCDateTimeFormat(requestedDate)) {
						$scope.CollectionPickupDate = currentDateList;
					}

				}
				else {
					$scope.CollectionPickupDate = "";
					//$rootScope.NoOfCollectionDays = '0';
				}

			}
			else {

				debugger;

				$scope.CollectionPickupDate = responseStr.CollectionDate;
				var collectionDateList = $scope.ConvertDatetImeToUTCDateTimeFormat($filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy"));

				if (collectionDateList < $scope.ConvertDatetImeToUTCDateTimeFormat(currentDateList)) {
					$scope.CollectionPickupDate = currentDateList;
				}
				else if (collectionDateList > $scope.ConvertDatetImeToUTCDateTimeFormat(requestedDate)) {
					$scope.CollectionPickupDate = currentDateList;
				}

				//$rootScope.NoOfCollectionDays = responseStr.NoOfCollectionDays.replace(/\"\'/g, "");
			}

			debugger;
			var selectedOrderId = "";

			selectedOrderId = orderDetails.OrderId;

			var collectionPickupDate = $filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy 00:00:00");
			var requestedDateNew = $filter('date')(requestedDate, "dd/MM/yyyy 00:00:00");

			if (collectionPickupDate !== "" && typeof collectionPickupDate !== "undefined") {
				var date = "";
				date = collectionPickupDate.split(" ");
				var dateformat = date[0].split('/');

				collectionPickupDate = dateformat[2] + "-" + dateformat[1] + "-" + dateformat[0] + " 00:00:00";

			}

			if (requestedDateNew !== "" && typeof requestedDateNew !== "undefined") {
				var date1 = "";
				date1 = requestedDateNew.split(" ");
				var dateformat1 = date1[0].split('/');

				requestedDateNew = dateformat1[2] + "-" + dateformat1[1] + "-" + dateformat1[0] + " 00:00:00";

			}

			var enquiryList = {
				RequestedDate: requestedDateNew,
				PickDateTime: collectionPickupDate,
				OrderId: selectedOrderId
			}
			var requestData =
			{
				ServicesAction: 'UpdateRequestedDateForParticularOrder',
				OrderDetailList: enquiryList
			};
			var consolidateApiParamater =
			{
				Json: requestData,
			};
			GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response1) {
				$scope.RefreshDataGrid();
				if (orderDetails.CurrentState == "525") {
					$scope.ResequencingOrderAfterChangedPickupDate(selectedOrderId, "PromisedDate");
				}
			});

		});
	};

	$scope.LoadSettingInfoByName = function (settingName, returnValueDataType) {

		var settingValue = "";
		if ($sessionStorage.AllSettingMasterData != undefined) {
			var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === settingName; });
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


	$scope.onChangeClickPickUpDate = function (e, item) {

		debugger;
		item.showPickUpDateDropDown = true;
		item.PickDateTime = $filter('date')(item.PickDateTime, "dd/MM/yyyy");

		var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === item.OrderId; });
		if (data.length > 0) {
			if (data[0].CheckedEnquiry == "undefined") {
				data[0].CheckedEnquiry = true;
			} else {
				if (data[0].CheckedEnquiry == true) {
					data[0].CheckedEnquiry = false;
				} else {
					data[0].CheckedEnquiry = true;
				}
			}

		}

		item.CheckedEnquiry = data[0].CheckedEnquiry;
		var element = $(e.currentTarget);
		var row = element.closest("tr");
		if (item.CheckedEnquiry) {

			row.addClass("k-state-selected");
		} else {
			row.removeClass("k-state-selected");
		}

		setTimeout(function () {
			$scope.OpenPickUpDatePicker(e, item);
		}, 200);


	};


	$scope.OpenPickUpDatePicker = function (e, item) {

		focus('txtPickUpDate' + item.OrderId);

		var maxDateOfDatePicker = $filter('date')(item.ExpectedTimeOfDelivery, "dd/MM/yyyy");

		$('#txtPickUpDate' + item.OrderId).datepicker({
			onSelect: function (datetext, inst) {
				$scope.$apply(function () {
					item.PickDateTime = $filter('date')(datetext, "dd/MM/yyyy");
					debugger;
				});
			},
			minDate: new Date(),
			maxDate: maxDateOfDatePicker,
			dateFormat: 'dd/mm/yy',
			numberofmonths: 1,
			isRTL: $('body').hasClass('rtl') ? true : false,
			prevtext: '<i class="fa fa-angle-left"></i>',
			nexttext: '<i class="fa fa-angle-right"></i>',
			showbuttonpanel: false,
			autoclose: true,
		});

		$('#txtPickUpDate' + item.OrderId).datepicker('show');

	};

	$scope.ClearPickUpDate = function (e, item) {

		item.showPickUpDateDropDown = false;

		if (item.PickDateTimeForCheck == "" || item.PickDateTimeForCheck == undefined && item.PickDateTimeForCheck == null) {
			item.PickDateTime = undefined;
		}

		if (item.PickDateTimeForCheck !== item.PickDateTime) {
			item.PickDateTime = item.PickDateTimeForCheck;
		}

		var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === item.OrderId; });
		if (data.length > 0) {
			if (data[0].CheckedEnquiry == "undefined") {
				data[0].CheckedEnquiry = true;
			} else {
				if (data[0].CheckedEnquiry == true) {
					data[0].CheckedEnquiry = false;
				} else {
					data[0].CheckedEnquiry = true;
				}
			}

		}


		item.CheckedEnquiry = data[0].CheckedEnquiry;
		var element = $(e.currentTarget);
		var row = element.closest("tr");
		if (item.CheckedEnquiry) {

			row.addClass("k-state-selected");
		} else {
			row.removeClass("k-state-selected");
		}

	};

	//#region Update Particular Enquiry Pick Up Date
	$ionicModal.fromTemplateUrl('templates/ChangePickUpDateParticularRowCode.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.ChangePickUpDateParticularRowCode = modal;
	});

	$scope.OpenChangePickUpDateParticularRowCodePopup = function () {

		$scope.ChangePickUpDateParticularRowCode.show();
		$rootScope.Throbber.Visible = false;
	};

	$scope.CloseChangePickUpDateParticularRowCodePopup = function () {

		$scope.ChangePickUpDateParticularRowCode.hide();
	};


	$scope.SelectedPickUpDateTemp = '';
	$scope.EnquiryDetailsTemp3 = [];
	$scope.IsPickUpDateAlreadyAssingedForRow = false;

	$scope.SavePickUpDate = function (e, item) {

		$rootScope.LoadReasonCode("PickUpDateReasonCode");
		$rootScope.Throbber.Visible = true;

		if (item.PickDateTime !== "" && item.PickDateTime !== undefined && item.PickDateTime !== null) {

			$scope.SelectedPickUpDateTemp = item.PickDateTime;
			$scope.EnquiryDetailsTemp3 = item;

			if (item.PickDateTimeForCheck !== "" && item.PickDateTimeForCheck !== undefined && item.PickDateTimeForCheck !== null) {

				$scope.OpenChangePickUpDateParticularRowCodePopup();
				$scope.IsPickUpDateAlreadyAssingedForRow = true;
				$rootScope.Throbber.Visible = false;

			} else {

				$scope.IsPickUpDateAlreadyAssingedForRow = false;
				item.showPickUpDateDropDown = false;

				$scope.SavePickUpDateForParticularRowEnquiry();

				$rootScope.Throbber.Visible = false;


			}
		}
		else {

			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectRequestDate), 'error', 3000);

		}


	};

	$scope.SavePickUpDateForParticularRowEnquiry = function () {

		if ($scope.SelectedPickUpDateTemp !== "" && $scope.SelectedPickUpDateTemp !== undefined && $scope.SelectedPickUpDateTemp !== null) {
			$rootScope.Throbber.Visible = true;

			var objectList = [];

			var object = {};
			object.ObjectId = $scope.EnquiryDetailsTemp3.OrderId;

			objectList.push(object);

			var mainObject = {};
			mainObject.ObjectList = objectList;
			mainObject.ObjectType = "Order";
			mainObject.ReasonCodeEventName = "UpdatePickUpDate";
			mainObject.FunctionName = "UpdatePickUpDateSelectedForParticularRowEnquiry";
			mainObject.FunctionParameter = $scope.EnquiryDetailsTemp3;

			if ($scope.IsPickUpDateAlreadyAssingedForRow === true) {
				$rootScope.SaveReasonCode(mainObject);

				if ($rootScope.ReasonCodeEntered === false) {
					$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectReasonCode), 'error', 3000);
					return false;
				}

			}

			$scope[mainObject.FunctionName](mainObject.FunctionParameter);

			$rootScope.Throbber.Visible = false;
			$scope.CloseChangePickUpDateParticularRowCodePopup();
			$rootScope.CloseReasoncodepopup();

		} else {
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectPickDateTime), 'error', 3000);
		}
	};

	$scope.UpdatePickUpDateSelectedForParticularRowEnquiry = function (orderDetails) {

		debugger;
		var selectedOrderId = "";
		var pickDateTime = "";

		selectedOrderId = orderDetails.OrderId;
		pickDateTime = orderDetails.PickDateTime;

		var pickDateTimeNew = $filter('date')(pickDateTime, "dd/MM/yyyy 00:00:00");
		if (pickDateTimeNew !== "" && typeof pickDateTimeNew !== "undefined") {
			var date1 = "";
			date1 = pickDateTimeNew.split(" ");
			var dateformat1 = date1[0].split('/');

			pickDateTimeNew = dateformat1[2] + "-" + dateformat1[1] + "-" + dateformat1[0] + " 00:00:00";

		}

		var enquiryList = {
			PickDateTime: pickDateTimeNew,
			OrderId: selectedOrderId
		}
		var requestData =
		{
			ServicesAction: 'UpdatePickDateTimeForParticularOrder',
			OrderDetailList: enquiryList
		};
		var consolidateApiParamater =
		{
			Json: requestData,
		};
		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response1) {
			$scope.CloseChangePickUpDateParticularRowCodePopup();
			$rootScope.Throbber.Visible = false;
			$scope.LoadData(selectedOrderId);
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_PickUpDateUpdated), '', 3000);
			//$scope.RefreshDataGrid();
			if (orderDetails.CurrentState == "525") {
				$scope.ResequencingOrderAfterChangedPickupDate(selectedOrderId, "PickupDate");
			}
		});


	};


	$scope.LoadData = function (Id) {

		var requestData =
		{
			ServicesAction: 'LoadPromisedDatePickUpDateInOrder',
			OrderId: Id,
			RoleId: $rootScope.RoleId,
			CultureId: $rootScope.CultureId,
			UserId: $rootScope.UserId

		};
		var consolidateApiParamater =
		{
			Json: requestData,
		};

		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
			debugger;
			if (response.data !== undefined) {
				var dataList = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === Id; });
				dataList[0].ExpectedTimeOfDelivery = response.data.Json.OrderList.ExpectedTimeOfDelivery;
				dataList[0].ExpectedTimeOfDeliveryForCheck = response.data.Json.OrderList.ExpectedTimeOfDelivery;
				dataList[0].PickDateTime = response.data.Json.OrderList.PickDateTime;
				dataList[0].PickDateTimeForCheck = response.data.Json.OrderList.PickDateTime;

				//var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === Id; });
				angular.forEach($scope.SalesAdminApprovalList, function (item) {

					item.showDeliveryDateDropDown = false;
					item.showPickUpDateDropDown = false;
					item.CheckedEnquiry = false;

				});

			} else {
				$rootScope.Throbber.Visible = false;
			}




		});
	};



	$scope.ConvertDatetImeToUTCDateTimeFormat = function (datetime) {

		var datetimeformat = "";

		if (datetime !== "" && datetime !== undefined && datetime !== null) {

			var date = datetime.split(' ');
			datetime = date[0].split('/');
			if (date.length > 1) {
				if (parseInt(datetime[1]) <= 9) {
					datetime[1] = "0" + datetime[1];
				}

				if (parseInt(datetime[0]) <= 9) {
					datetime[0] = "0" + datetime[0];
				}

				datetime = datetime[1] + "/" + datetime[0] + "/" + datetime[2] + " " + date[1];
			}
			else {
				datetime = datetime[1] + "/" + datetime[0] + "/" + datetime[2];
			}

			datetimeformat = new Date(datetime);
		}


		return datetimeformat;
	}

	$scope.UpdateDeliveryStatus = function () {
		var requestData =
		{
			ServicesAction: 'UpdateDeliveryStatusForOrder',
			OrderId: $scope.OrderIdForDeliveryStatus,
			CurrentState: $scope.CurrentStateForDeliveryStatus,
			ModifiedBy: $rootScope.UserId,
			RoleId: $rootScope.RoleId,
			CultureId: $rootScope.CultureId
		};
		var consolidateApiParamater =
		{
			Json: requestData,
		};

		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

			if (response.data !== undefined) {
				$scope.OrderIdForDeliveryStatus = "";
				$scope.CurrentStateForDeliveryStatus = "";
				$scope.CloseWarningMessageUpdateDeliveryStatus();
				$scope.RefreshDataGrid();
				$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_OrderStatusUpdated), '', 3000);
			}
		});
	}




	$scope.DemoCheck = function () {
		var requestData =
		{
			ServicesAction: 'DemoCheckDT',

		};
		var consolidateApiParamater =
		{
			Json: requestData,
		};

		GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


		});
	}

	$rootScope.RefreshGridInControlTower = function () {
		$scope.RefreshDataGrid();
	}


	$scope.ResequencingOrderAfterChangedPickupDate = function (orderId, type) {
		debugger;
		var OrderSchedulingData = [];
		var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === orderId; });
		//for ( var i = 0; i < enquiryDetails.length; i++ ) {

		var dateobj = "";
		var dateobj1 = "";
		var dateobjDateValue = enquiryDetails[0].PickDateTime;
		var promiseddateobj = "";
		var promiseddateobj1 = "";
		var promiseddateobjDateValue = enquiryDetails[0].ExpectedTimeOfDelivery;
		if (type == "PickupDate") {
			dateobj = enquiryDetails[0].PickDateTime.split(' ');
			dateobj1 = dateobj[0].split('/');
			dateobjDateValue = dateobj1[2] + "-" + dateobj1[1] + "-" + dateobj1[0] + "T" + "00" + ":00";
		} else {
			promiseddateobj = enquiryDetails[0].ExpectedTimeOfDelivery.split(' ');
			promiseddateobj1 = promiseddateobj[0].split('/');
			promiseddateobjDateValue = promiseddateobj1[2] + "-" + promiseddateobj1[1] + "-" + promiseddateobj1[0] + "T" + "00" + ":00";
		}
		var orderScheduling = {
			OrderId: parseInt(enquiryDetails[0].OrderId),
			EnquiryId: parseInt(enquiryDetails[0].EnquiryId),
			EnquiryNumber: enquiryDetails[0].EnquiryAutoNumber,
			CurrentState: parseInt(enquiryDetails[0].CurrentState),
			SalesOrderNumber: enquiryDetails[0].SalesOrderNumber,
			OrderNumber: enquiryDetails[0].OrderNumber,
			PickingDate: enquiryDetails[0].PickingDate,
			pickingShift: enquiryDetails[0].ProposedShift,
			PlateNumber: enquiryDetails[0].PlateNumber,
			LocationType: parseInt(1),
			DeliveryPersonnelId: parseInt(enquiryDetails[0].DeliveryPersonnelId),
			CarrierId: parseInt(enquiryDetails[0].CarrierNumber),
			UserId: parseInt($rootScope.UserId),
			PlateNumberBy: parseInt($rootScope.UserId),
			ExpectedTimeOfDelivery: promiseddateobjDateValue,
			PickDateTime: dateobjDateValue,
			ProposedShift: enquiryDetails[0].ProposedShift,
			EnquiryDate: enquiryDetails[0].EnquiryDate,
			CreatedBy: parseInt($rootScope.UserId)
		}
		OrderSchedulingData.push(orderScheduling);
		//}

		var requestData = {
			OrderSchedulingList: OrderSchedulingData
		};

		GrRequestService.OrderSchedulingService(requestData).then(function (response) {

			$rootScope.Throbber.Visible = false;

			//var eventNotificationList = [];

			//for ( var i = 0; i < enquiryDetails.length; i++ ) {
			//	var eventnotification = {};
			//	eventnotification.EventCode = "DriverAndPlateNumberAllocation";
			//	eventnotification.ObjectId = enquiryDetails[i].OrderId;
			//	eventnotification.ObjectType = "Order";
			//	eventnotification.IsActive = 1;
			//	eventNotificationList.push( eventnotification );
			//}

			//$rootScope.InsertInEventNotification( eventNotificationList );

			//$scope.RefreshDataGrid();
			//$rootScope.ValidationErrorAlert( 'Record saved successfully.', '', 3000 );
		});
	}






	$ionicModal.fromTemplateUrl('templates/ConfirmCount.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.ConfirmCountpopup = modal;
	});
	$scope.ShowConfirmCountpopup = function () {
		//$scope.OrderIdConfirmCount = OrderId;

		$scope.ConfirmCountpopup.show();
	}
	$scope.CloseConfirmCountpopup = function () {

		$scope.ConfirmCountpopup.hide();
	}


	$scope.GetRPMOrderDetailByOrderId = function (orderId) {

		debugger;
		var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return parseInt(el.OrderId) === parseInt(orderId); });
		if (orderDetails[0].CurrentState == '10301') {
			$scope.ShowConfirmCountpopup();
		} else {
			$scope.ShowiewConfirmCountpopup();
		}
		var requestData = {
			OrderId: orderId

		};

		var consolidateApiParamater = {
			Json: requestData,
		};

		var ConfirmCountCheckOrderListGrid = ManageOrderService.ConfirmCountCheck(consolidateApiParamater);


		return $q.all([
			ConfirmCountCheckOrderListGrid,

		]).then(function (resp) {
			var ConfirmCountCheckOrderListGridresponse = resp[0];
			debugger;
			$scope.RPMOrderInfo = ConfirmCountCheckOrderListGridresponse.data.Json.OrderList[0];
			$scope.RIOrderNumber = ConfirmCountCheckOrderListGridresponse.data.Json.OrderList[0].OrderNumber;
			$scope.ShipToCodeConfirmCount = ConfirmCountCheckOrderListGridresponse.data.Json.OrderList[0].SoldToCode;
			$scope.ShipToNameConfirmCount = ConfirmCountCheckOrderListGridresponse.data.Json.OrderList[0].SoldToName;
			$scope.CollectionLocationNameConfirmCount = ConfirmCountCheckOrderListGridresponse.data.Json.OrderList[0].CollectionLocationName;
			$scope.TruckSizeConfirmCount = ConfirmCountCheckOrderListGridresponse.data.Json.OrderList[0].TruckSize;
			for (var i = 0; i < ConfirmCountCheckOrderListGridresponse.data.Json.OrderList[0].ProductInfo.length; i++) {
				ConfirmCountCheckOrderListGridresponse.data.Json.OrderList[0].ProductInfo[i].VerifiedQuantity = parseInt(ConfirmCountCheckOrderListGridresponse.data.Json.OrderList[0].ProductInfo[i].VerifiedQuantity);
				ConfirmCountCheckOrderListGridresponse.data.Json.OrderList[0].ProductInfo[i].UserId = parseInt($rootScope.UserId);


			}


			$scope.RPMOrderProductInfo = ConfirmCountCheckOrderListGridresponse.data.Json.OrderList[0].ProductInfo;

		});



	}


	$ionicModal.fromTemplateUrl('templates/WarningMessageForCheckerCount.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.ConfirmWarningMessageForCountpopup = modal;
	});
	$scope.ShowWarningMessageForCheckerCountpopup = function () {


		$scope.ConfirmWarningMessageForCountpopup.show();
	}
	$scope.CloseWarningMessageForCheckerCountpopup = function () {

		$scope.ConfirmWarningMessageForCountpopup.hide();
	}


	$scope.WarningBeforSaveConfirmCount = function () {
		debugger;
		$scope.ShowWarningMessageForCheckerCountpopup();
	}




	$scope.SaveConfirmCount = function () {
		debugger;
		$rootScope.Throbber.Visible = false;

		var requestData = {
			ItemData: $scope.RPMOrderInfo
		};
		$scope.throbber = true;
		var consolidateApiParamater = {
			Json: requestData,
		};

		ManageOrderService.SaveConfirmCountQty(consolidateApiParamater).then(function (response) {

			$scope.throbber = false;
			$scope.CloseConfirmCountpopup();
			$scope.CloseWarningMessageForCheckerCountpopup();
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderList_ConfirmCountSaved), 'error', 3000);
			$scope.RefreshDataGrid();


		}).catch(function (response) {

		});
	};



	$ionicModal.fromTemplateUrl('templates/ViewConfirmCount.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.ViewConfirmCountpopup = modal;
	});
	$scope.ShowiewConfirmCountpopup = function () {
		//$scope.OrderIdConfirmCount = OrderId;

		$scope.ViewConfirmCountpopup.show();
	}
	$scope.CloseViewConfirmCountpopup = function () {

		$scope.ViewConfirmCountpopup.hide();
	}




});