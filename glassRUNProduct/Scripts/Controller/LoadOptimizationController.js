angular.module("glassRUNProduct").controller('LoadOptimizationController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, GrRequestService) {
    

    $scope.LoadOptiimizationJson = {
        OrderDate: ''
    }
    pluginsService.init();

    $scope.LoadOptimization = function () {
        

        var requestData =
            {
                ServicesAction: 'LoadOptimization',
                OrderDate: $scope.LoadOptiimizationJson.OrderDate,
                OrderType: '',
                CurrentState: 3
            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            
            
            if (response.data !== undefined && response.data !== null) {
                

                $scope.WaveList = response.data.WaveDefinitionList;
                $scope.OrderList = response.data.OrderList;

                for (var i = 0; i < $scope.WaveList.length; i++) {
                    var orderList = $scope.OrderList.filter(function (el) { return el.AssignWaveDefinitionId === parseInt($scope.WaveList[i].WaveDefinitionId) });
                    for (var j = 0; j < $scope.WaveList[i].WaveDefinitionDetailList.length; j++) {
                        if (orderList.length > 0) {
                            var TruckAssignOrders = orderList.filter(function (el) { return el.AssignWaveTruckDefinitionId === parseInt($scope.WaveList[i].WaveDefinitionDetailList[j].WaveDefinitionDetailsId) });
                            if (TruckAssignOrders.length > 0) {
                                $scope.WaveList[i].WaveDefinitionDetailList[j].OrderList = TruckAssignOrders;
                            }
                        }

                    }

                }
            }




        });

    }

});