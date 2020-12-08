
app.service("ManageEnquiryService", function ($http, $rootScope, $state) {

    var localbaseUrl = "http://localhost:56393";
    //Function to get enquiries of customer
    this.LoadEnquiryDetails = function (enquiryData) {


        var request = $http(
            {
                url: localbaseUrl + "/ManageEnquiry/SearchEnquiryList",
                data: enquiryData,
                async: false,
                method: "post",
                dataType: 'json',
                contentType: "application/json; charset=utf-8"

            }).success(function (data, status, headers, config) {

                return data;
            }).error(function (data, status, headers, config) {
                console.log(status);
            });
        return request;
    };


    this.GetFilterDataForGrid = function (OrderData) {
        var request = $http({
            url: localbaseUrl + "/Order/GetFilterDataForGrid",
            data: OrderData,
            async: false,
            method: "post",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': $rootScope.Token
            }

        }).success(function (data, status, headers, config) {

            return data;
        }).error(function (data, status, headers, config) {
            console.log(status);
        });
        return request;
    };

    this.ExportToExcelForEnquiryList = function (ItemData) {

        var request = $http(
            {
                url: localbaseUrl + "/ManageEnquiry/ExportToExcelForEnquiryList",
                data: ItemData,
                async: false,
                method: 'POST',

                //responseType: 'arraybuffer'
            }).
            success(function (data, status, headers, config) {
                return data;
            });

        return request;
    };

    this.GetEnquiryOfCustomer = function (enquiryData) {
        
        var request = $http({
            url: localbaseUrl + "/ManageEnquiry/EnquiryList",
            data: enquiryData,
            async: false,
            method: "post",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': $rootScope.Token
            }

        }).success(function (data, status, headers, config) {

            return data;
        }).error(function (data, status, headers, config) {
            console.log(status);
        });
        return request;
    };

    this.EditEnquiryOfCustomer = function (enquiryData) {
        var request = $http({
            url: localbaseUrl + "/ManageEnquiry/EditEnquiryWithWorkFlow",
            data: enquiryData,
            async: false,
            method: "post",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': $rootScope.Token
            }

        }).success(function (data, status, headers, config) {

            return data;
        }).error(function (data, status, headers, config) {
            console.log(status);
        });
        return request;
    };



    this.ExportToExcelForEnquiryDetailList = function (ItemData) {

        var request = $http(
            {
                url: localbaseUrl + "/ManageEnquiry/ExportToExcelForEnquiryListDetails",
                data: ItemData,
                async: false,
                method: 'POST',

                //responseType: 'arraybuffer'
            }).
            success(function (data, status, headers, config) {
                return data;
            });

        return request;
    };

});



