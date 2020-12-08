angular.module("glassRUNProduct").controller('PaymentPlanController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    setTimeout(function () {
        pluginsService.init();
    }, 500);

    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_PaymentPlan_PageHeading;

    $scope.PaymentPlanList = [];
    $scope.PaymentPlanId = 0;

    $scope.PaymentPlanJSON = {
        PaymentPlanId: 0,
        PlanName: ''
    }

    //#region Load Payment Plan Grid
    $scope.LoadPaymentPlanGrid = function () {
        

        console.log("1" + new Date());

        var PaymentPlanData = new DevExpress.data.CustomStore({
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

                
                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "PlanName") {
                            PlanNameCriteria = columnsList[1];
                            PlanName = columnsList[2];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                
                var requestData =
                {
                    ServicesAction: 'GetAllPaymentPlanPaging',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: "",//OrderBy,
                    OrderByCriteria: "",//OrderByCriteria,

                    PlanName: PlanName,
                    PlanNameCriteria: PlanNameCriteria
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
                            if (resoponsedata.Json.PaymentPlanList.length !== undefined) {
                                if (resoponsedata.Json.PaymentPlanList.length > 0) {
                                    totalcount = resoponsedata.Json.PaymentPlanList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.PaymentPlanList.TotalCount;
                            }

                            ListData = resoponsedata.Json.PaymentPlanList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.PaymentPlanList = $scope.PaymentPlanList.concat(data);
                    console.log("3" + new Date());
                    return data;
                });
            }
        });

        $scope.PaymentPlanGrid = {
            dataSource: {
                store: PaymentPlanData
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
            keyExpr: "PaymentPlanId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {
                
                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.PaymentPlanId);
                    }
                    else if (e.column.cellTemplate === "Delete") {
                        $scope.Delete(data.PaymentPlanId);
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
                    dataField: "PlanName",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left"
                    //width: 150
                },
                {
                    caption: "Edit",
                    dataField: "PaymentPlanId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Edit",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 200
                },
                {
                    caption: "Delete",
                    dataField: "PaymentPlanId",
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

    $scope.LoadPaymentPlanGrid();

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {
        
        $scope.PaymentPlanList = [];
        var dataGrid = $("#PaymentPlanGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

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
        //$scope.ClearAllControls();
        //gridCallBack();

    }

    $scope.ViewForm();

    $scope.Edit = function (id) {
        
        $scope.AddForm();
        var requestData =
        {
            ServicesAction: 'GetPaymentPlanById',
            PaymentPlanId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var responsedata = response.data.Json.PaymentPlanList;
            $scope.PaymentPlanId = id;
            $scope.PaymentPlanJSON.PlanName = responsedata[0].PlanName;
        });
    }

    $scope.Save = function () {
        
        if ($scope.PaymentPlanJSON.PlanName !== null && $scope.PaymentPlanJSON.PlanName !== "") {
            var paymentPlan = {
                PaymentPlanId: $scope.PaymentPlanId,
                PlanName: $scope.PaymentPlanJSON.PlanName,
                IsActive: true,
                CreatedBy: $rootScope.UserId,
                UpdatedBy: $rootScope.UserId
            }

            var paymentPlanList = [];
            paymentPlanList.push(paymentPlan);

            var requestData =
            {
                ServicesAction: 'SavePaymentPlan',
                PaymentPlanList: paymentPlanList
            };

            var consolidateApiParamater =
            {
                Json: requestData
            };

            
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                if ($scope.PaymentPlanId !== 0) {
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
            $rootScope.ValidationErrorAlert('Please Enter Plan Name', '', 3000);
        }
    };

    $scope.ClearControls = function () {
        $scope.PaymentPlanId = 0;
        $scope.PaymentPlanJSON.PlanName = "";
    }

    //#region Delete with Confirmation
    $ionicModal.fromTemplateUrl('WarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
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
            ServicesAction: 'DeletePaymentPlanById',
            PaymentPlanId: $scope.SelectedId 
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
});