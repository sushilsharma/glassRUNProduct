angular.module("glassRUNProduct").controller('TransportOpratorController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, TransportOpratorService) {

    /* Tabbing Code */
    $scope.AddForm = function () {
        
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
    }
    $scope.ViewForm = function () {
        
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;

    }
    $scope.AddForm();


    var requestData = {
        roleId: 28,
        PageName: 'TransportOpratorPage'

    };


    TransportOpratorService.LoadAllPageControlByPageName(requestData).then(function (response) {
        

        var responsedData = response.data;
        var PageFieldAccess = responsedData[0].ObjectPropertiesList;
        $scope.page = {};
        for (var i = 0; i < PageFieldAccess.length; i++) {

            if (PageFieldAccess[i].AccessId === 2) {
                $scope.page[PageFieldAccess[i].PropertyName + "Edit"] = true;
                $scope.page[PageFieldAccess[i].PropertyName + "View"] = true;
            }
            else if (PageFieldAccess[i].AccessId === 1) {

                $scope.page[PageFieldAccess[i].PropertyName + "Edit"] = false;
                $scope.page[PageFieldAccess[i].PropertyName + "View"] = true;

            }
            else {
                $scope.page[PageFieldAccess[i].PropertyName + "Edit"] = false;
                $scope.page[PageFieldAccess[i].PropertyName + "View"] = false;
            }
           
        }
        

    });


});