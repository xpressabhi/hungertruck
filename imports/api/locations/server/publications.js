// All links-related publications

import {Meteor} from 'meteor/meteor';
import {Locations} from '../locations.js';

Meteor.publish("locations.user", function() {
  return Locations.find({userId: this.userId});
});

Meteor.publish("locations.online", function() {
  let userIds = Meteor.users.find({roles: 'verified-truck'}).map(u => u._id);
  return Locations.find({
    userId: {
      $in: userIds
    },
    lastLocation: true
  });
});
