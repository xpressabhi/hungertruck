// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Schedules } from '../schedules.js';

Meteor.publish("schedules.user", function(){
  return Schedules.find({userId:this.userId});
});

Meteor.publish("schedules.all", function(userIds){
  check(userIds, [String]);
  return Schedules.find({userId:{$in:userIds}});
});
