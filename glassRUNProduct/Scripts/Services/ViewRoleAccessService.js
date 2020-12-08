app.service("ViewRoleAccessService", function ($http) {
    
    //Function to get all records of RoleAccess
    this.RoleAccessAll = function (RoleAccessData) {
        
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

});