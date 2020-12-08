angular.module("glassRUNProduct").controller('DimensionMappingController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {


    LoadActiveVariables($sessionStorage, $state, $rootScope);
    //if ($rootScope.Throbber !== undefined) {
    //    $rootScope.Throbber.Visible = true;
    //} else {
    //    $rootScope.Throbber = {
    //        Visible: true,
    //    }
    //}
    $scope.PageUrlName = $location.absUrl().split('#/')[1];
    var page = $location.absUrl().split('#/')[1];
    $scope.UserDetailVisible = false;
    $scope.SalesAdminApprovalList = [];
    $scope.Action = "Add";
	$scope.EditMode = false;
    $scope.UserList = [];
    $scope.UserSelectedList = [];
    $scope.MultiSelectUserDropdownSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true,
        disabled: true
    }



    $scope.DimensionMappingJson = {
        UserId: "",
        RoleId: "",
        PageId: "",
        ControlId: "",
        PropertyId: "",
        ControlType: "",
        Value: "",

    }
    $scope.IsControlDisbaled = false;

    $scope.GridConfigurationJSON = {
        RoleMasterId: 0,
        UserId: 0,
        PageId: 0,
        ControlId: 0
    };

    $scope.LoadPagesList = function () {
        //Load data after selection of object and role

        var requestData =
            {
                ServicesAction: 'LoadAllPagesList',
                RoleId: 0,
                ObjectId: 0

            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            if (resoponsedata !== null) {
                if (resoponsedata.Json !== undefined) {
                    $scope.PagesList = resoponsedata.Json.PagesList;
                }

            }

        });
    };
    $scope.LoadPagesList();

    $scope.ItemSearchInputDefaultSetting = function () {
        $scope.SearchControl = {
            InputItem: '',
            FilterAutoCompletebox: ''
        };
        $scope.selectedRow = -1;
        $scope.showItembox = false;
        $rootScope.foundResult = false;
    }
    $scope.ItemSearchInputDefaultSetting();

    $scope.ItemInputSelecteChangeEvent = function (input) {

        if (input.length > 0) {
            $scope.showItembox = true;
            $scope.selectedRow = 0;
        } else {
            $scope.showItembox = false;
            $scope.selectedRow = -1;
        }
        $scope.SearchControl.FilterAutoCompletebox = input;
    }


    $scope.ClearItemInputSearchbox = function () {

        $scope.showItembox = false;
        $scope.ClearItemRecord();
    }
    $scope.ClearItemRecord = function () {

        $scope.showItembox = false;
        $scope.selectedRow = -1;
        $scope.GridConfigurationJSON.ObjectId = 0;
        $scope.SearchControl.InputItem = '';


        //$scope.showRolebox = false;
        //$scope.selectedRoleRow = -1;
        //$scope.GridConfigurationJSON.RoleMasterId = 0;
        //$scope.SearchControl.InputRoleItem = '';


        //$scope.ClearOnObjectDropDown();


    }


    $scope.ShowObjectSearchList = function () {

        if ($scope.showItembox) {
            $scope.showItembox = false;
            $scope.selectedRow = -1;
        }
        else {
            $scope.showItembox = true;
            $scope.selectedRow = 0;
        }


        $scope.showRolebox = false;
        $scope.selectedRoleRow = -1;
        $scope.showPagebox = false;
        $scope.selectedPageRow = -1;
    }


    $scope.LoadObjectDropdown = function (ObjectName, ObjectId) {

        $scope.GridConfigurationJSON.ObjectId = ObjectId;
        $scope.GridConfigurationJSON.ControlId = ObjectId;
        $scope.SearchControl.InputItem = ObjectName;
        $scope.showItembox = false;


        $scope.showRolebox = false;
        $scope.selectedRoleRow = -1;
        //  $scope.GridConfigurationJSON.RoleMasterId = 0;
        //$scope.SearchControl.InputRoleItem = '';

        //$scope.ClearOnObjectDropDown();
        $scope.LoadRoleMasterList();

        //$scope.GridColumnPreviewList = [];
        //gridCallBack();

    }

    $scope.ShowPageSearchList = function () {

        if ($scope.showPagebox) {
            $scope.showPagebox = false;
            $scope.selectedPageRow = -1;
        }
        else {
            $scope.showPagebox = true;
            $scope.selectedPageRow = 0;
        }

        $scope.showRolebox = false;
        $scope.selectedRoleRow = -1;
        $scope.showItembox = false;
        $scope.selectedRow = -1;
    }

    $scope.ClearOnPageDropDown = function () {
        $scope.ObjectList = [];
        $scope.RoleMasterList = [];
        $scope.UserList = [];
        $scope.GridColumnPreviewList = [];
        $scope.UserSelectedList = [];


        $scope.GridConfigurationJSON.RoleMasterId = 0;
        $scope.SearchControl.InputRoleItem = '';

        $scope.GridConfigurationJSON.ObjectId = 0;
        $scope.SearchControl.InputItem = '';
    }

    $scope.LoadGridColumns = function (PageName, PageMasterId) {

        $scope.GridConfigurationJSON.PageId = PageMasterId;
        $scope.SearchControl.InputPageItem = PageName;
        $scope.ClearOnPageDropDown();
        $scope.showPagebox = false;
        $scope.LoadRoleMasterList();
        //this.dataGrid.dataSource.store.load();
    }

    //#region Search Functionality And Select Index Change Event Of RoleMaster List (Search Control).
    $scope.ItemRoleSearchInputDefaultSetting = function () {
        $scope.SearchControl = {
            InputRoleItem: '',
            FilterRoleAutoCompletebox: ''
        };
        $scope.selectedRoleRow = -1;
        $scope.showRolebox = false;
        $rootScope.foundResult = false;
    }
    $scope.ItemRoleSearchInputDefaultSetting();
    $scope.RoleInputSelecteChangeEvent = function (input) {

        if (input.length > 0) {
            $scope.showRolebox = true;
            $scope.selectedRoleRow = 0;
        } else {
            $scope.showRolebox = false;
            $scope.selectedRoleRow = -1;
        }
        $scope.SearchControl.FilterRoleAutoCompletebox = input;
    }

    $scope.ClearRoleInputSearchbox = function () {

        $scope.showRolebox = true;
        $scope.selectedRoleRow = 0;



        $scope.showPagebox = false;
        $scope.selectedPageRow = -1;
        $scope.showItembox = false;
        $scope.selectedRow = -1;

        $scope.GridConfigurationJSON.RoleMasterId = 0;
        $scope.SearchControl.InputRoleItem = '';

    }

    $scope.ShowRoleSearchList = function () {


        if ($scope.showRolebox) {

            $scope.showRolebox = false;
            $scope.selectedRoleRow = -1;
        }
        else {
            $scope.showRolebox = true;
            $scope.selectedRoleRow = 0;
        }

        $scope.showPagebox = false;
        $scope.selectedPageRow = -1;
        $scope.showItembox = false;
        $scope.selectedRow = -1;
    }


    $scope.ObjectUserEvent = {

        onItemSelect: function (item) {


            var selectedId = item.Id
            $scope.UserSelectedList = $scope.UserSelectedList.filter(function (el) { return el.Id === selectedId });
            // $scope.changeobjectName();
            //$scope.SelectLoadedDistributorsList = [];
        },
        onItemDeselect: function (item) {
            //var selectedId = item.Id
            //$scope.SelectRoleMasterList = $scope.SelectRoleMasterList.filter(function (el) { return el.Id === selectedId });

            //alert("hi");
            $scope.UserSelectedList = [];
            //$scope.changeobjectName();
        }
    }


    $scope.LoadPagesByRole = function (RoleName, RoleMasterId) {


        $scope.GridConfigurationJSON.RoleMasterId = RoleMasterId;
        $scope.SearchControl.InputRoleItem = RoleName;
        $scope.showRolebox = false;
        var myEl = angular.element(document.querySelector('#htmlPrview'));
        myEl.empty();
        $scope.GridColumnPreviewList = [];
        $scope.UserSelectedList = [];
        $scope.LoadUsersByRoleMasterId(RoleMasterId);
        $scope.GridColumnPreviewList = [];

    }

    $scope.LoadRoleMasterList = function () {

        var requestData =
            {
                ServicesAction: 'LoadRoleMater',
                PageId: $scope.GridConfigurationJSON.PageId
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.RoleMasterList = resoponsedata.Json.RoleMasterList;

            $scope.LoadObjectListData();

        });
    };

    //#endregion


    $scope.LoadUsersByRoleMasterId = function (roleId) {


        var requestData =
            {
                ServicesAction: 'LoadUserList',
                RoleId: roleId,
                PageId: $scope.GridConfigurationJSON.PageId,
                ObjectId: $scope.GridConfigurationJSON.ObjectId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.UserList = resoponsedata.Json.ProfileList;


        });
    }


    $scope.LoadObjectListData = function () {
        // Loading Grid name.

        var requestData =
            {
                ServicesAction: 'GetAllPageControlList',
                ControlType: 2,
                CultureId: $rootScope.CultureId,
                PageId: $scope.GridConfigurationJSON.PageId
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
if(resoponsedata.PageControl!==undefined){
	$scope.ObjectList = resoponsedata.PageControl.PageControlList;
}
else
{
$scope.ObjectList=[];
}
            
            $scope.LoadPagePropertiesData();
        });
    };

    $scope.LoadPagePropertiesData = function () {
        // Loading Grid name.
debugger;
        var requestData =
            {
                ServicesAction: 'GetAllPagePropertyList',
                PageId: $scope.GridConfigurationJSON.PageId
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
			if(resoponsedata.PageProperties!==undefined) {		
            $scope.PageProperties = resoponsedata.PageProperties.PagePropertiesList;
			}
			else {
				$scope.PageProperties=[];
			}
        });
    };


    $scope.ComparisonDataList =
        [{ Id: 1, Value: "=" },
        { Id: 2, Value: "<=" },
		{ Id: 3, Value: ">=" },
		{ Id: 4, Value: "!=" },
		{ Id: 5, Value: ">" },
		{ Id: 6, Value: "<" },
		{ Id: 7, Value: "in" },
		{ Id: 8, Value: "not in" }];

    $scope.PropertyMappingList = [];
