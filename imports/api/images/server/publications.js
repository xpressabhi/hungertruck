import {Images}  from '../images.js';

Meteor.publish("allImagesByType", function(type){
  check(type,String);
  const options={sort:{uploadedAt:-1},limit:60};
  return Images.find({$or:[{owner:this.userId},{imageOf:type}]},options);
});

Meteor.publish("allImages", function(){
  const options={sort:{uploadedAt:-1},limit:60};
  return Images.find({owner:this.userId},options);
});
