/*global angular, Microsoft*/

function bingMapDirective() {
    'use strict';
    
    function link(scope, element, attrs) {
        scope.bing = {};
        scope.bing.map = new Microsoft.Maps.Map(element[0], {credentials: scope.credentials});
    }
    
    return {
        link: link,
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            credentials: '='
        }
    };

}

angular.module('angularBingMaps.directives').directive('bingMap', bingMapDirective);