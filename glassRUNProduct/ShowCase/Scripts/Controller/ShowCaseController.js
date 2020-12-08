angular.module("glassRUNProduct").controller('ShowCaseController', function ($scope, $q, $state, $timeout, $ionicModal, $location, pluginsService, $rootScope, $sessionStorage, GrRequestService) {

 $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = false;
        } else {
            $rootScope.Throbber = {
                Visible: false
            };
        }
    };
    $scope.LoadThrobberForPage();
$scope.ShowCaseList = [];

 $scope.fileupload = {
        Filesmall: '',
Filebig: ''
    };

	$scope.ShowCaseJSON = {    
ShowCaseId: 0,   
        ShowCaseType: 0,
        FromDate: '',
        ToDate: '',
		labelFilename: '',
        SmallImage: '',
		labelBigImageFilename: '',
        BigImage: '',
		Title:'',
		Description:''
    };

$scope.SearchControl = {
            InputItem: '',
            FilterAutoCompletebox: ''
        };

var lookuplist = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ShowCaseType'; });
debugger;
if (lookuplist.length > 0) {
$rootScope.ShowCaseTypeList = lookuplist.filter(function (el) { return el.Code === '41' });
}


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
        $scope.ClearControls();
        //$scope.RefreshDataGrid();
    }

$scope.BindCalendarFromDate = function () {

        debugger;
        $('#FromDate').each(function () {
            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id !== undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');

                    }
                },
                minDate: new Date(),
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false
            });
        });

        $('#FromDate').datepicker("show");

    }



    $scope.BindCalendarToDate = function () {

        $('#ToDate').each(function () {
            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id !== undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');

                    }
                },
                minDate: new Date(),
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false
            });
        });

		$('#ToDate').datepicker("show");


    }




$scope.selectedItemEvent = function(input,inputItemName)
{

	debugger;
	$scope.ItemValueId = input;
$scope.ItemNameId = inputItemName;
}




