angular.module("glassRUNProduct").controller('AddPageAndControlAccess', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, GrRequestService) {
    

    
    $rootScope.PageDetails = [];


    $rootScope.LoadAllPages = function () {
        

       


        var requestData =
        {
            ServicesAction: 'GetPageRoleWiseAccessDetailByRoleORUserID',
            RoleId: 0
        };
        var jsonobject = {};
        jsonobject.Json = requestData;

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

           
            if (response.data != undefined) {
                $rootScope.PageDetails = response.data.Json.RoleWisePageMappingList;

                for (var i = 0; i < $rootScope.PageDetails.length; i++) {

                    if ($rootScope.PageDetails[i].IsActive == "1") {

                        $rootScope.PageDetails[i].IsActive = true;
                    } else {
                        $rootScope.PageDetails[i].IsActive = false;

                    }
                }
            }
            
        });
    }
    $rootScope.LoadAllPages();


    $rootScope.selection = [];
    $rootScope.toggleSelection = function (pageId, action, accessId, roleWisePageMappingId, roleWiseFieldControlAccess) {
        
        if (action) {
            var selectedSection = $rootScope.selection.filter(function (el) { return el.PageId === pageId; });
            if (selectedSection.length > 0) {
                selectedSection[0].AccessId = accessId;
                selectedSection[0].IsActive = true;
                selectedSection[0].CreatedBy = $rootScope.UserId;
            } else {
                var pageMappingData = {
                    PageId: pageId,
                    AccessId: accessId,
                    RoleWisePageMappingId: roleWisePageMappingId,
                    RoleWiseFieldAccessList: roleWiseFieldControlAccess,
                    IsActive: true,
                    CreatedBy: $rootScope.UserId
                };

                $rootScope.selection.push(pageMappingData);
            }
        } else {

            if ($rootScope.EditRoleMasterId != "" && $rootScope.EditRoleMasterId != 0) {
                var selectedSection = $rootScope.selection.filter(function (el) { return el.PageId === pageId; });
                if (selectedSection.length > 0) {
                    selectedSection[0].IsActive = false;
                }
            } else {
                var idx = $scope.functiontofindIndexByKeyValue($rootScope.selection, "PageId", pageId);
                if (idx > -1) {
                    $rootScope.selection.splice(idx, 1);
                }
            }

        }

        
        var accessaddFilter = $rootScope.PageDetails.filter(function (el) { return el.PageId === pageId; });

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

    


    $scope.SetSelectedRow = function (page) {
        

        page.IsSelectedRow = true;


    }

});