/*global angular, Microsoft, DrawingTools, console*/

function mapUtilsService() {
    'use strict';
    var color = require('color');

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
        for (var i=0;i<locations.length;i++) {
            var latLng = makeMicrosoftLatLng(locations[i]);
            bingLocations.push(latLng);
        }
        return bingLocations;
    }

    return {
        makeMicrosoftColor: makeMicrosoftColor,
        makeMicrosoftLatLng: makeMicrosoftLatLng,
        convertToMicrosoftLatLngs: convertToMicrosoftLatLngs
    };

}

angular.module('angularBingMaps.services').service('MapUtils', mapUtilsService);
