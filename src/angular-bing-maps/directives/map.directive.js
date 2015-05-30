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
            mapType: '=?',
            events: '=?'
        },
        controller: function ($scope, $element) {
            // Controllers get instantiated before link function is run, so instantiate the map in the Controller
            // so that it is available to child link functions
            this.map = new Microsoft.Maps.Map($element[0], {credentials: $scope.credentials});
            
            var eventHandlers = {};
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
        }
    };

}

angular.module('angularBingMaps.directives').directive('bingMap', bingMapDirective);
