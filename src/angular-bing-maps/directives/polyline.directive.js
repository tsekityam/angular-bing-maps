/*global angular, Microsoft, DrawingTools, console*/

function polylineDirective() {
    'use strict';
    var color = require('color');

    function link(scope, element, attrs, mapCtrl) {
        var bingMapLocations = [];
        function generateBingMapLocations() {
            bingMapLocations = [];
            for (var i=0;i<scope.locations.length;i++) {
                if (angular.isArray(scope.locations[i])) {
                    bingMapLocations.push(
                        new Microsoft.Maps.Location(scope.locations[i][1], scope.locations[i][0])
                    );
                } else {
                    bingMapLocations.push(
                        new Microsoft.Maps.Location(scope.locations[i].latitude, scope.locations[i].longitude)
                    );
                }
            }
        }
        generateBingMapLocations();

        var polyline = new Microsoft.Maps.Polyline(bingMapLocations);
        mapCtrl.map.entities.push(polyline);

        function generateOptions() {
            if(!scope.options) {
                scope.options = {};
            }
            if (scope.strokeColor) {
                scope.options.strokeColor = makeMicrosoftColor(scope.strokeColor);
            }
        }

        function makeMicrosoftColor(colorStr) {
            var c = color(colorStr);
            return new Microsoft.Maps.Color(Math.floor(255*c.alpha()), c.red(), c.green(), c.blue());
        }

        scope.$watch('options', function (newOptions) {
            polyline.setOptions(newOptions);
        });
        scope.$watch('locations', function() {
            generateBingMapLocations();
            polyline.setLocations(bingMapLocations);
        });
        scope.$watch('strokeColor', generateOptions);
        scope.$on('$destroy', function() {
            mapCtrl.map.entities.remove(polyline);
        });
    }

    return {
        link: link,
        restrict: 'EA',
        scope: {
            options: '=?',
            locations: '=',
            strokeColor: '=?'
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('polyline', polylineDirective);
