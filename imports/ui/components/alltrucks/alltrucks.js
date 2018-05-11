import './alltrucks.html';
import {Locations} from '/imports/api/locations/locations.js';
import {Trucks} from '/imports/api/trucks/trucks.js';
import {Items} from '/imports/api/items/items.js';
const ZOOM = 16;

Template.alltrucks.onCreated(function() {
  this.autorun(() => {
    this.subscribe('locations.online');
    let userIds = [];
    Locations.find().map((l) => {
      userIds.push(l.userId);
    });
    this.subscribe('trucks.all', userIds);
    this.subscribe('items.all', userIds);
  });
  this.latlng = new ReactiveVar();
  var self = this;
  let markers = [];
  GoogleMaps.ready('map', function(map) {
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
      if (markers) {
        for (i in markers) {
          const locExist = Locations.findOne({_id:markers[i].id,state:true});
          if (!locExist) markers[i].setMap(null);
        }
      }
      let locIds = markers.map(p=>p.id);
      Locations.find({_id:{$nin:locIds},state: true}).forEach((p) => {
        var marker = new google.maps.Marker({
          title: "my truck",
          //  animation: google.maps.Animation.DROP,
          draggable: p.userId === Meteor.userId(),
          icon: p.userId === Meteor.userId()
            ? myTruck
            : truckImage,
          position: new google.maps.LatLng(p.lat, p.lng),
          map: map.instance,
          id:p._id
        });
        marker.addListener('click', function() {
          var truck = Trucks.findOne({userId: p.userId});
          if (truck) {
            var contentString = `<div>  <h5> <i class="fas fa-truck fa-fw"></i>:${truck.name}</h5> <i class="fas fa-mobile fa-fw"></i> : <a href="tel:${truck.mobile}">${truck.mobile}</a>  <hr class="my-1"><dl class="row">`;
            Items.find({userId: p.userId}).map((i) => {
              contentString += `<dt class="col-8"><i class="fas fa-utensils"></i> : ${i.name}</dt> <dd class="col-4"><i class="fas fa-rupee-sign"></i>${i.rate}.00</dd>`;
            });
            contentString += `</dl></div>`;
            if (infowindow) {
              infowindow.close();
            }
            infowindow = new google.maps.InfoWindow({content: contentString});
            infowindow.open(map, marker);
          }
        });

        marker.addListener('dragend', function(event) {
          //  Meteor.call('deleteLocation', Meteor.userId());
          Meteor.call('locations.update', event.latLng.lat(), event.latLng.lng());
        });
        markers.push(marker);
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
      }
    });
    // Center and zoom the map view onto the current position.
    usermarker && map.instance.setCenter(usermarker.getPosition());
    map.instance.setZoom(ZOOM);
    map.instance.setOptions({mapTypeControl: false, streetViewControl: false, clickableIcons: false, fullscreenControl: false});
  });

});

Template.alltrucks.onRendered(function() {

});

Template.alltrucks.helpers({
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
        zoom: 14
      };
    } else {
  //    console.log('not loaded');
    }

  }
});

Template.alltrucks.events({
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
  }
});
