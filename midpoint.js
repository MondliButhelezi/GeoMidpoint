// Handle DOM Content Loaded event for dismiss button
document.addEventListener('DOMContentLoaded', function() {
    const dismissButton = document.querySelector('.dismiss-widget');
    if (dismissButton) {
        dismissButton.addEventListener('click', () => {
            const floatingWidget = document.querySelector('.routing-floating-widget');
            if (floatingWidget) {
                floatingWidget.style.display = 'none';
            }
        });
    }
});

// Handle DOM Content Loaded event for finding midpoint
document.addEventListener('DOMContentLoaded', function() {
    const findMidpointBtn = document.getElementById('find-midpoint-btn');
    const routingWidget = document.querySelector('.routing-floating-widget');
    if (findMidpointBtn) {
        findMidpointBtn.addEventListener('click', function() {
            routingWidget.style.display = 'block';
        });
    }
});

// Function to locate user
let originMarker, destinationMarker, userLocLayer;

function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const coordinates = ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857');
            console.log('Current location coordinates:', coordinates);

            const view = map.getView();
            view.setCenter(coordinates);
            view.setZoom(17);

            const userLoc = new ol.Feature({ geometry: new ol.geom.Point(coordinates) });

            // Fetch address using Nominatim API
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
            $.getJSON(nominatimUrl, data => {
                if (data.address) {
                    const originInput = document.getElementById("origin");
                    originInput.value = data.display_name;

                    const newOrigin = new ol.Feature({ geometry: new ol.geom.Point(coordinates) });

                    if (!originMarker) {
                        originMarker = new ol.layer.Vector({
                            name: 'Origin Marker',
                            source: new ol.source.Vector({ features: [newOrigin] }),
                            style: new ol.style.Style({
                                image: new ol.style.Icon({ src: 'https://cdn-icons-png.flaticon.com/24/6819/6819077.png' })
                            })
                        });
                        map.addLayer(originMarker);
                        console.log('Origin marker:', originMarker);
                    } else {
                        originMarker.getSource().clear();
                        originMarker.getSource().addFeature(newOrigin);
                    }
                }
            });
        }, () => {
            alert('Unable to locate your position');
        });
    } else {
        alert('Geolocation is not supported by this browser');
    }
}

// Initialize GPS Button with debounce
function initGpsButton() {
    const gpsButton = document.getElementById('gps');
    if (gpsButton) {
        gpsButton.addEventListener('click', _.debounce(() => {
            gpsButton.style.color = "#1E3050";
            locateUser();
        }, 1000, { leading: true, trailing: false }));
    }
}

// Helper function to debounce calls
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Cache object to store Nominatim API results
const cache = {};

// Fetch address suggestions and display them in dropdown
const fetchSuggestions = debounce((input, dropdown) => {
    const query = input.value.trim();
    if (query.length < 3) {
        dropdown.innerHTML = '';
        dropdown.style.display = 'none';
        return;
    }

    if (cache[query]) {
        displaySuggestions(cache[query], dropdown, input);
        return;
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`;
    $.getJSON(nominatimUrl, data => {
        if (data.length > 0) {
            cache[query] = data;
            displaySuggestions(data, dropdown, input);
        }
    });
}, 300);

// Function to display suggestions in the dropdown
function displaySuggestions(data, dropdown, input) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';

    const suggestionsList = document.createElement('ul');
    suggestionsList.style.margin = '0';
    suggestionsList.style.padding = '0';
    suggestionsList.style.listStyle = 'none';
    suggestionsList.innerHTML = data.map(item => `<li style="padding: 5px 10px; cursor: pointer;" data-lat="${item.lat}" data-lon="${item.lon}">${item.display_name}</li>`).join('');

    container.appendChild(suggestionsList);

    // Cancel button for dropdown
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.margin = '10px 0';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.borderRadius = '20px';
    cancelButton.style.border = 'none';
    cancelButton.style.backgroundColor = '#f44336';
    cancelButton.style.color = '#fff';
    cancelButton.style.fontWeight = 'bold';
    cancelButton.style.cursor = 'pointer';

    cancelButton.addEventListener('mouseenter', () => { cancelButton.style.backgroundColor = '#d32f2f'; });
    cancelButton.addEventListener('mouseleave', () => { cancelButton.style.backgroundColor = '#f44336'; });
    cancelButton.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.2)';

    container.appendChild(cancelButton);
    dropdown.innerHTML = '';
    dropdown.appendChild(container);
    dropdown.style.display = 'block';

    // Handle suggestions click
    suggestionsList.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            const lat = parseFloat(item.getAttribute('data-lat'));
            const lon = parseFloat(item.getAttribute('data-lon'));
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);

            const coordinates = ol.proj.fromLonLat([lon, lat]);
            const view = map.getView();
            view.setCenter(coordinates);
            view.setZoom(17);

            input.value = item.textContent;
            dropdown.style.display = 'none';
        });
    });

    // Handle cancel button click
    cancelButton.addEventListener('click', () => {
        dropdown.style.display = 'none';
    });
}

// On document ready, initialize necessary elements and event listeners
$(document).ready(function () {
    initGpsButton();

    const originInput = document.getElementById('origin');
    const originDropdown = document.getElementById('origin-dropdown');
    const destinationInput = document.getElementById('destination');
    const destinationDropdown = document.getElementById('destination-dropdown');
    
    if (originInput) {
        originInput.addEventListener('keyup', () => { fetchSuggestions(originInput, originDropdown); });
    }
    
    if (destinationInput) {
        destinationInput.addEventListener('keyup', () => { fetchSuggestions(destinationInput, destinationDropdown); });
    }
});

// Additional functions (routing, map clicks, etc.) would follow here.
