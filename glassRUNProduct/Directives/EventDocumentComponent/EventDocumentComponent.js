angular.module("glassRUNProduct").directive('eventDocument', function (Logger) {
	return {
		restrict: 'E',
		scope: {
			eventDocumentList: '=',
			resData: '=',
			documentTypeList: '='
		},
		templateUrl: 'Directives/EventDocumentComponent/EventDocumentView.html',
		controller: function ($scope, $rootScope, $ionicModal) {


			$scope.selectedID = '';

			//alert('hii');

			// alert($scope.contactTypeList.length);


			$scope.LoadDefaultSettingsValue = function () {

				$scope.DocumentTypeList = $scope.documentTypeList;

			}
			$scope.LoadDefaultSettingsValue();





			$scope.InitalizeEventDocumentInformation = function () {

				debugger;

				$scope.EventDocumentObject = {
					DocumentTypeId: 0,
					Remarks: '',
					EditEventDocumentinfoGUID: ''

				}
			}

			$scope.InitalizeEventDocumentInformation();



			$scope.AddEventDocumentInfo = function () {
				debugger;				
				if($scope.EventDocumentObject.DocumentTypeId === '' || $scope.EventDocumentObject.DocumentTypeId === 0 || $scope.EventDocumentObject.DocumentTypeId === null){
					$rootScope.ValidationErrorAlert('Please select document type.', '', 3000);
					return;
				}
				if($scope.EventDocumentObject.Remarks === ''){
					$rootScope.ValidationErrorAlert('Please enter remarks.', '', 3000);
					return;
				}




				var ContactType = '';

				var DocumentTypeDetails = $scope.DocumentTypeList.filter(function (m) { return m.LookUpId === $scope.EventDocumentObject.DocumentTypeId })
				if (DocumentTypeDetails.length > 0) {
					DocumentType = DocumentTypeDetails[0].Name
				}


				if ($scope.EventDocumentObject.DocumentTypeId != '' && $scope.EventDocumentObject.Remarks != '') {


					if ($scope.EventDocumentObject.EditEventDocumentinfoGUID !== '') {
						var eventDocumentinfo = $scope.eventDocumentList.filter(function (m) { return m.EventDocumentinfoGUID === $scope.EventDocumentObject.EditEventDocumentinfoGUID; });

						eventDocumentinfo[0].DocumentType = DocumentType;
						eventDocumentinfo[0].DocumentTypeId = $scope.EventDocumentObject.DocumentTypeId;
						eventDocumentinfo[0].Remarks = $scope.EventDocumentObject.Remarks
						eventDocumentinfo[0].IsActive = true;
						eventDocumentinfo[0].CreatedBy = $rootScope.UserId;
					} else {


						var eventDocumentLocalinfo = {
							EventDocumentinfoGUID: generateGUID(),
							DocumentType: DocumentType,
							DocumentTypeId: $scope.EventDocumentObject.DocumentTypeId,
							Remarks: $scope.EventDocumentObject.Remarks,
							IsActive: true,
							CreatedBy: $rootScope.UserId,
						}
						$scope.eventDocumentList.push(eventDocumentLocalinfo);


					}


					$scope.InitalizeEventDocumentInformation();
				}
				else {
					$rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
				}


			}


			$scope.EditEventDocumentInfo = function (id) {

				$scope.InitalizeEventDocumentInformation();
				var eventDocumentinfo = $scope.eventDocumentList.filter(function (m) { return m.EventDocumentinfoGUID === id; });
				$scope.EventDocumentObject.EditEventDocumentinfoGUID = id;
				$scope.EventDocumentObject.DocumentType = eventDocumentinfo[0].DocumentType
				$scope.EventDocumentObject.DocumentTypeId = eventDocumentinfo[0].DocumentTypeId
				$scope.EventDocumentObject.Remarks = eventDocumentinfo[0].Remarks
			}


			$scope.DeleteEventDocumentInfo = function (id) {

				var eventDocumentinfo = $scope.eventDocumentList.filter(function (m) { return m.EventDocumentinfoGUID !== id; });
				$scope.eventDocumentList = eventDocumentinfo;
			}



			$scope.GetSelectedValue = function (id) {
				debugger;
				var documentTypeList = $scope.DocumentTypeList.filter(function (m) { return m.LookUpId === id; });
				$scope.LabelName = documentTypeList[0].Name;
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

			//#endregion
			//#region Delete Add Grid Data with Confirmation
			$ionicModal.fromTemplateUrl('WarningMessage.html', {
				scope: $scope,
				animation: 'fade-in',
				backdropClickToClose: false,
				hardwareBackButtonClose: false
			}).then(function (modal) {
				$scope.DeleteWarningMessageControl = modal;
			});

			$scope.OpenDeleteConfirmation = function () {

				$scope.DeleteWarningMessageControl.show();
			};
			$scope.CloseDeleteConfirmation = function () {
				$scope.DeleteWarningMessageControl.hide();
			};


			$scope.DeleteContactInfoObject = function (Id) {
				debugger;
				$scope.selectedID = Id;
				$scope.OpenDeleteConfirmation();
			}
			$scope.DeleteYes = function () {

				$rootScope.Throbber.Visible = true;
				$scope.DeleteContactInfo($scope.selectedID);
				$scope.selectedID = '';
				$scope.CloseDeleteConfirmation();
				$rootScope.Throbber.Visible = false;

			}


			function validateEmail(email) {
				var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
				return re.test(email);
			}

			function validateMobileNo(MobileNo) {
				var re = /[0-9 -()+{10}]+$/;
				return re.test(MobileNo);
			}



			$scope.validateEmailSemicolon = function (str) {

				// var str = "abc@abc.com;abc@abc.com; abc@a@bc.com ; abc@abc.com ;abc@abc.com;"
				var invalidEmails = [];
				if (str !== "" && str !== null && str !== undefined) {
					var ContactDetailsCode = "";
					var ContactTypeCode = $scope.ContactTypeList.filter(function (el) { return el.LookUpId === $scope.ContactInformationObject.ContactTypeId; });

					if (ContactTypeCode.length > 0) {
						ContactDetailsCode = ContactTypeCode[0].Name;
					}
					if (ContactDetailsCode.toUpperCase() === 'MOBILENO') {
						var MObileNO = str.split(';');

						for (i = 0; i < MObileNO.length; i++) {
							if (!validateMobileNo(MObileNO[i].trim())) {
								invalidEmails.push(MObileNO[i].trim())
							}
						}
					}
					else if (ContactDetailsCode.toUpperCase() === 'EMAIL') {
						var emails = str.split(';');

						for (i = 0; i < emails.length; i++) {
							if (!validateEmail(emails[i].trim())) {
								invalidEmails.push(emails[i].trim())
							}
						}
					}

					//else if (NotificationCode.toUpperCase() === 'DEVICE' || NotificationCode.toUpperCase() === 'PORTAL') {

					//}


				}
				return invalidEmails;

			}


		}
	}
})


