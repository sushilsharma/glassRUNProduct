angular.module("CampusProject").controller('SecurityQuestionsController', function ($scope, $location, $http, adminService) {
    
    $scope.save = function () {
        $scope.$broadcast('show-errors-check-validity');
        //if ($scope.AdminForm.$valid) {
            var jsonobject = {};

            var question = {
                Question: $scope.Questions,
                RoleMasterId: $scope.securityQuestion.ddlRoleName,
                SecurityQuestionId: $scope.SecurityQuestionId,
                IsUpperCaseAllowed: $scope.IsUpperCaseAllowed,
                IsLowerCaseAllowed: $scope.IsLowerCaseAllowed,
                IsNumberAllowed: $scope.IsNumberAllowed,
                IsSpecialCharacterAllowed: $scope.IsSpecialCharacterAllowed,
                SpecialCharactersToBeExcluded: $scope.SpecialCharactersToBeExcluded,
                MinimumUppercaseCharactersRequired: $scope.MinimumUppercaseCharactersRequired,
                MinimumLowercaseCharactersRequired: $scope.MinimumLowercaseCharactersRequired,
                MinimumSpecialCharactersRequired: $scope.MinimumSpecialCharactersRequired,
                MinimumNumericsRequired: $scope.MinimumNumericsRequired

            };
            jsonobject.QuestionData = question;
            if ($scope.SecurityQuestionId === undefined) {
                

                adminService.AddSecurityQuestions(jsonobject).then(function (response) {
                    $scope.reset();
                    gridCallBack();
                    
                });
            } else {
                

                adminService.UpdateSecurityQuestions(jsonobject).then(function (response) {
                    $scope.reset();
                    gridCallBack();
                  
                    
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

                    adminService.SecurityQuestionsGridLoad(requestData).then(function (response) {
                        

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
             { field: "RoleName", type: "int", filterable: { mode: "row", extra: false, cell: { enabled: false } }, enabled: false },
            { field: "Question", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "IsUpperCaseAllowed", type: "bool", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "IsLowerCaseAllowed", type: "bool", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "IsSpecialCharacterAllowed", type: "bool", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "SpecialCharactersToBeExcluded", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "MinimumUppercaseCharactersRequired", type: "int", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "MinimumLowercaseCharactersRequired", type: "int", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "MinimumSpecialCharactersRequired", type: "int", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "MinimumNumericsRequired", type: "int", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { "template": "<button class=\"k-button\" ng-click=\"clickMeEdit(#=SecurityQuestionId#)\">Edit</button>", "title": "Edit", width: "250px" },
             { "template": "<button class=\"k-button\" ng-click=\"clickMe(#=SecurityQuestionId#, #=RoleMasterId#)\">Delete</button>", "title": "Delete", width: "250px" }
        ],

    }



    $scope.clickMe = function (id, rsid) {
        //var raw = $scope.GridData.Data;
        //var length = raw.length;
        //var item, i;
        //for (i = length - 1; i >= 0; i--) {
        //    item = raw[i];
        //    if (item.SecurityQuestionId.toString() === id.toString()) {
        //        $scope.Question = item.Question;
              $scope.SecurityQuestionId = id;
               $scope.UserRoleSecurityQuestionId = rsid;
        //    }
        //}
        $scope.modal.center().open();
    };

    $scope.clickMeEdit = function (id) {
        //TODO call remote service to delete item....
        var jsonobject = {};
        jsonobject.securityQuestionId = id;
        

        adminService.EditSecurityQuestions(jsonobject).then(function (response) {
            
            var mydata = response.data;
            $scope.securityQuestion.ddlRoleName = mydata.SecurityQuestionList[0].RoleMasterId;
            $scope.Questions = mydata.SecurityQuestionList[0].Question;
            $scope.SecurityQuestionId = mydata.SecurityQuestionList[0].SecurityQuestionId;
            $scope.IsUpperCaseAllowed = mydata.SecurityQuestionList[0].IsUpperCaseAllowed;
            $scope.IsLowerCaseAllowed = mydata.SecurityQuestionList[0].IsLowerCaseAllowed;
            $scope.IsNumberAllowed = mydata.SecurityQuestionList[0].IsNumberAllowed;
            $scope.IsSpecialCharacterAllowed = mydata.SecurityQuestionList[0].IsSpecialCharacterAllowed;
            $scope.SpecialCharactersToBeExcluded = mydata.SecurityQuestionList[0].SpecialCharactersToBeExcluded;
            $scope.MinimumUppercaseCharactersRequired = mydata.SecurityQuestionList[0].MinimumUppercaseCharactersRequired;
            $scope.MinimumLowercaseCharactersRequired = mydata.SecurityQuestionList[0].MinimumLowercaseCharactersRequired;
            $scope.MinimumSpecialCharactersRequired = mydata.SecurityQuestionList[0].MinimumSpecialCharactersRequired;
            $scope.MinimumNumericsRequired = mydata.SecurityQuestionList[0].MinimumNumericsRequired;
            ShowForm();
            
        });
    };

    $scope.deleteSecurityQuestion = function (id) {
        //TODO call remote service to delete item....
        var jsonobject = {};
        jsonobject.securityQuestionId = $scope.SecurityQuestionId;
        jsonobject.userRoleSecurityQuestionId = $scope.UserRoleSecurityQuestionId;

        

        adminService.DeleteSecurityQuestions(jsonobject).then(function (response) {
            if (response.data === 0) {
                //alert('Question is referd somwere.');
                $rootScope.toggleModelAlert('Question is referd somewhere.', '');
            }
            gridCallBack();
            
        });
        $scope.modal.close();
    };


    $scope.securityQuestion = {
        init: function () {

            var jsonobject = {};

            adminService.GetAllRole(jsonobject).then(function (response) {
                
                $scope.securityQuestion = response.data;
            });
        }
    };

    var gridCallBack = function () {

        if ($scope.values !== undefined) {
            $scope.mainGridOptions.dataSource.transport.read($scope.values);
        }
    };

    $scope.reset = function () {
        

        $scope.Questions = "";
        $scope.SecurityQuestionId = undefined;
        $scope.IsUpperCaseAllowed = "";
        $scope.IsLowerCaseAllowed = "";
        $scope.IsNumberAllowed = "";
        $scope.IsSpecialCharacterAllowed = "";
        $scope.SpecialCharactersToBeExcluded = "";
        $scope.MinimumUppercaseCharactersRequired = "";
        $scope.MinimumSpecialCharactersRequired = "";
        $scope.MinimumNumericsRequired = "";
        $scope.$broadcast('show-errors-reset');
    };
});
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

