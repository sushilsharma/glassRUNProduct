angular.module("glassRUNProduct").directive('contactInformation', function (Logger) {
    return {
        restrict: 'E',
        scope: {
            contactInformationList: '=',
            resData: '=',
            contactTypeList: '='
        },
        templateUrl: 'Directives/ContactInformationComponent/ContactInformationView.html',
        controller: function ($scope, $rootScope, $ionicModal) {


            $scope.selectedID = '';

            //alert('hii');

            // alert($scope.contactTypeList.length);


            $scope.LoadDefaultSettingsValue = function () {

                $scope.ContactTypeList = $scope.contactTypeList;

            }
            $scope.LoadDefaultSettingsValue();




            //$scope.ContactInformationList = [];

            //$scope.ContactInformationList = $scope.contactInformationList;

            //#region Contact list


            $scope.InitalizeContactInformation = function () {

                $scope.ContactInformationObject = {
                    ContactTypeId: 0,
                    ContactPersonNumber: '',
                    ContactPersonName: '',
                    EditContactinfoGUID: ''

                }
            }

            $scope.InitalizeContactInformation();


            $rootScope.ClearInitalizeContactInformation = function () {
                debugger;
                $scope.InitalizeContactInformation();
            }

			$scope.AddContactPersonInfo = function () {
				debugger;
                if ($scope.ContactInformationObject.ContactTypeId === '' || $scope.ContactInformationObject.ContactPersonName === '' || $scope.ContactInformationObject.ContactPersonNumber === '') {
                    $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
                    return;
                }
                if ($scope.validateEmailSemicolon($scope.ContactInformationObject.ContactPersonNumber).length > 0) {

                    var ContactDetailsCode = "";
                    var ContactTypeCode = $scope.ContactTypeList.filter(function (el) { return el.LookUpId === $scope.ContactInformationObject.ContactTypeId; });
                    if (ContactTypeCode.length > 0) {
                        ContactDetailsCode = ContactTypeCode[0].Name;
                    }
                    if (ContactDetailsCode.toUpperCase() === 'MOBILENO') {
                        $rootScope.ValidationErrorAlert('Please Enter Valid Mobile No.', 'error', 3000);
                    }
                    else if (ContactDetailsCode.toUpperCase() === 'EMAIL') {
                        $rootScope.ValidationErrorAlert('Please Enter Valid Email ID.', 'error', 3000);
                    }
                    else if (ContactDetailsCode.toUpperCase() === 'FAX') {
                        $rootScope.ValidationErrorAlert('Please Enter Valid Fax.', 'error', 3000);
                    }

                    return;
                }



                var ContactType = '';

                var ContactDetails = $scope.ContactTypeList.filter(function (m) { return m.LookUpId === $scope.ContactInformationObject.ContactTypeId })
                if (ContactDetails.length > 0) {
                    ContactType = ContactDetails[0].Name
                }


                if ($scope.ContactInformationObject.ContactTypeId != '' && $scope.ContactInformationObject.ContactPersonName != '' && $scope.ContactInformationObject.ContactPersonNumber != '') {


                    if ($scope.ContactInformationObject.EditContactinfoGUID !== '') {
                        var Concatctinfo = $scope.contactInformationList.filter(function (m) { return m.ContactinfoGUID === $scope.ContactInformationObject.EditContactinfoGUID; });

                        Concatctinfo[0].ContactType = ContactType;
                        Concatctinfo[0].ContactTypeId = $scope.ContactInformationObject.ContactTypeId;
                        Concatctinfo[0].ContactPersonName = $scope.ContactInformationObject.ContactPersonName;
                        Concatctinfo[0].ContactPersonNumber = $scope.ContactInformationObject.ContactPersonNumber;
                        Concatctinfo[0].IsActive = true;
                        Concatctinfo[0].CreatedBy = $rootScope.UserId;
                    } else {


                        var Contactinfo = {
                            ContactinfoGUID: generateGUID(),
                            ContactType: ContactType,
                            ContactTypeId: $scope.ContactInformationObject.ContactTypeId,
                            ContactPersonName: $scope.ContactInformationObject.ContactPersonName,
                            ContactPersonNumber: $scope.ContactInformationObject.ContactPersonNumber,
                            ObjectType: 'Login',
                            IsActive: true,
                            CreatedBy: $rootScope.UserId,
                        }
                        $scope.contactInformationList.push(Contactinfo);


                    }

                    $rootScope.ContactPersonRecordEditedTrue = false;
                    $scope.InitalizeContactInformation();
                }
                else {
                    $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
                }


            }

            
            $scope.EditContactPersonInfo = function (id) {

                $scope.InitalizeContactInformation();
                var Concatctinfo = $scope.contactInformationList.filter(function (m) { return m.ContactinfoGUID === id; });
                $scope.ContactInformationObject.EditContactinfoGUID = id;
                $scope.ContactInformationObject.ContactTypeId = Concatctinfo[0].ContactTypeId;
                $scope.ContactInformationObject.ContactPersonNumber = Concatctinfo[0].ContactPersonNumber;
                $scope.ContactInformationObject.ContactPersonName = Concatctinfo[0].ContactPersonName;
                $rootScope.ContactPersonRecordEditedTrue = true;
            }


            $scope.DeleteContactInfo = function (id) {

                var ContactInfo = $scope.contactInformationList.filter(function (m) { return m.ContactinfoGUID !== id; });
                $scope.contactInformationList = ContactInfo;
            }



            $scope.GetSelectedValue = function (id) {
                debugger;
                var ContactInfoList = $scope.ContactTypeList.filter(function (m) { return m.LookUpId === id; });
                $scope.LabelName = ContactInfoList[0].Name;
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
                $rootScope.ContactPersonRecordEditedTrue = false;
                $scope.InitalizeContactInformation();
                $rootScope.Throbber.Visible = false;

            }


            function validateEmail(email) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(email);
            }

            function validateMobileNo(MobileNo) {
                var re = /^\d+$/;
                return re.test(MobileNo);
            }

            $scope.filterValue = function ($event) {
                debugger;
                var filterVlaueChk = false;
                if ($scope.ContactInformationObject.ContactTypeId === 'FAX' || $scope.ContactInformationObject.ContactTypeId === 'MOBILENO') {
                    filterVlaueChk = validateMobileNo(ContactInformationObject.ContactPersonNumber);
                } else if ($scope.ContactInformationObject.ContactTypeId == 'EMAIL') {
                    filterVlaueChk = validateEmail(ContactInformationObject.ContactPersonNumber);
                }
                return filterVlaueChk;
            };

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
                        var MObileNO = str.toString().split(';');

                        for (i = 0; i < MObileNO.length; i++) {
                            if (!validateMobileNo(MObileNO[i].trim())) {
                                invalidEmails.push(MObileNO[i].trim())
                            }
                        }
                    }
                    else if (ContactDetailsCode.toUpperCase() === 'FAX') {
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


