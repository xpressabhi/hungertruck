import {Images} from './images.js';

if (Meteor.isServer) {
  Images.allow({
    'insert': function() {
      // add custom authentication code here
      return true;
    },
    'update': function() {
      // add custom authentication code here
      return true;
    },
    'remove': function(userId, fileObj) {
      //    console.log(fileObj);
      //    console.log(userId);
      if (userId === fileObj.owner || Roles.userIsInRole(userId, 'admin')) {
        return true;
      }
      return false;
    },
    download: function(userId, fileObj) {
      return true;
    }
  });
}
