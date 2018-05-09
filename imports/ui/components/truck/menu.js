import './menu.html';
import {Items} from '/imports/api/items/items.js';

Template.menu.onCreated(function() {
  this.addItem = new ReactiveVar(false);
  this.autorun(() => {
    this.subscribe('items.user');
  })
});
Template.menu.helpers({
  addItem() {
    return Template.instance().addItem.get();
  },
  items() {
    return Items.find();
  }
});

Template.menu.events({
  'click .setAddTrue' (event, templateInstance) {
    templateInstance.addItem.set(true);
  },
  'click .cancelAdd' (event, templateInstance) {
    templateInstance.addItem.set(false);
  },
  'click .deteleItem' (event, templateInstance) {
    Meteor.call('items.remove', this._id, () => {});
  },
  "submit .addItem" (event, templateInstance) {
    event.preventDefault();
    const name = event.target.name.value;
    const rate = event.target.rate.value;
    Meteor.call('items.insert', name, rate, () => {
      templateInstance.addItem.set(false);
    });
  }
});
