var baseUrl = "";

//Note : it should be 16 chacrater
var AuthorizedKeyForApi = "Default987654321";

//var encryptedString = ConvertToEncryptionString(JSON.stringify(object), AuthorizedKeyForApi);
//myData = ConvertToDecryptionString(myData, AuthorizedKeyForApi);

function ConvertToEncryptionString(stringtext, plainTextkey) {
    var key = CryptoJS.enc.Utf8.parse(plainTextkey);
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

    var encrypteddata = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(stringtext), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

    return encrypteddata.toString();
}



function disableF5(e) {
    if ((e.which || e.keyCode) == 116) {
        e.preventDefault();
    }
};


function generateGUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

function between(x, min, max) {
    return x >= min && x <= max;
}

function percentage(num, per) {
    var perc = 0;
    if (num > 0) {
        perc = ((num * per) / 100);
    }
    return perc;
}

function validateQty(event) {


    var key = window.event ? event.keyCode : event.which;
    if (event.keyCode == 8 || event.keyCode == 46
        || event.keyCode == 37 || event.keyCode == 39) {
        return true;
    }
    else if (key < 48 || key > 57) {
        return false;
    }
    else return true;
};

String.prototype.trunc = String.prototype.trunc ||
    function (n) {
        return this.length > n ? this.substr(0, n - 1) + '...' : this.toString();
    };

