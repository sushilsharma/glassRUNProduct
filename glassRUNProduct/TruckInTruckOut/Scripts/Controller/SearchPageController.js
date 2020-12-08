"use strict";
angular.module("glassRUNProduct").controller('SearchPageCtrl', function ($scope, $rootScope, $location, $q, $ionicHistory, $ionicModal, GrRequestService, $sessionStorage, pluginsService, $state, focus) {

    if ($rootScope.StockLocationCode === undefined || $rootScope.StockLocationCode === "") {
        $location.path('/loginContent');
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    if ($rootScope.SearchCriteria === "PlateNumber") {
        $scope.searchTittle = "Search Truck Plate Number";
        focus('txtPlateNumber');
    }
    else if ($rootScope.SearchCriteria === "Driver") {
        $scope.searchTittle = "Search Driver";
        focus('txtDriver');
    }
    else if ($rootScope.SearchCriteria === "Carrier") {
        $scope.searchTittle = "Search Carrier Number";
        focus('txtCarrier');
    }

    $scope.BackScreenView = function () {
        $ionicHistory.goBack();
    }

    $scope.SoListSearchValue = {};

    $scope.changePlateNumber = function () {
        var truckNumber = $scope.SoListSearchValue.PlateNumberSearch;
        $scope.LoadAllPlateNumber(truckNumber);
    }

    $scope.changeDriver = function () {
debugger;
        var Driver = $scope.SoListSearchValue.DriverSearch;
        $scope.LoadAllDriver(Driver);
    }

    $scope.DriverList = [];
    $scope.TransporterVehicleList = [];
    $scope.TransporterList = [];


    ///Sushil Sharma 25-09-2019
    ///Getting 10 record on load and after search getting only such record which is filter
    $scope.LoadAllDriver = function (driver) {
        $scope.throbber = true;
        var requestDataForCarrier = {};
        debugger;

        requestDataForCarrier =
            {
                ServicesAction: 'LoadAllDriverListForSecurityApp',
                CarrierId: 0,
                Driver:driver,
				LoginId: 0
            }

        var consolidateApiParamaterForCarrier =
            {
                Json: requestDataForCarrier,
            };

        GrRequestService.ProcessRequest(consolidateApiParamaterForCarrier).then(function (response) {
            $scope.throbber = false;
            if (response.data != undefined) {
                if (response.data.Json != undefined) {

                    $scope.DriverList = response.data.Json.ProfileList;
                } else {
                    $scope.DriverList = [];
                }
            } else {
                $scope.DriverList = [];
            }
        });
    }
    $scope.LoadAllDriver('');


        ///Sushil Sharma 25-09-2019
    ///Getting 10 record on load and after search getting only such record which is filter
    $scope.LoadAllPlateNumber = function (truckNumber) {
        $scope.throbber = true;
        var requestDataForCarrier = {};
        debugger;

        requestDataForCarrier =
            {
                ServicesAction: 'GetAllPlateNumberForSecurityApp',
                CarrierId: 0,
                PlateNumber: truckNumber
            }

        var consolidateApiParamaterForCarrier =
            {
                Json: requestDataForCarrier,
            };

        GrRequestService.ProcessRequest(consolidateApiParamaterForCarrier).then(function (response) {
            $scope.throbber = false;
            if (response.data != undefined) {
                if (response.data.Json != undefined) {

                    $scope.TransporterVehicleList = response.data.Json.TransporterVehicleList;
                } else {
                    $scope.TransporterVehicleList = [];
                }
            } else {
                $scope.TransporterVehicleList = [];
            }
        });
    }
    $scope.LoadAllPlateNumber('');



    $scope.LoadAllTransporterList = function () {
        $scope.throbber = true;


        var requestData =
            {
                ServicesAction: 'LoadAllCarrierListForSecurityApp',
                CompanyType: 28,
                TransporterVehicleRegistrationNumber: $rootScope.SearchPage.TransporterVehicleRegistrationNumber
            };

        var jsonobject = {};
        jsonobject.Json = requestData;

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $scope.throbber = false;
            if (response.data != undefined) {
                if (response.data.Json != undefined) {

                    $scope.TransporterList = response.data.Json.CompanyList;
                } else {
                    $scope.TransporterList = [];
                }
            } else {
                $scope.TransporterList = [];
            }
        });
    }
    $scope.LoadAllTransporterList();

//Added by nimesh on 16-12-2019
$scope.CarrierDetails=function(transporterVehicleList)
{
if ( transporterVehicleList[0].CarrierList != undefined ) {
					if ( transporterVehicleList[0].CarrierList.length == 1 ) {
						$rootScope.SearchPage.CompanyId = transporterVehicleList[0].CarrierList[0].CompanyId;
						$rootScope.SearchPage.CarrierName = transporterVehicleList[0].CarrierList[0].Name;

					}
					else {
						$rootScope.SearchPage.CompanyId = "";
						$rootScope.SearchPage.CarrierName = "";
					}
				}
				else {
					$rootScope.SearchPage.CompanyId = "";
					$rootScope.SearchPage.CarrierName = "";
				}
}
//Chnaged by nimesh on 16-12-2019
    $scope.GetPlateNumber = function ( TransporterVehicleRegistrationNumber, PlateNumber ) {
		debugger;
		$rootScope.SearchPage.PlateNumber = PlateNumber;
		var transporterVehicleList = $scope.TransporterVehicleList.filter( function ( el ) { return el.TransporterVehicleRegistrationNumber === TransporterVehicleRegistrationNumber; } );

		if ( transporterVehicleList.length > 0 ) {
			$rootScope.SearchPage.TransporterVehicleRegistrationNumber = transporterVehicleList[0].TransporterVehicleRegistrationNumber;
			$rootScope.SearchPage.DriverId="";
			$rootScope.SearchPage.DriverName="";
			$rootScope.SearchPage.LicenseNumber="";
			//if ( transporterVehicleList[0].DriverList != undefined ) {
			//	if ( transporterVehicleList[0].DriverList.length == 1 ) {
			//		var driverList = $scope.DriverList.filter( function ( el ) { return el.DeliveryPersonnelId === transporterVehicleList[0].DriverList[0].DriverId; } );

			//		if ( driverList.length > 0 ) {
			//			$rootScope.SearchPage.DriverId = driverList[0].DeliveryPersonnelId;
			//			$rootScope.SearchPage.DriverName = driverList[0].Name;
			//			$rootScope.SearchPage.LicenseNumber = driverList[0].LicenseNumber;
			//		}
			//	}
			//}


			//if ( transporterVehicleList[0].CarrierList != undefined ) {
			//	if ( transporterVehicleList[0].CarrierList.length == 1 ) {
			//		$rootScope.SearchPage.CompanyId = transporterVehicleList[0].CarrierList[0].CompanyId;
			//		$rootScope.SearchPage.CarrierName = transporterVehicleList[0].CarrierList[0].Name;

			//	}
			//	else {
			//		$rootScope.SearchPage.CompanyId = "";
			//		$rootScope.SearchPage.CarrierName = "";
			//	}
			//}
			//else {
			//	$rootScope.SearchPage.CompanyId = "";
			//	$rootScope.SearchPage.CarrierName = "";
			//}


			if ( transporterVehicleList[0].DriverList != undefined ) {
				if ( transporterVehicleList[0].DriverList.length == 1 ) {
					var requestDataForCarrier = {};
					debugger;

					requestDataForCarrier =
						{
							ServicesAction: 'LoadAllDriverListForSecurityApp',
							CarrierId: 0,
							Driver: '',
							LoginId: transporterVehicleList[0].DriverList[0].DriverId
						}

					var consolidateApiParamaterForCarrier =
						{
							Json: requestDataForCarrier,
						};

					GrRequestService.ProcessRequest( consolidateApiParamaterForCarrier ).then( function ( response ) {
						$scope.throbber = false;
						if ( response.data != undefined ) {
							if ( response.data.Json != undefined ) {
								$rootScope.SearchPage.DriverId = response.data.Json.ProfileList[0].DeliveryPersonnelId;
								$rootScope.SearchPage.DriverName = response.data.Json.ProfileList[0].Name;
								$rootScope.SearchPage.LicenseNumber = response.data.Json.ProfileList[0].LicenseNumber;
							}
						}



						$scope.CarrierDetails(transporterVehicleList);
						$location.path( '/InputTruckInDetails' );
					} );
				}
			}
			else {				
				$scope.CarrierDetails(transporterVehicleList);
				$location.path( '/InputTruckInDetails' );
			}
		}

	}



 $scope.GetDriver = function (DeliveryPersonnelId) {
        debugger;

        $rootScope.SearchPage.DriverId = DeliveryPersonnelId;
        var driverList = $scope.DriverList.filter(function (el) { return el.DeliveryPersonnelId === DeliveryPersonnelId; });

        if (driverList.length > 0) {
            $rootScope.SearchPage.DriverName = driverList[0].Name;
            $rootScope.SearchPage.LicenseNumber = driverList[0].LicenseNumber;
        }

        $location.path('/InputTruckInDetails');

    };


    $scope.GetCarrier = function (CompanyId) {
        debugger;

        $rootScope.SearchPage.CompanyId = CompanyId;
        var transporterList = $scope.TransporterList.filter(function (el) { return el.CompanyId === CompanyId; });

        if (transporterList.length > 0) {
            $rootScope.SearchPage.CarrierName = transporterList[0].Name;
        }

        $location.path('/InputTruckInDetails');

    };


});