angular.module("glassRUNProduct").controller('ResourcesKeyController', function ($http, $scope, $rootScope, $sessionStorage, $state, $location, $ionicModal, GrRequestService) {
    

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = false;
    } else {
        $rootScope.Throbber = {
            Visible: false,
        }
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);


    $scope.fileupload = {
        File: ''
    }

    $scope.errorRecord = [];
    $scope.successRecord = [];
    $scope.isShowMsg = false;
    $scope.isShowErrorRecord = false;
    $scope.PopupMessage = '';

    $scope.Close = function () {
        $scope.isShowMsg = false;
        $scope.isShowErrorRecord = false;
        $scope.PopupMessage = '';
    }

    $scope.UploadFile = function () {
        
        var requestData = {
            ServicesAction: 'UploadResourcesKey',
            File: $scope.fileupload.File.dataBase64,
            FileName: $scope.fileupload.File.dataFile.name,
            UserName: $rootScope.UserName
        };
        var jsonobject = {};
        jsonobject.Json = requestData;
        

        $rootScope.Throbber.Visible = true;

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var readData = response.data;
            $rootScope.Throbber.Visible = false;
            if (readData.IsValidExcel) {

                if (!readData.IsError) {
                    $scope.isShowMsg = true;
                    $scope.PopupMessage = 'Uploaded succsessfully.';
                    

                } else {
                    $scope.isShowMsg = true;
                    $scope.PopupMessage = 'Excel has Error record.';
                    $scope.errorRecord = readData.ErrorRecord;
                    $scope.successRecord = readData.SuccessRecord;
                    $scope.isShowErrorRecord = true;
                }
            }
            else {
                $scope.isShowMsg = true;
                $scope.PopupMessage = 'Invalid Excel file.';

            }
            angular.element("input[type='file']").val(null);
            $scope.fileupload = {
                File: ''
            }
            

        });

    };





    $scope.DownloadResourcesKey = function (CultureId) {


        


        var requestData =
            {
                ServicesAction: 'DownloadResourcesKey',
                CultureId: CultureId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
   
            GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
                
                var byteCharacters1 = response.data;
                if (response.data !== undefined) {
                    var byteCharacters = response.data;
                    var blob = new Blob([byteCharacters], {
                        type: "application/Pdf"
                    });
                    
                    if (blob.size > 0) {
                        var filName = "DownloadResourcesKey" + ".xlsx";
                        saveAs(blob, filName);
                    } else {
                        $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                    }
                }
                else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                }
            });
    }





	 $scope.ClearResourceCache = function () {
debugger;
        var requestData =
            {
                ServicesAction: 'RemoveResourceCache'
                
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
   
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {         
				debugger;       
                $rootScope.ValidationErrorAlert('Resource Cache has been removed.', '', 3000);
            });
    }




		$scope.ClearGridColumnConfigurationCache = function () {
debugger;
        var requestData =
            {
                ServicesAction: 'RemoveGridColumnConfiguration'
                
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
   
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {         
				debugger;       
                $rootScope.ValidationErrorAlert('Grid Column Configuration Cache has been removed.', '', 3000);
            });
    }





$scope.ClearServiceConfigurationCache = function () {
debugger;
        var requestData =
            {
                ServicesAction: 'RemoveServiceConfiguration'
                
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
   
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {         
				debugger;       
                $rootScope.ValidationErrorAlert('Service Configuration Cache has been removed.', '', 3000);
            });
    }







});

