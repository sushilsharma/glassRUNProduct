angular.module("glassRUNProduct").controller('ItemSoldToMappingController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    debugger;

    debugger;
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    debugger;
    $scope.isNewAddedItem = "1";

    $scope.ItemDropdownDisable = false;
    var page = $location.absUrl().split('#/')[1];

    $scope.ViewControllerName = page;

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
    $scope.ValidationDataList = []; //added for valiadtion
    $scope.TruckSizeId = 0;
    var requestData =
    {
        ServicesAction: 'LoadUOM'

    };









    //var stringfyjson = JSON.stringify(requestData);
    var jsonobject = {};
    jsonobject.Json = requestData;
    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        debugger;
        // var resoponsedata = JSON.parse(JSON.parse(response.data));
        var resoponsedata = response.data.Json.UnitOfMeasureList;
        $scope.bindUnitOfMeasureList = resoponsedata;
        //$scope.GetCreditLimitOfCustomer();
    });


    $rootScope.PromotionItemList = [];






    $scope.ItemSearchInputDefaultSetting = function () {
        $scope.SearchControl = {
            InputItem: '',
            FilterAutoCompletebox: ''
        };
        $scope.selectedRow = -1;
        $scope.showItembox = false;
        $rootScope.foundResult = false;
    }

    $scope.ItemSearchInputDefaultSetting();

    $scope.ItemValueId = 0;
    $scope.GetAllActiveCompanyByItemId = function () {
        debugger;
        var requestLayerData =
        {
            ServicesAction: 'GetAllCompanyListByItemId',
            ItemId: $scope.ItemValueId,
            Status: 0
        };
        var jsonLayerobject = {};
        jsonLayerobject.Json = requestLayerData;
        GrRequestService.ProcessRequest(jsonLayerobject).then(function (response) {
            debugger;

            $scope.AllActiveCompanyList = response.data.Json.CompanyList;
            for (var j = 0; j < $scope.AllActiveCompanyList.length; j++) {
                $scope.AllActiveCompanyList[j].IsAreaSelected = "1";
                $scope.AllActiveCompanyList[j].IsProvinceSelected = "1";
                $scope.AllActiveCompanyList[j].IsRegionSelected = "1";
                $scope.AllActiveCompanyList[j].IsSubChannelSelected = "1";
                if ($scope.AllActiveCompanyList[j].IsActiveForItem === '0') {
                    $scope.AllActiveCompanyList[j].IsAlreadyExcluded = true;
                }
            }

        });
    };

    $scope.AreaList = [];
    $scope.AreaCodes = "";
    $scope.AreaSelectedList = [];


    $scope.ProvinceList = [];    
    $scope.ProvinceSelectedList = [];

    $scope.RegionList = [];
    $scope.RegionSelectedList = [];

    $scope.SubChannelList = [];
    $scope.SubChannelSelectedList = [];

    $scope.MultiSelectDropdownSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    };

    $scope.GetAllAreas = function () {
        var requestLayerData =
        {
            ServicesAction: 'GetAllAreas'
        };
        var jsonLayerobject = {};
        jsonLayerobject.Json = requestLayerData;
        GrRequestService.ProcessRequest(jsonLayerobject).then(function (response) {
            debugger;
            $scope.AreaList = response.data.Json.AreaList;

        });
    };

    $scope.GetAllAreas();

    $scope.UncheckAllAreas = function () {
        for (var k = 0; k < $scope.AllActiveCompanyList.length; k++) {
            $scope.AllActiveCompanyList[k].IsAreaSelected = "1";
        }
    };

    $scope.FilterCustomersByArea = function () {

        debugger;
        if ($scope.AreaSelectedList.length > 0) {

            for (var p = 0; p < $scope.AllActiveCompanyList.length; p++) {
                $scope.AllActiveCompanyList[p].IsAreaSelected = "0";
                $scope.AllActiveCompanyList[p].IsActiveForItem = '1';
            }

            for (var i = 0; i < $scope.AreaSelectedList.length; i++) {

                for (var j = 0; j < $scope.AllActiveCompanyList.length; j++) {

                    if ($scope.AllActiveCompanyList[j].Area === $scope.AreaSelectedList[i].Id) {
                        $scope.AllActiveCompanyList[j].IsAreaSelected = "1";
                    }
                }
            }

            var SelectedAraList = [];
            for (var i = 0; i < $scope.AreaSelectedList.length; i++) {
                SelectedAraList.push($scope.AreaSelectedList[i].Id);
            }

            var IsAlreadyExcludedList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsAlreadyExcluded === true && SelectedAraList.indexOf(el.Area) !== -1; });

            for (var j = 0; j < IsAlreadyExcludedList.length; j++) {
                IsAlreadyExcludedList[j].IsSelected = false;
                IsAlreadyExcludedList[j].IsAlreadyExcluded = true;
                IsAlreadyExcludedList[j].IsActiveForItem = '0';
            }



        } else {

            for (var k = 0; k < $scope.AllActiveCompanyList.length; k++) {
                $scope.AllActiveCompanyList[k].IsAreaSelected = "1";

                if ($scope.AllActiveCompanyList[k].IsAlreadyExcluded === true) {
                    $scope.AllActiveCompanyList[k].IsSelected = false;
                    $scope.AllActiveCompanyList[k].IsActiveForItem = '0';
                }
            }

        }

    };


    $scope.GetAllProvince = function () {
        var requestLayerData =
        {
            ServicesAction: 'GetAllProvinces'
        };
        var jsonLayerobject = {};
        jsonLayerobject.Json = requestLayerData;
        GrRequestService.ProcessRequest(jsonLayerobject).then(function (response) {
            debugger;
            $scope.ProvinceList = response.data.Json.ProvinceList;

        });
    };

    $scope.GetAllProvince()

    $scope.UncheckAllProvince = function () {
        for (var k = 0; k < $scope.AllActiveCompanyList.length; k++) {
            $scope.AllActiveCompanyList[k].IsProvinceSelected = "1";
        }
    };

    $scope.FilterCustomersByProvince = function () {

        debugger;
        if ($scope.ProvinceSelectedList.length > 0) {

            for (var p = 0; p < $scope.AllActiveCompanyList.length; p++) {
                $scope.AllActiveCompanyList[p].IsProvinceSelected = "0";
                $scope.AllActiveCompanyList[p].IsActiveForItem = '1';
            }

            for (var i = 0; i < $scope.ProvinceSelectedList.length; i++) {

                for (var j = 0; j < $scope.AllActiveCompanyList.length; j++) {

                    if ($scope.AllActiveCompanyList[j].ProvinceDesc === $scope.ProvinceSelectedList[i].Id) {
                        $scope.AllActiveCompanyList[j].IsProvinceSelected = "1";
                    }
                }
            }

            var SelectedProList = [];
            for (var i = 0; i < $scope.ProvinceSelectedList.length; i++) {
                SelectedProList.push($scope.ProvinceSelectedList[i].Id);
            }

            var IsProvinceAlreadyExcludedList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsAlreadyExcluded === true && SelectedProList.indexOf(el.ProvinceDesc) !== -1; });

            for (var j = 0; j < IsProvinceAlreadyExcludedList.length; j++) {
                IsProvinceAlreadyExcludedList[j].IsSelected = false;
                IsProvinceAlreadyExcludedList[j].IsAlreadyExcluded = true;
                IsProvinceAlreadyExcludedList[j].IsActiveForItem = '0';
            }



        } else {

            for (var k = 0; k < $scope.AllActiveCompanyList.length; k++) {
                $scope.AllActiveCompanyList[k].IsProvinceSelected = "1";

                if ($scope.AllActiveCompanyList[k].IsAlreadyExcluded === true) {
                    $scope.AllActiveCompanyList[k].IsSelected = false;
                    $scope.AllActiveCompanyList[k].IsActiveForItem = '0';
                }
            }

        }

    };


    $scope.GetAllRegion = function () {
        var requestLayerData =
        {
            ServicesAction: 'GetAllRegion'
        };
        var jsonLayerobject = {};
        jsonLayerobject.Json = requestLayerData;
        GrRequestService.ProcessRequest(jsonLayerobject).then(function (response) {
            debugger;
            $scope.RegionList = response.data.Json.RegionList;

        });
    };

    $scope.GetAllRegion()

    $scope.UncheckAllRegion = function () {
        for (var k = 0; k < $scope.AllActiveCompanyList.length; k++) {
            $scope.AllActiveCompanyList[k].IsRegionSelected = "1";
        }
    };

    $scope.FilterCustomersByRegion = function () {

        debugger;
        if ($scope.RegionSelectedList.length > 0) {

            for (var p = 0; p < $scope.AllActiveCompanyList.length; p++) {
                $scope.AllActiveCompanyList[p].IsRegionSelected = "0";
                $scope.AllActiveCompanyList[p].IsActiveForItem = '1';
            }

            for (var i = 0; i < $scope.RegionSelectedList.length; i++) {

                for (var j = 0; j < $scope.AllActiveCompanyList.length; j++) {

                    if ($scope.AllActiveCompanyList[j].RegionValue === $scope.RegionSelectedList[i].Id) {
                        $scope.AllActiveCompanyList[j].IsRegionSelected = "1";
                    }
                }
            }

            var SelectedRegionList = [];
            for (var i = 0; i < $scope.RegionSelectedList.length; i++) {
                SelectedRegionList.push($scope.RegionSelectedList[i].Id);
            }

            var IsRegionAlreadyExcludedList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsAlreadyExcluded === true && SelectedRegionList.indexOf(el.RegionValue) !== -1; });

            for (var j = 0; j < IsRegionAlreadyExcludedList.length; j++) {
                IsRegionAlreadyExcludedList[j].IsSelected = false;
                IsRegionAlreadyExcludedList[j].IsAlreadyExcluded = true;
                IsRegionAlreadyExcludedList[j].IsActiveForItem = '0';
            }



        } else {

            for (var k = 0; k < $scope.AllActiveCompanyList.length; k++) {
                $scope.AllActiveCompanyList[k].IsRegionSelected = "1";

                if ($scope.AllActiveCompanyList[k].IsAlreadyExcluded === true) {
                    $scope.AllActiveCompanyList[k].IsSelected = false;
                    $scope.AllActiveCompanyList[k].IsActiveForItem = '0';
                }
            }

        }

    };


    $scope.GetAllSubChannel = function () {
        var requestLayerData =
        {
            ServicesAction: 'GetAllSubChannel'
        };
        var jsonLayerobject = {};
        jsonLayerobject.Json = requestLayerData;
        GrRequestService.ProcessRequest(jsonLayerobject).then(function (response) {
            debugger;
            $scope.SubChannelList = response.data.Json.SubChannelList;

        });
    };

    $scope.GetAllSubChannel()

    $scope.UncheckAllSubChannel = function () {
        for (var k = 0; k < $scope.AllActiveCompanyList.length; k++) {
            $scope.AllActiveCompanyList[k].IsRegionSelected = "1";
        }
    };

    $scope.FilterCustomersBySubChannel = function () {

        debugger;
        if ($scope.SubChannelSelectedList.length > 0) {

            for (var p = 0; p < $scope.AllActiveCompanyList.length; p++) {
                $scope.AllActiveCompanyList[p].IsSubChannelSelected = "0";
                $scope.AllActiveCompanyList[p].IsActiveForItem = '1';
            }

            for (var i = 0; i < $scope.SubChannelSelectedList.length; i++) {

                for (var j = 0; j < $scope.AllActiveCompanyList.length; j++) {

                    if ($scope.AllActiveCompanyList[j].SubChannel === $scope.SubChannelSelectedList[i].Id) {
                        $scope.AllActiveCompanyList[j].IsSubChannelSelected = "1";
                    }
                }
            }

            var SelectedSubChannelList = [];
            for (var i = 0; i < $scope.SubChannelSelectedList.length; i++) {
                SelectedSubChannelList.push($scope.SubChannelSelectedList[i].Id);
            }

            var IsSubChannelAlreadyExcludedList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsAlreadyExcluded === true && SelectedSubChannelList.indexOf(el.SubChannel) !== -1; });

            for (var j = 0; j < IsSubChannelAlreadyExcludedList.length; j++) {
                IsSubChannelAlreadyExcludedList[j].IsSelected = false;
                IsSubChannelAlreadyExcludedList[j].IsAlreadyExcluded = true;
                IsSubChannelAlreadyExcludedList[j].IsActiveForItem = '0';
            }



        } else {

            for (var k = 0; k < $scope.AllActiveCompanyList.length; k++) {
                $scope.AllActiveCompanyList[k].IsSubChannelSelected = "1";

                if ($scope.AllActiveCompanyList[k].IsAlreadyExcluded === true) {
                    $scope.AllActiveCompanyList[k].IsSelected = false;
                    $scope.AllActiveCompanyList[k].IsActiveForItem = '0';
                }
            }

        }

    };

    



    $scope.FilterByCustomerCode = function () {

        debugger;
        var searchText = $scope.ItemJson.SearchCompany;
        var searchOnField = ['CompanyName', 'CompanyMnemonic'];
        var jsonObjectList = $scope.AllActiveCompanyList;
        $scope.SearchFilterRecord(searchText, jsonObjectList, 'CompanyMnemonic', searchOnField);

    };

    $scope.SearchFilterRecord = function (searchText, searchJson, uniqueKey, SearchRecord) {

        debugger;
        if (searchText !== '' && searchText !== undefined && searchJson.length > 0) {

            for (var p = 0; p < $scope.AllActiveCompanyList.length; p++) {
                $scope.AllActiveCompanyList[p].IsAreaSelected = "0";
            }

            var searchstrings = searchText.split(" ");

            searchstrings.forEach(function (needle) {

                var re1 = new RegExp(needle, 'gi');
                var matches = searchJson.filter(matcher(re1, needle, SearchRecord));

                for (var i = 0; i < matches.length; i++) {

                    for (var j = 0; j < $scope.AllActiveCompanyList.length; j++) {

                        if ($scope.AllActiveCompanyList[j][uniqueKey] === matches[i][uniqueKey]) {
                            $scope.AllActiveCompanyList[j].IsAreaSelected = "1";
                        }

                    }

                }

            });

        } else {

            for (var k = 0; k < $scope.AllActiveCompanyList.length; k++) {
                $scope.AllActiveCompanyList[k].IsAreaSelected = "1";
            }

        }

    };

    function matcher(regexp, SearchValue, SearchRecord) {
        return function (obj) {
            var found = false;
            Object.keys(obj).forEach(function (key) {
                if (!found) {
                    if (SearchRecord.indexOf(key) !== -1) {
                        var dd = SearchRecord;
                        var objectValue = obj[key];
                        objectValue = objectValue.toLowerCase();
                        SearchValue = SearchValue.toLowerCase();
                        var n = objectValue.search(SearchValue);
                        if ((typeof obj[key] == 'string') && n !== -1) {
                            found = true;
                        }
                        //if ((typeof obj[key] == 'string') && regexp.exec(obj[key])) {
                        //    found = true;
                        //}
                    }
                }
            });
            return found;
        };
    }

    $scope.multiSelectevents = { onItemSelect: function (x) { $scope.FilterCustomersByArea(); }, onItemDeselect: function (y) { $scope.FilterCustomersByArea(); }, onDeselectAll: function (y) { $scope.UncheckAllAreas(); } };

    $scope.multiSelectProvinceevents = { onItemSelect: function (x) { $scope.FilterCustomersByProvince(); }, onItemDeselect: function (y) { $scope.FilterCustomersByProvince(); }, onDeselectAll: function (y) { $scope.UncheckAllProvince(); } };

    $scope.multiSelectRegionevents = { onItemSelect: function (x) { $scope.FilterCustomersByRegion(); }, onItemDeselect: function (y) { $scope.FilterCustomersByRegion(); }, onDeselectAll: function (y) { $scope.UncheckAllRegion(); } };
    $scope.multiSelectSubChannelevents = { onItemSelect: function (x) { $scope.FilterCustomersBySubChannel(); }, onItemDeselect: function (y) { $scope.FilterCustomersBySubChannel(); }, onDeselectAll: function (y) { $scope.UncheckAllSubChannel(); } };

    $scope.ItemId = 0;



    $scope.ViewItemGrid =
    {

        dataSource: {
            schema: {
                data: "data",
                total: "totalRecords"
            },
            transport: {
                read: function (options) { //You can get the current page, pageSize etc off `e`.
                    debugger;
                    var orderby = "";
                    var config = "";

                    var ItemName = "";
                    var ItemCode = "";

                    var ItemNameCriteria = "";
                    var ItemCodeCriteria = "";

                    debugger;

                    if (options.data && options.data.filter && options.data.filter.filters) {
                        config =
                        {
                            value: options.data.filter.filters[0].value,
                            field: options.data.filter.filters[0].field,
                            operator: options.data.filter.filters[0].operator

                        };

                        for (var i = 0; i < options.data.filter.filters.length; i++) {

                            if (options.data.filter.filters[0].field === "ItemName") {
                                ItemName = options.data.filter.filters[0].value;
                                ItemNameCriteria = options.data.filter.filters[0].operator;
                            }

                            if (options.data.filter.filters[0].field === "ItemCode") {
                                ItemCode = options.data.filter.filters[0].value;
                                ItemCodeCriteria = options.data.filter.filters[0].operator;
                            }
                        }

                    }
                    var requestData =
                    {
                        ServicesAction: 'LoadItemSoldToMappingDetails',
                        PageIndex: options.data.page - 1,
                        PageSize: 50,
                        OrderBy: "",
                        ItemName: ItemName,
                        ItemNameCriteria: ItemNameCriteria,
                        ItemCode: ItemCode,
                        ItemCodeCriteria: ItemCodeCriteria,
                        CompanyId: 0,
                        PageName: page,
                        PageControlName: 'AddItemInMaster',
                        RoleMasterId: $rootScope.RoleId,
                        LoginId: $rootScope.UserId,
                    };


                    var consolidateApiParamater =
                    {
                        Json: requestData,

                    };


                    debugger;

                    GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                        debugger;

                        var totalcount = null;
                        var ListData = null;
                        var resoponsedata = response.data;
                        if (resoponsedata.Json !== undefined) {
                            totalcount = resoponsedata.Json.ItemList[0].TotalCount
                            ListData = resoponsedata.Json.ItemList;
                        }
                        else {
                            totalcount = 0
                            ListData = [];
                        }
                        for (var i = 0; i < ListData.length; i++) {
                            if (ListData[i].IsActive === "1") {
                                ListData[i].IsActive = true;
                            } else {
                                ListData[i].IsActive = false;
                            }
                        }
                        var inquiryList = {
                            data: ListData,
                            totalRecords: totalcount
                        }
                        $scope.GridData = inquiryList;
                        options.success(inquiryList);
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

            {
                field: "ItemCode", title: $rootScope.resData.res_GridColumn_ItemCode, template: '<div class="graybgfont" ng-click=\"LoadItemView(\'#=ItemCode#\')\">#:ItemCode#</div>', type: "string", filterable: { mode: "row", extra: false },
                width: "100px"
            },

            { field: "ItemName", title: $rootScope.resData.res_GridColumn_ItemName, type: "string", filterable: { mode: "row", extra: false } },

            //{ field: "Amount", title: $rootScope.resData.res_GridColumn_Amount, template: "{{dataItem.Amount | currency : 'EUR'}}", type: "string", filterable: { mode: "row", extra: false } },

            { field: "SoldToMappedCount", title: $rootScope.resData.res_GridColumn_SoldToMappedCount, type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } } },

            {
                field: "Edit",
                "template": "<button class=\"k-button\" ng-click=\"EditItem(#=ItemId#)\"><i class='fa fa-pencil'></i></a>",
                "title": $rootScope.resData.res_GridColumn_Edit, "width": "6%"
                , filterable: { mode: "row", extra: false, cell: { enabled: false } }
            },
            //{
            //    field: "ItemAction",
            //    template: "<input type='checkbox' class='checkbox' ng-model=\"dataItem.IsActive\" ng-click='onCheckBoxClick($event, dataItem)' />",
            //    title: $rootScope.resData.res_GridColumn_ItemAction,
            //    width: "50px"
            // },

            //{ "template": "<button class=\"k-button\" ng-click=\"DeleteTruck(#=ItemId#)\"><i class='fa fa-trash'></i></a>", "title": "Delete", "width": "6%" }
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
            $scope.ViewItemGrid.dataSource.transport.read($scope.values);
        }
    };

    $rootScope.GridRecallForStatus = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        ChangeGridHeaderTitleByLanguage($scope.ViewItemGrid, "ViewItemGridId", $rootScope.resData);
        gridCallBack();
    }

    $scope.onCheckBoxClick = function (ev, item) {
        debugger;
        var data = $scope.GridData.data.filter(function (el) { return el.ItemId === item.ItemId; });
        if (data.length > 0) {
            data[0].IsActive = ev.target.checked;
        }

        item.IsActive = ev.target.checked;

        var element = $(ev.currentTarget);
        var row = element.closest("tr");
        if (item.selected) {
            row.addClass("k-state-selected");
        } else {
            row.removeClass("k-state-selected");
        }

        var requestData =
        {
            ServicesAction: 'DeleteItem',
            ItemId: item.ItemId,
            IsActive: ev.target.checked
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            var activemsg = "";
            if (ev.target.checked === false) {
                activemsg = "InActive";
            }
            else {
                activemsg = "Active";
            }
            $rootScope.ValidationErrorAlert('Item ' + activemsg + ' successfully', '', 3000);
            gridCallBack();
        });

    }


    $scope.ItemJson = {
        Item: '',
        ItemCode: '',
        UOM: '',
        Price: '',
        SearchCompany: '',
        IncludeCheckBox: false,
        ExcludeCheckBox: false,
        PageTabHeader: $rootScope.resData.res_TruckUI_Add,
    }


    $scope.selectedItemEvent = function (input) {

        debugger;
        $scope.ItemValueId = input;

        var requestData =
        {
            ServicesAction: 'LoadItemSoldToMappingDetails',
            PageIndex: 0,
            PageSize: 5,
            OrderBy: "",
            ItemId: input,
            CompanyId: 0,
            PageName: page,
            PageControlName: 'AddItemInMaster',
            RoleMasterId: $rootScope.RoleId,
            LoginId: $rootScope.UserId,
        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };

        debugger;

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;

            if (response.data !== undefined) {
                if (response.data.Json !== undefined) {

                    if (response.data.Json.ItemList !== undefined) {
                        $scope.ItemValueId = 0;
                        $scope.Allocation = 'NA';
                        $scope.SearchControl.InputItem = "";
                        $scope.SearchControl.FilterAutoCompletebox = "";
                        $scope.SearchControl.InputCollection = "";
                        $scope.filterAutoCompletebox = "";
                        $rootScope.ValidationErrorAlert('This item is already mapped to Some Sold to, You can modify the mapping from View and Edit.', '', 3000);
                    }
                }

            }
        });

    };

    $scope.SaveItemSoldToMapping = function () {
        debugger;

        if ($scope.ItemValueId !== 0) {


            $rootScope.CompanyId = $rootScope.tmpCompanyId;

            var NotActiveCompanyList = [];
            if ($scope.AllActiveCompanyList.length > 0) {
                //NotActiveCompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsActiveForItem === '0' });
                NotActiveCompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsAlreadyExcluded === true });
                if (NotActiveCompanyList.length > 0) {
                    for (var i = 0; i < NotActiveCompanyList.length; i++) {
                        NotActiveCompanyList[i].SoldTo = NotActiveCompanyList[i].CompanyMnemonic;
                        NotActiveCompanyList[i].CreatedBy = $rootScope.UserId;
                    }
                } else {
                    NotActiveCompanyList = [];
                }
            } else {
                NotActiveCompanyList = [];
            }
            //var itemList = $rootScope.bindAllProductList.filter(function (el) { return el.ItemName === $scope.SearchControl.InputItem });

            var item = {
                ItemId: $scope.ItemValueId,
                ItemName: $scope.ItemJson.Item,
                ItemCode: $scope.ItemJson.ItemCode,
                Amount: $scope.ItemJson.Price,
                PrimaryUnitOfMeasure: $scope.ItemJson.UOM,
                UOM: $scope.ItemJson.UOM,
                ProductType: 9,
                StockInQuantity: 1500,
                CreatedBy: $rootScope.UserId,
                NewAddedItem: $scope.isNewAddedItem,
                CompanyList: NotActiveCompanyList

            }



            var itemList = [];
            itemList.push(item);

            var requestData =
            {
                ServicesAction: 'InsertItemSoldToMapping',
                ItemList: itemList
            };



            var consolidateApiParamater =
            {
                Json: requestData,
            };
            debugger;
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                debugger;
                if (response.data.length > 0)  // check error in serverValidation
                {
                    for (var i = 0; i < $scope.ValidationDataList.length; i++) {
                        if ($scope.ValidationDataList[i].IsValidate == false) {
                            $('#' + $scope.ValidationDataList[i].ControlName).css('border-color', '');
                            $('#Message' + $scope.ValidationDataList[i].ControlName).html('').css('color', '');
                        }

                    }

                    $scope.ValidationDataList = response.data;

                    for (var i = 0; i <= $scope.ValidationDataList.length; i++) {
                        if ($scope.ValidationDataList[i].IsValidate == false) {
                            $('#' + $scope.ValidationDataList[i].ControlName).css('border-color', 'red');
                            $('#Message' + $scope.ValidationDataList[i].ControlName).html('*' + $scope.ValidationDataList[i].Message).css('color', 'red');
                        }
                    }

                }
                else {
                    // add By Vinod yadav on 11-09-2019
                    if ($scope.ItemId != 0) {
                        $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
                    }
                    else {
                        $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
                    }
                }

                $scope.Clear();
                $scope.ViewForm();
            });

        }
        else {
            $rootScope.ValidationErrorAlert('Please select Item.', '', 3000);
        }
    }


    $scope.Clear = function () {
        debugger;
        $scope.AllActiveCompanyList = [];
        $scope.ItemId = 0;
        if ($scope.ValidationDataList.length > 0) {
            for (var i = 0; i < $scope.ValidationDataList.length; i++) {
                if ($scope.ValidationDataList[i].IsValidate == false) {
                    $('#' + $scope.ValidationDataList[i].ControlName).css('border-color', '');
                    $('#Message' + $scope.ValidationDataList[i].ControlName).html('').css('color', '');
                }

            }
            $scope.ValidationDataList = [];
        }
        $scope.ItemJson.SearchCompany = "";
        $scope.SearchControl.InputItem = "";
        $scope.ItemValueId = 0;
        $scope.AreaSelectedList = [];
        $scope.ProvinceSelectedList = [];
        $scope.RegionSelectedList = [];
        $scope.SubChannelSelectedList = [];
        $scope.GetAllActiveCompanyByItemId();
        $scope.ItemDropdownDisable = false;
        $scope.ItemJson.PageTabHeader = $rootScope.resData.res_TruckUI_Add;

    };

    $scope.AddForm = function () {
        debugger;

        $rootScope.tmpCompanyId = $rootScope.CompanyId;
        $rootScope.CompanyId = 0;
        if ($rootScope.RoleId === 6) {
            $rootScope.IsRPM = "1";
        }
        else {
            $rootScope.IsRPM = "0";
        }
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        //$scope.ItemJson.PageTabHeader = $rootScope.resData.res_TruckUI_Add;
        $scope.GetAllActiveCompanyByItemId();

    }
    $scope.ViewForm = function () {
        debugger;
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.Clear();
        gridCallBack();
    }
    $scope.ViewForm();




    $scope.EditItem = function (id) {
        debugger;
        var requestLayerData =
        {
            ServicesAction: 'GetAllItemSoldToMappingListById',
            ItemId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestLayerData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data.Json.ItemList;
            $scope.ItemValueId = id;
            $scope.isNewAddedItem = "0";
            // add By Vinod yadav on 11-09-2019
            $scope.ItemId = id;
            $scope.SearchControl.InputItem = resoponsedata[0].ItemName + " (" + resoponsedata[0].ItemCode + ")";
            $scope.ItemDropdownDisable = true;
            $scope.AddForm();
            // add By Vinod yadav on 11-09-2019
            $scope.ItemJson.PageTabHeader = "Edit";
        });
    }


    $scope.DeleteTruck = function (id) {
        var requestData =
        {
            ServicesAction: 'DeleteItem',
            ItemId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            gridCallBack();
        });
    }


    //Function to Get All Item By ItemId
    $scope.GetItemById = function (id) {
        var requestLayerData =
        {
            ServicesAction: 'GetAllItemListById',
            ItemId: id
        };

        //var stringfyjson = JSON.stringify(requestData);
        var jsonLayerobject = {};
        jsonLayerobject.Json = requestLayerData;
        GrRequestService.ProcessRequest(jsonLayerobject).then(function (response) {
            debugger;
            var responseStr = response.data.Json;
        });
    };


    $scope.LoadItemView = function (itemCode) {
        debugger;
        $rootScope.ItemCode = itemCode;
        $state.go("ItemDetailPage");
    }

    $scope.ItemId = 0;

    //Function to Get All Company By ItemId





    $scope.AddCompanyToInActiveList = function (CompanyId) {
        debugger;

        var CompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.CompanyId === CompanyId && el.IsActiveForItem === '1' });
        if (CompanyList.length > 0) {
            if (CompanyList[0].IsSelected === undefined || CompanyList[0].IsSelected === false) {
                CompanyList[0].IsSelected = true;
            } else {
                CompanyList[0].IsSelected = false;
            }

        }
    }


    $scope.AddCompanyToActiveList = function (CompanyId) {
        debugger;

        var CompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.CompanyId === CompanyId && el.IsActiveForItem === '0' });
        if (CompanyList.length > 0) {
            if (CompanyList[0].IsSelected === undefined || CompanyList[0].IsSelected === false) {
                CompanyList[0].IsSelected = true;
            } else {
                CompanyList[0].IsSelected = false;
            }

        }
    }

    $scope.TransferSelectedCompanyToInActiveList = function () {
        debugger;
        var CompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsSelected === true; });

        if (CompanyList.length > 0) {
            for (var i = 0; i < CompanyList.length; i++) {
                CompanyList[i].IsSelected = false;
                CompanyList[i].IsAlreadyExcluded = true;
                CompanyList[i].IsActiveForItem = '0';
            }
        }

        $scope.ItemJson.IncludeCheckBox = false;

    }

    $scope.TransferSelectedCompanyToActiveList = function () {
        debugger;
        var CompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsSelected === true; });

        if (CompanyList.length > 0) {
            for (var i = 0; i < CompanyList.length; i++) {
                CompanyList[i].IsSelected = false;
                CompanyList[i].IsAlreadyExcluded = false;
                CompanyList[i].IsActiveForItem = '1';
            }
        }

        $scope.ItemJson.ExcludeCheckBox = false;

    }


    $scope.SelectAllFromIncludeList = function () {
        debugger;
        $scope.SelectAllDistributor('1');
    }

    $scope.SelectAllFromExcludeList = function () {
        debugger;
        $scope.SelectAllDistributor('0');
    }

    $scope.SelectAllDistributor = function (isInclude) {
        debugger;

        var CompanyList = [];

        if (isInclude === "1") {
            CompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsActiveForItem === isInclude && el.IsAreaSelected === '1' && el.IsProvinceSelected === '1' && el.IsRegionSelected === '1' && el.IsSubChannelSelected === '1' });
        }
        else {
            CompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsActiveForItem === isInclude });
        }

        if (CompanyList.length > 0) {
            for (var i = 0; i < CompanyList.length; i++) {

                if (CompanyList[i].IsSelected) {
                    CompanyList[i].IsSelected = false;
                }
                else {
                    CompanyList[i].IsSelected = true;
                }
            }

        }

    }


});