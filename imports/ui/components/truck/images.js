import './images.html';
import {Images} from '/imports/api/images/images.js';
const IMG_SIZE_MAX = 4 * 1024 * 1024; // 4 MB

Template.images.onCreated(function() {
  this.processing = new ReactiveVar(false);
  this.error = new ReactiveVar();
  this.success = new ReactiveVar();
  this.uploadType = new ReactiveVar("Truck");
  this.autorun(() => {
    this.subscribe('allImages');
  });
});

Template.images.helpers({
  images() {
    return Images.find({}, {
      sort: {
        uploadedAt: -1
      }
    });
  },
  processing() {
    return Template.instance().processing.get();
  },
  error() {
    return Template.instance().error.get();
  },
  success() {
    return Template.instance().success.get();
  },
  uploadType(uploadType) {
    return uploadType === Template.instance().uploadType.get();
  },
  setUploadType() {
    return Template.instance().uploadType.get();
  },
  log(abc){
    console.log(abc);
  },
  imageBadge(type){
    if(type==='Truck'){
      return 'badge-primary';
    }else if(type==='Menu'){
      return 'badge-info';
    }else if(type==='Item'){
      return 'badge-success';
    }
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
    templateInstance.success.set(null);
    const files = event.currentTarget.files;
    let file;
    const filetypes = ['image/jpg', 'image/jpeg', 'image/png'];
    for (var i = 0, ln = files.length; i < ln && templateInstance.processing.get(); i++) {
      file = files[i];
      if (file && file.size < IMG_SIZE_MAX && filetypes.includes(file.type)) {
        let fsFile = new FS.File(file);
        fsFile.owner = Meteor.userId();
        console.log(templateInstance.uploadType.get());
        fsFile.imageOf = templateInstance.uploadType.get();
        Images.insert(fsFile, function(err, fileObj) {
          templateInstance.processing.set(false);
          templateInstance.success.set('1 image uploaded, you may upload more.');
          // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        });
      }

      if (!file) {
        templateInstance.error.set('No file selected, try again.');
        templateInstance.processing.set(false);
      }
      if (file.size > IMG_SIZE_MAX) {
        templateInstance.error.set('Try upoading smaller image.');
        templateInstance.processing.set(false);
      } else if (!filetypes.includes(file.type)) {
        templateInstance.error.set('Selected filetype is not supported image.');
        templateInstance.processing.set(false);
      }
    }
  }
});
