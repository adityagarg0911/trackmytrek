var map = L.map('map').setView([40, -103], 3)

const mainLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://carto.com/">carto.com</a> contributors'
});
mainLayer.addTo(this.map);

const markers = L.markerClusterGroup();

// mainLayer.on('load', function () {
//     console.log("MAP LOADED");
// });

// mainLayer.on('click', 'unclustered-point', function () {
//     console.log("UC POINT CLICKED");
// });
  
// map.on('click', 'unclustered-point', function () {
//     console.log("UC POINT CLICKED");
// });

for (campground of campgrounds) {
    const marker = L.marker([
        campground.geometry.coordinates[1],
        campground.geometry.coordinates[0]
    ]).bindPopup(`
                <a href="/campgrounds/${campground._id}"}>
                    <h6>${campground.title}</h6>
                </a>
                <p>${campground.location}</p>
        `)
    markers.addLayer(marker)
}
map.addLayer(markers);