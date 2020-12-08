angular.module("glassRUNProduct").controller('ManageCatalogueController', function ($scope, $rootScope, $q, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageCustomerService) {
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
    $scope.LoadThrobberForPage();

    $rootScope.PropertyType = {
        parseInt: parseInt,
        String: String,
        parseFloat: parseFloat,
        Date: new Date
    };

    $rootScope.FilterParameters = [{
        ChildFilterList: [],
        ControllerName: controllerName1,
        FilterDescription: "Brand",
        FilterMasterId: "38",
        IsRange: "0",
        PageURL: controllerName1,
        PropertyName: "Brand",
        PropertyType: "String",
        ResourceKey: "1101"
    }];

    $scope.SearchValue = {
        search: ''
    };
    $rootScope.Throbber.Visible = false;
    $scope.TotalFilterCount = 0;
    $scope.TotalItemCount = 0;
    $scope.ConfirmationMessagePopup = false;
    $scope.ConfirmationMessageOverlay = false;
    $scope.Alertmsg = "";
    $scope.UpdatedSortList = [];
    $scope.AfterFilterBindAllItemList = [];
    $scope.OrgBindAllItemList = [];
    $scope.BeforeFilterBindAllItemList = [];
    $scope.SellerProductCatalogList = [];

    $rootScope.UpdateSupplierCatalogItemList = [];

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


    $scope.SortItemName = function () {
        if ($scope.IsSortByAsc === false) {
            $scope.IsSortByAsc = true;
        } else {
            $scope.IsSortByAsc = false;
        }

        $scope.SellerProductCatalogList.sort($rootScope.generateSortFn([{ name: "ItemName", reverse: $scope.IsSortByAsc, primer: "String" }]));


    }

    $scope.SaveFilteringView = function () {


        var value = $scope.priceSlider;
        $scope.IsFilterApplied = false;

        for (var i = 0; i < $rootScope.FilterParameters.length; i++) {
            if ($rootScope.FilterParameters[i].IsRange === "1") {
                for (var k = 0; k < $rootScope.FilterParameters[i].ChildFilterList.length; k++) {
                    $rootScope.FilterParameters[i].ChildFilterList[k].FilterDescription = value.sliderMin + " to " + value.sliderMax;
                    $rootScope.FilterParameters[i].ChildFilterList[k].FromRange = value.sliderMin;
                    $rootScope.FilterParameters[i].ChildFilterList[k].ToRange = value.sliderMax;
                    if (value.sliderMin === value.min && value.sliderMax === value.max) {
                        $rootScope.FilterParameters[i].ChildFilterList[k].Selected = false;
                    } else {
                        $rootScope.FilterParameters[i].ChildFilterList[k].Selected = true;
                        $scope.IsFilterApplied = true;
                    }

                }
            } else {
                if ($rootScope.FilterParameters[i].Selected) {
                    $scope.IsFilterApplied = true;
                    break;
                }

                for (var k = 0; k < $rootScope.FilterParameters[i].ChildFilterList.length; k++) {
                    if ($rootScope.FilterParameters[i].ChildFilterList[k].Selected) {
                        $scope.IsFilterApplied = true;
                        break;
                    }
                }
            }
        }

        $scope.OrgFilterParameters = angular.copy($rootScope.FilterParameters);
        $scope.GetFilterRecord();


        $scope.OpenSortingPopupView = false;
        $scope.OpenFilteringSelectionPopupView = false;

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

            $scope.SellerProductCatalogList = $scope.OrgBindAllItemList;
        } else {

            $scope.SellerProductCatalogList = $scope.AfterFilterBindAllItemList;
        }
        var result = $rootScope.FilterJsonData(filterParameters, $scope.SellerProductCatalogList);


        $scope.TotalFilterCount = result.length;
        $scope.SaveFilteringView();

    };


    $scope.IsShowSellerCatalogSections = true;

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

    var SettingValue = $rootScope.GetSettingValue('IsShowSellerCatalogSections');
    if (SettingValue == '1') {
        $scope.IsShowSellerCatalogSections = true;
    } else {
        $scope.IsShowSellerCatalogSections = false;
    }


    var todayDate = new Date();
    todayDate = todayDate.setDate(todayDate.getDate() - 1);
    todayDate = new Date(todayDate).setMinutes(0);
    todayDate = new Date(todayDate).setSeconds(0);
    $scope.TodayDate = new Date(todayDate);
    var InLastThreeMonthDate = new Date();
    InLastThreeMonthDate = InLastThreeMonthDate.setMonth(new Date().getMonth() - 3);
    InLastThreeMonthDate = new Date(InLastThreeMonthDate).setHours(0);
    InLastThreeMonthDate = new Date(InLastThreeMonthDate).setMinutes(0);
    InLastThreeMonthDate = new Date(InLastThreeMonthDate).setSeconds(0);
    InLastThreeMonthDate = new Date(InLastThreeMonthDate);
    $scope.InLastThreeMonthDate = InLastThreeMonthDate;


    $scope.LoadManageCatalogue = function () {


        $rootScope.Throbber.Visible = true;

        var inputJson = {
            SoldTo: $rootScope.CompanyId
        };
        var sellerCatalog = ManageCustomerService.LoadSellerProductCatalogList(inputJson);
        $q.all([
            sellerCatalog
        ]).then(function (resp) {
            debugger;

            $scope.SellerProductCatalogList = [];

            if (resp[0] !== undefined && resp[0] !== "" && resp[0] !== null) {
                if (resp[0].data !== undefined && resp[0].data !== "" && resp[0].data !== null) {
                    $scope.SellerProductCatalogList = resp[0].data;

                    var todayData = $scope.SellerProductCatalogList.filter(function (el) { return parseInt(el.NumberOfVariations) === 0; });
                    if (todayData.length > 0) {
                        for (var i = 0; i < todayData.length; i++) {
                            todayData[i].IsNewlyAdded = true;
                        }
                    }


                    var inLastThreeMonthData = $scope.SellerProductCatalogList.filter(function (el) { return new Date(el.OrderDate) > new Date($scope.InLastThreeMonthDate) && parseInt(el.NumberOfVariations) > 0; });
                    if (inLastThreeMonthData.length > 0) {
                        for (var i = 0; i < inLastThreeMonthData.length; i++) {
                            inLastThreeMonthData[i].InLastThreeMonth = true;
                        }
                    }


                    var inBeforeThreeMonthData = $scope.SellerProductCatalogList.filter(function (el) { return new Date(el.OrderDate) < new Date($scope.InLastThreeMonthDate) && parseInt(el.NumberOfVariations) > 0; });
                    if (inBeforeThreeMonthData.length > 0) {
                        for (var i = 0; i < inBeforeThreeMonthData.length; i++) {
                            inBeforeThreeMonthData[i].InBeforeThreeMonth = true;
                        }
                    }

                    for (var i = 0; i < $scope.SellerProductCatalogList.length; i++) {

                        var isBrandExist = $rootScope.FilterParameters[0].ChildFilterList.filter(function (el) { return el.FilterDescription === $scope.SellerProductCatalogList[i].Brand; });
                        if (isBrandExist.length === 0) {
                            if ($scope.SellerProductCatalogList[i].Brand !== "" && $scope.SellerProductCatalogList[i].Brand !== undefined && $scope.SellerProductCatalogList[i].Brand !== null) {
                                var filterJson = {
                                    FilterDescription: $scope.SellerProductCatalogList[i].Brand,
                                    FilterMasterId: $scope.SellerProductCatalogList[i].ItemCode,
                                    IsRange: "0",
                                    ParentFilterMasterId: "38",
                                    PropertyName: "Brand",
                                    PropertyType: "String",
                                    ResourceValue: $scope.SellerProductCatalogList[i].Brand
                                };

                                $rootScope.FilterParameters[0].ChildFilterList.push(filterJson);
                            }

                        }

                    }


                    $scope.OrgBindAllItemList = angular.copy($scope.SellerProductCatalogList);

                    $rootScope.UpdateSupplierCatalogItemList = angular.copy($scope.SellerProductCatalogList);



                }
            }
            $rootScope.Throbber.Visible = false;

        });

    };

    $scope.LoadManageCatalogue();


    $scope.ShowQuickActionPopOver = function (item) {


        var OpenOuickActionList = $scope.SellerProductCatalogList.filter(function (el) {
            return el.ShowQuickAction === true && el.ItemCode !== item.ItemCode;
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


    $scope.NoRecordFound = function (sequence) {

        var isCountTrue = false;
        var productcount = [];
        if (sequence === 1) {
            productcount = $scope.SellerProductCatalogList.filter(function (el) {
                return el.IsNewlyAdded === true;
            });
        } else if (sequence === 2) {
            productcount = $scope.SellerProductCatalogList.filter(function (el) {
                return el.InLastThreeMonth === true;
            });
        } else if (sequence === 3) {
            productcount = $scope.SellerProductCatalogList.filter(function (el) {
                return el.InBeforeThreeMonth === true;
            });
        }

        if (productcount.length > 0) {
            isCountTrue = false;
        } else {
            isCountTrue = true;
        }

        return isCountTrue;

    };


    $scope.CloseConfirmationMessagePopup = function () {

        $scope.ConfirmationMessagePopup = false;
        $scope.ConfirmationMessageOverlay = false;
        $scope.Alertmsg = "";
    };

    $scope.DeactiveAndActiveItem = function (object) {



        $rootScope.Throbber.Visible = true;


        object.ShowQuickAction = false;

        var isSetActive = true;
        if (object.IsActive === true) {
            isSetActive = false;

        } else {
            isSetActive = true;
        }

        var inputJson = {
            SoldTo: $rootScope.CompanyId,
            IsActive: isSetActive,
            ItemCode: object.ItemCode
        };
        var deactivateActivateItemApi = ManageCustomerService.ActivateDeactivateSupplierItem(inputJson);
        $q.all([
            deactivateActivateItemApi
        ]).then(function (resp) {

            if (resp !== undefined) {
                if (resp[0] !== undefined) {

                    if (resp[0].data !== undefined) {

                        $scope.ConfirmationMessagePopup = true;
                        $scope.ConfirmationMessageOverlay = true;
                        if (resp[0].data.IsActive === true) {
                            $scope.Alertmsg = String.format($rootScope.resData.res_ManageCatalog_ActivateItem);
                        } else {
                            $scope.Alertmsg = String.format($rootScope.resData.res_ManageCatalog_DeactivateItem);
                        }

                        var selectedItem = $scope.SellerProductCatalogList.filter(function (el) {
                            return el.ItemCode === resp[0].data.ItemCode;
                        });
                        if (selectedItem.length > 0) {
                            selectedItem[0].IsActive = resp[0].data.IsActive;
                        }

                        $scope.OrgBindAllItemList = angular.copy($scope.SellerProductCatalogList);

                        $rootScope.UpdateSupplierCatalogItemList = angular.copy($scope.SellerProductCatalogList);

                        $scope.TotalItemCount = $scope.SellerProductCatalogList.length;

                        $rootScope.Throbber.Visible = false;

                    } else {
                        $rootScope.Throbber.Visible = false;
                    }
                } else {
                    $rootScope.Throbber.Visible = false;
                }
            } else {
                $rootScope.Throbber.Visible = false;
            }


        });



    };

    $scope.CheckTotalCount = function () {
        var OrgCount = 0;
        var Count = 0;
        OrgCount = $scope.OrgBindAllItemList.length;
        Count = $scope.OrgBindAllItemList.length;
        $scope.TotalItemCount = OrgCount;
        $scope.TotalFilterCount = OrgCount;

    };

    $scope.ClearSearch = function () {
        $scope.SearchValue.search = "";
        $scope.SearchList();
    };

    $scope.SearchList = function () {



        var searchText = $scope.SearchValue.search;

        if ($scope.BeforeFilterBindAllItemList.length === 0) {
            $scope.BeforeFilterBindAllItemList = angular.copy($scope.SellerProductCatalogList);
        } else {
            $scope.SellerProductCatalogList = $scope.BeforeFilterBindAllItemList;
        }

        var searchOnField = ['ItemName', 'ItemCode', 'Brand'];

        var jsonObjectList = $scope.SellerProductCatalogList;
        $scope.SellerProductCatalogList = $rootScope.SearchRecord(searchText, jsonObjectList, 'ItemCode', searchOnField);

        $scope.AfterFilterBindAllItemList = angular.copy($scope.SellerProductCatalogList);

        $scope.TotalItemCount = $scope.OrgBindAllItemList.length;

        if ($scope.SellerProductCatalogList.length === $scope.OrgBindAllItemList.length) {
            $scope.TotalFilteredItemCount = $scope.SellerProductCatalogList.length;
        } else {
            $scope.TotalFilteredItemCount = $scope.SellerProductCatalogList.length;
        }

        $scope.GetFilterRecord();
    };

    $scope.GetFilterRecord = function () {

        var filterParameters = $rootScope.FilterParameters;
        var filterParameters = $rootScope.FilterParameters;
        if ($scope.SearchValue.search === "" || $scope.SearchValue.search === undefined) {
            $scope.SellerProductCatalogList = $scope.OrgBindAllItemList;
        } else {

            $scope.SellerProductCatalogList = $scope.AfterFilterBindAllItemList;
        }
        var result = $rootScope.FilterJsonData(filterParameters, $scope.SellerProductCatalogList);
        $scope.SellerProductCatalogList = result;
        $scope.TotalItemCount = $scope.OrgBindAllItemList.length;
        if ($scope.SellerProductCatalogList.length === $scope.OrgBindAllItemList.length) {
            $scope.TotalFilteredItemCount = 0;
        } else {
            $scope.TotalFilteredItemCount = $scope.SellerProductCatalogList.length;
        }
        $scope.TotalFilterCount = result.length;
        var chkSortList = $scope.UpdatedSortList.filter(function (el) { return el.Selected == true; });

        if (chkSortList.length > 0) {
            /*$scope.MultipleSorting();*/
        }
    };
    $rootScope.SelectedItemJson = "";
    $scope.ManageItemPrice = function (itemJson) {

        $rootScope.SelectedItemJson = itemJson;
        $location.path('/CustomerItemPriceList');
    };


});