/*global angular, Microsoft, DrawingTools, console*/

function drawingToolsDirective(MapUtils) {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {
        if (typeof DrawingTools === 'undefined') {
            console.log('You did not include DrawingToolsModule.js. Please include this script and try again');
            return;
        }
        
        var options = {
            events: {
                drawingEnded: function (shapes) {
                    scope.onShapeChange({shapes: shapes});
                    scope.$apply();
                }
            }
        };
        if(attrs.hasOwnProperty('withToolbar')) {
            options['toolbarContainer'] = element[0];
        }

        function setOptions() {
            if(scope.strokeColor) {
                if(!options.hasOwnProperty('shapeOptions')) {
                    options.shapeOptions = {};
                }
                options.shapeOptions.strokeColor = MapUtils.makeMicrosoftColor(scope.strokeColor);
            }
            if(scope.fillColor) {
                if(!options.hasOwnProperty('shapeOptions')) {
                    options.shapeOptions = {};
                }
                options.shapeOptions.fillColor = MapUtils.makeMicrosoftColor(scope.fillColor);
            }
            scope.drawingManager.setOptions(options);
        }
        
        scope.drawingManager = new DrawingTools.DrawingManager(mapCtrl.map);
        setOptions();
        
        scope.$watch('drawThisShape', function (shape) {
            if (shape === 'none') {
                scope.drawingManager.setDrawingMode(null);
            } else {
                scope.drawingManager.setDrawingMode(shape);
            }
        });
        
        scope.$on('DRAWINGTOOLS.CLEAR', function() {
            scope.drawingManager.clear();
        });
    }

    return {
        link: link,
        restrict: 'EA',
        scope: {
            onShapeChange: '&',
            drawThisShape: '=',
            strokeColor: '=?',
            fillColor: '=?'
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('drawingTools', drawingToolsDirective);
