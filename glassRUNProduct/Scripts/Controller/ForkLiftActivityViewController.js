angular.module("glassRUNProduct").controller('ForkLiftActivityViewController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, $q, GrRequestService, ManageOrderService) {



	$scope.$on('$destroy', function (evt) {

		console.log("destroy order");
		// $("#SalesAdminApprovalGrid").dxDataGrid("dispose");
		$("#ForkLiftActivityGrid").remove();
	});

	setTimeout(function () {
		pluginsService.init();
	}, 500);
	$scope.BranchPlantCode = '6410';
	debugger;
	LoadActiveVariables($sessionStorage, $state, $rootScope);
	$scope.IsRefreshGrid = false;
	var page = $location.absUrl().split('#/')[1];

	$scope.ChangeBayGlobally = $scope.LoadSettingInfoByName('ChangeBayRequestForGlobal', 'int');
	if ($scope.ChangeBayGlobally === "" || $scope.ChangeBayGlobally === 0) {
		$scope.ChangeBayGlobally = false;
	} else {
		$scope.ChangeBayGlobally = true;
	}
	
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


	

	$scope.ViewControllerName = page;

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

	$scope.GetAllBayList = function () {
		$rootScope.Throbber.Visible = true;


		var orderDTO = {
			RoleId: 0

		};
		ManageOrderService.GetAllBayList(orderDTO).then(function (response) {
			debugger;
			$scope.BayList = response.data;
			$scope.BayAllList = $scope.BayList.filter(function (el) { return el.LocationCode === $scope.BranchPlantCode; });
			
			$rootScope.Throbber.Visible = false;
			//$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderGridCust_RecordSaved), '', 3000);
			//$scope.RefreshDataGrid();

		});
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
			UserName: $rootScope.LoginUserName,
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

	$scope.LoadCapsuleDetails();




	//#region Grid Configuration
	$scope.LoadGridConfigurationData = function () {
		debugger;
		var objectId = 11174;
		PageControlName = "ForkLiftActivityView";




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




			$scope.GridColumnList = response.data.Json.GridColumnList;

			var ld = JSON.stringify(response.data);
			var ColumnlistinJson = JSON.parse(ld);

			$scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList;

			//$scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList.filter(function (el) { return el.IsDefault === '1' });




			$scope.LoadSalesAdminApprovalGrid();

			if ($scope.IsRefreshGrid === true) {
				$scope.RefreshDataGrid();
			}

		});


	}


	$scope.LoadGridConfigurationData();



	$scope.LoadSalesAdminApprovalGrid = function () {

		debugger;
		console.log("1" + new Date());

		var SalesAdminApprovalData = new DevExpress.data.CustomStore({
			load: function (loadOptions) {
				if (loadOptions.take !== undefined && loadOptions.take !== null) {

					console.log("Load Order list Call start " + new Date());
					var orderSearchDTO = $scope.CreateWhereExpressionForGrid(loadOptions);
					var DataResponseForLoadOrderListGrid = ManageOrderService.LoadForkListActivityViewDetails(orderSearchDTO);
					return $q.all([
						DataResponseForLoadOrderListGrid

					]).then(function (resp) {

						$scope.IsPageLoad = false;
						var ResponseForLoadOrderListGrid = resp[0];

						console.log("Load Order list Call  get Data " + new Date());


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
									item.BayCodeForCheck = item.BayCode;

								});

								console.log("3" + new Date());


								console.log("Load Historicallist Call   return Data " + new Date());

								return { data: ListData, totalCount: parseInt(totalcount) };
								$rootScope.Throbber.Visible = false;

							}
						}





					});


				}
			}
		});






		$scope.ForkLiftActivityGrid = {
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
						$("#ForkLiftActivityGrid").dxDataGrid("instance").updateDimensions();
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
			filterRow: {
				visible: false,
				applyFilter: "auto"
			},
			headerFilter: {
				visible: false,
				allowSearch: false
			},
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

		var BayName = "";
		var BayNameCriteria = "";

		var SoldToName = "";
		var SoldToNameCriteria = "";

		var TruckSize = "";
		var TruckSizeCriteria = "";

		var TruckNumber = "";
		var TruckNumberCriteria = "";

		var AssignedTime = "";
		var AssignedTimeCriteria = "";
		var AssignedEndTime = "";
		var AssignedEndTimeCriteria = "";

		var StartTime = "";
		var StartTimeCriteria = "";
		var StartEndTime = "";
		var StartEndTimeCriteria = "";



		var Status = "";
		var StatusCriteria = "";


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
						columnValues = columnValues + ",'" + splitColumnValue[2] + "'";
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
			OrderByCriteria: OrderByCriteria

			
		};

		$scope.RequestDataFilter = requestData;


		$scope.OrderSearchParameterList = OrderSearchParameterList;

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

	$scope.RefreshDataGrid = function () {
		$scope.IsGridLoadCompleted = false;
		$scope.SalesAdminApprovalList = [];
		var dataGrid = $("#ForkLiftActivityGrid").dxDataGrid("instance");
		dataGrid.refresh();
		//
		//dataGrid = dataGrid.option("dataSource");
		//if (dataGrid != undefined) {
		//    dataGrid.store.load();
		//}
	}

	$rootScope.GridRecallForStatus = function () {
		
		$scope.IsRefreshGrid = true;
		$scope.GridConfigurationLoaded = false;
		$scope.LoadGridConfigurationData();
	}



	$scope.onChangeClick = function (e, item) {


		debugger;
		//$rootScope.Throbber.Visible = true;

		//$scope["BayList" + item.UserId] = [];
		$scope.SelectedBayCode = item.BayCode;
		$scope.BayAllListForkLift = [];

		item.showShiftDropDown = true;

		var orderDTO = {
			RoleId: 17

		};
		ManageOrderService.GetAllBayListForForkLift(orderDTO).then(function (response) {

			debugger;
			if (typeof response.data !== "undefined") {
				$scope.BayAllListForkLift = response.data;				

			}

			item.BayCode = item.BayCodeForCheck;

			//$rootScope.Throbber.Visible = false;

		});




	};

	$scope.ClearBranchPlant = function (item) {
		debugger;
		item.showShiftDropDown = false;

		if (item.BayCodeForCheck == "" || item.BayCodeForCheck == undefined && item.BayCodeForCheck == null) {
			item.BayCode = undefined;
		}

		if (item.BayCodeForCheck !== item.BayCode) {
			item.BayCode = item.BayCodeForCheck;
		}	

	};

	$scope.SelectedBranchPlantTemp = '';
	$scope.OrderDetailsTemp = [];
	$scope.IsBranchPlantAlreadyAssingedForRow = false;

	$scope.EditRowForBranchPlant = "";

	$scope.SaveBranchPlant = function (e, item) {
		debugger;
		


	};



	$scope.getSelectedShift = function (assignBay,userId) {
		debugger;
		
		$scope.UpdateBranchPlantSelectedForParticularRowEnquiry(assignBay, userId)
		
	};





	$scope.UpdateBranchPlantSelectedForParticularRowEnquiry = function (assignBay, UserId) {
		debugger;
		var orderDTO = {
			UserId: UserId,
			BayCode: assignBay,
			

		};


		ManageOrderService.UpdateBayForForkListDriver(orderDTO).then(function (response) {			
			$rootScope.Throbber.Visible = false;			
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_BranchPlantUpdated), '', 3000);
			$scope.RefreshDataGrid();
		});
	};


	$ionicModal.fromTemplateUrl('WarningMessageForFLDTask.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	}).then(function (modal) {

		$scope.FLDTaskWarningMessagePopup = modal;
	});
	$scope.CloseFLDTaskWarningMessagePopup = function () {
		$scope.FLDTaskWarningMessagePopup.hide();
	};
	$scope.OpenFLDTaskWarningMessagePopup = function () {
		$scope.FLDTaskWarningMessagePopup.show();
	};


	$scope.ChangeBayAccToConfiguration = function (assignBay, userId) {
		debugger;
		if (assignBay != undefined) {
			if ($scope.ChangeBayGlobally) {
				var selectedBayList = $scope.SalesAdminApprovalList.filter(function (el) { return el.BayCode === $scope.SelectedBayCode; });
				if (selectedBayList.length > 0) {
					if (selectedBayList[0].StartTime != undefined) {
						$scope.OpenFLDTaskWarningMessagePopup();
						$scope.AssignRequestBay = assignBay;
						$scope.AssignRequestUserId = userId;
						$scope.SelectedBayDetailList = selectedBayList[0];
					} else {
						$scope.getSelectedShift(assignBay, userId);
					}
				}
			} else {
				$scope.getSelectedShift(assignBay, userId);
			}
		} else {
			$rootScope.ValidationErrorAlert("Please select bay", 3000);
		}
		
	}


	$scope.ChangeBayWarningYes = function () {
		$rootScope.Throbber.Visible = true;
		debugger;
		var orderDTO = {
			UserId: $scope.AssignRequestUserId,
			BayCode: $scope.AssignRequestBay,


		};


		ManageOrderService.UpdateRequestBay(orderDTO).then(function (response) {
			$rootScope.Throbber.Visible = false;
			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ForkLiftReassigned), '', 3000);
			$scope.CloseFLDTaskWarningMessagePopup();
			$scope.ClearBranchPlant($scope.SelectedBayDetailList);
			
			
		});
	}

	




});