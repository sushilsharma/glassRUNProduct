
app.service("TransporterVehicleService", function ($http)
{
    //Function to create new TransporterVehicle
    this.TransporterVehiclesave = function (TransporterVehicleData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/TransporterVehicle/SaveTransporterVehicleData",
            data: TransporterVehicleData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records TransporterVehicle
    this.TransporterVehiclegetAll = function (TransporterVehicleData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(TransporterVehicleData),
            url: baseUrl + "/api/TransporterVehicle/GetAllTransporterVehicleData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By TransporterVehicle ID
    this.TransporterVehiclegetById = function (TransporterVehicleData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(TransporterVehicleData),
            url: baseUrl + "/api/TransporterVehicle/GetByTransporterVehicleId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.TransporterVehicledeleteById = function (TransporterVehicleData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/TransporterVehicle/delete/id",
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

