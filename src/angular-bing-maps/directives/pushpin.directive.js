/*global angular, Microsoft, DrawingTools, console*/

function pushpinDirective() {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {
        var pin = new Microsoft.Maps.Pushpin();

        function updatePosition() {
            if (scope.lat && scope.lng) {
                pin.setLocation(new Microsoft.Maps.Location(scope.lat, scope.lng));
            }
        }

        updatePosition();
        mapCtrl.map.entities.push(pin);
        scope.$watch('lat', updatePosition);
        scope.$watch('lng', updatePosition);
        scope.$watch('options', function (newOptions) {
            pin.setOptions(newOptions);
        });

        Microsoft.Maps.Events.addHandler(pin, 'dragend', function (e) {
            var loc = e.entity.getLocation();
            scope.lat = loc.latitude;
            scope.lng = loc.longitude;
            scope.$apply();
        });
    }

    return {
        link: link,
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            options: '=',
            lat: '=',
            lng: '='
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('pushpin', pushpinDirective);
