angular.module("glassRUNProduct").controller('ManageCustomerController', function ($scope, $rootScope, $q, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageOrderService) {
    debugger;
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.IsSortByAsc = false;
    var urlhost = $location.url();
    var URLSplit1 = urlhost.split("/");
    var controllerName1 = '';
    if (URLSplit1.length > 0) {
        controllerName1 = URLSplit1[URLSplit1.length - 1];
    }

    $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        };
    }

    $rootScope.PropertyType = {
        parseInt: parseInt,
        String: String,
        parseFloat: parseFloat,
        Date: new Date
    };

    $rootScope.FilterParameters = [{
        ChildFilterList: [],
        ControllerName: controllerName1,
        FilterDescription: "Outlet Type",
        FilterMasterId: "38",
        IsRange: "0",
        PageURL: controllerName1,
        PropertyName: "CustomerGroupName",
        PropertyType: "String",
        ResourceKey: "1101"
    }];

    var getFilterCategory = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'CustomerType'; });
    if (getFilterCategory.length > 0) {
        for (var i = 0; i < getFilterCategory.length; i++) {
            var filterJson = {
                FilterDescription: getFilterCategory[i].Name,
                FilterMasterId: getFilterCategory[i].LookUpId,
                IsRange: "0",
                ParentFilterMasterId: "38",
                PropertyName: "CustomerGroupName",
                PropertyType: "String",
                ResourceValue: getFilterCategory[i].Name
            };
            $rootScope.FilterParameters[0].ChildFilterList.push(filterJson);
        }
    };


    $rootScope.generateSortFn = function (props) {

        return function (a, b) {

            for (var i = 0; i < props.length; i++) {

                var prop = props[i];
                var name = prop.name;
                var reverse = prop.reverse;
                if (prop.primer === 'Date') {
                    var PropertyType = prop.primer;
                    if (PropertyType === undefined) {
                        PropertyType = String;
                    }

                    var first = new Date(a[name]);
                    var second = new Date(b[name]);
                } else {
                    var PropertyType = $rootScope.PropertyType[prop.primer];
                    if (PropertyType === undefined) {
                        PropertyType = String;
                    }

                    var first = PropertyType(a[name]);
                    var second = PropertyType(b[name]);
                }


                if (first < second)
                    return reverse ? 1 : -1;
                if (first > second)
                    return reverse ? -1 : 1;
            }
            return 0;
        };
    };


    $scope.SortCustomerName = function () {
        if ($scope.IsSortByAsc === false) {
            $scope.IsSortByAsc = true;
        } else {
            $scope.IsSortByAsc = false;
        }

        $scope.CustomerList.sort($rootScope.generateSortFn([{ name: "CompanyName", reverse: $scope.IsSortByAsc, primer: "String" }]));
        $scope.GroupCustomerList = $scope.GetCustomerList();

    }


    $scope.SortCustomerGroupName = function () {
        if ($scope.IsSortByAsc === false) {
            $scope.IsSortByAsc = true;
        } else {
            $scope.IsSortByAsc = false;
        }

        $scope.GroupCustomerList.sort($rootScope.generateSortFn([{ name: "CustomerGroupName", reverse: $scope.IsSortByAsc, primer: "String" }]));

    }

    $scope.SelectedTabIndex = 1;
    $scope.ChangeTabIndex = 1;
    $scope.ActiveTab = function (index) {
        $scope.ChangeTabIndex = index;
        $scope.SelectedTabIndex = index;
        $scope.IsSortByAsc = false;
        $scope.ClearSearch();

        if ($scope.SelectedTabIndex === 2) {
            $scope.LoadCustomerGroupData();
        }
        else {
            $scope.LoadCustomersData();
            $scope.IsExpandAll = false;

        }


    };

    $rootScope.SearchRecord = function (searchText, searchJson, uniqueKey, SearchRecord) {

        var returnJson = [];

        if (searchText !== '' && searchText !== undefined && searchJson.length > 0) {

            var searchstrings = searchText.split(" ");
            var FilterJson = [];
            searchstrings.forEach(function (needle) {

                var re1 = new RegExp(needle, 'gi');
                var matches = searchJson.filter(matcher(re1, needle, SearchRecord));

                for (var i = 0; i < matches.length; i++) {

                    var chkRecord = FilterJson.filter(function (el) {
                        return el[uniqueKey] === matches[i][uniqueKey];
                    });
                    if (chkRecord.length === 0) {
                        FilterJson.push(matches[i]);
                    }

                }

            });

            //returnJson = DistinctRecords(FilterJson, uniqueKey);
            returnJson = FilterJson;
        } else {

            returnJson = searchJson;
        }

        return returnJson;
    };
    $rootScope.FilterJsonData = function (filterParameters, jsonObject) {

        var keysWithMinMax = [];

        var filter = {};
        for (var i = 0; i < filterParameters.length; i++) {

            var PropertyType = filterParameters[i].PropertyType;
            var PropertyName = filterParameters[i].PropertyName;
            var IsRange = filterParameters[i].IsRange;


            if (PropertyType === 'parseInt') {
                if (IsRange === '1') {
                    filter[PropertyName] = {};
                    keysWithMinMax.push(PropertyName);
                } else {

                    filter[PropertyName] = [];
                }
            }
            if (PropertyType === 'Date') {
                filter[PropertyName] = {};
                keysWithMinMax.push(PropertyName);
            } else {
                filter[PropertyName] = [];
            }

            for (var k = 0; k < filterParameters[i].ChildFilterList.length; k++) {
                if (filterParameters[i].ChildFilterList[k].Selected) {





                    var ContPropertyType = $rootScope.PropertyType[PropertyType];


                    if (ContPropertyType === undefined) {
                        ContPropertyType = String;
                    }


                    if (PropertyType === 'parseInt') {

                        var value = ContPropertyType(filterParameters[i].ChildFilterList[k].FilterDescription);

                        var FromRange = null;
                        var ToRange = null;
                        if (filterParameters[i].ChildFilterList[k].FromRange !== undefined) {
                            FromRange = ContPropertyType(filterParameters[i].ChildFilterList[k].FromRange);
                        }

                        if (filterParameters[i].ChildFilterList[k].ToRange !== undefined) {
                            ToRange = ContPropertyType(filterParameters[i].ChildFilterList[k].ToRange);
                        }

                        if (IsRange === '1') {
                            filter[PropertyName].min = FromRange;
                            filter[PropertyName].max = ToRange;
                            filter[PropertyName].PropertyType = PropertyType;
                        } else {
                            filter[PropertyName].push(value);
                        }

                    }
                    if (PropertyType === 'Date') {

                        var value = new Date('01-Jan-2000');

                        var FromRange = null;
                        var ToRange = null;
                        if (filterParameters[i].ChildFilterList[k].FromRange !== undefined && filterParameters[i].ChildFilterList[k].FromRange !== null && filterParameters[i].ChildFilterList[k].FromRange !== '') {
                            FromRange = new Date(filterParameters[i].ChildFilterList[k].FromRange);
                            filter[PropertyName].min = FromRange;
                        }

                        if (filterParameters[i].ChildFilterList[k].ToRange !== undefined && filterParameters[i].ChildFilterList[k].ToRange !== null && filterParameters[i].ChildFilterList[k].ToRange !== '') {
                            ToRange = new Date(filterParameters[i].ChildFilterList[k].ToRange);
                            filter[PropertyName].max = ToRange;
                        }

                        //if (FromRange !== null && ToRange !== null)
                        //{
                        //    filter[PropertyName].min = FromRange;
                        //    filter[PropertyName].max = ToRange;
                        //}
                        filter[PropertyName].PropertyType = PropertyType;


                    } else {
                        var value = ContPropertyType(filterParameters[i].ChildFilterList[k].FilterDescription);

                        var FromRange = null;
                        var ToRange = null;
                        if (filterParameters[i].ChildFilterList[k].FromRange !== undefined) {
                            FromRange = ContPropertyType(filterParameters[i].ChildFilterList[k].FromRange);
                        }

                        if (filterParameters[i].ChildFilterList[k].ToRange !== undefined) {
                            ToRange = ContPropertyType(filterParameters[i].ChildFilterList[k].ToRange);
                        }

                        filter[PropertyName].push(value);
                    }
                }
            }
        }


        var query = $rootScope.buildFilter(filter);
        var result = $rootScope.filterData(jsonObject, query, keysWithMinMax);
        return result;
    };
    $rootScope.buildFilter = function (filter) {

        var query = {};
        for (var keys in filter) {
            if ((filter[keys].constructor === Object) || (filter[keys].constructor === Array && filter[keys].length > 0)) {
                query[keys] = filter[keys];
            }
        }
        return query;
    };
    $rootScope.filterData = function (data, query, keysWithMinMax) {

        const filteredData = [];
        console.log("enter in filter data section");
        if (data !== undefined && data !== null && data !== "") {

            for (var i = 0; i < data.length; i++) {
                var checkrecord = true;
                var item = data[i];

                for (var key in query) {
                    if (item[key] === undefined) {
                        checkrecord = false;
                    } else if (keysWithMinMax.includes(key)) {

                        var PropertyType = (query[key]['PropertyType']);
                        if (PropertyType === 'parseInt') {
                            var min = parseFloat(query[key]['min']);
                            var value = parseFloat(item[key]);
                            var max = parseFloat(query[key]['max']);

                            if (min !== null && min !== NaN && value < min) {
                                checkrecord = false;
                            }

                            if (max !== null && max !== NaN && value > max) {
                                checkrecord = false;
                            }
                        }

                        if (PropertyType === 'Date') {
                            var min = new Date(query[key]['min']);
                            min.setHours(0, 0, 0, 0);

                            var value = new Date(item[key]);
                            value.setHours(0, 0, 0, 0);

                            var max = new Date(query[key]['max']);
                            max.setHours(0, 0, 0, 0);

                            if (min !== null && min !== NaN && value < min) {
                                checkrecord = false;
                            }

                            if (max !== null && max !== NaN && value > max) {
                                checkrecord = false;
                            }

                            if (max !== null && max !== NaN && value == max) {
                                checkrecord = false;
                            }
                        }





                    } else if (!query[key].includes(item[key])) {
                        checkrecord = false;
                    }
                }

                if (checkrecord) {

                    filteredData.push(data[i]);
                }

            }


        }

        return filteredData;
    };

    $scope.ShowQuickActionPopOver = function (childCustomer, Customer) {


        var OpenOuickActionList = Customer.ChildCustomer.filter(function (el) {
            return el.ShowQuickAction === true && el.CompanyMnemonic !== childCustomer.CompanyMnemonic;
        });
        if (OpenOuickActionList.length > 0) {
            for (var k = 0; k < OpenOuickActionList.length; k++) {
                OpenOuickActionList[k].ShowQuickAction = false;
            }
        }

        if (childCustomer.ShowQuickAction !== true) {
            childCustomer.ShowQuickAction = true;
        } else {
            childCustomer.ShowQuickAction = false;
        }

    };


    $scope.SearchValue = {
        search: '',
        searchItem: ''
    };
    $scope.BeforeFilterBindAllItemList = [];
    $scope.OrgBindAllItemList = [];
    $scope.urlhost = $location.url();
    var URLSplit = $scope.urlhost.split("/");
    var controllerName = '';
    if (URLSplit.length > 0) {
        controllerName = URLSplit[URLSplit.length - 1];
    }
    $scope.SearchValue = {
        search: '',
        searchItem: ''
    };
    $scope.TotalChildCustcount = 0;
    $scope.TotalCustcountAccordingtoSearch = 0;
    $scope.TotalFilteredItemCount = 0;
    $scope.sortAccording = false;
    $scope.defaultSorting = true;
    $scope.DisableButtons = false;
    $scope.OpenConfirmationPopup = false;
    $scope.CustomerList = [];
    $scope.GroupCustomerList = [];

    $scope.ManageCustomersList = [];

    $scope.CustomerGroupList = [];

    $scope.DoItLaterPopup = false;

    $rootScope.CheckForPageAccessDetails = function () {
        if ($rootScope.PageLevelConfiguration.ShowIconOnButton !== undefined && $rootScope.PageLevelConfiguration.ShowIconOnButton !== null) {
            if ($rootScope.PageLevelConfiguration.ShowIconOnButton === true) {
                $scope.ShowIconOnButton = true;
            }
            else {
                $scope.ShowIconOnButton = false;
            }
        }
        else {
            $scope.ShowIconOnButton = false;
        }
        if ($rootScope.PageLevelConfiguration.ShowLocationInformationforcutomerPage !== undefined && $rootScope.PageLevelConfiguration.ShowLocationInformationforcutomerPage !== null) {

            if ($rootScope.PageLevelConfiguration.ShowLocationInformationforcutomerPage === true) {
                $scope.ShowLocationInformation = "1";
            }
            else {
                $scope.ShowLocationInformation = "0";
            }

        }
        else {
            $scope.ShowLocationInformation = "0";
        }

    };
    $scope.$evalAsync(

        // $rootScope.LoadPageControleConfiguration(controllerName)


    );
    $rootScope.IsDataEntered = false;
    $scope.IsShowAllCustomer = false;

    $rootScope.CheckForPageControleAccessDetails = function () {

        $scope.ShowIconOnButton = true;

        if ($rootScope.pageContrlAcessData.DescriptionPopup != '0') {
            /*$rootScope.OpenMessagePopupEvent(true, String.format($rootScope.resData.res_ManageCustomer_DescriptionPopupMsg), 'OK');*/
            if ($rootScope.IsRedirectFromMenutoPage !== true) {
                $scope.OpenConfirmationPopup = true;
            }
        }

    };


    $scope.SearchList = function () {

        var searchText = $scope.SearchValue.search;

        if ($scope.BeforeFilterBindAllItemList.length === 0) {
            $scope.BeforeFilterBindAllItemList = angular.copy($scope.CustomerList);
        } else {

            $scope.CustomerList = $scope.BeforeFilterBindAllItemList;
        }

        var searchOnField = ['CompanyName'];

        var jsonObjectList = $scope.CustomerList;
        $scope.CustomerList = $rootScope.SearchRecord(searchText, jsonObjectList, 'CompanyId', searchOnField);

        $scope.GroupCustomerList = $scope.GetCustomerList();

        $scope.AfterFilterBindAllItemList = angular.copy($scope.CustomerList);

        $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

        if ($scope.CustomerList.length === $scope.OrgBindAllItemList.length) {
            $scope.TotalFilteredItemCount = 0;
        }
        else {
            $scope.TotalFilteredItemCount = $scope.CustomerList.length;
        }

        $scope.GetFilterRecord();
    };




    $scope.ClearSearch = function () {
        $scope.SearchValue.search = "";
        $scope.SearchList();
    };

    /* Vinod Yadav: 25-11-2019 
    For Filter and sorting*/
    $scope.TotalFilterCount = 0;

    $rootScope.GetSettingValue = function (SettingParameter) {
        var settingvalue = "0";
        if ($sessionStorage.AllSettingMasterData != undefined) {
            var redirectTime = $sessionStorage.AllSettingMasterData.filter(function (el) {
                return el.SettingParameter === SettingParameter;
            });
            if (redirectTime.length > 0) {
                settingvalue = redirectTime[0].SettingValue;
            }
        }
        return settingvalue;
    };

    var SettingValue = $rootScope.GetSettingValue('IsMultipleSortingAllow');
    if (SettingValue == '1') {
        $scope.IsMultipleSortingAllow = true;
    }
    else {
        $scope.IsMultipleSortingAllow = false;
    }

    $scope.UpdatedSortList = [];
    $scope.IsFilterIdentifier = false;
    $scope.OpenSingleSortingPopupView = false;
    $scope.OpenSortingPopupView = false;
    $scope.OpenFilteringSelectionPopupView = false;
    $scope.OpenMultipleSortingPopupView = false;

    $scope.OpenCustomerList = function (customerInfo) {

        if (customerInfo.ShowCustomerList !== undefined) {
            if (customerInfo.ShowCustomerList === false) {
                customerInfo.ShowCustomerList = true;
            } else {
                customerInfo.ShowCustomerList = false;
            }
        } else {
            customerInfo.ShowCustomerList = true;
        }
        $scope.TotalCustomercount(true);
    };

    $scope.IsExpandAll = false;

    $scope.ExpanCollapseCustomerList = function () {

        if ($scope.IsExpandAll) {

            angular.forEach($scope.GroupCustomerList, function (item) {

                item.ShowCustomerList = false;

            });

            $scope.IsExpandAll = false;

        }
        else {

            angular.forEach($scope.GroupCustomerList, function (item) {

                item.ShowCustomerList = true;

            });

            $scope.IsExpandAll = true;

        }



        $scope.TotalCustomercount(true);
    };


    $scope.showAccordionCustomerList = true;
    $scope.SortingData = function () {
        $scope.showAccordionCustomerList = !$scope.showAccordionCustomerList;
        /* $scope.TotalCustomercount(false);*/
    };

    /* $scope.showfiltersection = false;*/

    $scope.FilterButton = function () {

    };
    /*Created by vinod yadav
    on 25-10-2019*/
    $scope.GetAllCustomerDetails = function () {
        $rootScope.Throbber.Visible = true;
        var requestData = {
            ServicesAction: 'GetAllCustomerListB2BApp',
            CompanyId: $rootScope.ReferenceId,
            RoleId: $rootScope.UserData.RoleMasterId.trim(),
            UserId: $rootScope.UserId,
            PageName: controllerName
        };

        var consolidateApiParamater =
        {
            Json: requestData
        };


        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            if (response.data !== undefined && response.data !== null) {
                if (response.data.Json !== undefined) {
                    var Customerset = response.data.Json.CustomerList;
                    $scope.CustomerList = Customerset;
                    $scope.OrgBindAllItemList = angular.copy($scope.CustomerList);

                    angular.forEach($scope.CustomerList, function (item) {
                        if (item.ShowCustomerListflag === "1") {
                            item.ShowCustomerList = true;
                        }
                        if (item.ShowCustomerListflag === "0") {
                            item.ShowCustomerList = false;
                        }
                        item.IsSynced = "1";
                    });

                    $scope.GroupCustomerList = $scope.GetCustomerList();

                    /*$scope.ValidateData();*/

                    $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

                    if ($scope.CustomerList.length === $scope.OrgBindAllItemList.length) {
                        $scope.TotalFilteredItemCount = 0;
                    }
                    else {
                        $scope.TotalFilteredItemCount = $scope.CustomerList.length;
                    }
                    /*$scope.GettotalCustomercount($scope.CustomerList);*/

                    if ($scope.CustomerList.length > 0) {
                        $scope.SaveCustomer(false);
                    }
                    $rootScope.Throbber.Visible = false;
                }
                else {
                    $scope.CustomerList = [];
                    $scope.GroupCustomerList = $scope.GetCustomerList();
                    $scope.TotalChildCustcount = 0;
                    $scope.TotalFilteredItemCount = 0;
                    $rootScope.Throbber.Visible = false;
                }

            }

            else {

                $scope.CustomerList = [];
                $scope.GroupCustomerList = $scope.GetCustomerList();
                $scope.TotalChildCustcount = 0;
                $scope.TotalFilteredItemCount = 0;
                $rootScope.Throbber.Visible = false;
            }
        });

    };

    $scope.LoadCustomersAndCustomerGroupData = function () {

        $rootScope.Throbber.Visible = true;


        var customerGroupsJson = {
            CompanyId: $rootScope.CompanyId
        };
        var CustomerGroupApi = ManageOrderService.LoadCustomerGroup(customerGroupsJson);

        var requestData = {
            ServicesAction: 'GetAllCustomerListB2BApp',
            CompanyId: $rootScope.CompanyId,
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            PageName: controllerName
        };

        var consolidateApiParamater =
        {
            Json: requestData
        };


        var customerApi = GrRequestService.ProcessRequest(consolidateApiParamater);


        $q.all([
            CustomerGroupApi,
            customerApi
        ]).then(function (resp) {
            debugger;

            if (resp[1] !== undefined && resp[1] !== "" && resp[1] !== null) {
                if (resp[1].data !== undefined && resp[1].data !== "" && resp[1].data !== null) {
                    var CustomersList = resp[1].data.Json.CustomerList;

                    $scope.ManageCustomersList = angular.copy(CustomersList);
                    $scope.CustomerList = CustomersList;
                    $scope.OrgBindAllItemList = angular.copy($scope.CustomerList);
                    $scope.GroupCustomerList = $scope.GetCustomerList();
                    $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

                    if ($scope.CustomerList.length === $scope.OrgBindAllItemList.length) {
                        $scope.TotalFilteredItemCount = 0;
                    }
                    else {
                        $scope.TotalFilteredItemCount = $scope.CustomerList.length;
                    }

                } else {
                    $scope.ManageCustomersList = [];
                    $scope.CustomerList = [];
                    $scope.OrgBindAllItemList = [];
                    $scope.GroupCustomerList = [];
                    $scope.TotalChildCustcount = 0;
                }
            } else {
                $scope.ManageCustomersList = [];
                $scope.CustomerList = [];
                $scope.OrgBindAllItemList = [];
                $scope.GroupCustomerList = [];
                $scope.TotalChildCustcount = 0;
            }


            if (resp[0] !== undefined && resp[0] !== "" && resp[0] !== null) {
                if (resp[0].data !== undefined && resp[0].data !== "" && resp[0].data !== null) {
                    $scope.CustomerGroups = resp[0].data;
                }
                else {
                    $scope.CustomerGroups = [];
                }
            } else {
                $scope.CustomerGroups = [];
            }


            $rootScope.Throbber.Visible = false;

        });



    };

    $scope.LoadCustomersData = function () {

        $rootScope.Throbber.Visible = true;

        $scope.CustomerList = angular.copy($scope.ManageCustomersList);

        $scope.OrgBindAllItemList = angular.copy($scope.CustomerList);

        $scope.GroupCustomerList = $scope.GetCustomerList();

        $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

        if ($scope.CustomerList.length === $scope.OrgBindAllItemList.length) {
            $scope.TotalFilteredItemCount = 0;
        }
        else {
            $scope.TotalFilteredItemCount = $scope.CustomerList.length;
        }

        $rootScope.Throbber.Visible = false;

    };


    $scope.LoadCustomerGroupData = function () {

        $rootScope.Throbber.Visible = true;
        $scope.GroupCustomerList = angular.copy($scope.CustomerGroups);
        $scope.OrgBindAllItemList = angular.copy($scope.CustomerGroups);
        $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

        $rootScope.Throbber.Visible = false;

    };

    /*Created by vinod yadav 05-11-2019
  
    */
    $scope.PriorityList = [{
        Id: '1'
    },
    {
        Id: '2'
    }, {
        Id: '3'
    }];



    /*Created by vinod yadav 05-11-2019
 
    */
    $scope.SetPriorityColor = function (id, setValue) {


        var className = false;

        if (id <= setValue) {
            className = true;
        } else {
            className = false;
        }

        return className;

    };



    /*Created by vinod yadav 06-11-2019
Total Count
  */
    $scope.GettotalCustomercount = function (CustList) {
        var TotalChildCustcount = 0;
        var parentlist = CustList;
        if (parentlist.length > 0) {
            for (var i = 0; i < parentlist.length; i++) {
                var childCust = parentlist[i].ChildCustomer;
                if (childCust.length > 0) {
                    TotalChildCustcount = TotalChildCustcount + childCust.length;
                }

            }
        }

        $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

        if (TotalChildCustcount === $scope.OrgBindAllItemList.length) {
            $scope.TotalFilteredItemCount = 0;
        }
        else {
            $scope.TotalFilteredItemCount = TotalChildCustcount;
        }

    };

    $scope.TotalCustomercount = function (IsClickaccordion) {
        var TotalCustcountAccordingtoSearch = 0;
        var parentlist = [];
        if (IsClickaccordion) {
            parentlist = $scope.GroupCustomerList;
            if (parentlist.length > 0) {

                var data = parentlist.filter(function (el) { return el.ShowCustomerList === true; });
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var childCust = data[i].ChildCustomer;
                        if (childCust.length > 0) {
                            TotalCustcountAccordingtoSearch = TotalCustcountAccordingtoSearch + childCust.length;
                        }

                    }
                }

            }

        }
        else {
            parentlist = $scope.CustomerList;
            if (parentlist.length > 0) {
                for (var j = 0; j < parentlist.length; j++) {
                    var childCust1 = parentlist[j].ChildCustomer;
                    if (childCust1.length > 0) {
                        TotalCustcountAccordingtoSearch = TotalCustcountAccordingtoSearch + childCust1.length;
                    }

                }


            }
        }


        $scope.TotalCustcountAccordingtoSearch = TotalCustcountAccordingtoSearch;
    };
    /*Created by vinod yadav 06-11-2019
Valodation
   */
    $scope.ValidateData = function () {

        $rootScope.Throbber.Visible = true;
        var IsValidate = false;
        if ($rootScope.PageLevelConfiguration.IsSetPriorityMandatory === true) {

            if ($scope.OrgBindAllItemList.length > 0) {

                var childData = $scope.OrgBindAllItemList;

                var ChildCustomer = childData.filter(function (el) { return el.PriorityRating !== '0'; });
                if (ChildCustomer.length === 0) {
                    $rootScope.OpenMessagePopupEvent(true, "Please Select priority.", 'OK');
                    $rootScope.Throbber.Visible = false;
                    IsValidate = false;
                    return false;
                }
                else {
                    IsValidate = true;
                }

            }

            if (IsValidate) {
                if ($rootScope.IsRedirectFromMenutoPage === true) {
                    if (IsNetworkStatus() === true) {

                        $scope.SaveCustomerFromServer();
                    }
                    else {

                        $rootScope.OpenMessagePopupEvent(true, $rootScope.resData.res_ManageCustomer_Youareinofflineyourdatawillnotsaved, 'OK');
                        $rootScope.Throbber.Visible = false;
                        return false;
                    }
                }
                else {
                    $scope.SaveCustomer(true);
                }

            }

        }
        else {

            if ($rootScope.IsRedirectFromMenutoPage === true) {
                if (IsNetworkStatus() === true) {

                    $scope.SaveCustomerFromServer();
                }
                else {

                    $rootScope.OpenMessagePopupEvent(true, $rootScope.resData.res_ManageCustomer_Youareinofflineyourdatawillnotsaved, 'OK');
                    $rootScope.Throbber.Visible = false;
                    return false;
                }
            }
            else {
                $scope.SaveCustomer(true);
            }
        }

    };
    /*Created by vinod yadav 06-11-2019
Save Data from sqllite
   */
    $scope.SaveCustomer = function (ISbuttonClick) {
        var IsSynceddata = "0";

        if ($scope.OrgBindAllItemList.length > 0) {

            if (ISbuttonClick === true) {
                IsSynceddata = "0";
                angular.forEach($scope.OrgBindAllItemList, function (item) {

                    item.IsSynced = "0";

                });
            }

            else {
                IsSynceddata = "1";
            }

            for (var i = 0; i < $scope.OrgBindAllItemList.length; i++) {
                var custData = angular.copy($scope.CustomerList);
                custData = custData.filter(function (el) { return el.ParentCompanyId === $scope.OrgBindAllItemList[i].ParentCompanyId && el.CompanyId === $scope.OrgBindAllItemList[i].CompanyId; });
                if (custData.length > 0) {
                    $scope.OrgBindAllItemList[i].PriorityRating = custData[0].PriorityRating;
                }
            }

            angular.forEach($scope.OrgBindAllItemList, function (item) {
                item.ModifiedBy = $rootScope.UserId;
            });

            var CustomerData = JSON.stringify($scope.OrgBindAllItemList);

            offlineDB.transaction(function (tx) {

                if (CustomerData.length !== 0) {
                    tx.executeSql("delete from Customers where UserId=? ", [$rootScope.UserId]);
                    tx.executeSql("INSERT INTO Customers (JsonDescription,IsSyncedCompleted,UserId) VALUES (?,?,?) ", [CustomerData, IsSynceddata, $rootScope.UserId]);
                }

            }, function (error) {

                console.log('transaction error: ' + error.message);

            }, function () {

                $scope.$apply(function () {
                    if (ISbuttonClick === true) {
                        $rootScope.IsDataEntered = false;
                        $rootScope.LoadPageAccordingWorkFlow('app.ManageFavourites', $rootScope.UserData, 0);
                    }
                    $rootScope.Throbber.Visible = false;
                });

            });
        }
        else {

            if (ISbuttonClick === true) {
                $rootScope.IsDataEntered = false;
                $rootScope.LoadPageAccordingWorkFlow('app.ManageFavourites', $rootScope.UserData, 0);
            }
            $rootScope.Throbber.Visible = false;

        }

    };



    /*Created by vinod yadav 22-12-2019
Save Data from sqllite
*/
    $scope.SaveCustomerFromServer = function () {
        var IsSynceddata = "1";

        if ($scope.OrgBindAllItemList.length > 0) {

            angular.forEach($scope.OrgBindAllItemList, function (item) {

                item.IsSynced = "0";

            });
            /*     if (ISbuttonClick === true) {
                     IsSynceddata = "0";
                     angular.forEach($scope.OrgBindAllItemList, function (item) {
     
                         item.IsSynced = "0";
     
                     });
                 }
     
                 else {
                     IsSynceddata = "1";
                 }*/

            for (var i = 0; i < $scope.OrgBindAllItemList.length; i++) {
                var custData = angular.copy($scope.CustomerList);
                custData = custData.filter(function (el) { return el.ParentCompanyId === $scope.OrgBindAllItemList[i].ParentCompanyId && el.CompanyId === $scope.OrgBindAllItemList[i].CompanyId; });
                if (custData.length > 0) {
                    $scope.OrgBindAllItemList[i].PriorityRating = custData[0].PriorityRating;
                }
            }

            angular.forEach($scope.OrgBindAllItemList, function (item) {
                item.ModifiedBy = $rootScope.UserId;
            });

            var requestData = {};
            requestData.ServicesAction = "UpadateManageCusomerDetailsB2BApp";

            requestData.CustomerList = $scope.OrgBindAllItemList;
            var consolidateApiParamater =
            {
                Json: requestData,
            };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                if (response.data !== undefined && response.data !== null) {
                    var responseAllData = response.data.Json.UserId;


                    if ($scope.OrgBindAllItemList.length > 0) {
                        for (var i = 0; i < $scope.OrgBindAllItemList.length; i++) {

                            $scope.OrgBindAllItemList[i].IsSynced = "1";
                        }
                    }

                    var CustomerData = JSON.stringify($scope.OrgBindAllItemList);

                    offlineDB.transaction(function (tx) {

                        if (CustomerData.length !== 0) {
                            tx.executeSql("delete from Customers where UserId=? ", [$rootScope.UserId]);
                            tx.executeSql("INSERT INTO Customers (JsonDescription,IsSyncedCompleted,UserId) VALUES (?,?,?) ", [CustomerData, IsSynceddata, $rootScope.UserId]);
                        }

                    }, function (error) {

                        console.log('transaction error: ' + error.message);

                    }, function () {

                        $scope.$apply(function () {
                            $scope.AlertMessages = $rootScope.resData.res_ManageCustomer_RecordSuccessfullySaved;
                            $scope.OpenActivePopupEventoffline();
                            $rootScope.Throbber.Visible = false;
                        });

                    });


                }

            }).catch(function (response) {
                $rootScope.Throbber.Visible = false;
                $rootScope.OpenMessagePopupEvent(true, String.format($rootScope.resData.res_ManagePhoto_SomethingwentwrongPleasecheckyourinternetconnectionandtryagain), 'OK');
            });

        }
        else {
            $rootScope.Throbber.Visible = false;
            $rootScope.RedirectFromHomePage();
        }

    };



    $scope.propertyName = 'CompanyName';
    $scope.reverse = true;
    /*Created by vinod yadav 12-11-2019
Sorting
  */



    $scope.IsSelectedContractedCompany = true;
    $scope.IsSelectedNonContractedCompany = true;

    $scope.functiontofindIndexByKeyValue = function (arraytosearch, key, valuetosearch) {

        for (var i = 0; i < arraytosearch.length; i++) {

            if (arraytosearch[i][key] === valuetosearch) {
                return i;
            }
        }
        return -1;
    };

    $scope.ContractedNonContractectfilter = function (ClickEventtype, type) {

        var customerList = [];

        if (ClickEventtype === 'CONTRECTICON') {
            if (type === 'C') {

                if ($scope.IsSelectedContractedCompany === false || $scope.IsSelectedNonContractedCompany === true) {

                    if ($scope.IsSelectedContractedCompany) {

                        $scope.FilterContractNonContractList = angular.copy($scope.CustomerList);

                        $scope.CustomerList = $scope.CustomerList.filter(function (el) { return el.ContractOrNonContract === 'NC'; });
                        $scope.GroupCustomerList = $scope.GetCustomerList();

                        customerList = [];
                        angular.forEach($scope.GroupCustomerList, function (value, key) {

                            var filterdata = value.ChildCustomer.filter(function (el) { return el.ContractOrNonContract === 'NC'; });
                            if (filterdata.length > 0) {
                                customerList.push(value);
                            }

                        });
                        $scope.GroupCustomerList = customerList;

                        if ($scope.IsShowAllCustomer) {
                            $scope.TotalCustcountAccordingtoSearch = 0;
                            $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

                            if ($scope.CustomerList.length === $scope.OrgBindAllItemList.length) {
                                $scope.TotalFilteredItemCount = 0;
                            }
                            else {
                                $scope.TotalFilteredItemCount = $scope.CustomerList.length;
                            }
                        }
                        else {
                            $scope.TotalCustcountAccordingtoSearch = 0;
                            $scope.GettotalCustomercount($scope.GroupCustomerList);
                        }

                    }
                    else {

                        if ($scope.IsShowAllCustomer) {
                            $scope.CustomerList = angular.copy($scope.FilterContractNonContractList);
                            $scope.GroupCustomerList = $scope.GetCustomerList();
                            $scope.TotalCustcountAccordingtoSearch = 0;
                            $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

                            if ($scope.CustomerList.length === $scope.OrgBindAllItemList.length) {
                                $scope.TotalFilteredItemCount = 0;
                            }
                            else {
                                $scope.TotalFilteredItemCount = $scope.CustomerList.length;
                            }
                        }
                        else {
                            $scope.CustomerList = angular.copy($scope.FilterContractNonContractList);
                            $scope.GroupCustomerList = $scope.GetCustomerList();
                            $scope.TotalCustcountAccordingtoSearch = 0;
                            $scope.GettotalCustomercount($scope.GroupCustomerList);
                        }

                    }

                    $scope.IsSelectedContractedCompany = !$scope.IsSelectedContractedCompany;
                }

            }
            else if (type === 'NC') {
                if ($scope.IsSelectedNonContractedCompany === false || $scope.IsSelectedContractedCompany === true) {

                    if ($scope.IsSelectedNonContractedCompany) {

                        $scope.FilterContractNonContractList = angular.copy($scope.CustomerList);

                        $scope.CustomerList = $scope.CustomerList.filter(function (el) { return el.ContractOrNonContract === 'C'; });
                        $scope.GroupCustomerList = $scope.GetCustomerList();

                        customerList = [];
                        angular.forEach($scope.GroupCustomerList, function (value, key) {

                            var filterdata = value.ChildCustomer.filter(function (el) { return el.ContractOrNonContract === 'C'; });
                            if (filterdata.length > 0) {
                                customerList.push(value);
                            }

                        });
                        $scope.GroupCustomerList = customerList;

                        if ($scope.IsShowAllCustomer) {
                            $scope.TotalCustcountAccordingtoSearch = 0;
                            $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

                            if ($scope.CustomerList.length === $scope.OrgBindAllItemList.length) {
                                $scope.TotalFilteredItemCount = 0;
                            }
                            else {
                                $scope.TotalFilteredItemCount = $scope.CustomerList.length;
                            }
                        }
                        else {
                            $scope.TotalCustcountAccordingtoSearch = 0;
                            $scope.GettotalCustomercount($scope.GroupCustomerList);
                        }

                    }
                    else {

                        if ($scope.IsShowAllCustomer) {
                            $scope.CustomerList = angular.copy($scope.FilterContractNonContractList);
                            $scope.GroupCustomerList = $scope.GetCustomerList();
                            $scope.TotalCustcountAccordingtoSearch = 0;
                            $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

                            if ($scope.CustomerList.length === $scope.OrgBindAllItemList.length) {
                                $scope.TotalFilteredItemCount = 0;
                            }
                            else {
                                $scope.TotalFilteredItemCount = $scope.CustomerList.length;
                            }
                        }
                        else {
                            $scope.CustomerList = angular.copy($scope.FilterContractNonContractList);
                            $scope.GroupCustomerList = $scope.GetCustomerList();
                            $scope.TotalCustcountAccordingtoSearch = 0;
                            $scope.GettotalCustomercount($scope.GroupCustomerList);
                        }

                    }

                    $scope.IsSelectedNonContractedCompany = !$scope.IsSelectedNonContractedCompany;
                }
            }
        }

        if (ClickEventtype === 'FUNNELICON') {
            /*$rootScope.OverlayBottomScreenHeight();
              $scope.showfiltersection = !$scope.showfiltersection;
             
              $scope.BindFilterProperty()*/
            $scope.LoadFilter();
        }


    };

    $scope.GetCustomerList = function () {


        var members = $scope.CustomerList;
        var groups = members.reduce(function (obj, item) {
            obj[item.CustomerGroupName] = obj[item.CustomerGroupName] || [];
            obj[item.CustomerGroupName].push(item);
            return obj;
        }, {});
        var myArray = Object.keys(groups).map(function (key) {
            return { CustomerGroupName: key, ShowCustomerList: false, ChildCustomerTotalCount: 0, ChildCustomer: groups[key] };
        });

        angular.forEach(myArray, function (item) {

            var tempList = $scope.OrgBindAllItemList.filter(function (el) { return el.CustomerGroupName === item.CustomerGroupName; });
            if (tempList.length > 0) {
                item.ChildCustomerTotalCount = tempList.length;
            }

        });

        return myArray;

    };

    /*Vinod Yadav : 11-11-2019*/
    $scope.OpenActivePopupEvent = function (popupVisibility) {
        $rootScope.ActivePagePopupAndOverlay = popupVisibility;
    };

    /*Vinod Yadav : 11-11-2019*/
    $scope.ActivePopupOKButtonEvent = function () {
        $rootScope.ActivePagePopupAndOverlay = false;
    };

    /*Vinod Yadav : 11-11-2019*/
    $scope.GoToPageRequested = function () {
        $rootScope.ActivePagePopupAndOverlay = false;
        $rootScope.IsDataEntered = false;
        $state.go($scope.PageToRedirect);
    };

    /*Vinod Yadav : 11-11-2019*/
    $scope.PageToRedirect = "";
    $scope.$on('$stateChangeStart', function (event, next, current) {

        if ($rootScope.IsDataEntered === true) {

            $scope.PageToRedirect = next.name;
            event.preventDefault();

            $scope.OpenActivePopupEvent(true);
            $rootScope.Throbber.Visible = false;
            return false;
        }

    });

    $scope.LoadCustomersAndCustomerGroupData();

    /*Vinod Yadav : 27-11-2019* for offline*/
    $scope.OpenActivePopupEventoffline = function () {
        $scope.ActivePagePopupAndOverlayforoffline = true;
    };

    /*Vinod Yadav : 27-11-2019* for offline*/
    $scope.ActivePopupOKButtonEventoffline = function () {
        $scope.ActivePagePopupAndOverlayforoffline = false;
    };

    /*Vinod Yadav : 27-11-2019* for offline*/
    $scope.GoToofflinePageRequested = function () {
        if ($rootScope.IsRedirectFromMenutoPage === true) {

            $rootScope.IsDataEntered = false;
            $rootScope.RedirectFromHomePage();
        }
        else {
            $rootScope.IsDataEntered = false;
            $rootScope.LoadPageAccordingWorkFlow('app.ManageFavourites', $rootScope.UserData, 0);
        }


    };


    $scope.SendingBackgroudnData = function () {
        $rootScope.SyncBackgroundData();
    };

    $scope.ShowAllCustomerDetails = function (IsShowAllCustomer) {

        if (IsShowAllCustomer) {
            $scope.showAccordionCustomerList = true;
        }
        else {
            $scope.showAccordionCustomerList = false;
        }
        $scope.IsShowAllCustomer = !IsShowAllCustomer;
    };

    /*Vinod Yadav 25-11-2019
  Loading for sorting*/

    $scope.LoadSorting = function () {


        var sortList = $rootScope.SortingParameters.sort($rootScope.generateSortFn([{ name: 'Sequence', primer: 'parseInt' }]));

        var SelectedRecordCheck = $scope.UpdatedSortList.filter(function (el) { return el.Selected == true; });
        if (SelectedRecordCheck.length === 0) {
            $scope.UpdatedSortList = $rootScope.LoadSortingData($scope.IsMultipleSortingAllow);
        }


        $scope.OrgUpdatedSortList = angular.copy($scope.UpdatedSortList);


        $scope.OpenSortingPopupView = true;
        $scope.OpenSingleSortingPopupView = true;
        $scope.OpenMultipleSortingPopupView = true;
    };

    /*Changed By: Chetan Tambe 26-11-2019*/
    $scope.SelectionSortOrder = function (Sort) {

        for (var i = 0; i < $scope.UpdatedSortList.length; i++) {
            $scope.UpdatedSortList[i].Selected = false;
        }


        var sortList = $scope.UpdatedSortList.filter(function (el) { return el.PropertyName == Sort.PropertyName && el.reverse == Sort.reverse && el.SortingParametersId == Sort.SortingParametersId; });
        if (sortList.length > 0) {
            sortList[0].Selected = true;
        }

    };

    $scope.SortOrder = function (Sort) {

        for (var i = 0; i < $scope.UpdatedSortList.length; i++) {
            $scope.UpdatedSortList[i].Selected = false;
        }


        var sortList = $scope.UpdatedSortList.filter(function (el) { return el.PropertyName == Sort.PropertyName && el.reverse == Sort.reverse && el.SortingParametersId == Sort.SortingParametersId; });
        if (sortList.length > 0) {
            sortList[0].Selected = true;

            $scope.CustomerList.sort($rootScope.generateSortFn([{ name: Sort.PropertyName, reverse: Sort.reverse, primer: Sort.PropertyType }]));
            $scope.GroupCustomerList = $scope.GetCustomerList();
            $scope.OpenSortingPopupView = false;
            $scope.OpenSingleSortingPopupView = false;
        }
        $scope.OrgUpdatedSortList = angular.copy($scope.UpdatedSortList);
    };

    $scope.SelectSortOrder = function (Sort) {
        var sortList = $scope.UpdatedSortList.filter(function (el) { return el.PropertyName == Sort.PropertyName && el.SortingParametersId == Sort.SortingParametersId; });
        if (sortList.length > 0) {

            if (sortList[0].Selected) {
                sortList[0].Selected = false;
            }
            else {
                sortList[0].Selected = true;
            }
        }
    };

    $scope.SelectSortingType = function (Sort) {
        var sortList = $scope.UpdatedSortList.filter(function (el) { return el.PropertyName == Sort.PropertyName && el.SortingParametersId == Sort.SortingParametersId; });
        if (sortList.length > 0) {

            if (sortList[0].reverse) {
                sortList[0].reverse = false;
            }
            else {
                sortList[0].reverse = true;
            }
        }
    };

    $scope.MSSequenceResult = function (Sort) {
        if (Sort.MSSequenceNew !== '0') {
            var sortList = $scope.UpdatedSortList.filter(function (el) { return el.MSSequence == Sort.MSSequenceNew; });
            if (sortList.length > 0) {

                navigator.notification.alert(
                    "This sequence is already selected.",
                    function () { },
                    'Alert!',
                    'OK'
                );

                Sort.MSSequence = "0";
                Sort.MSSequenceNew = "0";
            } else {

                Sort.MSSequence = Sort.MSSequenceNew;
            }
        } else {

            Sort.MSSequence = Sort.MSSequenceNew;
        }

    };


    $scope.CloseMultipleSortingView = function () {
        $scope.UpdatedSortList = $scope.OrgUpdatedSortList;

        $scope.OpenSortingPopupView = false;
        $scope.OpenMultipleSortingPopupView = false;

    };

    /*Changed By: Chetan Tambe 26-11-2019*/
    $scope.CloseSingleSortingView = function () {
        $scope.UpdatedSortList = $scope.OrgUpdatedSortList;

        $scope.OpenSortingPopupView = false;
        $scope.OpenSingleSortingPopupView = false;
        $scope.OpenMultipleSortingPopupView = false;
    };

    /*Changed By: Chetan Tambe 26-11-2019*/
    $scope.SaveSingleSortingView = function () {

        var chkSortList = $scope.UpdatedSortList.filter(function (el) { return el.Selected == true; });
        if (chkSortList.length > 0) {
            $scope.SortOrder(chkSortList[0]);
        }
        else {
            $scope.CloseSingleSortingView();
        }

    };


    $scope.MultipleSorting = function () {
        var FilterRecord = [];
        var sortList = $scope.UpdatedSortList.filter(function (el) { return el.Selected == true && el.MSSequence != "0"; });

        sortList = sortList.sort($rootScope.generateSortFn([{ name: 'MSSequence', primer: 'parseInt' }]));

        for (var i = 0; i < sortList.length; i++) {
            var filter = {
                name: sortList[i].PropertyName,
                reverse: sortList[i].reverse,
                primer: sortList[i].PropertyType
            };
            FilterRecord.push(filter);
        }


        var nonSqsortList = $scope.UpdatedSortList.filter(function (el) { return el.Selected == true && el.MSSequence == "0"; });

        nonSqsortList = nonSqsortList.sort($rootScope.generateSortFn([{ name: 'Sequence', primer: 'parseInt' }]));

        for (var i = 0; i < nonSqsortList.length; i++) {
            var filter = {
                name: nonSqsortList[i].PropertyName,
                reverse: nonSqsortList[i].reverse,
                primer: nonSqsortList[i].PropertyType
            };
            FilterRecord.push(filter);
        }

        $scope.CustomerList.sort($rootScope.generateSortFn(FilterRecord));
        $scope.GroupCustomerList = $scope.GetCustomerList();

    };




    $scope.LoadFilter = function () {
        var filterParameters = $rootScope.FilterParameters;

        $scope.TotalFilterCount = $scope.CustomerList.length;
        /*
        var IsChecked = false;

        for (var i = 0; i < filterParameters.length; i++) {
            for (var k = 0; k < filterParameters[i].ChildFilterList.length; k++) {
                if (filterParameters[i].ChildFilterList[k].Selected) {
                    IsChecked = true;
                    break;
                }
            }
            if (IsChecked) {
                break;
            }
        }

        if (!IsChecked) {
            $scope.TotalFilterCount = 0;
        }
        */

        $scope.OrgFilterParameters = angular.copy($rootScope.FilterParameters);

        $scope.OpenSortingPopupView = true;

        $scope.OpenFilteringSelectionPopupView = true;


    };


    $scope.ParentSelectAllFilter = function (object) {
        var ss = object;

        object.Selected ? object.Selected = false : object.Selected = true;


        for (var i = 0; i < object.ChildFilterList.length; i++) {
            object.ChildFilterList[i].Selected = object.Selected;
        }


        var filterParameters = $rootScope.FilterParameters;
        if ($scope.SearchValue.search === "" || $scope.SearchValue.search === undefined) {

            $scope.CustomerList = $scope.OrgBindAllItemList;
        } else {

            $scope.CustomerList = $scope.AfterFilterBindAllItemList;
        }
        var result = $rootScope.FilterJsonData(filterParameters, $scope.CustomerList);
        $scope.GroupCustomerList = $scope.GetCustomerList();

        var countSelected = 0;
        for (var i = 0; i < object.ChildFilterList.length; i++) {
            if (object.ChildFilterList[i].Selected) {
                countSelected = countSelected + 1;
            }
        }

        $scope.TotalFilterCount = result.length;

    };



    $scope.ChildSelectFilter = function (filter, Childfilter) {
        var ss = Childfilter;


        Childfilter.Selected ? Childfilter.Selected = false : Childfilter.Selected = true;


        if (filter.IsRange == '1' && Childfilter.Selected) {
            for (var i = 0; i < filter.ChildFilterList.length; i++) {
                if (filter.ChildFilterList[i].FilterMasterId !== Childfilter.FilterMasterId) {
                    filter.ChildFilterList[i].Selected = false;
                }
            }
        }



        var countChildFilterLength = filter.ChildFilterList.length;
        var countSelectedChildFilterLength = filter.ChildFilterList.filter(function (el) { return el.Selected == true; }).length;

        if (countChildFilterLength == countSelectedChildFilterLength) {
            filter.Selected = true;
        }
        else {
            filter.Selected = false;
        }



        var filterParameters = $rootScope.FilterParameters;
        if ($scope.SearchValue.search === "" || $scope.SearchValue.search === undefined) {

            $scope.CustomerList = $scope.OrgBindAllItemList;
        } else {

            $scope.CustomerList = $scope.AfterFilterBindAllItemList;
        }
        var result = $rootScope.FilterJsonData(filterParameters, $scope.CustomerList);
        $scope.GroupCustomerList = $scope.GetCustomerList();

        $scope.TotalFilterCount = result.length;
        $scope.SaveFilteringView();

    };


    $scope.SetFilterIdentifier = function () {

        if ($scope.IsFilterIdentifier === false) {
            $scope.IsFilterIdentifier = true;
        } else {
            $scope.IsFilterIdentifier = false;
        }

    };


    $scope.CloseFilteringView = function () {

        $rootScope.FilterParameters = $scope.OrgFilterParameters;
        $scope.OpenSortingPopupView = false;
        $scope.OpenFilteringSelectionPopupView = false;

    };



    $scope.GetFilterRecord = function () {
        var filterParameters = $rootScope.FilterParameters;
        if ($scope.SearchValue.search === "" || $scope.SearchValue.search === undefined) {

            $scope.CustomerList = $scope.OrgBindAllItemList;
        } else {

            $scope.CustomerList = $scope.AfterFilterBindAllItemList;
        }
        var result = $rootScope.FilterJsonData(filterParameters, $scope.CustomerList);
        $scope.CustomerList = result;
        $scope.GroupCustomerList = $scope.GetCustomerList();
        $scope.TotalItemCount = $scope.CustomerList.length;
        var chkSortList = $scope.UpdatedSortList.filter(function (el) { return el.Selected == true; });

        if (chkSortList.length > 0) {

            $scope.MultipleSorting();


        }
    };

    $scope.SaveFilteringView = function () {
        $scope.OrgFilterParameters = angular.copy($rootScope.FilterParameters);
        $scope.GetFilterRecord();

        if ($scope.IsSelectedContractedCompany === true && $scope.IsSelectedNonContractedCompany === false) {

            $scope.FilterContractNonContractList = angular.copy($scope.CustomerList);

            $scope.CustomerList = $scope.CustomerList.filter(function (el) { return el.ContractOrNonContract === 'C'; });
            $scope.GroupCustomerList = $scope.GetCustomerList();

            var customerList = [];
            angular.forEach($scope.GroupCustomerList, function (value, key) {

                var filterdata = value.ChildCustomer.filter(function (el) { return el.ContractOrNonContract === 'C'; });
                if (filterdata.length > 0) {
                    customerList.push(value);
                }

            });

            $scope.GroupCustomerList = customerList;

            if ($scope.IsShowAllCustomer) {
                $scope.TotalCustcountAccordingtoSearch = 0;
                $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

                if ($scope.CustomerList.length === $scope.OrgBindAllItemList.length) {
                    $scope.TotalFilteredItemCount = 0;
                }
                else {
                    $scope.TotalFilteredItemCount = $scope.CustomerList.length;
                }
            }
            else {
                $scope.TotalCustcountAccordingtoSearch = 0;
                $scope.GettotalCustomercount($scope.GroupCustomerList);
            }

        }
        else if ($scope.IsSelectedNonContractedCompany === true && $scope.IsSelectedContractedCompany === false) {

            $scope.FilterContractNonContractList = angular.copy($scope.CustomerList);

            $scope.CustomerList = $scope.CustomerList.filter(function (el) { return el.ContractOrNonContract === 'NC'; });
            $scope.GroupCustomerList = $scope.GetCustomerList();

            var customerList = [];
            angular.forEach($scope.GroupCustomerList, function (value, key) {

                var filterdata = value.ChildCustomer.filter(function (el) { return el.ContractOrNonContract === 'NC'; });
                if (filterdata.length > 0) {
                    customerList.push(value);
                }

            });

            $scope.GroupCustomerList = customerList;

            if ($scope.IsShowAllCustomer) {
                $scope.TotalCustcountAccordingtoSearch = 0;
                $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

                if ($scope.CustomerList.length === $scope.OrgBindAllItemList.length) {
                    $scope.TotalFilteredItemCount = 0;
                }
                else {
                    $scope.TotalFilteredItemCount = $scope.CustomerList.length;
                }
            }
            else {
                $scope.TotalCustcountAccordingtoSearch = 0;
                $scope.GettotalCustomercount($scope.GroupCustomerList);
            }

        }

        if ($scope.IsShowAllCustomer) {
            $scope.TotalCustcountAccordingtoSearch = 0;
            $scope.TotalChildCustcount = $scope.OrgBindAllItemList.length;

            if ($scope.CustomerList.length === $scope.OrgBindAllItemList.length) {
                $scope.TotalFilteredItemCount = 0;
            }
            else {
                $scope.TotalFilteredItemCount = $scope.CustomerList.length;
            }
        }
        else {
            $scope.TotalCustcountAccordingtoSearch = 0;
            $scope.GettotalCustomercount($scope.GroupCustomerList);
        }

        $scope.OpenSortingPopupView = false;
        $scope.OpenFilteringSelectionPopupView = false;

    };





    $scope.ResetFilter = function () {
        for (var i = 0; i < $rootScope.FilterParameters.length; i++) {
            $rootScope.FilterParameters[i].Selected = false;

            for (var k = 0; k < $rootScope.FilterParameters[i].ChildFilterList.length; k++) {
                $rootScope.FilterParameters[i].ChildFilterList[k].Selected = false;
            }
        }

        if ($scope.SearchValue.search === "" || $scope.SearchValue.search === undefined) {

            $scope.CustomerList = $scope.OrgBindAllItemList;
        } else {

            $scope.CustomerList = $scope.AfterFilterBindAllItemList;
        }
        $scope.GroupCustomerList = $scope.GetCustomerList();

        $scope.TotalFilterCount = $scope.CustomerList.length;

        var chkSortList = $scope.UpdatedSortList.filter(function (el) { return el.Selected == true; });

        if (chkSortList.length > 0) {

            $scope.MultipleSorting();
        }
    };



    $scope.ResetMultipleSortingView = function () {
        $scope.UpdatedSortList = $rootScope.LoadSortingData($scope.IsMultipleSortingAllow);

        if ($scope.SearchValue.search === "" || $scope.SearchValue.search === undefined) {

            $scope.CustomerList = $scope.OrgBindAllItemList;
        } else {

            $scope.CustomerList = $scope.AfterFilterBindAllItemList;
        }
        $scope.GroupCustomerList = $scope.GetCustomerList();
        $scope.GetFilterRecord();
    };



    $scope.SaveMultipleSortingView = function () {


        var chkSortList = $scope.UpdatedSortList.filter(function (el) { return el.Selected == true; });

        if (chkSortList.length > 0) {
            $scope.OrgUpdatedSortList = angular.copy($scope.UpdatedSortList);
            $scope.MultipleSorting();
            $scope.CloseMultipleSortingView();
        }
        else {
            $scope.OrgUpdatedSortList = angular.copy($scope.UpdatedSortList);
            if ($scope.SearchValue.search === "" || $scope.SearchValue.search === undefined) {

                $scope.CustomerList = $scope.OrgBindAllItemList;
            } else {

                $scope.CustomerList = $scope.AfterFilterBindAllItemList;
            }
            $scope.GroupCustomerList = $scope.GetCustomerList();
            $scope.GetFilterRecord();
            $scope.CloseMultipleSortingView();
        }
    };

    /*Chetan Tambe : 12-12-2019 Confirmation Popup */
    $scope.VerifyCustomerList = function () {
        $scope.OpenConfirmationPopup = false;
    };

    /*Chetan Tambe : 12-12-2019 Confirmation Popup */
    $scope.IWillDoItLater = function () {
        $scope.OpenConfirmationPopup = false;
        $scope.DoItLaterPopup = true;

    };

    /*Chetan Tambe : 12-12-2019 Confirmation Popup */
    $scope.DoItLaterPopupOKButtonEvent = function () {
        $scope.DoItLaterPopup = false;
        $scope.OpenConfirmationPopup = false;
        $rootScope.IsDataEntered = false;
        $rootScope.LoadPageAccordingWorkFlow('app.ManageFavourites', $rootScope.UserData, 0);
    };

    $scope.DateParse = function (datetime) {
        var newdate = "";
        if (datetime !== "" && datetime !== null && datetime !== undefined) {
            if (datetime.indexOf("T") > -1) {
                var splitdatetime = datetime.split('T');
                var newdatetime = splitdatetime[0] + ' ' + splitdatetime[1];
                newdatetime = newdatetime.replace(/-/g, '/');
                newdate = new Date(newdatetime);
            } else {
                newdate = new Date(datetime);
            }

        }
        return newdate;
    };


    $scope.ShowQuickActionPopOverCustomerGroup = function (item) {


        var OpenOuickActionList = $scope.GroupCustomerList.filter(function (el) {
            return el.ShowQuickAction === true && el.CustomerPriceGroup !== item.CustomerPriceGroup;
        });
        if (OpenOuickActionList.length > 0) {
            for (var k = 0; k < OpenOuickActionList.length; k++) {
                OpenOuickActionList[k].ShowQuickAction = false;
            }
        }

        if (item.ShowQuickAction !== true) {
            item.ShowQuickAction = true;
        } else {
            item.ShowQuickAction = false;
        }

    };

    $scope.EditCustomerGroup = function (groupCode) {

        $rootScope.EditGroupCode = groupCode;
        $rootScope.RedirectionPage = "app.ManageCustomer";
        $location.path('/ManageCustomerGroup');


    };

    $scope.EditCustomerGroupList = function (groupCode) {

        $rootScope.EditGroupCode = groupCode;
        $rootScope.RedirectionPage = "app.ManageCustomer";
        $location.path('/CustomerGroupDetails');


    };

    $scope.GoToCreateCustomerGroup = function () {

        $rootScope.EditGroupCode = "";
        $rootScope.RedirectionPage = "app.ManageCustomer";
        $location.path('/ManageCustomerGroup');

    };

    $scope.GoToManagePricing = function (value, editPage) {

        if (editPage === "Customer") {
            $rootScope.EditManagePricing = editPage;
            $rootScope.SelectedCustomerNumber = value;
            $location.path('/ManagePricing');
        }
        else if (editPage === "CustomerGroup") {
            $rootScope.EditManagePricing = editPage;
            $rootScope.SelectedCustomerPriceGroup = value;
            $location.path('/ManagePricing');
        }

    };


});