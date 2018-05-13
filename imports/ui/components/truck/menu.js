import './menu.html';
import {Items} from '/imports/api/items/items.js';

Template.menu.onCreated(function() {
  this.addItem = new ReactiveVar(false);
  this.itemId = new ReactiveVar();
  this.autorun(() => {
    this.subscribe('items.user');
  })
});
Template.menu.helpers({
  addItem() {
    return Template.instance().addItem.get();
  },
  items() {
    return Items.find({},{sort:{createdAt:-1}});
  },
  itemId() {
    return Template.instance().itemId.get();
  },
  item() {
    const itemId = Template.instance().itemId.get();
    return Items.findOne(itemId);
  }
});

Template.menu.events({
  'click .setAddTrue' (event, templateInstance) {
    templateInstance.addItem.set(true);
  },
  'click .cancelAdd' (event, templateInstance) {
    templateInstance.addItem.set(false);
    templateInstance.itemId.set(null);
  },
  'click .deteleItem' (event, templateInstance) {
    Meteor.call('items.remove', this._id, () => {});
  },
  'click .editItem' (event, templateInstance) {
    templateInstance.addItem.set(true);
    templateInstance.itemId.set(this._id);
  },
  "submit .addItem" (event, templateInstance) {
    event.preventDefault();
    const name = event.target.name.value;
    const rate = event.target.rate.value;
    const itemId = templateInstance.itemId.get();
    if (itemId) {
      Meteor.call('items.update',itemId, name, rate, () => {
        $(event.target.name).focus();
        event.target.name.value='';
        event.target.rate.value='';
      });
      templateInstance.itemId.set(null);
    }else {
      Meteor.call('items.insert', name, rate, () => {
        $(event.target.name).focus();
        event.target.name.value='';
        event.target.rate.value='';
      });
    }
  },
  'click .saveClose'(event, templateInstance) {
     $('form.addItem').submit();
     templateInstance.addItem.set(false);
  },
  'click .toggleFav' (event, templateInstance) {
    console.log('hhhh');
    Meteor.call('items.toggleFav', this._id, !this.fav, () => {});
  }
});
