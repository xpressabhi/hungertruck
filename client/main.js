// Client entry point, imports all client code
import '/imports/startup/client';
import '/imports/startup/both';
import '/node_modules/bootstrap/dist/js/bootstrap.min.js';

$().ready(() => {
  $('.col-md-offset-3').addClass('offset-md-3');
  $('.btn-default').addClass('btn-secondary');
});