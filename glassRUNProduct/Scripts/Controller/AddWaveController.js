angular.module("glassRUNProduct").controller('AddWaveController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    $rootScope.RuleTypeDefault = "Wave";
    $rootScope.IsControlVisible = false;

    LoadActiveVariables($sessionStorage, $state, $rootScope);


    $scope.WaveDefinitionId = 0;
    $scope.addWave = {
        WaveTime: '',
        TruckSizeId: 0

    }


    var requestData =
        {
            ServicesAction: 'GetAllTruckSizeList'

        };
    var jsonobject = {};
    jsonobject.Json = requestData;
    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        
        var resoponsedata = response.data.TruckSize.TruckSizeList;
        $scope.bindTruckSizeList = resoponsedata;
    });


    $scope.ViewAddWaveGrid =
        {

            dataSource: {
                schema: {
                    data: "data",
                    total: "totalRecords"
                },
                transport: {
                    read: function (options) { //You can get the current page, pageSize etc off `e`.
                        
                        $scope.GridData = [];
                        var orderby = "";
                        var config = "";
                        var WaveDateTime = "";


                        var RuleText = "";

                        var WaveDateTimeCriteria = "";
                        var RuleTextCriteria = "";


                        if (options.data && options.data.filter && options.data.filter.filters) {
                            config =
                                {
                                    value: options.data.filter.filters[0].value,
                                    field: options.data.filter.filters[0].field,
                                    operator: options.data.filter.filters[0].operator

                                };

                            //if (options.data.filter.filters[0].field === "TruckType") {
                            //    TruckType = options.data.filter.filters[0].value;
                            //    TruckTypeCriteria = options.data.filter.filters[0].operator;
                            //}
                            
                            if (options.data.filter.filters[0].field === "WaveDateTime") {
                                WaveDateTime = options.data.filter.filters[0].value;
                                WaveDateTimeCriteria = options.data.filter.filters[0].operator;
                            }

                            if (options.data.filter.filters[0].field === "RuleText") {
                                RuleText = options.data.filter.filters[0].value;
                                RuleTextCriteria = options.data.filter.filters[0].operator;
                            }


                        }
                        var requestData =
                            {
                                ServicesAction: 'LoadWaveDefinitionDetails',
                                PageIndex: options.data.page - 1,
                                PageSize: 50,
                                OrderBy: "",
                                WaveDateTime: WaveDateTime,
                                WaveDateTimeCriteria: WaveDateTimeCriteria,
                                RuleText: RuleText,
                                RuleTextCriteria: RuleTextCriteria,
                                UserId: $rootScope.UserId

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
                                totalcount = resoponsedata.Json.WaveDefinitionList[0].TotalCount
                                ListData = resoponsedata.Json.WaveDefinitionList;

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

                        $rootScope.Throbber.Visible = false;


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

                { field: "WaveDateTime", title: "Wave Date Time", type: "string", filterable: false },
                { field: "RuleText", title: "Rule Text", type: "string", filterable: { mode: "row", extra: false } },

                //{ field: "TruckCapacityPalettes", title: "Palettes", type: "string", filterable: { mode: "row", extra: false } },
                //{ field: "TruckCapacityWeight", title: "Weight", type: "string", filterable: { mode: "row", extra: false } },
                { "template": "<button class=\"k-button\" ng-click=\"EditWave(#=WaveDefinitionId#)\"><i class='fa fa-pencil'></i></a>", "title": "Edit", "width": "6%" },
                { "template": "<button class=\"k-button\" ng-click=\"DeleteWave(#=WaveDefinitionId#)\"><i class='fa fa-trash'></i></a>", "title": "Delete", "width": "6%" }
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
            $scope.ViewAddWaveGrid.dataSource.transport.read($scope.values);
        }
    };
    $scope.ClearWave = function () {
        $scope.addWave.TruckSizeId = 0;
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
        $scope.ClearWave();
        gridCallBack();
    }
    $scope.ViewForm();


    $scope.WaveTruckDetailsList = [];
    $scope.AddWaveTruckDetails = function () {
        
        if ($scope.addWave.TruckSizeId !== "" && $scope.addWave.TruckSizeId !== "" && $scope.addWave.TruckSizeId !== 0) {
            var truckNameList = $scope.bindTruckSizeList.filter(function (el) { return el.TruckSizeId === $scope.addWave.TruckSizeId });
            var NewWaveTruckDetailsJson = {
                WaveDefinitionIdGUID: generateGUID(),
                WaveDefinitionDetailsId: 0,
                WaveDefinitionId: $scope.WaveDefinitionId,
                TruckSizeId: $scope.addWave.TruckSizeId,
                TruckSize: truckNameList[0].TruckSize,
                NumbersOfTruck: 1,
                IsActive: true
            }
            if ($scope.WaveTruckDetailsList.length > 0) {
                var waveTruckList = $scope.WaveTruckDetailsList.filter(function (el) { return el.TruckSizeId === $scope.addWave.TruckSizeId });
                if (waveTruckList.length > 0) {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddWavePage_RecordAlreadyExist), 'error', 3000);
                } else {
                    $scope.WaveTruckDetailsList.push(NewWaveTruckDetailsJson);
                    $scope.ClearWave();
                }
            } else {
                $scope.WaveTruckDetailsList.push(NewWaveTruckDetailsJson);
                $scope.ClearWave();
            }



        } else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddWavePage_PleaseSelectTrucksize), 'error', 3000);
        }

    }






    $scope.RemoveNewWave = function (WaveDefinitionDetailsId, waveDefinitionIdGUID) {
        
        if (WaveDefinitionDetailsId === 0) {
            $scope.WaveTruckDetailsList = $scope.WaveTruckDetailsList.filter(function (el) { return el.WaveDefinitionIdGUID !== waveDefinitionIdGUID; });
        } else {
            var waveDefinitionInfo = $scope.WaveTruckDetailsList.filter(function (el) { return el.WaveDefinitionDetailsId === WaveDefinitionDetailsId; });
            if (waveDefinitionInfo.length > 0) {
                waveDefinitionInfo[0].IsActive = false;
            }
        }
    }

    function generateGUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };


    $scope.SaveWave = function () {
        
        if ($scope.addWave.WaveTime != "") {
            if ($scope.WaveTruckDetailsList.length > 0) {
                if ($scope.FinalValue.FinalOutputValue != "") {

                    $scope.FinalRuleString = $rootScope.RuleStringGenerator();

                    var waveDefinition = {

                        WaveDefinitionId: $scope.WaveDefinitionId,
                        WaveDateTime: $scope.addWave.WaveTime,
                        RuleText: $scope.FinalRuleString,
                        RuleType: 9,
                        CreatedBy: $rootScope.UserId,
                        WaveDefinitionDetailList: $scope.WaveTruckDetailsList,
                        IsActive: true
                    }

                    var waveDefinitionList = [];
                    waveDefinitionList.push(waveDefinition);

                    var requestData =
                        {
                            ServicesAction: 'SaveWaveDefination',
                            WaveDefinitionList: waveDefinitionList
                        };

                    var consolidateApiParamater =
                        {
                            Json: requestData,
                        };
                    
                    GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                        
                        if ($scope.WaveDefinitionId != 0) {

                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddWaveUI_Recordupdatedsuccessfully), '', 3000);
                        }
                        else {
                            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddWaveUI_Recordsavesuccessfully), '', 3000);
                        }
                        $scope.ClearWave();
                        $scope.ClearRule();
                        $scope.ViewForm();
                    });
                }
                else {
                    $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddWaveUI_AllFieldsMandatory), '', 3000);
                }
            }
            else {
                $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddWaveUI_SelectTruckSize), '', 3000);
            }
        }
        else {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddWaveUI_SelectTime), '', 3000);
        }
    }


    $scope.EditWave = function (id) {
        
        var requestData =
            {
                ServicesAction: 'GetWaveDetailsById',
                WaveDefinitionId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data.Json.WaveDefinitionList;
            var RuleList = $rootScope.RuleTextValue(resoponsedata[0]);
            if (RuleList.length > 0) {

                $rootScope.EditRuleStringGenerator(RuleList);

            }
            $scope.WaveDefinitionId = id;
            $scope.addWave.WaveTime = resoponsedata[0].WaveDateTime;
            if ($scope.addWave.WaveTime !== "") {
                var hours = $scope.addWave.WaveTime.split(":");
                if (parseInt(hours[0]) <= 9) {
                    hours[0] = "0" + hours[0];
                    $scope.addWave.WaveTime = hours[0] + ":" + hours[1];
                }
            }
            $scope.WaveTruckDetailsList = resoponsedata[0].WaveDefinitionDetailList;

            $scope.AddForm();
        });
    }




    $scope.DeleteWave = function (id) {
        var requestData =
            {
                ServicesAction: 'DeleteWave',
                WaveDefinitionId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_AddWaveUI_Recorddeletedsuccessfully), '', 3000);
            gridCallBack();
        });
    }


    $scope.ClearRule = function () {
        
        $scope.ClearWave();
        $rootScope.ClearRule();
        $scope.WaveTruckDetailsList = [];
        $scope.addWave.WaveTime = "";
    }


});