import './dashboard.html';

Template.dashboard.onCreated(function(){

});
Template.dashboard.helpers({
  helper: function(){

  }
});

Template.dashboard.events({
  "click .setLastLocation"(event, templateInstance){
Meteor.call('locations.updatelastLocation');
  }
});
