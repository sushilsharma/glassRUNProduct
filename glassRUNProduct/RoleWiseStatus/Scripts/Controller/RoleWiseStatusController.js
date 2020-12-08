angular.module("glassRUNProduct").controller('RoleWiseStatusController', function ($scope, $http, $state, $sessionStorage, $rootScope, $filter, focus, $location, $ionicModal, GrRequestService, pluginsService) {



 LoadActiveVariables($sessionStorage, $state, $rootScope);
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true
        };
    }

$scope.RoleWiseStatus= {
RoleMasterId:0
}
$scope.SalesAdminApprovalList=[];

$scope.ResourceDetailList=[];

 $scope.AddForm = function () {
        
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        //$scope.ClearControls();
    };



    $scope.ViewForm = function () {
        
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        //$scope.ClearControls();
    };
    $scope.ViewForm();


$scope.PreviousSubActivityList=[];




$scope.LoadActivityGrid = function () {

        
        var ActivityGridData = new DevExpress.data.CustomStore({

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

                var StatusCode = "";
                var StatusCodeCriteria = "";

                var Header = "";
                var HeaderCriteria = "";

                var ActivityName = "";
                var ActivityNameCriteria = "";

                //var ControlName = "";
                //var ControlNameCriteria = "";

                

                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "StatusCode") {
                            if (StatusCode === "") {
                                if (fields.length > 1) {
                                    StatusCodeCriteria = "=";
                                } else {
                                    StatusCodeCriteria = columnsList[1];
                                }
                                StatusCodeCriteria = columnsList[1];
                                StatusCode = columnsList[2];
                            }
                        }
                        if (columnsList[0] === "Header") {
                            HeaderCriteria = columnsList[1];
                            Header = columnsList[2];
                        }
                        if (columnsList[0] === "ActivityName") {
                            ActivityNameCriteria = columnsList[1];
                            ActivityName = columnsList[2];
                        }
                        //if (columnsList[0] === "ControlName") {
                        //    ControlNameCriteria = columnsList[1];
                        //    ControlName = columnsList[2];
                        //}
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
                        ServicesAction: 'LoadRoleWiseStatus',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: OrderBy,
                        OrderByCriteria: OrderByCriteria,
                        FinancerId: $rootScope.CompanyId,
                        IsExportToExcel: '0',
                        RoleMasterId: $rootScope.RoleId,
                        LoginId: $rootScope.UserId,
                        CultureId: $rootScope.CultureId,
                        StatusCode: StatusCode,
                        StatusCodeCriteria: StatusCodeCriteria,
                        Header: Header,
                        HeaderCriteria: HeaderCriteria,
                        ActivityName: ActivityName,
                        ActivityNameCriteria: ActivityNameCriteria
                        //ControlName: ControlName,
                        //ControlNameCriteria: ControlNameCriteria

                    };

                $scope.RequestDataFilter = requestData;


                var consolidateApiParamater =
                    {
                        Json: requestData
                    };

                console.log("2" + new Date());
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                    debugger;
                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {
                        
                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.RoleWiseStatusList.length !== undefined) {
                                if (resoponsedata.Json.RoleWiseStatusList.length > 0) {
                                    totalcount = resoponsedata.Json.RoleWiseStatusList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.RoleWiseStatusList.TotalCount;
                            }

                            ListData = resoponsedata.Json.RoleWiseStatusList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }
                    //var inquiryList = {
                    //    data: ListData,
                    //    totalRecords: totalcount
                    //}
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

        $scope.ActivityGrid = {
            dataSource: {
                store: ActivityGridData
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
            keyExpr: "RoleName",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                

                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;
debugger;
                    if (e.column.cellTemplate === "Edit") {
                        
                            $scope.LoadSubActivityList(data.RoleId);
                       

                    }
                    if (e.column.cellTemplate === "Delete") {
                        if (data.IsActivityUsedInWorkflow === "0") {
                            $scope.OpenDeleteConfirmation(data.ActivityId, data.StatusCode);
                        } else {
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_GridConfigurationPage_ActivityAlreadyUsed), 'error', 8000);
                        }
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

            //loadPanel: {
            //    Type: Number,
            //    width: 200
            //},

            columns: [{
                dataField: "RoleName",
                alignment: "left"
            }, {
                dataField: "ResourceKey",
                alignment: "left"
            }, {
                dataField: "StatusCode",
                alignment: "left",
                filterOperations: ['=', '>', '<']
            },
            {
                caption: "Edit",
                dataField: "ActivityId",
                cssClass: "ClickkableCell EnquiryNumberUI",
                cellTemplate: "Edit",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 150
            },

            {
                caption: "Delete",
                dataField: "ActivityId",
                cssClass: "ClickkableCell EnquiryNumberUI",
                cellTemplate: "Delete",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 150
            }]
        };
    };
    //#endregion

    //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {
        
        $scope.SalesAdminApprovalList = [];
        $scope.IsEnquiryEdit = false;
        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#ActivityGrid").dxDataGrid("instance");
        dataGrid.refresh();

    };
$scope.LoadActivityGrid();


$scope.LoadSubActivityList = function (roleId) {
        

debugger;
        $rootScope.Throbber.Visible = true;

        var requestData =
            {
                ServicesAction: 'GetAllActivityDetail',
                RoleMasterId: roleId
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            $rootScope.Throbber.Visible = false;
            var resoponsedata = response.data;
            if (response.data.Json !== undefined) {
debugger;
                var subActivity = resoponsedata.Json.ActivityList;
                $scope.PreviousSubActivityList = subActivity;
				$scope.LoadRoleMasterList();
               $scope.RoleWiseStatus.RoleMasterId=resoponsedata.Json.ActivityList[0].RoleMasterId;
				$scope.AddForm();
            }
        });
    };
    //$scope.LoadSubActivityList();



	
	 $scope.LoadRoleMasterList = function () {
        
        var requestData =
            {
                ServicesAction: 'LoadRoleMater'
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data;
            $scope.RoleMasterList = resoponsedata.Json.RoleMasterList;
        });
    }
    $scope.LoadRoleMasterList();



		$scope.RoleWiseStatusDetail = function () {
        debugger;
        $rootScope.Throbber.Visible = true;

        var requestData =
            {
                ServicesAction: 'UpdateRoleWiseStatus',
                ActivityList: $scope.PreviousSubActivityList
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            $rootScope.Throbber.Visible = false;
            var resoponsedata = response.data;
            if (response.data.Json !== undefined) {
				$scope.PreviousSubActivityList=[];
				$scope.RoleWiseStatus.RoleMasterId=0;;
				
				 $rootScope.ValidationErrorAlert(String.format("Record saved successfully"), '', 3000);
$scope.ViewForm();
            }
        });
    };


$scope.SetColorPickerBox = function(id){
debugger;
//var xxx=document.getElementById('#'+id+');


setTimeout(function(){ 


var id = 'colorpickerboxsubActivity'+id;


var div = document.getElementById(id);

div.style.left = '300px';
div.style.top = '400px';


 }, 3000);

}


});