function ConvertToDecryptionString(encryptedString, plainTextkey) {
    var key = CryptoJS.enc.Utf8.parse(plainTextkey);
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

    var decryptedlogin = CryptoJS.AES.decrypt(encryptedString, key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

    return decryptedlogin.toString(CryptoJS.enc.Utf8);
}

function LoadPageFieldAccessByRoleOrUserWise(service, grid, datasource, rootScope, PageName, RoleId, UserId) {


    var requestData =
    {
        ServicesAction: "View Enquiries",
        PageName: "InquiryListGrid",
        RoleId: RoleId,
        UserId: UserId,
    };
    //var stringfyjson = JSON.stringify(requestData);
    var consolidateApiParamater =
    {
        Json: requestData,
    };

    service.ProcessRequest(consolidateApiParamater).then(function (objectresponse) {

        rootScope.GridObjectPropertiesAccess = objectresponse.data;
        rootScope.GridData = datasource;
        grid.success(datasource);
    });
}



function hideGridColumnByConfiguration(grid, configurationList) {

    if (configurationList.Json != undefined) {
        var objectProperties = configurationList.Json.ObjectList;
        for (var i = 0; i < objectProperties.length; i++) {
            if (objectProperties[i].ObjectPropertiesList != undefined) {
                if (objectProperties[i].ObjectPropertiesList.length > 0) {
                    for (var j = 0; j < objectProperties[i].ObjectPropertiesList.length; j++) {
                        if (objectProperties[i].ObjectPropertiesList[j].AccessId === "0") {
                            grid.hideColumn(objectProperties[i].ObjectPropertiesList[j].PropertyName);
                        }
                    }
                } else {
                    grid.hideColumn(objectProperties[i].ObjectPropertiesList.PropertyName);
                }
            }
        }
    }
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return today = yyyy + mm + dd;
}

function getSessionobjects(sessionStorage) {

    var sessionObject = null;
    $.ajax({
        method: 'POST',
        async: false,
        url: baseUrl + '/api/AllSession/GetSessionValues',
        success: function (data) {
            if (data !== "" && data[0] !== null) {
                if (data[0].CampusId !== "" && data[0].ProfileId !== "" && data[0].RoleMasterId !== "") {
                    sessionStorage.SessionObjects = data[0];
                    if (sessionStorage.SessionObjects != undefined && sessionStorage.SessionObjects !== null) {
                        sessionObject = sessionStorage.SessionObjects;
                    }
                    else {
                        sessionObject = null;
                    }
                } else {
                    sessionObject = null;
                }
            }
            else {
                sessionObject = null;
            }

            return sessionObject;
        }
    });
    return sessionObject;
}

function LoadActiveVariables(sessionStorage, state, rootScope) {

    debugger;

    var sessionObjects = getSessionobjects(sessionStorage);

    if (sessionObjects != null && sessionObjects != undefined) {
        rootScope.RoleId = sessionObjects.RoleMasterId;
        rootScope.UserId = sessionObjects.LoginId;
        rootScope.UserName = sessionObjects.UserName;
        rootScope.StockLocationCode = sessionObjects.StockLocationCode;
        rootScope.ProfileId = sessionObjects.ProfileId;
        rootScope.CompanyId = sessionObjects.ReferenceId;
        rootScope.CustomerCode = sessionObjects.CustomerCode;
        rootScope.ActiveUserName = sessionObjects.Name;
        rootScope.MenuList = sessionStorage.MenuList;
        rootScope.PageLevelConfigList = sessionStorage.PageLevelConfigList;
        rootScope.NextPageContrlAcessData = sessionStorage.NextPageContrlAcessData;
        rootScope.pageContrlAcessData = sessionStorage.pageContrlAcessData;
        rootScope.RoleName = sessionObjects.RoleName;
        rootScope.UserTypeCode = sessionObjects.UserTypeCode; //Added by Nadeem:- Licensing
        rootScope.ActivationCode = sessionObjects.ActivationCode; //Added by Nadeem:- Licensing
        rootScope.AllSettingMasterData = sessionStorage.AllSettingMasterData;
        rootScope.AllLookUpData = sessionStorage.AllLookUpData;
        rootScope.bindAllBranchPlant = sessionStorage.BindAllBranchPlant;
        rootScope.ResourcesData = sessionStorage.ResourcesData;
        rootScope.AllNotificationListData = sessionStorage.AllNotificationListData;
        rootScope.CompanyMnemonic = sessionObjects.CompanyMnemonic;
        rootScope.SelfCollectValue = sessionObjects.SelfCollectValue;
        rootScope.ChangePasswordonFirstLoginRequired = sessionObjects.ChangePasswordonFirstLoginRequired;
        rootScope.Token = sessionObjects.Token;
        rootScope.resData = sessionStorage.resData;
        rootScope.CultureId = sessionStorage.CultureId;
        rootScope.ParentCompanyId = sessionStorage.ParentCompanyId;
        rootScope.ObjectId = 0;
        rootScope.ObjectType = '';
        rootScope.ObjectIdForLogging = '0';
        rootScope.StatusResourcesList = sessionStorage.StatusResourcesList;
        rootScope.PageName = sessionStorage.PageName;
        rootScope.userProfilePhoto = sessionStorage.userProfilePhoto;
        rootScope.Token = sessionObjects.Token;
        rootScope.EnquiryCompanyType = sessionObjects.CompanyType;

        ///Add if user press F5 the title getting disappear...
        rootScope.res_PageHeaderTitle = sessionStorage.resourcePageName;
        if (sessionStorage.IsAdvanceEdit === true) {
            rootScope.res_PageHeaderTitle = rootScope.resData.res_CreateEnquiryPage_EditEnquiryHeaderName + " (" + sessionStorage.EditEnquiryAutoNumber + ")";
        }
    }
    else {
        state.go('loginContent');
    }
}





app.directive('fileModel', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    var data = { dataFile: element[0].files[0] };
                    var reader = new FileReader();
                    reader.readAsDataURL(data.dataFile);
                    reader.onload = function () {

                        data.dataBase64 = reader.result.split(",")[1];
                        //console.log(reader.result);
                    };
                    reader.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                    scope.show = false;
                    scope.file = element[0].files[0].name;
                    modelSetter(scope, data);
                });
            });
        }
    };
});

app.directive('imageModel', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.imageModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {

                    scope.show = false;
                    scope.file = element[0].files[0].name;
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});

app.directive('date', function (dateFilter) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var dateFormat = attrs['date'] || 'dd/MM/yyyy';

            ctrl.$formatters.unshift(function (modelValue) {
                return dateFilter(modelValue, dateFormat);
            });
        }
    };
});

app.factory('focus', function ($timeout, $window) {
    return function (id) {
        // timeout makes sure that it is invoked after any other event has been triggered.
        // e.g. click events that need to run before the focus or
        // inputs elements that are in a disabled state but are enabled when those events
        // are triggered.
        $timeout(function () {
            var element = $window.document.getElementById(id);
            if (element)
                element.focus();
        });
    };
});
app.directive('eventFocus', function (focus) {
    return function (scope, elem, attr) {
        elem.on(attr.eventFocus, function () {
            focus(attr.eventFocusId);
        });

        // Removes bound events in the element itself
        // when the scope is destroyed
        scope.$on('$destroy', function () {
            elem.off(attr.eventFocus);
        });
    };
});

