angular.module("glassRUNProduct").service("ViewRoleAccessService", function ($http) {
    

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