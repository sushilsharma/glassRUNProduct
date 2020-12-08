angular.module("glassRUNProduct").controller('ResetPasswordController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, GrRequestService) {
    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.ValidationErrorForResetPassword = '';
    ResetPassword = {
        UserName: ''
    }

    var requestData =
        {
            ServicesAction: 'LoadUserName'

        };

    // var stringfyjson = JSON.stringify(requestData);
    var jsonobject = {};
    jsonobject.Json = requestData;
    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        
        // var resoponsedata = JSON.parse(JSON.parse(response.data));
        var resoponsedata = response.data.Json.ProfileList;
        $scope.bindAllUserNameList = resoponsedata;
        //$scope.GetCreditLimitOfCustomer();
    });


    $scope.inputChangeHandler = function (input) {
        
        if (input.length > 0) {
            $scope.showItembox = true;
        } else {
            $scope.showItembox = false;
        }
    }
    $scope.predicates = {
        InputItem: '',
    };


    $scope.SelectedProduct = function (e) {
        
        var profileId = e.ProfileId;
        $scope.UserProfileId = profileId;
        $scope.predicates.InputItem = e.UserName;
        $scope.showItembox = false;
    }




    $scope.ResetPassword = function () {
        
        if ($scope.UserProfileId != undefined) {

            var requestDataforItemAllocation =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: 0,
                    ObjectType: "ResetPassword",
                    ServicesAction: 'CreateLogForResetPassword',
                    LogDescription: 'UserId : ' + parseInt($rootScope.UserId) + ' has changed the password of user ' + parseInt($scope.UserProfileId)+'',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
            var consolidateApiParamaterItemAllocation =
                {
                    Json: requestDataforItemAllocation,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterItemAllocation).then(function (responseLogItemAllocationValidation) {

            });








            $scope.ValidationErrorForResetPassword = '';
            var requestData =
                {
                    ServicesAction: 'ResetPassword',
                    ProfileId: $scope.UserProfileId
                };



            var consolidateApiParamater =
                {
                    Json: requestData,
                };
            
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                

                // $rootScope.ValidationErrorAlert('Password has been reset. Your new password is ' + response.data.Json.UserPassword + '', '', 3000);

                //$scope.ValidationErrorForResetPassword = 'Password has been reset. Your new password is ' + response.data.Json.UserPassword + '';
                $scope.ValidationErrorForResetPassword = String.format($rootScope.resData.res_ResetPasswordUI_PasswordResetSuccess, response.data.Json.UserPassword);

                $scope.Clear();

            });
        }
        else {
            //$rootScope.ValidationErrorAlert('Please select user', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ResetPasswordUI_SelectUser), 'error', 3000);
        }

    }


    $scope.Clear = function () {
        $scope.predicates.InputItem = "";


    }


}).filter('multipleTags1', function ($filter, $rootScope) {
    return function multipleTags(items, predicates) {


        predicates = predicates.split(' ')

        angular.forEach(predicates, function (predicate) {
            items = $filter('filter')(items, { UserName: predicate.trim() });
        })

        if (items != undefined) {
            if (items.length === 0) {
                $rootScope.foundResult = true;
            }
            else {
                $rootScope.foundResult = false;
            }
        } else {
            $rootScope.foundResult = false;
        }

        return items;
    }





});
