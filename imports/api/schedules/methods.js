// Methods related to links

import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Schedules} from './schedules.js';

Meteor.methods({
  "schedules.insert" (start, end, days) {
    check(start, String);
    check(end, String);
    check(days, String);
    if (this.userId) {
        return Schedules.insert({start,end,days});
    }
    return;
  },
  "schedules.remove" (id) {
    check(id, String);
    if (this.userId) {
      return Schedules.remove({_id: id});
    }
    return;
  }
});