app.filter('multipleTags', function ($filter, $rootScope) {
    return function multipleTags(items, SearchControl) {


        SearchControl = SearchControl.split(' ')

        angular.forEach(SearchControl, function (searchText) {
            items = $filter('filter')(items, { Name: searchText.trim() });
        });

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
}).filter('multipleTagsCompany', function ($filter, $rootScope) {
    return function multipleTags(items, SearchControl) {


        SearchControl = SearchControl.split(' ')

        angular.forEach(SearchControl, function (searchText) {
            items = $filter('filter')(items, { Name: searchText.trim() });
        });
        if (items !== undefined) {
            $rootScope.filteredCompany = items;
        } else {
            $rootScope.filteredCompany = [];
        }


        if (items != undefined) {
            if (items.length === 0) {
                $rootScope.CustomerfoundResult = true;
            }
            else {
                $rootScope.CustomerfoundResult = false;
            }
        } else {
            $rootScope.CustomerfoundResult = false;
        }

        return items;
    }
}).filter('multipleTagsDistributor', function ($filter, $rootScope) {
    return function multipleTags(items, SearchControl) {


        SearchControl = SearchControl.split(' ')

        angular.forEach(SearchControl, function (searchText) {
            items = $filter('filter')(items, { Name: searchText.trim() });
        });
        if (items !== undefined) {
            $rootScope.filteredDistributorCompany = items;
        } else {
            $rootScope.filteredDistributorCompany = [];
        }


        if (items != undefined) {
            if (items.length === 0) {
                $rootScope.CustomerfoundResult = true;
            }
            else {
                $rootScope.CustomerfoundResult = false;
            }
        } else {
            $rootScope.CustomerfoundResult = false;
        }

        return items;
    }
}).filter('multipleTagsCollectionLocation', function ($filter, $rootScope) {
    return function multipleTags(items, SearchControl) {


        SearchControl = SearchControl.split(' ')

        angular.forEach(SearchControl, function (searchText) {
            items = $filter('filter')(items, { Name: searchText.trim() });
        });
        if (items !== undefined) {
            $rootScope.filteredCollection = items;
        } else {
            $rootScope.filteredCollection = [];
        }


        if (items != undefined) {
            if (items.length === 0) {
                $rootScope.CollectionFoundResult = true;
            }
            else {
                $rootScope.CollectionFoundResult = false;
            }
        } else {
            $rootScope.CollectionFoundResult = false;
        }

        return items;
    }
}).filter('multipleTagsDeliveryLocation', function ($filter, $rootScope) {
    return function multipleTags(items, SearchControl) {


        SearchControl = SearchControl.split(' ')

        angular.forEach(SearchControl, function (searchText) {
            items = $filter('filter')(items, { Name: searchText.trim() });
        });



        if (items !== undefined) {
            $rootScope.filteredDeliveryLocation = items;
        } else {
            $rootScope.filteredDeliveryLocation = [];
        }


        if (items != undefined) {
            if (items.length === 0) {

                $rootScope.ShipToFoundResult = true;

            }
            else {

                $rootScope.ShipToFoundResult = false;

            }
        } else {

            $rootScope.ShipToFoundResult = false;

        }

        return items;
    }
}).filter('multipleTagsTruckSize', function ($filter, $rootScope) {
    return function multipleTags(items, SearchControl) {


        SearchControl = SearchControl.split(' ')

        angular.forEach(SearchControl, function (searchText) {
            items = $filter('filter')(items, { Name: searchText.trim() });
        });



        if (items !== undefined) {
            $rootScope.filteredTruckSizes = items;
        } else {
            $rootScope.filteredTruckSizes = [];
        }


        if (items != undefined) {
            if (items.length === 0) {

                $rootScope.foundResultTruckSize = true;

            }
            else {

                $rootScope.foundResultTruckSize = false;

            }
        } else {

            $rootScope.foundResultTruckSize = false;

        }

        return items;
    }
}).filter('multipleTagsItem', function ($filter, $rootScope) {
    return function multipleTags(items, SearchControl) {


        SearchControl = SearchControl.split(' ')

        angular.forEach(SearchControl, function (searchText) {
            items = $filter('filter')(items, { Name: searchText.trim() });
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
            debugger;
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            } else {
                var key = window.event ? event.keyCode : event.which;
                if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39) {
                    return true;
                }
                else if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
                    return true;
                }
                else return false;
            }
        });
    };
}).directive('ngEsc', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress keyup", function (event) {
            if (event.which === 27) {

                scope.$apply(function () {
                    scope.$eval(attrs.ngEsc);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('arrowSelector', ['$document', function ($document) {
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
                                scope.SearchControl.InputItem = scope.SearchControl.FilterAutoCompletebox;
                                scope.$apply();
                                e.preventDefault();
                                return;
                            }
                            scope.selectedRow--;

                            scope.SearchControl.InputItem = scope.filteredItems[scope.selectedRow].ItemNameCode;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 40) {
                            if (scope.selectedRow == scope.filteredItems.length - 1) {
                                return;
                            }
                            scope.selectedRow++;

                            scope.SearchControl.InputItem = scope.filteredItems[scope.selectedRow].ItemNameCode;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 13) {
                            for (var i = 0; i < scope.filteredItems.length; i++) {
                                if (scope.selectedRow >= 0) {
                                    if (i == scope.selectedRow) {
                                        scope.selectedRow = -1;
                                        scope.getItemPrice(scope.filteredItems[i].ItemId, scope.EditedEnquiryId, 0, 0, true);
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


                if (scope.showItembox === true) {
                    if (elemFocus) {
                        if (scope.filteredItems.length <= scope.selectedRow) {
                            scope.selectedRow = 0;
                            scope.$apply();
                        }
                    }
                }
            });
        }
    };
}]);

app.directive('arrowSelectorDistributor', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            var elemFocus = true;
            elem.on('mouseenter', function () {
                elemFocus = true;
            });

            elem.on('mouseleave', function () {
                elemFocus = true;
            });



            elem.on('keydown', function (e) {


                if (scope.showCompanybox === true) {
                    var ul = document.querySelector('#CompanyListAutoCompleteBox_dropdown.angucomplete-dropdown');
                    var nodes = document.querySelectorAll('#CompanyListAutoCompleteBox_dropdown.angucomplete-dropdown > .angucomplete-row');

                    var elHeight = $(nodes).height();

                    var scrollTop = $(ul).scrollTop();
                    var viewport = scrollTop + $(ul).height();
                    var elOffset = 0;

                    if (elemFocus) {

                        if (e.keyCode == 38) {
                            if (scope.selectedCompanyRow == 0) {
                                scope.SearchControl.InputDistributor = scope.SearchControl.FilterDistributorAutoCompletebox;
                                scope.selectedCompanyRow--;
                                scope.$apply();
                                e.preventDefault();
                                return;
                            }
                            scope.selectedCompanyRow--;

                            scope.SearchControl.InputDistributor = scope.filteredDistributorCompany[scope.selectedCompanyRow].CompanyName;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 40) {
                            if (scope.selectedCompanyRow == scope.filteredDistributorCompany.length - 1) {
                                return;
                            }
                            scope.selectedCompanyRow++;

                            scope.SearchControl.InputDistributor = scope.filteredDistributorCompany[scope.selectedCompanyRow].CompanyName;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 13) {
                            if (scope.selectedCompanyRow >= 0) {
                                scope.SelectedCompany(scope.filteredDistributorCompany[scope.selectedCompanyRow].CompanyId, scope.filteredDistributorCompany[scope.selectedCompanyRow].CompanyMnemonic, scope.filteredDistributorCompany[scope.selectedCompanyRow].CompanyName, scope.filteredDistributorCompany[scope.selectedCompanyRow].CompanyType, scope.filteredDistributorCompany[scope.selectedCompanyRow].CompanyNameAndMnemonic, scope.filteredDistributorCompany[scope.selectedCompanyRow].LoginId, scope.filteredDistributorCompany[scope.selectedCompanyRow].RoleMasterId);
                            }
                        }

                        elOffset = elHeight * scope.selectedCompanyRow;
                        if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                            $(ul).scrollTop(elOffset);
                        }
                    }
                }
            });

            elem.on('keyup', function (e) {


                if (scope.showCompanybox === true) {
                    if (elemFocus) {
                        if (scope.filteredCompany.length <= scope.selectedCompanyRow) {
                            scope.selectedCompanyRow = 0;
                            scope.$apply();
                        }
                    }
                }
            });
        }
    };
}]);


