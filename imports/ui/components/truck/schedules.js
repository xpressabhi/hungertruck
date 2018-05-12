import './schedules.html';
import {Schedules} from '/imports/api/schedules/schedules.js';

Template.schedules.onCreated(function() {
  this.addSchedule = new ReactiveVar(false);
  this.days = new ReactiveVar({
    sun: true,
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true
  });
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
  },
  display(days){
    if(days.split(' ').length ===7) return 'Daily';
    else return days.split(' ').join();
  },
  displayTime(tm){
    let sp = tm.split(' ');
    let txt = sp[0];
    if(Number(sp[1])> 0)txt+=':'+sp[1];
    return txt+' '+sp[2];
  },
  activedays(day) {
    const days = Template.instance().days.get();
    if (days[day]) {
      return 'btn-primary';
    } else {
      return 'btn-secondary';
    }
  }
});

Template.schedules.events({
  'click .toggleDay' (event, templateInstance) {
    let day = event.target.innerText.toLowerCase();
    let days = templateInstance.days.get();
    if (days[day])
      days[day] = false;
    else
      days[day] = true;
    templateInstance.days.set(days);
  },
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
    const start = event.target.openhr.value + ' ' + event.target.openmin.value + ' ' + event.target.openap.value;
    const end = event.target.closehr.value + ' ' + event.target.closemin.value + ' ' + event.target.closeap.value;
    const setDays = templateInstance.days.get();
    let days = '';
    if (setDays.sun)
      days += 'Sun ';
    if (setDays.mon)
      days += 'Mon ';
    if (setDays.tue)
      days += 'Tue ';
    if (setDays.wed)
      days += 'Wed ';
    if (setDays.thu)
      days += 'Thu ';
    if (setDays.fri)
      days += 'Fri ';
    if (setDays.sat)
      days += 'Sat ';
    console.log(start, end, days);
    Meteor.call('schedules.insert', start, end, days, () => {
      templateInstance.addSchedule.set(false);
    });
  }
});
