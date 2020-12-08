angular.module("glassRUNProduct").controller('AuthenticationUsersController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, adminService, GrRequestService) {


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



    $scope.AuthenticationUser = function (username) {
        debugger;
        if (username !== undefined) {
            var jsonobject = {};
            jsonobject.userName = username;
            jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';

            //$rootScope.ObjectId = 0;
            //$rootScope.ObjectIdForLogging = 'New';
            //$rootScope.ObjectType = '';

            adminService.GetEmailByUserName(jsonobject).then(function (response) {
                
                var myData = response.data;
                if (myData.length > 0) {
                    //alert("Link has been sent to ur registered email id. you can reset your password with the help of that link.");
                    $scope.OpenConfirmationPopup('Validation', 'Link has been sent to ur registered email id. you can reset your password with the help of that link', 'OK');
                }
                else {
                    //alert("UserName is invalid");
                    $scope.OpenConfirmationPopup('Validation', 'UserName is invalid', 'OK');

                }
            });
        }
        else {
            //alert("Please enter the username.");
            $scope.OpenConfirmationPopup('Validation', 'Please enter the username.', 'OK');

        }
    }




    $scope.RedirectOnLogin = function () {
        $state.go("loginContent");
    }







    $scope.OpenConfirmationPopup = function (title, erromsg, Okbtn) {
        $scope.PopupVariables.Title = title;
        $scope.PopupVariables.Message = erromsg;
        $scope.PopupVariables.Okbtn = Okbtn;
        //$rootScope.ObjectId = 0;
        //$rootScope.ObjectType = '';

        $scope.ConfirmationModalPopup.show();
    };


});