$scope.LoadShowCaseGrid = function () {
        debugger;


        var ShowCaseData = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var parameters = {};
                var OrderBy = "";
                var OrderByCriteria = "";
                if (loadOptions.sort) {
                    parameters.orderby = loadOptions.sort[0].selector;
                    if (loadOptions.sort[0].desc)
                        OrderBy = parameters.orderby += " desc";
                }
                else {
                    OrderBy = "";
                }
                debugger;
                parameters.skip = loadOptions.skip || 0;
                parameters.take = loadOptions.take || 100;

                var filterOptions = loadOptions.filter ? loadOptions.filter.join(",") : "";
                var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";

                var Type = "";
                var TypeCriteria = "";

                var VehicleRegistrationNumber = "";
                var VehicleRegistrationNumberCriteria = "";

                var TransporterName = "";
                var TransporterNameCriteria = "";

                var VehicleTypeName = "";
                var VehicleTypeNameCriteria = "";

                var NumberOfCompartments = "";
                var NumberOfCompartmentsCriteria = "";

                var TruckSize = "";
                var TruckSizeCriteria = "";

                var SequenceNumber = "";
                var SequenceNumberCriteria = "";

                var InsuranceValidityDate = "";
                var InsuranceValidityDateCriteria = "";

                var FitnessCertificateDate = "";
                var FitnessCertificateDateCriteria = "";

                var VehicleOwnerName = "";
                var VehicleOwnerNameCriteria = "";

                var VehicleOwnerAddress1 = "";
                var VehicleOwnerAddress1Criteria = "";

                var VehicleOwnerAddress2 = "";
                var VehicleOwnerAddress2Criteria = "";

               


                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        

                        if (columnsList[0] === "VehicleRegistrationNumber") {
                            VehicleRegistrationNumberCriteria = columnsList[1];
                            VehicleRegistrationNumber = columnsList[2];
                        }

                        if (columnsList[0] === "TransporterName") {
                            TransporterNameCriteria = columnsList[1];
                            TransporterName = columnsList[2];
                        }

                        if (columnsList[0] === "VehicleTypeName") {
                            VehicleTypeNameCriteria = columnsList[1];
                            VehicleTypeName = columnsList[2];
                        }

                        if (columnsList[0] === "NumberOfCompartments") {
                            if (NumberOfCompartments === "") {
                                if (fields.length > 1) {
                                    NumberOfCompartmentsCriteria = "=";
                                } else {
                                    NumberOfCompartmentsCriteria = columnsList[1];
                                }
                                NumberOfCompartmentsCriteria = columnsList[1];
                                NumberOfCompartments = columnsList[2];
                            }
                        }

                        if (columnsList[0] === "TruckSize") {
                            TruckSizeCriteria = columnsList[1];
                            TruckSize = columnsList[2];
                        }

                        if (columnsList[0] === "SequenceNumber") {
                            if (SequenceNumber === "") {
                                if (fields.length > 1) {
                                    SequenceNumberCriteria = "=";
                                } else {
                                    SequenceNumberCriteria = columnsList[1];
                                }
                                SequenceNumberCriteria = columnsList[1];
                                SequenceNumber = columnsList[2];
                            }
                        }

                        if (columnsList[0] === "InsuranceValidityDate") {
                            if (InsuranceValidityDate === "") {
                                if (fields.length > 1) {
                                    InsuranceValidityDateCriteria = "=";
                                } else {
                                    InsuranceValidityDateCriteria = columnsList[1];
                                }
                                InsuranceValidityDate = columnsList[2];
                                InsuranceValidityDate = new Date(InsuranceValidityDate);
                                InsuranceValidityDate = $filter('date')(InsuranceValidityDate, "dd/MM/yyyy");
                            }
                        }

                        if (columnsList[0] === "FitnessCertificateDate") {
                            if (FitnessCertificateDate === "") {
                                if (fields.length > 1) {
                                    FitnessCertificateDateCriteria = "=";
                                } else {
                                    FitnessCertificateDateCriteria = columnsList[1];
                                }
                                FitnessCertificateDate = columnsList[2];
                                FitnessCertificateDate = new Date(FitnessCertificateDate);
                                FitnessCertificateDate = $filter('date')(FitnessCertificateDate, "dd/MM/yyyy");
                            }
                        }

                        if (columnsList[0] === "VehicleOwnerName") {
                            VehicleOwnerNameCriteria = columnsList[1];
                            VehicleOwnerName = columnsList[2];
                        }

                        if (columnsList[0] === "VehicleOwnerAddress1") {
                            VehicleOwnerAddress1Criteria = columnsList[1];
                            VehicleOwnerAddress1 = columnsList[2];
                        }

                        if (columnsList[0] === "VehicleOwnerAddress2") {
                            VehicleOwnerAddress2Criteria = columnsList[1];
                            VehicleOwnerAddress2 = columnsList[2];
                        }

                        
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));

                debugger;
                var requestData =
                {
                    ServicesAction: 'GetAllShowCase_Paging',
                    PageIndex: parameters.skip,
                    PageSize: index,
                    OrderBy: OrderBy,
                    OrderByCriteria: OrderByCriteria,

                    
                    VehicleRegistrationNumber: VehicleRegistrationNumber,
                    VehicleRegistrationNumberCriteria: VehicleRegistrationNumberCriteria,
                    TransporterName: TransporterName,
                    TransporterNameCriteria: TransporterNameCriteria,
                    VehicleTypeName: VehicleTypeName,
                    VehicleTypeNameCriteria: VehicleTypeNameCriteria,
                    NumberOfCompartments: NumberOfCompartments,
                    NumberOfCompartmentsCriteria: NumberOfCompartmentsCriteria,
                    TruckSize: TruckSize,
                    TruckSizeCriteria: TruckSizeCriteria,
                    SequenceNumber: SequenceNumber,
                    SequenceNumberCriteria: SequenceNumberCriteria,
                    InsuranceValidityDate: InsuranceValidityDate,
                    InsuranceValidityDateCriteria: InsuranceValidityDateCriteria,
                    FitnessCertificateDate: FitnessCertificateDate,
                    FitnessCertificateDateCriteria: FitnessCertificateDateCriteria,
                    VehicleOwnerName: VehicleOwnerName,
                    VehicleOwnerNameCriteria: VehicleOwnerNameCriteria,
                    VehicleOwnerAddress1: VehicleOwnerAddress1,
                    VehicleOwnerAddress1Criteria: VehicleOwnerAddress1Criteria,
                    VehicleOwnerAddress2: VehicleOwnerAddress2,
                    VehicleOwnerAddress2Criteria: VehicleOwnerAddress2Criteria,
                  
                    CompanyId: $rootScope.CompanyId,
                    RoleId: $rootScope.RoleId
                };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                {
                    Json: requestData
                };
                debugger;
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    debugger;
                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {

                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.ShowCaseList.length !== undefined) {
                                if (resoponsedata.Json.ShowCaseList.length > 0) {
                                    totalcount = resoponsedata.Json.ShowCaseList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.ShowCaseList.TotalCount;
                            }

                            ListData = resoponsedata.Json.ShowCaseList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.ShowCaseList = $scope.ShowCaseList.concat(data);
                   
                    return data;
                });
            }
        });

        $scope.ShowCaseGrid = {
            dataSource: {
                store: ShowCaseData
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
            keyExpr: "ShowCaseId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.TransportVehicleId);
                    }
                    else if (e.column.cellTemplate === "Delete") {
                        $scope.Delete_DeleteTransPortVehicle(data.TransportVehicleId);
                    }
                    else if (e.column.cellTemplate === "ActiveInActiveTemplate") {
                        

                        var isActive = "1";
                        if(data.IsActive === "1")
                        {
                            isActive = "0";
                        }
                        else
                        {
                            isActive = "1";
                        }

                        $scope.ActiveInActiveLocationConfirmation(parseInt(data.TransportVehicleId), isActive);
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
            columns: [
                        {
                            caption: $rootScope.resData.res_ItemAllocation_SKUCode,
                            dataField: "ProductCode",							
                            alignment: "left"
                        },
                        {
                            dataField: "ProductName",
                            caption: $rootScope.resData.res_ItemAllocation_SKUname,							
                            alignment: "left",
                            width: 150
                        },
                        
						{
                            caption: "Type",
                            dataField: "TypeValue",							
                            alignment: "left"
                        },
						
						{
							dataField: "FromDate",
							caption:$rootScope.resData.res_GridColumn_FromDate,
							dataType: "date",
							format: "dd/MM/yyyy",
							filterOperations: ['=', '>', '<'],
							alignment: "right",
						},
						{
							dataField: "ToDate",
							caption:$rootScope.resData.res_GridColumn_ToDate,
							dataType: "date",
							format: "dd/MM/yyyy",
							filterOperations: ['=', '>', '<'],
							alignment: "right",
						},
    ]
        };
    };


    //$scope.LoadTransportVehicleGrid();

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {

        $scope.PaymentPlanList = [];
        var dataGrid = $("#ShowCaseGrid").dxDataGrid("instance");
        dataGrid.refresh();
    };
    //#endregion
    //#endregion

 $scope.BindCalendarFromDate();
	$scope.BindCalendarToDate();

