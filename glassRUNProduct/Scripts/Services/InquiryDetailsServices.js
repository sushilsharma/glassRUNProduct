angular.module("glassRUNProduct").service("InquiryDetailsService", function ($http) {
    

    var localbaseUrl = "http://localhost:21656";

    
    this.LoadInquiryDetails = function (json) {

        
        var request = $http(
        {
            method: 'POST',
            url: localbaseUrl + "/api/grRequest/ProcessRequest",
            params: json
        }).
        success(function (data, status, headers, config) {
            
            return data;
        });

        return request;
    };

  
});