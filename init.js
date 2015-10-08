var map;
var markers = [];
function initMap() {
  var imageMarker = {
    url: "https://s3-us-west-1.amazonaws.com/yalku/img/placeholder24.png",
    scaledSize: new google.maps.Size(24, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(12, 32)
  };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    disableDoubleClickZoom: true,
    center: {lat: 34.366, lng: -89.519}
  });
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  var poly = new google.maps.Polyline({
    strokeColor: '#000000',
    strokeOpacity: 1,
    strokeWeight: 3,
    map: map
  });
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {  
      var marker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          icon: imageMarker
      });
      var path = poly.getPath();
      path.push(place.geometry.location);
      markers.push(marker);
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  // Add a listener for the click event
  google.maps.event.addListener(map, 'dblclick', function(event) {
    addLatLngToPoly(event.latLng, poly);
  });
  function addLatLngToPoly(latLng, poly) {
    // later add an input with autocomplete just to search if name already exists
    var path = poly.getPath();
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: imageMarker
    });
    markers.push(marker)
    path.push(latLng);
  }
}