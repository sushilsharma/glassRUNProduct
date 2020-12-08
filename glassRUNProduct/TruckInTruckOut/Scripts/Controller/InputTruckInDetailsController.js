"use strict";
angular.module("glassRUNProduct").controller('InputTruckInDetails', function ($scope, $rootScope, $location, $q, $ionicHistory, $ionicModal, GrRequestService, $sessionStorage, pluginsService, $state) {


    if($rootScope.StockLocationCode === undefined || $rootScope.StockLocationCode === "")
    {
        $location.path('/loginContent');
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.BackScreenView = function () {
        $ionicHistory.goBack();
    }

debugger;
    $scope.Truck = {
        TransporterVehicleId: $rootScope.SearchPage.PlateNumber,
        CompanyId: $rootScope.SearchPage.CompanyId,
        DriverId: $rootScope.SearchPage.DriverId,
        TransporterVehicleRegistrationNumber: $rootScope.SearchPage.TransporterVehicleRegistrationNumber,
        DriverName: $rootScope.SearchPage.DriverName,
        CarrierName: $rootScope.SearchPage.CarrierName,
        LicenseNumber: $rootScope.SearchPage.LicenseNumber
    }
    $scope.DriverList = [];
    $scope.TransporterVehicleList = [];
    $scope.TransporterList = [];


    $rootScope.EnterTruckPlateNumber = "";
    $rootScope.EnterTruckDriverName = "";

    function onSuccess(imageData) {
        debugger;

        try {

            var image = document.getElementById('truckImage');
            image.src = "data:image/jpeg;base64," + imageData;


            var ff11 = window;
            var ff = window.plugins;
            cordova.plugins.OpenALPR.scan(
                filepath,
                { country: "eu", amount: 3 },
                function (results) {
                    console.log(results);
                },
                function (error) {
                    console.log(error.code + ": " + error.message);
                }
            );
        } catch (e) {
            alert('Failed : ' + e.message);
        }
    }


    function onFail(message) {
        alert('Failed because: ' + message);
    }



    $scope.LoadAllDriver = function () {
        $scope.throbber = true;
        var requestDataForCarrier = {};
        debugger;

        requestDataForCarrier =
            {
                ServicesAction: 'LoadAllDriverListForSecurityApp',
                CarrierId: 0,
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
    //$scope.LoadAllDriver();


    $scope.LoadAllPlateNumber = function () {
        $scope.throbber = true;
        var requestDataForCarrier = {};
        debugger;

        requestDataForCarrier =
            {
                ServicesAction: 'GetAllPlateNumberForSecurityApp',
                CarrierId: 0,
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
    //$scope.LoadAllPlateNumber();



    $scope.LoadAllTransporterList = function () {
        $scope.throbber = true;


        var requestData =
            {
                ServicesAction: 'LoadAllCompanyDetailListByDropDown',
                CompanyType: 28

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
    //$scope.LoadAllTransporterList();



    $scope.ClickPhoto = function () {
        debugger;

        var options = {
            // Some common settings are 20, 50, and 100
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true  //Corrects Android orientation quirks
        }

        navigator.camera.getPicture(onSuccess, onFail, options);
    }




    $scope.TruckInDetailsReset = function () {
        $scope.Truck.DriverId = 0;
        $scope.Truck.TransporterVehicleId = 0;
        $scope.Truck.CompanyId = 0;

        $scope.Truck.TransporterVehicleRegistrationNumber = undefined;
        $scope.Truck.DriverName = undefined;
        $scope.Truck.CarrierName = undefined;

        $rootScope.SearchPage = {
            TransporterVehicleId: "",
            CompanyId: "",
            DriverId: "",
            TransporterVehicleRegistrationNumber: undefined,
            DriverName: undefined,
            CarrierName: undefined,
            LicenseNumber: undefined
        }

    }

    $scope.ConfirmTruckInDetails = function () {


        $rootScope.EnterTruckPlateNumber = $scope.Truck.PlateNumber;

        if ($scope.Truck.TransporterVehicleId == "" || $scope.Truck.TransporterVehicleId == null || $scope.Truck.TransporterVehicleId == undefined) {
            //alert('Please Enter Truck Number');
            //$scope.OpenAlertMessagesPopUp('Please select Truck Plate Number.');
            $rootScope.ValidationErrorAlert('Please select Truck Plate Number.', '', 3000);
            return false;
        }

        if ($scope.Truck.DriverId == "" || $scope.Truck.DriverId == null || $scope.Truck.DriverId == undefined) {


            //alert('Please Select Driver');

            //$scope.OpenAlertMessagesPopUp('Please Select Driver');
            $rootScope.ValidationErrorAlert('Please Select Driver.', '', 3000);

            return false;
        }

        if ($scope.Truck.CompanyId == "" || $scope.Truck.CompanyId == null || $scope.Truck.CompanyId == undefined) {
            //alert('Please select Carrier Number');
            //$scope.OpenAlertMessagesPopUp('Please select Carrier Number');
            $rootScope.ValidationErrorAlert('Please select Carrier Number.', '', 3000);
            return false;
        }

        $scope.OpenTruckInConfirmationModalPopup();


    };

    $scope.SaveTruckInDetails = function () {
        

        $scope.throbber = true;
        debugger;
        var requestData = {
            ServicesAction: 'SaveTruckInDetails',
            PlateNumber: $scope.Truck.TransporterVehicleId,
            StockLocationCode: $rootScope.StockLocationCode,
            DriverId: $scope.Truck.DriverId,
            CarrierId: $scope.Truck.CompanyId,
            TruckInDataTime: GetCurrentdate(),
            CreatedBy: $rootScope.UserId,
        };

        var consolidateApiParamater =
            {
                Json: requestData,
            };

        $scope.process = true;
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            $scope.throbber = false;

            $scope.CloseTruckInConfirmationModalPopup();

            var orderResponse = response.data;
            if (orderResponse.Json !== "" && orderResponse.Json !== undefined) {

                if (orderResponse.Json.IsTruckInExists != 0) {

                    //alert('This Vehicle there is already in.');
                    //$scope.OpenAlertMessagesPopUp('This Vehicle Plate Number has already been Trucked-In.');
                    //Changed by Chetan Tambe (30/08/2019) : Validation message UI
                    $rootScope.ValidationErrorAlert('This Vehicle Plate Number has already been Trucked-In.', '', 3000);
                    return false;

                    //$rootScope.OrderList = orderResponse.Json.OrderList;
                    //$location.path('/OrderList');
                }
                else {
					//$location.path('/TruckInTruckOutHomePage');



					// this code  is added by Sonu  on 25-09-2019 :condition redirect to LoadOrderInTruck or TruckInTruckOutHomePage   .

					var IsShowOrderViewForGK = $scope.LoadSettingInfoByName('IsShowOrderViewForGK', 'int');

					if (IsShowOrderViewForGK == 1) {


						var platenumber = $scope.Truck.TransporterVehicleRegistrationNumber;
						var idx = platenumber.split("(");
						platenumber = idx[0];

						$rootScope.TruckInDeatilsId = orderResponse.Json.TruckInDeatilsId;
						$rootScope.PlateNumber = platenumber.trim();
						$rootScope.SelectedStockLocationCode = $rootScope.StockLocationCode;
						$rootScope.DriverName = $scope.Truck.DriverName;
						$rootScope.DriverId = $scope.Truck.DriverId;
						$rootScope.CarrierName = $scope.Truck.CarrierName;
						$rootScope.LicenseNumber = $scope.Truck.LicenseNumber;
						$rootScope.CarrierId = $scope.Truck.CompanyId;



						$location.path('/LoadOrderInTruck');

					} else {

						$location.path('/TruckInTruckOutHomePage');
					}



					
					
                }
            }
			else {

			
				$rootScope.ValidationErrorAlert('Error Occurs', '', 3000);
				return false;
            }
        });
	}


	// this method  is added by Sonu  on 24-09-2019.
	$scope.LoadSettingInfoByName = function (settingName, returnValueDataType) {

		var settingValue = "";
		var allSettingMasterData = $sessionStorage.AllSettingMasterData//angular.copy($rootScope.SettingMasterInfoList);
		if (allSettingMasterData != undefined) {
			var settingMaster = allSettingMasterData.filter(function (el) { return el.SettingParameter === settingName; });
			if (settingMaster.length > 0) {
				settingValue = settingMaster[0].SettingValue;
			}
		}
		if (returnValueDataType === "int") {
			if (settingValue !== "") {
				settingValue = parseInt(settingValue);
			}
		} else if (returnValueDataType === "float") {
			if (settingValue !== "") {
				settingValue = parseFloat(settingValue);
			}
		} else {
			settingValue = settingValue;
		}
		return settingValue;
	};


    $scope.ErrorMessage = "";

    $ionicModal.fromTemplateUrl('AlertMessagesPopUp.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false,
        focusFirstInput: true
    }).then(function (modal) {
        $scope.AlertMessagesPopUp = modal;
    });
    $scope.CloseAlertMessagesPopUp = function () {
        $scope.AlertMessagesPopUp.hide();
    };

    $scope.OpenAlertMessagesPopUp = function (errorMsg) {

        $scope.ErrorMessage = errorMsg;
        $scope.AlertMessagesPopUp.show();

    };

    $scope.GoToSearchPage = function (gotoSearch) {
        debugger;
        //Chetan Tambe(30/08/2019) : Validation message to select plate number first.
        if(gotoSearch !== "PlateNumber")
        {
            if ($scope.Truck.TransporterVehicleId == "" || $scope.Truck.TransporterVehicleId == null || $scope.Truck.TransporterVehicleId == undefined) {
                $rootScope.ValidationErrorAlert('Please select Truck Plate Number.', '', 3000);
                return false;
            }        
        }

        $rootScope.SearchCriteria = gotoSearch;
        $location.path('/SearchPage');

    };

    $ionicModal.fromTemplateUrl('TruckInConfirmationModalPopup.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false,
        focusFirstInput: true
    }).then(function (modal) {
        $scope.TruckInConfirmationModalPopup = modal;
    });
    $scope.CloseTruckInConfirmationModalPopup = function () {
        $scope.TruckInConfirmationModalPopup.hide();
    };

    $scope.OpenTruckInConfirmationModalPopup = function () {
        
        $scope.TruckInConfirmationModalPopup.show();

    };


    $scope.Imagesrc = "data:image/png;base64,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";

});