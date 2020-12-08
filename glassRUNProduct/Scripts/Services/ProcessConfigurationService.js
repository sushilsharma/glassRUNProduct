
app.service("ProcessConfigurationService", function ($http)
{
    var localbaseUrl = "http://localhost:21656";
    //Function to create new ProcessConfiguration
    this.ProcessConfigurationsave = function (ProcessConfigurationData) 
    {

        var request = $http(
      {
          url: localbaseUrl + "/api/grRequest/ProcessRequest",
          params: ProcessConfigurationData,
          method: "post"
      }).
      success(function (data, status, headers, config) {
          return data;
      });


    
        return request;
    };
   
    //Function to get all records ProcessConfiguration
    this.ProcessConfigurationgetAll = function (ProcessConfigurationData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(ProcessConfigurationData),
            url: baseUrl + "/api/ProcessConfiguration/GetAllProcessConfigurationData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By ProcessConfiguration ID
    this.ProcessConfigurationgetById = function (ProcessConfigurationData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(ProcessConfigurationData),
            url: baseUrl + "/api/ProcessConfiguration/GetByProcessConfigurationId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.ProcessConfigurationdeleteById = function (ProcessConfigurationData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/ProcessConfiguration/delete/id",
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

