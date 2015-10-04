angular.module('map.controllers', [])
.controller('MapCtrl', function($scope, apiUrl) {

  console.log(apiUrl);
  $scope.map;

  // Placeholder
  var infoWindow = new google.maps.InfoWindow({
    content: ""
  });

  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;

    //Load the map data:
    var well_data = httpGet(apiUrl);
    var wellGeoJson = JSON.parse(well_data);

    wellGeoJson = GeoJSON.parse(wellGeoJson, {Point: ['lat', 'lng']});

    map.data.addGeoJson(wellGeoJson); 

    //Create Info window pop up to display Well Id and water level
    //Might want to change this to onClick -- mouseover get annoying
    map.data.addListener('mouseover', function(event) {
      infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;"> Well ID = '+
        event.feature.getProperty('Id') +"<br/>Water Level: " + event.feature.getProperty("Level")  + "m");
      var anchor = new google.maps.MVCObject();
      anchor.set("position",event.latLng);
      infoWindow.open(map,anchor);
    });


    var heatMapData = []; //Container for heatmap data points
    var coords = []       //
    var maxWeight = 0;    //Max weight value for heatmap legend

    //Get maxWeight and populate heatMapdata
    for(var well in wellGeoJson.features){      
      if (wellGeoJson.features[well].properties.Level > maxWeight) {
        maxWeight = wellGeoJson.features[well].properties.Level;
      }

      var point = {
        location: new google.maps.LatLng(
          Number(wellGeoJson.features[well].geometry.coordinates[1]),
          Number(wellGeoJson.features[well].geometry.coordinates[0])),
        weight: wellGeoJson.features[well].properties.Level 
      };
      heatMapData.push(point);
    }

    //Create heapmap layer
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: new google.maps.MVCArray(heatMapData),
      radius: 40
    }); 

    //Build out Legend
    var gradient = ['rgba(0, 255, 255, 0)','rgba(0, 255, 255, 1)','rgba(0, 191, 255, 1)','rgba(0, 127, 255, 1)','rgba(0, 63, 255, 1)','rgba(0, 0, 255, 1)',    'rgba(0, 0, 223, 1)','rgba(0, 0, 191, 1)','rgba(0, 0, 159, 1)','rgba(0, 0, 127, 1)','rgba(63, 0, 91, 1)','rgba(127, 0, 63, 1)','rgba(191, 0, 31, 1)','rgba(255, 0, 0, 1)']

    heatmap.set('gradient',gradient);
    heatmap.setMap(map);

    var gradientCss = '(left';
      for (var i = 0 ; i < gradient.length; ++i){
        gradientCss += ', ' + gradient[i];
      }
      gradientCss += ')';

    //Update the DOM
    document.getElementById('LegendGradient').style.background = '-webkit-linear-gradient' + gradientCss;
    document.getElementById('LegendGradient').style.background =  '-moz-linear-gradient' + gradientCss;
    document.getElementById('LegendGradient').style.background =  '-o-linear-gradient' + gradientCss;
    document.getElementById('LegendGradient').style.background =  'linear-gradient' + gradientCss;

    drawLegend(maxWeight);
  });

  //TODO: Tidy
  function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send();
    return xmlHttp.responseText;
  }

  //Called when page is requested to load
  // google.maps.event.addDomListener(window, 'load', initialize);

  function drawLegend(maxIntensity) {
    //var maxIntensity = heatmap['gm_bindings_']['maxIntensity'][484]['Sc']['j'];
    var legendWidth = document.getElementById('LegendGradient').style.width = '100%';
    var offset = Math.round(maxIntensity/6);
    console.log("MaxIntesity: " + maxIntensity +", offset:" + offset  );
    var value = maxIntensity;
    var key = 6;
    //build legend key scale
    for ( key ; key > 0; key--) {
      //Add Value to key
      var t_value = document.createTextNode(Math.round(value));
      document.getElementById(key).appendChild(t_value);
      //decrement value
      value = value - offset;
    }
  }

  $scope.toggleHeatmap = function() {
    heatmap.setMap(heatmap.getMap() ? null : $scope.map);
  }
  
  //toggles radius of heatmap - this needs some tunning for well applications, what is the effective radius ?
  $scope.changeRadius = function() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
  }
  //changes the color of the heat map
  $scope.changeGradient = function() {
    var gradient = ['rgba(0, 255, 255, 0)','rgba(0, 255, 255, 1)','rgba(0, 191, 255, 1)','rgba(0, 127, 255, 1)','rgba(0, 63, 255, 1)','rgba(0, 0, 255, 1)','rgba(0, 0, 223, 1)','rgba(0, 0, 191, 1)','rgba(0, 0, 159, 1)','rgba(0, 0, 127, 1)','rgba(63, 0, 91, 1)','rgba(127, 0, 63, 1)','rgba(191, 0, 31, 1)','rgba(255, 0, 0, 1)']
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
  }

  $scope.locate = function() {
    console.log("Where am i?");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.map.setCenter(geolocate);
        //TODO: Drop pin?
      });

    }
    else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
})
