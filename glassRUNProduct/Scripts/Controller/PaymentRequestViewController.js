angular.module("glassRUNProduct").controller('PaymentRequestController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    
    $scope.isPaymentRequestSlab = false;
    $scope.PaymentRequestSlabList = [];

    $scope.PaymentRequestVariable = {
        AdditionalSlabAmount: 0,
        AdditionalSlabAmountUnit: "",
        AdditionalSlabReason: ""
    }

    var unitOfMeasure_AmountList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'UnitOfMeasure_Amount' && el.LookUpId !== "1260"; });
    if (unitOfMeasure_AmountList.length > 0) {
        $scope.UnitOfMeasure_AmountList = unitOfMeasure_AmountList;
    }

    $rootScope.PaymentRequestByOrder = function (carrierId, orderId, orderNumber, e) {
        

        $scope.OrderId = orderId;
        $scope.OrderNumber = orderNumber;

        var requestData =
            {
                ServicesAction: 'OrderPaymentSlabByTransporterId',
                TransporterId: carrierId,
                OrderId: orderId,
                RoleId: $rootScope.RoleId,
                CultureId: $rootScope.CultureId

            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            $scope.isPaymentRequestSlab = false;
            if (response.data !== undefined && response.data !== null) {
                if (response.data.Json !== undefined) {
                    $scope.PaymentRequestSlabList = response.data.Json.PaymentRequestSlabList;
                    if ($scope.PaymentRequestSlabList.length > 0) {
                        $scope.isPaymentRequestSlab = true;
                        for (var i = 0; i < $scope.PaymentRequestSlabList.length; i++) {
                            if ($scope.PaymentRequestSlabList[i].AmountUnit === "1260") {

                                var percentage = $scope.PaymentRequestSlabList[i].Amount;
                                $scope.PaymentRequestSlabList[i].PercentageValue = parseFloat(percentage);
                                var amount = 0;
                                if ($scope.PaymentRequestSlabList[i].TripCost !== 0) {
                                    amount = parseFloat($scope.PaymentRequestSlabList[i].TripCost) * (parseFloat($scope.PaymentRequestSlabList[i].Amount) / 100);
                                }
                                $scope.PaymentRequestSlabList[i].Amount = parseFloat(amount).toFixed(2);
                            }
                        }
                    }

                } else {
                    $scope.PaymentRequestSlabList = [];
                }
            } else {
                $scope.PaymentRequestSlabList = [];
            }
            
            var outerContainerWidth = document.getElementById("SalesAdminApprovalGrid").clientWidth;
            outerContainerWidth = outerContainerWidth - 10;

            e.component.expandRow(e.data);
            $rootScope.PreviousExpandedRow = e.data;


            var elements = document.getElementsByClassName("EnquiryProductInfoClass");
            var elementId = "";
            for (var i = 0; i < elements.length; i++) {
                elementId = elements[i].id;
                elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
            }
        });
    }


    $scope.SendSlabRequest = function (AdditionalPaymentRequestId, paymentRequestId, slabId, slabName) {
        var paymentRequestSlab = [];
        if (AdditionalPaymentRequestId === "0" || AdditionalPaymentRequestId === undefined || AdditionalPaymentRequestId === null) {
            if (paymentRequestId === "0") {
                paymentRequestSlab = $scope.PaymentRequestSlabList.filter(function (el) { return el.SlabId === slabId });
            } else {
                paymentRequestSlab = $scope.PaymentRequestSlabList.filter(function (el) { return el.PaymentRequestId === paymentRequestId });
            }
        } else {
            paymentRequestSlab = $scope.PaymentRequestSlabList.filter(function (el) { return el.AdditionalPaymentRequestId === AdditionalPaymentRequestId });
        }
        if (paymentRequestSlab[0].Amount > 0) {
            var action = "InsertPaymentRequest";
            if (paymentRequestSlab[0].PaymentRequestId === "0") {
                action = "InsertPaymentRequest";
            }
            else {
                action = "UpdatePaymentRequest";
            }

            var requestData =
                {
                    ServicesAction: action,
                    PaymentRequestList: [{
                        OrderId: $scope.OrderId,
                        OrderNumber: $scope.OrderNumber,
                        SlabId: slabId,
                        SlabName: slabName,
                        SlabReason: paymentRequestSlab[0].SlabReason,
                        Comment: "",
                        AmountUnit: "1259",
                        Amount: paymentRequestSlab[0].Amount,
                        Percentage: paymentRequestSlab[0].Percentage,
                        Status: 2201,
                        IsResetSpecified: true,
                        IsStatusSpecified: true,
                        CreatedBy: $rootScope.UserId,
                        PaymentRequestId: paymentRequestSlab[0].PaymentRequestId,
                    }]

                };
            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                if (response.data !== undefined) {
                    paymentRequestSlab[0].Status = "2201";


                    var eventNotificationList = [];


                    var eventCode = "";

                    if (slabName == "Advance") {
                        eventCode = "AdvancedPaymentRequest";
                    }
                    else if (slabName == "Final") {

                        eventCode = "FinalPaymentRequest";

					} else if (slabName == "MiscellaneousPayment") {

						eventCode = "MiscellaneousPaymentRequest";

					}


                    var eventnotification = {};
					eventnotification.EventCode = eventCode;


					if (paymentRequestSlab[0].PaymentRequestId === "0") {
						eventnotification.ObjectId = response.data.Json.PaymentRequestId;
					}
					else {
						eventnotification.ObjectId = paymentRequestSlab[0].PaymentRequestId;
					}
					
					eventnotification.ObjectType = "PaymentRequest";
                    eventnotification.IsActive = 1;
                    eventNotificationList.push(eventnotification);


                    $rootScope.InsertInEventNotification(eventNotificationList);



                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequest_RequestSend), 'error', 8000);
                }
            });
        }
        else {
            $rootScope.ValidationErrorAlert('Enter Valid Amount', 'error', 8000);
            return;
        }


    }





    $scope.SendSlabPaymentRequest = function (paymentRequestId, slabId, slabName) {
        var paymentRequestSlab = [];

        if (paymentRequestId === "0") {
            paymentRequestSlab = $scope.PaymentRequestSlabList.filter(function (el) { return el.SlabId === slabId });
        } else {
            paymentRequestSlab = $scope.PaymentRequestSlabList.filter(function (el) { return el.PaymentRequestId === paymentRequestId });
        }


        var action = "InsertPaymentRequest";
        if (paymentRequestSlab[0].PaymentRequestId === "0") {
            action = "InsertPaymentRequest";
        }
        else {
            action = "UpdatePaymentRequest";
        }

        var requestData =
            {
                ServicesAction: action,
                PaymentRequestList: [{
                    OrderId: $scope.OrderId,
                    OrderNumber: $scope.OrderNumber,
                    SlabId: slabId,
                    SlabName: slabName,
                    SlabReason: paymentRequestSlab[0].SlabReason,
                    Comment: "",
                    AmountUnit: "1259",
                    Amount: paymentRequestSlab[0].Amount,
                    Percentage: paymentRequestSlab[0].Percentage,
                    Status: 2201,
                    IsResetSpecified: true,
                    IsStatusSpecified: true,
                    CreatedBy: $rootScope.UserId,
                    PaymentRequestId: paymentRequestSlab[0].PaymentRequestId,
                }]

            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data !== undefined) {
                paymentRequestSlab[0].Status = "2201";


                var eventNotificationList = [];


                var eventCode = "";

                if (slabName == "Advance") {
                    eventCode = "AdvancedPaymentRequest";
                }
                else if (slabName == "Final") {

                    eventCode = "FinalPaymentRequest";

				} else if (slabName == "MiscellaneousPayment") {

					eventCode = "MiscellaneousPaymentRequest";

				}

                var eventnotification = {};
                eventnotification.EventCode = eventCode;
                eventnotification.ObjectId = $scope.OrderId;
                eventnotification.ObjectType = "Order";
                eventnotification.IsActive = 1;
                eventNotificationList.push(eventnotification);


                $rootScope.InsertInEventNotification(eventNotificationList);



                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequest_RequestSend), 'error', 8000);
            }
        });


    }




    $scope.CheckPaymentRequestApplicable = function (AdditionalPaymentRequestId, paymentRequestId, slabId, slabName, ApplicableAfter) {
        debugger;
        //if ($scope.paymentslab.Amount <= 0) {

        //    $rootScope.ValidationErrorAlert('Enter Valid Amount..', 'error', 8000);
        //    return;
        //}
        var requestData = {};
        requestData.ApplicableAfter = ApplicableAfter;
        requestData.OrderId = $scope.OrderId;
        requestData.ServicesAction = "CheckPaymentRequestApplicableByOrderId";

        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data != null) {

                var isApplicable = response.data.Json.IsApplicable;
                if (isApplicable == "1") {
                    $scope.SendSlabRequest(AdditionalPaymentRequestId, paymentRequestId, slabId, slabName);

                } else {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequest_CheckPaymentRequestApplicableError), 'error', 8000);

                }




            }
        });




    }




  


    $scope.ShowAdditionalTab = function () {
        
        $scope.showadditiontab = true;
    }

    $scope.AddAdditionalSlab = function () {
        
        if ($scope.PaymentRequestVariable.AdditionalSlabAmountUnit !== "" && $scope.PaymentRequestVariable.AdditionalSlabAmountUnit !== undefined) {

            if (($scope.PaymentRequestVariable.AdditionalSlabAmount !== "" && $scope.PaymentRequestVariable.AdditionalSlabAmount !== undefined) && $scope.PaymentRequestVariable.AdditionalSlabAmount > 0) {
                if ($scope.PaymentRequestVariable.AdditionalSlabReason === "") {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequetViewPage_MsgEnterReason), '', 8000);
                    return;
                }
                var UnitNameList = $scope.UnitOfMeasure_AmountList.filter(function (el) { return el.LookUpId === $scope.PaymentRequestVariable.AdditionalSlabAmountUnit; });;
                var UnitName = UnitNameList[0].Name;
var uniqid=generateGUID();
                var AdditionalSlab = {
                    AdditionalPaymentRequestId: generateGUID(),
                    PaymentRequestId: uniqid,
                    SlabId: 0,
                    SlabName: "MiscellaneousPayment",
                    EffectiveFrom: "",
                    EffectiveTo: '',
                    ApplicableAfter: 0,
                    Amount: $scope.PaymentRequestVariable.AdditionalSlabAmount,
                    AmountUnit: $scope.PaymentRequestVariable.AdditionalSlabAmountUnit,
                    AmountUnitName: UnitName,
                    ReasonCodeId: 0,
                    Remark: $scope.PaymentRequestVariable.AdditionalSlabReason,
                    SlabReason: $scope.PaymentRequestVariable.AdditionalSlabReason,
                    Status: 0,
                    IsActive: 1,
                    IsAdded: true
                }


                $scope.PaymentRequestSlabList.push(AdditionalSlab);
                


                var paymentRequestSlab = [];


                var action = "InsertPaymentRequest";


                var requestData =
                    {
                        ServicesAction: action,
                        PaymentRequestList: [{
                            OrderId: $scope.OrderId,
                            OrderNumber: $scope.OrderNumber,
                            SlabId: 0,
							SlabName: "MiscellaneousPayment",
                            SlabReason: $scope.PaymentRequestVariable.AdditionalSlabReason,
                            Comment: "",
                            AmountUnit: "1259",
                            Amount: $scope.PaymentRequestVariable.AdditionalSlabAmount,
                            Percentage: "",
                            Status: 0,
                            IsResetSpecified: true,
                            IsStatusSpecified: true,
                            CreatedBy: $rootScope.UserId,
                            PaymentRequestId: "0",
                        }]

                    };
                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    
				var paymentRequestSlabValyue = $scope.PaymentRequestSlabList.filter(function (el) { return el.PaymentRequestId === uniqid });
				paymentRequestSlabValyue[0].PaymentRequestId=response.data.Json.PaymentRequestId;
                    $scope.ClearAdditionalPayment();
                });
                


            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequetViewPage_EnterAmount), '', 8000);
                // $rootScope.ValidationErrorAlert('Please Enter Amount.', '', 3000);
            }
        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PaymentRequetViewPage_MsgAmountUnit), '', 8000);
        }

    }

    $scope.ClearAdditionalPayment = function () {
        
        $scope.showadditiontab = false;

        $scope.PaymentRequestVariable = {
            AdditionalSlabAmount: 0,
            AdditionalSlabAmountUnit: "",
            AdditionalSlabReason: ""
        }
    }


}).directive('validNumber', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }

                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }

                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});