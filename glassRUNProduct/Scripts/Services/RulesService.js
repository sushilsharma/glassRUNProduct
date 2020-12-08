
app.service("RulesService", function ($http)
{
    //Function to create new Rules
    this.Rulessave = function (RulesData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/Rules/SaveRulesData",
            data: RulesData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records Rules
    this.RulesgetAll = function (RulesData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(RulesData),
            url: baseUrl + "/api/Rules/GetAllRulesData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By Rules ID
    this.RulesgetById = function (RulesData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(RulesData),
            url: baseUrl + "/api/Rules/GetByRulesId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.RulesdeleteById = function (RulesData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/Rules/delete/id",
            data: JSON.stringify(jsonobject),
            method: "POST"
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
});