app.directive('arrowSelectorCompany', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            var elemFocus = true;
            elem.on('mouseenter', function () {
                elemFocus = true;
            });

            elem.on('mouseleave', function () {
                elemFocus = true;
            });



            elem.on('keydown', function (e) {


                if (scope.showDistributorCompanybox === true) {
                    var ul = document.querySelector('#CompanyListAutoCompleteBox_dropdown.angucomplete-dropdown');
                    var nodes = document.querySelectorAll('#CompanyListAutoCompleteBox_dropdown.angucomplete-dropdown > .angucomplete-row');

                    var elHeight = $(nodes).height();

                    var scrollTop = $(ul).scrollTop();
                    var viewport = scrollTop + $(ul).height();
                    var elOffset = 0;

                    if (elemFocus) {

                        if (e.keyCode == 38) {
                            if (scope.selectedDistributorRow == 0) {
                                scope.SearchControl.InputDistributor = scope.SearchControl.FilterCompanyAutoCompletebox;
                                scope.selectedDistributorRow--;
                                scope.$apply();
                                e.preventDefault();
                                return;
                            }
                            scope.selectedDistributorRow--;

                            scope.SearchControl.InputDistributor = scope.filteredDistributorCompany[scope.selectedDistributorRow].CompanyName;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 40) {
                            if (scope.selectedDistributorRow == scope.filteredDistributorCompany.length - 1) {
                                return;
                            }
                            scope.selectedDistributorRow++;

                            scope.SearchControl.InputDistributor = scope.filteredDistributorCompany[scope.selectedDistributorRow].CompanyName;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 13) {
                            if (scope.selectedDistributorRow >= 0) {
                                scope.SelectedShipper(scope.filteredDistributorCompany[scope.selectedDistributorRow].CompanyId, scope.filteredDistributorCompany[scope.selectedDistributorRow].CompanyName);
                            }
                        }

                        elOffset = elHeight * scope.selectedDistributorRow;
                        if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                            $(ul).scrollTop(elOffset);
                        }
                    }
                }
            });

            elem.on('keyup', function (e) {


                if (scope.showCompanybox === true) {
                    if (elemFocus) {
                        if (scope.filteredDistributorCompany.length <= scope.selectedDistributorRow) {
                            scope.selectedDistributorRow = 0;
                            scope.$apply();
                        }
                    }
                }
            });
        }
    };
}]);