$scope.Save = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        //alert($rootScope.Throbber.Visible);

        var documentName = "";
                var documentBase64 = "";
                var documentExtension = "";
var documentNamebigimage = "";
                var documentBasebigimage64 = "";
                var documentExtensionbigimage = "";
                
                    
                        
                        documentName = $scope.fileupload.Filesmall.dataFile.name;
                        documentBase64 = $scope.fileupload.Filesmall.dataBase64;
                        documentExtension = $scope.fileupload.Filesmall.dataFile.name.split('.')[1];
                    
               
                documentNamebigimage = $scope.fileupload.Filebig.dataFile.name;
                documentBasebigimage64 = $scope.fileupload.Filebig.dataBase64;
                documentExtensionbigimage = $scope.fileupload.Filebig.dataFile.name.split('.')[1];

                var showcase = {
                     ShowCaseId: $scope.ShowCaseJSON.ShowCaseId,
                     Type: $scope.ShowCaseJSON.ShowCaseType,
                     ProductCode: $scope.ItemValueId,
					 ProductName: $scope.ItemNameId,
                     FromDate: "02/08/2019",
                     ToDate: "02/08/2019",
                     SmallImage: documentBase64,
					 BigImage: documentBasebigimage64,
                     Title: $scope.ShowCaseJSON.Title,
                     Description: $scope.ShowCaseJSON.Description,                                
					 RoleId: $rootScope.RoleId,
					 UserId: $rootScope.UserId
                     };

						var showCaseList = [];
            showCaseList.push(showcase);

            var requestData =
                {
                    ServicesAction: 'SaveShowCase',
                    ShowCaseList: showCaseList
                };

                        var consolidateApiParamater =
                            {
                                Json: requestData
                            };


                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {                               

						$rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
						$scope.ClearControls();
                        $scope.ViewForm();
                        $scope.RefreshDataGrid();
                            $rootScope.Throbber.Visible = false;
                        });

                   
                
           


        

    }





$scope.LoadGridConfigurationData = function () {



        var objectId = 744;

        var gridrequestData =
        {
            ServicesAction: 'LoadGridConfiguration',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            CultureId: $rootScope.CultureId,
            ObjectId: objectId,
            ObjectName: 'ShowCase',
            PageName: $rootScope.PageName,
            ControllerName: page
        };

        var gridconsolidateApiParamater =
        {
            Json: gridrequestData,
        };

        console.log("-2" + new Date());

        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {


            if (response.data.Json != undefined) {
                //$scope.GridColumnList = response.data.Json.GridColumnList;
                //console.log("0" + new Date());

                ////$scope.EventTamplateGridData();


                $scope.GridColumnList = response.data.Json.GridColumnList;

                var ld = JSON.stringify(response.data);
                var ColumnlistinJson = JSON.parse(ld);

                $scope.DynamicColumnList = ColumnlistinJson.Json.GridColumnList;


                $scope.LoadTransportVehicleGrid();
                if ($scope.IsRefreshGrid === true) {
                    $scope.RefreshDataGrid();
                }
            } else {
            }
        });
    }

    $scope.LoadShowCaseGrid();

