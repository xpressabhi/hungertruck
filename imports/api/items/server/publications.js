// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Items } from '../items.js';

Meteor.publish("items.user", function(){
  return Items.find({userId:this.userId});
});

Meteor.publish("items.all", function(userIds){
  check(userIds, [String]);
  return Items.find({userId:{$in:userIds}});
});
