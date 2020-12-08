angular.module( "glassRUNProduct" ).controller( 'ControlTowerController', function ( $scope, $q, $state, $timeout, $ionicModal, $location, pluginsService, $rootScope, $sessionStorage, GrRequestService ) {
	// #region Session
	LoadActiveVariables( $sessionStorage, $state, $rootScope );
	// #endregion
	$scope.WoodenPalletCode = '0';
	$rootScope.TotalOrderCount = '0';
	$rootScope.TotalAttentionOrderCount = '0';
	// #region PageHeader
	$rootScope.res_PageHeaderTitle = 'Console / Tracker';
	// #endregion

	// #region Throbber
	$scope.LoadThrobberForPage = function () {
		if ( $rootScope.Throbber !== undefined ) {
			$rootScope.Throbber.Visible = false;
		} else {
			$rootScope.Throbber = {
				Visible: false
			};
		}
	};

	$scope.SelectedActualDate = {
		ActualDateForSelected: ''
	}

	$scope.ReasonCodeJson = {
		ReasonCode: 0,
		ReasonDescription: ''
	}
	$scope.LoadThrobberForPage();
	// #endregion
	$scope.LoadSettingInfoByName = function ( settingName, returnValueDataType ) {

		var settingValue = "";
		if ( $sessionStorage.AllSettingMasterData != undefined ) {
			var settingMaster = $sessionStorage.AllSettingMasterData.filter( function ( el ) { return el.SettingParameter === settingName; } );
			if ( settingMaster.length > 0 ) {
				settingValue = settingMaster[0].SettingValue;
			}
		}
		if ( returnValueDataType === "int" ) {
			if ( settingValue !== "" ) {
				settingValue = parseInt( settingValue );
			}
		} else if ( returnValueDataType === "float" ) {
			if ( settingValue !== "" ) {
				settingValue = parseFloat( settingValue );
			}
		} else {
			settingValue = settingValue;
		}
		return settingValue;
	}
	$scope.WoodenPalletCode = $scope.LoadSettingInfoByName( 'WoodenPalletCode', 'string' );

	$scope.myFilter = function ( item ) {
		return item.IsPackingItem === '0';
	};

	// #region ControlTower

	var page = $location.absUrl().split( '#/' )[1];
	$scope.ViewControllerName = page;

	// #region LoadInformationBox

	$scope.InformationBoxList = [];

	$scope.LoadInformationBox = function () {
		$scope.InformationBoxList = [];
		var requestData =
		{
			ServicesAction: 'LoadControlTowerInformationBox',
			RoleId: $rootScope.RoleId,
			UserId: $rootScope.UserId
		};

		var jsonobject = {};
		jsonobject.Json = requestData;
		var consolidateApiParamater =
		{
			Json: requestData
		};
		GrRequestService.ProcessRequest( consolidateApiParamater ).then( function ( response ) {
			debugger;
			if ( response.data.Json !== undefined ) {
				if ( response.data.Json.InformationBoxList.length > 0 ) {
					$scope.InformationBoxList = response.data.Json.InformationBoxList;
				}
			}
			else {
				$scope.InformationBoxList = [];
			}
		} );
	};

	$scope.LoadInformationBox();

	$scope.InformationBoxRoleWiseAccess = function ( controlId ) {

		var flag = false;
		var value = $rootScope.pageContrlAcessData[controlId];

		if ( value === '1' || value === '2' ) {
			flag = true;
		}

		return flag;
	};

	// #endregion

	$rootScope.SalesOrderNumber = '';
	$rootScope.OrderNumber = '';

	// #region SearchControl
	$scope.SearchControl = {
		SearchBox: ''
	};

	$scope.ClearSearchBox = function () {
		$scope.SearchControl.SearchBox = '';
	};
	// #endregion

	// #region Console_sidebar

	$scope.toggleConsole_sidebar = function () {
		$scope.Console_sidebarScroll();

		if ( $( '#Console_sidebar' ).hasClass( 'open' ) ) $( '#Console_sidebar' ).removeClass( 'open' );
		else $( '#Console_sidebar' ).addClass( 'open' );
	};

	$scope.Console_sidebarScroll = function () {
		$( '.Console_sidebar .inner' ).mCustomScrollbar( "destroy" );
		scroll_height = "100%";
		$( '.Console_sidebar .inner' ).mCustomScrollbar( {
			scrollButtons: {
				enable: false
			},
			autoHideScrollbar: true,
			scrollInertia: 150,
			theme: "light",
			set_height: scroll_height,
			advanced: {
				updateOnContentResize: true
			}
		} );

		//if ($('body').hasClass('Console_sidebar-top')) {
		//    destroySideScroll();
		//}
	};

	// #endregion




	$ionicModal.fromTemplateUrl( 'FeedbackView/OrderFeedbackView.html', {
		scope: $scope,
		animation: 'fade-in-scale',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	} ).then( function ( modal ) {
		$scope.OrderFeedbackViewCodePopup = modal;
	} );


	$scope.LoadFeedBackForProduct = function ( ProductCode ) {
		debugger;

		$scope.OrderFeedbackViewCodePopup.show();
		$rootScope.FeedBackProductCode = ProductCode;
		$rootScope.feedbackId = "";
		$rootScope.SubFeedbackId = "";
		$rootScope.ParentOrderFeedbackReplyId = "";
		$rootScope.OpenAddFeedbackpopup();
		$rootScope.Throbber.Visible = false;
	}

	$scope.OpenOrderFeedbackViewCodePopup = function () {
		debugger;

		$scope.OrderFeedbackViewCodePopup.show();
		$rootScope.feedbackId = "";
		$rootScope.SubFeedbackId = "";
		$rootScope.ParentOrderFeedbackReplyId = "";
		$rootScope.OpenAddFeedbackpopup();

	}

	$scope.CloseOrderFeedbackViewCodePopup = function () {
		debugger;
		$rootScope.FeedBackProductCode = "";
		$rootScope.ResetFeedbackFields();
		$scope.OrderFeedbackViewCodePopup.hide();

	}


	$ionicModal.fromTemplateUrl( 'WarningMessage.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	} ).then( function ( modal ) {

		$scope.WarningMessageControl = modal;
	} );


	$scope.CloseWarningConfirmation = function () {
		$scope.WarningMessageControl.hide();
	};

	$scope.OpenWarningConfirmation = function () {

		if ( $rootScope.IsRecordAddedToFeedback === true ) {
			$scope.WarningMessageControl.show();
		}
		else {
			$scope.CloseOrderFeedbackViewCodePopup();
		}


	};

	$scope.WarningYes = function () {

		$scope.CloseWarningConfirmation();
		$scope.CloseOrderFeedbackViewCodePopup();

	};



	$ionicModal.fromTemplateUrl( 'DocWarningMessage.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	} ).then( function ( modal ) {

		$scope.DocWarningMessageControl = modal;
	} );


	$scope.CloseDocWarningConfirmation = function () {
		$scope.DocWarningMessageControl.hide();
	};

	$scope.OpenDocWarningConfirmation = function ( miscellaneousDocumentId ) {
		$scope.DeleteMiscellaneousDocumentId = miscellaneousDocumentId;
		$scope.DocWarningMessageControl.show();

	};

	$scope.DocWarningYes = function () {

		$scope.RemoveAddedDocument( $scope.DeleteMiscellaneousDocumentId );

	};

	// #region Grid Configuration

	$scope.GridColumnList = [];
	$scope.LoadGridViewConfigurationData = function () {
		debugger;
		var gridrequestData =
		{
			ServicesAction: 'LoadGridConfiguration',
			RoleId: $rootScope.RoleId,
			UserId: $rootScope.UserId,
			CultureId: $rootScope.CultureId,
			ObjectId: 222, //222 --prod
			ObjectName: 'IndividualOrderGrid',
			PageName: $rootScope.PageName,
			ControllerName: page
		};
		var gridconsolidateApiParamater =
		{
			Json: gridrequestData
		};

		GrRequestService.ProcessRequest( gridconsolidateApiParamater ).then( function ( response ) {
			debugger;
			if ( response.data.Json !== undefined ) {
				$scope.GridColumnList = response.data.Json.GridColumnList;
			} else {
				$scope.GridColumnList = [];
			}
		} );
	};

	$scope.LoadGridViewConfigurationData();

	$scope.IsPeddingRequired = false;

	$scope.LoadRepeaterByConfiguration = function ( property ) {

		var flag = false;
		var rptcol = $scope.GridColumnList.filter( function ( el ) { return el.PropertyName === property; } );
		if ( rptcol.length > 0 ) {
			if ( rptcol[0].IsAvailable === "1" ) {
				flag = true;

				if ( rptcol[0].PropertyName === "CollectionSection" || rptcol[0].PropertyName === "DeliverySection" ) {
					$scope.IsPeddingRequired = true;
				}

			}
		}
		return flag;
	};

	$scope.CheckForDeposite = function ( TotalDepositeAmount ) {
		debugger;
		var flag = false;
		if ( parseFloat( TotalDepositeAmount ) > 0 ) {
			flag = true;

		}
		return flag;
	};


	// #endregion






	// #region WorkFlowActivityLog

	$scope.WorkFlowActivityLogList = [];
	$scope.ASNDetailList = [];
	$scope.OrderId = [];

	$scope.LoadedOrderId = "";

	$rootScope.PopulateASNDetails = function ( orderdata ) {
		debugger;
		$rootScope.Throbber.Visible = true;
		$scope.IsShowDeliveryConfirmationButton = orderdata.IsShowDeliveryConfirmationButton;
		$scope.WorkFlowActivityLogList = [];
		$scope.Orderdata = [];

		$scope.Orderdata = orderdata;
		var requestWorkflowData =
		{
			ServicesAction: 'LoadWorkFlowActivityLog',
			OrderId: orderdata.OrderId,
			RoleId: $rootScope.RoleId,
			UserId: $rootScope.UserId
		};

		var jsonobject = {};
		jsonobject.Json = requestWorkflowData;
		var consolidateWorkflowApiParamater =
		{
			Json: requestWorkflowData
		};

		$scope.OrderId = orderdata.OrderId;
		$scope.LoadedOrderId = orderdata.OrderId;

		$scope.ShipToCode = "";
		$scope.ShipToName = "";
		$scope.SoldToCode = "";
		$scope.SoldToName = "";

		$scope.disableFilter = true;

		var OrderDocumentList = [];



		var requestData =
		{
			ServicesAction: 'LoadOrderDocumentList',
			OrderId: orderdata.OrderId,
			RoleId: $rootScope.RoleId,
			CultureId: $rootScope.CultureId

		};
		var consolidateApiParamater =
		{
			Json: requestData
		};


		var productrequestData =
		{
			ServicesAction: 'LoadOrderProductByOrderId',
			OrderId: orderdata.OrderId,
			RoleId: $rootScope.RoleId,
			CultureId: $rootScope.CultureId
		};
		var consolidateproductApiParamater =
		{
			Json: productrequestData
		};

		var WorkflowActivityLogData = GrRequestService.ProcessRequest( consolidateWorkflowApiParamater );
		var OrderDetailsRequest = GrRequestService.ProcessRequest( consolidateApiParamater );
		var OrderProductRequest = GrRequestService.ProcessRequest( consolidateproductApiParamater );


		$q.all( [
			WorkflowActivityLogData,
			OrderDetailsRequest,
			OrderProductRequest
		] ).then( function ( resp ) {
			debugger;
			var response = resp[0];
			var responseOrder = resp[1];
			var responseproduct = resp[2];

			$rootScope.Throbber.Visible = false;
			debugger;


			if ( response.data !== undefined ) {
				if ( response.data.Json != undefined ) {
					if ( response.data.Json.WorkFlowActivityLogList.length > 0 ) {
						$scope.WorkFlowActivityLogList = response.data.Json.WorkFlowActivityLogList;
						if ( $scope.WorkFlowActivityLogList.length > 0 ) {
							var ParentWorkFlowActivity = $scope.WorkFlowActivityLogList.filter( function ( el ) { return el.IsParent === '1'; } );
							if ( ParentWorkFlowActivity.length > 0 ) {
								for ( var i = 0; i < ParentWorkFlowActivity.length; i++ ) {

									var ChildWorkFlowActivity = $scope.WorkFlowActivityLogList.filter( function ( el ) { return el.ParentId === ParentWorkFlowActivity[i].WorkFlowCurrentStatusCode && el.IsParent === '0'; } );
									if ( ChildWorkFlowActivity.length > 0 ) {
										if ( ChildWorkFlowActivity[ChildWorkFlowActivity.length - 1].ActivityStartTime !== "1900-01-01T00:00:00" ) {
											//ParentWorkFlowActivity[i].ActivityStartTime = ChildWorkFlowActivity[ChildWorkFlowActivity.length - 1].ActivityStartTime;
										}
										if ( ChildWorkFlowActivity[0].ActivityEndTime !== "1900-01-01T00:00:00" ) {
											//ParentWorkFlowActivity[i].ActivityEndTime = ChildWorkFlowActivity[0].ActivityEndTime;
										}
									}
								}
								$scope.WorkflowActivityLogData = [];
								for ( var i = 0; i < ParentWorkFlowActivity.length; i++ ) {
									$scope.WorkflowActivityLogData.push( ParentWorkFlowActivity[i] );
									var ChildWorkFlowActivity = $scope.WorkFlowActivityLogList.filter( function ( el ) { return el.ParentId === ParentWorkFlowActivity[i].WorkFlowCurrentStatusCode && el.IsParent === '0'; } );
									for ( var j = 0; j < ChildWorkFlowActivity.length; j++ ) {
										$scope.WorkflowActivityLogData.push( ChildWorkFlowActivity[j] );
									}

								}
							}
						}
					}
				}
			}
			else {
				$scope.WorkFlowActivityLogList = [];
			}

			if ( responseOrder.data !== undefined ) {
				if ( responseOrder.data.Json != undefined ) {
					OrderDocumentList = [];
					if ( responseOrder.data.Json.OrderList !== undefined ) {
						$scope.ASNDetailList = responseOrder.data.Json.OrderList;


						var orderlist = $scope.ASNDetailList.filter( function ( el ) { return parseInt( el.OrderId ) === parseInt( orderdata.OrderId ); } );
						if ( orderlist.length > 0 ) {

							if ( orderlist[0].SurveyFormList !== undefined ) {
								if ( orderlist[0].SurveyFormList.length > 0 ) {

								}
							}

							$scope.ShipToCode = orderlist[0].ShipToCode;
							$scope.ShipToName = orderlist[0].ShipToName;
							$scope.SoldToCode = orderlist[0].SoldToCode;
							$scope.SoldToName = orderlist[0].SoldToName;
							$scope.ShipToAddress = orderlist[0].ShipToAddress;
							$scope.RejectionReasonCode = orderlist[0].RejectionReasonCode;
							$scope.RejectionComment = orderlist[0].RejectionComment;
							$scope.CurrentState = orderlist[0].CurrentState;
							$scope.OrderDriverName = orderlist[0].DriverName;
							$scope.OrderTransporterName = orderlist[0].TransporterName;
							$scope.OrderTruckSize = orderlist[0].TruckSize;
							$scope.OrderTruckPlateNumber = orderlist[0].TruckPlateNumber;


						}
					}
				}
			}


			if ( responseproduct.data !== undefined ) {
				$scope.OrderProductList = [];
				if ( responseproduct.data.Json.OrderList.OrderProductsList !== undefined ) {
					$scope.OrderProductList = responseproduct.data.Json.OrderList.OrderProductsList;

				}
			} else {
				$scope.OrderProductList = [];
			}

			$scope.Console_sidebarScroll();

			$( '#Console_sidebar' ).addClass( 'open' );
			//if (orderdata.ControlTowerOpen === undefined || orderdata.ControlTowerOpen === '0') {
			//$scope.toggleConsole_sidebar();
			//}
		} );

	};

	$scope.LoadSavedOrderDocumentList = function () {
		debugger;

		var requestData =
		{
			ServicesAction: 'LoadOrderDocumentList',
			OrderId: $scope.OrderId,
			RoleId: $rootScope.RoleId,
			CultureId: $rootScope.CultureId

		};
		var consolidateApiParamater =
		{
			Json: requestData
		};


		GrRequestService.ProcessRequest( consolidateApiParamater ).then( function ( responseOrder ) {

			if ( responseOrder.data !== undefined ) {
				if ( responseOrder.data.Json != undefined ) {

					if ( responseOrder.data.Json.OrderList !== undefined ) {
						$scope.ASNDetailList = responseOrder.data.Json.OrderList;

					}
				}
			}
			$rootScope.Throbber.Visible = false;
			$rootScope.ValidationErrorAlert( 'Document saved successfully.', 'success', 3000 );
			$scope.MiscellaneousOrderDocumentList = [];

		} );


	}

	// #region LoadOrderProductByOrderId
	//$scope.LoadOrderProductByOrderId = function (orderdata) {
	//};

	$rootScope.LoadWorkFlowActivityLog = function ( orderdata ) {
		$rootScope.PopulateASNDetails( orderdata );
	};

	// #endregion 

	// #region DownloadDocument

	$scope.DownloadDocument = function ( orderDocumentId, documentType, documentExtension ) {

		debugger;

		var orderRequestData =
		{
			ServicesAction: 'LoadOrderDocumentByOrderDocumentId',
			OrderDocumentId: orderDocumentId,
			DocumentType: documentType
		}
		var jsonobject = {};
		jsonobject.Json = orderRequestData;
		GrRequestService.ProcessRequestForServiceBuffer( jsonobject ).then( function ( response ) {

			var byteCharacters1 = response.data;
			if ( response.data !== undefined ) {
				var byteCharacters = response.data;

				var blob = new Blob( [byteCharacters], {
					type: "application/Pdf"
				} );

				if ( blob.size > 0 ) {
					var filName = documentType + orderDocumentId + "." + documentExtension;
					saveAs( blob, filName );
				} else {
					$rootScope.ValidationErrorAlert( 'Document not generated.', '', 3000 );
				}
			} else {
				$rootScope.ValidationErrorAlert( 'Document not generated.', '', 3000 );
			}
		} );
	}

	// #endregion

	// #region LoadOrderDocument

	$scope.OrderDocumentList = [];
	$scope.MiscellaneousOrderDocumentList = [];
	$rootScope.FileUploadJSON = {
		FileName: '',
		FileSrc: '',
		FileFormat: '',
		SelectFileFormat: '',
		SelectFileSize: ''
	}

	$rootScope.ngFileAllowextension = 'pdf,jpg,png';
	$rootScope.ngFileAllowsize = '3';


	$scope.MiscellaneousOrderDocumentJSON = {
		MiscellaneousDocumentId: 0,
		OrderId: '',
		OrderDocumentId: '',
		DocumentTypeId: '',
		DocumentTypeName: '',
		DocumentDescription: '',
		FileName: '',
		FileSrc: '',
		FileFormat: ''
	};

	$scope.fileupload = {
		File: ''
	}

	$scope.LoadOrderDocumentTypes = function () {

		var requestData =
		{
			ServicesAction: 'LoadOrderDocumentTypes',
			LoginId: $rootScope.UserId,
			PageName: $scope.ViewControllerName

		};
		var consolidateApiParamater =
		{
			Json: requestData,
		};
		GrRequestService.ProcessRequest( consolidateApiParamater ).then( function ( response ) {
			debugger;
			if ( response.data.Json !== undefined ) {
				if ( response.data.Json.OrderDocumentTypeList.length > 0 ) {
					$scope.OrderDocumentList = [];
					$scope.OrderDocumentList = response.data.Json.OrderDocumentTypeList;
				}
			}
			else {
				$scope.OrderDocumentList = [];
			}
		} );
	}

	//$scope.LoadOrderDocumentTypes();

	//$scope.LoadOrderDocumentTypes = function () {
	//    var orderDocumentList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'OrderDocument'; });
	//    
	//    if (orderDocumentList.length > 0) {
	//        $scope.OrderDocumentList = orderDocumentList;
	//    }
	//};

	$scope.ItemSearchInputDefaultSetting = function () {
		$scope.SearchControl = {
			InputItem: '',
			FilterAutoCompletebox: '',
			InputCompany: '',
			FilterCompanyAutoCompletebox: '',
			InputCollection: '',
			FilterCollectionAutoCompletebox: '',
		};

		$scope.selectedRow = -1;
		$scope.showItembox = false;
		$scope.foundResult = false;
	}
	$scope.ItemSearchInputDefaultSetting();

	$scope.ItemInputSelecteChangeEvent = function ( input ) {
		if ( input.length > 0 ) {

			$scope.showItembox = true;
			$scope.selectedRow = 0;
		} else {
			$scope.showItembox = false;
			$scope.selectedRow = -1;
		}
		$scope.SearchControl.FilterAutoCompletebox = input;
	}

	$ionicModal.fromTemplateUrl( 'OrderDocumentUpload.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	} ).then( function ( modal ) {

		$scope.OrderDocumentUpload = modal;
	} );

	$scope.LoadOrderDocument = function () {

		$scope.LoadOrderDocumentTypes();

		var requestData =
		{
			ServicesAction: 'LoadOrderDocumentListDocs',
			OrderId: $scope.OrderId
		};
		var consolidateApiParamater =
		{
			Json: requestData
		};

		GrRequestService.ProcessRequest( consolidateApiParamater ).then( function ( response ) {

			if ( response.data !== undefined ) {
				OrderDocumentList = [];
				if ( response.data.Json.OrderDocumentList !== undefined ) {
					$scope.MiscellaneousOrderDocumentList = [];

					for ( i = 0; i < response.data.Json.OrderDocumentList.length; i++ ) {
						var miscellaneousDocument = {
							MiscellaneousDocumentId: generateGUID(),
							OrderDocumentId: response.data.Json.OrderDocumentList[i].OrderDocumentId,
							OrderId: response.data.Json.OrderDocumentList[i].OrderId,
							DocumentTypeId: response.data.Json.OrderDocumentList[i].DocumentTypeId,
							DocumentTypeName: response.data.Json.OrderDocumentList[i].DocumentType,
							DocumentDescription: response.data.Json.OrderDocumentList[i].DocumentDescription,
							DocumentFormat: response.data.Json.OrderDocumentList[i].DocumentFormat,
							FileName: response.data.Json.OrderDocumentList[i].FileName,
							FileSrc: response.data.Json.OrderDocumentList[i].FileSrc,
							FileFormat: response.data.Json.OrderDocumentList[i].FileFormat,
							IsActive: 1
						}

						$scope.MiscellaneousOrderDocumentList.push( miscellaneousDocument );
					}
				} else {
				}
			} else {
			}
		} );
		$scope.OpenOrderDocumentUploadPopup();
	}

	$scope.CloseOrderDocumentUploadPopup = function () {
		$scope.showItembox = false;
		$scope.MiscellaneousOrderDocumentList = [];
		$scope.OrderDocumentUpload.hide();
	};

	$scope.OpenOrderDocumentUploadPopup = function () {
		$scope.showItembox = false;

		$scope.OrderDocumentUpload.show();
	};

	$scope.ShowItemListBox = function () {
		$scope.showItembox = !$scope.showItembox;
	}



	$scope.inputDocumentType_Click = function ( LookUpId ) {
		debugger;
		var orderDocumentList = $scope.OrderDocumentList.filter( function ( el ) { return el.LookUpId === LookUpId; } );
		if ( orderDocumentList.length > 0 ) {
			$scope.SearchControl.InputItem = orderDocumentList[0].Name;
			$rootScope.FileUploadJSON.SelectFileFormat = orderDocumentList[0].Field9;
			$rootScope.FileUploadJSON.SelectFileSize = orderDocumentList[0].Field10;
		}
		$scope.showItembox = false;
	}

	$scope.ClearItemInputSearchbox = function () {
		$scope.SearchControl.InputItem = "";
		$scope.showItembox = false;
	}

	$scope.AddNewDocumentType = function () {


		if ( $scope.SearchControl.InputItem === "" ) {
			alert( 'Please Select Document Type.' );
			return;
		}

		var lookupItem = {
			Name: $scope.SearchControl.InputItem,
			IsActive: true,
			CreatedBy: $rootScope.UserId
		};

		var LookUpList = [];
		LookUpList.push( lookupItem );

		var requestData =
		{
			ServicesAction: 'SaveOrderDocumentType',
			LoginId: $rootScope.UserId,
			PageName: $scope.ViewControllerName,
			LookUpList: LookUpList
		};

		var consolidateApiParamater =
		{
			Json: requestData
		};

		GrRequestService.ProcessRequest( consolidateApiParamater ).then( function ( response ) {

			//if ($scope.GridColumnId !== 0) {
			//    $rootScope.ValidationErrorAlert('Record updated successfully', 'success', 3000);
			//}
			//else {
			//    $rootScope.ValidationErrorAlert('Record saved successfully', 'success', 3000);
			//}
			$scope.LoadOrderDocumentTypes();
		} );
	};

	$scope.AddMiscellaneousDocument = function () {

		debugger;
		//Add
		if ( $scope.MiscellaneousOrderDocumentJSON.MiscellaneousDocumentId === 0 ) {
			if ( $scope.SearchControl.InputItem !== 0 && $scope.SearchControl.InputItem !== '' && $scope.SearchControl.InputItem !== undefined ) {

				var fileExt = $rootScope.FileUploadJSON.FileName.split( '.' ).pop();
				var fileExtList = $rootScope.FileUploadJSON.SelectFileFormat.toUpperCase();
				var fileExtList = fileExtList.split( ',' );
				var isvalid = fileExtList.indexOf( fileExt.toUpperCase() );

				if ( isvalid == -1 ) {
					$rootScope.ValidationErrorAlert( 'Please select valid document to upload.', '', 3000 );
					return false;
				}


				if ( $rootScope.FileUploadJSON.FileName !== "" && $rootScope.FileUploadJSON.FileName !== undefined ) {
					var OrderDocumentList = $scope.OrderDocumentList.filter( function ( el ) { return el.Name === $scope.SearchControl.InputItem; } );
					var miscellaneousDocument = {
						MiscellaneousDocumentId: generateGUID(),
						OrderId: $scope.OrderId,
						DocumentTypeId: OrderDocumentList[0].LookUpId,
						DocumentTypeName: OrderDocumentList[0].Name,
						DocumentDescription: $scope.MiscellaneousOrderDocumentJSON.DocumentDescription,
						FileName: $rootScope.FileUploadJSON.FileName,
						FileSrc: $rootScope.FileUploadJSON.FileSrc.split( ',' ).pop(),
						FileFormat: $rootScope.FileUploadJSON.FileName.split( '.' ).pop(),
						IsActive: 1
					}

					$scope.MiscellaneousOrderDocumentList.push( miscellaneousDocument );
					$scope.ClearMiscellaneousDocument();
				} else {
					$rootScope.ValidationErrorAlert( 'Please Select Document.', '', 3000 );
				}

			} else {
				$rootScope.ValidationErrorAlert( 'Please Select DocumentType.', '', 3000 );
			}
		} else {
			//var user = $scope.IndividualLicenseUserList.filter(function (el) { return el.IndividualLicenseUserId === $scope.IndividualLicenseVariable.IndividualLicenseUserId });
			//$scope.IndividualLicenseUserList = $scope.IndividualLicenseUserList.filter(function (el) { return el.IndividualLicenseUserId !== $scope.IndividualLicenseVariable.IndividualLicenseUserId; });

			//var UserDetailList = $scope.UserDetailList.filter(function (el) { return el.LoginId === $scope.IndividualLicenseVariable.UserId; });
			//var IndividualLicenseUser = {
			//    IndividualLicenseUserId: generateGUID(),
			//    UserName: UserDetailList[0].UserName,
			//    LoginId: UserDetailList[0].LoginId,
			//    ActivationCode: $scope.LicenseJSON.ActivationCode,
			//    IsActive: 1,
			//    IsAdded: true
			//}

			//$scope.IndividualLicenseUserList.push(IndividualLicenseUser);
			//$scope.ClearIndividualLicenseUser();
		}
	}

	$scope.RemoveAddedDocument = function ( guId ) {
		debugger;
		if ( $scope.MiscellaneousOrderDocumentList !== undefined ) {
			$scope.MiscellaneousOrderDocumentList = $scope.MiscellaneousOrderDocumentList.filter( function ( el ) { return el.MiscellaneousDocumentId !== guId; } );
		}
		$scope.DeleteMiscellaneousDocumentId = 0;
		$scope.CloseDocWarningConfirmation();
	}

	$scope.SaveMiscellaneousOrderDocument = function () {
		if ( $scope.MiscellaneousOrderDocumentList.length > 0 ) {
			$rootScope.Throbber.Visible = true;
			var requestData =
			{
				ServicesAction: 'SaveMiscellaneousOrderDocument',
				OrderDocumentList: $scope.MiscellaneousOrderDocumentList
			};

			var consolidateApiParamater =
			{
				Json: requestData
			};

			GrRequestService.ProcessRequest( consolidateApiParamater ).then( function ( response ) {
				debugger;
				$scope.LoadSavedOrderDocumentList();

				//if ($scope.GridColumnId !== 0) {
				//    $rootScope.ValidationErrorAlert('Record updated successfully', 'success', 3000);
				//}
				//else {
				//    $rootScope.ValidationErrorAlert('Record saved successfully', 'success', 3000);
				//}
			} );
		}
		else {
			$rootScope.ValidationErrorAlert( 'Please add document.', 'success', 3000 );
		}
	};

	$scope.ClearMiscellaneousDocument = function () {
		$scope.MiscellaneousOrderDocumentJSON.MiscellaneousDocumentId = 0;
		$scope.SearchControl.InputItem = "";
		$scope.MiscellaneousOrderDocumentJSON.DocumentTypeId = "";
		$scope.MiscellaneousOrderDocumentJSON.DocumentTypeName = "";
		$scope.MiscellaneousOrderDocumentJSON.DocumentDescription = "";
		$rootScope.FileUploadJSON.FileSrc = "";
		$rootScope.FileUploadJSON.FileName = "";
		$rootScope.FileUploadJSON.FileFormat = "";
	}

	$scope.LoadSalesOrderNumberInformation = function () {

		if ( $scope.LoadedOrderId !== "" ) {

			$scope.LoadedOrderId = "";
		} else {
			$scope.LoadedOrderId = $scope.OrderId;
		}

	}

	// #endregion

	$ionicModal.fromTemplateUrl( 'OrderLog.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	} ).then( function ( modal ) {

		$scope.OrderLogListModal = modal;
	} );

	$scope.CloseOrderLogPopup = function () {
		$scope.OrderLogListModal.hide();
	};

	$scope.OpenOrderLogPopup = function () {
		$scope.OrderLogListModal.show();
	};

	$scope.OrderLogList = [];
	$scope.LoadAllLog = function ( dataSource, logType, logSubHeader ) {
		$scope.logSubHeaderTitle = logSubHeader
		$scope.logType = logType;
		$scope.OrderLogList = dataSource;
		$scope.OpenOrderLogPopup();
	}


	// #endregion

	//# load product quantity color.

	$scope.LoadProductQuantityColor = function ( productQuantity, productCollectedQuantity, productActualCollectedQuantity ) {

		var className = "";
		if ( productCollectedQuantity !== undefined && productCollectedQuantity !== "0" ) {
			if ( productActualCollectedQuantity !== undefined && productActualCollectedQuantity !== "0" ) {
				if ( parseFloat( productCollectedQuantity ) === parseFloat( productActualCollectedQuantity ) ) {
					className = "correct_data";
				} else {
					className = "exception_data";
				}
			}
		}

		return className;
	}

	$scope.LoadClassNameForTime = function ( startDate, endDate ) {

		var className = "";
		if ( startDate !== undefined && startDate !== "" ) {
			var startdatel = new Date( startDate );
			if ( endDate !== undefined && endDate !== "" ) {
				var startdatel = new Date( startDate );
				var enddatel = new Date( endDate );
				if ( startdatel >= enddatel ) {
					className = "time_sectionbox_green";
				} else {
					className = "time_sectionbox_error";
				}
			} else {

				if ( new Date( startdatel ) < new Date() ) {
					className = "time_sectionbox_error";
				} else {
					className = "time_sectionbox_orange";
				}


			}
		}
		return className;
	}

	$scope.LoadProductTimeStatus = function ( startDate, endDate ) {
		var value = "Planned";
		if ( startDate !== undefined && startDate !== "" ) {
			if ( endDate !== undefined && endDate !== "" ) {

				if ( new Date( startDate ) >= new Date( endDate ) ) {
					value = "On Time";
				} else {
					value = "Late";
				}
			} else {
				if ( new Date( startDate ) < new Date() ) {
					value = "Late";
				} else {
					value = "In Progress";
				}
			}
		}
		return value;
	}

	$scope.DateDifferenceStartDateAndEndDate = function ( startdate, enddate ) {

		var startdate = new Date( startdate );
		var endDate = new Date( enddate );

		var diffTime = Math.abs( endDate.getTime() - startdate.getTime() );
		var diffDays = Math.ceil( diffTime / 60000 );

		return diffDays;
	}


	$scope.DateDifferenceDelayed_By = function ( startdate, enddate ) {


		var date1 = new Date( startdate );
		var date2 = new Date( enddate );
		var diffTime = Math.abs( date2.getTime() - date1.getTime() );
		var diffDays = Math.ceil( diffTime / ( 1000 * 60 * 60 * 24 ) );

		return diffDays;
	}


	$scope.ConvertDatetImeToUTCDateTimeFormat = function ( datetime ) {

		var datetimeformat = "";

		if ( datetime !== "" && datetime !== undefined && datetime !== null ) {

			var date = datetime.split( ' ' );
			datetime = date[0].split( '/' );
			if ( date.length > 1 ) {
				datetime = datetime[1] + "/" + datetime[0] + "/" + datetime[2] + " " + date[1];
			}
			else {
				datetime = datetime[1] + "/" + datetime[0] + "/" + datetime[2];
			}

			datetimeformat = new Date( datetime );
		}


		return datetimeformat;
	}

	$scope.ConvertDatetImeToDateTimeFormat = function ( datetime ) {
		debugger;
		var datetimeformat = "";

		if ( datetime !== "" && datetime !== undefined && datetime !== null ) {

			var date = datetime.split( 'T' );
			datetime = date[0].split( '-' );
			if ( date.length > 1 ) {
				datetime = datetime[1] + "/" + datetime[0] + "/" + datetime[2] + " " + date[1];
			}
			else {
				datetime = datetime[1] + "/" + datetime[0] + "/" + datetime[2];
			}

			datetimeformat = new Date( datetime );
		}


		return datetimeformat;
	}

	$rootScope.AttentionNeeded = '0';

	$scope.FilterOrderGrid = function ( informationType ) {
		debugger;
		if ( informationType === 'AttentionNeeded' ) {
			$rootScope.AttentionNeeded = '1';

			var dataGrid = $( "#OrderListGrid" ).dxDataGrid( "instance" );

			dataGrid.refresh();
		} else {
			$rootScope.AttentionNeeded = '0';

			var dataGrid = $( "#OrderListGrid" ).dxDataGrid( "instance" );

			dataGrid.refresh();
		}
	}


	$rootScope.LoadAttentionNeededOrders = function ( consolidateApiParamater ) {
		debugger;
		consolidateApiParamater.Json.ServicesAction = 'LoadOrderAttentionNeedCount';

		GrRequestService.ProcessRequest( consolidateApiParamater ).then( function ( response ) {
			debugger;
			if ( response.data.Json !== undefined ) {
				if ( response.data.Json.OrderList !== undefined ) {
					$rootScope.TotalAttentionOrderCount = response.data.Json.OrderList.AttentionNeeded;
				}
				else {
					$rootScope.TotalAttentionOrderCount = 0;
				}
			}
			else {
				$rootScope.TotalAttentionOrderCount = 0;
			}

		} );

	}

	$scope.DeliveryConfirmationPopup = false;
	//$ionicModal.fromTemplateUrl( 'DeliveryConfirmation.html', {
	//	scope: $scope,
	//	animation: 'fade-in',
	//	backdropClickToClose: false,
	//	hardwareBackButtonClose: false
	//} ).then( function ( modal ) {

	//	$scope.DeliveryConfirmation = modal;
	//} );
	$scope.InitializeDatePicker = function () {



		$( '.paymentDate' ).each( function () {


			$( this ).datetimepicker( {

				onSelect: function ( dateText, inst ) {



					if ( inst.id != undefined ) {
						angular.element( $( '#' + inst.id ) ).triggerHandler( 'input' );
					} else {
						angular.element( $( '#' + inst.inst.id ) ).triggerHandler( 'input' );
					}

					$scope.SelectedActualDate.ActualDateForSelected = dateText;


				},
				maxDate: new Date(),
				dateFormat: 'dd/mm/yy',
				prevText: '<i class="fa fa-angle-left"></i>',
				nextText: '<i class="fa fa-angle-right"></i>'
			} );
		} );


	}

	$scope.CloseDeliveryConfirmationPopup = function () {

		$scope.DeliveryConfirmationPopup = false;
	};

	$scope.OpenDeliveryConfirmationPopup = function () {


		$scope.DeliveryConfirmationPopup = true;
	};


	$scope.BindActualDateFrom = function () {
		debugger;
		$( '#PromisedDate' ).each( function () {
			$( '#PromisedDate' ).datepicker( {
				onSelect: function ( dateText, inst ) {

					if ( inst.id !== undefined ) {
						angular.element( $( '#' + inst.id ) ).triggerHandler( 'input' );

					}
				},

				dateFormat: 'dd/mm/yy',
				numberOfMonths: 1,
				isRTL: $( 'body' ).hasClass( 'rtl' ) ? true : false,
				prevText: '<i class="fa fa-angle-left"></i>',
				nextText: '<i class="fa fa-angle-right"></i>',
				showButtonPanel: false
			} );
		} );
	}




	$scope.BindActualDateFrom();


	$scope.LoadDeliveryConfirmationDetails = function ( orderId ) {
		debugger;
		$scope.LoadReasonCode( "ReasonCodeForDeliveryConfirmation" );
		$scope.OpenDeliveryConfirmationPopup();
		var orderlist = $scope.ASNDetailList.filter( function ( el ) { return el.OrderId === orderId; } );
		$scope.OrderId = orderId;
		$scope.OrderNumber = orderlist[0].OrderNumber;
		$scope.DriverName = orderlist[0].DriverName;
		$scope.TransporterName = orderlist[0].TransporterName;
		$scope.PlateNumber = orderlist[0].TruckPlateNumber;
		$scope.ShipToName = orderlist[0].ShipToName;
		$scope.SoldToName = orderlist[0].SoldToName;
	}




	$scope.ReasonCodeList = [];
	$scope.LoadReasonCode = function ( lookupCategory ) {

		$scope.LookupCategoryValue = lookupCategory;
		var requestData =
		{
			ServicesAction: 'LoadReasonCodeList',
			LookupCategory: lookupCategory
		};

		var consolidateApiParamater =
		{
			Json: requestData,
		};

		GrRequestService.ProcessRequest( consolidateApiParamater ).then( function ( response ) {

			if ( response != undefined ) {
				if ( response.data.ReasonCode != undefined ) {
					$scope.ReasonCodeList = response.data.ReasonCode.ReasonCodeList;
				}
				else {
					$scope.ReasonCodeList = [];
				}
			}
			else { $scope.ReasonCodeList = []; }


		} );

	};




	$scope.SaveDeliveryConfirmationDetails = function () {

		debugger;
		$rootScope.Throbber.Visible = true;

		if ( $rootScope.pageContrlAcessData.ControlTowerDeliveryConfirmartionActualDate != '0' ) {
			if ( $scope.SelectedActualDate.ActualDateForSelected == '' || $scope.SelectedActualDate.ActualDateForSelected == null ) {
				$rootScope.Throbber.Visible = false;
				$rootScope.ValidationErrorAlert( String.format( $rootScope.resData.res_ControlTower_DeliveryConfirmationSelectActualDate ), 'error', 3000 );
				return false;
			}
		}
		if ( $rootScope.pageContrlAcessData.ControlTowerDeliveryConfirmartionReasonCode != '0' ) {
			if ( $scope.ReasonCodeJson.ReasonCode == '' || $scope.ReasonCodeJson.ReasonCode == null || $scope.ReasonCodeJson.ReasonCode == 0 || $scope.ReasonCodeJson.ReasonCode == '0' || $scope.ReasonCodeJson.ReasonCode == undefined ) {
				$rootScope.Throbber.Visible = false;
				$rootScope.ValidationErrorAlert( String.format( $rootScope.resData.res_ControlTower_DeliveryConfirmationSelectReasonCode ), 'error', 3000 );
				return false;
			}
		}

		var driverDetaulList = [];
		var dateobj = $scope.SelectedActualDate.ActualDateForSelected.split( ' ' );
		var dateobj1 = dateobj[0].split( '/' );
		var dateobjDateValue = dateobj1[2] + "-" + dateobj1[1] + "-" + dateobj1[0] + "T" + dateobj[1] + ":00";

		var DriverObj = {};
		DriverObj.EndDeliveryTime = dateobjDateValue;
		DriverObj.ReasonCodeId = parseInt( $scope.ReasonCodeJson.ReasonCode );
		DriverObj.Comments = $scope.ReasonCodeJson.ReasonDescription;
		DriverObj.ConfirmedBy = parseInt( $rootScope.UserId );
		DriverObj.OrderId = parseInt( $scope.OrderId );

		var requestData = {};
		requestData = {
			orderMovementDTO: DriverObj
		};

		GrRequestService.UpdateDeliveryConfirmationByDriver( DriverObj ).then( function ( response ) {
			debugger;
			if ( response.data.OrderId != null ) {
				$rootScope.ValidationErrorAlert( String.format( $rootScope.resData.res_ControlTower_SavedSuccessfully ), '', 3000 );
				$scope.CloseDeliveryConfirmationPopup();
				$rootScope.Throbber.Visible = false;
				$rootScope.RefreshGridInControlTower();
				$rootScope.PopulateASNDetails( $scope.ASNDetailList[0] );

			}

		} );
	}





	$ionicModal.fromTemplateUrl( 'SurveyComments.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	} ).then( function ( modal ) {

		$scope.SurveyCommentsControl = modal;
	} );


	$scope.CloseSurveyCommentsConfirmation = function () {
		$scope.SurveyCommentsControl.hide();
	};

	$scope.OpenSurveyCommentsConfirmation = function ( comments ) {
		$scope.SurveyComments = comments;

		$scope.SurveyCommentsControl.show();



	};





} );