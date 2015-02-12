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
