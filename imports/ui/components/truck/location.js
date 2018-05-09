import './location.html';
import {Locations} from '/imports/api/locations/locations.js';

Template.location.onCreated(function() {
  this.latlng = new ReactiveVar();
  this.autorun(() => {
    this.subscribe('locations.user');
  })

});

Template.location.helpers({
  location() {
    return Locations.find();
  },
  latlng() {
    let latlng = Template.instance().latlng.get();
    if (!latlng) {
      latlng = Geolocation.latLng();
      Template.instance().latlng.set(latlng);
    }
    return latlng;
  }
});
Template.location.events({
  "click .getLocation" (event, templateInstance) {
    const latLng = templateInstance.latlng.get();
    if (latLng) {
      Meteor.call('locations.insert', latLng.lat, latLng.lng, false, () => {});
    } else {
      console.log('no location found');
    }
  }
});
