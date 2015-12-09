/*global angular, Microsoft */

angularBingMapsProvider.$inject = [];
function angularBingMapsProvider() {
    'use strict';
    var defaultMapOptions = {};
    
    function setDefaultMapOptions(usersOptions) {
        defaultMapOptions = usersOptions;
    }
    
    function getDefaultMapOptions() {
        return defaultMapOptions;
    }

    return {
        setDefaultMapOptions: setDefaultMapOptions,
        $get: function() {
            return {
                getDefaultMapOptions: getDefaultMapOptions
            };
        }
    };

}

angular.module('angularBingMaps.providers').provider('angularBingMaps', angularBingMapsProvider);
