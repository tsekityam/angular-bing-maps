# Angular Bing Maps

##Project Status
This is a project that Credera is developing as part of a client engagement. All requirements / features of Angular Bing Maps are driven by that client's needs. Once our client's needs have been met, we will be focusing on any additional features requested by the community. In the meantime, please feel free to submit an issue and/or PR with any features that might be missing.

##Documentation
Proper documentation is in our road map, but currently not implemented. Please view [examples/index.html](https://github.com/Credera/angular-bing-maps/blob/master/example/index.html) for example usage of each directive.

### List of available directives
  * `<bing-map>`
  * `<pushpin>`
  * `<geo-json>`
  * `<infobox>`
  * `<polygon>`
  * `<polyline>`
  * `<tile-layer>`
  * `<wkt>` :star:[(Well-Known Text)](http://en.wikipedia.org/wiki/Well-known_text)
    * Using Ricky Brundritt's Bing Maps WKT Read/Write Module http://bingmapsv7modules.codeplex.com/wikipage?title=Well%20Known%20Text%20Reader%2fWriter
  * `<drawing-tools>`:star:
    * Using Ricky Brundritt's Bing Maps Drawing Tools Module https://bingmapsv7modules.codeplex.com/wikipage?title=Drawing%20Tools%20Module&version=1
:star: - Third party modules must be manually included in addition to angular-bing-maps.js. Please use modules found inside this repository under /BingMapModules/{{moduleName}}