// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.

AccountsTemplates.addField({
  _id: 'type',
  type: 'hidden'
});

AccountsTemplates.configure({
//  onLogoutHook: myLogoutFunc,
  confirmPassword: true,
  continuousValidation: true,
//  showForgotPasswordLink: true,
//  showResendVerificationEmailLink: true,
  showLabels: true,
  showPlaceholders: true,
//  sendVerificationEmail: true
});

AccountsTemplates.configure({
  //defaultTemplate: 'Auth_page',
  //defaultLayout: 'App_body',
  //defaultContentRegion: 'main',
  //defaultLayoutRegions: {nav: 'nav',footer:'footer'}
});

AccountsTemplates.configureRoute('signIn', {
  layoutType: 'blaze',
  name: 'signin',
  path: '/login',
  template: 'fullPageAtForm',
  layoutTemplate: 'App_body',
  layoutRegions: {nav: 'nav',footer:'footer'},
  contentRegion: 'main',
//  redirect: myLoginRedirectFunc
});
AccountsTemplates.configureRoute('signUp', {
  layoutType: 'blaze',
  name: 'signup',
  path: '/join',
  template: 'fullPageAtForm',
  layoutTemplate: 'App_body',
  layoutRegions: {nav: 'nav',footer:'footer'},
  contentRegion: 'main',
//  redirect: myLoginRedirectFunc
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
