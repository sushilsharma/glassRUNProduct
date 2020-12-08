angular.module("glassRUNProduct").controller('UploadEnquiryController', function ($scope, $location, $ionicModal, pluginsService) {
    



    var tmpList = [];

    for (var i = 1; i <= 6; i++) {
        tmpList.push({
            text: 'Item ' + i,
            value: i
        });
    }

    $scope.list = tmpList;


    $scope.sortingLog = [];

    $scope.sortableOptions = {
        activate: function () {
            console.log("activate");
        },
        beforeStop: function () {
            console.log("beforeStop");
        },
        change: function () {
            console.log("change");
        },
        create: function () {
            console.log("create");
        },
        deactivate: function () {
            console.log("deactivate");
        },
        out: function () {
            console.log("out");
        },
        over: function () {
            console.log("over");
        },
        receive: function () {
            console.log("receive");
        },
        remove: function () {
            console.log("remove");
        },
        sort: function () {
            console.log("sort");
        },
        start: function () {
            console.log("start");
        },
        update: function (e, ui) {
            console.log("update");

            var logEntry = tmpList.map(function (i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Update: ' + logEntry);
        },
        stop: function (e, ui) {
            console.log("stop");

            // this callback has the changed model
            var logEntry = tmpList.map(function (i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Stop: ' + logEntry);
        }
    };





    $scope.FeedbackVariable = {
        OverAll: true,
        Specific: false
    }


    setTimeout(function () {
        


        pluginsService.init();
    }, 200);

    $scope.OrderData = [];
    var orders = {
        OrderGUID: 1,
        TruckName: "Truck" + 1,
        DeliveryLocation: '',
        TruckSize: '',
        ProposedETDStr: '',
        SpecialRequest: '',
        TotalWeight: 0,
        TruckCapacity: 0,
        TruckPallets: 0,
        TotalProductPallets: 0,
        OrderProductList: []
    }
    $scope.OrderData.push(orders);

    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.modalpopup = modal;
    });

    $scope.OpenModalpopup = function () {
        

        $scope.modalpopup.show();
    }

    $scope.CloseModalpopup = function () {
        $scope.modalpopup.hide();
    }



    $ionicModal.fromTemplateUrl('templates/reasoncodepopup.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.reasoncodepopup = modal;
    });

    $scope.OpenReasoncodepopup = function () {
        

        //$scope.reasoncodepopup.show();
    }

    $scope.ClosReasoncodepopup = function () {
        //$scope.reasoncodepopup.hide();
    }


    $ionicModal.fromTemplateUrl('templates/RPMQuantity.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.RPMQuantitypopup = modal;
    });

    $scope.OpenRPMQuantitypopup = function () {
        

        $scope.RPMQuantitypopup.show();
    }

    $scope.CloseRPMQuantitypopup = function () {
        
        $scope.RPMQuantitypopup.hide();
    }




    $ionicModal.fromTemplateUrl('templates/AddFeedback.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.AddFeedbackpopup = modal;
    });

    $scope.OpenAddFeedbackpopup = function () {
        

        $scope.AddFeedbackpopup.show();
    }

    $scope.CloseAddFeedbackpopup = function () {
        
        $scope.AddFeedbackpopup.hide();
    }

    $scope.setoverall = function () {
        $scope.FeedbackVariable.OverAll = true;
        $scope.FeedbackVariable.Specific = false;
    }

    $scope.setspecific = function () {
        $scope.FeedbackVariable.Specific = true;
        $scope.FeedbackVariable.OverAll = false;
    }

    $scope.shiptodata = "";
    $scope.ReceivingLocationCapacity = '-';
    $scope.setreceivingcapacity = function () {
        
        $scope.ReceivingLocationCapacity = 60;
    }
});