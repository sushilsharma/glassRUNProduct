angular.module("glassRUNProduct").service("TransportOpratorService", function ($http) {
    

    this.LoadAllPageControlByPageName = function (parameters) {
        
        var request = $http({
            method: 'POST',
            url: baseUrl + "/api/ObjectProperties/GetPageControlsByPageName",
            params: parameters
        }).success(function (data, status, headers, config) {
            
            return data;
        });
        return request;
    };

});