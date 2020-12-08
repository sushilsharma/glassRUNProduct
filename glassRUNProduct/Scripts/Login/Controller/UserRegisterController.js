angular.module("CampusProject").controller('UserRegistrationController', function ($scope, $location, $http, adminService) {
    
    $scope.save = function () {
        $scope.$broadcast('show-errors-check-validity');
        //if ($scope.AdminForm.$valid) {
            var jsonobject = {};

            var userMasterClass = {
                Name: $scope.Name,
                EmailId: $scope.PrimaryEmail,
                //AlternetEmail: $scope.AlternetEmail,
                ContactNumber: $scope.PhoneNo,
                UserName: $scope.UserName,
                //Password: $scope.Password,
                ChangePasswordonFirstLoginRequired: $scope.ChangePasswordonFirstLoginRequired,
                ProfileId: $scope.UserProfileId,
                RoleMasterId: $scope.RoleMasterData.ddlRoleName

            };

            var authentication = [];
            
            for (var i = 0; i < $scope.SecurityQuestion.length; i++) {
                var authenticationvalue = {};
                authenticationvalue.SecurityQuestionId = $scope.SecurityQuestion[i].SecurityQuestionId;
                authenticationvalue.Answer = document.getElementById("txt" + $scope.SecurityQuestion[i].SecurityQuestionId).value;
                authentication.push(authenticationvalue);
            }
            jsonobject.UserMasterData = userMasterClass;
            jsonobject.securityQuestionDto = authentication;
            jsonobject.password = $scope.Password;

            if ($scope.UserProfileId === undefined) {
                
                adminService.AddUserRegistration(jsonobject).then(function (response) {
                    
                    gridCallBack();
                    alert(response.data);
                });
            } else {
                
                adminService.UpdateUserRegistration(jsonobject).then(function (response) {
                    
                    gridCallBack();
                    alert(response.data);
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
                read: function (options) { //You can get the current page, pageSize etc off `e`.
                    
                    var orderby = "";
                    var config = "";

                    if (options.data.sort) {
                        if (options.data.sort.length > 0) {
                            var sortField = options.data.sort[0].field;
                            if (options.data.sort[0].dir === "asc") {
                                sortOrder = ' asc';
                            } else if (options.data.sort[0].dir === "desc") {
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
                    } else {
                        where = "";
                    };


                    var requestData = {
                        pageIndex: options.data.page - 1,
                        pageSize: options.data.pageSize,
                        where: where,
                        orderBy: orderby

                    };
                    adminService.UserRegistrationGridLoad(requestData).then(function (response) {
                        
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
            { field: "Name", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "EmailId", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            //{ field: "AlternetEmail", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "ContactNumber", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { field: "UserName", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { "template": "<button class=\"k-button\" ng-click=\"clickMeEdit(#=ProfileId#)\">Edit</button>", "title": "Edit", width: "250px" },
            //{ "template": "<button class=\"k-button\" ng-click=\"clickMe(#=RoleMasterId#)\">Delete</button>", "title": "Delete", width: "250px" }
            //{ command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
        ],
        //editable: "inline"

    }

    $scope.clickMe = function (id) {

        $scope.UserProfileId = id;
        $scope.modal.center().open();
    };

    $scope.clickMeEdit = function (id) {
        //TODO call remote service to delete item....
        var jsonobject = {};
        jsonobject.userProfileId = id;
        
        adminService.EditUserRegistration(jsonobject).then(function (response) {
            
            $scope.isHide = false;
            var mydata = response.data;
            $scope.Name = mydata.ProfileList[0].Name,

            $scope.PrimaryEmail = mydata.ProfileList[0].EmailId,
            //$scope.AlternetEmail = mydata.ProfileList[0].AlternetEmail,
             $scope.PhoneNo = mydata.ProfileList[0].ContactNumber,
            $scope.UserName = mydata.ProfileList[0].UserName,
            $scope.ChangePasswordonFirstLoginRequired = mydata.ProfileList[0].ChangePasswordonFirstLoginRequired,
            $scope.RoleMasterData.ddlRoleName = mydata.ProfileList[0].RoleMasterId,
            $scope.UserProfileId = mydata.ProfileList[0].ProfileId,
            ShowForm();

        });

    };

    $scope.deleteUser = function (id) {
        //TODO call remote service to delete item....
        var jsonobject = {};
        jsonobject.userProfileId = $scope.UserProfileId;
        
        adminService.DeleteUserRegistration(jsonobject).then(function (response) {
            
            alert(response.data);
        });
        $scope.modal.close();
    };

    $scope.RoleMasterData = {
        init: function () {
            $scope.isHide = true;
            var jsonobject = {};
            adminService.GetAllRole(jsonobject).then(function (response) {
                
                $scope.RoleMasterData = response.data;
            });
        }
    };


    $scope.SecurityQuestion = function () {
        

        var jsonobject = {};
        jsonobject.roleMasterId = $scope.RoleMasterData.ddlRoleName;

        adminService.LoadSecurityQuestion(jsonobject).then(function (response) {
            
            if (response.data.length > 0) {
                var myData = response.data;
                $scope.SecurityQuestion = myData;
            }
            
        });
    };


    var gridCallBack = function () {

        if ($scope.values !== undefined) {
            $scope.mainGridOptions.dataSource.transport.read($scope.values);
        }
    };

    $scope.reset = function () {
        $scope.isHide = true;
        $scope.Name = "",
        $scope.PrimaryEmail = "",
        $scope.AlternetEmail = "",
        $scope.PhoneNo ="",
        $scope.UserName = "",
        $scope.ChangePasswordonFirstLoginRequired = "",
        $scope.RoleMasterData.ddlRoleName = "",
        $scope.UserProfileId = undefined,
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

