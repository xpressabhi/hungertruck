import './userprofile.html';
import './changePwd.js';
import './../../helpers/helpers.js';

import R from 'ramda';

Template.userprofile.onCreated(function(){

});

Template.userprofile.helpers({
  user(){
    console.log(Meteor.user());
    return Meteor.user();
  }
});

Template.userprofile.events({
  "event": function(event, templateInstance){

  }
});
