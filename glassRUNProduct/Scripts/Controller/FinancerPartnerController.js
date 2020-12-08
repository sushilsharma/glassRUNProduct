angular.module("glassRUNProduct").controller('FinancerPartnerController', function ($scope, $q, $rootScope, $ionicModal, $timeout, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    

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

    LoadActiveVariables($sessionStorage, $state, $rootScope);


    setTimeout(function () {

        pluginsService.init();
    }, 500);

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

        $scope.CurrencyFormatCode = $scope.LoadSettingInfoByName('CurrencyFormat', 'string');
        if ($scope.CurrencyFormatCode === "") {
            $scope.CurrencyFormatCode = "EUR";
        }

    }
    $scope.LoadDefaultSettingsValue();
    
    // LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.FinancePatnerList = [];
    $scope.FinancePartnerId = 0;
    $scope.TransporterAccountDetailId = 0;
    $scope.ContactInformationId = 0;
    $scope.FinanceTransporterMappingId = 0;

    $scope.TransporterAccountDetails = [];
    $scope.EditAccountdetailGUID = "";

    $scope.ContactPersonInfo = [];
    $scope.EditContactinfoGUID = "";


    $scope.TransporterFinanceMappingInfo = [];
    $scope.EditTransporterFinanceMappingGUID = "";

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

    $scope.GetAllStateDetails = function () {
        
        //$rootScope.Throbber.Visible = true;
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

                    $rootScope.StateList = response.data.Json.StateList;
                    //$rootScope.Throbber.Visible = false;
                }


            }
        });

    }


    //$scope.BindCalendar = function () {
    //    
    //    $('#RuleStartDate').each(function () {
    //        $(this).datepicker({
    //            onSelect: function (dateText, inst) {
    //                
    //                if (inst.id !== undefined) {
    //                    angular.element($('#' + inst.id)).triggerHandler('input');
    //                    $scope.GetScheduleDate(dateText);
    //                }
    //            },
    //            minDate: new Date(),
    //            dateFormat: 'dd/mm/yy',
    //            numberOfMonths: 1,
    //            isRTL: $('body').hasClass('rtl') ? true : false,
    //            prevText: '<i class="fa fa-angle-left"></i>',
    //            nextText: '<i class="fa fa-angle-right"></i>',
    //            showButtonPanel: false
    //        });
    //    });
    //}

    //$scope.GetScheduleDate = function (date) {
    //    
    //    $('#RuleEndDate').each(function () {
    //        $(this).datepicker({
    //            onSelect: function (dateText, inst) {
    //                if (inst.id !== undefined) {
    //                    angular.element($('#' + inst.id)).triggerHandler('input');
    //                }
    //            },
    //            minDate: date,
    //            dateFormat: 'dd/mm/yy',
    //            numberOfMonths: 1,
    //            isRTL: $('body').hasClass('rtl') ? true : false,
    //            prevText: '<i class="fa fa-angle-left"></i>',
    //            nextText: '<i class="fa fa-angle-right"></i>',
    //            showButtonPanel: false
    //        });
    //    });
    //}
    //$scope.BindCalendar();


    $scope.GetAllCityDetailsByStateId = function (StateId) {
        
        //$rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'GetAllCityByStateId',
                StateId: StateId
            };


        var consolidateApiParamater =
            {
                Json: requestData,

            };


        

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data.Json != undefined) {
                if (response.data.Json.CityList.length > 0) {

                    $rootScope.CityList = response.data.Json.CityList;
                    //$rootScope.Throbber.Visible = false;
                }


            }
        });

    }

    $scope.GetAllStateDetails();

    $scope.SelectedZoneList = [];
    $scope.SelectedBranchPlantList = [];
    $scope.SortByListSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false
        //multiple:false

    }

    //$scope.LoadAllEventMasternDetails = function () {
    //    
    //    $rootScope.Throbber.Visible = true;
    //    var requestData =
    //        {
    //            ServicesAction: 'GetAllEventMasterDetailsList'

    //        };


    //    var consolidateApiParamater =
    //        {
    //            Json: requestData,

    //        };


    //    

    //    GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
    //        
    //        if (response.data.Json != undefined) {
    //            if (response.data.Json.EventMasterList.length > 0) {

    //                $rootScope.EventMasterList = response.data.Json.EventMasterList;
    //                $rootScope.Throbber.Visible = false;
    //            }


    //        }
    //    });

    //}



    //$scope.LoadAllEventMasternDetails();

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

    //#region Load EventRetrySetting Grid
    $scope.LoadEventRetrySettingsGrid = function () {
        

        console.log("1" + new Date());

        var SalesAdminApprovalData = new DevExpress.data.CustomStore({
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

                var FinancerName = "";
                var FinancerNameCriteria = "";

                var AddressLine1 = "";
                var AddressLine1Criteria = "";

                var AddressLine2 = "";
                var AddressLine2Criteria = "";

                var AddressLine3 = "";
                var AddressLine3Criteria = "";



                
                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "FinancerName") {
                            FinancerNameCriteria = columnsList[1];
                            FinancerName = columnsList[2];
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
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                
                var requestData =
                    {
                        ServicesAction: 'GetAllFinancePartner_Paging',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: "",//OrderBy,
                        OrderByCriteria: "",//OrderByCriteria,

                        FinancerName: FinancerName,
                        FinancerNameCriteria: FinancerNameCriteria,
                        AddressLine1: AddressLine1,
                        AddressLine1Criteria: AddressLine1Criteria,
                        AddressLine2: AddressLine2,
                        AddressLine2Criteria: AddressLine2Criteria,
                        AddressLine3Criteria: AddressLine3Criteria,
                        AddressLine3: AddressLine3
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
                            if (resoponsedata.Json.FinancePatnerList.length !== undefined) {
                                if (resoponsedata.Json.FinancePatnerList.length > 0) {
                                    totalcount = resoponsedata.Json.FinancePatnerList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.FinancePatnerList.TotalCount;
                            }

                            ListData = resoponsedata.Json.FinancePatnerList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.FinancePatnerList = $scope.FinancePatnerList.concat(data);
                    console.log("3" + new Date());
                    return data;
                });
            }
        });

        $scope.SalesAdminApprovalGrid = {
            dataSource: {
                store: SalesAdminApprovalData,
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
            keyExpr: "FinancePatnerIdId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {
                
                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.FinancePatnerId);
                    }
                    if (e.column.cellTemplate === "Delete") {
                        $scope.Delete(data.FinancePatnerId);
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
                    caption: "Finance Name",
                    dataField: "FinancerName",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left",
                    //width: 150
                },
                {
                    caption: "AddressLine1",
                    dataField: "AddressLine1",
                    alignment: "left"
                },
                {
                    caption: "AddressLine2",
                    dataField: "AddressLine2",
                    alignment: "left"
                },
                {
                    caption: "AddressLine3",
                    dataField: "AddressLine3",
                    alignment: "left",
                    allowFiltering: false,
                    allowSorting: false
                },
                {
                    caption: "Edit",
                    dataField: "FinancePatnerId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Edit",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 200
                },
                {
                    caption: "Delete",
                    dataField: "FinancePatnerId",
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

    $scope.LoadEventRetrySettingsGrid();

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {
        
        $scope.PaymentSlabList = [];
        var dataGrid = $("#SalesAdminApprovalGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

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
        //$scope.ClearControls();
        //$scope.RefreshDataGrid();
    }

    $scope.ViewForm();

    $scope.Edit = function (id) {
        
        $scope.AddForm();
        var requestData =
            {
                ServicesAction: 'GetFinancePatnerIdById',
                FinancePartnerId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            if (response.data.Json != undefined) {
                var responsedata = response.data.Json.FinancePatnerList[0];
                $scope.FinancePartnerId = responsedata.FinancePatnerId;
                $scope.FinancePartnerJSON.FinanceName = responsedata.FinancerName;
                $scope.FinancePartnerJSON.AddressLine1 = responsedata.AddressLine1;
                $scope.FinancePartnerJSON.AddressLine2 = responsedata.AddressLine2;
                $scope.FinancePartnerJSON.AddressLine3 = responsedata.AddressLine3;
                $scope.FinancePartnerJSON.State = responsedata.State;
                $scope.GetAllCityDetailsByStateId(responsedata.State);
                $scope.FinancePartnerJSON.City = responsedata.City;
                $scope.FinancePartnerJSON.PostCode = responsedata.Postcode;
                if (response.data.Json.FinancePatnerList[0].ContactPersonList != undefined) {
                    $scope.ContactPersonInfo = response.data.Json.FinancePatnerList[0].ContactPersonList;
                   // $scope.ContactInformationId = response.data.Json.FinancePatnerList[0].ContactPersonList[0].ContactInformationId;
                }
                if (response.data.Json.FinancePatnerList[0].TransporterAccountDetailList != undefined) {
                    $scope.TransporterAccountDetails = response.data.Json.FinancePatnerList[0].TransporterAccountDetailList;
                    //$scope.TransporterAccountDetailId = response.data.Json.FinancePatnerList[0].TransporterAccountDetailList[0].TransporterAccountDetailId;

                }
                if (response.data.Json.FinancePatnerList[0].FinanceTransporterMappingList != undefined) {
                    $scope.TransporterFinanceMappingInfo = response.data.Json.FinancePatnerList[0].FinanceTransporterMappingList;
                    //$scope.FinanceTransporterMappingId = response.data.Json.FinancePatnerList[0].FinanceTransporterMappingList[0].FinanceTransporterMappingId;
                }
            }
        });
    }

    $scope.Save = function () {
        
        if ($scope.FinancePartnerJSON.FinanceName === "") {
            $rootScope.ValidationErrorAlert('Please Enter Financer Name', '', 3000);
            return;
        }

        if ($scope.FinancePartnerJSON.State === 0) {
            $rootScope.ValidationErrorAlert('Please Select State', '', 3000);
            return;
        }

        if ($scope.FinancePartnerJSON.City === 0) {
            $rootScope.ValidationErrorAlert('Please Select City', '', 3000);
            return;
        }


        if ($scope.FinancePartnerJSON.PostCode === "") {
            $rootScope.ValidationErrorAlert('Please Enter Postcode', '', 3000);
            return;
        }



        var FinancePartner = {
            FinancePartnerId: $scope.FinancePartnerId,
            FinancerName: $scope.FinancePartnerJSON.FinanceName,
            AddressLine1: $scope.FinancePartnerJSON.AddressLine1,
            AddressLine2: $scope.FinancePartnerJSON.AddressLine2,
            AddressLine3: $scope.FinancePartnerJSON.AddressLine3,
            State: $scope.FinancePartnerJSON.State,
            City: $scope.FinancePartnerJSON.City,
            Postcode: $scope.FinancePartnerJSON.PostCode,
            CreatedBy: $rootScope.UserId,
            IsActive: true,
            ContactPersonList: $scope.ContactPersonInfo,
            TransporterAccountDetailsList: $scope.TransporterAccountDetails,
            FinanceTransporterMappingList: $scope.TransporterFinanceMappingInfo

        }

        var financePartnerList = [];
        financePartnerList.push(FinancePartner);

        var requestData =
            {
                ServicesAction: 'InsertFinancePartner',
                FinancePartnerList: financePartnerList
            };



        var consolidateApiParamater =
            {
                Json: requestData,
            };
        
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if ($scope.FinancePartnerId != 0) {
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

    debugger;
    $scope.ClearControls = function () {
        $scope.FinancePartnerId = 0;
        $scope.FinancePartnerJSON.FinanceName = "";
        $scope.FinancePartnerJSON.AddressLine1 = "";
        $scope.FinancePartnerJSON.AddressLine2 = "";
        $scope.FinancePartnerJSON.AddressLine3 = "";
        $scope.FinancePartnerJSON.State = 0;
        $scope.FinancePartnerJSON.City = 0;
        $scope.FinancePartnerJSON.PostCode = "";
        $scope.ContactPersonInfo = [];
        $scope.TransporterAccountDetailsList = [];
        $scope.TransporterFinanceMappingInfo = [];
    }

    $scope.Delete = function (id) {
        var requestData =
            {
                ServicesAction: 'DeleteFinancePartner',
                FinancePatnerId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.ViewForm();
            $scope.RefreshDataGrid();
        });
    }

    $scope.filterValue = function ($event) {
        
        var regex = new RegExp("^[0-9]*$");

        var key = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);
        if (!regex.test(key)) {
            $event.preventDefault();
        }
    };


    $scope.ClearContactinfoControls = function () {
        $scope.EditContactinfoGUID = "";
        $scope.FinancePartnerJSON.Email = 0;
        $scope.FinancePartnerJSON.ContactPersonNumber = "";
        $scope.FinancePartnerJSON.ContactPersonName = "";
    }

    $scope.ClearAccountDetailsControls = function () {
        $scope.EditAccountdetailGUID = "";
        $scope.FinancePartnerJSON.AccountNumber = 0;
        $scope.FinancePartnerJSON.AccountName = "";
        $scope.FinancePartnerJSON.Accounttype = "";
    }

    $scope.ClearTransporterFinanceMappingControls = function () {
        $scope.EditTransporterFinanceMappingGUID = "";
        $scope.FinancePartnerJSON.Transporter = 0;
        $scope.FinancePartnerJSON.Amount = "";
        $scope.FinancePartnerJSON.FromDate = "";
        $scope.FinancePartnerJSON.ToDate = "";
    }

    $scope.AddContactPersonInfo = function () {
        //alert('sdfsdf');
        

        
        if ($scope.EditContactinfoGUID !== "") {
            var Concatctinfo = $scope.ContactPersonInfo.filter(function (m) { return m.ContactinfoGUID === $scope.EditContactinfoGUID; });

            Concatctinfo[0].ContactType = $scope.FinancePartnerJSON.ContactType;
            Concatctinfo[0].ContactPersonName = $scope.FinancePartnerJSON.ContactPersonName;
            Concatctinfo[0].ContactPersonNumber = $scope.FinancePartnerJSON.ContactPersonNumber;

            Concatctinfo[0].IsActive = true;
            Concatctinfo[0].UpdatedBy = $rootScope.UserId;
        }
        else {
            var Contactinfo = {
                ContactinfoGUID: generateGUID(),
                ContactInformationId: 0,
                ContactType: $scope.FinancePartnerJSON.ContactType,
                ContactPersonName: $scope.FinancePartnerJSON.ContactPersonName,
                ContactPersonNumber: $scope.FinancePartnerJSON.ContactPersonNumber,
                IsActive: true,
                CreatedBy: $rootScope.UserId,
            }
            $scope.ContactPersonInfo.push(Contactinfo);
        }
        $scope.ClearContactinfoControls();
    }

    $scope.EditContactPersonInfo = function (id) {
        
        $scope.ClearContactinfoControls();
        var Concatctinfo = $scope.ContactPersonInfo.filter(function (m) { return m.ContactinfoGUID === id; });
        $scope.EditContactinfoGUID = id;        
        $scope.FinancePartnerJSON.ContactType = Concatctinfo[0].ContactType
        $scope.FinancePartnerJSON.ContactPersonNumber = Concatctinfo[0].ContactPersonNumber
        $scope.FinancePartnerJSON.ContactPersonName = Concatctinfo[0].ContactPersonName
    }

    $scope.DeleteContactInfo = function (id) {
        
        var ContactInfo = $scope.ContactPersonInfo.filter(function (m) { return m.ContactinfoGUID !== id; });
        $scope.ContactPersonInfo = ContactInfo;
    }
    $scope.TransporterAccountDetails = [];
    $scope.AddTransporterAccountDetails = function () {
        //alert('sdfsdf');
        

        
        if ($scope.EditAccountdetailGUID !== "") {
            var Accountdetails = $scope.TransporterAccountDetails.filter(function (m) { return m.AccountdetailGUID === $scope.EditAccountdetailGUID; });

            // Concatctinfo[0].PaymentSlabId = $scope.PaymentSlabId;
            Accountdetails[0].AccountNumber = $scope.FinancePartnerJSON.AccountNumber;
            Accountdetails[0].AccountName = $scope.FinancePartnerJSON.AccountName;
            Accountdetails[0].AccountType = $scope.FinancePartnerJSON.Accounttype;
            Accountdetails[0].IsActive = true;
            Accountdetails[0].UpdatedBy = $rootScope.UserId;
        }
        else {
            var accountdetail = {
                AccountdetailGUID: generateGUID(),
                TransporterAccountDetailId: 0,
                AccountNumber: $scope.FinancePartnerJSON.AccountNumber,
                AccountType: $scope.FinancePartnerJSON.Accounttype,
                AccountName: $scope.FinancePartnerJSON.AccountName,
                IsActive: true,
                CreatedBy: $rootScope.UserId,
            }
            $scope.TransporterAccountDetails.push(accountdetail);
        }
        $scope.ClearAccountDetailsControls();
    }

    $scope.EditAccountdetail = function (id) {
        
        $scope.ClearAccountDetailsControls();
        var AccountDeatils = $scope.TransporterAccountDetails.filter(function (m) { return m.AccountdetailGUID === id; });
        $scope.EditAccountdetailGUID = id;
        $scope.FinancePartnerJSON.AccountNumber = AccountDeatils[0].AccountNumber
        $scope.FinancePartnerJSON.AccountName = AccountDeatils[0].AccountName
        $scope.FinancePartnerJSON.Accounttype = AccountDeatils[0].AccountType
    }

    $scope.DeleteAccountDetails = function (id) {
        
        var AccountDetails = $scope.TransporterAccountDetails.filter(function (m) { return m.AccountdetailGUID !== id; });

        $scope.TransporterAccountDetails = AccountDetails;
    }



    $scope.AddTransporterFinanceMappingtDetails = function () {
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



    $scope.EditTransporterFinanceMappingdetail = function (id) {
        
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


    //$scope.LoadCompanytype = function () {
    //    

    //    var lookuplist = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategory === '5'; });
    //    if (lookuplist.length > 0) {

    //        $scope.CompanyTypeList = lookuplist;
    //        $rootScope.Throbber.Visible = false;
    //    }

    //}
    // $scope.LoadCompanytype();
});