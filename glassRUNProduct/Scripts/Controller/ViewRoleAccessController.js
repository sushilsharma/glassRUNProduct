angular.module("glassRUNProduct").controller('ViewRoleAccessController', function ($scope, $q, $state, $timeout, $location, $rootScope, $sessionStorage, ViewRoleAccessService) {
    $scope.ViewRoleAccessGrid =
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
                   var viewRoleAccessDto = "";

                   var RoleName = "";
                   var Description = "";

                   var RoleNameCriteria = "";
                   var DescriptionCriteria = "";

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

                       if (options.data.filter.filters[0].field === "RoleName") {
                           RoleName = options.data.filter.filters[0].value;
                           RoleNameCriteria = options.data.filter.filters[0].operator;
                       }

                       if (options.data.filter.filters[0].field === "Description") {
                           Description = options.data.filter.filters[0].value;
                           DescriptionCriteria = options.data.filter.filters[0].operator;
                       }

                       console.log("input: ", options.data.filter.filters[0]);
                   } else {
                       where = "";
                   };
                   viewRoleAccessDto =
                       {
                           RoleName: RoleName,
                           Description: Description,
                           RoleNameCriteria: RoleNameCriteria,
                           DescriptionCriteria: DescriptionCriteria

                       };
                   var x = JSON.stringify(viewRoleAccessDto);

                   var requestData =
                       {
                           pageIndex: options.data.page - 1,
                           pageSize: options.data.pageSize,
                           orderBy: orderby,
                           viewRoleAccessDto: x

                       };
                   

                   ViewRoleAccessService.LoadRoleDetails(requestData).then(function (response) {
                       

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

              { field: "RoleName", title: "RoleName", type: "string", filterable: { mode: "row", extra: false } },
              { field: "Description", title: "Description", type: "string", filterable: { mode: "row", extra: false } },
       { "template": "<button class=\"k-button\" ng-click=\"ViewRoleAccessEdit(#=RoleMasterId#)\"><i class='fa fa-pencil'></i></a>", "title": "Edit", "width": "6%" },
       { "template": "<button class=\"k-button\" ng-click=\"ViewRoleAccessDelete(#=RoleMasterId#)\"><i class='fa fa-trash'></i></a>", "title": "Delete", "width": "6%" }
       ],
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
            $scope.ViewRoleAccessGrid.dataSource.transport.read($scope.values);
        }
    };


    $rootScope.EditRoleMasterId = 0;
    $scope.ViewRoleAccessEdit = function (roleMasterId) {
        


        $rootScope.EditRoleMasterId = roleMasterId;
        $state.go("AddRoleAccess");




    }

    $scope.ViewRoleAccessDelete = function (roleId) {
        
        var requestData =
                                  {
                                      roleMasterId: roleId,

                                  };
        ViewRoleAccessService.DeleteRoleMasterById(requestData).then(function (response) {
            

            gridCallBack();

        });
    }
});
