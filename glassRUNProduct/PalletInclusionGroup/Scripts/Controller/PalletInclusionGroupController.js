angular.module("glassRUNProduct").controller('PalletInclusionGroupController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {

    // #region Session
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    // #endregion

    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_PalletInclusionGroup_PageHeading;
    $scope.pageNameDisbale = false;
    $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = false;
        } else {
            $rootScope.Throbber = {
                Visible: false
            };
        }
    };
    $scope.LoadThrobberForPage();



    $scope.SearchControl = {
        InputShipToName: '',
        FilterAutoCompletebox: ''
    };
    $scope.IsEdit = false;
    $scope.ShowTable = false;
    $scope.TruckSizeList = [];
    $scope.PalletLookupInclusionGroupList = [];
    $scope.PalletInclusionGroupList = [];
    $scope.SettingMasterList = [];
    $scope.LoadShipToList = function () {
        //Load data after selection of object and role

        var requestData =
            {
                ServicesAction: 'GetAllShipTOList',
                RoleId: 0,
                ObjectId: 0

            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            if (resoponsedata !== null) {
                if (resoponsedata.Json !== undefined) {
                    $scope.ShipToList = resoponsedata.Json.ShipToList;
                }

            }

        });
    };
    $scope.LoadShipToList();


    $scope.filterLookupData = function () {
        $scope.PalletLookupInclusionGroupList = [];
        var lookuplist
        var PalletInclusionGroup = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'PalletInclusionGroup'; });
        if (PalletInclusionGroup.length > 0) {

            $scope.PalletLookupInclusionGroupList = PalletInclusionGroup;

        }
    }

    $scope.filterLookupData();

    $scope.LoadGridColumns = function (shipTo, shiptoId) {

        $scope.TruckSizeList = [];
        $scope.SearchControl.InputShipToName = shipTo;
        $scope.showPagebox = false;
        $scope.ShowTable = true;


        var requestData =
            {
                ServicesAction: 'GetPalletInclusionGroupList',
                DestinationId: shiptoId,
                ObjectId: 0

            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            if (resoponsedata !== null) {
                if (resoponsedata.Json !== undefined) {
                    $scope.TruckSizeList = resoponsedata.Json.TruckSizeList;
                }

            }

        });
    }

    $scope.ShowPageSearchList = function () {

        if ($scope.showPagebox) {
            $scope.showPagebox = false;
            $scope.selectedPageRow = -1;
        }
        else {
            $scope.showPagebox = true;
            $scope.selectedPageRow = 0;
        }

        $scope.showRolebox = false;
        $scope.selectedRoleRow = -1;
        $scope.showItembox = false;
        $scope.selectedRow = -1;
    }


    $scope.ClearPageInputSearchbox = function () {

        //$scope.ClearOnPageDropDown();
        $scope.showPagebox = true;
        $scope.selectedPageRow = 0;

        $scope.showRolebox = false;
        $scope.selectedRoleRow = -1;
        $scope.showItembox = false;
        $scope.selectedRow = -1;
        $scope.TruckSizeList = [];
        // $scope.GridConfigurationJSON.PageMasterId = 0;
        $scope.SearchControl.InputShipToName = '';

    }



    //#region Load Grid
    $scope.LoadPalletInclusionGroupGrid = function () {

        debugger;
        var PalletInclusionGroupData = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var parameters = {};
                if (loadOptions.sort) {
                    parameters.orderby = loadOptions.sort[0].selector;
                    if (loadOptions.sort[0].desc)
                        parameters.orderby += " desc";
                }

                parameters.skip = loadOptions.skip || 0;
                parameters.take = loadOptions.take || 100;

                var filterOptions = loadOptions.filter ? loadOptions.filter.join(",") : "";
                var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";


                var PalletInclusionGroupCriteria = "";
                var PalletInclusionGroup = "";
                var TruckSizeCriteria = "";
                var TruckSize = "";
                var LocationNameCriteria = "";
                var LocationName = "";
                var TruckCapacityWeight = "";
                var TruckCapacityWeightCriteria = "";
                var TruckCapacityPalettes = "";
                var TruckCapacityPalettesCriteria = "";


                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "PalletInclusionGroup") {
                            PalletInclusionGroupCriteria = columnsList[1];
                            PalletInclusionGroup = columnsList[2];
                        }

                        if (columnsList[0] === "TruckSize") {
                            TruckSizeCriteria = columnsList[1];
                            TruckSize = columnsList[2];
                        }

                        if (columnsList[0] === "LocationName") {
                            LocationNameCriteria = columnsList[1];
                            LocationName = columnsList[2];
                        }
                        if (columnsList[0] === "TruckCapacityWeight") {
                            TruckCapacityWeightCriteria = columnsList[1];
                            TruckCapacityWeight = columnsList[2];
                        }
                        if (columnsList[0] === "TruckCapacityPalettes") {
                            TruckCapacityPalettesCriteria = columnsList[1];
                            TruckCapacityPalettes = columnsList[2];
                        }

                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));


                var requestData =
                    {
                        ServicesAction: 'GetAllPalletInclusionGroupPaging',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: "",
                        OrderByCriteria: "",
                        PalletInclusionGroupCriteria: PalletInclusionGroupCriteria,
                        PalletInclusionGroup: PalletInclusionGroup,
                        TruckSizeCriteria: TruckSizeCriteria,
                        TruckSize: TruckSize,
                        LocationNameCriteria: LocationNameCriteria,
                        LocationName: LocationName,
                        TruckCapacityPalettes: TruckCapacityPalettes,
                        TruckCapacityPalettesCriteria: TruckCapacityPalettesCriteria,
                        TruckCapacityWeight: TruckCapacityWeight,
                        TruckCapacityWeightCriteria: TruckCapacityWeightCriteria
                    };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                    {
                        Json: requestData
                    };

                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {

                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.PalletInclusionGroupList.length !== undefined) {
                                if (resoponsedata.Json.PalletInclusionGroupList.length > 0) {
                                    totalcount = resoponsedata.Json.PalletInclusionGroupList[0].TotalCount;
                                }
                            } else {
                                totalcount = resoponsedata.Json.PalletInclusionGroupList.TotalCount;
                            }

                            ListData = resoponsedata.Json.PalletInclusionGroupList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.PalletInclusionGroupList = $scope.PalletInclusionGroupList.concat(data);
                    // $scope.Gridrepaint();
                    return data;
                });
            }
        });

        $scope.PalletInclusionGroupGrid = {
            dataSource: {
                store: PalletInclusionGroupData
            },
            bindingOptions: {
            },
            showBorders: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            loadPanel: {
                enabled: false,
                Type: Number,
                width: 200
            },
            scrolling: {
                mode: "infinite",
                showScrollbar: "always", // or "onClick" | "always" | "never"
                scrollByThumb: true
            },
            showColumnLines: true,
            showRowLines: true,

            columnChooser: {
                enabled: true,
                mode: "select"
            },
            columnFixing: {
                enabled: true
            },
            groupPanel: {
                visible: true
            },
            keyExpr: "DestinationId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {
                debugger;
                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;
                    if (e.column.cellTemplate === "Edit") {
                        $scope.Action = "Add";
                        $scope.AddTab = true;
                        $scope.ViewTab = false;
                        $scope.IsEdit = true;
                        $scope.LoadGridColumns(data.LocationName, data.DestinationId);
                    }
                }
            },

            columnsAutoWidth: true,
            rowAlternationEnabled: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            headerFilter: {
                visible: false,
                allowSearch: false
            },
            remoteOperations: {
                sorting: true,
                filtering: true,
                paging: true
            },
            paging: {
                pageSize: 20
            },

            columns: [

                {
                    caption: $rootScope.resData.res_PalletInclusionGroup_Ship_To,
                    dataField: "LocationName",
                    alignment: "left",
                    width: 700
                },
                {
                    caption: $rootScope.resData.res_PalletInclusionGroup_Carrier_Group,
                    dataField: "PalletInclusionGroup",
                    alignment: "left",
                    width: 250
                },
                {
                    caption: $rootScope.resData.res_PalletInclusionGroup_Truck_Size,
                    dataField: "TruckSize",
                    alignment: "left",
                    width: 300
                },

                {
                    caption: $rootScope.resData.res_PalletInclusionGroup_No_Of_Pallets,
                    dataField: "TruckCapacityPalettes",
                    alignment: "left",
                    width: 250
                    
                },
                {
                    caption: $rootScope.resData.res_PalletInclusionGroup_Weight,
                    dataField: "TruckCapacityWeight",
                    alignment: "left",
                    width: 200
                    
                }, {
                    caption: "Edit",
                    dataField: "DestinationId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Edit",
                    alignment: "left",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 150
                }



            ]
        };
    };
    $scope.LoadPalletInclusionGroupGrid();


    $scope.Gridrepaint = function () {

        var grid = $("#PalletInclusionGroupGrid").dxDataGrid("instance");
        var colCount = grid.columnCount();
        for (var i = 0; i < colCount; i++) {

            var DataField = grid.columnOption(i, 'dataField');

            if (grid.columnOption(i, 'visible')) {
                if (DataField === 'SettingValue' || DataField === 'PlateNumber') {
                    grid.columnOption(i, 'width', '300');
                }
                else {
                    grid.columnOption(i, 'width', 'auto');
                }
            }
        }
        grid.repaint();
    }


    //#region Refresh DataGrid
    $scope.RefreshDataGrid = function () {

        $scope.PalletInclusionGroupList = [];
        var dataGrid = $("#PalletInclusionGroupGrid").dxDataGrid("instance");
        dataGrid.refresh();
    };
    //#endregion
    //#endregion

    $scope.AddForm = function () {

        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.ClearAllControls();
    };

    $scope.ViewForm = function () {

        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
    };
    $scope.ViewForm();

    $scope.Save = function () {

        if ($scope.TruckSizeList.length > 0) {
            debugger;
            var requestData =
                {
                    ServicesAction: 'UpdatePalletInclusionGroup',
                    TruckSizeList: $scope.TruckSizeList
                };

            var consolidateApiParamater =
                {
                    Json: requestData
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


                $rootScope.ValidationErrorAlert('Record updated successfully', 'success', 3000);

                $scope.RefreshDataGrid();
                $scope.ClearAllControls();

            });
        }
        else {

            $rootScope.ValidationErrorAlert($rootScope.resData.res_PalletInclusionGroup_SaveValidation, 'success', 3000);
        }
    };




    $scope.ClearAllControls = function () {
        $scope.SettingMasterList = [];
        $scope.TruckSizeList = [];
        $scope.ShowTable = false;
        $scope.IsEdit = false;
        $scope.SearchControl.InputShipToName = "";
        $scope.SettingMasterId = 0;

        $scope.pageNameDisbale = false;
    };

    $scope.ShowPallerInclusionInfo = function () {
        $rootScope.ValidationErrorAlert($rootScope.resData.res_PalletInclusionGroup_Information, 'success', 3000);
    }


    $scope.ExportToExcel = function () {

        debugger;
        $rootScope.Throbber.Visible = true;

        $scope.TempGridColumnList = [];

        var tempCol1 = {};
        tempCol1.PropertyName = "LocationName";
        tempCol1.ResourceValue = String.format($rootScope.resData.res_PalletInclusionGroup_Ship_To);
        $scope.TempGridColumnList.push(tempCol1);

        var tempCol2 = {};
        tempCol2.PropertyName = "PalletInclusionGroup";
        tempCol2.ResourceValue = String.format($rootScope.resData.res_PalletInclusionGroup_Carrier_Group);
        $scope.TempGridColumnList.push(tempCol2);

        var tempCol3 = {};
        tempCol3.PropertyName = "TruckSize";
        tempCol3.ResourceValue = String.format($rootScope.resData.res_PalletInclusionGroup_Truck_Size);
        $scope.TempGridColumnList.push(tempCol3);


        var tempCol4 = {};
        tempCol4.PropertyName = "TruckCapacityWeight";
        tempCol4.ResourceValue = String.format($rootScope.resData.res_PalletInclusionGroup_Weight);
        $scope.TempGridColumnList.push(tempCol4);
        var tempCol5 = {};
        tempCol5.PropertyName = "TruckCapacityPalettes";
        tempCol5.ResourceValue = String.format($rootScope.resData.res_PalletInclusionGroup_No_Of_Pallets);
        $scope.TempGridColumnList.push(tempCol5);

        $scope.RequestDataFilter.ServicesAction = "GetAllPalletInclusionGroupDetailsList_ExportTocsv";
        $scope.RequestDataFilter.ColumnList = $scope.TempGridColumnList;
        var jsonobject = {};
        jsonobject.Json = $scope.RequestDataFilter;
        jsonobject.Json.IsExportToExcel = true;


        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
            debugger;
            $rootScope.Throbber.Visible = false;
            var byteCharacters1 = response.data;
            if (response.data !== undefined) {
                var byteCharacters = response.data;
                var blob = new Blob([byteCharacters], {
                    type: "application/Pdf"
                });

                if (blob.size > 0) {
                    $scope.ddMMyyyy = $filter('date')(new Date(), 'ddMMyyyyhhmm');
                    var filName = "PalletInclusionGroupDetails" + $scope.ddMMyyyy + ".csv";
                    saveAs(blob, filName);
                } else {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ItemAllocation_Documentnotgenerated), '', 3000);
                }
            }
            else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ItemAllocation_Documentnotgenerated), '', 3000);
            }
        });
    };


});