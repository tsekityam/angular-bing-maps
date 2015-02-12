/*global angular, Microsoft, GeoJSONModule, console*/

function geoJsonDirective() {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {
        if (typeof GeoJSONModule === 'undefined') {
            console.log('You have not loaded the GeoJSONModule. Please include this script and try again');
            return;
        }
        Microsoft.Maps.loadModule('Microsoft.Maps.AdvancedShapes');

        var geoJsonModule = new GeoJSONModule(),
            entityCollection = new Microsoft.Maps.EntityCollection();

        mapCtrl.map.entities.push(entityCollection);

        scope.$watch('model', function () {
            if (scope.model) {
                geoJsonModule.ImportGeoJSON(scope.model, function (newEntityCollection, bounds) {
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
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            model: '='
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('geoJson', geoJsonDirective);
