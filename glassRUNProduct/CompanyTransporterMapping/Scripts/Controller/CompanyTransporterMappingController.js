angular.module("glassRUNProduct").controller('CompanyTransporterMappingController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {

    // alert('dd');
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.IsEdit = false;
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }


    $scope.ItemSearchInputDefaultSetting = function () {
        $scope.SearchControl = {
            InputItem: '',
            FilterAutoCompletebox: ''
        };
        $scope.selectedRow = -1;
        $scope.showItembox = false;

    }
    $scope.ItemSearchInputDefaultSetting();
    $scope.SelectedBranchPlant = {
        BranchPlantForSelectedEnquiry: ''
    }

    $scope.SelectedDeliveryLocation = {
        DeliveryLocationForSelectedEnquiry: ''
    }

    $scope.SelectedRoutList = [];
    $scope.RouteId = 0;
    $scope.RouteObjectList = [];
    $scope.SelectedId_CompanyId = 0;
    $scope.SelectedTransporterList = [];
    $scope.TransporterList = [];
    $scope.CompanyList = [];

    $scope.SortByListSetting = {
        scrollable: true,
        scrollableHeight: '43vh',
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false,
        checkBoxes: true
        //selectionLimit: 1
        //multiple:false

    }


    $scope.focusIn = function () {
        debugger;
        $scope.RouteDeailsJSON.CompanyId = 0;
    }
    $scope.focusOut = function () {
        debugger;
    }

    $scope.changeInput = function () {
        var selectedCompany = $scope.CompanyList.filter(function (el) { return el.Id === $scope.RouteDeailsJSON.CompanyId });
        if (selectedCompany.length > 0) {
            $scope.$broadcast('angucomplete-alt:changeInput', 'autoCustomerList', selectedCompany[0]);
        }

    }

    $scope.SelectedCompany = function (e) {
        debugger;
        try {
            $scope.RouteDeailsJSON.CompanyId = e.description.Id;
        } catch (e) {

        }
    };

    //#region Delete Add Grid Data with Confirmation
    $ionicModal.fromTemplateUrl('WarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.DeleteWarningMessageControl = modal;
    });


    $scope.CloseDeleteConfirmation = function () {
        $scope.DeleteWarningMessageControl.hide();
    };

    $scope.OpenDeleteConfirmation = function () {

        $scope.DeleteWarningMessageControl.show();
    };

    $scope.PageCompanyHeaderView = true;
    $scope.RouteDeailsJSON = {
        CompanyId: 0,
        TransporterTypeId: 0,
        OriginId: 0,
        DestinationId: 0,
        TruckSizeId: 0
    }


    $scope.OpenModalPopupToAddNewLocation = function (locationtype) {
        debugger;
        $rootScope.LocationType = locationtype;
        $scope.showCollectionbox = false;
        $scope.showShipToLocationbox = false;
        $scope.OpenAddLocationInMasterPopup();
    }

    $scope.OpenAddLocationInMasterPopup = function () {

        $rootScope.PickupAddedModalPopupControl = true;
    }


    $rootScope.CloseAddLocationInMasterPopup = function () {
        $rootScope.PickupAddedModalPopupControl = false;
    }


    $scope.GetAllParentCompanyDetails = function () {

        $rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'GetCompanyAndTransporterListDetails'

            };


        var consolidateApiParamater =
            {
                Json: requestData,

            };




        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            if (response.data != undefined) {
                if (response.data.Json != undefined) {
                    if (response.data.Json.TableList.Company !== undefined) {
                        if (response.data.Json.TableList.Company.CompanyList.length > 0) {
                            $scope.CompanyList = response.data.Json.TableList.Company.CompanyList;
                            $rootScope.Throbber.Visible = false;
                        }
                    }
                    else {

                        $scope.CompanyList = [];
                        $rootScope.Throbber.Visible = false;

                    }

                    if (response.data.Json.TableList.Transporter !== undefined) {
                        if (response.data.Json.TableList.Transporter.TransporterList.length > 0) {
                            $scope.TransporterList = response.data.Json.TableList.Transporter.TransporterList;
                            $rootScope.Throbber.Visible = false;
                        }
                    }
                    else {
                        $scope.TransporterList = []
                        $rootScope.Throbber.Visible = false;
                    }

                }
                else {
                    $scope.CompanyList = [];
                    $scope.TransporterList = [];
                    $rootScope.Throbber.Visible = false;
                }
            } else {
                $scope.CompanyList = [];
                $scope.TransporterList = [];
                $rootScope.Throbber.Visible = false;
            }
        });


    }


    $scope.GetAllParentCompanyDetails();


    $scope.GetAllTruckSize = function () {

        var requestData =
            {
                ServicesAction: 'GetAllTruckSizeList'

            };
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data.TruckSize.TruckSizeList;
            $scope.bindTruckSizeList = resoponsedata;
        });
    }
    $scope.GetAllTruckSize();



    $scope.ObjectCompanyEvent = {

        onItemSelect: function (item) {

            debugger;
            var selectedId = item.Id
            $scope.SelectedTransporterList = $scope.SelectedTransporterList.filter(function (el) { return el.Id === selectedId });

            //$scope.SelectLoginDetailsList = [];
            //$scope.hideEmailidtextboxes = true;
        },
        onItemDeselect: function (item) {
            //var selectedId = item.Id
            //$scope.SelectRoleMasterList = $scope.SelectRoleMasterList.filter(function (el) { return el.Id === selectedId });

            //alert("hi");
            //$scope.SelectLoginDetailsList = [];
            //$scope.changeobjectName();
            //$scope.hideEmailidtextboxes = false;
        }
    }
    //#region Load EventRetrySetting Grid
    $scope.LoadEventRetrySettingsGrid = function () {


        console.log("1" + new Date());

        var RouteGridDate = new DevExpress.data.CustomStore({
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

                var CompanyName = "";
                var CompanyNameCriteria = "";

                var TransporterName = "";
                var TransporterNameCriteria = "";

                var OriginName = "";
                var OriginNameCriteria = "";

                var DestinationName = "";
                var DestinationNameCriteria = "";

                var TruckSizeName = "";
                var TruckSizeNameCriteria = "";

                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');
                        if (columnsList[0] === "CompanyName") {
                            CompanyNameCriteria = columnsList[1];
                            CompanyName = columnsList[2];
                        }
                        if (columnsList[0] === "TransPorterName") {
                            TransporterNameCriteria = columnsList[1];
                            TransporterName = columnsList[2];
                        }

                        if (columnsList[0] === "OriginName") {
                            OriginNameCriteria = columnsList[1];
                            OriginName = columnsList[2];
                        }

                        if (columnsList[0] === "DestinationName") {
                            DestinationNameCriteria = columnsList[1];
                            DestinationName = columnsList[2];
                        }

                        if (columnsList[0] === "TruckSizeName") {
                            TruckSizeNameCriteria = columnsList[1];
                            TruckSizeName = columnsList[2];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));


                var requestData =
                    {
                        ServicesAction: 'LoadRouteDetails',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: "",//OrderBy,
                        OrderByCriteria: "",//OrderByCriteria,
                        CompanyName: CompanyName,
                        CompanyNameCriteria: CompanyNameCriteria,
                        TransporterName: TransporterName,
                        TransporterNameCriteria: TransporterNameCriteria,
                        OriginName: OriginName,
                        OriginNameCriteria: OriginNameCriteria,
                        DestinationName: DestinationName,
                        DestinationNameCriteria: DestinationNameCriteria,
                        TruckSizeName: TruckSizeName,
                        TruckSizeNameCriteria: TruckSizeNameCriteria
                    };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                    {
                        Json: requestData,
                    };

                console.log("2" + new Date());
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {


                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {

                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.RouteObjectList !== undefined) {
                                if (resoponsedata.Json.RouteObjectList.length > 0) {
                                    totalcount = resoponsedata.Json.RouteObjectList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.RouteObjectList.TotalCount;
                            }

                            ListData = resoponsedata.Json.RouteObjectList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.RouteObjectList = $scope.RouteObjectList.concat(data);
                    console.log("3" + new Date());
                    $rootScope.Throbber.Visible = false;
                    return data;
                });
            }
        });

        $scope.RouteGrid = {
            dataSource: {
                store: RouteGridDate,
            },
            bindingOptions: {

            },
            showBorders: true,
            allowColumnReordering: false,
            allowColumnResizing: true,
            //columnAutoWidth: true,
            loadPanel: {
                enabled: false,
                Type: Number,
                Width: 200

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
            keyExpr: "CompanyId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {
                debugger;
                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.RouteId, data.CompanyId, data.DestinationId, data.OriginId, data.TruckSizeId);
                    }
                    if (e.column.cellTemplate === "Delete") {
                        $scope.Delete_Route(data.RouteId, '0');
                        // $scope.Delete(data.RouteId);
                    }

                    if (e.column.cellTemplate === "ActiveInActiveTemplate") {

                        var isActive = "1";
                        if (data.IsActive === "1") {
                            isActive = "0";
                        }
                        else {
                            isActive = "1";
                        }

                        $scope.Delete_Route(data.RouteId, isActive);
                        // $scope.Delete(data.RouteId);
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
            //    Width: 200
            //},
            //searchPanel: { visible: true },
            columns: [
                {
                    caption: "Company Name",
                    dataField: "CompanyName",
                    //cssClass: "ClickkableCell EnquiryNumberUI",
                    alignment: "left",
                    Width: 100,
                    allowSorting: false
                },
                {
                    caption: "Transporter Name",
                    dataField: "TransPorterName",
                    alignment: "left",
                    Width: 200,
                    allowSorting: false
                },
                {
                    caption: "Origin Name",
                    dataField: "OriginName",
                    alignment: "left",
                    Width: 200,
                    allowSorting: false
                },
                {
                    caption: "Destination Name",
                    dataField: "DestinationName",
                    alignment: "left",
                    Width: 200,
                    allowSorting: false
                }, {
                    caption: "TruckSize Name",
                    dataField: "TruckSizeName",
                    alignment: "left",
                    Width: 200,
                    allowSorting: false
                }, {
                    caption: "Created On",
                    dataField: "CreatedDate",
                    alignment: "left",
                    Width: 100,
                    allowFiltering: false,
                    allowSorting: false
                },
                //{
                //    caption: "Edit",
                //    dataField: "CompanyId",
                //    cssClass: "ClickkableCell EnquiryNumberUI",
                //    cellTemplate: "Edit",
                //    alignment: "Right",
                //    allowFiltering: false,
                //    allowSorting: false,
                //    Width: 20
                //},
                //{
                //    caption: "Delete",
                //    dataField: "CompanyId",
                //    cssClass: "ClickkableCell EnquiryNumberUI",
                //    cellTemplate: "Delete",
                //    alignment: "Right",
                //    allowFiltering: false,
                //    allowSorting: false,
                //    Width: 20
                //},

                {
                    caption: "Active / InActive",
                    dataField: "IsActive",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "ActiveInActiveTemplate",
                    alignment: "Right",
                    allowFiltering: false,
                    allowSorting: false,
                    Width: 20
                }
            ]
        };
    }
    //#endregion

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {

        $scope.PaymentSlabList = [];
        var dataGrid = $("#RouteGrid").dxDataGrid("instance");
        dataGrid.refresh();
    }
    //#endregion

    $scope.LoadEventRetrySettingsGrid();



    $scope.ClearControls = function () {
        $scope.IsEdit = false;
        $scope.RouteDeailsJSON.CompanyId = 0;
        $scope.RouteDeailsJSON.TransporterTypeId = 0;
        $scope.RouteDeailsJSON.OriginId = 0;
        $scope.RouteDeailsJSON.DestinationId = 0;
        $scope.RouteDeailsJSON.TruckSizeId = 0;
        $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry = "";
        $scope.SelectedDeliveryLocation.DeliveryLocationForSelectedEnquiry = "";
        $scope.SearchControl.InputShipToLocation = "";
        $scope.SearchControl.InputCollection = "";
        $scope.RouteDeailsJSON.TruckSizeId = 0;
        $scope.SelectedTransporterList = [];
        $scope.SelectedRoutList = [];
        $scope.$broadcast('angucomplete-alt:clearInput', 'autoCustomerList');
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


    $scope.ViewForm();

    $scope.Edit = function (RouteId, id, destinationid, originid, truckSize) {
        debugger;
        $rootScope.Throbber.Visible = true;

        $scope.AddForm();
        var requestData =
            {
                ServicesAction: 'RouteDetailsById',
                RouteId: RouteId,
                CompanyId: id,
                OriginId: originid,
                DestinationId: destinationid,
                TruckSizeId: truckSize,
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            if (response.data.Json != undefined) {
                debugger;
                $scope.IsEdit = true;
                var responsedata = response.data.Json.RouteList[0];
                $scope.RouteId = responsedata.RouteId;
                $scope.RouteDeailsJSON.CompanyId = responsedata.CompanyId;
                $scope.RouteDeailsJSON.TransPorterId = 0;
                $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry = responsedata.OriginId;
                $scope.SearchControl.InputShipToLocation = responsedata.DeliverName;
                $scope.SearchControl.InputCollection = responsedata.CollectionName;
                $scope.SelectedDeliveryLocation.DeliveryLocationForSelectedEnquiry = responsedata.DestinationId;
                $scope.RouteDeailsJSON.TruckSizeId = responsedata.TruckSizeId;
                $scope.SelectedRoutList = responsedata.RoutList;
                $scope.SelectedTransporterList = responsedata.TransporterList;
                $scope.changeInput();
                $rootScope.Throbber.Visible = false;
            }
        });
    }


    $scope.Save = function () {
        debugger;
        //if($rootScope.pageContrlAcessData.CompanyId == 1 || $rootScope.pageContrlAcessData.CompanyId==0)
        //{
        //	$scope.RouteDeailsJSON.CompanyId="1";
        //}
        //else
        //{
        //if($rootScope.pageContrlAcessData.TransporterId == 1 || $rootScope.pageContrlAcessData.TransporterId==0)	{
        //$scope.SelectedTransporterList.length == 1
        //}
        //}

        if ($scope.RouteDeailsJSON.CompanyId != 0 && $scope.SelectedTransporterList.length > 0) {



            if ($scope.RouteId !== 0) {

                serviceaction = 'SaveRoute';
            }
            else {
                serviceaction = 'SaveRoute';
            }
            //var requestData = [];
            var objectData = {
                ServicesAction: serviceaction,
                RouteList: []
            };

            if ($scope.SelectedTransporterList.length > 0) {

                for (var i = 0; i < $scope.SelectedTransporterList.length; i++) {
                    var CompanyId = $scope.RouteDeailsJSON.CompanyId
                    var TransPorterId = $scope.SelectedTransporterList[i].Id
                    var EditRoutID = 0;

                    var selectroute = $scope.SelectedRoutList.filter(function (el) { return el.Id === TransPorterId });
                    if (selectroute.length > 0) {

                        EditRoutID = selectroute[0].RouteId;
                    }


                    //$scope.SelectedRoutList
                    ObjmappingData = {
                        RouteId: EditRoutID,
                        CompanyId: CompanyId,
                        TransPorterId: TransPorterId,
                        OriginId: $scope.SelectedBranchPlant.BranchPlantForSelectedEnquiry,//$scope.RouteDeailsJSON.OriginId ,
                        DestinationId: $scope.SelectedDeliveryLocation.DeliveryLocationForSelectedEnquiry,//$scope.RouteDeailsJSON.DestinationId ,
                        TruckSizeId: $scope.RouteDeailsJSON.TruckSizeId,//$scope.RouteDeailsJSON.TruckSizeId,
                        IsActive: true,
                        CreatedBy: $rootScope.UserId,
                    }
                    objectData.RouteList.push(ObjmappingData);
                }

                objectData.EditedRoutList = $scope.SelectedRoutList;
                var consolidateApiParamater =
                    {
                        Json: objectData,
                    };

                GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    $scope.IsEdit = false;
                    if ($scope.SelectedRoutList.length > 0) {
                        $rootScope.ValidationErrorAlert('Record Updated Successfully.', 'error', 3000);
                    }
                    else {
                        $rootScope.ValidationErrorAlert('Record Saved Successfully.', 'error', 3000);
                    }

                    $scope.ClearControls();
                    $scope.ViewForm();
                    $scope.RefreshDataGrid();

                });

            }
        }
        else {


            if ($scope.RouteDeailsJSON.CompanyId === "" || $scope.RouteDeailsJSON.CompanyId === null || $scope.RouteDeailsJSON.CompanyId === undefined || $scope.RouteDeailsJSON.CompanyId === 0) {
                $rootScope.ValidationErrorAlert('Select Company', '', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert('Select Transporter', '', 3000);
            }


        }
    }


    $scope.DeleteYes = function () {
        debugger;
        $rootScope.Throbber.Visible = true;
        var requestData =
            {
                ServicesAction: 'DeleteRoute',
                CompanyId: $scope.SelectedId_CompanyId,
                IsActive: $scope.ActiveInActiveRecord,
                UpdatedBy: $rootScope.UserId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            if ($scope.ActiveInActiveRecord === '1') {
                $rootScope.ValidationErrorAlert('Record Active Successfully', '', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert('Record InActive Successfully', '', 3000);
            }
            $scope.ViewForm();
            $scope.RefreshDataGrid();
            $rootScope.Throbber.Visible = false;
            $scope.CloseDeleteConfirmation();

        });
    }

    $scope.Delete_Route = function (Id, isActive) {
        debugger;
        $scope.SelectedId_CompanyId = Id;
        $scope.ActiveInActiveRecord = isActive;
        $scope.DeleteWarningMessageControl.show();
    }

    $scope.filterValue = function ($event) {

        var regex = new RegExp("^[0-9.]*$");
        // var regex = new RegExp("^[0-9]+(\.[0-9]{1,2})*$");

        var key = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);
        if (!regex.test(key)) {
            $event.preventDefault();
        }
    };
})