//Changed by nimesh on 03-09-2019
    $scope.AddPropertyMapping = function () {
		debugger;
		if ( $scope.DimensionMappingJson.PropertyId != "0" ) {
			if ( $scope.DimensionMappingJson.ControlType != "0" ) {
				if ( $scope.DimensionMappingJson.Value != "" ) {
					$scope.PropertyGUid = generateGUID();
					var controlType = 0;
					if ( $scope.DimensionMappingJson.ControlType === "Equal" ) {
						controlType = "=";
					} else {
						controlType = $scope.DimensionMappingJson.ControlType;
					}

					var PageName = "";
					if ( $scope.PagesList.length > 0 ) {
						var PageNameList = $scope.PagesList.filter( function ( el ) { return el.PageId === $scope.GridConfigurationJSON.PageId; } );
						PageName = PageNameList[0].ControllerName;
					}

					var PagePropertiesList = $scope.PageProperties.filter( function ( el ) { return el.PropertyName === $scope.GridConfigurationJSON.PropertyId; } );


					var userId = 0;
					if ( $scope.UserSelectedList.length > 0 ) {
						userId = $scope.UserSelectedList[0].Id;
					}


					var propertyMappingJson = {
						PropertyGUID: $scope.PropertyGUid,
						UserDimensionMappingId: 0,
						RoleId: $scope.GridConfigurationJSON.RoleMasterId,
						PageId: $scope.GridConfigurationJSON.PageId,
						PageName: PageName,
						ControllerName: PageName,
						UserId: userId,
						ControlId: $scope.GridConfigurationJSON.ControlId,
						PropertyName: $scope.DimensionMappingJson.PropertyId,
						ControlType: $scope.DimensionMappingJson.ControlType,
						ControlTypeId: $scope.DimensionMappingJson.ControlType,
						ControlValue: $scope.DimensionMappingJson.Value,
						IsActive: true
					}
					$scope.PropertyMappingList.push( propertyMappingJson );
					$scope.ClearAddDimension();
				}
				else {
//Changed by nimesh on 09-09-2019
$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_DimensionMapping_AllPropertyFieldMandatory), 'error', 8000);
				}
			}
			else {
//Changed by nimesh on 09-09-2019
$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_DimensionMapping_AllPropertyFieldMandatory), 'error', 8000);
			}
		}
		else {
//Changed by nimesh on 09-09-2019
$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_DimensionMapping_AllPropertyFieldMandatory), 'error', 8000);
		}
	}
