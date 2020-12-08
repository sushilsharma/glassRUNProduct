angular.module("glassRUNProduct").controller('ObjectVariableController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {
    
   // $rootScope.res_PageHeaderTitle = $rootScope.resData.res_EventForm_PageName;
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = false;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    };
    $scope.GridConfigurationLoaded = false;
    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;
    $scope.disableControl = false;
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    
    $scope.IsSaveAccessControl = false;
    

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }
    $scope.EventObjectPropertiesMappingList = [];
    $rootScope.EditUserId = 0;
    $scope.FilterByListSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        enableSearch: true
    }

    $scope.SortByListSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        enableSearch: true,
    }

    //$scope.changeobjectName = function () {
    //    
    //    var data = $scope.SelectedObjectList

    //    var result = data.map(function (val) {
    //        return val.Id;
    //    }).join(',');
    //    $scope.LoadObjectPropertiesbyFilter(result)
    //}
    $scope.ObjectEvent = {
        onItemSelect: function (item) {
            $scope.changeobjectName();
        },
    }

    //$scope.SelectedObjectList = [];
    $scope.ObjectPropertiesSelectedList = [];
    $scope.GroupByListSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        enableSearch: true
    }

    $scope.EventObjectPropertyMappingInfo = {
        EventObjectPropertiesMappingId: "",
        ObjectId: "",
        EventMasterId: "",
        SelectedObjectPropertiesId: "",
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

                    $scope.EventMasterList = response.data.Json.EventMasterList;
                    $rootScope.Throbber.Visible = false;
                }


            }
        });

    }

    $scope.LoadAllObjectDetails = function () {
        
        $rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'GetAllObjectDetails'

            };


        var consolidateApiParamater =
            {
                Json: requestData,

            };


        

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data.Object != undefined) {
                if (response.data.Object.ObjectList.length > 0) {

                    $scope.ObjectList = response.data.Object.ObjectList;
                    $rootScope.Throbber.Visible = false;
                }


            }
        });

    }

    $scope.LoadAllObjectDetails();

    $scope.LoadAllEventMasternDetails();

     
   

    $scope.ObjectMappingGridData = function () {
        

        console.log("1" + new Date());

        var ObjectMappingDataGrid = new DevExpress.data.CustomStore({
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

                var ObjectName = "";
                var ObjectNameCriteria = "";

                var EventMasterName = "";
                var EventMasterNameCriteria = "";

                var ObjectPropertiesName = "";
                var ObjectPropertiesNameCriteria = "";

                
                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');
                        if (columnsList[0] === "ObjectName") {
                            ObjectName = columnsList[2]
                            ObjectNameCriteria = columnsList[1];
                        }
                        if (columnsList[0] === "EventMasterName") {
                            EventMasterName = columnsList[2]
                            EventMasterNameCriteria = columnsList[1];
                        }
                        if (columnsList[0] === "ObjectPropertiesName") {
                            ObjectPropertiesName = columnsList[2]
                            ObjectPropertiesNameCriteria = columnsList[1];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                
                var requestData =
                {
                    ServicesAction: 'LoadEventObjectPropertiesMapping',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: "",
                    ObjectName: ObjectName,
                    ObjectNameCriteria: ObjectNameCriteria,
                    EventMasterName: EventMasterName,
                    EventMasterNameCriteria: EventMasterNameCriteria,
                    ObjectPropertiesName: ObjectPropertiesName,
                    ObjectPropertiesNameCriteria: ObjectPropertiesNameCriteria,
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
                            if (resoponsedata.Json.EventObjectPropertiesMappingList.length !== undefined) {
                                if (resoponsedata.Json.EventObjectPropertiesMappingList.length > 0) {
                                    totalcount = resoponsedata.Json.EventObjectPropertiesMappingList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.EventObjectPropertiesMappingList.TotalCount;
                            }

                            ListData = resoponsedata.Json.EventObjectPropertiesMappingList;
                            $scope.GridData = ListData;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    $rootScope.Throbber.Visible = false;
                    var data = ListData;
                    $scope.EventObjectPropertiesMappingList = $scope.EventObjectPropertiesMappingList.concat(data);
                    if ($scope.GridConfigurationLoaded === false) {
                        $scope.LoadGridByConfiguration();
                    }
                    console.log("3" + new Date());
                    return data;
                });
            }
        });

        $scope.ObjectMappingGrid = {
            dataSource: {
                store: ObjectMappingDataGrid,
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
                        $scope.EditEventMapingDetailsByEventMaping(data.EventMasterId,data.ObjectId)
                    }
                    if (e.column.cellTemplate === "Delete") {
                        $scope.DeleteEventObjectPropertiesMapping(data.EventMasterId, data.ObjectId)

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
                    dataField: "EventMasterName",
                    alignment: "left"
                },
                {
                    dataField: "ObjectName",
                    alignment: "left"
                },
                 {
                     dataField: "ObjectPropertiesName",
                     alignment: "left"
                 },
                {
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


    //#region Grid Configuration
    $scope.LoadGridConfigurationData = function () {
      
        
        var objectId = 225;

        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                ObjectId: objectId,
                ObjectName: 'ObjectVariableDetails',
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
                $scope.ObjectMappingGridData();



                if ($scope.IsRefreshGrid === true) {
                    $scope.RefreshDataGrid();
                }
            } else {
            }
        });
    }

    $scope.LoadGridConfigurationData();

    //#region Refresh DataGrid 
    $scope.gridCallBack = function () {
        
        //$scope.EventMasterList = [];
        var dataGrid = $("#ObjectMappingGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

   

    $scope.LoadGridByConfiguration = function (e) {
        
        console.log("9" + new Date());

        var dataGrid = $("#ObjectMappingGrid").dxDataGrid("instance");
        
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


    $scope.EventObjectPropertiesMappingId = 0;

    $scope.EditEventMapingDetailsByEventMaping = function (EventMasterId, objectID) {
        
        var ObjectPropertiesId = "";

        var filterGridData = $scope.EventObjectPropertiesMappingList.filter(function (el) { return el.EventMasterId === EventMasterId && el.ObjectId === objectID; });
        if (filterGridData.length > 0) {
            ObjectPropertiesId = filterGridData[0].ObjectPropertiesId;
        }

        $scope.EventObjectPropertiesMappingId = -1;
        $scope.EventObjectPropertyMappingInfo.EventMasterId = EventMasterId.toString();
        $scope.EventObjectPropertyMappingInfo.ObjectId = objectID.toString();
        $scope.LoadObjectPropertiesbyFilter(objectID);
        var datasplit = ObjectPropertiesId.split(',');
        if (datasplit.length > 0) {
            var splitarray = [];
            for (var i = 0; i < datasplit.length; i++) {
                var json = {
                    Id: datasplit[i]
                }
                splitarray.push(json);
            }
            $scope.ObjectPropertiesSelectedList = splitarray;

        } else {
            $scope.ObjectPropertiesSelectedList = [];
        }
        
    }

    $scope.Clear = function () {
        
        $scope.EventObjectPropertyMappingInfo.EventMasterId = "";
        $scope.EventObjectPropertyMappingInfo.ObjectId = "";
        $scope.EventObjectPropertyMappingInfo.SelectedObjectPropertiesId = "";
        $scope.EventObjectPropertiesMappingId = 0;
        $scope.ObjectPropertiesSelectedList = []
    }

    $scope.Save = function () {
        
        if ($scope.EventObjectPropertyMappingInfo.EventMasterId !== "" && $scope.EventObjectPropertyMappingInfo.ObjectId != "" && $scope.ObjectPropertiesSelectedList.length > 0) {
            
            var data = $scope.ObjectPropertiesSelectedList

            var result = data.map(function (val) {
                return val.Id;
            }).join(',');

            if ($scope.EventObjectPropertiesMappingId !== 0) {

                serviceaction = 'UpdateEventObjectPropertiesMapping';
            }
            else {
                serviceaction = 'SaveEventObjectPropertiesMapping';
            }
            //var requestData = [];
            var objectData = {
                ServicesAction: serviceaction,
                EventObjectPropertiesMapping: []
            };

            if ($scope.ObjectPropertiesSelectedList.length > 0) {
                
                for (var i = 0; i < $scope.ObjectPropertiesSelectedList.length; i++) {
                    var objectpropertyFilter = [];
                    var objectpropertyFilter = $scope.ObjectPropertiesList.filter(function (el) { return el.Id === $scope.ObjectPropertiesSelectedList[i].Id; });
                    if (objectpropertyFilter.length > 0) {
                        var objectID = objectpropertyFilter[0].ObjectId
                        var objectpropertyId = objectpropertyFilter[0].ObjectPropertyId
                    } else {
                        var objectID = 0;
                        var objectpropertyId = 0;
                    }

                    ObjmappingData = {
                        ServicesAction: serviceaction,
                        EventObjectPropertiesMappingId: $scope.EventObjectPropertiesMappingId,
                        EventMasterId: $scope.EventObjectPropertyMappingInfo.EventMasterId,
                        ObjectId: objectID,
                        ObjectPropertyIds: objectpropertyId,// result,//$scope.ObjectPropertiesSelectedList[i].Id,
                        IsActive: 1,
                        CreatedBy: $rootScope.UserId,
                    }
                    objectData.EventObjectPropertiesMapping.push(ObjmappingData);
                }
                //var requestData =
                //    {
                //        ServicesAction: serviceaction,
                //        EventObjectPropertiesMappingId: $scope.EventObjectPropertiesMappingId,
                //        EventMasterId: $scope.EventObjectPropertyMappingInfo.EventMasterId,
                //        ObjectId: $scope.EventObjectPropertyMappingInfo.ObjectId,
                //        ObjectPropertyIds: result,//$scope.ObjectPropertiesSelectedList[i].Id,
                //        IsActive: 1,
                //        CreatedBy: $rootScope.UserId,
                //    };
                var consolidateApiParamater =
                    {
                        Json: objectData,
                    };
                
                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    
                    $scope.Clear();
                    $scope.gridCallBack();
                    $rootScope.ValidationErrorAlert('Record Saved Successfully.', 'error', 3000);
                });

            }
        }
        else {
            if ($scope.EventObjectPropertyMappingInfo.ObjectId == "" || $scope.EventObjectPropertyMappingInfo.ObjectId == null || $scope.EventObjectPropertyMappingInfo.ObjectId == undefined) {
                $rootScope.ValidationErrorAlert('Enter Event Description ', '', 3000);
            }
            else {
                if ($scope.ObjectPropertiesSelectedList.length < 0) {
                    $rootScope.ValidationErrorAlert('Select Object Properties', '', 3000);
                }
                else {
                    $rootScope.ValidationErrorAlert('Enter Event Code ', '', 3000);
                }

            }


        }
    }

    $scope.DeleteEventObjectPropertiesMapping = function (EventMasterId, ObjectID) {

        var requestData =
            {
                ServicesAction: 'DeleteEventObjectPropertiesMapping',
                EventMasterId: EventMasterId,
                ObjectID: ObjectID
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.gridCallBack();
        });
    }



    $scope.LoadObjectPropertiesbyFilter = function (ObjectIdes) {
        
        //$scope.ObjectPropertiesSelectedList = [];
        $rootScope.Throbber.Visible = true;
        $scope.FilterRuleTypeId = ObjectIdes;

        var requestData =
        {
            ServicesAction: 'GetSelectedObjectPropertiesbyobjectId',
            ObjectId: ObjectIdes
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            

            if (response.data.Json != undefined) {
                $scope.ObjectPropertiesList = response.data.Json.ObjectPropertiesList;

            }
            else {
                $scope.ObjectPropertiesList = [];
            }

            $rootScope.Throbber.Visible = false;

        });
    }


});