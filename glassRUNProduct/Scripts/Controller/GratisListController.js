angular.module("glassRUNProduct").controller('GratisListController', function ($scope, $q, $timeout, $rootScope, $document, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    debugger;

    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.IsGridLoadCompleted = false;
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
    var StatusList = $rootScope.StatusResourcesList.filter(function (el) { return el.CultureId === $rootScope.CultureId && el.PageName === 'O' });
    var page = $location.absUrl().split('#/')[1];

    // $scope.ViewControllerName = page;
var StatusList = $rootScope.StatusResourcesList.filter(function (el) { return el.CultureId === $rootScope.CultureId });
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

    $scope.LoadGridConfigurationData = function () {
        debugger;
        var objectId = 16;
        PageControlName = "Order";
        if (page === "PaymentRequest") {
            objectId = 17;

            PageControlName = "Order"
        } else if (page === "DriverAssignment") {
            objectId = 18;

            PageControlName = "Order";
        } else if (page === "ControlTower") {
            objectId = 223;

            PageControlName = "Order";
        } else if (page === "STOrderRecievedGrid") {
            objectId = 521;

            PageControlName = "Order";
        } else if (page === "OrderTruckInGrid") {
            objectId = 525;

            PageControlName = "Order";
        } else if (page === "GraticsOrderProcessed") {
            objectId = 524;

            PageControlName = "Order";
        } else if (page === "GratisList") {
            objectId = 864;

            PageControlName = "GratisList";
        }




        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                ObjectName: PageControlName,
                ObjectId: objectId,
                PageName: $rootScope.PageName,
                ControllerName: page
            };

        //var gridrequestData =
        //    {
        //        ServicesAction: 'LoadGridConfiguration',
        //        RoleId: $rootScope.RoleId,
        //        UserId: $rootScope.UserId,
        //        CultureId: $rootScope.CultureId,
        //        ObjectId: 16,
        //        PageName: 'Order List',
        //        ControllerName: 'OrderGrid'
        //    };

        //var stringfyjson = JSON.stringify(requestData);
        var gridconsolidateApiParamater =
            {
                Json: gridrequestData,
            };

        console.log("-2" + new Date());

        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
            debugger;
            $scope.GridColumnList = response.data.Json.GridColumnList;

            var ld = JSON.stringify(response.data);
            var ColumnlistinJson = JSON.parse(ld);


            $scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList;



			var checkedEnquiryData = $scope.DynamicColumnList.filter( function ( el ) { return el.dataField == 'CheckedEnquiry' } );

			if ( checkedEnquiryData.length > 0 ) {


				checkedEnquiryData[0].allowFiltering = false;
				checkedEnquiryData[0].allowSorting = false;
				checkedEnquiryData[0].allowEditing = false;


				checkedEnquiryData[0].cellTemplate = function ( container, options ) {
					$( "<div />" ).dxCheckBox( {
						value: JSON.parse( options.data.CheckedEnquiry ),
						//visible: options.data.CurrentState == '999' ? false : options.data.IsCompleted == '1' ? false : true,
						visible: options.data.IsEditPromiseDatePickUpDate,
						onValueChanged: function ( data ) {
							debugger;
							$scope.HeaderCheckboxControl = false;
							$scope.CellCheckboxControl = true;
						}
					} ).appendTo( container );
				};


				checkedEnquiryData[0].headerCellTemplate = function ( container, options ) {


					$( "<div />" ).dxCheckBox( {
						value: false,
						onValueChanged: function ( data ) {
							debugger;
							$scope.HeaderCheckBoxAction = data.value;
							$scope.HeaderCheckboxControl = true;
							$scope.CellCheckboxControl = false;
						}
					} ).appendTo( container );
				};
			}
			debugger;
			var statusData = $scope.DynamicColumnList.filter( function ( el ) { return el.dataField == 'Status' } );

			if ( statusData.length > 0 ) {

				statusData[0].lookup = {
					dataSource: StatusList,
					displayExpr: "ResourceValue",
					valueExpr: "ResourceValue"
				};

			}



            $scope.LoadSalesAdminApprovalGrid();

        });
    }
    $scope.LoadGridConfigurationData();





    //#region Load Sales Admin Approval Grid
    $scope.LoadSalesAdminApprovalGrid = function () {

      
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


                var OrderNumber = "";
                var OrderNumberCriteria = "";
                var SoldToCode = "";
                var SoldToCodeCriteria = "";
                //Vinod Kumar Yadav on 25-09-2019
                var CompanyName = "";
                var CompanyNameCriteria = "";
                var ShipTo = "";
                var ShipToCriteria = "";
                var ShipToCode = "";
                var ShipToCodeCriteria = "";
                var OrderType = "";
                var OrderTypeCriteria = "";
                var GratisCode = "";
                var GratisCodeCriteria = "";
                var CreatedBy = "";
                var CreatedByCriteria = "";
                var DeliveryInstruction1 = "";
                var DeliveryInstruction1Criteria = "";
                var DeliveryInstruction2 = "";
                var DeliveryInstruction2Criteria = "";
                var AssociatedSO = "";
                var AssociatedSOCriteria = "";
                var ShortCompanyName = "";
                var ShortCompanyNameCriteria = "";
                var Province = "";
                var ProvinceCriteria = "";
                var OrderedBy = "";
                var OrderedByCriteria = "";
 var EnquiryDate = "";
                var EnquiryDateCriteria = "";
                var EnquiryEndDate = "";
                var EnquiryEndDateCriteria = "";
var BranchPlantCode = "";
                var BranchPlantCodeCriteria = "";
var Status = "";
                var StatusCriteria = "";
var ProductName = "";
                var ProductNameCriteria = "";
var ProductQuantity = "";
                var  ProductQuantityCriteria = "";
 var ProductCode = "";
                var ProductCodeCriteria = "";


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
							

						if (columnsList[0] === "EnquiryDate") {
                                if (EnquiryDate === "") {
                                    EnquiryDateCriteria = columnsList[1];
                                    EnquiryDate = columnsList[2];
                                    EnquiryDate = new Date(EnquiryDate);
                                    EnquiryDate = $filter('date')(EnquiryDate, "dd/MM/yyyy");
                                } else {
                                    EnquiryEndDateCriteria = columnsList[1];
                                    EnquiryEndDate = columnsList[2];
                                    EnquiryEndDate = new Date(EnquiryEndDate);
                                    EnquiryEndDate = $filter('date')(EnquiryEndDate, "dd/MM/yyyy");
                                }
                            }

                            if (columnsList[0] === "DeliveredDate") {
                                if (DeliveredDate === "") {
                                    if (fields.length > 1) {
                                        DeliveredCriteria = "=";
                                    } else {
                                        DeliveredCriteria = columnsList[1];
                                    }
                                    DeliveredDate = columnsList[2];
                                    DeliveredDate = new Date(DeliveredDate);
                                    DeliveredDate = $filter('date')(DeliveredDate, "dd/MM/yyyy HH:mm");
                                }
                            }

                            if (columnsList[0] === "OrderNumber") {
                                OrderNumberCriteria = columnsList[1];
                                OrderNumber = columnsList[2];
                            }

                            if (columnsList[0] === "SoldToCode") {
                                SoldToCodeCriteria = columnsList[1];
                                SoldToCode = columnsList[2];
                            }
                            //Vinod Kumar Yadav on 25-09-2019
                            if (columnsList[0] === "CompanyName") {
                                CompanyNameCriteria = columnsList[1];
                                CompanyName = columnsList[2];
                            }

                            if (columnsList[0] === "DeliveryLocationName") {
                                ShipToCriteria = columnsList[1];
                                ShipTo = columnsList[2];
                            }

                            if (columnsList[0] === "ShipToCode") {
                                ShipToCodeCriteria = columnsList[1];
                                ShipToCode = columnsList[2];
                            }

                            if (columnsList[0] === "OrderType") {
                                OrderTypeCriteria = columnsList[1];
                                OrderType = columnsList[2];
                            }


                            if (columnsList[0] === "GratisCode") {
                                GratisCodeCriteria = columnsList[1];
                                GratisCode = columnsList[2];
                            }

                            if (columnsList[0] === "CreatedBy") {
                                CreatedByCriteria = columnsList[1];
                                CreatedBy = columnsList[2];
                            }

                            if (columnsList[0] === "DeliveryInstruction1") {
                                DeliveryInstruction1Criteria = columnsList[1];
                                DeliveryInstruction1 = columnsList[2];
                            }

                            if (columnsList[0] === "DeliveryInstruction2") {
                                DeliveryInstruction2Criteria = columnsList[1];
                                DeliveryInstruction2 = columnsList[2];
                            }

                            if (columnsList[0] === "AssociatedSO") {
                                AssociatedSOCriteria = columnsList[1];
                                AssociatedSO = columnsList[2];
                            }

                            if (columnsList[0] === "ShortCompanyName") {
                                ShortCompanyNameCriteria = columnsList[1];
                                ShortCompanyName = columnsList[2];
                            }
                            // Vinod Kumar yadav 10-10-2019
                            if (columnsList[0] === "OrderedBy") {
                                OrderedByCriteria = columnsList[1];
                                OrderedBy = columnsList[2];
                            }

							  if (columnsList[0] === "Status") {
                                StatusCriteria = columnsList[1];
                                Status = columnsList[2];
                            }

							 if (columnsList[0] === "BranchPlantCode") {
                                BranchPlantCodeCriteria = columnsList[1];
                                BranchPlantCode = columnsList[2];
                            }
							
                            if (columnsList[0] === "Province") {
                                ProvinceCriteria = columnsList[1];
                                Province = columnsList[2];
                            }
							if (columnsList[0] === "ProductName") {
                                ProductNameCriteria = columnsList[1];
                                ProductName = columnsList[2];
                            }
							if (columnsList[0] === "ProductQuantity") {
                                ProductQuantityCriteria = columnsList[1];
                                ProductQuantity = columnsList[2];
                            }
if (columnsList[0] === "ProductCode") {
                                ProductCodeCriteria = columnsList[1];
                                ProductCode = columnsList[2];
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
                    } else if (loadOptions.sort[0].selector === "PromisedDateField") {
                        OrderBy = "PromisedDate";
                    } else if (loadOptions.sort[0].selector === "BranchPlant") {
                        OrderBy = "StockLocationId"
                    }
                    else {
                        OrderBy = loadOptions.sort[0].selector;
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                //Vinod Kumar Yadav on 25-09-2019
                var requestData =
                    {
                        ServicesAction: 'LoadGratisGrid',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: OrderBy,
                        OrderByCriteria: OrderByCriteria,
                        OrderNumber: OrderNumber,
                        OrderNumberCriteria: OrderNumberCriteria,
                        SoldToCode: SoldToCode,
                        SoldToCodeCriteria: SoldToCodeCriteria,
                        CompanyName: CompanyName,
                        CompanyNameCriteria: CompanyNameCriteria,
                        ShipTo: ShipTo,
                        ShipToCriteria: ShipToCriteria,
                        ShipToCode: ShipToCode,
                        ShipToCodeCriteria: ShipToCodeCriteria,
                        OrderType: OrderType,
                        OrderTypeCriteria: OrderTypeCriteria,
                        GratisCode: GratisCode,
                        GratisCodeCriteria: GratisCodeCriteria,
                        CreatedBy: CreatedBy,
                        CreatedByCriteria: CreatedByCriteria,
                        DeliveryInstruction1: DeliveryInstruction1,
                        DeliveryInstruction1Criteria: DeliveryInstruction1Criteria,
                        DeliveryInstruction2: DeliveryInstruction2,
                        DeliveryInstruction2Criteria: DeliveryInstruction2Criteria,
                        AssociatedSO: AssociatedSO,
                        AssociatedSOCriteria: AssociatedSOCriteria,
                        ShortCompanyName: ShortCompanyName,
                        ShortCompanyNameCriteria: ShortCompanyNameCriteria,
						EnquiryDate: EnquiryDate,
                        EnquiryDateCriteria: EnquiryDateCriteria,
                        EnquiryEndDate: EnquiryEndDate,
                        EnquiryEndDateCriteria: EnquiryEndDateCriteria,
						Status: Status,
                        StatusCriteria: StatusCriteria,

						BranchPlantCode: BranchPlantCode,
                        BranchPlantCodeCriteria: BranchPlantCodeCriteria,
ProductCode: ProductCode,
                        ProductCodeCriteria: ProductCodeCriteria,
                        Province: Province,
                        ProvinceCriteria: ProvinceCriteria,
ProductName: ProductName,
                        ProductNameCriteria: ProductNameCriteria,
ProductQuantity: ProductQuantity,
                        ProductQuantityCriteria: ProductQuantityCriteria,
                        OrderedBy: OrderedBy,
                        OrderedByCriteria: OrderedByCriteria,
                        CompanyId: $rootScope.CompanyId,
                        RoleId: $rootScope.RoleId,
                        RoleName: $rootScope.RoleName,
						CultureId: $rootScope.CultureId,
						IsExportToExcel: '0'
                    };

                            // Vinod Kumar yadav 10-10-2019
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
                console.log(e);
                $scope.IsColumnDetailView = false;
                if ($scope.CellCheckboxControl === true || $scope.HeaderCheckboxControl === true) {
                    $scope.IsColumnDetailView = true;

                    if ($scope.CellCheckboxControl === true) {
                        var data = $scope.SalesAdminApprovalList.filter(function (el) { return el.OrderId === e.data.OrderId; });
                        if (data.length > 0) {
                            data[0].CheckedEnquiry = !data[0].CheckedEnquiry;
                        }
                    }
                    else if ($scope.HeaderCheckboxControl === true) {
                        for (var i = 0; i < $scope.SalesAdminApprovalList.length; i++) {
                            $scope.SalesAdminApprovalList[i].CheckedEnquiry = $scope.HeaderCheckBoxAction;
                        }
                    }


                    $scope.HeaderCheckboxControl = false;
                    $scope.CellCheckboxControl = false;
                }
                debugger;
                if (e.rowType !== "filter" && e.rowType != "header" && e.rowType != "detail") {
                    var detailViewAvailable = $scope.GridColumnList.filter(function (el) { return el.PropertyName === e.column.dataField; });
                    if (detailViewAvailable.length > 0) {
                        if (detailViewAvailable[0].IsDetailsViewAvailable === "1") {
                            $scope.CurrentOpenMasterDetailsObject = e;
                            $scope.IsColumnDetailView = true;

                            if (e.column.caption === $rootScope.resData.res_GridColumn_SalesOrderNumber) {
                                //if (page === "ControlTower") {
                                //    $rootScope.SalesOrderNumber = e.data.SalesOrderNumber;
                                //    $scope.toggleConsole_sidebar();

                                //    if ($rootScope.GridConfigurationLoadedView === true) {
                                //        $rootScope.RefreshDataGridView();
                                //    } else {
                                //        $rootScope.LoadGridViewConfigurationData();
                                //    }
                                //}
                            }
                            else if (e.column.caption === $rootScope.resData.res_GridColumn_GratisOrderNumber) {
                                $scope.ProductInfoSection = true;
                                var expanded = e.component.isRowExpanded(e.data);
                                if (expanded) {
                                    e.component.collapseRow(e.data);
                                } else {
                                    if ($rootScope.PreviousExpandedRow !== "") {
                                        if (e.data !== $rootScope.PreviousExpandedRow) {
                                            e.component.collapseRow($rootScope.PreviousExpandedRow);
                                        }
                                    }
                                    $scope.LoadOrderProductByOrderId(e.data.orderid, e);

                                }
                            }
                        } else {
                            //$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_SalesAdminApprovalGrid_DetailView), 'error', 3000);
                        }
                    }
                } else {

                    $scope.IsColumnDetailView = true;
                }
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

            //loadPanel: {
            //    Type: Number,
            //    width: 200
            //},
            masterDetail: {
                scrolling:
                {
                    enabled: false,
                    visible: false
                },
                enabled: false,
                template: "EnquiryProductInfo"
            },
            columns: $scope.DynamicColumnList,
            onKeyDown: function (e) {
                var key = e.jQueryEvent.key;
                if (key === "ArrowRight" || key === "ArrowLeft" || key === "ArrowUp" || key === "ArrowDown")
                    e.jQueryEvent.preventDefault();
            }
        };
    }



    $scope.RefreshDataGrid = function () {

        $scope.IsGridLoadCompleted = false;
        $scope.SalesAdminApprovalList = [];

        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#GratisListGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }

    $scope.ExportToExcelSalesAdminApprovalData = function () {

        if ($scope.GridColumnList.length > 0) {
            $rootScope.Throbber.Visible = true;
            $scope.RequestDataFilter.ServicesAction = "ExportToExcelGratisGrid";
            $scope.RequestDataFilter.ColumnList = $scope.GridColumnList.filter(function (el) { return el.IsExportAvailable === '1' && el.PropertyName !== 'CheckedEnquiry'; });

            var jsonobject = {};
            jsonobject.Json = $scope.RequestDataFilter;
            jsonobject.Json.IsExportToExcel = '1';

            GrRequestService.ProcessRequestForServiceBuffer(jsonobject).then(function (response) {

                var byteCharacters1 = response.data;
                if (response.data !== undefined) {
                    var byteCharacters = response.data;
                    var blob = new Blob([byteCharacters], {
                        type: "application/Pdf"
                    });

                    if (blob.size > 0) {
                        var filName = "GratisList_" + getDate() + ".csv";
                        saveAs(blob, filName);
                        $rootScope.Throbber.Visible = false;
                    } else {
                        $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                        $rootScope.Throbber.Visible = false;
                    }
                }
                else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                    $rootScope.Throbber.Visible = false;
                }
            });
        }
    }


    $scope.LoadOrderProductByOrderId = function (Id, e) {

        var requestData =
            {
                ServicesAction: 'LoadGratisOrderProductByOrderId',
                OrderId: Id,
                RoleId: $rootScope.RoleId,
                CultureId: $rootScope.CultureId
            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            if (response.data.Json !== undefined) {
                $scope.OrderProductList = response.data.Json.OrderProductsList;
            }
            else {
                $scope.OrderProductList = [];
            }


        });

        var outerContainerWidth = document.getElementById("GratisListGrid").clientWidth;
        outerContainerWidth = outerContainerWidth - 10;
        e.component.expandRow(e.data);
        $rootScope.PreviousExpandedRow = e.data;
        $scope.CurrentExpandedRow = e;
        $rootScope.Throbber.Visible = false;

        var elements = document.getElementsByClassName("EnquiryProductInfoClass");
        var elementId = "";
        for (var i = 0; i < elements.length; i++) {
            elementId = elements[i].id;
            elements[i].setAttribute("style", "width: " + outerContainerWidth + "px");
        }
    };

    $scope.CloseEnquiryDetailAccordion = function () {

        if ($scope.CurrentOpenMasterDetailsObject !== "") {
            $scope.CurrentOpenMasterDetailsObject.component.collapseRow($rootScope.PreviousExpandedRow);
            $scope.ClearItemData();
        }
    }

    $scope.ClearItemData = function () {

        $scope.OrderProductList = [];
    }


});