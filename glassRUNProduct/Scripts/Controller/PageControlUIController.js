angular.module("glassRUNProduct").controller('PageControlUIController', function ($scope, $q, $timeout, $rootScope, $document, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    debugger;

    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.IsGridLoadCompleted = false;
    $scope.IsShowEdit = true;
    var PageControlName = "";
    $scope.HeaderCheckboxControl = false;
    $rootScope.PreviousExpandedRow = "";
    $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = false;
        } else {
            $rootScope.Throbber = {
                Visible: false,
            }
        };
    }
    $scope.LoadThrobberForPage();
    console.log("-1" + new Date());
    var page = $location.absUrl().split('#/')[1];

    // $scope.ViewControllerName = page;

    $scope.toggleConsole_sidebar = function () {
        debugger;
        $scope.ShowReasonCode = false;
        $scope.BindingDataList = [];
        $rootScope.ReasonCodeList = [];
        $scope.view_tab = "";
        if ($('#Console_sidebar').hasClass('open')) {
            $('#Console_sidebar').removeClass('open');

            $rootScope.Throbber.Visible = false;
            $scope.RefreshDataGrid();
        }
        else {
            $('#Console_sidebar').addClass('open');
        }
    };

    $scope.JSONPageDetails = {
        PageId: 0,
    }
    //#region Load Sales Admin Approval Grid


    $scope.GetAllPages = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'GetAllPages'

            };


        var consolidateApiParamater =
            {
                Json: requestData,

            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            if (response.data.Json != undefined) {
                if (response.data.Json.PageList.length > 0) {

                    $scope.PageList = response.data.Json.PageList;
                    $rootScope.Throbber.Visible = false;
                }

            }
            else {
                $scope.PageList = [];
                $rootScope.Throbber.Visible = false;
            }


        });

    }
    $scope.GetAllPages();

    $scope.LoadSalesAdminApprovalGrid = function () {

        debugger;
        console.log("1" + new Date());

        var SalesAdminApprovalData = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var parameters = {};

                if (loadOptions.sort) {
                    parameters.orderby = loadOptions.sort[0].selector;
                    if (loadOptions.sort[0].desc)
                        parameters.orderby += " desc";
                }

                parameters.skip = loadOptions.skip || 0;
                parameters.take = loadOptions.take || 100;

                var filterOptions = "";
                if (loadOptions.dataField === undefined) {
                    filterOptions = loadOptions.filter ? loadOptions.filter.join(",") : "";
                } else {
                    if (loadOptions.filter !== undefined) {
                        var column = loadOptions.filter[0];
                        var data = loadOptions.dataField + "," + column[1] + "," + column[2];
                        filterOptions = data;
                    }
                }

                var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";


                var ControlName = "";
                var ControlNameCriteria = "";
                var ControlType = "";
                var ControlTypeCriteria = "";
                var ValidationExpression = "";
                var ValidationExpressionCriteria = "";
                var pageName = "";
                var pageNameCriteria = "";


                var fields = [];
                if (filterOptions != "") {
                    fields = filterOptions.split('and,');
                    if (fields.length === 1) {
                        if (fields[0].includes(">=") && !fields[0].includes("Status")) {
                            fields = filterOptions.split('or,');
                        }
                    }
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];

                        if (columnsList.includes("or") && fields[0].includes("Status")) {

                            var criteria = "in";
                            var columnValues = "";
                            var columnName = "";
                            columnsList = columnsList.split(',or,');
                            for (var i = 0; i < columnsList.length; i++) {
                                var splitColumnValue = columnsList[i].split(',');
                                columnValues = columnValues + "," + splitColumnValue[2];
                                columnName = splitColumnValue[0];
                            }
                            columnValues = columnValues.substr(1);

                            if (columnName === "Status") {
                                Status = columnValues;
                                StatusCriteria = criteria;
                            }

                        } else {


                            columnsList = columnsList.split(',');

                            if (columnsList[0] === "ControlType") {
                                ControlTypeCriteria = columnsList[1];
                                ControlType = columnsList[2];
                            }
                            if (columnsList[0] === "ControlName") {
                                ControlNameCriteria = columnsList[1];
                                ControlName = columnsList[2];
                            }
                            if (columnsList[0] === "pageName") {
                                pageNameCriteria = columnsList[1];
                                pageName = columnsList[2];
                            }

                            if (columnsList[0] === "ValidationExpression") {
                                ValidationExpressionCriteria = columnsList[1];
                                ValidationExpression = columnsList[2];
                            }

                        }


                    }
                }

                var OrderBy = "";
                var OrderByCriteria = "";
                if (loadOptions.sort !== null && loadOptions.sort !== undefined) {
                    if (loadOptions.sort[0].desc === true) {
                        OrderByCriteria = "desc";
                    } else {
                        OrderByCriteria = "asc";
                    }
                    if (loadOptions.sort[0].selector === "RequestDateField") {
                        OrderBy = "RequestDate";
                    }
                    else {
                        OrderBy = loadOptions.sort[0].selector;
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));
                debugger;
                //Vinod Kumar Yadav on 25-09-2019
                var requestData =
                    {
                        ServicesAction: 'GetAllPageControlData_Paging',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: OrderBy,
                        OrderByCriteria: OrderByCriteria,
                        pageName: pageName,
                        pageNameCriteria: pageNameCriteria,
                        ValidationExpression: ValidationExpression,
                        ValidationExpressionCriteriaCriteria: ValidationExpressionCriteria,
                        ControlName: ControlName,
                        ControlNameCriteria: ControlNameCriteria,
                        ControlType: ControlType,
                        ControlTypeCriteria: ControlTypeCriteria,
                        PageId: $scope.JSONPageDetails.PageId
                    };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                console.log("2" + new Date());
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    debugger;
                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {
                        $scope.IsShowEdit = true;
                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.GratisOrderList.length !== undefined) {
                                if (resoponsedata.Json.GratisOrderList.length > 0) {
                                    totalcount = resoponsedata.Json.GratisOrderList[0].TotalCount;
                                }
                            } else {
                                totalcount = resoponsedata.Json.GratisOrderList.TotalCount;
                            }

                            ListData = resoponsedata.Json.GratisOrderList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    } var inquiryList = {
                        data: ListData,
                        totalRecords: totalcount
                    }
                    $scope.IsGridLoadCompleted = false;
                    $rootScope.TotalOrderCount = totalcount;


                    var data = ListData;
                    $scope.SalesAdminApprovalList = data;
                    angular.forEach($scope.SalesAdminApprovalList, function (item) {

                        if (item.ValidationExpression === undefined || item.ValidationExpression === "" || item.ValidationExpression !==null) {
                            item.ValidationExpressionNEW = ValidationExpression;
                        }
                        item.ValidationExpressionForCheck = item.ValidationExpression;
                        item.IsMandatoryForCheck = item.IsMandatory;

                       
                        if (item.IsMandatory === '1') {
                            item.IsMandatory = true;
                        }
                        else {
                            item.IsMandatory = false;
                        }

                    });

                    debugger;
                    console.log("3" + new Date());
                    return { data: ListData, totalCount: parseInt(totalcount) };

                });
            }
        });
        
        debugger;
        $scope.OrderDataGrid = {
            dataSource: {
                store: SalesAdminApprovalData,
            },
            bindingOptions: {
            },
            showBorders: true,
            showColumnLines: true,
            showRowLines: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            loadPanel: {
                enabled: false
            },
            scrolling: {
                mode: "standard",
                showScrollbar: "always", // or "onClick" | "always" | "never"
                //scrollByThumb: false
            },

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
            keyExpr: "EnquiryAutoNumber",
            selection: {
                mode: "single"
            },
            onContentReady: function () {
                if ($scope.IsGridLoadCompleted === false) {
                    setTimeout(function () {
                        $("#GratisListGrid").dxDataGrid("instance").updateDimensions();
                        $scope.IsGridLoadCompleted = true;
                    }, 200);

                }

            },
            onCellClick: function (e) {

            },

            onRowClick: function (e) {
                //if ($scope.IsColumnDetailView === false) {
                //    $state.go("TrackerPage");
                //}
            },

            columnsAutoWidth: true,
            rowAlternationEnabled: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            headerFilter: {
                visible: true,
                allowSearch: true
            },
            remoteOperations: {
                sorting: true,
                filtering: true,
                paging: true
            },
            paging: {
                pageSize: 50
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 50, 100, 500],
                showInfo: true,
                showNavigationButtons: true,
                visible: true
            },
            masterDetail: {
                scrolling:
                {
                    enabled: false,
                    visible: false
                },
                enabled: false,
                template: "EnquiryProductInfo"
            },
            columns: [{                caption: $rootScope.resData.res_PageControl_PageName,                dataField: "pageName",                alignment: "left",            }, {                caption: $rootScope.resData.res_PageControl_ControlName,                dataField: "ControlName",                alignment: "left",            }, {                caption: $rootScope.resData.res_PageControl_ControlType,                dataField: "ControlType",                alignment: "left",            },            {                caption: $rootScope.resData.res_PageControl_IsActive,                dataField: "IsActive",                alignment: "left",            },            //{            //    caption: $rootScope.resData.res_PageControl_IsMandatory,            //    dataField: "IsMandatory",            //    alignment: "left",            //},            {
                caption: $rootScope.resData.res_PageControl_IsMandatory,                dataField: "IsMandatory",
                cellTemplate: "IsMandatoryTemplate",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 150
            },            {
                caption: $rootScope.resData.res_PageControl_ValidationExpression,                dataField: "ValidationExpression",
                cellTemplate: "ValidationExpressionTemplate",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 250
            },            {
                caption: "Edit",                dataField: "PageControlId",
                cssClass: "ClickkableCell EnquiryNumberUI",
                cellTemplate: "EditRow",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 250
            }            ],
            onKeyDown: function (e) {
                var key = e.jQueryEvent.key;
                if (key === "ArrowRight" || key === "ArrowLeft" || key === "ArrowUp" || key === "ArrowDown")
                    e.jQueryEvent.preventDefault();
            }
        };
    }



    $scope.OnSelectChange = function () {
        var dataGrid = $("#GratisListGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }

    $scope.LoadSalesAdminApprovalGrid();


    $scope.RefreshDataGrid = function () {

        $scope.IsGridLoadCompleted = false;
        $scope.SalesAdminApprovalList = [];

        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#GratisListGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }

    $scope.CloseEnquiryDetailAccordion = function () {

        if ($scope.CurrentOpenMasterDetailsObject !== "") {
            $scope.CurrentOpenMasterDetailsObject.component.collapseRow($rootScope.PreviousExpandedRow);
            $scope.ClearItemData();
        }
    }

    $scope.ClearItemData = function () {

        $scope.OrderProductList = [];
    }





    $scope.onValidationExpressionLinkClick = function (e, validationExpression) {
        $scope.IsShowEdit = false;
        validationExpression.showValidationExpressionTextbox = true;
        validationExpression.IsMandatoryCheckbox = true;
    };

    $scope.ClearValidationExpression = function (e, item) {
        $scope.IsShowEdit = true;
        item.showValidationExpressionTextbox = false;
        item.IsMandatoryCheckbox = false;

        if (item.ValidationExpressionForCheck == "" || item.ValidationExpressionForCheck == undefined || item.ValidationExpressionForCheck == null) {
            item.ValidationExpression = undefined;
        }
        if (item.IsMandatoryForCheck == "" || item.IsMandatoryForCheck == undefined || item.IsMandatoryForCheck == null) {
            item.IsMandatory = undefined;
        }

        if (item.ProposedShiftForCheck !== item.ValidationExpression) {
            item.ValidationExpression = item.ValidationExpressionForCheck;
        }
    };

//Changed by nimesh for resource on 22-10-2019
    $scope.SaveValidationExpression = function (e, item) {
        debugger;
        //UPDATE PICKSHIFT IN ORDER MOVEMENT
        if ((item.ValidationExpressionNEW != "" && item.ValidationExpressionNEW != undefined && item.ValidationExpressionNEW != null) || (item.IsMandatory != "" && item.IsMandatory != undefined && item.IsMandatory != null)) {

            if (item.ValidationExpression === undefined) {
                item.ValidationExpression = null;
            }
            if (item.IsMandatory === undefined) {
                item.IsMandatory = null;
            }
            var updatePickShift =
                {
                    ServicesAction: 'UpdatePageControlData',
                    PageControlId: item.PageControlId,
                    IsMandatory: item.IsMandatory,
                    ValidationExpression: item.ValidationExpressionNEW
                }

            var consolidateApiParamaterForShift =
                {
                    Json: updatePickShift,
                };

            GrRequestService.ProcessRequest(consolidateApiParamaterForShift).then(function (response) {
                if (response.data != undefined) {
                    if (response.data.Json != undefined) {
                        $scope.IsShowEdit = true;
                        $rootScope.ValidationErrorAlert('Record updated successfully.', '', 3000);
                        $scope.RefreshDataGrid();
                    } else {
                        $rootScope.ValidationErrorAlert($rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PageControl_ValidationForIsMandatoryValidationExpression), 'error', 3000);, '', 3000);
                    }
                } else {
                    $rootScope.ValidationErrorAlert($rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PageControl_ValidationForIsMandatoryValidationExpression), 'error', 3000);, '', 3000);
                }

                item.showValidationExpressionTextbox = false;
                item.IsMandatoryCheckbox = false;
            });
        } else {
            if ((item.ValidationExpression != "" && item.ValidationExpression != undefined && item.IsMandatory != null)) {
                $rootScope.ValidationErrorAlert($rootScope.ValidationErrorAlert(String.format($rootScope.res_PageControl_SelectIsMandatory), 'error', 3000);, '', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert($rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PageControl_EnterValidationExpression), 'error', 3000);, '', 3000);
            }

        }
    };
});