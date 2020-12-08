angular.module("glassRUNProduct").controller('ValidateLicenseController', function ($scope, $rootScope, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, GrRequestService) {

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    var sessionObjects = getSessionobjects($sessionStorage);

    var gridCallBack = function () {
        if ($scope.values !== undefined) {
            $scope.ViewLicenseInfoGrid.dataSource.transport.read($scope.values);

        }
    };

    $rootScope.GridRecallForStatus = function () {
        
        $rootScope.Throbber.Visible = true;

        ChangeGridHeaderTitleByLanguage($scope.ViewLicenseInfoGrid, "ViewLicenseInfoGrid", $rootScope.resData);

        gridCallBack();


    }

    $scope.ViewLicenseInfoGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) {

                        var requestData =
                            {
                                ServicesAction: 'GetLicenseInfoList',
                                UserTypeCode: sessionObjects.RoleName,
                            };

                        var jsonobject = {};
                        jsonobject.Json = requestData;
                        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                            
                            var resoponsedata = response.data.LicenseInfo.LicenseInfoList;

                            var requestValidateLicense =
                       {
                           ServicesAction: 'GetLicenseInfoDetailList',
                           LicenseInfoList: resoponsedata,
                           UserTypeCode: sessionObjects.RoleName,
                           PageIndex: options.data.page - 1,
                           PageSize: options.data.pageSize,
                           OrderBy: "",
                       };
                            var jsonobjectValidateLicense = {};
                            jsonobjectValidateLicense.Json = requestValidateLicense;

                            GrRequestService.ProcessRequest(jsonobjectValidateLicense).then(function (response) {

                                var totalcount = null;
                                $scope.RuleListData = [];
                                var resoponsedata = response.data;
                                if (resoponsedata !== null) {
                                    if (resoponsedata.LicenseInfoDetailList !== undefined) {
                                        if (resoponsedata.LicenseInfoDetailList.length !== undefined) {
                                            if (resoponsedata.LicenseInfoDetailList.length > 0) {
                                                totalcount = resoponsedata.LicenseInfoDetailList[0].TotalCount
                                            }
                                        } else {
                                            totalcount = resoponsedata.LicenseInfoDetailList.TotalCount;
                                        }
                                        $scope.RuleListData = resoponsedata.LicenseInfoDetailList;

                                    } else {
                                        $scope.RuleListData = [];
                                        totalcount = 0;
                                    }
                                }
                                var ruleList = {
                                    data: $scope.RuleListData,
                                    totalRecords: totalcount
                                }
                                console.log("grid load");
                                $scope.GridData = ruleList;
                                options.success(ruleList);
                                $scope.values = options;
                                $rootScope.Throbber.Visible = false;
                            });

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
            groupable: false,
            scrollable: true,
            columnMenu: true,
            mobile: true,
            dataBound: gridDataBound,
            columns: [

                { field: "CustomerCode", title: "Customer Code", type: "string", filterable: false },
                { field: "ProductCode", title: "Product Code", type: "string", filterable: false },
                { field: "UserTypeCode", title: "UserType Code", type: "string", filterable: false },
                { field: "NoOfUsers", title: "NoOfUsers", type: "string", filterable: false },
                { field: "FromDate", title: "FromDate", type: "string", filterable: false },
                { field: "ToDate", title: "ToDate", type: "string", filterable: false },
                { field: "Concurrent", title: "License Mode", type: "string", filterable: false },
                { field: "LicenseType", title: "LicenseType", type: "string", filterable: false },
                { field: "IPAddress", title: "IPAddress", type: "string", filterable: false },
            ],
        }









    function gridDataBound(e) {


        var grid = e.sender;

        setTimeout(function () {
            pluginsService.init();
        }, 200);


        if (grid.dataSource.total() === 0) {
            var colCount = grid.columns.length;
            $(e.sender.wrapper)
                .find('tbody')
                .append('<div style="height:52px !important; overflow:hidden !important;"><table><tr><td colspan="' + colCount + '" class="no-data">No records to display</td></tr><table></div>');
        }
    };


    $scope.RefreshGrid = function () {

        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        }
        gridCallBack();
    }
});