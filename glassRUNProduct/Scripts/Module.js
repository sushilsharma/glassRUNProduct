/// <reference path="../report/script/reportscontroller.js" />
var app = angular.module("glassRUNProduct", ["textAngular", "aurbano.multiselect", "dualmultiselect", "dx", "ionic", "ion-datetime-picker", "ui.router", "ui.sortable", "oc.lazyLoad", "ionic-material", "ngStorage", "angucomplete-alt", "angucomplete", "ngSanitize", "ui.bootstrap", "ui.select", "formio", "ngFormBuilder", "ngJsonExplorer", "ngCookies", "angular-theme-spinner", "kendo.directives", "angularjs-dropdown-multiselect", "naif.base64", "app.filters", "colorpicker.module", "ngPatternRestrict"]);



app.run(function ($rootScope, formioComponents, $timeout, $sessionStorage, $state) {
    //FastClick.attach(document.body);

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, $state) {

    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {

    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    });

    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
    });

    $rootScope.$on('$viewContentLoaded', function (event) {

        $log.debug('$viewContentLoaded - fired after dom rendered', event);
    });

    String.format = function () {
        // The string containing the format items (e.g. "{0}")
        // will and always has to be the first argument.
        var theString = arguments[0];

        // start with the second argument (i = 1)
        for (var i = 1; i < arguments.length; i++) {
            // "gm" = RegEx options for Global search (more than one instance)
            // and for Multiline search
            var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            if (theString !== undefined) {
                theString = theString.replace(regEx, arguments[i]);
            }
        }

        return theString;
    }


});

