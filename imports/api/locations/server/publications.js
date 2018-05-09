// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Locations } from '../locations.js';

Meteor.publish("locations.user", function(){
  return Locations.find({userId:this.userId});
});

Meteor.publish("locations.online", function(){
  return Locations.find({state:true});
});
