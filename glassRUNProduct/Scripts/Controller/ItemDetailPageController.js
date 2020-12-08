angular.module("glassRUNProduct").controller('ItemDetailPageController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, GrRequestService) {
    
    if ($rootScope.Throbber !== undefined) {
        $rootScope.Throbber.Visible = true;
    } else {
        $rootScope.Throbber = {
            Visible: true,
        }
    }

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $scope.LoadItemView = function () {

        var requestData =
            {
                ServicesAction: 'LoadItemByItemCode',
                ItemCode: $rootScope.ItemCode
            };


        var consolidateApiParamater =
            {
                Json: requestData,
            };

        

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            
            $scope.LookupList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'UnitOfMeasure'; });
            $scope.ItemDetailInfo = response.data.Json.ItemList;
            if ($scope.ItemDetailInfo != undefined) {
                $scope.ItemId = $scope.ItemDetailInfo.ItemId;
                if ($scope.ItemDetailInfo.IsActive === "1") {
                    $scope.ItemDetailInfo.ItemStatus = "Active";
                    $scope.ItemDetailInfo.IsChecked = true;
                } else {
                    $scope.ItemDetailInfo.ItemStatus = "InActive";
                    $scope.ItemDetailInfo.IsChecked = false;
                }
            }
            $rootScope.Throbber.Visible = false;

        });

    }
    $scope.LoadItemView();

    $scope.UpdateItemUOMConversionFector = function () {
        
        $rootScope.Throbber.Visible = true;
        var isValidation = true;
        if ($scope.ItemDetailInfo.ItemUOMList.length > 0) {
            for (var i = 0; i < $scope.ItemDetailInfo.ItemUOMList.length; i++) {
                if ($scope.ItemDetailInfo.ItemUOMList[i].UOM === $scope.ItemDetailInfo.ItemUOMList[i].RelatedUOM) {
                    isValidation = false;
                    break;
                }
            }
        }
        if (isValidation === true) {
            
            var requestData =
                {
                    ServicesAction: 'UpdateUOMConversionFector',
                    UnitOfMeasureList: $scope.ItemDetailInfo.ItemUOMList
                };

            var consolidateApiParamater =
                {
                    Json: requestData,
                };

            

            GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
                
                $rootScope.ValidationErrorAlert('Item UOM ConversionFector Updated Successfully.', 'error', 3000);
                $rootScope.Throbber.Visible = false;
            });

        } else {
            $rootScope.ValidationErrorAlert('UOM And Related UOM Should be different.', 'error', 3000);
            $rootScope.Throbber.Visible = false;
        }
    }

    $scope.AddNewUOM = function () {
        
        var NewUOMJson = {
            UnitOfMeasureIdGUID: generateGUID(),
            UnitOfMeasureId: 0,
            ItemId: $scope.ItemId,
            UOM: '',
            RelatedUOM: '',
            ConversionFactor: '0',
            UOMStructure: '',
            ConversionFactorSecondaryToPrimary: '',
            IsActive: true
        }
        if ($scope.ItemDetailInfo.ItemUOMList !== undefined) {
            $scope.ItemDetailInfo.ItemUOMList.push(NewUOMJson);
        } else {
            var ItemUOMList = [];
            ItemUOMList.push(NewUOMJson);

            $scope.ItemDetailInfo['ItemUOMList'] = ItemUOMList;
        }
    }



    $scope.RemoveNewUOM = function (unitOfMeasureId, uomGUId) {
        
        if (unitOfMeasureId === '0') {
            $scope.ItemDetailInfo.ItemUOMList = $scope.ItemDetailInfo.ItemUOMList.filter(function (el) { return el.UnitOfMeasureIdGUID !== uomGUId; });
        } else {
            var itemDetailInfo = $scope.ItemDetailInfo.ItemUOMList.filter(function (el) { return el.UnitOfMeasureId === unitOfMeasureId; });
            if (itemDetailInfo.length > 0) {
                itemDetailInfo[0].IsActive = false;
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


   $scope.GoBackToPage = function(){
    
                $state.go("ItemSoldToMapping");

    };

    $scope.UpdateStatusOfItem = function () {

        if($scope.ItemId !== undefined && $scope.ItemId !== 0 && $scope.ItemId !== "")
        {
            var requestData =
                {
                    ServicesAction: 'DeleteItem',
                    ItemId: $scope.ItemId,
                    IsActive: $scope.ItemDetailInfo.IsChecked
                };

            var jsonobject = {};
            jsonobject.Json = requestData;
            GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                var activemsg = "";
                if ($scope.ItemDetailInfo.IsChecked === false) {
                    activemsg = "InActive";
                }
                else {
                    activemsg = "Active";
                }
                $rootScope.ValidationErrorAlert('Item ' + activemsg + ' successfully', '', 3000);
                $scope.LoadItemView();
            });
        }

    };

});