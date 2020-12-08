
angular.module("glassRUNProduct").controller('OrderReceiveController', function ($scope, $rootScope, $q, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageOrderService) {
    debugger;


    $scope.messageText = "";

    $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = false;
    $scope.SubmitPartialOrderReceiveConfirmationMsg = false;

    var url = $location.url();
    $scope.urlhost = $location.url();
    var URLSplit = $scope.urlhost.split("/");
    var controllerName = "";
    if (URLSplit.length > 0) {
        controllerName = URLSplit[URLSplit.length - 1];
    }



    /* Set Partial Order Receive Page Title Using Order Number */
    $scope.OrderReceiveConfirmationPropertyJson = {
        pageTitle: $rootScope.resData.res_PartialOrderReceive_PageTiltle
    };

    /* Load reason code from look up and use partial delivery lookup category for reason code dropdown list */
    $scope.LoadReasonCodeList = function () {
        $scope.ReasonCodeList = [];
        if ($rootScope.AllLookUpData !== undefined && $rootScope.AllLookUpData.length > 0) {
            var reasonCodeList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === "CustomerFeedback" && parseInt(el.ParentId) === 1502; });
            if (reasonCodeList.length > 0) {
                $scope.ReasonCodeList = reasonCodeList;
            }
        }
    };
    $scope.LoadReasonCodeList();

    /* Reseat Order Feedback Object On Receive Quantity chnage and page load */

    $scope.ReseatOrderFeedbackList = function (orderProductObject) {
        orderProductObject.OrderProductFeedback = [];
        orderProductObject.isProductQuantityShortfall = false;
        orderProductObject.IsShowAddReasoButton = false;
        var orderProductFeedback = {
            OrderId: $rootScope.SelectedOrderJson.OrderId,
            ItemId: orderProductObject.OrderProductId,
            ItemCode: orderProductObject.ProductCode,
            ReasonCodeId: 0,
            ReasonCodeName: "",
            ShortfallQuantity: 0,
            OrderProductFeedbackGuid: generateGUID()
        };
        orderProductObject.OrderProductFeedback.push(orderProductFeedback);
    };

    /* Load product count and total quantities */
    $scope.OrderProductCount = 0;
    $scope.OrderProductQuantity = 0;
    $rootScope.LoadProductCountAndQuantity = function () {

        var requestData =
        {
            ServicesAction: "GetPageControlAccessByPageIdAndRoleAndUserID",
            PageName: "Partial Order Confirmation",
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId
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

                $scope.OrderReceivepageContrlDataAcess = pageRoleAccessCofiguration;
            } else {
                $scope.OrderReceivepageContrlDataAcess = pageRoleAccessCofiguration;
            }



            if ($rootScope.BackFromOrderSurveyPage === false) {
                if ($rootScope.SelectedOrderJson !== undefined && $rootScope.SelectedOrderJson !== null && $rootScope.SelectedOrderJson !== "") {
                    if ($rootScope.SelectedOrderJson.ProductList !== undefined && $rootScope.SelectedOrderJson.ProductList !== null) {
                        $scope.OrderProductCount = $rootScope.SelectedOrderJson.ProductList.length;
                        for (var i = 0; i < $rootScope.SelectedOrderJson.ProductList.length; i++) {

                            $rootScope.SelectedOrderJson.ProductList[i].ShortfallQuantity = 0;

                            $scope.ReseatOrderFeedbackList($rootScope.SelectedOrderJson.ProductList[i]);

                            $scope.OrderProductQuantity = parseInt($scope.OrderProductQuantity) + parseInt($rootScope.SelectedOrderJson.ProductList[i].ProductQuantity);


                        }

                        $rootScope.CartTotalCount = $scope.OrderProductCount;
                    }
                }
            }

            $('#Parial_Order_Receive_Panel').addClass('open');
            var scrollablediv = angular.element(document.querySelector('.edit_control_tower_section'));
            scrollablediv[0].scrollTop = 0;



        });


    };






    /* 02/03/2020 : Change Receive Quantity Function */
    $scope.ChangeReceivedQuantity = function (actionType, orderProductObject) {
        var value = 0;
        if (actionType === 'Minus') {

            if (orderProductObject.ReceiveQuantity !== "") {
                value = parseInt(orderProductObject.ReceiveQuantity) - 1;
                if (value >= parseInt(0)) {
                    orderProductObject.ReceiveQuantity = parseInt(orderProductObject.ReceiveQuantity) - 1;
                } else {
                    $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                    $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                    $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
                }
            } else {
                orderProductObject.ReceiveQuantity = 0;
            }
        } else if (actionType === 'Enter') {

            if (orderProductObject.ReceiveQuantity !== "") {
                value = parseInt(orderProductObject.ReceiveQuantity);
                if (value > parseInt(0) && value <= parseInt(orderProductObject.ProductQuantity)) {
                    orderProductObject.ReceiveQuantity = parseInt(orderProductObject.ReceiveQuantity);
                } else {
                    if (value === 0) {
                        orderProductObject.ReceiveQuantity = parseInt(value);
                    } else {
                        $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                        $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                        $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
                        orderProductObject.ReceiveQuantity = parseInt(orderProductObject.ProductQuantity);
                    }
                }
            } else {
                orderProductObject.ReceiveQuantity = 0;
            }


        } else if (actionType === 'Add') {
            if (orderProductObject.ReceiveQuantity !== "") {
                value = parseInt(orderProductObject.ReceiveQuantity) + 1;
                if (value <= parseInt(orderProductObject.ProductQuantity)) {
                    orderProductObject.ReceiveQuantity = parseInt(orderProductObject.ReceiveQuantity) + 1;
                } else {
                    $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                    $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                    $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
                }
            } else {
                orderProductObject.ReceiveQuantity = 1;
            }
        }

        var shortFallQuantity = 0;
        if (orderProductObject.ReceiveQuantity !== "") {
            shortFallQuantity = parseInt(orderProductObject.ProductQuantity) - parseInt(orderProductObject.ReceiveQuantity);
        } else {
            shortFallQuantity = parseInt(orderProductObject.ProductQuantity) - parseInt(0);
        }


        orderProductObject.ShortfallQuantity = shortFallQuantity;

        if (parseInt(orderProductObject.ReceiveQuantity) < parseInt(orderProductObject.ProductQuantity)) {
            orderProductObject.isProductQuantityShortfall = true;
            orderProductObject.IsShowAddReasoButton = true;
        } else {

            $scope.ReseatOrderFeedbackList(orderProductObject);

            orderProductObject.isProductQuantityShortfall = false;
            orderProductObject.IsShowAddReasoButton = false;
        }
    };


    $scope.CloseConfirmationPopup = function () {
        $scope.messageText = "";
        $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = false;
        $scope.SubmitPartialOrderReceiveConfirmationMsg = false;
    };


    /* update json for select reason code in order product feedback  */

    $scope.SelectFeedbackReasonCode = function (reasonCodeId, orderProductReasonCodeListJson, orderProductReasonCodeList) {

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
            orderProductReasonCodeListJson.ShortfallQuantity = 0;
            orderProductReasonCodeListJson.ReasonCodeName = "";
        }

    };


    /* Function to be used for add more reason code list*/
    $scope.AddMoreReasonCode = function (orderProductjson) {
        if ($rootScope.SelectedOrderJson.ProductList.length > 0) {
            var selectedProduct = $rootScope.SelectedOrderJson.ProductList.filter(function (el) { return el.ProductCode === orderProductjson.ProductCode; });
            if (selectedProduct.length > 0) {
                var CheckPreviousFeedbackList = selectedProduct[0].OrderProductFeedback.filter(function (el) { return el.ReasonCodeId === 0 || parseInt(el.ShortfallQuantity) <= 0 || el.ShortfallQuantity === ""; });
                if (CheckPreviousFeedbackList.length === 0) {
                    var orderProductFeedback = {
                        OrderId: $rootScope.SelectedOrderJson.OrderId,
                        ItemId: orderProductjson.OrderProductId,
                        ItemCode: orderProductjson.ProductCode,
                        ReasonCodeId: 0,
                        ReasonCodeName: "",
                        ShortfallQuantity: 0,
                        OrderProductFeedbackGuid: generateGUID()
                    };
                    selectedProduct[0].OrderProductFeedback.push(orderProductFeedback);

                } else {
                    $scope.messageText = String.format($rootScope.resData.res_CheckPreviouslyAddedReasonCode);
                    $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                    $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
                }
            }
        }
    };

    /* Function to be used for remove added reason code list*/
    $scope.RemoveShortfallReasonCode = function (orderProduct, orderProductFeedbackJson) {

        var isValid = true;
        if (orderProduct.OrderProductFeedback.length === 1) {

            if (parseInt(orderProduct.ShortfallQuantity) <= 0) {
                isValid = true;
            } else {
                isValid = false;
            }


        }

        if (isValid === true) {
            orderProduct.OrderProductFeedback = orderProduct.OrderProductFeedback.filter(function (el) { return el.OrderProductFeedbackGuid !== orderProductFeedbackJson.OrderProductFeedbackGuid; });

            var totalAddedShortfallQuantity = 0;
            for (var i = 0; i < orderProduct.OrderProductFeedback.length; i++) {
                totalAddedShortfallQuantity = parseInt(totalAddedShortfallQuantity) + parseInt(orderProduct.OrderProductFeedback[i].ShortfallQuantity);
            }


            if (parseInt(totalAddedShortfallQuantity) === parseInt(orderProduct.ShortfallQuantity)) {
                orderProduct.IsShowAddReasoButton = false;
            } else {
                orderProduct.IsShowAddReasoButton = true;
            }

            if (orderProduct.OrderProductFeedback.length === 0) {

                $scope.ReseatOrderFeedbackList(orderProduct);

                orderProduct.isProductQuantityShortfall = false;
                orderProduct.IsShowAddReasoButton = false;

            }
        } else {
            $scope.messageText = String.format($rootScope.resData.res_addedShortfallQuantityReasonCode);
            $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
            $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
        }




    };

    /* Function to be used for update product reason code quantity. */

    $scope.ChangeOrderReasonCodeQuantity = function (actionType, orderProductFeedbackJson, orderProduct) {

        if (parseInt(orderProductFeedbackJson.ReasonCodeId) > 0 && orderProductFeedbackJson.ReasonCodeId !== "") {
            var shortFallQuantity = 0;
            var currentReasonCodeFallQuantity = 0;

            var productFeedback = orderProduct.OrderProductFeedback.filter(function (el) { return el.OrderProductFeedbackGuid !== orderProductFeedbackJson.OrderProductFeedbackGuid; });
            for (var i = 0; i < productFeedback.length; i++) {
                if (productFeedback[i].ShortfallQuantity !== "") {
                    shortFallQuantity = parseInt(shortFallQuantity) + parseInt(productFeedback[i].ShortfallQuantity);
                }

            }

            if (actionType === 'Minus') {

                var value = parseInt(orderProductFeedbackJson.ShortfallQuantity) - 1;
                if (value >= parseInt(0)) {
                    currentReasonCodeFallQuantity = parseInt(orderProductFeedbackJson.ShortfallQuantity) - 1;
                } else {
                    $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                    $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                    $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
                }
            } else if (actionType === 'Add') {
                if (orderProductFeedbackJson.ShortfallQuantity !== "") {
                    currentReasonCodeFallQuantity = parseInt(orderProductFeedbackJson.ShortfallQuantity) + 1;
                } else {
                    currentReasonCodeFallQuantity = 1;
                }

            } else if (actionType === 'Enter') {
                if (orderProductFeedbackJson.ShortfallQuantity !== "") {
                    currentReasonCodeFallQuantity = parseInt(orderProductFeedbackJson.ShortfallQuantity);
                } else {
                    currentReasonCodeFallQuantity = "";
                }

            }

            if (currentReasonCodeFallQuantity !== "") {
                shortFallQuantity = shortFallQuantity + currentReasonCodeFallQuantity;
            }


            if (shortFallQuantity <= parseInt(orderProduct.ShortfallQuantity)) {
                orderProductFeedbackJson.ShortfallQuantity = currentReasonCodeFallQuantity;
            } else {
                $scope.messageText = String.format($rootScope.resData.res_InvalidQuantity);
                $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
                $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
                orderProductFeedbackJson.ShortfallQuantity = 0;
            }

            var totalAddedShortfallQuantity = 0;
            for (var i = 0; i < orderProduct.OrderProductFeedback.length; i++) {
                totalAddedShortfallQuantity = parseInt(totalAddedShortfallQuantity) + parseInt(orderProduct.OrderProductFeedback[i].ShortfallQuantity);
            }


            if (parseInt(totalAddedShortfallQuantity) === parseInt(orderProduct.ShortfallQuantity)) {
                orderProduct.IsShowAddReasoButton = false;
            } else {
                orderProduct.IsShowAddReasoButton = true;
            }

        } else {
            orderProductFeedbackJson.ShortfallQuantity = 0;
            $scope.messageText = String.format($rootScope.resData.res_SelectReasonCodeFirst);
            $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
            $scope.SubmitPartialOrderReceiveConfirmationMsg = true;
        }


    };


    $scope.DateParse = function (datetime) {

        var newdate = new Date(datetime);
        return newdate;
    };


    /* Function is used to save partial order receive data in order json in sqlite database. */
    $rootScope.OrderProductFeedbackJsonList = [];
    $scope.SavePartialOrderReceive = function () {
        debugger;

        $rootScope.Throbber.Visible = true;

        $rootScope.OrderProductFeedbackJsonList = [];

        var isValid = true;

        if ($rootScope.SelectedOrderJson !== undefined && $rootScope.SelectedOrderJson !== null && $scope.OrderReceivepageContrlDataAcess.IsAddReasonCodeSection !== '0' && $scope.OrderReceivepageContrlDataAcess.IsAddReasonCodeSection !== null && $scope.OrderReceivepageContrlDataAcess.IsAddReasonCodeSection !== undefined) {
            if ($rootScope.SelectedOrderJson.ProductList.length > 0) {
                for (var i = 0; i < $rootScope.SelectedOrderJson.ProductList.length; i++) {

                    var productShortfallQuantity = 0;
                    var totalShortfallQuantity = 0;

                    if (parseInt($rootScope.SelectedOrderJson.ProductList[i].ShortfallQuantity) > 0) {
                        productShortfallQuantity = parseInt($rootScope.SelectedOrderJson.ProductList[i].ShortfallQuantity);

                        for (var j = 0; j < $rootScope.SelectedOrderJson.ProductList[i].OrderProductFeedback.length; j++) {
                            var orderProductFeedbackObject = $rootScope.SelectedOrderJson.ProductList[i].OrderProductFeedback[j];
                            if (orderProductFeedbackObject.ShortfallQuantity !== "") {
                                totalShortfallQuantity = parseInt(totalShortfallQuantity) + parseInt(orderProductFeedbackObject.ShortfallQuantity);
                            }

                        }

                        if (productShortfallQuantity === totalShortfallQuantity) {
                            isValid = true;
                        } else {
                            isValid = false;
                            break;
                        }

                    }
                }
            }
        }

        if (isValid === true) {

            var result = "";
            result = getActualReceiveDate();
            /*var d = new Date();

            result = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();*/

            var orderFeedbackList = [];
            if ($rootScope.SelectedOrderJson !== undefined && $rootScope.SelectedOrderJson !== null) {
                if ($rootScope.SelectedOrderJson.ProductList.length > 0) {

                    for (var i = 0; i < $rootScope.SelectedOrderJson.ProductList.length; i++) {

                        if (parseInt($rootScope.SelectedOrderJson.ProductList[i].ShortfallQuantity) > 0) {


                            if ($scope.OrderReceivepageContrlDataAcess.IsAddReasonCodeSection !== '0' && $scope.OrderReceivepageContrlDataAcess.IsAddReasonCodeSection !== null && $scope.OrderReceivepageContrlDataAcess.IsAddReasonCodeSection !== undefined) {
                                var productQuantity = $rootScope.SelectedOrderJson.ProductList[i].ProductQuantity;
                                var shortFallQuantity = 0;
                                for (var j = 0; j < $rootScope.SelectedOrderJson.ProductList[i].OrderProductFeedback.length; j++) {
                                    var orderProductFeedbackObject = $rootScope.SelectedOrderJson.ProductList[i].OrderProductFeedback[j];
                                    if (orderProductFeedbackObject.ShortfallQuantity !== "") {
                                        shortFallQuantity = shortFallQuantity + parseInt(orderProductFeedbackObject.ShortfallQuantity);
                                    }
                                }

                                productQuantity = productQuantity - shortFallQuantity;



                                for (var j = 0; j < $rootScope.SelectedOrderJson.ProductList[i].OrderProductFeedback.length; j++) {

                                    var orderProductFeedbackObject = $rootScope.SelectedOrderJson.ProductList[i].OrderProductFeedback[j];

                                    if (orderProductFeedbackObject.ShortfallQuantity !== "" && parseInt(orderProductFeedbackObject.ShortfallQuantity) > 0 && parseInt(orderProductFeedbackObject.ReasonCodeId) > 0 && orderProductFeedbackObject.ReasonCodeId !== "") {

                                        var feedbackjsonActual = {
                                            OrderFeedbackId: 0,
                                            OrderId: $rootScope.SelectedOrderJson.OrderId,
                                            OrderProductId: orderProductFeedbackObject.ItemId,
                                            feedbackId: orderProductFeedbackObject.ReasonCodeId,
                                            ItemFeedbackName: orderProductFeedbackObject.ReasonCodeId,
                                            Attachment: "",
                                            FeedbackGuId: orderProductFeedbackObject.OrderProductFeedbackGuid,
                                            FeedbackName: orderProductFeedbackObject.ReasonCodeName,
                                            ProductName: orderProductFeedbackObject.ItemCode,
                                            ProductCode: orderProductFeedbackObject.ItemCode,
                                            ParentOrderFeedbackReplyId: 0,
                                            Name: "",
                                            Comment: "",
                                            ActualReceiveDate: result,
                                            HVBLComment: "",
                                            Quantity: orderProductFeedbackObject.ShortfallQuantity,
                                            ActualReceiveQuantity: productQuantity,
                                            CreatedBy: $rootScope.UserId,
                                            IsApp: "1",
                                            DocumentsList: []

                                        };

                                        orderFeedbackList.push(feedbackjsonActual);
                                    }
                                }
                            } else {
                                var feedbackjsonActualjson = {
                                    OrderFeedbackId: 0,
                                    OrderId: $rootScope.SelectedOrderJson.OrderId,
                                    OrderProductId: $rootScope.SelectedOrderJson.ProductList[i].OrderProductId,
                                    feedbackId: 0,
                                    ItemFeedbackName: 0,
                                    Attachment: "",
                                    FeedbackGuId: 0,
                                    FeedbackName: "",
                                    ProductName: $rootScope.SelectedOrderJson.ProductList[i].ProductName,
                                    ProductCode: $rootScope.SelectedOrderJson.ProductList[i].ProductCode,
                                    ParentOrderFeedbackReplyId: 0,
                                    Name: "",
                                    Comment: "",
                                    ActualReceiveDate: result,
                                    HVBLComment: "",
                                    Quantity: $rootScope.SelectedOrderJson.ProductList[i].ShortfallQuantity,
                                    ActualReceiveQuantity: $rootScope.SelectedOrderJson.ProductList[i].ProductQuantity,
                                    CreatedBy: $rootScope.UserId,
                                    IsApp: "1",
                                    DocumentsList: []

                                };

                                orderFeedbackList.push(feedbackjsonActualjson);
                            }


                        }


                    }

                }
            }

            $rootScope.OrderProductFeedbackJsonList = orderFeedbackList;
            $rootScope.IsClickByPartialReceive = true;
            $rootScope.IsClickByFullReceive = false;

            var requestData = {
                ServicesAction: 'Savefeedback',
                OrderFeedbackList: orderFeedbackList
            };

            var consolidateApiParamater =
            {
                Json: requestData
            };


            var customerApi = GrRequestService.ProcessRequest(consolidateApiParamater);

            var OrderFeedBackListNew = [];
            for (var j = 0; j < orderFeedbackList.length; j++) {

                var ordFeedBack = {
                    OrderFeedbackId: parseInt(orderFeedbackList[j].OrderFeedbackId),
                    OrderId: parseInt(orderFeedbackList[j].OrderId),
                    OrderProductId: parseInt(orderFeedbackList[j].OrderProductId),
                    feedbackId: parseInt(orderFeedbackList[j].feedbackId),
                    ItemFeedbackName: parseInt(orderFeedbackList[j].ItemFeedbackName),
                    Attachment: orderFeedbackList[j].Attachment,
                    ProductCode: orderFeedbackList[j].ProductCode,
                    ParentOrderFeedbackReplyId: parseInt(orderFeedbackList[j].ParentOrderFeedbackReplyId),
                    Comment: orderFeedbackList[j].Comment,
                    ActualReceiveDate: orderFeedbackList[j].ActualReceiveDate,
                    HVBLComment: orderFeedbackList[j].HVBLComment,
                    Quantity: parseFloat(orderFeedbackList[j].Quantity),
                    ActualReceiveQuantity: parseFloat(orderFeedbackList[j].ActualReceiveQuantity),
                    CreatedBy: parseInt(orderFeedbackList[j].CreatedBy)
                };

                OrderFeedBackListNew.push(ordFeedBack);

            }

            var orderDTO = {
                ObjectId: $rootScope.SelectedOrderJson.OrderId,
                ObjectNumber: $rootScope.SelectedOrderJson.OrderNumber,
                CreatedBy: $rootScope.UserId,
                OrderId: $rootScope.SelectedOrderJson.OrderId,
                OrderNumber: $rootScope.SelectedOrderJson.OrderNumber,
                ReceivedBy: $rootScope.UserId,
                Coordinates: "",
                IsPartialReceive: true,
                LoginId: $rootScope.UserId,
                RoleId: $rootScope.RoleId,
                CurrentState: $rootScope.SelectedOrderJson.CurrentState,
                ReceivedDate: $scope.IsoFomateDate(),
                EnquiryAutoNumber: $rootScope.SelectedOrderJson.EnquiryAutoNumber,
                OrderFeedbackList: OrderFeedBackListNew

            };
            var orderReceive = ManageOrderService.UpdateOrderReceive(orderDTO);

            $q.all([
                orderReceive
            ]).then(function (resp) {
                debugger;

                $scope.toggle_PartialRecieve_sidebar();


                if (resp[0].data.CurrentState === 9061) {
                    $rootScope.Throbber.Visible = false;
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SubmitOrderReceiveConfirmationMessage, $rootScope.SelectedOrderJson.OrderNumber), '', 3000);
                    $scope.RefreshDataGrid();
                }
                else {
                    $rootScope.Throbber.Visible = false;
                    $scope.RefreshDataGrid();
                }



            });


        } else {

            $rootScope.Throbber.Visible = false;
            $rootScope.OrderProductFeedbackJsonList = [];

            $scope.messageText = String.format($rootScope.resData.res_SavePartialOrderReceive);
            $scope.SubmitPartialOrderReceiveConfirmationMsgOverlay = true;
            $scope.SubmitPartialOrderReceiveConfirmationMsg = true;

        }



    };

    function getActualReceiveDate() {


        var months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May',
            'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ];

        function monthNumToName(monthnum) {
            return months[monthnum - 1] || '';
        }


        var time = '';
        var date = new Date();
        var day = date.getDate(); // yields 
        var month = date.getMonth() + 1; // yields month
        var year = date.getFullYear(); // yields year

        if (month < 10) {
            month = "0" + month;
        }

        if (day < 10) {
            day = "0" + day;
        }

        // After this construct a string with the above results as below
        time = day + "-" + monthNumToName(month) + "-" + year;
        return time;
    }

    $rootScope.ShowHelpIcon = false;



});