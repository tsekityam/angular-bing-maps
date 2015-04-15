/*global angular, Microsoft, DrawingTools, console, WKTModule*/

function wktDirective(MapUtils) {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {
        if (typeof WKTModule === 'undefined') {
            console.log('You did not include WKTModule.js. Please include this script and try again');
            return;
        }
        
        var entity = null;
        var eventHandlers = [];
        
        scope.$watch('text', function (shape) {
            if(shape && typeof shape === 'string') {
                //REad it and add it to the mao
                entity = WKTModule.Read(shape);
                if(entity instanceof Microsoft.Maps.EntityCollection) {
                    //Make sure it's flat, for case of GeographyCollection
                    entity = MapUtils.flattenEntityCollection(entity);
                }
                mapCtrl.map.entities.push(entity);
            } else {
                mapCtrl.map.entities.remove(entity);
            }
        }, true);
        
        scope.$watch('events', function(events) {
            removeAllHandlers();
            //Loop through each event handler
            angular.forEach(events, function(usersHandler, eventName) {
                if(entity instanceof Microsoft.Maps.EntityCollection) {
                    //Add the handler to all entities in collection
                    for(var i=0;i<entity.getLength();i++) {
                        addHandler(entity.get(i), eventName, usersHandler);
                    }
                } else {
                    addHandler(entity, eventName, usersHandler);
                }
            });
        });
        
        function addHandler(target, eventName, userHandler) {
            var handler = Microsoft.Maps.Events.addHandler(target, eventName, function(event) {
                if(scope.trackBy) {
                    event.target['trackBy'] = scope.trackBy;
                }
                userHandler(event);
                scope.$apply();
            });
            eventHandlers.push(handler);
        }
        function removeAllHandlers() {
            var handler = eventHandlers.pop();
            while(typeof handler === 'function') {
                Microsoft.Maps.Events.removeHandler(handler);
                handler = eventHandlers.pop();
            }
        }
    }

    return {
        link: link,
        restrict: 'EA',
        scope: {
            text: '=',
            events: '=',
            trackBy: '='
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('wkt', wktDirective);
