angular.module("glassRUNProduct").controller('CreateInquiryForTOController', function ($scope, $location, $ionicModal, pluginsService) {
    debugger;
    setTimeout(function () {
        debugger;
        pluginsService.init();
    }, 200);

    $scope.OrderData = [];
    var orders = {
        OrderGUID: 1,
        TruckName: "Truck" + 1,
        DeliveryLocation: '',
        TruckSize: '',
        ProposedETDStr: '',
        SpecialRequest: '',
        TotalWeight: 0,
        TruckCapacity: 0,
        TruckPallets: 0,
        TotalProductPallets: 0,
        OrderProductList: []
    }
    $scope.OrderData.push(orders);

    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.modalpopup = modal;
    });

    $scope.OpenModalpopup = function () {
        debugger;

        $scope.modalpopup.show();
    }

    $scope.CloseModalpopup = function () {
        $scope.modalpopup.hide();
    }


    $ionicModal.fromTemplateUrl('templates/ShowRPMQuantity.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.ViewRPMQuantitypopup = modal;
    });

    $scope.ShowRPMItemCollection = function () {
        debugger;

        $scope.ViewRPMQuantitypopup.show();
    }

    $scope.CloseViewRPMQuantitypopup = function () {
        debugger;
        $scope.ViewRPMQuantitypopup.hide();
    }
});