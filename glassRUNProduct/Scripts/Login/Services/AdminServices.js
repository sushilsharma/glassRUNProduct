angular.module("glassRUNProduct").service("adminService", function ($http) {
    

    this.ValidateLoginService = function (form) {
        
        var request = $http({
            url: baseUrl + "/api/LoginService/ValidateLogin",
            params: form,
            method: "post"
        }).success(function (data, status, headers, config) {
            
            return data;
        }).error(function (data, status, headers, config) {
            alert('something went wrong');
            console.log(status);
        });
        return request;
    };





    this.GetEmailByUserName = function (form) {
        
        var request = $http({
            url: baseUrl + "/api/LoginService/GetDataFromUserDetailProfile",
            params: form,
            method: "POST"
        }).success(function (data, status, headers, config) {
            
            return data;
        }).error(function (data, status, headers, config) {
            alert('something went wrong');
            console.log(status);
        });

        return request;
    };


    this.CheckPasswordHistory = function (form) {
        
        var request = $http({
            url: baseUrl + "/api/LoginService/CheckPasswordHistory",
            params: form,
            method: "post"
        }).success(function (data, status, headers, config) {
            
            return data;
        }).error(function (data, status, headers, config) {
            alert('something went wrong');
            console.log(status);
        });
        return request;
    };


    

    this.ResetPassword = function (form) {
        var request = $http({
            url: baseUrl + "/api/LoginService/ResetPassword",
            params: form,
            method: "POST"
        }).success(function (data, status, headers, config) {
            
            return data;
        }).error(function (data, status, headers, config) {
            alert('something went wrong');
            console.log(status);
        });

        return request;
    }



    this.ResetPasswordBySelf = function (parameter) {
        var request = $http({

            url: baseUrl + "/api/LoginService/ResetPasswordBySelf",
            params: parameter,
            method: "post"
        }).success(function (data, status, headers, config) {
            
            return data;
        }).error(function (data, status, headers, config) {
            console.log(status);
        });

        return request;
    };



    this.InitializationBeforeLogin = function () {
        var request = $http({

            url: baseUrl + "/api/LoginService/InitializationBeforeLogin",
            method: "post"
        }).success(function (data, status, headers, config) {
            
            return data;
        }).error(function (data, status, headers, config) {
            console.log(status);
        });

        return request;
    };

    this.ValidateLogInAsService = function (form) {
        
        var request = $http({
            url: baseUrl + "/api/LoginService/ValidateLoginforloginas",
            params: form,
            method: "post"
        }).success(function (data, status, headers, config) {
            
            return data;
        }).error(function (data, status, headers, config) {
            alert('something went wrong');
            console.log(status);
        });
        return request;
    };

});


