let map = L.map("map", {
  center: [45.52, 0],
  zoom: 2,
});

let getColor = depth =>
    depth > 90 ? 'red' :
    depth > 70 ? 'orange' :
    depth > 50 ? 'yellow' :
    depth > 30 ? 'lime' : 'green';

// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"
).then((data) => {
  console.log(data);

  L.geoJSON(data, {
    pointToLayer: function (data, latlng) {
      let depth = latlng.alt;
      let mag = data.properties.mag;

      return L.circleMarker(latlng,
        {
          radius: mag * 3,
          color: 'black',
          weight: 1,
          fillOpacity: .65,
          fillColor: getColor(depth)
        });
    },
  })
    .bindPopup(
      ({
        feature: {
          properties: { mag, place },
        },
      }) => `<h1>${place}<br>Magnitute: ${mag}</h1>`
    )
    .addTo(map);
});
//Adding legend
// Create a new control for the legend
let legend = L.control({ position: "bottomright" });

// Add content to the legend
legend.onAdd = function (map) {
  let div = L.DomUtil.create("div", "info legend"),
    grades = [0, 30, 50, 70, 90],
    labels = [];

  // Loop through the depth intervals and generate a label with a colored square for each interval
  for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getColor(grades[i] + 1) +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }

  return div;
};

// Add the legend to the map
legend.addTo(map);
