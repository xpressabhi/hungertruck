import './images.html';
import {Images} from '/imports/api/images/images.js';
const IMG_SIZE_MAX = 8 * 1024 * 1024; // 4 MB

Template.images.onCreated(function() {
  this.processing = new ReactiveVar(false);
  this.error = new ReactiveVar();
  this.success = new ReactiveVar();
  this.uploadType = new ReactiveVar();
  this.autorun(() => {
    this.subscribe('allImages');
  });
});

Template.images.helpers({
  images() {
    const uploadType = Template.instance().uploadType.get();
    if (uploadType) {
      return Images.find({imageOf:uploadType}, {
        sort: {
          uploadedAt: -1
        }
      });
    }else {
      return Images.find({}, {
        sort: {
          uploadedAt: -1
        }
      });
    }
  },
  imagesCount(){
    const uploadType = Template.instance().uploadType.get();
    if (uploadType) {
      return Images.find({imageOf:uploadType}).count();
    }else {
      return Images.find({}).count();
    }
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
  'click .verifyImage'(event, templateInstance) {
    Meteor.call('images.verifyFlag',this._id, true, () => {

    });
  },
  'click .unverifyImage'(event, templateInstance) {
    console.log('unv');
    Meteor.call('images.verifyFlag',this._id, false, () => {
    });
  },
  'click .setTruck' (event, templateInstance) {
    templateInstance.uploadType.set("Truck");
  },
  'click .setMenu' (event, templateInstance) {
    templateInstance.uploadType.set("Menu");
  },
  'click .setItem' (event, templateInstance) {
    templateInstance.uploadType.set("Item");
  },
  'click .setNone' (event, templateInstance) {
    templateInstance.uploadType.set();
  },
  "change #uploadImages" (event, templateInstance) {
    const files = event.currentTarget.files;
    let file;
    let count = 0;
    const filetypes = ['image/jpg', 'image/jpeg', 'image/png'];
    for (var i = 0, ln = files.length; i < ln; i++) {
      file = files[i];
      if (file && file.size < IMG_SIZE_MAX && filetypes.includes(file.type)) {
        let fsFile = new FS.File(file);
        fsFile.owner = Meteor.userId();
        fsFile.imageOf = templateInstance.uploadType.get();
        Images.insert(fsFile, function(err, fileObj) {
          count++;
        });
      }
    }
  }
});
