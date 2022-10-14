
// Perform an API call to the earthquake.usgs.gov API to get the station information. Call createCircles when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(createCircles);


function createMap(earthquakeLocations) {

  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    StreetMap: streetmap
  };

  // Create an overlayMaps object to hold the earthquakeLocations layer.
  let overlayMaps = {
    EarthquakeLocations: earthquakeLocations
  };

  // Create the map object with options.
  let map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 3,
    layers: [streetmap, earthquakeLocations]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps,  {
    collapsed: false
  }).addTo(map);
}

function createCircles(response) {

  // Pull the "features" property from response.data.
  let earthquakeJSONinfo = response.features;

  // Initialize an array to hold earthquake circles.
  let earthquakeArray = [];

  // Loop through the earthquakeJSONinfo array.
  for (let index = 0; index < earthquakeJSONinfo.length; index++) {
    let earthquakeIteration = earthquakeJSONinfo[index];

    // For each earthquake, create a circle in accordance to the lat and lon.
    let earthquakeCircle = L.circle([earthquakeIteration.geometry.coordinates[1], earthquakeIteration.geometry.coordinates[0]]);

    // Add the marker to the earthquakeArray array.
    earthquakeArray.push(earthquakeCircle);
  }

  // Create a layer group that's made from the earthquakeArray, and pass it to the createMap function.
  createMap(L.layerGroup(earthquakeArray));
}



