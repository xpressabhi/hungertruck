import './truckdetails.html';
import './images.js';
import {Trucks} from '/imports/api/trucks/trucks.js';

Template.truckdetails.onCreated(function() {
  this.editTruckBasic = new ReactiveVar(false);
  this.autorun(() => {
    this.subscribe('trucks.one', Meteor.userId());
  });
});
Template.truckdetails.helpers({
  truck() {
    return Trucks.findOne({userId: Meteor.userId()});
  },
  editTruckBasic() {
    if (Trucks.find({userId: Meteor.userId()}).count() === 0) {
      return true;
    }
    return Template.instance().editTruckBasic.get();
  }
});
Template.truckdetails.events({
  "submit .saveTruckBasic" (event, templateInstance) {
    event.preventDefault();
    const name = event.target.truckName.value;
    const mobile = event.target.mobileNumber.value.replace(/^0+/, '');
    const address = event.target.address.value;
    Meteor.call('trucks.insert', name, mobile, address, () => {
      templateInstance.editTruckBasic.set(false);
    });
  },
  'click .editTruckBasic' (event, templateInstance) {
    templateInstance.editTruckBasic.set(true);
  },
  'click .cancelEdit' (event, templateInstance) {
    templateInstance.editTruckBasic.set(false);
  }
});
