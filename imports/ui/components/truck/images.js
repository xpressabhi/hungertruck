import './images.html';
import {Images} from '/imports/api/images/images.js';

Template.images.onCreated(function(){
  this.processing = new ReactiveVar(false);
  this.error = new ReactiveVar();
  this.uploadType = new ReactiveVar("Truck");
  this.autorun(() => {
    this.subscribe('allImages');
  });
});

Template.images.helpers({
  images(){
    return Images.find({},{sort:{uploadedAt:-1}});
  },
  processing() {
    return Template.instance().processing.get();
  },
  error() {
    return Template.instance().error.get();
  },
  uploadType(uploadType) {
    return uploadType === Template.instance().uploadType.get();
  },
  setUploadType(){
    return Template.instance().uploadType.get();
  }
});

Template.images.events({
  'click .setTruck' (event, templateInstance) {
    templateInstance.uploadType.set("Truck");
  },
  'click .setMenu' (event, templateInstance) {
    templateInstance.uploadType.set("Menu");
  },
  'click .setItem' (event, templateInstance) {
    templateInstance.uploadType.set("Item");
  },
  "change #uploadImages" (event, templateInstance) {
    templateInstance.error.set(null);
    templateInstance.processing.set(true);
    const file = event.currentTarget.files[0];
    const filetypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if (file && file.size < 2 * 1024 * 1024 && filetypes.includes(file.type)) {
      let fsFile = new FS.File(file);
      fsFile.owner = Meteor.userId();
      fsFile.imageOf = templateInstance.uploadType.get();
      Images.insert(fsFile, function(err, fileObj) {
        templateInstance.processing.set(false);
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });
    }
    if (!file) {
      templateInstance.error.set('No file selected, refresh page and try again.');
      templateInstance.processing.set(false);
    }
    if (file.size > 2 * 1024 * 1024) {
      templateInstance.error.set('Image size must be less then 1MB.');
      templateInstance.processing.set(false);
    } else if (!filetypes.includes(file.type)) {
      templateInstance.error.set('Selected file is not supported image.');
      templateInstance.processing.set(false);
    }
  }
});
