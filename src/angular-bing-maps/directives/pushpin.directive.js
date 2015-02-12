/*global angular, Microsoft, DrawingTools, console*/

function pushpinDirective() {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {

        function updatePosition() {
            if (scope.lat && scope.lng) {
                scope.pin.setLocation(new Microsoft.Maps.Location(scope.lat, scope.lng));
                scope.$broadcast('positionUpdated', scope.pin.getLocation());
            }
        }

        updatePosition();
        mapCtrl.map.entities.push(scope.pin);
        scope.$watch('lat', updatePosition);
        scope.$watch('lng', updatePosition);
        scope.$watch('options', function (newOptions) {
            scope.pin.setOptions(newOptions);
        });

        Microsoft.Maps.Events.addHandler(scope.pin, 'dragend', function (e) {
            var loc = e.entity.getLocation();
            scope.lat = loc.latitude;
            scope.lng = loc.longitude;
            scope.$apply();
        });

        function isValidEvent(event) {
            //TODO: Implement me like one of your french girls
            return true;
        }

        for(var event in scope.events) {
            if(isValidEvent(event)) {
                //TODO: Do we need to clean up these handlers?
                Microsoft.Maps.Events.addHandler(scope.pin, event, function(e) {
                    scope.events[e.eventName]();
                    scope.$apply();
                });
            }
        }
    }



    return {
        link: link,
        controller: function ($scope) {
            this.pin = new Microsoft.Maps.Pushpin();
            $scope.pin = this.pin;
        },
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            options: '=?',
            lat: '=',
            lng: '=',
            events: '=?'
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('pushpin', pushpinDirective);
