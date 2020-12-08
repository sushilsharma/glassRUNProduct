angular.module("glassRUNProduct").controller('PaymentPlanTransporterMappingController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    setTimeout(function () {
        pluginsService.init();
    }, 500);

    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_PaymentPlanTransporterMapping_PageHeading;


    $scope.PaymentPlanTransporterMappingList = [];
    $scope.PaymentPlanTransporterMappingId = 0;

    $scope.GetAllDistinctPaymentPlan = function () {
        
        var requestData =
        {
            ServicesAction: 'GetAllPaymentPlan'
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            $scope.PaymentPlanList_DDL = response.data.Json.PaymentPlanList;
        });
    };
    $scope.GetAllDistinctPaymentPlan();


    $scope.GetAllCompanyAsTransporter = function (paymentPlanId) {
        
        var requestData =
        {
            ServicesAction: 'GetAllCompanyAsTransporter_NotMapped',
            PaymentPlanId:paymentPlanId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            $scope.Company_TransporterList = response.data.Json.CompanyList;
            //if (transporter.length > 0) {
            //    for (var i = 0; i < transporter.length; i++) {
            //        $scope.Company_TransporterList = $scope.Company_TransporterList.filter(function (m) { return m.CompanyId !== transporter[i].CompanyId; });
            //    }
            //}
            //else {
            //    $scope.Company_TransporterList = response.data.Json.CompanyList;
            //}

        });
    };

    //$scope.GetAllCompanyAsTransporter();


    $scope.PlanChangeEvent = function (paymentPlanId) {
        
        //alert('sdfsdf' + paymentPlanId);
        //var transporter = $scope.PaymentPlanTransporterMappingList.filter(function (m) { return m.PaymentPlanId === paymentPlanId; });
        //$scope.Company_TransporterList = $scope.Company_TransporterList.filter(function (m) { return m.TransporterId !== transporter.CompanyId; });
        //var transporterId = transporter.length > 0 ? transporter[0].CompanyId : 0;
        $scope.GetAllCompanyAsTransporter(paymentPlanId);
    };



    $scope.PaymentPlanTransporterMappingJSON = {
        PaymentPlanTransporterMappingId: 0,
        PaymentPlanId: 0,
        TransporterId: 0
    };

    //#region Load Payment Plan Transporter Mapping Grid
    $scope.LoadPaymentPlanTransporterMappingGrid = function () {
        

        console.log("1" + new Date());

        var PaymentPlanTransporterMappingData = new DevExpress.data.CustomStore({
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

                var PlanName = "";
                var PlanNameCriteria = "";

                var CompanyName = "";
                var CompanyNameCriteria = "";

                
                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "PlanName") {
                            PlanNameCriteria = columnsList[1];
                            PlanName = columnsList[2];
                        }

                        if (columnsList[0] === "CompanyName") {
                            CompanyNameCriteria = columnsList[1];
                            CompanyName = columnsList[2];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                
                var requestData =
                {
                    ServicesAction: 'GetAllPaymentPlanTransporterMapping_Paging',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: "",//OrderBy,
                    OrderByCriteria: "",//OrderByCriteria,

                    PlanName: PlanName,
                    PlanNameCriteria: PlanNameCriteria,
                    CompanyName: CompanyName,
                    CompanyNameCriteria: CompanyNameCriteria
                };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                {
                    Json: requestData
                };

                console.log("2" + new Date());
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    
                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {
                        
                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.PaymentPlanTransporterMappingList.length !== undefined) {
                                if (resoponsedata.Json.PaymentPlanTransporterMappingList.length > 0) {
                                    totalcount = resoponsedata.Json.PaymentPlanTransporterMappingList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.PaymentPlanTransporterMappingList.TotalCount;
                            }

                            ListData = resoponsedata.Json.PaymentPlanTransporterMappingList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.PaymentPlanTransporterMappingList = $scope.PaymentPlanTransporterMappingList.concat(data);
                    console.log("3" + new Date());
                    return data;
                });
            }
        });

        $scope.PaymentPlanTransporterMappingGrid = {
            dataSource: {
                store: PaymentPlanTransporterMappingData
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
            keyExpr: "PaymentPlanTransporterMappingId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {
                
                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Delete") {
                        $scope.Delete(data.PaymentPlanTransporterMappingId);
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
                    caption: "Payment Plan",
                    dataField: "PlanName",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left",
                    //width: 150
                },
                {
                    caption: "Transporter Name",
                    dataField: "CompanyName",
                    alignment: "left"
                },
                {
                    caption: "Delete",
                    dataField: "PaymentPlanTransporterMappingId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Delete",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 200
                }
            ]
        };
    }
    //#endregion

    $scope.LoadPaymentPlanTransporterMappingGrid();

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {
        
        $scope.PaymentSlabList = [];
        var dataGrid = $("#PaymentPlanTransporterMappingGrid").dxDataGrid("instance");
        dataGrid.refresh();
    };
    //#endregion

    $scope.AddForm = function () {
        //
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.ClearControls();
    };

    $scope.ViewForm = function () {
        //
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        //$scope.ClearControls();

    };

    $scope.ViewForm();

    $scope.Edit = function (id) {
        
        //$scope.AddForm();
        //var requestData =
        //{
        //    ServicesAction: 'GetPaymentPlanById',
        //    PaymentPlanId: id
        //};

        //var jsonobject = {};
        //jsonobject.Json = requestData;
        //GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        //    
        //    var responsedata = response.data.Json.PaymentPlanList;
        //    $scope.PaymentPlanId = id;
        //    $scope.PaymentPlanTransporterMappingJSON.PlanName = responsedata[0].PlanName;
        //    $scope.PaymentPlanTransporterMappingJSON.SlabId = responsedata[0].SlabId;
        //    $scope.PaymentPlanTransporterMappingJSON.SlabName = responsedata[0].SlabName;
        //    $scope.PaymentPlanTransporterMappingJSON.Amount = responsedata[0].Amount;
        //    $scope.PaymentPlanTransporterMappingJSON.AmountUnit = responsedata[0].AmountUnit;
        //    $scope.PaymentPlanTransporterMappingJSON.EffectiveFrom = responsedata[0].EffectiveFrom;
        //    $scope.PaymentPlanTransporterMappingJSON.EffectiveTo = responsedata[0].EffectiveTo;
        //    $scope.PaymentPlanTransporterMappingJSON.ApplicableAfter = responsedata[0].ApplicableAfter;

        //});
    };


    $scope.Save = function () {
        
        $rootScope.Throbber.Visible = true;
        if ($scope.PaymentPlanTransporterMappingJSON.PaymentPlanId > 0 && $scope.PaymentPlanTransporterMappingJSON.TransporterId > 0) {
            var paymentPlanTransporterMapping = {
                PaymentPlanTransporterMappingId: $scope.PaymentPlanTransporterMappingId,
                PaymentPlanId: $scope.PaymentPlanTransporterMappingJSON.PaymentPlanId,
                TransporterId: $scope.PaymentPlanTransporterMappingJSON.TransporterId
            };

            var paymentPlanTransporterMappingList = [];
            paymentPlanTransporterMappingList.push(paymentPlanTransporterMapping);

            var requestData =
            {
                ServicesAction: 'SavePaymentPlanTransporterMapping',
                PaymentPlanTransporterMappingList: paymentPlanTransporterMappingList
            };

            var consolidateApiParamater =
            {
                Json: requestData
            };

            
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                if ($scope.PaymentPlanTransporterMappingId !== 0) {
                    $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
                }
                else {
                    $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
                }
                $scope.ClearControls();
                $scope.ViewForm();
                $scope.RefreshDataGrid();
            });

        }
        else {
            $rootScope.ValidationErrorAlert('Please Select Plan Name & Transporter', '', 3000);
        }

        $rootScope.Throbber.Visible = false;
    };

    $scope.ClearControls = function () {
        $scope.PaymentPlanTransporterMappingId = 0;
        $scope.PaymentPlanTransporterMappingJSON.PaymentPlanId = 0;
        $scope.PaymentPlanTransporterMappingJSON.TransporterId = 0;
    };

    //#region Delete with Confirmation
    $ionicModal.fromTemplateUrl('WarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        //
        $scope.WarningMessageControl = modal;
    });


    $scope.CloseDeleteConfirmation = function () {
        $scope.WarningMessageControl.hide();
    };

    $scope.OpenDeleteConfirmation = function () {

        $scope.WarningMessageControl.show();
    };

    $scope.Delete = function (id) {
        $scope.SelectedId = id;
        $scope.OpenDeleteConfirmation();
    };

    $scope.DeleteYes = function () {
        //
        var requestData =
        {
            ServicesAction: 'DeletePaymentPlanTransporterMappingById',
            PaymentPlanTransporterMappingId: $scope.SelectedId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.CloseDeleteConfirmation();
            $scope.RefreshDataGrid();
        });
    };
    //#endregion
    //$scope.Delete = function (id) {
    //    var requestData =
    //    {
    //        ServicesAction: 'DeletePaymentPlanTransporterMappingById',
    //        PaymentPlanTransporterMappingId: id
    //    };

    //    var jsonobject = {};
    //    jsonobject.Json = requestData;
    //    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
    //        $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
    //        $scope.RefreshDataGrid();
    //    });
    //}
});