angular.module("CampusProject").controller('RoleMasterController', function ($scope, $http, $rootScope, adminService) {
    

    //getRoleWiseFieldAccess();

    //var OnPageLoad=function(){
    //    alert('sdfsdfdsfsdfsdf');
    //};


    //OnPageLoad();

    $scope.save = function () {
        $scope.$broadcast('show-errors-check-validity');
        //if ($scope.AdminForm.$valid) {
            var jsonobject = {};

            var roleMasterClass = {
                RoleName: $scope.RoleName,
                RoleMasterId: $scope.RoleMasterId,
                //CreatedFromIPAddress: commenValues.IpAddress
            };
            jsonobject.RoleMasterClass = roleMasterClass;
            if ($scope.RoleMasterId === undefined) {
                var addRole = adminService.AddRole(jsonobject);
            } else {

                var updateRole = adminService.UpdateRole(jsonobject);
            }
            gridCallBack();
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
                    

                    adminService.RolMasterGridLoad(requestData).then(function (response) {
                        

                        $scope.GridData = response.data;
                        options.success(response.data);
                        $scope.values = options;
                    }),error(function (data, status, headers, config) {
                        //alert('something went wrong');
                        $rootScope.toggleModelAlert('Something went wrong', '');
                            console.log(status);
                        });
                    //$http({
                    //    method: 'POST',
                    //    dataType: 'json',
                    //    data: JSON.stringify(requestData),
                    //    url: 'WebServices/AdminPortalService.asmx/LoadRoleMaster',
                    //    contentType: "application/json; charset=utf-8"

                    //}).
                    //success(function (data, status, headers, config) {
                    //    

                    //    var promiseGetEmployees = data.d;
                    //    $scope.GridData = data.d;
                    //    options.success(promiseGetEmployees);
                    //    $scope.values = options;
                    //    //console.log(JSON.parse(data.d));
                    //}).
                    //error(function (data, status, headers, config) {
                    //    alert('something went wrong');
                    //    console.log(status);
                    //});
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
             { field: "RoleMasterId", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } }, visiblity: false },
            { field: "RoleName", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },
            { "template": "<button class=\"k-button\" ng-click=\"clickMeEdit(#=RoleMasterId#)\">Edit</button>", "title": "Edit", width: "250px" },
             { "template": "<button class=\"k-button\" ng-click=\"clickMe(#=RoleMasterId#)\">Delete</button>", "title": "Delete", width: "250px" }
        //{ command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
        ],
        //editable: "inline"

    }

    $scope.clickMe = function (id) {
        var raw = $scope.GridData.Data;
        var length = raw.length;
        var item, i;
        for (i = length - 1; i >= 0; i--) {
            item = raw[i];
            if (item.RoleMasterId.toString() === id.toString()) {
                $scope.RoleName = item.RoleName;
                $scope.RoleMasterId = id;

            }
        }
        $scope.modal.center().open();
    };

    $scope.clickMeEdit = function (id) {
        //TODO call remote service to delete item....
        var jsonobject = {};
        jsonobject.roleMasterId = id;
        

        adminService.EditRoleMaster(jsonobject).then(function (response) {
            

            var mydata = response.data;
            $scope.RoleName = mydata.RoleMasterList[0].RoleName;
            $scope.RoleMasterId = mydata.RoleMasterList[0].RoleMasterId;
            ShowForm();
        });

        //$http({
        //    url: "WebServices/AdminPortalService.asmx/GetRoleByRoleMasterId",
        //    data: JSON.stringify(jsonobject),
        //    method: "POST"
        //}).then(function successCallback(response) {
        //    
        //    var mydata = response.data;
        //    $scope.RoleName = mydata.RoleMasterList[0].RoleName;
        //    $scope.RoleMasterId = mydata.RoleMasterList[0].RoleMasterId;
        //    ShowForm();
        //    //$scope.mainGridOptions =$scope.GridData;
        //}, function errorCallback(response) {
        //    console.log(response);
        //});


        //    }
        //}

    };

    $scope.deleteRole = function (id) {
        //TODO call remote service to delete item....
        var jsonobject = {};
        jsonobject.roleMasterId = $scope.RoleMasterId;
        
        

        adminService.DeleteRole(jsonobject).then(function (response) {
            
            gridCallBack();
            alert(response.data);
        });
        
        $scope.modal.close();
    };


    var gridCallBack = function () {

        if ($scope.values !== undefined) {
            $scope.mainGridOptions.dataSource.transport.read($scope.values);
        }
    };

    $scope.reset = function () {
        $scope.RoleName = "";
        $scope.RoleMasterId = undefined;
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


