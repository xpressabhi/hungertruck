// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';

const postSignUp = function postSignUp(userId, info) {
  //  console.log(userId);
  console.log(info);
  if (info.profile && info.profile.type && info.profile.type === 'truck') {
    Roles.addUsersToRoles(userId, ['truck']);
    if(info.email.split('+')[0]==='akmnitt' || info.email.split('+')[0]==='kushwahasatyam20'){
      Roles.addUsersToRoles(userId, ['verified-truck']);
    }
  } else {
    Roles.addUsersToRoles(userId, ['user']);
  }
  const count = Meteor.users.find().count();
  if (count === 1) {
    Roles.addUsersToRoles(userId, ['admin']);
  }
};

AccountsTemplates.configure({postSignUpHook: postSignUp});
