// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Trucks } from '../trucks.js';

Meteor.publish("trucks.one", function(){
  return Trucks.find({userId:this.userId});
});
