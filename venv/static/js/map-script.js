// map-script.js

function initMap() {
    // Check if Geolocation is supported by the browser
    if (navigator.geolocation) {
        // Get the current position
        navigator.geolocation.getCurrentPosition(function(position) {
            // Set the coordinates for the map center
            var myLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };

            // Create a new map and set its center and zoom level
            var map = new google.maps.Map(document.getElementById('map'), {
                center: myLatLng, // 현재 위치로 지도의 센터를 설정
                zoom: 13
            });

            // Add a marker to the map
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Your Location'
            });
        }, function(error) {
            // Handle errors, if any
            console.error('Error getting the user location:', error);
        });
    } else {
        // Geolocation is not supported by the browser
        console.error('Geolocation is not supported by your browser');
    }
}


