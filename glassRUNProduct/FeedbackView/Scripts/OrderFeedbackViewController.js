angular.module("glassRUNProduct").controller('OrderFeedbackViewController', function ($scope, $q, $location, $ionicPopover, $filter, $sessionStorage, $state, GrRequestService, $rootScope, $ionicModal, pluginsService) {
    $scope.OrderFeedbackListJson = [];
    $scope.OrderFeedbackListJsonActual = [];
    $scope.OrderItemFeedback = [];
    $scope.bindallproduct = [];
    $scope.IsFeedBackForItem = false;
    $scope.ItemSectionForFeedback = true;
    $scope.fileupload = {
        File: '',
        ItemFile: '',
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

    $scope.IsFeedbackDetailPage = false;
    var page = $location.absUrl().split('#/')[1];
    if(page === "FeedbackDetailPage")
    {
        $scope.IsFeedbackDetailPage = true;
    }
    else
    {
        $scope.IsFeedbackDetailPage = false;
    }

    $rootScope.OpenAddFeedbackpopup = function () {
        $scope.IsFeedBackForItem = false;

        $scope.IsSaveInProgress = false;

        $rootScope.IsRecordAddedToFeedback = false;

        $scope.labelOrderNumber = $rootScope.OrderNumber;
        $scope.labelOrderId = $rootScope.OrderId;

        $scope.FeedbackVariable.Name = $rootScope.feedbackId;
        $scope.GetValueByParentid($scope.FeedbackVariable.Name)
        $scope.FeedbackVariable.ItemFeedbackName = $rootScope.SubFeedbackId;

        $rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'LoadOrderProductById',
                OrderId: $scope.labelOrderId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;



        var FeedbackrequestData =
            {
                ServicesAction: 'LoadFeedbackByOrderId',
                OrderId: $scope.labelOrderId,
                OrderFeedbackId: $rootScope.ParentOrderFeedbackReplyId
            };

        var jsonobjectFeedback = {};
        jsonobjectFeedback.Json = FeedbackrequestData;



        var LoadOrderProductById = GrRequestService.ProcessRequest(jsonobject);
        var LoadFeedbackByOrderId = GrRequestService.ProcessRequest(jsonobjectFeedback);



        $q.all([
            LoadOrderProductById,
            LoadFeedbackByOrderId
        ]).then(function (resp) {

            $rootScope.Throbber.Visible = false;
            var response = resp[0];
            var FeedbackResponse = resp[1];

            var FeedbackResponsedata = FeedbackResponse.data;
            if (FeedbackResponsedata.Json != undefined) {
                $scope.OrderFeedbackListJson = FeedbackResponsedata.Json.OrderFeedbackList;
                $scope.OrderFeedbackListJsonActual = FeedbackResponsedata.Json.OrderFeedbackList;
            }


            var resoponsedata = response.data;
            $scope.bindallproduct = resoponsedata.Json.OrderProductList;

            if ($rootScope.FeedBackProductCode !== undefined && $rootScope.FeedBackProductCode !== "") {
                if ($scope.bindallproduct.length > 0) {
                    $scope.IsFeedBackForItem = true;
                    var selectedProduct = $scope.bindallproduct.filter(function (el) { return el.ProductCode === $rootScope.FeedBackProductCode; });

                    if (selectedProduct.length > 0) {

                        $scope.FeedbackVariable.ItemName = selectedProduct[0].OrderProductId;
                        $scope.FeedbackVariable.Quantity = selectedProduct[0].ProductQuantity;
                        $scope.FeedbackVariable.UOM = selectedProduct[0].UOM;
                    }

                }

                $scope.OrderFeedbackListJson = $scope.OrderFeedbackListJson.filter(function (el) { return el.ProductCode === $rootScope.FeedBackProductCode; });
                $scope.OrderFeedbackListJsonActual = $scope.OrderFeedbackListJsonActual.filter(function (el) { return el.ProductCode === $rootScope.FeedBackProductCode; });
                $scope.bindOverAllFeedbak = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'OverallFeedback' && (parseInt(el.LookUpId) === 1502 || parseInt(el.LookUpId) === 1506 || parseInt(el.LookUpId) === 1503); });
            }
            else {
                $scope.OrderFeedbackListJson = $scope.OrderFeedbackListJson.filter(function (el) { return el.ProductCode === '0'; });
                $scope.OrderFeedbackListJsonActual = $scope.OrderFeedbackListJsonActual.filter(function (el) { return el.ProductCode === '0'; });
                $scope.bindOverAllFeedbak = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'OverallFeedback' && (parseInt(el.LookUpId) !== 1502 && parseInt(el.LookUpId) !== 1503); });
            }

        });

    };




    $scope.GetValueByParentid = function (parentid) {

        $scope.bindallFeedbak = [];
        $scope.allSubFeedback = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'CustomerFeedback'; });
        $scope.bindallFeedbak = $scope.allSubFeedback.filter(function (el) { return parseInt(el.ParentId) === parseInt(parentid) });

        if($scope.bindallFeedbak.length === 1)
        {

            $scope.FeedbackVariable.ItemFeedbackName = $scope.bindallFeedbak[0].LookUpId;

        }

        //if (parseInt(parentid) === 1502 || parseInt(parentid) === 1503) {
        //    $scope.ItemSectionForFeedback = false;
        //} else {
        //    $scope.ItemSectionForFeedback = true;
        //}
    }


    $scope.ItemFileNameChanged = function (element) {

        $scope.$apply(function () {

            $scope.FeedbackVariable.labelItemFilename = element.files[0].name;;
        });
    }

    $scope.FileNameChanged = function (element) {
 
        $scope.$apply(function () {

            $scope.FeedbackVariable.labelFilename = element.files[0].name;
            debugger;
            var filename = element.files[0].name;
            var extension = filename.substring(filename.lastIndexOf('.') + 1);

            if (extension !== '' && extension !== undefined) {

                extension = extension.toLowerCase();
            }

            var fileExtensionAllow = ['png', 'docx', 'doc', 'pdf', 'xlsx'];

            if (!fileExtensionAllow.includes(extension))
            {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderFeedback_FileUploadWarning), '', 3000);
                $scope.FeedbackVariable.labelFilename = "";
            }

            //if(element.files[0].type !== "image/png" && element.files[0].type !== "application/pdf" && element.files[0].type !== "application/docx" && element.files[0].type !== "application/doc" && element.files[0].type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            //{
            //    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderFeedback_FileUploadWarning), '', 3000);
            //    $scope.FeedbackVariable.labelFilename = "";
            //}

        });
    }


    $rootScope.ResetFeedbackFields = function () {
        angular.element("input[type='file']").val(null);
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
        $scope.OrderFeedbackListJson = [];
        $scope.OrderFeedbackListJsonActual = [];
        $scope.ReturnQuantityFieldDistabled = false;
        $scope.ItemSectionForFeedback = true;
        $scope.ReturnQuantityFieldDistabled = false;
        $scope.OrderItemFeedback = [];

    }

    $scope.Resetfeedback = function () {
        
        $rootScope.ResetFeedbackFields();
                $rootScope.OpenAddFeedbackpopup();
        //$scope.FeedbackVariable = {
        //    OverAll: true,
        //    Specific: false,
        //    Quantity: '',
        //    ProductCode: '',
        //    Name: '',
        //    ItemName: '',
        //    myFile: '',
        //    fileupload: '',
        //    ItemFeedbackName: '',
        //    ItemComment: '',
        //    Comment: '',
        //    UOM: "",
        //    Quantity: "",
        //    labelItemFilename: "",
        //    labelFilename: "",
        //    ReturnQuantity: "",
        //    ReceiveDate: "",
        //    ParentId: ""
        //}
        //angular.element("input[type='file']").val(null);

    }

    $scope.functiontofindIndexByKeyValue = function (arraytosearch, key, valuetosearch) {

        for (var i = 0; i < arraytosearch.length; i++) {

            if (arraytosearch[i][key] === valuetosearch) {
                return i;
            }
        }
        return -1;
    };

    $scope.AddMultipleFeedback = function () {

        $scope.AddFeedbackJson();
    }

    $scope.AddFeedbackJson = function () {

        var localJsonArray = [];
        if ($scope.FeedbackVariable.Name != "") {

            if($scope.bindallFeedbak.length > 0)
            {
                if($scope.FeedbackVariable.ItemFeedbackName === "" || $scope.FeedbackVariable.ItemFeedbackName === undefined || $scope.FeedbackVariable.ItemFeedbackName === null)
                {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderFeedback_SubFeedbackAlertMsg), 'success', 3000);
                    return false;
                }
            }

                if($scope.FeedbackVariable.Comment === "" || $scope.FeedbackVariable.Comment === undefined || $scope.FeedbackVariable.Comment === null)
                {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderFeedback_CommentAlertMsg), 'success', 3000);
                    return false;
                }

            if($scope.IsFeedbackDetailPage === false)
            {
                if($scope.FeedbackVariable.ItemName !== "" && $scope.FeedbackVariable.ItemName !== undefined && $scope.FeedbackVariable.ItemName !== null)
                {
                    if(parseInt($scope.FeedbackVariable.ReturnQuantity) <= 0 || $scope.FeedbackVariable.ReturnQuantity === "" || $scope.FeedbackVariable.ReturnQuantity === undefined || $scope.FeedbackVariable.ReturnQuantity === null)
                    {
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderFeedback_ReturnQuantityAlertMsg), 'success', 3000);
                        return false;
                    }

                    if(parseInt($scope.FeedbackVariable.ReturnQuantity) > parseInt($scope.FeedbackVariable.Quantity))
                    {
                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderFeedback_ReturnQuantityExceededMsg), 'success', 3000);
                        return false;
                    }
                }
                else{
                    $scope.FeedbackVariable.ReturnQuantity = 0;
                }
            }
            else{
                    $scope.FeedbackVariable.ReturnQuantity = 0;
                }

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

                    var filename = $scope.fileupload.File.dataFile.name;
                    var extension = filename.substring(filename.lastIndexOf('.') + 1);

                    if (extension !== '' && extension !== undefined) {

                        extension = extension.toLowerCase();
                    }

                    var fileExtensionAllow = ['png', 'docx', 'doc', 'pdf', 'xlsx'];

                    if (!fileExtensionAllow.includes(extension)) {
                        $scope.FileType = true;
                    }
                    else {
                        $scope.FileType = false;
                    }




                    //if ($scope.fileupload.File.dataFile.type == "application/pdf" || $scope.fileupload.File.dataFile.type == "application/docx" || $scope.fileupload.File.dataFile.type == "application/doc" || $scope.fileupload.File.dataFile.type == "application/doc" || $scope.fileupload.File.dataFile.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || $scope.fileupload.File.dataFile.type == "image/png") {
                    //    $scope.FileType = true;
                    //}
                    //else {
                    //    $scope.FileType = false;
                    //}
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
                ParentOrderFeedbackReplyId: $rootScope.ParentOrderFeedbackReplyId,
                Attachment: "",
                Comment: $scope.FeedbackVariable.Comment,
                ActualReceiveDate: $scope.FeedbackVariable.ReceiveDate,
                HVBLComment: "",
                Quantity: $scope.FeedbackVariable.ReturnQuantity,
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
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OrderFeedback_FeedbackTypeAlertMsg), 'success', 3000);
            return false;
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
                    
                    if($rootScope.feedbackId === "")
                    {
                        var feedbackjson = {
                            OrderFeedbackId: 0,
                            OrderId: $scope.labelOrderId,
                            OrderProductId: $scope.FeedbackVariable.ItemName,
                            feedbackId: $scope.FeedbackVariable.Name,
                            ItemFeedbackName: $scope.FeedbackVariable.ItemFeedbackName,
                            Attachment: "",
                            FeedbackGuId: feedbackguid,
                            FeedbackName: feedbackType,
                            Feedback: feedback,
                            ProductName: item,
                            ParentOrderFeedbackReplyId: $rootScope.ParentOrderFeedbackReplyId,
                            Name: $rootScope.ActiveUserName,
                            Comment: $scope.FeedbackVariable.Comment,
                            ActualReceiveDate: $scope.FeedbackVariable.ReceiveDate,
                            HVBLComment: "",
                            Quantity: $scope.FeedbackVariable.ReturnQuantity,
                            CreatedBy: $rootScope.UserId,
                            DocumentsList: [],
                            OrderFeedbackReplyList: [],
                            CreatedDate: $scope.ddMMyyyy
                        }

                        var documentjson = {
                            DocumentName: documentName,
                            DocumentExtension: documentExtension,
                            DocumentBase64: documentBase64,
                            ObjectType: "Feedback",
                            SequenceNo: 0,
                            CreatedBy: $rootScope.UserId,
                            IsActive: 1
                        }
                        feedbackjson.DocumentsList.push(documentjson);
                        $scope.OrderFeedbackListJson.push(feedbackjson);
                    }
                    else
                    {
                        
                        var idx = $scope.functiontofindIndexByKeyValue($scope.OrderFeedbackListJson, "feedbackId", $rootScope.feedbackId);
                        if (idx > -1) {

                            var orderFeedbackReplyList =[];

                            var replyByjson1 = {
                                Comment: $scope.FeedbackVariable.Comment,
                                Name: $rootScope.ActiveUserName,
                                CreatedDate: $scope.ddMMyyyy
                            }

                            if($scope.OrderFeedbackListJson[idx].OrderFeedbackReplyList !== undefined)
                            {
                                  $scope.OrderFeedbackListJson[idx].OrderFeedbackReplyList.push(replyByjson1);
                            }
                            else
                            {
                                orderFeedbackReplyList.push(replyByjson1);                
                                $scope.OrderFeedbackListJson[idx].OrderFeedbackReplyList = orderFeedbackReplyList;
                            }

                        }

                    }

                    var feedbackjsonActual = {
                        OrderFeedbackId: 0,
                        OrderId: $scope.labelOrderId,
                        OrderProductId: $scope.FeedbackVariable.ItemName,
                        feedbackId: $scope.FeedbackVariable.Name,
                        ItemFeedbackName: $scope.FeedbackVariable.ItemFeedbackName,
                        Attachment: "",
                        FeedbackGuId: feedbackguid,
                        FeedbackName: feedbackType,
                        Feedback: feedback,
                        ProductName: item,
                        ParentOrderFeedbackReplyId: $rootScope.ParentOrderFeedbackReplyId,
                        Name: $rootScope.ActiveUserName,
                        Comment: $scope.FeedbackVariable.Comment,
                        ActualReceiveDate: $scope.FeedbackVariable.ReceiveDate,
                        HVBLComment: "",
                        Quantity: $scope.FeedbackVariable.ReturnQuantity,
                        CreatedBy: $rootScope.UserId,
                        DocumentsList: [],
                        CreatedDate: $scope.ddMMyyyy
                    }

                    var documentjsonActual = {
                        DocumentName: documentName,
                        DocumentExtension: documentExtension,
                        DocumentBase64: documentBase64,
                        ObjectType: "Feedback",
                        SequenceNo: 0,
                        CreatedBy: $rootScope.UserId,
                        IsActive: 1
                    }
                    feedbackjsonActual.DocumentsList.push(documentjsonActual);
                    $scope.OrderFeedbackListJsonActual.push(feedbackjsonActual);
                    
                    $scope.ClearFeedbackFields();
                    
                    $rootScope.IsRecordAddedToFeedback = true;
                    //$scope.ClearItemFeedback();
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
        debugger;
        if (parseInt(OrderFeedbackId) === 0) {
            if ($scope.OrderFeedbackListJson.length > 0) {
                $scope.OrderFeedbackListJson = $scope.OrderFeedbackListJson.filter(function (el) { return el.FeedbackGuId !== FeedbackGuId });
            }
            if ($scope.OrderFeedbackListJsonActual.length > 0) {
                $scope.OrderFeedbackListJsonActual = $scope.OrderFeedbackListJsonActual.filter(function (el) { return el.FeedbackGuId !== FeedbackGuId });
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
                if ($scope.OrderFeedbackListJsonActual.length > 0) {
                    $scope.OrderFeedbackListJsonActual = $scope.OrderFeedbackListJsonActual.filter(function (el) { return el.OrderFeedbackId !== OrderFeedbackId });
                }
                $rootScope.ValidationErrorAlert("Feedback deleted successfully.", 'success', 3000);
            });

        }


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


    $scope.FileSize = false;
    $scope.FileType = false;
    $scope.SaveFeedBack = function () {
        $rootScope.Throbber.Visible = true;
        $scope.IsSaveInProgress = true;
        if ($scope.OrderItemFeedback.length > 0) {
            
            var Product =
                {
                    ServicesAction: 'Savefeedback',
                    //OrderFeedbackList: $scope.OrderItemFeedback
                    OrderFeedbackList: $scope.OrderFeedbackListJsonActual
                }

            var jsonobject = {};
            jsonobject.Json = Product;

            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                $rootScope.Throbber.Visible = false;
                $scope.IsSaveInProgress = false;
                var resoponsedata = response.data;
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_SaveFeedback), 'success', 3000);
                $rootScope.ResetFeedbackFields();
                $rootScope.OpenAddFeedbackpopup();
            });
        } else {
            $rootScope.Throbber.Visible = false;
            $scope.IsSaveInProgress = false;
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_ViewInquiryForCustomer_AddFeedback), 'success', 3000);
        }

    }


    $scope.ClearFeedbackFields = function () {

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
        $scope.fileupload = {
            File: '',
            ItemFile: '',
        }

        $scope.FeedbackVariable.Name = $rootScope.feedbackId;
        $scope.GetValueByParentid($scope.FeedbackVariable.Name)
        $scope.FeedbackVariable.ItemFeedbackName = $rootScope.SubFeedbackId;

        var selectedProduct = $scope.bindallproduct.filter(function (el) { return el.ProductCode === $rootScope.FeedBackProductCode; });

                    if (selectedProduct.length > 0) {

                        $scope.FeedbackVariable.ItemName = selectedProduct[0].OrderProductId;
                        $scope.FeedbackVariable.Quantity = selectedProduct[0].ProductQuantity;
                        $scope.FeedbackVariable.UOM = selectedProduct[0].UOM;
                    }

    };

});