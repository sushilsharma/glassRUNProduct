angular.module("glassRUNProduct").controller('ViewCreditLimitAndEmptiesForOrderController', function ($scope, $rootScope, $filter, $location, $sessionStorage, $ionicModal, $state, focus, pluginsService, GrRequestService) {
    


    // 4 Load Credit Limit And Available Limit Of Customer.
    $scope.LoadCreditAndAvailableLimit = function () {
        

        if ($rootScope.OrderDetailId === undefined) {
            $rootScope.OrderDetailId = 0;
        }

        

        if ($rootScope.OrderDetailId === 0) {

            console.log('credit limit function');
            var requestData =
                {
                    ServicesAction: 'GetCreditLimitFromThirthParty',
                    CompanyId: $scope.ActiveCompanyId,
                    CompanyMnemonic: $scope.ActiveCompanyMnemonic
                };
            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                

                if (response.data !== null) {
                    if (response.data.Json != undefined || response.data.Json != null) {
                        var resoponsedata = response.data.Json;
                        $rootScope.CreditLimit = resoponsedata.CreditLimit;
                        $rootScope.AvailableCreditLimit = resoponsedata.AvailableCreditLimit;
                        $rootScope.EmptiesLimit = 0;
                        $rootScope.ActualEmpties = 0;
                    } else {
                        $rootScope.AvailableCreditLimit = 0;
                    }
                } else {
                    $rootScope.AvailableCreditLimit = 0;
                }

                requestData =
                    {
                        ServicesAction: 'LoadAvailableCreditLimitOfCustomer',
                        CompanyId: $scope.ActiveCompanyId,
                        EnquiryId: 0
                    };


                jsonobject = {};
                jsonobject.Json = requestData;
                GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    

                    console.log('credit limit function final response');

                    $rootScope.SalesOrderNumber = 0;

                    var resoponsedata = response.data.Json;

                    $rootScope.EmptiesLimit = resoponsedata.EmptiesLimit;
                    $rootScope.ActualEmpties = resoponsedata.ActualEmpties;



                    // Save Item Layer Validation Log.
                    var requestDataforItemLayer =
                        {
                            UserId: $rootScope.UserId,
                            ObjectId: $scope.ActiveCompanyId,
                            ObjectType: "Credit Limit Of Customer in Enquiry Page  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                            ServicesAction: 'CreateLog',
                            LogDescription: 'Load Available Credit Limit ' + Number($rootScope.AvailableCreditLimit) + ' UsedInEnquiryLimit ' + Number(resoponsedata.TotalEnquiryCreated) + ' and depositusedinenquiry ' + Number(resoponsedata.EnquiryTotalDepositAmount) + ' ',
                            LogDate: GetCurrentdate(),
                            Source: 'Portal',
                        };
                    var consolidateApiParamaterItemLayer =
                        {
                            Json: requestDataforItemLayer,
                        };

                    GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

                    });


                    $rootScope.AvailableCreditLimit = Number($rootScope.AvailableCreditLimit) - Number(resoponsedata.TotalEnquiryCreated);
                    $rootScope.AvailableCreditLimit = Number($rootScope.AvailableCreditLimit) - Number(resoponsedata.EnquiryTotalDepositAmount);

                    if (Number($rootScope.ActualEmpties) > 0) {

                        var emptiesNum = $rootScope.ActualEmpties.toString().replace("-", "");
                        var emptiesValue = (Number($rootScope.ActualEmpties) * $scope.EmptiesAmount).toString().replace("-", "");

                        $scope.EmptiesLimitValidationColorCode = false;

                        $scope.EmptiesLimitMessage = String.format($rootScope.resData.res_CreateInquiryPage_EmptiesOverdue, emptiesNum, emptiesValue);
                        //$scope.EmptiesLimitMessage = 'You have {0} empties overdue for returns. Please arrange to return the empties or deposit ( ₫ {1} ) to ensure your order gets processed.';

                    }
                    else {

                        $scope.EmptiesLimitMessage = String.format($rootScope.resData.res_CreateInquiryPage_EmptiesLimit, $rootScope.ActualEmpties);
                        //$scope.EmptiesLimitMessage = 'You can order for {0} more crate/keg before you exhaust your empties limit.';
                        $scope.EmptiesLimitValidationColorCode = true;
                    }

                });

            });
        }
        else {
            $rootScope.OrderDetailId = 0;
        }

    }
    $scope.LoadCreditAndAvailableLimit();

    $rootScope.LoadEmptiesMessage = function (message, param1, param2) {
        //

        return String.format(message, param1, param2);
    }

});