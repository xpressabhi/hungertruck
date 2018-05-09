// Methods related to links

import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Locations} from './locations.js';

Meteor.methods({
  "locations.insert" (lat, lng, state) {
    check(lat, Number);
    check(lng, Number);
    check(state, Boolean);
    if (this.userId) {
         Locations.update({userId:this.userId,state:true},{$set:{state:false}},{multi:true});
        return Locations.insert({lat,lng,state});
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
  "locations.allOffline"(){
    if (this.userId) {
      return Locations.update({userId:this.userId,state:true},{$set:{state:false}},{multi:true});
    }
  },
  "locations.update"(lat, lng){
    check(lat, Number);
    check(lng, Number);
    if (this.userId) {
      return Locations.update({userId:this.userId,state:true},{$set:{lat,lng}});
    }
  }
});
