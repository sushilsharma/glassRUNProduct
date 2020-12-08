angular.module("glassRUNProduct").controller('SettingMasterController', function ($scope, $q, $state, $timeout, $ionicModal, $location, pluginsService, $rootScope, $sessionStorage, GrRequestService) {
    // #region Session
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }
    // #endregion
    $scope.enabelEdit = false;
    $scope.SettingMasterId = 0;
    $scope.SelectedId_SettingGrid = 0;
    $rootScope.res_PageHeaderTitle = $rootScope.resData.res_SettingMaster_PageHeading;
    $scope.pageNameDisbale = false;
    $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = false;
        } else {
            $rootScope.Throbber = {
                Visible: false
            };
        }
    };
    $scope.LoadThrobberForPage();
    $scope.PossibleValuesList = [];
    $scope.SelectedSettingList = [];
    $scope.SettingMasterList = [];
    $scope.ControlType = '';
    pluginsService.init();
    $scope.SettingMasterJSON = {
        SettingMasterId: 0,
        PageId: 0,
        SettingParameter: '',
        Description: '',
        SettingValue: '',
        IsActive: 1,
        CreatedBy: '',
        CreatedDate: '',
        ModifiedBy: '',
        ModifiedDate: '',
        UserProfilePicture: '',
        AllowFileSize: 10,
        AllowFileFormat: 'jpg,png,jpeg',
        FileFormat: '',
        SelectedDate:'',
    };

    $scope.SearchControl = {
        InputPageItem: '',
        FilterAutoCompletebox: ''
    };




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

            var resoponsedata = response.data;
            if (resoponsedata !== null) {
                if (resoponsedata.Json !== undefined) {
                    $scope.PagesList = resoponsedata.Json.PagesList;
                }

            }

        });
    };
    $scope.LoadPagesList();


    //#region Delete Add Grid Data with Confirmation
    $ionicModal.fromTemplateUrl('WarningMessage.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {

        $scope.DeleteWarningMessageControl = modal;
    });


    $scope.OpenDeleteConfirmation = function () {

        $scope.DeleteWarningMessageControl.show();
    };
    $scope.CloseDeleteConfirmation = function () {
        $scope.DeleteWarningMessageControl.hide();
        $scope.SelectedId_SettingGrid = 0;
    };


    $scope.Delete_SelectedSetting = function (Id) {
        $scope.SelectedId_SettingGrid = Id;
        $scope.DeleteWarningMessageControl.show();
    }
    $scope.LoadGridColumns = function (PageName, PageMasterId) {

        $scope.SettingMasterJSON.PageId = PageMasterId;
        $scope.SearchControl.InputPageItem = PageName;
        //$scope.ClearOnPageDropDown();
        $scope.showPagebox = false;
        //$scope.LoadRoleMasterList();
        //this.dataGrid.dataSource.store.load();
    }

    $scope.ShowChangebox = function () {
        debugger;
        if ($scope.SearchControl.InputPageItem.length >= 1) {
            $scope.showPagebox = true;
            $scope.selectedPageRow = 0;
        }
        else {
            $scope.showPagebox = false;
            $scope.selectedPageRow = -1;
        }

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



    //#region Load Grid
    $scope.LoadSettingMasterGrid = function () {


        var SettingMasterData = new DevExpress.data.CustomStore({
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
                var SettingParameter = "";
                var Description = "";
                var SettingValue = "";
                var IsActive = "";

                var PageNameCriteria = "";
                var SettingParameterCriteria = "";
                var DescriptionCriteria = "";
                var SettingValueCriteria = "";
                var IsActiveCriteria = "";


                if (filterOptions !== "") {
                    var fields = filterOptions.split('and,');
                    for (var i = 0; i < fields.length; i++) {
                        var columnsList = fields[i];
                        columnsList = columnsList.split(',');

                        if (columnsList[0] === "SettingParameter") {
                            SettingParameterCriteria = columnsList[1];
                            SettingParameter = columnsList[2];
                        }

                        if (columnsList[0] === "Description") {
                            DescriptionCriteria = columnsList[1];
                            Description = columnsList[2];
                        }

                        if (columnsList[0] === "SettingValue") {
                            SettingValueCriteria = columnsList[1];
                            SettingValue = columnsList[2];
                        }

                        if (columnsList[0] === "IsActive") {
                            IsActiveCriteria = columnsList[1];
                            IsActive = columnsList[2];
                        }
                    }
                }

                var index = parseFloat(parseFloat(parameters.skip) + parseFloat(parameters.take));


                var requestData =
                    {
                        ServicesAction: 'GetAllSettingMasterPaging',
                        PageIndex: parameters.skip,
                        PageSize: index,
                        OrderBy: "",
                        OrderByCriteria: "",

                        SettingParameter: SettingParameter,
                        Description: Description,
                        SettingValue: SettingValue,
                        IsActive: IsActive,

                        PageNameCriteria: PageNameCriteria,
                        SettingParameterCriteria: SettingParameterCriteria,
                        DescriptionCriteria: DescriptionCriteria,
                        SettingValueCriteria: SettingValueCriteria,
                        IsActiveCriteria: IsActiveCriteria
                    };

                $scope.RequestDataFilter = requestData;

                var consolidateApiParamater =
                    {
                        Json: requestData
                    };
                $rootScope.Throbber.Visible = true;
                return GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                    var totalcount = 0;
                    var ListData = [];
                    var resoponsedata = response.data;
                    if (resoponsedata !== null) {

                        if (resoponsedata.Json !== undefined) {
                            if (resoponsedata.Json.SettingMasterList.length !== undefined) {
                                if (resoponsedata.Json.SettingMasterList.length > 0) {
                                    totalcount = resoponsedata.Json.SettingMasterList[0].TotalCount;
                                }
                            } else {
                                totalcount = resoponsedata.Json.SettingMasterList.TotalCount;
                            }

                            ListData = resoponsedata.Json.SettingMasterList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.SettingMasterList = $scope.SettingMasterList.concat(data);
                    $rootScope.Throbber.Visible = false;
                    // $scope.Gridrepaint();
                    return data;
                 
                });
            }
        });

        $scope.SettingMasterGrid = {
            dataSource: {
                store: SettingMasterData
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
            keyExpr: "SettingMasterId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.SettingMasterId, data.ControlType, data.PossibleValues);
                    }
                    else if (e.column.cellTemplate === "Delete") {
                        $scope.Delete_SelectedSetting(data.SettingMasterId);
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

            columns: [


                {
                    caption: "Page Name",
                    dataField: "PageName",
                    alignment: "left",
                  //  width: 200
                },
                //{
                //    caption: "Setting Parameter",
                //    dataField: "SettingParameter",
                //    alignment: "left",
                //    width: 250
                //},
                {
                    caption: "Description",
                    dataField: "Description",
                    alignment: "left",
                    width: 350
                },
                {
                    caption: "Setting Value",
                    dataField: "SettingValue",
                    alignment: "left",
                    width: 400
                },


                {
                    caption: "IsActive",
                    dataField: "IsActive",
                    alignment: "left",
                  //  width: 100
                },
                 {
                     caption: "Updated Date",
                     dataField: "UpdatedDate",
                     alignment: "left",
                    // width: 150,
                     dataType: 'date',
                     format: 'dd/MM/yyyy',
                 },
                  {
                      caption: "Updated By",
                      dataField: "UpdatedBy",
                      alignment: "left",
                    //  width: 100,
                     
                  },
                {
                    caption: "Edit",
                    dataField: "SettingMasterId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Edit",
                    alignment: "left",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 100
                }
                //,
                //{
                //    caption: "Delete",
                //    dataField: "SettingMasterId",
                //    cssClass: "ClickkableCell EnquiryNumberUI hideDeletecell",
                //    cellTemplate: "Delete",
                //    alignment: "left",
                //    allowFiltering: false,
                //    allowSorting: false,
                //    width: 100
                //}
            ]
        };
    };
    $scope.LoadSettingMasterGrid();


    $scope.Gridrepaint = function () {

        var grid = $("#SettingMasterGrid").dxDataGrid("instance");
        var colCount = grid.columnCount();
        for (var i = 0; i < colCount; i++) {

            var DataField = grid.columnOption(i, 'dataField');

            if (grid.columnOption(i, 'visible')) {
                if (DataField === 'SettingValue' || DataField === 'PlateNumber') {
                    grid.columnOption(i, 'width', '300');
                }
                else {
                    grid.columnOption(i, 'width', 'auto');
                }
            }
        }
        grid.repaint();
    }

    $scope.SortByListSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false
        //multiple:false

    }


    //#region Refresh DataGrid
    $scope.RefreshDataGrid = function () {

        $scope.SettingMasterList = [];
        var dataGrid = $("#SettingMasterGrid").dxDataGrid("instance");
        dataGrid.refresh();
    };
    //#endregion
    //#endregion

    $scope.CheckControlType = function (ControlType, PossibleValues) {

        //$scope.hidetextBox = true;
        //$scope.hideDropDown = false;
        //$scope.hideMultiselectPropDown = true;
        //$scope.hideUploadControl = true;

        if (ControlType == 'Textbox') {
            $scope.hidetextBox = false;
            $scope.hideDropDown = true;
            $scope.hideMultiselectPropDown = true;
            $scope.hideUploadControl = true;
            $scope.hideDatePicker = true;
            $scope.PossibleValuesList = [];
            $scope.ControlType = ControlType;
            $scope.PossibleValues = PossibleValues;

        }
        else if (ControlType == 'Dropdown') {
            $scope.hidetextBox = true;
            $scope.hideDropDown = false;
            $scope.hideMultiselectPropDown = true;
            $scope.hideUploadControl = true;
            $scope.hideDatePicker = true;
            $scope.PossibleValuesList = $scope.StringtoListConvert(PossibleValues);
            $scope.ControlType = ControlType;
            $scope.PossibleValues = PossibleValues
        }
        else if (ControlType == 'DropDownMultiSelect') {
            $scope.hidetextBox = true;
            $scope.hideDropDown = true;
            $scope.hideMultiselectPropDown = false;
            $scope.hideUploadControl = true;
            $scope.hideDatePicker = true;
            $scope.PossibleValuesList = $scope.StringtoListConvert(PossibleValues);
            $scope.ControlType = ControlType;
            $scope.PossibleValues = PossibleValues
        }
        else if (ControlType == 'PhotoUploadControl') {
            $scope.hidetextBox = true;
            $scope.hideDropDown = true;
            $scope.hideMultiselectPropDown = true;
            $scope.hideUploadControl = false;
            $scope.hideDatePicker = true;
            $scope.PossibleValuesList = [];
            $scope.ControlType = ControlType;
            $scope.PossibleValues = PossibleValues
        }
        else if (ControlType == 'DatePicker') {
            $scope.hidetextBox = true;
            $scope.hideDropDown = true;
            $scope.hideMultiselectPropDown = true;
            $scope.hideUploadControl = true;
            $scope.hideDatePicker = false;
            $scope.PossibleValuesList = [];
            $scope.ControlType = ControlType;
            $scope.PossibleValues = PossibleValues
        }
    }

    $scope.StringtoListConvert = function (PossibleValues) {
        if (PossibleValues != "0") {
            var splitList = PossibleValues.split(',');
            var ValuesList = [];
            if (splitList.length > 0) {

                for (var i = 0; i < splitList.length; i++) {
                    var item = {

                        Id: splitList[i],
                        Name: splitList[i]
                    }
                    ValuesList.push(item);
                }
            }
            return ValuesList;
        }
    }
    // $scope.CheckControlType();
    $rootScope.ClearUploadProfileImage = function () {
        debugger;
        $scope.SettingMasterJSON.UserProfilePicture = "iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAAAAAAb2I2mAAAACXBIWXMAAA7zAAAO8wEcU5k6AAAAEXRFWHRUaXRsZQBQREYgQ3JlYXRvckFevCgAAAATdEVYdEF1dGhvcgBQREYgVG9vbHMgQUcbz3cwAAAALXpUWHREZXNjcmlwdGlvbgAACJnLKCkpsNLXLy8v1ytISdMtyc/PKdZLzs8FAG6fCPGXryy4AAAaaklEQVQYGd3BXay16V3X8e/vf133vdbez8t0Op1pKX2h5U1oCwWMgQqU1CCxkfoCMUENGmM8w5czT0g80ERjwoHxxCASjYQYgmJIgZKANqEqmCYSWqGk0taRlk46L8/M8+y91n1f1//nWs/ez0yn9JlZa+3dk/X5yBy54NgFxy44dsGxC45dcOyCYxccu+DYBccuOHbBsQuOXXDsgmMXHLvg2AXHLjh2wbELjl1w7IJjFxy74NgFxy44dsGxC45dcOyCYxccu+DYBccuOHbBsQuOXXDsgmNX+QoyOLiQXBAXxIWOECDAG5VrJnO9zANiK8FgVlxILiwEAlU2bBDiK0HmejUhJB44B4NZc0FckECgm4CAROIrQeZ6dSFxX+893TEYxIXgwgQCUSNKKeIrRuYro7tvZIbB4JELyYWOQNBVtiSEQFw3metnm7sYDMYYKFwwDwgECQgREaUUce0q1y6z93QTUoAxGJILhQsJCAiMjRVhE8F1q1wzZ7bWMhdgDIHBYC50LslckhApEksLrpnMdTDCiYLnDQYH6Ux7wYuEwFxItIHCucUAxnAStQLuQhJXJ3MNDALS9hkYjBGIDd9XEQgaX0RQwBgEBlOj1hJgENdB5uoMWCJb6wnGbEhIzFwYEAiCCxPewEJCwgYDVpShVq6NzJUZjHD21jIMBleDMV1RSkQIISC4kHY6k5kNgcGYDavUoRSuicxVGQzK1nqyZQxiQ1AVJYr4stJutjPtMBhcM1NR4ibXROZqDBiTObdEwmCgK0qU0IILiUBgLgiwcTizZ9pgDMVpg25ICokrk7kagzGceQsEBlNUNkJs2QgQL+nivsD3nYPBGAnbg6KUElxZ5crM1joi7J6VDcOppBAXJB5ILtjaAEOwsTIy8hw1RHpWIbgGMlfTivB6PY/uKRWV3lLDOBT2lb217jAb4lyl1lI0QEocrnJFxT17p86iQNIpQymF/UlRw82GkELCiQYscQWVA6XEfTnNXRGrUgJnug5jxWZ/IZtMJ0JV4DSzIriKyoF6hNhoGykCO0Wo1LGCzJ4siY3srWV3FCABlSphBweqHMgIyFw5Fc4c7IxSYiEBZm8WW4uc1XrvCww2zVCwOVTlQCEg596IYncPNlGGEuBEYm8WWzHGPLc02EACDolDVQ4UAfQ2W0gZJlQ2BDaS2J/ZkoZap55sCdztWoJDVQ4UbLj3AkZBllqrcIJCHMAY02tBo9o5CIm06VE5WOUgJgttNamuohTcfaISAeJAQtwXbFTNBmPj7D17GSTADvZUOYQhnM0BRRiKi0IWV1a5LwwGc8E24iCVAxhQXzcLF5OhiCqExTWwuWQ2hOweIXGIyv4MRn1uUXDYptSoYJMUrkHaGAwGgbsKCnGAyt4MBvfeCRBElFIAkeaqWoTw3AzGgBC2oyBxgMqeDBgzdcJdmIhSS7AlriwFZGthMFuSyUyUArGvyv6MYaVC9igZpdQItiRzVUXp3o3BYIREZnbSFvsL9ma25oxCmkSlBJckrqgoW+sEWwaz5bSxOYDMvhK181VBwmZZagUsvpQ7ZA68shxICSO2rFytGxG9FncPQ8+ejhKtMy4H98qeKnuTe3cgQEISX9Y8dZF5zisrMy3GyIEtm55GEaKZUiuyISFwUwT7quzJktvsYrA2SrAlvsQ0TSllFl5Zb5mFQdyXmb0TiuLWNCyGUJd6OkPKyWNlX5U9ZcGtEYlRRBTJ4stQoJAqryxtpFoSQe85O60IpSmLMVxCONMhZXNlb5V9mZ4pIoGopRqD+DIUoei8stIVIbacvWXDAtwZFgvRq4pzA2xnZ2+VPYV7S8gig0pFOIX4EnNrGJJXkd2FplHG2XsaEAllXAgbomSmsS319YI9VfaknBvhXsFECLARXyp7IkPwyoxC3V5iO7ODIKEOY2BXIEp2q6dq5GrBnir7cu+KnghE8DCKIELZeWUlNGAn4K1gw/ayFpqLAIUicZaI1tiXzG4MCFj31pKQkuGk8qJZCnGfM+0zdrMeqjPGsfZpakYZRWn0KJkqYAGt9TMp2MhbIxutsqPKnmzuM1ECLC5UkxhkZ9pmR1WpUmr0nggRcroMA0hY3Kf7LEDJhsWuKjsTG+62BFi1BqQktkT23tMVO212NSQx1MKUaW0kSQwnAZKNxFZQwBZSmweSwq4quxLgdLcRmKgDGz1CbDT3jTQYG8SOpHGhnCeMJKK7LJdiQ2AHYIWq0zik3gb2UdmRBTh7E5KxahVYRkDmylsCgwRmN9awEG3VtAV2LE5griCwwVhSTWMB2VpF7Kyyl+w9AmFqKYAUAnLuEwIhgxB0dhNlEDm1DAnbxLCA6ewkioSMbQlqEwaZPkewu8o+nJkohKlV2EEE0NssLnQkgdjRUEu2aQYE7hnLk2B9PtdCAAKbjZJiQx23Guyushdnii2XgASCDfdeMTbuSArEjobCvJoUFrIzowbz2UyjWLxEISzI4p7sobKjYKuthlLoqTIChY0U6/McGxtCwX3m0uCejpCNNwhtoVWJzLJc0qep4VzKPV3jRLNbye7z+eZASipseSjZ8VzcsyzYXWUfRoCNghcZm4eaRUCyYSSELUCZKuOC3hMhcG9ZxqFktp6qiOTlQtwnLHZW2YO7xZai8ICcicxDtCiBM0OEJIw3cKRjPBFTprXhbC3qonb3lkiGtMQDQlHMfe6VnVV2554EslGpvMitWzyUExGqRCikTjrTLp1xKTxhJJGtaVxWWiYbRmSvMi8ppVkg3IrYVWV32bsFmCiVSxa9IfMQ1WREjSJFAJV0pq0aQ7BeNW1BJuPpQFuLUHYXuffKF1EpPSUjtzKwq8qOLNy7wxhUCi9y7+Khik3UWkJcCoqxFbA+X0dIeCPG5cC8bhECZ5F78hJBKSAQ2erAriq7y57IYBR8kcwQDxWKKEXiPosNISDXUw8QuGdZLCvzlLiDQ8iZFi+yVAQYuXd2VtmRZWxJGBAvcZqHy1KGImO8RUES983rOcZZyM4sQ6WtspTMJKIk2LycMBtKm51VdhT0dVbP49y0WBYeEOkxMvgS01DdXarrWEBdKLhkQH2autxutNZCRaeRWO18QQSQQIgv0qn15DxrEPScB3ZU2YfZknh1BduKKMFW6RgQ4TQR9J4IkXbvdayDW/aMgVciYYsNs6vKHiww2uBVFWUSdahgBIm3CFAAU6a10YzNYnBvc1fUxkOIDRmwMTur7MiywRhFiFdVMx2lVrFld9KZdpZhCNITRhLNRFkMZO89wzyUgBBgYXZX2YONjSLEqxKo1CILyLnbznTSFDVybk1bkMQ4DrCyQ84UDxGAAlsYzK4qOzIGjJFCWLwKU+pQsIA2zQVvyMNQg5znDAnb0rAcaNNECLorX54FSAYbm51Vdmcb4wiJV5WoDBUE2abWQUhwI8J97gkC9xyGcSDnuQvZvDIJWxjMrip7Mkhg8cpsooBFn1tLDJLQCK01S0J2ZhkGPDUg2RCvROwv2FHorA3WIFMrDnqHhJUX98b+ws2pzdZ6Vc6juA40CRs009pzQ7m5aKzu1uUt91XcpU2LaSxz48atEfzCHKX3KFHHKUX21r1udOOnGnRIJXSWIyFH9fmZwWBeTeVKrJiHW1kff7rc9oobrd2svbci9xgWJYkh13WczQuviRhG62wxP18ybt0bzvryRIOVzDVaPnZv/Zr5+eVyXYZ5HM/K4HRn9ZoKBYJDVQ4lIFLjfCbdOVVf9fVYq1fr5Y22suahVhrB+mxRXV+I/kx/fVYq6/Vr2/m63rpLvzeWYCrhHu2s92czTnyu4Xx9Mkeu20JxylVVDiUDnodh+MKw6I92e4zzvji9veT5WnpLQMCwrF49crbsJzcWcO67/YkYo95t3FovFoAHst1YPHPz8VVZnseirapyOcSNCn1eiKupHEpsePqN5XcNz792/qPf/drHo0cp60//37PHv+5Rqtiw2yQ++zvfeaN4/N2nXvftU0zL8uvTW75psZ5O+uKZj77jjSewXLdnX7f47KeeKcu3vbHcHRZnZ7/NXG+GbrzlkUqr9MKBKlfi+UP/5+999/ru8Omf+htPzP2x6bO//Ik/8Ont9/5QGQYST/l8LD75czffO5/M//HXv335lr5cfPI/fO4Dby1VcZo/9zM/9oFF083hzuvLL//SvWefef03fP97Tu/O09M/cev8jrO+9l/dIhPMoSoHE+B2/tSvvP31X1gwn9zswR/86oe/90ff8MkPfqS//9ERVVqtw8LPaNGHod6894k3TcvpY/2ebj/12Fh5+uNf8xvv/voQsYif++Dr/sLbz1Y/+Qvl+yIfef6J939LWQx9uFWIAuJQweEMzvG7PvHB1Vj6E9xZldXv/fo/+LFv4X3/7L2/9IVzENQ2FN984rHzm+s79R23ntRiOHvyG96yvBNVrX3szo996tNzaDXd/vz/+KYff99Xf9vX/dP4OAvihfo173jTY29825tvFyiZhUMFB0tlLsYX/syP/Oz/PG1PrO+Np/r8f/nB9z5377Gn5r+4+K+PngNJy2k93xlPGRfPvOG7f+tsPn/6yXcu7r7m8XvUZz/4Hd/2fb80+Hzhs//9Rz+6vHPrc/HY3/2zz63LPOR5uRGD7sI54ORQlSt6ze//9d/8mW++8fTqhtrA2aNPv3ZeD6v2ri+cFyCDDRPinHr2phu//+76qdO3Pz/O/QbTZ/7wffUHfvy/veeEPj35VVr2Z05P7jyWt++ext3xF39todXpG/82xVJwsMoVtcUjP/gTP/P3s9ceWt174vb5vRvRxq/9yHQTMEmEBO18HO699c2/9e78zbc93k5j4Jmzj7Zbf7S89bFvLUOJP3jT7edv/L+f+l8nJ6//O495XH72zdyJdUkYPWnohQNVruj88fN3/PC/e++t5by+MbvcXT13++ZnH9GnbkVtlaBR66D0WfaSp+/8xdXdz/zweqGypo6//cI/fnpJf/8bY1q99ZND3n37u167/L2nbrz2ueent/ytd58vTi3oRWY64UCVKzp94eT8Bz72099zasKvf8tH3vcGP8etJz/6gSUJhSyLYaBNZ0u7nr3zPz35mTf9ic8qp7y3+LU//Gu3H1/3n/zQ30Rf/Yaf/fh3fnr5l27wCx+68+jJ6cmdOys8e8RzGTonHKpyRdHg5g//i/98cjJMPPHtP/+r33X70Zsf/5V414AyoNZB9NZynFqcf9XbP/y5710+kguddX3k67//cbH+8If/6sni7Bv/9C8u3tXi3p3PF0rvvrW8SXfFWlpcQeWKzsZW2lv//L8+LZrVv+PJf/u5b3jzk7/8+fe/eR5q6wMnIeYpGaTWa/zJf3/7W+fSpjouPvaFHzldrR5d/OV/8uHv17Nf9ef+5T//occjf/65tz0y9Fg894mlfaPm8I30Gr1wqMoVzc/Vs0fG93z0v7fm/Nxb/8ojv/OT3P7WH/pAm0rJNjBCn5rLItXXp6tvfO7r39BeWD81r2/+1qPfMZYT33vnEx/6zrx98s3/8Df+zVPL4U+953sevzPWO0//9LlLrlb/6PWvaVWFg8nsKFdralsP1MUSeuHCZ06XQa7OWwzDONTSnn16tbx1WvvypLir9JLPP9dvPcL53VnjUJ593SPtqecXN0/OzuPmaeSCs+f6cgH01dmq82YufIpkcRr9axFbFhvn9wRC8Cg7ktlRrleUPlWVxUL0woW7JSdXtVlbqKSjKHsfxiok5rPJEVRnupSyKOpTI1agMi4C92wtKQaBOxdCyXiKQWxZgFf3hEDwKDuq7EqSkYQzC+LSTdZTUmshM52UKDRDZIsBMtYrLeu8mkspjmGo6/MeQctSa6kBGXV8oUfLjKFkcqkr6b30whexESAQu6rsyER0I9lpEC8aBtG6gXB4zNYpQ11jQa5bH6Ezzk7FsIjzlNcaSmSrC7DovXVUMuk9s3JBEhLiktiwBQixu8quFLIJ2ZmWeJFxZisISSSlBp4cpcK86iXkJBZWXVRYlwJGqQggS/F5i6G3KCQ1GhcGJUNQzKUkcIJAIHZV2ZEVwgqw0+IlbZqLVMDY2EQqXesAOfeaLUr0juqi0qfepEKbOTmNybVAjai0Voq7Cw+ssV2iVy4ZSCMQYneVHRkJS8Jp8xLbqCgMxh7k3jUMUarb1Esh3WWyVnleT8WKcPR6UpEFbjCbJVgmuVSVrhXxgNmwQOylsjMJEBvmJamoKpBgJM4XY6ybYin6albtZZinHMYYBlpjXA3VU9bxJjCwsV65zbHomVFKprgwKx1zaQNfxAaBQOyqsiND1VTG88XQ51J4IMCpkLmUzVHHUT5fz4TLnLEI91tkb73bLcuiRGC29LylYcBE4I64VCRq1SAuVeirLEZM/cYtdlXZnSTMli0eoipVSg26LSI6hVQMIEUNnyKFJNRTRRgMZhfmgkLsrLIjgUrIwjiz8BBDEkMtTL2jiGgh28MIhGwGLlmFB8xOOvdZpbCzyu6ilMywIXuIh5DGhXKeM5EihClDlSVxyUBGQK5nDAaLV5XdMmCVws4qOxKoFFsY914KX541LERbmUTCNV2GMcBiaxbaoAC5Xs0jGLOL1g2WrVrYWWVHApXSezXh3rPw5UUZRE4tADkpUIfiVrHYCEnc1+a5pTCYnfSOQHbUws4qe4jAMpBpHmKoJds0AwInKrWGW1YwG4ULrU9zOsJgMOKVWc5EBluF3VV2JEDCwuDkYYbCvJoUAtvpGMZwS4MxpgKZ6XODhMWG2YUzuBDsrrIjW9IwdwdJzbuPFLoC5ign65lyNlRnjGP1+XomfDqvM6L4Rsh9Ws8TIJANBgMS9wnxIiMQKBlGIS4pVzOmdFQXQavsqLIXiUs9FAJLioh0VaqUGnRbRMwZNrVUt+wZg8WWDQbzakyUAhlcSjaMTAQEu6rsSGyoFC41VQFWUPvGIomhFqbeUURMQo5xpLe5K2ozsrhgXpVVh4AMLmRaAqtHLSbYVWVnForauNAUBXCAht6MNC6U85yJFJFCdRzI3nuG2bAsMBgsXkUMFcwF0zIRWGiIlNhVZXeWihsXspUCloBSa1rDQrSVSSQcpoyjWNkhp42wjMGYVxWlCCy2DM1mKylFYneVnRlReFG2GhBs1RGVQeTUApCTIIZF9DZpI7sLRhYYzKsrtQASGwZ3G4F7rYHYXWUvCi4pe5cFzlAZ5VqyTTMgcFLrONCnuStkgxFgDAYjXlktwg42DKYDMu6LCmJ3lf0El+TMdAUnhYIL82pSCGynSx2gz00kILYsLphXVQKSLYMhJbZShb3I7GlaNSn70BmXg3sIWwGsV40S0TtFPR+jt966zX4yotYaIS5lRni1TiGwHwGBEDuq7EsKtgI3RSCUBlpLNjrhVBUoXMPJfkJRSgQvUiFbckFiS+yusrdiGyHl5LGyEbZWfc4M6CEyhhGryHhgP4kkvojwPHULrA0QYg+VPVmFnhJSNlfuU87r7GbLUIcxjBTsr/DHeJ4dspGKBAKxs8qeHMhGYDs7uBfRV81GwiWzjmNwFTYuXLBovctiQyVAIHYX7MmqJZBwWupr0sbzjCJCGJU6BiAO5PQGD+Q8p4SwiagSiD1U9mQoIaSeqpGrrJV5mlwQYFzGMSCDC439FBDiRW5TU7UFtiIMYh+VPVkgEM4S0ZqLmFcZIbBxDmNAsmFjKlfU5yzhjtgIQOxF5gBt7mskbIILQ+8U9XyM69EqYPEsF1Kl1FrZW+UgUrAlc6kTTlVxTSobyuSSI0oJi31VDmAFxRsgLvUQGcPItbHwvOYBlVrkLOypcpBQzUwjXmSowxhcG+F5moMLEaUKm31V9mdLorcEIrlQMus4BtfI07qLS6UWgdhbZW82EpUOSDygqGNwbSzmqRHmwhgBKNhXZW82AYrAQlzKMo4BGVwP5Tw1IjoXBomNYF/B/sxWIBAP9BgDkmuT0+QIHiiBOYTMYRpyn1suW1fQ+1CGIYAmJHEgg9iw73ChkOnxpHKoyoEC5GImhbspuKuEKCAOZcgQZO88kKlhDA5WOVAAgjgrhXQUp3spJYLDGbAFfWpcyqQuRiwOVLkCVXWcIHmDXh0jBzOYIN3n1sWFVBkHEIeqXIWCMU2Re3gDYuRQBkP0NncT5oKHxSCuQOYwFhv23LqD3oqxQlpICol9GTCGNs2pEp0LZTEKi4NVDpQKtobae0/LksC5VpRSxAGMYZ3dYHPpNATicJUDZVhgF0rr3ZGKIDdUCA5htiYj4eRSxQJa5UAyV+Y2T01RguwZAoFus2VMsGUQG8lLDC6AMeHeW+uuaauUaD1dFovKVclcXW+tz1IANgLBQooISECAQYiXMRgkNmZn75kGiQ0ropQSwRVVrkFROHFHER2LjXOVWgkCnDZFIF5OIDYMrPAG6qEge9YyDkH24Ioq1yGCzNZsy8IyarKdEQVUDOJh3HvPnBFIhLCNhloLBFcmc01ymueEACFItMWIQht8CQPG2H3LIAkRtlHoRBFcB5krs9jKeW5pAQKFSRuHFBHSCAjEpTUYwxpjIBESKpmo1hhJJK5O5qqchNhw7z3XCAQFO20LCYkBBEJcmMAYmpAQG2ZLEbWUgLQkrqxyZU5c1EOqtecaiw1jBKrYTpyAEJ2XGDxisClgY1qNsQYYCYy4Ipnrlb3NaQRCiA7G/DFCIFgTW5q48CjXrHLNUkXZM8HmgsEEL5cIBBXkTLpiS1y3ynWLQrZZ6Y00CyMjxJcSCAKbNChqrYVrV7lmFYiq7HZ27AAMNi9XACESgSBUag2un8y1syW6c8uAMYiXMwhEShGSiqTgK6By/cxGwXaae2AwhZfrAoGKIkqExIZBXDOZryRzBgbTeblAIBh1H/fZBNdM5nq1CDYSITaMMfACL3dDIKCwYRBbRlwzmSMXHLvg2AXHLjh2wbELjl1w7IJjFxy74NgFxy44dsGxC45dcOyCYxccu+DYBccuOHbBsQuOXXDsgmMXHLvg2AXHLjh2wbELjl1w7IJjFxy74NgFxy44dsGxC45dcOyCY/f/AbmiKwr2Zd7pAAAAAElFTkSuQmCC";
        angular.element("input[type='file']").val(null);
    }
    $scope.AddForm = function () {

        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;
        $scope.pageNameDisbale = false;
        $scope.enabelEdit = true;
        $scope.ClearAllControls();
    };

    $scope.ViewForm = function () {

        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.enabelEdit = false;
    };
    $scope.ViewForm();
    $scope.checkControltypeforsave = function () {
        var a = true;
        if ($scope.ControlType == 'DropDownMultiSelect') {
            if ($scope.SelectedSettingList.length > 0) {
                var data = $scope.SelectedSettingList

                var result = data.map(function (val) {
                    return val.Id;
                }).join(',');
                $scope.SettingMasterJSON.SettingValue = result;
                a = true;
            }
            else {
                // alert('Please Select Setting Value.');
                $rootScope.ValidationErrorAlert('Please Select Setting Value.', 'Alert', 3000);
                return a = false;
            }
        }
        else if ($scope.ControlType == 'PhotoUploadControl') {

            if ($scope.SettingMasterJSON.UserProfilePicture == "iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAAAAAAb2I2mAAAACXBIWXMAAA7zAAAO8wEcU5k6AAAAEXRFWHRUaXRsZQBQREYgQ3JlYXRvckFevCgAAAATdEVYdEF1dGhvcgBQREYgVG9vbHMgQUcbz3cwAAAALXpUWHREZXNjcmlwdGlvbgAACJnLKCkpsNLXLy8v1ytISdMtyc/PKdZLzs8FAG6fCPGXryy4AAAaaklEQVQYGd3BXay16V3X8e/vf133vdbez8t0Op1pKX2h5U1oCwWMgQqU1CCxkfoCMUENGmM8w5czT0g80ERjwoHxxCASjYQYgmJIgZKANqEqmCYSWqGk0taRlk46L8/M8+y91n1f1//nWs/ez0yn9JlZa+3dk/X5yBy54NgFxy44dsGxC45dcOyCYxccu+DYBccuOHbBsQuOXXDsgmMXHLvg2AXHLjh2wbELjl1w7IJjFxy74NgFxy44dsGxC45dcOyCYxccu+DYBccuOHbBsQuOXXDsgmNX+QoyOLiQXBAXxIWOECDAG5VrJnO9zANiK8FgVlxILiwEAlU2bBDiK0HmejUhJB44B4NZc0FckECgm4CAROIrQeZ6dSFxX+893TEYxIXgwgQCUSNKKeIrRuYro7tvZIbB4JELyYWOQNBVtiSEQFw3metnm7sYDMYYKFwwDwgECQgREaUUce0q1y6z93QTUoAxGJILhQsJCAiMjRVhE8F1q1wzZ7bWMhdgDIHBYC50LslckhApEksLrpnMdTDCiYLnDQYH6Ux7wYuEwFxItIHCucUAxnAStQLuQhJXJ3MNDALS9hkYjBGIDd9XEQgaX0RQwBgEBlOj1hJgENdB5uoMWCJb6wnGbEhIzFwYEAiCCxPewEJCwgYDVpShVq6NzJUZjHD21jIMBleDMV1RSkQIISC4kHY6k5kNgcGYDavUoRSuicxVGQzK1nqyZQxiQ1AVJYr4stJutjPtMBhcM1NR4ibXROZqDBiTObdEwmCgK0qU0IILiUBgLgiwcTizZ9pgDMVpg25ICokrk7kagzGceQsEBlNUNkJs2QgQL+nivsD3nYPBGAnbg6KUElxZ5crM1joi7J6VDcOppBAXJB5ILtjaAEOwsTIy8hw1RHpWIbgGMlfTivB6PY/uKRWV3lLDOBT2lb217jAb4lyl1lI0QEocrnJFxT17p86iQNIpQymF/UlRw82GkELCiQYscQWVA6XEfTnNXRGrUgJnug5jxWZ/IZtMJ0JV4DSzIriKyoF6hNhoGykCO0Wo1LGCzJ4siY3srWV3FCABlSphBweqHMgIyFw5Fc4c7IxSYiEBZm8WW4uc1XrvCww2zVCwOVTlQCEg596IYncPNlGGEuBEYm8WWzHGPLc02EACDolDVQ4UAfQ2W0gZJlQ2BDaS2J/ZkoZap55sCdztWoJDVQ4UbLj3AkZBllqrcIJCHMAY02tBo9o5CIm06VE5WOUgJgttNamuohTcfaISAeJAQtwXbFTNBmPj7D17GSTADvZUOYQhnM0BRRiKi0IWV1a5LwwGc8E24iCVAxhQXzcLF5OhiCqExTWwuWQ2hOweIXGIyv4MRn1uUXDYptSoYJMUrkHaGAwGgbsKCnGAyt4MBvfeCRBElFIAkeaqWoTw3AzGgBC2oyBxgMqeDBgzdcJdmIhSS7AlriwFZGthMFuSyUyUArGvyv6MYaVC9igZpdQItiRzVUXp3o3BYIREZnbSFvsL9ma25oxCmkSlBJckrqgoW+sEWwaz5bSxOYDMvhK181VBwmZZagUsvpQ7ZA68shxICSO2rFytGxG9FncPQ8+ejhKtMy4H98qeKnuTe3cgQEISX9Y8dZF5zisrMy3GyIEtm55GEaKZUiuyISFwUwT7quzJktvsYrA2SrAlvsQ0TSllFl5Zb5mFQdyXmb0TiuLWNCyGUJd6OkPKyWNlX5U9ZcGtEYlRRBTJ4stQoJAqryxtpFoSQe85O60IpSmLMVxCONMhZXNlb5V9mZ4pIoGopRqD+DIUoei8stIVIbacvWXDAtwZFgvRq4pzA2xnZ2+VPYV7S8gig0pFOIX4EnNrGJJXkd2FplHG2XsaEAllXAgbomSmsS319YI9VfaknBvhXsFECLARXyp7IkPwyoxC3V5iO7ODIKEOY2BXIEp2q6dq5GrBnir7cu+KnghE8DCKIELZeWUlNGAn4K1gw/ayFpqLAIUicZaI1tiXzG4MCFj31pKQkuGk8qJZCnGfM+0zdrMeqjPGsfZpakYZRWn0KJkqYAGt9TMp2MhbIxutsqPKnmzuM1ECLC5UkxhkZ9pmR1WpUmr0nggRcroMA0hY3Kf7LEDJhsWuKjsTG+62BFi1BqQktkT23tMVO212NSQx1MKUaW0kSQwnAZKNxFZQwBZSmweSwq4quxLgdLcRmKgDGz1CbDT3jTQYG8SOpHGhnCeMJKK7LJdiQ2AHYIWq0zik3gb2UdmRBTh7E5KxahVYRkDmylsCgwRmN9awEG3VtAV2LE5griCwwVhSTWMB2VpF7Kyyl+w9AmFqKYAUAnLuEwIhgxB0dhNlEDm1DAnbxLCA6ewkioSMbQlqEwaZPkewu8o+nJkohKlV2EEE0NssLnQkgdjRUEu2aQYE7hnLk2B9PtdCAAKbjZJiQx23Guyushdnii2XgASCDfdeMTbuSArEjobCvJoUFrIzowbz2UyjWLxEISzI4p7sobKjYKuthlLoqTIChY0U6/McGxtCwX3m0uCejpCNNwhtoVWJzLJc0qep4VzKPV3jRLNbye7z+eZASipseSjZ8VzcsyzYXWUfRoCNghcZm4eaRUCyYSSELUCZKuOC3hMhcG9ZxqFktp6qiOTlQtwnLHZW2YO7xZai8ICcicxDtCiBM0OEJIw3cKRjPBFTprXhbC3qonb3lkiGtMQDQlHMfe6VnVV2554EslGpvMitWzyUExGqRCikTjrTLp1xKTxhJJGtaVxWWiYbRmSvMi8ppVkg3IrYVWV32bsFmCiVSxa9IfMQ1WREjSJFAJV0pq0aQ7BeNW1BJuPpQFuLUHYXuffKF1EpPSUjtzKwq8qOLNy7wxhUCi9y7+Khik3UWkJcCoqxFbA+X0dIeCPG5cC8bhECZ5F78hJBKSAQ2erAriq7y57IYBR8kcwQDxWKKEXiPosNISDXUw8QuGdZLCvzlLiDQ8iZFi+yVAQYuXd2VtmRZWxJGBAvcZqHy1KGImO8RUES983rOcZZyM4sQ6WtspTMJKIk2LycMBtKm51VdhT0dVbP49y0WBYeEOkxMvgS01DdXarrWEBdKLhkQH2autxutNZCRaeRWO18QQSQQIgv0qn15DxrEPScB3ZU2YfZknh1BduKKMFW6RgQ4TQR9J4IkXbvdayDW/aMgVciYYsNs6vKHiww2uBVFWUSdahgBIm3CFAAU6a10YzNYnBvc1fUxkOIDRmwMTur7MiywRhFiFdVMx2lVrFld9KZdpZhCNITRhLNRFkMZO89wzyUgBBgYXZX2YONjSLEqxKo1CILyLnbznTSFDVybk1bkMQ4DrCyQ84UDxGAAlsYzK4qOzIGjJFCWLwKU+pQsIA2zQVvyMNQg5znDAnb0rAcaNNECLorX54FSAYbm51Vdmcb4wiJV5WoDBUE2abWQUhwI8J97gkC9xyGcSDnuQvZvDIJWxjMrip7Mkhg8cpsooBFn1tLDJLQCK01S0J2ZhkGPDUg2RCvROwv2FHorA3WIFMrDnqHhJUX98b+ws2pzdZ6Vc6juA40CRs009pzQ7m5aKzu1uUt91XcpU2LaSxz48atEfzCHKX3KFHHKUX21r1udOOnGnRIJXSWIyFH9fmZwWBeTeVKrJiHW1kff7rc9oobrd2svbci9xgWJYkh13WczQuviRhG62wxP18ybt0bzvryRIOVzDVaPnZv/Zr5+eVyXYZ5HM/K4HRn9ZoKBYJDVQ4lIFLjfCbdOVVf9fVYq1fr5Y22suahVhrB+mxRXV+I/kx/fVYq6/Vr2/m63rpLvzeWYCrhHu2s92czTnyu4Xx9Mkeu20JxylVVDiUDnodh+MKw6I92e4zzvji9veT5WnpLQMCwrF49crbsJzcWcO67/YkYo95t3FovFoAHst1YPHPz8VVZnseirapyOcSNCn1eiKupHEpsePqN5XcNz792/qPf/drHo0cp60//37PHv+5Rqtiw2yQ++zvfeaN4/N2nXvftU0zL8uvTW75psZ5O+uKZj77jjSewXLdnX7f47KeeKcu3vbHcHRZnZ7/NXG+GbrzlkUqr9MKBKlfi+UP/5+999/ru8Omf+htPzP2x6bO//Ik/8Ont9/5QGQYST/l8LD75czffO5/M//HXv335lr5cfPI/fO4Dby1VcZo/9zM/9oFF083hzuvLL//SvWefef03fP97Tu/O09M/cev8jrO+9l/dIhPMoSoHE+B2/tSvvP31X1gwn9zswR/86oe/90ff8MkPfqS//9ERVVqtw8LPaNGHod6894k3TcvpY/2ebj/12Fh5+uNf8xvv/voQsYif++Dr/sLbz1Y/+Qvl+yIfef6J939LWQx9uFWIAuJQweEMzvG7PvHB1Vj6E9xZldXv/fo/+LFv4X3/7L2/9IVzENQ2FN984rHzm+s79R23ntRiOHvyG96yvBNVrX3szo996tNzaDXd/vz/+KYff99Xf9vX/dP4OAvihfo173jTY29825tvFyiZhUMFB0tlLsYX/syP/Oz/PG1PrO+Np/r8f/nB9z5377Gn5r+4+K+PngNJy2k93xlPGRfPvOG7f+tsPn/6yXcu7r7m8XvUZz/4Hd/2fb80+Hzhs//9Rz+6vHPrc/HY3/2zz63LPOR5uRGD7sI54ORQlSt6ze//9d/8mW++8fTqhtrA2aNPv3ZeD6v2ri+cFyCDDRPinHr2phu//+76qdO3Pz/O/QbTZ/7wffUHfvy/veeEPj35VVr2Z05P7jyWt++ext3xF39todXpG/82xVJwsMoVtcUjP/gTP/P3s9ceWt174vb5vRvRxq/9yHQTMEmEBO18HO699c2/9e78zbc93k5j4Jmzj7Zbf7S89bFvLUOJP3jT7edv/L+f+l8nJ6//O495XH72zdyJdUkYPWnohQNVruj88fN3/PC/e++t5by+MbvcXT13++ZnH9GnbkVtlaBR66D0WfaSp+/8xdXdz/zweqGypo6//cI/fnpJf/8bY1q99ZND3n37u167/L2nbrz2ueent/ytd58vTi3oRWY64UCVKzp94eT8Bz72099zasKvf8tH3vcGP8etJz/6gSUJhSyLYaBNZ0u7nr3zPz35mTf9ic8qp7y3+LU//Gu3H1/3n/zQ30Rf/Yaf/fh3fnr5l27wCx+68+jJ6cmdOys8e8RzGTonHKpyRdHg5g//i/98cjJMPPHtP/+r33X70Zsf/5V414AyoNZB9NZynFqcf9XbP/y5710+kguddX3k67//cbH+8If/6sni7Bv/9C8u3tXi3p3PF0rvvrW8SXfFWlpcQeWKzsZW2lv//L8+LZrVv+PJf/u5b3jzk7/8+fe/eR5q6wMnIeYpGaTWa/zJf3/7W+fSpjouPvaFHzldrR5d/OV/8uHv17Nf9ef+5T//occjf/65tz0y9Fg894mlfaPm8I30Gr1wqMoVzc/Vs0fG93z0v7fm/Nxb/8ojv/OT3P7WH/pAm0rJNjBCn5rLItXXp6tvfO7r39BeWD81r2/+1qPfMZYT33vnEx/6zrx98s3/8Df+zVPL4U+953sevzPWO0//9LlLrlb/6PWvaVWFg8nsKFdralsP1MUSeuHCZ06XQa7OWwzDONTSnn16tbx1WvvypLir9JLPP9dvPcL53VnjUJ593SPtqecXN0/OzuPmaeSCs+f6cgH01dmq82YufIpkcRr9axFbFhvn9wRC8Cg7ktlRrleUPlWVxUL0woW7JSdXtVlbqKSjKHsfxiok5rPJEVRnupSyKOpTI1agMi4C92wtKQaBOxdCyXiKQWxZgFf3hEDwKDuq7EqSkYQzC+LSTdZTUmshM52UKDRDZIsBMtYrLeu8mkspjmGo6/MeQctSa6kBGXV8oUfLjKFkcqkr6b30whexESAQu6rsyER0I9lpEC8aBtG6gXB4zNYpQ11jQa5bH6Ezzk7FsIjzlNcaSmSrC7DovXVUMuk9s3JBEhLiktiwBQixu8quFLIJ2ZmWeJFxZisISSSlBp4cpcK86iXkJBZWXVRYlwJGqQggS/F5i6G3KCQ1GhcGJUNQzKUkcIJAIHZV2ZEVwgqw0+IlbZqLVMDY2EQqXesAOfeaLUr0juqi0qfepEKbOTmNybVAjai0Voq7Cw+ssV2iVy4ZSCMQYneVHRkJS8Jp8xLbqCgMxh7k3jUMUarb1Esh3WWyVnleT8WKcPR6UpEFbjCbJVgmuVSVrhXxgNmwQOylsjMJEBvmJamoKpBgJM4XY6ybYin6albtZZinHMYYBlpjXA3VU9bxJjCwsV65zbHomVFKprgwKx1zaQNfxAaBQOyqsiND1VTG88XQ51J4IMCpkLmUzVHHUT5fz4TLnLEI91tkb73bLcuiRGC29LylYcBE4I64VCRq1SAuVeirLEZM/cYtdlXZnSTMli0eoipVSg26LSI6hVQMIEUNnyKFJNRTRRgMZhfmgkLsrLIjgUrIwjiz8BBDEkMtTL2jiGgh28MIhGwGLlmFB8xOOvdZpbCzyu6ilMywIXuIh5DGhXKeM5EihClDlSVxyUBGQK5nDAaLV5XdMmCVws4qOxKoFFsY914KX541LERbmUTCNV2GMcBiaxbaoAC5Xs0jGLOL1g2WrVrYWWVHApXSezXh3rPw5UUZRE4tADkpUIfiVrHYCEnc1+a5pTCYnfSOQHbUws4qe4jAMpBpHmKoJds0AwInKrWGW1YwG4ULrU9zOsJgMOKVWc5EBluF3VV2JEDCwuDkYYbCvJoUAtvpGMZwS4MxpgKZ6XODhMWG2YUzuBDsrrIjW9IwdwdJzbuPFLoC5ign65lyNlRnjGP1+XomfDqvM6L4Rsh9Ws8TIJANBgMS9wnxIiMQKBlGIS4pVzOmdFQXQavsqLIXiUs9FAJLioh0VaqUGnRbRMwZNrVUt+wZg8WWDQbzakyUAhlcSjaMTAQEu6rsSGyoFC41VQFWUPvGIomhFqbeUURMQo5xpLe5K2ozsrhgXpVVh4AMLmRaAqtHLSbYVWVnForauNAUBXCAht6MNC6U85yJFJFCdRzI3nuG2bAsMBgsXkUMFcwF0zIRWGiIlNhVZXeWihsXspUCloBSa1rDQrSVSSQcpoyjWNkhp42wjMGYVxWlCCy2DM1mKylFYneVnRlReFG2GhBs1RGVQeTUApCTIIZF9DZpI7sLRhYYzKsrtQASGwZ3G4F7rYHYXWUvCi4pe5cFzlAZ5VqyTTMgcFLrONCnuStkgxFgDAYjXlktwg42DKYDMu6LCmJ3lf0El+TMdAUnhYIL82pSCGynSx2gz00kILYsLphXVQKSLYMhJbZShb3I7GlaNSn70BmXg3sIWwGsV40S0TtFPR+jt966zX4yotYaIS5lRni1TiGwHwGBEDuq7EsKtgI3RSCUBlpLNjrhVBUoXMPJfkJRSgQvUiFbckFiS+yusrdiGyHl5LGyEbZWfc4M6CEyhhGryHhgP4kkvojwPHULrA0QYg+VPVmFnhJSNlfuU87r7GbLUIcxjBTsr/DHeJ4dspGKBAKxs8qeHMhGYDs7uBfRV81GwiWzjmNwFTYuXLBovctiQyVAIHYX7MmqJZBwWupr0sbzjCJCGJU6BiAO5PQGD+Q8p4SwiagSiD1U9mQoIaSeqpGrrJV5mlwQYFzGMSCDC439FBDiRW5TU7UFtiIMYh+VPVkgEM4S0ZqLmFcZIbBxDmNAsmFjKlfU5yzhjtgIQOxF5gBt7mskbIILQ+8U9XyM69EqYPEsF1Kl1FrZW+UgUrAlc6kTTlVxTSobyuSSI0oJi31VDmAFxRsgLvUQGcPItbHwvOYBlVrkLOypcpBQzUwjXmSowxhcG+F5moMLEaUKm31V9mdLorcEIrlQMus4BtfI07qLS6UWgdhbZW82EpUOSDygqGNwbSzmqRHmwhgBKNhXZW82AYrAQlzKMo4BGVwP5Tw1IjoXBomNYF/B/sxWIBAP9BgDkmuT0+QIHiiBOYTMYRpyn1suW1fQ+1CGIYAmJHEgg9iw73ChkOnxpHKoyoEC5GImhbspuKuEKCAOZcgQZO88kKlhDA5WOVAAgjgrhXQUp3spJYLDGbAFfWpcyqQuRiwOVLkCVXWcIHmDXh0jBzOYIN3n1sWFVBkHEIeqXIWCMU2Re3gDYuRQBkP0NncT5oKHxSCuQOYwFhv23LqD3oqxQlpICol9GTCGNs2pEp0LZTEKi4NVDpQKtobae0/LksC5VpRSxAGMYZ3dYHPpNATicJUDZVhgF0rr3ZGKIDdUCA5htiYj4eRSxQJa5UAyV+Y2T01RguwZAoFus2VMsGUQG8lLDC6AMeHeW+uuaauUaD1dFovKVclcXW+tz1IANgLBQooISECAQYiXMRgkNmZn75kGiQ0ropQSwRVVrkFROHFHER2LjXOVWgkCnDZFIF5OIDYMrPAG6qEge9YyDkH24Ioq1yGCzNZsy8IyarKdEQVUDOJh3HvPnBFIhLCNhloLBFcmc01ymueEACFItMWIQht8CQPG2H3LIAkRtlHoRBFcB5krs9jKeW5pAQKFSRuHFBHSCAjEpTUYwxpjIBESKpmo1hhJJK5O5qqchNhw7z3XCAQFO20LCYkBBEJcmMAYmpAQG2ZLEbWUgLQkrqxyZU5c1EOqtecaiw1jBKrYTpyAEJ2XGDxisClgY1qNsQYYCYy4Ipnrlb3NaQRCiA7G/DFCIFgTW5q48CjXrHLNUkXZM8HmgsEEL5cIBBXkTLpiS1y3ynWLQrZZ6Y00CyMjxJcSCAKbNChqrYVrV7lmFYiq7HZ27AAMNi9XACESgSBUag2un8y1syW6c8uAMYiXMwhEShGSiqTgK6By/cxGwXaae2AwhZfrAoGKIkqExIZBXDOZryRzBgbTeblAIBh1H/fZBNdM5nq1CDYSITaMMfACL3dDIKCwYRBbRlwzmSMXHLvg2AXHLjh2wbELjl1w7IJjFxy74NgFxy44dsGxC45dcOyCYxccu+DYBccuOHbBsQuOXXDsgmMXHLvg2AXHLjh2wbELjl1w7IJjFxy74NgFxy44dsGxC45dcOyCY/f/AbmiKwr2Zd7pAAAAAElFTkSuQmCC") {
                $rootScope.ValidationErrorAlert('Please Select Photo', 'Alert', 3000);
                return a = false;;
            }

            else {

                $scope.SettingMasterJSON.SettingValue = $scope.SettingMasterJSON.UserProfilePicture;
                a = true;
            }

        }
       return a;
    }

    $scope.Save = function () {
        debugger;

        if ($scope.checkControltypeforsave()) {
            var PageName = "";
            if ($scope.PagesList.length > 0) {
                var PageNameList = $scope.PagesList.filter(function (el) { return el.PageId === $scope.SettingMasterJSON.PageId; });
                if (PageNameList.length > 0) {
                    PageName = PageNameList[0].PageName;
                }
            }
            if ($scope.SettingMasterJSON.SettingParameter === "") {
                alert('Please Enter Setting Parameter.');
                return;
            }

            if ($scope.SettingMasterJSON.SettingParameter === "") {
                alert('Please Enter Setting Value.');
                return;
            }
            // $scope.checkControltypeforsave();

            if ($scope.SettingMasterJSON.SettingValue === "") {
                alert('Please Enter Setting Value.');
                return;
            }
            var SettingMaster = {
                PageName: PageName,
                SettingMasterId: $scope.SettingMasterJSON.SettingMasterId,
                SettingParameter: $scope.SettingMasterJSON.SettingParameter,
                Description: $scope.SettingMasterJSON.Description,
                SettingValue: $scope.SettingMasterJSON.SettingValue,
                IsActive: $scope.SettingMasterJSON.IsActive,
                CreatedBy: $rootScope.UserId,
                ModifiedBy: $rootScope.UserId
            };

            var SettingMasterList = [];
            SettingMasterList.push(SettingMaster);

            var requestData =
                {
                    ServicesAction: 'SaveSettingMaster',
                    SettingMasterList: SettingMasterList
                };

            var consolidateApiParamater =
                {
                    Json: requestData
                };
            $rootScope.Throbber.Visible = true;
            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {

                if ($scope.SettingMasterId !== 0) {
                    $rootScope.ValidationErrorAlert('Record updated successfully', 'success', 3000);
                }
                else {
                    $rootScope.ValidationErrorAlert('Record saved successfully', 'success', 3000);
                }

                $scope.ClearAllControls();
                $scope.ViewForm();
                $scope.RefreshDataGrid();
                $rootScope.Throbber.Visible = false;
            });
        }
        else {

        }
    };

    $scope.Edit = function (id, ControlType, PossibleValues) {
        $rootScope.Throbber.Visible = true;
        debugger;
        $scope.AddForm();
        $scope.pageNameDisbale = true;
        $scope.CheckControlType(ControlType, PossibleValues);
        var requestData =
            {
                ServicesAction: 'LoadSettingMasterById',
                SettingMasterId: id
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            var ObjectSettingValue = '';
            var resoponsedata = response.data.SettingMaster.SettingMasterList;
            $scope.SettingMasterId = id;
            $scope.SettingMasterJSON.SettingMasterId = id;
            if (resoponsedata[0].PageName != undefined) {
                $scope.SearchControl.InputPageItem = resoponsedata[0].PageName;
                $scope.LoadGridColumns(resoponsedata[0].PageName, resoponsedata[0].PageId);
            }
            else {
                $scope.SearchControl.InputPageItem = 'Global';
            }

            ObjectSettingValue = resoponsedata[0].SettingValue;
            $scope.SettingMasterJSON.SettingParameter = resoponsedata[0].SettingParameter;
            $scope.SettingMasterJSON.Description = resoponsedata[0].Description;
            $scope.SettingMasterJSON.SettingValue = resoponsedata[0].SettingValue;
            if ($scope.ControlType == 'DropDownMultiSelect') {
                var datasplit = ObjectSettingValue.split(',');
                if (datasplit.length > 0) {
                    var splitarray = [];
                    for (var i = 0; i < datasplit.length; i++) {
                        var json = {
                            Id: datasplit[i]
                        }
                        splitarray.push(json);
                    }
                    $scope.SelectedSettingList = splitarray;

                } else {
                    $scope.SelectedSettingList = [];
                }
            }

            else if ($scope.ControlType == 'PhotoUploadControl') {
                $scope.SettingMasterJSON.SettingValue = ObjectSettingValue
                $scope.SettingMasterJSON.UserProfilePicture = ObjectSettingValue
            }
            else {
                $scope.SettingMasterJSON.SettingValue = ObjectSettingValue
            }
            //$scope.SettingMasterJSON.SettingValue = resoponsedata[0].SettingValue;
            $scope.SettingMasterJSON.IsActive = resoponsedata[0].IsActive;
            $rootScope.Throbber.Visible = false;
        });
    };

    $scope.DeleteYes = function (id) {
        debugger;
        var requestData =
            {
                ServicesAction: 'SoftDeleteSettingMaster',
                SettingMasterId: $scope.SelectedId_SettingGrid,
            };

        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            $rootScope.ValidationErrorAlert('Record deleted successfully', '', 3000);
            $scope.RefreshDataGrid();
            $scope.CloseDeleteConfirmation();
        });
    };



    $scope.BindCalendarFrom = function () {

        $('#FromDate').each(function () {
            debugger;
            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id !== undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');

                    }
                },
                minDate: new Date(),
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false
            });
        });
    }
    $scope.BindCalendarFrom();
    $scope.ClearAllControls = function () {
        $scope.SettingMasterList = [];
        $scope.PossibleValuesList = [];
        $scope.SelectedSettingList = [];
        $scope.SettingMasterId = 0;
        $scope.SelectedId_SettingGrid = 0;
        $scope.SettingMasterJSON.SettingMasterId = 0;
        $scope.SettingMasterJSON.SettingParameter = "";
        $scope.SettingMasterJSON.Description = "";
        $scope.SettingMasterJSON.SettingValue = "";
        $scope.SettingMasterJSON.IsActive = 1;
        $scope.SettingMasterJSON.CreatedBy = "";
        $scope.SettingMasterJSON.CreatedDate = "";
        $scope.SettingMasterJSON.ModifiedBy = "";
        $scope.SettingMasterJSON.ModifiedDate = "";
        $scope.SearchControl.InputPageItem = "";
        $scope.SearchControl.SelectedDate="",
        $scope.pageNameDisbale = false;
        $scope.PossibleValues = "";
        $scope.SettingMasterJSON.UserProfilePicture = "iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAAAAAAb2I2mAAAACXBIWXMAAA7zAAAO8wEcU5k6AAAAEXRFWHRUaXRsZQBQREYgQ3JlYXRvckFevCgAAAATdEVYdEF1dGhvcgBQREYgVG9vbHMgQUcbz3cwAAAALXpUWHREZXNjcmlwdGlvbgAACJnLKCkpsNLXLy8v1ytISdMtyc/PKdZLzs8FAG6fCPGXryy4AAAaaklEQVQYGd3BXay16V3X8e/vf133vdbez8t0Op1pKX2h5U1oCwWMgQqU1CCxkfoCMUENGmM8w5czT0g80ERjwoHxxCASjYQYgmJIgZKANqEqmCYSWqGk0taRlk46L8/M8+y91n1f1//nWs/ez0yn9JlZa+3dk/X5yBy54NgFxy44dsGxC45dcOyCYxccu+DYBccuOHbBsQuOXXDsgmMXHLvg2AXHLjh2wbELjl1w7IJjFxy74NgFxy44dsGxC45dcOyCYxccu+DYBccuOHbBsQuOXXDsgmNX+QoyOLiQXBAXxIWOECDAG5VrJnO9zANiK8FgVlxILiwEAlU2bBDiK0HmejUhJB44B4NZc0FckECgm4CAROIrQeZ6dSFxX+893TEYxIXgwgQCUSNKKeIrRuYro7tvZIbB4JELyYWOQNBVtiSEQFw3metnm7sYDMYYKFwwDwgECQgREaUUce0q1y6z93QTUoAxGJILhQsJCAiMjRVhE8F1q1wzZ7bWMhdgDIHBYC50LslckhApEksLrpnMdTDCiYLnDQYH6Ux7wYuEwFxItIHCucUAxnAStQLuQhJXJ3MNDALS9hkYjBGIDd9XEQgaX0RQwBgEBlOj1hJgENdB5uoMWCJb6wnGbEhIzFwYEAiCCxPewEJCwgYDVpShVq6NzJUZjHD21jIMBleDMV1RSkQIISC4kHY6k5kNgcGYDavUoRSuicxVGQzK1nqyZQxiQ1AVJYr4stJutjPtMBhcM1NR4ibXROZqDBiTObdEwmCgK0qU0IILiUBgLgiwcTizZ9pgDMVpg25ICokrk7kagzGceQsEBlNUNkJs2QgQL+nivsD3nYPBGAnbg6KUElxZ5crM1joi7J6VDcOppBAXJB5ILtjaAEOwsTIy8hw1RHpWIbgGMlfTivB6PY/uKRWV3lLDOBT2lb217jAb4lyl1lI0QEocrnJFxT17p86iQNIpQymF/UlRw82GkELCiQYscQWVA6XEfTnNXRGrUgJnug5jxWZ/IZtMJ0JV4DSzIriKyoF6hNhoGykCO0Wo1LGCzJ4siY3srWV3FCABlSphBweqHMgIyFw5Fc4c7IxSYiEBZm8WW4uc1XrvCww2zVCwOVTlQCEg596IYncPNlGGEuBEYm8WWzHGPLc02EACDolDVQ4UAfQ2W0gZJlQ2BDaS2J/ZkoZap55sCdztWoJDVQ4UbLj3AkZBllqrcIJCHMAY02tBo9o5CIm06VE5WOUgJgttNamuohTcfaISAeJAQtwXbFTNBmPj7D17GSTADvZUOYQhnM0BRRiKi0IWV1a5LwwGc8E24iCVAxhQXzcLF5OhiCqExTWwuWQ2hOweIXGIyv4MRn1uUXDYptSoYJMUrkHaGAwGgbsKCnGAyt4MBvfeCRBElFIAkeaqWoTw3AzGgBC2oyBxgMqeDBgzdcJdmIhSS7AlriwFZGthMFuSyUyUArGvyv6MYaVC9igZpdQItiRzVUXp3o3BYIREZnbSFvsL9ma25oxCmkSlBJckrqgoW+sEWwaz5bSxOYDMvhK181VBwmZZagUsvpQ7ZA68shxICSO2rFytGxG9FncPQ8+ejhKtMy4H98qeKnuTe3cgQEISX9Y8dZF5zisrMy3GyIEtm55GEaKZUiuyISFwUwT7quzJktvsYrA2SrAlvsQ0TSllFl5Zb5mFQdyXmb0TiuLWNCyGUJd6OkPKyWNlX5U9ZcGtEYlRRBTJ4stQoJAqryxtpFoSQe85O60IpSmLMVxCONMhZXNlb5V9mZ4pIoGopRqD+DIUoei8stIVIbacvWXDAtwZFgvRq4pzA2xnZ2+VPYV7S8gig0pFOIX4EnNrGJJXkd2FplHG2XsaEAllXAgbomSmsS319YI9VfaknBvhXsFECLARXyp7IkPwyoxC3V5iO7ODIKEOY2BXIEp2q6dq5GrBnir7cu+KnghE8DCKIELZeWUlNGAn4K1gw/ayFpqLAIUicZaI1tiXzG4MCFj31pKQkuGk8qJZCnGfM+0zdrMeqjPGsfZpakYZRWn0KJkqYAGt9TMp2MhbIxutsqPKnmzuM1ECLC5UkxhkZ9pmR1WpUmr0nggRcroMA0hY3Kf7LEDJhsWuKjsTG+62BFi1BqQktkT23tMVO212NSQx1MKUaW0kSQwnAZKNxFZQwBZSmweSwq4quxLgdLcRmKgDGz1CbDT3jTQYG8SOpHGhnCeMJKK7LJdiQ2AHYIWq0zik3gb2UdmRBTh7E5KxahVYRkDmylsCgwRmN9awEG3VtAV2LE5griCwwVhSTWMB2VpF7Kyyl+w9AmFqKYAUAnLuEwIhgxB0dhNlEDm1DAnbxLCA6ewkioSMbQlqEwaZPkewu8o+nJkohKlV2EEE0NssLnQkgdjRUEu2aQYE7hnLk2B9PtdCAAKbjZJiQx23Guyushdnii2XgASCDfdeMTbuSArEjobCvJoUFrIzowbz2UyjWLxEISzI4p7sobKjYKuthlLoqTIChY0U6/McGxtCwX3m0uCejpCNNwhtoVWJzLJc0qep4VzKPV3jRLNbye7z+eZASipseSjZ8VzcsyzYXWUfRoCNghcZm4eaRUCyYSSELUCZKuOC3hMhcG9ZxqFktp6qiOTlQtwnLHZW2YO7xZai8ICcicxDtCiBM0OEJIw3cKRjPBFTprXhbC3qonb3lkiGtMQDQlHMfe6VnVV2554EslGpvMitWzyUExGqRCikTjrTLp1xKTxhJJGtaVxWWiYbRmSvMi8ppVkg3IrYVWV32bsFmCiVSxa9IfMQ1WREjSJFAJV0pq0aQ7BeNW1BJuPpQFuLUHYXuffKF1EpPSUjtzKwq8qOLNy7wxhUCi9y7+Khik3UWkJcCoqxFbA+X0dIeCPG5cC8bhECZ5F78hJBKSAQ2erAriq7y57IYBR8kcwQDxWKKEXiPosNISDXUw8QuGdZLCvzlLiDQ8iZFi+yVAQYuXd2VtmRZWxJGBAvcZqHy1KGImO8RUES983rOcZZyM4sQ6WtspTMJKIk2LycMBtKm51VdhT0dVbP49y0WBYeEOkxMvgS01DdXarrWEBdKLhkQH2autxutNZCRaeRWO18QQSQQIgv0qn15DxrEPScB3ZU2YfZknh1BduKKMFW6RgQ4TQR9J4IkXbvdayDW/aMgVciYYsNs6vKHiww2uBVFWUSdahgBIm3CFAAU6a10YzNYnBvc1fUxkOIDRmwMTur7MiywRhFiFdVMx2lVrFld9KZdpZhCNITRhLNRFkMZO89wzyUgBBgYXZX2YONjSLEqxKo1CILyLnbznTSFDVybk1bkMQ4DrCyQ84UDxGAAlsYzK4qOzIGjJFCWLwKU+pQsIA2zQVvyMNQg5znDAnb0rAcaNNECLorX54FSAYbm51Vdmcb4wiJV5WoDBUE2abWQUhwI8J97gkC9xyGcSDnuQvZvDIJWxjMrip7Mkhg8cpsooBFn1tLDJLQCK01S0J2ZhkGPDUg2RCvROwv2FHorA3WIFMrDnqHhJUX98b+ws2pzdZ6Vc6juA40CRs009pzQ7m5aKzu1uUt91XcpU2LaSxz48atEfzCHKX3KFHHKUX21r1udOOnGnRIJXSWIyFH9fmZwWBeTeVKrJiHW1kff7rc9oobrd2svbci9xgWJYkh13WczQuviRhG62wxP18ybt0bzvryRIOVzDVaPnZv/Zr5+eVyXYZ5HM/K4HRn9ZoKBYJDVQ4lIFLjfCbdOVVf9fVYq1fr5Y22suahVhrB+mxRXV+I/kx/fVYq6/Vr2/m63rpLvzeWYCrhHu2s92czTnyu4Xx9Mkeu20JxylVVDiUDnodh+MKw6I92e4zzvji9veT5WnpLQMCwrF49crbsJzcWcO67/YkYo95t3FovFoAHst1YPHPz8VVZnseirapyOcSNCn1eiKupHEpsePqN5XcNz792/qPf/drHo0cp60//37PHv+5Rqtiw2yQ++zvfeaN4/N2nXvftU0zL8uvTW75psZ5O+uKZj77jjSewXLdnX7f47KeeKcu3vbHcHRZnZ7/NXG+GbrzlkUqr9MKBKlfi+UP/5+999/ru8Omf+htPzP2x6bO//Ik/8Ont9/5QGQYST/l8LD75czffO5/M//HXv335lr5cfPI/fO4Dby1VcZo/9zM/9oFF083hzuvLL//SvWefef03fP97Tu/O09M/cev8jrO+9l/dIhPMoSoHE+B2/tSvvP31X1gwn9zswR/86oe/90ff8MkPfqS//9ERVVqtw8LPaNGHod6894k3TcvpY/2ebj/12Fh5+uNf8xvv/voQsYif++Dr/sLbz1Y/+Qvl+yIfef6J939LWQx9uFWIAuJQweEMzvG7PvHB1Vj6E9xZldXv/fo/+LFv4X3/7L2/9IVzENQ2FN984rHzm+s79R23ntRiOHvyG96yvBNVrX3szo996tNzaDXd/vz/+KYff99Xf9vX/dP4OAvihfo173jTY29825tvFyiZhUMFB0tlLsYX/syP/Oz/PG1PrO+Np/r8f/nB9z5377Gn5r+4+K+PngNJy2k93xlPGRfPvOG7f+tsPn/6yXcu7r7m8XvUZz/4Hd/2fb80+Hzhs//9Rz+6vHPrc/HY3/2zz63LPOR5uRGD7sI54ORQlSt6ze//9d/8mW++8fTqhtrA2aNPv3ZeD6v2ri+cFyCDDRPinHr2phu//+76qdO3Pz/O/QbTZ/7wffUHfvy/veeEPj35VVr2Z05P7jyWt++ext3xF39todXpG/82xVJwsMoVtcUjP/gTP/P3s9ceWt174vb5vRvRxq/9yHQTMEmEBO18HO699c2/9e78zbc93k5j4Jmzj7Zbf7S89bFvLUOJP3jT7edv/L+f+l8nJ6//O495XH72zdyJdUkYPWnohQNVruj88fN3/PC/e++t5by+MbvcXT13++ZnH9GnbkVtlaBR66D0WfaSp+/8xdXdz/zweqGypo6//cI/fnpJf/8bY1q99ZND3n37u167/L2nbrz2ueent/ytd58vTi3oRWY64UCVKzp94eT8Bz72099zasKvf8tH3vcGP8etJz/6gSUJhSyLYaBNZ0u7nr3zPz35mTf9ic8qp7y3+LU//Gu3H1/3n/zQ30Rf/Yaf/fh3fnr5l27wCx+68+jJ6cmdOys8e8RzGTonHKpyRdHg5g//i/98cjJMPPHtP/+r33X70Zsf/5V414AyoNZB9NZynFqcf9XbP/y5710+kguddX3k67//cbH+8If/6sni7Bv/9C8u3tXi3p3PF0rvvrW8SXfFWlpcQeWKzsZW2lv//L8+LZrVv+PJf/u5b3jzk7/8+fe/eR5q6wMnIeYpGaTWa/zJf3/7W+fSpjouPvaFHzldrR5d/OV/8uHv17Nf9ef+5T//occjf/65tz0y9Fg894mlfaPm8I30Gr1wqMoVzc/Vs0fG93z0v7fm/Nxb/8ojv/OT3P7WH/pAm0rJNjBCn5rLItXXp6tvfO7r39BeWD81r2/+1qPfMZYT33vnEx/6zrx98s3/8Df+zVPL4U+953sevzPWO0//9LlLrlb/6PWvaVWFg8nsKFdralsP1MUSeuHCZ06XQa7OWwzDONTSnn16tbx1WvvypLir9JLPP9dvPcL53VnjUJ593SPtqecXN0/OzuPmaeSCs+f6cgH01dmq82YufIpkcRr9axFbFhvn9wRC8Cg7ktlRrleUPlWVxUL0woW7JSdXtVlbqKSjKHsfxiok5rPJEVRnupSyKOpTI1agMi4C92wtKQaBOxdCyXiKQWxZgFf3hEDwKDuq7EqSkYQzC+LSTdZTUmshM52UKDRDZIsBMtYrLeu8mkspjmGo6/MeQctSa6kBGXV8oUfLjKFkcqkr6b30whexESAQu6rsyER0I9lpEC8aBtG6gXB4zNYpQ11jQa5bH6Ezzk7FsIjzlNcaSmSrC7DovXVUMuk9s3JBEhLiktiwBQixu8quFLIJ2ZmWeJFxZisISSSlBp4cpcK86iXkJBZWXVRYlwJGqQggS/F5i6G3KCQ1GhcGJUNQzKUkcIJAIHZV2ZEVwgqw0+IlbZqLVMDY2EQqXesAOfeaLUr0juqi0qfepEKbOTmNybVAjai0Voq7Cw+ssV2iVy4ZSCMQYneVHRkJS8Jp8xLbqCgMxh7k3jUMUarb1Esh3WWyVnleT8WKcPR6UpEFbjCbJVgmuVSVrhXxgNmwQOylsjMJEBvmJamoKpBgJM4XY6ybYin6albtZZinHMYYBlpjXA3VU9bxJjCwsV65zbHomVFKprgwKx1zaQNfxAaBQOyqsiND1VTG88XQ51J4IMCpkLmUzVHHUT5fz4TLnLEI91tkb73bLcuiRGC29LylYcBE4I64VCRq1SAuVeirLEZM/cYtdlXZnSTMli0eoipVSg26LSI6hVQMIEUNnyKFJNRTRRgMZhfmgkLsrLIjgUrIwjiz8BBDEkMtTL2jiGgh28MIhGwGLlmFB8xOOvdZpbCzyu6ilMywIXuIh5DGhXKeM5EihClDlSVxyUBGQK5nDAaLV5XdMmCVws4qOxKoFFsY914KX541LERbmUTCNV2GMcBiaxbaoAC5Xs0jGLOL1g2WrVrYWWVHApXSezXh3rPw5UUZRE4tADkpUIfiVrHYCEnc1+a5pTCYnfSOQHbUws4qe4jAMpBpHmKoJds0AwInKrWGW1YwG4ULrU9zOsJgMOKVWc5EBluF3VV2JEDCwuDkYYbCvJoUAtvpGMZwS4MxpgKZ6XODhMWG2YUzuBDsrrIjW9IwdwdJzbuPFLoC5ign65lyNlRnjGP1+XomfDqvM6L4Rsh9Ws8TIJANBgMS9wnxIiMQKBlGIS4pVzOmdFQXQavsqLIXiUs9FAJLioh0VaqUGnRbRMwZNrVUt+wZg8WWDQbzakyUAhlcSjaMTAQEu6rsSGyoFC41VQFWUPvGIomhFqbeUURMQo5xpLe5K2ozsrhgXpVVh4AMLmRaAqtHLSbYVWVnForauNAUBXCAht6MNC6U85yJFJFCdRzI3nuG2bAsMBgsXkUMFcwF0zIRWGiIlNhVZXeWihsXspUCloBSa1rDQrSVSSQcpoyjWNkhp42wjMGYVxWlCCy2DM1mKylFYneVnRlReFG2GhBs1RGVQeTUApCTIIZF9DZpI7sLRhYYzKsrtQASGwZ3G4F7rYHYXWUvCi4pe5cFzlAZ5VqyTTMgcFLrONCnuStkgxFgDAYjXlktwg42DKYDMu6LCmJ3lf0El+TMdAUnhYIL82pSCGynSx2gz00kILYsLphXVQKSLYMhJbZShb3I7GlaNSn70BmXg3sIWwGsV40S0TtFPR+jt966zX4yotYaIS5lRni1TiGwHwGBEDuq7EsKtgI3RSCUBlpLNjrhVBUoXMPJfkJRSgQvUiFbckFiS+yusrdiGyHl5LGyEbZWfc4M6CEyhhGryHhgP4kkvojwPHULrA0QYg+VPVmFnhJSNlfuU87r7GbLUIcxjBTsr/DHeJ4dspGKBAKxs8qeHMhGYDs7uBfRV81GwiWzjmNwFTYuXLBovctiQyVAIHYX7MmqJZBwWupr0sbzjCJCGJU6BiAO5PQGD+Q8p4SwiagSiD1U9mQoIaSeqpGrrJV5mlwQYFzGMSCDC439FBDiRW5TU7UFtiIMYh+VPVkgEM4S0ZqLmFcZIbBxDmNAsmFjKlfU5yzhjtgIQOxF5gBt7mskbIILQ+8U9XyM69EqYPEsF1Kl1FrZW+UgUrAlc6kTTlVxTSobyuSSI0oJi31VDmAFxRsgLvUQGcPItbHwvOYBlVrkLOypcpBQzUwjXmSowxhcG+F5moMLEaUKm31V9mdLorcEIrlQMus4BtfI07qLS6UWgdhbZW82EpUOSDygqGNwbSzmqRHmwhgBKNhXZW82AYrAQlzKMo4BGVwP5Tw1IjoXBomNYF/B/sxWIBAP9BgDkmuT0+QIHiiBOYTMYRpyn1suW1fQ+1CGIYAmJHEgg9iw73ChkOnxpHKoyoEC5GImhbspuKuEKCAOZcgQZO88kKlhDA5WOVAAgjgrhXQUp3spJYLDGbAFfWpcyqQuRiwOVLkCVXWcIHmDXh0jBzOYIN3n1sWFVBkHEIeqXIWCMU2Re3gDYuRQBkP0NncT5oKHxSCuQOYwFhv23LqD3oqxQlpICol9GTCGNs2pEp0LZTEKi4NVDpQKtobae0/LksC5VpRSxAGMYZ3dYHPpNATicJUDZVhgF0rr3ZGKIDdUCA5htiYj4eRSxQJa5UAyV+Y2T01RguwZAoFus2VMsGUQG8lLDC6AMeHeW+uuaauUaD1dFovKVclcXW+tz1IANgLBQooISECAQYiXMRgkNmZn75kGiQ0ropQSwRVVrkFROHFHER2LjXOVWgkCnDZFIF5OIDYMrPAG6qEge9YyDkH24Ioq1yGCzNZsy8IyarKdEQVUDOJh3HvPnBFIhLCNhloLBFcmc01ymueEACFItMWIQht8CQPG2H3LIAkRtlHoRBFcB5krs9jKeW5pAQKFSRuHFBHSCAjEpTUYwxpjIBESKpmo1hhJJK5O5qqchNhw7z3XCAQFO20LCYkBBEJcmMAYmpAQG2ZLEbWUgLQkrqxyZU5c1EOqtecaiw1jBKrYTpyAEJ2XGDxisClgY1qNsQYYCYy4Ipnrlb3NaQRCiA7G/DFCIFgTW5q48CjXrHLNUkXZM8HmgsEEL5cIBBXkTLpiS1y3ynWLQrZZ6Y00CyMjxJcSCAKbNChqrYVrV7lmFYiq7HZ27AAMNi9XACESgSBUag2un8y1syW6c8uAMYiXMwhEShGSiqTgK6By/cxGwXaae2AwhZfrAoGKIkqExIZBXDOZryRzBgbTeblAIBh1H/fZBNdM5nq1CDYSITaMMfACL3dDIKCwYRBbRlwzmSMXHLvg2AXHLjh2wbELjl1w7IJjFxy74NgFxy44dsGxC45dcOyCYxccu+DYBccuOHbBsQuOXXDsgmMXHLvg2AXHLjh2wbELjl1w7IJjFxy74NgFxy44dsGxC45dcOyCY/f/AbmiKwr2Zd7pAAAAAElFTkSuQmCC";
    };
    $scope.ResetButton = function (id, ControlType, PossibleValues)
    {
        if (id !== null && ControlType !== null && PossibleValues !== null)
        {
            $scope.Edit(id, ControlType, PossibleValues);
        }
        else {
            $scope.ViewForm();

        }
    }
});