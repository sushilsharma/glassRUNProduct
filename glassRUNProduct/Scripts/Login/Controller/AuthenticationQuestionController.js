angular.module("CampusProject").controller('AuthenticationQuestionController', function ($scope, $http, $location, $rootScope, adminService) {
    $scope.authentication = {
        init: function () {
            
            var data = $location.search().refId;
            if (data === "" || data === undefined) {
                $location.path("/authenticateUsers");
            } else {
                var jsonobject = {};
                data = data.replace('authenticationQuestion/33A8B698-D487-4F00-AF8D-B69C366DB9A6/Id/', '');
                jsonobject.userProfileId = data;
                jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';
                adminService.GetSecurityQuestionsByUserProfileId(jsonobject).then(function (response) {
                    if (response.data.length > 0) {
                        var myData = response.data;
                        $scope.authentication = myData;
                    }
                });
            }
        }
    };

    $scope.checkAnswers = function () {
        var authentication = [];
        
        for (var i = 0; i < $scope.authentication.length; i++) {
            var authenticationvalue = {};
            authenticationvalue.SecurityQuestionId = $scope.authentication[i].SecurityQuestionId;

            authenticationvalue.Answer = document.getElementById("txt" + $scope.authentication[i].SecurityQuestionId).value;

            authentication.push(authenticationvalue);

        }

        var data = $location.search().refId;
        var linkClick = $location.search().authenticationType;
        if (data == "" || data === undefined) {
            //$location.path("/authenticateUsers");
        } else {
            var jsonobject = {};
            if (linkClick == undefined) {
                linkClick = "";
            }
            data = data.replace('authenticationQuestion/33A8B698-D487-4F00-AF8D-B69C366DB9A6/Id/', '');
            jsonobject.userProfileId = data; // 4/B69C366DB9A6
            jsonobject.isLinkClicked = linkClick; // 4/B69C366DB9A6
            jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';
            jsonobject.securityQuestionDto = authentication;
            adminService.CheckQuestionsAnswer(jsonobject).then(function (response) {
                if (response.data === 1) {
                    if (linkClick === "verifyIdentity") {
                        $location.path("/passwordRecovery").search('Id', 'passwordRecovery/33A8B698-D487-4F00-AF8D-B69C366DB9A6/Id/' + data).search('recoveryOprtionsId', 'passwordRecovery/33A8B698-D487-4F00-AF8D-B69C366DB9A6/Id/' + data).search('MyuserId', 'passwordRecovery/33A8B698-D487-4F00-AF8D-B69C366DB9A6/Id/' + data).search('resetPassword', 'passwordRecovery/33A8B698-D487-4F00-AF8D-B69C366DB9A6/Id/' + data);
                    }

                    if (linkClick !== "verifyIdentity") {
                        //alert("Please check your mail.");
                        $rootScope.toggleModelAlert('Please check your mail.', '');
                    }
                }
            });

        }

    };
});