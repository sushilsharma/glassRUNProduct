angular.module("glassRUNProduct").controller('PasswordRecoveryController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, adminService, GrRequestService) {



    $scope.passrecovery = {
        confirmPassword: "",
        newPassword: "",

    }

    $scope.PopupVariables = {
        Title: '',
        Message: '',
        Okbtn: '',
        Cancelbtn: ''
    }

    $ionicModal.fromTemplateUrl('ConfirmationPopuScreen.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.ConfirmationModalPopup = modal;
    });

    $scope.CloseConfirmationPopup = function () {
        //$rootScope.ObjectId = 0;
        //$rootScope.ObjectType = '';
        $scope.ConfirmationModalPopup.hide();
    };


    //
    //$scope.passwordReset = {
    //    init: function () {


    //        var data = $location.search().passwordRecoveryOTP;

    //        if (data !== undefined) {
    //            $scope.ByOTP = true;
    //        } else {
    //            $scope.ByOTP = false;

    //            
    //            var jsonobject = {};
    //            var Id = $location.search().Id;
    //            jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';
    //            jsonobject.ResetPasswordCode = Id;
    //            adminService.CheckPasswordHistory(jsonobject).then(function (response) {
    //                
    //                var respnsePasshistpory = response.data;
    //                var myuserId = respnsePasshistpory[0].ProfileId;
    //                $scope.IntUserId = myuserId;

    //                if (myuserId !== undefined) {
    //                    $location.path("/PasswordRecovery").search('Id', Id).search('myuserId', myuserId);
    //                } else {
    //                    $location.path("/loginContent");
    //                }

    //            });




    //        }

    //    }
    //};


    $scope.resetOldPassword = function () {
        
        var jsonobject = {};
        if ($scope.passrecovery.confirmPassword == $scope.passrecovery.newPassword) {
            var data = $location.search().GUID;
            //var data = $location.absUrl().split('#/')[1].split('#/').GUID;

            if (data === "" || data === undefined) {
            } else {

                jsonobject.guid = data; // 4/B69C366DB9A6
                jsonobject.userPassword = $scope.passrecovery.confirmPassword;
                jsonobject.userIpAddress = "12.56546.23";
                jsonobject.oneTimePassword = "";
                jsonobject.passwordReceivedVia = "";
                jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';

                adminService.ResetPassword(jsonobject).then(function (response) {
                    
                    if (response.data !== 0 && response.data !== undefined) {

                        //alert('Password changed');
                        $scope.OpenConfirmationPopup('Validation', 'Password changed', 'OK');

                        $state.go("loginContent");
                    }
                    else {
                        //alert('Invalid');
                        $scope.OpenConfirmationPopup('Validation', 'Invalid', 'OK');

                        
                    }
                });
            }
        }
        else {
            //alert('Password does not match');
            $scope.OpenConfirmationPopup('Validation', 'Password does not match', 'OK');
        }
    };



    $scope.OpenConfirmationPopup = function (title, erromsg, Okbtn) {
        $scope.PopupVariables.Title = title;
        $scope.PopupVariables.Message = erromsg;
        $scope.PopupVariables.Okbtn = Okbtn;
        //$rootScope.ObjectId = 0;
        //$rootScope.ObjectType = '';

        $scope.ConfirmationModalPopup.show();
    };




});