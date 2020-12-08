angular.module("glassRUNProduct").controller('ViewNotificationsController', function ($scope, $q, $timeout, $rootScope, $document, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    //Added By Chetan Tambe (17 Sept 2019)

    //#region Load Variables And Default Values

    

    $scope.IsGridLoadCompleted = false;

    $scope.$on('$destroy', function (evt) {

        $("#NotificationsListGrid").remove();
    });

    setTimeout(function () {
        pluginsService.init();
    }, 500);

    $scope.IsRefreshGrid = false;
    $scope.selectedRow = -1;

    $scope.HeaderCheckboxControl = false;
    
    setTimeout(function () {

        pluginsService.init();
    }, 500);


    $scope.CellCheckboxControl = false;
    $scope.HeaderCheckBoxAction = false;
    $scope.SalesAdminApprovalList = [];
    $scope.IsChecked = false;
    $scope.IsFiltered = true;
    console.log("-0" + new Date());
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.RoleName = $rootScope.RoleName;
    $rootScope.PreviousExpandedRow = "";
    $scope.GridColumnList = [];

    $rootScope.res_PageHeaderTitle = "Notifications";

    $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = false;
        } else {
            $rootScope.Throbber = {
                Visible: false,
            }
        };
    }
    $scope.LoadThrobberForPage();

    console.log("-1" + new Date());

    var page = $location.absUrl().split('#/')[1];

    $scope.ViewControllerName = page;

    var PageControlName = "";

    //#endregion

    //#region Load Sales Admin Approval Grid
    $scope.LoadNotificationGrid = function () {


        console.log("1" + new Date());

        var NotificationsData = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var parameters = {};

                if (loadOptions.sort) {
                    parameters.orderby = loadOptions.sort[0].selector;
                    if (loadOptions.sort[0].desc)
                        parameters.orderby += " desc";
                }

                parameters.skip = loadOptions.skip || 0;
                parameters.take = loadOptions.take || 100;

                var filterOptions = "";
                if (loadOptions.dataField === undefined) {
                    filterOptions = loadOptions.filter ? loadOptions.filter.join(",") : "";
                } else {
                    if (loadOptions.filter !== undefined) {
                        var column = loadOptions.filter[0];
                        var data = loadOptions.dataField + "," + column[1] + "," + column[2];
                        filterOptions = data;
                    }
                }

                var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";

                var Title = "";
                var TitleCriteria = "";

                var CreatedDate = "";
                var CreatedDateCriteria = "";

                var IsAckDatetime = "";
                var IsAckDatetimeCriteria = "";

                var fields = [];
                if (filterOptions !== "") {
                    fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "Title") {
                            TitleCriteria = columnsList[1];
                            Title = columnsList[2];
                        }                        

                        if (columnsList[0] === "CreatedDate") {
                                if (CreatedDate === "") {
                                    if (fields.length > 1) {
                                        CreatedDateCriteria = "=";
                                    } else {
                                        CreatedDateCriteria = columnsList[1];
                                    }
                                    CreatedDate = columnsList[2];
                                    CreatedDate = new Date(CreatedDate);
                                    CreatedDate = $filter('date')(CreatedDate, "dd/MM/yyyy");
                                }
                        }

                        if (columnsList[0] === "IsAckDatetime") {
                                if (IsAckDatetime === "") {
                                    if (fields.length > 1) {
                                        IsAckDatetimeCriteria = "=";
                                    } else {
                                        IsAckDatetimeCriteria = columnsList[1];
                                    }
                                    IsAckDatetime = columnsList[2];
                                    IsAckDatetime = new Date(IsAckDatetime);
                                    IsAckDatetime = $filter('date')(IsAckDatetime, "dd/MM/yyyy");
                                }
                        }

                    }
                }


                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));


                var requestData =
                    {
                        ServicesAction: 'LoadViewNotificationsGrid',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        Title: Title,
                        TitleCriteria: TitleCriteria,
                        CreatedDate: CreatedDate,
                        CreatedDateCriteria: CreatedDateCriteria,
                        RoleMasterId: $rootScope.RoleId,
                        UserId: $rootScope.UserId,
                        LoginId: $rootScope.UserId,
                        CultureId: $rootScope.CultureId,
                        PageName: page,
                        PageControlName: PageControlName
                    };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                console.log("2" + new Date());
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    debugger;
                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {

                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.EventNotificationList.length !== undefined) {
                                if (resoponsedata.Json.EventNotificationList.length > 0) {
                                    totalcount = resoponsedata.Json.EventNotificationList[0].TotalCount;
                                }
                            } else {
                                totalcount = resoponsedata.Json.EventNotificationList.TotalCount;
                            }

                            ListData = resoponsedata.Json.EventNotificationList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    } var inquiryList = {
                        data: ListData,
                        totalRecords: totalcount
                    }
                    for (var i = 0; i < ListData.length; i++) {
                        ListData[i].CheckedEnquiry = false;
                    }
                    $scope.IsGridLoadCompleted = false;
                    $rootScope.TotalOrderCount = totalcount;

                    var data = ListData;

                    debugger;
                    $scope.SalesAdminApprovalList = data;

                    return { data: ListData, totalCount: parseInt(totalcount) };

                });
            }
        });

        $scope.NotificationsDataGrid = {
            dataSource: {
                store: NotificationsData,
            },
            bindingOptions: {
            },
            showBorders: true,
            showColumnLines: true,
            showRowLines: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            loadPanel: {
                enabled: false
            },
            scrolling: {
                mode: "standard",
                showScrollbar: "always", // or "onClick" | "always" | "never"
                //scrollByThumb: false
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
            keyExpr: "NotificationRequestId",
            selection: {
                mode: "single"
            },

            onContentReady: function () {
                if ($scope.IsGridLoadCompleted === false) {
                    setTimeout(function () {
                        $("#NotificationsListGrid").dxDataGrid("instance").updateDimensions();
                        $scope.IsGridLoadCompleted = true;
                    }, 200);

                }

            },


            onCellClick: function (e) {

                $scope.IsColumnDetailView = false;
                if ($scope.CellCheckboxControl === true || $scope.HeaderCheckboxControl === true) {
                    $scope.IsColumnDetailView = true;

                    if ($scope.CellCheckboxControl === true) {
                        var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.NotificationRequestId === e.data.NotificationRequestId; });
                        if (data.length > 0) {
                            data[0].CheckedEnquiry = !data[0].CheckedEnquiry;
                        }
                    }
                    else if ($scope.HeaderCheckboxControl === true) {
                        for (var i = 0; i < $scope.SalesAdminApprovalList.length; i++) {
                            $scope.SalesAdminApprovalList[i].CheckedEnquiry = $scope.HeaderCheckBoxAction;
                        }
                    }


                    $scope.HeaderCheckboxControl = false;
                    $scope.CellCheckboxControl = false;
                }

                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "TitleTemplate") {
                        var markasreadunread = 0;
                        if(data.IsAck === '0')
                        {
                            markasreadunread = 1;
                        }
                        else
                        {
                            markasreadunread = 0;
                        }
                        $scope.UpdateNotificationsDetails(data.NotificationRequestId, markasreadunread);
                    }

                }

            },

            onRowClick: function (e) {
                //if ($scope.IsColumnDetailView === false) {
                //    $state.go("TrackerPage");
                //}
            },

            columnsAutoWidth: true,
            rowAlternationEnabled: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            headerFilter: {
                visible: true,
                allowSearch: true
            },
            remoteOperations: {
                sorting: true,
                filtering: true,
                paging: true
            },
            paging: {
                pageSize: 50
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 50, 100, 500],
                showInfo: true,
                showNavigationButtons: true,
                visible: true
            },

            loadPanel: {
                Type: Number,
                width: 200
            },
            columns: [
                {
                    caption: "",
                    dataField: "CheckedEnquiry",
                    cellTemplate: function (container, options) {
                        $("<div />").dxCheckBox({
                            value: JSON.parse(options.data.CheckedEnquiry),
                            onValueChanged: function (data) {
                                debugger;
                                $scope.HeaderCheckboxControl = false;
                                $scope.CellCheckboxControl = true;
                            }
                        }).appendTo(container);
                    },
                    headerCellTemplate: function (container, options) {

                        $("<div />").dxCheckBox({
                            value: false,
                            onValueChanged: function (data) {
                                debugger;
                                $scope.HeaderCheckBoxAction = data.value;
                                $scope.HeaderCheckboxControl = true;
                                $scope.CellCheckboxControl = false;
                            }
                        }).appendTo(container);
                    },
                    alignment: "center",
                    allowFiltering: false,
                    allowSorting: false,
                    Width: 20
                },
                {
                    cellTemplate: "ReadUnReadTemplate",
                    alignment: "center",
                    caption: "Status"
                },
                {
                    dataField: "Title",
                    cellTemplate: "TitleTemplate",
                    alignment: "left",
                    caption: "Notification"
                },
                {

                    dataField: "CreatedDate",
                    alignment: "left",
                    cellTemplate: "CreatedDateTemplate",
                    caption: "Recieved Date",
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    filterOperations: ['=', '>', '<']
                },
                {

                    dataField: "IsAckDatetime",
                    alignment: "left",
                    cellTemplate: "IsAckDatetimeTemplate",
                    caption: "Read Date",
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    filterOperations: ['=', '>', '<']
                }
            ]
        };
    }

    //#endregion

    //#region Refresh DataGrid
    $scope.RefreshDataGrid = function () {

        $scope.IsGridLoadCompleted = false;
        $scope.SalesAdminApprovalList = [];
        $scope.IsEnquiryEdit = false;
        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#NotificationsListGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

    $scope.LoadNotificationGrid();

    $scope.UpdateNotificationsDetails = function (EmailNotificationId, markasread) {

		        $scope.EmailNotificationId = EmailNotificationId;

		        var requestData =
				{
				    ServicesAction: 'UpdateEmailNotification',
				    NotificationRequestId: EmailNotificationId,
				    MarkAsRead: markasread,
                    IsAck: markasread,
				    UpdatedBy: $rootScope.UserId


				};

		        var jsonobject = {};
		        jsonobject.Json = requestData;
		        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

		            $rootScope.LoadEventNotificationList($rootScope.UserId);
                    $scope.RefreshDataGrid();
		        });
		    };

    $scope.MarkAsReadUnRead = function(markasreadunread) {

            var notificationDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry; });
            if (notificationDetails.length == 0) {
                $rootScope.ValidationErrorAlert('Please select at least one message.', 'error', 3000);
                return;
            }


            angular.forEach($scope.SalesAdminApprovalList, function (item) {
                if (item.CheckedEnquiry) {
                    
                        $scope.UpdateNotificationsDetails(item.NotificationRequestId, markasreadunread);

                }
            });

            

            if(markasreadunread === 1)
            {
                $rootScope.ValidationErrorAlert('Notifications marked as read successfully.', 'success', 3000);
            }
            else
            {
                $rootScope.ValidationErrorAlert('Notifications marked as unread successfully.', 'success', 3000);
            }

    };

    

});