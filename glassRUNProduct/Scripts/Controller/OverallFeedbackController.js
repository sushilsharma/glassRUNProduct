angular.module("glassRUNProduct").controller('OverallFeedbackController', function ($scope, $location, $ionicPopover, $filter, $sessionStorage, $state, GrRequestService, $rootScope, $ionicModal, pluginsService) {
    
    $scope.ReasonCodeEventName = "";
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.OrderFeedbackListJson = [];
    //if ($rootScope.Throbber !== undefined) {
    //    $rootScope.Throbber.Visible = true;
    //} else {
    //    $rootScope.Throbber = {
    //        Visible: true,
    //    }
    //}

    $rootScope.GridRecallForStatus = function () {
        
        $rootScope.Throbber.Visible = false;
    }

    $scope.OldData = {
        StockLocationId: 0,
        RequestedDate: ''
    }


    $scope.FeedbackVariable = {
        OverAll: true,
        Specific: false,
        Quantity: '',
        ProductCode: '',
        Name: '',
        ItemName: '',
        myFile: '',
        fileupload: '',
        ItemFeedbackName: '',
        ItemComment: '',
        Comment: '',
        UOM: "",
        Quantity: "",
        labelItemFilename: "",
        labelFilename: "",
        ReturnQuantity: "",
        ReceiveDate: "",
        ParentId: ""

    }
    $scope.OrderItemFeedback = [];
    $scope.fileupload = {
        File: '',
        ItemFile: '',
    }

    $scope.savefeedback = function () {

        
        $scope.SaveFeedBackJson();

    }



    $scope.WoodenPalletCode = '0';

    setTimeout(function () {
        
        pluginsService.init();
    }, 200);

    $scope.Location = {
        StockLocationId: 0
    }

    $scope.bindAllSettingMaster = $sessionStorage.AllSettingMasterData;
    $scope.ItemTaxInPec = 0;

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


    var itemTaxInPec = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ItemTaxInPec'; });
    if (itemTaxInPec.length > 0) {
        $scope.ItemTaxInPec = parseFloat(itemTaxInPec[0].SettingValue);
    }

    var woodenPalletCode = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'WoodenPalletCode'; });
    if (woodenPalletCode.length > 0) {
        $scope.WoodenPalletCode = woodenPalletCode[0].SettingValue;
    }





    $scope.myFilter = function (item) {
        return item.ProductCode !== $scope.WoodenPalletCode;
    };


    $scope.Page = {
        CreditLimit: false,
        LocationCapacity: false,
        Palettes: false,
        Weight: false,
        Stock: false,
        RPMCollection: false,
        PlateNumberView: false,
        PlateNumberControl: false,
        PickupdateView: false,
        PickupdateControl: false,
        WarehouseManagerActionbtn: false,
        SchedulingDateControlfield: false,
        SchedulingDateLabel: false,
        TOActionbtn: false,
        OMActionbtn: false,
        OMActionbtnPickSlip: false,
        OMOrderEditAction: false,
        BranchPlantCode: false,
        GateKeeperActionbtn: false,
        HideForOM: false,
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.FileSize = false;
    $scope.FileType = false;
    $scope.AddItemFeedback = function () {
        
        if ($scope.FeedbackVariable.ItemName != "") {
            if ($scope.FeedbackVariable.ItemFeedbackName != "") {


                var itemCode = $scope.bindallproduct.filter(function (el) { return el.OrderProductId === $scope.FeedbackVariable.ItemName });
                var feedbackName = $scope.bindallFeedbak.filter(function (el) { return el.LookUpId === $scope.FeedbackVariable.ItemFeedbackName });
                var documentName = "";
                var documentBase64 = "";
                var documentExtension = "";
                if ($scope.fileupload.ItemFile != "") {
                    if ($scope.fileupload.ItemFile.dataFile.size > 2048000) {
                        $scope.FileSize = true;
                        documentName = $scope.fileupload.ItemFile.dataFile.name;
                        documentBase64 = $scope.fileupload.ItemFile.dataBase64;
                        documentExtension = $scope.fileupload.ItemFile.dataFile.name.split('.')[1];
                    }
                    else {
                        if ($scope.fileupload.ItemFile.dataFile.type == "application/pdf" || $scope.fileupload.ItemFile.dataFile.type == "application/docx" || $scope.fileupload.ItemFile.dataFile.type == "application/doc" || $scope.fileupload.ItemFile.dataFile.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || $scope.fileupload.ItemFile.dataFile.type == "image/png") {
                            $scope.FileType = true;
                        }
                        else {
                            $scope.FileType = false;
                        }
                        documentName = $scope.fileupload.ItemFile.dataFile.name;
                        documentBase64 = $scope.fileupload.ItemFile.dataBase64;
                        documentExtension = $scope.fileupload.ItemFile.dataFile.name.split('.')[1];

                    }
                } else {
                    documentName = "";
                    documentBase64 = "";
                    documentExtension = "";
                    $scope.FileType = true;
                    $scope.FileSize = false;
                }


                var itemFeedback = {
                    OrderItemFeedbackGUID: generateGUID(),
                    OrderId: $scope.labelOrderId,
                    OrderProductId: $scope.FeedbackVariable.ItemName,
                    ProductCode: itemCode[0].ProductCode,
                    ItemName: itemCode[0].ItemName,
                    feedbackId: $scope.FeedbackVariable.ItemFeedbackName,
                    FeedbackValue: feedbackName[0].Name,
                    Attachment: "",
                    Comment: $scope.FeedbackVariable.ItemComment,
                    UOM: itemCode[0].UOM,
                    HVBLComment: "",
                    Quantity: itemCode[0].ProductQuantity,
                    ReturnQuantity: $scope.FeedbackVariable.ReturnQuantity,
                    ReceiveDate: $scope.FeedbackVariable.ReceiveDate,
                    CreatedBy: $rootScope.UserId,
                    DocumentName: documentName,
                    DocumentsList: []
                }

                var itemDocument = {
                    DocumentName: documentName,
                    DocumentExtension: documentExtension,
                    DocumentBase64: documentBase64,
                    ObjectType: "Feedback",
                    SequenceNo: 0,
                    CreatedBy: $rootScope.UserId,
                    IsActive: 1
                }
                if ($scope.FileSize == false) {
                    if ($scope.FileType == true) {
                        itemFeedback.DocumentsList.push(itemDocument);
                        $scope.OrderItemFeedback.push(itemFeedback);
                    }
                    else {
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_FileType), 'success', 3000);
                    }
                }
                else {
                    $scope.OrderItemFeedback = [];
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_FileSize), 'success', 3000);
                }
                $scope.ClearItemFeedback();
            } else {
                //$rootScope.ValidationErrorAlert('Please select item feedback type.', 'warning', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_SelectItemFeedback), 'warning', 3000);
            }
        } else {
            //$rootScope.ValidationErrorAlert('Please select item.', 'warning', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_SelectItem), 'warning', 3000);
        }
    }

    //$ionicModal.fromTemplateUrl('templates/AddFeedback.html', {
    //    scope: $scope,
    //    animation: 'fade-in-scale',
    //    backdropClickToClose: false,
    //    hardwareBackButtonClose: false
    //}).then(function (modal) {
    //    
    //    $scope.AddFeedbackpopup = modal;
    //});

    $scope.OpenAddFeedbackpopup = function (OrderGUID) {
        

        $scope.labelOrderNumber = $rootScope.SalesOrderNumber;
        $scope.labelOrderId = $rootScope.OrderDetailId;

        var requestData =
            {
                ServicesAction: 'LoadOrderProductById',
                OrderId: $scope.labelOrderId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data;
            $scope.bindallproduct = resoponsedata.Json.OrderProductList;

            var requestDatajson =
                {
                    ServicesAction: 'LoadFeedbackByOrderId',
                    OrderId: $scope.labelOrderId
                };

            var jsonobjectdata = {};
            jsonobjectdata.Json = requestDatajson;
            GrRequestService.ProcessRequest(jsonobjectdata).then(function (response) {
                
                var resoponsedata = response.data;

                if (resoponsedata.Json != undefined) {
                    $scope.OrderFeedbackListJson = resoponsedata.Json.OrderFeedbackList;
                } else {
                    $scope.OrderFeedbackListJson = [];
                }
                $scope.FeedbackModalPopupControl = true;
            });
        });

        //  $scope.allSubFeedback = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'CustomerFeedback'; });
        $scope.bindOverAllFeedbak = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'OverallFeedback'; });
    };


    $scope.OpenAddFeedbackpopup($rootScope.OrderGUID);


    $scope.BackButton = function () {
        $state.go('CreateInquiryForSLM');
    }

    $scope.ItemSectionForFeedback = true;
    $scope.GetValueByParentid = function (parentid) {
        
        $scope.bindallFeedbak = [];
        $scope.allSubFeedback = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'CustomerFeedback'; });
        $scope.bindallFeedbak = $scope.allSubFeedback.filter(function (el) { return parseInt(el.ParentId) === parseInt(parentid) });
        if (parseInt(parentid) === 1228 || parseInt(parentid) === 1229) {
            $scope.ItemSectionForFeedback = false;
        } else {
            $scope.ItemSectionForFeedback = true;
        }
    }

    $scope.CloseAddFeedbackpopup = function () {
        
        $scope.FeedbackModalPopupControl = false;
    }

    $scope.setoverall = function () {
        $scope.FeedbackVariable.OverAll = true;
        $scope.FeedbackVariable.Specific = false;
    }
    $scope.setspecific = function () {
        $scope.FeedbackVariable.Specific = true;
        $scope.FeedbackVariable.OverAll = false;
    }

    $scope.RemoveFeedbackForItem = function (orderItemFeedbackGUID) {
        
        $scope.OrderItemFeedback = $scope.OrderItemFeedback.filter(function (el) { return el.OrderItemFeedbackGUID !== orderItemFeedbackGUID; });
    }


    
    if ($rootScope.RoleName === "WarehouseManager") {
        $scope.Page.CreditLimit = true;
        $scope.Page.LocationCapacity = true;
        $scope.Page.Palettes = true;
        $scope.Page.Weight = true;
        $scope.Page.Stock = true;
        $scope.Page.RPMCollection = false;
        $scope.Page.PlateNumberView = true;
        $scope.Page.PlateNumberfoundView = true;
        $scope.Page.PlateNumberControl = false;
        $scope.Page.SchedulingDateControlfield = false;
        $scope.Page.SchedulingDateLabel = true;
        $scope.Page.OMOrderEditAction = false;
        $scope.Page.PickupdateView = false;
        $scope.Page.PickupdateControl = true;
        $scope.Page.WarehouseManagerActionbtn = true;
        $scope.Page.TOActionbtn = false;
        $scope.Page.BranchPlantCode = false;
        $scope.Page.HideForOM = true;
        //alert($scope.orderdata.PlateNumber);
        //if ($rootScope.PlateNumber !== undefined && $rootScope.PlateNumber !== null && $rootScope.PlateNumber !== '')
        //{
        //    $scope.Page.PlateNumberfoundView = true;
        //}
        //else {
        //    $scope.Page.PlateNumberfoundView = false;
        //}
    }
    else if ($rootScope.RoleName === "TransportManager") {

        $scope.Page.Palettes = true;
        $scope.Page.Weight = true;
        $scope.Page.RPMCollection = true;
        $scope.Page.PlateNumberControl = true;
        $scope.Page.OMOrderEditAction = false;
        $scope.Page.PickupdateView = true;
        $scope.Page.TOActionbtn = true;
        $scope.Page.SchedulingDateControlfield = false;
        $scope.Page.BranchPlantCode = false;
        $scope.Page.HideForOM = true;
        $scope.Page.PlateNumberfoundView = false;
    }
    else if ($rootScope.RoleName === "GateKeeper") {

        $scope.Page.Palettes = true;
        $scope.Page.Weight = true;
        $scope.Page.RPMCollection = true;
        $scope.Page.PlateNumberControl = false;
        $scope.Page.PlateNumberView = true;
        $scope.Page.OMOrderEditAction = false;
        $scope.Page.PickupdateView = true;
        $scope.Page.TOActionbtn = false;
        $scope.Page.GateKeeperActionbtn = true;
        $scope.Page.SchedulingDateControlfield = false;
        $scope.Page.BranchPlantCode = false;
        $scope.Page.HideForOM = true;
        $scope.Page.PlateNumberfoundView = false;
    }
    else if ($rootScope.RoleName === "Carrier") {

        $scope.Page.Palettes = true;
        $scope.Page.Weight = true;
        $scope.Page.RPMCollection = true;
        $scope.Page.PlateNumberControl = false;
        $scope.Page.PlateNumberView = true;
        $scope.Page.OMOrderEditAction = false;
        $scope.Page.PickupdateView = true;
        $scope.Page.TOActionbtn = false;
        $scope.Page.GateKeeperActionbtn = true;
        $scope.Page.SchedulingDateControlfield = false;
        $scope.Page.BranchPlantCode = false;
        $scope.Page.HideForOM = true;
        $scope.Page.PlateNumberfoundView = false;
    }
    else if ($rootScope.RoleName === "CustomerService") {
        $scope.Page.CreditLimit = true;
        $scope.Page.LocationCapacity = true;
        $scope.Page.Palettes = true;
        $scope.Page.Weight = true;
        $scope.Page.Stock = false;
        $scope.Page.OMActionbtn = true;
        $scope.Page.OMActionbtnPickSlip = true;
        $scope.Page.OMOrderEditAction = true;
        $scope.Page.PlateNumberView = false;
        $scope.Page.PlateNumberControl = false;
        $scope.Page.PickupdateView = false;
        $scope.Page.PickupdateControl = false;
        $scope.Page.SchedulingDateControlfield = true;
        $scope.Page.BranchPlantCode = true;
        $scope.Page.HideForOM = false;
        $scope.Page.PlateNumberfoundView = false;
    }
    else if ($rootScope.RoleName === "Customer") {
        $scope.Page.CreditLimit = true;
        $scope.Page.LocationCapacity = true;
        $scope.Page.Palettes = true;
        $scope.Page.Weight = true;
        $scope.Page.Stock = false;
        $scope.Page.OMActionbtn = true;
        $scope.Page.OMActionbtnPickSlip = false;
        $scope.Page.OMOrderEditAction = true;
        $scope.Page.PlateNumberView = false;
        $scope.Page.PlateNumberControl = false;
        $scope.Page.PickupdateView = false;
        $scope.Page.PickupdateControl = false;
        $scope.Page.SchedulingDateControlfield = true;
        $scope.Page.BranchPlantCode = false;
        $scope.Page.HideForOM = false;
        $scope.Page.PlateNumberfoundView = false;
    }



    $scope.ActualEmptiesValidation = function () {
        if ($rootScope.ActualEmpties !== undefined) {
            if (Number($rootScope.ActualEmpties) > 0) {
                var emptiesNum = $rootScope.ActualEmpties.toString().replace("-", "");
                var emptiesValue = (Number($rootScope.ActualEmpties) * $scope.EmptiesAmount).toString().replace("-", "");
                $scope.EmptiesCss = false;
                //$scope.EmptiesLimitMessage = 'You have ' + emptiesNum + ' empties overdue for returns. Please arrange to return the empties or deposit ( ₫ ' + emptiesValue + ' ) to ensure your order gets processed.';
                $scope.EmptiesLimitMessage = String.format($rootScope.resData.res_CreateInquiryPage_EmptiesOverdue, emptiesNum, emptiesValue);
            }
            else {

                $scope.EmptiesLimitMessage = String.format($rootScope.resData.res_CreateInquiryPage_EmptiesLimit, $rootScope.ActualEmpties);
                //$scope.EmptiesLimitMessage = 'You can order for ' + $rootScope.ActualEmpties + ' more empties before you exhaust your empties limit.';
                $scope.EmptiesCss = true;
            }
        }
    }

    $scope.GetScheduleDate = function (startDate, endDate) {
        
        $('.customdate-picker').each(function () {
            
            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    
                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                        //$scope.UpdateSchedulingDateOnChange(0, dateText);
                    }
                },
                minDate: new Date(),
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


    $scope.LoadCustomerCreditLimit = function (TempCompanyId, TempCompanyMnemonic) {
        var requestData =
            {

                ServicesAction: 'GetCreditLimitFromThirthParty',

                CompanyId: $scope.TempCompanyId,
                CompanyMnemonic: $scope.TempCompanyMnemonic
            };



        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            if (response.data !== null) {
                if (response.data.Json != undefined || response.data.Json != null) {
                    var resoponsedata = response.data.Json;

                    $rootScope.CreditLimit = resoponsedata.CreditLimit;
                    $rootScope.AvailableCreditLimit = resoponsedata.AvailableCreditLimit;

                    $rootScope.EmptiesLimit = 0;
                    $rootScope.ActualEmpties = 0;
                }
            }

            requestData =
                {
                    ServicesAction: 'LoadAvailableCreditLimitOfCustomer',
                    CompanyId: $scope.TempCompanyId,
                    EnquiryId: $rootScope.TempEnquiryDetailId
                };


            jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                

                var resoponsedata = response.data.Json;
                $rootScope.EmptiesLimit = resoponsedata.EmptiesLimit;
                $rootScope.ActualEmpties = resoponsedata.ActualEmpties;


                // Save Item Layer Validation Log.
                var requestDataforItemLayer =
                    {
                        UserId: $rootScope.UserId,
                        ObjectId: $scope.TempCompanyId,
                        ObjectType: "Credit Limit Of Customer Edit Enquiry " + $rootScope.TempEnquiryDetailId + "",
                        ServicesAction: 'CreateLog',
                        LogDescription: 'Load Available Credit Limit ' + Number($rootScope.AvailableCreditLimit) + ' UsedInEnquiryLimit ' + Number(resoponsedata.TotalEnquiryCreated) + ' and depositusedinenquiry ' + Number(resoponsedata.EnquiryTotalDepositAmount) + ' ',
                        LogDate: GetCurrentdate(),
                        Source: 'Portal',
                    };
                var consolidateApiParamaterItemLayer =
                    {
                        Json: requestDataforItemLayer,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

                });


                $rootScope.AvailableCreditLimit = Number($rootScope.AvailableCreditLimit) - Number(resoponsedata.TotalEnquiryCreated);

                $rootScope.AvailableCreditLimit = Number($rootScope.AvailableCreditLimit) - Number(resoponsedata.EnquiryTotalDepositAmount);

                $scope.ActualEmptiesValidation();

            });


        });

    }

    $scope.ConvertDateFormat = function (date) {
        

        var GetScheduleDateNumber = 6;
        if ($rootScope.AllSettingMasterData != undefined) {
            var truckBufferWeight = $rootScope.AllSettingMasterData.filter(function (el) { return el.SettingParameter === 'ScheduleDateNumber'; });
            if (truckBufferWeight.length > 0) {
                GetScheduleDateNumber = parseFloat(truckBufferWeight[0].SettingValue);
            }
        }

        var proposedetd = date.split(' ');
        var etd = proposedetd[0].split('/');
        var etddate = etd[1] + "/" + etd[0] + "/" + etd[2];

        var enddate = new Date(etddate);
        enddate.setDate(enddate.getDate() + GetScheduleDateNumber);

        var dd = enddate.getDate();
        var mm = enddate.getMonth() + 1;
        var y = enddate.getFullYear();
        var SchedulingDate = dd + '/' + mm + '/' + y;

        return SchedulingDate;
    }

    $scope.CalculateTotalAmountOfProductWithTaxAndDeposite = function () {
        
        var totalorderamount = 0;
        var totalDepositeamount = 0;
        var totaltaxamount = 0;
        for (var i = 0; i < $scope.OrderData.length; i++) {
            for (var j = 0; j < $scope.OrderData[i].OrderProductsList.length; j++) {
                if (parseInt($scope.OrderData[i].OrderProductsList[j].OrderProductId) === 0) {
                    totalorderamount += parseFloat($scope.OrderData[i].OrderProductsList[j].ItemPricesPerUnit) * parseFloat($scope.OrderData[i].OrderProductsList[j].ProductQuantity);
                    totalDepositeamount += parseFloat($scope.OrderData[i].OrderProductsList[j].DepositeAmountPerUnit) * parseFloat($scope.OrderData[i].OrderProductsList[j].ProductQuantity);
                }
                else {

                    if (parseInt($scope.OrderData[i].OrderProductsList[j].OrderProductId) !== 0 && ($scope.OrderData[i].OrderProductsList[j].IsActive === true || $scope.OrderData[i].OrderProductsList[j].IsActive === 1 || $scope.OrderData[i].OrderProductsList[j].IsActive === "1")) {
                        totalorderamount += parseFloat($scope.OrderData[i].OrderProductsList[j].ItemPricesPerUnit) * parseFloat($scope.OrderData[i].OrderProductsList[j].ProductQuantity);
                        totalDepositeamount += parseFloat($scope.OrderData[i].OrderProductsList[j].DepositeAmountPerUnit) * parseFloat($scope.OrderData[i].OrderProductsList[j].ProductQuantity);
                    }
                }

            }
        }
        totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);
        $rootScope.totalorderamount = parseFloat(totalorderamount) + parseFloat(totaltaxamount) + parseFloat(totalDepositeamount);
    }
    $scope.LoadOrderData = function () {
        
        if ($rootScope.TemOrderData !== undefined) {
            if ($rootScope.TemOrderData.length > 0) {

                $scope.OrderData = $rootScope.TemOrderData.filter(function (el) { return el.OrderProductsList.length > 0 && el.IsTruckFull == true; });
                if ($scope.OrderData.length > 0) {

                    if ($scope.OrderData[0].OrderProposedETD !== "" && $scope.OrderData[0].OrderProposedETD !== undefined) {
                        $scope.SchedulingDateValue = $scope.ConvertDateFormat($scope.OrderData[0].OrderProposedETD);
                        //$scope.GetScheduleDate("", $scope.SchedulingDateValue);
                    }
                    $scope.CalculateTotalAmountOfProductWithTaxAndDeposite();

                    $scope.LoadReasonCode();

                    $rootScope.Throbber.Visible = false;
                    $scope.OldData.StockLocationId = $scope.OrderData[0].branchPlant;
                    $scope.OldData.RequestedDate = $scope.OrderData[0].OrderRequestDate;
                }
            }
            else {
                $scope.OrderData = [];

            }
        }
        else {
            $scope.OrderData = [];
        }
    }
    $scope.GetReceivingLocationBalanceCapacity = function (deliverylocationId, proposedDeliveryDate, TempCompanyId, deliverylocationCapacity, EnquiryId) {
        
        var requestData =
            {
                ServicesAction: 'GetReceivingLocationBalanceCapacity',
                CompanyId: TempCompanyId,
                ShipTo: deliverylocationId,
                ProposedDeliveryDate: proposedDeliveryDate,
                EnquiryId: 0
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data.Json.BalanceCapacity;
            $scope.DeliveryUsedCapacity = resoponsedata;
            $scope.DeliveryLocationCapacity = deliverylocationCapacity;
            $scope.LoadOrderData();

        });
    }



    $scope.OrderData = [];

    $scope.LoadData = function () {
        
        if ($rootScope.OrderDetailId !== undefined && $rootScope.OrderDetailId !== null && $rootScope.OrderDetailId !== 0) {
            

            var totalorderamount = 0;
            var TotalDepositeAmount = 0;
            $scope.PromotionItemList = [];
            $rootScope.Throbber.Visible = true;
            $scope.ShowBackButton = false;
            $scope.OrderData = [];
            var requestData =
                {
                    ServicesAction: 'LoadOrderByOrderId',
                    OrderId: $rootScope.OrderDetailId,
                    RoleId: $rootScope.RoleId,
                    CultureId: $rootScope.CultureId

                };
            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                var orderDetails = response.data.Json.OrderList;
                
                var currentStateInEditOrder = $scope.LoadSettingInfoByName('OrderEditTillStatus', 'string');
                if (currentStateInEditOrder !== "") {
                    var tempstate = currentStateInEditOrder.split(',');
                    if (tempstate !== null && tempstate !== undefined) {
                        
                        $scope.IsEditOrderConfiguration = false;
                        for (var i = 0; i < tempstate.length; i++) {
                            if (orderDetails.CurrentState == tempstate[i]) {
                                $scope.IsEditOrderConfiguration = true;
                            }
                        }
                    }
                }

                $scope.CurrentOrderGuid = generateGUID();
                $rootScope.TempCompanyId = orderDetails.CompanyID;
                $rootScope.TempCompanyMnemonic = orderDetails.CompanyMnemonic;
                $rootScope.TempCompanyType = orderDetails.CompanyType;
                


                //$rootScope.EditSelfCollectValue = orderDetails.IsSelfCollectEnquiry;


                if ($rootScope.OrderDetailId > 0) {
                    $scope.LoadCustomerCreditLimit(orderDetails.CompanyID, orderDetails.CompanyMnemonic);
                }

                
                var resoponsedata = response.data;
                $scope.bindAllBranchPlant = $rootScope.bindAllBranchPlant;
                $rootScope.LoadedAllBranchPlant = $scope.bindAllBranchPlant;


                var requestData =
                    {
                        ServicesAction: 'GetNoteByObjectId',
                        ObjectId: orderDetails.OrderId,
                        RoleId: $rootScope.RoleId,
                        ObjectType: 1221,
                        UserId: $rootScope.UserId

                    };
                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (NotesResponse) {

                    var NotesResponsedata = NotesResponse.data;
                    // var bindAllCarrier = "bindAllCarrier" + enquiryId;
                    if (NotesResponsedata.Json !== undefined) {
                        var notesData = NotesResponsedata.Json.NotesList;

                        if (notesData.length > 0) {
                            $scope.SaveNoteText = notesData[0].Note;
                            $scope.NoteId = notesData[0].NotesId;
                        } else {
                            $scope.SaveNoteText = "";
                            $scope.NoteId = 0;
                        }

                    }
                    else {
                        $scope.SaveNoteText = "";
                        $scope.NoteId = 0;
                    }


                    var requestData =
                        {
                            ServicesAction: 'LoadAllCarrierByBranchPlant',
                            branchPlantId: orderDetails.StockLocationId,
                            ShipTo: orderDetails.ShipTo,
                            TruckSizeId: orderDetails.TruckSizeId
                        };

                    // var stringfyjson = JSON.stringify(requestData);
                    var jsonobject = {};
                    jsonobject.Json = requestData;
                    GrRequestService.ProcessRequest(jsonobject).then(function (response) {

                        
                        var resoponsedata = response.data;
                        // var bindAllCarrier = "bindAllCarrier" + enquiryId;
                        if (resoponsedata.Json !== undefined) {
                            $scope.bindAllCarrierList = resoponsedata.Json.CarrierList;
                        }
                        else {
                            $scope.bindAllCarrierList = [];
                        }


                        var carrierId = '';
                        var carrierCode = '';
                        if ($scope.bindAllCarrierList.length == 1) {
                            carrierId = $scope.bindAllCarrierList[0].CompanyId;
                            carrierCode = $scope.bindAllCarrierList[0].CompanyMnemonic;
                        }


                        $scope.Location.StockLocationId = orderDetails.StockLocationId;
                        var orders = {
                            OrderGUID: $scope.CurrentOrderGuid,
                            TruckName: orderDetails.TruckSize,
                            DeliveryLocation: orderDetails.ShipTo,
                            TruckSize: orderDetails.TruckSizeId,
                            ProposedETDStr: '',
                            OrderId: orderDetails.OrderId,
                            RequestDate: orderDetails.ExpectedTimeOfDelivery,
                            OrderRequestDate: orderDetails.ExpectedTimeOfDelivery,
                            OrderProposedETD: orderDetails.OrderProposedETD,
                            GratisCode: orderDetails.GratisCode,
                            TotalWeight: 0,
                            TruckCapacity: orderDetails.TruckCapacityWeight,
                            TruckPallets: 0,
                            TotalProductPallets: 0,
                            NumberOfPalettes: orderDetails.NumberOfPalettes,
                            PalletSpace: orderDetails.PalletSpace,
                            TruckWeight: orderDetails.TruckWeight,
                            TruckCapacityPalettes: orderDetails.TruckCapacityPalettes,
                            TruckCapacityWeight: orderDetails.TruckCapacityWeight,
                            Capacity: orderDetails.Capacity,
                            Status: orderDetails.Status,
                            Class: orderDetails.Class,
                            IsTruckFull: true,
                            TruckSizeId: orderDetails.TruckSizeId,
                            ShipTo: orderDetails.ShipTo,
                            SoldTo: orderDetails.SoldTo,
                            CustomerId: orderDetails.CompanyID,
                            CompanyId: orderDetails.CompanyID,
                            CurrentState: orderDetails.CurrentState,
                            SalesOrderNumber: orderDetails.SalesOrderNumber,
                            branchPlant: orderDetails.StockLocationId,
                            IsRecievingLocationCapacityExceed: orderDetails.IsRecievingLocationCapacityExceed,
                            ReceivedCapacityPalettesCheck: orderDetails.ReceivedCapacityPalettesCheck,
                            ReceivedCapacityPalettes: orderDetails.ReceivedCapacityPalettes,
                            TruckCapacity: orderDetails.TruckCapacity,
                            IsActive: true,
                            Field1: orderDetails.Field1,
                            Field2: orderDetails.Field2,
                            Field3: orderDetails.Field3,
                            Field4: orderDetails.Field4,
                            Field5: orderDetails.Field5,
                            Field6: orderDetails.Field6,
                            Field7: orderDetails.Field7,
                            Field8: orderDetails.Field8,
                            Field9: orderDetails.Field9,
                            Field10: orderDetails.Field10,
                            carrier: carrierId,
                            CarrierCode: carrierCode,
                            DeliveryLocationName: orderDetails.DeliveryLocationName,
                            EnquiryProductList: orderDetails.OrderProductsList,
                            OrderProductsList: orderDetails.OrderProductsList,
                            ShipToCode: orderDetails.ShipToCode,
                            SoldToCode: orderDetails.SoldToCode,
                            BranchPlantCode: orderDetails.BranchPlantCode,
                            DepositeAmount: orderDetails.DepositeAmount,
                            DepositeAmountPerUnit: orderDetails.DepositeAmountPerUnit,
                            ItemTotalDepositeAmount: orderDetails.ItemTotalDepositeAmount,
                            ReturnPakageMaterialList: orderDetails.ReturnPakageMaterialList,
                            OrderDate: orderDetails.OrderDate,
                            OrderNumber: orderDetails.OrderNumber,
                            DeliveryLocationCode: orderDetails.ShipToCode,
                            CompanyMnemonic: orderDetails.SoldToCode,
                            IsSelfCollectEnquiry: orderDetails.IsSelfCollectEnquiry
                        }
                        


                        orders.OrderTime = orders.OrderDate.split('T')[1].split(':')[0];
                        orders.OrderDate = orders.OrderDate.split('T')[0];


                        //$scope.OldData.StockLocationId = orderDetails.branchPlant;
                        //$scope.OldData.RequestedDate = orderDetails.OrderRequestDate;

                        var OutOfStockItem = [];
                        for (var i = 0; i < orders.OrderProductsList.length; i++) {

                            orders.OrderProductsList[i].OrderProductGUID = generateGUID();
                            orders.OrderProductsList[i].OrderGUID = $scope.CurrentOrderGuid;
                            orders.OrderProductsList[i].GratisOrderId = parseInt(orders.OrderProductsList[i].GratisOrderId);
                            totalorderamount += parseFloat(orders.OrderProductsList[i].ItemPricesPerUnit) * parseFloat(orders.OrderProductsList[i].ProductQuantity);
                            TotalDepositeAmount += parseFloat(orders.OrderProductsList[i].DepositeAmount);
                            //var availableProductStock = orders.OrderProductList[i].CurrentStockPosition;
                            //var totalUsedQuantity = parseFloat(parseFloat(orders.OrderProductList[i].UsedQuantityInEnquiry) + parseFloat(orders.OrderProductList[i].UsedQuantityInOrder));
                            //var remainingProductStock = parseFloat(parseFloat(availableProductStock) - parseFloat(totalUsedQuantity));
                            //if (parseFloat(orders.OrderProductList[i].ProductQuantity) < remainingProductStock) {
                            //    orders.OrderProductList[i].IsItemAvailableInStock = true;
                            //} else {
                            //    orders.OrderProductList[i].IsItemAvailableInStock = false;
                            //}

                            //if (orders.OrderProductList[i].IsItemAvailableInStock === false) {
                            //    OutOfStockItem.push(orders.OrderProductList[i].EnquiryProductId);
                            //}
                            //$rootScope.OutofStockItemsList = OutOfStockItem;
                        }

                        totaltaxamount = percentage(parseFloat(totalorderamount), $scope.ItemTaxInPec);
                        var totalamount = parseFloat(totalorderamount) + parseFloat(totaltaxamount) + parseFloat(TotalDepositeAmount);
                        $rootScope.AvailableCreditLimit = $rootScope.AvailableCreditLimit;


                        
                        // Change Enquiry Date, Praposed Date And Requested Date For Draft Enquiry Only.
                        if (orders.CurrentState === '8') {

                            

                            var requestData =
                                {
                                    ServicesAction: 'GetProposedDeliveryDate',
                                    LocationId: enquiryDetails.ShipTo,
                                    DeliveryLocationCode: enquiryDetails.StockLocationId,
                                    CompanyId: enquiryDetails.CompanyID,
                                    CompanyMnemonic: enquiryDetails.SoldToCode,
                                    RuleType: 1
                                };


                            var jsonobject = {};
                            jsonobject.Json = requestData;
                            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                                
                                var responseStr = response.data.Json;

                                
                                if (responseStr.ProposedDate === '' || responseStr.ProposedDate === undefined) {

                                    var getDefaultSettingValue = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ProposedDeliveryDate'; });
                                    if (getDefaultSettingValue.length > 0) {

                                        var numberOfDaysToAdd = parseInt(getDefaultSettingValue[0].SettingValue);

                                        var someDate = new Date();
                                        someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                                        var dd = someDate.getDate();
                                        var mm = someDate.getMonth() + 1;
                                        var y = someDate.getFullYear();
                                        var someFormattedDate = dd + '/' + mm + '/' + y;
                                        $scope.ChangeProposedDate = someFormattedDate;
                                    }
                                    else {
                                        $scope.ChangeProposedDate = 'N/A'
                                    }
                                }
                                else {
                                    $scope.ChangeProposedDate = responseStr.ProposedDate;
                                }



                                orders.RequestDate = $scope.ChangeProposedDate;
                                orders.OrderProposedETD = $scope.ChangeProposedDate;

                                
                                var requestDataforupdateEnquiry =
                                    {
                                        ServicesAction: 'UpdateEnquiryProposedAndRequestedDate',
                                        EnquiryId: $rootScope.EnquiryDetailId,
                                        RequestDate: $scope.ChangeProposedDate,
                                        OrderProposedETD: $scope.ChangeProposedDate,
                                    };
                                var consolidateApiParamaterUpdateEnquiry =
                                    {
                                        Json: requestDataforupdateEnquiry,
                                    };

                                GrRequestService.ProcessRequest(consolidateApiParamaterUpdateEnquiry).then(function (responseUpdateEnquiry) {

                                    

                                });


                                $scope.OrderData.push(orders);
                                $rootScope.TemOrderData = $scope.OrderData;

                                
                                $rootScope.Throbber.Visible = false;
                                $scope.GetReceivingLocationBalanceCapacity($scope.OrderData[0].ShipTo, $scope.OrderData[0].OrderProposedETD, $scope.OrderData[0].CustomerId, orderDetails.Capacity, orderDetails.OrderId);


                            });




                        }
                        else {

                            $scope.OrderData.push(orders);
                            $rootScope.TemOrderData = $scope.OrderData;

                            
                            $rootScope.Throbber.Visible = false;
                            $scope.GetReceivingLocationBalanceCapacity($scope.OrderData[0].ShipTo, $scope.OrderData[0].OrderProposedETD, $scope.OrderData[0].CustomerId, orderDetails.Capacity, orderDetails.OrderId);

                        }


                    });





                });





            });
        } else {
            

            $scope.ActualEmptiesValidation();
            $rootScope.Throbber.Visible = false;
            $scope.GetReceivingLocationBalanceCapacity($rootScope.TemOrderData[0].ShipTo, $rootScope.TemOrderData[0].OrderProposedETD, $rootScope.TemOrderData[0].CustomerId, $rootScope.TemOrderData[0].Capacity, $rootScope.TemOrderData[0].OrderId);
            if ($rootScope.LoadedAllBranchPlant !== undefined) {
                $scope.bindAllBranchPlant = $rootScope.LoadedAllBranchPlant;
            }

            var currentStateInEditOrder = $scope.LoadSettingInfoByName('OrderEditTillStatus', 'string');
            if (currentStateInEditOrder !== "") {
                var tempstate = currentStateInEditOrder.split(',');
                if (tempstate !== null && tempstate !== undefined) {
                    
                    $scope.IsEditOrderConfiguration = false;
                    for (var i = 0; i < tempstate.length; i++) {
                        if ($rootScope.TemOrderData[0].CurrentState == tempstate[i]) {
                            $scope.IsEditOrderConfiguration = true;
                        }
                    }
                }
            }
        }

    }

    $scope.LoadData();


    $ionicModal.fromTemplateUrl('templates/ShowRPMQuantity.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.ViewRPMQuantitypopup = modal;
    });

    $scope.ShowRPMItemCollection = function () {
        

        $scope.ViewRPMQuantitypopup.show();
    }

    $scope.CloseViewRPMQuantitypopup = function () {
        
        $scope.ViewRPMQuantitypopup.hide();
    }

    $scope.UpdateOrder = function (orderId) {
        

        var orderDetails = $scope.OrderData;



        orderDetails[0].StockLocationId = $scope.Location.StockLocationId;

        var requestData =
            {
                ServicesAction: 'UpdateOrderforOM',
                OrderDetailList: orderDetails

            };


        // var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            //$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
            //$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_SavedData), '', 3000);

        });
        $state.go("OrderGrid");


    }

    $scope.OnSelectChangeBranchPlant = function (e, orderGUID) {
        
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === orderGUID; });

        var deliveryLocationCurrent = $scope.bindAllBranchPlant.filter(function (el) { return el.DeliveryLocationId === e; });
        if (deliveryLocationCurrent.length > 0) {
            currentOrder[0].BranchPlantCode = deliveryLocationCurrent[0].DeliveryLocationCode;
        }
        $scope.UpdateBranchPlantOnChange(currentOrder[0].EnquiryId, e);
        $scope.LoadAllCarrier(currentOrder[0].OrderId, currentOrder[0].branchPlant, currentOrder[0].ShipTo, currentOrder[0].TruckSizeId);
    }

    $scope.PrintPickSlipByOrderId = function (orderData) {


        

        var orderDetails = [];
        orderDetails.push(orderData);
        


        var requestData =
            {
                ServicesAction: 'PickSlipConfirmation',
                OrderDetailList: orderDetails

            };


        // var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            

            //$rootScope.ValidationErrorAlert('Print Pick Slip request placed successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_PrintPickSlip), '', 3000);

            $state.go("OMOrder");

        });



    }


    $scope.RePrintPickSlipByOrderId = function (orderId, branchPlantCode) {
        

        var PrinterDetailsData =
            {

                ServicesAction: 'GetLoadPrinterByBranchPlantCode',
                BranchPlantCode: branchPlantCode,
                OrderId: orderId
            }
        var printerjsonobject = {};
        printerjsonobject.Json = PrinterDetailsData;

        GrRequestService.ProcessRequest(printerjsonobject).then(function (response) {
            
            //Pdf Printing Code
            // $rootScope.ValidationErrorAlert('Print Pick Slip request placed successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_PrintPickSlip), '', 3000);


        });
    }




    $scope.UpdatePickingDate = function () {
        
        var orderDetails = $scope.OrderData;
        orderDetails[0].LocationType = 1
        var requestData =
            {
                ServicesAction: 'InsertPickingDate',
                WareHouseDetailList: orderDetails

            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            //$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_SavedData), '', 3000);


        });



    }

    $scope.ClickToUpdateStatusAndPlateNumber = function () {
        
        var orderDetails = $scope.OrderData;
        orderDetails[0].LocationType = 2
        var requestData =
            {
                ServicesAction: 'UpdatePickingDate',

                PlateDetailsList: orderDetails
            };
        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            // $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_SavedData), '', 3000);


        });


    }

    $scope.ShipConfirmation = function (soNumber) {
        

        var soNumberList = [];
        var soNumberJson = {
            SoNumber: soNumber
        }
        soNumberList.push(soNumberJson);
        var requestData =
            {
                ServicesAction: 'ShipConfirm',
                OrderList: soNumberList,
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            //$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_SavedData), '', 3000);


        });

    }



    $scope.EditOrder = false;
    $scope.EditOrder = function (OrderGUID) {
        
        $rootScope.OrderGui
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
        if (currentOrder.length > 0) {

            if (currentOrder[0].SalesOrderNumber != undefined && currentOrder[0].SalesOrderNumber != 0 && $rootScope.RoleName === "CustomerService") {

                $rootScope.EditedOrderId = currentOrder[0].OrderId;

                $scope.ActionButton = "Edit";
                $scope.OpenReasoncodepopup($scope.OrderData, OrderGUID, "EditOrder");
            }
            else {
                $rootScope.EditedEnquiryId = 0;
                $scope.EditOrderToUpdateData(currentOrder, OrderGUID);
            }
        }
    }



    $scope.EditOrderToUpdateData = function (orderList, OrderGUID) {
        
        if ($rootScope.RoleName === "CustomerService") {
            $rootScope.IsOrderEditedByCustomerService = true;

            var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
            if (currentOrder.length > 0) {
                $rootScope.TempCompanyId = currentOrder[0].CustomerId;
                $rootScope.TempCompanyId = currentOrder[0].CustomerId;
                $rootScope.BranchPlantCodeEdit = currentOrder[0].BranchPlantCode;
            }
        } else {
            $rootScope.IsOrderEditedByCustomerService = false;
        }



        if ($scope.OrderData[0].OrderId != undefined && $scope.OrderData[0].OrderId != 0 && $scope.OrderData[0].OrderId != "0") {
            $rootScope.SavedEditOrder = true;
        } else {
            $rootScope.SavedEditOrder = false;
        }


        $rootScope.EditOrder = true;
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === OrderGUID; });
        if (currentOrder.length > 0) {
            $rootScope.OrderCompanyId = currentOrder[0].CompanyId;
        }
        $rootScope.CurrentsalesOrderNumber = $rootScope.SalesOrderNumber;
        $rootScope.CurrentOrderGuid = OrderGUID;
        $rootScope.UpdateOrderData = $scope.OrderData;
        $state.go("UpdateOrder");
    }



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
            
            if (response != undefined) {
                $scope.ReasonCodeList = response.data.ReasonCode.ReasonCodeList;
            }


        });

    };
    
    $scope.LoadReasonCode();

    $ionicModal.fromTemplateUrl('templates/reasoncodepopup.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.reasoncodepopup = modal;
    });

    $scope.OpenReasoncodepopup = function (orderList, orderGuId, eventName) {
        
        $rootScope.ReasonCodeOrderList = orderList;
        $rootScope.orderGuId = orderGuId;
        $scope.ReasonCodeEventName = eventName;
        $scope.reasoncodepopup.show();
    }

    $scope.ClosReasoncodepopup = function () {
        
        $rootScope.ReasonCodeOrderId = 0;
        $scope.ReasonCodeJson.ReasonCode = "";
        $scope.ReasonCodeJson.ReasonDescription = "";
        $scope.ReasonCodeEventName = "";
        $scope.reasoncodepopup.hide();
    }


    $scope.ReasonCodeJson = {
        ReasonCode: '',
        ReasonDescription: ''
    }

    $scope.SaveReasonCode = function () {
        
        if ($scope.ReasonCodeJson.ReasonCode !== "") {
            var reasonCode = {
                ReasonCodeId: $scope.ReasonCodeJson.ReasonCode,
                ReasonDescription: $scope.ReasonCodeJson.ReasonDescription,
                ObjectId: $rootScope.ReasonCodeOrderList[0].OrderId,
                ObjectType: 'Order',
                EventName: $scope.ReasonCodeEventName
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
                
                $scope.EditOrderToUpdateData($rootScope.ReasonCodeOrderList, $rootScope.orderGuId);
                //$scope.UpdateOrder($rootScope.ReasonCodeOrderId);

                $scope.ReasonCodeJson.ReasonCode = "";
                $scope.ReasonCodeJson.ReasonDescription = "";
                $scope.ClosReasoncodepopup();

            });


        } else {

            //$rootScope.ValidationErrorAlert('Please select reason code.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_SelectReasonCode), '', 3000);

        }


    }


    /* view rpm */
    $scope.ViewReturnPakageMaterialListData = [];
    $ionicModal.fromTemplateUrl('templates/ShowRPMQuantity.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.ViewRPMQuantitypopup = modal;
    });

    $scope.ShowRPMItemCollection = function (OrderId) {
        
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === OrderId; });
        if (currentOrder.length > 0) {

            $scope.ViewReturnPakageMaterialListData = currentOrder[0].ReturnPakageMaterialList;
        }
        $scope.ViewRPMQuantitypopup.show();
    }

    $scope.CloseViewRPMQuantitypopup = function () {
        
        $scope.ViewRPMQuantitypopup.hide();
    }



    /* view feedback */
    $ionicModal.fromTemplateUrl('templates/ViewFeedback.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.ViewFeedbackpopup = modal;
    });

    $scope.OpenViewFeedbackpopup = function (orderId) {
        

        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === orderId; });
        if (currentOrder.length > 0) {

            $scope.labelOrderNumber = currentOrder[0].SalesOrderNumber;
            $scope.labelOrderId = currentOrder[0].OrderId;

            var requestData =
                {
                    ServicesAction: 'LoadFeedbackByOrderId',
                    OrderId: $scope.labelOrderId
                };

            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                
                var resoponsedata = response.data;
                if (resoponsedata.Json != undefined) {
                    $scope.OrderFeedbackListJson = resoponsedata.Json.OrderFeedbackList;
                    $scope.ViewFeedbackpopup.show();
                } else {
                    //$rootScope.ValidationErrorAlert('No record found.', 'success', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_NoRecordFound), 'success', 3000);

                }

            });



        }

    }

    $scope.CloseViewFeedbackpopup = function () {
        
        $scope.ViewFeedbackpopup.hide();
        $scope.popover.hide();
    }

    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function ($event, index) {
        
        $scope.FeedbackMessage.OrderFeedbackId = index;
        $scope.popover.show($event);
    };

    $scope.ClosePopOver = function () {
        
        $scope.ResetFeedbackReply();
        $scope.popover.hide();
    }


    $scope.FeedbackMessage = {
        OrderFeedbackId: 0,
        replyfeedback: ""
    }

    $scope.DownloadDocument = function (DocumentsId, OrderFeedbackId, documentName, extension) {
        

        
        var orderRequestData =
            {

                ServicesAction: 'LoadOrderFeedbackByOrderId',
                OrderFeedbackId: OrderFeedbackId

            }
        var jsonobject = {};
        jsonobject.Json = orderRequestData;
        GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {
            
            var byteCharacters1 = response.data;
            if (response.data != undefined) {


                var byteCharacters = response.data;


                var blob = new Blob([byteCharacters], {
                    type: "application/" + extension
                });
                
                // var uuid = generateUUID();
                var filName = documentName;
                saveAs(blob, filName);
            } else {
                //$rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_DocumentNotGenerated), '', 3000);
            }


        });




    }


    $scope.SaveFeedbackReply = function () {
        

        if ($scope.FeedbackMessage.replyfeedback != "") {
            var OrderFeedbackReply = {
                OrderFeedbackId: $scope.FeedbackMessage.OrderFeedbackId,
                ParentOrderFeedbackReplyId: 0,
                Comment: $scope.FeedbackMessage.replyfeedback,
                CommentBy: $rootScope.UserId,
                CreatedBy: $rootScope.UserId,
                IsActive: 1

            }

            var OrderFeedbackReplyList = [];
            OrderFeedbackReplyList.push(OrderFeedbackReply);

            var requestData =
                {
                    ServicesAction: 'SaveOrderFeedbackReply',
                    OrderFeedbackReplyList: OrderFeedbackReplyList
                };



            var consolidateApiParamater =
                {
                    Json: requestData,
                };
            
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                //$rootScope.ValidationErrorAlert('Reply saved successfully.', 'success', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_ReplySaved), 'success', 3000);



                $scope.ClosePopOver();
            });

        } else {
            //$rootScope.ValidationErrorAlert('Please add reply.', 'warning', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_AddReply), 'warning', 3000);

        }




    }


    $scope.ItemFileNameChanged = function (element) {
        
        $scope.$apply(function () {
            
            $scope.FeedbackVariable.labelItemFilename = element.files[0].name;;
        });
    }

    $scope.FileNameChanged = function (element) {
        
        $scope.$apply(function () {
            
            $scope.FeedbackVariable.labelFilename = element.files[0].name;;
        });
    }


    $scope.ResetFeedbackReply = function () {
        
        $scope.FeedbackMessage.OrderFeedbackId = 0;
        $scope.FeedbackMessage.replyfeedback = "";
    }


    $scope.calcTotalDepositeAmount = function (OrderId) {
        
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === OrderId; });
        var total = 0;

        for (var i = 0; i < currentOrder[0].OrderProductsList.length; i++) {
            total += parseFloat(currentOrder[0].OrderProductsList[i].ItemTotalDepositeAmount);
        }

        return total;
    }



    $scope.calcTotalTax = function (OrderId) {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === OrderId; });
        var total = 0;

        for (var i = 0; i < currentOrder[0].OrderProductsList.length; i++) {
            total += parseFloat(currentOrder[0].OrderProductsList[i].ItemPrices);
        }

        total = percentage(total, $scope.ItemTaxInPec);

        return total;
    }

    $scope.calcTotalAmount = function (OrderId) {
        var currentOrder = $scope.OrderData.filter(function (el) { return el.OrderId === OrderId; });
        var total = 0;

        for (var i = 0; i < currentOrder[0].OrderProductsList.length; i++) {
            total += parseFloat(currentOrder[0].OrderProductsList[i].ItemPrices);
        }

        return total;
    }

    $scope.NoteVariable = {
        NoteText: '',
        CustomerServiceNoteText: ''
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

    $scope.NotesOrderId = 0;
    $scope.OpenModelPoppupNote = function (orderId) {
        
        $scope.NotesOrderId = orderId;
        $scope.OpenAddNotesModalPopup();
        $scope.NoteVariable.NoteText = $scope.SaveNoteText;
    }

    $scope.UpdateNote = function () {

        var Notes = [];
        if ($scope.NoteVariable.CustomerServiceNoteText !== "") {
            var noteText = $scope.NoteVariable.NoteText + " " + $scope.NoteVariable.CustomerServiceNoteText;
            var noteJson = {
                RoleId: $rootScope.RoleId,
                ObjectId: $scope.NotesOrderId,
                ObjectType: 1221,
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
                    $scope.CloseAddNotesModalPopup();
                    $scope.NoteVariable.CustomerServiceNoteText = "";
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryPage_NotesUpdated), 'error', 3000);
                    $scope.NotesOrderId = 0;

                });

            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_NoteEnterValidation), 'error', 3000);
        }

    }


    $scope.SelectedItem = function (itemId) {
        
        var itemCode = $scope.bindallproduct.filter(function (el) { return el.OrderProductId === itemId });
        if (itemCode.length > 0) {
            $scope.FeedbackVariable.UOM = itemCode[0].UOM;
            $scope.FeedbackVariable.Quantity = itemCode[0].ProductQuantity;
        }

    }

    $scope.ReturnQuantityFieldDistabled = false;
    $scope.GetSelectedValue = function (selectedValue) {

        if (selectedValue == "1201") {
            $scope.ReturnQuantityFieldDistabled = true;
            $scope.FeedbackVariable.ReturnQuantity = "";
            $scope.GetScheduleDate();
        }
        else {
            $scope.ReturnQuantityFieldDistabled = false;
        }
    }

    $scope.FileSize = false;
    $scope.FileType = false;
    $scope.SaveFeedBackJson = function () {
        
        if ($scope.OrderItemFeedback.length > 0) {
            var Product =
                {
                    ServicesAction: 'Savefeedback',
                    OrderFeedbackList: $scope.OrderItemFeedback

                }
            
            var jsonobject = {};
            jsonobject.Json = Product;
            
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                
                var resoponsedata = response.data;
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_SaveFeedback), 'success', 3000);
                $state.go('CreateInquiryForSLM');
            });
        } else {
            $rootScope.ValidationErrorAlert("Please add feedback.", 'success', 3000);
        }

    }
    $scope.ClearItemFeedback = function () {
        
        $scope.FeedbackVariable.ItemName = "";
        $scope.FeedbackVariable.Name = "";
        $scope.FeedbackVariable.Comment = "";
        $scope.FeedbackVariable.Quantity = "";
        $scope.FeedbackVariable.ReturnQuantity = "";
        $scope.FeedbackVariable.ReceiveDate = "";
        $scope.FeedbackVariable.UOM = "";
        $scope.FeedbackVariable.ItemFeedbackName = "";
        $scope.FeedbackVariable.labelItemFilename = "";
        $scope.FeedbackVariable.ItemComment = "";
        $scope.fileupload.ItemFile = "";
        $scope.FeedbackVariable.labelItemFilename = "";
        $scope.ReturnQuantityFieldDistabled = false;
        $scope.ItemSectionForFeedback = true;
        $scope.ReturnQuantityFieldDistabled = false;
        angular.element("input[type='file']").val(null);

    }

    $scope.ClearFeedbackFields = function () {
        
        $scope.ClearItemFeedback();
    }

    $scope.AddMultipleFeedback = function () {
        
        $scope.AddFeedbackJson();
    }

    $scope.AddFeedbackJson = function () {
        
        var localJsonArray = [];
        if ($scope.FeedbackVariable.Name != "") {

            var feedbackguid = generateGUID();
            var documentName = "";
            var documentBase64 = "";
            var documentExtension = "";
            if ($scope.fileupload.File != "") {
                if ($scope.fileupload.File.dataFile.size > 2048000) {
                    $scope.FileSize = true;
                    documentName = $scope.fileupload.File.dataFile.name;
                    documentBase64 = $scope.fileupload.File.dataBase64;
                    documentExtension = $scope.fileupload.File.dataFile.name.split('.')[1];
                }
                else {
                    if ($scope.fileupload.File.dataFile.type == "application/pdf" || $scope.fileupload.File.dataFile.type == "application/docx" || $scope.fileupload.File.dataFile.type == "application/doc" || $scope.fileupload.File.dataFile.type == "application/doc" || $scope.fileupload.File.dataFile.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || $scope.fileupload.File.dataFile.type == "image/png") {
                        $scope.FileType = true;
                    }
                    else {
                        $scope.FileType = false;
                    }
                    $scope.FileSize = false;
                    documentName = $scope.fileupload.File.dataFile.name;
                    documentBase64 = $scope.fileupload.File.dataBase64;
                    documentExtension = $scope.fileupload.File.dataFile.name.split('.')[1];
                }
            } else {
                documentName = "";
                documentBase64 = "";
                documentExtension = "";

            }

            var itemFeedback = {
                FeedbackGuId: feedbackguid,
                OrderId: $scope.labelOrderId,
                OrderProductId: $scope.FeedbackVariable.ItemName,
                feedbackId: $scope.FeedbackVariable.Name,
                ItemFeedbackName: $scope.FeedbackVariable.ItemFeedbackName,
                Attachment: "",
                Comment: $scope.FeedbackVariable.Comment,
                ActualReceiveDate: $scope.FeedbackVariable.ReceiveDate,
                HVBLComment: "",
                Quantity: 0,
                CreatedBy: $rootScope.UserId,
                DocumentsList: []
            }

            var itemDocument = {
                DocumentName: documentName,
                DocumentExtension: documentExtension,
                DocumentBase64: documentBase64,
                ObjectType: "Feedback",
                SequenceNo: 0,
                CreatedBy: $rootScope.UserId,
                IsActive: 1
            }
            itemFeedback.DocumentsList.push(itemDocument);
        } else {

        }
        if ($scope.fileupload.File == "") {
            $scope.FileSize = false;
            $scope.FileType = true;
        }


        if ($scope.FileSize == false && $scope.FeedbackVariable.Name != "") {
            if ($scope.FileType == true) {

                $scope.OrderItemFeedback.push(itemFeedback);
                localJsonArray.push(itemFeedback);

                if ($scope.OrderItemFeedback.length > 0) {
                    var feedbackType = "";
                    var feedbackName = $scope.bindOverAllFeedbak.filter(function (el) { return el.LookUpId === itemFeedback.feedbackId });
                    if (feedbackName.length > 0) {
                        feedbackType = feedbackName[0].Name;
                    } else {
                        feedbackType = "";
                    }


                    var feedback = "";
                    var feedbackName = $scope.bindallFeedbak.filter(function (el) { return el.LookUpId === itemFeedback.ItemFeedbackName });
                    if (feedbackName.length > 0) {
                        feedback = feedbackName[0].Name;
                    } else {
                        feedback = "";
                    }



                    var item = "";
                    var feedbackName = $scope.bindallproduct.filter(function (el) { return el.OrderProductId === itemFeedback.OrderProductId });
                    if (feedbackName.length > 0) {
                        item = feedbackName[0].ItemNameCode;
                    } else {
                        item = "";
                    }
                    var date = new Date();
                    $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');

                    var feedbackjson = {
                        OrderFeedbackId: 0,
                        FeedbackGuId: feedbackguid,
                        FeedbackName: feedbackType,
                        Feedback: feedback,
                        ProductName: item,
                        Name: $rootScope.ActiveUserName,
                        Comment: $scope.FeedbackVariable.Comment,
                        ActualReceiveDate: itemFeedback.ActualReceiveDate,
                        DocumentsList: [],
                        CreatedDate: $scope.ddMMyyyy
                    }
                    var documentjson = {
                        DocumentName: itemDocument.DocumentName
                    }
                    feedbackjson.DocumentsList.push(documentjson);
                    $scope.OrderFeedbackListJson.push(feedbackjson);

                    $scope.ClearItemFeedback();
                } else {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_AddFeedback), 'success', 3000);
                }
            }
            else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_FileType), 'success', 3000);
            }
        }
        else {
            $scope.OrderItemFeedback = [];
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_FileSize), 'success', 3000);
        }
    }

    $scope.RemoveFeedback = function (FeedbackGuId, OrderFeedbackId) {
        
        if (OrderFeedbackId === 0) {
            if ($scope.OrderFeedbackListJson.length > 0) {
                $scope.OrderFeedbackListJson = $scope.OrderFeedbackListJson.filter(function (el) { return el.FeedbackGuId !== FeedbackGuId });
            }

            if ($scope.OrderItemFeedback.length > 0) {
                $scope.OrderItemFeedback = $scope.OrderItemFeedback.filter(function (el) { return el.FeedbackGuId !== FeedbackGuId });
            }
        } else {


            var Product =
                {
                    ServicesAction: 'DeleteFeedbackOrderById',
                    OrderFeedbackId: OrderFeedbackId

                }
            
            var jsonobject = {};
            jsonobject.Json = Product;
            
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                

                if ($scope.OrderFeedbackListJson.length > 0) {
                    $scope.OrderFeedbackListJson = $scope.OrderFeedbackListJson.filter(function (el) { return el.OrderFeedbackId !== OrderFeedbackId });
                }

                $rootScope.ValidationErrorAlert("Feedback deleted successfully.", 'success', 3000);

            });

        }


    }
});