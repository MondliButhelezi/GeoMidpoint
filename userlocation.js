function isGeolocationSupported() {
    return 'geolocation' in navigator;
}

if (isGeolocationSupported()) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            map.getView().setCenter(ol.proj.fromLonLat([longitude, latitude]));
            map.getView().setZoom(18);

            const dotStyle = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({ color: 'rgba(66,171,200,255)' }),
                    stroke: new ol.style.Stroke({ color: 'rgba(255, 255, 255, 1)', width: 2 })
                })
            });

            const haloStyle = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 12,
                    fill: new ol.style.Fill({ color: 'rgba(0, 191, 255, 0.1)' }),
                    stroke: new ol.style.Stroke({ color: 'rgba(0, 191, 255, 0.4)', width: 8 }) // Fixed closing parenthesis here
                })
            });

            const userLocationLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
                        })
                    ]
                }),
                style: [dotStyle, haloStyle]
            });

            map.addLayer(userLocationLayer);
        },
        (error) => {
            console.error('Error getting user location:', error);
        }
    );
} else {
    console.error('Geolocation is not supported by this browser.');
}
