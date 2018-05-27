// Methods related to links

import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Locations} from './locations.js';
import {Schedules} from '/imports/api/schedules/schedules.js';

Meteor.methods({
  "locations.insert" (lat, lng, state) {
    check(lat, Number);
    check(lng, Number);
    check(state, Boolean);
    if (this.userId) {
      Locations.update({
        userId: this.userId,
        state: true
      }, {
        $set: {
          state: false
        }
      }, {multi: true});
      Locations.update({
        userId: this.userId,
        lastLocation: true
      }, {
        $set: {
          lastLocation: false
        }
      }, {multi: true});
      return Locations.insert({lat, lng, state});
    }
    return;
  },
  "locations.remove" (id) {
    check(id, String);
    if (this.userId) {
      return Locations.remove({_id: id});
    }
    return;
  },
  "locations.allOffline" (userId) {
    check(userId, Match.OneOf(String, null, undefined));
    userId = userId || this.userId;
    return Locations.update({
      userId: userId,
      state: true
    }, {
      $set: {
        state: false
      }
    }, {multi: true});
  },
  "locations.update" (id, lat, lng) {
    check(lat, Number);
    check(lng, Number);
    check(id, String);
    if (Roles.userIsInRole(this.userId, 'editor')) {
      return Locations.update(id, {
        $set: {
          lat,
          lng
        }
      });
    } else {
      const loc = Locations.findOne(id);
      if (this.userId === loc.userId) {
        return Locations.update(id, {
          $set: {
            lat,
            lng
          }
        });
      }
    }
  },
  "locations.updatelastLocation" () {
    Meteor.users.find().map((u) => {
      console.log('processing for ', u._id);
      Locations.update({
        userId: u._id
      }, {
        $set: {
          lastLocation: false
        }
      }, {multi: true});
      Locations.find({
        userId: u._id
      }, {
        sort: {
          createdAt: -1
        },
        limit: 1
      }).map((l) => {
        Locations.update({
          _id: l._id
        }, {
          $set: {
            lastLocation: true
          }
        });
      });
    });
  },
  "locations.setOfflineAuto" () {
    Locations.find({state: true}).map((l) => {
      Schedules.find({userId: l.userId}).map((sch) => {
        const dt = new Date();
        let dtEnd = new Date();
        let [endHours, endMins, endApm] = sch.end.split(' ');
        endHours = endApm === 'PM'
          ? Number(endHours) + 12
          : endHours
        dtEnd.setHours(endHours, endMins, 0);
        if ((dt - dtEnd) > 0)
          Locations.update({
            userId: sch.userId,
            state: true
          }, {
            $set: {
              state: false
            }
          }, {multi: true});

        }
      )
    });
  }
});
