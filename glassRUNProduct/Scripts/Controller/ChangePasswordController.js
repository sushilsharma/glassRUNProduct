angular.module("glassRUNProduct").controller('ChangePasswordController', function ($scope, $q, $state, $timeout, $ionicModal, $location, $rootScope, $sessionStorage, adminService, GrRequestService) {

    LoadActiveVariables($sessionStorage, $state, $rootScope);

	debugger;

	


    $scope.changepass = {
        confirmPassword: "",
        newPassword: "",
        currentPassword: ""
    }


    $ionicModal.fromTemplateUrl('ChangePassword.html', {
        scope: $scope,
        animation: 'fade-in',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        
        $scope.ChangePassControl = modal;
    });
    $scope.CloseChangePasswordControl = function () {
        focus('RemoveEnterEvent');
        $scope.ChangePassControl.hide();
    };
    $scope.OpenChangePasswordControl = function () {
        focus('AddEnterEvent');
        var dd = $scope.ChangePassControl;
        if (!dd._isShown) {
            $scope.ChangePassControl.show();
        }
    };

	//$rootScope.Throbber.Visible = false;
    var jsonobject = {};

    $scope.changePassword = function () {
        debugger;
        //var ff = $scope.PasswordStrength;

        //if ($scope.PasswordStrength === 'weak') {
        //    $rootScope.toggleModelAlert('You have entered weak password.', 'error');
        //    return false;
        //}
       
        if ($scope.changepass.confirmPassword !== undefined || $scope.changepass.newPassword !== undefined) {


            //if ($scope.changepass.newPassword.length < 8) {
            //    
            //    $rootScope.ValidationErrorAlert('Password length should be between 8 and 20', 'error', 3000);
            //    return false;
            //}

            if ($scope.changepass.confirmPassword === $scope.changepass.newPassword) {
                jsonobject.currentPassword = $scope.changepass.currentPassword;
                jsonobject.userPassword = $scope.changepass.confirmPassword;
                jsonobject.userIpAddress = "";                
                jsonobject.apiAccessKey = 'AIzaSyD9I7yVwNbw86m1F1';
				jsonobject.userId = $rootScope.UserId;
                jsonobject.ChangePasswordonFirstLoginRequired = true;
                
                adminService.ResetPasswordBySelf(jsonobject).then(function (response) {
                    
                    if (response.data === 1) {
                        //alert('Password changed');
                      
                        if ($rootScope.ChangePasswordonFirstLoginRequired == false) {
                            //$scope.OpenChangePasswordControl();
                            $rootScope.InvisibleMenuForFirstLoginScreen = false;
                            $rootScope.IsPasswordExpire = false;
                            //$scope.ChangePassConfirmationAlert= 'You have successfully changed your password.if you want to redirect on main screen click yes.';
$rootScope.ValidationErrorAlert('You have successfully changed your password.', '', 3000);
                            $scope.reset();
                        }
                        else {
                           $rootScope.IsPasswordExpire = false;
							$scope.PasswordPolicyValidation = false;
							//Changes by nimesh on 29- 08 - 2019
                            //$rootScope.ValidationErrorAlert('Password changed successfully. Please logout and login again.', '', 3000);
							$rootScope.OpenChangePasswordSuccessfullyConfirmationPopup();
                            $scope.reset();
                        }
                        //if (v.RoleMasterId === 1 || $rootScope.RoleMasterId === 4) {
                        //    $location.path("/admindashboard");
                        //} else {
                        //    $location.path("/campusonline");
                        //}
                        //$location.path("/loginContent");
                    }

                    if (response.data === 2) {
                        //alert('Current Password is wrong');
                       
                        $rootScope.ValidationErrorAlert('Current Password is wrong.', 'error', 3000);
                        //$location.path("/loginContent");
                    }

					//Changes by nimesh on 29- 08 - 2019
					if ( response.data === 3 ) {
						$scope.PasswordPolicyValidation = true;
						$rootScope.ValidationErrorAlert( 'The password length is minimum 8 characters with 1 Upper Case character, 1 number, 1 special character  is required', 'error', 3000 );
						//$rootScope.ValidationErrorAlert( String.format( $rootScope.resData.res_ChangePassword_PasswordPolicyValidation ), 'error', 3000 );
						    return false;
					}
                });
            } else {
                //alert('Please confirm your password.');                
                $rootScope.ValidationErrorAlert('Please confirm your password.', 'error', 3000);
            }
        }
        else {
            //alert('Please enter password.');
            
            $rootScope.ValidationErrorAlert('Please enter password.', 'error', 3000);

        }
    };


    $scope.reset = function () {
        $scope.changepass.confirmPassword = "";
        $scope.changepass.newPassword = "";
        $scope.changepass.currentPassword = "";

    };

    $scope.RedirectOnScreen = function () {
        if ($rootScope.RoleName === "Customer") {
            $state.go('CreateInquiry');
        }
        else if ($rootScope.RoleName === "CustomerService") {
            $state.go('OMInquiry');
        }
        else if ($rootScope.RoleName === "WarehouseManager") {
            $state.go('WarehouseInquiry');
        }
        else if ($rootScope.RoleName === "TransportManager") {
            $state.go('PlateNumberAllocation');
        }
        else if ($rootScope.RoleName === "GateKeeper") {
            $state.go('GateKeeperPage');
        }
        else if ($rootScope.RoleName === "Carrier") {
            $state.go('Carrier');
        }
        $scope.CloseChangePasswordControl();
    }



// 42 Delivery Location Change Confirmation Popup if truck is alredy fill.
	$ionicModal.fromTemplateUrl( 'PasswordPolicyModalPopup.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	} ).then( function ( modal ) {
		debugger;
		$rootScope.PasswordPolicyChangeControl = modal;
	} );
	$rootScope.ClosePasswordPolicyChangeConfirmationPopup = function () {
		$rootScope.PasswordPolicyChangeControl.hide();
	};
	$rootScope.OpenDeliveryLocationChangeConfirmationPopup = function () {
		$rootScope.PasswordPolicyChangeControl.show();
	};


	//Changes by nimesh on 29- 08 - 2019
	$ionicModal.fromTemplateUrl( 'ChangePasswordSuccessfully.html', {
		scope: $scope,
		animation: 'fade-in',
		backdropClickToClose: false,
		hardwareBackButtonClose: false
	} ).then( function ( modal ) {
		debugger;
		$rootScope.ChangePasswordSuccessfullyControl = modal;
	} );
	$rootScope.CloseChangePasswordSuccessfullyConfirmationPopup = function () {
		$rootScope.ChangePasswordSuccessfullyControl.hide();
	};
	$rootScope.OpenChangePasswordSuccessfullyConfirmationPopup = function () {
		$rootScope.ChangePasswordSuccessfullyControl.show();
	};

	//Changes by nimesh on 29- 08 - 2019
	$scope.RedirectToLoginPage = function () {
		$rootScope.CloseChangePasswordSuccessfullyConfirmationPopup();
		$state.go( 'loginContent' );
	}


});