/*global angular, Microsoft, DrawingTools, console*/

function polygonDirective(MapUtils) {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {
        var bingMapLocations = [];
        function generateBingMapLocations() {
            bingMapLocations = MapUtils.convertToMicrosoftLatLngs(scope.locations);
        }
        generateBingMapLocations();

        var polygon = new Microsoft.Maps.Polygon(bingMapLocations);
        mapCtrl.map.entities.push(polygon);

        function generateOptions() {
            if(!scope.options) {
                scope.options = {};
            }
            if (scope.fillColor) {
                scope.options.fillColor = MapUtils.makeMicrosoftColor(scope.fillColor);
            }
            if (scope.strokeColor) {
                scope.options.strokeColor = MapUtils.makeMicrosoftColor(scope.strokeColor);
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
        scope.$on('$destroy', function() {
            mapCtrl.map.entities.remove(polygon);
        });
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
