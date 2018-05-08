import './truckdetails.html';
import { Trucks } from '/imports/api/trucks/trucks.js';
Template.truckdetails.onCreated(function(){
  this.editTruckBasic = new ReactiveVar(false);
  this.autorun(() => {
    this.subscribe('trucks.one', Meteor.userId());
  });
});
Template.truckdetails.helpers({
  truck(){
    const truck = Trucks.findOne({userId:Meteor.userId()});
    return truck;
  },
  editTruckBasic(){
    if (Trucks.find({userId:Meteor.userId()}).count() ===0) {
      return true;
    }
    return Template.instance().editTruckBasic.get();
  }
});
Template.truckdetails.events({
  "submit .saveTruckBasic"(event, templateInstance){
    event.preventDefault();
    const name = event.target.truckName.value;
    const mobile = event.target.mobileNumber.value;
    const address = event.target.address.value;
    console.log(name,mobile,address);
    Meteor.call('trucks.insert',name,mobile,address,() => {
templateInstance.editTruckBasic.set(false);
    });
  },
  'click .editTruckBasic'(event, templateInstance){
    templateInstance.editTruckBasic.set(true);
  }
});
