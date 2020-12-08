angular.module("glassRUNProduct").controller('EnquiryMOTController', function ($scope, $rootScope, $filter, $location, $sessionStorage, $ionicModal, $state, focus, pluginsService, GrRequestService) {
    

    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    //if ($rootScope.IsEnquiryEditedByCustomerService == true) {
    //    $scope.TempCompanyId = $rootScope.TempCompanyId;
    //    $scope.TempCompanyMnemonic = $rootScope.TempCompanyMnemonic;


    //}
    //else {
    //    $scope.TempCompanyId = $rootScope.CompanyId;
    //    $scope.TempCompanyMnemonic = $rootScope.CompanyMnemonic;
    //}
    ///Veriable Declare....
    $scope.bindallCompanyList = [];
    $scope.showItembox = false;
    $rootScope.foundResult = false;
    $scope.tempDeliveryUsedCapacity = 0;
    $scope.DeliveryUsedCapacity = 0;
    $scope.DeliveryLocationCapacity = 0;
    $scope.predicates = {
        InputCustomer: ''
    };

    $scope.PalettesWidth = {
        width: "0%"
    };
    $scope.bindAllSettingMaster = $sessionStorage.AllSettingMasterData;
    $scope.ordermanagement =
        {
            RequestDate: "",
            itemsName: 0,
            RequestDate: "",
            OrderDate: new Date()
        };

    $scope.ordermanagement.OrderDate = new Date();
    ///End Veriable Declare......


    $scope.inputChangeHandler = function (input) {
        
        if (input.length > 0) {
            $scope.showItembox = true;
        } else {
            $scope.showItembox = false;
        }
    }


    ///Load All Customer
    var requestMotCustomerData =
        {
            ServicesAction: 'LoadAllCompanyDetailListByDropDown',
            CompanyId: 0
        };

    //var stringfyjson = JSON.stringify(requestData);
    var jsonobjectMot = {};
    jsonobjectMot.Json = requestMotCustomerData;
    GrRequestService.ProcessRequest(jsonobjectMot).then(function (responseMOT) {
        
        $rootScope.Throbber.Visible = false;
        var resoponseMOTdata = responseMOT.data.Json;
        $scope.bindallCompanyList = resoponseMOTdata.CompanyList;
    });


    $scope.GetReceivingLocationBalanceCapacity = function (deliverylocationId, proposedDeliveryDate) {
        
        var requestData =
            {
                ServicesAction: 'GetReceivingLocationBalanceCapacity',
                CompanyId: $scope.TempCompanyId,
                ShipTo: deliverylocationId,
                ProposedDeliveryDate: proposedDeliveryDate,
                EnquiryId: $scope.EnquiryId,
            };

        // var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            // var resoponsedata = JSON.parse(JSON.parse(response.data));
            var resoponsedata = response.data.Json.BalanceCapacity;

            $scope.DeliveryUsedCapacity = resoponsedata;

        });
    }





    $scope.GetScheduleDate = function (startDate, endDate) {
        
        $('.customdate-picker').each(function () {
            
            $(this).datepicker({
                onSelect: function (dateText, inst) {
                    
                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                    }
                },
                minDate: startDate,
                maxDate: endDate,
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });
    }

    $scope.GetProposedDeliveryDate = function (locationId) {
        
        var requestData =
            {
                ServicesAction: 'GetProposedDeliveryDate',
                DeliveryLocation: {
                    LocationId: locationId,
                },
                CompanyId: $scope.TempCompanyId,
                Company: {
                    CompanyId: $scope.TempCompanyId,
                },
                RuleType: 1
            };

        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            var responseStr = response.data.Json;

            if (responseStr.ProposedDate === '' || responseStr.ProposedDate === undefined) {
                var getDefaultSettingValue = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ProposedDeliveryDate'; });
                if (getDefaultSettingValue.length > 0) {
                    var someDate = new Date();
                    var numberOfDaysToAdd = parseInt(getDefaultSettingValue[0].SettingValue);
                    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                    var dd = someDate.getDate();
                    var mm = someDate.getMonth() + 1;
                    var y = someDate.getFullYear();
                    var someFormattedDate = dd + '/' + mm + '/' + y;



                    

                    $scope.ProposedDate = someFormattedDate;




                }
                else {
                    $scope.ProposedDate = 'N/A'
                }


            }
            else {

                $scope.ProposedDate = responseStr.ProposedDate;
            }
            



            $scope.GetReceivingLocationBalanceCapacity(locationId, $scope.ProposedDate);


            var GetScheduleDateNumber = 6;
            var truckBufferWeight = $scope.bindAllSettingMaster.filter(function (el) { return el.SettingParameter === 'ScheduleDateNumber'; });
            if (truckBufferWeight.length > 0) {
                GetScheduleDateNumber = parseFloat(truckBufferWeight[0].SettingValue);
            }

            
            $scope.date = $filter('date')($scope.ordermanagement.OrderDate, 'dd/MM/yyyy');


            var date = $scope.date;

            var proposedetd = date.split(' ');
            var etd = proposedetd[0].split('/');
            var etddate = etd[1] + "/" + etd[0] + "/" + etd[2];

            var enddate = new Date(etddate);
            enddate.setDate(enddate.getDate() + GetScheduleDateNumber);

            var dd = enddate.getDate();
            var mm = enddate.getMonth() + 1;
            var y = enddate.getFullYear();
            var SchedulingDate = dd + '/' + mm + '/' + y;

            $scope.GetScheduleDate($scope.ProposedDate, SchedulingDate);

        });
    };



    ///Load Customer OtherInformation

    $scope.getSelectValue = function (id) {
        
        var truckObjDetailsSelected = $scope.bindTruckSize.filter(function (el) { return el.Selected === true });
        if (truckObjDetailsSelected.length > 0) {
            
            if ($scope.bindTruckSize.length == 1) {
                return false;
            }


            truckObjDetailsSelected[0].Selected = false;
        }
        var truckObjDetails = $scope.bindTruckSize.filter(function (el) { return el.TruckSizeId === id });
        if (truckObjDetails.length > 0) {
            $scope.TruckSizeId = id;
            $scope.TruckSize = truckObjDetails[0].TruckSize;
            $scope.TruckCapacity = (parseFloat(truckObjDetails[0].TruckCapacityWeight) * 1000);
            $scope.TruckCapacityInTone = $scope.TruckCapacity / 1000;
            $scope.TruckCapacityFullInTone = 0;
            $scope.TruckCapacityFullInPercentage = 0;

            var requestAreaData =
                {
                    ServicesAction: 'GetRuleValue',
                    LocationId: $scope.DeliveryLocationId,
                    CompanyId: $scope.TempCompanyId,
                    RuleType: 5,
                    Area: $scope.DeliveryArea,
                    TruckSize: parseFloat($scope.TruckCapacityInTone)
                };


            $scope.AreaPalettesCount = 0
            var jsonobjectArea = {};
            jsonobjectArea.Json = requestAreaData;
            GrRequestService.ProcessRequest(jsonobjectArea).then(function (arearesponse) {
                


                $rootScope.Throbber.Visible = false;

                var arearesponseStr = arearesponse.data.Json;

                if (arearesponseStr.RuleValue != '' || arearesponseStr.RuleValue != undefined) {
                    var rulevalue = parseInt(arearesponseStr.RuleValue);
                    $scope.AreaPalettesCount = rulevalue;
                }



                if ($scope.AreaPalettesCount > 0) {

                    $scope.TruckCapacityPalettes = $scope.AreaPalettesCount;
                    truckObjDetails[0].TruckCapacityPalettes = $scope.AreaPalettesCount;
                }
                else {
                    $scope.TruckCapacityPalettes = truckObjDetails[0].TruckCapacityPalettes;
                }



                

                $scope.buindingPalettes = []
                for (var i = 0; i < $scope.TruckCapacityPalettes; i++) {
                    var palettes = {
                        PalettesWidth: 0
                    }
                    $scope.buindingPalettes.push(palettes);
                }

                if ($scope.buindingPalettes.length > 0) {
                    $scope.IsPalettesRequired = true;
                } else {
                    $scope.IsPalettesRequired = false;
                }

                var space = 100 - ($scope.buindingPalettes.length - 1);
                var width = space / $scope.buindingPalettes.length;
                $scope.PalettesWidth.width = width + "%";


                // $scope.ReloadGraph(currentOrder, 0);

                truckObjDetails[0].Selected = true;

            });
        }

    }



    $scope.LoadTruckSizeBelongsToLoactionIdAndCompanyId = function (locationId) {
        
        var requestData =
            {
                ServicesAction: 'GetTruckDetailByLocationIdAndCompanyId',
                LocationId: locationId,
                CompanyId: $scope.TempCompanyId
            };

        //var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            

            var resoponsedata = response.data;
            if (resoponsedata != null) {
                $scope.bindTruckSize = resoponsedata.Json.EnquiryList;

                

                if ($rootScope.TemOrderData != undefined) {
                    if ($rootScope.TemOrderData.length > 0) {




                        if ($rootScope.CurrentOrderGuid == '' || $rootScope.CurrentOrderGuid == undefined) {
                            currentOrder = $scope.OrderData.filter(function (el) { return el.IsTruckFull === false; });
                        }
                        else {
                            currentOrder = $scope.OrderData.filter(function (el) { return el.OrderGUID === $rootScope.CurrentOrderGuid; });
                        }



                        if (currentOrder.length > 0) {
                            $scope.EnquiryId = parseInt(currentOrder[0].EnquiryId);

                            var product = currentOrder[0].OrderProductList.length;

                            if (product === 0) {
                                $scope.getSelectValue($scope.bindTruckSize[0].TruckSizeId);
                            }
                            else {
                                $scope.getSelectValue(currentOrder[0].TruckSizeId);
                            }





                            
                        }

                    }
                    else {
                        if ($scope.bindTruckSize.length == 1) {
                            $scope.getSelectValue($scope.bindTruckSize[0].TruckSizeId);
                        }
                    }
                }
                else {
                    if ($scope.bindTruckSize.length == 1) {
                        $scope.getSelectValue($scope.bindTruckSize[0].TruckSizeId);
                    }
                }

            }
            else {
                $scope.bindTruckSize = [];

            }


        });
    };



    $scope.GetDeliveryLoaction = function (companyId) {
        ///2
        
        var requestData =
            {
                ServicesAction: 'LoadAllDeliveryLocation',
                CompanyId: companyId
            };

        // var stringfyjson = JSON.stringify(requestData);
        var jsonobject = {};
        jsonobject.Json = requestData;
        GrRequestService.ProcessRequest(jsonobject).then(function (response) {
            
            $scope.PromotionItemList = [];
            // var resoponsedata = JSON.parse(JSON.parse(response.data));
            var resoponsedata = response.data;
            $scope.bindDeliverylocation = resoponsedata.DeliveryLocation.DeliveryLocationList;

            if ($scope.bindDeliverylocation.length == 1) {
                $scope.DeliveryLocationCapacity = 0;
                $scope.DeliveryArea = '';
                
                $scope.DeliveryLocationId = $scope.bindDeliverylocation[0].DeliveryLocationId;


                var deliveryObjDetailsSelected = $scope.bindDeliverylocation.filter(function (el) { return el.IsDeliveryLocationSelected === true });
                if (deliveryObjDetailsSelected.length > 0) {
                    deliveryObjDetailsSelected[0].IsDeliveryLocationSelected = false;
                }

                var deliveryObjDetails = $scope.bindDeliverylocation.filter(function (el) { return el.DeliveryLocationId === $scope.DeliveryLocationId });
                if (deliveryObjDetails.length > 0) {

                    $scope.DeliveryArea = deliveryObjDetails[0].Area;

                    

                    var requestPromotionData =
                        {
                            ServicesAction: 'GetPromotionFocItemList',
                            CompanyId: $scope.TempCompanyId,
                            Region: $scope.DeliveryArea
                        };


                    var jsonPromotionobject = {};
                    jsonPromotionobject.Json = requestPromotionData;
                    GrRequestService.ProcessRequest(jsonPromotionobject).then(function (Promotionresponse) {
                        

                        var resoponsedata = Promotionresponse.data;
                        if (resoponsedata.PromotionFocItemDetail !== undefined) {
                            $scope.PromotionItemList = resoponsedata.PromotionFocItemDetail.PromotionFocItemDetailList;
                        }


                    });



                    $scope.DeliveryLocationName = deliveryObjDetails[0].DeliveryLocationName;
                    $scope.DeliveryLocationCapacity = deliveryObjDetails[0].Capacity;

                    deliveryObjDetails[0].IsDeliveryLocationSelected = true;

                }

                $scope.LoadTruckSizeBelongsToLoactionIdAndCompanyId($scope.DeliveryLocationId);

                $scope.GetProposedDeliveryDate($scope.DeliveryLocationId);


            } else {
                $rootScope.Throbber.Visible = false;
            }


        });

    }






    $scope.GetCompanyDetails = function (e) {
        
        $scope.showItembox = false;
        //$rootScope.Throbber.Visible = true;

        $scope.GetDeliveryLoaction(e.CompanyId);
        $rootScope.CreditLimit = 10000000000;
        $rootScope.AvailableCreditLimit = 10000000000;
        $rootScope.EmptiesLimit = 0;
        $rootScope.ActualEmpties = 0;

        //var requestData =
        //    {

        //        ServicesAction: 'GetCreditLimitFromThirthParty',
        //        CompanyId: e.CompanyId,
        //        CompanyMnemonic: e.CompanyMnemonic
        //    };



        //var jsonobject = {};
        //jsonobject.Json = requestData;
        //GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        //    
        //    // $rootScope.Throbber.Visible = false;
        //    var resoponsedata = response.data.Json;

        //    $rootScope.CreditLimit = resoponsedata.CreditLimit;
        //    $rootScope.AvailableCreditLimit = resoponsedata.AvailableCreditLimit;
        //    $rootScope.EmptiesLimit = 0;
        //    $rootScope.ActualEmpties = 0;



        //    requestData =
        //        {
        //            ServicesAction: 'LoadAvailableCreditLimitOfCustomer',
        //            CompanyId: $scope.TempCompanyId
        //        };


        //    jsonobject = {};
        //    jsonobject.Json = requestData;
        //    GrRequestService.ProcessRequest(jsonobject).then(function (response) {
        //        


        //        var resoponsedata = response.data.Json;
        //        $rootScope.EmptiesLimit = resoponsedata.EmptiesLimit;
        //        $rootScope.ActualEmpties = resoponsedata.ActualEmpties;

        //        $rootScope.AvailableCreditLimit = Number($rootScope.AvailableCreditLimit) - Number(resoponsedata.TotalEnquiryCreated);

        //        if (Number($rootScope.ActualEmpties) > Number($rootScope.EmptiesLimit)) {
        //            $scope.warningTitle = "Message";
        //            $scope.warningMessage = "Your account is currently on empites Hold. ";
        //            $scope.OpenWarningMessageControl();
        //        }
        //    });


        //});



    }








}).filter('multipleTags', function ($filter, $rootScope) {
    return function multipleTags(items, predicates) {


        predicates = predicates.split(' ')

        angular.forEach(predicates, function (predicate) {
            items = $filter('filter')(items, { CompanyNameAndMnemonic: predicate.trim() });
        })

        if (items != undefined) {
            if (items.length === 0) {
                $rootScope.foundResult = true;
            }
            else {
                $rootScope.foundResult = false;
            }
        } else {
            $rootScope.foundResult = false;
        }

        return items;
    }

}).directive('ngEnter', function () {

    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})