angular.module("glassRUNProduct").controller('ItemViewController', function ($scope, $timeout, $http, $state, $sessionStorage, $rootScope, $filter, focus, $location, $ionicModal, GrRequestService, pluginsService) {

    LoadActiveVariables($sessionStorage, $state, $rootScope);
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true
        };
    }

    $scope.ItemNameMultiLanguageList = [];

    $rootScope.ItemData = {
        labelFilename: 'no_image.png',
        image: "/Images/ProductImages/no_image.png"
    };

    $rootScope.IsImageSelected = "0";

    $scope.GetExpireDateControl = function (date) {
        debugger;
        $('.expireDate').each(function () {

            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');

                    }

                },
                minDate: date,
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });
    }



    $scope.BindEffectiveDate = function () {
        debugger;
        $('.effectiveDate').each(function () {
            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id !== undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                        $scope.GetExpireDateControl(dateText);
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


    $scope.ItemMasterForm = {
        Input_ItemName: '',
        Input_ItemCode: '',
        Input_ItemPrice: '',
        Input_PrimaryUnitOfMeasure: '',
        Input_RelatedPrimaryUnitOfMeasure: '',
        Input_ItemEnglishLanguage: '',
        Input_ConversionFactor: '',
        Input_BussinessUnit: '',
        Input_StockInQuantity: '',
        Input_PackSize: '',
        Input_BranchPlant: '',
        Input_PricingUnit: '',
        Input_ShippingUnit: '',
        Input_UOM: '',
        Input_EffectiveDate: '',
        Input_ExpireDate: '',
        Input_ItemShortCode: '',
        Input_Field1: '',
        Input_Field2: '',
        Input_Field3: '',
        Input_Field4: '',
        Input_Field5: '',
        Input_Field6: '',
        Input_Field7: '',
        Input_Field8: '',
        Input_Field9: '',
        Input_Field10: '',
        Input_ComponentUnit: '',
        Input_ShelfLife: '',
        Input_BBD: '',
        Input_Barcode: '',
        Input_ItemOwner: '',
        Input_Brand: '',
        Input_AutomatedWareHouseUOM: '',
        Input_ItemDescription: '',
        Input_PrimaryUnitOfMeasureItem: '',
        Input_ImageUrl: "/Images/ProductImages/no_image.png",
        Input_SelectItemLanguage: 0,
        Input_ItemNameLanguage: ''

    };
    angular.element("input[type='file']").val(null);
    $scope.EditConversionInfoGUID = "";
    $scope.EditItemBasePriceInfoGUID = "";
    $scope.ConversionInformationList = [];
    $scope.ItemMasterList = [];
    $scope.ItemConversionList = [];
    $scope.BranchPlantDataSelectedList = [];
    $scope.CollectionLocationList = [];
    $scope.bindallproductInfoList = [];
    $scope.ItemBaseInfoList = [];
    $scope.ItemId = 0;


    $scope.SortByListSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false
        //multiple:false

    }


    //#region Load Item List.
    $scope.LoadItemListByUser = function () {

        var requestData =
        {
            ServicesAction: 'LoadAllProducts',
            CompanyId: 0
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data;
            if (resoponsedata.Item !== undefined) {
                $scope.bindallproductInfoList = resoponsedata.Item.ItemList;
                console.log('Item List');
            }
            $rootScope.Throbber.Visible = false;
        });
    };
    $scope.LoadItemListByUser();
    //#endregion


    $scope.AddCollectionLocationList = function () {
        debugger;
        //$scope.ZoneCodeList = [];
        if ($scope.BranchPlantDataSelectedList.length > 0) {
            for (var i = 0; i < $scope.BranchPlantDataSelectedList.length; i++) {
                var loadedBranchPlantList = $scope.LoadedBranchPlantList.filter(function (el) { return el.Id === $scope.LoadedBranchPlantList[i].Id; });
                // alert(JSON.stringify(objectZoneDataList));
                if (loadedBranchPlantList.length > 0) {
                    var CollectionId = loadedBranchPlantList[0].Id
                    var CollectionName = loadedBranchPlantList[0].Name
                } else {
                    var CollectionId = '';
                    var CollectionName = '';
                }

                ObjZoneData = {
                    ItemBranchPlantMappingId: 0,
                    CollectionId: CollectionId,
                    CollectionName: CollectionName,
                    IsActive: true,
                    CreatedBy: $rootScope.UserId,
                }
                $scope.CollectionLocationList.push(ObjZoneData);
            }
        }



    }

    $scope.LoadAllBranchPlantList = function () {


        var requestData =
        {
            ServicesAction: 'LoadAllBranchPlantList',
            CompanyId: 0
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            if (resoponsedata.DeliveryLocation !== undefined) {
                $scope.LoadedBranchPlantList = resoponsedata.DeliveryLocation.DeliveryLocationList;
            }
        });

    }
    //$scope.LoadedBranchPlantList = [];
    $scope.LoadAllBranchPlantList();


    var unitOfMeasureList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'UnitOfMeasure'; });
    if (unitOfMeasureList.length > 0) {
        $scope.ItemUnitOfMeasureList = unitOfMeasureList;
    }


    $scope.LookupCultureList = [];
    var languageList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'Language'; });
    if (languageList.length > 0) {
        $scope.LookupCultureList = languageList;
    }


    $scope.ClearItemNameInMultiLanguage = function () {
        $scope.ItemMasterForm.Input_SelectItemLanguage = "";
        $scope.ItemMasterForm.Input_ItemNameLanguage = "";
        $scope.EditCultureId = 0;
    }

    $scope.AddItemNameInMultiLanguage = function () {
        debugger;

        if ($scope.ItemMasterForm.Input_SelectItemLanguage !== null && $scope.ItemMasterForm.Input_SelectItemLanguage !== 0 && $scope.ItemMasterForm.Input_SelectItemLanguage !== '' && $scope.ItemMasterForm.Input_SelectItemLanguage !== "0") {
            if ($scope.ItemMasterForm.Input_ItemNameLanguage !== "") {
                var itemLanguageName = "";
                var itemlanguage = $scope.LookupCultureList.filter(function (el) { return el.LookUpId === $scope.ItemMasterForm.Input_SelectItemLanguage; });
                if (itemlanguage.length > 0) {
                    itemLanguageName = itemlanguage[0].Name;
                }
                var checkItemAlreadyExist = $scope.ItemNameMultiLanguageList.filter(function (el) { return el.CultureId === $scope.ItemMasterForm.Input_SelectItemLanguage; });
                if ($scope.EditCultureId !== 0) {
                    if (checkItemAlreadyExist.length === 0) {
                        var itemLanguage = {
                            CultureId: $scope.ItemMasterForm.Input_SelectItemLanguage,
                            Name: itemLanguageName,
                            ItemName: $scope.ItemMasterForm.Input_ItemNameLanguage,
                            Description: "",
                            ImageUrl: "",
                            UserId: $rootScope.UserId
                        }

                        $scope.ItemNameMultiLanguageList.push(itemLanguage);

                        $scope.ItemMasterForm.Input_SelectItemLanguage = "";
                        $scope.ItemMasterForm.Input_ItemNameLanguage = "";
                        $scope.EditCultureId = 0;

                    } else {
                        $rootScope.ValidationErrorAlert($rootScope.resData.res_language_exist_validation, 'error', 8000);

                    }
                } else {
                    checkItemAlreadyExist[0].ItemName = $scope.ItemMasterForm.Input_ItemNameLanguage;
                    checkItemAlreadyExist[0].CultureId = $scope.ItemMasterForm.Input_SelectItemLanguage;
                    checkItemAlreadyExist[0].Name = itemLanguageName;
                    $scope.ItemMasterForm.Input_SelectItemLanguage = "";
                    $scope.ItemMasterForm.Input_ItemNameLanguage = "";
                    $scope.EditCultureId = 0;
                }

            } else {
                $rootScope.ValidationErrorAlert($rootScope.resData.res_Item_Name_validation, 'error', 8000);

            }
        } else {
            $rootScope.ValidationErrorAlert($rootScope.resData.res_culture_Name_validation, 'error', 8000);
        }


    }

    $scope.RemoveItemNameInMultiLanguage = function (cultureid) {
        $scope.ItemNameMultiLanguageList = $scope.ItemNameMultiLanguageList.filter(function (el) { return el.CultureId !== cultureid; });
    }

    $scope.EditCultureId = 0;
    $scope.EditItemNameInMultiLanguage = function (cultureid) {
        var editdata = $scope.ItemNameMultiLanguageList.filter(function (el) { return el.CultureId === cultureid; });
        if (editdata.length > 0) {
            $scope.ItemMasterForm.Input_SelectItemLanguage = editdata[0].CultureId;
            $scope.ItemMasterForm.Input_ItemNameLanguage = editdata[0].ItemName;
            $scope.EditCultureId = editdata[0].CultureId;
        }
    }


    $scope.AddItemInList = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        var UOMName = "";
        var UomShortName = "";
        $scope.AddCollectionLocationList();
        //var unitOfMeasure = $scope.UnitOfMeasureList.filter(function (el) { return el.LookUpId === $scope.ItemMasterForm.Input_PrimaryUnitOfMeasure });
        //if (unitOfMeasure.length > 0) {
        //    UOMName = unitOfMeasure[0].Name;
        //    UomShortName = unitOfMeasure[0].ShortCode;
        //} else {
        //    UOMName = "";
        //    UomShortName = "";
        //}

        if ($scope.ItemMasterForm.Input_StockInQuantity === "" || $scope.ItemMasterForm.Input_StockInQuantity === null || $scope.ItemMasterForm.Input_StockInQuantity === undefined) {
            $scope.ItemMasterForm.Input_StockInQuantity = 0;
        }

        $scope.ItemJson = {
            ItemId: $scope.ItemId,
            ItemGuId: generateGUID(),
            ItemName: $scope.ItemMasterForm.Input_ItemName,
            ItemShortCode: $scope.ItemMasterForm.Input_ItemShortCode,
            ItemNameEnglishLanguage: $scope.ItemMasterForm.Input_ItemEnglishLanguage,
            ItemCode: $scope.ItemMasterForm.Input_ItemCode,
            ItemNameCode: $scope.ItemMasterForm.Input_ItemName + ' (' + $scope.ItemMasterForm.Input_ItemCode + ')',
            Name: $scope.ItemMasterForm.Input_ItemName + ' (' + $scope.ItemMasterForm.Input_ItemCode + ')',
            ProductType: 9,
            PrimaryUnitOfMeasure: $scope.ItemMasterForm.Input_PrimaryUnitOfMeasureItem,
            Description: $scope.ItemMasterForm.Input_ItemDescription,
            ImageUrl: $rootScope.ItemData.image,
            QtyPerLayer: 0,
            BussinessUnit: $scope.ItemMasterForm.Input_BussinessUnit,
            StockInQuantity: $scope.ItemMasterForm.Input_StockInQuantity,
            PackSize: $scope.ItemMasterForm.Input_PackSize,
            BranchPlant: $scope.ItemMasterForm.Input_BranchPlant,
            EffectiveDate: $scope.ItemMasterForm.Input_EffectiveDate,
            ExpiryDate: $scope.ItemMasterForm.Input_ExpireDate,
            CurrencyCode: $scope.CurrencyFormatCode,
            IsNewAddedItem: true,
            CreatedBy: $rootScope.UserId,
            ConversionInformationList: $scope.ConversionInformationList,
            CollectionLocationList: $scope.CollectionLocationList,
            ItemBasePriceList: $scope.ItemBaseInfoList,
            ItemMultiLanguageNameList: $scope.ItemNameMultiLanguageList,
            BusinessUnit: $scope.ItemMasterForm.Input_BussinessUnit,
            PricingUnit: $scope.ItemMasterForm.Input_PricingUnit,
            ShippingUnit: $scope.ItemMasterForm.Input_ShippingUnit,
            ComponentUnit: $scope.ItemMasterForm.Input_ComponentUnit,
            Field1: $scope.ItemMasterForm.Input_Field1,
            Field2: $scope.ItemMasterForm.Input_Field2,
            Field3: $scope.ItemMasterForm.Input_Field3,
            Field4: $scope.ItemMasterForm.Input_Field4,
            Field5: $scope.ItemMasterForm.Input_Field5,
            Field6: $scope.ItemMasterForm.Input_Field6,
            Field7: $scope.ItemMasterForm.Input_Field7,
            Field8: $scope.ItemMasterForm.Input_Field8,
            Field9: $scope.ItemMasterForm.Input_Field9,
            Field10: $scope.ItemMasterForm.Input_Field10,
            ShelfLife: $scope.ItemMasterForm.Input_ShelfLife,
            BBD: $scope.ItemMasterForm.Input_BBD,
            Barcode: $scope.ItemMasterForm.Input_Barcode,
            ItemOwner: $scope.ItemMasterForm.Input_ItemOwner,
            Brand: $scope.ItemMasterForm.Input_Brand,
            AutomatedWareHouseUOM: $scope.ItemMasterForm.Input_AutomatedWareHouseUOM,
            PageName: 'Item Master',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId


        }
        debugger;
        if ($scope.ItemJson.ItemName !== '' && $scope.ItemJson.ItemCode !== '') {
            var itemInfo = $scope.bindallproductInfoList.filter(function (el) { return (el.ItemName === $scope.ItemMasterForm.Input_ItemName || el.ItemCode === $scope.ItemMasterForm.Input_ItemCode) && el.ItemId !== $scope.ItemId });
            if (itemInfo.length === 0) {

                //$scope.ItemField.itemId = $scope.ItemJson.ItemId;
                $scope.ItemDepositeAmount = 0;

                //if ($scope.ItemMasterForm.Input_UOM !== "" && $scope.ItemMasterForm.Input_UOM != null) {
                //    $scope.UOM = $scope.ItemMasterForm.Input_UOM;
                //}
                if ($scope.ItemMasterForm.Input_ItemPrice !== "" && $scope.ItemMasterForm.Input_ItemPrice != null) {
                    $scope.ItemPrices = parseFloat($scope.ItemMasterForm.Input_ItemPrice);
                }
                if ($scope.ItemMasterForm.Input_ItemName !== "" && $scope.ItemMasterForm.Input_ItemName !== null) {
                    //$scope.SearchControl.InputItem = $scope.ItemMasterForm.Input_ItemName;
                }
                $scope.ItemMasterList.push($scope.ItemJson);
                $scope.bindallproductInfoList.push($scope.ItemJson);
                $scope.SaveAddedNewItem();
                if ($rootScope.ActionType == "OrderList") {
                    $scope.CloseAddItemInMasterPopup();
                }
            }
            else {

                if (itemInfo[0].ItemName === $scope.ItemMasterForm.Input_ItemName) {
                    $rootScope.ValidationErrorAlert("Item name already exist.", 'error', 8000);

                } else {
                    $rootScope.ValidationErrorAlert("Item code already exist.", 'error', 8000);
                }
                $rootScope.Throbber.Visible = false;
            }
        }
        else {
            $rootScope.ValidationErrorAlert("Missing details.", 'error', 8000);
            $rootScope.Throbber.Visible = false;
        }
    }


    $scope.LoadItemListByCompany = function () {

        var requestData =
        {
            ServicesAction: 'LoadAllProducts',
            CompanyId: 0
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.bindallproduct = resoponsedata.Item.ItemList;
        });
    }



    $scope.SaveAddedNewItem = function () {


        $scope.AddedNewItemList = $scope.bindallproductInfoList.filter(function (el) { return el.IsNewAddedItem === true });
        if ($scope.AddedNewItemList.length > 0) {
            var requestData =
            {
                ServicesAction: 'InsertItem',
                ItemList: $scope.ItemJson,// $scope.ItemMasterList,
                isNewAddedItem: "1",
                IsImageSelected: $rootScope.IsImageSelected
            };
            var consolidateApiParamater =
            {
                Json: requestData,
            };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                if (response.data.Json != undefined) {

                    if ($rootScope.ActionType == "OrderList") {
                        $scope.LoadItemListByCompany();
                        $scope.SearchControl.InputItem = response.data.Json.ItemNameCode;
                    }
                    else if ($rootScope.ActionType == "Item") {
                        if ($scope.ActionType = "Add") {
                            $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
                            $rootScope.Throbber.Visible = false;
                        }
                        else {
                            $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
                            $rootScope.Throbber.Visible = false;
                        }
                        $scope.RefreshDataGrid();
                        $scope.ViewForm();
                    }
                    $scope.ClearControls();
                }
                else {
                    $rootScope.ValidationErrorAlert(response.data.ErrorValidationMessage + String.format($rootScope.resData.res_ServerSideVlaidationMsg_View), '', 3000);
                    $rootScope.Throbber.Visible = false;
                }

            });
        }

    }


    $scope.ClearControls = function () {
        $scope.ActionType = "Add";

        $scope.ItemMasterForm = {
            Input_ItemName: '',
            Input_ItemCode: '',
            Input_ItemPrice: '',
            Input_PrimaryUnitOfMeasure: '',
            Input_RelatedPrimaryUnitOfMeasure: '',
            Input_ItemEnglishLanguage: '',
            Input_ConversionFactor: '',
            Input_BussinessUnit: '',
            Input_StockInQuantity: '',
            Input_PackSize: '',
            Input_BranchPlant: '',
            Input_PricingUnit: '',
            Input_ShippingUnit: '',
            Input_UOM: '',
            Input_EffectiveDate: '',
            Input_ExpireDate: '',
            Input_ItemShortCode: '',
            Input_Field1: '',
            Input_Field2: '',
            Input_Field3: '',
            Input_Field4: '',
            Input_Field5: '',
            Input_Field6: '',
            Input_Field7: '',
            Input_Field8: '',
            Input_Field9: '',
            Input_Field10: '',
            Input_ComponentUnit: '',
            Input_ShelfLife: '',
            Input_BBD: '',
            Input_Barcode: '',
            Input_ItemOwner: '',
            Input_Brand: '',
            Input_AutomatedWareHouseUOM: '',
            Input_ItemDescription: '',
            Input_PrimaryUnitOfMeasureItem: '',
            Input_ImageUrl: "/Images/ProductImages/no_image.png"

        };
        $scope.ConversionInformationList = [];
        $scope.ItemBaseInfoList = [];
        $scope.ConversionInformationList = [];
        $scope.ItemBaseInfoList = [];


    };




    $scope.AddItemConversionInfo = function () {
        debugger;
        if ($scope.ItemMasterForm.Input_PrimaryUnitOfMeasure === '' || $scope.ItemMasterForm.Input_RelatedUnitOfMeasure === '' || $scope.ItemMasterForm.Input_ConversionFactor === '') {
            $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
            return;
        }

        var PrimaryUOM = '';
        var PrimaryUOMValue = $scope.ItemUnitOfMeasureList.filter(function (m) { return m.LookUpId === $scope.ItemMasterForm.Input_PrimaryUnitOfMeasure });
        if (PrimaryUOMValue.length > 0) {
            PrimaryUOM = PrimaryUOMValue[0].Name
        }
        else {
            PrimaryUOM = '';
        }


        var RelatedPrimaryUOM = '';
        var RelatedPrimaryUOMValue = $scope.ItemUnitOfMeasureList.filter(function (m) { return m.LookUpId === $scope.ItemMasterForm.Input_RelatedUnitOfMeasure });
        if (RelatedPrimaryUOMValue.length > 0) {
            RelatedPrimaryUOM = RelatedPrimaryUOMValue[0].Name
        }
        else {
            PrimaryUOM = '';
        }

        if ($scope.EditConversionInfoGUID !== '') {
            var Concatctinfo = $scope.ConversionInformationList.filter(function (m) { return m.ConversionInfoGUID === $scope.EditConversionInfoGUID; });

            Concatctinfo[0].PrimaryUOMName = PrimaryUOM;
            Concatctinfo[0].RelatedUOMName = RelatedPrimaryUOM;
            Concatctinfo[0].PrimaryUnitOfMeasure = $scope.ItemMasterForm.Input_PrimaryUnitOfMeasure;
            Concatctinfo[0].RelatedUnitOfMeasure = $scope.ItemMasterForm.Input_RelatedUnitOfMeasure;
            Concatctinfo[0].Conversion = $scope.ItemMasterForm.Input_ConversionFactor;
            Concatctinfo[0].IsActive = true;
            Concatctinfo[0].CreatedBy = $rootScope.UserId;
        }
        else {
            var ConversionInfo = {
                UnitOfMeasureId: 0,
                ConversionInfoGUID: generateGUID(),
                PrimaryUOMName: PrimaryUOM,
                RelatedUOMName: RelatedPrimaryUOM,
                PrimaryUnitOfMeasure: $scope.ItemMasterForm.Input_PrimaryUnitOfMeasure,
                RelatedUnitOfMeasure: $scope.ItemMasterForm.Input_RelatedUnitOfMeasure,
                Conversion: $scope.ItemMasterForm.Input_ConversionFactor,
                IsActive: true,
                CreatedBy: $rootScope.UserId,
            }
            $scope.ConversionInformationList.push(ConversionInfo);
        }
        $scope.ClearContactinfoControls();

        //else {
        //    $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
        //}
        //alert('sdfsdf');

    }

    $scope.EditContactPersonInfo = function (id) {

        $scope.ClearContactinfoControls();
        var Concatctinfo = $scope.ConversionInformationList.filter(function (m) { return m.ConversionInfoGUID === id; });
        $scope.EditConversionInfoGUID = id;
        $scope.ItemMasterForm.Input_PrimaryUnitOfMeasure = Concatctinfo[0].PrimaryUnitOfMeasure
        $scope.ItemMasterForm.Input_RelatedUnitOfMeasure = Concatctinfo[0].RelatedUnitOfMeasure
        $scope.ItemMasterForm.Input_ConversionFactor = Concatctinfo[0].Conversion
    }

    $scope.DeleteContactInfo = function (id) {

        var ContactInfo = $scope.ConversionInformationList.filter(function (m) { return m.ConversionInfoGUID !== id; });
        $scope.ConversionInformationList = ContactInfo;
    }

    $scope.ClearContactinfoControls = function () {
        $scope.EditConversionInfoGUID = "";
        $scope.ItemMasterForm.Input_PrimaryUnitOfMeasure = "";
        $scope.ItemMasterForm.Input_RelatedUnitOfMeasure = "";
        $scope.ItemMasterForm.Input_ConversionFactor = "";
    }






    $scope.AddItemBasePriceInfo = function () {




        if ($scope.EditUnitOfMeauInfoGUID !== '') {
            var Concatctinfo = $scope.ConversionInformationList.filter(function (m) { return m.ConversionInfoGUID === $scope.EditConversionInfoGUID; });

            Concatctinfo[0].PrimaryUOMName = PrimaryUOM;
            Concatctinfo[0].RelatedUOMName = RelatedPrimaryUOM;
            Concatctinfo[0].PrimaryUnitOfMeasure = $scope.ItemMasterForm.Input_PrimaryUnitOfMeasure;
            Concatctinfo[0].RelatedUnitOfMeasure = $scope.ItemMasterForm.Input_RelatedUnitOfMeasure;
            Concatctinfo[0].Conversion = $scope.ItemMasterForm.Input_ConversionFactor;
            Concatctinfo[0].IsActive = true;
            Concatctinfo[0].CreatedBy = $rootScope.UserId;
        }
        else {
            var ConversionInfo = {
                UnitOfMeasureId: 0,
                ConversionInfoGUID: generateGUID(),
                PrimaryUOMName: PrimaryUOM,
                RelatedUOMName: RelatedPrimaryUOM,
                PrimaryUnitOfMeasure: $scope.ItemMasterForm.Input_PrimaryUnitOfMeasure,
                RelatedUnitOfMeasure: $scope.ItemMasterForm.Input_RelatedUnitOfMeasure,
                Conversion: $scope.ItemMasterForm.Input_ConversionFactor,
                IsActive: true,
                CreatedBy: $rootScope.UserId,
            }
            $scope.ConversionInformationList.push(ConversionInfo);
        }
        $scope.ClearContactinfoControls();

        //else {
        //    $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
        //}
        //alert('sdfsdf');

    }

    $scope.EditContactPersonInfo = function (id) {
        debugger;
        $scope.ClearContactinfoControls();
        var Concatctinfo = $scope.ConversionInformationList.filter(function (m) { return m.ConversionInfoGUID === id; });
        $scope.EditConversionInfoGUID = id;
        $scope.ItemMasterForm.Input_PrimaryUnitOfMeasure = Concatctinfo[0].PrimaryUnitOfMeasure;
        $scope.ItemMasterForm.Input_RelatedUnitOfMeasure = Concatctinfo[0].RelatedUnitOfMeasure;
        $scope.ItemMasterForm.Input_ConversionFactor = Concatctinfo[0].Conversion;
    }

    $scope.DeleteContactInfo = function (id) {

        var ContactInfo = $scope.ConversionInformationList.filter(function (m) { return m.ConversionInfoGUID !== id; });
        $scope.ConversionInformationList = ContactInfo;
    }

    $scope.ClearContactinfoControls = function () {
        $scope.EditConversionInfoGUID = "";
        $scope.ItemMasterForm.Input_PrimaryUnitOfMeasure = "";
        $scope.ItemMasterForm.Input_RelatedUnitOfMeasure = "";
        $scope.ItemMasterForm.Input_ConversionFactor = "";
    }





    $scope.AddItemBasePriceInfo = function () {


        if ($scope.EditItemBasePriceInfoGUID !== '') {
            var ItemBaseInfo = $scope.ItemBaseInfoList.filter(function (m) { return m.ItemBasePriceInfoGUID === $scope.EditItemBasePriceInfoGUID; });

            ItemBaseInfo[0].ItemPrice = $scope.ItemMasterForm.Input_ItemPrice;
            ItemBaseInfo[0].EffectiveDate = $scope.ItemMasterForm.Input_EffectiveDate;
            ItemBaseInfo[0].ExpireDate = $scope.ItemMasterForm.Input_ExpireDate;
            ItemBaseInfo[0].IsActive = true;
            ItemBaseInfo[0].CreatedBy = $rootScope.UserId;
        }
        else {
            var ConversionInfo = {
                UnitOfMeasureId: 0,
                ItemBasePriceInfoGUID: generateGUID(),
                ItemPrice: $scope.ItemMasterForm.Input_ItemPrice,
                EffectiveDate: $scope.ItemMasterForm.Input_EffectiveDate,
                ExpireDate: $scope.ItemMasterForm.Input_ExpireDate,
                IsActive: true,
                CreatedBy: $rootScope.UserId,
            }
            $scope.ItemBaseInfoList.push(ConversionInfo);
        }
        $scope.ClearItemBasePriceinfoControls();

        //else {
        //    $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
        //}
        //alert('sdfsdf');

    }

    $scope.EditItemBasePriceInfo = function (id) {
        debugger;
        $scope.ClearItemBasePriceinfoControls();
        var ItemBasePriceinfo = $scope.ItemBaseInfoList.filter(function (m) { return m.ItemBasePriceInfoGUID === id; });
        $scope.EditItemBasePriceInfoGUID = id;
        $scope.ItemMasterForm.Input_ItemPrice = ItemBasePriceinfo[0].ItemPrice;
        $scope.ItemMasterForm.Input_EffectiveDate = ItemBasePriceinfo[0].EffectiveDate;
        $scope.ItemMasterForm.Input_ExpireDate = ItemBasePriceinfo[0].ExpireDate;
    }

    $scope.DeleteItemBasePriceInfo = function (id) {

        var ContactInfo = $scope.ItemBaseInfoList.filter(function (m) { return m.ItemBasePriceInfoGUID !== id; });
        $scope.ItemBaseInfoList = ContactInfo;
    }

    $scope.ClearItemBasePriceinfoControls = function () {
        $scope.EditItemBasePriceInfoGUID = "";
        $scope.ItemMasterForm.Input_ItemPrice = "";
        $scope.ItemMasterForm.Input_EffectiveDate = "";
        $scope.ItemMasterForm.Input_ExpireDate = "";
    }





    $rootScope.Edit = function (id) {
        debugger;
        $scope.AddForm();
        var requestData =
        {
            ServicesAction: 'GetAllItemListById',
            ItemId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (response.data.Json != undefined) {
                var responsedata = response.data.Json.ItemList[0];
                $scope.ActionType = "Edit";
                $scope.ItemId = responsedata.ItemId;
                $scope.ItemMasterForm.Input_ItemName = responsedata.ItemName;
                $scope.ItemMasterForm.Input_ItemCode = responsedata.ItemCode;
                $scope.ItemMasterForm.Input_ItemEnglishLanguage = responsedata.ItemNameEnglishLanguage;
                $scope.ItemMasterForm.Input_ItemShortCode = responsedata.ItemShortCode;
                $scope.ItemMasterForm.Input_PrimaryUnitOfMeasureItem = responsedata.PrimaryUnitOfMeasure;
                $scope.ItemMasterForm.Input_BussinessUnit = responsedata.BussinessUnit;
                $scope.ItemMasterForm.Input_ItemDescription = responsedata.Description;
                $scope.ItemMasterForm.Input_PricingUnit = responsedata.PricingUnit;
                $scope.ItemMasterForm.Input_ShippingUnit = responsedata.ShippingUnit;
                //$scope.ItemMasterForm.Input_ItemPrice = responsedata.Amount;
                $scope.ItemMasterForm.Input_EffectiveDate = responsedata.EffectiveDate;
                $scope.ItemMasterForm.Input_ExpiryDate = responsedata.ExpiryDate;
                $scope.ItemMasterForm.Input_ComponentUnit = responsedata.ComponentUnit;
                $scope.ItemMasterForm.Input_ShelfLife = responsedata.ShelfLife;
                $scope.ItemMasterForm.Input_BBD = responsedata.BBD;

                $rootScope.ItemData.image = responsedata.ImageUrl;

                //$scope.SelectLoadedDistributorsList = responsedata.CompanyID;

                //if (responsedata.CompanyList != undefined) {
                //    if (responsedata.CompanyList.length > 0) {
                //        $scope.SelectLoadedDistributorsList = responsedata.CompanyList
                //    } else {
                //        $scope.SelectLoadedDistributorsList = [];
                //    }
                //}

                if (responsedata.CollectionLocationList != undefined) {
                    if (responsedata.CollectionLocationList.length > 0) {
                        $scope.BranchPlantDataSelectedList = responsedata.CollectionLocationList;
                    }
                    else {
                        $scope.BranchPlantDataSelectedList = [];
                    }
                }
                if (responsedata.ConversionInformationList !== undefined) {
                    $scope.ConversionInformationList = responsedata.ConversionInformationList;
                }
                else {
                    $scope.ConversionInformationList = [];
                }
                if (responsedata.ItemBaseInfoList !== undefined) {
                    $scope.ItemBaseInfoList = responsedata.ItemBaseInfoList;
                }
                else {
                    $scope.ItemBaseInfoList = [];
                }



                if (responsedata.ItemMultiLanguageNameList !== undefined) {
                    $scope.ItemNameMultiLanguageList = responsedata.ItemMultiLanguageNameList;
                }
                else {
                    $scope.ItemNameMultiLanguageList = [];
                }


                //if (ContactInfo != undefined) {
                //    if (ContactInfo !== 0) {
                //        for (var i = 0; i < ContactInfo.length; i++) {

                //            $scope.Contactinfo1 = {
                //                ContactinfoGUID: generateGUID(),
                //                ContactType: ContactInfo[i].ContactType,
                //                ContactTypeId: ContactInfo[i].ContactTypeId,
                //                ContactPersonName: ContactInfo[i].ContactPersonName,
                //                ContactPersonNumber: ContactInfo[i].ContactPersonNumber,
                //                ObjectType: 'Company',
                //                IsActive: true,
                //                CreatedBy: $rootScope.UserId,
                //            }
                //            $scope.ContactInformationList.push($scope.Contactinfo1);
                //        }
                //    }
                //}

                $scope.ItemMasterForm.Input_Barcode = responsedata.Barcode;
                $scope.ItemMasterForm.Input_ItemOwner = responsedata.ItemOwner;
                $scope.ItemMasterForm.Input_Brand = responsedata.Brand;
                $scope.ItemMasterForm.Input_AutomatedWareHouseUOM = responsedata.AutomatedWareHouseUOM;



            }
        });
    }





    $scope.CleaeAddItemForm = function () {
        $rootScope.ItemAddedModalPopupControl = false;

        $scope.ItemMasterForm = {
            Input_ItemName: '',
            Input_ItemCode: '',
            Input_ItemPrice: '',
            Input_PrimaryUnitOfMeasure: '',
            Input_RelatedPrimaryUnitOfMeasure: '',
            Input_ItemEnglishLanguage: '',
            Input_ConversionFactor: '',
            Input_BussinessUnit: '',
            Input_StockInQuantity: '',
            Input_PackSize: '',
            Input_BranchPlant: '',
            Input_PricingUnit: '',
            Input_ShippingUnit: '',
            Input_UOM: '',
            Input_EffectiveDate: '',
            Input_ExpireDate: '',
            Input_ItemShortCode: '',
            Input_Field1: '',
            Input_Field2: '',
            Input_Field3: '',
            Input_Field4: '',
            Input_Field5: '',
            Input_Field6: '',
            Input_Field7: '',
            Input_Field8: '',
            Input_Field9: '',
            Input_Field10: '',
            Input_ComponentUnit: '',
            Input_ShelfLife: '',
            Input_BBD: '',
            Input_Barcode: '',
            Input_ItemOwner: '',
            Input_Brand: '',
            Input_AutomatedWareHouseUOM: '',
            Input_ItemDescription: '',
            Input_PrimaryUnitOfMeasureItem: '',
            Input_ImageUrl: "/Images/ProductImages/no_image.png"


        };

        $rootScope.ItemData = {
            labelFilename: 'no_image.png',
            image: "/Images/ProductImages/no_image.png"
        };

        $rootScope.IsImageSelected = "0";

        $scope.ConversionInformationList = [];
        $scope.ItemBaseInfoList = [];

        $scope.ViewForm();

    };

    $rootScope.ClearUploadProfileImage = function () {
        debugger;
        $rootScope.ItemData = {
            labelFilename: 'no_image.png',
            image: "/Images/ProductImages/no_image.png"
        };

        $rootScope.IsImageSelected = "0";

        angular.element("input[type='file']").val(null);
    };

    $scope.CheckFileUploaded = function () {

        var filenotuploaded = true;
        if ($rootScope.ItemData.image === null || $rootScope.ItemData.image === undefined || $rootScope.ItemData.image === "" || $rootScope.ItemData.image === "/Images/ProductImages/no_image.png") {
            filenotuploaded = true;
        } else {
            filenotuploaded = false;
        }
        return filenotuploaded;
    };

}).directive("ngFileSelectImage", function (fileReader, $timeout, $rootScope) {
    return {
        scope: {
            ngModel: '='
        },
        link: function ($scope, el) {
            function getFile(file) {
                debugger;

                var fileName = file.name;

                var extensionFileName = fileName.split('.').pop();
                if (extensionFileName !== "jpg" && extensionFileName !== "png" && extensionFileName !== "jpeg") {
                    $rootScope.ValidationErrorAlert("Invalid file format. Please choose jpg or png format.", 'error', 8000);
                    return false;
                }

                $rootScope.ItemData.labelFilename = file.name;

                fileReader.readAsDataUrl(file, $scope)
                    .then(function (result) {
                        $timeout(function () {
                            debugger;
                            $rootScope.ItemData.image = result;
                            $rootScope.IsImageSelected = "1";
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