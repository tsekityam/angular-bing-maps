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
