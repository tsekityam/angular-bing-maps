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
