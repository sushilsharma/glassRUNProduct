angular.module("glassRUNProduct").service("ViewObjectVersionService", function ($http) {

    //Function to get all records Tax
    this.LoadObjectVersion = function (objectVersionData) {

        
        var request = $http(
        {
            method: 'POST',
            url: baseUrl + "/api/Object/GetObjectVersionData",
            params: objectVersionData
        }).
        success(function (data, status, headers, config) {
            
            return data;
        });

        return request;
    };






    this.DeleteObjectVersion = function (objectVersionData) {

        
        var request = $http(
        {
            method: 'POST',
            url: baseUrl + "/api/Object/DeleteObjectVersion",
            params: objectVersionData
        }).
        success(function (data, status, headers, config) {
            
            return data;
        });

        return request;
    };

});