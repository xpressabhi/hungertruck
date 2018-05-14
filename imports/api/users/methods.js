import {Meteor} from 'meteor/meteor';
import {Trucks} from '../trucks/trucks.js';
Meteor.methods({
  "users.remove": function(id) {
    check(id, String);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      if (Roles.userIsInRole(id, ['admin'])) {
        return 'Admin user cannot be deleted.';
      } else {
        const truckExist = Trucks.find({userId:id}).count() === 0;
        truckExist && Meteor.users.remove({_id: id});
      }
    }
  },
  'user.toggleRole' (id, role) {
    check(id, String);
    check(role, String);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      if (Roles.userIsInRole(id, role)) {
        Roles.removeUsersFromRoles(id, role);
      } else {
        Roles.addUsersToRoles(id, role);
      }
    }
  },
  'user.setDefaultPass' (id) {
    check(id, String);
    if (Roles.userIsInRole(this.userId, 'admin')) {
      Accounts.setPassword(id, 'truck123');
    }
  }
});
