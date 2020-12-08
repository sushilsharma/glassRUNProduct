angular.module("glassRUNProduct").controller('AddRoleAccessController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, AddRoleAccessService, GrRequestService) {

    LoadActiveVariables($sessionStorage, $state, $rootScope);


    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_AddRoleAccess_RoleAccess;

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }



    $rootScope.PageDetails = [];
    $scope.RoleMasterId = 0;

    $scope.RoleField = {
        RoleName: '',
        Description: '',
        Users: '',
        PolicyName: ''
    }







    $scope.EditPage = function () {
debugger;
        $rootScope.PageDetails = [];


        var requestData =
            {
                ServicesAction: 'GetPageRoleWiseAccessDetailByRoleORUserID',
                RoleId: $rootScope.EditRoleMasterId,
				UserId:$rootScope.UserId,
            };
        var jsonobject = {};
        jsonobject.Json = requestData;

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

debugger;
            var dataforRoleMaster = response.data.Json.RoleMaster;

            $scope.RoleMasterId = $rootScope.EditRoleMasterId;
            $scope.RoleField.RoleName = dataforRoleMaster.RoleName;
            $scope.RoleField.Description = dataforRoleMaster.Description;
            $scope.RoleField.PolicyName = dataforRoleMaster.PolicyName;


            var dataforRoleWisePageMappingList = response.data.Json.RoleWisePageMappingList;


            $rootScope.PageDetails = dataforRoleWisePageMappingList;


            for (var i = 0; i < $rootScope.PageDetails.length; i++) {

                if ($rootScope.PageDetails[i].IsActive == "1") {

                    $rootScope.PageDetails[i].IsActive = true;
                } else {
                    $rootScope.PageDetails[i].IsActive = false;

                }
            }

            $scope.EditRoleWisePageMappingList = $rootScope.PageDetails;
            //for (var i = 0; i < $scope.EditRoleWisePageMappingList.length; i++) {
            //    $rootScope.toggleSelection($scope.EditRoleWisePageMappingList[i].PageId, true, $scope.EditRoleWisePageMappingList[i].AccessId, $scope.EditRoleWisePageMappingList[i].RoleWisePageMappingId, $scope.EditRoleWisePageMappingList[i].RoleWiseFieldAccessList);
            //}

        });

    }





    $scope.functiontofindIndexByKeyValue = function (arraytosearch, key, valuetosearch) {

        for (var i = 0; i < arraytosearch.length; i++) {

            if (arraytosearch[i][key] === valuetosearch) {
                return i;
            }
        }
        return -1;
    }



    //Save Role Access Information RoleWiseFieldAccessList
    $scope.Save = function () {

debugger;

        if ($scope.RoleField.RoleName === "") {


            $rootScope.ValidationErrorAlert("Please fill the role name", 'success', 3000);

            return;
        }


        var Role = {
            ServicesAction: "InsertAndUpdateRoleMaster",
            RoleMasterId: $scope.RoleMasterId,
            Description: $scope.RoleField.Description,
            RoleName: $scope.RoleField.RoleName,
            PolicyName: "Default Policy",

            CreatedBy: $rootScope.UserId,
            IsActive: true,

        };

        var jsonobject = {};
        jsonobject.Json = Role;

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var data = response.data;

            var rolemasterid = 0;


            if (data != null) {

                var rolemasterid = data.Json.RoleMasterId;


                var RoleWisePageMappingList = $rootScope.PageDetails.filter(function (el) { return el.IsSelectedRow === true; });

                if (RoleWisePageMappingList.length != 0) {
                    for (var i = 0; i < RoleWisePageMappingList.length; i++) {

                        RoleWisePageMappingList[i].RoleMasterId = rolemasterid;
                        RoleWisePageMappingList[i].LoginId = 0;


                        if (typeof RoleWisePageMappingList[i].RoleWiseFieldAccessList !== 'undefined') {
                            for (var j = 0; j < RoleWisePageMappingList[i].RoleWiseFieldAccessList.length; j++) {

                                RoleWisePageMappingList[i].RoleWiseFieldAccessList[j].RoleId = rolemasterid;

                                RoleWisePageMappingList[i].RoleWiseFieldAccessList[j].LoginId = 0;



                            }
                        }
                    }

                }



                var RoleWisePageMapping = {
                    ServicesAction: "InsertAndUpdateRoleWisePageMappingAndRoleWiseFieldAccess",
                    RoleWisePageMappingList: RoleWisePageMappingList,

                };


                var jsonobject = {};
                jsonobject.Json = RoleWisePageMapping;

                GrRequestService.ProcessRequest(jsonobject).then(function (response) {

                    var taxdata = response.data;

                    $scope.Clear();
                    $scope.ViewForm();



                    var ClearRoleWisePageMapping = {
                        ServicesAction: "ClearPageControlAccessCache"

                    };


                    var Clearjsonobject = {};
                    Clearjsonobject.Json = ClearRoleWisePageMapping;

                    GrRequestService.ProcessRequest(Clearjsonobject).then(function (Clearresponse) {
                    });


                });



            }







        });







    }

    $scope.Clear = function () {

        $rootScope.EditRoleMasterId = 0;
        $scope.RoleMasterId = 0;
        $scope.RoleField.RoleName = "";
        $scope.RoleField.Description = "";
        for (var i = 0; i < $rootScope.PageDetails.length; i++) {
            $rootScope.PageDetails[i].IsActive = false;

        }
        $rootScope.selection = [];
    }


    /* View Screen */

    $scope.ViewRoleAccessGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) { //You can get the current page, pageSize etc off `e`.

                        var orderby = "";
                        var config = "";
                        var viewRoleAccessDto = "";

                        var RoleName = "";
                        var Description = "";

                        var RoleNameCriteria = "";
                        var DescriptionCriteria = "";

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

                            if (options.data.filter.filters[0].field === "RoleName") {
                                RoleName = options.data.filter.filters[0].value;
                                RoleNameCriteria = options.data.filter.filters[0].operator;
                            }

                            if (options.data.filter.filters[0].field === "Description") {
                                Description = options.data.filter.filters[0].value;
                                DescriptionCriteria = options.data.filter.filters[0].operator;
                            }

                            console.log("input: ", options.data.filter.filters[0]);
                        } else {
                            where = "";
                        };

                        var requestData =
                            {
                                ServicesAction: 'LoadRoleMasterGrid',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                RoleName: RoleName,
                                Description: Description,
                                RoleNameCriteria: RoleNameCriteria,
                                DescriptionCriteria: DescriptionCriteria
                            };


                        var consolidateApiParamater =
                            {
                                Json: requestData,
                            };



                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                            $rootScope.Throbber.Visible = false;
                            var totalcount = [];
                            var ListData = [];

                            if (response.data != undefined) {
                                if (response.data.Json.RoleMasterList.length > 0) {
                                    var RoleMasterData = response.data.Json.RoleMasterList.filter(function (el) { return el.RoleParentId === 0 || el.RoleParentId === "0" || el.RoleParentId === null; });

                                    ListData = RoleMasterData;
                                    totalcount = RoleMasterData[0].TotalCount;

                                }
                                else {
                                    ListData = [];
                                    totalcount = 0;
                                }

                            }
                            else {
                                ListData = [];
                                totalcount = 0;
                            }
                            var roleMasterList = {
                                data: ListData,
                                totalRecords: totalcount
                            }

                            $scope.GridData = roleMasterList;
                            options.success(roleMasterList);
                            $scope.values = options;
                        });
                    }
                },
                pageSize: 50,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true
            },
            filterable:
            {
                mode: "row"
            },
            selectable: "row",
            pageable:
            {
                pageSizes: [10, 50, 100]
            },
            sortable: true,
            groupable: true,
            columnMenu: true,
            mobile: true,
            dataBound: gridDataBound,
            columns: [

                { field: "RoleName", title: "RoleName", type: "string", filterable: { mode: "row", extra: false } },
                //{ field: "PolicyName", title: "PolicyName", type: "string", filterable: { mode: "row", extra: false } },
                { field: "Description", title: "Description", type: "string", filterable: { mode: "row", extra: false } },
                { "template": "<button class=\"k-button\" ng-click=\"ViewRoleAccessEdit(#=RoleMasterId#)\"><i class='fa fa-pencil'></i></a>", "title": "Edit", "width": "6%" },
                { "template": "<button class=\"k-button\" ng-click=\"ViewRoleAccessDelete(#=RoleMasterId#)\"><i class='fa fa-trash'></i></a>", "title": "Delete", "width": "6%" }
            ],
        }
    function gridDataBound(e) {

        var grid = e.sender;
        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.ViewRoleAccessGrid.dataSource.transport.read($scope.values);
        }
    };


    $rootScope.EditRoleMasterId = 0;
    $scope.ViewRoleAccessEdit = function (roleMasterId) {



        $rootScope.EditRoleMasterId = roleMasterId;
        $scope.AddForm();
        $scope.EditPage();




    }

    $scope.ViewRoleAccessDelete = function (roleId) {


        var requestData =
            {
                ServicesAction: 'DeleteRoleByRoleId',
                RoleId: roleId,
            };
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {


            gridCallBack();

        });
    }

    /* Tabbing Code */
    $scope.AddForm = function () {

        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
    }
    $scope.ViewForm = function () {

        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.Clear();
        gridCallBack();
    }
    $scope.ViewForm();





    $ionicModal.fromTemplateUrl('templates/ControlLevelAccess.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ControlLevelAccessModalPopup = modal;
    });

    $scope.RoleWiseFieldAccessList = [];
    $scope.SelectedPageId = 0;
    $scope.OpenPageControlAccessModalpopup = function (PageId) {
debugger;


        var Page = $rootScope.PageDetails.filter(function (el) { return el.PageId === PageId; });
        Page[0].IsSelectedRow = true;
        if (typeof Page[0].RoleWiseFieldAccessList === "undefined") {

            $rootScope.ValidationErrorAlert("Control Level Access is not configuare for this page", 'success', 3000);

            return;
        }



        $scope.PageName = Page[0].PageName;

        $scope.SelectedPageId = PageId;


        if (Page[0].RoleWiseFieldAccessList.length != 0) {

            var PageControlList = Page[0].RoleWiseFieldAccessList;

            for (var i = 0; i < PageControlList.length; i++) {

                if (PageControlList[i].AccessId == "0") {

                    PageControlList[i].IsShowChecked = false;
                    PageControlList[i].IsEnableChecked = false;

                } else if (PageControlList[i].AccessId == "1") {

                    PageControlList[i].IsShowChecked = true;
                    PageControlList[i].IsEnableChecked = false;
                }
                else if (PageControlList[i].AccessId == "2") {

                    PageControlList[i].IsShowChecked = true;
                    PageControlList[i].IsEnableChecked = true;
                }


            }


            $scope.PageControlList = PageControlList;

            $scope.ControlLevelAccessModalPopup.show();


        }

    }



    $scope.ClosePageControlAccessModalpopup = function () {

        $scope.SelectedPageId = 0;
        $scope.ControlLevelAccessModalPopup.hide();
    }

    $scope.RoleObjectPropertyMapping = [];



    $scope.SavePageControlAccess = function () {

debugger;


        for (var i = 0; i < $scope.PageControlList.length; i++) {

            if ($scope.PageControlList[i].IsShowChecked == true && $scope.PageControlList[i].IsEnableChecked == true) {

                $scope.PageControlList[i].AccessId = "2";
            } else if ($scope.PageControlList[i].IsShowChecked == true && $scope.PageControlList[i].IsEnableChecked == false) {

                $scope.PageControlList[i].AccessId = "1";
            } else if ($scope.PageControlList[i].IsShowChecked == false && $scope.PageControlList[i].IsEnableChecked == false) {

                $scope.PageControlList[i].AccessId = "0";
            }



        }



        var Page = $rootScope.PageDetails.filter(function (el) { return el.PageId === $scope.SelectedPageId; })

        if (Page.length != 0) {

            Page[0].RoleWiseFieldAccessList = $scope.PageControlList;
        }

        $scope.ClosePageControlAccessModalpopup();

    }

    $scope.SetEnabledControl = function (pageControl) {


        pageControl.IsEnableChecked = false;


    }

});