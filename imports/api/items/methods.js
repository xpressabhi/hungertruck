// Methods related to links

import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Items} from './items.js';

Meteor.methods({
  "items.insert" (name, rate) {
    check(name, String);
    check(rate, String);
    if (this.userId) {
        return Items.insert({name,rate});
    }
    return;
  },
  "items.remove" (id) {
    check(id, String);
    if (this.userId) {
      return Items.remove({_id: id});
    }
    return;
  },
  "items.updateAvailability" (id,flag) {
    check(id, String);
    check(flag, Boolean);
    if (this.userId) {
      return Items.update({_id: id},{$set:{availability:flag}});
    }
    return;
  }
});
