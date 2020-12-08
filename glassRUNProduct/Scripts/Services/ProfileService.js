
app.service("ProfileService", function ($http)
{
    //Function to create new Profile
    this.Profilesave = function (ProfileData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/Profile/SaveProfileData",
            data: ProfileData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records Profile
    this.ProfilegetAll = function (ProfileData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(ProfileData),
            url: baseUrl + "/api/Profile/GetAllProfileData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By Profile ID
    this.ProfilegetById = function (ProfileData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(ProfileData),
            url: baseUrl + "/api/Profile/GetByProfileId",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
    };
            
     this.ProfiledeleteById = function (ProfileData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/Profile/delete/id",
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

