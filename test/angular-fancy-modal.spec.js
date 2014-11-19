/*jshint undef:false */
(function() {
  'use strict';
  describe('angular-fancy-modal', function() {
    var $fancyModal;
    var $rootScope;
    var $timeout;
    var modal;

    beforeEach(module('vesparny.fancyModal'));

    beforeEach(inject(function(_$rootScope_, _$fancyModal_, $templateCache, _$timeout_) {
      $templateCache.put('test.html', [200, '<div>{{hello}}</div>', {}]);
      $fancyModal = _$fancyModal_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      $rootScope.hello = 'hello';
    }));

    afterEach(function() {
      modal.close();
      angular.element(document.body).empty();
    });

    it('should return specific properties', function() {
      modal = $fancyModal.open();
      expect(typeof modal.close).toEqual('function');
      expect(modal.id).toBeDefined();
      expect(modal.opened).toBeDefined();
    });

    describe('#open', function() {
      it('should create the modal with the right scope value', function() {
        modal = $fancyModal.open({
          templateUrl: 'test.html'
        });
        $rootScope.$digest();
        expect(angular.element(document.body).find('#' + modal.id + ' .fancymodal-data').text()).toBe('hello');
      });

      it('should create the modal with the right scope value within the inline controller', function() {
        modal = $fancyModal.open({
          template: '<div>{{hello}}</div>'
        });
        $rootScope.$digest();
        expect(angular.element(document.body).find('#' + modal.id + ' .fancymodal-data').text()).toBe('hello');
      });
    });

    describe('#close', function() {
      it('should remove a modal when close', function() {
        modal = $fancyModal.open();
        modal.close();
        //finish DOM rendering
        $timeout(function() {
          expect(angular.element(document.body).find('#fancymodal-' + modal.id).size()).toBe(0);
        }, 0);
      });

      it('should destroy the scope when closed', function() {
        var destroySpy = jasmine.createSpy('onDestroy');
        modal = $fancyModal.open({
          controller: function($scope) {
            $scope.$on('$destroy', destroySpy);
          }
        });
        modal.close();
        //finish DOM rendering
        $timeout(function() {
          expect(destroySpy).toHaveBeenCalled();
        }, 0);
      });
    });

  });
})();
