angular.module("glassRUNProduct").controller('PlateNumberAllocationController', function ($scope, $rootScope, $location, $sessionStorage, $state, pluginsService, GrRequestService) {
    

    LoadActiveVariables($sessionStorage, $state, $rootScope);


    $scope.PlateNumberAllocationGrid =
  {

      dataSource: {
          schema: {
              data: "data",
              total: "totalRecords"
          },
          transport: {
              read: function (options) {

                  var SalesOrderNumber = "";
                  var SalesOrderNumberCriteria = "";
                  var SoldTo = "";
                  var SoldToCriteria = "";
                  var ShipTo = "";
                  var ShipToCriteria = "";
                  var TruckSize = "";
                  var TruckSizeCriteria = "";
                  if (options.data && options.data.filter && options.data.filter.filters) {
                      config =
                      {
                          value: options.data.filter.filters[0].value,
                          field: options.data.filter.filters[0].field,
                          operator: options.data.filter.filters[0].operator

                      };

                      if (options.data.filter.filters[0].field === "SalesOrderNumber") {
                          SalesOrderNumber = options.data.filter.filters[0].value;
                          SalesOrderNumberCriteria = options.data.filter.filters[0].operator;
                      }
                      if (options.data.filter.filters[0].field === "SoldTo") {
                          SoldTo = options.data.filter.filters[0].value;
                          SoldToCriteria = options.data.filter.filters[0].operator;
                      }
                      if (options.data.filter.filters[0].field === "ShipTo") {
                          ShipTo = options.data.filter.filters[0].value;
                          ShipToCriteria = options.data.filter.filters[0].operator;
                      }
                      if (options.data.filter.filters[0].field === "TruckSize") {
                          TruckSize = options.data.filter.filters[0].value;
                          TruckSizeCriteria = options.data.filter.filters[0].operator;
                      }
                  }

                  
                  var requestData =
                       {
                           ServicesAction: 'LoadSoNumberWiseDetails',
                           PageIndex: options.data.page - 1,
                           PageSize: options.data.pageSize,
                           OrderBy: "",
                           SalesOrderNumber: SalesOrderNumber,
                           SalesOrderNumberCriteria: SalesOrderNumberCriteria,
                           SoldTo: SoldTo,
                           SoldToCriteria: SoldToCriteria,
                           ShipTo: ShipTo,
                           ShipToCriteria: ShipToCriteria,
                           TruckSize: TruckSize,
                           TruckSizeCriteria: TruckSizeCriteria

                       };

                  // var stringfyjson = JSON.stringify(requestData);
                  var consolidateApiParamater =
                      {
                          Json: requestData

                      };

                  GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                      


                      var totalcount = null;
                      var ListData = null;
                      var resoponsedata = response.data;
                      if (resoponsedata !== null) {
                          
                          if (resoponsedata.Json.OrderList.length !== undefined) {
                              if (resoponsedata.Json.OrderList.length > 0) {
                                  angular.forEach(resoponsedata.Json.OrderList, function (item) {
                                      
                                      if (item.PickingDate !== undefined) {
                                          var tempdate = item.PickingDate.split('T');
                                          if (tempdate.length > 1) {
                                              
                                              var date = tempdate[0].split('-');
                                              var time = tempdate[1].split(':');
                                              var sec = time[2].split('.');
                                              date = date[2] + '/' + date[1] + '/' + date[0] + " " + time[0] + ":" + time[1];
                                              item.PickingDate = date;
                                          }
                                      }

                                  });
                                  totalcount = resoponsedata.Json.OrderList[0].TotalCount
                              }

                          } else {
                              if (resoponsedata.Json.OrderList.PickingDate !== undefined) {
                                  var tempdate = resoponsedata.Json.OrderList.PickingDate.split('T');
                                  if (tempdate !== null && tempdate !== undefined) {
                                      
                                      var date = tempdate[0].split('-');
                                      var time = tempdate[1].split(':');
                                      var sec = time[2].split('.');
                                      date = date[2] + '/' + date[1] + '/' + date[0] + " " + time[0] + ":" + time[1];
                                      tempdate.PickingDate = date;
                                  }
                              }

                              totalcount = resoponsedata.Json.OrderList.TotalCount;
                          }

                          ListData = resoponsedata.Json.OrderList;
                      }
                      var inquiryList = {
                          data: ListData,
                          totalRecords: totalcount
                      }
                      $scope.GridData = inquiryList;
                      options.success(inquiryList);
                      $scope.values = options;

                  });




              }
          },
          pageSize: 50,
          serverPaging: true,
          serverSorting: true,
          serverFiltering: true
      },
      filterable:
      {
          mode: "row"
      },
      selectable: "row",
      pageable:
      {
          pageSizes: [10, 50, 100]
      },
      sortable: true,
      groupable: true,
      columnMenu: true,
      mobile: true,
      dataBound: gridDataBound,
      columns: [
           {
               template: "<input type='checkbox' class='checkbox' ng-model=\"dataItem.selected\" ng-click='onCheckBoxClick($event, dataItem)' />",
               title: "<input type='checkbox' title='Select all'  ng-click='toggleSelectAll($event)' />",
               width: "3%"
           },

           { field: "SalesOrderNumber", title: "SO #", template: '<a ng-click=\"LoadOrderView(\'#=SalesOrderNumber#\')\" class="graybgfont">#:SalesOrderNumber#</a>', type: "string", filterable: { mode: "row" }, width: "8%"  },
           { field: "LoadNumber", title: "Load No.", type: "string", filterable: { mode: "row" } },
           { field: "SoldTo", title: "SoldTo", type: "string", filterable: { mode: "row", extra: false } },
           { field: "DeliveryLocation", title: "ShipTo", type: "string", filterable: { mode: "row", extra: false } },
           //{ field: "TransportOperator", title: "Transport Operator", type: "string", filterable: { mode: "row", extra: false } },
           { field: "TruckCapacityWeight", template: '#:TruckSizeData#', title: "TruckSize", type: "string", filterable: { mode: "row", extra: false } },
           { field: "PickingDate", title: "Pick up date", type: "string", filterable: { mode: "row", extra: false } },
           { template: "<input type=\"text\" ng-model=\"dataItem.PlateNumber\" />", "title": "Plate Number" },
           { field: "AssociatedOrder", "title": "Gratis #", type: "string", filterable: { mode: "row", extra: false } },
           //{ "template": "<a class=\"greenbgfont approvebtn\" ng-click=\"ClickToUpdateStatusAndPlateNumber('#=SalesOrderNumber#',dataItem.plateNumber)\"> Save Order </a>", "title": "Build Load", "width": "15%" },
           { title: "Save Order", template: "#if(CurrentState==4) {#<a class=\"greenbgfont approvebtn\" ng-click=\"ClickToUpdateStatusAndPlateNumber('#=SalesOrderNumber#',dataItem.PlateNumber,#=CurrentState#)\"> Save Order </a>#} else if(CurrentState==5) {#<a class=\"greenbgfont approvebtn\" ng-click=\"ClickToUpdateStatusAndPlateNumber('#=SalesOrderNumber#',dataItem.PlateNumber,#=CurrentState#)\">  Update Order</a>#}#", type: "string", filterable: { mode: "row", extra: false, cell: { enabled: false } }, width: "8%" },




      ],
  }

    $scope.toggleSelectAll = function (ev) {
        
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();


        items.forEach(function (item) {
            var data = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === item.SalesOrderNumber; });
            if (data.length > 0) {
                data[0].selected = ev.target.checked;

            }
            item.selected = ev.target.checked;
        });
    };

    $scope.LoadOrderView = function (salesOrderNumber) {
        
        $rootScope.SalesOrderNumber = salesOrderNumber;

        $state.go("CreateInquiryForSLM");
    }


    $scope.onCheckBoxClick = function (ev, item) {
        
        var data = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === item.SalesOrderNumber; });
        if (data.length > 0) {
            data[0].selected = ev.target.checked;

        }
        item.selected = ev.target.checked;
    }

    function gridDataBound(e) {

        var grid = e.sender;
        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.PlateNumberAllocationGrid.dataSource.transport.read($scope.values);
        }
    };



    $scope.ClickToUpdateStatusAndPlateNumber = function (soNumber, plateNumber, currentState) {
        
        var IsCheckPlateNumber = true;
        var plateDetails = $scope.GridData.data.filter(function (el) { return el.SalesOrderNumber === soNumber; });
        //if (plateNumber != undefined) {
        var gridDataArray = $('#PlateNumberAllocationGrid').data('kendoGrid')._data;
        var columnDataVector = [];
        var columnName = 'PlateNumber';
        for (var index = 0; index < gridDataArray.length; index++) {
            var columnValue = gridDataArray[index][columnName];
            var plateNumberGrid = plateDetails.filter(function (el) { return el.SalesOrderNumber === gridDataArray[index]["SalesOrderNumber"]; });
            if (plateNumberGrid.length > 0) {
                plateNumberGrid[0].PlateNumber = columnValue;
                plateNumberGrid[0].LocationType = 2;
                if (columnValue === "" || columnValue === null) {
                    IsCheckPlateNumber = false;
                }
            }
        };

        if (IsCheckPlateNumber === true) {
            var requestData =
                        {
                            ServicesAction: 'UpdatePickingDate',
                            //SalesOrderNumber: soNumber,
                            //PlateNumber: plateNumber,
                            //LocationType: 2,
                            PlateDetailsList: plateDetails
                        };
            //var stringfyjson = JSON.stringify(requestData);
            var jsonobject = {};
            jsonobject.Json = requestData;

            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                gridCallBack();
            });

        }
        else {
            $rootScope.ValidationErrorAlert('Plate number cannot be blank.', 'error', 3000);
        }
    }


    $scope.GetAllRecordUpdate = function () {
        
        var IsCheckAllPlateNumber = true;
        var plateDetails = $scope.GridData.data.filter(function (el) { return el.selected === true; });
        if (plateDetails.length > 0) {
            var gridDataArray = $('#PlateNumberAllocationGrid').data('kendoGrid')._data;
            var columnDataVector = [];
            var columnName = 'PlateNumber';
            for (var index = 0; index < gridDataArray.length; index++) {
                var columnValue = gridDataArray[index][columnName];
                var plateNumberGrid = plateDetails.filter(function (el) { return el.SalesOrderNumber === gridDataArray[index]["SalesOrderNumber"]; });
                if (plateNumberGrid.length > 0) {
                    plateNumberGrid[0].PlateNumber = columnValue;
                    plateNumberGrid[0].LocationType = 2;
                    if (columnValue === "" || columnValue === null) {
                        IsCheckAllPlateNumber = false;
                    }
                }
            };
            if (IsCheckAllPlateNumber) {
                var requestData =
                               {
                                   ServicesAction: 'UpdatePickingDate',
                                   //SalesOrderNumber: soNumber,
                                   //PlateNumber: plateNumber,
                                   //LocationType: 2,
                                   PlateDetailsList: plateDetails
                               };
                // var stringfyjson = JSON.stringify(requestData);
                var jsonobject = {};
                jsonobject.Json = requestData;

                GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    //$rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PlateNumberAllocation_SavedData), '', 3000);

                    gridCallBack();
                });

            }
            else {
               // $rootScope.ValidationErrorAlert('Plate number cannot be blank.', 'error', 3000);
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PlateNumberAllocation_PlateNumberCannotBlank), '', 3000);

            }
        }
        else {
           // $rootScope.ValidationErrorAlert('Please select sonumber.', 'error', 3000);
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_PlateNumberAllocation_SelectSONumber), '', 3000);

        }
    }






    $scope.ClearControls = function () {
        $scope.plateNumber = "";
    }


});