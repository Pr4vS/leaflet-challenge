// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {

  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Create a function for marker size based on magnitude
function markerSize(magnitude) {
   return magnitude * 4;
  }

// Function to determine marker color by depth
function markerColor(depth) {
    if(depth > 90) {
        return "#ea2c2c"
    }
    else if (depth > 70) {
        return "#ea822c"
    }
    else if (depth > 50) {
        return "#ee9c00"
    }
    else if (depth > 30) {
        return "#eecc00"
    }
    else if (depth > 10) {
        return "#d4ee00"
    }
    else {
        return "#98ee00";
    }
  };

  function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h1>Location: ${feature.properties.place}</h1><hr><h3>Magnitude: ${feature.properties.mag}</h3><br><h3>Depth: ${feature.geometry.coordinates[2]}</h3>`)
    } 

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
      let earthquakes = L.geoJSON(earthquakeData, {
        
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
      // Determine the style of markers based on properties
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.6,
        color: "black",
        stroke: true,
        weight: 0.9
      });
      
    },
    onEachFeature: onEachFeature
  });


  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

  // Add legend
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let container = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = ['#98ee00', '#d4ee00', '#eecc00', '#ee9c00', '#ea822c', '#ea2c2c'];
    for(let index = 0; index < grades.length; index++) {
        container.innerHTML += `<i style="background: ${colors[index]}"></i>${grades[index]}+ <br>`
    }
    return container;
  };

  legend.addTo(myMap);
;