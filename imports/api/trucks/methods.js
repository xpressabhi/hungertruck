// Methods related to links

import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Trucks} from './trucks.js';

Meteor.methods({
  "trucks.insert" (name, mobile, address, category) {
    check(name, String);
    check(mobile, String);
    check(address, String);
    check(address, String);
    if (this.userId) {
        return Trucks.upsert({userId:this.userId},{$set:{name,mobile,address,category}});
    }
    return;
  },
  "trucks.remove" (id) {
    check(id, String);
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Trucks.remove({_id: id});
    }
    return;
  }
});
