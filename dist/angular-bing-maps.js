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

    return {
        link: link,
        restrict: 'EA',
        scope: {
            onShapeChange: '&',
            drawThisShape: '='
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('drawingTools', drawingToolsDirective);

/*global angular, Microsoft, GeoJSONModule, console*/

function geoJsonDirective() {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {
        if (typeof GeoJSONModule === 'undefined') {
            console.log('You have not loaded the GeoJSONModule.js. Please include this script and try again');
            return;
        }
        Microsoft.Maps.loadModule('Microsoft.Maps.AdvancedShapes');

        var geoJsonModule = new GeoJSONModule(),
            entityCollection = new Microsoft.Maps.EntityCollection();

        mapCtrl.map.entities.push(entityCollection);

        scope.$watch('model', function () {
            if (scope.model) {
                geoJsonModule.ImportGeoJSON(scope.model, function (newEntityCollection, bounds) {
                    //Take everything out of the newEntityCollection that the GeoJSON module gave us
                    //and put it in our own for better control over the entity
                    var entity = newEntityCollection.pop();
                    while (entity) {
                        entityCollection.push(entity);
                        entity = newEntityCollection.pop();
                    }
                });
            } else {
                entityCollection.clear();
            }
        });

    }

    return {
        link: link,
        restrict: 'EA',
        scope: {
            model: '='
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('geoJson', geoJsonDirective);

/*global angular, Microsoft, DrawingTools, console*/

function infoBoxDirective() {
    'use strict';

    function link(scope, element, attrs, ctrls) {
        var infobox = new Microsoft.Maps.Infobox(),
            pushpinCtrl = ctrls[1];

        function updateLocation() {
            infobox.setLocation(new Microsoft.Maps.Location(scope.lat, scope.lng));
        }
        function updateOptions() {
            if (!scope.options) {
                scope.options = {};
            }
            if (scope.title) {
                scope.options.title = scope.title;
            }
            if (scope.description) {
                scope.options.description = scope.description;
            }
            if (scope.hasOwnProperty('visible')) {
                scope.options.visible = scope.visible;
            } else {
                scope.options.visible = true;
            }

            //TODO: Define a default offset for the default infobox to prevent overlapping default marker??? Maybe....

            infobox.setOptions(scope.options);
        }

        scope.$on('positionUpdated', function(event, location) {
           infobox.setLocation(location);
        });

        if (!pushpinCtrl) {
            scope.$watch('lat', updateLocation);
            scope.$watch('lng', updateLocation);
        }

        scope.$watch('options', updateOptions);
        scope.$watch('title', updateOptions);
        scope.$watch('description', updateOptions);
        scope.$watch('visible', updateOptions);

        ctrls[0].map.entities.push(infobox);

        /*Need a way to set visible = false when close button clicked. This is not working*/
//        Microsoft.Maps.Events.addHandler(infobox, 'entitychanged', function(event) {
//            scope.visible = event.entity.getVisible();
//            scope.$apply();
//        });
    }

    return {
        link: link,
        restrict: 'EA',
        scope: {
            options: '=?',
            lat: '=?',
            lng: '=?',
            title: '=?',
            description: '=?',
            visible: '=?'
        },
        require: ['^bingMap', '?^pushpin']
    };

}

angular.module('angularBingMaps.directives').directive('infoBox', infoBoxDirective);

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

function polygonDirective() {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {
        var bingMapLocations = [];
        function generateBingMapLocations() {
            bingMapLocations = [];
            for (var i=0;i<scope.locations.length;i++) {
                if (angular.isArray(scope.locations[i])) {
                    bingMapLocations.push(
                        new Microsoft.Maps.Location(scope.locations[i][0], scope.locations[i][1])
                    );
                } else {
                    bingMapLocations.push(
                        new Microsoft.Maps.Location(scope.locations[i].latitude, scope.locations[i].longitude)
                    );
                }
            }
        }
        generateBingMapLocations();

        var polygon = new Microsoft.Maps.Polygon(bingMapLocations);
        mapCtrl.map.entities.push(polygon);


        function generateOptions() {
            if(!scope.options) {
                scope.options = {};
            }
            if (scope.fillColor) {
                scope.options.fillColor = Microsoft.Maps.Color.fromHex(scope.fillColor);
            }
            if (scope.strokeColor) {
                scope.options.strokeColor = Microsoft.Maps.Color.fromHex(scope.strokeColor);
            }
        }

        scope.$watch('options', function (newOptions) {
            polygon.setOptions(newOptions);
        });
        scope.$watch('locations', function() {
            generateBingMapLocations();
            polygon.setLocations(bingMapLocations);
        });
        scope.$watch('fillColor', generateOptions);
        scope.$watch('strokeColor', generateOptions);
    }

    return {
        link: link,
        restrict: 'EA',
        scope: {
            options: '=?',
            locations: '=',
            fillColor: '=?',
            strokeColor: '=?'
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('polygon', polygonDirective);

/*global angular, Microsoft, DrawingTools, console*/

function pushpinDirective() {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {

        function updatePosition() {
            if (scope.lat && scope.lng) {
                scope.pin.setLocation(new Microsoft.Maps.Location(scope.lat, scope.lng));
                scope.$broadcast('positionUpdated', scope.pin.getLocation());
            }
        }

        updatePosition();
        mapCtrl.map.entities.push(scope.pin);
        scope.$watch('lat', updatePosition);
        scope.$watch('lng', updatePosition);
        scope.$watch('options', function (newOptions) {
            scope.pin.setOptions(newOptions);
        });

        Microsoft.Maps.Events.addHandler(scope.pin, 'dragend', function (e) {
            var loc = e.entity.getLocation();
            scope.lat = loc.latitude;
            scope.lng = loc.longitude;
            scope.$apply();
        });

        function isValidEvent(event) {
            //TODO: Implement me like one of your french girls
            return true;
        }

        for(var event in scope.events) {
            if(isValidEvent(event)) {
                //TODO: Do we need to clean up these handlers?
                Microsoft.Maps.Events.addHandler(scope.pin, event, function(e) {
                    scope.events[e.eventName]();
                    scope.$apply();
                });
            }
        }
    }



    return {
        link: link,
        controller: function ($scope) {
            this.pin = new Microsoft.Maps.Pushpin();
            $scope.pin = this.pin;
        },
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            options: '=?',
            lat: '=',
            lng: '=',
            events: '=?'
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