$scope.FileNameChanged = function (element) {

        $scope.$apply(function () {

            $scope.ShowCaseJSON.labelFilename = element.files[0].name;
            
            if(element.files[0].type !== "image/png" && element.files[0].type !== "application/pdf" && element.files[0].type !== "image/jpg")
            {
                $rootScope.ValidationErrorAlert('Only png, jpg, pdf files are allowed.', '', 3000);
                $scope.ShowCaseJSON.labelFilename = "";
            }

        });
    };

$scope.FileNameChangedBig = function (element) {

        $scope.$apply(function () {

            $scope.ShowCaseJSON.labelBigImageFilename = element.files[0].name;
            
            if(element.files[0].type !== "image/png" && element.files[0].type !== "application/pdf" && element.files[0].type !== "image/jpg")
            {
                $rootScope.ValidationErrorAlert('Only png, jpg, pdf files are allowed.', '', 3000);
                $scope.ShowCaseJSON.labelBigImageFilename = "";
            }

        });
    };



$scope.ClearControls = function () {
        
       
        $scope.ShowCaseId = 0;
        angular.element("input[type='file']").val(null);
        $scope.ShowCaseJSON.labelBigImageFilename = "";
        $scope.fileupload.Filebig = "";
		$scope.ShowCaseJSON.labelFilename = "";
        $scope.fileupload.Filesmall = "";       
        $scope.ShowCaseJSON.ToDate = "";
        $scope.ShowCaseJSON.FromDate = "";
        $scope.ShowCaseJSON.ShowCaseType = 0;
        $scope.ShowCaseJSON.Title = 0;
        $scope.ShowCaseJSON.Description = "";
        

    };



    $scope.GridConfigurationLoaded = false;

    $scope.LoadGridByConfiguration = function (e) {
        debugger;
        console.log("9" + new Date());
        $rootScope.Throbber.Visible = true;
        var dataGrid = $("#TransportVehicleGrid").dxDataGrid("instance");

        if ($scope.GridColumnList !== undefined) {
            for (var i = 0; i < $scope.GridColumnList.length; i++) {
                if ($scope.GridColumnList[i].IsAvailable === "0" || $scope.GridColumnList[i].IsAvailable === "false" || $scope.GridColumnList[i].IsAvailable === false) {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visible", false);
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", false);
                }
                else {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visibleIndex", parseInt($scope.GridColumnList[i].SequenceNumber));
                    if ($scope.GridColumnList[i].IsMandatory === "1" || $scope.GridColumnList[i].IsSystemMandatory === "1") {
                        dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", false);
                    } else {
                        dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "allowHiding", true);
                    }

                    if ($scope.GridColumnList[i].IsPinned === "1" || $scope.GridColumnList[i].IsPinned === "true" || $scope.GridColumnList[i].IsPinned === true) {
                        dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "fixed", true);
                    }

                    if ($scope.GridColumnList[i].IsDefault === "0" || $scope.GridColumnList[i].IsDefault === "false" || $scope.GridColumnList[i].IsDefault === false) {
                        dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "visible", false);
                    }

                    if ($scope.GridColumnList[i].IsGrouped === "1") {
                        dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "groupIndex", parseInt($scope.GridColumnList[i].GroupSequence));
                    }

                    if ($scope.GridColumnList[i].IsDetailsViewAvailable === "1" || $scope.GridColumnList[i].IsDetailsViewAvailable === "true" || $scope.GridColumnList[i].IsDetailsViewAvailable === true) {
                        if ($scope.GridColumnList[i].PropertyName === "EnquiryAutoNumber") {
                            dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "cssClass", "ClickkableCell EnquiryNumberUI UnderlineTextUI");
                        }
                    } else {
                        if ($scope.GridColumnList[i].PropertyName === "EnquiryAutoNumber") {
                            dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "cssClass", "ClickkableCell EnquiryNumberUI");
                        }
                    }
                }

                if ($scope.GridColumnList[i].PropertyName !== "CheckedEnquiry") {
                    dataGrid.columnOption($scope.GridColumnList[i].PropertyName, "caption", $scope.GridColumnList[i].ResourceValue);
                }
            }
        }
        $rootScope.Throbber.Visible = false;
        $scope.GridConfigurationLoaded = true;
        console.log("10" + new Date());
    }


});