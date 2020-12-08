angular.module("glassRUNProduct").service("AddPolicyService", function ($http) {
    


    this.SaveRoleAccess = function (form) {
        
        var request = $http({
            url: baseUrl + "/api/RoleMaster/SaveRoleMaster",
            data: form,
            method: "post"
        }).success(function (data, status, headers, config) {
            
            return data;
        }).error(function (data, status, headers, config) {
            alert('something went wrong');
            console.log(status);
        });
        return request;
    };

    this.LoadAllPages = function () {
        
        var request = $http({
            url: baseUrl + "/api/Pages/GetAllPageList",
            params: '',
            method: "post"
        }).success(function (data, status, headers, config) {
            
            return data;
        }).error(function (data, status, headers, config) {
            alert('something went wrong');
            console.log(status);
        });
        return request;
    };


    this.LoadParentRoleDetails = function (RoleAccessData) {

        
        var request = $http(
        {

            url: baseUrl + "/api/ViewRoleAccess/LoadAllParentRoles",
            params: '',
            method: "post"
        }).
        success(function (data, status, headers, config) {
            
            return data;
        });

        return request;
    };

    this.GetProfileByRoleId = function (RoleAccessData) {

        
        var request = $http(
        {
            method: 'POST',
            url: baseUrl + "/api/Profile/GetProfileByRoleId",
            params: RoleAccessData,
            
        }).
        success(function (data, status, headers, config) {
            
            return data;
        });

        return request;
    };


   
    this.GetRoleDetailsbyRoleId = function (RoleAccessData) {

        
        var request = $http(
        {
            method: 'POST',
            url: baseUrl + "/api/RoleMaster/GetRoleMasterById",
            params: RoleAccessData
        }).
        success(function (data, status, headers, config) {
            
            return data;
        });

        return request;
    };

    this.LoadAllPageControlByPageId = function (pageId) {
        
        var request = $http({
            method: 'POST',
            url: baseUrl + "/api/ObjectProperties/GetPageControlsByPageId",
            params: pageId
        }).success(function (data, status, headers, config) {
            
            return data;
        });
        return request;
    };



    //Function to get all records Tax
    this.LoadRoleDetails = function (RoleAccessData) {

        
        var request = $http(
        {
            method: 'POST',
            url: baseUrl + "/api/ViewRoleAccess/GetRoleAccessData",
            params: RoleAccessData
        }).
        success(function (data, status, headers, config) {
            
            return data;
        });

        return request;
    };





    this.DeleteRoleMasterById = function (RoleAccessData) {

        
        var request = $http(
        {
            method: 'POST',
            url: baseUrl + "/api/RoleMaster/DeleteRoleMasterById",
            params: RoleAccessData
        }).
        success(function (data, status, headers, config) {
            
            return data;
        });

        return request;
    };

});


