angular.module("glassRUNProduct").controller('PlateNumberAndDriverMappingController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, GrRequestService) {

    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.PlateNumberDriverMappingId = 0;
 $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = false;
        } else {
            $rootScope.Throbber = {
                Visible: false
            };
        }
    };
$scope.IsPlateNumberDisabled=false;

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

 

    $scope.LoadThrobberForPage();
$scope.GridConfigurationLoaded === false;
    $scope.PageUrlName = $location.absUrl().split('#/')[1];
    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;

$scope.PlateNumberDriverMappingList=[];

    $scope.LoadDriverAndPlateNumber = function () {
debugger;
        var requestDataForCarrier = {};

        if ($rootScope.RoleName === 'Carrier' || $rootScope.RoleName === 'TransportManager') {
            requestDataForCarrier =
                {
                    ServicesAction: 'LoadDriverByCarrier',
                    CarrierId: $rootScope.CompanyId,

                }
        }
        else {
            requestDataForCarrier =
                {
                    ServicesAction: 'LoadAllDriverList'
                }
        }



        var consolidateApiParamaterForCarrier =
            {
                Json: requestDataForCarrier,
            };

        GrRequestService.ProcessRequest(consolidateApiParamaterForCarrier).then(function (response) {

            if (response.data != undefined) {
                if (response.data.Json != undefined) {

                    $scope.DriverList = response.data.Json.ProfileList;
                } else {
                    $scope.DriverList = [];
                }
            } else {
                $scope.DriverList = [];
            }





            var requestDataForPlateNumber =
                {
                    ServicesAction: 'GetPlateNumberByCarrierId',
                    CarrierId: $rootScope.CompanyId,
                    RoleId: $rootScope.RoleId

                }

            var consolidateApiParamaterForPlateNumber =
                {
                    Json: requestDataForPlateNumber,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterForPlateNumber).then(function (response) {

                if (response.data != undefined) {
                    if (response.data.Json != undefined) {

                        $scope.PlateNumberList = response.data.Json.TransporterVehicleList;
                    } else {
                        $scope.PlateNumberList = [];
                    }
                } else {
                    $scope.PlateNumberList = [];
                }
            });

        });
    }


    $scope.LoadDriverAndPlateNumber();

    $scope.LoadAllPlateNumberAndDriverMapping = function () {
        
        
        var requestData =
            {
                ServicesAction: 'LoadAllPlateNumberAndDriverMapping'

            };


        var consolidateApiParamater =
            {
                Json: requestData,

            };


        

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data.Json != undefined) {
                if (response.data.Json.PlateNumberDriverMappingList.length > 0) {

                    $scope.PlateNumberDriverMappingList = response.data.Json.PlateNumberDriverMappingList;
                    $rootScope.Throbber.Visible = false;
                }


            }

        });

    }

    $scope.LoadAllPlateNumberAndDriverMapping();


$scope.LoadGridConfigurationData = function () {
        var objectId = 524;

        var gridrequestData =
        {
            ServicesAction: 'LoadGridConfiguration',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            CultureId: $rootScope.CultureId,
            ObjectId: objectId,
            ObjectName: 'PlateNumberDriver',
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
                //$scope.GridColumnList = response.data.Json.GridColumnList;
                //console.log("0" + new Date());

                ////$scope.EventTamplateGridData();


                $scope.GridColumnList = response.data.Json.GridColumnList;

                var ld = JSON.stringify(response.data);
                var ColumnlistinJson = JSON.parse(ld);

                $scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList;


                $scope.LoadPlateNumberDriverGrid();
                if ($scope.IsRefreshGrid === true) {
                    $scope.RefreshDataGrid();
                }
            } else {
            }
        });
    }

	
