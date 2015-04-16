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
        
        MapUtils.loadAdvancedShapesModule().then(function() {
            
            scope.$watch('text', function (shape) {
                if(entity) {
                    //Something is already on the map, remove that
                    mapCtrl.map.entities.remove(entity);
                }
                if(shape && typeof shape === 'string') {
                    //Raad it and add it to the mao
                    entity = WKTModule.Read(shape);
                    // It's unclear to me if we need to call MapUtils.flattenEntityCollection()
                    // to ensure all subsequent loops through
                    // entitycollections do not have nested entitycollections. 
                    // It works as-is with test data, so not flattening
                    setOptions();
                    mapCtrl.map.entities.push(entity);
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
            
            scope.$watch('fillColor', setOptions, true);
            
            scope.$watch('strokeColor', setOptions, true);
        });
        
        function setOptions() {
            //Entity not parsed yet
            if(!entity) {return;}
            
            var options = {};
            if(scope.fillColor) {
                options.fillColor = MapUtils.makeMicrosoftColor(scope.fillColor);
            }
            if(scope.strokeColor) {
                options.strokeColor = MapUtils.makeMicrosoftColor(scope.strokeColor);
            }
            if(entity instanceof Microsoft.Maps.EntityCollection) {
                for(var i=0;i<entity.getLength();i++) {
                    if(entity.get(i) instanceof Microsoft.Maps.Polygon) {
                        entity.get(i).setOptions(options);
                    }
                }
            } else {
                entity.setOptions(options);
            }
        }
        
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

        
        scope.$on('$destroy', function() {
            mapCtrl.map.entities.remove(entity);
        });
    }

    return {
        link: link,
        restrict: 'EA',
        scope: {
            text: '=',
            events: '=?',
            trackBy: '=?',
            fillColor: '=?',
            strokeColor: '=?'
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('wkt', wktDirective);
