
app.service("EnquiryService", function ($http)
{
    //Function to create new Enquiry
    this.Enquirysave = function (EnquiryData) 
    {
        var request = $http(
        {
            method: "post",
            url: baseUrl + "/api/Enquiry/SaveEnquiry",
            data: EnquiryData
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
        return request;
    };
   
    //Function to get all records Enquiry
    this.EnquirygetAll = function (EnquiryData) 
    {
        var request = $http(
        {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(EnquiryData),
            url: baseUrl + "/api/Enquiry/GetAllEnquiryData",
            contentType: "application/json; charset=utf-8",
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });
                
        return request;
    };
    
    //Function to Get By Enquiry ID
    this.EnquirygetById = function (EnquiryData) 
    {
        var request = $http({
            method: 'POST',
            params: EnquiryData,
            url: baseUrl + '/api/Enquiry/GetEnquiryById',

        }).success(function (data, status, headers, config) {
            

            return data;
        });
        return request;
    };
            
     this.EnquirydeleteById = function (EnquiryData) 
     {
        var request =  $http(
        {
            url: baseUrl + "api/Enquiry/delete/id",
            data: JSON.stringify(jsonobject),
            method: "POST"
        }).
        success(function (data, status, headers, config) 
        {
            return data;
        });;
        return request;
     };


     this.LoadAllItem = function () {
         var request = $http({
             method: 'POST',
             dataType: 'json',
             data: '',
             url: baseUrl + '/api/Item/LoadAllProducts',
             contentType: "application/json; charset=utf-8"

         }).
         success(function (data, status, headers, config) {
             return data;
         });

         return request;
     };



     this.LoadAllDeliveryLocation = function () {
         
         var request = $http({
             method: 'POST',
             dataType: 'json',
             data: '',
             url: baseUrl + '/api/DeliveryLocation/GetAllDeliveryLocationList',
             contentType: "application/json; charset=utf-8"

         }).
         success(function (data, status, headers, config) {
             return data;
         });

         return request;
     };


     this.LoadTruckSize = function () {
         var request = $http({
             method: 'POST',
             dataType: 'json',
             data: '',
             url: baseUrl + '/api/TruckSize/GetAllTruckSizeList',
             contentType: "application/json; charset=utf-8"

         }).
         success(function (data, status, headers, config) {
             return data;
         });

         return request;
     };


});

