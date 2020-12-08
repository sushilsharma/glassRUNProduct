angular.module("glassRUNProduct").controller('ItemAllocationManagementController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, GrRequestService) {

    debugger;
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }
    $scope.RuleListData = [];
    $scope.PageUrlName = $location.absUrl().split('#/')[1];
    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;

    $scope.LoadGridConfigurationData = function () {

        debugger;

        var objectId = 319;
        if (page === "AddCompany") {
            objectId = 319;
        } else if (page === "AddFinancePartner") {
            objectId = 321;
        } else if (page === "Transporter") {
            objectId = 320;
        }
        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                ObjectId: objectId,
                ObjectName: 'AddCompany',
                PageName: 'Customer',
                ControllerName: 'AddCompany'
            };

        var gridconsolidateApiParamater =
            {
                Json: gridrequestData,
            };

        console.log("-2" + new Date());

        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
            //if (response.data.Json != undefined) {
            //    $scope.GridColumnList = response.data.Json.GridColumnList;
            //    console.log("0" + new Date());
            //    //$scope.EventTamplateGridData();
            //    $scope.LoadAddCompanyGrid();
            //
            //
            //
            //    if ($scope.IsRefreshGrid === true) {
            //        $scope.RefreshDataGrid();
            //    }
            //} else {
            //}

            $scope.GridColumnList = response.data.Json.GridColumnList;

            var ld = JSON.stringify(response.data);
            var ColumnlistinJson = JSON.parse(ld);

            $scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList;

            $scope.LoadAddCompanyGrid();

            if ($scope.IsRefreshGrid === true) {
                $scope.RefreshDataGrid();
            }

        });
    }
    $scope.LoadGridConfigurationData();


    $scope.LoadAddCompanyGrid = function () {
        console.log("1" + new Date());
        var CompanyData = new DevExpress.data.CustomStore({
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
                    var OrderBy = "";
                }

                parameters.skip = loadOptions.skip || 0;
                parameters.take = loadOptions.take || 100;

                var filterOptions = loadOptions.filter ? loadOptions.filter.join(",") : "";
                var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";
                debugger;
                var CompanyType = "";
                var CompanyTypeCriteria = "";

                var SKUCode = "";
                var SKUCodeCriteria = "";

                var Company = "";
                var CompanyCriteria = "";

                var Description = "";
                var DescriptionCriteria = "";

                var RemainingQuantity = "";
                var RemainingQuantityCriteria = "";


                var AllocatedValue = "";
                var AllocatedValueCriteria = "";

                var FromDate = "";
                var FromDateCriteria = "";

                var ToDate = "";
                var ToDateCriteria = "";


                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');
                        if (columnsList[0] === "CompanyType") {
                            CompanyTypeCriteria = columnsList[1];
                            CompanyType = columnsList[2];
                        }
                        if (columnsList[0] === "SKUCode") {
                            SKUCodeCriteria = columnsList[1];
                            SKUCode = columnsList[2];
                        }
                        if (columnsList[0] === "Company") {
                            CompanyCriteria = columnsList[1];
                            Company = columnsList[2];
                        }
                        if (columnsList[0] === "Description") {
                            DescriptionCriteria = columnsList[1];
                            Description = columnsList[2];
                        }
                        if (columnsList[0] === "RemainingQuantity") {
                            RemainingQuantityCriteria = columnsList[1];
                            RemainingQuantity = columnsList[2];
                        }
                        if (columnsList[0] === "AllocatedValue") {
                            AllocatedValueCriteria = columnsList[1];
                            AllocatedValue = columnsList[2];
                        }
                        if (columnsList[0] === "FromDate") {
                            if (FromDate === "") {
                                if (fields.length > 1) {
                                    FromDateCriteria = "=";
                                } else {
                                    FromDateCriteria = columnsList[1];
                                }
                                FromDate = columnsList[2];
                                FromDate = new Date(FromDate);
                                FromDate = $filter('date')(FromDate, "dd/MM/yyyy");
                            }
                        }
                        if (columnsList[0] === "ToDate") {
                            if (ToDate === "") {
                                if (fields.length > 1) {
                                    ToDateCriteria = "=";
                                } else {
                                    ToDateCriteria = columnsList[1];
                                }
                                ToDate = columnsList[2];
                                ToDate = new Date(ToDate);
                                ToDate = $filter('date')(ToDate, "dd/MM/yyyy");
                            }
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));
                debugger;

                var requestData =
                    {
                        ServicesAction: 'LoadItemAllocationRulesDetailsList',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: OrderBy,
                        OrderByCriteria: OrderByCriteria,
                        CompanyType: CompanyType,
                        CompanyTypeCriteria: CompanyTypeCriteria,
                        SKUCode: SKUCode,
                        SKUCodeCriteria: SKUCodeCriteria,
                        Company: Company,
                        CompanyCriteria: CompanyCriteria,
                        Description: Description,
                        DescriptionCriteria: DescriptionCriteria,
                        RemainingQuantity: RemainingQuantity,
                        RemainingQuantityCriteria: RemainingQuantityCriteria,
                        RoleId: $rootScope.RoleId,
                        CompanyMnemonic: $rootScope.CompanyMnemonic,
                        AllocatedValue: AllocatedValue,
                        AllocatedValueCriteria: AllocatedValueCriteria,
                        FromDate: FromDate,
                        FromDateCriteria: FromDateCriteria,
                        ToDate: ToDate,
                        ToDateCriteria: ToDateCriteria,

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

                        if (resoponsedata.Rule !== undefined) {
                            if (resoponsedata.Rule.RuleList.length !== undefined) {
                                if (resoponsedata.Rule.RuleList.length > 0) {
                                    totalcount = resoponsedata.Rule.RuleList[0].TotalCount
                                }
                            } else {
                                totalcount = resoponsedata.Rule.RuleList.TotalCount;
                            }
                            ListData = resoponsedata.Rule.RuleList;

                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.RuleListData = $scope.RuleListData.concat(data);
                    if ($scope.GridConfigurationLoaded === false) {
                        $scope.LoadGridByConfiguration();
                    }
                    console.log("3" + new Date());
                    return data;
                });
            }
        });

        $scope.CompanyGrid = {
            dataSource: {
                store: CompanyData,
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
            keyExpr: "CompanyId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.CompanyId);
                    }
                    if (e.column.cellTemplate === "Delete") {
                        $scope.Delete_AddCompany(data.CompanyId);
                        // $scope.Delete(data.CompanyId);
                    }
                    if (e.column.cellTemplate === "View_Logo") {
                        $scope.OpenViewImage(data.CompanyId);
                        // $scope.Delete(data.CompanyId);
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
                    caption: $rootScope.resData.res_ItemAllocation_SKUCode,
                    dataField: "SKUCode",
                    alignment: "left"
                },
                {
                    dataField: "ItemName",
                    caption: $rootScope.resData.res_ItemAllocation_SKUname,
                    alignment: "left",
                    width: 150
                },
                {
                    caption: $rootScope.resData.res_GridColumn_AllocatedValue,
                    dataField: "AllocatedValue",
                    alignment: "left"
                },
                {
                    caption: $rootScope.resData.res_ItemAllocation_Description,
                    dataField: "Description",
                    alignment: "left"
                },
                {
                    caption: $rootScope.resData.res_GridColumn_UsedQuantity,
                    dataField: "UsedQuantity",
                    alignment: "left"
                },
                {
                    caption: $rootScope.resData.res_GridColumn_RemainingQuantity,
                    dataField: "RemainingQuantity",

                    alignment: "left"
                },
                {
                    caption: $rootScope.resData.res_GridColumn_CompanyType,
                    dataField: "CompanyType",
                    alignment: "left"
                },
                {
                    caption: $rootScope.resData.res_GridColumn_Company,
                    dataField: "Company",
                    alignment: "left"
                },
                {
                    dataField: "FromDate",
                    caption: $rootScope.resData.res_GridColumn_FromDate,
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    filterOperations: ['=', '>', '<'],
                    alignment: "right",
                },
                {
                    dataField: "ToDate",
                    caption: $rootScope.resData.res_GridColumn_ToDate,
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    filterOperations: ['=', '>', '<'],
                    alignment: "right",
                },
            ]
        };
    }
    //#endregion

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {

        var dataGrid = $("#CompanyGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

    //  $scope.LoadAddCompanyGrid();






    $scope.GridConfigurationLoaded = false;

    $scope.LoadGridByConfiguration = function (e) {

        console.log("9" + new Date());
        $rootScope.Throbber.Visible = true;
        var dataGrid = $("#CompanyGrid").dxDataGrid("instance");
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




    // Change branch plant for multiple enquiry.


    $ionicModal.fromTemplateUrl('templates/ChangeBranchPlantCode.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ChangeBranchPlantCodePopup = modal;
    });

    $scope.OpenChangeBranchPlantCodePopup = function (enquiryDetails) {
        $scope.ChangeBranchPlantCodePopup.show();
        $rootScope.Throbber.Visible = false;
    }

    $scope.ClosChangeBranchPlantCodePopup = function () {
        $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry = '';
        $scope.ChangeBranchPlantCodePopup.hide();
    }


    $scope.DeleteRules = function (RuleId) {

        var ruleDetails = {
            ServicesAction: 'DeleteItemAllocation',
            RuleId: RuleId
        };

        var consolidateApiParamater =
            {
                Json: ruleDetails
            };


        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            $scope.RefreshGrid();
            $rootScope.ValidationErrorAlert('Deleted successfully.', '', 3000);
        });
    }

    $scope.UpdateRules = function (RuleId, AllocatedValue, FromDate, ToDate) {


        var ruleDetails = $scope.RuleListData.filter(function (el) { return parseInt(el.RuleId) === parseInt(RuleId); });
        if (ruleDetails.length > 0) {
            ruleDetails[0].ServicesAction = 'UpdateItemAllocation';
            ruleDetails[0].AllocatedValue = AllocatedValue;
            ruleDetails[0].FromDate = FromDate;
            ruleDetails[0].ToDate = ToDate;

            var consolidateApiParamater =
                {
                    Json: ruleDetails[0],
                };


            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                $scope.RefreshGrid();
                $rootScope.ValidationErrorAlert('Item allocation updated successfully.', '', 3000);
            });

        }

    }

    $scope.SelectedBranchPlant = {
        BranchPlantForSelectedEnquiry: ''
    }







    $scope.LoadRulesView = function (Id) {
        // $scope.RuleEditPopup.show();
        //$rootScope.RulesViewId = Id;
        //$state.go("ViewRules");
    }

    $scope.CloseRuleEdit = function () {

        $scope.RuleEditPopup.hide();
    }


    $ionicModal.fromTemplateUrl('templates/reasoncodepopup.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.reasoncodepopup = modal;
    });


    $ionicModal.fromTemplateUrl('templates/RuleEdit.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.RuleEditPopup = modal;
    });


    $scope.ReasonCodeList = [];
    $scope.LoadReasonCode = function () {

        var requestData =
            {
                ServicesAction: 'LoadReasonCodeList'

            };



        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response !== undefined) {
                $scope.ReasonCodeList = response.data.ReasonCode.ReasonCodeList;
            }


        });

    };

    //$scope.LoadReasonCode();



    $scope.OpenReasoncodepopup = function (enquiryDetails) {

        $rootScope.ReasonCodeEnquiryDetails = enquiryDetails;
        $scope.reasoncodepopup.show();
        $rootScope.Throbber.Visible = false;
    }

    $scope.ClosReasoncodepopup = function () {

        $rootScope.ReasonCodeEnquiryId = 0;
        $scope.ReasonCodeJson.ReasonCode = "";
        $scope.ReasonCodeJson.ReasonDescription = "";
        $scope.reasoncodepopup.hide();
    }


    $scope.ReasonCodeJson = {
        ReasonCode: '',
        ReasonDescription: ''
    }

    $scope.SaveReasonCode = function () {

        if ($scope.ReasonCodeJson.ReasonCode !== "") {
            $rootScope.Throbber.Visible = true;
            $scope.SaveReasonCodeList();
        }
        else {
            $rootScope.ValidationErrorAlert('Please select reason code.', 'error', 3000);
        }

    }

    $scope.SaveReasonCodeList = function () {


        var reasonCode = {
            ReasonCodeId: $scope.ReasonCodeJson.ReasonCode,
            ReasonDescription: $scope.ReasonCodeJson.ReasonDescription,
            ObjectId: $rootScope.ReasonCodeEnquiryId,
            ObjectType: 'Enquiry'

        }

        var reasonCodeList = [];
        reasonCodeList.push(reasonCode);

        var requestData =
            {
                ServicesAction: 'InsertReasonMappingCode',
                ReasonCodeList: reasonCodeList
            };



        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


            if ($scope.UpdateName === "BranchPlant") {
                $scope.UpdateBranchPlantCode();
            }
            else if ($scope.UpdateName === "SchedulingDate") {
                $scope.UpdateSchedulingDateInEnquiry();
            } else if ($scope.UpdateName === "RejectEnquiry") {
                $scope.RejectSelectedEnquiry();
            }
            else if ($scope.UpdateName === "PromisedDate") {
                $scope.UpdatePromisedDateInEnquiry();
            }
            $rootScope.Throbber.Visible = false;
            $scope.UpdateName = "";
            $scope.ReasonCodeJson.ReasonCode = "";
            $scope.ReasonCodeJson.ReasonDescription = "";
            $scope.ClosReasoncodepopup();
        });
    }

    $scope.OnCarrierChangeEvent = function (enquiryId, carrierNumber) {

        if (carrierNumber === null) {
            carrierNumber = "";
        }
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.EnquiryId) === parseInt(enquiryId); });
        if (enquiryDetails.length > 0) {
            enquiryDetails[0].CarrierNumber = carrierNumber;
        }

    }

    $scope.RefreshGrid = function () {

        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        }
        gridCallBack();
    }

    $scope.ExportToExcel = function () {

        debugger;
        $rootScope.Throbber.Visible = true;

        $scope.TempGridColumnList = [];

        var tempCol1 = {};
        tempCol1.PropertyName = "SKUCode";
        tempCol1.ResourceValue = String.format($rootScope.resData.res_ItemAllocation_SKUCode);
        $scope.TempGridColumnList.push(tempCol1);

        var tempCol2 = {};
        tempCol2.PropertyName = "ItemName";
        tempCol2.ResourceValue = String.format($rootScope.resData.res_ItemAllocation_SKUname);
        $scope.TempGridColumnList.push(tempCol2);

        var tempCol3 = {};
        tempCol3.PropertyName = "AllocatedValue";
        tempCol3.ResourceValue = String.format($rootScope.resData.res_GridColumn_AllocatedValue);
        $scope.TempGridColumnList.push(tempCol3);


        var tempCol4 = {};
        tempCol4.PropertyName = "Description";
        tempCol4.ResourceValue = String.format($rootScope.resData.res_ItemAllocation_Description);
        $scope.TempGridColumnList.push(tempCol4);

        var tempCol5 = {};
        tempCol5.PropertyName = "UsedQuantity";
        tempCol5.ResourceValue = String.format($rootScope.resData.res_GridColumn_UsedQuantity);
        $scope.TempGridColumnList.push(tempCol5);

        var tempCol6 = {};
        tempCol6.PropertyName = "RemainingQuantity";
        tempCol6.ResourceValue = String.format($rootScope.resData.res_GridColumn_RemainingQuantity);
        $scope.TempGridColumnList.push(tempCol6);

        var tempCol7 = {};
        tempCol7.PropertyName = "CompanyType";
        tempCol7.ResourceValue = String.format($rootScope.resData.res_GridColumn_CompanyType);
        $scope.TempGridColumnList.push(tempCol7);

        var tempCol8 = {};
        tempCol8.PropertyName = "Company";
        tempCol8.ResourceValue = String.format($rootScope.resData.res_GridColumn_Company);
        $scope.TempGridColumnList.push(tempCol8);

        var tempCol9 = {};
        tempCol9.PropertyName = "FromDate";
        tempCol9.ResourceValue = String.format($rootScope.resData.res_GridColumn_FromDate);
        $scope.TempGridColumnList.push(tempCol9);

        var tempCol10 = {};
        tempCol10.PropertyName = "ToDate";
        tempCol10.ResourceValue = String.format($rootScope.resData.res_GridColumn_ToDate);
        $scope.TempGridColumnList.push(tempCol10);

        $scope.RequestDataFilter.ServicesAction = "LoadItemAllocationRulesDetailsList_ExportToExcel";
        $scope.RequestDataFilter.ColumnList = $scope.TempGridColumnList;
        var jsonobject = {};
        jsonobject.Json = $scope.RequestDataFilter;
        jsonobject.Json.IsExportToExcel = true;


        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
            debugger;
            $rootScope.Throbber.Visible = false;
            var byteCharacters1 = response.data;
            if (response.data !== undefined) {
                var byteCharacters = response.data;
                var blob = new Blob([byteCharacters], {
                    type: "application/Pdf"
                });

                if (blob.size > 0) {
                    $scope.ddMMyyyy = $filter('date')(new Date(), 'ddMMyyyyhhmm');
                    var filName = "ItemAllocation" + $scope.ddMMyyyy + ".csv";
                    saveAs(blob, filName);
                } else {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ItemAllocation_Documentnotgenerated), '', 3000);
                }
            }
            else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ItemAllocation_Documentnotgenerated), '', 3000);
            }
        });
    };

});