//Changed by nimesh on 09-09-2019
    $scope.DeletePropertyMappingByGuId = function (guid) {
debugger;
		$scope.DeleteWarningMessageForConfigurationControl.show();
$scope.GuidForDelete=guid;
//        $scope.PropertyMappingList = $scope.PropertyMappingList.filter(function (el) { return el.PropertyGUID !== guid; });
    }
//Changed by nimesh on 09-09-2019
    $scope.ClearPageInputSearchbox = function () {

        //$scope.ClearOnPageDropDown();
        $scope.showPagebox = true;
        $scope.selectedPageRow = 0;

        $scope.showRolebox = false;
        $scope.selectedRoleRow = -1;
        $scope.showItembox = false;
        $scope.selectedRow = -1;

        // $scope.GridConfigurationJSON.PageMasterId = 0;
        $scope.SearchControl.InputPageItem = '';

		$scope.PageProperties=[];
		$scope.RoleMasterList=[];

    }

    $scope.ClearControls = function () {

        $scope.GridConfigurationJSON.RoleMasterId = 0;
        $scope.GridConfigurationJSON.PageId = 0;
        $scope.GridConfigurationJSON.ControlId = 0;
        $scope.GridConfigurationJSON.PropertyId = 0;
        $scope.SearchControl.InputPageItem = "";
        $scope.SearchControl.InputRoleItem = "";
        $scope.SearchControl.InputItem = "";
        $scope.UserSelectedList = [];
        $scope.UserList = [];
        $scope.PropertyMappingList = [];
        $scope.RoleMasterList = [];
        $scope.ObjectList = [];
        $scope.ClearAddDimension();
        $scope.Action = "Add";
        $scope.IsControlDisbaled = false;
        $scope.UserDetailVisible = false;
		$scope.EditMode = false;
    }

    $scope.ClearAddDimension = function () {

        $scope.DimensionMappingJson.PropertyId = 0;
        $scope.DimensionMappingJson.ControlType = 0;
        $scope.DimensionMappingJson.Value = "";
    }
