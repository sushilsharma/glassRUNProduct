angular.module("CampusProject").controller('PasswordPoliciesController', function ($scope, $location, $http, adminService) {
    
    $scope.save = function () {
        $scope.$broadcast('show-errors-check-validity');
        //if ($scope.AdminForm.$valid) {
            var jsonobject = {};
            
            var passwordPolicyClass = {
                RoleMasterId: $scope.RoleMasterData.ddlRoleName,
                PasswordPolicyName: $scope.PasswordPolicyName,
                PasswordPolicyId: $scope.PasswordPolicyId,
                IsUpperCaseAllowed: $scope.IsUpperCaseAllowed,
                IsLowerCaseAllowed: $scope.IsLowerCaseAllowed,
                IsNumberAllowed: $scope.IsNumberAllowed,
                IsSpecialCharacterAllowed: $scope.IsSpecialCharacterAllowed,
                SpecialCharactersToBeExcluded: $scope.SpecialCharactersToBeExcluded,
                MinimumUppercaseCharactersRequired: $scope.MinimumUppercaseCharactersRequired,
                MinimumLowercaseCharactersRequired: $scope.MinimumLowercaseCharactersRequired,
                MinimumSpecialCharactersRequired: $scope.MinimumSpecialCharactersRequired,
                PasswordExpiryPeriod: $scope.PasswordExpiryPeriod,
                NewPasswordShouldNotMatchNoOfLastPassword: $scope.NewPasswordShouldNotMatchNoOfLastPassword,
                MinimumPasswordLength: $scope.MinimumPasswordLength,
                MaximumPasswordLength: $scope.MaximumPasswordLength,
                CanPasswordBeSameAsUserName: $scope.CanPasswordBeSameAsUserName,
                NumberOfSecurityQuestionsForRegistration: $scope.NumberOfSecurityQuestionsForRegistration,
                NumberOfSecurityQuestionsForRecovery: $scope.NumberOfSecurityQuestionsForRecovery,
                OneTimePasswordExpireTime: $scope.OneTimePasswordExpireTime

            };
            jsonobject.PasswordPolicyClass = passwordPolicyClass;
            if ($scope.PasswordPolicyId === undefined) {
                
                adminService.AddPasswordPolicy(jsonobject).then(function (response) {
                    gridCallBack();
                    
                });
            } else {
                

                adminService.UpdatePasswordPolicy(jsonobject).then(function (response) {
                    gridCallBack();
                    $scope.reset();
                    
                });
            }
            $scope.reset();
        //}
    };

    $scope.title = "AngularJS.";
    var sortOrder = "";
    var where = "";

    
    $scope.mainGridOptions = {
        dataSource: {
            schema: {
                data: "Data",
                total: "Total"
            },
            transport: {

                read: function (options) {//You can get the current page, pageSize etc off `e`.
                    
                    var orderby = "";
                    var config = "";

                    if (options.data.sort) {
                        if (options.data.sort.length > 0) {
                            var sortField = options.data.sort[0].field;
                            if (options.data.sort[0].dir === "asc") {
                                sortOrder = ' asc';
                            }
                            else if (options.data.sort[0].dir === "desc") {
                                sortOrder = ' desc';
                            };
                            orderby = sortField + sortOrder;
                        }
                    }
                    if (options.data && options.data.filter && options.data.filter.filters) {
                        config =
                            {
                                value: options.data.filter.filters[0].value,
                                field: options.data.filter.filters[0].field,
                                operator: options.data.filter.filters[0].operator

                            };
                        where = options.data.filter.filters[0].field + " Like '%" + options.data.filter.filters[0].value + "%'";

                        console.log("input: ", options.data.filter.filters[0]);
                    }
                    else {
                        where = "";
                    };
                    var requestData = {
                        pageIndex: options.data.page - 1,
                        pageSize: options.data.pageSize,
                        where: where,
                        orderBy: orderby
                    };

                    adminService.PasswordPolicyGridLoad(requestData).then(function (response) {
                        

                        $scope.GridData = response.data;
                        options.success(response.data);
                        $scope.values = options;
                    });
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true
        },
        filterable: {
            mode: "row"
        },
        selectable: "row",
        pageable: {
            pageSizes: [10, 50, 100]
        },
        sortable: true,
        groupable: true,
        columnMenu: true,
        columns: [
             { field: "RoleName", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } }, visiblity: false },
            { field: "PasswordPolicyName", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "IsUpperCaseAllowed", type: "bool", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "IsLowerCaseAllowed", type: "bool", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "IsSpecialCharacterAllowed", type: "bool", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "SpecialCharactersToBeExcluded", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "MinimumUppercaseCharactersRequired", type: "int", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "MinimumLowercaseCharactersRequired", type: "int", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "MinimumSpecialCharactersRequired", type: "int", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "MinimumNumericsRequired", type: "int", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "PasswordExpiryPeriod", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "NewPasswordShouldNotMatchNoOfLastPassword", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "MinimumPasswordLength", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "MaximumPasswordLength", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "CanPasswordBeSameAsUserName", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "NumberOfSecurityQuestionsForRegistration", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "NumberOfSecurityQuestionsForRecovery", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "OneTimePasswordExpireTime", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { "template": "<button class=\"k-button\" ng-click=\"clickMeEdit(#=PasswordPolicyId#)\">Edit</button>", "title": "Edit", width: "250px" },
             { "template": "<button class=\"k-button\" ng-click=\"clickMe(#=PasswordPolicyId#, #=RolePasswordPolicyMappingId#)\">Delete</button>", "title": "Delete", width: "250px" }
        ],

    }

    $scope.clickMe = function (id, rpId) {
        var raw = $scope.GridData.Data;
        var length = raw.length;
        var item, i;
        for (i = length - 1; i >= 0; i--) {
            item = raw[i];
            if (item.PasswordPolicyId.toString() === id.toString()) {
                $scope.PasswordPolicyName = item.PasswordPolicyName;
                $scope.PasswordPolicyId = id;
                $scope.RolePasswordPolicyMappingId = rpId;
            }
        }
        $scope.modal.center().open();
    };

    $scope.clickMeEdit = function (id) {
        //TODO call remote service to delete item....
        var jsonobject = {};
        jsonobject.passwordPolicyId = id;
        

        adminService.EditPasswordPolicy(jsonobject).then(function (response) {
            
            var mydata = response.data;
            $scope.PasswordPolicyId = mydata.PasswordPolicyList[0].PasswordPolicyId,
            $scope.RolePasswordPolicyMappingId = mydata.PasswordPolicyList[0].RolePasswordPolicyMappingId,
            $scope.RoleMasterData.ddlRoleName = mydata.PasswordPolicyList[0].RoleMasterId;
            $scope.PasswordPolicyName = mydata.PasswordPolicyList[0].PasswordPolicyName;
            $scope.IsUpperCaseAllowed = mydata.PasswordPolicyList[0].IsUpperCaseAllowed;
            $scope.IsLowerCaseAllowed = mydata.PasswordPolicyList[0].IsLowerCaseAllowed;
            $scope.IsNumberAllowed = mydata.PasswordPolicyList[0].IsNumberAllowed;
            $scope.IsSpecialCharacterAllowed = mydata.PasswordPolicyList[0].IsSpecialCharacterAllowed;
            $scope.SpecialCharactersToBeExcluded = mydata.PasswordPolicyList[0].SpecialCharactersToBeExcluded;
            $scope.MinimumUppercaseCharactersRequired = mydata.PasswordPolicyList[0].MinimumUppercaseCharactersRequired;
            $scope.MinimumLowercaseCharactersRequired = mydata.PasswordPolicyList[0].MinimumLowercaseCharactersRequired;
            $scope.MinimumSpecialCharactersRequired = mydata.PasswordPolicyList[0].MinimumSpecialCharactersRequired;
            $scope.PasswordExpiryPeriod = mydata.PasswordPolicyList[0].PasswordExpiryPeriod;
            $scope.NewPasswordShouldNotMatchNoOfLastPassword = mydata.PasswordPolicyList[0].NewPasswordShouldNotMatchNoOfLastPassword;
            $scope.MinimumPasswordLength = mydata.PasswordPolicyList[0].MinimumPasswordLength;
            $scope.MaximumPasswordLength = mydata.PasswordPolicyList[0].MaximumPasswordLength;
            $scope.CanPasswordBeSameAsUserName = mydata.PasswordPolicyList[0].CanPasswordBeSameAsUserName;
            $scope.NumberOfSecurityQuestionsForRegistration = mydata.PasswordPolicyList[0].NumberOfSecurityQuestionsForRegistration;
            $scope.NumberOfSecurityQuestionsForRecovery = mydata.PasswordPolicyList[0].NumberOfSecurityQuestionsForRecovery;
            $scope.OneTimePasswordExpireTime = mydata.PasswordPolicyList[0].OneTimePasswordExpireTime;
            ShowForm();
        });
    };

    $scope.deletePolicy = function (id) {
        //TODO call remote service to delete item....
        var jsonobject = {};
        jsonobject.passwordPolicyId = $scope.PasswordPolicyId;
        jsonobject.rolePasswordPolicyMappingId = $scope.RolePasswordPolicyMappingId;
        
        adminService.DeletePasswordPolicy(jsonobject).then(function (response) {
            
            alert(response.data);
           
        });
        $scope.modal.close();
    };


    $scope.RoleMasterData = {
        init: function () {

            var jsonobject = {};
            adminService.GetAllRole(jsonobject).then(function(response) {
                $scope.RoleMasterData = response.data;
            });
        }
    };


    var gridCallBack = function () {
        $scope.mainGridOptions.dataSource.transport.read($scope.mainGridOptions.dataSource);
    };

    $scope.reset = function () {
        $scope.PasswordPolicyId = undefined;
        $scope.RoleMasterData.ddlRoleName = "";
        $scope.PasswordPolicyName = "";
        $scope.IsUpperCaseAllowed = "";
        $scope.IsLowerCaseAllowed = "";
        $scope.IsNumberAllowed = "";
        $scope.IsSpecialCharacterAllowed = "";
        $scope.SpecialCharactersToBeExcluded = "";
        $scope.MinimumUppercaseCharactersRequired = "";
        $scope.MinimumLowercaseCharactersRequired = "";
        $scope.MinimumSpecialCharactersRequired = "";
        $scope.PasswordExpiryPeriod = "";
        $scope.NewPasswordShouldNotMatchNoOfLastPassword = "";
        $scope.MinimumPasswordLength = "";
        $scope.MaximumPasswordLength = "";
        $scope.CanPasswordBeSameAsUserName = "";
        $scope.NumberOfSecurityQuestionsForRegistration = "";
        $scope.NumberOfSecurityQuestionsForRecovery = "";
        $scope.OneTimePasswordExpireTime = "";
        $scope.$broadcast('show-errors-reset');

    };

});


//template: "#= kendo.toString(kendo.parseDate(EventTime, 'dd.MM.yyyy hh:mm tt'), 'dd.MM.yyyy hh:mm tt') #",
var JsonDateConverter = function (key, value) {
    var a;
    if (typeof value === 'string') {
        a = /\/Date\((\d*)\)\//.exec(value);
        if (a) {
            return convert(new Date(+a[1]));
        }
    }
    return value;
}

function convert(str) {
    
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("/");
}


