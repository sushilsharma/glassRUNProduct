//angular.module("glassRUNProduct").controller('AGGridTestController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, GrRequestService) {
angular.module("glassRUNProduct").controller('AGGridTestController', function ($scope, $rootScope, $location, GrRequestService) {

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    $scope.ProductCodes = '';
    $rootScope.RoleId = 3;

    debugger;
    var columnDefs = [
        {
            headerName: '',
            editable: true,
            checkboxSelection: true,
            suppressFilter: true,
            width: 58,
            headerCheckboxSelection: true,
        },
        {
            headerName: 'S',
            field: 'IsAvailableStock',
            width: 100,
            cellRenderer: StockCellRendererFunc,
        },

        {
            headerName: "EnquiryAutoNumber", field: "EnquiryAutoNumber", filter: "agTextColumnFilter",
            cellRenderer: DropdownRendererFunc
        },

        { headerName: "EnquiryAutoNumber", field: "EnquiryAutoNumber", filter: "agTextColumnFilter" },
        {
            headerName: "RequestDate", field: "RequestDate",
            filter: "agDateColumnFilter",
            filterParams: {
                browserDatePicker: true
            }
        },
        {
            headerName: "EnquiryDate", field: "EnquiryDate", filter: "agDateColumnFilter", //valueFormatter: dateFormatter,
            // add extra parameters for the date filter
            filterParams: {

                // provide comparator function
                comparator: function (filterLocalDateAtMidnight, cellValue) {

                    // In the example application, dates are stored as dd/mm/yyyy
                    // We create a Date object for comparison against the filter date
                    var dateParts = cellValue.split("/");
                    var day = Number(dateParts[2]);
                    var month = Number(dateParts[1]) - 1;
                    var year = Number(dateParts[0]);
                    var cellDate = new Date(day, month, year);

                    // Now that both parameters are Date objects, we can compare
                    if (cellDate < filterLocalDateAtMidnight) {
                        return -1;
                    } else if (cellDate > filterLocalDateAtMidnight) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
        },
        { headerName: "SoldTo", field: "SoldTo", filter: "agTextColumnFilter" },
        //{ headerName: "EnquiryAutoNumberCriteria", field: "EnquiryAutoNumberCriteria", filter: "agTextColumnFilter" },
        { headerName: "ShipTo", field: "ShipTo", filter: "agTextColumnFilter" },
        //{ headerName: "CompanyNameValueCriteria", field: "CompanyNameValueCriteria", filter: "agTextColumnFilter" },
        { headerName: "EnquiryType", field: "EnquiryType", filter: "agTextColumnFilter" },
        //{ headerName: "SoldToCodeCriteria", field: "SoldToCodeCriteria", filter: "agTextColumnFilter" },

        //{ headerName: "BranchPlantCriteria", field: "BranchPlantCriteria", filter: "agTextColumnFilter" },
        { headerName: "StausName", field: "StausName", filter: "agNumberColumnFilter" },
        //{ headerName: "AreaCriteria", field: "AreaCriteria", filter: "agTextColumnFilter" },
        { headerName: "DeliveryLocationName", field: "DeliveryLocationName", filter: "agTextColumnFilter" },
        //{ headerName: "DeliveryLocationCriteria", field: "DeliveryLocationCriteria", filter: "agTextColumnFilter" },
        { headerName: "DeliveryLocationCode", field: "DeliveryLocationCode", filter: "agTextColumnFilter" },
        //{ headerName: "DeliveryLocationNameCriteria", field: "DeliveryLocationNameCriteria", filter: "agTextColumnFilter" },
        { headerName: "CompanyMnemonic", field: "CompanyMnemonic", filter: "agTextColumnFilter" },
        //{ headerName: "GratisCriteria", field: "GratisCriteria", filter: "agTextColumnFilter" },

        //{ headerName: "EnquiryDateCriteria", field: "EnquiryDateCriteria", filter: "agTextColumnFilter" },

        { headerName: "EnquiryGroupNumber", field: "EnquiryGroupNumber", filter: "agTextColumnFilter" },
        {
            headerName: "CurrentState",
            field: "CurrentState",
            filter: "agTextColumnFilter",
            cellRenderer: statusCellRendererFunc
        },
        //{ headerName: "StatusCriteria", field: "StatusCriteria", filter: "agTextColumnFilter" },
        { headerName: "CompanyName", field: "CompanyName", filter: "agTextColumnFilter" },

        {
            headerName: 'Action',
            field: 'EnquiryId',
            suppressFilter: true,
            width: 200,
            cellRenderer: ageCellRendererFunc,
        },


    ];

    //function dateFormatter(params) {
    //    return params.value.toString("dd/MM/yyyy");
    //}

    $scope.ageClicked = function (EnquiryId) {
        debugger;
        alert("EnquiryId clicked: " + EnquiryId);
    }



    function RowSelected(event) {
        debugger;
        event.data.selected = event.node.isSelected();
        if (event.node.isSelected()) {

            alert("selected");
        } else {

            alert("unselected");
        }

    }

    $scope.onCheckBoxClick = function (ev, item) {

        debugger;
        var data = $scope.GridData.data.filter(function (el) { return el.EnquiryId === item.EnquiryId; });
        if (data.length > 0) {
            data[0].selected = ev.target.checked;
        }

        //$rootScope.ObjectId = item.EnquiryId;
        //$rootScope.ObjectType = 'Enquiry';

        item.selected = ev.target.checked;

        var element = $(ev.currentTarget);
        var row = element.closest("tr");
        if (item.selected) {
            row.addClass("k-state-selected");
        } else {
            row.removeClass("k-state-selected");
        }
    }


    function StockCellRendererFunc(params) {

        var tmplvalue = '';
        if (params.value == '1') {
            tmplvalue = "<span class='greenbgfont'><i class='fa fa-check'></i></span>";
        }
        else {
            tmplvalue = "<span class='redbgfont'><i class='fa fa-times'></i></span>";
        }

        return tmplvalue;

    }


    $scope.EnquiryNumberList = [
        { "EnquiryId": 3761, "EnquiryNumber": "INQ002107" },
        { "EnquiryId": 3762, "EnquiryNumber": "INQ002108" },
        { "EnquiryId": 3763, "EnquiryNumber": "INQ002109" }
    ];

    function DropdownRendererFunc(params) {
        debugger;
        var rowIndex = params.rowIndex;
        var value = params.value;
        var eSelect = document.createElement("select");
        //Set attributes   
        eSelect.setAttribute('class', 'custom-select form-control');
        eSelect.setAttribute('style', 'padding:0px');
        eSelect.setAttribute('name', params.colDef.field);
        eSelect.setAttribute('id', params.colDef.field + "_" + rowIndex);
        eSelect.setAttribute("onchange", function () { alert("hi"); });

        //get the value of the select option  
        var value = params.value;
        //create the default option of the select element  
        var eOption = document.createElement("option");
        eOption.text = "Select";
        eOption.value = "";
        eSelect.appendChild(eOption);
        if (params.colDef.field == "EnquiryAutoNumber") {

            for (var i = 0; i < $scope.EnquiryNumberList.length; i++) {
                var eOptionVal = document.createElement("option");
                eOptionVal.text = $scope.EnquiryNumberList[i].EnquiryNumber;
                eOptionVal.value = $scope.EnquiryNumberList[i].EnquiryId;
                if ($scope.EnquiryNumberList[i].EnquiryNumber === value) {
                    eOptionVal.selected = true;
                }
                eSelect.appendChild(eOptionVal);
            }


        }



        //var eSelect = '<select class="form-control" ng-model="value"  ng-options="obj.EnquiryNumber as obj.EnquiryNumber for obj in EnquiryNumberList"><option value="">Select</option></select>';

        return eSelect;
    }

    function onChangeDropDown(e) {
        debugger;

    }

    function ageCellRendererFunc(params) {
        debugger;
        return '<a class=\"greenbgfont approvebtn\" style="cursor: pointer;" ng-click=\"ApproveEnquiryBySalesAdmin(' + params.value + ')\"> Approve </a>';
    }


    function statusCellRendererFunc(params) {
        debugger;

        //return '<a class=\"' + params.data.Class + '\">' + params.data.Status + '</a>';
        return '<a class=\"red\" style="color:red !important">' + params.data.CurrentState + '</a>';
    }



    $scope.gridOptions = {
        floatingFilter: true,
        debug: true,
        enableFilter: true,
        enableSorting: true,
        suppressContextMenu: true,
        suppressMenuMainPanel: true,
        suppressMenuColumnPanel: true,
        enableColResize: true,
        rowSelection: 'multiple',
        rowDeselection: true,
        columnDefs: columnDefs,
        rowModelType: 'infinite',
        paginationPageSize: 100,
        cacheOverflowSize: 2,
        maxConcurrentDatasourceRequests: 2,
        infiniteInitialRowCount: 1,
        maxBlocksInCache: 2,
        getRowNodeId: function (item) {
            return item.id;
        },
        components: {
            loadingCellRenderer: function (params) {
                if (params.value !== undefined) {
                    return params.value;
                } else {
                    return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/loading.gif">';
                }
            }
        }
    };

    function onPageSizeChanged(newPageSize) {
        var value = document.getElementById('page-size').value;
        alert(value);
        gridOptions.api.paginationSetPageSize(Number(value));
    }


    $scope.onBtExport = function () {
        debugger;
        var params = {
            //    //skipHeader: getBooleanValue('#skipHeader'),
            //    //columnGroups: getBooleanValue('#columnGroups'),
            //    //skipFooters: getBooleanValue('#skipFooters'),
            //    //skipGroups: getBooleanValue('#skipGroups'),
            //    //skipPinnedTop: getBooleanValue('#skipPinnedTop'),
            //    //skipPinnedBottom: getBooleanValue('#skipPinnedBottom'),
            //    //allColumns: getBooleanValue('#allColumns'),
            //    //onlySelected: getBooleanValue('#onlySelected'),
            fileName: "Test.xls"// document.querySelector('#fileName').value,
            //    sheetName: document.querySelector('#sheetName').value
        };



        debugger;
        $scope.gridOptions.api.exportDataAsExcel(params);
    }



    debugger;
    $scope.LoadEnquiryGridData = function () {

        var gridLoadedCheck = false;

        var requestData =
            {
                ServicesAction: 'AGGridFeaturesAndPerformance',
                PageIndex: 1,
                PageSize: 100,
                OrderBy: "",
                RoleMasterId: 3,
                LoginId: 20,
                UserId: 20,
                CultureId: 1101,

            };


        debugger;
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            var totalcount = null;
            var ListData = null;
            var resoponsedata = response.data;
            if (resoponsedata !== null) {
                if (resoponsedata.Json !== undefined) {
                    if (resoponsedata.Json.OrderList.length !== undefined) {
                        if (resoponsedata.Json.OrderList.length > 0) {
                            totalcount = resoponsedata.Json.OrderList[0].TotalCount;
                        }
                    } else {
                        totalcount = resoponsedata.Json.OrderList.TotalCount;
                    }
                    ListData = resoponsedata.Json.OrderList;
                } else {
                    ListData = [];
                    totalcount = 0;
                }
            }
            var inquiryList = {
                data: ListData,
                totalRecords: totalcount
            }


            var dataSource = {
                rowCount: null, // behave as infinite scroll
                getRows: function (params) {
                    debugger;
                    // console.log('asking for ' + params.startRow + ' to ' + params.endRow);
                    // At this point in your code, you would call the server, using $http if in AngularJS 1.x.
                    // To make the demo look real, wait for 500ms before returning
                    setTimeout(function () {
                        debugger;

                        if (gridLoadedCheck === true) {
                            var requestData =
                                {
                                    ServicesAction: 'AGGridFeaturesAndPerformance',
                                    PageIndex: params.endRow / 100,
                                    PageSize: 100,
                                    OrderBy: "",
                                    RoleMasterId: 3,
                                    LoginId: 20,
                                    UserId: 20,
                                    CultureId: 1101,

                                };


                            debugger;
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
                                        if (resoponsedata.Json.OrderList.length !== undefined) {
                                            if (resoponsedata.Json.OrderList.length > 0) {
                                                totalcount = resoponsedata.Json.OrderList[0].TotalCount;
                                            }
                                        } else {
                                            totalcount = resoponsedata.Json.OrderList.TotalCount;
                                        }
                                        ListData = resoponsedata.Json.OrderList;
                                    } else {
                                        ListData = [];
                                        totalcount = 0;
                                    }
                                }
                                var inquiryList = {
                                    data: ListData,
                                    totalRecords: totalcount
                                }

                                // if on or after the last page, work out the last row.
                                var lastRow = -1;
                                if (inquiryList.totalRecords <= params.endRow) {
                                    lastRow = inquiryList.totalRecords;
                                }
                                // call the success callback
                                params.successCallback(inquiryList.data, lastRow);

                            });


                        }
                        else {
                            // take a slice of the total rows
                            // var rowsThisPage = inquiryList.data.slice(params.startRow, params.endRow);


                            // if on or after the last page, work out the last row.
                            var lastRow = -1;
                            if (inquiryList.totalRecords <= params.endRow) {
                                lastRow = inquiryList.totalRecords;
                            }
                            // call the success callback
                            params.successCallback(inquiryList.data, lastRow);

                            gridLoadedCheck = true;
                        }

                    }, 500);
                }
            };

            $scope.gridOptions.api.setDatasource(dataSource);


            //$scope.gridOptions.api.setRowData(inquiryList.data);
            $rootScope.Throbber.Visible = false;
        });


        //var gridDiv = document.querySelector('#myGrid');
        //new agGrid.Grid(gridDiv, gridOptions);

        //agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json' }).then(function (data) {

        //});
    }

    $scope.LoadEnquiryGridData();




    $scope.ApproveEnquiryBySalesAdmin = function (enquiryId) {
        debugger;
        $rootScope.Throbber.Visible = true;
        var enquiryDetails = $scope.GridData.data.filter(function (el) { return parseInt(el.EnquiryId) === parseInt(enquiryId); });
        var gridDataArray = $('#InquiryDetailsGrid').data('kendoGrid')._data;
        var columnNameCarrier = 'carrier';
        for (var index = 0; index < gridDataArray.length; index++) {
            var columnValueCarrier = gridDataArray[index][columnNameCarrier];
            var enquiryRequestDate = enquiryDetails.filter(function (el) { return el.EnquiryId === gridDataArray[index]["EnquiryId"]; });
            if (enquiryRequestDate.length > 0) {
                enquiryRequestDate[0].CarrierNumber = columnValueCarrier;
                enquiryRequestDate[0].CreatedBy = $rootScope.UserId;
                enquiryRequestDate[0].CurrentState = 2000;
                enquiryRequestDate[0].CurrentProcess = 2;

                if (columnValueCarrier != null) {

                    var bindAllCarrier = "bindAllCarrier" + enquiryId;
                    var carrierdata = $scope[bindAllCarrier].filter(function (el) { return parseInt(el.CompanyId) === parseInt(columnValueCarrier); });

                    if (carrierdata.length != 0) {

                        enquiryRequestDate[0].CarrierCode = carrierdata[0].CompanyMnemonic;
                    }

                }
            }

        }

        if (enquiryDetails.length > 0) {

            var settingValue = 0;
            if ($sessionStorage.AllSettingMasterData != undefined) {
                var settingMaster = $sessionStorage.AllSettingMasterData.filter(function (el) { return el.SettingParameter === "DefaultLeadTime"; });
                if (settingMaster.length > 0) {
                    settingValue = settingMaster[0].SettingValue;
                }
            }


            var requestData =
                {
                    ServicesAction: 'UpdateEnquiryStatusWithWorkFlow',
                    EnquiryList: enquiryDetails,
                    UserName: $rootScope.UserName,
                    UserId: $rootScope.UserId,
                    DefaultLeadTime: settingValue

                };


            //  var stringfyjson = JSON.stringify(requestData);
            var consolidateApiParamater =
                {
                    Json: requestData,
                };
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {



                // Save Item Layer Validation Log.
                var requestDataforItemLayer =
                    {
                        UserId: $rootScope.UserId,
                        ObjectId: 0,
                        ObjectType: "Approve Enquiry From Grid",
                        ServicesAction: 'CreateLog',
                        LogDescription: 'Click On Approve Enquiry. Enquiry List JSON ' + JSON.stringify(enquiryDetails) + '.',
                        LogDate: GetCurrentdate(),
                        Source: 'Portal',
                    };
                var consolidateApiParamaterItemLayer =
                    {
                        Json: requestDataforItemLayer,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamaterItemLayer).then(function (responseLogItemLayerValidation) {

                });


                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_OMInquiryPage_ApprovedBySalesAdmin), '', 3000);
                $rootScope.Throbber.Visible = false;
                gridCallBack();
            });

        }

    }


    //------- jquery grid  ----------------------


    //var columnDefs = [
    //    // this row shows the row index, doesn't use any data from the row
    //    {
    //        headerName: "ID", width: 50,
    //        // it is important to have node.id here, so that when the id changes (which happens
    //        // when the row is loaded) then the cell is refreshed.
    //        valueGetter: 'node.id',
    //        cellRenderer: 'loadingRenderer'
    //    },
    //    { headerName: "Athlete", field: "athlete", width: 150 },
    //    { headerName: "Age", field: "age", width: 90 },
    //    { headerName: "Country", field: "country", width: 150, checkboxSelection: true },
    //    { headerName: "Year", field: "year", width: 90 },
    //    { headerName: "Date", field: "date", width: 110 },
    //    { headerName: "Sport", field: "sport", width: 110 },
    //    { headerName: "Gold", field: "gold", width: 100 },
    //    { headerName: "Silver", field: "silver", width: 100 },
    //    { headerName: "Bronze", field: "bronze", width: 100 },
    //    { headerName: "Total", field: "total", width: 100 }
    //];

    //var gridOptions = {
    //    components: {
    //        loadingRenderer: function (params) {
    //            if (params.value !== undefined) {
    //                return params.value;
    //            } else {
    //                return '<img src="../images/loading.gif">'
    //            }
    //        }
    //    },
    //    enableColResize: true,
    //    rowBuffer: 0,
    //    // debug: true,
    //    rowSelection: 'multiple',
    //    rowDeselection: true,
    //    isRowSelectable: function (rowNode) {
    //        return rowNode.data ? rowNode.data.country === 'United States' : false;
    //    },
    //    columnDefs: columnDefs,
    //    // tell grid we want virtual row model type
    //    rowModelType: 'infinite',
    //    // how big each page in our page cache will be, default is 100
    //    paginationPageSize: 100,
    //    // how many extra blank rows to display to the user at the end of the dataset,
    //    // which sets the vertical scroll and then allows the grid to request viewing more rows of data.
    //    // default is 1, ie show 1 row.
    //    cacheOverflowSize: 2,
    //    // how many server side requests to send at a time. if user is scrolling lots, then the requests
    //    // are throttled down
    //    maxConcurrentDatasourceRequests: 2,
    //    // how many rows to initially show in the grid. having 1 shows a blank row, so it looks like
    //    // the grid is loading from the users perspective (as we have a spinner in the first col)
    //    infiniteInitialRowCount: 1,
    //    // how many pages to store in cache. default is undefined, which allows an infinite sized cache,
    //    // pages are never purged. this should be set for large data to stop your browser from getting
    //    // full of data
    //    maxBlocksInCache: 2
    //};

    //// setup the grid after the page has finished loading
    //document.addEventListener('DOMContentLoaded', function () {

    //});


    angular.element(function () {

        debugger;
        //var gridDiv = document.querySelector('#myGrid');
        //new agGrid.Grid(gridDiv, gridOptions);

        //agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json' }).then(function (data) {
        //    var dataSource = {
        //        rowCount: null, // behave as infinite scroll
        //        getRows: function (params) {
        //            // console.log('asking for ' + params.startRow + ' to ' + params.endRow);
        //            // At this point in your code, you would call the server, using $http if in AngularJS 1.x.
        //            // To make the demo look real, wait for 500ms before returning
        //            setTimeout(function () {
        //                // take a slice of the total rows
        //                var rowsThisPage = data.slice(params.startRow, params.endRow);
        //                // if on or after the last page, work out the last row.
        //                var lastRow = -1;
        //                if (data.length <= params.endRow) {
        //                    lastRow = data.length;
        //                }
        //                // call the success callback
        //                params.successCallback(rowsThisPage, lastRow);
        //            }, 500);
        //        }
        //    };

        //    gridOptions.api.setDatasource(dataSource);
        //});
    });


});