app.directive('arrowSelectorCollection', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            var elemFocus = true;
            elem.on('mouseenter', function () {
                elemFocus = true;
            });

            elem.on('mouseleave', function () {
                elemFocus = true;
            });



            elem.on('keydown', function (e) {


                if (scope.showCollectionbox === true) {
                    var ul = document.querySelector('#CollectionListAutoCompleteBox_dropdown.angucomplete-dropdown');
                    var nodes = document.querySelectorAll('#CollectionListAutoCompleteBox_dropdown.angucomplete-dropdown > .angucomplete-row');

                    var elHeight = $(nodes).height();

                    var scrollTop = $(ul).scrollTop();
                    var viewport = scrollTop + $(ul).height();
                    var elOffset = 0;

                    if (elemFocus) {
                        console.log(e.keyCode);
                        if (e.keyCode == 38) {
                            console.log(scope.selectedCollectionRow);
                            if (scope.selectedCollectionRow == 0) {
                                scope.SearchControl.InputCollection = scope.SearchControl.FilterCollectionAutoCompletebox;
                                scope.selectedCollectionRow = -1;
                                scope.$apply();
                                e.preventDefault();

                                return;
                            }
                            scope.selectedCollectionRow--;
                            console.log(scope.selectedCollectionRow);
                            scope.SearchControl.InputCollection = scope.filteredCollection[scope.selectedCollectionRow].DeliveryLocationName;

                            console.log(scope.SearchControl.InputCollection);
                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 40) {

                            console.log(scope.selectedCollectionRow);
                            if (scope.selectedCollectionRow == scope.filteredCollection.length - 1) {

                                return;
                            }
                            scope.selectedCollectionRow++;
                            console.log(scope.selectedCollectionRow);
                            scope.SearchControl.InputCollection = scope.filteredCollection[scope.selectedCollectionRow].DeliveryLocationName;
                            console.log(scope.SearchControl.InputCollection);
                            scope.$apply();

                            e.preventDefault();
                        }
                        if (e.keyCode == 13) {

                            if (scope.selectedCollectionRow >= 0) {

                                scope.SelectedCollection(scope.filteredCollection[scope.selectedCollectionRow].LocationId, scope.filteredCollection[scope.selectedCollectionRow].DeliveryLocationCode, scope.filteredCollection[scope.selectedCollectionRow].DeliveryName, scope.filteredCollection[scope.selectedCollectionRow].DeliveryLocationName);
                                scope.selectedCollectionRow = -1;
                            }
                        }

                        elOffset = elHeight * scope.selectedCollectionRow;
                        if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {

                            $(ul).scrollTop(elOffset);
                        }
                    }
                }
            });

            elem.on('keyup', function (e) {


                if (scope.showCollectionbox === true) {
                    if (elemFocus) {
                        if (scope.filteredCollection.length <= scope.selectedCollectionRow) {
                            scope.selectedCollectionRow = 0;
                            scope.$apply();
                        }
                    }
                }
            });
        }
    };
}]);

