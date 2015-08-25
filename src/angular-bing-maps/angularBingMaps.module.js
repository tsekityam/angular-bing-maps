(function () {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('angularBingMaps.config', [])
      .value('angularBingMaps.config', {
          debug: true
      });

  // Modules
  angular.module('angularBingMaps.directives', []);
  angular.module('angularBingMaps.filters', []);
  angular.module('angularBingMaps.services', []);
  angular.module('angularBingMaps.providers', []);
  angular.module('angularBingMaps',
      [
          'angularBingMaps.config',
          'angularBingMaps.directives',
          'angularBingMaps.filters',
          'angularBingMaps.services',
          'angularBingMaps.providers'
      ]);

})();
