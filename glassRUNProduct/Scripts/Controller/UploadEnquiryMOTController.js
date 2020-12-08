angular.module("glassRUNProduct").controller('UploadEnquiryMOTController', function ($scope, $q, $location, $filter, $state, $rootScope, $sessionStorage, $ionicModal, pluginsService, GrRequestService) {


    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }


    $scope.IsGratisOrder = false;

    var page = $location.absUrl().split('#/')[1];
    $scope.Page = page;



    $rootScope.FileUploadJSON = {
        DocumentName: '',
        DocumentBase64: '',
        FileFormat: '',
        SelectFileFormat: '',
        SelectFileSize: ''
    }




    $scope.IsCalculate = true;


    $scope.IsDisabledSubmit = false;

    $scope.ItemTaxInPec = 0;
    $scope.EmptiesAmount = 0;
    $scope.OrderData = [];
    $scope.EmptiesCss = true;
    $scope.bindallCompanyList = [];
    $scope.MotCustomerId = [];
    $scope.PromotionItemList = [];
    $scope.bindAllSettingMaster = [];
    $scope.AssociatedOrderList = [];
    $scope.IsPalettesRequired = false;
    $rootScope.DiscountAmount = 0;
    $scope.AllEnquiryTotalAmount = 0;
    $scope.TruckCapacityFullInTone = 0;
    $scope.bindAllSettingMaster = $sessionStorage.AllSettingMasterData;
    $scope.OrderDate = new Date();

    $scope.EmptiesAmount = 0;
    $scope.ItemTaxInPec = 0;
    $scope.WoodenPalletCode = "";
    $scope.NumberOfProductAdd = 0;
    $scope.PalettesBufferWeight = 0;
    $scope.TruckExceedBufferWeight = 0;
    $scope.PalettesExceedBufferWeight = 0;
    $scope.IsGroup = false;
    $scope.IsCreditLimitInNegative = false;

    LoadActiveVariables($sessionStorage, $state, $rootScope);


    //#region Load Setting Values
    $scope.LoadDefaultSettingsValue = function () {



        if ($scope.Page == "UploadEnquiryPageForMOTWithPromotion" || $scope.Page == "UploadEnquiry") {

            $scope.IsGroup = true;

        }


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






        var EmptiesAmountLength = $scope.LoadSettingInfoByName('EmptiesAmount', '');
        if (EmptiesAmountLength.length > 0) {
            $scope.EmptiesAmount = parseFloat(EmptiesAmountLength[0].SettingValue);
        }


        var itemTaxInPec = $scope.LoadSettingInfoByName('ItemTaxInPec', '');
        if (itemTaxInPec != "") {
            $scope.ItemTaxInPec = parseFloat(itemTaxInPec);
        }



        var woodenPalletCode = $scope.LoadSettingInfoByName('WoodenPalletCode', '');
        if (woodenPalletCode != "") {
            $scope.WoodenPalletCode = woodenPalletCode;
        }



        var NumberOfProductAdd = $scope.LoadSettingInfoByName('NumberOfProductAdd', '');
        if (NumberOfProductAdd != "") {
            $scope.NumberOfProductAdd = parseInt(NumberOfProductAdd);
        }


        var PalettesBufferWeight = $scope.LoadSettingInfoByName('PalettesBufferWeightForMOT', '');
        if (PalettesBufferWeight != "") {
            $scope.PalettesBufferWeight = parseFloat(PalettesBufferWeight);
        }




        var TruckExceedBufferWeight = $scope.LoadSettingInfoByName('TruckExceedBufferWeightForMOT', '');
        if (TruckExceedBufferWeight != "") {
            $scope.TruckExceedBufferWeight = parseFloat(TruckExceedBufferWeight);
        }




        var PalettesExceedBufferWeight = $scope.LoadSettingInfoByName('PalettesExceedBufferWeightForMOT', '');
        if (PalettesExceedBufferWeight != "") {
            $scope.PalettesExceedBufferWeight = parseFloat(PalettesExceedBufferWeight);
        }




        $rootScope.ngFileAllowextension = $scope.LoadSettingInfoByName('MOTFileAllowextension', '');
        if ($rootScope.ngFileAllowextension === "") {
            $rootScope.ngFileAllowextension = "";
        }

        $rootScope.ngFileAllowsize = $scope.LoadSettingInfoByName('MOTFileAllowsize', 'int');
        if ($rootScope.ngFileAllowsize === "") {
            $rootScope.ngFileAllowsize = 0;
        }

        $scope.BlockGratisLastDays = $scope.LoadSettingInfoByName('BlockGratisLastDays', 'int');
        debugger;
        if ($scope.BlockGratisLastDays === "" || $scope.BlockGratisLastDays === 0 || $scope.BlockGratisLastDays === undefined) {
            $scope.BlockGratisLastDays = 0;
        }


        $rootScope.resData.res_GratisOrder_GratisNote = String.format($rootScope.resData.res_GratisOrder_GratisNote, $rootScope.ngFileAllowextension, $rootScope.ngFileAllowsize);

    }
    $scope.LoadDefaultSettingsValue();




    $scope.IsRecalculateVisibile = true;
    $scope.CreditLimit = 0;
    $scope.AvailableCreditLimit = 0;
    $rootScope.EmptiesLimit = 0;
    $rootScope.ActualEmpties = 0;


    $scope.PalettesWidth = {
        width: "0%"

    };

    $scope.MotEnquiry = {
        Comments: "",
        PONumber: ""

    };


    $scope.NoteVariable = {
        NoteText: ''
    }






    function generateGUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };


    var requestData =
    {
        ServicesAction: 'LoadAllProductsForMOT',
        CompanyId: $scope.TempCompanyId
    };

    //var stringfyjson = JSON.stringify(requestData);
    var jsonobject = {};
    jsonobject.Json = requestData;
    GrRequestService.ProcessRequest(jsonobject).then(function (response) {

        var resoponsedata = response.data;
        $scope.bindallproduct = resoponsedata.Item.ItemList;
        $rootScope.Throbber.Visible = false;
    });




    $scope.OpenAddNotesModalPopup = function (orderGuId) {
        $scope.NotesOrderGuId = orderGuId;
        if ($scope.SaveNoteText !== "" && $scope.SaveNoteText !== undefined) {
            $scope.NoteVariable.NoteText = $scope.SaveNoteText;
        } else {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === orderGuId; });
            if (currentOrder.length > 0) {
                if (currentOrder[0].NoteList != undefined) {
                    if (currentOrder[0].NoteList.length > 0) {
                        $scope.NoteVariable.NoteText = currentOrder[0].NoteList[0].Note;
                    } else {
                        $scope.NoteVariable.NoteText = "";
                    }
                } else { $scope.NoteVariable.NoteText = ""; }
            } else {
                $scope.NoteVariable.NoteText = "";
            }
        }
        $scope.NotesModalPopupControl = true;
    }

    $scope.CloseAddNotesModalPopup = function () {

        $scope.NotesModalPopupControl = false;
    }




    $scope.LoadAssociatedOrder = function (CompanyId, deliveryLocationId) {


        var requestData =
        {
            ServicesAction: 'LoadGratisOrderBySoldToId',
            CompanyId: CompanyId,
            ShipTo: deliveryLocationId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var responseStr = response.data;
            if (responseStr.Order != undefined) {
                if (responseStr.Order.OrderList != '') {
                    $scope.AssociatedOrderList = responseStr.Order.OrderList;
                    $scope.RemoveSelectedAssociatedOrder();
                }
            }

        });

    }


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



    $ionicModal.fromTemplateUrl('templates/EnquiryValidation.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.EnquiryValidationPopup = modal;
    });


    $scope.CloseEnquiryValidationpopup = function () {


        $scope.EnquiryValidationPopup.hide();
    }

    $scope.OpenEnquiryValidationpopup = function () {


        $scope.EnquiryValidationPopup.show();
    }





    $scope.AddDefaultTruck = function (deliverylocationId, truckSize, truckSizeId, companyId, poNumber) {


        $scope.CurrentOrderGuid = generateGUID();

        $scope.PalettesCorrectWeight = 0;
        $scope.TruckCapacityFullInTone = 0;
        $scope.TruckCapacityFullInPercentage = 0;
        var orders = {
            OrderGUID: $scope.CurrentOrderGuid,
            TruckName: '',
            DeliveryLocation: deliverylocationId,
            TruckSize: truckSize,
            ProposedETDStr: '',
            EnquiryId: 0,
            RequestDate: $scope.ProposedDate,
            TotalWeight: 0,
            TruckCapacity: 0,
            TruckPallets: 0,
            TotalProductPallets: 0,
            IsTruckFull: false,
            TruckSizeId: truckSizeId,
            ShipTo: 0,
            SoldTo: companyId,
            PONumber: poNumber,
            IsActive: true,
            CurrentQuantity: 0,
            RemainingQuantity: 0,
            EnquiryProductList: [],
            OrderProductList: [],
            TruckCapacityFullInPercentage: 0,
            PalettesCorrectWeightInPercentage: 0,
            ProposedDateValue: $scope.ProposedDate,
            TotalWeight: 0,
            TotalVolume: 0,
            TruckWeight: 0,
            TotalDepositeAmount: 0,
            TotalTaxAmount: 0,
            TotalDiscountAmount: 0,
            totalorderamount: 0,
            TotalAmount: 0,
            TotalQuantity: 0,
            TotalPrice: 0,

        }
        $scope.OrderData.push(orders);

    }

    var requestData =
    {
        ServicesAction: 'LoadAllCompanyDetailListByDropDown',
        CompanyId: ''
    };

    // var stringfyjson = JSON.stringify(requestData);
    var jsonobject = {};
    jsonobject.Json = requestData;
    GrRequestService.ProcessRequest(jsonobject).then(function (response) {

        // var resoponsedata = JSON.parse(JSON.parse(response.data));
        var resoponsedata = response.data.Json;

        $scope.bindallCompanyList = resoponsedata.CompanyList;


    });






    $scope.GetDeliveryLocationListByCustomerId = function (customerId) {

        $scope.MotCustomerId = customerId;


        var requestData =
        {
            ServicesAction: 'LoadAllDeliveryLocation',
            CompanyId: parseInt($scope.MotCustomerId)
        };

        // var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            // var resoponsedata = JSON.parse(JSON.parse(response.data));
            var resoponsedata = response.data;
            $scope.bindDeliverylocation = resoponsedata.DeliveryLocation.DeliveryLocationList;
        });

    }

    $scope.getDeliverylocationSelectValue = function (deliverylocationId) {



        $scope.DeliveryLocationId = deliverylocationId;
        var deliveryObjDetailsSelected = $scope.bindDeliverylocation.filter(function (el) { return el.IsDeliveryLocationSelected === true });
        if (deliveryObjDetailsSelected.length > 0) {
            deliveryObjDetailsSelected[0].IsDeliveryLocationSelected = false;
        }

        var deliveryObjDetails = $scope.bindDeliverylocation.filter(function (el) { return el.DeliveryLocationId === deliverylocationId });
        if (deliveryObjDetails.length > 0) {

            $scope.DeliveryLocationName = deliveryObjDetails[0].DeliveryLocationName;

            if (deliveryObjDetails[0].IsDeliveryLocationSelected) {
                deliveryObjDetails[0].IsDeliveryLocationSelected = false;
            }
            else {
                deliveryObjDetails[0].IsDeliveryLocationSelected = true;
            }



        }
        $scope.LoadTruckSizeBelongsToLoactionIdAndCompanyId(deliverylocationId);

        $scope.GetProposedDeliveryDate(deliverylocationId);
    }



    $scope.LoadTruckSizeBelongsToLoactionIdAndCompanyId = function (locationId) {

        var requestData =
        {
            ServicesAction: 'GetTruckDetailByLocationIdAndCompanyId',
            LocationId: locationId,
            CompanyId: parseInt($scope.MotCustomerId)
        };

        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {


            var resoponsedata = response.data;
            if (resoponsedata !== null) {
                $scope.bindTruckSize = resoponsedata.Json.EnquiryList;


                if ($rootScope.TemOrderData !== undefined) {
                    if ($rootScope.TemOrderData.length > 0) {


                        if ($rootScope.CurrentOrderGuid === '' || $rootScope.CurrentOrderGuid === undefined) {
                            currentOrder = $scope.OrderData.filter(function (el) { return el.IsTruckFull === false; });
                        }
                        else {
                            currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $rootScope.CurrentOrderGuid; });
                        }

                        if (currentOrder.length > 0) {
                            $scope.getSelectValue(currentOrder[0].TruckSizeId);
                            $scope.ReloadGraph(currentOrder);
                        }
                    }
                }

            }
            else {
                $scope.bindTruckSize = [];

            }


        });
    };


    $scope.PromotionList = function (companyId, deliveryArea) {


        var requestPromotionData =
        {
            ServicesAction: 'GetPromotionFocItemList',
            CompanyId: companyId,
            Region: deliveryArea
        };

        //var stringfyjson = JSON.stringify(requestData);
        var jsonPromotionobject = {};
        jsonPromotionobject.Json = requestPromotionData;
        GrRequestService.ProcessRequest(jsonPromotionobject).then(function (Promotionresponse) {


            var resoponsedata = Promotionresponse.data;
            if (resoponsedata.PromotionFocItemDetail !== undefined) {
                $scope.PromotionItemList = resoponsedata.PromotionFocItemDetail.PromotionFocItemDetailList;
            }


        });

    }



    $scope.GetReceivingLocationBalanceCapacity = function (companyId, deliverylocationId, proposedDeliveryDate) {

        var requestData =
        {
            ServicesAction: 'GetReceivingLocationBalanceCapacity',
            CompanyId: companyId,
            ShipTo: deliverylocationId,
            ProposedDeliveryDate: proposedDeliveryDate,
            EnquiryId: $scope.EnquiryId,
        };

        // var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            // var resoponsedata = JSON.parse(JSON.parse(response.data));
            if (response.data != null) {
                var resoponsedata = response.data.Json.BalanceCapacity;

                $scope.DeliveryUsedCapacity = resoponsedata;
            }

        });
    }




    $scope.GetProposedDeliveryDate = function (locationId, companyId, DeliveryLocationCode, TempCompanyMnemonic) {
        debugger;
        var requestData =
        {
            ServicesAction: 'GetProposedDeliveryDate',
            CompanyId: companyId,
            CompanyMnemonic: TempCompanyMnemonic,
            DeliveryLocation: {
                LocationId: locationId,
                DeliveryLocationCode: DeliveryLocationCode,
            },
            Company: {
                CompanyId: companyId,
                CompanyMnemonic: TempCompanyMnemonic,
            },
            RuleType: 1,
            Order: {
                OrderTime: "",
                OrderDate: ""
            }
        };

        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var responseStr = response.data.Json;
            //$scope.ProposedDate = responseStr.ProposedDate;

            if (responseStr.ProposedDate === '' || responseStr.ProposedDate === undefined) {
                var getDefaultSettingValue = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ProposedDeliveryDate'; });
                if (getDefaultSettingValue.length > 0) {
                    var someDate = new Date();
                    var numberOfDaysToAdd = parseInt(getDefaultSettingValue[0].SettingValue);
                    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                    var dd = someDate.getDate();
                    var mm = someDate.getMonth() + 1;
                    var y = someDate.getFullYear();
                    var someFormattedDate = dd + '/' + mm + '/' + y;

                    $scope.ProposedDate = someFormattedDate;
                }
                else {
                    $scope.ProposedDate = 'N/A'
                }
            }
            else {

                $scope.ProposedDate = responseStr.ProposedDate;
            }

            $scope.ReceivingLocationCapacityDate = $scope.ProposedDate;

            var frozenpraposeddate = $filter('date')($scope.ProposedDate, 'dd/MM/yyyy');
            frozenpraposeddate = frozenpraposeddate.split('/');
            frozenpraposeddate = frozenpraposeddate[1] + "/" + frozenpraposeddate[0] + "/" + frozenpraposeddate[2];
            frozenpraposeddate = new Date(frozenpraposeddate);
            frozenpraposeddate.setDate(frozenpraposeddate.getDate() + 1);
            var dd = frozenpraposeddate.getDate();
            var mm = frozenpraposeddate.getMonth() + 1;
            var y = frozenpraposeddate.getFullYear();
            frozenpraposeddate = dd + '/' + mm + '/' + y;
            $scope.frozenDate = frozenpraposeddate;
            $scope.GetReceivingLocationBalanceCapacity($scope.CompanyId, locationId, $scope.ProposedDate);

            var GetScheduleDateNumber = 6;
            var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ScheduleDateNumber'; });
            if (truckBufferWeight.length > 0) {
                GetScheduleDateNumber = parseFloat(truckBufferWeight[0].SettingValue);
            }

            $scope.date = $filter('date')($scope.OrderDate, 'dd/MM/yyyy');
            var date = $scope.date;
            var proposedetd = date.split(' ');
            var etd = proposedetd[0].split('/');
            var etddate = etd[1] + "/" + etd[0] + "/" + etd[2];
            var enddate = new Date(etddate);
            enddate.setDate(enddate.getDate() + GetScheduleDateNumber);
            var dd = enddate.getDate();
            var mm = enddate.getMonth() + 1;
            var y = enddate.getFullYear();
            var SchedulingDate = dd + '/' + mm + '/' + y;
            $scope.schedulingDate = SchedulingDate;


            $scope.GetScheduleDate(frozenpraposeddate, SchedulingDate);

        });
    };



    $scope.SetProposedDeliveryDate = function (response) {
        debugger;

        var responseStr = response.data.Json;
        //$scope.ProposedDate = responseStr.ProposedDate;

        if (responseStr.ProposedDate === '' || responseStr.ProposedDate === undefined) {
            var getDefaultSettingValue = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ProposedDeliveryDate'; });
            if (getDefaultSettingValue.length > 0) {
                var someDate = new Date();
                var numberOfDaysToAdd = parseInt(getDefaultSettingValue[0].SettingValue);
                someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                var dd = someDate.getDate();
                var mm = someDate.getMonth() + 1;
                var y = someDate.getFullYear();
                var someFormattedDate = dd + '/' + mm + '/' + y;

                $scope.ProposedDate = someFormattedDate;
            }
            else {

                $scope.ProposedDate = 'N/A'
            }
        }
        else {
            var datevalue = responseStr.ProposedDate.split(' ');
            //$rootScope.ProposedDate = datevalue[0];
            $scope.ProposedDate = datevalue[0];
        }

        $scope.ReceivingLocationCapacityDate = $scope.ProposedDate;

        var frozenpraposeddate = $filter('date')($scope.ProposedDate, 'dd/MM/yyyy');
        frozenpraposeddate = frozenpraposeddate.split('/');
        frozenpraposeddate = frozenpraposeddate[1] + "/" + frozenpraposeddate[0] + "/" + frozenpraposeddate[2];
        frozenpraposeddate = new Date(frozenpraposeddate);
        frozenpraposeddate.setDate(frozenpraposeddate.getDate() + 1);
        var dd = frozenpraposeddate.getDate();
        var mm = frozenpraposeddate.getMonth() + 1;
        var y = frozenpraposeddate.getFullYear();
        frozenpraposeddate = dd + '/' + mm + '/' + y;
        $scope.frozenDate = frozenpraposeddate;
        $scope.GetReceivingLocationBalanceCapacity($scope.CompanyId, $scope.MOTOrderJson[0].ShipTo, $scope.ProposedDate);

        var GetScheduleDateNumber = 6;
        var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ScheduleDateNumber'; });
        if (truckBufferWeight.length > 0) {
            GetScheduleDateNumber = parseFloat(truckBufferWeight[0].SettingValue);
        }

        $scope.date = $filter('date')($scope.OrderDate, 'dd/MM/yyyy');
        var date = $scope.date;
        var proposedetd = date.split(' ');
        var etd = proposedetd[0].split('/');
        var etddate = etd[1] + "/" + etd[0] + "/" + etd[2];
        var enddate = new Date(etddate);
        enddate.setDate(enddate.getDate() + GetScheduleDateNumber);
        var dd = enddate.getDate();
        var mm = enddate.getMonth() + 1;
        var y = enddate.getFullYear();
        var SchedulingDate = dd + '/' + mm + '/' + y;
        $scope.schedulingDate = SchedulingDate;


        $scope.GetScheduleDate(frozenpraposeddate, SchedulingDate);
    }






    $scope.PopupVariables = {
        Title: '',
        Message: '',
        Okbtn: '',
        Cancelbtn: ''
    }


    $ionicModal.fromTemplateUrl('ConfirmationPopuScreen.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {


        $scope.ConfirmationPopuScreen = modal;
    });

    $scope.OpenConfirmationPopuScreen = function (title, erromsg, Okbtn) {


        $scope.PopupVariables.Title = title;
        $scope.PopupVariables.Message = erromsg;
        $scope.PopupVariables.Okbtn = Okbtn;

        $scope.ConfirmationPopuScreen.show();
    }

    $scope.CloseConfirmationPopuScreen = function () {

        $scope.ConfirmationPopuScreen.hide();
    }

    var tmpList = [];

    for (var i = 1; i <= 6; i++) {
        tmpList.push({
            text: 'Item ' + i,
            value: i
        });
    }

    $scope.list = tmpList;


    $scope.sortingLog = [];

    $scope.sortableOptions = {
        activate: function () {
            console.log("activate");
        },
        beforeStop: function () {
            console.log("beforeStop");
        },
        change: function () {
            console.log("change");
        },
        create: function () {
            console.log("create");
        },
        deactivate: function () {
            console.log("deactivate");
        },
        out: function () {
            console.log("out");
        },
        over: function () {
            console.log("over");
        },
        receive: function () {
            console.log("receive");
        },
        remove: function () {
            console.log("remove");
        },
        sort: function () {
            console.log("sort");
        },
        start: function () {
            console.log("start");
        },
        update: function (e, ui) {
            console.log("update");

            var logEntry = tmpList.map(function (i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Update: ' + logEntry);
        },
        stop: function (e, ui) {
            console.log("stop");

            // this callback has the changed model
            var logEntry = tmpList.map(function (i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Stop: ' + logEntry);
        }
    };


    $scope.GetScheduleDate = function (startDate, endDate) {

        $('.customdate-picker').each(function () {

            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                    }
                },
                minDate: startDate,
                maxDate: endDate,
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });
    }

    $scope.GetRequestedDate = function (startDate, endDate) {

        $('.RequestedDatePicker').each(function () {

            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                    }
                },
                minDate: startDate,
                maxDate: endDate,
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });
    }

    $scope.calcTotalTax = function (OrderGuid) {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGuid; });
        var total = 0;

        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            total += parseFloat(currentOrder[0].OrderProductList[i].ItemPrices);
        }

        total = percentage(total, $scope.ItemTaxInPec);

        return total;
    }

    $scope.calcTotalAmount = function (OrderGuid) {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGuid; });
        var total = 0;

        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            total += parseFloat(currentOrder[0].OrderProductList[i].ItemPrices);
        }

        return total;
    }

    $scope.calcTotalDepositeAmount = function (OrderGuid) {

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGuid; });
        var total = 0;

        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
            total += parseFloat(currentOrder[0].OrderProductList[i].ItemTotalDepositeAmount);
        }

        return total;
    }



    $scope.UploadFile = function () {

        debugger;
        $scope.IsRecalculateVisibile = true;

        if ($rootScope.FileUploadJSON.DocumentName != "") {


            $scope.ClearAll();
            $scope.IsAllTruckFull = false;
            $scope.IsDisabledSubmit = false;
            if ($rootScope.Throbber !== undefined) {
                $rootScope.Throbber.Visible = true;
            } else {
                $rootScope.Throbber = {
                    Visible: true,
                }
            }
            $scope.ParentJson = [];
            $scope.ChildJson = [];
            var requestData = {

                ServicesAction: 'BulkInsertMOTOrder',
                File: $rootScope.FileUploadJSON.DocumentBase64,
                FileName: $rootScope.FileUploadJSON.DocumentName,
                UserName: $rootScope.UserName,
                UserId: $rootScope.UserId,
                IsGroup: $scope.IsGroup,
                PageName: $scope.Page
            };
            var jsonobject = {};
            jsonobject.Json = requestData;

            $scope.loading = true;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                debugger;
                var readData = response.data;

                if (readData.IsValidExcel) {


                    var allocationList = response.data.MotOrder.filter(function (el) { return el.AllocatedExcited === "1"; });
                    if (allocationList.length === 0) {

                        $scope.MOTOrderJson = readData.MotOrder;


                        for (var i = 0; i < $scope.MOTOrderJson.length; i++) {
                            if ($scope.MOTOrderJson[i].IsItemLayer === "1") {
                                var g = (parseInt($scope.MOTOrderJson[i].Quantity) % parseInt($scope.MOTOrderJson[i].QtyPerLayer));
                                if ((parseInt($scope.MOTOrderJson[i].Quantity) % parseInt($scope.MOTOrderJson[i].QtyPerLayer)) > 0) {
                                    $scope.MOTOrderJson[i].IsItemLayerFull = false;
                                } else {
                                    $scope.MOTOrderJson[i].IsItemLayerFull = true;
                                }
                            } else {
                                $scope.MOTOrderJson[i].IsItemLayerFull = true;
                            }

                            $scope.MOTOrderJson[i].Allocation = 'NA';
                            $scope.MOTOrderJson[i].ActualAllocation = 'NA';
                            $scope.MOTOrderJson[i].ItemType = 32;


                        }




                        $scope.CustomerName = readData.MotOrder[0].CustomerName;

                        $scope.CompanyZone = readData.MotOrder[0].CompanyZone;

                        CompanyId = readData.MotOrder[0].CompanyId;
                        $scope.ParentCompany = readData.MotOrder[0].ParentCompany;
                        CompanyMnemonic = readData.MotOrder[0].CompanyMnemonic;
                        $scope.CompanyMnemonic = readData.MotOrder[0].CompanyMnemonic;
                        $scope.ShipToCode = readData.MotOrder[0].ShipToCode;
                        $scope.TruckCapacity = (parseFloat($scope.MOTOrderJson[0].TruckCapacityWeight) * 1000);


                        $scope.TruckCapacityInTone = $scope.TruckCapacity / 1000;



                        //GetRuleForPalletConsumptionAndValidation

                        var requestforForPalletConsumptionAndValidation =
                        {
                            ServicesAction: 'GetRuleForPalletConsumptionAndValidation',
                            CustomerId: $scope.MOTOrderJson[0].CompanyId,
                            DeliveryLocationId: $scope.MOTOrderJson[0].ShipTo,
                            TruckSizeId: $scope.MOTOrderJson[0].TruckSizeId,

                        };


                        var jsonobjectForForPalletConsumptionAndValidation = {};
                        jsonobjectForForPalletConsumptionAndValidation.Json = requestforForPalletConsumptionAndValidation;
                        var responseForForPalletConsumptionAndValidation = GrRequestService.ProcessRequest(jsonobjectForForPalletConsumptionAndValidation);








                        //get area rule

                        var requestAreaData =
                        {
                            ServicesAction: 'GetRuleValue',
                            CompanyId: $scope.MOTOrderJson[0].CompanyId,
                            CompanyMnemonic: $scope.MOTOrderJson[0].CompanyMnemonic,
                            DeliveryLocation: {
                                LocationId: $scope.MOTOrderJson[0].ShipTo,
                                DeliveryLocationCode: $scope.MOTOrderJson[0].DeliveryLocationCode,
                                Area: $scope.MOTOrderJson[0].Area,
                            },
                            Company: {
                                CompanyId: $scope.MOTOrderJson[0].CompanyId,
                                CompanyMnemonic: $scope.MOTOrderJson[0].CompanyMnemonic,
                            },
                            Supplier: {
                                CompanyId: $scope.MOTOrderJson[0].CompanyId,
                                CompanyMnemonic: $scope.MOTOrderJson[0].CompanyMnemonic,
                            },

                            RuleType: 5,
                            TruckSize: {
                                TruckSize: parseFloat($scope.TruckCapacityInTone)
                            }

                        };

                        var jsonobjectForAreaData = {};
                        jsonobjectForAreaData.Json = requestAreaData;
                        var responseForAreaData = GrRequestService.ProcessRequest(jsonobjectForAreaData);





                        //get   rules for ProposedDeliveryDate
                        debugger;

                        var requestDataForProposedDeliveryDate =
                        {
                            ServicesAction: 'GetProposedDeliveryDate',
                            CompanyId: $scope.MOTOrderJson[0].CompanyId,
                            CompanyMnemonic: $scope.MOTOrderJson[0].CompanyMnemonic,
                            DeliveryLocation: {
                                LocationId: $scope.MOTOrderJson[0].ShipTo,
                                LocationCode: $scope.MOTOrderJson[0].ShipToCode,
                                DeliveryLocationCode: $scope.MOTOrderJson[0].ShipToCode,
                            },
                            Company: {
                                CompanyId: $scope.MOTOrderJson[0].CompanyId,
                                CompanyMnemonic: $scope.MOTOrderJson[0].CompanyMnemonic,
                            },
                            Supplier: {
                                CompanyId: $scope.MOTOrderJson[0].CompanyId,
                                CompanyMnemonic: $scope.MOTOrderJson[0].CompanyMnemonic,
                            },

                            RuleType: 1,
                            Order: {
                                OrderTime: "",
                                OrderDate: ""
                            }
                        };

                        var jsonobjectForProposedDeliveryDate = {};
                        jsonobjectForProposedDeliveryDate.Json = requestDataForProposedDeliveryDate;
                        var responseForProposedDeliveryDate = GrRequestService.ProcessRequest(jsonobjectForProposedDeliveryDate);



                        $q.all([

                            responseForForPalletConsumptionAndValidation,
                            responseForAreaData,
                            responseForProposedDeliveryDate
                        ]).then(function (resp) {


                            $scope.IsPalettesRequired = false;

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


                            if ($scope.Page == "UploadEnquiry") {
                                $scope.IsPalletSpaceLoadCheckVisibility = "0";
                                $scope.IsWeightLoadCheckVisibility = "0";
                            }


                            var responseForAreaData = resp[1];


                            if (responseForAreaData !== undefined) {
                                if (responseForAreaData.data !== undefined) {



                                    var arearesponseStr = responseForAreaData.data.Json;

                                    if (arearesponseStr.RuleValue !== '' || arearesponseStr.RuleValue !== undefined) {
                                        var rulevalue = parseInt(arearesponseStr.RuleValue);


                                        if (rulevalue > 0) {

                                            $scope.MOTOrderJson[0].TruckCapacityPalettes = rulevalue;
                                        }
                                    }


                                }
                            }




                            $scope.buindingPalettes = [];




                            if ($scope.IsPalletSpaceLoadCheckVisibility == "1") {

                                $scope.TruckCapacityPalettes = $scope.MOTOrderJson[0].TruckCapacityPalettes;

                                for (var i = 0; i < $scope.TruckCapacityPalettes; i++) {
                                    var palettes = {
                                        PalettesWidth: 0
                                    }
                                    $scope.buindingPalettes.push(palettes);
                                }

                                var space = 100 - ($scope.buindingPalettes.length - 1);
                                var width = space / $scope.buindingPalettes.length;
                                $scope.PalettesWidth.width = width + "%";



                                $scope.IsPalettesRequired = true;


                            } else if ($scope.IsPalletSpaceLoadCheckVisibility == "0") {

                                $scope.IsPalettesRequired = false;

                            }







                            $scope.TruckSize = readData.MotOrder[0].TruckSize;
                            $scope.AllocationQuantity = readData.MotOrder[0].AllocationQuantity;
                            $scope.PONumber = readData.MotOrder[0].PONumber;

                            //$scope.LoadGratisOrder($scope.MOTOrderJson[0].ShipTo, $scope.MOTOrderJson[0].CompanyId);




                            //set proposed date 

                            var responseForProposedDeliveryDate = resp[2];

                            debugger;
                            $scope.SetProposedDeliveryDate(responseForProposedDeliveryDate);


                            //$scope.GetProposedDeliveryDate($scope.MOTOrderJson[0].ShipTo, $scope.MOTOrderJson[0].CompanyId, $scope.MOTOrderJson[0].CompanyId, $scope.MOTOrderJson[0].CompanyMnemonic);
                            $scope.GetReceivingLocationBalanceCapacity($scope.MOTOrderJson[0].CompanyId, $scope.MOTOrderJson[0].ShipTo, $scope.ProposedDate);
                            $scope.LoadAssociatedOrder($scope.MOTOrderJson[0].CompanyId, $scope.MOTOrderJson[0].ShipTo);


                            //IsGroup 
                            if ($scope.IsGroup == true) {


                                var InValidItem = $scope.MOTOrderJson.filter(function (el) { return el.IsValidItem === "0" });


                                if (InValidItem.length != 0) {


                                    //$rootScope.ValidationErrorAlert(String.format("There are some issues withn the data in uploaded excel sheet. Please rectify them before you proceed."), '', 3000);

                                    $rootScope.ValidationErrorAlert(String.format("One of the Product " + InValidItem[0].ItemCode + " does not exists or should not be less than zero."), '', 3000);

                                    $rootScope.Throbber.Visible = false;

                                    return false;
                                }


                                $scope.CreateTruckbyGroup();

                            }

                            $scope.LoadCreditAndAvailableLimit($scope.MOTOrderJson[0].CompanyId, $scope.MOTOrderJson[0].CompanyMnemonic);




                        });




                    } else {


                        if (allocationList.length > 0) {



                            debugger;

                            var newAllocationList = [];




                            for (var i = 0; i < allocationList.length; i++) {



                                var checkitemcodeexist = newAllocationList.filter(function (el) { return el.ItemCode === allocationList[i].ItemCode; });

                                if (checkitemcodeexist.length == 0) {

                                    var newAllocationObject = {};

                                    newAllocationObject = allocationList[i];

                                    newAllocationList.push(newAllocationObject);

                                } else {


                                    checkitemcodeexist[0].Quantity = parseInt(checkitemcodeexist[0].Quantity) + parseInt(allocationList[i].Quantity);

                                }







                            }






                            $scope.AllocationError = newAllocationList;

                            $scope.OpenEnquiryValidationpopup();
                            $rootScope.Throbber.Visible = false;
                        }

                    }
                }
                else {


                    $rootScope.ValidationErrorAlert(String.format(readData.ErrorMessage), '', 3000);




                    $scope.isShowErrorRecord = true;
                    $scope.IsSubmitInquiryButton = false;
                    $rootScope.Throbber.Visible = false;
                }


                angular.element("input[type='file']").val(null);
                $rootScope.FileUploadJSON = {
                    DocumentName: '',
                    DocumentBase64: '',
                    FileFormat: '',
                    SelectFileFormat: '',
                    SelectFileSize: ''
                }

            });



        } else {

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_MOTOrder_FileUploadErrorMessageChooseOrderFile), '', 3000);


        }



    };



    $scope.ReloadGraph = function (currentOrder, removeKegPalettes) {


        var totalWeightWithPalettes = 0;
        var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
        var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');
        truckTotalPalettes = parseFloat(truckTotalPalettes).toFixed(2);
        var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
        var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder);
        var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; }); if (palettesWeight.length > 0) {
            var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
            if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes - removeKegPalettes));
            }
            totalWeight = totalWeight + totalWeightWithPalettes
        }
        var truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);
        truckTotalPalettes = parseFloat(truckTotalPalettes).toFixed(2);

        $scope.PalettesCorrectWeight = truckTotalPalettes;


        //}
        $rootScope.PalettesCorrectWeightInPercentage = (($scope.PalettesCorrectWeight * 100) / $scope.buindingPalettes.length).toFixed(2);


        currentOrder[0].PalettesCorrectWeightInPercentage = $rootScope.PalettesCorrectWeightInPercentage; $rootScope.PalettesCorrectWeightInPercentage = (($scope.PalettesCorrectWeight * 100) / $scope.buindingPalettes.length).toFixed(2);


        currentOrder[0].PalettesCorrectWeightInPercentage = $rootScope.PalettesCorrectWeightInPercentage;
        //currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes - removeKegPalettes) + parseFloat(TotalExtraPalettes));
        //currentOrder[0].TruckWeight = (totalWeight / 1000);
        //$scope.TruckCapacityFullInTone = (totalWeight / 1000);
        //$scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);

        currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(totalNumberOfPalettes));
        currentOrder[0].TruckWeight = (totalWeight / 1000);
        currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;

        $scope.TruckCapacityFullInTone = (totalWeight / 1000);
        $scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);

        currentOrder[0].TruckCapacityFullInPercentage = $scope.TruckCapacityFullInPercentage;

        angular.forEach($scope.buindingPalettes, function (item, key) {
            item.PalettesWidth = 0;
        });
        if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
            for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                if (i < parseInt($scope.buindingPalettes.length)) {
                    $scope.buindingPalettes[i].PalettesWidth = 100;
                }
            }
        }
        $scope.CalculateDeliveryUsedCapacity();
        $scope.RemoveSelectedAssociatedOrder();

        if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {

            var otherItem = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode });
            if (otherItem.length > 0) {
                $scope.AddWoodenPallet();
            }
        }
    }










    $scope.GetItemPrice1 = function (itemId, qty, associatedOrderProduct, associatedCount) {





    }


    $scope.AddGrtaisOrder = function (itemId, qty, associatedOrderProduct, associatedCount) {

        try {

            $scope.showItembox = false;
            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
            if (productNameStr.length > 0) {
                $scope.ItemPrices = productNameStr[0].Amount;
                $scope.UOM = productNameStr[0].UOM;
                $scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
                if (associatedCount === 0) {
                    $scope.ItemDepositeAmount = productNameStr[0].CurrentDeposit;
                } else {
                    $scope.ItemDepositeAmount = 0;
                }
            }
            else {
                $scope.ItemPrices = 0;
                $scope.ItemCodeForDeposite = '';
            }


            var requestLayerData =
            {
                ServicesAction: 'GetRuleValue',
                CompanyId: $scope.TempCompanyId,
                CompanyMnemonic: $scope.TempCompanyMnemonic,
                DeliveryLocation: {
                    LocationId: $scope.DeliveryLocationId,
                    DeliveryLocationCode: $scope.DeliveryLocationCode,
                },
                Company: {
                    CompanyId: $scope.TempCompanyId,
                    CompanyMnemonic: $scope.TempCompanyMnemonic,
                    CompanyZone: $scope.CompanyZone,
                    Field9: $scope.CompanyZone
                },
                RuleType: 4,
                Item: {
                    SKUCode: productNameStr[0].ItemCode
                }

            };

            $scope.IsItemLayerAllow = false;
            var jsonLayerobject = {};
            jsonLayerobject.Json = requestLayerData;

            var GetResponsedataForLayerData = GrRequestService.ProcessRequest(jsonLayerobject);


            $q.all([
                GetResponsedataForLayerData

            ]).then(function (resp) {

                var responseForLayerData = resp[0];
                var responseItemLayerStr = responseForLayerData.data.Json;
                if (responseItemLayerStr.RuleValue != '' && responseItemLayerStr.RuleValue != undefined) {

                    if (responseItemLayerStr.RuleValue === '1') {
                        $scope.IsItemLayerAllow = true;

                    }
                    else {
                        $scope.IsItemLayerAllow = false;
                    }
                }


                var IsItemLayerFull = false;

                if (responseItemLayerStr.RuleValue === '1') {
                    if ((parseInt(associatedOrderProduct.ProductQuantity) % parseInt(associatedOrderProduct.QtyPerLayer)) > 0) {
                        IsItemLayerFull = false;
                    } else {
                        IsItemLayerFull = true;
                    }
                }
                else {
                    IsItemLayerFull = false;
                }

                var jsonOrderProduct = {
                    RowNumber: $scope.MOTOrderJson.length + 1,
                    ItemId: associatedOrderProduct.ItemId,
                    ItemCode: associatedOrderProduct.ProductCode,
                    ItemName: associatedOrderProduct.ItemName,
                    ItemType: 30,
                    Quantity: parseFloat(associatedOrderProduct.ProductQuantity),
                    UOM: associatedOrderProduct.UOM,
                    Allocation: 'NA',
                    ActualAllocation: 'NA',
                    ItemDeposit: parseFloat($scope.ItemDepositeAmount),
                    ExtraNumberOfPalletes: $scope.NumberOfExtraPalettes,
                    //IsItemLayer: responseStr.RuleValue,
                    IsItemLayerFull: IsItemLayerFull,
                    OrderId: associatedOrderProduct.OrderId,
                    IsValidItem: "1",
                    TruckSizeId: $scope.MOTOrderJson[0].TruckSizeId,
                    ShipTo: $scope.MOTOrderJson[0].ShipTo,
                    DeliveryLocationName: $scope.MOTOrderJson[0].DeliveryLocationName,
                    Capacity: $scope.MOTOrderJson[0].Capacity,
                    CompanyId: $scope.MOTOrderJson[0].CompanyId,
                    TruckCapacityWeight: $scope.MOTOrderJson[0].TruckCapacityWeight,
                    TruckCapacityPalettes: $scope.MOTOrderJson[0].TruckCapacityPalettes,
                    TruckCapacityWeight: $scope.MOTOrderJson[0].TruckCapacityWeight,
                    UnitOfMeasureName: associatedOrderProduct.UOM
                }
                //Changed by nimesh for multiple product on 31-10-2019
                var productNameMOTOrderJsonStr = $scope.MOTOrderJson.filter(function (el) { return el.ItemId === associatedOrderProduct.ItemId && el.OrderId === associatedOrderProduct.OrderId; });
                if (productNameMOTOrderJsonStr.length == 0) {
                    $scope.MOTOrderJson.push(jsonOrderProduct);
                }


                if ($scope.GratisOrderCurrentIndex < $scope.SelectedGratisOrderProduct.length) {
                    $scope.GratisOrderCurrentIndex = $scope.GratisOrderCurrentIndex + 1;
                    $scope.AddGratisOrderProduct();
                }


            });




        } catch (e) {

        }
    }




    //Changed by nimesh for multiple product on 20-09-2019
    $scope.RuleValidationForGratisOrder = function (itemId, qty, associatedOrderProduct, associatedCount) {

        try {

            $scope.showItembox = false;
            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId === itemId; });
            if (productNameStr.length > 0) {
                $scope.ItemPrices = productNameStr[0].Amount;
                $scope.UOM = productNameStr[0].UOM;
                $scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
                if (associatedCount === 0) {
                    $scope.ItemDepositeAmount = productNameStr[0].CurrentDeposit;
                } else {
                    $scope.ItemDepositeAmount = 0;
                }
            }
            else {
                $scope.ItemPrices = 0;
                $scope.ItemCodeForDeposite = '';
            }


            var requestLayerData =
            {
                ServicesAction: 'GetRuleValue',
                CompanyId: $scope.TempCompanyId,
                CompanyMnemonic: $scope.TempCompanyMnemonic,
                DeliveryLocation: {
                    LocationId: $scope.DeliveryLocationId,
                    DeliveryLocationCode: $scope.DeliveryLocationCode,
                },
                Company: {
                    CompanyId: $scope.TempCompanyId,
                    CompanyMnemonic: $scope.TempCompanyMnemonic,
                    CompanyZone: $scope.CompanyZone,
                    Field9: $scope.CompanyZone
                },
                RuleType: 4,
                Item: {
                    SKUCode: productNameStr[0].ItemCode
                }

            };

            $scope.IsItemLayerAllow = false;
            var jsonLayerobject = {};
            jsonLayerobject.Json = requestLayerData;

            var GetResponsedataForLayerData = GrRequestService.ProcessRequest(jsonLayerobject);


            $q.all([
                GetResponsedataForLayerData

            ]).then(function (resp) {

                var responseForLayerData = resp[0];
                var responseItemLayerStr = responseForLayerData.data.Json;
                if (responseItemLayerStr.RuleValue != '' && responseItemLayerStr.RuleValue != undefined) {

                    if (responseItemLayerStr.RuleValue === '1') {
                        $scope.IsItemLayerAllow = true;

                    }
                    else {
                        $scope.IsItemLayerAllow = false;
                    }
                }


                var IsItemLayerFull = false;

                if (responseItemLayerStr.RuleValue === '1') {
                    if ((parseInt(associatedOrderProduct.ProductQuantity) % parseInt(associatedOrderProduct.QtyPerLayer)) > 0) {
                        IsItemLayerFull = false;
                    } else {
                        IsItemLayerFull = true;
                    }
                }
                else {
                    IsItemLayerFull = false;
                }

                var jsonOrderProduct = {
                    RowNumber: $scope.MOTOrderJson.length + 1,
                    ItemId: associatedOrderProduct.ItemId,
                    ItemCode: associatedOrderProduct.ProductCode,
                    ItemName: associatedOrderProduct.ItemName,
                    ItemType: 30,
                    Quantity: parseFloat(associatedOrderProduct.ProductQuantity),
                    UOM: associatedOrderProduct.UOM,
                    Allocation: 'NA',
                    ActualAllocation: 'NA',
                    ItemDeposit: parseFloat($scope.ItemDepositeAmount),
                    ExtraNumberOfPalletes: $scope.NumberOfExtraPalettes,
                    //IsItemLayer: responseStr.RuleValue,
                    IsItemLayerFull: IsItemLayerFull,
                    OrderId: associatedOrderProduct.OrderId,
                    IsValidItem: "1",
                    TruckSizeId: $scope.MOTOrderJson[0].TruckSizeId,
                    ShipTo: $scope.MOTOrderJson[0].ShipTo,
                    DeliveryLocationName: $scope.MOTOrderJson[0].DeliveryLocationName,
                    Capacity: $scope.MOTOrderJson[0].Capacity,
                    CompanyId: $scope.MOTOrderJson[0].CompanyId,
                    TruckCapacityWeight: $scope.MOTOrderJson[0].TruckCapacityWeight,
                    TruckCapacityPalettes: $scope.MOTOrderJson[0].TruckCapacityPalettes,
                    TruckCapacityWeight: $scope.MOTOrderJson[0].TruckCapacityWeight,
                    UnitOfMeasureName: associatedOrderProduct.UOM
                }
                //Changed by nimesh for multiple product on 31-10-2019
                var productNameMOTOrderJsonStr = $scope.MOTOrderJson.filter(function (el) { return el.ItemId === associatedOrderProduct.ItemId && el.OrderId === associatedOrderProduct.OrderId; });
                if (productNameMOTOrderJsonStr.length == 0) {
                    $scope.MOTOrderJson.push(jsonOrderProduct);
                }


                if ($scope.GratisOrderCurrentIndex < $scope.SelectedGratisOrderProduct.length) {
                    $scope.GratisOrderCurrentIndex = $scope.GratisOrderCurrentIndex + 1;
                    $scope.AddGratisOrderProduct();
                }


            });




        } catch (e) {

        }
    }

    $scope.GratisOrderCurrentIndex = 0;
    $scope.SelectedGratisOrderProduct = [];
    //Changed by nimesh for multiple product on 31-10-2019
    $scope.AddGratisOrderProduct = function () {
        debugger;
        if ($scope.SelectedGratisOrderProduct.length > 0) {
            var gratisOrderProduct = $scope.SelectedGratisOrderProduct[$scope.GratisOrderCurrentIndex];
            $scope.RuleValidationForGratisOrder(gratisOrderProduct.ItemId, gratisOrderProduct.ProductQuantity, gratisOrderProduct, $scope.SelectedGratisOrderProduct.length);


        }

    }

    //Changed by nimesh for multiple product on 31-09-2019

    $scope.AddAssociatedOrder = function (orderId) {

        debugger;

        var associatedOrder = $scope.AssociatedOrderList.filter(function (el) { return el.OrderId === orderId; });
        if (associatedOrder.length > 0) {
            associatedOrder[0].IsSelected = true;

            $scope.GratisOrderCurrentIndex = 0;
            $scope.SelectedGratisOrderProduct = associatedOrder[0].OrderProductsList;


            if ($scope.Page === "UploadEnquiry") {
                for (var i = 0; i < associatedOrder[0].OrderProductsList.length; i++) {
                    //$scope.RuleValidationForGratisOrder(associatedOrder[0].OrderProductsList[i].ItemId, associatedOrder[0].OrderProductsList[i].ProductQuantity, associatedOrder[0].OrderProductsList, associatedOrder.length);
                    $scope.AddGartisProductInSelectedOrder(associatedOrder[0].OrderProductsList[i].ItemId, associatedOrder[0].OrderProductsList[i].ProductQuantity, orderId, $scope.SelectedGratisOrderProduct);
                }

            } else {
                $scope.AddGratisOrderProduct();
            }


            //for (var i = 0; i < associatedOrder[0].OrderProductsList.length; i++) {
            //  $scope.RuleValidationForGratisOrder(associatedOrder[0].OrderProductsList[i].ItemId, associatedOrder[0].OrderProductsList[i].ProductQuantity, associatedOrder[0].OrderProductsList, associatedOrder.length);
            //}

        }
        var associatedOrderAvl = $scope.AssociatedOrderList.filter(function (el) { return el.IsSelected === false; });
        if (associatedOrderAvl.length === 0) {
            $scope.CloseViewGratisOrderControl();
        }
    }




    $scope.sortableOptions = {
        stop: function (e, ui) {

            var xx = $scope.MOTOrderJson;
            // do something here
        }
    };


    $scope.RemoveSelectedAssociatedOrder = function () {
        var getSelectedAssociatedOrder = [];
        var totalorderamount = 0;
        var totaltaxamount = 0;
        var TotalDepositeAmount = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            for (var j = 0; j < $scope.OrderData[i].OrderProductList.length; j++) {
                if (parseInt($scope.OrderData[i].OrderProductList[j].EnquiryProductId) === 0) {
                    totalorderamount += parseFloat($scope.OrderData[i].OrderProductList[j].ItemPricesPerUnit) * parseFloat($scope.OrderData[i].OrderProductList[j].ProductQuantity);

                    TotalDepositeAmount += parseFloat($scope.OrderData[i].OrderProductList[j].ItemTotalDepositeAmount);
                }
                else {

                    if (parseInt($scope.OrderData[i].OrderProductList[j].EnquiryProductId) !== 0 && ($scope.OrderData[i].OrderProductList[j].IsActive === false || $scope.OrderData[i].OrderProductList[j].IsActive === 1 || $scope.OrderData[i].OrderProductList[j].IsActive === "1")) {
                        totalorderamount += parseFloat($scope.OrderData[i].OrderProductList[j].ItemPricesPerUnit) * parseFloat($scope.OrderData[i].OrderProductList[j].ProductQuantity);
                        TotalDepositeAmount += parseFloat($scope.OrderData[i].OrderProductList[j].ItemTotalDepositeAmount);
                    }
                }
                getSelectedAssociatedOrder.push(parseInt($scope.OrderData[i].OrderProductList[j].GratisOrderId));
            }
        }
        var getAssociatedCount = $scope.AssociatedOrderList;
        if (getSelectedAssociatedOrder.length > 0) {
            if (getAssociatedCount.length > 0) {
                for (var k = 0; k < getAssociatedCount.length; k++) {
                    if (getSelectedAssociatedOrder.includes(parseInt(getAssociatedCount[k].OrderId))) {
                        getAssociatedCount[k].IsSelected = true;
                    }
                    else {
                        getAssociatedCount[k].IsSelected = false;
                    }
                }
            }

        } else {
            for (var i = 0; i < getAssociatedCount.length; i++) {

                getAssociatedCount[i].IsSelected = false;
            }
        }


        totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);


        $scope.totalorderamount = parseFloat(totalorderamount) + parseFloat(totaltaxamount) + parseFloat(TotalDepositeAmount);

    }

    $ionicModal.fromTemplateUrl('ViewGratisOrder.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ViewGratisOrderControl = modal;
    });


    $scope.CloseViewGratisOrderControl = function () {
        $scope.ViewGratisOrderControl.hide();
    };

    $scope.OpenViewGratisOrderControl = function () {
        debugger;
        var someDate1 = new Date();
        var lastdate = new Date(someDate1.getFullYear(), someDate1.getMonth() + 1, 0);
        var currentDateList = $filter('date')(someDate1, "dd/MM/yyyy 00:00:00");
        var dateTemp = "";
        dateTemp = currentDateList.split(" ");
        var dateformatTemp = dateTemp[0].split('/');

        var someDate = new Date(dateformatTemp[2], dateformatTemp[1] - 1, dateformatTemp[0]);
        someDate.setDate(someDate.getDate());
        var dd = someDate.getDate();
        var mm = someDate.getMonth() + 1;
        var y = someDate.getFullYear();

        var someFormattedDate = dd + '/' + mm + '/' + y + ' 00:00:00';

        var lastdateList = $filter('date')(lastdate, "dd/MM/yyyy 00:00:00");
        var lastdateTemp = "";
        lastdateTemp = lastdateList.split(" ");
        var lastdateformatTemp = lastdateTemp[0].split('/');

        var somelastDate = new Date(lastdateformatTemp[2], lastdateformatTemp[1] - 1, lastdateformatTemp[0]);
        somelastDate.setDate(somelastDate.getDate() - $scope.BlockGratisLastDays);
        var lastdd = somelastDate.getDate();
        var lastmm = somelastDate.getMonth() + 1;
        var lasty = somelastDate.getFullYear();

        var someFormattedlastDate = lastdd + '/' + lastmm + '/' + lasty + ' 00:00:00';
        if (someFormattedDate <= someFormattedlastDate) {

            if ($scope.AssociatedOrderList.length > 0) {
                $scope.ViewGratisOrderControl.show();
            }
            else {
                $rootScope.ValidationErrorAlert('No gratis order found.', 'error', 3000);
            }
        } else {

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_BlockGratisErrorMessage, $scope.BlockGratisLastDays), 'error', 8000);
        }

    };


    $scope.OpenViewGratisOrderControlInRepeater = function (guid) {

        if ($scope.AssociatedOrderList.length > 0) {
            $scope.CurrentGrtaisOrderGUID = guid;
            $scope.ViewGratisOrderControl.show();

        }
        else {
            $rootScope.ValidationErrorAlert('No gratis order found.', 'error', 3000);
        }

    };







    $scope.LoadGratisOrder = function (deliveryLocationId, companyId) {


        var requestData =
        {
            ServicesAction: 'LoadGratisOrderBySoldToId',
            CompanyId: companyId,
            ShipTo: deliveryLocationId
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var responseStr = response.data;
            if (responseStr.Order !== undefined) {
                if (responseStr.Order.OrderList !== '') {
                    $scope.AssociatedOrderList = responseStr.Order.OrderList;

                    angular.forEach($scope.AssociatedOrderList, function (item, key) {
                        item.IsSelected = false;
                    });

                }
            }

        });

    }




    $scope.LoadCreditAndAvailableLimit = function (companyId, companyMnemonic) {

        $rootScope.Throbber.Visible = true;

        $scope.IsCreditLimitInNegative = false;
        if ($rootScope.TempEnquiryDetailId === undefined) {
            $rootScope.TempEnquiryDetailId = 0;
        }


        if ($rootScope.TempEnquiryDetailId === 0) {



            console.log('credit limit function');


            var requestData =
            {
                ServicesAction: 'LoadAvailableCreditLimitOfCustomer',
                CompanyId: companyId,
                CompanyMnemonic: companyMnemonic
            };


            jsonobject = {};
            jsonobject.Json = requestData;
            var LoadAvailableCreditLimitOfCustomer = GrRequestService.ProcessRequest(jsonobject);

            $q.all([

                LoadAvailableCreditLimitOfCustomer
            ]).then(function (resp) {


                var responseForLoadAvailableCreditLimitOfCustomer = resp[0];


                if (responseForLoadAvailableCreditLimitOfCustomer.data !== null) {
                    if (responseForLoadAvailableCreditLimitOfCustomer.data.Json != undefined || responseForLoadAvailableCreditLimitOfCustomer.data.Json != null) {
                        var resoponsedata = responseForLoadAvailableCreditLimitOfCustomer.data.Json;
                        $scope.CreditLimit = resoponsedata.CreditLimit;
                        $scope.AvailableCreditLimit = resoponsedata.AvailableCreditLimit;
                        $scope.EmptiesLimit = resoponsedata.EmptiesLimit;
                        $scope.ActualEmpties = resoponsedata.ActualEmpties;


                        $scope.AvailableCreditLimit = Number($scope.AvailableCreditLimit) - Number(resoponsedata.TotalEnquiryCreated);
                        $scope.AvailableCreditLimit = Number($scope.AvailableCreditLimit) - Number(resoponsedata.EnquiryTotalDepositAmount);


                    } else {
                        $scope.AvailableCreditLimit = 0;

                    }
                } else {
                    $scope.AvailableCreditLimit = 0;

                }


                if ($scope.AvailableCreditLimit >= 0) {
                    $scope.IsCreditLimitInNegative = false;
                } else {
                    $scope.IsCreditLimitInNegative = true;
                }


                if ($scope.Page !== "UploadEnquiry") {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_MOTOrder_FileUploadSucessMessage), '', 3000);
                } else {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_EnquiryUploadOrder_FileUploadSucessMessage), '', 3000);
                }


                $rootScope.Throbber.Visible = false;


            });


        }
        else {

            $rootScope.Throbber.Visible = false;
        }


    }




    $scope.FeedbackVariable = {
        OverAll: true,
        Specific: false
    }


    setTimeout(function () {



        pluginsService.init();
    }, 200);



    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.modalpopup = modal;
    });

    $scope.OpenModalpopup = function () {


        $scope.modalpopup.show();
    }

    $scope.CloseModalpopup = function () {
        $scope.modalpopup.hide();
    }



    $ionicModal.fromTemplateUrl('templates/reasoncodepopup.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.reasoncodepopup = modal;
    });

    $scope.OpenReasoncodepopup = function () {


        //$scope.reasoncodepopup.show();
    }

    $scope.ClosReasoncodepopup = function () {
        //$scope.reasoncodepopup.hide();
    }







    $scope.getTotalPalettes = function (palettes, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {


        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {


            if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
                total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            }

            //if (currentOrder[0].OrderProductList[i].ItemId !== itemId && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
            //    total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            //}
            //else if (currentOrder[0].OrderProductList[i].ItemId === itemId && parseInt(currentOrder[0].OrderProductList[i].ItemType) !== parseInt(ItemType) && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
            //    total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            //}
            //else if (parseInt(currentOrder[0].OrderProductList[i].GratisOrderId) !== 0 && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
            //    if (parseInt(currentOrder[0].OrderProductList[i].GratisOrderId) !== parseInt(GratisOrderId)) {
            //        total += parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
            //    }
            //}
        }

        //if (!$scope.IsItemEdit) {
        if (parseFloat(quantity) > 0) {
            total += parseFloat(quantity) / parseFloat(palettes);
        }
        //}






        if ($scope.TruckCapacityPalettes == 0) {
            total = 0;
        }

        if (!$scope.IsPalettesRequired) {
            total = 0;
        }


        return total;
    }


    $scope.AddExtraPalleter = function (currentOrder, enquiryProductGuid, ConversionFactor, qty, PrimaryUnitOfMeasure) {



        var TotalPalettes = 0;
        if (currentOrder.length > 0) {
            var newArr = [];
            var productList = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode && el.EnquiryProductGUID !== enquiryProductGuid; });
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





    // Change By : Arun Dubey 
    // Change Date : 18/09/2019
    // add changes in function for one special keg item to add extra pallets as per rules.

    $scope.getTotalExtraPalettes = function (palettes, quantity, currentOrder, itemId, NumberOfExtraPalettes, ItemType, enquiryProductGuid) {

        var total = 0;
        for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {

            if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid && currentOrder[0].OrderProductList[i].ProductCode !== $scope.WoodenPalletCode && currentOrder[0].OrderProductList[i].NumberOfExtraPalettes > 0) {
                var totalPalets = parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);
                //total += (Math.ceil(totalPalets) / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
                //total += (totalPalets / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);

                if (parseFloat(currentOrder[0].OrderProductList[i].NumberOfExtraPalettes) > 0) {
                    var numberofpallet = (totalPalets / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
                    var usedPalletSpace = numberofpallet * (parseFloat(currentOrder[0].OrderProductList[i].NumberOfExtraPalettes) - 1);
                    total += usedPalletSpace;
                } else {
                    total += (totalPalets / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
                }

            }

            //if (currentOrder[0].OrderProductList[i].ItemId !== itemId && parseInt(currentOrder[0].OrderProductList[i].ItemType) !== parseInt(ItemType) && currentOrder[0].OrderProductList[i].NumberOfExtraPalettes > 0) {
            //    var totalPalets = parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);

            //    total += (Math.ceil(totalPalets) / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
            //}
            //else {
            //    if (parseInt(ItemType) === 32) {
            //        if (currentOrder[0].OrderProductList[i].ItemId !== itemId && currentOrder[0].OrderProductList[i].NumberOfExtraPalettes > 0) {
            //            var totalPalets = parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity) / parseFloat(currentOrder[0].OrderProductList[i].ConversionFactor);

            //            total += (Math.ceil(totalPalets) / currentOrder[0].OrderProductList[i].NumberOfExtraPalettes);
            //        }
            //    }
            //}
        }

        //if (!$scope.IsItemEdit) {

        if (NumberOfExtraPalettes > 0) {
            if (parseFloat(quantity) > 0) {
                var totalPalets = parseFloat(quantity) / parseFloat(palettes);

                //total += (Math.ceil(totalPalets) / NumberOfExtraPalettes);
                total += (totalPalets / NumberOfExtraPalettes);
            }

            total = total * (NumberOfExtraPalettes - 1);
        }

        //}







        //total = total > 1 ? total : 0;



        if ($scope.TruckCapacityPalettes == 0) {
            total = -1;
        }


        if (!$scope.IsPalettesRequired) {
            total = 0;
        }


        return total;
    }


    ///3
    // Checking For Number Of ExtraPalettes
    $scope.GetExtraPalettes = function (deliveryLocationId, companyId, uom) {
        var requestData =
        {
            ServicesAction: 'GetRuleValue',
            CompanyId: companyId,
            DeliveryLocation: {
                LocationId: deliveryLocationId,
            },
            Company: {
                CompanyId: companyId,
            },
            RuleType: 3,
            Item: {
                UOM: uom
            }
        };
        $scope.NumberOfExtraPalettes = 0;
        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {


            var responseStr = response.data.Json;

            if (responseStr.RuleValue !== '' || responseStr.RuleValue !== undefined) {
                $scope.NumberOfExtraPalettes = parseInt(responseStr.RuleValue);
                if ($scope.NumberOfExtraPalettes > 0) {
                    $scope.NumberOfExtraPalettes = $scope.NumberOfExtraPalettes;
                }
            }
        });
    }



    $scope.GetPalletesBinding = function (DeliveryLocationId, TempCompanyId, DeliveryArea, TruckCapacityInTone) {


    }
    function between(x, min, max) {

        return x >= min && x <= max;
    }


    $scope.getTotalAmount = function (weight, quantity, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid) {


        var total = 0;
        if (currentOrder.length > 0) {
            for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {

                if (currentOrder[0].OrderProductList[i].EnquiryProductGUID !== enquiryProductGuid) {
                    total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
                }

                //if (currentOrder[0].OrderProductList[i].ItemId !== itemId) {
                //    total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
                //}
                //else if (currentOrder[0].OrderProductList[i].ItemId === itemId && parseInt(currentOrder[0].OrderProductList[i].ItemType) !== parseInt(ItemType)) {
                //    total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
                //}
                //else if (parseInt(currentOrder[0].OrderProductList[i].GratisOrderId) !== 0) {
                //    if (parseInt(currentOrder[0].OrderProductList[i].GratisOrderId) !== parseInt(GratisOrderId)) {
                //        total += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
                //    }
                //}
            }

            total += parseFloat(weight) * parseFloat(quantity);
        }
        return total;
    }










    $ionicModal.fromTemplateUrl('templates/RPMQuantity.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.RPMQuantitypopup = modal;
    });

    $scope.OpenRPMQuantitypopup = function () {


        $scope.RPMQuantitypopup.show();
    }

    $scope.CloseRPMQuantitypopup = function () {

        $scope.RPMQuantitypopup.hide();
    }




    $ionicModal.fromTemplateUrl('templates/AddFeedback.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.AddFeedbackpopup = modal;
    });

    $scope.OpenAddFeedbackpopup = function () {


        $scope.AddFeedbackpopup.show();
    }

    $scope.CloseAddFeedbackpopup = function () {

        $scope.AddFeedbackpopup.hide();
    }

    $scope.setoverall = function () {
        $scope.FeedbackVariable.OverAll = true;
        $scope.FeedbackVariable.Specific = false;
    }

    $scope.setspecific = function () {
        $scope.FeedbackVariable.Specific = true;
        $scope.FeedbackVariable.OverAll = false;
    }

    $scope.shiptodata = "";
    $scope.ReceivingLocationCapacity = '-';
    $scope.setreceivingcapacity = function () {

        $scope.ReceivingLocationCapacity = 60;
    }


    $scope.AddWoodenPallet = function () {

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {

            var qty = currentOrder[0].NumberOfPalettes;

            var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemCode === $scope.WoodenPalletCode; });
            var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode & parseInt(el.GratisOrderId) === 0; });

            // Change By : Arun Dubey 
            // Change Date : 18/09/2019
            // added this condition to check if function return true value then added one extra pallet.

            if ($scope.AddOneExtraPalletForSpecificTruckSizesAndSameUOM() === true) {
                qty = qty + 1;
            }


            if (productNameStrupdate.length > 0) {
                productNameStrupdate[0].ProductQuantity = parseInt(qty);
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
                    IsPackingItem: "1",
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


    $scope.RemoveInquiryItem = function (OrderGUID, ItemId, GratisOrderId) {



        if ($scope.IsItemEdit === true & $scope.ItemId === ItemId) {
            $rootScope.ValidationErrorAlert('You cannot delete this item in edit mode.', 'error', 3000);
            return false;
        }

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
        currentOrder[0].IsTruckFull = false;
        if (parseInt(GratisOrderId) > 0) {

            $scope.RemoveGratisOrderOrderGUID = OrderGUID;
            $scope.RemoveGratisOrderGratisOrderId = GratisOrderId;

            $scope.RemoveGratisOrderHeaderMessage = "Message";
            $scope.RemoveGratisOrderBodymessage = "This is a Gratis order item. If you wish to remove this item from the order, entire Gratis order will be removed. Do you wish to proceed ?";
            $scope.OpenRemoveGratisOrderControl();


        }
        else {
            $scope.findAndRemove(currentOrder[0].OrderProductList, 'ItemId', ItemId, 'EnquiryProductId');

            $scope.YesRemoveFocItems(currentOrder, ItemId);

            if (currentOrder[0].OrderProductList.length === 1) {
                if (currentOrder[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                    currentOrder[0].OrderProductList = [];
                }

            }
        }


        $scope.ReloadGraph(currentOrder, 0);
        $scope.CalculateDeliveryUsedCapacity();
        $scope.RemoveSelectedAssociatedOrder();
    }







    $scope.CalculateDeliveryUsedCapacity = function () {

        var tempNumberOfPalettes = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            tempNumberOfPalettes += $scope.OrderData[i].NumberOfPalettes;
        }
        $scope.tempDeliveryUsedCapacity = tempNumberOfPalettes;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity) > $scope.DeliveryLocationCapacity) {

            var usedPalettesCapacity = parseInt($scope.tempDeliveryUsedCapacity + $scope.DeliveryUsedCapacity);


            if (currentOrder.length > 0) {
                currentOrder[0].IsRecievingLocationCapacityExceed = true;

                if (currentOrder[0].OrderProductList.length === 0) {

                    $rootScope.ValidationErrorAlert('The receiving capacity has been fully consumed.', 'warning', 10000);
                }
                else {
                    $rootScope.ValidationErrorAlert('The receiving capacity for the delivery location is only ' + parseInt($scope.DeliveryLocationCapacity) + ' pallets while you are trying order ' + usedPalettesCapacity + ' paletts. Please modify you order and try again.', 'warning', 10000);
                }

            }





        }
        else {
            if (currentOrder.length > 0) {
                currentOrder[0].IsRecievingLocationCapacityExceed = false;
            }
        }

        $scope.RemoveSelectedAssociatedOrder();
    }


    $scope.TruckExtraBufferWeight = function () {

        var extraTruckBufferWeight = 0;
        if ($scope.TruckExceedBufferWeight != 0 && $scope.TruckExceedBufferWeight != "0") {
            extraTruckBufferWeight = parseFloat($scope.TruckCapacity * (parseFloat($scope.TruckExceedBufferWeight) / 100));
        }
        return extraTruckBufferWeight;
    }

    $scope.TruckExtraBufferPallet = function () {


        var extraPaletteBufferWeight = 0;
        if ($scope.PalettesExceedBufferWeight != 0 && $scope.PalettesExceedBufferWeight != "0") {
            extraPaletteBufferWeight = parseFloat($scope.PalettesExceedBufferWeight);
        }
        return extraPaletteBufferWeight;
    }


    $scope.CheckForQty = function (itemId, ItemType, qty, productNameStr) {

        var QtyArray = [];
        QtyArray.push(qty);

        var totalWeight = parseFloat(productNameStr[0].WeightPerUnit) * parseFloat(qty);
        var truckTotalPalettes = parseFloat(qty) / parseFloat(productNameStr[0].ConversionFactor);
        var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
        var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();
        var truckTotalExtraPalettes = 0;
        var numbersofpalettes = 0
        if ($scope.NumberOfExtraPalettes > 0) {
            truckTotalExtraPalettes = (truckTotalPalettes / $scope.NumberOfExtraPalettes);
        }
        var totalNumberOfPalettes = 0;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {

            var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');
            var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
            var truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);
            var numbersofpalettes = truckTotalPalettes;

            numbersofpalettes = $scope.TruckCapacityPalettes - numbersofpalettes;

            var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemId) === parseInt(itemId) & parseInt(el.ItemType) === parseInt(ItemType) & parseInt(el.GratisOrderId) === 0; });

            var enquiryProductGuid = '';
            if (productNameStrupdate.length > 0) {
                enquiryProductGuid = productNameStrupdate[0].EnquiryProductGUID;
            }
            totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);
        }

        var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
        if (palettesWeight.length > 0) {
            var totalWeightWithPalettes = 0;
            var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
            if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(numbersofpalettes)));
            }

            totalWeight = totalWeight + totalWeightWithPalettes
        }

        truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);


        var truckCapacity = $scope.TruckCapacity;
        var truckCapacityPalettes = $scope.TruckCapacityPalettes;

        var consumepalettes = $scope.PalettesCorrectWeight;
        var consumeWeigth = $scope.TruckCapacityFullInTone;

        var avlPalletQty = 0;

        if ($scope.TruckCapacityPalettes != null) {
            if ($scope.NumberOfExtraPalettes > 0) {
                //avlPalletQty = (((parseFloat(numbersofpalettes) * $scope.NumberOfExtraPalettes) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor)));
                // avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes)) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor))) * $scope.NumberOfExtraPalettes;
                avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor))) * $scope.NumberOfExtraPalettes;

            }
            else {
                //avlPalletQty = ((parseFloat($scope.TruckCapacityPalettes) - parseFloat($scope.PalettesCorrectWeight)) * parseFloat(productNameStr[0].ConversionFactor));
                avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * parseFloat(productNameStr[0].ConversionFactor));

            }
        }


        var avlPalletWeight = parseFloat(avlPalletQty) / parseFloat(productNameStr[0].ConversionFactor);
        if (palettesWeight.length > 0) {
            var totalWeightWithPalettes = 0;
            var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
            if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {

                if ($scope.NumberOfExtraPalettes > 0) {
                    totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(numbersofpalettes * $scope.NumberOfExtraPalettes)));
                }
                else {

                    totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(numbersofpalettes)));
                }
            }



            avlPalletWeight = totalWeightWithPalettes;


        }



        var pendingweight = (parseFloat($scope.TruckCapacity) - (parseFloat(consumeWeigth * 1000) + parseFloat(avlPalletWeight)));

        //var avlWeightQty = parseFloat(pendingweight) / parseFloat(productNameStr[0].WeightPerUnit);
        var avlWeightQty = parseFloat(parseFloat(pendingweight)) / parseFloat(productNameStr[0].WeightPerUnit);

        QtyArray.push(parseInt(avlWeightQty));
        if ($scope.TruckCapacityPalettes != null) {
            QtyArray.push(parseInt(avlPalletQty));
        }

        var min = Math.min.apply(Math, QtyArray);
        var validQty = min;

        if (parseInt(productNameStr[0].QtyPerLayer) > 0) {

            var g = parseInt((parseInt(min) / parseInt(productNameStr[0].QtyPerLayer)));
            $scope.IsItemLayerCheckQty = parseInt(g) * parseInt(productNameStr[0].QtyPerLayer);
            var validQty = $scope.IsItemLayerCheckQty;

        }
        return validQty;

    }



    $scope.CheckForNewQty = function (itemId, ItemType, qty, productNameStr) {
        debugger;
        var QtyArraynew = [];
        QtyArraynew.push(qty);
        var truckfullintonr = $scope.TruckCapacityFullInTone;
        var palletsCorrcerwght = $scope.PalettesCorrectWeight;
        var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
        var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();
        var palettesWeight = $scope.LoadSettingInfoByName('PalettesWeight', 'float');
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        var editedItemQuantity = 0;

        if ($scope.IsItemEdit) {
            var item = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemId) === parseInt(itemId); });
            editedItemQuantity = item[0].ProductQuantity;
        }

        var avlPalletQty = 0;
        var pendingweight = 0;
        if ($scope.IsPalletLoadCheckValidation === true) {
            if ($scope.NumberOfExtraPalettes > 0) {
                //avlPalletQty = (((parseFloat(numbersofpalettes) * $scope.NumberOfExtraPalettes) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor)));
                avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * (parseFloat(productNameStr[0].ConversionFactor))) * $scope.NumberOfExtraPalettes;

            }
            else {
                avlPalletQty = (((parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) - parseFloat($scope.PalettesCorrectWeight)) * parseFloat(productNameStr[0].ConversionFactor));

            }

            var avlPallet = parseInt($scope.TruckCapacityPalettes) - (Math.ceil(palletsCorrcerwght));

            //var checkKegQtyOnePallets = parseFloat(productNameStr[0].ConversionFactor) * 2;
            //var checkKegWeightPerPallet = (parseFloat(checkKegQtyOnePallets) * parseFloat(productNameStr[0].WeightPerUnit)) + (palettesWeight * 2);


        }


        var avlPalletWeight = 0;
        if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
            avlPalletWeight = (palettesWeight * (Math.ceil(avlPallet)));
        }

        debugger;
        //var avlPalletBufferWeight = (palettesWeight * parseFloat(extraPaletteBufferWeight));
        //avlPalletWeight = avlPalletWeight - avlPalletBufferWeight;
        if ($scope.NumberOfExtraPalettes > 0) {
            //only for Keg
            pendingweight = ((parseFloat($scope.TruckCapacity)) - (parseFloat(truckfullintonr * 1000) + parseFloat(avlPalletWeight * $scope.NumberOfExtraPalettes)));
        }
        else {
            pendingweight = ((parseFloat($scope.TruckCapacity)) - (parseFloat(truckfullintonr * 1000) + parseFloat(avlPalletWeight)));

        }
        if ($scope.IsWeightLoadCheckValidation === true) {
            var avlWeightQty = parseFloat(parseFloat(pendingweight) + parseFloat(extraTruckBufferWeight)) / parseFloat(productNameStr[0].WeightPerUnit);
            QtyArraynew.push(parseInt(avlWeightQty));
        }


        if ($scope.IsPalletLoadCheckValidation === true) {
            QtyArraynew.push(parseInt(avlPalletQty));
        }

        var min = Math.min.apply(Math, QtyArraynew);

        min = parseInt(min) + parseInt(editedItemQuantity);

        if (ItemType == 30) {
            validQty = min;
        }
        else {
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
        }


        return validQty;
    }











    $scope.CheckBeforeAddingPromationItem = function (itemCode, itemId, qty, ItemType, productNameStr, enquiryProductGuid, GratisOrderId) {

        var chkvalid = true;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {

            if (!$scope.IsItemEdit) {
                enquiryProductGuid = '';
            }
            var promotionItem = $scope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
            if (promotionItem.length === 0) {
                $scope.Allocation = 'NA';
                $scope.ActualAllocation = 'NA';
            }
            for (var i = 0; i < promotionItem.length; i++) {
                var ItemQuanity = promotionItem[i].ItemQuanity;
                var FocItemId = promotionItem[i].FocItemId;
                var FocItemQuantity = promotionItem[i].FocItemQuantity;


                if ((parseInt(qty) % parseFloat(ItemQuanity)) === 0) {

                    var totalNumberCanOrderFocItem = (parseInt(qty) / parseFloat(ItemQuanity));
                    var totalAmountOfQty = parseInt(FocItemQuantity) * totalNumberCanOrderFocItem;
                    qty = qty + totalAmountOfQty;
                }
            }
            var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);

            var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);

            var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, $scope.NumberOfExtraPalettes, ItemType, enquiryProductGuid);


            var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'TruckBufferWeightForMOT'; });

            if (truckBufferWeight.length > 0) {
                var bufferWeight = parseFloat(truckBufferWeight[0].SettingValue);
                totalWeightWithBuffer = (parseFloat($scope.TruckCapacity) - (bufferWeight * 1000));
            }

            var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
            if (palettesWeight.length > 0) {
                var totalWeightWithPalettes = 0;
                var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
                if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                    totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(truckTotalPalettes)));
                }

                totalWeight = totalWeight + totalWeightWithPalettes
            }

            debugger;
            truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);
            truckTotalPalettes = parseFloat(truckTotalPalettes).toFixed(1)
            //parseFloat(totalWeight / 1000).toFixed(2)
            var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
            var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();
            if (parseFloat(parseFloat($scope.TruckCapacity)) < totalWeight) {
                $rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($scope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);
                //alert('msg2');

                chkvalid = false;

            } else if (parseFloat(parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $scope.IsPalettesRequired === true && $scope.IsPalletLoadCheckValidation === true) {

                //var truckcapcityintons = parseInt(parseInt($scope.TruckCapacity) / 1000);
                //$rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $scope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);
                chkvalid = false;
            }

        }
        return chkvalid;
    }



    $scope.CheckAllocation = function (Allocation, quantity, currentOrder, itemId) {

        var allowAllocatio = false;
        var total = 0;




        //if (!$scope.IsItemEdit) {
        total += parseFloat(quantity);
        //}


        if (Allocation >= total) {
            allowAllocatio = true;
        }

        if (Allocation == 'NA') {
            allowAllocatio = true;
        }
        return allowAllocatio;
    }




    $scope.AddPromationItem = function (itemCode, ItemId, qty, ItemType, consumeQty) {

        var addPromation = false;
        if (parseInt(ItemType) !== 31) {

            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
            if (currentOrder.length > 0) {

                var promotionItem = $scope.PromotionItemList.filter(function (el) { return el.ItemCode === itemCode; });
                if (promotionItem.length === 0) {
                    $scope.Allocation = 'NA';
                    $scope.ActualAllocation = 'NA';
                }
                for (var i = 0; i < promotionItem.length; i++) {
                    var ItemQuanity = promotionItem[i].ItemQuanity;
                    var FocItemId = promotionItem[i].FocItemId;
                    var FocItemQuantity = promotionItem[i].FocItemQuantity;


                    if ((parseInt(qty) % parseFloat(ItemQuanity)) === 0) {
                        //if (parseFloat(qty) === parseFloat(ItemQuanity)) {
                        addPromation = true;
                        //$scope.CloseAddTruckControl();
                        var totalNumberCanOrderFocItem = (parseInt(qty) / parseFloat(ItemQuanity));
                        var totalAmountOfQty = parseInt(FocItemQuantity) * totalNumberCanOrderFocItem;

                        $scope.addProducts(FocItemId, totalAmountOfQty, 0, 31, ItemId, itemCode, consumeQty);
                        $scope.IsPromotion = true;
                        $scope.Allocation = 'NA';
                        $scope.ActualAllocation = 'NA';
                        break;
                        //}
                    }
                    else {
                        $scope.YesRemoveFocItems(currentOrder, ItemId);
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

            //var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 32 && el.ProductCode !== $scope.WoodenPalletCode; });
            //if (productNameStrupdate.length > (parseInt($scope.NumberOfProductAdd) - 1)) {
            //    $scope.PalettesCorrectWeight = 0;
            //}
            //else {
            $scope.PalettesCorrectWeight = parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes);
            //}

            totalpalettesWeight = Math.ceil(parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes));



            var totaltruckWeight = 0;
            for (var i = 0; i < currentOrder[0].OrderProductList.length; i++) {
                totaltruckWeight += parseFloat(currentOrder[0].OrderProductList[i].WeightPerUnit) * parseFloat(currentOrder[0].OrderProductList[i].ProductQuantity);
            }





            var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, '', 0, 0, '');

            var totalWeightWithPalettes = 0;
            var palettesWeight1 = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
            if (palettesWeight1.length > 0) {
                var weightPerPalettes = parseFloat(palettesWeight1[0].SettingValue);
                if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                    totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes));
                }
                totaltruckWeight = totaltruckWeight + totalWeightWithPalettes
            }



            var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
            var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();

            $scope.ReloadGraph(currentOrder, 0);

            if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {

                //if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= truckSize) || parseInt(palettesWeight) === Math.ceil(totalpalettesWeight)) {
                //var pallet = between(parseFloat($scope.PalettesCorrectWeight), (parseFloat(palettesWeight) - parseFloat($scope.PalettesBufferWeight)), parseFloat(palettesWeight));
                var pallet = between(parseFloat($scope.PalettesCorrectWeight), (parseFloat(palettesWeight) - parseFloat($scope.PalettesBufferWeight)), parseFloat(parseFloat(palettesWeight) + parseFloat(extraPaletteBufferWeight)));

                if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight)) || pallet) {
                    //    //$scope.RemoveKegePalleter(currentOrder);

                    isFull = true;
                }

            }
            else if ($scope.IsWeightLoadCheckValidation === true) {

                if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight))) {
                    //$scope.RemoveKegePalleter(currentOrder);

                    isFull = true;
                }
            } else {
                isFull = true;
            }

        } else {

            isFull = true;

        }

        return isFull;
    }




    $scope.ClearItemRecord = function () {
        //$scope.ordermanagement.itemsName = "";
        //$scope.ordermanagement.inputItemsQty = "";
        //$scope.$broadcast('angucomplete-alt:clearInput');
        $scope.selectedRow = -1;
        //$scope.predicates.InputItem = "";
        //$scope.predicates.FilterAutoCompletebox = "";
        $scope.EnquiryProductGUID = "";
        $scope.disableInput = false;
        $scope.ItemPrices = 0;
        //$scope.Allocation = 0;
        $scope.UOM = '-';
        $scope.IsItemEdit = false;
        //$scope.IsItemLayerAllow = false;
        $scope.CalculateDeliveryUsedCapacity();

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


    $scope.getItemPrice = function (e) {

        try {



            var itemId = e.ItemId;
            var ItemPrices = e.Amount;

            var productNameStr = $scope.bindallproduct.filter(function (el) { return parseInt(el.ItemId) === itemId; });
            if (productNameStr.length > 0) {
                $scope.ItemPrices = productNameStr[0].Amount;
                $scope.UOM = productNameStr[0].UOM;
                $scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
            }
            else {
                $scope.ItemPrices = 0;
                $scope.ItemCodeForDeposite = '';
            }

            $scope.Allocation = e.Allocation;
            $scope.ActualAllocation = e.ActualAllocation;


            if (e.ItemDeposit != "") {
                $scope.ItemDepositeAmount = parseFloat(e.ItemDeposit);

            } else {
                $scope.ItemDepositeAmount = 0;
            }
            if (e.ExtraNumberOfPalletes != "") {
                $scope.NumberOfExtraPalettes = parseInt(e.ExtraNumberOfPalletes);
            }
            else {
                $scope.NumberOfExtraPalettes = 0;
            }

            if ($scope.NumberOfExtraPalettes > 0) {
                $scope.NumberOfExtraPalettes = $scope.NumberOfExtraPalettes;
            }


            if (e.IsItemLayer === "1") {
                $scope.IsItemLayerAllow = true;
            }
            else {
                $scope.IsItemLayerAllow = false;
            }

            var count = 1;
            for (var t = 0; t < count; t++) {

                var gratisOrderId = 0;
                if (e.OrderId != undefined && e.OrderId != "0" && e.OrderId != 0) {
                    gratisOrderId = e.OrderId;
                }

                var consumeQty = $scope.addProducts(e.ItemId, e.Quantity, gratisOrderId, e.ItemType, 0, '', e.ConsumeQty);

                if (consumeQty == 0) {
                    break;

                }


                e.ConsumeQty = parseFloat(parseFloat(e.ConsumeQty) + parseFloat(consumeQty));


                if (e.ConsumeQty == 0) {
                    t = 0;
                }

                else {
                    var istrue = true;
                    if (parseInt(e.QtyPerLayer) > 0) {
                        //if ($scope.IsItemLayerAllow) {
                        if (parseInt(e.Quantity - e.ConsumeQty) > e.QtyPerLayer) {
                            istrue = true;
                        } else {
                            var g = (parseInt(e.Quantity - e.ConsumeQty) % parseInt(e.QtyPerLayer));
                            if (g > 0) {
                                istrue = false;
                            } else {
                                istrue = true;







                            }
                        }

                        //}

                    }

                    if (e.Quantity > e.ConsumeQty) {
                        if (istrue === true) {
                            t = -1;
                        } else {
                            t = 0;
                        }

                    } else {
                        t = 0;
                    }
                }

            }




        } catch (e) {

        }
    }

    $scope.SingleAsDraftInquiry = function (orderGUID) {

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === orderGUID; });
        $scope.SaveSingleInquiry(8, currentOrder, orderGUID);
    }


    $scope.ClearGraph = function () {
        angular.forEach($scope.buindingPalettes, function (item, key) {

            item.PalettesWidth = 0;

        });
        $scope.TruckCapacityFullInTone = 0;
        $scope.TruckCapacityFullInPercentage = 0;
    }
    $scope.LoadAllEnquiriesTotalAmountAndCheckTruckIsFull = function () {
        debugger;
        $scope.AllEnquiryTotalAmount = 0;
        $scope.IsAllTruckFull = false;
        var isTrue = true;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            if ($scope.OrderData[i].EnquiryType == "SO") {
                $scope.AllEnquiryTotalAmount = parseFloat($scope.AllEnquiryTotalAmount) + parseFloat($scope.OrderData[i].EnquiryGrandTotalAmount);
            }
            if ($scope.OrderData[i].IsTruckFull === false) {
                isTrue = false;
            }
        }
        $scope.IsAllTruckFull = isTrue;
    }

    $scope.AddTruck = function () {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
        if (currentOrder.length > 0) {
            currentOrder[0].IsTruckFull = true;
        }
        $scope.ClearGraph();
        //$scope.AddTruckControl.hide();
        $scope.AddDefaultTruck();
        //$scope.addProducts($scope.trmpProductId);
        $scope.trmpProductId = 0;
    }



    $scope.addProducts = function (itemId, qty, GratisOrderId, ItemType, ParentItemId, ParentProductCode, consumeQty) {
        debugger;

        if (qty === "" || qty === undefined || qty === null) {
            $rootScope.ValidationErrorAlert('Please enter a valid quantity.', 'error', 3000);
            return false;
        }

        if (parseInt(qty) < 1) {
            $rootScope.ValidationErrorAlert('Please enter a valid quantity.', 'error', 3000);
            return false;
        }
        // $scope.ordermanagement.inputItemsQty
        var productNameStr = $scope.bindallproduct.filter(function (el) { return parseInt(el.ItemId) === parseInt(itemId); });

        var remainQty = parseFloat(qty) - parseFloat(consumeQty);

        var checkPromotionItem = [];
        //var checkPromotionItem = $scope.PromotionItemList.filter(function (el) { return el.ItemCode === productNameStr[0].ItemCode; });


        var validQty = $scope.CheckForNewQty(itemId, ItemType, remainQty, productNameStr);
        if (checkPromotionItem.length > 0) {
            $scope.IsPromotionItem = true;
            if (qty == validQty) {
                qty = validQty;


            }
            else {
                qty = validQty;
                //return false;
            }
        }
        else {
            qty = validQty;
        }



        //alert(qty);
        if ($scope.TruckSizeId > 0 && $scope.DeliveryLocationId > 0) {
            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });
            if (currentOrder.length > 0) {


                // IsItemEdit   Check for Edit

                var totalWeightWithPalettes = 0;
                var totalWeightWithBuffer = 0;
                if (ItemType == 30) {
                    qty = qty;

                } else {
                    if (parseInt(productNameStr[0].QtyPerLayer) > 0) {


                        if ($scope.IsItemLayerAllow) {

                            var g = (parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer));
                            if ((parseInt(qty) % parseInt(productNameStr[0].QtyPerLayer)) > 0) {
                                if ((parseInt(ItemType) == 31)) {
                                    $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                                }
                                qty = qty - g;
                                //$rootScope.ValidationErrorAlert('This item can be ordered in complete layers, please adjust ordered quantity.', 'error', 3000);
                                //return false;
                            }
                        }
                    }
                }
                var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemId) === parseInt(itemId) & parseInt(el.ItemType) === parseInt(ItemType) & parseInt(el.GratisOrderId) === 0; });

                var enquiryProductGuid = '';
                if (productNameStrupdate.length > 0) {
                    enquiryProductGuid = productNameStrupdate[0].EnquiryProductGUID;
                }

                var chkVlaue = $scope.CheckBeforeAddingPromationItem(productNameStr[0].ItemCode, itemId, parseInt(qty), ItemType, productNameStr, enquiryProductGuid, GratisOrderId);
                if (!chkVlaue) {
                    return false;
                }
                var checkAllocationValue = $scope.CheckAllocation($scope.Allocation, qty, $scope.OrderData, itemId);
                if (!checkAllocationValue) {
                    if ((parseInt(ItemType) == 31)) {
                        $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                    }
                    $rootScope.ValidationErrorAlert('It seems like you are tyring to order the item more than the allocated quantity. You cannot order this item more than ' + $scope.Allocation + ' ' + productNameStr[0].UOM + '', 'error', 10000);
                    return false;
                }
                var totalWeight = $scope.getTotalAmount(productNameStr[0].WeightPerUnit, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);
                var truckTotalPalettes = $scope.getTotalPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, GratisOrderId, ItemType, enquiryProductGuid);

                var truckTotalExtraPalettes = $scope.getTotalExtraPalettes(productNameStr[0].ConversionFactor, qty, currentOrder, itemId, $scope.NumberOfExtraPalettes, ItemType, enquiryProductGuid);


                var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'TruckBufferWeight'; });
                if (truckBufferWeight.length > 0) {
                    var bufferWeight = parseFloat(truckBufferWeight[0].SettingValue);
                    totalWeightWithBuffer = (parseFloat($scope.TruckCapacity) - (bufferWeight * 1000));
                }



                var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder, enquiryProductGuid, productNameStr[0].ConversionFactor, qty, productNameStr[0].UOM);

                var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
                if (palettesWeight.length > 0) {

                    var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
                    if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                        totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
                    }
                    totalWeight = totalWeight + totalWeightWithPalettes
                }


                truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(truckTotalExtraPalettes);
                truckTotalPalettes = parseFloat(truckTotalPalettes).toFixed(2);
                var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
                var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();
                //var actualTotalWeight = totalWeight - (parseFloat(productNameStr[0].WeightPerUnit) * parseFloat($scope.ordermanagement.inputItemsQty));
                //var actualTruckTotalPalettes = truckTotalPalettes - (parseFloat(productNameStr[0].ConversionFactor) / parseFloat($scope.ordermanagement.inputItemsQty));



                if (productNameStrupdate.length > 0) {



                    if (parseFloat(parseFloat($scope.TruckCapacity)) < totalWeight) {

                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                        }

                        // $rootScope.ValidationErrorAlert('Truck capacity exceeded.', 'error', 3000);
                        $rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($scope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);


                        return false;

                    } else if (parseFloat(parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $scope.IsPalettesRequired === true && $scope.IsPalletLoadCheckValidation === true) {

                        var truckcapcityintons = parseInt(parseInt($scope.TruckCapacity) / 1000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        $rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $scope.TruckCapacityPalettes + ' Paletts. Please modify your order and try again.', 'error', 8000);

                        return false;
                    }
                    else {

                        currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes) + parseFloat(truckTotalExtraPalettes));
                        currentOrder[0].TruckWeight = (totalWeight / 1000);
                        currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;

                        if ($scope.IsItemEdit) {

                            productNameStrupdate[0].ProductQuantity = parseInt(qty);
                            productNameStrupdate[0].ItemPrices = ((parseInt(ItemType) == 31 ? 0 : parseFloat(productNameStrupdate[0].ItemPricesPerUnit)) * parseInt(productNameStrupdate[0].ProductQuantity));
                            productNameStrupdate[0].ItemTotalDepositeAmount = parseFloat(parseFloat(productNameStrupdate[0].DepositeAmountPerUnit) * parseInt(productNameStrupdate[0].ProductQuantity));
                        }
                        else {

                            if (parseInt(ItemType) === 31) {
                                productNameStrupdate[0].ProductQuantity = parseInt(qty);
                            }
                            else {
                                productNameStrupdate[0].ProductQuantity = parseInt(productNameStrupdate[0].ProductQuantity) + parseInt(qty);
                            }
                            productNameStrupdate[0].ItemPrices = ((parseInt(ItemType) == 31 ? 0 : parseFloat(productNameStrupdate[0].ItemPricesPerUnit)) * parseInt(productNameStrupdate[0].ProductQuantity));
                            productNameStrupdate[0].ItemTotalDepositeAmount = parseFloat(parseFloat(productNameStrupdate[0].DepositeAmountPerUnit) * parseInt(productNameStrupdate[0].ProductQuantity));
                        }



                        $scope.ReloadGraph(currentOrder, 0);
                        $rootScope.CalculateAmountTaxDepositeAndDiscount(currentOrder, $scope.CurrentOrderGuid);
                        $scope.ClearItemRecord();
                    }




                }
                else {




                    if (parseFloat(parseFloat($scope.TruckCapacity)) < totalWeight) {

                        $scope.trmpProductId = itemId
                        // $rootScope.ValidationErrorAlert('Truck capacity exceeded.', 'error', 3000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        $rootScope.ValidationErrorAlert('You are trying to order for ' + parseFloat(totalWeight / 1000).toFixed(2) + ' T while the truck size of ' + parseFloat(parseFloat($scope.TruckCapacity) / 1000) + 'T . Please modify your order and try again.', 'error', 8000);


                        $scope.CloseAddTruckControl();

                        return false;

                    } else if (parseFloat(parseFloat($scope.TruckCapacityPalettes) + parseFloat(extraPaletteBufferWeight)) < parseFloat(truckTotalPalettes) && $scope.IsPalettesRequired === true && $scope.IsPalletLoadCheckValidation === true) {
                        $scope.trmpProductId = itemId;
                        var truckcapcityintons = parseInt(parseInt($scope.TruckCapacity) / 1000);
                        if ((parseInt(ItemType) == 31)) {
                            $scope.RemoveInquiryItem($scope.CurrentOrderGuid, ParentItemId, 0);
                        }
                        $rootScope.ValidationErrorAlert('You are trying to order for ' + parseInt(Math.ceil(truckTotalPalettes)) + ' pallets while the truck size of ' + truckcapcityintons + 'T can take only ' + $scope.TruckCapacityPalettes + ' pallets. Please modify your order and try again.', 'error', 8000);
                        $scope.CloseAddTruckControl();
                        return false;
                    }

                    else {

                        if (currentOrder.length > 0) {

                            //var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 32 && el.ProductCode !== $scope.WoodenPalletCode; });
                            //if (productNameStrupdate.length > (parseInt($scope.NumberOfProductAdd) - 1)) {
                            //    $scope.TruckCapacityFullInTone = 0;
                            //    $scope.TruckCapacityFullInPercentage = 0;
                            //} else {

                            $scope.TruckCapacityFullInTone = (totalWeight / 1000);
                            $scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);
                            // }



                            angular.forEach($scope.buindingPalettes, function (item, key) {

                                item.PalettesWidth = 0;


                            });

                            if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                                for (var i = 0; i < Math.ceil(truckTotalPalettes); i++) {
                                    if (i < parseInt($scope.buindingPalettes.length)) {
                                        $scope.buindingPalettes[i].PalettesWidth = 100;
                                    }
                                }
                            }



                            currentOrder[0].TruckName = $scope.TruckSize;
                            currentOrder[0].ParentCompany = $scope.ParentCompany;
                            currentOrder[0].CompanyMnemonic = $scope.CompanyMnemonic;
                            currentOrder[0].ShipToCode = $scope.ShipToCode;

                            currentOrder[0].TruckCapacity = $scope.TruckCapacityInTone;
                            currentOrder[0].TruckSizeId = $scope.TruckSizeId;
                            currentOrder[0].PONumber = $scope.PONumber;
                            currentOrder[0].PONumber = $scope.PONumber;
                            currentOrder[0].ShipTo = $scope.DeliveryLocationId;
                            currentOrder[0].DeliveryLocationName = $scope.DeliveryLocationName;
                            currentOrder[0].RequestDate = $scope.ProposedDate;

                            currentOrder[0].OrderProposedETD = $scope.ProposedDate;
                            currentOrder[0].EnquiryType = 'SO';


                            currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(truckTotalPalettes) + parseFloat(truckTotalExtraPalettes));
                            //alert(currentOrder[0].NumberOfPalettes);


                            currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;
                            currentOrder[0].TruckWeight = $scope.TruckCapacityFullInTone;

                            if (parseInt(currentOrder[0].EnquiryId) === 0) {

                                currentOrder[0].CurrentState = 1;
                            }
                            if (productNameStr[0].Amount === undefined) {
                                productNameStr[0].Amount = 0;
                            }

                            var products = {
                                EnquiryProductGUID: generateGUID(),
                                OrderGUID: $scope.CurrentOrderGuid,
                                EnquiryProductId: 0,
                                Allocation: $scope.Allocation,
                                ItemId: itemId,
                                ParentItemId: ParentItemId,
                                ParentProductCode: ParentProductCode,
                                GratisOrderId: GratisOrderId,
                                ItemName: productNameStr[0].ItemName,
                                ProductCode: productNameStr[0].ItemCode,
                                NumberOfExtraPalettes: $scope.NumberOfExtraPalettes,
                                PrimaryUnitOfMeasure: productNameStr[0].UOM,
                                ProductQuantity: qty,
                                ActualAllocation: $scope.ActualAllocation,
                                ItemPricesPerUnit: parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount),
                                DepositeAmount: $scope.ItemDepositeAmount,
                                ItemTaxPerUnit: percentage(parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount), $scope.ItemTaxInPec),
                                ItemPrices: (parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount) * parseInt(qty)),
                                DepositeAmountPerUnit: $scope.ItemDepositeAmount,
                                ItemTotalDepositeAmount: parseFloat(parseFloat($scope.ItemDepositeAmount) * parseInt(qty)),
                                ConversionFactor: productNameStr[0].ConversionFactor,
                                ProductType: productNameStr[0].ProductType,
                                WeightPerUnit: productNameStr[0].WeightPerUnit,
                                IsItemLayerAllow: $scope.IsItemLayerAllow,
                                ItemType: ItemType,
                                IsActive: true
                            }


                            currentOrder[0].OrderProductList.push(products);


                        }
                        $rootScope.CalculateAmountTaxDepositeAndDiscount(currentOrder, $scope.CurrentOrderGuid);
                        $scope.ClearItemRecord();
                    }

                }


                if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {

                    $scope.AddWoodenPallet();
                }




                var chkaddpro = $scope.AddPromationItem(productNameStr[0].ItemCode, itemId, parseInt(qty), ItemType, 0);

                if (!chkaddpro) {
                    var dd = $scope.CheckWetherTruckIsFull(currentOrder, totalWeightWithBuffer, $scope.TruckCapacity, $scope.TruckCapacityPalettes, totalWeightWithPalettes);

                    if (dd) {
                        currentOrder[0].IsTruckFull = true;
                        $scope.AddDefaultTruck($scope.MOTOrderJson[0].ShipTo, $scope.MOTOrderJson[0].TruckSize, $scope.MOTOrderJson[0].TruckSizeId, $scope.MOTOrderJson[0].CompanyId, $scope.MOTOrderJson[0].PONumber);

                    }
                    else {
                        currentOrder[0].IsTruckFull = false;

                        if (!$scope.IsItemEdit) {
                            var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 32 && el.ProductCode !== $scope.WoodenPalletCode; });
                            if (productNameStrupdate.length > (parseInt($scope.NumberOfProductAdd))) {
                                $rootScope.ValidationErrorAlert('You can not add more the ' + $scope.NumberOfProductAdd + ' products.', 'error', 3000);
                                $scope.AddDefaultTruck(currentOrder[0].ShipTo, currentOrder[0].TruckSize, currentOrder[0].TruckSizeId, currentOrder[0].SoldTo, currentOrder[0].PONumber);

                            }
                        }
                    }
                    $scope.LoadAllEnquiriesTotalAmountAndCheckTruckIsFull();

                }

            }

        }
        else {
            if ($scope.TruckSizeId == 0) {
                $rootScope.ValidationErrorAlert('Please seletect one of the truck sizes before you proceed further with your order.', 'error', 3000);
            }
            else if ($scope.DeliveryLocationId == 0) {
                $rootScope.ValidationErrorAlert('Please seletect one of the delivery locations before you proceed further with your order.', 'error', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert('Please select delivery location or truck.', 'error', 3000);
            }
        }
        return qty;
        //$scope.RemoveSelectedAssociatedOrder();
    }


    $scope.YesRemoveFocItems = function (currentOrder, ParentItemId) {

        if (currentOrder.length > 0) {
            $scope.findAndRemove(currentOrder[0].OrderProductList, 'ParentItemId', ParentItemId, 'EnquiryProductId');
            if (currentOrder[0].OrderProductList.length === 1) {
                if (currentOrder[0].OrderProductList[0].ProductCode === $scope.WoodenPalletCode) {
                    currentOrder[0].OrderProductList = [];
                }
            }
        }
    }


    $scope.myFilter = function (item) {

        return item.ProductCode !== $scope.WoodenPalletCode;
    };


    $scope.Recalculate = function () {

        $scope.IsRecalculateVisibile = true;
        $scope.IsDisabledSubmit = false;
        var InValidItem = $scope.MOTOrderJson.filter(function (el) { return el.IsValidItem === "0" });


        if (InValidItem.length != 0) {


            //$rootScope.ValidationErrorAlert(String.format("There are some issues withn the data in uploaded excel sheet. Please rectify them before you proceed."), '', 3000);

            $rootScope.ValidationErrorAlert(String.format("One of the Product " + InValidItem[0].ItemCode + " does not exists or should not be less than zero."), '', 3000);

            return false;
        }




        $scope.OrderData = [];
        angular.forEach($scope.MOTOrderJson, function (item, key) {

            item.ConsumeQty = 0;

        });

        $scope.AddDefaultTruck($scope.MOTOrderJson[0].ShipTo, $scope.MOTOrderJson[0].TruckSize, $scope.MOTOrderJson[0].TruckSizeId, $scope.MOTOrderJson[0].CompanyId);
        $scope.TruckSizeId = $scope.MOTOrderJson[0].TruckSizeId;
        $scope.DeliveryLocationId = $scope.MOTOrderJson[0].ShipTo;
        $scope.DeliveryLocationName = $scope.MOTOrderJson[0].DeliveryLocationName;
        $scope.DeliveryLocationCapacity = $scope.MOTOrderJson[0].Capacity;
        $scope.CompanyId = $scope.MOTOrderJson[0].CompanyId;
        $scope.TruckCapacity = (parseFloat($scope.MOTOrderJson[0].TruckCapacityWeight) * 1000);

        $scope.TruckCapacityInTone = $scope.TruckCapacity / 1000;
        $scope.TruckCapacityPalettes = $scope.MOTOrderJson[0].TruckCapacityPalettes;
        $scope.TruckCapacityWeight = $scope.MOTOrderJson[0].TruckCapacityWeight;

        $scope.buindingPalettes = []
        for (var i = 0; i < $scope.MOTOrderJson[0].TruckCapacityPalettes; i++) {
            var palettes = {
                PalettesWidth: 0
            }
            $scope.buindingPalettes.push(palettes);
        }

        if ($rootScope.RuleValuePalate == '0') {
            if ($scope.buindingPalettes.length > 0) {
                $scope.IsPalettesRequired = true;
            } else {
                $scope.IsPalettesRequired = false;

            }
        }

        if ($scope.MOTOrderJson[0].NoPalettesRequired === '1') {
            $scope.IsPalettesRequired = false;
        }

        $scope.IsPromotionItem = false;


        //normal item add in  all truck



        debugger;
        for (var i = 0; i < $scope.MOTOrderJson.length; i++) {

            if ($scope.MOTOrderJson[i].IsValidItem == "1" && $scope.MOTOrderJson[i].ItemType !== 30) {

                $scope.getItemPrice($scope.MOTOrderJson[i]);
            }


        }


        debugger;
        $scope.CurrentOrderGuid = $scope.OrderData[0].OrderGUID;


        for (var i = 0; i < $scope.MOTOrderJson.length; i++) {

            if ($scope.MOTOrderJson[i].IsValidItem == "1" && $scope.MOTOrderJson[i].ItemType === 30) {

                $scope.AddGartisProductInFirstOrder($scope.MOTOrderJson[i]);
            }


        }







        var IsFinalOrderDataList = $scope.OrderData.filter(function (el) { return el.ShipTo !== 0; });
        $scope.OrderData = IsFinalOrderDataList;


        $scope.IsAllTruckFull = false;


        var isTruckFullList = $scope.OrderData.filter(function (el) { return el.IsTruckFull === false; });
        if (isTruckFullList.length == 0) {
            $scope.IsAllTruckFull = true;
        }






        setTimeout(function () {

            $scope.GetRequestedDate($scope.frozenDate, $scope.schedulingDate);
        }, 200);


        $scope.IsCalculate = false;







    }
    //Added by nimesh on 31-10-2019 for gratis remove on validation

    $scope.RemoveProduct = function (OrderGUID, ItemId, GratisOrderId, ItemCode) {

        debugger;
        if ($scope.IsItemEdit === true & $scope.ItemId === ItemId) {

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_CannotDeleteItemInEditMode), 'error', 8000);
            return false;
        }
        $scope.CurrentOrderGuid = OrderGUID;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
        currentOrder[0].IsTruckFull = false;
        if (parseInt(GratisOrderId) > 0) {

            $scope.RemoveGratisOrderOrderGUID = OrderGUID;
            $scope.RemoveGratisOrderGratisOrderId = GratisOrderId;
            $scope.RemoveGratisOrderEvent();

        }
        else {

            currentOrder[0].OrderProductList = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 30 || parseInt(el.ItemId) !== parseInt(ItemId) });
            $scope.RemovePromotionItem(currentOrder, ItemCode);

            var productcount = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 30 || parseInt(el.ItemType) === 31 || parseInt(el.ItemType) === 32 });
            if (productcount.length === 0) {
                currentOrder[0].OrderProductList = [];
            }
        }

        if (currentOrder[0].OrderProductList.length === 0) {
            currentOrder[0].IsNewTruck = true;
        }

        $rootScope.CalculateAmountTaxDepositeAndDiscount($scope.OrderData, OrderGUID);


        $scope.ClearSelectedItemInformation();

        var requestDataforItemLayer =
        {
            UserId: $rootScope.UserId,
            LogGuid: $scope.CurrentOrderGuid,
            ObjectId: $rootScope.EditedEnquiryId,
            ObjectType: "Delete Product  : EnquiryId " + $rootScope.EditedEnquiryId,
            LoggingTypeId: 3501,
            ServicesAction: 'CreateLog',
            LogDescription: 'Click On delete Item . Item Id ' + ItemId + ' IsGratisItem ' + parseInt(GratisOrderId) + ' ',
            LogDate: GetCurrentdate(),
            Source: 'Portal',
        };
        var consolidateApiParamaterItemLayer =
        {
            Json: requestDataforItemLayer,
        };

        GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

        });



        $scope.ReloadGraph(currentOrder, 0);

        $scope.CloseDeleteItemModalPopup();
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


    $scope.RemovePromotionItem = function (currentOrder, ParentProductCode) {

        if (currentOrder.length > 0) {
            $scope.findAndRemove(currentOrder[0].OrderProductList, 'ParentProductCode', ParentProductCode, 'EnquiryProductId');

            var productcount = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 30 || parseInt(el.ItemType) === 31 || parseInt(el.ItemType) === 32 });
            if (productcount.length === 0) {
                currentOrder[0].OrderProductList = [];
            }

        }
    }

    $scope.RemoveGratisOrderEvent = function () {

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.RemoveGratisOrderOrderGUID; });
        $scope.findAndRemove(currentOrder[0].OrderProductList, 'GratisOrderId', $scope.RemoveGratisOrderGratisOrderId, 'EnquiryProductGUID');


        var checkOtherItemExistInOrder = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 30 || parseInt(el.ItemType) === 31 || parseInt(el.ItemType) === 32 });

        if (checkOtherItemExistInOrder.length === 0) {
            currentOrder[0].OrderProductList = [];
        }

        $scope.RemoveSelectedAssociatedOrder();
        $scope.RemoveGratisOrderOrderGUID = '';
        $scope.RemoveGratisOrderGratisOrderId = '';
        $scope.ReloadGraph(currentOrder, 0);
        $scope.RemoveSelectedAssociatedOrder();
        //$scope.CloseRemoveGratisOrderControl();


    }



    $scope.AddGartisProductInFirstOrder = function (e) {


        var itemId = e.ItemId;
        var ItemPrices = e.Amount;

        var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId == itemId; });
        if (productNameStr.length > 0) {
            $scope.ItemPrices = productNameStr[0].Amount;
            $scope.UOM = productNameStr[0].UOM;
            $scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
        }
        else {
            $scope.ItemPrices = 0;
            $scope.ItemCodeForDeposite = '';
        }

        $scope.Allocation = e.Allocation;
        $scope.ActualAllocation = e.ActualAllocation;


        if (e.ItemDeposit != "") {
            $scope.ItemDepositeAmount = parseFloat(e.ItemDeposit);

        } else {
            $scope.ItemDepositeAmount = 0;
        }
        if (e.ExtraNumberOfPalletes != "") {
            $scope.NumberOfExtraPalettes = parseInt(e.ExtraNumberOfPalletes);
        }
        else {
            $scope.NumberOfExtraPalettes = 0;
        }

        if ($scope.NumberOfExtraPalettes > 0) {
            $scope.NumberOfExtraPalettes = $scope.NumberOfExtraPalettes;
        }


        var GratisOrderId = e.OrderId;


        var ItemType = e.ItemType;
        var qty = e.Quantity;





        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });





        currentOrder[0].TruckName = $scope.TruckSize;
        currentOrder[0].TruckCapacity = $scope.TruckCapacityInTone;
        currentOrder[0].TruckSizeId = $scope.TruckSizeId;
        currentOrder[0].PONumber = $scope.PONumber;
        currentOrder[0].ShipTo = $scope.DeliveryLocationId;
        currentOrder[0].DeliveryLocationName = $scope.DeliveryLocationName;
        currentOrder[0].RequestDate = $scope.ProposedDate;

        currentOrder[0].OrderProposedETD = $scope.ProposedDate;




        if (parseInt(currentOrder[0].EnquiryId) === 0) {

            currentOrder[0].CurrentState = 1;
        }
        if (productNameStr[0].Amount === undefined) {
            productNameStr[0].Amount = 0;
        }

        var products = {
            EnquiryProductGUID: generateGUID(),
            OrderGUID: $scope.CurrentOrderGuid,
            EnquiryProductId: 0,
            Allocation: $scope.Allocation,
            ItemId: itemId,
            ParentItemId: 0,
            ParentProductCode: 0,
            GratisOrderId: GratisOrderId,
            ItemName: productNameStr[0].ItemName,
            ProductCode: productNameStr[0].ItemCode,
            NumberOfExtraPalettes: $scope.NumberOfExtraPalettes,
            PrimaryUnitOfMeasure: productNameStr[0].UOM,
            ProductQuantity: qty,
            ActualAllocation: $scope.ActualAllocation,
            ItemPricesPerUnit: parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount),
            DepositeAmount: $scope.ItemDepositeAmount,
            ItemTaxPerUnit: percentage(parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount), $scope.ItemTaxInPec),
            ItemPrices: (parseFloat(parseInt(GratisOrderId) != 0 || parseInt(ItemType) == 31 ? 0 : productNameStr[0].Amount) * parseInt(qty)),
            DepositeAmountPerUnit: $scope.ItemDepositeAmount,
            ItemTotalDepositeAmount: parseFloat(parseFloat($scope.ItemDepositeAmount) * parseInt(qty)),
            ConversionFactor: productNameStr[0].ConversionFactor,
            ProductType: productNameStr[0].ProductType,
            WeightPerUnit: productNameStr[0].WeightPerUnit,
            ItemType: ItemType,
            IsActive: true
        }


        var totalWeightWithPalettes = 0;
        var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
        var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');
        truckTotalPalettes = parseFloat(truckTotalPalettes).toFixed(2);
        var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
        var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder);
        var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; }); if (palettesWeight.length > 0) {
            var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
            if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes));
            }
            totalWeight = totalWeight + totalWeightWithPalettes
        }
        var truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);
        truckTotalPalettes = parseFloat(truckTotalPalettes).toFixed(2);
        var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
        var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();
        //currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(totalNumberOfPalettes));
        currentOrder[0].TruckWeight = (totalWeight / 1000);
        //currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;

        $scope.TruckCapacityFullInTone = (totalWeight / 1000);
        $scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);

        currentOrder[0].TruckCapacityFullInPercentage = $scope.TruckCapacityFullInPercentage;




        currentOrder[0].OrderProductList.push(products);
        $scope.ReloadGraph(currentOrder, 0);
        $scope.RemoveSelectedAssociatedOrder();



    }



    $scope.AddGartisProductInSelectedOrder = function (ItemId, qty, orderId, GratisOrderProductList) {


        //var itemId = e.ItemId;
        //var ItemPrices = e.Amount;



        var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId == ItemId; });
        if (productNameStr.length > 0) {
            $scope.ItemPrices = productNameStr[0].Amount;
            $scope.UOM = productNameStr[0].UOM;
            $scope.ItemCodeForDeposite = productNameStr[0].ItemCode;
        }
        else {
            $scope.ItemPrices = 0;
            $scope.ItemCodeForDeposite = '';
        }
        $scope.ItemDepositeAmount = 0;
        //$scope.Allocation = e.Allocation;
        //$scope.ActualAllocation = e.ActualAllocation;


        //if (e.ItemDeposit != "") {
        //    $scope.ItemDepositeAmount = parseFloat(e.ItemDeposit);

        //} else {
        //    $scope.ItemDepositeAmount = 0;
        //}
        //if (e.ExtraNumberOfPalletes != "") {
        //    $scope.NumberOfExtraPalettes = parseInt(e.ExtraNumberOfPalletes);
        //}
        //else {
        //    $scope.NumberOfExtraPalettes = 0;
        //}

        //if ($scope.NumberOfExtraPalettes > 0) {
        //    $scope.NumberOfExtraPalettes = $scope.NumberOfExtraPalettes;
        //}


        //var GratisOrderId = e.OrderId;


        //var ItemType = e.ItemType;
        var qty = qty;





        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentGrtaisOrderGUID; });
        $scope.CurrentOrderGuid = $scope.CurrentGrtaisOrderGUID;




        currentOrder[0].TruckName = $scope.TruckSize;
        currentOrder[0].TruckCapacity = $scope.TruckCapacityInTone;
        currentOrder[0].TruckSizeId = $scope.TruckSizeId;
        currentOrder[0].PONumber = $scope.PONumber;
        currentOrder[0].ShipTo = $scope.DeliveryLocationId;
        currentOrder[0].DeliveryLocationName = $scope.DeliveryLocationName;
        currentOrder[0].RequestDate = $scope.ProposedDate;

        currentOrder[0].OrderProposedETD = $scope.ProposedDate;




        if (parseInt(currentOrder[0].EnquiryId) === 0) {

            currentOrder[0].CurrentState = 1;
        }
        if (productNameStr[0].Amount === undefined) {
            productNameStr[0].Amount = 0;
        }

        var products = {
            EnquiryProductGUID: generateGUID(),
            OrderGUID: $scope.CurrentOrderGuid,
            EnquiryProductId: 0,
            Allocation: $scope.Allocation,
            ItemId: ItemId,
            ParentItemId: 0,
            ParentProductCode: 0,
            GratisOrderId: orderId,
            ItemName: productNameStr[0].ItemName,
            ProductCode: productNameStr[0].ItemCode,
            NumberOfExtraPalettes: $scope.NumberOfExtraPalettes,
            PrimaryUnitOfMeasure: productNameStr[0].UOM,
            ProductQuantity: parseInt(qty),
            ActualAllocation: $scope.ActualAllocation,
            ItemPricesPerUnit: parseFloat(parseInt(orderId) != 0 ? 0 : productNameStr[0].Amount),
            DepositeAmount: $scope.ItemDepositeAmount,
            ItemTaxPerUnit: percentage(parseFloat(parseInt(orderId) != 0 ? 0 : productNameStr[0].Amount), $scope.ItemTaxInPec),
            ItemPrices: (parseFloat(parseInt(orderId) != 0 ? 0 : productNameStr[0].Amount) * parseInt(qty)),
            DepositeAmountPerUnit: $scope.ItemDepositeAmount,
            ItemTotalDepositeAmount: parseFloat(parseFloat($scope.ItemDepositeAmount) * parseInt(qty)),
            ConversionFactor: productNameStr[0].ConversionFactor,
            ProductType: productNameStr[0].ProductType,
            WeightPerUnit: productNameStr[0].WeightPerUnit,
            ItemType: 30,
            IsActive: true
        }


        var totalWeightWithPalettes = 0;
        var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
        var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');
        truckTotalPalettes = parseFloat(truckTotalPalettes).toFixed(2);
        var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
        var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder);
        var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; }); if (palettesWeight.length > 0) {
            var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
            if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes));
            }
            totalWeight = totalWeight + totalWeightWithPalettes
        }
        var truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);
        truckTotalPalettes = parseFloat(truckTotalPalettes).toFixed(2);
        var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
        var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();
        //currentOrder[0].NumberOfPalettes = Math.ceil(parseFloat(totalNumberOfPalettes));
        currentOrder[0].TruckWeight = (totalWeight / 1000);
        //currentOrder[0].PalletSpace = $scope.PalettesCorrectWeight;

        $scope.TruckCapacityFullInTone = (totalWeight / 1000);
        $scope.TruckCapacityFullInPercentage = (($scope.TruckCapacityFullInTone * 100) / $scope.TruckCapacityInTone).toFixed(2);

        currentOrder[0].TruckCapacityFullInPercentage = $scope.TruckCapacityFullInPercentage;




        currentOrder[0].OrderProductList.push(products);
        $scope.ReloadGraph(currentOrder, 0);
        $scope.RemoveSelectedAssociatedOrder();



    }





    $scope.SaveAllInquiry = function () {
        requestData =
        {
            ServicesAction: 'LoadAvailableCreditLimitOfCustomer',
            CompanyId: $scope.CompanyId,
            EnquiryId: 0
        };


        jsonobject = {};
        jsonobject.Json = requestData;
        var LoadAvailableCreditLimitOfCustomer = GrRequestService.ProcessRequest(jsonobject);

        $q.all([
            LoadAvailableCreditLimitOfCustomer
        ]).then(function (resp) {

            var availableCreditLimit = 0;
            var responseForLoadAvailableCreditLimitOfCustomer = resp[0];

            if (responseForLoadAvailableCreditLimitOfCustomer.data !== null) {
                if (responseForLoadAvailableCreditLimitOfCustomer.data.Json != undefined || responseForLoadAvailableCreditLimitOfCustomer.data.Json != null) {
                    var resoponsedata = responseForLoadAvailableCreditLimitOfCustomer.data.Json;
                    availableCreditLimit = resoponsedata.AvailableCreditLimit;
                } else {
                    availableCreditLimit = 0;
                }
            } else {
                availableCreditLimit = 0;
            }


            availableCreditLimit = Number(availableCreditLimit) - Number(resoponsedata.TotalEnquiryCreated);
            availableCreditLimit = Number(availableCreditLimit) - Number(resoponsedata.EnquiryTotalDepositAmount);

            var requestDataLogCreditLimit =
            {
                UserId: $rootScope.UserId,
                LogGuid: 0,
                ObjectId: $rootScope.EditedEnquiryId,
                ObjectType: "Load credit limit at the time of all place enquiry: EnquiryId " + $rootScope.EditedEnquiryId,
                LoggingTypeId: 3501,
                ServicesAction: 'CreateLog',
                LogDescription: 'Load Available Credit Limit at the time of place all enquiry' + Number(availableCreditLimit) + ' UsedInEnquiryLimit ' + Number(resoponsedata.TotalEnquiryCreated) + ' and depositusedinenquiry ' + Number(resoponsedata.EnquiryTotalDepositAmount) + ' ',
                LogDate: GetCurrentdate(),
                Source: 'Portal',
            };
            var consolidateApiParamaterItemLayer =
            {
                Json: requestDataLogCreditLimit,
            };

            GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

            });



            if (parseFloat(availableCreditLimit) >= parseFloat($scope.AllEnquiryTotalAmount)) {
                $scope.AvailableCreditLimit = availableCreditLimit;
                $scope.SaveInquiry(1);
                $scope.IsCalculate = true;


            } else {

                if (parseFloat($scope.AvailableCreditLimit) > parseFloat(availableCreditLimit)) {

                    $scope.AvailableCreditLimit = availableCreditLimit;
                    $rootScope.Throbber.Visible = false;
                    $scope.IsDisabledSubmit = false;
                    $scope.IsCalculate = false;

                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_AvailableCreditLimitExeededByAllEnquiryAndCreditLimitChange), 'error', 8000);
                } else {

                    $scope.AvailableCreditLimit = availableCreditLimit;
                    $rootScope.Throbber.Visible = false;
                    $scope.IsDisabledSubmit = false;
                    $scope.IsCalculate = false;

                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_AvailableCreditLimitExeededByAllEnquiry), 'error', 8000);
                }


            }

        });




    }

    $scope.SaveAllAsDraftInquiry = function () {
        $scope.SaveInquiry(8);
    }


    $scope.SaveInquiry = function (status) {
        $rootScope.Throbber.Visible = true;
        $scope.IsDisabledSubmit = true;
        $scope.IsRecalculateVisibile = false;
        $scope.EnquiryList = [];


        var orderData = $scope.OrderData.filter(function (el) { return el.IsTruckFull === true; });


        for (var i = 0; i < orderData.length; i++) {

            var enquiryobject = {};

            enquiryobject = $scope.EnquiryListMapping(status, orderData[i]);

            $scope.EnquiryList.push(enquiryobject);
        }





        var Enquiry =
        {
            ServicesAction: 'SaveEnquiryForMOT',
            EnquiryList: $scope.EnquiryList

        }




        //  var stringfyjson = JSON.stringify(Enquiry);
        var jsonobject = {};
        jsonobject.Json = Enquiry;




        if (status == 1) {

            if (($scope.AvailableCreditLimit - $scope.totalorderamount) < 0) {
                $scope.IsDisabledSubmit = false;
                $scope.IsRecalculateVisibile = true;
                $rootScope.ValidationErrorAlert('You do not have enough credits left in your account.Please mark as draft', 'error', 3000);
                $rootScope.Throbber.Visible = false;
                return false;
            }
        }

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (status == 1) {

                $scope.AvailableCreditLimit = $scope.AvailableCreditLimit - $scope.totalorderamount;
                $scope.totalorderamount = 0;
            }



            var Notes = [];
            var enquiryListData = response.data.Json.EnquiryList;
            for (var i = 0; i < enquiryListData.length; i++) {
                if (enquiryListData[i].NoteList != undefined) {
                    if (enquiryListData[i].NoteList.length > 0) {

                        for (var j = 0; j < enquiryListData[i].NoteList.length; j++) {
                            var noteJson = {
                                RoleId: enquiryListData[i].NoteList[j].RoleId,
                                ObjectId: enquiryListData[i].EnquiryId,
                                ObjectType: enquiryListData[i].NoteList[j].ObjectType,
                                Note: enquiryListData[i].NoteList[j].Note,
                                CreatedBy: enquiryListData[i].NoteList[j].CreatedBy
                            }

                            Notes.push(noteJson);
                        }
                    }
                }

            }

            if (Notes.length > 0) {

                var Note =
                {
                    ServicesAction: "SaveNotes",
                    NoteList: Notes
                }

                var jsonobject = {};
                jsonobject.Json = Note;



                GrRequestService.ProcessRequest(jsonobject).then(function (response) {


                });

            }




            $rootScope.Throbber.Visible = false;



            var resoponsedata = response.data;
            $scope.OrderData = $scope.OrderData.filter(function (el) { return el.IsTruckFull === false; });

            $rootScope.TemOrderData = [];
            $rootScope.CurrentOrderGuid = '';
            $scope.IsDisabledSubmit = false;
            $scope.ClearAll();

            var enquiryNumberList = "";
            for (var j = 0; j < enquiryListData.length; j++) {
                enquiryNumberList = enquiryListData[j].EnquiryAutoNumber + ' , ' + enquiryNumberList;

            }

            enquiryNumberList = enquiryNumberList.trim();

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnquirySubmittedMessage, enquiryNumberList), 'error', 3000);
            //$rootScope.ValidationErrorAlert('Record Saved Successfully', 'error', 3000);

            //$state.go("CreateInquiry");
        });


    }








    $scope.SaveSingleInquiry = function (status, EnquiryData, OrderGUID) {
        $rootScope.Throbber.Visible = true;
        $scope.IsDisabledSubmit = true;
        $scope.IsRecalculateVisibile = false;
        $scope.IsCalculate = true;


        $scope.EnquiryList = [];






        for (var i = 0; i < EnquiryData.length; i++) {

            var enquiryobject = {};

            enquiryobject = $scope.EnquiryListMapping(status, EnquiryData[i]);

            $scope.EnquiryList.push(enquiryobject);
        }



        var Action = "";





        if ($scope.EnquiryList[0].EnquiryId !== undefined && $scope.EnquiryList[0].EnquiryId !== 0 && $scope.EnquiryList[0].EnquiryId !== null) {
            Action = "UpdateEnquiry";
        } else {




            Action = "SaveEnquiryForMOT";
        }


        if (status == 1) {
            var totaltaxamount = 0;
            totaltaxamount = parseFloat($scope.EnquiryList[0].TotalTaxAmount);
            totalorderamount = parseFloat($scope.EnquiryList[0].TotalOrderAmount);

            if (($scope.AvailableCreditLimit - (totalorderamount)) < 0) {
                $scope.IsRecalculateVisibile = true;
                $rootScope.Throbber.Visible = false;
                $rootScope.ValidationErrorAlert('You do not have enough credits left in your account.Please mark as draft', 'error', 3000);
                return false;
            }
        }



        var Enquiry =
        {
            ServicesAction: Action,
            EnquiryList: $scope.EnquiryList

        }

        var jsonobject = {};
        jsonobject.Json = Enquiry;


        GrRequestService.ProcessRequest(jsonobject).then(function (response) {



            if ($scope.EnquiryList[0].EnquiryId !== undefined && $scope.EnquiryList[0].EnquiryId !== 0 && $scope.EnquiryList[0].EnquiryId !== null) {

            } else {
                if (status == 1) {

                    $scope.AvailableCreditLimit = $scope.AvailableCreditLimit - totalorderamount;
                    $scope.totalorderamount = 0;
                }
            }




            var Notes = [];
            var enquiryListData = response.data.Json.EnquiryList;
            for (var i = 0; i < enquiryListData.length; i++) {
                if (enquiryListData[i].NoteList != undefined) {
                    if (enquiryListData[i].NoteList.length > 0) {

                        for (var j = 0; j < enquiryListData[i].NoteList.length; j++) {
                            var noteJson = {
                                RoleId: enquiryListData[i].NoteList[j].RoleId,
                                ObjectId: enquiryListData[i].EnquiryId,
                                ObjectType: enquiryListData[i].NoteList[j].ObjectType,
                                Note: enquiryListData[i].NoteList[j].Note,
                                CreatedBy: enquiryListData[i].NoteList[j].CreatedBy
                            }

                            Notes.push(noteJson);
                        }
                    }
                }

            }

            if (Notes.length > 0) {

                var Note =
                {
                    ServicesAction: "SaveNotes",
                    NoteList: Notes
                }

                var jsonobject = {};
                jsonobject.Json = Note;



                GrRequestService.ProcessRequest(jsonobject).then(function (response) {


                });

            }


            var resoponsedata = response.data;
            $scope.RemoveInquiry(OrderGUID);


            $rootScope.Throbber.Visible = false;

            if ($scope.OrderData.length > 0) {
                //$scope.ClearAll();



                var enquiryNumberList = "";
                for (var j = 0; j < enquiryListData.length; j++) {
                    enquiryNumberList = enquiryListData[j].EnquiryAutoNumber + ' , ' + enquiryNumberList;

                }

                enquiryNumberList = enquiryNumberList.trim();

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnquirySubmittedMessage, enquiryNumberList), 'error', 3000);
                $scope.IsRecalculateVisibile = false;
                $rootScope.Throbber.Visible = false;


            }
            else {
                var enquiryNumberList = "";
                for (var j = 0; j < enquiryListData.length; j++) {
                    enquiryNumberList = enquiryListData[j].EnquiryAutoNumber + ' , ' + enquiryNumberList;

                }

                enquiryNumberList = enquiryNumberList.trim();

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnquirySubmittedMessage, enquiryNumberList), 'error', 3000);
                $scope.IsRecalculateVisibile = false;
                $rootScope.CurrentOrderGuid = '';
                $rootScope.TemOrderData = $scope.OrderData;
                $rootScope.Throbber.Visible = false;

            }



        });


    }


    $scope.EnquiryListMapping = function (status, orderData) {

        debugger;

        var equirydata = {};
        equirydata.OrderGUID = orderData.OrderGUID;
        equirydata.EnquiryId = orderData.EnquiryId;
        equirydata.EnquiryType = "SO";
        equirydata.RequestDate = orderData.ProposedDateValue;
        equirydata.ShipTo = orderData.ShipTo;
        equirydata.SoldTo = orderData.SoldTo;
        equirydata.PONumber = orderData.PONumber;
        equirydata.Remarks = $scope.MotEnquiry.Comments;
        equirydata.IsRecievingLocationCapacityExceed = orderData.IsRecievingLocationCapacityExceed;

        //equirydata.CompanyId = orderData.ParentCompany;
        equirydata.IsActive = orderData.IsActive;
        if (orderData.OrderProposedETD !== 'N/A') {
            equirydata.OrderProposedETD = orderData.OrderProposedETD;
        }
        //if ($scope.Page === "UploadEnquiry") {
        //    equirydata.IsOrderSelfCollect = "1";
        //    equirydata.TruckSizeId = 0;
        //    equirydata.NumberOfPalettes = 0;
        //    equirydata.PalletSpace = 0;
        //} else {
        equirydata.IsOrderSelfCollect = "0";
        equirydata.TruckSizeId = orderData.TruckSizeId;
        equirydata.NumberOfPalettes = orderData.NumberOfPalettes;
        equirydata.PalletSpace = orderData.PalletSpace;
        //}


        equirydata.CompanyMnemonic = orderData.CompanyMnemonic;
        equirydata.ShipToCode = orderData.ShipToCode;

        equirydata.TruckWeight = orderData.TruckWeight;
        var numberOfDaysToAdd = $scope.LoadSettingInfoByName('CollectionPickupDate', 'int');
        equirydata.CollectionDateFromSettingValue = "-" + numberOfDaysToAdd;
        equirydata.PreviousState = 0;
        equirydata.CurrentState = status;
        equirydata.CreatedBy = $rootScope.UserId;
        equirydata.OrderProductList = [];
        equirydata.NoteList = [];

        var totalOrderAmount = 0;
        var totalDepositeamount = 0;
        var totalQty = 0;

        var totalprice = 0;


        for (var j = 0; j < orderData.OrderProductList.length; j++) {
            var equiryProductdata = {};
            equiryProductdata.OrderGUID = orderData.OrderProductList[j].OrderGUID;
            equiryProductdata.EnquiryProductId = orderData.OrderProductList[j].EnquiryProductId;
            equiryProductdata.ItemId = orderData.OrderProductList[j].ItemId;
            equiryProductdata.ParentItemId = orderData.OrderProductList[j].ParentItemId;
            equiryProductdata.ParentProductCode = orderData.OrderProductList[j].ParentProductCode;
            equiryProductdata.ItemName = orderData.OrderProductList[j].ItemName;
            equiryProductdata.AssociatedOrder = orderData.OrderProductList[j].GratisOrderId;
            equiryProductdata.ItemPricesPerUnit = orderData.OrderProductList[j].ItemPricesPerUnit;
            equiryProductdata.ProductCode = orderData.OrderProductList[j].ProductCode;
            equiryProductdata.PrimaryUnitOfMeasure = orderData.OrderProductList[j].PrimaryUnitOfMeasure;
            equiryProductdata.ProductQuantity = orderData.OrderProductList[j].ProductQuantity;
            equiryProductdata.ProductType = orderData.OrderProductList[j].ProductType;
            equiryProductdata.ProductType = orderData.OrderProductList[j].ProductType;
            equiryProductdata.WeightPerUnit = orderData.OrderProductList[j].WeightPerUnit;
            equiryProductdata.IsPackingItem = orderData.OrderProductList[j].IsPackingItem;
            equiryProductdata.IsActive = orderData.OrderProductList[j].IsActive;
            equiryProductdata.ItemType = orderData.OrderProductList[j].ItemType;
            equiryProductdata.DepositeAmountPerUnit = parseFloat(orderData.OrderProductList[j].DepositeAmountPerUnit),

                totalQty += parseFloat(orderData.OrderProductList[j].ProductQuantity);

            totalOrderAmount += parseFloat(orderData.OrderProductList[j].ItemPricesPerUnit) * parseFloat(orderData.OrderProductList[j].ProductQuantity);

            totalDepositeamount += parseFloat(orderData.OrderProductList[j].DepositeAmountPerUnit) * parseFloat(orderData.OrderProductList[j].ProductQuantity);




            equirydata.OrderProductList.push(equiryProductdata);
        }


        equirydata.TotalAmount = totalOrderAmount;
        equirydata.TotalQuantity = totalQty;

        equirydata.TotalDepositeAmount = totalDepositeamount;


        var totaltaxamount = percentage(parseFloat(totalOrderAmount), $scope.ItemTaxInPec);


        var totalPrice = parseFloat(totalOrderAmount) + parseFloat(totaltaxamount) + parseFloat(totalDepositeamount);


        equirydata.TotalTaxAmount = totaltaxamount;
        equirydata.TotalOrderAmount = totalOrderAmount;
        equirydata.TotalPrice = totalPrice;


        equirydata.NoteList = orderData.NoteList;
        return equirydata;
    }



    $scope.RemoveInquiry = function (OrderGUID) {

        //var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });

        $scope.findAndRemove($scope.OrderData, 'OrderGUID', OrderGUID, 'EnquiryId');

        $scope.RemoveSelectedAssociatedOrder();
    }

    $scope.findAndRemove = function (array, property, value, primaryId) {
        array.forEach(function (result, index) {

            if (result[property] === value) {

                array.splice(index, 1);

            }
        });
    };




    $scope.SaveNote = function () {

        if ($scope.NoteVariable.NoteText !== "") {

            $scope.NotesListData = [];
            $scope.NoteId === 0

            if ($rootScope.EnquiryDetailId !== undefined && $rootScope.EnquiryDetailId !== null && $rootScope.EnquiryDetailId !== 0) {

                var NoteJson = {
                    RoleId: $rootScope.RoleId,
                    ObjectId: $rootScope.EnquiryDetailId,
                    ObjectType: 1220,
                    Note: $scope.NoteVariable.NoteText,
                    CreatedBy: $rootScope.UserId
                }

                $scope.NotesListData.push(NoteJson);

                $scope.SaveNoteText = $scope.NoteVariable.NoteText;

                var Note =
                {
                    ServicesAction: "SaveNotes",
                    NoteList: $scope.NotesListData
                }

                var jsonobject = {};
                jsonobject.Json = Note;



                GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryPage_NotesUpdated), 'error', 3000);
                });

            } else {
                var NoteJson = {
                    RoleId: $rootScope.RoleId,
                    ObjectId: 0,
                    ObjectType: 1220,
                    Note: $scope.NoteVariable.NoteText,
                    CreatedBy: $rootScope.UserId
                }

                $scope.NotesListData.push(NoteJson);

                var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.NotesOrderGuId; });
                if (currentOrder.length > 0) {
                    currentOrder[0].NoteList = $scope.NotesListData;
                }
            }

            $scope.NotesModalPopupControl = false;
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_NoteEnterValidation), 'error', 3000);
        }
    }






    $scope.CheckDraftSingleInquiry = function (status, EnquiryData, OrderGUID) {

        $scope.EnquiryList = [];
        for (var i = 0; i < EnquiryData.length; i++) {
            var equirydata = {};
            equirydata.OrderGUID = EnquiryData[i].OrderGUID;
            equirydata.EnquiryId = EnquiryData[i].EnquiryId;
            equirydata.RequestDate = EnquiryData[i].RequestDate;
            equirydata.ShipTo = EnquiryData[i].ShipTo;
            equirydata.SoldTo = EnquiryData[i].SoldTo;
            equirydata.CompanyMnemonic = $scope.TempCompanyMnemonic;
            equirydata.TruckSizeId = EnquiryData[i].TruckSizeId;
            equirydata.IsActive = EnquiryData[i].IsActive;
            equirydata.IsRecievingLocationCapacityExceed = EnquiryData[i].IsRecievingLocationCapacityExceed;
            equirydata.NumberOfPalettes = EnquiryData[i].NumberOfPalettes;
            equirydata.PalletSpace = EnquiryData[i].PalletSpace;
            equirydata.TruckWeight = EnquiryData[i].TruckWeight;
            equirydata.PONumber = EnquiryData[i].PONumber;

            if (EnquiryData[i].OrderProposedETD !== 'N/A') {
                equirydata.OrderProposedETD = EnquiryData[i].OrderProposedETD;
            }

            equirydata.PreviousState = 0;
            equirydata.CurrentState = status;
            equirydata.CreatedBy = $rootScope.UserId;
            equirydata.EnquiryProductList = [];

            var totalorderamount = 0;

            for (var j = 0; j < EnquiryData[i].EnquiryProductList.length; j++) {
                var equiryProductdata = {};

                totalorderamount += parseFloat(EnquiryData[i].EnquiryProductList[j].ItemPricesPerUnit) * parseFloat(EnquiryData[i].EnquiryProductList[j].ProductQuantity);

                totalorderamount += parseFloat(EnquiryData[i].EnquiryProductList[j].DepositeAmountPerUnit) * parseFloat(EnquiryData[i].EnquiryProductList[j].ProductQuantity);

                equiryProductdata.OrderGUID = EnquiryData[i].EnquiryProductList[j].OrderGUID;
                equiryProductdata.EnquiryProductId = EnquiryData[i].EnquiryProductList[j].EnquiryProductId;
                equiryProductdata.ItemId = EnquiryData[i].EnquiryProductList[j].ItemId;

                var ParentItemId = EnquiryData[i].EnquiryProductList[j];


                equiryProductdata.ParentItemId = EnquiryData[i].EnquiryProductList[j].ParentItemId;
                equiryProductdata.ParentProductCode = EnquiryData[i].EnquiryProductList[j].ParentProductCode;

                equiryProductdata.AssociatedOrder = EnquiryData[i].EnquiryProductList[j].GratisOrderId;
                equiryProductdata.ItemName = EnquiryData[i].EnquiryProductList[j].ItemName;
                equiryProductdata.ItemPricesPerUnit = EnquiryData[i].EnquiryProductList[j].ItemPricesPerUnit;
                equiryProductdata.ProductCode = EnquiryData[i].EnquiryProductList[j].ProductCode;
                equiryProductdata.PrimaryUnitOfMeasure = EnquiryData[i].EnquiryProductList[j].PrimaryUnitOfMeasure;
                equiryProductdata.ProductQuantity = EnquiryData[i].EnquiryProductList[j].ProductQuantity;
                equiryProductdata.ProductType = EnquiryData[i].EnquiryProductList[j].ProductType;
                equiryProductdata.WeightPerUnit = EnquiryData[i].EnquiryProductList[j].WeightPerUnit;
                equiryProductdata.IsActive = EnquiryData[i].EnquiryProductList[j].IsActive;
                equiryProductdata.ItemType = EnquiryData[i].EnquiryProductList[j].ItemType;
                equiryProductdata.AllocationExcited = false;
                equiryProductdata.AllocationQty = 0;
                equiryProductdata.DepositeAmountPerUnit = EnquiryData[i].EnquiryProductList[j].DepositeAmountPerUnit;

                equirydata.EnquiryProductList.push(equiryProductdata);
            }

            equirydata.ReturnPakageMaterialList = EnquiryData[i].ReturnPakageMaterialList;


            $scope.EnquiryList.push(equirydata);
        }


        if (status == 1) {
            var totaltaxamount = 0;
            totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);

            if (($scope.AvailableCreditLimit - (totalorderamount + totaltaxamount)) < 0) {
                $rootScope.ValidationErrorAlert('You do not have enough credits left in your account.Please mark as draft', 'error', 3000);
                return false;
            }
        }

        Action = "SaveEnquiryValidation";

        var Enquiry =
        {
            ServicesAction: Action,
            EnquiryList: $scope.EnquiryList

        }




        var requestData =
        {
            ServicesAction: 'GetAllTruckSizeList',
        };





        //  var stringfyjson = JSON.stringify(Enquiry);
        var jsonobject = {};
        jsonobject.Json = Enquiry;






        $scope.AllocationError = [];
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data.Json.EnquiryList;
            var enquiryListData = response.data.Json.EnquiryList;
            if (resoponsedata.length > 0) {
                $scope.AllocationError = resoponsedata[0].EnquiryProductList.filter(function (el) { return el.AllocationExcited === true; });

                if ($scope.AllocationError.length > 0) {
                    $rootScope.Throbber.Visible = false;
                    $scope.OpenEnquiryValidationpopup();
                    return false;
                }
            }
            if ($scope.EnquiryList[0].EnquiryId !== undefined && $scope.EnquiryList[0].EnquiryId !== 0 && $scope.EnquiryList[0].EnquiryId !== null) {

            } else {
                if (status == 1) {

                    $Scope.AvailableCreditLimit = $Scope.AvailableCreditLimit - totalorderamount;
                    $scope.totalorderamount = 0;
                }
            }

            $scope.RemoveInquiry(OrderGUID);

            $rootScope.Throbber.Visible = false;

            if ($scope.OrderData.length > 0) {

                var enquiryNumberList = "";
                for (var j = 0; j < enquiryListData.length; j++) {
                    enquiryNumberList = enquiryListData[j].EnquiryAutoNumber + ' , ' + enquiryNumberList;

                }

                enquiryNumberList = enquiryNumberList.trim();

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnquirySubmittedMessage, enquiryNumberList), 'error', 3000);
                $scope.IsRecalculateVisibile = false;
                $rootScope.Throbber.Visible = false;

                //$rootScope.ValidationErrorAlert('Enquiry saved successfully.', '', 3000);
                //$scope.ClearAll();
            }
            else {
                var enquiryNumberList = "";
                for (var j = 0; j < enquiryListData.length; j++) {
                    enquiryNumberList = enquiryListData[j].EnquiryAutoNumber + ' , ' + enquiryNumberList;

                }

                enquiryNumberList = enquiryNumberList.trim();

                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_EnquirySubmittedMessage, enquiryNumberList), 'error', 3000);
                $rootScope.CurrentOrderGuid = '';
                $rootScope.TemOrderData = $scope.OrderData;

            }

            if ($scope.OrderData.length === 0) {
                if ($rootScope.EditEnquiry === true) {
                    $rootScope.EditEnquiry = false;
                    if ($rootScope.RoleName === "CustomerService") {

                    } else if ($rootScope.RoleName === "Customer") {

                    }
                }
            }


        });


    }


    $scope.ClearAll = function () {
        $scope.CustomerName = "";
        $scope.TruckSize = "";
        $scope.AllocationQuantity = "";
        $scope.PONumber = "";
        $rootScope.CreditLimit = 0;
        $scope.AvailableCreditLimit = 0;
        $scope.MOTOrderJson = [];
        $scope.MotEnquiry.Comments = "";

        //$scope.OrderData = [];

        $scope.CreditLimit = 0;
        $scope.AvailableCreditLimit = 0;
        $scope.EmptiesLimit = 0;
        $scope.ActualEmpties = 0;

    }


    $scope.SingleInquiry = function (orderGUID) {
        requestData =
        {
            ServicesAction: 'LoadAvailableCreditLimitOfCustomer',
            CompanyId: $scope.CompanyId,
            EnquiryId: 0
        };


        jsonobject = {};
        jsonobject.Json = requestData;
        var LoadAvailableCreditLimitOfCustomer = GrRequestService.ProcessRequest(jsonobject);

        $q.all([
            LoadAvailableCreditLimitOfCustomer
        ]).then(function (resp) {

            var availableCreditLimit = 0;
            var responseForLoadAvailableCreditLimitOfCustomer = resp[0];

            if (responseForLoadAvailableCreditLimitOfCustomer.data !== null) {
                if (responseForLoadAvailableCreditLimitOfCustomer.data.Json != undefined || responseForLoadAvailableCreditLimitOfCustomer.data.Json != null) {
                    var resoponsedata = responseForLoadAvailableCreditLimitOfCustomer.data.Json;
                    availableCreditLimit = resoponsedata.AvailableCreditLimit;
                } else {
                    availableCreditLimit = 0;
                }
            } else {
                availableCreditLimit = 0;
            }


            availableCreditLimit = Number(availableCreditLimit) - Number(resoponsedata.TotalEnquiryCreated);
            availableCreditLimit = Number(availableCreditLimit) - Number(resoponsedata.EnquiryTotalDepositAmount);


            var requestDataLogCreditLimit =
            {
                UserId: $rootScope.UserId,
                LogGuid: orderGUID,
                ObjectId: $rootScope.EditedEnquiryId,
                ObjectType: "Load credit limit at the time of single place enquiry  : EnquiryId " + $rootScope.EditedEnquiryId,
                LoggingTypeId: 3501,
                ServicesAction: 'CreateLog',
                LogDescription: 'Load Available Credit Limit at the time of single place enquiry' + Number(availableCreditLimit) + ' UsedInEnquiryLimit ' + Number(resoponsedata.TotalEnquiryCreated) + ' and depositusedinenquiry ' + Number(resoponsedata.EnquiryTotalDepositAmount) + ' ',
                LogDate: GetCurrentdate(),
                Source: 'Portal',
            };
            var consolidateApiParamaterItemLayer =
            {
                Json: requestDataLogCreditLimit,
            };

            GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

            });


            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === orderGUID; });
            if (currentOrder.length > 0) {

                if (parseFloat(availableCreditLimit) >= parseFloat(currentOrder[0].EnquiryGrandTotalAmount)) {


                    $scope.AvailableCreditLimit = availableCreditLimit;

                    $rootScope.orderGUID = orderGUID;


                    if ($rootScope.RoleName === "CustomerService") {
                        $scope.SaveSingleInquiry(currentOrder[0].CurrentState, currentOrder, orderGUID);
                    } else {
                        if (currentOrder[0].CurrentState === 8 || currentOrder[0].CurrentState === '8') {
                            $scope.CheckDraftSingleInquiry(1, currentOrder, orderGUID);
                        }
                        else {
                            $scope.SaveSingleInquiry(1, currentOrder, orderGUID);
                        }
                    }


                } else {

                    if (parseFloat($scope.AvailableCreditLimit) > parseFloat(availableCreditLimit)) {

                        $scope.AvailableCreditLimit = availableCreditLimit;



                        $rootScope.Throbber.Visible = false;
                        $scope.IsDisabledSubmit = false;
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_AvailableCreditLimitExeededAndCreditLimitChange), 'error', 8000);
                    } else {

                        $scope.AvailableCreditLimit = availableCreditLimit;

                        $rootScope.Throbber.Visible = false;
                        $scope.IsDisabledSubmit = false;
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryPage_AvailableCreditLimitExeeded), 'error', 8000);
                    }

                }

            } else {
                $rootScope.Throbber.Visible = false;
            }
        });


    }



    //promotion   function     



    $scope.CreateTruckbyGroup = function () {

        debugger;

        $scope.OrderData = [];
        var groupNamesArray = groupBy($scope.MOTOrderJson, 'OrderGroupCode');

        var truckSize = $scope.MOTOrderJson[0].TruckSize;

        var poNumber = $scope.MOTOrderJson[0].PONumber;

        $scope.TruckSizeId = $scope.MOTOrderJson[0].TruckSizeId;
        $scope.DeliveryLocationId = $scope.MOTOrderJson[0].ShipTo;
        $scope.DeliveryLocationName = $scope.MOTOrderJson[0].DeliveryLocationName;
        $scope.DeliveryLocationCapacity = $scope.MOTOrderJson[0].Capacity;
        $scope.CompanyId = $scope.MOTOrderJson[0].CompanyId;
        $scope.TruckCapacity = (parseFloat($scope.MOTOrderJson[0].TruckCapacityWeight) * 1000);

        $scope.TruckCapacityInTone = $scope.TruckCapacity / 1000;
        $scope.TruckCapacityPalettes = $scope.MOTOrderJson[0].TruckCapacityPalettes;
        $scope.TruckCapacityWeight = $scope.MOTOrderJson[0].TruckCapacityWeight;



        if ($scope.MOTOrderJson[0].NoPalettesRequired === '1') {
            $scope.IsPalettesRequired = false;
        } else {

            $scope.IsPalettesRequired = true;
        }

        //if ($scope.Page == "UploadEnquiry") {
        //    $scope.IsPalettesRequired = false;
        //}



        for (var i = 0; i < groupNamesArray.length; i++) {


            var order = {};
            order.OrderGUID = generateGUID();
            $scope.Currguid = order.OrderGUID;
            order.TruckName = '';
            order.DeliveryLocation = $scope.DeliveryLocationId;
            order.TruckSize = truckSize;
            order.ProposedETDStr = '';
            order.EnquiryId = 0;
            order.RequestDate = $scope.ProposedDate;
            order.TotalWeight = 0;
            order.TruckCapacity = 0;
            order.TruckPallets = 0;
            order.TotalProductPallets = 0;
            order.IsTruckFull = false;
            order.TruckSizeId = $scope.TruckSizeId;
            order.SoldTo = $scope.CompanyId;
            order.PONumber = poNumber;
            order.IsActive = true;
            order.EnquiryType = 'SO';
            order.CurrentQuantity = 0;
            order.RemainingQuantity = 0;
            order.EnquiryProductList = [];
            order.OrderProductList = [];
            order.ProposedDateValue = $scope.ProposedDate;
            order.ParentCompany = $scope.ParentCompany;



            order.TruckName = truckSize;
            order.TruckCapacity = "";

            order.PONumber = poNumber;
            order.ShipTo = $scope.DeliveryLocationId;
            order.DeliveryLocationName = $scope.DeliveryLocationName;
            order.RequestDate = $scope.ProposedDate;
            order.OrderProposedETD = $scope.ProposedDate;
            order.NumberOfPalettes = 0
            order.PalletSpace = "";
            order.TruckWeight = "";
            order.CurrentState = 1

            order.IsRecievingLocationCapacityExceed = false;


            //if (productNameStr[0].Amount === undefined) {
            //    productNameStr[0].Amount = 0;
            //}


            var MOTOrderJsonByGroupCode = $scope.MOTOrderJson.filter(function (el) { return el.OrderGroupCode === groupNamesArray[i].OrderGroupCode; });



            var OrderProductList = [];

            for (var j = 0; j < MOTOrderJsonByGroupCode.length; j++) {





                var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemId == MOTOrderJsonByGroupCode[j].ItemId; });

                var product = {};
                product.EnquiryProductGUID = generateGUID();
                product.OrderGUID = order.OrderGUID;
                product.EnquiryProductId = 0;
                product.Allocation = $scope.Allocation;
                product.ItemId = MOTOrderJsonByGroupCode[j].ItemId;
                product.ParentItemId = 0;
                product.ParentProductCode = "";
                product.GratisOrderId = "";
                product.ItemName = productNameStr[0].ItemName;
                product.ProductCode = productNameStr[0].ItemCode;
                product.NumberOfExtraPalettes = $scope.NumberOfExtraPalettes;
                product.PrimaryUnitOfMeasure = productNameStr[0].UOM;
                product.ProductQuantity = MOTOrderJsonByGroupCode[j].Quantity;
                product.ActualAllocation = 0;

                if (MOTOrderJsonByGroupCode[j].Promotion == "YES") {

                    product.ItemType = 31;
                    $scope.IsPromotionItem = true;
                } else {

                    product.ItemType = 32;


                }
                product.ItemPricesPerUnit = parseFloat(parseInt(product.ItemType) == 31 ? 0 : productNameStr[0].Amount);
                product.DepositeAmount = 0;
                product.ItemTaxPerUnit = 0;
                product.ItemPrices = (parseFloat(parseInt(product.ItemType) == 31 ? 0 : productNameStr[0].Amount) * parseInt(product.ProductQuantity));
                product.DepositeAmountPerUnit = 0;
                product.ItemTotalDepositeAmount = 0;
                product.ConversionFactor = productNameStr[0].ConversionFactor;
                product.ProductType = productNameStr[0].ProductType;
                product.WeightPerUnit = productNameStr[0].WeightPerUnit;
                product.IsItemLayerAllow = 0;

                product.ItemSoldToCount = MOTOrderJsonByGroupCode[j].ItemSoldToCount;

                product.IsActive = true

                OrderProductList.push(product);










                // var dd = $scope.CheckWetherTruckIsFull(order, totalWeightWithBuffer, $scope.TruckCapacity, $scope.TruckCapacityPalettes, totalWeightWithPalettes);



            }



            order.OrderProductList = OrderProductList;



            //calculate  total weight  and get total weight

            var totalWeight = CalculateTotalWeight(order);


            //totalWeight += parseFloat(product.WeightPerUnit) * parseFloat(product.ProductQuantity);


            ////getting palletswieght from setting master table
            var totalNumberOfPalettes = CalculateExtraPalleter(order);
            var palettesWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
            if (palettesWeight.length > 0) {
                var totalWeightWithPalettes = 0;
                var weightPerPalettes = parseFloat(palettesWeight[0].SettingValue);
                if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                    totalWeightWithPalettes = (weightPerPalettes * (Math.ceil(totalNumberOfPalettes)));
                }
                totalWeight = totalWeight + totalWeightWithPalettes
            }

            order.TruckWeight = (totalWeight / 1000);

            order.NumberOfPalettes = totalNumberOfPalettes;

            if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {

                OrderProductList.push($scope.GetAddWoodenPallet(order));
            }


            //  calculate   total pallet PalletSpace

            var truckTotalPalettes = CalculateTotalPalettes(order);


            //if (parseFloat(product.ProductQuantity) > 0) {
            //    truckTotalPalettes += parseFloat(product.ProductQuantity) / parseFloat(product.ConversionFactor);
            //}

            truckTotalPalettes = parseFloat(truckTotalPalettes).toFixed(2);

            //  calculate   total  extra pallet 

            var TotalExtraPalettes = CalculateTotalExtraPalettes(order);


            //if (product.NumberOfExtraPalettes > 0) {
            //    if (parseFloat(quantity) > 0) {
            //        var totalPalets = parseFloat(product.ProductQuantity) / parseFloat(product.ConversionFactor);


            //        TotalExtraPalettes += (totalPalets / product.NumberOfExtraPalettes);
            //    }
            //}
            TotalExtraPalettes = parseFloat(TotalExtraPalettes).toFixed(2);


            var truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);
            truckTotalPalettes = parseFloat(truckTotalPalettes).toFixed(2);



            order.PalletSpace = truckTotalPalettes;


            var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'TruckBufferWeight'; });
            if (truckBufferWeight.length > 0) {
                var bufferWeight = parseFloat(truckBufferWeight[0].SettingValue);
                totalWeightWithBuffer = (parseFloat($scope.TruckCapacity) - (bufferWeight * 1000));
            }

            if ($scope.Page == "UploadEnquiry") {
                var dd1 = $scope.CalculateWetherTruckIsFull(order, totalWeightWithBuffer, $scope.TruckCapacity, $scope.TruckCapacityPalettes, totalWeightWithPalettes);
                if (dd1) {
                    order.IsTruckFull = false;
                } else {
                    order.IsTruckFull = true;
                }
            } else {
                order.IsTruckFull = true;
            }


            //if (!dd1) {

            //}
            var productListCode = "";
            var stringItemSoldToCount = order.OrderProductList.filter(function (el) { return el.ItemSoldToCount === 1; });
            if (stringItemSoldToCount.length > 0) {
                for (var k = 0; k < stringItemSoldToCount.length; k++) {
                    productListCode = stringItemSoldToCount[k].ProductCode + ' , ' + productListCode;
                }
                productListCode = productListCode.trim();
                productListCode = productListCode.replace(/,(\s+)?$/, '');



            }
            if (productListCode !== "") {
                order.ItemSoldMappingValidation = String.format($rootScope.resData.res_CreateInquiryPage_ItemSoldToMappingValidationMessage, productListCode);
                order.IsTruckFull = false;
            } else {
                order.ItemSoldMappingValidation = "";
            }

            if (order.ItemSoldMappingValidation == "" || order.ItemSoldMappingValidation == undefined) {
                if (order.IsTruckFull == false) {
                    //order.TruckOverloadedValidation = String.format($rootScope.resData.res_UploadEnquiryMOTWithPromotion_TruckOverloadedValidation);
                    order.TruckOverloadedValidation = String.format($rootScope.resData.res_CreateInquiryPage_TruckSizeValidation, parseFloat(totalWeight / 1000).toFixed(2), parseFloat(parseFloat($scope.TruckCapacity) / 1000));

                }
                else {
                    order.TruckOverloadedValidation = "";
                }
            }

            var currentOrderList = [];

            currentOrderList.push(order);

            $scope.ReloadGraph(currentOrderList, 0);

            $rootScope.CalculateAmountTaxDepositeAndDiscount(currentOrderList, $scope.Currguid);


            $scope.OrderData.push(order);

        }

        $scope.LoadAllEnquiriesTotalAmountAndCheckTruckIsFull();
        var isTruckFullList = $scope.OrderData.filter(function (el) { return el.IsTruckFull === true });
        if (isTruckFullList.length > 0) {
            $scope.IsAllTruckFull = true;
        }
        else {
            $scope.IsAllTruckFull = false;
        }
    }



    $scope.CalculateWetherTruckIsFull = function (order, totalWeightWithBuffer, truckSize, palettesWeight, totalWeightWithPalettes, ItemType) {
        var isFull = false;
        var totalpalettesWeight = 0;
        for (var i = 0; i < order.OrderProductList.length; i++) {
            if (order.OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {
                totalpalettesWeight += parseFloat(order.OrderProductList[i].ProductQuantity) / parseFloat(order.OrderProductList[i].ConversionFactor);
            }
        }

        var TotalExtraPalettes = CalculateTotalExtraPalettes(order);
        //var productNameStrupdate = currentOrder[0].OrderProductList.filter(function (el) { return parseInt(el.ItemType) === 32 && el.ProductCode !== $scope.WoodenPalletCode; });
        //if (productNameStrupdate.length > (parseInt($scope.NumberOfProductAdd) - 1)) {
        //    $scope.PalettesCorrectWeight = 0;
        //}
        //else {
        $scope.PalettesCorrectWeight = parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes);
        //}

        totalpalettesWeight = Math.ceil(parseFloat(totalpalettesWeight) - parseFloat(TotalExtraPalettes));



        var totaltruckWeight = 0;
        for (var i = 0; i < order.OrderProductList.length; i++) {
            totaltruckWeight += parseFloat(order.OrderProductList[i].WeightPerUnit) * parseFloat(order.OrderProductList[i].ProductQuantity);
        }



        //var totalNumberOfPalettes = $scope.AddExtraPalleter(currentOrder);

        var totalNumberOfPalettes = CalculateExtraPalleter(order);

        var totalWeightWithPalettes = 0;
        var palettesWeight1 = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'PalettesWeight'; });
        if (palettesWeight1.length > 0) {
            var weightPerPalettes = parseFloat(palettesWeight1[0].SettingValue);
            if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes));
            }
            totaltruckWeight = totaltruckWeight + totalWeightWithPalettes
        }



        var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
        var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();

        //$scope.ReloadGraph(order, 0);

        if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {

            //if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= truckSize) || parseInt(palettesWeight) === Math.ceil(totalpalettesWeight)) {
            //var pallet = between(parseFloat($scope.PalettesCorrectWeight), (parseFloat(palettesWeight) - parseFloat($scope.PalettesBufferWeight)), parseFloat(palettesWeight));
            var pallet = between(parseFloat($scope.PalettesCorrectWeight), (parseFloat(palettesWeight) - parseFloat($scope.PalettesBufferWeight)), parseFloat(parseFloat(palettesWeight) + parseFloat(extraPaletteBufferWeight)));

            if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight >= (truckSize + extraTruckBufferWeight))) {
                if (!pallet) {
                    isFull = true;
                }


            }


        }
        else {

            //if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight >= (truckSize + extraTruckBufferWeight))) {
            if (totaltruckWeight >= truckSize) {

                isFull = true;
            }


        }

        return isFull;
    }



    $scope.GetAddWoodenPallet = function (order) {



        var qty = order.NumberOfPalettes;

        var productNameStr = $scope.bindallproduct.filter(function (el) { return el.ItemCode === $scope.WoodenPalletCode; });
        var productNameStrupdate = order.OrderProductList.filter(function (el) { return el.ProductCode === $scope.WoodenPalletCode & parseInt(el.GratisOrderId) === 0; });

        if (productNameStrupdate.length > 0) {
            productNameStrupdate[0].ProductQuantity = parseInt(qty);
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
                IsPackingItem: "1",
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
            return products;
        }



    }




    function CalculateTotalWeight(order) {


        var totalWeight = 0;

        for (var i = 0; i < order.OrderProductList.length; i++) {

            totalWeight += parseFloat(order.OrderProductList[i].WeightPerUnit) * parseFloat(order.OrderProductList[i].ProductQuantity);

        }


        return totalWeight;
    }


    function CalculateTotalPalettes(order) {



        var total = 0;

        for (var i = 0; i < order.OrderProductList.length; i++) {

            if (order.OrderProductList[i].ProductCode !== $scope.WoodenPalletCode) {

                total += parseFloat(order.OrderProductList[i].ProductQuantity) / parseFloat(order.OrderProductList[i].ConversionFactor);
            }

        }


        return total;
    }


    function CalculateTotalExtraPalettes(order) {




        var total = 0;
        for (var i = 0; i < order.OrderProductList.length; i++) {

            if (order.OrderProductList[i].ProductCode !== $scope.WoodenPalletCode && order.OrderProductList[i].NumberOfExtraPalettes > 0) {
                var totalPalets = parseFloat(order.OrderProductList[i].ProductQuantity) / parseFloat(order.OrderProductList[i].ConversionFactor);

                total += (totalPalets / order.OrderProductList[i].NumberOfExtraPalettes);
            }


        }


        return total;
    }


    function CalculateExtraPalleter(order) {

        var TotalPalettes = 0;

        var newArr = [];
        var productList = order.OrderProductList.filter(function (el) { return el.ProductCode !== $scope.WoodenPalletCode; });
        $.each(productList, function (index, element) {
            if (newArr[element.PrimaryUnitOfMeasure] == undefined) {
                newArr[element.PrimaryUnitOfMeasure] = 0;
            }
            newArr[element.PrimaryUnitOfMeasure] += parseFloat(element.ProductQuantity) / parseFloat(element.ConversionFactor);
        });


        //if (PrimaryUnitOfMeasure !== '' && PrimaryUnitOfMeasure !== undefined) {

        //    if (newArr[PrimaryUnitOfMeasure] == undefined) {
        //        newArr[PrimaryUnitOfMeasure] = 0;
        //    }

        //    newArr[PrimaryUnitOfMeasure] += parseFloat(qty) / parseFloat(ConversionFactor);
        //}


        for (var name in newArr) {

            var value = newArr[name];
            newArr[name] = Math.ceil(value);
            TotalPalettes += Math.ceil(value);
        }


        return TotalPalettes;



    }



    function groupBy(items, OrderGroupCode) {

        var results = [];
        $.each(items, function (index, item) {

            var checkGroupExist = results.filter(function (el) { return el.OrderGroupCode === item[OrderGroupCode]; });

            if (checkGroupExist.length === 0) {
                var result = {};
                result.OrderGroupCode = item.OrderGroupCode;


                results.push(result);

            }

        });
        return results;
    }



    // Change By : Arun Dubey 
    // Change Date : 18/09/2019
    // added this function for adding one extra pallet in certain conditions (VBL SPECIFIC). Conditions are customer fron North Zone 'N1' and Truck sizes are one of this '1.5,2.5,3.5' and truck is full with only one UOM which is Crate.


    $scope.AddOneExtraPalletForSpecificTruckSizesAndSameUOM = function () {
        debugger;
        var isAddOneExtraPallet = false;
        var isTrukFull = false;
        var isOnlyCrateUomInOrder = false;
        var isTruckValid = false;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $scope.CurrentOrderGuid; });

        if (currentOrder.length > 0) {

            var currentOrderProduct = currentOrder[0].OrderProductList.filter(function (el) { return el.PrimaryUnitOfMeasure !== 'Crate' && el.ProductCode !== $scope.WoodenPalletCode });
            if (currentOrderProduct.length === 0) {
                isOnlyCrateUomInOrder = true;
            }

            if (parseFloat($scope.TruckCapacityInTone) === parseFloat('1.25') || parseFloat($scope.TruckCapacityInTone) === parseFloat('2.5') || parseFloat($scope.TruckCapacityInTone) === parseFloat('3.5')) {
                isTruckValid = true;
            }

            var totalWeight = $scope.getTotalAmount(0, 0, currentOrder, 0, 0, 0, '');
            var truckTotalPalettes = $scope.getTotalPalettes(0, 0, currentOrder, 0, 0, 0, '');

            var TotalExtraPalettes = $scope.getTotalExtraPalettes(0, 0, currentOrder, 0, 0, 0, '');
            truckTotalPalettes = parseFloat(truckTotalPalettes) - parseFloat(TotalExtraPalettes);

            var totalWeightWithPalettes = 0;
            var totalWeightWithBuffer = 0;

            var bufferWeight = $scope.LoadSettingInfoByName('TruckBufferWeight', 'float');
            if (bufferWeight !== "") {
                totalWeightWithBuffer = (parseFloat($scope.TruckCapacity) - (bufferWeight * 1000));
            }

            var weightPerPalettes = $scope.LoadSettingInfoByName('PalettesWeight', 'float');

            if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                if (weightPerPalettes !== "") {
                    totalWeightWithPalettes = (weightPerPalettes * (truckTotalPalettes));
                }
            }

            isTrukFull = $scope.CheckTruckIsFullOrNot(currentOrder, totalWeightWithBuffer, $scope.TruckCapacity, $scope.TruckCapacityPalettes, totalWeightWithPalettes, '', $scope.IsWeightLoadCheckValidation);



            if (isTrukFull === true && isTruckValid === true && isOnlyCrateUomInOrder === true && $scope.CompanyZone === 'N1') {
                isAddOneExtraPallet = true;
            } else {
                isAddOneExtraPallet = false;
            }

        }
        return isAddOneExtraPallet;
    }


    // Change By : Arun Dubey 
    // Change Date : 18/09/2019
    // added this function to check whether truck is complete or not for above function (FunctionName : AddOneExtraPalletForSpecificTruckSizesAndSameUOM).

    $scope.CheckTruckIsFullOrNot = function (currentOrder, totalWeightWithBuffer, truckSize, palettesWeight, totalWeightWithPalettes, ItemType, loadValidation) {

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
                if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {
                    totalWeightWithPalettes = (weightPerPalettes * (totalNumberOfPalettes));
                }
                totaltruckWeight = totaltruckWeight + totalWeightWithPalettes;
            }

            var extraTruckBufferWeight = $scope.TruckExtraBufferWeight();
            var extraPaletteBufferWeight = $scope.TruckExtraBufferPallet();

            if ($scope.IsPalettesRequired && $scope.IsPalletLoadCheckValidation === true) {

                var pallet = between(parseFloat($scope.PalettesCorrectWeight), (parseFloat(palettesWeight) - parseFloat($scope.PalettesBufferWeight)), parseFloat(parseFloat(palettesWeight) + parseFloat(extraPaletteBufferWeight)));
                if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight)) || pallet) {
                    isFull = true;
                }
            }
            else if ($scope.IsWeightLoadCheckValidation === true) {
                if ((totaltruckWeight >= totalWeightWithBuffer && totaltruckWeight <= (truckSize + extraTruckBufferWeight))) {
                    isFull = true;
                }
            } else {
                isFull = true;
            }
        } else {
            isFull = true;
        }
        return isFull;
    }




});