/*global angular, Microsoft, DrawingTools, console*/

function mapUtilsService($q) {
    'use strict';
    var color = require('color');
    var advancedShapesLoaded = false;

    function makeMicrosoftColor(colorStr) {
        var c = color(colorStr);
        return new Microsoft.Maps.Color(Math.floor(255*c.alpha()), c.red(), c.green(), c.blue());
    }

    function makeMicrosoftLatLng(location) {
        if (angular.isArray(location)) {
            return new Microsoft.Maps.Location(location[1], location[0]);
        } else if (location.hasOwnProperty('latitude') && location.hasOwnProperty('longitude')) {
            return new Microsoft.Maps.Location(location.latitude, location.longitude);
        } else if (location.hasOwnProperty('lat') && location.hasOwnProperty('lng')) {
            return new Microsoft.Maps.Location(location.lat, location.lng);
        } else {
            if(console && console.error) {
                console.error('Your coordinates are in a non-standard form. '+
                              'Please refer to the Angular Bing Maps '+
                              'documentation to see supported coordinate formats');
            }
            return null;
        }
    }

    function convertToMicrosoftLatLngs(locations) {
        var bingLocations = [];
        if (!locations) {
            return bingLocations;
        }
        for (var i=0;i<locations.length;i++) {
            var latLng = makeMicrosoftLatLng(locations[i]);
            bingLocations.push(latLng);
        }
        return bingLocations;
    }

    function flattenEntityCollection(ec) {
        var flat = flattenEntityCollectionRecursive(ec);
        var flatEc = new Microsoft.Maps.EntityCollection();
        var entity = flat.pop();
        while(entity) {
            flatEc.push(entity);
            entity = flat.pop();
        }
        return flatEc;
    }

    function flattenEntityCollectionRecursive(ec) {
        var flat = [];
        var entity = ec.pop();
        while(entity) {
            if (entity && !(entity instanceof Microsoft.Maps.EntityCollection)) {
                flat.push(entity);
            } else if (entity) {
                flat.concat(flattenEntityCollectionRecursive(entity));
            }
            entity = ec.pop();
        }
        return flat;
    }

    function loadAdvancedShapesModule() {
        var defered = $q.defer();
        if(!advancedShapesLoaded) {
            Microsoft.Maps.loadModule('Microsoft.Maps.AdvancedShapes', { callback: function(){
                defered.resolve();
            }});
        } else {
            defered.resolve();
        }
        return defered.promise;
    }

    return {
        makeMicrosoftColor: makeMicrosoftColor,
        makeMicrosoftLatLng: makeMicrosoftLatLng,
        convertToMicrosoftLatLngs: convertToMicrosoftLatLngs,
        flattenEntityCollection: flattenEntityCollection,
        loadAdvancedShapesModule: loadAdvancedShapesModule
    };

}

angular.module('angularBingMaps.services').service('MapUtils', mapUtilsService);
