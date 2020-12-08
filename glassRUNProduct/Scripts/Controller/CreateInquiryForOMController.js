angular.module("glassRUNProduct").controller('CreateInquiryForOMController', function ($scope, $timeout, $location, $ionicModal) {
    debugger;

    $scope.Textbox = {
        SelectedName: "",
        TypeName: "",
    }
    $scope.selectedRow = -1;
    $scope.foodItems = [{
        Id: 0,
        name: 'Noodles',
        price: '10',
        quantity: '1'
    },
    {
        Id: 1,
        name: 'Pasta',
        price: '20',
        quantity: '2'
    },
    {
        Id: 1,
        name: 'Paassdsta',
        price: '20',
        quantity: '2'
    },
    {
        Id: 2,
        name: 'Pizza',
        price: '30',
        quantity: '1'
    },
    {
        Id: 3,
        name: 'Chicken tikka',
        price: '100',
        quantity: '1'
    }];
    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
    }

    $scope.callkeypressfun = function (e, value) {
        debugger;
        if (e.keyCode !== 38 && e.keyCode !== 40) {
            $scope.Textbox.TypeName = value;
        }
    }

    $scope.onKeydowntest = function (item) {
        alert(item.name);
        debugger;
    }

    $scope.displayhide = false;

    $scope.keyupevent = function () {
        $scope.selectedRow = 0;
        $scope.displayhide = true;



    }


    //var KeyCodes = {
    //    BACKSPACE: 8,
    //    TABKEY: 9,
    //    RETURNKEY: 13,
    //    ESCAPE: 27,
    //    SPACEBAR: 32,
    //    LEFTARROW: 37,
    //    UPARROW: 38,
    //    RIGHTARROW: 39,
    //    DOWNARROW: 40,
    //};

    //$scope.onKeydown = function (item, $event) {
    //    debugger;
    //    var e = $event;
    //    var $target = $(e.target);
    //    var nextTab;
    //    switch (e.keyCode) {
    //        case KeyCodes.ESCAPE:
    //            $target.blur();
    //            break;
    //        case KeyCodes.UPARROW:
    //            nextTab = - 1;
    //            break;
    //        case KeyCodes.RETURNKEY: $scope.LoadItem(); break;
    //        case KeyCodes.DOWNARROW:
    //            nextTab = 1;
    //            break;
    //    }
    //    if (nextTab != undefined) {
    //        // do this outside the current $digest cycle
    //        // focus the next element by tabindex
    //        $timeout(() => $('[tabindex=' + (parseInt($target.attr("tabindex")) + nextTab) + ']').focus());
    //    }


    //};

    //$scope.LoadItem = function () {
    //    alert("hi");
    //}

    //$scope.onFocus = function (item, $event) {
    //    debugger;
    //    // clear all other items
    //    angular.forEach($scope.foodItems, function (item) {
    //        item.selected = undefined;
    //    });
    //    alert(item.name);
    //    // select this one
    //    item.selected = "selectedrow";
    //};

    //$scope.loadtest = function () {
    //    debugger;

    //    $scope.onFocus($scope.filteredItems[0], undefined);
    //    $('#search_results').find('li:first').focus();
    //    $scope.$apply();
    //}





}).filter('multipleTags', function ($filter, $rootScope) {
    return function multipleTags(items, predicates) {
        debugger;

        predicates = predicates.split(' ')

        angular.forEach(predicates, function (predicate) {
            items = $filter('filter')(items, { name: predicate.trim() });
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

}).directive('arrowSelector', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            var elemFocus = false;
            elem.on('mouseenter', function () {
                elemFocus = true;
            });
            elem.on('mouseleave', function () {
                elemFocus = true;
            });

            $document.bind('keydown', function (e) {
                debugger;

                var ul = document.querySelector('ul.searchlistcontainer');
                var nodes = document.querySelectorAll('.searchlistcontainer > li');

                var elHeight = $(nodes).height();
                var scrollTop = $(ul).scrollTop();
                var viewport = scrollTop + $(ul).height();
                var elOffset = 0;


                if (elemFocus) {
                    if (e.keyCode == 38) {
                        console.log(scope.selectedRow);
                        if (scope.selectedRow == 0) {
                            return;
                        }
                        scope.selectedRow--;

                        

                        scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (scope.selectedRow == scope.filteredItems.length - 1) {
                            return;
                        }
                        scope.selectedRow++;
                        scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 13) {
                        for (var i = 0; i < scope.filteredItems.length; i++) {
                            if (scope.selectedRow >= 0) {
                                if (i == scope.selectedRow) {
                                    scope.onKeydowntest(scope.filteredItems[i]);
                                }
                            }
                        }
                    }
                    elOffset = elHeight * scope.selectedRow;
                    $(ul).scrollTop(elOffset);
                }
            });


            $document.bind('keyup', function (e) {
                debugger;

                if (elemFocus) {

                    if (scope.filteredItems.length <= scope.selectedRow) {
                        scope.selectedRow = 0;
                        scope.$apply();
                    }
                }
            });
        }
    };
}]);