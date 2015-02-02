(function () {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('angularBingMaps.config', [])
      .value('angularBingMaps.config', {
          debug: true
      });

  // Modules
  angular.module('angularBingMaps.directives', []);
  angular.module('angularBingMaps.filters', []);
  angular.module('angularBingMaps.services', []);
  angular.module('angularBingMaps',
      [
          'angularBingMaps.config',
          'angularBingMaps.directives',
          'angularBingMaps.filters',
          'angularBingMaps.services'
      ]);

})();

/*global angular, Microsoft, DrawingTools, console*/

function drawingToolsDirective() {
    'use strict';

    function link(scope, element, attrs) {
        if (typeof DrawingTools === 'undefined') {
            console.log('You did not include DrawingToolsModule.js. Please include this script and try again');
            return;
        }
        //TODO: Fix this....
        var parentScope = scope.$parent.$parent;

        scope.drawingManager = new DrawingTools.DrawingManager(parentScope.bing.map, {
            events: {
                drawingEnded: function (shapes) {
                    scope.onShapeChange({shapes: shapes});
                    scope.$apply();
                }
            }
        });
        scope.$watch('drawThisShape', function (shape) {
            if (shape === 'none') {
                scope.drawingManager.setDrawingMode(null);
            } else {
                scope.drawingManager.setDrawingMode(shape);
            }
        });
    }

    return {
        link: link,
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            onShapeChange: '&',
            drawThisShape: '='
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('drawingTools', drawingToolsDirective);
/*global angular, Microsoft*/

function bingMapDirective() {
    'use strict';
    
    function link(scope, element, attrs) {
        scope.$watch('center', function (center) {
            scope.bing.map.setView({animate: true, center: center});
        });

        scope.$watch('zoom', function (zoom) {
            scope.bing.map.setView({animate: true, zoom: zoom});
        });

        scope.$watch('mapType', function (mapTypeId) {
            scope.bing.map.setView({animate: true, mapTypeId: mapTypeId});
        });
    }
    
    return {
        link: link,
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            credentials: '=',
            center: '=',
            zoom: '=',
            mapType: '='
        },
        controller: function ($scope, $element) {
            $scope.bing = {};
            $scope.bing.map = new Microsoft.Maps.Map($element[0], {credentials: $scope.credentials});
        }
    };

}

angular.module('angularBingMaps.directives').directive('bingMap', bingMapDirective);
