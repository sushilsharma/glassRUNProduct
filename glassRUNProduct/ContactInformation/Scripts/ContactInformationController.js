angular.module("glassRUNProduct").controller('ContactInformationController', function ($scope, $rootScope, $sessionStorage, $state, $filter, $ionicModal, $location, pluginsService, GrRequestService) {
    

   
    $scope.LoadDefaultSettingsValue = function () {


       

        var ContactType = $rootScope.AllLookUpData.filter(function (el) { return el.LookupCategoryName === 'ContactType'; });
        if (ContactType.length > 0) {

            $scope.ContactTypeList = ContactType;

        }



    }
    $scope.LoadDefaultSettingsValue();




    $scope.ContactInformationList = [];



    //#region Contact list


    $scope.InitalizeContactInformation = function () {
        
        $scope.ContactInformationObject = {
            ContactTypeId: 0,
            ContactPersonNumber: '',
            ContactPersonName: '',
            EditContactinfoGUID: ''

        }
    }

    $scope.InitalizeContactInformation();



    $scope.AddContactPersonInfo = function () {


        
        var ContactType = '';

        var ContactDetails = $scope.ContactTypeList.filter(function (m) { return m.LookUpId === $scope.ContactInformationObject.ContactTypeId })
        if (ContactDetails.length > 0) {
            ContactType = ContactDetails[0].Name
        }


        if ($scope.ContactInformationObject.ContactTypeId != '' && $scope.ContactInformationObject.ContactPersonName != '' && $scope.ContactInformationObject.ContactPersonNumber != '') {


            if ($scope.ContactInformationObject.EditContactinfoGUID !== '') {
                var Concatctinfo = $scope.ContactInformationList.filter(function (m) { return m.ContactinfoGUID === $scope.ContactInformationObject.EditContactinfoGUID; });

                Concatctinfo[0].ContactType = ContactType;
                Concatctinfo[0].ContactTypeId = $scope.ContactInformationObject.ContactTypeId;
                Concatctinfo[0].ContactPersonName = $scope.ContactInformationObject.ContactPersonName;
                Concatctinfo[0].ContactPersonNumber = $scope.ContactInformationObject.ContactPersonNumber;
                Concatctinfo[0].IsActive = true;
                Concatctinfo[0].CreatedBy = $rootScope.UserId;
            } else {


                var Contactinfo = {
                    ContactinfoGUID: generateGUID(),
                    ContactType: ContactType,
                    ContactTypeId: $scope.ContactInformationObject.ContactTypeId,
                    ContactPersonName: $scope.ContactInformationObject.ContactPersonName,
                    ContactPersonNumber: $scope.ContactInformationObject.ContactPersonNumber,
                    ObjectType: 'Login',
                    IsActive: true,
                    CreatedBy: $rootScope.UserId,
                }
                $scope.ContactInformationList.push(Contactinfo);


            }


            $scope.InitalizeContactInformation();
        }
        else {
            $rootScope.ValidationErrorAlert('all fields are mandatory', '', 3000);
        }


    }


    $scope.EditContactPersonInfo = function (id) {
        
        $scope.InitalizeContactInformation();
        var Concatctinfo = $scope.ContactInformationList.filter(function (m) { return m.ContactinfoGUID === id; });
        $scope.ContactInformationObject.EditContactinfoGUID = id;
        $scope.ContactInformationObject.ContactTypeId = Concatctinfo[0].ContactTypeId
        $scope.ContactInformationObject.ContactPersonNumber = Concatctinfo[0].ContactPersonNumber
        $scope.ContactInformationObject.ContactPersonName = Concatctinfo[0].ContactPersonName
    }


    $scope.DeleteContactInfo = function (id) {
        
        var ContactInfo = $scope.ContactInformationList.filter(function (m) { return m.ContactinfoGUID !== id; });
        $scope.ContactInformationList = ContactInfo;
    }


    //#endregion

  




});