angular.module("glassRUNProduct").controller('CompanyPageController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageCustomerService, $q) {

    // alert('dd');

    $scope.SearchValue = {
        search: ''
    };

    $scope.EditMode = false;
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.CompanyDetailList = [];
    $scope.TestFormBuilder = function () {
        debugger;
        $state.go("FormBuilder");
    }
    $scope.IsCompanyCodeDisabled = true;
    $scope.LabelTxtName = $rootScope.resData.res_AddCompany_ContactPersonNumber;

    $scope.GridConfigurationLoaded === false;
    $scope.PageUrlName = $location.absUrl().split('#/')[1];
    var page = $location.absUrl().split('#/')[1];
    $scope.ViewControllerName = page;

    $scope.ViewLogo = '';

    console.log(JSON.stringify('Page Access Control Data-: ' + $rootScope.pageContrlAcessData));
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }
    $scope.AllCompanyDetailsList = [];

    $rootScope.TransportVehicleJson = {
        labelFilename: '',
        image: ''
    }

    $scope.DocumentTypeList = [];

    $scope.RemoveImageFromJson = function () {


        $scope.TransportVehicleJson.image = '';
        $scope.TransportVehicleJson.labelFilename = '';
    };



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
    $ionicModal.fromTemplateUrl('ViewImage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ViewImageControl = modal;
    });

    $scope.CloseViewImage = function () {
        $scope.ViewImageControl.hide();
        $scope.ViewLogo = '';

    };
    $scope.OpenDeleteConfirmation = function () {

        $scope.DeleteWarningMessageControl.show();
    };
    $scope.CloseDeleteConfirmation = function () {
        $scope.DeleteWarningMessageControl.hide();
    };

    $scope.OpenViewImage = function (CompanyId) {

        $scope.ViewImageControl.show();
        $scope.ViewimgClick(CompanyId);
    };
    $scope.PageCompanyHeaderView = true;
    $scope.TransporterAccountDetails = [];
    $scope.EditAccountdetailGUID = "";
    $scope.SelectedLocationList = [];
    $scope.SelectedProductList = [];
    $scope.EditContactinfoGUID = "";
    $scope.EditTransporterFinanceMappingGUID = "";
    $scope.ZoneCodeList = [];
    $scope.CompanyBranchPlantList = [];
    $scope.ContactInformationList = [];
    $scope.CompanyProductTypeList = [];
    $scope.SelectedZoneList = [];
    $scope.SelectedBranchPlantList = [];
    $scope.TransporterFinanceMappingInfo = [];
    $scope.SelectedProductcategory = [];
    $scope.SelectedId_CompanyGrid = 0;
    $scope.ProductCategoryList = [];
    $scope.disableControl = false;
    $scope.Type = 'Company';
    $scope.TransporterList = [];




    $scope.BindCalendarFrom = function () {

        $('#FromDate').each(function () {
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
    }

    $scope.BindCalendarTo = function () {

        $('#ToDate').each(function () {
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
    }


    $scope.GetAllNotificationTypeMasterDetails = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllNotificationTypeMasterDetails'

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.NotificationTypeMasterList.length > 0) {

                    $rootScope.NotificationTypeMasterList = response.data.Json.NotificationTypeMasterList;
                    $rootScope.Throbber.Visible = false;
                }


            }
        });

    }



    $scope.GetAllCompanyDetails = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllCompanyDetails'

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            if (response.data.Json != undefined) {
                if (response.data.Json.CompanyList.length > 0) {

                    $scope.CompanyDetailList = response.data.Json.CompanyList;
                    $rootScope.Throbber.Visible = false;
                }
            }
            else {
                $scope.CompanyDetailList = [];
                $rootScope.Throbber.Visible = false;

            }


        });

    };






    $scope.GetAllStateDetails = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllStateDetails'

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.StateList.length > 0) {

                    $scope.StateList = response.data.Json.StateList;
                    $rootScope.Throbber.Visible = false;
                }

            }
            else {
                $scope.StateList = [];
                $rootScope.Throbber.Visible = false;
            }


        });

    }

    $scope.GetAllCityDetailsByStateName = function (StateName) {
        debugger;
        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllCityByStateName',
            StateName: StateName
        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.CityList.length > 0) {

                    $scope.CityList = response.data.Json.CityList;
                    $rootScope.Throbber.Visible = false;
                }
            }
            else {
                $scope.CityList = [];
                $rootScope.Throbber.Visible = false;
            }
        });

    }

    $scope.GetAllLocationDetails = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllLocationDetails'

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.LocationList.length > 0) {

                    $scope.LocationList = response.data.Json.LocationList;
                    $rootScope.Throbber.Visible = false;
                }
            }
            else {
                $scope.LocationList = [];
                $rootScope.Throbber.Visible = false;

            }


        });

    }
    $scope.GetAllPaymentTerm = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllPaymentTermCode'

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.PaymentTermList.length > 0) {

                    $scope.PaymentTermList = response.data.Json.PaymentTermList;
                    $rootScope.Throbber.Visible = false;
                }
            }
            else {
                $scope.PaymentTermList = [];
                $rootScope.Throbber.Visible = false;
            }
        });

    }
    $scope.GetAllParentCompanyDetails = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'GetAllParentCompanyDetails'

        };


        var consolidateApiParamater =
        {
            Json: requestData,

        };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            if (response.data.Json != undefined) {
                if (response.data.Json.TableList.ParentCompany !== undefined) {
                    if (response.data.Json.TableList.ParentCompany.ParentCompanyList.length > 0) {
                        $scope.ParentCompanyList = response.data.Json.TableList.ParentCompany.ParentCompanyList;
                        $rootScope.Throbber.Visible = false;
                    }
                }
                else {
                    $scope.ParentCompanyList = [];
                    $rootScope.Throbber.Visible = false;

                }
            }
            else {
                $scope.ParentCompanyList = [];
                $rootScope.Throbber.Visible = false;
            }
        });

    }

    $scope.GetAllStateDetails();
    $scope.GetAllLocationDetails();
    $scope.GetAllPaymentTerm();
    $scope.GetAllParentCompanyDetails();


    $scope.SortByListSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false
        //multiple:false

    }

    $scope.LoadAllEventMasterDetails = function () {

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

                    $rootScope.EventMasterList = response.data.Json.EventMasterList;
                    $rootScope.Throbber.Visible = false;
                }
            }
        });

    }



    $scope.LoadAllEventMasterDetails();

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

    $scope.InitalizeUserDetail = function () {

        $scope.AddCompanyDeailsJSON = {
            CompanyName: '',
            CompanyMnemonic: '',
            CompanyType: '',
            ParentCompany: '',
            AddressLine1: '',
            AddressLine2: '',
            AddressLine3: '',
            City: '',
            State: '',
            PostCode: '',
            Region: '',
            CategoryCode: '',
            BaranchPlant: '',
            TaxId: '',
            SiteUrl: '',
            Logo: '',
            CreatedBy: '',
            SubChannel: '',
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
            CreditLimit: '',
            AvailableCreditLimit: '',
            EmptiesLimit: '',
            ActualEmpties: '',
            PaymentTermCode: '',
            ContactType: '',
            ContactPersonNumber: '',
            ContactPersonName: '',
            AccountNumber: '',
            AccountName: '',
            Accounttype: '',
            CompanyId: 0,
            DocumentInformationList: []
        }
    }
    $scope.InitalizeUserDetail();
    $scope.disableCompanytypeControl = function () {
        //if ($rootScope.pageContrlAcessData.SelectedItemcategory != '0') {

        $scope.BindCalendarFrom();
        $scope.BindCalendarTo();
        if ($scope.PageUrlName === 'AddCompany') {
            $scope.disableControl = false;
            $scope.AddCompanyDeailsJSON.CompanyType = "0";
            $scope.Type = 'Company';
            $scope.PageCompanyHeaderView = true;
        } else if ($scope.PageUrlName === 'AddFinancePartner') {
            $scope.PageCompanyHeaderView = false;
            $scope.disableControl = true;
            $scope.AddCompanyDeailsJSON.CompanyType = "29";
            $scope.Type = 'FinancePartner';
            $scope.PageHeaderView = false;
        }
        else {
            $scope.PageCompanyHeaderView = false;
            $scope.disableControl = true;
            $scope.AddCompanyDeailsJSON.CompanyType = "28";
            $scope.Type = 'Transporter';
            $scope.PageHeaderView = false;
        }
    }

    $scope.filterLookupData = function () {

        var lookuplist
        var CompanyType = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'CompanyType'; });
        if (CompanyType.length > 0) {

            $scope.CompanyTypeList = CompanyType;
            if ($scope.CompanyTypeList.length > 0) {
                $scope.disableCompanytypeControl();
            }

            $rootScope.Throbber.Visible = false;
        }

        var CompanyTypeDocument = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'CompanyTypeDocument'; });
        if (CompanyTypeDocument.length > 0) {

            $scope.DocumentTypeList = CompanyTypeDocument;
            $rootScope.Throbber.Visible = false;
        }

        var RegionData = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'Region'; });
        if (RegionData.length > 0) {

            $scope.RegionDataList = RegionData;
            $rootScope.Throbber.Visible = false;
        }
        var ZoneData = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'Zone'; });
        if (CompanyType.length > 0) {
            debugger;
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

        var ProductCateGoryType = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ProductCategory'; });
        if (ProductCateGoryType.length > 0) {

            $scope.ProductCateGoryList = ProductCateGoryType;
            for (var i = 0; i < $scope.ProductCateGoryList.length; i++) {
                $scope.ProductCateGoryList[i].Id = $scope.ProductCateGoryList[i].LookUpId;
            }
            $rootScope.Throbber.Visible = false;
        }
    }

    $scope.filterLookupData();


    //Load Transporter


    $scope.FinancePartnerJSON = {
        FinancerName: "",
        AddressLine1: "",
        AddressLine2: "",
        AddressLine3: "",
        City: 0,
        State: 0,
        PostCode: "",
        Email: 0,
        ContactPersonNumber: "",
        ContactPersonName: "",
        AccountNumber: "",
        AccountName: "",
        Accounttype: 0,
        FromDate: '',
        ToDate: ''
    }

    $scope.LoadAllTransporter = function () {


        var requestData =
        {
            ServicesAction: 'GetAllTransporterList',
            TransporterId: 0
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.TransporterList = resoponsedata.Transporter.TransporterList;
        });
    }

    $scope.LoadAllTransporter();

    $scope.EditTransporterFinanceMappingdetail = function (id) {
        debugger;
        $scope.ClearTransporterFinanceMappingControls();
        var AccountmappingDetails = $scope.TransporterFinanceMappingInfo.filter(function (m) { return m.TransporterFinanceGUID === id; });
        $scope.EditTransporterFinanceMappingGUID = id;
        $scope.FinancePartnerJSON.Transporter = AccountmappingDetails[0].TransporterId;
        $scope.FinancePartnerJSON.Amount = AccountmappingDetails[0].Amount;
        $scope.FinancePartnerJSON.FromDate = AccountmappingDetails[0].FromDate;
        $scope.FinancePartnerJSON.ToDate = AccountmappingDetails[0].ToDate;
    }


    $scope.DeleteTransporterFinanceMappingDetails = function (id) {

        var AccountmappingDetails = $scope.TransporterFinanceMappingInfo.filter(function (m) { return m.TransporterFinanceGUID !== id; });

        $scope.TransporterFinanceMappingInfo = AccountmappingDetails;
    }

    $scope.AddTransporterFinanceMappingtDetails = function () {
        debugger;
        if (($scope.FinancePartnerJSON.Transporter === '' || $scope.FinancePartnerJSON.Transporter === undefined) || ($scope.FinancePartnerJSON.Amount === '' || $scope.FinancePartnerJSON.Amount === undefined) || ($scope.FinancePartnerJSON.FromDate === '' || $scope.FinancePartnerJSON.FromDate === undefined) || ($scope.FinancePartnerJSON.ToDate === '' || $scope.FinancePartnerJSON.ToDate === undefined)) {
            $rootScope.ValidationErrorAlert('all fields are mandatory ', '', 3000);
            return;
        }
        if ($scope.FinancePartnerJSON.Amount === 0 || $scope.FinancePartnerJSON.Amount === '0' || $scope.FinancePartnerJSON.Amount === "0") {
            $rootScope.ValidationErrorAlert('Loan Amount Can not be Zero ', '', 3000);
            return;
        }
        //alert('sdfsdf');

        var transporter = $scope.TransporterList.filter(function (m) { return m.TransporterId === $scope.FinancePartnerJSON.Transporter; });

        if ($scope.EditTransporterFinanceMappingGUID !== "") {
            var Accountdetails = $scope.TransporterFinanceMappingInfo.filter(function (m) { return m.TransporterFinanceGUID === $scope.EditTransporterFinanceMappingGUID; });

            // Concatctinfo[0].PaymentSlabId = $scope.PaymentSlabId;
            Accountdetails[0].Transporter = transporter[0].TransporterName;
            Accountdetails[0].TransporterId = $scope.FinancePartnerJSON.Transporter;
            Accountdetails[0].Amount = $scope.FinancePartnerJSON.Amount;
            Accountdetails[0].FromDate = $scope.FinancePartnerJSON.FromDate;
            Accountdetails[0].ToDate = $scope.FinancePartnerJSON.ToDate;
            Accountdetails[0].IsActive = true;
            Accountdetails[0].UpdatedBy = $rootScope.UserId;
        }
        else {
            var accountdetail = {
                TransporterFinanceGUID: generateGUID(),
                FinanceTransporterMappingId: 0,
                Transporter: transporter[0].TransporterName,
                TransporterId: $scope.FinancePartnerJSON.Transporter,
                Amount: $scope.FinancePartnerJSON.Amount,
                FromDate: $scope.FinancePartnerJSON.FromDate,
                ToDate: $scope.FinancePartnerJSON.ToDate,
                IsActive: true,
                CreatedBy: $rootScope.UserId,
            }
            $scope.TransporterFinanceMappingInfo.push(accountdetail);
        }
        $scope.ClearTransporterFinanceMappingControls();
    }



    $scope.ClearTransporterFinanceMappingControls = function () {
        $scope.EditTransporterFinanceMappingGUID = "";
        $scope.FinancePartnerJSON.Transporter = "";
        $scope.FinancePartnerJSON.Amount = "";
        $scope.FinancePartnerJSON.FromDate = "";
        $scope.FinancePartnerJSON.ToDate = "";
    }



    //#region Load EventRetrySetting Grid
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

                var CompanyName = "";
                var CompanyNameCriteria = "";

                var CompanyMnemonic = "";
                var CompanyMnemonicCriteria = "";

                var ParentCompany = "";
                var ParentCompanyCriteria = "";

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
                var PostCode = ''
                var PostCodeCriteria = ''
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
                var CompanyTypeName = ''
                var CompanyTypeNameCriteria = ''


                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');
                        if (columnsList[0] === "CompanyName") {
                            CompanyNameCriteria = columnsList[1];
                            CompanyName = columnsList[2];
                        }
                        if (columnsList[0] === "CompanyMnemonic") {
                            CompanyMnemonicCriteria = columnsList[1];
                            CompanyMnemonic = columnsList[2];
                        }
                        if (columnsList[0] === "ParentCompanyName") {
                            ParentCompanyCriteria = columnsList[1];
                            ParentCompany = columnsList[2];
                        }
                        if (columnsList[0] === "CompanyTypeName") {
                            CompanyTypeNameCriteria = columnsList[1];
                            CompanyTypeName = columnsList[2];
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
                        if (columnsList[0] === "Country") {
                            CountryCriteria = columnsList[1];
                            Country = columnsList[2];
                        }
                        if (columnsList[0] === "PostCode") {
                            PostCodeCriteria = columnsList[1];
                            PostCode = columnsList[2];
                        }
                        if (columnsList[0] === "RegionName") {
                            RegionCriteria = columnsList[1];
                            Region = columnsList[2];
                        }
                        if (columnsList[0] === "RouteCode") {
                            RouteCodeCriteria = columnsList[1];
                            RouteCode = columnsList[2];
                        }
                        if (columnsList[0] === "ZoneCode") {
                            ZoneCodeCriteria = columnsList[1];
                            ZoneCode = columnsList[2];
                        }
                        if (columnsList[0] === "BranchPlant") {
                            BranchPlantCriteria = columnsList[1];
                            BranchPlant = columnsList[2];
                        }
                        if (columnsList[0] === "Email") {
                            EmailCriteria = columnsList[1];
                            Email = columnsList[2];
                        }
                        if (columnsList[0] === "SiteURL") {
                            SiteURLCriteria = columnsList[1];
                            SiteURL = columnsList[2];
                        }
                        if (columnsList[0] === "ContactPersonNumber") {
                            ContactPersonNumberCriteria = columnsList[1];
                            ContactPersonNumber = columnsList[2];
                        }
                        if (columnsList[0] === "ContactPersonName") {
                            ContactPersonNameCriteria = columnsList[1];
                            ContactPersonName = columnsList[2];
                        }
                        if (columnsList[0] === "SequenceNo") {
                            SequenceNoCriteria = columnsList[1];
                            SequenceNo = columnsList[2];
                        }
                        if (columnsList[0] === "SubChannel") {
                            SubChannelCriteria = columnsList[1];
                            SubChannel = columnsList[2];
                        }
                        if (columnsList[0] === "Field1") {
                            Field1Criteria = columnsList[1];
                            Field1 = columnsList[2];
                        }
                        if (columnsList[0] === "Field2") {
                            SiteURLCriteria = columnsList[1];
                            SiteURL = columnsList[2];
                        }
                        if (columnsList[0] === "SiteURL") {
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
                        if (columnsList[0] === "CreditLimit") {
                            CreditLimitCriteria = columnsList[1];
                            CreditLimit = columnsList[2];
                        }
                        if (columnsList[0] === "AvailableCreditLimit") {
                            AvailableCreditLimitCriteria = columnsList[1];
                            AvailableCreditLimit = columnsList[2];
                        }
                        if (columnsList[0] === "EmptiesLimit") {
                            EmptiesLimitCriteria = columnsList[1];
                            EmptiesLimit = columnsList[2];

                        }
                        if (columnsList[0] === "ActualEmpties") {
                            ActualEmptiesCriteria = columnsList[1];
                            ActualEmpties = columnsList[2];

                        }
                        if (columnsList[0] === "PaymentTermCode") {
                            PaymentTermCodeCriteria = columnsList[1];
                            PaymentTermCode = columnsList[2];

                        }
                        if (columnsList[0] === "CategoryType") {
                            CategoryTypeCriteria = columnsList[1];
                            CategoryType = columnsList[2];

                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                debugger;
                var requestData =
                {
                    ServicesAction: 'LoadCompanyDetails',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: OrderBy,
                    OrderByCriteria: OrderByCriteria,

                    CompanyName: CompanyName,
                    CompanyNameCriteria: CompanyNameCriteria,
                    CompanyMnemonic: CompanyMnemonic,
                    CompanyMnemonicCriteria: CompanyMnemonicCriteria,
                    ParentCompany: ParentCompany,
                    ParentCompanyCriteria: ParentCompanyCriteria,

                    AddressLine1: AddressLine1,
                    AddressLine1Criteria: AddressLine1Criteria,
                    AddressLine2: AddressLine2,
                    AddressLine2Criteria: AddressLine2Criteria,
                    AddressLine3: AddressLine3,
                    AddressLine3Criteria: AddressLine3Criteria,
                    City: City,
                    CityCriteria: CityCriteria,
                    State: State,
                    StateCriteria: StateCriteria,
                    Country: Country,
                    CountryCriteria: CountryCriteria,
                    PostCode: PostCode,
                    PostCodeCriteria: PostCodeCriteria,
                    Region: Region,
                    RegionCriteria: RegionCriteria,
                    RouteCode: RouteCode,
                    RouteCodeCriteria: RouteCodeCriteria,
                    ZoneCode: ZoneCode,
                    ZoneCodeCriteria: ZoneCodeCriteria,
                    CategoryCode: CategoryCode,
                    CategoryCodeCriteria: CategoryCodeCriteria,
                    BranchPlant: BranchPlant,
                    BranchPlantCriteria: BranchPlantCriteria,
                    Email: Email,
                    EmailCriteria: EmailCriteria,
                    SiteURL: SiteURL,
                    SiteURLCriteria: SiteURLCriteria,
                    ContactPersonNumber: ContactPersonNumber,
                    ContactPersonNumberCriteria: ContactPersonNumberCriteria,
                    ContactPersonName: ContactPersonName,
                    ContactPersonNameCriteria: ContactPersonNameCriteria,
                    SequenceNo: SequenceNo,
                    SequenceNoCriteria: SequenceNoCriteria,
                    SubChannel: SubChannel,
                    SubChannelCriteria: SubChannelCriteria,
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
                    CreditLimit: CreditLimit,
                    CreditLimitCriteria: CreditLimitCriteria,
                    AvailableCreditLimit: AvailableCreditLimit,
                    AvailableCreditLimitCriteria: AvailableCreditLimitCriteria,
                    EmptiesLimit: EmptiesLimit,
                    EmptiesLimitCriteria: EmptiesLimitCriteria,
                    ActualEmpties: ActualEmpties,
                    ActualEmptiesCriteria: ActualEmptiesCriteria,
                    PaymentTermCode: PaymentTermCode,
                    PaymentTermCodeCriteria: PaymentTermCodeCriteria,
                    CategoryType: CategoryType,
                    CategoryTypeCriteria: CategoryTypeCriteria,
                    CompanyTypeName: CompanyTypeName,
                    CompanyTypeNameCriteria: CompanyTypeNameCriteria,
                    SearchType: $scope.AddCompanyDeailsJSON.CompanyType,
                    RoleId: $rootScope.RoleId
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
                            if (resoponsedata.Json.AllCompanyDetailsList.length !== undefined) {
                                if (resoponsedata.Json.AllCompanyDetailsList.length > 0) {
                                    totalcount = resoponsedata.Json.AllCompanyDetailsList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.AllCompanyDetailsList.TotalCount;
                            }

                            ListData = resoponsedata.Json.AllCompanyDetailsList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    debugger;
                    var data = ListData;
                    $scope.AllCompanyDetailsList = $scope.AllCompanyDetailsList.concat(data);
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

            columns: $scope.DynamicColumnList,
        };
    }
    //#endregion

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {
        $scope.GetAllParentCompanyDetails();
        $scope.PaymentSlabList = [];
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

    $scope.ClearContactinfoControls = function () {
        $scope.EditContactinfoGUID = "";
        $scope.AddCompanyDeailsJSON.ContactTypeId = 0;
        $scope.AddCompanyDeailsJSON.ContactPersonNumber = "";
        $scope.AddCompanyDeailsJSON.ContactPersonName = "";
    }

    $scope.ClearAccountDetailsControls = function () {
        $scope.EditAccountdetailGUID = "";
        $scope.AddCompanyDeailsJSON.AccountNumber = 0;
        $scope.AddCompanyDeailsJSON.BankName = "";
        $scope.AddCompanyDeailsJSON.AccountName = "";
        $scope.AddCompanyDeailsJSON.AccountType = "";
    }

    $scope.ClearControls = function () {
        $scope.ClearContactinfoControls();
        $scope.ClearAccountDetailsControls();
        $scope.LocationList = [];
        $scope.IsCompanyCodeDisabled = true;
        $rootScope.TransportVehicleJson.image = '';
        $rootScope.TransportVehicleJson.image = '';
        $rootScope.TransportVehicleJson.labelFilename = '';
        $scope.imageSrc = '';
        $scope.AddCompanyDeailsJSON.CompanyName = '';
        $scope.AddCompanyDeailsJSON.CompanyMnemonic = '';
        $scope.AddCompanyDeailsJSON.ParentCompany = '';
        $scope.AddCompanyDeailsJSON.AddressLine1 = '';
        $scope.AddCompanyDeailsJSON.AddressLine2 = '';
        $scope.AddCompanyDeailsJSON.AddressLine3 = '';
        $scope.AddCompanyDeailsJSON.City = '';
        $scope.AddCompanyDeailsJSON.State = '';
        $scope.AddCompanyDeailsJSON.PostCode = '';
        $scope.AddCompanyDeailsJSON.Region = '';
        $scope.AddCompanyDeailsJSON.CategoryCode = '';
        $scope.AddCompanyDeailsJSON.BaranchPlant = '';
        $scope.AddCompanyDeailsJSON.TaxId = '';
        $scope.AddCompanyDeailsJSON.SiteUrl = '';
        $scope.AddCompanyDeailsJSON.Logo = '';
        $scope.AddCompanyDeailsJSON.CreatedBy = '';
        $scope.AddCompanyDeailsJSON.SubChannel = '';
        $scope.AddCompanyDeailsJSON.Field1 = '';
        $scope.AddCompanyDeailsJSON.Field2 = '';
        $scope.AddCompanyDeailsJSON.Field3 = '';
        $scope.AddCompanyDeailsJSON.Field4 = '';
        $scope.AddCompanyDeailsJSON.Field5 = '';
        $scope.AddCompanyDeailsJSON.Field6 = '';
        $scope.AddCompanyDeailsJSON.Field7 = '';
        $scope.AddCompanyDeailsJSON.Field8 = '';
        $scope.AddCompanyDeailsJSON.Field9 = '';
        $scope.AddCompanyDeailsJSON.Field9 = '';
        $scope.AddCompanyDeailsJSON.Field10 = '';
        $scope.AddCompanyDeailsJSON.CreditLimit = '';
        $scope.AddCompanyDeailsJSON.AvailableCreditLimit = '';
        $scope.AddCompanyDeailsJSON.EmptiesLimit = '';
        $scope.AddCompanyDeailsJSON.ActualEmpties = '',
            $scope.AddCompanyDeailsJSON.PaymentTermCode = '';
        $scope.AddCompanyDeailsJSON.ContactTypeId = '';
        $scope.AddCompanyDeailsJSON.ContactPersonNumber = '';
        $scope.AddCompanyDeailsJSON.ContactPersonName = '';
        $scope.AddCompanyDeailsJSON.AccountNumber = '';
        $scope.AddCompanyDeailsJSON.BankName = '';
        $scope.AddCompanyDeailsJSON.AccountName = '';
        $scope.AddCompanyDeailsJSON.Accounttype = '';

        $scope.AddCompanyDeailsJSON.CompanyId = 0;
        $scope.TransporterAccountDetails = [];
        $scope.TransporterFinanceMappingInfo = [];
        $scope.EditAccountdetailGUID = '';
        $scope.SelectedLocationList = [];
        $scope.SelectedProductList = [];
        $scope.EditContactinfoGUID = '';
        $scope.ZoneCodeList = [];
        $scope.CompanyBranchPlantList = [];
        $scope.ContactInformationList = [];
        $scope.CompanyProductTypeList = [];
        $scope.SelectedZoneList = [];
        $scope.SelectedBranchPlantList = [];
        $scope.SelectedId_CompanyGrid = 0;
        $scope.ProductCategoryList = [];
        $scope.SelectedProductcategory = [];
        $scope.disableCompanytypeControl();
        $scope.AddCompanyDeailsJSON.DocumentInformationList = [];

        $scope.EditMode = false;

    }

    $scope.AddForm = function () {

        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.ClearControls();
    }

    $scope.ViewForm = function () {

        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.ClearControls();
        //$scope.RefreshDataGrid();
    }


    $scope.ViewForm();

    $scope.Edit = function (id) {
        $scope.InitalizeUserDetail();
        $rootScope.Throbber.Visible = true;
        $scope.IsCompanyCodeDisabled = false;

        $scope.AddForm();
        $scope.EditMode = true;
        var requestData =
        {
            ServicesAction: 'GetCompanyDetailsByCompanyId',
            CompanyId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (response.data.Json != undefined) {
                var responsedata = response.data.Json.CompanyList[0];
                $scope.AddCompanyDeailsJSON.CompanyId = responsedata.CompanyId;
                $scope.AddCompanyDeailsJSON.CompanyName = responsedata.CompanyName;
                $scope.AddCompanyDeailsJSON.CompanyMnemonic = responsedata.CompanyMnemonic;
                $scope.AddCompanyDeailsJSON.CompanyType = responsedata.CompanyType;
                $scope.AddCompanyDeailsJSON.ParentCompany = responsedata.ParentCompany;
                $scope.AddCompanyDeailsJSON.AddressLine1 = responsedata.AddressLine1;
                $scope.AddCompanyDeailsJSON.AddressLine2 = responsedata.AddressLine2;
                $scope.AddCompanyDeailsJSON.AddressLine3 = responsedata.AddressLine3;
                $scope.AddCompanyDeailsJSON.State = responsedata.State;
                $scope.GetAllCityDetailsByStateName($scope.AddCompanyDeailsJSON.State);
                $scope.AddCompanyDeailsJSON.City = responsedata.City;
                $scope.AddCompanyDeailsJSON.PostCode = responsedata.PostCode;
                $scope.AddCompanyDeailsJSON.Region = responsedata.Region;
                $scope.AddCompanyDeailsJSON.CategoryCode = responsedata.CategoryCode;
                $scope.AddCompanyDeailsJSON.BaranchPlant = responsedata.BaranchPlant;
                $scope.AddCompanyDeailsJSON.TaxId = responsedata.TaxId;
                $scope.AddCompanyDeailsJSON.SiteUrl = responsedata.SiteURL;
                $rootScope.imageSrc = responsedata.Logo;
                $rootScope.TransportVehicleJson.image = responsedata.Logo;
                $scope.AddCompanyDeailsJSON.CreatedBy = responsedata.CreatedBy;
                $scope.AddCompanyDeailsJSON.SubChannel = responsedata.SubChannel;
                $scope.AddCompanyDeailsJSON.Field1 = responsedata.Field1;
                $scope.AddCompanyDeailsJSON.Field2 = responsedata.Field2;
                $scope.AddCompanyDeailsJSON.Field3 = responsedata.Field3;
                $scope.AddCompanyDeailsJSON.Field4 = responsedata.Field4;
                $scope.AddCompanyDeailsJSON.Field5 = responsedata.Field5;
                $scope.AddCompanyDeailsJSON.Field6 = responsedata.Field6;
                $scope.AddCompanyDeailsJSON.Field7 = responsedata.Field7;
                $scope.AddCompanyDeailsJSON.Field8 = responsedata.Field8;
                $scope.AddCompanyDeailsJSON.Field9 = responsedata.Field9;
                $scope.AddCompanyDeailsJSON.Field10 = responsedata.Field10;
                $scope.AddCompanyDeailsJSON.CreditLimit = responsedata.CreditLimit;
                $scope.AddCompanyDeailsJSON.AvailableCreditLimit = responsedata.AvailableCreditLimit;
                $scope.AddCompanyDeailsJSON.EmptiesLimit = responsedata.EmptiesLimit;
                $scope.AddCompanyDeailsJSON.ActualEmpties = responsedata.ActualEmpties;
                $scope.AddCompanyDeailsJSON.PaymentTermCode = responsedata.PaymentTermCode;
                debugger;
                if (responsedata.DocumentInformationList !== undefined && responsedata.DocumentInformationList !== null) {
                    $scope.AddCompanyDeailsJSON.DocumentInformationList = responsedata.DocumentInformationList;
                }

                if (responsedata.ZoneCodeList != undefined) {
                    if (responsedata.ZoneCodeList.length > 0) {
                        $scope.SelectedZoneList = responsedata.ZoneCodeList;
                    }
                    else {
                        $scope.SelectedZoneList = [];
                    }
                }

                if (responsedata.CompanyBranchPlantList != undefined) {
                    if (responsedata.CompanyBranchPlantList.length > 0) {
                        $scope.SelectedLocationList = responsedata.CompanyBranchPlantList
                    } else {
                        $scope.SelectedLocationList = [];
                    }
                }
                if (responsedata.ProductCategoryList != undefined) {
                    if (responsedata.ProductCategoryList.length > 0) {
                        $scope.SelectedProductcategory = responsedata.ProductCategoryList
                    } else {
                        $scope.SelectedProductcategory = [];
                    }
                }


                if (responsedata.CompanyProductTypeList != undefined) {
                    $scope.SelectedProductList = responsedata.CompanyProductTypeList
                } else {
                    $scope.SelectedProductList = [];
                }
                var ContactInfo = response.data.Json.CompanyList[0].ContactInformationList;
                var AccountDetails = response.data.Json.CompanyList[0].TransporterAccountDetailsList;

                var FinanceTransporterMapping = response.data.Json.CompanyList[0].FinanceTransporterMappingList;

                if (FinanceTransporterMapping != undefined) {
                    if (FinanceTransporterMapping !== 0) {
                        for (var i = 0; i < FinanceTransporterMapping.length; i++) {

                            var accountdetail = {
                                TransporterFinanceGUID: generateGUID(),
                                FinanceTransporterMappingId: FinanceTransporterMapping[i].FinanceTransporterMappingId,
                                Transporter: FinanceTransporterMapping[i].Transporter,
                                TransporterId: FinanceTransporterMapping[i].TransporterId,
                                Amount: FinanceTransporterMapping[i].Amount,
                                FromDate: FinanceTransporterMapping[i].FromDate,
                                ToDate: FinanceTransporterMapping[i].ToDate,
                                IsActive: true,
                                CreatedBy: $rootScope.UserId,
                            }
                            $scope.TransporterFinanceMappingInfo.push(accountdetail);
                        }
                    }
                }


                if (ContactInfo != undefined) {
                    if (ContactInfo !== 0) {
                        for (var i = 0; i < ContactInfo.length; i++) {

                            $scope.Contactinfo1 = {
                                ContactinfoGUID: generateGUID(),
                                ContactType: ContactInfo[i].ContactType,
                                ContactTypeId: ContactInfo[i].ContactTypeId,
                                ContactPersonName: ContactInfo[i].ContactPersonName,
                                ContactPersonNumber: ContactInfo[i].ContactPersonNumber,
                                ObjectType: 'Company',
                                IsActive: true,
                                CreatedBy: $rootScope.UserId,
                            }
                            $scope.ContactInformationList.push($scope.Contactinfo1);
                        }
                    }
                }
                if (AccountDetails != undefined) {
                    if (AccountDetails !== 0) {
                        for (var i = 0; i < AccountDetails.length; i++) {

                            $scope.AccountDetails1 = {
                                AccountdetailGUID: generateGUID(),
                                AccountNumber: AccountDetails[i].AccountNumber,
                                BankName: AccountDetails[i].BankName,
                                AccountName: AccountDetails[i].AccountName,
                                AccountTypeId: AccountDetails[i].AccountTypeId,
                                AccountType: AccountDetails[i].AccountType,
                                IsActive: true,
                                CreatedBy: $rootScope.UserId,
                            }
                            $scope.TransporterAccountDetails.push($scope.AccountDetails1);
                        }
                    }
                }
                $rootScope.Throbber.Visible = false;
            }
            //else {
            //    $rootScope.Throbber.Visible = false;
            //}
        });
    }
    $scope.ViewimgClick = function (id) {
        $rootScope.Throbber.Visible = true;

        var requestData =
        {
            ServicesAction: 'GetCompanyDetailsByCompanyId',
            CompanyId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (response.data.Json != undefined) {
                var responsedata = response.data.Json.CompanyList[0];
                $scope.ViewLogo = responsedata.Logo;
                $rootScope.Throbber.Visible = false;
            }
            //else {
            //    $rootScope.Throbber.Visible = false;
            //}
        });
    }
    $scope.fileupload = {
        File: ''
    }
    $scope.imageSrc = "";

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
        debugger;
        $rootScope.Throbber.Visible = true;
        //alert($rootScope.Throbber.Visible);

        var status = true;
        if ($scope.AddCompanyDeailsJSON.CompanyName != '') {
            if ($scope.AddCompanyDeailsJSON.AddressLine1 != '') {
                if ($scope.AddCompanyDeailsJSON.State != '') {
                    //if ($scope.AddCompanyDeailsJSON.SiteUrl !== '' && $scope.AddCompanyDeailsJSON.SiteUrl !== null && $scope.AddCompanyDeailsJSON.SiteUrl !== undefined) {
                    if ($scope.ValidationForUrl($scope.AddCompanyDeailsJSON.SiteUrl)) {
                        status = true;
                    }
                    else {
                        status = false;
                    }
                }
                if (status === true) {


                    //var	stateListId = $scope.StateList.filter(function (el) { return el.StateId === $scope.AddCompanyDeailsJSON.State; });
                    //var	CityListId = $scope.CityList.filter(function (el) { return el.CityId === $scope.AddCompanyDeailsJSON.City; });
                    $scope.AddZoneAndLocationList();
                    var serviceaction = "";
                    if ($scope.AddCompanyDeailsJSON.CompanyId !== 0) {
                        serviceaction = 'UpdateCompany';
                    }
                    else {
                        serviceaction = 'SaveCompanyDatails';
                    }
                    var requestData =
                    {
                        ServicesAction: serviceaction,
                        CompanyId: $scope.AddCompanyDeailsJSON.CompanyId,
                        CompanyName: $scope.AddCompanyDeailsJSON.CompanyName,
                        CompanyMnemonic: $scope.AddCompanyDeailsJSON.CompanyMnemonic,
                        CompanyType: $scope.AddCompanyDeailsJSON.CompanyType,
                        ParentCompany: $scope.AddCompanyDeailsJSON.ParentCompany,
                        AddressLine1: $scope.AddCompanyDeailsJSON.AddressLine1,
                        AddressLine2: $scope.AddCompanyDeailsJSON.AddressLine2,
                        AddressLine3: $scope.AddCompanyDeailsJSON.AddressLine3,
                        City: $scope.AddCompanyDeailsJSON.City,
                        State: $scope.AddCompanyDeailsJSON.State,
                        PostCode: $scope.AddCompanyDeailsJSON.PostCode,
                        Region: $scope.AddCompanyDeailsJSON.Region,
                        CategoryCode: $scope.AddCompanyDeailsJSON.CategoryCode,
                        BaranchPlant: $scope.AddCompanyDeailsJSON.BaranchPlant,
                        TaxId: $scope.AddCompanyDeailsJSON.TaxId,
                        SiteUrl: $scope.AddCompanyDeailsJSON.SiteUrl,
                        Logo: $rootScope.TransportVehicleJson.image,
                        CreatedBy: $scope.AddCompanyDeailsJSON.CreatedBy,
                        SubChannel: $scope.AddCompanyDeailsJSON.SubChannel,
                        Field1: $scope.AddCompanyDeailsJSON.Field1,
                        Field2: $scope.AddCompanyDeailsJSON.Field2,
                        Field3: $scope.AddCompanyDeailsJSON.Field3,
                        Field4: $scope.AddCompanyDeailsJSON.Field4,
                        Field5: $scope.AddCompanyDeailsJSON.Field5,
                        Field6: $scope.AddCompanyDeailsJSON.Field6,
                        Field7: $scope.AddCompanyDeailsJSON.Field7,
                        Field8: $scope.AddCompanyDeailsJSON.Field8,
                        Field9: $scope.AddCompanyDeailsJSON.Field9,
                        Field10: $scope.AddCompanyDeailsJSON.Field10,
                        CreditLimit: $scope.AddCompanyDeailsJSON.CreditLimit,
                        AvailableCreditLimit: $scope.AddCompanyDeailsJSON.AvailableCreditLimit,
                        EmptiesLimit: $scope.AddCompanyDeailsJSON.EmptiesLimit,
                        ActualEmpties: $scope.AddCompanyDeailsJSON.ActualEmpties,
                        PaymentTermCode: $scope.AddCompanyDeailsJSON.PaymentTermCode,
                        IsActive: true,
                        CreatedBy: $rootScope.UserId,
                        ZonCodeList: $scope.ZoneCodeList,
                        CompanyBranchPlantList: $scope.CompanyBranchPlantList,
                        CompanyProductTypeList: $scope.CompanyProductTypeList,
                        ContactInformationList: $scope.ContactInformationList,
                        TransporterAccountDetailList: $scope.TransporterAccountDetails,
                        TransporterFinanceMappingList: $scope.TransporterFinanceMappingInfo,
                        ProductCategoryList: $scope.ProductCategoryList,
                        DocumentInformationList: $scope.AddCompanyDeailsJSON.DocumentInformationList,
                        PageName: $scope.ViewControllerName,
                        RoleId: $rootScope.RoleId,
                        UserId: $rootScope.UserId
                    };



                    var consolidateApiParamater =
                    {
                        Json: requestData
                    };


                    GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                        if (response.data.Json != undefined) {
                            if (response.data.Json.CompanyId === '-1') {
                                $rootScope.ValidationErrorAlert('Record Already Exist', '', 3000);
                                $rootScope.Throbber.Visible = false;
                            }
                            else {
                                if ($scope.AddCompanyDeailsJSON.CompanyId !== 0) {
                                    $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
                                    $rootScope.Throbber.Visible = false;
                                }
                                else {
                                    $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
                                    $rootScope.Throbber.Visible = false;
                                }
                                $scope.ClearControls();

                                $scope.ViewForm();
                                $scope.RefreshDataGrid();
                            }
                        }
                        else {
                            $rootScope.ValidationErrorAlert(response.data.ErrorValidationMessage + String.format($rootScope.resData.res_ServerSideVlaidationMsg_View), '', 3000);
                            $rootScope.Throbber.Visible = false;
                        }
                    });

                    //}
                    // else {
                    //    $rootScope.ValidationErrorAlert('Enter Valid Site Url', '', 3000);
                    //    //$rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
                    //    $rootScope.Throbber.Visible = false;
                    //}
                } else {
                    $rootScope.ValidationErrorAlert('Select State', '', 3000);
                    $rootScope.Throbber.Visible = false;
                }
            }

            else {
                $rootScope.ValidationErrorAlert('Enter Address', '', 3000);
                $rootScope.Throbber.Visible = false;
            }


        } else {
            $rootScope.ValidationErrorAlert('Enter Company Name', '', 3000);
            $rootScope.Throbber.Visible = false;
        }

    }

    $scope.AddZoneAndLocationList = function () {
        debugger;
        //$scope.ZoneCodeList = [];
        if ($scope.SelectedZoneList.length > 0) {
            for (var i = 0; i < $scope.SelectedZoneList.length; i++) {
                var objectZoneDataList = $scope.ZoneDataList.filter(function (el) { return el.Id === $scope.SelectedZoneList[i].Id; });
                // alert(JSON.stringify(objectZoneDataList));
                if (objectZoneDataList.length > 0) {
                    var ZoneCode = objectZoneDataList[0].Id
                    var ZoneName = objectZoneDataList[0].Name
                } else {
                    var ZoneCode = '';
                    var ZoneName = '';
                }

                ObjZoneData = {
                    ZoneCode: ZoneCode,
                    ZoneName: ZoneName,
                    IsActive: true,
                    CreatedBy: $rootScope.UserId,
                }
                $scope.ZoneCodeList.push(ObjZoneData);
            }
        }


        if ($scope.SelectedLocationList.length > 0) {
            for (var i = 0; i < $scope.SelectedLocationList.length; i++) {
                var objectLocationList = $scope.LocationList.filter(function (el) { return el.Id === $scope.SelectedLocationList[i].Id; });
                if (objectLocationList.length > 0) {
                    var LocationId = objectLocationList[0].Id
                    var LocationName = objectLocationList[0].Name
                } else {
                    var LocationId = '';
                    var LocationName = '';
                }

                ObjLocationData = {
                    BranchPlantId: LocationId,
                    LocationName: LocationName,
                    IsActive: true,
                    CreatedBy: $rootScope.UserId,
                }
                $scope.CompanyBranchPlantList.push(ObjLocationData);
            }
        }


        if ($scope.SelectedProductList.length > 0) {
            for (var i = 0; i < $scope.SelectedProductList.length; i++) {
                var objectProductList = $scope.ProductTypeList.filter(function (el) { return el.Id === $scope.SelectedProductList[i].Id; });
                if (objectProductList.length > 0) {
                    var ProductTypeName = objectProductList[0].Name
                    var ProductTypeCode = objectProductList[0].Id

                } else {
                    var ProductTypeName = '';
                    var ProductTypeCode = '';
                }

                ObjZoneData = {
                    ProductTypeName: ProductTypeName,
                    ProductTypeCode: ProductTypeCode,
                    IsActive: true,
                    CreatedBy: $rootScope.UserId,
                }
                $scope.CompanyProductTypeList.push(ObjZoneData);
            }
        }
        if ($scope.SelectedProductcategory.length > 0) {

            for (var i = 0; i < $scope.SelectedProductcategory.length; i++) {
                var objectProductCategoryList = $scope.ProductCateGoryList.filter(function (el) { return el.Id === $scope.SelectedProductcategory[i].Id; });
                if (objectProductCategoryList.length > 0) {
                    var ProductCategoryTypeName = objectProductCategoryList[0].Name
                    var ProductCategoryId = objectProductCategoryList[0].Id

                } else {
                    var ProductCategoryTypeName = '';
                    var ProductCategoryId = '';
                }

                ObjZoneData = {
                    ProductCategoryName: ProductCategoryTypeName,
                    ProductCategoryId: ProductCategoryId,
                    IsActive: true,
                    CreatedBy: $rootScope.UserId,
                }
                $scope.ProductCategoryList.push(ObjZoneData);
            }
        }
    }

    $scope.DeleteYes = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'DeleteCompany',
            CompanyId: $scope.SelectedId_CompanyGrid,
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

    $scope.Delete_AddCompany = function (Id) {
        $scope.SelectedId_CompanyGrid = Id;
        $scope.DeleteWarningMessageControl.show();
    }

    $scope.filterValue = function ($event) {

        var regex = new RegExp("^[0-9]*$");

        var key = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);
        if (!regex.test(key)) {
            $event.preventDefault();
        }
    };

    $scope.ChangelabelName = function () {
        debugger;
        var ContactDetailsCode = "";
        var ContactTypeCode = $scope.ContactTypeList.filter(function (el) { return el.LookUpId === $scope.AddCompanyDeailsJSON.ContactTypeId; });
        if (ContactTypeCode.length > 0) {
            ContactDetailsCode = ContactTypeCode[0].Name;
        }
        if (ContactDetailsCode.toUpperCase() === 'MOBILENO') {
            $scope.LabelTxtName = $rootScope.resData.res_AddCompany_ContactPersonNumber;
        }
        else if (ContactDetailsCode.toUpperCase() === 'EMAIL') {
            $scope.LabelTxtName = $rootScope.resData.res_AddCompany_ContactPersonEmailId;
        }
        else if (ContactDetailsCode.toUpperCase() === 'FAX') {
            $scope.LabelTxtName = $rootScope.resData.res_AddCompany_ContactPersonFaxNo;
        }
        else {
            $scope.LabelTxtName = $rootScope.resData.res_AddCompany_ContactPersonNumber;
        }

    }

    $scope.AddContactPersonInfo = function () {

        if ($scope.AddCompanyDeailsJSON.ContactTypeId === '' || $scope.AddCompanyDeailsJSON.ContactPersonName === '' || $scope.AddCompanyDeailsJSON.ContactPersonNumber === '') {
            $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
            return;
        }
        if ($scope.validateEmailSemicolon($scope.AddCompanyDeailsJSON.ContactPersonNumber).length > 0) {

            var ContactDetailsCode = "";
            var ContactTypeCode = $scope.ContactTypeList.filter(function (el) { return el.LookUpId === $scope.AddCompanyDeailsJSON.ContactTypeId; });
            if (ContactTypeCode.length > 0) {
                ContactDetailsCode = ContactTypeCode[0].Name;
            }
            if (ContactDetailsCode.toUpperCase() === 'MOBILENO') {
                $rootScope.ValidationErrorAlert('Please Enter Valid Mobile No.', 'error', 3000);
            }
            else if (ContactDetailsCode.toUpperCase() === 'EMAIL') {
                $rootScope.ValidationErrorAlert('Please Enter Valid Email ID.', 'error', 3000);
            }
            else if (ContactDetailsCode.toUpperCase() === 'FAX') {
                $rootScope.ValidationErrorAlert('Please Enter Valid Fax.', 'error', 3000);
            }
            return;
        }

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
                ObjectType: 'Company',
                IsActive: true,
                CreatedBy: $rootScope.UserId,
            }
            $scope.ContactInformationList.push(Contactinfo);
        }
        $scope.ClearContactinfoControls();

        //else {
        //    $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
        //}
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
        if ($scope.AddCompanyDeailsJSON.AccountNumber != '' && $scope.AddCompanyDeailsJSON.BankName != '' && $scope.AddCompanyDeailsJSON.AccountType && $scope.AddCompanyDeailsJSON.AccountName != '') {

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
                Accountdetails[0].BankName = $scope.AddCompanyDeailsJSON.BankName;
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
                    BankName: $scope.AddCompanyDeailsJSON.BankName,
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
        $scope.AddCompanyDeailsJSON.BankName = AccountDeatils[0].BankName
        $scope.AddCompanyDeailsJSON.AccountName = AccountDeatils[0].AccountName
        $scope.AddCompanyDeailsJSON.AccountType = AccountDeatils[0].AccountTypeId
    }

    $scope.DeleteAccountDetails = function (id) {

        var AccountDetails = $scope.TransporterAccountDetails.filter(function (m) { return m.AccountdetailGUID !== id; });

        $scope.TransporterAccountDetails = AccountDetails;
    }


    //if ($scope.PageCompanyHeaderView === true) {
    //    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_AddCompanyHeader_View;
    //} else {
    //    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_TransPorterHeader_View;
    //}

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    function validateMobileNo(MobileNo) {
        var re = /[0-9 -()+{10}]+$/;
        return re.test(MobileNo);
        //  var status = re.test(MobileNo);
        //if ((MobileNo.length >= 10) && (status === true));
        //{
        //    return true;
        //}
    }

    $scope.LoadCompanyUsersData = function () {

        debugger;
        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'LoadCompanyDetails',
            PageIndex: 0,
            PageSize: 100,
            OrderBy: "",
            OrderByCriteria: "",
            RoleId: $rootScope.RoleId,
            SearchText: $scope.SearchValue.search
        };

        $scope.RequestDataFilter = requestData;

        var consolidateApiParamater =
        {
            Json: requestData
        };

        console.log("LoadCompanyUsersData: " + new Date());
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

            var totalcount = 0;
            var ListData = [];
            var resoponsedata = response.data;
            if (resoponsedata !== null) {

                if (resoponsedata.Json !== undefined) {
                    if (resoponsedata.Json.AllCompanyDetailsList.length !== undefined) {
                        if (resoponsedata.Json.AllCompanyDetailsList.length > 0) {
                            totalcount = resoponsedata.Json.AllCompanyDetailsList[0].TotalCount;
                        }

                    } else {
                        totalcount = resoponsedata.Json.AllCompanyDetailsList.TotalCount;
                    }

                    ListData = resoponsedata.Json.AllCompanyDetailsList;
                } else {
                    ListData = [];
                    totalcount = 0;
                }
            }

            var data = ListData;
            $scope.AllCompanyDetailsList = data;
            $rootScope.Throbber.Visible = false;
        });

    };

    $scope.ConfirmationMessagePopup = false;
    if ($scope.ViewControllerName === "ActivateDeactivateUser") {

        $scope.LoadCompanyUsersData();

    }
    else {
        $scope.GetAllCompanyDetails();
    }

    $scope.SearchList = function () {
        $scope.LoadCompanyUsersData();
    };

    $scope.ClearSearch = function () {
        $scope.SearchValue.search = "";
        $scope.LoadCompanyUsersData();
    };

    $scope.ShowQuickActionPopOver = function (childCustomer, Customer) {


        var OpenOuickActionList = Customer.filter(function (el) {
            return el.ShowQuickAction === true && el.CompanyMnemonic !== childCustomer.CompanyMnemonic;
        });
        if (OpenOuickActionList.length > 0) {
            for (var k = 0; k < OpenOuickActionList.length; k++) {
                OpenOuickActionList[k].ShowQuickAction = false;
            }
        }

        if (childCustomer.ShowQuickAction !== true) {
            childCustomer.ShowQuickAction = true;
        } else {
            childCustomer.ShowQuickAction = false;
        }

    };

    $ionicModal.fromTemplateUrl('templates/CompanyActiveDeactiveModal.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.CompanyActiveDeactiveModalPopup = modal;
    });

    $scope.AcivateDeactivateCompanyId = "";
    $scope.ActiveOrDeactive = "";

    $scope.OpenActivateDeactivatPopup = function (company, activeOrDeactive) {

        company.ShowQuickAction = false;
        $scope.AcivateDeactivateCompanyId = company.CompanyId;
        $scope.ActiveOrDeactive = activeOrDeactive;
        $scope.CompanyActiveDeactiveModalPopup.show();

    };

    $scope.CloseActivateDeactivatPopup = function () {

        $scope.AcivateDeactivateCompanyId = "";
        $scope.ActiveOrDeactive = "";
        $scope.CompanyActiveDeactiveModalPopup.hide();

    };

    $scope.SaveActivateDeactivatesCompany = function () {
        $rootScope.Throbber.Visible = true;
        var companyJson = {
            CompanyId: parseInt($scope.AcivateDeactivateCompanyId),
            ActivateOrDeactivate: $scope.ActiveOrDeactive
        };
        var activateDeactivateApi = ManageCustomerService.ActivateDeactivateCompany(companyJson);

        $q.all([
            activateDeactivateApi
        ]).then(function (resp) {
            debugger;

            $scope.CloseActivateDeactivatPopup();

            if (resp[0] !== undefined && resp[0] !== "" && resp[0] !== null) {
                if (resp[0].data !== undefined && resp[0].data !== "" && resp[0].data !== null) {

                    if (resp[0].data.ErrorMessage === "ActivationSuccess") {
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ActivateDeactivateUser_UserActivateMsg), '', 3000);
                    } else if (resp[0].data.ErrorMessage === "HierarchyIssue") {
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ActivateDeactivateUser_HierarchyIssue), '', 3000);
                    } else if (resp[0].data.ErrorMessage === "SupplierIssue") {
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ActivateDeactivateUser_SupplierIssue), '', 3000);
                    } else if (resp[0].data.ErrorMessage === "CatalogIssue") {
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ActivateDeactivateUser_CatalogIssue), '', 3000);
                    } else if (resp[0].data.ErrorMessage === "DectivationSuccess") {
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ActivateDeactivateUser_UserDeActivateMsg), '', 3000);
                    }

                }
            }

            $rootScope.Throbber.Visible = false;

            if ($scope.ViewControllerName === "ActivateDeactivateUser") {

                $scope.LoadCompanyUsersData();

            }
            else {
                $scope.RefreshDataGrid();
            }

            

        });

    };

    $scope.CloseConfirmationMessagePopup = function () {

        $scope.ConfirmationMessagePopup = false;

    };

    //#region Regenerate OTP
    $ionicModal.fromTemplateUrl('ViewGrid_OTPWarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ViewGrid_OTPMessageControl = modal;
    });

    $scope.OTPWarningMessage = "";

    $scope.CloseOTPReConfirmation_ViewGrid = function () {
        $scope.ViewGrid_OTPMessageControl.hide();
    };

    $scope.OpenOTPReConfirmation_ViewGrid = function () {
        $scope.OTPWarningMessage = String.format($rootScope.resData.res_ActivateDeactivateUser_OTPRegenerateConfirmMsg);
        $scope.ViewGrid_OTPMessageControl.show();
    };

    $scope.Regen_OTP = function (id) {

        $scope.SelectedOTPId_ViewGrid = id;
        $scope.OpenOTPReConfirmation_ViewGrid();
    };

    $scope.RegenOTPYes_ViewGrid = function () {

        var requestData =
        {
            ServicesAction: 'UpdateRegeneratedLoginOTP',
            LoginId: $scope.SelectedOTPId_ViewGrid
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            if (response.data.Json != undefined) {
                $scope.CloseOTPReConfirmation_ViewGrid();
                
                if ($scope.ViewControllerName === "ActivateDeactivateUser") {

                    $scope.LoadCompanyUsersData();

                }
                else {
                    $scope.RefreshDataGrid();
                }

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ActivateDeactivateUser_OTPGenerateMsg), '', 3000);


            }

        });
    };
			//#endregion


    //#region Change Langauage

    $scope.LanguageList = [
        {
            Id: 1101,
            Name: "English"
        },
        {
            Id: 1102,
            Name: "Vietnamese"
        }
    ];

    $scope.LanaguageParams = {
        SelectedCompanyId: "",
        DefaultLanguage: ""
    };


    $ionicModal.fromTemplateUrl('templates/ChangeLanguageModal.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ChangeLanguageModalPopup = modal;
    });

    $scope.CloseChangeLanguagePopup = function () {
        $scope.ChangeLanguageModalPopup.hide();
    };

    $scope.OpenChangeLanguagePopup = function () {
        $scope.ChangeLanguageModalPopup.show();
    };

    $scope.ChangeLanguage = function (id, DefaultLanguage) {

        $scope.LanaguageParams.SelectedCompanyId = id;
        $scope.LanaguageParams.DefaultLanguage = DefaultLanguage;
        $scope.OpenChangeLanguagePopup();
    };

    $scope.SaveLangauge = function () {
        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            CompanyId: parseInt($scope.LanaguageParams.SelectedCompanyId),
            DefaultLanguage: parseInt($scope.LanaguageParams.DefaultLanguage)
        };

        ManageCustomerService.UpdateLanguageForUser(requestData).then(function (response) {

            $rootScope.Throbber.Visible = false;
            $scope.CloseChangeLanguagePopup();

            if ($scope.ViewControllerName === "ActivateDeactivateUser") {

                $scope.LoadCompanyUsersData();

            }
            else {
                $scope.RefreshDataGrid();
            }

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ActivateDeactivateUser_ChangeLanguageMsg), '', 3000);

        });
    };
			//#endregion


    $scope.filterValue = function ($event) {
        debugger;
        var filterVlaueChk = true;
        if ($scope.AddCompanyDeailsJSON.ContactTypeId === '1284' || $scope.AddCompanyDeailsJSON.ContactTypeId === '1282') {
            filterVlaueChk = validateMobileNo($scope.AddCompanyDeailsJSON.ContactPersonNumber);
        }

        if (!filterVlaueChk && $scope.AddCompanyDeailsJSON.ContactPersonNumber !== '') {
            $rootScope.ValidationErrorAlert('Please enter valid details.', '', 3000);
            $scope.AddCompanyDeailsJSON.ContactPersonNumber = '';
        }
        return filterVlaueChk;
    };



    $scope.validateEmailSemicolon = function (str) {

        // var str = "abc@abc.com;abc@abc.com; abc@a@bc.com ; abc@abc.com ;abc@abc.com;"
        var invalidEmails = [];
        if (str !== "" && str !== null && str !== undefined) {
            var ContactDetailsCode = "";
            var ContactTypeCode = $scope.ContactTypeList.filter(function (el) { return el.LookUpId === $scope.AddCompanyDeailsJSON.ContactTypeId; });

            if (ContactTypeCode.length > 0) {
                ContactDetailsCode = ContactTypeCode[0].Name;
            }
            if (ContactDetailsCode.toUpperCase() === 'MOBILENO') {
                var MObileNO = str.split(';');

                for (i = 0; i < MObileNO.length; i++) {
                    if (!validateMobileNo(MObileNO[i].trim())) {
                        invalidEmails.push(MObileNO[i].trim())
                    }
                }
            }
            else if (ContactDetailsCode.toUpperCase() === 'FAX') {
                var MObileNO = str.split(';');

                for (i = 0; i < MObileNO.length; i++) {
                    if (!validateMobileNo(MObileNO[i].trim())) {
                        invalidEmails.push(MObileNO[i].trim())
                    }
                }
            }
            else if (ContactDetailsCode.toUpperCase() === 'EMAIL') {
                var emails = str.split(';');

                for (i = 0; i < emails.length; i++) {
                    if (!validateEmail(emails[i].trim())) {
                        invalidEmails.push(emails[i].trim())
                    }
                }
            }

            //else if (NotificationCode.toUpperCase() === 'DEVICE' || NotificationCode.toUpperCase() === 'PORTAL') {

            //}


        }
        return invalidEmails;

    }

    ValidateEmailToType = function () {

    }

    $scope.ValidationForUrl = function (InputData) {
        debugger;
        var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        return re.test(InputData);
    }





}).directive("ngFileSelectImage", function (fileReader, $timeout, $rootScope) {
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



});