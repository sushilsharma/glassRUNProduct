
app.service("EmailEventService", function ($http)
{
    //Function to create new EmailEvent
    this.EmailEventsave = function (EmailEventData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/EmailEvent/SaveEmailEventData",
            data: EmailEventData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records EmailEvent
    this.EmailEventgetAll = function (EmailEventData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(EmailEventData),
            url: baseUrl + "/api/EmailEvent/GetAllEmailEventData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By EmailEvent ID
    this.EmailEventgetById = function (EmailEventData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(EmailEventData),
            url: baseUrl + "/api/EmailEvent/GetByEmailEventId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.EmailEventdeleteById = function (EmailEventData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/EmailEvent/delete/id",
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

