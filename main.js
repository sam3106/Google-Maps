var map;
var infoWindow;
var request;
var center = new google.maps.LatLng(43.655089, -70.264527);
var markerArray = [];

function initialize() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 15,

    mapTypeControl: false,
    styles: [
      {
        featureType: 'poi.medical',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.park',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.place_of_worship',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.school',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.government',
        stylers: [{ visibility: 'off' }]
      }
    ]
    /* This function creates my google map. Also the variable center is used to create the starting point for the google maps using latitud and longitude.  */
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  var markers = [];
  var defaultBounds = new google.maps.LatLngBounds(center, center);
  var options = {
    bounds: defaultBounds
    // Used to keep the autocomplete search bar around Ibec office
  };

  var service = new google.maps.DirectionsService();
  autocomplete = new google.maps.places.Autocomplete(input, options, request);
  var places = searchBox.getPlaces();
  var request = {
    location: center,
    radius: 4047,
    types: ['restaurant']
  };

  infoWindow = new google.maps.InfoWindow(); //Open the window menu on google maps
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
  function callback(results, status) {
    markerArray = [];
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }

    // Add a marker clusterer to manage the markers. Cluster api reference is added in index.html
    var markerCluster = new MarkerClusterer(map, markerArray, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
  }
  function createMarker(place) {
    //alert(JOSN.stringify(place));
    var icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      icon: icon,
      zoom: 19,
      label: {
        // you can change text size here
        fontSize: '12px',
        color: 'black',
        // greater the value more bold it will be
        fontWeight: '600',
        text: place.name
      },

      position: place.geometry.location
    });

    // add each marker to array so that we can pass this array for clustering
    markerArray.push(marker);

    // marker click event with dynamic content
    google.maps.event.addListener(marker, 'click', function() {
      var geocoder = new google.maps.Geocoder();
      var address = '';

      // geocode the place id to  get the complete address of location
      geocoder.geocode({ placeId: place.place_id }, function(results, status) {
        // current location to marker location direction url
        var dirURL =
          'https://www.google.com/maps/dir/?api=1&destination=' +
          results[0].geometry.location.lat().toString() +
          ',' +
          results[0].geometry.location.lng().toString();

        if (status === 'OK') {
          if (results[0]) {
            address =
              '<strong>' +
              results[0].formatted_address +
              "</strong><br><a  target='_blank' href='" +
              dirURL +
              "'> Get Directions </a>";
          } else {
            address = 'Address not available.';
          }
        } else {
          address = 'Geocoder failed due to: ' + status;
        }

        infoWindow.setContent(address);
      });
      infoWindow.open(map, this);
    });
  }
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
}

google.maps.event.addDomListener(
  window,
  'load',
  initialize
); /*on load my function  initialize is loaded */
