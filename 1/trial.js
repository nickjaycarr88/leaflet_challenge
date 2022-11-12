// API query URL

let apidata = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Get data by using d3
d3.json(apidata).then(CreateLayers);

// Create layers

function CreateLayers(data){

    let streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

function radiusSize(magnitude) {
        return magnitude * 8000;
}
    // Append all the pair locations of earthquakes to an array

    markers = [];

    for ( let i = 0; i<data.features.length; i++){   
        

        markers.push(

            L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]],{
                fillOpacity: 5,
                fillColor: circleColor(data.features[i].geometry.coordinates[2]),
                radius: radiusSize(data.features[i].properties.mag),
                stroke:true,
                weight: 1
            })

            .bindPopup(`<h2>Location:${data.features[i].properties.place}</h2> <hr> 
                        <h3>Depth: ${data.features[i].geometry.coordinates[2]} km </h3>
                        <h3>Magnitude: ${data.features[i].properties.mag}</h3>`

                        )
        );
    };

    // setting a variable for markers

    let earthquakeCircle = L.layerGroup(markers);

    // baseMap object

    let baseMap = {
        base:streetLayer
    };

    // overlay layer

    let overlayMap = {
        earthquake:earthquakeCircle
    };

    // map object

    let myMap = L.map('map',{
        center:[0.5, 30],
        zoom: 2,
        layers:[streetLayer,earthquakeCircle]
    });

    // add above controls to myMap

    L.control.layers(baseMap, overlayMap);

////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Set up the legend.

   //legend for the map
   var legend = L.control({ position: "bottomright" });

   legend.onAdd = function(map) {
     var div = L.DomUtil.create("div", "legend");
     div.innerHTML += "<h4>Earthquake Depth</h4>";
     
     div.innerHTML += '<i style="background: #330066"></i><span>Above 90</span><br>';
     div.innerHTML += '<i style="background: #6600CC"></i><span>70-90</span><br>';
     div.innerHTML += '<i style="background: #FFB266"></i><span>50-70</span><br>';
     div.innerHTML += '<i style="background: #FFCC99"></i><span>30-50</span><br>';
     div.innerHTML += '<i style="background: #FFE5CC"></i><span>10-30</span><br>';
     div.innerHTML += '<i style="background: #FFFFCC"></i><span>Less than 10</span><br>';
     
     
   
     return div;
   };
   
   legend.addTo(myMap);

};  




// Create color function for the conditions of Mag level

function circleColor(depth) {
    if (depth > 90) {
        return "#330066";
    } else if (depth > 70) {
        return "#6600CC";
    } else if (depth > 50) {
        return "#FFB266";
    } else if (depth > 30) {
        return "#FFCC99";
    } else if (depth > 10) {
        return "#FFE5CC";
    } else {
        return "#FFFFCC"
    }

}