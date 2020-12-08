//// <reference path="mainCtrl.js" />
angular.module('glassRUNProduct').controller('mainCtrl',
	['$scope', '$q', '$rootScope', '$state', '$interval', '$ionicPlatform', 'applicationService', 'quickViewService', 'builderService', 'pluginsService', '$location', 'GrRequestService', 'focus', '$sessionStorage', '$ionicModal',
		function ($scope, $q, $rootScope, $state, $interval, $ionicPlatform, applicationService, quickViewService, builderService, pluginsService, $location, GrRequestService, focus, $sessionStorage, $ionicModal) {
			$ionicPlatform.ready(function () {
				applicationService.init();
				quickViewService.init();
				builderService.init();
				pluginsService.init();



			});
			setTimeout(function () {
				pluginsService.init();
				applicationService.customScroll();
				applicationService.handlePanelAction();
				$('.nav.nav-sidebar .nav-active').removeClass('nav-active active');
				$('.nav.nav-sidebar .active:not(.nav-parent)').closest('.nav-parent').addClass('nav-active active');

				if ($location.$$path === '/' || $location.$$path === '/layout-api') {
					$('.nav.nav-sidebar .nav-parent').removeClass('nav-active active');
					$('.nav.nav-sidebar .nav-parent .children').removeClass('nav-active active');
					if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
					if ($('body').hasClass('submenu-hover')) return;
					$('.nav.nav-sidebar .nav-parent .children').slideUp(200);
					$('.nav-sidebar .arrow').removeClass('active');
				}
			}, 200);

			debugger;
			

			$scope.HighlightSelectedMenu = function (page) {
				
				if ($sessionStorage.MenuList !== undefined) {
					if ($sessionStorage.MenuList.length > 0) {
						for (var i = 0; i < $sessionStorage.MenuList.length; i++) {
							if (page === $sessionStorage.MenuList[i].ControllerName) {
								$sessionStorage.MenuList[i].IsSelectedMenu = true;
							} else {
								$sessionStorage.MenuList[i].IsSelectedMenu = false;
							}
						}
					}
				}
			}

			var page = $location.absUrl().split('#/')[1];
			$scope.HighlightSelectedMenu(page);


			$rootScope.getDateFormat = function (timestamp) {

				return new Date(timestamp);
			}



			$rootScope.ValidationErrorAlert = function (data, messageType, time) {

				$rootScope.ModelNotification = [];
				var message = "";
				if (messageType === "success") {
					message = "uk-notify-message-success";
				}
				else if (messageType === "warning") {
					message = "uk-notify-message-warning";
				}
				else if (messageType === "error") {
					message = "uk-notify-message-danger";
				} else {
					message = "uk-notify-message-success";
				}

				var notification = { Message: data, MeassageHeader: $rootScope.resData.res_ValidationPopup_Attention, MessageType: message, visible: true };
				$rootScope.ModelNotification.push(notification);

				focus('addentereventpopupclose');

				//$scope.Timer = $interval(function () {
				//    $rootScope.RemoveAlert();
				//}, time);

			};



			$rootScope.ClosePopupModal = function (e) {

				if (e.charCode === 13) {
					focus('removeEnterEventPopupclose');
					$rootScope.RemoveAlert();

				}
			}








			$rootScope.RemoveAlert = function () {

				$rootScope.ModelNotification = [];
				var notification = { Message: "", MessageType: "", visible: false };
				$rootScope.ModelNotification.push(notification);

				$interval.cancel($scope.Timer);
				if ($rootScope.IsProductValidation === true) {
					focus('ItemListAutoCompleteBox_value');
					$rootScope.IsProductValidation = false;
				}
				if ($rootScope.EnquiryRejected === true) {
					$state.go("OMInquiry");
				}
			};


			$rootScope.LogoutUser = function () {


				var jsonobject = {};
				jsonobject.Json = "";
				GrRequestService.LogOut(jsonobject).then(function (response) {

					$sessionStorage.AllLookUpData = [];
					$sessionStorage.AllNotificationListData = [];
					$sessionStorage.AllSettingMasterData = [];
					$sessionStorage.BindAllBranchPlant = [];
					$sessionStorage.MenuList = [];
					$sessionStorage.OrderFeedbackList = [];
					$sessionStorage.ResourcesData = [];
					$sessionStorage.SessionObjects = [];
					$sessionStorage.userProfilePhoto = null;
				});

				$rootScope.UserId = 0;
				$state.go('loginContent');

			}

			$rootScope.ChangeLang = function (cultureId) {
				debugger;
				$rootScope.resData = {};
				$rootScope.CultureId = cultureId;
				$sessionStorage.CultureId = $rootScope.CultureId;
				//var resourcesList = $sessionStorage.ResourcesData.filter(function (el) { return el.CultureId === cultureId; });

				//for (var j = 0, len = resourcesList.length; j < len; ++j) {
				//    var controlName = resourcesList[j].ResourceKey;
				//    $rootScope.resData[controlName] = '';
				//    $rootScope.resData[controlName] = resourcesList[j].ResourceValue;
				//}
				//$sessionStorage.resData = $rootScope.resData;

				// $rootScope.GridRecallForStatus();

				var ResourcesData = {
					ServicesAction: "GetAllResourcesList",
					CultureId: $rootScope.CultureId,
				};
				var consolidateApiParamater = {
					Json: ResourcesData,
				};

				GrRequestService.ProcessRequest(consolidateApiParamater).then(function (objectResourcesResponse) {


					$sessionStorage.CultureId = $rootScope.CultureId;

					var ResourcesResoponseData = objectResourcesResponse.data.Resources.ResourcesList;
					$sessionStorage.ResourcesData = ResourcesResoponseData;

					var resourcesList = ResourcesResoponseData.filter(function (el) {
						return el.CultureId === $rootScope.CultureId;
					});

					$scope.resData = {};
					for (var j = 0, len = resourcesList.length; j < len; ++j) {
						var controlName = resourcesList[j].ResourceKey;
						$scope.resData[controlName] = '';
						$scope.resData[controlName] = resourcesList[j].ResourceValue;
					}
					$rootScope.resData = $scope.resData;
					$sessionStorage.resData = $scope.resData;

					$rootScope.GridRecallForStatus();
				});
				var requestData =
				{
					ServicesAction: 'LoadMenuList',
					RoleMasterId: $rootScope.RoleId,
					CultureId: $rootScope.CultureId,
					UserId: $rootScope.UserId
				};


				var consolidateApiParamater =
				{
					Json: requestData,
				};

				GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

					if (response.data != null) {
						if (response.data.Json != null && response.data.Json != undefined) {
							var resoponsedata = response.data;
							$rootScope.MenuList = resoponsedata.Json.PagesList;
							$sessionStorage.MenuList = $rootScope.MenuList;
						}
					} else {

						$rootScope.MenuList = [];
						$sessionStorage.MenuList = $rootScope.MenuList;
					}

				});

			}

			$rootScope.ChangePassword = function () {
				$state.go('ChangePassword');
			}





			$rootScope.RedirectPage = function (pageURL, pageName, resourcePageName) {
				debugger;

				console.log("Function Start" + new Date());

				if (pageName !== $rootScope.CurrentPageName) {

					if ($rootScope.IsAdvanceEdit !== true) {

						$rootScope.IsEnquiryEditedByCustomerService = false;
						$rootScope.TemSelectedAssociatedOrder = [];
						$rootScope.EnquiryDetailId = 0;
						$rootScope.EditedEnquiryId = 0;
						$rootScope.TruckSizeId = 0;
						$rootScope.DeliveryLocationId = 0;
						$rootScope.totalorderamount = 0;
						$rootScope.AvailableCreditLimit = 0;
						$rootScope.TemOrderData = [];
						$rootScope.EditEnquiry = false;
						$rootScope.isEnquiryEdit = false;
						$rootScope.CurrentOrderGuid = '';
						$rootScope.EditSelfCollectValue = "";
						$rootScope.EditEnquiryAutoNumber = "";
						$rootScope.SavedEditEnquiry = false;

						$rootScope.RedirectFrom = '';
						$rootScope.RedirectToRulePage = false;
						$rootScope.bindDeliverylocation = [];
						$rootScope.PageLevelConfigList = [];
						$rootScope.PageLevelConfiguration($rootScope.RoleId, $rootScope.UserId, pageName, resourcePageName, pageURL, true);
					}
					else {

						$rootScope.RedirectFrom = '';
						$rootScope.RedirectToRulePage = false;
						$rootScope.bindDeliverylocation = [];
						$rootScope.PageLevelConfigList = [];
						if ($rootScope.RoleName === "CustomerService") {
							$rootScope.PageLevelConfiguration($rootScope.CurrentOrderRoleId.replace(/ /g, ''), $rootScope.CurrentOrderLoginId.replace(/ /g, ''), pageName, resourcePageName, pageURL, true);
						} else {
							$rootScope.PageLevelConfiguration($rootScope.RoleId, $rootScope.UserId, pageName, resourcePageName, pageURL, true);
						}

					}

				}

			}
			//Changed available limit changed 0 after clicking on create enquiry menu by nimesh on 30-09-2019.
			$rootScope.RedirectPageFromMenu = function (pageURL, pageName, resourcePageName) {
				debugger;

				$scope.HighlightSelectedMenu(pageURL);
				if ($sessionStorage.PageName !== pageName) {

					delete $sessionStorage.IsEnquiryEditedByCustomerService;
					delete $sessionStorage.TempCompanyId;
					delete $sessionStorage.TempCompanyMnemonic;
					delete $sessionStorage.BranchPlantCodeEdit;
					delete $sessionStorage.CurrentOrderRoleId;
					delete $sessionStorage.CurrentOrderLoginId;
					delete $sessionStorage.IsEnquiryEditedByCustomerService;
					delete $sessionStorage.EditEnquiryAutoNumber;
					delete $sessionStorage.IsAdvanceEdit;
					delete $sessionStorage.EditEnquiry;
					delete $sessionStorage.isEnquiryEdit;
					delete $sessionStorage.SavedEditEnquiry;
					delete $sessionStorage.CurrentOrderGuid;
					delete $sessionStorage.TemOrderData;

					$rootScope.TruckSizeId = 0;
					$rootScope.DeliveryLocationId = 0;
					$rootScope.totalorderamount = 0;
					$rootScope.AvailableCreditLimit = 0;
					$rootScope.RedirectPage(pageURL, pageName, resourcePageName);
				}
				// TODO: 14 July 2020
				else {
					$state.go(pageURL);
				}
			}

			$rootScope.PageLevelConfiguration = function (roleId, userId, pageName, resourcePageName, pageURL, isMenuChange) {

				var pageRoleAccessCofiguration = {};
				var pageLevelConfiguration = [];
				$rootScope.res_PageHeaderTitle = resourcePageName;
				var requestData =
				{
					ServicesAction: 'GetPageLevelConfiguration',
					CompanyId: 0,
					UserId: userId,
					RoleId: roleId,
					PageName: pageName

				};

				var jsonobject = {};
				jsonobject.Json = requestData;
				var pageLevelConfigurationResponse = GrRequestService.ProcessRequest(jsonobject);




				var requestData =
				{
					ServicesAction: "GetPageControlAccessByPageIdAndRoleAndUserID",
					PageName: pageName,
					RoleId: roleId,
					UserId: userId,
				};
				var consolidateApiParamater =
				{
					Json: requestData,
				};

				var getPageControlAccessResponse = GrRequestService.ProcessRequest(consolidateApiParamater);

				var requestDataJson =
				{
					ServicesAction: "CheckOtherUserActive",
					AccessKey: $rootScope.Token,
					LoginId: $rootScope.UserId,
				};
				var consolidateCheckUserApiParamater =
				{
					Json: requestDataJson,
				};

				//var getUserLoggedInResponse = GrRequestService.ProcessRequest(consolidateCheckUserApiParamater);
				var getUserLoggedInResponse = {};

				$q.all([
					pageLevelConfigurationResponse,
					getPageControlAccessResponse,
					getUserLoggedInResponse

				]).then(function (resp) {

					var response = resp[0];
					var responsePageControl = resp[1];
					var responseUserLoggedIn = resp[2];

					//if (responseUserLoggedIn.data.User === "700000000999999000" && isMenuChange) {

					//$rootScope.UserId = 0;
					//$state.go('loginContent');

					//$rootScope.LogoutUser();

					//}
					//else
					{

						var resoponsedata = response.data;
						if (resoponsedata !== undefined && resoponsedata !== null) {
							if (resoponsedata.Json !== null && resoponsedata.Json !== undefined) {
								pageLevelConfiguration = resoponsedata.Json.PageWiseConfigurationList;
							}
						};

						var data = responsePageControl.data;

						pageRoleAccessCofiguration = {};

						if (data != null) {

							PageControlList = data.Json.PageControlList;

							for (var j = 0, len = PageControlList.length; j < len; ++j) {
								var controlName = PageControlList[j].ControlName;
								pageRoleAccessCofiguration[controlName] = '';
								pageRoleAccessCofiguration[controlName] = PageControlList[j].AccessId;
								pageRoleAccessCofiguration[controlName + 'DataSource'] = PageControlList[j].DataSource;

							}
						}

						$rootScope.NextPageContrlAcessData = pageRoleAccessCofiguration;
						$sessionStorage.NextPageContrlAcessData = pageRoleAccessCofiguration;

						$rootScope.PageLevelConfigList = pageLevelConfiguration;
						$sessionStorage.PageLevelConfigList = pageLevelConfiguration;

						$rootScope.pageContrlAcessData = pageRoleAccessCofiguration;
						$sessionStorage.pageContrlAcessData = pageRoleAccessCofiguration;

						console.log("Function End" + new Date());

						if (isMenuChange) {
							$state.go(pageURL);
						}
						else {
							$rootScope.LoadPageLevelConfiguration();
						}


						$rootScope.CurrentPageName = pageName;
						$rootScope.PageName = pageName;

						$sessionStorage.PageName = $rootScope.PageName;
						$sessionStorage.resourcePageName = $rootScope.res_PageHeaderTitle;

						if ($rootScope.IsAdvanceEdit === true) {
							$rootScope.res_PageHeaderTitle = $rootScope.resData.res_CreateEnquiryPage_EditEnquiryHeaderName + " (" + $rootScope.EditEnquiryAutoNumber + ")";
						}


					}


				});

			}



			$rootScope.PageLoadEvent = function () {

				if ($rootScope.AllLookUpData !== undefined) {
					$rootScope.LanguageList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'Language'; });
				}
			}


			$rootScope.ViewFeedBackDetailsPage = function (OrderFeedbackId) {

				$rootScope.FeedbackOrderId = OrderFeedbackId;
				$state.go("FeedbackDetailPage", null, { reload: true });
			}


			$scope.ShowUploadPhoto = false;

			$scope.OpenChangeUploadPhotoPopup = function () {

				$scope.ShowUploadPhoto = true;
			}

			$scope.CloseChangeUploadPhotoPopup = function () {

				$scope.ShowUploadPhoto = false;
			}


			$scope.ShowPopupUploadPhoto = function () {
				$scope.OpenChangeUploadPhotoPopup();
			}






			$rootScope.UpdateNotificationDetails = function (EmailNotificationId) {

				$scope.EmailNotificationId = EmailNotificationId;

				var requestData =
				{
					ServicesAction: 'UpdateEmailNotification',
					NotificationRequestId: EmailNotificationId,
					MarkAsRead: 1,
					IsAck: 1, //Added by Chetan Tambe (17 Sept 2019) : For mark portal notifications as read
					UpdatedBy: $rootScope.UserId


				};

				var jsonobject = {};
				jsonobject.Json = requestData;
				GrRequestService.ProcessRequest(jsonobject).then(function (response) {



					//$rootScope.EventNotificationList = $rootScope.EventNotificationList.filter(function (el) { return el.NotificationRequestId !== EmailNotificationId; });
					//$sessionStorage.EventNotificationList = $rootScope.EventNotificationList;

					$rootScope.LoadEventNotificationList($rootScope.UserId)
				});
			}

			//Added by Chetan Tambe (17 Sept 2019) : For mark portal notifications as read
			//Changed by Chetan Tambe (20 Sept 2019) : For mark all portal notifications as read
			$rootScope.MarkAllAsRead = function () {

				var requestData =
				{
					ServicesAction: 'UpdateEventNotificationMarkAllAsRead',
					LoginId: $rootScope.UserId

				};

				var jsonobject = {};
				jsonobject.Json = requestData;
				GrRequestService.ProcessRequest(jsonobject).then(function (response) {

					$rootScope.LoadEventNotificationList($rootScope.UserId);

				});

			};


			$rootScope.LoadEventNotificationList = function (LoginId) {

				var requestData =
				{
					ServicesAction: 'LoadEventNotificationOfPortalByLoginId',
					LoginId: LoginId

				};

				var jsonobject = {};
				jsonobject.Json = requestData;
				GrRequestService.ProcessRequest(jsonobject).then(function (response) {

					if (response.data != undefined) {
						var resoponsedata = response.data;
						if (resoponsedata.Json != undefined) {
							$rootScope.EventNotificationList = resoponsedata.Json.EventNotificationList;
							$sessionStorage.EventNotificationList = $rootScope.EventNotificationList;
						} else {
							$rootScope.EventNotificationList = []
							$sessionStorage.EventNotificationList = $rootScope.EventNotificationList;
						}
					} else {
						$rootScope.EventNotificationList = []
						$sessionStorage.EventNotificationList = $rootScope.EventNotificationList;
					}

				});
			}


			$rootScope.InsertInEventNotification = function (eventNotificationList) {


				if (eventNotificationList.length != 0) {

					var requestData =
					{
						ServicesAction: 'InsertEventNotification',
						EventNotificationList: eventNotificationList

					};
					// var stringfyjson = JSON.stringify(requestData);
					var consolidateApiParamater =
					{
						Json: requestData,
					};

					GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


					});

				}




			}



			//$rootScope.LoadEventNotificationList($rootScope.UserId);



			$scope.ManageCustomerJson = {
				ContactType: "",
				ContactPerson: "",
				Contacts: ""
			}

			$ionicModal.fromTemplateUrl('ViewContactInformation.html', {
				scope: $scope,
				animation: 'fade-in',
				backdropClickToClose: false,
				hardwareBackButtonClose: false
			}).then(function (modal) {

				$scope.ViewContactInformationControl = modal;
			});
			$scope.CloseViewContactInformationControl = function () {
				$scope.ViewContactInformationControl.hide();
			};
			$scope.OpenViewContactInformationControl = function () {

				$scope.ViewContactInformationControl.show();
			};



			//Changed by nimesh on 09-09-2019
			$scope.LoadContactInformation = function () {

				$scope.ContactInformationList = [];

				var requestData =
				{
					ServicesAction: 'GetContactInformationDetailsByCompanyId',
					ObjectId: $rootScope.CompanyId,
					ObjectType: 'Company'
				};

				var jsonobject = {};
				jsonobject.Json = requestData;
				GrRequestService.ProcessRequest(jsonobject).then(function (response) {

					if (response.data.Json != undefined) {
						var resoponsedata = response.data.Json.ContactInformatList;
						$scope.CheckContactInformationPresentList = resoponsedata
						if ($scope.CheckContactInformationPresentList.length > 0) {
							$scope.ContactInformationList = resoponsedata;
						}
					}
					else {
						$scope.CheckContactInformationPresentList = [];
					}


					$scope.OpenViewContactInformationControl();
					$scope.CompanyId = $rootScope.CompanyId;

				});





			}



			$scope.ContactInformationList = [];
			$scope.AddNewContactInformation = function () {

				if ($scope.ManageCustomerJson.ContactType !== "" && $scope.ManageCustomerJson.ContactType !== 0 && $scope.ManageCustomerJson.ContactPerson !== "" && $scope.ManageCustomerJson.Contacts !== "") {
					var NewcontactInformationJson = {
						ContactInformationIdGUID: generateGUID(),
						ContactInformationId: 0,
						ContactType: $scope.ManageCustomerJson.ContactType,
						ContactPerson: $scope.ManageCustomerJson.ContactPerson,
						Contacts: $scope.ManageCustomerJson.Contacts,
						ObjectId: $rootScope.CompanyId,
						ObjectType: 'Company',
						CreatedBy: $rootScope.UserId,
						IsActive: true
					}
					if ($scope.ContactInformationList.length > 0) {
						var contactInformationList = $scope.ContactInformationList.filter(function (el) { return el.ContactType === $scope.ManageCustomerJson.ContactType && el.ContactPerson === $scope.ManageCustomerJson.ContactPerson && el.Contacts === $scope.ManageCustomerJson.Contacts });
						if (contactInformationList.length > 0) {
							$rootScope.ValidationErrorAlert('Record already exist.', 'error', 3000);
						} else {
							$scope.ContactInformationList.push(NewcontactInformationJson);
							$scope.ClearContactInformation();
						}
					} else {
						$scope.ContactInformationList.push(NewcontactInformationJson);
						$scope.ClearContactInformation();
					}
				} else {
					if (($scope.ManageCustomerJson.ContactType === "" || $scope.ManageCustomerJson.ContactType === 0)) {
						$rootScope.ValidationErrorAlert('Please select Contact Type.', 'error', 3000);
						//} else if ($scope.ManageShipToJson.ContactPerson === "") {
						//  $rootScope.ValidationErrorAlert('Please enter contact Person.', 'error', 3000);
					} else if ($scope.ManageCustomerJson.Contacts === "") {
						$rootScope.ValidationErrorAlert('Please enter Contacts', 'error', 3000);
					}
				}

			}


			$scope.ClearContactInformation = function () {
				$scope.ManageCustomerJson.ContactType = "";
				$scope.ManageCustomerJson.ContactPerson = "";
				$scope.ManageCustomerJson.Contacts = "";

			}


			$scope.RemoveNewContactInformation = function (contactInformationId, contactInformationGUId) {

				if (contactInformationId === 0) {
					$scope.ContactInformationList = $scope.ContactInformationList.filter(function (el) { return el.ContactInformationIdGUID !== contactInformationGUId; });
				} else {
					var contactInformationInfo = $scope.ContactInformationList.filter(function (el) { return el.ContactInformationId === contactInformationId; });
					if (contactInformationInfo.length > 0) {
						contactInformationInfo[0].IsActive = false;
					}
				}
			}

			function generateGUID() {
				var d = new Date().getTime();
				var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
					var r = (d + Math.random() * 16) % 16 | 0;
					d = Math.floor(d / 16);
					return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
				});
				return uuid;
			};


			$scope.SaveContactInformation = function () {

				if ($scope.ContactInformationList.length > 0) {
					if ($scope.CheckContactInformationPresentList.length == 0) {
						var requestData =
						{
							ServicesAction: 'SaveContactInformation',
							ContactInformationList: $scope.ContactInformationList
						};



						var consolidateApiParamater =
						{
							Json: requestData,
						};

						GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

							$rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
							$scope.CloseViewContactInformationControl();

						});
					}
					else {
						var requestData =
						{
							ServicesAction: 'UpdateContactInformation',
							ContactInformationList: $scope.ContactInformationList
						};



						var consolidateApiParamater =
						{
							Json: requestData,
						};

						GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

							$rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
							$scope.CloseViewContactInformationControl();
						});
					}
				}
				else {
					$rootScope.ValidationErrorAlert('Please add contact information', '', 3000);
					$scope.CloseViewContactInformationControl();
				}
			}




			$scope.PhotoJson = {
				labelFilename: ''

			}
			$scope.fileupload = {
				File: ''

			}


			$scope.profilePhotoList = [];
			$scope.UploadPhoto = function () {


				$scope.profilePhotoList = [];
				var documentName = "";
				var documentBase64 = "";
				var documentExtension = "";


				documentName = $scope.fileupload.File.dataFile.name;
				documentBase64 = $scope.fileupload.File.dataBase64;
				documentExtension = $scope.fileupload.File.dataFile.name.split('.')[1];
				var profilePhoto = {
					UserProfilePicture: documentBase64,
					UserId: $rootScope.UserId
				}

				$scope.profilePhotoList.push(profilePhoto);

				var requestData =
				{
					ServicesAction: 'UpdateProfilePhoto',
					ProfilePhotoList: $scope.profilePhotoList
				};
				var consolidateApiParamater =
				{
					Json: requestData,
				};

				GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {



					if (response.data.Json != undefined) {

						if (parseInt(response.data.Json.ProfileId) > 0) {

							$scope.$evalAsync(function () {
								$sessionStorage.userProfilePhoto = $scope.fileupload.File.dataBase64;
								$rootScope.userProfilePhoto = $sessionStorage.userProfilePhoto;
								$scope.fileupload.File = "";
								$scope.PhotoJson.labelFilename = "";
								$scope.CloseChangeUploadPhotoPopup();
							});

							// $scope.Photo = 'data:image / png; base64,' + $scope.fileupload.File.dataBase64;
						}
					}

				});
			}




			$scope.FileNameChanged = function (element) {

				$scope.$apply(function () {

					$scope.PhotoJson.labelFilename = element.files[0].name;;
				});
			}



			$ionicModal.fromTemplateUrl('loginaspopup.html', {
				scope: $scope,
				animation: 'fade-in',
				backdropClickToClose: false,
				hardwareBackButtonClose: false
			}).then(function (modal) {

				$scope.loginaspopupMessageControl = modal;
			});

			$scope.CloseloginaspopupConfirmation = function () {
				$scope.loginaspopupMessageControl.hide();
			};

			$scope.OpenLoginConfirmation = function () {

				$scope.loginaspopupMessageControl.show();
				$rootScope.GetAllLoginAsDetails();
			};

			$scope.SelectedProfile = function (e) {

				try {
					$scope.LoginAsProfileId = e.description.Id;
					$scope.LoginAsProfileName = e.description.Name;
				} catch (e) {

				}

			};
			$scope.btnLoginAs = function (UserName) {

				$rootScope.LoginAsProfileDetails($scope.LoginAsProfileName);
				$scope.CloseloginaspopupConfirmation();

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



			$scope.PriceFromGlassRunEnable = $scope.LoadSettingInfoByName('PriceFromGlassRun', 'string');
			if ($scope.PriceFromGlassRunEnable === "") {
				$scope.PriceFromGlassRunEnable = 0;
			}



			$rootScope.CalculateAmountTaxDepositeAndDiscount = function (Object, OrderGuid) {


				debugger;

				$scope.ItemTaxInPercentage = $scope.LoadSettingInfoByName('ItemTaxInPec', 'float');

				if ($scope.ItemTaxInPercentage === "") {
					$scope.ItemTaxInPercentage = 0;
				}

				$scope.OrderDataDetail = Object;
				$rootScope.calcTotalTax(OrderGuid);
				$rootScope.calcTotalAmount(Object, OrderGuid, false);
				$rootScope.calcTotalDepositeAmount(Object, OrderGuid, false);
				$rootScope.GetCashDiscountOnProducts(OrderGuid);
				$rootScope.GetTotalNetAmountOfEnquiry(OrderGuid);
				$rootScope.GetGrandTotalAmountOfEnquiry(OrderGuid);
			}

			$rootScope.calcTotalTax = function (OrderGuid) {
				var currentOrder = $scope.OrderDataDetail.filter(function (el) { return el.OrderGUID === OrderGuid; });
				var total = 0;
				for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {


					//itemtype  37  is deposit item

					total += parseInt(currentOrder[0].OrderProductList[i].ItemType) == 37 ? 0 : parseFloat(currentOrder[0].OrderProductList[i].ItemPrices);




				}
				total = percentage(total, $scope.ItemTaxInPercentage);
				currentOrder[0].TotalTaxAmount = total;
				return total;
			}



			$rootScope.calcTotalAmount = function (Object, OrderGuid, value) {
				$scope.OrderDataDetail = Object;
				var currentOrder = $scope.OrderDataDetail.filter(function (el) { return el.OrderGUID === OrderGuid; });
				var total = 0;


				//itemtype  37  is deposit item  and  31 is promotion item
				if (value == true) {
					for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
						total += (((parseInt(currentOrder[0].OrderProductList[i].ItemType) == 31 || parseInt(currentOrder[0].OrderProductList[i].ItemType) == 37) ? 0 : parseFloat(currentOrder[0].OrderProductList[i].ItemPricesPerUnit)) * parseInt(currentOrder[0].OrderProductList[i].ProductQuantity));
					}
				}
				else {
					for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
						total += (((parseInt(currentOrder[0].OrderProductList[i].ItemType) == 31 || parseInt(currentOrder[0].OrderProductList[i].ItemType) == 37) ? 0 : parseFloat(currentOrder[0].OrderProductList[i].ItemPrices)));
					}
				}

				currentOrder[0].TotalAmount = total;

				return total;
			}
			$rootScope.calcTotalDepositeAmount = function (Object, OrderGuid, value) {
				$scope.OrderDataDetail = Object;
				var currentOrder = $scope.OrderDataDetail.filter(function (el) { return el.OrderGUID === OrderGuid; });
				var total = 0;

				if (value == true) {
					for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {

						if (parseInt(currentOrder[0].OrderProductList[i].ItemType) == 37) {

							total += parseFloat(parseFloat(currentOrder[0].OrderProductList[i].ItemPricesPerUnit) * parseInt(currentOrder[0].OrderProductList[i].ProductQuantity));

						} else {

							total += parseFloat(parseFloat(currentOrder[0].OrderProductList[i].DepositeAmountPerUnit) * parseInt(currentOrder[0].OrderProductList[i].ProductQuantity));

						}


					}
				}
				else {
					for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {

						if (parseInt(currentOrder[0].OrderProductList[i].ItemType) == 37) {

							total += parseFloat(parseFloat(currentOrder[0].OrderProductList[i].ItemPricesPerUnit) * parseInt(currentOrder[0].OrderProductList[i].ProductQuantity));

						} else {

							total += parseFloat(currentOrder[0].OrderProductList[i].ItemTotalDepositeAmount);

						}



					}
				}


				currentOrder[0].TotalDepositeAmount = total;
				return total;
			}

			$rootScope.GetCashDiscountOnProducts = function (OrderGuid) {
				var currentOrder = $scope.OrderDataDetail.filter(function (el) { return el.OrderGUID === OrderGuid; });
				var total = 0;
				for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
					if (currentOrder[0].OrderProductList[i].CashDiscountAmount !== undefined) {
						total += parseFloat(currentOrder[0].OrderProductList[i].CashDiscountAmount);
					}
				}
				currentOrder[0].TotalCashDiscount = total;
			}

			$rootScope.GetTotalNetAmountOfEnquiry = function (OrderGuid) {

				var currentOrder = $scope.OrderDataDetail.filter(function (el) { return el.OrderGUID === OrderGuid; });
				if (currentOrder.length > 0) {

					var total = parseFloat(currentOrder[0].TotalAmount) - (parseFloat($rootScope.DiscountAmount) + parseFloat(currentOrder[0].TotalCashDiscount));

					currentOrder[0].EnquiryNetAmount = total;
				}
			}

			$rootScope.GetGrandTotalAmountOfEnquiry = function (OrderGuid) {

				var currentOrder = $scope.OrderDataDetail.filter(function (el) { return el.OrderGUID === OrderGuid; });
				if (currentOrder.length > 0) {

					var total = parseFloat(currentOrder[0].EnquiryNetAmount) + parseFloat(currentOrder[0].TotalTaxAmount) + parseFloat(currentOrder[0].TotalDepositeAmount);

					currentOrder[0].EnquiryGrandTotalAmount = total;
				}
			}

			debugger;
			// TODO: 14 July 2020
			$rootScope.UserPersonaJson = {
				SelectedUserPersonaMasterId: $sessionStorage.UserPersonaMasterId
			};

			$rootScope.UserPersonaList = [
				{
					UserPersonaMasterId: 1,
					UserPersona: "Seller"
				},
				{
					UserPersonaMasterId: 2,
					UserPersona: "Buyer"
				}
			];

			debugger;
			$rootScope.SwitchMode = function (selectedMode) {

				debugger;
				$rootScope.UserPersonaJson.SelectedUserPersonaMasterId = selectedMode;
				$sessionStorage.UserPersonaMasterId = selectedMode;

				var menuList = angular.copy($rootScope.MenuList);

				var pageName = menuList.filter(function (el) { return el.UserPersonaMasterId === $rootScope.UserPersonaJson.SelectedUserPersonaMasterId; });
				if (pageName.length > 0) {
					$rootScope.RedirectPageFromMenu('ControlTower', 'Control Tower', 'Control Tower');
					$state.reload('ControlTower');
				}

			};


		}]);

