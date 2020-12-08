angular.module("glassRUNProduct").controller('UploadEnquirySTController', function ($http, $scope, $location, $rootScope, $sessionStorage, $state, $ionicModal, pluginsService, GrRequestService) {
    
    $scope.IsSubmitInquiryButton = false;
    LoadActiveVariables($sessionStorage, $state, $rootScope);




    $scope.PopupVariables = {
        Title: '',
        Message: '',
        Okbtn: '',
        Cancelbtn: ''
    }


    $ionicModal.fromTemplateUrl('ConfirmationPopuScreen.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        

        $scope.ConfirmationPopuScreen = modal;
    });

    $scope.OpenConfirmationPopuScreen = function (title, erromsg, Okbtn) {
        

        $scope.PopupVariables.Title = title;
        $scope.PopupVariables.Message = erromsg;
        $scope.PopupVariables.Okbtn = Okbtn;

        $scope.ConfirmationPopuScreen.show();
    }

    $scope.CloseConfirmationPopuScreen = function () {
        
        $scope.ConfirmationPopuScreen.hide();
    }



    var tmpList = [];

    for (var i = 1; i <= 6; i++) {
        tmpList.push({
            text: 'Item ' + i,
            value: i
        });
    }

    $scope.list = tmpList;


    $scope.sortingLog = [];

    $scope.sortableOptions = {
        activate: function () {
            console.log("activate");
        },
        beforeStop: function () {
            console.log("beforeStop");
        },
        change: function () {
            console.log("change");
        },
        create: function () {
            console.log("create");
        },
        deactivate: function () {
            console.log("deactivate");
        },
        out: function () {
            console.log("out");
        },
        over: function () {
            console.log("over");
        },
        receive: function () {
            console.log("receive");
        },
        remove: function () {
            console.log("remove");
        },
        sort: function () {
            console.log("sort");
        },
        start: function () {
            console.log("start");
        },
        update: function (e, ui) {
            console.log("update");

            var logEntry = tmpList.map(function (i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Update: ' + logEntry);
        },
        stop: function (e, ui) {
            console.log("stop");

            // this callback has the changed model
            var logEntry = tmpList.map(function (i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Stop: ' + logEntry);
        }
    };





    $scope.FeedbackVariable = {
        OverAll: true,
        Specific: false
    }


    setTimeout(function () {
        


        pluginsService.init();
    }, 200);

    $scope.OrderData = [];
    var orders = {
        OrderGUID: 1,
        TruckName: "Truck" + 1,
        DeliveryLocation: '',
        TruckSize: '',
        ProposedETDStr: '',
        SpecialRequest: '',
        TotalWeight: 0,
        TruckCapacity: 0,
        TruckPallets: 0,
        TotalProductPallets: 0,
        OrderProductList: []
    }
    $scope.OrderData.push(orders);







    $scope.shiptodata = "";
    $scope.ReceivingLocationCapacity = '-';
    $scope.setreceivingcapacity = function () {
        
        $scope.ReceivingLocationCapacity = 60;
    }


    $scope.fileupload = {
        File: ''
    }

    $scope.errorRecord = [];
    $scope.successRecord = [];
    $scope.isShowMsg = false;
    $scope.isShowErrorRecord = false;
    $scope.PopupMessage = '';

    //$scope.UploadFile = function () {
    //    


    //    //$scope.loading = true;
    //    //t.removeClass("uk-hidden");
    //    //i.css("width", "20%").text("20%");

    //    //$scope.GetRecordForAprove = [];
    //    //
    //    var file = $scope.fileupload.File;
    //    GrRequestService.SaveConsumer(file).then(function (response) {
    //        
    //        if (response.data.data !== null) {
    //            if (response.data.data.length > 0) {

    //            }
    //        }

    //    });
    //};


    $scope.UploadFile = function () {
        
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        }
        $scope.ParentJson = [];
        $scope.ChildJson = [];
        var requestData = {
            ServicesAction: 'BulkInsertSTOrder',
            File: $scope.fileupload.File.dataBase64,
            FileName: $scope.fileupload.File.dataFile.name,
        };
        var jsonobject = {};
        jsonobject.Json = requestData;
        
        $scope.loading = true;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var readData = response.data;
            $rootScope.Throbber.Visible = false;
            if (readData.IsValidExcel) {
                if (!readData.IsError) {
                    $scope.OpenConfirmationPopuScreen('ST Upload', 'Uploaded succsessfully.', 'Close');
                    $scope.ParentJson = readData.Parent;
                    $scope.ChildJson = readData.Child;
                    $scope.IsSubmitInquiryButton = true;
                } else {
                    if (readData.IsInCorrectData) {
                        $scope.OpenConfirmationPopuScreen('ST Upload', 'Please fix and map the data and upload the file again.', 'Close');
                        $scope.isShowErrorRecord = true;                      
                        $scope.IsSubmitInquiryButton = false;
                    }
                    else {
                        $scope.OpenConfirmationPopuScreen('ST Upload', 'Excel has Error record. Please fix all errors and upload the file again.', 'Close');
                        $scope.isShowErrorRecord = true;
                        $scope.errorRecord = readData.ErrorRecord;
                        $scope.IsSubmitInquiryButton = false;
                    }
                }
            }
            else {
                if (readData.IsFileAlreadyPresent) {
                    $scope.OpenConfirmationPopuScreen('ST Upload', 'This file was uploaded previously. Please upload new file.', 'Close');
                    $scope.IsSubmitInquiryButton = false;
                   
                }
                else {
                    $scope.OpenConfirmationPopuScreen('ST Upload', 'Invalid Excel file.', 'Close');
                    $scope.IsSubmitInquiryButton = false;
                }
            }
            $scope.loading = false;
            $scope.Clear();
        });
    };


    $scope.Clear = function () {
        $scope.fileupload.File = "Select file to upload";
        angular.element("input[type='file']").val(null);
    }







    //var json = {
    //    "data": [
    //      {
    //          Parent: "[{\"Branchplantcode\":6430,\"Shiptoid\":1110900,\"Trucksize\":\"14T\",\"OrderDate (dd/MM/yyyy)\":\"23/10/2017\",\"Itemcode\":65801001,\"UOM\":null,\"Quantity\":10,\"ItemId\":97,\"ItemName\":\"Affligem Blond 300x24B Ctn\",\"ShipToId\":18,\"ShipToName\":\"BM-DNTN THUONG MAI LAM HAI\",\"TruckSizeId\":1,\"branchPlant\":6},{\"Branchplantcode\":6441,\"Shiptoid\":1111319,\"Trucksize\":\"22T\",\"OrderDate (dd/MM/yyyy)\":\"23/10/2017\",\"Itemcode\":65305011,\"UOM\":null,\"Quantity\":15,\"ItemId\":102,\"ItemName\":\"Bivina 330x24C Ctn\",\"ShipToId\":35,\"ShipToName\":\"PK6-CTY TNHH MTV TMDV TOAN THINH GIA LAI\",\"TruckSizeId\":2,\"branchPlant\":6}]",
    //          Child: "[{\"Branchplantcode\":6430,\"Shiptoid\":1110900,\"Trucksize\":\"14T\",\"OrderDate (dd/MM/yyyy)\":\"23/10/2017\",\"Itemcode\":65801001,\"UOM\":null,\"Quantity\":10,\"ItemId\":97,\"ItemName\":\"Affligem Blond 300x24B Ctn\",\"ShipToId\":18,\"ShipToName\":\"BM-DNTN THUONG MAI LAM HAI\",\"TruckSizeId\":1,\"branchPlant\":6},{\"Branchplantcode\":6430,\"Shiptoid\":1110900,\"Trucksize\":\"14T\",\"OrderDate (dd/MM/yyyy)\":\"23/10/2017\",\"Itemcode\":66003001,\"UOM\":null,\"Quantity\":12,\"ItemId\":101,\"ItemName\":\"BGI 450x20B Crt\",\"ShipToId\":18,\"ShipToName\":\"BM-DNTN THUONG MAI LAM HAI\",\"TruckSizeId\":1 ,\"branchPlant\":6},{\"Branchplantcode\":6441,\"Shiptoid\":1111319,\"Trucksize\":\"22T\",\"OrderDate (dd/MM/yyyy)\":\"23/10/2017\",\"Itemcode\":65305011,\"UOM\":null,\"Quantity\":15,\"ItemId\":102,\"ItemName\":\"Bivina 330x24C Ctn\",\"ShipToId\":35,\"ShipToName\":\"PK6-CTY TNHH MTV TMDV TOAN THINH GIA LAI\",\"TruckSizeId\":2,\"branchPlant\":6},{\"Branchplantcode\":6441,\"Shiptoid\":1111319,\"Trucksize\":\"22T\",\"OrderDate (dd/MM/yyyy)\":\"23/10/2017\",\"Itemcode\":65303001,\"UOM\":null,\"Quantity\":20,\"ItemId\":104,\"ItemName\":\"Bivina 450x20B Crt\",\"ShipToId\":35,\"ShipToName\":\"PK6-CTY TNHH MTV TMDV TOAN THINH GIA LAI\",\"TruckSizeId\":2,\"branchPlant\":6},{\"Branchplantcode\":6430,\"Shiptoid\":1110900,\"Trucksize\":\"14T\",\"OrderDate (dd/MM/yyyy)\":\"23/10/2017\",\"Itemcode\":65705131,\"UOM\":null,\"Quantity\":16,\"ItemId\":105,\"ItemName\":\"Desperados 330x12C Ctn\",\"ShipToId\":18,\"ShipToName\":\"BM-DNTN THUONG MAI LAM HAI\",\"TruckSizeId\":1,\"branchPlant\":6}]"
    //      }
    //    ]
    //}
    //

    //$scope.ParentJson = JSON.parse(json.data[0].Parent);
    //
    //$scope.ChildJson = JSON.parse(json.data[0].Child);




    $scope.SaveSingleInquiry = function (status, parentEnquiryData) {

        
        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        }

        $scope.EnquiryList = [];


        var equirydata = {};

        equirydata.EnquiryId = parentEnquiryData.EnquiryId;
        //if (parentEnquiryData.RequestDate !== undefined) {
        //    var tempdate = parentEnquiryData.RequestDate.split('T');
        //    if (tempdate.length > 1) {
        //        
        //        var date = tempdate[0].split('-');
        //        var time = tempdate[1].split(':');
        //        var sec = time[2].split('.');
        //        date = date[2] + '/' + date[1] + '/' + date[0];
        //    }
        //}
        // equirydata.ExpectedTimeOfDelivery = parentEnquiryData.RequestDate;
        equirydata.RequestDate = parentEnquiryData.RequestDate;
        equirydata.EnquiryType = "ST";
        equirydata.OrderType = "ST";
        equirydata.ShipTo = parentEnquiryData.ToBranchPlantId;
        equirydata.SoldTo = parentEnquiryData.ToBranchPlantId;
        equirydata.ShipToCode = parentEnquiryData.ToBranchPlant;
        equirydata.SoldToCode = parentEnquiryData.ToBranchPlant;

        equirydata.TruckSizeId = parentEnquiryData.TruckSizeId;
        equirydata.branchPlant = parentEnquiryData.BranchPlantId;
        enquiydata.BranchPlantCode = parentEnquiryData.FromBranchPlant;
        equirydata.IsActive = true;
        equirydata.PreviousState = 0;
        equirydata.CurrentState = status;
        equirydata.CreatedBy = $rootScope.UserId;
        equirydata.EnquiryProductList = [];

        var EnquiryProduct = $scope.ChildJson.filter(function (el) {
            return el.BranchPlantCode === parentEnquiryData.BranchPlantCode && el.ShipTo === parentEnquiryData.ShipTo
                && el.TruckSize === parentEnquiryData.TruckSize && el.RequestDate === parentEnquiryData.RequestDate;
        });

        for (var j = 0; j < EnquiryProduct.length; j++) {
            var equiryProductdata = {};
            equiryProductdata.EnquiryProductId = EnquiryProduct[j].EnquiryProductId;
            equiryProductdata.ItemId = EnquiryProduct[j].ItemId;
            equiryProductdata.ItemName = EnquiryProduct[j].ItemName;
            equiryProductdata.ProductCode = EnquiryProduct[j].ItemCode;
            equiryProductdata.ItemShortCode = EnquiryProduct[j].ItemShortCode;
            equiryProductdata.PrimaryUnitOfMeasure = EnquiryProduct[j].UOM;
            equiryProductdata.ProductQuantity = EnquiryProduct[j].Quantity;
            equiryProductdata.ProductType = EnquiryProduct[j].ProductType;
            equiryProductdata.ItemType = EnquiryProduct[j].ProductType;
            equiryProductdata.WeightPerUnit = EnquiryProduct[j].ItemWeightPerUnit;
            equiryProductdata.IsActive = true;
            equirydata.EnquiryProductList.push(equiryProductdata);
        }
        $scope.EnquiryList.push(equirydata);


        var Action = "";
        if ($scope.EnquiryList[0].EnquiryId !== undefined && $scope.EnquiryList[0].EnquiryId !== 0 && $scope.EnquiryList[0].EnquiryId !== null) {
            Action = "UpdateEnquiry";
        } else {
            Action = "SaveEnquiryForST";
        }
        var Enquiry =
            {
                ServicesAction: Action,
                EnquiryList: $scope.EnquiryList

            }



        
        var requestData =
            {
                ServicesAction: 'GetAllTruckSizeList',
            };




        
        //  var stringfyjson = JSON.stringify(Enquiry);
        var jsonobject = {};
        jsonobject.Json = Enquiry;


        

        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var resoponsedata = response.data;
            $scope.CreateOrder($scope.EnquiryList);
            $scope.loading = false;
        });


    }




    //$scope.SingleInquiry = function (parentEnquiryData) {
    //    
    //    $scope.SaveSingleInquiry(1, parentEnquiryData);
    //}

    $scope.SingleAsDraftInquiry = function (parentEnquiryData) {
        
        $scope.SaveSingleInquiry(8, parentEnquiryData);
    }


    $scope.SaveInquiry = function (status) {

        

        if ($rootScope.Throbber !== undefined) {
            $rootScope.Throbber.Visible = true;
        } else {
            $rootScope.Throbber = {
                Visible: true,
            }
        }

        $scope.EnquiryList = [];

        for (var i = 0; i < $scope.ParentJson.length; i++) {
            var equirydata = {};

            equirydata.EnquiryId = $scope.ParentJson[i].EnquiryId;
            //if ($scope.ParentJson[i].RequestDate !== undefined) {
            //    var tempdate = $scope.ParentJson[i].RequestDate.split('T');
            //    if (tempdate.length > 1) {
            //        
            //        var date = tempdate[0].split('-');
            //        var time = tempdate[1].split(':');
            //        var sec = time[2].split('.');
            //        date = date[2] + '/' + date[1] + '/' + date[0];
            //    }
            //}
            equirydata.RequestDate = $scope.ParentJson[i].RequestDate
            // equirydata.ExpectedTimeOfDelivery = $scope.ParentJson[i].RequestDate;
            equirydata.EnquiryType = "ST";
            equirydata.OrderType = "ST";

            equirydata.ShipTo = $scope.ParentJson[i].ToBranchPlantId;
            equirydata.SoldTo = $scope.ParentJson[i].ToBranchPlantId;
            equirydata.ShipToCode = $scope.ParentJson[i].ToBranchPlant;
            equirydata.SoldToCode = $scope.ParentJson[i].ToBranchPlant;
            equirydata.TruckSizeId = $scope.ParentJson[i].TruckSizeId;
            equirydata.branchPlant = $scope.ParentJson[i].BranchPlantId;
            equirydata.StockLocationId = $scope.ParentJson[i].FromBranchPlantId;
            equirydata.BranchPlantCode = $scope.ParentJson[i].FromBranchPlant;
            equirydata.Carrier = $scope.ParentJson[i].Carrier;
            equirydata.IsActive = true;
            equirydata.PreviousState = 0;
            equirydata.CurrentState = status;
            equirydata.CreatedBy = $rootScope.UserId;
            equirydata.OrderProductList = [];


            var EnquiryProductAll = $scope.ParentJson[i].OrderProductList;

            for (var j = 0; j < EnquiryProductAll.length; j++) {
                var equiryProductdata = {};
                equiryProductdata.EnquiryProductId = EnquiryProductAll[j].EnquiryProductId;
                equiryProductdata.ItemId = EnquiryProductAll[j].ItemId;
                equiryProductdata.ItemName = EnquiryProductAll[j].ItemName;
                equiryProductdata.ProductCode = EnquiryProductAll[j].ItemCode;
                equiryProductdata.ItemShortCode = EnquiryProductAll[j].ItemShortCode;
                equiryProductdata.PrimaryUnitOfMeasure = EnquiryProductAll[j].UOM;
                equiryProductdata.ProductQuantity = EnquiryProductAll[j].Quantity;
                equiryProductdata.ProductType = EnquiryProductAll[j].ProductType;
                equiryProductdata.WeightPerUnit = EnquiryProductAll[j].ItemWeightPerUnit;
                equiryProductdata.IsActive = true;
                equirydata.OrderProductList.push(equiryProductdata);
            }
            $scope.EnquiryList.push(equirydata);
        }


        $scope.CreateOrder($scope.EnquiryList);

        //var Enquiry =
        //    {
        //        ServicesAction: 'SaveEnquiryForST',
        //        EnquiryList: $scope.EnquiryList
        //    }

        //
        //var requestData =
        //    {
        //        ServicesAction: 'GetAllTruckSizeList',
        //    };        
        //
        ////  var stringfyjson = JSON.stringify(Enquiry);
        //var jsonobject = {};
        //jsonobject.Json = Enquiry;

        //

        //GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        //    
        //    var resoponsedata = response.data;
        //    //$scope.CreateOrder($scope.EnquiryList);
        //    $scope.ParentJson = [];
        //    $scope.ChildJson = [];
        //    $scope.IsSubmitInquiryButton = false;
        //    $scope.loading = false;
        //});


    }


    $scope.CreateOrder = function (enquiryDetails) {
        
        var requestData =
            {
                ServicesAction: 'BulkInserSTOrder',
                EnquiryDetailList: enquiryDetails,
                UserName: $rootScope.UserName
            };


        //  var stringfyjson = JSON.stringify(requestData);
        var consolidateApiParamater =
            {
                Json: requestData,
            };
        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            $rootScope.Throbber.Visible = false;
            $scope.IsSubmitInquiryButton = false;
            $scope.EnquiryList = [];
            $scope.ParentJson = [];
            $rootScope.ValidationErrorAlert('Record saved successfully.', '', 3000);

        });
    }



    $scope.SaveAllInquiry = function () {
        $scope.SaveInquiry(1);
    }

    $scope.SaveAllAsDraftInquiry = function () {
        $scope.SaveInquiry(8);
    }


});