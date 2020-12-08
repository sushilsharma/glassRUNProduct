angular.module("glassRUNProduct").controller('ReportsController', function ($scope, $q, $timeout, $rootScope, $document, $ionicModal, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService, ManageOrderService) {
    debugger;
    LoadActiveVariables($sessionStorage, $state, $rootScope);
    var page = $location.absUrl().split('#/')[1];
    var controllerName = '';
    $scope.urlhost = $location.url();
    var URLSplit = $scope.urlhost.split("/");
    if (URLSplit.length > 0) {
        controllerName = URLSplit[URLSplit.length - 1];
    }
    $scope.LoadThrobberForPage = function () {
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        };
    }
    $scope.LoadThrobberForPage();

    $scope.CustomerList = [];
    $scope.GridColumnList = [];


    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    $scope.SelectParameters = {
        SelectedYear: year,
        SelectedMonth: month,
        DisplayMonth: months[month - 1],
        SelectedCustomer: 0,
        ShowMonthCalendar: false

    }

    $scope.SubtractYear = function () {
        debugger;
        $scope.SelectParameters.SelectedYear = parseInt($scope.SelectParameters.SelectedYear) - 1;
    }

    $scope.AddYear = function () {
        debugger;
        $scope.SelectParameters.SelectedYear = parseInt($scope.SelectParameters.SelectedYear) + 1;
    }

    $scope.SelectMonth = function (month) {
        debugger;
        $scope.SelectParameters.SelectedMonth = parseInt(month);
        $scope.SelectParameters.DisplayMonth = months[parseInt(month) - 1];
        $scope.SelectParameters.ShowMonthCalendar = false;
    }

    $scope.ShowMonthCalendar = function () {
        debugger;
        if ($scope.SelectParameters.ShowMonthCalendar === true) {
            $scope.SelectParameters.ShowMonthCalendar = false;
        } else {
            $scope.SelectParameters.ShowMonthCalendar = true;
        }
    }

    $scope.ProductSelectedList = [];
    $scope.ProductTexts = { buttonDefaultText: 'Select Customer' };
    $scope.MultiSelectDropdownSetting = {
        scrollable: true,
        scrollableHeight: '400px',
        enableSearch: true
    }



    $scope.GetAllCustomerDetails = function () {
        $rootScope.Throbber.Visible = true;
        var requestData = {
            ServicesAction: 'GetAllCustomerListB2BApp',
            CompanyId: $rootScope.CompanyId,
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            PageName: controllerName
        };

        var consolidateApiParamater =
        {
            Json: requestData
        };


        var gridrequestData =
        {
            ServicesAction: 'LoadGridConfiguration',
            RoleId: $rootScope.RoleId,
            UserId: $rootScope.UserId,
            CultureId: $rootScope.CultureId,
            ObjectName: "Order",
            ObjectId: 1451,
            PageName: "ManageOrder",
            ControllerName: "ManageOrder"
        };

        var gridconsolidateApiParamater =
        {
            Json: gridrequestData,
        };

        var customerlist = GrRequestService.ProcessRequest(consolidateApiParamater);
        var gridColumn = GrRequestService.ProcessRequest(gridconsolidateApiParamater);

        return $q.all([
            gridColumn,
            customerlist
        ]).then(function (resp) {

            var responsedata = resp[0];
            if (responsedata !== null && responsedata !== undefined) {
                if (responsedata.data !== null && responsedata.data !== undefined) {
                    $scope.GridColumnList = responsedata.data.Json.GridColumnList;
                }

            }


            var response = resp[1];
            if (response !== undefined && response !== null) {
                if (response.data !== undefined && response.data !== null) {
                    if (response.data.Json !== undefined) {
                        var Customerset = response.data.Json.CustomerList;
                        $scope.CustomerList = Customerset;

                        for (var i = 0; i < $scope.CustomerList.length; i++) {
                            $scope.CustomerList[i].Id = $scope.CustomerList[i].CompanyId;
                            $scope.CustomerList[i].Name = $scope.CustomerList[i].CompanyName;
                        }

                        $rootScope.Throbber.Visible = false;
                    }
                    else {
                        $scope.CustomerList = [];
                        $rootScope.Throbber.Visible = false;
                    }
                }
                else {
                    $scope.CustomerList = [];
                    $rootScope.Throbber.Visible = false;
                }
            }
            else {
                $scope.CustomerList = [];
                $rootScope.Throbber.Visible = false;
            }
        });




    }

    $scope.GetAllCustomerDetails();

    $scope.ExportToExcelSalesAdminApprovalDataDetails = function () {
        debugger;

        var OrderSearchParameterList = [];
        $scope.CompanyCode = "";

        if ($scope.ProductSelectedList.length > 0) {
            for (var i = 0; i < $scope.ProductSelectedList.length; i++) {
                $scope.CompanyCode = $scope.CompanyCode + "," + $scope.ProductSelectedList[i].Id;
            }
            $scope.CompanyCode = $scope.CompanyCode.substr(1);
        }

        if ($scope.CompanyCode !== "" && $scope.CompanyCode !== null && $scope.CompanyCode !== undefined) {

            var ProductCodesParam = {};
            ProductCodesParam.fieldName = "SoldToList";
            ProductCodesParam.operatorName = "Include";
            ProductCodesParam.fieldValue = $scope.CompanyCode;
            ProductCodesParam.fieldType = "string";
            OrderSearchParameterList.push(ProductCodesParam);

        }


        if ($scope.SelectParameters.SelectedMonth !== "") {
            var firstDay = new Date($scope.SelectParameters.SelectedYear, $scope.SelectParameters.SelectedMonth - 1, 1);
            var lastDay = new Date($scope.SelectParameters.SelectedYear, $scope.SelectParameters.SelectedMonth, 0);
            $scope.firstDay = firstDay.getDate();
            $scope.lastDay = lastDay.getDate();



            var OrderStartParam = {};
            OrderStartParam.fieldName = "OrderDate";
            OrderStartParam.fieldType = "date";
            OrderStartParam.fieldValue = "0" + $scope.firstDay + "/" + $scope.SelectParameters.SelectedMonth + "/" + $scope.SelectParameters.SelectedYear;
            OrderStartParam.operatorName = ">=";
            OrderSearchParameterList.push(OrderStartParam);


            var OrderEndParam = {};
            OrderEndParam.fieldName = "OrderDate";
            OrderEndParam.fieldType = "date";
            OrderEndParam.fieldValue = $scope.lastDay + "/" + $scope.SelectParameters.SelectedMonth + "/" + $scope.SelectParameters.SelectedYear;
            OrderEndParam.operatorName = "<";
            OrderSearchParameterList.push(OrderEndParam);

        }


        var CurrentStateParam = {};
        CurrentStateParam.fieldName = "CurrentStatusList";
        CurrentStateParam.operatorName = "Include";
        CurrentStateParam.fieldValue = "9056,9061";
        CurrentStateParam.fieldType = "string";
        OrderSearchParameterList.push(CurrentStateParam);


        if ($scope.GridColumnList.length > 0) {
            $rootScope.Throbber.Visible = true;

            var ColumnList = $scope.GridColumnList.filter(function (el) { return el.IsExportAvailable === '1' && el.PropertyName !== 'CheckedEnquiry'; });


            var orderSearchDTO = {
                "RoleId": parseInt($rootScope.RoleId),
                "CultureId": parseInt($rootScope.CultureId),
                "PageName": "ManageOrder",
                "PageControlName": "Order",
                "LoginId": parseInt($rootScope.UserId),
                "OrderSearchParameterList": OrderSearchParameterList,
                "whereClause": "",
                "IsExportToExcel": true,
                "OrderGridColumnList": ColumnList
            };



            ManageOrderService.ExportToExcelForOrderListDetails(orderSearchDTO).then(function (response) {
                debugger;

                var byteCharacters1 = response.data;
                if (response.data !== undefined) {
                    var blob = b64toBlob(byteCharacters1, 'application/octet-stream');

                    if (blob.size > 0) {
                        var filName = "OrderList_" + getDate() + ".csv";
                        saveAs(blob, filName);
                        $rootScope.Throbber.Visible = false;
                    } else {
                        $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                        $rootScope.Throbber.Visible = false;
                    }
                }
                else {
                    $rootScope.ValidationErrorAlert('Document not generated.', '', 3000);
                    $rootScope.Throbber.Visible = false;
                }
            });
        }
    }


    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512; // sliceSize represent the bytes to be process in each batch(loop), 512 bytes seems to be the ideal slice size for the performance wise 

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

});