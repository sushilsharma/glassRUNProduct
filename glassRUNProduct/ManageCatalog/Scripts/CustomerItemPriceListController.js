
angular.module("glassRUNProduct").controller('CustomerItemPriceController', function ($scope, $rootScope, $q, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageCustomerService) {


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

    $scope.ConfirmationMessagePopup = false;
    $scope.ConfirmationMessageOverlay = false;
    $scope.Alertmsg = "";
    $rootScope.Throbber.Visible = false;
    $scope.TotalFilterCount = 0;
    $scope.TotalItemCount = 0;
    $scope.TotalTrackOrderCount = 0;
    $scope.TotalFilteredItemCount = 0;
    $scope.UpdatedSortList = [];
    $scope.AfterFilterBindAllItemList = [];
    $scope.OrgBindAllItemList = [];
    $scope.BeforeFilterBindAllItemList = [];
    $rootScope.EditItemPriceVariation = "";
    $rootScope.IsItemVariationEdit = false;
    $rootScope.IsItemVariationCopy = false;

    $rootScope.UpdateSupplierItemPriceVariationList = [];

    $rootScope.IsItemPriceExistForCustomerAll = false;

    $scope.SearchValue = {
        search: ''
    };


    $scope.ItemPriceVariationList = [];

    $scope.LoadItemPriceVariationList = function () {

        $rootScope.Throbber.Visible = true;


        var inputJson = {
            CompanyId: $rootScope.CompanyId,
            ItemLongCode: $rootScope.SelectedItemJson.ItemCode

        };
        var itemPriceApi = ManageCustomerService.ItemPriceVariationsList(inputJson);
        $q.all([
            itemPriceApi
        ]).then(function (resp) {
            debugger;
            if (resp[0] !== undefined && resp[0] !== "" && resp[0] !== null) {
                if (resp[0].data !== undefined && resp[0].data !== "" && resp[0].data !== null) {

                    var ItemPriceVariationListData = resp[0].data;
                    $rootScope.UpdateSupplierItemPriceVariationList = angular.copy(ItemPriceVariationListData);

                    if (ItemPriceVariationListData.length > 0) {
                        $scope.ItemPriceVariationList = ItemPriceVariationListData;
                    } else {
                        $scope.ItemPriceVariationList = [];
                    }

                    var itemPriceExistForGroupAll = $scope.ItemPriceVariationList.filter(function (el) { return el.IsGroupAll === true; });
                    if (itemPriceExistForGroupAll.length > 0) {
                        $rootScope.IsItemPriceExistForCustomerAll = true;
                    } else {
                        $rootScope.IsItemPriceExistForCustomerAll = false;
                    }
                    $scope.OrgBindAllItemList = angular.copy($scope.ItemPriceVariationList);
                    $scope.TotalFilteredItemCount = $scope.OrgBindAllItemList.length;


                }
            }

            $rootScope.Throbber.Visible = false;
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
            $scope.BeforeFilterBindAllItemList = angular.copy($scope.ItemPriceVariationList);
        } else {
            $scope.ItemPriceVariationList = $scope.BeforeFilterBindAllItemList;
        }

        var searchOnField = ['CustomerPriceGroup'];

        var jsonObjectList = $scope.ItemPriceVariationList;
        $scope.ItemPriceVariationList = $rootScope.SearchRecord(searchText, jsonObjectList, 'CustomerPriceGroup', searchOnField);

        $scope.AfterFilterBindAllItemList = angular.copy($scope.ItemPriceVariationList);

        $scope.TotalItemCount = $scope.OrgBindAllItemList.length;

        if ($scope.ItemPriceVariationList.length === $scope.OrgBindAllItemList.length) {
            $scope.TotalFilteredItemCount = 0;
        } else {
            $scope.TotalFilteredItemCount = $scope.ItemPriceVariationList.length;
        }

        $scope.GetFilterRecord();
    };

    $scope.GetFilterRecord = function () {

        var filterParameters = $rootScope.FilterParameters;
        if ($scope.SearchValue.search === "" || $scope.SearchValue.search === undefined) {
            $scope.ItemPriceVariationList = $scope.OrgBindAllItemList;
        } else {

            $scope.ItemPriceVariationList = $scope.AfterFilterBindAllItemList;
        }
        var result = $rootScope.FilterJsonData(filterParameters, $scope.ItemPriceVariationList);
        $scope.ItemPriceVariationList = result;
        $scope.TotalItemCount = $scope.OrgBindAllItemList.length;
        if ($scope.ItemPriceVariationList.length === $scope.OrgBindAllItemList.length) {
            $scope.TotalFilteredItemCount = 0;
        } else {
            $scope.TotalFilteredItemCount = $scope.ItemPriceVariationList.length;
        }

        var chkSortList = $scope.UpdatedSortList.filter(function (el) { return el.Selected == true; });

        if (chkSortList.length > 0) {
            /*$scope.MultipleSorting();*/
        }
    };

    $scope.LoadItemPriceVariationList();

    $scope.CloseConfirmationMessagePopup = function () {

        $scope.ConfirmationMessagePopup = false;
        $scope.ConfirmationMessageOverlay = false;
        $scope.Alertmsg = "";
    };


    $scope.EditItemPriceGroup = function (itemPriceGroup) {

        var startDate = "";
        if (itemPriceGroup.EffectiveDate !== "" && itemPriceGroup.EffectiveDate !== undefined) {
            startDate = new Date(itemPriceGroup.EffectiveDate);
            var month = parseInt(parseInt(startDate.getMonth()) + 1);
            if (month < 10) {
                month = "0" + month;
            }
            startDate = startDate.getDate() + "/" + month + "/" + startDate.getFullYear();
        }

        var endDate = "";
        if (itemPriceGroup.ExpiryDate !== "" && itemPriceGroup.ExpiryDate !== undefined) {
            endDate = new Date(itemPriceGroup.ExpiryDate);
            var month = parseInt(parseInt(endDate.getMonth()) + 1);
            if (month < 10) {
                month = "0" + month;
            }
            endDate = endDate.getDate() + "/" + month + "/" + endDate.getFullYear();
        }

        $rootScope.EditItemPriceVariation = {
            ItemBasePriceID: itemPriceGroup.ItemBasePriceID,
            Price: itemPriceGroup.Price,
            StartDate: startDate,
            EndDate: endDate,
            IsGroupAll: itemPriceGroup.IsGroupAll,
            IsGroup: itemPriceGroup.IsGroup,
            CompanyMnemonic: itemPriceGroup.CustomerGroupName,
            CustomerGroupID: itemPriceGroup.CustomerGroupID,
            EditedCompanyMnemonic: itemPriceGroup.CustomerGroupName,
            EditedCustomerGroupID: itemPriceGroup.CustomerGroupID
        };
        $rootScope.IsItemVariationEdit = true;
        $rootScope.IsItemVariationCopy = false;
        $location.path('/AddItemPrice');
    };

    $scope.CopyItemPriceGroup = function (itemPriceGroup) {

        var startDate = "";
        if (itemPriceGroup.EffectiveDate !== "" && itemPriceGroup.EffectiveDate !== undefined) {
            startDate = new Date(itemPriceGroup.EffectiveDate);
            var month = parseInt(parseInt(startDate.getMonth()) + 1);
            if (month < 10) {
                month = "0" + month;
            }
            startDate = startDate.getDate() + "/" + month + "/" + startDate.getFullYear();
        }

        var endDate = "";
        if (itemPriceGroup.ExpiryDate !== "" && itemPriceGroup.ExpiryDate !== undefined) {
            endDate = new Date(itemPriceGroup.ExpiryDate);
            var month = parseInt(parseInt(endDate.getMonth()) + 1);
            if (month < 10) {
                month = "0" + month;
            }
            endDate = endDate.getDate() + "/" + month + "/" + endDate.getFullYear();
        }

        $rootScope.EditItemPriceVariation = {
            ItemBasePriceID: itemPriceGroup.ItemBasePriceID,
            Price: itemPriceGroup.Price,
            StartDate: startDate,
            EndDate: endDate,
            IsGroupAll: itemPriceGroup.IsGroupAll,
            IsGroup: itemPriceGroup.IsGroup,
            CompanyMnemonic: itemPriceGroup.CustomerGroupName,
            CustomerGroupID: itemPriceGroup.CustomerGroupID,
            EditedCompanyMnemonic: itemPriceGroup.CustomerGroupName,
            EditedCustomerGroupID: itemPriceGroup.CustomerGroupID
        };
        $rootScope.IsItemVariationEdit = false;
        $rootScope.IsItemVariationCopy = true;
        $location.path('/AddItemPrice');
    };

    $scope.DeactivateActivateItemPriceGroup = function (object) {
        $rootScope.Throbber.Visible = true;

        object.ShowQuickAction = false;
        var isSetActive = true;
        if (object.IsActive === true) {
            isSetActive = false;

        } else {
            isSetActive = true;
        }

        var inputJson = {
            CompanyId: $rootScope.ReferenceId,
            IsActive: isSetActive,
            CustomerPriceGroup: object.CustomerPriceGroup
        };
        var deactivateActivateItemApi = CustomerAppService.ActivateDeactivateItemPriceVariation(inputJson);
        $q.all([
            deactivateActivateItemApi
        ]).then(function (resp) {

            if (resp !== undefined) {
                if (resp[0] !== undefined) {

                    if (resp[0].data !== undefined) {

                        $scope.ConfirmationMessagePopup = true;
                        $scope.ConfirmationMessageOverlay = true;
                        if (resp[0].data.IsActive === true) {
                            $scope.Alertmsg = String.format($rootScope.resData.res_ManageCatalog_ActivateItemPriceGroup);
                        } else {
                            $scope.Alertmsg = String.format($rootScope.resData.res_ManageCatalog_DeactivateItemPriceGroup);
                        }

                        var selectedItem = $scope.ItemPriceVariationList.filter(function (el) {
                            return el.CustomerPriceGroup === resp[0].data.CustomerPriceGroup;
                        });
                        if (selectedItem.length > 0) {
                            selectedItem[0].IsActive = resp[0].data.IsActive;
                        }

                        $rootScope.TimerStop();

                        var ownCatalogJson = JSON.stringify($scope.ItemPriceVariationList);

                        offlineDB.transaction(function (tx) {
                            try {

                                tx.executeSql("Update ItemPriceVariations set JsonDescription=?  where UserId=? ", [ownCatalogJson, $rootScope.UserId], function (tx, ere) {
                                    console.log("Update ItemPriceVariations Json of ItemCode : " + $rootScope.UserId + " is updated");
                                });

                            } catch (e) {
                                $rootScope.ReTimerStart();
                                $rootScope.Throbber.Visible = false;
                                alert(e.message);
                            }
                        }, function (error) {
                            $rootScope.ReTimerStart();
                            $rootScope.Throbber.Visible = false;
                            alert(error.message);

                        }, function () {
                            $rootScope.ReTimerStart();
                        });


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


    $scope.AddNewItemPricing = function () {
        $rootScope.IsItemVariationEdit = false;
        $rootScope.IsItemVariationCopy = false;
        $location.path('/AddItemPrice');
    };



    $scope.ShowQuickActionPopOver = function (item) {


        var OpenOuickActionList = $scope.ItemPriceVariationList.filter(function (el) {
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

    $scope.GoToBackPage = function () {
        $location.path('/ManageCatalog');
    };

});