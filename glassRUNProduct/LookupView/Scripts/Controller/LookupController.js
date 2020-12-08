angular.module("glassRUNProduct").controller('LookupController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {
    $scope.title = "Lookup";

LoadActiveVariables($sessionStorage, $state, $rootScope);
if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

 $scope.PageUrlName = $location.absUrl().split('#/')[1];
    var page = $location.absUrl().split('#/')[1];
    $scope.UserDetailVisible = false;
    $scope.SalesAdminApprovalList = [];
    $scope.Action = "Add";
	$scope.EditMode = false;
    $scope.LookupId = 0;


$scope.LookupJSON = {
        Category: "",
        Name: "",
        NameinArabic: "",
        IsActive: false,
        

    }


$scope.LoadLookupCategoryList = function () {
        //Load data after selection of object and role

        var requestData =
            {
                ServicesAction: 'LoadAllLookupCategory'
               

            };


        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            var resoponsedata = response.data;
            if (resoponsedata !== null) {
                if (resoponsedata.Json !== undefined) {
                    $scope.LookTypeDataList = resoponsedata.Json.LookUpCategoryList;
                }

            }

        });
    };
    $scope.LoadLookupCategoryList();





	$scope.LoadLookupGrid = function () {


        var LookupGridData = new DevExpress.data.CustomStore({

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

                var Name = "";
                var LookupNameCriteria = "";

                var Code = "";
                var LookupCodeCriteria = "";

                var LookupType = "";
                var LookupTypeCriteria = "";

                var Description = "";
                var DescriptionCriteria = "";

				var SortOrder = "";
                var SortOrderCriteria = "";

				var IsActive = "";
                var IsActiveCriteria = "";



                if (filterOptions != "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "Name") {
                            LookupNameCriteria = columnsList[1];
                            Name = columnsList[2];
                        }
                        if (columnsList[0] === "Code") {
                            LookupCodeCriteria = columnsList[1];
                            Code = columnsList[2];
                        }
                        if (columnsList[0] === "LookupCategory") {
                            LookupTypeCriteria = columnsList[1];
                            LookupType = columnsList[2];
                        }
                        if (columnsList[0] === "ControlName") {
                            DescriptionCriteria = columnsList[1];
                            Description = columnsList[2];
                        }
						if (columnsList[0] === "ControlName") {
                            SortOrderCriteria = columnsList[1];
                            SortOrder = columnsList[2];
                        }
						if (columnsList[0] === "ControlName") {
                            IsActiveCriteria = columnsList[1];
                            IsActive = columnsList[2];
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
                        ServicesAction: 'LookupGridLoadPagging',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: OrderBy,
                        OrderByCriteria: OrderByCriteria,
                        FinancerId: $rootScope.CompanyId,
                        IsExportToExcel: '0',
                        RoleMasterId: $rootScope.RoleId,
                        LoginId: $rootScope.UserId,
                        CultureId: $rootScope.CultureId,
                        Name: Name,
                        LookupNameCriteria: LookupNameCriteria,
                        LookupType: LookupType,
                        LookupTypeCriteria: LookupTypeCriteria,
                        Code: Code,
                        LookupCodeCriteria: LookupCodeCriteria,
                        Description: Description,
                        DescriptionCriteria: DescriptionCriteria,
						SortOrder: SortOrder,
                        SortOrderCriteria: SortOrderCriteria,
                        IsActive: IsActive,
                        IsActiveCriteria: IsActiveCriteria,

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
                            if (resoponsedata.Json.LookupList.length !== undefined) {
                                if (resoponsedata.Json.LookupList.length > 0) {
                                    totalcount = resoponsedata.Json.LookupList[0].TotalCount;
                                }

                            } else {
                                totalcount = resoponsedata.Json.LookupList.TotalCount;
                            }

                            ListData = resoponsedata.Json.LookupList;
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
        $scope.LookupGrid = {
            dataSource: {
                store: LookupGridData,
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
            keyExpr: "Name",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {



                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.LookupEdit(data.LookUpId);

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
				caption: $rootScope.resData.res_Lookup_LookupCategory,
                dataField: "LookupCategory",
                alignment: "left",
            }, {
				caption: $rootScope.resData.res_Lookup_Name,
                dataField: "Name",
                alignment: "left",
            }, {
				caption: $rootScope.resData.res_Lookup_Code,
                dataField: "Code",
                alignment: "left",
            },
            {
				caption: $rootScope.resData.res_Lookup_Description,
                dataField: "Description",
                alignment: "left",
            },
            {
				caption: $rootScope.resData.res_Lookup_IsActive,
                dataField: "IsActive",
                alignment: "left",
            }, 


            {
                caption: "Edit",
                dataField: "LookupId",
                cssClass: "ClickkableCell EnquiryNumberUI",
                cellTemplate: "Edit",
                alignment: "left",
                allowFiltering: false,
                allowSorting: false,
                width: 150
            },

            //{
            //    caption: "Delete",
            //    dataField: "LookupId",
            //    cssClass: "ClickkableCell EnquiryNumberUI",
            //    cellTemplate: "Delete",
            //    alignment: "left",
            //    allowFiltering: false,
            //    allowSorting: false,
            //    width: 150
            //}
			],
        };
    }

	

    $scope.Lookupvalidatefield = function (id, type) {
        return CheckControlValue(id, type);
    };

$scope.LoadLookupGrid();
	 //#region Refresh DataGrid 
    $scope.RefreshDataGrid = function () {

        $scope.SalesAdminApprovalList = [];
        $scope.IsEnquiryEdit = false;
        $scope.HeaderCheckboxControl = false;
        $scope.CellCheckboxControl = false;
        $scope.HeaderCheckBoxAction = false;
        var dataGrid = $("#LookupGrid").dxDataGrid("instance");
        dataGrid.refresh();

    }
	//$scope.RefreshDataGrid();
   //Function to save Lookup records
   $scope.LookupSave = function () {
       debugger;
   
       // unnecessary istrue variable use for Condition.
   
       if ($scope.LookupJSON.Category === '' || $scope.LookupJSON.Category === undefined || $scope.LookupJSON.Category === null) {
           $rootScope.ValidationErrorAlert('Please Select Lookup Type');
           return;
       }
   
       if ($scope.LookupJSON.Name === '' || $scope.LookupJSON.Name === undefined || $scope.LookupJSON.Name === null) {
           $rootScope.ValidationErrorAlert('Please Enter Lookup Name');
           return;
       }
       //if ($scope.Code === '' || $scope.Code === undefined || $scope.Code === null) {
       //    $rootScope.toggleModelAlert('Please Enter Lookup Code');
       //    return;
       //}
       var istrue = true;
       if (istrue === true) {
           var LookupData = {
               LookupId: $scope.LookupId,
               Name: $scope.LookupJSON.Name,
               Code: $scope.LookupJSON.Code,
               LookupCategory: $scope.LookupJSON.Category,
               Description: $scope.LookupJSON.Description,               
               IsActive: $scope.LookupJSON.IsActive,
               ResourceKey: "",
               Criteria: "",
               Createdby: 1
           };
		
            
        

			 var requestData =
            {
                ServicesAction: "SaveLookup",
                LookupCategoryList: LookupData
            };

			var jsonobject = {};
			jsonobject.Json = requestData;
           GrRequestService.ProcessRequest(jsonobject).then(function (response) {
               debugger;
               var Lookupdata = response.data;
   
               
                   if ($scope.LookupId === 0) {
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

    function formatDate(dateVal) {
        var newDate = new Date(dateVal);

        var sMonth = padValue(newDate.getMonth() + 1);
        var sDay = padValue(newDate.getDate());
        var sYear = newDate.getFullYear();
        var sHour = newDate.getHours();
        var sMinute = padValue(newDate.getMinutes());
        var sAMPM = "AM";

        var iHourCheck = parseInt(sHour);

        if (iHourCheck > 12) {
            sAMPM = "PM";
            sHour = iHourCheck - 12;
        }
        else if (iHourCheck === 0) {
            sHour = "12";
        }

        sHour = padValue(sHour);

        return sMonth + "/" + sDay + "/" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
    }

    function padValue(value) {
        return (value < 10) ? "0" + value : value;
    }

    //Function to edit Lookup records
  $scope.LookupEdit = function (id) {
    
debugger;
        $scope.AddForm();

        $scope.EditMode = true;

        var requestData =
        {
            ServicesAction: 'GetLookupById',
            LookupId: id
        };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {

            if (response.data.Json != undefined) {
                var responsedata = response.data.Json.LookupList[0];
                $scope.LookupId = responsedata.LookUpId;
                $scope.LookupJSON.Name = responsedata.Name;
                $scope.LookupJSON.Code = responsedata.Code;
                $scope.LookupJSON.Category = responsedata.LookupCategory;
                $scope.LookupJSON.Description = responsedata.Description;
				if(responsedata.IsActive)
				{
					$scope.LookupJSON.IsActive=true;
				}
				else
				{
				$scope.LookupJSON.IsActive=false;
				}
                
                
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

    //FormComponents.init();

//   $scope.GetAllLookupType = function () {
//       //TODO call remote service to delete item....
//       var jsonobject = {};
//       jsonobject.LookupID = 0;
//       LookupService.GetAllLookupType(jsonobject).then(function (response) {
//           debugger;
//           var Lookupdata = response.data;
//           $scope.LookTypeDataList = Lookupdata;
//           console.log($scope.LookTypeDataList);
//       });
//   };
//   $scope.GetAllLookupType();


 $scope.ClearControls = function () {
        $scope.LookupJSON = {
        Category: "",
        Name: "",
        NameinArabic: "",
        IsActive: false,        

    }
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