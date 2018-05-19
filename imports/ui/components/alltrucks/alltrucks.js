import './alltrucks.html';
import {Locations} from '/imports/api/locations/locations.js';
import {Trucks} from '/imports/api/trucks/trucks.js';
import {Items} from '/imports/api/items/items.js';
import {Images} from '/imports/api/images/images.js';
const ZOOM = 14;
let directionsService;
let directionsDisplay;
let markersArray;
const setCountry = function(loc) {
  let country = ['in'];
  loc.setComponentRestrictions({'country': country});
}

const expandViewportToFitPlace = function(map, place) {
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(20);
  }
}

const route = function(t) {

  //  if (!t.latlng.get() || !t.destination_latLng.get()) {
  //    clearOverlays();
  //    return;
  //  }
  const map = GoogleMaps.maps.map.instance;
  //  clearOverlays();
  if (!directionsService)
    directionsService = new google.maps.DirectionsService;
  if (!directionsDisplay)
    directionsDisplay = new google.maps.DirectionsRenderer;

  //  directionsDisplay.setMap(null);
  directionsDisplay.setMap(map);
  //  directionsDisplay.set('directions', null);
  const start = t.latlng.get();
  const end = t.destination_latLng.get();
  const orign = start.lat + ',' + start.lng;
  const destination = end.lat + ',' + end.lng;
  directionsService.route({
    origin: orign,
    destination: destination,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
Template.alltrucks.onCreated(function() {
  this.autorun(() => {
    this.subscribe('locations.online');
    let userIds = [];
    Locations.find().map((l) => {
      userIds.push(l.userId);
    });
    this.subscribe('trucks.all', userIds);
    this.subscribe('items.all', userIds);
    this.subscribe('allImagesByTypeForAll', 'Truck', userIds);
    this.subscribe('allImagesByTypeForAll', 'Menu', userIds);
    this.subscribe('allImagesByTypeForAll', 'Item', userIds);

  });
  this.destination_latLng = new ReactiveVar();
  this.latlng = new ReactiveVar();
  this.resetMap = new ReactiveVar(false);
  this.hasClass = new ReactiveVar(false);
  this.selectedUserId = new ReactiveVar();
  this.showControl = new ReactiveVar(true);
  var self = this;
  var markers = [];
  var infowindows = [];

  GoogleMaps.ready('map', function(map) {
    const SnazzyInfoWindow = require('snazzy-info-window');
    var styledMapType = new google.maps.StyledMapType([
      {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on",
            "color": "#aaaaaa"
          }
        ]
      }, {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#aaaaaa"
          }
        ]
      }, {
        "featureType": "administrative.locality",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "on"
          }, {
            "weight": "0.01"
          }
        ]
      }, {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      }, {
        "featureType": "administrative.locality",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "off"
          }, {
            "hue": "#ff0000"
          }, {
            "invert_lightness": true
          }
        ]
      }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#f2f2f2"
          }
        ]
      }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      }, {
        "featureType": "poi.attraction",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on",
            "color": "#aaaaaa"
          }
        ]
      }, {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }, {
        "featureType": "poi.government",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on",
            "color": "#aaaaaa"
          }
        ]
      }, {
        "featureType": "poi.medical",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on",
            "color": "#aaaaaa"
          }
        ]
      }, {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on",
            "color": "#aaaaaa"
          }
        ]
      }, {
        "featureType": "poi.place_of_worship",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on",
            "color": "#aaaaaa"
          }
        ]
      }, {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on",
            "color": "#aaaaaa"
          }
        ]
      }, {
        "featureType": "poi.sports_complex",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on",
            "color": "#aaaaaa"
          }
        ]
      }, {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          }, {
            "lightness": 45
          }
        ]
      }, {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      }, {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }, {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }, {
        "featureType": "transit.line",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#46bcec"
          }, {
            "visibility": "on"
          }
        ]
      }
    ], {name: 'Styled Map'});
    let usermarker;
    const image = {
      url: 'large.png'
    };
    var truckImage = {
      url: 'food-truck.png',
      size: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35),
      setMyLocationEnabled: true
    };
    var myTruck = {
      url: 'my_truck.png',
      size: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35),
      setMyLocationEnabled: true
    };
    let infowindow;
    // Create and move the marker when latLng changes.
    self.autorun(function() {
      if (self.subscriptionsReady()) {
        //  console.log('markers count ', markers.length);
        //  console.log('infowindows count ', infowindows.length);
        if (markers) {
          for (i in markers) {
            const locExist = Locations.findOne({_id: markers[i].id, state: true});
            if (!locExist)
              markers[i].setMap(null);
            }
          }
        let locIds = markers.map(p => p.id);
        //    console.log(locIds);
        Locations.find({
          _id: {
            $nin: locIds
          },
          state: true
        }).forEach((p) => {
          var truck = Trucks.findOne({userId: p.userId});
          if (truck) {
            var marker = new google.maps.Marker({
              title: truck.name,
              //  animation: google.maps.Animation.DROP,
              draggable: p.userId === Meteor.userId(),
              icon: p.userId === Meteor.userId()
                ? myTruck
                : truckImage,
              position: new google.maps.LatLng(p.lat, p.lng),
              map: map.instance,
              id: p._id,
              userId: p.userId
            });

            const img = Images.findOne({owner: p.userId, imageOf: 'Truck'});
            let content = `<div class="card border-0">`;
            if (img) {
              content += `<img class="card-img-top" src="${img.url()}" alt="Truck Pic">`;
            }
            content += `<div class="card-body">
              <h4 class="card-title text-info">${truck.name}</h4>
              <h6 class="card-subtitle mb-1 text-muted"><i class="fas fa-phone-square"></i>
              <a href="tel:${truck.mobile}" class="text-secondary">${truck.mobile}</a></h6>
              <dl class="row font-weight-light small mx-0 w-100">`;
            Items.find({userId: p.userId}).map((i) => {
              content += `<dt class="col-8 pl-0"><i class="fas fa-utensils"></i> : ${i.name}</dt>
                <dd class="col-4 text-right pr-0"><i class="fas fa-rupee-sign"></i> ${i.rate}.00</dd>`;
            });
            content += `</dl><p class="card-text">Enjoy delicious food on the way.</p>
              <hr><em>https://hungertruck.in</em></div></div>`;
            infowindow = new SnazzyInfoWindow({
              marker: marker,
              content: content,
              closeWhenOthersOpen: true,
              edgeOffset: {
                top: 60,
                right: 20,
                bottom: 100,
                left: 20
              },
              maxHeight:500,
              border: false,
              callbacks: {
                beforeOpen: function() {
                  $('.imageSlider').addClass('imageSliderDisplay');
                  self.selectedUserId.set(this._marker.userId);
                  self.showControl.set(false);
                  return true;
                },
                afterClose: function() {
                  $('.imageSlider').removeClass('imageSliderDisplay');
                  map.instance.setCenter(this._marker.getPosition());
                  self.selectedUserId.set(null);
                  self.showControl.set(true);
                }
              }
            });
            infowindows.push(infowindow);
            marker.addListener('dragend', function(event) {
              Meteor.call('locations.update', event.latLng.lat(), event.latLng.lng());
            });
            markers.push(marker);
          }

        });

        const latLng = Geolocation.latLng();
        if (latLng) {
          if (!usermarker) {
            usermarker = new google.maps.Marker({
              position: new google.maps.LatLng(latLng.lat, latLng.lng),
              map: map.instance,
              icon: image
            });
            //  markersArray.push(marker);  The marker already exists, so we'll just change its position.);
          } else {
            usermarker.setPosition(latLng);
          }
          if (self.resetMap.get()) {
            map.instance.setCenter(usermarker.getPosition());
            map.instance.setZoom(ZOOM);
            self.resetMap.set(false);
          }
        }
      }
      markersArray = markers;
    });
    // Center and zoom the map view onto the current position.
    usermarker && map.instance.setCenter(usermarker.getPosition());
    map.instance.setZoom(ZOOM);
    map.instance.setOptions({mapTypeControl: false, streetViewControl: false, clickableIcons: false, fullscreenControl: false});
    //Associate the styled map with the MapTypeId and set it to display.
    map.instance.mapTypes.set('styled_map', styledMapType);
    map.instance.setMapTypeId('styled_map');
  });

});

