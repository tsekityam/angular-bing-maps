/*global angular, Microsoft*/

venueMapDirective.$inject = ['$timeout'];
function venueMapDirective($timeout) {
    'use strict';

    return {
        template: '<div class="directory"></div><div class="map"></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            credentials: '=',
            center: '=?',
            zoom: '=?',
            mapType: '=?',
            venue: '=?',
            room: '=?',
        },
        controller: ['$scope', '$element', function ($scope, $element) {
            // Controllers get instantiated before link function is run, so instantiate the map in the Controller
            // so that it is available to child link functions
            this.map = new Microsoft.Maps.Map($element.children()[1], { credentials: $scope.credentials });
            $scope.map = this.map;

            $scope.$watch('center', function (center) {
                $scope.map.setView({ animate: true, center: center });
            });

            $scope.$watch('zoom', function (zoom) {
                $scope.map.setView({ animate: true, zoom: zoom });
            });

            $scope.$watch('mapType', function (mapTypeId) {
                $scope.map.setView({ animate: true, mapTypeId: mapTypeId });
            });
       

            var venue;

            function findRoom(roomName) {
                var match = roomName.toUpperCase();
                for (var i = 0; i < venue.floors.length; i++) {
                    for (var j = 0; j < venue.floors[i].primitives.length; j++) {
                        var primitive = venue.floors[i].primitives[j];
                        var itemName = primitive.name.toUpperCase();
                        if (match === itemName) {
                            return primitive;
                        }
                    }
                }
                return null;
            }

            function addDirectory() {
                if (venue && venue.directory && venue.directory.isInDOM()) {
                    // Using the $timeout object here to add a zero length wait to ensure 
                    // the directory is added to the DOM this ensures that the directory 
                    // links are in the DOM to be clicked
                    $timeout(function() {
                        if (typeof($scope.room) !== 'undefined' && $scope.room !== null) {
                            var room = findRoom($scope.room);
                            if (typeof(room) !== 'undefined' && room !== null) {
                                //grab the anchor tag in the directory and click it
                                var selector = document.getElementById(room.id)
                                                        .getElementsByTagName('a')[0];

                                if(typeof(selector) !== 'undefined' && selector !== null) {
                                    selector.click();
                                }

                                $scope.map.setView({ animate: true, zoom: 17});
                                return;
                            }
                        }
                    });
                }
            }

            function venueMapLoaded(result) {
                $timeout(function() {
                    venue = result;

                    if(!venue.directory.isInDOM()) {
                        venue.directory.createUIElements();
                    }

                    venue.directory.addToDOM($element.children()[0], 
                                            Microsoft.Maps.VenueMaps.DirectorySortOrder.byFloor, 
                                            Microsoft.Maps.VenueMaps.DirectoryGrouping.none);
                    venue.directory.setHeight(1.0);

                    $scope.map.setView(venue.bestMapView, true);
                    venue.show();

                    addDirectory();
                });
            }

            function venueMapModuleReady() {
                var vmaps = new Microsoft.Maps.VenueMaps.VenueMapFactory($scope.map);
                vmaps.create({ venueMapId: $scope.venue, success: venueMapLoaded });
            }

            Microsoft.Maps.loadModule('Microsoft.Maps.VenueMaps', { callback: venueMapModuleReady });
        }]
    };
}

angular.module('angularBingMaps.directives').directive('venueMap', venueMapDirective);
