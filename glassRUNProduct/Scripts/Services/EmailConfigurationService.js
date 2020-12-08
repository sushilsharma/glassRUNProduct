
app.service("EmailConfigurationService", function ($http)
{
    //Function to create new EmailConfiguration
    this.EmailConfigurationsave = function (EmailConfigurationData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/EmailConfiguration/SaveEmailConfigurationData",
            data: EmailConfigurationData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records EmailConfiguration
    this.EmailConfigurationgetAll = function (EmailConfigurationData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(EmailConfigurationData),
            url: baseUrl + "/api/EmailConfiguration/GetAllEmailConfigurationData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By EmailConfiguration ID
    this.EmailConfigurationgetById = function (EmailConfigurationData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(EmailConfigurationData),
            url: baseUrl + "/api/EmailConfiguration/GetByEmailConfigurationId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.EmailConfigurationdeleteById = function (EmailConfigurationData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/EmailConfiguration/delete/id",
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

