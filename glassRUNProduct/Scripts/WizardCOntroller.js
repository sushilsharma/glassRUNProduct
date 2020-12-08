

angular.module('glassRUNProduct')
  .controller('pluginsCtrl', ['$scope', '$ionicModal', 'pluginsService', function ($scope, $ionicModal, pluginsService) {



      setTimeout(function () {
          
          inputSelect();
          handleiCheck();
          timepicker();
          datepicker();
          bDatepicker();
          multiDatesPicker();
      }, 200);



      if ($('#dropzoneFrm .dz-default').length == 0) {
          $("#dropzoneFrm").dropzone({});
      }

      $ionicModal.fromTemplateUrl('templates/modal.html', {
          scope: $scope,
          animation: 'fade-in-scale',
          backdropClickToClose: false,
          hardwareBackButtonClose: false
      }).then(function (modal) {
          
          $scope.modal = modal;
      });


      $('#inline_datetimepicker').datetimepicker({
          altField: "#inline_datetimepicker_alt",
          altFieldTimeOnly: false,
          isRTL: $('body').hasClass('rtl') ? true : false
      });

      pluginsService.init();


      $scope.findcheckboxvalue = function () {
          
          var x = $scope.checkbox1;
      }


      $('.icheck-colors li').click(function () {
          var self = $(this);
          if (!self.hasClass('active')) {
              self.siblings().removeClass('active');

              var skin = self.closest('.skin'),
                color = self.attr('class') ? '-' + self.attr('class') : '',
                colorTmp = skin.data('color') ? '-' + skin.data('color') : '-blue',
                colorTmp = (colorTmp === '-black' ? '' : colorTmp);

              var checkbox_default = 'icheckbox_minimal',
              radio_default = 'iradio_minimal',
              checkbox = 'icheckbox_minimal' + colorTmp,
              radio = 'iradio_minimal' + colorTmp;

              if (skin.hasClass('skin-square')) {
                  checkbox_default = 'icheckbox_square';
                  radio_default = 'iradio_square';
                  checkbox = 'icheckbox_square' + colorTmp;
                  radio = 'iradio_square' + colorTmp;
              };

              if (skin.hasClass('skin-flat')) {
                  checkbox_default = 'icheckbox_flat';
                  radio_default = 'iradio_flat';
                  checkbox = 'icheckbox_flat' + colorTmp;
                  radio = 'iradio_flat' + colorTmp;
              };

              if (skin.hasClass('skin-line')) {
                  checkbox_default = 'icheckbox_line';
                  radio_default = 'iradio_line';
                  checkbox = 'icheckbox_line' + colorTmp;
                  radio = 'iradio_line' + colorTmp;
              };

              skin.find(':checkbox, :radio').each(function () {
                  var element = $(this).hasClass('state') ? $(this) : $(this).parent();
                  var element_class = element.attr('class').replace(checkbox, checkbox_default + color).replace(radio, radio_default + color);
                  element.attr('class', element_class);
              });

              skin.data('color', self.attr('class') ? self.attr('class') : 'black');
              self.addClass('active');
          };
      });

  }]);


angular.module('glassRUNProduct')
  .controller('WizardCtrl', ['$scope', '$ionicModal', 'pluginsService', function ($scope, $ionicModal, pluginsService) {

      setTimeout(function () {
          pluginsService.init();

          $('.form-wizard-style a').click(function (e) {
              $('.form-wizard-style a').removeClass('current');
              $(this).addClass('current');
              var style = $(this).attr('id');
              e.preventDefault();
              $('.wizard-div').removeClass('current');
              $('.wizard-' + style).addClass('current');
          });

          $('.form-wizard-nav a').click(function (e) {
              $('.form-wizard-nav a').removeClass('current');
              $(this).addClass('current');
              var style = $(this).attr('id');
              e.preventDefault();
              $('.wizard-div').removeClass('current');
              $('.wizard-' + style).addClass('current');
          });

          $('.page-wizard .nav-tabs > li > a').on('click', function () {
              $('.page-wizard .tab-pane.active a:first').not('.sf-btn').trigger('click');
              /* Fix issue only with tabs, demo purpose */
              setTimeout(function () {
                  $(window).resize();
                  $(window).trigger('resize');
              }, 0);
          });

      }, 2);

  }]);



angular.module("glassRUNProduct").service("headerService", function ($http, $q) {


    this.getMenu = function () {
        debugger
        var request = $http(
        {
            method: 'POST',
            url: baseUrl + '/api/AllSession/GetAllMenu',

        }).
        success(function (data, status, headers, config) {
            return data.MenuMasterList;
        });

        return request;

    };

    //this.getAntiForgeryToken = function () {
    //    
    //    var deferred = $q.defer();

    //    $http.get(baseUrl + '/api/LoginService/GetAntiForgeryToken').success(function (data) {
    //        
    //        deferred.resolve(data);
    //    });

    //    return deferred.promise;

    //    //debugger
    //    //var request = $http(
    //    //{
    //    //    method: 'POST',
    //    //    url: baseUrl + '/api/LoginService/GetAntiForgeryToken',

    //    //}).
    //    //success(function (data, status, headers, config) {
    //    //    
    //    //    return data;
    //    //});

    //    //return request;
    //};

});