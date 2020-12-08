angular.module("glassRUNProduct").controller('PaymentSlabController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    //

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    setTimeout(function () {
        pluginsService.init();
    }, 500);

    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_PaymentSlab_PageHeading;

    $scope.PaymentSlabList = [];
    $scope.PaymentSlabList_View = [];
    $scope.PaymentSlabId = 0;
    $scope.EditPaymentPlanGUID = "";

    $scope.LoadAllPaymentPlan = function () {
        //

        var requestData =
        {
            ServicesAction: 'GetAllPaymentPlan'
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            $scope.PaymentPlanList = response.data.Json.PaymentPlanList;
        });
    };

    $scope.LoadAllPaymentPlan();

    var slabList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'PaymentSlabs'; });
    //
    if (slabList.length > 0) {
        $scope.SlabList = slabList;
    }

    var unitOfMeasure_AmountList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'UnitOfMeasure_Amount'; });
    //
    if (unitOfMeasure_AmountList.length > 0) {
        $scope.UnitOfMeasure_AmountList = unitOfMeasure_AmountList;
    }

    //var applicableAfterList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ApplicableAfter'; });
    ////
    //if (applicableAfterList.length > 0) {
    //    $scope.ApplicableAfterList = applicableAfterList;
    //}

    $scope.GetAllDistinctWorkFlowStep = function () {
        

        var requestData =
        {
            ServicesAction: 'GetAllDistinctWorkFlowStep'
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            $scope.ApplicableAfterList = response.data.Json.WorkFlowStepList;
        });
    };

    $scope.GetAllDistinctWorkFlowStep();

    $scope.BindCalendar = function () {
        $('#RuleStartDate').each(function () {
            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    
                    if (inst.id !== undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                        $scope.GetScheduleDate(dateText);
                    }
                },
                minDate: new Date(),
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false
            });
        });
    };

    $scope.GetScheduleDate = function (date) {
        
        $('#RuleEndDate').each(function () {
            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    if (inst.id !== undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                    }
                },
                minDate: date,
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false
            });
        });
    };
    $scope.BindCalendar();

    $scope.PaymentSlabJSON = {
        PaymentSlabId: 0,
        PaymentPlanId: 0,
        PlanName: '',
        SlabId: 0,
        SlabName: '',
        Amount: 0,
        AmountUnit: 0,
        AmountUnitName: '',
        EffectiveFrom: '',
        EffectiveTo: '',
        ApplicableAfter: 0,
        ApplicableAfterName: ''
    };

    //#region Load Payment Plan Grid
    $scope.LoadPaymentPlanGrid = function () {
        

        console.log("1" + new Date());

        var PaymentSlabData = new DevExpress.data.CustomStore({
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

                var SlabName = "";
                var SlabNameCriteria = "";

                var Amount = "";
                var AmountCriteria = "";

                var AmountUnitName = "";
                var AmountUnitNameCriteria = "";

                var EffectiveFrom = "";
                var EffectiveFromCriteria = "";

                var EffectiveTo = "";
                var EffectiveToCriteria = "";

                var ApplicableAfterName = "";
                var ApplicableAfterNameCriteria = "";

                
                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "PlanName") {
                            PlanNameCriteria = columnsList[1];
                            PlanName = columnsList[2];
                        }

                        if (columnsList[0] === "SlabName") {
                            SlabNameCriteria = columnsList[1];
                            SlabName = columnsList[2];
                        }

                        if (columnsList[0] === "Amount") {
                            if (Amount === "") {
                                if (fields.length > 1) {
                                    AmountCriteria = "=";
                                } else {
                                    AmountCriteria = columnsList[1];
                                }
                                AmountCriteria = columnsList[1];
                                Amount = columnsList[2];
                            }
                        }

                        if (columnsList[0] === "AmountUnitName") {
                            AmountUnitNameCriteria = columnsList[1];
                            AmountUnitName = columnsList[2];
                        }

                        if (columnsList[0] === "ApplicableAfterName") {
                            ApplicableAfterNameCriteria = columnsList[1];
                            ApplicableAfterName = columnsList[2];
                        }

                        if (columnsList[0] === "EffectiveFrom") {
                            if (EffectiveFrom === "") {
                                if (fields.length > 1) {
                                    EffectiveFromCriteria = "=";
                                } else {
                                    EffectiveFromCriteria = columnsList[1];
                                }
                                EffectiveFrom = columnsList[2];
                                EffectiveFrom = new Date(EffectiveFrom);
                                EffectiveFrom = $filter('date')(EffectiveFrom, "dd/MM/yyyy");
                            }
                        }

                        if (columnsList[0] === "EffectiveTo") {
                            if (EffectiveTo === "") {
                                if (fields.length > 1) {
                                    EffectiveToCriteria = "=";
                                } else {
                                    EffectiveToCriteria = columnsList[1];
                                }
                                EffectiveTo = columnsList[2];
                                EffectiveTo = new Date(EffectiveTo);
                                EffectiveTo = $filter('date')(EffectiveTo, "dd/MM/yyyy");
                            }
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                
                var requestData =
                {
                    ServicesAction: 'GetAllPaymentSlabPaging',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: "",//OrderBy,
                    OrderByCriteria: "",//OrderByCriteria,

                    PlanName: PlanName,
                    PlanNameCriteria: PlanNameCriteria,
                    SlabName: SlabName,
                    SlabNameCriteria: SlabNameCriteria,
                    Amount: Amount,
                    AmountCriteria: AmountCriteria,
                    AmountUnitName: AmountUnitName,
                    AmountUnitNameCriteria: AmountUnitNameCriteria,
                    EffectiveFrom: EffectiveFrom,
                    EffectiveFromCriteria: EffectiveFromCriteria,
                    EffectiveTo: EffectiveTo,
                    EffectiveToCriteria: EffectiveToCriteria,
                    ApplicableAfterName: ApplicableAfterName,
                    ApplicableAfterNameCriteria: ApplicableAfterNameCriteria
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
                            if (resoponsedata.Json.PaymentSlabList.length !== undefined) {
                                if (resoponsedata.Json.PaymentSlabList.length > 0) {
                                    totalcount = resoponsedata.Json.PaymentSlabList[0].TotalCount;
                                }
                            } else {
                                totalcount = resoponsedata.Json.PaymentSlabList.TotalCount;
                            }

                            ListData = resoponsedata.Json.PaymentSlabList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.PaymentSlabList_View = $scope.PaymentSlabList_View.concat(data);
                    console.log("3" + new Date());
                    return data;
                });
            }
        });

        $scope.PaymentSlabGrid = {
            dataSource: {
                store: PaymentSlabData
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
            keyExpr: "PaymentSlabId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {
                
                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.caption === "Plan Name") {
                        $scope.LoadAllPaymentSlabsByPaymentPlanId(data.PaymentPlanId);
                    }
                    else if (e.column.caption === "Delete") {
                        $scope.Delete_ViewGrid(data.PaymentSlabId);
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
                    caption: "Plan Name",
                    dataField: "PlanName",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left",
                    width: 150
                },
                {
                    dataField: "SlabName",
                    alignment: "left"
                },
                {
                    caption: "Unit Of Measure",
                    dataField: "AmountUnitName",
                    alignment: "left"
                },
                {
                    dataField: "Amount",
                    alignment: "right",
                    filterOperations: ['=', '>', '<']
                },
                {
                    dataField: "EffectiveFrom",
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    filterOperations: ['=', '>', '<'],
                    alignment: "right"
                },
                {
                    dataField: "EffectiveTo",
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    filterOperations: ['=', '>', '<'],
                    alignment: "right"
                },
                {
                    caption: "Applicable After",
                    dataField: "ApplicableAfterName",
                    alignment: "left"
                },
                {
                    caption: "Delete",
                    dataField: "PaymentSlabId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Delete",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 200
                }
            ]
        };
    };
    //#endregion

    $scope.LoadPaymentPlanGrid();

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {
        
        $scope.PaymentSlabList = [];
        var dataGrid = $("#PaymentSlabGrid").dxDataGrid("instance");
        dataGrid.refresh();
    };
    //#endregion


    $scope.LoadAllPaymentSlabsByPaymentPlanId = function (planId) {
        

        $scope.AddForm();
        $scope.PaymentSlabJSON.PaymentPlanId = planId;
        var requestData =
        {
            ServicesAction: 'GetAllPaymentSlabsByPaymentPlanId',
            PaymentPlanId: planId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            $scope.PaymentSlabJSON.PlanName = response.data.Json.PaymentSlabList[0].PlanName;
            $scope.PaymentSlabList = response.data.Json.PaymentSlabList;

            for (var i = 0; i < $scope.PaymentSlabList.length; i++) {
                $scope.PaymentSlabList[i].PaymentPlanGUID = generateGUID();
            }
        });
    };

    $scope.AddForm = function () {
        //
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.ClearAllControls();
    };

    $scope.ViewForm = function () {
        //
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        //$scope.ClearAllControls();

    };

    $scope.ViewForm();

    $scope.AddPaymentPlan = function () {
        //alert('sdfsdf');
        

        if ($scope.PaymentSlabJSON.PlanName === "") {
            alert('Please Enter Plan Name.');
            return;
        }
        if ($scope.PaymentSlabJSON.SlabId <= 0) {
            alert('Please Select Slab.');
            return;
        }
        if ($scope.PaymentSlabJSON.AmountUnit <= 0) {
            alert('Please Select Unit Of Measure.');
            return;
        }
        if ($scope.PaymentSlabJSON.Amount === "") {
            alert('Please Enter Amount.');
            return;
        }
        if ($scope.PaymentSlabJSON.EffectiveFrom === "") {
            alert('Please Select Effective From Date.');
            return;
        }
        if ($scope.PaymentSlabJSON.EffectiveTo === "") {
            alert('Please Select Effective To Date.');
            return;
        }
        if ($scope.PaymentSlabJSON.ApplicableAfter <= 0) {
            alert('Please Select Applicable After.');
            return;
        }
        //var planId = $scope.PaymentSlabJSON.PaymentPlanId;
        //var planName = $.grep($scope.PaymentPlanList, function (paymentPlan) {
        //    return paymentPlan.PaymentPlanId === planId;
        //})[0].PlanName;
        //$scope.PaymentSlabJSON.PlanName = planName;

        var slabId = $scope.PaymentSlabJSON.SlabId;
        var slabName = $.grep($scope.SlabList, function (slab) {
            return slab.LookUpId === slabId;
        })[0].Name;
        $scope.PaymentSlabJSON.SlabName = slabName;

        var amountUnitId = $scope.PaymentSlabJSON.AmountUnit;
        var amountUnitName = $.grep($scope.UnitOfMeasure_AmountList, function (amountUnit) {
            return amountUnit.LookUpId === amountUnitId;
        })[0].Name;
        $scope.PaymentSlabJSON.AmountUnitName = amountUnitName;

        var applicableAfterId = $scope.PaymentSlabJSON.ApplicableAfter;
        var applicableAfterName = $.grep($scope.ApplicableAfterList, function (applicableAfter) {
            return applicableAfter.StatusCode === applicableAfterId;
        })[0].ActivityName;
        $scope.PaymentSlabJSON.ApplicableAfterName = applicableAfterName;

        
        if ($scope.EditPaymentPlanGUID !== "") {
            var PaymentSlab = $scope.PaymentSlabList.filter(function (m) { return m.PaymentPlanGUID === $scope.EditPaymentPlanGUID; });

            PaymentSlab[0].PaymentSlabId = $scope.PaymentSlabJSON.PaymentSlabId;
            PaymentSlab[0].PaymentPlanId = $scope.PaymentSlabJSON.PaymentPlanId;
            PaymentSlab[0].PlanName = $scope.PaymentSlabJSON.PlanName;
            PaymentSlab[0].SlabId = $scope.PaymentSlabJSON.SlabId;
            PaymentSlab[0].SlabName = $scope.PaymentSlabJSON.SlabName;
            PaymentSlab[0].Amount = $scope.PaymentSlabJSON.Amount;
            PaymentSlab[0].AmountUnit = $scope.PaymentSlabJSON.AmountUnit;
            PaymentSlab[0].AmountUnitName = $scope.PaymentSlabJSON.AmountUnitName;
            PaymentSlab[0].EffectiveFrom = $scope.PaymentSlabJSON.EffectiveFrom;
            PaymentSlab[0].EffectiveTo = $scope.PaymentSlabJSON.EffectiveTo;
            PaymentSlab[0].ApplicableAfter = $scope.PaymentSlabJSON.ApplicableAfter;
            PaymentSlab[0].ApplicableAfterName = $scope.PaymentSlabJSON.ApplicableAfterName;
            PaymentSlab[0].IsActive = true;
            PaymentSlab[0].UpdatedBy = $rootScope.UserId;
        }
        else {
            var paymentPlan = {
                PaymentPlanGUID: generateGUID(),
                PaymentSlabId: $scope.PaymentSlabId,
                PaymentPlanId: $scope.PaymentSlabJSON.PaymentPlanId,
                PlanName: $scope.PaymentSlabJSON.PlanName,
                SlabId: $scope.PaymentSlabJSON.SlabId,
                SlabName: $scope.PaymentSlabJSON.SlabName,
                Amount: $scope.PaymentSlabJSON.Amount,
                AmountUnit: $scope.PaymentSlabJSON.AmountUnit,
                AmountUnitName: $scope.PaymentSlabJSON.AmountUnitName,
                EffectiveFrom: $scope.PaymentSlabJSON.EffectiveFrom,
                EffectiveTo: $scope.PaymentSlabJSON.EffectiveTo,
                ApplicableAfter: $scope.PaymentSlabJSON.ApplicableAfter,
                ApplicableAfterName: $scope.PaymentSlabJSON.ApplicableAfterName,
                IsActive: true,
                CreatedBy: $rootScope.UserId
            };
            $scope.PaymentSlabList.push(paymentPlan);
        }
        $scope.ClearControls();
    };

    $scope.Edit = function (id) {
        
        $scope.ClearControls();
        var PaymentSlab = $scope.PaymentSlabList.filter(function (m) { return m.PaymentPlanGUID === id; });
        $scope.EditPaymentPlanGUID = id;
        $scope.PaymentSlabJSON.PaymentSlabId = PaymentSlab[0].PaymentSlabId;
        $scope.PaymentSlabJSON.PaymentPlanId = PaymentSlab[0].PaymentPlanId;
        $scope.PaymentSlabJSON.PlanName = PaymentSlab[0].PlanName;
        $scope.PaymentSlabJSON.SlabId = PaymentSlab[0].SlabId;
        $scope.PaymentSlabJSON.SlabName = PaymentSlab[0].SlabName;
        $scope.PaymentSlabJSON.Amount = parseFloat(PaymentSlab[0].Amount);
        $scope.PaymentSlabJSON.AmountUnit = PaymentSlab[0].AmountUnit;
        $scope.PaymentSlabJSON.EffectiveFrom = PaymentSlab[0].EffectiveFrom;
        $scope.PaymentSlabJSON.EffectiveTo = PaymentSlab[0].EffectiveTo;
        $scope.PaymentSlabJSON.ApplicableAfter = PaymentSlab[0].ApplicableAfter;
    };

    $scope.Save = function () {
        //
        $rootScope.Throbber.Visible = true;

        if ($scope.PaymentSlabList.length > 0) {
            if ($scope.PaymentSlabJSON.PlanName !== null && $scope.PaymentSlabJSON.PlanName !== "") {
                var requestData =
                {
                    ServicesAction: 'SavePaymentSlab',
                    PlanName: $scope.PaymentSlabJSON.PlanName,
                    PaymentSlabList: $scope.PaymentSlabList
                };

                var consolidateApiParamater =
                {
                    Json: requestData
                };

                
                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    
                    if ($scope.PaymentSlabId !== 0) {
                        $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
                    }
                    else {
                        $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
                    }
                    $scope.ClearAllControls();
                    $scope.ViewForm();
                    $scope.RefreshDataGrid();
                });
            }
            else {
                $rootScope.ValidationErrorAlert('Please Enter Plan Name', '', 3000);
            }
        }
        else {
            $rootScope.ValidationErrorAlert('Please Add Atlest One Slab Detail Then Save', '', 3000);
        }

        $rootScope.Throbber.Visible = false;
    };

    $scope.ClearControls = function () {
        $scope.PaymentPlanGUID = "";
        $scope.EditPaymentPlanGUID = "";
        $scope.PaymentSlabJSON.SlabId = 0;
        $scope.PaymentSlabJSON.SlabName = "";
        $scope.PaymentSlabJSON.Amount = "";
        $scope.PaymentSlabJSON.AmountUnit = 0;
        $scope.PaymentSlabJSON.AmountUnitName = "";
        $scope.PaymentSlabJSON.EffectiveFrom = "";
        $scope.PaymentSlabJSON.EffectiveTo = "";
        $scope.PaymentSlabJSON.ApplicableAfter = 0;
        $scope.PaymentSlabJSON.ApplicableAfterName = "";
    };

    $scope.ClearAllControls = function () {
        $scope.PaymentPlanGUID = "";
        $scope.PaymentSlabJSON.PlanName = "";
        $scope.PaymentSlabJSON.SlabId = 0;
        $scope.PaymentSlabJSON.SlabName = "";
        $scope.PaymentSlabJSON.Amount = "";
        $scope.PaymentSlabJSON.AmountUnit = 0;
        $scope.PaymentSlabJSON.AmountUnitName = "";
        $scope.PaymentSlabJSON.EffectiveFrom = "";
        $scope.PaymentSlabJSON.EffectiveTo = "";
        $scope.PaymentSlabJSON.ApplicableAfter = 0;
        $scope.PaymentSlabJSON.ApplicableAfterName = "";

        $scope.PaymentSlabList = [];
    };

    //#region Delete Add Grid Data with Confirmation
    $ionicModal.fromTemplateUrl('AddGrid_WarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.AddGrid_WarningMessageControl = modal;
    });


    $scope.CloseDeleteConfirmation_AddGrid = function () {
        $scope.AddGrid_WarningMessageControl.hide();
    };

    $scope.OpenDeleteConfirmation_AddGrid = function () {

        $scope.AddGrid_WarningMessageControl.show();
    };

    $scope.Delete_AddGrid = function (id) {
        $scope.SelectedId_AddGrid = id;
        $scope.OpenDeleteConfirmation_AddGrid();
    };

    $scope.DeleteYes_AddGrid = function () {
        //
        $scope.PaymentSlabList = $scope.PaymentSlabList.filter(function (m) { return m.PaymentPlanGUID !== $scope.SelectedId_AddGrid; });
        //var requestData =
        //{
        //    //ServicesAction: 'DeletePaymentPlanById',
        //    //PaymentPlanId: $scope.SelectedId
        //};

        //var jsonobject = {};
        //jsonobject.Json = requestData;
        //GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
        $scope.CloseDeleteConfirmation_AddGrid();
        //$scope.RefreshDataGrid();
        //});
    };
    //#endregion

    //#region Delete View Grid Data with Confirmation
    $ionicModal.fromTemplateUrl('ViewGrid_WarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        //
        $scope.ViewGrid_WarningMessageControl = modal;
    });


    $scope.CloseDeleteConfirmation_ViewGrid = function () {
        $scope.ViewGrid_WarningMessageControl.hide();
    };

    $scope.OpenDeleteConfirmation_ViewGrid = function () {

        $scope.ViewGrid_WarningMessageControl.show();
    };

    $scope.Delete_ViewGrid = function (id) {
        $scope.SelectedId_ViewGrid = id;
        $scope.OpenDeleteConfirmation_ViewGrid();
    };

    $scope.DeleteYes_ViewGrid = function () {
        //
        var requestData =
        {
            ServicesAction: 'DeletePaymentSlabById',
            PaymentSlabId: $scope.SelectedId_ViewGrid
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.CloseDeleteConfirmation_ViewGrid();
            $scope.RefreshDataGrid();
        });
    };
    //#endregion

    //$scope.Delete = function (id) {
    //    var requestData =
    //    {
    //        ServicesAction: 'DeletePaymentSlabById',
    //        PaymentSlabId: id
    //    };

    //    var jsonobject = {};
    //    jsonobject.Json = requestData;
    //    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
    //        $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
    //        $scope.RefreshDataGrid();
    //    });
    //}
});