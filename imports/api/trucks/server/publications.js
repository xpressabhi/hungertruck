// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Trucks } from '../trucks.js';

Meteor.publish("trucks.one", function(){
  return Trucks.find({userId:this.userId});
});

Meteor.publish("trucks.all", function(userIds){
  check(userIds, [String]);
  return Trucks.find({userId:{$in:userIds},category:{$ne:'Haleem'}});
});
