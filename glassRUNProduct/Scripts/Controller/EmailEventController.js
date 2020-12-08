angular.module("glassRUNProduct").controller('EmailEventController', function ($scope, $rootScope, $sessionStorage, $state, $location, $ionicModal, pluginsService, GrRequestService) {

    LoadActiveVariables($sessionStorage, $state, $rootScope);
    $scope.EmailEventId = 0;

    var where = "";
    $scope.EmailEventmainGridOptions =
        {
            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport:
                {
                    read: function (options) {//You can get the current page, pageSize etc off `e`.
                        var orderby = "";
                        var config = "";
                        var EventCode = "";
                        var EventCodeCriteria = "";
                        var EventName = "";
                        var EventNameCriteria = "";

                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator,
                                };

                            if (options.data.filter.filters[0].field === "EventName") {
                                EventName = options.data.filter.filters[0].value;
                                EventNameCriteria = options.data.filter.filters[0].operator;
                            }

                            if (options.data.filter.filters[0].field === "EventCode") {
                                EventCode = options.data.filter.filters[0].value;
                                EventCodeCriteria = options.data.filter.filters[0].operator;
                            }
                        }

                        var requestData =
                            {
                                ServicesAction: 'LoadEmailEvent',
                                PageIndex: options.data.page - 1,
                                PageSize: options.data.pageSize,
                                OrderBy: "",
                                EventCode: EventCode,
                                EventCodeCriteria: EventCodeCriteria,
                                EventName: EventName,
                                EventNameCriteria: EventNameCriteria
                            };

                        var consolidateApiParamater =
                            {
                                Json: requestData,
                            };
                        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                            
                            var totalcount = null;
                            var ListData = null;
                            var resoponsedata = response.data;
                            if (resoponsedata.Json !== undefined) {
                                totalcount = resoponsedata.Json.EmailEventList[0].TotalCount
                                ListData = resoponsedata.Json.EmailEventList;

                                var inquiryList = {
                                    data: ListData,
                                    totalRecords: totalcount
                                }
                                $scope.GridData = inquiryList;
                                options.success(inquiryList);
                                $scope.values = options;
                            }
                            else {
                                var inquiryList = {
                                    data: [],
                                    totalRecords: 0
                                }
                                options.success(inquiryList);
                                $scope.values = options;
                            }
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
            columns: [
                { field: "EventName", title: "Event Name", type: "string", filterable: { mode: "row", extra: false } },
                { field: "EventCode", title: "Event Code", type: "string", filterable: { mode: "row", extra: false } },
                { field: "Description", title: "Description", type: "string", filterable: { mode: "row", extra: false } },
                { "template": "<button class=\"k-button\" ng-click=\"EditEmailEvent(#=EmailEventId#)\"><i class='fa fa-pencil'></i></a>", "title": "Edit", "width": "6%" },
                { "template": "<button class=\"k-button\" ng-click=\"DeleteEmailEvent(#=EmailEventId#)\"><i class='fa fa-trash'></i></a>", "title": "Delete", "width": "6%" }
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
            $scope.EmailEventmainGridOptions.dataSource.transport.read($scope.values);
        }
    };

    $scope.EmailEventJSON = {
        EventName: '',
        EventCode: '',
        Description: ''   
    }

    $scope.Clear = function () {
        $scope.EmailEventId = 0;        
        $scope.EmailEventJSON.EventName = "";
        $scope.EmailEventJSON.EventCode = "";
        $scope.EmailEventJSON.Description = "";       
    }

    $scope.SaveEmailEvent = function () {
        
        var emailevent = {
            EmailEventId: $scope.EmailEventId,
            EventName: $scope.EmailEventJSON.EventName,
            EventCode: $scope.EmailEventJSON.EventCode,
            Description: $scope.EmailEventJSON.Description,            
            CreatedBy: $rootScope.UserId,
            IsActive: true
        }

        var emailEventList = [];
        emailEventList.push(emailevent);

        var requestData =
            {
                ServicesAction: 'SaveEmailEvent',
                EmailEventList: emailEventList
            };

        var consolidateApiParamater =
            {
                Json: requestData,
            };

        
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            if ($scope.EmailEventId != 0) {
                $rootScope.ValidationErrorAlert('Record updated successfully', '', 3000);
            }
            else {
                $rootScope.ValidationErrorAlert('Record saved successfully', '', 3000);
            }
            $scope.Clear();
            $scope.ViewForm();
            //gridCallBack();
        });
    }

    $scope.AddForm = function () {
        
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
    }

    $scope.ViewForm = function () {
        
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.Clear();
        gridCallBack();
    }

    $scope.ViewForm();
    
    $scope.EditEmailEvent = function (id) {
        
        var requestData =
            {
                ServicesAction: 'GetEmailEventDetailsById',
                EmailEventId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data.Json.EmailEventList;
            $scope.EmailEventId = id;
            $scope.EmailEventJSON.EventName = resoponsedata[0].EventName;
            $scope.EmailEventJSON.EventCode = resoponsedata[0].EventCode;
            $scope.EmailEventJSON.Description = resoponsedata[0].Description;       
            $scope.AddForm();
        });
    }

    $scope.DeleteEmailEvent = function (id) {
        var requestData =
            {
                ServicesAction: 'DeleteEmailEvent',
                EmailEventId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            gridCallBack();
        });
    }
});

