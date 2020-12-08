angular.module("glassRUNProduct").controller('VehicleSizeController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {

    // alert('dd');
    LoadActiveVariables($sessionStorage, $state, $rootScope);


    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    $scope.EditMode = false;

    $scope.TruckSizeId = 0;
    $scope.TruckSizeList = [];
    $scope.SelectedId_TruckSizeGrid = 0;
    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;

    //#region Delete Add Grid Data with Confirmation
    $ionicModal.fromTemplateUrl('WarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.DeleteWarningMessageControl = modal;
    });


    $scope.CloseDeleteConfirmation = function () {
        $scope.DeleteWarningMessageControl.hide();
    };

    $scope.OpenDeleteConfirmation = function () {

        $scope.DeleteWarningMessageControl.show();
    };


    $ionicModal.fromTemplateUrl('ActiveInActiveWarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ActiveInActiveWarningMessageControl = modal;
    });


    $scope.CloseActiveInActiveWarningMessageConfirmation = function () {
        $scope.ActiveInActiveWarningMessageControl.hide();
    };

    $scope.OpenActiveInActiveWarningMessageConfirmation = function () {

        $scope.ActiveInActiveWarningMessageControl.show();
    };


    $scope.PageCompanyHeaderView = true;
    $scope.TruckSizeDeailsJSON = {
        VehicleType: 0,
        TruckSize: "",
        TruckCapacityPalettes: 0,
        TruckCapacityWeight: 0,
        Height: 0,
        Width: 0,
        Length: 0,
    }



    $scope.filterLookupData = function () {

        var lookuplist
        var objVehicleType = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'VehicleType'; });

        if (objVehicleType.length > 0) {

            $scope.VehicleTypeList = objVehicleType;
        }
    }

    $scope.filterLookupData();

    //#region Load EventRetrySetting Grid
    $scope.LoadEventRetrySettingsGrid = function () {


        console.log("1" + new Date());

        var TruckSizeData = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                debugger;
                var parameters = {};
                var OrderBy = "";
                var OrderByCriteria = "";
                if (loadOptions.sort) {
                    parameters.orderby = loadOptions.sort[0].selector;
                    if (loadOptions.sort[0].desc)
                        OrderBy = parameters.orderby += " desc";
                    else {
                        OrderBy = parameters.orderby += " ASC";
                    }
                }
                else {
                    var OrderBy = "";
                }

                parameters.skip = loadOptions.skip || 0;
                parameters.take = loadOptions.take || 100;

                var filterOptions = loadOptions.filter ? loadOptions.filter.join(",") : "";
                var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";

                var VehicleType = "";
                var VehicleTypeCriteria = "";

                var TruckSize = "";
                var TruckSizeCriteria = "";

                var TruckCapacityPalettes = "";
                var TruckCapacityPalettesCriteria = "";

                var TruckCapacityWeight = '';
                var TruckCapacityWeightCriteria = '';
                var Height = '';
                var HeightCriteria = '';
                var Width = '';
                var WidthCriteria = '';
                var Length = '';
                var LengthCriteria = '';

                var Height = '';
                var HeightCriteria = '';
                var Width = '';
                var WidthCriteria = '';
                var Length = '';
                var LengthCriteria = '';

                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');
                        if (columnsList[0] === "VehicleType") {
                            VehicleTypeCriteria = columnsList[1];
                            VehicleType = columnsList[2];
                        }
                        if (columnsList[0] === "TruckSize") {
                            TruckSizeCriteria = columnsList[1];
                            TruckSize = columnsList[2];
                        }
                        if (columnsList[0] === "TruckCapacityPalettes") {
                            TruckCapacityPalettesCriteria = columnsList[1];
                            TruckCapacityPalettes = columnsList[2];
                        }
                        if (columnsList[0] === "TruckCapacityWeight") {
                            TruckCapacityWeightCriteria = columnsList[1];
                            TruckCapacityWeight = columnsList[2];
                        }
                        if (columnsList[0] === "Width") {
                            WidthCriteria = columnsList[1];
                            Width = columnsList[2];
                        }
                        if (columnsList[0] === "Height") {
                            HeightCriteria = columnsList[1];
                            Height = columnsList[2];
                        }
                        if (columnsList[0] === "Length") {
                            LengthCriteria = columnsList[1];
                            Length = columnsList[2];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));


                var requestData =
                {
                    ServicesAction: 'LoadTruckSizeDetails',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: OrderBy,
                    OrderByCriteria: OrderByCriteria,

                    VehicleType: VehicleType,
                    VehicleTypeCriteria: VehicleTypeCriteria,
                    TruckSize: TruckSize,
                    TruckSizeCriteria: TruckSizeCriteria,
                    TruckCapacityPalettes: TruckCapacityPalettes,
                    TruckCapacityPalettesCriteria: TruckCapacityPalettesCriteria,

                    TruckCapacityWeight: TruckCapacityWeight,
                    TruckCapacityWeightCriteria: TruckCapacityWeightCriteria,
                    Height: Height,
                    HeightCriteria: HeightCriteria,
                    Width: Width,
                    WidthCriteria: WidthCriteria,
                    Length: Length,
                    LengthCriteria: LengthCriteria,
                };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                {
                    Json: requestData,
                };

                console.log("2" + new Date());
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {

                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.TruckSizeList.length !== undefined) {
                                if (resoponsedata.Json.TruckSizeList.length > 0) {
                                    totalcount = resoponsedata.Json.TruckSizeList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.TruckSizeList.TotalCount;
                            }

                            ListData = resoponsedata.Json.TruckSizeList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.TruckSizeList = $scope.TruckSizeList.concat(data);
                    console.log("3" + new Date());
                    if ($scope.GridConfigurationLoaded === false) {
                        $scope.LoadGridByConfiguration();
                    }
                    $rootScope.Throbber.Visible = false;
                    return data;
                });
            }
        });

        $scope.TruckSizeGrid = {
            dataSource: {
                store: TruckSizeData,
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
                Width: 200
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
            keyExpr: "EventRetrySettingsId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.TruckSizeId);
                    }
                    if (e.column.cellTemplate === "Delete") {
                        $scope.Delete_TruckSize(data.TruckSizeId);
                        // $scope.Delete(data.TruckSizeId);
                    }
                }
            },
            //onRowClick: function (e) {
            //    if ($scope.IsColumnDetailView === false) {
            //        $state.go("TrackerPage");
            //    }
            //},

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

            //loadPanel: {
            //    Type: Number,
            //    Width: 200
            //},

            columns: [
                {

                    dataField: "VehicleType",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left",
                    caption: $rootScope.resData.res_VehicleSize_VehicleType,
                    //Width: 150
                },
                {

                    dataField: "TruckSize",
                    alignment: "left",
                    caption: $rootScope.resData.res_VehicleSize_TruckSize,
                },
                {

                    dataField: "TruckCapacityPalettes",
                    alignment: "left",
                    caption: $rootScope.resData.res_VehicleSize_TruckCapacityPalettes,
                },
                {

                    dataField: "TruckCapacityWeight",
                    alignment: "left",
                    caption: $rootScope.resData.res_VehicleSize_TruckCapacityWeight,
                    // allowFiltering: false,
                    // allowSorting: false
                },
                {

                    dataField: "Height",
                    alignment: "left",
                    caption: $rootScope.resData.res_VehicleSize_Height,
                    // allowFiltering: false,
                    // allowSorting: false
                },
                {

                    dataField: "Width",
                    alignment: "left",
                    caption: $rootScope.resData.res_VehicleSize_Width,
                    // allowFiltering: false,
                    // allowSorting: false
                },
                {

                    dataField: "Length",
                    alignment: "left",
                    caption: $rootScope.resData.res_VehicleSize_Length,
                    // allowFiltering: false,
                    // allowSorting: false
                },
                {

                    dataField: "CreatedDate",
                    alignment: "left",
                    caption: $rootScope.resData.res_VehicleSize_CreatedDate,
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    filterOperations: ['=', '>', '<'],
                    // allowFiltering: false,
                    // allowSorting: false
                },
                {
                    caption: "Edit",
                    dataField: "EventRetrySettingsId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Edit",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    Width: 150
                },
                {
                    caption: $rootScope.resData.res_VehicleSize_ActionColumn,
                    dataField: "EventRetrySettingsId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "ActiveInActiveTemplate",
                    alignment: "left",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 150
                }
                //{
                //    caption: "Delete",
                //    dataField: "EventRetrySettingsId",
                //    cssClass: "ClickkableCell EnquiryNumberUI",
                //    cellTemplate: "Delete",
                //    alignment: "Right",
                //    allowFiltering: false,
                //    allowSorting: false,
                //    Width: 150
                //}
            ]
        };
    }
    //#endregion

    //#region Grid Configuration
    $scope.LoadGridConfigurationData = function () {

        var objectId = 227;

        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                ObjectId: objectId,
                ObjectName: 'VehicleSize',
                PageName: $rootScope.PageName,
                ControllerName: page
            };

        var gridconsolidateApiParamater =
            {
                Json: gridrequestData,
            };

        console.log("-2" + new Date());

        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
            if (response.data.Json != undefined) {
                $scope.GridColumnList = response.data.Json.GridColumnList;
                if ($scope.GridConfigurationLoaded === false) {
                    $scope.LoadGridByConfiguration();
                }
                console.log("0" + new Date());
                //$scope.ObjectMappingGrid();



                if ($scope.IsRefreshGrid === true) {
                    $scope.RefreshDataGrid();
                }
            } else {
            }
        });
    }

    $scope.LoadGridConfigurationData();
    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {

        $scope.PaymentSlabList = [];
        var dataGrid = $("#TruckSizeGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

    $scope.LoadEventRetrySettingsGrid();

    $scope.GridConfigurationLoaded = false;

    $scope.LoadGridByConfiguration = function (e) {

        console.log("9" + new Date());

        var dataGrid = $("#TruckSizeGrid").dxDataGrid("instance");

        for (var i = 0; i < $scope.GridColumnList.length; i++) {
            if ($scope.GridColumnList[i].IsAvailable === "0" || $scope.GridColumnList[i].IsAvailable === "false" || $scope.GridColumnList[i].IsAvailable === false) {
                dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visible", false);
                dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", false);
            }
            else {
                dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visibleIndex", parseInt($scope.GridColumnList[i].SequenceNumber));
                if ($scope.GridColumnList[i].IsMandatory === "1" || $scope.GridColumnList[i].IsSystemMandatory === "1") {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", false);
                } else {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", true);
                }

                if ($scope.GridColumnList[i].IsPinned === "1" || $scope.GridColumnList[i].IsPinned === "true" || $scope.GridColumnList[i].IsPinned === true) {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "fixed", true);
                }

                if ($scope.GridColumnList[i].IsDefault === "0" || $scope.GridColumnList[i].IsDefault === "false" || $scope.GridColumnList[i].IsDefault === false) {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visible", false);
                }

                if ($scope.GridColumnList[i].IsGrouped === "1") {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "groupIndex", parseInt($scope.GridColumnList[i].GroupSequence));
                }

                if ($scope.GridColumnList[i].IsDetailsViewAvailable === "1" || $scope.GridColumnList[i].IsDetailsViewAvailable === "true" || $scope.GridColumnList[i].IsDetailsViewAvailable === true) {
                    if ($scope.GridColumnList[i].PropertyName === "EnquiryAutoNumber") {
                        dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "cssClass", "ClickkableCell EnquiryNumberUI UnderlineTextUI");
                    }
                } else {
                    if ($scope.GridColumnList[i].PropertyName === "EnquiryAutoNumber") {
                        dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "cssClass", "ClickkableCell EnquiryNumberUI");
                    }
                }
            }

            if ($scope.GridColumnList[i].PropertyName !== "CheckedEnquiry") {
                dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "caption", $scope.GridColumnList[i].ResourceValue);
            }
        }
        $scope.GridConfigurationLoaded = true;
        console.log("10" + new Date());
    }



    $scope.ClearControls = function () {

        $scope.TruckSizeDeailsJSON.VehicleType = 0;
        $scope.TruckSizeDeailsJSON.TruckSize = "";
        $scope.TruckSizeDeailsJSON.TruckCapacityPalettes = 0;
        $scope.TruckSizeDeailsJSON.TruckCapacityWeight = 0;
        $scope.TruckSizeDeailsJSON.Height = 0;
        $scope.TruckSizeDeailsJSON.Width = 0;
        $scope.TruckSizeDeailsJSON.Length = 0;
        $scope.TruckSizeId = 0;
        $scope.EditMode = false;
    }

    $scope.AddForm = function () {
        //
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.ClearControls();
    }

    $scope.ViewForm = function () {
        //
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.ClearControls();
        //$scope.RefreshDataGrid();
    }


    $scope.ViewForm();

    $scope.Edit = function (id) {
        $rootScope.Throbber.Visible = true;

        debugger;
        $scope.AddForm();

        $scope.EditMode = true;

        var requestData =
        {
            ServicesAction: 'GetTruckDetailsById',
            TruckSizeId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (response.data.Json != undefined) {
                var responsedata = response.data.Json.TruckList[0];
                $scope.TruckSizeId = responsedata.TruckSizeId;
                $scope.TruckSizeDeailsJSON.VehicleType = responsedata.VehicleTypeId;
                $scope.TruckSizeDeailsJSON.TruckSize = responsedata.TruckSize;
                $scope.TruckSizeDeailsJSON.TruckCapacityPalettes = responsedata.TruckCapacityPalettes;
                $scope.TruckSizeDeailsJSON.TruckCapacityWeight = responsedata.TruckCapacityWeight;
                $scope.TruckSizeDeailsJSON.Height = responsedata.Height;
                $scope.TruckSizeDeailsJSON.Width = responsedata.Width;
                $scope.TruckSizeDeailsJSON.Length = responsedata.Length;
                $rootScope.Throbber.Visible = false;
            }
            //else {
            //    $rootScope.Throbber.Visible = false;
            //}
        });
    }


    $scope.Save = function () {
        debugger;

        $rootScope.Throbber.Visible = true;
        //alert($rootScope.Throbber.Visible);

        var status = true;
        if ($scope.TruckSizeDeailsJSON.VehicleType !== 0 && $scope.TruckSizeDeailsJSON.VehicleType !== undefined && $scope.TruckSizeDeailsJSON.VehicleType !== "" && $scope.TruckSizeDeailsJSON.VehicleType !== null) {
            if ($scope.TruckSizeDeailsJSON.TruckSize !== "" && $scope.TruckSizeDeailsJSON.TruckSize !== undefined && $scope.TruckSizeDeailsJSON.TruckSize !== null && $scope.TruckSizeDeailsJSON.TruckSize !== 0) {
                if ($scope.TruckSizeDeailsJSON.TruckCapacityWeight !== "" && $scope.TruckSizeDeailsJSON.TruckCapacityWeight !== undefined && $scope.TruckSizeDeailsJSON.TruckCapacityWeight !== null && $scope.TruckSizeDeailsJSON.TruckCapacityWeight !== 0) {
                    if (status === true) {
                        var serviceaction = "";
                        if ($scope.TruckSizeId !== 0) {
                            serviceaction = 'InsertTruck';
                        }
                        else {
                            serviceaction = 'InsertTruck';
                        }
                        var requestData =
                        {

                            ServicesAction: serviceaction,
                            TruckSizeId: $scope.TruckSizeId,
                            VehicleType: $scope.TruckSizeDeailsJSON.VehicleType,
                            TruckSize: $scope.TruckSizeDeailsJSON.TruckSize,
                            TruckCapacityPalettes: $scope.TruckSizeDeailsJSON.TruckCapacityPalettes,
                            TruckCapacityWeight: $scope.TruckSizeDeailsJSON.TruckCapacityWeight,
                            Height: $scope.TruckSizeDeailsJSON.Height,
                            Width: $scope.TruckSizeDeailsJSON.Width,
                            Length: $scope.TruckSizeDeailsJSON.Length,
                            IsActive: true,
                            CreatedBy: $rootScope.UserId,
                            PageName: 'Transport Vehicle Types',
                            RoleId: $rootScope.RoleId,
                            UserId: $rootScope.UserId
                        };

                        var consolidateApiParamater =
                        {
                            Json: requestData
                        };


                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                            if (response.data.Json != undefined) {
                                if (response.data.Json.TruckSizeId === '-1') {
                                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_VehicleSize_VehicleSizeRecordExistsMsg), '', 3000);
                                    $rootScope.Throbber.Visible = false;
                                }
                                else {
                                    if ($scope.TruckSizeId !== 0) {
                                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_VehicleSize_VehicleSizeUpdateMsg), '', 3000);
                                        $rootScope.Throbber.Visible = false;
                                    }
                                    else {
                                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_VehicleSize_VehicleSizeSaveMsg), '', 3000);
                                        $rootScope.Throbber.Visible = false;
                                    }
                                    $scope.ClearControls();
                                    $scope.ViewForm();
                                    $scope.RefreshDataGrid();
                                }
                            }
                            else {
                                $rootScope.ValidationErrorAlert(response.data.ErrorValidationMessage +  String.format($rootScope.resData.res_ServerSideVlaidationMsg_View), '', 3000);
                                $rootScope.Throbber.Visible = false;
                            }
                        });
                    }
                    else {
                        $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
                        $rootScope.Throbber.Visible = false;
                    }
                }
                else {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_VehicleSize_WeightCapacityMsg), '', 3000);
                    $rootScope.Throbber.Visible = false;
                }

            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_VehicleSize_TruckSizeMsg), '', 3000);
                $rootScope.Throbber.Visible = false;
            }

        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_VehicleSize_VehicleTypeMsg), '', 3000);
            $rootScope.Throbber.Visible = false;
        }

    }


    $scope.DeleteYes = function () {
        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'DeleteTruck',
            TruckSizeId: $scope.SelectedId_TruckSizeGrid,
            UpdatedBy: $rootScope.UserId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_VehicleSize_VehicleSizeDeleteMsg), '', 3000);
            $scope.ViewForm();
            $scope.RefreshDataGrid();
            $rootScope.Throbber.Visible = false;
            $scope.CloseDeleteConfirmation();

        });
    }

    $scope.Delete_TruckSize = function (Id) {
        $scope.SelectedId_TruckSizeGrid = Id;
        $scope.DeleteWarningMessageControl.show();
    }

    $scope.filterValue = function ($event) {

        var regex = new RegExp("^[0-9.]*$");
        // var regex = new RegExp("^[0-9]+(\.[0-9]{1,2})*$");

        var key = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);
        if (!regex.test(key)) {
            $event.preventDefault();
        }
    };

    $scope.ActiveInActiveVehicleSizeConfirmation = function (Id, isAction) {
        $scope.SelectedIdVehicleSizeId = Id;
        $scope.SelectedIdVehicleSizeAction = isAction;
        $scope.OpenActiveInActiveWarningMessageConfirmation();
    }

    $scope.ActiveInActiveVehicleSize = function () {
        debugger;
        var isActive = false;
        if ($scope.SelectedIdVehicleSizeAction === "1") {
            isActive = true;
        }
        else {
            isActive = false;
        }

        var requestData =
                {
                    ServicesAction: 'DeleteTruck',
                    TruckSizeId: $scope.SelectedIdVehicleSizeId,
                    IsActive: isActive,
                    ModifiedBy: $rootScope.UserId
                };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $scope.CloseActiveInActiveWarningMessageConfirmation();
            $scope.ViewForm();
            $scope.RefreshDataGrid();

            if ($scope.SelectedIdVehicleSizeAction === "1") {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_VehicleSize_ActivateMessage), '', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_VehicleSize_InActivateMessage), '', 3000);
            }

            $rootScope.Throbber.Visible = false;
        });
    };

});