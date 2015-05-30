# Angular Bing Maps
[![Join the chat at https://gitter.im/Credera/angular-bing-maps](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Credera/angular-bing-maps?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

##Project Status
This is a project that Credera is developing as part of a client engagement. All requirements / features of Angular Bing Maps are driven by that client's needs. Once our client's needs have been met, we will be focusing on any additional features requested by the community. In the meantime, please feel free to submit an issue and/or PR with any features that might be missing.

##Getting Started
  1. Obtain source code for angular-bing-maps
    * Via Bower `bower install angular-bing-maps --save`
    * Via git `git clone git@github.com:Credera/angular-bing-maps.git`
  2. Include /dist/angular-bing-maps.min.js in your HTML source
    * `<script type="text/javascript" src="bower_components/angular-bing-maps/dist/angular-bing-maps.min.js"></script>`
  3. Include Bing Maps' Javascript file in your HTML source
    * `<script charset="UTF-8" type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>`
  4. Include 'angularBingMaps' module in your angular app dependencies
    * `var myApp = angular.module('yourAppName', ['angularBingMaps']);`
  5. Add your parent `<bing-map></bing-map>` directive into your HTML with your Bing Maps API credentials
    * Please see `/example/bing-map-directive.html` for a basic example. 
    * NOTE: Please register for your own Bing Maps API key at https://www.bingmapsportal.com. Login with your Windows Live account and click 'My Account' -> 'Create or view your keys'

##Documentation
Proper documentation is in our road map, but currently not implemented. Please view [/examples](https://github.com/Credera/angular-bing-maps/blob/master/example) for example usage of each directive.

### List of available directives
  * `<bing-map>`
  * `<pushpin>`
  * `<infobox>`
  * `<polygon>`
  * `<polyline>`
  * `<tile-layer>`
  * `<geo-json>` :star:
    * Using Earthware Ltd.'s Bing Maps GeoJSON Module from http://bingmapsv7modules.codeplex.com/wikipage?title=GeoJSON%20Module
  * `<wkt>` :star:[(Well-Known Text)](http://en.wikipedia.org/wiki/Well-known_text)
    * Using Ricky Brundritt's Bing Maps WKT Read/Write Module http://bingmapsv7modules.codeplex.com/wikipage?title=Well%20Known%20Text%20Reader%2fWriter
  * `<drawing-tools>`:star:
    * Using Ricky Brundritt's Bing Maps Drawing Tools Module https://bingmapsv7modules.codeplex.com/wikipage?title=Drawing%20Tools%20Module&version=1

:star: - Third party modules must be manually included in addition to angular-bing-maps.js. Please use modules found inside this repository under /BingMapModules/{{moduleName}}
