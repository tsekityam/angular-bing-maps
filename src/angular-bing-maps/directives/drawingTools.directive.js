/*global angular, Microsoft, DrawingTools, console*/

function drawingToolsDirective() {
    'use strict';

    function link(scope, element, attrs, mapCtrl) {
        if (typeof DrawingTools === 'undefined') {
            console.log('You did not include DrawingToolsModule.js. Please include this script and try again');
            return;
        }
        scope.drawingManager = new DrawingTools.DrawingManager(mapCtrl.map, {
            events: {
                drawingEnded: function (shapes) {
                    scope.onShapeChange({shapes: shapes});
                    scope.$apply();
                }
            }
        });
        scope.$watch('drawThisShape', function (shape) {
            if (shape === 'none') {
                scope.drawingManager.setDrawingMode(null);
            } else {
                scope.drawingManager.setDrawingMode(shape);
            }
        });
    }

    return {
        link: link,
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        transclude: true,
        scope: {
            onShapeChange: '&',
            drawThisShape: '='
        },
        require: '^bingMap'
    };

}

angular.module('angularBingMaps.directives').directive('drawingTools', drawingToolsDirective);
