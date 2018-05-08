import './alltrucks.html';
Template.alltrucks.onCreated(function(){
  this.prices = new ReactiveVar();
  GoogleMaps.ready('bookingMap', function (map) {
    let marker;

    // Create and move the marker when latLng changes.
    this.autorun(function () {
      if (!this.prices.get()) {
        const latLng = Geolocation.latLng();
        console.log(latLng);
        if (!latLng)
          return;

        const image = {
          url: '/blue-dot.png',
        };
        // If the marker doesn't yet exist, create it.
        if (!marker) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(latLng.lat, latLng.lng),
            map: map.instance,
            icon: image
          });
          markersArray.push(marker); // The marker already exists, so we'll just change its position.);
        } else {
          marker.setPosition(latLng);
        }

        // Center and zoom the map view onto the current position.
        map.instance.setCenter(marker.getPosition());
        map.instance.setZoom(20);
      }
    });
  });
});

Template.alltrucks.onRendered(function(){
  GoogleMaps.load({
    v: '3',
    key: 'AIzaSyDxkt1N8EiGVK-ruD5YgHvPMWJ3REMBTZ0',
    libraries: 'geometry,places'
  });
});

Template.alltrucks.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(17.4591369,78.3442305),
        zoom: 12
      };
    } else {
      console.log('not loaded');
    }

  }
});
