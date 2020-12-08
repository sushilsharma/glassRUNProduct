
app.service("OrderActivityService", function ($http)
{
    //Function to create new OrderActivity
    this.OrderActivitysave = function (OrderActivityData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/OrderActivity/SaveOrderActivityData",
            data: OrderActivityData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records OrderActivity
    this.OrderActivitygetAll = function (OrderActivityData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(OrderActivityData),
            url: baseUrl + "/api/OrderActivity/GetAllOrderActivityData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By OrderActivity ID
    this.OrderActivitygetById = function (OrderActivityData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(OrderActivityData),
            url: baseUrl + "/api/OrderActivity/GetByOrderActivityId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.OrderActivitydeleteById = function (OrderActivityData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/OrderActivity/delete/id",
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

