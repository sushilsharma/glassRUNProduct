angular.module("glassRUNProduct").controller('EventRetrySettingsController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    

    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.EventRetrySettingsList = [];
    $scope.EventRetrySettingsId = 0;


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

    $scope.GetAllNotificationTypeMasterDetails = function () {
        
        $rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'GetAllNotificationTypeMasterDetails'

            };


        var consolidateApiParamater =
            {
                Json: requestData,

            };


        

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data.Json != undefined) {
                if (response.data.Json.NotificationTypeMasterList.length > 0) {

                    $rootScope.NotificationTypeMasterList = response.data.Json.NotificationTypeMasterList;
                    $rootScope.Throbber.Visible = false;
                }


            }
        });

    }

    $scope.LoadAllEventMasternDetails = function () {
        
        $rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'GetAllEventMasterDetailsList'

            };


        var consolidateApiParamater =
            {
                Json: requestData,

            };


        

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data.Json != undefined) {
                if (response.data.Json.EventMasterList.length > 0) {

                    $rootScope.EventMasterList = response.data.Json.EventMasterList;
                    $rootScope.Throbber.Visible = false;
                }


            }
        });

    }

    $scope.GetAllNotificationTypeMasterDetails();
    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;
    $scope.LoadAllEventMasternDetails();


    //#endregion

    $scope.EventRetrySettingsJSON = {
        EventMasterId: 0,
        NotificationTypeMasterId: 0,
        RetryCount: 0,
        RetryInterval: 0
    }

    //#region Load EventRetrySetting Grid
    $scope.LoadEventRetrySettingGrid = function () {
        

        console.log("1" + new Date());

        var EventRetrySettingData = new DevExpress.data.CustomStore({
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

                var EventName = "";
                var EventNameCriteria = "";

                var NotificationTypeName = "";
                var NotificationTypeNameCriteria = "";

                var RetryCount = "";
                var RetryCountCriteria = "";

                
                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "EventName") {
                            EventNameCriteria = columnsList[1];
                            EventName = columnsList[2];
                        }

                        if (columnsList[0] === "NotificationTypeName") {
                            NotificationTypeNameCriteria = columnsList[1];
                            NotificationTypeName = columnsList[2];
                        }
                        if (columnsList[0] === "RetryCount") {
                            RetryCountCriteria = columnsList[1];
                            RetryCount = columnsList[2];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                
                var requestData =
                {
                    ServicesAction: 'LoadEventRetrysettings',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: "",//OrderBy,
                    OrderByCriteria: "",//OrderByCriteria,

                    EventName: EventName,
                    EventNameCriteria: EventNameCriteria,
                    NotificationTypeName: NotificationTypeName,
                    NotificationTypeNameCriteria: NotificationTypeNameCriteria,
                    RetryCount: RetryCount,
                    RetryCountCriteria: RetryCountCriteria
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
                            if (resoponsedata.Json.EventRetrySettingsList.length !== undefined) {
                                if (resoponsedata.Json.EventRetrySettingsList.length > 0) {
                                    totalcount = resoponsedata.Json.EventRetrySettingsList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.EventRetrySettingsList.TotalCount;
                            }

                            ListData = resoponsedata.Json.EventRetrySettingsList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.EventRetrySettingsList = $scope.EventRetrySettingsList.concat(data);
                    console.log("3" + new Date());
                    if ($scope.GridConfigurationLoaded === false) {
                        $scope.LoadGridByConfiguration();
                    }
                    return data;
                });
            }
        });

        $scope.EventRetrySettingGrid = {
            dataSource: {
                store: EventRetrySettingData,
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
            keyExpr: "EventRetrySettingsId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {
                
                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.EventRetrySettingsId);
                    }
                    if (e.column.cellTemplate === "Delete") {
                        $scope.Delete(data.EventRetrySettingsId);
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
            //    width: 200
            //},

            columns: [
                {
                    dataField: "EventCode",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left",
                    //width: 150
                },
                {
                    dataField: "NotificationType",
                    alignment: "left"
                },
                {
                    dataField: "RetryCount",
                    alignment: "left"
                },
                {
                    dataField: "RetryInterval",
                    alignment: "left",
                    allowFiltering: false,
                    allowSorting: false
                },
                {
                    caption: "Edit",
                    dataField: "EventRetrySettingsId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Edit",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 150
                },
                {
                    caption: "Delete",
                    dataField: "EventRetrySettingsId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Delete",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 150
                }
            ]
        };
    }
    //#endregion


    //#endregion

    //#region Grid Configuration
    $scope.LoadGridConfigurationData = function () {
        
        var objectId = 224;

        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                ObjectId: objectId,
                ObjectName:'EventRetrySettingsController',
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
                console.log("0" + new Date());
                $scope.LoadEventRetrySettingGrid();

                

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
        var dataGrid = $("#EventRetrySettingGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

    $scope.GridConfigurationLoaded = false;

    $scope.LoadGridByConfiguration = function (e) {
        

        console.log("9" + new Date());

        var dataGrid = $("#EventRetrySettingGrid").dxDataGrid("instance");

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

    $scope.AddForm = function () {
        
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.ClearControls();
    }

    $scope.ViewForm = function () {
        
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        //$scope.ClearControls();
        //$scope.RefreshDataGrid();
    }

    $scope.ViewForm();

    $scope.Edit = function (id) {
        
        $scope.AddForm();
        var requestData =
        {
            ServicesAction: 'GetEventRetrysettingsById',
            EventRetrySettingsId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            if (response.data.Json != undefined) {
                var responsedata = response.data.Json.EventRetrySettingsList[0];
                $scope.EventRetrySettingsId = responsedata.EventRetrySettingsId;
                $scope.EventRetrySettingsJSON.EventMasterId = responsedata.EventMasterId;
                $scope.EventRetrySettingsJSON.NotificationTypeMasterId = responsedata.NotificationTypeMasterId;
                $scope.EventRetrySettingsJSON.RetryCount = responsedata.RetryCount;
                $scope.EventRetrySettingsJSON.RetryInterval = responsedata.RetryInterval;
            }
        });
    }

    $scope.Save = function () {
        

        if ($scope.EventRetrySettingsJSON.EventMasterId > 0 && $scope.EventRetrySettingsJSON.NotificationTypeMasterId > 0 && $scope.EventRetrySettingsJSON.RetryCount >= 0 && $scope.EventRetrySettingsJSON.RetryInterval >= 0) {

            var serviceaction = "";
            if ($scope.EventRetrySettingsId !== 0) {
                serviceaction = 'UpdateEventRetrysettings';
            }
            else {
                serviceaction = 'SaveEventRetrysettings';
            }
            var requestData =
            {
                ServicesAction: serviceaction,
                EventRetrySettingsId: $scope.EventRetrySettingsId,
                EventMasterId: $scope.EventRetrySettingsJSON.EventMasterId,
                NotificationTypeMasterId: $scope.EventRetrySettingsJSON.NotificationTypeMasterId,
                RetryCount: $scope.EventRetrySettingsJSON.RetryCount,
                RetryInterval: $scope.EventRetrySettingsJSON.RetryInterval,
                IsActive: true,
                CreatedBy: $rootScope.UserId
            };

            var consolidateApiParamater =
            {
                Json: requestData
            };

            
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                if (response.data.Json != undefined) {
                    if (response.data.Json.EventRetrySettingsId === '-1') {
                        $rootScope.ValidationErrorAlert('Record Already Exist', '', 3000);
                    }
                    else {
                        if ($scope.EventRetrySettingsId !== 0) {
                            $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
                        }
                        else {
                            $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
                        }

                        $scope.ClearControls();
                        $scope.ViewForm();
                        $scope.RefreshDataGrid();
                    }


                }

            });

        }
        else {
            $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
        }
    }

    $scope.ClearControls = function () {
        $scope.EventRetrySettingsId = 0;
        $scope.EventRetrySettingsJSON.NotificationTypeMasterId = 0;
        $scope.EventRetrySettingsJSON.EventMasterId = 0;
        $scope.EventRetrySettingsJSON.RetryInterval = 0;
        $scope.EventRetrySettingsJSON.RetryCount = 0;
    }

    $scope.Delete = function (id) {
        var requestData =
        {
            ServicesAction: 'DeleteEventRetrysettings',
            EventRetrySettingsId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.ViewForm();
        });
    }

    $scope.filterValue = function ($event) {
        
        var regex = new RegExp("^[0-9]*$");

        var key = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);
        if (!regex.test(key)) {
            $event.preventDefault();
        }
    };
});