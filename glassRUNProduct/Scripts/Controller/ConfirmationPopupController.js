angular.module("glassRUNProduct").controller('ConfirmationPopupController', function ($scope, $rootScope, $location, $ionicModal, $state, pluginsService) {

    

    $rootScope.PopupVariables = {
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
        
        $rootScope.ConfirmationModalPopup = modal;
    });


    $rootScope.CloseConfirmationPopup = function () {
        $rootScope.ConfirmationModalPopup.hide();
    };

    $rootScope.OpenConfirmationPopup = function (title, erromsg, Okbtn) {
        
        $rootScope.PopupVariables.Title = title;
        $rootScope.PopupVariables.Message = erromsg;
        $rootScope.PopupVariables.Okbtn = Okbtn;
        

        $rootScope.ConfirmationModalPopup.show();
    };



});