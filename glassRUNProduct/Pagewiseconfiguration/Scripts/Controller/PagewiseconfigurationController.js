angular.module("glassRUNProduct").controller('PagewiseconfigurationController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {


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
	$scope.IsControlDisbaled = false;
$scope.EditMode = false;
    $scope.SalesAdminApprovalList = [];
    $scope.Action = "Add";

    $scope.UserList = [];
    $scope.UserSelectedList = [];
    $scope.MultiSelectUserDropdownSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true,
        disabled: true,
showCheckAll: false,
        showUncheckAll: false
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
                ObjectId: 0,
				ConfigurationAvailable:1

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


        $scope.showRolebox = false;
        $scope.selectedRoleRow = -1;
        $scope.GridConfigurationJSON.RoleMasterId = 0;
        $scope.SearchControl.InputRoleItem = '';


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
$scope.MasterDataList=[];
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

    $scope.LoadGridColumns = function (pageId,pageName) {
debugger;
        $scope.GridConfigurationJSON.PageId = pageId;   
		$scope.SearchControl.InputPageItem = pageName;    
        //$scope.ClearOnPageDropDown();
        $scope.showPagebox = false;
        //$scope.GetAllMasterDataList(pageId);
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
debugger;

            var selectedId = item.Id
            $scope.UserSelectedList = $scope.UserSelectedList.filter(function (el) { return el.Id === selectedId });
            // $scope.changeobjectName();
            //$scope.SelectLoadedDistributorsList = [];
$scope.GetAllMasterDataList($scope.GridConfigurationJSON.PageId,$scope.GridConfigurationJSON.RoleMasterId,selectedId);
        },
        onItemDeselect: function (item) {
debugger;
            //var selectedId = item.Id
            //$scope.SelectRoleMasterList = $scope.SelectRoleMasterList.filter(function (el) { return el.Id === selectedId });

            //alert("hi");
            $scope.UserSelectedList = [];
$scope.GetAllMasterDataList($scope.GridConfigurationJSON.PageId,$scope.GridConfigurationJSON.RoleMasterId,0);
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
$scope.GetAllMasterDataList($scope.GridConfigurationJSON.PageId,RoleMasterId,0);
        $scope.LoadUsersByRoleMasterId(RoleMasterId);

        $scope.GridColumnPreviewList = [];

    }

    $scope.LoadRoleMasterList = function () {

        var requestData =
            {
                ServicesAction: 'LoadRoleMater',
                PageId: 0//$scope.GridConfigurationJSON.PageId
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.RoleMasterList = resoponsedata.Json.RoleMasterList;

            $scope.LoadObjectListData();

        });
    };
