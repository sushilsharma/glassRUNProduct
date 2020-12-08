angular.module("glassRUNProduct").controller('FeedbackDetailController', function ($scope, $rootScope, $sessionStorage, $ionicPopover, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {


    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.LoadOrderFeedbackDetails = function () {


        var requestData =
            {
                ServicesAction: 'LoadFeedbackByOrderId',
                OrderId: $rootScope.FeedbackOrderId,
                OrderFeedbackId: $rootScope.FeedbackOrderFeedbackId,
                RoleId: $rootScope.RoleId,
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $scope.OrderFeedbackListJson = [];
            var resoponsedata = response.data;
            if (resoponsedata.Json != undefined) {
                $scope.OrderFeedbackListJson = resoponsedata.Json.OrderFeedbackList;
                if ($scope.OrderFeedbackListJson.length > 0) {
                    $scope.OrderFeedbackList = $scope.OrderFeedbackListJson.filter(function (el) { return el.OrderProductId === "0"; });

                    $scope.SalesOrderNumber = $scope.OrderFeedbackListJson[0].SalesOrderNumber;
                    $scope.OrderNumber = $scope.OrderFeedbackListJson[0].OrderNumber;
                    $scope.OrderId = $scope.OrderFeedbackListJson[0].OrderId;
                    $scope.OrderDate = $scope.OrderFeedbackListJson[0].OrderDate;
                    $scope.DeliveryLocationName = $scope.OrderFeedbackListJson[0].DeliveryLocationName;

                    $scope.OrderProductFeedbackList = $scope.OrderFeedbackListJson.filter(function (el) { return el.OrderProductId !== "0"; });
                }
                $rootScope.Throbber.Visible = false;

            } else {
                //$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_NoRecordFound), 'success', 3000);
            }
        });
    }

    $scope.LoadOrderFeedbackDetails();

    $scope.FeedbackMessage = { OrderFeedbackId: 0, Replyfeedback: '' }

    $ionicPopover.fromTemplateUrl('FeedbackReply.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $scope.OpenPopover = function ($event, index) {

        $scope.FeedbackMessage.OrderFeedbackId = index;
        $scope.popover.show($event);
    };

    $scope.ClosePopOver = function () {

        $scope.popover.hide();
    }

    $scope.SaveFeedbackReply = function () {


        if ($scope.FeedbackMessage.replyfeedback != "") {
            var OrderFeedbackReply = {
                OrderFeedbackId: $scope.FeedbackMessage.OrderFeedbackId,
                ParentOrderFeedbackReplyId: 0,
                Comment: $scope.FeedbackMessage.Replyfeedback,
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

                $scope.LoadOrderFeedbackDetails();
                $scope.FeedbackMessage.Replyfeedback = "";
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_ReplySaved), 'success', 3000);
                $scope.ClosePopOver();
            });

        } else {

            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_AddReply), 'warning', 3000);

        }




    }


    // View Feedback.

    $ionicModal.fromTemplateUrl('templates/ViewFeedback.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.ViewFeedbackpopup = modal;
    });

    $scope.OpenViewFeedbackpopup = function (orderFeedbackId) {

        $scope.FeedbackMessage.OrderFeedbackId = orderFeedbackId;
        $scope.FeedbackRepliesList = $scope.OrderFeedbackListJson.filter(function (el) { return el.OrderFeedbackId === orderFeedbackId; });
        if ($scope.FeedbackRepliesList.length > 0) {
            $scope.FeedbackRepliesList = $scope.FeedbackRepliesList[0].OrderFeedbackReplyList;
        }

        $scope.ViewFeedbackpopup.show();
    }

    $scope.CloseViewFeedbackpopup = function () {

        $scope.ViewFeedbackpopup.hide();
        $scope.popover.hide();
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

                var filName = documentName;
                saveAs(blob, filName);
            } else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_DocumentNotGenerated), '', 3000);
            }

        });

    }


    $ionicModal.fromTemplateUrl('FeedbackView/OrderFeedbackView.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        $scope.OrderFeedbackViewCodePopup = modal;
    });


    $scope.LoadFeedBackForProduct = function (ProductCode, OrderFeedbackId, feedbackId, SubFeedbackId) {
        debugger;
        $rootScope.ParentOrderFeedbackReplyId = OrderFeedbackId;
        $scope.OrderFeedbackViewCodePopup.show();
        $rootScope.FeedBackProductCode = ProductCode;
        $rootScope.OrderNumber = $scope.OrderNumber;
        $rootScope.OrderId = $scope.OrderId;
        $rootScope.feedbackId = feedbackId;
        $rootScope.SubFeedbackId = SubFeedbackId;
        $rootScope.OpenAddFeedbackpopup();
        $rootScope.Throbber.Visible = false;
    }

    $scope.OpenOrderFeedbackViewCodePopup = function (OrderFeedbackId, feedbackId, SubFeedbackId) {
        debugger;
        $rootScope.ParentOrderFeedbackReplyId = OrderFeedbackId;
        $rootScope.OrderNumber = $scope.OrderNumber;
        $rootScope.OrderId = $scope.OrderId;
        $rootScope.feedbackId = feedbackId;
        $rootScope.SubFeedbackId = SubFeedbackId;
        $scope.OrderFeedbackViewCodePopup.show();
        $rootScope.OpenAddFeedbackpopup();

    }

    $scope.CloseOrderFeedbackViewCodePopup = function () {
        debugger;
        $rootScope.ParentOrderFeedbackReplyId = 0;
        $rootScope.FeedBackProductCode = "";
        $rootScope.ResetFeedbackFields();
        $scope.OrderFeedbackViewCodePopup.hide();
        $scope.LoadOrderFeedbackDetails();
    };

    $scope.GoBackToPage = function(){
    
                $state.go("FeedbackGridPage");

    };

});
