angular.module("glassRUNProduct").directive('logClickEvent', function (Logger) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            
            element.bind('click', function (event) {
                
                Logger.logEvent(event);
            });
        }
    }
})

angular.module("glassRUNProduct").factory('Logger', function (GrRequestService, $rootScope) {

    return {
        logEvent: function (event) {

            
            if (event.toElement.attributes[1] !== undefined) {
                if (event.toElement.attributes[1].name === "ng-click") {
                    $rootScope.ObjectIdForLogging = event.toElement.attributes[1].nodeValue.split('(')[1].split(',')[0];
                    if ($rootScope.ObjectIdForLogging === ")") {
                        $rootScope.ObjectIdForLogging = "0";
                    }
                }
            }
            if (event.toElement.innerHTML != "") {
                var requestData =
                    {
                        UserId: $rootScope.UserId,
                        ObjectId: $rootScope.ObjectIdForLogging,
                        ObjectType: event.view.location.href.split('#')[1].split('/')[1],
                        ServicesAction: 'CreateLog',
                        LogDescription: 'Click on ' + event.toElement.innerHTML,
                        LogDate: GetCurrentdate(),
                        Source: 'Portal',
                    };


                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };


                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


                    var data = response.data;

                    $rootScope.ObjectIdForLogging = '0';

                });
                
                var string = "";

            }
            else {
                $rootScope.ObjectIdForLogging = '0';

            }
        }
    };
});

function GetCurrentdate() {
    var x = new Date();
    var y = x.getFullYear();
    var m = addZero(x.getMonth() + 1);
    var d = addZero(x.getDate());
    var h = addZero(x.getHours());
    var mi = addZero(x.getMinutes());
    var s = addZero(x.getSeconds());
    var ms = addZero(x.getMilliseconds());

    //return y + "/" + m + "/" + d + " " + h + ":" + mi + ":" + s + ":" + ms;
    return y + "/" + m + "/" + d + " " + h + ":" + mi + ":" + s ;
}


function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