// changed by nimesh on 03-09-2019
    $scope.Save = function () {


debugger;

        var serviceActionMethod = "";
if($scope.GridConfigurationJSON.PageId!==0)
{
if($scope.GridConfigurationJSON.RoleMasterId!==0)
{
if($scope.GridConfigurationJSON.ControlId!==0)
{
if($scope.PropertyMappingList.length>0)
{
        if ($scope.Action == "Add") {
            serviceActionMethod = "SaveDimensionMapping";
        }
        else {
            serviceActionMethod = "UpdateDimensionMapping";
        }

        var requestData =
            {
                ServicesAction: serviceActionMethod,
                PropertyMappingList: $scope.PropertyMappingList
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $scope.ClearControls();
            $scope.ViewForm();
            $scope.RefreshDataGrid();
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GateKeeperListPage_SavedData), 'error', 8000);
        });


    }
else
{
	//Change by nimesh on 09-09-2019
	$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_DimensionMapping_AtleastOneConfig), 'error', 8000);
}
}
else
{
	$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PleaseSelectPageControlId), 'error', 8000);
}
}else
{
	$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PleaseSelectRoleMasterId), 'error', 8000);
}
}
else
{
	$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PleaseSelectPage), 'error', 8000);
}


}



    $scope.LoadGridConfigurationData = function () {

        var gridrequestData =
            {
                ServicesAction: 'LoadGridConfiguration',
                RoleId: $rootScope.RoleId,
                UserId: $rootScope.UserId,
                CultureId: $rootScope.CultureId,
                ObjectId: 178,
                ObjectName: 'DimensionMapping',
                PageName: $rootScope.PageName,
                ControllerName: page
            };

        //var stringfyjson = JSON.stringify(requestData);
        var gridconsolidateApiParamater =
            {
                Json: gridrequestData,
            };


        GrRequestService.ProcessRequest(gridconsolidateApiParamater).then(function (response) {
            debugger;
            if (response.data.Json != undefined) {
                $scope.GridColumnList = response.data.Json.GridColumnList;
                $scope.LoadFinanceDashboardGrid();

            } else {
                $scope.LoadFinanceDashboardGrid();
            }
        });
    }
    $scope.LoadGridConfigurationData();


    //#region Load Sales Admin Approval Grid

