angular.module("glassRUNProduct").controller('ItemController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, GrRequestService) {
    

    
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    
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
        
        // var resoponsedata = JSON.parse(JSON.parse(response.data));
        var resoponsedata = response.data.Json.UnitOfMeasureList;
        $scope.bindUnitOfMeasureList = resoponsedata;
        //$scope.GetCreditLimitOfCustomer();
    });
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
                        
                        var orderby = "";
                        var config = "";

                        var ItemName = "";
                        var ItemCode = "";

                        var ItemNameCriteria = "";
                        var ItemCodeCriteria = "";

                        

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
                                ServicesAction: 'LoadItemDertails',
                                PageIndex: options.data.page - 1,
                                PageSize: 50,
                                OrderBy: "",
                                ItemName: ItemName,
                                ItemNameCriteria: ItemNameCriteria,
                                ItemCode: ItemCode,
                                ItemCodeCriteria: ItemCodeCriteria,
                                CompanyId: 0
                            };


                        var consolidateApiParamater =
                            {
                                Json: requestData,

                            };


                        

                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            

                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;
                            totalcount = resoponsedata.Json.ItemList[0].TotalCount
                            ListData = resoponsedata.Json.ItemList;
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
                { field: "UOM", title: $rootScope.resData.res_GridColumn_UOM, type: "string", filterable: { mode: "row", extra: false } },
                { field: "Amount", title: $rootScope.resData.res_GridColumn_Amount, template: "{{dataItem.Amount | currency : 'EUR'}}", type: "string", filterable: { mode: "row", extra: false } },

                {
                    field: "Edit",
                    "template": "<button class=\"k-button\" ng-click=\"EditItem(#=ItemId#)\"><i class='fa fa-pencil'></i></a>",
                    "title": $rootScope.resData.res_GridColumn_Edit, "width": "6%"
                },
                {
                    field: "ItemAction",
                    template: "<input type='checkbox' class='checkbox' ng-model=\"dataItem.IsActive\" ng-click='onCheckBoxClick($event, dataItem)' />",
                    title: $rootScope.resData.res_GridColumn_ItemAction,
                    width: "50px"
                },

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
        
        $rootScope.Throbber.Visible = true;
        ChangeGridHeaderTitleByLanguage($scope.ViewItemGrid, "ViewItemGridId", $rootScope.resData);
        gridCallBack();
    }

    $scope.onCheckBoxClick = function (ev, item) {
        
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
    }



    $scope.SaveItem = function () {

        var NotActiveCompanyList = [];
        if ($scope.AllActiveCompanyList.length > 0) {
            NotActiveCompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsActiveForItem === '0' });
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

        var item = {
            ItemId: $scope.ItemId,
            ItemName: $scope.ItemJson.Item,
            ItemCode: $scope.ItemJson.ItemCode,
            Amount: $scope.ItemJson.Price,
            PrimaryUnitOfMeasure: $scope.ItemJson.UOM,
            UOM: $scope.ItemJson.UOM,
            ProductType: 9,
            StockInQuantity: 1500,
            CreatedBy: $rootScope.UserId,
            CompanyList: NotActiveCompanyList


        }



        var itemList = [];
        itemList.push(item);

        var requestData =
            {
                ServicesAction: 'InsertItem',
                ItemList: itemList
            };



        var consolidateApiParamater =
            {
                Json: requestData,
            };
        
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
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


    $scope.Clear = function () {
        
        $scope.AllActiveCompanyList = [];
        $scope.ItemJson.Item = "";
        $scope.ItemJson.ItemCode = "";
        $scope.ItemJson.UOM = "";
        $scope.ItemJson.Price = "";
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
    }

    $scope.AddForm = function () {
        
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.GetAllActiveCompanyByItemId();

    }
    $scope.ViewForm = function () {
        
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.Clear();
        gridCallBack();
    }
    $scope.ViewForm();




    $scope.EditItem = function (id) {
        
        var requestLayerData =
            {
                ServicesAction: 'GetAllItemListById',
                ItemId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestLayerData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data.Json.ItemList;
            $scope.ItemId = id;
            $scope.ItemJson.Item = resoponsedata[0].ItemName;
            $scope.ItemJson.ItemCode = resoponsedata[0].ItemCode;
            $scope.ItemJson.UOM = resoponsedata[0].PrimaryUnitOfMeasure;
            $scope.ItemJson.Price = resoponsedata[0].Price;
            //$scope.TruckJson.Capacity = resoponsedata[0].TruckCapacityWeight;

            $scope.AddForm();
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
            
            var responseStr = response.data.Json;
        });
    };


    $scope.LoadItemView = function (itemCode) {
        
        $rootScope.ItemCode = itemCode;
        $state.go("ItemDetailPage");
    }

    $scope.ItemId = 0;

    //Function to Get All Company By ItemId
    $scope.GetAllActiveCompanyByItemId = function () {
        var requestLayerData =
            {
                ServicesAction: 'GetAllCompanyListByItemId',
                ItemId: $scope.ItemId,
                Status: 0
            };
        var jsonLayerobject = {};
        jsonLayerobject.Json = requestLayerData;
        GrRequestService.ProcessRequest(jsonLayerobject).then(function (response) {
            
            $scope.AllActiveCompanyList = response.data.Json.CompanyList;



        });
    };




    $scope.AddCompanyToInActiveList = function (CompanyId) {
        

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
        
        var CompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsSelected === true; });

        if (CompanyList.length > 0) {
            for (var i = 0; i < CompanyList.length; i++) {
                CompanyList[i].IsSelected = false;
                CompanyList[i].IsActiveForItem = '0';
            }
        }

        $scope.ItemJson.IncludeCheckBox = false;

    }

    $scope.TransferSelectedCompanyToActiveList = function () {
        
        var CompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsSelected === true; });

        if (CompanyList.length > 0) {
            for (var i = 0; i < CompanyList.length; i++) {
                CompanyList[i].IsSelected = false;
                CompanyList[i].IsActiveForItem = '1';
            }
        }

        $scope.ItemJson.ExcludeCheckBox = false;

    }


    $scope.SelectAllFromIncludeList = function () {
        
        $scope.SelectAllDistributor('1');
    }

    $scope.SelectAllFromExcludeList = function () {
        
        $scope.SelectAllDistributor('0');
    }

    $scope.SelectAllDistributor = function (isInclude) {
        

        var CompanyList = $scope.AllActiveCompanyList.filter(function (el) { return el.IsActiveForItem === isInclude });
        if (CompanyList.length > 0) {
            for (var i = 0; i < CompanyList.length; i++) {
                CompanyList[i].IsSelected = true;
            }

        }

    }

});