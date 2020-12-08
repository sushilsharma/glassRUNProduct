angular.module("glassRUNProduct").controller('ViewOrderPraposedDateController', function ($scope, $rootScope, $filter, $location, $sessionStorage, $ionicModal, $state, focus, pluginsService, GrRequestService) {
    

    // 9 Load Praposed ETD By Delivery Location Code.
    $rootScope.GetProposedDeliveryDate = function (locationId) {
        
        var requestData =
            {
                ServicesAction: 'GetProposedDeliveryDate',
                DeliveryLocation: {
                    LocationId: locationId,
                    DeliveryLocationCode: $scope.DeliveryLocationCode,
                },
                Company: {
                    CompanyId: $scope.ActiveCompanyId,
                    CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                },
                RuleType: 1,
                CompanyId: $scope.ActiveCompanyId,
                CompanyMnemonic: $scope.ActiveCompanyMnemonic,
                Order: {
                    OrderTime: "",
                    OrderDate: ""
                }
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var responseStr = response.data.Json;
            $rootScope.Throbber.Visible = false;
            if (responseStr.ProposedDate === '' || responseStr.ProposedDate === undefined) {
                var numberOfDaysToAdd = $scope.LoadSettingInfoByName('ProposedDeliveryDate', 'int');
                
                if (numberOfDaysToAdd !== "") {
                    var someDate = new Date();
                    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                    var dd = someDate.getDate();
                    var mm = someDate.getMonth() + 1;
                    var y = someDate.getFullYear();
                    var someFormattedDate = dd + '/' + mm + '/' + y;

                    $rootScope.ProposedDate = someFormattedDate;
                    $rootScope.NoOfDays = numberOfDaysToAdd;

                }
                else {
                    $rootScope.ProposedDate = 'N/A'
                    $rootScope.NoOfDays = '0';
                }

            }
            else {
                $rootScope.ProposedDate = responseStr.ProposedDate;
                $rootScope.NoOfDays = responseStr.NoOfDays;
            }
            

            $scope.ReceivingLocationCapacityField.BySelectedDate = $rootScope.ProposedDate;

            var frozenpraposeddate = $filter('date')($rootScope.ProposedDate, 'dd/MM/yyyy');
            frozenpraposeddate = frozenpraposeddate.split('/');
            frozenpraposeddate = frozenpraposeddate[1] + "/" + frozenpraposeddate[0] + "/" + frozenpraposeddate[2];
            frozenpraposeddate = new Date(frozenpraposeddate);
            frozenpraposeddate.setDate(frozenpraposeddate.getDate() + 1);
            var dd = frozenpraposeddate.getDate();
            var mm = frozenpraposeddate.getMonth() + 1;
            var y = frozenpraposeddate.getFullYear();
            frozenpraposeddate = dd + '/' + mm + '/' + y;

            $scope.GetReceivingLocationBalanceCapacity(locationId, $rootScope.ProposedDate);


            var GetScheduleDateNumber = $scope.LoadSettingInfoByName('ScheduleDateNumber', 'float');
            if (GetScheduleDateNumber === "") {
                GetScheduleDateNumber = 6;
            }

            
            $scope.date = $filter('date')($rootScope.DateField.OrderDate, 'dd/MM/yyyy');


            var date = $scope.date;

            var proposedetd = date.split(' ');
            var etd = proposedetd[0].split('/');
            var etddate = etd[1] + "/" + etd[0] + "/" + etd[2];

            var enddate = new Date(etddate);
            enddate.setDate(enddate.getDate() + GetScheduleDateNumber);

            var dd = enddate.getDate();
            var mm = enddate.getMonth() + 1;
            var y = enddate.getFullYear();
            var SchedulingDate = dd + '/' + mm + '/' + y;

            $scope.GetScheduleDate(frozenpraposeddate, SchedulingDate);

            if ($rootScope.IsSelfCollect === true) {
                $rootScope.DateField.RequestDate = $filter('date')($rootScope.DateField.OrderDate, "dd/MM/yyyy");
            } else {
                $rootScope.DateField.RequestDate = $filter('date')($rootScope.ProposedDate, "dd/MM/yyyy");
            }
            $scope.ReceivingLocationCapacityField.BySelectedDate = $rootScope.DateField.RequestDate;
        });
    };

    // 11 Load Schedule Date By Proposed Date And Order Date.
    $scope.GetScheduleDate = function (startDate, endDate) {
        
        if ($rootScope.IsSelfCollect === true) {
            startDate = new Date();
            endDate = '';
        }
        $('.customdate-picker').each(function () {
            

            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    
                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                    }
                    $scope.$apply(function () {
                        $scope.ReceivingLocationCapacityField.BySelectedDate = dateText;

                        $scope.GetReceivingLocationBalanceCapacity($scope.DeliveryLocationId, dateText);
                    });

                },
                minDate: startDate,
                maxDate: endDate,
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,
            });
        });
    }

});