app.config(function ($stateProvider, $httpProvider, $urlRouterProvider, $ocLazyLoadProvider, $logProvider, $compileProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.backButton.previousTitleText(false).text('Back');
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $logProvider.debugEnabled(false);
    $compileProvider.debugInfoEnabled(false);
    $ionicConfigProvider.scrolling.jsScrolling(false);

    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'Menu.html'
        }).state('loginContent', {
            url: "/loginContent",
            templateUrl: 'LoginContent.html',
            controller: 'loginController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Login/Controller/loginController.js', 'Scripts/Login/Services/AdminServices.js']

                        });
                    }
                ]
            }
        }).state('Component', {
            url: "/Component",
            templateUrl: 'ComponentPage.html'
        }).state('Wizard', {
            url: "/Wizard",
            templateUrl: 'FormWizard.html',
            controller: 'WizardCtrl'
        }).state('MasterPageUI', {
            url: "/MasterPageUI",
            templateUrl: 'MasterPageUISample.html',
            controller: 'pluginsCtrl'
        }).state('ViewRoleAccess', {
            url: "/ViewRoleAccess",
            templateUrl: 'ViewRoleAccess.html',
            controller: 'ViewRoleAccessController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ViewRoleAccessController.js', 'Scripts/Services/ViewRoleAccessServices.js']

                        });
                    }
                ]
            }
        }).state('AddRoleAccess', {
            url: "/AddRoleAccess",
            templateUrl: 'AddRoleAccess.html',
            controller: 'AddRoleAccessController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/AddRoleAccessController.js', 'Scripts/Services/AddRoleAccessServices.js', 'Scripts/Controller/AddPageAndControlAccessController.js']

                        });
                    }
                ]
            }
        }).state('InquiryDetails', {
            url: "/InquiryDetails",
            templateUrl: 'InquiryDetailsPage.html',
            controller: 'InquiryDetailsController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/InquiryDetailsController.js']

                        });
                    }
                ]
            }
        }).state('CreateInquiryOld', {
            url: "/CreateInquiryOld",
            templateUrl: 'CreateInquiryPageOld.html',
            controller: 'ViewCreateInquiryController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ViewCreateInquiryController.js',
                                'Scripts/Controller/ViewCreditLimitAndEmptiesController.js',
                                'Scripts/Controller/ViewDeliveryLocationController.js',
                                'Scripts/Controller/ViewTruckSizeController.js',
                                'Scripts/Controller/ViewOrderPraposedDateController.js']

                        });
                    }
                ]
            }
        })
        .state('VehicleSize', {
            url: "/VehicleSize",
            templateUrl: 'TruckSize/VehicleSize.html',
            controller: 'VehicleSizeController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['TruckSize/Scripts/Controller/VehicleSizeController.js']

                        });
                    }
                ]
            }
        }).state('ViewCreateInquiry', {
            url: "/ViewCreateInquiry",
            templateUrl: 'ViewInquiryForCustomer.html',
            controller: 'ViewInquiryController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ViewInquiryController.js']

                        });
                    }
                ]
            }
        }).state('ViewInquiryForOM', {
            url: "/ViewInquiryForOM",
            templateUrl: 'ViewInquiryForOM.html',
            controller: 'CreateInquiryForOMController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/CreateInquiryForOMController.js']

                        });
                    }
                ]
            }
        }).state('ItemAllocationManagement', {
            url: "/ItemAllocationManagement",
            templateUrl: 'ItemAllocationManagement.html',
            controller: 'ItemAllocationManagementController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ItemAllocationManagementController.js']

                        });
                    }
                ]
            }
        }).state('Welcome', {
            url: "/Welcome",
            templateUrl: 'WelcomePage.html'
        })
        .state('TranportOprator', {
            url: "/TranportOprator",
            templateUrl: 'TransporterPage.html',
            controller: 'TransportOpratorController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/TransportOpratorController.js', 'Scripts/Services/TransportOpratorService.js']

                        });
                    }
                ]
            }
        }).state('AddPolicy', {
            url: "/AddPolicy",
            templateUrl: 'AddPolicy.html',
            controller: 'AddPolicyController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/AddPolicyController.js', 'Scripts/Services/AddPolicyServices.js']

                        });
                    }
                ]
            }
        }).state('PlateNumberAllocation', {
            url: "/PlateNumberAllocation",
            templateUrl: 'PlateNumberAllocation.html',
            controller: 'PlateNumberAllocationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/PlateNumberAllocationController.js']

                        });
                    }
                ]
            }
        }).state('ProcessConfiguration', {
            url: "/ProcessConfiguration",
            templateUrl: 'ProcessConfigurationUI.html',
            controller: 'ProcessConfigurationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ProcessConfigurationController.js', 'Scripts/Services/ProcessConfigurationService.js']

                        });
                    }
                ]
            }
        }).state('UploadEnquirySTPage', {
            url: "/UploadEnquirySTPage",
            templateUrl: 'UplaodEnquirySTPage.html',
            controller: 'UploadEnquirySTController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/UploadEnquirySTController.js']

                        });
                    }
                ]
            }
        }).state('UploadEnquiryPageForMOT', {
            url: "/UploadEnquiryPageForMOT",
            templateUrl: 'UploadEnquiryPageForMOT.html',
            controller: 'UploadEnquiryMOTController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {

                        return $ocLazyLoad.load({

                            files: ['Scripts/Controller/UploadEnquiryMOTController.js'],
                            cache: false
                        });

                    }
                ]
            }
        }).state('UploadEnquiryPageForMOTWithPromotion', {
            url: "/UploadEnquiryPageForMOTWithPromotion",
            templateUrl: 'UploadEnquiryPageForMOT.html',
            controller: 'UploadEnquiryMOTController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {

                        return $ocLazyLoad.load({

                            files: ['Scripts/Controller/UploadEnquiryMOTController.js'],
                            cache: false
                        });

                    }
                ]
            }
        }).state('GratisOrder', {
            url: "/GratisOrder",
            templateUrl: 'GratisOrder.html',
            controller: 'GratisOrderController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/GratisOrderController.js']

                        });
                    }
                ]
            }
        }).state('ResourcesKey', {
            url: "/ResourcesKey",
            templateUrl: 'ResourcesKey.html',
            controller: 'ResourcesKeyController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ResourcesKeyController.js']

                        });
                    }
                ]
            }
        }).state('ItemAllocation', {
            url: "/ItemAllocation",
            templateUrl: 'ItemAllocation.html',
            controller: 'ItemAllocationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ItemAllocationController.js']

                        });
                    }
                ]
            }
        }).state('UpdateOrder', {
            url: "/UpdateOrder",
            templateUrl: 'UpdateOrder.html',
            controller: 'ViewUpdateOrderController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ViewUpdateOrderController.js', 'Scripts/Controller/ViewCreditLimitAndEmptiesForOrderController.js', 'Scripts/Controller/ViewDeliveryLocationForOrderController.js', 'Scripts/Controller/ViewTruckSizeForOrderController.js', 'Scripts/Controller/ViewOrderProposedDateForOrderController.js']

                        });
                    }
                ]
            }
        }).state('TruckUI', {
            url: "/TruckUI",
            templateUrl: 'TruckUI.html',
            controller: 'TruckController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/TruckController.js']

                        });
                    }
                ]
            }
        }).state('RecievingLocationCapacity', {
            url: "/RecievingLocationCapacity",
            templateUrl: 'RecievingLocationCapacity.html',
            controller: 'ReceivingLocationCapacityController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ReceivingLocationCapacityController.js']

                        });
                    }
                ]
            }
        }).state('AuthenticationUsers', {
            url: "/AuthenticationUsers",
            templateUrl: 'AuthenticationUsers.html',
            controller: 'AuthenticationUsersController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/AuthenticationUsersController.js', 'Scripts/Login/Services/AdminServices.js']

                        });
                    }
                ]
            }
        }).state('PasswordRecovery', {
            url: "/PasswordRecovery",
            templateUrl: 'PasswordRecovery.html',
            controller: 'PasswordRecoveryController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/PasswordRecoveryController.js', 'Scripts/Login/Services/AdminServices.js']

                        });
                    }
                ]
            }
        }).state('ChangePassword', {
            url: "/ChangePassword",
            templateUrl: 'ChangePasswordUI.html',
            controller: 'ChangePasswordController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ChangePasswordController.js', 'Scripts/Login/Services/AdminServices.js']

                        });
                    }
                ]
            }
        }).state('EmailEvent', {
            url: "/EmailEvent",
            templateUrl: 'EmailEvent.html',
            controller: 'EmailEventController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/EmailEventController.js']
                        });
                    }
                ]
            }
        }).state('EmailContent', {
            url: "/EmailContent",
            templateUrl: 'EmailContent.html',
            controller: 'EmailContentController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/EmailContentController.js']
                        });
                    }
                ]
            }
        }).state('EmailConfiguration', {
            url: "/EmailConfiguration",
            templateUrl: 'EmailConfigurationUI.html',
            controller: 'EmailConfigurationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/EmailConfigurationController.js']

                        });
                    }
                ]
            }
        }).state('EmailDynamicTable', {
            url: "/EmailDynamicTable",
            templateUrl: 'EmailDynamicTable.html',
            controller: 'EmailDynamicTableController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/EmailDynamicTableController.js']

                        });
                    }
                ]
            }
        }).state('EmailDynamicColumn', {
            url: "/EmailDynamicColumn",
            templateUrl: 'EmailDynamicColumn.html',
            controller: 'EmailDynamicColumnController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/EmailDynamicColumnController.js']

                        });
                    }
                ]
            }
        }).state('Carrier', {
            url: "/Carrier",
            templateUrl: 'CarrierPage.html',
            controller: 'CarrierController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/CarrierPageController.js']

                        });
                    }
                ]
            }
        }).state('ManageShipTo', {
            url: "/ManageShipTo",
            templateUrl: 'ManageShipTo.html',
            controller: 'ManageShipToController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ManageShipToController.js']

                        });
                    }
                ]
            }
        }).state('CustomerOrder', {
            url: "/CustomerOrder",
            templateUrl: 'CustomerOrderUI.html',
            controller: 'CustomerOrderController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/CustomerOrderController.js']

                        });
                    }
                ]
            }
        }).state('Item', {
            url: "/Item",
            templateUrl: 'Item/ItemUI.html',
            controller: 'ItemController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Item/Scripts/ItemUIController.js', 'Scripts/Controller/ItemViewController.js']

                        });
                    }
                ]
            }
        }).state('ItemDetailPage', {
            url: "/ItemDetailPage",
            templateUrl: 'ItemDetailPage.html',
            controller: 'ItemDetailPageController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ItemDetailPageController.js']

                        });
                    }
                ]
            }
        }).state('STOrderView', {
            url: "/STOrderView",
            templateUrl: 'STOrderView.html',
            controller: 'STOrderController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/STOrderController.js']

                        });
                    }
                ]
            }
        }).state('UserPageDetails', {
            url: "/UserPageDetails",
            templateUrl: 'DeliveryPersonDetails.html',
            controller: 'UserDetailsController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/UserDetailsController.js', 'Scripts/Controller/AddPageAndControlAccessController.js']

                        });
                    }
                ]
            }
        }).state('TransportVehicle', {
            url: "/TransportVehicle",
            templateUrl: 'TransportVehicleUI.html',
            controller: 'TransportVehicleController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/TransportVehicleController.js']

                        });
                    }
                ]
            }
        }).state('PlateNumberAndDriverMapping', {
            url: "/PlateNumberAndDriverMapping",
            templateUrl: 'PlateNumberAndDriverMappingUI.html',
            controller: 'PlateNumberAndDriverMappingController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/PlateNumberAndDriverMappingController.js']

                        });
                    }
                ]
            }
        }).state('RuleEnginePage', {
            url: "/RuleEnginePage",
            templateUrl: 'RuleEnginePage.html',
            controller: 'RuleEnginePageController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/RuleEnginePageController.js', 'Scripts/Controller/ViewRuleEngineController.js', 'Scripts/Controller/ViewRuleFunctionController.js']

                        });
                    }
                ]
            }
        }).state('BusinessRulesEnginePage', {
            url: "/BusinessRulesEnginePage",
            templateUrl: 'BusinessRulesEnginePage.html',
            controller: 'BusinessRulesEnginePageController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/BusinessRulesEnginePageController.js', 'Scripts/Controller/AddEditBusinessRuleEngineController.js', 'Scripts/Controller/ViewRuleFunctionController.js']

                        });
                    }
                ]
            }
        }).state('ConfigureGrid', {
            url: "/ConfigureGrid",
            templateUrl: 'ConfigurationSampleGrid.html',
            controller: 'ConfigurationSampleGridController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ConfigurationSampleGridController.js']

                        });
                    }
                ]
            }
        }).state('OrderGrid', {
            url: "/OrderGrid",
            templateUrl: 'OrderGrid.html',
            controller: 'OrderGridController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderGridController.js']

                        });
                    }
                ]
            }
        }).state('OrderGridNew', {
            url: "/OrderGridNew",
            templateUrl: 'OrderGridNew.html',
            controller: 'OrderGridNewController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderGridNewController.js']

                        });
                    }
                ]
            }
        }).state('ValidateLicense', {
            url: "/ValidateLicense",
            templateUrl: 'ValidateLicenseUI.html',
            controller: 'ValidateLicenseController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ValidateLicenseController.js']

                        });
                    }
                ]
            }
        }).state('GratisOrderGrid', {
            url: "/GratisOrderGrid",
            templateUrl: 'OrderGrid.html',
            controller: 'OrderGridController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderGridController.js']

                        });
                    }
                ]
            }
        }).state('GridConfigurationPage', {
            url: "/GridConfigurationPage",
            templateUrl: 'GridConfigurationPage.html',
            controller: 'GridConfigurationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/GridConfigurationController.js']

                        });
                    }
                ]
            }
        }).state('ActivityLogConfiguration', {
            url: "/ActivityLogConfiguration",
            templateUrl: 'ActivityLogConfiguration.html',
            controller: 'ActivityLogConfigurationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ActivityLogConfigurationController.js']

                        });
                    }
                ]
            }
        }).state('AddWave', {
            url: "/AddWave",
            templateUrl: 'AddWaveUI.html',
            controller: 'AddWaveController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/AddWaveController.js', 'Scripts/Controller/ViewRuleEngineController.js', 'Scripts/Controller/ViewRuleFunctionController.js']

                        });
                    }
                ]
            }
        }).state('DistributorUI', {
            url: "/DistributorUI",
            templateUrl: 'DistributorDetailsUI.html',
            controller: 'DistributorDetailsController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/DistributorDetailsController.js']

                        });
                    }
                ]
            }
        }).state('FeedbackDetailPage', {
            url: "/FeedbackDetailPage",
            templateUrl: 'FeedbackDetailPage.html',
            controller: 'FeedbackDetailController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/FeedbackDetailController.js', 'FeedbackView/Scripts/OrderFeedbackViewController.js']

                        });
                    }
                ]
            }
        }).state('FeedbackGridPage', {
            url: "/FeedbackGridPage",
            templateUrl: 'FeedbackGridPage.html',
            controller: 'FeedbackGridController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/FeedbackGridController.js']

                        });
                    }
                ]
            }
        }).state('ResetPassword', {
            url: "/ResetPassword",
            templateUrl: 'ResetPasswordUI.html',
            controller: 'ResetPasswordController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ResetPasswordController.js']

                        });
                    }
                ]
            }
        }).state('LoadOptimizationPage', {
            url: "/LoadOptimizationPage",
            templateUrl: 'LoadOptimizationPage.html',
            controller: 'LoadOptimizationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/LoadOptimizationController.js']

                        });
                    }
                ]
            }
        }).state('OverallFeedback', {
            url: "/OverallFeedback",
            templateUrl: 'OverallFeedback.html',
            controller: 'OverallFeedbackController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OverallFeedbackController.js']

                        });
                    }
                ]
            }
        }).state('OrderFeedbackView', {
            url: "/OrderFeedbackView",
            templateUrl: 'FeedbackView/OrderFeedbackView.html',
            controller: 'OrderFeedbackViewController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['FeedbackView/Scripts/OrderFeedbackViewController.js']

                        });
                    }
                ]
            }
        }).state('OrderGridTruckOut', {
            url: "/OrderGridTruckOut",
            templateUrl: 'OrderGridNew.html',
            controller: 'OrderGridTruckOutController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderGridTruckOutController.js']

                        });
                    }
                ]
            }
        }).state('OrderGridTruckAllocatedPlateNo', {
            url: "/OrderGridTruckAllocatedPlateNo",
            templateUrl: 'OrderGridNew.html',
            controller: 'OrderGridTruckAllocatedPlateNoController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderGridTruckAllocatedPlateNoController.js']

                        });
                    }
                ]
            }
        }).state('ViewComplaints', {
            url: "/ViewComplaints",
            templateUrl: 'ViewComplaint.html',
            controller: 'ViewComplaintController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ViewComplaintController.js']

                        });
                    }
                ]
            }
        }).state('AccordionInGrid', {
            url: "/AccordionInGrid",
            templateUrl: 'AccordionInGrid.html',
            controller: 'AccordionInGridController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/AccordionInGridController.js']

                        });
                    }
                ]
            }
        }).state('SalesAdminApproval', {
            url: "/SalesAdminApproval",
            templateUrl: 'EnquiryList.html',
            controller: 'SalesAdminApprovalController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/SalesAdminApprovalController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Location/Controller/LocationDropdownViewController.js']

                        });
                    }
                ]
            }
        }).state('Workflow', {
            url: "/ProcessConfigurator",
            templateUrl: 'ManageWorkflow.html',
            controller: 'WorkflowController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/WorkflowController.js', 'Scripts/Controller/AddWorkflowController.js', 'Scripts/Controller/AddWorkflowStepController.js', 'Scripts/Controller/WorkflowRuleMappingController.js']

                        });
                    }
                ]
            }
        }).state('TrackerPage', {
            url: "/TrackerPage",
            templateUrl: 'TrackerPage.html',
            controller: 'TrackerController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/TrackerPageController.js']

                        });
                    }
                ]
            }
        }).state('CreateInquiryPage', {
            url: "/CreateInquiryPage",
            templateUrl: 'CreateInquiryPage.html',
            controller: 'CreateInquiryController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/CreateInquiryPageController.js', 'Scripts/Controller/AddLocationController.js', 'Scripts/Controller/ReasonCodeViewController.js']

                        });
                    }
                ]
            }
        }).state('PaymentPlan', {
            url: "/PaymentPlan",
            templateUrl: 'PaymentPlan.html',
            controller: 'PaymentPlanController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/PaymentPlanController.js']

                        });
                    }
                ]
            }
        }).state('PaymentSlab', {
            url: "/PaymentSlab",
            templateUrl: 'PaymentSlab.html',
            controller: 'PaymentSlabController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/PaymentSlabController.js']

                        });
                    }
                ]
            }
        }).state('PaymentPlanTransporterMapping', {
            url: "/PaymentPlanTransporterMapping",
            templateUrl: 'PaymentPlanTransporterMapping.html',
            controller: 'PaymentPlanTransporterMappingController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/PaymentPlanTransporterMappingController.js']

                        });
                    }
                ]
            }
        }).state('AddEditEvent', {
            url: "/AddEditEvent",
            templateUrl: 'Notifications/AddEditEvent.html',

            controller: 'AddEditEventController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Notifications/Scripts/Controller/AddEditEventController.js']

                        });
                    }
                ]
            }
        }).state('ObjectVariableDetails', {
            url: "/ObjectVariableDetails",
            templateUrl: 'Notifications/AddEditObjectVariable.html',
            controller: 'ObjectVariableController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Notifications/Scripts/Controller/ObjectVariableController.js', 'Scripts/Controller/AddPageAndControlAccessController.js']

                        });
                    }
                ]
            }
        }).state('CreateNotificationTemplate', {
            url: "/CreateNotificationTemplate",
            templateUrl: 'Notifications/AddEditNotificationTemplate.html',
            controller: 'NotificationTemplateController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Notifications/Scripts/Controller/NotificationTemplateController.js', 'Notifications/Scripts/Controller/AddNotificationController.js']

                        });
                    }
                ]
            }
        }).state('EventRetrySettings', {
            url: "/EventRetrySettings",
            templateUrl: 'Notifications/EventRetrySettings.html',
            controller: 'EventRetrySettingsController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Notifications/Scripts/Controller/EventRetrySettingsController.js']

                        });
                    }
                ]
            }
        }).state('OrderList', {
            url: "/OrderList",
            templateUrl: 'OrderList.html',
            controller: 'OrderListController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderListController.js', 'Scripts/Controller/AddItemController.js',
                                'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js',
                                'Scripts/Controller/ItemViewController.js',
                                'Location/Controller/LocationDropdownViewController.js',
                                'Location/Controller/DeliveryLocationDropdownViewController.js']

                        });
                    }
                ]
            }
        }).state('PalletCountList', {
            url: "/PalletCountList",
            templateUrl: 'PalletCountList.html',
            controller: 'PalletCountListController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/PalletCountListController.js']

                        });
                    }
                ]
            }
        }).state('STOrderList', {
            url: "/STOrderList",
            templateUrl: 'OrderList.html',
            controller: 'OrderListController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderListController.js', 'Scripts/Controller/AddItemController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js', 'Scripts/Controller/ItemViewController.js',
                                'Location/Controller/LocationDropdownViewController.js', 'Location/Controller/DeliveryLocationDropdownViewController.js']

                        });
                    }
                ]
            }
        }).state('OrderExport', {
            url: "/OrderExport",
            templateUrl: 'OrderList.html',
            controller: 'OrderExportController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderExportController.js', 'Scripts/Controller/AddItemController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js', 'Scripts/Controller/ItemViewController.js']

                        });
                    }
                ]
            }
        }).state('DriverAssignment', {
            url: "/DriverAssignment",
            templateUrl: 'OrderList.html',
            controller: 'OrderListController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderListController.js', 'Scripts/Controller/AddItemController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js', 'Scripts/Controller/ItemViewController.js']

                        });
                    }
                ]
            }
        }).state('PaymentRequest', {
            url: "/PaymentRequest",
            templateUrl: 'OrderList.html',
            controller: 'OrderListController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderListController.js', 'Scripts/Controller/AddItemController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js']

                        });
                    }
                ]
            }
        }).state('License', {
            url: "/License",
            templateUrl: 'LicenseInfo.html',
            controller: 'LicenseInfoController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/js/icheck/icheck.min.js', 'Scripts/Controller/LicenseInfoController.js']

                        });
                    }
                ]
            }
        }).state('PaymentRequestConfirmation', {
            url: "/PaymentRequestConfirmation",
            templateUrl: 'PaymentRequest/PaymentRequestConfirmationPage.html',
            controller: 'PaymentRequestConfirmationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['PaymentRequest/Scripts/PaymentRequestConfirmationController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js']

                        });
                    }
                ]
            }
        }).state('CustomerPaymentDetailPage', {
            url: "/CustomerPaymentDetailPage",
            templateUrl: 'CustomerPaymentDetail/CustomerPaymentDetailPage.html',
            controller: 'CustomerPaymentDetailController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['CustomerPaymentDetail/Scripts/CustomerPaymentDetailController.js', 'Scripts/Controller/ReasonCodeViewController.js']

                        });
                    }
                ]
            }
        }).state('RoleWiseStatus', {
            url: "/RoleWiseStatus",
            templateUrl: 'RoleWiseStatus/RoleWiseStatusUI.html',
            controller: 'RoleWiseStatusController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['RoleWiseStatus/Scripts/Controller/RoleWiseStatusController.js']

                        });
                    }
                ]
            }
        }).state('FinancePartner', {
            url: "/FinancePartner",
            templateUrl: 'FinancePartner.html',
            controller: 'FinancerPartnerController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/FinancerPartnerController.js']

                        });
                    }
                ]
            }
        }).state('AddCompany', {
            url: "/AddCompany",
            templateUrl: 'Company/CompanyPage.html',
            controller: 'CompanyPageController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Company/Scripts/Controller/CompanyPageController.js']

                        });
                    }
                ]
            }
        }).state('AddFinancePartner', {
            url: "/AddFinancePartner",
            templateUrl: 'Company/CompanyPage.html',
            controller: 'CompanyPageController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Company/Scripts/Controller/CompanyPageController.js']

                        });
                    }
                ]
            }
        }).state('Transporter', {
            url: "/Transporter",
            templateUrl: 'Company/CompanyPage.html',
            controller: 'CompanyPageController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Company/Scripts/Controller/CompanyPageController.js']

                        });
                    }
                ]
            }
        }).state('GridColumn', {
            url: "/GridColumn",
            templateUrl: 'GridConfiguration/GridColumn.html',
            controller: 'GridColumnController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['GridConfiguration/Scripts/GridColumnController.js']

                        });
                    }
                ]
            }
        }).state('Location', {
            url: "/Location",
            templateUrl: 'LocationUI.html',
            controller: 'LocationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/LocationController.js', 'Scripts/Controller/AddLocationController.js']

                        });
                    }
                ]
            }
        }).state('CompanyTransporterMapping', {
            url: "/CompanyTransporterMapping",
            templateUrl: 'CompanyTransporterMapping/CompanyTransporterMapping.html',
            controller: 'CompanyTransporterMappingController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['CompanyTransporterMapping/Scripts/Controller/CompanyTransporterMappingController.js', 'Location/Controller/LocationDropdownViewController.js', 'Location/Controller/DeliveryLocationDropdownViewController.js']

                        });
                    }
                ]
            }
        }).state('ControlTower', {
            url: "/ControlTower",
            templateUrl: 'ControlTower/ControlTower.html',
            controller: 'ControlTowerController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['ControlTower/Scripts/ControlTowerController.js', 'Scripts/Controller/OrderListController.js', 'FeedbackView/Scripts/OrderFeedbackViewController.js', 'Scripts/Controller/ReasonCodeViewController.js']

                        });
                    }
                ]
            }
        }).state('EntityRelationship', {
            url: "/EntityRelationship",
            templateUrl: 'EntityRelationship/EntityRelationship.html',
            controller: 'EntityRelationshipController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['EntityRelationship/Scripts/EntityRelationshipController.js',
                                'EntityRelationship/Scripts/AddEditEntityRelationshipController.js',
                                'Scripts/Controller/BusinessRulesEnginePageController.js', 'Scripts/Controller/AddEditBusinessRuleEngineController.js', 'Scripts/Controller/ViewRuleFunctionController.js']

                        });
                    }
                ]
            }
        }).state('FinanceDashboard', {
            url: "/FinanceDashboard",
            templateUrl: 'FinanceDashboard/FinanceDashboardPage.html',
            controller: 'FinanceDashboardController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['FinanceDashboard/Scripts/FinanceDashboardController.js']

                        });
                    }
                ]
            }
        }).state('CreateUser', {
            url: "/CreateUser",
            templateUrl: 'UserDetail/UserDetailPage.html',
            controller: 'UserDetailController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['UserDetail/Scripts/UserDetailController.js']

                        });
                    }
                ]
            }
        }).state('LorryReceiptView', {
            url: "/LorryReceiptView",
            templateUrl: 'LorryReceipt/LorryReceiptView.html',
            controller: 'LorryReceiptController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['LorryReceipt/Scripts/LorryReceiptController.js']

                        });
                    }
                ]
            }
        }).state('SettingMaster', {
            url: "/SettingMaster",
            templateUrl: 'Views/SettingMaster/SettingMaster.html',
            controller: 'SettingMasterController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Views/SettingMaster/Scripts/SettingMasterController.js']

                        });
                    }
                ]
            }
        }).state('DimensionMapping', {
            url: "/DimensionMapping",
            templateUrl: 'DimensionMapping/DimensionMapping.html',
            controller: 'DimensionMappingController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['DimensionMapping/Scripts/DimensionMappingController.js']

                        });
                    }
                ]
            }
        }).state('Activity', {
            url: "/Activity",
            templateUrl: 'Activity/ActivityPage.html',
            controller: 'ActivityController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Activity/Scripts/ActivityController.js']

                        });
                    }
                ]
            }
        }).state('JDESalesOrderCreationConfiguration', {
            url: "/JDESalesOrderCreationConfiguration",
            templateUrl: 'JDEAdapter/JDESalesOrderCreationConfiguration.html',
            controller: 'JDESalesOrderCreationConfigurationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['JDEAdapter/Scripts/JDESalesOrderCreationConfigurationController.js']

                        });
                    }
                ]
            }
        }).state('FormBuilder', {
            url: "/FormBuilder",
            templateUrl: 'FormBuilder/FormBuilderPage.html',
            controller: 'FormBuilderController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['FormBuilder/src/FormBuilderController.js']

                        });
                    }
                ]
            }
        }).state('Pagewiseconfiguration', {
            url: "/Pagewiseconfiguration",
            templateUrl: 'Pagewiseconfiguration/Pagewiseconfiguration.html',
            controller: 'PagewiseconfigurationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Pagewiseconfiguration/Scripts/Controller/PagewiseconfigurationController.js']

                        });
                    }
                ]
            }
        }).state('PalletInclusionGroup', {
            url: "/PalletInclusionGroup",
            templateUrl: 'PalletInclusionGroup/PalletInclusionGroupPage.html',
            controller: 'PalletInclusionGroupController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['PalletInclusionGroup/Scripts/Controller/PalletInclusionGroupController.js']

                        });
                    }
                ]
            }
        }).state('ItemSoldToMapping', {
            url: "/ItemSoldToMapping",
            templateUrl: 'ItemSoldToMapping/ItemSoldToMappingUI.html',
            controller: 'ItemSoldToMappingController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['ItemSoldToMapping/Scripts/Controller/ItemSoldToMappingController.js']

                        });
                    }
                ]
            }
        }).state('OrderListForTest', {
            url: "/OrderListForTest",
            templateUrl: 'Test/OrderListPage/OrderLisForTest.html',
            controller: 'OrderListControllerForTest',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Test/OrderListPage/Script/OrderListControllerForTest.js', 'Scripts/Controller/AddItemController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js', 'Scripts/Controller/ItemViewController.js',
                                'Location/Controller/LocationDropdownViewController.js', 'Test/OrderListPage/Script/DeliveryLocationDropdownViewControllerForTest.js']

                        });
                    }
                ]
            }
        }).state('STOrderRecievedGrid', {
            url: "/STOrderRecievedGrid",
            templateUrl: 'OrderList.html',
            controller: 'OrderListController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderListController.js', 'Scripts/Controller/AddItemController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js', 'Scripts/Controller/ItemViewController.js']

                        });
                    }
                ]
            }
        }).state('OrderTruckInGrid', {
            url: "/OrderTruckInGrid",
            templateUrl: 'OrderList.html',
            controller: 'OrderListController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderListController.js', 'Scripts/Controller/AddItemController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js', 'Scripts/Controller/ItemViewController.js']

                        });
                    }
                ]
            }
        }).state('GraticsOrderProcessed', {
            url: "/GraticsOrderProcessed",
            templateUrl: 'OrderList.html',
            controller: 'OrderListController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderListController.js', 'Scripts/Controller/AddItemController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js', 'Scripts/Controller/ItemViewController.js']

                        });
                    }
                ]
            }
        }).state('GraticsOrderUnprocess', {
            url: "/GraticsOrderUnprocess",
            templateUrl: 'EnquiryList.html',
            controller: 'SalesAdminApprovalController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/SalesAdminApprovalController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Location/Controller/LocationDropdownViewController.js']

                        });
                    }
                ]
            }
        }).state('MOTEnquiryList', {
            url: "/MOTEnquiryList",
            templateUrl: 'EnquiryList.html',
            controller: 'SalesAdminApprovalController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/SalesAdminApprovalController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Location/Controller/LocationDropdownViewController.js']

                        });
                    }
                ]
            }
        }).state('CollectionLocation', {
            url: "/CollectionLocation",
            templateUrl: 'LocationUI.html',
            controller: 'LocationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/LocationController.js', 'Scripts/Controller/AddLocationController.js']

                        });
                    }
                ]
            }
        }).state('ShipToLocation', {
            url: "/ShipToLocation",
            templateUrl: 'LocationUI.html',
            controller: 'LocationController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/LocationController.js', 'Scripts/Controller/AddLocationController.js']

                        });
                    }
                ]
            }
        }).state('TruckInTruckOutHomePage', {
            url: "/TruckInTruckOutHomePage",
            templateUrl: 'TruckInTruckOut/HomePage.html',
            controller: 'HomeCtrl',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['TruckInTruckOut/Scripts/Controller/HomeController.js']

                        });
                    }
                ]
            }
        }).state('TruckInTruckOutOrderList', {
            url: "/TruckInTruckOutOrderList",
            templateUrl: 'TruckInTruckOut/OrderList.html',
            controller: 'OrderListCtrl',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['TruckInTruckOut/Scripts/Controller/OrderListController.js']

                        });
                    }
                ]
            }
        }).state('LoadOrderInTruck', {
            url: "/LoadOrderInTruck",
            templateUrl: 'TruckInTruckOut/LoadOrderInTruck.html',
            controller: 'LoadOrderInTruckController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['TruckInTruckOut/Scripts/Controller/LoadOrderInTruckController.js']

                        });
                    }
                ]
            }
        }).state('InputTruckInDetails', {
            url: "/InputTruckInDetails",
            templateUrl: 'TruckInTruckOut/InputTruckDetails.html',
            controller: 'InputTruckInDetails',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['TruckInTruckOut/Scripts/Controller/InputTruckInDetailsController.js']

                        });
                    }
                ]
            }
        }).state('TruckInList', {
            url: "/TruckInList",
            templateUrl: 'TruckInTruckOut/TruckInList.html',
            controller: 'TruckInListCtrl',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['TruckInTruckOut/Scripts/Controller/TruckInListController.js']

                        });
                    }
                ]
            }
        }).state('TruckDetails', {
            url: "/TruckDetails",
            templateUrl: 'TruckInTruckOut/TruckDetails.html',
            controller: 'TruckDetailsController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['TruckInTruckOut/Scripts/Controller/TruckDetailsController.js']

                        });
                    }
                ]
            }
        }).state('SearchPage', {
            url: "/SearchPage",
            templateUrl: 'TruckInTruckOut/SearchPage.html',
            controller: 'SearchPageCtrl',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['TruckInTruckOut/Scripts/Controller/SearchPageController.js']

                        });
                    }
                ]
            }
        }).state('CreateDriver', {
            url: "/CreateDriver",
            templateUrl: 'UserDetail/DriverPage.html',
            controller: 'DriverController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['UserDetail/Scripts/DriverPageController.js']

                        });
                    }
                ]
            }
        }).state('CFRDashboardReport', {
            url: "/CFRDashboardReport",
            templateUrl: 'DashboardReportUI.html',
            controller: 'DashboardReportingController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {

                        return $ocLazyLoad.load({

                            files: ['Scripts/Controller/DashboardReportingController.js'],
                            cache: false
                        });

                    }
                ]
            }
        }).state('ShowCase', {
            url: "/ShowCase",
            templateUrl: 'ShowCase/ShowCaseUI.html',
            controller: 'ShowCaseController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['ShowCase/Scripts/Controller/ShowCaseController.js']

                        });
                    }
                ]
            }
        }).state('GratisList', {
            url: "/GratisList",
            templateUrl: 'GratisList.html',
            controller: 'GratisListController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/GratisListController.js']

                        });
                    }
                ]
            }
        }).state('ViewNotifications', {
            url: "/ViewNotifications",
            templateUrl: 'Notifications/ViewNotifications.html',
            controller: 'ViewNotificationsController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Notifications/Scripts/Controller/ViewNotificationsController.js']

                        });
                    }
                ]
            }
        }).state('Lookup', {
            url: "/Lookup",
            templateUrl: 'LookupView/Lookup.html',
            controller: 'LookupController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['LookupView/Scripts/Controller/LookupController.js']

                        });
                    }
                ]
            }
        }).state('PageControlUI', {
            url: "/PageControlUI",
            templateUrl: 'PageControlUI.html',
            controller: 'PageControlUIController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/PageControlUIController.js']

                        });
                    }
                ]
            }
        }).state('PageRuleEvent', {
            url: "/PageRuleEvent",
            templateUrl: 'PageRuleEvent/PageRuleEvent.html',
            controller: 'PageRuleEventController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['PageRuleEvent/Scripts/Controller/PageRuleEventController.js']

                        });
                    }
                ]
            }
        }).state('RunSequenceList', {
            url: "/RunSequenceList",
            templateUrl: 'EditRunSequenceList.html',
            controller: 'EditRunSequenceController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/EditRunSequenceController.js']

                        });
                    }
                ]
            }
        }).state('ManageInquiry', {
            url: "/ManageInquiry",
            templateUrl: 'EnquiryList.html',
            controller: 'SalesAdminApprovalController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/SalesAdminApprovalController.js',
                                'Scripts/Controller/ReasonCodeViewController.js',
                                'Location/Controller/LocationDropdownViewController.js',
                                'Enquiry/Script/EditEnquiryController.js']

                        });
                    }
                ]
            }
        }).state('CreateRPM', {
            url: "/CreateRPM",
            templateUrl: 'CreateInquiryPage.html',
            controller: 'CreateInquiryController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/CreateInquiryPageController.js', 'Scripts/Controller/AddLocationController.js', 'Scripts/Controller/ReasonCodeViewController.js']

                        });
                    }
                ]
            }
        }).state('RPMEnquiryList', {
            url: "/RPMEnquiryList",
            templateUrl: 'EnquiryList.html',
            controller: 'SalesAdminApprovalController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/SalesAdminApprovalController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Location/Controller/LocationDropdownViewController.js']

                        });
                    }
                ]
            }
        }).state('ManageOrder', {
            url: "/ManageOrder",
            templateUrl: 'OrderList.html',
            controller: 'OrderListController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderListController.js', 'Scripts/Controller/AddItemController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js', 'Scripts/Controller/ItemViewController.js',
                                'Location/Controller/LocationDropdownViewController.js',
                                'Location/Controller/DeliveryLocationDropdownViewController.js',
                                'OrderReceive/Scripts/OrderReceiveController.js',
                                'OrderDetails/Scripts/OrderDetailController.js']

                        });
                    }
                ]
            }
        }).state('RPMOrderList', {
            url: "/RPMOrderList",
            templateUrl: 'OrderList.html',
            controller: 'OrderListController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/OrderListController.js', 'Scripts/Controller/AddItemController.js', 'Scripts/Controller/ReasonCodeViewController.js', 'Scripts/Controller/PaymentRequestViewController.js', 'Scripts/Controller/ItemViewController.js',
                                'Location/Controller/LocationDropdownViewController.js', 'Location/Controller/DeliveryLocationDropdownViewController.js']

                        });
                    }
                ]
            }
        }).state('ManageCustomer', {
            url: "/ManageCustomer",
            templateUrl: 'ManageCustomer/ManageCustomer.html',
            controller: 'ManageCustomerController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['ManageCustomer/Scripts/ManageCustomerController.js']

                        });
                    }
                ]
            }
        }).state('ManageCustomerGroup', {
            url: "/ManageCustomerGroup",
            templateUrl: 'ManageCustomer/ManageCustomerGroup.html',
            controller: 'ManageCustomerGroupController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['ManageCustomer/Scripts/ManageCustomerGroupController.js']

                        });
                    }
                ]
            }
        }).state('UploadEnquiry', {
            url: "/UploadEnquiry",
            templateUrl: 'UploadEnquiryPageForMOT.html',
            controller: 'UploadEnquiryMOTController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {

                        return $ocLazyLoad.load({

                            files: ['Scripts/Controller/UploadEnquiryMOTController.js'],
                            cache: false
                        });

                    }
                ]
            }
        }).state('ManageCatalog', {
            url: "/ManageCatalog",
            templateUrl: 'ManageCatalog/ManageCatalog.html',
            controller: 'ManageCatalogueController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['ManageCatalog/Scripts/ManageCatalogueController.js']

                        });
                    }
                ]
            }
        }).state('CustomerItemPriceList', {
            url: "/CustomerItemPriceList",
            templateUrl: 'ManageCatalog/CustomerItemPriceList.html',
            controller: 'CustomerItemPriceController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['ManageCatalog/Scripts/CustomerItemPriceListController.js']

                        });
                    }
                ]
            }
        }).state('AddItemPrice', {
            url: "/AddItemPrice",
            templateUrl: 'ManageCatalog/AddItemPrice.html',
            controller: 'AddItemPriceController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['ManageCatalog/Scripts/AddItemPriceController.js']

                        });
                    }
                ]
            }
        }).state('ManagePricing', {
            url: "/ManagePricing",
            templateUrl: 'ManageCustomer/ManagePricing.html',
            controller: 'ManagePricingController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['ManageCustomer/Scripts/ManagePricingController.js']

                        });
                    }
                ]
            }
        }).state('UserOutletMapping', {
            url: "/UserOutletMapping",
            templateUrl: 'UserDetail/UserOutletMapping.html',
            controller: 'UserOutletMappingController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['UserDetail/Scripts/UserOutletMappingController.js']

                        });
                    }
                ]
            }
        }).state('HistoricalDataTransaction', {
            url: "/HistoricalDataTransaction",
            templateUrl: 'HistoricalTransactionDataPage.html',
            controller: 'HistoricalTransactionDataController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {

                        return $ocLazyLoad.load({

                            files: ['Scripts/Controller/HistoricalTransactionDataController.js'],
                            cache: false
                        });

                    }
                ]
            }
        }).state('LoadingBay', {
            url: "/LoadingBay",
            templateUrl: 'LoadingBayPage.html',
            controller: 'LoadingBayController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {

                        return $ocLazyLoad.load({

                            files: ['Scripts/Controller/LoadingBayController.js'],
                            cache: false
                        });

                    }
                ]
            }
        }).state('ActivateDeactivateUser', {
            url: "/ActivateDeactivateUser",
            templateUrl: 'Company/ActivateDeactivateUser.html',
            controller: 'CompanyPageController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Company/Scripts/Controller/CompanyPageController.js']

                        });
                    }
                ]
            }
        }).state('ForkLiftActivityView', {
            url: "/ForkLiftActivityView",
            templateUrl: 'ForkLiftActivityView.html',
            controller: 'ForkLiftActivityViewController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Scripts/Controller/ForkLiftActivityViewController.js']

                        });
                    }
                ]
            }
        }).state('Reports', {
            url: "/Reports",
            templateUrl: 'Report/Reports.html',
            controller: 'ReportsController',
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['Report/Script/ReportsController.js']

                        });
                    }
                ]
            }
        });



    //$httpProvider.interceptors.push('antiForgeryInterceptor');
    $urlRouterProvider.otherwise('/loginContent');


});