//Changed By nimesh on 06-09-2019
    $scope.LoadFinanceDashboardGrid = function () {


        var FinanceDashboardData = new DevExpress.data.CustomStore({

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

                var PageName = "";
                var PageNameCriteria = "";

                var UserName = "";
                var UserNameCriteria = "";

                var RoleName = "";
                var RoleNameCriteria = "";

                var ControlName = "";
                var ControlNameCriteria = "";

				var CreatedDate = "";
                var CreatedDateCriteria = "";

				var CreatedEndDate = "";
                var CreatedEndDateCriteria = "";



                if (filterOptions != "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "PageName") {
                            PageNameCriteria = columnsList[1];
                            PageName = columnsList[2];
                        }
                        if (columnsList[0] === "UserName") {
                            UserNameCriteria = columnsList[1];
                            UserName = columnsList[2];
                        }
                        if (columnsList[0] === "RoleName") {
                            RoleNameCriteria = columnsList[1];
                            RoleName = columnsList[2];
                        }
                        if (columnsList[0] === "ControlName") {
                            ControlNameCriteria = columnsList[1];
                            ControlName = columnsList[2];
                        }


						if (columnsList[0] === "CreatedDate") {
                                if (CreatedDate === "") {
                                    CreatedDateCriteria = columnsList[1];
                                    CreatedDate = columnsList[2];
                                    CreatedDate = new Date(CreatedDate);
                                    CreatedDate = $filter('date')(CreatedDate, "dd/MM/yyyy");
                                } else {
                                    CreatedEndDateCriteria = columnsList[1];
                                    CreatedEndDate = columnsList[2];
                                    CreatedEndDate = new Date(CreatedEndDate);
                                    CreatedEndDate = $filter('date')(CreatedEndDate, "dd/MM/yyyy");
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
                    if (loadOptions.sort[0].selector === "Carrier") {
                        OrderBy = "Carrier";
                    }
                    else {
                        OrderBy = loadOptions.sort[0].selector;
                    }

                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));


                var requestData =
                    {
                        ServicesAction: 'UserDimensionPaging',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: OrderBy,
                        OrderByCriteria: OrderByCriteria,
                        FinancerId: $rootScope.CompanyId,
                        IsExportToExcel: '0',
                        RoleMasterId: $rootScope.RoleId,
                        LoginId: $rootScope.UserId,
                        CultureId: $rootScope.CultureId,
                        PageName: PageName,
                        PageNameCriteria: PageNameCriteria,
                        RoleName: RoleName,
                        RoleNameCriteria: RoleNameCriteria,
                        UserName: UserName,
                        UserNameCriteria: UserNameCriteria,
                        ControlName: ControlName,
                        ControlNameCriteria: ControlNameCriteria,
						CreatedDate: CreatedDate,
                        CreatedDateCriteria: CreatedDateCriteria,
                        CreatedEndDate: CreatedEndDate,
                        CreatedEndDateCriteria: CreatedEndDateCriteria,

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
                            if (resoponsedata.Json.UserDimensionList.length !== undefined) {
                                if (resoponsedata.Json.UserDimensionList.length > 0) {
                                    totalcount = resoponsedata.Json.UserDimensionList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.UserDimensionList.TotalCount;
                            }

                            ListData = resoponsedata.Json.UserDimensionList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    } var inquiryList = {
                        data: ListData,
                        totalRecords: totalcount
                    }
                    for (var i = 0; i < ListData.length; i++) {
                        ListData[i].CheckedEnquiry = false;
                    }

                    var data = ListData;
                    $scope.SalesAdminApprovalList = $scope.SalesAdminApprovalList.concat(data);

                    if ($scope.GridConfigurationLoaded === false) {
                        //$scope.LoadGridByConfiguration();
                    }

                    return data;
                });
            }
        });
        $scope.FinanceDashboardGrid = {
            dataSource: {
                store: FinanceDashboardData,
            },
            bindingOptions: {

            },
            showBorders: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            loadPanel: {
                enabled: false
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
            keyExpr: "EnquiryAutoNumber",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {



                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.PageName, data.RoleMasterId, data.UserId, data.ControlId);

                    }
                    if (e.column.cellTemplate === "Delete") {
                        $scope.OpenDeleteConfirmation(data.PageName, data.RoleMasterId, data.UserId, data.ControlId);

                    }
                }

            },

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

            loadPanel: {
                Type: Number,
                width: 200
            },

            columns: [{
				caption: $rootScope.resData.res_DimensionMapping_Page,
                dataField: "PageName",
                alignment: "left",
            }, {
				caption: $rootScope.resData.res_DimensionMapping_User,
                dataField: "UserName",
                alignment: "left",
            }, {
				caption: $rootScope.resData.res_DimensionMapping_Role,
                dataField: "RoleName",
                alignment: "left",
            },
            {
				caption: $rootScope.resData.res_DimensionMapping_ControlName,
                dataField: "ControlName",
                alignment: "left",
            },
            {
				caption: $rootScope.resData.res_DimensionMapping_DimensionName,
                dataField: "DimensionName",
                alignment: "left",
            }, {
				caption: $rootScope.resData.res_DimensionMapping_OperatorType,
                dataField: "OperatorType",
                alignment: "left",
            },{
				caption: $rootScope.resData.res_DimensionMapping_DimensionValue,
                dataField: "DimensionValue",
                alignment: "left",
            },
			{
				caption: $rootScope.resData.res_DimensionMapping_CreatedDate,
                dataField: "CreatedDate",
                alignment: "left",
            },


            {
                caption: "Edit",
                dataField: "UserDimensionMappingId",
                cssClass: "ClickkableCell EnquiryNumberUI",
                cellTemplate: "Edit",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 150
            },

            {
                caption: "Delete",
                dataField: "UserDimensionMappingId",
                cssClass: "ClickkableCell EnquiryNumberUI",
                cellTemplate: "Delete",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 150
            }],
        };
    }
    //#endregion

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {

        $scope.SalesAdminApprovalList = [];
        $scope.IsEnquiryEdit = false;
        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#FinanceDashboardGrid").dxDataGrid("instance");
        dataGrid.refresh();

    }

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



	$ionicModal.fromTemplateUrl('WarningMessageForConfiguration.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.DeleteWarningMessageForConfigurationControl = modal;
    });


    $scope.CloseDeleteForConfigurationConfirmation = function () {
        $scope.DeleteWarningMessageForConfigurationControl.hide();
    };

	

    $scope.DimensionMappingId = 0;

    $scope.OpenDeleteConfirmation = function (pageName, roleMasterId, userId, controlId) {

        $scope.PageName = pageName;
        $scope.RoleMasterId = roleMasterId;
        $scope.UserId = userId;
        $scope.ControlId = controlId;
        $scope.DeleteWarningMessageControl.show();
    };

