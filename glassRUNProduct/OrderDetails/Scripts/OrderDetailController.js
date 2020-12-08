
angular.module("glassRUNProduct").controller('TrackInquiryOrderDetailsController', function ($scope, $rootScope, $q, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageOrderService, ManageEnquiryService) {
    debugger;

    $scope.OrgOrderList = [];
    $scope.OrderList = [];
    $scope.ShowIconOnButton = false;
    $scope.CurrentStatusCssClass = $rootScope.StatusResourcesList;
    $scope.LoggedInRoleMaterId = $rootScope.RoleId;
    var InquirySummaryData = [];

    function IsNetworkStatus() {
        return true;
    }

    $rootScope.OpenMessagePopupEvent = function (popupVisibility, text, btnName) {

        $rootScope.PopupMessageText = text;
        $rootScope.PopupMessageButtonName = btnName;
        $rootScope.ActiveCommonPopupAndOverlay = popupVisibility;
    };

    $scope.PopupOKButtonEventforLoginalert = function () {
        $rootScope.IsUserAutomaticLoggedIn = false;
        $rootScope.IsAutomaticLoginUserAndPasswordWrong = false;
        $rootScope.ActiveCommonPopupAndOverlayforLoginAlert = false;
    };


    $rootScope.LoadOrderDetails = function (orderNumber, companyCode) {

        $rootScope.Throbber.Visible = true;

        var requestData =
        {
            ServicesAction: "GetPageControlAccessByPageIdAndRoleAndUserID",
            PageName: "TrackInquiryOrderDetails",
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId
        };
        var consolidateApiParamater =
        {
            Json: requestData
        };


        var orderSearchDTO = {
            "OrderNumber": orderNumber,
            "RoleId": $rootScope.RoleId,
            "PageIndex": 0,
            "PageSize": 1
        };

        var getPageControlAccessResponse = GrRequestService.ProcessRequest(consolidateApiParamater);
        var getOrderListResponse = ManageOrderService.GetOrderList(orderSearchDTO);
        $q.all([
            getPageControlAccessResponse,
            getOrderListResponse
        ]).then(function (resp) {
            debugger;
            $scope.OrgOrderList = [];
            $scope.OrderList = [];
            var responsePageControl = resp[0];
            var data = responsePageControl.data;
            pageRoleAccessCofiguration = {};
            if (data !== null) {

                PageControlList = data.Json.PageControlList;

                for (var j = 0, len = PageControlList.length; j < len; ++j) {
                    var controlName = PageControlList[j].ControlName;
                    pageRoleAccessCofiguration[controlName] = '';
                    pageRoleAccessCofiguration[controlName] = PageControlList[j].AccessId;
                    pageRoleAccessCofiguration[controlName + 'DataSource'] = PageControlList[j].DataSource;

                }

                $scope.OrderDetailpageContrlDataAcess = pageRoleAccessCofiguration;
            } else {
                $scope.OrderDetailpageContrlDataAcess = pageRoleAccessCofiguration;
            }

            if (resp[1].data !== undefined) {
                if (resp[1].data !== null) {

                    $scope.TotalTrackOrderCount = 0;
                    var OrderItem = resp[1].data;

                    if (OrderItem.length > 0) {

                        for (var i = 0; i < OrderItem.length; i++) {
                            var Status = "";
                            var Class = "";
                            var filterData = $scope.CurrentStatusCssClass.filter(function (el) {
                                return parseInt(el.StatusId) === parseInt(OrderItem[i].CurrentState) &&
                                    parseInt(el.RoleId) === parseInt($scope.LoggedInRoleMaterId);
                            });
                            if (filterData.length > 0) {
                                Status = filterData[0].Status;
                                Class = filterData[0].Class;
                            }
                            var TotalQty = 0;

                            var OrderProduct = [];
                            var totalpartailfeedbackquantity = 0;
                            if (OrderItem[i].OrderProductList !== undefined) {

                                for (var k = 0; k < OrderItem[i].OrderProductList.length; k++) {

                                    var orderProductFeedback = [];

                                    var productreceivequantityquantity = OrderItem[i].OrderProductList[k].ProductQuantity;

                                    if (OrderItem[i].OrderFeedbackList !== undefined) {

                                        orderProductFeedback = OrderItem[i].OrderFeedbackList.filter(function (el) { return el.OrderProductId === OrderItem[i].OrderProductList[k].OrderProductId; });

                                        for (var t = 0; t < orderProductFeedback.length; t++) {

                                            var feedbackobject = orderProductFeedback[t];

                                            var feedbackName = "";
                                            var reasonCodeList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === "CustomerFeedback" && parseInt(el.ParentId) === 1502 && parseInt(el.LookUpId) === parseInt(feedbackobject.Field1); });
                                            if (reasonCodeList.length > 0) {
                                                feedbackName = reasonCodeList[0].Name;
                                            }

                                            if (feedbackobject.Quantity !== "" && feedbackobject.Quantity !== null && feedbackobject.Quantity !== undefined) {
                                                totalpartailfeedbackquantity = totalpartailfeedbackquantity + parseFloat(feedbackobject.Quantity);
                                                productreceivequantityquantity = parseFloat(productreceivequantityquantity) - parseFloat(feedbackobject.Quantity);
                                            }

                                            feedbackobject.ItemFeedbackName = feedbackobject.feedbackId;
                                            feedbackobject.FeedbackName = feedbackName;
                                            feedbackobject.ProductCode = OrderItem[i].OrderProductList[k].ProductCode;
                                            feedbackobject.ProductName = OrderItem[i].OrderProductList[k].ProductCode;
                                            feedbackobject.IsApp = "1";
                                            feedbackobject.DocumentsList = [];
                                            feedbackobject.ActualReceiveQuantity = productreceivequantityquantity;

                                        }
                                    }



                                    var OrderproductDet = {
                                        "ItemId": OrderItem[i].OrderProductList[k].OrderProductId,
                                        "ItemName": OrderItem[i].OrderProductList[k].ProductName,
                                        "ProductName": OrderItem[i].OrderProductList[k].ProductName,
                                        "ItemNameInDefaultLanguage": OrderItem[i].OrderProductList[k].ItemNameInDefaultLanguage,
                                        "ProductCode": OrderItem[i].OrderProductList[k].ProductCode,
                                        "ImageUrl": OrderItem[i].OrderProductList[k].ImageUrl,
                                        "ProductQuantity": OrderItem[i].OrderProductList[k].ProductQuantity,
                                        "ReceiveQuantity": OrderItem[i].OrderProductList[k].ProductQuantity,
                                        "ActualReceiveQuantity": productreceivequantityquantity,
                                        "UOM": OrderItem[i].OrderProductList[k].UOM,
                                        "ItemType": OrderItem[i].OrderProductList[k].ItemType == undefined ? 32 : OrderItem[i].OrderProductList[k].ItemType,
                                        "IsActive": true,
                                        "ItemPricesPerUnit": OrderItem[i].OrderProductList[k].UnitPrice,
                                        "TotalUnitPrice": OrderItem[i].OrderProductList[k].TotalUnitPrice,
                                        "ParentProductCode": OrderItem[i].OrderProductList[k].ParentProductCode,
                                        "AvailableQuantity": OrderItem[i].OrderProductList[k].AvailableQuantity,
                                        "OrderFeedbackList": orderProductFeedback,
                                        "NumberOfPromotions": parseInt(OrderItem[i].OrderProductList[k].NumberOfPromotions),
                                        "AdditionalQuantity": parseInt(OrderItem[i].OrderProductList[k].AdditionalQuantity),
                                        "PromotionRefId": OrderItem[i].OrderProductList[k].PromotionRefId,
                                        "AvailableAdditionalQuantity": parseInt(OrderItem[i].OrderProductList[k].AvailableAdditionalQuantity),
                                        "AvailableNumberOfPromotions": parseInt(OrderItem[i].OrderProductList[k].AvailableNumberOfPromotions)
                                    };

                                    if (OrderItem[i].OrderProductList[k].ProductQuantity !== undefined && OrderItem[i].OrderProductList[k].ProductQuantity !== null && OrderItem[i].OrderProductList[k].ParentProductCode === "") {
                                        TotalQty += parseFloat(OrderItem[i].OrderProductList[k].ProductQuantity);
                                    } else {
                                        if (OrderItem[i].OrderProductList[k].AdditionalQuantity !== undefined && OrderItem[i].OrderProductList[k].AdditionalQuantity !== null) {
                                            TotalQty += parseFloat(OrderItem[i].OrderProductList[k].AdditionalQuantity);
                                        }
                                    }

                                    OrderProduct.push(OrderproductDet);
                                }

                                if (TotalQty !== undefined && TotalQty !== null) {
                                    TotalQty = parseFloat(TotalQty) - parseFloat(totalpartailfeedbackquantity);
                                }

                                var isOrderShippedOverDue = false;
                                if ($scope.IsAllowSellerAction === true) {
                                    if (OrderItem[i].OrderShippedDate !== undefined && parseInt(OrderItem[i].CurrentState) === parseInt("9056")) {
                                        if (OrderItem[i].OrderShippedDate !== null && OrderItem[i].OrderShippedDate !== "") {

                                            var shippeddate = OrderItem[i].OrderShippedDate;
                                            shippeddate = new Date(shippeddate);
                                            var currentdate = new Date();

                                            var diff = Math.abs(shippeddate.getTime() - currentdate.getTime()) / 3600000;
                                            if (diff > parseInt($scope.AllowActionTime)) {
                                                isOrderShippedOverDue = true;
                                            }
                                        }
                                    }
                                }

                                var orderDocumentId = 0;
                                if (OrderItem[i].OrderDocumentList !== undefined && OrderItem[i].OrderDocumentList !== null && OrderItem[i].OrderDocumentList !== "") {
                                    if (OrderItem[i].OrderDocumentList.length > 0) {

                                        orderDocumentId = OrderItem[i].OrderDocumentList[0].OrderDocumentId;

                                    }
                                }


                                var OrderDetails = {
                                    "OrderGUID": OrderItem[i].OrderGUID,
                                    "ObjectType": "Order",
                                    "objectId": OrderItem[i].OrderId,
                                    "EnquiryAutoNumber": OrderItem[i].EnquiryAutoNumber,
                                    "ObjectAutoNumber": (OrderItem[i].OrderNumber === undefined || OrderItem[i].OrderNumber === '') ? "-" : OrderItem[i].OrderNumber,
                                    "OrderNumber": (OrderItem[i].OrderNumber === undefined || OrderItem[i].OrderNumber === '') ? "-" : OrderItem[i].OrderNumber,
                                    "SupplierslocationName": OrderItem[i].SupplierslocationName === undefined ? "-" : OrderItem[i].SupplierslocationName,
                                    "ActivityStartTime": OrderItem[i].OrderDate,
                                    "EnquiryDate": OrderItem[i].OrderDate,
                                    "RequestDate": OrderItem[i].ExpectedTimeOfDelivery,
                                    "ShipToName": OrderItem[i].ShipToName,
                                    "ShipToLocationAddress": OrderItem[i].ShipToLocationAddress,
                                    "BillTo": OrderItem[0].BillToName === undefined ? "-" : OrderItem[i].BillToName,
                                    "ShipToCode": OrderItem[i].ShipToCode,
                                    "SoldToName": OrderItem[i].SoldToName,
                                    "SupplierName": OrderItem[i].CompanyName === undefined ? "-" : OrderItem[i].CompanyName,
                                    "CompanyMnemonic": OrderItem[i].CompanyMnemonic,
                                    "CompanyCode": OrderItem[i].CompanyCode,
                                    "OrderShippedConfirmOverDue": isOrderShippedOverDue,
                                    "SoldTo": OrderItem[i].SoldTo,
                                    "IsActive": true,
                                    "OrderDate": OrderItem[i].OrderDate,
                                    "CurrentState": OrderItem[i].CurrentState,
                                    "CurrentStateDraft": OrderItem[i].CurrentStateDraft,
                                    "Status": Status === "" ? "order Confirmed" : Status,
                                    "Class": Class === "" ? "#e2c703" : Class,
                                    "ImgUrl": OrderItem[i].ImgUrl === undefined ? "img/CustomerAppIcons/OrderFlow/Asset 107.png" : OrderItem[i].ImgUrl,
                                    "Field7": OrderItem[i].Field7 === null ? "0" : OrderItem[i].Field7,
                                    "TotalQuantity": TotalQty,
                                    "TotalPrice": OrderItem[i].TotalPrice,
                                    "IsItemPriceZero": OrderItem[i].IsAnyItemPriceZero,
                                    "InquiryDescription": (OrderItem[i].Description1 === undefined || OrderItem[i].Description1 === '') ? "-" : OrderItem[i].Description1,
                                    "ProductList": OrderProduct,
                                    "PhoneNumber": OrderItem[i].Field10,
                                    "ReasonCodeList": OrderItem[i].ReasonCodeList,
                                    "Priority": OrderItem[i].Priority,
                                    "OrderDocumentId": orderDocumentId
                                };

                                $scope.OrderList.push(OrderDetails);

                            }

                            $scope.OrgOrderList = angular.copy($scope.OrderList);
                            $scope.TotalTrackOrderCount = $scope.OrgOrderList.length;

                        }

                        if (OrderItem.length > 0) {
                            $scope.currentIndex = $scope.currentIndex + 1;
                        }



                        $rootScope.FinalOrderJson = $scope.OrderList;
                        InquirySummaryData = $rootScope.FinalOrderJson;
                        $scope.loadinquiryData(InquirySummaryData);
                        $scope.IsResponseCompleted = true;
                        $('#Order_Details_Panel').addClass('open');
                        var scrollablediv = angular.element(document.querySelector('.control_tower_slider_panel'));
                        scrollablediv[0].scrollTop = 0;
                        $rootScope.Throbber.Visible = false;

                    }

                } else {
                    $scope.OrgOrderList = [];
                    $scope.OrderList = [];
                }
            } else {
                $scope.OrgOrderList = [];
                $scope.OrderList = [];
            }


        });

    };


    $rootScope.IsSupplierSelectionRequiredOnHomePage = false;
    $scope.PartialReceiveOrderConfirmationPopupView = false;
    $scope.OpenSortingPopupView = false;
    $rootScope.SelectedStatusCode = "";
    $scope.PartialReceiveOrderInfo = "";

    $rootScope.IsOrderReceiveBySeller = false;

    $scope.urlhost = $location.url();
    var URLSplit = $scope.urlhost.split("/");
    var controllerName = '';
    if (URLSplit.length > 0) {
        controllerName = URLSplit[URLSplit.length - 1];
    }




    $scope.IsOrderReceiveConfirmationExist = false;
    $rootScope.GetSettingValue = function (SettingParameter) {
        var settingvalue = "0";
        if ($sessionStorage.AllSettingMasterData != undefined) {
            var redirectTime = $sessionStorage.AllSettingMasterData.filter(function (el) {
                return el.SettingParameter === SettingParameter;
            });
            if (redirectTime.length > 0) {
                settingvalue = redirectTime[0].SettingValue;
            }
        }
        return settingvalue;
    };
    var SettingValue = $rootScope.GetSettingValue('IsOrderReceiveConfirmation');
    if (SettingValue == '1') {
        $scope.IsOrderReceiveConfirmationExist = true;
    } else {
        $scope.IsOrderReceiveConfirmationExist = false;
    }

    $scope.CurrentStatusCssClass = [];
    $scope.DistinctStatusListWithCode = [];


    $rootScope.showBackButton = true;

    $scope.ShowIconOnButton = true;

    /* $scope.PhoneNumber = "+84 54321 09876"; */


    $scope.SummaryPageData = {
        Suppliername: '',
        locationName: '',
        ShilpTo: '',
        ShipToLocationAddress: '',
        BillTo: '',
        InquiryNumber: '',
        InquiryDescription: '',
        InquiryDate: '',
        RequestDate: '',
        Totalproducts: '',
        Totalquantity: '',
        ProductList: [],
        Class: '',
        Status: '',
        CurrentState: '',
        TotalPrice: '',
        ObjectType: '',
        objectId: '',
        PhoneNumber: '',
        NewRequestDate: '',
        NewTotal: '',
        ReasonCodes: '',
        SoldTo: ''
    };

    $scope.OpenConfirmationPopup = false;
    $rootScope.ShowConfirmationPopup = function () {
        $scope.OpenConfirmationPopup = true;
    };

    $scope.IsOrderReceiveConfirmationExist = false;
    var SettingValue = $rootScope.GetSettingValue('IsOrderReceiveConfirmation');
    if (SettingValue == '1') {
        $scope.IsOrderReceiveConfirmationExist = true;
    } else {
        $scope.IsOrderReceiveConfirmationExist = false;
    }

    $scope.IsPartialOrderReceiveConfirmationExist = false;
    var SettingValue = $rootScope.GetSettingValue('IsPartialOrderReceiveConfirmation');
    if (SettingValue == '1') {
        $scope.IsPartialOrderReceiveConfirmationExist = true;
    } else {
        $scope.IsPartialOrderReceiveConfirmationExist = false;
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    $scope.DateParse = function (datetime) {

        var current_datetime = "";
        if (datetime !== "" && datetime !== null && datetime !== undefined) {
            if (datetime.indexOf("T") > -1) {
                var splitdatetime = datetime.split('T');
                var newdatetime = splitdatetime[0] + ' ' + splitdatetime[1];
                current_datetime = new Date(newdatetime.replace(/-/g, '/'));
            } else {
                current_datetime = new Date(datetime);
            }

        }

        return current_datetime;
    };

    $scope.CustomerActivePromotionGroupList = [];

    $scope.GetCustomerActivePromotionGroupList = function () {


        var members = angular.copy($scope.SummaryPageData.ProductList);
        members = members.filter(function (el) { return el.PromotionRefId !== "" && el.PromotionRefId !== null && el.PromotionRefId !== undefined; });
        var myArray = [];

        angular.forEach(members, function (item) {

            var myArray11 = angular.copy(myArray);
            var ext = myArray11.filter(function (el) { return el.PromotionRefId === item.PromotionRefId; })[0];

            if (!ext) {

                var tmpArr = {};
                tmpArr.PromotionRefId = item.PromotionRefId;
                tmpArr.ComboProductQuantity = item.NumberOfPromotions;
                tmpArr.AvailableComboProductQuantity = item.AvailableNumberOfPromotions;

                tmpArr.CustomerActivePromotionList = [];

                var existing = angular.copy(members);
                existing = existing.filter(function (i) { return i.PromotionRefId === item.PromotionRefId; });

                if (existing.length > 0) {
                    tmpArr.CustomerActivePromotionList = existing;
                }

                myArray.push(tmpArr);

            }

        });

        angular.forEach(myArray, function (item) {

            angular.forEach(item.CustomerActivePromotionList, function (itm) {

                itm.ComboQty = itm.NumberOfPromotions;
                itm.AvailableComboQty = itm.AvailableNumberOfPromotions;

                itm.ProductQuantity = parseInt(itm.ProductQuantity) - parseInt(itm.AdditionalQuantity);
                itm.AvailableQuantity = parseInt(itm.AvailableQuantity) - parseInt(itm.AvailableAdditionalQuantity);

                if (itm.ParentProductCode !== "" && itm.ParentProductCode !== null && itm.ParentProductCode !== undefined) {
                    itm.Action = "G";
                } else {
                    itm.Action = "B";
                    if (itm.Amount === 0 || itm.Amount === "0" || itm.Amount === "0.00" || itm.Amount === undefined || itm.Amount === null) {
                        item.PriceNotAvailable = true;
                    } else {
                        item.PriceNotAvailable = false;
                    }
                    item.AvailableComboProductQuantity = itm.AvailableNumberOfPromotions;
                }

            });


        });

        return myArray;

    };

    $scope.SetPromotionItem = function () {

        $scope.CustomerActivePromotionGroupList = $scope.GetCustomerActivePromotionGroupList();
        /*angular.forEach($scope.SummaryPageData.ProductList, function(item) {

            item.PromotionItemList = $scope.loadPromotionItem(item.ProductCode);

        });*/

    };

    $scope.loadPromotionItem = function (productCode) {

        var itemList = angular.copy($scope.SummaryPageData.ProductList);
        var finallst = [];

        if (productCode !== undefined && productCode !== null && productCode !== '') {

            if (itemList !== undefined) {

                if (itemList.length > 0) {

                    finallst = itemList.filter(function (el) { return el.ParentProductCode === productCode; });

                }

            }

        }

        return finallst;

    };

    $scope.DisplayReasonCode = function (reasonCodeList) {

        var reasonCodes = "";
        if (reasonCodeList !== undefined) {
            if (reasonCodeList.length > 0) {

                var lkpList = angular.copy($rootScope.AllLookUpData);
                lkpList = lkpList.filter(function (el) {
                    return el.LookupCategoryName === reasonCodeList[reasonCodeList.length - 1].EventName;
                });

                angular.forEach(reasonCodeList, function (item) {

                    for (var i = 0; i < lkpList.length; i++) {

                        if (item.ReasonCodeId === parseInt(lkpList[i].LookUpId)) {
                            if (lkpList[i].Code === "Other") {
                                reasonCodes = reasonCodes + "," + item.ReasonDescription;
                            } else {
                                reasonCodes = reasonCodes + "," + lkpList[i].Name;
                            }
                            break;
                        }

                    }

                });
            }
        }

        if (reasonCodes !== "" && reasonCodes !== null && reasonCodes !== undefined) {

            var myOriginalString = reasonCodes;
            var lastString = myOriginalString.substring(1);

            reasonCodes = lastString;

        }

        $scope.SummaryPageData.ReasonCodes = reasonCodes;

    };

    $scope.loadinquiryData = function (SummeryData) {


        var inqueryDetails = SummeryData;
        $rootScope.Throbber.Visible = true;
        $scope.orgEnquiryData = angular.copy(inqueryDetails);

        if (inqueryDetails.length > 0) {
            $scope.SummaryPageData = {
                Suppliername: inqueryDetails[0].SupplierName,
                SupplierslocationName: inqueryDetails[0].SupplierslocationName,
                ShilpTo: inqueryDetails[0].ShipToName,
                ShipToLocationAddress: inqueryDetails[0].ShipToLocationAddress,
                BillTo: inqueryDetails[0].BillTo,
                InquiryNumber: inqueryDetails[0].ObjectAutoNumber,
                InquiryDescription: inqueryDetails[0].InquiryDescription,
                InquiryDate: $scope.DateParse(inqueryDetails[0].EnquiryDate),
                RequestDate: $scope.DateParse(inqueryDetails[0].RequestDate),
                Totalproducts: inqueryDetails[0].ProductList.length,
                Totalquantity: inqueryDetails[0].TotalQuantity,
                ProductList: inqueryDetails[0].ProductList,
                CurrentState: inqueryDetails[0].CurrentState,
                Class: inqueryDetails[0].Class,
                Status: inqueryDetails[0].Status,
                TotalPrice: inqueryDetails[0].TotalPrice,
                IsItemPriceZero: inqueryDetails[0].IsItemPriceZero,
                ObjectType: inqueryDetails[0].ObjectType,
                objectId: inqueryDetails[0].objectId,
                PhoneNumber: inqueryDetails[0].PhoneNumber,
                OrderShippedConfirmOverDue: inqueryDetails[0].OrderShippedConfirmOverDue,
                NewRequestDate: $scope.DateParse(inqueryDetails[0].NewRequestDate),
                NewTotal: inqueryDetails[0].NewTotal,
                ReasonCodes: '',
                SoldTo: inqueryDetails[0].SoldToName,
                Priority: inqueryDetails[0].Priority,
                OrderDocumentId: inqueryDetails[0].OrderDocumentId
            };

            $scope.SetPromotionItem();


            angular.forEach($scope.SummaryPageData.ProductList, function (item) {

                if (isNaN(item.AdditionalQuantity) === false) {

                    if (parseInt(item.AdditionalQuantity) !== 0) {
                        item.ProductQuantity = parseInt(item.AdditionalQuantity);
                        /*item.AvailableQuantity = parseInt(item.AvailableAdditionalQuantity);*/
                    }

                }

            });

            $scope.DisplayReasonCode(inqueryDetails[0].ReasonCodeList);

        } else {
            $scope.ProductList = [];
            $scope.SummaryPageData = {
                Suppliername: '',
                locationName: '',
                ShilpTo: '',
                ShipToLocationAddress: '',
                BillTo: '',
                InquiryNumber: '',
                InquiryDescription: '',
                InquiryDate: '',
                RequestDate: '',
                Totalproducts: '',
                Totalquantity: '',
                Class: '',
                Status: '',
                CurrentState: '',
                OrderShippedConfirmOverDue: false,
                ProductList: [],
                TotalPrice: '',
                ObjectType: '',
                objectId: '',
                PhoneNumber: '',
                NewRequestDate: '',
                NewTotal: '',
                ReasonCodes: '',
                SoldTo: ''
            };


        }

        $rootScope.Throbber.Visible = false;
    };







    $rootScope.SelectedOrderId = 0;
    $rootScope.SelectedOrderNumber = "";
    $rootScope.SelectedOrderStatus = "";
    $rootScope.SelectedCurrentState = "";
    $rootScope.SelectedOrderJson = [];
    $rootScope.BackFromOrderSurveyPage = false;

    $scope.OpenPartialOrderReceiveConfirmationPopup = function () {
        $scope.PartialReceiveOrderInfo = $rootScope.SelectedOrderJson;
        $scope.PartialReceiveOrderConfirmationPopupView = true;
        $scope.OpenSortingPopupView = true;
    };

    $scope.ClosePartialOrderReceiveConfirmationPopup = function () {
        $scope.PartialReceiveOrderInfo = "";
        $scope.PartialReceiveOrderConfirmationPopupView = false;
        $scope.OpenSortingPopupView = false;
    };

    $scope.GoToPartialReceiveScreen = function () {
        $rootScope.IsClickByPartialReceive = true;
        $rootScope.IsClickByFullReceive = false;
        $scope.ClosePartialOrderReceiveConfirmationPopup();
        $scope.toggle_OrderDetail_sidebar();
        $rootScope.OrderDetailJson = "";
        $scope.OpenOrderPartialReceive($rootScope.SelectedOrderJson, $rootScope.SelectedOrderId);
    };

    $scope.OrderRecieve = function (orderId, orderNumber, orderStatus, orderCurrentState, isPartialReceive) {

        $rootScope.SelectedOrderId = orderId;
        $rootScope.SelectedOrderNumber = orderNumber;
        $rootScope.SelectedOrderStatus = orderStatus;
        $rootScope.SelectedCurrentState = orderCurrentState;

        if ($scope.orgEnquiryData.length > 0) {
            $rootScope.SelectedOrderJson = angular.copy($rootScope.OrderDetailJson);
        }

        if ($rootScope.SelectedUserPersonaMasterId === '1') {
            $rootScope.IsOrderReceiveBySeller = true;
        } else {
            $rootScope.IsOrderReceiveBySeller = false;
        }

        if (isPartialReceive === false) {
            $rootScope.OrderProductFeedbackJsonList = [];
            $rootScope.IsClickByPartialReceive = false;
            $rootScope.IsClickByFullReceive = true;
            //$state.go('app.OrderSurvey');
            $scope.toggle_OrderDetail_sidebar();
            $scope.UpdateOrderReceiveData($rootScope.SelectedOrderJson, $rootScope.SelectedOrderId);
        } else {
            $scope.OpenPartialOrderReceiveConfirmationPopup();
        }

    };

    $scope.CancelInquiryOrder = {
        ObjectType: "",
        CancelNote: ""
    };

    $scope.LoadReasonCodes = function (categoryName) {
        var reasonCodeList = angular.copy($rootScope.AllLookUpData);
        reasonCodeList = reasonCodeList.filter(function (el) {
            return el.LookupCategoryName === categoryName;
        });
        $scope.ReasonCodes.ReasonCodeList = reasonCodeList;
    };

    $scope.SelectedRejectOrderJson = {};

    $scope.OpenRejectOrderPopup = function (objTrackOrder) {


        $scope.ReasonCodes = {
            ReasonCodeList: [],
            ReasonCodeId: '',
            IsShowReasonTextBox: true,
            TotalEnquiriesCount: 0,
            TotalPrice: 0,
            ProductCount: 0,
            RequestDate: '',
            SoldToName: '',
            ReasonDescription: '',
            ValidationMsg: '',
            OrderNumber: '',
            OrderId: 0,
            TotalQuantity: 0,
            PriorityRating: 0
        };

        $scope.SelectedRejectOrderJson = objTrackOrder;

        $scope.ReasonCodes.OrderId = objTrackOrder.objectId;
        $scope.ReasonCodes.OrderNumber = objTrackOrder.InquiryNumber;

        objTrackOrder.ShowQuickAction = false;

        $scope.ReasonCodes.IsShowReasonTextBox = false;
        $scope.LoadReasonCodes("RejectDelivery");
        $scope.OpenSortingPopupView = true;
        $scope.RejectReasonCodeOrderPopup = true;
        $scope.SomethingWentWrongPopup = false;
    };

    $scope.CloseRejectOrderPopup = function () {
        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;
        $scope.OpenSortingPopupView = false;
        $scope.RejectReasonCodeOrderPopup = false;
        $scope.SomethingWentWrongPopup = false;
        $scope.ReasonCodes = {
            ReasonCodeList: [],
            ReasonCodeId: '',
            IsShowReasonTextBox: true,
            TotalEnquiriesCount: 0,
            TotalPrice: 0,
            ProductCount: 0,
            RequestDate: '',
            SoldToName: '',
            ReasonDescription: '',
            ValidationMsg: '',
            OrderNumber: '',
            OrderId: 0,
            TotalQuantity: 0,
            PriorityRating: 0
        };
    };





    $scope.OnChangeReasonCode = function () {

        var reasonCodeList = angular.copy($scope.ReasonCodes.ReasonCodeList);
        reasonCodeList = reasonCodeList.filter(function (el) {
            return el.LookUpId === $scope.ReasonCodes.ReasonCodeId;
        });
        if (reasonCodeList !== undefined) {
            if (reasonCodeList.length > 0) {
                if (reasonCodeList[0].Code === "Other") {
                    $scope.ReasonCodes.IsShowReasonTextBox = true;
                } else {
                    $scope.ReasonCodes.IsShowReasonTextBox = true;
                }
            } else {
                $scope.ReasonCodes.IsShowReasonTextBox = true;
            }
        } else {
            $scope.ReasonCodes.IsShowReasonTextBox = true;
        }

    };

    $scope.SaveReasonCodeForRejectOrder = function () {



        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;

        var reasonCodes = angular.copy($scope.ReasonCodes.ReasonCodeList);

        reasonCodes = reasonCodes.filter(function (el) {
            return el.Selected === true;
        });

        var ReasonCodeList = [];

        if (reasonCodes !== undefined) {

            if (reasonCodes.length > 0) {

                for (var i = 0; i < reasonCodes.length; i++) {

                    var reasonDescription = "";
                    if (reasonCodes[i].Code === "Other") {
                        if ($scope.ReasonCodes.ReasonDescription === "" || $scope.ReasonCodes.ReasonDescription === null || $scope.ReasonCodes.ReasonDescription === undefined) {
                            $rootScope.Throbber.Visible = false;
                            $scope.PleaseSpecifyReasonDescription = false;
                            break;
                        } else {
                            reasonDescription = $scope.ReasonCodes.ReasonDescription;
                        }
                    }


                    var reasonCodeObj = {};
                    reasonCodeObj.ReasonCodeId = parseInt(reasonCodes[i].LookUpId);
                    reasonCodeObj.ReasonDescription = reasonDescription;
                    reasonCodeObj.CreatedBy = parseInt($rootScope.UserId);
                    reasonCodeObj.EventName = "RejectDelivery";

                    ReasonCodeList.push(reasonCodeObj);

                }

            } else {
                $scope.IsAnyReasonCodeSelected = false;
                $rootScope.Throbber.Visible = false;
                return false;
            }

        } else {
            $scope.IsAnyReasonCodeSelected = false;
            $rootScope.Throbber.Visible = false;
            return false;

        }

        if ($scope.PleaseSpecifyReasonDescription === false || $scope.IsAnyReasonCodeSelected === false) {
            return false;
        }

        if ($scope.PleaseSpecifyReasonDescription === true && $scope.IsAnyReasonCodeSelected === true) {

            if (IsNetworkStatus() === true) {

                var requestDataForOrderDetails = {};
                $scope.SomethingWentWrongPopup = true;
                requestDataForOrderDetails = {
                    RoleId: parseInt($scope.LoggedInRoleMaterId),
                    OrderNumber: $scope.ReasonCodes.OrderNumber,
                    CurrentState: 9099,
                    ReasonCodeList: ReasonCodeList
                };

                var ActionForOrderServices = ManageOrderService.UpdateRejectOrder(requestDataForOrderDetails);
                $q.all([
                    ActionForOrderServices
                ]).then(function (resp) {

                    $scope.SomethingWentWrongPopup = false;
                    var response = resp[0];
                    if (response.data !== undefined) {
                        if (response.data.OrderNumber !== undefined) {
                            if (response.data.OrderNumber === $scope.ReasonCodes.OrderNumber) {

                                /*var checkforOrder = angular.copy($scope.orgEnquiryData);*/

                                var filterData = $scope.CurrentStatusCssClass.filter(function (el) {
                                    return parseInt(el.StatusId) === parseInt(response.data.CurrentState) &&
                                        parseInt(el.RoleId) === parseInt($scope.LoggedInRoleMaterId);
                                });

                                var Status = "";
                                var Class = "";

                                if (filterData.length > 0) {
                                    Status = filterData[0].Status;
                                    Class = filterData[0].Class;
                                }

                                if ($scope.orgEnquiryData.length > 0) {
                                    $scope.orgEnquiryData[0].CurrentState = parseInt(response.data.CurrentState);
                                    $scope.orgEnquiryData[0].Status = Status;
                                    $scope.orgEnquiryData[0].Class = Class;

                                    InquirySummaryData[0].CurrentState = parseInt(response.data.CurrentState);
                                    InquirySummaryData[0].Status = Status;
                                    InquirySummaryData[0].Class = Class;

                                    $scope.loadinquiryData(InquirySummaryData);

                                }

                                var activePromoList = angular.copy($scope.SelectedRejectOrderJson.ProductList);
                                //$scope.UpdateActivePromotionInSqlLiteNew(activePromoList, $rootScope.UserId);

                                $scope.CloseRejectOrderPopup();

                                $rootScope.OpenMessagePopupEvent(true, String.format($rootScope.resData.res_TrackOrder_AlertMsgForDeliveryRejected), 'OK');

                                //UpdateStatusInSqlLite($scope.orgEnquiryData, 'Orders', $rootScope.UserId);

                            }

                        }
                    }

                });

            } else {
                $rootScope.OpenMessagePopupEvent(true, String.format($rootScope.resData.res_TrackOrder_AlertMsgForNointerNet), 'OK');
            }

        }

    };

    $scope.SelectReasonCodes = function (object) {

        var ss = object;
        object.Selected ? object.Selected = false : object.Selected = true;


        var reasonCodeList = angular.copy($scope.ReasonCodes.ReasonCodeList);
        reasonCodeList = reasonCodeList.filter(function (el) {
            return el.Code === "Other" && el.Selected === true;
        });
        if (reasonCodeList !== undefined) {
            if (reasonCodeList.length > 0) {
                $scope.ReasonCodes.IsShowReasonTextBox = true;
            } else {
                $scope.ReasonCodes.IsShowReasonTextBox = false;
            }
        } else {
            $scope.ReasonCodes.IsShowReasonTextBox = false;
        }

        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;

    };

    $scope.SelectedCancelInquiryOrderJson = {};

    $scope.OpenCancelInquiryOrderPopup = function (objTrackOrder, objType) {


        $scope.ReasonCodes = {
            ReasonCodeList: [],
            ReasonCodeId: '',
            IsShowReasonTextBox: true,
            TotalEnquiriesCount: 0,
            TotalPrice: 0,
            ProductCount: 0,
            RequestDate: '',
            SoldToName: '',
            ReasonDescription: '',
            ValidationMsg: '',
            OrderNumber: '',
            OrderId: 0,
            TotalQuantity: 0,
            PriorityRating: 0
        };

        $scope.CancelInquiryOrder = {
            ObjectType: "",
            CancelNote: ""
        };

        $scope.SelectedCancelInquiryOrderJson = objTrackOrder;

        $scope.ReasonCodes.OrderId = objTrackOrder.objectId;
        $scope.ReasonCodes.OrderNumber = objTrackOrder.InquiryNumber;

        objTrackOrder.ShowQuickAction = false;

        $scope.ReasonCodes.IsShowReasonTextBox = false;

        if (objType === "Inquiry") {
            $scope.LoadReasonCodes("CancelInquiry");

            $scope.CancelInquiryOrder = {
                ObjectType: "Inquiry",
                CancelNote: String.format($rootScope.resData.res_TrackOrder_CancelInquiryPopupMsg)
            };

        } else {

            if ($rootScope.SelectedUserPersonaMasterId === '1') {
                $scope.LoadReasonCodes("CancelOrderBySeller");
            } else {
                $scope.LoadReasonCodes("CancelOrderByBuyer");
            }

            $scope.CancelInquiryOrder = {
                ObjectType: "Order",
                CancelNote: String.format($rootScope.resData.res_TrackOrder_CancelOrderPopupMsg)
            };

        }

        $scope.OpenSortingPopupView = true;
        $scope.CancelInquiryOrderReasonCodePopup = true;
        $scope.SomethingWentWrongPopup = false;
    };

    $scope.CloseCancelOrderInquiryPopup = function () {
        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;
        $scope.OpenSortingPopupView = false;
        $scope.CancelInquiryOrderReasonCodePopup = false;
        $scope.SomethingWentWrongPopup = false;
        $scope.ReasonCodes = {
            ReasonCodeList: [],
            ReasonCodeId: '',
            IsShowReasonTextBox: true,
            TotalEnquiriesCount: 0,
            TotalPrice: 0,
            ProductCount: 0,
            RequestDate: '',
            SoldToName: '',
            ReasonDescription: '',
            ValidationMsg: '',
            OrderNumber: '',
            OrderId: 0,
            TotalQuantity: 0,
            PriorityRating: 0
        };
    };

    $scope.SaveReasonCodeForCancelOrderInquiry = function () {
        if ($scope.CancelInquiryOrder.ObjectType === "Inquiry") {

            $scope.SaveReasonCodeForCancelInquiry();

        } else if ($scope.CancelInquiryOrder.ObjectType === "Order") {

            $scope.SaveReasonCodeForCancelOrder();

        }

    };

    $scope.SaveReasonCodeForCancelInquiry = function () {

        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;

        $rootScope.Throbber.Visible = true;

        var reasonCodes = angular.copy($scope.ReasonCodes.ReasonCodeList);

        reasonCodes = reasonCodes.filter(function (el) {
            return el.Selected === true;
        });

        var ReasonCodeList = [];

        if (reasonCodes !== undefined) {

            if (reasonCodes.length > 0) {

                for (var i = 0; i < reasonCodes.length; i++) {

                    var reasonDescription = "";
                    if (reasonCodes[i].Code === "Other") {
                        if ($scope.ReasonCodes.ReasonDescription === "" || $scope.ReasonCodes.ReasonDescription === null || $scope.ReasonCodes.ReasonDescription === undefined) {
                            $rootScope.Throbber.Visible = false;
                            $scope.PleaseSpecifyReasonDescription = false;
                            break;
                        } else {
                            reasonDescription = $scope.ReasonCodes.ReasonDescription;
                        }
                    }

                    var reasonCodeObj = {};
                    reasonCodeObj.ReasonCodeId = parseInt(reasonCodes[i].LookUpId);
                    reasonCodeObj.ReasonDescription = reasonDescription;
                    reasonCodeObj.CreatedBy = parseInt($rootScope.UserId);
                    reasonCodeObj.EventName = "CancelInquiry";

                    ReasonCodeList.push(reasonCodeObj);

                }
                $scope.IsAnyReasonCodeSelected = true;

            } else {
                $scope.IsAnyReasonCodeSelected = false;
                $rootScope.Throbber.Visible = false;
                return false;
            }

        } else {
            $scope.IsAnyReasonCodeSelected = false;
            $rootScope.Throbber.Visible = false;
            return false;

        }

        if ($scope.PleaseSpecifyReasonDescription === false || $scope.IsAnyReasonCodeSelected === false) {
            $rootScope.Throbber.Visible = false;
            return false;
        }


        if ($scope.PleaseSpecifyReasonDescription === true && $scope.IsAnyReasonCodeSelected === true) {
            if (IsNetworkStatus() === true) {

                var requestDataForOrderDetails = {};
                $scope.SomethingWentWrongPopup = true;
                requestDataForOrderDetails = {
                    RoleId: parseInt($scope.LoggedInRoleMaterId),
                    EnquiryAutoNumber: $scope.ReasonCodes.OrderNumber,
                    CurrentState: 9049,
                    LoginId: parseInt($rootScope.UserId),
                    ReasonCodeList: ReasonCodeList
                };

                var ActionForOrderServices = ManageEnquiryService.UpdateCancelInquiry(requestDataForOrderDetails);
                $q.all([
                    ActionForOrderServices
                ]).then(function (resp) {



                    $scope.SomethingWentWrongPopup = false;
                    var response = resp[0];
                    if (response.data !== undefined) {
                        if (response.data.EnquiryAutoNumber !== undefined) {
                            if (response.data.EnquiryAutoNumber === $scope.ReasonCodes.OrderNumber) {

                                /*var checkforOrder = angular.copy($scope.orgEnquiryData);*/

                                var filterData = $scope.CurrentStatusCssClass.filter(function (el) {
                                    return parseInt(el.StatusId) === parseInt(response.data.CurrentState) &&
                                        parseInt(el.RoleId) === parseInt($scope.LoggedInRoleMaterId);
                                });

                                var Status = "";
                                var Class = "";

                                if (filterData.length > 0) {
                                    Status = filterData[0].Status;
                                    Class = filterData[0].Class;
                                }

                                var activePromoList = angular.copy($scope.SelectedCancelInquiryOrderJson.ProductList);
                                //$scope.UpdateActivePromotionInSqlLiteNew(activePromoList, $rootScope.UserId);

                                $rootScope.Throbber.Visible = false;

                                if ($scope.orgEnquiryData.length > 0) {
                                    $scope.orgEnquiryData[0].CurrentState = parseInt(response.data.CurrentState);
                                    $scope.orgEnquiryData[0].Status = Status;
                                    $scope.orgEnquiryData[0].Class = Class;

                                    InquirySummaryData[0].CurrentState = parseInt(response.data.CurrentState);
                                    InquirySummaryData[0].Status = Status;
                                    InquirySummaryData[0].Class = Class;

                                    $scope.loadinquiryData(InquirySummaryData);

                                }

                                $scope.CloseCancelOrderInquiryPopup();


                                if (response.data.OrderNumber === "-") {
                                    $rootScope.OpenMessagePopupEvent(true, String.format($rootScope.resData.res_TrackOrder_InquiryCancelled), 'OK');
                                } else {

                                    var Alertmsg = String.format($rootScope.resData.res_TrackOrder_InquiryCancelledAfterOrderCreated, response.data.OrderNumber);
                                    $rootScope.OpenMessagePopupEvent(true, String.format(Alertmsg), 'OK');
                                }

                                //UpdateStatusInSqlLite($scope.orgEnquiryData, 'Enquiry', $rootScope.UserId);

                            } else {
                                $rootScope.Throbber.Visible = false;
                            }

                        } else {
                            $rootScope.Throbber.Visible = false;
                        }
                    } else {
                        $rootScope.Throbber.Visible = false;
                    }

                });

            } else {
                $rootScope.Throbber.Visible = false;
                $rootScope.OpenMessagePopupEvent(true, String.format($rootScope.resData.res_TrackOrder_AlertMsgForNointerNet), 'OK');
            }
        } else {
            $rootScope.Throbber.Visible = false;
        }

    };

    $scope.SaveReasonCodeForCancelOrder = function () {

        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;

        $rootScope.Throbber.Visible = true;

        var reasonCodes = angular.copy($scope.ReasonCodes.ReasonCodeList);

        reasonCodes = reasonCodes.filter(function (el) {
            return el.Selected === true;
        });

        var ReasonCodeList = [];

        if (reasonCodes !== undefined) {

            if (reasonCodes.length > 0) {

                for (var i = 0; i < reasonCodes.length; i++) {

                    var reasonDescription = "";
                    if (reasonCodes[i].Code === "Other") {
                        if ($scope.ReasonCodes.ReasonDescription === "" || $scope.ReasonCodes.ReasonDescription === null || $scope.ReasonCodes.ReasonDescription === undefined) {
                            $rootScope.Throbber.Visible = false;
                            $scope.PleaseSpecifyReasonDescription = false;
                            break;
                        } else {
                            reasonDescription = $scope.ReasonCodes.ReasonDescription;
                        }
                    }

                    var reasonCodeObj = {};
                    reasonCodeObj.ReasonCodeId = parseInt(reasonCodes[i].LookUpId);
                    reasonCodeObj.ReasonDescription = reasonDescription;
                    reasonCodeObj.CreatedBy = parseInt($rootScope.UserId);

                    if ($rootScope.SelectedUserPersonaMasterId === '1') {
                        reasonCodeObj.EventName = "CancelOrderBySeller";
                    } else {
                        reasonCodeObj.EventName = "CancelOrderByBuyer";
                    }

                    ReasonCodeList.push(reasonCodeObj);

                }

                $scope.IsAnyReasonCodeSelected = true;

            } else {
                $scope.IsAnyReasonCodeSelected = false;
                $rootScope.Throbber.Visible = false;
                return false;
            }

        } else {
            $scope.IsAnyReasonCodeSelected = false;
            $rootScope.Throbber.Visible = false;
            return false;

        }

        if ($scope.PleaseSpecifyReasonDescription === false || $scope.IsAnyReasonCodeSelected === false) {
            $rootScope.Throbber.Visible = false;
            return false;
        }


        if ($scope.PleaseSpecifyReasonDescription === true && $scope.IsAnyReasonCodeSelected === true) {
            if (IsNetworkStatus() === true) {

                var requestDataForOrderDetails = {};
                $scope.SomethingWentWrongPopup = true;
                requestDataForOrderDetails = {
                    RoleId: parseInt($scope.LoggedInRoleMaterId),
                    OrderNumber: $scope.ReasonCodes.OrderNumber,
                    CurrentState: 9098,
                    ReasonCodeList: ReasonCodeList
                };

                var ActionForOrderServices = ManageOrderService.UpdateCancelOrder(requestDataForOrderDetails);
                $q.all([
                    ActionForOrderServices
                ]).then(function (resp) {

                    $scope.SomethingWentWrongPopup = false;
                    var response = resp[0];
                    if (response.data !== undefined) {
                        if (response.data.OrderNumber !== undefined) {
                            if (response.data.OrderNumber === $scope.ReasonCodes.OrderNumber) {

                                /*var checkforOrder = angular.copy($scope.orgEnquiryData);*/

                                var filterData = $scope.CurrentStatusCssClass.filter(function (el) {
                                    return parseInt(el.StatusId) === parseInt(response.data.CurrentState) &&
                                        parseInt(el.RoleId) === parseInt($scope.LoggedInRoleMaterId);
                                });

                                var Status = "";
                                var Class = "";

                                if (filterData.length > 0) {
                                    Status = filterData[0].Status;
                                    Class = filterData[0].Class;
                                }

                                $rootScope.Throbber.Visible = false;

                                if ($scope.orgEnquiryData.length > 0) {
                                    $scope.orgEnquiryData[0].CurrentState = parseInt(response.data.CurrentState);
                                    $scope.orgEnquiryData[0].Status = Status;
                                    $scope.orgEnquiryData[0].Class = Class;

                                    InquirySummaryData[0].CurrentState = parseInt(response.data.CurrentState);
                                    InquirySummaryData[0].Status = Status;
                                    InquirySummaryData[0].Class = Class;

                                    $scope.loadinquiryData(InquirySummaryData);

                                }

                                var activePromoList = angular.copy($scope.SelectedCancelInquiryOrderJson.ProductList);
                                //$scope.UpdateActivePromotionInSqlLiteNew(activePromoList, $rootScope.UserId);

                                $scope.CloseCancelOrderInquiryPopup();

                                //UpdateStatusInSqlLite($scope.orgEnquiryData, 'Orders', $rootScope.UserId);

                                $scope.OpenSuccessMsgPopup("Cancel");

                            }

                        }
                    }

                });

            } else {
                $rootScope.Throbber.Visible = false;
                $scope.OpenSuccessMsgPopup("Offline");
            }
        } else {
            $rootScope.Throbber.Visible = false;
        }

    };

    $scope.OpenSuccessMsgPopup = function (popupPurpose) {
        $scope.PopupPurpose = popupPurpose;
        $rootScope.Throbber.Visible = false;
        $scope.SuccessMsgPopup = true;
    };

    $scope.SuccessMsgPopupOKButtonEvent = function () {

        $scope.SuccessMsgPopup = false;
        $scope.PopupPurpose = "";
        $scope.toggle_OrderDetail_sidebar();
        $scope.RefreshDataGrid();
    };

    $rootScope.PopupOKButtonEvent = function () {
        $rootScope.ActiveCommonPopupAndOverlay = false;
        $scope.toggle_OrderDetail_sidebar();
        $scope.RefreshDataGrid();
    };

    $scope.OrderShippedJson = {};
    $scope.OpenOrderShippedConfirmationPopupView = function (objTrackOrder) {

        $scope.OrderShippedJson = objTrackOrder;
        objTrackOrder.ShowQuickAction = false;

        $scope.OrderShippedConfirmationPopupView = true;
        $scope.OpenSortingPopupView = true;

    };

    $scope.CloseOrderShippedConfirmationPopupView = function () {

        $scope.OrderShippedJson = {};
        $scope.OrderShippedConfirmationPopupView = false;
        $scope.OpenSortingPopupView = false;

    };

    $scope.MarkOrderAsShipped = function (orderShippedJson) {
        if (IsNetworkStatus() === true) {

            $scope.OrderShippedConfirmationPopupView = false;
            $scope.OpenSortingPopupView = false;
            $rootScope.Throbber.Visible = true;

            var requestData = {
                OrderId: orderShippedJson.objectId,
                CurrentState: 9056,
                MarkOrderAsShipped: true,
                LoginId: parseInt($rootScope.UserId),
                OrderNumber: orderShippedJson.InquiryNumber

            };

            ManageOrderService.MarkSingleOrderAsShipped(requestData).then(function (response) {

                var filterData = $scope.CurrentStatusCssClass.filter(function (el) {
                    return (parseInt(el.StatusId) === parseInt(response.data.CurrentState)) &&
                        parseInt(el.RoleId) === parseInt($scope.LoggedInRoleMaterId);
                });

                var Status = "";
                var Class = "";

                if (filterData.length > 0) {
                    Status = filterData[0].Status;
                    Class = filterData[0].Class;
                }

                if ($scope.orgEnquiryData.length > 0) {
                    $scope.orgEnquiryData[0].CurrentState = parseInt(response.data.CurrentState);
                    $scope.orgEnquiryData[0].Status = Status;
                    $scope.orgEnquiryData[0].Class = Class;

                    InquirySummaryData[0].CurrentState = parseInt(response.data.CurrentState);
                    InquirySummaryData[0].Status = Status;
                    InquirySummaryData[0].Class = Class;


                }

                $rootScope.Throbber.Visible = false;
                $scope.OpenSuccessMsgPopup("Shipped");

            }).catch(function (response) {
                $rootScope.Throbber.Visible = false;
                $scope.OpenSuccessMsgPopup("Error");
            });

        } else {
            $scope.OpenSuccessMsgPopup("Offline");
        }

    };

    $scope.SelectedRejectInquiryJson = {};

    $scope.OpenRejectInquiryPopup = function (objTrackOrder) {

        if (IsNetworkStatus() === true) {

            $scope.ReasonCodes = {
                ReasonCodeList: [],
                ReasonCodeId: '',
                IsShowReasonTextBox: true,
                TotalEnquiriesCount: 0,
                TotalPrice: 0,
                ProductCount: 0,
                RequestDate: '',
                SoldToName: '',
                ReasonDescription: '',
                ValidationMsg: '',
                OrderNumber: '',
                OrderId: 0,
                TotalQuantity: 0,
                PriorityRating: 0
            };

            $scope.SelectedRejectInquiryJson = objTrackOrder;

            $scope.ReasonCodes.OrderId = objTrackOrder.objectId;
            $scope.ReasonCodes.OrderNumber = objTrackOrder.InquiryNumber;

            objTrackOrder.ShowQuickAction = false;

            $scope.ReasonCodes.IsShowReasonTextBox = false;
            $scope.LoadReasonCodes("RejectEnquiry");
            $scope.OpenSortingPopupView = true;
            $scope.OpenFilteringSelectionPopupView = false;
            $scope.RejectReasonCodeInquiryPopup = true;
            $scope.SomethingWentWrongPopup = false;

        } else {
            $scope.OpenSomethingWentWrongPopup("Offline");
        }

    };

    $scope.CloseRejectInquiryPopup = function () {
        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;
        $scope.OpenSortingPopupView = false;
        $scope.OpenFilteringSelectionPopupView = false;
        $scope.RejectReasonCodeInquiryPopup = false;
        $scope.SomethingWentWrongPopup = false;
        $scope.ReasonCodes = {
            ReasonCodeList: [],
            ReasonCodeId: '',
            IsShowReasonTextBox: true,
            TotalEnquiriesCount: 0,
            TotalPrice: 0,
            ProductCount: 0,
            RequestDate: '',
            SoldToName: '',
            ReasonDescription: '',
            ValidationMsg: '',
            OrderNumber: '',
            OrderId: 0,
            TotalQuantity: 0,
            PriorityRating: 0
        };
    };

    $scope.SaveReasonCodeForRejectInquiry = function () {
        $rootScope.Throbber.Visible = true;
        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;
        var reasonCodes = angular.copy($scope.ReasonCodes.ReasonCodeList);

        reasonCodes = reasonCodes.filter(function (el) {
            return el.Selected === true;
        });

        var ReasonCodeList = [];

        if (reasonCodes !== undefined) {

            if (reasonCodes.length > 0) {

                for (var i = 0; i < reasonCodes.length; i++) {

                    var reasonDescription = "";
                    if (reasonCodes[i].Code === "Other") {
                        if ($scope.ReasonCodes.ReasonDescription === "" || $scope.ReasonCodes.ReasonDescription === null || $scope.ReasonCodes.ReasonDescription === undefined) {
                            $rootScope.Throbber.Visible = false;
                            $scope.PleaseSpecifyReasonDescription = false;
                            break;
                        } else {
                            reasonDescription = $scope.ReasonCodes.ReasonDescription;
                        }
                    }

                    var reasonCodeObj = {};
                    reasonCodeObj.ReasonCodeId = parseInt(reasonCodes[i].LookUpId);
                    reasonCodeObj.ReasonDescription = reasonDescription;
                    reasonCodeObj.CreatedBy = parseInt($rootScope.UserId);
                    reasonCodeObj.EventName = "RejectEnquiry";

                    ReasonCodeList.push(reasonCodeObj);

                }

                $scope.IsAnyReasonCodeSelected = true;

            } else {
                $scope.IsAnyReasonCodeSelected = false;
                $rootScope.Throbber.Visible = false;
                return false;
            }

        } else {
            $scope.IsAnyReasonCodeSelected = false;
            $rootScope.Throbber.Visible = false;
            return false;

        }

        if ($scope.PleaseSpecifyReasonDescription === false || $scope.IsAnyReasonCodeSelected === false) {
            return false;
        }

        if ($scope.PleaseSpecifyReasonDescription === true && $scope.IsAnyReasonCodeSelected === true) {
            if (IsNetworkStatus() === true) {

                var requestDataForOrderDetails = {};

                requestDataForOrderDetails = {
                    RoleId: parseInt($scope.LoggedInRoleMaterId),
                    EnquiryAutoNumber: $scope.ReasonCodes.OrderNumber,
                    CurrentState: 9050,
                    LoginId: parseInt($rootScope.UserId),
                    ReasonCodeList: ReasonCodeList
                };

                var ActionForOrderServices = ManageEnquiryService.UpdateCancelInquiry(requestDataForOrderDetails);
                $q.all([
                    ActionForOrderServices
                ]).then(function (resp) {

                    var response = resp[0];
                    if (response.data !== undefined) {
                        if (response.data.EnquiryAutoNumber !== undefined) {
                            if (response.data.EnquiryAutoNumber === $scope.ReasonCodes.OrderNumber) {

                                var activePromoList = angular.copy($scope.SelectedRejectInquiryJson.ProductList);
                                //$scope.UpdateActivePromotionInSqlLiteNew(activePromoList, $rootScope.UserId);

                                $scope.CloseRejectInquiryPopup();
                                $rootScope.Throbber.Visible = false;
                                $scope.OpenSomethingWentWrongPopup("RejectSingle");

                            }

                        }
                    }

                });

            } else {
                $scope.OpenSomethingWentWrongPopup("Offline");
            }
        }

    };

    $scope.ApproveOrderJson = {};
    $scope.OpenConfirmationPopupView = function (objTrackOrder) {

        if (IsNetworkStatus() === true) {
            $scope.ApproveOrderJson = objTrackOrder;
            objTrackOrder.ShowQuickAction = false;

            $scope.ConfirmationPopupView = true;
            $scope.OpenSortingPopupView = true;
        } else {
            $scope.OpenSomethingWentWrongPopup("Offline");
        }

    };

    $scope.CloseConfirmationPopupView = function () {

        $scope.ApproveOrderJson = {};
        $scope.ConfirmationPopupView = false;
        $scope.OpenSortingPopupView = false;

    };

    $scope.ApproveEnquirySelectedInquiry = function (enquiryAutoNumber) {
        if (IsNetworkStatus() === true) {

            if (enquiryAutoNumber !== "" && enquiryAutoNumber !== undefined && enquiryAutoNumber !== null) {

                var settingValue = 0;
                var SettingValue = $rootScope.GetSettingValue('DefaultLeadTime');
                if (SettingValue !== '0') {
                    settingValue = SettingValue;
                }

                $scope.ConfirmationPopupView = false;
                $scope.OpenSortingPopupView = false;
                $rootScope.Throbber.Visible = true;

                var requestData = {
                    EnquiryAutoNumber: enquiryAutoNumber,
                    UserName: $rootScope.UserName,
                    UserId: $rootScope.UserId,
                    LoginId: parseInt($rootScope.UserId),
                    DefaultLeadTime: settingValue

                };

                var consolidateApiParamater = {
                    Json: requestData
                };
                ManageEnquiryService.EnquiryApproval(consolidateApiParamater).then(function (response) {

                    $rootScope.Throbber.Visible = false;

                    if (response.data !== undefined) {
                        if (response.data.OrderNumber !== undefined) {
                            $scope.ApprovedOrderNumber = response.data.OrderNumber;
                        } else {
                            $scope.ApprovedOrderNumber = "";
                        }
                    } else {
                        $scope.ApprovedOrderNumber = "";
                    }

                    $scope.ApproveRejectEdits = {
                        Msg: String.format($rootScope.resData.res_InquirySummary_ApproveEdits)
                    };

                    $scope.OpenSomethingWentWrongPopup("ApproveSingle");

                }).catch(function (response) {
                    $scope.ApprovedOrderNumber = "";
                    $rootScope.Throbber.Visible = false;
                    $scope.OpenSomethingWentWrongPopup("Error");
                });

            }

        } else {
            $scope.OpenSomethingWentWrongPopup("Offline");
        }

    };

    $scope.OpenSomethingWentWrongPopup = function (popupPurpose) {
        $scope.PopupPurpose = popupPurpose;
        $rootScope.Throbber.Visible = false;
        $scope.SomethingWentWrongPopup = true;
    };

    $rootScope.BackFromTrackInquiryOrderDetailsPage = function () {

        var redirectPage = $rootScope.RedirectFromTrackInquiryOrderDetailsPage;
        if (redirectPage !== "") {

            $rootScope.RedirectFromTrackInquiryOrderDetailsPage = "";
            $state.go(redirectPage);

        } else {
            $state.go('app.HomePage');
        }


    };

    $scope.SomethingWentWrongPopupOKButtonEvent = function () {

        $scope.SomethingWentWrongPopup = false;

        if ($scope.PopupPurpose !== "Offline") {

            $scope.PopupPurpose = "";
            $state.go('app.ManageCustomerInquiries');

        }

    };



    $scope.DateParseformate = function (datetime) {
        var testDate = datetime.split('T');
        var splitdate = testDate[0].split('-');
        var Newdate = splitdate[1] + '/' + splitdate[2] + '/' + splitdate[0];

        var current_datetime = new Date(Newdate);

        var formatted_date = (current_datetime.getDate() < 10 ? '0' : '') + current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear();
        console.log(formatted_date);
        return formatted_date;
    };

    $scope.RdirecttoEditEnquiry = function (EnquiryNumber, RequestDate) {

        if (IsNetworkStatus() === true) {
            if (RequestDate !== undefined && RequestDate !== null) {
                if (EnquiryNumber !== undefined && EnquiryNumber !== null && EnquiryNumber !== '') {
                    $rootScope.EnquiryAutonumber = EnquiryNumber;
                    $rootScope.IsRedirecttoEditEnquiry = true;
                    $scope.CloseEditInquiryConfirmationPopupView();
                    $state.go("app.EditEnquiry");
                }

                /*var date = $scope.DateParseformate(RequestDate)
                var varDate = new Date(date); //dd-mm-YYYY
                var today = new Date();
                varDate = varDate.setHours(0, 0, 0, 0);
                today = today.setHours(0, 0, 0, 0);
                if (varDate >= today) {
                } else {

                }*/
            }

        } else {
            $scope.OpenSomethingWentWrongPopup("Offline");
        }

    };

    $scope.ShowBtns = function (object) {

        var currentStatusList = [740, 9099, 130, 980, 9098, 999, 9049, 990, 9050, 1031, 9006, 730, 9061];
        var isExist = true;
        if ((object.CurrentState === 1031 || object.CurrentState === 9006) && $rootScope.RedirectFromTrackInquiryOrderDetailsPage !== 'app.ManageCustomerInquiries') {
            isExist = true;
        } else if ((object.CurrentState === 720 || object.CurrentState === 9056) && $rootScope.RedirectFromTrackInquiryOrderDetailsPage !== 'app.TrackOrder' && $rootScope.RedirectFromTrackInquiryOrderDetailsPage !== 'app.HomePage' && $rootScope.RedirectFromTrackInquiryOrderDetailsPage !== 'app.ManageCustomerOrder') {
            isExist = false;
        } else if ((object.CurrentState === 720 || object.CurrentState === 9056) && $rootScope.RedirectFromTrackInquiryOrderDetailsPage === 'app.ManageCustomerOrder' && object.OrderShippedConfirmOverDue === false && $scope.IsPartialOrderReceiveConfirmationExist === true) {
            isExist = false;
        } else if (currentStatusList.indexOf(object.CurrentState) !== -1) {
            isExist = false;
        }


        return isExist;

    };

    $scope.SetTextColor = function (AvailableQuantity, oldQuantity) {



        var className = false;

        if (parseInt(AvailableQuantity) === parseInt(oldQuantity)) {
            className = false;
        } else {
            className = true;
        }

        return className;

    };

    $scope.ApproveRejectEdits = {
        Msg: ''
    };

    $scope.ApproveEditJson = {};
    $scope.OpenApproveEditConfirmationPopupView = function (objTrackOrder) {

        $scope.ApproveEditJson = objTrackOrder;
        objTrackOrder.ShowQuickAction = false;

        var productJson = angular.copy(objTrackOrder.ProductList);
        productJson = productJson.filter(function (el) { return (parseInt(el.AvailableQuantity) === 0); });
        if (productJson !== undefined) {
            if (productJson.length === objTrackOrder.ProductList.length) {
                $scope.ApproveCanceledEditConfirmationPopupView = true;
                $scope.OpenSortingPopupView = true;
            }
            else {
                $scope.ApproveEditConfirmationPopupView = true;
                $scope.OpenSortingPopupView = true;
            }
        }
        else {
            $scope.ApproveEditConfirmationPopupView = true;
            $scope.OpenSortingPopupView = true;
        }

    };

    $scope.CloseApproveEditConfirmationPopupView = function () {

        $scope.ApproveEditJson = {};
        $scope.ApproveEditConfirmationPopupView = false;
        $scope.ApproveCanceledEditConfirmationPopupView = false;
        $scope.OpenSortingPopupView = false;

    };

    $scope.EditInquiryRejectJson = {};

    $scope.OpenEditInquiryRejectPopup = function (objTrackOrder) {


        $scope.ReasonCodes = {
            ReasonCodeList: [],
            ReasonCodeId: '',
            IsShowReasonTextBox: true,
            TotalEnquiriesCount: 0,
            TotalPrice: 0,
            ProductCount: 0,
            RequestDate: '',
            SoldToName: '',
            ReasonDescription: '',
            ValidationMsg: '',
            OrderNumber: '',
            OrderId: 0,
            TotalQuantity: 0,
            PriorityRating: 0
        };

        $scope.EditInquiryRejectJson = objTrackOrder;

        $scope.ReasonCodes.OrderId = objTrackOrder.objectId;
        $scope.ReasonCodes.OrderNumber = objTrackOrder.InquiryNumber;

        objTrackOrder.ShowQuickAction = false;

        $scope.ReasonCodes.IsShowReasonTextBox = false;
        $scope.LoadReasonCodes("RejectEditByBuyer");
        $scope.OpenSortingPopupView = true;
        $scope.OpenFilteringSelectionPopupView = false;
        $scope.EditInquiryRejectReasonCodePopup = true;
        $scope.SomethingWentWrongPopup = false;
    };

    $scope.CloseEditInquiryRejectPopup = function () {
        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;
        $scope.OpenSortingPopupView = false;
        $scope.OpenFilteringSelectionPopupView = false;
        $scope.EditInquiryRejectReasonCodePopup = false;
        $scope.SomethingWentWrongPopup = false;
        $scope.ReasonCodes = {
            ReasonCodeList: [],
            ReasonCodeId: '',
            IsShowReasonTextBox: true,
            TotalEnquiriesCount: 0,
            TotalPrice: 0,
            ProductCount: 0,
            RequestDate: '',
            SoldToName: '',
            ReasonDescription: '',
            ValidationMsg: '',
            OrderNumber: '',
            OrderId: 0,
            TotalQuantity: 0,
            PriorityRating: 0
        };
    };

    $scope.ApproveEditedInquiry = function (enquiryAutoNumber) {


        if (IsNetworkStatus() === true) {

            if (enquiryAutoNumber !== "" && enquiryAutoNumber !== undefined && enquiryAutoNumber !== null) {

                var settingValue = 0;
                var SettingValue = $rootScope.GetSettingValue('DefaultLeadTime');
                if (SettingValue !== '0') {
                    settingValue = SettingValue;
                }

                $scope.ApproveEditConfirmationPopupView = false;
                $scope.OpenSortingPopupView = false;
                $rootScope.Throbber.Visible = true;

                var requestData = {
                    EnquiryAutoNumber: enquiryAutoNumber,
                    UserName: $rootScope.UserName,
                    UserId: $rootScope.UserId,
                    LoginId: parseInt($rootScope.UserId),
                    DefaultLeadTime: settingValue

                };

                var consolidateApiParamater = {
                    Json: requestData
                };
                ManageEnquiryService.EnquiryApproval(consolidateApiParamater).then(function (response) {

                    $rootScope.Throbber.Visible = false;

                    var filterData = $scope.CurrentStatusCssClass.filter(function (el) {
                        return (parseInt(el.StatusId) === parseInt(9016) || parseInt(el.StatusId) === parseInt(370)) &&
                            parseInt(el.RoleId) === parseInt($scope.LoggedInRoleMaterId);
                    });

                    var Status = "";
                    var Class = "";

                    if (filterData.length > 0) {
                        Status = filterData[0].Status;
                        Class = filterData[0].Class;
                    }

                    if ($scope.orgEnquiryData.length > 0) {
                        $scope.orgEnquiryData[0].CurrentState = parseInt(9016);
                        $scope.orgEnquiryData[0].Status = Status;
                        $scope.orgEnquiryData[0].Class = Class;

                        InquirySummaryData[0].CurrentState = parseInt(9016);
                        InquirySummaryData[0].Status = Status;
                        InquirySummaryData[0].Class = Class;

                        $scope.loadinquiryData(InquirySummaryData);

                    }

                    $scope.CloseApproveEditConfirmationPopupView();

                    //UpdateStatusInSqlLite($scope.orgEnquiryData, 'Enquiry', $rootScope.UserId);
                    if (response.data !== undefined) {
                        if (response.data.OrderNumber !== undefined) {
                            $scope.ApprovedOrderNumber = response.data.OrderNumber;
                        } else {
                            $scope.ApprovedOrderNumber = "";
                        }
                    } else {
                        $scope.ApprovedOrderNumber = "";
                    }

                    $scope.ApproveRejectEdits = {
                        Msg: String.format($rootScope.resData.res_InquirySummary_ApproveEdits)
                    };
                    $scope.OpenSuccessMsgPopup("ApproveEdits");


                }).catch(function (response) {

                    $rootScope.Throbber.Visible = false;
                    $scope.OpenSuccessMsgPopup("Error");
                });

            }

        } else {
            $scope.OpenSuccessMsgPopup("Offline");
        }

    };

    $scope.SaveReasonCodeForEditInquiryReject = function (EnquiryNumber) {

        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;

        var reasonCodes = angular.copy($scope.ReasonCodes.ReasonCodeList);

        reasonCodes = reasonCodes.filter(function (el) {
            return el.Selected === true;
        });

        var ReasonCodeList = [];

        if (reasonCodes !== undefined) {

            if (reasonCodes.length > 0) {

                for (var i = 0; i < reasonCodes.length; i++) {

                    var reasonDescription = "";
                    if (reasonCodes[i].Code === "Other") {
                        if ($scope.ReasonCodes.ReasonDescription === "" || $scope.ReasonCodes.ReasonDescription === null || $scope.ReasonCodes.ReasonDescription === undefined) {
                            $rootScope.Throbber.Visible = false;
                            $scope.PleaseSpecifyReasonDescription = false;
                            break;
                        } else {
                            reasonDescription = $scope.ReasonCodes.ReasonDescription;
                        }
                    }

                    var reasonCodeObj = {};
                    reasonCodeObj.ReasonCodeId = parseInt(reasonCodes[i].LookUpId);
                    reasonCodeObj.ReasonDescription = reasonDescription;
                    reasonCodeObj.CreatedBy = parseInt($rootScope.UserId);
                    reasonCodeObj.EventName = "RejectEditByBuyer";

                    ReasonCodeList.push(reasonCodeObj);

                }
                $scope.IsAnyReasonCodeSelected = true;

            } else {
                $scope.IsAnyReasonCodeSelected = false;
                $rootScope.Throbber.Visible = false;
                return false;
            }

        } else {
            $scope.IsAnyReasonCodeSelected = false;
            $rootScope.Throbber.Visible = false;
            return false;

        }

        if ($scope.PleaseSpecifyReasonDescription === false || $scope.IsAnyReasonCodeSelected === false) {
            return false;
        }

        if ($scope.PleaseSpecifyReasonDescription === true && $scope.IsAnyReasonCodeSelected === true) {
            if (IsNetworkStatus() === true) {

                var requestDataForOrderDetails = {};
                $scope.SomethingWentWrongPopup = true;
                requestDataForOrderDetails = {
                    RoleId: parseInt($scope.LoggedInRoleMaterId),
                    EnquiryAutoNumber: EnquiryNumber,
                    CurrentState: 9050,
                    LoginId: parseInt($rootScope.UserId),
                    ReasonCodeList: ReasonCodeList
                };

                var ActionForOrderServices = ManageEnquiryService.UpdateCancelInquiry(requestDataForOrderDetails);
                $q.all([
                    ActionForOrderServices
                ]).then(function (resp) {

                    $scope.SomethingWentWrongPopup = false;
                    var response = resp[0];
                    if (response.data !== undefined) {
                        if (response.data.EnquiryAutoNumber !== undefined) {
                            if (response.data.EnquiryAutoNumber === EnquiryNumber) {

                                /*var checkforOrder = angular.copy($scope.orgEnquiryData);*/

                                var filterData = $scope.CurrentStatusCssClass.filter(function (el) {
                                    return (parseInt(el.StatusId) === parseInt(990) || parseInt(el.StatusId) === parseInt(9050)) &&
                                        parseInt(el.RoleId) === parseInt($scope.LoggedInRoleMaterId);
                                });

                                var Status = "";
                                var Class = "";

                                if (filterData.length > 0) {
                                    Status = filterData[0].Status;
                                    Class = filterData[0].Class;
                                }

                                if ($scope.orgEnquiryData.length > 0) {
                                    $scope.orgEnquiryData[0].CurrentState = parseInt(9050);
                                    $scope.orgEnquiryData[0].Status = Status;
                                    $scope.orgEnquiryData[0].Class = Class;

                                    InquirySummaryData[0].CurrentState = parseInt(9050);
                                    InquirySummaryData[0].Status = Status;
                                    InquirySummaryData[0].Class = Class;

                                    $scope.loadinquiryData(InquirySummaryData);

                                }

                                $scope.CloseEditInquiryRejectPopup();

                                //UpdateStatusInSqlLite($scope.orgEnquiryData, 'Enquiry', $rootScope.UserId);

                                $scope.ApproveRejectEdits = {
                                    Msg: String.format($rootScope.resData.res_InquirySummary_RejectEdits)
                                };
                                $scope.OpenSuccessMsgPopup("RejectEdits");

                            }

                        }
                    }

                });

            } else {
                $scope.OpenSuccessMsgPopup("Offline");
            }
        }

    };

    $scope.SaveCanceledReasonCodeForEditInquiryReject = function (EnquiryNumber) {

        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;

        if (IsNetworkStatus() === true) {

            var requestDataForOrderDetails = {};
            $scope.SomethingWentWrongPopup = true;
            requestDataForOrderDetails = {
                RoleId: parseInt($scope.LoggedInRoleMaterId),
                EnquiryAutoNumber: EnquiryNumber,
                CurrentState: 9050,
                LoginId: parseInt($rootScope.UserId)
            };

            var ActionForOrderServices = ManageEnquiryService.UpdateCancelInquiry(requestDataForOrderDetails);
            $q.all([
                ActionForOrderServices
            ]).then(function (resp) {

                $scope.SomethingWentWrongPopup = false;
                var response = resp[0];
                if (response.data !== undefined) {
                    if (response.data.EnquiryAutoNumber !== undefined) {
                        if (response.data.EnquiryAutoNumber === EnquiryNumber) {

                            /*var checkforOrder = angular.copy($scope.orgEnquiryData);*/

                            var filterData = $scope.CurrentStatusCssClass.filter(function (el) {
                                return (parseInt(el.StatusId) === parseInt(990) || parseInt(el.StatusId) === parseInt(9050)) &&
                                    parseInt(el.RoleId) === parseInt($scope.LoggedInRoleMaterId);
                            });

                            var Status = "";
                            var Class = "";

                            if (filterData.length > 0) {
                                Status = filterData[0].Status;
                                Class = filterData[0].Class;
                            }

                            if ($scope.orgEnquiryData.length > 0) {
                                $scope.orgEnquiryData[0].CurrentState = parseInt(9050);
                                $scope.orgEnquiryData[0].Status = Status;
                                $scope.orgEnquiryData[0].Class = Class;

                                InquirySummaryData[0].CurrentState = parseInt(9050);
                                InquirySummaryData[0].Status = Status;
                                InquirySummaryData[0].Class = Class;

                                $scope.loadinquiryData(InquirySummaryData);

                            }

                            $scope.CloseEditInquiryRejectPopup();
                            $scope.CloseApproveEditConfirmationPopupView();

                            //UpdateStatusInSqlLite($scope.orgEnquiryData, 'Enquiry', $rootScope.UserId);

                            $scope.ApproveRejectEdits = {
                                Msg: String.format($rootScope.resData.res_InquirySummary_RejectEdits)
                            };
                            $scope.OpenSuccessMsgPopup("RejectEdits");

                        }

                    }
                }

            });

        } else {
            $scope.OpenSuccessMsgPopup("Offline");
        }


    };

    $scope.UpdateActivePromotionInSqlLite = function (activePromoList, UserId) {

        offlineDB.transaction(function (tx) {
            tx.executeSql("select JsonDescription from ActivePromotion where UserId=?", [UserId],
                function (tx, resultOuput) {

                    var json = resultOuput.rows.item(0);

                    var originalJson = json.JsonDescription;

                    var originalInJSON = JSON.parse(originalJson);

                    if (originalInJSON.length > 0) {
                        for (var i = 0; i < originalInJSON.length; i++) {

                            var activePromoListNew = angular.copy(activePromoList);

                            activePromoListNew = activePromoListNew.filter(function (el) {
                                return el.PromotionRefId === originalInJSON[i].ExternalSystemRefID && el.ItemType !== 31;
                            });

                            if (activePromoListNew !== undefined) {
                                if (activePromoListNew.length > 0) {

                                    if (activePromoListNew[0].NumberOfPromotions !== "" && activePromoListNew[0].NumberOfPromotions !== undefined && activePromoListNew[0].NumberOfPromotions !== null && activePromoListNew[0].NumberOfPromotions !== 0) {
                                        originalInJSON[i].ConsumedQuantity = (parseInt(originalInJSON[i].ConsumedQuantity) - parseInt(activePromoListNew[0].NumberOfPromotions)) + "";
                                    }

                                    if (activePromoListNew[0].AvailableNumberOfPromotions !== "" && activePromoListNew[0].AvailableNumberOfPromotions !== undefined && activePromoListNew[0].AvailableNumberOfPromotions !== null && activePromoListNew[0].AvailableNumberOfPromotions !== 0) {
                                        originalInJSON[i].ConsumedQuantity = (parseInt(originalInJSON[i].ConsumedQuantity) + parseInt(activePromoListNew[0].AvailableNumberOfPromotions)) + "";
                                    }

                                }
                            }

                        }
                        $rootScope.ActivePromotionGroupList = undefined;
                    }

                    var localjson = JSON.stringify(originalInJSON);

                    tx.executeSql("Update ActivePromotion set IsSyncedCompleted=1,JsonDescription=?  where UserId=? ", [localjson, UserId], function (tx, ere) {

                    });

                });

        });

    };

    $scope.UpdateActivePromotionInSqlLiteNew = function (activePromoList, UserId) {

        offlineDB.transaction(function (tx) {
            tx.executeSql("select JsonDescription from ActivePromotion where UserId=?", [UserId],
                function (tx, resultOuput) {

                    var json = resultOuput.rows.item(0);

                    var originalJson = json.JsonDescription;

                    var originalInJSON = JSON.parse(originalJson);

                    if (originalInJSON.length > 0) {
                        for (var i = 0; i < originalInJSON.length; i++) {

                            var activePromoListNew = angular.copy(activePromoList);

                            activePromoListNew = activePromoListNew.filter(function (el) {
                                return el.PromotionRefId === originalInJSON[i].ExternalSystemRefID && el.ItemType !== 31;
                            });

                            if (activePromoListNew !== undefined) {
                                if (activePromoListNew.length > 0) {

                                    if (activePromoListNew[0].NumberOfPromotions !== "" && activePromoListNew[0].NumberOfPromotions !== undefined && activePromoListNew[0].NumberOfPromotions !== null && activePromoListNew[0].NumberOfPromotions !== 0) {
                                        originalInJSON[i].ConsumedQuantity = (parseInt(originalInJSON[i].ConsumedQuantity) - parseInt(activePromoListNew[0].NumberOfPromotions)) + "";
                                    }

                                }
                            }

                        }
                        $rootScope.ActivePromotionGroupList = undefined;
                    }

                    var localjson = JSON.stringify(originalInJSON);

                    tx.executeSql("Update ActivePromotion set IsSyncedCompleted=1,JsonDescription=?  where UserId=? ", [localjson, UserId], function (tx, ere) {

                    });

                });

        });

    };

    $scope.ApproveOrRejectEnquiryCustomer = function (ClickType) {


        $scope.FinalEnquiryDataforSave = {};
        $rootScope.Throbber.Visible = true;

        var ProductList = [];
        if ($scope.SummaryPageData.ProductList !== undefined && $scope.SummaryPageData.ProductList !== null) {
            var ProductJson = $scope.SummaryPageData.ProductList;
            var TotalNewProductQuantity = 0;

            for (var i = 0; i < ProductJson.length; i++) {

                var objproduct = {
                    "EnquiryProductId": ProductJson[i].EnquiryProductId,
                    "IsActive": parseInt(ProductJson[i].AvailableQuantity) === 0 ? '0' : '1',
                    "ProductQuantity": ProductJson[i].ProductQuantity,
                    "AvailableQuantity": ProductJson[i].AvailableQuantity
                };

                ProductList.push(objproduct);
                TotalNewProductQuantity = TotalNewProductQuantity + parseInt(ProductJson[i].AvailableQuantity);
            }

            $scope.FinalEnquiryDataforSave.ProductList = ProductList;
            $scope.FinalEnquiryDataforSave.CreatedBy = parseInt($rootScope.UserId);
            if (ClickType === '12') {
                $scope.FinalEnquiryDataforSave.CurrentState = parseInt(ClickType);
            } else {
                $scope.FinalEnquiryDataforSave.CurrentState = parseInt(ClickType);
            }
            $scope.FinalEnquiryDataforSave.TotalAmount = $scope.SummaryPageData.NewTotal;
            $scope.FinalEnquiryDataforSave.TotalQuantity = TotalNewProductQuantity;
            $scope.FinalEnquiryDataforSave.EnquiryAutoNumber = $scope.SummaryPageData.InquiryNumber;
            $scope.FinalEnquiryDataforSave.EnquiryId = $scope.SummaryPageData.objectId;
        }
        var inquiryJsonDto = $scope.FinalEnquiryDataforSave;
        if (IsNetworkStatus() === true) {


            var enquiryDTO = JSON.stringify(inquiryJsonDto);

            ManageEnquiryService.ApproveRejectenqOfCustomer(enquiryDTO).then(function (response) {

                $rootScope.Throbber.Visible = false;
                $scope.inquiryPopupthrobber = false;


                if (response.data !== undefined) {
                    if (response.data !== null) {
                        var EnquiryAutoNumber = response.data.EnquiryAutoNumber;
                        if (EnquiryAutoNumber === "" || EnquiryAutoNumber === null || EnquiryAutoNumber === undefined) { } else {
                            if (ClickType == '12') {

                                var activePromoList = angular.copy($scope.SummaryPageData.ProductList);
                                $scope.UpdateActivePromotionInSqlLite(activePromoList, $rootScope.UserId);

                                $scope.ApproveEditedInquiry(EnquiryAutoNumber);

                            } else if (ClickType == '990') {
                                $scope.SaveReasonCodeForEditInquiryReject(EnquiryAutoNumber);

                                var activePromoList1 = angular.copy($scope.SummaryPageData.ProductList);
                                //$scope.UpdateActivePromotionInSqlLiteNew(activePromoList1, $rootScope.UserId);
                            }

                        }
                    }
                }

            }).catch(function (response) {

                $rootScope.Throbber.Visible = false;
                $scope.OpenSuccessMsgPopup("Error");
            });
        } else {
            $rootScope.Throbber.Visible = false;
            $scope.ReasonCodes.ValidationMsg = String.format($rootScope.resData.res_ManageCustomerInquiries_PleaseselectReasonCode);
            $scope.OpenSuccessMsgPopup("Warning");
            $scope.EditInquiryRejectReasonCodePopup = true;
        }


    };

    $scope.ApproveEditedCanceledEnquiryCustomer = function () {


        $scope.FinalEnquiryDataforSave = {};
        $rootScope.Throbber.Visible = true;

        var ProductList = [];
        if ($scope.SummaryPageData.ProductList !== undefined && $scope.SummaryPageData.ProductList !== null) {
            var ProductJson = $scope.SummaryPageData.ProductList;
            var TotalNewProductQuantity = 0;

            for (var i = 0; i < ProductJson.length; i++) {

                var objproduct = {
                    "EnquiryProductId": ProductJson[i].EnquiryProductId,
                    "IsActive": parseInt(ProductJson[i].AvailableQuantity) === 0 ? '0' : '1',
                    "ProductQuantity": ProductJson[i].ProductQuantity,
                    "AvailableQuantity": ProductJson[i].AvailableQuantity
                };

                ProductList.push(objproduct);
                TotalNewProductQuantity = TotalNewProductQuantity + parseInt(ProductJson[i].AvailableQuantity);
            }

            $scope.FinalEnquiryDataforSave.ProductList = ProductList;
            $scope.FinalEnquiryDataforSave.CreatedBy = parseInt($rootScope.UserId);

            $scope.FinalEnquiryDataforSave.CurrentState = parseInt(990);

            $scope.FinalEnquiryDataforSave.TotalAmount = $scope.SummaryPageData.NewTotal;
            $scope.FinalEnquiryDataforSave.TotalQuantity = TotalNewProductQuantity;
            $scope.FinalEnquiryDataforSave.EnquiryAutoNumber = $scope.SummaryPageData.InquiryNumber;
            $scope.FinalEnquiryDataforSave.EnquiryId = $scope.SummaryPageData.objectId;
        }
        var inquiryJsonDto = $scope.FinalEnquiryDataforSave;
        if (IsNetworkStatus() === true) {


            var enquiryDTO = JSON.stringify(inquiryJsonDto);

            ManageEnquiryService.ApproveRejectenqOfCustomer(enquiryDTO).then(function (response) {

                $rootScope.Throbber.Visible = false;
                $scope.inquiryPopupthrobber = false;


                if (response.data !== undefined) {
                    if (response.data !== null) {
                        var EnquiryAutoNumber = response.data.EnquiryAutoNumber;
                        if (EnquiryAutoNumber === "" || EnquiryAutoNumber === null || EnquiryAutoNumber === undefined) { } else {

                            $scope.SaveCanceledReasonCodeForEditInquiryReject(EnquiryAutoNumber);

                            var activePromoList1 = angular.copy($scope.SummaryPageData.ProductList);
                            //$scope.UpdateActivePromotionInSqlLiteNew(activePromoList1, $rootScope.UserId);

                        }
                    }
                }

            }).catch(function (response) {

                $rootScope.Throbber.Visible = false;
                $scope.OpenSuccessMsgPopup("Error");
            });
        } else {
            $rootScope.Throbber.Visible = false;
            $scope.ReasonCodes.ValidationMsg = String.format($rootScope.resData.res_ManageCustomerInquiries_PleaseselectReasonCode);
            $scope.OpenSuccessMsgPopup("Warning");
            $scope.EditInquiryRejectReasonCodePopup = true;
        }


    };

    $scope.EditInquiryPopUpJson = {};
    $scope.OpenEditInquiryConfirmationPopupView = function (objTrackOrder) {

        if (IsNetworkStatus() === true) {

            $scope.EditInquiryPopUpJson = objTrackOrder;
            objTrackOrder.ShowQuickAction = false;

            $scope.EditInquiryConfirmationPopupView = true;
            $scope.OpenSortingPopupView = true;

        } else {
            $scope.OpenSomethingWentWrongPopup("Offline");
        }


    };

    $scope.CloseEditInquiryConfirmationPopupView = function () {

        $scope.EditInquiryPopUpJson = {};
        $scope.EditInquiryConfirmationPopupView = false;
        $scope.OpenSortingPopupView = false;

    };

    $scope.ShowDiffQty = function (AvailableQuantity, oldQuantity) {



        var className = false;

        if (parseInt(AvailableQuantity) > parseInt(oldQuantity)) {
            className = true;
        } else {
            className = false;
        }

        return className;

    };

    $scope.positiveLookingValue = function (value) {
        return Math.abs(value);
    };


    $scope.LoadApproveOrderDetails = function () {

        $rootScope.Throbber.Visible = true;
        if (IsNetworkStatus() === true) {
            var orderDTO = {
                CompanyId: parseInt($rootScope.ValidateSuccessData.data.UserDetails.ReferenceId),
                OrderNumber: $scope.ApprovedOrderNumber,
                PageIndex: 0,
                PageSize: 5
            };

            ManageOrderService.GetOrderList(orderDTO).then(function (response) {

                if (response !== null && response !== undefined && response !== "") {

                    if (response.data !== null && response.data !== undefined && response.data !== "") {

                        var OrderItem = response.data;
                        var orderJsonData = [];
                        if (OrderItem.length > 0) {

                            for (var i = 0; i < OrderItem.length; i++) {
                                var TotalQty = 0;
                                var Status = "";
                                var Class = "";
                                var filterData = $scope.CurrentStatusCssClass.filter(function (el) {
                                    return parseInt(el.StatusId) === parseInt(OrderItem[i].CurrentState) &&
                                        parseInt(el.RoleId) === parseInt($scope.LoggedInRoleMaterId);
                                });
                                if (filterData.length > 0) {
                                    Status = filterData[0].Status;
                                    Class = filterData[0].Class;
                                }
                                var OrderProduct = [];

                                if (OrderItem[i].OrderProductList !== undefined) {

                                    for (var k = 0; k < OrderItem[i].OrderProductList.length; k++) {



                                        var OrderproductDet = {
                                            "ItemId": OrderItem[i].OrderProductList[k].OrderProductId,
                                            "ItemName": OrderItem[i].OrderProductList[k].ProductName,
                                            "ProductName": OrderItem[i].OrderProductList[k].ProductName,
                                            "ProductCode": OrderItem[i].OrderProductList[k].ProductCode,
                                            "ImageUrl": OrderItem[i].OrderProductList[k].ImageUrl,
                                            "ProductQuantity": OrderItem[i].OrderProductList[k].ProductQuantity,
                                            "ReceiveQuantity": OrderItem[i].OrderProductList[k].ProductQuantity,
                                            "UOM": OrderItem[i].OrderProductList[k].UOM,
                                            "ItemType": OrderItem[i].OrderProductList[k].ItemType == undefined ? 32 : OrderItem[i].OrderProductList[k].ItemType,
                                            "IsActive": true,
                                            "ItemPricesPerUnit": OrderItem[i].OrderProductList[k].UnitPrice,
                                            "TotalUnitPrice": OrderItem[i].OrderProductList[k].TotalUnitPrice,
                                            "ParentProductCode": OrderItem[i].OrderProductList[k].ParentProductCode,
                                            "AvailableQuantity": OrderItem[i].OrderProductList[k].AvailableQuantity,
                                            "NumberOfPromotions": parseInt(OrderItem[i].OrderProductList[k].NumberOfPromotions),
                                            "AdditionalQuantity": parseInt(OrderItem[i].OrderProductList[k].AdditionalQuantity),
                                            "PromotionRefId": OrderItem[i].OrderProductList[k].PromotionRefId,
                                            "AvailableAdditionalQuantity": parseInt(OrderItem[i].OrderProductList[k].AvailableAdditionalQuantity),
                                            "AvailableNumberOfPromotions": parseInt(OrderItem[i].OrderProductList[k].AvailableNumberOfPromotions)
                                        };

                                        if (parseInt(OrderItem[i].OrderProductList[k].AdditionalQuantity) !== 0) {
                                            OrderproductDet.TotalUnitPrice = parseFloat(OrderItem[i].OrderProductList[k].UnitPrice) * parseFloat(OrderItem[i].OrderProductList[k].AdditionalQuantity);
                                        } else {
                                            OrderproductDet.TotalUnitPrice = parseFloat(OrderItem[i].OrderProductList[k].UnitPrice) * parseFloat(OrderItem[i].OrderProductList[k].ProductQuantity);
                                        }

                                        if (OrderItem[i].OrderProductList[k].ProductQuantity !== undefined && OrderItem[i].OrderProductList[k].ProductQuantity !== null && OrderItem[i].OrderProductList[k].ParentProductCode === "") {
                                            TotalQty += parseFloat(OrderItem[i].OrderProductList[k].ProductQuantity);
                                        } else {
                                            if (OrderItem[i].OrderProductList[k].AdditionalQuantity !== undefined && OrderItem[i].OrderProductList[k].AdditionalQuantity !== null) {
                                                TotalQty += parseFloat(OrderItem[i].OrderProductList[k].AdditionalQuantity);
                                            }
                                        }

                                        OrderProduct.push(OrderproductDet);
                                    }

                                    var OrderDetails = {
                                        "OrderGUID": OrderItem[i].OrderGUID,
                                        "ObjectType": "Order",
                                        "objectId": OrderItem[i].OrderId,
                                        "EnquiryAutoNumber": OrderItem[i].EnquiryAutoNumber,
                                        "ObjectAutoNumber": (OrderItem[i].OrderNumber === undefined || OrderItem[i].OrderNumber === '') ? "-" : OrderItem[i].OrderNumber,
                                        "SupplierslocationName": OrderItem[i].SupplierslocationName === undefined ? "-" : OrderItem[i].SupplierslocationName,
                                        "ActivityStartTime": OrderItem[i].OrderDate,
                                        "EnquiryDate": OrderItem[i].OrderDate,
                                        "RequestDate": OrderItem[i].ExpectedTimeOfDelivery,
                                        "ShipToName": OrderItem[i].ShipToName,
                                        "ShipToLocationAddress": OrderItem[i].ShipToLocationAddress,
                                        "BillTo": OrderItem[0].BillToName === undefined ? "-" : OrderItem[i].BillToName,
                                        "ShipToCode": OrderItem[i].ShipToCode,
                                        "SupplierName": OrderItem[i].CompanyName === undefined ? "-" : OrderItem[i].CompanyName,
                                        "CompanyMnemonic": OrderItem[i].CompanyMnemonic,
                                        "CompanyCode": OrderItem[i].CompanyCode,
                                        "SoldTo": OrderItem[i].SoldTo,
                                        "SoldToName": OrderItem[i].SoldToName,
                                        "IsActive": true,
                                        "OrderDate": OrderItem[i].OrderDate,
                                        "CurrentState": OrderItem[i].CurrentState,
                                        "CurrentStateDraft": OrderItem[i].CurrentStateDraft,
                                        "Status": Status === "" ? "order Confirmed" : Status,
                                        "Class": Class === "" ? "#e2c703" : Class,
                                        "ImgUrl": OrderItem[i].ImgUrl === undefined ? "img/CustomerAppIcons/OrderFlow/Asset 107.png" : OrderItem[i].ImgUrl,
                                        "Field7": OrderItem[i].Field7 === null ? "0" : OrderItem[i].Field7,
                                        "TotalQuantity": TotalQty,
                                        "TotalPrice": OrderItem[i].TotalPrice,
                                        "InquiryDescription": (OrderItem[i].Description1 === undefined || OrderItem[i].Description1 === '') ? "-" : OrderItem[i].Description1,
                                        "ProductList": OrderProduct,
                                        "PhoneNumber": OrderItem[i].Field10,
                                        "ReasonCodeList": OrderItem[i].ReasonCodeList
                                    };

                                    orderJsonData.push(OrderDetails);

                                }
                            }

                            if (orderJsonData.length > 0) {
                                $rootScope.FinalOrderJson = orderJsonData;
                                $rootScope.RedirectFromTrackInquiryOrderDetailsPage = "app.TrackOrder";
                                $state.reload('app.TrackInquiryOrderDetails');
                            }

                        }
                    } else {
                        $scope.SuccessMsgPopupOKButtonEvent();
                    }


                } else {
                    $scope.SuccessMsgPopupOKButtonEvent();
                }

            });
        } else {
            $scope.SuccessMsgPopupOKButtonEvent();
        }
    };


    $rootScope.ShowHelpIcon = false;


    $scope.LoadDeliveryNote = function (orderid) {

        debugger;

        var orderRequestData =
        {
            ServicesAction: 'DeliveryNoteV2',
            OrderId: parseInt(orderid),
            LoginId: 0
        };
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
                    var filName = orderid + ".pdf";
                    saveAs(blob, filName);
                } else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                }
            } else {
                $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
            }
        });
    };


    $scope.DownloadDocument = function (orderDocumentId, documentType, documentExtension) {

        debugger;

        var orderRequestData =
        {
            ServicesAction: 'LoadOrderDocumentByOrderDocumentId',
            OrderDocumentId: orderDocumentId,
            DocumentType: documentType
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
                    var filName = documentType + orderDocumentId + "." + documentExtension;
                    saveAs(blob, filName);
                } else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                }
            } else {
                $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
            }
        });
    };


});