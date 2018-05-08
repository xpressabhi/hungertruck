import './schedules.html';
import {Schedules} from '/imports/api/schedules/schedules.js';

Template.schedules.onCreated(function() {
  this.addSchedule = new ReactiveVar(false);
  this.autorun(() => {
    this.subscribe('schedules.user');
  })
});
Template.schedules.helpers({
  addSchedule() {
    return Template.instance().addSchedule.get();
  },
  schedules() {
    return Schedules.find();
  }
});

Template.schedules.events({
  'click .setAddTrue' (event, templateInstance) {
    templateInstance.addSchedule.set(true);
  },
  'click .cancelAdd' (event, templateInstance) {
    templateInstance.addSchedule.set(false);
  },
  'click .deteleSchedule' (event, templateInstance) {
    Meteor.call('schedules.remove', this._id, () => {});
  },
  "submit .addSchedule" (event, templateInstance) {
    event.preventDefault();
    const start = event.target.start.value;
    const end = event.target.end.value;
    const days = event.target.days.value;
    Meteor.call('schedules.insert', start, end, days, () => {
      templateInstance.addSchedule.set(false);
    });
  }
});
