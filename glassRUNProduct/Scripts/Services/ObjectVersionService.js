
angular.module("glassRUNProduct").service("ObjectVersionService", function ($http) {

    this.GetAllObject = function () {
        
        var request = $http({
            method: 'POST',
            dataType: 'json',
            data: '',
            url: baseUrl + '/api/Object/GetAllObjectList',
            contentType: "application/json; charset=utf-8"

        }).success(function (data, status, headers, config) {
            

            return data;
        });
        return request;
    };



    this.GetAllObjectPropertyByObjectId = function (objectPropertyData) {
        
        var request = $http(
        {
            method: 'POST',

            url: baseUrl + "/api/Object/GetAllObjectPropertiesListByObjectId",

            params: objectPropertyData
        }).
        success(function (data, status, headers, config) {
            return data;
        });

        return request;
    };




    this.SaveObjectVersion = function (form) {
        
        var request = $http({
            method: 'POST',
            url: baseUrl + "/api/Object/SaveObject",
            data: form

        }).success(function (data, status, headers, config) {
            
            return data;
        }).error(function (data, status, headers, config) {
            alert('something went wrong');
            console.log(status);
        });
        return request;
    };



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



    this.GetObjectVersionDetailsById = function (objectversionData) {
        var request = $http(
        {
            method: 'POST',
            params: objectversionData,
            url: baseUrl + "/api/Object/GetObjectVersionDetailsById"
        }).
        success(function (data, status, headers, config) {
            return data;
        });
        return request;
    };



    this.DemoObjectVersion = function (form) {
        
        var request = $http({
            method: 'POST',
            url: baseUrl + "/api/Object/DemoObjectVersion",
            data: form

        }).success(function (data, status, headers, config) {
            
            return data;
        }).error(function (data, status, headers, config) {
            alert('something went wrong');
            console.log(status);
        });
        return request;
    };





});

