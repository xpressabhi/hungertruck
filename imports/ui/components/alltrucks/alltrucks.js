import './alltrucks.html';
import {Locations} from '/imports/api/locations/locations.js';
import {Trucks} from '/imports/api/trucks/trucks.js';
import {Schedules} from '/imports/api/schedules/schedules.js';
import {Items} from '/imports/api/items/items.js';
import {Images} from '/imports/api/images/images.js';
import {getDay, getStyledMapType} from '/imports/ui/helpers/methods.js';
const ZOOM = 14;
let directionsService;
let directionsDisplay;
let markersArray;

const setCountry = function(loc) {
  let country = ['in'];
  loc.setComponentRestrictions({'country': country});
}

const canDisplay = ({start, end, days}) => {
  const dt = new Date();
  if (days.indexOf(getDay(dt.getDay())) > 0) {
    let dtStart = new Date();
    let dtEnd = new Date();
    let [startHours, startMins, startApm] = start.split(' ');
    startHours = startApm === 'PM'
      ? Number(startHours) + 12
      : startHours;
    dtStart.setHours(startHours, startMins, 0);

    let [endHours, endMins, endApm] = end.split(' ');
    endHours = endApm === 'PM'
      ? Number(endHours) + 12
      : endHours
    dtEnd.setHours(endHours, endMins, 0);

    if (endApm === 'AM' && Number(endHours) < 6)
      dtEnd.setDate(dtEnd.getDate() + 1);

    //  console.log(days, dt, dtStart, dtEnd);

    return {display:dt > dtStart && dt < dtEnd, txt: `<br>Open at: ${moment(dtStart).calendar()}<br>Close At: ${moment(dtEnd).calendar()}`};
  }
  return false;
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
    this.subscribe('schedules.all', userIds);
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
  this.selectedImageId = new ReactiveVar();

  const self = this;
  let markers = [];

  GoogleMaps.ready('map', function(map) {
    const SnazzyInfoWindow = require('snazzy-info-window');
    const styledMapType = getStyledMapType();
    let usermarker;
    const image = {
      url: 'large.png'
    };
    const truckImage = {
      url: 'food-truck.png',
      size: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35),
      setMyLocationEnabled: true
    };
    const truckImageOn = {
      url: 'food-truck-on.png',
      size: new google.maps.Size(30, 30),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(30, 30),
      setMyLocationEnabled: true
    };

    const myTruck = {
      url: 'my_truck.png',
      size: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35),
      setMyLocationEnabled: true
    };
    const myTruckOn = {
      url: 'my_truck_on.png',
      size: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35),
      setMyLocationEnabled: true
    };
    const haleemTruck = {
      url: 'haleem.png',
      size: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35),
      setMyLocationEnabled: true
    };

    self.autorun(function() {
      if (self.subscriptionsReady()) {
      //  console.log('markers count ', markers.length);
        markers = markers.filter((marker) => {
          const locExist = Locations.findOne({_id: marker.id, lastLocation: true});
          if (!locExist || locExist.state !== marker.state || locExist.lat !== marker.position.lat()) {
            marker.setMap(null);
          }
          return marker.map;
        });
    //    console.log('markers count ', markers.length);
        const locIds = markers.map(p => p.id);
        //console.log(locIds);
        Locations.find({
          _id: {
            $nin: locIds
          },
          lastLocation: true
        }).forEach((p) => {

          let canShowTruck = false;
          let schText = '';
          Schedules.find({userId: p.userId}).map((sch) => {
            if (!canShowTruck) {
              let res= canDisplay(sch);
              canShowTruck = res.display;
              if(res.txt) schText +=res.txt;
            }
          });
          schText = schText || '';
          const truck = Trucks.findOne({userId: p.userId});
          let image;
          if (truck) {
            if (truck.category && truck.category === 'Haleem') {
              image = haleemTruck;
            } else {
              image = p.userId === Meteor.userId()
                ? p.state
                  ? myTruckOn
                  : myTruck
                : p.state
                  ? truckImageOn
                  : truckImage;
            }
            const marker = new google.maps.Marker({
              title: truck.name,
              //  animation: google.maps.Animation.DROP,
              draggable: p.userId === Meteor.userId(),
              icon: image,
              position: new google.maps.LatLng(p.lat, p.lng),
              map: map.instance,
              id: p._id,
              userId: p.userId,
              state: p.state
            });
            let truckStatus;
            if (canShowTruck) {
              truckStatus = 'Open, you can visit.';
            } else {
              truckStatus = 'Closed, opening soon.';
            }
            const img = Images.findOne({owner: p.userId, imageOf: 'Truck'});
            let content = `<div class='card border-0'>`;
            if (img) {
              content += `<img class='card-img-top' src='${img.url()}' alt='Truck Pic'>`;
            }
            content += `<div class='card-body'>
              <h4 class='card-title text-info'>${truck.name}</h4>`;
            if (truck.mobile) {
              content += `<h6 class='card-subtitle mb-1 text-muted'><i class='fas fa-phone-square'></i>
                <a href='tel:${truck.mobile}' class='text-secondary'>${truck.mobile}</a></h6>`;
            }
            content += `<h6 class='card-subtitle mb-1 text-muted'><i class='fas fa-clock'></i>
              ${truckStatus}</h6>`;
              if(schText) content+=`<span class="small font-weight-light">${schText}<span><hr class="my-2">`;
              content+=`<dl class='row font-weight-light small mx-0 w-100'>`;
            Items.find({userId: p.userId}).map((i) => {
              content += `<dt class='col-8 pl-0'><i class='fas fa-utensils'></i> : ${i.name}</dt>
                <dd class='col-4 text-right pr-0'><i class='fas fa-rupee-sign'></i> ${i.rate}.00</dd>`;
            });
            content += `</dl><p class='card-text'>Enjoy delicious food on the way.</p>
              <hr><em>https://hungertruck.in</em></div></div>`;
            let infowindow = new SnazzyInfoWindow({
              marker: marker,
              content: content,
              closeWhenOthersOpen: true,
              edgeOffset: {
                top: 20,
                right: 20,
                bottom: 150,
                left: 20
              },
              maxHeight: 500,
              border: false,
              callbacks: {
                beforeOpen: function() {
                  $('.imageSlider').addClass('imageSliderDisplay');
                  self.selectedUserId.set(this._marker.userId);
                  self.showControl.set(false);
                  self.hasClass.set(true);
                  return true;
                },
                afterClose: function() {
                  $('.imageSlider').removeClass('imageSliderDisplay');
                  map.instance.setCenter(this._marker.getPosition());
                  self.selectedUserId.set(null);
                  self.showControl.set(true);
                  self.hasClass.set(false);
                }
              }
            });
            //    infowindows.push(infowindow);
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
    const MobileDetect = require('mobile-detect'),
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

  },
  selectedImageId() {
    return Template.instance().selectedImageId.get();
  }
});

Template.alltrucks.events({
  'click .setCenteredMap' (event, templateInstance) {
    templateInstance.resetMap.set(true);
  },
  'click .goOnline' (event, templateInstance) {
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
  'keyup [name="destination-input"]' (event, templateInstance) {
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
    // event.preventDefault();
    // markersArray.find((e) => {
    //   if (e.userId === this.owner) {
    //     google.maps.event.trigger(e, 'click');
    //     return;
    //   }
    // });
    templateInstance.selectedImageId.set(this);
  },
  'click .showHideSlider' (event, templateInstance) {
    $('.imageSlider').toggleClass('imageSliderDisplay');
    templateInstance.hasClass.set($('.imageSlider').hasClass('imageSliderDisplay'));
  },
  'click .goToTruck' (event, templateInstance) {
    const img = templateInstance.selectedImageId.get();
    markersArray.find((e) => {
      if (e.userId === img.owner) {
        google.maps.event.trigger(e, 'click');
        return;
      }
    });

  },
  'click .showDirection'(event, templateInstance) {
    const img = templateInstance.selectedImageId.get();
    markersArray.find((e) => {
      if (e.userId === img.owner) {
        templateInstance.destination_latLng.set({lat: e.position.lat(), lng: e.position.lng(), name: 'place name', address: 'truck address'});
        route(templateInstance);
        google.maps.event.trigger(e, 'click');
        return;
      }
    });
  }
});