Template.alltrucks.onRendered(function() {
  if (!localStorage.getItem('introShow')) {
    $('#exampleModalCenter').modal('show');
    localStorage.setItem('introShow', true);
  }
});

Template.alltrucks.helpers({
  hasClass() {
    return Template.instance().hasClass.get();
  },
  showControl() {
    var MobileDetect = require('mobile-detect'),
      md = new MobileDetect(window.navigator.userAgent);
  //  console.log(md.mobile());
    if (md.mobile()) {
      return Template.instance().showControl.get();
    } else {
      return true;
    }

  },
  selectedUserId() {
    return Template.instance().selectedUserId.get();
  },
  images() {
    const selectedUserId = Template.instance().selectedUserId.get();
    if (selectedUserId) {
      return Images.find({owner: selectedUserId});
    } else {
      return Images.find({'metadata.verified': true});
    }
  },
  imagesExist() {
    const selectedUserId = Template.instance().selectedUserId.get();
    if (selectedUserId) {
      return Images.find({owner: selectedUserId}).count() > 0;
    } else {
      return Images.find({'metadata.verified': true}).count() > 0;
    }
  },
  isOnline() {
    const userId = Meteor.userId();
    if (userId) {
      if (Roles.userIsInRole(userId, 'truck')) {
        const online = Locations.findOne({userId: userId, state: true});
        if (online) {
          return true;
        }
      }
    }
    return false;
  },
  mapOptions: function() {
    let latlng = Template.instance().latlng.get();
    if (!latlng) {
      latlng = Geolocation.latLng();
      Template.instance().latlng.set(latlng);
    }
    if (GoogleMaps.loaded()) {
      return {
        center: latlng
          ? new google.maps.LatLng(latlng.lat, latlng.lng)
          : new google.maps.LatLng(17.4635, 78.3473),
        zoom: ZOOM,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
        }
      };
    } else {
      //    console.log('not loaded');
    }

  }
});

