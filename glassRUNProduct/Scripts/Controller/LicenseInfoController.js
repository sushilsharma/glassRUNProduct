angular.module("glassRUNProduct").controller('LicenseInfoController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    // #region Session
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    // #endregion

    // #region Property
    $scope.LicenseInfoList = [];
    $scope.LicenseId = 0;

    $scope.LicenseJSON = {
        LicenseId: 0,
        CustomerCode: '',
        ProductCode: '',
        Type: '',
        DivConcurrent: 0,
        DivIndividual: 0,
        ActivationCode: ''
    }
    // #endregion

    $scope.arrlist = [{
        "id": 1,

        "name": "Concurrent"
    }, {
        "id": 2,

        "name": "Individual"
    }];

    $scope.checkoptions = function (choice) {
        $scope.LicenseJSON.ActivationCode = ''

        if (choice === "1") {
            $scope.LicenseJSON.DivConcurrent = true;
            $scope.LicenseJSON.DivIndividual = false;
        } else {
            $scope.LicenseJSON.DivIndividual = true;
            $scope.LicenseJSON.DivConcurrent = false;
        }
    };

    //#region Load Payment Plan Grid
    $scope.LoadPaymentPlanGrid = function () {
        

        console.log("1" + new Date());

        var LicenseInfoData = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var parameters = {};
                if (loadOptions.sort) {
                    parameters.orderby = loadOptions.sort[0].selector;
                    if (loadOptions.sort[0].desc)
                        parameters.orderby += " desc";
                }

                parameters.skip = loadOptions.skip || 0;
                parameters.take = loadOptions.take || 100;

                var filterOptions = loadOptions.filter ? loadOptions.filter.join(",") : "";
                var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";

                var ProductCode = "";
                var ProductCodeCriteria = "";

                var CustomerCode = "";
                var CustomerCodeCriteria = "";

                var FromDate = "";
                var FromDateCriteria = "";

                var ToDate = "";
                var ToDateCriteria = "";

                var ActivationCode = "";
                var ActivationCodeCriteria = "";

                var UserTypeCode = "";
                var UserTypeCodeCriteria = "";

                var NoOfUsers = "";
                var NoOfUsersCriteria = "";

                var LicenseType = "";
                var LicenseTypeCriteria = "";

                var IPAddress = "";
                var IPAddressCriteria = "";

                
                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "ProductCode") {
                            ProductCodeCriteria = columnsList[1];
                            ProductCode = columnsList[2];
                        }

                        if (columnsList[0] === "CustomerCode") {
                            CustomerCodeCriteria = columnsList[1];
                            CustomerCode = columnsList[2];
                        }

                        if (columnsList[0] === "FromDate") {
                            FromDateCriteria = columnsList[1];
                            FromDate = columnsList[2];
                        }

                        if (columnsList[0] === "ToDate") {
                            ToDateCriteria = columnsList[1];
                            ToDate = columnsList[2];
                        }

                        if (columnsList[0] === "ActivationCode") {
                            ActivationCodeCriteria = columnsList[1];
                            ActivationCode = columnsList[2];
                        }

                        if (columnsList[0] === "UserTypeCode") {
                            UserTypeCodeCodeCriteria = columnsList[1];
                            UserTypeCode = columnsList[2];
                        }

                        if (columnsList[0] === "NoOfUsers") {
                            NoOfUsersCriteria = columnsList[1];
                            NoOfUsers = columnsList[2];
                        }

                        if (columnsList[0] === "LicenseType") {
                            LicenseTypeCriteria = columnsList[1];
                            LicenseType = columnsList[2];
                        }

                        if (columnsList[0] === "IPAddress") {
                            IPAddressCriteria = columnsList[1];
                            IPAddress = columnsList[2];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                
                var requestData =
                    {
                        ServicesAction: 'LoadLicenseInfoPagingList',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: "",//OrderBy,
                        OrderByCriteria: "",//OrderByCriteria,

                        ProductCode: ProductCode,
                        ProductCodeCriteria: ProductCodeCriteria,

                        CustomerCode: CustomerCode,
                        CustomerCodeCriteria: CustomerCodeCriteria,

                        FromDate: FromDate,
                        FromDateCriteria: FromDateCriteria,

                        ToDate: ToDate,
                        ToDateCriteria: ToDateCriteria,

                        ActivationCode: ActivationCode,
                        ActivationCodeCriteria: ActivationCodeCriteria,

                        UserTypeCode: UserTypeCode,
                        UserTypeCodeCriteria: UserTypeCodeCriteria,

                        NoOfUsers: NoOfUsers,
                        NoOfUsersCriteria: NoOfUsersCriteria,

                        LicenseType: LicenseType,
                        LicenseTypeCriteria: LicenseTypeCriteria,

                        IPAddress: IPAddress,
                        IPAddressCriteria: IPAddressCriteria,
                    };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                    {
                        Json: requestData
                    };

                console.log("2" + new Date());
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    
                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {
                        
                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.LicenseInfoList.length !== undefined) {
                                if (resoponsedata.Json.LicenseInfoList.length > 0) {
                                    totalcount = resoponsedata.Json.LicenseInfoList[0].TotalCount;
                                }
                            } else {
                                totalcount = resoponsedata.Json.LicenseInfoList.TotalCount;
                            }

                            ListData = resoponsedata.Json.LicenseInfoList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.LicenseInfoList = $scope.LicenseInfoList.concat(data);
                    console.log("3" + new Date());
                    return data;
                });
            }
        });

        $scope.LicenseInfoGrid = {
            dataSource: {
                store: LicenseInfoData
            },
            bindingOptions: {
            },
            showBorders: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            loadPanel: {
                enabled: false,
                Type: Number,
                width: 200
            },
            scrolling: {
                mode: "infinite",
                showScrollbar: "always", // or "onClick" | "always" | "never"
                scrollByThumb: true
            },
            showColumnLines: true,
            showRowLines: true,

            columnChooser: {
                enabled: true,
                mode: "select"
            },
            columnFixing: {
                enabled: true
            },
            groupPanel: {
                visible: true
            },
            keyExpr: "LicenseId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {
                
                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.LicenseId);
                    }
                    else if (e.column.cellTemplate === "Delete") {
                        $scope.Delete(data.LicenseId);
                    }
                }
            },
            //onRowClick: function (e) {
            //    if ($scope.IsColumnDetailView === false) {
            //        $state.go("TrackerPage");
            //    }
            //},

            columnsAutoWidth: true,
            rowAlternationEnabled: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            headerFilter: {
                visible: false,
                allowSearch: false
            },
            remoteOperations: {
                sorting: true,
                filtering: true,
                paging: true
            },
            paging: {
                pageSize: 20
            },

            //loadPanel: {
            //    Type: Number,
            //    width: 200
            //},

            columns: [
                {
                    dataField: "ProductCode",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left"
                    //width: 150
                },
                {
                    dataField: "CustomerCode",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left"
                    //width: 150
                },
                {
                    dataField: "FromDate",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left"
                    //width: 150
                },
                {
                    dataField: "ToDate",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left"
                    //width: 150
                },
                {
                    dataField: "ActivationCode",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left"
                    //width: 150
                },
                {
                    dataField: "UserTypeCode",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left"
                    //width: 150
                },
                {
                    dataField: "NoOfUsers",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left"
                    //width: 150
                },
                {
                    dataField: "LicenseType",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left"
                    //width: 150
                },
                {
                    dataField: "IPAddress",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left"
                    //width: 150
                },
                {
                    caption: "Edit",
                    dataField: "LicenseId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Edit",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 200
                },
                {
                    caption: "Delete",
                    dataField: "LicenseId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Delete",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 200
                }
            ]
        };
    }
    //#endregion

    $scope.LoadPaymentPlanGrid();

    //#region Refresh DataGrid
    $scope.RefreshDataGrid = function () {
        
        $scope.LicenseInfoList = [];
        var dataGrid = $("#LicenseInfoGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

    $scope.AddForm = function () {
        
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.ClearControls();
    }

    $scope.ViewForm = function () {
        
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        //$scope.RefreshDataGrid();
    }

    $scope.ViewForm();

    // #region CRUD

    $scope.Save = function () {
        
        if ($scope.LicenseJSON.CustomerCode !== null && $scope.LicenseJSON.ProductCode !== "" && $scope.LicenseJSON.Type !== ""
            && $scope.LicenseJSON.ActivationCode !== "") {
            var license = {
                LicenseId: $scope.LicenseId,
                CustomerCode: $scope.LicenseJSON.CustomerCode,
                ProductCode: $scope.LicenseJSON.ProductCode,
                ActivationCode: $scope.LicenseJSON.ActivationCode,
                Type: $scope.LicenseJSON.Type,
                IsActive: true,
                CreatedBy: $rootScope.UserId,
                UpdatedBy: $rootScope.UserId
            }

            var licenseList = [];
            licenseList.push(license);

            var requestData =
                {
                    ServicesAction: 'SaveLicenseInfo',
                    LicenseInfoList: licenseList,
                    IndividualLicenseUserList: $scope.IndividualLicenseUserList,
                };

            var consolidateApiParamater =
                {
                    Json: requestData
                };

            
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                if ($scope.LicenseId !== 0) {
                    $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
                }
                else {
                    $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
                }
                $scope.ClearControls();
                $scope.ViewForm();
                $scope.RefreshDataGrid();
            });
        }
        else {
            $rootScope.ValidationErrorAlert('All Fields are mandatory', '', 3000);
        }
    }

    $scope.Edit = function (id) {
        
        $scope.AddForm();
        var requestData =
            {
                ServicesAction: 'GetLicenseById',
                LicenseId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var responsedata = response.data.Json.LicenseInfoList;
            $scope.LicenseJSON.LicenseId = responsedata[0].LicenseId;
            $scope.LicenseJSON.CustomerCode = responsedata[0].CustomerCode;
            $scope.LicenseJSON.ProductCode = responsedata[0].ProductCode;
            $scope.LicenseJSON.Type = responsedata[0].Type;
            $scope.LicenseJSON.ActivationCode = responsedata[0].ActivationCode;
           
        });
    }

    $scope.Delete = function (id) {
        var requestData =
            {
                ServicesAction: 'DeleteLicenseById',
                LicenseId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.RefreshDataGrid();
        });
    }

    // #endregion

    $scope.ClearControls = function () {
        $scope.LicenseId = 0;
        $scope.LicenseJSON.CustomerCode = "";
        $scope.LicenseJSON.ProductCode = "";
        $scope.LicenseJSON.ActivationCode = "";
    }

    // #region Individual License

    function generateGUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    $scope.IndividualLicenseUserList = [];

    $scope.IndividualLicenseVariable = {
        IndividualLicenseUserId: 0,
        UserId: 0,
        ActivationCode: ""
    }

    $scope.LoadUserDetails = function () {
        
        var requestData =
            {
                ServicesAction: 'LoadUserDetails'
            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if (response.data !== undefined) {
                if (response.data.Json.UserList.length > 0) {
                    $scope.UserDetailList = response.data.Json.UserList;
                }
            }
            else {
                $scope.UserDetailList = [];
            }
        });
    }
    $scope.LoadUserDetails();


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
            
            if (response.data !== undefined) {
                $scope.PaymentRequestSlabList = response.data.Json.PaymentRequestSlabList;
                if ($scope.PaymentRequestSlabList.length > 0) {
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
            }
        });
    }

    $scope.ShowAdditionalTab = function () {
        
        $scope.showadditiontab = true;
    }

    $scope.AddAdditionalSlab = function () {
        

        //Add
        if ($scope.IndividualLicenseVariable.IndividualLicenseUserId === 0) {
            if ($scope.IndividualLicenseVariable.UserId !== 0 && $scope.IndividualLicenseVariable.UserId !== undefined) {
                var UserDetailList = $scope.UserDetailList.filter(function (el) { return el.LoginId === $scope.IndividualLicenseVariable.UserId; });
                var IndividualLicenseUser = {
                    IndividualLicenseUserId: generateGUID(),
                    UserName: UserDetailList[0].UserName,
                    LoginId: UserDetailList[0].LoginId,
                    ActivationCode: $scope.LicenseJSON.ActivationCode,
                    IsActive: 1,
                    IsAdded: true
                }

                $scope.IndividualLicenseUserList.push(IndividualLicenseUser);
                $scope.ClearIndividualLicenseUser();
            } else {
                $rootScope.ValidationErrorAlert('Please Select User.', '', 3000);
            }
        } else {
            
            var user = $scope.IndividualLicenseUserList.filter(function (el) { return el.IndividualLicenseUserId === $scope.IndividualLicenseVariable.IndividualLicenseUserId });
            $scope.IndividualLicenseUserList = $scope.IndividualLicenseUserList.filter(function (el) { return el.IndividualLicenseUserId !== $scope.IndividualLicenseVariable.IndividualLicenseUserId; });

            var UserDetailList = $scope.UserDetailList.filter(function (el) { return el.LoginId === $scope.IndividualLicenseVariable.UserId; });
            var IndividualLicenseUser = {
                IndividualLicenseUserId: generateGUID(),
                UserName: UserDetailList[0].UserName,
                LoginId: UserDetailList[0].LoginId,
                ActivationCode: $scope.LicenseJSON.ActivationCode,
                IsActive: 1,
                IsAdded: true
            }

            $scope.IndividualLicenseUserList.push(IndividualLicenseUser);
            $scope.ClearIndividualLicenseUser();

        }
    }

    $scope.CancelAdditionalSlab = function () {
        
        $scope.ClearIndividualLicenseUser();
    }

    $scope.EditUser = function (IndividualLicenseUserId) {
        
        var user = $scope.IndividualLicenseUserList.filter(function (el) { return el.IndividualLicenseUserId === IndividualLicenseUserId; });
        $scope.showadditiontab = true;
        $scope.IndividualLicenseVariable.IndividualLicenseUserId = user[0].IndividualLicenseUserId;
        $scope.IndividualLicenseVariable.UserId = user[0].LoginId;
        $scope.IndividualLicenseVariable.ActivationCode = user[0].ActivationCode;
    }

    $scope.DeleteUser = function (IndividualLicenseUserId) {
        
        $scope.IndividualLicenseUserList = $scope.IndividualLicenseUserList.filter(function (el) { return el.IndividualLicenseUserId !== IndividualLicenseUserId; });
    }
    

    $scope.ClearIndividualLicenseUser = function () {
        
        $scope.showadditiontab = false;
        $scope.IndividualLicenseVariable.IndividualLicenseUserId = 0;
        $scope.IndividualLicenseVariable.UserId = 0;
        $scope.IndividualLicenseVariable.ActivationCode = "";
    }

    // #endregion
});