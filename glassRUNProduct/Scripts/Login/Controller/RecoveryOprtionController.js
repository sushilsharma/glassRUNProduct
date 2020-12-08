angular.module("CampusProject").controller('recoveryOprtionsController', function ($scope, $http, $rootScope, $location, adminService) {
    $scope.recovery = {
        init: function () {
            
            var jsonobject = {};
            jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';
            // Check OTP Required is True or False

            adminService.GetPasswordRecoveryFlow(jsonobject).then(function (response) {
                
                var myData = response.data;

                if (myData[0].IsOTPRequired) {
                    $scope.MyValue = true;
                } else {
                    $scope.MyValue = false;
                }
                if (myData[0].RecoveryThroughPrimaryEmail) {
                    $scope.MyEmail = true;
                } else {
                    $scope.MyEmail = false;
                }
                if (myData[0].RecoveryThroughAlternateEmail) {
                    $scope.MyAlternetEmail = true;
                } else {
                    $scope.MyAlternetEmail = false;
                }
                if (myData[0].RecoveryThroughRegisteredMobile) {
                    $scope.MyValue = true;
                } else {
                    $scope.MyValue = false;
                }

                if (myData[0].RecoveryThroughSecurityQuestion) {
                    $scope.MyVerifyIdentity = true;
                } else {
                    $scope.MyVerifyIdentity = false;
                }

                if (myData[0].IsSecurityQuestionMandatory) {
                    $scope.SecurityQuestionMandatory = true;
                } else {
                    $scope.SecurityQuestionMandatory = false;
                }
            });


            var data = $location.search().refId;
            if (data == "" || data === undefined) {
                $location.path("/authenticateUsers");
            } else {
                
                data = data.replace('recoveryOprtions/0A3F3F3B-6679-4AFF-B49F-7C6D7C69D90D/Id/', '');

                jsonobject.ProfileId = data;
                jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';
                adminService.GetUserDetailsByUserProfileId(jsonobject).then(function (response) {
                    
                    var myData1 = response.data;
                    $scope.recovery = myData1;
                    $scope.recovery = response.data;

                });
            }
        }
    };

    $scope.checkSelectedValue = function () {
        //alert($scope.Email);
        
        var data = $location.search().refId;
        if (data === "" || data === undefined) {
            $location.path("/authenticateUsers");
        } else {
            var pageUrl = 'WebServices/LoginService.asmx';
            var jsonobject = {};
            data = data.replace('recoveryOprtions/0A3F3F3B-6679-4AFF-B49F-7C6D7C69D90D/Id/', '');
            if ((this.Email !== undefined && this.Email !== "")) {
                var useData = 'Email';

                //if (this.Email !== undefined) {
                //    useData = $scope.Email;
                //} else if (this.Email !== undefined) {
                    //useData = this.Email;
                //}
                if ($scope.SecurityQuestionMandatory) { // Security question is mendatory
                    jsonobject.userProfileId = data;
                    jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';
                    adminService.checkSelectedValue(jsonobject).then(function (response) {
                        if (response.data.length > 0) {
                            var myData = response.data;
                            var userDetailId = myData[0].ProfileId;
                            $location.path("/authenticationQuestion").search('refId', 'authenticationQuestion/33A8B698-D487-4F00-AF8D-B69C366DB9A6/Id/' + userDetailId);
                        }
                    });

                } else { // Security question is non mendatory
                    jsonobject.userProfileId = data;
                    jsonobject.validateThrough = useData;
                    jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';

                    adminService.SendPasswordRecoveryDetails(jsonobject).then(function (response) {
                        
                        if (response.data.length > 0) {
                            alert(response.data);
                            $location.path("/loginContant");
                        }
                    });
                }
            } else if ((this.PhoneNo !== undefined && this.PhoneNo !== "")) {
                // function for otp send

                jsonobject.userProfileId = data;
                jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';
                adminService.GetPasswordRecoveryFlow(jsonobject).then(function (response) {
                    console.log('send otp block');
                    var myData = response.data;
                    var userDetailId = myData;
                    $location.path("/passwordRecovery").search('passwordRecoveryId', 'passwordRecovery/33A8B698-D487-4F00-AF8D-B69C366DB9A6/Id/' + data).search('passwordRecoveryOTP', '1');
                });
            }
            else if (this.VerifyIdentity !== undefined) {
                
                console.log('VerifyIdentity');
                $location.path("/authenticationQuestion").search('refId', 'authenticationQuestion/33A8B698-D487-4F00-AF8D-B69C366DB9A6/Id/' + data).search('authenticationType', 'verifyIdentity');
            } else {
                //alert('Please select any one.');
                $rootScope.toggleModelAlert('Please select any one.', '');
            }
        }
    };

    $scope.verifyIdentity = function () {
        var data = $location.search().refId;
        if (data === "" || data === undefined) {
            //$location.path("/authenticateUsers");
        } else {
            data = data.replace('recoveryOprtions/0A3F3F3B-6679-4AFF-B49F-7C6D7C69D90D/Id/', '');
            $location.path("/authenticationQuestion").search('refId', 'authenticationQuestion/33A8B698-D487-4F00-AF8D-B69C366DB9A6/Id/' + data).search('authenticationType', 'verifyIdentity');
        }
    };
});