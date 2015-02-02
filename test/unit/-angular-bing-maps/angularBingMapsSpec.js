'use strict';

describe('', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
  return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {

  // Get module
  module = angular.module('angularBingMaps');
  dependencies = module.requires;
  });

  it('should load config module', function() {
    expect(hasModule('angularBingMaps.config')).to.be.ok;
  });

  
  it('should load filters module', function() {
    expect(hasModule('angularBingMaps.filters')).to.be.ok;
  });
  

  
  it('should load directives module', function() {
    expect(hasModule('angularBingMaps.directives')).to.be.ok;
  });
  

  
  it('should load services module', function() {
    expect(hasModule('angularBingMaps.services')).to.be.ok;
  });
  

});