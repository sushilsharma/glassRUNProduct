
app.service("NotificationsService", function ($http)
{
    //Function to create new Notifications
    this.Notificationssave = function (NotificationsData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/Notifications/SaveNotificationsData",
            data: NotificationsData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records Notifications
    this.NotificationsgetAll = function (NotificationsData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(NotificationsData),
            url: baseUrl + "/api/Notifications/GetAllNotificationsData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By Notifications ID
    this.NotificationsgetById = function (NotificationsData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(NotificationsData),
            url: baseUrl + "/api/Notifications/GetByNotificationsId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.NotificationsdeleteById = function (NotificationsData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/Notifications/delete/id",
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

