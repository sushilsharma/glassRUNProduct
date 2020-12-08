angular.module("glassRUNProduct").controller('ActivityLogConfigurationController', function ($scope, $rootScope, $compile, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {

    //#region Declare Throbber
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true
        };
    }
    //#endregion

    //#region Loading Active Session
    // Getting the current active sesion for system.
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    //#endregion

    //#region reload on resources changes
    $rootScope.GridRecallForStatus = function () {


        var griddata = $scope.GridData;
        for (var i = 0; i < griddata.data.length; i++) {
            if (griddata.data[i].PropertyName !== griddata.data[i].ResourceKey) {
                griddata.data[i].ResourceValue = $rootScope.resData[griddata.data[i].ResourceKey];
            }
        }


        $('#GridColumnList').data('kendoGrid').dataSource.read();

        $('#GridColumnList').data('kendoGrid').refresh();
    }
    //#endregion



    //#region Declare variable
    $scope.Ispageload = true;
    $scope.GridConfigurationJSON = {
        RoleMasterId: 0,
        UserId: 0,
        PageId: 0,
        ObjectId: 0
    };
    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_GridConfiguration_GridConfigurationPage;
    $scope.UserList = [];
    $scope.UserSelectedList = [];
    $scope.chkCountifEdit = 0;
    $scope.checkedForRoleData = false;

    $scope.SelectAll = {
        SelectAllColumnForVisible: false,
        SelectAllColumnForDefault: false,
        SelectAllColumnForMandatory: false
    }



    $scope.GridColumnPageList = [];
    $scope.MultiSelectUserDropdownSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true,
        disabled: true
    }
    $scope.GridColumnPreviewList = [];
    $scope.GridColumnDataPreviewList = [];
    $scope.HideAddControl = false;
    $scope.Gridexistinglist = true;

    $scope.ShowSaveButton = false;
    $scope.ShowEditButton = false;
    $scope.EditValue = {
        IsEditMode: false
    }

    //#endregion

    //#region Loading value on page load


    //#region Loading Grid Object List
    $scope.LoadObjectListData = function () {
        // Loading Grid name.

        var requestData =
            {
                ServicesAction: 'GetAllPageControlList',
                ControlType: 2,
                CultureId: $rootScope.CultureId,
                PageId: $scope.GridConfigurationJSON.PageId
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.ObjectList = resoponsedata.PageControl.PageControlList;
        });
    };

    //#endregion

    //#region Load RoleMaster List
    $scope.LoadRoleMasterList = function () {

        var requestData =
            {
                ServicesAction: 'LoadRoleMater',
                PageId: $scope.GridConfigurationJSON.PageId
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.RoleMasterList = resoponsedata.Json.RoleMasterList;
        });
    };

    //#endregion

    //#region Load Page List mapped to grid and role

    $scope.LoadWorkFlowList = function () {
        //Load data after selection of object and role
        debugger;
        var requestData =
            {
                ServicesAction: 'GetAllWorkFlow',
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.WorkflowList = resoponsedata.Workflow.WorkflowList;
        });
    };


    $scope.LoadWorkFlowList();
    //#endregion

    //#region Load UserList By RoleID
    $scope.LoadUsersByRoleMasterId = function (roleId) {


        var requestData =
            {
                ServicesAction: 'LoadUserList',
                RoleId: roleId,
                PageId: $scope.GridConfigurationJSON.PageId,
                ObjectId: $scope.GridConfigurationJSON.ObjectId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.UserList = resoponsedata.Json.ProfileList;


        });
    }

    //#endregion

    //#endregion

    //#region Binding Grid

    $scope.GridColumnList =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) {
                        $rootScope.Throbber.Visible = true;
                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };
                        }


                        $scope.GridConfigurationJSON.UserId = 0;

                        if ($scope.UserSelectedList.length === 1) {
                            $scope.GridConfigurationJSON.UserId = $scope.UserSelectedList[0].Id;
                        }


                        var requestData =
                            {
                                ServicesAction: 'LoadWorkflowActivityConfigurationList',
                                PageIndex: 0,
                                PageSize: 1000,
                                OrderBy: "",
                                RoleId: $scope.GridConfigurationJSON.RoleMasterId,
                                PageId: $scope.GridConfigurationJSON.PageId,
                                LoginId: $scope.GridConfigurationJSON.UserId,
                                CultureId: $rootScope.CultureId,
                                ObjectId: $scope.GridConfigurationJSON.ObjectId
                            };


                        var consolidateApiParamater =
                            {
                                Json: requestData,
                            };
                        $scope.GridColumnPreviewList = [];

                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {



                            var requestDummyData =
                                {
                                    ServicesAction: 'LoadGridColumnPreviewDummyData',
                                    ObjectId: $scope.GridConfigurationJSON.ObjectId
                                };


                            var consolidummydataApiParamater =
                                {
                                    Json: requestDummyData,
                                };



                            GrRequestService.ProcessRequest(consolidummydataApiParamater).then(function (dummydataresponse) {

                                if (dummydataresponse.data !== null) {
                                    if (dummydataresponse.data.Json !== undefined) {
                                        if (dummydataresponse.data.Json.GridColumnDataPreviewList.length !== undefined) {
                                            $scope.GridColumnDataPreviewList = dummydataresponse.data.Json.GridColumnDataPreviewList;

                                            //setTimeout(function () {
                                            //    var queryResult = DevExpress.data.query($scope.GridColumnDataPreviewList).toArray();
                                            //    grid.option("dataSource", queryResult);
                                            //}, 100);
                                        }
                                    }
                                }



                                var totalcount = null;
                                var ListData = null;
                                var resoponsedata = response.data;
                                if (resoponsedata !== null) {
                                    if (resoponsedata.Json !== undefined) {
                                        if (resoponsedata.Json.GridColumnList.length !== undefined) {
                                            if (resoponsedata.Json.GridColumnList.length > 0) {
                                                totalcount = resoponsedata.Json.GridColumnList[0].TotalCount;
                                                $scope.chkCountifEdit = resoponsedata.Json.GridColumnList.filter(function (el) { return parseInt(el.GridColumnConfigurationId) !== 0 }).length;
                                                if ($scope.chkCountifEdit == 0) {
                                                    $scope.checkedForRoleData = true;
                                                }
                                                else {
                                                    $scope.checkedForRoleData = false;
                                                }
                                                for (var i = 0; i < resoponsedata.Json.GridColumnList.length; i++) {

                                                    resoponsedata.Json.GridColumnList[i].IsEditMode = $scope.EditValue.IsEditMode;

                                                    //Updating the list in boolen format.

                                                    resoponsedata.Json.GridColumnList[i].IsPinned = (resoponsedata.Json.GridColumnList[i].IsPinned === "1");
                                                    resoponsedata.Json.GridColumnList[i].IsAvailable = (resoponsedata.Json.GridColumnList[i].IsAvailable === "1");
                                                    resoponsedata.Json.GridColumnList[i].IsDefault = (resoponsedata.Json.GridColumnList[i].IsDefault === "1");
                                                    resoponsedata.Json.GridColumnList[i].IsMandatory = (resoponsedata.Json.GridColumnList[i].IsMandatory === "1");
                                                    resoponsedata.Json.GridColumnList[i].IsSystemMandatory = (resoponsedata.Json.GridColumnList[i].IsSystemMandatory === "1");
                                                    resoponsedata.Json.GridColumnList[i].IsDetailsViewAvailable = (resoponsedata.Json.GridColumnList[i].IsDetailsViewAvailable === "1");
                                                    resoponsedata.Json.GridColumnList[i].IsDetailsView = (resoponsedata.Json.GridColumnList[i].IsDetailsView === "1");
                                                    resoponsedata.Json.GridColumnList[i].IsExportAvailable = (resoponsedata.Json.GridColumnList[i].IsExportAvailable === "1");



                                                    if (resoponsedata.Json.GridColumnList[i].IsSystemMandatory) {
                                                        // setting the property value if columnu is IsSystemMandatory
                                                        resoponsedata.Json.GridColumnList[i].IsMandatory = true;
                                                        resoponsedata.Json.GridColumnList[i].IsDefault = true;
                                                        resoponsedata.Json.GridColumnList[i].IsAvailable = true;

                                                        if ($scope.chkCountifEdit === 0) {
                                                            resoponsedata.Json.GridColumnList[i].IsExportAvailable = true;
                                                            if (resoponsedata.Json.GridColumnList[i].IsDetailsView) {
                                                                resoponsedata.Json.GridColumnList[i].IsDetailsViewAvailable = true;
                                                            }
                                                        }
                                                    }


                                                    if (resoponsedata.Json.GridColumnList[i].IsAvailable) {
                                                        // setting the property value if columnu is IsAvailable
                                                        //$scope.GridColumnListForPreview(resoponsedata.Json.GridColumnList[i], true);

                                                        var item = resoponsedata.Json.GridColumnList[i];

                                                        if ($scope.chkCountifEdit === 0) {
                                                            resoponsedata.Json.GridColumnList[i].IsExportAvailable = true;
                                                            if (resoponsedata.Json.GridColumnList[i].IsDetailsView) {
                                                                resoponsedata.Json.GridColumnList[i].IsDetailsViewAvailable = true;
                                                            }
                                                        }

                                                    }

                                                    if (resoponsedata.Json.GridColumnList[i].IsMandatory) {
                                                        resoponsedata.Json.GridColumnList[i].IsMandatory = true;
                                                        resoponsedata.Json.GridColumnList[i].IsDefault = true;
                                                        resoponsedata.Json.GridColumnList[i].IsAvailable = true;
                                                    }
                                                    else if (resoponsedata.Json.GridColumnList[i].IsDefault) {
                                                        resoponsedata.Json.GridColumnList[i].IsDefault = true;
                                                        resoponsedata.Json.GridColumnList[i].IsAvailable = true;
                                                    } else if (resoponsedata.Json.GridColumnList[i].IsAvailable) {
                                                        resoponsedata.Json.GridColumnList[i].IsAvailable = true;
                                                    }


                                                }

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
                                var gridColumnList = {
                                    data: ListData,
                                    totalRecords: totalcount
                                }



                                $scope.GridData = gridColumnList;
                                options.success(gridColumnList);
                                $scope.values = options;
                                $rootScope.Throbber.Visible = false;

                            });
                        });
                    }
                },
                pageSize: 1000,
                serverPaging: false,
                serverSorting: true,
                serverFiltering: false
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
            sortable: false,
            groupable: false,
            pageable: false,
            filterable: false,
            scrollable: true,
            columnMenu: false,
            mobile: true,
            dataBound: gridDataBound,
            columns: [

                //{
                //    field: "PropertyName", title: $rootScope.resData.res_PropertyName, type: "string", filterable: { mode: "row", extra: false }
                //},
                {
                    field: "ResourceValue", title: $rootScope.resData.res_ResourceValue, type: "string", filterable: false
                },
                {
                    template: "#if(IsEditMode) { #<span class='greenbgfont' ng-show=\"dataItem.IsAvailable\"><i class='fa fa-check'></i></span> <span class='redbgfont' ng-hide=\"dataItem.IsAvailable\"><i class='fa fa-times'></i></span> # } else { #<input type='checkbox' class='checkbox' ng-model=\"dataItem.IsAvailable\" ng-disabled=\"dataItem.IsSystemMandatory\" ng-click='SelectedColumn($event, dataItem,\"IsAvailable\")'/># } #",
                    //title: "#<span><input type='checkbox' ng-model=\'SelectAllColumnForVisible\'  ng-click='SelectAllColumn($event,\"IsAvailableAll\")' /></span>#" + $rootScope.resData.res_Set_Visible_Column,
                    headerTemplate: "<span><input id='SelectAllColumnForVisible' type='checkbox' ng-model=\'SelectAll.SelectAllColumnForVisible\'  ng-click='SelectAllColumn($event,\"IsAvailableAll\")' /></span>" + $rootScope.resData.res_Set_Visible_Column

                },
                {
                    template: "#if(IsEditMode) { #<span class='greenbgfont' ng-show=\"dataItem.IsDefault\"><i class='fa fa-check'></i></span> <span class='redbgfont' ng-hide=\"dataItem.IsDefault\"><i class='fa fa-times'></i></span> # } else { #<input type='checkbox' class='checkbox' ng-model=\"dataItem.IsDefault\" ng-disabled=\"dataItem.IsSystemMandatory\" ng-click='SelectedColumn($event, dataItem,\"IsDefault\")' /># } #",
                    //title: "#<span><input type='checkbox'  ng-model=\'SelectAllColumnForDefault\' ng-click='SelectAllColumn($event,\"IsDefaultAll\")' /></span>#" + $rootScope.resData.res_Set_Default_Column
                    headerTemplate: "<input type='checkbox' id='SelectAllColumnForDefault'  ng-model=\'SelectAll.SelectAllColumnForDefault\' ng-click='SelectAllColumn($event,\"IsDefaultAll\")' /></span>" + $rootScope.resData.res_Set_Default_Column
                },
                {
                    template: "#if(IsEditMode) { #<span class='greenbgfont' ng-show=\"dataItem.IsMandatory\"><i class='fa fa-check'></i></span> <span class='redbgfont' ng-hide=\"dataItem.IsMandatory\"><i class='fa fa-times'></i></span> # } else { #<input type='checkbox' class='checkbox' ng-hide=\"dataItem.IsEditMode\" ng-model=\"dataItem.IsMandatory\" ng-disabled=\"dataItem.IsSystemMandatory\" ng-click='SelectedColumn($event, dataItem,\"IsMandatory\")' /># } #",
                    headerTemplate: "<span> <input type='checkbox' id='SelectAllColumnForMandatory'   ng-model=\'SelectAll.SelectAllColumnForMandatory\'  ng-click='SelectAllColumn($event,\"IsMandatoryAll\")' /> </span>" + $rootScope.resData.res_Set_Mandatory_Column
                },

                {
                    template: "#if(IsSystemMandatory) { #<span class='greenbgfont'><i class='fa fa-check'></i></span> # } else { #<span class='redbgfont'><i class='fa fa-times'></i></span># } #",
                    title: $rootScope.resData.res_System_Mandatory_Column
                },
                {
                    template: "#if(IsEditMode && IsDetailsView) { #<span class='greenbgfont' ng-show=\"dataItem.IsDetailsViewAvailable\"><i class='fa fa-check'></i></span> <span class='redbgfont' ng-hide=\"dataItem.IsDetailsViewAvailable\"><i class='fa fa-times'></i></span> # } else { #<input type='checkbox' ng-show=\"dataItem.IsDetailsView\" class='checkbox'  ng-model=\"dataItem.IsDetailsViewAvailable\" ng-click='SelectedColumn($event, dataItem,\"IsDetailsView\")' /># } #",
                    title: $rootScope.resData.res_Details_View_Column
                },
                {
                    template: "",
                    template: "#if(IsEditMode) { #<span class='greenbgfont' ng-show=\"dataItem.IsExportAvailable\"><i class='fa fa-check'></i></span> <span class='redbgfont' ng-hide=\"dataItem.IsExportAvailable\"><i class='fa fa-times'></i></span> # } else { #<input type='checkbox' class='checkbox' ng-model=\"dataItem.IsExportAvailable\"  ng-click='SelectedColumn($event, dataItem,\"IsExportAvailable\")' /># } #",
                    title: $rootScope.resData.res_Export_Available_Column
                },
            ],
        }

    function gridDataBound(e) {


        var grid = e.sender;
        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">"' + $rootScope.resData.res_GridConfiguration_No_Record_Message + '"</td></tr><table></div>');
        }
    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.GridColumnList.dataSource.transport.read($scope.values);
        }
    };




    $scope.isChecked = function (dataItem) {
        //alert(dataItem.IsAvailable);
        return dataItem.IsAvailable;
    }

    //#endregion

    //#region Save configuration
    $scope.SaveGridConfiguration = function () {


        if ($scope.GridConfigurationJSON.PageId != 0) {
            if ($scope.GridConfigurationJSON.ObjectId != 0) {
                if ($scope.GridConfigurationJSON.RoleMasterId != 0) {
                    var GridColumnConfigurationList = [];

                    //Updateing the grid JSON to get pinned and column Sequence Number
                    $scope.ColumnProperty();

                    var GridColumns = $scope.GridData.data.filter(function (el) { return el.IsAvailable === true });
                    if (GridColumns.length > 0) {
                        $rootScope.Throbber.Visible = true;
                        $scope.CloseSaveConfirmationModalPopup();



                        if ($scope.UserSelectedList.length > 0) {

                            //If selected multiple user then creating list according to them
                            for (var j = 0; j < $scope.UserSelectedList.length; j++) {



                                for (var i = 0; i < GridColumns.length; i++) {

                                    var isActive = false;
                                    if (GridColumns[i].IsAvailable === true) {
                                        isActive = true;
                                    } else {
                                        isActive = false;
                                    }
                                    var gridColumnList = {
                                        GridColumnConfigurationId: GridColumns[i].GridColumnConfigurationId,
                                        RoleId: $scope.GridConfigurationJSON.RoleMasterId,
                                        LoginId: $scope.UserSelectedList[j].Id,
                                        GridColumnId: GridColumns[i].GridColumnId,
                                        ObjectId: GridColumns[i].ObjectId,
                                        PageId: $scope.GridConfigurationJSON.PageId,
                                        IsDefault: GridColumns[i].IsDefault,
                                        IsAvailable: GridColumns[i].IsAvailable,
                                        IsPinned: GridColumns[i].IsPinned,
                                        IsMandatory: GridColumns[i].IsMandatory,
                                        IsDetailsViewAvailable: GridColumns[i].IsDetailsViewAvailable,
                                        IsExportAvailable: GridColumns[i].IsExportAvailable,
                                        IsSystemMandatory: GridColumns[i].IsSystemMandatory,
                                        SequenceNumber: GridColumns[i].SequenceNumber,
                                        IsActive: isActive,
                                        CreatedBy: $rootScope.UserId
                                    }
                                    GridColumnConfigurationList.push(gridColumnList);
                                }


                            }

                        } else {

                            //If no user is selected 
                            for (var i = 0; i < GridColumns.length; i++) {

                                var isActive = false;
                                if (GridColumns[i].IsAvailable === true) {
                                    isActive = true;
                                } else {
                                    isActive = false;
                                }
                                var gridColumnList = {
                                    GridColumnConfigurationId: GridColumns[i].GridColumnConfigurationId,
                                    RoleId: $scope.GridConfigurationJSON.RoleMasterId,
                                    LoginId: $scope.GridConfigurationJSON.UserId,
                                    GridColumnId: GridColumns[i].GridColumnId,
                                    ObjectId: GridColumns[i].ObjectId,
                                    PageId: $scope.GridConfigurationJSON.PageId,
                                    IsDefault: GridColumns[i].IsDefault,
                                    IsAvailable: GridColumns[i].IsAvailable,
                                    IsPinned: GridColumns[i].IsPinned,
                                    IsMandatory: GridColumns[i].IsMandatory,
                                    IsSystemMandatory: GridColumns[i].IsSystemMandatory,
                                    SequenceNumber: GridColumns[i].SequenceNumber,
                                    IsDetailsViewAvailable: GridColumns[i].IsDetailsViewAvailable,
                                    IsExportAvailable: GridColumns[i].IsExportAvailable,
                                    IsActive: isActive,
                                    CreatedBy: $rootScope.UserId
                                }
                                GridColumnConfigurationList.push(gridColumnList);
                            }
                        }


                        // Calling Services acction for inserting or updating the record.
                        var requestData =
                            {
                                ServicesAction: 'SaveGridColumnConfiguration',
                                GridColumnConfigurationList: GridColumnConfigurationList
                            };


                        var jsonobject = {};
                        jsonobject.Json = requestData;
                        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

                            var resoponsedata = response.data;
                            $scope.ClearGrid();
                            $scope.BindingExistingConfiguration();
                            $rootScope.Throbber.Visible = false;
                            //$rootScope.ValidationErrorAlert('Grid Configuration Save Successfully.', '', 3000);
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_SaveSuccess), '', 3000);
                        });

                    } else {
                        //$rootScope.ValidationErrorAlert('Please Select Column.', '', 3000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_SelectColumn), '', 3000);
                    }
                } else {
                    //$rootScope.ValidationErrorAlert('Please Select Page.', '', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_SelectRole), '', 3000);
                }
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_SelectObject), '', 3000);
                //$rootScope.ValidationErrorAlert('Please Select Role.', '', 3000);

            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_SelectPage), '', 3000);
            //$rootScope.ValidationErrorAlert('Please Select Role.', '', 3000);

        }
    }
    //#endregion

    //#region Selected Action on row
    $scope.SelectedColumn = function (ev, item, columnName) {

        var data = $scope.GridData.data.filter(function (el) { return el.GridColumnId === item.GridColumnId; });
        if (data.length > 0) {
            if (columnName === "IsDetailsView") {
                data[0]["IsDetailsViewAvailable"] = ev.target.checked;
            }
            else {
                data[0][columnName] = ev.target.checked;
            }
            $scope.SelectAll.SelectAllColumnForVisible = false;
            if (ev.target.checked === false) {

                switch (columnName) {
                    case 'IsAvailable':
                        data[0].IsDefault = ev.target.checked;
                        data[0].IsMandatory = ev.target.checked;
                        data[0].IsPinned = ev.target.checked;
                        data[0].IsDetailsViewAvailable = ev.target.checked;
                        data[0].IsExportAvailable = ev.target.checked;
                        break;
                    case 'IsDefault':
                        data[0].IsMandatory = ev.target.checked;
                        data[0].IsDefault = ev.target.checked;
                        $scope.PreviewReset(data[0].PropertyName, 'visible', ev.target.checked);
                        break;
                    case 'IsMandatory':
                        data[0].IsMandatory = ev.target.checked;
                        $scope.PreviewReset(data[0].PropertyName, 'allowHiding', true);
                        break;
                    case 'IsDetailsView':
                        data[0].IsDetailsViewAvailable = ev.target.checked;
                        break;
                    case 'IsExportAvailable':
                        data[0].IsExportAvailable = ev.target.checked;
                        break;
                }
            }
            else {
                switch (columnName) {
                    case 'IsAvailable':
                        data[0].IsExportAvailable = ev.target.checked;
                        if (data[0].IsDetailsView) {
                            data[0].IsDetailsViewAvailable = ev.target.checked;
                        }
                        break;
                    case 'IsDefault':
                        data[0].IsExportAvailable = ev.target.checked;
                        data[0].IsAvailable = ev.target.checked;
                        data[0].IsDefault = ev.target.checked;
                        $scope.PreviewReset(data[0].PropertyName, 'visible', true);
                        break;
                    case 'IsExportAvailable':
                        data[0].IsExportAvailable = ev.target.checked;

                        break;
                    case 'IsDetailsView':
                        data[0].IsDetailsViewAvailable = ev.target.checked;

                        break;
                    case 'IsMandatory':
                        data[0].IsExportAvailable = ev.target.checked;
                        data[0].IsAvailable = ev.target.checked;
                        data[0].IsDefault = ev.target.checked;
                        data[0].IsMandatory = ev.target.checked;
                        $scope.PreviewReset(data[0].PropertyName, 'allowHiding', false);
                        break;
                }
                data[0].IsAvailable = ev.target.checked;
            }
        }

        if (columnName === "IsDetailsView") {
            item["IsDetailsViewAvailable"] = ev.target.checked;
        }
        else {
            item[columnName] = ev.target.checked;
        }


        if (ev.target.checked === false) {
            switch (columnName) {
                case 'IsAvailable':
                    item.IsDefault = ev.target.checked;
                    item.IsMandatory = ev.target.checked;
                    item.IsPinned = ev.target.checked;
                    item.IsDetailsViewAvailable = ev.target.checked;
                    item.IsExportAvailable = ev.target.checked;
                    break;
                case 'IsDefault':
                    item.IsMandatory = ev.target.checked;
                    item.IsDefault = ev.target.checked;

                    $scope.PreviewReset(item.PropertyName, 'visible', ev.target.checked);
                    break;
                case 'IsMandatory':
                    item.IsMandatory = ev.target.checked;
                    $scope.PreviewReset(item.PropertyName, 'allowHiding', true);
                    break;
                case 'IsDetailsView':
                    item.IsDetailsViewAvailable = ev.target.checked;
                    break;
                case 'IsExportAvailable':
                    item.IsExportAvailable = ev.target.checked;
                    break;
            }

        }
        else {
            switch (columnName) {

                case 'IsAvailable':
                    item.IsExportAvailable = ev.target.checked;
                    if (item.IsDetailsView) {
                        item.IsDetailsViewAvailable = ev.target.checked;
                    }
                    break;
                case 'IsDefault':
                    item.IsExportAvailable = ev.target.checked;
                    item.IsAvailable = ev.target.checked;
                    item.IsDefault = ev.target.checked;
                    $scope.PreviewReset(item.PropertyName, 'visible', true);
                    break;
                case 'IsExportAvailable':
                    item.IsExportAvailable = ev.target.checked;

                    break;
                case 'IsDetailsView':
                    item.IsDetailsViewAvailable = ev.target.checked;
                    break;
                case 'IsMandatory':
                    item.IsExportAvailable = ev.target.checked;
                    item.IsAvailable = ev.target.checked;
                    item.IsDefault = ev.target.checked;
                    item.IsMandatory = ev.target.checked;
                    $scope.PreviewReset(item.PropertyName, 'allowHiding', false);
                    break;
            }

            item.IsAvailable = ev.target.checked;
        }

        //Setting the grid preview ...
        $scope.GridColumnListForPreview(data[0], ev.target.checked, columnName);
    }
    //#endregion

    //#region Auto Complete box
    //#region Search Functionality And Select Index Change Event Of Object List (Search Control).
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
    $scope.ItemInputSelecteChangeEvent = function (input) {

        if (input.length > 0) {
            $scope.showItembox = true;
            $scope.selectedRow = 0;
        } else {
            $scope.showItembox = false;
            $scope.selectedRow = -1;
        }
        $scope.SearchControl.FilterAutoCompletebox = input;
    }
    $scope.ClearItemInputSearchbox = function () {

        $scope.showItembox = false;
        $scope.ClearItemRecord();
    }
    $scope.ClearItemRecord = function () {

        $scope.showItembox = false;
        $scope.selectedRow = -1;
        $scope.GridConfigurationJSON.ObjectId = 0;
        $scope.SearchControl.InputItem = '';


        $scope.showRolebox = false;
        $scope.selectedRoleRow = -1;
        $scope.GridConfigurationJSON.RoleMasterId = 0;
        $scope.SearchControl.InputRoleItem = '';


        $scope.ClearOnObjectDropDown();


    }

    $scope.ShowObjectSearchList = function () {

        if ($scope.showItembox) {
            $scope.showItembox = false;
            $scope.selectedRow = -1;
        }
        else {
            $scope.showItembox = true;
            $scope.selectedRow = 0;
        }


        $scope.showRolebox = false;
        $scope.selectedRoleRow = -1;
        $scope.showPagebox = false;
        $scope.selectedPageRow = -1;
    }

    $scope.LoadObjectDropdown = function (ObjectName, ObjectId) {

        $scope.GridConfigurationJSON.ObjectId = ObjectId;
        $scope.SearchControl.InputItem = ObjectName;
        $scope.showItembox = false;


        $scope.showRolebox = false;
        $scope.selectedRoleRow = -1;
        $scope.GridConfigurationJSON.RoleMasterId = 0;
        $scope.SearchControl.InputRoleItem = '';

        $scope.ClearOnObjectDropDown();
        $scope.LoadRoleMasterList();

        //$scope.GridColumnPreviewList = [];
        //gridCallBack();

    }
    //#endregion

    //#region Search Functionality And Select Index Change Event Of RoleMaster List (Search Control).
    $scope.ItemRoleSearchInputDefaultSetting = function () {
        $scope.SearchControl = {
            InputRoleItem: '',
            FilterRoleAutoCompletebox: ''
        };
        $scope.selectedRoleRow = -1;
        $scope.showRolebox = false;
        $rootScope.foundResult = false;
    }
    $scope.ItemRoleSearchInputDefaultSetting();
    $scope.RoleInputSelecteChangeEvent = function (input) {

        if (input.length > 0) {
            $scope.showRolebox = true;
            $scope.selectedRoleRow = 0;
        } else {
            $scope.showRolebox = false;
            $scope.selectedRoleRow = -1;
        }
        $scope.SearchControl.FilterRoleAutoCompletebox = input;
    }

    $scope.ClearRoleInputSearchbox = function () {

        $scope.showRolebox = true;
        $scope.selectedRoleRow = 0;



        $scope.showPagebox = false;
        $scope.selectedPageRow = -1;
        $scope.showItembox = false;
        $scope.selectedRow = -1;

        $scope.GridConfigurationJSON.RoleMasterId = 0;
        $scope.SearchControl.InputRoleItem = '';

    }

    $scope.ShowRoleSearchList = function () {


        if ($scope.showRolebox) {

            $scope.showRolebox = false;
            $scope.selectedRoleRow = -1;
        }
        else {
            $scope.showRolebox = true;
            $scope.selectedRoleRow = 0;
        }

        $scope.showPagebox = false;
        $scope.selectedPageRow = -1;
        $scope.showItembox = false;
        $scope.selectedRow = -1;
    }



    $scope.LoadPagesByRole = function (RoleName, RoleMasterId) {


        $scope.GridConfigurationJSON.RoleMasterId = RoleMasterId;
        $scope.SearchControl.InputRoleItem = RoleName;
        $scope.showRolebox = false;
        var myEl = angular.element(document.querySelector('#htmlPrview'));
        myEl.empty();
        $scope.GridColumnPreviewList = [];
        $scope.UserSelectedList = [];
        $scope.LoadUsersByRoleMasterId(RoleMasterId);
        $scope.GridColumnPreviewList = [];
        gridCallBack();
    }
    //#endregion

    //#region Search Functionality And Select Index Change Event Of Page List (Search Control).
    $scope.ItemPageSearchInputDefaultSetting = function () {
        $scope.SearchControl = {
            InputPageItem: '',
            FilterPageAutoCompletebox: ''
        };
        $scope.selectedPageRow = -1;
        $scope.showPagebox = false;
        $rootScope.foundResult = false;
    }
    $scope.ItemPageSearchInputDefaultSetting();
    $scope.PageInputSelecteChangeEvent = function (input) {

        if (input.length > 0) {
            $scope.showPagebox = true;
            $scope.selectedPageRow = 0;
        } else {
            $scope.showPagebox = false;
            $scope.selectedPageRow = -1;
        }
        $scope.SearchControl.FilterPageAutoCompletebox = input;
    }

    $scope.ClearPageInputSearchbox = function () {

        $scope.ClearOnPageDropDown();
        $scope.showPagebox = true;
        $scope.selectedPageRow = 0;

        $scope.showRolebox = false;
        $scope.selectedRoleRow = -1;
        $scope.showItembox = false;
        $scope.selectedRow = -1;

        $scope.GridConfigurationJSON.PageMasterId = 0;
        $scope.SearchControl.InputPageItem = '';

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



    $scope.LoadRoleList = function (PageName, PageMasterId) {

        $scope.GridConfigurationJSON.PageId = PageMasterId;
        $scope.SearchControl.InputPageItem = PageName;
        $scope.ClearOnPageDropDown();
        $scope.showPagebox = false;
        $scope.LoadRoleMasterList();
       
    }
    //#endregion
    //#endregion

    //#region Select All
    //#region Select All IsAvailable Column
    $scope.SelectAllVisibleColumn = function (ev) {

        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();
        if (ev.target.checked === true) {
            $scope.CheckedVisibleColumns(items);

        } else {
            $scope.UnCheckedVisibleColumns(items);
        }
    }
    $scope.CheckedVisibleColumns = function (items) {


        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.GridColumnId === item.GridColumnId });
            if (data.length > 0) {
                data[0]['IsAvailable'] = true;
                data[0]['IsDetailsViewAvailable'] = true;
                data[0]['IsExportAvailable'] = true;

                item['IsAvailable'] = true;
                item['IsDetailsViewAvailable'] = true;
                item['IsExportAvailable'] = true;
                //$scope.GridColumnListForPreview(data[0], true, "VisibleAll");
            }
        });
        $scope.SelectAll.SelectAllColumnForVisible = true;
    }
    $scope.UnCheckedVisibleColumns = function (items) {


        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.GridColumnId === item.GridColumnId });
            if (data.length > 0) {

                if (!data[0].IsSystemMandatory) {
                    data[0].IsAvailable = false;
                    item.IsAvailable = false;

                    data[0].IsDefault = false;
                    item.IsDefault = false;

                    data[0].IsMandatory = false;
                    item.IsMandatory = false;

                    data[0].IsPinned = false;
                    item.IsPinned = false;
                }
                data[0]['IsDetailsViewAvailable'] = false;
                data[0]['IsExportAvailable'] = false;

                item['IsDetailsViewAvailable'] = false;
                item['IsExportAvailable'] = false;


                $scope.GridColumnListForPreview(data[0], false, "VisibleAll");
            }

        });
        $scope.SelectAll.SelectAllColumnForVisible = false;
    }
    //#endregion

    //#region Comman Select All
    $scope.SelectAllColumn = function (ev, columnSelected) {


        if (!$scope.EditValue.IsEditMode) {
            var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
            var items = grid.dataSource.data();
            $rootScope.Throbber.Visible = true;
            $scope.CheckedAndUnCheckedColumns(items, ev.target.checked, columnSelected);
            $rootScope.Throbber.Visible = false;
        }

    }
    $scope.CheckedAndUnCheckedColumns = function (items, Ischecked, columnSelected) {

        $scope.GridColumnPreviewList = [];
        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.GridColumnId === item.GridColumnId });
            if (data.length > 0) {
                if (!data[0].IsSystemMandatory) {
                    if (Ischecked) {
                        switch (columnSelected) {
                            case 'IsAvailableAll':
                                $scope.SelectAll.SelectAllColumnForVisible = Ischecked;
                                data[0].IsExportAvailable = Ischecked;
                                item.IsExportAvailable = Ischecked;
                                if (data[0].IsDetailsView) {
                                    data[0].IsDetailsViewAvailable = Ischecked;
                                    item.IsDetailsViewAvailable = Ischecked;
                                }
                                break;
                            case 'IsDefaultAll':
                                $scope.SelectAll.SelectAllColumnForVisible = Ischecked;
                                $scope.SelectAll.SelectAllColumnForDefault = Ischecked;
                                data[0].IsExportAvailable = Ischecked;
                                data[0].IsAvailable = Ischecked;
                                data[0].IsDefault = Ischecked;

                                item.IsExportAvailable = Ischecked;
                                item.IsAvailable = Ischecked;
                                item.IsDefault = Ischecked;


                                break;
                            case 'IsExportAvailableAll':
                                data[0].IsExportAvailable = Ischecked;
                                item.IsExportAvailable = Ischecked;

                                break;
                            case 'IsDetailsViewAll':
                                //data[0].IsDetailsView = Ischecked;
                                //item.IsDetailsView = Ischecked;

                                break;
                            case 'IsMandatoryAll':

                                $scope.SelectAll.SelectAllColumnForVisible = Ischecked;
                                $scope.SelectAll.SelectAllColumnForDefault = Ischecked;
                                $scope.SelectAll.SelectAllColumnForMandatory = Ischecked;

                                data[0].IsExportAvailable = Ischecked;
                                data[0].IsAvailable = Ischecked;
                                data[0].IsDefault = Ischecked;
                                data[0].IsMandatory = Ischecked;

                                item.IsExportAvailable = Ischecked;
                                item.IsAvailable = Ischecked;
                                item.IsDefault = Ischecked;
                                item.IsMandatory = Ischecked;
                                break;
                        }
                        data[0].IsAvailable = Ischecked;

                        item.IsAvailable = Ischecked;
                    }
                    else {

                        switch (columnSelected) {
                            case 'IsAvailableAll':

                                $scope.SelectAll.SelectAllColumnForVisible = Ischecked;
                                $scope.SelectAll.SelectAllColumnForDefault = Ischecked;
                                $scope.SelectAll.SelectAllColumnForMandatory = Ischecked;

                                data[0].IsExportAvailable = Ischecked;
                                data[0].IsAvailable = Ischecked;
                                data[0].IsDefault = Ischecked;
                                data[0].IsMandatory = Ischecked;
                                //data[0].IsDetailsView = Ischecked;

                                //item.IsDetailsView = Ischecked;
                                item.IsExportAvailable = Ischecked;
                                item.IsAvailable = Ischecked;
                                item.IsDefault = Ischecked;
                                item.IsMandatory = Ischecked;

                                break;
                            case 'IsDefaultAll':


                                $scope.SelectAll.SelectAllColumnForDefault = Ischecked;


                                data[0].IsDefault = Ischecked;
                                item.IsDefault = Ischecked;
                                break;
                            case 'IsExportAvailableAll':
                                data[0].IsExportAvailable = Ischecked;
                                item.IsExportAvailable = Ischecked;

                                break;
                            case 'IsDetailsViewAll':
                                //data[0].IsDetailsView = Ischecked;
                                //item.IsDetailsView = Ischecked;

                                break;
                            case 'IsMandatoryAll':
                                $scope.SelectAll.SelectAllColumnForMandatory = Ischecked;
                                data[0].IsMandatory = Ischecked;
                                item.IsMandatory = Ischecked;
                                break;
                        }
                    }
                }


                var item = data[0];
                var column = {
                    PropertyName: item.PropertyName,
                    PropertyType: item.PropertyType,
                    IsControlField: item.IsControlField,
                    OnScreenDisplay: item.OnScreenDisplay,
                    IsAvailable: item.IsAvailable,
                    IsDefault: item.IsDefault,
                    IsMandatory: item.IsMandatory,
                    IsPinned: item.IsPinned,
                    IsDetailsViewAvailable: item.IsDetailsViewAvailable,
                    IsExportAvailable: item.IsExportAvailable,
                    IsSystemMandatory: item.IsSystemMandatory,
                    GridColumnId: item.GridColumnId,
                    ResourceValue: item.ResourceValue,
                    SequenceNumber: item.SequenceNumber
                }
                $scope.GridColumnPreviewList.push(column);
            }
        });



        //$scope.PreviewGrid();




        //setTimeout(function () {
        for (var i = 0; i < $scope.GridColumnPreviewList.length; i++) {

            // Creating dynimical column and adding property to them.

            var columnoption = {
                caption: $scope.GridColumnPreviewList[i].ResourceValue,
                fixed: $scope.GridColumnPreviewList[i].IsPinned,
                allowExporting: $scope.GridColumnPreviewList[i].IsExportAvailable,
                allowFiltering: true,
                dataField: $scope.GridColumnPreviewList[i].PropertyName,
                allowHiding: ($scope.GridColumnPreviewList[i].IsSystemMandatory || $scope.GridColumnPreviewList[i].IsMandatory) ? false : true,
                visible: (($scope.GridColumnPreviewList[i].IsSystemMandatory || $scope.GridColumnPreviewList[i].IsMandatory || $scope.GridColumnPreviewList[i].IsDefault) && $scope.GridColumnPreviewList[i].IsAvailable) ? true : false,
                visibleIndex: parseInt($scope.GridColumnPreviewList[i].SequenceNumber)
            };
            grid.addColumn(columnoption);

            grid.option("dataSource", []);
            grid.option("dataSource", $scope.GridColumnDataPreviewList);
        }

    }
    //#endregion



    //#region Select All  Default Column
    $scope.SelectAllDefaultColumn = function (ev) {

        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();
        if (ev.target.checked === true) {
            $scope.CheckedDefaultColumns(items);

        } else {
            $scope.UnCheckedDefaultColumns(items);
        }
    }
    $scope.CheckedDefaultColumns = function (items) {


        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.GridColumnId === item.GridColumnId });
            if (data.length > 0) {
                data[0].IsAvailable = true;
                item.IsAvailable = true;

                data[0].IsDefault = true;
                item.IsDefault = true;

                data[0].IsExportAvailable = true;
                item.IsExportAvailable = true;


                //$scope.GridColumnListForPreview(data[0], true, "DefaultAll");
                $scope.PreviewReset(data[0].PropertyName, 'visible', true);
            }

        });
        $scope.SelectAll.SelectAllColumnForVisible = true;
        $scope.SelectAll.SelectAllColumnForDefault = true;
    }
    $scope.UnCheckedDefaultColumns = function (items) {


        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.GridColumnId === item.GridColumnId });
            if (data.length > 0) {
                if (!data[0].IsSystemMandatory) {


                    data[0].IsDefault = false;
                    item.IsDefault = false;

                    $scope.GridColumnListForPreview(data[0], false, "DefaultAll");

                }
            }
        });

        $scope.SelectAllColumnForDefault = false;
    }
    //#endregion

    //#region Select All Mandatory Column
    $scope.SelectAllMandatoryColumn = function (ev) {

        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();
        if (ev.target.checked === true) {
            $scope.CheckedMandatoryColumns(items);

        } else {
            $scope.UnCheckedMandatoryColumns(items);
        }
    }





    $scope.CheckedMandatoryColumns = function (items) {


        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.GridColumnId === item.GridColumnId });
            if (data.length > 0) {
                data[0].IsAvailable = true;
                item.IsAvailable = true;

                data[0].IsDefault = true;
                item.IsDefault = true;

                data[0].IsMandatory = true;
                item.IsMandatory = true;

                data[0].IsExportAvailable = true;
                item.IsExportAvailable = true;

                //$scope.GridColumnListForPreview(data[0], true, "MandatoryAll");

                $scope.PreviewReset(item.PropertyName, 'allowHiding', false);
                $scope.PreviewReset(data[0].PropertyName, 'visible', true);
            }

        });
        $scope.SelectAll.SelectAllColumnForVisible = true;
        $scope.SelectAll.SelectAllColumnForDefault = true;
        $scope.SelectAll.SelectAllColumnForMandatory = true;
    }
    $scope.UnCheckedMandatoryColumns = function (items) {


        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.GridColumnId === item.GridColumnId });
            if (data.length > 0) {
                if (!data[0].IsSystemMandatory) {



                    data[0].IsMandatory = false;
                    item.IsMandatory = false;


                }

                $scope.GridColumnListForPreview(data[0], false, "MandatoryAll");
                $scope.PreviewReset(item.PropertyName, 'allowHiding', true);
            }

        });
        $scope.SelectAll.SelectAllColumnForVisible = false;
        $scope.SelectAll.SelectAllColumnForDefault = false;
        $scope.SelectAll.SelectAllColumnForMandatory = false;
    }
    //#endregion

    //#endregion

    //#region Clear control's and grid
    $scope.ClearGrid = function () {

        $scope.Ispageload = true;
        $scope.treeSelectedValue = '';
        $scope.checkedForRoleData = false;
        $scope.GridConfigurationJSON.RoleMasterId = 0;
        $scope.GridConfigurationJSON.PageId = 0;
        $scope.GridConfigurationJSON.ObjectId = 0;
        $scope.SearchControl.InputPageItem = '';
        $scope.SearchControl.InputRoleItem = '';
        $scope.SearchControl.InputItem = '';
        $scope.GridColumnDataPreviewList = [];
        $scope.GridColumnPreviewList = [];
        $scope.chkCountifEdit = 0;
        $scope.GridData = [];

        //grid.option('dataSource', []);
        $scope.UserList = [];
        $scope.UserSelectedList = [];
        gridCallBack();
        $scope.ExistingListSection();
        $scope.ShowSaveButton = false;
        $scope.ShowEditButton = false;
        $scope.EditPageDisable = false;
        $scope.EditObjectDisable = false;
        $scope.EditRoleDisable = false;
        $scope.EditValue.IsEditMode = false;
        $scope.showRolebox = false;
        $scope.showPagebox = false;
        $scope.showItembox = false;
        $scope.SelectAll.SelectAllColumnForVisible = false;
        $scope.SelectAll.SelectAllColumnForDefault = false;
        $scope.SelectAll.SelectAllColumnForMandatory = false;
    }
    //#endregion



    //#region Popup Save Confirmation

    $scope.SaveConfirmationModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/SaveConfirmation.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {

            $scope.SaveConfirmationPopup = modal;
        });
    }
    $scope.SaveConfirmationModalPopup();
    $scope.OpenSaveConfirmationPopup = function () {

        if ($scope.chkCountifEdit !== 0) {
            $scope.SaveConfirmationPopup.show();
        }
        else {
            $scope.SaveGridConfiguration();
        }

    }
    $scope.CloseSaveConfirmationModalPopup = function () {

        $scope.SaveConfirmationPopup.hide();
    }

    //#endregion

    //#region Popup Delete Confirmation

    $scope.DeleteConfirmationModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/DeleteConfirmation.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {

            $scope.DeleteConfirmationPopup = modal;
        });
    }
    $scope.DeleteConfirmationModalPopup();
    $scope.OpenDeleteConfirmationModalPopup = function () {

        $scope.DeleteConfirmationPopup.show();
    }

    $scope.CloseDeleteConfirmationModalPopup = function () {

        $scope.DeleteConfirmationPopup.hide();
    }

    //#endregion

    //#region Binding existing GridConfiguration list
    $scope.BindingExistingConfiguration = function () {
        $scope.GridColumnPageList = [];
        var requestData =
            {
                ServicesAction: 'LoadWorkflowActivityConfigurationList',
                ObjectId: $scope.GridConfigurationJSON.ObjectId
            };


        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            $scope.GridColumnPageList = response.data.Json.GridColumnPageList;
            $rootScope.Throbber.Visible = false;
        });
    }

    $scope.BindingExistingConfiguration();
    //#endregion

    //#region Hiding panel section

    $scope.DropdownSection = function () {
        $scope.HideAddControl = true;
        $scope.Gridexistinglist = false;
        $scope.ShowSaveButton = true;
        $scope.ShowEditButton = false;
        $scope.EditValue.IsEditMode = false;
        $scope.ShowCheckBoxOnHeader('');
        gridCallBack();
    }


    $scope.ShowCheckBoxOnHeader = function (displayValue) {

        var divSelectAllColumnForVisible = document.getElementById('SelectAllColumnForVisible');
        divSelectAllColumnForVisible.style.display = displayValue;

        var divSelectAllColumnForDefault = document.getElementById('SelectAllColumnForDefault');
        divSelectAllColumnForDefault.style.display = displayValue;

        var divSelectAllColumnForMandatory = document.getElementById('SelectAllColumnForMandatory');
        divSelectAllColumnForMandatory.style.display = displayValue;
    }

    $scope.AddNewGridConfiguration = function () {
        $scope.ClearGrid();
        $scope.HideAddControl = true;
        $scope.Gridexistinglist = false;
        $scope.ShowSaveButton = true;
        $scope.ShowEditButton = false;
        $scope.EditValue.IsEditMode = false;
        $scope.Ispageload = false;
        $scope.ShowCheckBoxOnHeader('');
    }


    $scope.ExistingListSection = function () {
        $scope.HideAddControl = false;
        $scope.Gridexistinglist = true;
    }
    //#endregion

    //#region Binding Grid on edit
    $scope.LoadRecordOnEdit = function (ColumnCount, RoleId, LoginId, PageId, ObjectId, Username, PageName, RoleName, ObjectName, rowguid) {
        ///Binding Dropdown.


        $scope.ShowCheckBoxOnHeader('none');

        var dd = $scope.GridColumnPageList;

        if (parseInt(ColumnCount) > 0) {
            $scope.SearchControl.InputPageItem = PageName;
            $scope.SearchControl.InputRoleItem = RoleName;
            $scope.SearchControl.InputItem = ObjectName;

            $rootScope.Throbber.Visible = true;
            var requestData =
                {
                    ServicesAction: 'LoadUserList',
                    RoleId: RoleId
                };

            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {

                $scope.Ispageload = false;
                $scope.UserSelectedList = [];
                $scope.EditValue.IsEditMode = true;
                var resoponsedata = response.data;
                $scope.UserList = resoponsedata.Json.ProfileList;

                $scope.treeSelectedValue = rowguid;
                if (parseInt(LoginId) != 0) {
                    var bindUser = { Id: LoginId.toString() };
                    $scope.UserSelectedList.push(bindUser);
                }
                ///Binding Grid..
                $scope.SelectedUsername = Username;
                $scope.GridConfigurationJSON.RoleMasterId = RoleId;
                $scope.GridConfigurationJSON.PageId = PageId;
                $scope.GridConfigurationJSON.UserId = LoginId;
                $scope.GridConfigurationJSON.ObjectId = ObjectId;
                $scope.GridColumnPreviewList = [];
                //$scope.DropdownSection();

                gridCallBack();
                $scope.ShowSaveButton = false;
                $scope.ShowEditButton = true;

                $scope.EditPageDisable = true;
                $scope.EditObjectDisable = true;
                $scope.EditRoleDisable = true;
            });
        }

    }

    $scope.ClearSearchBox = function () {

        $scope.SearchControl.SearchBox = '';
    }


    //#endregion

    //#region Delete Configuration




    $scope.SoftDeleteGridColumnConfiguration = function () {


        var GridColumnConfigurationList = [];
        $scope.CloseDeleteConfirmationModalPopup();
        //If no user is selected 
        $rootScope.Throbber.Visible = true;
        var gridColumnList = {
            RoleId: $scope.GridConfigurationJSON.RoleMasterId,
            LoginId: $scope.GridConfigurationJSON.UserId,
            PageId: $scope.GridConfigurationJSON.PageId,
            ObjectId: $scope.GridConfigurationJSON.ObjectId,
            CreatedBy: $rootScope.UserId
        }
        GridColumnConfigurationList.push(gridColumnList);

        // Calling Services acction for inserting or updating the record.
        var requestData =
            {
                ServicesAction: 'SoftDeleteGridColumnConfiguration',
                GridColumnConfigurationList: GridColumnConfigurationList
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $scope.ClearGrid();
            $rootScope.Throbber.Visible = false;
            $scope.BindingExistingConfiguration();
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_DeletedSuccess), '', 3000);
        });


    }

    //#endregion

    //#region Clearing Dropdown on action.
    $scope.ClearOnPageDropDown = function () {
        $scope.ObjectList = [];
        $scope.RoleMasterList = [];
        $scope.UserList = [];
        $scope.GridColumnPreviewList = [];
        $scope.UserSelectedList = [];


        $scope.GridConfigurationJSON.RoleMasterId = 0;
        $scope.SearchControl.InputRoleItem = '';

        $scope.GridConfigurationJSON.ObjectId = 0;
        $scope.SearchControl.InputItem = '';
    }


    $scope.ClearOnObjectDropDown = function () {

        $scope.RoleMasterList = [];
        $scope.UserList = [];
        $scope.GridColumnPreviewList = [];
        $scope.UserSelectedList = [];


        $scope.GridConfigurationJSON.RoleMasterId = 0;
        $scope.SearchControl.InputRoleItem = '';

    }

    //#endregion

    $scope.OpenPageAndObjectDetails = function (data) {

        var ff = $scope.GridColumnPageList;

        if (data.isChecked === "0") {
            data.isChecked = "1";
        } else {
            data.isChecked = "0";
        }
    }


}).filter('highlight', function ($sce) {
    return function (text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span class="highlighted">$1</span>')
        return $sce.trustAsHtml(text)
    }
});