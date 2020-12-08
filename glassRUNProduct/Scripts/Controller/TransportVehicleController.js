angular.module("glassRUNProduct").controller('TransportVehicleController', function ($scope, $q, $state, $timeout, $ionicModal, $location, pluginsService, $rootScope, $sessionStorage, GrRequestService) {

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

    $scope.GridConfigurationLoaded === false;
    $scope.PageUrlName = $location.absUrl().split('#/')[1];
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

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    setTimeout(function () {
        pluginsService.init();
    }, 500);

    $scope.documenttypeforvehiclecertificate = "";
    var documentTypeList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'DocumentType'; });
    if (documentTypeList.length > 0) {
        var vehiclecertificate = documentTypeList.filter(function (el) { return el.Name === 'Vehicle Certificate'; });;
        if (vehiclecertificate !== undefined) {
            if (vehiclecertificate.length > 0) {
                $scope.documenttypeforvehiclecertificate = vehiclecertificate[0].Field9;
            }
        }
    }




    // $rootScope.res_PageHeaderTitle = $rootScope.resData.res_TransportVehicleUI_PageHeading;
    $scope.TransportVehicleId = 0;
    $scope.EditVehicleCompartmentGuid = "";
    $scope.TransportVehicleList = [];
    $scope.CompartmentList = [];
    $scope.SelectedId_TransportVehicleGrid = 0;
    //$scope.VehicleProductTypeList_Save = [];
    $scope.FileSize = false;
    $scope.FileType = false;

    $scope.IsEditMode = false;


    $scope.TransportVehicleJSON = {
        //TransporterVehicle Table Fields
        PageTabHeader: $rootScope.resData.res_TransportVehicleUI_Add,
        TransportVehicleId: 0,
        VehicleName: '',
        VehicleRegistrationNumber: '',
        VehicleTypeId: 0,
        TransporterId: 0,
        NumberOfCompartments: 0,
        TruckSizeId: 0,
        SequenceNumber: 0,
        Field1: '',
        Field2: '',
        Field3: '',
        Field4: '',
        Field5: '',
        Field6: '',
        Field7: '',
        Field8: '',
        Field9: '',
        Field10: '',
        RegisteredVehicleCertificateBlob: '',
        FormatType: '',
        labelFilename: '',
        IsVehicleInsured: false,
        InsuranceValidityDate: '',
        IsFitnessCertificateAvailed: false,
        FitnessCertificateDate: '',
        VehicleOwnerName: '',
        VehicleOwnerAddress1: '',
        VehicleOwnerAddress2: '',

        //VehicleCompartment Table Fields
        VehicleCompartmentId: 0,
        CompartmentName: '',
        Capacity: '',
        UnitOfMeasureId: 0,
        UnitOfMeasure: '',

        //VehicleProductType Table Fields
        VehicleProductTypeId: 0,
        ProductTypeId: 0,
        ProductType: ''
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
        $scope.SelectedIdTransportVehicleId = Id;
        $scope.SelectedIdTransportVehicleAction = isAction;
        $scope.OpenActiveInActiveWarningMessageConfirmation();
    };

    $scope.ActiveInActiveLocation = function () {
        debugger;
        var isActive = false;
        if ($scope.SelectedIdTransportVehicleAction === "1") {
            isActive = true;
        }
        else {
            isActive = false;
        }

        var requestData =
        {
            ServicesAction: 'DeleteTransportVehicleById',
            TransportVehicleId: $scope.SelectedIdTransportVehicleId,
            IsActive: isActive,
            ModifiedBy: $rootScope.UserId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $scope.CloseActiveInActiveWarningMessageConfirmation();
            $scope.ViewForm();
            $scope.RefreshDataGrid();

            if ($scope.SelectedIdTransportVehicleAction === "1") {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_TransportVehicleUI_ActivateMessage), '', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_TransportVehicleUI_InActivateMessage), '', 3000);
            }

            $rootScope.Throbber.Visible = false;

        });


    };

    //#region Load Grid
    $scope.LoadTransportVehicleGrid = function () {
        debugger;


        var TransportVehicleData = new DevExpress.data.CustomStore({
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

                var VehicleName = "";
                var VehicleNameCriteria = "";

                var VehicleRegistrationNumber = "";
                var VehicleRegistrationNumberCriteria = "";

                var TransporterName = "";
                var TransporterNameCriteria = "";

                var VehicleTypeName = "";
                var VehicleTypeNameCriteria = "";

                var NumberOfCompartments = "";
                var NumberOfCompartmentsCriteria = "";

                var TruckSize = "";
                var TruckSizeCriteria = "";

                var SequenceNumber = "";
                var SequenceNumberCriteria = "";

                var InsuranceValidityDate = "";
                var InsuranceValidityDateCriteria = "";

                var FitnessCertificateDate = "";
                var FitnessCertificateDateCriteria = "";

                var VehicleOwnerName = "";
                var VehicleOwnerNameCriteria = "";

                var VehicleOwnerAddress1 = "";
                var VehicleOwnerAddress1Criteria = "";

                var VehicleOwnerAddress2 = "";
                var VehicleOwnerAddress2Criteria = "";

                var Field1 = "";
                var Field1Criteria = "";

                var Field2 = "";
                var Field2Criteria = "";

                var Field3 = "";
                var Field3Criteria = "";

                var Field4 = "";
                var Field4Criteria = "";

                var Field5 = "";
                var Field5Criteria = "";

                var Field6 = "";
                var Field6Criteria = "";

                var Field7 = "";
                var Field7Criteria = "";

                var Field8 = "";
                var Field8Criteria = "";

                var Field9 = "";
                var Field9Criteria = "";

                var Field10 = "";
                var Field10Criteria = "";


                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "VehicleName") {
                            VehicleNameCriteria = columnsList[1];
                            VehicleName = columnsList[2];
                        }

                        if (columnsList[0] === "VehicleRegistrationNumber") {
                            VehicleRegistrationNumberCriteria = columnsList[1];
                            VehicleRegistrationNumber = columnsList[2];
                        }

                        if (columnsList[0] === "TransporterName") {
                            TransporterNameCriteria = columnsList[1];
                            TransporterName = columnsList[2];
                        }

                        if (columnsList[0] === "VehicleTypeName") {
                            VehicleTypeNameCriteria = columnsList[1];
                            VehicleTypeName = columnsList[2];
                        }

                        if (columnsList[0] === "NumberOfCompartments") {
                            if (NumberOfCompartments === "") {
                                if (fields.length > 1) {
                                    NumberOfCompartmentsCriteria = "=";
                                } else {
                                    NumberOfCompartmentsCriteria = columnsList[1];
                                }
                                NumberOfCompartmentsCriteria = columnsList[1];
                                NumberOfCompartments = columnsList[2];
                            }
                        }

                        if (columnsList[0] === "TruckSize") {
                            TruckSizeCriteria = columnsList[1];
                            TruckSize = columnsList[2];
                        }

                        if (columnsList[0] === "SequenceNumber") {
                            if (SequenceNumber === "") {
                                if (fields.length > 1) {
                                    SequenceNumberCriteria = "=";
                                } else {
                                    SequenceNumberCriteria = columnsList[1];
                                }
                                SequenceNumberCriteria = columnsList[1];
                                SequenceNumber = columnsList[2];
                            }
                        }

                        if (columnsList[0] === "InsuranceValidityDate") {
                            if (InsuranceValidityDate === "") {
                                if (fields.length > 1) {
                                    InsuranceValidityDateCriteria = "=";
                                } else {
                                    InsuranceValidityDateCriteria = columnsList[1];
                                }
                                InsuranceValidityDate = columnsList[2];
                                InsuranceValidityDate = new Date(InsuranceValidityDate);
                                InsuranceValidityDate = $filter('date')(InsuranceValidityDate, "dd/MM/yyyy");
                            }
                        }

                        if (columnsList[0] === "FitnessCertificateDate") {
                            if (FitnessCertificateDate === "") {
                                if (fields.length > 1) {
                                    FitnessCertificateDateCriteria = "=";
                                } else {
                                    FitnessCertificateDateCriteria = columnsList[1];
                                }
                                FitnessCertificateDate = columnsList[2];
                                FitnessCertificateDate = new Date(FitnessCertificateDate);
                                FitnessCertificateDate = $filter('date')(FitnessCertificateDate, "dd/MM/yyyy");
                            }
                        }

                        if (columnsList[0] === "VehicleOwnerName") {
                            VehicleOwnerNameCriteria = columnsList[1];
                            VehicleOwnerName = columnsList[2];
                        }

                        if (columnsList[0] === "VehicleOwnerAddress1") {
                            VehicleOwnerAddress1Criteria = columnsList[1];
                            VehicleOwnerAddress1 = columnsList[2];
                        }

                        if (columnsList[0] === "VehicleOwnerAddress2") {
                            VehicleOwnerAddress2Criteria = columnsList[1];
                            VehicleOwnerAddress2 = columnsList[2];
                        }

                        if (columnsList[0] === "Field1") {
                            Field1Criteria = columnsList[1];
                            Field1 = columnsList[2];
                        }

                        if (columnsList[0] === "Field2") {
                            Field2Criteria = columnsList[1];
                            Field2 = columnsList[2];
                        }

                        if (columnsList[0] === "Field3") {
                            Field3Criteria = columnsList[1];
                            Field3 = columnsList[2];
                        }

                        if (columnsList[0] === "Field4") {
                            Field4Criteria = columnsList[1];
                            Field4 = columnsList[2];
                        }

                        if (columnsList[0] === "Field5") {
                            Field5Criteria = columnsList[1];
                            Field5 = columnsList[2];
                        }

                        if (columnsList[0] === "Field6") {
                            Field6Criteria = columnsList[1];
                            Field6 = columnsList[2];
                        }

                        if (columnsList[0] === "Field7") {
                            Field7Criteria = columnsList[1];
                            Field7 = columnsList[2];
                        }

                        if (columnsList[0] === "Field8") {
                            Field8Criteria = columnsList[1];
                            Field8 = columnsList[2];
                        }

                        if (columnsList[0] === "Field9") {
                            Field9Criteria = columnsList[1];
                            Field9 = columnsList[2];
                        }

                        if (columnsList[0] === "Field10") {
                            Field10Criteria = columnsList[1];
                            Field10 = columnsList[2];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                debugger;
                var requestData =
                {
                    ServicesAction: 'GetAllTransportVehicle_Paging',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: OrderBy,
                    OrderByCriteria: OrderByCriteria,

                    VehicleName: VehicleName,
                    VehicleNameCriteria: VehicleNameCriteria,
                    VehicleRegistrationNumber: VehicleRegistrationNumber,
                    VehicleRegistrationNumberCriteria: VehicleRegistrationNumberCriteria,
                    TransporterName: TransporterName,
                    TransporterNameCriteria: TransporterNameCriteria,
                    VehicleTypeName: VehicleTypeName,
                    VehicleTypeNameCriteria: VehicleTypeNameCriteria,
                    NumberOfCompartments: NumberOfCompartments,
                    NumberOfCompartmentsCriteria: NumberOfCompartmentsCriteria,
                    TruckSize: TruckSize,
                    TruckSizeCriteria: TruckSizeCriteria,
                    SequenceNumber: SequenceNumber,
                    SequenceNumberCriteria: SequenceNumberCriteria,
                    InsuranceValidityDate: InsuranceValidityDate,
                    InsuranceValidityDateCriteria: InsuranceValidityDateCriteria,
                    FitnessCertificateDate: FitnessCertificateDate,
                    FitnessCertificateDateCriteria: FitnessCertificateDateCriteria,
                    VehicleOwnerName: VehicleOwnerName,
                    VehicleOwnerNameCriteria: VehicleOwnerNameCriteria,
                    VehicleOwnerAddress1: VehicleOwnerAddress1,
                    VehicleOwnerAddress1Criteria: VehicleOwnerAddress1Criteria,
                    VehicleOwnerAddress2: VehicleOwnerAddress2,
                    VehicleOwnerAddress2Criteria: VehicleOwnerAddress2Criteria,
                    Field1: Field1,
                    Field1Criteria: Field1Criteria,
                    Field2: Field2,
                    Field2Criteria: Field2Criteria,
                    Field3: Field3,
                    Field3Criteria: Field3Criteria,
                    Field4: Field4,
                    Field4Criteria: Field4Criteria,
                    Field5: Field5,
                    Field5Criteria: Field5Criteria,
                    Field6: Field6,
                    Field6Criteria: Field6Criteria,
                    Field7: Field7,
                    Field7Criteria: Field7Criteria,
                    Field8: Field8,
                    Field8Criteria: Field8Criteria,
                    Field9: Field9,
                    Field9Criteria: Field9Criteria,
                    Field10: Field10,
                    Field10Criteria: Field10Criteria,
                    CompanyId: $rootScope.CompanyId,
                    RoleId: $rootScope.RoleId
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
                            if (resoponsedata.Json.TransportVehicleList.length !== undefined) {
                                if (resoponsedata.Json.TransportVehicleList.length > 0) {
                                    totalcount = resoponsedata.Json.TransportVehicleList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.TransportVehicleList.TotalCount;
                            }

                            ListData = resoponsedata.Json.TransportVehicleList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.TransportVehicleList = $scope.TransportVehicleList.concat(data);
                    if ($scope.GridConfigurationLoaded === false) {
                        $scope.LoadGridByConfiguration();
                    }
                    return data;
                });
            }
        });

        $scope.TransportVehicleGrid = {
            dataSource: {
                store: TransportVehicleData
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
            keyExpr: "TransportVehicleId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.TransportVehicleId);
                    }
                    else if (e.column.cellTemplate === "Delete") {
                        $scope.Delete_DeleteTransPortVehicle(data.TransportVehicleId);
                    }
                    else if (e.column.cellTemplate === "ActiveInActiveTemplate") {


                        var isActive = "1";
                        if (data.IsActive === "1") {
                            isActive = "0";
                        }
                        else {
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
            columns: $scope.DynamicColumnList
        };
    };


    //$scope.LoadTransportVehicleGrid();

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {

        $scope.PaymentPlanList = [];
        var dataGrid = $("#TransportVehicleGrid").dxDataGrid("instance");
        dataGrid.refresh();
    };
    //#endregion
    //#endregion

    $scope.GetAllCompanyAsTransporter = function () {

        var requestData =
        {
            ServicesAction: 'GetAllCompanyAsTransporter'
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            $scope.Company_TransporterList = response.data.Json.CompanyList;

            if ($rootScope.RoleName == "Carrier" || $rootScope.RoleName == "TransportManager") {
                $scope.TransportVehicleJSON.TransporterId = $rootScope.CompanyId + "";
            }

        });
    }
    $scope.GetAllCompanyAsTransporter();


    $scope.GetTruckSizeListByVehicleType = function (transportVehicleId) {
        debugger;
        var requestData =
        {
            ServicesAction: 'GetAllTruckSizeListByVehicleId',
            VehicleTypeId: transportVehicleId
        };
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            if (response.data.Json !== undefined) {
                var resoponsedata = response.data.Json.TruckSizeList;
                $scope.bindTruckSizeList = resoponsedata;

                $scope.TransportVehicleJSON.TruckSizeId = $scope.EditedTruckTonnage;
            }
            else {
                $scope.bindTruckSizeList = [];
            }
        });
    }
    //$scope.GetAllTruckSize();





    var vehicleTypeList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'VehicleType'; });
    //
    if (vehicleTypeList.length > 0) {
        $scope.VehicleTypeList = vehicleTypeList;

        if (vehicleTypeList.length === 1) {

            $scope.TransportVehicleJSON.VehicleTypeId = vehicleTypeList[0].LookUpId;
            $scope.GetTruckSizeListByVehicleType($scope.TransportVehicleJSON.VehicleTypeId);

        }
    }

    var vehicleProductTypeList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'VehicleProductType'; });
    //
    if (vehicleProductTypeList.length > 0) {
        $scope.VehicleProductTypeList = vehicleProductTypeList;
        for (var i = 0; i < $scope.VehicleProductTypeList.length; i++) {
            $scope.VehicleProductTypeList[i].Id = $scope.VehicleProductTypeList[i].LookUpId;
        }
    }

    var unitOfMeasureList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'UnitOfMeasure'; });
    //
    if (unitOfMeasureList.length > 0) {
        $scope.UnitOfMeasureList = unitOfMeasureList;
    }


    //
    $scope.SelectVehicleProductTypeList = [];
    //$scope.VehicleProductTypeList_Save = [];
    $scope.SortByListSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false
        //multiple:false

    };

    //$scope.VehicleProductTypeSelectEvent = {
    //    onItemSelect: function (item) {
    //        

    //        var selectedId = item.Id;

    //        var vehicleProductTypeList = $scope.VehicleProductTypeList.filter(function (el) { return el.Id === selectedId; });
    //        //$scope.VehicleProductTypeList_Save.push(VehicleProductType);
    //        // $scope.changeobjectName();

    //        //$scope.VehicleProductTypeList = $scope.SelectVehicleProductTypeList;

    //        var vehicleProductType = {
    //            //VehicleCompartmentGuid: generateGUID(),
    //            ProductTypeId: vehicleProductTypeList[0].LookUpId,
    //            ProductType: vehicleProductTypeList[0].Name,
    //            IsActive: true,
    //            CreatedBy: $rootScope.UserId
    //        };
    //        $scope.VehicleProductTypeList_Save.push(vehicleProductType);
    //    },
    //    onItemDeselect: function (item) {
    //        
    //        var selectedId = item.Id;
    //        $scope.VehicleProductTypeList_Save = $scope.VehicleProductTypeList_Save.filter(function (el) { return el.LookUpId !== selectedId; });

    //    }
    //}





    $scope.LoadGridConfigurationData = function () {



        var objectId = 744;

        var gridrequestData =
        {
            ServicesAction: 'LoadGridConfiguration',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            CultureId: $rootScope.CultureId,
            ObjectId: objectId,
            ObjectName: 'TransportVehicle',
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


                $scope.LoadTransportVehicleGrid();
                if ($scope.IsRefreshGrid === true) {
                    $scope.RefreshDataGrid();
                }
            } else {
            }
        });
    }

    $scope.LoadGridConfigurationData();


    $scope.GridConfigurationLoaded = false;

    $scope.LoadGridByConfiguration = function (e) {
        debugger;
        console.log("9" + new Date());
        $rootScope.Throbber.Visible = true;
        var dataGrid = $("#TransportVehicleGrid").dxDataGrid("instance");

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

    //#region Compartment Grid Functions/Methods
    $scope.AddCompartment = function () {
        debugger;

        if ($scope.TransportVehicleJSON.CompartmentName === "") {
            $rootScope.ValidationErrorAlert('Please Enter Compartment Name.');
            return;
        }

        if ($scope.TransportVehicleJSON.Capacity === "") {
            $rootScope.ValidationErrorAlert('Please Enter Capacity.');
            return;
        }

        if ($scope.TransportVehicleJSON.UnitOfMeasureId <= 0) {
            $rootScope.ValidationErrorAlert('Please Select Unit Of Measure.');
            return;
        }

        var unitOfMeasureId = $scope.TransportVehicleJSON.UnitOfMeasureId;
        var unitOfMeasure = $.grep($scope.UnitOfMeasureList, function (uom) {
            return uom.LookUpId === unitOfMeasureId;
        })[0].Name;
        $scope.TransportVehicleJSON.UnitOfMeasure = unitOfMeasure;


        if ($scope.EditVehicleCompartmentGuid !== "") {
            var compartmentDetail = $scope.CompartmentList.filter(function (m) { return m.VehicleCompartmentGuid === $scope.EditVehicleCompartmentGuid; });

            compartmentDetail[0].VehicleCompartmentId = $scope.VehicleCompartmentId;
            compartmentDetail[0].CompartmentName = $scope.TransportVehicleJSON.CompartmentName;
            compartmentDetail[0].Capacity = $scope.TransportVehicleJSON.Capacity;
            compartmentDetail[0].UnitOfMeasureId = $scope.TransportVehicleJSON.UnitOfMeasureId;
            compartmentDetail[0].UnitOfMeasure = $scope.TransportVehicleJSON.UnitOfMeasure;
            compartmentDetail[0].IsActive = true;
            compartmentDetail[0].UpdatedBy = $rootScope.UserId;
        }
        else {
            var compartmentDto = {
                VehicleCompartmentGuid: generateGUID(),
                VehicleCompartmentId: $scope.VehicleCompartmentId,
                CompartmentName: $scope.TransportVehicleJSON.CompartmentName,
                Capacity: $scope.TransportVehicleJSON.Capacity,
                UnitOfMeasureId: $scope.TransportVehicleJSON.UnitOfMeasureId,
                UnitOfMeasure: $scope.TransportVehicleJSON.UnitOfMeasure,
                IsActive: true,
                CreatedBy: $rootScope.UserId
            };
            debugger;

            $scope.CompartmentList.push(compartmentDto);
            $scope.CalculateNumberOfCompartments();
        }
        $scope.ClearCompartmentControls();
    };

    $scope.EditCompartment = function (id) {

        $scope.ClearCompartmentControls();
        var compartment = $scope.CompartmentList.filter(function (m) { return m.VehicleCompartmentGuid === id; });

        //$scope.VehicleCompartmentGuid = "";
        $scope.EditVehicleCompartmentGuid = id;
        //$scope.VehicleCompartmentId = compartment[0].VehicleCompartmentId;
        $scope.TransportVehicleJSON.CompartmentName = compartment[0].CompartmentName;
        $scope.TransportVehicleJSON.Capacity = compartment[0].Capacity;
        $scope.TransportVehicleJSON.UnitOfMeasureId = compartment[0].UnitOfMeasureId;
        //$scope.TransportVehicleJSON.UnitOfMeasure = compartment[0].UnitOfMeasure;
    };

    $scope.ClearCompartmentControls = function () {
        $scope.VehicleCompartmentGuid = "";
        $scope.EditVehicleCompartmentGuid = "";
        $scope.VehicleCompartmentId = 0;
        $scope.TransportVehicleJSON.CompartmentName = "";
        $scope.TransportVehicleJSON.Capacity = "";
        $scope.TransportVehicleJSON.UnitOfMeasureId = 0;
        $scope.TransportVehicleJSON.UnitOfMeasure = "";
    };

    $scope.DeleteCompartment = function (id) {

        var compartmentList = $scope.CompartmentList.filter(function (m) { return m.VehicleCompartmentGuid !== id; });
        $scope.CompartmentList = compartmentList;
        $scope.CalculateNumberOfCompartments();
        $scope.CloseDeleteConfirmation();
    };

    $scope.CalculateNumberOfCompartments = function () {
        $scope.TransportVehicleJSON.NumberOfCompartments = $scope.CompartmentList.length;
    };

    //#endregion


    $scope.AddForm = function () {

        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.SelectedId_TransportVehicleGrid = 0;
        $scope.ClearAllControls();
    };

    $scope.ViewForm = function () {

        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.compartmentID = '';
        $scope.TransportVehicleJSON.PageTabHeader = $rootScope.resData.res_TransportVehicleUI_Add;

    };

    $scope.ViewForm();

    $scope.fileupload = {
        File: ''
    };

    $scope.checkdocumentvalid = function (document) {
        var isValidDocument = true;
        if (document !== "") {
            if ($scope.documenttypeforvehiclecertificate !== "") {
                var documentType = $scope.documenttypeforvehiclecertificate.split(',');
                document = document.split('/')[1];
                for (var i = 0; i < documentType.length; i++) {
                    if (documentType[i] === document) {
                        isValidDocument = true;
                        break;
                    } else {
                        isValidDocument = false;
                    }
                }
            } else {
                isValidDocument = true;
            }
        } else {
            isValidDocument = false;
        }
        return isValidDocument;
    }

    $scope.Save = function () {


        debugger;

        if ($scope.TransportVehicleJSON.VehicleRegistrationNumber === "") {
            $rootScope.ValidationErrorAlert('Please Enter Vehicle Registration Number.');
            return;
        }

        if ($scope.TransportVehicleJSON.TransporterId <= 0) {
            $rootScope.ValidationErrorAlert('Please Select Transporter.');
            return;
        }

        if ($scope.TransportVehicleJSON.VehicleTypeId <= 0) {
            $rootScope.ValidationErrorAlert('Please Select Vehicle Type.');
            return;
        }

        if ($scope.TransportVehicleJSON.TruckSizeId <= 0) {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_TransporterPage_TruckSizeNotSelected));
            return;
        }



        var requestData =
        {
            ServicesAction: 'DuplicateTransporterCheck',
            TransportVehicleId: $scope.TransportVehicleId,
            VehicleRegistrationNumber: $scope.TransportVehicleJSON.VehicleRegistrationNumber,
            TransporterId: $scope.TransportVehicleJSON.TransporterId,
        };



        var consolidateApiParamater =
        {
            Json: requestData
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            var isValid = '0';
            if (response.data !== undefined) {
                if (response.data.Json !== undefined) {
                    isValid = response.data.Json.IsValid;
                }
            }
            if (isValid === '0') {
                var documentName = "";
                var documentBase64 = "";
                var documentExtension = "";

                if ($scope.fileupload.File !== "") {
                    if ($scope.fileupload.File.dataFile.size > 2048000) {
                        $scope.FileSize = true;
                        documentName = $scope.fileupload.File.dataFile.name;
                        documentBase64 = $scope.fileupload.File.dataBase64;
                        documentExtension = $scope.fileupload.File.dataFile.name.split('.')[1];
                    }
                    else {

                        $scope.FileSize = false;
                        documentName = $scope.fileupload.File.dataFile.name;
                        documentBase64 = $scope.fileupload.File.dataBase64;
                        documentExtension = $scope.fileupload.File.dataFile.name.split('.')[1];

                        if ($scope.checkdocumentvalid($scope.fileupload.File.dataFile.type)) {
                            $scope.FileType = true;
                        }
                        else {
                            $scope.FileType = false;
                        }

                    }
                } else {
                    documentName = "";
                    documentBase64 = $scope.TransportVehicleJSON.RegisteredVehicleCertificateBlob;
                    documentExtension = $scope.TransportVehicleJSON.FormatType;
                    $scope.FileType = true;
                    $scope.FileSize = false;

                }

                if ($scope.FileSize === false || $scope.TransportVehicleJSON.RegisteredVehicleCertificateBlob !== "") {
                    if ($scope.FileType === true || $scope.TransportVehicleJSON.RegisteredVehicleCertificateBlob !== "") {
                        var transportVehicle = {
                            TransportVehicleId: $scope.TransportVehicleId,
                            VehicleName: $scope.TransportVehicleJSON.VehicleName,
                            VehicleRegistrationNumber: $scope.TransportVehicleJSON.VehicleRegistrationNumber,
                            TransporterId: $scope.TransportVehicleJSON.TransporterId,
                            VehicleTypeId: $scope.TransportVehicleJSON.VehicleTypeId,
                            NumberOfCompartments: $scope.TransportVehicleJSON.NumberOfCompartments,
                            TruckSizeId: $scope.TransportVehicleJSON.TruckSizeId,
                            SequenceNumber: $scope.TransportVehicleJSON.SequenceNumber,
                            IsVehicleInsured: $scope.TransportVehicleJSON.IsVehicleInsured,
                            InsuranceValidityDate: $scope.TransportVehicleJSON.InsuranceValidityDate,
                            IsFitnessCertificateAvailed: $scope.TransportVehicleJSON.IsFitnessCertificateAvailed,
                            FitnessCertificateDate: $scope.TransportVehicleJSON.FitnessCertificateDate,
                            VehicleOwnerName: $scope.TransportVehicleJSON.VehicleOwnerName,
                            VehicleOwnerAddress1: $scope.TransportVehicleJSON.VehicleOwnerAddress1,
                            VehicleOwnerAddress2: $scope.TransportVehicleJSON.VehicleOwnerAddress2,

                            FormatType: documentExtension,
                            RegisteredVehicleCertificateBlob: documentBase64,

                            Field1: $scope.TransportVehicleJSON.Field1,
                            Field2: $scope.TransportVehicleJSON.Field2,
                            Field3: $scope.TransportVehicleJSON.Field3,
                            Field4: $scope.TransportVehicleJSON.Field4,
                            Field5: $scope.TransportVehicleJSON.Field5,
                            Field6: $scope.TransportVehicleJSON.Field6,
                            Field7: $scope.TransportVehicleJSON.Field7,
                            Field8: $scope.TransportVehicleJSON.Field8,
                            Field9: $scope.TransportVehicleJSON.Field9,
                            Field10: $scope.TransportVehicleJSON.Field10,

                            IsActive: true,
                            CreatedBy: $rootScope.UserId,
                            UpdatedBy: $rootScope.UserId,
                            PageName: 'Transport Vehicle',
                            RoleId: $rootScope.RoleId,
                            UserId: $rootScope.UserId
                        };

                        //var transportVehicleList = [];
                        //transportVehicleList.push(transportVehicle);


                        var vehicleProductTypeList = [];
                        for (var i = 0; i < $scope.SelectVehicleProductTypeList.length; i++) {
                            var selectedId = $scope.SelectVehicleProductTypeList[i].Id;
                            var vehicleProductType = $scope.VehicleProductTypeList.filter(function (el) { return el.Id === selectedId; });

                            var vehicleProductTypeDto = {
                                ProductTypeId: vehicleProductType[0].LookUpId,
                                ProductType: vehicleProductType[0].Name,
                                IsActive: true,
                                CreatedBy: $rootScope.UserId
                            };
                            vehicleProductTypeList.push(vehicleProductTypeDto);
                        }

                        var requestData =
                        {
                            ServicesAction: 'SaveTransportVehicle',
                            TransportVehicleList: transportVehicle,
                            VehicleCompartmentList: $scope.CompartmentList,
                            VehicleProductTypeList: vehicleProductTypeList
                        };



                        var consolidateApiParamater =
                        {
                            Json: requestData
                        };

                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            if (response.data.Json != undefined) {

                                if ($scope.TransportVehicleId !== 0) {
                                    $rootScope.ValidationErrorAlert('Record updated successfully', 'success', 3000);
                                }
                                else {
                                    $rootScope.ValidationErrorAlert('Record saved successfully', 'success', 3000);
                                }

                                $scope.ClearAllControls();
                                $scope.ViewForm();
                                $scope.RefreshDataGrid();
                            }
                            else {
                                $rootScope.ValidationErrorAlert(response.data.ErrorValidationMessage +  String.format($rootScope.resData.res_ServerSideVlaidationMsg_View), '', 3000);
                                $rootScope.Throbber.Visible = false;
                            }
                        });
                    }
                    else {
                        $rootScope.ValidationErrorAlert('Something went wrong', 'error', 3000);
                    }
                }
                else {
                    $rootScope.ValidationErrorAlert('Something went wrong', 'error', 3000);
                }
            }
            else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_TransporterPage_DuplicateRecordForTransportVehicle), 'error', 3000);
            }

        });

    };

    $scope.EditedTruckTonnage = "";
    $scope.Edit = function (id) {
        debugger;

        $scope.AddForm();

        var requestData =
        {
            ServicesAction: 'GetTransportVehicleById',
            TransportVehicleId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data.Json.TransportVehicleList;
            $scope.TransportVehicleId = id;
            $scope.TransportVehicleJSON.VehicleName = resoponsedata[0].VehicleName;
            $scope.TransportVehicleJSON.VehicleRegistrationNumber = resoponsedata[0].VehicleRegistrationNumber;
            $scope.TransportVehicleJSON.TransporterId = resoponsedata[0].TransporterId;
            $scope.TransportVehicleJSON.VehicleTypeId = resoponsedata[0].VehicleTypeId;
            $scope.GetTruckSizeListByVehicleType(resoponsedata[0].VehicleTypeId);
            $scope.TransportVehicleJSON.NumberOfCompartments = resoponsedata[0].NumberOfCompartments;
            $scope.EditedTruckTonnage = resoponsedata[0].TruckSizeId;
            $scope.TransportVehicleJSON.TruckSizeId = resoponsedata[0].TruckSizeId;
            $scope.TransportVehicleJSON.SequenceNumber = resoponsedata[0].SequenceNumber;
            $scope.TransportVehicleJSON.IsVehicleInsured = resoponsedata[0].IsVehicleInsured;
            $scope.TransportVehicleJSON.InsuranceValidityDate = resoponsedata[0].InsuranceValidityDate;
            $scope.TransportVehicleJSON.IsFitnessCertificateAvailed = resoponsedata[0].IsFitnessCertificateAvailed;
            $scope.TransportVehicleJSON.FitnessCertificateDate = resoponsedata[0].FitnessCertificateDate;
            $scope.TransportVehicleJSON.VehicleOwnerName = resoponsedata[0].VehicleOwnerName;
            $scope.TransportVehicleJSON.VehicleOwnerAddress1 = resoponsedata[0].VehicleOwnerAddress1;
            $scope.TransportVehicleJSON.VehicleOwnerAddress2 = resoponsedata[0].VehicleOwnerAddress2;

            $scope.TransportVehicleJSON.FormatType = resoponsedata[0].FormatType;
            $scope.TransportVehicleJSON.RegisteredVehicleCertificateBlob = resoponsedata[0].RegisteredVehicleCertificateBlob;

            $scope.TransportVehicleJSON.Field1 = resoponsedata[0].Field1;
            $scope.TransportVehicleJSON.Field2 = resoponsedata[0].Field2;
            $scope.TransportVehicleJSON.Field3 = resoponsedata[0].Field3;
            $scope.TransportVehicleJSON.Field4 = resoponsedata[0].Field4;
            $scope.TransportVehicleJSON.Field5 = resoponsedata[0].Field5;
            $scope.TransportVehicleJSON.Field6 = resoponsedata[0].Field6;
            $scope.TransportVehicleJSON.Field7 = resoponsedata[0].Field7;
            $scope.TransportVehicleJSON.Field8 = resoponsedata[0].Field8;
            $scope.TransportVehicleJSON.Field9 = resoponsedata[0].Field9;
            $scope.TransportVehicleJSON.Field10 = resoponsedata[0].Field10;
            debugger;
            if (resoponsedata[0].CompartmentList !== undefined && resoponsedata[0].CompartmentList !== null) {
                $scope.CompartmentList = resoponsedata[0].CompartmentList;
                for (var i = 0; i < $scope.CompartmentList.length; i++) {
                    $scope.CompartmentList[i].VehicleCompartmentGuid = generateGUID();
                }

                $scope.SelectVehicleProductTypeList = resoponsedata[0].VehicleProductTypeList;
            }
            else {
                $scope.CompartmentList = [];
            }

            $scope.TransportVehicleJSON.PageTabHeader = "Edit";
            $scope.IsEditMode = true;

        });
    };

    $scope.ClearAllControls = function () {
        $scope.ClearCompartmentControls();
        $scope.TransportVehicleGuid = "";
        $scope.SelectedId_TransportVehicleGrid = 0;
        $scope.TransportVehicleId = 0;
        angular.element("input[type='file']").val(null);
        $scope.TransportVehicleJSON.labelFilename = "";
        $scope.fileupload.File = "";
        $scope.EditedTruckTonnage = "";
        $scope.TransportVehicleJSON.VehicleName = "";
        $scope.TransportVehicleJSON.VehicleRegistrationNumber = "";
        $scope.TransportVehicleJSON.TransporterId = 0;
        $scope.TransportVehicleJSON.VehicleTypeId = 0;
        $scope.TransportVehicleJSON.NumberOfCompartments = "";
        $scope.TransportVehicleJSON.TruckSizeId = 0;
        $scope.TransportVehicleJSON.SequenceNumber = "";
        $scope.TransportVehicleJSON.IsVehicleInsured = "";
        $scope.TransportVehicleJSON.InsuranceValidityDate = "";
        $scope.TransportVehicleJSON.IsFitnessCertificateAvailed = "";
        $scope.TransportVehicleJSON.FitnessCertificateDate = "";
        $scope.TransportVehicleJSON.VehicleOwnerName = "";
        $scope.TransportVehicleJSON.VehicleOwnerAddress1 = "";
        $scope.TransportVehicleJSON.VehicleOwnerAddress2 = "";
        $scope.TransportVehicleJSON.FormatType = "";
        $scope.TransportVehicleJSON.RegisteredVehicleCertificateBlob = "";
        $scope.TransportVehicleJSON.Field1 = "";
        $scope.TransportVehicleJSON.Field2 = "";
        $scope.TransportVehicleJSON.Field3 = "";
        $scope.TransportVehicleJSON.Field4 = "";
        $scope.TransportVehicleJSON.Field5 = "";
        $scope.TransportVehicleJSON.Field6 = "";
        $scope.TransportVehicleJSON.Field7 = "";
        $scope.TransportVehicleJSON.Field8 = "";
        $scope.TransportVehicleJSON.Field9 = "";
        $scope.TransportVehicleJSON.Field10 = "";
        $scope.compartmentID === '';
        $scope.TransportVehicleList = [];
        $scope.SelectedId_TransportVehicleGrid = 0;
        $scope.CompartmentList = [];
        $scope.SelectVehicleProductTypeList = [];
        $scope.TransportVehicleJSON.PageTabHeader = $rootScope.resData.res_TransportVehicleUI_Add;

        if ($scope.VehicleTypeList.length === 1) {

            $scope.TransportVehicleJSON.VehicleTypeId = $scope.VehicleTypeList[0].LookUpId;
            $scope.GetTruckSizeListByVehicleType($scope.TransportVehicleJSON.VehicleTypeId);

        }

        if ($rootScope.RoleName == "Carrier" || $rootScope.RoleName == "TransportManager") {
            $scope.TransportVehicleJSON.TransporterId = $rootScope.CompanyId + "";
        }

        $scope.IsEditMode = false;

    };

    $scope.DeleteYesbutton = function () {
        debugger;
        if (($scope.compartmentID === '' || $scope.compartmentID === null || $scope.compartmentID === undefined)
            &&
            ($scope.SelectedId_TransportVehicleGrid !== '' && $scope.SelectedId_TransportVehicleGrid !== null && $scope.SelectedId_TransportVehicleGrid !== undefined)
        ) {
            $scope.DeleteYes();
        }
        else if (($scope.SelectedId_TransportVehicleGrid === '' || $scope.SelectedId_TransportVehicleGrid === null || $scope.SelectedId_TransportVehicleGrid === undefined || $scope.SelectedId_TransportVehicleGrid === 0)
            &&
            ($scope.compartmentID !== '' && $scope.compartmentID !== null && $scope.compartmentID !== undefined)
        ) {
            $scope.DeleteCompartment($scope.compartmentID)
        }
    }

    $scope.DeleteYes = function () {
        var requestData =
        {
            ServicesAction: 'DeleteTransportVehicleById',
            TransportVehicleId: $scope.SelectedId_TransportVehicleGrid,
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.CloseDeleteConfirmation();
            $scope.RefreshDataGrid();
        });
    };

    $scope.Delete_DeleteTransPortVehicle = function (Id) {
        $scope.SelectedId_TransportVehicleGrid = Id;
        $scope.DeleteWarningMessageControl.show();
    }

    $scope.FileNameChanged = function (element) {
debugger;
        $scope.$apply(function () {
debugger;
            $scope.TransportVehicleJSON.labelFilename = element.files[0].name;

            if (element.files[0].type !== "image/png" && element.files[0].type !== "application/pdf" && element.files[0].type !== "image/jpg" && element.files[0].type !== "image/jpeg") {
                $rootScope.ValidationErrorAlert('Only png, jpg, pdf files are allowed.', '', 3000);
                $scope.TransportVehicleJSON.labelFilename = "";
            }

        });
    };


    //$scope.DownloadCertificateByTransportVehicleId = function (transporterVehicleId, fromatType) {
    //    
    //    var orderRequestData =
    //    {
    //        ServicesAction: 'LoadTransportVehicleByTransportVehicleId',
    //        TransporterVehicleId: transporterVehicleId
    //    }
    //    var jsonobject = {};
    //    jsonobject.Json = orderRequestData;
    //    GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
    //        
    //        var byteCharacters1 = response.data;
    //        if (response.data != undefined) {
    //            var byteCharacters = response.data;
    //            var blob = new Blob([byteCharacters], {
    //                type: "application/Pdf"
    //            });
    //            if (blob.size > 0) {
    //                var filName = "RegisteredCertificate" + transporterVehicleId + "." + fromatType;
    //                saveAs(blob, filName);
    //            } else {
    //                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_DocumentNotGenerated), '', 3000);
    //            }
    //        } else {
    //            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_DocumentNotGenerated), '', 3000);
    //        }
    //    });
    //}

    $scope.DeleteConfirmationOpen = function (id) {
        $scope.compartmentID = id;
        $scope.DeleteWarningMessageControl.show();
    }

    $scope.filterValue = function ($event) {

        var regex = new RegExp("^[0-9]*$");

        var key = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);
        if (!regex.test(key)) {
            $event.preventDefault();
        }
    };

    $scope.DownloadDocument = function () {

        var orderRequestData =
        {

            ServicesAction: 'GetTransportVehicleById',
            TransportVehicleId: $scope.TransportVehicleId

        }
        var jsonobject = {};
        jsonobject.Json = orderRequestData;
        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {

            var byteCharacters1 = response.data;
            if (response.data != undefined) {

                var byteCharacters = response.data;
                var filName = "VehicleCertificate";

                var byteCharacters = response.data;

                if ($scope.TransportVehicleJSON.FormatType === "PNG" || $scope.TransportVehicleJSON.FormatType === "png" || $scope.TransportVehicleJSON.FormatType === "JPG" || $scope.TransportVehicleJSON.FormatType === "jpg" || $scope.TransportVehicleJSON.FormatType === "JPEG" || $scope.TransportVehicleJSON.FormatType === "jpeg") {
                    var blob1 = new Blob([byteCharacters], {
                        type: "image/" + $scope.TransportVehicleJSON.FormatType
                    });

                    // var uuid = generateUUID();

                    saveAs(blob1, filName);
                }
                else if ($scope.TransportVehicleJSON.FormatType === "pdf" || $scope.TransportVehicleJSON.FormatType === "png") {
                    var blob2 = new Blob([byteCharacters], {
                        type: "application/" + $scope.TransportVehicleJSON.FormatType
                    });

                    // var uuid = generateUUID();

                    saveAs(blob2, filName);
                }

                // var uuid = generateUUID();
                //var filName = documentName;
                //saveAs(blob, filName);

                //var byteCharacters = response.data;
                //var blob = new Blob([byteCharacters], {
                //    type: "application/" + extension
                //});
                //
                //// var uuid = generateUUID();
                //var filName = documentName;
                //saveAs(blob, filName);
            } else {
                //$rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_DocumentNotGenerated), '', 3000);
            }



        });


    };

});


