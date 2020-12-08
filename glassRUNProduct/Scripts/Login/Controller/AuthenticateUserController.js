angular.module("CampusProject").controller('AuthenticateUserController', function ($scope, $http, $location, $rootScope, adminService, ManageUserService) {
    $scope.authenticateUser = {
        getValueFromPRFMAndUserDetail: function () {
            
            var jsonobject = {};
            jsonobject.userName = this.emailAddress;
            jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';

            adminService.GetValueFromPRFMAndUserDetail(jsonobject).then(function (response) {
                
                var myData = response.data;
                if (myData.length > 0) {
                    var userDetailId = myData[0].ProfileId;
                    //$rootScope.ProfileDetailsId = myData[0].ProfileId;
                    $scope.UserResetPassword(myData[0].ProfileId);
                    $location.path("/loginContent");

                } else {
                    //alert('Please Enter Your Correct Details.');
                    $rootScope.toggleModelAlert('Please Enter Your Correct Details.', '');
                }
            });
        },
    };

    $.getJSON("http://jsonip.com?callback=?", function (rdata) {
        $scope.userIpAddress = rdata.ip;
    });

    $scope.UserResetPassword = function (id) {
        
        var jsonobject = {};
        jsonobject.ProfileId = id;
        jsonobject.userIpAddress = "";
        jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';

        ManageUserService.ResetPasswordByAdmin(jsonobject).then(function (response) {
            
            
            $rootScope.toggleModelAlert("An email with a temporary password has been sent to the user's registered email.", "success");
        });
    };
});