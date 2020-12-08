
angular.module("glassRUNProduct").controller('DataGridTestController', function ($scope, $http, $rootScope, $location, GrRequestService) {
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = false;
    } else {
        $rootScope.Throbber = {
            Visible: false,
        }
    }
    
    $scope.loadProductDetails = false;
    $scope.loadgridInfo = false;
    
    $scope.bindAllBranchPlant = [{
        CompanyID: "4",
        CreatedBy: "1",
        CreatedDate: "2017-12-03T21:15:47.877",
        DeliveryLocationCode: "64",
        DeliveryLocationId: "625",
        DeliveryLocationName: "CTTNHH BIA VA NUOC GIAI KHAT HEINEKEN VN",
        IsActive: "1"
    }, {
        CompanyID: "4",
        CreatedBy: "1",
        CreatedDate: "2017-12-03T21:15:47.877",
        DeliveryLocationCode: "6410",
        DeliveryLocationId: "626",
        DeliveryLocationName: "CTTNHH BIA VA NUOC GIAI KHAT HEINEKEN VN",
        IsActive: "1"
    }, {
        CompanyID: "4",
        CreatedBy: "1",
        CreatedDate: "2017-12-03T21:15:47.877",
        DeliveryLocationCode: "6410",
        DeliveryLocationId: "626",
        DeliveryLocationName: "CTTNHH BIA VA NUOC GIAI KHAT HEINEKEN VN",
        IsActive: "1"
    }, {
        CompanyID: "4",
        CreatedBy: "1",
        CreatedDate: "2017-12-03T21:15:47.877",
        DeliveryLocationCode: "1111026",
        DeliveryLocationId: "647",
        DeliveryLocationName: "HM-CTY TNHH SX DV TM XNK MINH QUANG",
        IsActive: "1"
    }];
    $scope.showColumnLines = true;
    $scope.showRowLines = true;
    $scope.showBorders = true;
    $scope.rowAlternationEnabled = true;
    $scope.filterRow = {
        visible: true,
        applyFilter: "auto"
    };

    $scope.headerFilter = {
        visible: true,
        allowSearch: true
    };

    var orders = new DevExpress.data.CustomStore({
        load: function (loadOptions) {

            console.log("1 " + new Date());

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

            console.log("2 " + new Date());

           
            var index = parameters.skip / parameters.take;
            var requestData =
                {
                    ServicesAction: 'AGGridFeaturesAndPerformance',
                    PageIndex: index + 1,
                    PageSize: parameters.take,
                    OrderBy: "",
                    RoleMasterId: 3,
                    LoginId: 20,
                    UserId: 20,
                    CultureId: 1101,

                };


            
            var consolidateApiParamater =
                {
                    Json: requestData,
                };
            return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                var resoponsedata = response.data;
                return { data: resoponsedata.Json.OrderList, totalCount: parseInt(resoponsedata.Json.OrderList[0].TotalCount) };

            });

        }
    });
    console.log("4 " + new Date());
    $scope.dataGridOptions = {
        dataSource: {
            store: orders
        },
        bindingOptions: {
            showColumnLines: "showColumnLines",
            showRowLines: "showRowLines",
            showBorders: "showBorders",
            rowAlternationEnabled: "rowAlternationEnabled",
            filterRow: "filterRow",
            headerFilter: "headerFilter"
        },
        showBorders: true,
        remoteOperations: {
            sorting: true,
            filtering: true,
            paging: true
        },
        scrolling: {
            mode: "standard"
        },

        paging: {
            pageSize: 100
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 50, 100, 500],
            showInfo: true,
            showNavigationButtons: true,
            visible: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showBorders: true,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true
        },
        "export": {
            enabled: true,
            fileName: "Employees",
            allowExportSelectedData: true
        },
        groupPanel: {
            visible: true
        },
        keyExpr: "EnquiryAutoNumber",
        selection: {
            mode: "single"
        },
        onSelectionChanged: function (e) {
            //alert(e.selectedRowKeys[0].EnquiryAutoNumber);
            

        },
        onContentReady: function (e) {
            
            //e.element.find(".dx-context-menu").dxContextMenu("instance").option("showEvent", "dxclick");
            //if (!e.component.getSelectedRowKeys().length)
            //    e.component.selectRowsByIndexes(0);
            //e.component.columnOption("EnquiryAutoNumber", "visible", false);
            //e.component.columnOption("ShipTo", "visible", false);
        },

        onCellClick: function (e) {
            

            //e.column.caption
            if (e.rowType !== "filter" && e.columnIndex !== 1 && e.columnIndex !== 3 && e.columnIndex !== 4 && e.columnIndex !== 11) {
                var expanded = e.component.isRowExpanded(e.data);
                if (expanded) {
                    e.component.collapseRow(e.data);
                }
                else {
                    if (e.columnIndex === 0) {
                        $scope.loadProductDetails = false;
                        $scope.loadgridInfo = true;
                        e.component.expandRow(e.data);
                    } else {

                        $rootScope.Throbber.Visible = true;
                        $scope.loadProductDetails = true;
                        $scope.loadgridInfo = false;
                        $scope.ProductListView(e.data.EnquiryId, e);
                    }

                }
            }

            //e.component.collapseAll(-1);
            //e.component.expandRow(e.data);
        },
        columnsAutoWidth: true,
        onRowClick: function (e) {
            

        },

        loadPanel: {
            Type: Number,
            width: 200
        },
        masterDetail: {
            enabled: false,
            template: "detail"
        },
        columns: [
            {
                dataField: "EnquiryAutoNumber",
                width: 140,
                caption: "Enquiry Number",
                fixed: true,
            },
            {
                dataField: "EnquiryAutoNumber",
                width: 100,
                allowFiltering: false,
                allowSorting: false,
                cellTemplate: "cellTemplate",
                fixed: true,
            },
            {
                caption: "RequestDate",
                allowFiltering: true,
                filterRow: {
                    visible: true,
                    applyFilter: "auto"
                },
                filterOperations: ['contains', 'startswith', '='],
                headerFilter: {
                    visible: true,
                    allowSearch: true
                },
                width: 180,
                cellTemplate: function (container, options) {
                    
                    $("<div />").dxDateBox({
                        type: "date",
                        pickerType: "calendar",
                        value: new Date(2017, 0, 3),
                        displayFormat: "dd/MM/yyyy",
                        onValueChanged: function (data) {
                            

                        }
                    }).appendTo(container);
                },
                fixed: true,
            },
            {
                dataField: "EnquiryDate",
                width: 150,
                dataType: "date",
                format: "dd/MM/yyyy",

            }, {
                caption: "BranchPlant",
                allowFiltering: true,
                filterRow: {
                    visible: true,
                    applyFilter: "auto"
                },
                filterOperations: ['contains', 'startswith', '='],
                headerFilter: {
                    visible: true,
                    allowSearch: true
                },
                minWidth: 320,
                cellTemplate: function (container, options) {
                    

                    $("<div />").dxDropDownBox({
                        value: options.data.DeliveryLocationCode,
                        dataSource: $scope.bindAllBranchPlant,

                        contentTemplate: function (e) {
                            var $list = $("<div>").dxList({
                                dataSource: e.component.option("dataSource"),
                                selectionMode: "single",
                                itemTemplate: function (data, _, element) {
                                    element.append(
                                        $("<p>").text(data.DeliveryLocationCode).css("margin", 0)
                                    )
                                },
                                onSelectionChanged: function (args) {
                                    
                                    e.component.option("value", args.addedItems[0].DeliveryLocationCode);
                                    e.component.close();
                                }
                            });
                            return $list;
                        }
                    }).appendTo(container);
                }
            },
            {
                caption: "CheckBox",
                allowFiltering: true,
                filterRow: {
                    visible: true,
                    applyFilter: "auto"
                },
                filterOperations: ['contains', 'startswith', '='],
                headerFilter: {
                    visible: true,
                    allowSearch: true
                },
                minWidth: 320,
                cellTemplate: function (container, options) {
                    

                    $("<div />").dxCheckBox({
                        value: true,
                        onValueChanged: function (data) {
                            

                            //disabledCheckbox.option("value", data.value);
                        }
                    }).appendTo(container);
                }
            }
            , {
                caption: "CheckBox2",
                allowFiltering: true,
                filterRow: {
                    visible: true,
                    applyFilter: "auto"
                },
                filterOperations: ['contains', 'startswith', '='],
                headerFilter: {
                    visible: true,
                    allowSearch: true
                },
                minWidth: 320,
                cellTemplate: function (container, options) {
                    

                    $("<div />").dxCheckBox({
                        value: false,
                        onValueChanged: function (data) {
                            

                            //disabledCheckbox.option("value", data.value);
                        }
                    }).appendTo(container);
                }
            }
            ,
            "SoldTo", "ShipTo", "EnquiryType", "StausName", "DeliveryLocationName", "DeliveryLocationCode",
            "CompanyMnemonic", "EnquiryGroupNumber", "CurrentState", "CompanyName", "IsAvailableStock",
            , {
                caption: "Approve",
                minWidth: 320,
                cellTemplate: function (container, options) {
                    

                    $("<div />").dxButton({
                        text: "Approve",
                        onClick: function (e) {

                        }
                    }).appendTo(container);
                }
            },

        ],




    };
    console.log("4 " + new Date());
    //var employees = [{
    //    "ID": 1,
    //    "FirstName": "John",
    //    "LastName": "Heart",
    //    "Prefix": "Mr.",
    //    "Position": "CEO",
    //    "Picture": "images/employees/01.png",
    //    "BirthDate": "1964/03/16",
    //    "HireDate": "1995/01/15",
    //    "Notes": "John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003. When not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.",
    //    "Address": "351 S Hill St.",
    //    "State": "California",
    //    "City": "Los Angeles"
    //}, {
    //    "ID": 2,
    //    "FirstName": "Olivia",
    //    "LastName": "Peyton",
    //    "Prefix": "Mrs.",
    //    "Position": "Sales Assistant",
    //    "Picture": "images/employees/09.png",
    //    "BirthDate": "1981/06/03",
    //    "HireDate": "2012/05/14",
    //    "Notes": "Olivia loves to sell. She has been selling DevAV products since 2012.  Olivia was homecoming queen in high school. She is expecting her first child in 6 months. Good Luck Olivia.",
    //    "Address": "807 W Paseo Del Mar",
    //    "State": "California",
    //    "City": "Los Angeles"
    //}];
    //$scope.GridMasterDataOption = {

    //    dataSource: employees,
    //    columnAutoWidth: true,
    //    showBorders: true,
    //    columns: ['Subject', {
    //        dataField: 'StartDate',
    //        dataType: 'date'
    //    }, {
    //            dataField: 'DueDate',
    //            dataType: 'date'
    //        }, 'Priority', {
    //            caption: 'Completed',
    //            dataType: 'boolean',

    //        }]
    //}

    $scope.ProductListView = function (Id, e) {

        var requestData =
            {
                ServicesAction: 'LoadEnquiryByEnquiryId',
                EnquiryId: Id,
                RoleId: 3,
                CultureId: 1101

            };
        var consolidateApiParamater =
            {
                Json: requestData,
            };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            $scope.ProductListInfo = response.data.Json.EnquiryList.EnquiryProductList;
            //e.component.collapseAll(-1);
            e.component.expandRow(e.data);
            $rootScope.Throbber.Visible = false;
        });

        //$scope.ProductListInfo = [{
        //    Id: 1,
        //    ProductCode: "66005099",
        //    ProductName: "BGI 330ml*1can full",
        //    UnitOfMeasure: "Kg",
        //    UnitPrice: 540,
        //    Quantity: 1000,
        //    Stock: 200000
        //}, {
        //    Id: 1,
        //    ProductCode: "65205042",
        //    ProductName: "Heineken 330x24C Ctn Sleek Spe",
        //    UnitOfMeasure: "Kg",
        //    UnitPrice: 788,
        //    Quantity: 657,
        //    Stock: 45577
        //}, {
        //    Id: 1,
        //    ProductCode: "65105101",
        //    ProductName: "CB - Tiger Can (375 ml)",
        //    UnitOfMeasure: "Kg",
        //    UnitPrice: 453,
        //    Quantity: 8789,
        //    Stock: 454546
        //}, {
        //    Id: 1,
        //    ProductCode: "65801011",
        //    ProductName: "Affligem Double 300x24B Ctn",
        //    UnitOfMeasure: "Kg",
        //    UnitPrice: 350,
        //    Quantity: 840,
        //    Stock: 10000
        //}]

    }




});