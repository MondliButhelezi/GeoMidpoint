const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://api.maptiler.com/maps/topo-v2/256/{z}/{x}/{y}@2x.png?key=fbV6AyWrR3xmdPjUVtzn',
                attributions: 'Map data &copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors'
            })
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]), // Convert coordinates to the correct projection
        zoom: 3
    })
});

const scaleLineControl = new ol.control.ScaleLine({ units: 'metric' });
map.addControl(scaleLineControl);
