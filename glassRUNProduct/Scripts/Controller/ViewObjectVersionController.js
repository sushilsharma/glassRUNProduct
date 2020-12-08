angular.module("glassRUNProduct").controller('ViewObjectVersionController', function ($scope, $q, $state, $timeout, $location, $rootScope, $sessionStorage, ViewObjectVersionService) {

    $scope.ViewObjectVersionGrid =
  {

      dataSource: {
          schema: {
              data: "data",
              total: "totalRecords"
          },
          transport: {
              read: function (options) { //You can get the current page, pageSize etc off `e`.
                  
                  var orderby = "";
                  var config = "";
                  var viewObjectVersionDto = "";

                  var VersionNumber = "";
                  var ObjectName = "";

                  var ObjectNameCriteria = "";
                  var VersionNumberCriteria = "";

                  if (options.data.sort) {
                      if (options.data.sort.length > 0) {
                          var sortField = options.data.sort[0].field;
                          if (options.data.sort[0].dir === "asc") {
                              sortOrder = ' asc';
                          } else if (options.data.sort[0].dir === "desc") {
                              sortOrder = ' desc';
                          };
                          orderby = sortField + sortOrder;
                      }
                  }
                  if (options.data && options.data.filter && options.data.filter.filters) {
                      config =
                      {
                          value: options.data.filter.filters[0].value,
                          field: options.data.filter.filters[0].field,
                          operator: options.data.filter.filters[0].operator

                      };

                      if (options.data.filter.filters[0].field === "VersionNumber") {
                          VersionNumber = options.data.filter.filters[0].value;
                          VersionNumberCriteria = options.data.filter.filters[0].operator;
                      }

                      if (options.data.filter.filters[0].field === "ObjectName") {
                          ObjectName = options.data.filter.filters[0].value;
                          ObjectNameCriteria = options.data.filter.filters[0].operator;
                      }

                      console.log("input: ", options.data.filter.filters[0]);
                  } else {
                      where = "";
                  };
                  viewObjectVersionDto =
                      {
                          VersionNumber: VersionNumber,
                          ObjectName: ObjectName,
                          VersionNumberCriteria: VersionNumberCriteria,
                          ObjectNameCriteria: ObjectNameCriteria

                      };
                  var x = JSON.stringify(viewObjectVersionDto);

                  var requestData =
                      {
                          pageIndex: options.data.page - 1,
                          pageSize: options.data.pageSize,
                          orderBy: orderby,
                          viewObjectVersionDto: x

                      };
                  

                  ViewObjectVersionService.LoadObjectVersion(requestData).then(function (response) {
                      

                      $scope.GridData = response.data;

                      options.success(response.data);
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

             { field: "ObjectName", title: "Object Name", type: "string", filterable: { mode: "row", extra: false } },
             { field: "VersionNumber", title: "Version Number", type: "string", filterable: { mode: "row", extra: false } },
      { "template": "<button class=\"k-button\" ng-click=\"ViewObjectVersionEdit(#=ObjectVersionId#)\"><i class='fa fa-pencil'></i></a>", "title": "Edit", "width": "6%" },
      { "template": "<button class=\"k-button\" ng-click=\"ViewObjectVersionDelete(#=ObjectVersionId#)\"><i class='fa fa-trash'></i></a>", "title": "Delete", "width": "6%" }
      ],
  }
    function gridDataBound(e) {

        var grid = e.sender;
        if (grid.dataSource.total() == 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.ViewObjectVersionGrid.dataSource.transport.read($scope.values);
        }
    };





    $rootScope.EditOjectVersionId = 0;
    $scope.ViewObjectVersionEdit = function (objectVersionId) {
        


        $rootScope.EditOjectVersionId = objectVersionId;
        $state.go("ObjectVersion");




    }

    $scope.ViewObjectVersionDelete = function (objectVersionId) {
        
        var requestData =
                                  {
                                      objectVersionId: objectVersionId,

                                  };
        ViewObjectVersionService.DeleteObjectVersion(requestData).then(function (response) {
            

            gridCallBack();

        });
    }




});