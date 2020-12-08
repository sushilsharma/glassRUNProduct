
app.service("CultureMasterService", function ($http)
{
    //Function to create new CultureMaster
    this.CultureMastersave = function (CultureMasterData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/CultureMaster/SaveCultureMasterData",
            data: CultureMasterData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records CultureMaster
    this.CultureMastergetAll = function (CultureMasterData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(CultureMasterData),
            url: baseUrl + "/api/CultureMaster/GetAllCultureMasterData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By CultureMaster ID
    this.CultureMastergetById = function (CultureMasterData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(CultureMasterData),
            url: baseUrl + "/api/CultureMaster/GetByCultureMasterId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.CultureMasterdeleteById = function (CultureMasterData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/CultureMaster/delete/id",
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

