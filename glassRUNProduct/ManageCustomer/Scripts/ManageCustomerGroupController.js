angular.module("glassRUNProduct").controller('ManageCustomerGroupController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageCustomerService) {

    debugger;
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    debugger;

    $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = false;
        } else {
            $rootScope.Throbber = {
                Visible: false,
            };
        }
    };
    $scope.LoadThrobberForPage();

    //$rootScope.EditGroupCode = '999819017_8262020162810';

    $scope.SearchValue = {
        search: '',
        searchItem: ''
    };
    $scope.BeforeFilterBindAllItemList = [];
    /*$rootScope.RedirectionPage = 'app.CustomerGroupList';
    $rootScope.EditGroupCode = '988887703';*/
    $scope.EnebleDisableCustomerpriceGroup = false;
    $scope.DisableButtons = false;
    if ($rootScope.EditGroupCode !== undefined && $rootScope.EditGroupCode !== null && $rootScope.EditGroupCode !== "") {
        $scope.EnebleDisableCustomerpriceGroup = true;
    }
    else {
        $scope.EnebleDisableCustomerpriceGroup = false;
    }
    $scope.BackButtonHide = true;
    $rootScope.IsDataEntered = false;
    $scope.shortAccording = false;
    $scope.CustomerGroup = {
        GroupIdentifier: "",
        GroupCode: "",
        IsActive: ""
    };


    $scope.TotalFilterCount = 0;

    $scope.IsMultipleSortingAllow = false;

    $scope.UpdatedSortList = [];
    $scope.IsFilterIdentifier = false;
    $scope.OpenSingleSortingPopupView = false;
    $scope.OpenSortingPopupView = false;
    $scope.OpenFilteringSelectionPopupView = false;
    $scope.OpenMultipleSortingPopupView = false;


    $scope.SelectedCount = function (customerGroupList) {
        $scope.SelectedCustomerGroupCount = 0;
        var tempList = customerGroupList.filter(function (el) { return el.IsSelectedGroup === true; });
        if (tempList !== undefined) {
            if (tempList.length > 0) {
                $scope.SelectedCustomerGroupCount = tempList.length;
            }
        }
    };

    $scope.LoadGroupCount = function () {

        var d = new Date();
        var dateString = (d.getMonth() + 1) + "" + d.getDate() + "" + d.getFullYear() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();

        $scope.CustomerGroup.GroupCode = $rootScope.CompanyMnemonic + "_" + dateString;

    };

    $scope.SelectedAll = function (Flag) {
        angular.forEach($scope.CustomerGroupDetailsList, function (item) {
            $rootScope.IsDataEntered = true;
            if (Flag === true) {
                item.IsSelectedGroup = true;
            }
            if (Flag === false) {
                item.IsSelectedGroup = false;
            }

        });
        $scope.SelectedCount($scope.CustomerGroupDetailsList);
    };


    $scope.dateformate = function () {
        var months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May',
            'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ];

        function monthNumToName(monthnum) {
            return months[monthnum - 1] || '';
        }
        var today = new Date();
        var dd = today.getDate();
        var yyyy = today.getFullYear();
        var mm = today.getMonth() + 1;
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = dd + '-' + monthNumToName(mm) + '-' + yyyy;
        return today;
    };

    $scope.SaveCustomerGroupDetails = function () {

        $rootScope.Throbber.Visible = true;

        if ($scope.CustomerGroup.GroupIdentifier === undefined || $scope.CustomerGroup.GroupIdentifier === null || $scope.CustomerGroup.GroupIdentifier === "") {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert('Please enter customer group identifier.', '', 3000);
            return false;
        }

        var IsExist = false;
        if (!IsExist) {
            var activeStatus = "1";

            if ($rootScope.EditGroupCode !== undefined && $rootScope.EditGroupCode !== null && $rootScope.EditGroupCode !== "") {
                activeStatus = $scope.CustomerGroup.IsActive;
            }
            else {
                activeStatus = "1";
            }
            var tempList = $scope.CustomerGroupDetailsList.filter(function (el) { return el.IsSelectedGroup === true; });
            var GroupHeader = {
                CustomerPriceGroup: $scope.CustomerGroup.GroupCode,
                CustomerGroupName: $scope.CustomerGroup.GroupIdentifier,
                CompanyCode: $rootScope.CompanyMnemonic,
                GroupCode: $scope.CustomerGroup.GroupCode,
                CompanyId: $rootScope.CompanyId,
                CreatedBy: $rootScope.UserId,
                CreatedDate: $scope.dateformate(),
                IsGroup: "1",
                IsActive: activeStatus,
                NumberOfCustomers: tempList.length,
                CustomerMasterForPricingList: []

            };

            var minmunlength = 1;

            //if ($rootScope.PageLevelConfiguration.IsCustomerSelectionMandatory === true) {
            //    if ($rootScope.PageLevelConfiguration.IsMinMumTwoCustomerSelectionMandatory === true) {
            //        minmunlength = 2;
            //    }
            //}

            if (tempList !== undefined) {
                if (tempList.length >= minmunlength) {

                    var customerGroupList = [];
                    for (var j = 0; j < tempList.length; j++) {

                        if ($rootScope.EditGroupCode !== undefined && $rootScope.EditGroupCode !== null && $rootScope.EditGroupCode !== "") {
                            activeStatus = $scope.CustomerGroup.IsActive;
                        }
                        else {
                            activeStatus = "1";
                        }
                        var cudtomergroupItem = {
                            CompanyId: $rootScope.CompanyId,
                            CustomerPriceGroup: $scope.CustomerGroup.GroupCode,
                            CustomerNumber: tempList[j].CompanyCode,
                            CustomerName: tempList[j].CompanyName,
                            PriorityRating: tempList[j].PriorityRating,
                            CustomerGroupName: tempList[j].CustomerGroupName,
                            CreatedBy: $rootScope.UserId,
                            IsSelectedGroup: tempList[j].IsSelectedGroup,
                            CreatedDate: $scope.dateformate(),
                            CompanyCode: $rootScope.CompanyMnemonic,
                            IsActive: activeStatus
                        };

                        GroupHeader.CustomerMasterForPricingList.push(cudtomergroupItem);

                    }

                    var requestData = {};
                    requestData.ServicesAction = "SaveCustomerGroup";
                    requestData.CustomerGroupList = GroupHeader;
                    var consolidateApiParamater = {
                        Json: requestData
                    };

                    GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                        $scope.ClearControl();
                        $rootScope.Throbber.Visible = false;
                        $location.path('/ManageCustomer');

                    });

                    
                }
                else {

                    $rootScope.Throbber.Visible = false;

                    if (minmunlength === 2) {
                        $rootScope.ValidationErrorAlert($rootScope.resData.res_ManageCustomerGroup_Minimum2customersarerequiredtoformagroup, '', 3000);
                    }
                    else {
                        $rootScope.ValidationErrorAlert($rootScope.resData.res_ManageCustomerGroup_Minimum1customersarerequiredtoformagroup, '', 3000);
                    }
                    

                }
            }
        }
        else {

            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert($rootScope.resData.res_ManageCustomerGroup_ThisCustomerGroupAlreadyExist, '', 3000);         

        }
        
    };

    $scope.functiontofindIndexByKeyValue = function (arraytosearch, key, valuetosearch) {

        for (var i = 0; i < arraytosearch.length; i++) {

            if (arraytosearch[i][key] === valuetosearch) {
                return i;
            }
        }
        return -1;
    };

    $scope.SortingData = function () {
        $scope.shortAccording = !$scope.shortAccording;
    };

    $scope.toggleSelection = function (companyId, isSelectedGroup) {

        var idx = $scope.functiontofindIndexByKeyValue($scope.CustomerGroupDetailsList, "CompanyId", companyId);

        if (idx > -1) {
            $rootScope.IsDataEntered = true;
            $scope.CustomerGroupDetailsList[idx].IsSelectedGroup = !isSelectedGroup;
        }

        $scope.SelectedCount($scope.CustomerGroupDetailsList);
    };

    $scope.LoadCustumerGroupDatafromServer = function () {
        debugger;
        $rootScope.Throbber.Visible = true;

        var requestData = {
            ServicesAction: 'GetCustomerDetailsBySupplier',
            ParentCompanyId: $rootScope.CompanyId

        };

        var consolidateApiParamater =
        {
            Json: requestData
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            if (response.data !== undefined) {
                if (response.data.Json !== undefined) {
                    var Customergroupdata = response.data.Json.CustomerList;

                    if (Customergroupdata.length > 0) {
                        $scope.CustomerGroupDetailsList = Customergroupdata;

                        $scope.TotalCountOfCustomerGroup = Customergroupdata[0].TotalCount;
                        angular.forEach($scope.CustomerGroupDetailsList, function (item) {

                            if (item.IsSelectedCustomerGroup === "1") {
                                item.IsSelectedGroup = false;
                            }
                            if (item.IsSelectedCustomerGroup === "0") {
                                item.IsSelectedGroup = false;
                            }

                        });

                        $scope.LoadData();

                        $scope.SelectedCount($scope.CustomerGroupDetailsList);
                    }
                    else {
                        $scope.CustomerGroupDetailsList = [];
                        $scope.TotalCountOfCustomerGroup = 0;
                        $scope.LoadData();
                        $scope.SelectedCount($scope.CustomerGroupDetailsList);
                    }

                }
                else {
                    $scope.CustomerGroupDetailsList = [];
                    $scope.TotalCountOfCustomerGroup = 0;
                    $scope.LoadData();
                    $scope.SelectedCount($scope.CustomerGroupDetailsList);
                }
                $rootScope.Throbber.Visible = false;
            }
            else {
                $scope.CustomerGroupDetailsList = [];
                $scope.TotalCountOfCustomerGroup = 0;
                $scope.LoadData();
                $scope.SelectedCount($scope.CustomerGroupDetailsList);
            }
            $rootScope.Throbber.Visible = false;
        });

    };

    $scope.LoadCustumerGroupDatafromServer();

    $scope.EditCustomerGroup = function (GroupIdentifierCode) {

        var requestData = {
            CustomerPriceGroup: GroupIdentifierCode
        };

        ManageCustomerService.EditCustomerGroup(requestData).then(function (response) {
            if (response.data !== undefined) {
                if (response.data !== null) {
                    var Customergroupdata = response.data;
                    $scope.CustomerGroup.GroupCode = Customergroupdata[0].CustomerPriceGroup;

                    $scope.CustomerGroup.IsActive = Customergroupdata[0].IsActive;

                    $scope.CustomerGroup.GroupIdentifier = Customergroupdata[0].CustomerGroupName;

                    for (var i = 0; i < Customergroupdata[0].CustomerMasterForPricingList.length; i++) {

                        var idx = $scope.functiontofindIndexByKeyValue($scope.CustomerGroupDetailsList, "CompanyCode", Customergroupdata[0].CustomerMasterForPricingList[i].CustomerNumber);

                        if (idx > -1) {

                            $scope.CustomerGroupDetailsList[idx].IsSelectedGroup = true;
                        }
                    }

                    $scope.SelectedCount($scope.CustomerGroupDetailsList);
                }
                $rootScope.Throbber.Visible = false;
            }
            $rootScope.Throbber.Visible = false;
        });

    };

    $scope.LoadData = function () {
        if ($rootScope.EditGroupCode !== undefined && $rootScope.EditGroupCode !== null && $rootScope.EditGroupCode !== "") {
            $scope.EditCustomerGroup($rootScope.EditGroupCode);
        }
        else {
            $scope.LoadGroupCount();
        }
    };


    /*Vinod Yadav : 04-11-2019*/
    $scope.OpenActivePopupEvent = function (popupVisibility) {
        $rootScope.ActivePagePopupAndOverlay = popupVisibility;
    };

    /*Vinod Yadav : 04-11-2019*/
    $scope.ActivePopupOKButtonEvent = function () {
        $rootScope.ActivePagePopupAndOverlay = false;
    };

    /*Vinod Yadav : 04-11-2019*/
    $scope.GoToPageRequested = function () {
        $rootScope.ActivePagePopupAndOverlay = false;
        $rootScope.IsDataEntered = false;
        $state.go($rootScope.RedirectionPage);
    };

    $scope.CancelButtonClick = function () {
        if ($rootScope.IsDataEntered === true) {
            $scope.OpenActivePopupEvent(true);
            $rootScope.Throbber.Visible = false;
            return false;
        }
        else {
            $rootScope.IsDataEntered = false;
            $state.go($rootScope.RedirectionPage);
        }
    };

    $scope.Changetext = function () {
        $rootScope.IsDataEntered = true;
    };

    $scope.ClearControl = function () {

        $rootScope.EditGroupCode = "";
        $scope.CustomerGroup = {
            GroupIdentifier: "",
            GroupCode: "",
            IsActive: ""
        };

        angular.forEach($scope.CustomerGroupDetailsList, function (item) {

            item.IsSelectedGroup = false;

        });

    };

    $scope.GoToBackPage = function () {
        $scope.ClearControl();
        $location.path('/ManageCustomer');
    };

});