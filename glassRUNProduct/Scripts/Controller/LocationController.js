angular.module("glassRUNProduct").controller('LocationController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {


    // alert('dd');

    
    LoadActiveVariables($sessionStorage, $state, $rootScope);

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }
    $rootScope.LocationType = "";

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

    $scope.ActiveInActiveLocationConfirmation = function (Id, isAction) {
        $scope.SelectedIdLocationId = Id;
        $scope.SelectedIdLocationAction = isAction;
        $scope.OpenActiveInActiveWarningMessageConfirmation();
    };

    $scope.ActiveInActiveLocation = function () {
        debugger;
        var isActive = false;
        if($scope.SelectedIdLocationAction === "1")
        {
            isActive = true;
        }
        else
        {
            isActive = false;
        }

        var requestData =
                {
                    ServicesAction: 'DeleteLocation',
                    LocationId: $scope.SelectedIdLocationId,
                    IsActive: isActive,
                    ModifiedBy: $rootScope.UserId
                };

            var jsonobject = {};
            jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            $scope.CloseActiveInActiveWarningMessageConfirmation();
            $scope.ViewForm();
            $scope.RefreshDataGrid();

            if($scope.SelectedIdLocationAction === "1")
            {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_LocationUI_ActivateMessage), '', 3000);
            }
            else
            {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_LocationUI_InActivateMessage), '', 3000);
            }

            $rootScope.Throbber.Visible = false;
        });
    };


    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;
    $scope.LocationList = [];
    $scope.CompanyId = 0;
    $rootScope.TransportVehicleJson = {
        labelFilename: '',
        image: ''
    }
    $scope.TransporterAccountDetails = [];
    $scope.EditAccountdetailGUID = "";
    $scope.SelectedLocationList = [];
    $scope.SelectedProductList = [];
    $scope.EditContactinfoGUID = "";
    $scope.ZoneCodeList = [];
    $scope.CompanyBranchPlantList = [];
    $scope.ContactInformationList = [];
    $scope.CompanyProductTypeList = [];
    $scope.CompanyProductCategoryList = [];
    $scope.SelectedZoneList = [];
    $scope.SelectedBranchPlantList = [];
    $scope.LocationId = 0;
    $scope.SelectLoadedDistributorsList = [];
    $scope.SelectedProductCategoryList = [];


    $scope.SortByListSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false
        //multiple:false

    }

    //$scope.changeobjectName = function () {
    //    
    //    var data = $scope.SelectLoadedDistributorsList
    //    var result = 0;
    //    if ($scope.SelectLoadedDistributorsList.length > 0) {
    //        $scope.GetAllLoginDetails($scope.SelectLoadedDistributorsList[0].Id)
    //    }
    //    else {
    //        $scope.GetAllLoginDetails('-1')
    //    }
    //}
    
    var PageControlName = "";
    //#region Grid Configuration
    $scope.LoadGridConfigurationData = function () {

        var objectId = 522;
        PageControlName = "Location";
        if (page === "PaymentRequest") {
            objectId = 17;
        } else if (page === "DriverAssignment") {
            objectId = 18;
        } else if (page === "CollectionLocation") {
            objectId = 18;
            PageControlName = "Location";
        } else if (page === "ShipToLocation") {
            objectId = 18;
            PageControlName = "Location";
        }
        
        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                ObjectId: objectId,
                ObjectName: PageControlName,
                PageName: $rootScope.PageName,
                ControllerName: page
            };

        //var gridrequestData =
        //    {
        //        ServicesAction: 'LoadGridConfiguration',
        //        RoleId: $rootScope.RoleId,
        //        UserId: $rootScope.UserId,
        //        CultureId: $rootScope.CultureId,
        //        ObjectId: 16,
        //        PageName: 'Order List',
        //        ControllerName: 'OrderGrid'
        //    };


        //var stringfyjson = JSON.stringify(requestData);
        var gridconsolidateApiParamater =
            {
                Json: gridrequestData,
            };


        console.log("-2" + new Date());

        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
            //if (response.data.Json != undefined) {
            //    $scope.GridColumnList = response.data.Json.GridColumnList;
            //    console.log("0" + new Date());
            //    $scope.LoadEventRetrySettingsGrid();
            //
            //    if ($scope.IsRefreshGrid === true) {
            //        $scope.RefreshDataGrid();
            //    }
            //
            //} else {
            //
            //}

            $scope.GridColumnList = response.data.Json.GridColumnList;

            var ld = JSON.stringify(response.data);
            var ColumnlistinJson = JSON.parse(ld);

            $scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList;

            $scope.LoadEventRetrySettingsGrid();
            
            if ($scope.IsRefreshGrid === true) {
                $scope.RefreshDataGrid();
            }

        });
    }
    $scope.LoadGridConfigurationData();

    //#endregion




    $scope.AddLocationJSON = {
        LocationName: '',
        DisplayName: '',
        LocationCode: '',
        LocationType: 0,
        CompanyId: 0,
        AddressLine1: '',
        AddressLine2: '',
        AddressLine3: '',
        AddressLine4: '',
        City: '',
        State: '',
        PostCode: '',
        CreatedBy: '',
        Email: '',
        Capacity: '',
        Safefill: '',
        Field1: '',
        Field2: '',
        Field3: '',
        Field4: '',
        Field5: '',
        Field6: '',
        Field7: '',
        Field8: '',
        Field9: '',
        Field9: '',
        Field10: '',
        AddressNumber: '',
        WMSBranchPlantCode: '',
        WareHouseType: 0


    }

    //#region Load EventRetrySetting Grid
    $scope.LoadEventRetrySettingsGrid = function () {


        console.log("1" + new Date());

        var LocationData = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var parameters = {};
                var OrderBy = "";
                var OrderByCriteria = "";
                if (loadOptions.sort) {
                    debugger;
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

                var LocationName = "";
                var LocationNameCriteria = "";

                var DisplayName = "";
                var DisplayNameCriteria = "";

                var LocationType = "";
                var LocationTypeCriteria = "";
                var LocationCode = "";
                var LocationCodeCriteria = "";
                var AddressLine1 = ''
                var AddressLine1Criteria = ''
                var AddressLine2 = ''
                var AddressLine2Criteria = ''
                var AddressLine3 = ''
                var AddressLine3Criteria = ''
                var City = ''
                var CityCriteria = ''
                var State = ''
                var StateCriteria = ''
                var Country = ''
                var CountryCriteria = ''
                var Postcode = ''
                var PostcodeCriteria = ''
                var Region = ''
                var RegionCriteria = ''
                var RouteCode = ''
                var RouteCodeCriteria = ''
                var ZoneCode = ''
                var ZoneCodeCriteria = ''
                var CategoryCode = ''
                var CategoryCodeCriteria = ''
                var BranchPlant = ''
                var BranchPlantCriteria = ''
                var Email = ''
                var EmailCriteria = ''
                var SiteURL = ''
                var SiteURLCriteria = ''
                var ContactPersonNumber = ''
                var ContactPersonNumberCriteria = ''
                var ContactPersonName = ''
                var ContactPersonNameCriteria = ''
                var SequenceNo = ''
                var SequenceNoCriteria = ''
                var SubChannel = ''
                var SubChannelCriteria = ''
                var Field1 = ''
                var Field1Criteria = ''
                var Field2 = ''
                var Field2Criteria = ''
                var Field3 = ''
                var Field3Criteria = ''
                var Field4 = ''
                var Field4Criteria = ''
                var Field5 = ''
                var Field5Criteria = ''
                var Field6 = ''
                var Field6Criteria = ''
                var Field7 = ''
                var Field7Criteria = ''
                var Field8 = ''
                var Field8Criteria = ''
                var Field9 = ''
                var Field9Criteria = ''
                var Field10 = ''
                var Field10Criteria = ''
                var CreditLimit = ''
                var CreditLimitCriteria = ''
                var AvailableCreditLimit = ''
                var AvailableCreditLimitCriteria = ''
                var EmptiesLimit = ''
                var EmptiesLimitCriteria = ''
                var ActualEmpties = ''
                var ActualEmptiesCriteria = ''
                var PaymentTermCode = ''
                var PaymentTermCodeCriteria = ''
                var CategoryType = ''
                var CategoryTypeCriteria = ''
                var CompanyName = ''
                var CompanyNameCriteria = ''
                


                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "LocationCode") {
                            LocationCodeCriteria = columnsList[1];
                            LocationCode = columnsList[2];
                        }                        

                        if (columnsList[0] === "LocationName") {
                            LocationNameCriteria = columnsList[1];
                            LocationName = columnsList[2];
                        }
                        if (columnsList[0] === "DisplayName") {
                            DisplayNameCriteria = columnsList[1];
                            DisplayName = columnsList[2];
                        }

                        if (columnsList[0] === "LocationTypeName") {
                            LocationTypeCriteria = columnsList[1];
                            LocationType = columnsList[2];
                        }

                        if (columnsList[0] === "AddressLine1") {
                            AddressLine1Criteria = columnsList[1];
                            AddressLine1 = columnsList[2];
                        }
                        if (columnsList[0] === "AddressLine2") {
                            AddressLine2Criteria = columnsList[1];
                            AddressLine2 = columnsList[2];
                        }
                        if (columnsList[0] === "AddressLine3") {
                            AddressLine3Criteria = columnsList[1];
                            AddressLine3 = columnsList[2];
                        }

                        if (columnsList[0] === "CityName") {
                            CityCriteria = columnsList[1];
                            City = columnsList[2];
                        }
                        if (columnsList[0] === "StateName") {
                            StateCriteria = columnsList[1];
                            State = columnsList[2];
                        }
                        if (columnsList[0] === "CompanyName") {
                            CompanyNameCriteria = columnsList[1];
                            CompanyName = columnsList[2];
                        }
                        //if (columnsList[0] === "Country") {
                        //    CountryCriteria = columnsList[1];
                        //    Country = columnsList[2];
                        //}
                        //if (columnsList[0] === "Postcode") {
                        //    PostcodeCriteria = columnsList[1];
                        //    Postcode = columnsList[2];
                        //}
                        //if (columnsList[0] === "Region") {
                        //    RegionCriteria = columnsList[1];
                        //    Region = columnsList[2];
                        //}
                        //if (columnsList[0] === "RouteCode") {
                        //    RouteCodeCriteria = columnsList[1];
                        //    RouteCode = columnsList[2];
                        //}
                        //if (columnsList[0] === "ZoneCode") {
                        //    ZoneCodeCriteria = columnsList[1];
                        //    ZoneCode = columnsList[2];
                        //}
                        //if (columnsList[0] === "BranchPlant") {
                        //    BranchPlantCriteria = columnsList[1];
                        //    BranchPlant = columnsList[2];
                        //}
                        //if (columnsList[0] === "Email") {
                        //    EmailCriteria = columnsList[1];
                        //    Email = columnsList[2];
                        //}
                        //if (columnsList[0] === "SiteURL") {
                        //    SiteURLCriteria = columnsList[1];
                        //    SiteURL = columnsList[2];
                        //}
                        //if (columnsList[0] === "ContactPersonNumber") {
                        //    ContactPersonNumberCriteria = columnsList[1];
                        //    ContactPersonNumber = columnsList[2];
                        //}
                        //if (columnsList[0] === "ContactPersonName") {
                        //    ContactPersonNameCriteria = columnsList[1];
                        //    ContactPersonName = columnsList[2];
                        //}
                        //if (columnsList[0] === "SequenceNo") {
                        //    SequenceNoCriteria = columnsList[1];
                        //    SequenceNo = columnsList[2];
                        //}
                        //if (columnsList[0] === "SubChannel") {
                        //    SubChannelCriteria = columnsList[1];
                        //    SubChannel = columnsList[2];
                        //}
                        //if (columnsList[0] === "Field1") {
                        //    Field1Criteria = columnsList[1];
                        //    Field1 = columnsList[2];
                        //}
                        //if (columnsList[0] === "Field2") {
                        //    SiteURLCriteria = columnsList[1];
                        //    SiteURL = columnsList[2];
                        //}
                        //if (columnsList[0] === "SiteURL") {
                        //    Field2Criteria = columnsList[1];
                        //    Field2 = columnsList[2];
                        //}
                        //if (columnsList[0] === "Field3") {
                        //    Field3Criteria = columnsList[1];
                        //    Field3 = columnsList[2];
                        //}
                        //if (columnsList[0] === "Field4") {
                        //    Field4Criteria = columnsList[1];
                        //    Field4 = columnsList[2];
                        //}
                        //if (columnsList[0] === "Field5") {
                        //    Field5Criteria = columnsList[1];
                        //    Field5 = columnsList[2];
                        //}
                        //if (columnsList[0] === "Field6") {
                        //    Field6Criteria = columnsList[1];
                        //    Field6 = columnsList[2];
                        //}
                        //if (columnsList[0] === "Field7") {
                        //    Field7Criteria = columnsList[1];
                        //    Field7 = columnsList[2];
                        //}
                        //if (columnsList[0] === "Field8") {
                        //    Field8Criteria = columnsList[1];
                        //    Field8 = columnsList[2];
                        //}
                        //if (columnsList[0] === "Field9") {
                        //    Field9Criteria = columnsList[1];
                        //    Field9 = columnsList[2];
                        //}
                        //if (columnsList[0] === "Field10") {
                        //    Field10Criteria = columnsList[1];
                        //    Field10 = columnsList[2];
                        //}
                        //if (columnsList[0] === "CreditLimit") {
                        //    CreditLimitCriteria = columnsList[1];
                        //    CreditLimit = columnsList[2];
                        //}
                        //if (columnsList[0] === "AvailableCreditLimit") {
                        //    AvailableCreditLimitCriteria = columnsList[1];
                        //    AvailableCreditLimit = columnsList[2];
                        //}
                        //if (columnsList[0] === "EmptiesLimit") {
                        //    EmptiesLimitCriteria = columnsList[1];
                        //    EmptiesLimit = columnsList[2];

                        //}
                        //if (columnsList[0] === "ActualEmpties") {
                        //    ActualEmptiesCriteria = columnsList[1];
                        //    ActualEmpties = columnsList[2];

                        //}
                        //if (columnsList[0] === "PaymentTermCode") {
                        //    PaymentTermCodeCriteria = columnsList[1];
                        //    PaymentTermCode = columnsList[2];

                        //}
                        //if (columnsList[0] === "CategoryType") {
                        //    CategoryTypeCriteria = columnsList[1];
                        //    CategoryType = columnsList[2];

                        //}
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));


                var requestData =
                    {
                        ServicesAction: 'LoadLocationDetails',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: OrderBy,
                        OrderByCriteria: OrderByCriteria,
                        
                        LocationCode: LocationCode,
                        LocationCodeCriteria: LocationCodeCriteria,

                        LocationName: LocationName,
                        LocationNameCriteria: LocationNameCriteria,
                        DisplayName: DisplayName,
                        DisplayNameCriteria: DisplayNameCriteria,
                        LocationType: LocationType,
                        LocationTypeCriteria: LocationTypeCriteria,
                        AddressLine1: AddressLine1,
                        AddressLine1Criteria: AddressLine1Criteria,
                        AddressLine2: AddressLine2,
                        AddressLine2Criteria: AddressLine2Criteria,
                        AddressLine3: AddressLine3,
                        AddressLine3Criteria: AddressLine3Criteria,
                        City: City,
                        CityCriteria: CityCriteria,
                        CompanyName: CompanyName,
                        CompanyNameCriteria: CompanyNameCriteria,
                        State: State,
                        StateCriteria: StateCriteria,
                        LoginId: $rootScope.UserId,
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

                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {

                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.LocationList.length !== undefined) {
                                if (resoponsedata.Json.LocationList.length > 0) {
                                    totalcount = resoponsedata.Json.LocationList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.LocationList.TotalCount;
                            }

                            ListData = resoponsedata.Json.LocationList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.LocationList = $scope.LocationList.concat(data);
                    console.log("3" + new Date());

                    if ($scope.GridConfigurationLoaded === false) {
                        $scope.LoadGridByConfiguration();
                    }
                    return data;
                });
            }
        });

        $scope.LocationGrid = {
            dataSource: {
                store: LocationData,
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
            keyExpr: "LocationId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $rootScope.Edit(data.LocationId);
                    }
                    if (e.column.cellTemplate === "Delete") {
                        $scope.DeleteLocation(data.LocationId);
                    }
                    if (e.column.cellTemplate === "ActiveInActiveTemplate") {
                        

                        var isActive = "1";
                        if(data.IsActive === "1")
                        {
                            isActive = "0";
                        }
                        else
                        {
                            isActive = "1";
                        }

                        $scope.ActiveInActiveLocationConfirmation(parseInt(data.LocationId), isActive);
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

    //$scope.LoadEventRetrySettingsGrid();

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {

        $scope.PaymentSlabList = [];
        var dataGrid = $("#LocationGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

    $scope.ClearControls = function () {


        $scope.LocationList = [];
        $scope.LocationId = 0;
        $scope.AddLocationJSON.LocationName = '';
        $scope.AddLocationJSON.DisplayName = '';
        $scope.AddLocationJSON.LocationCode = '';
        $scope.AddLocationJSON.CompanyId = '';
        $scope.AddLocationJSON.AddressLine1 = '';
        $scope.AddLocationJSON.AddressLine2 = '';
        $scope.AddLocationJSON.AddressLine3 = '';
        $scope.AddLocationJSON.AddressLine4 = '';
        $scope.AddLocationJSON.City = '';
        $scope.AddLocationJSON.State = '';
        $scope.AddLocationJSON.PostCode = '';
        $scope.AddLocationJSON.Capacity = '';
        $scope.AddLocationJSON.Safefill = '';
        $scope.AddLocationJSON.Field1 = '';
        $scope.AddLocationJSON.Field2 = '';
        $scope.AddLocationJSON.Field3 = '';
        $scope.AddLocationJSON.Field4 = '';
        $scope.AddLocationJSON.Field5 = '';
        $scope.AddLocationJSON.Field6 = '';
        $scope.AddLocationJSON.Field7 = '';
        $scope.AddLocationJSON.Field8 = '';
        $scope.AddLocationJSON.Field9 = '';
        $scope.AddLocationJSON.Field9 = '';
        $scope.AddLocationJSON.Field10 = '';
        $scope.AddLocationJSON.AddressNumber = '';
        $scope.AddLocationJSON.WMSBranchPlantCode = '';
        $scope.AddLocationJSON.WareHouseType = '';
        $scope.SelectLoadedDistributorsList = [];

    }

    $scope.AddForm = function () {
        debugger;
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.ClearControls();
    }

    $scope.ViewForm = function () {
        debugger;
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.ClearControls();
        //$scope.RefreshDataGrid();
    }


    $scope.ViewForm();




    //#region On Load Grid Configuration 
    $scope.GridConfigurationLoaded = false;
    $scope.LoadGridByConfiguration = function (e) {
        debugger;

        console.log("9" + new Date());

        var dataGrid = $("#LocationGrid").dxDataGrid("instance");
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


                    



                }

                if ($scope.GridColumnList[i].PropertyName !== "CheckedEnquiry") {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "caption", $scope.GridColumnList[i].ResourceValue);
                }


            }
            $scope.GridConfigurationLoaded = true;
            console.log("10" + new Date());
        }
    }

    //#endregion 



    //$scope.FileSize = false;
    //$scope.FileType = false;
    //$scope.FileNameChanged = function (element) {
    //    
    //    $scope.$apply(function () {
    //        

    //        var fileInput = document.getElementById("fileUpload");

    //        // files is a FileList object (similar to NodeList)
    //        var files = fileInput.files;
    //        var fr = new FileReader();
    //        var t = fr.readAsDataURL(files[0]);

    //        $scope.imageSrc = files[0].getAsDataURL();

    //        $rootScope.TransportVehicleJson.labelFilename = element.files[0].name;
    //        $rootScope.TransportVehicleJson.image = $scope.fileupload.File.dataBase64;
    //    });
    //}

    $scope.Save = function () {


        if ($scope.AddLocationJSON.LocationName === "") {
            $rootScope.ValidationErrorAlert('Please Enter Location Name', '', 3000);
            return;
        }
        if ($scope.LocationCodeAutomated == false) {
            if ($scope.AddLocationJSON.LocationCode === "") {
                $rootScope.ValidationErrorAlert('Please Enter Location Code', '', 3000);
                return;
            }
        }

        if ($scope.AddLocationJSON.LocationType === 0) {
            $rootScope.ValidationErrorAlert('Please select Location Type', '', 3000);
            return;
        }


        if ($scope.AddLocationJSON.State === "" || $scope.AddLocationJSON.State === null) {
            $rootScope.ValidationErrorAlert('Please select State', '', 3000);
            return;
        }

        if ($scope.SelectLoadedDistributorsList.length === 0) {
            $rootScope.ValidationErrorAlert('Please select company', '', 3000);
            return;
        }



        $scope.AddZoneAndLocationList();
        var SelectLoadedDistributorsList = $scope.SelectLoadedDistributorsList;
        if ($scope.SelectLoadedDistributorsList.length > 0) {
            $scope.AddLocationJSON.CompanyId = $scope.SelectLoadedDistributorsList[0].Id
        }
        else {
            $scope.AddLocationJSON.CompanyId = "";
        }



        var location =
            {
                LocationId: $scope.LocationId,
                LocationName: $scope.AddLocationJSON.LocationName,
                DisplayName: $scope.AddLocationJSON.DisplayName,
                LocationCode: $scope.AddLocationJSON.LocationCode,
                LocationCodeAutomated: $scope.LocationCodeAutomated,
                LocationType: $scope.AddLocationJSON.LocationType,
                AddressLine1: $scope.AddLocationJSON.AddressLine1,
                AddressLine2: $scope.AddLocationJSON.AddressLine2,
                AddressLine3: $scope.AddLocationJSON.AddressLine3,
                AddressLine4: $scope.AddLocationJSON.AddressLine4,
                CompanyID: $scope.AddLocationJSON.CompanyId,
                City: $scope.AddLocationJSON.City,
                State: $scope.AddLocationJSON.State,
                PostCode: $scope.AddLocationJSON.PostCode,
                Capacity: $scope.AddLocationJSON.Capacity,
                Safefill: $scope.AddLocationJSON.Safefill,
                Field1: $scope.AddLocationJSON.Field1,
                Field2: $scope.AddLocationJSON.Field2,
                Field3: $scope.AddLocationJSON.Field3,
                Field4: $scope.AddLocationJSON.Field4,
                Field5: $scope.AddLocationJSON.Field5,
                Field6: $scope.AddLocationJSON.Field6,
                Field7: $scope.AddLocationJSON.Field7,
                Field8: $scope.AddLocationJSON.Field8,
                Field9: $scope.AddLocationJSON.Field9,
                Field10: $scope.AddLocationJSON.Field10,
                IsActive: true,
                CreatedBy: $rootScope.UserId,
                CompanyProductTypeList: $scope.CompanyProductTypeList,
                CompanyProductCategoryList: $scope.CompanyProductCategoryList,
            }


        var locationList = [];
        locationList.push(location);

        var requestData =
            {
                ServicesAction: 'InsertLocation',
                LocationList: locationList
            };



        var consolidateApiParamater =
            {
                Json: requestData,
            };


        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.LocationId === '-1') {
                    $rootScope.ValidationErrorAlert('Record Already Exist', '', 3000);
                }
                else {
                    if ($scope.LocationId !== 0) {
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


    $scope.DeleteLocation = function (Id) {
        $scope.SelectedIdLocationGrid = Id;
        $scope.DeleteWarningMessageControl.show();
    }


    $scope.DeleteYes = function (id) {
        debugger;
        var requestData =
            {
                ServicesAction: 'DeleteLocation',
                LocationId: $scope.SelectedIdLocationGrid,
                UpdatedBy: $rootScope.UserId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.ViewForm();
            $scope.RefreshDataGrid();
            $scope.CloseDeleteConfirmation();
            $rootScope.Throbber.Visible = false;
            $scope.CloseDeleteConfirmation();
        });
    }

    $scope.filterValue = function ($event) {

        var regex = new RegExp("^[0-9]*$");

        var key = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);
        if (!regex.test(key)) {
            $event.preventDefault();
        }
    };



    $scope.AddContactPersonInfo = function () {
        if ($scope.AddCompanyDeailsJSON.ContactTypeId != '' && $scope.AddCompanyDeailsJSON.ContactPersonName != '' && $scope.AddCompanyDeailsJSON.ContactPersonNumber != '') {

            var ContactType = '';
            var ContactDetails = $scope.ContactTypeList.filter(function (m) { return m.LookUpId === $scope.AddCompanyDeailsJSON.ContactTypeId })
            if (ContactDetails.length > 0) {
                ContactType = ContactDetails[0].Name
            }
            else {
                ContactType = '';
            }

            if ($scope.EditContactinfoGUID !== '') {
                var Concatctinfo = $scope.ContactInformationList.filter(function (m) { return m.ContactinfoGUID === $scope.EditContactinfoGUID; });

                Concatctinfo[0].ContactType = ContactType;
                Concatctinfo[0].ContactTypeId = $scope.AddCompanyDeailsJSON.ContactTypeId;
                Concatctinfo[0].ContactPersonName = $scope.AddCompanyDeailsJSON.ContactPersonName;
                Concatctinfo[0].ContactPersonNumber = $scope.AddCompanyDeailsJSON.ContactPersonNumber;
                Concatctinfo[0].IsActive = true;
                Concatctinfo[0].CreatedBy = $rootScope.UserId;
            }
            else {
                var Contactinfo = {
                    ContactinfoGUID: generateGUID(),
                    ContactType: ContactType,
                    ContactTypeId: $scope.AddCompanyDeailsJSON.ContactTypeId,
                    ContactPersonName: $scope.AddCompanyDeailsJSON.ContactPersonName,
                    ContactPersonNumber: $scope.AddCompanyDeailsJSON.ContactPersonNumber,
                    ObjectType: 'Location',
                    IsActive: true,
                    CreatedBy: $rootScope.UserId,
                }
                $scope.ContactInformationList.push(Contactinfo);
            }
            $scope.ClearContactinfoControls();
        }
        else {
            $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
        }
        //alert('sdfsdf');

    }

    $scope.EditContactPersonInfo = function (id) {

        $scope.ClearContactinfoControls();
        var Concatctinfo = $scope.ContactInformationList.filter(function (m) { return m.ContactinfoGUID === id; });
        $scope.EditContactinfoGUID = id;
        $scope.AddCompanyDeailsJSON.ContactTypeId = Concatctinfo[0].ContactTypeId
        $scope.AddCompanyDeailsJSON.ContactPersonNumber = Concatctinfo[0].ContactPersonNumber
        $scope.AddCompanyDeailsJSON.ContactPersonName = Concatctinfo[0].ContactPersonName
    }

    $scope.DeleteContactInfo = function (id) {

        var ContactInfo = $scope.ContactInformationList.filter(function (m) { return m.ContactinfoGUID !== id; });
        $scope.ContactInformationList = ContactInfo;
    }

    $scope.AddTransporterAccountDetails = function () {
        //alert('sdfsdf');
        if ($scope.AddCompanyDeailsJSON.AccountNumber != '' && $scope.AddCompanyDeailsJSON.AccountName != '' && $scope.AddCompanyDeailsJSON.AccountType) {

            var AccountType = '';
            var AccountTypeDtails = $scope.AccountTypeList.filter(function (m) { return m.LookUpId === $scope.AddCompanyDeailsJSON.AccountType })
            if (AccountTypeDtails.length > 0) {
                AccountType = AccountTypeDtails[0].Name
            }
            else {
                AccountType = '';
            }


            if ($scope.EditAccountdetailGUID !== '') {

                var Accountdetails = $scope.TransporterAccountDetails.filter(function (m) { return m.AccountdetailGUID === $scope.EditAccountdetailGUID; });

                // Concatctinfo[0].PaymentSlabId = $scope.PaymentSlabId;
                Accountdetails[0].AccountNumber = $scope.AddCompanyDeailsJSON.AccountNumber;
                Accountdetails[0].AccountName = $scope.AddCompanyDeailsJSON.AccountName;
                Accountdetails[0].AccountTypeId = $scope.AddCompanyDeailsJSON.AccountType;
                Accountdetails[0].AccountType = AccountType;
                Accountdetails[0].IsActive = true;
                Accountdetails[0].UpdatedBy = $rootScope.UserId;
            }
            else {
                var accountdetail = {
                    AccountdetailGUID: generateGUID(),
                    AccountNumber: $scope.AddCompanyDeailsJSON.AccountNumber,
                    AccountName: $scope.AddCompanyDeailsJSON.AccountName,
                    AccountTypeId: $scope.AddCompanyDeailsJSON.AccountType,
                    AccountType: AccountType,
                    IsActive: true,
                    CreatedBy: $rootScope.UserId,
                }
                $scope.TransporterAccountDetails.push(accountdetail);
            }
            $scope.ClearAccountDetailsControls();
        } else {
            $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
        }

    }

    $scope.EditAccountdetail = function (id) {

        $scope.ClearAccountDetailsControls();
        var AccountDeatils = $scope.TransporterAccountDetails.filter(function (m) { return m.AccountdetailGUID === id; });
        $scope.EditAccountdetailGUID = id;
        $scope.AddCompanyDeailsJSON.AccountNumber = AccountDeatils[0].AccountNumber
        $scope.AddCompanyDeailsJSON.AccountName = AccountDeatils[0].AccountName
        $scope.AddCompanyDeailsJSON.AccountType = AccountDeatils[0].AccountTypeId
    }

    $scope.DeleteAccountDetails = function (id) {

        var AccountDetails = $scope.TransporterAccountDetails.filter(function (m) { return m.AccountdetailGUID !== id; });

        $scope.TransporterAccountDetails = AccountDetails;
    }

    $scope.filterLookupData = function () {

        var lookuplist
        var CompanyType = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'CompanyType'; });
        if (CompanyType.length > 0) {

            $scope.CompanyTypeList = CompanyType;
            $rootScope.Throbber.Visible = false;
        }

        var RegionData = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'Region'; });
        if (RegionData.length > 0) {

            $scope.RegionDataList = RegionData;
            $rootScope.Throbber.Visible = false;
        }
        var ZoneData = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'Zone'; });
        if (CompanyType.length > 0) {

            $scope.ZoneDataList = ZoneData;
            for (var i = 0; i < $scope.ZoneDataList.length; i++) {
                $scope.ZoneDataList[i].Id = $scope.ZoneDataList[i].LookUpId;
            }
            $rootScope.Throbber.Visible = false;
        }
        var AccountType = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'AccountType'; });
        if (AccountType.length > 0) {

            //alert(JSON.stringify(AccountType));
            $scope.AccountTypeList = AccountType;

            $rootScope.Throbber.Visible = false;
        }

        var ContactType = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ContactType'; });
        if (ContactType.length > 0) {

            $scope.ContactTypeList = ContactType;
            $rootScope.Throbber.Visible = false;
        }

        var ProductType = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ProductType'; });
        if (ProductType.length > 0) {

            $scope.ProductTypeList = ProductType;
            for (var i = 0; i < $scope.ProductTypeList.length; i++) {
                $scope.ProductTypeList[i].Id = $scope.ProductTypeList[i].LookUpId;
            }
            $rootScope.Throbber.Visible = false;
        }
    }

    $scope.filterLookupData();



}).directive("ngFileSelect", function (fileReader, $timeout, $rootScope) {
    return {
        scope: {
            ngModel: '='
        },
        link: function ($scope, el) {
            function getFile(file) {

                $rootScope.TransportVehicleJson.labelFilename = file.name;
                fileReader.readAsDataUrl(file, $scope)
                    .then(function (result) {
                        $timeout(function () {
                            $rootScope.TransportVehicleJson.image = result;
                            $scope.ngModel = result;
                        });
                    });
            }

            el.bind("change", function (e) {

                var file = (e.srcElement || e.target).files[0];
                getFile(file);
            });
        }
    };
}).factory("fileReader", function ($q, $log) {
    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress", {
                total: event.total,
                loaded: event.loaded
            });
        };
    };

    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };

    $scope.DeleteImage = function () {
        //alert('sdsdf');

        $scope.TransportVehicleJson.image = '';
        $scope.TransportVehicleJson.labelFilename = '';
    };

    



});