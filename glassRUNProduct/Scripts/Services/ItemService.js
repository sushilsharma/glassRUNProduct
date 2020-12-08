
app.service("ItemService", function ($http)
{
    //Function to create new Item
    this.Itemsave = function (ItemData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/Item/SaveItemData",
            data: ItemData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records Item
    this.ItemgetAll = function (ItemData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(ItemData),
            url: baseUrl + "/api/Item/GetAllItemData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By Item ID
    this.ItemgetById = function (ItemData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(ItemData),
            url: baseUrl + "/api/Item/GetByItemId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.ItemdeleteById = function (ItemData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/Item/delete/id",
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