$scope.LoadRoleMasterList();
    //#endregion


    $scope.LoadUsersByRoleMasterId = function (roleId) {


        var requestData =
            {
                ServicesAction: 'LoadAllLoginUserDetails',
                RoleId: roleId,
                //PageId: $scope.GridConfigurationJSON.PageId,
                //ObjectId: $scope.GridConfigurationJSON.ObjectId
                PofileId: '0'
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
            $scope.ObjectList = resoponsedata.PageControl.PageControlList;
            $scope.LoadPagePropertiesData();
        });
    };

    $scope.LoadPagePropertiesData = function () {
        // Loading Grid name.

        var requestData =
            {
                ServicesAction: 'GetAllPagePropertyList',
                PageId: $scope.GridConfigurationJSON.PageId
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            $scope.PageProperties = resoponsedata.PageProperties.PagePropertiesList;
        });
    };


    $scope.ComparisonDataList =
        [{ Id: 1, Value: "Equal" },
        { Id: 2, Value: "In" }];

    $scope.PageWiseConfigurationList = [];
    $scope.AddPagewiseconfigurationMapping = function () {

		var userid="";
		if($scope.UserSelectedList.length>0)
			{
				userid=$scope.UserSelectedList[0].Id;
			}

        if ($scope.MasterDataList.length > 0) {
            for (var i = 0; i < $scope.MasterDataList.length; i++) {
                var propertyMappingJson = {
                    PageWiseConfigurationId: 0,
                    RoleId: $scope.GridConfigurationJSON.RoleMasterId,
                    PageId: $scope.GridConfigurationJSON.PageId,
                    UserId: userid,
                    CompanyId: 0,
                    SettingName: $scope.MasterDataList[i].SettingName,
                    SettingValue: $scope.MasterDataList[i].IsSelectedRow,
                    CreatedBy:$rootScope.UserId,
                    IsActive: true
                }
                $scope.PageWiseConfigurationList.push(propertyMappingJson);
            }
        }
    }

    $scope.DeletePropertyMappingByGuId = function (guid) {

        $scope.PageWiseConfigurationList = $scope.PageWiseConfigurationList.filter(function (el) { return el.PropertyGUID !== guid; });
    }

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

    }

    $scope.ClearControls = function () {
debugger;
        $scope.GridConfigurationJSON.RoleMasterId = 0;
        $scope.GridConfigurationJSON.PageId = 0;
        $scope.GridConfigurationJSON.ControlId = 0;
        $scope.GridConfigurationJSON.PropertyId = 0;
        $scope.SearchControl.InputPageItem = "";
        $scope.SearchControl.InputRoleItem = "";
        $scope.SearchControl.InputItem = "";
        $scope.UserSelectedList = [];
        $scope.UserList = [];
        $scope.PageWiseConfigurationList = [];
$scope.MasterDataList=[];
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

    

$scope.Save = function () {
		debugger;
		$scope.IsCheckValidation = true;
		$scope.IsCheckValidationForRole = false;
		$scope.AddPagewiseconfigurationMapping();
		if ( $scope.SearchControl.InputPageItem != "" && $scope.SearchControl.InputPageItem != undefined ) {
			if ( $scope.UserSelectedList.length > 0 ) {
				$scope.IsCheckValidation = false;
			}
			if ( $scope.IsCheckValidation ) {
				if ( $scope.SearchControl.InputRoleItem == "" && $scope.SearchControl.InputRoleItem == undefined ) {
					$scope.IsCheckValidationForRole = true;
				}
			}


			if ( $scope.IsCheckValidationForRole == false ) {

				var checkedValue = $scope.PageWiseConfigurationList.filter( function ( el ) { return el.SettingValue === 1 } );
				if ( checkedValue.length > 0 ) {

					var serviceActionMethod = "";
					if ( $scope.Action == "Add" ) {
						serviceActionMethod = "SavePagewiseconfiguration";
					}
					else {
						serviceActionMethod = "SavePagewiseconfiguration";
					}

					var requestData =
						{
							ServicesAction: serviceActionMethod,
							PageWiseConfigurationList: $scope.PageWiseConfigurationList
						};


					var jsonobject = {};
					jsonobject.Json = requestData;
					GrRequestService.ProcessRequest( jsonobject ).then( function ( response ) {

						$scope.ClearControls();
						$scope.ViewForm();
						$scope.RefreshDataGrid();
						$rootScope.ValidationErrorAlert( String.format( 'Record saved successfully' ), 'error', 8000 );
					} );
				}
				else {
//					$rootScope.ValidationErrorAlert( String.format( 'Please select atleast one configuration' ), 'error', 3000 );
$rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_Pagewiseconfiguration_AtleastOneConfig), '', 3000);
				}
			} else {
				$rootScope.ValidationErrorAlert( String.format( 'Please select role' ), 'error', 3000 );
			}
		} else {
			$rootScope.ValidationErrorAlert( String.format( 'Please select page' ), 'error', 3000 );
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
                ObjectName: 'FinanceDashboardController',
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
                        ServicesAction: 'UserPagewiseconfiguration',
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
                        ControlNameCriteria: ControlNameCriteria

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
                        $scope.Edit(data.PageId,data.RoleId,data.UserId);

                    }
                    if (e.column.cellTemplate === "Delete") {
                        $scope.OpenDeleteConfirmation(data.PageId,data.RoleId,data.UserId);

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
				caption: $rootScope.resData.res_PageWiseConfiguration_Page,
                dataField: "PageName",
                alignment: "left",
            }, {
				caption: $rootScope.resData.res_PageWiseConfiguration_User,
                dataField: "Name",
                alignment: "left",
            }, {
				caption: $rootScope.resData.res_PageWiseConfiguration_Role,
                dataField: "RoleName",
                alignment: "left",
            },
            
            //{
            //    dataField: "DimensionName",
            //    alignment: "left",
            //}, {
            //    dataField: "DimensionValue",
            //    alignment: "left",
            //},


            {
                caption: "Edit",
                dataField: "RoleWisePageMappingId",
                cssClass: "ClickkableCell EnquiryNumberUI",
                cellTemplate: "Edit",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 150
            },

            {
                caption: "Delete",
                dataField: "RoleWisePageMappingId",
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

    $scope.DimensionMappingId = 0;

    $scope.OpenDeleteConfirmation = function (pageName, roleMasterId, userId) {

        $scope.PageName = pageName;
        $scope.RoleMasterId = roleMasterId;
        $scope.UserId = userId;
        
        $scope.DeleteWarningMessageControl.show();
    };


    $scope.DeletePageWiseConfiguration = function () {
debugger;
        var requestData =
            {
                ServicesAction: 'DeletePageWiseConfigurationId',
                PageId: $scope.PageName,
                RoleMasterId: $scope.RoleMasterId,
                UserId: $scope.UserId
                
            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            $scope.CloseDeleteConfirmation();
            $scope.RefreshDataGrid();
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_DeletedSuccess), 'error', 8000);
        });

    }



    $scope.Edit = function (pageId,roleId,userId) {
debugger;
        $scope.AddForm();
       $scope.IsControlDisbaled = true;
$scope.EditMode = true;
$scope.UserDetailVisible = true;
        var requestData =
            {
                ServicesAction: 'GetPageWiseConfigurationByPageWiseConfigurationId',
                PageId: pageId,
				RoleId: roleId,
				UserId: userId
               
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (response.data.Json != undefined) {
                var responsedata = response.data.Json.PageWiseConfigurationList[0];
                $scope.DimensionMappingId = responsedata.PageWiseConfigurationId;
                $scope.SearchControl.InputPageItem = responsedata.PageName;
                $scope.GridConfigurationJSON.RoleMasterId=responsedata.RoleId;
				$scope.GridConfigurationJSON.PageId=responsedata.PageId;
                $scope.SearchControl.InputRoleItem = responsedata.RoleName;
				
                if (responsedata.UserList != undefined) {
                    if (responsedata.UserList.length > 0) {
                        $scope.UserSelectedList = responsedata.UserList;
                    } else {
                        $scope.UserSelectedList = [];
                    }
					$scope.SearchControl.UserSelected = responsedata.UserList[0].Name;
                }
                     
                $scope.MasterDataList = response.data.Json.PageWiseConfigurationList;
				for (var i = 0; i < $scope.MasterDataList.length; i++) {
					if($scope.MasterDataList[i].InputValue==1)
					{	
						$scope.MasterDataList[i].InputValue = true;
						$scope.MasterDataList[i].IsSelectedRow = 1;
					}
                
            }
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

    $scope.GetAllMasterDataList = function (pageid,roleId,userId) {

        var requestData =
            {
                ServicesAction: 'GetAllMasterDetailByPageid',
                PageId: pageid,//$scope.GridConfigurationJSON.PageId,
RoleId: roleId,
UserId:userId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            debugger;
            var resoponsedata = response.data;
			if(resoponsedata.Json!==undefined)
			{
            $scope.MasterDataList = resoponsedata.Json.MasterList;
            for (var i = 0; i < $scope.MasterDataList.length; i++) {
              if($scope.MasterDataList[i].InputValue == 1)
				{
				$scope.MasterDataList[i].InputValue = true;
				$scope.MasterDataList[i].IsSelectedRow = 1;
				}
else
{
		$scope.MasterDataList[i].InputValue = false;
				$scope.MasterDataList[i].IsSelectedRow = 0;
}

            }
			}
			else
			{
				$scope.MasterDataList=[];
            }


        });
    };


	 $scope.SetSelectedRow = function (item) {
        debugger;
		if(item.IsSelectedRow!==undefined)
		{
		if(item.IsSelectedRow === 1){
		item.IsSelectedRow = 0;
		}
		else{
        item.IsSelectedRow = 1;
		}
		}
		else{
		item.IsSelectedRow = 1;
		}

}

    //$scope.GetAllMasterDataList();
});