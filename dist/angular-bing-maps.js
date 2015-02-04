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

    function link(scope, element, attrs, mapCtrl) {
        if (typeof DrawingTools === 'undefined') {
            console.log('You did not include DrawingToolsModule.js. Please include this script and try again');
            return;
        }
        var toolbarOptions = {
            events: {
                drawingEnded: function (shapes) {
                    scope.onShapeChange({shapes: shapes});
                    scope.$apply();
                }
            }
        };
        if(attrs.hasOwnProperty('withToolbar')) {
            toolbarOptions['toolbarContainer'] = element[0];
        }
        scope.drawingManager = new DrawingTools.DrawingManager(mapCtrl.map, toolbarOptions);
        
        scope.$watch('drawThisShape', function (shape) {
            if (shape === 'none') {
                scope.drawingManager.setDrawingMode(null);
            } else {
                scope.drawingManager.setDrawingMode(shape);
            }
        });
    }
    
    function ctrl($scope, $element) {
        
    }

    return {
        link: link,
        controller: ctrl,
        restrict: 'EA',
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

    return {
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            credentials: '=',
            center: '=?',
            zoom: '=?',
            mapType: '=?'
        },
        controller: function ($scope, $element) {
            // Controllers get instantiated before link function is run, so instantiate the map in the Controller
            // so that it is available to child link functions
            this.map = new Microsoft.Maps.Map($element[0], {credentials: $scope.credentials});
            $scope.map = this.map;

            $scope.$watch('center', function (center) {
                $scope.map.setView({animate: true, center: center});
            });

            $scope.$watch('zoom', function (zoom) {
                $scope.map.setView({animate: true, zoom: zoom});
            });

            $scope.$watch('mapType', function (mapTypeId) {
                $scope.map.setView({animate: true, mapTypeId: mapTypeId});
            });
        }
    };

}

angular.module('angularBingMaps.directives').directive('bingMap', bingMapDirective);

/*global angular, Microsoft, DrawingTools, console*/

function pushpinDirective() {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {
        var pin = new Microsoft.Maps.Pushpin();

        function updatePosition() {
            if (scope.lat && scope.lng) {
                pin.setLocation(new Microsoft.Maps.Location(scope.lat, scope.lng));
            }
        }

        updatePosition();
        mapCtrl.map.entities.push(pin);
        scope.$watch('lat', updatePosition);
        scope.$watch('lng', updatePosition);
        scope.$watch('options', function (newOptions) {
            pin.setOptions(newOptions);
        });

        Microsoft.Maps.Events.addHandler(pin, 'dragend', function (e) {
            var loc = e.entity.getLocation();
            scope.lat = loc.latitude;
            scope.lng = loc.longitude;
            scope.$apply();
        });
    }

    return {
        link: link,
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            options: '=?',
            lat: '=',
            lng: '='
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('pushpin', pushpinDirective);

/*global angular, Microsoft, DrawingTools, console*/

function tileLayerDirective() {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {
        var tileSource, tileLayer;

        function createTileSource() {
            tileSource = new Microsoft.Maps.TileSource({
                uriConstructor: scope.source
            });

            if (scope.options) {
                angular.extend(scope.options, {
                    mercator: tileSource
                });
            } else {
                scope.options = {
                    mercator: tileSource
                };
            }

            if (tileLayer) {
                tileLayer.setOptions(scope.options);
            } else {
                tileLayer = new Microsoft.Maps.TileLayer(scope.options);
                mapCtrl.map.entities.push(tileLayer);
            }
        }

        scope.$watch('options', createTileSource);
        scope.$watch('source', createTileSource);
    }

    return {
        link: link,
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            options: '=?',
            source: '='
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('tileLayer', tileLayerDirective);