app.directive('arrowSelectorDelivery', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            var elemFocus = true;
            elem.on('mouseenter', function () {
                elemFocus = true;
            });

            elem.on('mouseleave', function () {
                elemFocus = true;
            });



            elem.on('keydown', function (e) {


                if (scope.showShipToLocationbox === true) {
                    var ul = document.querySelector('#DeliveryListAutoCompleteBox_dropdown.angucomplete-dropdown');
                    var nodes = document.querySelectorAll('#DeliveryListAutoCompleteBox_dropdown.angucomplete-dropdown > .angucomplete-row');

                    var elHeight = $(nodes).height();

                    var scrollTop = $(ul).scrollTop();
                    var viewport = scrollTop + $(ul).height();
                    var elOffset = 0;

                    if (elemFocus) {

                        if (e.keyCode == 38) {
                            if (scope.selectedShipToLocationRow == 0) {
                                scope.SearchControl.InputShipToLocation = scope.SearchControl.FilterShipToLocationAutoCompletebox;
                                scope.selectedShipToLocationRow = -1;
                                scope.$apply();
                                e.preventDefault();
                                return;
                            }
                            scope.selectedShipToLocationRow--;

                            scope.SearchControl.InputShipToLocation = scope.filteredDeliveryLocation[scope.selectedShipToLocationRow].DeliveryName;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 40) {
                            if (scope.selectedShipToLocationRow == scope.filteredDeliveryLocation.length - 1) {
                                return;
                            }
                            scope.selectedShipToLocationRow++;

                            scope.SearchControl.InputShipToLocation = scope.filteredDeliveryLocation[scope.selectedShipToLocationRow].DeliveryName;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 13) {
                            if (scope.selectedShipToLocationRow >= 0) {

                                scope.SelectedShipToLocation(scope.filteredDeliveryLocation[scope.selectedShipToLocationRow].DeliveryLocationId, scope.filteredDeliveryLocation[scope.selectedShipToLocationRow].DeliveryLocationCode, scope.filteredDeliveryLocation[scope.selectedShipToLocationRow].DeliveryName, scope.filteredDeliveryLocation[scope.selectedShipToLocationRow].DeliveryLocationName);
                                scope.selectedShipToLocationRow = -1;
                            }
                        }

                        elOffset = elHeight * scope.selectedShipToLocationRow;
                        if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                            $(ul).scrollTop(elOffset);
                        }
                    }
                }
            });

            elem.on('keyup', function (e) {


                if (scope.showShipToLocationbox === true) {
                    if (elemFocus) {
                        if (scope.filteredDeliveryLocation.length <= scope.selectedShipToLocationRow) {
                            scope.selectedShipToLocationRow = 0;
                            scope.$apply();
                        }
                    }
                }
            });
        }
    };
}]);

