
angular.module("glassRUNProduct").directive("ngFileSelect", function (fileReader, $timeout, $rootScope) {
    debugger;
    return {
        scope: {
            ngFileExtension: '=?ngFileExtension',
            ngFileBase64: '=?ngFileBase64',
            ngFileName: '=?ngFileName',
            ngFileAllowextension: '=?ngFileAllowextension',
            ngFileAllowsize: '=?ngFileAllowsize'
        },
        link: function ($scope, el) {
            function getFile(file) {

                debugger;

                $scope.ngModel = {};

                if ($scope.ngFileAllowextension !== undefined && $scope.ngFileAllowextension !== "" && $scope.ngFileAllowextension !== null) {
                    if (file.name !== undefined) {
                        var fileallowextensions = $scope.ngFileAllowextension.split(',');
                        var fileextension = file.name.split('.');
                        if (fileallowextensions.length > 0) {
                            if (!fileallowextensions.includes(fileextension[1].toLowerCase())) {
                                if ($rootScope.ClearUploadProfileImage !== undefined) {
                                    $rootScope.ClearUploadProfileImage();
                                }
                                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_FileUpload_FileExtension, $scope.ngFileAllowextension), '', 3000);

                                return;
                            }
                        }
                    }
                }


                if ($scope.ngFileAllowsize !== undefined && $scope.ngFileAllowsize !== "" && $scope.ngFileAllowsize !== null) {
                    if (file.size >= parseFloat($scope.ngFileAllowsize) * 1024 * 1024 * 1024) {
                        if ($rootScope.ClearUploadProfileImage !== undefined) {
                            $rootScope.ClearUploadProfileImage();
                        }

                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_FileUpload_Size, $scope.ngFileAllowsize), '', 3000);

                        return false;
                    }
                }



                $scope.ngFileName = file.name;
                $scope.ngFileExtension = file.type;

                fileReader.readAsDataUrl(file, $scope)
                    .then(function (result) {
                        $timeout(function () {


                            var base64 = result.split(',');


                            $scope.ngFileBase64 = base64[1];


                        });
                    });
            }

            el.bind("change", function (e) {

                var file = (e.srcElement || e.target).files[0];
                getFile(file);
            });
        }
    };
}).factory("fileReader", function ($q, $log) {
    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress", {
                total: event.total,
                loaded: event.loaded
            });
        };
    };

    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };


});
