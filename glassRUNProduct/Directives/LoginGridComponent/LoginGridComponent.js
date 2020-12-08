angular.module( "glassRUNProduct" ).directive( 'loginGridComponent', function ( Logger ) {
	return {
		restrict: 'E',
		scope: {

			resData: '=',
			updatelogin: "&"

		},
		templateUrl: 'Directives/LoginGridComponent/LoginGridComponentView.html',
		controller: function ( $scope, $rootScope, $ionicModal, GrRequestService, $state ) {

			var DynamicColumn = [];
			if ( $rootScope.RoleName == "Customer" ) {
				DynamicColumn = [
					{
						caption: $rootScope.resData.res_LoginGridComponent_Name,
						dataField: "Name",
						alignment: "left"
					},
					{

						dataField: "UserName",
						caption: $rootScope.resData.res_LoginGridComponent_UserName,
						alignment: "left",
						width: 150
					},
					{
						caption: $rootScope.resData.res_LoginGridComponent_RoleName,
						dataField: "RoleName",
						alignment: "left"
					},
					{
						caption: $rootScope.resData.res_LoginGridComponent_CompanyName,
						dataField: "CompanyName",
						alignment: "left"
					},

					{

						caption: $rootScope.resData.res_LoginGridComponent_OTPValidity,
						dataField: "OTPValidTill",
						alignment: "left"
						//dataType: 'date',
						//format:"yyyy-MM-dd HH:mm"
					},
					{

						caption: $rootScope.resData.res_LoginGridComponent_RegenerateOTP,
						dataField: "ProfileId",
						cssClass: "ClickkableCell",
						cellTemplate: "Regenerate",
						allowFiltering: false,
						allowSorting: false,
						width: 150
					},
					{

						caption: $rootScope.resData.res_LoginGridComponent_ChangedPassword,
						dataField: "ProfileId",
						cssClass: "ClickkableCell",
						cellTemplate: "ChangePassword",
						allowFiltering: false,
						allowSorting: false,
						width: 150
					},


				]
			}
			else if ( $rootScope.RoleName == "TransportManager" || $rootScope.RoleName == "Carrier") {
				DynamicColumn = [
					{
						caption: $rootScope.resData.res_LoginGridComponent_Name,
						dataField: "Name",
						alignment: "left"
					},
					{

						dataField: "UserName",
						caption: $rootScope.resData.res_LoginGridComponent_UserName,
						alignment: "left",
						width: 150
					},
					{
						caption: $rootScope.resData.res_LoginGridComponent_RoleName,
						dataField: "RoleName",
						alignment: "left"
					},
					{
						caption: $rootScope.resData.res_LoginGridComponent_CompanyName,
						dataField: "CompanyName",
						alignment: "left"
					},

					{

						caption: $rootScope.resData.res_LoginGridComponent_OTPValidity,
						dataField: "OTPValidTill",
						alignment: "left"
						//dataType: 'date',
						//format:"yyyy-MM-dd HH:mm"
					},
					//{

					//	caption: $rootScope.resData.res_LoginGridComponent_RegenerateOTP,
					//	dataField: "ProfileId",
					//	cssClass: "ClickkableCell",
					//	cellTemplate: "Regenerate",
					//	allowFiltering: false,
					//	allowSorting: false,
					//	width: 150
					//},
					{

						caption: $rootScope.resData.res_LoginGridComponent_ChangedPassword,
						dataField: "ProfileId",
						cssClass: "ClickkableCell",
						cellTemplate: "ChangePassword",
						allowFiltering: false,
						allowSorting: false,
						width: 150
					},


				]
			}
			else {
				DynamicColumn = [
					{

						caption: $rootScope.resData.res_LoginGridComponent_Name,
						dataField: "Name",
						alignment: "left"
					},
					{

						dataField: "UserName",
						caption: $rootScope.resData.res_LoginGridComponent_UserName,

						alignment: "left",
						width: 150
					},
					{

						caption: $rootScope.resData.res_LoginGridComponent_RoleName,
						dataField: "RoleName",
						alignment: "left"
					},
					{

						caption: $rootScope.resData.res_LoginGridComponent_CompanyName,
						dataField: "CompanyName",
						alignment: "left"
					},
					{

						caption: $rootScope.resData.res_LoginGridComponent_OTP,
						dataField: "OTPGenerated",
						alignment: "left"
					},
					{

						caption: $rootScope.resData.res_LoginGridComponent_OTPValidity,
						dataField: "OTPValidTill",
						alignment: "left"
						//dataType: 'date',
						//format:"yyyy-MM-dd HH:mm"
					},
					{

						caption: $rootScope.resData.res_LoginGridComponent_RegenerateOTP,
						dataField: "ProfileId",
						cssClass: "ClickkableCell",
						cellTemplate: "Regenerate",
						allowFiltering: false,
						allowSorting: false,
						width: 150
					},
					{

						caption: $rootScope.resData.res_LoginGridComponent_ChangedPassword,
						dataField: "ProfileId",
						cssClass: "ClickkableCell",
						cellTemplate: "ChangePassword",
						allowFiltering: false,
						allowSorting: false,
						width: 150
					},


					{

						caption: $rootScope.resData.res_LoginGridComponent_Edit,
						dataField: "ProfileId",
						cssClass: "ClickkableCell",
						cellTemplate: "Edit",

						allowFiltering: false,
						allowSorting: false,
						width: 100
					},
					{

						caption: $rootScope.resData.res_LoginGridComponent_ActiveInActive,
						dataField: "ProfileId",
						cssClass: "ClickkableCell EnquiryNumberUI",
						cellTemplate: "ActiveInActiveTemplate",
						allowFiltering: false,
						allowSorting: false,
						width: 150
					},
				]
			}




			$scope.LoginList_View = [];

			//#region Load Payment Plan Grid
			$scope.LoadPaymentPlanGrid = function () {
				debugger;

				console.log( "1" + new Date() );

				var PaymentSlabData = new DevExpress.data.CustomStore( {
					load: function ( loadOptions ) {
						var parameters = {};
						if ( loadOptions.sort ) {
							parameters.orderby = loadOptions.sort[0].selector;
							if ( loadOptions.sort[0].desc )
								parameters.orderby += " desc";
						}

						parameters.skip = loadOptions.skip || 0;
						parameters.take = loadOptions.take || 100;

						var filterOptions = loadOptions.filter ? loadOptions.filter.join( "," ) : "";
						var sortOptions = loadOptions.sort ? JSON.stringify( loadOptions.sort ) : "";

						var UserName = "";
						var UserNameCriteria = "";

						var EmailId = "";
						var EmailIdCriteria = "";

						var LicenseNumber = "";
						var LicenseNumberCriteria = "";

						var ContactNumber = "";
						var ContactNumberCriteria = "";

						var Name = "";
						var NameCriteria = "";

						var RoleName = "";
						var RoleNameCriteria = "";

						var CompanyName = "";
						var CompanyNameCriteria = "";

						if ( filterOptions !== "" ) {
							var fields = filterOptions.split( 'and,' );
							for ( var i = 0; i < fields.length; i++ ) {
								var columnsList = fields[i];
								columnsList = columnsList.split( ',' );

								if ( columnsList[0] === "UserName" ) {
									UserNameCriteria = columnsList[1];
									UserName = columnsList[2];
								}

								if ( columnsList[0] === "EmailId" ) {
									EmailIdCriteria = columnsList[1];
									EmailId = columnsList[2];
								}



								if ( columnsList[0] === "LicenseNumber" ) {
									LicenseNumberCriteria = columnsList[1];
									LicenseNumber = columnsList[2];
								}

								if ( columnsList[0] === "ContactNumber" ) {
									ContactNumberCriteria = columnsList[1];
									ContactNumber = columnsList[2];
								}

								if ( columnsList[0] === "Name" ) {
									NameCriteria = columnsList[1];
									Name = columnsList[2];
								}

								if ( columnsList[0] === "RoleName" ) {
									RoleNameCriteria = columnsList[1];
									RoleName = columnsList[2];
								}
								if ( columnsList[0] === "CompanyName" ) {
									CompanyNameCriteria = columnsList[1];
									CompanyName = columnsList[2];
								}


							}
						}

						var index = parseFloat( parseFloat( parameters.skip ) + parseFloat( parameters.take ) );


						var requestData =
						{
							ServicesAction: 'LoadUserProfile',
							PageIndex: parameters.skip,
							PageSize: index,
							OrderBy: "",//OrderBy,
							OrderByCriteria: "",//OrderByCriteria,
							ReferenceId: $rootScope.CompanyId,
							UserName: UserName,
							UserNameCriteria: UserNameCriteria,
							EmailId: EmailId,
							EmailIdCriteria: EmailIdCriteria,
							LicenseNumber: LicenseNumber,
							LicenseNumberCriteria: LicenseNumberCriteria,
							ContactNumber: ContactNumber,
							ContactNumberCriteria: ContactNumberCriteria,
							Name: Name,
							NameCriteria: NameCriteria,
							RoleName: RoleName,
							RoleNameCriteria: RoleNameCriteria,
							CompanyName: CompanyName,
							CompanyNameCriteria: CompanyNameCriteria,
							CarrierId: $rootScope.UserId,
							RoleMasterId: $rootScope.RoleId,


						};

						$scope.RequestDataFilter = requestData;
						var consolidateApiParamater =
						{
							Json: requestData,
						};
						$rootScope.Throbber.Visible = true;
						console.log( "2" + new Date() );
						return GrRequestService.ProcessRequest( consolidateApiParamater ).then( function ( response ) {

							var totalcount = 0;
							var ListData = [];
							var resoponsedata = response.data;
							if ( resoponsedata !== null ) {

								if ( resoponsedata.Json !== undefined ) {
									if ( resoponsedata.Json.ProfileList.length !== undefined ) {
										if ( resoponsedata.Json.ProfileList.length > 0 ) {
											totalcount = resoponsedata.Json.ProfileList[0].TotalCount;
										}
									} else {
										totalcount = resoponsedata.Json.ProfileList.TotalCount;
									}

									ListData = resoponsedata.Json.ProfileList;
								} else {
									ListData = [];
									totalcount = 0;
								}
							}
							$rootScope.Throbber.Visible = false;
							var data = ListData;
							$scope.LoginList_View = $scope.LoginList_View.concat( data );
							console.log( "3" + new Date() );
							return data;
						} );
					}
				} );

				$scope.PaymentSlabGrid = {
					dataSource: {
						store: PaymentSlabData
					},
					bindingOptions: {
					},
					showBorders: true,
					allowColumnReordering: true,
					allowColumnResizing: true,
					columnAutoWidth: true,
					loadPanel: {
						enabled: false,
						Type: Number,
						width: 200
					},
					scrolling: {
						mode: "infinite",
						showScrollbar: "always", // or "onClick" | "always" | "never"
						scrollByThumb: true
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
					keyExpr: "PaymentSlabId",
					selection: {
						mode: "single"
					},
					onCellClick: function ( e ) {

						if ( e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail" ) {
							var data = e.data;

							if ( e.column.caption === "Delete" ) {
								debugger;
								$scope.Delete_ViewGrid( data.LoginId );
							}
							else if ( e.column.caption === "Edit" ) {


								$scope.updatelogin( data );
							}
							else if ( e.column.caption === "Change Password" ) {

								$scope.OpenChangePasswordControlConfirmation( data.LoginId );
							} else if ( e.column.caption === "Active/InActive" ) {
								$scope.Delete_ViewGrid( data.LoginId );
							} else if ( e.column.caption === "Re-generate OTP" ) {
								$scope.Regen_OTP( data.LoginId );
							}
						}
					},
					//onRowClick: function (e) {
					//    if ($scope.IsColumnDetailView === false) {
					//        $state.go("TrackerPage");
					//    }
					//},

					columnsAutoWidth: true,
					rowAlternationEnabled: true,
					filterRow: {
						visible: true,
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
						pageSize: 20
					},

					//loadPanel: {
					//    Type: Number,
					//    width: 200
					//},

					columns: DynamicColumn
				};
			};
			//#endregion

			$scope.LoadPaymentPlanGrid();

			//#region Refresh DataGrid 
			$scope.RefreshDataGrid = function () {

				$scope.PaymentSlabList = [];
				var dataGrid = $( "#PaymentSlabGrid" ).dxDataGrid( "instance" );
				dataGrid.refresh();
			};
			//#endregion

			$scope.changepass = {
				newPassword: "",
				confirmedPassword: ""

			}

			//#region Delete View Grid Data with Confirmation
			$ionicModal.fromTemplateUrl( 'ViewGrid_WarningMessage.html', {
				scope: $scope,
				animation: 'fade-in',
				backdropClickToClose: false,
				hardwareBackButtonClose: false
			} ).then( function ( modal ) {

				$scope.ViewGrid_WarningMessageControl = modal;
			} );


			$scope.CloseDeleteConfirmation_ViewGrid = function () {
				$scope.ViewGrid_WarningMessageControl.hide();
			};


			$scope.ActiveInActiveMessage = "";

			$scope.OpenDeleteConfirmation_ViewGrid = function () {

				var logindata = $scope.LoginList_View.filter( function ( el ) { return el.LoginId === $scope.SelectedId_ViewGrid; } );
				if ( logindata.length > 0 ) {
					if ( logindata[0].IsActive === "1" ) {
						$scope.ActiveInActiveMessage = $rootScope.resData.res_DriverPage_InActiveConfirmationMessage;
					} else {
						$scope.ActiveInActiveMessage = $rootScope.resData.res_DriverPage_ActiveConfirmationMessage;
					}
				}

				$scope.ViewGrid_WarningMessageControl.show();
			};

			$scope.Delete_ViewGrid = function ( id ) {

				$scope.SelectedId_ViewGrid = id;
				$scope.OpenDeleteConfirmation_ViewGrid();
			};

			$scope.DeleteYes_ViewGrid = function () {

				var requestData =
				{
					ServicesAction: 'DeleteLoginByLoginId',
					LoginId: $scope.SelectedId_ViewGrid
				};

				var jsonobject = {};
				jsonobject.Json = requestData;
				GrRequestService.ProcessRequest( jsonobject ).then( function ( response ) {
					debugger;
					if ( response.data.Json != undefined ) {
						$scope.CloseDeleteConfirmation_ViewGrid();
						$scope.RefreshDataGrid();

						var logindata = $scope.LoginList_View.filter( function ( el ) { return el.LoginId === $scope.SelectedId_ViewGrid; } );
						if ( logindata.length > 0 ) {
							if ( logindata[0].IsActive === "1" ) {
								//logindata[0].IsActive = "0";
								$rootScope.ValidationErrorAlert( String.format( $rootScope.resData.res_DriverPage_INActiveMessage ), '', 3000 );
							} else {
								//logindata[0].IsActive = "1";
								$rootScope.ValidationErrorAlert( String.format( $rootScope.resData.res_DriverPage_ActiveMessage ), '', 3000 );
							}
						}
					}

				} );
			};
			//#endregion
			//#region Regenerate OTP
			$ionicModal.fromTemplateUrl( 'ViewGrid_OTPWarningMessage.html', {
				scope: $scope,
				animation: 'fade-in',
				backdropClickToClose: false,
				hardwareBackButtonClose: false
			} ).then( function ( modal ) {

				$scope.ViewGrid_OTPMessageControl = modal;
			} );

			$scope.OTPWarningMessage = "";

			$scope.CloseOTPReConfirmation_ViewGrid = function () {
				$scope.ViewGrid_OTPMessageControl.hide();
			};

			$scope.OpenOTPReConfirmation_ViewGrid = function () {
				$scope.OTPWarningMessage = 'Do you want to re-generate OTP?';
				$scope.ViewGrid_OTPMessageControl.show();
			};

			$scope.Regen_OTP = function ( id ) {

				$scope.SelectedOTPId_ViewGrid = id;
				$scope.OpenOTPReConfirmation_ViewGrid();
			};

			$scope.RegenOTPYes_ViewGrid = function () {

				var requestData =
				{
					ServicesAction: 'UpdateRegeneratedLoginOTP',
					LoginId: $scope.SelectedOTPId_ViewGrid
				};

				var jsonobject = {};
				jsonobject.Json = requestData;
				GrRequestService.ProcessRequest( jsonobject ).then( function ( response ) {
					debugger;
					if ( response.data.Json != undefined ) {
						$scope.CloseOTPReConfirmation_ViewGrid();
						$scope.RefreshDataGrid();


						$rootScope.ValidationErrorAlert( String.format( 'OTP Regenerated Successfully' ), '', 3000 );


					}

				} );
			};
			//#endregion
			$scope.RoleName = $rootScope.RoleName;

			$ionicModal.fromTemplateUrl( 'ChangePasswordView.html', {
				scope: $scope,
				animation: 'fade-in',
				backdropClickToClose: false,
				hardwareBackButtonClose: false
			} ).then( function ( modal ) {

				$scope.ViewGrid_ChangePasswordViewControl = modal;
			} );


			$scope.CloseChangePasswordControlConfirmation = function () {
				$scope.ViewGrid_ChangePasswordViewControl.hide();
			};

			$scope.OpenChangePasswordControlConfirmation = function ( id ) {
				$scope.SelectedId_ViewGrid = id;
				$scope.ViewGrid_ChangePasswordViewControl.show();
			};



			$scope.ChangePassword_ViewGrid = function () {
				debugger;
				if ( $scope.changepass.confirmedPassword !== undefined || $scope.changepass.newPassword !== undefined ) {
					if ( $scope.changepass.newPassword.length < 8 || $scope.changepass.newPassword.length > 20 ) {

						$rootScope.ValidationErrorAlert( 'Password length should be between 8 and 20', 'error', 3000 );
						return false;
					}

					if ( $scope.changepass.confirmedPassword !== $scope.changepass.newPassword ) {
						$rootScope.ValidationErrorAlert( 'Password is mismatch', 'error', 3000 );
						return false;
					}
					var requestData =
					{
						ServicesAction: 'UpdatePassword',
						LoginId: $scope.SelectedId_ViewGrid,
						Password: $scope.changepass.newPassword

					};

					var jsonobject = {};
					jsonobject.Json = requestData;
					GrRequestService.ProcessRequest( jsonobject ).then( function ( response ) {
						debugger;

						$rootScope.ValidationErrorAlert( 'Password changed successfully', '', 3000 );
						$scope.CloseChangePasswordControlConfirmation();

					} );
				}
				else {
					$rootScope.ValidationErrorAlert( 'Please enter password.', 'error', 3000 );
				}
			};




			//#region change language
			$rootScope.GridRecallForStatus = function () {

				debugger;
				//$scope.LoadPaymentPlanGrid();
				$state.reload( 'CreateUser' );
			}
			//#endregion



			////#region reload on resources changes
			//$rootScope.GridRecallForStatus = function () {


			//	var griddata = $scope.LoginList_View;
			//	for ( var i = 0; i < griddata.length; i++ ) {
			//		if ( griddata[i].PropertyName !== griddata[i].ResourceKey ) {
			//			griddata[i].ResourceValue = $rootScope.resData[griddata[i].ResourceKey];
			//		}
			//	}
			//	$( "#PaymentSlabGrid" ).dxDataGrid( "instance" ).refresh()


			//}
			// //#endregion



		}
	}
} )


