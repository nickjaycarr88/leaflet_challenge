// Creating the map object
let map = L.map("map", {
  center: [20.7128, -74.0059],
  zoom: 3
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Use this link to get the GeoJSON data.
let geojsondata = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Getting our GeoJSON data
d3.json(geojsondata).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    // Styling each feature (in this case, a neighbourhood)
    style: function(feature) {
      return {
        color: "yellow",
        fillOpacity: 0,
        weight: 1.8
      };
    },
      
  }).addTo(map);

 
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += '<i style="background: #477AC2"></i><span>-10-10</span><br>';
  div.innerHTML += '<i style="background: #448D40"></i><span>10-30</span><br>';
  div.innerHTML += '<i style="background: #E6E696"></i><span>30-50</span><br>';
  div.innerHTML += '<i style="background: #E8E6E0"></i><span>50-70</span><br>';
  div.innerHTML += '<i style="background: #FFFFFF"></i><span>70-90</span><br>';
  div.innerHTML += '<i style="background: #FFFFFF"></i><span>90+</span><br>';

  // div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';
  
  

  return div;
};

legend.addTo(map);

});
