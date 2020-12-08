angular.module("glassRUNProduct").controller('AddEditEntityRelationshipController', function ($scope, $q, $sce, $rootScope, $sessionStorage, $state, $filter, $ionicPopover, $ionicModal, $location, pluginsService, GrRequestService) {

    $scope.EntityRelationship = {
        CompanyTypeId: 0,
        Enable: true
    };

    $scope.RuleDataForEntityRelationship = [];

    $scope.GetToEndDate = function (date) {

        $('#ToEndDate').each(function () {

            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');

                    }

                },
                minDate: date,
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });
    }



    $scope.GetFromDate = function () {
        $('#FromDate').each(function () {
            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    if (inst.id != undefined) {
                        angular.element($('#' + inst.id)).triggerHandler('input');
                        $scope.GetToEndDate(dateText);
                    }

                },
                minDate: new Date(),
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                isRTL: $('body').hasClass('rtl') ? true : false,
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                showButtonPanel: false,


            });
        });
    }

    $scope.GetFromDate();


    $scope.LoadCompanyType = function () {
        debugger;
        $scope.CompanyTypeList = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'CompanyType'; });
    }


    function checkdate(input) {
        var validformat = /^\d{2}\/\d{2}\/\d{4}$/ //Basic check for format validity
        var returnval = false
        if (!validformat.test(input))
            var returnval = false
        else { //Detailed check for valid date ranges
            var monthfield = input.split("/")[0]
            var dayfield = input.split("/")[1]
            var yearfield = input.split("/")[2]
            var dayobj = new Date(yearfield, monthfield - 1, dayfield)
            if ((dayobj.getMonth() + 1 != monthfield) || (dayobj.getDate() != dayfield) || (dayobj.getFullYear() != yearfield))
                var returnval = false
            else
                returnval = true
        }
        return returnval
    }

    $scope.LoadCompanyType();






    $scope.LoadMappingEntity = function (entityData) {

        $scope.companyList = {
            title: 'Can order from',
            filterPlaceHolder: 'Start typing to filter the lists below.',
            labelAll: '',
            labelSelected: 'Selected',
            helpMessage: ' Click items to transfer them between fields.',
            /* angular will use this to filter your lists */
            orderProperty: 'name',
            /* this contains the initial list of all items (i.e. the left side) */
            items: entityData,
            /* this list should be initialized as empty or with any pre-selected items */
            selectedItems: []
        };
    }

    $scope.LoadMappingEntity([]);

    $scope.LoadAllParentCompany = function (CompanyTypeId) {
        debugger;
        $rootScope.Throbber.Visible = true;
        $scope.ParentCompanyList = [];
        $scope.multiselect.options = [];
        $rootScope.ExitsRuleId = '0';
        var requestData =
        {
            ServicesAction: 'LoadAllCompanyAccordingRoleParent',
            CompanyTypeId: CompanyTypeId
        };

        var consolidateApiParamater =
        {
            Json: requestData,
        };


        var requestDataAccordingRole =
        {
            ServicesAction: 'LoadAllCompanyAccordingRole',
            CompanyTypeId: CompanyTypeId
        };

        var consolidateApiParamaterAccordingRole =
        {
            Json: requestDataAccordingRole,
        };

        var LoadAllCompanyAccordingRoleParent = GrRequestService.ProcessRequest(consolidateApiParamater);
        var LoadAllCompanyAccordingRole = GrRequestService.ProcessRequest(consolidateApiParamaterAccordingRole);


        $q.all([
            LoadAllCompanyAccordingRoleParent,
            LoadAllCompanyAccordingRole
        ]).then(function (resp) {
            debugger;
            try {
                var response = resp[0];
                var companyList = resp[1];

                if (companyList.data.Json != undefined) {
                    if (companyList.data.Json.CompanyList.length > 0) {
                        $scope.multiselect.options = companyList.data.Json.CompanyList;
                    }
                }


                if ($rootScope.IsEditEntityRelationship) {
                    var editCompany = {
                        id: $rootScope.PrimaryEntity,
                        name: $rootScope.PrimaryComapnyName,
                        CompanyMnemonic: $rootScope.PrimaryCompanyMnemonic
                    }
                    $scope.multiselect.options.push(editCompany);
                    $scope.multiselect.selected.push(editCompany);
                }



                if (response.data.Json != undefined) {
                    if (response.data.Json.CompanyList.length > 0) {

                        $scope.ParentCompanyList = response.data.Json.CompanyList;
                    }
                }
                var ExitsRuleId = '0';
                $scope.companyList.selectedItems = [];
                if ($rootScope.IsEditEntityRelationship) {

                    for (var i = 0; i < $rootScope.EntityRelationshipData.length; i++) {

                        if ($rootScope.EntityRelationshipData[i].RuleId === '0') {
                            var editCompany = {
                                id: $rootScope.EntityRelationshipData[i].CompanyId,
                                name: $rootScope.EntityRelationshipData[i].CompanyName,
                                CompanyMnemonic: $rootScope.EntityRelationshipData[i].CompanyMnemonic
                            }
                            $scope.companyList.selectedItems.push(editCompany);
                        }
                        else {
                            if (ExitsRuleId === '') {
                                ExitsRuleId = $rootScope.EntityRelationshipData[i].RuleId;
                            }
                            else {
                                ExitsRuleId = ExitsRuleId + ',' + $rootScope.EntityRelationshipData[i].RuleId;
                            }
                            var editCompany = {
                                rownumber: $rootScope.EntityRelationshipData[i].RuleId,
                                RuleText: $rootScope.EntityRelationshipData[i].RuleText,
                                RuleId: $rootScope.EntityRelationshipData[i].RuleId
                            }
                            $scope.RuleDataForEntityRelationship.push(editCompany);
                        }
                    }
                }

                for (var i = 0; i < $scope.companyList.selectedItems.length; i++) {
                    $scope.ParentCompanyList = $scope.ParentCompanyList.filter(function (el) { return el.id !== $scope.companyList.selectedItems[i].id; });
                }

                $rootScope.ExitsRuleId = ExitsRuleId;

                $scope.companyList.items = $scope.ParentCompanyList;

                $rootScope.Throbber.Visible = false;
            } catch (e) {
                $rootScope.Throbber.Visible = false;
            }
        });

    }



    $scope.LoadCompany = function () {
        $scope.multiselect = {
            selected: [],
            options: [],
            config: {
                hideOnBlur: false,
                showSelected: false,
                itemTemplate: function (item) {
                    return $sce.trustAsHtml(item.name + ' (' + item.CompanyMnemonic + ')');
                },
                labelTemplate: function (item) {
                    return $sce.trustAsHtml(item.name);
                }
            }
        };

    }

    $scope.LoadCompany();
    $scope.displayUsers = function () {
        return $scope.multiselect.selected.map(function (each) {
            return each.name;
        }).join(', ');
    };



    $scope.SetEnable = function (status) {
        $scope.EntityRelationship.Enable = status;
    }


    $scope.ResetEntityRelationshipControl = function () {
        debugger;
        $scope.RuleDataForEntityRelationship = [];
        $scope.multiselect.selected = [];
        $scope.multiselect.options = [];
        $scope.LoadMappingEntity($scope.multiselect.selected);
        $scope.EntityRelationship.FromDate = undefined;
        $scope.EntityRelationship.ToDate = undefined;
        $scope.EntityRelationship.CompanyTypeId = 0;
        $scope.EntityRelationship.Enable = true;
    }


    $scope.SaveEntityRelationship = function () {
        debugger;
        var customer = $scope.multiselect.selected;
        var companyList = $scope.companyList.selectedItems;

        if ($scope.EntityRelationship.FromDate !== "" && $scope.EntityRelationship.FromDate !== undefined) {
            var fromdate = $scope.EntityRelationship.FromDate.split('/');
            var selectedStartDate = fromdate[1] + "/" + fromdate[0] + "/" + fromdate[2];

            var checkRuleStartDate = checkdate(selectedStartDate);
            if (!checkRuleStartDate) {
                $scope.ValidationErrorAlert("Invalid Date format.", 'warning', 10000);
                return false;
            }
            else {
                $scope.EntityRelationship.FromDate = selectedStartDate;
            }
        }

        if ($scope.EntityRelationship.ToEndDate !== "" && $scope.EntityRelationship.ToEndDate !== undefined) {
            var enddate = $scope.EntityRelationship.ToEndDate.split('/');
            var selectedEndDate = enddate[1] + "/" + enddate[0] + "/" + enddate[2];

            var checkRuleEndDate = checkdate(selectedEndDate);
            if (!checkRuleEndDate) {
                $scope.ValidationErrorAlert("Invalid Date format.", 'warning', 10000);
                return false;
            }
            else {
                $scope.EntityRelationship.ToEndDate = selectedEndDate;
            }
        }

        var guid = generateGUID();
        $scope.EntityRelationshipList = [];

        for (var i = 0; i < customer.length; i++) {

            var primaryEntityId = customer[i].id;

            for (var j = 0; j < companyList.length; j++) {

                var entity = {
                    PrimaryEntity: primaryEntityId,
                    RelatedEntity: companyList[j].id,
                    RelationshipPurpose: 1000,
                    RuleId: 0,
                    CompanyTypeId: $scope.EntityRelationship.CompanyTypeId,
                    FromDate: $scope.EntityRelationship.FromDate,
                    ToDate: $scope.EntityRelationship.ToEndDate,
                    EntityRelationshipGUID: guid,
                    IsActive: $scope.EntityRelationship.Enable
                }
                $scope.EntityRelationshipList.push(entity);
            }



        }

        for (var i = 0; i < customer.length; i++) {

            var primaryEntityId = customer[i].id;

            for (var k = 0; k < $scope.RuleDataForEntityRelationship.length; k++) {
                var entity = {
                    PrimaryEntity: primaryEntityId,
                    RelatedEntity: 0,
                    RelationshipPurpose: 1000,
                    RuleId: $scope.RuleDataForEntityRelationship[k].RuleId,
                    CompanyTypeId: $scope.EntityRelationship.CompanyTypeId,
                    FromDate: $scope.EntityRelationship.FromDate,
                    ToDate: $scope.EntityRelationship.ToEndDate,
                    EntityRelationshipGUID: guid,
                    IsActive: $scope.EntityRelationship.Enable
                }
                $scope.EntityRelationshipList.push(entity);
            }
        }


        if (customer.length == 0) {

            $scope.ValidationErrorAlert("Please Select Primary Entity.", 'warning', 10000);
            return false;
        }


        if ($scope.EntityRelationshipList.length == 0) {

            $scope.ValidationErrorAlert("Please Select Related Entity.", 'warning', 10000);
            return false;
        }

        $rootScope.Throbber.Visible = true;
        var requestData =
        {
            ServicesAction: 'InsertEntityRelationship',
            EntityRelationshipList: $scope.EntityRelationshipList
        };

        var consolidateApiParamater =
        {
            Json: requestData,
        };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;
            $scope.ResetEntityRelationshipControl();
            $rootScope.Throbber.Visible = false;
        });

    }

    $scope.BackView = function () {
        $rootScope.ExitsRuleId = '0';
        $rootScope.SelectedPrimaryEntity = 0;
        $rootScope.PrimaryEntity = 0;
        $rootScope.PrimaryEntityCompanyTypeId = 0;
        $rootScope.PrimaryComapnyName = '';
        $rootScope.PrimaryCompanyMnemonic = '';
        $scope.companyList.items = [];
        $scope.companyList.selectedItems = [];
        $rootScope.EntityRelationshipData = [];
        $rootScope.IsEditEntityRelationship = false;
        $rootScope.EntityRelationshipFirstTab = true;
        $rootScope.EntityRelationshipSecondTab = false;
        $rootScope.ShowTimePeriod = false;
        $rootScope.ShowEditPanel = false;
        $scope.ResetEntityRelationshipControl();
        $rootScope.EntityRelationshipGridCallBack();
    }


    $rootScope.ReloadEditSection = function () {
        debugger;
        if ($rootScope.IsEditEntityRelationship) {

            $scope.EntityRelationship.CompanyTypeId = $rootScope.PrimaryEntityCompanyTypeId;

            $scope.LoadAllParentCompany($scope.EntityRelationship.CompanyTypeId);
        }
    }



    $scope.EntityRuleRuleModalPopup = function () {
        $ionicModal.fromTemplateUrl('templates/EntityRuleConfirmation.html', {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function (modal) {

            $scope.EntityRuleRulePopup = modal;
        });
    }
    $scope.EntityRuleRuleModalPopup();
    $scope.OpenEntityRuleRuleModalPopup = function () {
        debugger;
        $scope.FilterRuleTypeId = 100;
        $scope.EntityRuleRulePopup.show();

        $rootScope.RuleGridCallBack();
    }

    $scope.CloseEntityRuleModalPopup = function () {
        debugger;
        $scope.RuleDataForEntityRelationship = $scope.GridData;
        $scope.EntityRuleRulePopup.hide();
    }



});