app.directive('arrowSelectorTrucksize', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            var elemFocus = true;
            elem.on('mouseenter', function () {
                elemFocus = true;
            });

            elem.on('mouseleave', function () {
                elemFocus = true;
            });



            elem.on('keydown', function (e) {


                if (scope.showTransportVehiclebox === true) {
                    var ul = document.querySelector('#TruckSizeListAutoCompleteBox_dropdown.angucomplete-dropdown');
                    var nodes = document.querySelectorAll('#TruckSizeListAutoCompleteBox_dropdown.angucomplete-dropdown > .angucomplete-row');

                    var elHeight = $(nodes).height();

                    var scrollTop = $(ul).scrollTop();
                    var viewport = scrollTop + $(ul).height();
                    var elOffset = 0;

                    if (elemFocus) {

                        if (e.keyCode == 38) {
                            if (scope.selectedTransportVehicleRow == 0) {
                                scope.SearchControl.InputTransportVehicle = scope.SearchControl.FilterTransportVehicleAutoCompletebox;
                                scope.selectedTransportVehicleRow = -1;
                                scope.$apply();
                                e.preventDefault();
                                return;
                            }
                            scope.selectedTransportVehicleRow--;

                            scope.SearchControl.InputTransportVehicle = scope.filteredTruckSizes[scope.selectedTransportVehicleRow].Name;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 40) {
                            if (scope.selectedTransportVehicleRow == scope.filteredTruckSizes.length - 1) {
                                return;
                            }
                            scope.selectedTransportVehicleRow++;

                            scope.SearchControl.InputTransportVehicle = scope.filteredTruckSizes[scope.selectedTransportVehicleRow].Name;

                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 13) {
                            if (scope.selectedTransportVehicleRow >= 0) {

                                scope.SelectedTranportVehicle(scope.filteredTruckSizes[scope.selectedTransportVehicleRow].TruckSizeId, scope.filteredTruckSizes[scope.selectedTransportVehicleRow].TruckSize, scope.filteredTruckSizes[scope.selectedTransportVehicleRow].Name, scope.filteredTruckSizes[scope.selectedTransportVehicleRow].Name);
                                scope.selectedTransportVehicleRow = -1;
                                scope.$apply();
                            }
                        }

                        elOffset = elHeight * scope.selectedTransportVehicleRow;
                        if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                            $(ul).scrollTop(elOffset);
                        }
                    }
                }
                else {
                    if (e.keyCode == 9) {

                    }
                }

            });

            elem.on('keyup', function (e) {


                if (scope.showTransportVehiclebox === true) {
                    if (elemFocus) {
                        if (scope.filteredTruckSizes.length <= scope.selectedTransportVehicleRow) {
                            scope.selectedTransportVehicleRow = 0;
                            scope.$apply();
                        }
                    }
                }
            });
        }
    };
}]);

app.filter('htmlToPlaintext', function () {
    return function (text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
});


app.directive('autoComplete', function ($timeout, $filter) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {


            elem.autocomplete({
                source: function (request, response) {

                    //term has the data typed by the user
                    var params = request.term;


                    var data = [];
                    //simulates api call with odata $filter
                    if (attrs.id === "ServiceAction") {
                        data = scope.ServicesActionList;
                    } else if (attrs.id === "ActivityHeader") {
                        data = scope.ActivityHeaderList;
                    } else if (attrs.id === "ParentActivity") {
                        data = scope.ParentActivityList;
                    }
                    else {
                        data = scope.datasource;
                    }
                    if (data) {
                        var result = $filter('filter')(data, { Name: params });
                        angular.forEach(result, function (item) {
                            item['value'] = item['Name'];
                        });
                    }
                    response(result);

                },
                minLength: 1,
                select: function (event, ui) {

                    //force a digest cycle to update the views
                    scope.$apply(function () {

                        if (attrs.id === "ServiceAction") {

                        } else if (attrs.id === "ActivityHeader") {
                            scope.SelectedActivityHeader(ui.item.Name);
                        } else if (attrs.id === "ParentActivity") {

                        }

                    });
                },

            });
        }

    };
});


