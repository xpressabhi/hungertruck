// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Schedules } from '../schedules.js';

Meteor.publish("schedules.user", function(){
  return Schedules.find({userId:this.userId});
});
