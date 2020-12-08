
app.service("CompanyService", function ($http)
{
    //Function to create new Company
    this.Companysave = function (CompanyData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/Company/SaveCompanyData",
            data: CompanyData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records Company
    this.CompanygetAll = function (CompanyData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(CompanyData),
            url: baseUrl + "/api/Company/GetAllCompanyData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By Company ID
    this.CompanygetById = function (CompanyData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(CompanyData),
            url: baseUrl + "/api/Company/GetByCompanyId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.CompanydeleteById = function (CompanyData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/Company/delete/id",
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

