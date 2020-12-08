angular.module("CampusProject").controller('PasswordResetController', function ($scope, $http, $location, adminService) {
    
    $scope.passwordReset = {
        
        init: function () {
            var data = $location.search().passwordRecoveryOTP;

            if (data !== undefined) {
                $scope.ByOTP = true;
            } else {
                $scope.ByOTP = false;
                var jsonobject = {};
                $scope.Id = $location.search().Id;
                jsonobject.passwordCode = $scope.Id; // 4/B69C366DB9A6
                adminService.GetPasswordCode(jsonobject).then(function (response) {
                    if (response.data.length > 0) {
                        
                        $location.path("/passwordRecovery").search('Id', $scope.Id);
                    } else {
                        alert('invalid url');
                        $location.path("/loginContent");
                    }
                    
                });
                
                //var recoveryOprtionsId = $location.search().recoveryOprtionsId;
                //var myuserId = $location.search().MyuserId;
                //var resetPassword = $location.search().resetPassword;

                //if (myuserId !== undefined && resetPassword !== undefined) {
                //    $location.path("/passwordRecovery").search('Id', Id).search('recoveryOprtionsId', recoveryOprtionsId).search('myuserId', myuserId).search('resetPassword', resetPassword);
                //} else {
                //    $location.path("/loginContent");
                //}
            }

        }
    };


    $scope.resetOldPassword = function () {
        

        var data = $location.search().refId;

        if (data == "" || data === undefined) {
        } else {
            var pageUrl = 'WebServices/LoginService.asmx';
            var jsonobject = {};
            var receivedVia = "";
            var otPassword = "";
            var passwordCode = "";
            if ($scope.ByOTP !== undefined) {
                receivedVia = "OTP";
                otPassword = this.Otp;
              
            } else {
                otPassword = "";
                receivedVia = "Email";
                passwordCode = $scope.Id;
            }


            $.getJSON("http://jsonip.com?callback=?", function (rdata) {
                $scope.userIpAddress = rdata.ip;
            });
            var data1 = $location.search().authenticationType;
            if (data1 === "verifyIdentity") {
                otPassword = "";
                receivedVia = "verifyIdentity";
            }

            data = data.replace('authenticationQuestion/33A8B698-D487-4F00-AF8D-B69C366DB9A6/Id/', '');
            jsonobject.userProfileId = data; // 4/
            jsonobject.passwordCode = passwordCode; // 4/

            jsonobject.userPassword = this.ConfirmNewPassword;
            jsonobject.userIpAddress = "12.56546.23";
            jsonobject.oneTimePassword = otPassword;
            jsonobject.passwordReceivedVia = receivedVia;
            jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';

            adminService.ResetPassword(jsonobject).then(function (response) {
                if (response.data !== 0) {
                    alert('Password changed');
                    $location.path("/loginContent");
                }
            });
        }

    };
});