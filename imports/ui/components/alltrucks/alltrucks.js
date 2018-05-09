import './alltrucks.html';
import {Locations} from '/imports/api/locations/locations.js';
import {Trucks} from '/imports/api/trucks/trucks.js';

var markers = [];

Template.alltrucks.onCreated(function(){
  this.autorun(() => {
    this.subscribe('locations.online');
    let userIds = [];
    Locations.find().map((l) => {
      userIds.push(l.userId);
    });
    this.subscribe('trucks.all',userIds);
  });
  this.latlng = new ReactiveVar();
  var self=this;
  GoogleMaps.ready('map', function (map) {
    console.log(map);
    let usermarker;
    const image = {
      url: 'blue-dot.png',
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
    self.autorun(function () {
      if (markers) {
        for (i in markers) {
          markers[i].setMap(null);
        }
      }
      Locations.find({
          state: true
        }).forEach((p) => {
          var marker = new google.maps.Marker({
            title: "my truck",
          //  animation: google.maps.Animation.DROP,
            draggable: p.userId === Meteor.userId(),
            icon: p.userId === Meteor.userId() ? myTruck: truckImage,
            position: new google.maps.LatLng(p.lat, p.lng),
            map: map.instance,
          });

          marker.addListener('click', function() {
            console.log('clicking icon');
            console.log(Trucks.find().count());
            var truck = Trucks.findOne({
              userId: p.userId
            });
            console.log(truck);
            console.log('clicking icon');
            if (truck) {
              var contentString = `<div>  <b> This is my truck </b> ${truck.name} ${p.userId}</div>`;
              if (infowindow) {
                infowindow.close();
              }
              infowindow = new google.maps.InfoWindow({
                content: contentString
              });
              infowindow.open(map, marker);
            }
          });

          marker.addListener('dragend', function(event) {
          //  Meteor.call('deleteLocation', Meteor.userId());
          Meteor.call('locations.update', event.latLng.lat(), event.latLng.lng());
          console.log('dragging');
          });
          markers.push(marker);
        });

        const latLng = Geolocation.latLng();
        console.log(latLng);
        if (!latLng)
          return;

        // If the marker doesn't yet exist, create it.
        if (!usermarker) {
          usermarker = new google.maps.Marker({
            position: new google.maps.LatLng(latLng.lat, latLng.lng),
            map: map.instance,
            icon: image
          });
        //  markersArray.push(marker); // The marker already exists, so we'll just change its position.);
        } else {
          usermarker.setPosition(latLng);
        }

        // Center and zoom the map view onto the current position.
        map.instance.setCenter(usermarker.getPosition());
        map.instance.setZoom(14);
        map.instance.setClickableIcons(false);
    });
  });
});

Template.alltrucks.onRendered(function(){
});

Template.alltrucks.helpers({
  showMap(){
    const userId= Meteor.userId();
    if (userId) {
      if (Roles.userIsInRole(userId, 'truck')) {
        const online = Locations.findOne({userId:userId, state:true});
        if (online) {
          return true;
        }else {
          let latlng = Template.instance().latlng.get();
          if (!latlng) {
            latlng = Geolocation.latLng();
            Template.instance().latlng.set(latlng);
          }
          return false;
        }
      }else {
      return true;
      }
    }else {
    return true;
    }

  },
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(17.4591369,78.3442305),
        zoom: 14
      };
    } else {
      console.log('not loaded');
    }

  }
});

Template.alltrucks.events({
  "click .goOnline" (event, templateInstance) {
    const latLng = templateInstance.latlng.get();
    if (latLng) {
      Meteor.call('locations.insert', latLng.lat, latLng.lng, true, () => {});
      location.reload();
    } else {
      console.log('no location found');
    }
  },
  'click .goOffline'(event, templateInstance) {
    Meteor.call('locations.allOffline',() => {

    })
  }
});
