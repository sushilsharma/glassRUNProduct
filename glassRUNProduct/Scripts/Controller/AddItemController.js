angular.module("glassRUNProduct").controller('AddItemController', function ($scope, $http, $state, $sessionStorage, $rootScope, $filter, focus, $location, $ionicModal, GrRequestService, pluginsService) {

  



    $scope.CloseAddItemInMasterPopup = function () {
        $rootScope.ItemAddedModalPopupControl = false;
    }

    
});