function ExportDataInExcel(serviceActionConfig, service, rootScope, scope) {

    var result = true;
    var requestData = serviceActionConfig;

    var consolidateApiParamater =
    {
        Json: requestData,
    };

    service.ProcessRequestForServiceBufferExcelExport(consolidateApiParamater).then(function (response) {

        var byteCharacters1 = response.data;
        if (response.data != undefined) {
            var byteCharacters = response.data;

            var blob = new Blob([byteCharacters], {
                type: "application/Pdf"
            });

            if (blob.size > 0) {
                var filName = "Carrier" + ".xlsx";
                saveAs(blob, filName);
                result = true;
            } else {
                rootScope.ValidationErrorAlert(String.format(rootScope.resData.res_CreateInquiryForSLM_DocumentNotGenerated), '', 3000);
                result = false;
            }
        } else {
            rootScope.ValidationErrorAlert(String.format(rootScope.resData.res_CreateInquiryForSLM_DocumentNotGenerated), '', 3000);
            result = false;
        }
    });
}

function ChangeGridHeaderTitleByLanguage(grid, gridId, resourceData) {

    for (var i = 0; i < grid.columns.length; i++) {
        if (grid.columns[i].title !== undefined) {
            if (grid.columns[i].title.indexOf("<input") <= -1) {
                var columnname = "res_GridColumn_" + grid.columns[i].field;
                $("#" + gridId + " thead [data-field=" + grid.columns[i].field + "] .k-link").html(resourceData[columnname]);
            }
        }
    }
}

function hideGridColumnByConfigurationData(grid, configurationList) {


    for (var i = 0; i < grid.columns.length; i++) {
        var columnJson = "";

        var column = configurationList.filter(function (el) { return el.PropertyName === grid.columns[i].field; });
        if (column.length > 0) {
            var Visible = true;
            var IsMandatory = true;
            if (column[0].IsAvailable === "1") {
                if (column[0].IsMandatory === "1" || column[0].IsSystemMandatory === "1") {
                    grid.columns[i].menu = false;
                } else {
                    if (column[0].IsDefault === "1") {
                    } else {
                        grid.hideColumn(grid.columns[i].field);
                    }

                    grid.columns[i].menu = true;
                }

                if (column[0].SequenceNumber !== "" && column[0].SequenceNumber !== "null" && column[0].SequenceNumber !== null && column[0].SequenceNumber !== undefined) {
                    grid.reorderColumn(parseInt(column[0].SequenceNumber), grid.columns[i]);
                }
            } else {
                grid.columns[i].menu = false;
                grid.hideColumn(grid.columns[i].field);
            }
        } else {
            grid.columns[i].menu = false;
            grid.hideColumn(grid.columns[i].field);
        }
    }

    //for (var i = 0; i < configurationList.length; i++) {
    //    if (configurationList[i].Visible === false) {
    //        grid.hideColumn(configurationList[i].ColumnName);
    //    } else {
    //    }
    //}

    //for (var i = 0; i < grid.columns.length; i++) {
    //    var column = configurationList.filter(function (el) { return el.ColumnName === grid.columns[i].field && el.RoleId === $rootScope.RoleId });
    //    if (column.length > 0) {
    //        if (column[0].Visible === false) {
    //            grid.columns[i].menu = false;
    //        } else {
    //            if (column[0].Default === true) {
    //                grid.columns[i].menu = true;
    //            } else {
    //                grid.columns[i].menu = false;
    //            }
    //        }
    //    }
    //    else {
    //        grid.columns[i].menu = false;
    //    }
    //}
}











function nth(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function FindMonthName(month) {
    var monthName = "";
    if (parseInt(month) === 1) {
        monthName = "Jan";
    } else if (parseInt(month) === 2) {
        monthName = "Feb";
    }
    else if (parseInt(month) === 3) {
        monthName = "March";
    }
    else if (parseInt(month) === 4) {
        monthName = "Apr";
    }
    else if (parseInt(month) === 5) {
        monthName = "May";
    }
    else if (parseInt(month) === 6) {
        monthName = "June";
    }
    else if (parseInt(month) === 7) {
        monthName = "July";
    }
    else if (parseInt(month) === 8) {
        monthName = "Aug";
    }
    else if (parseInt(month) === 9) {
        monthName = "Sep";
    }
    else if (parseInt(month) === 10) {
        monthName = "Oct";
    }
    else if (parseInt(month) === 11) {
        monthName = "Nov";
    }
    else if (parseInt(month) === 12) {
        monthName = "Dec";
    }

    return monthName;
}




