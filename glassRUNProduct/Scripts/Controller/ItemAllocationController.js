angular.module("glassRUNProduct").controller('ItemAllocationController', function ($http, $scope, $rootScope, $sessionStorage, $state, $location, $ionicModal, GrRequestService) {
    
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
        

        
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        }

        if ($scope.fileupload.File === '') {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert('Please select valid file.', 'error', 3000);
            return false;
        }

        var requestData = {
            ServicesAction: 'BulkInserItemAllocation',
            File: $scope.fileupload.File.dataBase64,
            FileName: $scope.fileupload.File.dataFile.name,
        };
        var jsonobject = {};
        jsonobject.Json = requestData;
        
        $scope.loading = true;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var readData = response.data;
            $rootScope.Throbber.Visible = false;
            if (readData.IsValidExcel) {

                if (!readData.IsError) {
                    $scope.isShowMsg = true;
                    $scope.PopupMessage = 'Uploaded succsessfully.';
                    $scope.successRecord = readData.SuccessRecord;
                    $scope.isShowErrorRecord = false;
                    $scope.isShowSucessRecord = true;
                } else {
                    $scope.isShowMsg = true;
                    $scope.PopupMessage = 'Excel has Error record.';
                    $scope.errorRecord = readData.ErrorRecord;
                    $scope.successRecord = readData.SuccessRecord;
                    $scope.isShowErrorRecord = true;
                    $scope.isShowSucessRecord = true;
                }
            }
            else {
                if (readData.IsFileAlreadyPresent) {
                    $scope.isShowMsg = true;
                    $scope.PopupMessage = 'This file was uploaded previously. Please upload new file.';
                }
                else {
                    $scope.isShowMsg = true;
                    $scope.PopupMessage = 'Invalid Excel file.';
                }

            }
            angular.element("input[type='file']").val(null);
            $scope.fileupload = {
                File: ''
            }
            $scope.loading = false;

        });

    };

});

