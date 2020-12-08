angular.module("glassRUNProduct").controller('PageRuleEventController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {


	LoadActiveVariables($sessionStorage, $state, $rootScope);


    

	$scope.PageRuleEventId=0;


	$scope.PageUrlName = $location.absUrl().split('#/')[1];
    var page = $location.absUrl().split('#/')[1];
    $scope.UserDetailVisible = false;
    $scope.SalesAdminApprovalList = [];
    $scope.Action = "Add";
	$scope.EditMode = false;
    $scope.LookupId = 0;

$scope.MultiSelectUserDropdownSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true,
        disabled: true
    }

$scope.PageRuleEventJSON = {
        PageEvent: "",
        RuleType: "",
		PageId:"",
		PageName:"",
       
        

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
debugger;
            var resoponsedata = response.data;
            if (resoponsedata !== null) {
                if (resoponsedata.Json !== undefined) {
                    $scope.PagesList = resoponsedata.Json.PagesList;
                }

            }

        });
    };
	$scope.LoadPagesList();

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

		

    }



	 $scope.LoadGridColumns = function (PageName, PageMasterId) {
debugger;
        $scope.PageRuleEventJSON.PageId = PageMasterId;
        $scope.SearchControl.InputPageItem = PageName;
        //$scope.ClearOnPageDropDown();
        $scope.showPagebox = false;
        $scope.LoadPageEvent($scope.PageRuleEventJSON.PageId);
        //this.dataGrid.dataSource.store.load();
    }

	

	$scope.LoadPageEvent = function (pageId) {
        //Load data after selection of object and role

        var requestData =
            {
                ServicesAction: 'LoadAllPageEvent',
                PageId: pageId,
                ObjectId: 0

            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            if (resoponsedata !== null) {
                if (resoponsedata.Json !== undefined) {
                    $scope.PageEventList = resoponsedata.Json.PageEventList;
                }

            }

        });
    };


	

	$scope.LoadRuleTypeEvent = function (pageId) {
        //Load data after selection of object and role

        var requestData =
            {
                ServicesAction: 'LoadAllRuleTypeEvent',
                PageId: pageId,
                ObjectId: 0

            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            if (resoponsedata !== null) {
                if (resoponsedata.Json !== undefined) {
                    $scope.RuleTypeEventDetailList = resoponsedata.Json.PageRuleList;
                }

            }

        });
    };




	$scope.LoadPageRuleEventGrid = function () {


        var PageRuleEventGridData = new DevExpress.data.CustomStore({

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
                        if (columnsList[0] === "PageEvent") {
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
                        ServicesAction: 'PageRuleEventPaging',
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
                            if (resoponsedata.Json.PageRuleEventList.length !== undefined) {
                                if (resoponsedata.Json.PageRuleEventList.length > 0) {
                                    totalcount = resoponsedata.Json.PageRuleEventList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.PageRuleEventList.TotalCount;
                            }

                            ListData = resoponsedata.Json.PageRuleEventList;
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
				    $rootScope.Throbber.Visible = false;
                    return data;
                });
            }
        });
        $scope.PageRuleEventGrid = {
            dataSource: {
                store: PageRuleEventGridData,
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
                dataField: "RuleType",
                alignment: "left",
            }, {
				caption: $rootScope.resData.res_DimensionMapping_Role,
                dataField: "Event",
                alignment: "left",
            },           


            {
                caption: "Edit",
                dataField: "PageRuleEventId",
                cssClass: "ClickkableCell EnquiryNumberUI",
                cellTemplate: "Edit",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 150
            },

            {
                caption: "Delete",
                dataField: "PageRuleEventId",
                cssClass: "ClickkableCell EnquiryNumberUI",
                cellTemplate: "Delete",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 150
            }],
        };
    }


 $scope.RefreshDataGrid = function () {

        $scope.SalesAdminApprovalList = [];
        $scope.IsEnquiryEdit = false;
        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#LoadPageRuleEventGrid").dxDataGrid("instance");
        dataGrid.refresh();

    }

	//Function to save Lookup records
   $scope.Save = function () {
       debugger;
   
       // unnecessary istrue variable use for Condition.
   
       if ($scope.SearchControl.InputPageItem === '' || $scope.SearchControl.InputPageItem === undefined || $scope.SearchControl.InputPageItem === null) {
           $rootScope.ValidationErrorAlert('Please Select Lookup Type');
           return;
       }
   
       
       //if ($scope.Code === '' || $scope.Code === undefined || $scope.Code === null) {
       //    $rootScope.toggleModelAlert('Please Enter Lookup Code');
       //    return;
       //}
       var istrue = true;
       if (istrue === true) {
           var PageRuleEventData = {
               PageRuleEventId: $scope.PageRuleEventId,
               PageId: $scope.PageRuleEventJSON.PageId,
			   PageName: $scope.SearchControl.InputPageItem,
               PageEvent: $scope.PageRuleEventJSON.PageEvent,
               RuleType: $scope.PageRuleEventJSON.RuleType,               
               Createdby: 1
           };
		
            
        

			 var requestData =
            {
                ServicesAction: "SavePageRuleEvent",
                PageRuleEventList: PageRuleEventData
            };

			var jsonobject = {};
			jsonobject.Json = requestData;
           GrRequestService.ProcessRequest(jsonobject).then(function (response) {
               debugger;
               var Lookupdata = response.data;
   
               
                   if ($scope.PageRuleEventId === 0) {
                       $rootScope.ValidationErrorAlert('Record inserted successfully.', 'success');
                   }
                   else {
                       $rootScope.ValidationErrorAlert('Record updated successfully.', 'success');
                   }
                   $scope.RefreshDataGrid();
                   $scope.ClearControls();
               
   
               //if (Lookupdata.LookupId === 0) {
               //    $rootScope.toggleModelAlert('Record inserted successfully.', 'success');
               //}
               //else {
               //    $rootScope.toggleModelAlert('Record updated successfully.', 'success');
               //}
               //gridCallBack();
               //$scope.reset();
           });
       }
   };




	  //Function to edit Lookup records
  $scope.LookupEdit = function (id) {
    
debugger;
        $scope.AddForm();

        $scope.EditMode = true;

        var requestData =
        {
            ServicesAction: 'GetPageRuleEventById',
            LookupId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (response.data.Json != undefined) {
                var responsedata = response.data.Json.PageRuleEventList[0];
				$scope.PageRuleEventId = responsedata.PageRuleEventId;
				$scope.SearchControl.InputPageItem = responsedata.PageName;
				$scope.LoadGridColumns(responsedata.PageName, responsedata.PageId);
                $scope.PageRuleEventJSON.PageEvent = responsedata.PageEvent;
                $scope.PageRuleEventJSON.RuleType = responsedata.RuleType;              
				
                $rootScope.Throbber.Visible = false;
            }
            //else {
            //    $rootScope.Throbber.Visible = false;
            //}
        });


  };

    //Function to delete Lookup records
 //  $scope.LookupdeleteRecord = function (id) {
 //      var jsonobject = {};
 //      jsonobject.LookupId = id;
 //      LookupService.LookupdeleteById(jsonobject).then(function (response) {
 //          $rootScope.toggleModelAlert('Record deleted successfully.', 'success');
 //          gridCallBack();
 //      });
 //
 //      $scope.modal.close();
 //  };

    $scope.reset = function () {
        $scope.LookupId = 0;
        $scope.Name = "";
        $scope.Code = "";
        $scope.LookupTypeId = "0";
        $scope.Description = "";
        $scope.SortOrder = "";
        $scope.IsActive = false;
    }

  


 $scope.ClearControls = function () {
       $scope.PageRuleEventJSON = {
        PageEvent: "",
        RuleType: "",
		PageId:"",
		PageName:"",
       
        

    }
	$scope.PageEventList=[];
$scope.PageEventList=[];
        $scope.LookupId = 0;
        $scope.EditMode = false;
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