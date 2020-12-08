angular.module("glassRUNProduct").controller('GridColumnController', function ($scope, $q, $state, $timeout, $ionicModal, $location, pluginsService, $rootScope, $sessionStorage, GrRequestService) {
    // #region Session
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    // #endregion

    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_GridColumn_PageHeading;

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

    $scope.GridColumnList = [];
    $scope.GridPageList = [];
    $scope.PropertyDataTypeList = [];
    $scope.ResourceList = [];

    $scope.GridColumnJSON = {
        GridColumnId: 0,
        ObjectId: '',
        PropertyName: '',
        PropertyType: '',
        IsControlField: '',
        ResourceKey: '',
        OnScreenDisplay: '',
        IsDetailsViewAvailable: '',
        IsSystemMandatory: '',
        Data1: '',
        Data2: '',
        Data3: '',
        IsActive: 1,
        CreatedBy: '',
        CreatedDate: '',
        ModifiedBy: '',
        ModifiedDate: '',
    };

    $scope.keyup = function (keyEvent) {
        

        if ($scope.GridColumnJSON.PropertyName !== "") {
            var str1 = "res_GridColumn_";
            $scope.GridColumnJSON.ResourceKey = str1;
            var str2 = $scope.GridColumnJSON.PropertyName.replace(/\s+/g, "");
            $scope.GridColumnJSON.ResourceKey = str1.concat(str2);
        }
        else {
            $scope.GridColumnJSON.ResourceKey === '';
        }
    }

    // #region DropDownList
    var dataTypeList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'PropertyDataType'; });
    
    if (dataTypeList.length > 0) {
        $scope.PropertyDataTypeList = dataTypeList;
    }

    $scope.LoadGridPageList = function () {
        
        var requestData =
            {
                ServicesAction: 'LoadGridPage'
            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data !== undefined) {
                if (response.data.Json.GridPageList.length > 0) {
                    $scope.GridPageList = response.data.Json.GridPageList;
                }
            }
            else {
                $scope.GridPageList = [];
            }
        });
    }
    $scope.LoadGridPageList();
    // #endregion

    //#region Load Grid
    $scope.LoadGridColumnGrid = function () {
        

        var GridColumnData = new DevExpress.data.CustomStore({
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

                var PageName = "";
                var PropertyName = "";
                var PropertyType = "";
                //var IsControlField = "";
                var ResourceKey = "";
                //var OnScreenDisplay = "";
                //var IsDetailsViewAvailable = "";
                //var IsSystemMandatory = "";
                //var Data1 = "";
                //var Data2 = "";
                //var Data3 = "";
                var IsActive = "";

                var PageNameCriteria = "";
                var PropertyNameCriteria = "";
                var PropertyTypeCriteria = "";
                //var IsControlFieldCriteria = "";
                var ResourceKeyCriteria = "";
                //var OnScreenDisplayCriteria = "";
                //var IsDetailsViewAvailableCriteria = "";
                //var IsSystemMandatoryCriteria = "";
                //var Data1Criteria = "";
                //var Data2Criteria = "";
                //var Data3Criteria = "";
                var IsActiveCriteria = "";

                
                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "PageName") {
                            PageNameCriteria = columnsList[1];
                            PageName = columnsList[2];
                        }

                        if (columnsList[0] === "PropertyName") {
                            PropertyNameCriteria = columnsList[1];
                            PropertyName = columnsList[2];
                        }

                        if (columnsList[0] === "PropertyType") {
                            PropertyTypeCriteria = columnsList[1];
                            PropertyType = columnsList[2];
                        }

                        //if (columnsList[0] === "IsControlField") {
                        //    IsControlFieldCriteria = columnsList[1];
                        //    IsControlField = columnsList[2];
                        //}

                        if (columnsList[0] === "ResourceKey") {
                            ResourceKeyCriteria = columnsList[1];
                            ResourceKey = columnsList[2];
                        }

                        //if (columnsList[0] === "OnScreenDisplay") {
                        //    OnScreenDisplayCriteria = columnsList[1];
                        //    OnScreenDisplay = columnsList[2];
                        //}

                        //if (columnsList[0] === "IsDetailsViewAvailable") {
                        //    IsDetailsViewAvailableCriteria = columnsList[1];
                        //    IsDetailsViewAvailable = columnsList[2];
                        //}

                        //if (columnsList[0] === "IsSystemMandatory") {
                        //    IsSystemMandatoryCriteria = columnsList[1];
                        //    IsSystemMandatory = columnsList[2];
                        //}

                        if (columnsList[0] === "IsActive") {
                            IsActiveCriteria = columnsList[1];
                            IsActive = columnsList[2];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                
                var requestData =
                    {
                        ServicesAction: 'GetAllGridColumnPaging',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: "",
                        OrderByCriteria: "",

                        PageName: PageName,
                        PropertyName: PropertyName,
                        PropertyType: PropertyType,
                        //IsControlField: IsControlField,
                        ResourceKey: ResourceKey,
                        //OnScreenDisplay: OnScreenDisplay,
                        //IsDetailsViewAvailable: IsDetailsViewAvailable,
                        //IsSystemMandatory: IsSystemMandatory,
                        IsActive: IsActive,

                        PageNameCriteria: PageNameCriteria,
                        PropertyNameCriteria: PropertyNameCriteria,
                        PropertyTypeCriteria: PropertyTypeCriteria,
                        //IsControlFieldCriteria: IsControlFieldCriteria,
                        ResourceKeyCriteria: ResourceKeyCriteria,
                        //OnScreenDisplayCriteria: OnScreenDisplayCriteria,
                        //IsDetailsViewAvailableCriteria: IsDetailsViewAvailableCriteria,
                        //IsSystemMandatoryCriteria: IsSystemMandatoryCriteria,
                        IsActiveCriteria: IsActiveCriteria
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
                            if (resoponsedata.Json.GridColumnList.length !== undefined) {
                                if (resoponsedata.Json.GridColumnList.length > 0) {
                                    totalcount = resoponsedata.Json.GridColumnList[0].TotalCount;
                                }
                            } else {
                                totalcount = resoponsedata.Json.GridColumnList.TotalCount;
                            }

                            ListData = resoponsedata.Json.GridColumnList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.GridColumnList = $scope.GridColumnList.concat(data);
                    return data;
                });
            }
        });

        $scope.GridColumnGrid = {
            dataSource: {
                store: GridColumnData
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
            keyExpr: "GridColumnId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {
                
                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.GridColumnId);
                    }
                    else if (e.column.cellTemplate === "Delete") {
                        $scope.Delete(data.GridColumnId);
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
                    caption: "Page Name",
                    dataField: "PageName",
                    alignment: "left",
                    width: 200
                },
                {
                    caption: "Property Name",
                    dataField: "PropertyName",
                    alignment: "left",
                    width: 150
                },
                {
                    caption: "Property Type",
                    dataField: "PropertyType",
                    alignment: "left",
                    width: 150
                },
                {
                    caption: "Resource Key",
                    dataField: "ResourceKey",
                    alignment: "left",
                    width: 150
                },
                {
                    caption: "IsActive",
                    dataField: "IsActive",
                    alignment: "left",
                    width: 150
                },
                {
                    caption: "Edit",
                    dataField: "GridColumnId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Edit",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 200
                },
                {
                    caption: "Delete",
                    dataField: "GridColumnId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Delete",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 200
                }
            ]
        };
    };
    $scope.LoadGridColumnGrid();

    //#region Refresh DataGrid
    $scope.RefreshDataGrid = function () {
        
        $scope.GridColumnList = [];
        var dataGrid = $("#GridColumnGrid").dxDataGrid("instance");
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
        

        if ($scope.GridColumnJSON.ObjectId === "") {
            alert('Please Select Page.');
            return;
        }

        if ($scope.GridColumnJSON.PropertyName === "") {
            alert('Please Enter Property Name.');
            return;
        }

        if ($scope.GridColumnJSON.ResourceKey <= 0) {
            alert('Please Enter ResourceKey.');
            return;
        }

        var gridColumn = {
            GridColumnId: $scope.GridColumnJSON.GridColumnId,
            ObjectId: $scope.GridColumnJSON.ObjectId,
            PropertyName: $scope.GridColumnJSON.PropertyName,
            PropertyType: $scope.GridColumnJSON.PropertyType,
            IsControlField: $scope.GridColumnJSON.IsControlField,
            ResourceKey: $scope.GridColumnJSON.ResourceKey,
            OnScreenDisplay: $scope.GridColumnJSON.OnScreenDisplay,
            IsDetailsViewAvailable: $scope.GridColumnJSON.IsDetailsViewAvailable,
            IsSystemMandatory: $scope.GridColumnJSON.IsSystemMandatory,
            Data1: $scope.GridColumnJSON.Data1,
            Data2: $scope.GridColumnJSON.Data2,
            Data3: $scope.GridColumnJSON.Data3,
            IsActive: $scope.GridColumnJSON.IsActive,
            CreatedBy: $rootScope.UserId,
            ModifiedBy: $rootScope.UserId
        };

        var GridColumnList = [];
        GridColumnList.push(gridColumn);

        //var resourceKey = {
        //    //CultureId = $rootScope.CultureId,
        //    PageName = 'Grid Column',
        //    ResourceType = $scope.GridColumnJSON.ResourceKey,
        //    ResourceKey = $scope.GridColumnJSON.ResourceKey,
        //    ResourceValue = $scope.GridColumnJSON.PropertyName,
        //    IsActive: $scope.GridColumnJSON.IsActive
        //};

        //var ResourceList = [];
        //ResourceList.push(resourceKey);

        var requestData =
            {
                ServicesAction: 'SaveGridColumn',
                GridColumnList: GridColumnList
                //ResourceList: ResourceList
            };

        var consolidateApiParamater =
            {
                Json: requestData
            };
        
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if ($scope.GridColumnId !== 0) {
                $rootScope.ValidationErrorAlert('Record updated successfully', 'success', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert('Record saved successfully', 'success', 3000);
            }

            $scope.ClearAllControls();
            $scope.ViewForm();
            $scope.RefreshDataGrid();
        });
    };

    $scope.Edit = function (id) {
        

        $scope.AddForm();

        var requestData =
            {
                ServicesAction: 'LoadGridColumnById',
                GridColumnId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data.GridColumn.GridColumnList;
            $scope.GridColumnJSON.GridColumnId = id;
            $scope.GridColumnJSON.ObjectId = resoponsedata[0].ObjectId;
            $scope.GridColumnJSON.PropertyName = resoponsedata[0].PropertyName;
            $scope.GridColumnJSON.PropertyType = resoponsedata[0].PropertyType;
            $scope.GridColumnJSON.IsControlField = resoponsedata[0].IsControlField;
            $scope.GridColumnJSON.ResourceKey = resoponsedata[0].ResourceKey;
            $scope.GridColumnJSON.OnScreenDisplay = resoponsedata[0].OnScreenDisplay;
            $scope.GridColumnJSON.IsDetailsViewAvailable = resoponsedata[0].IsDetailsViewAvailable;
            $scope.GridColumnJSON.IsSystemMandatory = resoponsedata[0].IsSystemMandatory;
            $scope.GridColumnJSON.Data1 = resoponsedata[0].Data1;
            $scope.GridColumnJSON.Data2 = resoponsedata[0].Data2;
            $scope.GridColumnJSON.Data3 = resoponsedata[0].Data3;
            $scope.GridColumnJSON.IsActive = resoponsedata[0].IsActive;
        });
    };

    $scope.Delete = function (id) {
        var requestData =
            {
                ServicesAction: 'SoftDeleteGridColumn',
                GridColumnId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.RefreshDataGrid();
        });
    };

    $scope.ClearAllControls = function () {
        $scope.GridColumnList = [];
        $scope.ResourceList = [];

        $scope.GridColumnJSON.GridColumnId = 0;
        $scope.GridColumnJSON.ObjectId = "";
        $scope.GridColumnJSON.PropertyName = "";
        $scope.GridColumnJSON.PropertyType = "";
        $scope.GridColumnJSON.IsControlField = "";
        $scope.GridColumnJSON.ResourceKey = "";
        $scope.GridColumnJSON.OnScreenDisplay = "";
        $scope.GridColumnJSON.IsDetailsViewAvailable = "";
        $scope.GridColumnJSON.IsSystemMandatory = "";
        $scope.GridColumnJSON.Data1 = "";
        $scope.GridColumnJSON.Data2 = "";
        $scope.GridColumnJSON.Data3 = "";
        $scope.GridColumnJSON.IsActive = 1;
        $scope.GridColumnJSON.CreatedBy = "";
        $scope.GridColumnJSON.CreatedDate = "";
        $scope.GridColumnJSON.ModifiedBy = "";
        $scope.GridColumnJSON.ModifiedDate = "";
    };
});