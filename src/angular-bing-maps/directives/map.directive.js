/*global angular, Microsoft*/

function bingMapDirective() {
    'use strict';
    
    function link(scope, element, attrs) {
        scope.$watch('center', function (center) {
            scope.bing.map.setView({animate: true, center: center});
        });

        scope.$watch('zoom', function (zoom) {
            scope.bing.map.setView({animate: true, zoom: zoom});
        });

        scope.$watch('mapType', function (mapTypeId) {
            scope.bing.map.setView({animate: true, mapTypeId: mapTypeId});
        });
    }
    
    return {
        link: link,
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            credentials: '=',
            center: '=',
            zoom: '=',
            mapType: '='
        },
        controller: function ($scope, $element) {
            $scope.bing = {};
            $scope.bing.map = new Microsoft.Maps.Map($element[0], {credentials: $scope.credentials});
        }
    };

}

angular.module('angularBingMaps.directives').directive('bingMap', bingMapDirective);
