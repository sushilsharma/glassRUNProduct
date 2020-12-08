angular.module("glassRUNProduct").directive('itemDropDownComponent', function (Logger) {
    return {
        restrict: 'E',
        scope: {

            resData: '=',
            pageContrlAcessData: '=',
            selecteditemevent: "&",
            inputItem: '=',
            filterAutoCompletebox: "=",
            isDisabled: "="
        },
        templateUrl: 'Directives/ItemDropDownComponent/ItemDropDownComponentView.html',
        controller: function ($scope, $rootScope, $ionicModal, GrRequestService) {


            debugger;

            
            //$scope.inputItem = "";
            //$scope.filterAutoCompletebox = "";
            $scope.selectedRow = -1;
            $scope.showItembox = false;
            $rootScope.foundResult = false;
            $scope.foundItemResult = false;



            $scope.selectedRow = -1;
            $scope.showItembox = false;
            $rootScope.foundResult = false;


            $scope.LoadItemListByCompany = function () {




                debugger;
                var requestData =
				{
				    ServicesAction: 'LoadAllProducts',
				    CompanyId: $rootScope.CompanyId,
                    ItemValue: $scope.inputItem,
                    IsRPM: $rootScope.IsRPM
				};

                var jsonobject = {};
                jsonobject.Json = requestData;
                GrRequestService.ProcessRequest(jsonobject).then(function (response) {
                    debugger;
                    var resoponsedata = response.data;

                    $scope.bindAllProduct = [];

                    if (typeof resoponsedata.Item !== 'undefined') {
                        $scope.bindAllProduct = resoponsedata.Item.ItemList;
                    }
                    else {
                        $scope.foundItemResult = true;
                    }
                    $rootScope.Throbber.Visible = false;
                });
            }



            $scope.OpenModalPopupToAddNewItem = function () {
                $scope.showItembox = false;
                $scope.OpenAddItemInMasterPopup();
            }

            $scope.OpenAddItemInMasterPopup = function () {
                $rootScope.ItemAddedModalPopupControl = true;
            }




            $scope.ItemInputSelecteChangeEvent = function (input) {
                debugger;
                if (input.length > 0) {

                    if (input.length >= 4) {
                        $rootScope.Throbber.Visible = true;


                        $scope.LoadItemListByCompany();
                    } else {
                        $scope.bindAllProduct = [];
                    }
                    $scope.showItembox = true;
                    $scope.selectedRow = 0;
                } else {
                    $scope.showItembox = false;
                    $scope.selectedRow = -1;
                }
                $scope.filterAutoCompletebox = input;
            }
            $scope.ClearItemInputSearchbox = function () {
                debugger;
                $scope.Allocation = 'NA';
                $scope.showItembox = false;
                $scope.ClearItemRecord();
            }


            //$scope.predicates = {
            //	inputItem: '',
            //	FilterAutoCompletebox: ''
            //};


            $scope.ShowItemListBox = function () {
                $scope.showItembox = !$scope.showItembox;
            }


            $scope.ClearItemRecord = function () {

                $scope.inputItem = "";
                $scope.filterAutoCompletebox = "";

            }



            $scope.GetItemSelected = function (result) {

                debugger;

                $scope.selecteditemevent(result);

                $scope.showItembox = false;
                $scope.inputItem = result.ItemNameCode;

            }




            $rootScope.ClearItemDropDown = function () {
                $scope.bindAllProduct = [];
                $scope.ClearItemInputSearchbox();
            }



        },
        link: function (scope, elem, attrs, ctrl) {
            var elemFocus = false;
            elem.on('mouseenter', function () {
                elemFocus = true;
            });

            elem.on('mouseleave', function () {
                elemFocus = true;
            });



            elem.on('keydown', function (e) {



                if (scope.showItembox === true) {
                    var ul = document.querySelector('div.angucomplete-dropdown');
                    var nodes = document.querySelectorAll('.angucomplete-dropdown > .angucomplete-row');

                    var elHeight = $(nodes).height();

                    var scrollTop = $(ul).scrollTop();
                    var viewport = scrollTop + $(ul).height();
                    var elOffset = 0;

                    if (elemFocus) {
                        if (e.keyCode == 38) {
                            if (scope.selectedRow == 0) {
                                scope.inputItem = scope.filterAutoCompletebox;
                                scope.$apply();
                                e.preventDefault();
                                return;
                            }
                            scope.selectedRow--;

                            scope.inputItem = scope.bindAllProduct[scope.selectedRow].ItemNameCode;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 40) {
                            if (scope.selectedRow == scope.bindAllProduct.length - 1) {
                                return;
                            }
                            scope.selectedRow++;

                            scope.inputItem = scope.bindAllProduct[scope.selectedRow].ItemNameCode;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 13) {
                            for (var i = 0; i < scope.bindAllProduct.length; i++) {
                                if (scope.selectedRow >= 0) {
                                    if (i == scope.selectedRow) {
                                        scope.selectedRow = -1;
                                        //scope.getItemPrice(scope.bindallproduct[i].ItemId, scope.EditedEnquiryId, 0, 0, true);


                                        scope.GetItemSelected(scope.bindAllProduct[i]);
                                    }
                                }
                            }
                        }

                        elOffset = elHeight * scope.selectedRow;
                        if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                            $(ul).scrollTop(elOffset);
                        }
                    }
                }
            });

            elem.on('keyup', function (e) {


                debugger;
                if (scope.showItembox === true) {
                    if (elemFocus) {
                        if (scope.bindAllProduct.length <= scope.selectedRow) {
                            scope.selectedRow = 0;
                            scope.$apply();
                        }
                    }
                }
            });
        }
    }
})





