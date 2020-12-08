angular.module("glassRUNProduct").controller('NotificationTemplateController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {

    //#region Declare Throbber

    $rootScope.EditNotificationTemplate = false;
    $rootScope.SelectedRuleId = 0;
    $scope.selectedRow = -1;
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }
    $scope.GridConfigurationLoaded === false;
    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;
    //#endregion
    $scope.EventTamplatelist = [];
    //#region Loading Active Session
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    //#endregion

    //#region Declare variable

    $rootScope.LoadAllEventMasternDetails = function () {

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

    $rootScope.GetAllNotificationTypeMasterDetails = function () {

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

    $rootScope.SelectedRuleType = 0;
    $rootScope.addnewrulediv = false;

    $scope.FilterByListSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }
    $scope.FilterByListSelectedList = [];

    $scope.SortByListSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }
    $scope.SortBySelectedList = [];
    $scope.GroupByListSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }
    $scope.GroupBySelectedList = [];
    //$rootScope.res_PageHeaderTitle = $rootScope.resData.res_BusinessRuleEnginePage_HeaderPageName;
    $rootScope.RuleTypeDefault = "RuleEngine";
    $rootScope.IsControlVisible = true;
    // $rootScope.ShowEditPanel = false;
    //#endregion



    //#region Loading value on page load



    $scope.AddNewNotification = function () {
        $rootScope.NotificationHeader = $rootScope.resData.res_AddNotificationPage_Header;
        $rootScope.FirstTab = false;
        $rootScope.ThirdTab = true;
    }
    $rootScope.FirstTab = true;
    $rootScope.ThirdTab = false;
    //#endregion



    $scope.EventTamplateGridData = function () {


        console.log("1" + new Date());

        var EventTamplateGridData = new DevExpress.data.CustomStore({
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

                var orderby = "";
                var config = "";
                var NotificationType = "";
                var NotificationTypeCriteria = "";
                var EventCode = "";
                var EventCodeCriteria = "";
                var RoleName = "";
                var RoleNameCriteria = "";
                var UserName = "";
                var UserNameCriteria = "";
                var Recipient = "";
                var RecipientCriteria = "";


                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');
                        if (columnsList[0] === "EventCode") {
                            EventCode = columnsList[2]
                            EventCodeCriteria = columnsList[1];
                        }
                        if (columnsList[0] === "NotificationType") {
                            NotificationType = columnsList[2]
                            NotificationTypeCriteria = columnsList[1];
                        }
                        if (columnsList[0] === "RoleName") {
                            RoleName = columnsList[2]
                            RoleNameCriteria = columnsList[1];
                        }
                        if (columnsList[0] === "UserName") {
                            UserName = columnsList[2]
                            UserNameCriteria = columnsList[1];
                        }
                        if (columnsList[0] === "Recipient") {
                            Recipient = columnsList[2]
                            RecipientCriteria = columnsList[1];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));


                var requestData =
                {
                    ServicesAction: 'LoadEventContent',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: "",
                    NotificationType,
                    NotificationTypeCriteria,
                    EventCode,
                    EventCodeCriteria,
                    RoleName: RoleName,
                    RoleNameCriteria: RoleNameCriteria,
                    UserName: UserName,
                    UserNameCriteria: UserNameCriteria,
                    Recipient: Recipient,
                    RecipientCriteria: RecipientCriteria,
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
                            if (resoponsedata.Json.EventContentList.length !== undefined) {
                                if (resoponsedata.Json.EventContentList.length > 0) {
                                    totalcount = resoponsedata.Json.EventContentList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.EventContentList.TotalCount;
                            }

                            ListData = resoponsedata.Json.EventContentList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    $rootScope.Throbber.Visible = false;
                    var data = ListData;
                    $scope.EventTamplatelist = $scope.EventTamplatelist.concat(data);
                    if ($scope.GridConfigurationLoaded === false) {
                        $scope.LoadGridByConfiguration();
                    }
                    console.log("3" + new Date());
                    return data;
                });
            }
        });

        $scope.EventTamplateGrid = {
            dataSource: {
                store: EventTamplateGridData,
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
            keyExpr: "EventMasterId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.EditNotificationTamplate(data.EventContentId);
                    }
                    if (e.column.cellTemplate === "Delete") {
                        $scope.DeleteEventContent(data.EventContentId);

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

            columns: $scope.DynamicColumnList,
        };
    }
    //#endregion


    $ionicModal.fromTemplateUrl('WarningDeleteMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {


        $scope.DeleteNotificationWarningMessageControl = modal;
    });


    $scope.CloseDeleteNotificationConfirmation = function () {
        $scope.DeleteNotificationWarningMessageControl.hide();
    };

    $scope.OpenDeleteNotificationConfirmation = function () {

        $scope.DeleteNotificationWarningMessageControl.show();
    };



    //#region Grid Configuration
    $scope.LoadGridConfigurationData = function () {

        var objectId = 226;

        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                ObjectId: objectId,
                ObjectName: 'CreateNotificationTemplate',
                PageName: 'Create NotificationTemplate',
                ControllerName: page
            };

        var gridconsolidateApiParamater =
            {
                Json: gridrequestData,
            };

        console.log("-2" + new Date());

        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
            debugger;
            if (response.data.Json != undefined) {
                $scope.GridColumnList = response.data.Json.GridColumnList;

                var ld = JSON.stringify(response.data);
                var ColumnlistinJson = JSON.parse(ld);

                $scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList;


                console.log("0" + new Date());
                $scope.EventTamplateGridData();



                if ($scope.IsRefreshGrid === true) {
                    $scope.RefreshDataGrid();
                }
            } else {
            }
        });
    }

    $scope.LoadGridConfigurationData();
    //#region Refresh DataGrid 
    $rootScope.gridCallBack = function () {

        //$scope.EventMasterList = [];
        var dataGrid = $("#EventTamplateGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

    //$scope.EventTamplateGridData();

    $scope.GridConfigurationLoaded = false;

    $scope.LoadGridByConfiguration = function (e) {

        console.log("9" + new Date());

        var dataGrid = $("#EventTamplateGrid").dxDataGrid("instance");
        debugger;
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



    $scope.DeleteYes = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'DeleteEventContent',
            EventContentId: $scope.SelectedId_EventContentId,
            CreatedBy: $rootScope.UserId

        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $rootScope.gridCallBack();
            $scope.CloseDeleteNotificationConfirmation();
            $rootScope.Throbber.Visible = false;

        });
    }


    $scope.DeleteEventContent = function (Id) {
        debugger;
        $scope.SelectedId_EventContentId = Id;
        $scope.DeleteNotificationWarningMessageControl.show();
    }


    /* $scope.DeleteEventContent = function (EventContentId) {
         
         var requestData =
         {
             ServicesAction: 'DeleteEventContent',
             EventContentId: EventContentId
 
 
         };
 
 
         var consolidateApiParamater =
         {
             Json: requestData,
 
         };
 
 
         
 
         GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
 
             
             $rootScope.gridCallBack();
             $rootScope.ValidationErrorAlert('Record Deleted Successfully..', 'warning', 10000);
 
         });
 
     }*/

    $rootScope.CompanyMnemonic = "";

    $scope.LoadEditRecord = function () {

        $rootScope.addnewrulediv = true;
        $rootScope.FirstTab = false;
        $rootScope.FourthTab = false;
        $rootScope.SecondTab = false;
        $rootScope.ThirdTab = true;
        $rootScope.LoadStartDatePicker();

        // $rootScope.LoadAllActivityList();

    }

    $rootScope.BackView = function () {
        $rootScope.Clear();
        $rootScope.FirstTab = true;
        $rootScope.ThirdTab = false;
    }


    $scope.EditNotificationTamplate = function (EventContentId) {

        $rootScope.EditNotificationTemplate = true;
        $rootScope.EventContentByEventmasterId(EventContentId);
    }
    //#endregion

    $scope.DeleteConfirmationMessageModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/DeleteConfirmationMessage.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {

            $scope.DeleteConfirmationMessagePopup = modal;
        });
    }
    $scope.DeleteConfirmationMessageModalPopup();
    $scope.OpenDeleteConfirmationMessageModalPopup = function () {

        $scope.DeleteConfirmationMessagePopup.show();
    }
    $scope.CloseDeleteConfirmationMessageModalPopup = function () {

        $scope.DeleteConfirmationMessagePopup.hide();
    }

});