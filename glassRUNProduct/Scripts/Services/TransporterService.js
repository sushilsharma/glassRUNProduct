
app.service("TransporterService", function ($http)
{
    //Function to create new Transporter
    this.Transportersave = function (TransporterData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/Transporter/SaveTransporterData",
            data: TransporterData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records Transporter
    this.TransportergetAll = function (TransporterData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(TransporterData),
            url: baseUrl + "/api/Transporter/GetAllTransporterData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By Transporter ID
    this.TransportergetById = function (TransporterData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(TransporterData),
            url: baseUrl + "/api/Transporter/GetByTransporterId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.TransporterdeleteById = function (TransporterData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/Transporter/delete/id",
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

