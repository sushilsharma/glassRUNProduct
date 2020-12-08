angular.module("glassRUNProduct").controller('FormBuilderController', function ($scope, $rootScope, $ionicModal, $timeout, $filter, $location, $sessionStorage, $state, pluginsService, focus, GrRequestService) {
    debugger;

    $scope.localObject = {

        TemplateName: ""

    }

    $scope.TemplateFormsList = [];
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
    $scope.AddForm = function () {
        $scope.Action = "Add";
        $scope.AddTab = true;
        $scope.ViewTab = false;

    };

    $scope.ViewForm = function () {
        $scope.TemplateFormId = 0;
        $scope.localObject.TemplateName = "";
        $scope.Action = "View";
        $scope.AddTab = false;
        $scope.ViewTab = true;
        $scope.enabelEdit = false;
    };

    $scope.ViewForm();




    //var displayField = '{"components":[{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"Field 1","key":"field1","placeholder":"","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","$$hashKey":"object:469","labelPosition":"top","inputFormat":"plain","tags":[],"properties":{}},{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"Field 2","key":"field2","placeholder":"","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","$$hashKey":"object:958","labelPosition":"top","inputFormat":"plain","tags":[],"properties":{}},{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"Field 3","key":"field3","placeholder":"","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","$$hashKey":"object:1499","labelPosition":"top","inputFormat":"plain","tags":[],"properties":{}},{"autofocus":false,"input":true,"tableView":true,"inputType":"number","label":"Field 4","key":"field4","placeholder":"","prefix":"","suffix":"","defaultValue":"","protected":false,"persistent":true,"hidden":false,"clearOnHide":true,"validate":{"required":false,"min":"","max":"","step":"any","integer":"","multiple":"","custom":""},"type":"number","$$hashKey":"object:2100","labelPosition":"top","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}},{"autofocus":false,"input":true,"tableView":true,"label":"Field 5","key":"field5","placeholder":"","prefix":"","suffix":"","rows":5,"multiple":false,"defaultValue":"","protected":false,"persistent":true,"hidden":false,"wysiwyg":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":""},"type":"textarea","$$hashKey":"object:2749","labelPosition":"top","inputFormat":"plain","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{}},{"autofocus":false,"input":true,"tableView":true,"inputType":"text","inputMask":"","label":"Field 7","key":"field7","placeholder":"","prefix":"","suffix":"","multiple":false,"defaultValue":"","protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"spellcheck":true,"validate":{"required":false,"minLength":"","maxLength":"","pattern":"","custom":"","customPrivate":false},"conditional":{"show":"","when":null,"eq":""},"type":"textfield","$$hashKey":"object:3476","labelPosition":"top","inputFormat":"plain","tags":[],"properties":{}}],"display":"form","page":0}';

    LoadActiveVariables($sessionStorage, $state, $rootScope);

    $rootScope.displays = [{
        name: 'form',
        title: 'Form'
    }, {
        name: 'wizard',
        title: 'Wizard'
    }];

    $rootScope.form = {
        components: [],
        display: 'form'
    };

    //displayField = JSON.parse(displayField);
    //$rootScope.form = displayField;

    $rootScope.renderForm = true;
    $rootScope.$on('formUpdate', function (event, form) {
        debugger;
        angular.merge($rootScope.form, form);

        var x = JSON.stringify($rootScope.form);


        $rootScope.renderForm = false;
        setTimeout(function () {
            debugger;
            $rootScope.renderForm = true;
        }, 10);
    });

    var originalComps = _.cloneDeep($rootScope.form.components);
    $rootScope.jsonCollapsed = true;
    $timeout(function () {
        debugger;
        $rootScope.jsonCollapsed = false;
    }, 200);
    var currentDisplay = 'form';

    //$rootScope.$watch('form.display', function (display) {
    //    if (display && (display !== currentDisplay)) {
    //        currentDisplay = display;
    //        if (display === 'form') {
    //            $rootScope.form.components = originalComps;
    //        } else {
    //            $rootScope.form.components = [{
    //                type: 'panel',
    //                input: false,
    //                title: 'Page 1',
    //                theme: 'default',
    //                components: originalComps
    //            }];
    //        }
    //    }
    //});



    $scope.SaveFormBuilder = function () {
        debugger;
        var formView = $rootScope.form.components;
        var formhtml = document.getElementById("GenerateForm").innerHTML;
        var formJson = $rootScope.form;

        var servicesAction = 'InsertFormBuilder';

        if ($scope.TemplateFormId === 0) {
            servicesAction = 'InsertFormBuilder';
        } else {
            servicesAction = 'UpdateFormBuilder';
        }

        var form = {
            ServicesAction: servicesAction,
            TemplateName: $scope.localObject.TemplateName,
            TemplateBody: formhtml,
            TemplateJson: JSON.stringify(formJson),
            TemplateFormId: $scope.TemplateFormId,
            IsAppTemplate: "1",
            Version: "",
            CreatedBy: 1
        };


        var consolidateApiParamater =
                 {
                     Json: form
                 };

        GrRequestService.ProcessRequest(consolidateApiParamater).then(function (response) {
            debugger;


            $scope.localObject.TemplateName = "";
            $rootScope.form.components = [];
            $scope.TemplateFormId = 0;
            $scope.localObject.TemplateName = "";
            $scope.RefreshDataGrid();
            $scope.ViewForm();
            $rootScope.ValidationErrorAlert(String.format($rootScope.resData.res_FormBulder_SaveRecord), 'error', 8000);
        });

    }

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
                        ServicesAction: 'GetAllFormTemplateListPaging',
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
                            if (resoponsedata.Json.TemplateFormsList.length !== undefined) {
                                if (resoponsedata.Json.TemplateFormsList.length > 0) {
                                    totalcount = resoponsedata.Json.TemplateFormsList[0].TotalCount;
                                }
                            } else {
                                totalcount = resoponsedata.Json.TemplateFormsList.TotalCount;
                            }

                            ListData = resoponsedata.Json.TemplateFormsList;
                        } else {
                            ListData = [];
                            totalcount = 0;
                        }
                    }

                    var data = ListData;
                    $scope.TemplateFormsList = $scope.TemplateFormsList.concat(data);
                    $rootScope.Throbber.Visible = false;
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
            keyExpr: "TemplateFormId",
            selection: {
                mode: "single"
            },
            onCellClick: function (e) {

                if (e.rowType !== "filter" && e.rowType !== "header" && e.rowType !== "detail") {
                    var data = e.data;

                    if (e.column.cellTemplate === "Edit") {
                        $scope.Edit(data.TemplateFormId, data.TemplateName, data.TemplateJson);
                    }
                    else if (e.column.cellTemplate === "Delete") {
                        $scope.Delete_SelectedSetting(data.TemplateFormId);
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
                    caption: "Form Name",
                    dataField: "TemplateName",
                    alignment: "left",

                },
                {
                    caption: "TemplateJson",
                    dataField: "TemplateJson",
                    alignment: "left",
                    width: 350
                },
                {
                    caption: "TemplateBody",
                    dataField: "TemplateBody",
                    alignment: "left",
                    width: 400
                },
                {
                    caption: "Edit",
                    dataField: "TemplateFormId",
                    cssClass: "ClickkableCell EnquiryNumberUI",
                    cellTemplate: "Edit",
                    alignment: "left",
                    allowFiltering: false,
                    allowSorting: false,
                    width: 100
                }

            ]
        };
    };
    $scope.LoadSettingMasterGrid();

    $scope.RefreshDataGrid = function () {

        $scope.SettingMasterList = [];
        var dataGrid = $("#SettingMasterGrid").dxDataGrid("instance");
        dataGrid.refresh();
    };

    $scope.TemplateFormId = 0;
    $scope.Edit = function (templateFormId, templateName, templateJson) {
        debugger;
        $scope.TemplateFormId = templateFormId;
        $scope.TemplateName = templateName;
        $scope.TemplateJson = templateJson;
        $scope.localObject.TemplateName = templateName;
        templateJson = JSON.parse(templateJson);
        $rootScope.form = templateJson;
        $rootScope.renderForm = true;
        $scope.AddForm();
    }

});