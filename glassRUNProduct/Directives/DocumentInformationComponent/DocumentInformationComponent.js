angular.module("glassRUNProduct").directive('documentInformation', function (Logger) {
    return {
        restrict: 'E',
        scope: {
            documentInformationList: '=',
            resData: '=',
            documentTypeList: '='
        },
        templateUrl: 'Directives/DocumentInformationComponent/DocumentInformationView.html',
        controller: function ($scope, $rootScope, $ionicModal, GrRequestService) {

            $scope.selectedID = '';
            // alert($scope.documentTypeList.length);

            $scope.LoadDefaultSettingsValue = function () {
                debugger;
                $scope.DocumentTypeList = $scope.documentTypeList;

            }
            $scope.LoadDefaultSettingsValue();




            //$scope.DocumentInformationList = [];

            //$scope.DocumentInformationList = $scope.documentInformationList;

            //#region Contact list


            $scope.InitalizeDocumentInformation = function () {

                $scope.DocumentInformationObject = {
                    DocumentTypeId: 0,
                    DocumentName: '',
                    DocumentExtension: '',
                    DocumentBase64: '',
                    ObjectId: '',
                    ObjectType: '',
                    EditDocumentinfoGUID: '',
                    DocumentInformationText: '',
                    SelectFileFormat: '',
                    SelectFileSize: '',
                    FileFormat: ''
                }
            }

            $scope.InitalizeDocumentInformation();

            $rootScope.ClearDocumentInformation = function () {
                debugger;
                $scope.InitalizeDocumentInformation();
            }


            $rootScope.DocumentAction = "Clear";

            $rootScope.AddDocumentType = function () {
                debugger;
                $rootScope.DocumentAction = "Add";
            }

            $rootScope.ClearDocumentTypeButton = function () {
                debugger;
                $rootScope.DocumentAction = "Clear";
            }


            $scope.SetFileExtensionAndSize = function (documentTypeId) {
                debugger;
                var DocumentDetails = $scope.DocumentTypeList.filter(function (m) { return m.LookUpId === documentTypeId })
                if (DocumentDetails.length > 0) {
                    $scope.DocumentInformationObject.SelectFileFormat = DocumentDetails[0].Field9
                    $scope.DocumentInformationObject.SelectFileSize = DocumentDetails[0].Field10
                }

            }



            $scope.AddDocumentInfo = function () {
                debugger;
                if ($rootScope.DocumentAction === "Add") {
                    $scope.DocumentInformationObject.DocumentTypeId = $scope.DocumentInformationObject.DocumentInformationText;
                }
                var DocumentDetails = $scope.documentInformationList.filter(function (m) { return m.DocumentTypeId === $scope.DocumentInformationObject.DocumentTypeId })
                if ($scope.DocumentInformationObject.EditDocumentinfoGUID === '') {
                    if (DocumentDetails.length > 0) {
                        $rootScope.ValidationErrorAlert('this type Document Already Exist', '', 3000);
                        return;
                    }
                }

                var DocumentType = '';
                if ($rootScope.DocumentAction === "Add") {
                    DocumentType = $scope.DocumentInformationObject.DocumentTypeId;
                }
                var DocumentDetails = $scope.DocumentTypeList.filter(function (m) { return m.LookUpId === $scope.DocumentInformationObject.DocumentTypeId })
                if (DocumentDetails.length > 0) {
                    DocumentType = DocumentDetails[0].Name
                }


                if ($scope.DocumentInformationObject.DocumentTypeId != '' && $scope.DocumentInformationObject.DocumentName != '' && $scope.DocumentInformationObject.DocumentBase64 != '') {


                    if ($scope.DocumentInformationObject.EditDocumentinfoGUID !== '') {
                        var DocumentinfoChanage = $scope.documentInformationList.filter(function (m) { return m.DocumentinfoGUID === $scope.DocumentInformationObject.EditDocumentinfoGUID; });
                        if (DocumentinfoChanage.length > 0) {
                            DocumentinfoChanage[0].DocumentType = DocumentType;
                            DocumentinfoChanage[0].DocumentTypeId = $scope.DocumentInformationObject.DocumentTypeId;
                            DocumentinfoChanage[0].DocumentTypeAction = $rootScope.DocumentAction;
                            DocumentinfoChanage[0].DocumentName = $scope.DocumentInformationObject.DocumentName;
                            DocumentinfoChanage[0].DocumentExtension = $scope.DocumentInformationObject.DocumentName.split('.')[1];
                            DocumentinfoChanage[0].DocumentBase64 = $scope.DocumentInformationObject.DocumentBase64;
                            DocumentinfoChanage[0].IsActive = true;
                            DocumentinfoChanage[0].CreatedBy = $rootScope.UserId;
                        }
                        else {
                            var Documentinfo = {
                                DocumentinfoGUID: generateGUID(),
                                DocumentType: DocumentType,
                                DocumentTypeId: $scope.DocumentInformationObject.DocumentTypeId,
                                DocumentTypeAction: $rootScope.DocumentAction,
                                DocumentName: $scope.DocumentInformationObject.DocumentName,
                                DocumentExtension: $scope.DocumentInformationObject.DocumentName.split('.')[1],
                                DocumentBase64: $scope.DocumentInformationObject.DocumentBase64,
                                ObjectType: 'Login',
                                IsActive: true,
                                CreatedBy: $rootScope.UserId,
                            }
                            $scope.documentInformationList.push(Documentinfo);
                        }

                    } else {

                        var Documentinfo = {
                            DocumentinfoGUID: generateGUID(),
                            DocumentType: DocumentType,
                            DocumentTypeId: $scope.DocumentInformationObject.DocumentTypeId,
                            DocumentTypeAction: $rootScope.DocumentAction,
                            DocumentName: $scope.DocumentInformationObject.DocumentName,
                            DocumentExtension: $scope.DocumentInformationObject.DocumentName.split('.')[1],
                            DocumentBase64: $scope.DocumentInformationObject.DocumentBase64,
                            ObjectType: 'Login',
                            IsActive: true,
                            CreatedBy: $rootScope.UserId,
                        }
                        $scope.documentInformationList.push(Documentinfo);


                    }

                    angular.element("input[type='file']").val(null);
                    debugger;
                    $scope.InitalizeDocumentInformation();
                }
                else {
                    $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
                }


            }


            $scope.EditDocumentInfo = function (id) {

                $scope.InitalizeDocumentInformation();
                var DocumentinfoChanges = $scope.documentInformationList.filter(function (m) { return m.DocumentinfoGUID === id; });
                $scope.DocumentInformationObject.EditDocumentinfoGUID = id;
                $scope.DocumentInformationObject.DocumentTypeId = DocumentinfoChanges[0].DocumentTypeId
                $scope.DocumentInformationObject.DocumentName = DocumentinfoChanges[0].DocumentName
                $scope.DocumentInformationObject.DocumentBase64 = DocumentinfoChanges[0].DocumentBase64
                $scope.DocumentInformationObject.DocumentExtension = DocumentinfoChanges[0].DocumentExtension
            }


            $scope.DeleteDocumentInfo = function (id) {

                var DocumentInfo = $scope.documentInformationList.filter(function (m) { return m.DocumentinfoGUID !== id; });
                $scope.documentInformationList = DocumentInfo;
                $scope.reset();
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

            //#endregion



            $ionicModal.fromTemplateUrl('ViewDocumentImage.html', {
                scope: $scope,
                animation: 'fade-in',
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function (modal) {

                $scope.ViewDocumentImageControl = modal;


            });

            $scope.reset = function () {
                $scope.DocumentInformationObject.DocumentTypeId = '';
                $scope.DocumentInformationObject.DocumentName = '';
                $scope.DocumentInformationObject.DocumentExtension = '';
                $scope.DocumentInformationObject.DocumentBase64 = '';
                $scope.DocumentInformationObject.EditDocumentinfoGUID = ''
            }

            $scope.CloseViewDocumentImage = function () {
                $scope.ViewDocumentImageControl.hide();
                $scope.ViewLogo = '';


            };


            $scope.OpenViewDocumentImage = function (DocumentBase64) {

                debugger;
                $scope.ViewDocumentImageControl.show();


                $scope.viewDocument = DocumentBase64;
                //$scope.ViewimgClick(CompanyId);
            };

            $ionicModal.fromTemplateUrl('WarningMessage.html', {
                scope: $scope,
                animation: 'fade-in',
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function (modal) {
                $scope.DeleteWarningMessageControl = modal;
            });

            $scope.OpenDeleteConfirmation = function () {

                $scope.DeleteWarningMessageControl.show();
            };
            $scope.CloseDeleteConfirmation = function () {
                $scope.DeleteWarningMessageControl.hide();
            };


            $scope.DeleteDocumentInfoObject = function (Id) {
                debugger;

                $scope.selectedID = Id;
                $scope.OpenDeleteConfirmation();
            }
            $scope.DeleteYes = function () {

                $rootScope.Throbber.Visible = true;
                $scope.DeleteDocumentInfo($scope.selectedID);
                $scope.selectedID = '';
                $scope.CloseDeleteConfirmation();
                $rootScope.Throbber.Visible = false;

            }


            $scope.DownloadDocument = function (documentId, documentType, documentName, DocumentFormat) {


                var orderRequestData =
                    {

                        ServicesAction: 'LoadObjectDocumentByObjectId',
                        ObjectId: documentId,
                        ObjectType: documentType

                    }
                var jsonobject = {};
                jsonobject.Json = orderRequestData;
                GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {

                    var byteCharacters1 = response.data;
                    if (response.data != undefined) {

                        var byteCharacters = response.data;
                        var filName = documentName;

                        var byteCharacters = response.data;

                        DocumentFormat = DocumentFormat.split('.')[1];

                        if (DocumentFormat === "PNG" || DocumentFormat === "png" || DocumentFormat === "JPG" || DocumentFormat === "jpg" || DocumentFormat === "JPEG" || DocumentFormat === "jpeg") {
                            var blob1 = new Blob([byteCharacters], {
                                type: "image/" + DocumentFormat
                            });

                            // var uuid = generateUUID();

                            saveAs(blob1, filName);
                        }
                        else if (DocumentFormat === "pdf" || DocumentFormat === "PDF") {
                            var blob2 = new Blob([byteCharacters], {
                                type: "application/" + DocumentFormat
                            });

                            // var uuid = generateUUID();

                            saveAs(blob2, filName);
                        }

                    } else {

                        $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_CreateInquiryForSLM_DocumentNotGenerated), '', 3000);
                    }



                });


            };



        }
    }
})


