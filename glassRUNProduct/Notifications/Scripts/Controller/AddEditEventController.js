angular.module("glassRUNProduct").controller('AddEditEventController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {
    
    //$rootScope.res_PageHeaderTitle = $rootScope.resData.res_EventForm_PageName;

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = false;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    };
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    
    $scope.IsSaveAccessControl = false;
    
    $scope.EventMasterList = [];

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }
    $rootScope.EditUserId = 0;

    $scope.EventInfo = {
        EventCode: "",
        EventDescription: ""
    }

    $scope.LoadAddEditEventGrid = function () {
        

        console.log("1" + new Date());

        var EventmasterData = new DevExpress.data.CustomStore({
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

                var EventCode = "";
                var EventCodeCriteria = "";

                var EventDescription = "";
                var EventDescriptionCriteria = "";

                
                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');
                        if (columnsList[0] === "EventCode") {
                            EventCode = columnsList[2]
                            EventCodeCriteria = columnsList[1];
                        }
                        if (columnsList[0] === "EventDescription") {
                            EventDescription = columnsList[2]
                            EventDescriptionCriteria = columnsList[1];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                
                var requestData =
                {
                    ServicesAction: 'LoadEventMasterPaging',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: "",
                    EventCode: EventCode,
                    EventCodeCriteria: EventCodeCriteria,
                    EventDescription: EventDescription,
                    EventDescriptionCriteria: EventDescriptionCriteria,
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
                            if (resoponsedata.Json.EventMasterList.length !== undefined) {
                                if (resoponsedata.Json.EventMasterList.length > 0) {
                                    totalcount = resoponsedata.Json.EventMasterList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.EventMasterList.TotalCount;
                            }

                            ListData = resoponsedata.Json.EventMasterList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    $rootScope.Throbber.Visible = false;
                    var data = ListData;
                    $scope.EventMasterList = $scope.EventMasterList.concat(data);
                    console.log("3" + new Date());
                    return data;
                });
            }
        });

        $scope.AddEditEventGrid = {
            dataSource: {
                store: EventmasterData,
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
                        $scope.EditUser(data.EventMasterId);
                    }
                    if (e.column.cellTemplate === "Delete") {
                        $scope.DeleteEvent(data.EventMasterId);

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
                    caption: "Event Code",
                    dataField: "EventCode",
                    alignment: "left"
                },
                {
                    caption: " Event Description",
                    dataField: "EventDescription",
                    alignment: "left"
                },
                {
                    caption: "Edit",
                    dataField: "EventMasterId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Edit",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 150
                },
                {
                    caption: "Delete",
                    dataField: "EventMasterId",
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

    //#region Refresh DataGrid 
    $scope.gridCallBack = function () {
        
        $scope.EventMasterList = [];
        var dataGrid = $("#AddEditEventGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

    $scope.LoadAddEditEventGrid();

    $scope.EventMasterId = 0;

    $scope.EditUser = function (EventMasterId) {
        

        var requestData =
            {
                ServicesAction: 'LoadEventDetailsByEventMasterid',
                EventMasterId: EventMasterId
            };


        var consolidateApiParamater =
            {
                Json: requestData,

            };


        

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data != undefined) {
                if (response.data.Json != undefined) {

                    $scope.EventMasterId = response.data.Json.ItemList[0].EventMasterId;
                    $scope.EventInfo.EventCode = response.data.Json.ItemList[0].EventCode;
                    $scope.EventInfo.EventDescription = response.data.Json.ItemList[0].EventDescription;

                }
            }
        });
    }

    $scope.Clear = function () {
        
        $scope.EventInfo.EventCode = "";
        $scope.EventInfo.EventDescription = "";
        $scope.EventMasterId = 0;
    }

    $scope.Save = function () {
        debugger;
        if ($scope.EventInfo.EventCode !== "" && $scope.EventInfo.EventDescription !== "") {

            if ($scope.EventMasterId !== 0) {

                serviceaction = 'UpdateEventDetail';
            }
            else {
                serviceaction = 'SaveEventDetail';
            }

            var requestData =
                {
                    ServicesAction: serviceaction,
                    EventMasterId: $scope.EventMasterId,
                    EventCode: $scope.EventInfo.EventCode,
                    EventDescription: $scope.EventInfo.EventDescription,
                    IsActive: 1,
                    CreatedBy: $rootScope.UserId,
                    PageName: 'Add/Edit Event',
                    RoleId: $rootScope.RoleId,
                    UserId: $rootScope.UserId
                };


            var consolidateApiParamater =
                {
                    Json: requestData,

                };


            

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                if (response.data.Json != undefined) {
                    if (response.data.Json.EventMasterId == "-1") {
                        $rootScope.ValidationErrorAlert('Event Code Already Exist.', 'error', 3000);
                    }
                    else {

                        $scope.Clear();
                        $scope.gridCallBack();
                        // $scope.LoadAllEventMasterDetails();
                        $rootScope.ValidationErrorAlert('Record Saved Successfully.', 'error', 3000);
                    }
                }
                else {
                    $rootScope.ValidationErrorAlert(response.data.ErrorValidationMessage + String.format($rootScope.resData.res_ServerSideVlaidationMsg_View), '', 3000);
                    $rootScope.Throbber.Visible = false;
                }

            });
        }
        else {
            if ($scope.EventInfo.EventDescription == "" || $scope.EventInfo.EventDescription == null || $scope.EventInfo.EventDescription == undefined) {
                $rootScope.ValidationErrorAlert('Enter Event Description ', '', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert('Enter Event Code ', '', 3000);
            }


        }
    }

    $scope.DeleteEvent = function (EventMstID) {
        var requestData =
            {
                ServicesAction: 'DeleteEventById',
                EventMasterId: EventMstID
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.gridCallBack();
        });
    }
});