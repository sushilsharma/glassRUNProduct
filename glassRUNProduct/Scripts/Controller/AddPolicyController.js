angular.module("glassRUNProduct").controller('AddPolicyController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, AddPolicyService) {

    $scope.RoleMasterId = 0;
    $scope.PageDetails = [];
    $scope.RoleField = {
        RoleName: '',
        RoleMasterId: 0,
        PolicyName: '',
        UserName: ''
    }



    $scope.ProfileSelectedList = [];
    $scope.ProfileList = [];

    AddPolicyService.LoadParentRoleDetails().then(function (response) {
        

        $scope.RolesDetails = response.data;

    });



    AddPolicyService.LoadAllPages().then(function (response) {
        

        $scope.PageDetails = response.data;
    });


    $scope.LoadProfileAccordingToRole = function (roleMasterId) {
        

        $scope.EditPage(roleMasterId);

    }

    $scope.myEventListeners = {
        onItemSelect: onItemSelect,
        onItemDeselect: onItemDeselect,
        onDeselectAll: onDeselectAll
    };

    function onItemSelect(property) {
        


    }



    function onItemDeselect(property) {
        


    }

    function onDeselectAll() {
        
        $scope.MultiSchoolSelect = [];
    }


    $scope.EditPage = function (roleId) {

        
        $scope.ProfileList = [];
        $scope.ProfileSelectedList = [];

        var requestData = {
            roleMasterId: roleId,

        };
        AddPolicyService.GetRoleDetailsbyRoleId(requestData).then(function (response) {
            
            var data = response.data;



            $scope.RoleField.RoleName = data.RoleName;
            $scope.RoleField.RoleMasterId = roleId;
            $scope.RoleField.Description = data.Description;
            if ($rootScope.EditRoleMasterId === 0) {
                $scope.RoleField.PolicyName = "";
            } else {
                $scope.RoleField.PolicyName = data.PolicyName;
            }


            $scope.EditRoleWisePageMappingList = data.RoleWisePageMappingList;



            for (var i = 0; i < $scope.EditRoleWisePageMappingList.length; i++) {
                $scope.toggleSelection($scope.EditRoleWisePageMappingList[i].PageId, true, $scope.EditRoleWisePageMappingList[i].AccessId, $scope.EditRoleWisePageMappingList[i].RoleWisePageMappingId, $scope.EditRoleWisePageMappingList[i].RoleWiseFieldAccessList);
            }

            $scope.UserProfileList = data.ProfileList;


            var requestData = {
                roleId: roleId,

            };
            AddPolicyService.GetProfileByRoleId(requestData).then(function (response) {
                

                $scope.UserDetails = response.data;



                for (var i = 0; i < $scope.UserDetails.length; i++) {
                    var reports = {
                        "Name": $scope.UserDetails[i].UserName,
                        "LookupID": $scope.UserDetails[i].LoginId
                    };

                    $scope.ProfileList.push(reports)
                }

                for (var i = 0; i < $scope.UserProfileList.length; i++) {
                    var profile = {
                        "Name": $scope.UserProfileList[i].UserName,
                        "LookupID": $scope.UserProfileList[i].LoginId
                    }
                    $scope.ProfileSelectedList.push(profile);
                }


            });



        });

    }



    $scope.selection = [];
    $scope.toggleSelection = function (pageId, action, accessId, roleWisePageMappingId, roleWiseFieldControlAccess) {
        
        if (action) {
            var selectedSection = $scope.selection.filter(function (el) { return el.PageId === pageId; });
            if (selectedSection.length > 0) {
                selectedSection[0].AccessId = accessId;
                selectedSection[0].IsActive = true;
            } else {
                var pageMappingData = {
                    PageId: pageId,
                    AccessId: accessId,
                    RoleWisePageMappingId: roleWisePageMappingId,
                    RoleWiseFieldAccessList: roleWiseFieldControlAccess,
                    IsActive: true
                };

                $scope.selection.push(pageMappingData);
            }
        } else {

            if ($rootScope.EditRoleMasterId != "" && $rootScope.EditRoleMasterId != 0) {
                var selectedSection = $scope.selection.filter(function (el) { return el.PageId === pageId; });
                if (selectedSection.length > 0) {
                    selectedSection[0].IsActive = false;
                }
            } else {
                var idx = $scope.functiontofindIndexByKeyValue($scope.selection, "PageId", pageId);
                if (idx > -1) {
                    $scope.selection.splice(idx, 1);
                }
            }

        }

        
        var accessaddFilter = $scope.PageDetails.filter(function (el) { return el.PageId === pageId; });

        if (accessId == '3') {
            if (action) {

                accessaddFilter[0].ViewAccess = true;
                accessaddFilter[0].EditAccess = true;
                accessaddFilter[0].AddAccess = true;
                accessaddFilter[0].IsDisabledView = true;
                accessaddFilter[0].IsDisabledEdit = true;
            }
            else {
                accessaddFilter[0].ViewAccess = false;
                accessaddFilter[0].EditAccess = false;
                accessaddFilter[0].AddAccess = false;
                accessaddFilter[0].IsDisabledView = false;
                accessaddFilter[0].IsDisabledEdit = false;
            }
        }
        else if (accessId == '2') {
            if (action) {
                accessaddFilter[0].ViewAccess = true;
                accessaddFilter[0].EditAccess = true;
                accessaddFilter[0].IsDisabledView = true;
            }
            else {
                accessaddFilter[0].ViewAccess = false;
                accessaddFilter[0].EditAccess = false;
                accessaddFilter[0].IsDisabledView = false;
            }
        }

        else if (accessId == '4') {
            if (action) {
                accessaddFilter[0].ViewAccess = true;
                accessaddFilter[0].EditAccess = true;
                accessaddFilter[0].AddAccess = true;
                accessaddFilter[0].DeleteAccess = true;
                accessaddFilter[0].IsDisabledAdd = true;
                accessaddFilter[0].IsDisabledView = true;
                accessaddFilter[0].IsDisabledEdit = true;

            }
            else {
                accessaddFilter[0].ViewAccess = false;
                accessaddFilter[0].EditAccess = false;
                accessaddFilter[0].AddAccess = false;
                accessaddFilter[0].DeleteAccess = false;
                accessaddFilter[0].IsDisabledAdd = false;
                accessaddFilter[0].IsDisabledView = false;
                accessaddFilter[0].IsDisabledEdit = false;
            }
        }
        else {
            if (action) {
                accessaddFilter[0].ViewAccess = true;
                accessaddFilter[0].EditAccess = false;
                accessaddFilter[0].AddAccess = false;
                accessaddFilter[0].DeleteAccess = false;
                accessaddFilter[0].IsDisabledAdd = false;
                accessaddFilter[0].IsDisabledView = false;
                accessaddFilter[0].IsDisabledEdit = false;

            }
            else {
                accessaddFilter[0].ViewAccess = false;
                accessaddFilter[0].EditAccess = false;
                accessaddFilter[0].AddAccess = false;
                accessaddFilter[0].IsDisabledAdd = false;
                accessaddFilter[0].IsDisabledView = false;
                accessaddFilter[0].IsDisabledEdit = false;

            }
        }
    }


    $scope.functiontofindIndexByKeyValue = function (arraytosearch, key, valuetosearch) {

        for (var i = 0; i < arraytosearch.length; i++) {

            if (arraytosearch[i][key] === valuetosearch) {
                return i;
            }
        }
        return -1;
    }



    //Save Role Access Information
    $scope.Save = function () {
        

        var profiles = [];
        for (var i = 0; i < $scope.ProfileSelectedList.length; i++) {
            var profile = {
                LoginId: $scope.ProfileSelectedList[i].LookupID,
                RoleMasterId: $scope.RoleField.RoleMasterId,
            }
            profiles.push(profile);

        }


        var RoleAccessJson = {
            RoleMasterId: $rootScope.EditRoleMasterId,
            Description: $scope.RoleField.Description,
            RoleName: $scope.RoleField.RoleName,
            PolicyName: $scope.RoleField.PolicyName,
            RoleWisePageMappingList: $scope.selection,
            RoleParentId: $scope.RoleField.RoleMasterId,
            ProfileList: profiles,
            IsActive: true,

        };

        AddPolicyService.SaveRoleAccess(RoleAccessJson).then(function (response) {
            
            var taxdata = response.data;
            $scope.Clear();
            $scope.ViewForm();

        });

    }

    $scope.Clear = function () {
        
        $rootScope.EditRoleMasterId = 0;
        $scope.RoleMasterId = 0;
        $scope.RoleField.RoleName = "";
        $scope.RoleField.Description = "";


        $scope.RoleField.RoleMasterId = 0;

        $scope.RoleField.PolicyName = "";

        $scope.ProfileSelectedList = [];
        $scope.ProfileList = [];
        $scope.ProfileSelectedList = [];
        for (var i = 0; i < $scope.PageDetails.length; i++) {
            $scope.PageDetails[i].EditAccess = false;
            $scope.PageDetails[i].AddAccess = false;
            $scope.PageDetails[i].ViewAccess = false;
            $scope.PageDetails[i].DeleteAccess = false;
            $scope.PageDetails[i].IsDisabledView = false;
            $scope.PageDetails[i].IsDisabledEdit = false;
            $scope.PageDetails[i].IsDisabledAdd = false;
            $scope.PageDetails[i].DeleteAccess = false;
        }
        $scope.selection = [];
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
                    viewRoleAccessDto =
                        {
                            RoleName: RoleName,
                            Description: Description,
                            RoleNameCriteria: RoleNameCriteria,
                            DescriptionCriteria: DescriptionCriteria

                        };
                    var x = JSON.stringify(viewRoleAccessDto);

                    var requestData =
                        {
                            pageIndex: options.data.page - 1,
                            pageSize: options.data.pageSize,
                            orderBy: orderby,
                            viewRoleAccessDto: x

                        };
                    

                    AddPolicyService.LoadRoleDetails(requestData).then(function (response) {
                        

                        $scope.GridData = response.data;

                        options.success(response.data);
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
               { field: "PolicyName", title: "Policy Name", type: "string", filterable: { mode: "row", extra: false } },
        { "template": "<button class=\"k-button\" ng-click=\"ViewRoleAccessEdit(#=RoleMasterId#)\"><i class='fa fa-pencil'></i></a>", "title": "Edit", "width": "6%" },
        { "template": "<button class=\"k-button\" ng-click=\"ViewRoleAccessDelete(#=RoleMasterId#)\"><i class='fa fa-trash'></i></a>", "title": "Delete", "width": "6%" }
        ],
    }
    function gridDataBound(e) {

        var grid = e.sender;
        if (grid.dataSource.total() == 0) {
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
        $scope.EditPage(roleMasterId);




    }

    $scope.ViewRoleAccessDelete = function (roleId) {
        
        var requestData =
                                  {
                                      roleMasterId: roleId,

                                  };
        AddPolicyService.DeleteRoleMasterById(requestData).then(function (response) {
            

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


    $scope.SelectedPageId = 0;
    $scope.OpenPageControlAccessModalpopup = function (PageId) {
        

        var pageselectedvalidation = $scope.selection.filter(function (el) { return el.PageId === PageId; });

        if (pageselectedvalidation.length > 0) {
            $scope.SelectedPageId = PageId;
            var requestData = {
                pageId: $scope.SelectedPageId,

            };
            AddPolicyService.LoadAllPageControlByPageId(requestData).then(function (response) {
                

                var data = response.data;
                $scope.PageControls = data;
                $scope.SetRoleWisePageFieldAccess($scope.EditRoleWisePageMappingList);

                $scope.ControlLevelAccessModalPopup.show();

            });

        }




    }

    $scope.SetRoleWisePageFieldAccess = function (roleWiseFieldAccessList) {

        for (var i = 0; i < roleWiseFieldAccessList.length; i++) {

            for (var j = 0; j < roleWiseFieldAccessList[i].RoleWiseFieldAccessList.length; j++) {

                for (var k = 0; k < $scope.PageControls.length; k++) {


                    var pagefield = $scope.PageControls[k].ObjectPropertiesList.filter(function (el) { return el.ObjectPropertiesId === roleWiseFieldAccessList[i].RoleWiseFieldAccessList[j].ObjectPropertiesId; });
                    if (pagefield.length > 0) {
                        if (roleWiseFieldAccessList[i].RoleWiseFieldAccessList[j].AccessId === 2) {
                            pagefield[0].ViewAccess = true;
                            pagefield[0].ViewAccess = true;
                        }
                        else if (roleWiseFieldAccessList[i].RoleWiseFieldAccessList[j].AccessId === 1) {

                            pagefield[0].EditAccess = true;
                        } else {
                            pagefield[0].ViewAccess = false;
                            pagefield[0].EditAccess = false;
                        }
                        pagefield[0].RoleWiseFieldAccessId = roleWiseFieldAccessList[i].RoleWiseFieldAccessList[j].RoleWiseFieldAccessId;
                    }

                }
            }
        }

        for (var i = 0; i < $scope.RoleObjectPropertyMapping.length; i++) {

            for (var k = 0; k < $scope.PageControls.length; k++) {


                var pagefield = $scope.PageControls[k].ObjectPropertiesList.filter(function (el) { return el.ObjectPropertiesId === $scope.RoleObjectPropertyMapping[i].ObjectPropertiesId; });
                if (pagefield.length > 0) {
                    if ($scope.RoleObjectPropertyMapping[i].AccessId === 2) {
                        pagefield[0].ViewAccess = true;
                        pagefield[0].EditAccess = true;
                    }
                    else if ($scope.RoleObjectPropertyMapping[i].AccessId === 1) {

                        pagefield[0].ViewAccess = true;
                    } else {
                        pagefield[0].ViewAccess = false;
                        pagefield[0].EditAccess = false;
                    }

                }

            }
        }

    }

    $scope.ClosePageControlAccessModalpopup = function () {
        
        $scope.SelectedPageId = 0;
        $scope.ControlLevelAccessModalPopup.hide();
    }

    $scope.SetFieldAction = function (pageId, objectPropertyId, accessId, action) {
        

        var PageDetails = $scope.PageControls.filter(function (el) { return el.ObjectId === pageId; });
        if (PageDetails.length > 0) {

            var objectProperty = PageDetails[0].ObjectPropertiesList.filter(function (el) { return el.ObjectPropertiesId === objectPropertyId; });
            if (objectProperty.length > 0) {
                if (action) {
                    if (accessId === 2) {
                        objectProperty[0].EditAccess = true;
                        objectProperty[0].ViewAccess = true;
                    }
                    else if (accessId === 1) {
                        objectProperty[0].ViewAccess = true;
                    }
                } else {
                    objectProperty[0].EditAccess = false;
                    objectProperty[0].ViewAccess = false;
                }

            }

        }


    }

    $scope.RoleObjectPropertyMapping = [];
    $scope.SavePageControlAccess = function () {
        

        var PageDetails = $scope.selection.filter(function (el) { return el.PageId === $scope.SelectedPageId; });
        if (PageDetails.length > 0) {
            for (var i = 0; i < $scope.PageControls.length; i++) {
                for (var j = 0; j < $scope.PageControls[i].ObjectPropertiesList.length; j++) {
                    $scope.PageControls[i].ObjectPropertiesList[j].IsActive = true;
                    $scope.PageControls[i].ObjectPropertiesList[j].CreatedBy = 1;
                    if ($scope.PageControls[i].ObjectPropertiesList[j].EditAccess === true) {
                        $scope.PageControls[i].ObjectPropertiesList[j].AccessId = 1;
                        $scope.PageControls[i].ObjectPropertiesList[j].AccessId = 2;
                        $scope.RoleObjectPropertyMapping.push($scope.PageControls[i].ObjectPropertiesList[j]);

                    } else if ($scope.PageControls[i].ObjectPropertiesList[j].ViewAccess === true) {
                        $scope.PageControls[i].ObjectPropertiesList[j].AccessId = 1;
                        $scope.RoleObjectPropertyMapping.push($scope.PageControls[i].ObjectPropertiesList[j]);
                    }
                    else {
                        $scope.PageControls[i].ObjectPropertiesList[j].AccessId = 0;
                        $scope.RoleObjectPropertyMapping.push($scope.PageControls[i].ObjectPropertiesList[j]);
                    }
                }

            }
            PageDetails[0].RoleWiseFieldAccessList = $scope.RoleObjectPropertyMapping;
        }
        $scope.ClosePageControlAccessModalpopup();


    }

});