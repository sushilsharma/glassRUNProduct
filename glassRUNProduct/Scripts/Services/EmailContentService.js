
app.service("EmailContentService", function ($http)
{
    //Function to create new EmailContent
    this.EmailContentsave = function (EmailContentData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/EmailContent/SaveEmailContentData",
            data: EmailContentData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records EmailContent
    this.EmailContentgetAll = function (EmailContentData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(EmailContentData),
            url: baseUrl + "/api/EmailContent/GetAllEmailContentData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By EmailContent ID
    this.EmailContentgetById = function (EmailContentData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(EmailContentData),
            url: baseUrl + "/api/EmailContent/GetByEmailContentId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.EmailContentdeleteById = function (EmailContentData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/EmailContent/delete/id",
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