Template.alltrucks.events({
  'click .setCenteredMap' (event, templateInstance) {
    templateInstance.resetMap.set(true);
  },
  "click .goOnline" (event, templateInstance) {
    const latLng = templateInstance.latlng.get();
    if (latLng) {
      Meteor.call('locations.insert', latLng.lat, latLng.lng, true, () => {});
    } else {
      console.log('no location found');
    }
  },
  'click .goOffline' (event, templateInstance) {
    Meteor.call('locations.allOffline', () => {})
  },
  "keyup [name='destination-input']" (event, templateInstance) {
    let value = event.target.value.trim();
    if (GoogleMaps.loaded()) {
      let destination_autocomplete = new google.maps.places.Autocomplete(event.target);
      setCountry(destination_autocomplete);
      destination_autocomplete.addListener('place_changed', function() {
        const place = destination_autocomplete.getPlace();
        expandViewportToFitPlace(GoogleMaps.maps.map.instance, place);
        templateInstance.destination_latLng.set({lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), name: place.name, address: place.formatted_address});
        route(templateInstance);
      });
    }
  },
  'click .cover-item' (event, templateInstance) {
    event.preventDefault();
    markersArray.find((e) => {
      if (e.userId === this.owner) {
        google.maps.event.trigger(e, 'click');
        return;
      }
    });
  },
  'click .showHideSlider' (event, templateInstance) {
    $('.imageSlider').toggleClass('imageSliderDisplay');
    templateInstance.hasClass.set($('.imageSlider').hasClass('imageSliderDisplay'));
  }
});
