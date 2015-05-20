/**
 * angular-fancy-modal - the definitive modal/popup/dialog solution for AngularJS.
 * @author Alessandro Arnodo
 * @url http://alessandro.arnodo.net
 * @version v0.1.4
 * @link https://github.com/vesparny/angular-fancy-modal
 * @license MIT
 */
(function(angular, document, window, undefined) {
  'use strict';
  angular.module('vesparny.fancyModal', []).
  provider('$fancyModal', function() {
    var defaults = this.defaults = {
      templateUrl: '',
      template: '<div></div>',
      resolve: {},
      controller: '',
      scope: '',
      showCloseButton: true,
      closeOnEscape: true,
      closeOnOverlayClick: true,
      overlay: true,
      themeClass: '',
      openingClass: 'fancymodal-content-opening',
      closingClass: 'fancymodal-content-closing',
      openingOverlayClass: 'fancymodal-overlay-opening',
      closingOverlayClass: 'fancymodal-overlay-closing',
      bodyClass: 'fancymodal-open'
    };

    /**
     * [setDefaults overriding defaults]
     * @param {[Object]} options [new defaults]
     */
    this.setDefaults = function(options) {
      angular.extend(this.defaults, options);
    };

    this.$get = ['$controller', '$timeout', '$rootScope', '$injector', '$compile', '$http', '$templateCache', '$window', '$document', '$q',
      function($controller, $timeout, $rootScope, $injector, $compile, $http, $templateCache, $window, $document, $q) {
        var modalCounter = 0;
        var incrementalId = 0;
        var isClosing = false;
        var style = (document.body || document.documentElement).style;
        var animationEndSupport = angular.isDefined(style.animation) || angular.isDefined(style.WebkitAnimation) || angular.isDefined(style.MozAnimation) || angular.isDefined(style.MsAnimation) || angular.isDefined(style.OAnimation);
        var animationEndEvent = 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend';
        var $body = angular.element(document).find('body');
        var $html = angular.element(document).find('html');

        // private methds

        function onKeydown(event) {
          if (event.keyCode === 27) {
            close();
          }
        }

        //http://davidwalsh.name/detect-scrollbar-width
        function getScrollBarWidth() {
          var scrollDiv = document.createElement('div');
          scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
          document.body.appendChild(scrollDiv);
          var size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
          document.body.removeChild(scrollDiv);
          return size;
        }

        function hasScrollbars() {
          return $body[0].scrollHeight > $window.innerHeight;
        }

        function getTemplatePromise(options) {
          var deferred = $q.defer();
          if (options.templateUrl) {
            $http.get(options.templateUrl, {
              cache: $templateCache
            }).then(function(result) {
              deferred.resolve(result.data);
            });
          } else {
            deferred.resolve(options.template);
          }
          return deferred.promise;
        }

        function getResolvePromises(resolves) {
          var promisesArr = [];
          angular.forEach(resolves, function(value) {
            promisesArr.push($q.when($injector.invoke(value)));
          });
          return promisesArr;
        }

        function cleanUp($modal) {
          var elementId = $modal.attr('id');
          $modal.scope().$destroy();
          $modal.remove();
          isClosing = false;
          if (modalCounter === 0) {
            $body.removeClass('fancymodal-open');
            $html.css('margin-right', '');
          }
          $rootScope.$emit('$fancyModal.closed', elementId);
        }

        function closeModal(modal) {
          var $modal = angular.element(modal);
          var options = $modal.data('options');
          isClosing = true;
          $modal.unbind('click');

          if (modalCounter === 1) {
            $document.unbind('keydown');
          }

          modalCounter -= 1;

          if (animationEndSupport) {
            var content = angular.element(modal.children[0]);
            if (options.overlay) {
              var overlay = angular.element(modal.children[0]);
              overlay.addClass(options.closingOverlayClass);
              content = angular.element(modal.children[1]);
            }
            content.unbind(animationEndEvent).bind(animationEndEvent, function() {
              content.remove();
              cleanUp($modal);
            }).removeClass(options.openingClass).addClass(options.closingClass);
          } else {
            cleanUp($modal);
          }
        }

        function closeAll() {
          var modals = document.querySelectorAll('.fancymodal');
          angular.forEach(modals, function(modal) {
            closeModal(modal);
          });
        }

        // public API

        /**
         * open a modal
         * @param  {[object]} opts [modal params]
         * @return Promise
         */
        function open(opts) {

            function closeByAction(event) {
              var overlay = angular.element(event.target).hasClass('fancymodal-overlay');
              var closeBtn = angular.element(event.target).hasClass('fancymodal-close');

              if ((overlay && options.closeOnOverlayClick) || closeBtn) {
                close(modal.attr('id'));
              }
            }

            function execOpen($modal) {
              var defer = $q.defer();
              var htmlTemplate;
              getTemplatePromise(options).then(function(template) {
                htmlTemplate = template;
                return $q.all(getResolvePromises(options.resolve));
              }).then(function(locals) {
                if (!isClosing) {
                  var data = {};
                  var resolveCounter = 0;
                  var ctrl;
                  angular.forEach(options.resolve, function(value, key) {
                    data[key] = locals[resolveCounter];
                    resolveCounter += 1;
                  });
                  scope.$modal = $modal;
                  data.$scope = scope;
                  if (options.controller) {
                    ctrl = $controller(options.controller, data);
                  }
                  contentData.append($compile(htmlTemplate)(scope));
                  $rootScope.$emit('$fancyModal.opened', modal);
                  defer.resolve();
                } else {
                  defer.reject();
                }
              });
              return defer.promise;
            }

            var options = angular.copy(defaults);
            opts = opts || {};
            angular.extend(options, opts);
            modalCounter += 1;
            incrementalId += 1;

            $body.addClass(options.bodyClass);

            if (hasScrollbars()) {
              $html.css('margin-right', getScrollBarWidth() + 'px');
            }

            var scope = (options.scope || $rootScope).$new();
            var modal = angular.element('<div id="fancymodal-' + incrementalId + '" class="fancymodal"></div>').addClass(options.themeClass);
            modal.data('options', options);
            var content = angular.element('<div>').addClass('fancymodal-content');

            if (options.showCloseButton) {
              var closeButton = angular.element('<div>').addClass('fancymodal-close');
              content.append(closeButton);
            }

            if (options.closeOnEscape) {
              $document.bind('keydown', onKeydown);
            }

            var contentData = angular.element('<div>').addClass('fancymodal-data');

            if (options.overlay) {
              var overlay = angular.element('<div>').addClass('fancymodal-overlay').addClass(options.openingOverlayClass);
              modal.append(overlay);
            }

            content.append(contentData);
            content.addClass(options.openingClass);

            modal.bind('click', closeByAction);
            modal.append(content);
            $body.append($compile(modal)(scope));
            var id = 'fancymodal-'+incrementalId;
            var $modal = {
              id: id,
              close: function() {
                return close(id);
              }
            };
            // open the dialog
            var openPromise = execOpen($modal);

            return angular.extend({
              opened: openPromise
            }, $modal);
          }
          /**
           * [close close a modal]
           * @param  {[integer]} id [the id of the modal to be closed]
           */
        function close(id) {
          var modal = document.getElementById(id);
          if (modal) {
            closeModal(modal);
          } else {
            closeAll();
          }
        }

        return {
          open: function(options) {
            return open(options);
          },
          close: function(id) {
            return close(id);
          },
          getDefaults: function() {
            return angular.copy(defaults);
          }
        };
      }
    ];
  }).directive('fancyModal', ['$fancyModal', function($fancyModal) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var modal;
        var options;
        // Trigger
        element.on(attrs.trigger || 'click', function() {
          options = $fancyModal.getDefaults();
          angular.forEach(Object.keys(options), function(key) {
            if (angular.isDefined(attrs[key])) {
              //TODO fix this, it sucks bad
              if (attrs[key] === 'true') {
                options[key] = true;
              } else if (attrs[key] === 'false') {
                options[key] = false;
              } else {
                options[key] = attrs[key];
              }
            }
          });
          modal = $fancyModal.open(options);
        });

        // Garbage collection
        scope.$on('$destroy', function() {
          if (modal) {
            modal.opened.then(function() {
              modal.close();
              modal = null;
            });
          } else {
            modal = null;
          }
          options = null;
        });
      }
    };
  }]);
})(angular, document, window);
