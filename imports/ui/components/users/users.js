import {Meteor} from 'meteor/meteor';
import './users.html';
import './../../helpers/helpers.js';
import R from 'ramda';

Template.users.onCreated(function() {
  // counter starts at 0
  this.searchQuery = new ReactiveVar('');
  this.searching = new ReactiveVar(false);
  this.selectedId = new ReactiveVar();
  this.addPhoneError = new ReactiveVar();
  this.addPhone = new ReactiveVar(false);
  this.autorun(() => {
    this.subscribe("users.search", this.searchQuery.get(), () => {
      setTimeout(() => {
        this.searching.set(false);
      }, 300);
    });
  });

});

Template.users.helpers({
  selectedId(){
    return Template.instance().selectedId.get();
  },
  userSelected(){
    return Template.instance().selectedId.get() === this._id;
  },
  addPhone() {
    return Template.instance().addPhone.get();
  },
  addPhoneError() {
    return Template.instance().addPhoneError.get();
  },
  users() {
    return Meteor.users.find({}, {
      sort: {
        createdAt: -1
      }
    });
  },
  useremail() {
    return this.emails && this.emails[0].address;
  },
  isAdmin() {
    return Roles.userIsInRole(this._id, 'admin');
  },
  searching() {
    return Template.instance().searching.get();
  }
});

Template.users.events({
  'click .addPhoneNumber' (event, templateInstance) {
    templateInstance.selectedId.set(this._id);
    templateInstance.addPhone.set(true);
  },
  'click .deleteUser' (event, templateInstance) {
    Meteor.call('users.remove', this._id, (e, r) => {
      if (e)
        console.log(e);
      if (r)
        console.log(r);
      }
    );
  },
  'keyup input[name="users"]' (event, templateInstance) {
    const txt = ev.target.value.trim();
    t.searchQuery.set(txt);
    t.searching.set(true);
  },
  'click .toggleTruck' (event, templateInstance) {
    Meteor.call('user.toggleRole', this._id, 'truck');
  },
  'click .toggleUser' (event, templateInstance) {
    Meteor.call('user.toggleRole', this._id, 'user');
  },
  'click .toggleVerifiedTruck' (event, templateInstance) {
    Meteor.call('user.toggleRole', this._id, 'verified-truck', () => {});
    Meteor.call('locations.allOffline', this._id, () => {});
  },
  'click .toggleEditor'(event, templateInstance) {
    Meteor.call('user.toggleRole', this._id, 'editor', () => {});
  },
  'click .setDefaultPass' (event, templateInstance) {
    Meteor.call('user.setDefaultPass', this._id, () => {});
  },
  'submit .addPhone' (event, templateInstance) {
    event.preventDefault();
    let phone = event.target.phone.value;
    Meteor.call('user.addPhone', this._id, phone, (err, res) => {
      console.log(err);
      err && templateInstance.addPhoneError.set(err);
      if(!err){
        templateInstance.addPhoneError.set();
        templateInstance.selectedId.set();
        templateInstance.addPhone.set(false);
      }
    });
  },
  'click .deletePhone' (event, templateInstance) {
    let userId = Template.instance().selectedId.get();
    if (userId) {
      Meteor.call('user.deletePhone', userId, this.number, (err, res) => {
        err && console.log(err);
        }
      );
    }
  },
  'click .cancelAddPhone'(event, templateInstance) {
    templateInstance.addPhoneError.set();
    templateInstance.selectedId.set();
    templateInstance.addPhone.set(false);
  }

});
