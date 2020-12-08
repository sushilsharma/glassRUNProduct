"use strict";
angular.module("glassRUNProduct").controller('HomeCtrl', function ($scope, $rootScope, $location, $q, GrRequestService, $sessionStorage, pluginsService, $state) {
    
    if($rootScope.StockLocationCode === undefined || $rootScope.StockLocationCode === "")
    {
        $location.path('/loginContent');
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $rootScope.SearchPage = {
        TransporterVehicleId: '',
        CompanyId: '',
        DriverId: '',
        TransporterVehicleRegistrationNumber: '',
        DriverName: '',
        CarrierName: '',
        LicenseNumber: ''
    };

});