app.filter('htmlToPlaintext', function () {
    return function (text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
});

// Route State Load Spinner(used on page or content load)
app.directive('ngSpinnerLoader', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar


                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function () {

                    element.removeClass('hide'); // show spinner bar
                });
                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function () {
                    setTimeout(function () {
                        element.addClass('hide'); // hide spinner bar
                    }, 500);
                    $("html, body").animate({
                        scrollTop: 0
                    }, 550);
                });
            }
        };
    }
])

angular.module("app.filters", []).filter("currency", function () {
    return function (number, currencyCode) {
        var currency = {
            USD: "$",
            GBP: "£",
            AUD: "$",
            EUR: "€",
            CAD: "$",
            MIXED: "~"
        },
            thousand, decimal, format;
        if ($.inArray(currencyCode, ["USD", "AUD", "CAD", "MIXED"]) >= 0) {
            thousand = ",";
            decimal = ".";
            format = "%s%v";
        } else {
            thousand = ".";
            decimal = ",";
            format = "%s%v";
        };

        var formatednumber = accounting.formatMoney(number, currency[currencyCode], 0, thousand, decimal, format);

        var result = formatednumber.substring(1, formatednumber.length);

        //if (result !== undefined && result !== "") {
        //    if (result.indexOf(',') >= 0) {
        //        result = result.toString().split(",")[0];
        //    }
        //}

        return result;
    };
});


