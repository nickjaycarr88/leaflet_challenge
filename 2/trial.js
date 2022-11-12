//earthquake API

let apidata = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

let tectonicPlatesUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'


// Get data by using d3

d3.json(apidata).then(CreateLayers);

// Create layers

function CreateLayers(data){

    d3.json(tectonicPlatesUrl).then(function(plateSpots){
        
        
        //the street layer used for the map
        let streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        //adding a different map layer
        let Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            minZoom: 1,
            maxZoom: 16,
            ext: 'jpg'
        });
        //using geojson to call in the tectonic plates layer
        let plates = L.geoJSON(plateSpots,{color: "yellow"})

        function radiusSize(magnitude) {
            return magnitude * 8000;
    }
        // Append all the pair locations of earthquakes to an array

        markers = [];

    for ( let i = 0; i<data.features.length; i++){   // for loop all the earthquake locations

        

        markers.push(

            L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]],{
                fillOpacity: 5,
                fillColor: circleColor(data.features[i].geometry.coordinates[2]),
                radius: radiusSize(data.features[i].properties.mag),
                stroke:true,
                weight: 1
            })

            .bindPopup(`<h2>Location:${data.features[i].properties.place}</h2> 
                        <h3>Depth: ${data.features[i].geometry.coordinates[2]} km </h3>
                        <h3>Magnitude: ${data.features[i].properties.mag}</h3>`

                        )
        );
    };
    
        // Group earthquakeMarker array into a Leaflet layer

        let earthquakeCircle = L.layerGroup(markers);

        // Create a baseMap object

        let baseMap = {

            'Base':streetLayer,

            'Watercolour map':Stamen_Watercolor
        };

        // create an another overlay layer

        let overlayMap = {
            'Earthquake markers and size':earthquakeCircle,
            'Tectonic Plate outlines':plates

        };

        // Define a map object

        let myMap = L.map('map',{
            center:[0.5, 30],
            zoom: 2,
            layers:[streetLayer,earthquakeCircle]
        });
        

        // Pass all layers to layer control and add that to myMap

        L.control.layers(baseMap, overlayMap, {collapsed: false}).addTo(myMap);


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

    });  

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

 