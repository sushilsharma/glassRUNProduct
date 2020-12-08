angular.module("glassRUNProduct").controller('DistributorDetailsController', function ($scope, $rootScope, $sessionStorage, $state, $ionicModal, $location, pluginsService, GrRequestService) {

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }
    $scope.emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;


    $scope.ContactInformationId = 0;

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.DistributorJson = {
        ContactType: "",
        ContactPerson: "",
        Contacts: ""
    }


    //$ionicModal.fromTemplateUrl('ViewContactInformation.html', {
    //    scope: $scope,
    //    animation: 'fade-in',
    //    backdropClickToClose: false,
    //    hardwareBackButtonClose: false
    //}).then(function (modal) {
    //    
    //    $scope.ViewContactInformationControl = modal;
    //});
    $scope.ShowContactInformationPopup = false;
    $scope.CloseViewContactInformationControl = function () {
        //$scope.ViewContactInformationControl.hide();
        $scope.ShowContactInformationPopup = false;
    };
    $scope.OpenViewContactInformationControl = function () {
        
        //$scope.ViewContactInformationControl.show();
        $scope.ShowContactInformationPopup = true;
    };


    $scope.DistributorDetailsGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) {


                        var SalesOrderNumber = "";
                        var SalesOrderNumberCriteria = "";

                        var EnquiryAutoNumber = "";
                        var EnquiryAutoNumberCriteria = "";

                        var PurchaseOrderNumber = "";
                        var PurchaseOrderNumberCriteria = "";


                        var CompanyNameValue = "";
                        var CompanyNameValueCriteria = "";


                        var ShipTo = "";
                        var ShipToCriteria = "";
                        var InquiryNumber = "";
                        var InquiryNumberCriteria = "";
                        var InquiryNumber = "";
                        var InquiryNumberCriteria = "";

                        var BranchPlant = "";
                        var BranchPlantCriteria = "";

                        var DeliveryLocation = "";
                        var DeliveryLocationCriteria = "";

                        var Status = "";
                        var StatusCriteria = "";

                        var RequestDate = "";
                        var RequestDateCriteria = "";

                        var Gratis = "";
                        var GratisCriteria = "";

                        var Description1 = "";
                        var Description1Criteria = "";

                        var Description2 = "";
                        var Description2Criteria = "";

                        var Province = "";
                        var ProvinceCriteria = "";

                        var OrderedBy = "";
                        var OrderedByCriteria = "";

                        var OrderType = "";
                        var TruckSize = "";
                        var TruckSizeCriteria = "";

                        var ProductCode = "";
                        var ProductCodeCriteria = "";

                        var ProductQuantity = "";
                        var ProductQuantityCriteria = "";

                        var AssociatedOrder = "";
                        var AssociatedOrderCriteria = "";

                        var UserName = "";
                        var UserNameCriteria = "";

                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };

                            

                            for (var i = 0; i < options.data.filter.filters.length; i++) {




                            }
                        }
                        var requestData =
                            {
                                ServicesAction: 'LoadDistributorDetails',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                UserId: $rootScope.CompanyId
                            };

                        //var stringfyjson = JSON.stringify(requestData);
                        var consolidateApiParamater =
                            {
                                Json: requestData,
                            };


                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            

                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;
                            if (resoponsedata != null) {
                                

                                if (resoponsedata.Json !== undefined) {

                                    if (resoponsedata.Json.ProfileList.length != undefined) {
                                        if (resoponsedata.Json.ProfileList.length > 0) {
                                            totalcount = resoponsedata.Json.ProfileList[0].TotalCount
                                        }

                                    } else {
                                        
                                        totalcount = resoponsedata.Json.ProfileList.TotalCount;
                                    }
                                    ListData = resoponsedata.Json.ProfileList;




                                } else {
                                    ListData = [];
                                    totalcount = 0;
                                }
                            }
                            var inquiryList = {
                                data: ListData,
                                totalRecords: totalcount
                            }
                            $scope.GridData = inquiryList;
                            options.success(inquiryList);
                            $scope.values = options;

                            $rootScope.Throbber.Visible = false;
                        });
                    }
                },
                pageSize: 50,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true
            },
            filterable:
            {
                mode: "row"
            },
            selectable: "row",
            pageable:
            {
                pageSizes: [10, 50, 100]
            },
            sortable: true,
            groupable: true,
            columnMenu: true,
            mobile: true,
            dataBound: gridDataBound,
            columns: [


                {
                    field: "UserName", template: '<a ng-click=\"LoadContactInformation(\#=ReferenceId#\)\" class="graybgfont">#:UserName#</a>',
                    title: 'User Name', type: "string", filterable: { mode: "row", extra: false },
                    width: "120px"
                },

                { field: "Name", title: 'Name', type: "string", filterable: { mode: "row", extra: false }, "width": "200px" },
                { field: "EmailId", title: 'Email', type: "string", filterable: { mode: "row", extra: false }, "width": "200px" },
                { field: "ContactNumber", title: 'Contact Number', type: "string", filterable: { mode: "row", extra: false }, "width": "200px" },


            ],
        }



    function gridDataBound(e) {

        var grid = e.sender;
        if (grid.dataSource.total() == 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.DistributorDetailsGrid.dataSource.transport.read($scope.values);
        }
    };

    $scope.CheckContactInformationPresentList = [];
    $scope.LoadContactInformation = function (id) {
        
        $scope.ContactInformationList = [];

        var requestData =
            {
                ServicesAction: 'GetContactInformationDetailsByCompanyId',
                ObjectId: id,
                ObjectType: 'SoldTo'
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            if (response.data.Json != undefined) {
                var resoponsedata = response.data.Json.ContactInformatList;
                $scope.CheckContactInformationPresentList = resoponsedata
                if ($scope.CheckContactInformationPresentList.length > 0) {
                    $scope.ContactInformationList = resoponsedata;
                }
            }
            else {
                $scope.CheckContactInformationPresentList = [];
            }


            $scope.OpenViewContactInformationControl();
            $scope.CompanyId = id;

        });





    }


    $scope.ContactInformationList = [];
    $scope.AddNewContactInformation = function () {
        
        if ($scope.DistributorJson.ContactType !== "" && $scope.DistributorJson.ContactType !== 0 &&  $scope.DistributorJson.Contacts !== "") {
            var NewcontactInformationJson = {
                ContactInformationIdGUID: generateGUID(),
                ContactInformationId: 0,
                ContactType: $scope.DistributorJson.ContactType,
                ContactPerson: $scope.DistributorJson.ContactPerson,
                Contacts: $scope.DistributorJson.Contacts,
                ObjectId: $scope.CompanyId,
                ObjectType: 'SoldTo',
                CreatedBy: $rootScope.UserId,
                IsActive: true
            }
            if ($scope.ContactInformationList.length > 0) {
                var contactInformationList = $scope.ContactInformationList.filter(function (el) { return el.ContactType === $scope.DistributorJson.ContactType && el.ContactPerson === $scope.DistributorJson.ContactPerson && el.Contacts === $scope.DistributorJson.Contacts });
                if (contactInformationList.length > 0) {
                    $rootScope.ValidationErrorAlert('Record already exist.', 'error', 3000);
                } else {
                    $scope.ContactInformationList.push(NewcontactInformationJson);
                    $scope.ClearContactInformation();
                }
            } else {
                $scope.ContactInformationList.push(NewcontactInformationJson);
                $scope.ClearContactInformation();
            }
        } else {
            if (($scope.DistributorJson.ContactType === "" || $scope.DistributorJson.ContactType === 0)) {
                $rootScope.ValidationErrorAlert('Please select Contact Type.', 'error', 3000);
                //} else if ($scope.DistributorJson.ContactPerson === "") {
                //    $rootScope.ValidationErrorAlert('Please enter contact Person.', 'error', 3000);
            }
            else if ($scope.DistributorJson.Contacts === "") {
                $rootScope.ValidationErrorAlert('Please enter Contacts', 'error', 3000);
            }
        }

    }


    $scope.ClearContactInformation = function () {
        $scope.DistributorJson.ContactType = "";
        $scope.DistributorJson.ContactPerson = "";
        $scope.DistributorJson.Contacts = "";

    }



    $scope.RemoveNewContactInformation = function (contactInformationId, contactInformationGUId) {
        
        if (contactInformationId === 0) {
            $scope.ContactInformationList = $scope.ContactInformationList.filter(function (el) { return el.ContactInformationIdGUID !== contactInformationGUId; });
        } else {
            var contactInformationInfo = $scope.ContactInformationList.filter(function (el) { return el.ContactInformationId === contactInformationId; });
            if (contactInformationInfo.length > 0) {
                contactInformationInfo[0].IsActive = false;
            }
        }
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


    $scope.SaveContactInformation = function () {
        
        if ($scope.ContactInformationList.length > 0) {
            if ($scope.CheckContactInformationPresentList.length == 0) {
                var requestData =
                    {
                        ServicesAction: 'SaveContactInformation',
                        ContactInformationList: $scope.ContactInformationList
                    };



                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };
                
                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    
                    $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
                    $scope.CloseViewContactInformationControl();

                });
            }
            else {
                var requestData =
                    {
                        ServicesAction: 'UpdateContactInformation',
                        ContactInformationList: $scope.ContactInformationList
                    };



                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };
                
                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    
                    $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
                    $scope.CloseViewContactInformationControl();
                });
            }
        }
        else {
            $rootScope.ValidationErrorAlert('Please add contact information', '', 3000);
            $scope.CloseViewContactInformationControl();
        }
    }
});