angular.module("glassRUNProduct").controller('AddItemPriceController', function ($scope, $rootScope, $q, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageCustomerService, ManageOrderService) {

    LoadActiveVariables($sessionStorage, $state, $rootScope);
    var urlhost = $location.url();
    var URLSplit1 = urlhost.split("/");
    var controllerName = '';
    if (URLSplit1.length > 0) {
        controllerName = URLSplit1[URLSplit1.length - 1];
    }

    $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true
            };
        }
    };
    $scope.LoadThrobberForPage();

    $rootScope.PropertyType = {
        parseInt: parseInt,
        String: String,
        parseFloat: parseFloat,
        Date: new Date
    };

    $scope.SearchValue = {
        search: ''
    };


    $scope.IsCustomerGroupSelected = false;
    $scope.SelectedCustomerJson = "";
    $scope.SelectedCustomerGroupJson = "";

    $scope.DisableCustomerGroup = false;

    $scope.ConfirmationMessagePopup = false;
    $scope.ConfirmationMessageOverlay = false;
    $scope.Alertmsg = "";

    $scope.AddItemPriceJson = {
        Price: "",
        StartDate: "",
        EndDate: "",
        CompanyMnemonic: "",
        CustomerGroupID: ""
    };

    $scope.GenerateToDate = function () {

        var minToDate = $filter('date')($scope.AddItemPriceJson.StartDate, "dd/MM/yyyy");

        $('#txtToDate').each(function () {
            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                    }
                },
                minDate: minToDate,
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false
            });
        });

        $('#txtToDate').datepicker('show');

    };

    $scope.OpenToDate = function () {

        if ($scope.AddItemPriceJson.StartDate !== "") {
            $("#txtToDate").datepicker("destroy");
            setTimeout(function () {
                $scope.GenerateToDate();
            }, 200);
        }
    };

    $scope.LoadStartDate = function () {

        $('#txtFromDate').each(function () {
            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                    }

                    $scope.$apply(function () {
                        $scope.AddItemPriceJson.StartDate = $filter('date')(dateText, "dd/MM/yyyy");
                    });

                },
                minDate: new Date(),
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false
            });
        });

        $('#txtFromDate').datepicker('show');
    };

    $scope.OpenFromDate = function () {
        $("#txtFromDate").datepicker("destroy");
        setTimeout(function () {
            $scope.LoadStartDate();
        }, 200);
    };




    $scope.FormatDate = function (date) {
        var splitdate = date.split('/');
        var date = splitdate[2] + "-" + splitdate[1] + "-" + splitdate[0];
        return date;
    };

    $scope.ClearItemPrice = function () {
        $scope.AddItemPriceJson = {
            Price: 0,
            StartDate: "",
            EndDate: "",
            CompanyMnemonic: "",
            CustomerGroupID: ""
        };
        $scope.SelectedCustomerGroupJson = "";
        $scope.SelectedCustomerJson = "";
        $scope.IsCustomerGroupSelected = false;
        $rootScope.IsItemVariationEdit = false;
        $rootScope.IsItemVariationCopy = false;
        $rootScope.EditItemPriceVariation = "";
    };


    $scope.CloseConfirmationMessagePopup = function () {

        $scope.ConfirmationMessagePopup = false;
        $scope.ConfirmationMessageOverlay = false;
        $scope.Alertmsg = "";
        $location.path('/CustomerItemPriceList');
    };

    $scope.SaveItemPrice = function () {

        try {

            $rootScope.Throbber.Visible = true;
            var validateItemPrice = {
                Price: $scope.AddItemPriceJson.Price,
                StartDate: $scope.AddItemPriceJson.StartDate,
                EndDate: $scope.AddItemPriceJson.EndDate,
                Customer: $scope.SelectedCustomerJson,
                CustomerGroup: $scope.SelectedCustomerGroupJson
            };

            if ($scope.IsCustomerGroupSelected === true) {
                validateItemPrice.Customer = "1";
            } else {
                validateItemPrice.CustomerGroup = "1";
            }

            var isValidAllFields = true;

            if ($scope.AddItemPriceJson.Price === undefined || $scope.AddItemPriceJson.Price === null || $scope.AddItemPriceJson.Price === "") {
                $rootScope.Throbber.Visible = false;
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddItemPrice_PleaseEnterPrice), '', 3000);
                return false;
            }

            if ($scope.AddItemPriceJson.StartDate === undefined || $scope.AddItemPriceJson.StartDate === null || $scope.AddItemPriceJson.StartDate === "") {
                $rootScope.Throbber.Visible = false;
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddItemPrice_PleaseSelectStartDate), '', 3000);
                return false;
            }

            if ($scope.AddItemPriceJson.EndDate === undefined || $scope.AddItemPriceJson.EndDate === null || $scope.AddItemPriceJson.EndDate === "") {
                $rootScope.Throbber.Visible = false;
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddItemPrice_PleaseEnterEndDate), '', 3000);
                return false;
            }

            if ($scope.IsCustomerGroupSelected === true) {

                if ($scope.SelectedCustomerGroupJson === undefined || $scope.SelectedCustomerGroupJson === null || $scope.SelectedCustomerGroupJson === "") {
                    $rootScope.Throbber.Visible = false;
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddItemPrice_PleaseSelectCustomerGroup), '', 3000);
                    return false;
                }
            }

            if ($scope.IsCustomerGroupSelected === false) {

                if ($scope.SelectedCustomerJson === undefined || $scope.SelectedCustomerJson === null || $scope.SelectedCustomerJson === "") {
                    $rootScope.Throbber.Visible = false;
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddItemPrice_PleaseSelectCustomer), '', 3000);
                    return false;
                }
            }
            

            if (isValidAllFields === true) {



                var newDate = new Date();
                var inputJson = {
                    CompanyId: $rootScope.CompanyId,
                    CompanyCode: $rootScope.CompanyMnemonic,
                    CurrencyCode: "VND",
                    ItemShortCode: $rootScope.SelectedItemJson.ItemCode,
                    ItemLongCode: $rootScope.SelectedItemJson.ItemCode,
                    EffectiveDate: $scope.FormatDate($scope.AddItemPriceJson.StartDate),
                    ExpiryDate: $scope.FormatDate($scope.AddItemPriceJson.EndDate),
                    UOM: $rootScope.SelectedItemJson.UOM,
                    Price: $scope.AddItemPriceJson.Price,
                    IsActive: 1,
                    CustomerGroupForPricing: {},
                    CustomerMasterForPricingList: []
                };


                if ($rootScope.IsItemVariationEdit !== true) {
                    if ($scope.IsCustomerGroupSelected === false) {
                        inputJson.IsGroup = 0;
                        inputJson.IsGroupAll = 0;
                        var priceGroup = $rootScope.CompanyMnemonic + "_" + $rootScope.SelectedItemJson.ItemCode;
                        var customerGroupPricing = {
                            CustomerPriceGroup: priceGroup,
                            CustomerGroupName: $scope.SelectedCustomerJson,
                            GroupCode: $scope.SelectedCustomerJson,
                            CompanyId: $rootScope.CompanyId,
                            IsGroupAll: 0,
                            IsGroup: 0,
                            IsActive: 1,
                            CreatedBy: $rootScope.UserId,
                            CompanyCode: $rootScope.CompanyMnemonic
                        };

                        inputJson.CustomerGroupForPricing = customerGroupPricing;

                        var customerMasterPricing = {
                            CustomerNumber: $scope.SelectedCustomerJson,
                            CustomerPriceGroup: priceGroup,
                            IsActive: 1,
                            CreatedBy: $rootScope.UserId,
                            CompanyId: $rootScope.CompanyId,
                            CompanyCode: $rootScope.CompanyMnemonic
                        };

                        inputJson.CustomerMasterForPricingList.push(customerMasterPricing);

                    } else {
                        if ($scope.SelectedCustomerGroupJson === "All") {
                            inputJson.IsGroupAll = 1;
                            inputJson.CustomerGroupID = 0;

                            var priceGroupAll = $rootScope.CompanyMnemonic + "_All";
                            var customerGroupPricingAll = {
                                CustomerPriceGroup: priceGroupAll,
                                CustomerGroupName: "All Customers",
                                GroupCode: "All Customers",
                                CompanyId: $rootScope.CompanyId,
                                IsGroupAll: 1,
                                IsGroup: 1,
                                IsActive: 1,
                                CreatedBy: $rootScope.UserId,
                                CompanyCode: $rootScope.CompanyMnemonic
                            };
                            inputJson.CustomerGroupForPricing = customerGroupPricingAll;

                        } else {
                            inputJson.IsGroupAll = 0;
                            inputJson.CustomerGroupID = $scope.SelectedCustomerGroupJson;
                        }
                        inputJson.IsGroup = 1;

                    }


                    var createItemPriceApi = ManageCustomerService.CreateItemPrice(inputJson);
                    $q.all([
                        createItemPriceApi
                    ]).then(function (resp) {

                        $rootScope.Throbber.Visible = false;
                        $scope.ConfirmationMessagePopup = true;
                        $scope.ConfirmationMessageOverlay = true;
                        $scope.Alertmsg = String.format($rootScope.resData.res_ManageCatalog_ItemAddedPrice);
                        $scope.ClearItemPrice();


                    });

                } else {

                    inputJson.ItemBasePriceID = $scope.AddItemPriceJson.ItemBasePriceID;
                    inputJson.CustomerGroupID = $scope.AddItemPriceJson.EditedCustomerGroupID;

                    var updateItemPriceApi = ManageCustomerService.UpdateItemPrice(inputJson);
                    $q.all([
                        updateItemPriceApi
                    ]).then(function (resp) {

                        $rootScope.Throbber.Visible = false;
                        $scope.ConfirmationMessagePopup = true;
                        $scope.ConfirmationMessageOverlay = true;
                        $scope.Alertmsg = String.format($rootScope.resData.res_ManageCatalog_ItemUpdatedPrice);
                        $scope.ClearItemPrice();

                    });
                }



            } else {
                $rootScope.Throbber.Visible = false;
            }
        } catch (e) {
            $rootScope.Throbber.Visible = false;
        }

    };

    $scope.LoadCustomerAndCustomerGroup = function () {

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

            if (resp[0] !== undefined && resp[0] !== "" && resp[0] !== null) {
                if (resp[0].data !== undefined && resp[0].data !== "" && resp[0].data !== null) {
                    var CustomersGroupArray = resp[0].data;

                    $scope.CustomersGroupList = CustomersGroupArray;

                    $scope.CustomersGroupList = $scope.CustomersGroupList.filter(function (el) { return el.IsGroupAll === false; });

                    var groupAll = {
                        CustomerGroupID: "All",
                        CustomerPriceGroup: "All",
                        CustomerGroupName: "All Customer",
                        GroupCode: "All Customer",
                        IsGroupAll: false,
                        CompanyId: $rootScope.CompanyId,
                        CustomerGroupForPricingList: [],
                        CustomerMasterForPricingList: []
                    };

                    $scope.CustomersGroupList.push(groupAll);

                    $scope.CustomersGroupList = $scope.CustomersGroupList.reverse();

                    if ($rootScope.IsItemVariationEdit !== true && $rootScope.IsItemVariationCopy !== true) {

                        if ($rootScope.IsItemPriceExistForCustomerAll === false) {
                            $scope.IsCustomerGroupSelected = true;
                            $scope.DisableCustomerGroup = true;
                            $scope.SelectedCustomerGroupJson = "All";
                            $scope.AddItemPriceJson.CustomerGroupID = "All";
                        } else {
                            $scope.IsCustomerGroupSelected = false;
                            $scope.DisableCustomerGroup = false;
                            $scope.SelectedCustomerGroupJson = "";
                            $scope.AddItemPriceJson.CustomerGroupID = "";
                        }

                    }

                    $rootScope.Throbber.Visible = false;

                } else {
                    $scope.CustomersGroupList = [];
                }

            } else {
                $scope.CustomersGroupList = [];
            }

            if (resp[1] !== undefined && resp[1] !== "" && resp[1] !== null) {
                if (resp[1].data !== undefined && resp[1].data !== "" && resp[1].data !== null) {
                    var CustomersList = resp[1].data.Json.CustomerList;
                    $scope.CustomersList = CustomersList;

                } else {
                    $scope.CustomersList = [];
                }
            } else {
                $scope.CustomersList = [];
            }

            $rootScope.Throbber.Visible = false;

        });

    };




    $scope.LoadCustomerAndCustomerGroup();

    $scope.SelectCustomerOnly = function () {

        if ($rootScope.IsItemVariationEdit !== true) {
            $scope.IsCustomerGroupSelected = false;
            $scope.SelectedCustomerJson = "";
            $scope.SelectedCustomerGroupJson = "";
        }
    };


    $scope.SelectCustomerGroup = function () {

        if ($rootScope.IsItemVariationEdit !== true) {
            $scope.IsCustomerGroupSelected = true;
            $scope.SelectedCustomerJson = "";
            $scope.SelectedCustomerGroupJson = "";
        }

    };

    $scope.SelectedCustomer = function (customer) {
        $scope.SelectedCustomerGroupJson = "";
        $scope.SelectedCustomerJson = customer;

    };

    $scope.SelectedCustomerGroup = function (customerGroup) {
        $scope.SelectedCustomerJson = "";
        $scope.SelectedCustomerGroupJson = customerGroup;
    };

    $scope.updateItemPriceAndValidity = function (itemVariation) {


        var updateItemVariation = $rootScope.UpdateSupplierCatalogItemList.filter(function (el) { return el.ItemCode === $rootScope.SelectedItemJson.ItemCode; });
        if (updateItemVariation.length > 0) {
            updateItemVariation[0].ModifiedDate = itemVariation.ModifiedDate;
            if ($scope.SelectedCustomerGroupJson === "All") {
                updateItemVariation[0].Price = itemVariation.Price;
            }
        }
        updateItemVariation = JSON.stringify($rootScope.UpdateSupplierCatalogItemList);

        var ItemPriceVariationGroup = $rootScope.UpdateSupplierItemPriceVariationList.filter(function (el) { return el.ItemLongCode === $rootScope.SelectedItemJson.ItemCode && el.CustomerGroupID === $scope.AddItemPriceJson.EditedCustomerGroupID; });
        if (ItemPriceVariationGroup.length > 0) {
            ItemPriceVariationGroup[0].Price = itemVariation.Price;
            ItemPriceVariationGroup[0].EffectiveDate = itemVariation.EffectiveDate;
            ItemPriceVariationGroup[0].ExpiryDate = itemVariation.ExpiryDate;
        }

        $rootScope.Throbber.Visible = false;
        $scope.ConfirmationMessagePopup = true;
        $scope.ConfirmationMessageOverlay = true;
        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ManageCatalog_ItemUpdatedPrice), '', 3000);
        $scope.ClearItemPrice();

    };

    $scope.UpdateInLocaldbItemPriceVariationList = function (itemVariation) {


        var updateItemVariation = $rootScope.UpdateSupplierCatalogItemList.filter(function (el) { return el.ItemCode === $rootScope.SelectedItemJson.ItemCode; });
        if (updateItemVariation.length > 0) {
            updateItemVariation[0].NumberOfVariations = parseFloat(updateItemVariation[0].NumberOfVariations) + 1;
            updateItemVariation[0].ModifiedDate = itemVariation.ModifiedDate;
            updateItemVariation[0].IsNewlyAdded = false;
        }

        updateItemVariation = JSON.stringify($rootScope.UpdateSupplierCatalogItemList);

        var itemVariationJson = {
            "ItemBasePriceID": itemVariation.ItemBasePriceID,
            "ItemShortCode": itemVariation.ItemShortCode,
            "ItemLongCode": itemVariation.ItemLongCode,
            "AddressNumber": null,
            "CurrencyCode": itemVariation.CurrencyCode,
            "UOM": null,
            "EffectiveDate": itemVariation.EffectiveDate,
            "ExpiryDate": itemVariation.ExpiryDate,
            "Price": itemVariation.Price,
            "CustomerGroupID": itemVariation.CustomerGroupID,
            "CustomerPriceGroup": itemVariation.CustomerPriceGroup,
            "CustomerGroupName": itemVariation.CustomerGroupName,
            "ItemGroupId": null,
            "CompanyId": itemVariation.CompanyId,
            "CompanyCode": itemVariation.CompanyCode,
            "IsGroupAll": itemVariation.IsGroupAll,
            "IsGroup": itemVariation.IsGroup,
            "IsValid": true,
            "IsActive": itemVariation.IsActive,
            "ItemBasePriceList": [],
            "CustomerMasterForPricingList": [],
            "CustomerGroupForPricing": {}
        };

        $rootScope.UpdateSupplierItemPriceVariationList.push(itemVariationJson);

        $rootScope.Throbber.Visible = false;
        $scope.ConfirmationMessagePopup = true;
        $scope.ConfirmationMessageOverlay = true;
        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ManageCatalog_ItemAddedPrice), '', 3000);
        $scope.ClearItemPrice();

    };


    if ($rootScope.IsItemVariationEdit === true || $rootScope.IsItemVariationCopy === true) {
        $scope.AddItemPriceJson = $rootScope.EditItemPriceVariation;

        if ($rootScope.EditItemPriceVariation.IsGroup === true) {
            $scope.IsCustomerGroupSelected = true;
            $scope.SelectedCustomerJson = "";
            if ($rootScope.EditItemPriceVariation.IsGroupAll === true) {
                $scope.SelectedCustomerGroupJson = "All";
                $scope.AddItemPriceJson.CustomerGroupID = "All";
            } else {
                $scope.SelectedCustomerGroupJson = $rootScope.EditItemPriceVariation.CustomerGroupID;
            }

        } else {
            $scope.SelectedCustomerGroupJson = "";
            $scope.SelectedCustomerJson = $rootScope.EditItemPriceVariation.CompanyMnemonic;
            $scope.IsCustomerGroupSelected = false;


        }

    }

    $scope.CancelItemPriceAction = function () {

        $rootScope.IsItemVariationEdit = false;
        $rootScope.IsItemVariationCopy = false;
        $rootScope.EditItemPriceVariation = "";
        $scope.SelectedCustomerGroupJson = "";
        $scope.SelectedCustomerJson = "";
        $scope.IsCustomerGroupSelected = false;
        $location.path('/CustomerItemPriceList');

    };

});