//Changed by nimesh on 03-09-2019
$scope.DeletePropertyConfiguration=function(){
$scope.PropertyMappingList = $scope.PropertyMappingList.filter(function (el) { return el.PropertyGUID !== $scope.GuidForDelete; });
$scope.CloseDeleteForConfigurationConfirmation();
}


    $scope.DeleteUserDimension = function () {

        var requestData =
            {
                ServicesAction: 'DeleteUserDimensionById',
                PageName: $scope.PageName,
                RoleMasterId: $scope.RoleMasterId,
                UserId: $scope.UserId,
                ControlId: $scope.ControlId,
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $scope.CloseDeleteConfirmation();
            $scope.RefreshDataGrid();
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_DeletedSuccess), 'error', 8000);
        });

    }



    $scope.Edit = function (pageName, RoleMasterId, UserId, ControlId) {
		debugger;
        $scope.AddForm();
        $scope.IsControlDisbaled = true;
		$scope.EditMode = true;
        $scope.showPagebox = false;
        $scope.UserDetailVisible = true;
        var requestData =
            {
                ServicesAction: 'GetUserDimensionMappingByUserDimensionMappingId',
                PageName: pageName,
                RoleId: RoleMasterId,
                UserId: UserId,
                ControlId: ControlId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (response.data.Json != undefined) {
                var responsedata = response.data.Json.PropertyMappingList[0];
                $scope.DimensionMappingId = responsedata.UserDimensionMappingId;
                $scope.SearchControl.InputPageItem = responsedata.PageName;
                $scope.LoadGridColumns(responsedata.PageName, responsedata.PageId);
                $scope.SearchControl.InputRoleItem = responsedata.RoleName;
                $scope.LoadPagesByRole(responsedata.RoleName, responsedata.RoleId);
                if (responsedata.UserList != undefined) {
                    if (responsedata.UserList.length > 0) {
                        $scope.UserSelectedList = responsedata.UserList;
                    } else {
                        $scope.UserSelectedList = [];
                    }
					$scope.SearchControl.UserSelected = responsedata.UserList[0].Name;
                }
                
                $scope.LoadObjectDropdown(responsedata.DisplayName, responsedata.ControlId);
				$scope.GridConfigurationJSON.PageId=responsedata.PageId;
				$scope.LoadPagePropertiesData();
                $scope.SearchControl.InputItem = responsedata.DisplayName;
                $scope.PropertyMappingList = response.data.Json.PropertyMappingList;
                $scope.Action = "Update";
            }
        });
    }



    $scope.AddForm = function () {

        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.ClearControls();
    }

    $scope.foundResult = false;

    $scope.ViewForm = function () {

        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.ClearControls();
    }


    $scope.ViewForm();

});