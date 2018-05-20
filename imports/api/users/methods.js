import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import {HTTP} from 'meteor/http';
import {Trucks} from '../trucks/trucks.js';
var msg91 = require("msg91")(Meteor.settings.msg91, "HNGRTK", "4");
function sendOtpViaSms(phone, otp) {
  const msg = `Your verification code is ${otp} ,  https://hungertruck.in`;
  console.log(msg);
  // msg91.send(phone, msg, function(err, response) {
  //   console.log(err);
  //   console.log(response);
  // });
}
Meteor.methods({
  "users.remove": function(id) {
    check(id, String);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
      if (Roles.userIsInRole(id, ['admin'])) {
        return 'Admin user cannot be deleted.';
      } else {
        const truckExist = Trucks.find({userId: id}).count() === 0;
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
  },
  'user.setPhoneOtp' (to) {
    check(to, String);
    let otp = Math.round(Random.fraction() * 9000 + 1000);
    otp = otp.toString();
    sendOtpViaSms(to, otp);
    Accounts.setPhoneOtp(to, otp);
  },
  'user.addPhone' (id, phone) {
    check(id, String);
    check(phone, String);
    if (Roles.userIsInRole(this.userId, 'admin')) {
      Accounts.addPhone(id, phone, true);
    }
  },
  'user.deletePhone' (id,phone) {
    check(phone, String);
    check(id, String);
    if (Roles.userIsInRole(this.userId, 'admin')) {
      Accounts.removePhone(id, phone);
    }
  },
  'user.deletePhoneByUser' (phone) {
    check(phone, String);
    Accounts.removePhone(this.userId, phone);
  },
  'user.addPhoneByUser' (phone, otp) {
    check(phone, String);
    check(otp, String);
    phone = Accounts.verifyPhoneOtp(phone, otp);
    Accounts.addPhone(this.userId, phone, true);
  }
});
