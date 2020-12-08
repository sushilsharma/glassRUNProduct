angular.module("glassRUNProduct").controller('AddLocationController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {

    
    // alert('dd');
    LoadActiveVariables($sessionStorage, $state, $rootScope);

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }


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



    //#endregion


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


    var automatedLocation = $scope.LoadSettingInfoByName('LocationCodeAutomated', 'string');
    
    if (automatedLocation == "1") {
        $scope.LocationCodeAutomated = true;
    }
    else {
        $scope.LocationCodeAutomated = false;
    }
    $scope.ObjectRoleMasterEvent = {

        onItemSelect: function (item) {
            

            var selectedId = item.Id
            $scope.SelectLoadedDistributorsList = $scope.SelectLoadedDistributorsList.filter(function (el) { return el.Id === selectedId });
            // $scope.changeobjectName();
            //$scope.SelectLoadedDistributorsList = [];
        },
        onItemDeselect: function (item) {
            //var selectedId = item.Id
            //$scope.SelectRoleMasterList = $scope.SelectRoleMasterList.filter(function (el) { return el.Id === selectedId });
            
            //alert("hi");
            $scope.SelectLoginDetailsList = [];
            //$scope.changeobjectName();
        }
    }

    $scope.filterLookupData = function () {
        var Locationtype = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'LocationType'; });
        if (Locationtype.length > 0) {

            $scope.LocationtypeList = Locationtype;
            for (var i = 0; i < $scope.LocationtypeList.length; i++) {
                $scope.LocationtypeList[i].Id = $scope.LocationtypeList[i].LookUpId;
            }
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



        var ProductCategory = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ProductCategory'; });
        if (ProductCategory.length > 0) {

            $scope.ProductCategoryList = ProductCategory;
            for (var i = 0; i < $scope.ProductCategoryList.length; i++) {
                $scope.ProductCategoryList[i].Id = $scope.ProductCategoryList[i].LookUpId;
            }
            $rootScope.Throbber.Visible = false;
        }
    }

    $scope.filterLookupData();


    $scope.AddZoneAndLocationList = function () {
        
        //$scope.ZoneCodeList = [];

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

                var ObjZoneData = {
                    ProductTypeName: ProductTypeName,
                    ProductTypeCode: ProductTypeCode,
                    IsActive: true,
                    CreatedBy: $rootScope.UserId,
                }
                $scope.CompanyProductTypeList.push(ObjZoneData);
            }
        }



        if ($scope.SelectedProductCategoryList.length > 0) {
            for (var i = 0; i < $scope.SelectedProductCategoryList.length; i++) {
                var objectProductCategoryList = $scope.ProductCategoryList.filter(function (el) { return el.Id === $scope.SelectedProductCategoryList[i].Id; });
                if (objectProductCategoryList.length > 0) {
                    var ProductTypeName = objectProductCategoryList[0].Name
                    var ProductTypeCode = objectProductCategoryList[0].Id

                } else {
                    var ProductTypeName = '';
                    var ProductTypeCode = '';
                }

                var ObjProductCategoryData = {
                    ProductCategoryName: ProductTypeName,
                    ProductCategoryCode: ProductTypeCode,
                    IsActive: true,
                    CreatedBy: $rootScope.UserId,
                }
                $scope.CompanyProductCategoryList.push(ObjProductCategoryData);
            }
        }



    }

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
			CompanyId:0,
            DocumentInformationList: []
        }
    }
    $scope.InitalizeUserDetail();


    $scope.LoadAllDistributorsList = function () {
        

        var requestData =
            {
                ServicesAction: 'LoadAllCompanyDetailListByDropDown',
                CompanyId: 0
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data;
            $scope.LoadedDistributorsList = resoponsedata.Json.CompanyList;
            console.log(JSON.stringify(resoponsedata.Json.CompanyList));
            $rootScope.Throbber.Visible = false;

        });

    }
    $scope.LoadAllDistributorsList();






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

    $rootScope.GetAllCityDetailsByStateId = function (StateId) {
        
        $rootScope.Throbber.Visible = true;
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
        //$scope.AddLocationJSON.LocationType = 0;
        $scope.SelectLoadedDistributorsList = [];
        $scope.SelectedProductList = []; 

        $scope.ContactInformationList = [];

    }






    $scope.Save = function () {
        debugger
        
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
        var locationtype = "";
        if ($rootScope.LocationType != "") {
            locationtype = $scope.LocationtypeList.filter(function (el) { return el.Name === $rootScope.LocationType; });
            if (locationtype.length > 0) {
                $scope.AddLocationJSON.LocationType = locationtype[0].LookUpId;
                $scope.LocationTypeValue = locationtype[0].Name;
            }
        }
        else {
            if (page === "Location") {
                if ($scope.AddLocationJSON.LocationType === 0) {
                    $rootScope.ValidationErrorAlert('Please select Location Type', '', 3000);
                    return;
                }
            }

            if (page === "CollectionLocation") {
                $scope.AddLocationJSON.LocationType = 21;
            } else if (page === "ShipToLocation") {
                $scope.AddLocationJSON.LocationType = 27;
            }
            
        }


        //if ($scope.AddLocationJSON.State === "" || $scope.AddLocationJSON.State === null) {
        //    $rootScope.ValidationErrorAlert('Please select State', '', 3000);
        //    return;
        //}

        if ((parseInt($scope.ActiveCompanyId) > 0 && $scope.ActiveCompanyId !== "")) {
            $scope.AddLocationJSON.CompanyId = $scope.ActiveCompanyId;
        }
        else {
            if ($scope.SelectLoadedDistributorsList.length === 0) {
                $rootScope.ValidationErrorAlert('Please select company', '', 3000);
                return;
            }
        }
       
		var	stateListId = $scope.StateList.filter(function (el) { return el.StateId === $scope.AddLocationJSON.State; });
		var	CityListId = $scope.CityList.filter(function (el) { return el.CityId === $scope.AddLocationJSON.City; });
		
        var statename = "";
        var cityname = "";

        if(stateListId.length > 0)
        {
            statename = stateListId[0].StateName;
        }

        if(CityListId.length > 0)
        {
            cityname = CityListId[0].CityName;
        }

        $scope.AddZoneAndLocationList();
        var SelectLoadedDistributorsList = $scope.SelectLoadedDistributorsList;
        if ($scope.SelectLoadedDistributorsList.length > 0) {
            $scope.AddLocationJSON.CompanyId = $scope.SelectLoadedDistributorsList[0].Id
        }
        else {
            $scope.AddLocationJSON.CompanyId = "";
        }

        if ((parseInt($scope.ActiveCompanyId) > 0 && $scope.ActiveCompanyId !== "")) {
            $scope.AddLocationJSON.CompanyId = $scope.ActiveCompanyId;
        }


        var location =
            {
                LocationId: $scope.LocationId,
                LocationName: $scope.AddLocationJSON.LocationName,
                DeliveryName: $scope.AddLocationJSON.LocationName,
                DeliveryLocationCode: $scope.AddLocationJSON.LocationCode,
                DisplayName: $scope.AddLocationJSON.DisplayName,
                LocationCode: $scope.AddLocationJSON.LocationCode,
                LocationCodeAutomated: $scope.LocationCodeAutomated,
                LocationType: $scope.AddLocationJSON.LocationType,
                AddressLine1: $scope.AddLocationJSON.AddressLine1,
                AddressLine2: $scope.AddLocationJSON.AddressLine2,
                AddressLine3: $scope.AddLocationJSON.AddressLine3,
                AddressLine4: $scope.AddLocationJSON.AddressLine4,
                CompanyID: $scope.AddLocationJSON.CompanyId,
                City: cityname,
                State: statename,
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
                WMSBranchPlantCode: $scope.AddLocationJSON.WMSBranchPlantCode,
                WareHouseType: $scope.AddLocationJSON.WareHouseType,
                IsActive: true,
                CreatedBy: $rootScope.UserId,
                CompanyProductTypeList: $scope.CompanyProductTypeList,
                CompanyProductCategoryList: $scope.CompanyProductCategoryList,
                ContactInformationList: $scope.ContactInformationList,
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
                        if ($rootScope.LocationType != "") {
                            if ($scope.LocationTypeValue == "Pick Up") {
                                //$rootScope.LoadAllCollectionByCompanyID($scope.AddLocationJSON.CompanyId);
                                $scope.LoadedCollectionList.push(response.data.Json);
                                $scope.SearchControl.InputCollection = "";
                                $scope.SearchControl.InputCollection = response.data.Json.DeliveryName
                                $rootScope.CloseAddLocationInMasterPopup();
                            }
                            else {
                                //$rootScope.LoadDeliveryLocationListByUser();
                                $rootScope.bindDeliverylocation.push(response.data.Json);
                                $scope.SearchControl.InputShipToLocation = "";
                                $scope.SearchControl.InputShipToLocation = response.data.Json.DeliveryName
                                $rootScope.CloseAddLocationInMasterPopup();
                            }
                        }
                       
                    }
                    $scope.ClearControls();
                    $scope.ViewForm();
                    $scope.RefreshDataGrid();
                }
            }
        });






    }



    $rootScope.Edit = function (id) {
        debugger;
        $scope.AddForm();
        var requestData =
            {
                ServicesAction: 'GetLocationByLocationId',
                LocationId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            if (response.data.Json != undefined) {
                var responsedata = response.data.Json.LocationList[0];
                $scope.LocationId = responsedata.LocationId;
                $scope.AddLocationJSON.LocationName = responsedata.LocationName;
                $scope.AddLocationJSON.DisplayName = responsedata.DisplayName;
                $scope.AddLocationJSON.LocationCode = responsedata.LocationCode;

                //$scope.SelectLoadedDistributorsList = responsedata.CompanyID;

                if (responsedata.CompanyList != undefined) {
                    if (responsedata.CompanyList.length > 0) {
                        $scope.SelectLoadedDistributorsList = responsedata.CompanyList
                    } else {
                        $scope.SelectLoadedDistributorsList = [];
                    }
                }


                $scope.AddLocationJSON.LocationType = responsedata.LocationType;
                $scope.AddLocationJSON.AddressLine1 = responsedata.AddressLine1;
                $scope.AddLocationJSON.AddressLine2 = responsedata.AddressLine2;
                $scope.AddLocationJSON.AddressLine3 = responsedata.AddressLine3;
                $scope.AddLocationJSON.AddressLine4 = responsedata.AddressLine4;
                $scope.AddLocationJSON.State = responsedata.State;
                $rootScope.GetAllCityDetailsByStateId($scope.AddLocationJSON.State);
                $scope.AddLocationJSON.City = responsedata.City;
                $scope.AddLocationJSON.PostCode = responsedata.Pincode;
                debugger;
                $scope.AddLocationJSON.Capacity = responsedata.Capacity;
                $scope.AddLocationJSON.Safefill = responsedata.Safefill;
                $scope.AddLocationJSON.Field1 =responsedata.Field1;
                $scope.AddLocationJSON.Field2 =responsedata.Field2;
                $scope.AddLocationJSON.Field3 =responsedata.Field3;
                $scope.AddLocationJSON.Field4 =responsedata.Field4;
                $scope.AddLocationJSON.Field5 =responsedata.Field5;
                $scope.AddLocationJSON.Field6 =responsedata.Field6;
                $scope.AddLocationJSON.Field7 =responsedata.Field7;
                $scope.AddLocationJSON.Field8 =responsedata.Field8;
                $scope.AddLocationJSON.Field9 =responsedata.Field9;
                $scope.AddLocationJSON.Field10 = responsedata.Field10;
                $scope.AddLocationJSON.AddressNumber =responsedata.AddressNumber;
                $scope.AddLocationJSON.WMSBranchPlantCode = responsedata.WMSBranchPlantCode;
                $scope.AddLocationJSON.WareHouseType = responsedata.WareHouseType;
                
                $scope.ContactInformationList = [];
                var ContactInfo = response.data.Json.LocationList[0].ContactInformationList;
                if (ContactInfo != undefined) {
                    if (ContactInfo !== 0) {
                        for (var i = 0; i < ContactInfo.length; i++) {

                            $scope.Contactinfo1 = {
                                ContactinfoGUID: generateGUID(),
                                ContactType: ContactInfo[i].ContactType,
                                ContactTypeId: ContactInfo[i].ContactTypeId,
                                ContactPersonName: ContactInfo[i].ContactPersonName,
                                ContactPersonNumber: ContactInfo[i].ContactPersonNumber,
                                ObjectType: 'Location',
                                IsActive: true,
                                CreatedBy: $rootScope.UserId,
                            }
                            $scope.ContactInformationList.push($scope.Contactinfo1);
                        }
                    }
                }

            }
        });
    }

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
                ObjectType: 'Location',
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

    $scope.ClearContactinfoControls = function () {
        $scope.EditContactinfoGUID = "";
        $scope.AddCompanyDeailsJSON.ContactTypeId = 0;
        $scope.AddCompanyDeailsJSON.ContactPersonNumber = "";
        $scope.AddCompanyDeailsJSON.ContactPersonName = "";
    }

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

    $scope.ValidationForUrl = function (InputData) {
        debugger;
        var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        return re.test(InputData);
    }



});