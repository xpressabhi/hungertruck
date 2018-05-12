// Import client startup through a single index entry point

import './routes.js';

Meteor.startup(function() {
  GoogleMaps.load({
    v: '3',
    key: Meteor.settings.public.googlemap_api,
    libraries: 'geometry,places'
  });
});
