
app.service("ManageCustomerService", function ($http, $rootScope, $state) {

    var localbaseUrl = "http://localhost:56393";
    
    this.EditCustomerGroup = function (groupData) {


        var request = $http(
            {
                url: localbaseUrl + "/Product/EditCustomerGroup",
                data: groupData,
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

    this.LoadCustomerGroup = function (groupData) {


        var request = $http(
            {
                url: localbaseUrl + "/Product/GetCustomerGroupList",
                data: groupData,
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


    this.LoadSellerProductCatalogList = function (loadJson) {
        var request = $http({
            url: localbaseUrl + "/Product/GetSellerProductCatalog",
            data: loadJson,
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

    this.ActivateDeactivateSupplierItem = function (loadJson) {
        var request = $http({
            url: localbaseUrl + "/Product/DeactiveActiveItem",
            data: loadJson,
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


    this.ActivateDeactivateItemPriceVariation = function (loadJson) {
        var request = $http({
            url: localbaseUrl + "/Product/DeactiveActiveItemPriceVariation",
            data: loadJson,
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


    this.ItemPriceVariationsList = function (loadJson) {
        var request = $http({
            url: localbaseUrl + "/Product/GetItemPriceVariationsListByItem",
            data: loadJson,
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

    this.CreateItemPrice = function (loadJson) {
        var request = $http({
            url: localbaseUrl + "/Product/CreateItemPrice",
            data: loadJson,
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

    this.UpdateItemPrice = function (loadJson) {
        var request = $http({
            url: localbaseUrl + "/Product/UpdateItemPrice",
            data: loadJson,
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

    this.ManagePricingForCustomerGroup = function (loadJson) {
        var request = $http({
            url: localbaseUrl + "/Product/ManagePricingForCustomerGroup",
            data: loadJson,
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

    this.ManagePricingForCustomers = function (loadJson) {
        var request = $http({
            url: localbaseUrl + "/Product/ManagePricingForCustomers",
            data: loadJson,
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

    this.ActivateDeactivateCompany = function (loadJson) {
        var request = $http({
            url: localbaseUrl + "/api/ManageLogin/ActivateDeactivateCompany",
            data: loadJson,
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

    this.UpdateLanguageForUser = function (loadJson) {
        var request = $http({
            url: localbaseUrl + "/api/ManageLogin/UpdateLanguageForUser",
            data: loadJson,
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


});



