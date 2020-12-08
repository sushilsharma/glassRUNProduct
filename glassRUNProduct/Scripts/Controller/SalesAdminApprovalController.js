angular.module("glassRUNProduct").controller('SalesAdminApprovalController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, $q, GrRequestService, ManageEnquiryService) {

    //#region Load Variables And Default Values

    $scope.$on('$destroy', function (evt) {
        console.log("destroy inquiry");
        $("#SalesAdminApprovalGrid").remove();

    });
    $scope.ConfigurationSelectedOrderStatus = "";
    setTimeout(function () {
        pluginsService.init();
    }, 500);
    $scope.IsGridLoadCompleted = false;

    $scope.WorkFlowStepsListForBranchPlant = [];
    $rootScope.IsPaletteEditRequiredForSO = false;
    $scope.Console_sidebarScroll = function () {
        $('.Console_sidebar .inner').mCustomScrollbar("destroy");
        scroll_height = "100%";
        $('.Console_sidebar .inner').mCustomScrollbar({
            scrollButtons: {
                enable: false
            },
            autoHideScrollbar: true,
            scrollInertia: 150,
            theme: "light",
            set_height: scroll_height,
            advanced: {
                updateOnContentResize: true
            }
        });

        //if ($('body').hasClass('Console_sidebar-top')) {
        //    destroySideScroll();
        //}
    };

    $scope.toggleConsole_sidebar = function () {
        $scope.Console_sidebarScroll();

        if ($('#Console_sidebar').hasClass('open')) $('#Console_sidebar').removeClass('open');
        else $('#Console_sidebar').addClass('open');
    };

    $scope.RemoveSessionOfAdvanceEdit = function () {
        delete $sessionStorage.IsEnquiryEditedByCustomerService;
        delete $sessionStorage.TempCompanyId;
        delete $sessionStorage.TempCompanyMnemonic;
        delete $sessionStorage.BranchPlantCodeEdit;
        delete $sessionStorage.CurrentOrderRoleId;
        delete $sessionStorage.CurrentOrderLoginId;
        delete $sessionStorage.IsEnquiryEditedByCustomerService;
        delete $sessionStorage.EditEnquiryAutoNumber;
        delete $sessionStorage.IsAdvanceEdit;
        delete $sessionStorage.EditEnquiry;
        delete $sessionStorage.isEnquiryEdit;
        delete $sessionStorage.SavedEditEnquiry;
        delete $sessionStorage.CurrentOrderGuid;
        delete $sessionStorage.TemOrderData;
    }

    $scope.RemoveSessionOfAdvanceEdit();

    $scope.IsPageLoad = true;
    $scope.ProductCodes = "";
    $scope.Areas = "";
    $scope.AreasSearchCriteria = "";
    $scope.BranchPlantCodes = "";
    $scope.BranchPlantCodesSearchCriteria = "";
    $scope.CarrierCodes = "";
    $scope.CarrierCodesSearchCriteria = "";
    $scope.TruckSizes = "";
    $scope.TruckSizesSearchCriteria = "";
    //$scope.IsInEditMode = false;
    //$scope.IsInEditModeForValidation = false;
    $scope.IsAccordianOpen = false;
    $scope.ProductSelectedList = [];
    $scope.AreaSelectedList = [];
    $scope.BranchPlantCodeSelectedList = [];
    $scope.CarrierCodeSelectedList = [];
    $scope.TruckSizeSelectedList = [];
    $scope.ProductList = [];
    $scope.ProductTexts = { buttonDefaultText: 'Select Product' };
    $scope.AreaListTexts = { buttonDefaultText: 'Select Area' };
    $scope.BranchPlantCodeTexts = { buttonDefaultText: 'Select Branch Plant Code' };
    $scope.CarrierCodeCodeTexts = { buttonDefaultText: 'Select Carrier Code' };
    $scope.TruckSizeTexts = { buttonDefaultText: 'Select Truck Size' };

    $rootScope.IsAdvanceEdit = false;
    $rootScope.isEnquiryEdit = false;
    $rootScope.SavedEditEnquiry = false;
    $rootScope.EditEnquiryAutoNumber = "";
    $scope.IsRefreshGrid = false;
    $scope.CurrentOpenMasterDetailsObject = "";
    $scope.selectedRow = -1;
    $scope.PreviousEnterProductQuantity = 0;
    $scope.ProductInfoSection = false;
    $scope.IsColumnDetailView = false;
    $scope.StockCheckSection = false;
    $scope.StatusTimelineSection = false;
    $scope.CustomerCreditCheckSection = false;
    $scope.ItemCurrentStockPosition = 0;
    $rootScope.DiscountAmount = 0;
    $scope.HeaderCheckboxControl = false;
    $rootScope.IsPalettesRequired = false;
    $rootScope.PalettesWidth = {
        width: "0%"
    };
    $scope.CellCheckboxControl = false;
    $scope.HeaderCheckBoxAction = false;
    $scope.SalesAdminApprovalList = [];
    $scope.IsChecked = false;
    $scope.IsFiltered = true;
    console.log("-0" + new Date());
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.RoleName = $rootScope.RoleName;
    $scope.PreviousExpandedRow = "";
    $scope.GridColumnList = [];
    $scope.bindallproduct = [];
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

    //$rootScope.res_PageHeaderTitle = $rootScope.resData.res_OMInquiryPage_CleanOrderCheck;
    console.log("-1" + new Date());

    
    //for (var i = 0; i < tempStatusList.length; i++) {
    //    var chklist = StatusList.filter(function (el) { return el.ResourceValue === tempStatusList[i].ResourceValue; });
    //    if (chklist.length == 0) {
    //        StatusList.push(tempStatusList[i]);
    //    }
    //}


    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;

    //$scope.bindAllBranchPlant = [];
    //$scope.bindAllBranchPlant = $rootScope.bindAllBranchPlant;

    $scope.SelectedBranchPlant = {
        BranchPlantForSelectedEnquiry: ''
    }




    $scope.WorkFlowStepsListForBranchPlant = [];

    $scope.LoadWorkFlowStepsData = function () {

        var gridrequestData =
        {
            ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            SettingName: 'EnquiryListScheduler'
        };

        //var stringfyjson = JSON.stringify(requestData);
        var gridconsolidateApiParamater =
        {
            Json: gridrequestData,
        };


        console.log("-2" + new Date());
        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {

            if (response.data != "") {
                if (response.data.Json != undefined) {

                    $scope.WorkFlowStepsListForBranchPlant = response.data.Json.WorkFlowStepList;

                } else {
                    $scope.WorkFlowStepsListForBranchPlant = [];
                }
            } else {
                $scope.WorkFlowStepsListForBranchPlant = [];
            }

            //$scope.LoadSalesAdminApprovalGrid();

            $scope.LoadWorkFlowAdvEditStepsData();
        });
    };





    $scope.WorkFlowStepsAdvList = [];


    $scope.LoadWorkFlowAdvEditStepsData = function () {

        var gridrequestData =
        {
            ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            SettingName: 'AdvanceEditScheduler'
        };

        //var stringfyjson = JSON.stringify(requestData);
        var gridconsolidateApiParamater =
        {
            Json: gridrequestData,
        };

        console.log("-2" + new Date());
        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {

            if (response.data != "") {
                if (response.data.Json != undefined) {

                    $scope.WorkFlowStepsAdvList = response.data.Json.WorkFlowStepList;

                } else {
                    $scope.WorkFlowStepsAdvList = [];
                }
            } else {
                $scope.WorkFlowStepsAdvList = [];
            }

            $scope.LoadSalesAdminApprovalGrid();


        });
    };
    //#endregion

    //#region Load Setting Values 
    $scope.LoadDefaultSettingsValue = function () {



        $scope.LoadSettingInfoByName = function (settingName, returnValueDataType) {

            var settingValue = "";
            if ($sessionStorage.AllSettingMasterData != undefined) {
                var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === settingName; });
                if (settingMaster.length > 0) {
                    settingValue = settingMaster[0].SettingValue;
                }
            }
            if (returnValueDataType === "int") {
                if (settingValue !== "") {
                    settingValue = parseInt(settingValue);
                }
            } else if (returnValueDataType === "float") {
                if (settingValue !== "") {
                    settingValue = parseFloat(settingValue);
                }
            } else {
                settingValue = settingValue;
            }
            return settingValue;
        }

        $scope.ItemTaxInPec = $scope.LoadSettingInfoByName('ItemTaxInPec', 'float');
        if ($scope.ItemTaxInPec === "") {
            $scope.ItemTaxInPec = 0;
        }
        $scope.WoodenPalletCode = $scope.LoadSettingInfoByName('WoodenPalletCode', 'string');
        $scope.LoscamPalletCode = $scope.LoadSettingInfoByName('WoodenPalletCode', 'string');

        $scope.NumberOfProductAdd = $scope.LoadSettingInfoByName('NumberOfProductAdd', 'int');
        if ($scope.NumberOfProductAdd === "") {
            $scope.NumberOfProductAdd = $scope.defaultValueForNumberOfProducts;
        }
        $scope.EmptiesAmount = $scope.LoadSettingInfoByName('EmptiesAmount', 'float');
        if ($scope.EmptiesAmount === "") {
            $scope.EmptiesAmount = 0;
        }

        $scope.PalettesBufferWeight = $scope.LoadSettingInfoByName('PalettesBufferWeight', 'float');
        if ($scope.PalettesBufferWeight === "") {
            $scope.PalettesBufferWeight = 0;
        }
        $scope.TruckExceedBufferWeight = $scope.LoadSettingInfoByName('TruckExceedBufferWeight', 'float');
        if ($scope.TruckExceedBufferWeight === "") {
            $scope.TruckExceedBufferWeight = 0;
        }
        $scope.PalettesExceedBufferWeight = $scope.LoadSettingInfoByName('PalettesExceedBufferWeight', 'float');
        if ($scope.PalettesExceedBufferWeight === "") {
            $scope.PalettesExceedBufferWeight = 0;
        }

        $scope.CurrencyFormatCode = $scope.LoadSettingInfoByName('CurrencyFormat', 'string');
        if ($scope.CurrencyFormatCode === "") {
            $scope.CurrencyFormatCode = "EUR";
        }

        $scope.TruckValidationEnable = $scope.LoadSettingInfoByName('IsTruckFullValidationEnabled', 'string');
        if ($scope.TruckValidationEnable !== "") {
            $scope.TruckValidationEnable = 0;
        }
        $scope.TruckSizeValidationEnable = $scope.LoadSettingInfoByName('IsTruckSizeValidationEnabled', 'string');
        if ($scope.TruckSizeValidationEnable !== "") {
            $scope.TruckSizeValidationEnable = 0;
        }


        $scope.PriceFromGlassRunEnable = $scope.LoadSettingInfoByName('PriceFromGlassRun', 'string');

        if ($scope.PriceFromGlassRunEnable === "") {
            $scope.PriceFromGlassRunEnable = 0;
        }

    }
    $scope.LoadDefaultSettingsValue();

    $scope.PageLevelConfigurationByConfigurationName = function (configurationName) {
        var isTrue = false;
        if ($rootScope.PageLevelConfigList !== undefined) {
            if ($rootScope.PageLevelConfigList.length > 0) {
                var configInfo = $rootScope.PageLevelConfigList.filter(function (el) { return el.SettingName === configurationName; });
                if (configInfo.length > 0) {
                    if (configInfo[0].SettingValue === "1") {
                        isTrue = true;
                    }
                }
            }
        }

        return isTrue
    }

    $scope.GetSettingValueFromPagelevelConfiguration = function (configurationName) {
        var settingValue = "";
        if ($rootScope.PageLevelConfigList !== undefined) {
            if ($rootScope.PageLevelConfigList.length > 0) {
                var configInfo = $rootScope.PageLevelConfigList.filter(function (el) { return el.SettingName === configurationName; });
                if (configInfo.length > 0) {
                    settingValue = configInfo[0].SettingValue;
                }
            }
        }

        return settingValue
    }

    var StatusList = [];
    $scope.LoadStatusListValue = function () {

        var StatusData = $rootScope.StatusResourcesList.filter(function (el) { return el.CultureId === $rootScope.CultureId });
        var splitStatusCode = $scope.ConfigurationSelectedOrderStatus.split(",");
        if (splitStatusCode.length > 0) {
            for (var i = 0; i < splitStatusCode.length; i++) {
                var statusValue = StatusData.filter(function (el) { return el.StatusId === splitStatusCode[i] });
                if (statusValue.length > 0) {
                    StatusList.push(statusValue[0]);
                }
            }
        }
    }

    $scope.LoadPageLevelConfiguration = function () {
        debugger;

        if ($rootScope.PageLevelConfigList !== undefined) {
            if ($rootScope.PageLevelConfigList.length > 0) {

                $scope.IsCreditLimitCheck = $scope.PageLevelConfigurationByConfigurationName('IsCreditLimitCheck');
                $scope.IsMTBalanceCheck = $scope.PageLevelConfigurationByConfigurationName('IsMTBalanceCheck');
                $scope.IsReceivingCapacityCheck = $scope.PageLevelConfigurationByConfigurationName('IsReceivingCapacityCheck');
                $scope.IsReceivingCapacityWarning = $scope.PageLevelConfigurationByConfigurationName('IsReceivingCapacityWarning');
                $scope.IsWeightLoadCheckValidation = $scope.PageLevelConfigurationByConfigurationName('IsWeightLoadCheckValidation');
                $scope.IsPalletLoadCheckValidation = $scope.PageLevelConfigurationByConfigurationName('IsPalletLoadCheckValidation');
                $scope.IsPriceEditable = $scope.PageLevelConfigurationByConfigurationName('IsPriceEditable');
                $scope.IsAllocationApplicable = $scope.PageLevelConfigurationByConfigurationName('IsAllocationApplicable');
                $scope.AddItemInTruckApplicable = $scope.PageLevelConfigurationByConfigurationName('AddItemInTruckApplicable');
                $scope.IsPONumberApplicable = $scope.PageLevelConfigurationByConfigurationName('IsPONumberApplicable');
                $scope.IsSONumberApplicable = $scope.PageLevelConfigurationByConfigurationName('IsSONumberApplicable');
                $scope.IsCollectionLocationSelectionApplicable = $scope.PageLevelConfigurationByConfigurationName('IsCollectionLocationSelectionApplicable');
                $scope.IsPickUpDateApplicable = $scope.PageLevelConfigurationByConfigurationName('IsPickUpDateApplicable');
                $scope.IsBranchPlantValidationAvailable = $scope.PageLevelConfigurationByConfigurationName('IsBranchPlantValidationAvailable');

                $scope.ConfigurationSelectedOrderStatus = $scope.GetSettingValueFromPagelevelConfiguration('RoleWiseStatus');

                $scope.LoadStatusListValue();

            }
        }

        $scope.ConfigurationSelectedOrderStatus = $scope.GetSettingValueFromPagelevelConfiguration('RoleWiseStatus');
        if ($scope.ConfigurationSelectedOrderStatus !== "") {
            $scope.LoadStatusListValue();
        } else {
            StatusList = $rootScope.StatusResourcesList.filter(function (el) { return el.CultureId === $rootScope.CultureId });
        }

    }

    $scope.LoadPageLevelConfiguration();
    //#endregion

    var PageControlName = "";


    //#region Grid Configuration
    $scope.LoadGridConfigurationData = function () {



        var objectId = 15;
        PageControlName = "Enquiry";
        if (page === "GraticsOrderUnprocess") {
            objectId = 523;
            PageControlName = "Enquiry"
        } else if (page === "MOTEnquiryList") {
            objectId = 641;
            PageControlName = "Enquiry"
        }
        else if (page === "ManageInquiry") {
            objectId = 1425;
            PageControlName = "Enquiry"
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

        //var stringfyjson = JSON.stringify(requestData);
        var gridconsolidateApiParamater =
        {
            Json: gridrequestData,
        };



        var gridrequestWorkFlowData =
        {
            ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            SettingName: 'EnquiryListScheduler'
        };

        var workFlowConsolidateApiParamater =
        {
            Json: gridrequestWorkFlowData,
        };


        var gridrequestDataAdvanceEditScheduler =
        {
            ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            SettingName: 'AdvanceEditScheduler'
        };

        //var stringfyjson = JSON.stringify(requestData);
        var gridconsolidateApiParamaterAdvanceEdit =
        {
            Json: gridrequestDataAdvanceEditScheduler,
        };



        var requestData =
        {
            ServicesAction: 'LoadAllProducts',
            CompanyId: $rootScope.CompanyId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;

        //if ($scope.IsPageLoad) {

        //    var responseForGridColumnList = GrRequestService.ProcessRequest(gridconsolidateApiParamater);
        //    var responseForworkflowStepsList = GrRequestService.ProcessRequest(workFlowConsolidateApiParamater);
        //    var responseForProductList = GrRequestService.ProcessRequest(jsonobject);
        //    var responseForworkflowStepsAdvanceEditList = GrRequestService.ProcessRequest(gridconsolidateApiParamaterAdvanceEdit);
        //}
        //else {

        //    var responseForGridColumnList = {};
        //    var responseForworkflowStepsList = {};
        //    var responseForProductList = {};
        //    var responseForworkflowStepsAdvanceEditList = {};
        //}

        var responseForGridColumnList = GrRequestService.ProcessRequest(gridconsolidateApiParamater);
        var responseForworkflowStepsList = {};
        var responseForProductList = {};
        var responseForworkflowStepsAdvanceEditList = {};


        var filterrequestData =
        {
            ServicesAction: 'LoadGridConfiguration',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            CultureId: $rootScope.CultureId
        };

        var filterSearchDTO =
        {
            Json: filterrequestData,
        };

        var filterData = ManageEnquiryService.GetFilterDataForGrid(filterSearchDTO);


        $q.all([
            responseForGridColumnList,
            responseForworkflowStepsList,
            responseForProductList,
            responseForworkflowStepsAdvanceEditList,
            filterData
        ]).then(function (resp) {


            var response = resp[0];
            var workflowResponse = resp[1];
            var productListResponse = resp[2];
            var responseflowStepsAdvanceEditList = resp[3];
            var responseFilterData = resp[4];


            $scope.AreaList = [];
            $scope.BranchPlantCodeList = [];
            $scope.CarrierCodeList = [];
            $scope.TruckSizeList = [];
            $scope.ProvinceDescList = [];
            $scope.RegionList = [];
            $scope.ExtStatusResourcesList = [];
            if (responseFilterData.data !== undefined && responseFilterData.data !== null) {
                if (responseFilterData.data.Json !== undefined && responseFilterData.data.Json !== null) {
                    if (responseFilterData.data.Json.FilterList !== undefined && responseFilterData.data.Json.FilterList !== null) {

                        if (responseFilterData.data.Json.FilterList[0].AreaList !== undefined && responseFilterData.data.Json.FilterList[0].AreaList !== null) {

                            $scope.AreaList = responseFilterData.data.Json.FilterList[0].AreaList;

                        }

                        if (responseFilterData.data.Json.FilterList[0].BranchPlantCodeList !== undefined && responseFilterData.data.Json.FilterList[0].BranchPlantCodeList !== null) {

                            $scope.BranchPlantCodeList = responseFilterData.data.Json.FilterList[0].BranchPlantCodeList;
                        }

                        if (responseFilterData.data.Json.FilterList[0].CarrierCodeList !== undefined && responseFilterData.data.Json.FilterList[0].CarrierCodeList !== null) {

                            $scope.CarrierCodeList = responseFilterData.data.Json.FilterList[0].CarrierCodeList;
                        }

                        if (responseFilterData.data.Json.FilterList[0].TruckSizeList !== undefined && responseFilterData.data.Json.FilterList[0].TruckSizeList !== null) {

                            $scope.TruckSizeList = responseFilterData.data.Json.FilterList[0].TruckSizeList;
                        }

                        if (responseFilterData.data.Json.FilterList[0].ProvinceDescList !== undefined && responseFilterData.data.Json.FilterList[0].ProvinceDescList !== null) {

                            $scope.ProvinceDescList = responseFilterData.data.Json.FilterList[0].ProvinceDescList;
                        }

                        if (responseFilterData.data.Json.FilterList[0].RegionList !== undefined && responseFilterData.data.Json.FilterList[0].RegionList !== null) {

                            $scope.RegionList = responseFilterData.data.Json.FilterList[0].RegionList;
                        }

                        if (responseFilterData.data.Json.FilterList[0].StatusResourcesList !== undefined && responseFilterData.data.Json.FilterList[0].StatusResourcesList !== null) {

                            $scope.ExtStatusResourcesList = responseFilterData.data.Json.FilterList[0].StatusResourcesList;
                        }
                    }

                }

            }


            debugger;
            $scope.GridColumnList = response.data.Json.GridColumnList;

            var ld = JSON.stringify(response.data);
            var ColumnlistinJson = JSON.parse(ld);

            //$scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList;
            $scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList.filter(function (el) { return el.IsDefault === '1' });

            debugger;

            var checkedEnquiryData = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'CheckedEnquiry' });

            if (checkedEnquiryData.length > 0) {


                checkedEnquiryData[0].allowFiltering = false;
                checkedEnquiryData[0].allowSorting = false;
                checkedEnquiryData[0].allowEditing = false;


                checkedEnquiryData[0].cellTemplate = function (container, options) {
                    $("<div />").dxCheckBox({
                        value: JSON.parse(options.data.CheckedEnquiry),
                        //visible: options.data.CurrentState == '999' ? false : options.data.IsCompleted == '1' ? false : true,
                        visible: options.data.IsEditGridColumns,
                        onValueChanged: function (data) {
                            debugger;
                            $scope.HeaderCheckboxControl = false;
                            $scope.CellCheckboxControl = true;
                        }
                    }).appendTo(container);
                };


                checkedEnquiryData[0].headerCellTemplate = function (container, options) {
                    debugger;

                    $("<div />").dxCheckBox({
                        value: false,
                        onValueChanged: function (data) {
                            debugger;
                            $scope.HeaderCheckBoxAction = data.value;
                            $scope.HeaderCheckboxControl = true;
                            $scope.CellCheckboxControl = false;
                        }
                    }).appendTo(container);
                };
            }
            var statusData = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Status' });

            if (statusData.length > 0) {

                statusData[0].lookup = {
                    dataSource: StatusList,
                    displayExpr: "ResourceValue",
                    valueExpr: "ResourceValue"
                };

            }


            var Area = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Area' });

            if (Area.length > 0) {

                Area[0].lookup = {
                    dataSource: $scope.AreaList,
                    displayExpr: "Name",
                    valueExpr: "Name"
                };

            }

            var BranchPlantCode = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'BranchPlantCode' });

            if (BranchPlantCode.length > 0) {

                BranchPlantCode[0].lookup = {
                    dataSource: $scope.BranchPlantCodeList,
                    displayExpr: "Name",
                    valueExpr: "Name"
                };

            }

            var BranchPlantCode = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'CollectionLocationCode' });

            if (BranchPlantCode.length > 0) {

                BranchPlantCode[0].lookup = {
                    dataSource: $scope.BranchPlantCodeList,
                    displayExpr: "Name",
                    valueExpr: "Name"
                };

            }



            var CarrierCode = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'CarrierCode' });

            if (CarrierCode.length > 0) {

                CarrierCode[0].lookup = {
                    dataSource: $scope.CarrierCodeList,
                    displayExpr: "Name",
                    valueExpr: "Name"
                };

            }

            var TruckSize = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'TruckSize' });

            if (TruckSize.length > 0) {

                TruckSize[0].lookup = {
                    dataSource: $scope.TruckSizeList,
                    displayExpr: "Name",
                    valueExpr: "Name"
                };

            }

            var ProvinceDesc = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'ProvinceDesc' });

            if (ProvinceDesc.length > 0) {

                ProvinceDesc[0].lookup = {
                    dataSource: $scope.ProvinceDescList,
                    displayExpr: "Name",
                    valueExpr: "Name"
                };

            }

            var Region = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Region' });

            if (Region.length > 0) {

                Region[0].lookup = {
                    dataSource: $scope.RegionList,
                    displayExpr: "Name",
                    valueExpr: "Name"
                };

            }

            var empties = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Empties' });

            if (empties.length > 0) {

                empties[0].lookup = {
                    dataSource: [{ Id: "Ok" }, { Id: "Not Ok" }],
                    displayExpr: "Id",
                    valueExpr: "Id"
                }

            }

            var receivedCapacityPalettesCheck = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'ReceivedCapacityPalettesCheck' });

            if (receivedCapacityPalettesCheck.length > 0) {

                receivedCapacityPalettesCheck[0].lookup = {
                    dataSource: [{ Id: "Ok" }, { Id: "Not Ok" }],
                    displayExpr: "Id",
                    valueExpr: "Id"
                }

            }


            var isAvailableStock = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'IsAvailableStock' });

            if (isAvailableStock.length > 0) {

                isAvailableStock[0].lookup = {
                    dataSource: [{ Id: "Ok" }, { Id: "Not Ok" }],
                    displayExpr: "Id",
                    valueExpr: "Id"
                }

            }



            var Priority = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Priority' });

            if (Priority.length > 0) {

                Priority[0].lookup = {
                    dataSource: [{ Id: "Yes", Value: 1 }, { Id: "No", Value: 0 }],
                    displayExpr: "Id",
                    valueExpr: "Value"
                }

            }


            var isAvailableCredit = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'IsAvailableCredit' });

            if (isAvailableCredit.length > 0) {

                isAvailableCredit[0].lookup = {
                    dataSource: [{ Id: "Ok" }, { Id: "Not Ok" }],
                    displayExpr: "Id",
                    valueExpr: "Id"
                }

            }



            var empties = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Empties' });

            if (empties.length > 0) {

                empties[0].lookup = {
                    dataSource: [{ Id: "Ok" }, { Id: "Not Ok" }],
                    displayExpr: "Id",
                    valueExpr: "Id"
                }

            }

            //if (workflowResponse.data != "") {
            //    if (workflowResponse.data.Json != undefined) {
            //        $scope.WorkFlowStepsListForBranchPlant = workflowResponse.data.Json.WorkFlowStepList;

            //    } else {
            //        $scope.WorkFlowStepsListForBranchPlant = [];
            //    }
            //} else {
            //    $scope.WorkFlowStepsListForBranchPlant = [];
            //}

            //$scope.LoadSalesAdminApprovalGrid();

            //$scope.LoadWorkFlowStepsData();

            if ($scope.IsRefreshGrid === true) {
                $scope.RefreshDataGrid();
            }

            if (productListResponse !== undefined) {
                if (productListResponse.data !== undefined) {
                    var resoponsedata = productListResponse.data;
                    $scope.ProductList = resoponsedata.Item.ItemList;
                    $scope.bindallproduct = resoponsedata.Item.ItemList;
                }
            }


            if (responseflowStepsAdvanceEditList !== undefined) {
                if (responseflowStepsAdvanceEditList.data != undefined) {
                    if (responseflowStepsAdvanceEditList.data.Json != undefined) {

                        $scope.WorkFlowStepsAdvList = responseflowStepsAdvanceEditList.data.Json.WorkFlowStepList;

                    } else {
                        $scope.WorkFlowStepsAdvList = [];
                    }
                } else {
                    $scope.WorkFlowStepsAdvList = [];
                }
            }
            else {
                $scope.WorkFlowStepsAdvList = [];
            }
            $scope.LoadSalesAdminApprovalGrid();
        })
    }

    $scope.LoadGridConfigurationData();

    //#endregion
    var OrderBy = "";
    var OrderByCriteria = "";
    //#region Load Sales Admin Approval Grid
    $scope.LoadSalesAdminApprovalGrid = function () {



        console.log("1" + new Date());

        var SalesAdminApprovalData = new DevExpress.data.CustomStore({

            load: function (loadOptions) {
                if (loadOptions.take !== undefined && loadOptions.take !== null) {

                    var parameters = {};
                    console.log("10" + new Date());
                    if (loadOptions.sort) {
                        parameters.orderby = loadOptions.sort[0].selector;
                        if (loadOptions.sort[0].desc)
                            parameters.orderby += " desc";
                    }
                    debugger;
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

                    var RegionCriteria = "";
                    var Region = "";

                    var RelatedOrderNumberCriteria = "";
                    var RelatedOrderNumber = "";

                    var EnquiryAutoNumber = "";
                    var EnquiryAutoNumberCriteria = "";

                    var RelatedEnquiryNumber = "";
                    var RelatedEnquiryNumberCriteria = "";

                    var TypeOfWay = "";
                    var TypeOfWayCriteria = "";


                    var SoldToCode = "";
                    var SoldToCodeCriteria = "";

                    var CompanyNameValue = "";
                    var CompanyNameValueCriteria = "";

                    var DeliveryLocationName = "";
                    var DeliveryLocationNameCriteria = "";

                    var EnquiryDate = "";
                    var EnquiryDateCriteria = "";
                    var EnquiryEndDate = "";
                    var EnquiryEndDateCriteria = "";

                    var RequestDate = "";
                    var RequestDateCriteria = "";
                    var RequestEndDate = "";
                    var RequestEndDateCriteria = "";

                    var PromisedDate = "";
                    var PromisedDateCriteria = "";
                    var PromisedEndDate = "";
                    var PromisedEndDateCriteria = "";

                    var PickDateTime = "";
                    var PickDateTimeCriteria = "";
                    var PickEndDateTime = "";
                    var PickEndDateTimeCriteria = "";

                    var Area = "";
                    var AreaCriteria = "";

                    var Gratis = "";
                    var GratisCriteria = "";

                    var DeliveryLocation = "";
                    var DeliveryLocationCriteria = "";

                    var Empties = "";
                    var EmptiesCriteria = "";

                    var ReceivedCapacityPalates = "";
                    var ReceivedCapacityPalatesCriteria = "";

                    var TotalPrice = "";
                    var TotalPriceCriteria = "";

                    var Status = "";
                    var StatusCriteria = "";

                    var AvailableStock = "";
                    var AvailableStockCriteria = "";

                    var AvailableCredit = "";
                    var AvailableCreditCriteria = "";

                    var BranchPlant = "";
                    var BranchPlantCriteria = "";
                    var ProvinceDescCriteria = "";
                    var ProvinceDesc = "";

                    var RegionCriteria = "";
                    var Region = "";

                    var SubChannelCriteria = "";
                    var SubChannel = "";


                    var SONumber = "";
                    var SupplierName = "";
                    var SupplierCode = "";
                    var PONumber = "";
                    var EnquiryType = "";
                    var SoldToName = "";
                    var SoldToCode = "";
                    var CollectionLocationName = "";
                    var CollectionLocationCode = "";
                    var ShipToName = "";
                    var ShipToCode = "";
                    var TruckSize = "";
                    var CarrierName = "";
                    var ShortName = "";
                    var RPM = "";

                    var SONumberCriteria = "";
                    var SupplierNameCriteria = "";
                    var SupplierCodeCriteria = "";
                    var PONumberCriteria = "";
                    var EnquiryTypeCriteria = "";
                    var SoldToNameCriteria = "";
                    var SoldToCodeCriteria = "";
                    var CollectionLocationNameCriteria = "";
                    var CollectionLocationCodeCriteria = "";
                    var ShipToNameCriteria = "";
                    var ShipToCodeCriteria = "";
                    var TruckSizeCriteria = "";
                    var CarrierNameCriteria = "";
                    var ShortNameCriteria = "";
                    var RPMCriteria = "";

                    var EnquirySearchParameterList = [];


                    var fields = [];
                    if (filterOptions != "") {

                        fields = filterOptions.split(',and,');

                        if (fields.length === 1) {
                            if (fields[0].includes(">=") && !fields[0].includes("Status")) {
                                fields = filterOptions.split('or,');
                            }
                        }

                        for (var i = 0; i < fields.length; i++) {
                            var columnsList = fields[i];

                            if (columnsList.includes("or") && fields[0].includes("Status")) {
                                var criteria = "in";
                                var columnValues = "";
                                var columnName = "";
                                columnsList = columnsList.split(',or,');
                                for (var i = 0; i < columnsList.length; i++) {
                                    var splitColumnValue = columnsList[i].split(',');
                                    columnValues = columnValues + "," + splitColumnValue[2];
                                    columnName = splitColumnValue[0];
                                }
                                columnValues = columnValues.substr(1);

                                if (columnName === "Status") {
                                    Status = columnValues;
                                    StatusCriteria = criteria;

                                    var statusParam = {};
                                    statusParam.fieldName = "Status";
                                    statusParam.operatorName = StatusCriteria;
                                    statusParam.fieldValue = Status;
                                    statusParam.fieldType = "string";
                                    EnquirySearchParameterList.push(statusParam);

                                }

                            }
                            else if (columnsList.includes("or") && (fields[i].includes("TruckSize") || fields[i].includes("Area") || fields[i].includes("Region") || fields[i].includes("ProvinceDesc") || fields[i].includes("BranchPlantCode") || fields[i].includes("CollectionLocationCode") || fields[i].includes("CarrierCode"))) {

                                var criteria = "in";
                                var columnValues = "";
                                var columnName = ""; i
                                columnsList = columnsList.split(',or,');
                                for (var k = 0; k < columnsList.length; k++) {
                                    var splitColumnValue = columnsList[k].split(',');
                                    columnValues = columnValues + ",'" + splitColumnValue[2] + "'";
                                    columnName = splitColumnValue[0];
                                }
                                columnValues = columnValues.substr(1);


                                Status = columnValues;
                                StatusCriteria = criteria;

                                if (columnName == "Region") {
                                    columnName = "d.Region";
                                } else if (columnName == "ProvinceDesc") {
                                    columnName = "d.ProvinceDesc";
                                }


                                var statusParam = {};
                                statusParam.fieldName = columnName;
                                statusParam.operatorName = StatusCriteria;
                                statusParam.fieldValue = Status;
                                statusParam.fieldType = "string";
                                EnquirySearchParameterList.push(statusParam);


                            }
                            else {
                                columnsList = columnsList.split(',');

                                if (columnsList[0] === "EnquiryDate") {
                                    debugger;
                                    if (EnquiryDate === "") {
                                        EnquiryDateCriteria = columnsList[1];
                                        EnquiryDate = columnsList[2];
                                        EnquiryDate = new Date(EnquiryDate);
                                        EnquiryDate = $filter('date')(EnquiryDate, "dd/MM/yyyy");

                                        var EnquiryDateParam = {};
                                        EnquiryDateParam.fieldName = "EnquiryDate";
                                        EnquiryDateParam.operatorName = EnquiryDateCriteria;
                                        EnquiryDateParam.fieldValue = EnquiryDate;
                                        EnquiryDateParam.fieldType = "date";
                                        EnquirySearchParameterList.push(EnquiryDateParam);

                                    } else {
                                        EnquiryEndDateCriteria = columnsList[1];
                                        EnquiryEndDate = columnsList[2];
                                        EnquiryEndDate = new Date(EnquiryEndDate);
                                        EnquiryEndDate = $filter('date')(EnquiryEndDate, "dd/MM/yyyy");

                                        var EnquiryEndDateParam = {};
                                        EnquiryEndDateParam.fieldName = "EnquiryDate";
                                        EnquiryEndDateParam.operatorName = EnquiryEndDateCriteria;
                                        EnquiryEndDateParam.fieldValue = EnquiryEndDate;
                                        EnquiryEndDateParam.fieldType = "date";
                                        EnquirySearchParameterList.push(EnquiryEndDateParam);

                                    }



                                }

                                if (columnsList[0] === "RequestDate") {
                                    if (RequestDate === "") {
                                        RequestDateCriteria = columnsList[1];
                                        RequestDate = columnsList[2];
                                        RequestDate = new Date(RequestDate);
                                        RequestDate = $filter('date')(RequestDate, "dd/MM/yyyy");

                                        var RequestDateParam = {};
                                        RequestDateParam.fieldName = "RequestDate";
                                        RequestDateParam.operatorName = RequestDateCriteria;
                                        RequestDateParam.fieldValue = RequestDate;
                                        RequestDateParam.fieldType = "date";
                                        EnquirySearchParameterList.push(RequestDateParam);

                                    } else {
                                        RequestEndDateCriteria = columnsList[1];
                                        RequestEndDate = columnsList[2];
                                        RequestEndDate = new Date(RequestEndDate);
                                        RequestEndDate = $filter('date')(RequestEndDate, "dd/MM/yyyy");

                                        var RequestEndDateParam = {};
                                        RequestEndDateParam.fieldName = "RequestDate";
                                        RequestEndDateParam.operatorName = RequestEndDateCriteria;
                                        RequestEndDateParam.fieldValue = RequestEndDate;
                                        RequestEndDateParam.fieldType = "date";
                                        EnquirySearchParameterList.push(RequestEndDateParam);

                                    }



                                }

                                if (columnsList[0] === "PromisedDate") {
                                    if (PromisedDate === "") {
                                        PromisedDateCriteria = columnsList[1];
                                        PromisedDate = columnsList[2];
                                        PromisedDate = new Date(PromisedDate);
                                        PromisedDate = $filter('date')(PromisedDate, "dd/MM/yyyy");

                                        var PromisedDateParam = {};
                                        PromisedDateParam.fieldName = "PromisedDate";
                                        PromisedDateParam.operatorName = PromisedDateCriteria;
                                        PromisedDateParam.fieldValue = PromisedDate;
                                        PromisedDateParam.fieldType = "date";
                                        EnquirySearchParameterList.push(PromisedDateParam);

                                    } else {
                                        PromisedEndDateCriteria = columnsList[1];
                                        PromisedEndDate = columnsList[2];
                                        PromisedEndDate = new Date(PromisedEndDate);
                                        PromisedEndDate = $filter('date')(PromisedEndDate, "dd/MM/yyyy");

                                        var PromisedEndDateParam = {};
                                        PromisedEndDateParam.fieldName = "PromisedDate";
                                        PromisedEndDateParam.operatorName = PromisedEndDateCriteria;
                                        PromisedEndDateParam.fieldValue = PromisedEndDate;
                                        PromisedEndDateParam.fieldType = "date";
                                        EnquirySearchParameterList.push(PromisedEndDateParam);

                                    }
                                }

                                if (columnsList[0] === "PickDateTime") {
                                    if (PickDateTime === "") {
                                        PickDateTimeCriteria = columnsList[1];
                                        PickDateTime = columnsList[2];
                                        PickDateTime = new Date(PickDateTime);
                                        PickDateTime = $filter('date')(PickDateTime, "dd/MM/yyyy");

                                        var PickDateTimeParam = {};
                                        PickDateTimeParam.fieldName = "PickDateTime";
                                        PickDateTimeParam.operatorName = PickDateTimeCriteria;
                                        PickDateTimeParam.fieldValue = PickDateTime;
                                        PickDateTimeParam.fieldType = "date";
                                        EnquirySearchParameterList.push(PickDateTimeParam);

                                    } else {
                                        PickEndDateTimeCriteria = columnsList[1];
                                        PickEndDateTime = columnsList[2];
                                        PickEndDateTime = new Date(PickEndDateTime);
                                        PickEndDateTime = $filter('date')(PickEndDateTime, "dd/MM/yyyy");

                                        var PickEndDateTimeParam = {};
                                        PickEndDateTimeParam.fieldName = "PickDateTime";
                                        PickEndDateTimeParam.operatorName = PickEndDateTimeCriteria;
                                        PickEndDateTimeParam.fieldValue = PickEndDateTime;
                                        PickEndDateTimeParam.fieldType = "date";
                                        EnquirySearchParameterList.push(PickEndDateTimeParam);

                                    }
                                }


                                if (columnsList[0] === "EnquiryAutoNumber") {
                                    EnquiryAutoNumberCriteria = columnsList[1];
                                    EnquiryAutoNumber = columnsList[2];

                                    var EnquiryAutoNumberParam = {};
                                    EnquiryAutoNumberParam.fieldName = "EnquiryAutoNumber";
                                    EnquiryAutoNumberParam.operatorName = EnquiryAutoNumberCriteria;
                                    EnquiryAutoNumberParam.fieldValue = EnquiryAutoNumber;
                                    EnquiryAutoNumberParam.fieldType = "string";
                                    EnquirySearchParameterList.push(EnquiryAutoNumberParam);

                                }

                                if (columnsList[0] === "Area") {
                                    AreaCriteria = columnsList[1];
                                    Area = columnsList[2];

                                    var AreaParam = {};
                                    AreaParam.fieldName = "Area";
                                    AreaParam.operatorName = AreaCriteria;
                                    AreaParam.fieldValue = Area;
                                    AreaParam.fieldType = "string";
                                    EnquirySearchParameterList.push(AreaParam);

                                }

                                if (columnsList[0] === "AssociatedOrder") {
                                    GratisCriteria = columnsList[1];
                                    Gratis = columnsList[2];

                                    var GratisParam = {};
                                    GratisParam.fieldName = "AssociatedOrder";
                                    GratisParam.operatorName = GratisCriteria;
                                    GratisParam.fieldValue = Gratis;
                                    GratisParam.fieldType = "string";
                                    EnquirySearchParameterList.push(GratisParam);

                                }

                                if (columnsList[0] === "CompanyName") {
                                    CompanyNameValueCriteria = columnsList[1];
                                    CompanyNameValue = columnsList[2];

                                    var CompanyNameParam = {};
                                    CompanyNameParam.fieldName = "CompanyName";
                                    CompanyNameParam.operatorName = CompanyNameValueCriteria;
                                    CompanyNameParam.fieldValue = CompanyNameValue;
                                    CompanyNameParam.fieldType = "string";
                                    EnquirySearchParameterList.push(CompanyNameParam);

                                }

                                if (columnsList[0] === "ProvinceDesc") {
                                    ProvinceDescCriteria = columnsList[1];
                                    ProvinceDesc = columnsList[2];
                                    var ProvinceDescParam = {};
                                    ProvinceDescParam.fieldName = "d.ProvinceDesc";
                                    ProvinceDescParam.operatorName = ProvinceDescCriteria;
                                    ProvinceDescParam.fieldValue = ProvinceDesc;
                                    ProvinceDescParam.fieldType = "string";
                                    EnquirySearchParameterList.push(ProvinceDescParam);
                                }

                                if (columnsList[0] === "Region") {
                                    RegionCriteria = columnsList[1];
                                    Region = columnsList[2];
                                    var RegionParam = {};
                                    RegionParam.fieldName = "d.Region";
                                    RegionParam.operatorName = RegionCriteria;
                                    RegionParam.fieldValue = Region;
                                    RegionParam.fieldType = "string";
                                    EnquirySearchParameterList.push(RegionParam);
                                }


                                if (columnsList[0] === "SubChannel") {
                                    SubChannelCriteria = columnsList[1];
                                    SubChannel = columnsList[2];
                                    var SubChannelParam = {};
                                    SubChannelParam.fieldName = "SubChannel";
                                    SubChannelParam.operatorName = SubChannelCriteria;
                                    SubChannelParam.fieldValue = SubChannel;
                                    SubChannelParam.fieldType = "string";
                                    EnquirySearchParameterList.push(SubChannelParam);
                                }



                                if (columnsList[0] === "DeliveryLocationName") {
                                    DeliveryLocationNameCriteria = columnsList[1];
                                    DeliveryLocationName = columnsList[2];
                                }

                                //New Filter

                                if (columnsList[0] === "ShipToCode") {
                                    ShipToCodeCriteria = columnsList[1];
                                    ShipToCode = columnsList[2];

                                    var ShipToCodeParam = {};
                                    ShipToCodeParam.fieldName = "ShipToCode";
                                    ShipToCodeParam.operatorName = ShipToCodeCriteria;
                                    ShipToCodeParam.fieldValue = ShipToCode;
                                    ShipToCodeParam.fieldType = "string";
                                    EnquirySearchParameterList.push(ShipToCodeParam);

                                }
                                if (columnsList[0] === "SONumber") {
                                    SONumberCriteria = columnsList[1];
                                    SONumber = columnsList[2];

                                    var SONumberParam = {};
                                    SONumberParam.fieldName = "SONumber";
                                    SONumberParam.operatorName = SONumberCriteria;
                                    SONumberParam.fieldValue = SONumber;
                                    SONumberParam.fieldType = "string";
                                    EnquirySearchParameterList.push(SONumberParam);

                                }

                                if (columnsList[0] === "SupplierName") {
                                    SupplierNameCriteria = columnsList[1];
                                    SupplierName = columnsList[2];
                                }

                                if (columnsList[0] === "SupplierCode") {
                                    SupplierCodeCriteria = columnsList[1];
                                    SupplierCode = columnsList[2];
                                }

                                if (columnsList[0] === "PONumber") {
                                    PONumberCriteria = columnsList[1];
                                    PONumber = columnsList[2];

                                    var PONumberParam = {};
                                    PONumberParam.fieldName = "PONumber";
                                    PONumberParam.operatorName = PONumberCriteria;
                                    PONumberParam.fieldValue = PONumber;
                                    PONumberParam.fieldType = "string";
                                    EnquirySearchParameterList.push(PONumberParam);

                                }

                                if (columnsList[0] === "EnquiryType") {
                                    EnquiryTypeCriteria = columnsList[1];
                                    EnquiryType = columnsList[2];

                                    var EnquiryTypeParam = {};
                                    EnquiryTypeParam.fieldName = "EnquiryType";
                                    EnquiryTypeParam.operatorName = EnquiryTypeCriteria;
                                    EnquiryTypeParam.fieldValue = EnquiryType;
                                    EnquiryTypeParam.fieldType = "string";
                                    EnquirySearchParameterList.push(EnquiryTypeParam);

                                }

                                if (columnsList[0] === "SoldToName") {
                                    SoldToNameCriteria = columnsList[1];
                                    SoldToName = columnsList[2];

                                    var SoldToNameParam = {};
                                    SoldToNameParam.fieldName = "SoldToName";
                                    SoldToNameParam.operatorName = SoldToNameCriteria;
                                    SoldToNameParam.fieldValue = SoldToName;
                                    SoldToNameParam.fieldType = "string";
                                    EnquirySearchParameterList.push(SoldToNameParam);

                                }

                                if (columnsList[0] === "SoldToCode") {
                                    SoldToCodeCriteria = columnsList[1];
                                    SoldToCode = columnsList[2];

                                    var SoldToCodeParam = {};
                                    SoldToCodeParam.fieldName = "SoldToCode";
                                    SoldToCodeParam.operatorName = SoldToCodeCriteria;
                                    SoldToCodeParam.fieldValue = SoldToCode;
                                    SoldToCodeParam.fieldType = "string";
                                    EnquirySearchParameterList.push(SoldToCodeParam);

                                }

                                if (columnsList[0] === "CollectionLocationName") {
                                    CollectionLocationNameCriteria = columnsList[1];
                                    CollectionLocationName = columnsList[2];

                                    var CollectionLocationNameParam = {};
                                    CollectionLocationNameParam.fieldName = "CollectionLocationName";
                                    CollectionLocationNameParam.operatorName = CollectionLocationNameCriteria;
                                    CollectionLocationNameParam.fieldValue = CollectionLocationName;
                                    CollectionLocationNameParam.fieldType = "string";
                                    EnquirySearchParameterList.push(CollectionLocationNameParam);

                                }

                                if (columnsList[0] === "CollectionLocationCode") {
                                    CollectionLocationCodeCriteria = columnsList[1];
                                    CollectionLocationCode = columnsList[2];

                                    var CollectionLocationCodeParam = {};
                                    CollectionLocationCodeParam.fieldName = "CollectionLocationCode";
                                    CollectionLocationCodeParam.operatorName = CollectionLocationCodeCriteria;
                                    CollectionLocationCodeParam.fieldValue = CollectionLocationCode;
                                    CollectionLocationCodeParam.fieldType = "string";
                                    EnquirySearchParameterList.push(CollectionLocationCodeParam);

                                }

                                if (columnsList[0] === "ShipToName") {
                                    ShipToNameCriteria = columnsList[1];
                                    ShipToName = columnsList[2];

                                    var ShipToNameParam = {};
                                    ShipToNameParam.fieldName = "ShipToName";
                                    ShipToNameParam.operatorName = ShipToNameCriteria;
                                    ShipToNameParam.fieldValue = ShipToName;
                                    ShipToNameParam.fieldType = "string";
                                    EnquirySearchParameterList.push(ShipToNameParam);
                                }

                                if (columnsList[0] === "TruckSize") {
                                    TruckSizeCriteria = columnsList[1];
                                    TruckSize = columnsList[2];

                                    var TruckSizeParam = {};
                                    TruckSizeParam.fieldName = "TruckSize";
                                    TruckSizeParam.operatorName = TruckSizeCriteria;
                                    TruckSizeParam.fieldValue = TruckSize;
                                    TruckSizeParam.fieldType = "string";
                                    EnquirySearchParameterList.push(TruckSizeParam);

                                }

                                if (columnsList[0] === "CarrierName") {
                                    CarrierNameCriteria = columnsList[1];
                                    CarrierName = columnsList[2];

                                    var CarrierNameParam = {};
                                    CarrierNameParam.fieldName = "CarrierName";
                                    CarrierNameParam.operatorName = CarrierNameCriteria;
                                    CarrierNameParam.fieldValue = CarrierName;
                                    CarrierNameParam.fieldType = "string";
                                    EnquirySearchParameterList.push(CarrierNameParam);

                                }

                                if (columnsList[0] === "ShortName") {
                                    ShortNameCriteria = columnsList[1];
                                    ShortName = columnsList[2];

                                    var ShortNameParam = {};
                                    ShortNameParam.fieldName = "ShortName";
                                    ShortNameParam.operatorName = ShortNameCriteria;
                                    ShortNameParam.fieldValue = ShortName;
                                    ShortNameParam.fieldType = "string";
                                    EnquirySearchParameterList.push(ShortNameParam);

                                }

                                if (columnsList[0] === "RPM") {
                                    RPMCriteria = columnsList[1];
                                    RPM = columnsList[2];
                                }


                                //-----------------------------------------

                                if (columnsList[0] === "BranchPlant") {
                                    BranchPlantCriteria = columnsList[1];
                                    BranchPlant = columnsList[2];
                                }

                                if (columnsList[0] === "TotalPriceWithCurreny") {
                                    if (TotalPrice === "") {
                                        if (fields.length > 1) {
                                            TotalPriceCriteria = "=";
                                        } else {
                                            TotalPriceCriteria = columnsList[1];
                                        }
                                        TotalPriceCriteria = columnsList[1];
                                        TotalPrice = columnsList[2];
                                    }

                                    var TotalPriceParam = {};
                                    TotalPriceParam.fieldName = "TotalPriceWithCurreny";
                                    TotalPriceParam.operatorName = TotalPriceCriteria;
                                    TotalPriceParam.fieldValue = TotalPrice;
                                    TotalPriceParam.fieldType = "string";
                                    EnquirySearchParameterList.push(TotalPriceParam);

                                }

                                if (columnsList[0] === "IsAvailableStock") {
                                    AvailableStockCriteria = columnsList[1];
                                    if (columnsList[2] === 'Ok') {
                                        AvailableStock = '1';
                                    }
                                    else if (columnsList[2] === 'Not Ok') {
                                        AvailableStock = '0';
                                    }

                                    var AvailableStockParam = {};
                                    AvailableStockParam.fieldName = "IsAvailableStock";
                                    AvailableStockParam.operatorName = AvailableStockCriteria;
                                    AvailableStockParam.fieldValue = AvailableStock;
                                    AvailableStockParam.fieldType = "string";
                                    EnquirySearchParameterList.push(AvailableStockParam);

                                }


                                if (columnsList[0] === "Priority") {
                                    AvailableStockCriteria = columnsList[1];
                                    if (columnsList[2] === '1') {
                                        AvailableStock = 1;
                                    }
                                    else if (columnsList[2] === '0') {
                                        AvailableStock = 0;
                                    }

                                    var AvailableStockParam = {};
                                    AvailableStockParam.fieldName = "Priority";
                                    AvailableStockParam.operatorName = AvailableStockCriteria;
                                    AvailableStockParam.fieldValue = AvailableStock;
                                    AvailableStockParam.fieldType = "string";
                                    EnquirySearchParameterList.push(AvailableStockParam);
                                }

                                if (columnsList[0] === "IsAvailableCredit") {
                                    AvailableCreditCriteria = columnsList[1];
                                    if (columnsList[2] === 'Ok') {
                                        AvailableCredit = '1';
                                    }
                                    else if (columnsList[2] === 'Not Ok') {
                                        AvailableCredit = '0';
                                    }
                                }

                                if (columnsList[0] === "ReceivedCapacityPalettesCheck") {
                                    ReceivedCapacityPalatesCriteria = columnsList[1];
                                    if (columnsList[2] === 'Ok') {
                                        ReceivedCapacityPalates = '1';
                                    }
                                    else if (columnsList[2] === 'Not Ok') {
                                        ReceivedCapacityPalates = '0';
                                    }

                                    var ReceivedCapacityPalettesCheckParam = {};
                                    ReceivedCapacityPalettesCheckParam.fieldName = "ReceivedCapacityPalettesCheck";
                                    ReceivedCapacityPalettesCheckParam.operatorName = ReceivedCapacityPalatesCriteria;
                                    ReceivedCapacityPalettesCheckParam.fieldValue = ReceivedCapacityPalates;
                                    ReceivedCapacityPalettesCheckParam.fieldType = "string";
                                    EnquirySearchParameterList.push(ReceivedCapacityPalettesCheckParam);

                                }

                                if (columnsList[0] === "Empties") {
                                    EmptiesCriteria = columnsList[1];
                                    if (columnsList[2] === 'Ok') {
                                        Empties = 'C';
                                    }
                                    else if (columnsList[2] === 'Not Ok') {
                                        Empties = 'W';
                                    }

                                    var EmptiesParam = {};
                                    EmptiesParam.fieldName = "Empties";
                                    EmptiesParam.operatorName = EmptiesCriteria;
                                    EmptiesParam.fieldValue = Empties;
                                    EmptiesParam.fieldType = "string";
                                    EnquirySearchParameterList.push(EmptiesParam);

                                }

                                if (columnsList[0] === "Status") {
                                    StatusCriteria = columnsList[1];
                                    Status = columnsList[2];

                                    var status1Param = {};
                                    status1Param.fieldName = "Status";
                                    status1Param.operatorName = StatusCriteria;
                                    status1Param.fieldValue = Status;
                                    status1Param.fieldType = "string";
                                    EnquirySearchParameterList.push(status1Param);

                                }


                                if (columnsList[0] === "RelatedEnquiryNumber") {
                                    RelatedEnquiryNumberCriteria = columnsList[1];
                                    RelatedEnquiryNumber = columnsList[2];

                                    var RelatedEnquiryNumberParam = {};
                                    RelatedEnquiryNumberParam.fieldName = "RelatedEnquiryNumber";
                                    RelatedEnquiryNumberParam.operatorName = RelatedEnquiryNumberCriteria;
                                    RelatedEnquiryNumberParam.fieldValue = RelatedEnquiryNumber;
                                    RelatedEnquiryNumberParam.fieldType = "string";
                                    EnquirySearchParameterList.push(RelatedEnquiryNumberParam);

                                }

                                if (columnsList[0] === "TypeOfWay") {
                                    TypeOfWayCriteria = columnsList[1];
                                    TypeOfWay = columnsList[2];

                                    var TypeOfWayParam = {};
                                    TypeOfWayParam.fieldName = "TypeOfWay";
                                    TypeOfWayParam.operatorName = TypeOfWayCriteria;
                                    TypeOfWayParam.fieldValue = TypeOfWay;
                                    TypeOfWayParam.fieldType = "string";
                                    EnquirySearchParameterList.push(TypeOfWayParam);

                                }
                            }
                        }
                    }


                    if (loadOptions.sort !== null && loadOptions.sort !== undefined) {
                        if (loadOptions.sort[0].desc === true) {
                            OrderByCriteria = "desc";
                        } else {
                            OrderByCriteria = "asc";
                        }
                        if (loadOptions.sort[0].selector === "RequestDate") {
                            OrderBy = "RequestDate";
                        } else if (loadOptions.sort[0].selector === "PromisedDate") {
                            OrderBy = "PromisedDate";
                        } else if (loadOptions.sort[0].selector === "BranchPlant") {
                            OrderBy = "StockLocationId";
                        }
                        else if (loadOptions.sort[0].selector === "Status" || loadOptions.sort[0].selector === "RIType") {
                            OrderBy = ""
                        }
                        else {
                            OrderBy = loadOptions.sort[0].selector;
                        }

                    }

                    if ($scope.ProductCodes !== "" && $scope.ProductCodes !== null && $scope.ProductCodes !== undefined) {

                        var ProductCodesParam = {};
                        ProductCodesParam.fieldName = "ProductCodes";
                        ProductCodesParam.operatorName = $scope.ProductSearchCriteria;
                        ProductCodesParam.fieldValue = $scope.ProductCodes;
                        ProductCodesParam.fieldType = "string";
                        EnquirySearchParameterList.push(ProductCodesParam);

                    }


                    if ($scope.Areas !== "" && $scope.Areas !== null && $scope.Areas !== undefined) {
                        var AreaParam = {};
                        AreaParam.fieldName = "Area";
                        AreaParam.operatorName = $scope.AreasSearchCriteria;
                        AreaParam.fieldValue = $scope.Areas;
                        AreaParam.fieldType = "string";
                        EnquirySearchParameterList.push(AreaParam);
                    }


                    if ($scope.BranchPlantCodes !== "" && $scope.BranchPlantCodes !== null && $scope.BranchPlantCodes !== undefined) {
                        var AreaParam = {};
                        AreaParam.fieldName = "BranchPlantCode";
                        AreaParam.operatorName = $scope.BranchPlantCodesSearchCriteria;
                        AreaParam.fieldValue = $scope.BranchPlantCodes;
                        AreaParam.fieldType = "string";
                        EnquirySearchParameterList.push(AreaParam);
                    }


                    if ($scope.CarrierCodes !== "" && $scope.CarrierCodes !== null && $scope.CarrierCodes !== undefined) {
                        var AreaParam = {};
                        AreaParam.fieldName = "CarrierCode";
                        AreaParam.operatorName = $scope.CarrierCodesSearchCriteria;
                        AreaParam.fieldValue = $scope.CarrierCodes;
                        AreaParam.fieldType = "string";
                        EnquirySearchParameterList.push(AreaParam);
                    }

                    if ($scope.TruckSizes !== "" && $scope.TruckSizes !== null && $scope.TruckSizes !== undefined) {
                        var AreaParam = {};
                        AreaParam.fieldName = "TruckSize";
                        AreaParam.operatorName = $scope.TruckSizesSearchCriteria;
                        AreaParam.fieldValue = $scope.TruckSizes;
                        AreaParam.fieldType = "string";
                        EnquirySearchParameterList.push(AreaParam);
                    }




                    var index = parseFloat(parseFloat(parameters.skip) / parseFloat(parameters.take));

                    var page = $location.absUrl().split('#/')[1];
                    $scope.ViewControllerName = page;

                    debugger;
                    var requestData =
                    {
                        ServicesAction: 'LoadCustomerServiceEnquiryDetails',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: OrderBy,
                        OrderByCriteria: OrderByCriteria,
                        EnquiryAutoNumber: EnquiryAutoNumber,
                        EnquiryAutoNumberCriteria: EnquiryAutoNumberCriteria,
                        CompanyNameValue: CompanyNameValue,
                        CompanyNameValueCriteria: CompanyNameValueCriteria,
                        DeliveryLocationNameCriteria: DeliveryLocationNameCriteria,
                        DeliveryLocationName: DeliveryLocationName,
                        SoldToCode: SoldToCode,
                        SoldToCodeCriteria: SoldToCodeCriteria,
                        BranchPlant: BranchPlant,
                        BranchPlantCriteria: BranchPlantCriteria,
                        Area: Area,
                        AreaCriteria: AreaCriteria,
                        DeliveryLocation: DeliveryLocation,
                        DeliveryLocationCriteria: DeliveryLocationCriteria,
                        Gratis: Gratis,
                        GratisCriteria: GratisCriteria,
                        EnquiryDate: EnquiryDate,
                        EnquiryDateCriteria: EnquiryDateCriteria,
                        EnquiryEndDate: EnquiryEndDate,
                        EnquiryEndDateCriteria: EnquiryEndDateCriteria,
                        RequestDate: RequestDate,
                        RequestDateCriteria: RequestDateCriteria,
                        RequestEndDate: RequestEndDate,
                        RequestEndDateCriteria: RequestEndDateCriteria,

                        PickDateTime: PickDateTime,
                        PickDateTimeCriteria: PickDateTimeCriteria,
                        PickEndDateTime: PickEndDateTime,
                        PickEndDateTimeCriteria: PickEndDateTimeCriteria,

                        PromisedDate: PromisedDate,
                        PromisedDateCriteria: PromisedDateCriteria,
                        PromisedEndDate: PromisedEndDate,
                        PromisedEndDateCriteria: PromisedEndDateCriteria,
                        Status: Status,
                        StatusCriteria: StatusCriteria,
                        TotalPriceCriteria: TotalPriceCriteria,
                        TotalPrice: TotalPrice,
                        Empties: Empties,
                        EmptiesCriteria: EmptiesCriteria,
                        IsAvailableStock: AvailableStock,
                        AvailableStockCriteria: AvailableStockCriteria,
                        AvailableCredit: AvailableCredit,
                        AvailableCreditCriteria: AvailableCreditCriteria,
                        ReceivedCapacityPalates: ReceivedCapacityPalates,
                        ReceivedCapacityPalatesCriteria: ReceivedCapacityPalatesCriteria,
                        CurrentState: '1,7',
                        IsExportToExcel: '0',
                        RoleMasterId: $rootScope.RoleId,
                        LoginId: $rootScope.UserId,
                        CultureId: $rootScope.CultureId,
                        ProductCode: $scope.ProductCodes,
                        ProductSearchCriteria: $scope.ProductSearchCriteria,
                        SONumber: SONumber,
                        SupplierName: SupplierName,
                        SupplierCode: SupplierCode,
                        PONumber: PONumber,
                        EnquiryType: EnquiryType,
                        SoldToName: SoldToName,
                        SoldToCode: SoldToCode,
                        ShipToCode: ShipToCode,
                        SubChannel: SubChannel,
                        CollectionLocationName: CollectionLocationName,
                        CollectionLocationCode: CollectionLocationCode,
                        ShipToName: ShipToName,
                        TruckSize: TruckSize,
                        SONumberCriteria: SONumberCriteria,
                        SupplierNameCriteria: SupplierNameCriteria,
                        SupplierCodeCriteria: SupplierCodeCriteria,
                        PONumberCriteria: PONumberCriteria,
                        EnquiryTypeCriteria: EnquiryTypeCriteria,
                        SoldToNameCriteria: SoldToNameCriteria,
                        SoldToCodeCriteria: SoldToCodeCriteria,
                        ShipToCodeCriteria: ShipToCodeCriteria,
                        SubChannelCriteria: SubChannelCriteria,
                        CollectionLocationNameCriteria: CollectionLocationNameCriteria,
                        CollectionLocationCodeCriteria: CollectionLocationCodeCriteria,
                        ShipToNameCriteria: ShipToNameCriteria,
                        TruckSizeCriteria: TruckSizeCriteria,
                        PageName: page,
                        PageControlName: PageControlName,
                        CarrierName: CarrierName,
                        CarrierNameCriteria: CarrierNameCriteria,
                        ShortName: ShortName,
                        ShortNameCriteria: ShortNameCriteria,
                        RPM: RPM,
                        RPMCriteria: RPMCriteria,
                        RelatedEnquiryNumber: RelatedEnquiryNumber,
                        RelatedEnquiryNumberCriteria: RelatedEnquiryNumberCriteria,
                        TypeOfWay: TypeOfWay,
                        TypeOfWayCriteria: TypeOfWayCriteria
                    };

                    $scope.RequestDataFilter = requestData;

                    $scope.EnquirySearchParameterList = EnquirySearchParameterList;
                    var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                    var enquiryDTO = {
                        "RoleId": parseInt($rootScope.RoleId),
                        "CultureId": parseInt($rootScope.CultureId),
                        "PageIndex": parseInt(index),
                        "PageSize": parseInt(parameters.take),
                        "OrderBy": OrderBy,
                        "OrderByCriteria": OrderByCriteria,
                        "PageName": page,
                        "PageControlName": PageControlName,
                        "LoginId": parseInt($rootScope.UserId),
                        "EnquirySearchParameterList": EnquirySearchParameterList,
                        "whereClause": ""
                    };

                    console.log("2" + new Date());

                    var gridServerCall = ManageEnquiryService.LoadEnquiryDetails(enquiryDTO);


                    var objectId = 15;
                    PageControlName = "Enquiry";
                    if (page === "GraticsOrderUnprocess") {
                        objectId = 523;
                        PageControlName = "Enquiry"
                    } else if (page === "MOTEnquiryList") {
                        objectId = 641;
                        PageControlName = "Enquiry"
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

                    //var stringfyjson = JSON.stringify(requestData);
                    var gridconsolidateApiParamater =
                    {
                        Json: gridrequestData,
                    };



                    var gridrequestWorkFlowData =
                    {
                        ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
                        RoleId: $rootScope.RoleId,
                        UserId: $rootScope.UserId,
                        SettingName: 'EnquiryListScheduler'
                    };

                    var workFlowConsolidateApiParamater =
                    {
                        Json: gridrequestWorkFlowData,
                    };


                    var gridrequestDataAdvanceEditScheduler =
                    {
                        ServicesAction: 'LoadAllWorkFlowStepsUsingFunctionStatusMapping',
                        RoleId: $rootScope.RoleId,
                        UserId: $rootScope.UserId,
                        SettingName: 'AdvanceEditScheduler'
                    };

                    //var stringfyjson = JSON.stringify(requestData);
                    var gridconsolidateApiParamaterAdvanceEdit =
                    {
                        Json: gridrequestDataAdvanceEditScheduler,
                    };



                    var requestData =
                    {
                        ServicesAction: 'LoadAllProducts',
                        CompanyId: $rootScope.CompanyId
                    };

                    var jsonobject = {};
                    jsonobject.Json = requestData;


                    var responseForGridColumnList = {};
                    var responseForworkflowStepsList = {};
                    var responseForProductList = {};
                    var responseForworkflowStepsAdvanceEditList = {};


                    if ($scope.IsPageLoad) {

                        responseForGridColumnList = GrRequestService.ProcessRequest(gridconsolidateApiParamater);
                        responseForworkflowStepsList = GrRequestService.ProcessRequest(workFlowConsolidateApiParamater);
                        responseForProductList = GrRequestService.ProcessRequest(jsonobject);
                        responseForworkflowStepsAdvanceEditList = GrRequestService.ProcessRequest(gridconsolidateApiParamaterAdvanceEdit);
                    }

                    var responseForGridColumnList = {};



                    return $q.all([
                        responseForGridColumnList,
                        responseForworkflowStepsList,
                        responseForProductList,
                        responseForworkflowStepsAdvanceEditList,
                        gridServerCall
                    ]).then(function (resp) {
                        debugger;


                        var responseGridColumn = resp[0];
                        var workflowResponse = resp[1];
                        var productListResponse = resp[2];
                        var responseflowStepsAdvanceEditList = resp[3];

                        var response = resp[4];

                        if ($scope.IsPageLoad) {

                            //debugger;
                            //$scope.GridColumnList = responseGridColumn.data.Json.GridColumnList;

                            //var ld = JSON.stringify(responseGridColumn.data);
                            //var ColumnlistinJson = JSON.parse(ld);

                            //$scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList;

                            debugger;

                            var checkedEnquiryData = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'CheckedEnquiry' });

                            if (checkedEnquiryData.length > 0) {


                                checkedEnquiryData[0].allowFiltering = false;
                                checkedEnquiryData[0].allowSorting = false;
                                checkedEnquiryData[0].allowEditing = false;


                                checkedEnquiryData[0].cellTemplate = function (container, options) {
                                    $("<div />").dxCheckBox({
                                        value: JSON.parse(options.data.CheckedEnquiry),
                                        //visible: options.data.CurrentState == '999' ? false : options.data.IsCompleted == '1' ? false : true,
                                        visible: options.data.IsEditGridColumns,
                                        onValueChanged: function (data) {
                                            debugger;
                                            $scope.HeaderCheckboxControl = false;
                                            $scope.CellCheckboxControl = true;
                                        }
                                    }).appendTo(container);
                                };


                                checkedEnquiryData[0].headerCellTemplate = function (container, options) {
                                    debugger;

                                    $("<div />").dxCheckBox({
                                        value: false,
                                        onValueChanged: function (data) {
                                            debugger;
                                            $scope.HeaderCheckBoxAction = data.value;
                                            $scope.HeaderCheckboxControl = true;
                                            $scope.CellCheckboxControl = false;
                                        }
                                    }).appendTo(container);
                                };
                            }
                            var statusData = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Status' });

                            if (statusData.length > 0) {

                                statusData[0].lookup = {
                                    dataSource: StatusList,
                                    displayExpr: "ResourceValue",
                                    valueExpr: "ResourceValue"
                                };

                            }

                            var empties = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Empties' });

                            if (empties.length > 0) {

                                empties[0].lookup = {
                                    dataSource: [{ Id: "Ok" }, { Id: "Not Ok" }],
                                    displayExpr: "Id",
                                    valueExpr: "Id"
                                }

                            }

                            var receivedCapacityPalettesCheck = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'ReceivedCapacityPalettesCheck' });

                            if (receivedCapacityPalettesCheck.length > 0) {

                                receivedCapacityPalettesCheck[0].lookup = {
                                    dataSource: [{ Id: "Ok" }, { Id: "Not Ok" }],
                                    displayExpr: "Id",
                                    valueExpr: "Id"
                                }

                            }


                            var isAvailableStock = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'IsAvailableStock' });

                            if (isAvailableStock.length > 0) {

                                isAvailableStock[0].lookup = {
                                    dataSource: [{ Id: "Ok" }, { Id: "Not Ok" }],
                                    displayExpr: "Id",
                                    valueExpr: "Id"
                                }

                            }



                            var isAvailableCredit = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'IsAvailableCredit' });

                            if (isAvailableCredit.length > 0) {

                                isAvailableCredit[0].lookup = {
                                    dataSource: [{ Id: "Ok" }, { Id: "Not Ok" }],
                                    displayExpr: "Id",
                                    valueExpr: "Id"
                                }

                            }



                            var empties = $scope.DynamicColumnList.filter(function (el) { return el.dataField == 'Empties' });

                            if (empties.length > 0) {

                                empties[0].lookup = {
                                    dataSource: [{ Id: "Ok" }, { Id: "Not Ok" }],
                                    displayExpr: "Id",
                                    valueExpr: "Id"
                                }

                            }

                            if (workflowResponse.data != "") {
                                if (workflowResponse.data.Json != undefined) {
                                    $scope.WorkFlowStepsListForBranchPlant = workflowResponse.data.Json.WorkFlowStepList;

                                } else {
                                    $scope.WorkFlowStepsListForBranchPlant = [];
                                }
                            } else {
                                $scope.WorkFlowStepsListForBranchPlant = [];
                            }

                            //$scope.LoadSalesAdminApprovalGrid();

                            //$scope.LoadWorkFlowStepsData();

                            if ($scope.IsRefreshGrid === true) {
                                $scope.RefreshDataGrid();
                            }

                            if (productListResponse !== undefined) {
                                if (productListResponse.data !== undefined) {
                                    var resoponsedata = productListResponse.data;
                                    $scope.ProductList = resoponsedata.Item.ItemList;
                                    $scope.bindallproduct = resoponsedata.Item.ItemList;
                                }
                            }


                            if (responseflowStepsAdvanceEditList !== undefined) {
                                if (responseflowStepsAdvanceEditList.data != undefined) {
                                    if (responseflowStepsAdvanceEditList.data.Json != undefined) {

                                        $scope.WorkFlowStepsAdvList = responseflowStepsAdvanceEditList.data.Json.WorkFlowStepList;

                                    } else {
                                        $scope.WorkFlowStepsAdvList = [];
                                    }
                                } else {
                                    $scope.WorkFlowStepsAdvList = [];
                                }
                            }
                            else {
                                $scope.WorkFlowStepsAdvList = [];
                            }


                        }

                        var totalcount = 0;
                        var ListData = [];
                        var resoponsedata = response.data;
                        if (resoponsedata !== null) {

                            if (resoponsedata !== undefined) {
                                if (resoponsedata.length !== undefined) {
                                    if (resoponsedata.length > 0) {
                                        ListData = resoponsedata;
                                        totalcount = resoponsedata[0].TotalCount;
                                    } else {
                                        ListData = [];
                                        totalcount = 0;
                                    }

                                } else {
                                    ListData = [];
                                    totalcount = 0;
                                }


                            } else {
                                ListData = [];
                                totalcount = 0;
                            }
                        } var inquiryList = {
                            data: ListData,
                            totalRecords: totalcount
                        }
                        //for (var i = 0; i < ListData.length; i++) {
                        //    ListData[i].CheckedEnquiry = false;
                        //}

                        $scope.IsGridLoadCompleted = false;

                        var data = ListData;
                        debugger;
                        $scope.SalesAdminApprovalList = data;


                        angular.forEach($scope.SalesAdminApprovalList, function (item) {
                            item.CheckedEnquiry = false;
                            item.CollectionLocationCodeForCheck = item.CollectionLocationCode;
                            item.CarrierCodeForCheck = item.CarrierCode;
                            item.RequestDateFieldForCheck = item.PromisedDate;
                            item.PickDateTimeForCheck = item.PickDateTime;

                            item.CurrentState = "" + item.CurrentState + "";

                            var WorkFlowStepsListForBranchPlant = angular.copy($scope.WorkFlowStepsListForBranchPlant);
                            WorkFlowStepsListForBranchPlant = WorkFlowStepsListForBranchPlant.filter(function (el) { return el.StatusCode === item.CurrentState; });

                            if (WorkFlowStepsListForBranchPlant !== undefined) {
                                if (WorkFlowStepsListForBranchPlant.length > 0) {
                                    item.IsEditGridColumns = false;
                                }
                                else {
                                    item.IsEditGridColumns = true;
                                }
                            }
                            else {
                                item.IsEditGridColumns = true;
                            }

                            var pickupdate = new Date(item.PickDateTime);

                            var newdatevalue = new Date();
                            var dd1 = newdatevalue.getDate();
                            var mm1 = newdatevalue.getMonth() + 1;
                            var y1 = newdatevalue.getFullYear();
                            var newdateformate = mm1 + '/' + dd1 + '/' + y1 + ' 00:00:00';
                            var newdateformatevalue = $filter('date')(newdateformate, "dd/MM/yyyy");
                            newdateformatevalue = new Date(newdateformatevalue);

                            if (item.IsEditGridColumns === true) {
                                if (newdateformatevalue > pickupdate) {
                                    item.IsEditAllowPromisedDate = false;
                                } else {
                                    item.IsEditAllowPromisedDate = true;
                                }
                            } else {
                                item.IsEditAllowPromisedDate = false;
                            }

                            ///Adv Edit

                            var WorkFlowStepsAdvList = angular.copy($scope.WorkFlowStepsAdvList);
                            WorkFlowStepsAdvList = WorkFlowStepsAdvList.filter(function (el) { return el.StatusCode === item.CurrentState; });

                            if (WorkFlowStepsAdvList !== undefined) {
                                if (WorkFlowStepsAdvList.length > 0) {
                                    item.IsAdvEditGridColumns = false;
                                }
                                else {
                                    item.IsAdvEditGridColumns = true;
                                }
                            }
                            else {
                                item.IsAdvEditGridColumns = true;
                            }

                        });
                        console.log("3" + new Date());
                        //if ($scope.GridConfigurationLoaded === false) {
                        //    $scope.LoadGridByConfiguration();
                        //}

                        return { data: ListData, totalCount: parseInt(totalcount) };
                        //return data;
                    });
                }
            }
        });

        $scope.SalesAdminApprovalGrid = {
            dataSource: {
                store: SalesAdminApprovalData,
            },
            bindingOptions: function () {

            },
            showBorders: true,
            allowColumnReordering: true,

            loadPanel: {
                Type: Number,
                width: 200,
                height: 90,
                indicatorSrc: "",
                shading: true,
                shadingColor: "",
                showIndicator: true,
                showPane: true
            },
            scrolling: {
                mode: "standard",
                showScrollbar: "always", // or "onClick" | "always" | "never"
                // scrollByThumb: true
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
            allowColumnResizing: true,
            columnAutoWidth: true,
            columnHidingEnabled: false,

            columnResizingMode: "widget",

            groupPanel: {
                visible: true
            },

            keyExpr: "EnquiryAutoNumber",
            selection: {
                mode: "single"
            },


            onInitialized: function () {

            },

            onContentReady: function () {
                if ($scope.IsGridLoadCompleted === false) {
                    setTimeout(function () {
                        $("#SalesAdminApprovalGrid").dxDataGrid("instance").updateDimensions();
                        $scope.IsGridLoadCompleted = true;
                    }, 100);
                }
            },

            onCellPrepared: function (e) {
                //if (e.column.dataField !== "Status") {
                //    if (e.rowType == 'header') {
                //        e.cellElement.find(".dx-header-filter").hide();
                //    }
                //}
            },

            onCellClick: function (e) {

                $scope.IsColumnDetailView = false;
                if ($scope.CellCheckboxControl === true || $scope.HeaderCheckboxControl === true) {

                    $scope.IsColumnDetailView = true;

                    if ($scope.CellCheckboxControl === true) {

                        var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryAutoNumber === e.data.EnquiryAutoNumber; });
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
                if (e.rowType !== "filter" && e.rowType != "header" && e.rowType != "detail") {

                    var detailViewAvailable = $scope.GridColumnList.filter(function (el) { return el.ResourceValue === e.column.caption; });
                    if (detailViewAvailable.length > 0) {
                        if (detailViewAvailable[0].IsDetailsViewAvailable === "1") {

                            $scope.CurrentOpenMasterDetailsObject = e;
                            $scope.IsColumnDetailView = true;

                            if (e.column.caption === $rootScope.resData.res_GridColumn_EnquiryAutoNumber) {
                                //if ($scope.IsInEditMode == false && $scope.IsInEditModeForValidation == false) {

                                $scope.ProductInfoSection = true;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = false;
                                $scope.IsAccordianOpen = true;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadEnquiryProductByEnquiryId(e.data.EnquiryId, e, 0);
                                }

                            } else if (e.column.caption === $rootScope.resData.res_ViewInquiryForCustomer_AdvanceEdit) {
                                //if ($scope.IsInEditMode == false && $scope.IsInEditModeForValidation == false) {

                                $scope.ProductInfoSection = true;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = false;
                                $scope.IsAccordianOpen = true;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadEnquiryProductByEnquiryId(e.data.EnquiryId, e, 1);

                                }

                            }
                            else if (e.column.caption === $rootScope.resData.res_GridColumn_Stock && e.data.IsAvailableStock !== "1") {
                                $scope.ProductInfoSection = false;
                                $scope.StockCheckSection = true;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = false;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadEnquiryProductByEnquiryId(e.data.EnquiryId, e, 0);
                                }

                            }
                            else if (e.column.caption === $rootScope.resData.res_GridColumn_Status) {
                                $scope.ProductInfoSection = false;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = true;
                                $scope.CustomerCreditCheckSection = false;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadEnquiryProductByEnquiryId(e.data.EnquiryId, e, 0);
                                }

                            } else if (e.column.caption === $rootScope.resData.res_ViewInquiryForOM_CreditLimit) {
                                $scope.ProductInfoSection = false;
                                $scope.StockCheckSection = false;
                                $scope.StatusTimelineSection = false;
                                $scope.CustomerCreditCheckSection = true;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($scope.PreviousExpandedRow !== "") {
                                        if (e.data !== $scope.PreviousExpandedRow) {
                                            e.component.collapseRow($scope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadCreditCheckByEnquiryId(e.data.EnquiryId, e);
                                }

                            }
                        } else {
                            //$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApprovalGrid_DetailView), 'error', 3000);
                        }
                    }


                } else {
                    $scope.IsColumnDetailView = true;
                }

            },

            onRowClick: function (e) {
                if ($scope.IsColumnDetailView === false) {

                }
            },


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


            noDataText: "",
            masterDetail: {
                scrolling:
                {
                    enabled: false,
                    visible: false
                },
                enabled: false,
                template: "EnquiryProductInfo"
            },
            columns: $scope.DynamicColumnList,
        };
    }
    //#endregion
    //$scope.LoadSalesAdminApprovalGrid();
    $scope.IsEnquiryEditStaus = true;




    //#region Load Enquiry Product Information By Enquiry Id
    $scope.LoadEnquiryProductByEnquiryId = function (Id, e, isAdvEdit) {
        $rootScope.Throbber.Visible = true;
        $scope.IsEnquiryEditStaus = true;
        var requestData =
        {
            ServicesAction: 'LoadEnquiryByEnquiryId',
            EnquiryId: Id,
            RoleId: $rootScope.RoleId,
            CultureId: $rootScope.CultureId,
            UserId: $rootScope.UserId

        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            debugger;

            $scope.EnquiryTotalAmount = 0;
            $scope.EnquiryCashDiscount = 0;
            $scope.EnquiryTotalTax = 0;
            $scope.EnquiryNetAmount = 0;
            $scope.EnquiryGrandTotalAmount = 0;
            $scope.EnquiryDepositeAmount = 0;

            if (response.data !== undefined) {

                $scope.IsEnquiryEdit = false;
                $scope.IsEnquiryEditStaus = response.data.IsEditEnquiry;
                $scope.EnableAddItem = false;
                $scope.ClearItemData();
                $scope.CreditLimit = response.data.Json.EnquiryList.CreditLimit;
                $scope.AvailableCreditLimit = response.data.Json.EnquiryList.AvailableCreditLimit;

                var totalEnquiryAmount = parseFloat(response.data.Json.EnquiryList.TotalEnquiryCreated) + ((parseFloat(response.data.Json.EnquiryList.TotalEnquiryCreated) * parseFloat($scope.ItemTaxInPec)) / 100);
                $scope.AvailableCreditLimit = Number($scope.AvailableCreditLimit) - Number(totalEnquiryAmount);
                $scope.AvailableCreditLimit = Number($scope.AvailableCreditLimit) - Number(response.data.Json.EnquiryList.EnquiryTotalDepositAmount);

                $rootScope.EmptiesLimit = response.data.Json.EnquiryList.EmptiesLimit;
                $rootScope.ActualEmpties = response.data.Json.EnquiryList.ActualEmpties;

                if (Number($rootScope.ActualEmpties) > 0) {

                    var emptiesNum = $rootScope.ActualEmpties.toString().replace("-", "");
                    var emptiesValue = (Number($rootScope.ActualEmpties) * $scope.EmptiesAmount).toString().replace("-", "");

                    $scope.EmptiesLimitValidationColorCode = false;

                    $scope.EmptiesLimitMessage = String.format($rootScope.resData.res_CreateInquiryPage_EmptiesOverdue, emptiesNum, emptiesValue);
                }
                else {

                    $scope.EmptiesLimitMessage = String.format($rootScope.resData.res_CreateInquiryPage_EmptiesLimit, $rootScope.ActualEmpties);
                    $scope.EmptiesLimitValidationColorCode = true;

                }


                $scope.SelectedEnquiryNumber = response.data.Json.EnquiryList.EnquiryAutoNumber;
                $scope.NumberOfPalletString = response.data.Json.EnquiryList.NumberOfPalettes;
                $rootScope.CompanyId = response.data.Json.EnquiryList.SoldTo;
                $rootScope.BranchPlantCodeEdit = response.data.Json.EnquiryList.StockLocationId;
                $rootScope.CompanyMnemonic = response.data.Json.EnquiryList.CompanyMnemonic;
                $rootScope.DiscountAmount = response.data.Json.EnquiryList.DiscountAmount;
                $rootScope.DeliveryLocationId = response.data.Json.EnquiryList.ShipTo;
                $rootScope.DeliveryLocationCode = response.data.Json.EnquiryList.LocationCode;
                $rootScope.DeliveryArea = response.data.Json.EnquiryList.Area;
                $rootScope.TruckSizeId = response.data.Json.EnquiryList.TruckSizeId;
                $rootScope.TruckSize = response.data.Json.EnquiryList.TruckSize;
                $rootScope.TruckCapacity = (parseFloat(response.data.Json.EnquiryList.TruckCapacityWeight) * 1000);
                $rootScope.TruckCapacityInTone = $rootScope.TruckCapacity / 1000;
                $rootScope.TruckCapacityFullInTone = 0;
                $rootScope.TruckCapacityFullInPercentage = 0;
                if (response.data.Json.EnquiryList.ReturnPakageMaterialList !== undefined) {
                    $scope.ReturnPakageMaterialList = response.data.Json.EnquiryList.ReturnPakageMaterialList;
                }
                if (response.data.Json.EnquiryList.IsSelfCollectEnquiry === "SCO") {
                    $rootScope.IsSelfCollect = true;
                } else {
                    $rootScope.IsSelfCollect = false;
                }




                var requestforForPalletConsumptionAndValidation =
                {
                    ServicesAction: 'GetRuleForPalletConsumptionAndValidation',
                    CustomerId: response.data.Json.EnquiryList.SoldTo,
                    DeliveryLocationId: response.data.Json.EnquiryList.ShipTo,
                    TruckSizeId: response.data.Json.EnquiryList.TruckSizeId,

                };


                var jsonobjectForForPalletConsumptionAndValidation = {};
                jsonobjectForForPalletConsumptionAndValidation.Json = requestforForPalletConsumptionAndValidation;
                var responseForForPalletConsumptionAndValidation = GrRequestService.ProcessRequest(jsonobjectForForPalletConsumptionAndValidation);


                $q.all([

                    responseForForPalletConsumptionAndValidation
                ]).then(function (resp) {

                    debugger;

                    $scope.IsPalletSpaceLoadCheckVisibility = "1";
                    $scope.IsWeightLoadCheckVisibility = "1";
                    $scope.IsPalletLoadCheckValidation = true;
                    $scope.IsWeightLoadCheckValidation = true;


                    var responseFoLoadRuleForPalletConsumptionAndValidation = resp[0];


                    if (responseFoLoadRuleForPalletConsumptionAndValidation !== undefined) {
                        if (responseFoLoadRuleForPalletConsumptionAndValidation.data !== undefined) {

                            $scope.IsPalletSpaceLoadCheckVisibility = responseFoLoadRuleForPalletConsumptionAndValidation.data.Json.IsPalletSpaceLoadCheckVisibility;
                            $scope.IsWeightLoadCheckVisibility = responseFoLoadRuleForPalletConsumptionAndValidation.data.Json.IsWeightLoadCheckVisibility;
                            $scope.IsPalletLoadCheckValidation = responseFoLoadRuleForPalletConsumptionAndValidation.data.Json.IsPalletLoadCheckValidation;
                            $scope.IsWeightLoadCheckValidation = responseFoLoadRuleForPalletConsumptionAndValidation.data.Json.IsWeightLoadCheckValidation;

                        }
                    }


                });

                $scope.CurrentOrderGuid = generateGUID();

                $scope.EnquiryProductList = [];
                if (response.data.Json.EnquiryList.EnquiryProductList !== undefined) {
                    $scope.EnquiryProductList = response.data.Json.EnquiryList.EnquiryProductList;
                    for (var i = 0; i < $scope.EnquiryProductList.length; i++) {
                        $scope.EnquiryProductList[i].ProductQuantity = parseInt($scope.EnquiryProductList[i].ProductQuantity);
                        $scope.EnquiryProductList[i].PreviousProductQuantity = parseInt($scope.EnquiryProductList[i].ProductQuantity);
                        $scope.EnquiryProductList[i].OldProductQuantity = parseInt($scope.EnquiryProductList[i].ProductQuantity);
                        $scope.EnquiryProductList[i].EnquiryProductGUID = generateGUID();
                        $scope.EnquiryProductList[i].OrderGUID = $scope.CurrentOrderGuid;
                        $scope.EnquiryProductList[i].CurrentStockPosition = parseFloat($scope.EnquiryProductList[i].CurrentStockPosition);
                        if (response.data.Json.EnquiryList.EnquiryType == "RPM") {
                            $scope.EnquiryProductList[i].IsPalletRequiredToEdit = true;
                        }
                        $scope.EnquiryProductList[i].IsOrderItemEdited = false;
                        if ($scope.EnquiryProductList[i].IsPackingItem !== "1") {
                            var remainingProductStock = parseFloat(parseFloat($scope.EnquiryProductList[i].CurrentStockPosition) - parseFloat($scope.EnquiryProductList[i].UsedQuantityInEnquiry));
                            if (parseFloat($scope.EnquiryProductList[i].ProductQuantity) < remainingProductStock) {
                                $scope.EnquiryProductList[i].IsItemAvailableInStock = true;
                            } else {
                                $scope.EnquiryProductList[i].IsItemAvailableInStock = false;
                            }
                        }

                        if ($scope.EnquiryProductList[i].IsPackingItem === "1") {
                            $scope.EnquiryProductList[i].PaletteWeightDisplay = $scope.EnquiryProductList[i].CurrentItemTruckCapacityFullInTone;





                            //var requestforForPalletConsumptionAndValidation =
                            //{
                            //    ServicesAction: 'GetRuleValue',
                            //    CompanyId: $rootScope.CompanyId,
                            //    CompanyMnemonic: $rootScope.CompanyMnemonic,
                            //    DeliveryLocation: {
                            //        LocationId: $rootScope.DeliveryLocationId,
                            //        DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                            //        LocationCode: $rootScope.DeliveryLocationCode,

                            //    },
                            //    Company: {
                            //        CompanyId: $rootScope.CompanyId,
                            //        CompanyMnemonic: $rootScope.CompanyMnemonic,
                            //    },

                            //    Role: {
                            //        RoleName: $rootScope.RoleName,
                            //    },
                            //    Item: {
                            //        ItemId: parseInt($scope.EnquiryProductList[i].ItemId),
                            //        SKUCode: $scope.EnquiryProductList[i].ProductCode,
                            //    },

                            //    RuleType: 10,


                            //};


                            //var jsonobjectForForEditPalletValidation = {};
                            //    jsonobjectForForEditPalletValidation.Json = requestforForPalletConsumptionAndValidation;
                            //    var responseForForEditPalletAndValidation = GrRequestService.ProcessRequest(jsonobjectForForEditPalletValidation);


                            //$q.all([

                            //    responseForForEditPalletAndValidation
                            //]).then(function (resp) {

                            //    debugger;




                            //    var responseFoLoadRuleForEdtiPalletConsumptionAndValidation = resp[0];


                            //    if (responseFoLoadRuleForEdtiPalletConsumptionAndValidation !== undefined) {
                            //        if (responseFoLoadRuleForEdtiPalletConsumptionAndValidation.data !== undefined) {

                            //            $scope.IsPalletSpaceLoadCheckVisibility = responseFoLoadRuleForEdtiPalletConsumptionAndValidation.data.Json;


                            //        }
                            //    }


                            //});
                        }


                    }



                    $scope.EnquiryUnavailableStockProductList = $scope.EnquiryProductList.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode });
                    $scope.LoadEnquiryAmountDetails($scope.EnquiryProductList);
                    //$rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);

                }

                /*$scope.NotesListData = [];
                
                        var NoteJson = {
                            RoleId: $rootScope.RoleId,
                            ObjectId: response.data.Json.EnquiryList.EnquiryId,
                            ObjectType: 1220,
                            Note: response.data.Json.EnquiryList.Note,
                            CreatedBy: $rootScope.UserId
                        }

                        $scope.NotesListData.push(NoteJson);
                  */

                $scope.OrderData = [];
                $scope.EditEnquiryId = response.data.Json.EnquiryList.EnquiryId;
                $rootScope.EditedEnquiryId = response.data.Json.EnquiryList.EnquiryId;
                $rootScope.TruckCapacityPalettes = response.data.Json.EnquiryList.TruckCapacityPalettes;

                var orders = {
                    OrderGUID: $scope.CurrentOrderGuid,
                    EnquiryId: response.data.Json.EnquiryList.EnquiryId,
                    TotalWeight: 0,
                    TruckCapacity: response.data.Json.EnquiryList.TruckCapacityWeight,
                    TruckPallets: 0,
                    TotalProductPallets: 0,
                    EnquiryAutoNumber: response.data.Json.EnquiryList.EnquiryAutoNumber,
                    NumberOfPalettes: response.data.Json.EnquiryList.NumberOfPalettes,
                    PalletSpace: response.data.Json.EnquiryList.PalletSpace,
                    TruckWeight: response.data.Json.EnquiryList.TruckWeight,
                    SoldTo: response.data.Json.EnquiryList.CompanyId,
                    ShipTo: response.data.Json.EnquiryList.ShipTo,
                    ShipToCode: response.data.Json.EnquiryList.ShipToCode,
                    TruckCapacityPalettes: response.data.Json.EnquiryList.TruckCapacityPalettes,
                    RequestDate: response.data.Json.EnquiryList.RequestDate,
                    EnquiryDate: response.data.Json.EnquiryList.EnquiryDate,
                    TruckCapacityWeight: response.data.Json.EnquiryList.TruckCapacityWeight,
                    Capacity: response.data.Json.EnquiryList.Capacity,
                    IsRecievingLocationCapacityExceed: response.data.Json.EnquiryList.IsRecievingLocationCapacityExceed,
                    ReceivedCapacityPalettesCheck: 0,
                    ReceivedCapacityPalettes: 0,
                    CustomerId: response.data.Json.EnquiryList.CompanyId,
                    CompanyZone: response.data.Json.EnquiryList.CompanyZone,
                    CompanyType: response.data.Json.EnquiryList.CompanyType,
                    PONumber: response.data.Json.EnquiryList.PONumber,
                    SONumber: response.data.Json.EnquiryList.SONumber,
                    PickDateTime: response.data.Json.EnquiryList.PickDateTime,
                    BranchPlantCode: response.data.Json.EnquiryList.StockLocationId,
                    TruckCapacity: response.data.Json.EnquiryList.Capacity,
                    CurrentState: response.data.Json.EnquiryList.CurrentState,
                    NoOfDays: response.data.Json.EnquiryList.Field8,
                    EnquiryType: response.data.Json.EnquiryList.EnquiryType,
                    TypeOfWay: response.data.Json.EnquiryList.TypeOfWay,
                    IsTruckFull: true,
                    IsActive: true,
                    TruckSizeId: response.data.Json.EnquiryList.TruckSizeId,
                    RoleId: response.data.Json.EnquiryList.RoleId,
                    LoginId: response.data.Json.EnquiryList.loginId,
                    NoteList: response.data.Json.EnquiryList.NoteList,
                    OrderProductList: $scope.EnquiryProductList,
                    Priority: parseInt(response.data.Json.EnquiryList.Priority),
                    ReturnPakageMaterialList: $scope.ReturnPakageMaterialList,
                };
                $scope.OrderData.push(orders);



                $scope.LoadTruckSizeInformation(e, isAdvEdit);
                $rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);

            } else {
                $rootScope.Throbber.Visible = false;
            }
        });
    }

    $scope.LoadCreditCheckByEnquiryId = function (Id, e) {

        var requestData =
        {
            ServicesAction: 'LoadCreditCheckByEnquiryId',
            EnquiryId: Id,
            RoleId: $rootScope.RoleId,
            CultureId: $rootScope.CultureId

        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data !== undefined) {

                $scope.EnquiryCreditLimit = response.data.Json.EnquiryList.CreditLimit;
                $scope.EnquiryAvailableCreditLimit = response.data.Json.EnquiryList.AvailableCreditLimit;
                $scope.EnquiryCalculatedCreditLimit = response.data.Json.EnquiryList.CalculatedCredit;

                var outerContainerWidth = document.getElementById("SalesAdminApprovalGrid").clientWidth;
                outerContainerWidth = outerContainerWidth - 15;

                e.component.expandRow(e.data);
                $scope.PreviousExpandedRow = e.data;


                var elements = document.getElementsByClassName("EnquiryProductInfoClass");
                var elementId = "";
                for (var i = 0; i < elements.length; i++) {
                    elementId = elements[i].id;
                    elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
                }

            }
        });
    }
    //#endregion

    //#region Load Truck And Pallet Information By Rule 
    $scope.LoadTruckSizeInformation = function (e, isAdvEdit) {
        var requestAreaData =
        {
            ServicesAction: 'GetRuleValue',
            CompanyId: $rootScope.CompanyId,
            CompanyMnemonic: $rootScope.CompanyMnemonic,
            DeliveryLocation: {
                LocationId: $rootScope.DeliveryLocationId,
                DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                LocationCode: $rootScope.DeliveryLocationCode,
                Area: $rootScope.DeliveryArea,
            },
            Company: {
                CompanyId: $rootScope.CompanyId,
                CompanyMnemonic: $rootScope.CompanyMnemonic,
            },
            Supplier: {
                CompanyId: $scope.ActiveCompanyId,
                CompanyMnemonic: $scope.ActiveCompanyMnemonic,
            },
            RuleType: 5,
            TruckSize: {
                TruckSize: parseFloat($rootScope.TruckCapacityInTone)
            }

        };

        $scope.AreaPalettesCount = 0
        var jsonobjectArea = {};
        jsonobjectArea.Json = requestAreaData;
        GrRequestService.ProcessRequest(jsonobjectArea).then(function (arearesponse) {


            var arearesponseStr = arearesponse.data.Json;
            if (arearesponseStr.RuleValue != '' || arearesponseStr.RuleValue != undefined) {
                var rulevalue = parseInt(arearesponseStr.RuleValue);
                $scope.AreaPalettesCount = rulevalue;
            }
            if ($scope.AreaPalettesCount > 0) {
                $rootScope.TruckCapacityPalettes = $scope.AreaPalettesCount;
            }

            $rootScope.buindingPalettes = []
            for (var i = 0; i < $rootScope.TruckCapacityPalettes; i++) {
                var palettes = {
                    PalettesWidth: 0
                }
                $rootScope.buindingPalettes.push(palettes);
            }

            if ($rootScope.buindingPalettes.length > 0) {
                $rootScope.IsPalettesRequired = true;
            } else {
                $rootScope.IsPalettesRequired = false;
            }








            var space = 100 - ($rootScope.buindingPalettes.length - 1);
            var width = space / $rootScope.buindingPalettes.length;
            $rootScope.PalettesWidth.width = width + "%";

            var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === $rootScope.EditedEnquiryId; });
            if (currentOrder.length > 0) {
                if (currentOrder[0].OrderProductList.length > 0) {
                    currentOrder[0].TruckCapacity = $rootScope.TruckCapacityInTone;
                    currentOrder[0].TruckSizeId = $rootScope.TruckSizeId;
                    currentOrder[0].ShipTo = $rootScope.DeliveryLocationId;
                    currentOrder[0].TruckName = $rootScope.TruckSize;
                    currentOrder[0].DeliveryLocationName = $rootScope.DeliveryLocationName;

                    var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
                    var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');

                    var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
                    truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);


                    $rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
                    $rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);

                    for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                        if (i < parseInt($rootScope.buindingPalettes.length)) {
                            $rootScope.buindingPalettes[i].PalettesWidth = 100;
                        }
                    }

                    var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
                    var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

                    //if ($rootScope.IsSelfCollect === false) {
                    //    if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight) {
                    //        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                    //        return false;

                    //    } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < truckTotalPalettes) {
                    //        var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                    //        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
                    //        return false;
                    //    }
                    //}

                }
            }
            var totalWeightWithPalettes = 0;
            var totalWeightWithBuffer = 0;

            var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
            if (bufferWeight !== "") {
                totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
            }
            var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
            if ($rootScope.IsPalettesRequired) {
                if (weightPerPalettes !== "") {
                    totalWeightWithPalettes = (weightPerPalettes * (truckTotalPalettes));
                }
            }
            $scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $rootScope.TruckCapacity, $rootScope.TruckCapacityPalettes, totalWeightWithPalettes);


            if (isAdvEdit === 1) {
                $rootScope.Throbber.Visible = false;
                $scope.AdvanceEdit($scope.CurrentOrderGuid);
            }
            else {
                var outerContainerWidth = document.getElementById("SalesAdminApprovalGrid").clientWidth;
                outerContainerWidth = outerContainerWidth - 15;
                e.component.expandRow(e.data);
                $scope.PreviousExpandedRow = e.data;
                $scope.CurrentExpandedRow = e;
                $rootScope.Throbber.Visible = false;

                var elements = document.getElementsByClassName("EnquiryProductInfoClass");
                var elementId = "";
                for (var i = 0; i < elements.length; i++) {
                    elementId = elements[i].id;
                    elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
                }
            }


            //var rowHeight = 35.2;
            //var scrolltotop = Math.ceil(rowHeight * parseFloat(e.rowIndex));
            //var scrollContainer = $("#SalesAdminApprovalGrid").find(".dx-scrollable").first().dxScrollable("instance");
            //scrollContainer.scrollTo({ top: scrolltotop });
        });

    }
    //#endregion

    //#region Load Enquiry Amount Information
    $scope.LoadEnquiryAmountDetails = function (enquiryProduct) {

        if (enquiryProduct.length > 0) {

            enquiryProduct = enquiryProduct.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode; });
            if (enquiryProduct.length > 0) {


                $scope.EnquiryTotalAmount = 0;
                $scope.EnquiryCashDiscount = 0;
                $scope.EnquiryTotalTax = 0;
                $scope.EnquiryNetAmount = 0;
                $scope.EnquiryGrandTotalAmount = 0;
                $scope.EnquiryDepositeAmount = 0;
                $scope.AvailableCreditLimitAmount = 0;

                $scope.GetTotalAmountOfEnquiry(enquiryProduct);
                $scope.GetCashDiscountOnProducts(enquiryProduct);
                $scope.GetTotalNetAmountOfEnquiry(enquiryProduct);
                $scope.GetTotalTaxOfEnquiry(enquiryProduct);
                $scope.LoadEnquiryTotalDepositeAmount(enquiryProduct);
                $scope.GetGrandTotalAmountOfEnquiry(enquiryProduct);

                $scope.AvailableCreditLimitAmount = Number($scope.AvailableCreditLimit) - Number($scope.EnquiryGrandTotalAmount);

            } else {

                $scope.EnquiryTotalAmount = 0;
                $scope.EnquiryCashDiscount = 0;
                $scope.EnquiryTotalTax = 0;
                $scope.EnquiryNetAmount = 0;
                $scope.EnquiryGrandTotalAmount = 0;
                $scope.EnquiryDepositeAmount = 0;
                $scope.AvailableCreditLimitAmount = 0;

                $scope.AvailableCreditLimitAmount = Number($scope.AvailableCreditLimit) - Number($scope.EnquiryGrandTotalAmount);
            }
        } else {

            $scope.EnquiryTotalAmount = 0;
            $scope.EnquiryCashDiscount = 0;
            $scope.EnquiryTotalTax = 0;
            $scope.EnquiryNetAmount = 0;
            $scope.EnquiryGrandTotalAmount = 0;
            $scope.EnquiryDepositeAmount = 0;
            $scope.AvailableCreditLimitAmount = 0;

            $scope.AvailableCreditLimitAmount = Number($scope.AvailableCreditLimit) - Number($scope.EnquiryGrandTotalAmount);
        }
    }
    //#endregion

    //#region Load Enquiry Deposite Amount 

    $scope.LoadEnquiryTotalDepositeAmount = function (enquiryProductList) {

        for (var i = 0; i < enquiryProductList.length; i++) {
            if (enquiryProductList[i].ItemTotalDepositeAmount !== "" && enquiryProductList[i].ItemTotalDepositeAmount !== undefined && enquiryProductList[i].ItemTotalDepositeAmount !== null) {
                $scope.EnquiryDepositeAmount = $scope.EnquiryDepositeAmount + parseFloat(enquiryProductList[i].ItemTotalDepositeAmount);
            }
        }
        return $scope.EnquiryDepositeAmount;

    }

    //#endregion



    //#region Load Enquiry Total Amount 

    $scope.GetTotalAmountOfEnquiry = function (enquiryProductList) {
        for (var i = 0; i < enquiryProductList.length; i++) {
            if (enquiryProductList[i].ItemPrices !== "" && enquiryProductList[i].ItemPrices !== undefined && enquiryProductList[i].ItemPrices !== null) {
                $scope.EnquiryTotalAmount = $scope.EnquiryTotalAmount + parseFloat(enquiryProductList[i].ItemPrices);
            }

        }
        return $scope.EnquiryTotalAmount;
    }
    //#endregion

    //#region Load Enquiry Product Cash Discount

    $scope.GetCashDiscountOnProducts = function (enquiryProductList) {

        for (var i = 0; i < enquiryProductList.length; i++) {
            if (enquiryProductList[i].DiscountAmount !== "" && enquiryProductList[i].DiscountAmount !== undefined && enquiryProductList[i].DiscountAmount !== null) {
                $scope.EnquiryCashDiscount = $scope.EnquiryCashDiscount + parseFloat(enquiryProductList[i].DiscountAmount);
            }
        }
        return $scope.EnquiryCashDiscount;
    }
    //#endregion

    //#region Load Enquiry Total Tax 

    $scope.GetTotalTaxOfEnquiry = function () {

        $scope.EnquiryTotalTax = percentage(parseFloat($scope.EnquiryNetAmount), $scope.ItemTaxInPec);
        return $scope.EnquiryTotalTax;
    }
    //#endregion

    //#region Load Enquiry Net Amount

    $scope.GetTotalNetAmountOfEnquiry = function () {
        $scope.EnquiryNetAmount = parseFloat($scope.EnquiryTotalAmount) - (parseFloat($scope.DiscountAmount) + parseFloat($scope.EnquiryCashDiscount));
        return $scope.EnquiryNetAmount;
    }
    //#endregion

    //#region Load Enquiry Grand Total Amount 

    $scope.GetGrandTotalAmountOfEnquiry = function (enquiryProductList) {
        $scope.EnquiryGrandTotalAmount = parseFloat($scope.EnquiryNetAmount) + parseFloat($scope.EnquiryTotalTax) + parseFloat($scope.EnquiryDepositeAmount);

        return $scope.EnquiryGrandTotalAmount;
    }
    //#endregion


    //#region  Selected Multiple enquiry for approve order

    $scope.ApproveSelectedEnquiry = function () {

        debugger;
        if ($scope.SalesAdminApprovalList !== undefined) {
            var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
            if (enquiryList.length > 0) {

                $scope.ApproveEnquiry(enquiryList);

            } else {

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
            }
        }
    }

    //#endregion  Selected Multiple enquiry for approve order



    //#region Final Save for  Selected Multiple/Single enquiry and Validation for approve order


    function changeIntoProperDate(ExpectedTime) {

        var getDate = ExpectedTime.split('T');
        var dataArray = getDate[0].split('-');

        console.log('Day:' + dataArray[2]);
        console.log('Month:' + dataArray[1]);
        console.log('Year:' + dataArray[0]);


        var Day = parseInt(dataArray[2]);
        var Month = parseInt(dataArray[1]);
        var Year = parseInt(dataArray[0]);

        var ExpectedTimedate = new Date(Year, Month - 1, Day);

        return ExpectedTimedate;
    }


    $scope.ApproveEnquiry = function (enquiryList) {
        debugger;
        $scope.IsDisableforInquiryApprovebtn = true;
        var isValid = true;
        var isValidMessage = "";
        debugger;
        var enquiryAutoNumberList = "";
        try {



            for (var i = 0; i < enquiryList.length; i++) {


                if (enquiryList[i].EnquiryType == 'RPM') {
                    if (enquiryList[i].RelatedEnquiryNumber == "") {
                        var attachmentPresent = $scope.AttachmentList.filter(function (el) { return el.EnquiryId === enquiryList[i].EnquiryId; });
                        if (attachmentPresent.length == 0) {
                            isValid = false;
                            isValidMessage = String.format($rootScope.resData.res_OMInquiryPage_PleaseAttachedFile, enquiryList[i].EnquiryAutoNumber);
                            break;
                        }
                    }
                }
                if ($scope.IsBranchPlantValidationAvailable === true) {


                    if (enquiryList[i].CollectionLocationCode === "" || enquiryList[i].CollectionLocationCode === undefined || enquiryList[i].CollectionLocationCode === null) {
                        isValid = false;
                        isValidMessage = String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCodeEnquiryList, enquiryList[i].EnquiryAutoNumber);
                        break;
                    }

                    if (enquiryList[i].CollectionLocationName === "" || enquiryList[i].CollectionLocationName === undefined || enquiryList[i].CollectionLocationName === null) {
                        isValid = false;
                        isValidMessage = String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCodeAndTickEnquiryList, enquiryList[i].EnquiryAutoNumber);
                        break;
                    }


                    if ((enquiryList[i].CarrierCode === "0" || enquiryList[i].CarrierCode === undefined || enquiryList[i].CarrierCode === null || enquiryList[i].CarrierCode === "") && (enquiryList[i].IsSelfCollect === "0" || enquiryList[i].IsSelfCollect === false)) {
                        isValid = false;
                        isValidMessage = String.format($rootScope.resData.res_OMInquiryPage_SelectCarrierEnquiryList, enquiryList[i].EnquiryAutoNumber);
                        break;
                    }

                    if ((enquiryList[i].CarrierName === undefined || enquiryList[i].CarrierName === null || enquiryList[i].CarrierName === "") && (enquiryList[i].IsSelfCollect === "0" || enquiryList[i].IsSelfCollect === false)) {
                        isValid = false;
                        isValidMessage = String.format($rootScope.resData.res_OMInquiryPage_SelectCarrierAndTickEnquiryList, enquiryList[i].EnquiryAutoNumber);
                        break;
                    }

                    var today = new Date();
                    today.setHours(0, 0, 0, 0);

                    var pickupdate = enquiryList[i].PickDateTime;


                    pickupdate = changeIntoProperDate(pickupdate);

                    var promiseDate = enquiryList[i].PromisedDate;
                    promiseDate = changeIntoProperDate(promiseDate);

                    if (pickupdate < today) {
                        isValid = false;
                        isValidMessage = String.format($rootScope.resData.res_SalesAdminApprovalGrid_PickupDateValidationEnquiryList, enquiryList[i].EnquiryAutoNumber);
                        break;
                    }

                    if (promiseDate < today) {
                        isValid = false;
                        isValidMessage = String.format($rootScope.resData.res_SalesAdminApprovalGrid_PromiseDateValidationEnquiryList, enquiryList[i].EnquiryAutoNumber);
                        break;
                    }

                }





                if (enquiryList[i].RelatedEnquiryNumber != "") {
                    enquiryAutoNumberList = enquiryAutoNumberList + "," + enquiryList[i].RelatedEnquiryNumber;
                }
                enquiryAutoNumberList = enquiryAutoNumberList + "," + enquiryList[i].EnquiryAutoNumber;
                enquiryAutoNumberList = enquiryAutoNumberList.replace(/^,/, '');

            }



            if (isValid) {

                var settingValue = 0;
                if ($sessionStorage.AllSettingMasterData != undefined) {
                    var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === "DefaultLeadTime"; });
                    if (settingMaster.length > 0) {
                        settingValue = settingMaster[0].SettingValue;
                    }
                }

                $rootScope.Throbber.Visible = true;

                var requestData =
                {
                    ServicesAction: 'ApproveEnquiry',
                    EnquiryAutoNumber: enquiryAutoNumberList,
                    UserName: $rootScope.UserName,
                    UserId: $rootScope.UserId,
                    DefaultLeadTime: settingValue,
                    AttachmentList: $scope.AttachmentList

                };


                //  var stringfyjson = JSON.stringify(requestData);
                var consolidateApiParamater =
                {
                    Json: requestData,
                };
                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


                    $scope.IsDisableforInquiryApprovebtn = false;
                    $rootScope.Throbber.Visible = false;
                    $scope.AttachmentList = [];
                    $scope.RefreshDataGrid();
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_AwaitingSONumber), '', 3000);

                });
            }
            else {
                $scope.IsDisableforInquiryApprovebtn = false;
                $rootScope.ValidationErrorAlert(isValidMessage, '', 3000);
            }

        } catch (e) {
            $scope.IsDisableforInquiryApprovebtn = false;
            $rootScope.ValidationErrorAlert(e.message, '', 3000);
        }
    }

    //#endregion Final Save for  Selected Multiple/Single enquiry and Validation for approve order



    //#region Single enquiry for approve order

    $scope.ApproveEnquiryByEnquiryNumber = function (enquiryNumber) {
        debugger;



        var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryAutoNumber === enquiryNumber && el.CurrentState !== "999"; });

        if (enquiryList.length > 0) {




            $scope.ApproveEnquiry(enquiryList);
        }
    }

    //#endregion Single enquiry for approve order



    //#region Reject Enquiry Event and Function

    $scope.RejectEnquiryByEnquiryNumber = function (enquiryNumber) {

        debugger;
        //if ($scope.IsInEditMode && $scope.IsInEditModeForValidation) {
        var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryAutoNumber === enquiryNumber; });
        if (enquiryList.length > 0) {
            var objectList = [];

            for (var i = 0; i < enquiryList.length; i++) {
                debugger;

                var object = {};
                object.ObjectId = enquiryList[i].EnquiryId;

                objectList.push(object);
            }

            var mainObject = {};
            mainObject.ObjectList = objectList;
            mainObject.ObjectType = "Enquiry";
            mainObject.ReasonCodeEventName = "RejectEnquiry";
            mainObject.FunctionName = "RejectEnquiry";
            mainObject.FunctionParameter = enquiryList;
            $rootScope.LoadReasonCode("ReasonCode");
            $rootScope.OpenReasoncodepopup(mainObject);
        }
        //}
        //else {
        //   $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApprovalGrid_AccordionInEditMode), 'error', 8000);
        //}
    }

    $scope.RejectSelectedEnquiry = function () {
        debugger;
        debugger;
        if ($scope.SalesAdminApprovalList !== undefined) {
            var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
            if (enquiryList.length > 0) {
                //for (var i = 0; i < enquiryList.length; i++) {
                //    debugger;
                //    $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId + "," + enquiryList[i].EnquiryId;
                //    $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId.replace(/^,/, '');
                //}

                var objectList = [];

                var workFlowCode = "";

                for (var i = 0; i < enquiryList.length; i++) {
                    debugger;

                    var object = {};
                    object.ObjectId = enquiryList[i].EnquiryId;

                    objectList.push(object);

                    workFlowCode = enquiryList[i].WorkFlowCode;

                }

                var mainObject = {};
                mainObject.ObjectList = objectList;
                mainObject.ObjectType = "Enquiry";
                mainObject.ReasonCodeEventName = "RejectEnquiry";
                mainObject.FunctionName = "RejectEnquiry";
                mainObject.FunctionParameter = enquiryList;

                if (workFlowCode === "B2BAPPFlow") {
                    $rootScope.LoadReasonCode("RejectEnquiry");
                } else {
                    $rootScope.LoadReasonCode("ReasonCode");
                }

                $rootScope.OpenReasoncodepopup(mainObject);

                // $rootScope.OpenReasoncodepopup(enquiryList, "RejectEnquiry");
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);
            }
        }

    }

    $scope.RejectEnquiry = function (enquiryList) {

        var requestData =
        {
            ServicesAction: 'RejectEnquiry',
            EnquiryList: enquiryList,
        };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $scope.RefreshDataGrid();
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_EnquiryRejected), '', 3000);


        });
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
        var dataGrid = $("#SalesAdminApprovalGrid").dxDataGrid("instance");
        dataGrid.refresh();


        //
        //dataGrid = dataGrid.option("dataSource");
        //if (dataGrid != undefined) {
        //    dataGrid.store.load();
        //}
    }

    //#endregion

    //#region Export To Excel
    $scope.ExportToExcelSalesAdminApprovalData = function () {

        if ($scope.GridColumnList.length > 0) {
            $rootScope.Throbber.Visible = true;
            $scope.RequestDataFilter.ServicesAction = "GetAllEnquiryDetailsForExportforOM";
            $scope.RequestDataFilter.ColumnList = $scope.GridColumnList.filter(function (el) { return el.IsExportAvailable === '1'; });


            var jsonobject = {};
            jsonobject.Json = $scope.RequestDataFilter;
            jsonobject.Json.IsExportToExcel = '1';

            GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {

                var byteCharacters1 = response.data;
                if (response.data !== undefined) {
                    var byteCharacters = response.data;
                    var blob = new Blob([byteCharacters], {
                        type: "application/Pdf"
                    });

                    if (blob.size > 0) {
                        var filName = "EnquiryList_" + getDate() + ".xlsx";
                        saveAs(blob, filName);
                        $rootScope.Throbber.Visible = false;
                    } else {
                        $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                        $rootScope.Throbber.Visible = false;
                    }
                }
                else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                    $rootScope.Throbber.Visible = false;
                }
            });
        }
    }


    $scope.ExportToExcelSalesAdminApprovalDataV2 = function () {


        debugger;
        if ($scope.GridColumnList.length > 0) {
            $rootScope.Throbber.Visible = true;

            $scope.RequestDataFilter.ColumnList = $scope.GridColumnList.filter(function (el) { return el.IsExportAvailable === '1' && el.PropertyName !== 'CheckedEnquiry'; });




            var enquiryDTO = {
                "RoleId": parseInt($rootScope.RoleId),
                "CultureId": parseInt($rootScope.CultureId),
                "PageName": page,
                "PageControlName": PageControlName,
                "LoginId": parseInt($rootScope.UserId),
                "EnquirySearchParameterList": $scope.EnquirySearchParameterList,
                "whereClause": "",
                "IsExportToExcel": true,
                "EnquiryGridColumnList": $scope.RequestDataFilter.ColumnList,
            };



            ManageEnquiryService.ExportToExcelForEnquiryList(enquiryDTO).then(function (response) {

                debugger;

                //var data = response.data;

                ///var blob = b64toBlob(data, 'application/octet-stream');
                //var filName = "OrderList_" + getDate() + ".xlsx";
                //saveAs(blob, filName);

                var byteCharacters1 = response.data;





                if (response.data !== undefined) {


                    var blob = b64toBlob(byteCharacters1, 'application/octet-stream');

                    if (blob.size > 0) {
                        var filName = "EnquiryList_" + getDate() + ".csv";
                        saveAs(blob, filName);
                        $rootScope.Throbber.Visible = false;
                    } else {
                        $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                        $rootScope.Throbber.Visible = false;
                    }
                }
                else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                    $rootScope.Throbber.Visible = false;
                }
            });
        }
    }



    $scope.ExportToExcelSalesAdminApprovalDataDetailsV2 = function () {


        debugger;
        if ($scope.GridColumnList.length > 0) {
            $rootScope.Throbber.Visible = true;

            $scope.RequestDataFilter.ColumnList = $scope.GridColumnList.filter(function (el) { return el.IsExportAvailable === '1' && el.PropertyName !== 'CheckedEnquiry'; });


            //var enquiryDTO = {
            //    "RoleId": parseInt($rootScope.RoleId),
            //    "CultureId": parseInt($rootScope.CultureId),
            //    "PageName": page,
            //    "PageControlName": PageControlName,
            //    "LoginId": parseInt($rootScope.UserId),
            //    "EnquirySearchParameterList": $scope.EnquirySearchParameterList,
            //    "whereClause": "",
            //    "IsExportToExcel": true,
            //    "EnquiryGridColumnList": $scope.RequestDataFilter.ColumnList,
            //};

            var enquiryDTO = {
                "RoleId": parseInt($rootScope.RoleId),
                "CultureId": parseInt($rootScope.CultureId),
                "OrderBy": OrderBy,
                "OrderByCriteria": OrderByCriteria,
                "PageName": page,
                "PageControlName": PageControlName,
                "LoginId": parseInt($rootScope.UserId),
                "EnquirySearchParameterList": $scope.EnquirySearchParameterList,
                "whereClause": "",
                "IsExportToExcel": true,
                "EnquiryGridColumnList": $scope.RequestDataFilter.ColumnList,
            };



            ManageEnquiryService.ExportToExcelForEnquiryDetailList(enquiryDTO).then(function (response) {

                debugger;

                //var data = response.data;

                ///var blob = b64toBlob(data, 'application/octet-stream');
                //var filName = "OrderList_" + getDate() + ".xlsx";
                //saveAs(blob, filName);

                var byteCharacters1 = response.data;





                if (response.data !== undefined) {


                    var blob = b64toBlob(byteCharacters1, 'application/octet-stream');

                    if (blob.size > 0) {
                        var filName = "EnquiryDetailList_" + getDate() + ".csv";
                        saveAs(blob, filName);
                        $rootScope.Throbber.Visible = false;
                    } else {
                        $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                        $rootScope.Throbber.Visible = false;
                    }
                }
                else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                    $rootScope.Throbber.Visible = false;
                }
            });
        }
    }
    //#endregion


    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512; // sliceSize represent the bytes to be process in each batch(loop), 512 bytes seems to be the ideal slice size for the performance wise 

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    //#region Update Bulk Branch Plant
    $ionicModal.fromTemplateUrl('templates/ChangeBranchPlantCode.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ChangeBranchPlantCodePopup = modal;
    });

    $scope.OpenChangeBranchPlantCodePopup = function (enquiryDetails, eventName) {
        $rootScope.EnquiryDetailsForAction = enquiryDetails;
        $rootScope.ReasonCodeEventName = eventName;
        $scope.ChangeBranchPlantCodePopup.show();
        $rootScope.Throbber.Visible = false;
    }

    $scope.CloseChangeBranchPlantCodePopup = function () {
        $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry = '';
        if ($scope.SearchControl.InputCollection !== undefined) {
            $scope.SearchControl.InputCollection = "";
        }
        $scope.ChangeBranchPlantCodePopup.hide();
    }

    $scope.IsBranchPlantAlreadyAssinged = true;



    $scope.ChangeSelectedEnquiryBranchPlant = function () {
        debugger;
        $rootScope.LoadCollectionLocationByConfiguration();
        $rootScope.LoadReasonCode("ChangeBranchPlantReason");
        var isBranchPlantChange = false;
        $rootScope.Throbber.Visible = true;

        var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
        if (enquiryDetails.length > 0) {

            for (var i = 0; i < enquiryDetails.length; i++) {

                $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId + "," + enquiryDetails[i].EnquiryId;
                $rootScope.ReasonCodeEnquiryId = $rootScope.ReasonCodeEnquiryId.replace(/^,/, '');

                if (isBranchPlantChange === false) {

                    if (enquiryDetails[i].CollectionLocationCode === "" || enquiryDetails[i].CollectionLocationCode === undefined || enquiryDetails[i].CollectionLocationCode === null) {
                        $scope.IsBranchPlantAlreadyAssinged = false;
                        isBranchPlantChange = true;
                    }
                    else {
                        $scope.IsBranchPlantAlreadyAssinged = true;
                        isBranchPlantChange = true;
                    }
                }

            }

            $scope.OpenChangeBranchPlantCodePopup(enquiryDetails, "UpdateBranchPlant");
            $rootScope.Throbber.Visible = false;

        } else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectEnquiry), 'error', 3000);

        }
    }

    $scope.SaveBranchPlantForSelectedEnquiry = function () {

        if ($scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry !== "") {
            $rootScope.Throbber.Visible = true;
            $scope.SelectedEnquiryId = "";
            var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
            if (enquiryDetails.length > 0) {
                for (var i = 0; i < enquiryDetails.length; i++) {
                    $scope.SelectedEnquiryId = $scope.SelectedEnquiryId + ',' + enquiryDetails[i].EnquiryId;
                }
                $scope.SelectedEnquiryId = $scope.SelectedEnquiryId.substr(1);
                if ($scope.SelectedEnquiryId !== "") {

                    var objectList = [];

                    for (var i = 0; i < enquiryDetails.length; i++) {


                        var object = {};
                        object.ObjectId = enquiryDetails[i].EnquiryId;

                        objectList.push(object);
                    }

                    var mainObject = {};
                    mainObject.ObjectList = objectList;
                    mainObject.ObjectType = "Enquiry";
                    mainObject.ReasonCodeEventName = "UpdateBranchPlant";
                    mainObject.FunctionName = "UpdateBranchPlantSelectedEnquiry";
                    mainObject.FunctionParameter = enquiryDetails;

                    if ($scope.IsBranchPlantAlreadyAssinged === true) {
                        $rootScope.SaveReasonCode(mainObject);
                    } else {

                        $scope[mainObject.FunctionName](mainObject.FunctionParameter);

                        $rootScope.Throbber.Visible = false;
                        $rootScope.CloseReasoncodepopup();
                    }

                }
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);
        }
    }

    $scope.UpdateBranchPlantSelectedEnquiry = function (orderDetails) {


        var selectedOrderId = "";

        for (var i = 0; i < orderDetails.length; i++) {
            selectedOrderId = selectedOrderId + ',' + orderDetails[i].EnquiryId;
        }
        selectedOrderId = selectedOrderId.substr(1);


        var enquiryList = {
            BranchPlantName: $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry,
            EnquiryId: selectedOrderId,
        }
        var requestData =
        {
            ServicesAction: 'UpdateBranchPlantForSelectedEnquiry',
            EnquiryDetailList: enquiryList
        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            $scope.CloseChangeBranchPlantCodePopup();
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_BranchPlantUpdated), '', 3000);
            $scope.RefreshDataGrid();
        });
    }
    //#endregion

    //#region On Load Grid Configuration 
    $scope.GridConfigurationLoaded = false;
    $scope.LoadGridByConfiguration = function (e) {


        console.log("9" + new Date());

        var dataGrid = $("#SalesAdminApprovalGrid").dxDataGrid("instance");

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

    //#endregion 

    //#region Note Popup Intialization And Load Note Infomation.

    $scope.NoteVariable = {
        NoteText: ''
    }

    $scope.AddNotesModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/AddNotesForObject.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {

            $scope.AddNotesPopup = modal;
        });
    }
    $scope.AddNotesModalPopup();
    $scope.OpenAddNotesModalPopup = function () {

        $scope.AddNotesPopup.show();
    }
    $scope.CloseAddNotesModalPopup = function () {

        $scope.AddNotesPopup.hide();
    }


    $scope.OpenModelPoppupNote = function (enquiryId) {
        $scope.NotesOrderId = enquiryId;

        var requestData =
        {
            ServicesAction: 'GetNoteByObjectId',
            ObjectId: enquiryId,
            RoleId: $rootScope.RoleId,
            ObjectType: 1220,
            UserId: $rootScope.UserId

        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (NotesResponse) {

            var NotesResponsedata = NotesResponse.data;

            $scope.OpenAddNotesModalPopup();

            if (NotesResponsedata.Json !== undefined) {
                var notesData = NotesResponsedata.Json.NotesList;

                if (notesData.length > 0) {
                    $scope.NoteVariable.NoteText = notesData[0].Note;
                } else {
                    $scope.NoteVariable.NoteText = "";
                }

            }
            else {
                $scope.NoteVariable.NoteText = "";
            }
        });
    }

    //#endregion




    $scope.UpdateNote = function () {


        var Notes = [];
        if ($scope.NoteVariable.CustomerServiceNoteText !== "") {
            var noteText = $scope.NoteVariable.NoteText + " " + $scope.NoteVariable.CustomerServiceNoteText;
            var noteJson = {
                RoleId: $rootScope.RoleId,
                ObjectId: $scope.NotesOrderId,
                ObjectType: 1220,
                Note: noteText,
                CreatedBy: $rootScope.UserId
            }

            Notes.push(noteJson);

            if (Notes.length > 0) {

                var Note =
                {
                    ServicesAction: "SaveNotes",
                    NoteList: Notes
                }

                var jsonobject = {};
                jsonobject.Json = Note;



                GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    $scope.NoteVariable.CustomerServiceNoteText = "";
                    $scope.CloseAddNotesModalPopup();
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryPage_NotesUpdated), 'error', 3000);
                    $scope.NotesOrderId = 0;
                    $scope.RefreshDataGrid();

                });
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_NoteEnterValidation), 'error', 3000);
        }

    }


    //#region change language 
    $rootScope.GridRecallForStatus = function () {

        $scope.IsRefreshGrid = true;
        $scope.GridConfigurationLoaded = false;
        $scope.LoadGridConfigurationData();
    }
    //#endregion

    //#region Edit and Remove Enquiry Products
    $scope.IsEnquiryEdit = false;
    $scope.RemoveEnquiryProductId = 0;

    $scope.ConfirmationMessageModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/ConfirmationMessageModalPopup.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {

            $scope.ConfirmationMessageModal = modal;
        });
    }
    $scope.ConfirmationMessageModalPopup();
    $scope.OpenConfirmationMessageModalPopup = function () {

        $scope.ConfirmationMessageModal.show();
    }
    $scope.CloseConfirmationMessageModalPopup = function () {

        $scope.ConfirmationMessageModal.hide();
    }


    $scope.EditEnquiryByEnquiry = function (enquiryId) {

        if ($scope.IsEnquiryEdit === true) {

            //var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === enquiryId; });
            //if (currentOrder.length > 0) {
            //    if (currentOrder[0].OrderProductList !== undefined) {
            //        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            //            currentOrder[0].OrderProductList[i].ProductQuantity = parseInt(currentOrder[0].OrderProductList[i].PreviousProductQuantity);
            //        }
            //    }
            //}
            //$scope.ReloadGraph($scope.OrderData, 0);
            $scope.IsEnquiryEdit = false;
            $scope.LoadEnquiryProductByEnquiryId(enquiryId, $scope.CurrentExpandedRow);


        }
        else {
            $scope.IsEnquiryEdit = true;
        }

    }


    $scope.EditProduct = function (enquiryId, itemId, EnquiryProductGUID) {
        debugger;
        $scope.PaletteWeightDisplay = 0;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === enquiryId; });

        if (currentOrder.length > 0) {
            if (currentOrder[0].OrderProductList.length > 0) {
                var productNameStr = currentOrder[0].OrderProductList.filter(function (el) { return el.EnquiryProductGUID === EnquiryProductGUID && parseInt(el.GratisOrderId) === 0; });

                $scope.IsEnquiryEdit = true;

                $scope.IsItemEdit = true;
                $scope.IsAccordianOpen = false;
                productNameStr[0].IsOrderItemEdited = true;
                $scope.ItemPrices = parseFloat(productNameStr[0].ItemPricesPerUnit);
                $scope.ItemId = productNameStr[0].ItemId;
                $scope.EnquiryProductGUID = EnquiryProductGUID;
                $scope.IsInEditMode = true;

                $scope.disableInput = true;

                $scope.ItemField.EditableItemPrice = parseFloat(productNameStr[0].ItemPricesPerUnit);
                $scope.ItemField.inputItemsQty = parseInt(productNameStr[0].ProductQuantity);
                $scope.ItemField.ItemEditQty = parseInt(productNameStr[0].ProductQuantity);
                $scope.Allocation = productNameStr[0].Allocation;
                $scope.IsItemLayerAllow = productNameStr[0].IsItemLayerAllow;

                $scope.selectedItemEvent(itemId, enquiryId);

            }
        }


    }




    $scope.RemoveProductFromEnquiry = function (enquiryId, enquiryProductId) {

        var enquiryProducts = $scope.OrderData[0].OrderProductList.filter(function (el) { return el.EnquiryId === enquiryId && el.EnquiryProductGUID === enquiryProductId });
        if (enquiryProducts.length > 0) {
            $scope.RemoveEnquiryProductId = enquiryProductId;
            $scope.OpenConfirmationMessageModalPopup();
        } else {

        }
    }

    $scope.RemoveEnquiryProduct = function () {
        debugger;
        var productList = $scope.OrderData[0].OrderProductList.filter(function (el) { return el.EnquiryProductGUID === $scope.RemoveEnquiryProductId });
        if (productList.length > 0) {
            var ItemId = productList[0].ItemId;
            var itemcode = productList[0].ProductCode;
            $scope.OrderData[0].OrderProductList = $scope.OrderData[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 30 || el.EnquiryProductGUID !== $scope.RemoveEnquiryProductId });
            if (($scope.IsPalletLoadCheckValidation === true || $scope.IsWeightLoadCheckValidation === true) && $rootScope.IsSelfCollect === false) {
                $scope.OrderData[0].IsTruckFull = false;
            }
            $scope.RemovePromotionItem($scope.OrderData, itemcode);

            if ($scope.OrderData[0].OrderProductList.length === 1) {
                if ($scope.OrderData[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                    $scope.OrderData[0].OrderProductList = [];
                }
            }

            $scope.ReloadGraph($scope.OrderData, 0);
            $scope.LoadEnquiryAmountDetails($scope.OrderData[0].OrderProductList);
            $rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);
            //$scope.IsInEditMode = true;
            //$scope.IsInEditModeForValidation = true;
            $scope.IsAccordianOpen = false;
            $scope.CloseConfirmationMessageModalPopup();
        }
    }



    //#endregion



    $scope.UpdateEnquiryByEnquiry = function (enquiryId) {
        $scope.EnquiryList = [];
        $rootScope.Throbber.Visible = true;

        if ($scope.OrderData[0].OrderProductList.length > 0) {
            var equirydata = {};
            equirydata.EnquiryId = $scope.OrderData[0].OrderProductList[0].EnquiryId;
            equirydata.UpdatedBy = $rootScope.UserId;
            equirydata.TotalPrice = $scope.OrderData[0].EnquiryGrandTotalAmount;
            equirydata.OrderProductList = [];
            for (var i = 0; i < $scope.OrderData[0].OrderProductList.length; i++) {
                var equiryProductdata = {};
                equiryProductdata.EnquiryProductId = $scope.OrderData[0].OrderProductList[i].EnquiryProductId;
                equiryProductdata.ProductQuantity = $scope.OrderData[0].OrderProductList[i].ProductQuantity;
                equiryProductdata.IsActive = $scope.OrderData[0].OrderProductList[i].IsActive;
                equiryProductdata.EnquiryId = $scope.OrderData[0].OrderProductList[i].EnquiryId;
                equiryProductdata.ProductCode = $scope.OrderData[0].OrderProductList[i].ProductCode;
                equiryProductdata.ProductType = $scope.OrderData[0].OrderProductList[i].ProductType;
                equiryProductdata.UnitPrice = $scope.OrderData[0].OrderProductList[i].UnitPrice;
                equiryProductdata.ItemType = $scope.OrderData[0].OrderProductList[i].ItemType;
                equiryProductdata.ProductQuantity = $scope.OrderData[0].OrderProductList[i].ProductQuantity;
                //$scope.GetGrandTotalAmountOfEnquiry(enquiryProduct);
                equiryProductdata.CreatedBy = $rootScope.UserId;
                equiryProductdata.UpdatedBy = $rootScope.UserId;
                equiryProductdata.Remarks = "";
                equiryProductdata.SequenceNo = 0;
                equiryProductdata.AssociatedOrder = 0;
                if ($scope.OrderData[0].OrderProductList[i].DepositeAmount !== undefined) {
                    equiryProductdata.DepositeAmount = $scope.OrderData[0].OrderProductList[i].DepositeAmount;
                } else {
                    equiryProductdata.DepositeAmount = 0;
                }

                if ($scope.OrderData[0].OrderProductList[i].DepositeAmount !== undefined) {
                    equiryProductdata.DepositeAmountPerUnit = $scope.OrderData[0].OrderProductList[i].DepositeAmount;
                } else {
                    equiryProductdata.DepositeAmountPerUnit = 0;
                }

                equirydata.OrderProductList.push(equiryProductdata);
            }
            $scope.EnquiryList.push(equirydata);

            var Enquiry =
            {
                ServicesAction: "UpdateEnquiryProduct",
                EnquiryList: $scope.EnquiryList
            }


            var jsonobject = {};
            jsonobject.Json = Enquiry;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                debugger;
                var enqueryData = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === enquiryId });
                if (enqueryData.length > 0) {
                    enqueryData[0].TotalPrice = $scope.EnquiryGrandTotalAmount;
                }
                $rootScope.Throbber.Visible = false;
                //$scope.IsInEditModeForValidation = false;
                $scope.EnableAddItem = false;
                //$scope.IsInEditMode = false;
                $scope.RefreshDataGrid();
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApproval_UpdateEnquiry), 'error', 3000);
            });
        }

    }


    $scope.UpdateEnquiryByEnquiryWithReasonCode = function (enquiryId) {
        debugger;
        //if ($scope.IsInEditMode && $scope.IsInEditModeForValidation) {
        if (($scope.AvailableCreditLimitAmount - $scope.OrderData[0].EnquiryGrandTotalAmount) < 0) {

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_TotalCreditLimitValidation), 'error', 3000);
            return false;
        }
        if ($scope.OrderData[0].IsTruckFull === true) {
            //if (($scope.AvailableCreditLimit - ($scope.EnquiryGrandTotalAmount)) < 0) {
            //    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_TotalOMCreditLimitValidation), 'error', 3000);
            //    $rootScope.Throbber.Visible = false;
            //    return false;
            //}
            var enquiryList = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === enquiryId; });
            if (enquiryList.length > 0) {
                var objectList = [];

                for (var i = 0; i < enquiryList.length; i++) {
                    debugger;

                    var object = {};
                    object.ObjectId = enquiryList[i].EnquiryId;

                    objectList.push(object);
                }

                var mainObject = {};
                mainObject.ObjectList = objectList;
                mainObject.ObjectType = "Enquiry";
                mainObject.ReasonCodeEventName = "EditEnquiry";
                mainObject.FunctionName = "UpdateEnquiryByEnquiry";
                mainObject.FunctionParameter = enquiryId;
                $rootScope.LoadReasonCode("ReasonCodeForEnquiryEdit");

                $rootScope.OpenReasoncodepopup(mainObject);
            }
        }
        else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApproval_TruckNotFull), 'error', 3000);
        }
        //} else {
        //$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApproval_EditModeNotEnable), 'error', 3000);
        //  $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApprovalGrid_AccordionInEditMode), 'error', 8000);
        //}
    }
    //#endregion







    //#region Update Enquiry Products
    $scope.SaveDraftEnquiryByEnquiry = function (enquiryId) {
        debugger;

        $rootScope.Throbber.Visible = true;
        //if (($scope.AvailableCreditLimit - ($scope.EnquiryGrandTotalAmount)) < 0) {
        //    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_TotalOMCreditLimitValidation), 'error', 3000);
        //    $rootScope.Throbber.Visible = false;
        //    return false;
        //}
        var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === enquiryId; });


        var requestData =
        {
            ServicesAction: 'GetProposedDeliveryDate',
            DeliveryLocation: {
                LocationId: enquiryDetails[0].ShipTo,
                DeliveryLocationCode: enquiryDetails[0].ShipToCode,
                LocationCode: enquiryDetails[0].ShipToCode
            },
            Company: {
                CompanyId: enquiryDetails[0].SoldTo,
                CompanyMnemonic: enquiryDetails[0].SoldToCode,
            },
            Supplier: {
                CompanyId: enquiryDetails[0].SoldTo,
                CompanyMnemonic: enquiryDetails[0].SoldToCode,
            },
            RuleType: 1,
            CompanyId: enquiryDetails[0].SoldTo,
            CompanyMnemonic: enquiryDetails[0].SoldToCode,
            Order: {
                OrderTime: "",
                OrderDate: ""
            }
        };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var responseStr = response.data.Json;
            $rootScope.Throbber.Visible = false;
            if (responseStr.ProposedDate === '' || responseStr.ProposedDate === undefined) {

                var numberOfDaysToAdd = $scope.LoadSettingInfoByName('ProposedDeliveryDate', 'int');

                if (numberOfDaysToAdd !== "") {
                    var someDate = new Date();
                    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                    var dd = someDate.getDate();
                    var mm = someDate.getMonth() + 1;
                    var y = someDate.getFullYear();

                    var hours = someDate.getHours().toString();
                    hours = (hours.length === 1) ? ("0" + hours) : hours;

                    var minutes = someDate.getMinutes().toString();
                    minutes = (minutes.length === 1) ? ("0" + minutes) : minutes;

                    var someFormattedDate = dd + '/' + mm + '/' + y + ' ' + hours + ':' + minutes;

                    $rootScope.ProposedDate = someFormattedDate;
                    $rootScope.NoOfDays = numberOfDaysToAdd;

                }
                else {
                    $rootScope.ProposedDate = "";
                    $rootScope.NoOfDays = '0';
                }

            }
            else {
                $rootScope.ProposedDate = responseStr.ProposedDate;
                $rootScope.NoOfDays = responseStr.NoOfDays.replace(/\"\'/g, "");
            }




            var frozenpraposeddate = $filter('date')($rootScope.ProposedDate, 'dd/MM/yyyy');
            frozenpraposeddate = frozenpraposeddate.split('/');
            frozenpraposeddate = frozenpraposeddate[1] + "/" + frozenpraposeddate[0] + "/" + frozenpraposeddate[2];
            frozenpraposeddate = new Date(frozenpraposeddate);
            frozenpraposeddate.setDate(frozenpraposeddate.getDate() + 0);
            var dd = frozenpraposeddate.getDate();
            var mm = frozenpraposeddate.getMonth() + 1;
            var y = frozenpraposeddate.getFullYear();
            frozenpraposeddate = dd + '/' + mm + '/' + y;

            $scope.RequestedDateMinDate = frozenpraposeddate;


            var GetScheduleDateNumber = $scope.LoadSettingInfoByName('ScheduleDateNumber', 'float');
            //if (GetScheduleDateNumber === "" || GetScheduleDateNumber === 0) {
            //    GetScheduleDateNumber = 6;
            //}

            var SchedulingDate = "";
            $scope.date = $filter('date')(new Date(), 'dd/MM/yyyy');
            var date = $scope.date;

            if (GetScheduleDateNumber !== "" && GetScheduleDateNumber !== 0) {

                var proposedetd = date.split(' ');
                var etd = proposedetd[0].split('/');
                var etddate = etd[1] + "/" + etd[0] + "/" + etd[2];

                var enddate = new Date(etddate);
                enddate.setDate(enddate.getDate() + GetScheduleDateNumber);

                var dd = enddate.getDate();
                var mm = enddate.getMonth() + 1;
                var y = enddate.getFullYear();
                SchedulingDate = dd + '/' + mm + '/' + y;
            }

            $scope.RequestedDateMaxDate = SchedulingDate;

            $scope.BindPromisedDateFrom(frozenpraposeddate, SchedulingDate);

            $scope.EnquiryList = [];
            if ($scope.OrderData[0].IsTruckFull === true) {
                if ($scope.OrderData[0].OrderProductList.length > 0) {
                    var Enquiry =
                    {
                        ServicesAction: "UpdateEnquiryState",
                        EnquiryId: enquiryId,
                        LeadTime: $rootScope.ProposedDate
                    }

                    var jsonobject = {};
                    jsonobject.Json = Enquiry;
                    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                        $rootScope.Throbber.Visible = false;
                        $scope.EnableAddItem = false;
                        $scope.RefreshDataGrid();
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApproval_EnquiryPlaced), 'error', 3000);
                    });
                }
            } else {
                $rootScope.Throbber.Visible = false;
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApproval_TruckNotFull), 'error', 3000);
            }

        });





    }
    //#endregion












    //#region Get Item Information 

    $rootScope.PromotionItemList = [];

    $scope.LoadItemListByCompany = function () {

        var requestData =
        {
            ServicesAction: 'LoadAllProducts',
            CompanyId: $rootScope.CompanyId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.bindallproduct = resoponsedata.Item.ItemList;
        });
    }

    // Allready call on getproduct function..............
    //$scope.LoadItemListByCompany();
    //#endregion


    //#region Load Pramotion Item List 
    $scope.LoadPramotionItem = function () {

        var requestPromotionData =
        {
            ServicesAction: 'GetPromotionFocItemList',
            CompanyId: $rootScope.CompanyId,
            Region: $scope.DeliveryArea
        };
        var jsonPromotionobject = {};
        jsonPromotionobject.Json = requestPromotionData;
        GrRequestService.ProcessRequest(jsonPromotionobject).then(function (Promotionresponse) {

            var resoponsedata = Promotionresponse.data;
            if (resoponsedata.PromotionFocItemDetail !== undefined) {
                $rootScope.PromotionItemList = resoponsedata.PromotionFocItemDetail.PromotionFocItemDetailList;
            }

        });
    }
    // $scope.LoadPramotionItem();
    //#endregion

    //#region Get Item Details Event


    $scope.GetItemDetails = function (itemId, enquiryId, productQuantity, uom) {
        debugger;
        var requestData =
        {
            ServicesAction: 'LoadItemDetaiByItemId',
            CompanyId: $scope.ActiveCompanyId,
            ItemId: itemId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;

            $scope.bindallproduct = [];

            $rootScope.PromotionItemList = [];

            $scope.bindallproduct = resoponsedata.Json.ItemList;

            var item = resoponsedata.Json.ItemList.filter(function (el) { return el.ItemId === itemId; });
            if (item.length != 0) {
                if (typeof item[0].PromotionFocItemDetailList !== "undefined") {
                    $rootScope.PromotionItemList = item[0].PromotionFocItemDetailList;
                }
            }
            debugger;
            $scope.IsItemEdit = true;
            //$scope.IsInEditModeForValidation = true;

            $rootScope.IsPalettesRequired = true;
            // $scope.IsInEditMode = true;
            $scope.UOM = uom;
            $scope.getItemPrice(itemId, enquiryId, 0, productQuantity, false);
            $scope.IsEnquiryEdit = false;
            $scope.IsAccordianOpen = false;

        });

    }





    $scope.getItemPrice = function (itemId, enquiryId, associatedCount, productQuantity, itemSelection) {
        try {
            debugger;
            $rootScope.Throbber.Visible = true;
            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
            if (productNameStr.length > 0) {
                $scope.ItemPrices = productNameStr[0].Amount;
                if (associatedCount === 0) {
                    $scope.ItemDepositeAmount = productNameStr[0].CurrentDeposit;
                } else {
                    $scope.ItemDepositeAmount = 0;
                }
                $scope.UOM = productNameStr[0].UOM;
                $scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
                if (itemSelection === true) {
                    $scope.SearchControl.InputItem = productNameStr[0].ItemNameCode;
                } else {
                    $scope.SearchControl.InputItem = "";
                }
                $scope.ItemField.itemId = productNameStr[0].ItemId;
                $scope.showItembox = false;
                focus('inputItemsQty');
            }
            else {
                $scope.ItemPrices = 0;
                $scope.ItemCodeForDeposite = '';
            }

            // Save On Item Selection Item Deposite Amount.
            var requestDataforItemDeposite =
            {
                UserId: $rootScope.UserId,
                ObjectId: itemId,
                ObjectType: "Item Deposite  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                ServicesAction: 'CreateLog',
                LogDescription: 'On Item Selection In Enquiry Page For Item Deposite Amount. Item : ' + itemId + ' And Amount : ' + $scope.ItemDepositeAmount + '.',
                LogDate: GetCurrentdate(),
                Source: 'Portal',
            };
            var consolidateApiParamaterItemDeposite =
            {
                Json: requestDataforItemDeposite,
            };

            GrRequestService.ProcessRequest(consolidateApiParamaterItemDeposite).then(function (responseLogItemDepositeValidation) {

            });

            $scope.ItemCurrentStockPosition = 0;
            var requestData =
            {
                ServicesAction: 'GetProductCurrenttStockPosition',
                ProductCode: productNameStr[0].ItemCode,
                DeliveryLocationCode: $rootScope.BranchPlantCodeEdit
            };

            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (responseItemStock) {
                debugger;
                if (responseItemStock.data.ItemStock !== undefined) {
                    $scope.ItemCurrentStockPosition = responseItemStock.data.ItemStock.CurrentStockPosition;
                } else {
                    $scope.ItemCurrentStockPosition = 0;
                }

                //GetAllocation..
                var requestData =
                {
                    ServicesAction: 'GetItemAllocation',
                    DeliveryLocation: {
                        LocationId: $rootScope.DeliveryLocationId,
                        DeliveryLocationCode: $rootScope.DeliveryLocationCode
                    },
                    CompanyId: $rootScope.CompanyId,
                    CompanyMnemonic: $rootScope.CompanyMnemonic,
                    Company: {
                        CompanyId: $rootScope.CompanyId,
                        CompanyMnemonic: $rootScope.CompanyMnemonic
                    },
                    RuleType: 2,
                    Item: {
                        ItemId: parseInt(itemId),
                        SKUCode: $scope.ItemCodeForDeposite,
                    },
                    EnquiryId: enquiryId
                };
                $scope.Allocation = 'NA';
                $scope.ActualAllocation = 'NA';
                var jsonobject = {};
                jsonobject.Json = requestData;
                GrRequestService.ProcessRequest(jsonobject).then(function (responseAllocation) {
                    debugger;
                    if (responseAllocation.data !== null) {
                        var responseStr = responseAllocation.data.Json;
                        var currentOrder = $scope.OrderData;
                        $scope.CheckAllocatonPresent = responseStr.Allocation;
                        if (responseStr.Allocation != 'NA') {
                            if ($scope.IsItemEdit) {

                                var UsedAllocationQty = $scope.GetPendingAllocation('NA', 0, currentOrder, itemId, responseStr.ItemList);
                                $scope.Allocation = parseInt(responseStr.Allocation) - parseInt(UsedAllocationQty);
                                $scope.ActualAllocation = parseInt(responseStr.Allocation);
                            }
                            else {

                                var UsedAllocationQty = $scope.GetPendingAllocation('NA', 0, currentOrder, itemId, responseStr.ItemList);
                                $scope.Allocation = parseInt(responseStr.Allocation) - parseInt(UsedAllocationQty);
                                $scope.ActualAllocation = parseInt(responseStr.Allocation);
                            }
                        }
                        else {
                            $scope.Allocation = responseStr.Allocation;
                            $scope.ActualAllocation = responseStr.Allocation;
                        }
                    }

                    // Save On Item Selection Item Allocation.
                    var requestDataforItemAllocation =
                    {
                        UserId: $rootScope.UserId,
                        ObjectId: itemId,
                        ObjectType: "Item Allocation  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                        ServicesAction: 'CreateLog',
                        LogDescription: 'On Item Selection In Enquiry Page For Item Allocation. Item : ' + itemId + ' And Allocation : ' + $scope.Allocation + 'and ' + $scope.ActualAllocation + '.',
                        LogDate: GetCurrentdate(),
                        Source: 'Portal',
                    };
                    var consolidateApiParamaterItemAllocation =
                    {
                        Json: requestDataforItemAllocation,
                    };

                    GrRequestService.ProcessRequest(consolidateApiParamaterItemAllocation).then(function (responseLogItemAllocationValidation) {

                    });



                    //Get DepositeAmount
                    //Checking For Deposite Amount Available For Selected Product
                    if (associatedCount == 0) {
                        // Check Is ItemLayer Allow for selected item using rule
                        var requestLayerData =
                        {
                            ServicesAction: 'GetRuleValue',
                            CompanyId: $rootScope.CompanyId,
                            CompanyMnemonic: $rootScope.CompanyMnemonic,
                            DeliveryLocation: {
                                LocationId: $rootScope.DeliveryLocationId,
                                DeliveryLocationCode: $rootScope.DeliveryLocationCode
                            },
                            Company: {
                                CompanyId: $rootScope.CompanyId,
                                CompanyMnemonic: $rootScope.CompanyMnemonic,
                            },
                            RuleType: 4,
                            Item: {
                                SKUCode: productNameStr[0].ItemCode
                            }

                        };





                        $scope.IsItemLayerAllow = false;
                        var jsonLayerobject = {};
                        jsonLayerobject.Json = requestLayerData;
                        GrRequestService.ProcessRequest(jsonLayerobject).then(function (responseItemLayer) {
                            debugger;
                            var responseItemLayerStr = responseItemLayer.data.Json;
                            if (responseItemLayerStr.RuleValue != '' && responseItemLayerStr.RuleValue != undefined) {

                                if (responseItemLayerStr.RuleValue === '1') {
                                    $scope.IsItemLayerAllow = true;
                                }
                                else {
                                    $scope.IsItemLayerAllow = false;
                                }


                            }


                            var noOfExtraPalettes = 0;
                            debugger;
                            var requestData =
                            {
                                ServicesAction: 'GetRuleValue',
                                CompanyId: $rootScope.CompanyId,
                                CompanyMnemonic: $rootScope.CompanyMnemonic,
                                DeliveryLocation: {
                                    LocationId: $rootScope.DeliveryLocationId,
                                    DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                                },
                                Company: {
                                    CompanyId: $rootScope.CompanyId,
                                    CompanyMnemonic: $rootScope.CompanyMnemonic,
                                },
                                RuleType: 3,
                                Item: {
                                    UOM: $scope.UOM
                                }

                            };
                            var jsonobject = {};
                            jsonobject.Json = requestData;
                            GrRequestService.ProcessRequest(jsonobject).then(function (responseExtraPalettes) {
                                debugger;

                                $rootScope.Throbber.Visible = false;

                                var responseExtraPalettesStr = responseExtraPalettes.data.Json;

                                if (responseExtraPalettesStr.RuleValue != '' && responseExtraPalettesStr.RuleValue != undefined) {
                                    noOfExtraPalettes = parseInt(responseExtraPalettesStr.RuleValue);
                                    if (noOfExtraPalettes > 0) {
                                        noOfExtraPalettes = noOfExtraPalettes;
                                    }
                                }
                                if (itemSelection === false) {
                                    $scope.CheckingExtraPalettesBeforeAddingItem(itemId, productQuantity, 0, 32, 0, '');
                                } else {
                                    if ($rootScope.IsSelfCollect === false) {
                                        var validQty = $scope.CheckForNewQty(itemId, productNameStr[0].ItemType, $scope.ItemField.inputItemsQty, productNameStr, noOfExtraPalettes);
                                        $scope.MaxPermissibleQuantity = validQty;
                                    }

                                }

                            })
                        });
                    }
                });
            })
        } catch (e) {
            $rootScope.Throbber.Visible = false;
        }
    }

    $scope.selectedItemEvent = function (itemId, enquiry) {

        debugger;

        var requestData =
        {
            ServicesAction: 'LoadItemDetaiByItemId',
            CompanyId: $scope.ActiveCompanyId,
            ItemId: itemId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;

            $scope.bindallproduct = [];

            $rootScope.PromotionItemList = [];

            $scope.bindallproduct = resoponsedata.Json.ItemList;


            var item = resoponsedata.Json.ItemList.filter(function (el) { return el.ItemId === itemId; });
            if (item.length != 0) {


                if (typeof item[0].PromotionFocItemDetailList !== "undefined") {
                    $rootScope.PromotionItemList = item[0].PromotionFocItemDetailList;
                }
            }



            $scope.getItemPrice(itemId, enquiry, 0, 0, true);
        });



    }




    $scope.CheckingExtraPalettesBeforeAddingItem = function (itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode) {


        if (itemId != 0 && itemId != "") {
            $rootScope.Throbber.Visible = true;

            var noOfExtraPalettes = 0;
            var requestData =
            {
                ServicesAction: 'GetRuleValue',
                CompanyId: $scope.CompanyId,
                CompanyMnemonic: $scope.CompanyMnemonic,
                DeliveryLocation: {
                    LocationId: $rootScope.DeliveryLocationId,
                    DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                },
                Company: {
                    CompanyId: $scope.CompanyId,
                    CompanyMnemonic: $scope.CompanyMnemonic,
                },
                RuleType: 3,
                Item: {
                    UOM: $scope.UOM
                }


            };
            var jsonobject = {};
            jsonobject.Json = requestData;

            var requestDataforExtraPalettes =
            {
                UserId: $rootScope.UserId,
                ObjectId: itemId,
                ObjectType: "Extra Palettes Rules  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                ServicesAction: 'CreateLog',
                LogDescription: 'Extra Palettes Rules ' + JSON.stringify(jsonobject) + '.',
                LogDate: GetCurrentdate(),
                Source: 'Portal',
            };
            var consolidateApiParamaterExtraPalettes =
            {
                Json: requestDataforExtraPalettes,
            };

            GrRequestService.ProcessRequest(consolidateApiParamaterExtraPalettes).then(function (responseLogItemDepositeValidation) {

            });





            GrRequestService.ProcessRequest(jsonobject).then(function (responseExtraPalettes) {

                var responseExtraPalettesStr = responseExtraPalettes.data.Json;

                if (responseExtraPalettesStr.RuleValue != '' && responseExtraPalettesStr.RuleValue != undefined) {
                    noOfExtraPalettes = parseInt(responseExtraPalettesStr.RuleValue);
                    if (noOfExtraPalettes > 0) {
                        noOfExtraPalettes = noOfExtraPalettes;
                    }
                }


                // Save On Item Selection Extra Pallets.
                var requestDataforExtraPalletsOutput =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: itemId,
                    ObjectType: "Extra Pallets Output : EnquiryId " + $rootScope.EditedEnquiryId + "",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'On Item Selection In Enquiry Page For Extra Pallets. Item : ' + itemId + ' And Extra Pallets : ' + $scope.NumberOfExtraPalettes + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
                var consolidateApiParamaterExtraPalletsoutput =
                {
                    Json: requestDataforExtraPalletsOutput,
                };

                GrRequestService.ProcessRequest(consolidateApiParamaterExtraPalletsoutput).then(function (responseLogItemAllocationValidation) {

                });



                var productNameStrValue = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
                $rootScope.Throbber.Visible = false;
                if (productNameStrValue[0].ItemCode === $scope.WoodenPalletCode || productNameStrValue[0].ItemCode === $scope.LoscamPalletCode) {
                    $rootScope.Throbber.Visible = false;
                    $scope.AddWoodenPalletOnEditModeForOM(qty);
                    $scope.ClearItemRecord();
                }
                else {
                    $scope.addProducts(itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode, noOfExtraPalettes);
                }
                //$scope.addProducts(itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode, noOfExtraPalettes);

            });
        }
        else {
            $rootScope.IsProductValidation = true;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_SelectProduct), 'error', 8000);
        }

    }





    $scope.AddWoodenPalletOnEditModeForOM = function (qty) {
        debugger;

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {


            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemCode === $scope.WoodenPalletCode; });
            var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode & parseInt(el.GratisOrderId) === 0; });

            //var enquiryProductGuid = productNameStrupdate[0].EnquiryProductGUID;


            if (productNameStrupdate.length > 0) {
                if ($scope.IsItemEdit) {
                    productNameStrupdate[0].ProductQuantity = parseInt(qty);
                    productNameStrupdate[0].IsOrderItemEdited = false;
                    $scope.EditedEnquiryItemId = 0;
                }
                else {
                    productNameStrupdate[0].ProductQuantity = parseInt(productNameStrupdate[0].ProductQuantity) + parseInt(qty);
                }
            }
            else {

                var products = {
                    EnquiryProductGUID: generateGUID(),
                    OrderGUID: $scope.CurrentOrderGuid,
                    EnquiryProductId: 0,
                    Allocation: 0,
                    ItemId: productNameStr[0].ItemId,
                    ParentItemId: 0,
                    ParentProductCode: '',
                    GratisOrderId: 0,
                    ItemName: productNameStr[0].ItemName,
                    ProductCode: productNameStr[0].ItemCode,
                    NumberOfExtraPalettes: 0,
                    PrimaryUnitOfMeasure: productNameStr[0].UOM,
                    ProductQuantity: qty,
                    ItemPricesPerUnit: 0,
                    DepositeAmountPerUnit: 0,
                    ItemTotalDepositeAmount: 0,
                    ItemPrices: 0,
                    ConversionFactor: 0,
                    ProductType: productNameStr[0].ProductType,
                    ActualAllocation: 'NA',
                    WeightPerUnit: 0,
                    ItemType: 0,
                    ItemTaxPerUnit: 0,
                    IsItemLayerAllow: false,
                    IsActive: true
                }
                currentOrder[0].OrderProductList.push(products);

            }




        }

    }



    $scope.addProducts = function (itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode, noOfExtraPalettes) {
        debugger;
        if (qty === "" || qty === undefined || qty === null) {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnterValidQuantity), 'error', 3000);
            return false;
        }

        if (parseInt(qty) < 1) {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnterValidQuantity), 'error', 3000);
            return false;
        }

        var addPromotionQty = qty;

        if ($rootScope.DeliveryLocationId > 0 && ($rootScope.TruckSizeId > 0 || $rootScope.IsSelfCollect === true)) {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === $scope.EditEnquiryId; });
            if (currentOrder.length > 0) {

                var totalWeightWithPalettes = 0;
                var totalWeightWithBuffer = 0;
                var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });

                // Check Validation Of Max Number Of Item Allow To Add In OrderProduct.
                if (!$scope.IsItemEdit) {
                    var numberOfProductAdded = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 32 && el.ProductCode !== $scope.WoodenPalletCode; });
                    if (numberOfProductAdded.length > (parseInt($scope.NumberOfProductAdd) - 1)) {

                        //$rootScope.ValidationErrorAlert('You can not add more the ' + $scope.NumberOfProductAdd + ' products.', 'error', 3000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_NumberOfProducts, $scope.NumberOfProductAdd), 'error', 3000);
                        return false;
                    }
                }

                // Item Layer validation according to quantity.
                if (parseInt(productNameStr[0].QtyPerLayer) > 0) {
                    if ($scope.IsItemLayerAllow) {
                        var g = (parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer));
                        if ((parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer)) > 0) {
                            if ((parseInt(ItemType) == 31)) {
                                $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                            }



                            // Save Item Layer Validation Log.
                            var requestDataforItemLayer =
                            {
                                UserId: $rootScope.UserId,
                                ObjectId: itemId,
                                ObjectType: "Item Layer  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                                ServicesAction: 'CreateLog',
                                LogDescription: 'Click On Add Product Button In Enquiry Page For Item Layer Validation. Item : ' + itemId + ' And Quantity : ' + qty + ' Layer Validation Allow : ' + $scope.IsItemLayerAllow + ' Quantity Per Layer ' + parseInt(productNameStr[0].QtyPerLayer) + '.',
                                LogDate: GetCurrentdate(),
                                Source: 'Portal',
                            };
                            var consolidateApiParamaterItemLayer =
                            {
                                Json: requestDataforItemLayer,
                            };

                            GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

                            });

                            //$rootScope.ValidationErrorAlert('This item can be ordered in complete layers, please adjust ordered quantity.', 'error', 3000);

                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_CompleteLayer), 'error', 3000);
                            return false;
                        }
                    }
                }




                // Save Item Layer Validation Log.
                var requestDataforItemLayer =
                {
                    UserId: $rootScope.UserId,
                    ObjectId: itemId,
                    ObjectType: "Item Layer  : EnquiryId " + $rootScope.EditedEnquiryId + "",
                    ServicesAction: 'CreateLog',
                    LogDescription: 'Click On Add Product Button In Enquiry Page For Item Layer Validation. Item : ' + itemId + ' And Quantity : ' + qty + ' Layer Validation Allow : ' + $scope.IsItemLayerAllow + ' Quantity Per Layer ' + parseInt(productNameStr[0].QtyPerLayer) + '.',
                    LogDate: GetCurrentdate(),
                    Source: 'Portal',
                };
                var consolidateApiParamaterItemLayer =
                {
                    Json: requestDataforItemLayer,
                };

                GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

                });



                var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return el.ItemId === itemId & parseInt(el.ItemType) === parseInt(ItemType) & parseInt(el.GratisOrderId) === 0; });
                var enquiryProductGuid = '';
                if (productNameStrupdate.length > 0) {
                    enquiryProductGuid = productNameStrupdate[0].EnquiryProductGUID;
                } else {
                    productNameStrupdate = [];
                }


                var checkPromotionItemPresent = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === parseInt(31) && el.ProductCode === productNameStr[0].ItemCode; });
                if (checkPromotionItemPresent.length == 0) {
                    var chkVlaue = $scope.CheckBeforeAddingPromationItem(productNameStr[0].ItemCode, itemId, parseInt(qty), ItemType, productNameStr, enquiryProductGuid, GratisOrderId, noOfExtraPalettes, productNameStrupdate);
                    if (!chkVlaue && !$rootScope.IsSelfCollect) {
                        return false;
                    }
                }

                // Check Item Allocation 

                if (parseInt(GratisOrderId) == 0) {

                    var checkAllocationValue = $scope.CheckAllocation($scope.Allocation, qty, $scope.OrderData, itemId);
                    if (!checkAllocationValue) {
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }


                        //$rootScope.ValidationErrorAlert('It seems like you are tyring to order the item more than the allocated quantity. You cannot order this item more than ' + $scope.Allocation + ' ' + productNameStr[0].UOM + '', 'error', 10000);
                        if (productNameStrupdate.length > 0) {
                            productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
                        }

                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_MorethanAllocationQty, $scope.Allocation, productNameStr[0].UOM), 'error', 3000);
                        return false;
                    }
                }


                var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
                var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
                //var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, $scope.NumberOfExtraPalettes, ItemType, enquiryProductGuid);
                var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, noOfExtraPalettes, ItemType, enquiryProductGuid);


                var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
                if (bufferWeight !== "") {
                    totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
                }
                var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);

                var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
                if (weightPerPalettes !== "") {
                    if ($rootScope.IsPalettesRequired) {
                        totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
                    }
                    totalWeight = totalWeight + totalWeightWithPalettes
                }
                truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);

                var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
                var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

                if (productNameStrupdate.length > 0) {
                    if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect && $scope.IsWeightLoadCheckValidation === true) {
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                        if (productNameStrupdate.length > 0) {
                            productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
                        }
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;

                    } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect && $scope.IsPalletLoadCheckValidation === true) {

                        var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);
                        if (productNameStrupdate.length > 0) {
                            productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
                        }
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;
                    }
                    else {

                        currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes) + parseFloat(truckTotalExtraPalettes));
                        currentOrder[0].TruckWeight = (totalWeight / 1000);
                        currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
                        if ($scope.IsItemEdit) {
                            productNameStrupdate[0].ProductQuantity = parseInt(qty);
                            productNameStrupdate[0].PreviousProductQuantity = productNameStrupdate[0].ProductQuantity;
                            productNameStrupdate[0].OldProductQuantity = productNameStrupdate[0].ProductQuantity;

                            productNameStrupdate[0].ItemPrices = (parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount) * parseInt(productNameStrupdate[0].ProductQuantity));
                            productNameStrupdate[0].ItemTotalDepositeAmount = parseFloat(productNameStr[0].CurrentDeposit) * parseFloat(productNameStrupdate[0].ProductQuantity);

                            if (productNameStrupdate[0].UsedQuantityInEnquiry !== undefined && productNameStrupdate[0].UsedQuantityInEnquiry !== null) {
                                var remainingProductStock = parseFloat(parseFloat(productNameStrupdate[0].CurrentStockPosition) - parseFloat(productNameStrupdate[0].UsedQuantityInEnquiry));
                                if (parseFloat(productNameStrupdate[0].ProductQuantity) < remainingProductStock) {
                                    productNameStrupdate[0].IsItemAvailableInStock = true;
                                } else {
                                    productNameStrupdate[0].IsItemAvailableInStock = false;
                                }
                            }


                        }
                        else {
                            if (parseInt(ItemType) === 31) {
                                productNameStrupdate[0].ProductQuantity = parseInt(qty);
                                productNameStrupdate[0].PreviousProductQuantity = productNameStrupdate[0].ProductQuantity;
                                productNameStrupdate[0].OldProductQuantity = productNameStrupdate[0].ProductQuantity;
                            }
                            else {
                                productNameStrupdate[0].ProductQuantity = parseInt(productNameStrupdate[0].ProductQuantity) + parseInt(qty);
                                productNameStrupdate[0].PreviousProductQuantity = productNameStrupdate[0].ProductQuantity;
                                productNameStrupdate[0].OldProductQuantity = productNameStrupdate[0].ProductQuantity;
                                addPromotionQty = productNameStrupdate[0].ProductQuantity;
                            }
                            productNameStrupdate[0].ItemPrices = (parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount) * parseInt(productNameStrupdate[0].ProductQuantity));
                            productNameStrupdate[0].ItemTotalDepositeAmount = parseFloat(productNameStr[0].CurrentDeposit) * parseFloat(productNameStrupdate[0].ProductQuantity);
                        }

                        productNameStrupdate[0].IsOrderItemEdited = false;

                        $rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);
                        $scope.ReloadGraph(currentOrder, 0);

                        $scope.ClearItemRecord();
                    }
                }
                else {

                    if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect && $scope.IsWeightLoadCheckValidation === true) {
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;

                    } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect && $scope.IsPalletLoadCheckValidation === true) {
                        var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveProduct($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' pallets. Please modify your order and try again.', 'error', 8000);
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;
                    }

                    else {

                        if (currentOrder.length > 0) {
                            $rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
                            $rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);
                            angular.forEach($rootScope.buindingPalettes, function (item, key) {
                                item.PalettesWidth = 0;
                            });

                            if ($rootScope.IsPalettesRequired) {
                                for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                                    if (i < parseInt($rootScope.buindingPalettes.length)) {
                                        $rootScope.buindingPalettes[i].PalettesWidth = 100;
                                    }
                                }
                            }
                            currentOrder[0].TruckName = $rootScope.TruckSize;
                            currentOrder[0].TruckCapacity = $rootScope.TruckCapacityInTone;
                            currentOrder[0].TruckSizeId = $rootScope.TruckSizeId;
                            currentOrder[0].ShipTo = $rootScope.DeliveryLocationId;
                            currentOrder[0].DeliveryLocationName = $rootScope.DeliveryLocationName;
                            currentOrder[0].NoOfDays = $rootScope.NoOfDays;
                            currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes) + parseFloat(truckTotalExtraPalettes));
                            currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
                            currentOrder[0].TruckWeight = $rootScope.TruckCapacityFullInTone;
                            if (parseInt(currentOrder[0].EnquiryId) === 0) {
                                currentOrder[0].CurrentState = 1;
                            }

                            if (productNameStr[0].Amount == undefined) {
                                productNameStr[0].Amount = 0;
                            }

                            if (parseInt(GratisOrderId) !== 0) {
                                var gratisorder = currentOrder[0].OrderProductList.filter(function (el) { return el.GratisOrderId === GratisOrderId && el.ItemId === itemId; });

                                if (gratisorder.length > 0) {
                                    return false;
                                }
                            }


                            var itemdeposite = 0;
                            if (productNameStr[0].CurrentDeposit !== undefined && productNameStr[0].CurrentDeposit !== null) {
                                itemdeposite = productNameStr[0].CurrentDeposit;
                            } else {
                                itemdeposite = 0;
                            }


                            var products = {
                                EnquiryProductGUID: generateGUID(),
                                EnquiryId: $rootScope.EditedEnquiryId,
                                EnquiryProductId: 0,
                                Allocation: $scope.Allocation,
                                ItemId: itemId,
                                ParentItemId: ParentItemId,
                                ParentProductCode: ParentProductCode,
                                GratisOrderId: GratisOrderId,
                                ItemName: productNameStr[0].ItemName,
                                ProductCode: productNameStr[0].ItemCode,
                                NumberOfExtraPalettes: noOfExtraPalettes,
                                PrimaryUnitOfMeasure: productNameStr[0].UOM,
                                ProductQuantity: qty,
                                PreviousProductQuantity: qty,
                                ActualAllocation: $scope.ActualAllocation,
                                ItemShortCode: productNameStr[0].ItemShortCode,
                                DepositeAmount: itemdeposite,
                                UnitPrice: parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount),
                                ItemPricesPerUnit: parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount),
                                ItemTaxPerUnit: percentage(parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount), $scope.ItemTaxInPec),
                                ItemPrices: (parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount) * parseInt(qty)),
                                DepositeAmountPerUnit: itemdeposite,
                                DiscountAmount: 0,
                                ItemTotalDepositeAmount: parseFloat(parseFloat(itemdeposite) * parseInt(qty)),
                                ConversionFactor: productNameStr[0].ConversionFactor,
                                ProductType: productNameStr[0].ProductType,
                                WeightPerUnit: productNameStr[0].WeightPerUnit,
                                IsItemLayerAllow: $scope.IsItemLayerAllow,
                                ItemType: ItemType,
                                IsActive: "1"
                            }

                            if (parseInt(currentOrder[0].EnquiryId) !== 0) {
                                products.CurrentStockPosition = $scope.ItemCurrentStockPosition;
                            }
                            currentOrder[0].OrderProductList.push(products);
                            var x = $scope.OrderData;
                            $rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);
                            $scope.LoadEnquiryAmountDetails($scope.OrderData[0].OrderProductList);
                        }

                        $scope.ClearItemRecord();
                    }

                }


                if ($rootScope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {

                    $scope.AddWoodenPallet();
                }

                var chkaddpro = $scope.AddPromationItem(productNameStr[0].ItemCode, itemId, parseInt(addPromotionQty), ItemType);
                if ($scope.IsPalletLoadCheckValidation === true || $scope.IsWeightLoadCheckValidation === true) {
                    if (!chkaddpro && !$rootScope.IsSelfCollect) {

                        var dd = $scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $rootScope.TruckCapacity, $rootScope.TruckCapacityPalettes, totalWeightWithPalettes);
                        if (dd) {
                            var dd = $scope.AddTruckControl;
                            if (!dd._isShown) {
                                currentOrder[0].IsTruckFull = true;
                                $scope.AddTruckHeaderMessage = String.format($rootScope.resData.res_CreateInquiryPage_TruckFullConfirmationHeaderMessage);
                                $scope.AddTruckBodymessage = String.format($rootScope.resData.res_CreateInquiryPage_TruckFullConfirmationMessageInEdit);
                                $scope.OpenAddTruckControl();
                            }
                        }
                        else {
                            currentOrder[0].IsTruckFull = false;
                        }
                    } else if ($rootScope.IsSelfCollect) {
                        currentOrder[0].IsTruckFull = true;
                    }
                }
                else {
                    currentOrder[0].IsTruckFull = true;
                }
            }
        }
        else {

        }
    }

    $scope.AddWoodenPallet = function () {

        var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === $scope.EditEnquiryId; });
        if (currentOrder.length > 0) {

            var qty = currentOrder[0].NumberOfPalettes;

            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemCode === $scope.WoodenPalletCode; });


            var requestAreaData =
            {
                ServicesAction: 'GetRuleValue',
                CompanyId: $rootScope.CompanyId,
                CompanyMnemonic: $rootScope.CompanyMnemonic,
                DeliveryLocation: {
                    LocationId: $rootScope.DeliveryLocationId,
                    DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                    LocationCode: $rootScope.DeliveryLocationCode,
                    Area: $rootScope.DeliveryArea,
                },
                Company: {
                    CompanyId: $rootScope.CompanyId,
                    CompanyMnemonic: $rootScope.CompanyMnemonic,
                },
                Supplier: {
                    CompanyId: $rootScope.CompanyId,
                    CompanyMnemonic: $rootScope.CompanyMnemonic,
                },
                Role: {
                    RoleName: $rootScope.RoleName,
                },
                Item: {
                    ItemId: parseInt(productNameStr[0].ItemId),
                    SKUCode: productNameStr[0].ItemCode,
                },

                RuleType: 10,
                TruckSize: {
                    TruckSize: parseFloat($rootScope.TruckCapacityInTone),
                }

            };

            $scope.EditPaletteCount = 0
            var jsonobjectArea = {};
            jsonobjectArea.Json = requestAreaData;
            GrRequestService.ProcessRequest(jsonobjectArea).then(function (arearesponse) {


                var arearesponseStr = arearesponse.data.Json;
                if (arearesponseStr.RuleValue != '' && arearesponseStr.RuleValue != undefined) {
                    var rulevalue = parseInt(arearesponseStr.RuleValue);
                    $scope.EditPaletteCount = rulevalue;
                }



                if ($scope.EditPaletteCount == "1") {
                    $rootScope.IsPaletteEditRequired = true;
                } else {
                    $rootScope.IsPaletteEditRequired = false;
                }


                var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return (el.ProductCode === $scope.WoodenPalletCode || el.ProductCode === $scope.LoscamPalletCode) & parseInt(el.GratisOrderId) === 0; });


                if (productNameStrupdate.length > 0) {
                    if ($scope.IsAccordianOpen) {
                        productNameStrupdate[0].ProductQuantity = parseInt(productNameStrupdate[0].ProductQuantity);
                    }
                    else {
                        productNameStrupdate[0].ProductQuantity = parseInt(qty);
                    }
                }
                else {

                    var products = {
                        EnquiryProductGUID: generateGUID(),
                        OrderGUID: $scope.CurrentOrderGuid,
                        EnquiryProductId: 0,
                        Allocation: 0,
                        ItemId: productNameStr[0].ItemId,
                        ParentItemId: 0,
                        ParentProductCode: '',
                        GratisOrderId: 0,
                        ItemName: productNameStr[0].ItemName,
                        ProductCode: productNameStr[0].ItemCode,
                        NumberOfExtraPalettes: 0,
                        PrimaryUnitOfMeasure: productNameStr[0].UOM,
                        ProductQuantity: qty,
                        ItemPricesPerUnit: 0,
                        DepositeAmountPerUnit: 0,
                        ItemTotalDepositeAmount: 0,
                        ItemPrices: 0,
                        ConversionFactor: 0,
                        ProductType: productNameStr[0].ProductType,
                        ActualAllocation: 'NA',
                        WeightPerUnit: 0,
                        ItemType: 0,
                        ItemTaxPerUnit: 0,
                        IsItemLayerAllow: false,
                        IsActive: "1"
                    }
                    currentOrder[0].OrderProductList.push(products);
                }
            });

        }

    }



    $scope.CheckBeforeAddingPromationItem = function (itemCode, itemId, qty, ItemType, productNameStr, enquiryProductGuid, GratisOrderId, noOfExtraPalettes, productNameStrupdate) {
        $scope.QtyForValidate = qty;
        var totalWeightWithPalettes = 0;
        var chkvalid = true;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === $scope.EditEnquiryId; });
        if (currentOrder.length > 0) {

            if (!$scope.IsItemEdit) {
                enquiryProductGuid = '';
            }
            $scope.PromotionQty = 0;
            var promotionItem = $rootScope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
            for (var i = 0; i < promotionItem.length; i++) {
                var ItemQuanity = promotionItem[i].ItemQuanity;
                var FocItemId = promotionItem[i].FocItemId;
                var FocItemQuantity = promotionItem[i].FocItemQuantity;
                if ((parseInt(qty) % parseFloat(ItemQuanity)) === 0) {
                    var totalNumberCanOrderFocItem = (parseInt(qty) / parseFloat(ItemQuanity));
                    var totalAmountOfQty = parseInt(FocItemQuantity) * totalNumberCanOrderFocItem;
                    qty = qty + totalAmountOfQty;
                    $scope.PromotionQty = qty;
                }

            }

            var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
            var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
            var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, noOfExtraPalettes, ItemType, enquiryProductGuid);
            var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
            if (bufferWeight !== "") {
                totalWeightWithBuffer = (parseFloat($rootScope.TruckCapacity) - (bufferWeight * 1000));
            }
            var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);
            var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
            if (weightPerPalettes !== "") {
                if ($rootScope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                    totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
                }
                totalWeight = totalWeight + totalWeightWithPalettes
            }
            truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);


            var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
            var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

            if (parseFloat(parseFloat($rootScope.TruckCapacity) + parseFloat(extraTruckBufferWeight)) < totalWeight && !$rootScope.IsSelfCollect && $scope.IsWeightLoadCheckValidation === true) {
                if ($scope.QtyForValidate > $scope.MaxPermissibleQuantity) {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                }
                else {

                    if ($scope.PromotionQty !== 0) {
                        if ($scope.PromotionQty > $scope.QtyForValidate) {
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidationForPromotion, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                        }

                        else if ($scope.MaxPermissibleQuantity === $scope.QtyForValidate) {
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidationForPromotion, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                        }
                        else {
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                        }
                    }
                    else {
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($rootScope.TruckCapacity) / 1000)), 'error', 8000);
                    }
                }
                //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($rootScope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);


                chkvalid = false;
            } else if (parseFloat(parseFloat($rootScope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $rootScope.IsPalettesRequired === true && !$rootScope.IsSelfCollect && $scope.IsPalletLoadCheckValidation === true) {

                var truckcapcityintons = parseInt(parseInt($rootScope.TruckCapacity) / 1000);
                //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $rootScope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);
                if (productNameStrupdate.length > 0) {
                    productNameStrupdate[0].ProductQuantity = productNameStrupdate[0].PreviousProductQuantity;
                }
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_TruckSizePalletsValidation, parseInt(Math.ceil(truckTotalPalettes)), truckcapcityintons, $rootScope.TruckCapacityPalettes), 'error', 8000);
                chkvalid = false;
            }

        }
        return chkvalid;
    }

    //16.a) Calculate Total Weight.
    $scope.getTotalAmount = function (weight, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {

        var total = 0;
        if (currentOrder.length > 0) {
            for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {

                if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode && currentOrder[0].OrderProductList[i].IsPackingItem === "0") {
                    total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
                }
            }
            total += parseFloat(weight) * parseFloat(quantity);
        }
        return total;
    }

    //16.b) Calculate Total Pallets.
    $scope.getTotalPalettes = function (palettes, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {
        debugger;
        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode && currentOrder[0].OrderProductList[i].IsPackingItem === "0") {
                total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            }
        }
        if (parseFloat(quantity) > 0) {
            total += parseFloat(quantity) / parseFloat(palettes);
        }
        if ($rootScope.TruckCapacityPalettes == 0) {
            total = 0;
        }
        if (!$rootScope.IsPalettesRequired) {
            total = 0;
        }
        return total;
    }

    //16.c) Calculate Extra Pallets.
    $scope.getTotalExtraPalettes = function (palettes, quantity, currentOrder, itemId, NumberOfExtraPalettes, ItemType, enquiryProductGuid) {
        debugger;
        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode && currentOrder[0].OrderProductList[i].IsPackingItem === "0" && currentOrder[0].OrderProductList[i].NumberOfExtraPalettes > 0) {
                var totalPalets = parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
                total += (totalPalets / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
            }
        }
        if (NumberOfExtraPalettes > 0) {
            if (parseFloat(quantity) > 0) {
                var totalPalets = parseFloat(quantity) / parseFloat(palettes);
                total += (totalPalets / NumberOfExtraPalettes);
            }
        }
        if ($rootScope.TruckCapacityPalettes == 0) {
            total = -1;
        }
        if (!$rootScope.IsPalettesRequired) {
            total = 0;
        }
        return total;
    }

    //16.d) Add Extra Pallets.
    $scope.AddExtraPalleter = function (currentOrder, enquiryProductGuid, ConversionFactor, qty, PrimaryUnitOfMeasure) {

        var TotalPalettes = 0;
        if (currentOrder.length > 0) {
            var newArr = [];
            var productList = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode && el.PrimaryUnitOfMeasure !== "Keg" && el.IsPackingItem === "0" && el.EnquiryProductGUID !== enquiryProductGuid; });
            $.each(productList, function (index, element) {
                if (newArr[element.PrimaryUnitOfMeasure] == undefined) {
                    newArr[element.PrimaryUnitOfMeasure] = 0;
                }
                newArr[element.PrimaryUnitOfMeasure] += parseFloat(element.ProductQuantity) / parseFloat(element.ConversionFactor);
            });
            if (PrimaryUnitOfMeasure !== '' && PrimaryUnitOfMeasure !== undefined) {
                if (newArr[PrimaryUnitOfMeasure] == undefined) {
                    newArr[PrimaryUnitOfMeasure] = 0;
                }
                newArr[PrimaryUnitOfMeasure] += parseFloat(qty) / parseFloat(ConversionFactor);
            }
            for (var name in newArr) {

                var value = newArr[name];
                newArr[name] = Math.ceil(value);
                TotalPalettes += Math.ceil(value);
            }
        }
        return TotalPalettes;
    }

    $scope.GetPendingAllocation = function (Allocation, quantity, currentOrder, itemId, ItemList) {

        var total = 0;
        var productNameStrupdate = [];
        for (var i = 0; i < currentOrder.length; i++) {

            if (ItemList != undefined) {
                if ($scope.IsItemEdit) {
                    productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return el.ItemId !== itemId && ItemList.indexOf(el.ProductCode) > -1 && el.ItemType == 32; });
                }
                else {
                    productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return ItemList.indexOf(el.ProductCode) > -1 && el.ItemType == 32; });
                }
            }
            else {
                productNameStrupdate = currentOrder[i].OrderProductList.filter(function (el) { return el.ItemId === itemId && el.ItemType == 32; });
            }

            if (productNameStrupdate.length > 0) {
                for (var j = 0; j < productNameStrupdate.length; j++) {
                    total += parseFloat(productNameStrupdate[j].ProductQuantity);
                }
            }
        }

        return total;
    }

    $rootScope.TruckExtraBufferWeight = function () {

        var extraTruckBufferWeight = 0;
        if ($scope.TruckExceedBufferWeight != 0 && $scope.TruckExceedBufferWeight != "0") {
            extraTruckBufferWeight = parseFloat($rootScope.TruckCapacity * (parseFloat($scope.TruckExceedBufferWeight) / 100));
        }
        return extraTruckBufferWeight;
    }

    $rootScope.TruckExtraBufferPallet = function () {


        var extraPaletteBufferWeight = 0;
        if ($scope.PalettesExceedBufferWeight != 0 && $scope.PalettesExceedBufferWeight != "0") {
            extraPaletteBufferWeight = parseFloat($scope.PalettesExceedBufferWeight);
        }
        return extraPaletteBufferWeight;
    }
    $scope.CheckAllocation = function (Allocation, quantity, currentOrder, itemId) {

        var allowAllocatio = false;
        var total = 0;
        total += parseFloat(quantity);
        if (Allocation >= total) {
            allowAllocatio = true;
        }

        if (Allocation == 'NA') {
            allowAllocatio = true;
        }

        return allowAllocatio;
    }

    $scope.ReloadGraph = function (currentOrder, removeKegPalettes) {
        debugger;
        if (!$rootScope.IsSelfCollect) {
            console.log('Reload Graph');

            var totalWeightWithPalettes = 0;
            var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
            var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');
            var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
            var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, '', 0, 0, '');
            var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
            if (weightPerPalettes !== "") {
                if ($rootScope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                    totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes - removeKegPalettes));
                }
                totalWeight = totalWeight + totalWeightWithPalettes
            }

            var truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);
            $scope.PalettesCorrectWeight = truckTotalPalettes;

            currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(totalNumberOfPalettes));


            currentOrder[0].TruckWeight = (totalWeight / 1000);
            currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
            $rootScope.TruckCapacityFullInTone = (totalWeight / 1000);
            $rootScope.TruckCapacityFullInPercentage = (($rootScope.TruckCapacityFullInTone * 100) / $rootScope.TruckCapacityInTone).toFixed(2);
            angular.forEach($rootScope.buindingPalettes, function (item, key) {
                item.PalettesWidth = 0;
            });



            if ($rootScope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                    if (i < parseInt($rootScope.buindingPalettes.length)) {
                        $rootScope.buindingPalettes[i].PalettesWidth = 100;
                    }
                }
            }
            $scope.CalculateDeliveryUsedCapacity();
            if ($rootScope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true && $rootScope.IsSelfCollect === false) {

                var otherItem = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode });
                if (otherItem.length > 0) {
                    $scope.AddWoodenPallet();
                }
            }
        }
        $scope.LoadEnquiryAmountDetails(currentOrder[0].OrderProductList);
        $rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, $scope.CurrentOrderGuid);
    }


    $scope.CalculateDeliveryUsedCapacity = function () {

        console.log('CalculateDeliveryUsedCapacity');
        var tempNumberOfPalettes = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            tempNumberOfPalettes += $scope.OrderData[i].NumberOfPalettes;
        }
        $scope.tempDeliveryUsedCapacity = tempNumberOfPalettes;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === $scope.EditEnquiryId; });
        if (($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity) > $rootScope.DeliveryLocationCapacity) {
            var usedPalettesCapacity = parseInt($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity);
            if (currentOrder.length > 0) {
                currentOrder[0].IsRecievingLocationCapacityExceed = true;
                if (currentOrder[0].OrderProductList.length === 0) {
                    $rootScope.ValidationErrorReceivingLocation = String.format($rootScope.res_CreateInquiryPage_CapacityFullyConsumed);
                }
                else {
                    $rootScope.ValidationErrorReceivingLocation = 'The receiving capacity for the delivery location is only ' + parseInt($rootScope.DeliveryLocationCapacity) + ' pallets while you are trying order ' + usedPalettesCapacity + ' paletts. Please modify you order and try again.';
                }
            }
        }
        else {
            if (currentOrder.length > 0) {
                currentOrder[0].IsRecievingLocationCapacityExceed = false;
            }
        }

    }

    $scope.AddPromationItem = function (itemCode, ItemId, qty, ItemType) {

        var addPromation = false;
        if (parseInt(ItemType) !== 31 && parseInt(ItemType) !== 30) {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === $scope.EditEnquiryId; });
            if (currentOrder.length > 0) {

                var promotionItem = $rootScope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
                if (promotionItem.length === 0) {
                    $scope.Allocation = 'NA';
                    $scope.ActualAllocation = 'NA';
                }
                for (var i = 0; i < promotionItem.length; i++) {
                    var ItemQuanity = promotionItem[i].ItemQuanity;
                    var FocItemId = promotionItem[i].FocItemId;
                    var FocItemQuantity = promotionItem[i].FocItemQuantity;
                    if ((parseInt(qty) % parseFloat(ItemQuanity)) === 0) {
                        addPromation = true;
                        var totalNumberCanOrderFocItem = (parseInt(qty) / parseFloat(ItemQuanity));
                        var totalAmountOfQty = parseInt(FocItemQuantity) * totalNumberCanOrderFocItem;

                        //$scope.addProducts(FocItemId, totalAmountOfQty, 0, 31, ItemId, itemCode, 0);
                        $scope.CheckingExtraPalettesBeforeAddingItem(FocItemId, totalAmountOfQty, 0, 31, ItemId, itemCode);
                        if ($scope.ActiveCompanyType == 26) {
                            $scope.IsPromotion = true;
                        }
                        else {
                            $scope.IsPromotion = false;
                        }
                        $scope.Allocation = 'NA';
                        $scope.ActualAllocation = 'NA';
                        break;
                    }
                    else {
                        $scope.RemovePromotionItem(currentOrder, itemCode);
                        $scope.Allocation = 'NA';
                        $scope.ActualAllocation = 'NA';
                    }
                }
            }
            else {
                $scope.Allocation = 'NA';
                $scope.ActualAllocation = 'NA';
            }
        }
        return addPromation;
    }

    $scope.CheckWetherTruckIsFull = function (currentOrder, totalWeightWithBuffer, truckSize, palettesWeight, totalWeightWithPalettes, ItemType) {

        var isFull = false;
        if ($scope.IsPalletLoadCheckValidation === true || $scope.IsWeightLoadCheckValidation === true) {
            var totalpalettesWeight = 0;
            for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
                if (currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
                    totalpalettesWeight += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
                }
            }
            var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
            $scope.PalettesCorrectWeight = parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes);
            totalpalettesWeight = Math.ceil(parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes));
            var totaltruckWeight = 0;
            for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
                totaltruckWeight += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
            }
            var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, '', 0, 0, '');
            var totalWeightWithPalettes = 0;
            var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'string');
            if (weightPerPalettes !== "") {
                if ($rootScope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                    totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes));
                }
                totaltruckWeight = totaltruckWeight + totalWeightWithPalettes;
            }

            var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
            var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();

            $scope.ReloadGraph(currentOrder, 0);
            if ($rootScope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {

                var pallet = between(parseFloat($scope.PalettesCorrectWeight), (parseFloat(palettesWeight) - parseFloat($scope.PalettesBufferWeight)), parseFloat(parseFloat(palettesWeight) + parseFloat(extraPaletteBufferWeight)));
                if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight)) || pallet) {
                    isFull = true;
                    $scope.LoadEnquiryAmountDetails(currentOrder[0].OrderProductList);
                }
            }
            else if ($scope.IsWeightLoadCheckValidation === true) {
                if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight))) {
                    isFull = true;
                    $scope.LoadEnquiryAmountDetails(currentOrder[0].OrderProductList);
                }
            } else {
                isFull = true;
                $scope.LoadEnquiryAmountDetails(currentOrder[0].OrderProductList);
            }
        } else {
            isFull = true;
            $scope.LoadEnquiryAmountDetails(currentOrder[0].OrderProductList);

        }

        return isFull;
    }

    $scope.RemovePromotionItem = function (currentOrder, ParentProductCode) {

        if (currentOrder.length > 0) {
            $scope.findAndRemove(currentOrder[0].OrderProductList, 'ParentProductCode', ParentProductCode, 'EnquiryProductId');
            if (currentOrder[0].OrderProductList.length === 1) {
                if (currentOrder[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                    currentOrder[0].OrderProductList = [];
                }
            }
        }
    }

    $scope.findAndRemove = function (array, property, value, primaryId) {
        for (i = 0; i < array.length; ++i) {
            if (array[i][property] === value) {
                if (array[i][primaryId] === 0) {
                    array.splice(i--, 1);
                }
                else {
                    array.splice(i--, 1);
                }
            }
        }

    };

    $scope.CheckForNewQty = function (itemId, ItemType, qty, productNameStr, numberOfExtraPallets) {

        var QtyArraynew = [];
        var truckfullintonr = $rootScope.TruckCapacityFullInTone;
        var palletsCorrcerwght = $scope.PalettesCorrectWeight;
        var extraTruckBufferWeight = $rootScope.TruckExtraBufferWeight();
        var extraPaletteBufferWeight = $rootScope.TruckExtraBufferPallet();
        var palettesWeight = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
        var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === $rootScope.EditedEnquiryId; });
        var editedItemQuantity = 0;

        if ($scope.IsItemEdit) {
            var item = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemId) === parseInt(itemId); });
            if (item.length > 0) {
                editedItemQuantity = item[0].ProductQuantity;
            } else {
                editedItemQuantity = 0;
            }
        }

        var avlPalletQty = 0;
        var pendingweight = 0;
        if (numberOfExtraPallets > 0) {
            //avlPalletQty = (((parseFloat(numbersofpalettes) * $scope.NumberOfExtraPalettes) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor)));
            avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor))) * numberOfExtraPallets;

        }
        else {
            avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * parseFloat(productNameStr[0].ConversionFactor));

        }

        var avlPallet = parseInt($scope.TruckCapacityPalettes) - (Math.ceil(palletsCorrcerwght));

        //var checkKegQtyOnePallets = parseFloat(productNameStr[0].ConversionFactor) * 2;
        //var checkKegWeightPerPallet = (parseFloat(checkKegQtyOnePallets) * parseFloat(productNameStr[0].WeightPerUnit)) + (palettesWeight * 2);

        var avlPalletWeight = 0;
        if ($scope.IsPalettesRequired) {
            avlPalletWeight = (palettesWeight * (Math.ceil(avlPallet)));
        }


        //var avlPalletBufferWeight = (palettesWeight * parseFloat(extraPaletteBufferWeight));
        //avlPalletWeight = avlPalletWeight - avlPalletBufferWeight;
        if (numberOfExtraPallets > 0) {
            //only for Keg
            pendingweight = ((parseFloat($scope.TruckCapacity)) - (parseFloat(truckfullintonr * 1000) + parseFloat(avlPalletWeight * numberOfExtraPallets)));
        }
        else {
            pendingweight = ((parseFloat($scope.TruckCapacity)) - (parseFloat(truckfullintonr * 1000) + parseFloat(avlPalletWeight)));

        }

        var avlWeightQty = parseFloat(parseFloat(pendingweight) + parseFloat(extraTruckBufferWeight)) / parseFloat(productNameStr[0].WeightPerUnit);
        QtyArraynew.push(parseInt(avlWeightQty));
        QtyArraynew.push(parseInt(avlPalletQty));

        var min = Math.min.apply(Math, QtyArraynew);

        min = parseInt(min) + parseInt(editedItemQuantity);


        if (parseInt(productNameStr[0].QtyPerLayer) > 0) {
            if ($scope.IsItemLayerAllow) {
                var g = parseInt((parseInt(min) / parseInt(productNameStr[0].QtyPerLayer)));
                $scope.IsItemLayerCheckQty = parseInt(g) * parseInt(productNameStr[0].QtyPerLayer);
                if ($scope.IsItemLayerCheckQty > $scope.CheckAllocatonPresent) {
                    var validQty = $scope.Allocation;
                }
                else {
                    var validQty = $scope.IsItemLayerCheckQty;
                }
            }
            else {
                var validQty = min;
            }

        }
        else {
            if ($scope.CheckAllocatonPresent != 'NA') {
                if (min > $scope.Allocation) {
                    var validQty = $scope.Allocation;
                }
                else {
                    var validQty = min;
                }
            }
            else {
                var validQty = min;
            }
        }

        return validQty;
    }

    //#endregion

    //#region Add Product 

    $scope.EnableAddItem = false;
    $scope.ItemField =
    {
        itemId: 0,
        inputItemsQty: 0
    };

    $scope.EnableAddItemSection = function () {
        debugger;
        //if ($scope.IsInEditMode && $scope.IsInEditModeForValidation) {
        $scope.ClearItemData();
        $scope.EnableAddItem = true;
        //} else {
        //  $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_ItemIsInEditMode), 'error', 8000);
        //}
    }

    $scope.predicates = {
        InputItem: '',
        FilterAutoCompletebox: ''
    };
    $scope.MaxPermissibleQuantity = 0;
    $scope.selectedRow = -1;
    $scope.showItembox = false;
    $rootScope.foundResult = false;

    $scope.ItemSearchInputDefaultSetting = function () {
        $scope.SearchControl = {
            InputItem: '',
            FilterAutoCompletebox: ''
        };
        $scope.selectedRow = -1;
        $scope.showItembox = false;
        $rootScope.foundResult = false;
    }
    $scope.ItemSearchInputDefaultSetting();
    $scope.ItemInputSelecteChangeEvent = function (input) {

        if (input.length > 0) {
            $scope.showItembox = true;
            $scope.selectedRow = 0;
        } else {
            $scope.showItembox = false;
            $scope.selectedRow = -1;
        }
        $scope.SearchControl.FilterAutoCompletebox = input;
    }
    $scope.ClearItemInputSearchbox = function () {

        $scope.Allocation = 'NA';
        $scope.showItembox = false;
        $scope.ClearItemRecord();
    }

    $scope.ClearItemData = function () {
        $scope.showItembox = false;
        $scope.Allocation = 'NA';
        $scope.ItemField.itemsName = "";
        $scope.ItemField.inputItemsQty = "";
        $scope.ItemField.itemId = "";
        $scope.selectedRow = -1;
        $scope.SearchControl.InputItem = "";
        $scope.SearchControl.FilterAutoCompletebox = "";
        $scope.EnquiryProductGUID = "";
        $scope.disableInput = false;
        $scope.ItemPrices = 0;
        $scope.ItemDepositeAmount = 0;
        $scope.UOM = '-';
        $scope.MaxPermissibleQuantity = '-';
        $scope.IsItemEdit = false;
        $scope.IsItemLayerAllow = false;
    }

    $scope.ClearItemRecord = function () {
        $scope.EnableAddItem = false;
        $scope.ClearItemData();
        $scope.CalculateDeliveryUsedCapacity();
        focus('ItemListAutoCompleteBox_value');
    }

    $scope.RemoveInputFocus = function () {
        debugger;
        focus('setfocusoninput');
    }
    //#endregion

    //#region truck full message 

    $ionicModal.fromTemplateUrl('AddTruck.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.AddTruckControl = modal;
    });
    $scope.CloseAddTruckControl = function () {
        focus('RemoveEnterEvent');
        $scope.AddTruckControl.hide();
    };
    $scope.OpenAddTruckControl = function () {
        focus('AddEnterEvent');
        var dd = $scope.AddTruckControl;
        if (!dd._isShown) {
            $scope.AddTruckControl.show();
        }
    };

    $scope.CloseAddFinalize = function () {

        var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === $rootScope.EditedEnquiryId; });
        if (currentOrder.length > 0) {
            currentOrder[0].IsTruckFull = true;
        }
        $scope.AddTruckControl.hide();

    }

    $scope.ClearItem = function () {

        $scope.ClearItemRecord();
    }


    $scope.ClearEditedItem = function (enquiryId, itemId, EnquiryProductGUID) {

        var currentOrder = $scope.OrderData.filter(function (el) { return el.EnquiryId === enquiryId; });

        if (currentOrder.length > 0) {
            if (currentOrder[0].OrderProductList.length > 0) {
                var productNameStr = currentOrder[0].OrderProductList.filter(function (el) { return el.EnquiryProductGUID === EnquiryProductGUID & parseInt(el.GratisOrderId) === 0; });
                $scope.IsItemEdit = false;
                if (productNameStr.length > 0) {
                    productNameStr[0].IsOrderItemEdited = false;
                    productNameStr[0].ProductQuantity = productNameStr[0].PreviousProductQuantity;
                }
            }
        }
        $scope.Allocation = 'NA';
        //if ($scope.IsInEditMode && $scope.IsInEditModeForValidation) {
        //}
        //else {
        //$scope.IsInEditMode = false;
        //$scope.IsInEditModeForValidation = false;
        //}
        $scope.ClearItemRecord();
    }

    //#endregion

    $scope.CloseEnquiryDetailAccordion = function () {
        debugger;
        //if ($scope.IsInEditMode == false && $scope.IsInEditModeForValidation == false) {

        if ($scope.CurrentOpenMasterDetailsObject !== "") {
            $scope.CurrentOpenMasterDetailsObject.component.collapseRow($scope.PreviousExpandedRow);
            $scope.IsEnquiryEdit = false;
            $scope.EnableAddItem = false;
            $scope.ClearItemData();
        }
        //}
        // else {
        //    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApprovalGrid_AccordionInEditMode), 'error', 8000);
        // }
    }

    $rootScope.IsEditedFromEnquiryList = false;

    $scope.AdvanceEdit = function (OrderGUID) {
        debugger;
        //if ($scope.IsInEditMode == false && $scope.IsInEditModeForValidation == false) {
        $rootScope.Throbber.Visible = true;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
        if (currentOrder.length > 0) {
            if ($rootScope.RoleName === "CustomerService") {

                $rootScope.IsEnquiryEditedByCustomerService = true;

                $rootScope.TempCompanyId = currentOrder[0].CustomerId;
                $rootScope.TempCompanyMnemonic = $rootScope.CompanyMnemonic;
                $rootScope.BranchPlantCodeEdit = currentOrder[0].BranchPlantCode;

                $rootScope.CurrentOrderRoleId = currentOrder[0].RoleId;
                $rootScope.CurrentOrderLoginId = currentOrder[0].LoginId;


                $sessionStorage.IsEnquiryEditedByCustomerService = true;
                $sessionStorage.TempCompanyId = currentOrder[0].CustomerId;
                $sessionStorage.TempCompanyMnemonic = $rootScope.CompanyMnemonic;
                $sessionStorage.BranchPlantCodeEdit = currentOrder[0].BranchPlantCode;
                $sessionStorage.CurrentOrderRoleId = currentOrder[0].RoleId;
                $sessionStorage.CurrentOrderLoginId = currentOrder[0].LoginId;


                for (var j = 0; j < currentOrder[0].OrderProductList.length; j++) {
                    if (currentOrder[0].OrderProductList[j].IsPackingItem === "1") {

                        var requestforForPalletConsumptionAndValidation =
                        {
                            ServicesAction: 'GetRuleValue',
                            CompanyId: $rootScope.CompanyId,
                            CompanyMnemonic: $rootScope.CompanyMnemonic,
                            DeliveryLocation: {
                                LocationId: $rootScope.DeliveryLocationId,
                                DeliveryLocationCode: $rootScope.DeliveryLocationCode,
                                LocationCode: $rootScope.DeliveryLocationCode,

                            },
                            Enquiry: {
                                EnquiryType: currentOrder[0].EnquiryType,

                            },
                            Company: {
                                CompanyId: $rootScope.CompanyId,
                                CompanyMnemonic: $rootScope.CompanyMnemonic,
                            },

                            Role: {
                                RoleName: $rootScope.RoleName,
                            },
                            Item: {
                                ItemId: parseInt(currentOrder[0].OrderProductList[j].ItemId),
                                SKUCode: currentOrder[0].OrderProductList[j].ProductCode,
                            },

                            RuleType: 30,


                        };


                        var jsonobjectForForEditPalletValidation = {};
                        jsonobjectForForEditPalletValidation.Json = requestforForPalletConsumptionAndValidation;
                        var responseForForEditPalletAndValidation = GrRequestService.ProcessRequest(jsonobjectForForEditPalletValidation);


                        $q.all([

                            responseForForEditPalletAndValidation
                        ]).then(function (resp) {

                            debugger;




                            var responseFoLoadRuleForEdtiPalletConsumptionAndValidation = resp[0];


                            if (responseFoLoadRuleForEdtiPalletConsumptionAndValidation !== undefined) {
                                if (responseFoLoadRuleForEdtiPalletConsumptionAndValidation.data !== undefined) {

                                    $scope.IsPalletSpaceLoadCheckVisibility = responseFoLoadRuleForEdtiPalletConsumptionAndValidation.data.Json;
                                    if (responseFoLoadRuleForEdtiPalletConsumptionAndValidation.data.Json.RuleValue != '' && responseFoLoadRuleForEdtiPalletConsumptionAndValidation.data.Json.RuleValue != undefined) {
                                        var rulevalue = parseInt(responseFoLoadRuleForEdtiPalletConsumptionAndValidation.data.Json.RuleValue);
                                        $scope.EditPaletteCount = rulevalue;
                                    }



                                    if ($scope.EditPaletteCount == "1") {
                                        $rootScope.IsPaletteEditRequiredForSO = true;
                                    } else {
                                        $rootScope.IsPaletteEditRequiredForSO = false;
                                    }


                                }
                            }


                        });
                    }
                }


            } else {
                $rootScope.IsEnquiryEditedByCustomerService = false;
                $sessionStorage.IsEnquiryEditedByCustomerService = false;
            }



            $rootScope.IsEditedFromEnquiryList = true;
            $rootScope.CompanyZone = currentOrder[0].CompanyZone;
            $rootScope.EnquiryCompanyType = currentOrder[0].CompanyType;
            $sessionStorage.EnquiryCompanyType = currentOrder[0].CompanyType;

            $rootScope.EditEnquiryAutoNumber = currentOrder[0].EnquiryAutoNumber;
            $rootScope.TypeOfWay = currentOrder[0].TypeOfWay;
            $rootScope.IsAdvanceEdit = true;
            $rootScope.EditEnquiry = true;
            $rootScope.isEnquiryEdit = true;
            $rootScope.SavedEditEnquiry = true;
            $rootScope.CurrentOrderGuid = OrderGUID;
            $rootScope.TemOrderData = $scope.OrderData;


            $sessionStorage.EditEnquiryAutoNumber = currentOrder[0].EnquiryAutoNumber;
            $rootScope.TypeOfWay = currentOrder[0].TypeOfWay;
            $sessionStorage.IsAdvanceEdit = true;

            currentOrder[0].NumberOfPalettes = $scope.NumberOfPalletString;

            $sessionStorage.EditEnquiry = true;
            $sessionStorage.isEnquiryEdit = true;
            $sessionStorage.SavedEditEnquiry = true;
            $sessionStorage.CurrentOrderGuid = OrderGUID;
            $sessionStorage.TemOrderData = $scope.OrderData;



            var requestData =
            {
                ServicesAction: 'LoadRelatedEnquiryByEnquiryId',
                EnquiryId: currentOrder[0].EnquiryId,
                RoleId: $rootScope.RoleId,
                CultureId: $rootScope.CultureId,
                UserId: $rootScope.UserId

            };
            var consolidateApiParamater =
            {
                Json: requestData,
            };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                if (response.data !== undefined) {
                    if (response.data.Json !== undefined) {
                        if (response.data.Json.EnquiryList !== undefined) {

                            currentOrder[0].IsRPMAdded = true;
                            for (var re = 0; re < response.data.Json.EnquiryList.length; re++) {
                                var RelatedEnquiry = response.data.Json.EnquiryList[re];



                                var CurrentOrderGuid = generateGUID();

                                var EnquiryProductList = [];
                                if (RelatedEnquiry.EnquiryProductList !== undefined) {
                                    EnquiryProductList = RelatedEnquiry.EnquiryProductList;
                                    for (var i = 0; i < EnquiryProductList.length; i++) {
                                        EnquiryProductList[i].ProductQuantity = parseInt(EnquiryProductList[i].ProductQuantity);
                                        EnquiryProductList[i].PreviousProductQuantity = parseInt(EnquiryProductList[i].ProductQuantity);
                                        EnquiryProductList[i].OldProductQuantity = parseInt(EnquiryProductList[i].ProductQuantity);
                                        EnquiryProductList[i].EnquiryProductGUID = generateGUID();
                                        EnquiryProductList[i].OrderGUID = CurrentOrderGuid;
                                        EnquiryProductList[i].CurrentStockPosition = parseFloat(EnquiryProductList[i].CurrentStockPosition);
                                        EnquiryProductList[i].IsPalletRequiredToEdit = true;
                                        EnquiryProductList[i].IsOrderItemEdited = false;
                                        var remainingProductStock = parseFloat(parseFloat(EnquiryProductList[i].CurrentStockPosition) - parseFloat(EnquiryProductList[i].UsedQuantityInEnquiry));
                                        if (parseFloat(EnquiryProductList[i].ProductQuantity) < remainingProductStock) {
                                            EnquiryProductList[i].IsItemAvailableInStock = true;
                                        } else {
                                            EnquiryProductList[i].IsItemAvailableInStock = false;
                                        }

                                        if (EnquiryProductList[i].IsPackingItem === "1") {
                                            EnquiryProductList[i].PaletteWeightDisplay = EnquiryProductList[i].CurrentItemTruckCapacityFullInTone;
                                        }


                                    }

                                }

                                var orders = {
                                    OrderGUID: CurrentOrderGuid,
                                    EnquiryId: RelatedEnquiry.EnquiryId,
                                    TotalWeight: 0,
                                    TruckCapacity: RelatedEnquiry.TruckCapacityWeight,
                                    TruckPallets: 0,
                                    TotalProductPallets: 0,
                                    EnquiryAutoNumber: RelatedEnquiry.EnquiryAutoNumber,
                                    NumberOfPalettes: RelatedEnquiry.NumberOfPalettes,
                                    PalletSpace: RelatedEnquiry.PalletSpace,
                                    TruckWeight: RelatedEnquiry.TruckWeight,
                                    SoldTo: RelatedEnquiry.CompanyId,
                                    ShipTo: RelatedEnquiry.ShipTo,
                                    ShipToCode: RelatedEnquiry.ShipToCode,
                                    TruckCapacityPalettes: RelatedEnquiry.TruckCapacityPalettes,
                                    RequestDate: $filter('date')(RelatedEnquiry.RequestDate, "dd/MM/yyyy"),
                                    EnquiryDate: RelatedEnquiry.EnquiryDate,
                                    TruckCapacityWeight: RelatedEnquiry.TruckCapacityWeight,
                                    Capacity: RelatedEnquiry.Capacity,
                                    IsRecievingLocationCapacityExceed: RelatedEnquiry.IsRecievingLocationCapacityExceed,
                                    ReceivedCapacityPalettesCheck: 0,
                                    ReceivedCapacityPalettes: 0,
                                    CustomerId: RelatedEnquiry.CompanyId,
                                    CompanyZone: RelatedEnquiry.CompanyZone,
                                    CompanyType: RelatedEnquiry.CompanyType,
                                    PONumber: RelatedEnquiry.PONumber,
                                    SONumber: RelatedEnquiry.SONumber,
                                    PickDateTime: RelatedEnquiry.PickDateTime,
                                    BranchPlantCode: RelatedEnquiry.StockLocationId,
                                    TruckCapacity: RelatedEnquiry.Capacity,
                                    CurrentState: RelatedEnquiry.CurrentState,
                                    NoOfDays: RelatedEnquiry.Field8,
                                    EnquiryType: RelatedEnquiry.EnquiryType,
                                    IsTruckFull: true,
                                    IsActive: true,
                                    IsTruckShow: true,
                                    IsMixedSKuInRPM: false,
                                    RPM: "1",
                                    RelatedRPMGUIDId: currentOrder[0].OrderGUID,
                                    TruckSizeId: RelatedEnquiry.TruckSizeId,
                                    Priority: 0,
                                    RoleId: RelatedEnquiry.RoleId,
                                    LoginId: RelatedEnquiry.loginId,
                                    NoteList: RelatedEnquiry.NoteList,
                                    OrderProductList: EnquiryProductList,
                                    ReturnPakageMaterialList: [],
                                };
                                $scope.OrderData.push(orders);


                            }
                            $sessionStorage.TemOrderData = $scope.OrderData;
                            $rootScope.TemOrderData = $scope.OrderData;

                            if (currentOrder[0].EnquiryType == 'RPM') {
                                $rootScope.RedirectPage('CreateRPM', 'Create RPM');
                            } else {
                                $rootScope.RedirectPage('CreateInquiryPage', 'Create Enquiry');
                            }
                        } else {
                            $sessionStorage.TemOrderData = $scope.OrderData;
                            $rootScope.TemOrderData = $scope.OrderData;
                            if (currentOrder[0].EnquiryType == 'RPM') {
                                $rootScope.RedirectPage('CreateRPM', 'Create RPM');
                            } else {
                                $rootScope.RedirectPage('CreateInquiryPage', 'Create Enquiry');
                            }
                        }
                    } else {
                        $sessionStorage.TemOrderData = $scope.OrderData;
                        $rootScope.TemOrderData = $scope.OrderData;

                        if (currentOrder[0].EnquiryType == 'RPM') {
                            $rootScope.RedirectPage('CreateRPM', 'Create RPM');
                        } else {
                            $rootScope.RedirectPage('CreateInquiryPage', 'Create Enquiry');
                        }
                    }
                }
                else {
                    $sessionStorage.TemOrderData = $scope.OrderData;
                    $rootScope.TemOrderData = $scope.OrderData;
                    if (currentOrder[0].EnquiryType == 'RPM') {
                        $rootScope.RedirectPage('CreateRPM', 'Create RPM');
                    } else {
                        $rootScope.RedirectPage('CreateInquiryPage', 'Create Enquiry');
                    }

                }
            });
        }
        //}
        //else {
        //  $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApprovalGrid_AccordionInEditMode), 'error', 8000);
        //}
    }







    // Product Multiselect Autocomplete box.

    $scope.MultiSelectDropdownSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }

    $scope.LoadProducts = function () {
        var requestData =
        {
            ServicesAction: 'LoadAllProducts',
            CompanyId: $rootScope.CompanyId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.ProductList = resoponsedata.Item.ItemList;
            $scope.bindallproduct = resoponsedata.Item.ItemList;

        });
    }

    //$scope.LoadProducts();


    $scope.SearchEnquiryByProductName = function () {


        $scope.ProductCodes = '';
        if ($scope.ProductSelectedList.length > 0 || $scope.AreaSelectedList.length > 0 || $scope.BranchPlantCodeSelectedList.length > 0 || $scope.CarrierCodeSelectedList.length > 0 || $scope.TruckSizeSelectedList.length > 0) {

            $scope.ProductCodes = "";
            for (var i = 0; i < $scope.ProductSelectedList.length; i++) {
                $scope.ProductCodes = $scope.ProductCodes + "," + $scope.ProductSelectedList[i].Id;
            }

            if ($scope.ProductSelectedList.length > 0) {
                $scope.ProductCodes = $scope.ProductCodes.substr(1);
            }

            $scope.Areas = "";
            for (var i = 0; i < $scope.AreaSelectedList.length; i++) {
                $scope.Areas = $scope.Areas + "," + "'" + $scope.AreaSelectedList[i].Id + "'";
            }

            if ($scope.AreaSelectedList.length > 0) {
                $scope.Areas = $scope.Areas.substr(1);
            }

            $scope.BranchPlantCodes = "";
            for (var i = 0; i < $scope.BranchPlantCodeSelectedList.length; i++) {
                $scope.BranchPlantCodes = $scope.BranchPlantCodes + "," + "'" + $scope.BranchPlantCodeSelectedList[i].Id + "'";
            }

            if ($scope.BranchPlantCodeSelectedList.length > 0) {
                $scope.BranchPlantCodes = $scope.BranchPlantCodes.substr(1);
            }

            $scope.CarrierCodes = "";
            for (var i = 0; i < $scope.CarrierCodeSelectedList.length; i++) {
                $scope.CarrierCodes = $scope.CarrierCodes + "," + "'" + $scope.CarrierCodeSelectedList[i].Id + "'";
            }

            if ($scope.CarrierCodeSelectedList.length > 0) {
                $scope.CarrierCodes = $scope.CarrierCodes.substr(1);
            }

            $scope.TruckSizes = "";
            for (var i = 0; i < $scope.TruckSizeSelectedList.length; i++) {
                $scope.TruckSizes = $scope.TruckSizes + "," + "'" + $scope.TruckSizeSelectedList[i].Id + "'";
            }

            if ($scope.TruckSizeSelectedList.length > 0) {
                $scope.TruckSizes = $scope.TruckSizes.substr(1);
            }

            $scope.RefreshDataGrid();

        } else {

            $scope.RefreshDataGrid();
        }

    }




    $scope.ProductSearchCriteria = "";
    $scope.SearchEnquiryIncludeByProductName = function () {
        debugger;
        $scope.AreasSearchCriteria = "Include";
        $scope.BranchPlantCodesSearchCriteria = "Include";
        $scope.CarrierCodesSearchCriteria = "Include";
        $scope.TruckSizesSearchCriteria = "Include";
        $scope.ProductSearchCriteria = "Include";

        $scope.SearchEnquiryByProductName();
    }

    $scope.SearchEnquiryExcludeByProductName = function () {
        debugger;
        $scope.AreasSearchCriteria = "Exclude";
        $scope.BranchPlantCodesSearchCriteria = "Exclude";
        $scope.CarrierCodesSearchCriteria = "Exclude";
        $scope.TruckSizesSearchCriteria = "Exclude";
        $scope.ProductSearchCriteria = "Exclude";
        $scope.SearchEnquiryByProductName();
    }

    $scope.ClearProductSearch = function () {
        debugger;
        $scope.Areas = "";
        $scope.AreasSearchCriteria = "";
        $scope.BranchPlantCodes = "";
        $scope.BranchPlantCodesSearchCriteria = "";
        $scope.CarrierCodes = "";
        $scope.CarrierCodesSearchCriteria = "";
        $scope.TruckSizes = "";
        $scope.TruckSizesSearchCriteria = "";
        $scope.ProductSearchCriteria = "";
        $scope.ProductCodes = "";
        $scope.ProductSelectedList = [];
        $scope.AreaSelectedList = [];
        $scope.BranchPlantCodeSelectedList = [];
        $scope.CarrierCodeSelectedList = [];
        $scope.TruckSizeSelectedList = [];
        $scope.RefreshDataGrid();
    }


    // View RPM Functionality
    $scope.ViewReturnPakageMaterialListData = [];
    $ionicModal.fromTemplateUrl('templates/ShowRPMQuantity.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        debugger;
        $scope.ViewRPMQuantitypopup = modal;
    });
    $scope.ShowRPMItemCollection = function () {

        $scope.ViewRPMQuantitypopup.show();
    }
    $scope.CloseViewRPMQuantitypopup = function () {
        debugger;
        $scope.ViewRPMQuantitypopup.hide();
    }


    $scope.OpenModelPoppupRPM = function (enquiryId) {
        debugger;

        var requestData =
        {
            ServicesAction: 'GetRPMByEnquiryId',
            EnquiryId: enquiryId
        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (NotesResponse) {

            var NotesResponsedata = NotesResponse.data;

            if (NotesResponsedata.Json !== undefined) {
                var notesData = NotesResponsedata.Json.ReturnPakageMaterialList;
                $scope.ViewReturnPakageMaterialListData = notesData;
                $scope.ShowRPMItemCollection();
            }
            else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_NoRecordFoundRPM), 'error', 3000);
            }
        });
    }


    $scope.SelectedPromisedDate = {
        PromisedDateForSelected: ''

    }
    $scope.SelectedCollectionDate = {
        CollectionDateForSelected: ''

    }



    //#region Update Promised Date
    $scope.ChangePromisedDatePopupHtml = false;

    $scope.OpenChangePRomisedDatePopupList = function (enquiryDetails, eventName) {
        debugger;
        $rootScope.EnquiryDetailsForAction = enquiryDetails;
        $rootScope.ReasonCodeEventName = eventName;
        $scope.ChangePromisedDatePopupHtml = true;


    }
    $scope.CloseChangePRomisedDatePopup = function () {
        debugger;

        $scope.SearchControl.InputPromisedDate = "";

        $scope.ChangePromisedDatePopupHtml = false;
        $rootScope.CloseReasoncodepopup();
    }



    //#region Update Promised Date

    $scope.ChangeCollectionDatePopupHtml = false;

    $scope.OpenChangeCollectionDatePopupList = function (enquiryDetails, eventName) {
        debugger;
        $rootScope.EnquiryDetailsForAction = enquiryDetails;
        $rootScope.ReasonCodeEventName = eventName;
        $scope.ChangeCollectionDatePopupHtml = true;


    }
    $scope.CloseChangeCollectionDatePopup = function () {
        debugger;

        $scope.SelectedCollectionDate.CollectionDateForSelected = "";

        $scope.ChangeCollectionDatePopupHtml = false;
        $rootScope.CloseReasoncodepopup();
    }

    $scope.OpenChangePromisedDatePopup = function () {

        debugger;
        var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
        if (enquiryDetails.length > 0) {

            var ordersNumber = "";
            for (var i = 0; i < enquiryDetails.length; i++) {

                var pickupdate = new Date(enquiryDetails[i].PickDateTime);

                var newdatevalue = new Date();
                var dd1 = newdatevalue.getDate();
                var mm1 = newdatevalue.getMonth() + 1;
                var y1 = newdatevalue.getFullYear();
                var newdateformate = mm1 + '/' + dd1 + '/' + y1 + ' 00:00:00';
                var newdateformatevalue = $filter('date')(newdateformate, "dd/MM/yyyy");
                newdateformatevalue = new Date(newdateformatevalue);


                if (newdateformatevalue > pickupdate) {
                    ordersNumber = enquiryDetails[i].EnquiryAutoNumber + "," + ordersNumber;
                }
            }
            if (ordersNumber === "") {
                $rootScope.LoadReasonCode("ChangePromisedDateReason");
                $scope.OpenChangePRomisedDatePopupList(enquiryDetails, "ChangedPromisedDate");
            } else {
                ordersNumber = ordersNumber.replace(/,\s*$/, "");
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_EnquiryList_PickupDateValidate, ordersNumber), 'error', 8000);
            }
        }
        else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PleaseSelectEnquiry), 'error', 3000);
        }
    };



    $scope.OpenChangeCollectionDatePopup = function () {

        debugger;
        var enquiryDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true; });
        if (enquiryDetails.length > 0) {
            $rootScope.LoadReasonCode("ChangeCollectionDateReason");
            $scope.OpenChangeCollectionDatePopupList(enquiryDetails, "ChangedCollectionDate");
        }
        else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PleaseSelectEnquiry), 'error', 3000);
        }
    };


    //$scope.SavePromisedDateForSelectedEnquiry = function () {
    //    debugger;
    //    if ($scope.SelectedPromisedDate.PromisedDateForSelected !== "") {
    //        $rootScope.Throbber.Visible = true;
    //        $scope.SelectedEnquiryId = "";
    //        var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
    //        if (orderDetails.length > 0) {
    //            var objectList = [];
    //
    //            for (var i = 0; i < orderDetails.length; i++) {
    //                debugger;
    //
    //                var object = {};
    //                object.ObjectId = orderDetails[i].EnquiryId;
    //
    //                objectList.push(object);
    //            }
    //
    //            var mainObject = {};
    //            mainObject.ObjectList = objectList;
    //            mainObject.ObjectType = "Order";
    //            mainObject.ReasonCodeEventName = "ChangePromisedDate";
    //            mainObject.FunctionName = "UpdatePromisedDateForSelectorder";
    //            mainObject.FunctionParameter = orderDetails;
    //            $rootScope.SaveReasonCode(mainObject);
    //            $rootScope.Throbber.Visible = false;
    //            $rootScope.CloseReasoncodepopup();
    //        }
    //
    //    }
    //    else {
    //        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);
    //    }
    //}



    $scope.SavePromisedDateForSelectedEnquiry = function () {
        debugger;
        if ($scope.SelectedPromisedDate.PromisedDateForSelected !== "") {
            $rootScope.Throbber.Visible = true;

            var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
            if (orderDetails.length > 0) {

                var objectList = [];

                for (var i = 0; i < orderDetails.length; i++) {


                    var object = {};
                    object.ObjectId = orderDetails[i].EnquiryId;

                    objectList.push(object);
                }

                var mainObject = {};
                mainObject.ObjectList = objectList;
                mainObject.ObjectType = "Enquiry";
                mainObject.ReasonCodeEventName = "UpdateRequestDate";
                $rootScope.SaveReasonCode(mainObject);

                if ($rootScope.ReasonCodeEntered === false) {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectReasonCode), 'error', 3000);
                    return false;
                }

                for (var j = 0; j < orderDetails.length; j++) {
                    var expectedTimeOfDelivery = $filter('date')($scope.SelectedPromisedDate.PromisedDateForSelected, "dd/MM/yyyy");
                    $scope.GetCollectionPickupDateForBulk(orderDetails[j], orderDetails[j].ShipToCode, orderDetails[j].SoldToCode, expectedTimeOfDelivery);
                }

                $scope.CloseChangePRomisedDatePopup();
                $rootScope.CloseReasoncodepopup();
                $rootScope.Throbber.Visible = false;
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_RequestDateUpdated), '', 3000);
                $scope.RefreshDataGrid();

            }



        }
        else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectRequestDate), 'error', 3000);
        }
    }



    $scope.GetCollectionPickupDateForBulk = function (orderDetails, deliveryLocationCode, activeCompanyMnemonic, requestedDate) {

        $scope.CollectionPickupDate = "";

        debugger;
        var requestData =
        {
            ServicesAction: 'GetCollectionPickUpDateForGrid',
            DeliveryLocation: {
                LocationId: deliveryLocationCode,
                DeliveryLocationCode: deliveryLocationCode,
                LocationCode: deliveryLocationCode
            },
            Company: {
                CompanyId: activeCompanyMnemonic,
                CompanyMnemonic: activeCompanyMnemonic,
            },
            Supplier: {
                CompanyId: activeCompanyMnemonic,
                CompanyMnemonic: activeCompanyMnemonic,
            },
            RuleType: 1,
            CompanyId: activeCompanyMnemonic,
            CompanyMnemonic: activeCompanyMnemonic,
            Order: {
                OrderTime: "",
                OrderDate: "",
                RequestTime: 0,
                RequestedDate: $filter('date')(requestedDate, "dd/MM/yyyy")
            }
        };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            debugger;
            var responseStr = response.data.Json;
            $rootScope.Throbber.Visible = false;
            var someDate1 = new Date();
            var currentDateList = $filter('date')(someDate1, "dd/MM/yyyy 00:00:00");

            if (responseStr.CollectionDate === '' || responseStr.CollectionDate === undefined || responseStr.CollectionDate === null) {
                var numberOfDaysToAdd = $scope.LoadSettingInfoByName('CollectionPickupDate', 'int');

                if (numberOfDaysToAdd !== "") {

                    var requestedDateTemp = $filter('date')(requestedDate, "dd/MM/yyyy 00:00:00");
                    var dateTemp = "";
                    dateTemp = requestedDateTemp.split(" ");
                    var dateformatTemp = dateTemp[0].split('/');

                    var someDate = new Date(dateformatTemp[2], dateformatTemp[1] - 1, dateformatTemp[0]);
                    someDate.setDate(someDate.getDate() - numberOfDaysToAdd);
                    var dd = someDate.getDate();
                    var mm = someDate.getMonth() + 1;
                    var y = someDate.getFullYear();
                    //var hours = someDate.getHours().toString();
                    //hours = (hours.length === 1) ? ("0" + hours) : hours;
                    //
                    //var minutes = someDate.getMinutes().toString();
                    //minutes = (minutes.length === 1) ? ("0" + minutes) : minutes;

                    var someFormattedDate = dd + '/' + mm + '/' + y + ' 00:00:00';

                    $scope.CollectionPickupDate = someFormattedDate;
                    //$rootScope.NoOfCollectionDays = numberOfDaysToAdd;

                    var collectionDateList1 = $scope.ConvertDatetImeToUTCDateTimeFormat($filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy"));

                    if (collectionDateList1 < $scope.ConvertDatetImeToUTCDateTimeFormat(currentDateList)) {
                        $scope.CollectionPickupDate = currentDateList;
                    }
                    else if (collectionDateList1 > $scope.ConvertDatetImeToUTCDateTimeFormat(requestedDate)) {
                        $scope.CollectionPickupDate = currentDateList;
                    }

                }
                else {
                    $scope.CollectionPickupDate = "";
                    //$rootScope.NoOfCollectionDays = '0';
                }

            }
            else {

                debugger;

                $scope.CollectionPickupDate = responseStr.CollectionDate;
                var collectionDateList = $scope.ConvertDatetImeToUTCDateTimeFormat($filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy"));

                if (collectionDateList < $scope.ConvertDatetImeToUTCDateTimeFormat(currentDateList)) {
                    $scope.CollectionPickupDate = currentDateList;
                }
                else if (collectionDateList > $scope.ConvertDatetImeToUTCDateTimeFormat(requestedDate)) {
                    $scope.CollectionPickupDate = currentDateList;
                }

                //$rootScope.NoOfCollectionDays = responseStr.NoOfCollectionDays.replace(/\"\'/g, "");
            }

            debugger;
            var selectedOrderId = "";

            selectedOrderId = orderDetails.EnquiryId;

            var collectionPickupDate = $filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy 00:00:00");
            var requestedDateNew = $filter('date')(requestedDate, "dd/MM/yyyy 00:00:00");

            if (collectionPickupDate !== "" && typeof collectionPickupDate !== "undefined") {
                var date = "";
                date = collectionPickupDate.split(" ");
                var dateformat = date[0].split('/');

                collectionPickupDate = dateformat[2] + "-" + dateformat[1] + "-" + dateformat[0] + " 00:00:00";

            }

            if (requestedDateNew !== "" && typeof requestedDateNew !== "undefined") {
                var date1 = "";
                date1 = requestedDateNew.split(" ");
                var dateformat1 = date1[0].split('/');

                requestedDateNew = dateformat1[2] + "-" + dateformat1[1] + "-" + dateformat1[0] + " 00:00:00";

            }

            var enquiryList = {
                RequestedDate: requestedDateNew,
                PickDateTime: collectionPickupDate,
                EnquiryId: selectedOrderId
            }
            var requestData =
            {
                ServicesAction: 'UpdateRequestedDateForParticularEnquiry',
                EnquiryDetailList: enquiryList
            };
            var consolidateApiParamater =
            {
                Json: requestData,
            };
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response1) {
                $scope.RefreshDataGrid();
            });

        });
    };



    $scope.SaveCollectionDateForSelectedEnquiry = function () {
        debugger;
        if ($scope.SelectedCollectionDate.CollectionDateForSelected !== "") {
            $rootScope.Throbber.Visible = true;
            $scope.SelectedEnquiryId = "";
            var orderDetails = $scope.SalesAdminApprovalList.filter(function (el) { return el.CheckedEnquiry === true && el.CurrentState !== "999"; });
            if (orderDetails.length > 0) {
                var objectList = [];

                for (var i = 0; i < orderDetails.length; i++) {
                    debugger;

                    var object = {};
                    object.ObjectId = orderDetails[i].EnquiryId;

                    objectList.push(object);
                }

                var mainObject = {};
                mainObject.ObjectList = objectList;
                mainObject.ObjectType = "Order";
                mainObject.ReasonCodeEventName = "ChangeCollectionDate";
                mainObject.FunctionName = "UpdateCollectionDateForSelectorder";
                mainObject.FunctionParameter = orderDetails;
                $rootScope.SaveReasonCode(mainObject);
                $rootScope.Throbber.Visible = false;
                $rootScope.CloseReasoncodepopup();
            }

        }
        else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMOrderPage_SelectPickupDateForBulkOrder), 'error', 3000);
        }
    }



    $scope.UpdatePromisedDateForSelectorder = function (orderDetails) {
        var selectedOrderId = "";

        for (var i = 0; i < orderDetails.length; i++) {
            selectedOrderId = selectedOrderId + ',' + orderDetails[i].EnquiryId;
        }
        selectedOrderId = selectedOrderId.substr(1);

        var orderList = {
            PromisedDate: $scope.SelectedPromisedDate.PromisedDateForSelected,
            OrderId: selectedOrderId,
        }

        var requestData =
        {
            ServicesAction: 'UpdateOrderPromisedDate',
            OrderDetailList: orderList
        };

        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
        {
            Json: requestData,
        };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            $scope.CloseChangePRomisedDatePopup();

            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_PromisedDateUpdated), '', 3000);
            $scope.RefreshDataGrid();
        });
    }




    $scope.UpdateCollectionDateForSelectorder = function (orderDetails) {
        var selectedOrderId = "";

        for (var i = 0; i < orderDetails.length; i++) {
            selectedOrderId = selectedOrderId + ',' + orderDetails[i].EnquiryId;
        }
        selectedOrderId = selectedOrderId.substr(1);

        var orderList = {
            CollectionDate: $scope.SelectedCollectionDate.CollectionDateForSelected,
            OrderId: selectedOrderId,
        }

        var requestData =
        {
            ServicesAction: 'UpdateOrderCollectionDate',
            OrderDetailList: orderList
        };

        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
        {
            Json: requestData,
        };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            $scope.CloseChangeCollectionDatePopup();

            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_CollectionDateUpdated), '', 3000);
            $scope.RefreshDataGrid();
        });
    }



    $scope.BindPromisedDateFrom = function () {

        $('#PromisedDate').each(function () {
            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id !== undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');

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
        $('#PromisedDate').datepicker("show");
    }



    $scope.BindCollectionDateFrom = function () {

        $('#CollectionDate').each(function () {
            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id !== undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');

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
        $('#CollectionDate').datepicker("show");
    }



    //#region Delete Add Grid Data with Confirmation
    $ionicModal.fromTemplateUrl('WarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.DeleteWarningMessageControl = modal;
    });


    //#region Delete Add Grid Data with Confirmation
    //$ionicModal.fromTemplateUrl('ViewImage.html', {
    //    scope: $scope,
    //    animation: 'fade-in',
    //    backdropClickToClose: false,
    //    hardwareBackButtonClose: false
    //}).then(function (modal) {

    //    $scope.ViewImageControl = modal;
    //});

    //$scope.CloseViewImage = function () {
    //    $scope.ViewImageControl.hide();
    //    $scope.ViewLogo = '';

    //};
    $scope.OpenDeleteConfirmation = function () {

        $scope.DeleteWarningMessageControl.show();
    };
    $scope.CloseDeleteConfirmation = function () {
        $scope.DeleteWarningMessageControl.hide();
    };

    $scope.Delete_AddCompany = function (Id) {
        debugger;
        $scope.SelectedId_EnquiryGrid = Id;
        $scope.DeleteWarningMessageControl.show();
    }

    $scope.DeleteYes = function () {
        var requestData =
        {
            ServicesAction: 'DeleteEnquiry',
            EnquiryId: $scope.SelectedId_EnquiryGrid,
            UserId: $rootScope.UserId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.CloseDeleteConfirmation();
            $scope.RefreshDataGrid();
        });
    }

    $rootScope.LoadEmptiesMessage = function (message, param1, param2) {

        return String.format(message, param1, param2);
    }





    //#region Update Particular Enquiry Branch Plant
    $ionicModal.fromTemplateUrl('templates/ChangeBranchPlantParticularRowCode.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ChangeBranchPlantParticularRowCode = modal;
    });

    $scope.OpenChangeBranchPlantParticularRowCodePopup = function () {

        $scope.ChangeBranchPlantParticularRowCode.show();
        $rootScope.Throbber.Visible = false;
    };

    $scope.CloseChangeBranchPlantCodeParticularRowPopup = function () {

        $scope.ChangeBranchPlantParticularRowCode.hide();
    };

    $scope.onChangeClick = function (e, item) {


        debugger;
        //$rootScope.Throbber.Visible = true;

        $scope["BranchPlantList" + item.EnquiryId] = [];

        item.showBranchPlantDropDown = true;

        var requestData =
        {
            ServicesAction: 'GetAllCollectionLocationListByShipTo',
            CompanyId: item.ShipTo,
            TruckSizeId: item.TruckSizeId,
            OrderType: item.EnquiryType
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            debugger;
            if (typeof response.data.Json !== "undefined") {
                $scope["BranchPlantList" + item.EnquiryId] = response.data.Json.BranchPlantList;



                var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === item.EnquiryId; });
                if (data.length > 0) {


                    if (data[0].CheckedEnquiry == "undefined") {

                        data[0].CheckedEnquiry = true;

                    } else {

                        if (data[0].CheckedEnquiry == true) {



                            data[0].CheckedEnquiry = false;
                        } else {

                            data[0].CheckedEnquiry = true;
                        }



                    }

                }

                item.CheckedEnquiry = data[0].CheckedEnquiry;
                var element = $(e.currentTarget);
                var row = element.closest("tr");
                if (item.CheckedEnquiry) {

                    row.addClass("k-state-selected");
                } else {
                    row.removeClass("k-state-selected");
                }

            }

            item.CollectionLocationCode = item.CollectionLocationCodeForCheck;

            //$rootScope.Throbber.Visible = false;

        });




    };

    $scope.ClearBranchPlant = function (e, item) {
        debugger;
        item.showBranchPlantDropDown = false;

        if (item.CollectionLocationCodeForCheck == "" || item.CollectionLocationCodeForCheck == undefined && item.CollectionLocationCodeForCheck == null) {
            item.CollectionLocationCode = undefined;
        }

        if (item.CollectionLocationCodeForCheck !== item.CollectionLocationCode) {
            item.CollectionLocationCode = item.CollectionLocationCodeForCheck;
        }

        var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === item.EnquiryId; });
        if (data.length > 0) {


            if (data[0].CheckedEnquiry == "undefined") {

                data[0].CheckedEnquiry = true;

            } else {

                if (data[0].CheckedEnquiry == true) {



                    data[0].CheckedEnquiry = false;
                } else {

                    data[0].CheckedEnquiry = true;
                }



            }

        }


        item.CheckedEnquiry = data[0].CheckedEnquiry;
        var element = $(e.currentTarget);
        var row = element.closest("tr");
        if (item.CheckedEnquiry) {

            row.addClass("k-state-selected");
        } else {
            row.removeClass("k-state-selected");
        }

    };

    $scope.SelectedBranchPlantTemp = '';
    $scope.EnquiryDetailsTemp = [];
    $scope.IsBranchPlantAlreadyAssingedForRow = false;

    $scope.EditRowForBranchPlant = "";

    $scope.SaveBranchPlant = function (e, item) {
        debugger;
        $scope.EditRowForBranchPlant = item;
        $rootScope.LoadReasonCode("ChangeBranchPlantReason");
        var isBranchPlantChange = false;
        $rootScope.Throbber.Visible = true;
        debugger;
        if (item.CollectionLocationCode !== "" && item.CollectionLocationCode !== undefined && item.CollectionLocationCode !== null) {

            $scope.SelectedBranchPlantTemp = item.CollectionLocationCode;
            $scope.EnquiryDetailsTemp = item;
            $scope.ScopeEvent = e;

            if (item.CollectionLocationCodeForCheck !== "" && item.CollectionLocationCodeForCheck !== undefined && item.CollectionLocationCodeForCheck !== null) {

                $scope.OpenChangeBranchPlantParticularRowCodePopup();
                $scope.IsBranchPlantAlreadyAssingedForRow = true;
                $rootScope.Throbber.Visible = false;

            } else {

                $scope.IsBranchPlantAlreadyAssingedForRow = false;
                $scope.SaveBranchPlantForParticularRowEnquiry();
                $rootScope.Throbber.Visible = false;
            }
        }
        else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);

        }


    };



    $scope.SaveBranchPlantForParticularRowEnquiry = function () {
        debugger;
        if ($scope.SelectedBranchPlantTemp !== "" && $scope.SelectedBranchPlantTemp !== undefined && $scope.SelectedBranchPlantTemp !== null) {
            $rootScope.Throbber.Visible = true;

            var objectList = [];

            var object = {};
            object.ObjectId = $scope.EnquiryDetailsTemp.EnquiryId;

            objectList.push(object);

            var mainObject = {};
            mainObject.ObjectList = objectList;
            mainObject.ObjectType = "Enquiry";
            mainObject.ReasonCodeEventName = "UpdateBranchPlant";
            mainObject.FunctionName = "UpdateBranchPlantSelectedForParticularRowEnquiry";
            mainObject.FunctionParameter = $scope.EnquiryDetailsTemp;

            if ($scope.IsBranchPlantAlreadyAssingedForRow === true) {
                $rootScope.SaveReasonCode(mainObject);
                if ($rootScope.ReasonCodeJson.ReasonCode !== "" && $rootScope.ReasonCodeJson.ReasonCode !== null) {
                    //$scope[mainObject.FunctionName](mainObject.FunctionParameter);
                    $rootScope.Throbber.Visible = false;
                    $scope.CloseChangeBranchPlantCodeParticularRowPopup();
                    $rootScope.CloseReasoncodepopup();
                }
                else {

                    $rootScope.Throbber.Visible = false;
                    $rootScope.LoadReasonCode("ChangeBranchPlantReason");

                }
            }
            else {
                $scope[mainObject.FunctionName](mainObject.FunctionParameter);
                $rootScope.Throbber.Visible = false;
                $rootScope.LoadReasonCode("ChangeBranchPlantReason");
            }

            // if ($rootScope.ReasonCodeJson.ReasonCode !== "" && $rootScope.ReasonCodeJson.ReasonCode !== null) {
            //     //$scope[mainObject.FunctionName](mainObject.FunctionParameter);
            //     $rootScope.Throbber.Visible = false;
            //     $scope.CloseChangeBranchPlantCodeParticularRowPopup();
            //     $rootScope.CloseReasoncodepopup();
            // }
            // else {
            //     $scope[mainObject.FunctionName](mainObject.FunctionParameter);
            //     $rootScope.Throbber.Visible = false;
            //     $rootScope.LoadReasonCode("ChangeBranchPlantReason");
            //
            // }

        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectBranchPlantCode), 'error', 3000);
        }
    };









    $scope.LoadData = function (Id) {

        var requestData =
        {
            ServicesAction: 'LoadStockAndCarrierEnquiry',
            EnquiryId: Id,
            RoleId: $rootScope.RoleId,
            CultureId: $rootScope.CultureId,
            UserId: $rootScope.UserId

        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            if (response.data !== undefined) {
                $scope.CurrentOrderGuid = generateGUID();
                $scope.EnquiryProductListStock = [];
                var dataList = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === Id; });
                dataList[0].CarrierCode = response.data.Json.EnquiryList.CarrierCode;
                dataList[0].CarrierCodeForCheck = response.data.Json.EnquiryList.CarrierCode;
                dataList[0].CarrierName = response.data.Json.EnquiryList.CarrierName;
                dataList[0].CarrierId = response.data.Json.EnquiryList.CarrierId;
                dataList[0].CollectionLocationCode = response.data.Json.EnquiryList.CollectionLocationCode;
                dataList[0].CollectionLocationName = response.data.Json.EnquiryList.CollectionLocationName;
                dataList[0].CollectionLocationCodeForCheck = response.data.Json.EnquiryList.CollectionLocationCode;


                if ($scope.OrderData !== undefined) {
                    var enquiryProductListDetails = $scope.OrderData.filter(function (el) { return el.EnquiryId === Id; });
                    if (enquiryProductListDetails[0].OrderProductList !== undefined) {
                        if (enquiryProductListDetails[0].OrderProductList.length > 0) {
                            $scope.EnquiryProductListStock = enquiryProductListDetails[0].OrderProductList;
                            for (var i = 0; i < $scope.EnquiryProductListStock.length; i++) {
                                var dataListProduct = response.data.Json.EnquiryList.EnquiryProductList.filter(function (el) { return el.ProductCode === $scope.EnquiryProductListStock[i].ProductCode; });

                                if (dataListProduct.length > 0) {
                                    $scope.EnquiryProductListStock[i].CurrentStockPosition = parseFloat(dataListProduct[0].CurrentStockPosition);
                                    var remainingProductStock = parseFloat(parseFloat(dataListProduct[0].CurrentStockPosition) - parseFloat(dataListProduct[0].UsedQuantityInEnquiry));
                                    if (parseFloat(dataListProduct[0].ProductQuantity) < remainingProductStock) {
                                        $scope.EnquiryProductListStock[i].IsItemAvailableInStock = true;
                                    } else {
                                        $scope.EnquiryProductListStock[i].IsItemAvailableInStock = false;
                                    }

                                }
                            }
                        }
                    }



                }


                //var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === Id; });
                if (dataList.length > 0) {


                    if (dataList[0].CheckedEnquiry == "undefined") {

                        dataList[0].CheckedEnquiry = true;

                    } else {

                        if (dataList[0].CheckedEnquiry == true) {



                            dataList[0].CheckedEnquiry = false;
                        } else {

                            dataList[0].CheckedEnquiry = true;
                        }



                    }

                }

                if ($scope.EditRowForBranchPlant !== "" && $scope.EditRowForBranchPlant !== undefined) {
                    $scope.EditRowForBranchPlant.showBranchPlantDropDown = false;
                }



                if ($scope.EditRowForTransporter !== "" && $scope.EditRowForTransporter !== undefined) {
                    $scope.EditRowForTransporter.showTransporterDropDown = false;
                }


                dataList.CheckedEnquiry = dataList[0].CheckedEnquiry;
                var element = $($scope.ScopeEvent.currentTarget);
                var row = element.closest("tr");
                if (dataList.CheckedEnquiry) {
                    row.addClass("k-state-selected");
                } else {
                    row.removeClass("k-state-selected");
                }

            } else {
                $rootScope.Throbber.Visible = false;
            }
        });
    }


    $scope.UpdateBranchPlantSelectedForParticularRowEnquiry = function (orderDetails) {


        var selectedOrderId = "";

        selectedOrderId = orderDetails.EnquiryId;

        var enquiryList = {
            BranchPlantName: $scope.SelectedBranchPlantTemp,
            EnquiryId: selectedOrderId
        }
        var requestData =
        {
            ServicesAction: 'UpdateBranchPlantForParticularEnquiry',
            EnquiryDetailList: enquiryList
        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            $scope.CloseChangeBranchPlantCodeParticularRowPopup();
            $rootScope.Throbber.Visible = false;
            $scope.LoadData(selectedOrderId);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_BranchPlantUpdated), '', 3000);
            //$scope.RefreshDataGrid();
        });
    };


    //#region Update Particular Enquiry Branch Plant
    $ionicModal.fromTemplateUrl('templates/ChangeTransporterParticularRowCode.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ChangeTransporterParticularRowCode = modal;
    });

    $scope.OpenChangeTransporterParticularRowCodePopup = function () {

        $scope.ChangeTransporterParticularRowCode.show();
        $rootScope.Throbber.Visible = false;
    };

    $scope.CloseChangeTransporterParticularRowPopup = function () {

        $scope.ChangeTransporterParticularRowCode.hide();
    };

    $scope.onChangeClickTransporter = function (e, item) {


        debugger;
        //$rootScope.Throbber.Visible = true;

        $scope["TransporterList" + item.EnquiryId] = [];

        item.showTransporterDropDown = true;

        var requestData =
        {
            ServicesAction: 'GetAllTransportersListByShipToBranchPlantAndTruckSize',
            CompanyId: item.ShipTo,
            TruckSizeId: item.TruckSizeId,
            CollectionLocationCode: item.CollectionLocationCode
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            debugger;
            if (typeof response.data.Json !== "undefined") {
                $scope["TransporterList" + item.EnquiryId] = response.data.Json.TransporterList;



                var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === item.EnquiryId; });
                if (data.length > 0) {


                    if (data[0].CheckedEnquiry == "undefined") {

                        data[0].CheckedEnquiry = true;

                    } else {

                        if (data[0].CheckedEnquiry == true) {



                            data[0].CheckedEnquiry = false;
                        } else {

                            data[0].CheckedEnquiry = true;
                        }



                    }

                }

                item.CheckedEnquiry = data[0].CheckedEnquiry;
                var element = $(e.currentTarget);
                var row = element.closest("tr");
                if (item.CheckedEnquiry) {

                    row.addClass("k-state-selected");
                } else {
                    row.removeClass("k-state-selected");
                }

            }
            item.CarrierCode = item.CarrierCodeForCheck;

            //$rootScope.Throbber.Visible = false;

        });




    };

    $scope.ClearTransporter = function (e, item) {

        item.showTransporterDropDown = false;

        if (item.CarrierCodeForCheck == "" || item.CarrierCodeForCheck == undefined && item.CarrierCodeForCheck == null) {
            item.CarrierCode = undefined;
        }

        if (item.CarrierCodeForCheck !== item.CarrierCode) {
            item.CarrierCode = item.CarrierCodeForCheck;
        }

        var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === item.EnquiryId; });
        if (data.length > 0) {


            if (data[0].CheckedEnquiry == "undefined") {

                data[0].CheckedEnquiry = true;

            } else {

                if (data[0].CheckedEnquiry == true) {



                    data[0].CheckedEnquiry = false;
                } else {

                    data[0].CheckedEnquiry = true;
                }



            }

        }


        item.CheckedEnquiry = data[0].CheckedEnquiry;
        var element = $(e.currentTarget);
        var row = element.closest("tr");
        if (item.CheckedEnquiry) {

            row.addClass("k-state-selected");
        } else {
            row.removeClass("k-state-selected");
        }

    };


    $scope.SelectedTransporterTemp = '';
    $scope.EnquiryDetailsTemp1 = [];
    $scope.IsTransporterAlreadyAssingedForRow = false;
    $scope.EditRowForTransporter = "";
    $scope.SaveTransporter = function (e, item) {

        $rootScope.LoadReasonCode("ReasonCodeForTransporter");
        var isTransporterChange = false;
        $rootScope.Throbber.Visible = true;
        $scope.EditRowForTransporter = item;
        if (item.CarrierCode !== "" && item.CarrierCode !== undefined && item.CarrierCode !== null) {

            $scope.SelectedTransporterTemp = item.CarrierCode;
            $scope.EnquiryDetailsTemp1 = item;
            $scope.ScopeEvent = e;
            if (item.CarrierCodeForCheck !== "" && item.CarrierCodeForCheck !== undefined && item.CarrierCodeForCheck !== null) {

                $scope.OpenChangeTransporterParticularRowCodePopup();
                $scope.IsTransporterAlreadyAssingedForRow = true;
                $rootScope.Throbber.Visible = false;

            } else {

                $scope.IsTransporterAlreadyAssingedForRow = false;
                item.showTransporterDropDown = false;

                $scope.SaveTransporterForParticularRowEnquiry();

                $rootScope.Throbber.Visible = false;


            }
        }
        else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectTransporter), 'error', 3000);

        }


    };

    $scope.SaveTransporterForParticularRowEnquiry = function () {

        if ($scope.SelectedTransporterTemp !== "" && $scope.SelectedTransporterTemp !== undefined && $scope.SelectedTransporterTemp !== null) {
            $rootScope.Throbber.Visible = true;

            var objectList = [];

            var object = {};
            object.ObjectId = $scope.EnquiryDetailsTemp1.EnquiryId;

            objectList.push(object);

            var mainObject = {};
            mainObject.ObjectList = objectList;
            mainObject.ObjectType = "Enquiry";
            mainObject.ReasonCodeEventName = "UpdateTransporter";
            mainObject.FunctionName = "UpdateTransporterSelectedForParticularRowEnquiry";
            mainObject.FunctionParameter = $scope.EnquiryDetailsTemp1;

            if ($scope.IsTransporterAlreadyAssingedForRow === true) {
                $rootScope.SaveReasonCode(mainObject);
                if ($rootScope.ReasonCodeJson.ReasonCode !== "" && $rootScope.ReasonCodeJson.ReasonCode !== null) {
                    $rootScope.Throbber.Visible = false;
                    $scope.CloseChangeTransporterParticularRowPopup();
                    $rootScope.CloseReasoncodepopup();
                }

                else {

                    $rootScope.Throbber.Visible = false;
                    $rootScope.LoadReasonCode("ReasonCodeForTransporter");

                }
            }
            else {
                $scope[mainObject.FunctionName](mainObject.FunctionParameter);
                $rootScope.Throbber.Visible = false;
                $rootScope.LoadReasonCode("ReasonCodeForTransporter");
            }




        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectTransporter), 'error', 3000);
        }
    };

    $scope.UpdateTransporterSelectedForParticularRowEnquiry = function (orderDetails) {


        var selectedOrderId = "";

        selectedOrderId = orderDetails.EnquiryId;

        var enquiryList = {
            TransporterName: $scope.SelectedTransporterTemp,
            EnquiryId: selectedOrderId
        }
        var requestData =
        {
            ServicesAction: 'UpdateTransporterForParticularEnquiry',
            EnquiryDetailList: enquiryList
        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            $scope.CloseChangeTransporterParticularRowPopup();
            $rootScope.Throbber.Visible = false;
            $scope.LoadData(selectedOrderId);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_TransporterUpdated), '', 3000);
            //$scope.RefreshDataGrid();
        });
    };


    $scope.onChangeClickDeliveryDate = function (e, item) {

        debugger;
        item.showDeliveryDateDropDown = true;
        item.PromisedDate = $filter('date')(item.PromisedDate, "dd/MM/yyyy");


        setTimeout(function () {
            $scope.OpenDeliveryDatePicker(e, item);
        }, 100);

    };


    $scope.OpenDeliveryDatePicker = function (e, item) {

        focus('txtDeliveryDate' + item.EnquiryId);

        var numberOfDaysToAdd = $scope.LoadSettingInfoByName('ScheduleDateNumber', 'int');

        var someDate = new Date();
        someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
        var dd = someDate.getDate();
        var mm = someDate.getMonth() + 1;
        var y = someDate.getFullYear();
        //var hours = someDate.getHours().toString();
        //hours = (hours.length === 1) ? ("0" + hours) : hours;
        //
        //var minutes = someDate.getMinutes().toString();
        //minutes = (minutes.length === 1) ? ("0" + minutes) : minutes;

        var someFormattedDate = dd + '/' + mm + '/' + y + ' 00:00:00';
        var maxDateForDelivery = $filter('date')(someFormattedDate, "dd/MM/yyyy");


        var pickupdate = new Date(item.PickDateTime);
        var newdatevalue = new Date();
        var dd1 = newdatevalue.getDate();
        var mm1 = newdatevalue.getMonth() + 1;
        var y1 = newdatevalue.getFullYear();
        var newdateformate = mm1 + '/' + dd1 + '/' + y1 + ' 00:00:00';
        var newdateformatevalue = $filter('date')(newdateformate, "dd/MM/yyyy");
        newdateformatevalue = new Date(newdateformatevalue);


        if (newdateformatevalue > pickupdate) {
            var ExpectedTimeOfDelivery = "";
            var splitdate = item.PromisedDate.split("T");
            splitdate = splitdate[0].split("/");
            splitdate = splitdate[1] + "/" + splitdate[0] + "/" + splitdate[2];
            ExpectedTimeOfDelivery = new Date(splitdate);
            maxDateForDelivery = ExpectedTimeOfDelivery;
        }

        $('#txtDeliveryDate' + item.EnquiryId).datepicker({
            onSelect: function (datetext, inst) {


                $scope.$apply(function () {


                    item.PromisedDate = $filter('date')(datetext, "dd/MM/yyyy");

                    debugger;


                });
            },
            minDate: new Date(),
            maxDate: maxDateForDelivery,
            dateFormat: 'dd/mm/yy',
            numberofmonths: 1,
            isRTL: $('body').hasClass('rtl') ? true : false,
            prevtext: '<i class="fa fa-angle-left"></i>',
            nexttext: '<i class="fa fa-angle-right"></i>',
            showbuttonpanel: false,
            autoclose: true,
        });

        $('#txtDeliveryDate' + item.EnquiryId).datepicker('show');

    };



    $scope.onChangeClickPickDate = function (e, item) {

        debugger;
        item.showPickDateDropDown = true;
        item.PickDateTime = $filter('date')(item.PickDateTime, "dd/MM/yyyy");

        setTimeout(function () {
            $scope.OpenPickDatePicker(e, item);
        }, 200);

    };


    $scope.OpenPickDatePicker = function (e, item) {

        focus('txtPickDate' + item.EnquiryId);
        var maxDateOfDatePicker = $filter('date')(item.PromisedDate, "dd/MM/yyyy");
        $('#txtPickDate' + item.EnquiryId).datepicker({
            onSelect: function (datetext, inst) {


                $scope.$apply(function () {


                    item.PickDateTime = $filter('date')(datetext, "dd/MM/yyyy");

                    debugger;


                });
            },
            minDate: new Date(),
            maxDate: maxDateOfDatePicker,
            dateFormat: 'dd/mm/yy',
            numberofmonths: 1,
            isRTL: $('body').hasClass('rtl') ? true : false,
            prevtext: '<i class="fa fa-angle-left"></i>',
            nexttext: '<i class="fa fa-angle-right"></i>',
            showbuttonpanel: false,
            autoclose: true,
        });


        $('#txtPickDate' + item.EnquiryId).datepicker('show');

    };



    //#region Update Particular Enquiry Request Date
    $ionicModal.fromTemplateUrl('templates/ChangeDeliveryDateParticularRowCode.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ChangeDeliveryDateParticularRowCode = modal;
    });

    $scope.OpenChangeDeliveryDateParticularRowCodePopup = function () {

        $scope.ChangeDeliveryDateParticularRowCode.show();
        $rootScope.Throbber.Visible = false;
    };

    $scope.CloseChangeDeliveryDateParticularRowPopup = function () {

        $scope.ChangeDeliveryDateParticularRowCode.hide();
    };


    $ionicModal.fromTemplateUrl('templates/ChangePickDateParticularRowCode.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ChangePickDateParticularRowCode = modal;
    });

    $scope.OpenChangePickDateParticularRowCodePopup = function () {

        $scope.ChangePickDateParticularRowCode.show();
        $rootScope.Throbber.Visible = false;
    };

    $scope.CloseChangePickDateParticularRowPopup = function () {

        $scope.ChangePickDateParticularRowCode.hide();
    };


    $scope.SelectedDeliveryDateTemp = '';
    $scope.EnquiryDetailsTemp2 = [];
    $scope.IsDeliveryDateAlreadyAssingedForRow = false;




    $scope.CollectionPickupDate = "";

    $scope.SaveDeliveryDate = function (e, item) {
        debugger;
        $rootScope.LoadReasonCode("ChangePromisedDateReason");
        $rootScope.Throbber.Visible = true;

        if (item.PromisedDate !== "" && item.PromisedDate !== undefined && item.PromisedDate !== null) {

            $scope.SelectedDeliveryDateTemp = item.PromisedDate;
            $scope.EnquiryDetailsTemp2 = item;
            $scope.ScopeEvent = e;

            if (item.RequestDateFieldForCheck !== "" && item.RequestDateFieldForCheck !== undefined && item.RequestDateFieldForCheck !== null) {

                $scope.OpenChangeDeliveryDateParticularRowCodePopup();
                $scope.IsDeliveryDateAlreadyAssingedForRow = true;
                $rootScope.Throbber.Visible = false;

            } else {

                $scope.IsDeliveryDateAlreadyAssingedForRow = false;
                item.showDeliveryDateDropDown = false;

                $scope.SaveDeliveryDateForParticularRowEnquiry();

                $rootScope.Throbber.Visible = false;


            }
        }
        else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectRequestDate), 'error', 3000);

        }


    };

    $scope.SaveDeliveryDateForParticularRowEnquiry = function () {

        if ($scope.SelectedDeliveryDateTemp !== "" && $scope.SelectedDeliveryDateTemp !== undefined && $scope.SelectedDeliveryDateTemp !== null) {
            $rootScope.Throbber.Visible = true;

            var objectList = [];

            var object = {};
            object.ObjectId = $scope.EnquiryDetailsTemp2.EnquiryId;

            objectList.push(object);

            var mainObject = {};
            mainObject.ObjectList = objectList;
            mainObject.ObjectType = "Enquiry";
            mainObject.ReasonCodeEventName = "UpdateRequestDate";
            mainObject.FunctionName = "UpdateDeliveryDateSelectedForParticularRowEnquiry";
            mainObject.FunctionParameter = $scope.EnquiryDetailsTemp2;


            if ($scope.IsDeliveryDateAlreadyAssingedForRow === true) {
                $rootScope.SaveReasonCode(mainObject);
                if ($rootScope.ReasonCodeJson.ReasonCode !== "" && $rootScope.ReasonCodeJson.ReasonCode !== null) {

                    $rootScope.Throbber.Visible = false;
                    $scope.CloseChangeDeliveryDateParticularRowPopup();
                    $rootScope.CloseReasoncodepopup();
                }
                else {

                    $rootScope.Throbber.Visible = false;
                    $rootScope.LoadReasonCode("ChangePromisedDateReason");

                }
            }
            else {
                $scope[mainObject.FunctionName](mainObject.FunctionParameter);
                $rootScope.Throbber.Visible = false;
                $rootScope.LoadReasonCode("ChangePromisedDateReason");
            }

        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectRequestDate), 'error', 3000);
        }
    };

    $scope.UpdateDeliveryDateSelectedForParticularRowEnquiry = function (orderDetails) {

        $scope.GetCollectionPickupDate(orderDetails, orderDetails.ShipToCode, orderDetails.SoldToCode, orderDetails.PromisedDate);


    };


    $scope.ClearDeliveryDate = function (e, item) {

        item.showDeliveryDateDropDown = false;

        if (item.RequestDateFieldForCheck == "" || item.RequestDateFieldForCheck == undefined && item.RequestDateFieldForCheck == null) {
            item.PromisedDate = undefined;
        }

        if (item.RequestDateFieldForCheck !== item.PromisedDate) {
            item.PromisedDate = item.RequestDateFieldForCheck;
        }

    };



    $scope.SelectedPickDateTemp = '';
    $scope.EnquiryDetailsTempPick = [];
    $scope.IsPickDateAlreadyAssingedForRow = false;




    $scope.SavePickDate = function (e, item) {
        debugger;
        $rootScope.LoadReasonCode("ChangeCollectionDateReason");
        $rootScope.Throbber.Visible = true;

        if (item.PickDateTime !== "" && item.PickDateTime !== undefined && item.PickDateTime !== null) {

            $scope.SelectedPickDateTemp = item.PickDateTime;
            $scope.EnquiryDetailsTempPick = item;

            if (item.PickDateTimeForCheck !== "" && item.PickDateTimeForCheck !== undefined && item.PickDateTimeForCheck !== null) {

                $scope.OpenChangePickDateParticularRowCodePopup();
                $scope.IsPickDateAlreadyAssingedForRow = true;
                $rootScope.Throbber.Visible = false;

            } else {

                $scope.IsPickDateAlreadyAssingedForRow = false;
                item.showPickDateDropDown = false;

                $scope.SavePickDateForParticularRowEnquiry();

                $rootScope.Throbber.Visible = false;


            }
        }
        else {
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectPickDate), 'error', 3000);

        }


    };

    $scope.SavePickDateForParticularRowEnquiry = function () {
        debugger;
        if ($scope.SelectedPickDateTemp !== "" && $scope.SelectedPickDateTemp !== undefined && $scope.SelectedPickDateTemp !== null) {
            $rootScope.Throbber.Visible = true;

            var objectList = [];

            var object = {};
            object.ObjectId = $scope.EnquiryDetailsTempPick.EnquiryId;

            objectList.push(object);

            var mainObject = {};
            mainObject.ObjectList = objectList;
            mainObject.ObjectType = "Enquiry";
            mainObject.ReasonCodeEventName = "UpdatePickDate";
            mainObject.FunctionName = "UpdatePickDateSelectedForParticularRowEnquiry";
            mainObject.FunctionParameter = $scope.EnquiryDetailsTempPick;




            if ($scope.IsPickDateAlreadyAssingedForRow === true) {
                $rootScope.SaveReasonCode(mainObject);
                if ($rootScope.ReasonCodeJson.ReasonCode !== "" && $rootScope.ReasonCodeJson.ReasonCode !== null) {

                    $rootScope.Throbber.Visible = false;
                    $scope.CloseChangePickDateParticularRowPopup();
                    $rootScope.CloseReasoncodepopup();
                }
                else {

                    $rootScope.Throbber.Visible = false;
                    $rootScope.LoadReasonCode("ChangeCollectionDateReason");

                }
            }
            else {
                $scope[mainObject.FunctionName](mainObject.FunctionParameter);
                $rootScope.Throbber.Visible = false;
                $rootScope.LoadReasonCode("ChangeCollectionDateReason");
            }

        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_SelectPickDate), 'error', 3000);
        }
    };

    $scope.UpdatePickDateSelectedForParticularRowEnquiry = function (orderDetails) {
        debugger;

        var collectionPickupDate = $filter('date')(orderDetails.PickDateTime, "dd/MM/yyyy 00:00:00");


        if (collectionPickupDate !== "" && typeof collectionPickupDate !== "undefined") {
            var date = "";
            date = collectionPickupDate.split(" ");
            var dateformat = date[0].split('/');

            collectionPickupDate = dateformat[2] + "-" + dateformat[1] + "-" + dateformat[0] + " " + "00:00:00";

        }
        var enquiryList = {

            PickDateTime: collectionPickupDate,
            EnquiryId: orderDetails.EnquiryId
        }
        var requestData =
        {
            ServicesAction: 'UpdatePickDateForParticularEnquiry',
            EnquiryDetailList: enquiryList
        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response1) {
            $scope.CloseChangePickDateParticularRowPopup();
            $rootScope.Throbber.Visible = false;
            $scope.LoadDataForPromisedDate(orderDetails.EnquiryId);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_PickUpDateUpdated), '', 3000);
            //$scope.RefreshDataGrid();
        });


    };


    $scope.ClearPickDate = function (e, item) {

        item.showPickDateDropDown = false;

        if (item.PickDateTimeForCheck == "" || item.PickDateTimeForCheck == undefined && item.PickDateTimeForCheck == null) {
            item.PickDateTime = undefined;
        }

        if (item.PickDateTimeForCheck !== item.PickDateTime) {
            item.PickDateTime = item.PickDateTimeForCheck;
        }

    };






    $scope.GetCollectionPickupDate = function (orderDetails, deliveryLocationCode, activeCompanyMnemonic, requestedDate) {

        debugger;
        var requestData =
        {
            ServicesAction: 'GetCollectionPickUpDateForGrid',
            DeliveryLocation: {
                LocationId: deliveryLocationCode,
                DeliveryLocationCode: deliveryLocationCode,
                LocationCode: deliveryLocationCode
            },
            Company: {
                CompanyId: activeCompanyMnemonic,
                CompanyMnemonic: activeCompanyMnemonic,
            },
            Supplier: {
                CompanyId: activeCompanyMnemonic,
                CompanyMnemonic: activeCompanyMnemonic,
            },
            RuleType: 1,
            CompanyId: activeCompanyMnemonic,
            CompanyMnemonic: activeCompanyMnemonic,
            Order: {
                OrderTime: "",
                OrderDate: "",
                RequestTime: 0,
                RequestedDate: $filter('date')(requestedDate, "dd/MM/yyyy")
            }
        };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            debugger;
            var responseStr = response.data.Json;
            $rootScope.Throbber.Visible = false;
            var someDate1 = new Date();
            var currentDateList = $filter('date')(someDate1, "dd/MM/yyyy");

            if (responseStr.CollectionDate === '' || responseStr.CollectionDate === undefined || responseStr.CollectionDate === null) {
                var numberOfDaysToAdd = $scope.LoadSettingInfoByName('CollectionPickupDate', 'int');

                if (numberOfDaysToAdd !== "") {

                    //var someDate = new Date();
                    //someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                    //var dd = someDate.getDate();
                    //var mm = someDate.getMonth() + 1;
                    //var y = someDate.getFullYear();
                    //var hours = someDate.getHours().toString();
                    //hours = (hours.length === 1) ? ("0" + hours) : hours;
                    //
                    //var minutes = someDate.getMinutes().toString();
                    //minutes = (minutes.length === 1) ? ("0" + minutes) : minutes;
                    //
                    //var someFormattedDate = dd + '/' + mm + '/' + y + ' ' + hours + ':' + minutes;
                    //
                    //$scope.CollectionPickupDate = someFormattedDate;
                    ////$rootScope.NoOfCollectionDays = numberOfDaysToAdd;
                    var requestedDateTemp = $filter('date')(requestedDate, "dd/MM/yyyy 00:00:00");
                    var dateTemp = "";
                    dateTemp = requestedDateTemp.split(" ");
                    var dateformatTemp = dateTemp[0].split('/');

                    var someDate = new Date(dateformatTemp[2], dateformatTemp[1] - 1, dateformatTemp[0]);
                    someDate.setDate(someDate.getDate() - numberOfDaysToAdd);
                    var dd = someDate.getDate();
                    var mm = someDate.getMonth() + 1;
                    var y = someDate.getFullYear();
                    //var hours = someDate.getHours().toString();
                    //hours = (hours.length === 1) ? ("0" + hours) : hours;
                    //
                    //var minutes = someDate.getMinutes().toString();
                    //minutes = (minutes.length === 1) ? ("0" + minutes) : minutes;

                    var someFormattedDate = dd + '/' + mm + '/' + y + ' 00:00:00';

                    $scope.CollectionPickupDate = someFormattedDate;
                    //$rootScope.NoOfCollectionDays = numberOfDaysToAdd;

                    var collectionDateList1 = $scope.ConvertDatetImeToUTCDateTimeFormat($filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy"));

                    if (collectionDateList1 < $scope.ConvertDatetImeToUTCDateTimeFormat(currentDateList)) {
                        $scope.CollectionPickupDate = currentDateList;
                    }
                    else if (collectionDateList1 > $scope.ConvertDatetImeToUTCDateTimeFormat(requestedDateTemp)) {
                        $scope.CollectionPickupDate = currentDateList;
                    }
                }
                else {
                    $scope.CollectionPickupDate = "";
                    //$rootScope.NoOfCollectionDays = '0';
                }

            }
            else {

                debugger;
                $scope.CollectionPickupDate = responseStr.CollectionDate;
                var collectionDateList = $scope.ConvertDatetImeToUTCDateTimeFormat($filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy"));

                if (collectionDateList < $scope.ConvertDatetImeToUTCDateTimeFormat(currentDateList)) {
                    $scope.CollectionPickupDate = currentDateList;
                }
                else if (collectionDateList > $scope.ConvertDatetImeToUTCDateTimeFormat(requestedDate)) {
                    $scope.CollectionPickupDate = currentDateList;
                }

                //$rootScope.NoOfCollectionDays = responseStr.NoOfCollectionDays.replace(/\"\'/g, "");
            }

            debugger;
            var selectedOrderId = "";

            selectedOrderId = orderDetails.EnquiryId;

            var collectionPickupDate = $filter('date')($scope.CollectionPickupDate, "dd/MM/yyyy 00:00:00");
            var requestedDateNew = $filter('date')(requestedDate, "dd/MM/yyyy 00:00:00");

            if (collectionPickupDate !== "" && typeof collectionPickupDate !== "undefined") {
                var date = "";
                date = collectionPickupDate.split(" ");
                var dateformat = date[0].split('/');

                collectionPickupDate = dateformat[2] + "-" + dateformat[1] + "-" + dateformat[0] + " 00:00:00";

            }

            if (requestedDateNew !== "" && typeof requestedDateNew !== "undefined") {
                var date1 = "";
                date1 = requestedDateNew.split(" ");
                var dateformat1 = date1[0].split('/');

                requestedDateNew = dateformat1[2] + "-" + dateformat1[1] + "-" + dateformat1[0] + " 00:00:00";

            }

            var enquiryList = {
                RequestedDate: requestedDateNew,
                PickDateTime: collectionPickupDate,
                EnquiryId: selectedOrderId
            }
            var requestData =
            {
                ServicesAction: 'UpdateRequestedDateForParticularEnquiry',
                EnquiryDetailList: enquiryList
            };
            var consolidateApiParamater =
            {
                Json: requestData,
            };
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response1) {
                $scope.CloseChangeDeliveryDateParticularRowPopup();
                $rootScope.Throbber.Visible = false;
                $scope.LoadDataForPromisedDate(selectedOrderId);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_RequestDateUpdated), '', 3000);
                //$scope.RefreshDataGrid();

            });

        });
    };

    $scope.LoadSettingInfoByName = function (settingName, returnValueDataType) {

        var settingValue = "";
        if ($sessionStorage.AllSettingMasterData != undefined) {
            var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === settingName; });
            if (settingMaster.length > 0) {
                settingValue = settingMaster[0].SettingValue;
            }
        }
        if (returnValueDataType === "int") {
            if (settingValue !== "") {
                settingValue = parseInt(settingValue);
            }
        } else if (returnValueDataType === "float") {
            if (settingValue !== "") {
                settingValue = parseFloat(settingValue);
            }
        } else {
            settingValue = settingValue;
        }
        return settingValue;
    }


    $scope.LoadDataForPromisedDate = function (Id) {

        var requestData =
        {
            ServicesAction: 'LoadPromisedDatePickUpDateInEnquiry',
            EnquiryId: Id,
            RoleId: $rootScope.RoleId,
            CultureId: $rootScope.CultureId,
            UserId: $rootScope.UserId

        };
        var consolidateApiParamater =
        {
            Json: requestData,
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            if (response.data !== undefined) {
                var dataList = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === Id; });
                dataList[0].PromisedDate = response.data.Json.EnquiryList.PromisedDateField;
                dataList[0].RequestDateFieldForCheck = response.data.Json.EnquiryList.PromisedDateField;
                dataList[0].PickDateTime = response.data.Json.EnquiryList.PickDateTime;
                dataList[0].PickDateTimeForCheck = response.data.Json.EnquiryList.PickDateTime;


                //var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === Id; });
                angular.forEach($scope.SalesAdminApprovalList, function (item) {

                    item.showDeliveryDateDropDown = false;
                    item.showPickDateDropDown = false;
                    item.CheckedEnquiry = false;

                });

            } else {
                $rootScope.Throbber.Visible = false;
            }
        });
    };


    $scope.ConvertDatetImeToUTCDateTimeFormat = function (datetime) {

        var datetimeformat = "";

        if (datetime !== "" && datetime !== undefined && datetime !== null) {

            var date = datetime.split(' ');
            datetime = date[0].split('/');
            if (date.length > 1) {
                if (parseInt(datetime[1]) <= 9) {
                    datetime[1] = "0" + datetime[1];
                }

                if (parseInt(datetime[0]) <= 9) {
                    datetime[0] = "0" + datetime[0];
                }

                datetime = datetime[1] + "/" + datetime[0] + "/" + datetime[2] + " " + date[1];
            }
            else {
                datetime = datetime[1] + "/" + datetime[0] + "/" + datetime[2];
            }

            datetimeformat = new Date(datetime);
        }


        return datetimeformat;
    }


    //#region Get Item Stock on the fly 



    $scope.GetItemStock = function (enquiryProduct) {


        $rootScope.Throbber.Visible = true;

        var currentEnquiry = $scope.OrderData.filter(function (el) { return el.EnquiryId === enquiryProduct.EnquiryId; });




        debugger;
        var requestData =
        {
            ServicesAction: 'GetItemStock',
            ItemCode: enquiryProduct.ProductCode,
            BranchPlantCode: currentEnquiry[0].BranchPlantCode
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {


            debugger;
            var resoponsedata = response.data;


            enquiryProduct.CurrentStockPosition = resoponsedata.Json.ItemQuantity;



            $rootScope.Throbber.Visible = false;

        });
    }

    $scope.DownloadDocument = function (enquiryId, documentExtension) {

        debugger;

        var orderRequestData =
        {
            ServicesAction: 'LoadImagesByEnquiryId',
            EnquiryId: enquiryId

        }
        var jsonobject = {};
        jsonobject.Json = orderRequestData;
        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {

            var byteCharacters1 = response.data;
            if (response.data !== undefined) {
                var byteCharacters = response.data;

                var blob = new Blob([byteCharacters], {
                    type: "application/Pdf"
                });

                if (blob.size > 0) {
                    var filName = "Images" + enquiryId + "." + documentExtension;
                    saveAs(blob, filName);
                } else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                }
            } else {
                $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
            }
        });
    }



    $scope.DownloadEmailAttachment = function (enquiryId, documentExtension) {

        debugger;

        var orderRequestData =
        {
            ServicesAction: 'LoadEmailDocumentByEnquiryId',
            EnquiryId: enquiryId

        }
        var jsonobject = {};
        jsonobject.Json = orderRequestData;
        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {

            var byteCharacters1 = response.data;
            if (response.data !== undefined) {
                var byteCharacters = response.data;

                var blob = new Blob([byteCharacters], {
                    type: "application/Pdf"
                });

                if (blob.size > 0) {
                    var filName = "Images" + enquiryId + "." + documentExtension;
                    saveAs(blob, filName);
                } else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                }
            } else {
                $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
            }
        });
    }

    $scope.fileupload = {
        File: ''

    }

    $rootScope.FileUploadJSON = {
        FileName: '',
        FileSrc: '',
        FileFormat: '',
        SelectFileFormat: 'jpg,png,pdf,Pdf,PDF,eml,msg',
        SelectFileSize: 10
    }

    $scope.FileNameChanged = function (element) {

        $scope.$apply(function () {

            $scope.PhotoJson.labelFilename = element.files[0].name;;
        });
    }
    $scope.ShowUploadPhoto = false;



    $scope.DownloadJson = {
        FileAttachedDowlnoad: '',
        DocumenmtExtension: '',
        DocumentName: ''

    }

    $scope.OpenChangeUploadPhotoPopup = function (enquiryId, DocumentName, FileAttachedDowlnoad, DocumentExtension) {

        $scope.ShowUploadPhoto = true;
        $scope.CurrentEnquiryId = enquiryId;
        $scope.DocumentName = DocumentName;
        $scope.DownloadJson.FileAttachedDowlnoad = FileAttachedDowlnoad;
        $scope.DocumenmtExtension = DocumentExtension;



    }

    $scope.CloseChangeUploadPhotoPopup = function () {

        $scope.ShowUploadPhoto = false;
        $scope.FileUploadJSON.FileName = "";
        $scope.FileUploadJSON.FileSrc = "";
    }


    $scope.ShowPopupUploadPhoto = function () {
        $scope.OpenChangeUploadPhotoPopup();
    }

    $scope.AttachmentList = [];
    $scope.UploadAttachment = function () {



        var documentName = "";
        var documentBase64 = "";
        var documentExtension = "";

        //documentName = $scope.fileupload.File.dataFile.name;
        //documentBase64 = $scope.fileupload.File.dataBase64;
        //documentExtension = $scope.fileupload.File.dataFile.name.split('.')[1];

        documentName = $rootScope.FileUploadJSON.FileName;
        documentBase64 = $rootScope.FileUploadJSON.FileSrc.split(',').pop();
        documentExtension = $rootScope.FileUploadJSON.FileName.split('.').pop();

        if ($scope.AttachmentList.length > 0) {
            var AttachdataList = $scope.AttachmentList.filter(function (el) { return el.EnquiryId === $scope.CurrentEnquiryId; });
            if (AttachdataList.length > 0) {
                AttachdataList[0].UserProfilePicture = documentBase64;
                AttachdataList[0].DocumentName = documentName;
                AttachdataList[0].UserId = $rootScope.UserId;
                AttachdataList[0].Format = documentExtension;
                AttachdataList[0].EnquiryId = $scope.CurrentEnquiryId;
            } else {
                var attachment = {
                    UserProfilePicture: documentBase64,
                    DocumentName: documentName,
                    UserId: $rootScope.UserId,
                    Format: documentExtension,
                    EnquiryId: $scope.CurrentEnquiryId,
                }

                $scope.AttachmentList.push(attachment);
            }
        } else {
            var attachment = {
                UserProfilePicture: documentBase64,
                DocumentName: documentName,
                UserId: $rootScope.UserId,
                Format: documentExtension,
                EnquiryId: $scope.CurrentEnquiryId,
            }

            $scope.AttachmentList.push(attachment);
        }
        var dataList = $scope.SalesAdminApprovalList.filter(function (el) { return el.EnquiryId === $scope.CurrentEnquiryId; });
        dataList[0].FileAttached = true;




        $scope.$evalAsync(function () {
            $scope.FileUploadJSON.FileName = "";
            $scope.FileUploadJSON.FileSrc = "";

            $scope.PhotoJson.labelFilename = "";
            $scope.CloseChangeUploadPhotoPopup();
        });
        //var requestData =
        //{
        //    ServicesAction: 'UpdateProfilePhoto',
        //    ProfilePhotoList: $scope.profilePhotoList
        //};
        //var consolidateApiParamater =
        //{
        //    Json: requestData,
        //};

        //GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {



        //    if (response.data.Json != undefined) {

        //        if (parseInt(response.data.Json.ProfileId) > 0) {

        //            $scope.$evalAsync(function () {
        //                $sessionStorage.userProfilePhoto = $scope.fileupload.File.dataBase64;
        //                $rootScope.userProfilePhoto = $sessionStorage.userProfilePhoto;
        //                $scope.fileupload.File = "";
        //                $scope.PhotoJson.labelFilename = "";
        //                $scope.CloseChangeUploadPhotoPopup();
        //            });

        //            // $scope.Photo = 'data:image / png; base64,' + $scope.fileupload.File.dataBase64;
        //        }
        //    }

        //});
    };


    $scope.OpenEditEnquirySlider = function (enquiryJson, enquiryAutoNumber) {
        $rootScope.EnquiryAutonumber = enquiryAutoNumber;
        $rootScope.EnquiryStatus = enquiryJson.Status;
        $rootScope.EnquiryClass = enquiryJson.Class;
        $rootScope.LoadEditEnquiryData();

    };



});