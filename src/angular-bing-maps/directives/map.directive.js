/*global angular, Microsoft*/

function bingMapDirective(angularBingMaps) {
    'use strict';

    return {
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            credentials: '=',
            center: '=?',
            zoom: '=?',
            bounds: '=?',
            mapType: '=?',
            events: '=?',
            options: '=?',
            onMapReady: '&?'
        },
        controller: function ($scope, $element) {
            // Controllers get instantiated before link function is run, so instantiate the map in the Controller
            // so that it is available to child link functions

            // Get default mapOptions the user set in config block
            var mapOptions = angularBingMaps.getDefaultMapOptions();
            // Add in any options they passed directly into the directive
            angular.extend(mapOptions, $scope.options);
            if(mapOptions) {
                //If the user didnt set credentials in config block, look for them on scope
                if(!mapOptions.hasOwnProperty('credentials')) {
                    mapOptions.credentials = $scope.credentials;
                }
            } else {
                //The user didnt set any mapOptions on the scope OR in the config block, so create a default one
                mapOptions = {credentials: $scope.credentials};
            }

            this.map = new Microsoft.Maps.Map($element[0], mapOptions);

            var eventHandlers = {};
            $scope.map = this.map;

            /*
                Since Bing Maps fires view change events as soon as the map loads, we have to wait until after the
                initial viewchange event has completed before we bind to $scope.center. Otherwise the user's
                $scope.center will always be set to {0, 0} when the map loads
            */
            var initialViewChangeHandler = Microsoft.Maps.Events.addHandler($scope.map, 'viewchangeend', function() {
                Microsoft.Maps.Events.removeHandler(initialViewChangeHandler);
                //Once initial view change has ended, bind the user's specified handler to view change
                var centerBindEvent = angularBingMaps.getCenterBindEvent();
                Microsoft.Maps.Events.addHandler($scope.map, centerBindEvent, function(event) {
                    $scope.center = $scope.map.getCenter();
                    $scope.$apply();
                });
            });


            $scope.$watch('center', function (center) {
                $scope.map.setView({animate: true, center: center});
            });

            $scope.$watch('zoom', function (zoom) {
                $scope.map.setView({animate: true, zoom: zoom});
            });

            $scope.$watch('bounds', function (bounds) {
                $scope.map.setView({animate: true, bounds: bounds});
            });

            $scope.$watch('mapType', function (mapTypeId) {
                $scope.map.setView({animate: true, mapTypeId: mapTypeId});
            });

            $scope.$watch('options', function(options) {
                $scope.map.setOptions(options);
            });

            $scope.$watch('events', function (events) {
                //Loop through each event handler
                angular.forEach(events, function (usersHandler, eventName) {
                    //If we already created an event handler, remove it
                    if (eventHandlers.hasOwnProperty(eventName)) {
                        Microsoft.Maps.Events.removeHandler(eventHandlers[eventName]);
                    }
                    var bingMapsHandler = Microsoft.Maps.Events.addHandler($scope.map, eventName, function (event) {
                        usersHandler(event);
                        $scope.$apply();
                    });
                    eventHandlers[eventName] = bingMapsHandler;
                });
            });
        },
        link: function ($scope, $element) {
            if ($scope.onMapReady) {
                $scope.onMapReady({ map: $scope.map });
            }
        }
    };

}

angular.module('angularBingMaps.directives').directive('bingMap', bingMapDirective);
