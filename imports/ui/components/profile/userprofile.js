import './userprofile.html';
import './changePwd.js';
import './../../helpers/helpers.js';

import R from 'ramda';

Template.userprofile.onCreated(function() {
  this.otpSent = new ReactiveVar(false);
  this.addError = new ReactiveVar();
  this.autorun(() => {
    this.subscribe('user.self');
  });
});

Template.userprofile.helpers({
  otpSent() {
    return Template.instance().otpSent.get();
  },
  user() {
    console.log(Meteor.user());
    return Meteor.user();
  },
  phoneNum(num) {
    //  console.log(num);
    return num.slice(3);
  },
  addError() {
    return Template.instance().addError.get();
  }
});

Template.userprofile.events({
  "event": function(event, templateInstance) {},
  'click .deletePhone' (event, templateInstance) {
    Meteor.call('user.deletePhoneByUser', this.number, () => {});
  },
  'submit .addPhone' (event, templateInstance) {
    event.preventDefault();
    templateInstance.addError.set();
    let phone = event.target.phone.value;
    let otpSent = templateInstance.otpSent.get();
    if (otpSent) {
      let otp = event.target.otp.value;
      Meteor.call('user.addPhoneByUser', phone, otp, (err) => {
        if (err)
          templateInstance.addError.set(err.reason);
        if (!err)
          event.target.phone.value = '';
          event.target.otp.value = '';
          templateInstance.otpSent.set(false);
        }
      );
    } else {
      Meteor.call('user.setPhoneOtp', phone, (err) => {
        if (!err)
          templateInstance.otpSent.set(true);
        }
      );
    }

  }
});