//$scope.LoadGridConfigurationData();
	//#region Load Grid
    $scope.LoadPlateNumberDriverGrid = function () {
        debugger;


        var ViewPlateNumberDriverMappingData = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var parameters = {};
                var OrderBy = "";
                var OrderByCriteria = "";
                if (loadOptions.sort) {
                    parameters.orderby = loadOptions.sort[0].selector;
                    if (loadOptions.sort[0].desc)
                        OrderBy = parameters.orderby += " desc";
                }
                else {
                    OrderBy = "";
                }
                debugger;
                parameters.skip = loadOptions.skip || 0;
                parameters.take = loadOptions.take || 100;

                var filterOptions = loadOptions.filter ? loadOptions.filter.join(",") : "";
                var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";

				var DriverName = "";
                var PlateNumber = "";

                var PlateNumberCriteria = "";
                var DriverNameCriteria = "";


                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "DriverName") {
                            DriverNameCriteria = columnsList[1];
                            DriverName = columnsList[2];
                        }

                        if (columnsList[0] === "PlateNumber") {
                            PlateNumberCriteria = columnsList[1];
                            PlateNumber = columnsList[2];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                debugger;
                var requestData =
                {
                    ServicesAction: 'LoadDriverPlateNumberMapping',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: OrderBy,
                    OrderByCriteria: OrderByCriteria,
                    DriverName: DriverName,
                    DriverNameCriteria: DriverNameCriteria,
                    PlateNumber: PlateNumber,
                    PlateNumberCriteria: PlateNumberCriteria,
                    UserId: $rootScope.UserId,
					Carrier: $rootScope.CompanyId,
                };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                {
                    Json: requestData
                };
                debugger;
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    debugger;
                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {

                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.PlateNumberDriverMappingList.length !== undefined) {
                                if (resoponsedata.Json.PlateNumberDriverMappingList.length > 0) {
                                    totalcount = resoponsedata.Json.PlateNumberDriverMappingList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.PlateNumberDriverMappingList.TotalCount;
                            }

                            ListData = resoponsedata.Json.PlateNumberDriverMappingList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.PlateNumberDriverMappingList = $scope.PlateNumberDriverMappingList.concat(data);
                    if ($scope.GridConfigurationLoaded === false) {
                        $scope.LoadGridByConfiguration();
                    }
                    return data;
                });
            }
        });

        $scope.ViewPlateNumberDriverMappingGrid = {
            dataSource: {
                store: ViewPlateNumberDriverMappingData
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
            keyExpr: "PlateNumberDriverMappingId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.EditPlateNumberDriverMapping(data.PlateNumberDriverMappingId);
                    }
                    else if (e.column.cellTemplate === "Delete") {
                       // $scope.DeletePlateNumberDriver(data.PlateNumberDriverMappingId);
					$scope.Delete_PlateNumberDriver(data.PlateNumberDriverMappingId);
                    }
                    else if (e.column.cellTemplate === "ActiveInActiveTemplate") {
                        

                        var isActive = "1";
                        if(data.IsActive === "1")
                        {
                            isActive = "0";
                        }
                        else
                        {
                            isActive = "1";
                        }

                        $scope.ActiveInActiveLocationConfirmation(parseInt(data.TransportVehicleId), isActive);
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
            columns:  [
                        {
                            caption: "PlateNumber",
                            dataField: "PlateNumber",							
                            alignment: "left",
							
                        },
                        {
                            dataField: "DriverName",
                            caption: "Driver Name",							
                            alignment: "left",
                            
                        },
                         {
                            caption: "Edit",
                            dataField: "PlateNumberDriverMappingId",
                            cssClass: "ClickkableCell EnquiryNumberUI",
                            cellTemplate: "Edit",
                            allowFiltering: false,
                            allowSorting: false,
                            
                        },
                        {
                            caption: "Delete",
                            dataField: "PlateNumberDriverMappingId",
                            cssClass: "ClickkableCell EnquiryNumberUI",
                            cellTemplate: "Delete",
                            allowFiltering: false,
                            allowSorting: false,
                            
                        },
    ]
        };
    };


    $scope.LoadPlateNumberDriverGrid();

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {

        $scope.PaymentPlanList = [];
        var dataGrid = $("#ViewPlateNumberDriverMappingGrid").dxDataGrid("instance");
        dataGrid.refresh();
    };
    //#endregion
    //#endregion






	$scope.GridConfigurationLoaded = false;

    $scope.LoadGridByConfiguration = function (e) {
        debugger;
        console.log("9" + new Date());
        $rootScope.Throbber.Visible = true;
        var dataGrid = $("#ViewPlateNumberDriverMappingGrid").dxDataGrid("instance");

        if ($scope.GridColumnList !== undefined) {
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
        }
        $rootScope.Throbber.Visible = false;
        $scope.GridConfigurationLoaded = true;
        console.log("10" + new Date());
    }






    $scope.PlateNumberDriverMappingJson = {
        PlateNumber: '',
        Driver: ''


    }
    $scope.fileupload = {
        File: ''

    }


    $scope.FileSize = false;
    $scope.FileType = false;
    $scope.SaveTruck = function () {
        

       //var IsPlateNumberPresent = $scope.PlateNumberDriverMappingList.filter(function (el) { return el.PlateNumber ===$scope.PlateNumberDriverMappingJson.PlateNumber })
       //if (IsPlateNumberPresent.length == 0) {
            var plateDriverMapping = {
                PlateNumberDriverMappingId: $scope.PlateNumberDriverMappingId,
                DriverId: $scope.PlateNumberDriverMappingJson.Driver,
                PlateNumber: $scope.PlateNumberDriverMappingJson.PlateNumber,
                CreatedBy: $rootScope.UserId,
                IsActive: true
            }

            var plateNmberDriverList = [];
            plateNmberDriverList.push(plateDriverMapping);

            var requestData =
                {
                    ServicesAction: 'SavePlateNumberAndDriverMapping',
                    PlateNumberDriverMappingList: plateNmberDriverList
                };



            var consolidateApiParamater =
                {
                    Json: requestData,
                };
            
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                if ($scope.PlateNumberDriverMappingId != 0) {
                    $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
                }
                else {
                    $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
                }
                $scope.Clear();
                $scope.ViewForm();
               
$scope.RefreshDataGrid();
            });
        //}
      //  else {
        //    $rootScope.ValidationErrorAlert('Plate Number already mapped with driver', '', 3000);
        //}


    }


    $scope.Clear = function () {
        $scope.PlateNumberDriverMappingJson.Driver = "";
        $scope.PlateNumberDriverMappingJson.PlateNumber = "";
        $scope.PlateNumberDriverMappingId = 0;
$scope.IsPlateNumberDisabled=false;
    }

    $scope.AddForm = function () {
        
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
    }
    $scope.ViewForm = function () {
        
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.Clear();
        //gridCallBack();
//$scope.RefreshDataGrid();
    }
    $scope.ViewForm();





    $scope.EditPlateNumberDriverMapping = function (id) {
        debugger;
$scope.IsPlateNumberDisabled=true;
        var requestData =
            {
                ServicesAction: 'GetPlateNumberDriverMappingById',
                PlateNumberDriverMappingId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data.Json.PlateNumberDriverMappingList;
            $scope.PlateNumberDriverMappingId = id;
            $scope.PlateNumberDriverMappingJson.PlateNumber = resoponsedata[0].PlateNumber;
            $scope.PlateNumberDriverMappingJson.Driver = resoponsedata[0].DriverId;
            $scope.AddForm();
        });
    }


 $scope.Delete_PlateNumberDriver = function (Id) {
        $scope.SelectedId_PlateNumberGrid = Id;
        $scope.DeleteWarningMessageControl.show();
    }


    $scope.DeletePlateNumberDriver = function () {
		debugger;
        var requestData =
            {
                ServicesAction: 'DeletePlateNumberDriver',
                PlateNumberDriverMappingId: $scope.SelectedId_PlateNumberGrid
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
			$scope.CloseDeleteConfirmation();
            //gridCallBack();
			$scope.RefreshDataGrid();
        });
    }
}).directive('clientAutoComplete', ['$filter', function ($filter) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.autocomplete({
                source: function (request, response) {

                    //term has the data typed by the user
                    var params = request.term;

                    //simulates api call with odata $filter
                    var data = scope.dataSource;
                    if (data) {
                        var result = $filter('filter')(data, { name: params });
                        angular.forEach(result, function (item) {
                            item['value'] = item['name'];
                        });
                    }
                    response(result);

                },
                minLength: 1,
                select: function (event, ui) {
                    //force a digest cycle to update the views
                    scope.$apply(function () {
                        scope.setClientData(ui.item);
                    });
                },

            });
        }

    };

}]);