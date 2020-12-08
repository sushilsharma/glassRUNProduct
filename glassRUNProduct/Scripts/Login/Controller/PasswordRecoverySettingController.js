angular.module("CampusProject").controller('PasswordRecoverySettingsController', function ($scope, $location, $http, adminService) {
    
    $scope.PasswordRecovery = {
        init: function() {
            $scope.LoadData();
        }
    };
    $scope.save = function () {
        $scope.$broadcast('show-errors-check-validity');
        //if ($scope.AdminForm.$valid) {
            var jsonobject = {};

            var passwordRecoveryFlowManagment = {
                PasswordRecoveryFlowManagmentId: $scope.PasswordRecoveryFlowManagmentId,
                IsOtpRequired: $scope.IsOTPRequired,
                IsSecurityQuestionMandatory: $scope.IsSecurityQuestionMandatory,
                RecoveryThroughPrimaryEmail: $scope.RecoveryThroughPrimaryEmail,
                RecoveryThroughAlternateEmail: $scope.RecoveryThroughAlternateEmail,
                RecoveryThroughRegisteredMobile: $scope.RecoveryThroughRegisteredMobile,
                RecoveryThroughSecurityQuestion: $scope.RecoveryThroughSecurityQuestion,
                CanAdminResetPassword: $scope.CanAdminResetPassword

            };
            jsonobject.PasswordRecoveryFlowManagment = passwordRecoveryFlowManagment;
            if ($scope.PasswordRecoveryFlowManagmentId === undefined) {
                

                adminService.AddPasswordRecovery(jsonobject).then(function (response) {
                    
                    alert(response.data);
                });
            } else {
                

                adminService.UpdatePasswordRecovery(jsonobject).then(function (response) {
                    
                    alert(response.data);
                    $scope.LoadData();
                });
               
            }
            
           
        //}
    };

    $scope.LoadData = function () {
        var jsonobject = {};

        adminService.PasswordRecoveryLoadData(jsonobject).then(function (response) {
            
            var myData = response.data;
            $scope.PasswordRecoveryFlowManagmentId = myData[0].PasswordRecoveryFlowManagmentId;
            $scope.IsOTPRequired = myData[0].IsOtpRequired;
            $scope.IsSecurityQuestionMandatory = myData[0].IsSecurityQuestionMandatory;
            $scope.RecoveryThroughPrimaryEmail = myData[0].RecoveryThroughPrimaryEmail;
            $scope.RecoveryThroughAlternateEmail = myData[0].RecoveryThroughAlternateEmail;
            $scope.RecoveryThroughRegisteredMobile = myData[0].RecoveryThroughRegisteredMobile;
            $scope.RecoveryThroughSecurityQuestion = myData[0].RecoveryThroughSecurityQuestion;
            $scope.CanAdminResetPassword = myData[0].CanAdminResetPassword;
           
        });
    };



    $scope.reset = function () {
        $scope.PasswordRecoveryFlowManagmentId = "";
        $scope.IsOTPRequired = "";
        $scope.IsSecurityQuestionMandatory = "";
        $scope.RecoveryThroughPrimaryEmail = "";
        $scope.RecoveryThroughAlternateEmail = "";
        $scope.RecoveryThroughRegisteredMobile = "";
        $scope.RecoveryThroughSecurityQuestion = "";
        $scope.CanAdminResetPassword = "";
        $scope.$broadcast('show-errors-reset');
    };
});
var JsonDateConverter = function (key, value) {
    var a;
    if (typeof value === 'string') {
        a = /\/Date\((\d*)\)\//.exec(value);
        if (a) {
            return convert(new Date(+a[1]));
        }
    }
    return value;
}

function convert(str) {
    
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("/");
}

