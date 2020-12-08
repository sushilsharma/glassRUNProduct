
angular.module("glassRUNProduct").controller('EditEnquiryController', function ($scope, $rootScope, $q, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageEnquiryService) {

    /* Date: 27-02-2020*/
    /* Load page control and validation configuration using page controller name */


    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    $scope.LoadDateSelection = function (mindate, maxdate) {

        $('#txtPickDate').each(function () {
            $(this).datetimepicker({
                onSelect: function (datetext, inst) {
                    $scope.$apply(function () {

                        datetext = datetext.split(" ");
                        var d = datetext[0].split('/');
                        d = d[1] + "/" + d[0] + "/" + d[2] + " " + datetext[1];

                        var datetime = new Date(d);
                        var date = datetime.getDate();
                        if (date < 10) {
                            date = "0" + date;
                        }
                        var month = datetime.getMonth();
                        var year = datetime.getFullYear();
                        var hours = datetime.getHours();
                        if (hours < 10) {
                            hours = "0" + hours;
                        }
                        var minute = datetime.getMinutes();
                        if (minute < 0) {
                            minute = "0" + minute;
                        }
                        var ampm = formatAMPM(datetime);

                        $rootScope.InquiryRequestedDate = date + "-" + months[month] + "-" + year + " " + ampm;
                    });
                },
                minDate: mindate,
                maxDate: maxdate,
                dateFormat: 'dd/mm/yy',
                numberofmonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevtext: '<i class="fa fa-angle-left"></i>',
                nexttext: '<i class="fa fa-angle-right"></i>',
                showbuttonpanel: false,
                autoclose: true,
            });
        });
        $('#txtPickDate').datetimepicker('show');
    }

    $rootScope.BackFromOrderSurveyPage = false;
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
        if ($('#Console_sidebar').hasClass('open')) $('#Console_sidebar').removeClass('open');
        else $('#Console_sidebar').addClass('open');
    };


    $scope.CurrentStatusCssClass = $rootScope.RoleWiseCssClassStatus;
    $scope.messageText = "";
    $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = false;
    $scope.SubmitPartialOrderReceiveConfirmationMsg = false;
    $rootScope.ChangeColorDefaultDate = true;
    $scope.$on('$destroy', function (evt) {
        evt.currentScope = null;
        evt.targetScope = null;
        $scope = null;

    });
    $scope.RequestDate = '';
    $scope.Deliverto = '';
    $scope.SoldTo = '';
    $scope.inquiryProductCount = 0;
    $scope.inquiryProductQuantity = 0;
    $rootScope.InquiryRequestedDate = "";
    $rootScope.NumberOfStartDate = 0;
    $scope.NewTotalAmount = 0;
    $scope.OldTotalAmt = 0;
    $scope.OpenConformationPopupView = false;
    $scope.Enquirynumber = '';
    $rootScope.IsRedirecttoEditEnquiry = true;

    $scope.EditEnquiryReasonDetails = {
        ReasonCodeId: 0,
    };

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

    $scope.IsAllowToAddQtyWhileEditingInquiry = false;
    var SettingValue = $rootScope.GetSettingValue('IsAllowToAddQtyWhileEditingInquiry');
    if (SettingValue == '1') {
        $scope.IsAllowToAddQtyWhileEditingInquiry = true;
    } else {
        $scope.IsAllowToAddQtyWhileEditingInquiry = false;
    }

    $scope.IsAddPromotionIfQtyIsNotExactMultiple = false;
    var IsAddPromotionIfQtyIsNotExactMultiple = $rootScope.GetSettingValue('IsAddPromotionIfQtyIsNotExactMultiple');
    if (IsAddPromotionIfQtyIsNotExactMultiple == '1') {
        $scope.IsAddPromotionIfQtyIsNotExactMultiple = true;
    } else {
        $scope.IsAddPromotionIfQtyIsNotExactMultiple = false;
    }




    $scope.PromotionDateParse = function (datetime) {
        var newdate = "";
        if (datetime !== "" && datetime !== null && datetime !== undefined) {
            if (datetime.indexOf("T") > -1) {
                var splitdatetime = datetime.split('T');
                var newdatetime = splitdatetime[0] + ' ' + splitdatetime[1];
                newdate = new Date(newdatetime.replace(/-/g, '/'));
            } else {
                newdate = new Date(datetime);
            }

        }
        return newdate;
    };

    /* Load reason code from look up and use partial delivery lookup category for reason code dropdown list */

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

    $scope.LoadReasonCodes = function (categoryName) {
        var reasonCodeList = angular.copy($rootScope.AllLookUpData);
        reasonCodeList = reasonCodeList.filter(function (el) {
            return el.LookupCategoryName === categoryName;
        });
        $scope.ReasonCodes.ReasonCodeList = reasonCodeList;
    };

    $scope.ReseatDropDown = function () {
        $scope.EditEnquiryReasonDetails.ReasonCodeId = "";
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




    $scope.DateParse = function (datetime) {
        var newdate = "";
        if (datetime !== "" && datetime !== null && datetime !== undefined) {
            if (datetime.indexOf("T") > -1) {
                var splitdatetime = datetime.split('T');
                var newdatetime = splitdatetime[0] + ' ' + splitdatetime[1];
                newdatetime = newdatetime.replace(/-/g, '/');
                newdate = new Date(newdatetime);
            } else {
                newdate = new Date(datetime);
            }

        }
        return newdate;
    };
    /* Load product count and total quantities */
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    $scope.DateParseformate = function (datetime) {

        var current_datetime = new Date(datetime);

        var formatted_date = (current_datetime.getDate() < 10 ? '0' : '') + current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear();

        return formatted_date;
    };

    $scope.LoadProductCountAndQuantity = function () {

        if ($rootScope.BackFromOrderSurveyPage === false) {
            if ($scope.SelectedInquiryJson !== undefined && $scope.SelectedInquiryJson !== null && $scope.SelectedInquiryJson !== "") {

                /*
                if ($scope.SelectedInquiryJson.ProductList !== undefined && $scope.SelectedInquiryJson.ProductList !== null) {
                    $scope.inquiryProductCount = $scope.SelectedInquiryJson.ProductList.length;
                    for (var i = 0; i < $scope.SelectedInquiryJson.ProductList.length; i++) {

                        if(parseInt($scope.SelectedInquiryJson.ProductList[i].AvailableQuantity) !== 31) {
                            $scope.ReseatDropDown();
                            $scope.inquiryProductQuantity = parseInt($scope.inquiryProductQuantity) + parseInt($scope.SelectedInquiryJson.ProductList[i].AvailableQuantity);

                            $scope.OldTotalAmt = $scope.OldTotalAmt + (parseInt($scope.SelectedInquiryJson.ProductList[i].AvailableQuantity) * parseFloat($scope.SelectedInquiryJson.ProductList[i].ItemPricesPerUnit));

                            $scope.NewTotalAmount = $scope.OldTotalAmt;
                        }
                        
                    };
                }*/


                $scope.NewTotalAmount = $scope.SelectedInquiryJson.TotalPrice;
                $scope.Deliverto = $scope.SelectedInquiryJson.ShipToName;
                $scope.SoldTo = $scope.SelectedInquiryJson.SoldToName;
                $scope.Enquirynumber = $scope.SelectedInquiryJson.EnquiryAutoNumber;
                if ($scope.SelectedInquiryJson.RequestDate !== undefined && $scope.SelectedInquiryJson.RequestDate !== null) {

                    $rootScope.InquiryRequestedDate = $scope.DateParse($scope.SelectedInquiryJson.RequestDate);

                    $scope.RequestDate = $scope.SelectedInquiryJson.RequestDate;
                }

            }

        }
    };

    $scope.AddAndRemovePromotion = function (itemDetails) {
        if ($scope.CustomerActivePromotionGroupList.length > 0) {

            angular.forEach($scope.CustomerActivePromotionGroupList, function (item) {

                var promotionItem = item.CustomerActivePromotionList.filter(function (el) { return el.ItemCode === itemDetails.ItemCode && el.Action === "B"; });

                var totalQtyCanOrderFocItem = 0;

                if (promotionItem.length > 0) {

                    for (var i = 0; i < promotionItem.length; i++) {

                        var ItemQuantity = promotionItem[i].ItemQuantity;
                        var productQty = promotionItem[i].AvailableQuantity;

                        if (parseInt(productQty) > 0) {

                            if ($scope.IsAddPromotionIfQtyIsNotExactMultiple === false) {

                                if ((parseInt(itemDetails.AvailableQuantity) % parseFloat(ItemQuantity)) === 0) {
                                    var totalNumberCanOrderFocItem = (parseInt(itemDetails.AvailableQuantity) / parseInt(ItemQuantity));

                                    totalQtyCanOrderFocItem = totalQtyCanOrderFocItem + parseInt(totalNumberCanOrderFocItem);

                                    promotionItem[i].IsPromotionItemActive = '1';

                                }

                            } else {

                                var totalNumberCanOrderFocItem = Math.floor(parseInt(itemDetails.AvailableQuantity) / parseInt(ItemQuantity));

                                if (totalNumberCanOrderFocItem !== 0) {

                                    totalQtyCanOrderFocItem = totalQtyCanOrderFocItem + parseInt(totalNumberCanOrderFocItem);

                                    promotionItem[i].IsPromotionItemActive = '1';

                                }

                            }


                        } else {
                            promotionItem[i].IsPromotionItemActive = '0';
                        }

                    }


                    var promotionGetItem = item.CustomerActivePromotionList.filter(function (el) { return el.ExternalSystemRefID === promotionItem[0].ExternalSystemRefID && el.Action === "G"; });

                    for (var j = 0; j < promotionGetItem.length; j++) {

                        if (parseInt(itemDetails.ProductQuantity) > 0) {

                            var PromotionIdentifier = promotionGetItem[j].ExternalSystemRefID;
                            var FocItemQuanity = promotionGetItem[j].FocItemQuantity;
                            var totalAmountOfQty = parseInt(FocItemQuanity) * totalQtyCanOrderFocItem;

                            promotionGetItem[j].AppliedPromotion = '1';
                            promotionGetItem[j].AvailableQuantity = totalAmountOfQty;

                        } else {

                            promotionGetItem[j].AppliedPromotion = '0';
                            promotionGetItem[j].AvailableQuantity = promotionGetItem[j].FocItemQuantity;

                        }


                    }

                    var tmpItm = item.CustomerActivePromotionList.filter(function (el) { return el.IsPromotionItemActive === '1' && el.Action === "B"; });

                    if (tmpItm.length > 0) {
                        item.IsPromotionItemActive = '1';
                    } else {
                        item.IsPromotionItemActive = '0';
                    }

                }

            });



        }



    };



    /* 02/03/2020 : Change Receive Quantity Function */
    $scope.ChangeReceivedQuantity = function (actionType, orderProductObject) {
        var value = 0;
        var ProductAmt = parseFloat(orderProductObject.ItemPricesPerUnit);
        var CurrentAmt = 0;
        if (actionType === 'Minus') {

            value = parseInt(orderProductObject.AvailableAdditionalQuantity) - 1;
            if (value >= parseInt(0)) {
                orderProductObject.AvailableAdditionalQuantity = parseInt(orderProductObject.AvailableAdditionalQuantity) - 1;
                $scope.NewTotalAmount = ($scope.NewTotalAmount - parseFloat(ProductAmt));
                orderProductObject.NewTotalUnitprice = parseInt(orderProductObject.AvailableAdditionalQuantity) * ProductAmt;

                /*$scope.AddAndRemovePromotion(orderProductObject);*/

            } else {
                $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
            }
        } else if (actionType === 'Enter') {

            if (orderProductObject.AvailableAdditionalQuantity !== "") {
                value = parseInt(orderProductObject.AvailableAdditionalQuantity);

                if ($scope.IsAllowToAddQtyWhileEditingInquiry === true) {
                    if (value > -1) {
                        orderProductObject.AvailableAdditionalQuantity = parseInt(orderProductObject.AvailableAdditionalQuantity);
                        /*$scope.AddAndRemovePromotion(orderProductObject);*/
                    } else {
                        $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                        $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                        $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
                        orderProductObject.AvailableAdditionalQuantity = parseInt(orderProductObject.AdditionalQuantity);

                        orderProductObject.NewTotalUnitprice = parseInt(orderProductObject.AvailableAdditionalQuantity) * ProductAmt;

                        /*$scope.AddAndRemovePromotion(orderProductObject);*/

                    }
                } else {
                    if (value > -1 && value <= parseInt(orderProductObject.AdditionalQuantity)) {
                        orderProductObject.AvailableAdditionalQuantity = parseInt(orderProductObject.AvailableAdditionalQuantity);

                        /*$scope.AddAndRemovePromotion(orderProductObject);*/

                    } else {
                        $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                        $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                        $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
                        orderProductObject.AvailableAdditionalQuantity = parseInt(orderProductObject.AdditionalQuantity);

                        orderProductObject.NewTotalUnitprice = parseInt(orderProductObject.AvailableAdditionalQuantity) * ProductAmt;

                        /*$scope.AddAndRemovePromotion(orderProductObject);*/
                    }
                }

            } else {
                orderProductObject.AvailableAdditionalQuantity = 0;
                $scope.AddAndRemovePromotion(orderProductObject);
            }
        } else if (actionType === 'Add') {

            if ($scope.IsAllowToAddQtyWhileEditingInquiry === true) {
                value = parseInt(orderProductObject.AvailableAdditionalQuantity) + 1;
                if (value > -1) {
                    orderProductObject.AvailableAdditionalQuantity = parseInt(orderProductObject.AvailableAdditionalQuantity) + 1;
                    $scope.NewTotalAmount = ($scope.NewTotalAmount + parseFloat(ProductAmt));
                    orderProductObject.NewTotalUnitprice = parseInt(orderProductObject.AvailableAdditionalQuantity) * ProductAmt;

                    /*$scope.AddAndRemovePromotion(orderProductObject);*/

                } else {
                    $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                    $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                    $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
                }
            } else {
                value = parseInt(orderProductObject.AvailableAdditionalQuantity) + 1;
                if (value <= parseInt(orderProductObject.AdditionalQuantity)) {
                    orderProductObject.AvailableAdditionalQuantity = parseInt(orderProductObject.AvailableAdditionalQuantity) + 1;
                    $scope.NewTotalAmount = ($scope.NewTotalAmount + parseFloat(ProductAmt));
                    orderProductObject.NewTotalUnitprice = parseInt(orderProductObject.AvailableAdditionalQuantity) * ProductAmt;

                    /*$scope.AddAndRemovePromotion(orderProductObject);*/

                } else {
                    $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                    $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                    $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
                }
            }


        }
        var DifferenceQuantity = parseInt(orderProductObject.AdditionalQuantity) - parseInt(orderProductObject.AvailableAdditionalQuantity);

        orderProductObject.DifferenceQuantity = DifferenceQuantity;

        if (parseInt(orderProductObject.AvailableAdditionalQuantity) < parseInt(orderProductObject.AdditionalQuantity)) {
            orderProductObject.isProductQuantityShortfall = true;
            orderProductObject.IsShowAddReasoButton = true;
        } else {


            $scope.ReseatDropDown();

            orderProductObject.isProductQuantityShortfall = false;
            orderProductObject.IsShowAddReasoButton = false;
        }
    };
    $scope.CloseConfirmationPopup = function () {
        $scope.messageText = "";
        $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = false;
        $scope.SubmitPartialOrderReceiveConfirmationMsg = false;
    };
    /* Function is used to save partial order receive data in order json in sqlite database. */
    $rootScope.OrderProductFeedbackJsonList = [];



    $scope.SelectResonCodePopup = function () {
        $scope.OpenEditEnquiryPopup();
        $scope.OpenConformationPopupView = !$scope.OpenConformationPopupView;
    };


    $scope.SaveEditEnquiry = function () {

        $scope.EditEnqueryData();
    };

    $scope.SetPromotionItem = function () {

        angular.forEach($scope.SelectedInquiryJson.ProductList, function (draftItem) {

            angular.forEach($scope.CustomerActivePromotionGroupList, function (prItem) {

                if (draftItem.PromotionRefId === prItem.ExternalSystemRefID) {

                    prItem.IsPromotionItemActive = "1";

                    var promotionItem = prItem.CustomerActivePromotionList.filter(function (el) { return el.ItemCode === draftItem.ProductCode && el.Action === "B"; });

                    for (var i = 0; i < promotionItem.length; i++) {

                        prItem.ComboProductQuantity = parseInt(draftItem.NumberOfPromotions);

                        prItem.AvailableComboProductQuantity = parseInt(prItem.ComboProductQuantity);

                        prItem.ComboDifferenceQuantity = parseInt(prItem.ComboProductQuantity) - parseInt(prItem.AvailableComboProductQuantity);

                        promotionItem[i].ProductQuantity = parseInt(promotionItem[i].ItemQuantity) * parseInt(prItem.ComboProductQuantity);
                        promotionItem[i].AvailableQuantity = parseInt(promotionItem[i].ProductQuantity);
                        promotionItem[i].ComboQty = parseInt(prItem.ComboProductQuantity);
                        promotionItem[i].AvailableComboQty = parseInt(promotionItem[i].ComboQty);
                        promotionItem[i].TotalAmount = parseFloat(promotionItem[i].Amount) * promotionItem[i].ProductQuantity;
                        prItem.TotalAmount = parseFloat(prItem.TotalAmount) + parseFloat(promotionItem[i].TotalAmount);

                        promotionItem[i].EnquiryProductId = draftItem.EnquiryProductId;
                        promotionItem[i].EnquiryGUID = draftItem.EnquiryGUID;
                        promotionItem[i].CompanyCode = draftItem.CompanyCode;
                        promotionItem[i].CompanyId = parseInt(draftItem.CompanyId);

                    }

                    var promotionGetItem = prItem.CustomerActivePromotionList.filter(function (el) { return el.ItemCode === draftItem.ProductCode && el.Action === "G"; });

                    for (var k = 0; k < promotionGetItem.length; k++) {

                        promotionGetItem[k].ProductQuantity = parseInt(draftItem.ProductQuantity);
                        promotionGetItem[k].AvailableQuantity = parseInt(promotionGetItem[k].ProductQuantity);
                        promotionGetItem[k].AppliedPromotion = '1';

                        promotionGetItem[k].EnquiryProductId = draftItem.EnquiryProductId;
                        promotionGetItem[k].EnquiryGUID = draftItem.EnquiryGUID;
                        promotionGetItem[k].CompanyCode = draftItem.CompanyCode;
                        promotionGetItem[k].CompanyId = parseInt(draftItem.CompanyId);

                    }

                }


            });

        });

        $scope.CustomerActivePromotionGroupList = $scope.CustomerActivePromotionGroupList.filter(function (el) { return el.ComboProductQuantity !== "" && el.ComboProductQuantity !== undefined && el.ComboProductQuantity !== null; });

        /*angular.forEach($scope.SelectedInquiryJson.ProductList, function(item) {

            item.PromotionItemList = $scope.loadPromotionItem(item.ProductCode);

        });*/

    };

    $scope.loadPromotionItem = function (productCode) {

        var itemList = angular.copy($scope.SelectedInquiryJson.ProductList);
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


    $scope.LoadCustomerInquiriebyenquiryid = function (EquiryNumber) {

        $rootScope.Throbber.Visible = true;

        var enquiryDTO = {
            LoginId: parseInt($rootScope.UserId),
            EnquiryAutoNumber: EquiryNumber,
            PageIndex: 0,
            PageSize: 5
        };

        ManageEnquiryService.GetEnquiryOfCustomer(enquiryDTO).then(function (response) {

            $rootScope.Throbber.Visible = false;
            if (response.data != undefined) {
                if (response.data != null) {
                    var enquiryList = response.data;
                    if (enquiryList !== undefined) {
                        if (enquiryList.length > 0) {

                            var Status = "Awaiting Confirmation";
                            var Class = "#e2c703";
                            $scope.CurrentStatusCssClass = [];
                            var filterData = $scope.CurrentStatusCssClass.filter(function (el) {
                                return parseInt(el.StatusId) === parseInt(enquiryList[0].CurrentState) &&
                                    parseInt(el.RoleId) === parseInt($rootScope.ValidateSuccessData.data.UserDetails.RoleMasterId);
                            });
                            if (filterData.length > 0) {
                                Status = filterData[0].Status;
                                Class = filterData[0].Class;
                            }
                            enquiryList[0].Status = Status;
                            enquiryList[0].Class = Class;

                            angular.forEach(enquiryList[0].ProductList, function (item) {
                                if (item.AvailableQuantity === undefined || item.AvailableQuantity === null || item.AvailableQuantity === 0) {
                                    item.AvailableQuantity = item.ProductQuantity;
                                }
                                if (item.DifferenceQuantity === undefined || item.DifferenceQuantity === null) {
                                    item.DifferenceQuantity = 0;
                                }

                                if (item.AdditionalQuantity !== null) {
                                    if (parseInt(item.AdditionalQuantity) !== 0) {
                                        item.ProductQuantity = parseInt(item.AdditionalQuantity);
                                        item.AvailableQuantity = parseInt(item.ProductQuantity);
                                        item.AvailableAdditionalQuantity = parseInt(item.AdditionalQuantity);
                                        item.DifferenceQuantity = parseInt(item.AdditionalQuantity) - parseInt(item.AvailableAdditionalQuantity);
                                    } else {
                                        item.ProductQuantity = parseInt(item.ProductQuantity) - parseInt(item.AdditionalQuantity);
                                        item.AvailableQuantity = parseInt(item.ProductQuantity);
                                        item.AvailableAdditionalQuantity = parseInt(item.AdditionalQuantity);
                                    }
                                } else {
                                    item.ProductQuantity = parseInt(item.ProductQuantity) - 0;
                                    item.AvailableQuantity = parseInt(item.ProductQuantity);
                                    item.AdditionalQuantity = parseInt(item.ProductQuantity);
                                    item.AvailableAdditionalQuantity = parseInt(item.ProductQuantity);
                                    item.DifferenceQuantity = 0;
                                }

                                item.NewTotalUnitprice = parseInt(item.AvailableQuantity) * parseFloat(item.ItemPricesPerUnit);

                                if (item.ImageUrl !== "" && item.ImageUrl !== null && item.ImageUrl !== undefined) {
                                    item.ImageUrl = item.ImageUrl;
                                }

                            });

                            $scope.SelectedInquiryJson = enquiryList[0];

                            console.log(JSON.stringify($scope.SelectedInquiryJson));
                            $rootScope.Throbber.Visible = false;
                            $scope.LoadProductCountAndQuantity();

                            $scope.LoadActivePromotions(enquiryList[0].SoldToCode);


                        }
                    }
                }

            }
        }).catch(function (response) {
            $rootScope.Throbber.Visible = false;
        });



    };

    $scope.CustomerActivePromotionList = [];
    $scope.CustomerActivePromotionGroupList = [];

    $scope.GetCustomerActivePromotionGroupList = function () {


        var members = $scope.CustomerActivePromotionList;
        var myArray = [];

        angular.forEach(members, function (item) {


            var myArray11 = angular.copy(myArray);
            var ext = myArray11.filter(function (el) { return el.ExternalSystemRefID === item.ExternalSystemRefID; })[0];

            if (!ext) {

                var tmpArr = {};
                tmpArr.ExternalSystemRefID = item.ExternalSystemRefID;
                tmpArr.FromDate = item.FromDate;
                tmpArr.ToDate = item.ToDate;
                tmpArr.BuyQty = item.BuyQty;
                tmpArr.GetQty = item.GetQty;
                tmpArr.ComboProductQuantity = "";
                tmpArr.TotalAmount = 0;

                tmpArr.CustomerActivePromotionList = [];

                var existing = angular.copy(members);
                existing = existing.filter(function (i) { return i.ExternalSystemRefID === item.ExternalSystemRefID; });

                if (existing.length > 0) {
                    tmpArr.CustomerActivePromotionList = existing;
                }

                myArray.push(tmpArr);

            }

        });

        angular.forEach(myArray, function (item) {

            angular.forEach(item.CustomerActivePromotionList, function (itm) {

                itm.ComboQty = 0;

                if (itm.Action === "G") {
                    itm.ProductQuantity = itm.FocItemQuantity;
                } else {
                    itm.ProductQuantity = 0;
                }

                if (itm.ImageUrl !== "" && itm.ImageUrl !== null && itm.ImageUrl !== undefined) {
                    itm.ImageUrl = $rootScope.ServerUrl + itm.ImageUrl;
                }

                if (itm.FocImageUrl !== "" && itm.FocImageUrl !== null && itm.FocImageUrl !== undefined) {
                    itm.FocImageUrl = $rootScope.ServerUrl + itm.FocImageUrl;
                }

            });


        });

        return myArray;

    };

    $scope.LoadActivePromotions = function (customerCode) {


        $rootScope.Throbber.Visible = true;
        var requestData = {
            ServicesAction: 'GetAllActivePromotionItemListForCustomer',
            CustomerCode: customerCode
        };

        var consolidateApiParamater = {
            Json: requestData
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (responseData) {


            $rootScope.Throbber.Visible = false;
            $scope.CustomerActivePromotionList = [];
            $scope.CustomerActivePromotionGroupList = [];
            if (responseData.data !== undefined && responseData.data !== null) {

                if (responseData.data.Json !== undefined && responseData.data.Json !== null) {

                    $scope.CustomerActivePromotionList = responseData.data.Json.PromotionFocItemDetailList;

                    $scope.CustomerActivePromotionGroupList = $scope.GetCustomerActivePromotionGroupList();

                    /*$scope.CustomerActivePromotionList = $scope.CustomerActivePromotionList.filter(function(el) { return parseInt(el.CompanyId) == parseInt($rootScope.ReferenceId); });*/

                }
            }

            var validList = angular.copy($scope.SelectedInquiryJson.ProductList);
            validList = validList.filter(function (i) { return i.ParentProductCode !== "" && i.ParentProductCode !== null && i.ParentProductCode !== undefined; });

            if (validList !== undefined) {
                if (validList.length > 0) {
                    if ($scope.CustomerActivePromotionGroupList.length > 0) {

                        $scope.SetPromotionItem();

                    }
                } else {
                    $scope.CustomerActivePromotionGroupList = [];
                }
            } else {
                $scope.CustomerActivePromotionGroupList = [];
            }


            $('#Console_sidebar').addClass('open');
            var scrollablediv = angular.element(document.querySelector('.edit_control_tower_section'));
            scrollablediv[0].scrollTop = 0;

        }).catch(function (response) {
            $rootScope.Throbber.Visible = false;
        });

    };

    $rootScope.LoadEditEnquiryData = function () {
        $scope.LoadPageAccessControl("ManageInquiry", $rootScope.RoleId, $rootScope.UserId);
    };


    $scope.LoadPageAccessControl = function (pageName, roleId, userId) {


        var requestData =
        {
            ServicesAction: "GetPageControlAccessByPageIdAndRoleAndUserID",
            PageName: pageName,
            RoleId: roleId,
            UserId: userId
        };
        var consolidateApiParamater =
        {
            Json: requestData
        };

        var getPageControlAccessResponse = GrRequestService.ProcessRequest(consolidateApiParamater);
        $q.all([
            getPageControlAccessResponse
        ]).then(function (resp) {
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

                $scope.EditpageContrlDataAcess = pageRoleAccessCofiguration;
            } else {
                $scope.EditpageContrlDataAcess = pageRoleAccessCofiguration;
            }

            if ($rootScope.EnquiryAutonumber !== null && $rootScope.EnquiryAutonumber !== undefined) {
                $scope.LoadCustomerInquiriebyenquiryid($rootScope.EnquiryAutonumber);
            }


        });


    };



    $scope.SelectEditInquiryReasonCode = function (reasonCodeId, orderProductReasonCodeListJson, orderProductReasonCodeList) {

        var productReasonCode = [];
        if (orderProductReasonCodeList.length > 0 && reasonCodeId !== null) {
            productReasonCode = orderProductReasonCodeList.filter(function (el) { return el.OrderProductFeedbackGuid !== orderProductReasonCodeListJson.OrderProductFeedbackGuid && el.ReasonCodeId === reasonCodeId; });
        }
        if (productReasonCode.length === 0) {
            var selectedReasonCode = $scope.ReasonCodeList.filter(function (el) { return el.LookUpId === reasonCodeId; });
            if (selectedReasonCode.length > 0) {
                orderProductReasonCodeListJson.ReasonCodeId = reasonCodeId;
                orderProductReasonCodeListJson.ReasonCodeName = selectedReasonCode[0].Name;
            }
        } else {
            $scope.messageText = String.format($rootScope.resData.res_DuplicateCheckReasonCode);
            $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
            $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
            orderProductReasonCodeListJson.ReasonCodeId = 0;
            orderProductReasonCodeListJson.ReasonCodeName = "";
        }

    };

    $scope.OnChangeReasonCode = function (ResonCodeId) {
        if (ResonCodeId !== 0 && ResonCodeId !== "") {
            $scope.SelectedInquiryJson.ReasonCodeId = ResonCodeId;
        } else {
            $scope.SelectedInquiryJson.ReasonCodeId = ResonCodeId;
        }
    };

    $scope.IsoFomateDate = function (datetime) {
        var current_datetime = new Date(datetime);
        var formatted_date = current_datetime.getFullYear() + "-" + ((current_datetime.getMonth() + 1) < 10 ? '0' : '') + (current_datetime.getMonth() + 1) + "-" + (current_datetime.getDate() < 10 ? '0' : '') + current_datetime.getDate() + "T" + (current_datetime.getHours() < 10 ? '0' : '') + current_datetime.getHours() + ":" + (current_datetime.getMinutes() < 10 ? '0' : '') + current_datetime.getMinutes() + ":00";
        return formatted_date;
    };

    $scope.EditEnqueryData = function () {

        $rootScope.Throbber.Visible = true;

        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;

        if ($scope.SelectedInquiryJson !== null && $scope.SelectedInquiryJson !== "") {
            $scope.FinalEnquiryDataforSave = angular.copy($scope.SelectedInquiryJson);
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
                        reasonCodeObj.EventName = "EnquiryEdit";

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

                var ProductList = [];
                if ($scope.FinalEnquiryDataforSave.ProductList !== undefined && $scope.FinalEnquiryDataforSave.ProductList !== null) {
                    var ProductJson = $scope.FinalEnquiryDataforSave.ProductList;
                    var TotalNewProductQuantity = 0;
                    var totalAddedProductPrice = 0;
                    for (var i = 0; i < ProductJson.length; i++) {

                        if (ProductJson[i].AdditionalQuantity !== 0) {

                            var IsActive = '1';
                            var objproduct = {
                                "AllocationExcited": ProductJson[i].AllocationExcited,
                                "AllocationQty": ProductJson[i].AllocationQty,
                                "CollectionCode": ProductJson[i].CollectionCode,
                                "CurrentItemPalettesCorrectWeight": ProductJson[i].CurrentItemPalettesCorrectWeight,
                                "CurrentItemTruckCapacityFullInTone": ProductJson[i].CurrentItemTruckCapacityFullInTone,
                                "EnquiryProductId": ProductJson[i].EnquiryProductId,
                                "IsActive": IsActive,
                                "IsPackingItem": ProductJson[i].IsPackingItem,
                                "ItemId": ProductJson[i].ItemId,
                                "ProductName": ProductJson[i].ProductName,
                                "ItemPricesPerUnit": ProductJson[i].ItemPricesPerUnit,
                                "ItemType": ProductJson[i].ItemType,
                                "NumberOfExtraPalettes": ProductJson[i].NumberOfExtraPalettes,
                                "EnquiryGUID": ProductJson[i].EnquiryGUID,
                                "PackingItemCode": ProductJson[i].PackingItemCode,
                                "PackingItemCount": ProductJson[i].PackingItemCount,
                                "ParentItemId": ProductJson[i].ParentItemId,
                                "ParentProductCode": ProductJson[i].ParentProductCode,
                                "UOM": ProductJson[i].UOM,
                                "ProductCode": ProductJson[i].ProductCode,
                                "ProductQuantity": ProductJson[i].AvailableAdditionalQuantity,
                                "ProductType": ProductJson[i].ProductType,
                                "WeightPerUnit": ProductJson[i].WeightPerUnit,
                                "CreatedBy": ProductJson[i].CreatedBy,
                                "CompanyCode": ProductJson[i].CompanyCode,
                                "CompanyId": ProductJson[i].CompanyId,
                                "AdditionalQuantity": ProductJson[i].AvailableAdditionalQuantity
                            };
                            ProductList.push(objproduct);

                            if (ProductJson[i].ItemType !== 31) {

                                var TmpPrice = parseFloat(ProductJson[i].ItemPricesPerUnit * ProductJson[i].AvailableAdditionalQuantity);
                                totalAddedProductPrice = totalAddedProductPrice + TmpPrice;
                                TotalNewProductQuantity = TotalNewProductQuantity + ProductJson[i].AvailableAdditionalQuantity;

                            }

                        }

                    }


                    var PromotionProductList = [];

                    var promotionList = angular.copy($scope.CustomerActivePromotionGroupList);
                    /*promotionList = promotionList.filter(function (el) { return el.IsPromotionItemActive === '1'; });*/

                    if (promotionList.length > 0) {


                        for (var k = 0; k < promotionList.length; k++) {

                            for (var j = 0; j < promotionList[k].CustomerActivePromotionList.length; j++) {

                                var enquiryProduct = {};

                                if (promotionList[k].CustomerActivePromotionList[j].Action === "B") {

                                    enquiryProduct.AllocationExcited = "1";
                                    enquiryProduct.AllocationQty = 0;
                                    enquiryProduct.CollectionCode = "";
                                    enquiryProduct.CurrentItemPalettesCorrectWeight = 0;
                                    enquiryProduct.CurrentItemTruckCapacityFullInTone = 0;
                                    enquiryProduct.EnquiryProductId = promotionList[k].CustomerActivePromotionList[j].EnquiryProductId;
                                    enquiryProduct.IsActive = "1";
                                    enquiryProduct.IsPackingItem = "0";
                                    enquiryProduct.ItemId = promotionList[k].CustomerActivePromotionList[j].ItemId;
                                    enquiryProduct.ProductName = promotionList[k].CustomerActivePromotionList[j].ItemName;
                                    enquiryProduct.ItemPricesPerUnit = parseFloat(promotionList[k].CustomerActivePromotionList[j].Amount);
                                    enquiryProduct.ItemType = 32;
                                    enquiryProduct.NumberOfExtraPalettes = 0;
                                    enquiryProduct.EnquiryGUID = promotionList[k].CustomerActivePromotionList[j].EnquiryGUID;
                                    enquiryProduct.PackingItemCode = "0";
                                    enquiryProduct.PackingItemCount = 0;
                                    enquiryProduct.ParentItemId = 0;
                                    enquiryProduct.ParentProductCode = "";
                                    enquiryProduct.UOM = promotionList[k].CustomerActivePromotionList[j].UOM;
                                    enquiryProduct.ProductCode = promotionList[k].CustomerActivePromotionList[j].ItemCode;
                                    enquiryProduct.ProductQuantity = parseInt(promotionList[k].CustomerActivePromotionList[j].AvailableQuantity);
                                    enquiryProduct.ProductType = "9";
                                    enquiryProduct.WeightPerUnit = 0;
                                    enquiryProduct.CreatedBy = parseInt($rootScope.UserId);
                                    enquiryProduct.CompanyCode = promotionList[k].CustomerActivePromotionList[j].CompanyCode;
                                    enquiryProduct.CompanyId = promotionList[k].CustomerActivePromotionList[j].CompanyId;
                                    enquiryProduct.PromotionRefId = promotionList[k].ExternalSystemRefID;
                                    enquiryProduct.NumberOfPromotions = parseInt(promotionList[k].CustomerActivePromotionList[j].AvailableComboQty);
                                    enquiryProduct.AdditionalQuantity = 0;
                                    enquiryProduct.ComboQty = parseInt(promotionList[k].CustomerActivePromotionList[j].AvailableComboQty);
                                    enquiryProduct.TotalAmount = parseFloat(promotionList[k].CustomerActivePromotionList[j].TotalAmount);

                                    if (enquiryProduct.ItemType !== 31) {

                                        var TmpPrice1 = parseFloat(enquiryProduct.ItemPricesPerUnit * enquiryProduct.ProductQuantity);
                                        totalAddedProductPrice = totalAddedProductPrice + TmpPrice1;
                                        TotalNewProductQuantity = TotalNewProductQuantity + enquiryProduct.ProductQuantity;

                                    }


                                } else if (promotionList[k].CustomerActivePromotionList[j].Action === "G") {

                                    enquiryProduct.AllocationExcited = "1";
                                    enquiryProduct.AllocationQty = 0;
                                    enquiryProduct.CollectionCode = "";
                                    enquiryProduct.CurrentItemPalettesCorrectWeight = 0;
                                    enquiryProduct.CurrentItemTruckCapacityFullInTone = 0;
                                    enquiryProduct.EnquiryProductId = promotionList[k].CustomerActivePromotionList[j].EnquiryProductId;
                                    enquiryProduct.IsActive = "1";
                                    enquiryProduct.IsPackingItem = "0";
                                    enquiryProduct.ItemId = promotionList[k].CustomerActivePromotionList[j].ItemId;
                                    enquiryProduct.ProductName = promotionList[k].CustomerActivePromotionList[j].FocItemName;
                                    enquiryProduct.ItemPricesPerUnit = parseFloat(promotionList[k].CustomerActivePromotionList[j].Amount);
                                    enquiryProduct.ItemType = 31;
                                    enquiryProduct.NumberOfExtraPalettes = 0;
                                    enquiryProduct.EnquiryGUID = promotionList[k].CustomerActivePromotionList[j].EnquiryGUID;
                                    enquiryProduct.PackingItemCode = "0";
                                    enquiryProduct.PackingItemCount = 0;
                                    enquiryProduct.ParentItemId = 0;
                                    enquiryProduct.ParentProductCode = "";
                                    enquiryProduct.UOM = promotionList[k].CustomerActivePromotionList[j].FocUOM;
                                    enquiryProduct.ProductCode = promotionList[k].CustomerActivePromotionList[j].ItemCode;
                                    enquiryProduct.ProductQuantity = parseInt(promotionList[k].CustomerActivePromotionList[j].AvailableQuantity);
                                    enquiryProduct.ProductType = "9";
                                    enquiryProduct.WeightPerUnit = 0;
                                    enquiryProduct.CreatedBy = parseInt($rootScope.UserId);
                                    enquiryProduct.CompanyCode = promotionList[k].CustomerActivePromotionList[j].CompanyCode;
                                    enquiryProduct.CompanyId = promotionList[k].CustomerActivePromotionList[j].CompanyId;
                                    enquiryProduct.PromotionRefId = promotionList[k].ExternalSystemRefID;
                                    enquiryProduct.NumberOfPromotions = 0;
                                    enquiryProduct.AdditionalQuantity = 0;
                                    enquiryProduct.ComboQty = 0;
                                    enquiryProduct.TotalAmount = parseFloat(promotionList[k].CustomerActivePromotionList[j].TotalAmount);

                                }

                                PromotionProductList.push(enquiryProduct);

                            }

                        }

                        if (ProductList.length > 0) {

                            for (var p = 0; p < ProductList.length; p++) {

                                var tempInqJson = PromotionProductList.filter(function (el) { return el.ProductCode === ProductList[p].ProductCode; });

                                if (tempInqJson.length > 0) {
                                    tempInqJson[0].ProductQuantity = parseInt(ProductList[p].ProductQuantity) + parseInt(tempInqJson[0].ProductQuantity);
                                    tempInqJson[0].NumberOfPromotions = parseInt(tempInqJson[0].ComboQty);
                                    tempInqJson[0].AdditionalQuantity = parseInt(ProductList[p].ProductQuantity);
                                    tempInqJson[0].ProductType = "9";

                                    if (tempInqJson[0].ItemType !== 31) {
                                        tempInqJson[0].TotalAmount = parseFloat(ProductList[p].TotalAmount) + parseFloat(tempInqJson[0].TotalAmount);
                                    }

                                }


                            }


                            angular.forEach(PromotionProductList, function (item) {

                                ProductList = ProductList.filter(function (el) { return el.ProductCode !== item.ProductCode; });

                            });

                            ProductList.push.apply(ProductList, PromotionProductList);

                        }


                        totalAddedProductPrice = 0;
                        TotalNewProductQuantity = 0;
                        angular.forEach(ProductList, function (item) {

                            if (item.ItemType !== 31) {

                                var TmpPrice2 = parseFloat(item.ItemPricesPerUnit * item.ProductQuantity);
                                totalAddedProductPrice = totalAddedProductPrice + TmpPrice2;
                                TotalNewProductQuantity = TotalNewProductQuantity + item.ProductQuantity;

                            }

                        });



                    }




                    $scope.FinalEnquiryDataforSave.ProductList = ProductList;
                    var dateformate = $scope.IsoFomateDate($rootScope.InquiryRequestedDate);
                    /* var date = new Date($rootScope.InquiryRequestedDate).toISOString();
                     var newdate = new Date($rootScope.InquiryRequestedDate);*/
                    $scope.FinalEnquiryDataforSave.PromisedDate = dateformate;
                    $scope.FinalEnquiryDataforSave.CreatedBy = parseInt($rootScope.UserId);
                    /* $scope.FinalEnquiryDataforSave.ReasonCodeId = parseInt($scope.FinalEnquiryDataforSave.ReasonCodeId);*/
                    $scope.FinalEnquiryDataforSave.ReasonCodeList = ReasonCodeList;
                    $scope.FinalEnquiryDataforSave.TotalAmount = totalAddedProductPrice;
                    $scope.FinalEnquiryDataforSave.TotalQuantity = TotalNewProductQuantity;
                    $scope.FinalEnquiryDataforSave.EditCompanyCode = $rootScope.CompanyMnemonic;
                    $scope.FinalEnquiryDataforSave.EditRoleId = parseInt($rootScope.RoleId);
                    $scope.FinalEnquiryDataforSave.LoginId = parseInt($rootScope.UserId);
                }
                var inquiryJsonDto = $scope.FinalEnquiryDataforSave;

                var enquiryDTO = JSON.stringify(inquiryJsonDto);

                ManageEnquiryService.EditEnquiryOfCustomer(enquiryDTO).then(function (response) {
                    $rootScope.Throbber.Visible = false;

                    if (response.data !== undefined) {
                        if (response.data !== null) {
                            var EnquiryAutoNumber = response.data.EnquiryAutoNumber;
                            if (EnquiryAutoNumber === "" || EnquiryAutoNumber === null || EnquiryAutoNumber === undefined) {
                            } else {
                                $scope.OpenConformationPopupView = false;
                                $scope.OpenSomethingWentWrongPopup("EditSubmitted");
                                $scope.toggleConsole_sidebar();
                                $scope.RefreshDataGrid();
                            }
                        }
                    }

                }).catch(function (response) {
                    $rootScope.Throbber.Visible = false;
                });

            }
        }
    };
    $scope.ChangeRequestDate = function () {

        $rootScope.SelectedDefaultDate = $rootScope.InquiryRequestedDate;
        var ProposedMaxDeliveryDate = 0;
        var ProposedSettingValue = $rootScope.GetSettingValue('ScheduleDateNumber');
        if (ProposedSettingValue !== '') {
            ProposedMaxDeliveryDate = parseInt(ProposedSettingValue);
        }

        if ($rootScope.InquiryRequestedDate === "") {
            $rootScope.SelectedDefaultDate = getRequestDateTime($rootScope.NumberOfStartDate);
            $rootScope.InquiryRequestedDate = $rootScope.SelectedDefaultDate;
        } else {
            $rootScope.SelectedDefaultDate = $rootScope.InquiryRequestedDate;
        }

        var StartDate = $rootScope.NumberOfStartDate - 0;
        $rootScope.MinDate = getRequestDateTime(StartDate);
        var EndDate = ProposedMaxDeliveryDate + $rootScope.NumberOfStartDate;
        $rootScope.MaxDate = getRequestDateTime(EndDate);
        $rootScope.IsShowInquiryQuickAction = false;
        //  $rootScope.OpenRequestDateControlPopup();
        $scope.LoadDateSelection(new Date($rootScope.MinDate), new Date($rootScope.MaxDate));
    };

    $scope.ReasonCodes = {
        ReasonCodeList: [],
        ReasonCodeId: '',
        IsShowReasonTextBox: false,
        TotalEnquiriesCount: 0,
        TotalPrice: 0,
        ProductCount: 0,
        RequestDate: '',
        SoldToName: '',
        ReasonDescription: '',
        ValidationMsg: '',
        EnquiryAutoNumber: '',
        TotalQuantity: 0,
        PriorityRating: 0
    };
    $rootScope.SomethingWentWrongPopupOKButtonEvent = function () {

        $rootScope.SomethingWentWrongPopup = false;

        if ($scope.PopupPurpose === "EditSubmitted") {
            $scope.PopupPurpose = "";
            $state.go('app.ManageCustomerInquiries');
        }
        $scope.PopupPurpose = "";

    };
    /*Chetan Tambe : 20-12-2019 Validation Popup */
    $scope.OpenSomethingWentWrongPopup = function (popupPurpose) {
        $rootScope.PopupPurpose = popupPurpose;
        $rootScope.Throbber.Visible = false;
        $scope.ConfirmationPopupView = false;
        $scope.OpenSortingPopupView = false;
        $scope.ApproveRejectReasonCodePopup = false;
        $scope.ApproveRejectReasonCodeSingleInquiryPopup = false;
        $rootScope.SomethingWentWrongPopup = true;
    };

    $scope.ClosePopup = function () {
        $rootScope.Ionic_Back_ButtonGrMainFlow();
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

    $scope.ShowDiffQty = function (AvailableQuantity, oldQuantity) {



        var className = false;

        if (parseInt(AvailableQuantity) > parseInt(oldQuantity)) {
            className = true;
        } else {
            className = false;
        }

        return className;

    };

    $scope.OpenEditEnquiryPopup = function () {


        $scope.ReasonCodes = {
            ReasonCodeList: [],
            ReasonCodeId: '',
            IsShowReasonTextBox: true,
            RequestDate: '',
            SoldToName: '',
            ReasonDescription: '',
            ValidationMsg: '',
            OrderNumber: ''

        };

        $scope.ReasonCodes.IsShowReasonTextBox = false;
        $scope.LoadReasonCodes("EnquiryEdit");
        $scope.OpenSortingPopupView = true;
        $scope.OpenFilteringSelectionPopupView = false;
        $scope.RejectReasonCodeOrderPopup = true;
        $rootScope.SomethingWentWrongPopup = false;
    };



    $scope.CloseResonPopup = function () {
        $scope.PleaseSpecifyReasonDescription = true;
        $scope.IsAnyReasonCodeSelected = true;
        $scope.RejectReasonCodeOrderPopup = false;
        $rootScope.SomethingWentWrongPopup = false;
        $scope.ReasonCodes = {
            ReasonCodeList: [],
            ReasonCodeId: '',
            IsShowReasonTextBox: true,
            TotalEnquiriesCount: 0,
            RequestDate: '',
            SoldToName: '',
            ReasonDescription: '',
        };
        $scope.OpenConformationPopupView = !$scope.OpenConformationPopupView;
    };

    $scope.positiveLookingValue = function (value) {
        return Math.abs(value);
    };


    $scope.AddComboProductQty = function (promoItem) {

        if (promoItem.AvailableComboProductQuantity === "" || promoItem.AvailableComboProductQuantity === null || promoItem.AvailableComboProductQuantity === undefined) {

            promoItem.AvailableComboProductQuantity = 0;

        }

        promoItem.AvailableComboProductQuantity = parseInt(promoItem.AvailableComboProductQuantity) + 1;

        if ($scope.IsAllowToAddQtyWhileEditingInquiry === false) {

            if (parseInt(promoItem.AvailableComboProductQuantity) > parseInt(promoItem.ComboProductQuantity)) {
                promoItem.AvailableComboProductQuantity = parseInt(promoItem.ComboProductQuantity);

                $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
            }

        }

        promoItem.ComboDifferenceQuantity = parseInt(promoItem.ComboProductQuantity) - parseInt(promoItem.AvailableComboProductQuantity);
        promoItem.TotalAmount = 0;

        angular.forEach(promoItem.CustomerActivePromotionList, function (itemDetails) {

            if (itemDetails.Action === "B") {

                if (parseInt(promoItem.AvailableComboProductQuantity) < 9999) {

                    itemDetails.AvailableComboQty = promoItem.AvailableComboProductQuantity;

                    $scope.NewTotalAmount = ($scope.NewTotalAmount - parseFloat(itemDetails.Amount));

                    itemDetails.AvailableQuantity = parseInt(itemDetails.ItemQuantity) * parseInt(promoItem.AvailableComboProductQuantity);
                    itemDetails.TotalAmount = parseFloat(itemDetails.Amount) * itemDetails.AvailableQuantity;

                    promoItem.TotalAmount = parseFloat(promoItem.TotalAmount) + parseFloat(itemDetails.TotalAmount);

                    $scope.NewTotalAmount = ($scope.NewTotalAmount + parseFloat(itemDetails.Amount));

                    $scope.AddAndRemovePromotion(itemDetails);

                } else {

                    $rootScope.OpenMessagePopupEvent(true, String.format($rootScope.resData.res_HomePage_QuantityExceededMsg), 'OK');

                }

            }

        });



    };


    $scope.SubtractComboProductQty = function (promoItem) {

        if (promoItem.AvailableComboProductQuantity === "" || promoItem.AvailableComboProductQuantity === null || promoItem.AvailableComboProductQuantity === undefined) {

            promoItem.AvailableComboProductQuantity = 0;

        }

        if (parseInt(promoItem.AvailableComboProductQuantity) > 0) {
            promoItem.AvailableComboProductQuantity = parseInt(promoItem.AvailableComboProductQuantity) - 1;
        } else {
            promoItem.AvailableComboProductQuantity = 0;
        }
        promoItem.ComboDifferenceQuantity = parseInt(promoItem.ComboProductQuantity) - parseInt(promoItem.AvailableComboProductQuantity);
        promoItem.TotalAmount = 0;

        angular.forEach(promoItem.CustomerActivePromotionList, function (itemDetails) {

            if (itemDetails.Action === "B") {

                itemDetails.AvailableComboQty = promoItem.AvailableComboProductQuantity;

                itemDetails.AvailableQuantity = parseInt(itemDetails.ItemQuantity) * parseInt(promoItem.AvailableComboProductQuantity);
                itemDetails.TotalAmount = parseFloat(itemDetails.Amount) * itemDetails.AvailableQuantity;

                promoItem.TotalAmount = parseFloat(promoItem.TotalAmount) + parseFloat(itemDetails.TotalAmount);

                $scope.NewTotalAmount = ($scope.NewTotalAmount - parseFloat(itemDetails.Amount));

                $scope.AddAndRemovePromotion(itemDetails);

            }

        });

        if (promoItem.AvailableComboProductQuantity === 0) {
            promoItem.AvailableComboProductQuantity = '';
        }


    };

    $scope.UpdateComboProductQty = function (promoItem) {


        if (promoItem.AvailableComboProductQuantity === "" || promoItem.AvailableComboProductQuantity === null || promoItem.AvailableComboProductQuantity === undefined) {

            promoItem.AvailableComboProductQuantity = 0;

        }

        if ($scope.IsAllowToAddQtyWhileEditingInquiry === false) {

            if (parseInt(promoItem.AvailableComboProductQuantity) > parseInt(promoItem.ComboProductQuantity)) {
                promoItem.AvailableComboProductQuantity = parseInt(promoItem.ComboProductQuantity);

                $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                $scope.SubmitPartialOrderReceiveConfirmationMsg = true;

            }

        }

        promoItem.ComboDifferenceQuantity = parseInt(promoItem.ComboProductQuantity) - parseInt(promoItem.AvailableComboProductQuantity);
        promoItem.TotalAmount = 0;

        angular.forEach(promoItem.CustomerActivePromotionList, function (itemDetails) {

            if (itemDetails.Action === "B") {



                if (parseInt(promoItem.AvailableComboProductQuantity) <= 9999) {

                    if (parseInt(promoItem.AvailableComboProductQuantity) > 0) {

                        itemDetails.AvailableComboQty = promoItem.AvailableComboProductQuantity;

                        itemDetails.AvailableQuantity = parseInt(itemDetails.ItemQuantity) * parseInt(promoItem.AvailableComboProductQuantity);
                        itemDetails.TotalAmount = parseFloat(itemDetails.Amount) * parseInt(itemDetails.AvailableQuantity);

                        promoItem.TotalAmount = parseFloat(promoItem.TotalAmount) + parseFloat(itemDetails.TotalAmount);


                    } else {

                        itemDetails.AvailableComboQty = 0;

                        itemDetails.AvailableQuantity = 0;
                        itemDetails.TotalAmount = 0;

                        promoItem.TotalAmount = 0;

                    }
                    $scope.AddAndRemovePromotion(itemDetails);

                } else {

                    itemDetails.AvailableComboQty = 9999;

                    itemDetails.AvailableQuantity = parseInt(itemDetails.ItemQuantity) * 9999;
                    itemDetails.TotalAmount = parseFloat(itemDetails.Amount) * itemDetails.AvailableQuantity;

                    promoItem.TotalAmount = parseFloat(promoItem.TotalAmount) + parseFloat(itemDetails.TotalAmount);

                    $scope.AddAndRemovePromotion(itemDetails);

                    $rootScope.OpenMessagePopupEvent(true, String.format($rootScope.resData.res_HomePage_QuantityExceededMsg), 'OK');


                }





            }

        });

        if (promoItem.AvailableComboProductQuantity === 0) {
            promoItem.AvailableComboProductQuantity = '';
        }

    };


    $rootScope.ShowHelpIcon = false;



});