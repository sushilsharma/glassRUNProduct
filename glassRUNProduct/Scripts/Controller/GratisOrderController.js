angular.module("glassRUNProduct").controller('GratisOrderController', function ($http, $scope, $rootScope, $sessionStorage, $state, $location, $ionicModal, GrRequestService) {
    

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = false;
    } else {
        $rootScope.Throbber = {
            Visible: false,
        }
	}

	$rootScope.FileUploadJSON = {
		DocumentName: '',
		DocumentBase64 :'',
		FileFormat: '',
		SelectFileFormat: '',
		SelectFileSize: ''
	}


	LoadActiveVariables($sessionStorage, $state, $rootScope);




	//#region Load Setting Values
	$scope.LoadDefaultSettingsValue = function () {
		debugger;

		$scope.LoadSettingInfoByName = function (settingName, returnValueDataType) {
			debugger;
			var settingValue = "";
			if ($sessionStorage.AllSettingMasterData != undefined) {
				var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === settingName; });
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
		}


		$rootScope.ngFileAllowextension = $scope.LoadSettingInfoByName('GratisFileAllowextension', '');
		if ($rootScope.ngFileAllowextension === "") {
			$rootScope.ngFileAllowextension = "";
		}

		$rootScope.ngFileAllowsize = $scope.LoadSettingInfoByName('GratisFileAllowsize', 'int');
		if ($rootScope.ngFileAllowsize  === "") {
			$rootScope.ngFileAllowsize = 0;
		}



		$rootScope.resData.res_GratisOrder_GratisNote = String.format($rootScope.resData.res_GratisOrder_GratisNote, $rootScope.ngFileAllowextension, $rootScope.ngFileAllowsize);

	}
	$scope.LoadDefaultSettingsValue();

	
	//$rootScope.ngFileAllowextension = 'xls,xlsx';
	//$rootScope.ngFileAllowsize = '3';


	


    LoadActiveVariables($sessionStorage, $state, $rootScope);


    $scope.errorRecord = [];
    $scope.successRecord = [];
    $scope.isShowMsg = false;
    $scope.isShowErrorRecord = false;
    $scope.PopupMessage = '';

    $scope.Close = function () {
        $scope.isShowMsg = false;
        $scope.isShowErrorRecord = false;
		$scope.isShowSucessRecord=false;
        $scope.PopupMessage = '';
    }

    $scope.UploadFile = function () {


		debugger;

		if ($rootScope.FileUploadJSON.DocumentName != "") {


			var requestData = {
				ServicesAction: 'BulkInserGratisOrder',
				File: $rootScope.FileUploadJSON.DocumentBase64,
				FileName: $rootScope.FileUploadJSON.DocumentName,
				UserName: $rootScope.UserName,
				UserId: $rootScope.UserId
			};
			var jsonobject = {};
			jsonobject.Json = requestData;


			$rootScope.Throbber.Visible = true;

			GrRequestService.ProcessRequest(jsonobject).then(function (response) {

				var readData = response.data;
				$rootScope.Throbber.Visible = false;
				if (readData.IsValidExcel) {

					if (!readData.IsError) {
						//$scope.isShowMsg = true;

						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GratisOrder_FileUploadSucessMessage), '', 3000);


					} else {
						$scope.isShowMsg = true;
						$scope.PopupMessage = 'Excel has Error record.';
						$scope.errorRecord = readData.ErrorRecord;
						$scope.successRecord = readData.SuccessRecord;
						$scope.isShowErrorRecord = true;

					}
				}
				else {
					if (readData.IsFileAlreadyPresent) {
						//$scope.isShowMsg = true;

						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GratisOrder_FileUploadErrorMessageFilePrevious), '', 3000);
					}
					else if (readData.IsInvalidFileFormat) {
						//$scope.isShowMsg = true;

						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GratisOrder_FileUploadErrorMessageFileFormat), '', 3000);
					} else {
						//$scope.isShowMsg = true;
						$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GratisOrder_FileUploadErrorMessageInvalidFile), '', 3000);
						//$scope.PopupMessage = 'Invalid Excel file.';
					}




				}
				angular.element("input[type='file']").val(null);
				$rootScope.FileUploadJSON = {
					DocumentName: '',
					DocumentBase64: '',
					FileFormat: '',
					SelectFileFormat: '',
					SelectFileSize: ''
				}


			});

		} else {

			$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GratisOrder_FileUploadErrorMessageChooseOrderFile), '', 3000);


		}


      

    };



	$scope.sorterFunc = function (order) {
		return parseInt(order.OrderGroupCode);
	};

});