"use strict";
app.directive('setHeightcustom', function ($window, $document) {
    return {
        link: function (scope, element, attrs) {

            scope.onResizeFunctioncustom = function () {
                var h = $window.innerHeight - 485;
                h = h + 'px';
                element.css('height', h);
            };

            scope.onResizeFunctioncustom();

            angular.element($window).bind('resize', function () {
                scope.onResizeFunctioncustom();
                scope.$apply();
            });

        }
    }
});


//Added By Chetan Tambe (25 Sept 2019) : For setting the height of page
"use strict";
app.directive('setHeightcustomorderlistcontainer', function ($window, $document) {
    return {
        link: function (scope, element, attrs) {

            scope.onResizeFunctioncontainer = function () {
                var h = $window.innerHeight - 362;
                h = h + 'px';
                element.css('height', h);
            };


            scope.onResizeFunctioncontainer();

            angular.element($window).bind('resize', function () {
                scope.onResizeFunctioncontainer();
                scope.$apply();
            });

        }
    }
});

function matcher(regexp, SearchValue, SearchRecord) {
    return function (obj) {
        var found = false;
        Object.keys(obj).forEach(function (key) {
            if (!found) {
                if (SearchRecord.indexOf(key) !== -1) {
                    var dd = SearchRecord;
                    var objectValue = obj[key];
                    objectValue = objectValue.toLowerCase();
                    SearchValue = SearchValue.toLowerCase();
                    var n = objectValue.search(SearchValue);
                    if ((typeof obj[key] == 'string') && n !== -1) {
                        found = true;
                    }
                    //if ((typeof obj[key] == 'string') && regexp.exec(obj[key])) {
                    //    found = true;
                    //}
                }
            }
        });
        return found;
    };
}


function getRequestDateTime(addDay, isTimeRequired) {


    var months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May',
        'Jun', 'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec'
    ];

    function monthNumToName(monthnum) {
        return months[monthnum - 1] || '';
    }


    var time = '';
    var today = new Date();
    var date = new Date();
    date.setDate(today.getDate() + addDay);
    var day = date.getDate(); // yields 
    var month = date.getMonth() + 1; // yields month
    var year = date.getFullYear(); // yields year
    var hour = date.getHours(); // yields hours 
    var minute = date.getMinutes(); // yields minutes
    var second = date.getSeconds(); // yields seconds


    if (month < 10) {
        month = "0" + month;
    }

    if (day < 10) {
        day = "0" + day;
    }

    if (hour < 10) {
        hour = "0" + hour;
    }


    if (minute < 10) {
        minute = "0" + minute;
    }

    if (second < 10) {
        second = "0" + second;
    }

    // After this construct a string with the above results as below
    if (isTimeRequired === true) {
        time = day + "-" + monthNumToName(month) + "-" + year + " " + hour + ':' + minute + ':' + second;
    } else {
        time = day + "-" + monthNumToName(month) + "-" + year;
    }

    return time;
}