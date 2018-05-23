// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.
const myLogoutFunc = function () {
  FlowRouter.go('/login');
}

const myLoginRedirectFunc = function () {
  const user = Meteor.user();
  if (user) {
    if (Roles.userIsInRole(user, 'truck')) {
      FlowRouter.go('/mytruck');
    }else {
      FlowRouter.go('/');
    }
  }
}

AccountsTemplates.configure({
  onLogoutHook: myLogoutFunc,
});


AccountsTemplates.addField({
  _id: 'type',
  type: 'hidden'
});

AccountsTemplates.configureRoute('signIn', {
  layoutType: 'blaze',
  name: 'signin',
  path: '/login',
  template: 'accountsPhone',
  layoutTemplate: 'App_body',
  layoutRegions: {nav: 'nav',footer:'footer'},
  contentRegion: 'main',
  redirect: '/'
});
AccountsTemplates.configureRoute('signUp', {
  layoutType: 'blaze',
  name: 'signup',
  path: '/join',
  template: 'accountsPhone',
  layoutTemplate: 'App_body',
  layoutRegions: {nav: 'nav',footer:'footer'},
  contentRegion: 'main',
  redirect: myLoginRedirectFunc
});

// AccountsTemplates.configureRoute('forgotPwd', {
//   layoutType: 'blaze',
//   //  name: 'signup',
//   //  path: '/sign-up',
//   template: 'fullPageAtForm',
//   layoutTemplate: 'App_body',
//   layoutRegions: {nav: 'nav',footer:'footer'},
//   contentRegion: 'main'
// });
//
// AccountsTemplates.configureRoute('resetPwd', {
//   name: 'resetPwd',
//   path: '/reset-password',
//   layoutType: 'blaze',
//   template: 'fullPageAtForm',
//   layoutTemplate: 'App_body',
//   layoutRegions: {nav: 'nav',footer:'footer'},
//   contentRegion: 'main'
// });
//
// AccountsTemplates.configureRoute('verifyEmail', {
//   name: 'verifyEmail',
//   path: '/verify-email',
//   layoutType: 'blaze',
//   template: 'fullPageAtForm',
//   layoutTemplate: 'App_body',
//   layoutRegions: {nav: 'nav',footer:'footer'},
//   contentRegion: 'main'
// });
