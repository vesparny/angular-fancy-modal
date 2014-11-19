(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

  function config($fancyModalProvider) {
    $fancyModalProvider.setDefaults({
      template: '<div>I\'m a basic template</div>'
    });
  }

  function SecondCtrl($scope, $fancyModal) {
    $scope.dialogModel = {
      message: 'message from passed scope'
    };
    $scope.openSecond = function() {
      $fancyModal.open({
        template: '<h3><a href="" ng-click="closeSecond()">Close all by click here!</a></h3>',
        plain: true,
        closeByEscape: false,
        controller: 'SecondModalCtrl'
      });
    };
  }

  function ThirdCtrl($scope, $fancyModal) {
    $scope.closeSecond = function() {
      $fancyModal.close();
    };
  }

  function ResolveCtrl($scope, items) {
    $scope.items = items;
    $scope.close = $scope.$modal.close;
  }

  function CtrlAs($scope) {
    var crtl = this;
    crtl.close = $scope.$modal.close;
  }

  function AppCtrl($rootScope, $scope, $http, $q, $timeout, $fancyModal) {
    $scope.data = {};
    $scope.data.defaultMessage = 'hello fancy modal!';

    $rootScope.$on('$fancyModal.opened', function (e, $modal) {
      console.log('$fancyModal opened: ' + $modal.attr('id'));
    });

    $rootScope.$on('$fancyModal.closed', function (e, id) {
      console.log('$fancyModal closed: ' + id);
    });

    var app = this;

    app.openWithresolve = function() {
      $fancyModal.open({
        templateUrl: 'resolve-template.html',
        controller: 'ResolveCtrl',
        resolve: {
          items: function() {
            var deferred = $q.defer();
            $timeout(function() {
              var data = ['async', 'data', 'loaded'];
              deferred.resolve(data);
            }, 1500);
            return deferred.promise;
          }
        }
      });
    };

    app.openDefault = function() {
      $fancyModal.open();
    };

    app.openThemed = function() {
      $fancyModal.open({
        themeClass: 'fancymodal-theme-classic'
      });
    };


    app.openWithAnimateCss = function() {
      $fancyModal.open({
        template: '<div>{{data.defaultMessage}}</div>',
        scope: $scope,
        openingClass: 'animated rollIn',
        closingClass: 'animated rollOut',
        openingOverlayClass: 'animated fadeIn',
        closingOverlayClass: 'animated fadeOut',
      });
    };

    app.openWithAnimateCss2 = function() {
      $fancyModal.open({
        template: '<div>I\'m a basic template, opened and closed with animate.css effects</div>',
        openingClass: 'animated zoomIn',
        closingClass: 'animated hinge',
        openingOverlayClass: 'animated fadeIn',
        closingOverlayClass: 'animated fadeOut',
      });
    };


    app.openWithoutOverlay = function() {
      $fancyModal.open({
        overlay: false
      });
    };

    app.avoidEscape = function() {
      $fancyModal.open({
        template: '<div>You cannot close my pressing escape or clicking on overlay.</div>',
        closeOnEscape: false,
        closeOnOverlayClick: false
      });
    };

    app.openInlineController = function() {
      $fancyModal.open({
        template: '<div>{{message}}</div>',
        controller: ['$scope', function($scope) {
          $scope.message = 'Hello, this string is declared in the controller.';
        }]
      });
    };

    app.openWithLoadingMessage = function() {
      $fancyModal.open({
        templateUrl: 'loading.html',
        controller: ['$scope', function($scope) {
          $timeout(function() {
            $scope.data = 'data has been loaded!';
          }, 2000);
        }]
      });
    };

    app.openControllerAsSyntax = function() {
      $fancyModal.open({
        templateUrl: 'controller-as.html',
        controller: 'CtrlAs as ctrl',
        scope: $scope
      });
    };

    app.openTimed = function() {
      var modal = $fancyModal.open({
        template: '<p>I\'ll close in 2 seconds!</p>',
        closeOnEscape: false,
        closeOnOverlayClick: false
      });
      setTimeout(function() {
        modal.close();
      }, 2000);
    };

    app.openAndClosePromise = function() {
      var modal = $fancyModal.open({
        templateUrl: 'resolve-template.html',
        controller: 'ResolveCtrl',
        resolve: {
          items: function() {
            var deferred = $q.defer();
            $timeout(function() {
              var data = ['async', 'data', 'loaded'];
              deferred.resolve(data);
            }, 1500);
            return deferred.promise;
          }
        }
      });
      console.log(modal);
      modal.opened.then(function() {
        modal.close();
      });
    };

  }



  angular.module('app', [
      'vesparny.fancyModal'
    ])
    .config(config)
    .controller('AppCtrl', AppCtrl)
    .controller('ResolveCtrl', ResolveCtrl)
    .controller('CtrlAs', CtrlAs)
    .controller('SecondCtrl', SecondCtrl)
    .controller('ThirdCtrl', ThirdCtrl);

})();
