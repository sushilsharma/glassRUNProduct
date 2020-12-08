angular.module("glassRUNProduct").directive('pageAccessComponent', function (Logger) {
    return {
        restrict: 'E',
        scope: {
            accordingBy: '@',
            resData: '=',
            roleId: '=?roleId',
            userId: '=?userId',

        },
        templateUrl: 'Directives/PageAccessComponent/PageAccessComponentView.html',
        controller: function ($scope, $rootScope, $ionicModal, GrRequestService) {


            $scope.PageDetailList = [];


            $scope.LoadAllPages = function () {

                debugger;
                var requestData = {};

                //Sushil Sharma 20-9-2019
                //Clear record.
                $scope.PageDetailList = [];
                $rootScope.PageDetails = [];
                if ($scope.accordingBy == "RoleWise") {

                    //  requestData.ServicesAction = 'GetPageDetailListByRoleORUserID';
                    requestData.ServicesAction = 'GetPageRoleWiseAccessDetailByRoleORUserID';
                    requestData.RoleId = $scope.roleId;
                }
                else if ($scope.accordingBy == "UserWise") {

                    requestData.ServicesAction = 'GetPageRoleWiseAccessDetailByRoleORUserID';
                    // requestData.ServicesAction = 'GetPageDetailListByRoleORUserID';


                    if ($scope.userId == 0) {

                        requestData.RoleId = $scope.roleId;

                    } else {
                        requestData.RoleId = $scope.roleId;
                        requestData.UserId = $scope.userId;
                    }

                }


                var jsonobject = {};
                jsonobject.Json = requestData;

                GrRequestService.ProcessRequest(jsonobject).then(function (response) {


                    if (response.data != undefined) {
                        $scope.PageDetailList = response.data.Json.RoleWisePageMappingList;

                        debugger;
                        for (var i = 0; i < $scope.PageDetailList.length; i++) {

                            if ($scope.PageDetailList[i].IsActive == "1") {

                                $scope.PageDetailList[i].IsActive = true;
                            } else {
                                $scope.PageDetailList[i].IsActive = false;

                            }

                        }


                        $rootScope.PageDetails = $scope.PageDetailList;
                        //alert(JSON.stringify($scope.PageDetailList));
                        //console.log(JSON.stringify($scope.PageDetailList));
                    }

                });
            }
            $scope.LoadAllPages();


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



            $ionicModal.fromTemplateUrl('templates/ControlLevelAccess.html', {
                scope: $scope,
                animation: 'fade-in-scale',
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function (modal) {

                $scope.ControlLevelAccessModalPopup = modal;
            });



            $scope.OpenPageControlAccessModalpopup = function (PageId) {



                var Page = $scope.PageDetailList.filter(function (el) { return el.PageId === PageId; });
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

                var Page = $scope.PageDetailList.filter(function (el) { return el.PageId === $scope.SelectedPageId; })

                if (Page.length != 0) {
                    Page[0].RoleWiseFieldAccessList = $scope.PageControlList;
                }

                $scope.ClosePageControlAccessModalpopup();
            }

        }
    }
})


