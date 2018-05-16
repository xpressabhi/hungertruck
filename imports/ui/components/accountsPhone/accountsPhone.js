import './accountsPhone.html';

Template.accountsPhone.onCreated(function() {
  this.state = new ReactiveVar('login');
  this.otpSent = new ReactiveVar(false);
  this.loginByEmailPass = new ReactiveVar(false);
  this.loginError = new ReactiveVar();
});

Template.accountsPhone.helpers({
  state() {
    return Template.instance().state.get();
  },
  otpSent() {
    return Template.instance().otpSent.get();
  },
  loginByEmailPass() {
    return Template.instance().loginByEmailPass.get();
  },
  loginError() {
    return Template.instance().loginError.get();
  }

});

Template.accountsPhone.events({
  'click .byEmail' (event, templateInstance) {
    templateInstance.loginByEmailPass.set(true);
  },
  'click .byPhone' (event, templateInstance) {
    templateInstance.loginByEmailPass.set(false);
  },
  'submit .createUserOrLogin' (event, templateInstance) {
    event.preventDefault();
    templateInstance.loginError.set();
    let phone = event.target.phone.value;
    let otpSent = templateInstance.otpSent.get();
    if (otpSent) {
      let otp = event.target.otp.value;
      Meteor.loginWithPhone({
        phone,
        otp
      }, (err) => {
        if (err) 
          templateInstance.loginError.set(err.reason);
        }
      );
    } else {
      Meteor.call('user.setPhoneOtp', phone, (err) => {
        if (!err) 
          templateInstance.otpSent.set(true);
        }
      );
    }
  },
  'submit .sendOtp' (event, templateInstance) {
    event.preventDefault();
    let phone = event.target.phone.value;
    Meteor.call('user.setPhoneOtp', phone, (err) => {
      console.log('user.setPhoneOtp', err);
    });
  },
  'submit .createUser' (event, templateInstance) {
    event.preventDefault();
    let phone = event.target.phone.value;
    Meteor.call('user.sendOtpForLogin', phone, (err, res) => {
      console.log('hip hip');
      console.log(err);
      console.log(res);
    });
  },
  'submit .loginwithphone' (event, templateInstance) {
    event.preventDefault();
    let phone = event.target.phone.value;
    let otp = event.target.otp.value;
    console.log(otp);
    Meteor.loginWithPhone({
      phone,
      otp
    }, (err) => {
      console.log(err);
    });
  }
});
