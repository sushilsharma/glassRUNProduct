angular.module("glassRUNProduct").controller('ManageShipToController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, GrRequestService) {
    

    $rootScope.EnquiryRejected = false;
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    

    $scope.ManageShipToJson = {
        ContactType: "",
        ContactPerson: "",
        Contacts: ""
    }

    $ionicModal.fromTemplateUrl('ViewContactInformation.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.ViewContactInformationControl = modal;
    });
    $scope.CloseViewContactInformationControl = function () {
        $scope.ViewContactInformationControl.hide();
    };
    $scope.OpenViewContactInformationControl = function () {
        
        $scope.ViewContactInformationControl.show();
    };

    $scope.ManageShipToGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) {
                        
                        var CompanyName = "";
                        var CompanyNameCriteria = "";

                        var CompanyMnemonic = "";
                        var CompanyMnemonicCriteria = "";

                        var DeliveryLocationName = "";
                        var DeliveryLocationNameCriteria = "";

                        var DisplayName = "";
                        var DisplayNameCriteria = "";

                        var DeliveryLocationCode = "";
                        var DeliveryLocationCodeCriteria = "";


                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };
                            
                            for (var i = 0; i < options.data.filter.filters.length; i++) {

                                if (options.data.filter.filters[i].field === "CompanyName") {
                                    CompanyName = options.data.filter.filters[i].value;
                                    CompanyNameCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "CompanyMnemonic") {
                                    CompanyMnemonic = options.data.filter.filters[i].value;
                                    CompanyMnemonicCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "DeliveryLocationName") {
                                    DeliveryLocationName = options.data.filter.filters[i].value;
                                    DeliveryLocationNameCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "DisplayName") {
                                    DisplayName = options.data.filter.filters[i].value;
                                    DisplayNameCriteria = options.data.filter.filters[i].operator;
                                }

                                if (options.data.filter.filters[i].field === "DeliveryLocationCode") {
                                    DeliveryLocationCode = options.data.filter.filters[i].value;
                                    DeliveryLocationCodeCriteria = options.data.filter.filters[i].operator;
                                }

                            }

                        }
                        var requestData =
                            {
                                ServicesAction: 'ManageShipToList',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                CompanyName: CompanyName,
                                CompanyNameCriteria: CompanyNameCriteria,
                                CompanyMnemonic: CompanyMnemonic,
                                CompanyMnemonicCriteria: CompanyMnemonicCriteria,
                                DeliveryLocationName: DeliveryLocationName,
                                DeliveryLocationNameCriteria: DeliveryLocationNameCriteria,
                                DisplayName: DisplayName,
                                DisplayNameCriteria: DisplayNameCriteria,
                                DeliveryLocationCode: DeliveryLocationCode,
                                DeliveryLocationCodeCriteria: DeliveryLocationCodeCriteria
                            };


                        var consolidateApiParamater =
                            {
                                Json: requestData,
                            };


                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            
                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;
                            if (resoponsedata !== null) {
                                if (resoponsedata.Json !== undefined) {
                                    if (resoponsedata.Json.ShipToList.length !== undefined) {
                                        if (resoponsedata.Json.ShipToList.length > 0) {
                                            totalcount = resoponsedata.Json.ShipToList[0].TotalCount
                                        }

                                    } else {
                                        totalcount = resoponsedata.Json.ShipToList.TotalCount;
                                    }
                                    ListData = resoponsedata.Json.ShipToList;
                                    for (var i = 0; i < ListData.length; i++) {
                                        if (ListData[i].IsActive === "1") {
                                            ListData[i].IsActive = true;
                                        } else {
                                            ListData[i].IsActive = false;
                                        }
                                    }
                                } else {
                                    ListData = [];
                                    totalcount = 0;
                                }
                            }
                            var ShipToList = {
                                data: ListData,
                                totalRecords: totalcount
                            }
                            console.log("grid load");
                            $scope.GridData = ShipToList;
                            options.success(ShipToList);
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
            scrollable: true,
            columnMenu: true,
            mobile: true,
            dataBound: gridDataBound,
            columns: [
                { field: "CompanyName", title: $rootScope.resData.res_GridColumn_CompanyName, type: "string", filterable: { mode: "row", extra: false }, width: "150px" },
                { field: "CompanyMnemonic", title: $rootScope.resData.res_GridColumn_CompanyMnemonic, type: "string", filterable: { mode: "row", extra: false }, width: "150px" },
                //{ field: "DeliveryLocationCode", title: $rootScope.resData.res_GridColumn_DeliveryLocationCode, type: "string", filterable: { mode: "row", extra: false }, width: "150px" },

                {
                    field: "DeliveryLocationCode", template: '<a ng-click=\"LoadContactInformation(\#=DeliveryLocationId#\)\" class="graybgfont" style=\"text-decoration:underline;\">#:DeliveryLocationCode#</a>',
                    title: $rootScope.resData.res_GridColumn_DeliveryLocationCode, type: "string", filterable: { mode: "row", extra: false },
                    width: "120px"
                },

                { field: "DeliveryLocationName", title: "Ship To Name", type: "string", filterable: { mode: "row", extra: false }, width: "150px" },
                {
                    field: "EditShipToName",
                    template: "<div class=\"prepend-icon\"><input type=\"text\" style=\"padding-left: 8px !important;\" Id=\"{{dataItem.DeliveryLocationId}}\" ng-model='dataItem.DisplayName'  name=\"datepicker\" class=\"form-control\"  placeholder=\"Enter ShipTo Name...\"></div>",
                    "title": $rootScope.resData.res_GridColumn_EditShipToName,
                    width: "175px"
                },

                {
                    field: "ItemAction",
                    template: "<input type='checkbox' class='checkbox' ng-model=\"dataItem.IsActive\" ng-click='onCheckBoxClick($event, dataItem)' />",
                    title: $rootScope.resData.res_GridColumn_ItemAction,
                    width: "50px"
                },
            ],
        }

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.ManageShipToGrid.dataSource.transport.read($scope.values);
        }
    };

    $rootScope.GridRecallForStatus = function () {
        
        $rootScope.Throbber.Visible = true;
        ChangeGridHeaderTitleByLanguage($scope.ManageShipToGrid, "ManageShipToGrid", $rootScope.resData);
        gridCallBack();
    }

    function gridDataBound(e) {
        
        var grid = $("#ManageShipToGrid").data("kendoGrid");

        var grid = e.sender;

        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    }

    $scope.toggleSelectAll = function (ev) {
        
    }
    $scope.onCheckBoxClick = function (ev, item) {
        
        var data = $scope.GridData.data.filter(function (el) { return el.DeliveryLocationId === item.DeliveryLocationId; });
        if (data.length > 0) {
            data[0].IsActive = ev.target.checked;
        }

        item.IsActive = ev.target.checked;

        var element = $(ev.currentTarget);
        var row = element.closest("tr");
        if (item.selected) {
            row.addClass("k-state-selected");
        } else {
            row.removeClass("k-state-selected");
        }
    }


    $scope.UpdateShipToNameAndStatus = function () {
        

        var gridDataArray = $('#ManageShipToGrid').data('kendoGrid')._data;
        var columnName = 'DisplayName';
        for (var index = 0; index < gridDataArray.length; index++) {
            
            var columnValue = gridDataArray[index][columnName];
            var DeliveryLocationList = $scope.GridData.data.filter(function (el) { return el.DeliveryLocationId === gridDataArray[index]["DeliveryLocationId"]; });
            if (DeliveryLocationList.length > 0) {
                DeliveryLocationList[0].DisplayName = columnValue;
                DeliveryLocationList[0].UserId = $rootScope.UserId;
            }
        }


        $rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'UpdateShipToNameAndStatus',
                ShipToList: $scope.GridData.data
            };


        var consolidateApiParamater =
            {
                Json: requestData,
            };


        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            gridCallBack();
            $rootScope.Throbber.Visible = false;
            $rootScope.ValidationErrorAlert('Ship To Changes Updated Successfully.', 'error', 3000);

        });

    }



    $scope.LoadContactInformation = function (id) {
        
        $scope.ContactInformationList = [];

        var requestData =
            {
                ServicesAction: 'GetContactInformationDetailsByCompanyId',
                ObjectId: id,
                ObjectType: 'ShipTo'
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
        
        if ($scope.ManageShipToJson.ContactType !== "" && $scope.ManageShipToJson.ContactType !== 0 && $scope.ManageShipToJson.ContactPerson !== "" && $scope.ManageShipToJson.Contacts !== "") {
            var NewcontactInformationJson = {
                ContactInformationIdGUID: generateGUID(),
                ContactInformationId: 0,
                ContactType: $scope.ManageShipToJson.ContactType,
                ContactPerson: $scope.ManageShipToJson.ContactPerson,
                Contacts: $scope.ManageShipToJson.Contacts,
                ObjectId: $scope.CompanyId,
                ObjectType: 'ShipTo',
                CreatedBy: $rootScope.UserId,
                IsActive: true
            }
            if ($scope.ContactInformationList.length > 0) {
                var contactInformationList = $scope.ContactInformationList.filter(function (el) { return el.ContactType === $scope.ManageShipToJson.ContactType && el.ContactPerson === $scope.ManageShipToJson.ContactPerson && el.Contacts === $scope.ManageShipToJson.Contacts });
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
            if (($scope.ManageShipToJson.ContactType === "" || $scope.ManageShipToJson.ContactType === 0)) {
                $rootScope.ValidationErrorAlert('Please select Contact Type.', 'error', 3000);
            //} else if ($scope.ManageShipToJson.ContactPerson === "") {
              //  $rootScope.ValidationErrorAlert('Please enter contact Person.', 'error', 3000);
            } else if ($scope.ManageShipToJson.Contacts === "") {
                $rootScope.ValidationErrorAlert('Please enter Contacts', 'error', 3000);
            }
        }

    }


    $scope.ClearContactInformation = function () {
        $scope.ManageShipToJson.ContactType = "";
        $scope.ManageShipToJson.ContactPerson = "";
        $scope.ManageShipToJson.Contacts = "";

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